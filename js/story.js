Story = Class.extend({

    init: function () {
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
    },
    
    // ---- Methods for preloading images ---- //
    
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
		
		this.hero.spriteUp = new Sprite(96, 32, 3, 2, story.sprites[0], story.hero);  // create Sprites
		this.hero.spriteDown = new Sprite(96, 32, 3, 2, story.sprites[1], story.hero);
		this.hero.spriteLeft = new Sprite(96, 32, 3, 2, story.sprites[2], story.hero);
		this.hero.spriteRight = new Sprite(96, 32, 3, 2, story.sprites[3], story.hero);
		this.hero.spriteIdle = new Sprite(32, 32, 1, 2, story.sprites[1], story.hero);
		
		this.elder.spriteUp = new Sprite(96, 32, 3, 2, story.sprites[4], story.elder);
		this.elder.spriteDown = new Sprite(96, 32, 3, 2, story.sprites[5], story.elder);
		this.elder.spriteLeft = new Sprite(96, 32, 3, 2, story.sprites[6], story.elder);
		this.elder.spriteRight = new Sprite(96, 32, 3, 2, story.sprites[7], story.elder);
		this.elder.spriteIdle = new Sprite(32, 32, 1, 2, story.sprites[5], story.elder);

        this.dragon.spriteUp = new Sprite(384, 96, 4, 6, story.sprites[8], story.dragon);
        this.dragon.spriteDown = new Sprite(384, 96, 4, 6, story.sprites[9], story.dragon);
        this.dragon.spriteLeft = new Sprite(384, 96, 4, 6, story.sprites[10], story.dragon);
        this.dragon.spriteRight = new Sprite(384, 96, 4, 6, story.sprites[11], story.dragon);
        this.dragon.spriteIdle = new Sprite(96, 96, 1, 6, story.sprites[9], story.dragon);
        this.dragon.getDestinationDelay = 250;
	},
    
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
	
    clickEvent: function (ev) {
        var rect = this.mainCanvas.getBoundingClientRect(),
            mouseX = ev.clientX - rect.left,
            mouseY = ev.clientY - rect.top,
            currentObject;
        
        console.log("Mouse X: " + mouseX + " Mouse Y: " + mouseY);
        
        for (var i = 0; i < this.interactableObjects.length; i++) {  // check if clicked
            currentObject = this.interactableObjects[i];
            if (currentObject.checkIfClicked(mouseX, mouseY)) {
                this.hero.setDestinaion(currentObject);         //set destination for hero

                for (var j = 0; j < this.interactableObjects.length; j++){
                    this.interactableObjects[j].isInteracting = false;
                }
            }
        }
    },
    checkIfSpeaking: function () {
        for (var i = 0; i < this.interactableObjects.length; i++) {
            if (this.interactableObjects[i].isInteracting) {
                this.interactableObjects[i].drawSpeechBubble();
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
    //    mainLoop : function() {
    //      console.log(this.hero);
    //      this.hero.checkDestination(this.hero.destination);
    //    }
});


var story,
    game,
    context,
    humanCastle,
    dwarfCamp,
    mainLoop;


//  Everything after this paragraph have to be moved to story class.
function myfunction(e) {
    story.clickEvent(e);
}

function mainLoop() {
	ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    story.elder.setRandomDestination()
    story.hero.moveHeroToDestination();
    story.dragon.setRandomDestination();
    story.drawInteractableObject();
    story.checkIfSpeaking();
    ctx.restore();
    
}
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
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	story = new Story();
	
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
	soundtrack = new Audio();
	soundtrack.src = 'source/mainSoundtrack.mp3';
	soundtrack.load();
	soundtrack.play();
    game = new Game();

    mainLoop = setInterval(mainLoop, 30);
    canvas.addEventListener("click", myfunction, false);

    window.addEventListener('keydown', listenKeyEvents, false);
    window.addEventListener('keyup', listenKeyEvents, false);
    game.putFirstTwoRandomNumbers();
    
};