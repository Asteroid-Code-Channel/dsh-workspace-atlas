import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';

const base = path.join(process.cwd(), '.tmp-agents-manager-http-test');
const home = path.join(base, 'home');
const workspace = path.join(base, 'workspace');
await fs.rm(base, { recursive: true, force: true });
await fs.mkdir(workspace, { recursive: true });

const previousHome = process.env.DSH_HOME;
process.env.DSH_HOME = home;
const { apply } = await import('../index.js');

const routes = new Map();
const ctx = {
  effect(fn) { return fn(); },
  webServer: {
    register(route) {
      routes.set(route.path, route.handler);
      return () => routes.delete(route.path);
    },
  },
  get(name) {
    if (name === 'workspaceRegistry') {
      return { list: () => [{ id: 'ws-1', path: workspace, title: 'Test Workspace' }] };
    }
    if (name === 'workingDirectory') return { defaultDirectory: workspace };
    return undefined;
  },
};
apply(ctx);

function invoke(routePath, { body, headers = {}, method = body === undefined ? 'GET' : 'POST' } = {}) {
  assert(routes.has(routePath), `missing route ${routePath}`);
  const req = Readable.from(body === undefined ? [] : [Buffer.from(JSON.stringify(body))]);
  req.method = method;
  req.headers = {
    host: '127.0.0.1:50576',
    origin: 'http://127.0.0.1:50576',
    ...(body === undefined ? {} : {
      'content-type': 'application/json',
      'x-dsh-agents-manager': '1',
    }),
    ...headers,
  };
  const res = {
    statusCode: 0,
    headers: {},
    body: '',
    writableEnded: false,
    destroyed: false,
    writeHead(statusCode, responseHeaders) {
      this.statusCode = statusCode;
      this.headers = responseHeaders;
    },
    end(chunk = '') {
      this.body += chunk;
      this.writableEnded = true;
    },
  };
  return Promise.resolve(routes.get(routePath)(req, res)).then(() => ({
    status: res.statusCode,
    headers: res.headers,
    payload: JSON.parse(res.body || '{}'),
  }));
}

const state = await invoke('/api/dsh-agents-manager/state');
assert.equal(state.status, 200);
assert.equal(state.payload.ok, true);
assert.equal(state.payload.data.home, home);
assert.equal(state.payload.data.global.path, path.join(home, 'AGENTS.md'));
assert.equal(state.payload.data.workspaces.length, 1);
assert.equal(state.payload.data.workspaces[0].files[0].relativePath, 'AGENTS.md');
assert.equal(state.payload.data.version, '0.2.0');

const update = await invoke('/api/dsh-agents-manager/update');
assert.equal(update.status, 200);
assert.equal(update.payload.data.configured, false);
assert.equal(update.payload.data.currentVersion, '0.2.0');
assert.equal(update.payload.data.canAutoUpdate, false);

const readGlobal = await invoke('/api/dsh-agents-manager/read', { body: { target: { scope: 'global' } } });
assert.equal(readGlobal.status, 200);
assert.equal(readGlobal.payload.data.exists, false);

const forbidden = await invoke('/api/dsh-agents-manager/save', {
  body: { target: { scope: 'global' }, content: '# Global\n', expectedMtimeMs: null },
  headers: { 'x-dsh-agents-manager': '' },
});
assert.equal(forbidden.status, 403);

const wrongType = await invoke('/api/dsh-agents-manager/save', {
  body: { target: { scope: 'global' }, content: '# Global\n', expectedMtimeMs: null },
  headers: { 'content-type': 'text/plain' },
});
assert.equal(wrongType.status, 415);

const saved = await invoke('/api/dsh-agents-manager/save', {
  body: { target: { scope: 'global' }, content: '# Global\n\nHello.\n', expectedMtimeMs: null, eol: '\n' },
});
assert.equal(saved.status, 200);
assert.equal(saved.payload.data.exists, true);
assert.equal(await fs.readFile(path.join(home, 'AGENTS.md'), 'utf8'), '# Global\n\nHello.\n');

const stale = await invoke('/api/dsh-agents-manager/save', {
  body: { target: { scope: 'global' }, content: 'stale', expectedMtimeMs: saved.payload.data.mtimeMs - 5000 },
});
assert.equal(stale.status, 409);
assert.equal(stale.payload.code, 'error.conflict');

