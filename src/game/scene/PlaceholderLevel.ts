import Phaser from 'phaser';

/**
 * ============================================================
 * PlaceholderLevel.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * A blank "coming soon" scene used by any card in LevelData.ts
 * whose targetSceneKey is 'PlaceholderLevel' (currently cards 4
 * and 5). Shows a message and a button back to the table.
 *
 * ============================================================
 * HOW TO TURN THIS INTO A REAL LEVEL:
 * ============================================================
 *   1. Copy this file, rename it (e.g. Level2.ts), rename the
 *      class and the scene key string in the constructor.
 *   2. Build your actual gameplay inside (Level1.ts is a good
 *      reference for an RPG-style level with a player + enemy).
 *   3. Register your new scene in src/game/Config.ts's scene array.
 *   4. In src/game/data/LevelData.ts, change that card's
 *      `targetSceneKey` to your new scene's key.
 * ============================================================
 */
export class PlaceholderLevel extends Phaser.Scene {
  constructor() {
    super('PlaceholderLevel');
  }

  create(): void {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x333333);
    this.add
      .text(width / 2, height / 2 - 20, 'Coming Soon', {
        fontFamily: 'Arial',
        fontSize: '32px',
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const btn = this.add
      .text(width / 2, height / 2 + 40, '< Back to Table', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => this.scene.start('CardTable'));
  }
}
