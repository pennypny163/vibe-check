import { describe, it, expect } from 'vitest';
import { applyCommitToPet, updateStreak, computeMood } from '../../src/game/pet.js';
import type { PetState } from '../../src/types.js';

function makePet(overrides: Partial<PetState> = {}): PetState {
  return {
    id: 'main', species: 'dragon', name: 'PYXEL', stage: 2,
    evo_variant: null, hp: 80, xp: 0, level: 5, coins: 0,
    streak: 3, longest_streak: 5, last_commit_date: '2026-04-21',
    mood: 'happy', created_at: '2026-04-01', ...overrides,
  };
}

describe('applyCommitToPet', () => {
  it('adds XP and HP for high score', () => {
    const pet = applyCommitToPet(makePet(), 92);
    expect(pet.xp).toBeGreaterThan(0);
    expect(pet.hp).toBeGreaterThanOrEqual(80);
  });
  it('reduces HP for low score', () => {
    const pet = applyCommitToPet(makePet(), 30);
    expect(pet.hp).toBeLessThan(80);
  });
  it('levels up when XP exceeds threshold', () => {
    const pet = applyCommitToPet(makePet({ xp: 780 }), 95);
    expect(pet.level).toBe(6);
  });
  it('evolves stage on level threshold', () => {
    const pet = applyCommitToPet(makePet({ level: 2, xp: 390, stage: 1 }), 95);
    expect(pet.stage).toBeGreaterThanOrEqual(2);
  });
});

describe('updateStreak', () => {
  it('increments streak on consecutive days', () => {
    const pet = updateStreak(makePet({ last_commit_date: '2026-04-21' }), '2026-04-22', true);
    expect(pet.streak).toBe(4);
  });
  it('resets streak on gap', () => {
    const pet = updateStreak(makePet({ last_commit_date: '2026-04-19' }), '2026-04-22', true);
    expect(pet.streak).toBe(1);
  });
  it('does not change if no good commit', () => {
    const pet = updateStreak(makePet(), '2026-04-22', false);
    expect(pet.streak).toBe(3);
  });
  it('updates longest_streak', () => {
    const pet = updateStreak(makePet({ streak: 5, longest_streak: 5, last_commit_date: '2026-04-21' }), '2026-04-22', true);
    expect(pet.longest_streak).toBe(6);
  });
});

describe('computeMood', () => {
  it('returns sick when HP < 30', () => {
    expect(computeMood(makePet({ hp: 20 }))).toBe('sick');
  });
  it('returns hungry when HP < 60', () => {
    expect(computeMood(makePet({ hp: 50 }))).toBe('hungry');
  });
  it('returns happy when HP >= 60', () => {
    expect(computeMood(makePet({ hp: 80 }))).toBe('happy');
  });
});
