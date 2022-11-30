class Map {
    constructor (x, y, mapArray, type, world) {
        this.x = x;
        this.y = y;
        this.type = type
        this.world = world;
        this.mapArray = mapArray;
        this.bodies = Array.from(Array(3), () => new Array());

        this.switchDraw();
    }

    switchDraw() {
        switch (this.type) {
            case 0:
                this.drawType0();
                break;
            case 1:
                this.drawType1();
                break;
            case 2:
                this.drawType2();
                break;
            default:
                console.log("unknow type map" + this.type);
                break;
        }
    }

    // Floor Map Type
    drawType0() {
        var k = 0;
        for(let i = 0; i < this.mapArray.length; i++) {
        for(let j = 0; j < this.mapArray[i].length; j++) {
            var asset = this.mapArray[j][i];
            switch(asset) {
                case 0:
                    break;

                case 1:
                    this.bodies[0][k] = 
                    Bodies.rectangle(i*100, j*100, 100, 100,  
                    { collisionFilter: { category: 0}, 
                        isStatic: true, 
                        render: { sprite: { texture: './assets/img/ground.png'}}
                    });
                    k++;
                    break;

                case 2:
                    this.bodies[0][k] = 
                    Bodies.rectangle(i*100, j*100, 100, 100,  
                    { collisionFilter: { category: 0}, 
                        isStatic: true, 
                        render: { sprite: { texture: './assets/img/ground_2.png'}}
                    });
                    k++;
                    break;

                case 3:
                    this.bodies[0][k] = 
                    Bodies.rectangle(i*100, j*100, 100, 100,  
                    { collisionFilter: { category: 0}, 
                        isStatic: true, 
                        render: { sprite: { texture: './assets/img/stairs_up.png'}}
                    });
                    k++;
                    break;
    
                default:
                    console.log("Element id: %d unknow for map type %d", asset, this.type);
                    break;
            }
        }
        }
        Composite.add(this.world, this.bodies[0]);
    }


    // Wall Map Type
    drawType1() {
        var k = 0;
        for(let i = 0; i < this.mapArray.length; i++) {
        for(let j = 0; j < this.mapArray[i].length; j++) {
            var asset = this.mapArray[j][i];
            switch(asset) {
                case 0:
                case 1:
                    break;

                case 2:
                    this.bodies[0][k] = 
                    Bodies.rectangle(i*100, j*100 + 35, 100, 30, 
                        { isStatic: true , 
                        render: { sprite: { texture: './assets/img/wall_hori.png'}}
                    });
                    k++;
                    break;

                case 3:
                    this.bodies[0][k] = 
                    Bodies.rectangle(i*100 + 35, j*100, 30, 100, 
                        { isStatic: true ,
                        render: { sprite: { texture: './assets/img/wall_vert.png'}}
                    });
                    k++;
                    break;

                case 4:
                    this.bodies[0][k] = 
                    Bodies.rectangle(i*100, j*100 - 35, 100, 30, 
                        { isStatic: true ,
                        render: { sprite: { texture: './assets/img/wall_hori.png'}}
                    });
                    k++;
                    break;

                case 5:
                    this.bodies[0][k] = 
                    Bodies.rectangle(i*100 - 35, j*100, 30, 100, 
                        { isStatic: true ,
                        render: { sprite: { texture: './assets/img/wall_vert.png'}}
                    });
                    k++;
                    break;

                // Door Hori
                case 6:
                    this.bodies[0][k] = 
                    Bodies.rectangle(i*100, j*100 - 35, 30, 100, 
                        { isStatic: false , 
                        frictionAir: 0.001, 
                        render: { sprite: { texture: './assets/img/door_hori.png'}}
                    });
                    var pivot = 
                    Constraint.create({
                        pointA: {x : this.bodies[0][k].position.x - 50, y: this.bodies[0][k].position.y},
                        bodyB: this.bodies[0][k],
                        pointB: {x : -50, y: 0},
                        stiffness: 1,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    var groom =
                        Constraint.create({
                        pointA: {x : this.bodies[0][k].position.x -50, y: this.bodies[0][k].position.y - 15},
                        bodyB: this.bodies[0][k],
                        pointB: {x : -50, y: -15},
                        stiffness: 0.005,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    Composite.add(this.world, [pivot, groom]);
                    k++;
                    break;

                // Door Verti Left
                case 7:
                    this.bodies[0][k] = 
                    Bodies.rectangle(i*100 - 35, j*100, 30, 95, 
                        { isStatic: false , 
                        frictionAir: 0.001, 
                        render: { sprite: { texture: './assets/img/door_vert.png'}}
                    });
                    var pivot = Constraint.create({
                        pointA: {x : this.bodies[0][k].position.x, y: this.bodies[0][k].position.y-50},
                        bodyB: this.bodies[0][k],
                        pointB: {x : 0, y: -50},
                        stiffness: 0.05,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    var groom = Constraint.create({
                        pointA: {x : this.bodies[0][k].position.x + 15, y: this.bodies[0][k].position.y -50},
                        bodyB: this.bodies[0][k],
                        pointB: {x : +15, y: -50},
                        stiffness: 0.0003,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    Composite.add(this.world, [pivot, groom]);
                    k++;
                    break;

                // Door Verti Right
                case 8:
                    this.bodies[0][k] = 
                    Bodies.rectangle(i*100 + 35, j*100, 30, 95, 
                        { isStatic: false , 
                        frictionAir: 0.001,
                            render: { sprite: { texture: './assets/img/door_vert.png'}}
                    });
                    var pivot = Constraint.create({
                        pointA: {x : this.bodies[0][k].position.x, y: this.bodies[0][k].position.y-50},
                        bodyB: this.bodies[0][k],
                        pointB: {x : 0, y: -50},
                        stiffness: 0.05,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    var groom = Constraint.create({
                        pointA: {x : this.bodies[0][k].position.x + 15, y: this.bodies[0][k].position.y -50},
                        bodyB: this.bodies[0][k],
                        pointB: {x : +15, y: -50},
                        stiffness: 0.0003,
                        damping: 0.1,
                        render: {
                            visible: false
                        }
                    });
                    Composite.add(this.world, [pivot, groom]);
                    k++;
                    break;

                default:
                    console.log("Element id: %d unknow for map type %d", asset, this.type);
                    break;
                    
            }
        }
        }
        Composite.add(this.world, this.bodies[0]);
    }
    

    drawType2() {

        var k = 0;
        var l = 0;
        for(let i = 0; i < this.mapArray.length; i++) {
        for(let j = 0; j < this.mapArray[i].length; j++) {
            var asset = this.mapArray[j][i];
            switch(asset) {
                case 0:
                    break;
                // Hori Window
                case 9:
                    this.bodies[0].push(Composites.stack(i*100 - 50, j*100 - 40, 20, 3, 0, 0, function(x, y) {
                        return Bodies.rectangle(x, y, 5, 5, {
                            isSleeping : true,
                            frictionAir : 0.01,
                            render: {opacity: 1, fillStyle: 'white'}});
                            }));
                    break;
                // Verti Window Left
                case 10:
                    this.bodies[0].push(Composites.stack(i*100 - 50, j*100 - 50, 3, 20, 0, 0, function(x, y) {
                        return Bodies.rectangle(x, y, 5, 5, {
                            isSleeping : true,
                            frictionAir : 0.01,
                            render: {opacity: 1, fillStyle: 'white'}});
                            }));
                    break;
                // Verti Window Right
                case 11:
                    this.bodies[0].push(Composites.stack(i*100 + 30, j*100 - 50, 3, 20, 0, 0, function(x, y) {
                        return Bodies.rectangle(x, y, 5, 5, {
                            isSleeping : true,
                            frictionAir : 0.01,
                            render: {opacity: 1, fillStyle: 'white'}});
                            }));
                    break;
                // Box
                case 12:
                    this.bodies[1].push(Bodies.rectangle(i*100, j*100, 64, 64, { 
                            isStatic: false , 
                            density: 0.02, 
                            frictionAir: 0.5, 
                            render: { 
                                sprite: { texture: './assets/img/box.png'}
                                }
                            }));
                    break;
                // Chair Up
                case 13:
                    this.bodies[1].push(Bodies.rectangle(i*100, j*100 + 10, 70, 50, { 
                            isStatic: true , 
                            density: 0.1, 
                            frictionAir: 1, 
                            render: { 
                                sprite: { texture: './assets/img/armchair/armchair.png'}
                                }
                            }));
                    break;
                // Chair Down
                case 14:
                    this.bodies[1].push(Bodies.rectangle(i*100, j*100 + 10, 70, 50, { 
                            isStatic: true , 
                            density: 0.1, 
                            frictionAir: 1, 
                            render: { 
                                sprite: { texture: './assets/img/armchair/armchair.png'}
                                }
                            }));
                    Body.rotate(this.bodies[1][this.bodies[1].length - 1], Math.PI);
                    break;
                // Table
                case 15:
                    this.bodies[1].push(Bodies.rectangle(i*100, j*100, 98, 65, { 
                            isStatic: true , 
                            density: 0.1, 
                            frictionAir: 1, 
                            render: { 
                                strokeStyle: '#b97a56',
                                sprite: { texture: './assets/img/table/table.png'}
                                }
                            }));
                    Body.rotate(this.bodies[1][[this.bodies[1].length - 1]], Math.PI/2);
                    break;
                // Chair Right
                case 16:
                    this.bodies[1].push(Bodies.rectangle(i*100, j*100, 50, 50, { 
                            isStatic: true , 
                            density: 0.1, 
                            frictionAir: 1, 
                            render: { 
                                strokeStyle: '#b97a56',
                                sprite: { texture: './assets/img/chair/chair.png'}
                                }
                            }));
                    Body.rotate(this.bodies[1][[this.bodies[1].length - 1]], Math.PI / 2);
                    break;
                // Chair Left
                case 17:
                    this.bodies[1].push(Bodies.rectangle(i*100, j*100, 50, 50, { 
                            isStatic: true , 
                            density: 0.1, 
                            frictionAir: 1, 
                            render: { 
                                strokeStyle: '#b97a56',
                                sprite: { texture: './assets/img/chair/chair.png'}
                                }
                            }));
                    Body.rotate(this.bodies[1][[this.bodies[1].length - 1]], -Math.PI / 2);
                    break;
                // Cupboard
                case 18:
                    this.bodies[1].push(Bodies.rectangle(i*100, j*100, 100, 20, { 
                            isStatic: true , 
                            density: 0.1, 
                            frictionAir: 1, 
                            render: { 
                                strokeStyle: '#b97a56',
                                sprite: { texture: './assets/img/cupboard.png'}
                                }
                            }));
                    Body.rotate(this.bodies[1][[this.bodies[1].length - 1]], -Math.PI / 2);
                    break;
                // Plant
                case 19:
                    this.bodies[1].push(Bodies.rectangle(i*100, j*100 + 10, 65, 65, { 
                            isStatic: true , 
                            density: 0.1, 
                            frictionAir: 1, 
                            render: { 
                                sprite: { texture: './assets/img/plant/plant.png'}
                                }
                            }));
                    Body.rotate(this.bodies[1][[this.bodies[1].length - 1]], -Math.PI / 2);
                    break;

                default:
                    console.log("Element id: %d unknow for map type %d", asset, this.type);
                    break;
                }
        }
        }
        Composite.add(this.world, this.bodies[0]); 
        Composite.add(this.world, this.bodies[1]); 
    }
}