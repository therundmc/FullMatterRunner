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
        this.bullet = 0;

        this.ammoLeft = 0;
        this.ammoCapacity = 0;

        this.shootTimer = 0;

        this.draw();
    }

    draw() {
        switch(this.type) {
            case 'gun': 
                this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {
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
                this.ammoLeft = 13;
                break;

            default:
                console.log("gun type %d unknow", this.type)
        }

    };

    shoot() {
        if (this.ammoLeft <= 0 || this.shootTimer > 0) {
            this.shootTimer--;
            return;
        }
        this.shootTimer = 50;
        this.ammoLeft--;

        // bulletdd
        this.bullet = Bodies.rectangle(this.body.position.x, this.body.position.y, 5, 10, {
            collisionFilter: {  category: 1 }, 
            density: 0.05, 
            frictionAir: 0.001, 
            isStatic: false , 
            render: {fillStyle: 'black',strokeStyle: 'black',lineWidth: 1}
            });
        Composite.add(this.world, this.bullet);

        var fx = Math.cos(this.lookAt - Math.PI/2) * 0.1;
        var fy = Math.sin(this.lookAt - Math.PI/2) * 0.1;

        Body.applyForce(this.bullet, {
            x: this.bullet.position.x,
            y: this.bullet.position.y
            },  {x: fx, y: fy}
        );

        // douille
        this.douille.push(Bodies.rectangle(this.body.position.x, this.body.position.y, 2, 4, { 
            collisionFilter: {  category: 0 }, 
            frictionAir: 0.1, 
            density: 0.1,
                render: {fillStyle: 'black',strokeStyle: 'black',lineWidth: 1}
        }));

        var lastDouille = this.douille[this.douille.length-1]
        Composite.add(this.world, lastDouille);

        var fox = Math.cos(this.lookAt) * Common.random(0.01, 0.05);
        var foy = Math.sin(this.lookAt) * Common.random(0.01, 0.05);

        Body.applyForce(lastDouille, {
            x: lastDouille.position.x,
            y: lastDouille.position.y
            },  {x: fox, y: foy}
        );
    }

    reload() {
        this.ammoLeft = this.ammoCapacity;
    }

    rotate(angle) {
        this.lookAt = angle;
        Body.setAngle(this.body, this.lookAt);
    }

    getLastBullet() {
        if (this.bullet !=0){
            return this.bullet;
        }
        else {
            return 0;
        }
    }
}