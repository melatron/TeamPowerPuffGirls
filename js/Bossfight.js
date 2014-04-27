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
	    
	    this.level = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

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
    
    detectLevelCollision: function(obj){
		var collision = {
				top: false,
				bottom: false,
				left: false,
				right: false
		},
			char = obj,						// object that will be tested
			charBox = {						// object bounding rect
				x: char.x + 6,
				y: char.y + 28,
				width: 20,
				height: 8
			},		
			activeBlocks = this.determineLocation(obj),		// determine 'active' blocks
			len = activeBlocks.length;
		
		// --- determine collision with edges of canvas ---- //

		if(char.x < 0){
			collision.left = true;
		}
		if(char.y < 0){
			collision.top = true;
		}
		if(char.x + char.width > this.canvas.width){
			collision.right = true;
		}
		if(char.y + char.height> this.canvas.height){
			collision.bottom = true;
		}
		
		// ---- determine adjacent blocks and check if colliding ----- //
		
		for (var i = 0; i < len; i++){
			var temp = activeBlocks[i],
				layout = this.level,
				offsetX = null,
				offsetY = null,
				upper = null,
				lower = null,
				left = null,
				right = null,
				upperRight = null,
				upperLeft = null,
				lowerRight = null,
				lowerLeft = null;
			
			// ---- determine adjacent blocks (8) ------ //
			
			if(temp.row != 0)  upper = layout[temp.row - 1][temp.col];
			
			if(temp.row < layout.length - 1) lower = layout[temp.row + 1][temp.col];
			
			if(temp.col != 0) left = layout[temp.row][temp.col - 1];
			
			if(temp.col < layout[0].length - 1) right = layout[temp.row][temp.col + 1];
			
			if(temp.row != 0 && temp.col != 0) upperLeft = layout[temp.row - 1][temp.col - 1];
			
			if(temp.row != 0 && temp.col < layout[0].length - 1) upperRight = layout[temp.row - 1][temp.col + 1];
			
			if(temp.col != 0 && temp.row < layout.length - 1) lowerLeft = layout[temp.row + 1][temp.col - 1];
			
			if(temp.col < layout[0].length - 1 && temp.row < layout.length - 1) lowerRight = layout[temp.row + 1][temp.col + 1];
			
			// ----- linear collision detection ----- //
			
			if(len != 3){
				if(right && right.type == 0){
					if(charBox.x + charBox.width > temp.x + temp.width){
						collision.right = true;
					}
				}
				if(lower && lower.type == 0){
					if(charBox.y + charBox.height > temp.y + temp.height){
						collision.bottom = true;		
					}
				}
				if(left && left.type == 0){
					if(charBox.x < temp.x){
						collision.left = true;
					}
				}
				if(upper && upper.type == 0){
					if(charBox.y < temp.y){
						collision.top = true;
					}
				}				
			}
			
			// ==== diagonal collision detection ==== //
			
			if(upperLeft && upperLeft.type == 0){
				if(this.areOverlapping(charBox, upperLeft)){
					if(len == 3){	// determine whether we are on an edge
						offsetX = (upperLeft.x + upperLeft.width) - charBox.x;	//calculate offsets
						offsetY = (upperLeft.y + upperLeft.height) - charBox.y;
						
						if(offsetX > offsetY){
							char.y += offsetY;
							charBox.y += offsetY;
							break;
						}
						else if(offsetY > offsetX){
							char.x += offsetX;
							charBox.x += offsetX;
							break;
						}
						else if(offsetY == offsetX){
							if(char.moveLeft == true){
								char.y += offsetY;
								charBox.y += offsetY;
							}
							else if(char.moveUp == true){
								char.x += offsetX;
								charBox.x += offsetX;
							}
						}
					}
				}         
			}
			
			if(upperRight && upperRight.type == 0){
				if(this.areOverlapping(charBox, upperRight)){
					if(len == 3){
						offsetX = (charBox.x + charBox.width) - upperRight.x;
						offsetY = (upperRight.y + upperRight.height) - charBox.y;
						
						if(offsetX > offsetY){
							char.y += offsetY;
							charBox.y += offsetY;
							break;
						}
						else if(offsetY > offsetX){
							char.x -= offsetX;
							charBox.x -= offsetX;
							break;
						}
						else if(offsetY == offsetX){
							if(char.moveRight == true){
								char.y += offsetY;
								charBox.y += offsetY;
							}
							else if(char.moveUp == true){
								char.x -= offsetX;
								charBox.x -= offsetX;
							}
						}
					}
				}
			}
			
			if(lowerLeft && lowerLeft.type == 0){
				if(this.areOverlapping(charBox, lowerLeft)){
					if(len == 3){
						offsetX = (lowerLeft.x + lowerLeft.width) - charBox.x;
						offsetY = (charBox.y + charBox.height) - lowerLeft.y;
												
						if(offsetX > offsetY){
							char.y -= offsetY;
							charBox.y -= offsetY;
							break;
						}
						if(offsetY > offsetX){
							char.x += offsetX;
							charBox.x += offsetX;
							break;
						}
						if(offsetX == offsetY){
							if(char.moveLeft == true){
								char.y -= offsetY;
								charBox.y -= offsetY;
							}
							else if(char.moveDown == true){
								char.x += offsetX;
								charBox.x += offsetX;
							}
						}
					}
				}
			}
			
			if(lowerRight && lowerRight.type == 0){
				if(this.areOverlapping(charBox, lowerRight)){
					if(len == 3){
						offsetX = (charBox.x + charBox.width) - lowerRight.x;
						offsetY = (charBox.y + charBox.height) - lowerRight.y;
						
						if(offsetX > offsetY){
							char.y -= offsetY;
							charBox.y -= offsetY;
							break;
						}
						if(offsetY > offsetX){
							char.x -= offsetX;
							charBox.x -= offsetX;
							break;
						}
						if(offsetX == offsetY){
							if(char.moveRight == true){
								char.y -= offsetY;
								charBox.y -= offsetY;
							}
							else if(char.moveDown == true){
								char.x -= offsetX;
								charBox.x -= offsetX;
							}
						}
					}
				}
			}		
		}
		
		return collision;
	},
	
	detectLineIntersection: function(rect, line){
		var minX = line.x1;
	    var maxX = line.x2;
	    
	    if (line.x1 > line.x2) {
	        minX = line.x2;
	        maxX = line.x1;
	    }
	    
	    if (maxX > rect.x + rect.width) maxX = rect.x + rect.width;
	    
	    if (minX < rect.x) minX = rect.x;
	    
	    if (minX > maxX) return false;
	    
	    var minY = line.y1;
	    var maxY = line.y2;
	    
	    var dx = line.x2 - line.x1;
	    
	    if (Math.abs(dx) > 0.0000001) {
	        var a = (line.y2 - line.y1) / dx;
	        var b = line.y1 - a * line.x1;
	        minY = a * minX + b;
	        maxY = a * maxX + b;
	    }
	    
	    if (minY > maxY) {
	        var tmp = maxY;
	        maxY = minY;
	        minY = tmp;
	    }
	    
	    if (maxY > rect.y + rect.height) maxY = rect.y + rect.height;
	    
	    if (minY < rect.y)  minY = rect.y;
	    
	    if (minY > maxY) return false;
	    
	    return true;
	},

	detectCircleIntersection: function(rect, circle){
		var distX = Math.abs(circle.x - rect.x - rect.width / 2);
	    var distY = Math.abs(circle.y - rect.y - rect.height / 2);

	    if (distX > (rect.width / 2 + circle.radius)) return false;
	    
	    if (distY > (rect.height / 2 + circle.radius)) return false;

	    if (distX <= (rect.width / 2)) return true;
	    
	    if (distY <= (rect.height / 2)) return true;
	},
	
	areOverlapping: function(obj1, obj2, offsetX1, offsetY1, offsetX2, offsetY2){
		var oX1 = offsetX1 || 0,
			oY1 = offsetY1 || 0,
			oX2 = offsetX2 || 0,
			oY2 = offsetY2 || 0;
		
		if(((obj1.x + oX1 > obj2.x + oX2 && obj1.x + oX1 < obj2.x + oX2 + (obj2.width - 2 * oX2)) || (obj1.x + oX1 + (obj1.width - 2 * oX1) > obj2.x + oX2 && obj1.x + oX1 + (obj1.width - 2 * oX1) < obj2.x + oX2 + (obj2.width - 2 * oX2))) && 
				((obj1.y + oY1 > obj2.y + oY2 && obj1.y + oY1 < obj2.y + oY2 + (obj2.height - 2 * oY2)) || (obj1.y + oY1 + (obj1.height - 2 * oY1) > obj2.y + oY2 && obj1.y + oY1 + (obj1.height - 2 * oY1) < obj2.y + oY2 + (obj2.height - 2 * oY2)))){
			return true;
		}
		return false;
	},
	
	updateCharacter: function(){
		
		var char = this.mainCharacter,
			collision = this.detectLevelCollision(char);

		if(char.isCaught){
			char.x = this.startingBlock.x;
			char.y = this.startingBlock.y;
			this.deaths++;
			this.resetCoins();
			char.isCaught = false;
		}
		//this.gameContext.fillRect(this.mainCharacterBoundingRect.x, this.mainCharacterBoundingRect.y, this.mainCharacterBoundingRect.width, this.mainCharacterBoundingRect.height);

		if(char.moveUp == true){
			if(char.moveLeft == true){
				char.spriteLeft.drawSprite();
				if(!collision.left){
					char.x -= char.speed;				
				}
			}

			if(char.moveRight == true){
				char.spriteRight.drawSprite();
				if(!collision.right){
					char.x += char.speed;				
				}
			}
			if(!char.moveLeft && !char.moveRight){
				char.spriteUp.drawSprite();
			}
			if(!collision.top){
				char.y -= char.speed;			
			}
			return;
		}

		if(char.moveDown == true){
			if(char.moveLeft == true){
				char.spriteLeft.drawSprite();
				if(!collision.left){
					char.x -= char.speed;				
				}
			}

			if(char.moveRight == true){
				char.spriteRight.drawSprite();
				if(!collision.right){
					char.x += char.speed;				
				}
			}
			if(!char.moveLeft && !char.moveRight){
				char.spriteDown.drawSprite()
			}
			if(!collision.bottom){
				char.y += char.speed;		
			}
			return;
		}

		if(char.moveLeft == true){
			if(char.moveUp == true){
				if(!collision.top){
					char.y -= char.speed;				
				}
			}

			if(char.moveDown == true){
				if(!collision.bottom){
					char.y += char.speed;				
				}
			}

			char.spriteLeft.drawSprite();
			if(!collision.left){
				char.x -= char.speed;			
			}
			return;
		}

		if(char.moveRight == true){
			if(char.moveUp == true){
				if(!collision.up){
					char.y -= char.speed;			
				}
			}

			if(char.moveDown == true){
				if(!collision.bottom){
					char.y += char.speed;				
				}
			}

			char.spriteRight.drawSprite();
			if(!collision.right){
				char.x += char.speed;			
			}
			return;
		}

		if(!char.isMoving){
			char.spriteIdle.drawSprite();
		}
		
	},
	
	onKeyDown:function(e){
		var char = e.data.mainCharacter;

		if(e.keyCode == 38){
			char.moveUp = true;
			char.isMoving = true;
			char.isKeyUpPressed = true;
			e.preventDefault();
		}
		if(e.keyCode == 40){
			char.moveDown = true;
			char.isMoving = true;
			char.isKeyDownPressed = true;
			e.preventDefault();
		}
		if(e.keyCode == 37){
			char.moveLeft = true;
			char.isMoving = true;
			char.isKeyLeftPressed = true;
			e.preventDefault();
		}
		if(e.keyCode == 39){
			char.moveRight = true;
			char.isMoving = true;
			char.isKeyRightPressed = true;
			e.preventDefault();
		}
	},

	onKeyUp: function(e){
		var char = e.data.mainCharacter;
		e.preventDefault();
		if(e.keyCode == 38){
			char.isMoving = false;
			char.moveUp = false;
			char.isKeyUpPressed = false;
		}
		if(e.keyCode == 40){
			char.isMoving = false;
			char.moveDown = false;
			char.isKeyDownPressed = false;
		}
		if(e.keyCode == 37){
			char.isMoving = false;
			char.moveLeft = false;
			char.isKeyLeftPressed = false;
		}
		if(e.keyCode == 39){
			char.isMoving = false;
			char.moveRight = false;
			char.isKeyRightPressed = false;
		}
	},
	
	addEventListeners: function(){
		$(window).on('keydown', this, this.onKeyDown);
		$(window).on('keyup', this, this.onKeyUp);
	},

	removeEventListeners: function(){
		$(window).off('keydown', this.onKeyDown);
		$(window).off('keyup', this.onKeyUp);
	}
});