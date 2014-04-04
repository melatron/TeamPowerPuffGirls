var ctx,
    canvas,
    heroSpriteUp, 
    heroSpriteDown,
    heroSpriteLeft,
    heroSpriteRight,
    heroSpriteIdle;

// ============== MAIN OBJECT CLASS ============//

GameObject = Class.extend({
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
    }   
});

// =============== SPEAKING OBJECT CLASS ===================== // ( object which can spawn speech bubbles )
Portrait = Class.extend({
    init: function (x, y, image) {
        this.x = x;
        this.y = y;
        //this.width = image.width;
        //this.height = image.height;
        this.image = image;
    },
    drawPortrait: function () {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
});
Speech = Class.extend({
    init: function (x, y) {
        this.x = x;
        this.y = y;
        this.maxWidth = 0;
        this.wordsPixels = 0;
        this.textArray = new Array();
        this.startSentence = 0;
        this.endSentence = 0;
    },
    setMaxWidth: function (maxWidth) {
        this.maxWidth = maxWidth;
    },
    setWordsPixels: function (wordsPixels) {
        this.wordsPixels = wordsPixels;
    },
    addSpeech: function (sentence) {
        this.textArray.push(sentence);
    },
    drawSpeech: function () {
        ctx.fillStyle = "black";
        ctx.font = "12px Georgia";
        for (var i = this.indexOfSpokenSpeech; i < this.endSentence; i++) {
            ctx.fillText(this.textArray[i], this.x, this.y + (i * this.wordsPixels), maxWidth);
        }
    }
});
SpeakingObject = GameObject.extend({
    init: function (x, y, width, height, name, image) {
        this._super(x, y, width, height, name);
        this.radius = 20;
        this.bubbleHeight = 120;
        this.portraitX = x + width;
        this.portraitY = y;
        //this.speechX = x + width + image.width;
        this.speechY = y + this.radius;
        this.portrait = new Portrait(this.portraitX, this.portraitY, image);
        this.speech = new Speech(this.speechX, this.speechY);
        
    },
    drawSpeechBubble: function () {
        // Drawing the bubble >>>
        var x = this.x,
            y = this.y,
            r = x + this.speech.maxWidth + 30,
            b = y + this.bubbleHeight;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.lineWidth = "3";
        ctx.moveTo(x + this.radius, y);
        ctx.lineTo(x + this.radius / 2, y - 10);
        ctx.lineTo(x + this.radius * 2, y);
        ctx.lineTo(r - this.radius, y);
        ctx.quadraticCurveTo(r, y, r, y + this.radius);
        ctx.lineTo(r, y + h - this.radius);
        ctx.quadraticCurveTo(r, b, r - this.radius, b);
        ctx.lineTo(x + this.radius, b);
        ctx.quadraticCurveTo(x, b, x, b - this.radius);
        ctx.lineTo(x, y + this.radius);
        ctx.quadraticCurveTo(x, y, x + this.radius, y);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.restore();
        // Drawing the text inside the bubble >>>
        
            
    }
});

// =============== MOVABLE OBJECT CLASS ===================== //

MovableObject = SpeakingObject.extend({
    init: function (x, y, width, height, name) {
        this._super(x, y, width, height, name);
        this.speed = 4;
        this.spriteUp = null;
        this.spriteDown = null;
        this.spriteLeft = null;
        this.spriteRight = null;
        this.spriteIdle = null;
    },
    
    //-- function for vertical movement --//
    
    moveVertical: function (y) {
        if (this.y < y && !(this.y < y && y < this.y + 10)) {
            this.spriteDown.drawSprite();
            this.y += this.speed;
        }
        else if (this.y > y && !(this.y < y && y < this.y + 10)) {
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
        var roadY = 250;
        if ((this.x <= destination.x && destination.x <= this.x + 10) && (this.y <= destination.y && destination.y <= this.y + 10)) {
            this.idle();
            return true;
        }
        else {
            if ((this.y < roadY && roadY > this.y + 10) || (this.y > roadY && roadY < this.y + 10)) {
                if (!(this.x <= destination.x && destination.x <= this.x + 10)) {
                    this.moveVertical(roadY);
                    return;

                }
                else if (this.x <= destination.x && destination.x <= this.x + 10) {
                    this.moveVertical(destination.y);
                    return;
                }
            }
            else if (this.y <= roadY && roadY <= this.y + 10) {
                if (!(this.x <= destination.x && destination.x <= this.x + 10)) {
                    this.moveHorizontal(destination.x);
                    return;
                }
                else if (!(this.y <= destination.y && destination.y <= this.y + 10)) {
                    this.moveVertical(destination.y);
                    return;
                }
            }
            return false;
        }
    }
});

// ==== INTERACTABLE OBJECT CLASS ==== //

InteractableObject = SpeakingObject.extend({
    init: function (x, y, width, height, name) {
        this._super(x, y, width, height, name);
        // Arrival point for Hero alignment
        this.interactedAtTheMoment = false;
    },
});

//=== Click point object ====//

ClickPoint = InteractableObject.extend({
    init: function (x, y, width, height, name, arrivalPoint) {
        this._super(x, y, width, height, name);
        this.arrivalPoint = arrivalPoint;
    },
    
    // --- function that checks if the point is clicked --- //
    
    checkIfClicked: function (mouseX, mouseY) {
        // if x between this x and this.x + this.width AND if y between this.y and this.y+this.height
        if ((mouseX > this.x && mouseX < (this.x + this.width)) && (mouseY > this.y && mouseY < (this.y + this.height))) {
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
    init: function (x, y, width, height, name, spriteUp, spriteDown, spriteLeft, spriteRight, spriteIdle) {
        this._super(x, y, width, height, name, spriteUp, spriteDown, spriteLeft, spriteRight, spriteIdle);
        this.isInteracting = false;
        this.destination = {
            x: 50,
            y: 250
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
		this.tickCounter = 0;
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
		this.tickCounter++;
		if(this.tickCounter % 2 != 0){
			this.frameCounter++;			
		}
		
		if(this.frameCounter >= this.frames){
			this.frameCounter = 0;
		}
	}
});
