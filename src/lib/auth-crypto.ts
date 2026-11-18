// Cryptographic password hashing and verification utility

/**
 * Creates a salted SHA-256 hash representation of a plaintext password.
 * Format: s256:<salt>:<hash>
 */
export async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const data = encoder.encode(`${salt}:${plainText}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `s256:${salt}:${hashHex}`;
}

/**
 * Verifies a plaintext password against a stored hash string.
 * Supports both s256 salted hashes and legacy plaintext values.
 */
export async function verifyPassword(plainText: string, storedHash: string): Promise<boolean> {
  if (!storedHash) return false;

  // Handle s256 salted hash format
  if (storedHash.startsWith('s256:')) {
    const parts = storedHash.split(':');
    if (parts.length !== 3) return false;

    const salt = parts[1];
    const expectedHash = parts[2];

    const encoder = new TextEncoder();
    const data = encoder.encode(`${salt}:${plainText}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const calculatedHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return calculatedHash === expectedHash;
  }

  // Fallback for legacy plaintext entries
  return plainText === storedHash;
}
