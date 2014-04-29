Bossfight = Game.extend({
    init: function () {
        this._super();
        var self = this;
        this.width = 1024;
        this.height = 512;
        //this.plot = $("#pathFinder");
        this.canvas = $('#bossFightCanvas')[0];
        this.gameContext = $('#bossFightCanvas')[0].getContext('2d');
        this.keys = [];


        this.friction = 0.8;
        this.gravity = 0.45;

        this.mainCharacterDead = false;
        this.deaths = 0;
        // Arrays
        this.mapBoxes = [];
        this.bottomSpikes = [];
        this.topSpikes = [];
        this.verticalSpikes = [];
        this.movableStepableObjects = [];
        this.lightningOnInterval = [];
        this.ballOfDeaths = [];
        this.finishBlocks = [];



        //this.score = 0;
        //this.gameOver = false;



        this.startingPoint = { x: 100, y: 100 };
        this.mainCharacter = new DragonSlayer(this.startingPoint.x, this.startingPoint.y, 22, 15, 3, this.gameContext);


        this.animation = null;
        this.update = function () {

            self.updateCharacter();
            self.gameContext.clearRect(0, 0, self.width, self.height);

            self.colLoopCheck();
            //self.drawBackground();
            //self.checkIfDead();
            self.mainCharacter.drawCharacter();
            if (!self.gameOver) {
                self.animation = requestAnimationFrame(self.update);
            }
        };
    },
    updateCharacter: function () {
        this.mainCharacter.listenKeyEvents(this.keys);
        this.mainCharacter.gravityAndFrictionUpdate(this.friction, this.gravity);
    },
    colLoopCheck: function () {
        this.gameContext.fillStyle = "black";

        this.mainCharacter.grounded = false;
        this.mainBlocks(this.mapBoxes, 'black', false);

        this.mainCharacter.move();
    },
    mainBlocks: function (blocks, color, flag) {
        this.gameContext.fillStyle = color;
        var len = blocks.length;
        for (var i = 0; i < len; i++) {
            if (blocks[i] != null) {
                this.gameContext.fillRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);

                var dir = this.colCheck(this.mainCharacter, blocks[i]);

                if (dir === "l" || dir === "r") {
                    this.mainCharacter.velX = 0;
                    this.mainCharacter.jumping = false;
                } else if (dir === "b") {
                    this.mainCharacter.grounded = true;
                    this.mainCharacter.jumping = false;
                } else if (dir === "t") {
                    this.mainCharacter.velY *= -1;
                }
            }
        }
    },
    bottomSpires: function (blocks, color) {
        this.gameContext.fillStyle = color;
        var len = blocks.length;
        for (var i = 0; i < len; i++) {
            //this.gameContext.fillRect(blocks[i].x, blocks[i].y + 17, blocks[i].width, blocks[i].height - 17);

            var dir = this.colCheck(this.mainCharacter, blocks[i]);

            if (dir === "l" || dir === "r") {
                this.mainCharacter.velX = 0;
                this.mainCharacter.jumping = false;
            } else if (dir === "b") {
                this.mainCharacter.grounded = true;
                this.mainCharacter.jumping = false;
            } else if (dir === "t") {
                this.mainCharacterDead = true;
                this.mainCharacter.velY *= -1;
            }
        }
    },
    topSpires: function (blocks, color) {
        this.gameContext.fillStyle = color;
        var len = blocks.length;
        for (var i = 0; i < len; i++) {
            //this.gameContext.fillRect(blocks[i].x, blocks[i].y + 17, blocks[i].width, blocks[i].height - 17);

            var dir = this.colCheck(this.mainCharacter, blocks[i]);

            if (dir === "l" || dir === "r") {
                this.mainCharacter.velX = 0;
                this.mainCharacter.jumping = false;
            } else if (dir === "b") {
                this.mainCharacter.grounded = true;
                this.mainCharacter.jumping = false;

                this.mainCharacterDead = true;
            } else if (dir === "t") {
                this.mainCharacter.velY *= -1;
            }
        }
    },
    verticalSpires: function (blocks, isShown, isDrown, color) {
        if (isShown) {
            var len = blocks.length;
            for (var i = 0; i < len; i++) {
                if (isDrown) {
                    blocks[i].sprite.drawSprite();
                }
                else {
                    this.gameContext.fillStyle = color;
                    //this.gameContext.fillRect(blocks[i].x, blocks[i].y + 17, blocks[i].width, blocks[i].height - 17);
                }
                var dir = this.colCheck(this.mainCharacter, blocks[i]);
                if (dir === "l" || dir === "r") {
                    this.mainCharacterDead = true;
                    this.mainCharacter.velX = 0;
                    this.mainCharacter.jumping = false;
                } else if (dir === "b") {
                    this.mainCharacter.grounded = true;
                    this.mainCharacter.jumping = false;
                } else if (dir === "t") {
                    this.mainCharacter.velY *= -1;
                }
            }
        }
    },
    ballOfDeath: function (blocks, color) {
        this.gameContext.fillStyle = color;
        var len = blocks.length;
        for (var i = 0; i < len; i++) {
            //this.gameContext.fillRect(blocks[i].x, blocks[i].y + 17, blocks[i].width, blocks[i].height - 17);
            var dir = this.colCheck(this.mainCharacter, blocks[i]);
            if (dir === "l" || dir === "r") {
                this.mainCharacterDead = true;
                this.mainCharacter.velX = 0;
                this.mainCharacter.jumping = false;
            } else if (dir === "b") {
                this.mainCharacterDead = true;
                this.mainCharacter.grounded = true;
                this.mainCharacter.jumping = false;
            } else if (dir === "t") {
                this.mainCharacterDead = true;
                this.mainCharacter.velY *= -1;
            }
        }
    },
    movableBlocks: function (blocks, color) {
        this.gameContext.fillStyle = color;
        var len = blocks.length;
        for (var i = 0; i < len; i++) {
            var a = blocks[i];

            this.gameContext.fillRect(a.x + 2, a.y + 17, a.width - 2, a.height - 17);
            var dir = this.colCheck(this.mainCharacter, a);
            //
            if (dir === "l" || dir === "r") {

                this.mainCharacter.velX = 0;
                this.mainCharacter.jumping = false;
            } else if (dir === "b") {
                this.mainCharacter.grounded = true;
                this.mainCharacter.jumping = false;
                if (a.moveLeft) {
                    this.mainCharacter.velX -= a.speed / (261 / 100);//(299 / 100);
                }
                else if (a.moveRight) {
                    this.mainCharacter.velX += a.speed / (261 / 100);//(299 / 100);
                }
                else if (a.moveUp) {
                    this.mainCharacter.y -= a.speed * 2;
                }
                else if (a.moveDown) {
                    this.mainCharacter.y += a.speed / 2;
                }

            } else if (dir === "t") {

                this.mainCharacter.velY *= -1;                                                                              //
            }
            a.updatePosition();
            a.move();
        }
    },
    finishBlock: function (blocks, color) {
        this.gameContext.fillStyle = color;
        var len = blocks.length;
        for (var i = 0; i < len; i++) {
            if (blocks[i] != null) {
                this.gameContext.fillRect(blocks[i].x, blocks[i].y + 17, blocks[i].width, blocks[i].height - 17);

                var dir = this.colCheck(this.mainCharacter, blocks[i]);

                if (dir === "l" || dir === "r") {
                    this.finishLevel();
                    this.mainCharacter.velX = 0;
                    this.mainCharacter.jumping = false;
                } else if (dir === "b") {
                    this.finishLevel();
                    this.mainCharacter.grounded = true;
                    this.mainCharacter.jumping = false;
                } else if (dir === "t") {
                    this.finishLevel();
                    this.mainCharacter.velY *= -1;
                }
            }
        }
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
    checkIfDead: function () {
        if (this.mainCharacterDead) {
            this.resetMainCharacter();
            this.deaths++;
        }
    },
    resetMainCharacter: function () {
        this.mainCharacter.x = this.startingPoint.x;
        this.mainCharacter.y = this.startingPoint.y;

        this.mainCharacterDead = false;
    },
    clickEvent: function (ev) {
        if (!ev.data.stopEvents) {
            console.log('hello');
            var rect = ev.data.canvas.getBoundingClientRect(),
                mouseX = ev.clientX - rect.left,
                mouseY = ev.clientY - rect.top;
            ev.data.resetMainCharacter(mouseX, mouseY);
        }
    },
    addEventListeners: function () {

        var self = this;
        //$('#pathFinderCanvas').on('click', this, this.clickEvent);
        $(document).on('keydown', function (e) {
            if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 39 || e.keyCode == 67) {
                e.preventDefault();
            }
            if (!self.stopEvents) {
                self.keys[e.keyCode] = true;
            }
            else {
                self.keys[e.keyCode] = false;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 39 || e.keyCode == 67) {
                e.preventDefault();
            }
            self.keys[e.keyCode] = false;
        });
    },
    finishLevel: function () {
        this.currentLevel++;
        if (this.currentLevel <= 2) {
            this.startLevel(this.currentLevel);
        }
        else {
            this.endGame();
        }
    },
    startLevel: function () {
        this.mapBoxes = [];
        this.bottomSpikes = [];
        this.topSpikes = [];
        this.verticalSpikes = [];
        this.movableStepableObjects = [];
        this.lightningOnInterval = [];
        this.ballOfDeaths = [];
        this.finishBlocks = [];

        this.startingPoint = { x: 100, y: 100 };
        this.mainCharacter = new DragonSlayer(this.startingPoint.x, this.startingPoint.y, 22, 15, 3, this.gameContext);
        this.mainCharacter.addSprites();


        this.mapBoxes.push(new BObject(0, -20, 40, this.height));
        this.mapBoxes.push(new BObject(30, this.height - 200, this.width - 60, 200));
        this.mapBoxes.push(new BObject(this.width - 40, -20, 30, this.height));

    },
    start: function (obj) {
        this._super(obj);


        this.deaths = 0;
        this.stopEvents = false;
        
        this.gameOver = false;
        ////
        ////
        this.startLevel();
        this.addEventListeners();
        this.update();
    },
    endGame: function () {
        this.score = 250000 / this.deaths;
        this.stopEvents = true;
        clearInterval(this.interval);
        this.gameOver = true;
        this.currentLevel = 0;

        // add condition : if you've done well in the game get the reward
        if (this.deaths < 30) {
            this.getReward('armor');
        }
    },

});

