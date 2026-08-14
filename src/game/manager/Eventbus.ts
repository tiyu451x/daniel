import { Events } from 'phaser';

/**
 * EventBus.ts
 *
 * Shared event emitter used to communicate between React components
 * and Phaser scenes. Import this in both your .tsx files and your
 * Phaser scenes/entities.
 *
 * Example (inside a scene):
 *   EventBus.emit('current-scene-ready', this);
 *
 * Example (inside a React component):
 *   EventBus.on('current-scene-ready', (scene) => { ... });
 */
export const EventBus = new Events.EventEmitter();
