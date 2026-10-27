import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { AgentsStore, GLOBAL_SKILLS_ID } from '../lib/store.js';
import { parseSkill, serializeSkill, validateSkillName, SkillSpecError } from '../lib/skill.js';

const base = path.join(process.cwd(), '.tmp-skill-manager-test');
const home = path.join(base, 'home');
const workspace = path.join(base, 'workspace');
await fs.rm(base, { recursive: true, force: true });
await fs.mkdir(workspace, { recursive: true });

const store = new AgentsStore({
  dshHome: home,
  getWorkspaceRegistry: () => ({ list: () => [{ id: 'ws-skill', title: 'Skill WS', path: workspace }] }),
  getDefaultDirectory: () => workspace,
});

const content = serializeSkill({
  name: 'pdf-tools',
  description: 'Extract PDF text: forms and merge. Use for PDFs.',
  license: 'MIT',
  compatibility: 'Requires Python 3.12+',
  metadata: { author: 'test-org', version: '1.0' },
  allowedTools: 'Bash(git:*) Read',
  body: '# PDF tools\n\nUse the local scripts.',
});
assert.match(content, /^---\nname: pdf-tools\n/);
assert.match(content, /allowed-tools: 'Bash\(git:\*\) Read'/);
const parsed = parseSkill(content);
assert.equal(parsed.fields.name, 'pdf-tools');
assert.equal(parsed.fields.license, 'MIT');
assert.equal(parsed.fields.compatibility, 'Requires Python 3.12+');
assert.equal(parsed.fields.metadata.author, 'test-org');
assert.equal(parsed.fields.metadata.version, '1.0');
assert.equal(parsed.fields.allowedTools, 'Bash(git:*) Read');
assert.equal(parsed.body, '# PDF tools\n\nUse the local scripts.\n');

const withExtra = parseSkill("---\nname: extra-skill\ndescription: Extra fields.\nwhen_to_use: 'Use for testing.'\n---\n# Body\n");
assert.deepEqual(withExtra.extra, ["when_to_use: 'Use for testing.'"]);
assert.match(serializeSkill({
  ...withExtra.fields,
  body: withExtra.body,
  extra: withExtra.extra,
}), /when_to_use: 'Use for testing\.'/);

assert.throws(() => validateSkillName('PDF-Tools'), (error) => error instanceof SkillSpecError);
assert.throws(() => validateSkillName('-pdf'), (error) => error instanceof SkillSpecError);
assert.throws(() => serializeSkill({ name: 'pdf-tools', description: '' }), (error) => error instanceof SkillSpecError);

await store.createSkill('ws-skill', {
  name: 'pdf-tools',
  description: 'Extract PDF text: forms and merge.',
  metadata: { author: 'test-org' },
  body: '# Workflow\n\n1. Read the PDF.',
});
const read = await store.readSkill('ws-skill', 'pdf-tools');
assert.equal(read.fields.name, 'pdf-tools');
assert.equal(read.fields.metadata.author, 'test-org');
assert.equal(read.body, '# Workflow\n\n1. Read the PDF.\n');
assert.match(await fs.readFile(path.join(workspace, '.dsh', 'skills', 'pdf-tools', 'SKILL.md'), 'utf8'), /^---\n/);

await store.saveSkill('ws-skill', 'pdf-tools', {
  description: 'Extract PDF text and fill forms.',
  license: 'Apache-2.0',
  compatibility: 'Requires Python',
  metadata: { version: '2.0' },
  allowedTools: 'Read Bash',
  body: '# Updated\n',
  expectedMtimeMs: read.mtimeMs,
});
const saved = await store.readSkill('ws-skill', 'pdf-tools');
assert.equal(saved.fields.license, 'Apache-2.0');
assert.equal(saved.fields.metadata.version, '2.0');
assert.equal(saved.body, '# Updated\n');

await store.saveSkill('ws-skill', 'pdf-tools', {
  description: 'Extract PDF text and fill forms.',
  license: 'Apache-2.0',
  compatibility: 'Requires Python',
  metadata: { version: '2.0' },
  allowedTools: 'Read Bash',
  body: '# Updated\n',
  extra: ["when_to_use: 'Use for PDFs.'"],
  expectedMtimeMs: saved.mtimeMs,
});
const withExtraSaved = await fs.readFile(path.join(workspace, '.dsh', 'skills', 'pdf-tools', 'SKILL.md'), 'utf8');
assert.match(withExtraSaved, /when_to_use: 'Use for PDFs\.'/);

