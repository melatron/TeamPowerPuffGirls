
// ============== MAIN OBJECT CLASS ============//

GameObject = Class.extend({
    init: function (x, y, width, height, name) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.canvas = $("#canvas")[0];
        this.ctx = this.canvas.getContext('2d');
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
// ================== Buttons =============== //
ButtonsObject = GameObject.extend({
    init: function (x, y, width, height, name, image) {
        this._super(x, y, width, height, name);
        this.image = image;
        this.toggled = false;
    },
    checkIfClicked: function (mouseX, mouseY) {
        // if x between this x and this.x + this.width AND if y between this.y and this.y+this.height
        if ((mouseX > this.x && mouseX < (this.x + this.width)) && (mouseY > this.y && mouseY < (this.y + this.height))) {
            this.toggled = !this.toggled;
            console.log(this.toggled);
            return true;
        }
    },
    drawButton: function () {

        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

});
// =============== SPEAKING OBJECT CLASS ===================== // ( object which can spawn speech bubbles )

Portrait = Class.extend({
    init: function (x, y) {
        this.canvas = $("#canvas")[0];
        this.ctx = this.canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.image = null;
    },
    drawPortrait: function () {
        this.ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    }
});
Speech = Class.extend({
    init: function (x, y) {
        this.canvas = $("#canvas")[0];
        this.ctx = this.canvas.getContext('2d');
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
        this.ctx.fillStyle = "black";
        this.ctx.font = "bold 12px Georgia";
        var i, len = this.textArray[this.counter].length;
        for (i = 0; i < len; i++) {
            this.ctx.fillText(this.textArray[this.counter][i], this.x, this.y + (i * this.wordsPixels), this.maxWidth); //draws part of the dialog
        }
    }
});
SpeakingObject = GameObject.extend({
    init: function (x, y, width, height, name) {
        this._super(x, y, width, height, name);
        this.isSpeaking = false;
        this.image = null;
        this.radius = 30;
        this.bubbleHeight = 120;
        this.portraitX = 675;
        this.portraitY = 120;
        this.speechX = this.portraitX - 130;
        this.speechY = 280;
        this.portrait = new Portrait(this.portraitX, this.portraitY);
        this.speech = new Speech(this.speechX + 10, this.speechY + 20);
        
        
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
            var x = this.speechX,
                y = this.speechY,
                r = x + this.speech.maxWidth + 30,
                b = y + this.bubbleHeight,
                _that = this;

            // Drawing the bubble >>>
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = "rgb(215,199,147)";
            this.ctx.lineWidth = "3";
        
            this.ctx.moveTo(x + this.radius, y);
            this.ctx.lineTo(r - this.radius * 2, y);
            this.ctx.lineTo(r - this.radius / 2, y - 15);
            this.ctx.lineTo(r - this.radius , y);
            //this.ctx.lineTo(r - this.radius, y);
        
            this.ctx.quadraticCurveTo(r, y, r, y + this.radius);
            this.ctx.lineTo(r, y + this.bubbleHeight - this.radius);
            this.ctx.quadraticCurveTo(r, b, r - this.radius, b);
            this.ctx.lineTo(x + this.radius, b);
            this.ctx.quadraticCurveTo(x, b, x, b - this.radius);
            this.ctx.lineTo(x, y + this.radius);
            this.ctx.quadraticCurveTo(x, y, x + this.radius, y);
            this.ctx.fill();
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
            this.ctx.restore();
            // Drawing the text inside the bubble >>>
            this.speech.drawSpeech();
            
        
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
        this._super(x, y, width, height, name);
        // Arrival point for Hero alignment
        this.score = 0;
        this.isInteracting = false;
        this.game = game;
        this.isGamePlayed = false;
        this.spriteGlow = null;
        this.heroSpeech = {
            textBefore: heroDialogs.before,
            textAfter: heroDialogs.after,
            textDone: heroDialogs.done,
        };
        this.questSpeech = {
            textBefore: questDialogs.before,
            textAfter: questDialogs.after,
            textDone: questDialogs.done,
        };
        this.progress = {
            before: true,
            after: false,
            done: false
        };
    },

    startGame: function (bonuses) {
        console.log(this.game.gameOver);
        if (!this.game.gameOver) {
            //this.calculateItemBonuses(bonuses);
            this.game.start(bonuses);
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
    init: function (x, y, width, height, name, arrivalPoint, game, heroDialogs, questDialogs, circle) {
        this._super(x, y, width, height, name, game, heroDialogs, questDialogs);
        this.arrivalPoint = arrivalPoint;
        this.isAvailable = false;
        this.circle = {
            x: circle.x,
            y: circle.y,
            r: circle.r
        };
        
    },

    // --- function that checks if the point is clicked --- //

    checkIfClicked: function (mouseX, mouseY) {
        // if x between this x and this.x + this.width AND if y between this.y and this.y+this.height
        if (Math.pow(this.circle.x - mouseX, 2) + Math.pow(this.circle.y - mouseY, 2) < Math.pow(this.circle.r, 2)) {
            return true;
        }
    },
    drawObj: function () {
    	this.ctx.save();
    	this.ctx.fillStyle = "rgba(20, 20, 20, 0.2)";   // Temporary bounding rect for click point
        this.ctx.fillRect(this.x, this.y, this.width, this.height);//testing
        this.ctx.fillStyle = "rgba(20, 20, 20, 0.7";
        this.ctx.fillRect(this.arrivalPoint.x, this.arrivalPoint.y, 10, 10);
        this.ctx.restore();
    },


});

//=== Hero objects ====//

Hero = MovableObject.extend({
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
            this.speech.drawSpeech();
            // Drawing the bubble >>>
            var x = this.speechX,
                y = this.speechY,
                r = x + this.speech.maxWidth + 30,
                b = y + this.bubbleHeight;
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = "rgb(215,199,147)";
            this.ctx.lineWidth = "3";
            //
            this.ctx.moveTo(x + this.radius, y);
            this.ctx.lineTo(x + this.radius / 2, y - 15);
            this.ctx.lineTo(x + this.radius * 2, y);
            this.ctx.lineTo(r - this.radius, y);
            //
            //this.ctx.moveTo(x + this.radius, y);
            //this.ctx.lineTo(r - this.radius * 2, y);
            //this.ctx.lineTo(r - this.radius / 2, y - 15);
            //this.ctx.lineTo(r - this.radius, y);
            //this.ctx.lineTo(r - this.radius, y);

            this.ctx.quadraticCurveTo(r, y, r, y + this.radius);
            this.ctx.lineTo(r, y + this.bubbleHeight - this.radius);
            this.ctx.quadraticCurveTo(r, b, r - this.radius, b);
            this.ctx.lineTo(x + this.radius, b);
            this.ctx.quadraticCurveTo(x, b, x, b - this.radius);
            this.ctx.lineTo(x, y + this.radius);
            this.ctx.quadraticCurveTo(x, y, x + this.radius, y);
            this.ctx.fill();
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
            this.ctx.restore();
            // Drawing the text inside the bubble >>>
            this.speech.drawSpeech();
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
		this.speed = 0.5;
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
				this.object.x - 4.5,
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



//======== PLAYLIST OBJECT ==========//

function PlayList() {
    var questSounds = preloader.returnQuestMusicArrayCopy(),
        mainSounds = preloader.returnMainMusicArrayCopy(),
        currentMainSongIndex = 0;
 
    this.startMainMusic = function () {
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
    };
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
    };
    this.loadSound = function(url){
    	var temp = new Audio();
    	temp.src = url;
    	
    	return temp;
    };
}

//======== GAME OBJECTS ==========//

Item = Class.extend({
    name: 'item',
    init: function (type) {
        this.type = type;
        this.dom = $('<img class ="item" src="source/items/' + this.type + '.png">');
        this.dom.on('mouseenter', this, this.showAttributes);
        this.dom.on('mouseleave', this, this.hideAttributes);

        var self = this;

        this.addDraggable = function(){
            this.dom.draggable({
                start: function () {              
                    self.hideAttributes();
                    $(this).css({ zIndex: '2' });
                },

                stop: function (ev, ui) {
                    $(this).css({
                        left: '0px',
                        top: '0px'
                    });
                }
            });
            console.log('added ' + self);
        };

        this.time = null;
        this.moves = null;
        this.speed = null;
        this.checkpoints = null;
        this.lives = null;
        this.description = null;

        if (this.type === "dagger") {
            this.name = "Kelen's Dagger";
            this.moves = 40;
            this.speed = 0;
            this.time = 120;
            this.checkpoints = 1;
            this.lives = 0;
            this.description = 'This item increases your time for reaction dramatically!!';
        };

        if (this.type === 'ring') {
            this.name = "Ring of Protection";
            this.moves = 0;
            this.speed = 0;
            this.time = 0;
            this.checkpoints = 0;
            this.lives = 30;
            this.description = 'Wearing this ring just feels right.';
        };

        if (this.type === 'sword') {
            this.name = "Useless Sword";
            this.moves = 0;
            this.speed = 0;
            this.time = 0;
            this.checkpoints = 0;
            this.lives = 0;
            this.description = "You'll get nothing from this item. Exept the false sense of security...";
        };

        if (this.type === "boots") {
            this.name = "Boots of Speed";
            this.moves = 35;
            this.speed = 1;
            this.time = 180;
            this.checkpoints = 0;
            this.lives = 0;

        };

        if (this.type === "armor") {
            this.name = "Scrappy Armor";
            this.moves = 0;
            this.speed = 0;
            this.time = 0;
            this.checkpoints = 0;
            this.lives = 50;
            this.description = "This was a great armor once. Not anymore tho..";
        };

        if (this.type === "potion") {
            this.name = "Potion of Agility";
            this.moves = 120;
            this.speed = 0;
            this.time = 300;
            this.checkpoints = 0;
            this.lives = 0;
            this.description = "Not as tasty as you would like it to be, but it does help a great deal.";

        };

        if (this.type === "gem") {
            this.name = "Magical Gem";
            this.moves = 60;
            this.speed = 0;
            this.time = 0;
            this.checkpoints = 1;
            this.lives = 20;           

        };

        //this.addDraggable();
    },

    showAttributes: function (e) {
        var temp = '';

        $('#item-attributes').css({
            display: 'block',
            left: e.clientX - 150 + 'px',
            top: e.clientY - 250 + 'px'
        });

        $('#item-name').html(e.data.name);

        if (e.data.moves !== 0) {
            temp += '<p>Additional Moves: ' + e.data.moves + '</p>';
        };
        if (e.data.speed !== 0) {
            temp += '<p>Additional Speed: ' + e.data.speed + '</p>';
        };
        if (e.data.time !== 0) {
            temp += '<p>Additional Time: ' + e.data.time + '</p>';
        };
        if (e.data.checkpoints !== 0) {
            temp += '<p>Additional Checkpoints: ' + e.data.checkpoints + '</p>';
        };
        if (e.data.lives !== 0) {
            temp += '<p>Additional Lives: ' + e.data.lives + '</p>';
        };
        if (e.data.description !== null) {
            temp += '<p class = "description">' + e.data.description + '</p>';
        };

        $('#item-bonuses').html(temp);
    },


    hideAttributes: function () {
        $('#item-attributes').css({ display: 'none' });
    },

});

Inventory = Class.extend({
    name: "inventory",
    init: function () {
        this.slots = [0, 0, 0, 0, 0, 0];
        var self = this;

        this.addDroppable = function () {
            console.log('added droppables');

            $('.inventory-slot').droppable({
                tolerance: 'pointer',

                drop: function (ev, ui) {

                    var oldSlotIndex = ui.draggable.parent().attr('slot'),
                        newSlotIndex = $(this).attr('slot'),

                        item = self.slots[oldSlotIndex];

                    if (self.slots[newSlotIndex] === 0) {
                        self.slots[oldSlotIndex] = 0;
                        ui.draggable.appendTo($(this));
                        self.slots[newSlotIndex] = item;
                    };
                    ui.draggable.css({ zIndex: '0' });
                    item.addDraggable();
                }
                
            });
        };

    },

    removeItem: function (index) {
        if (this.slots[index] !== 0) {
            $('.inventory-slot').eq(index).html(' ');
            this.slots[index] = 0;
        }
    },

    getItem: function (name) {
        var temp = new Item(name);
        for (var i = 0; i < this.slots.length; i++) {
            if (this.slots[i] === 0) {
                temp.dom.appendTo($('.inventory-slot').eq(i));
                this.slots[i] = temp;
                break;
            };
        };
    },

    clearInventory: function () {
        for (var index in this.slots) {
            this.slots[index] = 0;
        };
        $('.inventory-slot').html('');
    }

});



var Game = Class.extend({
    init: function () {
                        
        this.gameBonuses = {            // object containing all the game bonuses (calculated at the start of each game)
        
            bonusMoves : 0,
            bonusSpeed : 0,
            bonusTime : 0,
            bonusCheckpoints : 0
        
        };                
        this.rewardItem = null;                                        
        this.score = 0;
        this.plot = null;
        this.gameOver = false;
        this.objectives = null;
        this.stopEvents = true;
        this.scroll = $('#scroll');
        
        this.soundArray = null;
        this.scrollSound = null;
        
        

    },
    addEventListeners: function(){

    },
    loadSounds: function(){
        this.scrollSound = preloader.getGameSoundByIndex(0);
    },
    
    start: function (obj) {

        console.log(obj);
        this.gameBonuses = obj;
        this.stopEvents = false;
    },
    endGame: function () {
        this.stopEvents = true;
    },

    //WORK IN PROGRESS
    
    addGameToPlot: function () {
    	this.loadSounds();
        this.plot.fadeIn(1000);
        this.scroll.fadeIn(1000, this.openScroll);
        var _this = this;
        setTimeout(function(){
        	console.log(this);
        	_this.scrollSound.play();
        }, 1200);
    },
    removeGameFromPlot: function () {
    	this.plot.fadeOut(1000);
    	this.scrollSound.play();
        this.closeScroll();
    },

  
    
    openScroll: function () {
        console.log(this);
        var id = $(this).attr('id');
        $('#' + id + ' .bottom').animate({
            'top': '0px'
        }, 1000, 'easeInOutBack');
    },

    closeScroll: function () {
        var id = $(this.scroll).attr('id');
        $('#' + id + ' .bottom').animate({
            'top': '-120px'
        }, 700, 'easeInOutBack', function(){
        	$('#scroll').fadeOut(500);
        });
    },
    //font-size: 16px;
    writeOnScroll: function (instructions, fontSize) {
        var id = $(this.scroll).attr('id');
        $('#' + id + ' .bottom').css(fontSize).html(instructions);
    },

    clearScroll: function () {
        var id = $(this.scroll).attr('id');
        $('#' + id + ' .bottom').html('');
    },

});

function Menu() {
    this.isGameStarted = false;
    var self = this,
        isMenuInitialize = false,

        mainWrapper = $('#mainMenuWrapper'),
        menuCells = [{
        class: '.highScores',
        isExpanded: false
    }, {
        class: '.howTo',
        isExpanded: false
    },{
        class: '.begin',
        isExpanded: false
    }],
	    mousePos = {
        x: null,
        y: null
        },
        rainSound = null,
        music = null,
        thunderSound = null,
        chainSound = null,
        scrollSound = null;
    
    this.initializeMenu = function (){
        if (!self.isGameStarted) {

            $('#main').hide();

            $('#mainMenuWrapper').show();
            $('#main').hide();
            removeAllEvents();
            preloadSounds();
            rainSound.play();
            thunderSound.play();
            music.play();
            addAnimations();
            manageSounds();
            setTimeout(thunder, 500);
            setTimeout(thunder, 6800);
            setTimeout(thunder, 16200);
            fillHallOfFame();
        }
    };

    function removeAllEvents() {
        $('*').off();
        $(document).off();
        $(window).off();
    };
    function preloadSounds(){
        rainSound = new Audio();
        rainSound.src = 'source/menu/rain.mp3';
        music = new Audio();
        music.src = 'source/menu/birthOfAHero.mp3';
        thunderSound = new Audio();
        thunderSound.src = 'source/menu/thunder.mp3';
        chainSound = new Audio();
        chainSound.src = 'source/menu/chains.mp3';
        scrollSound = new Audio();
        scrollSound.src = 'source/menu/bigScrollUnroll.mp3';
    };
	
    function addStartEvent(){
        var elem = $('#seal');
		
        elem.on('click', function(){
            $('#bigScrollRight').animate({
                    'left': '-650px'
                }, 2000, 'easeInOutBack', startGame);
        });
    };
	
    function showHighScores(){
    	$('.highScores').on('mouseenter', function(){
    		if(menuCells[0].isExpanded){
    			$('#highScoresDiv').fadeIn(200);    			
    		}
    	});
    	$('.highScores').on('mouseleave', function(){
    		$('#highScoresDiv').fadeOut(200);
    	});
    }
    
    function showEpilogue(){
        $('.menuCell.begin').on('click', function(){
            $('#epilogue').fadeIn(1000, function(){
            	scrollSound.play();
            	$('#bigScrollRight').animate({
            		'left': '30px'
            	}, 2000, 'easeInOutBack');
            });
            console.log('hello');
        });
    };

    function hideEpilogue(){
        $('#bigScrollRight').animate({
                    'left': '-650px'
                }, 2000, 'easeInOutBack');
    }

    function startGame(e){
        if(self.isGameStarted == false){
            self.isGameStarted = true;
            rainSound.pause();
            music.pause();
            thunderSound.pause();
			
            hideMenu();
            $('#epilogue').fadeOut(2000);
			
            setTimeout(function(){
                $('#main').fadeIn(2000);
            }, 2000);
			
			
            var story = new Story();
			
            story.preloadEverything();
            
            serverObject.playerName = $("#nameInput").val();
        }
    };
    function fillHallOfFame() {
        serverObject.initialScores();
        console.log('fill');
        serverObject.getHighScore();
    }
    function manageSounds(){
        $(rainSound).on('ended', function(e){
            rainSound.currentTime = 0;
            rainSound.play();
        });
		
        $(chainSound).on('ended', function(e){
            chainSound.currentTime = 0;
        });
		
        $(thunderSound).on('ended', function(e){
            setTimeout(thunder, 500);
            setTimeout(thunder, 6800);
            setTimeout(thunder, 16200);
            thunderSound.currentTime = 0;
            thunderSound.play();
        });
		
        $(music).on('ended', function(e){
            music.currentTIme = 0;
            music.play();
        });
    };
	
    function hideMenu(){
        mainWrapper.fadeOut(2000);
    };
	
    function thunder(){
        $('#flash').show().fadeIn(50).fadeOut(20).fadeIn(50).fadeOut(1000);
    };
    
    function addSealHoverEffect(){
    	$('#seal').on('mouseenter', function(){
    		console.log('hello');
    		$('#seal').css({
    			'background-image': 'url(source/menu/playButtonActive.png)'
    		});
    	});
    	$('#seal').on('mouseleave', function(){
    		$('#seal').css({
    			'background-image': 'url(source/menu/playButtonIdle.png)'
    		});
    	});
    }
	
    function addAnimations(){
        addCellAnimations(0);
        addCellAnimations(1);
        addCellAnimations(2);
        addSealHoverEffect();
        showEpilogue();
        showHighScores();
        addTutorialAnimations();
        addStartEvent();
    }

    function addTutorialAnimations(){
		
        $('.howTo .first .dropDownCell').on('mouseenter', function(e){
            if(menuCells[1].isExpanded){
                $('.tutorial.first').fadeIn(200);
            }
        });
		
        $('.howTo .first .dropDownCell').on('mouseleave', function(e){
            if(menuCells[1].isExpanded){
                $('.tutorial.first').fadeOut(200);
            }
        });
		
        $('.howTo .second .dropDownCell').on('mouseenter', function(e){
            if(menuCells[1].isExpanded){
                $('.tutorial.second').fadeIn(200);
            }
        });
		
        $('.howTo .second .dropDownCell').on('mouseleave', function(e){
            if(menuCells[1].isExpanded){
                $('.tutorial.second').fadeOut(200);
            }
        });
		
        $(document).on('mousemove', function(e){
            mousePos.x = e.pageX;
            mousePos.y = e.pageY;
            if($('.tutorial.first').css('display') != 'none'){
                $('.tutorial.first').css({
                    'left': mousePos.x - 430,
                    'top': mousePos.y - 110
                });
            }
            if($('.tutorial.second').css('display') != 'none'){
                $('.tutorial.second').css({
                    'left': mousePos.x - 430,
                    'top': mousePos.y - 110
                });
            }
        });
    };
	
     function addCellAnimations(index){
        var elem = menuCells[index].class;
        if(index != 2){
            $(elem).on('click', function(e){
                if(menuCells[index].isExpanded == false){
                    chainSound.play();
					
                    $(elem + ' .first .dropDownCell').show();

                    $(elem + ' .first').show().animate({
                        top: "100px"
                    }, 1000, 'easeOutBounce');
                    $(elem + ' .second').animate({
                        top: "170px"
                    }, 1000, 'easeOutBounce');
                    $(elem + ' .third').animate({
                        top: '170px'
                    }, 1000, 'easeOutBounce');

                    setTimeout(function(){
                        $(elem + ' .second').animate({
                            top: '270px'
                        }, 1000, 'easeOutBounce');
                        $(elem + ' .third').animate({
                            top: '340px'
                        }, 1000, 'easeOutBounce');
                        $(elem + ' .first .dropDownCell').show().animate({
                            top: '70px'
                        }, 1000, 'easeOutBounce', function(){
                            $(elem + ' .second').show();
                            $(elem + ' .second .dropDownCell').show();
                            setTimeout(function(){
                                $(elem + ' .second .dropDownCell').animate({
                                    top: '70px'
                                }, 1000, 'easeOutBounce', function(){
                                	menuCells[index].isExpanded = true;
                                    $(elem + ' .third').show();
                                    $(elem + ' .third .dropDownCell').show();
                                    $(elem + ' .third').animate({
                                        top: '440px'
                                    }, 1000, 'easeOutBounce');
                                    setTimeout(function(){
                                        $(elem + ' .third .dropDownCell').animate({
                                            top:'70px'
                                        }, 1000, 'easeOutBounce');
                                    }, 200);
                                });
                                
                            }, 200);
                        });
                    }, 200);
		            
		            
                }
                
            });
        }
		
        $(elem).mouseenter({
            _this: this,
            index: index
        }, function(e){
            $(elem).css({
                'background-color': 'rgba(184, 184, 148, 0.8)',
                'color': 'rgba(15, 15, 10, 1)'
            });
            $(elem + ' .dropDownCell').css({
                'color': 'rgba(255, 255, 153, 1)'
            });
        });
		
        $(elem).mouseleave({
            _this: this,
            index: index
        }, function(e){
            $(elem).css({
                'background-color': 'rgba(0, 0, 0, 0.5)',
                'color': 'rgba(255, 255, 153, 1)'
            });
        });
    };
};



var ServerObject = Class.extend({
    init: function () {
        this.baseUrl = 'http://bashibozuk.eu/games-score/?route=high-score/';
        this.gameId = 'c81e728d9d4c2f636f067f89cc14862c';
        this.currentScore = null;
        this.playerName = "asd";
    },
    //servrerObject.callmethod('is-high-score', {'callback': 'serverObject.onIsHighScore', 'score' : 100})
    callMethod: function (methodName, params) {
        var src = this.baseUrl + methodName + '&jsonp=1';

        
        for (var i in params) {
            src += '&' + i + '=' + encodeURIComponent(params[i]);
        }

        src += '&_=' + Date.now();
        console.log('callingMethod:' + methodName);
        
            
        $('.api-script').remove();

        $('<script>').attr({
            'class': 'api-script',
            'src': src
        }).appendTo($('head'));
        
        
    },

    displayErrors: function (errors) {
        alert(errors.join("\n"));
    },

    isHighScore: function (score) {
        var actionName = "is-high-score",
            params = {
                gameId: "c81e728d9d4c2f636f067f89cc14862c",
                score: score,
                callback: "serverObject.onIsHighScore",
            };

        this.currentScore = score;
        this.callMethod(actionName, params);


    },


    getHighScore: function () {
        console.log('fill1');
        var actionName = "get-high-score",
            params = {
                gameId: "c81e728d9d4c2f636f067f89cc14862c",
                limit: 100,
                offset: 0,
                callback: "serverObject.onGetHighScore",
            };
        console.log('beforeGetHighScore');
        this.callMethod(actionName, params);

        
    },

    saveHighScore: function () {
        var actionName = "save-high-score",
            params = {
                gameId: "c81e728d9d4c2f636f067f89cc14862c",
                player: this.playerName,
                score: this.currentScore,
                callback: "serverObject.onSaveHighScore",
            };

        this.callMethod(actionName, params);


    },
    
    onSaveHighScore: function (data) {
        this.currentScore = null;
        if (data.errors && data.errors.length) {
            this.displayErrors(data.errors);
            return false;
        }
        console.log("yey");


        return true;
    },

    onGetHighScore: function (data) {
        console.log('onGetHighScore');
        if (data.errors && data.errors.length) {
            return this.displayErrors(data.errors);
        }
        var dropDownCells = $(".highScores .dropDownCell"),
            highScoresDiv = $("#highScoresDiv"),
            len = data.data.length,
            html = '';
        highScoresDiv.html('')
        for (var i = 0 ; i < len; i++) {
            html = '';
            html += '<div class="highscoreRow">';
            html += '<div class="highscoreCell">' + (i+1) + '. ' + data.data[i].player + '</div>';
            html += '<div class="highscoreCell">' + '&nbsp;- ' + data.data[i].score + '</div>';
            html += '</div>';

            if (i < 3) {
                dropDownCells.eq(i).html(html);
            } else {
                var divHtml = highScoresDiv.html();
                highScoresDiv.html(divHtml+html);
            }
        }
    },

    onIsHighScore: function (data) {
        if (data.errors && data.errors.length) {
            return this.displayErrors(data.errors);
        }
        if (data.data.isHighScore === true) {
            this.saveHighScore();
        } else {
            this.currentScore = null;
        }
    },

    initialScores: function () {
        
    }

});

window.serverObject = new ServerObject();
