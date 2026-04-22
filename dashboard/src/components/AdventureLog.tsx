export function AdventureLog({ commits }: { commits: any[] }) {
  return (
    <div className="card">
      <div className="section-title">📋 ADVENTURE LOG</div>
      {commits.slice(0, 8).map((c: any) => {
        const score = c.overall_score;
        const isGood = score >= 70;
        const time = new Date(c.timestamp * 1000).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
        return (
          <div key={c.hash} style={{
            display: 'flex', alignItems: 'center', padding: '8px 0',
            borderBottom: '1px dashed #222', gap: 8, fontSize: 8,
          }}>
            <span style={{ color: '#555', width: 45, flexShrink: 0 }}>{time}</span>
            <span style={{ width: 16 }}>{isGood ? '⚔️' : '💔'}</span>
            <span style={{ flex: 1, color: '#ccc' }}>{c.message?.slice(0, 45) || 'commit'}</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {c.has_plans && <span className="badge plan">📝</span>}
              {c.has_tests && <span className="badge test">🧪</span>}
              {score >= 65 && <span className="badge verify">✅</span>}
            </div>
            <span style={{ color: isGood ? '#00ff88' : '#ff4444', width: 50, textAlign: 'right' }}>
              {isGood ? `+${score} XP` : `-${Math.abs(score - 70)} HP`}
            </span>
          </div>
        );
      })}
      {commits.length === 0 && (
        <div style={{ textAlign: 'center', color: '#555', padding: 20 }}>
          No commits yet. Start coding!
        </div>
      )}
    </div>
  );
}