await store.createSkill('ws-skill', 'legacy_name', 'legacy raw');
const legacySaved = await store.saveSkill('ws-skill', 'legacy_name', {
  name: 'legacy_name',
  description: 'Legacy skill kept under its existing name.',
  body: '# Legacy\n',
  expectedMtimeMs: (await store.readSkill('ws-skill', 'legacy_name')).mtimeMs,
});
assert.equal(legacySaved.skillName, 'legacy_name');
assert.equal(legacySaved.renamed, false);

await store.createSkill('ws-skill', 'rename-me', {
  name: 'rename-me',
  description: 'Rename test.',
  body: '# Rename\n',
});
await store.createSkillFolder('ws-skill', 'rename-me', 'references');
await store.saveSkillFile('ws-skill', 'rename-me', 'references/moved.md', '# Moved\n', null);
const renamed = await store.saveSkill('ws-skill', 'rename-me', {
  name: 'renamed-skill',
  description: 'Rename test.',
  body: '# Rename\n',
  expectedMtimeMs: (await store.readSkill('ws-skill', 'rename-me')).mtimeMs,
});
assert.equal(renamed.skillName, 'renamed-skill');
assert.equal(renamed.renamed, true);
assert.equal((await store.readSkill('ws-skill', 'renamed-skill')).fields.name, 'renamed-skill');
assert.equal((await store.readSkillFile('ws-skill', 'renamed-skill', 'references/moved.md')).content, '# Moved\n');
assert.equal(await fs.stat(path.join(workspace, '.dsh', 'skills', 'rename-me')).catch(() => null), null);
const folderRenamed = await store.renameSkillFolder('ws-skill', 'renamed-skill', 'renamed-again');
assert.equal(folderRenamed.renamed, true);
assert.equal((await store.readSkill('ws-skill', 'renamed-again')).fields.name, 'renamed-again');
assert.equal((await store.readSkillFile('ws-skill', 'renamed-again', 'references/moved.md')).content, '# Moved\n');

await store.createSkillFolder('ws-skill', 'pdf-tools', 'references');
await store.saveSkillFile('ws-skill', 'pdf-tools', 'references/guide.md', '# Guide\n', null);
await assert.rejects(
  () => store.saveSkillFile('ws-skill', 'pdf-tools', 'references/guide.md', 'overwrite', null, true),
  (error) => error.statusCode === 409,
);
await store.saveSkillFile('ws-skill', 'pdf-tools', 'scripts/run.py', 'print("hi")\n', null);
const tree = await store.listSkillFiles('ws-skill', 'pdf-tools');
assert(tree.entries.some((entry) => entry.relativePath === 'references' && entry.type === 'directory'));
assert(tree.entries.some((entry) => entry.relativePath === 'references/guide.md' && entry.type === 'file'));
assert(!tree.entries.some((entry) => entry.relativePath === 'SKILL.md'));
const file = await store.readSkillFile('ws-skill', 'pdf-tools', 'references/guide.md');
assert.equal(file.content, '# Guide\n');
await assert.rejects(
  () => store.readSkillFile('ws-skill', 'pdf-tools', '../escape.md'),
  (error) => error.statusCode === 400,
);
await assert.rejects(
  () => store.saveSkillFile('ws-skill', 'pdf-tools', 'SKILL.md', 'nope'),
  (error) => error.statusCode === 400,
);
await store.deleteSkillFile('ws-skill', 'pdf-tools', 'references', { recursive: true });
const afterDelete = await store.listSkillFiles('ws-skill', 'pdf-tools');
assert(!afterDelete.entries.some((entry) => entry.relativePath.startsWith('references')));

await store.createSkill(GLOBAL_SKILLS_ID, {
  name: 'global-tools',
  description: 'Global structured skill.',
  body: '# Global\n',
});
const globalRead = await store.readSkill(GLOBAL_SKILLS_ID, 'global-tools');
assert.equal(globalRead.fields.description, 'Global structured skill.');
assert.equal(globalRead.body, '# Global\n');

await fs.rm(base, { recursive: true, force: true });
console.log('agents-manager skill specification tests passed');
