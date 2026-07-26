import Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
  }

  fire(x: number, y: number, velocityX: number, velocityY: number) {
    this.body?.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocity(velocityX, velocityY);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    // Deactivate when leaving the canvas bounds (600x800 resolution)
    if (this.y < -20 || this.y > 820 || this.x < -20 || this.x > 620) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}