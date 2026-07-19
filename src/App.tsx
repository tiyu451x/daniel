import { useEffect, useRef, useState } from 'react';
import { StartGame } from './game/Game';
import { EventBus } from './game/manager/Eventbus';
import './App.css';

export default function App() {
  const gameRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(5);

  useEffect(() => {
    if (!gameRef.current) return;

    const game = StartGame('game-container');
    const updateScore = (newScore: number) => setScore(newScore);
    const updateHp = (newHp: number) => setHp(newHp);

    EventBus.on('score-changed', updateScore);
    EventBus.on('player-health', updateHp);

    return () => {
      EventBus.off('score-changed', updateScore);
      EventBus.off('player-health', updateHp);
      game.destroy(true);
    };
  }, []);

  return (
    <div className="app-wrapper">
      <div className="ui-overlay">
        <div className="stat">HP: {'|'.repeat(Math.max(0, hp))}</div>
        <div className="stat">SCORE: {score}</div>
      </div>
      <div id="game-container" ref={gameRef} />
    </div>
  );
}
