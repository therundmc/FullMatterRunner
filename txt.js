class Txt {
    constructor(text, x, y, size, color, world) {
        this.text = text; 
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.world = world;
        this.body = 0;

        this.draw();

    }

    draw() {
        this.body = Bodies.rectangle(this.x,this.y, 1, 1, {
            isStatic : true,
            collisionFilter: {  category: 0 }, 
            render:{
                text:{
                    content:this.text,
                    color:this.color,
                    size:this.size,
                    family:"joystix",
                },
            },
        });
        Composite.add(this.world, this.body);
    }

    edit(text) {
       this.body.render.text.content = text;
    }

    updatePos(x, y) {
        Body.set(this.body, "position", {x:x, y:y});
     }

    remove() {
        Composite.remove(this.world, this.body);
    }

} 