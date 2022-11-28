
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Common = Matter.Common,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Bounds = Matter.Bounds;

var windowWidht = window.innerWidth;
var windowHeight = window.innerHeight;
    

// create engine
var engine = Engine.create(),
    world = engine.world;

    engine.gravity.scale = 0

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: windowWidht,
        height: windowHeight,
        showVelocity: false,

        wireframes: false,
        background: '#606060',
        hasBounds: true,
    }
});

const floorMap = [
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,00,00,00,00,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,00,00,00,00,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,00,00,00,00,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,00,00,00,00,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,00,00,00,00,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,00,00,00,00,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,00,00,00,00,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,00,00,00,00,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,02,02,02,02,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,02,02,02,02,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,02,02,02,02,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,02,02,02,02,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,02,02,02,02,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,02,02,02,02,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,02,02,02,02,00,00],
    [00,02,02,02,02,02,01,01,01,02,02,02,02,02,02,02,02,02,00,00],
    [00,00,03,01,01,01,01,01,01,02,02,02,02,02,02,02,02,02,00,00],
    [00,00,03,01,01,01,01,01,01,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
        ]

const wallMap = [
    [02,02,02,02,02,02,02,02,02,02,02,02,02,02,02,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,07,00,08,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,11,00,00,00,00,00,05,00,00,00,00,00],
    [03,04,09,09,09,04,05,00,03,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,11,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,10,00,03,04,09,09,09,04,04,04,04,04,05,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,00,00,00,00,05,00],
    [03,00,00,00,00,00,10,00,00,00,00,00,00,00,00,00,00,00,05,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,00,00,00,00,05,00],
    [03,00,00,00,00,00,07,00,00,00,00,00,00,00,00,00,00,00,05,00],
    [03,04,04,04,04,04,05,00,03,00,00,00,00,00,00,00,00,00,05,00],
    [03,00,00,00,00,00,07,00,03,00,00,00,00,00,00,00,00,00,05,00],
    [03,02,02,02,02,02,05,00,08,00,00,00,00,00,00,00,00,00,05,00],
    [03,00,00,00,00,00,00,00,03,02,02,02,02,02,02,02,02,02,05,00],
    [03,00,00,00,00,00,00,00,03,00,00,00,00,00,00,00,00,00,00,00],
    [04,04,04,04,04,04,04,04,04,00,00,00,00,00,00,00,00,00,00,00]
        ]

const DynMap = [
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,11,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,09,09,09,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,11,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,10,00,00,00,09,09,09,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,10,00,11,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,12,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,12,11,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,12,12,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,12,12,00,00,00],
    [00,00,00,00,00,12,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,12,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,12,00,00,00,00,00,00,00,00,00,00,00,00,00,00]
        ]

var shootTimer = true;	
var ammoLeft = 50;

var floorBodies = [],
    wallsBodies = [],
    glassBodies = [],
    boxBody   = [];

initFloorMap();
initWallMap();
initDynMap();


var player = Bodies.rectangle(400, 1750, 51, 29,  {collisionFilter: {  category: 1 }, density: 0.05, frictionAir: 0.8,  isStatic: false , render: { sprite: { texture: './assets/img/patrick.png'}}});
Composite.add(engine.world, player);
Body.setAngle(player, Math.PI/2);
playerLookAt =  Math.PI/2;

var ammo = Bodies.rectangle(-100,-100, 1, 1, {
    isStatic : true,
	render:{
		fillStyle:"#C44D58",
		text:{
			content:"",
			color:"white",
			size:32,
			family:"consolas",
		},
	},
});
Composite.add(engine.world, ammo);

