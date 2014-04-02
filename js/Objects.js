var ctx,
    canvas,
    heroSpriteUp, 
    heroSpriteDown,
    heroSpriteLeft,
    heroSpriteRight,
    heroSpriteIdle;

// ============== MAIN OBJECT CLASS ============//

GameObject = Class.extend({
    init: function (x, y, width, height, name, portrait) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.portrait = portrait;
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
    drawSpeechBubble: function (w, h, radius, text) {
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
        
        
        
        // Drawing the image that speaks the quote >>>
        //ctx.drawImage(img, x, y, width, height);
            
    },
    drawSpeech: function (text) {
        for (var i = 0; i < text.length; i++) {
            ctx.fillText(text[i], this.x + 15, this.y + 20 + (i * 20), w - 20);
        }
    },
    //
    drawPortrait: function () {
        ctx.drawImage(this.portrait, this.x, this.y, width, height);
    }
});

// =============== MOVABLE OBJECT CLASS ===================== //

MovableObject = GameObject.extend({
    init: function (x, y, width, height, name, portrait) {
        this._super(x, y, width, height, name, portrait);
        this.speed = 2;
        this.spriteUp = null;
        this.spriteDown = null;
        this.spriteLeft = null;
        this.spriteRight = null;
        this.spriteIdle = null;
    },
    
    //-- function for vertical movement --//
    
    moveVertical: function (y) {
        if (this.y < y) {
            this.spriteDown.drawSprite();
            this.y += this.speed;
        }
        else if (this.y > y) {
        	this.spriteUp.drawSprite();
            this.y -= this.speed;
        }
    },

    //-- function for horizontal movement --//
    
    moveHorizontal: function (x) {
        if (this.x < x) {
        	this.spriteRight.drawSprite();
            this.x += this.speed;
        }
        else if (this.x > x) {
        	this.spriteLeft.drawSprite();
            this.x -= this.speed;
        }
    },
    
    //-- function for sitting still --//
    
    idle: function () {
    	this.spriteIdle.drawSprite();
    },

    //-- this function checks last clicked destination and moves the hero there --//
    
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

// ==== INTERACTABLE OBJECT CLASS ==== //

InteractableObject = GameObject.extend({
    init: function (x, y, width, height, name, image) {
        this._super(x, y, width, height, name, image);
    },
});

//=== Click point object ====//

ClickPoint = InteractableObject.extend({
    init: function (x, y, width, height, name, arrivalPoint, image) {
        this._super(x, y, width, height, name, arrivalPoint, image);
        this.isClicked = false;
        this.arrivalPoint = arrivalPoint;  // Arrival point for Hero alignment
    },
    
    // --- function that checks if the point is clicked --- //
    
    checkIfClicked: function (mouseX, mouseY) {
        console.log(mouseX + " " + mouseY);
        // if x between this x and this.x + this.width AND if y between this.y and this.y+this.height
        if ((mouseX > this.x && mouseX < (this.x + this.width)) && (mouseY > this.y && mouseY < (this.y + this.height))) {
            console.log("hello");
            return true;
        }
    },
    drawObj: function () {
    	ctx.save();
    	ctx.fillStyle = "rgba(20, 20, 20, 0.5)";   // Temporary bounding rect for click point
        ctx.fillRect(this.x, this.y, this.width, this.height);//testing
        ctx.restore();
    },


});

//=== Hero objects ====//

Heroes = MovableObject.extend({
    init: function (x, y, width, height, name, spriteUp, spriteDown, spriteLeft, spriteRight, spriteIdle, portrait) {
        this._super(x, y, width, height, name, spriteUp, spriteDown, spriteLeft, spriteRight, spriteIdle, portrait);
        this.isInteracting = false;
        this.destination = {
            x: 50,
            y: 238
        };
    },
    //-- Sets initial destination for the main character --//
    setDestinaion: function (intObject) {
        this.destination.x = intObject.arrivalPoint.x;
        this.destination.y = intObject.arrivalPoint.y;
    }

});

//======== SPRITE OBJECTS ==========//

Sprite = Class.extend({
	init: function(width, height, frames, image, object){
		this.width = width;
		this.height = height;
		this.frames = frames;
		this.image = image;
		this.object = object; // The object that is being animated
		this.frameCounter = 0;
	},
	
	//-- Function for drawing the sprite --//
	drawSprite: function(){
		ctx.drawImage(
				this.image,
				this.frameCounter * (this.width / this.frames),
				0,
				this.width / this.frames,
				this.height,
				this.object.x,
				this.object.y,
				this.width / this.frames,
				this.height
		);
		this.frameCounter++;
		
		if(this.frameCounter >= this.frames){
			this.frameCounter = 0;
		}
	}
});