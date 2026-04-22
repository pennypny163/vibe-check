const STAGES = [
  { emoji: '🥚', label: 'EGG', level: 1 },
  { emoji: '🐲', label: 'BABY', level: 3 },
  { emoji: '🐉', label: 'ADULT', level: 8 },
  { emoji: '⚡', label: 'ULTIMATE', level: 15 },
];

export function EvolutionPath({ pet }: { pet: any }) {
  if (!pet) return null;
  return (
    <div className="card">
      <div className="section-title">🧬 EVOLUTION PATH</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        {STAGES.map((s, i) => {
          const isCurrent = pet.stage === i + 1;
          const isLocked = pet.stage < i + 1;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {i > 0 && <span style={{ color: '#555', fontSize: 14 }}>→</span>}
              <div style={{
                textAlign: 'center', padding: 8, border: `2px solid ${isCurrent ? '#ffcc00' : '#333'}`,
                borderRadius: 4, background: isCurrent ? '#2a2a1e' : '#111',
                opacity: isLocked ? 0.4 : 1, minWidth: 70,
              }}>
                <div style={{ fontSize: 24 }}>{s.emoji}</div>
                <div style={{ fontSize: 7, color: '#888' }}>{s.label}</div>
                <div style={{ fontSize: 6, color: isCurrent ? '#ffcc00' : isLocked ? '#ff8800' : '#00cc66' }}>
                  {isCurrent ? 'NOW' : isLocked ? `LV.${s.level}+` : '✓ DONE'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
