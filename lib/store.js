import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { normalizeSkillDefinition, parseSkill, serializeSkill, SkillSpecError, validateSkillName } from './skill.js';

export const ALLOWED_FILE_NAMES = new Set(['AGENTS.md', 'AGENTS.local.md']);
export const SKILL_FILE_NAME = 'SKILL.md';
export const MANAGED_FILE_NAMES = new Set([...ALLOWED_FILE_NAMES, SKILL_FILE_NAME]);
export const SKILLS_DIRECTORY = '.dsh/skills';
export const GLOBAL_SKILLS_ID = '__global__';
export const MAX_FILE_BYTES = 2 * 1024 * 1024;
export const MAX_SKILLS = 200;
const MAX_SCAN_DEPTH = 8;
const MAX_SCAN_FILES = 400;
const DEFAULT_WORKSPACE_ID = '__default__';
const SKIP_DIRECTORIES = new Set([
  '.git',
  '.hg',
  '.svn',
  '.cache',
  '.dsh',
  '.idea',
  '.vscode',
  '.next',
  '.nuxt',
  '.output',
  '.tox',
  '.venv',
  '__pycache__',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'out',
  'target',
  'vendor',
  'venv',
]);

export class AgentsStoreError extends Error {
  constructor(message, { statusCode = 500, code = 'error.internal', details } = {}) {
    super(message);
    this.name = 'AgentsStoreError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

function fail(statusCode, code, message) {
  throw new AgentsStoreError(message, { statusCode, code });
}

function normalizeForComparison(value) {
  const resolved = path.resolve(value);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function isInside(root, candidate) {
  const rel = path.relative(root, candidate);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function normalizeRelativePath(input, allowedNames = ALLOWED_FILE_NAMES) {
  if (typeof input !== 'string' || input.trim() === '') {
    fail(400, 'error.invalidPath', 'A workspace-relative path is required.');
  }
  if (input.includes('\0')) fail(400, 'error.invalidPath', 'The path contains a NUL character.');
  const normalized = input.replaceAll('\\', '/').replace(/^\/+/, '');
  if (/^[A-Za-z]:/.test(normalized)) fail(400, 'error.invalidPath', 'Absolute paths are not accepted.');
  const parts = normalized.split('/');
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    fail(400, 'error.invalidPath', 'The path must stay inside the workspace.');
  }
  const name = parts.at(-1);
  if (!allowedNames.has(name)) {
    fail(400, 'error.invalidFileName', 'Only AGENTS.md, AGENTS.local.md and SKILL.md can be managed.');
  }
  return parts.join('/');
}

function normalizeSkillName(input) {
  if (typeof input !== 'string') return '';
  const name = input.trim();
  if (!name) return '';
  if (name.length > 80 || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name) || name === '.' || name === '..') {
    fail(400, 'error.invalidSkillName', 'Skill names may contain letters, numbers, dots, underscores, and hyphens.');
  }
  return name;
}

function inferSkillName(url) {
  const parts = url.pathname.split('/').filter(Boolean);
  const base = parts.at(-1) || 'skill';
  const parent = parts.at(-2) || '';
  const raw = base.toLowerCase() === 'skill.md' ? parent : base.replace(/\.md$/i, '');
  const safe = raw.replace(/[^A-Za-z0-9._-]/g, '-').replace(/^-+|-+$/g, '');
  return safe || 'skill';
}

function normalizeSkillRelativePath(input) {
  if (typeof input !== 'string' || input.trim() === '') {
    fail(400, 'error.invalidPath', 'A skill-relative path is required.');
  }
  if (input.includes('\0')) fail(400, 'error.invalidPath', 'The path contains a NUL character.');
  const normalized = input.replaceAll('\\', '/').replace(/^\/+/, '');
  if (/^[A-Za-z]:/.test(normalized)) fail(400, 'error.invalidPath', 'Absolute paths are not accepted.');
  const parts = normalized.split('/');
  if (parts.length > 8 || normalized.length > 240) {
    fail(400, 'error.invalidPath', 'The skill path is too long or too deeply nested.');
  }
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    fail(400, 'error.invalidPath', 'The path must stay inside the skill directory.');
  }
  if (parts.join('/') === SKILL_FILE_NAME) {
    fail(400, 'error.invalidPath', 'Edit the root SKILL.md through the skill form.');
  }
  return parts.join('/');
}

async function assertNoSymlink(root, relative) {
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    const stat = await fs.lstat(current).catch(() => null);
    if (!stat) return;
    if (stat.isSymbolicLink()) {
      fail(403, 'error.outsideSkill', 'The skill path traverses a symbolic link.');
    }
  }
}

function normalizeText(value) {
  return value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function detectEol(value) {
  return value.includes('\r\n') ? '\r\n' : '\n';
}

function isBom(buffer) {
  return buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
}

async function statOrNull(target) {
  try {
    return await fs.stat(target);
  } catch (error) {
    if (error && error.code === 'ENOENT') return null;
    throw error;
  }
}

async function realpathOrNull(target) {
  try {
    return await fs.realpath(target);
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) return null;
    throw error;
  }
}

function toIso(stat) {
  return stat ? new Date(stat.mtimeMs).toISOString() : null;
}

function targetKey(target) {
  if (!target || typeof target !== 'object') return '';
  if (target.scope === 'global') {
    return target.skillName ? `global:skill:${target.skillName}` : 'global';
  }
  if (target.scope === 'workspace') {
    const suffix = target.skillName
      ? `skill:${target.skillName}`
      : target.file || target.relativePath || '';
    return `workspace:${target.workspaceId}:${suffix}`;
  }
  return '';
}

export class AgentsStore {
  constructor({ dshHome, getWorkspaceRegistry, getDefaultDirectory }) {
    this.homePath = dshHome;
    this.getWorkspaceRegistry = getWorkspaceRegistry;
    this.getDefaultDirectory = getDefaultDirectory;
  }

