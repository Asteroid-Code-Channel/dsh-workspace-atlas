import assert from 'node:assert/strict';
import {
  compareVersions,
  inspectUpdate,
  normalizeTag,
  parseRepository,
} from '../lib/update.js';

assert.equal(parseRepository('https://github.com/example/dsh-workspace-atlas.git'), 'example/dsh-workspace-atlas');
assert.equal(parseRepository('github:example/dsh-workspace-atlas'), 'example/dsh-workspace-atlas');
assert.equal(parseRepository('example/dsh-workspace-atlas'), 'example/dsh-workspace-atlas');
assert.equal(parseRepository('<your-account>/dsh-workspace-atlas'), '');
assert.equal(normalizeTag('v0.3.0'), 'v0.3.0');
assert.equal(normalizeTag('bad tag'), '');
assert.equal(compareVersions('0.3.0', '0.2.0'), 1);
assert.equal(compareVersions('v0.2.0', '0.2.0'), 0);
assert.equal(compareVersions('0.1.9', '0.2.0'), -1);

const fakeFetch = async () => ({
  ok: true,
  json: async () => ({
    tag_name: 'v0.3.0',
    html_url: 'https://github.com/example/dsh-workspace-atlas/releases/tag/v0.3.0',
    published_at: '2026-10-22T00:00:00Z',
    body: 'Release notes',
  }),
});

const available = await inspectUpdate({
  repository: 'example/dsh-workspace-atlas',
  currentVersion: '0.2.0',
  canAutoUpdate: true,
  fetchImpl: fakeFetch,
});
assert.equal(available.configured, true);
assert.equal(available.updateAvailable, true);
assert.equal(available.latestVersion, '0.3.0');
assert.equal(available.latestTag, 'v0.3.0');
assert.equal(available.canAutoUpdate, true);

const unconfigured = await inspectUpdate({
  repository: '',
  currentVersion: '0.2.0',
});
assert.equal(unconfigured.configured, false);

const failed = await inspectUpdate({
  repository: 'example/dsh-workspace-atlas',
  currentVersion: '0.2.0',
  fetchImpl: async () => ({ ok: false, status: 404 }),
});
assert.equal(failed.configured, true);
assert.match(failed.error, /HTTP 404/);

console.log('agents-manager update tests passed');
