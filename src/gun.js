var coolDown = false;

class Gun {
    constructor(x, y, w, h, type, angle, world) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.type = type;
        this.world = world;
        this.lookAt = angle;
        this.body;
        this.douille = new Array;
        this.bullet = new Array;

        this.ammoLeft = 0;
        this.ammoCapacity = 0;
        this.nbBulletPerShot = 0;

        this.shootTimer = 0;
        this.FireRate = 0;
        this.recul = 0;

        this.draw();
    }

    draw() {
        switch(this.type) {
            case 1:
            case 'gun': 
                this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {
                    label: 'gun',
                    collisionFilter: {  category: 0 }, 
                    density: 0.05, 
                    frictionAir: 0.8, 
                    isStatic: false , 
                    render: { 
                        sprite: { texture: './assets/img/gun.png', xScale: 2, yScale:2 }
                        }
                    });
                Composite.add(this.world, this.body);
                Body.setAngle(this.body, this.lookAt);
                this.ammoCapacity = 13;
                this.ammoLeft = this.ammoCapacity;
                this.nbBulletPerShot = 1;
                this.FireRate = 200;
                this.recul = 1.5;
                break;

            case 2:
            case 'shotgun': 
                this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {
                    label: 'shotgun',
                    collisionFilter: {  category: 0 }, 
                    density: 0.05, 
                    frictionAir: 0.8, 
                    isStatic: false , 
                    render: { 
                        sprite: { texture: './assets/img/shotgun.png', xScale: 2, yScale:2 }
                        }
                    });
                Composite.add(this.world, this.body);
                Body.setAngle(this.body, this.lookAt);
                this.ammoCapacity = 5;
                this.ammoLeft = this.ammoCapacity;
                this.nbBulletPerShot = 5;
                this.FireRate = 1000;
                this.recul = 5;
                break;

            case 3:
            case 'rifle': 
                this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {
                    label: 'shotgun',
                    collisionFilter: {  category: 0 }, 
                    density: 0.05, 
                    frictionAir: 0.8, 
                    isStatic: false , 
                    render: { 
                        sprite: { texture: './assets/img/rifle.png', xScale: 2, yScale:2 }
                        }
                    });
                Composite.add(this.world, this.body);
                Body.setAngle(this.body, this.lookAt);
                this.ammoCapacity = 30;
                this.ammoLeft = this.ammoCapacity;
                this.nbBulletPerShot = 1;
                this.FireRate = 120;
                this.recul = 1.5;
                break;

            default:
                console.log("gun type %d unknow", this.type)
        }

    };

    shootCoolDowntimer() {
        coolDown = false;
    } 

    shoot() {
        if (coolDown || this.ammoLeft < 1) {
            return;
        }

        //gunFire.play(); 
        this.ammoLeft--;
        this.bullet = [];
        // bullet
        for (let i = 0; i < this.nbBulletPerShot; i++) {
            var dispX = (i - this.nbBulletPerShot / 2 ) * 10 * Math.cos(this.lookAt);
            var dispY = (i - this.nbBulletPerShot / 2 ) * 10 * Math.sin(this.lookAt);
            this.bullet.push(Bodies.rectangle(this.body.position.x + dispX, this.body.position.y +  dispY, 5, 10, {
                collisionFilter: {  category: CATEGORY_BULLET, mask: MASK_BULLET }, 
                density: 0.05, 
                frictionAir: 0.001, 
                isStatic: false , 
                render: { sprite: { texture: './assets/img/bullet.png', xScale:2, yScale:2 }
                }}));

            Body.setAngle(this.bullet[i], this.lookAt);

            var fx = Math.cos(this.lookAt - Math.PI/2) * 0.15;
            var fy = Math.sin(this.lookAt - Math.PI/2) * 0.15;

            Body.applyForce(this.bullet[i], {
                x: this.bullet[i].position.x,
                y: this.bullet[i].position.y
                },  {x: fx, y: fy}
            );
        }
        Composite.add(this.world, this.bullet);

        var fx = Math.cos(this.lookAt - Math.PI/2) * this.recul;
        var fy = Math.sin(this.lookAt - Math.PI/2) * this.recul;
        // recul
        Body.applyForce(this.body, {
            x: this.body.position.x,
            y: this.body.position.y
            },  {x: -fx, y: -fy}
        );

        // douille
        this.douille.push(Bodies.rectangle(this.body.position.x, this.body.position.y, 2, 4, { 
            collisionFilter: {  category: 0 }, 
            frictionAir: 0.1, 
            density: 0.1,
            render: { sprite: { texture: './assets/img/douille.png', xScale:1, yScale:1 }
        }}));

        var lastDouille = this.douille[this.douille.length-1]
        Composite.add(this.world, lastDouille);

        var fox = Math.cos(this.lookAt) * Common.random(0.01, 0.05);
        var foy = Math.sin(this.lookAt) * Common.random(0.01, 0.05);

        Body.applyForce(lastDouille, {
            x: lastDouille.position.x,
            y: lastDouille.position.y
            },  {x: fox, y: foy}
        );

        if (!coolDown) {
            setTimeout(this.shootCoolDowntimer, this.FireRate);
            coolDown = true;
        }
    }

    throw() {
        Body.applyForce(this.body, {
            x: this.body.position.x,
            y: this.body.position.y
            },  {x: 1, y: 1}
        );
    }

    reload() {
        this.ammoLeft = this.ammoCapacity;
    }

    rotate(angle) {
        this.lookAt = angle;
        Body.setAngle(this.body, this.lookAt);
    }

    getNbBullet() {
        return this.bullet.length;
    }
}