import Phaser, { Scene } from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Bullet } from '../entities/Bullet';
import { EventBus } from '../manager/Eventbus';

export class World extends Scene {
  private player!: Player;
  private playerBullets!: Phaser.Physics.Arcade.Group;
  private enemyBullets!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private spawnTimer!: Phaser.Time.TimerEvent;
  private score: number = 0;

  constructor() {
    super('World');
  }

  create() {
    this.score = 0;
    EventBus.emit('score-changed', this.score);
    EventBus.emit('player-health', 5);

    // Initialize Object Pools with defaultKeys so bullets are visible!
    this.playerBullets = this.physics.add.group({ 
      classType: Bullet, 
      defaultKey: 'player-bullet',
      maxSize: 100, 
      runChildUpdate: true 
    });
    
    this.enemyBullets = this.physics.add.group({ 
      classType: Bullet, 
      defaultKey: 'enemy-bullet',
      maxSize: 3000, 
      runChildUpdate: true 
    });
    
    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });

    // Create Player
    this.player = new Player(this, 300, 700, this.playerBullets);

    // Enemy Spawner
    this.spawnTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    // Collisions & Overlaps
    this.physics.add.overlap(this.playerBullets, this.enemies, this.handleHitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.enemyBullets, this.handleHitPlayer, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.handleCrashEnemy, undefined, this);

    EventBus.once('game-over', () => {
      this.spawnTimer.remove();
      this.scene.start('Mainmenu');
    });
  }

  update(time: number) {
    if (this.player.active) {
      this.player.update(time);
    }
  }

  private spawnEnemy() {
    const x = Phaser.Math.Between(50, 550);
    const enemy = new Enemy(this, x, -30, this.enemyBullets);
    this.enemies.add(enemy);
  }

  private handleHitEnemy(object1: unknown, object2: unknown) {
    if (!(object1 instanceof Bullet) || !(object2 instanceof Enemy)) {
      return;
    }

    const bullet = object1;
    const enemy = object2;
    bullet.disableBody(true, true);
    enemy.destroy();
    this.score += 100;
    EventBus.emit('score-changed', this.score);
  }

  private handleHitPlayer(object1: unknown, object2: unknown) {
    if (!(object1 instanceof Player) || !(object2 instanceof Bullet)) {
      return;
    }

    const player = object1;
    const bullet = object2;
    bullet.disableBody(true, true);
    player.takeDamage();
  }

  private handleCrashEnemy(object1: unknown, object2: unknown) {
    if (!(object1 instanceof Player) || !(object2 instanceof Enemy)) {
      return;
    }

    const player = object1;
    const enemy = object2;
    enemy.destroy();
    player.takeDamage();
  }
}
