
Story = Class.extend({
    
    init: function () {
        this.interactableObjects = new Array();
        this.movableObjects = new Array();
        this.staticSpriteObjects = new Array();
        this.mainCanvas;
        // Hero have is not yet implemented!
        this.hero = new Heroes();
    },
    clickEvent: function (ev) {
        var rect = this.mainCanvas.getBoundingClientRect();
        var mouseX=ev.clientX-rect.left,
            mouseY=ev.clientY-rect.top;
        for (var i = 0, len = this.interactableObjects.length; i < len; i++) {
            if (this.interactableObjects[i].checkIfClicked(mouseX, mouseY)) {
                //console.log(this.interactableObjects[i]);
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
})


var story = new Story(),
    game = new Game,
    humanCastle = new ClickPoint(160, 150, 10, 10, "humanCastle"),
    dwarfCamp = new ClickPoint(650, 150, 10, 10, "dwarfCamp");


//  Everything after this paragraph have to be moved to story class.
function myfunction(e) {
    story.clickEvent(e);
}

window.onload = function () {

    story.interactableObjects.push(humanCastle);
    story.interactableObjects.push(dwarfCamp);
    story.mainCanvas = document.getElementById("canvas");
    for (var i = 0, len = story.interactableObjects.length; i < len; i++) {
        story.interactableObjects[i].drawObj(story.mainCanvas);
    }
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

