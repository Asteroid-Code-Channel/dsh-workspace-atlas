window.__ModuleLoader__.load({
  id: 'dsh-workspace-atlas',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useMemo, useRef, useState } = React;

    const NS = 'agents-manager';
    const API = '/api/dsh-agents-manager';
    const MARKER = 'x-dsh-agents-manager';

    const DICT = {
      zh: {
        title: 'AGENTS & Skills 工作台',
        subtitle: '全局/工作区 AGENTS.md、多 SKILL 管理与四源技能目录',
        listView: '列表',
        treeView: '树形',
        treeSearch: '搜索工作区…',
        treeSearchEmpty: '没有匹配的工作区',
        treeSearchResults: '{count} 个匹配',
        treeWorkspaceCount: '{count} 个工作区',
        treeCollapseAll: '全部收起',
        treeHint: '点击节点展开；SKILL / AGENTS 按钮编辑文件。',
        skill: 'SKILL',
        agents: 'AGENTS',
        nodeFileTitle: '{title} · {file}',
        skillManager: 'SKILL 管理',
        skillCount: '{count} 个 SKILL',
        newSkill: '新建 SKILL',
        importSkill: 'URL 导入',
        skillLibrary: '技能仓库',
        skillName: '技能名称',
        skillUrl: 'SKILL.md URL',
        skillUrlHint: '填写 raw.githubusercontent.com 的 SKILL.md 链接，或其他 text/markdown 地址。',
        createSkill: '创建',
        import: '导入',
        importing: '导入中…',
        skillManagerHint: '按 Agent Skills 规范编辑 SKILL.md；项目技能存放在 .dsh/skills/<name>/SKILL.md。',
        skillFormHint: 'name 和 description 必填；其余字段选填。保存时自动生成 YAML frontmatter。',
        skillDescription: '描述',
        skillLicense: '许可证',
        skillCompatibility: '兼容性',
        skillMetadata: '元数据',
        skillAllowedTools: '允许的工具',
        skillBody: '技能内容',
        skillBodyHint: 'Markdown 正文。可引用同目录下的 scripts/、references/、assets/ 文件。',
        skillDescriptionHint: '说明技能做什么、什么时候使用；最多 1024 字符。',
        skillCompatibilityHint: '环境要求，例如系统依赖、网络访问；最多 500 字符。',
        skillAllowedToolsHint: '空格分隔的预授权工具，例如 Bash(git:*) Read。',
        metadataHint: '自由键值对，例如 author、version。',
        metadataKey: '键',
        metadataValue: '值',
        addMetadata: '添加元数据',
        remove: '移除',
        skillNameFixed: '名称由目录名决定，创建后不能在此修改。',
        skillTabInfo: '技能信息',
        skillTabFiles: '文件',
        skillFilesHint: '管理 SKILL.md 之外的脚本、引用和资源。',
        skillFilesEmpty: '还没有附加文件。',
        rootSkill: '根 SKILL.md',
        entryPath: '相对路径',
        entryPathHint: '例如 references/guide.md 或 scripts/run.py',
        newSkillFile: '新建文件',
        newSkillFolder: '新建文件夹',
        fileContent: '文件内容',
        binaryFile: '二进制文件不能在此编辑。',
        fileSaved: '已保存 {path}',
        fileDeleted: '已删除 {path}',
        folderCreated: '已创建目录 {path}',
        confirmEntryDelete: '确定删除 {path}？文件夹会连同内容一起删除。',
        skillNameSpecHint: '仅小写字母、数字和连字符；不能以连字符开头或结尾，不能连续两个连字符。',
        skillNameHint: '仅字母、数字、点、下划线和连字符。',
        skillNameRequired: '请填写 name。',
        skillDescriptionRequired: '请填写 description。',
        entryPathRequired: '请填写相对路径。',
        legacySkill: '根 SKILL.md（legacy）',
        nativeSkill: '项目技能',
        noSkills: '尚无项目技能',
        libraryEmpty: '技能仓库为空',
        saveToLibrary: '存入仓库',
        installSkill: '安装',
        back: '返回',
        edit: '编辑',
        skillCreated: '已创建 {name}',
        skillImported: '已导入 {name}',
        skillDeleted: '已删除 {name}',
        skillSavedToLibrary: '已存入仓库 {name}',
        skillInstalled: '已安装 {name}',
        confirmSkillDelete: '确定删除技能 {name}？目录会移动到 DSH 回收目录。',
        confirmLegacyDelete: '确定删除根 SKILL.md？删除前会自动备份。',
        libraryPath: '仓库位置',
        skillCatalog: '技能目录',
        catalogSubtitle: '从公开仓库同步 SKILL 索引，安装到全局技能目录。',
        refreshIndex: '刷新索引',
        syncingIndex: '同步中…',
        installToGlobal: '安装到全局',
        installingSkill: '安装中…',
        installedSkill: '已安装 {name}',
        openRepo: '打开仓库',
        catalogEmpty: '没有匹配的 skill',
        catalogError: '目录同步失败：{error}',
        catalogCount: '{count} 个 skill',
        catalogSearch: '搜索 skill…',
        catalogSource: '来源',
        catalogLocalCache: '缓存',
        treeNoWorkspaces: '尚未发现工作区',
        update: '版本更新',
        currentVersion: '当前版本',
        latestVersion: '最新版本',
        checkUpdate: '检查更新',
        checkingUpdate: '检查中…',
        upToDate: '已是最新版本',
        updateAvailable: '发现新版本 {version}',
        updateNow: '安装更新',
        updating: '正在更新…',
        updateRestart: '更新已安装，重启 DSH NEXT 后生效。',
        updateNotConfigured: '未配置 GitHub 更新源。发布后请在 cordis.patch.yml 设置 updateRepository，或在 package.json 写入 repository。',
        updateFailed: '更新失败：{error}',
        updateCheckFailed: '检查更新失败：{error}',
        releaseNotes: '更新说明',
        viewRelease: '打开发布页',
        noReleaseNotes: '此版本没有更新说明。',
        global: '全局',
        globalName: '全局 AGENTS.md',
        globalSkillName: '全局 SKILL',
        globalHint: '作用于所有工作区的用户全局指令',
        workspaces: '工作区',
        workspaceFileCount: '{count} 个文件',
        workspaceItemCount: '{count} 项',
        noWorkspaces: '尚未发现工作区',
        search: '筛选文件…',
        refresh: '刷新',
        newFile: '新建',
        save: '保存',
        saving: '保存中…',
        saved: '已保存',
        unsaved: '未保存',
        missing: '未创建',
        local: '本地',
        reload: '重新加载',
        delete: '删除',
        copyPath: '复制路径',
        copied: '路径已复制',
        lines: '{count} 行',
        chars: '{count} 字符',
        emptyTitle: '选择一个文件',
        emptyHint: '从左侧选择全局、AGENTS.md 或 SKILL.md。',
        loading: '正在加载…',
        loadFailed: '加载失败：{error}',
        saveFailed: '保存失败：{error}',
        savedNotice: '已保存 {path}',
        savedWithBackup: '已保存 {path}，原文件已备份。',
        createdNotice: '已创建 {path}',
        deletedNotice: '已删除 {path}',
        deleteConfirmTitle: '删除 AGENTS.md',
        deleteConfirm: '确定删除 {path}？删除前会自动备份。',
        cancel: '取消',
        close: '关闭',
        confirmDelete: '删除',
        discardConfirm: '当前有未保存修改，确定放弃并切换？',
        confirmTitle: '确认操作',
        confirm: '确定',
        conflict: '文件已被外部修改，请重新加载后再保存。',
        fileExists: '文件已存在，请换一个路径。',
        newTitle: '新建 AGENTS.md',
        workspace: '工作区',
        relativePath: '工作区内的相对路径',
        pathHint: '例如 AGENTS.md 或 packages/app/AGENTS.md；父目录需要已存在。',
        create: '创建',
        creating: '创建中…',
        required: '请填写路径。',
        invalidPath: '路径必须以 AGENTS.md 或 AGENTS.local.md 结尾。',
        notExist: '文件尚不存在，保存后创建。',
        editorPlaceholder: '在此编写 AGENTS.md 内容…',
        filePlaceholder: '在此编写 {file} 内容…',
        rootFile: '根目录',
        unavailable: '目录不可用',
        backup: '已自动备份到 {path}',
        emptyWorkspace: '没有匹配的文件',
        errorConflictHint: '可以点击“重新加载”查看磁盘上的最新内容。',
        path: '路径',
        modified: '修改于 {time}',
        bytes: '{count} B',
        allFiles: '全部文件',
      },
      en: {
        title: 'AGENTS & Skills Studio',
        subtitle: 'Global/workspace AGENTS.md, multi-skill management, and four-source skill catalogs',
        listView: 'List',
        treeView: 'Tree',
        treeSearch: 'Search workspaces…',
        treeSearchEmpty: 'No matching workspaces',
        treeSearchResults: '{count} matches',
        treeWorkspaceCount: '{count} workspaces',
        treeCollapseAll: 'Collapse all',
        treeHint: 'Click a node to expand; SKILL / AGENTS buttons edit files.',
        skill: 'SKILL',
        agents: 'AGENTS',
        nodeFileTitle: '{title} · {file}',
        skillManager: 'SKILL manager',
        skillCount: '{count} skills',
        newSkill: 'New SKILL',
        importSkill: 'Import URL',
        skillLibrary: 'Skill library',
        skillName: 'Skill name',
        skillUrl: 'SKILL.md URL',
        skillUrlHint: 'Use a raw.githubusercontent.com SKILL.md URL or any text/markdown URL.',
        createSkill: 'Create',
        import: 'Import',
        importing: 'Importing…',
        skillManagerHint: 'Edit SKILL.md using the Agent Skills format; project skills live at .dsh/skills/<name>/SKILL.md.',
        skillFormHint: 'name and description are required; all other fields are optional. YAML frontmatter is generated on save.',
        skillDescription: 'Description',
        skillLicense: 'License',
        skillCompatibility: 'Compatibility',
        skillMetadata: 'Metadata',
        skillAllowedTools: 'Allowed tools',
        skillBody: 'Skill content',
        skillBodyHint: 'Markdown body. Reference scripts/, references/, or assets/ in the same directory.',
        skillDescriptionHint: 'What the skill does and when to use it; up to 1024 characters.',
        skillCompatibilityHint: 'Environment requirements such as system packages or network access; up to 500 characters.',
        skillAllowedToolsHint: 'Space-separated pre-approved tools, for example Bash(git:*) Read.',
        metadataHint: 'Free-form key-value pairs such as author or version.',
        metadataKey: 'Key',
        metadataValue: 'Value',
        addMetadata: 'Add metadata',
        remove: 'Remove',
        skillNameFixed: 'The name comes from the directory and cannot be changed here.',
        skillTabInfo: 'Skill info',
        skillTabFiles: 'Files',
        skillFilesHint: 'Manage scripts, references, and assets outside SKILL.md.',
        skillFilesEmpty: 'No additional files yet.',
        rootSkill: 'Root SKILL.md',
        entryPath: 'Relative path',
        entryPathHint: 'For example references/guide.md or scripts/run.py',
        newSkillFile: 'New file',
        newSkillFolder: 'New folder',
        fileContent: 'File content',
        binaryFile: 'Binary files cannot be edited here.',
        fileSaved: 'Saved {path}',
        fileDeleted: 'Deleted {path}',
        folderCreated: 'Created folder {path}',
        confirmEntryDelete: 'Delete {path}? A folder is removed with all its contents.',
        skillNameSpecHint: 'Lowercase letters, numbers, and single hyphens only; no leading/trailing or consecutive hyphens.',
        skillNameHint: 'Letters, numbers, dots, underscores, and hyphens only.',
        skillNameRequired: 'name is required.',
        skillDescriptionRequired: 'description is required.',
        entryPathRequired: 'A relative path is required.',
        legacySkill: 'Root SKILL.md (legacy)',
        nativeSkill: 'Project skill',
        noSkills: 'No project skills yet',
        libraryEmpty: 'Skill library is empty',
        saveToLibrary: 'Save to library',
        installSkill: 'Install',
        back: 'Back',
        edit: 'Edit',
        skillCreated: 'Created {name}',
        skillImported: 'Imported {name}',
        skillDeleted: 'Deleted {name}',
        skillSavedToLibrary: 'Saved {name} to library',
        skillInstalled: 'Installed {name}',
        confirmSkillDelete: 'Delete skill {name}? Its directory is moved to the DSH trash.',
        confirmLegacyDelete: 'Delete the root SKILL.md? A backup is created first.',
        libraryPath: 'Library path',
        skillCatalog: 'Skill catalog',
        catalogSubtitle: 'Sync SKILL indexes from public repositories and install into the global skill directory.',
        refreshIndex: 'Refresh index',
        syncingIndex: 'Syncing…',
        installToGlobal: 'Install globally',
        installingSkill: 'Installing…',
        installedSkill: 'Installed {name}',
        openRepo: 'Open repository',
        catalogEmpty: 'No matching skills',
        catalogError: 'Catalog sync failed: {error}',
        catalogCount: '{count} skills',
        catalogSearch: 'Search skills…',
        catalogSource: 'Source',
        catalogLocalCache: 'cache',
        treeNoWorkspaces: 'No workspaces found',
        update: 'Version update',
        currentVersion: 'Current',
        latestVersion: 'Latest',
        checkUpdate: 'Check for updates',
        checkingUpdate: 'Checking…',
        upToDate: 'Up to date',
        updateAvailable: 'Version {version} is available',
        updateNow: 'Install update',
        updating: 'Updating…',
        updateRestart: 'Update installed. Restart DSH NEXT to activate it.',
        updateNotConfigured: 'No GitHub update source is configured. Set updateRepository in cordis.patch.yml, or add repository to package.json.',
        updateFailed: 'Update failed: {error}',
        updateCheckFailed: 'Update check failed: {error}',
        releaseNotes: 'Release notes',
        viewRelease: 'Open release page',
        noReleaseNotes: 'No release notes for this version.',
        global: 'Global',
        globalName: 'Global AGENTS.md',
        globalSkillName: 'Global SKILL',
        globalHint: 'User-global instructions applied to every workspace',
        workspaces: 'Workspaces',
        workspaceFileCount: '{count} files',
        workspaceItemCount: '{count} items',
        noWorkspaces: 'No workspaces found',
        search: 'Filter files…',
        refresh: 'Refresh',
        newFile: 'New',
        save: 'Save',
        saving: 'Saving…',
        saved: 'Saved',
        unsaved: 'Unsaved',
        missing: 'Not created',
        local: 'Local',
        reload: 'Reload',
        delete: 'Delete',
        copyPath: 'Copy path',
        copied: 'Path copied',
        lines: '{count} lines',
        chars: '{count} chars',
        emptyTitle: 'Select a file',
        emptyHint: 'Choose the global file, an AGENTS.md, or a SKILL.md on the left.',
        loading: 'Loading…',
        loadFailed: 'Load failed: {error}',
        saveFailed: 'Save failed: {error}',
        savedNotice: 'Saved {path}',
        savedWithBackup: 'Saved {path}. The previous file was backed up.',
        createdNotice: 'Created {path}',
        deletedNotice: 'Deleted {path}',
        deleteConfirmTitle: 'Delete AGENTS.md',
        deleteConfirm: 'Delete {path}? A backup is created first.',
        cancel: 'Cancel',
        close: 'Close',
        confirmDelete: 'Delete',
        discardConfirm: 'There are unsaved changes. Discard them and switch?',
        confirmTitle: 'Confirm action',
        confirm: 'Confirm',
        conflict: 'The file changed outside the editor. Reload it before saving.',
        fileExists: 'That file already exists. Choose another path.',
        newTitle: 'New AGENTS.md',
        workspace: 'Workspace',
        relativePath: 'Path inside the workspace',
        pathHint: 'For example AGENTS.md or packages/app/AGENTS.md. The parent directory must exist.',
        create: 'Create',
        creating: 'Creating…',
        required: 'Enter a path.',
        invalidPath: 'The path must end with AGENTS.md or AGENTS.local.md.',
        notExist: 'This file does not exist yet. Saving creates it.',
        editorPlaceholder: 'Write AGENTS.md content here…',
        filePlaceholder: 'Write {file} content here…',
        rootFile: 'Root',
        unavailable: 'Directory unavailable',
        backup: 'Backed up to {path}',
        emptyWorkspace: 'No matching files',
        errorConflictHint: 'Click "Reload" to inspect the latest content on disk.',
        path: 'Path',
        modified: 'Modified {time}',
        bytes: '{count} B',
        allFiles: 'All files',
      },
    };

    const FALLBACK = DICT.zh;

    const PAGE_CACHE = {
      snapshot: null,
      selected: null,
      doc: null,
      draft: '',
      query: '',
      viewMode: 'list',
    };

    const WORKSPACE_COLLATOR = new Intl.Collator(undefined, {
      sensitivity: 'base',
      numeric: true,
    });

    function compareWorkspaceNames(left, right) {
      const leftTitle = String(left?.title || '').trim();
      const rightTitle = String(right?.title || '').trim();
      const byTitle = WORKSPACE_COLLATOR.compare(leftTitle, rightTitle);
      if (byTitle !== 0) return byTitle;
      return WORKSPACE_COLLATOR.compare(String(left?.path || ''), String(right?.path || ''));
    }

    function treePathKey(value) {
      return String(value || '')
        .replaceAll('\\', '/')
        .replace(/\/+$/, '')
        .toLowerCase();
    }

    function buildWorkspaceTree(workspaces) {
      const nodes = (workspaces || []).map((workspace) => ({
        ...workspace,
        nodeId: String(workspace.id),
        children: [],
        parent: null,
        relativePath: '',
      }));
      const byPath = new Map();
      for (const node of nodes) {
        const key = treePathKey(node.hostPath || node.path);
        if (key) byPath.set(key, node);
      }

      for (const node of nodes) {
        let current = treePathKey(node.hostPath || node.path);
        while (current.includes('/')) {
          current = current.slice(0, current.lastIndexOf('/'));
          const parent = byPath.get(current);
          if (parent && parent !== node) {
            node.parent = parent;
            parent.children.push(node);
            break;
          }
        }
      }

      const sortBranch = (branch) => {
        branch.sort(compareWorkspaceNames);
        for (const node of branch) sortBranch(node.children);
      };
      const roots = nodes.filter((node) => !node.parent);
      sortBranch(roots);

      const decorate = (node) => {
        const parentPath = node.parent?.hostPath || node.parent?.path || '';
        if (parentPath) {
          node.relativePath = String(node.hostPath || node.path)
            .slice(parentPath.length)
            .replace(/^[\\/]+/, '');
        }
        for (const child of node.children) decorate(child);
      };
      for (const root of roots) decorate(root);

      return { roots, nodes };
    }

    function flattenWorkspaceTree(roots) {
      const result = [];
      const visit = (node) => {
        result.push(node);
        for (const child of node.children) visit(child);
      };
      for (const root of roots) visit(root);
      return result;
    }

    function workspaceSkillCount(workspace) {
      if (typeof workspace?.skillCount === 'number') return workspace.skillCount;
      return (workspace?.skills?.length || 0) + (workspace?.skill?.exists ? 1 : 0);
    }

    function workspaceSkillSummary(workspace) {
      const count = workspaceSkillCount(workspace);
      return {
        target: { scope: 'workspace', workspaceId: workspace.id, file: 'skill' },
        path: workspace.path,
        hostPath: workspace.hostPath,
        relativePath: 'SKILL.md',
        name: 'SKILL.md',
        fileKind: 'skill',
        exists: count > 0,
        skillCount: count,
        isSkillCollection: true,
      };
    }

    const CSS = `
      .dam-root {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 14px;
        width: 100%;
        height: 100%;
        min-height: 420px;
        padding: 20px 24px 22px;
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-base);
        font-size: 13px;
      }
      .dam-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        flex: none;
      }
      .dam-title-block { min-width: 0; }
      .dam-title-row { display: flex; align-items: center; gap: 10px; }
      .dam-title {
        margin: 0;
        font-size: 20px;
        line-height: 1.3;
        font-weight: 650;
        letter-spacing: -0.01em;
      }
      .dam-title-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 9px;
        color: var(--dsw-alias-brand-primary);
        background: var(--dsw-alias-bg-layer-2);
        border: 1px solid var(--dsw-alias-border-l1);
        flex: none;
      }
      .dam-subtitle {
        margin: 6px 0 0;
        color: var(--dsw-alias-label-secondary);
        font-size: 12.5px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }
      .dam-header-actions { display: flex; align-items: center; gap: 8px; flex: none; }
      .dam-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 30px;
        padding: 5px 11px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 8px;
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-layer-2);
        font: inherit;
        font-size: 12px;
        line-height: 1.35;
        cursor: pointer;
        white-space: nowrap;
        transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease, opacity 140ms ease;
      }
      .dam-btn:hover:not(:disabled) {
        border-color: var(--dsw-alias-label-secondary);
        background: var(--dsw-alias-bg-layer-1);
      }
      .dam-btn:focus-visible, .dam-icon-btn:focus-visible, .dam-file:focus-visible, .dam-search:focus-visible,
      .dam-textarea:focus-visible, .dam-input:focus-visible, .dam-select:focus-visible, .dam-modal-close:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 1px;
      }
      .dam-btn:disabled { opacity: 0.45; cursor: default; }
      .dam-btn-primary {
        border-color: transparent;
        color: var(--dsw-alias-label-primary-foreground, #fff);
        background: var(--dsw-alias-brand-primary);
      }
      .dam-btn-primary:hover:not(:disabled) { background: var(--dsw-alias-brand-primary); opacity: 0.88; }
      .dam-btn-danger { color: var(--dsw-alias-state-error-primary); }
      .dam-btn-danger:hover:not(:disabled) {
        border-color: var(--dsw-alias-state-error-primary);
        background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, var(--dsw-alias-bg-layer-2));
      }
      .dam-layout {
        display: grid;
        grid-template-columns: minmax(240px, 310px) minmax(0, 1fr);
        gap: 14px;
        min-height: 0;
        flex: 1;
      }
      .dam-nav {
        display: flex;
        flex-direction: column;
        min-height: 0;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 12px;
        background: var(--dsw-alias-bg-layer-1);
        overflow: hidden;
      }
      .dam-nav-head {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 11px 11px 9px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
        flex: none;
      }
      .dam-search, .dam-input, .dam-select {
        box-sizing: border-box;
        width: 100%;
        min-height: 30px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 7px;
        padding: 5px 9px;
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-layer-2);
        font: inherit;
        font-size: 12px;
        outline: none;
      }
      .dam-search::placeholder, .dam-input::placeholder { color: var(--dsw-alias-label-secondary); }
      .dam-nav-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        color: var(--dsw-alias-label-secondary);
        font-size: 11px;
      }
      .dam-nav-scroll {
        min-height: 0;
        overflow: auto;
        padding: 10px 9px 12px;
        scrollbar-width: thin;
      }
      .dam-global-card {
        margin: 0 0 12px;
        padding: 7px 8px 8px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary) 32%, transparent);
        border-left: 3px solid var(--dsw-alias-state-warn-primary);
        border-radius: 10px;
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--dsw-alias-state-warn-primary) 11%, var(--dsw-alias-bg-layer-1)),
          color-mix(in srgb, var(--dsw-alias-state-warn-primary) 4%, var(--dsw-alias-bg-layer-1))
        );
      }
      .dam-global-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 0 2px 6px;
      }
      .dam-global-title-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
      .dam-global-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--dsw-alias-state-warn-primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-warn-primary) 16%, transparent);
        flex: none;
      }
      .dam-global-title {
        color: var(--dsw-alias-state-warn-primary);
        font-size: 10.5px;
        font-weight: 700;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }
      .dam-group-count {
        color: var(--dsw-alias-state-warn-primary);
        font-size: 10px;
        font-variant-numeric: tabular-nums;
        opacity: 0.8;
      }
      .dam-global-card .dam-global-file {
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 7%, var(--dsw-alias-bg-layer-1));
        border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 18%, transparent);
        padding: 8px;
      }
      .dam-global-card .dam-global-file:hover {
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 12%, var(--dsw-alias-bg-layer-1));
      }
      .dam-global-card .dam-global-file.dam-file-active {
        border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 65%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 15%, var(--dsw-alias-bg-layer-1));
        box-shadow: inset 2px 0 0 var(--dsw-alias-state-warn-primary);
      }
      .dam-file-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 7px;
        color: var(--dsw-alias-label-secondary);
        background: var(--dsw-alias-bg-layer-1);
        flex: none;
      }
      .dam-file-icon-global {
        color: var(--dsw-alias-state-warn-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 25%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 10%, var(--dsw-alias-bg-layer-1));
      }
      .dam-file-icon-skill {
        color: var(--dsw-alias-state-success-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 25%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 8%, var(--dsw-alias-bg-layer-1));
      }
      .dam-file {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 7px 8px;
        margin: 1px 0;
        border: 1px solid transparent;
        border-radius: 8px;
        color: inherit;
        background: transparent;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .dam-file:hover {
        background: color-mix(in srgb, var(--dsw-alias-label-primary) 5%, var(--dsw-alias-bg-layer-1));
      }
      .dam-file:disabled { opacity: 0.55; cursor: default; }
      .dam-file-active {
        border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 42%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 9%, var(--dsw-alias-bg-layer-1));
      }
      .dam-file-main { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
      .dam-file-name {
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-size: 12.5px;
        font-weight: 500;
        line-height: 1.35;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-file-sub {
        overflow: hidden;
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
        line-height: 1.4;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-file-meta { display: flex; align-items: center; gap: 4px; flex: none; }
      .dam-badge {
        display: inline-flex;
        align-items: center;
        padding: 1px 5px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 999px;
        color: var(--dsw-alias-label-secondary);
        background: var(--dsw-alias-bg-layer-2);
        font-size: 9.5px;
        line-height: 1.5;
        white-space: nowrap;
      }
      .dam-badge-missing {
        color: var(--dsw-alias-state-warn-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 35%, transparent);
      }
      .dam-badge-count {
        color: var(--dsw-alias-state-success-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 35%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 8%, transparent);
        font-variant-numeric: tabular-nums;
      }
      .dam-badge-local {
        color: var(--dsw-alias-state-success-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 35%, transparent);
      }
      .dam-badge-unavailable {
        color: var(--dsw-alias-state-error-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 35%, transparent);
      }
      .dam-ws {
        margin: 0 0 10px;
        padding: 4px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 11px;
        background: var(--dsw-alias-bg-layer-2);
        overflow: hidden;
      }
      .dam-ws:last-child { margin-bottom: 0; }
      .dam-ws-active {
        border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 34%, var(--dsw-alias-border-l1));
      }
      .dam-ws-head {
        padding: 7px 8px 6px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .dam-ws-title-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
      .dam-ws-title {
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-size: 12.5px;
        font-weight: 600;
        line-height: 1.4;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-ws-count {
        margin-left: auto;
        color: var(--dsw-alias-label-secondary);
        font-size: 9.5px;
        line-height: 1.4;
        white-space: nowrap;
        flex: none;
      }
      .dam-ws-path {
        overflow: hidden;
        color: var(--dsw-alias-label-secondary);
        font-size: 10px;
        line-height: 1.45;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-ws-files {
        display: flex;
        flex-direction: column;
        gap: 1px;
        padding-top: 3px;
      }
      .dam-main {
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 12px;
        background: var(--dsw-alias-bg-layer-1);
        overflow: hidden;
      }
      .dam-editor { display: flex; flex-direction: column; min-height: 0; flex: 1; }
      .dam-editor-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
        padding: 12px 14px 10px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
        flex: none;
      }
      .dam-editor-title-block { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
      .dam-breadcrumb {
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .dam-path-row { display: flex; align-items: center; gap: 5px; min-width: 0; }
      .dam-path {
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 11.5px;
        line-height: 1.5;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-status-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
        line-height: 1.4;
      }
      .dam-status {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: var(--dsw-alias-label-secondary);
        font-weight: 600;
      }
      .dam-status::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--dsw-alias-state-idle-primary);
      }
      .dam-status-saved::before { background: var(--dsw-alias-state-success-primary); }
      .dam-status-dirty::before { background: var(--dsw-alias-state-warn-primary); }
      .dam-status-missing::before { background: var(--dsw-alias-state-idle-primary); }
      .dam-status-saving::before { background: var(--dsw-alias-brand-primary); }
      .dam-editor-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end; flex: none; }
      .dam-icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        border: 0;
        border-radius: 5px;
        color: var(--dsw-alias-label-secondary);
        background: transparent;
        cursor: pointer;
      }
      .dam-icon-btn:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
      .dam-missing-note {
        margin: 10px 14px 0;
        padding: 7px 10px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary) 30%, transparent);
        border-radius: 7px;
        color: var(--dsw-alias-state-warn-primary);
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 7%, transparent);
        font-size: 11.5px;
        line-height: 1.5;
      }
      .dam-textarea-wrap {
        display: flex;
        flex: 1;
        min-height: 0;
        padding: 0;
        background: var(--dsw-alias-bg-base);
      }
      .dam-textarea {
        box-sizing: border-box;
        flex: 1;
        width: 100%;
        min-height: 240px;
        margin: 0;
        padding: 14px 16px 18px;
        border: 0;
        resize: none;
        color: var(--dsw-alias-label-primary);
        background: transparent;
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 13px;
        line-height: 1.65;
        tab-size: 2;
        outline: none;
        scrollbar-width: thin;
      }
      .dam-textarea::placeholder { color: var(--dsw-alias-label-secondary); }
      .dam-editor-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 6px 14px;
        border-top: 1px solid var(--dsw-alias-border-l1);
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
        line-height: 1.4;
        flex: none;
      }
      .dam-editor-foot-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .dam-kbd {
        padding: 1px 5px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 4px;
        background: var(--dsw-alias-bg-layer-2);
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 9.5px;
      }
      .dam-notice {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 11px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px;
        font-size: 12px;
        line-height: 1.5;
        flex: none;
      }
      .dam-notice span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
      .dam-notice-success {
        color: var(--dsw-alias-state-success-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 30%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 7%, transparent);
      }
      .dam-notice-error {
        color: var(--dsw-alias-state-error-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 30%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 7%, transparent);
      }
      .dam-notice-info {
        color: var(--dsw-alias-label-secondary);
        background: var(--dsw-alias-bg-layer-2);
      }
      .dam-notice-close {
        border: 0;
        background: transparent;
        color: currentColor;
        cursor: pointer;
        padding: 0 2px;
        font: inherit;
        font-size: 15px;
        line-height: 1;
        opacity: 0.7;
      }
      .dam-notice-close:hover { opacity: 1; }
      .dam-empty {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 30px;
        color: var(--dsw-alias-label-secondary);
        text-align: center;
      }
      .dam-empty h2 { margin: 2px 0 0; color: var(--dsw-alias-label-primary); font-size: 15px; font-weight: 600; }
      .dam-empty p { margin: 0; font-size: 12px; line-height: 1.6; }
      .dam-empty-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 14px;
        color: var(--dsw-alias-brand-primary);
        background: var(--dsw-alias-bg-layer-2);
      }
      .dam-loading { padding: 30px; color: var(--dsw-alias-label-secondary); text-align: center; font-size: 12px; }
      .dam-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: var(--dsw-alias-bg-mask-1, rgba(0, 0, 0, 0.45));
      }
      .dam-modal {
        box-sizing: border-box;
        width: min(460px, 100%);
        max-height: calc(100vh - 36px);
        display: flex;
        flex-direction: column;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 12px;
        background: var(--dsw-alias-bg-overlay);
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.24);
        overflow: hidden;
      }
      .dam-modal-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 12px 14px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
      }
      .dam-modal-head h2 { margin: 0; font-size: 14px; font-weight: 650; }
      .dam-modal-close {
        border: 0;
        border-radius: 5px;
        width: 24px;
        height: 24px;
        color: var(--dsw-alias-label-secondary);
        background: transparent;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
      }
      .dam-modal-close:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
      .dam-modal-body { padding: 13px 14px; overflow: auto; }
      .dam-modal-foot {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        padding: 10px 14px;
        border-top: 1px solid var(--dsw-alias-border-l1);
      }
      .dam-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
      .dam-field > span { color: var(--dsw-alias-label-secondary); font-size: 11px; font-weight: 600; }
      .dam-help { margin: 0 0 10px; color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 1.55; }
      .dam-inline-error {
        margin-top: 8px;
        padding: 7px 9px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 30%, transparent);
        border-radius: 7px;
        color: var(--dsw-alias-state-error-primary);
        background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 7%, transparent);
        font-size: 11.5px;
        line-height: 1.5;
      }
      .dam-confirm-text { margin: 0; color: var(--dsw-alias-label-primary); font-size: 12.5px; line-height: 1.6; overflow-wrap: anywhere; }
      .dam-error-panel {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 18px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 30%, transparent);
        border-radius: 10px;
        color: var(--dsw-alias-state-error-primary);
        background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 6%, transparent);
        font-size: 12px;
        line-height: 1.55;
      }
      .dam-view-switch {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 2px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-2);
      }
      .dam-view-btn {
        border: 0;
        border-radius: 6px;
        padding: 4px 10px;
        color: var(--dsw-alias-label-secondary);
        background: transparent;
        font: inherit;
        font-size: 11.5px;
        line-height: 1.4;
        cursor: pointer;
      }
      .dam-view-btn:hover { color: var(--dsw-alias-label-primary); }
      .dam-view-btn-active {
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-layer-1);
        box-shadow: 0 1px 3px color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);
      }
      .dam-tree-shell {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-height: 0;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 12px;
        background: var(--dsw-alias-bg-layer-1);
        overflow: hidden;
      }
      .dam-tree-toolbar {
        display: flex;
        align-items: center;
        gap: 8px 10px;
        flex-wrap: wrap;
        padding: 9px 12px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
        flex: none;
      }
      .dam-tree-search { width: min(320px, 100%); max-width: 320px; }
      .dam-tree-toolbar-meta {
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
        line-height: 1.4;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .dam-tree-toolbar-actions { display: flex; align-items: center; gap: 6px; margin-left: auto; }
      .dam-tree-hint {
        padding: 6px 12px 0;
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
        line-height: 1.45;
        flex: none;
      }
      .dam-tree-canvas {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 26px 30px 42px;
      }
      .dam-tree-forest {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 18px;
        min-width: max-content;
      }
      .dam-tree-row {
        display: flex;
        align-items: flex-start;
        gap: 0;
        position: relative;
      }
      .dam-tree-children-wrap {
        display: grid;
        grid-template-columns: 0fr;
        grid-template-rows: 0fr;
        margin-left: 0;
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
        transition:
          grid-template-columns 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
          grid-template-rows 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
          margin-left 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
          opacity 160ms ease;
      }
      .dam-tree-children-wrap-open {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr);
        margin-left: 38px;
        opacity: 1;
        pointer-events: auto;
      }
      .dam-tree-children {
        display: flex;
        flex-direction: column;
        gap: 14px;
        position: relative;
        min-width: 0;
        min-height: 0;
        padding-left: 18px;
        overflow: hidden;
        visibility: hidden;
        transition: visibility 0s linear 220ms;
      }
      .dam-tree-children-wrap-open > .dam-tree-children {
        visibility: visible;
        transition-delay: 0s;
      }
      @media (prefers-reduced-motion: reduce) {
        .dam-tree-children-wrap { transition: none; }
        .dam-tree-card { transition: none; }
      }
      .dam-tree-children::before {
        content: "";
        position: absolute;
        left: 0;
        top: 28px;
        bottom: 28px;
        border-left: 1px solid var(--dsw-alias-border-l2);
      }
      .dam-tree-children > .dam-tree-row { position: relative; }
      .dam-tree-children > .dam-tree-row::before {
        content: "";
        position: absolute;
        left: -18px;
        top: 28px;
        width: 18px;
        border-top: 1px solid var(--dsw-alias-border-l2);
      }
      .dam-tree-card {
        box-sizing: border-box;
        width: 226px;
        padding: 8px 9px 8px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 10px;
        background: var(--dsw-alias-bg-layer-2);
        position: relative;
        cursor: pointer;
        transition: border-color 160ms ease, box-shadow 160ms ease;
      }
      .dam-tree-card-expanded {
        border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 45%, var(--dsw-alias-border-l2));
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 15%, transparent);
      }
      .dam-tree-card-expanded::after {
        content: "";
        position: absolute;
        right: -38px;
        top: 27px;
        width: 38px;
        border-top: 1px solid var(--dsw-alias-border-l2);
        pointer-events: none;
      }
      .dam-tree-card-head {
        display: flex;
        align-items: flex-start;
        gap: 7px;
        width: 100%;
        padding: 0;
        border: 0;
        color: inherit;
        background: transparent;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .dam-tree-card-head:disabled { cursor: default; opacity: 0.6; }
      .dam-tree-card-main { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
      .dam-tree-card-title {
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-size: 12.5px;
        font-weight: 650;
        line-height: 1.4;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-tree-card-path {
        overflow: hidden;
        color: var(--dsw-alias-label-secondary);
        font-size: 9.5px;
        line-height: 1.4;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-tree-caret {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 5px;
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        line-height: 1;
        flex: none;
      }
      .dam-tree-card-actions { display: flex; align-items: center; gap: 5px; margin-top: 7px; }
      .dam-node-skill-group {
        display: flex;
        align-items: center;
        gap: 4px;
        flex: 1;
        min-width: 0;
      }
      .dam-node-skill-group .dam-node-btn { flex: 1; min-width: 0; }
      .dam-node-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 23px;
        padding: 0 4px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 6px;
        font-size: 10px;
        font-weight: 700;
        line-height: 1;
        font-variant-numeric: tabular-nums;
        flex: none;
      }
      .dam-node-count-ready {
        color: var(--dsw-alias-state-success-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 36%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 8%, transparent);
      }
      .dam-node-count-missing {
        color: var(--dsw-alias-state-warn-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 38%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 8%, transparent);
      }
      .dam-node-btn {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        min-height: 23px;
        padding: 2px 5px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 6px;
        color: var(--dsw-alias-label-secondary);
        background: transparent;
        font: inherit;
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0.04em;
        line-height: 1.2;
        cursor: pointer;
      }
      .dam-node-btn:disabled { opacity: 0.45; cursor: default; }
      .dam-node-btn-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: currentColor;
        flex: none;
      }
      .dam-node-btn-ready {
        color: var(--dsw-alias-state-success-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 36%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 8%, transparent);
      }
      .dam-node-btn-ready:hover:not(:disabled) {
        background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 15%, transparent);
      }
      .dam-node-btn-missing {
        color: var(--dsw-alias-state-warn-primary);
        border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 38%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 8%, transparent);
      }
      .dam-node-btn-missing:hover:not(:disabled) {
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 15%, transparent);
      }
      .dam-tree-results-head {
        display: flex;
        flex-basis: 100%;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 10px;
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
      }
      .dam-tree-results { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 12px; }
      .dam-tree-results .dam-tree-card { width: 242px; }
      .dam-tree-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 220px;
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        text-align: center;
      }
      .dam-dialog-editor { display: flex; flex-direction: column; gap: 8px; }
      .dam-dialog-path {
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 11px;
        line-height: 1.45;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-dialog-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
      }
      .dam-dialog-textarea {
        box-sizing: border-box;
        width: 100%;
        min-height: 300px;
        max-height: 55vh;
        padding: 11px 12px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 8px;
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-base);
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 12.5px;
        line-height: 1.6;
        resize: vertical;
        outline: none;
      }
      .dam-dialog-textarea:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 1px;
      }
      .dam-dialog-status-ready { color: var(--dsw-alias-state-success-primary); }
      .dam-dialog-status-missing { color: var(--dsw-alias-state-warn-primary); }
      .dam-dialog-notice {
        padding: 6px 8px;
        border-radius: 6px;
        font-size: 11px;
        line-height: 1.5;
      }
      .dam-dialog-notice-success {
        color: var(--dsw-alias-state-success-primary);
        background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 8%, transparent);
      }
      .dam-dialog-notice-error {
        color: var(--dsw-alias-state-error-primary);
        background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent);
      }
      .dam-version-btn {
        min-height: 30px;
        padding: 4px 9px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 8px;
        color: var(--dsw-alias-label-secondary);
        background: transparent;
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 10.5px;
        line-height: 1.4;
        cursor: pointer;
      }
      .dam-version-btn:hover {
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-layer-2);
      }
      .dam-update-body { display: flex; flex-direction: column; gap: 10px; }
      .dam-update-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .dam-update-cell {
        padding: 8px 10px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-2);
      }
      .dam-update-label {
        display: block;
        margin-bottom: 3px;
        color: var(--dsw-alias-label-secondary);
        font-size: 10px;
        line-height: 1.4;
      }
      .dam-update-value {
        color: var(--dsw-alias-label-primary);
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 13px;
        font-weight: 600;
      }
      .dam-update-status {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 7px 9px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 7px;
        color: var(--dsw-alias-label-secondary);
        background: var(--dsw-alias-bg-layer-2);
        font-size: 11.5px;
        line-height: 1.5;
      }
      .dam-update-status::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--dsw-alias-state-idle-primary);
        flex: none;
      }
      .dam-update-status-ready { color: var(--dsw-alias-state-success-primary); }
      .dam-update-status-ready::before { background: var(--dsw-alias-state-success-primary); }
      .dam-update-status-new { color: var(--dsw-alias-state-warn-primary); }
      .dam-update-status-new::before { background: var(--dsw-alias-state-warn-primary); }
      .dam-update-status-error { color: var(--dsw-alias-state-error-primary); }
      .dam-update-status-error::before { background: var(--dsw-alias-state-error-primary); }
      .dam-update-notes {
        max-height: 190px;
        overflow: auto;
        padding: 9px 10px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 7px;
        color: var(--dsw-alias-label-secondary);
        background: var(--dsw-alias-bg-layer-2);
        font-size: 11.5px;
        line-height: 1.55;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      .dam-update-notes-title {
        margin-bottom: 5px;
        color: var(--dsw-alias-label-primary);
        font-size: 11px;
        font-weight: 600;
      }
      .dam-skill-panel { display: flex; flex-direction: column; gap: 8px; min-height: 280px; }
      .dam-skill-hint {
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }
      .dam-skill-toolbar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
      }
      .dam-skill-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 7px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-2);
      }
      .dam-skill-row-legacy {
        border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 25%, transparent);
      }
      .dam-skill-main {
        display: flex;
        flex-direction: column;
        gap: 1px;
        min-width: 0;
        flex: 1;
        border: 0;
        padding: 1px 2px;
        color: inherit;
        background: transparent;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .dam-skill-name {
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.4;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-skill-path {
        overflow: hidden;
        color: var(--dsw-alias-label-secondary);
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 9.5px;
        line-height: 1.4;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-skill-actions { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: flex-end; flex: none; }
      .dam-mini-btn {
        min-height: 23px;
        padding: 2px 7px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 6px;
        color: var(--dsw-alias-label-secondary);
        background: transparent;
        font: inherit;
        font-size: 10px;
        line-height: 1.2;
        white-space: nowrap;
        cursor: pointer;
      }
      .dam-mini-btn:hover:not(:disabled) {
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-layer-1);
      }
      .dam-mini-btn:disabled { opacity: 0.45; cursor: default; }
      .dam-mini-danger { color: var(--dsw-alias-state-error-primary); }
      .dam-mini-danger:hover:not(:disabled) { border-color: var(--dsw-alias-state-error-primary); }
      .dam-skill-form { display: flex; flex-direction: column; gap: 10px; }
      .dam-skill-form-hint {
        padding: 7px 9px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 7px;
        color: var(--dsw-alias-label-secondary);
        background: var(--dsw-alias-bg-layer-2);
        font-size: 10.5px;
        line-height: 1.5;
      }
      .dam-skill-field-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0;
      }
      .dam-skill-field-grid .dam-field { margin-bottom: 8px; }
      .dam-skill-textarea {
        min-height: 58px;
        resize: vertical;
        font-family: inherit;
        line-height: 1.5;
      }
      .dam-skill-section {
        padding: 8px 9px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-2);
      }
      .dam-skill-section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 3px;
      }
      .dam-skill-section-head strong { font-size: 11px; }
      .dam-required-star { color: var(--dsw-alias-state-error-primary); }
      .dam-meta-row {
        display: grid;
        grid-template-columns: minmax(100px, 0.8fr) minmax(140px, 1.2fr) auto;
        gap: 5px;
        margin-top: 5px;
      }
      .dam-meta-input { min-width: 0; }
      .dam-field-body { margin-bottom: 0; }
      .dam-skill-body { min-height: 210px; max-height: 40vh; }
      .dam-skill-tabs {
        display: flex;
        align-items: center;
        gap: 4px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
        padding-bottom: 5px;
      }
      .dam-skill-tab {
        min-height: 25px;
        padding: 3px 9px;
        border: 1px solid transparent;
        border-radius: 6px;
        color: var(--dsw-alias-label-secondary);
        background: transparent;
        font: inherit;
        font-size: 10.5px;
        cursor: pointer;
      }
      .dam-skill-tab:hover { background: var(--dsw-alias-bg-layer-2); }
      .dam-skill-tab-active {
        border-color: var(--dsw-alias-border-l2);
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-layer-2);
        font-weight: 600;
      }
      .dam-skill-files { display: flex; flex-direction: column; gap: 8px; }
      .dam-skill-file-create {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 6px;
        border: 1px dashed var(--dsw-alias-border-l2);
        border-radius: 7px;
      }
      .dam-skill-file-create .dam-input { flex: 1; min-width: 0; }
      .dam-skill-file-list {
        max-height: 190px;
        overflow: auto;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 7px;
        background: var(--dsw-alias-bg-layer-2);
      }
      .dam-skill-file-row {
        display: flex;
        align-items: center;
        gap: 7px;
        min-height: 26px;
        padding: 2px 7px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
      }
      .dam-skill-file-row:last-child { border-bottom: 0; }
      .dam-skill-file-root { background: var(--dsw-alias-bg-layer-1); }
      .dam-skill-file-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        border: 0;
        padding: 2px 0;
        color: var(--dsw-alias-label-primary);
        background: transparent;
        font: inherit;
        font-size: 11px;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
      .dam-skill-file-name:hover { color: var(--dsw-alias-brand-primary); }
      .dam-skill-file-meta {
        flex: none;
        color: var(--dsw-alias-label-secondary);
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 9px;
      }
      .dam-skill-file-editor {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding-top: 3px;
        border-top: 1px solid var(--dsw-alias-border-l1);
      }
      @media (max-width: 760px) {
        .dam-skill-field-grid { grid-template-columns: 1fr; }
        .dam-meta-row { grid-template-columns: 1fr 1fr; }
        .dam-skill-file-create { flex-wrap: wrap; }
      }
      .dam-catalog {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 10px;
        min-height: 0;
      }
      .dam-catalog-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        flex: none;
      }
      .dam-catalog-head .dam-title-row { gap: 9px; }
      .dam-catalog-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 9px;
        flex: none;
      }
      .dam-catalog-card {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
        padding: 9px 10px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 10px;
        color: inherit;
        background: var(--dsw-alias-bg-layer-1);
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .dam-catalog-card:hover { border-color: var(--dsw-alias-border-l2); }
      .dam-catalog-card-active {
        border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 50%, var(--dsw-alias-border-l1));
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 7%, var(--dsw-alias-bg-layer-1));
      }
      .dam-catalog-card-title { color: var(--dsw-alias-label-primary); font-size: 12.5px; font-weight: 650; }
      .dam-catalog-card-repo {
        overflow: hidden;
        color: var(--dsw-alias-label-secondary);
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 9.5px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-catalog-card-meta {
        overflow: hidden;
        color: var(--dsw-alias-label-secondary);
        font-size: 10px;
        line-height: 1.4;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-catalog-card-source { color: var(--dsw-alias-label-secondary); font-size: 9px; opacity: 0.7; }
      .dam-catalog-error { color: var(--dsw-alias-state-error-primary); }
      .dam-catalog-list {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-height: 0;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 10px;
        background: var(--dsw-alias-bg-layer-1);
        overflow: hidden;
      }
      .dam-catalog-toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        padding: 8px 10px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
        flex: none;
      }
      .dam-catalog-search { width: min(260px, 100%); }
      .dam-catalog-scroll { flex: 1; min-height: 0; overflow: auto; }
      .dam-catalog-skill {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 10px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
      }
      .dam-catalog-skill:last-child { border-bottom: 0; }
      .dam-catalog-skill-main { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
      .dam-catalog-skill-name {
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-size: 12px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-catalog-skill-path {
        overflow: hidden;
        color: var(--dsw-alias-label-secondary);
        font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 9.5px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dam-catalog-skill-actions { display: flex; align-items: center; gap: 5px; flex: none; }
      .dam-catalog-skill-actions .dam-btn { min-height: 25px; padding: 3px 8px; font-size: 10.5px; }
      @media (max-width: 860px) {
        .dam-catalog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 860px) {
        .dam-root { padding: 14px; height: auto; min-height: 100%; overflow: visible; }
        .dam-layout {
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: minmax(180px, 34vh) minmax(380px, 1fr);
          flex: none;
        }
        .dam-header { flex-direction: column; }
        .dam-header-actions { width: 100%; flex-wrap: wrap; }
        .dam-header-actions .dam-btn { flex: 1; }
        .dam-view-switch { flex: none; }
        .dam-editor-head { flex-direction: column; }
        .dam-editor-actions { justify-content: flex-start; }
      }
    `;

    function tr(t, key, params) {
      let value;
      try {
        value = t(key);
      } catch {
        value = undefined;
      }
      if (value === undefined || value === null || value === key) value = FALLBACK[key] ?? key;
      if (params && typeof value === 'string') {
        for (const [name, replacement] of Object.entries(params)) {
          value = value.replaceAll(`{${name}}`, String(replacement));
        }
      }
      return value;
    }

    function errorText(t, error) {
      if (error && error.code === 'error.conflict') return tr(t, 'conflict');
      if (error && error.code === 'error.invalidFileName') return tr(t, 'invalidPath');
      return String((error && error.message) || error || 'unknown error');
    }

    async function request(path, init = {}) {
      const headers = {
        accept: 'application/json',
        ...(init.body === undefined ? {} : {
          'content-type': 'application/json',
          [MARKER]: '1',
        }),
        ...(init.headers || {}),
      };
      const response = await fetch(`${API}${path}`, {
        ...init,
        cache: 'no-store',
        headers,
      });
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new Error(`HTTP ${response.status}`);
      }
      if (!response.ok || !payload || payload.ok !== true) {
        const error = new Error(payload && payload.error ? payload.error : `HTTP ${response.status}`);
        error.code = payload && payload.code ? payload.code : 'error.http';
        error.status = response.status;
        throw error;
      }
      return payload.data;
    }

    function targetKey(target) {
      if (!target || typeof target !== 'object') return '';
      if (target.scope === 'global') return 'global';
      if (target.scope === 'workspace') return `workspace:${target.workspaceId}:${target.relativePath}`;
      return '';
    }

    function findTarget(snapshot, target) {
      if (!snapshot || !target) return null;
      if (target.scope === 'global') return snapshot.global ? snapshot.global.target : null;
      if (target.scope === 'workspace') {
        const workspace = (snapshot.workspaces || []).find((item) => item.id === target.workspaceId);
        if (!workspace) return null;
        const file = (workspace.files || []).find((item) => (
          target.file
            ? (target.file === 'agents' && item.relativePath === 'AGENTS.md')
            : item.relativePath === target.relativePath
        ));
        if (target.file === 'skill') return workspace.skill || target;
        if (target.file === 'agents') return workspace.agents || file?.target || target;
        return file ? file.target : target;
      }
      return null;
    }

    function normalizeClientPath(value) {
      let next = String(value || '').trim().replaceAll('\\', '/').replace(/^\/+/, '');
      if (!next) return '';
      const parts = next.split('/');
      if (parts.some((part) => part === '' || part === '.' || part === '..')) return '';
      return parts.join('/');
    }

    function formatTime(value) {
      if (!value) return '';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleString();
    }

    function SvgIcon({ size = 14, children }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 16 16',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        focusable: false,
      }, children);
    }

    function ManagerIcon({ size = 18, active = false }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        focusable: false,
        style: { display: 'block', opacity: active ? 1 : 0.9 },
      },
      h('path', { d: 'M6.5 12h4M10.5 12V7h3.5M10.5 12v5h3.5' }),
      h('rect', { x: 3, y: 9.5, width: 4.5, height: 5, rx: 1.2 }),
      h('rect', { x: 15, y: 4.5, width: 4.5, height: 5, rx: 1.2 }),
      h('rect', { x: 15, y: 14.5, width: 4.5, height: 5, rx: 1.2 }));
    }

    function RefreshIcon() {
      return h(SvgIcon, null,
        h('path', { d: 'M13.2 5.6A5.2 5.2 0 1 0 13.3 10' }),
        h('path', { d: 'M13.4 2.9v3h-3' }));
    }

    function PlusIcon() {
      return h(SvgIcon, null, h('path', { d: 'M8 3v10M3 8h10' }));
    }

    function SaveIcon() {
      return h(SvgIcon, null,
        h('path', { d: 'M3.2 2.8h8.1l1.9 1.9v8.5H3.2z' }),
        h('path', { d: 'M5.4 2.8v3.5h5V2.8M5.4 13.2V9.4h5.2v3.8' }));
    }

    function TrashIcon() {
      return h(SvgIcon, null,
        h('path', { d: 'M3.2 4.5h9.6M6.2 4.5V2.9h3.6v1.6M4.5 4.5l.6 8.6h5.8l.6-8.6' }),
        h('path', { d: 'M6.8 7v3.9M9.2 7v3.9' }));
    }

    function ReloadIcon() {
      return h(SvgIcon, null,
        h('path', { d: 'M12.6 6.2A4.8 4.8 0 1 0 12.8 10' }),
        h('path', { d: 'M12.8 3.2v3.2H9.6' }));
    }

    function CopyIcon() {
      return h(SvgIcon, { size: 12 },
        h('rect', { x: 5.3, y: 5.3, width: 7.2, height: 7.2, rx: 1 }),
        h('path', { d: 'M10.7 5.3V4.1a1 1 0 0 0-1-1H4.1a1 1 0 0 0-1 1v5.6a1 1 0 0 0 1 1h1.2' }));
    }

    function FileIcon({ size = 15 }) {
      return h(SvgIcon, { size },
        h('path', { d: 'M4 2.5h5.1L12.5 5.9v7.6H4z' }),
        h('path', { d: 'M9.1 2.5v3.4h3.4M6 8h4.5M6 10.5h3.1' }));
    }

    function Dialog({ title, children, footer, onClose, wide = false }) {
      useEffect(() => {
        const onKeyDown = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopImmediatePropagation();
            onClose();
          }
        };
        document.addEventListener('keydown', onKeyDown, true);
        return () => document.removeEventListener('keydown', onKeyDown, true);
      }, [onClose]);

      return h('div', {
        className: 'dam-modal-backdrop',
        role: 'presentation',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) onClose();
        },
      },
      h('div', {
        className: 'dam-modal',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': title,
        style: wide ? { width: 'min(720px, 100%)' } : undefined,
      },
      h('div', { className: 'dam-modal-head' },
        h('h2', null, title),
        h('button', { type: 'button', className: 'dam-modal-close', 'aria-label': 'Close', onClick: onClose }, '×')),
      h('div', { className: 'dam-modal-body' }, children),
      footer ? h('div', { className: 'dam-modal-foot' }, footer) : null));
    }

    function skillTarget(workspace, skill) {
      if (workspace.global) {
        return { scope: 'global', skillName: skill?.skillName };
      }
      if (skill?.legacy) {
        return { scope: 'workspace', workspaceId: workspace.id, file: 'skill' };
      }
      return {
        scope: 'workspace',
        workspaceId: workspace.id,
        skillName: skill?.skillName,
      };
    }

    function emptySkillFields() {
      return {
        name: '',
        description: '',
        license: '',
        compatibility: '',
        allowedTools: '',
        metadata: [],
      };
    }

    function skillFieldsFromPayload(fields = {}) {
      const metadata = fields.metadata && typeof fields.metadata === 'object' && !Array.isArray(fields.metadata)
        ? Object.entries(fields.metadata).map(([key, value]) => ({ key, value: String(value ?? '') }))
        : [];
      return {
        name: fields.name || '',
        description: fields.description || '',
        license: fields.license || '',
        compatibility: fields.compatibility || '',
        allowedTools: fields.allowedTools || fields['allowed-tools'] || '',
        metadata,
      };
    }

    function skillFieldsPayload(fields) {
      const metadata = {};
      for (const row of fields.metadata || []) {
        const key = String(row.key ?? '').trim();
        if (key) metadata[key] = String(row.value ?? '');
      }
      return {
        name: fields.name.trim(),
        description: fields.description,
        license: fields.license,
        compatibility: fields.compatibility,
        allowedTools: fields.allowedTools,
        metadata,
      };
    }

    function sameSkillFields(left, right) {
      return JSON.stringify(skillFieldsPayload(left)) === JSON.stringify(skillFieldsPayload(right));
    }

    function SkillManagerDialog({ workspace, t, onClose, onRefresh }) {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState('');
      const [notice, setNotice] = useState(null);
      const [view, setView] = useState('list');
      const [selected, setSelected] = useState(null);
      const [doc, setDoc] = useState(null);
      const [draft, setDraft] = useState('');
      const [fields, setFields] = useState(emptySkillFields);
      const [body, setBody] = useState('');
      const [extra, setExtra] = useState([]);
      const [original, setOriginal] = useState(null);
      const [activeTab, setActiveTab] = useState('info');
      const [files, setFiles] = useState(null);
      const [filesLoading, setFilesLoading] = useState(false);
      const [fileDoc, setFileDoc] = useState(null);
      const [fileDraft, setFileDraft] = useState('');
      const [entryPath, setEntryPath] = useState('');
      const [name, setName] = useState('');
      const [url, setUrl] = useState('');
      const [library, setLibrary] = useState(null);
      const draftRef = useRef('');
      const { ask: askConfirm, confirmElement } = useConfirmDialog(t);
      draftRef.current = draft;

      useEffect(() => {
        void load();
      }, []);

      async function load() {
        setLoading(true);
        setError('');
        try {
          const result = await request('/skills/list', {
            method: 'POST',
            body: JSON.stringify({ workspaceId: workspace.id }),
          });
          setData(result);
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setLoading(false);
        }
      }

      async function refreshAll() {
        await load();
        if (onRefresh) {
          try {
            await onRefresh();
          } catch {
            // The local skill list is still current.
          }
        }
      }

      function resetEditor() {
        setSelected(null);
        setDoc(null);
        setDraft('');
        setFields(emptySkillFields());
        setBody('');
        setExtra([]);
        setOriginal(null);
        setActiveTab('info');
        setFiles(null);
        setFileDoc(null);
        setFileDraft('');
        setEntryPath('');
        setError('');
      }

      function startCreate() {
        resetEditor();
        setNotice(null);
        setView('create');
      }

      function isDirty() {
        if (view === 'create') {
          return Boolean(
            fields.name.trim()
            || fields.description.trim()
            || fields.license
            || fields.compatibility
            || fields.allowedTools
            || body
            || fields.metadata.some((row) => row.key || row.value)
          );
        }
        if (view !== 'edit') return false;
        if (selected?.legacy) return Boolean(doc && draft !== doc.content);
        return Boolean(
          (original && (!sameSkillFields(fields, original.fields) || body !== original.body))
          || (fileDoc && fileDraft !== fileDoc.content)
        );
      }

      async function goList() {
        if (isDirty() && !(await askConfirm(tr(t, 'discardConfirm')))) return;
        resetEditor();
        setView('list');
      }

      async function openSkill(skill) {
        const legacy = skill.legacy === true;
        resetEditor();
        setSelected({ ...skill, legacy });
        setView('edit');
        setLoading(true);
        try {
          if (legacy) {
            const result = await request('/read', {
              method: 'POST',
              body: JSON.stringify({ target: skillTarget(workspace, { ...skill, legacy }) }),
            });
            setDoc(result);
            setDraft(result.content);
          } else {
            const result = await request('/skills/read', {
              method: 'POST',
              body: JSON.stringify({ workspaceId: workspace.id, name: skill.skillName }),
            });
            const nextFields = skillFieldsFromPayload(result.fields);
            nextFields.name = nextFields.name || skill.skillName;
            const nextBody = result.body || '';
            setDoc(result);
            setFields(nextFields);
            setBody(nextBody);
            setExtra(Array.isArray(result.extra) ? result.extra : []);
            setOriginal({ fields: nextFields, body: nextBody });
          }
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setLoading(false);
        }
      }

      async function loadFiles(showLoading = true) {
        if (showLoading) setFilesLoading(true);
        setError('');
        try {
          const result = await request('/skills/files', {
            method: 'POST',
            body: JSON.stringify({ workspaceId: workspace.id, name: selected.skillName }),
          });
          setFiles(result);
          return result;
        } catch (caught) {
          setError(errorText(t, caught));
          return null;
        } finally {
          if (showLoading) setFilesLoading(false);
        }
      }

      async function openFilesTab() {
        setActiveTab('files');
        setError('');
        if (!files) await loadFiles();
      }

      async function readFile(entry) {
        if (entry.type === 'directory') return;
        if (fileDoc && fileDraft !== fileDoc.content
          && !(await askConfirm(tr(t, 'discardConfirm')))) return;
        setFilesLoading(true);
        setError('');
        try {
          const result = await request('/skills/file/read', {
            method: 'POST',
            body: JSON.stringify({
              workspaceId: workspace.id,
              name: selected.skillName,
              relativePath: entry.relativePath,
            }),
          });
          setFileDoc(result);
          setFileDraft(result.content || '');
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setFilesLoading(false);
        }
      }

      async function saveFile() {
        if (!fileDoc || fileDoc.binary) return;
        setBusy(true);
        setError('');
        try {
          const result = await request('/skills/file/save', {
            method: 'POST',
            body: JSON.stringify({
              workspaceId: workspace.id,
              name: selected.skillName,
              relativePath: fileDoc.relativePath,
              content: fileDraft,
              expectedMtimeMs: fileDoc.mtimeMs,
            }),
          });
          setFileDoc((previous) => previous ? { ...previous, ...result, content: fileDraft } : previous);
          setNotice({ kind: 'success', text: tr(t, 'fileSaved', { path: fileDoc.relativePath }) });
          await loadFiles(false);
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setBusy(false);
        }
      }

      async function createEntry(kind) {
        const relativePath = entryPath.trim().replaceAll('\\', '/').replace(/^\/+/, '');
        if (!relativePath) {
          setError(tr(t, 'entryPathRequired'));
          return;
        }
        const existing = files?.entries?.find((entry) => entry.relativePath === relativePath);
        if (existing) {
          setError(tr(t, 'fileExists'));
          return;
        }
        setBusy(true);
        setError('');
        try {
          if (kind === 'folder') {
            await request('/skills/folder/create', {
              method: 'POST',
              body: JSON.stringify({ workspaceId: workspace.id, name: selected.skillName, relativePath }),
            });
            setNotice({ kind: 'success', text: tr(t, 'folderCreated', { path: relativePath }) });
          } else {
            await request('/skills/file/save', {
              method: 'POST',
              body: JSON.stringify({
                workspaceId: workspace.id,
                name: selected.skillName,
                relativePath,
                content: '',
                createOnly: true,
              }),
            });
            setNotice({ kind: 'success', text: tr(t, 'fileSaved', { path: relativePath }) });
          }
          setEntryPath('');
          const next = await loadFiles(false);
          if (kind === 'file') {
            const created = next?.entries?.find((entry) => entry.relativePath === relativePath);
            if (created) await readFile(created);
          }
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setBusy(false);
        }
      }

      async function deleteEntry(entry) {
        if (!(await askConfirm(tr(t, 'confirmEntryDelete', { path: entry.relativePath }), { danger: true }))) return;
        setBusy(true);
        setError('');
        try {
          await request('/skills/file/delete', {
            method: 'POST',
            body: JSON.stringify({
              workspaceId: workspace.id,
              name: selected.skillName,
              relativePath: entry.relativePath,
              recursive: entry.type === 'directory',
            }),
          });
          if (fileDoc && (fileDoc.relativePath === entry.relativePath
            || fileDoc.relativePath.startsWith(`${entry.relativePath}/`))) {
            setFileDoc(null);
            setFileDraft('');
          }
          setNotice({ kind: 'success', text: tr(t, 'fileDeleted', { path: entry.relativePath }) });
          await loadFiles(false);
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setBusy(false);
        }
      }

      async function saveSelected() {
        if (!selected || !doc) return;
        setBusy(true);
        setError('');
        try {
          if (selected.legacy) {
            const result = await request('/save', {
              method: 'POST',
              body: JSON.stringify({
                target: skillTarget(workspace, selected),
                content: draftRef.current,
                expectedMtimeMs: doc.mtimeMs,
                eol: doc.eol,
                bom: doc.bom,
              }),
            });
            setDoc((previous) => previous ? { ...previous, ...result, content: draftRef.current } : previous);
            setNotice({ kind: 'success', text: tr(t, 'savedNotice', { path: result.path }) });
          } else {
            const result = await request('/skills/save', {
              method: 'POST',
              body: JSON.stringify({
                workspaceId: workspace.id,
                name: selected.skillName,
                ...skillFieldsPayload(fields),
                body,
                extra,
                expectedMtimeMs: doc.mtimeMs,
                eol: doc.eol,
                bom: doc.bom,
              }),
            });
            const nextFields = skillFieldsFromPayload(result.fields);
            setDoc((previous) => previous ? { ...previous, ...result } : previous);
            setFields(nextFields);
            setBody(result.body || '');
            setOriginal({ fields: nextFields, body: result.body || '' });
            setNotice({ kind: 'success', text: tr(t, 'savedNotice', { path: result.path }) });
          }
          await refreshAll();
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setBusy(false);
        }
      }

      async function removeSkill(skill) {
        const target = skillTarget(workspace, skill);
        const message = skill.legacy
          ? tr(t, 'confirmLegacyDelete')
          : tr(t, 'confirmSkillDelete', { name: skill.skillName });
        if (!(await askConfirm(message, { danger: true }))) return;
        setBusy(true);
        setError('');
        try {
          if (skill.legacy) {
            const current = await request('/read', {
              method: 'POST',
              body: JSON.stringify({ target }),
            });
            await request('/delete', {
              method: 'POST',
              body: JSON.stringify({ target, expectedMtimeMs: current.mtimeMs }),
            });
          } else {
            await request('/skills/delete', {
              method: 'POST',
              body: JSON.stringify({ workspaceId: workspace.id, name: skill.skillName }),
            });
          }
          setNotice({ kind: 'success', text: tr(t, 'skillDeleted', { name: skill.skillName || 'SKILL.md' }) });
          if (selected && selected.legacy === skill.legacy && selected.skillName === skill.skillName) {
            resetEditor();
            setView('list');
          }
          await refreshAll();
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setBusy(false);
        }
      }

      async function createNew() {
        if (!fields.name.trim()) {
          setError(tr(t, 'skillNameRequired'));
          return;
        }
        if (!fields.description.trim()) {
          setError(tr(t, 'skillDescriptionRequired'));
          return;
        }
        setBusy(true);
        setError('');
        try {
          await request('/skills/create', {
            method: 'POST',
            body: JSON.stringify({
              workspaceId: workspace.id,
              ...skillFieldsPayload(fields),
              body,
            }),
          });
          setNotice({ kind: 'success', text: tr(t, 'skillCreated', { name: fields.name.trim() }) });
          resetEditor();
          setView('list');
          await refreshAll();
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setBusy(false);
        }
      }

      function updateField(key, value) {
        setFields((previous) => ({ ...previous, [key]: value }));
      }

      function updateMetadata(index, key, value) {
        setFields((previous) => ({
          ...previous,
          metadata: previous.metadata.map((row, rowIndex) => (
            rowIndex === index ? { ...row, [key]: value } : row
          )),
        }));
      }

      function addMetadata() {
        setFields((previous) => ({
          ...previous,
          metadata: [...previous.metadata, { key: '', value: '' }],
        }));
      }

      function removeMetadata(index) {
        setFields((previous) => ({
          ...previous,
          metadata: previous.metadata.filter((_, rowIndex) => rowIndex !== index),
        }));
      }

      async function importFromUrl() {
        if (!url.trim()) return;
        setBusy(true);
        setError('');
        try {
          const result = await request('/skills/import', {
            method: 'POST',
            body: JSON.stringify({
              workspaceId: workspace.id,
              name: name.trim(),
              url: url.trim(),
            }),
          });
          setNotice({ kind: 'success', text: tr(t, 'skillImported', { name: result.skillName }) });
          setName('');
          setUrl('');
          setView('list');
          await refreshAll();
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setBusy(false);
        }
      }

      async function openLibrary() {
        setView('library');
        setError('');
        setLoading(true);
        try {
          const result = await request('/skills/library');
          setLibrary(result);
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setLoading(false);
        }
      }

      async function saveToLibrary(skill) {
        if (skill.legacy) return;
        setBusy(true);
        setError('');
        try {
          await request('/skills/library/save', {
            method: 'POST',
            body: JSON.stringify({ workspaceId: workspace.id, name: skill.skillName }),
          });
          setNotice({ kind: 'success', text: tr(t, 'skillSavedToLibrary', { name: skill.skillName }) });
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setBusy(false);
        }
      }

      async function installFromLibrary(item) {
        setBusy(true);
        setError('');
        try {
          await request('/skills/library/install', {
            method: 'POST',
            body: JSON.stringify({ workspaceId: workspace.id, name: item.name }),
          });
          setNotice({ kind: 'success', text: tr(t, 'skillInstalled', { name: item.name }) });
          await refreshAll();
          await openLibrary();
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setBusy(false);
        }
      }

      function renderList() {
        if (loading && !data) return h('div', { className: 'dam-loading' }, tr(t, 'loading'));
        if (!data) return h('div', { className: 'dam-tree-empty' }, error || tr(t, 'noSkills'));
        const nativeSkills = data.skills || [];
        return h('div', { className: 'dam-skill-panel' },
          h('div', { className: 'dam-skill-hint' }, tr(t, 'skillManagerHint')),
          h('div', { className: 'dam-skill-toolbar' },
            h('button', {
              type: 'button',
              className: 'dam-btn dam-btn-primary',
              onClick: startCreate,
            }, tr(t, 'newSkill')),
            h('button', {
              type: 'button',
              className: 'dam-btn',
              onClick: () => { setView('import'); setName(''); setUrl(''); setError(''); },
            }, tr(t, 'importSkill')),
            h('button', {
              type: 'button',
              className: 'dam-btn',
              onClick: openLibrary,
            }, tr(t, 'skillLibrary'))),
          data.legacy?.exists ? h('div', { className: 'dam-skill-row dam-skill-row-legacy' },
            h('button', { type: 'button', className: 'dam-skill-main', onClick: () => openSkill({ ...data.legacy, legacy: true }) },
              h('span', { className: 'dam-skill-name' }, tr(t, 'legacySkill')),
              h('span', { className: 'dam-skill-path' }, data.legacy.path)),
            h('div', { className: 'dam-skill-actions' },
              h('button', { type: 'button', className: 'dam-mini-btn', onClick: () => openSkill({ ...data.legacy, legacy: true }) }, tr(t, 'edit')),
              h('button', { type: 'button', className: 'dam-mini-btn dam-mini-danger', onClick: () => removeSkill({ ...data.legacy, legacy: true }) }, tr(t, 'delete')))) : null,
          nativeSkills.length
            ? nativeSkills.map((skill) => h('div', { className: 'dam-skill-row', key: skill.skillName },
              h('button', { type: 'button', className: 'dam-skill-main', onClick: () => openSkill(skill) },
                h('span', { className: 'dam-skill-name' }, skill.skillName),
                h('span', { className: 'dam-skill-path' }, skill.path)),
              h('div', { className: 'dam-skill-actions' },
                h('button', { type: 'button', className: 'dam-mini-btn', onClick: () => saveToLibrary(skill), disabled: busy }, tr(t, 'saveToLibrary')),
                h('button', { type: 'button', className: 'dam-mini-btn', onClick: () => openSkill(skill), disabled: busy }, tr(t, 'edit')),
                h('button', { type: 'button', className: 'dam-mini-btn dam-mini-danger', onClick: () => removeSkill(skill), disabled: busy }, tr(t, 'delete')))))
            : h('div', { className: 'dam-tree-empty' }, tr(t, 'noSkills')));
      }

      function renderSkillForm(isCreate) {
        return h('div', { className: 'dam-skill-form' },
          h('div', { className: 'dam-skill-form-hint' }, tr(t, 'skillFormHint')),
          h('div', { className: 'dam-skill-field-grid' },
            h('label', { className: 'dam-field' },
              h('span', null, `${tr(t, 'skillName')} (name)`, h('span', { className: 'dam-required-star' }, ' *')),
              h('input', {
                className: 'dam-input',
                value: fields.name,
                disabled: !isCreate,
                autoFocus: isCreate,
                onChange: (event) => updateField('name', event.target.value),
              }),
              h('small', { className: 'dam-help' }, isCreate ? tr(t, 'skillNameSpecHint') : tr(t, 'skillNameFixed'))),
            h('label', { className: 'dam-field' },
              h('span', null, `${tr(t, 'skillDescription')} (description)`, h('span', { className: 'dam-required-star' }, ' *')),
              h('textarea', {
                className: 'dam-input dam-skill-textarea',
                rows: 3,
                value: fields.description,
                onChange: (event) => updateField('description', event.target.value),
              }),
              h('small', { className: 'dam-help' }, tr(t, 'skillDescriptionHint'))),
            h('label', { className: 'dam-field' },
              h('span', null, `${tr(t, 'skillLicense')} (license)`),
              h('input', {
                className: 'dam-input',
                value: fields.license,
                placeholder: 'MIT / Apache-2.0 / LICENSE.txt',
                onChange: (event) => updateField('license', event.target.value),
              })),
            h('label', { className: 'dam-field' },
              h('span', null, `${tr(t, 'skillCompatibility')} (compatibility)`),
              h('textarea', {
                className: 'dam-input dam-skill-textarea',
                rows: 2,
                value: fields.compatibility,
                onChange: (event) => updateField('compatibility', event.target.value),
              }),
              h('small', { className: 'dam-help' }, tr(t, 'skillCompatibilityHint')))),
          h('div', { className: 'dam-skill-section' },
            h('div', { className: 'dam-skill-section-head' },
              h('strong', null, `${tr(t, 'skillMetadata')} (metadata)`),
              h('button', { type: 'button', className: 'dam-mini-btn', onClick: addMetadata, disabled: busy }, tr(t, 'addMetadata'))),
            h('div', { className: 'dam-skill-hint' }, tr(t, 'metadataHint')),
            fields.metadata.length
              ? fields.metadata.map((row, index) => h('div', { className: 'dam-meta-row', key: `metadata-${index}` },
                h('input', {
                  className: 'dam-input dam-meta-input',
                  value: row.key,
                  placeholder: tr(t, 'metadataKey'),
                  onChange: (event) => updateMetadata(index, 'key', event.target.value),
                }),
                h('input', {
                  className: 'dam-input dam-meta-input',
                  value: row.value,
                  placeholder: tr(t, 'metadataValue'),
                  onChange: (event) => updateMetadata(index, 'value', event.target.value),
                }),
                h('button', {
                  type: 'button',
                  className: 'dam-mini-btn dam-mini-danger',
                  onClick: () => removeMetadata(index),
                  disabled: busy,
                }, tr(t, 'remove'))))
              : null),
          h('label', { className: 'dam-field' },
            h('span', null, `${tr(t, 'skillAllowedTools')} (allowed-tools)`),
            h('input', {
              className: 'dam-input',
              value: fields.allowedTools,
              placeholder: 'Bash(git:*) Read',
              onChange: (event) => updateField('allowedTools', event.target.value),
            }),
            h('small', { className: 'dam-help' }, tr(t, 'skillAllowedToolsHint'))),
          h('label', { className: 'dam-field dam-field-body' },
            h('span', null, `${tr(t, 'skillBody')} (body)`),
            h('textarea', {
              className: 'dam-dialog-textarea dam-skill-body',
              value: body,
              spellCheck: false,
              placeholder: '# Instructions\n\nDescribe the workflow, examples, and edge cases.',
              onChange: (event) => setBody(event.target.value),
              onKeyDown: (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
                  event.preventDefault();
                  if (!busy) {
                    if (isCreate) void createNew();
                    else void saveSelected();
                  }
                }
              },
            }),
            h('small', { className: 'dam-help' }, tr(t, 'skillBodyHint'))));
      }

      function renderFiles() {
        if (filesLoading && !files) return h('div', { className: 'dam-loading' }, tr(t, 'loading'));
        const entries = files?.entries || [];
        return h('div', { className: 'dam-skill-files' },
          h('div', { className: 'dam-skill-hint' }, tr(t, 'skillFilesHint')),
          h('div', { className: 'dam-skill-file-create' },
            h('input', {
              className: 'dam-input',
              value: entryPath,
              placeholder: tr(t, 'entryPathHint'),
              onChange: (event) => setEntryPath(event.target.value),
            }),
            h('button', { type: 'button', className: 'dam-btn', onClick: () => createEntry('folder'), disabled: busy }, tr(t, 'newSkillFolder')),
            h('button', { type: 'button', className: 'dam-btn dam-btn-primary', onClick: () => createEntry('file'), disabled: busy }, tr(t, 'newSkillFile'))),
          h('div', { className: 'dam-skill-file-list' },
            h('div', { className: 'dam-skill-file-row dam-skill-file-root' },
              h('button', {
                type: 'button',
                className: 'dam-skill-file-name',
                onClick: () => setActiveTab('info'),
              }, tr(t, 'rootSkill')),
              h('span', { className: 'dam-skill-file-meta' }, 'SKILL.md')),
            entries.length
              ? entries.map((entry) => h('div', {
                className: 'dam-skill-file-row',
                key: entry.relativePath,
                style: { paddingLeft: `${8 + (entry.relativePath.split('/').length - 1) * 14}px` },
              },
              entry.type === 'file'
                ? h('button', { type: 'button', className: 'dam-skill-file-name', onClick: () => readFile(entry) }, entry.name)
                : h('span', { className: 'dam-skill-file-name' }, `▸ ${entry.name}`),
              h('span', { className: 'dam-skill-file-meta' }, entry.type === 'file' ? `${entry.size} B` : ''),
              h('button', {
                type: 'button',
                className: 'dam-mini-btn dam-mini-danger',
                onClick: () => deleteEntry(entry),
                disabled: busy,
              }, tr(t, 'delete'))))
              : h('div', { className: 'dam-skill-hint' }, tr(t, 'skillFilesEmpty'))),
          fileDoc ? h('div', { className: 'dam-skill-file-editor' },
            h('div', { className: 'dam-dialog-path' }, fileDoc.relativePath),
            fileDoc.binary
              ? h('div', { className: 'dam-skill-hint' }, tr(t, 'binaryFile'))
              : h('textarea', {
                className: 'dam-dialog-textarea dam-skill-body',
                value: fileDraft,
                spellCheck: false,
                onChange: (event) => setFileDraft(event.target.value),
                onKeyDown: (event) => {
                  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
                    event.preventDefault();
                    if (!busy) void saveFile();
                  }
                },
              }),
            h('div', { className: 'dam-skill-toolbar' },
              h('button', { type: 'button', className: 'dam-btn', onClick: () => { setFileDoc(null); setFileDraft(''); } }, tr(t, 'close')),
              h('button', { type: 'button', className: 'dam-btn dam-btn-primary', onClick: saveFile, disabled: busy || fileDoc.binary }, busy ? tr(t, 'saving') : tr(t, 'save'))))
            : null);
      }

      function renderEditor() {
        if (loading) return h('div', { className: 'dam-loading' }, tr(t, 'loading'));
        if (!selected || !doc) return h('div', { className: 'dam-tree-empty' }, error || tr(t, 'noSkills'));
        if (selected.legacy) {
          return h('div', { className: 'dam-skill-panel' },
            h('div', { className: 'dam-dialog-path', title: doc.path }, doc.path),
            h('div', { className: 'dam-dialog-meta' },
              h('span', { className: 'dam-dialog-status-missing' }, tr(t, 'legacySkill')),
              doc.exists ? h('span', null, tr(t, 'modified', { time: formatTime(doc.modifiedAt) })) : h('span', null, tr(t, 'missing'))),
            h('textarea', {
              className: 'dam-dialog-textarea',
              value: draft,
              spellCheck: false,
              placeholder: tr(t, 'filePlaceholder', { file: 'SKILL.md' }),
              'aria-label': tr(t, 'filePlaceholder', { file: 'SKILL.md' }),
              onChange: (event) => setDraft(event.target.value),
              onKeyDown: (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
                  event.preventDefault();
                  if (!busy) void saveSelected();
                }
              },
            }),
            h('div', { className: 'dam-skill-toolbar' },
              h('button', { type: 'button', className: 'dam-btn', onClick: goList }, tr(t, 'back')),
              h('button', { type: 'button', className: 'dam-btn dam-btn-danger', onClick: () => removeSkill(selected), disabled: busy }, tr(t, 'delete')),
              h('button', { type: 'button', className: 'dam-btn dam-btn-primary', onClick: saveSelected, disabled: busy }, busy ? tr(t, 'saving') : tr(t, 'save'))));
        }
        return h('div', { className: 'dam-skill-panel' },
          h('div', { className: 'dam-dialog-path', title: doc.path }, doc.path),
          h('div', { className: 'dam-dialog-meta' },
            h('span', { className: 'dam-dialog-status-ready' }, selected.skillName),
            doc.exists ? h('span', null, tr(t, 'modified', { time: formatTime(doc.modifiedAt) })) : h('span', null, tr(t, 'missing'))),
          h('div', { className: 'dam-skill-tabs' },
            h('button', {
              type: 'button',
              className: `dam-skill-tab${activeTab === 'info' ? ' dam-skill-tab-active' : ''}`,
              onClick: () => setActiveTab('info'),
            }, tr(t, 'skillTabInfo')),
            h('button', {
              type: 'button',
              className: `dam-skill-tab${activeTab === 'files' ? ' dam-skill-tab-active' : ''}`,
              onClick: openFilesTab,
            }, tr(t, 'skillTabFiles'))),
          activeTab === 'files' ? renderFiles() : renderSkillForm(false),
          h('div', { className: 'dam-skill-toolbar' },
            h('button', { type: 'button', className: 'dam-btn', onClick: goList }, tr(t, 'back')),
            h('button', { type: 'button', className: 'dam-btn dam-btn-danger', onClick: () => removeSkill(selected), disabled: busy }, tr(t, 'delete')),
            h('button', { type: 'button', className: 'dam-btn dam-btn-primary', onClick: saveSelected, disabled: busy }, busy ? tr(t, 'saving') : tr(t, 'save'))));
      }

      function renderCreate() {
        return h('div', { className: 'dam-skill-panel' },
          renderSkillForm(true),
          h('div', { className: 'dam-skill-toolbar' },
            h('button', { type: 'button', className: 'dam-btn', onClick: goList }, tr(t, 'back')),
            h('button', {
              type: 'button',
              className: 'dam-btn dam-btn-primary',
              onClick: createNew,
              disabled: busy || !fields.name.trim() || !fields.description.trim(),
            }, busy ? tr(t, 'saving') : tr(t, 'createSkill'))));
      }

      function renderImport() {
        return h('div', { className: 'dam-skill-panel' },
          h('label', { className: 'dam-field' },
            h('span', null, tr(t, 'skillName')),
            h('input', { className: 'dam-input', value: name, placeholder: tr(t, 'skillNameHint'), onChange: (event) => setName(event.target.value) })),
          h('label', { className: 'dam-field' },
            h('span', null, tr(t, 'skillUrl')),
            h('input', { className: 'dam-input', value: url, autoFocus: true, onChange: (event) => setUrl(event.target.value) })),
          h('p', { className: 'dam-help' }, tr(t, 'skillUrlHint')),
          h('div', { className: 'dam-skill-toolbar' },
            h('button', { type: 'button', className: 'dam-btn', onClick: () => setView('list') }, tr(t, 'back')),
            h('button', { type: 'button', className: 'dam-btn dam-btn-primary', onClick: importFromUrl, disabled: busy || !url.trim() }, busy ? tr(t, 'importing') : tr(t, 'import'))));
      }

      function renderLibrary() {
        if (loading) return h('div', { className: 'dam-loading' }, tr(t, 'loading'));
        const items = library?.skills || [];
        return h('div', { className: 'dam-skill-panel' },
          h('div', { className: 'dam-skill-hint' }, `${tr(t, 'libraryPath')}: ${library?.path || ''}`),
          h('div', { className: 'dam-skill-toolbar' },
            h('button', { type: 'button', className: 'dam-btn', onClick: () => setView('list') }, tr(t, 'back'))),
          items.length
            ? items.map((item) => h('div', { className: 'dam-skill-row', key: item.name },
              h('div', { className: 'dam-skill-main' },
                h('span', { className: 'dam-skill-name' }, item.name),
                h('span', { className: 'dam-skill-path' }, item.path)),
              h('div', { className: 'dam-skill-actions' },
                h('button', { type: 'button', className: 'dam-mini-btn', onClick: () => installFromLibrary(item), disabled: busy }, tr(t, 'installSkill')))))
            : h('div', { className: 'dam-tree-empty' }, tr(t, 'libraryEmpty')));
      }

      async function requestClose() {
        if (isDirty() && !(await askConfirm(tr(t, 'discardConfirm')))) return;
        onClose();
      }

      let bodyContent;
      if (view === 'edit') bodyContent = renderEditor();
      else if (view === 'create') bodyContent = renderCreate();
      else if (view === 'import') bodyContent = renderImport();
      else if (view === 'library') bodyContent = renderLibrary();
      else bodyContent = renderList();
      const count = data?.count ?? 0;

      return h(React.Fragment, null,
        h(Dialog, {
          title: `${tr(t, 'skillManager')} · ${workspace.title}`,
          onClose: requestClose,
          wide: true,
          footer: [
            h('button', { key: 'close', type: 'button', className: 'dam-btn', onClick: requestClose }, tr(t, 'close')),
            h('span', { key: 'count', className: 'dam-tree-toolbar-meta' }, tr(t, 'skillCount', { count })),
          ],
        },
        h('div', { className: 'dam-skill-panel' },
          error ? h('div', { className: 'dam-dialog-notice dam-dialog-notice-error', role: 'alert' }, error) : null,
          notice ? h('div', { className: 'dam-dialog-notice dam-dialog-notice-success', role: 'status' }, notice.text) : null,
          bodyContent)),
        confirmElement);
    }
    function FileDialog({ workspace, kind, t, onClose, onSaved }) {
      const fileName = kind === 'skill' ? 'SKILL.md' : 'AGENTS.md';
      const target = { scope: 'workspace', workspaceId: workspace.id, file: kind };
      const [doc, setDoc] = useState(null);
      const [draft, setDraft] = useState('');
      const [loading, setLoading] = useState(true);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState('');
      const [notice, setNotice] = useState(null);
      const textareaRef = useRef(null);
      const draftRef = useRef('');
      const { ask: askConfirm, confirmElement } = useConfirmDialog(t);
      draftRef.current = draft;
      const dirty = Boolean(doc && draft !== doc.content);

      useEffect(() => {
        let cancelled = false;
        (async () => {
          try {
            const data = await request('/read', {
              method: 'POST',
              body: JSON.stringify({ target }),
            });
            if (cancelled) return;
            setDoc(data);
            setDraft(data.content);
          } catch (caught) {
            if (!cancelled) setError(errorText(t, caught));
          } finally {
            if (!cancelled) setLoading(false);
          }
        })();
        return () => { cancelled = true; };
      }, []);

      async function requestClose() {
        if (dirty && !(await askConfirm(tr(t, 'discardConfirm')))) return;
        onClose();
      }

      async function save() {
        if (!doc || saving) return;
        const contentToSave = draftRef.current;
        setSaving(true);
        setError('');
        setNotice(null);
        try {
          const data = await request('/save', {
            method: 'POST',
            body: JSON.stringify({
              target,
              content: contentToSave,
              expectedMtimeMs: doc.mtimeMs,
              eol: doc.eol,
              bom: doc.bom,
            }),
          });
          setDoc((previous) => previous ? {
            ...previous,
            ...data,
            content: contentToSave,
            eol: previous.eol,
            bom: previous.bom,
          } : previous);
          setNotice({
            kind: 'success',
            text: data.backupPath
              ? tr(t, 'savedWithBackup', { path: data.path })
              : tr(t, 'savedNotice', { path: data.path }),
          });
          if (onSaved) {
            try {
              await onSaved();
            } catch {
              // The file is saved; metadata refresh can be retried with the toolbar refresh.
            }
          }
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setSaving(false);
        }
      }

      function onKeyDown(event) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
          event.preventDefault();
          if (!saving && (dirty || (doc && !doc.exists))) void save();
        }
      }

      return h(React.Fragment, null,
        h(Dialog, {
          title: tr(t, 'nodeFileTitle', { title: workspace.title, file: fileName }),
          onClose: requestClose,
          wide: true,
          footer: [
            h('button', {
              key: 'close',
              type: 'button',
              className: 'dam-btn',
              onClick: requestClose,
            }, tr(t, 'close')),
            h('button', {
              key: 'save',
              type: 'button',
              className: 'dam-btn dam-btn-primary',
              onClick: save,
              disabled: loading || saving || !doc || (!dirty && doc.exists),
            }, saving ? tr(t, 'saving') : tr(t, 'save')),
          ],
        },
        loading ? h('div', { className: 'dam-loading' }, tr(t, 'loading')) : h('div', { className: 'dam-dialog-editor' },
          h('div', { className: 'dam-dialog-path', title: doc?.path || '' }, doc?.path || target.relativePath || fileName),
          h('div', { className: 'dam-dialog-meta' },
            h('span', {
              className: doc?.exists ? 'dam-dialog-status-ready' : 'dam-dialog-status-missing',
            }, doc?.exists ? tr(t, 'saved') : tr(t, 'missing')),
            doc?.modifiedAt ? h('span', null, tr(t, 'modified', { time: formatTime(doc.modifiedAt) })) : null,
            h('span', null, doc?.eol === '\r\n' ? 'CRLF' : 'LF')),
          error ? h('div', { className: 'dam-dialog-notice dam-dialog-notice-error', role: 'alert' }, error) : null,
          notice && notice.kind === 'success'
            ? h('div', { className: 'dam-dialog-notice dam-dialog-notice-success', role: 'status' }, notice.text)
            : null,
          h('textarea', {
            ref: textareaRef,
            className: 'dam-dialog-textarea',
            value: draft,
            autoFocus: true,
            spellCheck: false,
            placeholder: tr(t, 'filePlaceholder', { file: fileName }),
            'aria-label': tr(t, 'filePlaceholder', { file: fileName }),
            onChange: (event) => setDraft(event.target.value),
            onKeyDown,
          }),
          !doc?.exists ? h('div', { className: 'dam-missing-note', style: { margin: 0 } }, tr(t, 'notExist')) : null)),
        confirmElement);
    }

    function TreeNodeCard({ node, t, expanded, onToggle, onOpenFile, searchMode, onReveal }) {
      const hasChildren = node.children.length > 0;
      const isExpanded = expanded.has(node.nodeId);
      const skillCount = workspaceSkillCount(node);
      const skillExists = skillCount > 0;
      const agentsExists = Boolean(node.agents?.exists);
      return h('div', {
        className: `dam-tree-card${isExpanded && hasChildren ? ' dam-tree-card-expanded' : ''}`,
        'data-tree-node': node.nodeId,
        onClick: () => {
          if (searchMode) onReveal();
          else onToggle(node);
        },
      },
      h('button', {
        type: 'button',
        className: 'dam-tree-card-head',
        disabled: !node.available && !searchMode,
        'aria-expanded': hasChildren && !searchMode ? isExpanded : undefined,
      },
      h('span', { className: 'dam-tree-card-main' },
        h('span', { className: 'dam-tree-card-title' }, node.title),
        h('span', { className: 'dam-tree-card-path', title: node.path }, node.relativePath || node.path),
        !node.available
          ? h('span', { className: 'dam-badge dam-badge-unavailable', style: { alignSelf: 'flex-start', marginTop: 2 } }, tr(t, 'unavailable'))
          : null),
      hasChildren || searchMode
        ? h('span', { className: 'dam-tree-caret' }, searchMode ? '→' : isExpanded ? '−' : '+')
        : null),
      h('div', { className: 'dam-tree-card-actions' },
        h('div', { className: 'dam-node-skill-group' },
          h('button', {
            type: 'button',
            className: `dam-node-btn ${skillExists ? 'dam-node-btn-ready' : 'dam-node-btn-missing'}`,
            onClick: (event) => {
              event.stopPropagation();
              onOpenFile(node, 'skill');
            },
            disabled: !node.available,
            title: node.path,
          }, h('span', { className: 'dam-node-btn-dot' }), tr(t, 'skill')),
          h('span', {
            className: `dam-node-count ${skillExists ? 'dam-node-count-ready' : 'dam-node-count-missing'}`,
            title: tr(t, 'skillCount', { count: skillCount }),
          }, String(skillCount))),
        h('button', {
          type: 'button',
          className: `dam-node-btn ${agentsExists ? 'dam-node-btn-ready' : 'dam-node-btn-missing'}`,
          onClick: (event) => {
            event.stopPropagation();
            onOpenFile(node, 'agents');
          },
          disabled: !node.available,
          title: node.agents?.path || 'AGENTS.md',
        }, h('span', { className: 'dam-node-btn-dot' }), tr(t, 'agents'))));
    }

    function TreeNodeView({ node, t, expanded, onToggle, onOpenFile }) {
      const isExpanded = expanded.has(node.nodeId);
      return h('div', { className: 'dam-tree-row' },
        h(TreeNodeCard, {
          node,
          t,
          expanded,
          onToggle,
          onOpenFile,
          searchMode: false,
        }),
        node.children.length > 0
          ? h('div', {
            className: `dam-tree-children-wrap${isExpanded ? ' dam-tree-children-wrap-open' : ''}`,
            'aria-hidden': isExpanded ? 'false' : 'true',
          },
          h('div', { className: 'dam-tree-children' },
            node.children.map((child) => h(TreeNodeView, {
              key: child.nodeId,
              node: child,
              t,
              expanded,
              onToggle,
              onOpenFile,
            }))))
          : null);
    }

    function TreeView({ snapshot, t, onRefresh }) {
      const [query, setQuery] = useState('');
      const [expanded, setExpanded] = useState(() => new Set());
      const [focus, setFocus] = useState(null);
      const [dialog, setDialog] = useState(null);
      const [skillDialog, setSkillDialog] = useState(null);
      const treeRef = useRef(null);
      const tree = useMemo(() => buildWorkspaceTree(snapshot?.workspaces || []), [snapshot]);
      const allNodes = useMemo(() => flattenWorkspaceTree(tree.roots), [tree]);
      const results = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return [];
        return allNodes.filter((node) => (
          String(node.title || '').toLowerCase().includes(needle)
          || String(node.path || '').toLowerCase().includes(needle)
          || String(node.relativePath || '').toLowerCase().includes(needle)
        ));
      }, [allNodes, query]);

      useEffect(() => {
        if (!focus?.id) return undefined;
        const frame = requestAnimationFrame(() => {
          const element = Array.from(treeRef.current?.querySelectorAll('[data-tree-node]') || [])
            .find((candidate) => candidate.dataset.treeNode === focus.id);
          if (element && typeof element.scrollIntoView === 'function') {
            element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
          }
        });
        return () => cancelAnimationFrame(frame);
      }, [focus, expanded]);

      function toggle(node) {
        if (!node?.children?.length) return;
        const expanding = !expanded.has(node.nodeId);
        setExpanded((previous) => {
          const next = new Set(previous);
          if (next.has(node.nodeId)) next.delete(node.nodeId);
          else next.add(node.nodeId);
          return next;
        });
        if (expanding && node.children[0]) {
          setFocus({ id: node.children[0].nodeId, token: Date.now() });
        }
      }

      function reveal(node) {
        setExpanded((previous) => {
          const next = new Set(previous);
          let current = node;
          while (current) {
            next.add(current.nodeId);
            current = current.parent;
          }
          const addDescendants = (value) => {
            next.add(value.nodeId);
            for (const child of value.children) addDescendants(child);
          };
          addDescendants(node);
          return next;
        });
        setQuery('');
        setFocus({ id: node.nodeId, token: Date.now() });
      }

      function openFile(node, kind) {
        if (kind === 'skill') setSkillDialog(node);
        else setDialog({ node, kind });
      }

      return h(React.Fragment, null,
        h('div', { className: 'dam-tree-shell' },
          h('div', { className: 'dam-tree-toolbar' },
            h('input', {
              className: 'dam-search dam-tree-search',
              type: 'search',
              value: query,
              placeholder: tr(t, 'treeSearch'),
              'aria-label': tr(t, 'treeSearch'),
              onChange: (event) => setQuery(event.target.value),
            }),
            h('span', { className: 'dam-tree-toolbar-meta' },
              query
                ? tr(t, 'treeSearchResults', { count: results.length })
                : tr(t, 'treeWorkspaceCount', { count: allNodes.length })),
            h('div', { className: 'dam-tree-toolbar-actions' },
              h('button', {
                type: 'button',
                className: 'dam-btn',
                onClick: () => setExpanded(new Set()),
                disabled: expanded.size === 0,
              }, tr(t, 'treeCollapseAll')))),
          h('div', { className: 'dam-tree-hint' }, tr(t, 'treeHint')),
          h('div', { className: 'dam-tree-canvas', ref: treeRef },
            query
              ? results.length
                ? h('div', { className: 'dam-tree-results' },
                  h('div', { className: 'dam-tree-results-head' },
                    h('span', null, tr(t, 'treeSearchResults', { count: results.length }))),
                  results.map((node) => h(TreeNodeCard, {
                    key: node.nodeId,
                    node,
                    t,
                    expanded,
                    onToggle: () => toggle(node),
                    onOpenFile: openFile,
                    searchMode: true,
                    onReveal: () => reveal(node),
                  })))
                : h('div', { className: 'dam-tree-empty' }, tr(t, 'treeSearchEmpty'))
              : tree.roots.length
                ? h('div', { className: 'dam-tree-forest' },
                  tree.roots.map((node) => h(TreeNodeView, {
                    key: node.nodeId,
                    node,
                    t,
                    expanded,
                    onToggle: toggle,
                    onOpenFile: openFile,
                  })))
                : h('div', { className: 'dam-tree-empty' }, tr(t, 'treeNoWorkspaces')))),
        dialog ? h(FileDialog, {
          workspace: dialog.node,
          kind: dialog.kind,
          t,
          onClose: () => setDialog(null),
          onSaved: onRefresh,
        }) : null,
        skillDialog ? h(SkillManagerDialog, {
          workspace: skillDialog,
          t,
          onClose: () => setSkillDialog(null),
          onRefresh,
        }) : null);
    }

    function CatalogView({ t, onBack, onInstalled }) {
      const DEFAULT_SOURCES = [
        { id: 'anthropic', title: 'Anthropic', repository: 'anthropics/skills' },
        { id: 'openai', title: 'OpenAI', repository: 'openai/skills' },
        { id: 'cursor', title: 'Cursor', repository: 'cursor/plugins' },
        { id: 'mattpocock', title: 'Matt Pocock', repository: 'mattpocock/skills' },
      ];
      const [catalog, setCatalog] = useState(null);
      const [activeId, setActiveId] = useState('anthropic');
      const [query, setQuery] = useState('');
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [installing, setInstalling] = useState('');
      const [notice, setNotice] = useState(null);

      useEffect(() => {
        void load(true);
      }, []);

      async function load(force) {
        setLoading(true);
        setError('');
        try {
          const data = await request('/catalog/sync', {
            method: 'POST',
            body: JSON.stringify({ refresh: force === true }),
          });
          setCatalog(data);
          const ids = (data.repositories || []).map((repo) => repo.id);
          if (ids.length && !ids.includes(activeId)) setActiveId(ids[0]);
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setLoading(false);
        }
      }

      async function install(repo, skill) {
        const token = `${repo.id}:${skill.path}`;
        setInstalling(token);
        setError('');
        setNotice(null);
        try {
          await request('/catalog/install', {
            method: 'POST',
            body: JSON.stringify({ repoId: repo.id, skillPath: skill.path }),
          });
          setNotice({ kind: 'success', text: tr(t, 'installedSkill', { name: skill.name }) });
          if (onInstalled) {
            try {
              await onInstalled();
            } catch {
              // Installation succeeded; the global count can refresh later.
            }
          }
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setInstalling('');
        }
      }

      const repositories = (catalog?.repositories?.length ? catalog.repositories : DEFAULT_SOURCES);
      const active = repositories.find((repo) => repo.id === activeId) || repositories[0];
      const needle = query.trim().toLowerCase();
      const skills = (active?.skills || []).filter((skill) => (
        !needle
        || skill.name.toLowerCase().includes(needle)
        || skill.path.toLowerCase().includes(needle)
      ));

      return h('div', { className: 'dam-catalog' },
        h('div', { className: 'dam-catalog-head' },
          h('div', null,
            h('div', { className: 'dam-title-row' },
              h('button', {
                type: 'button',
                className: 'dam-btn',
                onClick: onBack,
              }, tr(t, 'back')),
              h('h2', { className: 'dam-title', style: { fontSize: 17 } }, tr(t, 'skillCatalog'))),
            h('p', { className: 'dam-subtitle' }, tr(t, 'catalogSubtitle'))),
          h('button', {
            type: 'button',
            className: 'dam-btn',
            onClick: () => load(true),
            disabled: loading,
          }, loading ? tr(t, 'syncingIndex') : tr(t, 'refreshIndex'))),
        error ? h('div', { className: 'dam-notice dam-notice-error', role: 'alert' },
          h('span', null, tr(t, 'catalogError', { error }))) : null,
        notice ? h('div', { className: 'dam-notice dam-notice-success', role: 'status' },
          h('span', null, notice.text),
          h('button', { type: 'button', className: 'dam-notice-close', onClick: () => setNotice(null) }, '×')) : null,
        h('div', { className: 'dam-catalog-grid' },
          repositories.map((repo) => h('button', {
            key: repo.id,
            type: 'button',
            className: `dam-catalog-card${active?.id === repo.id ? ' dam-catalog-card-active' : ''}`,
            onClick: () => setActiveId(repo.id),
          },
          h('div', { className: 'dam-catalog-card-title' }, repo.title),
          h('div', { className: 'dam-catalog-card-repo' }, repo.repository),
          h('div', { className: 'dam-catalog-card-meta' },
            repo.error
              ? h('span', { className: 'dam-catalog-error' }, repo.error)
              : h('span', null, tr(t, 'catalogCount', { count: repo.skills?.length || 0 }))),
          h('div', { className: 'dam-catalog-card-source' },
            catalog?.fromCache ? tr(t, 'catalogLocalCache') : tr(t, 'catalogSource'))))),
        h('div', { className: 'dam-catalog-list' },
          h('div', { className: 'dam-catalog-toolbar' },
            h('strong', null, active?.title || ''),
            h('input', {
              className: 'dam-search dam-catalog-search',
              type: 'search',
              value: query,
              placeholder: tr(t, 'catalogSearch'),
              onChange: (event) => setQuery(event.target.value),
            }),
            h('span', { className: 'dam-tree-toolbar-meta' }, tr(t, 'catalogCount', { count: skills.length })),
            active?.url ? h('button', {
              type: 'button',
              className: 'dam-btn',
              onClick: () => window.open(active.url, '_blank', 'noopener,noreferrer'),
            }, tr(t, 'openRepo')) : null),
          h('div', { className: 'dam-catalog-scroll' },
            skills.length
              ? skills.map((skill) => h('div', { className: 'dam-catalog-skill', key: skill.path },
                h('div', { className: 'dam-catalog-skill-main' },
                  h('span', { className: 'dam-catalog-skill-name' }, skill.name),
                  h('span', { className: 'dam-catalog-skill-path' }, skill.directory || skill.path)),
                h('div', { className: 'dam-catalog-skill-actions' },
                  h('button', {
                    type: 'button',
                    className: 'dam-btn',
                    onClick: () => window.open(skill.repoUrl, '_blank', 'noopener,noreferrer'),
                  }, tr(t, 'openRepo')),
                  h('button', {
                    type: 'button',
                    className: 'dam-btn dam-btn-primary',
                    onClick: () => install(active, skill),
                    disabled: Boolean(installing) || Boolean(active?.error),
                  }, installing === `${active?.id}:${skill.path}` ? tr(t, 'installingSkill') : tr(t, 'installToGlobal')))))
              : h('div', { className: 'dam-tree-empty' }, loading ? tr(t, 'syncingIndex') : tr(t, 'catalogEmpty')))));
    }

    function UpdateDialog({ currentVersion, t, onClose }) {
      const [info, setInfo] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [applying, setApplying] = useState(false);
      const [applied, setApplied] = useState(null);

      useEffect(() => {
        void check();
      }, []);

      async function check() {
        setLoading(true);
        setError('');
        try {
          const data = await request('/update');
          setInfo(data);
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setLoading(false);
        }
      }

      async function applyUpdate() {
        if (!info?.latestTag || applying) return;
        setApplying(true);
        setError('');
        try {
          const result = await request('/update/apply', {
            method: 'POST',
            body: JSON.stringify({ tag: info.latestTag }),
          });
          if (result?.application === 'failed' || result?.error) {
            setError(result.error?.diagnostic || result.error?.code || tr(t, 'updateFailed', { error: 'install failed' }));
            setApplied(null);
          } else {
            setApplied(result);
          }
        } catch (caught) {
          setError(errorText(t, caught));
        } finally {
          setApplying(false);
        }
      }

      const statusText = error
        ? tr(t, 'updateCheckFailed', { error })
        : loading
          ? tr(t, 'checkingUpdate')
          : !info
            ? tr(t, 'checkingUpdate')
            : !info.configured
              ? tr(t, 'updateNotConfigured')
              : info.error
                ? tr(t, 'updateCheckFailed', { error: info.error })
                : info.updateAvailable
                  ? tr(t, 'updateAvailable', { version: info.latestVersion })
                  : tr(t, 'upToDate');
      const statusClass = error || info?.error || !info?.configured
        ? 'dam-update-status-error'
        : loading
          ? ''
          : info?.updateAvailable
            ? 'dam-update-status-new'
            : 'dam-update-status-ready';

      return h(Dialog, {
        title: tr(t, 'update'),
        onClose,
        wide: true,
        footer: [
          h('button', {
            key: 'close',
            type: 'button',
            className: 'dam-btn',
            onClick: onClose,
          }, tr(t, 'close')),
          h('button', {
            key: 'check',
            type: 'button',
            className: 'dam-btn',
            onClick: check,
            disabled: loading || applying,
          }, tr(t, 'checkUpdate')),
          info?.updateAvailable && info.canAutoUpdate
            ? h('button', {
              key: 'install',
              type: 'button',
              className: 'dam-btn dam-btn-primary',
              onClick: applyUpdate,
              disabled: loading || applying || Boolean(applied),
            }, applying ? tr(t, 'updating') : tr(t, 'updateNow'))
            : null,
        ],
      },
      h('div', { className: 'dam-update-body' },
        h('div', { className: 'dam-update-grid' },
          h('div', { className: 'dam-update-cell' },
            h('span', { className: 'dam-update-label' }, tr(t, 'currentVersion')),
            h('span', { className: 'dam-update-value' }, `v${info?.currentVersion || currentVersion || '0.0.0'}`)),
          h('div', { className: 'dam-update-cell' },
            h('span', { className: 'dam-update-label' }, tr(t, 'latestVersion')),
            h('span', { className: 'dam-update-value' }, info?.latestVersion ? `v${info.latestVersion}` : '—'))),
        h('div', { className: `dam-update-status ${statusClass}`, role: error || info?.error ? 'alert' : 'status' }, statusText),
        applied
          ? h('div', { className: 'dam-dialog-notice dam-dialog-notice-success', role: 'status' },
            applied.restartRequired ? tr(t, 'updateRestart') : tr(t, 'updateRestart'))
          : null,
        info?.configured && !info.error
          ? h('div', null,
            h('div', { className: 'dam-update-notes-title' }, tr(t, 'releaseNotes')),
            h('div', { className: 'dam-update-notes' }, info.notes || tr(t, 'noReleaseNotes')))
          : null,
        info?.releaseUrl
          ? h('button', {
            type: 'button',
            className: 'dam-btn',
            style: { alignSelf: 'flex-start' },
            onClick: () => window.open(info.releaseUrl, '_blank', 'noopener,noreferrer'),
          }, tr(t, 'viewRelease'))
          : null));
    }

    function useConfirmDialog(t) {
      const [state, setState] = useState(null);
      const resolverRef = useRef(null);
      const previousFocusRef = useRef(null);

      function finish(value) {
        const resolve = resolverRef.current;
        resolverRef.current = null;
        setState(null);
        if (resolve) resolve(value);
        const previous = previousFocusRef.current;
        previousFocusRef.current = null;
        requestAnimationFrame(() => {
          if (previous && previous.isConnected && typeof previous.focus === 'function') {
            previous.focus();
          }
        });
      }

      function ask(message, options = {}) {
        previousFocusRef.current = document.activeElement;
        return new Promise((resolve) => {
          resolverRef.current = resolve;
          setState({ message, danger: options.danger === true });
        });
      }

      const confirmElement = state
        ? h(Dialog, {
          title: tr(t, 'confirmTitle'),
          onClose: () => finish(false),
          footer: [
            h('button', {
              key: 'cancel',
              type: 'button',
              className: 'dam-btn',
              autoFocus: true,
              onClick: () => finish(false),
            }, tr(t, 'cancel')),
            h('button', {
              key: 'confirm',
              type: 'button',
              className: `dam-btn ${state.danger ? 'dam-btn-danger' : 'dam-btn-primary'}`,
              onClick: () => finish(true),
            }, tr(t, 'confirm')),
          ],
        }, h('p', { className: 'dam-confirm-text' }, state.message))
        : null;

      return { ask, confirmElement };
    }

    function Page({ t }) {
      const [snapshot, setSnapshot] = useState(PAGE_CACHE.snapshot);
      const [selected, setSelected] = useState(PAGE_CACHE.selected);
      const [doc, setDoc] = useState(PAGE_CACHE.doc);
      const [draft, setDraft] = useState(PAGE_CACHE.draft);
      const [query, setQuery] = useState(PAGE_CACHE.query);
      const [viewMode, setViewMode] = useState(PAGE_CACHE.viewMode === 'tree' ? 'tree' : 'list');
      const [updateOpen, setUpdateOpen] = useState(false);
      const [skillWorkspace, setSkillWorkspace] = useState(null);
      const [catalogOpen, setCatalogOpen] = useState(false);
      const [loading, setLoading] = useState(!PAGE_CACHE.doc);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState('');
      const [notice, setNotice] = useState(null);
      const [modal, setModal] = useState(null);
      const [newWorkspace, setNewWorkspace] = useState('');
      const [newPath, setNewPath] = useState('AGENTS.md');
      const [modalError, setModalError] = useState('');
      const textareaRef = useRef(null);
      const mountedRef = useRef(true);
      const selectedRef = useRef(null);
      const docRef = useRef(null);
      const draftRef = useRef('');
      const { ask: askConfirm, confirmElement } = useConfirmDialog(t);

      selectedRef.current = selected;
      docRef.current = doc;
      draftRef.current = draft;

      useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
      }, []);

      useEffect(() => {
        PAGE_CACHE.snapshot = snapshot;
        PAGE_CACHE.selected = selected;
        PAGE_CACHE.doc = doc;
        PAGE_CACHE.draft = draft;
        PAGE_CACHE.query = query;
        PAGE_CACHE.viewMode = viewMode;
      }, [snapshot, selected, doc, draft, query, viewMode]);

      const dirty = Boolean(doc && draft !== doc.content);
      const availableWorkspaces = (snapshot?.workspaces || [])
        .filter((workspace) => workspace.available)
        .sort(compareWorkspaceNames);
      const globalSkillCount = snapshot?.globalSkillCount ?? snapshot?.globalSkills?.length ?? 0;
      const globalSkillWorkspace = {
        id: '__global__',
        title: tr(t, 'global'),
        path: snapshot?.home || '',
        hostPath: snapshot?.home || '',
        global: true,
        available: true,
        skills: snapshot?.globalSkills || [],
        skillCount: globalSkillCount,
        skill: { exists: false },
      };
      const selectedKey = targetKey(selected);

      useEffect(() => {
        let cancelled = false;
        (async () => {
          try {
            const state = await request('/state');
            if (cancelled || !mountedRef.current) return;
            setSnapshot(state);
            if (PAGE_CACHE.doc) {
              const cachedTarget = PAGE_CACHE.selected || state.global.target;
              const fresh = findTarget(state, cachedTarget);
              if (fresh) setSelected(fresh);
              setDoc((previous) => previous && fresh ? {
                ...previous,
                ...fresh,
                content: previous.content,
                eol: previous.eol,
                bom: previous.bom,
              } : previous);
              return;
            }
            const target = state.global.target;
            const data = await request('/read', {
              method: 'POST',
              body: JSON.stringify({ target }),
            });
            if (cancelled || !mountedRef.current) return;
            setSelected(target);
            setDoc(data);
            setDraft(data.content);
          } catch (caught) {
            if (!cancelled && mountedRef.current) {
              setError(errorText(t, caught));
            }
          } finally {
            if (!cancelled && mountedRef.current) setLoading(false);
          }
        })();
        return () => { cancelled = true; };
      }, []);

      async function loadDocument(target) {
        const data = await request('/read', {
          method: 'POST',
          body: JSON.stringify({ target }),
        });
        if (!mountedRef.current) return data;
        setSelected(target);
        setDoc(data);
        setDraft(data.content);
        setError('');
        return data;
      }

      async function openDocument(target, options = {}) {
        if (!target || busy) return;
        const force = options.force === true;
        if (!force && dirty && !(await askConfirm(tr(t, 'discardConfirm')))) return;
        setBusy(true);
        setNotice(null);
        try {
          await loadDocument(target);
          requestAnimationFrame(() => textareaRef.current?.focus());
        } catch (caught) {
          if (mountedRef.current) {
            setNotice({ kind: 'error', text: tr(t, 'loadFailed', { error: errorText(t, caught) }) });
          }
        } finally {
          if (mountedRef.current) setBusy(false);
        }
      }

      async function refresh() {
        if (viewMode !== 'tree' && dirty && !(await askConfirm(tr(t, 'discardConfirm')))) return;
        setLoading(true);
        setError('');
        setNotice(null);
        try {
          const state = await request('/state');
          if (!mountedRef.current) return;
          setSnapshot(state);
          if (viewMode === 'tree') return;
          const wanted = selectedRef.current || state.global.target;
          const target = findTarget(state, wanted) || state.global.target;
          await loadDocument(target);
        } catch (caught) {
          if (mountedRef.current) setError(errorText(t, caught));
        } finally {
          if (mountedRef.current) setLoading(false);
        }
      }

      async function refreshMetadata() {
        const state = await request('/state');
        if (!mountedRef.current) return;
        setSnapshot(state);
        const current = docRef.current;
        const target = selectedRef.current;
        if (!current || !target) return;
        const fresh = findTarget(state, target);
        if (!fresh) return;
        setSelected(fresh);
        setDoc((previous) => previous ? {
          ...previous,
          ...fresh,
          content: previous.content,
          eol: previous.eol,
          bom: previous.bom,
        } : previous);
      }

      async function save() {
        if (!doc || !selected || busy) return;
        const contentToSave = draftRef.current;
        setBusy(true);
        setNotice(null);
        try {
          const data = await request('/save', {
            method: 'POST',
            body: JSON.stringify({
              target: selected,
              content: contentToSave,
              expectedMtimeMs: doc.mtimeMs,
              eol: doc.eol,
              bom: doc.bom,
            }),
          });
          if (!mountedRef.current) return;
          setDoc((previous) => previous ? {
            ...previous,
            ...data,
            content: contentToSave,
            eol: previous.eol,
            bom: previous.bom,
          } : previous);
          setNotice({
            kind: 'success',
            text: data.backupPath
              ? tr(t, 'savedWithBackup', { path: data.path })
              : tr(t, 'savedNotice', { path: data.path }),
          });
          await refreshMetadata().catch(() => {});
        } catch (caught) {
          if (mountedRef.current) {
            setNotice({
              kind: 'error',
              text: tr(t, 'saveFailed', { error: errorText(t, caught) })
                + (caught && caught.code === 'error.conflict' ? ` ${tr(t, 'errorConflictHint')}` : ''),
            });
          }
        } finally {
          if (mountedRef.current) setBusy(false);
        }
      }

      async function remove() {
        if (!doc || !selected || busy) return;
        setModal(null);
        setBusy(true);
        setNotice(null);
        try {
          const data = await request('/delete', {
            method: 'POST',
            body: JSON.stringify({
              target: selected,
              expectedMtimeMs: doc.mtimeMs,
            }),
          });
          if (!mountedRef.current) return;
          setNotice({ kind: 'success', text: tr(t, 'deletedNotice', { path: data.path }) });
          const state = await request('/state');
          if (!mountedRef.current) return;
          setSnapshot(state);
          await loadDocument(state.global.target);
        } catch (caught) {
          if (mountedRef.current) {
            setNotice({ kind: 'error', text: tr(t, 'saveFailed', { error: errorText(t, caught) }) });
          }
        } finally {
          if (mountedRef.current) setBusy(false);
        }
      }

      async function copyPath() {
        if (!doc) return;
        try {
          await navigator.clipboard.writeText(doc.path);
          setNotice({ kind: 'info', text: tr(t, 'copied') });
        } catch {
          setNotice({ kind: 'error', text: doc.path });
        }
      }

      async function openNew() {
        if (dirty && !(await askConfirm(tr(t, 'discardConfirm')))) return;
        setModalError('');
        setNewWorkspace(availableWorkspaces[0]?.id || '');
        setNewPath('AGENTS.md');
        setModal('new');
      }

      async function createFile() {
        const workspace = availableWorkspaces.find((item) => item.id === newWorkspace);
        if (!workspace) {
          setModalError(tr(t, 'noWorkspaces'));
          return;
        }
        const relativePath = normalizeClientPath(newPath);
        if (!relativePath) {
          setModalError(tr(t, 'required'));
          return;
        }
        if (!/(^|\/)AGENTS(\.local)?\.md$/.test(relativePath)) {
          setModalError(tr(t, 'invalidPath'));
          return;
        }
        setBusy(true);
        setModalError('');
        try {
          const target = {
            scope: 'workspace',
            workspaceId: workspace.id,
            relativePath,
          };
          const data = await request('/save', {
            method: 'POST',
            body: JSON.stringify({
              target,
              content: '',
              expectedMtimeMs: null,
              eol: '\n',
            }),
          });
          if (!mountedRef.current) return;
          setModal(null);
          const state = await request('/state');
          if (!mountedRef.current) return;
          setSnapshot(state);
          const fresh = findTarget(state, target) || target;
          await loadDocument(fresh);
          setNotice({ kind: 'success', text: tr(t, 'createdNotice', { path: data.path }) });
          requestAnimationFrame(() => textareaRef.current?.focus());
        } catch (caught) {
          if (mountedRef.current) setModalError(errorText(t, caught));
        } finally {
          if (mountedRef.current) setBusy(false);
        }
      }

      function onTextareaKeyDown(event) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
          event.preventDefault();
          if (!busy && (dirty || (doc && !doc.exists))) void save();
          return;
        }
        if (event.key === 'Tab') {
          event.preventDefault();
          const textarea = event.currentTarget;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const next = `${draft.slice(0, start)}  ${draft.slice(end)}`;
          setDraft(next);
          requestAnimationFrame(() => {
            textarea.selectionStart = start + 2;
            textarea.selectionEnd = start + 2;
          });
        }
      }

      const filteredWorkspaces = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!snapshot) return [];
        return snapshot.workspaces
          .map((workspace) => {
            const rootFiles = [workspace.agents, workspaceSkillSummary(workspace)].filter(Boolean);
            const titleMatches = !needle
              || workspace.title.toLowerCase().includes(needle)
              || workspace.path.toLowerCase().includes(needle);
            const files = titleMatches
              ? rootFiles
              : rootFiles.filter((file) => (
                String(file.name || '').toLowerCase().includes(needle)
                || String(file.relativePath || '').toLowerCase().includes(needle)
              ));
            return { ...workspace, files };
          })
          .filter((workspace) => workspace.files.length > 0 || !needle)
          .sort(compareWorkspaceNames);
      }, [snapshot, query]);

      const fileCount = snapshot
        ? 1 + snapshot.workspaces.reduce(
          (total, workspace) => total + 1 + 1,
          0,
        )
        : 0;

      const status = busy
        ? tr(t, 'saving')
        : dirty
          ? tr(t, 'unsaved')
          : doc && !doc.exists
            ? tr(t, 'missing')
            : tr(t, 'saved');
      const statusClass = busy
        ? 'dam-status-saving'
        : dirty
          ? 'dam-status-dirty'
          : doc && !doc.exists
            ? 'dam-status-missing'
            : 'dam-status-saved';

      const lineCount = useMemo(() => draft.split('\n').length, [draft]);

      function renderFile(file, workspace) {
        const relativePath = String(file.relativePath || file.name || 'AGENTS.md');
        const slash = relativePath.lastIndexOf('/');
        const directory = slash >= 0 ? relativePath.slice(0, slash) : '';
        const isSkillCollection = file.isSkillCollection === true;
        const isRoot = file.name === 'AGENTS.md' || file.name === 'SKILL.md' || !directory;
        const isSkill = file.fileKind === 'skill' || file.name === 'SKILL.md';
        const isLocal = file.name === 'AGENTS.local.md';
        const active = selectedKey === targetKey(file.target);
        const skillCount = workspaceSkillCount(workspace);
        return h('button', {
          key: `${workspace.id}:${relativePath}`,
          type: 'button',
          className: `dam-file${active ? ' dam-file-active' : ''}`,
          onClick: () => {
            if (isSkillCollection) setSkillWorkspace(workspace);
            else void openDocument(file.target);
          },
          disabled: busy,
          title: isSkillCollection ? workspace.path : file.path,
        },
        h('span', { className: `dam-file-icon${isSkill ? ' dam-file-icon-skill' : ''}` }, h(FileIcon, { size: 14 })),
        h('span', { className: 'dam-file-main' },
          h('span', { className: 'dam-file-name' }, file.name),
          h('span', { className: 'dam-file-sub' }, isSkillCollection
            ? tr(t, 'skillCount', { count: skillCount })
            : (directory || (isRoot ? tr(t, 'rootFile') : workspace.title)))),
        h('span', { className: 'dam-file-meta' },
          isSkillCollection
            ? (skillCount > 0
              ? h('span', { className: 'dam-badge dam-badge-count' }, String(skillCount))
              : h('span', { className: 'dam-badge dam-badge-missing' }, tr(t, 'missing')))
            : isLocal
              ? h('span', { className: 'dam-badge dam-badge-local' }, tr(t, 'local'))
              : null,
          !isSkillCollection && !file.exists
            ? h('span', { className: 'dam-badge dam-badge-missing' }, tr(t, 'missing'))
            : null));
      }

      function renderEditor() {
        if (loading && !doc) return h('div', { className: 'dam-loading' }, tr(t, 'loading'));
        if (!doc) {
          return h('div', { className: 'dam-empty' },
            h('div', { className: 'dam-empty-icon' }, h(ManagerIcon, { size: 26 })),
            h('h2', null, tr(t, 'emptyTitle')),
            h('p', null, tr(t, 'emptyHint')));
        }
        return h('div', { className: 'dam-editor' },
          h('div', { className: 'dam-editor-head' },
            h('div', { className: 'dam-editor-title-block' },
              h('div', { className: 'dam-breadcrumb' },
                doc.scope === 'global' ? tr(t, 'global') : (doc.workspaceTitle || tr(t, 'workspaces'))),
              h('div', { className: 'dam-path-row' },
                h('code', { className: 'dam-path', title: doc.path }, doc.path),
                h('button', {
                  type: 'button',
                  className: 'dam-icon-btn',
                  'aria-label': tr(t, 'copyPath'),
                  title: tr(t, 'copyPath'),
                  onClick: copyPath,
                }, h(CopyIcon))),
              h('div', { className: 'dam-status-row' },
                h('span', { className: `dam-status ${statusClass}` }, status),
                doc.exists && doc.modifiedAt
                  ? h('span', null, tr(t, 'modified', { time: formatTime(doc.modifiedAt) }))
                  : h('span', null, tr(t, 'notExist')),
                h('span', null, `${doc.eol === '\r\n' ? 'CRLF' : 'LF'} · ${tr(t, 'chars', { count: draft.length })}`))),
            h('div', { className: 'dam-editor-actions' },
              h('button', {
                type: 'button',
                className: 'dam-btn',
                onClick: () => openDocument(selected, { force: false }),
                disabled: busy || !doc.exists,
                title: tr(t, 'reload'),
              }, h(ReloadIcon), tr(t, 'reload')),
              h('button', {
                type: 'button',
                className: 'dam-btn dam-btn-danger',
                onClick: () => setModal('delete'),
                disabled: busy || !doc.exists,
              }, h(TrashIcon), tr(t, 'delete')),
              h('button', {
                type: 'button',
                className: 'dam-btn dam-btn-primary',
                onClick: save,
                disabled: busy || (!dirty && doc.exists),
              }, h(SaveIcon), busy ? tr(t, 'saving') : tr(t, 'save')))),
          !doc.exists ? h('div', { className: 'dam-missing-note' }, tr(t, 'notExist')) : null,
          h('div', { className: 'dam-textarea-wrap' },
            h('textarea', {
              ref: textareaRef,
              className: 'dam-textarea',
              value: draft,
              placeholder: tr(t, 'filePlaceholder', { file: doc.name || 'AGENTS.md' }),
              spellCheck: false,
              autoCorrect: 'off',
              autoCapitalize: 'off',
              'aria-label': tr(t, 'filePlaceholder', { file: doc.name || 'AGENTS.md' }),
              onChange: (event) => setDraft(event.target.value),
              onKeyDown: onTextareaKeyDown,
            })),
          h('div', { className: 'dam-editor-foot' },
            h('div', { className: 'dam-editor-foot-left' },
              h('span', null, tr(t, 'lines', { count: lineCount })),
              h('span', null, '·'),
              h('span', null, tr(t, 'chars', { count: draft.length })),
              h('span', null, '·'),
              h('span', null, `${doc.eol === '\r\n' ? 'CRLF' : 'LF'}`)),
            h('span', { className: 'dam-kbd' }, 'Ctrl+S')));
      }

      return h(React.Fragment, null,
        h('style', { key: 'dam-style' }, CSS),
        h('div', { className: 'dam-root' },
          h('header', { className: 'dam-header' },
            h('div', { className: 'dam-title-block' },
              h('div', { className: 'dam-title-row' },
                h('span', { className: 'dam-title-icon' }, h(ManagerIcon, { size: 18 })),
                h('h1', { className: 'dam-title' }, tr(t, 'title'))),
              h('p', { className: 'dam-subtitle' }, tr(t, 'subtitle'))),
            h('div', { className: 'dam-header-actions' },
              h('button', {
                type: 'button',
                className: 'dam-btn',
                onClick: () => setCatalogOpen(true),
              }, tr(t, 'skillCatalog')),
              h('button', {
                type: 'button',
                className: 'dam-version-btn',
                onClick: () => setUpdateOpen(true),
                title: tr(t, 'update'),
              }, `v${snapshot?.version || '…'}`),
              h('div', { className: 'dam-view-switch', role: 'group', 'aria-label': tr(t, 'treeView') },
                h('button', {
                  type: 'button',
                  className: `dam-view-btn${viewMode === 'list' ? ' dam-view-btn-active' : ''}`,
                  'aria-pressed': viewMode === 'list',
                  onClick: () => setViewMode('list'),
                }, tr(t, 'listView')),
                h('button', {
                  type: 'button',
                  className: `dam-view-btn${viewMode === 'tree' ? ' dam-view-btn-active' : ''}`,
                  'aria-pressed': viewMode === 'tree',
                  onClick: () => setViewMode('tree'),
                }, tr(t, 'treeView'))),
              h('button', {
                type: 'button',
                className: 'dam-btn',
                onClick: refresh,
                disabled: loading || busy,
              }, h(RefreshIcon), tr(t, 'refresh')))),
          notice ? h('div', {
            className: `dam-notice dam-notice-${notice.kind}`,
            role: notice.kind === 'error' ? 'alert' : 'status',
          },
          h('span', null, notice.text),
          h('button', {
            type: 'button',
            className: 'dam-notice-close',
            'aria-label': tr(t, 'close'),
            onClick: () => setNotice(null),
          }, '×')) : null,
          error ? h('div', { className: 'dam-error-panel', role: 'alert' },
            h('span', null, tr(t, 'loadFailed', { error })),
            h('div', null, h('button', { type: 'button', className: 'dam-btn', onClick: refresh }, tr(t, 'refresh')))) : null,
          catalogOpen
            ? h(CatalogView, {
              t,
              onBack: () => setCatalogOpen(false),
              onInstalled: refreshMetadata,
            })
            : viewMode === 'tree'
              ? h(TreeView, { snapshot, t, onRefresh: refreshMetadata })
              : h('div', { className: 'dam-layout' },
            h('aside', { className: 'dam-nav', 'aria-label': tr(t, 'workspaces') },
              h('div', { className: 'dam-nav-head' },
                h('input', {
                  className: 'dam-search',
                  type: 'search',
                  value: query,
                  placeholder: tr(t, 'search'),
                  'aria-label': tr(t, 'search'),
                  onChange: (event) => setQuery(event.target.value),
                }),
                h('div', { className: 'dam-nav-summary' },
                  h('span', null, `${tr(t, 'allFiles')}: ${fileCount}`),
                  snapshot ? h('span', null, `${snapshot.workspaces.length} ${tr(t, 'workspaces')}`) : null)),
              h('div', { className: 'dam-nav-scroll' },
                snapshot ? h('section', { className: 'dam-global-card' },
                  h('div', { className: 'dam-global-head' },
                    h('div', { className: 'dam-global-title-row' },
                      h('span', { className: 'dam-global-dot' }),
                      h('span', { className: 'dam-global-title' }, tr(t, 'global'))),
                    h('span', { className: 'dam-group-count' }, '2')),
                  h('button', {
                    type: 'button',
                    className: `dam-file dam-global-file${selectedKey === 'global' ? ' dam-file-active' : ''}`,
                    onClick: () => openDocument(snapshot.global.target),
                    disabled: busy,
                    title: snapshot.global.path,
                  },
                  h('span', { className: 'dam-file-icon dam-file-icon-global' }, h(FileIcon, { size: 14 })),
                  h('span', { className: 'dam-file-main' },
                    h('span', { className: 'dam-file-name' }, tr(t, 'globalName')),
                    h('span', { className: 'dam-file-sub' }, snapshot.global.path)),
                  h('span', { className: 'dam-file-meta' },
                    !snapshot.global.exists
                      ? h('span', { className: 'dam-badge dam-badge-missing' }, tr(t, 'missing'))
                      : null)),
                  h('button', {
                    type: 'button',
                    className: 'dam-file dam-global-file',
                    onClick: () => setSkillWorkspace(globalSkillWorkspace),
                    disabled: busy,
                    title: snapshot.home,
                  },
                  h('span', { className: 'dam-file-icon dam-file-icon-skill' }, h(FileIcon, { size: 14 })),
                  h('span', { className: 'dam-file-main' },
                    h('span', { className: 'dam-file-name' }, tr(t, 'globalSkillName')),
                    h('span', { className: 'dam-file-sub' }, tr(t, 'skillCount', { count: globalSkillCount }))),
                  h('span', { className: 'dam-file-meta' },
                    globalSkillCount > 0
                      ? h('span', { className: 'dam-badge dam-badge-count' }, String(globalSkillCount))
                      : h('span', { className: 'dam-badge dam-badge-missing' }, tr(t, 'missing'))))) : null,
                filteredWorkspaces.length > 0
                  ? filteredWorkspaces.map((workspace) => {
                    const workspaceActive = workspace.files.some((file) => targetKey(file.target) === selectedKey);
                    return h('section', {
                      className: `dam-ws${workspaceActive ? ' dam-ws-active' : ''}`,
                      key: workspace.id,
                    },
                    h('div', { className: 'dam-ws-head' },
                      h('div', { className: 'dam-ws-title-row' },
                        h('span', { className: 'dam-ws-title' }, workspace.title),
                        !workspace.available
                          ? h('span', { className: 'dam-badge dam-badge-unavailable' }, tr(t, 'unavailable'))
                          : null,
                        h('span', { className: 'dam-ws-count' },
                          tr(t, 'workspaceItemCount', { count: workspace.files.length }))),
                      h('div', { className: 'dam-ws-path', title: workspace.path }, workspace.path)),
                    h('div', { className: 'dam-ws-files' },
                      workspace.files.length
                        ? workspace.files.map((file) => renderFile(file, workspace))
                        : h('div', { className: 'dam-help', style: { padding: '4px 6px' } }, tr(t, 'emptyWorkspace'))));
                  })
                  : h('div', { className: 'dam-empty', style: { padding: '22px 10px' } },
                    h('p', null, snapshot && snapshot.workspaces.length === 0 ? tr(t, 'noWorkspaces') : tr(t, 'emptyWorkspace'))))),
            h('main', { className: 'dam-main' }, renderEditor())),
          modal === 'new' ? h(Dialog, {
            title: tr(t, 'newTitle'),
            onClose: () => setModal(null),
            footer: [
              h('button', {
                key: 'cancel',
                type: 'button',
                className: 'dam-btn',
                onClick: () => setModal(null),
              }, tr(t, 'cancel')),
              h('button', {
                key: 'create',
                type: 'button',
                className: 'dam-btn dam-btn-primary',
                onClick: createFile,
                disabled: busy || !newWorkspace || !newPath.trim(),
              }, busy ? tr(t, 'creating') : tr(t, 'create')),
            ],
          },
          h('label', { className: 'dam-field' },
            h('span', null, tr(t, 'workspace')),
            h('select', {
              className: 'dam-select',
              value: newWorkspace,
              onChange: (event) => setNewWorkspace(event.target.value),
            }, availableWorkspaces.map((workspace) => h('option', {
              key: workspace.id,
              value: workspace.id,
            }, `${workspace.title} — ${workspace.path}`)))),
          h('label', { className: 'dam-field' },
            h('span', null, tr(t, 'relativePath')),
            h('input', {
              className: 'dam-input',
              value: newPath,
              autoFocus: true,
              spellCheck: false,
              onChange: (event) => setNewPath(event.target.value),
              onKeyDown: (event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void createFile();
                }
              },
            })),
          h('p', { className: 'dam-help' }, tr(t, 'pathHint')),
          modalError ? h('div', { className: 'dam-inline-error', role: 'alert' }, modalError) : null) : null,
          modal === 'delete' && doc ? h(Dialog, {
            title: tr(t, 'deleteConfirmTitle'),
            onClose: () => setModal(null),
            footer: [
              h('button', {
                key: 'cancel',
                type: 'button',
                className: 'dam-btn',
                onClick: () => setModal(null),
              }, tr(t, 'cancel')),
              h('button', {
                key: 'delete',
                type: 'button',
                className: 'dam-btn dam-btn-danger',
                onClick: remove,
                disabled: busy,
              }, tr(t, 'confirmDelete')),
            ],
          }, h('p', { className: 'dam-confirm-text' }, tr(t, 'deleteConfirm', { path: doc.path }))) : null,
          updateOpen ? h(UpdateDialog, {
            currentVersion: snapshot?.version || '',
            t,
            onClose: () => setUpdateOpen(false),
          }) : null,
          skillWorkspace ? h(SkillManagerDialog, {
            workspace: skillWorkspace,
            t,
            onClose: () => setSkillWorkspace(null),
            onRefresh: refreshMetadata,
          }) : null,
          confirmElement));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, DICT), 'agents-manager dictionaries');
        const t = ctx.locale.bind(NS);
        const label = () => tr(t, 'title');

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: 'agents-manager',
          locale: NS,
        }, (props) => h(Page, { ...props, t })));

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: 'agents-manager',
          order: 30,
          label,
          locale: NS,
        }, (props) => h(ManagerIcon, { size: typeof props.size === 'number' ? props.size : 18, active: props.active })));
      },
    };
  },
});