  globalPath() {
    return path.join(this.dshHome(), 'AGENTS.md');
  }

  dshHome() {
    return path.resolve(this.resolveDshHome());
  }

  resolveDshHome() {
    const configured = typeof this.homePath === 'string' ? this.homePath.trim() : '';
    if (configured) return configured;
    return path.join(process.env.USERPROFILE || process.env.HOME || '.', '.dsh');
  }

  listWorkspaces() {
    const result = new Map();
    const registry = this.getWorkspaceRegistry?.();
    const push = (entry) => {
      if (!entry || typeof entry.path !== 'string' || entry.path.trim() === '') return;
      const key = normalizeForComparison(entry.path);
      if (result.has(key)) return;
      result.set(key, entry);
    };

    try {
      if (registry && typeof registry.list === 'function') {
        for (const workspace of registry.list()) {
          const workspacePath = typeof workspace?.path === 'string' ? workspace.path : undefined;
          if (!workspacePath) continue;
          push({
            id: String(workspace.id),
            title: typeof workspace.title === 'string' && workspace.title.trim()
              ? workspace.title.trim()
              : path.basename(workspacePath),
            path: workspacePath,
            source: 'registry',
          });
        }
      }
    } catch {
      // The UI can still work with the default directory when the registry is unavailable.
    }

    let fallback;
    try {
      fallback = this.getDefaultDirectory?.();
    } catch {
      fallback = undefined;
    }
    if (typeof fallback === 'string' && fallback.trim()) {
      push({
        id: DEFAULT_WORKSPACE_ID,
        title: path.basename(path.resolve(fallback)) || fallback,
        path: path.resolve(fallback),
        source: 'default',
      });
    }

    return [...result.values()];
  }

  findWorkspace(workspaceId) {
    if (workspaceId === GLOBAL_SKILLS_ID) return this.globalWorkspace();
    return this.listWorkspaces().find((workspace) => workspace.id === workspaceId);
  }

  globalWorkspace() {
    return {
      id: GLOBAL_SKILLS_ID,
      title: 'Global',
      path: this.dshHome(),
      source: 'global',
      global: true,
    };
  }

  skillsDirectoryFor(workspace) {
    return workspace.global
      ? path.join(this.dshHome(), 'skills')
      : path.join(workspace.path, '.dsh', 'skills');
  }

  async resolveTarget(target) {
    const key = targetKey(target);
    if (!key) fail(400, 'error.invalidTarget', 'A valid target is required.');

    if (target.scope === 'global') {
      const skillName = normalizeSkillName(target.skillName);
      if (skillName) {
        const hostPath = path.join(this.dshHome(), 'skills', skillName, SKILL_FILE_NAME);
        return {
          kind: 'global',
          target: { scope: 'global', skillName },
          path: hostPath,
          displayPath: platformDisplayPath(hostPath),
          root: this.dshHome(),
          relativePath: `skills/${skillName}/${SKILL_FILE_NAME}`,
          fileKind: 'skill',
          skillName,
          workspace: null,
        };
      }
      return {
        kind: 'global',
        target: { scope: 'global' },
        path: this.globalPath(),
        displayPath: this.globalPath(),
        root: this.dshHome(),
        relativePath: null,
        workspace: null,
      };
    }

    const workspace = this.findWorkspace(target.workspaceId);
    if (!workspace) fail(404, 'error.workspaceNotFound', 'The workspace is no longer registered.');

    const nativeSkillName = normalizeSkillName(target.skillName);
    const legacySkillTarget = target.file === 'skill' && !nativeSkillName;
    const hasRelativePath = typeof target.relativePath === 'string' && target.relativePath.trim() !== '';
    const relativePath = nativeSkillName
      ? `${SKILLS_DIRECTORY}/${nativeSkillName}/${SKILL_FILE_NAME}`
      : legacySkillTarget
        ? SKILL_FILE_NAME
        : hasRelativePath
          ? normalizeRelativePath(target.relativePath)
          : 'AGENTS.md';
    const fileKind = nativeSkillName || legacySkillTarget ? 'skill' : 'agents';
    const workspaceTarget = nativeSkillName
      ? { scope: 'workspace', workspaceId: workspace.id, skillName: nativeSkillName }
      : legacySkillTarget || !hasRelativePath
        ? { scope: 'workspace', workspaceId: workspace.id, file: fileKind }
        : { scope: 'workspace', workspaceId: workspace.id, relativePath };

    let rootReal;
    try {
      rootReal = await fs.realpath(workspace.path);
    } catch {
      fail(409, 'error.workspaceUnavailable', 'The workspace directory is unavailable.');
    }

    const candidate = path.resolve(rootReal, relativePath);
    if (!isInside(rootReal, candidate)) {
      fail(403, 'error.outsideWorkspace', 'The target is outside the workspace.');
    }

    const parentReal = await realpathOrNull(path.dirname(candidate));
    if (!parentReal) {
      fail(409, 'error.parentMissing', 'The parent directory does not exist.');
    }
    const parentStat = await statOrNull(parentReal);
    if (!parentStat || !parentStat.isDirectory()) {
      fail(409, 'error.parentMissing', 'The parent directory does not exist.');
    }
    if (!isInside(rootReal, parentReal)) {
      fail(403, 'error.outsideWorkspace', 'The target is outside the workspace.');
    }

    const existingReal = await realpathOrNull(candidate);
    if (existingReal && !isInside(rootReal, existingReal)) {
      fail(403, 'error.outsideWorkspace', 'The target resolves outside the workspace.');
    }

    const hostPath = existingReal ?? path.join(parentReal, path.basename(candidate));
    return {
      kind: 'workspace',
      target: workspaceTarget,
      path: hostPath,
      displayPath: platformDisplayPath(hostPath),
      root: rootReal,
      relativePath,
      fileKind,
      skillName: nativeSkillName || null,
      workspace,
    };
  }

