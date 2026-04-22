import { getDb } from './db.js';
import type { CommitResult } from '../types.js';

export function insertCommit(commit: CommitResult): void {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO commits
    (hash, timestamp, message, ai_detected, files, lines_added, lines_deleted,
     has_tests, has_plans, think_score, test_score, verify_score,
     overall_score, xp_earned, hp_change)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    commit.hash, commit.timestamp, commit.message,
    commit.ai_detected ? 1 : 0,
    JSON.stringify(commit.files),
    commit.lines_added, commit.lines_deleted,
    commit.has_tests ? 1 : 0, commit.has_plans ? 1 : 0,
    commit.think_score, commit.test_score, commit.verify_score,
    commit.overall_score, commit.xp_earned, commit.hp_change,
  );
}

export function getRecentCommits(limit: number): CommitResult[] {
  const db = getDb();
  const rows = db.prepare(
    'SELECT * FROM commits ORDER BY timestamp DESC LIMIT ?'
  ).all(limit) as any[];
  return rows.map(r => ({
    ...r,
    files: JSON.parse(r.files || '[]'),
    ai_detected: !!r.ai_detected,
    has_tests: !!r.has_tests,
    has_plans: !!r.has_plans,
    repoCIEnabled: false,
  }));
}

export function getCommitCount(): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as cnt FROM commits').get() as any;
  return row.cnt;
}

export function getCommitsWithHighTestScore(threshold: number): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as cnt FROM commits WHERE test_score >= ?').get(threshold) as any;
  return row.cnt;
}

export function getCommitsWithHighThinkScore(threshold: number): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as cnt FROM commits WHERE think_score >= ?').get(threshold) as any;
  return row.cnt;
}
