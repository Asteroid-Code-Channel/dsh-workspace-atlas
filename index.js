import { readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AgentsStore, AgentsStoreError, GLOBAL_SKILLS_ID } from './lib/store.js';
import { inspectUpdate, normalizeTag, parseRepository } from './lib/update.js';
import { installCatalogSkill, loadCatalog } from './lib/catalog.js';

const ROUTE_PREFIX = '/api/dsh-agents-manager';
const CLIENT_MARKER = 'x-dsh-agents-manager';
const MAX_BODY_BYTES = 3 * 1024 * 1024;
const PACKAGE_DIR = path.dirname(fileURLToPath(import.meta.url));

export const inject = ['webServer'];

export function apply(ctx, config = {}) {
  const metadata = readPackageMetadata();
  const currentVersion = metadata.version || '0.0.0';
  const repository = parseRepository(config?.updateRepository)
    || parseRepository(metadata.repository);

  const store = new AgentsStore({
    dshHome: process.env.DSH_HOME || path.join(os.homedir(), '.dsh'),
    getWorkspaceRegistry: () => ctx.get('workspaceRegistry'),
    getDefaultDirectory: () => {
      const workingDirectory = ctx.get('workingDirectory');
      return workingDirectory && typeof workingDirectory.defaultDirectory === 'string'
        ? workingDirectory.defaultDirectory
        : undefined;
    },
  });

  const route = (suffix, handler) => ctx.effect(
    () => ctx.webServer.register({
      kind: 'exact',
      path: `${ROUTE_PREFIX}/${suffix}`,
      handler,
    }),
    `agents-manager route ${suffix}`,
  );

  route('state', (req, res) => handle(req, res, false, async () => ({
    ...(await store.snapshot()),
    version: currentVersion,
    updateRepository: repository,
  })));
  route('read', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.readDocument(body.target);
  }));
  route('save', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.saveDocument(body.target, body);
  }));
  route('delete', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.removeDocument(body.target, body);
  }));
  route('skills/list', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.skillSnapshot(body.workspaceId);
  }));
  route('skills/create', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return body.description !== undefined || body.fields
      ? store.createSkill(body.workspaceId, body)
      : store.createSkill(body.workspaceId, body.name, body.content);
  }));
  route('skills/read', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.readSkill(body.workspaceId, body.name);
  }));
  route('skills/save', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.saveSkill(body.workspaceId, body.name, body);
  }));
  route('skills/files', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.listSkillFiles(body.workspaceId, body.name);
  }));
  route('skills/file/read', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.readSkillFile(body.workspaceId, body.name, body.relativePath);
  }));
  route('skills/file/save', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.saveSkillFile(
      body.workspaceId,
      body.name,
      body.relativePath,
      body.content,
      body.expectedMtimeMs,
      body.createOnly === true,
    );
  }));
  route('skills/file/delete', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.deleteSkillFile(body.workspaceId, body.name, body.relativePath, {
      recursive: body.recursive === true,
    });
  }));
  route('skills/folder/create', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.createSkillFolder(body.workspaceId, body.name, body.relativePath);
  }));
  route('skills/import', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.importSkill(body.workspaceId, body);
  }));
  route('skills/delete', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.deleteSkill(body.workspaceId, body.name);
  }));
  route('skills/library', (req, res) => handle(req, res, false, () => store.librarySnapshot()));
  route('skills/library/save', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.saveSkillToLibrary(body.workspaceId, body.name);
  }));
  route('skills/library/install', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return store.installSkillFromLibrary(body.workspaceId, body.name);
  }));
  route('catalog', (req, res) => handle(req, res, false, async () => {
    const requestUrl = new URL(req.url || '/', 'http://localhost');
    return loadCatalog({
      cachePath: path.join(store.dshHome(), 'workspace-atlas', 'catalog.json'),
      force: requestUrl.searchParams.get('refresh') === '1',
    });
  }));
  route('catalog/sync', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    return loadCatalog({
      cachePath: path.join(store.dshHome(), 'workspace-atlas', 'catalog.json'),
      force: body.refresh === true,
    });
  }));
  route('catalog/install', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    const workspaceId = body.workspaceId || GLOBAL_SKILLS_ID;
    const selected = await installCatalogSkill({
      cachePath: path.join(store.dshHome(), 'workspace-atlas', 'catalog.json'),
      repoId: body.repoId,
      skillPath: body.skillPath,
    });
    const meta = await store.installSkillFiles(workspaceId, selected.name, selected.files);
    return {
      ...meta,
      repository: selected.repository,
      repoUrl: selected.repoUrl,
      workspaceId,
    };
  }));
  route('update', (req, res) => handle(req, res, false, async () => {
    const manager = ctx.get('pluginManager');
    return inspectUpdate({
      repository,
      currentVersion,
      canAutoUpdate: Boolean(manager && typeof manager.installBundle === 'function'),
    });
  }));
  route('update/apply', (req, res) => handle(req, res, true, async () => {
    const body = await readBody(req);
    const tag = normalizeTag(body.tag);
    if (!tag) {
      throw new AgentsStoreError('A valid release tag is required.', {
        statusCode: 400,
        code: 'error.invalidTag',
      });
    }
    if (!repository) {
      throw new AgentsStoreError('No GitHub repository is configured for updates.', {
        statusCode: 409,
        code: 'error.updateNotConfigured',
      });
    }
    const manager = ctx.get('pluginManager');
    if (!manager || typeof manager.installBundle !== 'function') {
      throw new AgentsStoreError('Plugin Manager does not expose installBundle in this profile.', {
        statusCode: 409,
        code: 'error.updateUnavailable',
      });
    }

    const result = await manager.installBundle(`github:${repository}#${tag}`, {
      enabled: true,
      saveExact: true,
    });
    return {
      ...result,
      currentVersion,
      latestVersion: tag.replace(/^v/i, ''),
      restartRequired: true,
    };
  }));
}

