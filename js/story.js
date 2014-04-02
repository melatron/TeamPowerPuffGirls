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
            													x: 650,
            													y: 130
            												}
            ),
            treeOfLife = new ClickPoint(70, 377, 100, 100, "treeOfLife", 
            												{
            													x: 170,
            													y: 364
            												}
            )
        this.interactableObjects.push(humanCastle);
        this.interactableObjects.push(dwarfCamp);
        this.interactableObjects.push(treeOfLife);
        //
        this.movableObjects = new Array();
        this.staticSpriteObjects = new Array();
        this.mainCanvas = document.getElementById("canvas");
        
        this.images = new Array();
        // Hero have is not yet implemented!
        this.hero = new Heroes(0, 256, 32, 32, "Gosho");
    },
    
    // ---- Method for preloading images ---- //
    
    preloadImages: function() {
    	var heroSpriteUpImage = null,    // define images
    		heroSpriteDownImage = null,
    		heroSpriteLeftImage = null,
    		heroSpriteRightImage = null;
    	
    	this.images.push(heroSpriteUpImage);   // put images in array
    	this.images.push(heroSpriteDownImage);
    	this.images.push(heroSpriteLeftImage);
    	this.images.push(heroSpriteRightImage);
    	
		for (var i = 0; i < arguments.length; i++) {  // create image objects and define src
			this.images[i] = new Image();
			this.images[i].src = arguments[i];
		}
		
		heroSpriteUp = new Sprite(96, 32, 3, story.images[0], story.hero);  // create Sprites
		heroSpriteDown = new Sprite(96, 32, 3, story.images[1], story.hero);
		heroSpriteLeft = new Sprite(96, 32, 3, story.images[2], story.hero);
		heroSpriteRight = new Sprite(96, 32, 3, story.images[3], story.hero);
		heroSpriteIdle = new Sprite(32, 32, 1, story.images[1], story.hero);
		
		this.hero.spriteUp = heroSpriteUp; // define hero sprites
		this.hero.spriteDown = heroSpriteDown;
		this.hero.spriteLeft = heroSpriteLeft;
		this.hero.spriteRight = heroSpriteRight;
		this.hero.spriteIdle = heroSpriteIdle;
	},
    
    clickEvent: function (ev) {
        var rect = this.mainCanvas.getBoundingClientRect(),
            mouseX = ev.clientX - rect.left,
            mouseY = ev.clientY - rect.top,
            currentObject;
        
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
	
	story.preloadImages(
			"source/heroMoveUp.png",
			"source/heroMoveDown.png",
			"source/heroMoveLeft.png",
			"source/heroMoveRight.png"
	);
		
    game = new Game();

    mainLoop = setInterval(mainLoop, 30);
    canvas.addEventListener("click", myfunction, false);

    window.addEventListener('keydown', listenKeyEvents, false);
    window.addEventListener('keyup', listenKeyEvents, false);
    game.putFirstTwoRandomNumbers();
    
};