import Phaser from 'phaser';

/**
 * Card.ts
 *
 * A single flippable card. Starts face-down and flips to reveal
 * a front image on click. Multiple cards can be open at once.
 *
 * PLACEHOLDER ART:
 * Right now CardTable.ts draws the back/front faces as simple
 * colored rectangles at runtime, so this works with zero assets.
 *
 * TO SWAP IN REAL ART LATER:
 *   1. Put your images in src/assets/images/cards/
 *      e.g. card-back.png, card-01.png, card-02.png, ...
 *   2. In CardTable.ts's preload(), load them:
 *        this.load.image('card-back', 'assets/images/cards/card-back.png');
 *        this.load.image('card-01', 'assets/images/cards/card-01.png');
 *   3. In CardTable.ts's create(), pass those real keys into each
 *      Card instead of the generated placeholder keys.
 */

export interface CardConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width?: number;
  height?: number;
  backTextureKey: string;
  frontTextureKey: string;
  id: string | number;
}

export class Card extends Phaser.GameObjects.Container {
  public readonly cardId: string | number;
  private cardWidth: number;
  private cardHeight: number;
  private backTextureKey: string;
  private frontTextureKey: string;

  private faceSprite: Phaser.GameObjects.Image;
  private isOpen: boolean = false;
  private isFlipping: boolean = false;

  constructor(config: CardConfig) {
    super(config.scene, config.x, config.y);

    this.cardId = config.id;
    this.cardWidth = config.width ?? 120;
    this.cardHeight = config.height ?? 168;
    this.backTextureKey = config.backTextureKey;
    this.frontTextureKey = config.frontTextureKey;

    // Card face (starts showing the back texture)
    this.faceSprite = config.scene.add.image(0, 0, this.backTextureKey);
    this.faceSprite.setDisplaySize(this.cardWidth, this.cardHeight);
    this.add(this.faceSprite);

    // Interactive hit area sized to the card
    this.setSize(this.cardWidth, this.cardHeight);
    this.setInteractive({ useHandCursor: true });
    this.on('pointerover', this.onHoverStart, this);
    this.on('pointerout', this.onHoverEnd, this);
    this.on('pointerdown', this.toggle, this);

    config.scene.add.existing(this);
  }

  private onHoverStart(): void {
    if (this.isFlipping) return;
    this.scene.tweens.add({
      targets: this,
      y: this.y - 8,
      duration: 120,
      ease: 'Sine.easeOut',
    });
  }

  private onHoverEnd(): void {
    if (this.isFlipping) return;
    this.scene.tweens.add({
      targets: this,
      y: this.y + 8,
      duration: 120,
      ease: 'Sine.easeIn',
    });
  }

  /** Flip the card. Called on click. */
  public toggle(): void {
    if (this.isFlipping) return;
    this.isFlipping = true;

    this.scene.tweens.add({
      targets: this.faceSprite,
      scaleX: 0,
      duration: 120,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.isOpen = !this.isOpen;
        this.faceSprite.setTexture(
          this.isOpen ? this.frontTextureKey : this.backTextureKey
        );
        this.faceSprite.setDisplaySize(this.cardWidth, this.cardHeight);

        this.scene.tweens.add({
          targets: this.faceSprite,
          scaleX: 1,
          duration: 120,
          ease: 'Sine.easeOut',
          onComplete: () => {
            this.isFlipping = false;
          },
        });
      },
    });
  }

  public get open(): boolean {
    return this.isOpen;
  }
}
