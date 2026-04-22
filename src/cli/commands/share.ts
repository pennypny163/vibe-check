import type { Command } from 'commander';
import chalk from 'chalk';

export function registerShare(program: Command): void {
  program
    .command('share')
    .description('Generate shareable pixel card PNG')
    .action(() => {
      console.log(chalk.yellow('\u26A1 Share feature coming soon!'));
      console.log(chalk.gray('  Will generate vibe-card.png in current directory'));
    });
}
