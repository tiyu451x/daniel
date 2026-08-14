import Phaser from 'phaser';

/**
 * Preload.ts
 *
 * Loads all real game assets with a loading bar. Currently there's
 * nothing to load since CardTable uses generated placeholder art —
 * add this.load.image(...) calls here once you have real card art,
 * then they'll show up on the loading bar automatically.
 */
export class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    const { width, height } = this.scale;

    // Simple loading bar
    const barWidth = 320;
    const barHeight = 24;
    const barX = width / 2 - barWidth / 2;
    const barY = height / 2 - barHeight / 2;

    this.add
      .rectangle(width / 2, height / 2, barWidth, barHeight)
      .setStrokeStyle(2, 0xffffff);

    const fill = this.add.rectangle(
      barX + 2,
      barY + barHeight / 2,
      0,
      barHeight - 4,
      0xffffff
    );
    fill.setOrigin(0, 0.5);

    this.load.on('progress', (progress: number) => {
      fill.width = (barWidth - 4) * progress;
    });

    // --- Real game assets go here, e.g.: ---
    // this.load.image('card-back', 'assets/images/cards/card-back.png');
    // this.load.image('card-01', 'assets/images/cards/card-01.png');
  }

  create(): void {
    this.scene.start('CardTable');
  }
}
