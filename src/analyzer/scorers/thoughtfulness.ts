import type { CommitData } from '../../types.js';
import { classifyFile, isTemplateMessage } from '../classifier.js';
import { clamp } from '../../utils.js';

export function scoreThoughtfulness(commit: CommitData): number {
  let score = 50;

  const types = commit.files.map(f => classifyFile(f.path));
  const hasPlan = types.includes('plan');
  const hasImpl = types.includes('impl');
  const hasDocs = types.includes('docs');

  if (hasPlan && hasImpl) score += 30;
  else if (hasPlan && !hasImpl) score += 35;

  if (commit.message.length > 50 && !isTemplateMessage(commit.message)) score += 10;

  if (hasDocs) score += 10;

  if (commit.ai_detected && commit.lines_added > 200 && commit.message.length < 20) score -= 30;

  return clamp(score, 0, 100);
}
