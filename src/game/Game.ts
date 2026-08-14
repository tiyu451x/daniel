import Phaser from 'phaser';
import { gameConfig } from './Config';

/**
 * ============================================================
 * Game.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * Creates the actual Phaser.Game instance using the config from
 * Config.ts. Call StartGame() once from your React entry point.
 *
 * WHAT YOU CAN CUSTOMIZE:
 * Nothing needed here. Configuration changes belong in Config.ts.
 * ============================================================
 */
export const StartGame = (parentElementId: string): Phaser.Game => {
  return new Phaser.Game({ ...gameConfig, parent: parentElementId });
};
