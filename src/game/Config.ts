import Phaser, { type Types } from 'phaser';
import { Boot } from './scene/Boot';
import { Preload } from './scene/Preload';
import { Mainmenu } from './scene/Mainmenu';
import { World } from './scene/World';

export const GameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  parent: 'game-container',
  backgroundColor: '#0a0a12',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [Boot, Preload, Mainmenu, World]
};