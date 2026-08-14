import Phaser from 'phaser';
import { Card } from '../entities/Card';
import { EventBus } from '../manager/EventBus';

/**
 * CardTable.ts
 *
 * Scene that lays out 5 cards face-down on a table.
 * Click a card to flip it; multiple can stay open at once.
 */
export class CardTable extends Phaser.Scene {
  private cards: Card[] = [];
  private readonly CARD_COUNT = 5;
  private readonly CARD_WIDTH = 120;
  private readonly CARD_HEIGHT = 168;

  constructor() {
    super('CardTable');
  }

  preload(): void {
    // --- Real assets go here once you have them ---
    // this.load.image('table-bg', 'assets/images/cards/table-bg.png');
    // this.load.image('card-back', 'assets/images/cards/card-back.png');
    // this.load.image('card-01', 'assets/images/cards/card-01.png');
    // this.load.image('card-02', 'assets/images/cards/card-02.png');
    // this.load.image('card-03', 'assets/images/cards/card-03.png');
    // this.load.image('card-04', 'assets/images/cards/card-04.png');
    // this.load.image('card-05', 'assets/images/cards/card-05.png');
  }

  create(): void {
    this.generatePlaceholderTextures();

    const { width, height } = this.scale;

    // Table background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1b5e3a);

    // Lay out 5 cards evenly spaced, centered horizontally
    const spacing = this.CARD_WIDTH + 24;
    const totalWidth = spacing * (this.CARD_COUNT - 1);
    const startX = width / 2 - totalWidth / 2;
    const y = height / 2;

    for (let i = 0; i < this.CARD_COUNT; i++) {
      const card = new Card({
        scene: this,
        x: startX + i * spacing,
        y,
        width: this.CARD_WIDTH,
        height: this.CARD_HEIGHT,
        backTextureKey: 'card-back-placeholder',
        frontTextureKey: `card-front-placeholder-${i}`,
        id: i,
      });
      this.cards.push(card);
    }

    EventBus.emit('current-scene-ready', this);
  }

  /**
   * Draws simple placeholder textures at runtime so the scene works
   * with zero external assets. Delete this method once you load real
   * card images in preload() above.
   */
  private generatePlaceholderTextures(): void {
    const w = this.CARD_WIDTH;
    const h = this.CARD_HEIGHT;

    const back = this.make.graphics({ x: 0, y: 0 }, false);
    back.fillStyle(0x2b3a67, 1);
    back.fillRoundedRect(0, 0, w, h, 10);
    back.lineStyle(4, 0xf4a259, 1);
    back.strokeRoundedRect(2, 2, w - 4, h - 4, 8);
    back.generateTexture('card-back-placeholder', w, h);
    back.destroy();

    const frontColors = [0xe63946, 0xf1c453, 0x2a9d8f, 0x457b9d, 0x9d4edd];
    for (let i = 0; i < this.CARD_COUNT; i++) {
      const front = this.make.graphics({ x: 0, y: 0 }, false);
      front.fillStyle(0xffffff, 1);
      front.fillRoundedRect(0, 0, w, h, 10);
      front.fillStyle(frontColors[i % frontColors.length], 1);
      front.fillRoundedRect(6, 6, w - 12, h - 12, 8);
      front.generateTexture(`card-front-placeholder-${i}`, w, h);
      front.destroy();
    }
  }
}
