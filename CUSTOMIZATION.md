# Customization Guide

This explains how all the files connect, and exactly where to edit
things. Read this once before diving into individual file comments.

## The Big Picture (data flow)

```
Deck (pile + name) 
   -> click -> shuffle animation 
   -> CardTable.layoutCards() reads CARD_LEVELS from LevelData.ts
   -> creates 5 Card instances
   -> hover a Card -> CardTable swaps background to that card's scenery
   -> click a Card (1st time) -> flips to show title
   -> click a Card (2nd time) -> PLAY button fades in
   -> click PLAY -> card zooms in -> CardTable.launchLevel()
   -> this.scene.start(card.targetSceneKey) -> e.g. Level1, TicTacToe
```

## Where to make common changes

### "I want to change a level's name/title"
Edit `src/game/data/LevelData.ts` — change the `title` or `subtitle`
field of that card's entry. Nothing else needs to change.

### "I want to add a 6th card / level"
Add one more object to the `CARD_LEVELS` array in `LevelData.ts`.
`CardTable.ts` automatically lays out however many cards are in that
list — you don't need to touch layout code.

### "I want to use my own images instead of the colored placeholders"
1. Put your image files in `src/assets/images/...` (make folders like
   `cards/`, `backgrounds/`, `sprites/` to stay organized).
2. Open `src/game/scene/Preload.ts` and add a `this.load.image(...)`
   or `this.load.spritesheet(...)` line for each file.
3. Open `LevelData.ts` and change the relevant `backKey` / `frontKey`
   / `backgroundKey` string to match the key you used in step 2.

You do NOT need to edit `Card.ts`, `CardTable.ts`, or `Deck.ts` for
this — they always just look up whatever texture key LevelData.ts
tells them to.

### "I want to change what happens on hover / flip / play click"
That behavior lives in `src/game/entities/Card.ts`. Each animation
step has a comment showing which number controls speed/distance
(e.g. hover lift height, flip duration, zoom scale).

### "I want to build out Level 4 or 5 (currently placeholders)"
1. Copy `src/game/scene/PlaceholderLevel.ts`, rename it, rename the
   class, and change the string passed to `super('...')`.
2. Register the new scene in `src/game/Config.ts`'s `scene: [...]`
   array (import it at the top too).
3. In `LevelData.ts`, change that card's `targetSceneKey` to your
   new scene's key.

`Level1.ts` is the best reference if your new level is RPG-style
(player movement + enemy + collision) — copy it as a starting point
instead of `PlaceholderLevel.ts`.

### "I want the locked card to actually unlock"
Right now clicking it just shakes the chain/lock (see
`Card.ts` -> `shakeLocked()`) and nothing else happens — this was
built as a placeholder on purpose. To make it real:
1. In `LevelData.ts`, that card's entry has `locked: true`. You'll
   need a way to flip that to `false` based on some condition (e.g.
   another level being completed).
2. A simple approach: store completed levels in `localStorage` or a
   small state file, check it in `CardTable.create()`, and mutate
   the matching `CardLevelData.locked` value before cards are built.

### "I want to change the Tic Tac Toe colors/board size"
All in `src/game/scene/TicTacToe.ts` — see the constants at the top
of the class (`CELL_SIZE`, `X_COLOR`, `O_COLOR`).

## File map

| File | Role |
|---|---|
| `game/data/LevelData.ts` | ⭐ Main config — all 5 cards' text, art keys, destinations |
| `game/entities/Card.ts` | Single card behavior (flip/hover/play/zoom) |
| `game/entities/Deck.ts` | The pile + shuffle animation |
| `game/scene/CardTable.ts` | Hub scene — orchestrates deck + cards + background |
| `game/scene/Level1.ts` | RPG template (title card, player, enemy, collision) |
| `game/scene/TicTacToe.ts` | 2-player local tic tac toe |
| `game/scene/PlaceholderLevel.ts` | "Coming soon" scene + template for new levels |
| `game/scene/Boot.ts` / `Preload.ts` | Startup chain, asset loading |
| `game/Config.ts` | Registers every scene Phaser knows about |
| `game/Game.ts` | Creates the Phaser game instance |
| `game/manager/EventBus.ts` | React <-> Phaser messaging (rarely needs edits) |
| `main.tsx` / `index.html` | React app entry point |

## Common mistake to avoid

If you create a new scene file but forget to add it to the `scene:
[...]` array in `Config.ts`, calling `this.scene.start('YourScene')`
will fail silently (nothing happens, no error shown). Always add new
scenes there.
