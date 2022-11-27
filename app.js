
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

var windowWidht = 1000;
var windowHeight = 1000;
    

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

var floorMap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]

var map = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [3,0,0,0,0,0,5,0,3,0,0,0,0,0,5],
    [3,0,0,0,0,0,5,0,3,0,0,0,0,0,5],
    [3,0,0,0,0,0,7,0,8,0,0,0,0,0,5],
    [3,0,0,0,0,0,5,0,3,0,0,0,0,0,5],
    [3,0,0,0,0,0,5,0,3,0,0,0,0,0,5],
    [3,4,9,9,9,4,5,0,3,0,0,0,0,0,5],
    [3,0,0,0,0,0,7,0,3,0,0,0,0,0,5],
    [3,0,0,0,0,0,5,0,3,0,0,0,0,0,5],
    [3,0,0,0,0,0,5,0,3,4,4,6,4,4,5],
    [3,0,0,0,0,0,5,0,3,0,0,0,0,0,5],
    [3,0,0,0,0,0,5,0,3,0,0,0,0,0,5],
    [3,0,0,0,0,0,7,0,8,0,0,0,0,0,5],
    [3,0,0,0,0,0,5,0,3,0,0,0,0,0,5],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
        ]
		   
initFloorMap();
initMap();

var boxes = Composites.stack(1000, 50, 4, 4, 5, 5, function(x, y) {
    return Bodies.rectangle(x, y, 64, 64, { isStatic: false ,density: 0.8, frictionAir: 0.8, render: { sprite: { texture: './assets/img/box.png'}}});
});
Composite.add(engine.world, boxes);


var player = Bodies.rectangle(500, 500, 51, 29,  {collisionFilter: {  category: 1 }, density: 0.05, frictionAir: 0.8,  isStatic: false , render: { sprite: { texture: './assets/img/patrick.png'}}});
Composite.add(engine.world, player);
var playerLookAt = 0;

