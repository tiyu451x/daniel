import { Events } from 'phaser';

/**
 * ============================================================
 * EventBus.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * A shared "walkie-talkie" that lets React components and Phaser
 * scenes talk to each other, since they normally can't see each
 * other directly.
 *
 * HOW TO USE IT (you likely won't need to touch this file):
 *   Inside a scene:   EventBus.emit('some-event', data);
 *   Inside React:      EventBus.on('some-event', (data) => {...});
 *
 * WHAT YOU CAN CUSTOMIZE:
 * Nothing needed here for the card game to work. You'd only touch
 * this if you want to add new events, e.g. EventBus.emit('score-changed', 5)
 * to update a React scoreboard outside the Phaser canvas.
 * ============================================================
 */
export const EventBus = new Events.EventEmitter();
