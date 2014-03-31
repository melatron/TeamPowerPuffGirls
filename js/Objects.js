//Main Object class hae size and position and draw method (undefined)
Object = Class.extend({
    init: function (x, y, width, height, name) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    },
    getPosition: function () {
        var that = this;
        return {
            x: that.x,
            y: that.y,
        };
    },
    getSize: function () {
        var that = this;
        return {
            width: that.width,
            height: that.height,
        };
    },
    drawObj: function (canvas) {
        var c = canvas.getContext("2d");
    }
});

//
MovableObject = Object.extend({
    init: function (x, y, width, height, name) {
        this._super(x, y, width, height, name);
        this.sprite = {
            width: null,
            height: null,
            image: null,
            frames: null,
        };
    },
    drawSprite: function (sprite) {
        sprite.context.drawImage (
            sprite.image,
            frameCounter * (sprite.width / sprite.frames),
            0,
            sprite.width / sprite.frames,
            sprite.height,
            this.destinationX,
            characterY,
            sprite.width / sprite.frames,
            sprite.height
        );
        frameCounter++;

        if (frameCounter >= s.frames) {
            frameCounter = 0;
        }
    },
    move: function (direction, coordinate) {
        switch (direction) {
            case "up":

                break;
            case "right":

                break;
            case "down":

                break;
            case "left":

                break;
            default:
                break;

        }
    },
    moveHorizontal: function (x) {
        if (x > 0 && x < canvasWidth) { // WE have to put the canvasWidth 
            if (this.x < x) {
                this.move("right", x);
            }
            else if (this.x > x) {
                this.move("left", x);
            }
        }
    },
    moveVertical: function (y) {
        if (y > 0 && y < canvasheight) { // WE have to put the canvasWidth 
            if (this.y < y) {
                this.move("down", y);
            }
            else if (this.y > y) {
                this.move("up", x);
            }
        }
    },
    moveByDestination: function (destinationX, destinationY, roadY) {
        if (this.y == roadY) {  // checks if the hero position is on the road
            this.moveHorizontal(destinationX);
            this.moveVertical(destinationY);
        }
        else {
            this.moveVertical(roadY);
            this.moveHorizontal(destinationX);
            this.moveVertical(destinationY);
        }
    }

});

//Interactable object to do
InteractableObject = Object.extend({
    init: function (x, y, width, height, name) {
        this._super(x, y, width, height, name);
    },
});

//
ClickPoint = InteractableObject.extend({
    init: function (x, y, width, height, name) {
        this._super(x, y, width, height, name);
        this.isClicked = false;
    },
    checkIfClicked: function (mouseX, mouseY) {
        console.log(mouseX + " " + mouseY);
        // if x between this x and this.x + this.width AND if y between this.y and this.y+this.height
        if ((mouseX > this.x && mouseX < (this.x + this.width)) && (mouseY > this.y && mouseY < (this.y + this.height))) {
            console.log("hello");
            return true;
        }
    },
    drawObj: function (canvas) {
        var c = canvas.getContext("2d");
        c.fillRect(this.x, this.y, this.width, this.height);//testing
    },


});

Heroes = MovableObject.extend({
    init: function (x,y,width,height,name) {
        this._super(x, y, width, height, name);
    },
    
});


