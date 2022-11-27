
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

var map = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [3,1,1,1,1,1,5,1,3,1,1,1,1,1,5],
    [3,1,1,1,1,1,5,1,3,1,1,1,1,1,5],
    [3,1,1,1,1,1,7,1,8,1,1,1,1,1,5],
    [3,1,1,1,1,1,5,1,3,1,1,1,1,1,5],
    [3,1,1,1,1,1,5,1,3,1,1,1,1,1,5],
    [3,4,4,4,6,4,5,1,3,1,1,1,1,1,5],
    [3,1,1,1,1,1,7,1,3,1,1,1,1,1,5],
    [3,1,1,1,1,1,5,1,3,1,1,1,1,1,5],
    [3,1,1,1,1,1,5,1,3,4,4,6,4,4,5],
    [3,1,1,1,1,1,5,1,3,1,1,1,1,1,5],
    [3,1,1,1,1,1,5,1,3,1,1,1,1,1,5],
    [3,1,1,1,1,1,7,1,8,1,1,1,1,1,5],
    [3,1,1,1,1,1,5,1,3,1,1,1,1,1,5],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
        ]
		   
var elemsToDraw = [];

mapInit();


var boxes = Composites.stack(1000, 50, 4, 4, 5, 5, function(x, y) {
    return Bodies.rectangle(x, y, 64, 64, { isStatic: false ,density: 0.8, frictionAir: 0.8, render: { sprite: { texture: './assets/img/box.png'}}});
});
Composite.add(engine.world, boxes);

var player = Bodies.rectangle(500, 500, 51, 29,  {collisionFilter: {  category: 1 }, density: 0.05, frictionAir: 0.8,  isStatic: false , render: { sprite: { texture: './assets/img/patrick.png'}}});
Composite.add(engine.world, player);
var playerLookAt = 0;

console.log(player.mass)


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
        bullet.push(Bodies.circle(200, 100, 2, 
            { label: 'bullet', frictionAir: 0.1, strokeStyle: 'red'}));

        var lastBullet = bullet.pop();
        Composite.add(world, lastBullet);

        var angle = getAnglePlayerMouse(player.position.x, player.position.y, mouse.position.x, mouse.position.y);

        Matter.Body.set(lastBullet, "position", {x: player.position.x , y: player.position.y})
        Matter.Body.applyForce(lastBullet, {
            x: lastBullet.position.x,
            y: lastBullet.position.y
            }, {x: (mouse.position.x - lastBullet.position.x) * 0.000001, y: (mouse.position.y - lastBullet.position.y) * 0.000001})
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
        x: 800,
        y: 600
      })
      console.log(playerLookAt);
});

function mapInit()
{
	let k = 0;
	for(let i = 0; i < map.length; i++) {
		for(let j = 0; j < map[i].length; j++) {
			if(map[j][i] == 1)	
			elemsToDraw[k] =  Bodies.rectangle(i*100, j*100, 100, 100,  {  collisionFilter: { category: 0}, isStatic: true , render: { sprite: { texture: './assets/img/ground.png'}}});
			else if(map[j][i] == 2)
				elemsToDraw[k] = Bodies.rectangle(i*100, j*100 + 35, 100, 30, { isStatic: true ,render: { sprite: { texture: './assets/img/wall_hori.png'}}});
			else if(map[j][i] == 3)
				elemsToDraw[k] = Bodies.rectangle(i*100 + 35, j*100, 30, 100, { isStatic: true ,render: { sprite: { texture: './assets/img/wall_vert.png'}}});
			else if(map[j][i] == 4)
				elemsToDraw[k] = Bodies.rectangle(i*100, j*100 - 35, 100, 30, { isStatic: true ,render: { sprite: { texture: './assets/img/wall_hori.png'}}});
			else if(map[j][i] == 5)
				elemsToDraw[k] = Bodies.rectangle(i*100 - 35, j*100, 30, 100, { isStatic: true ,render: { sprite: { texture: './assets/img/wall_vert.png'}}});

            // Bottom Left Doors
            else if(map[j][i] == 6) {
                elemsToDraw[k] = Bodies.rectangle(i*100, j*100 - 35, 30, 100, { isStatic: false , frictionAir: 0.001, render: { sprite: { texture: './assets/img/door_hori.png'}}});
                var pivot = Constraint.create({
                    pointA: {x : elemsToDraw[k].position.x - 50, y: elemsToDraw[k].position.y},
                    bodyB: elemsToDraw[k],
                    pointB: {x : -50, y: 0},
                    stiffness: 1,
                    damping: 0.1
                });
                var groom = Constraint.create({
                    pointA: {x : elemsToDraw[k].position.x -50, y: elemsToDraw[k].position.y - 15},
                    bodyB: elemsToDraw[k],
                    pointB: {x : -50, y: -15},
                    stiffness: 0.005,
                    damping: 0.1
                });
                Composite.add(engine.world, [pivot, groom]);
            }

            // Ver Doors Left
            else if(map[j][i] == 7) {
                elemsToDraw[k] = Bodies.rectangle(i*100 - 35, j*100, 30, 95, { isStatic: false , frictionAir: 0.001, render: { sprite: { texture: './assets/img/door_vert.png'}}});
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
            }

            // Ver Doors Right
            else if(map[j][i] == 8) {
                elemsToDraw[k] = Bodies.rectangle(i*100 + 35, j*100, 30, 95, { isStatic: false , frictionAir: 0.001, render: { sprite: { texture: './assets/img/door_vert.png'}}});
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
            }
			k++;
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