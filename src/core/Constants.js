// Collision category and masks (copied from legacy app.js)
const Constants = {
  init() {
    // categories
    window.CATEGORY_PLAYER             = 0b000000000001;
    window.CATEGORY_ENEMY              = 0b000000000010;
    window.CATEGORY_FLOORMAP           = 0b000000000100;
    window.CATEGORY_WALLMAP            = 0b000000001000;
    window.CATEGORY_DYNMAP             = 0b000000010000;
    window.CATEGORY_BULLET             = 0b000000100000;
    window.CATEGORY_PARTICLES          = 0b000001000000;
    window.CATEGORY_OBJECTS            = 0b000010000000;
    window.CATEGORY_BLOOD              = 0b000100000000;
    window.CATEGORY_FLOOR_DETECTOR     = 0b001000000000;
    window.CATEGORY_RAY                = 0b010000000000;
    window.CATEGORY_ENEMY_BULLET       = 0b100000000000;

    // masks
    window.MASK_PLAYER     = window.CATEGORY_DYNMAP + window.CATEGORY_WALLMAP + window.CATEGORY_PARTICLES + window.CATEGORY_ENEMY + window.CATEGORY_BULLET + window.CATEGORY_OBJECTS + window.CATEGORY_ENEMY_BULLET;
    window.MASK_ENEMY      = window.CATEGORY_DYNMAP + window.CATEGORY_WALLMAP + window.CATEGORY_PARTICLES + window.CATEGORY_PLAYER + window.CATEGORY_BULLET;
    window.MASK_FLOORMAP   = window.CATEGORY_FLOOR_DETECTOR;
    window.MASK_WALLMAP    = window.CATEGORY_PLAYER + window.CATEGORY_DYNMAP + window.CATEGORY_BULLET + window.CATEGORY_PARTICLES + window.CATEGORY_ENEMY + window.CATEGORY_OBJECTS + window.CATEGORY_BLOOD + window.CATEGORY_RAY + window.CATEGORY_ENEMY_BULLET;
    window.MASK_DYNMAP     = window.CATEGORY_PLAYER + window.CATEGORY_WALLMAP + window.CATEGORY_BULLET + window.CATEGORY_PARTICLES + window.CATEGORY_ENEMY + window.CATEGORY_OBJECTS + window.CATEGORY_BLOOD + window.CATEGORY_ENEMY_BULLET;
    window.MASK_BULLET     = window.CATEGORY_PLAYER + window.CATEGORY_DYNMAP + window.CATEGORY_WALLMAP + window.CATEGORY_ENEMY + window.CATEGORY_PARTICLES;
    window.MASK_PARTICLES  = window.CATEGORY_PLAYER + window.CATEGORY_WALLMAP + window.CATEGORY_DYNMAP+ window.CATEGORY_ENEMY;
    window.MASK_OBJECTS    = window.CATEGORY_PLAYER + window.CATEGORY_DYNMAP + window.CATEGORY_WALLMAP;
    window.MASK_BLOOD      = window.CATEGORY_DYNMAP + window.CATEGORY_WALLMAP;
    window.MASK_FLOOR_DETECTOR = window.CATEGORY_FLOORMAP;
    window.MASK_RAY        = window.CATEGORY_WALLMAP;
    window.MASK_ENEMY_BULLET  = window.CATEGORY_DYNMAP + window.CATEGORY_WALLMAP + window.CATEGORY_PLAYER;
  }
};

export default Constants;
