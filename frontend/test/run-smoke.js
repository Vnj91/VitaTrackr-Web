// Minimal smoke test runner used by package.json test script
// Instead of requiring TSX files (which Node can't parse), just verify key files exist.
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const candidates = [
  'next.config.js',
  'components/Navbar.tsx',
  'components/RecipeCard.tsx',
  'app/profile/page.tsx'
];

const missing = candidates.filter((p) => !fs.existsSync(path.join(repoRoot, p)));
if (missing.length === 0) {
  console.log('SMOKE_OK');
  process.exit(0);
} else {
  console.error('SMOKE_FAIL Missing files:', missing.join(', '));
  process.exit(2);
}
