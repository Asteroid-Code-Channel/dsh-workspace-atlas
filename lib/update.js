const RELEASE_NOTES_LIMIT = 4000;

export function parseRepository(value) {
  if (value && typeof value === 'object' && typeof value.url === 'string') {
    return parseRepository(value.url);
  }
  if (typeof value !== 'string') return '';
  const candidate = value
    .trim()
    .replace(/^git\+/, '')
    .replace(/^github:/, '')
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/^\/+|\/+$/g, '');
  const match = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/.exec(candidate);
  if (!match) return '';
  return `${match[1]}/${match[2]}`;
}

export function normalizeTag(value) {
  if (typeof value !== 'string') return '';
  const tag = value.trim();
  if (!/^[A-Za-z0-9._-]+$/.test(tag)) return '';
  return tag;
}

export function stripVersionPrefix(value) {
  return String(value || '').trim().replace(/^v/i, '');
}

export function compareVersions(left, right) {
  const leftParts = stripVersionPrefix(left).split(/[.+-]/).map((part) => Number.parseInt(part, 10));
  const rightParts = stripVersionPrefix(right).split(/[.+-]/).map((part) => Number.parseInt(part, 10));
  const length = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < length; index += 1) {
    const a = Number.isFinite(leftParts[index]) ? leftParts[index] : 0;
    const b = Number.isFinite(rightParts[index]) ? rightParts[index] : 0;
    if (a !== b) return a > b ? 1 : -1;
  }
  return 0;
}

export async function fetchLatestRelease(repository, fetchImpl = fetch) {
  const response = await fetchImpl(`https://api.github.com/repos/${repository}/releases/latest`, {
    headers: {
      accept: 'application/vnd.github+json',
      'user-agent': 'dsh-workspace-atlas-updater',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`GitHub release check failed (HTTP ${response.status})`);
  }
  const payload = await response.json();
  const tag = normalizeTag(payload?.tag_name);
  if (!tag) throw new Error('GitHub release has no usable tag');
  return {
    tag,
    version: stripVersionPrefix(tag),
    url: typeof payload.html_url === 'string' ? payload.html_url : '',
    publishedAt: typeof payload.published_at === 'string' ? payload.published_at : '',
    notes: typeof payload.body === 'string' ? payload.body.slice(0, RELEASE_NOTES_LIMIT) : '',
  };
}

export async function inspectUpdate({ repository, currentVersion, canAutoUpdate = false, fetchImpl = fetch }) {
  const parsed = parseRepository(repository);
  if (!parsed) {
    return {
      configured: false,
      currentVersion,
      canAutoUpdate: false,
    };
  }

  try {
    const latest = await fetchLatestRelease(parsed, fetchImpl);
    return {
      configured: true,
      repository: parsed,
      currentVersion,
      latestVersion: latest.version,
      latestTag: latest.tag,
      updateAvailable: compareVersions(latest.version, currentVersion) > 0,
      releaseUrl: latest.url,
      publishedAt: latest.publishedAt,
      notes: latest.notes,
      canAutoUpdate,
    };
  } catch (error) {
    return {
      configured: true,
      repository: parsed,
      currentVersion,
      canAutoUpdate,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
