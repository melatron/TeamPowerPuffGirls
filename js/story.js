
Story = Class.extend({
    
    init: function () {
        this.interactableObjects = new Array();
        this.movableObjects = new Array();
        this.staticSpriteObjects = new Array();
        this.mainCanvas = document.getElementById("canvas");
        // Hero have is not yet implemented!
        this.hero = new Heroes(0, 256, 32, 32, "Gosho", 
        		{
        			context: this.mainCanvas.getContext('2d'),
        			width: 96,
        			height: 32,
        			image: 'source/heroMoveUp.png',
        			frames: 3
        		},
        		{
        			context: this.mainCanvas.getContext('2d'),
        			width: 96,
        			height: 32,
        			image: 'source/heroMoveDown.png',
        			frames: 3
        		},
        		{
        			context: this.mainCanvas.getContext('2d'),
        			width: 96,
        			height: 32,
        			image: 'source/heroMoveLeft.png',
        			frames: 3
        		},
        		{
        			context: this.mainCanvas.getContext('2d'),
        			width: 96,
        			height: 32,
        			image: 'source/heroMoveRight.png',
        			frames: 3
        		},
        		{
        			context: this.mainCanvas.getContext('2d'),
        			width: 32,
        			height: 32,
        			image: 'source/heroMoveDown.png',
        			frames: 1
        		}
        	);
    },
    clickEvent: function (ev) {
        var rect = this.mainCanvas.getBoundingClientRect(),
        	mouseX=ev.clientX-rect.left,
            mouseY=ev.clientY-rect.top,
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
    moveObjectToDirection: function (object, direction) {

    }
//    mainLoop : function() {
//    	console.log(this.hero);
//    	this.hero.checkDestination(this.hero.destination);
//    }
});


var story,
    game,
    canvas,
    context,
    humanCastle,
    dwarfCamp,
    mainLoop;


//  Everything after this paragraph have to be moved to story class.
function myfunction(e) {
    story.clickEvent(e);
}

function mainLoop(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	console.log(story.hero);
	story.hero.checkDestination(story.hero.destination);
}

window.onload = function () {
	
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
    story  = new Story();
    console.log(story.hero);
    story.mainCanvas = document.getElementById("canvas");
    game = new Game();
    humanCastle = new ClickPoint(160, 150, 10, 10, "humanCastle");
    dwarfCamp = new ClickPoint(650, 150, 10, 10, "dwarfCamp");
    story.hero.destination = {
    		x: 50,
    		y: 238
    };
    
    story.interactableObjects.push(humanCastle);
    story.interactableObjects.push(dwarfCamp);
    for (var i = 0, len = story.interactableObjects.length; i < len; i++) {
        story.interactableObjects[i].drawObj(story.mainCanvas);
    }
    mainLoop = setInterval(mainLoop, 30);
    story.mainCanvas.addEventListener("click", myfunction, false);

    window.addEventListener('keydown', listenKeyEvents, false);
    window.addEventListener('keyup', listenKeyEvents, false);
    game.putFirstTwoRandomNumbers();
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
};


