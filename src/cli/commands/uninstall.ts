import type { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { uninstallHook } from '../../analyzer/hooks.js';
import { closeDb } from '../../storage/db.js';

export function registerUninstall(program: Command): void {
  program
    .command('uninstall')
    .description('Remove vibe-check from current repo')
    .action(() => {
      const repoPath = process.cwd();

      uninstallHook(repoPath);
      console.log(chalk.gray('  \u2713 Git hook removed'));

      closeDb();
      const vibeDir = path.join(repoPath, '.vibe-check');
      if (fs.existsSync(vibeDir)) {
        fs.rmSync(vibeDir, { recursive: true, force: true });
        console.log(chalk.gray('  \u2713 .vibe-check/ directory removed'));
      }

      console.log(chalk.green('  \u2705 vibe-check uninstalled. Your pet has been released into the wild \uD83C\uDF3F'));
    });
}
