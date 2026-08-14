/**
 * ============================================================
 * LevelData.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * This is the MASTER LIST of all 5 cards. Each entry controls:
 *   - what the card looks like face-down and face-up
 *   - what background appears behind the table when you hover it
 *   - what text/title shows on the card
 *   - which Phaser scene it launches when you hit PLAY
 *   - whether it's locked
 *
 * ⭐ THIS IS THE FILE YOU'LL EDIT MOST OFTEN. ⭐
 * To change a level's name, art, or destination scene, you only
 * need to edit the array below — you don't need to touch CardTable.ts,
 * Card.ts, or Deck.ts at all for basic changes.
 *
 * ============================================================
 * HOW TO SWAP IN YOUR OWN ART:
 * ============================================================
 * Right now every texture key below (e.g. 'card-back-placeholder')
 * points at art that Phaser GENERATES automatically at runtime
 * (see CardTable.ts -> generatePlaceholderTextures()). Nothing is
 * loaded from an image file yet.
 *
 * To use your own image instead:
 *   1. Save your image into src/assets/images/cards/
 *        e.g. src/assets/images/cards/level1-front.png
 *   2. Open src/game/scene/Preload.ts and add a load line:
 *        this.load.image('level1-front', 'assets/images/cards/level1-front.png');
 *   3. Come back to THIS file and change the matching entry below:
 *        frontKey: 'level1-front',   <-- was 'card-front-placeholder-0'
 *   4. Do the same for backKey and backgroundKey.
 * That's it — the rest of the game automatically uses your new art.
 *
 * ============================================================
 * HOW TO ADD OR REMOVE A CARD:
 * ============================================================
 * Add/remove an object from the CARD_LEVELS array below. CardTable.ts
 * automatically lays out however many cards are in this list, spaced
 * evenly — you don't need to change any layout math.
 * ============================================================
 */

export interface CardLevelData {
  /** Unique id, also used to build default placeholder texture keys. */
  id: number;

  /** Text shown on the face-up (front) side of the card, e.g. "LEVEL 1". */
  title: string;

  /** Small subtitle under the title, e.g. "The Beginning". Optional. */
  subtitle?: string;

  /** Texture key for the face-DOWN side of the card. */
  backKey: string;

  /** Texture key for the face-UP side of the card. */
  frontKey: string;

  /**
   * Texture key for the background shown on the table when this card
   * is HOVERED. Leave as a placeholder key or point it at your own
   * background image (a mossy table, a dungeon floor, etc).
   */
  backgroundKey: string;

  /** Hex color used ONLY by the placeholder generator as a fallback tint. */
  placeholderColor: number;

  /**
   * The key of the Phaser Scene to launch when PLAY is pressed.
   * Must match the string passed to super('SomeKey') inside that
   * scene's constructor, and that scene must be registered in
   * src/game/Config.ts's `scene: [...]` array.
   */
  targetSceneKey: string;

  /** If true, the card shows a lock/chain and cannot be played yet. */
  locked?: boolean;
}

export const CARD_LEVELS: CardLevelData[] = [
  {
    id: 0,
    title: 'LEVEL 1',
    subtitle: 'The Beginning',
    backKey: 'card-back-placeholder',
    frontKey: 'card-front-placeholder-0',
    backgroundKey: 'bg-placeholder-0',
    placeholderColor: 0xe63946,
    targetSceneKey: 'Level1',
    locked: false,
  },
  {
    id: 1,
    title: 'TIC TAC TOE',
    subtitle: 'Mini Game',
    backKey: 'card-back-placeholder',
    frontKey: 'card-front-placeholder-1',
    backgroundKey: 'bg-placeholder-1',
    placeholderColor: 0xf1c453,
    targetSceneKey: 'TicTacToe',
    locked: false,
  },
  {
    id: 2,
    title: '???',
    subtitle: 'Locked',
    backKey: 'card-back-placeholder',
    frontKey: 'card-front-placeholder-2',
    backgroundKey: 'bg-placeholder-2',
    placeholderColor: 0x2a9d8f,
    targetSceneKey: '', // no destination — it's locked
    locked: true,
  },
  {
    id: 3,
    title: 'LEVEL 3',
    subtitle: 'Coming Soon',
    backKey: 'card-back-placeholder',
    frontKey: 'card-front-placeholder-3',
    backgroundKey: 'bg-placeholder-3',
    placeholderColor: 0x457b9d,
    targetSceneKey: 'PlaceholderLevel',
    locked: false,
  },
  {
    id: 4,
    title: 'LEVEL 4',
    subtitle: 'Coming Soon',
    backKey: 'card-back-placeholder',
    frontKey: 'card-front-placeholder-4',
    backgroundKey: 'bg-placeholder-4',
    placeholderColor: 0x9d4edd,
    targetSceneKey: 'PlaceholderLevel',
    locked: false,
  },
];
