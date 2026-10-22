import { promises as fs } from 'node:fs';
import path from 'node:path';

export const CATALOG_REPOSITORIES = [
  { id: 'anthropic', title: 'Anthropic', repository: 'anthropics/skills' },
  { id: 'openai', title: 'OpenAI', repository: 'openai/skills' },
  { id: 'cursor', title: 'Cursor', repository: 'cursor/plugins' },
  { id: 'mattpocock', title: 'Matt Pocock', repository: 'mattpocock/skills' },
];

const CACHE_MAX_AGE_MS = 5 * 60 * 1000;
const MAX_SKILL_FILES = 120;

async function fetchJson(url, fetchImpl, timeoutMs = 15000) {
  const response = await fetchImpl(url, {
    headers: {
      accept: 'application/vnd.github+json',
      'user-agent': 'dsh-workspace-atlas-catalog',
    },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`GitHub request failed (HTTP ${response.status})`);
  return response.json();
}

function skillNameFromPath(skillPath) {
  const parts = skillPath.split('/');
  return parts.at(-2) || parts.at(-1) || 'skill';
}

export async function fetchRepositoryCatalog(meta, fetchImpl = fetch) {
  const repo = await fetchJson(`https://api.github.com/repos/${meta.repository}`, fetchImpl);
  const branch = repo.default_branch || 'main';
  const tree = await fetchJson(
    `https://api.github.com/repos/${meta.repository}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    fetchImpl,
    25000,
  );
  const blobs = (tree.tree || []).filter((item) => item.type === 'blob');
  const skills = blobs
    .filter((item) => item.path === 'SKILL.md' || item.path.endsWith('/SKILL.md'))
    .map((item) => {
      const directory = item.path === 'SKILL.md' ? '' : item.path.slice(0, -'SKILL.md'.length).replace(/\/$/, '');
      const files = directory
        ? blobs.filter((blob) => blob.path.startsWith(`${directory}/`)).slice(0, MAX_SKILL_FILES)
        : [item];
      return {
        name: skillNameFromPath(item.path),
        path: item.path,
        directory,
        files: files.map((file) => ({
          path: directory ? file.path.slice(directory.length + 1) : file.path,
          repoPath: file.path,
        })),
        repoUrl: `https://github.com/${meta.repository}/tree/${branch}${directory ? `/${directory}` : ''}`,
        skillUrl: `https://github.com/${meta.repository}/blob/${branch}/${item.path}`,
      };
    })
    .filter((skill) => skill.files.length > 0 && skill.files.some((file) => file.path === 'SKILL.md'))
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    ...meta,
    branch,
    description: repo.description || '',
    url: `https://github.com/${meta.repository}`,
    skills,
    syncedAt: new Date().toISOString(),
  };
}

export async function loadCatalog({ cachePath, fetchImpl = fetch, force = false }) {
  let cached = null;
  try {
    const raw = await fs.readFile(cachePath, 'utf8');
    cached = JSON.parse(raw);
  } catch {
    cached = null;
  }

  const cacheAge = cached?.fetchedAt ? Date.now() - Date.parse(cached.fetchedAt) : Infinity;
  if (!force && cached && Number.isFinite(cacheAge) && cacheAge < CACHE_MAX_AGE_MS) {
    return { ...cached, fromCache: true };
  }

  const previous = new Map((cached?.repositories || []).map((repo) => [repo.id, repo]));
  const repositories = await Promise.all(CATALOG_REPOSITORIES.map(async (meta) => {
    try {
      return await fetchRepositoryCatalog(meta, fetchImpl);
    } catch (error) {
      const old = previous.get(meta.id);
      return {
        ...meta,
        ...(old || {}),
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }));
  const fetchedAt = new Date().toISOString();
  const result = { repositories, fetchedAt, fromCache: false };
  try {
    await fs.mkdir(path.dirname(cachePath), { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify(result), 'utf8');
  } catch {
    // The catalog still works for this request without a persistent cache.
  }
  return result;
}

export async function installCatalogSkill({ cachePath, repoId, skillPath, fetchImpl = fetch }) {
  const catalog = await loadCatalog({ cachePath, fetchImpl, force: false });
  const repository = (catalog.repositories || []).find((repo) => repo.id === repoId);
  if (!repository) throw new Error('Unknown skill repository.');
  if (repository.error) throw new Error(repository.error);
  const skill = (repository.skills || []).find((item) => item.path === skillPath);
  if (!skill) throw new Error('The selected skill is not in the current catalog.');

  const files = [];
  let total = 0;
  for (const file of skill.files) {
    const encoded = file.repoPath.split('/').map(encodeURIComponent).join('/');
    const response = await fetchImpl(
      `https://raw.githubusercontent.com/${repository.repository}/${encodeURIComponent(repository.branch)}/${encoded}`,
      { signal: AbortSignal.timeout(20000) },
    );
    if (!response.ok) throw new Error(`Skill file download failed (HTTP ${response.status}).`);
    const content = await response.text();
    total += Buffer.byteLength(content, 'utf8');
    if (total > 10 * 1024 * 1024) throw new Error('The skill is larger than the installation limit.');
    files.push({ path: file.path, content });
  }
  return {
    name: skill.name,
    files,
    repository: repository.repository,
    repoUrl: skill.repoUrl,
  };
}
