import { describe, it, expect } from 'vitest';
import { assignSpecies, generateName } from '../../src/game/species.js';
import type { CommitData } from '../../src/types.js';

function makeHistory(overrides: Partial<CommitData>): CommitData[] {
  return Array(30).fill(null).map((_, i) => ({
    hash: `h${i}`, timestamp: i,
    message: 'feat: something with over fifty character description here for scoring',
    files: [{ path: 'src/x.ts', added: 50, deleted: 5 }],
    lines_added: 50, lines_deleted: 5,
    ai_detected: false, repoCIEnabled: false,
    ...overrides,
  }));
}

describe('species assignment', () => {
  it('assigns dragon for high-thoughtfulness planners', () => {
    const result = assignSpecies(makeHistory({
      files: [
        { path: 'docs/plan.md', added: 20, deleted: 0 },
        { path: 'src/x.ts', added: 30, deleted: 5 },
      ],
    }));
    expect(result.species).toBe('dragon');
  });
  it('generates a valid name', () => {
    const name = generateName('dragon');
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });
  it('assigns octopus as default', () => {
    const result = assignSpecies(makeHistory({
      ai_detected: true, lines_added: 300, message: 'wip',
      files: [{ path: 'src/big.ts', added: 300, deleted: 0 }],
    }));
    expect(result.species).toBe('octopus');
  });
});
