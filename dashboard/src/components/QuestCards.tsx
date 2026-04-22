const QUESTS = [
  { id: 'plan-first', title: '🧠 Plan Before Code', desc: 'Plan/spec file alongside impl', reward: '🪙50 ⭐20' },
  { id: 'test-first', title: '🧪 Test-First Commit', desc: 'High test ratio (>0.4)', reward: '🪙80 ⭐30' },
  { id: 'verified', title: '🔍 Verified Commit', desc: 'Evidence in commit message', reward: '🪙60 ⭐25' },
  { id: 'streak-keeper', title: '🔥 Streak Keeper', desc: 'Score > 70 today', reward: '🪙30 🔥+1' },
];

export function QuestCards({ commits }: { commits: any[] }) {
  // Determine quest completion from today's commits
  const today = new Date().toISOString().split('T')[0];
  const todayCommits = commits.filter(c => {
    const d = new Date(c.timestamp * 1000).toISOString().split('T')[0];
    return d === today;
  });

  const completed: Record<string, boolean> = {
    'plan-first': todayCommits.some(c => c.has_plans && !c.has_tests),
    'test-first': todayCommits.some(c => c.test_score >= 85),
    'verified': todayCommits.some(c => c.verify_score >= 65),
    'streak-keeper': todayCommits.some(c => c.overall_score > 70),
  };

  return (
    <>
      <div className="section-title" style={{ padding: '0 4px' }}>📜 DAILY QUESTS</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {QUESTS.map(q => (
          <div key={q.id} className="card" style={{ borderColor: completed[q.id] ? '#00cc66' : '#333' }}>
            <div style={{ float: 'right' }}>{completed[q.id] ? '✅' : '⬜'}</div>
            <div style={{ fontSize: 8, color: '#fff', marginBottom: 6 }}>{q.title}</div>
            <div style={{ fontSize: 7, color: '#888', marginBottom: 6 }}>{q.desc}</div>
            <div style={{ fontSize: 7, color: '#ffcc00' }}>{q.reward}</div>
            <div style={{ height: 8, background: '#111', border: '1px solid #333', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: completed[q.id] ? '100%' : '0%', background: '#00cc66' }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
