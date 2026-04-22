import type { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { initDb } from '../../storage/db.js';
import { getRecentSummaries } from '../../storage/aggregator.js';

export function registerHistory(program: Command): void {
  program
    .command('history')
    .description('Show score trend')
    .option('-d, --days <n>', 'Number of days', '30')
    .action((opts) => {
      const dbPath = path.join(process.cwd(), '.vibe-check', 'db.sqlite');
      initDb(dbPath);
      const days = parseInt(opts.days) || 30;
      const summaries = getRecentSummaries(days).reverse();

      if (summaries.length === 0) {
        console.log(chalk.gray('No history yet. Make some commits!'));
        return;
      }

      console.log('');
      console.log(chalk.yellow(`\u26A1 Score Trend (last ${days} days)`));
      console.log('');

      for (const s of summaries) {
        const bar = Math.round(s.avg_score / 2);
        const color = s.avg_score >= 80 ? chalk.green : s.avg_score >= 60 ? chalk.yellow : chalk.red;
        console.log(`  ${chalk.gray(s.date)} ${color('\u2588'.repeat(bar))} ${Math.round(s.avg_score)} (${s.commit_count} commits)`);
      }
      console.log('');
    });
}
