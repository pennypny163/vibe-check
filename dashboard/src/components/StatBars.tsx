const STATS = [
  { key: 'hp', icon: '❤️', label: 'HP', color: '#ff6666', max: 100 },
  { key: 'think', icon: '🧠', label: 'THINK', color: '#ffaa44', max: 100 },
  { key: 'test', icon: '🧪', label: 'TEST', color: '#6666ff', max: 100 },
  { key: 'verify', icon: '🔍', label: 'VERIFY', color: '#cc88ff', max: 100 },
];

export function StatBars({ pet, recentScores }: { pet: any; recentScores: any }) {
  if (!pet) return null;
  const values: Record<string, number> = {
    hp: pet.hp,
    think: recentScores?.avgThink || 0,
    test: recentScores?.avgTest || 0,
    verify: recentScores?.avgVerify || 0,
  };

  return (
    <div className="card">
      <div className="section-title">📊 STATS</div>
      {STATS.map(s => (
        <div key={s.key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 8 }}>
          <span style={{ width: 20, textAlign: 'center' }}>{s.icon}</span>
          <span style={{ width: 60, fontSize: 8, color: '#888' }}>{s.label}</span>
          <div className="stat-bar-bg">
            <div className="stat-bar-fill" style={{ width: `${values[s.key]}%`, background: s.color }} />
          </div>
          <span style={{ width: 30, textAlign: 'right', fontSize: 8, color: s.color }}>{Math.round(values[s.key])}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 4, gap: 8 }}>
        <span style={{ width: 20, textAlign: 'center' }}>⭐</span>
        <span style={{ width: 60, fontSize: 8, color: '#888' }}>EXP</span>
        <div className="stat-bar-bg">
          <div className="stat-bar-fill" style={{ width: `${Math.min(100, (pet.xp / (200 + pet.level * 100)) * 100)}%`, background: '#00ff88' }} />
        </div>
        <span style={{ width: 30, textAlign: 'right', fontSize: 8, color: '#00ff88' }}>LV{pet.level}</span>
      </div>
    </div>
  );
}
