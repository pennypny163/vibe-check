import type { Grade } from '../types.js';

const GRADE_TABLE: Grade[] = [
  { grade: 'A+', title: 'Engineering Excellence', xp: 20, hp: 5 },
  { grade: 'A',  title: 'Disciplined Collaborator', xp: 15, hp: 3 },
  { grade: 'B',  title: 'Conscious Coder', xp: 10, hp: 0 },
  { grade: 'C',  title: 'Convenience-Driven', xp: 5, hp: -5 },
  { grade: 'D',  title: 'Vibe Coder', xp: 2, hp: -15 },
];

const GRADE_THRESHOLDS = [90, 80, 65, 50, 0];

export function getGrade(overallScore: number): Grade {
  for (let i = 0; i < GRADE_THRESHOLDS.length; i++) {
    if (overallScore >= GRADE_THRESHOLDS[i]) return GRADE_TABLE[i];
  }
  return GRADE_TABLE[GRADE_TABLE.length - 1];
}

export function xpForLevel(level: number): number {
  return 200 + level * 100;
}

export function computeOverallScore(think: number, test: number, verify: number): number {
  return Math.round(think * 0.35 + test * 0.35 + verify * 0.30);
}
