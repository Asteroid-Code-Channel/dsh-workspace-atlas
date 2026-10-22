import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { AgentsStore, GLOBAL_SKILLS_ID } from '../lib/store.js';

const base = path.join(process.cwd(), '.tmp-agents-manager-test');
const home = path.join(base, 'home');
const workspaceA = path.join(base, 'workspace-a');
const workspaceB = path.join(base, 'workspace-b');
const outside = path.join(base, 'outside');

await fs.rm(base, { recursive: true, force: true });
await fs.mkdir(path.join(workspaceA, 'packages', 'app'), { recursive: true });
await fs.mkdir(workspaceB, { recursive: true });
await fs.mkdir(outside, { recursive: true });
await fs.writeFile(path.join(workspaceA, 'AGENTS.md'), '# A root\r\n\r\nRule one.\r\n');
await fs.writeFile(path.join(workspaceA, 'packages', 'app', 'AGENTS.md'), '# Nested\n');
await fs.writeFile(path.join(workspaceA, 'packages', 'app', 'AGENTS.local.md'), '# Local\n');
await fs.mkdir(path.join(workspaceA, 'node_modules', 'pkg'), { recursive: true });
await fs.writeFile(path.join(workspaceA, 'node_modules', 'pkg', 'AGENTS.md'), '# Should be skipped\n');
await fs.symlink(outside, path.join(workspaceA, 'linked-outside')).catch(() => {});

const store = new AgentsStore({
  dshHome: home,
  getWorkspaceRegistry: () => ({
    list: () => [
      { id: 'ws-a', path: workspaceA, title: 'Workspace A' },
      { id: 'ws-b', path: workspaceB, title: 'Workspace B' },
    ],
  }),
  getDefaultDirectory: () => workspaceB,
});

const snapshot = await store.snapshot();
assert.equal(snapshot.global.exists, false);
assert.equal(snapshot.global.path, path.join(home, 'AGENTS.md'));
assert.equal(snapshot.workspaces.length, 2);
assert.equal(snapshot.workspaces[0].files[0].relativePath, 'AGENTS.md');
assert.equal(snapshot.workspaces[0].agents.exists, true);
assert.equal(snapshot.workspaces[0].skill.exists, false);
assert(snapshot.workspaces[0].files.some((file) => file.relativePath === 'packages/app/AGENTS.md'));
assert(snapshot.workspaces[0].files.some((file) => file.relativePath === 'packages/app/AGENTS.local.md'));
assert(!snapshot.workspaces[0].files.some((file) => file.relativePath.includes('node_modules')));

const globalRead = await store.readDocument({ scope: 'global' });
assert.equal(globalRead.exists, false);
assert.equal(globalRead.content, '');

const savedGlobal = await store.saveDocument({ scope: 'global' }, {
  content: '# Global\n\nAlways be kind.\n',
  expectedMtimeMs: null,
  eol: '\n',
});
assert.equal(savedGlobal.exists, true);
assert.equal(savedGlobal.backupPath, null);
const globalReadAgain = await store.readDocument({ scope: 'global' });
assert.equal(globalReadAgain.content, '# Global\n\nAlways be kind.\n');
assert.equal(globalReadAgain.eol, '\n');

await assert.rejects(
  () => store.saveDocument({ scope: 'global' }, {
    content: 'stale write',
    expectedMtimeMs: savedGlobal.mtimeMs - 10_000,
  }),
  (error) => error.code === 'error.conflict',
);

const root = await store.readDocument({
  scope: 'workspace',
  workspaceId: 'ws-a',
  relativePath: 'AGENTS.md',
});
assert.equal(root.content, '# A root\n\nRule one.\n');
assert.equal(root.eol, '\r\n');

const savedRoot = await store.saveDocument({
  scope: 'workspace',
  workspaceId: 'ws-a',
  relativePath: 'AGENTS.md',
}, {
  content: '# A root\n\nRule two.\n',
  expectedMtimeMs: root.mtimeMs,
  eol: root.eol,
});
assert.equal(savedRoot.exists, true);
assert(savedRoot.backupPath);
const rawRoot = await fs.readFile(path.join(workspaceA, 'AGENTS.md'), 'utf8');
assert.equal(rawRoot, '# A root\r\n\r\nRule two.\r\n');

await assert.rejects(
  () => store.readDocument({
    scope: 'workspace',
    workspaceId: 'ws-a',
    relativePath: '../outside/AGENTS.md',
  }),
  (error) => error.code === 'error.invalidPath',
);

await assert.rejects(
  () => store.readDocument({
    scope: 'workspace',
    workspaceId: 'ws-a',
    relativePath: 'packages/app/notes.md',
  }),
  (error) => error.code === 'error.invalidFileName',
);

const createdNested = await store.saveDocument({
  scope: 'workspace',
  workspaceId: 'ws-a',
  relativePath: 'packages/app/AGENTS.local.md',
}, {
  content: '# Local changed\n',
  expectedMtimeMs: (await store.readDocument({
    scope: 'workspace',
    workspaceId: 'ws-a',
    relativePath: 'packages/app/AGENTS.local.md',
  })).mtimeMs,
  eol: '\n',
});
assert.equal(createdNested.exists, true);

