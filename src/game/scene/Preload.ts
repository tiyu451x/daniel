import Phaser from 'phaser';

/**
 * ============================================================
 * Preload.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * Loads all real game assets with a visible loading bar, then
 * starts CardTable once done.
 *
 * ============================================================
 * ⭐ THIS IS WHERE YOU LOAD YOUR OWN ART FILES. ⭐
 * ============================================================
 * Right now nothing is loaded here because every scene generates
 * its own placeholder graphics at runtime. Once you have real
 * images, add lines like:
 *
 *   this.load.image('card-back', 'assets/images/cards/card-back.png');
 *   this.load.image('level1-front', 'assets/images/cards/level1-front.png');
 *   this.load.image('bg-forest', 'assets/images/backgrounds/forest.png');
 *   this.load.spritesheet('player', 'assets/images/sprites/player.png', {
 *     frameWidth: 32, frameHeight: 32,
 *   });
 *
 * Then go to src/game/data/LevelData.ts and change the matching
 * `backKey` / `frontKey` / `backgroundKey` string for each card to
 * the key you used above (e.g. 'level1-front' instead of
 * 'card-front-placeholder-0'). The rest of the game will
 * automatically pick up your art — no other files need changes.
 * ============================================================
 */
export class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    const { width, height } = this.scale;

    const barWidth = 320;
    const barHeight = 24;
    const barX = width / 2 - barWidth / 2;
    const barY = height / 2 - barHeight / 2;

    this.add
      .rectangle(width / 2, height / 2, barWidth, barHeight)
      .setStrokeStyle(2, 0xffffff);

    const fill = this.add.rectangle(barX + 2, barY + barHeight / 2, 0, barHeight - 4, 0xffffff);
    fill.setOrigin(0, 0.5);

    this.load.on('progress', (progress: number) => {
      fill.width = (barWidth - 4) * progress;
    });

    // --- YOUR REAL ASSETS GO HERE (see comment block above) ---
  }

  create(): void {
    this.scene.start('CardTable');
  }
}
