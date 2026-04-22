import type { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { initDb } from '../../storage/db.js';
import { getPet } from '../../storage/pet-store.js';

const SPECIES_EMOJI: Record<string, string> = {
  dragon: '\uD83D\uDC09', cat: '\uD83D\uDC31', owl: '\uD83E\uDD89', octopus: '\uD83D\uDC19', wolf: '\uD83D\uDC3A',
};

const MOOD_EMOJI: Record<string, string> = {
  happy: '\u2764\uFE0F', hungry: '\uD83C\uDF54', sick: '\uD83E\uDE7A', sleeping: '\uD83D\uDCA4', excited: '\u2728',
};

export function registerPet(program: Command): void {
  program
    .command('pet')
    .description('Show pet status')
    .action(() => {
      const dbPath = path.join(process.cwd(), '.vibe-check', 'db.sqlite');
      initDb(dbPath);
      const pet = getPet();
      if (!pet) { console.log(chalk.red('No pet found. Run vibe-check init first.')); return; }

      console.log('');
      console.log(`  ${SPECIES_EMOJI[pet.species]} ${chalk.bold.yellow(pet.name)}`);
      console.log(`  Species: ${pet.species} · Stage: ${pet.stage}/4${pet.evo_variant ? ' · ' + pet.evo_variant : ''}`);
      console.log(`  Level: ${chalk.cyan(String(pet.level))} · XP: ${pet.xp}`);
      console.log(`  HP: ${pet.hp}/100 · Mood: ${MOOD_EMOJI[pet.mood] || ''} ${pet.mood}`);
      console.log(`  Streak: \uD83D\uDD25${pet.streak} · Best: ${pet.longest_streak}`);
      console.log(`  Coins: \uD83E\uDE99${pet.coins}`);
      console.log('');
    });
}
