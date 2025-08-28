# FullMatterRunner
Full Matter Runner in matter js

- Move with ZQSD (WASD)
- Space Or Click to shoot
- Mouse to Aim
- R to Reload

![image](https://user-images.githubusercontent.com/25774146/206882285-03554875-26b9-4604-9767-c17ad48b0939.png)

---

Migration plan and scaffold notes

1. Current state
   - Project has legacy global scripts under `src/` (app.js, player.js, enemy.js, gun.js, etc.).

2. What I scaffolded
   - `src/main.js` entry module
   - `src/core/*` wrappers (EngineWrapper, SceneManager, Input, Audio, GameState)
   - `src/entities/*` placeholders (Player, Enemy, Gun, Map, Txt)
   - `src/scenes/*` sample LevelBase and Level1
   - `src/ui/GameOver.js` overlay helper
   - `data/levels/level1.json` sample level
   - `index.html` now loads `src/main.js` as a module; legacy scripts left commented

3. Next steps to migrate each file
   - Move inline code from `src/app.js` into `src/main.js` and `src/core/EngineWrapper.js` and `src/core/SceneManager.js`.
   - Convert `player.js`, `enemy.js`, and `gun.js` into ES modules under `src/entities/` keeping class APIs.
   - Replace direct global access (window.engine, etc.) with `EngineWrapper` and `GameState` imports; keep `window.*` during migration for compatibility.

4. How I can help now
   - I can move `app.js` and `player.js` into the new structure as a first migration step and adjust imports.
   - Or I can continue and convert all files in one pass.

Run locally
- Open `index.html` in a modern browser (or use a local http server) to run the module entry.
