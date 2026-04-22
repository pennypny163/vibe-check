import { describe, it, expect } from 'vitest';
import { scoreVerification } from '../../src/analyzer/scorers/verification.js';
import type { CommitData } from '../../src/types.js';

function makeCommit(overrides: Partial<CommitData> = {}): CommitData {
  return {
    hash: 'abc', timestamp: Date.now(), message: 'some commit',
    files: [{ path: 'src/x.ts', added: 10, deleted: 0 }],
    lines_added: 10, lines_deleted: 0,
    ai_detected: false, repoCIEnabled: false, ...overrides,
  };
}

describe('scoreVerification', () => {
  it('returns baseline for plain commit', () => {
    expect(scoreVerification(makeCommit())).toBeGreaterThanOrEqual(40);
  });
  it('adds for evidence keywords', () => {
    expect(scoreVerification(makeCommit({
      message: 'feat: add auth — all tests pass',
    }))).toBeGreaterThanOrEqual(65);
  });
  it('adds for CI enabled', () => {
    expect(scoreVerification(makeCommit({ repoCIEnabled: true }))).toBeGreaterThanOrEqual(55);
  });
  it('adds for small commit', () => {
    expect(scoreVerification(makeCommit({
      lines_added: 20, lines_deleted: 5,
    }))).toBeGreaterThanOrEqual(50);
  });
  it('adds when test files present', () => {
    expect(scoreVerification(makeCommit({
      files: [
        { path: 'src/x.ts', added: 10, deleted: 0 },
        { path: 'tests/x.test.ts', added: 15, deleted: 0 },
      ],
    }))).toBeGreaterThanOrEqual(50);
  });
  it('caps at 100', () => {
    const score = scoreVerification(makeCommit({
      message: 'feat: all tests pass, lint clean, verified',
      repoCIEnabled: true, lines_added: 10, lines_deleted: 5,
      files: [
        { path: 'src/x.ts', added: 10, deleted: 0 },
        { path: 'tests/x.test.ts', added: 5, deleted: 0 },
      ],
    }));
    expect(score).toBeLessThanOrEqual(100);
  });
});
