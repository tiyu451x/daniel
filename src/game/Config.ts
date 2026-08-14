import Phaser from 'phaser';
import { Boot } from './scene/Boot';
import { Preload } from './scene/Preload';
import { CardTable } from './scene/CardTable';
import { Level1 } from './scene/Level1';
import { TicTacToe } from './scene/TicTacToe';
import { PlaceholderLevel } from './scene/PlaceholderLevel';

/**
 * ============================================================
 * Config.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * Central Phaser configuration: canvas size, physics, and — most
 * importantly — the list of every scene the game knows about.
 *
 * ⭐ EVERY NEW SCENE MUST BE ADDED TO THE `scene` ARRAY BELOW. ⭐
 * If you create Level2.ts but forget to import + add it here,
 * calling this.scene.start('Level2') will silently fail.
 *
 * WHAT YOU CAN CUSTOMIZE:
 *   - width/height: the game's base resolution.
 *   - physics.arcade.debug: set to `true` temporarily to see
 *     collision boxes drawn on screen (useful while building
 *     Level1-style scenes).
 * ============================================================
 */
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 576,
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false, // <-- set true to visualize collision boxes
    },
  },
  scene: [Boot, Preload, CardTable, Level1, TicTacToe, PlaceholderLevel],
};