  async metaFor(target) {
    const resolved = await this.resolveTarget(target);
    const stat = await statOrNull(resolved.path);
    return {
      target: resolved.target,
      path: resolved.displayPath,
      hostPath: resolved.path,
      relativePath: resolved.relativePath,
      name: path.basename(resolved.path),
      scope: resolved.kind,
      fileKind: resolved.fileKind || 'agents',
      skillName: resolved.skillName || null,
      workspaceId: resolved.workspace?.id ?? null,
      workspaceTitle: resolved.workspace?.title ?? null,
      exists: Boolean(stat?.isFile()),
      isDirectory: Boolean(stat?.isDirectory()),
      size: stat?.isFile() ? stat.size : 0,
      mtimeMs: stat?.isFile() ? stat.mtimeMs : null,
      modifiedAt: stat?.isFile() ? toIso(stat) : null,
    };
  }

  missingWorkspaceFileMeta(workspace, relativePath, fileKind = 'agents') {
    const target = fileKind === 'skill'
      ? { scope: 'workspace', workspaceId: workspace.id, file: 'skill' }
      : { scope: 'workspace', workspaceId: workspace.id, file: 'agents' };
    const hostPath = path.join(workspace.path, relativePath);
    return {
      target,
      path: platformDisplayPath(hostPath),
      hostPath,
      relativePath,
      name: relativePath,
      scope: 'workspace',
      fileKind,
      workspaceId: workspace.id,
      workspaceTitle: workspace.title,
      exists: false,
      isDirectory: false,
      size: 0,
      mtimeMs: null,
      modifiedAt: null,
    };
  }

