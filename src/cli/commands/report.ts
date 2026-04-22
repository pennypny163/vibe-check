import type { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { initDb } from '../../storage/db.js';
import { getPet } from '../../storage/pet-store.js';
import { getRecentCommits } from '../../storage/commits.js';
import { computeOverallScore } from '../../game/xp.js';

const SPECIES_EMOJI: Record<string, string> = {
  dragon: '\uD83D\uDC09', cat: '\uD83D\uDC31', owl: '\uD83E\uDD89', octopus: '\uD83D\uDC19', wolf: '\uD83D\uDC3A',
};

export function registerReport(program: Command): void {
  program
    .command('report')
    .description('Show terminal report')
    .action(() => {
      const dbPath = path.join(process.cwd(), '.vibe-check', 'db.sqlite');
      initDb(dbPath);

      const pet = getPet();
      if (!pet) { console.log(chalk.red('No pet found. Run vibe-check init first.')); return; }

      const commits = getRecentCommits(20);

      console.log('');
      console.log(chalk.yellow(`\u26A1 VIBE-CHECK REPORT`));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(`  ${SPECIES_EMOJI[pet.species]} ${chalk.bold(pet.name)} · LV.${pet.level} · ${pet.species}`);
      console.log(`  HP: ${colorBar(pet.hp)} ${pet.hp}/100  Mood: ${pet.mood}`);
      console.log(`  Streak: \uD83D\uDD25${pet.streak}  Coins: \uD83E\uDE99${pet.coins}`);
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.gray('  RECENT COMMITS'));

      for (const c of commits.slice(0, 10)) {
        const icon = c.ai_detected ? '\uD83E\uDD16' : '\uD83D\uDC64';
        const scoreColor = c.overall_score >= 80 ? chalk.green : c.overall_score >= 60 ? chalk.yellow : chalk.red;
        console.log(`  ${icon} ${scoreColor(String(c.overall_score).padStart(3))} ${chalk.gray(c.message.slice(0, 50))}`);
      }

      console.log(chalk.gray('─'.repeat(50)));
      if (commits.length > 0) {
        const avg = Math.round(commits.reduce((s, c) => s + c.overall_score, 0) / commits.length);
        console.log(`  Average: ${avg}  Commits: ${commits.length}`);
      }
      console.log('');
    });
}

function colorBar(value: number): string {
  const filled = Math.round(value / 5);
  const empty = 20 - filled;
  const color = value >= 60 ? chalk.green : value >= 30 ? chalk.yellow : chalk.red;
  return color('\u2588'.repeat(filled)) + chalk.gray('\u2591'.repeat(empty));
}
