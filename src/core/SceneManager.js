const SceneManager = {
  current: null,
  async load(name) {
    console.log('SceneManager.load', name);
    this.current = name;
    try {
      const module = await import(`../scenes/${name.charAt(0).toUpperCase() + name.slice(1)}.js`);
      if (module.default && module.default.load) {
        module.default.load();
      }
    } catch (e) {
      console.error('Failed to load scene', name, e);
    }
  },
  reload() { if (this.current) this.load(this.current); }
};
export default SceneManager;
