const IDLE = 0;
const ALARM = 1;

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
        this.fov;
        this.constraitFov;
        this.dir = Matter.Vector.create(1, 0);
        this.lookAt = 0;
        this.gun = 0;
        this.prevAngle = 0;
        this.alive = true;

        this.state = IDLE;

        this.draw();
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

        this.gun = new Gun(this.body.position.x, this.body.position.y + 20, 8, 32, 'gun', this.lookAt, this.body, CATEGORY_ENEMY_BULLET, MASK_ENEMY_BULLET, this.world);
        this.fov = new Ray(this.body, Math.PI/4, 600, this.label, this.world);
    };

    Ai(player) {
        if (!this.alive) {
            return;
        }

        switch(this.state) {
            case IDLE:
                this.getState(player);
                this.moveRandom(player)
                break;
            
            case ALARM:
                this.setLookAtPlayer(player);

                if (!this.fov.playerDetected(player)) {
                    this.pursuitPlayer(player);
                }
                else {
                    this.gun.shoot();
                    if (this.gun.ammoLeft <= 0) {
                        this.gun.reload();
                    }
                }
                break;
        }
    }

    getState(player) {
        if (this.fov.playerDetected(player)) {
            this.state = ALARM;
        }
        else {
            this.state = IDLE;
        }
    }

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
                    this.dir = item.tangent;
                } else if (dir > 0.6) {
                    this.dir = Matter.Vector.neg(item.tangent);
                } else {
                    this.dir = Matter.Vector.neg(item.normal);
                }
            }
        }
        this.move(this.dir);
    };

    setLookAt(dir) {
        this.lookAt = Math.atan2(dir.y, dir.x);
        this.rotate(this.lookAt);
    }

    move(dir) {
        Matter.Vector.normalise(dir);
        Matter.Body.applyForce(this.body, {
            x: this.body.position.x,
            y: this.body.position.y
            }, {x: dir.x, y: dir.y})

        this.setLookAt(dir);
    };

    setLookAtPlayer(player) {
        this.lookAt = Matter.Vector.angle(this.body.position, player.position);
        this.rotate(this.lookAt);
    };

    pursuitPlayer(player) {
        var stuck = this.isStuck();
        if (stuck) {
            this.dir = stuck.tangent;
        }
        else {
            this.dir.x = Math.cos(this.lookAt);
            this.dir.y = Math.sin(this.lookAt);
        }

        this.move(this.dir);
    }

    isStuck() {
        var collisionArray = [...getCollisionArray(CATEGORY_WALLMAP, this.category), 
            ...getCollisionArray(CATEGORY_DYNMAP, this.category)];

        if (collisionArray.length > 0) {
            for (var i = 0; i < collisionArray.length; i++) {
                var item = collisionArray[i]
                if (item.bodyB.label != this.label) {
                    break; 
                }
                return item;
            }
        }
        else {
            return 0;
        }
    }

    getDistance(player) {
        return Math.abs(
            Matter.Vector.magnitude(
                Matter.Vector.sub(player.position, this.body.position)));
    }

    rotate(angle) {
        this.lookAt = angle;
        Body.setAngle(this.body, this.lookAt + Math.PI/2);
        this.fov.rotate(this.lookAt, player);
        if (this.gun != 0) {
            this.gun.rotate(this.lookAt + Math.PI/2);
        }
    };

    die() {
        this.alive = false;
        this.fov.destroy();
        this.gun.throw();
        Composite.remove(this.world, this.body);
        //Composite.remove(this.world, this.hand);
    }
}