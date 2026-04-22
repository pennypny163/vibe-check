import type { CommitData } from '../../types.js';
import { classifyFile } from '../classifier.js';
import { clamp } from '../../utils.js';

const EVIDENCE_KEYWORDS = [
  'pass', 'green', 'lint clean', '\u2705', 'all tests',
  'verified', 'ci pass', 'build success', 'test pass',
  'tests passing', '0 errors', 'no warnings',
];

export function scoreVerification(commit: CommitData): number {
  let score = 40;

  const msg = commit.message.toLowerCase();

  if (EVIDENCE_KEYWORDS.some(e => msg.includes(e))) score += 25;
  if (commit.repoCIEnabled) score += 15;
  if (commit.lines_added + commit.lines_deleted < 50) score += 10;
  if (commit.files.some(f => classifyFile(f.path) === 'test')) score += 10;

  return clamp(score, 0, 100);
}
