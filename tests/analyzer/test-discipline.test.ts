import { describe, it, expect } from 'vitest';
import { scoreTestDiscipline } from '../../src/analyzer/scorers/test-discipline.js';
import type { CommitData } from '../../src/types.js';

function makeCommit(overrides: Partial<CommitData> = {}): CommitData {
  return {
    hash: 'abc', timestamp: Date.now(), message: 'test',
    files: [], lines_added: 0, lines_deleted: 0,
    ai_detected: false, repoCIEnabled: false, ...overrides,
  };
}

describe('scoreTestDiscipline', () => {
  it('returns 50 for config-only commit', () => {
    expect(scoreTestDiscipline(makeCommit({
      files: [{ path: 'tsconfig.json', added: 5, deleted: 0 }],
    }))).toBe(50);
  });
  it('returns 20 for impl-only with no tests', () => {
    expect(scoreTestDiscipline(makeCommit({
      files: [{ path: 'src/app.ts', added: 50, deleted: 0 }],
    }))).toBe(20);
  });
  it('returns 90 for pure test commit', () => {
    expect(scoreTestDiscipline(makeCommit({
      files: [{ path: 'tests/app.test.ts', added: 30, deleted: 0 }],
    }))).toBe(90);
  });
  it('returns 85 for high test ratio', () => {
    expect(scoreTestDiscipline(makeCommit({
      files: [
        { path: 'tests/app.test.ts', added: 50, deleted: 0 },
        { path: 'src/app.ts', added: 40, deleted: 0 },
      ],
    }))).toBe(85);
  });
  it('returns 40 for low test ratio', () => {
    expect(scoreTestDiscipline(makeCommit({
      files: [
        { path: 'tests/app.test.ts', added: 5, deleted: 0 },
        { path: 'src/app.ts', added: 100, deleted: 0 },
      ],
    }))).toBe(40);
  });
});
