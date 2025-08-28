import EngineWrapper from './EngineWrapper.js';
const { Composite, Common, Bodies, Query } = (typeof Matter !== 'undefined') ? Matter : window.Matter;
import GameState from './GameState.js';
import GameOverController from './GameOverController.js';

function getWorld() { return EngineWrapper.engine.world; }

export function handleCollisonWithBulletDestruction() {
    const world = getWorld();
    var collisionArray = [...getCollisionArray(CATEGORY_DYNMAP, CATEGORY_BULLET), 
        ... getCollisionArray(CATEGORY_DYNMAP, CATEGORY_ENEMY_BULLET)];

    for(let i = 0; i < collisionArray.length; i++) {
        var body = collisionArray[i].bodyA;
        var bullet = collisionArray[i].bodyB;

        var particles = generateParticles(body, 5, 5, 4, 4);
        applyForceToParticles(particles, bullet);

        Composite.remove(world, body);
        Composite.remove(world, bullet);
    }

    var collisionArray2 = [...getCollisionArray(CATEGORY_WALLMAP, CATEGORY_BULLET),
        ... getCollisionArray(CATEGORY_WALLMAP, CATEGORY_ENEMY_BULLET)];

    for(let i = 0; i < collisionArray2.length; i++) {
        var bullet = collisionArray2[i].bodyB;
        Composite.remove(world, bullet);
    }
};

export function handleCollisonWithBulletDismemberment() {
    const world = getWorld();
    var collisionArray = [...getCollisionArray(CATEGORY_ENEMY, CATEGORY_BULLET)];

    for(let i = 0; i < collisionArray.length; i++) {
        var ennemy = collisionArray[i].bodyA;
        var bullet = collisionArray[i].bodyB;

        var bodiesElement = generateDismemberment(ennemy);
        applyForceToBodyPieces(bodiesElement, bullet);

        var bloodParticles = generateBlood(ennemy);
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

export function handleCollisonWithBulletAndPlayer() {
    const world = getWorld();
    var collisionArray = [...getCollisionArray(CATEGORY_PLAYER, CATEGORY_ENEMY_BULLET)];

    for(let i = 0; i < collisionArray.length; i++) {
        var playerBody = collisionArray[i].bodyA;
        var bullet = collisionArray[i].bodyB;

        var bodiesElement = generateDismemberment(playerBody);
        applyForceToBodyPieces(bodiesElement, bullet);

        updateFloorWithBlood(playerBody);

        if (window.player) {

            try { GameOverController.trigger(); } catch(e) { console.debug('GameOverController.trigger error', e); }
        }

        Composite.remove(world, bullet);

        setTimeout(startSlowMo, 0);
        setTimeout(stopSlowMo, 600);
    }
};

export function handleCollisonWithPickableObjects() {
    const world = getWorld();
    var collisionArray = [...getCollisionArray(CATEGORY_PLAYER, CATEGORY_OBJECTS)];

    for(let i = 0; i < collisionArray.length; i++) {
        var bodyA = collisionArray[i].bodyA;
        var bodyB = collisionArray[i].bodyB;

        var gun = (bodyA.collisionFilter.category == CATEGORY_OBJECTS) ? bodyA : bodyB;

        if (window.player && window.player.isArmed()) {
            window.player.dropGun();
        }
        if (window.player) window.player.pickGun(gun.label);
        Composite.remove(world, gun);

        if (window.help && window.help != 0) {
            window.help.remove();
            window.help = 0;
        }
        if (window.title && window.title != 0) {
            window.title.remove();
            window.title = 0;
        }
    }
};

export function updateBulletCounter() {
    if (!window.player) return;
    if (window.player.isArmed()) {
        var ammoLeft = window.player.getAmmoLeft();
        var ammoCapacity = window.player.getAmmoCapacity();
        if (window.ammo) {
            window.ammo.updatePos(window.player.body.position.x, window.player.body.position.y  + 70);
            window.ammo.edit(ammoLeft.toString() + "/" + ammoCapacity.toString());
        }
    }
    else {
        if (window.ammo) window.ammo.edit("");
    }
};

// helper: detect if player is standing on a stair tile (stairs_up texture)
// Generic helper: detect collisions with map bodies at a world position.
// options: { radius=50, mapType: 'floor'|'wall'|'dyn', matchTexture, matchTileId }
export function detectCollisionWithMapAtPosition(x, y, options = {}) {
    const { radius = 50, mapType = 'floor', matchTexture = null, matchTileId = null } = options;
    try {
        const world = getWorld();
        // If a tileId check is requested and map array exists, do a fast lookup
        if (matchTileId != null && window[mapType + 'Map'] && window[mapType + 'Map'].mapArray) {
            const col = Math.floor(x / 100);
            const row = Math.floor(y / 100);
            const mapArr = window[mapType + 'Map'].mapArray;
            if (mapArr && mapArr[row] && mapArr[row][col] === matchTileId) return true;
            return false;
        }

        // otherwise use body collision test (uses existing map bodies)
        const detector = Bodies.rectangle(x, y, radius, radius, {
            isSensor: true,
            collisionFilter: { category: CATEGORY_FLOOR_DETECTOR, mask: MASK_FLOOR_DETECTOR },
            render: { opacity: 0 }
        });
        Composite.add(world, detector);

        const bodyList = (mapType === 'floor') ? (window.floorMap && window.floorMap.bodies ? window.floorMap.bodies[0] : [])
                         : (mapType === 'wall') ? (window.wallMap && window.wallMap.bodies ? window.wallMap.bodies[0] : [])
                         : (window.DynMap && window.DynMap.bodies ? window.DynMap.bodies[1] : []);

        const collisions = Query.collides(detector, bodyList || []) || [];
        let matched = false;
        for (let i = 0; i < collisions.length; i++) {
            const col = collisions[i];
            const mapBody = col.bodyA === detector ? col.bodyB : col.bodyA;
            const tex = (mapBody && mapBody.render && mapBody.render.sprite && mapBody.render.sprite.texture) || '';
            if (matchTexture && tex.indexOf(matchTexture) !== -1) { matched = true; break; }
        }

        Composite.remove(world, detector);
        return matched;
    } catch (e) {
        return false;
    }
}

export function isPlayerOnTileId(tileId) {
    if (!window.player) return false;
    const px = window.player.body.position.x;
    const py = window.player.body.position.y;
    return detectCollisionWithMapAtPosition(px, py, { matchTileId: tileId, mapType: 'floor' });
}

export function isPlayerOnStairs() {
    if (!window.player) return false;
    const px = window.player.body.position.x;
    const py = window.player.body.position.y;
    return detectCollisionWithMapAtPosition(px, py, { matchTexture: 'stairs_up', mapType: 'floor' });
}

export default { handleCollisonWithBulletDestruction, handleCollisonWithBulletDismemberment, handleCollisonWithBulletAndPlayer, handleCollisonWithPickableObjects, updateBulletCounter };