function readPackageMetadata() {
  try {
    const manifest = JSON.parse(readFileSync(path.join(PACKAGE_DIR, 'package.json'), 'utf8'));
    return {
      version: typeof manifest.version === 'string' ? manifest.version : '0.0.0',
      repository: manifest.repository,
    };
  } catch {
    return { version: '0.0.0', repository: undefined };
  }
}

async function handle(req, res, mutation, task) {
  const rejected = validateRequest(req, mutation);
  if (rejected) {
    sendJson(res, rejected.statusCode, {
      ok: false,
      code: rejected.code,
      error: rejected.error,
    });
    return;
  }

  try {
    const data = await task();
    sendJson(res, 200, { ok: true, data });
  } catch (error) {
    const known = error instanceof AgentsStoreError;
    sendJson(res, known ? error.statusCode : 500, {
      ok: false,
      ...(known ? { code: error.code } : { code: 'error.internal' }),
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function validateRequest(req, mutation) {
  const host = typeof req.headers.host === 'string' ? req.headers.host : '';
  const hostUrl = parseAuthority(host);
  if (!hostUrl || !isCanonicalAuthority(host, hostUrl)) {
    return forbidden();
  }
  if (!isLoopbackHostname(hostUrl.hostname)) {
    return forbidden();
  }
  if (req.headers['sec-fetch-site'] === 'cross-site') {
    return forbidden();
  }
  const origin = req.headers.origin;
  if (typeof origin === 'string') {
    try {
      if (new URL(origin).host !== hostUrl.host) return forbidden();
    } catch {
      return forbidden();
    }
  }
  if (mutation) {
    if (req.headers[CLIENT_MARKER] !== '1') return forbidden();
    const contentType = String(req.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();
    if (contentType !== 'application/json') {
      return {
        statusCode: 415,
        code: 'error.contentType',
        error: 'content-type must be application/json',
      };
    }
  }
  return null;
}

function forbidden() {
  return {
    statusCode: 403,
    code: 'error.forbidden',
    error: 'forbidden request',
  };
}

function parseAuthority(authority) {
  try {
    return new URL(`http://${authority}`);
  } catch {
    return undefined;
  }
}

function canonicalAuthority(authority, parsed) {
  const port = parsed.port !== '' ? parsed.port : new URL(`https://${authority}`).port;
  return port === '' ? parsed.hostname : `${parsed.hostname}:${port}`;
}

function isCanonicalAuthority(authority, parsed) {
  return canonicalAuthority(authority, parsed) === authority.toLowerCase();
}

function isLoopbackHostname(hostname) {
  if (hostname === 'localhost' || hostname === '[::1]') return true;
  const parts = hostname.split('.');
  return parts.length === 4
    && parts[0] === '127'
    && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function readBody(req, limit = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let settled = false;
    const chunks = [];
    const rejectOnce = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };
    req.on('data', (chunk) => {
      if (settled) return;
      size += chunk.length;
      if (size > limit) {
        rejectOnce(new AgentsStoreError('Request body is too large.', {
          statusCode: 413,
          code: 'error.bodyTooLarge',
        }));
        req.resume();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (settled) return;
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        settled = true;
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        rejectOnce(new AgentsStoreError('Invalid JSON body.', {
          statusCode: 400,
          code: 'error.invalidJson',
        }));
      }
    });
    req.on('error', rejectOnce);
  });
}

function sendJson(res, statusCode, payload) {
  if (!res || res.writableEnded || res.destroyed) return;
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  res.end(body);
}
