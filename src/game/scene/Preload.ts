import Phaser, { Scene } from 'phaser';

export class Preload extends Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    this.add.text(300, 400, 'LOADING', {
      color: '#ffffff',
      fontFamily: 'monospace',
      fontSize: '24px',
    }).setOrigin(0.5);
  }

  create() {
    this.createPlayerTexture();
    this.createEnemyTexture();
    this.createBulletTexture('player-bullet', 0x5cffd6);
    this.createBulletTexture('enemy-bullet', 0xff5c7a);
    this.scene.start('Mainmenu');
  }

  private createPlayerTexture() {
    const graphics = this.make.graphics();
    graphics.fillStyle(0x4be1ff);
    graphics.fillTriangle(16, 0, 0, 32, 32, 32);
    graphics.fillStyle(0xffffff);
    graphics.fillTriangle(16, 8, 9, 26, 23, 26);
    graphics.generateTexture('player', 32, 32);
    graphics.destroy();
  }

  private createEnemyTexture() {
    const graphics = this.make.graphics();
    graphics.fillStyle(0xff3f6e);
    graphics.fillTriangle(16, 32, 0, 0, 32, 0);
    graphics.fillStyle(0x3a0a20);
    graphics.fillCircle(16, 14, 7);
    graphics.generateTexture('enemy', 32, 32);
    graphics.destroy();
  }

  private createBulletTexture(key: string, color: number) {
    const graphics = this.make.graphics();
    graphics.fillStyle(color);
    graphics.fillRoundedRect(0, 0, 6, 14, 3);
    graphics.lineStyle(1, Phaser.Display.Color.ValueToColor(color).brighten(40).color);
    graphics.strokeRoundedRect(0, 0, 6, 14, 3);
    graphics.generateTexture(key, 6, 14);
    graphics.destroy();
  }
}
