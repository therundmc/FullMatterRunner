// minimal Engine wrapper to centralize Matter setup
const { Engine, Render, Runner } = (typeof Matter !== 'undefined') ? Matter : window.Matter;

const EngineWrapper = {
  engine: null,
  render: null,
  runner: null,
  init() {
    // keep compatibility with existing code for now
    if (window.engine) return;
    this.engine = Engine.create();
    this.engine.gravity.scale = 0;
    // create a render with sprites enabled (disable wireframes)
    // force canvas size to 1024x768 for consistent layout
    const CANVAS_W = 1024;
    const CANVAS_H = 768;
    const mountEl = document.getElementById('game-canvas-container') || document.body;
    this.render = Render.create({
      element: mountEl,
      engine: this.engine,
      options: {
        width: CANVAS_W,
        height: CANVAS_H,
        wireframes: false,
        background: '#000000',
        pixelRatio: window.devicePixelRatio || 1
      }
    });
    // ensure canvas DOM size matches render resolution (prevent CSS scaling)
    if (this.render && this.render.canvas) {
      this.render.canvas.style.width = CANVAS_W + 'px';
      this.render.canvas.style.height = CANVAS_H + 'px';
      // make canvas non-draggable and prevent pointer events leaking
      this.render.canvas.style.display = 'block';
    }
    // set a sensible default camera padding to center of canvas
    window.cameraPadding = window.cameraPadding || { x: CANVAS_W * 0.5, y: CANVAS_H * 0.5 };
    Render.run(this.render);
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
    window.engine = this.engine;
    window.world = this.engine.world;

    // ensure there's a mouse instance attached for legacy code
    try {
      const { Mouse } = (typeof Matter !== 'undefined') ? Matter : window.Matter;
      const m = Mouse.create(this.render.canvas || document.body);
      // ensure mouse events are attached to the actual canvas element
      if (this.render && this.render.canvas) {
        Mouse.setElement(m, this.render.canvas);
        m.pixelRatio = this.render.options.pixelRatio || (window.devicePixelRatio || 1);
      }
      this.engine.mouse = m;
      this.render.mouse = m;
      window.mouse = m;
    } catch (e) {
      // ignore if Mouse isn't available
    }
  },
  stop() { try { Runner.stop(this.runner); Render.stop(this.render); } catch (e) {} },
  start() { try { Runner.run(this.runner, this.engine); Render.run(this.render); } catch (e) {} },
};


export default EngineWrapper;
