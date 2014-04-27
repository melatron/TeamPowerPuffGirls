Bossfight = Game.extend({
	init: function(){
	    this._super();
	    var self = this;

	    this.plot = $("#pathFinder");
	    this.canvas = $('#bossFightCanvas')[0];
	    this.gameContext = $('#pathFinderCanvas')[0].getContext('2d');
	}
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