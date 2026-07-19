import Phaser from 'phaser';
import { Bullet } from './Bullet';
import { EventBus } from '../manager/Eventbus';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private bullets: Phaser.Physics.Arcade.Group;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: Record<'up' | 'left' | 'down' | 'right' | 'shoot', Phaser.Input.Keyboard.Key>;
  private nextShotAt = 0;
  private health = 5;

  constructor(scene: Phaser.Scene, x: number, y: number, bullets: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 'player');

    this.bullets = bullets;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDepth(2);
    this.setCircle(8, 8, 8);

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = scene.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as Record<'up' | 'left' | 'down' | 'right' | 'shoot', Phaser.Input.Keyboard.Key>;

    scene.input.on('pointerdown', this.shoot, this);
  }

  update(time: number) {
    const speed = 290;
    const movingLeft = this.cursors.left.isDown || this.wasd.left.isDown;
    const movingRight = this.cursors.right.isDown || this.wasd.right.isDown;
    const movingUp = this.cursors.up.isDown || this.wasd.up.isDown;
    const movingDown = this.cursors.down.isDown || this.wasd.down.isDown;

    this.setVelocity(0);

    if (movingLeft) {
      this.setVelocityX(-speed);
    } else if (movingRight) {
      this.setVelocityX(speed);
    }

    if (movingUp) {
      this.setVelocityY(-speed);
    } else if (movingDown) {
      this.setVelocityY(speed);
    }

    const body = this.body;

    if (body && body.velocity.length() > speed) {
      body.velocity.normalize().scale(speed);
    }

    this.aimAtPointer();

    if (this.cursors.space?.isDown || this.wasd.shoot.isDown || this.scene.input.activePointer.isDown) {
      this.shoot(time);
    }
  }

  takeDamage() {
    this.health -= 1;
    EventBus.emit('player-health', this.health);
    this.setTint(0xff5c7a);
    this.scene.time.delayedCall(120, () => this.clearTint());

    if (this.health <= 0) {
      this.disableBody(true, true);
      EventBus.emit('game-over');
    }
  }

  private aimAtPointer() {
    const pointer = this.scene.input.activePointer;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
    this.setRotation(angle + Math.PI / 2);
  }

  private shoot(time = this.scene.time.now) {
    if (time < this.nextShotAt || !this.active) {
      return;
    }

    const pointer = this.scene.input.activePointer;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
    const speed = 620;
    const bullet = this.bullets.get(this.x, this.y, 'player-bullet') as Bullet | null;

    if (bullet) {
      bullet.fire(
        this.x + Math.cos(angle) * 22,
        this.y + Math.sin(angle) * 22,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
      );
      this.nextShotAt = time + 120;
    }
  }
}
