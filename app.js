

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
    Bounds = Matter.Bounds;
    

// create engine
var engine = Engine.create(),
    world = engine.world;

    engine.gravity.scale = 0

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 1000,
        height: 1000,
        showVelocity: false,

        wireframes: false,
        background: '#606060',
        hasBounds: true,
    }
});

let map = [[2,2,2,2,2,2,2,2,2,2],
		   [3,1,1,1,1,1,1,1,1,5],
		   [3,1,1,1,1,1,1,1,1,5],
		   [3,1,1,1,1,1,1,1,1,5],
		   [3,1,1,1,1,1,1,1,1,5],
		   [3,1,1,1,1,1,1,1,1,5],
		   [3,1,1,1,1,1,1,1,1,5],
		   [3,1,1,1,1,1,1,1,1,5],
		   [3,1,1,1,1,1,1,1,1,5],
		   [4,4,4,4,4,4,4,4,4,4]]
		   
let elemsToDraw = [];

init();

Composite.add(engine.world, elemsToDraw);

function init()
{
	let k = 0;
	for(let i = 0; i < 10; i++)
	{
		for(let j = 0; j < 10; j++)
		{
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
			k++;
		}
	}
}

var movingWall = Bodies.rectangle(600, 500, 30, 100, { isStatic: false ,render: { sprite: { texture: './assets/img/wall_vert.png'}}});
Composite.add(engine.world, movingWall);

var player = Bodies.rectangle(500, 500, 51, 29,  {collisionFilter: {  category: 1 }, isStatic: false , render: { sprite: { texture: './assets/img/patrick.png'}}});
Composite.add(engine.world, player);


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
        }, {x: 0.0001, y: 0})
    },
    KeyA: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: -0.0001, y: 0})
    },
    KeyS: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: 0, y: 0.0001})
    },
    KeyW: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: 0, y: -0.0001})
    },
    Space: () => {
        bullet.push(Bodies.circle(200, 100, 2, 
            { label: 'bullet', frictionAir: 0.1, strokeStyle: 'red'}));

        var lastBullet = bullet.pop();
        Composite.add(world, lastBullet);

        Matter.Body.set(lastBullet, "position", {x: player.position.x, y: player.position.y})
        Matter.Body.applyForce(lastBullet, {
            x: lastBullet.position.x,
            y: lastBullet.position.y
            }, {x: (mouse.position.x - lastBullet.position.x) * 0.00001, y: (mouse.position.y - lastBullet.position.y) * 0.00001})

        // const particlesBodies = Composite.allBodies(stack);

        // for (var i = 0; i < particlesBodies.length; i++) {
        //     var body = particlesBodies[i];

        //     Matter.Body.applyForce(body, {
        //         x: body.position.x,
        //         y: body.position.y
        //         }, {x: Common.random(-0.001, 0.001), y: Common.random(-0.001, 0.001)})
        //     }
    },
};
    
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
});

/*
// player
var player = Bodies.circle(200, 100, 40, 
    { label: 'player', frictionAir: 0.6, fillStyle: 'red', strokeStyle: 'blue',lineWidth: 3});
Composite.add(world, player);



// particles stack
var particleOptions = { 
    friction: 0.05,
    frictionStatic: 0.1,
    render: { visible: true } 
};
var particles = softBody(250, 100, 5, 5, 0, 0, true, 18, particleOptions);
Composite.add(world, particles);

var wall = Bodies.rectangle(50, 0, 800, 50, { isStatic: false });
var constraint = Constraint.create({
    pointA: { x: -100, y: -100 },
    bodyB: wall,
    pointB: { x: -10, y: -10 },
    stiffness: 0.001,
    damping: 0.1
});
Composite.add(world, [wall, constraint]);

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

// keyboard control
const keyHandlers = {

    KeyD: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: 0.02, y: 0})
    },
    KeyA: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: -0.02, y: 0})
    },
    KeyS: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: 0, y: 0.02})
    },
    KeyW: () => {
        Matter.Body.applyForce(player, {
        x: player.position.x,
        y: player.position.y
        }, {x: 0, y: -0.02})
    },
    Space: () => {
        bullet.push(Bodies.circle(200, 100, 2, 
            { label: 'bullet', frictionAir: 0.1, strokeStyle: 'red'}));

        var lastBullet = bullet.pop();
        Composite.add(world, lastBullet);

        Matter.Body.set(lastBullet, "position", {x: player.position.x, y: player.position.y})
        Matter.Body.applyForce(lastBullet, {
            x: lastBullet.position.x,
            y: lastBullet.position.y
            }, {x: (mouse.position.x - lastBullet.position.x) * 0.00001, y: (mouse.position.y - lastBullet.position.y) * 0.00001})

        // const particlesBodies = Composite.allBodies(stack);

        // for (var i = 0; i < particlesBodies.length; i++) {
        //     var body = particlesBodies[i];

        //     Matter.Body.applyForce(body, {
        //         x: body.position.x,
        //         y: body.position.y
        //         }, {x: Common.random(-0.001, 0.001), y: Common.random(-0.001, 0.001)})
        //     }
    },
};
    
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
        x: 400,
        y: 300
      })
});

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// Utils
function softBody(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
    particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
    constraintOptions = Common.extend({ stiffness: 0.8, render: { type: 'line', anchors: false } }, constraintOptions);

    var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    softBody.label = 'Soft Body';

    return softBody;
};*/