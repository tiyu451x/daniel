import Phaser from 'phaser';
import { CardLevelData } from '../data/LevelData';

/**
 * ============================================================
 * Card.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * A single card on the table. Handles its own states:
 *
 *   1. FACE DOWN   - default state, shows the back texture
 *   2. FACE UP     - click once -> flips to show title/subtitle
 *   3. HOVER       - while face up (or down), tells the scene to
 *                    swap the table background to this card's scenery
 *   4. PLAY READY  - click AGAIN while face up -> a "PLAY" button
 *                    fades in on top of the card
 *   5. LAUNCHING   - click PLAY -> card zooms toward the camera,
 *                    then the scene starts the target level
 *
 * WHAT YOU CAN CUSTOMIZE:
 *   - Flip speed / hover lift height: see the `duration` and offset
 *     numbers inside each tween below, they're commented.
 *   - PLAY button text or style: search for `createPlayButton()`.
 *   - Zoom-in speed/scale when launching a level: search for
 *     `playLevel()`.
 * You will NOT usually need to touch this file to add new cards —
 * that's controlled by LevelData.ts instead. Only edit this file if
 * you want to change HOW every card behaves (animation feel, etc).
 * ============================================================
 */

export interface CardConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width?: number;
  height?: number;
  data: CardLevelData;
  /** Called when the player hovers this card (for background swap). */
  onHover: (data: CardLevelData) => void;
  /** Called when hover ends (to restore default background). */
  onHoverEnd: () => void;
  /** Called when the PLAY button is pressed, after the zoom animation. */
  onPlay: (data: CardLevelData) => void;
}

type CardState = 'face-down' | 'face-up' | 'play-ready' | 'launching';

export class Card extends Phaser.GameObjects.Container {
  public readonly levelData: CardLevelData;

  private cardWidth: number;
  private cardHeight: number;
  private faceSprite: Phaser.GameObjects.Image;
  private titleText: Phaser.GameObjects.Text;
  private subtitleText: Phaser.GameObjects.Text;
  private playButtonContainer: Phaser.GameObjects.Container;
  private lockIcon: Phaser.GameObjects.Text | null = null;

  private state: CardState = 'face-down';
  private isAnimating: boolean = false;

  private onHoverCb: (data: CardLevelData) => void;
  private onHoverEndCb: () => void;
  private onPlayCb: (data: CardLevelData) => void;

