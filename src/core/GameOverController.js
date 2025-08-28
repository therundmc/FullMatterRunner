import EngineWrapper from './EngineWrapper.js';
import GameState from './GameState.js';

function showOverlay() {
    const el = document.getElementById('game-over-overlay');
    if (!el) return;
    el.style.display = 'flex';
    document.body.classList.add('game-over');
}

function hideOverlay() {
    const el = document.getElementById('game-over-overlay');
    if (!el) return;
    el.style.display = 'none';
    document.body.classList.remove('game-over');
}

const GameOverController = {
    // GameOverController only handles stopping the engine/audio and showing the overlay
    trigger() {
        GameState.isGameOver = true;
        try { EngineWrapper.stop(); } catch(e) {}
        try { Audio.stopAll(); } catch(e) {}
        // show simple overlay
        showOverlay();
        // stop legacy AI interval if running
        try { if (window.thugInterval) { clearInterval(window.thugInterval); window.thugInterval = null; } } catch(e) {}
        // bind R to reload
        function onKey(e){ if (e.key === 'r' || e.key === 'R') { window.location.reload(); } }
        window.addEventListener('keydown', onKey, { once: true });
    },
    reset() {
        GameState.isGameOver = false;
        // restart AI interval if needed
        try { if (!window.thugInterval) window.Runtime?.startAInterval?.(); } catch(e) {}
        hideOverlay();
    }
};

export default GameOverController;