var bullet = [];

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// keyboard control
const keyDownHandlers = {
    KeyD: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: 1, y: 0})
        if (playerLookAt < Math.PI/2) {
            Body.rotate(player, Math.PI/15);
            playerLookAt +=  Math.PI/15;
        }
        else {
            Body.setAngle(player, Math.PI/2);
            playerLookAt =  Math.PI/2;
        }
    },
    KeyA: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: -1, y: 0})
        if (playerLookAt > -Math.PI/2) {
            Body.rotate(player, -Math.PI/15);
            playerLookAt -=  Math.PI/15;
        }
        else {
            Body.setAngle(player, -Math.PI/2);
            playerLookAt =  -Math.PI/2;
        }
    },
    KeyS: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: 0, y: 1})
        if (playerLookAt > -Math.PI) {
            Body.rotate(player, -Math.PI/15);
            playerLookAt -=  Math.PI/15;
        }
        else {
            Body.setAngle(player, -Math.PI);
            playerLookAt =  -Math.PI;
        }
    },
    KeyW: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: 0, y: -1})
        if (playerLookAt < 0) {
            Body.rotate(player, Math.PI/15);
            playerLookAt +=  Math.PI/15;
        }
        else {
            Body.setAngle(player, 0);
            playerLookAt =  0;
        }
    },
    KeyR: () => {
        ammoLeft = 50;
    },
    Space: () => {
        if (shootTimer) {
            shootTimer = false;
            setTimeout(shoot, 150);
        }
    },
    ShiftLeft: () => {
        engine.timing.timeScale = 0.2;
        setTimeout(stopSlowMo, 1000);
    },
};

const keyUpHandlers = {
    ShiftLeft: () => {
        //engine.timing.timeScale = 1;
    },
}

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

const keysUp = new Set();
const keysDown = new Set();
document.addEventListener("keydown", event => {
    keysDown.add(event.code);
    keysUp.delete(event.code);
});
document.addEventListener("keyup", event => {
    keysUp.add(event.code);
    keysDown.delete(event.code);
});

Matter.Events.on(engine, "beforeUpdate", event => {
    [...keysDown].forEach(k => {
        keyDownHandlers[k]?.();
    });
    [...keysUp].forEach(k => {
        keyUpHandlers[k]?.();
    });
    Render.lookAt(render, player, {
        x: windowWidht,
        y: windowHeight
      })
    handleCollisonWithBulletForce(glassBodies);
    handleCollisonWithBulletExplosion(boxBody);
    updateBulletCounter();
});

function initFloorMap()
{
    var k = 0;
	for(let i = 0; i < floorMap.length; i++) {
		for(let j = 0; j < floorMap[i].length; j++) {
            var type = floorMap[j][i];

            switch(type) {
                case 1:
                    floorBodies[k] = 
                    Bodies.rectangle(i*100, j*100, 100, 100,  
                    { collisionFilter: { category: 0}, 
                        isStatic: true, 
                        render: { sprite: { texture: './assets/img/ground.png'}}
                    });
                    k++;
                    break;

                case 2:
                    floorBodies[k] = 
                    Bodies.rectangle(i*100, j*100, 100, 100,  
                    { collisionFilter: { category: 0}, 
                        isStatic: true, 
                        render: { sprite: { texture: './assets/img/ground_2.png'}}
                    });
                    k++;
                    break;

            case 3:
                floorBodies[k] = 
                Bodies.rectangle(i*100, j*100, 100, 100,  
                { collisionFilter: { category: 0}, 
                    isStatic: true, 
                    render: { sprite: { texture: './assets/img/stairs_up.png'}}
                });
                k++;
                break;

            default:
                console.log("Element id: %d unknow", type);
                break;
        }
		}
	}
    Composite.add(engine.world, floorBodies);
}

