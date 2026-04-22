import type { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { getLatestCommitData } from '../../analyzer/git.js';
import { scoreThoughtfulness } from '../../analyzer/scorers/thoughtfulness.js';
import { scoreTestDiscipline } from '../../analyzer/scorers/test-discipline.js';
import { scoreVerification } from '../../analyzer/scorers/verification.js';
import { computeOverallScore } from '../../game/xp.js';
import { applyCommitToPet, updateStreak } from '../../game/pet.js';
import { checkEvolution } from '../../game/evolution.js';
import { initDb } from '../../storage/db.js';
import { insertCommit, getRecentCommits } from '../../storage/commits.js';
import { getPet, savePet } from '../../storage/pet-store.js';
import { classifyFile } from '../../analyzer/classifier.js';
import { todayStr } from '../../utils.js';
import type { CommitResult, Stage } from '../../types.js';

export function registerIngest(program: Command): void {
  program
    .command('_ingest')
    .description('(internal) Ingest latest commit data')
    .option('--silent', 'Suppress output')
    .action(async (opts) => {
      try {
        const repoPath = process.cwd();
        const dbPath = path.join(repoPath, '.vibe-check', 'db.sqlite');
        if (!fs.existsSync(dbPath)) return; // not initialized
        initDb(dbPath);

        const commit = await getLatestCommitData(repoPath);

        const thinkScore = scoreThoughtfulness(commit);
        const testScore = scoreTestDiscipline(commit);
        const verifyScore = scoreVerification(commit);
        const overall = computeOverallScore(thinkScore, testScore, verifyScore);

        const result: CommitResult = {
          ...commit,
          think_score: thinkScore,
          test_score: testScore,
          verify_score: verifyScore,
          overall_score: overall,
          xp_earned: 0,
          hp_change: 0,
          has_tests: commit.files.some(f => classifyFile(f.path) === 'test'),
          has_plans: commit.files.some(f => classifyFile(f.path) === 'plan'),
        };

        insertCommit(result);

        const pet = getPet();
        if (pet) {
          const updatedPet = applyCommitToPet(pet, overall);
          const hadGoodCommit = overall > 70;
          const withStreak = updateStreak(updatedPet, todayStr(), hadGoodCommit);

          const recent = getRecentCommits(14);
          const recentScores = {
            think: recent.map(c => c.think_score),
            test: recent.map(c => c.test_score),
            verify: recent.map(c => c.verify_score),
          };
          const evoVariant = checkEvolution(withStreak, recentScores);
          if (evoVariant && !withStreak.evo_variant) {
            withStreak.evo_variant = evoVariant;
            withStreak.stage = 4 as Stage;
          }

          savePet(withStreak);
        }

        if (!opts.silent) {
          console.log(`\u26A1 vibe-check: score ${overall} (think:${thinkScore} test:${testScore} verify:${verifyScore})`);
        }
      } catch (e) {
        if (!opts.silent) console.error('vibe-check ingest error:', e);
      }
    });
}
