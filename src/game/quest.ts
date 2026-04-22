import type { QuestState, CommitResult } from '../types.js';
import { classifyFile } from '../analyzer/classifier.js';

export const QUEST_DEFS = [
  {
    quest_id: 'plan-first',
    title: '🧠 Plan Before Code',
    description: 'Create or update a plan/spec file alongside implementation code',
    reward_coins: 50,
    reward_xp: 20,
    check: (commit: CommitResult) => {
      const types = commit.files.map(f => classifyFile(f.path));
      return types.includes('plan') && types.includes('impl');
    },
  },
  {
    quest_id: 'test-first',
    title: '🧪 Test-First Commit',
    description: 'Make a commit where test files have a high ratio (>0.4)',
    reward_coins: 80,
    reward_xp: 30,
    check: (commit: CommitResult) => commit.test_score >= 85,
  },
  {
    quest_id: 'verified',
    title: '🔍 Verified Commit',
    description: 'Include verification evidence in your commit message',
    reward_coins: 60,
    reward_xp: 25,
    check: (commit: CommitResult) => commit.verify_score >= 65,
  },
  {
    quest_id: 'streak-keeper',
    title: '🔥 Streak Keeper',
    description: 'Make at least 1 commit with score > 70 today',
    reward_coins: 30,
    reward_xp: 0,
    check: (commit: CommitResult) => commit.overall_score > 70,
  },
];

export function checkQuests(commit: CommitResult, currentQuests: QuestState[]): QuestState[] {
  return currentQuests.map(q => {
    if (q.completed) return q;
    const def = QUEST_DEFS.find(d => d.quest_id === q.quest_id);
    if (!def) return q;
    if (def.check(commit)) {
      return { ...q, completed: true, progress: 1 };
    }
    return q;
  });
}

export function initDailyQuests(): QuestState[] {
  return QUEST_DEFS.map(d => ({
    quest_id: d.quest_id,
    title: d.title,
    description: d.description,
    completed: false,
    progress: 0,
    reward_coins: d.reward_coins,
    reward_xp: d.reward_xp,
  }));
}
