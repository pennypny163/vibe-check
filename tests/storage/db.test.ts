import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDb, closeDb } from '../../src/storage/db.js';
import { insertCommit, getRecentCommits, getCommitCount } from '../../src/storage/commits.js';
import { getPet, savePet, createPet } from '../../src/storage/pet-store.js';
import { getDailySummary, updateDailySummary } from '../../src/storage/aggregator.js';
import type { CommitResult } from '../../src/types.js';
import fs from 'fs';
import path from 'path';

const TEST_DB_DIR = '/tmp/vibe-check-test-' + Date.now();
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'db.sqlite');

beforeEach(() => {
  fs.mkdirSync(TEST_DB_DIR, { recursive: true });
  initDb(TEST_DB_PATH);
});

afterEach(() => {
  closeDb();
  fs.rmSync(TEST_DB_DIR, { recursive: true, force: true });
});

describe('storage: commits', () => {
  it('inserts and retrieves a commit', () => {
    const commit: CommitResult = {
      hash: 'abc123', timestamp: 1000, message: 'test',
      files: [{ path: 'src/x.ts', added: 10, deleted: 0 }],
      lines_added: 10, lines_deleted: 0,
      ai_detected: false, repoCIEnabled: false,
      think_score: 70, test_score: 80, verify_score: 60,
      overall_score: 71, xp_earned: 10, hp_change: 0,
      has_tests: false, has_plans: false,
    };
    insertCommit(commit);
    const recent = getRecentCommits(10);
    expect(recent).toHaveLength(1);
    expect(recent[0].hash).toBe('abc123');
  });
  it('counts commits', () => {
    expect(getCommitCount()).toBe(0);
    insertCommit({
      hash: 'a', timestamp: 1, message: '', files: [],
      lines_added: 0, lines_deleted: 0, ai_detected: false,
      repoCIEnabled: false, think_score: 0, test_score: 0,
      verify_score: 0, overall_score: 0, xp_earned: 0, hp_change: 0,
      has_tests: false, has_plans: false,
    });
    expect(getCommitCount()).toBe(1);
  });
});

describe('storage: pet', () => {
  it('creates and retrieves pet', () => {
    createPet('dragon', 'PYXEL');
    const pet = getPet();
    expect(pet).not.toBeNull();
    expect(pet!.species).toBe('dragon');
    expect(pet!.name).toBe('PYXEL');
    expect(pet!.level).toBe(1);
  });
  it('saves updated pet state', () => {
    createPet('cat', 'WHISKER');
    const pet = getPet()!;
    pet.level = 5;
    pet.xp = 100;
    savePet(pet);
    const updated = getPet()!;
    expect(updated.level).toBe(5);
    expect(updated.xp).toBe(100);
  });
});

describe('storage: aggregator', () => {
  it('creates and retrieves daily summary', () => {
    updateDailySummary('2026-04-22', { avg_score: 75, commit_count: 3, quests_completed: 2, xp_earned: 45 });
    const summary = getDailySummary('2026-04-22');
    expect(summary).not.toBeNull();
    expect(summary!.avg_score).toBe(75);
  });
});
