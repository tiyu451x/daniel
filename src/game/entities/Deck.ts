import Phaser from 'phaser';

/**
 * ============================================================
 * Deck.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * Draws a small pile ("deck") of face-down cards stacked on top
 * of each other, with a name/label underneath (e.g. player name).
 * Clicking the deck triggers a shuffle animation (the pile jitters
 * and cards swap order), then calls `onShuffleComplete` so the
 * scene knows to fan the 5 real cards out onto the table.
 *
 * WHAT YOU CAN CUSTOMIZE:
 *   - The name/label text: pass a different `label` into the config
 *     when you create the Deck (see CardTable.ts).
 *   - Deck art: change `backKey` in the config to your own texture.
 *   - Number of cards drawn in the pile visual (doesn't have to match
 *     the real 5-card count, it's just a stack of images): change
 *     `PILE_SIZE` below.
 *   - Shuffle animation feel: see `shuffle()` below, the jitter
 *     offsets and durations are commented.
 * ============================================================
 */

export interface DeckConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  label: string;
  backKey: string;
  onShuffleComplete: () => void;
}

export class Deck extends Phaser.GameObjects.Container {
  private static readonly PILE_SIZE = 6; // how many stacked card images to draw
  private static readonly CARD_WIDTH = 100;
  private static readonly CARD_HEIGHT = 140;

  private pileSprites: Phaser.GameObjects.Image[] = [];
  private labelText: Phaser.GameObjects.Text;
  private isShuffling = false;
  private onShuffleComplete: () => void;

  constructor(config: DeckConfig) {
    super(config.scene, config.x, config.y);
    this.onShuffleComplete = config.onShuffleComplete;

    // Stack of slightly-offset card backs to look like a physical pile.
    for (let i = 0; i < Deck.PILE_SIZE; i++) {
      const sprite = config.scene.add.image(
        i * 1.5, // <-- horizontal stagger per card, tweak for a messier/neater pile
        -i * 1.5, // <-- vertical stagger per card
        config.backKey
      );
      sprite.setDisplaySize(Deck.CARD_WIDTH, Deck.CARD_HEIGHT);
      this.pileSprites.push(sprite);
      this.add(sprite);
    }

    this.labelText = config.scene.add
      .text(0, Deck.CARD_HEIGHT / 2 + 24, config.label, {
        fontFamily: 'Arial',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    this.add(this.labelText);

    this.setSize(Deck.CARD_WIDTH, Deck.CARD_HEIGHT + 40);
    this.setInteractive({ useHandCursor: true });
    this.on('pointerdown', this.shuffle, this);

    config.scene.add.existing(this);
  }

  private shuffle(): void {
    if (this.isShuffling) return;
    this.isShuffling = true;

    const timeline = this.scene.tweens.createTimeline();

    // Quick jitter: each card in the pile nudges left/right a few times.
    this.pileSprites.forEach((sprite, index) => {
      timeline.add({
        targets: sprite,
        x: sprite.x + Phaser.Math.Between(-10, 10), // <-- jitter distance
        duration: 60,
        yoyo: true,
        repeat: 3,
        delay: index * 30, // <-- stagger so it ripples through the pile
        ease: 'Sine.easeInOut',
      });
    });

    timeline.play();

    timeline.once('complete', () => {
      // Fade out the whole deck, then hand off to the scene to lay out cards.
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scale: 0.8,
        duration: 250, // <-- deck fade-out speed before cards appear
        ease: 'Sine.easeIn',
        onComplete: () => {
          this.setVisible(false);
          this.onShuffleComplete();
        },
      });
    });
  }
}
