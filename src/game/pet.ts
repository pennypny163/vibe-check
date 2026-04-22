import type { PetState, Mood, Stage } from '../types.js';
import { getGrade, xpForLevel } from './xp.js';
import { clamp } from '../utils.js';

const MAX_HP = 100;

export function applyCommitToPet(pet: PetState, overallScore: number): PetState {
  const grade = getGrade(overallScore);

  pet.xp += grade.xp;
  pet.hp = clamp(pet.hp + grade.hp, 0, MAX_HP);

  while (pet.xp >= xpForLevel(pet.level)) {
    pet.xp -= xpForLevel(pet.level);
    pet.level += 1;
  }

  pet.mood = computeMood(pet);

  if (pet.level >= 15 && pet.stage < 4) pet.stage = 3 as Stage;
  else if (pet.level >= 8 && pet.stage < 3) pet.stage = 3 as Stage;
  else if (pet.level >= 3 && pet.stage < 2) pet.stage = 2 as Stage;

  return pet;
}

export function computeMood(pet: PetState): Mood {
  if (pet.hp < 30) return 'sick';
  if (pet.hp < 60) return 'hungry';
  return 'happy';
}

export function updateStreak(pet: PetState, today: string, hadGoodCommit: boolean): PetState {
  if (!hadGoodCommit) return pet;
  if (pet.last_commit_date === today) return pet;

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (pet.last_commit_date === yesterdayStr) {
    pet.streak += 1;
  } else {
    pet.streak = 1;
  }

  pet.last_commit_date = today;
  if (pet.streak > pet.longest_streak) pet.longest_streak = pet.streak;

  return pet;
}
