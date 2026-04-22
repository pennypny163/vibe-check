const BADGE_DEFS = [
  { id: 'first-hatch', icon: '🌱', name: 'FIRST HATCH' },
  { id: 'streak-7', icon: '🔥', name: '7-DAY STREAK' },
  { id: 'tdd-novice', icon: '🧪', name: 'TDD NOVICE' },
  { id: 'planner', icon: '📝', name: 'PLANNER' },
  { id: 'commits-100', icon: '⚡', name: '100 COMMITS' },
  { id: 'grade-a-plus', icon: '👑', name: 'A+ GRADE' },
  { id: 'evolution', icon: '🐉', name: 'EVOLUTION' },
  { id: 'streak-30', icon: '💎', name: '30-DAY STREAK' },
  { id: 'tdd-master', icon: '🏅', name: 'TDD MASTER' },
  { id: 'all-quests', icon: '🌟', name: 'COMPLETIONIST' },
];

export function Achievements({ pet }: { pet: any }) {
  // Simple check: which achievements would be unlocked
  const unlocked = new Set<string>();
  if (pet) {
    if (pet.stage >= 2) unlocked.add('first-hatch');
    if (pet.streak >= 7) unlocked.add('streak-7');
    if (pet.streak >= 30) unlocked.add('streak-30');
    if (pet.stage >= 4) unlocked.add('evolution');
  }

  return (
    <div className="card">
      <div className="section-title">🏆 ACHIEVEMENTS</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {BADGE_DEFS.map(b => {
          const isUnlocked = unlocked.has(b.id);
          return (
            <div key={b.id} style={{
              width: 60, height: 60, border: `2px solid ${isUnlocked ? '#ffcc00' : '#333'}`,
              borderRadius: 4, background: isUnlocked ? '#2a2a1e' : '#111',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 2, opacity: isUnlocked ? 1 : 0.3, filter: isUnlocked ? 'none' : 'grayscale(1)',
            }}>
              <div style={{ fontSize: 20 }}>{b.icon}</div>
              <div style={{ fontSize: 5, color: '#888', textAlign: 'center' }}>{b.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
