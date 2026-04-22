export function ShareZone({ pet }: { pet: any }) {
  if (!pet) return null;
  const SPECIES_EMOJI: Record<string, string> = {
    dragon: '🐉', cat: '🐱', owl: '🦉', octopus: '🐙', wolf: '🐺',
  };

  return (
    <div className="card">
      <div className="section-title">📤 SHARE YOUR PET</div>
      <div style={{
        background: 'linear-gradient(135deg, #1a0a2e, #0a1a2e)',
        border: '3px solid #ffcc00', borderRadius: 8, padding: 16,
        maxWidth: 360, margin: '12px auto', textAlign: 'center',
      }}>
        <div style={{ fontSize: 8, color: '#ffcc00' }}>@you · vibe-check</div>
        <div style={{ fontSize: 48, margin: '8px 0' }}>{SPECIES_EMOJI[pet.species]}</div>
        <div style={{ fontSize: 12, color: '#ff6b6b' }}>{pet.name} · LV.{pet.level}</div>
        <div style={{ fontSize: 8, color: '#888', marginTop: 4 }}>{pet.species} · Stage {pet.stage}/4</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12 }}>
          <div><div style={{ fontSize: 12, color: '#fff' }}>{pet.hp}</div><div style={{ fontSize: 6, color: '#666' }}>HP</div></div>
          <div><div style={{ fontSize: 12, color: '#ffcc00' }}>🔥{pet.streak}</div><div style={{ fontSize: 6, color: '#666' }}>STREAK</div></div>
          <div><div style={{ fontSize: 12, color: '#00ff88' }}>LV.{pet.level}</div><div style={{ fontSize: 6, color: '#666' }}>LEVEL</div></div>
        </div>
        <div style={{ fontSize: 6, color: '#444', marginTop: 12 }}>⚡ vibe-check · npx vibe-check init</div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
        <button style={{ background: '#2d2d5e', border: '2px solid #5555ff', color: '#aaf', padding: '6px 12px', borderRadius: 4, fontFamily: 'inherit', fontSize: 8, cursor: 'pointer' }}>
          📋 COPY
        </button>
        <button style={{ background: '#2d2d5e', border: '2px solid #5555ff', color: '#aaf', padding: '6px 12px', borderRadius: 4, fontFamily: 'inherit', fontSize: 8, cursor: 'pointer' }}>
          🐦 TWITTER
        </button>
      </div>
      <div style={{ background: '#0d1117', border: '2px solid #333', borderRadius: 8, padding: 12, marginTop: 12 }}>
        <div style={{ fontSize: 7, color: '#555', marginBottom: 6 }}>📌 GITHUB README BADGE:</div>
        <code style={{ fontSize: 7, color: '#888', wordBreak: 'break-all' }}>
          ![vibe-check](./vibe-badge.svg)
        </code>
      </div>
    </div>
  );
}