const traversal = await invoke('/api/dsh-agents-manager/read', {
  body: {
    target: { scope: 'workspace', workspaceId: 'ws-1', relativePath: '../AGENTS.md' },
  },
});
assert.equal(traversal.status, 400);
assert.equal(traversal.payload.code, 'error.invalidPath');

const wrongName = await invoke('/api/dsh-agents-manager/read', {
  body: {
    target: { scope: 'workspace', workspaceId: 'ws-1', relativePath: 'notes.md' },
  },
});
assert.equal(wrongName.status, 400);
assert.equal(wrongName.payload.code, 'error.invalidFileName');

const created = await invoke('/api/dsh-agents-manager/save', {
  body: {
    target: { scope: 'workspace', workspaceId: 'ws-1', relativePath: 'AGENTS.md' },
    content: '# Workspace\n',
    expectedMtimeMs: null,
    eol: '\n',
  },
});
assert.equal(created.status, 200);
assert.equal(await fs.readFile(path.join(workspace, 'AGENTS.md'), 'utf8'), '# Workspace\n');

const deleted = await invoke('/api/dsh-agents-manager/delete', {
  body: {
    target: { scope: 'workspace', workspaceId: 'ws-1', relativePath: 'AGENTS.md' },
    expectedMtimeMs: created.payload.data.mtimeMs,
  },
});
assert.equal(deleted.status, 200);
assert.equal(deleted.payload.data.deleted, true);
assert(deleted.payload.data.backupPath);

const skillRead = await invoke('/api/dsh-agents-manager/read', {
  body: { target: { scope: 'workspace', workspaceId: 'ws-1', file: 'skill' } },
});
assert.equal(skillRead.status, 200);
assert.equal(skillRead.payload.data.exists, false);

const skillSaved = await invoke('/api/dsh-agents-manager/save', {
  body: {
    target: { scope: 'workspace', workspaceId: 'ws-1', file: 'skill' },
    content: '# Skill\n',
    expectedMtimeMs: null,
    eol: '\n',
  },
});
assert.equal(skillSaved.status, 200);
assert.equal(await fs.readFile(path.join(workspace, 'SKILL.md'), 'utf8'), '# Skill\n');

const stateWithSkill = await invoke('/api/dsh-agents-manager/state');
assert.equal(stateWithSkill.payload.data.workspaces[0].skill.exists, true);
assert.equal(stateWithSkill.payload.data.workspaces[0].skillCount, 1);
assert.equal(stateWithSkill.payload.data.workspaces[0].files.some((file) => file.relativePath === 'SKILL.md'), false);

const skillCreated = await invoke('/api/dsh-agents-manager/skills/create', {
  body: { workspaceId: 'ws-1', name: 'demo-skill', content: '# Demo\n' },
});
assert.equal(skillCreated.status, 200);
assert.equal(await fs.readFile(path.join(workspace, '.dsh', 'skills', 'demo-skill', 'SKILL.md'), 'utf8'), '# Demo\n');

const skillList = await invoke('/api/dsh-agents-manager/skills/list', {
  body: { workspaceId: 'ws-1' },
});
assert.equal(skillList.status, 200);
assert.equal(skillList.payload.data.count, 2);
assert.equal(skillList.payload.data.skills.length, 1);

const librarySaved = await invoke('/api/dsh-agents-manager/skills/library/save', {
  body: { workspaceId: 'ws-1', name: 'demo-skill' },
});
assert.equal(librarySaved.status, 200);
assert.equal(librarySaved.payload.data.saved, true);

const library = await invoke('/api/dsh-agents-manager/skills/library');
assert.equal(library.status, 200);
assert.equal(library.payload.data.skills.length, 1);

const skillDeleted = await invoke('/api/dsh-agents-manager/skills/delete', {
  body: { workspaceId: 'ws-1', name: 'demo-skill' },
});
assert.equal(skillDeleted.status, 200);
assert.equal(skillDeleted.payload.data.deleted, true);

if (previousHome === undefined) delete process.env.DSH_HOME;
else process.env.DSH_HOME = previousHome;
await fs.rm(base, { recursive: true, force: true });
console.log('agents-manager HTTP tests passed');
