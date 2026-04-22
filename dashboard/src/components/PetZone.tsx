const SPECIES_EMOJI: Record<string, string> = {
  dragon: '🐉', cat: '🐱', owl: '🦉', octopus: '🐙', wolf: '🐺',
};
const MOOD_MSG: Record<string, string> = {
  happy: 'feeling great!', hungry: 'needs good commits!', sick: 'please help me...',
  sleeping: 'zzz...', excited: 'AMAZING!',
};

export function PetZone({ pet }: { pet: any }) {
  if (!pet) return null;
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 8 }} className="pixel-float">
        {SPECIES_EMOJI[pet.species] || '🐾'}
      </div>
      <div style={{ fontSize: 12, color: '#ff6b6b' }}>{pet.name}</div>
      <div style={{ fontSize: 8, color: '#888', marginTop: 4 }}>
        {pet.species} · Stage {pet.stage}/4
        {pet.evo_variant && ` · ${pet.evo_variant}`}
      </div>
      <div style={{ fontSize: 8, marginTop: 8 }}>
        <span style={{ color: pet.mood === 'happy' ? '#00ff88' : pet.mood === 'sick' ? '#ff4444' : '#fbbf24' }}>
          ♥ {pet.mood.toUpperCase()}
        </span>
        {' · '}
        <span className="pixel-blink" style={{ color: '#888' }}>{MOOD_MSG[pet.mood] || ''}</span>
      </div>
    </div>
  );
}
