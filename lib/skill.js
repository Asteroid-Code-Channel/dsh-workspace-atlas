const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;
const MAX_COMPATIBILITY = 500;
const MAX_LICENSE = 500;
const MAX_ALLOWED_TOOLS = 2000;
const MAX_METADATA_ENTRIES = 50;

export class SkillSpecError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'SkillSpecError';
    this.code = code;
  }
}

function text(value) {
  return typeof value === 'string' ? value.replace(/\r\n?/g, '\n') : '';
}

function normalizeMetadata(value) {
  if (value == null) return {};
  const source = Array.isArray(value)
    ? Object.fromEntries(value
      .filter((entry) => entry && typeof entry === 'object')
      .map((entry) => [entry.key, entry.value]))
    : value;
  if (typeof source !== 'object' || Array.isArray(source)) {
    throw new SkillSpecError('error.invalidMetadata', 'metadata must be a key-value mapping.');
  }
  const entries = Object.entries(source);
  if (entries.length > MAX_METADATA_ENTRIES) {
    throw new SkillSpecError('error.invalidMetadata', `metadata supports at most ${MAX_METADATA_ENTRIES} entries.`);
  }
  const metadata = {};
  for (const [rawKey, rawValue] of entries) {
    const key = String(rawKey ?? '').trim();
    const entry = String(rawValue ?? '').trim();
    if (!key) throw new SkillSpecError('error.invalidMetadata', 'metadata keys cannot be empty.');
    if (key.length > 100) throw new SkillSpecError('error.invalidMetadata', 'metadata keys are limited to 100 characters.');
    if (entry.length > 2000) throw new SkillSpecError('error.invalidMetadata', 'metadata values are limited to 2000 characters.');
    if (key.includes('\0') || entry.includes('\0')) {
      throw new SkillSpecError('error.invalidMetadata', 'metadata cannot contain NUL characters.');
    }
    metadata[key] = entry;
  }
  return metadata;
}

export function validateSkillName(value) {
  const name = typeof value === 'string' ? value.trim() : '';
  if (!name) throw new SkillSpecError('error.invalidSkillName', 'name is required.');
  if (name.length > MAX_NAME) throw new SkillSpecError('error.invalidSkillName', `name is limited to ${MAX_NAME} characters.`);
  if (!NAME_RE.test(name)) {
    throw new SkillSpecError(
      'error.invalidSkillName',
      'name may only contain lowercase letters, numbers, and single hyphens, and must not start or end with a hyphen.',
    );
  }
  return name;
}

function normalizeExistingName(value) {
  const name = typeof value === 'string' ? value.trim() : '';
  if (!name) throw new SkillSpecError('error.invalidSkillName', 'name is required.');
  if (name.length > 80 || name.includes('\0') || /[\\/]/.test(name) || name === '.' || name === '..') {
    throw new SkillSpecError('error.invalidSkillName', 'The existing skill name is invalid.');
  }
  return name;
}

export function normalizeSkillDefinition(input = {}, options = {}) {
  const name = options.validateName === false
    ? normalizeExistingName(input.name)
    : validateSkillName(input.name);
  const description = text(input.description).trim();
  if (!description) throw new SkillSpecError('error.descriptionRequired', 'description is required.');
  if (description.length > MAX_DESCRIPTION) {
    throw new SkillSpecError('error.descriptionTooLong', `description is limited to ${MAX_DESCRIPTION} characters.`);
  }
  const license = text(input.license).trim();
  const compatibility = text(input.compatibility).trim();
  const allowedTools = text(input.allowedTools ?? input['allowed-tools']).trim();
  if (license.length > MAX_LICENSE) throw new SkillSpecError('error.licenseTooLong', `license is limited to ${MAX_LICENSE} characters.`);
  if (compatibility.length > MAX_COMPATIBILITY) {
    throw new SkillSpecError('error.compatibilityTooLong', `compatibility is limited to ${MAX_COMPATIBILITY} characters.`);
  }
  if (allowedTools.length > MAX_ALLOWED_TOOLS) {
    throw new SkillSpecError('error.allowedToolsTooLong', `allowed-tools is limited to ${MAX_ALLOWED_TOOLS} characters.`);
  }
  const body = text(input.body ?? input.contentBody ?? '');
  const extra = Array.isArray(input.extra)
    ? input.extra.filter((line) => typeof line === 'string' && !line.includes('\0'))
    : [];
  return {
    fields: {
      name,
      description,
      license,
      compatibility,
      metadata: normalizeMetadata(input.metadata),
      allowedTools,
    },
    body,
    extra,
  };
}

