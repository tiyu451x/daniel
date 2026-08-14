import Phaser from 'phaser';

/**
 * ============================================================
 * Boot.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * The very first scene Phaser runs. Keep it tiny — only load
 * assets the Preload scene's own UI needs (like a logo), then
 * hand off. All real game assets load in Preload.ts.
 *
 * WHAT YOU CAN CUSTOMIZE:
 * Usually nothing. If you add a splash logo, load it in preload()
 * here and display it in create() before starting Preload.
 * ============================================================
 */
export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    // Optional: load a tiny logo/splash image here if you want one.
  }

  create(): void {
    this.scene.start('Preload');
  }
}
