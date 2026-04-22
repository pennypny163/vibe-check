import { describe, it, expect } from 'vitest';
import { scoreThoughtfulness } from '../../src/analyzer/scorers/thoughtfulness.js';
import type { CommitData } from '../../src/types.js';

function makeCommit(overrides: Partial<CommitData> = {}): CommitData {
  return {
    hash: 'abc123', timestamp: Date.now(),
    message: 'feat: add feature with thoughtful description that exceeds fifty chars easily',
    files: [{ path: 'src/index.ts', added: 20, deleted: 5 }],
    lines_added: 20, lines_deleted: 5,
    ai_detected: false, repoCIEnabled: false,
    ...overrides,
  };
}

describe('scoreThoughtfulness', () => {
  it('returns baseline 50 for plain impl commit with short message', () => {
    expect(scoreThoughtfulness(makeCommit({ message: 'fix stuff' }))).toBe(50);
  });
  it('adds points when plan files present alongside impl', () => {
    const score = scoreThoughtfulness(makeCommit({
      files: [
        { path: 'docs/plan.md', added: 10, deleted: 0 },
        { path: 'src/index.ts', added: 20, deleted: 5 },
      ],
    }));
    expect(score).toBeGreaterThanOrEqual(80);
  });
  it('adds more for pure planning commit', () => {
    const score = scoreThoughtfulness(makeCommit({
      files: [{ path: 'docs/design.md', added: 50, deleted: 0 }],
    }));
    expect(score).toBeGreaterThanOrEqual(85);
  });
  it('penalizes vibe code pattern', () => {
    const score = scoreThoughtfulness(makeCommit({
      ai_detected: true, lines_added: 300, message: 'add stuff',
      files: [{ path: 'src/big.ts', added: 300, deleted: 0 }],
    }));
    expect(score).toBeLessThanOrEqual(30);
  });
  it('clamps to 0-100', () => {
    const score = scoreThoughtfulness(makeCommit({
      ai_detected: true, lines_added: 500, message: 'x',
      files: [{ path: 'src/x.ts', added: 500, deleted: 0 }],
    }));
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
