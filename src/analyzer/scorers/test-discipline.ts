import type { CommitData } from '../../types.js';
import { classifyFile } from '../classifier.js';

export function scoreTestDiscipline(commit: CommitData): number {
  const classified = commit.files.map(f => ({
    ...f,
    type: classifyFile(f.path),
  }));

  const testFiles = classified.filter(f => f.type === 'test');
  const implFiles = classified.filter(f => f.type === 'impl');

  if (testFiles.length === 0 && implFiles.length === 0) return 50;
  if (testFiles.length === 0 && implFiles.length > 0) return 20;
  if (testFiles.length > 0 && implFiles.length === 0) return 90;

  const testLines = testFiles.reduce((s, f) => s + f.added, 0);
  const implLines = implFiles.reduce((s, f) => s + f.added, 0);
  const total = testLines + implLines;
  if (total === 0) return 50;

  const ratio = testLines / total;

  if (ratio > 0.4) return 85;
  if (ratio > 0.2) return 65;
  return 40;
}
