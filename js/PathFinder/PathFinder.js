PFObjects = Class.extend({
    init: function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
});
PFMovableObject = PFObjects.extend({
    init: function (x, y, width, height, speed) {
        this.gameOver = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
MovablePlatforms = PFMovableObject.extend({
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
MainCharacters = PFMovableObject.extend({
    init: function (x, y, width, height, speed, ctx) {
        this._super(x, y, width, height, speed);
        this.onObject = false;
        this.jumping = false;
        this.grounded = false;
        this.gameContext = ctx;
    },
    addSprites: function () {
        this.spriteLeft = new Sprite(96, 32, 3, 4, story.sprites[2], this, this.gameContext);
        this.spriteRight = new Sprite(96, 32, 3, 4, story.sprites[3], this, this.gameContext);
        this.spriteIdle = new Sprite(32, 32, 1, 4, story.sprites[1], this, this.gameContext);
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





PathFinder = Game.extend({
    init: function () {
        var self = this;
        this.scroll = $('#scroll');
        this.stopEvents = false;
        this.canSpawnTemp = true;
        this.canSpawnPerm = true;
        this.width = 630;
        this.height = 224;
        this.plot = $("#pathFinder");
        this.canvas = $('#pathFinderCanvas')[0];
        this.gameContext = $('#pathFinderCanvas')[0].getContext('2d');
        this.keys = [];


        this.friction = 0.8;
        this.gravity = 0.35;
        this.timeExistOnBox = 7000;
        this.timeAfterCastingNewBox = 1500;

        this.mainCharacterDead = false;
        this.deaths = 0;
        this.lightningFlag = true;
        this.interval = null;
        // Arrays
        this.checkPointCounter = 0;
        this.checkPointMaxAmount = 10;
        this.tempBoxCounter = 0;
        this.mapBoxes = [];
        this.createdBoxesPerm = [];
        this.createdBoxesTemp = [];
        this.bottomSpikes = [];
        this.topSpikes = [];
        this.verticalSpikes = [];
        this.movableStepableObjects = [];
        this.lightningOnInterval = [];
        this.ballOfDeaths = [];
        this.finishBlocks = [];

        this.score = 0;
        this.gameOver = false;

        this.backGroundSprite = null;

        this.startingPoint = {x: null, y:null};
        this.mainCharacter = new MainCharacters(this.startingPoint.x, this.startingPoint.y, 22, 15, 3, this.gameContext);
        this.levelsPassed = [false, false, false];
        this.currentLevel = 0;
        
        this.greenPlatform = null;
        this.yellowPlatform = null;
        this.animation = null;
        this.update = function () {
            
            self.updateCharacter();
            self.gameContext.clearRect(0, 0, self.width, self.height);
            
            self.colLoopCheck();
            //self.drawBackground();
            self.checkIfDead();
            if (!self.stopEvents) {
                self.mainCharacter.drawCharacter();
            }
            if(!self.gameOver){
            	self.animation = requestAnimationFrame(self.update);            	
            }
        };
    },
    addPlatformImages: function () {
        this.greenPlatform = story.sprites[43];
        this.yellowPlatform = story.sprites[44];
    },
    drawBackground: function () {
        if (this.backGroundSprite != null) {
            this.backGroundSprite.drawSprite();
        }
       
    },
    updateCharacter: function () {
        var self = this;
        if (this.keys[67] && this.canSpawnPerm) {
            if (this.checkPointCounter < this.checkPointMaxAmount) {
                this.createdBoxesPerm.push(new PFObjects(this.mainCharacter.x, this.mainCharacter.y + 10, this.mainCharacter.width * (1 / 2), this.mainCharacter.height));
                this.checkPointCounter++;
            }
            if (this.createdBoxesPerm.length > 1) {
                this.resetMainCharacter(this.createdBoxesPerm[this.createdBoxesPerm.length - 2].x, this.createdBoxesPerm[this.createdBoxesPerm.length - 2].y - this.mainCharacter.height);
            }
            else {
                this.resetMainCharacter();
            }
            this.canSpawnPerm = false;
            setTimeout(function () {
                self.canSpawnPerm = true;
            }, self.timeAfterCastingNewBox);
        }
        if (this.keys[32] && this.canSpawnTemp) {
            this.createdBoxesTemp[this.tempBoxCounter] = new PFObjects(this.mainCharacter.x, this.mainCharacter.y + 10, this.mainCharacter.width * (1 / 2), this.mainCharacter.height);

            var current = self.tempBoxCounter;
            setTimeout(function () {
                self.createdBoxesTemp[current] = null;
            }, self.timeExistOnBox);
            this.tempBoxCounter++;

            //- Making the reseting after creating box
            if (this.createdBoxesPerm.length > 0) {
                this.resetMainCharacter(this.createdBoxesPerm[this.createdBoxesPerm.length - 1].x, this.createdBoxesPerm[this.createdBoxesPerm.length - 1].y - this.mainCharacter.height);
            }
            else {
                this.resetMainCharacter();
            }

            this.canSpawnTemp = false;

            setTimeout(function () {
                self.canSpawnTemp = true;
            }, self.timeAfterCastingNewBox);
        }
        

        this.mainCharacter.listenKeyEvents(this.keys);
        this.mainCharacter.gravityAndFrictionUpdate(this.friction, this.gravity);
    },
    //updateCharacter: function () {
    //
    //    if (this.keys[32] && this.canSpawnTemp) {
    //        var self = this;
    //        if (this.permBoxCounter < this.permBoxMaxAmount) {
    //            this.createdBoxesPerm.push({
    //                x: this.mainCharacter.x,
    //                y: this.mainCharacter.y,
    //                width: this.mainCharacter.width * (1 / 2),
    //                height: this.mainCharacter.height
    //            });
    //            this.permBoxCounter++;
    //        }
    //        else {
    //            this.createdBoxesTemp[this.tempBoxCounter] = {
    //                x: this.mainCharacter.x,
    //                y: this.mainCharacter.y,
    //                width: this.mainCharacter.width * (1 / 2),
    //                height: this.mainCharacter.height
    //            };
    //            
    //            var current = self.tempBoxCounter;
    //            setTimeout(function () {
    //                self.createdBoxesTemp[current] = null;
    //            }, self.timeExistOnBox);
    //            this.tempBoxCounter++;
    //        }
    //        //- Making the reseting after creating box
    //        if (this.tempBoxCounter >= 1 && this.createdBoxesTemp[this.tempBoxCounter - 2] != null) {
    //            this.resetMainCharacter(this.createdBoxesTemp[this.tempBoxCounter - 2].x, this.createdBoxesTemp[this.tempBoxCounter - 2].y - this.mainCharacter.height);
    //        }
    //        else if (this.createdBoxesPerm.length > 1) {
    //            this.resetMainCharacter(this.createdBoxesPerm[this.createdBoxesPerm.length - 2].x, this.createdBoxesPerm[this.createdBoxesPerm.length - 2].y - this.mainCharacter.height);
    //        }
    //        else {
    //            this.resetMainCharacter();
    //        }
    //        
    //        this.canSpawnTemp = false;
    //       
    //        setTimeout(function () {
    //            self.flag = true;
    //        }, self.timeAfterCastingNewBox);
    //        
    //    }
    //   
    //    this.mainCharacter.listenKeyEvents(this.keys);
    //    this.mainCharacter.gravityAndFrictionUpdate(this.friction, this.gravity);
    //},
    colLoopCheck: function () {
        this.gameContext.fillStyle = "black";

        this.mainCharacter.grounded = false;
        this.mainBlocks(this.mapBoxes, 'black', false);
        this.bottomSpires(this.bottomSpikes, 'red');
        this.topSpires(this.topSpikes, 'purple');
        this.verticalSpires(this.verticalSpikes, true, false, "yellow");
        this.ballOfDeath(this.ballOfDeaths, "orange");

        this.drawBackground();
        this.mainBlocks(this.createdBoxesPerm, this.greenPlatform, true);
        this.mainBlocks(this.createdBoxesTemp, this.yellowPlatform, true);
        
        this.verticalSpires(this.lightningOnInterval, this.lightningFlag, true);
        
        this.movableBlocks(this.movableStepableObjects, "green");
        
        this.finishBlock(this.finishBlocks, "Maroon")
        this.mainCharacter.move();
    },
    mainBlocks: function (blocks, color, flag) {
        this.gameContext.fillStyle = color;
        var len = blocks.length;
        for (var i = 0; i < len; i++) {
            if (blocks[i] != null) {
                if (flag) {
                    this.gameContext.drawImage(color, blocks[i].x, blocks[i].y + 17, blocks[i].width, blocks[i].height - 17);
                }

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
            //this.stopEvents = true;
            var self = this;
            //setTimeout(function () {
            //    //self.mainCharacterDead = false;
            //    self.stopEvents = false;
            //}, 500);
            if (this.createdBoxesPerm.length > 0) {
                this.resetMainCharacter(this.createdBoxesPerm[this.createdBoxesPerm.length - 1].x, this.createdBoxesPerm[this.createdBoxesPerm.length - 1].y - this.mainCharacter.height);
            }
            else {
                this.resetMainCharacter();

            }
            this.createdBoxesTemp = [];
            this.tempBoxCounder = 0;
            this.deaths++;
        }
    },
    resetMainCharacter: function () {
        if (arguments[1]) {
            this.mainCharacter.x = arguments[0];
            this.mainCharacter.y = arguments[1];
        }
        else {
            this.mainCharacter.x = this.startingPoint.x;
            this.mainCharacter.y = this.startingPoint.y;
        }
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
        $('#pathFinderCanvas').on('click', this, this.clickEvent);
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
    lightningInterval: function (n) {
        var self = this;
        this.interval = window.setInterval(function () {
            self.lightningFlag = !self.lightningFlag;
        }, n);
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
    startLevel: function (level) {
        var self = this;
        this.checkPointCounter = 0;
        this.checkPointMaxAmount = 3;
        this.tempBoxCounter = 0;
        this.mapBoxes = [];
        this.createdBoxesPerm = [];
        this.createdBoxesTemp = [];
        this.bottomSpikes = [];
        this.topSpikes = [];
        this.verticalSpikes = [];
        this.movableStepableObjects = [];
        this.lightningOnInterval = [];
        this.ballOfDeaths = [];
        this.finishBlocks = [];
        switch (level) {
            case 1:
                this.backGroundSprite = new Sprite(5040, 224, 8, 6, story.sprites[40], { x: + 4.5, y: 0 }, this.gameContext);
                this.startingPoint = { x: 20, y: 30 };
                this.mapBoxes.push(new PFObjects(0, 0, 10, this.height));
                this.mapBoxes.push(new PFObjects(0, this.height - 20, this.width, 50));
                this.mapBoxes.push(new PFObjects(this.width - 10, 0, 50, this.height));
                this.mapBoxes.push(new PFObjects(0, 50, 50, this.height));
                this.topSpikes.push(new PFObjects(50, this.height - 25, this.width - 60, 20));
                this.topSpikes.push(new PFObjects(50, 100, this.width - 210, 20));

                this.ballOfDeaths.push(new PFObjects(82, 61, 25, 37));
                this.bottomSpikes.push(new PFObjects(140, -15, 30, 20));
                this.ballOfDeaths.push(new PFObjects(192, 61, 25, 37));
                this.bottomSpikes.push(new PFObjects(260, -15, 15, 20));
                this.ballOfDeaths.push(new PFObjects(302, 61, 25, 37));
                this.bottomSpikes.push(new PFObjects(380, -15, 15, 20));
                this.ballOfDeaths.push(new PFObjects(420, 61, 25, 37));
                this.bottomSpikes.push(new PFObjects(452, -15, 180, 20));
                this.verticalSpikes.push(new PFObjects(615, -15, 10, 240));
                this.verticalSpikes.push(new PFObjects(515, 50, 10, 120));
                this.bottomSpikes.push(new PFObjects(470, 150, 50, 20));

                this.mapBoxes.push(new PFObjects(470, 50, 50, 118));

                this.ballOfDeaths.push(new PFObjects(110,  162, 30, 30));
                this.ballOfDeaths.push(new PFObjects(230, 162, 30, 30));
                this.ballOfDeaths.push(new PFObjects(350, 162, 30, 30));

                this.movableStepableObjects.push(new MovablePlatforms(20, 190, 100, 20, 2, 25, 460, 0, 0));
                this.finishBlocks.push(new PFObjects(50, 110, 30, 30));

                break;

            case 0:
                this.backGroundSprite = new Sprite(630, 224, 1, 6, story.sprites[41], { x: +4.5, y: 0 }, this.gameContext);
                this.startingPoint = { x: 5, y: 10 };
                this.mapBoxes.push(new PFObjects(0, 30, 50, this.height));
                this.mapBoxes.push(new PFObjects(this.width - 50, 30, 50, this.height));

                this.mapBoxes.push(new PFObjects(0, this.height - 20, this.width, 50));

                this.mapBoxes.push(new PFObjects(this.width / 2 - 25, 60, 50, this.height - 60));

                this.mapBoxes.push(new PFObjects(this.width / 4 - 25, -25, 70, this.height - 60));

                this.mapBoxes.push(new PFObjects(this.width - 210, -25, 70, this.height - 60));

                this.mapBoxes.push(new PFObjects(50, this.height / 2 - 20, 20, 40));

                this.mapBoxes.push(new PFObjects(this.width / 2 - 40, this.height / 2 - 20, 20, 40));
                this.mapBoxes.push(new PFObjects(this.width - 245, this.height / 2 - 15, 35, 40));

                this.topSpikes.push(new PFObjects(50, this.height - 25, this.width - 100, 20));
                this.topSpikes.push(new PFObjects(this.width / 2 - 25, 58, 50, 20));
                this.verticalSpikes.push(new PFObjects(45, 118, 10, 100));
                this.verticalSpikes.push(new PFObjects(this.width / 4 - 26, -25, 10, this.height - 60));
                this.verticalSpikes.push(new PFObjects(this.width / 4 + 36, -25, 10, this.height - 60));
                this.verticalSpikes.push(new PFObjects(this.width / 2 - 30, 118, 10, 100));
                this.verticalSpikes.push(new PFObjects(this.width - 52, 50, 10, 165));
                this.bottomSpikes.push(new PFObjects(this.width / 4 - 25, 122, 70, 20));
                this.bottomSpikes.push(new PFObjects(this.width / 4 + 45, -15, 40, 20));

                this.bottomSpikes.push(new PFObjects(0, -15, 133, 20));

                this.bottomSpikes.push(new PFObjects(this.width - 240, 122, 100, 20));
                this.bottomSpikes.push(new PFObjects(this.width - 140, -15, 60, 20));
                this.verticalSpikes.push(new PFObjects(this.width - 140, -25, 10, this.height - 60));
                this.bottomSpikes.push(new PFObjects(this.width - 240, -15, 30, 20));

                this.movableStepableObjects.push(new MovablePlatforms(100, 180, 30, 20, 1.5, 100, 210, 0, 0));
                this.movableStepableObjects.push(new MovablePlatforms(210, 10, 47, 20, 1, 0, 0, 10, 70));
                this.movableStepableObjects.push(new MovablePlatforms(370, 180, 40, 20, 1.5, 370, 495, 0, 0));


                this.finishBlocks.push(new PFObjects(this.width -20, 15, 30, 30));

                break;

            case 2:
                this.backGroundSprite = new Sprite(5040, 224, 8, 6, story.sprites[42], { x: +4.5, y: 0 }, this.gameContext);
                this.lightningInterval(2500);
                this.startingPoint = { x: 30, y: 170 };

                this.lightningFlag = true;
                this.lightning = new PFObjects(this.width / 2 - 40, -5, 20, 220);
                var ligObj = {
                    x: self.lightning.x - 5,
                    y: self.lightning.y
                }
                this.lightning.sprite = new Sprite(320, 220, 8, 2, story.sprites[28], ligObj, this.gameContext);

                this.movableStepableObjects.push(new MovablePlatforms(20, 50, 100, 20, 1.5, 25, 450, 0, 0));
                this.movableStepableObjects.push(new MovablePlatforms(500, 50, 100, 20, 0.8, 0, 0, 50, 200));
                this.movableStepableObjects.push(new MovablePlatforms(this.width / 2 - 40, 60, 20, 30, 4, 0, 0, 60, 200));

                this.topSpikes.push(new PFObjects(10, 55, 500, 20));
                this.verticalSpikes.push(new PFObjects(10, 60, 5, this.height - 60));
                this.verticalSpikes.push(new PFObjects(135, 105, 5, this.height - 105));
                this.verticalSpikes.push(new PFObjects(140, 105, 5, 50));


                this.mapBoxes.push(new PFObjects(140, 130, 40, 90));
                this.mapBoxes.push(new PFObjects(180, 180, 30, 40));
                this.bottomSpikes.push(new PFObjects(180, 60, 30, 20));
                this.topSpikes.push(new PFObjects(180, 170, 30, 10));
                this.mapBoxes.push(new PFObjects(210, 130, 40, 90));
                this.topSpikes.push(new PFObjects(250, 200, 80, 40));
                this.mapBoxes.push(new PFObjects(330, 130, 40, 90));
                this.mapBoxes.push(new PFObjects(370, 180, 30, 40));
                this.bottomSpikes.push(new PFObjects(370, 60, 30, 20));
                this.topSpikes.push(new PFObjects(370, 170, 30, 10));
                this.mapBoxes.push(new PFObjects(400, 130, 40, 90));
                this.verticalSpikes.push(new PFObjects(500, 60, 5, 100));


                this.mapBoxes.push(new PFObjects(0, 0, 10, this.height));
                this.mapBoxes.push(new PFObjects(0, this.height - 20, this.width, 50));
                this.mapBoxes.push(new PFObjects(this.width - 10, 0, 50, this.height));
                this.ballOfDeaths.push(new PFObjects(100, 25, 20, 20));
                this.ballOfDeaths.push(new PFObjects(220, 25, 20, 20));
                this.ballOfDeaths.push(new PFObjects(340, 25, 20, 20));
                this.ballOfDeaths.push(new PFObjects(460, 25, 20, 20));
                //
                //this.ballOfDeaths.push(new PFObjects(515, 25, 30, 10));
                this.ballOfDeaths.push(new PFObjects(575, 55, 30, 40));
                this.ballOfDeaths.push(new PFObjects(515, 125, 30, 10));
                this.ballOfDeaths.push(new PFObjects(575, 175, 30, 40));
                this.mapBoxes.push(new PFObjects(570, 50, 60, 30));
                this.mapBoxes.push(new PFObjects(0, 50, 60, 30));
                this.lightningOnInterval.push(this.lightning);

                this.finishBlocks.push(new PFObjects(10, 15, 15, 30));
                break;
            default:
                break;

        }

        this.mainCharacter.x = this.startingPoint.x;
        this.mainCharacter.y = this.startingPoint.y;
    },
    start: function () {
        var instructions = '"Space": creates temporary platform. "c": creates permanent checkpoint. Get to the purple point!';
        this.writeOnScroll(instructions, {
            fontSize: '12px'
        });
        this.addPlatformImages();
        this.stopEvents = false;
        this.mainCharacter.addSprites();
        this.gameOver = false;
        this.startLevel(0);
        this.addEventListeners();
        this.addGameToPlot();
        this.update();
    },
    endGame: function () {
        this.score = 15000 / this.deaths;
        this.stopEvents = true;
        clearInterval(this.interval);
        this.removeGameFromPlot();
        this.gameOver = true;

    },



});