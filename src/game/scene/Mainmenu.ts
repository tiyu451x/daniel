import { Scene } from 'phaser';

export class Mainmenu extends Scene {
  constructor() {
    super('Mainmenu');
  }

  create() {
    this.add.rectangle(300, 400, 600, 800, 0x090914);
    this.add.text(300, 260, 'STAR RUNNER', {
      color: '#5cffd6',
      fontFamily: 'monospace',
      fontSize: '44px',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(300, 345, 'WASD / ARROWS TO MOVE\nAIM WITH MOUSE\nSPACE OR CLICK TO SHOOT', {
      align: 'center',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontSize: '18px',
      lineSpacing: 10,
    }).setOrigin(0.5);

    this.add.text(300, 470, 'PRESS ENTER', {
      color: '#ffde59',
      fontFamily: 'monospace',
      fontSize: '24px',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('World'));
    this.input.once('pointerdown', () => this.scene.start('World'));
  }
}
