
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
        CATEGORY_PLAYER             = 0b000000000001,
        CATEGORY_ENEMY              = 0b000000000010,
        CATEGORY_FLOORMAP           = 0b000000000100,
        CATEGORY_WALLMAP            = 0b000000001000,
        CATEGORY_DYNMAP             = 0b000000010000,
        CATEGORY_BULLET             = 0b000000100000,
        CATEGORY_PARTICLES          = 0b000001000000,
        CATEGORY_OBJECTS            = 0b000010000000,
        CATEGORY_BLOOD              = 0b000100000000,
        CATEGORY_FLOOR_DETECTOR     = 0b001000000000,
        CATEGORY_RAY                = 0b010000000000,
        CATEGORY_ENEMY_BULLET       = 0b100000000000;

const   MASK_PLAYER     = CATEGORY_DYNMAP + CATEGORY_WALLMAP + CATEGORY_PARTICLES + CATEGORY_ENEMY + CATEGORY_BULLET + CATEGORY_OBJECTS + CATEGORY_ENEMY_BULLET,    
        MASK_ENEMY      = CATEGORY_DYNMAP + CATEGORY_WALLMAP + CATEGORY_PARTICLES + CATEGORY_PLAYER + CATEGORY_BULLET,    
        MASK_FLOORMAP   = CATEGORY_FLOOR_DETECTOR,
        MASK_WALLMAP    = CATEGORY_PLAYER + CATEGORY_DYNMAP + CATEGORY_BULLET + CATEGORY_PARTICLES + CATEGORY_ENEMY + CATEGORY_OBJECTS + CATEGORY_BLOOD + CATEGORY_RAY + CATEGORY_ENEMY_BULLET,
        MASK_DYNMAP     = CATEGORY_PLAYER + CATEGORY_WALLMAP + CATEGORY_BULLET + CATEGORY_PARTICLES + CATEGORY_ENEMY + CATEGORY_OBJECTS + CATEGORY_BLOOD + CATEGORY_ENEMY_BULLET,
        MASK_BULLET     = CATEGORY_PLAYER + CATEGORY_DYNMAP + CATEGORY_WALLMAP + CATEGORY_ENEMY + CATEGORY_PARTICLES,
        MASK_PARTICLES  = CATEGORY_PLAYER + CATEGORY_WALLMAP + CATEGORY_DYNMAP+ CATEGORY_ENEMY,
        MASK_OBJECTS    = CATEGORY_PLAYER + CATEGORY_DYNMAP + CATEGORY_WALLMAP,
        MASK_BLOOD      = CATEGORY_DYNMAP + CATEGORY_WALLMAP,
        MASK_FLOOR_DETECTOR = CATEGORY_FLOORMAP,
        MASK_RAY        = CATEGORY_WALLMAP,
        MASK_ENEMY_BULLET  = CATEGORY_DYNMAP + CATEGORY_WALLMAP + CATEGORY_PLAYER;


// get windows size
var windowWidht = window.innerWidth;
var windowHeight = window.innerHeight;

const cameraPadding = Matter.Vector.create(windowWidht*0.5, windowHeight*0.5); 

var gunFire = document.getElementById('gunFire');
    
// create engine
var engine = Engine.create(),
    world = engine.world;

    engine.gravity.scale = 0
    engine.timing.isFixed = false

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
        showDebug: true,
    },
});

const floorMapArray = [
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,01,01,01,01,10],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,01,01,01,01,10],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,01,01,01,01,10],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,00,00,00,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,03,03,03,03,03,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,10,01,01,01,01,01,01,01,03,03,03,03,03,03,03,03,03,00,00],
    [00,10,01,01,01,01,01,01,01,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
        ]

const wallMapArray = [
    [02,02,02,02,02,02,02,02,02,02,02,02,02,02,02,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,03,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,03,02,02,02,02,03],
    [03,00,00,00,00,00,07,00,08,00,00,00,00,00,03,00,00,00,00,03],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,08,00,00,00,00,03],
    [03,00,00,00,00,00,05,00,00,00,00,00,00,00,03,02,02,02,02,03],
    [03,04,00,00,00,04,05,00,03,00,00,00,00,00,03,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,00,00,00,00,00,00,03,00,00,00,00,00],
    [03,00,00,00,00,00,05,00,03,00,00,00,00,00,03,00,00,00,00,00],
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
    [00,20,51,24,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,13,00,22,00,19,00,00,11,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,09,09,09,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,11,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,16,15,17,00,00,00,00,19,00,00,00,13,52,00,00,00,00,00],
    [00,00,16,15,17,00,10,00,00,00,09,00,09,00,14,14,00,00,00,00],
    [00,00,16,15,17,00,00,00,00,00,00,28,00,00,00,28,00,00,00,00],
    [00,00,00,00,00,00,10,00,11,00,00,26,00,00,16,24,17,00,00,00],
    [00,20,00,00,00,00,00,00,00,00,00,27,00,00,00,27,00,00,00,00],
    [00,00,00,00,00,00,00,00,11,00,09,09,00,00,00,09,09,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,29,00,50,00,00,00,00,00,00,16,25,17,00,16,25,17,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,16,25,17,00,16,25,17,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,13,13,13,00,00,00,00,00,00,00,00,00,00,00,00],
    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00]
        ]

// Map Class var
var floorMap    = new Map(0, 0, floorMapArray, 0, engine.world),
    wallMap     = new Map(0, 0, wallMapArray, 1, engine.world),
    DynMap      = new Map(0, 0, DynMapArray, 2, engine.world);

