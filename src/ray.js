
class Ray {
    constructor(originBody, angle, h, label, world) {
        this.originBody = originBody;
        this.world = world;
        this.phi = angle; 
        this.h = h;
        this.label = label;
        this.category = CATEGORY_RAY;
        this.mask = MASK_RAY;
        this.ray;
        this.rayConstraint;

        this.sh = h;
        this.lookAt = 0;

        this.A = new Matter.Vector.create({x: 0, y: 0});
        this.B = new Matter.Vector.create({x: 0, y: 0});
        this.C = new Matter.Vector.create({x: 0, y: 0});

        this.triangle = new Array();
        this.triangleCenter = new Matter.Vector.create({x: 0, y: 0});

        this.#calculateTriangle();
        this.#create();
    }

    // public methods
    rotate(phi, player) {
        this.lookAt = phi;
        Body.setAngle(this.ray, this.lookAt);
        this.#detectCollision(player);
    }

    playerDetected(player) {
        if (Matter.Collision.collides(this.ray, player)) {
            this.ray.render.fillStyle = '#FF0000';
            return true;
        }
        else {
            this.ray.render.fillStyle = '#FFFFFF';
            return false;
        }
    }

    destroy() {
        Composite.remove(this.world, this.ray);
        Composite.remove(this.world, this.rayConstraint);
    }

    // private methods
    #calculateTriangle() {
        // get lenght sides of the triangle
        var a = 2 * this.h * Math.tan(this.phi/2);
        var b = this.h / Math.cos(this.phi/2);

        this.A = {x : 0 , y : 0};
        this.B = {x : this.h , y : a/2};
        this.C = {x : this.h, y : -a/2};
 
        this.triangle = [
            {x : this.A.x , y : this.A.y},
            {x : this.B.x , y : this.B.y},
            {x : this.C.x , y : this.C.y},
        ];

        this.triangleCenter = {
            x: (this.A.x + this.B.x + this.C.x ) / 3, 
            y: (this.A.y + this.B.y + this.C.y ) / 3
        };
    }

    #create() {
        this.ray = Bodies.fromVertices(
            this.originBody.position.x + this.triangleCenter.x, 
            this.originBody.position.y + this.triangleCenter.y, 
            this.triangle, {
                label: this.label,
                isSensor: true,
                collisionFilter: {  category: this.category, mask: this.mask },
                render: { fillStyle: '#FFFFFF', opacity: 0.1 }
        });
        Body.setCentre(this.ray, Matter.Vector.neg(this.triangleCenter), true);
        Composite.add(this.world, this.ray);

        this.rayConstraint = Constraint.create({
            bodyA: this.originBody,
            pointA: {x : 0, y: 0},
            bodyB: this.ray,
            pointB: {x : 0, y: 0},
            stiffness: 0.8,
            damping: 0.1,
            render: { visible: true }
        });
        Composite.add(this.world, this.rayConstraint);
    }

    #detectCollision(player) {
        var array = getCollisionArray(CATEGORY_WALLMAP, CATEGORY_RAY);

        this.destroy();
        this.h = this.sh;
        this.#calculateTriangle();
        this.#create();

        Body.setAngle(this.ray, this.lookAt);

        var distance = new Array();
        array.forEach(element => {
            if  (element.bodyB.label == this.label) {
                distance.push(this.getDistance(element.bodyA.position.x, element.bodyA.position.y, element.bodyB.position.x, element.bodyB.position.y));
            }
        });

        if (distance.length > 0) {
            this.destroy();
            this.h = distance[0];
            this.#calculateTriangle();
            this.#create();
            Body.setAngle(this.ray, this.lookAt);
        }
    }


    getDistance(x1, y1, x2, y2){
        let y = x2 - x1;
        let x = y2 - y1;
        
        return Math.sqrt(x * x + y * y);
    }
}