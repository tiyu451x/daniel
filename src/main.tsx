// import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Phaser from 'phaser';
import { StartGame } from './game/Game';
import './index.css';

/**
 * main.tsx
 *
 * React entry point. Mounts a <div id="game-container"> and boots
 * Phaser into it on mount, cleaning up on unmount.
 *
 * NOTE: If your project already has its own App.tsx with routing
 * (I saw pages/GamePage.tsx, LoginPage.tsx etc. in your file tree),
 * move the <div id="game-container"> + useEffect logic below into
 * GamePage.tsx instead of rendering it directly here, so the game
 * only mounts on that route.
 */
function App() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = StartGame('game-container');
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="game-container" style={{ width: '100%', height: '100vh' }} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
