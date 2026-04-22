import { getDb } from './db.js';
import type { PetState, Species } from '../types.js';

export function createPet(species: Species, name: string): void {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO pet (id, species, name)
    VALUES ('main', ?, ?)
  `).run(species, name);
}

export function getPet(): PetState | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM pet WHERE id = ?').get('main') as any;
  if (!row) return null;
  return row as PetState;
}

export function savePet(pet: PetState): void {
  const db = getDb();
  db.prepare(`
    UPDATE pet SET
      species = ?, name = ?, stage = ?, evo_variant = ?,
      hp = ?, xp = ?, level = ?, coins = ?,
      streak = ?, longest_streak = ?, last_commit_date = ?,
      mood = ?
    WHERE id = 'main'
  `).run(
    pet.species, pet.name, pet.stage, pet.evo_variant,
    pet.hp, pet.xp, pet.level, pet.coins,
    pet.streak, pet.longest_streak, pet.last_commit_date,
    pet.mood,
  );
}