const removed = await store.removeDocument({
  scope: 'workspace',
  workspaceId: 'ws-a',
  relativePath: 'packages/app/AGENTS.local.md',
}, { expectedMtimeMs: createdNested.mtimeMs });
assert.equal(removed.deleted, true);
assert(removed.backupPath);
await assert.rejects(
  () => fs.stat(path.join(workspaceA, 'packages', 'app', 'AGENTS.local.md')),
  (error) => error.code === 'ENOENT',
);

const missingWorkspaceRoot = await store.readDocument({
  scope: 'workspace',
  workspaceId: 'ws-b',
  relativePath: 'AGENTS.md',
});
assert.equal(missingWorkspaceRoot.exists, false);
await store.saveDocument({
  scope: 'workspace',
  workspaceId: 'ws-b',
  relativePath: 'AGENTS.md',
}, { content: '# B\n', expectedMtimeMs: null, eol: '\n' });
assert.equal((await fs.readFile(path.join(workspaceB, 'AGENTS.md'), 'utf8')), '# B\n');

const skillRead = await store.readDocument({
  scope: 'workspace',
  workspaceId: 'ws-b',
  file: 'skill',
});
assert.equal(skillRead.exists, false);
assert.equal(skillRead.path, path.join(workspaceB, 'SKILL.md'));
const skillSaved = await store.saveDocument({
  scope: 'workspace',
  workspaceId: 'ws-b',
  file: 'skill',
}, {
  content: '# Skill\n\nProject skill.\n',
  expectedMtimeMs: null,
  eol: '\n',
});
assert.equal(skillSaved.exists, true);
assert.equal(await fs.readFile(path.join(workspaceB, 'SKILL.md'), 'utf8'), '# Skill\n\nProject skill.\n');
const snapshotWithSkill = await store.snapshot();
const workspaceBEntry = snapshotWithSkill.workspaces.find((workspace) => workspace.id === 'ws-b');
assert.equal(workspaceBEntry.skill.exists, true);
assert.equal(workspaceBEntry.agents.exists, true);
assert.equal(workspaceBEntry.skillCount, 1);
assert(!workspaceBEntry.files.some((file) => file.relativePath === 'SKILL.md'));

const nativeSkill = await store.createSkill('ws-b', 'demo-skill', '# Demo skill\n');
assert.equal(nativeSkill.exists, true);
assert.equal(
  await fs.readFile(path.join(workspaceB, '.dsh', 'skills', 'demo-skill', 'SKILL.md'), 'utf8'),
  '# Demo skill\n',
);
const skillList = await store.skillSnapshot('ws-b');
assert.equal(skillList.count, 2);
assert.equal(skillList.skills.length, 1);
assert.equal(skillList.skills[0].skillName, 'demo-skill');
assert.equal(skillList.legacy.exists, true);

const nativeRead = await store.readDocument({
  scope: 'workspace',
  workspaceId: 'ws-b',
  skillName: 'demo-skill',
});
assert.equal(nativeRead.content, '# Demo skill\n');

await assert.rejects(
  () => store.createSkill('ws-b', '../escape'),
  (error) => error.code === 'error.invalidSkillName',
);

const librarySaved = await store.saveSkillToLibrary('ws-b', 'demo-skill');
assert.equal(librarySaved.saved, true);
const library = await store.librarySnapshot();
assert.equal(library.skills.length, 1);
assert.equal(library.skills[0].name, 'demo-skill');

const installed = await store.installSkillFromLibrary('ws-a', 'demo-skill');
assert.equal(installed.installed, true);
assert.equal(
  await fs.readFile(path.join(workspaceA, '.dsh', 'skills', 'demo-skill', 'SKILL.md'), 'utf8'),
  '# Demo skill\n',
);

const deletedSkill = await store.deleteSkill('ws-a', 'demo-skill');
assert.equal(deletedSkill.deleted, true);
assert(deletedSkill.trashPath);
assert.equal(await fs.stat(path.join(workspaceA, '.dsh', 'skills', 'demo-skill')).catch(() => null), null);

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'text/markdown' });
  response.end('# Remote skill\n\nImported from HTTP.\n');
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const imported = await store.importSkill('ws-a', {
  name: 'remote-skill',
  url: `http://127.0.0.1:${port}/SKILL.md`,
});
server.close();
assert.equal(imported.skillName, 'remote-skill');
assert.equal(
  await fs.readFile(path.join(workspaceA, '.dsh', 'skills', 'remote-skill', 'SKILL.md'), 'utf8'),
  '# Remote skill\n\nImported from HTTP.\n',
);

const globalSkill = await store.createSkill(GLOBAL_SKILLS_ID, 'global-skill', '# Global skill\n');
assert.equal(globalSkill.skillName, 'global-skill');
assert.equal(
  await fs.readFile(path.join(home, 'skills', 'global-skill', 'SKILL.md'), 'utf8'),
  '# Global skill\n',
);
const globalSnapshot = await store.snapshot();
assert.equal(globalSnapshot.globalSkillCount, 1);
assert.equal(globalSnapshot.globalSkills[0].skillName, 'global-skill');
const globalList = await store.skillSnapshot(GLOBAL_SKILLS_ID);
assert.equal(globalList.count, 1);
assert.equal(globalList.legacy.exists, false);
await store.deleteSkill(GLOBAL_SKILLS_ID, 'global-skill');
assert.equal((await store.skillSnapshot(GLOBAL_SKILLS_ID)).count, 0);

await fs.rm(base, { recursive: true, force: true });
console.log('agents-manager store tests passed');
