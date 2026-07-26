import Phaser from 'phaser';
import { Bullet } from './Bullet';
import { EventBus } from '../manager/Eventbus';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private bulletPool: Phaser.Physics.Arcade.Group;
  private lastFired: number = 0;
  private fireRate: number = 100; // Milliseconds between shots
  public hp: number = 5;

  constructor(scene: Phaser.Scene, x: number, y: number, bulletPool: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 'player');
    this.bulletPool = bulletPool;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBodySize(12, 12); // Tiny hitbox for bullet hell precision
    
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
    }
  }

  update(time: number) {
    this.setVelocity(0);
    const speed = 300;

    if (this.cursors.left.isDown) this.setVelocityX(-speed);
    if (this.cursors.right.isDown) this.setVelocityX(speed);
    if (this.cursors.up.isDown) this.setVelocityY(-speed);
    if (this.cursors.down.isDown) this.setVelocityY(speed);

    // Auto-fire while holding space or up
    if (this.cursors.space.isDown && time > this.lastFired) {
      this.shoot();
      this.lastFired = time + this.fireRate;
    }
  }

  private shoot() {
    const bullet = this.bulletPool.get(this.x, this.y - 15) as Bullet;
    if (bullet) {
      bullet.fire(this.x, this.y - 15, 0, -600);
    }
  }

  takeDamage() {
    this.hp--;
    EventBus.emit('player-health', this.hp);
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => this.clearTint());

    if (this.hp <= 0) {
      EventBus.emit('game-over');
      this.destroy();
    }
  }
}