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
        this.hand;
        this.prevAngle = 0;

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
        Body.setAngle(this.body, Math.PI/2);
        this.lookAt =  Math.PI/2;

        var A = {x : 0 , y : 0},
            B = {x : 300 , y : 600},
            C = {x : 600 , y : 300};

        var vertices = [
            {x : A.x , y : A.y},
            {x : B.x , y : B.y},
            {x : C.x , y : C.y}
        ];

        this.fov = Bodies.fromVertices(this.body.position.x + 300, this.body.position.y+ 300, vertices, {
            collisionFilter: {  category: 0, mask: 0},
            render: { fillStyle: '#FFFFFF', opacity: 0.3 }
        });
        Body.rotate(this.fov, -Math.PI/4,  {x : this.body.position.x , y : this.body.position.y});
        Composite.add(this.world, this.fov);

        // geometry rocks !
        var a = Matter.Vector.magnitude(B);
        var b = Matter.Vector.magnitude(Matter.Vector.sub(C, B));
        var h = Math.sqrt(Math.pow(a, 2) - (Math.pow(b/2, 2)));
        var g = Math.round(2 * h / 3);

        this.constraitFov = Constraint.create({
            bodyA: this.body,
            pointA: {x : 0, y: 0},
            bodyB: this.fov,
            pointB: {x : -g, y: 0},
            stiffness: 0.8,
            damping: 0.1,
            render: {
                visible: true
            }
        });
        Composite.add(this.world, this.constraitFov);
    };

    Ai(player) {
        this.getState();

        switch(this.state) {
            case IDLE:
                this.moveRandom();
                break;
            
            case ALARM:
                this.setLookAtPlayer(player) 
                break;
        }
        this.updateFoV();
    }

    getState() {
        this.state = ALARM;

    }

    updateFoV() {
        var angle = -this.prevAngle + this.lookAt;
        Body.rotate(this.fov, angle,  {x : this.body.position.x , y : this.body.position.y});
        this.prevAngle = this.lookAt;
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
                }
                else if (dir > 0.6) {
                    this.dir = Matter.Vector.neg(item.tangent);
                }
                else {
                    this.dir = Matter.Vector.neg(item.normal);
                }
            };
        }
        this.dir.x = Math.round(this.dir.x);
        this.dir.y = Math.round(this.dir.y);

        console.log(this.body.angle);

        this.move(this.dir);
        this.setLookAt(this.dir);
    };

    setLookAt(dir) {
        Body.setAngle(this.body, Math.atan2(dir.y, dir.x) + Math.PI/2);
        this.updateFoV();
    }

    move(dir) {
        Matter.Body.applyForce(this.body, {
            x: this.body.position.x,
            y: this.body.position.y
            }, {x: dir.x, y: dir.y})
    };

    setLookAtPlayer(body) {
        this.lookAt = Matter.Vector.angle(this.body.position, body.position);
        this.rotatePolar(this.lookAt);

        var dir = Matter.Vector.create(Math.cos( this.lookAt ), Math.sin( this.lookAt ));
    };

    rotateCartesian(dir) {
        var angle = Math.atan2(dir.y, dir.x) + Math.PI/2; //Notice that y is first!
        Body.setAngle(this.body, angle);
        this.lookAt = angle;
        if (this.gun != 0) {
            this.gun.rotate(this.lookAt);
        }
    };

    rotatePolar(angle) {
        Body.setAngle(this.body, angle + Math.PI/2);
        this.lookAt = angle;
        if (this.gun != 0) {
            this.gun.rotate(this.lookAt);
        }
    };

    kill() {
        Composite.remove(this.world, this.body);
        Composite.remove(this.world, this.fov);
        Composite.remove(this.world, this.constraitFov);
    }
}