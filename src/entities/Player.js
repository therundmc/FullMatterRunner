const { Bodies, Body, Composite, Vector } = (typeof Matter !== 'undefined') ? Matter : window.Matter;
import GameState from '../core/GameState.js';
import Gun from './Gun.js';

export default class Player {
    constructor(x, y, w, h, asset, world) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.asset = asset;
        this.world = world;
        this.category = CATEGORY_PLAYER;
        this.mask = MASK_PLAYER;
        this.body;
        this.lookAt = 0;
        this.gun = 0;
        this.alive = true;

        this.prevDir = 0;

        this.draw();
    };

    draw() {
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {
            label: 'player',
            collisionFilter: {  category: this.category, mask: this.mask}, 
            density: 0.1, 
            frictionAir: 1, 
            isStatic: false , 
            render: { sprite: { texture: this.asset }}
            });
        Composite.add(this.world, this.body);
        Body.setAngle(this.body, Math.PI/2);
        this.lookAt =  Math.PI/2;
    };

    move(x, y) {
        if (GameState.isGameOver) return;
        Matter.Body.applyForce(this.body, {
            x: this.body.position.x,
            y: this.body.position.y
            }, {x: x, y: y})
    };

    moveRight(f = 1) { this.move(f, 0); }
    moveLeft(f = 1) { this.move(-f, 0); }
    moveUp(f = 1) { this.move(0, -f); }
    moveDown(f = 1) { this.move(0, f); }

    rotate() {
        Body.setAngle(this.body, this.lookAt);
        if (this.gun != 0) {
            this.gun.rotate(this.lookAt);
        }
    };

    setLookAt(angle) {
        this.lookAt = angle;
        this.rotate();
    }

    pickGun(gunType) {
        if (this.gun != 0) {
            return;
        }

        this.gun = new Gun(this.body.position.x, this.body.position.y, 8, 32, gunType, this.lookAt, this.body, CATEGORY_BULLET, MASK_BULLET, this.world);
    }

    dropGun() {
        if (this.gun != 0) this.gun.throw();
        this.gun = 0;
    }

    shoot() {
        if (this.gun != 0) {
            this.gun.shoot();
        }
    };

    reload() {
        if (this.gun != 0) {
            this.gun.reload();
        }
    }

    die(freezeOnly = false) {
        this.alive = false;
        if (this.gun != 0) {
            this.gun.throw();
        }
        // if freezeOnly requested, keep the body but make it static and highly damped
        if (freezeOnly && this.body) {
            try {
                Body.setStatic(this.body, true);
                this.body.frictionAir = 1.0;
                // optionally play a small visual effect by reducing opacity
                if (this.body.render && this.body.render.sprite) {
                    this.body.render.opacity = 0.6;
                }
            } catch(e) { console.debug('Player.freeze error', e); }
        } else {
            Composite.remove(this.world, this.body);
        }
    }

    getLastBullet() {
        if (this.gun != 0 && this.gun.getNbBullet() > 0) {
            return this.gun.bullet;
        }
        return new Array(0);
    }

    getAmmoLeft() {
        if (this.gun != 0) {
            return this.gun.ammoLeft;
        }
        return 0;
    }

    getAmmoCapacity() {
        if (this.gun != 0) {
            return this.gun.ammoCapacity;
        }
        return 0;
    }

    getRelativePos(padding) {
        return Matter.Vector.create(padding.x, padding.y);
    }

    isArmed() {
        return this.gun != 0;
    }
}
// end of Player module