// Player Class var
var player  = new Player(400, 1750, 51, 29, './assets/img/patrick.png', engine.world);

// Ennemy Class var
var thug = new Array();
thug.push(new Enemy(300, 700, 51, 29, './assets/img/thug/thug.png', 1, engine.world));
// thug.push(new Enemy(200, 200, 51, 29, './assets/img/thug/thug.png', 2,engine.world));
// thug.push(new Enemy(1000, 1000, 51, 29, './assets/img/thug/thug.png', 3, engine.world));

thug.push(new Enemy(800, 500, 51, 29, './assets/img/thug/thug.png', 4, engine.world));

thug.push(new Enemy(1200, 200, 80, 80, './assets/img/thug/thug.png', 6, engine.world));
thug.push(new Enemy(1000, 450, 80, 80, './assets/img/thug/thug.png', 7, engine.world));

// Text Class var
var help    = new Txt("Press 'E' to pick a gun", 300, 1570, 24, "white", world),
    ammo    = new Txt(" ", 0, 0, 24, "white", world),
    title   = new Txt("- FULL MATTER RUNNER -", 400, 2000, 46, "white", world);

// add mouse control
var mouse = Mouse.create(document.body);

setInterval(moveThug, 50);

Render.run(render);

// create runner
var runner = Runner.create({
    isFixed: true, 
    delta: 1000 / 60,
});
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
        player.reload();
    },
    KeyE: () => {
        handleCollisonWithPickableObjects();
    },
    Space: () => {
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

const keysUp = new Set();
const keysDown = new Set();
const mouseClick = new Set();
document.addEventListener("keydown", event => {
    keysDown.add(event.code);
    keysUp.delete(event.code);
});
document.addEventListener("keyup", event => {
    keysUp.add(event.code);
    keysDown.delete(event.code);
});
document.addEventListener('click', event => {
    player.shoot();
});

Matter.Events.on(engine, "beforeUpdate", event => {
    [...keysDown].forEach(k => {
        keyDownHandlers[k]?.();
    });
    [...keysUp].forEach(k => {
        keyUpHandlers[k]?.();
    });
    Render.lookAt(render, player.body, {
        x: cameraPadding.x,
        y: cameraPadding.y,
      })

    handleCollisonWithBulletDestruction();
    handleCollisonWithBulletDismemberment();
    updateBulletCounter();
    updateAnglePlayerMouse();
});

function handleCollisonWithBulletDestruction() {

    var collisionArray = [...getCollisionArray(CATEGORY_DYNMAP, CATEGORY_BULLET), 
        ... getCollisionArray(CATEGORY_DYNMAP, CATEGORY_ENEMY_BULLET)];

    for(i = 0; i < collisionArray.length; i++) {

        var body = collisionArray[i].bodyA;
        var bullet = collisionArray[i].bodyB;

        particles = generateParticles(body, 5, 5, 4, 4);
        applyForceToParticles(particles, bullet);

        Composite.remove(world, body);
        Composite.remove(world, bullet);
    }

    var collisionArray = [...getCollisionArray(CATEGORY_WALLMAP, CATEGORY_BULLET),
        ... getCollisionArray(CATEGORY_WALLMAP, CATEGORY_ENEMY_BULLET)];

    for(i = 0; i < collisionArray.length; i++) {

        var body = collisionArray[i].bodyA;
        var bullet = collisionArray[i].bodyB;

        Composite.remove(world, bullet);
    }
};


function handleCollisonWithBulletDismemberment() {

    var collisionArray = [...getCollisionArray(CATEGORY_ENEMY, CATEGORY_BULLET)];

    for(i = 0; i < collisionArray.length; i++) {

        var ennemy = collisionArray[i].bodyA;
        var bullet = collisionArray[i].bodyB;

        bodiesElement = generateDismemberment(ennemy);
        applyForceToBodyPieces(bodiesElement, bullet);

        bloodParticles = generateBlood(ennemy);
        applyForceToBloodParticles(bloodParticles);

        updateFloorWithBlood(ennemy);

        thug[findEnnemyByLabel(ennemy.label)].die();
        Composite.remove(world, bullet);

        var triggerSlowMo = Common.random(0,1)
        if (triggerSlowMo < 0.2) {
            setTimeout(startSlowMo, 0);
            setTimeout(stopSlowMo, 600);
        } 
    }
};

function handleCollisonWithPickableObjects() {

    var collisionArray = [...getCollisionArray(CATEGORY_PLAYER, CATEGORY_OBJECTS)];

    for(i = 0; i < collisionArray.length; i++) {

        var bodyA = collisionArray[i].bodyA;
        var bodyB = collisionArray[i].bodyB;

        if (bodyA.collisionFilter.category == CATEGORY_OBJECTS) {
            var gun = bodyA;
        }
        else {
            var gun = bodyB;
        }

        if (player.isArmed()) {
            player.dropGun();
        }
            
        player.pickGun(gun.label);
        Composite.remove(world, gun);

        if (help != 0) {
            help.remove();
            help = 0;
        }
        if (title != 0) {
            title.remove();
            title = 0;
        }
    }
};

// to be move to gun class
function updateBulletCounter() {
    if (player.isArmed()) {
        var ammoLeft = player.getAmmoLeft();
        var ammoCapacity = player.getAmmoCapacity();

        ammo.updatePos(player.body.position.x, player.body.position.y  + 70);
        ammo.edit(ammoLeft.toString() + "/" + ammoCapacity.toString());
    }
    else {
        ammo.edit("");
    }

};

function moveThug() {
    thug.forEach(item => {
        item.Ai(player.body);
    })
};