var ammo = Bodies.rectangle(-100,-100, 1, 1, {
    isStatic : true,
	render:{
		fillStyle:"#C44D58",
		text:{
			content:"300 / 300",
			color:"white",
			size:100,
			family:"Papyrus",
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
const keyHandlers = {
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
    Space: () => {
        bullet.push(Bodies.circle(200, 100, 3, 
            { label: 'bullet', frictionAir: 0.001, dentisy: 0.1, 
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

        var angle = getAnglePlayerMouse(player.position.x, player.position.y, mouse.position.x, mouse.position.y);

        Matter.Body.set(lastBullet, "position", {x: player.position.x , y: player.position.y})
        Matter.Body.applyForce(lastBullet, {
            x: lastBullet.position.x,
            y: lastBullet.position.y
            }, {x: Math.cos(playerLookAt - Math.PI/2) * 0.002, y: Math. sin(playerLookAt - Math.PI/2) * 0.002})
    },
};

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
    
const keysDown = new Set();
document.addEventListener("keydown", event => {
    keysDown.add(event.code);
});
document.addEventListener("keyup", event => {
    keysDown.delete(event.code);
});

Matter.Events.on(engine, "beforeUpdate", event => {
    [...keysDown].forEach(k => {
        keyHandlers[k]?.();
    });
    Render.lookAt(render, player, {
        x: windowWidht,
        y: windowHeight
      })

    // var lastBullet = bullet[bullet.length - 1];
    // if (Matter.Collision.collides(player, lastBullet) != null) {
    //     console.log("collision");
    // }
});

Matter.Events.on(engine, 'glassCollision', function(event) {
    var pairs = event.pairs;

    console.log(pairs)


});

function initFloorMap()
{
    var elemsToDraw = [];
    var k = 0;
	for(let i = 0; i < floorMap.length; i++) {
		for(let j = 0; j < floorMap[i].length; j++) {
            var type = floorMap[j][i];

            switch(type) {
                case 1:
                    elemsToDraw[k] = 
                    Bodies.rectangle(i*100, j*100, 100, 100,  
                    { collisionFilter: { category: 0}, 
                        isStatic: true, 
                        render: { sprite: { texture: './assets/img/ground.png'}}
                    });
                    k++;
                    break;

                default:
                    console.log("Element id: %d unknow", type);
                    break;
            }
		}
	}
    Composite.add(engine.world, elemsToDraw);
}

function initMap()
{
    var elemsToDraw = [];
	var k = 0;
	for(let i = 0; i < map.length; i++) {
		for(let j = 0; j < map[i].length; j++) {
            var type = map[j][i];

            switch(type) {
                case 2:
                    elemsToDraw[k] = 
                    Bodies.rectangle(i*100, j*100 + 35, 100, 30, 
                        { isStatic: true , 
                        render: { sprite: { texture: './assets/img/wall_hori.png'}}
                    });
                    k++;
                    break;

                case 3:
                    elemsToDraw[k] = 
                    Bodies.rectangle(i*100 + 35, j*100, 30, 100, 
                        { isStatic: true ,
                        render: { sprite: { texture: './assets/img/wall_vert.png'}}
                    });
                    k++;
                    break;

                case 4:
                    elemsToDraw[k] = 
                    Bodies.rectangle(i*100, j*100 - 35, 100, 30, 
                        { isStatic: true ,
                        render: { sprite: { texture: './assets/img/wall_hori.png'}}
                    });
                    k++;
                    break;

                case 5:
                    elemsToDraw[k] = 
                    Bodies.rectangle(i*100 - 35, j*100, 30, 100, 
                        { isStatic: true ,
                        render: { sprite: { texture: './assets/img/wall_vert.png'}}
                    });
                    k++;
                    break;

                // Door Hori
                case 6:
                    elemsToDraw[k] = 
                    Bodies.rectangle(i*100, j*100 - 35, 30, 100, 
                        { isStatic: false , 
                        frictionAir: 0.001, 
                        render: { sprite: { texture: './assets/img/door_hori.png'}}
                    });
                    var pivot = 
                    Constraint.create({
                        pointA: {x : elemsToDraw[k].position.x - 50, y: elemsToDraw[k].position.y},
                        bodyB: elemsToDraw[k],
                        pointB: {x : -50, y: 0},
                        stiffness: 1,
                        damping: 0.1
                    });
                    var groom =
                     Constraint.create({
                        pointA: {x : elemsToDraw[k].position.x -50, y: elemsToDraw[k].position.y - 15},
                        bodyB: elemsToDraw[k],
                        pointB: {x : -50, y: -15},
                        stiffness: 0.005,
                        damping: 0.1
                    });
                    Composite.add(engine.world, [pivot, groom]);
                    k++;
                    break;

                // Door Verti Left
                case 7:
                    elemsToDraw[k] = 
                    Bodies.rectangle(i*100 - 35, j*100, 30, 95, 
                        { isStatic: false , 
                        frictionAir: 0.001, 
                        render: { sprite: { texture: './assets/img/door_vert.png'}}
                    });
                    var pivot = Constraint.create({
                        pointA: {x : elemsToDraw[k].position.x, y: elemsToDraw[k].position.y-50},
                        bodyB: elemsToDraw[k],
                        pointB: {x : 0, y: -50},
                        stiffness: 0.05,
                        damping: 0.1
                    });
                    var groom = Constraint.create({
                        pointA: {x : elemsToDraw[k].position.x + 15, y: elemsToDraw[k].position.y -50},
                        bodyB: elemsToDraw[k],
                        pointB: {x : +15, y: -50},
                        stiffness: 0.0003,
                        damping: 0.1,
                    });
                    Composite.add(engine.world, [pivot, groom]);
                    k++;
                    break;

                // Door Verti Right
                case 8:
                    elemsToDraw[k] = 
                    Bodies.rectangle(i*100 + 35, j*100, 30, 95, 
                        { isStatic: false , 
                        frictionAir: 0.001,
                         render: { sprite: { texture: './assets/img/door_vert.png'}}
                    });
                    var pivot = Constraint.create({
                        pointA: {x : elemsToDraw[k].position.x, y: elemsToDraw[k].position.y-50},
                        bodyB: elemsToDraw[k],
                        pointB: {x : 0, y: -50},
                        stiffness: 0.05,
                        damping: 0.1
                    });
                    var groom = Constraint.create({
                        pointA: {x : elemsToDraw[k].position.x + 15, y: elemsToDraw[k].position.y -50},
                        bodyB: elemsToDraw[k],
                        pointB: {x : +15, y: -50},
                        stiffness: 0.0003,
                        damping: 0.1,
                    });
                    Composite.add(engine.world, [pivot, groom]);
                    k++;
                    break;

                // Window
                case 9:
                    elemsToDraw[k] = Composites.stack(i*100 - 50, j*100 - 40, 20, 2, 0, 0, function(x, y) {
                        return Bodies.rectangle(x, y, 5, 5, {
                            isSleeping : true,
                            frictionAir : 0.01,
                            render: {
                                fillStyle: 'white',
                                strokeStyle: 'black',
                                lineWidth: 2
                           }
                        });
                    });
                    k++;
                    break;

                default:
                    console.log("Element id: %d unknow", type);
                    break;
                    
            }
        }
    }
    Composite.add(engine.world, elemsToDraw);
}

function getAnglePlayerMouse(xp,yp,xm,ym) {
    opp = ym - yp;
    adj = xm - xp;
    tan = opp / adj;
    return angle = Math.atan(tan);
}