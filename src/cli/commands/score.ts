import type { Command } from 'commander';
import path from 'path';
import { initDb } from '../../storage/db.js';
import { getRecentCommits } from '../../storage/commits.js';

export function registerScore(program: Command): void {
  program
    .command('score')
    .description('Output current overall score (0-100)')
    .action(() => {
      const dbPath = path.join(process.cwd(), '.vibe-check', 'db.sqlite');
      initDb(dbPath);
      const commits = getRecentCommits(30);
      if (commits.length === 0) { console.log('0'); return; }
      const avg = Math.round(commits.reduce((s, c) => s + c.overall_score, 0) / commits.length);
      console.log(String(avg));
    });
}
