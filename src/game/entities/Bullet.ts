import Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  private fired = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture = 'player-bullet') {
    super(scene, x, y, texture);
  }

  fire(x: number, y: number, velocityX: number, velocityY: number) {
    this.fired = true;
    this.enableBody(true, x, y, true, true);
    this.setVelocity(velocityX, velocityY);
    this.setRotation(Math.atan2(velocityY, velocityX) + Math.PI / 2);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.active) {
      return;
    }

    if (!this.fired || this.x < -40 || this.x > 640 || this.y < -40 || this.y > 840) {
      this.disableBody(true, true);
    }
  }
}
