import EngineWrapper from './EngineWrapper.js';
import GameState from './GameState.js';
import GameOverController from './GameOverController.js';
import { handleCollisonWithBulletDestruction, handleCollisonWithBulletDismemberment, handleCollisonWithBulletAndPlayer, handleCollisonWithPickableObjects, updateBulletCounter } from './CollisionHandlers.js';
const { Render, Events } = (typeof Matter !== 'undefined') ? Matter : window.Matter;

const Runtime = {
  start() {
    const engine = EngineWrapper.engine;
    const render = EngineWrapper.render;

    // input wiring
    this._wireInput();

    Events.on(engine, 'beforeUpdate', () => {
      // if game over, ensure we stopped and show overlay
      if (GameState.isGameOver) {
        GameOverController.trigger();
        return;
      }
  // normal runtime continues unless final game over is set

      if (!window.keysDown) return;
      [...window.keysDown].forEach(k => { window.keyDownHandlers?.[k]?.(); });
      [...window.keysUp].forEach(k => { window.keyUpHandlers?.[k]?.(); });

      if (window.player && render) {
        Render.lookAt(render, window.player.body, { x: window.cameraPadding?.x || 400, y: window.cameraPadding?.y || 300 });
      }

  handleCollisonWithBulletDestruction();
  handleCollisonWithBulletDismemberment();
  handleCollisonWithBulletAndPlayer();
  updateBulletCounter();
  updateAnglePlayerMouse();
    });
  },

  _wireInput() {
    // re-create legacy key handler data structures if missing
    window.keyDownHandlers = window.keyDownHandlers || {
      KeyD: () => window.player?.moveRight(),
      KeyA: () => window.player?.moveLeft(),
      KeyS: () => window.player?.moveDown(),
      KeyW: () => window.player?.moveUp(),
      KeyR: () => window.player?.reload(),
      KeyE: () => handleCollisonWithPickableObjects(),
      Space: () => window.player?.shoot(),
      ShiftLeft: () => { EngineWrapper.engine.timing.timeScale = 0.2; setTimeout(stopSlowMo, 1000); }
    };
    window.keyUpHandlers = window.keyUpHandlers || { ShiftLeft: () => {} };

    window.keysUp = window.keysUp || new Set();
    window.keysDown = window.keysDown || new Set();

    document.addEventListener('keydown', e => { window.keysDown.add(e.code); window.keysUp.delete(e.code); });
    document.addEventListener('keyup', e => { window.keysUp.add(e.code); window.keysDown.delete(e.code); });
    document.addEventListener('click', () => { window.player?.shoot(); });
  }
};

// start/restart the legacy AI interval (50ms) when runtime starts
// the interval is stored on window.thugInterval so it can be cleared on game over
Runtime.startAInterval = function() {
  if (window.thugInterval) return; // already running
  window.thugInterval = setInterval(() => {
    if (GameState.isGameOver) return;
    if (!window.thug || !Array.isArray(window.thug) || !window.player) return;
    window.thug.forEach(item => {
      try { item.Ai(window.player.body); } catch (e) { console.debug('Enemy.Ai error', e); }
    });
  }, 50);
}

export default Runtime;
