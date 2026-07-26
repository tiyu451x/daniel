import { Scene } from 'phaser';

export class Mainmenu extends Scene {
  constructor() {
    super('Mainmenu');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.text(width / 2, height / 2 - 50, 'NEON BULLET HELL', {
      fontFamily: 'Arial Black', fontSize: '36px', color: '#00ffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 30, 'Press SPACE or CLICK to Start', {
      fontFamily: 'Arial', fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5);

    this.input.on('pointerdown', () => this.scene.start('World'));
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('World'));
  }
}