  async scanNativeSkills(workspace) {
    const directory = this.skillsDirectoryFor(workspace);
    let entries;
    try {
      entries = await fs.readdir(directory, { withFileTypes: true });
    } catch {
      return [];
    }

    const skills = [];
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      if (skills.length >= MAX_SKILLS) break;
      if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
      const skillName = entry.name;
      if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(skillName)) continue;
      const hostPath = path.join(directory, skillName, SKILL_FILE_NAME);
      let stat;
      try {
        stat = await fs.stat(hostPath);
      } catch {
        continue;
      }
      if (!stat.isFile()) continue;
      skills.push({
        target: workspace.global
          ? { scope: 'global', skillName }
          : { scope: 'workspace', workspaceId: workspace.id, skillName },
        path: platformDisplayPath(hostPath),
        hostPath,
        relativePath: workspace.global
          ? `skills/${skillName}/${SKILL_FILE_NAME}`
          : `${SKILLS_DIRECTORY}/${skillName}/${SKILL_FILE_NAME}`,
        name: SKILL_FILE_NAME,
        skillName,
        scope: workspace.global ? 'global' : 'workspace',
        fileKind: 'skill',
        workspaceId: workspace.global ? null : workspace.id,
        workspaceTitle: workspace.title,
        exists: true,
        isDirectory: false,
        size: stat.size,
        mtimeMs: stat.mtimeMs,
        modifiedAt: toIso(stat),
      });
    }
    return skills;
  }

  async snapshot() {
    const globalMeta = await this.metaFor({ scope: 'global' });
    const workspaces = await Promise.all(this.listWorkspaces().map(async (workspace) => {
      let available = false;
      try {
        const stat = await fs.stat(workspace.path);
        available = stat.isDirectory();
      } catch {
        available = false;
      }

      const files = available ? await this.scanWorkspace(workspace) : [];
      let agents = files.find((file) => file.relativePath === 'AGENTS.md');
      if (!agents) {
        agents = await this.metaFor({
          scope: 'workspace',
          workspaceId: workspace.id,
          file: 'agents',
        }).catch(() => this.missingWorkspaceFileMeta(workspace, 'AGENTS.md', 'agents'));
        files.unshift(agents);
      }

      const skill = await this.metaFor({
        scope: 'workspace',
        workspaceId: workspace.id,
        file: 'skill',
      }).catch(() => this.missingWorkspaceFileMeta(workspace, SKILL_FILE_NAME, 'skill'));
      const skills = available ? await this.scanNativeSkills(workspace) : [];
      const skillCount = skills.length + (skill.exists ? 1 : 0);

      return {
        id: workspace.id,
        title: workspace.title,
        path: platformDisplayPath(workspace.path),
        hostPath: workspace.path,
        source: workspace.source,
        available,
        agents,
        skill,
        skills,
        skillCount,
        skillExists: skillCount > 0,
        files,
      };
    }));

    const globalSkills = await this.scanNativeSkills(this.globalWorkspace());
    return {
      home: platformDisplayPath(this.dshHome()),
      global: globalMeta,
      globalSkills,
      globalSkillCount: globalSkills.length,
      workspaces,
      generatedAt: new Date().toISOString(),
    };
  }

  async scanWorkspace(workspace) {
    const root = workspace.path;
    const found = new Map();
    let warnings = 0;

    const walk = async (directory, depth) => {
      if (found.size >= MAX_SCAN_FILES) return;
      let entries;
      try {
        entries = await fs.readdir(directory, { withFileTypes: true });
      } catch {
        warnings += 1;
        return;
      }

      entries.sort((a, b) => a.name.localeCompare(b.name));
      for (const entry of entries) {
        if (found.size >= MAX_SCAN_FILES) return;
        if (entry.isSymbolicLink()) continue;
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          if (depth >= MAX_SCAN_DEPTH || SKIP_DIRECTORIES.has(entry.name)) continue;
          await walk(absolute, depth + 1);
          continue;
        }
        if (!entry.isFile() || !ALLOWED_FILE_NAMES.has(entry.name)) continue;

        let stat;
        try {
          stat = await fs.stat(absolute);
        } catch {
          warnings += 1;
          continue;
        }
        const relativePath = path.relative(root, absolute).split(path.sep).join('/');
        found.set(relativePath, {
          target: {
            scope: 'workspace',
            workspaceId: workspace.id,
            relativePath,
          },
          path: platformDisplayPath(absolute),
          hostPath: absolute,
          relativePath,
          name: entry.name,
          scope: 'workspace',
          fileKind: 'agents',
          workspaceId: workspace.id,
          workspaceTitle: workspace.title,
          exists: true,
          isDirectory: false,
          size: stat.size,
          mtimeMs: stat.mtimeMs,
          modifiedAt: toIso(stat),
        });
      }
    };

    await walk(root, 0);

    return [...found.values()]
      .sort((left, right) => {
        if (left.relativePath === 'AGENTS.md') return -1;
        if (right.relativePath === 'AGENTS.md') return 1;
        if (left.name !== right.name && (left.name === 'AGENTS.md' || right.name === 'AGENTS.md')) {
          return left.name === 'AGENTS.md' ? -1 : 1;
        }
        return left.relativePath.localeCompare(right.relativePath);
      })
      .slice(0, MAX_SCAN_FILES)
      .map((file) => ({ ...file, warnings }));
  }

  async skillSnapshot(workspaceId) {
    const workspace = this.findWorkspace(workspaceId);
    if (!workspace) fail(404, 'error.workspaceNotFound', 'The workspace is no longer registered.');
    if (!workspace.available) {
      // The caller can still receive the legacy metadata for an unavailable root.
    }
    const skills = await this.scanNativeSkills(workspace);
    const legacy = workspace.global
      ? {
        target: { scope: 'global', file: 'skill' },
        path: platformDisplayPath(path.join(this.dshHome(), SKILL_FILE_NAME)),
        hostPath: path.join(this.dshHome(), SKILL_FILE_NAME),
        relativePath: SKILL_FILE_NAME,
        name: SKILL_FILE_NAME,
        scope: 'global',
        fileKind: 'skill',
        workspaceId: null,
        workspaceTitle: workspace.title,
        exists: false,
        isDirectory: false,
        size: 0,
        mtimeMs: null,
        modifiedAt: null,
      }
      : await this.metaFor({
        scope: 'workspace',
        workspaceId: workspace.id,
        file: 'skill',
      }).catch(() => this.missingWorkspaceFileMeta(workspace, SKILL_FILE_NAME, 'skill'));
    return {
      workspaceId: workspace.id,
      title: workspace.title,
      path: platformDisplayPath(workspace.path),
      hostPath: workspace.path,
      skills,
      legacy,
      count: skills.length + (legacy.exists ? 1 : 0),
    };
  }

  async createSkill(workspaceId, nameOrPayload, content) {
    const workspace = this.findWorkspace(workspaceId);
    if (!workspace) fail(404, 'error.workspaceNotFound', 'The workspace is no longer registered.');
    const structured = nameOrPayload && typeof nameOrPayload === 'object';
    let skillName;
    let skillContent;
    if (structured) {
      let normalized;
      try {
        normalized = normalizeSkillDefinition(nameOrPayload);
      } catch (error) {
        if (error instanceof SkillSpecError) fail(400, error.code, error.message);
        throw error;
      }
      skillName = normalized.fields.name;
      skillContent = serializeSkill({ ...normalized.fields, body: normalized.body, extra: normalized.extra });
    } else {
      skillName = normalizeSkillName(nameOrPayload);
      if (!skillName) fail(400, 'error.invalidSkillName', 'A skill name is required.');
      skillContent = typeof content === 'string'
        ? content
        : `# ${skillName}\n\nDescribe when this skill should be used.\n`;
    }
    const directory = path.join(this.skillsDirectoryFor(workspace), skillName);
    if (await statOrNull(directory)) {
      fail(409, 'error.skillExists', 'That skill already exists.');
    }
    await fs.mkdir(directory, { recursive: true });
    return this.saveDocument(workspace.global
      ? { scope: 'global', skillName }
      : { scope: 'workspace', workspaceId: workspace.id, skillName }, {
      content: skillContent,
      expectedMtimeMs: null,
      eol: '\n',
    });
  }

  async readSkill(workspaceId, name) {
    const skillName = normalizeSkillName(name);
    if (!skillName) fail(400, 'error.invalidSkillName', 'A skill name is required.');
    const workspace = this.findWorkspace(workspaceId);
    if (!workspace) fail(404, 'error.workspaceNotFound', 'The workspace is no longer registered.');
    const doc = await this.readDocument(workspace.global
      ? { scope: 'global', skillName }
      : { scope: 'workspace', workspaceId: workspace.id, skillName });
    const parsed = parseSkill(doc.content);
    return {
      ...doc,
      fields: parsed.fields,
      body: parsed.body,
      extra: parsed.extra,
      hasFrontmatter: parsed.hasFrontmatter,
    };
  }

  async saveSkill(workspaceId, name, payload = {}) {
    const workspace = this.findWorkspace(workspaceId);
    if (!workspace) fail(404, 'error.workspaceNotFound', 'The workspace is no longer registered.');
    const currentName = normalizeSkillName(name);
    if (!currentName) fail(400, 'error.invalidSkillName', 'A skill name is required.');
    const requestedName = typeof payload.name === 'string' && payload.name.trim()
      ? payload.name.trim()
      : currentName;
    const renaming = requestedName !== currentName;
    const nextName = requestedName;
    let validateName = true;
    if (renaming) {
      try {
        validateSkillName(nextName);
      } catch (error) {
        if (error instanceof SkillSpecError) fail(400, error.code, error.message);
        throw error;
      }
    } else {
      try {
        validateSkillName(nextName);
      } catch {
        validateName = false;
      }
    }
    let normalized;
    try {
      normalized = normalizeSkillDefinition({ ...payload, name: nextName }, { validateName });
    } catch (error) {
      if (error instanceof SkillSpecError) fail(400, error.code, error.message);
      throw error;
    }
    const content = serializeSkill(
      { ...normalized.fields, body: normalized.body, extra: normalized.extra },
      { validateName },
    );
    let context = null;
    let destination = null;
    if (renaming) {
      context = await this.skillDirectory(workspaceId, currentName);
      destination = path.join(context.base, nextName);
      if (!isInside(context.base, destination)) fail(403, 'error.outsideSkill', 'The new skill name is outside the skills directory.');
      if (await statOrNull(destination)) fail(409, 'error.skillExists', 'A skill with that name already exists.');
    }
    const oldTarget = workspace.global
      ? { scope: 'global', skillName: currentName }
      : { scope: 'workspace', workspaceId: workspace.id, skillName: currentName };
    const result = await this.saveDocument(oldTarget, {
      content,
      expectedMtimeMs: payload.expectedMtimeMs,
      eol: payload.eol || '\n',
      bom: payload.bom === true,
    });
    if (renaming) {
      await fs.rename(context.root, destination);
    }
    const newHostPath = path.join(context?.base || this.skillsDirectoryFor(workspace), nextName, SKILL_FILE_NAME);
    return {
      ...result,
      ...(renaming ? {
        target: workspace.global
          ? { scope: 'global', skillName: nextName }
          : { scope: 'workspace', workspaceId: workspace.id, skillName: nextName },
        path: platformDisplayPath(newHostPath),
        hostPath: newHostPath,
        relativePath: workspace.global
          ? `skills/${nextName}/${SKILL_FILE_NAME}`
          : `${SKILLS_DIRECTORY}/${nextName}/${SKILL_FILE_NAME}`,
      } : {}),
      fields: normalized.fields,
      body: normalized.body,
      hasFrontmatter: true,
      skillName: nextName,
      renamed: renaming,
    };
  }

  async renameSkillFolder(workspaceId, name, nextName) {
    const currentName = normalizeSkillName(name);
    if (!currentName) fail(400, 'error.invalidSkillName', 'A skill name is required.');
    let targetName;
    try {
      targetName = validateSkillName(nextName);
    } catch (error) {
      if (error instanceof SkillSpecError) fail(400, error.code, error.message);
      throw error;
    }
    if (targetName === currentName) return { renamed: false, skillName: currentName };
    const context = await this.skillDirectory(workspaceId, currentName);
    const destination = path.join(context.base, targetName);
    if (!isInside(context.base, destination)) fail(403, 'error.outsideSkill', 'The new skill name is outside the skills directory.');
    if (await statOrNull(destination)) fail(409, 'error.skillExists', 'A skill with that name already exists.');
    const workspace = context.workspace;
    const oldTarget = workspace.global
      ? { scope: 'global', skillName: currentName }
      : { scope: 'workspace', workspaceId: workspace.id, skillName: currentName };
    const doc = await this.readDocument(oldTarget);
    const parsed = parseSkill(doc.content);
    let content = doc.content;
    if (parsed.hasFrontmatter && parsed.fields.description) {
      const normalized = normalizeSkillDefinition({
        ...parsed.fields,
        name: targetName,
        body: parsed.body,
        extra: parsed.extra,
      });
      content = serializeSkill({ ...normalized.fields, body: normalized.body, extra: normalized.extra });
    }
    await this.saveDocument(oldTarget, {
      content,
      expectedMtimeMs: doc.mtimeMs,
      eol: doc.eol,
      bom: doc.bom,
    });
    await fs.rename(context.root, destination);
    const hostPath = path.join(context.base, targetName, SKILL_FILE_NAME);
    return {
      renamed: true,
      skillName: targetName,
      path: platformDisplayPath(hostPath),
      hostPath,
      relativePath: workspace.global
        ? `skills/${targetName}/${SKILL_FILE_NAME}`
        : `${SKILLS_DIRECTORY}/${targetName}/${SKILL_FILE_NAME}`,
    };
  }

  async importSkill(workspaceId, { name, url } = {}) {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      fail(400, 'error.invalidUrl', 'A http(s) skill URL is required.');
    }
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      fail(400, 'error.invalidUrl', 'The skill URL is invalid.');
    }
    const inferred = name && String(name).trim()
      ? String(name).trim()
      : inferSkillName(parsed);
    let response;
    try {
      response = await fetch(parsed, {
        headers: { accept: 'text/plain, text/markdown, */*' },
        signal: AbortSignal.timeout(12000),
      });
    } catch (error) {
      fail(502, 'error.skillDownload', `Skill download failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (!response.ok) fail(502, 'error.skillDownload', `Skill download failed (HTTP ${response.status}).`);
    const text = await response.text();
    if (Buffer.byteLength(text, 'utf8') > MAX_FILE_BYTES) {
      fail(413, 'error.tooLarge', `The skill content is larger than ${MAX_FILE_BYTES} bytes.`);
    }
    return this.createSkill(workspaceId, inferred, text);
  }

  async deleteSkill(workspaceId, name) {
    const workspace = this.findWorkspace(workspaceId);
    if (!workspace) fail(404, 'error.workspaceNotFound', 'The workspace is no longer registered.');
    const skillName = normalizeSkillName(name);
    if (!skillName) fail(400, 'error.invalidSkillName', 'A skill name is required.');
    const root = await fs.realpath(workspace.path).catch(() => {
      fail(409, 'error.workspaceUnavailable', 'The workspace directory is unavailable.');
    });
    const source = path.join(this.skillsDirectoryFor(workspace), skillName);
    if (!isInside(root, source)) fail(403, 'error.outsideWorkspace', 'The skill is outside the workspace.');
    const stat = await statOrNull(source);
    if (!stat) return { deleted: false, name: skillName };
    if (!stat.isDirectory()) fail(400, 'error.notDirectory', 'The skill path is not a directory.');
    const trash = path.join(
      this.dshHome(),
      'workspace-atlas',
      'trash',
      `${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}-${skillName}`,
    );
    await fs.mkdir(path.dirname(trash), { recursive: true });
    await fs.cp(source, trash, { recursive: true, force: false, errorOnExist: true });
    await fs.rm(source, { recursive: true, force: true });
    return { deleted: true, name: skillName, trashPath: platformDisplayPath(trash) };
  }

  libraryRoot() {
    return path.join(this.dshHome(), 'workspace-atlas', 'skills');
  }

  async librarySnapshot() {
    const root = this.libraryRoot();
    let entries;
    try {
      entries = await fs.readdir(root, { withFileTypes: true });
    } catch {
      return { path: platformDisplayPath(root), skills: [] };
    }
    const skills = [];
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
      const hostPath = path.join(root, entry.name, SKILL_FILE_NAME);
      let stat;
      try {
        stat = await fs.stat(hostPath);
      } catch {
        continue;
      }
      if (!stat.isFile()) continue;
      skills.push({
        name: entry.name,
        path: platformDisplayPath(hostPath),
        hostPath,
        size: stat.size,
        mtimeMs: stat.mtimeMs,
        modifiedAt: toIso(stat),
      });
    }
    return { path: platformDisplayPath(root), skills };
  }

  async saveSkillToLibrary(workspaceId, name) {
    const workspace = this.findWorkspace(workspaceId);
    if (!workspace) fail(404, 'error.workspaceNotFound', 'The workspace is no longer registered.');
    const skillName = normalizeSkillName(name);
    if (!skillName) fail(400, 'error.invalidSkillName', 'A skill name is required.');
    const root = await fs.realpath(workspace.path).catch(() => {
      fail(409, 'error.workspaceUnavailable', 'The workspace directory is unavailable.');
    });
    const source = path.join(this.skillsDirectoryFor(workspace), skillName);
    if (!isInside(root, source)) fail(403, 'error.outsideWorkspace', 'The skill is outside the workspace.');
    const stat = await statOrNull(source);
    if (!stat?.isDirectory()) fail(404, 'error.skillNotFound', 'The skill was not found.');
    const destination = path.join(this.libraryRoot(), skillName);
    if (await statOrNull(destination)) {
      fail(409, 'error.libraryExists', 'That skill already exists in the library.');
    }
    await fs.mkdir(this.libraryRoot(), { recursive: true });
    await fs.cp(source, destination, { recursive: true, force: false, errorOnExist: true });
    return { saved: true, name: skillName, path: platformDisplayPath(destination) };
  }

  async installSkillFromLibrary(workspaceId, name) {
    const workspace = this.findWorkspace(workspaceId);
    if (!workspace) fail(404, 'error.workspaceNotFound', 'The workspace is no longer registered.');
    const skillName = normalizeSkillName(name);
    if (!skillName) fail(400, 'error.invalidSkillName', 'A skill name is required.');
    const source = path.join(this.libraryRoot(), skillName);
    const stat = await statOrNull(source);
    if (!stat?.isDirectory()) fail(404, 'error.skillNotFound', 'The library skill was not found.');
    const root = await fs.realpath(workspace.path).catch(() => {
      fail(409, 'error.workspaceUnavailable', 'The workspace directory is unavailable.');
    });
    const destination = path.join(this.skillsDirectoryFor(workspace), skillName);
    if (!isInside(root, destination)) fail(403, 'error.outsideWorkspace', 'The skill is outside the workspace.');
    if (await statOrNull(destination)) {
      fail(409, 'error.skillExists', 'That skill already exists in the workspace.');
    }
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.cp(source, destination, { recursive: true, force: false, errorOnExist: true });
    return { installed: true, name: skillName, path: platformDisplayPath(destination) };
  }

  async installSkillFiles(workspaceId, name, files) {
    const workspace = this.findWorkspace(workspaceId);
    if (!workspace) fail(404, 'error.workspaceNotFound', 'The workspace is no longer registered.');
    const skillName = normalizeSkillName(name);
    if (!skillName) fail(400, 'error.invalidSkillName', 'A skill name is required.');
    if (!Array.isArray(files) || files.length === 0) {
      fail(400, 'error.invalidSkillFiles', 'The skill has no files.');
    }
    const directory = this.skillsDirectoryFor(workspace);
    const destination = path.join(directory, skillName);
    if (await statOrNull(destination)) {
      fail(409, 'error.skillExists', 'That skill already exists in the target.');
    }
    await fs.mkdir(directory, { recursive: true });
    const temp = path.join(directory, `.install-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    try {
      await fs.mkdir(temp, { recursive: true });
      let total = 0;
      for (const file of files) {
        const relative = String(file?.path || '').replaceAll('\\', '/');
        if (!relative || relative.startsWith('/') || relative.split('/').some((part) => part === '..' || part === '')) {
          fail(400, 'error.invalidSkillFiles', 'The skill contains an unsafe file path.');
        }
        const content = String(file.content ?? '');
        total += Buffer.byteLength(content, 'utf8');
        if (total > MAX_FILE_BYTES * 10) {
          fail(413, 'error.tooLarge', 'The skill is larger than the installation limit.');
        }
        const target = path.join(temp, relative);
        if (!isInside(temp, target)) fail(403, 'error.outsideWorkspace', 'The skill file is outside the target.');
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, content, 'utf8');
      }
      await fs.rename(temp, destination);
    } catch (error) {
      await fs.rm(temp, { recursive: true, force: true }).catch(() => {});
      throw error;
    }
    return this.metaFor(workspace.global
      ? { scope: 'global', skillName }
      : { scope: 'workspace', workspaceId: workspace.id, skillName });
  }

  async skillDirectory(workspaceId, name) {
    const workspace = this.findWorkspace(workspaceId);
    if (!workspace) fail(404, 'error.workspaceNotFound', 'The workspace is no longer registered.');
    const skillName = normalizeSkillName(name);
    if (!skillName) fail(400, 'error.invalidSkillName', 'A skill name is required.');
    const base = this.skillsDirectoryFor(workspace);
    const baseReal = await fs.realpath(base).catch(() => {
      fail(404, 'error.skillNotFound', 'The skills directory was not found.');
    });
    const root = path.join(baseReal, skillName);
    if (!isInside(baseReal, root)) fail(403, 'error.outsideSkill', 'The skill is outside the skills directory.');
    const stat = await statOrNull(root);
    if (!stat?.isDirectory()) fail(404, 'error.skillNotFound', 'The skill was not found.');
    const rootReal = await fs.realpath(root);
    if (!isInside(baseReal, rootReal)) fail(403, 'error.outsideSkill', 'The skill resolves outside the skills directory.');
    return { workspace, skillName, base: baseReal, root: rootReal };
  }

  async resolveSkillFile(workspaceId, name, relativePath) {
    const context = await this.skillDirectory(workspaceId, name);
    const relative = normalizeSkillRelativePath(relativePath);
    await assertNoSymlink(context.root, relative);
    const candidate = path.resolve(context.root, relative);
    if (!isInside(context.root, candidate)) {
      fail(403, 'error.outsideSkill', 'The file is outside the skill directory.');
    }
    return { ...context, relative, path: candidate };
  }

  async listSkillFiles(workspaceId, name) {
    const context = await this.skillDirectory(workspaceId, name);
    const entries = [];
    async function walk(directory, prefix, depth) {
      if (depth > 8 || entries.length >= 500) return;
      let children;
      try {
        children = await fs.readdir(directory, { withFileTypes: true });
      } catch {
        return;
      }
      children.sort((left, right) => {
        if (left.isDirectory() !== right.isDirectory()) return left.isDirectory() ? -1 : 1;
        return left.name.localeCompare(right.name);
      });
      for (const child of children) {
        if (entries.length >= 500) break;
        if (child.isSymbolicLink()) continue;
        const relative = prefix ? `${prefix}/${child.name}` : child.name;
        if (!prefix && child.name === SKILL_FILE_NAME) continue;
        const hostPath = path.join(directory, child.name);
        const stat = await fs.stat(hostPath).catch(() => null);
        if (!stat) continue;
        entries.push({
          type: stat.isDirectory() ? 'directory' : 'file',
          name: child.name,
          relativePath: relative,
          size: stat.isFile() ? stat.size : 0,
          mtimeMs: stat.isFile() ? stat.mtimeMs : null,
          modifiedAt: stat.isFile() ? toIso(stat) : null,
        });
        if (stat.isDirectory()) await walk(hostPath, relative, depth + 1);
      }
    }
    await walk(context.root, '', 0);
    return {
      name: context.skillName,
      path: platformDisplayPath(context.root),
      hostPath: context.root,
      entries,
    };
  }

  async readSkillFile(workspaceId, name, relativePath) {
    const resolved = await this.resolveSkillFile(workspaceId, name, relativePath);
    const stat = await statOrNull(resolved.path);
    if (!stat) {
      return {
        path: platformDisplayPath(resolved.path),
        hostPath: resolved.path,
        relativePath: resolved.relative,
        name: path.basename(resolved.path),
        exists: false,
        isDirectory: false,
        content: '',
        eol: '\n',
        binary: false,
        mtimeMs: null,
      };
    }
    if (!stat.isFile()) fail(400, 'error.notFile', 'The selected path is not a file.');
    if (stat.size > MAX_FILE_BYTES) {
      fail(413, 'error.tooLarge', `The file is larger than ${MAX_FILE_BYTES} bytes.`);
    }
    const buffer = await fs.readFile(resolved.path);
    const binary = buffer.includes(0);
    return {
      path: platformDisplayPath(resolved.path),
      hostPath: resolved.path,
      relativePath: resolved.relative,
      name: path.basename(resolved.path),
      exists: true,
      isDirectory: false,
      content: binary ? '' : buffer.toString('utf8'),
      eol: detectEol(buffer.toString('utf8')),
      binary,
      size: stat.size,
      mtimeMs: stat.mtimeMs,
      modifiedAt: toIso(stat),
    };
  }

  async saveSkillFile(workspaceId, name, relativePath, content, expectedMtimeMs = null, createOnly = false) {
    const resolved = await this.resolveSkillFile(workspaceId, name, relativePath);
    const value = typeof content === 'string' ? content : '';
    if (Buffer.byteLength(value, 'utf8') > MAX_FILE_BYTES) {
      fail(413, 'error.tooLarge', `The file is larger than ${MAX_FILE_BYTES} bytes.`);
    }
    const current = await statOrNull(resolved.path);
    if (createOnly && current) fail(409, 'error.fileExists', 'That file already exists.');
    if (expectedMtimeMs != null) {
      if (!current) fail(409, 'error.stale', 'The file was removed before saving.');
      if (Math.abs(current.mtimeMs - Number(expectedMtimeMs)) > 1) {
        fail(409, 'error.stale', 'The file changed on disk before saving.');
      }
    }
    await fs.mkdir(path.dirname(resolved.path), { recursive: true });
    await assertNoSymlink(resolved.root, resolved.relative);
    await fs.writeFile(resolved.path, value, 'utf8');
    const stat = await fs.stat(resolved.path);
    return {
      path: platformDisplayPath(resolved.path),
      hostPath: resolved.path,
      relativePath: resolved.relative,
      name: path.basename(resolved.path),
      exists: true,
      isDirectory: false,
      size: stat.size,
      mtimeMs: stat.mtimeMs,
      modifiedAt: toIso(stat),
    };
  }

  async createSkillFolder(workspaceId, name, relativePath) {
    const resolved = await this.resolveSkillFile(workspaceId, name, relativePath);
    if (await statOrNull(resolved.path)) {
      fail(409, 'error.fileExists', 'That file or folder already exists.');
    }
    await fs.mkdir(resolved.path, { recursive: true });
    await assertNoSymlink(resolved.root, resolved.relative);
    const stat = await fs.stat(resolved.path);
    return {
      path: platformDisplayPath(resolved.path),
      hostPath: resolved.path,
      relativePath: resolved.relative,
      name: path.basename(resolved.path),
      type: 'directory',
      size: 0,
      mtimeMs: stat.mtimeMs,
      modifiedAt: toIso(stat),
    };
  }

  async deleteSkillFile(workspaceId, name, relativePath, { recursive = false } = {}) {
    const resolved = await this.resolveSkillFile(workspaceId, name, relativePath);
    const stat = await statOrNull(resolved.path);
    if (!stat) fail(404, 'error.fileNotFound', 'The skill file was not found.');
    if (stat.isDirectory() && recursive !== true) {
      fail(409, 'error.directoryNotEmpty', 'The folder must be deleted recursively.');
    }
    await fs.rm(resolved.path, { recursive: stat.isDirectory(), force: false });
    return {
      deleted: true,
      relativePath: resolved.relative,
      type: stat.isDirectory() ? 'directory' : 'file',
    };
  }

  async readDocument(target) {
    const resolved = await this.resolveTarget(target);
    const stat = await statOrNull(resolved.path);
    if (!stat) {
      return {
        ...(await this.metaFor(resolved.target)),
        content: '',
        eol: '\n',
        bom: false,
      };
    }
    if (!stat.isFile()) fail(400, 'error.notAFile', 'The target is not a regular file.');
    if (stat.size > MAX_FILE_BYTES) {
      fail(413, 'error.tooLarge', `The file is larger than ${MAX_FILE_BYTES} bytes.`);
    }

    const buffer = await fs.readFile(resolved.path);
    const bom = isBom(buffer);
    const raw = buffer.toString('utf8').replace(/^\uFEFF/, '');
    const eol = detectEol(raw);

    return {
      ...(await this.metaFor(resolved.target)),
      content: normalizeText(raw),
      eol,
      bom,
    };
  }

  async saveDocument(target, input = {}) {
    const resolved = await this.resolveTarget(target);
    const content = typeof input.content === 'string' ? input.content : '';
    if (Buffer.byteLength(content, 'utf8') > MAX_FILE_BYTES) {
      fail(413, 'error.tooLarge', `The content is larger than ${MAX_FILE_BYTES} bytes.`);
    }

    const stat = await statOrNull(resolved.path);
    this.assertExpectedVersion(resolved, stat, input.expectedMtimeMs);

    let previous = null;
    let previousEol = '\n';
    let previousBom = false;
    if (stat) {
      if (!stat.isFile()) fail(400, 'error.notAFile', 'The target is not a regular file.');
      previous = await fs.readFile(resolved.path);
      const raw = previous.toString('utf8').replace(/^\uFEFF/, '');
      previousEol = detectEol(raw);
      previousBom = isBom(previous);
    }

    const eol = input.eol === '\r\n' ? '\r\n' : input.eol === '\n' ? '\n' : previousEol;
    const useBom = input.bom === true || (input.bom === undefined && previousBom);
    const normalized = normalizeText(content);
    const output = (useBom ? '\uFEFF' : '') + normalized.replaceAll('\n', eol);

    await fs.mkdir(path.dirname(resolved.path), { recursive: true });
    const tempPath = path.join(
      path.dirname(resolved.path),
      `.${path.basename(resolved.path)}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`,
    );
    try {
      await fs.writeFile(tempPath, output, 'utf8');
      await fs.rename(tempPath, resolved.path);
    } catch (error) {
      await fs.rm(tempPath, { force: true }).catch(() => {});
      throw error;
    }

    let backupPath = null;
    if (previous && previous.toString('utf8') !== output) {
      backupPath = await this.backup(resolved.path, previous);
    }

    const nextStat = await fs.stat(resolved.path);
    return {
      ...(await this.metaFor(resolved.target)),
      mtimeMs: nextStat.mtimeMs,
      size: nextStat.size,
      modifiedAt: toIso(nextStat),
      backupPath: backupPath ? platformDisplayPath(backupPath) : null,
    };
  }

  async removeDocument(target, input = {}) {
    const resolved = await this.resolveTarget(target);
    const stat = await statOrNull(resolved.path);
    if (!stat) return { deleted: false, path: resolved.displayPath, backupPath: null };
    if (!stat.isFile()) fail(400, 'error.notAFile', 'The target is not a regular file.');
    this.assertExpectedVersion(resolved, stat, input.expectedMtimeMs);

    const previous = await fs.readFile(resolved.path);
    const backupPath = await this.backup(resolved.path, previous);
    await fs.unlink(resolved.path);
    return {
      deleted: true,
      path: resolved.displayPath,
      backupPath: platformDisplayPath(backupPath),
    };
  }

  assertExpectedVersion(resolved, stat, expected) {
    if (expected === undefined || expected === null) {
      if (stat) {
        fail(409, 'error.conflict', 'The file already exists. Reload it before saving.');
      }
      return;
    }
    if (!Number.isFinite(expected)) {
      fail(400, 'error.invalidVersion', 'The expected modification time is invalid.');
    }
    if (!stat) {
      fail(409, 'error.conflict', 'The file no longer exists. Reload the list before saving.');
    }
    if (Math.abs(stat.mtimeMs - expected) > 1) {
      fail(409, 'error.conflict', 'The file changed outside the editor. Reload it before saving.');
    }
  }

  async backup(filePath, buffer) {
    const folder = createHash('sha256').update(path.resolve(filePath)).digest('hex').slice(0, 24);
    const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
    const backupPath = path.join(this.dshHome(), 'agents-manager-backups', folder, `${stamp}.md`);
    await fs.mkdir(path.dirname(backupPath), { recursive: true });
    await fs.writeFile(backupPath, buffer);
    return backupPath;
  }
}

function platformDisplayPath(value) {
  return process.platform === 'win32' ? value.replaceAll('/', '\\') : value;
}
