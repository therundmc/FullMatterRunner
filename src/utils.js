
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
   
    var particlesBig = Composites.stack(body.position.x, body.position.y, 2, 2, 0, 0, function(x, y) {
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

    var particlesLittle = Composites.stack(body.position.x, body.position.y, 4, 4, 0, 0, function(x, y) {
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

    return [...particlesBig.bodies, ...particlesLittle.bodies];
}


function generateDismemberment(body) {

    var bodiesElement = new Array();
    var imgPath = body.render.sprite.texture; 
    var imgPiecePath = "";

    for (var i = 0; i < 6; i++) {
        if (i == 0 || i == 1){
            imgPiecePath = imgPath.slice(0, imgPath.length - 4)  + "_arm" + imgPath.slice(imgPath.length - 4);
        }
        if (i == 2 || i == 3) {
            imgPiecePath = imgPath.slice(0, imgPath.length - 4)  + "_leg" + imgPath.slice(imgPath.length - 4);
        }
        if (i == 4) {
            imgPiecePath = imgPath.slice(0, imgPath.length - 4)  + "_body" + imgPath.slice(imgPath.length - 4);
        }
        if (i == 5) {
            imgPiecePath = imgPath.slice(0, imgPath.length - 4)  + "_head" + imgPath.slice(imgPath.length - 4);
        }


        console.log(imgPiecePath)
        bodiesElement.push(Bodies.rectangle(body.position.x, body.position.y, 50, 50, {
            collisionFilter: {  category: CATEGORY_PARTICLES, mask: MASK_PARTICLES},
            frictionAir: 0.1, 
            isStatic: false , 
            render: { sprite: { texture: imgPiecePath, xScale:0.9, yScale: 0.9}}
            }));
    }
    Composite.add(world, bodiesElement);

    return bodiesElement;
}


function generateBlood(body) {
    var bloodParticles = Composites.stack(body.position.x, body.position.y, 5, 5, 0, 0, function(x, y) {
        return Bodies.rectangle(x, y, 5, 5, {
            collisionFilter: {  category: CATEGORY_BLOOD, mask: MASK_BLOOD },
            frictionAir : 0.1,
            render: {
                opacity: 1,
                sprite: { texture: 'assets/img/blood.png',
                    xScale: Common.random(0.2, 1.2),
                    yScale: Common.random(0.2, 1.2) },
                }
            });
        }); 
    Composite.add(world, bloodParticles);

    return bloodParticles.bodies;
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


function applyForceToBodyPieces(pieces, bullet) {
    for (let i = 0; i < pieces.length; i++) {
        var body = pieces[i];
        Matter.Body.applyForce(body, {
            x: body.position.x,
            y: body.position.y
            }, {x: Common.random(-1, 1) * body.mass * Common.random(0.05, 0.08) , 
                y: Common.random(-1, 1) * body.mass * Common.random(0.05, 0.08)})
    }
} 


function applyForceToBloodParticles(bloodParticles) {
    for (let i = 0; i < bloodParticles.length; i++) {
        var body = bloodParticles[i];
        Matter.Body.applyForce(body, {
            x: body.position.x,
            y: body.position.y
            }, {x: Common.random(-1, 1) * body.mass * Common.random(0.01, 0.05) , 
                y: Common.random(-1, 1) * body.mass * Common.random(0.01, 0.05)})
    }
} 


function updateFloorWithBlood(body) {
    detectorBody = Bodies.rectangle(body.position.x, body.position.y, 100, 100, {
        collisionFilter: {  category: CATEGORY_FLOOR_DETECTOR, mask: MASK_FLOOR_DETECTOR },
        render: {
            opacity: 0.0
        }
    });
    Composite.add(world, detectorBody);

    var collisionArray = [...getCollisionArray(CATEGORY_FLOORMAP, CATEGORY_FLOOR_DETECTOR)]

    if (collisionArray.length > 0) {

        for (var i = 0; i < collisionArray.length; i++) {
            if (collisionArray[i].bodyA.collisionFilter.category == CATEGORY_FLOORMAP) {
                var map = collisionArray[i].bodyA;
            }
            else if (collisionArray[i].bodyB.collisionFilter.category == CATEGORY_FLOORMAP) {
                var map = collisionArray[i].bodyB;
            }
            else {
                break;
            }

            imgNumber = (i + 1) % 5;
            imgPath = '';
            imgPath = map.render.sprite.texture;
            imgFloorBloodPath = imgPath.slice(0, imgPath.length - 4)  + "_blood" + imgNumber + imgPath.slice(imgPath.length - 4);
            console.log(imgFloorBloodPath)
            map.render.sprite.texture = imgFloorBloodPath;
        }
    }

    Composite.remove(world, detectorBody);

}


function updateAnglePlayerMouse() {
    angle = Matter.Vector.angle(player.getRelativePos(cameraPadding), mouse.position);
    player.setLookAt(angle + Math.PI / 2);
}


function fts(force) {
    return force * (1 / engine.timing.timeScale);
};


function startSlowMo() {
    engine.timing.timeScale = 0.2;
};


function stopSlowMo() {
    engine.timing.timeScale = 1;
};

function findEnnemyByLabel(label) {
    for (let i = 0; i < thug.length; i++) {
        if (thug[i].body.label == label) {
            return i;
        }
    }
}