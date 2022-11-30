
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

// get windows size
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

const floorMapArray = [
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

const wallMapArray = [
    [02,02,02,02,02,02,02,02,02,02,02,02,02,02,02,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,07,00,08,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,00,00,00,00,00,00,05,00,00,00,00,00],
    [03,04,00,00,00,04,05,00,03,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,00,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,05,00,00,00,00,00],
    [03,00,00,00,00,00,00,00,03,04,00,00,00,04,04,04,04,04,05,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,00,00,00,00,05,00],
    [03,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,05,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,00,00,00,00,05,00],
    [03,00,00,00,00,00,07,00,00,00,00,00,00,00,00,00,00,00,05,00],
    [03,04,04,04,04,04,05,00,03,00,00,00,00,00,00,00,00,00,05,00],
    [03,00,00,00,00,00,07,00,03,00,00,00,00,00,00,00,00,00,05,00],
    [03,02,02,02,02,02,05,00,08,00,00,00,00,00,00,00,00,00,05,00],
    [03,00,00,00,00,00,00,00,03,02,02,02,02,02,02,02,02,02,05,00],
    [03,00,00,00,00,00,00,00,03,00,00,00,00,00,00,00,00,00,00,00],
    [04,04,04,04,04,04,04,04,04,00,00,00,00,00,00,00,00,00,00,00]
        ]

const DynMapArray = [
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,11,00,00,00,00,00,00,00,00,00,00,00],
    [00,14,09,09,09,14,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,11,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,16,15,17,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,16,15,17,00,10,00,00,00,09,09,09,00,14,14,19,00,00,00],
    [00,00,16,15,17,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,10,00,11,00,16,15,17,00,16,15,17,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,19,00,00,00,00,00,00,11,00,09,09,00,00,00,09,09,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,16,15,17,00,16,15,17,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,16,15,17,00,16,15,17,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,13,13,13,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00]
        ]

var shootTimer = true;	
var ammoLeft = 50;

var floorMap = new Map(0, 0, floorMapArray, 0, engine.world);
var wallMap = new Map(0, 0, wallMapArray, 1, engine.world);
var DynMap = new Map(0, 0, DynMapArray, 2, engine.world);

var player = new Player(400, 1750, 51, 29, './assets/img/patrick.png', engine.world);

var ammo = Bodies.rectangle(-100,-100, 1, 1, {
    isStatic : true,
    collisionFilter: {  category: 0 }, 
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

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// keyboard control
const keyDownHandlers = {
    KeyD: () => {
        player.move(1, 0);
        player.rotate(Math.PI/2, Math.PI/15);
    },
    KeyA: () => {
        player.move(-1, 0);
        player.rotate(3*Math.PI/2, Math.PI/15);
    },
    KeyS: () => {
        player.move(0, 1);
        player.rotate(Math.PI, Math.PI/15);
    },
    KeyW: () => {
        player.move(0, -1);
        player.rotate(0, Math.PI/15);
    },
    KeyR: () => {
        this.player.reload();
    },
    KeyE: () => {
        player.pickGun();
    },
    Space: () => {
        player.pickGun();
        player.shoot();
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
    Render.lookAt(render, player.body, {
        x: windowWidht,
        y: windowHeight
      })
    handleCollisonWithBulletForce(DynMap.bodies[0], player.getLastBullet());
    handleCollisonWithBulletDestruction(DynMap.bodies[1], player.getLastBullet());
    updateBulletCounter();
});

function getAnglePlayerMouse(xp,yp,xm,ym) {
    opp = ym - yp;
    adj = xm - xp;
    tan = opp / adj;
    return angle = Math.atan(tan);
}

function shoot() {

};

function stopSlowMo() {
    engine.timing.timeScale = 1;
}

function handleCollisonWithBulletForce(bodies, bullet) {
    if (bodies.length < 1 || bullet == 0) {
        return;
    }

    for (let i = 0; i < bodies.length; i++) {
        for (let j = 0; j < bodies[i].bodies.length; j++) {
            var body = bodies[i].bodies[j];
            if (Matter.Collision.collides(bullet, body) != null && body.isSleeping) {
                for (let k = 0; k < bodies[i].bodies.length; k++) {
                    var body = bodies[i].bodies[k];
                    Matter.Sleeping.set(body, false) 
                    Matter.Body.applyForce(body, {
                        x: body.position.x,
                        y: body.position.y
                        }, {x: (body.position.x - bullet.position.x) * body.mass * 0.001, 
                            y: (body.position.y - bullet.position.y) * body.mass * 0.001})
                }
            }
        }
    }
};

function handleCollisonWithBulletDestruction(body, bullet) {
    if (body.length < 1 || bullet == 0) {
        return;
    }

    for (let i = 0; i < body.length; i++) {
        var localBody = body[i];
        if (Matter.Collision.collides(bullet, localBody) != null) {
            Matter.World.remove(world, localBody);
            var particles = Composites.stack(localBody.position.x, localBody.position.y, 2, 2, 0, 0, function(x, y) {
                var pieceNumber = Math.round(Common.random(1,4));
                var imgPath = localBody.render.sprite.texture;
                var imgPiecePath =  imgPath.slice(0, imgPath.length - 4)  + "_piece" + pieceNumber + imgPath.slice(imgPath.length - 4);
                return Bodies.rectangle(x, y, 20, 30, {
                    frictionAir : 0.01,
                    render: {
                        opacity: 1,
                        // fillStyle: localBody.render.strokeStyle,   
                        // strokeStyle: 'black',  
                        // lineWidth: 2
                        sprite: { 
                            texture: imgPiecePath,
                            xScale: Common.random(0.8,1.5),
                            yScale: Common.random(0.8,1.5)},

                    }
                });
            });
            for (let k = 0; k < particles.bodies.length; k++) {
                var particle = particles.bodies[k];
                var forceMagnitude = 0.04 * particle.mass;
                Matter.Body.applyForce(particle, {
                    x: particle.position.x,
                    y: particle.position.y,
                    }, {x: Common.random(-1, 1) * fts(forceMagnitude), 
                        y: Common.random(-1, 1) * fts(forceMagnitude) });
            }
            Composite.add(world, particles);
            body.splice(i,1);
        }
    }
};

function updateBulletCounter() {
    ammoLeft = player.getAmmoLeft();
    ammoCapacity = player.getAmmoCapacity();
    Matter.Body.set(ammo, "position", {x: player.body.position.x , y: player.body.position.y  + 70})
    ammo.render.text.content = ammoLeft.toString() + " /" + ammoCapacity.toString();
} 

function fts(force) {
    return force * (1 / engine.timing.timeScale);
}