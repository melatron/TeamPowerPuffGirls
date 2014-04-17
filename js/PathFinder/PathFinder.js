




PathFinder = Game.extend({
    init: function () {
        var self = this;
        this.flag = true;
        this.width = 630;
        this.height = 224;
        this.mainCharacterDead = false;
        this.timeExistOnBox = 7000;
        this.timeAfterCastingNewBox = 2000;
        this.deaths = 0;
        this.permBoxCounter = 0;
        this.tempBoxCounter = 0;
        this.lightningFlag = true;
        this.mainCharacter = {
            x: this.width / 2 + 70,
            y: this.height - 30,
            width: 25,
            height: 18,
            speed: 3,
            velX: 0,
            velY: 0,
            onObject: false,
            moveLeft: false,
            moveRight: false,
            jumping: false,
            grounded: false
        }

        this.plot = $("#pathFinder");
        this.canvas = $('#pathFinderCanvas')[0];
        this.gameContext = $('#pathFinderCanvas')[0].getContext('2d');
        this.keys = [];
        this.friction = 0.8;
        this.gravity = 0.2;
        this.mapBoxes = [];
        this.createdBoxesPerm = [];
        this.createdBoxesTemp = [];
        this.bottomSpikes = [];
        this.topSpikes = [];
        this.verticalSpikes = [];
        this.movableStepableObjects = [];
        this.lightningOnInterval = [];


        this.mainCharacter.spriteLeft = new Sprite(96, 32, 3, 4, story.sprites[2], this.mainCharacter, this.gameContext);
        this.mainCharacter.spriteRight = new Sprite(96, 32, 3, 4, story.sprites[3], this.mainCharacter, this.gameContext);
        this.mainCharacter.spriteIdle = new Sprite(32, 32, 1, 4, story.sprites[1], this.mainCharacter, this.gameContext);

        this.lightning = {
            x: this.width / 2,
            y: -5,
            width: 20,
            height: 220
        }
        
        var ligObj = {
            x: self.lightning.x - 5,
            y: self.lightning.y        
        }
        this.lightning.sprite = new Sprite(320, 220, 8, 2, story.sprites[28], ligObj, this.gameContext);

        this.movableBox = {
            x: 100,
            y: 100,
            width: 120,
            height: 20,
            speed: 0.5,
            moveLeft: false,
            moveRight: true,
            updatePosition: function () {
                if (this.x >= 400) {
                    this.moveLeft = true;
                    this.moveRight = false;
                }
                else if (this.x <= 100) {
                    this.moveLeft = false;
                    this.moveRight = true;
                }
            }
        };
        this.movableStepableObjects.push(this.movableBox);

        this.mapBoxes.push({
            x: 0,
            y: 0,
            width: 10,
            height: this.height
        });
        this.mapBoxes.push({
            x: 0,
            y: this.height - 20,
            width: this.width,
            height: 50
        });
        this.mapBoxes.push({
            x: this.width - 10,
            y: 0,
            width: 50,
            height: this.height
        });
        this.bottomSpikes.push({
            x: 100,
            y: 150,
            width: 100,
            height: 20
        });
        this.topSpikes.push({
            x: 400,
            y: 150,
            width: 100,
            height: 20
        });
        this.lightningOnInterval.push(this.lightning);

        

        //this.mapBoxes.push({
        //    x: 120,
        //    y: 10,
        //    width: 80,
        //    height: 80
        //});
        //this.mapBoxes.push({
        //    x: 170,
        //    y: 50,
        //    width: 80,
        //    height: 80
        //});
        //this.mapBoxes.push({
        //    x: 220,
        //    y: 100,
        //    width: 80,
        //    height: 80
        //});
        //this.mapBoxes.push({
        //    x: 270,
        //    y: 150,
        //    width: 40,
        //    height: 40
        //});
        this.animation = null;
        this.update = function () {
            self.updateCharacter();
            self.gameContext.clearRect(0, 0, self.width, self.height);
            self.colLoopCheck();
            self.checkIfDead();
            self.drawCharacter();
            self.animation = requestAnimationFrame(self.update);
        };
    },
    updateCharacter: function () {
        // check keys
        if (this.keys[38]) {
            // up arrow
            if (!this.mainCharacter.jumping && this.mainCharacter.grounded) {
                this.mainCharacter.jumping = true;
                this.mainCharacter.grounded = false;
                this.mainCharacter.velY = -this.mainCharacter.speed * 2;
            }
        }
        // space

        if (this.keys[32] && this.flag) {
            var self = this;
            if (this.permBoxCounter <= 4) {
                this.createdBoxesPerm.push({
                    x: this.mainCharacter.x,
                    y: this.mainCharacter.y,
                    width: this.mainCharacter.width * (1 / 2),
                    height: this.mainCharacter.height
                });
                this.permBoxCounter++;
            }
            else {
                this.createdBoxesTemp[this.tempBoxCounter] = {
                    x: this.mainCharacter.x,
                    y: this.mainCharacter.y,
                    width: this.mainCharacter.width * (1 / 2),
                    height: this.mainCharacter.height
                };
                
                var current = self.tempBoxCounter;
                setTimeout(function () {
                    self.createdBoxesTemp[current] = null;
                }, self.timeExistOnBox);
                this.tempBoxCounter++;
            }
            //- Making the reseting after creating box
            if (this.tempBoxCounter >= 1 && this.createdBoxesTemp[this.tempBoxCounter - 2] != null) {
                this.resetMainCharacter(this.createdBoxesTemp[this.tempBoxCounter - 2].x, this.createdBoxesTemp[this.tempBoxCounter - 2].y - this.mainCharacter.height);
            }
            else if (this.createdBoxesPerm.length > 1) {
                this.resetMainCharacter(this.createdBoxesPerm[this.createdBoxesPerm.length - 2].x, this.createdBoxesPerm[this.createdBoxesPerm.length - 2].y - this.mainCharacter.height);
            }
            else {
                this.resetMainCharacter();
            }
            
            this.flag = false;
           
            setTimeout(function () {
                self.flag = true;
            }, self.timeAfterCastingNewBox);
            
        }
        if (this.keys[39]) {
            // right arrow
            if (this.mainCharacter.velX < this.mainCharacter.speed) {
                this.mainCharacter.moveRight = true;

                this.mainCharacter.velX++;
            }
        }
        else {
            this.mainCharacter.moveRight = false;
        }
        if (this.keys[37]) {
            // left arrow
            if (this.mainCharacter.velX > -this.mainCharacter.speed) {
                this.mainCharacter.moveLeft = true;
                this.mainCharacter.velX--;
            }
        }
        else {
            this.mainCharacter.moveLeft = false;
        }

       
        this.mainCharacter.velX *= this.friction;
        this.mainCharacter.velY += this.gravity;
    },
    drawCharacter: function () {
        if (this.mainCharacter.moveRight) {
            this.mainCharacter.spriteRight.drawSprite();
        }
        else if (this.mainCharacter.moveLeft) {
            this.mainCharacter.spriteLeft.drawSprite();
        }
        else {
            this.mainCharacter.spriteIdle.drawSprite();
            this.mainCharacter.velX = 0;
        }
    },
    colLoopCheck: function () {
        this.gameContext.fillStyle = "black";
        this.gameContext.beginPath();

        this.mainCharacter.grounded = false;
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Checking the main boxes for collision                                                                           //
        for (var i = 0; i < this.mapBoxes.length; i++) {                                                                    //
            this.gameContext.fillRect(this.mapBoxes[i].x, this.mapBoxes[i].y + 14, this.mapBoxes[i].width, this.mapBoxes[i].height - 14); //
                                                                                                                            //
            var dir = this.colCheck(this.mainCharacter, this.mapBoxes[i]);                                                  //
                                                                                                                            //
            if (dir === "l" || dir === "r") {                                                                               //
                this.mainCharacter.velX = 0;                                                                                //
                this.mainCharacter.jumping = false;                                                                         //
            } else if (dir === "b") {                                                                                       //
                this.mainCharacter.grounded = true;                                                                         //
                this.mainCharacter.jumping = false;                                                                         //
            } else if (dir === "t") {                                                                                       //
                this.mainCharacter.velY *= -1;                                                                              //
            }                                                                                                               //
        }                                                                                                                   //
        /// Checking the created permanent boxes for collision ///////////////////////////////////////////////////////////////
                                                                                               //
        for (var i = 0; i < this.createdBoxesPerm.length; i++) {                                                            //
            this.gameContext.fillRect(this.createdBoxesPerm[i].x, this.createdBoxesPerm[i].y + 14, this.createdBoxesPerm[i].width, this.createdBoxesPerm[i].height - 14); //
                                                                                                                            //
            var dir = this.colCheck(this.mainCharacter, this.createdBoxesPerm[i]);                                          //
                                                                                                                            //
            if (dir === "l" || dir === "r") {                                                                               //
                this.mainCharacter.velX = 0;                                                                                //
                this.mainCharacter.jumping = false;                                                                         //
            } else if (dir === "b") {                                                                                       //
                this.mainCharacter.grounded = true;                                                                         //
                this.mainCharacter.jumping = false;                                                                         //
            } else if (dir === "t") {                                                                                       //
                this.mainCharacter.velY *= -1;                                                                              //
            }                                                                                                               //
        }
        /// Checking the created temprorary boxes for collision///////////////////////////////////////////////////////////////
        this.gameContext.fillStyle = "green";
        for (var i = 0; i < this.createdBoxesTemp.length; i++) {                                                            //
            if (this.createdBoxesTemp[i] != null) {
                this.gameContext.fillRect(this.createdBoxesTemp[i].x, this.createdBoxesTemp[i].y + 14, this.createdBoxesTemp[i].width, this.createdBoxesTemp[i].height - 14); //
                //
                var dir = this.colCheck(this.mainCharacter, this.createdBoxesTemp[i]);                                          //
                //
                if (dir === "l" || dir === "r") {                                                                               //
                    this.mainCharacter.velX = 0;                                                                                //
                    this.mainCharacter.jumping = false;                                                                         //
                } else if (dir === "b") {                                                                                       //
                    this.mainCharacter.grounded = true;                                                                         //
                    this.mainCharacter.jumping = false;                                                                         //
                } else if (dir === "t") {                                                                                       //
                    this.mainCharacter.velY *= -1;                                                                              //
                }
            }                                                                                                              //
        }                                                                                                                   //
        /// Checking the created bottom Spikes for collision//////////////////////////////////////////////////////////////////
        this.gameContext.fillStyle = "red";
        for (var i = 0; i < this.bottomSpikes.length; i++) {                                                                //
            this.gameContext.fillRect(this.bottomSpikes[i].x, this.bottomSpikes[i].y + 14, this.bottomSpikes[i].width, this.bottomSpikes[i].height - 14); //
                                                                                                                            //
            var dir = this.colCheck(this.mainCharacter, this.bottomSpikes[i]);                                              //
                                                                                                                            //
            if (dir === "l" || dir === "r") {                                                                               //
                this.mainCharacter.velX = 0;                                                                                //
                this.mainCharacter.jumping = false;                                                                         //
            } else if (dir === "b") {                                                                                       //
                this.mainCharacter.grounded = true;                                                                         //
                this.mainCharacter.jumping = false;

                this.mainCharacterDead = true;
            } else if (dir === "t") {                                                                                       //
                this.mainCharacter.velY *= -1;                                                                              //
            }                                                                                                               //
        }                                                                                                                   //
        /// Checking the created top Spikes for collision/////////////////////////////////////////////////////////////////////
        this.gameContext.fillStyle = "purple";
        for (var i = 0; i < this.topSpikes.length; i++) {                                                                   //
            this.gameContext.fillRect(this.topSpikes[i].x, this.topSpikes[i].y + 14, this.topSpikes[i].width, this.topSpikes[i].height - 14); //
                                                                                                                            //
            var dir = this.colCheck(this.mainCharacter, this.topSpikes[i]);                                                 //
                                                                                                                            //
            if (dir === "l" || dir === "r") {                                                                               //
                this.mainCharacter.velX = 0;                                                                                //
                this.mainCharacter.jumping = false;                                                                         //
            } else if (dir === "b") {
                this.mainCharacter.grounded = true;                                                                         
                this.mainCharacter.jumping = false;
            } else if (dir === "t") {
                this.mainCharacterDead = true;
                this.mainCharacter.velY *= -1;                                                                              //
            }                                                                                                               //
        }                                                                                                                   //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.gameContext.fillStyle = "yellow";
        for (var i = 0; i < this.verticalSpikes.length; i++) {                                                                   //
            this.gameContext.fillRect(this.verticalSpikes[i].x + 2, this.verticalSpikes[i].y + 14, this.verticalSpikes[i].width - 2, this.verticalSpikes[i].height - 14); //
            //
            var dir = this.colCheck(this.mainCharacter, this.verticalSpikes[i]);                                                 //
            //
            if (dir === "l" || dir === "r") {
                this.mainCharacterDead = true;                                                                              //
                this.mainCharacter.velX = 0;                                                                                //
                this.mainCharacter.jumping = false;                                                                         //
            } else if (dir === "b") {
                this.mainCharacter.grounded = true;
                this.mainCharacter.jumping = false;
            } else if (dir === "t") {
                this.mainCharacter.velY *= -1;                                                                              //
            }                                                                                                               //
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (this.lightningFlag) {
            this.gameContext.fillStyle = "yellow";
            for (var i = 0; i < this.lightningOnInterval.length; i++) {                                                                   //
                this.lightningOnInterval[0].sprite.drawSprite();
                //
                var dir = this.colCheck(this.mainCharacter, this.lightningOnInterval[i]);                                                 //
                //
                if (dir === "l" || dir === "r") {
                    this.mainCharacterDead = true;                                                                              //
                    this.mainCharacter.velX = 0;                                                                                //
                    this.mainCharacter.jumping = false;                                                                         //
                } else if (dir === "b") {
                    this.mainCharacter.grounded = true;
                    this.mainCharacter.jumping = false;
                } else if (dir === "t") {
                    this.mainCharacter.velY *= -1;                                                                              //
                }                                                                                                               //
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        for (var i = 0; i < this.movableStepableObjects.length; i++) {
            var a = this.movableStepableObjects[i];
            if (a.moveLeft) {
                a.x -= a.speed;
            }
            else if (a.moveRight) {
                a.x += a.speed;
            }
            a.updatePosition();
            this.gameContext.fillRect(a.x + 2, a.y + 14, a.width - 2, a.height - 14); //
            //
            var dir = this.colCheck(this.mainCharacter, a);
            //
            if (dir === "l" || dir === "r") {
                
                this.mainCharacter.velX = 0;                                                                                
                this.mainCharacter.jumping = false;                                                                         
            } else if (dir === "b") {
                
                this.mainCharacter.grounded = true;
                this.mainCharacter.jumping = false;
                if (a.moveLeft) {
                    this.mainCharacter.velX -= 2 * a.speed;
                }
                else if (a.moveRight) {
                    this.mainCharacter.velX += 2 * a.speed;
                }

            } else if (dir === "t") {
                
                this.mainCharacter.velY *= -1;                                                                              //
            }
        }


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (this.mainCharacter.grounded) {
            this.mainCharacter.velY = 0;
        }
        console.log(this.mainCharacter.velX);
        this.mainCharacter.x += this.mainCharacter.velX;
        this.mainCharacter.y += this.mainCharacter.velY;

        //this.gameContext.fill();
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
            this.createdBoxesPerm = [];
            this.createdBoxesTemp = [];
            this.permBoxCounter = 0;
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
            this.mainCharacter.x = this.width / 2 + 70;
            this.mainCharacter.y = this.height - 30;
        }
        this.mainCharacterDead = false;
    },

    addEventListeners: function () {
        var self = this;
        $(document).on('keydown', function (e) {
            if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 39) {
                e.preventDefault();
            }
            self.keys[e.keyCode] = true;
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 39) {
                e.preventDefault();
            }
            self.keys[e.keyCode] = false;
        });
    },
    lightningInterval: function (n) {
        var self = this;
        window.setInterval(function () {
            self.lightningFlag = !self.lightningFlag;
        }, n);
    },
    startGame: function () {
        this.lightningInterval(5000);
        this.addEventListeners();
        this.addGameToPlot();
        this.update();
    }


});