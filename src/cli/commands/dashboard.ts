import type { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import open from 'open';
import { initDb } from '../../storage/db.js';
import { startServer } from '../../server/index.js';

export function registerDashboard(program: Command): void {
  program
    .command('dashboard')
    .description('Open real-time pixel dashboard')
    .option('-p, --port <n>', 'Port number', '3742')
    .action(async (opts) => {
      const dbPath = path.join(process.cwd(), '.vibe-check', 'db.sqlite');
      initDb(dbPath);

      const port = parseInt(opts.port) || 3742;
      startServer(port);

      const url = `http://localhost:${port}`;
      console.log(chalk.yellow(`\u26A1 vibe-check dashboard running at ${chalk.white(url)}`));
      console.log(chalk.gray('  Press Ctrl+C to stop'));

      await open(url);
    });
}
