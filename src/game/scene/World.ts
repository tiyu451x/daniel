import Phaser, { Scene } from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Bullet } from '../entities/Bullet';
import { EventBus } from '../manager/Eventbus';

const WORLD_WIDTH = 600;
const WORLD_HEIGHT = 800;

export class World extends Scene {
  private player!: Player;
  private playerBullets!: Phaser.Physics.Arcade.Group;
  private enemyBullets!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private enemySpawnTimer!: Phaser.Time.TimerEvent;
  private edgeWaveTimer!: Phaser.Time.TimerEvent;
  private safeZone!: Phaser.GameObjects.Zone;
  private score = 0;
  private waveIndex = 0;

  constructor() {
    super('World');
  }

  create() {
    this.score = 0;
    this.waveIndex = 0;
    EventBus.emit('score-changed', this.score);
    EventBus.emit('player-health', 5);

    this.createArena();

    this.playerBullets = this.physics.add.group({
      classType: Bullet,
      defaultKey: 'player-bullet',
      maxSize: 160,
      runChildUpdate: true,
    });

    this.enemyBullets = this.physics.add.group({
      classType: Bullet,
      defaultKey: 'enemy-bullet',
      maxSize: 900,
      runChildUpdate: true,
    });

    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.player = new Player(this, WORLD_WIDTH / 2, WORLD_HEIGHT - 125, this.playerBullets);

    this.enemySpawnTimer = this.time.addEvent({
      delay: 3200,
      callback: this.spawnEnemyTurret,
      callbackScope: this,
      loop: true,
    });

    this.edgeWaveTimer = this.time.addEvent({
      delay: 420,
      callback: this.spawnEdgeWave,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(this.playerBullets, this.enemies, this.handleHitEnemy, undefined, this);
    this.physics.add.overlap(this.playerBullets, this.enemyBullets, this.handleDestroyEnemyBullet, undefined, this);
    this.physics.add.overlap(this.player, this.enemyBullets, this.handleHitPlayer, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.handleCrashEnemy, undefined, this);
    this.physics.add.overlap(this.safeZone, this.enemyBullets, this.handleSafeZoneBullet, undefined, this);

    EventBus.once('game-over', () => {
      this.enemySpawnTimer.remove();
      this.edgeWaveTimer.remove();
      this.scene.start('Mainmenu');
    });
  }

  update(time: number) {
    if (this.player.active) {
      this.player.update(time);
    }
  }

  private createArena() {
    this.add.rectangle(300, 400, 600, 800, 0x090914);

    for (let y = 40; y < WORLD_HEIGHT; y += 56) {
      this.add.rectangle(WORLD_WIDTH / 2, y, WORLD_WIDTH, 1, 0x18203a, 0.65);
    }

    for (let x = 36; x < WORLD_WIDTH; x += 56) {
      this.add.rectangle(x, WORLD_HEIGHT / 2, 1, WORLD_HEIGHT, 0x18203a, 0.45);
    }

    this.add.rectangle(300, 675, 142, 98, 0x5cffd6, 0.08)
      .setStrokeStyle(2, 0x5cffd6, 0.8);
    this.safeZone = this.add.zone(300, 675, 136, 92);
    this.physics.add.existing(this.safeZone, true);
  }

  private spawnEnemyTurret() {
    const x = Phaser.Math.Between(90, 510);
    const y = Phaser.Math.Between(70, 170);
    const enemy = new Enemy(this, x, y, this.enemyBullets);
    this.enemies.add(enemy);
  }

  private spawnEdgeWave() {
    const side = this.waveIndex % 4;
    const gap = 170 + ((this.waveIndex * 47) % 260);
    const spacing = 54;
    const speed = 165 + Math.min(this.waveIndex * 1.4, 120);

    if (side === 0 || side === 1) {
      for (let y = 35; y <= WORLD_HEIGHT - 35; y += spacing) {
        if (Math.abs(y - gap) < 56) {
          continue;
        }

        const x = side === 0 ? -18 : WORLD_WIDTH + 18;
        const velocityX = side === 0 ? speed : -speed;
        this.fireEnemyBullet(x, y, velocityX, Phaser.Math.Between(-25, 25));
      }
    } else {
      for (let x = 35; x <= WORLD_WIDTH - 35; x += spacing) {
        if (Math.abs(x - gap) < 56) {
          continue;
        }

        const y = side === 2 ? -18 : WORLD_HEIGHT + 18;
        const velocityY = side === 2 ? speed : -speed;
        this.fireEnemyBullet(x, y, Phaser.Math.Between(-25, 25), velocityY);
      }
    }

    if (this.waveIndex % 5 === 0) {
      this.spawnAimedBurst();
    }

    this.waveIndex += 1;
  }

  private spawnAimedBurst() {
    const side = Phaser.Math.Between(0, 3);
    const origin = this.getEdgeOrigin(side);
    const angleToPlayer = Phaser.Math.Angle.Between(origin.x, origin.y, this.player.x, this.player.y);

    for (let i = -2; i <= 2; i += 1) {
      const angle = angleToPlayer + Phaser.Math.DegToRad(i * 12);
      const speed = 210;
      this.fireEnemyBullet(origin.x, origin.y, Math.cos(angle) * speed, Math.sin(angle) * speed);
    }
  }

  private getEdgeOrigin(side: number) {
    if (side === 0) {
      return { x: -20, y: Phaser.Math.Between(40, WORLD_HEIGHT - 40) };
    }

    if (side === 1) {
      return { x: WORLD_WIDTH + 20, y: Phaser.Math.Between(40, WORLD_HEIGHT - 40) };
    }

    if (side === 2) {
      return { x: Phaser.Math.Between(40, WORLD_WIDTH - 40), y: -20 };
    }

    return { x: Phaser.Math.Between(40, WORLD_WIDTH - 40), y: WORLD_HEIGHT + 20 };
  }

  private fireEnemyBullet(x: number, y: number, velocityX: number, velocityY: number) {
    const bullet = this.enemyBullets.get(x, y, 'enemy-bullet') as Bullet | null;

    if (bullet) {
      bullet.fire(x, y, velocityX, velocityY);
    }
  }

  private handleHitEnemy(object1: unknown, object2: unknown) {
    if (!(object1 instanceof Bullet) || !(object2 instanceof Enemy)) {
      return;
    }

    object1.disableBody(true, true);
    object2.destroy();
    this.addScore(100);
  }

  private handleDestroyEnemyBullet(object1: unknown, object2: unknown) {
    if (!(object1 instanceof Bullet) || !(object2 instanceof Bullet)) {
      return;
    }

    object1.disableBody(true, true);
    object2.disableBody(true, true);
    this.addScore(10);
  }

  private handleHitPlayer(object1: unknown, object2: unknown) {
    if (!(object1 instanceof Player) || !(object2 instanceof Bullet)) {
      return;
    }

    object2.disableBody(true, true);
    object1.takeDamage();
  }

  private handleCrashEnemy(object1: unknown, object2: unknown) {
    if (!(object1 instanceof Player) || !(object2 instanceof Enemy)) {
      return;
    }

    object2.destroy();
    object1.takeDamage();
  }

  private handleSafeZoneBullet(_safeZone: unknown, object2: unknown) {
    if (!(object2 instanceof Bullet)) {
      return;
    }

    object2.disableBody(true, true);
  }

  private addScore(points: number) {
    this.score += points;
    EventBus.emit('score-changed', this.score);
  }
}
