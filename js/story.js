Story = Class.extend({

    init: function () {
        var self = this;
        this.mainLoop = function () {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            self.elder.setRandomDestination()
            self.hero.moveHeroToDestination();
            self.dragon.setRandomDestination();
            self.drawInteractableObject();
            self.checkIfSpeaking();
            //self.hero.drawSpeechBubble();
            self.soundTrack.startNextSong();
            ctx.restore();
            //console.log(soundtrack.ended);
        };
        this.interactableObjects = new Array();
        var humanCastle = new ClickPoint(100, 50, 140, 100, "humanCastle",
        													{
        														x: 175,
        														y: 150
        													}
        	),
            dwarfCamp = new ClickPoint(622, 68, 100, 50, "dwarfCamp", 
            												{
            													x: 655,
            													y: 130
            												}
            ),
            treeOfLife = new ClickPoint(70, 377, 100, 100, "treeOfLife", 
            												{
            													x: 175,
            													y: 364
            												}
            ),
            mage = new ClickPoint(790, 200, 50, 50, 'mage',
            												{
            													x: 810,
            													y: 250
            												}
            
            
            ),
            dragon = new ClickPoint(675, 300, 50, 50, 'dragon',
                                                            {
                                                                x: 660,
                                                                y: 345
                                                            }
            );
        this.interactableObjects.push(humanCastle);
        this.interactableObjects.push(dwarfCamp);
        this.interactableObjects.push(treeOfLife);
        this.interactableObjects.push(mage);
        this.interactableObjects.push(dragon);
        //
        this.movableObjects = new Array();
        this.staticSpriteObjects = new Array();
        this.mainCanvas = document.getElementById("canvas");
        
        this.sprites = new Array();
        this.portraits = new Array();
        // Hero have is not yet implemented!
        this.hero = new Heroes(0, 256, 32, 32, "hero");
        
        this.elder = new AIMovableObject(790, 200, 32, 32, "theMage", this.interactableObjects[3], {
            x:820,
            y:200
        }, {
            xMin: 780,
            xMax: 820,
            yMin: 200,
            yMax: 240
        });
        this.dragon = new AIMovableObject(730, 420, 96, 96, "dragon", this.interactableObjects[4], {
            x: 780,
            y: 420
        }, {
            xMin: 680,
            xMax: 810,
            yMin: 300,
            yMax: 420
        });

        this.soundTrack = new PlayList();
    },
    
    // ---- Methods for preloading images ---- //
    addEvent: function () {
        $('canvas').on('click', this, this.clickEvent);
        $(document).on('keyup', this, this.handleKeyPressed);
    },
    preloadSprites: function() {
    	//define sprites
    	var heroSpriteUpImage = null, 
    		heroSpriteDownImage = null,
    		heroSpriteLeftImage = null,
    		heroSpriteRightImage = null,
    		elderSpriteUpImage = null, 
    		elderSpriteDownImage = null,
    		elderSpriteLeftImage = null,
    		elderSpriteRightImage = null,
            dragonSpriteUpImage = null,
            dragonSpriteDownImage = null,
            dragonSpriteLeftImage = null,
            dragonSpriteRightImage = null;
    	
    	this.sprites.push(heroSpriteUpImage);   // put images in array
    	this.sprites.push(heroSpriteDownImage);
    	this.sprites.push(heroSpriteLeftImage);
    	this.sprites.push(heroSpriteRightImage);
    	
    	this.sprites.push(elderSpriteUpImage);
    	this.sprites.push(elderSpriteDownImage);
    	this.sprites.push(elderSpriteLeftImage);
    	this.sprites.push(elderSpriteRightImage);

        this.sprites.push(dragonSpriteUpImage);
        this.sprites.push(dragonSpriteDownImage);
        this.sprites.push(dragonSpriteLeftImage);
        this.sprites.push(dragonSpriteRightImage);
    	
		for (var i = 0; i < arguments.length; i++) {  // create image objects and define src
			this.sprites[i] = new Image();
			this.sprites[i].src = arguments[i];
		}
		
		this.hero.spriteUp = new Sprite(96, 32, 3, 2, story.sprites[0], story.hero, ctx);  // create Sprites
		this.hero.spriteDown = new Sprite(96, 32, 3, 2, story.sprites[1], story.hero, ctx);
		this.hero.spriteLeft = new Sprite(96, 32, 3, 2, story.sprites[2], story.hero, ctx);
		this.hero.spriteRight = new Sprite(96, 32, 3, 2, story.sprites[3], story.hero, ctx);
		this.hero.spriteIdle = new Sprite(32, 32, 1, 2, story.sprites[1], story.hero, ctx);
		
		this.elder.spriteUp = new Sprite(96, 32, 3, 2, story.sprites[4], story.elder, ctx);
		this.elder.spriteDown = new Sprite(96, 32, 3, 2, story.sprites[5], story.elder, ctx);
		this.elder.spriteLeft = new Sprite(96, 32, 3, 2, story.sprites[6], story.elder, ctx);
		this.elder.spriteRight = new Sprite(96, 32, 3, 2, story.sprites[7], story.elder, ctx);
		this.elder.spriteIdle = new Sprite(32, 32, 1, 2, story.sprites[5], story.elder, ctx);

        this.dragon.spriteUp = new Sprite(384, 96, 4, 6, story.sprites[8], story.dragon, ctx);
        this.dragon.spriteDown = new Sprite(384, 96, 4, 6, story.sprites[9], story.dragon, ctx);
        this.dragon.spriteLeft = new Sprite(384, 96, 4, 6, story.sprites[10], story.dragon, ctx);
        this.dragon.spriteRight = new Sprite(384, 96, 4, 6, story.sprites[11], story.dragon, ctx);
        this.dragon.spriteIdle = new Sprite(96, 96, 1, 6, story.sprites[9], story.dragon, ctx);
        this.dragon.getDestinationDelay = 250;
	},
    
	// ==== Portrait preloader ==== //
	
	preloadPortraits: function(){
		var heroPortrait = null,
			elfPortrait = null,
			elderPortrait = null,
			kingPortrait = null,
			dwarfPortrait = null;
		
		this.portraits.push(heroPortrait);
		this.portraits.push(elderPortrait);
		this.portraits.push(elfPortrait);
		this.portraits.push(dwarfPortrait);
		this.portraits.push(kingPortrait);
		
		for (var i = 0; i < arguments.length; i++){
			this.portraits[i] = new Image();
			this.portraits[i].src = arguments[i];
		}
		
		this.hero.setImage(this.portraits[0]);
		this.interactableObjects[3].setImage(this.portraits[1]);
		this.interactableObjects[2].setImage(this.portraits[2]);
		this.interactableObjects[1].setImage(this.portraits[3]);
		this.interactableObjects[0].setImage(this.portraits[4]);
		
	},
	handleKeyPressed: function (ev) {
	    ev.preventDefault();
	    switch (ev.keyCode) {
	        case 13:
	            console.log(ev);
	            if (ev.type == 'keyup') {
	                ev.data.changeSpeaker();
	            }
	            break;

	    }
	},
	clickEvent: function (ev) {
	    var rect = ev.data.mainCanvas.getBoundingClientRect(),
            mouseX = ev.clientX - rect.left,
            mouseY = ev.clientY - rect.top,
            currentObject;
        
        console.log("Mouse X: " + mouseX + " Mouse Y: " + mouseY);
        
        for (var i = 0; i < ev.data.interactableObjects.length; i++) {  // check if clicked
            currentObject = ev.data.interactableObjects[i];
            if (currentObject.checkIfClicked(mouseX, mouseY)) {
                //ev.data.hero.setDestinaion(currentObject);                          //set destination for hero
               // ev.data.hero.speakingTo = currentObject;                            //set currentObject in hero as speakingTo
               // ev.data.hero.getSpeech("hero" + currentObject.name);                // get hero speach for the currentObject
                // ev.data.hero.speech.conversetionEnded = false;                      // set conversationEnded to false for a new dialog
                ev.data.hero.prepareObjectForSpeaking(currentObject);
                for (var j = 0; j < ev.data.interactableObjects.length; j++) {
                    ev.data.interactableObjects[j].isInteracting = false;           // set all other click points to "inactive"
                }
            }
        }
    },
	checkIfSpeaking: function () {
	    for (var i = 0; i < this.interactableObjects.length; i++) {
	        if (this.interactableObjects[i].isInteracting) {
	            this.hero.portrait.drawPortrait();
	            this.interactableObjects[i].portrait.drawPortrait();
	            if (this.interactableObjects[i].isSpeaking && !(this.interactableObjects[i].speech.conversetionEnded)) {
	                this.interactableObjects[i].drawSpeechBubble();
	            }
	            else if (this.hero.isSpeaking && !(this.hero.speech.conversetionEnded)) {
	                this.hero.drawSpeechBubble();
	            }
	        }
	    }
	},
	changeSpeaker: function () {
	    if (this.hero.speakingTo.isInteracting) {
	        if (!(this.hero.speakingTo.speech.conversetionEnded && this.hero.speech.conversetionEnded)) {
	            if (this.hero.isSpeaking) {
	                this.hero.isSpeaking = false;
	                this.hero.speakingTo.isSpeaking = true;
	                this.hero.speech.counter += 1;
	            }
	            else {
	                this.hero.speakingTo.isSpeaking = false;
	                this.hero.isSpeaking = true;
	                this.hero.speakingTo.speech.counter += 1;
	                console.log(this.hero.speakingTo)
	            }
	        }
	        else {
	            this.hero.speakingTo.isSpeaking = false;
	            this.hero.isSpeaking = false;
	        }
	    }
	},
    addInteractableObject: function (iObject) {
        this.interactableObjects.push(iObject);
    },
    addMovableObjects: function (mObject) {
        this.movableObjects.push(mObject);
    },
    addStaticSpriteObjects: function (sObject) {
        this.staticSpriteObjects.push(sObject);
    },
    searchInteractableObjectByName: function (name) {
        var array = this.interactableObjects;
        for (var i = 0; i <= array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    },
    searchMovableObjectsByName: function (name) {
        var array = this.MovableObjects;
        for (var i = 0; i <= array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    },
    drawInteractableObject: function () {
        for (var i = 0, len = this.interactableObjects.length; i < len; i++) {
            this.interactableObjects[i].drawObj();
        }
    }
});


var story,
    game,
    context,
    humanCastle,
    dwarfCamp,
    mainLoop,
    squareGame;


//  Everything after this paragraph has to be moved to the story class.

function listenKeyEvents(e) {
    switch (e.keyCode) {
        case 37:
            if (e.type == 'keydown') {
                game.move("left");
            }
            break;
        case 38:
            if (e.type == 'keydown') {
                game.move("up");
            }
            break;
        case 39:
            if (e.type == 'keydown') {
                game.move("right");
            }
            break;
        case 40:
            if (e.type == 'keydown') {
                game.move("down");
            }
            break;
    }
}
window.onload = function () {
	canvas = $("#canvas")[0];
	ctx = canvas.getContext('2d');
	story = new Story();

	squareGame = new SquareGame();
	squareGame.populateMap();
	squareGame.drawMaps();

	
	Inventory = new Inventory();
	Inventory.getItem('axe');

	story.preloadSprites(
			"source/heroMoveUp.png",
			"source/heroMoveDown.png",
			"source/heroMoveLeft.png",
			"source/heroMoveRight.png",
			"source/elderMoveUp.png",
			"source/elderMoveDown.png",
			"source/elderMoveLeft.png",
			"source/elderMoveRight.png",
            "source/dragonMoveUp.png",
            "source/dragonMoveDown.png",
            "source/dragonMoveLeft.png",
            "source/dragonMoveRight.png"
	);
	
	story.preloadPortraits(
			'source/heroPortrait.png',
			'source/elderPortrait.png',
			'source/elfPortrait.png',
			'source/dwarfPortrait.png',
			'source/kingPortrait.png'
	);
	story.soundTrack.preloadMainSounds('source/mainSoundtrack.mp3',
                                        'source/DaniS.mp3');
	story.soundTrack.preloadQuestSounds('source/rada.mp3');
    game = new Game();
    story.addEvent();
    mainLoop = setInterval(story.mainLoop, 30);
    
    window.addEventListener('keydown', listenKeyEvents, false);
    window.addEventListener('keyup', listenKeyEvents, false);
    game.putFirstTwoRandomNumbers();

    //elfGame = new ElfGame(); 
    //elfGame.start();
};
