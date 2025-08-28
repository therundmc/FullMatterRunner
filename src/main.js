// main entry (ES module)
import EngineWrapper from './core/EngineWrapper.js';
import SceneManager from './core/SceneManager.js';
import GameState from './core/GameState.js';
import Constants from './core/Constants.js';
import './utils.js';
import Runtime from './core/Runtime.js';

// initialize systems
EngineWrapper.init();
GameState.init();
Constants.init();
// load intro scene and start runtime
await SceneManager.load('level0');
Runtime.start();
Runtime.startAInterval();

// expose for debugging
window.EngineWrapper = EngineWrapper;
window.SceneManager = SceneManager;
window.GameState = GameState;
