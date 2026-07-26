import { Scene } from 'phaser';

export class Preload extends Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    // Generate Player Texture (Cyan Triangle)
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x00ffff, 1);
    playerGraphics.fillTriangle(16, 0, 0, 32, 32, 32);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Generate Enemy Texture (Red Diamond)
    const enemyGraphics = this.add.graphics();
    enemyGraphics.fillStyle(0xff0055, 1);
    enemyGraphics.fillRect(0, 0, 28, 28);
    enemyGraphics.generateTexture('enemy', 28, 28);
    enemyGraphics.destroy();

    // Generate Player Bullet (Yellow Laser)
    const pBullet = this.add.graphics();
    pBullet.fillStyle(0xffff00, 1);
    pBullet.fillRect(0, 0, 4, 12);
    pBullet.generateTexture('player-bullet', 4, 12);
    pBullet.destroy();

    // Generate Enemy Bullet (Magenta Orb)
    const eBullet = this.add.graphics();
    eBullet.fillStyle(0xff00ff, 1);
    eBullet.fillCircle(5, 5, 5);
    eBullet.generateTexture('enemy-bullet', 10, 10);
    eBullet.destroy();
  }

  create() {
    this.scene.start('Mainmenu');
  }
}