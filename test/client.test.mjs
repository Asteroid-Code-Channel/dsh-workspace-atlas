import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8');
let definition;
const fakeWindow = {
  __ModuleLoader__: {
    load(value) {
      definition = value;
    },
  },
};
new Function('window', source)(fakeWindow);
assert.equal(definition.id, 'dsh-workspace-atlas');

const fakeReact = {
  Fragment: Symbol('Fragment'),
  createElement(type, props, ...children) {
    return { type, props: props || {}, children };
  },
  useState(initial) {
    if (fakeReact.seededStates) {
      return [fakeReact.seededStates.shift(), () => {}];
    }
    return [typeof initial === 'function' ? initial() : initial, () => {}];
  },
  useMemo(factory) {
    return factory();
  },
  useEffect() {},
  useRef(value) {
    return { current: value };
  },
  seededStates: null,
};
const module = definition.factory((name) => {
  assert.equal(name, 'react');
  return fakeReact;
});

const registrations = [];
const ctx = {
  effect(fn) {
    return fn();
  },
  locale: {
    register(namespace, dict) {
      assert.equal(namespace, 'agents-manager');
      assert(dict.zh && dict.en);
      return () => {};
    },
    bind(namespace) {
      assert.equal(namespace, 'agents-manager');
      return (key) => key;
    },
  },
  slots: {
    inject(name, callback) {
      assert(name === 'main' || name === 'sidebar.panellist');
      return callback();
    },
    register(options, component) {
      registrations.push({ options, component });
      return () => {};
    },
  },
};

module.apply(ctx);
assert.equal(registrations.length, 2);
const main = registrations.find((entry) => entry.options.name === 'main');
const sidebar = registrations.find((entry) => entry.options.name === 'sidebar.panellist');
assert.equal(main.options.key, 'agents-manager');
assert.equal(sidebar.options.id, 'agents-manager');
assert.equal(typeof sidebar.options.label, 'function');
assert.equal(sidebar.options.label(), '工作区图谱');

const iconElement = sidebar.component({ size: 18, active: true });
const icon = iconElement.type(iconElement.props);
assert.equal(icon.type, 'svg');
assert.equal(icon.props.width, 18);

const pageElement = main.component({ t: (key) => key });
const page = pageElement.type(pageElement.props);
assert.equal(page.type, fakeReact.Fragment);

function collect(value, result = []) {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, result);
  } else if (value && typeof value === 'object' && value.props) {
    result.push(value);
    collect(value.children, result);
  }
  return result;
}

const elements = collect(page.children);
const root = elements.find((child) => child.props.className === 'dam-root');
assert(root, 'page renders root');
const title = elements.find((child) => child.props.className === 'dam-title');
assert.equal(title.children[0], '工作区图谱');

