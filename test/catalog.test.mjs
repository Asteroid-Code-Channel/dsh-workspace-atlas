import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fetchRepositoryCatalog, installCatalogSkill, loadCatalog } from '../lib/catalog.js';

const fakeFetch = async (url) => {
  if (/^https:\/\/api\.github\.com\/repos\/[^/]+\/[^/]+$/.test(url)) {
    return { ok: true, json: async () => ({ default_branch: 'main', description: 'Demo skills' }) };
  }
  if (url.includes('/git/trees/')) {
    return {
      ok: true,
      json: async () => ({
        tree: [
          { type: 'blob', path: 'skills/demo/SKILL.md' },
          { type: 'blob', path: 'skills/demo/reference.md' },
          { type: 'blob', path: 'README.md' },
        ],
      }),
    };
  }
  if (url.startsWith('https://raw.githubusercontent.com/')) {
    return {
      ok: true,
      text: async () => (url.endsWith('reference.md') ? 'reference' : '# Demo\n'),
    };
  }
  return { ok: false, status: 404 };
};

const repo = await fetchRepositoryCatalog({ id: 'demo', title: 'Demo', repository: 'example/skills' }, fakeFetch);
assert.equal(repo.branch, 'main');
assert.equal(repo.skills.length, 1);
assert.equal(repo.skills[0].name, 'demo');
assert.equal(repo.skills[0].files.length, 2);

const cacheDir = path.join(process.cwd(), '.tmp-catalog-test');
const cachePath = path.join(cacheDir, 'catalog.json');
await fs.rm(cacheDir, { recursive: true, force: true });
const catalog = await loadCatalog({ cachePath, fetchImpl: fakeFetch, force: true });
assert.equal(catalog.repositories.length, 4);
assert.equal(catalog.repositories[0].id, 'anthropic');
assert.equal(catalog.repositories[0].skills[0].name, 'demo');
assert.equal((await fs.stat(cachePath)).isFile(), true);

const installed = await installCatalogSkill({
  cachePath,
  repoId: 'anthropic',
  skillPath: 'skills/demo/SKILL.md',
  fetchImpl: fakeFetch,
});
assert.equal(installed.name, 'demo');
assert.equal(installed.files.length, 2);

await fs.rm(cacheDir, { recursive: true, force: true });
console.log('agents-manager catalog tests passed');
