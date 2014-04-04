Story = Class.extend({

    init: function () {
        this.interactableObjects = new Array();
        var humanCastle = new ClickPoint(100, 50, 140, 100, "humanCastle",
        													{
        														x: 170,
        														y: 150
        													}
        	),
            dwarfCamp = new ClickPoint(622, 68, 100, 50, "dwarfCamp", 
            												{
            													x: 660,
            													y: 130
            												}
            ),
            treeOfLife = new ClickPoint(70, 377, 100, 100, "treeOfLife", 
            												{
            													x: 170,
            													y: 364
            												}
            ),
            mage = new ClickPoint(790, 200, 50, 50, 'mage',
            												{
            													x:830,
            													y:250
            												}
            
            
            );
        this.interactableObjects.push(humanCastle);
        this.interactableObjects.push(dwarfCamp);
        this.interactableObjects.push(treeOfLife);
        this.interactableObjects.push(mage);
        //
        this.movableObjects = new Array();
        this.staticSpriteObjects = new Array();
        this.mainCanvas = document.getElementById("canvas");
        
        this.sprites = new Array();
        this.portraits = new Array();
        // Hero have is not yet implemented!
        this.hero = new Heroes(0, 256, 32, 32, "Gosho");
    },
    
    // ---- Methods for preloading images ---- //
    
    preloadSprites: function() {
    	//define sprites
    	var heroSpriteUpImage = null, 
    		heroSpriteDownImage = null,
    		heroSpriteLeftImage = null,
    		heroSpriteRightImage = null;
    	
    	this.sprites.push(heroSpriteUpImage);   // put images in array
    	this.sprites.push(heroSpriteDownImage);
    	this.sprites.push(heroSpriteLeftImage);
    	this.sprites.push(heroSpriteRightImage);
    	
		for (var i = 0; i < arguments.length; i++) {  // create image objects and define src
			this.sprites[i] = new Image();
			this.sprites[i].src = arguments[i];
		}
		
		heroSpriteUp = new Sprite(96, 32, 3, story.sprites[0], story.hero);  // create Sprites
		heroSpriteDown = new Sprite(96, 32, 3, story.sprites[1], story.hero);
		heroSpriteLeft = new Sprite(96, 32, 3, story.sprites[2], story.hero);
		heroSpriteRight = new Sprite(96, 32, 3, story.sprites[3], story.hero);
		heroSpriteIdle = new Sprite(32, 32, 1, story.sprites[1], story.hero);
		
		this.hero.spriteUp = heroSpriteUp; // define hero sprites
		this.hero.spriteDown = heroSpriteDown;
		this.hero.spriteLeft = heroSpriteLeft;
		this.hero.spriteRight = heroSpriteRight;
		this.hero.spriteIdle = heroSpriteIdle;
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
			this.portraits[i] = arguments[i];
		}
		
		this.hero.image = this.portraits[0];
		this.interactableObjects[3].image = this.portraits[1];
		this.interactableObjects[2].image = this.portraits[2];
		this.interactableObjects[1].image = this.portraits[3];
		this.interactableObjects[0].image = this.portraits[4];
		
	},
	
    clickEvent: function (ev) {
        var rect = this.mainCanvas.getBoundingClientRect(),
            mouseX = ev.clientX - rect.left,
            mouseY = ev.clientY - rect.top,
            currentObject;
        
        console.log("Mouse X: " + mouseX + " Mouse Y: " + mouseY);
        
        for (var i = 0, len = this.interactableObjects.length; i < len; i++) {  // check if clicked
            currentObject = this.interactableObjects[i];
            if (currentObject.checkIfClicked(mouseX, mouseY)) {
                this.hero.setDestinaion(currentObject);         //set destination for hero
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
    story.hero.checkDestination(story.hero.destination);
    story.drawInteractableObject();
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
			"source/heroMoveRight.png"
	);
	
	story.preloadPortraits(
			'source/heroPortrait.png',
			'source/elderPortrait.png',
			'source/elfPortrait.png',
			'source/dwarfPortrait.png',
			'source/kingnPortraint.png'
	);
		
    game = new Game();

    mainLoop = setInterval(mainLoop, 30);
    canvas.addEventListener("click", myfunction, false);

    window.addEventListener('keydown', listenKeyEvents, false);
    window.addEventListener('keyup', listenKeyEvents, false);
    game.putFirstTwoRandomNumbers();
    
};