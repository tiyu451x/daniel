import Phaser from 'phaser';

/**
 * Boot.ts
 *
 * The very first scene Phaser runs. Keep this tiny — just load
 * whatever tiny assets Preload's loading bar itself needs (if any),
 * then move on. All real game assets load in Preload.ts.
 */
export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    // Load only assets needed for the Preload scene's UI (e.g. a logo
    // or loading-bar background). Leave empty if you don't need one.
  }

  create(): void {
    this.scene.start('Preload');
  }
}
