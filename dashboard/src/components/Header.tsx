const SPECIES_EMOJI: Record<string, string> = {
  dragon: '🐉', cat: '🐱', owl: '🦉', octopus: '🐙', wolf: '🐺',
};

export function Header({ pet }: { pet: any }) {
  if (!pet) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', marginBottom: 16, borderBottom: '2px dashed #333' }}>
      <div>
        <div style={{ fontSize: 14, color: '#ffcc00', textShadow: '2px 2px #996600' }}>⚡ VIBE-CHECK</div>
        <div style={{ fontSize: 8, color: '#666', marginTop: 4 }}>AI Coding Companion · Pixel Pet Edition</div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 9 }}>
        <div style={{ color: '#ffcc00' }}>🪙 {pet.coins} COINS</div>
        <div style={{ color: '#00ff88' }}>⭐ LV.{pet.level} {pet.species.toUpperCase()}</div>
        <div style={{ color: '#666' }}>STREAK 🔥{pet.streak}</div>
      </div>
    </div>
  );
}
