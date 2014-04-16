




PathFinder = Game.extend({
    init: function () {
        var self = this;
        this.flag = true;
        this.width = 630;
        this.height = 224;
        this.mainCharacter = {
            x: this.width / 2,
            y: this.height - 30,
            width: 25,
            height: 18,
            speed: 3,
            velX: 0,
            velY: 0,
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
        this.gravity = 0.3;
        this.boxes= [];

        this.mainCharacter.spriteLeft = new Sprite(96, 32, 3, 4, story.sprites[2], this.mainCharacter, this.gameContext);
        this.mainCharacter.spriteRight = new Sprite(96, 32, 3, 4, story.sprites[3], this.mainCharacter, this.gameContext);
        this.mainCharacter.spriteIdle = new Sprite(32, 32, 1, 4, story.sprites[1], this.mainCharacter, this.gameContext);
        
        this.boxes.push({
            x: 0,
            y: 0,
            width: 10,
            height: this.height
        });
        this.boxes.push({
            x: 0,
            y: this.height - 20,
            width: this.width,
            height: 50
        });
        this.boxes.push({
            x: this.width - 10,
            y: 0,
            width: 50,
            height: this.height
        });

        //this.boxes.push({
        //    x: 120,
        //    y: 10,
        //    width: 80,
        //    height: 80
        //});
        //this.boxes.push({
        //    x: 170,
        //    y: 50,
        //    width: 80,
        //    height: 80
        //});
        //this.boxes.push({
        //    x: 220,
        //    y: 100,
        //    width: 80,
        //    height: 80
        //});
        //this.boxes.push({
        //    x: 270,
        //    y: 150,
        //    width: 40,
        //    height: 40
        //});
        
        this.update = function () {
            self.updateCharacter();
            self.gameContext.clearRect(0, 0, self.width, self.height);
            self.colLoopCheck();
            self.drawCharacter();
            requestAnimationFrame(self.update);
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
            this.boxes.push({
                x: this.mainCharacter.x,
                y: this.mainCharacter.y,
                width: this.mainCharacter.width ,
                height: this.mainCharacter.height 
            });
            this.mainCharacter.x = this.width / 2;
            this.mainCharacter.y = this.height - 30;
            this.flag = false;
            var self = this;
            setTimeout(function () {
                self.flag = true;
            }, 1000);

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
        }
    },
    colLoopCheck: function () {
        this.gameContext.fillStyle = "black";
        this.gameContext.beginPath();

        this.mainCharacter.grounded = false;
        for (var i = 0; i < this.boxes.length; i++) {
            this.gameContext.rect(this.boxes[i].x, this.boxes[i].y, this.boxes[i].width, this.boxes[i].height);

            var dir = this.colCheck(this.mainCharacter, this.boxes[i]);

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

        if (this.mainCharacter.grounded) {
            this.mainCharacter.velY = 0;
        }

        this.mainCharacter.x += this.mainCharacter.velX;
        this.mainCharacter.y += this.mainCharacter.velY;

        this.gameContext.fill();
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

    addEventListeners: function () {
        var self = this;
        $(document).on('keydown', function (e) {
            self.keys[e.keyCode] = true;
        });
        $(document).on('keyup', function (e) {
            self.keys[e.keyCode] = false;
        });
    },
    startGame: function () {
        this.addEventListeners();
        this.addGameToPlot();
        this.update();
    }


});