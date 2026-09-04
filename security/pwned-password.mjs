const RANGE_URL = 'https://api.pwnedpasswords.com/range/';

function toHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

export async function sha1Hex(value) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError('Password must be a non-empty string.');
  }

  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-1', bytes);
  return toHex(digest);
}

export async function checkPwnedPassword(password, { fetchImpl = fetch } = {}) {
  const hash = await sha1Hex(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const response = await fetchImpl(`${RANGE_URL}${prefix}`, {
    method: 'GET',
    headers: {
      'Add-Padding': 'true',
    },
  });

  if (!response.ok) {
    throw new Error(`Pwned Passwords lookup failed with HTTP ${response.status}.`);
  }

  const body = await response.text();
  let count = 0;

  for (const line of body.split(/\r?\n/)) {
    if (!line) continue;
    const [candidateSuffix, candidateCount] = line.split(':');
    if (candidateSuffix?.toUpperCase() === suffix) {
      count = Number.parseInt(candidateCount ?? '0', 10) || 0;
      break;
    }
  }

  return {
    compromised: count > 0,
    breachCount: count,
  };
}

export async function enforceSafePassword(password, options) {
  const result = await checkPwnedPassword(password, options);
  if (result.compromised) {
    const error = new Error('This password appears in known breach data. Choose a different password.');
    error.code = 'COMPROMISED_PASSWORD';
    error.breachCount = result.breachCount;
    throw error;
  }
  return result;
}
