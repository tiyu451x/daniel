import Phaser from 'phaser';
import { gameConfig } from './Config';

/**
 * Game.ts
 *
 * Creates the Phaser game instance. Call StartGame() once from
 * your React entry point (main.tsx), passing the id of the DOM
 * element Phaser should render into.
 */
export const StartGame = (parentElementId: string): Phaser.Game => {
  return new Phaser.Game({ ...gameConfig, parent: parentElementId });
};
