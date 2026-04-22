import type { FileType } from '../types.js';

export function classifyFile(path: string): FileType {
  const filename = path.split('/').pop() || '';

  // Test files
  if (/\.(test|spec)\.(ts|tsx|js|jsx|py|rb)$/.test(path)) return 'test';
  if (/^(test|tests|__tests__)\//.test(path)) return 'test';
  if (/^test_.*\.py$/.test(filename)) return 'test';

  // Planning/spec files
  if (/^(docs|specs|plans|design)\//i.test(path)) return 'plan';
  if (/(plan|spec|design|rfc|adr)/i.test(filename) && filename.endsWith('.md')) return 'plan';
  if (/^(TODO|ARCHITECTURE|DESIGN)\.md$/i.test(filename)) return 'plan';

  // Config
  if (/\.(json|yaml|yml|toml|ini|env)$/.test(filename)) return 'config';
  if (/^\./.test(filename)) return 'config';

  // Docs (non-plan .md)
  if (filename.endsWith('.md')) return 'docs';

  // Everything else is implementation
  return 'impl';
}

export function isTestFile(path: string): boolean {
  return classifyFile(path) === 'test';
}

export function isPlanFile(path: string): boolean {
  return classifyFile(path) === 'plan';
}

export function isTemplateMessage(msg: string): boolean {
  const templates = [
    /^merge branch/i,
    /^merge pull request/i,
    /^initial commit$/i,
    /^wip$/i,
    /^update \w+\.\w+$/i,
    /^auto-commit/i,
  ];
  return templates.some(t => t.test(msg.trim()));
}
