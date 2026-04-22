import type { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { installHook, ensureVibeCheckDir } from '../../analyzer/hooks.js';
import { getRecentCommitHistory } from '../../analyzer/git.js';
import { assignSpecies } from '../../game/species.js';
import { initDb } from '../../storage/db.js';
import { createPet, getPet } from '../../storage/pet-store.js';

const SPECIES_EMOJI: Record<string, string> = {
  dragon: '\uD83D\uDC09', cat: '\uD83D\uDC31', owl: '\uD83E\uDD89', octopus: '\uD83D\uDC19', wolf: '\uD83D\uDC3A',
};

export function registerInit(program: Command): void {
  program
    .command('init')
    .description('Initialize vibe-check in current repo')
    .action(async () => {
      const repoPath = process.cwd();
      console.log(chalk.yellow('\u26A1 Initializing vibe-check...'));

      const vibeDir = ensureVibeCheckDir(repoPath);
      console.log(chalk.gray('  \u2713 Created .vibe-check/ directory'));

      const dbPath = path.join(vibeDir, 'db.sqlite');
      initDb(dbPath);
      console.log(chalk.gray('  \u2713 Database initialized'));

      const existingPet = getPet();
      if (existingPet) {
        console.log(chalk.green(`  \u2713 Welcome back! ${existingPet.name} the ${existingPet.species} is waiting.`));
        installHook(repoPath);
        console.log(chalk.gray('  \u2713 Git hook verified'));
        return;
      }

      console.log(chalk.gray('  \u23F3 Analyzing your coding style (last 30 commits)...'));
      const history = await getRecentCommitHistory(repoPath, 30);

      let species: { species: string; name: string };
      if (history.length >= 3) {
        species = assignSpecies(history);
      } else {
        species = { species: 'octopus', name: 'GLITCH' };
        console.log(chalk.gray('  \u2139 Not enough history, assigning starter pet'));
      }

      createPet(species.species as any, species.name);
      console.log('');
      console.log(chalk.yellow('  \uD83E\uDD5A Your egg is hatching...'));
      console.log('');
      console.log(chalk.bold(`  ${SPECIES_EMOJI[species.species] || '\uD83D\uDC3E'} It's a ${species.species}! Meet ${chalk.yellow(species.name)}.`));
      console.log('');

      installHook(repoPath);
      console.log(chalk.gray('  \u2713 Git hook installed'));
      console.log('');
      console.log(chalk.green('  \u2705 vibe-check is ready!'));
      console.log(chalk.gray('  Just code normally. Your pet will grow with each commit.'));
      console.log(chalk.gray(`  Run ${chalk.white('vibe-check dashboard')} to see your pet!`));
    });
}
