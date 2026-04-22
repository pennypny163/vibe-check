import type { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { initDb } from '../../storage/db.js';
import { getPet } from '../../storage/pet-store.js';

export function registerBadge(program: Command): void {
  program
    .command('badge')
    .description('Generate README SVG badge')
    .action(() => {
      const dbPath = path.join(process.cwd(), '.vibe-check', 'db.sqlite');
      initDb(dbPath);
      const pet = getPet();
      if (!pet) { console.log(chalk.red('No pet found. Run vibe-check init first.')); return; }

      const SPECIES_EMOJI: Record<string, string> = {
        dragon: '\uD83D\uDC09', cat: '\uD83D\uDC31', owl: '\uD83E\uDD89', octopus: '\uD83D\uDC19', wolf: '\uD83D\uDC3A',
      };

      const emoji = SPECIES_EMOJI[pet.species] || '\uD83D\uDC3E';
      const label = `\u26A1 vibe-check`;
      const value = `${emoji} LV.${pet.level} \u00B7 ${pet.species}`;

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="20">
  <rect width="100" height="20" fill="#333" rx="3"/>
  <rect x="100" width="160" height="20" fill="#e04040" rx="3"/>
  <rect x="100" width="4" height="20" fill="#e04040"/>
  <text x="50" y="14" fill="#fff" text-anchor="middle" font-family="monospace" font-size="11">${label}</text>
  <text x="180" y="14" fill="#fff" text-anchor="middle" font-family="monospace" font-size="11">${value}</text>
</svg>`;

      const outPath = path.join(process.cwd(), 'vibe-badge.svg');
      fs.writeFileSync(outPath, svg);
      console.log(chalk.green(`\u2705 Badge saved to ${outPath}`));
      console.log(chalk.gray('  Add to README: ![vibe-check](./vibe-badge.svg)'));
    });
}
