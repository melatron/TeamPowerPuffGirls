var ctx,
    canvas,
    soundtrack;
// ============== MAIN OBJECT CLASS ============//

GameObject = Class.extend({
    init: function (x, y, width, height, name, heroDialogs, questDialogs) {
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
    init: function (x, y) {
        this.x = x;
        this.y = y;
        this.image = null;
    },
    drawPortrait: function () {
        ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    }
});
Speech = Class.extend({
    init: function (x, y) {
        this.counter = 0; 	 	
        this.conversetionEnded = false; 
        this.x = x;
        this.y = y;
        this.maxWidth = 150;
        this.wordsPixels = 15;
        this.textArray = ["Hello there mister", "Im your comrad lalallalallalallalalalalalallalalal", "i want to carry your children !!!"];
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
        var i, len = this.textArray[this.counter].length;
        for (i = 0; i < len; i++) {
            ctx.fillText(this.textArray[this.counter][i], this.x, this.y + (i * this.wordsPixels), this.maxWidth); //draws part of the dialog
        }
    }
});
SpeakingObject = GameObject.extend({
    init: function (x, y, width, height, name, heroDialogs, questDialogs) {
        this._super(x, y, width, height, name, heroDialogs, questDialogs);
        this.isSpeaking = false;
        this.image = null;
        this.radius = 30;
        this.bubbleHeight = 120;
        this.portraitX = 675;
        this.portraitY = 120;
        this.speechX = this.portraitX - 130;
        this.speechY = 280;
        this.portrait = new Portrait(this.portraitX, this.portraitY);
        this.speech = new Speech(this.speechX + 10   , this.speechY + 20);
        
    },
    setImage: function (image) {
        this.image = image;
        this.portrait.image = image;
    },

    setCoordinates: function (portraitX, portraitY, speechX, speechY) {
        this.portrait.x = portraitX;
        this.portrait.y = portraitY;
        this.speech.x = speechX;
        this.speech.y = speechY;
    },

    drawSpeechBubble: function () {
        if (this.speech.counter == this.speech.textArray.length - 1) {
            this.speech.conversetionEnded = true;
        } else {
            var x = this.speechX,
                y = this.speechY,
                r = x + this.speech.maxWidth + 30,
                b = y + this.bubbleHeight,
                _that = this;
            //this.speech.getSpeech(name);    this should NOT be in the main loop 
            //this.portrait.drawPortrait();
            // Drawing the bubble >>>
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "rgb(215,199,147)";
            ctx.lineWidth = "3";
        
            ctx.moveTo(x + this.radius, y);
            ctx.lineTo(r - this.radius * 2, y);
            ctx.lineTo(r - this.radius / 2, y - 15);
            ctx.lineTo(r - this.radius , y);
            //ctx.lineTo(r - this.radius, y);
        
            ctx.quadraticCurveTo(r, y, r, y + this.radius);
            ctx.lineTo(r, y + this.bubbleHeight - this.radius);
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
            this.speech.drawSpeech();
            
        }
    },
    prepareObjectForSpeaking: function (questObject) {
        if (this.name == "hero") {
            this.heroSpeech = questObject.heroSpeech;
            this.speakingTo = questObject;
            this.setDestinaion(questObject);
            this.isSpeaking = false;
            this.speech.conversetionEnded = false;

            if (questObject.progress.before) {
                this.speech.textArray = this.heroSpeech.textBefore;
            }
            else if (questObject.progress.after) {
                this.speech.textArray = this.heroSpeech.textAfter;
            }
            else {
                questObject.progress.done = true;
                this.speech.textArray = this.heroSpeech.textDone;
            }
        }
        else {

            this.isSpeaking = true;

            if (this.progress.before) {
                this.speech.textArray = this.questSpeech.textBefore;
            }
            else if (this.progress.after) {
                this.speech.textArray = this.questSpeech.textAfter;
            }
            else {
                this.progress.done = true;
                this.speech.textArray = this.questSpeech.textDone;
            }
        }

        this.speech.conversetionEnded = false;
        this.speech.counter = 0;

    }
});

// ==== INTERACTABLE OBJECT CLASS ==== //

InteractableObject = SpeakingObject.extend({
    init: function (x, y, width, height, name, game, heroDialogs, questDialogs) {
        this._super(x, y, width, height, name, heroDialogs, questDialogs);
        // Arrival point for Hero alignment
        this.isInteracting = false;
        this.game = game;
        this.isGamePlayed = false;
        this.spriteGlow = null;
    },

    startGame: function (bonuses) {
        if (!this.game.gameOver) {
            //this.calculateItemBonuses(bonuses);
            this.game.start();
        }
    },
    calculateItemBonuses: function (bonuses) {
        this.game.addBonuses(bonuses);
    }
});

// =============== MOVABLE OBJECT CLASS ===================== //

MovableObject = SpeakingObject.extend({
    init: function (x, y, width, height, name) {
        this._super(x, y, width, height, name);
        this.speed = 2;
        this.spriteUp = null;
        this.spriteDown = null;
        this.spriteLeft = null;
        this.spriteRight = null;
        this.spriteIdle = null;
        this.destination = null;
        this.destinationObject = null;
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
    
    moveHeroToDestination: function () {
        var roadY = 247;
        if ((this.x <= this.destination.x && this.destination.x <= this.x + 10) && (this.y <= this.destination.y && this.destination.y <= this.y + 10)) {
            this.idle();
            if(this.destinationObject)
            {
                this.destinationObject.isInteracting = true;   //Makes the current click point active
            }
            return true;
        }
        else {
            if ((this.y < roadY && roadY > this.y + 10) || (this.y > roadY && roadY < this.y + 10)) {
                if (!(this.x <= this.destination.x && this.destination.x <= this.x + 10)) {
                    this.moveVertical(roadY);
                    return;

                }
                else if (this.x <= this.destination.x && this.destination.x <= this.x + 10) {
                    this.moveVertical(this.destination.y);
                    return;
                }
            }
            else if (this.y <= roadY && roadY <= this.y + 10) {
                if (!(this.x <= this.destination.x && this.destination.x <= this.x + 10)) {
                    this.moveHorizontal(this.destination.x);
                    return;
                }
                else if (!(this.y <= this.destination.y && this.destination.y <= this.y + 10)) {
                    this.moveVertical(this.destination.y);
                    return;
                }
            }
            return false;
        }
    },
    
    // ==== Function for moving the NPCs around === //
    
    moveNPCToDestination: function(){
        if ((this.x <= this.destination.x && this.destination.x <= this.x + 10) && (this.y <= this.destination.y && this.destination.y <= this.y + 10)) {
            this.idle();
            return true;
        }
        else{
        	if (!(this.x <= this.destination.x && this.destination.x <= this.x + 10)) {
                this.moveHorizontal(this.destination.x);
                return;
            }
            else if (!(this.y <= this.destination.y && this.destination.y <= this.y + 10)) {
                this.moveVertical(this.destination.y);
                return;
            }
        }
    }
});

//=== Click point object ====//

ClickPoint = InteractableObject.extend({
    init: function (x, y, width, height, name, arrivalPoint, game, heroDialogs, questDialogs) {
        this._super(x, y, width, height, name, game, heroDialogs, questDialogs);
        this.arrivalPoint = arrivalPoint;
        this.heroSpeech = {
            textBefore: heroDialogs.before,
            textAfter: heroDialogs.after,
            textDone: heroDialogs.done,
        }
        this.questSpeech = {
            textBefore: questDialogs.before,
            textAfter: questDialogs.after,
            textDone: questDialogs.done,
        }
        this.progress = {
            before: true,
            after: false,
            done: false
        }
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
    	ctx.fillStyle = "rgba(20, 20, 20, 0.2)";   // Temporary bounding rect for click point
        ctx.fillRect(this.x, this.y, this.width, this.height);//testing
        ctx.fillStyle = "rgba(20, 20, 20, 0.7";
        ctx.fillRect(this.arrivalPoint.x, this.arrivalPoint.y, 10, 10);
        ctx.restore();
    },


});

//=== Hero objects ====//

Heroes = MovableObject.extend({
    init: function (x, y, width, height, name) {
        this._super(x, y, width, height, name);
        this.isInteracting = false;
        this.speakingTo = null;
        this.destination = {
            x: 50,
            y: 250
        };
        this.portraitX = 235;
        this.portraitY = 120;
        this.speechX = this.portraitX + 100;
        this.setCoordinates(this.portraitX, this.portraitY, this.speechX, this.speechY);
        this.speech = new Speech(this.speechX + 10, this.speechY + 20);
    },
    //-- Sets initial destination for the main character --//
    setDestinaion: function (intObject) {
        this.destination.x = intObject.arrivalPoint.x;
        this.destination.y = intObject.arrivalPoint.y;
        this.destinationObject = intObject;
    },
    drawSpeechBubble: function () {
        if (this.speech.counter == this.speech.textArray.length - 1) {
            this.speech.conversetionEnded = true;
        } else {
            this.speech.drawSpeech();
            // Drawing the bubble >>>
            var x = this.speechX,
                y = this.speechY,
                r = x + this.speech.maxWidth + 30,
                b = y + this.bubbleHeight;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "rgb(215,199,147)";
            ctx.lineWidth = "3";
            //
            ctx.moveTo(x + this.radius, y);
            ctx.lineTo(x + this.radius / 2, y - 15);
            ctx.lineTo(x + this.radius * 2, y);
            ctx.lineTo(r - this.radius, y);
            //
            //ctx.moveTo(x + this.radius, y);
            //ctx.lineTo(r - this.radius * 2, y);
            //ctx.lineTo(r - this.radius / 2, y - 15);
            //ctx.lineTo(r - this.radius, y);
            //ctx.lineTo(r - this.radius, y);

            ctx.quadraticCurveTo(r, y, r, y + this.radius);
            ctx.lineTo(r, y + this.bubbleHeight - this.radius);
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
            this.speech.drawSpeech();

        }
    }

});

// ============== NPC Movable Object Class =============== //

AIMovableObject = MovableObject.extend({
    init: function (x, y, width, height, name, clickPoint, destination, limit) {
		this._super(x, y, height, name);
		this.destination = destination;
        this.limit = limit;
        this.name = name;
        this.clickPoint = clickPoint;
		this.getDestinationCounter = 0;
        this.getDestinationDelay = 200;
		this.speed = 1;
	},
	
	// -- Sets a random destination for "walking around" -- //
	
	setRandomDestination: function(){
		if(this.clickPoint.isInteracting){
            if (this.name == 'dragon'){
                this.destination = {
                    x: this.clickPoint.arrivalPoint.x + 30,
                    y: this.clickPoint.arrivalPoint.y - 50
                };
            }
            else if (this.name == 'elf'){
            	this.destination = {
            		x: this.clickPoint.arrivalPoint.x + 15,
            		y: this.clickPoint.arrivalPoint.y - 20            			
            	};
            }
            else if (this.name == 'bandit'){
            	this.destination = {
            		x: this.clickPoint.arrivalPoint.x,
            		y: this.clickPoint.arrivalPoint.y + 30
            	};
            }
            else{
                this.destination = {
                    x: this.clickPoint.arrivalPoint.x + 30,
                    y: this.clickPoint.arrivalPoint.y + 4
                };
            }
		}
		else if(this.getDestinationCounter % this.getDestinationDelay == 0){
			this.destination.x = Math.floor(Math.random() * (this.limit.xMax - this.limit.xMin + 1) + this.limit.xMin);
			this.destination.y = Math.floor(Math.random() * (this.limit.yMax - this.limit.yMin + 1) + this.limit.yMin);
		}
		this.getDestinationCounter ++;
		this.moveNPCToDestination(this.destination);
	}
});

//======== SPRITE OBJECTS ==========//

Sprite = Class.extend({
	init: function(width, height, frames, renderSpeed, image, object, context){
		this.width = width;
		this.height = height;
		this.frames = frames;
        this.renderSpeed = renderSpeed;  //The speed with which the frames are changed. Affects the speed of the animation.
		this.image = image;
		this.object = object; // The object that is being animated
		this.frameCounter = 0;
		this.tickCounter = 0;
		this.context = context;
	},
	
	//-- Function for drawing the sprite --//
	drawSprite: function(){
		this.context.drawImage(
				this.image,
				this.frameCounter * (this.width / this.frames),
				0,
				this.width / this.frames,
				this.height,
				this.object.x - 2,
				this.object.y,
				this.width / this.frames,
				this.height
		);
		this.tickCounter++;
		if(this.tickCounter % this.renderSpeed == 0){
			this.frameCounter++;			
		}
		
		if(this.frameCounter >= this.frames){
			this.frameCounter = 0;
		}
	}
});

//--basic inventory objects--//

ItemAttributes = {
    axe: {
        name: 'Epic Axe',
        bonusMoves: 18,
        bonusSpeed: 1,
        bonusTime:320
    },

    bow: {
        name: 'Useless Bow',
        bonusMoves: 5,
        bonusSpeed: 1,
        bonusTime: 3
    },

    sword: {
        name: 'Plain Dagger',
        bonusMoves: 0,
        bonusTime: 5,
        bonusSpeed: 1,

    }
};

Inventory = Class.extend({
    name: "inventory",
    init: function () {

        this.slots = [0, 0, 0, 0, 0, 0];

    },

    removeItem : function (index) {
        if (this.slots[index] == 1) {
            $('.inventory-slot').eq(index).html(' ');
            this.slots[index] = 0;
        }
    },

    getItem : function (name) {
        var temp = new Item(name);
        for (var i = 0; i < this.slots.length; i++) {
            if (this.slots[i] == 0) {
                temp.dom.appendTo($('.inventory-slot').eq(i))
                this.slots[i] = temp;
                break;
            };
        };
    },


});

Item = Class.extend({
    name: 'item',
    init: function (name) {
        this.name = name;
        this.dom = $('<img class ="item" src="source/items/' + this.name + '.png">');
        this.dom.on('mouseenter', this, this.showAttributes);
        this.dom.on('mouseleave', this, this.hideAttributes);
        this.dom.on('click', this, this.pickItem);        
    },


    showAttributes: function (e) {
        var temp = '';

        $('#item-attributes').css({
            display: 'block',
            left: e.clientX - 150 + 'px',
            top:e.clientY - 250 + 'px'
        });


        $('#item-name').html(ItemAttributes[e.data.name].name);


        for( var attr in ItemAttributes[e.data.name]){
            
            if(attr == 'bonusMoves'){
                temp += '<p>Bonus Moves: '+ ItemAttributes[e.data.name][attr] + '</p>';
            };

            if(attr == 'bonusSpeed'){
                temp += '<p>Bonus Speed: '+ ItemAttributes[e.data.name][attr] + '</p>';
            };

            if(attr == 'bonusTime'){
                temp += '<p>Bonus Time: '+ ItemAttributes[e.data.name][attr] + '</p>';
            };

            if(attr == 'bonusDamage'){
                temp += '<p>Bonus Damage: '+ ItemAttributes[e.data.name][attr] + '</p>';
            };
            
        };

        
        $('#item-bonuses').html(temp);
    },


    hideAttributes: function () {
        $('#item-attributes').css({ display: 'none'});
    },

    pickItem: function (e) {
        console.log('a')


    },

    placeItem: function (e) {
        console.log('b')


    }

});

//======== PLAYLIST OBJECT ==========//

function PlayList() {
    var questSounds = new Array(),
        mainSounds = new Array(),
        currentMainSongIndex = null;
    
    this.preloadQuestSounds = function () {
        for (var i = 0; i < arguments.length; i++) {
            questSounds[i] = new Audio();
            questSounds[i].src = arguments[i];
        }
        console.log(questSounds[0]);
    };
    this.preloadMainSounds = function () {
        for (var i = 0; i < arguments.length; i++) {
            mainSounds[i] = new Audio();
            mainSounds[i].src = arguments[i];
        }
        currentMainSongIndex = Math.floor((Math.random() * (mainSounds.length - 1)));
        mainSounds[currentMainSongIndex].play();
    };
    this.startMusicByQuest = function (quest) {
        mainSounds[currentMainSongIndex].pause();
        setTimeout(function () {
            switch (quest) {
                case "castle":
                    questSounds[0].load();
                    questSounds[0].loop = true;
                    questSounds[0].play();
                    break;
                case "dragon":
                    questSounds[1].load();
                    questSounds[1].loop = true;
                    questSounds[1].play();
                    break;
                default:
                    break;
            };
        }, 1000);
    };
    this.resumeMainMusic = function () {
        for (var i = 0; i < questSounds.length; i++) {
            if (!questSounds[i].ended) {
                questSounds[i].pause();
            }
        }
        setTimeout(function () {
            mainSounds[currentMainSongIndex].load();
            mainSounds[currentMainSongIndex].play();
        }, 1000);
    };
    this.startNextSong = function () {
        if (mainSounds[currentMainSongIndex].ended && currentMainSongIndex + 1 < mainSounds.length ) {
            currentMainSongIndex++;
            mainSounds[currentMainSongIndex].play();
        }
        else if (mainSounds[currentMainSongIndex].ended) {
            currentMainSongIndex = 0;
            mainSounds[currentMainSongIndex].play();
        }
    };
    this.pauseMainMusic = function () {
        mainSounds[currentMainSongIndex].pause();
    }
    this.pauseQuestMusic = function (quest) {
        switch (quest) {
            case "castle":
                questSounds[0].pause();
                break;
            case "dragon":
                questSounds[1].pause();
                break;
            default:
                break;
        }
    }
}

//======== GAME OBJECTS ==========//

Game = Class.extend({
    init: function () {
        this.gameOver = false;
        this.objectives = null;                 
        this.gameBonuses = null;                //example : this.gameBonuses = ['additionalMoves', 'additionalSpeed, .. ]'
                                                
        this.score = null;
        this.plot = null;

    },
    start: function () {

    },
    endGame: function () {

    },

    //WORK IN PROGRESS
    calculateBonuses: function (gameBonuses) { 
        var object = {
            bonusMoves : 0,
            bonusSpeed : 0,
            bonusTime : 0
        },

        itemName, attribute; 

        for(var i in story.inventory.slots){ 
            for(var j in gameBonuses){

                if(story.inventory.slots[i] !== 0){
                    itemName = story.inventory.slots[i].name;
                    attribute = gameBonuses[j];

                    console.log(ItemAttributes[itemName][attribute] !== 'undefined')

                    if(ItemAttributes[itemName][gameBonuses[j]] !== 'undefined'){
                        
                        object[attribute] += ItemAttributes[itemName][attribute]
                    }

                };
            };
        };

        return object;
    },
    addGameToPlot: function () {
        this.plot.show();
    },
    removeGameFromPlot: function () {
        this.plot.hide();
    },

    getReward: function (item) {


    }
});