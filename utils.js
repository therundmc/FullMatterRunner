function getCollisionArray(categoryA, categoryB) {
    var bodiesA = getAllBodiesFilterdByCategory(categoryA);
    var bodiesB = getAllBodiesFilterdByCategory(categoryB);
    var bodiesAB = [...bodiesA, ...bodiesB];

    var detector = Detector.create();
    Detector.setBodies(detector, bodiesAB);
    var collisionArray = Detector.collisions(detector);

    return collisionArray;
}

function getAllBodiesFilterdByCategory(category){
    var bodies = Composite.allBodies(world);
    var bodiesFiltered = new Array;

    if (bodies.length < 1) {
        return;
    }

    for (let i = 0; i < bodies.length; i++){
        if (bodies[i].collisionFilter.category == category){
            bodiesFiltered.push(bodies[i]);
        }
    }
    return bodiesFiltered;
}

function generateParticles(body, w, h, col, row) {

    if (body.render.sprite.texture) {
        var pieceNumber = Math.round(Common.random(1,4));
        var imgPath = body.render.sprite.texture;
        var imgPiecePath =  imgPath.slice(0, imgPath.length - 4)  + "_piece" + pieceNumber + imgPath.slice(imgPath.length - 4);
    }
    else {
        var imgPiecePath = 0;
    }
   
    var particlesBig = Composites.stack(body.position.x, body.position.y, 2, 1, 0, 0, function(x, y) {
    return Bodies.rectangle(x, y, 20, 20, {
        collisionFilter: {  category: CATEGORY_PARTICLES, mask: MASK_PARTICLES},
        frictionAir : 0.02,
        render: {
            opacity: 1,
            sprite: { texture: imgPiecePath,
                xScale: Common.random(0.5,1.2),
                yScale: Common.random(0.5,1.2)},
            }
        });
    });
    Composite.add(world, particlesBig);

    var particlesLittle = Composites.stack(body.position.x, body.position.y, 6, 6, 0, 0, function(x, y) {
        return Bodies.rectangle(x, y, 5, 5, {
            collisionFilter: {  category: CATEGORY_PARTICLES, mask: MASK_PARTICLES},
            frictionAir : 0.01,
            render: {
                opacity: 1,
                sprite: { texture: imgPiecePath,
                    xScale: Common.random(0.05,0.3),
                    yScale: Common.random(0.05,0.3)},
                }
            });
        }); 
    Composite.add(world, particlesLittle);

    var particles = [...particlesBig.bodies, ...particlesLittle.bodies];
    return particles;
}

function applyForceToParticles(particles, bullet) {
    for (let i = 0; i < particles.length; i++) {
        var body = particles[i];
        Matter.Body.applyForce(body, {
            x: body.position.x,
            y: body.position.y
            }, {x: (body.position.x - bullet.position.x) * body.mass * Common.random(0.0003, 0.0008) , 
                y: (body.position.y - bullet.position.y) * body.mass * Common.random(0.0003, 0.0008)})
    }

} 