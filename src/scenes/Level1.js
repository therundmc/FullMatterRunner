import Map from '../entities/Map.js';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Txt from '../entities/Txt.js';
import EngineWrapper from '../core/EngineWrapper.js';
import maps from '../data/level1_maps.js';

export default {
  load() {
    const engine = EngineWrapper.engine;
    const world = engine.world;

    const floorMapArray = maps.floorMapArray;
    const wallMapArray = maps.wallMapArray;
    const DynMapArray = maps.DynMapArray;

  // debug diagnostics: print map dimensions to help track down undefined index errors
  console.debug('Level1: floorMap rows=', floorMapArray.length, 'firstRowLen=', floorMapArray[0] && floorMapArray[0].length);
  console.debug('Level1: wallMap rows=', wallMapArray.length, 'firstRowLen=', wallMapArray[0] && wallMapArray[0].length);
  console.debug('Level1: DynMap rows=', DynMapArray.length, 'firstRowLen=', DynMapArray[0] && DynMapArray[0].length);

    window.floorMap = new Map(0,0,floorMapArray,0,world);
    window.wallMap = new Map(0,0,wallMapArray,1,world);
    window.DynMap = new Map(0,0,DynMapArray,2,world);

    window.player = new Player(400, 1750, 51, 29, './assets/img/player/player.png', world);

    window.thug = [];
    window.thug.push(new Enemy(300, 700, 51, 29, './assets/img/thug/thug.png', 1, world));
    window.thug.push(new Enemy(800, 500, 51, 29, './assets/img/thug/thug.png', 4, world));
    window.thug.push(new Enemy(1200, 200, 80, 80, './assets/img/thug/thug.png', 6, world));
    window.thug.push(new Enemy(1300, 1300, 80, 80, './assets/img/thug/thug.png', 7, world));

    window.help    = new Txt("Press 'E' to pick a gun", 300, 1570, 24, "white", world);
    window.ammo    = new Txt(" ", 0, 0, 24, "white", world);
    window.title   = new Txt("- FULL MATTER RUNNER -", 400, 2000, 46, "white", world);

    // compatibility: start runner if not already running
    EngineWrapper.start();
  }
}
// end of Level1 scene
