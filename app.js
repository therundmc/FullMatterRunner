
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
    Bounds = Matter.Bounds,
    Detector = Matter.Detector;


// Define collisions mask
const   CATEGORY_PLAYER     = 0b0000001,
        CATEGORY_ENEMY      = 0b0000010,
        CATEGORY_FLOORMAP   = 0b0000100,
        CATEGORY_WALLMAP    = 0b0001000,
        CATEGORY_DYNMAP     = 0b0010000,
        CATEGORY_BULLET     = 0b0100000,
        CATEGORY_PARTICLES  = 0b1000000;

const   MASK_PLAYER     = CATEGORY_DYNMAP + CATEGORY_WALLMAP + CATEGORY_PARTICLES + CATEGORY_ENEMY + CATEGORY_BULLET,    
        MASK_ENEMY      = CATEGORY_DYNMAP + CATEGORY_WALLMAP + CATEGORY_PARTICLES + CATEGORY_PLAYER + CATEGORY_BULLET,    
        MASK_FLOORMAP   = 0,
        MASK_WALLMAP    = CATEGORY_PLAYER + CATEGORY_DYNMAP + CATEGORY_BULLET + CATEGORY_PARTICLES + CATEGORY_ENEMY,
        MASK_DYNMAP     = CATEGORY_PLAYER + CATEGORY_WALLMAP + CATEGORY_BULLET + CATEGORY_PARTICLES,
        MASK_BULLET     = CATEGORY_PLAYER + CATEGORY_DYNMAP + CATEGORY_WALLMAP + CATEGORY_ENEMY + CATEGORY_PARTICLES,
        MASK_PARTICLES  = CATEGORY_PLAYER + CATEGORY_DYNMAP + CATEGORY_WALLMAP + CATEGORY_ENEMY;
        


// get windows size
var windowWidht = window.innerWidth;
var windowHeight = window.innerHeight;

var gunFire = document.getElementById('gunFire');
    

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
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,00,00,00,00,00,00],
    [00,03,03,03,03,03,01,04,01,03,03,03,03,03,00,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,00,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,00,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,00,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,00,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,00,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,00,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,04,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,00,10,01,01,01,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,00,10,01,01,01,01,01,01,00,00,00,00,00,00,00,00,00,00,00],
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
    [03,00,00,00,00,00,00,00,03,04,00,06,00,04,04,04,04,04,05,00],
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
    [00,00,00,21,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,20,00,24,00,23,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,13,00,22,00,19,00,00,11,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,09,09,09,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,11,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,16,15,17,00,00,00,00,19,00,00,00,13,00,00,00,00,00,00],
    [00,00,16,15,17,00,10,00,00,00,09,00,09,00,14,14,00,00,00,00],
    [00,00,16,15,17,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,10,00,11,00,16,15,17,00,16,15,17,00,00,00],
    [00,20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,11,00,09,09,00,00,00,09,09,00,00,00],
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

var player = new Player(400, 1750, 51, 29, './assets/img/patrick.png', CATEGORY_PLAYER, MASK_PLAYER, engine.world);

var thug = new Player(300, 1000, 51, 29, './assets/img/thug_1.png', CATEGORY_ENEMY, MASK_ENEMY, engine.world);

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
runner.delta = 1000 / 10;
Runner.run(runner, engine);

// keyboard control
const keyDownHandlers = {
    KeyD: () => {
        player.moveRight();
    },
    KeyA: () => {
        player.moveLeft();
    },
    KeyS: () => {
        player.moveDown();
    },
    KeyW: () => {
        player.moveUp();
    },
    KeyR: () => {
        this.player.reload();
    },
    KeyE: () => {
        player.pickGun('gun');
        setInterval(moveThug(), 1000);
    },
    Space: () => {
        player.pickGun('shotgun');
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

    handleCollisonWithBulletDestruction(DynMap.bodies[1], player.getLastBullet());
    updateBulletCounter();

    moveThug();

    //console.log(engine.world.bodies.length + "//" + engine.world.composites.length);
});

function getAnglePlayerMouse(xp,yp,xm,ym) {
    opp = ym - yp;
    adj = xm - xp;
    tan = opp / adj;
    return angle = Math.atan(tan);
}

function shoot() {

};

function startSlowMo() {
    engine.timing.timeScale = 0.2;
}
function stopSlowMo() {
    engine.timing.timeScale = 1;
}



function handleCollisonWithBulletDestruction() {

    var collisionArray = getCollisionArray(CATEGORY_DYNMAP, CATEGORY_BULLET);

    for(i = 0; i < collisionArray.length; i++) {

        var body = collisionArray[i].bodyA;
        var bullet = collisionArray[i].bodyB;

        particles = generateParticles(body, 5, 5, 4, 4);
        applyForceToParticles(particles, bullet);

        Composite.remove(world, body);
        Composite.remove(world, bullet);

        var triggerSlowMo = Common.random(0,10)
        if (triggerSlowMo < 1) {
            setTimeout(startSlowMo, 100);
            setTimeout(stopSlowMo, 600);
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

function moveThug() {
    thug.moveRandom();
}
