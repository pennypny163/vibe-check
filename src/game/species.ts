import type { CommitData, Species } from '../types.js';
import { scoreThoughtfulness } from '../analyzer/scorers/thoughtfulness.js';
import { scoreTestDiscipline } from '../analyzer/scorers/test-discipline.js';
import { avg, randomPick } from '../utils.js';

const NAME_POOLS: Record<Species, string[]> = {
  dragon:  ['PYXEL', 'BLAZE', 'EMBER', 'FANG', 'DRACO', 'IGNIS', 'SCORCH', 'RUNE'],
  cat:     ['WHISKER', 'DASH', 'NEKO', 'SPRINT', 'PIXEL', 'MOCHI', 'TURBO', 'FLICK'],
  owl:     ['SAGE', 'HOOT', 'LUNA', 'ORACLE', 'ATHENA', 'NOCTIS', 'PLATO', 'ASTRA'],
  octopus: ['INKY', 'TENTAI', 'OCTO', 'KRAKEN', 'GLITCH', 'VORTEX', 'FLUX', 'BLOB'],
  wolf:    ['TRACKER', 'FANG', 'SCOUT', 'HUNTER', 'DEBUG', 'SHADOW', 'PROWL', 'BYTE'],
};

export function assignSpecies(history: CommitData[]): { species: Species; name: string } {
  const avgThink = avg(history.map(scoreThoughtfulness));
  const avgTest = avg(history.map(scoreTestDiscipline));
  const avgSize = avg(history.map(c => c.lines_added));
  const fixRatio = history.filter(c => /^fix/i.test(c.message)).length / history.length;

  if (avgThink > 70 && avgSize < 150) return { species: 'dragon', name: generateName('dragon') };
  if (avgTest > 70) return { species: 'owl', name: generateName('owl') };
  if (avgSize < 50 && avgTest < 50) return { species: 'cat', name: generateName('cat') };
  if (fixRatio > 0.4) return { species: 'wolf', name: generateName('wolf') };
  return { species: 'octopus', name: generateName('octopus') };
}

export function generateName(species: Species): string {
  return randomPick(NAME_POOLS[species]);
}
