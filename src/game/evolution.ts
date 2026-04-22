import type { PetState, Species } from '../types.js';

interface EvoVariant {
  variant: string;
  emoji: string;
  condition: (pet: PetState, s: { think: number[]; test: number[]; verify: number[] }) => boolean;
}

const EVO_TABLE: Record<Species, EvoVariant[]> = {
  dragon: [
    { variant: 'fire', emoji: '🔥', condition: (_, s) => last7AllAbove(s.test, 80) },
    { variant: 'ice', emoji: '❄️', condition: (_, s) => last7AllAbove(s.think, 90) },
    { variant: 'storm', emoji: '⚡', condition: (_, s) => last14AllAbove(s, 80) },
  ],
  cat: [
    { variant: 'lion', emoji: '🦁', condition: (_, s) => last7AllAbove(s.test, 80) },
    { variant: 'shadow', emoji: '🐆', condition: (p) => p.streak >= 14 },
  ],
  owl: [
    { variant: 'phoenix', emoji: '🦅', condition: (_, s) => last5OverallAbove(s, 90) },
    { variant: 'moon', emoji: '🌙', condition: (_, s) => last7AllAbove(s.verify, 90) },
  ],
  octopus: [
    { variant: 'kraken', emoji: '🦑', condition: () => false },
    { variant: 'tide', emoji: '🌊', condition: (_, s) => last7OverallAbove(s, 80) },
  ],
  wolf: [
    { variant: 'alpha', emoji: '🐺', condition: (p) => p.streak >= 30 },
    { variant: 'night', emoji: '🌑', condition: (_, s) => last7AllAbove(s.verify, 70) },
  ],
};

export function checkEvolution(
  pet: PetState,
  recentScores: { think: number[]; test: number[]; verify: number[] }
): string | null {
  if (pet.level < 15) return null;
  if (pet.stage >= 4 && pet.evo_variant) return pet.evo_variant;

  const variants = EVO_TABLE[pet.species] || [];
  for (const v of variants) {
    if (v.condition(pet, recentScores)) return v.variant;
  }
  return null;
}

export function getEvoTable(species: Species) {
  return EVO_TABLE[species] || [];
}

function last7AllAbove(arr: number[], threshold: number): boolean {
  if (arr.length < 7) return false;
  return arr.slice(-7).every(v => v >= threshold);
}

function last14AllAbove(
  s: { think: number[]; test: number[]; verify: number[] },
  threshold: number
): boolean {
  return [s.think, s.test, s.verify].every(arr =>
    arr.length >= 14 && arr.slice(-14).every(v => v >= threshold)
  );
}

function last5OverallAbove(
  s: { think: number[]; test: number[]; verify: number[] },
  threshold: number
): boolean {
  const overall = s.think.map((t, i) =>
    Math.round(t * 0.35 + (s.test[i] || 0) * 0.35 + (s.verify[i] || 0) * 0.30)
  );
  if (overall.length < 5) return false;
  return overall.slice(-5).every(v => v >= threshold);
}

function last7OverallAbove(
  s: { think: number[]; test: number[]; verify: number[] },
  threshold: number
): boolean {
  const overall = s.think.map((t, i) =>
    Math.round(t * 0.35 + (s.test[i] || 0) * 0.35 + (s.verify[i] || 0) * 0.30)
  );
  if (overall.length < 7) return false;
  return overall.slice(-7).every(v => v >= threshold);
}