function scalar(value, indent = 0) {
  const valueText = String(value ?? '');
  if (valueText.includes('\n')) {
    const prefix = ' '.repeat(indent + 2);
    return `|-\n${valueText.split('\n').map((line) => `${prefix}${line}`).join('\n')}`;
  }
  if (
    valueText !== ''
    && !/^[\s]|[\s]$/.test(valueText)
    && !/[:#\[\]{}&*!|>'"%@`]/.test(valueText)
    && !valueText.startsWith('-')
  ) {
    return valueText;
  }
  return `'${valueText.replaceAll("'", "''")}'`;
}

export function serializeSkill(input = {}, options = {}) {
  const { fields, body, extra } = normalizeSkillDefinition(input, options);
  const lines = ['---'];
  lines.push(`name: ${scalar(fields.name)}`);
  lines.push(`description: ${scalar(fields.description)}`);
  if (fields.license) lines.push(`license: ${scalar(fields.license)}`);
  if (fields.compatibility) lines.push(`compatibility: ${scalar(fields.compatibility)}`);
  const metadataEntries = Object.entries(fields.metadata);
  if (metadataEntries.length) {
    lines.push('metadata:');
    for (const [key, value] of metadataEntries) {
      lines.push(`  ${scalar(key, 2)}: ${scalar(value, 2)}`);
    }
  }
  if (fields.allowedTools) lines.push(`allowed-tools: ${scalar(fields.allowedTools)}`);
  for (const line of extra) lines.push(line);
  lines.push('---', '');
  const normalizedBody = body.replace(/\n+$/, '');
  return `${lines.join('\n')}${normalizedBody ? `${normalizedBody}\n` : ''}`;
}

function decode(value) {
  const input = String(value ?? '').trim();
  if (!input) return '';
  if (input.startsWith('"') && input.endsWith('"')) {
    try {
      return JSON.parse(input);
    } catch {
      return input.slice(1, -1);
    }
  }
  if (input.startsWith("'") && input.endsWith("'")) {
    return input.slice(1, -1).replaceAll("''", "'");
  }
  return input;
}

function readBlock(lines, start, style) {
  const block = [];
  let index = start;
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === '') {
      block.push('');
      index += 1;
      continue;
    }
    if (!/^\s/.test(line)) break;
    block.push(line.replace(/^\s{1,2}/, ''));
    index += 1;
  }
  const joined = block.join('\n');
  return { value: style === '>' ? joined.replace(/\n+/g, ' ').trim() : joined, next: index };
}

export function parseSkill(content) {
  const source = text(content);
  const lines = source.split('\n');
  if (lines[0]?.trim() !== '---') {
    return {
      fields: { name: '', description: '', license: '', compatibility: '', metadata: {}, allowedTools: '' },
      body: source,
      extra: [],
      hasFrontmatter: false,
    };
  }
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (end < 0) {
    return {
      fields: { name: '', description: '', license: '', compatibility: '', metadata: {}, allowedTools: '' },
      body: source,
      extra: [],
      hasFrontmatter: false,
    };
  }
  const frontmatter = lines.slice(1, end);
  const body = lines.slice(end + 1).join('\n').replace(/^\n/, '');
  const fields = { name: '', description: '', license: '', compatibility: '', metadata: {}, allowedTools: '' };
  const extra = [];
  let index = 0;
  while (index < frontmatter.length) {
    const line = frontmatter[index];
    if (!line.trim() || /^\s*#/.test(line)) {
      index += 1;
      continue;
    }
    if (/^\s/.test(line)) {
      extra.push(line);
      index += 1;
      continue;
    }
    const colon = line.indexOf(':');
    if (colon <= 0) {
      extra.push(line);
      index += 1;
      continue;
    }
    const key = line.slice(0, colon).trim();
    const rawValue = line.slice(colon + 1).trim();
    const style = rawValue === '|' || rawValue === '|-' ? '|' : rawValue === '>' || rawValue === '>-' ? '>' : null;
    if (style) {
      const block = readBlock(frontmatter, index + 1, style);
      if (key === 'description') fields.description = block.value;
      else if (key === 'license') fields.license = block.value;
      else if (key === 'compatibility') fields.compatibility = block.value;
      else if (key === 'allowed-tools') fields.allowedTools = block.value;
      else extra.push(...frontmatter.slice(index, block.next));
      index = block.next;
      continue;
    }
    if (key === 'metadata') {
      index += 1;
      while (index < frontmatter.length) {
        const entryLine = frontmatter[index];
        if (!entryLine.trim()) {
          index += 1;
          continue;
        }
        if (!/^\s+/.test(entryLine)) break;
        const entryColon = entryLine.indexOf(':');
        if (entryColon < 0) {
          index += 1;
          continue;
        }
        const metaKey = decode(entryLine.slice(0, entryColon).trim());
        const metaRaw = entryLine.slice(entryColon + 1).trim();
        if (metaRaw === '|' || metaRaw === '|-' || metaRaw === '>' || metaRaw === '>-') {
          const block = readBlock(frontmatter, index + 1, metaRaw.startsWith('>') ? '>' : '|');
          fields.metadata[metaKey] = block.value;
          index = block.next;
        } else {
          fields.metadata[metaKey] = decode(metaRaw);
          index += 1;
        }
      }
      continue;
    }
    const value = decode(rawValue);
    if (key === 'name') fields.name = value;
    else if (key === 'description') fields.description = value;
    else if (key === 'license') fields.license = value;
    else if (key === 'compatibility') fields.compatibility = value;
    else if (key === 'allowed-tools') fields.allowedTools = value;
    else extra.push(line);
    index += 1;
  }
  return { fields, body, extra, hasFrontmatter: true };
}
