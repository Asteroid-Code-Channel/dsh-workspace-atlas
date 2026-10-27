# Changelog

## 0.3.0

- Add a structured Agent Skills create form with `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`, and Markdown body.
- Generate spec-compliant YAML frontmatter automatically; `name` and `description` are required.
- Add structured editing for existing native skills while preserving the Markdown body and unknown frontmatter fields.
- Add a skill file manager for nested files and folders, including create, edit, and delete.
- Validate skill-relative paths and reject symbolic-link traversal.

## 0.2.1

- Rename the display name to AGENTS & Skills Studio / AGENTS & Skills 工作台.
- Rewrite the README, package description, locale metadata, and marketplace copy around AGENTS.md, multi-SKILL management, and the four skill sources.
- Add marketplace screenshots and a `screenshots.json` manifest.

## 0.2.0

- Rename the project to Workspace Atlas / 工作区图谱.
- Add a left-to-right, collapsible workspace tree with smooth expand/collapse animation.
- Add tree search that reveals matching nodes together with their ancestors and descendants.
- Add per-node `AGENTS` and `SKILL` buttons with orange/green file-state indicators.
- Add multi-skill management under `.dsh/skills/<name>/SKILL.md`, including create, edit, delete, URL import, and a local skill library.
- Add SKILL count badges to list rows and tree nodes; legacy root `SKILL.md` remains supported.
- Add global skill management at `$DSH_HOME/skills`.
- Add a four-source skill catalog (Anthropic, OpenAI, Cursor, Matt Pocock) with GitHub index sync, manual refresh, whole-directory installation, and repository links.
- Add a file dialog for creating and editing workspace-root `AGENTS.md`.
- Replace native confirm dialogs with in-app confirmations so focus returns to the editor or the host UI.
- Keep the list view flat and alphabetically sorted; list each workspace root `AGENTS.md` and SKILL summary only.
- Add a header version button with GitHub Release checking and one-click update through DSH Plugin Manager.
- Add atomic writes, external-change conflict detection, backups, and path-escape protection.

## 0.1.0

- Initial AGENTS manager with global and workspace file editing.