const target = { scope: 'workspace', workspaceId: 'ws-1', relativePath: 'AGENTS.md' };
const doc = {
  target,
  path: 'D:\\demo\\AGENTS.md',
  exists: true,
  scope: 'workspace',
  workspaceTitle: 'Demo',
  mtimeMs: 1000,
  modifiedAt: new Date(1000).toISOString(),
  content: '# Demo\n',
  eol: '\n',
  bom: false,
  relativePath: 'AGENTS.md',
  name: 'AGENTS.md',
};
const snapshot = {
  home: 'D:\\dsh-home',
  global: {
    path: 'D:\\dsh-home\\AGENTS.md',
    exists: false,
    target: { scope: 'global' },
    name: 'AGENTS.md',
  },
  workspaces: [
    {
      id: 'ws-zeta',
      title: 'zeta',
      path: 'D:\\zeta',
      hostPath: 'D:\\zeta',
      available: true,
      agents: { exists: false, path: 'D:\\zeta\\AGENTS.md' },
      skill: { exists: false, path: 'D:\\zeta\\SKILL.md' },
      files: [],
    },
    {
      id: 'ws-alpha',
      title: 'Alpha',
      path: 'D:\\alpha',
      hostPath: 'D:\\alpha',
      available: true,
      agents: { exists: false, path: 'D:\\alpha\\AGENTS.md' },
      skill: { exists: false, path: 'D:\\alpha\\SKILL.md' },
      files: [],
    },
    {
      id: 'ws-1',
      title: 'Demo',
      path: 'D:\\demo',
      hostPath: 'D:\\demo',
      available: true,
      agents: { exists: true, path: 'D:\\demo\\AGENTS.md' },
      skill: { exists: false, path: 'D:\\demo\\SKILL.md' },
      files: [{
        target,
        path: 'D:\\demo\\AGENTS.md',
        relativePath: 'AGENTS.md',
        name: 'AGENTS.md',
        exists: true,
      }, {
        target: { scope: 'workspace', workspaceId: 'ws-1', relativePath: 'nested/AGENTS.md' },
        path: 'D:\\demo\\nested\\AGENTS.md',
        relativePath: 'nested/AGENTS.md',
        name: 'AGENTS.md',
        exists: true,
      }],
    },
    {
      id: 'ws-sub',
      title: 'sub',
      path: 'D:\\demo\\sub',
      hostPath: 'D:\\demo\\sub',
      available: true,
      agents: { exists: false, path: 'D:\\demo\\sub\\AGENTS.md' },
      skill: { exists: false, path: 'D:\\demo\\sub\\SKILL.md' },
      files: [],
    },
  ],
};
for (const workspace of snapshot.workspaces) {
  workspace.agents = {
    ...workspace.agents,
    name: 'AGENTS.md',
    relativePath: 'AGENTS.md',
    fileKind: 'agents',
  };
  workspace.skill = {
    ...workspace.skill,
    name: 'SKILL.md',
    relativePath: 'SKILL.md',
    fileKind: 'skill',
  };
}
fakeReact.seededStates = [
  snapshot,
  target,
  doc,
  '# Demo\n',
  '',
  'list',
  false,
  null,
  false,
  false,
  false,
  '',
  null,
  null,
  '',
  'AGENTS.md',
  '',
];
const seededElement = main.component({ t: (key) => key });
const seededPage = seededElement.type(seededElement.props);
const seededElements = collect(seededPage.children);
const textarea = seededElements.find((child) => child.props.className === 'dam-textarea');
assert(textarea, 'editor renders textarea');
assert.equal(textarea.props.value, '# Demo\n');
const pathLabel = seededElements.find((child) => child.props.className === 'dam-path');
assert.equal(pathLabel.children[0], 'D:\\demo\\AGENTS.md');
assert.equal(
  seededElements.filter((child) => child.props.className === 'dam-file-sub')
    .some((child) => child.children[0] === 'nested'),
  false,
);
const workspaceTitles = seededElements
  .filter((child) => child.props.className === 'dam-ws-title')
  .map((child) => child.children[0]);
assert.deepEqual(workspaceTitles, ['Alpha', 'Demo', 'sub', 'zeta']);
assert.equal(fakeReact.seededStates.length, 0);

fakeReact.seededStates = [
  snapshot,
  target,
  doc,
  '# Demo\n',
  '',
  'tree',
  false,
  null,
  false,
  false,
  false,
  '',
  null,
  null,
  '',
  'AGENTS.md',
  '',
];
const treePageElement = main.component({ t: (key) => key });
const treePage = treePageElement.type(treePageElement.props);
const treeHost = collect(treePage.children)
  .find((child) => child.props && child.props.snapshot === snapshot);
assert(treeHost, 'tree view is rendered');
fakeReact.seededStates = null;
const treeRender = treeHost.type(treeHost.props);
const treeElements = collect(treeRender.children);
const forest = treeElements.find((child) => child.props.className === 'dam-tree-forest');
assert(forest, 'tree forest renders');
assert.deepEqual(
  forest.children.flat(Infinity).filter(Boolean).map((child) => child.props.node.title),
  ['Alpha', 'Demo', 'zeta'],
);
assert.equal(forest.children.flat(Infinity).filter(Boolean)[0].props.node.skill.exists, false);
const demoNode = forest.children.flat(Infinity).filter(Boolean)
  .find((child) => child.props.node.title === 'Demo').props.node;
assert.deepEqual(demoNode.children.map((child) => child.title), ['sub']);
assert.equal(demoNode.children[0].relativePath, 'sub');

const demoRow = forest.children.flat(Infinity).filter(Boolean)
  .find((child) => child.props.node.title === 'Demo');
const demoCard = demoRow.type(demoRow.props).children[0];
const demoCardElement = demoCard.type(demoCard.props);
assert.equal(typeof demoCardElement.props.onClick, 'function');
demoCardElement.props.onClick({});

fakeReact.seededStates = ['alpha', new Set(), null, null];
const searchRender = treeHost.type(treeHost.props);
const searchElements = collect(searchRender.children);
const searchResults = searchElements.find((child) => child.props.className === 'dam-tree-results');
assert(searchResults, 'tree search results render');
assert.equal(
  searchResults.children.flat(Infinity).filter((child) => child && child.props && child.props.node).length,
  1,
);
assert.equal(
  searchResults.children.flat(Infinity)
    .find((child) => child && child.props && child.props.node).props.node.title,
  'Alpha',
);
fakeReact.seededStates = null;

console.log('agents-manager client registration tests passed');
