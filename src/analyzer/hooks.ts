import fs from 'fs';
import path from 'path';

export function installHook(repoPath: string): void {
  const hooksDir = path.join(repoPath, '.git', 'hooks');
  if (!fs.existsSync(hooksDir)) {
    throw new Error('Not a git repository (no .git/hooks directory)');
  }

  const hookPath = path.join(hooksDir, 'post-commit');
  const hookContent = `#!/bin/sh
# vibe-check: auto-installed by "vibe-check init"
# Async ingest — does NOT block your commit
npx vibe-check _ingest --silent &
`;

  if (fs.existsSync(hookPath)) {
    const existing = fs.readFileSync(hookPath, 'utf-8');
    if (existing.includes('vibe-check')) return; // already installed
    fs.appendFileSync(hookPath, '\n' + hookContent);
  } else {
    fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
  }
}

export function uninstallHook(repoPath: string): void {
  const hookPath = path.join(repoPath, '.git', 'hooks', 'post-commit');
  if (!fs.existsSync(hookPath)) return;

  const content = fs.readFileSync(hookPath, 'utf-8');
  if (!content.includes('vibe-check')) return;

  const lines = content.split('\n').filter(l => !l.includes('vibe-check'));
  const cleaned = lines.join('\n').trim();

  if (cleaned === '#!/bin/sh' || cleaned === '') {
    fs.unlinkSync(hookPath);
  } else {
    fs.writeFileSync(hookPath, cleaned + '\n', { mode: 0o755 });
  }
}

export function ensureVibeCheckDir(repoPath: string): string {
  const dir = path.join(repoPath, '.vibe-check');
  fs.mkdirSync(dir, { recursive: true });

  const gitignorePath = path.join(repoPath, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf-8');
    if (!content.includes('.vibe-check')) {
      fs.appendFileSync(gitignorePath, '\n.vibe-check/\n');
    }
  } else {
    fs.writeFileSync(gitignorePath, '.vibe-check/\n');
  }

  return dir;
}