BObject = Class.extend({
    init: function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
});
BMovableObjects = BObject.extend({
    init: function (x, y, width, height, speed) {
        this._super(x, y, width, height);
        this.gameOver = false;

        this.speed = speed;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.velX = 0;
        this.velY = 0;
    },
    move: function () {
        this.x += this.velX;
        this.y += this.velY;
    }
});
MovablePlatformz = BMovableObjects.extend({
    init: function (x, y, width, height, speed, fromLR, toLR, fromUD, toUD) {
        this._super(x, y, width, height, speed);
        this.fromLR = fromLR;
        this.toLR = toLR;
        this.fromUD = fromUD;
        this.toUD = toUD;
    },
    updatePosition: function () {
        if (this.fromUD == 0 && this.toUD == 0) {

            if (this.x >= this.toLR) {
                this.moveLeft = true;
                this.moveRight = false;
                this.velX = -this.speed;
            }
            else if (this.x <= this.fromLR) {
                this.moveLeft = false;
                this.moveRight = true;
                this.velX = this.speed;
            }
        }
        else {
            if (this.y >= this.toUD) {
                this.moveUp = true;
                this.moveDown = false;
                this.velY = -this.speed
            }
            else if (this.y <= this.fromUD) {
                this.moveUp = false;
                this.moveDown = true;
                this.velY = this.speed
            }
        }
    },
});
DragonSlayer = BMovableObjects.extend({
    init: function (x, y, width, height, speed, ctx) {
        this._super(x, y, width, height, speed);
        this.onObject = false;
        this.jumping = false;
        this.grounded = false;
        this.gameContext = ctx;

        this.spriteIdle = null;
        this.spriteLeft = null;
        this.spriteRight = null;
    },
    addSprites: function () {
        this.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(2), this, this.gameContext);
        this.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(3), this, this.gameContext);
        this.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(1), this, this.gameContext);
        
    },
    move: function () {
        if (this.grounded) {
            this.velY = 0;
        }
        this._super();
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
        //this.gameContext.fillStyle = "black";
        //this.gameContext.fillRect(this.x, this.y , this.width, this.height);
    },
    gravityAndFrictionUpdate: function (friction, gravity) {
        this.velX *= friction;
        this.velY += gravity;
    },
    listenKeyEvents: function (keys) {
        if (keys[38]) {
            // up arrow
            if (!this.jumping && this.grounded) {
                this.jumping = true;
                this.grounded = false;
                this.velY = -this.speed * 2;
            }
        }
        if (keys[39]) {
            // right arrow
            if (this.velX < this.speed) {
                this.moveRight = true;

                this.velX++;
            }
        }
        else {
            this.moveRight = false;
        }
        if (keys[37]) {
            // left arrow
            if (this.velX > -this.speed) {
                this.moveLeft = true;
                this.velX--;
            }
        }
        else {
            this.moveLeft = false;
        }
    }

});