import Map from '../entities/Map.js';
import Player from '../entities/Player.js';
import Txt from '../entities/Txt.js';
import EngineWrapper from '../core/EngineWrapper.js';
import maps from '../data/level0_maps.js';
import SceneManager from '../core/SceneManager.js';
import { isPlayerOnTileId } from '../core/CollisionHandlers.js';

// use global Matter.Events (UMD bundle on the page)
const { Events } = (typeof Matter !== 'undefined') ? Matter : window.Matter;

export default {
  load() {
  const world = EngineWrapper.engine.world;

    const floorMapArray = maps.floorMapArray;
    const wallMapArray = maps.wallMapArray;
    const DynMapArray = maps.DynMapArray;

    window.floorMap = new Map(0,0,floorMapArray,0,world);
    window.wallMap = new Map(0,0,wallMapArray,1,world);
    window.DynMap = new Map(0,0,DynMapArray,2,world);

    window.player = new Player(50, 300, 51, 29, './assets/img/player/player.png', world);

    EngineWrapper.start();

  // per-frame check: if player's tile is 10, load level1
  const engine = EngineWrapper.engine;
    const checkStair = () => {
      try {
  if (isPlayerOnTileId(10)) {
          Events.off(engine, 'beforeUpdate', checkStair);
          SceneManager.load('level1');
        }
      } catch (e) { }
    };

    Events.on(engine, 'beforeUpdate', checkStair);
  }
};