function initWallMap()
{
	var k = 0;
	for(let i = 0; i < wallMap.length; i++) {
		for(let j = 0; j < wallMap[i].length; j++) {
            var type = wallMap[j][i];

            switch(type) {
                case 2:
                    wallsBodies[k] = 
                    Bodies.rectangle(i*100, j*100 + 35, 100, 30, 
                        { isStatic: true , 
                        render: { sprite: { texture: './assets/img/wall_hori.png'}}
                    });
                    k++;
                    break;

                case 3:
                    wallsBodies[k] = 
                    Bodies.rectangle(i*100 + 35, j*100, 30, 100, 
                        { isStatic: true ,
                        render: { sprite: { texture: './assets/img/wall_vert.png'}}
                    });
                    k++;
                    break;

                case 4:
                    wallsBodies[k] = 
                    Bodies.rectangle(i*100, j*100 - 35, 100, 30, 
                        { isStatic: true ,
                        render: { sprite: { texture: './assets/img/wall_hori.png'}}
                    });
                    k++;
                    break;

                case 5:
                    wallsBodies[k] = 
                    Bodies.rectangle(i*100 - 35, j*100, 30, 100, 
                        { isStatic: true ,
                        render: { sprite: { texture: './assets/img/wall_vert.png'}}
                    });
                    k++;
                    break;

                // Door Hori
                case 6:
                    wallsBodies[k] = 
                    Bodies.rectangle(i*100, j*100 - 35, 30, 100, 
                        { isStatic: false , 
                        frictionAir: 0.001, 
                        render: { sprite: { texture: './assets/img/door_hori.png'}}
                    });
                    var pivot = 
                    Constraint.create({
                        pointA: {x : wallsBodies[k].position.x - 50, y: wallsBodies[k].position.y},
                        bodyB: wallsBodies[k],
                        pointB: {x : -50, y: 0},
                        stiffness: 1,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    var groom =
                     Constraint.create({
                        pointA: {x : wallsBodies[k].position.x -50, y: wallsBodies[k].position.y - 15},
                        bodyB: wallsBodies[k],
                        pointB: {x : -50, y: -15},
                        stiffness: 0.005,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    Composite.add(engine.world, [pivot, groom]);
                    k++;
                    break;

                // Door Verti Left
                case 7:
                    wallsBodies[k] = 
                    Bodies.rectangle(i*100 - 35, j*100, 30, 95, 
                        { isStatic: false , 
                        frictionAir: 0.001, 
                        render: { sprite: { texture: './assets/img/door_vert.png'}}
                    });
                    var pivot = Constraint.create({
                        pointA: {x : wallsBodies[k].position.x, y: wallsBodies[k].position.y-50},
                        bodyB: wallsBodies[k],
                        pointB: {x : 0, y: -50},
                        stiffness: 0.05,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    var groom = Constraint.create({
                        pointA: {x : wallsBodies[k].position.x + 15, y: wallsBodies[k].position.y -50},
                        bodyB: wallsBodies[k],
                        pointB: {x : +15, y: -50},
                        stiffness: 0.0003,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    Composite.add(engine.world, [pivot, groom]);
                    k++;
                    break;

                // Door Verti Right
                case 8:
                    wallsBodies[k] = 
                    Bodies.rectangle(i*100 + 35, j*100, 30, 95, 
                        { isStatic: false , 
                        frictionAir: 0.001,
                         render: { sprite: { texture: './assets/img/door_vert.png'}}
                    });
                    var pivot = Constraint.create({
                        pointA: {x : wallsBodies[k].position.x, y: wallsBodies[k].position.y-50},
                        bodyB: wallsBodies[k],
                        pointB: {x : 0, y: -50},
                        stiffness: 0.05,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    var groom = Constraint.create({
                        pointA: {x : wallsBodies[k].position.x + 15, y: wallsBodies[k].position.y -50},
                        bodyB: wallsBodies[k],
                        pointB: {x : +15, y: -50},
                        stiffness: 0.0003,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    Composite.add(engine.world, [pivot, groom]);
                    k++;
                    break;

                default:
                    console.log("Element id: %d unknow", type);
                    break;
                    
            }
        }
    }
    Composite.add(engine.world, wallsBodies);
}

function initDynMap () {
    var k = 0;
    var l = 0;
	for(let i = 0; i < DynMap.length; i++) {
		for(let j = 0; j < DynMap[i].length; j++) {
            var type = DynMap[j][i];

            switch(type) {
                // Hori Window
                case 9:
                    glassBodies[k] = Composites.stack(i*100 - 50, j*100 - 40, 20, 3, 0, 0, function(x, y) {
                        return Bodies.rectangle(x, y, 5, 5, {
                            isSleeping : true,
                            frictionAir : 0.01,
                            render: {
                                opacity: 1,
                                fillStyle: 'white',
                                
                           }
                        });
                    });
                    k++;
                    break;

                // Verti Window Left
                case 10:
                    glassBodies[k] = Composites.stack(i*100 - 50, j*100 - 50, 3, 20, 0, 0, function(x, y) {
                        return Bodies.rectangle(x, y, 5, 5, {
                            isSleeping : true,
                            frictionAir : 0.01,
                            render: {
                                opacity: 0.8,
                                fillStyle: 'white',
                                
                            }
                        });
                    });
                    k++;
                    break;

                // Verti Window Right
                case 11:
                    glassBodies[k] = Composites.stack(i*100 + 30, j*100 - 50, 3, 20, 0, 0, function(x, y) {
                        return Bodies.rectangle(x, y, 5, 5, {
                            isSleeping : true,
                            frictionAir : 0.01,
                            render: {
                                opacity: 1,
                                fillStyle: 'white',
                                
                            }
                        });
                    });
                    k++;
                    break;

                // Box
                case 12:
                    boxBody[l] = Bodies.rectangle(i*100 + 30, j*100 - 50, 64, 64, { 
                            isStatic: false , 
                            density: 0.02, 
                            frictionAir: 0.5, 
                            render: { 
                                sprite: { texture: './assets/img/box.png'}
                                }
                            });
                    l++;
                    break;

                default:
                    console.log("Element id: %d unknow", type);
                    break;
                }
        }
    }
    Composite.add(engine.world, boxBody); 
    Composite.add(engine.world, glassBodies);       
}

function getAnglePlayerMouse(xp,yp,xm,ym) {
    opp = ym - yp;
    adj = xm - xp;
    tan = opp / adj;
    return angle = Math.atan(tan);
}

function shoot() {
    if (ammoLeft > 0) {
        ammoLeft --;
        bullet.push(Bodies.circle(200, 100, 5, 
            { label: 'bullet', frictionAir: 0.01, density: 0.1, 
             render: {
                fillStyle: 'black',
                strokeStyle: 'black',
                lineWidth: 1
           }}));
    
        var lastBullet = bullet[bullet.length - 1];
        var firsBullet = bullet[0];
    
        console.log(lastBullet.mass)
        Composite.add(world, lastBullet);
    
        if (bullet.length > 500) {
            Composite.remove(world, firsBullet);
            bullet.shift();
        }
    
        Matter.Body.set(lastBullet, "position", {x: player.position.x , y: player.position.y})
        Matter.Body.applyForce(lastBullet, {
            x: lastBullet.position.x,
            y: lastBullet.position.y
            }, {x: Math.cos(playerLookAt - Math.PI/2) * fts(0.5), y: Math. sin(playerLookAt - Math.PI/2)
             * fts(0.5)})
    }
    shootTimer = true;
};

function stopSlowMo() {
    engine.timing.timeScale = 1;
}

function handleCollisonWithBulletForce(bodies) {
    if (bullet.length < 1 || bodies.length < 1) {
        return;
    }
    var lastBullet = bullet[bullet.length - 1];

    for (let i = 0; i < bodies.length; i++) {
        for (let j = 0; j < bodies[i].bodies.length; j++) {
            var body = bodies[i].bodies[j];
            if (Matter.Collision.collides(lastBullet, body) != null && body.isSleeping) {
                for (let k = 0; k < bodies[i].bodies.length; k++) {
                    var body = bodies[i].bodies[k];
                    Matter.Sleeping.set(body, false) 
                    Matter.Body.applyForce(body, {
                        x: body.position.x,
                        y: body.position.y
                        }, {x: (body.position.x - bullet[bullet.length -1].position.x) * body.mass * 0.001, 
                            y: (body.position.y - bullet[bullet.length -1].position.y) * body.mass * 0.001})
                }
            }
        }
    }
};

function handleCollisonWithBulletExplosion(body) {
    if (bullet.length < 1 || body.length < 1) {
        return;
    }
    var lastBullet = bullet[bullet.length - 1];

    for (let i = 0; i < body.length; i++) {
        var localBody = body[i];
        if (Matter.Collision.collides(lastBullet, localBody) != null) {
            Matter.World.remove(world, localBody);
            var particles = Composites.stack(localBody.position.x, localBody.position.y, 3, 3, 0, 0, function(x, y) {
                return Bodies.rectangle(x, y, 16, 16, {
                    frictionAir : 0.05,
                    render: {
                        opacity: 1,
                        fillStyle: '#69594c',   
                        sprite: { 
                            texture: './assets/img/box_piece_1.png',
                            xScale: Common.random(1,2),
                            yScale: Common.random(1,2)},

                    }
                });
            });
            for (let k = 0; k < particles.bodies.length; k++) {
                var particle = particles.bodies[k];
                var forceMagnitude = 0.1 * particle.mass;
                Matter.Body.applyForce(particle, {
                    x: particle.position.x,
                    y: particle.position.y,
                    }, {x: Common.random(-1, 1) * forceMagnitude, 
                        y: Common.random(-1, 1) * forceMagnitude });
            }
            Composite.add(world, particles);
            body.splice(i,1);
        }
    }
};

function updateBulletCounter() {
    Matter.Body.set(ammo, "position", {x: player.position.x , y: player.position.y  + 70})
    ammo.render.text.content = ammoLeft.toString() + " /50";
} 

function fts(force) {
    return force * (1 / engine.timing.timeScale);
}