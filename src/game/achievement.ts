import type { AchievementDef, AchievementContext, AchievementState } from '../types.js';

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-hatch', name: 'First Hatch', icon: '🌱',
    description: 'Your pet hatched from its egg',
    check: (ctx) => ({ unlocked: ctx.pet.stage >= 2, progress: ctx.pet.stage >= 2 ? 1 : 0 }),
  },
  {
    id: 'streak-7', name: 'Week Warrior', icon: '🔥',
    description: '7-day commit streak',
    check: (ctx) => ({ unlocked: ctx.pet.streak >= 7, progress: Math.min(ctx.pet.streak, 7) }),
  },
  {
    id: 'streak-30', name: 'Monthly Master', icon: '💎',
    description: '30-day commit streak',
    check: (ctx) => ({ unlocked: ctx.pet.longest_streak >= 30, progress: Math.min(ctx.pet.longest_streak, 30) }),
  },
  {
    id: 'tdd-novice', name: 'TDD Novice', icon: '🧪',
    description: '10 commits with test score > 80',
    check: (ctx) => ({ unlocked: ctx.highTestScoreCommits >= 10, progress: Math.min(ctx.highTestScoreCommits, 10) }),
  },
  {
    id: 'tdd-master', name: 'TDD Master', icon: '🏅',
    description: '50 commits with test score > 80',
    check: (ctx) => ({ unlocked: ctx.highTestScoreCommits >= 50, progress: Math.min(ctx.highTestScoreCommits, 50) }),
  },
  {
    id: 'planner', name: 'Planner', icon: '📝',
    description: '10 commits with think score > 80',
    check: (ctx) => ({ unlocked: ctx.highThinkScoreCommits >= 10, progress: Math.min(ctx.highThinkScoreCommits, 10) }),
  },
  {
    id: 'commits-100', name: 'Centurion', icon: '⚡',
    description: '100 total commits tracked',
    check: (ctx) => ({ unlocked: ctx.totalCommits >= 100, progress: Math.min(ctx.totalCommits, 100) }),
  },
  {
    id: 'grade-a-plus', name: 'Perfectionist', icon: '👑',
    description: 'Achieve an A+ overall grade on any commit',
    check: () => ({ unlocked: false, progress: 0 }),
  },
  {
    id: 'evolution', name: 'Evolved', icon: '🐉',
    description: 'Reach ultimate evolution',
    check: (ctx) => ({ unlocked: ctx.pet.stage >= 4, progress: ctx.pet.stage >= 4 ? 1 : 0 }),
  },
  {
    id: 'all-quests', name: 'Completionist', icon: '🌟',
    description: 'Complete all 4 daily quests in one day',
    check: (ctx) => ({ unlocked: ctx.allQuestsCompletedToday, progress: ctx.allQuestsCompletedToday ? 1 : 0 }),
  },
];

export function checkAchievements(
  ctx: AchievementContext,
  current: AchievementState[]
): AchievementState[] {
  return ACHIEVEMENTS.map(def => {
    const existing = current.find(a => a.id === def.id);
    if (existing?.unlocked_at) return existing;

    const result = def.check(ctx);
    if (result.unlocked) {
      return { id: def.id, unlocked_at: new Date().toISOString(), progress: result.progress };
    }
    return { id: def.id, unlocked_at: null, progress: result.progress };
  });
}
