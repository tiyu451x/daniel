import Phaser from 'phaser';
import { Bullet } from './Bullet';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private enemyBulletPool: Phaser.Physics.Arcade.Group;
  private shootTimer!: Phaser.Time.TimerEvent;
  private angleOffset: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, bulletPool: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 'enemy');
    this.enemyBulletPool = bulletPool;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocityY(18);
    
    this.shootTimer = scene.time.addEvent({
      delay: 950,
      callback: this.fireBulletRing,
      callbackScope: this,
      loop: true
    });
  }

  private fireBulletRing() {
    if (!this.active) return;

    const bulletsInRing = 10;
    for (let i = 0; i < bulletsInRing; i++) {
      const angle = Phaser.Math.DegToRad((i * (360 / bulletsInRing)) + this.angleOffset);
      const speed = 50;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const bullet = this.enemyBulletPool.get(this.x, this.y) as Bullet;
      if (bullet) {
        bullet.fire(this.x, this.y, vx, vy);
      }
    }
    this.angleOffset += 12;
  }

  destroy(fromScene?: boolean) {
    if (this.shootTimer) this.shootTimer.remove();
    super.destroy(fromScene);
  }
}
