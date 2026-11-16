const fs = require('fs');
const { execSync } = require('child_process');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const lines = envFile.split('\n');

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;
  const eqIdx = line.indexOf('=');
  if (eqIdx === -1) continue;

  const key = line.slice(0, eqIdx).trim();
  let value = line.slice(eqIdx + 1).trim();

  // Strip wrapping quotes
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  // Skip Vercel OIDC auto-generated token
  if (key === 'VERCEL_OIDC_TOKEN') continue;

  console.log(`Setting Vercel env: ${key}...`);
  try {
    execSync(`npx vercel env add ${key} --environment production,preview,development --value "${value}" --force --yes`, {
      stdio: 'inherit',
    });
  } catch (err) {
    console.error(`Failed to set ${key}:`, err.message);
  }
}

console.log('All environment variables synced to Vercel successfully!');
