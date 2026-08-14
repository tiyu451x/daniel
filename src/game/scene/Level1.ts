import Phaser from 'phaser';

/**
 * ============================================================
 * Level1.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * A minimal RPG level template:
 *   1. Shows a big "LEVEL 1" title card that fades out after ~2s.
 *   2. Spawns a player sprite you move with arrow keys / WASD.
 *   3. Spawns one enemy sprite that patrols side to side.
 *   4. Basic collision: player bumping the enemy pushes the player
 *      back and flashes it red (placeholder "hit" feedback).
 *
 * This is meant to be a STARTING POINT — copy this whole file to
 * make Level2.ts, Level3.ts, etc, then change the constructor's
 * scene key and whatever gameplay you want inside.
 *
 * ============================================================
 * WHAT YOU CAN CUSTOMIZE:
 * ============================================================
 *   - Title text / how long it shows: see `showTitleCard()`.
 *   - Player movement speed: PLAYER_SPEED constant below.
 *   - Enemy patrol distance/speed: ENEMY_PATROL_DISTANCE, ENEMY_SPEED.
 *   - Player/enemy art: change 'player-placeholder' and
 *     'enemy-placeholder' texture keys to your own loaded images
 *     (load them in Preload.ts first).
 *   - What happens on collision: see `handlePlayerEnemyCollision()`.
 *   - Level bounds / world size: see `create()`, the physics world
 *     bounds line.
 * ============================================================
 */
export class Level1 extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private enemy!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };

  private readonly PLAYER_SPEED = 160; // <-- pixels/second, tweak here
  private readonly ENEMY_SPEED = 60; // <-- pixels/second, tweak here
  private readonly ENEMY_PATROL_DISTANCE = 150; // <-- how far left/right it walks

  private enemyStartX = 0;
  private enemyDirection: 1 | -1 = 1;

  constructor() {
    super('Level1');
  }

  preload(): void {
    // --- Real assets go here once you have them ---
    // this.load.spritesheet('player', 'assets/images/sprites/player.png', { frameWidth: 32, frameHeight: 32 });
    // this.load.spritesheet('enemy', 'assets/images/sprites/enemy.png', { frameWidth: 32, frameHeight: 32 });
    // this.load.image('level1-bg', 'assets/images/backgrounds/level1.png');
  }

  create(): void {
    this.generatePlaceholderTextures();

    const { width, height } = this.scale;

    // Background
    this.add.image(width / 2, height / 2, 'level1-bg-placeholder').setDisplaySize(width, height);

    // Physics world bounds — change these if your level is bigger than the screen.
    this.physics.world.setBounds(0, 0, width, height);

    // --- Player ---
    this.player = this.physics.add.sprite(width / 2, height - 100, 'player-placeholder');
    this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(32, 32);

    // --- Enemy ---
    this.enemyStartX = width / 2;
    this.enemy = this.physics.add.sprite(this.enemyStartX, height / 2 - 60, 'enemy-placeholder');
    this.enemy.setCollideWorldBounds(true);
    this.enemy.setDisplaySize(32, 32);

    // Collision
    this.physics.add.overlap(this.player, this.enemy, this.handlePlayerEnemyCollision, undefined, this);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,A,S,D') as typeof this.wasd;

    this.showTitleCard();
  }

  update(): void {
    this.handlePlayerMovement();
    this.handleEnemyPatrol();
  }

  /** Big centered title text that fades in, holds, then fades out. */
  private showTitleCard(): void {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);
    const title = this.add
      .text(width / 2, height / 2, 'LEVEL 1', {
        fontFamily: 'Arial',
        fontSize: '48px',
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    overlay.setAlpha(0);

    this.tweens.add({
      targets: [overlay, title],
      alpha: 1,
      duration: 400,
      onComplete: () => {
        // Hold the title on screen for this long before fading out.
        this.time.delayedCall(1400, () => { // <-- how long the title stays, tweak here
          this.tweens.add({
            targets: [overlay, title],
            alpha: 0,
            duration: 400,
            onComplete: () => {
              overlay.destroy();
              title.destroy();
            },
          });
        });
      },
    });
  }

  private handlePlayerMovement(): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    if (left) body.setVelocityX(-this.PLAYER_SPEED);
    else if (right) body.setVelocityX(this.PLAYER_SPEED);

    if (up) body.setVelocityY(-this.PLAYER_SPEED);
    else if (down) body.setVelocityY(this.PLAYER_SPEED);

    body.velocity.normalize().scale(this.PLAYER_SPEED * (body.velocity.length() > 0 ? 1 : 0));
  }

  /** Simple side-to-side patrol between enemyStartX +/- ENEMY_PATROL_DISTANCE. */
  private handleEnemyPatrol(): void {
    const body = this.enemy.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(this.ENEMY_SPEED * this.enemyDirection);

    if (this.enemy.x >= this.enemyStartX + this.ENEMY_PATROL_DISTANCE) {
      this.enemyDirection = -1;
    } else if (this.enemy.x <= this.enemyStartX - this.ENEMY_PATROL_DISTANCE) {
      this.enemyDirection = 1;
    }
  }

  /** Placeholder "hit" feedback: push player back, flash red briefly. */
  private handlePlayerEnemyCollision(): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const pushDirection = this.player.x < this.enemy.x ? -1 : 1;
    body.setVelocityX(pushDirection * 250); // <-- knockback strength, tweak here

    this.player.setTint(0xff4444);
    this.time.delayedCall(150, () => this.player.clearTint());

    // TODO: this is where you'd subtract health, trigger game over, etc.
  }

  /** Generates placeholder sprites/background so this scene runs with zero art. */
  private generatePlaceholderTextures(): void {
    const player = this.make.graphics({ x: 0, y: 0 }, false);
    player.fillStyle(0x4cc9f0, 1);
    player.fillRoundedRect(0, 0, 32, 32, 6);
    player.generateTexture('player-placeholder', 32, 32);
    player.destroy();

    const enemy = this.make.graphics({ x: 0, y: 0 }, false);
    enemy.fillStyle(0xe63946, 1);
    enemy.fillRoundedRect(0, 0, 32, 32, 6);
    enemy.generateTexture('enemy-placeholder', 32, 32);
    enemy.destroy();

    const bg = this.make.graphics({ x: 0, y: 0 }, false);
    bg.fillStyle(0x264653, 1);
    bg.fillRect(0, 0, this.scale.width, this.scale.height);
    bg.generateTexture('level1-bg-placeholder', this.scale.width, this.scale.height);
    bg.destroy();
  }
}