  constructor(config: CardConfig) {
    super(config.scene, config.x, config.y);

    this.levelData = config.data;
    this.cardWidth = config.width ?? 120;
    this.cardHeight = config.height ?? 168;
    this.onHoverCb = config.onHover;
    this.onHoverEndCb = config.onHoverEnd;
    this.onPlayCb = config.onPlay;

    // --- Card face image ---
    this.faceSprite = config.scene.add.image(0, 0, this.levelData.backKey);
    this.faceSprite.setDisplaySize(this.cardWidth, this.cardHeight);
    this.add(this.faceSprite);

    // --- Title/subtitle text (hidden until flipped) ---
    this.titleText = config.scene.add
      .text(0, -18, this.levelData.title, {
        fontFamily: 'Arial',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.subtitleText = config.scene.add
      .text(0, 6, this.levelData.subtitle ?? '', {
        fontFamily: 'Arial',
        fontSize: '11px',
        color: '#dddddd',
        align: 'center',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.add([this.titleText, this.subtitleText]);

    // --- PLAY button (hidden until second click) ---
    this.playButtonContainer = this.createPlayButton(config.scene);
    this.playButtonContainer.setVisible(false);
    this.add(this.playButtonContainer);

    // --- Lock icon, only for locked cards ---
    if (this.levelData.locked) {
      this.lockIcon = config.scene.add
        .text(0, 40, '🔒', { fontSize: '28px' })
        .setOrigin(0.5);
      this.add(this.lockIcon);
    }

    // --- Interactivity ---
    this.setSize(this.cardWidth, this.cardHeight);
    this.setInteractive({ useHandCursor: true });
    this.on('pointerover', this.handleHoverStart, this);
    this.on('pointerout', this.handleHoverEnd, this);
    this.on('pointerdown', this.handleClick, this);

    config.scene.add.existing(this);
  }

  /** Builds the PLAY button as its own small container so it's easy to restyle. */
  private createPlayButton(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const bg = scene.add
      .rectangle(0, this.cardHeight / 2 - 28, 80, 28, 0x000000, 0.75)
      .setStrokeStyle(2, 0xffffff);
    const label = scene.add
      .text(0, this.cardHeight / 2 - 28, 'PLAY', {
        fontFamily: 'Arial',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const container = scene.add.container(0, 0, [bg, label]);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', (pointer: Phaser.Input.Pointer, x: number, y: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation(); // don't also trigger the card's own click
      this.playLevel();
    });

    return container;
  }

  private handleHoverStart(): void {
    // Locked cards still show scenery on hover, just no lift or play flow.
    this.onHoverCb(this.levelData);

    if (this.isAnimating) return;
    this.scene.tweens.add({
      targets: this,
      y: this.y - 8, // <-- hover lift height, tweak this number
      duration: 120,
      ease: 'Sine.easeOut',
    });
  }

  private handleHoverEnd(): void {
    this.onHoverEndCb();

    if (this.isAnimating) return;
    this.scene.tweens.add({
      targets: this,
      y: this.y + 8,
      duration: 120,
      ease: 'Sine.easeIn',
    });
  }

  private handleClick(): void {
    if (this.isAnimating) return;

    if (this.levelData.locked) {
      this.shakeLocked();
      return;
    }

    if (this.state === 'face-down') {
      this.flipToFront();
    } else if (this.state === 'face-up') {
      this.showPlayButton();
    }
    // 'play-ready' clicks are handled by the PLAY button itself, not here.
  }

  /** Rattles the card + lock icon for locked cards. Doesn't open anything. */
  private shakeLocked(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.scene.tweens.add({
      targets: this,
      x: this.x - 6,
      duration: 40,
      yoyo: true,
      repeat: 4,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.isAnimating = false;
      },
    });

    if (this.lockIcon) {
      this.scene.tweens.add({
        targets: this.lockIcon,
        angle: { from: -8, to: 8 },
        duration: 40,
        yoyo: true,
        repeat: 4,
        ease: 'Sine.easeInOut',
      });
    }
  }

  /** First click: flip from back to front, revealing the title. */
  private flipToFront(): void {
    this.isAnimating = true;

    this.scene.tweens.add({
      targets: this.faceSprite,
      scaleX: 0,
      duration: 130, // <-- flip speed (first half), tweak here
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.faceSprite.setTexture(this.levelData.frontKey);
        this.faceSprite.setDisplaySize(this.cardWidth, this.cardHeight);
        this.titleText.setVisible(true);
        this.subtitleText.setVisible(true);

        this.scene.tweens.add({
          targets: [this.faceSprite, this.titleText, this.subtitleText],
          scaleX: 1,
          duration: 130, // <-- flip speed (second half)
          ease: 'Sine.easeOut',
          onComplete: () => {
            this.isAnimating = false;
            this.state = 'face-up';
          },
        });
      },
    });
  }

  /** Second click: fade in the PLAY button on top of the (already face-up) card. */
  private showPlayButton(): void {
    this.state = 'play-ready';
    this.playButtonContainer.setVisible(true);
    this.playButtonContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: this.playButtonContainer,
      alpha: 1,
      duration: 180,
      ease: 'Sine.easeOut',
    });
  }

  /** PLAY pressed: zoom this card toward the camera, then hand off to onPlay(). */
  private playLevel(): void {
    if (this.isAnimating || this.state !== 'play-ready') return;
    this.isAnimating = true;
    this.state = 'launching';

    // Bring this card to the very front so the zoom isn't hidden behind others.
    this.scene.children.bringToTop(this);

    this.scene.tweens.add({
      targets: this,
      scale: 6, // <-- how big the card grows before transitioning, tweak here
      alpha: 0, // fades out as it "swallows" the screen
      duration: 500, // <-- zoom-in speed, tweak here
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.onPlayCb(this.levelData);
      },
    });
  }
}
