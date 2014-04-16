




PathFinder = Game.extend({
    init: function () {
        var self = this;
        this.width = 630;
        this.height = 224;
        this.mainLoop = function () {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.animation = requestAnimationFrame(self.mainLoop);
        };
        this.mainCharacter = {
            x: self.width / 2,
            y: self.height - 30,
            width: 10,
            height: 10,
            speed: 3,
            velX: 0,
            velY: 0,
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

        this.boxes.push({
            x: 120,
            y: 10,
            width: 80,
            height: 80
        });
        this.boxes.push({
            x: 170,
            y: 50,
            width: 80,
            height: 80
        });
        this.boxes.push({
            x: 220,
            y: 100,
            width: 80,
            height: 80
        });
        this.boxes.push({
            x: 270,
            y: 150,
            width: 40,
            height: 40
        });
        var flag = true;
        this.update = function () {
            
            // check keys
            if (self.keys[38]) {
                // up arrow or space
                if (!self.mainCharacter.jumping && self.mainCharacter.grounded) {
                    self.mainCharacter.jumping = true;
                    self.mainCharacter.grounded = false;
                    self.mainCharacter.velY = -self.mainCharacter.speed * 2;
                }
            }
            if (self.keys[32] && flag) {
                self.boxes.push({
                    x: self.mainCharacter.x,
                    y: self.mainCharacter.y,
                    width: self.mainCharacter.width,
                    height: self.mainCharacter.height
                });
                self.mainCharacter.x = self.width / 2;
                self.mainCharacter.y = self.height - 30;
                self.mainCharacter.width = 10;
                self.mainCharacter.height = 10;
                flag = false;
                setTimeout(function () {
                    flag = true;
                }, 1000);

            }
            if (self.keys[39]) {
                // right arrow
                if (self.mainCharacter.velX < self.mainCharacter.speed) {
                    self.mainCharacter.velX++;
                }
            }
            if (self.keys[37]) {
                // left arrow
                if (self.mainCharacter.velX > -self.mainCharacter.speed) {
                    self.mainCharacter.velX--;
                }
            }
        
            self.mainCharacter.velX *= self.friction;
            self.mainCharacter.velY += self.gravity;
        
            self.gameContext.clearRect(0, 0, self.width, self.height);
            self.gameContext.fillStyle = "black";
            self.gameContext.beginPath();
            
            self.mainCharacter.grounded = false;
            for (var i = 0; i < self.boxes.length; i++) {
                self.gameContext.rect(self.boxes[i].x, self.boxes[i].y, self.boxes[i].width, self.boxes[i].height);
                
                var dir = self.colCheck(self.mainCharacter, self.boxes[i]);
        
                if (dir === "l" || dir === "r") {
                    self.mainCharacter.velX = 0;
                    self.mainCharacter.jumping = false;
                } else if (dir === "b") {
                    self.mainCharacter.grounded = true;
                    self.mainCharacter.jumping = false;
                } else if (dir === "t") {
                    self.mainCharacter.velY *= -1;
                }
        
            }
            
            if (self.mainCharacter.grounded) {
                self.mainCharacter.velY = 0;
            }
            
            self.mainCharacter.x += self.mainCharacter.velX;
            self.mainCharacter.y += self.mainCharacter.velY;
        
            self.gameContext.fill();
            self.gameContext.fillStyle = "green";
            //console.log("x: " + self.mainCharacter.x + " y:" + self.mainCharacter.y + " width:" + self.mainCharacter.width + " height:" + self.mainCharacter.height);
            self.gameContext.fillRect(self.mainCharacter.x, self.mainCharacter.y, self.mainCharacter.width, self.mainCharacter.height);

            requestAnimationFrame(self.update);
        };
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