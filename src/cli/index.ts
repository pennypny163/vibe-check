#!/usr/bin/env node
import { Command } from 'commander';
import { registerInit } from './commands/init.js';
import { registerIngest } from './commands/ingest.js';
import { registerDashboard } from './commands/dashboard.js';
import { registerReport } from './commands/report.js';
import { registerScore } from './commands/score.js';
import { registerPet } from './commands/pet.js';
import { registerHistory } from './commands/history.js';
import { registerShare } from './commands/share.js';
import { registerBadge } from './commands/badge.js';
import { registerUninstall } from './commands/uninstall.js';

const program = new Command();

program
  .name('vibe-check')
  .description('Your code habits raise a pixel pet \uD83D\uDC09')
  .version('0.1.0');

registerInit(program);
registerIngest(program);
registerDashboard(program);
registerReport(program);
registerScore(program);
registerPet(program);
registerHistory(program);
registerShare(program);
registerBadge(program);
registerUninstall(program);

program.parse();
