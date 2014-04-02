var ctx,
    cavnas;
//Main Object class has size and position and draw method (undefined)
GameObject = Class.extend({
    init: function (x, y, width, height, name, image) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.image = image;
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
    speechBubbles: function (w, h, radius, text) {
        // Drawing the bubble >>>
        var x = this.x,
            y = this.y,
            r = x + w,
            b = y + h;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.lineWidth = "3";
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + radius / 2, y - 10);
        ctx.lineTo(x + radius * 2, y);
        ctx.lineTo(r - radius, y);
        ctx.quadraticCurveTo(r, y, r, y + radius);
        ctx.lineTo(r, y + h - radius);
        ctx.quadraticCurveTo(r, b, r - radius, b);
        ctx.lineTo(x + radius, b);
        ctx.quadraticCurveTo(x, b, x, b - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.restore();
        // Drawing the text inside the bubble >>>
        ctx.fillStyle = "black";
        ctx.font = "12px Georgia";
        
        for (var i = 0; i < text.length; i++) {
            ctx.fillText(text[i], this.x + 15, this.y + radius + (i * 20), w - radius);
        }
        
        // Drawing the image that speaks the quote >>>
        //ctx.drawImage(img, x, y, width, height);
            
    }
});

//
MovableObject = GameObject.extend({
    init: function (x, y, width, height, name,spriteUp, spriteDown, spriteLeft, spriteRight, spriteIdle, image) {
        this._super(x, y, width, height, name, image);
        this.speed = 2;
        this.spriteUp = spriteUp;
        this.spriteDown = spriteDown;
        this.spriteLeft = spriteLeft;
        this.spriteRight = spriteRight;
        this.spriteIdle = spriteIdle;
        this.frameCounter = 0;
    },
    drawSprite: function (sprite) {
        var img = new Image();
        img.src = sprite.image;
        ctx.drawImage(
            img,
            this.frameCounter * (sprite.width / sprite.frames),
            0,
            sprite.width / sprite.frames,
            sprite.height,
            this.x,
            this.y,
            sprite.width / sprite.frames,
            sprite.height
        );
        this.frameCounter++;

        if (this.frameCounter >= sprite.frames) {
            this.frameCounter = 0;
        }
    },
    moveVertical: function (y) {
        if (this.y < y) {
            this.drawSprite(this.spriteDown);
            this.y += this.speed;
        }
        else if (this.y > y) {
            this.drawSprite(this.spriteUp);
            this.y -= this.speed;
        }
    },

    moveHorizontal: function (x) {
        if (this.x < x) {
            this.x += this.speed;
            this.drawSprite(this.spriteRight);
        }
        else if (this.x > x) {
            this.drawSprite(this.spriteLeft);
            this.x -= this.speed;
        }
    },

    idle: function () {
        this.drawSprite(this.spriteIdle);
    },

    checkDestination: function (destination) {
        var roadY = 238;
        if (this.x == destination.x && this.y == destination.y) {
            this.idle();
            return true;
        }
        else {
            if (this.y != roadY) {
                if (this.x != destination.x) {
                    this.moveVertical(roadY);

                }
                else if (this.x == destination.x) {
                    this.moveVertical(destination.y);
                    return;
                }
            }
            else if (this.y == roadY) {
                if (this.x != destination.x) {
                    this.moveHorizontal(destination.x);
                }
                else if (this.y != destination.y) {
                    this.moveVertical(destination.y);
                }
            }
            return false;
        }
    }
});

//Interactable object to do
InteractableObject = GameObject.extend({
    init: function (x, y, width, height, name, image) {
        this._super(x, y, width, height, name, image);
    },
});

//
ClickPoint = InteractableObject.extend({
    init: function (x, y, width, height, name, image) {
        this._super(x, y, width, height, name, image);
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
    drawObj: function () {
        ctx.fillRect(this.x, this.y, this.width, this.height);//testing
    },


});
// not implemented
Heroes = MovableObject.extend({
    init: function (x, y, width, height, name, spriteUp, spriteDown, spriteLeft, spriteRight, spriteIdle, image) {
        this._super(x, y, width, height, name, spriteUp, spriteDown, spriteLeft, spriteRight, spriteIdle, image);
        this.isInteracting = false;
        this.destination = {
            x: 50,
            y: 238
        };
    },
    setDestinaion: function (intObject) {
        this.destination.x = intObject.x;
        this.destination.y = intObject.y;
    }

});