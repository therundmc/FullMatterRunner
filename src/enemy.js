class Enemy {
    constructor(x, y, w, h, asset, world) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.asset = asset;
        this.world = world;
        this.category = CATEGORY_ENEMY;
        this.mask = MASK_ENEMY;
        this.body;
        this.lookAt = 0;
        this.gun = 0;
        this.hand;

        this.prevDir = 0;

        this.draw();
    };

    draw() {
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {
            collisionFilter: {  category: this.category, mask: this.mask}, 
            density: 0.01, 
            frictionAir: 0.2, 
            restitution: 0.0,
            isStatic: false , 
            render: { sprite: { texture: this.asset }}
            });
        Composite.add(this.world, this.body);
        Body.setAngle(this.body, Math.PI/2);
        this.lookAt =  Math.PI/2;
    };

    moveRandom() {

    }
}