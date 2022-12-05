class Enemy {
    constructor(x, y, w, h, asset, label, world) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.asset = asset;
        this.label = label;
        this.world = world;
        this.category = CATEGORY_ENEMY;
        this.mask = MASK_ENEMY;
        this.body;
        this.lookAt = 0;
        this.gun = 0;
        this.hand;
        this.prevDir = Matter.Vector.create(1, 0);

        self = this,

        this.draw();
        //setInterval(moveThug, 50);


    };

    draw() {
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {
            label: this.label,
            collisionFilter: {  category: this.category, mask: this.mask}, 
            density: 0.05, 
            frictionAir: 0.2, 
            restitution: 0.0,
            isStatic: false , 
            render: { sprite: { texture: this.asset }}
            });
        Composite.add(this.world, this.body);
        Body.setAngle(this.body, Math.PI/2);
        this.lookAt =  Math.PI/2;

        var thisthis = this;
        setInterval(thisthis.moveRandom, 50);
    };

    moveRandom() {
        var collisionArray = [...getCollisionArray(CATEGORY_WALLMAP, this.category), 
            ...getCollisionArray(CATEGORY_DYNMAP, this.category)];

        if (collisionArray.length > 0) {

            for (var i = 0; i < collisionArray.length; i++) {
                var item = collisionArray[i]

                if (item.bodyB.label != this.label) {
                    break; 
                }

                var dir = Common.random(0,1);
                if (dir > 0.3){

                    this.prevDir = item.tangent;
                }
                else if (dir > 0.6) {
                    this.prevDir = Matter.Vector.neg(item.tangent);
                }
                else {
                    this.prevDir = Matter.Vector.neg(item.normal);
                }
            };
        }
        this.move(this.prevDir);
        this.rotate(this.prevDir);
    };

    move(dir) {
        Matter.Body.applyForce(this.body, {
            x: this.body.position.x,
            y: this.body.position.y
            }, {x: dir.x, y: dir.y})
    };

    rotate(dir) {
        angle = Math.atan2(dir.y, dir.x) + Math.PI/2; //Notice that y is first!
        Body.setAngle(this.body, angle);
        if (this.gun != 0) {
            this.gun.rotate(this.lookAt);
        }
    };
}