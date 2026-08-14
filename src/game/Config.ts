import Phaser from 'phaser';
import { Boot } from './scene/Boot';
import { Preload } from './scene/Preload';
import { CardTable } from './scene/CardTable';

/**
 * Config.ts
 *
 * Central Phaser game configuration. Add new scenes to the `scene`
 * array in the order they should be registered (Boot must be first
 * since it's the scene Phaser auto-starts).
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
  scene: [Boot, Preload, CardTable],
};
