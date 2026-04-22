import { useState, useEffect } from 'react';
import './styles/pixel-theme.css';
import { useWebSocket } from './hooks/useWebSocket';
import { Header } from './components/Header';
import { PetZone } from './components/PetZone';
import { StatBars } from './components/StatBars';
import { EvolutionPath } from './components/EvolutionPath';
import { QuestCards } from './components/QuestCards';
import { Achievements } from './components/Achievements';
import { AdventureLog } from './components/AdventureLog';
import { ShareZone } from './components/ShareZone';

function App() {
  const [pet, setPet] = useState<any>(null);
  const [commits, setCommits] = useState<any[]>([]);
  const [recentScores, setRecentScores] = useState<any>(null);
  const { lastMessage, connected } = useWebSocket(`ws://${window.location.hostname}:${window.location.port || 3742}`);

  useEffect(() => {
    // Fetch initial data
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => {
        setPet(data.pet);
        setRecentScores({
          avgThink: 0,
          avgTest: 0,
          avgVerify: 0,
        });
      })
      .catch(() => {});

    fetch('/api/commits?limit=20')
      .then(r => r.json())
      .then(data => {
        setCommits(data.commits || []);
        if (data.commits?.length > 0) {
          const c = data.commits;
          setRecentScores({
            avgThink: Math.round(c.reduce((s: number, x: any) => s + x.think_score, 0) / c.length),
            avgTest: Math.round(c.reduce((s: number, x: any) => s + x.test_score, 0) / c.length),
            avgVerify: Math.round(c.reduce((s: number, x: any) => s + x.verify_score, 0) / c.length),
          });
        }
      })
      .catch(() => {});
  }, []);

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage?.type === 'commit') {
      setPet(lastMessage.data.pet);
      setCommits(prev => [lastMessage.data.commit, ...prev].slice(0, 20));
    }
  }, [lastMessage]);

  return (
    <div className="container">
      <Header pet={pet} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <PetZone pet={pet} />
        <StatBars pet={pet} recentScores={recentScores} />
      </div>

      <EvolutionPath pet={pet} />
      <QuestCards commits={commits} />
      <Achievements pet={pet} />
      <AdventureLog commits={commits} />
      <ShareZone pet={pet} />

      <div style={{ textAlign: 'center', padding: 16, color: '#333', fontSize: 7 }}>
        ⚡ VIBE-CHECK v0.1.0 · {connected ? '🟢 LIVE' : '🔴 OFFLINE'} · PRESS START TO PLAY
      </div>
    </div>
  );
}

export default App;
