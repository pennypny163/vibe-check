import { getDb } from './db.js';
import type { DailySummary } from '../types.js';

export function updateDailySummary(
  date: string,
  data: Omit<DailySummary, 'date'>
): void {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO daily_summary (date, avg_score, commit_count, quests_completed, xp_earned)
    VALUES (?, ?, ?, ?, ?)
  `).run(date, data.avg_score, data.commit_count, data.quests_completed, data.xp_earned);
}

export function getDailySummary(date: string): DailySummary | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM daily_summary WHERE date = ?').get(date) as any;
  return row || null;
}

export function getRecentSummaries(days: number): DailySummary[] {
  const db = getDb();
  return db.prepare(
    'SELECT * FROM daily_summary ORDER BY date DESC LIMIT ?'
  ).all(days) as DailySummary[];
}
