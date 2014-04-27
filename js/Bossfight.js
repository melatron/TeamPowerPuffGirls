Bossfight = Game.extend({
	init: function(){
	    this._super();
	    var self = this;

	    this.plot = $("#pathFinder");
	    this.canvas = $('#bossFightCanvas')[0];
	    this.gameContext = $('#pathFinderCanvas')[0].getContext('2d');

	    this.width = 630;
	    this.height = 224;

	    this.friction = 0.8;
	    this.gravity = 0.35;

	    this.mainCharacterDead = false;
	    this.deaths = 0;

	    this.update = function () {

	        self.updateCharacter();
	        self.gameContext.clearRect(0, 0, self.width, self.height);

	        self.colLoopCheck();
	        //self.drawBackground();
	        self.checkIfDead();
	        if (!self.stopEvents) {
	            self.mainCharacter.drawCharacter();
	        }
	        if (!self.gameOver) {
	            self.animation = requestAnimationFrame(self.update);
	        }
	    };
	},
	addEventListeners: function () {

	},
	colCheck: function (shapeA, shapeB) {
	    // get the vectors to check against
	    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
            vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
            // add the half widths and half heights of the objects
            hWidths = (shapeA.width / 2) + (shapeB.width / 2),
            hHeights = (shapeA.height / 2) + (shapeB.height / 2),
            colDir = null;

	    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
	    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
	        // figures out on which side we are colliding (top, bottom, left, or right)
	        var oX = hWidths - Math.abs(vX),
                oY = hHeights - Math.abs(vY);
	        if (oX >= oY) {
	            if (vY > 0) {
	                colDir = "t";
	                shapeA.y += oY;
	            } else {
	                colDir = "b";
	                shapeA.y -= oY;
	            }
	        } else {
	            if (vX > 0) {
	                colDir = "l";
	                shapeA.x += oX;
	            } else {
	                colDir = "r";
	                shapeA.x -= oX;
	            }
	        }
	    }
	    return colDir;
	},

	start: function (obj, getReward) {
	    this._super(obj, getReward);
	    this.getReward = getReward;

	    var instructions = '"Space": creates temporary platform. "c": creates permanent checkpoint. Get to the maroon point!';
	    this.writeOnScroll(instructions, {
	        fontSize: '12px'
	    });
	    this.deaths = 0;
	    this.stopEvents = false;
	    this.mainCharacter.addSprites();
	    this.gameOver = false;
	    this.addEventListeners();
	    this.addGameToPlot();
	    this.update();
	},
	endGame: function () {
	    this.score = 250000 / this.deaths;
	    this.stopEvents = true;
	    clearInterval(this.interval);
	    this.removeGameFromPlot();
	    this.gameOver = true;

	    // add condition : if you've done well in the game get the reward
	    if (this.deaths < 30) {
	        this.getReward('armor');
	    }
	},
});

BObject = Class.extend({
	init: function(x, y, width, height, ctx){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
});

BMovableObject = BObject.extend({
    init: function (x, y, width, height, speed) {
        this.gameOver = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.onObject = false;
        this.jumping = false;
        this.grounded = false;
        this.gameContext = ctx;

        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.velX = 0;
        this.velY = 0;
    },
    addSprites: function () {
    
    },
    move: function () {
        if (this.grounded) {
            this.velY = 0;
        }
        this.x += this.velX;
        this.y += this.velY;

    },
    drawCharacter: function () {
        if (this.moveRight) {
            this.spriteRight.drawSprite();
        }
        else if (this.moveLeft) {
            this.spriteLeft.drawSprite();
        }
        else {
            this.spriteIdle.drawSprite();
        }
    },
    gravityAndFrictionUpdate: function (friction, gravity) {
        this.velX *= friction;
        this.velY += gravity;
    },
});