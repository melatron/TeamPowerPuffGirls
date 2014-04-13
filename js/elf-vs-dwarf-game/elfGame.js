

RadoGame = Game.extend({
	init: function(){
		var game = this;
		
		this.levelOne = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		                 [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
		                 [3, 1, 1, 1, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		                 [0, 1, 0, 0, 0, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0],
		                 [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		                 [0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		                 [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]];
		this.currentLevel = null;
		this.passableBlocks = [];
		this.impassableBlocks = [];
		this.finishBlocks = [];
		this.startingBlock = null;
		
		this.plot = $("#elf-vs-dwarf-game");
		this.canvas = $('#elf-game-canvas')[0];		
		this.gameContext = $('#elf-game-canvas')[0].getContext('2d');
		this.mainCharacter = {};

		this.mainLoop = function(){
			game.gameContext.save();
			game.gameContext.clearRect(0, 0, canvas.width, canvas.height);
			game.drawLevel();
			game.updateCharacter();
			game.gameContext.restore();
		};
	},
	start: function(){
		this.getContext();
		this.currentLevel = this.levelOne;
		this.populateLevel(this.currentLevel);
		this.createMainCharacter(this.startingBlock.x, this.startingBlock.y);
		this.addEventListeners();
		setInterval(this.mainLoop, 30);
	},

	getContext: function(){
		this.gameContext = this.canvas.getContext('2d');
	},

	createLevelBlock: function(row, col, type){
		var block = {
				row: row,
				col: col,
				x: col*32,
				y: row*32,
				width: 32,
				height: 32,
				type: type,
				isActive: false
		};
		return block;
	},
	
	populateLevel: function(level){
		for(var row = 0; row < level.length; row++){
			for(var col = 0; col < level[row].length; col++){
				var type = level[row][col],
					block = this.createLevelBlock(row, col, type);
				
				if (type == 0){
					this.impassableBlocks.push(block);
				}
				else if (type == 1){
					this.passableBlocks.push(block);
				}
				else if (type == 2){
					this.finishBlocks.push(block);
					this.passableBlocks.push(block);
				}
				else if (type == 3){
					this.startingBlock = block;
					this.passableBlocks.push(block);
				}
				
				level[row][col] = block;
			}
		}
	},
	
	characterLocation: function(){
		var activeBlocks = new Array(),
			charBox = this.mainCharacterBoundingRect,
			i,
			len = this.passableBlocks.length;
		for(i = 0; i < len; i++){
			var temp = this.passableBlocks[i];
			
			if(((charBox.x > temp.x && charBox.x < temp.x + temp.width) || (charBox.x + charBox.width > temp.x && charBox.x + charBox.width < temp.x + temp.width)) && ((charBox.y > temp.y && charBox.y < temp.y + temp.height) || (charBox.y + charBox.height > temp.y && charBox.y + charBox.height < temp.y + temp.height))){
				temp.isActive = true;
				activeBlocks.push(temp);
			}
			else{
				temp.isActive = false;
			}
		}
		
		return activeBlocks;
	},
	
	drawLevel: function(){
		
		for(var i = 0; i < this.passableBlocks.length; i++){
			var temp = this.passableBlocks[i];
			
			if (temp.isActive){
				this.gameContext.save();
				this.gameContext.strokeStyle = 'red';
				this.gameContext.strokeRect(temp.x, temp.y, temp.width, temp.height);
				this.gameContext.restore();
			}
			else{
				this.gameContext.strokeRect(temp.x, temp.y, temp.width, temp.height);				
			}
		}
		for(var j = 0; j < this.impassableBlocks.length; j++){
			var temp = this.impassableBlocks[j];
			this.gameContext.fillRect(temp.x, temp.y, temp.width, temp.height);
		}
		for(var k = 0; k < this.finishBlocks.length; k++){
			var temp = this.finishBlocks[k];
			this.gameContext.fillStyle = 'rgba(89, 49, 143, 0.3)';
			this.gameContext.fillRect(temp.x, temp.y, temp.width, temp.height);
		}
	},
	
	createMainCharacter: function(x, y){
		this.mainCharacter = {
				x: x,
				y: y,
				width: 32,
				height: 32,
				moveUp: false,
				isKeyUpPressed: false,
				moveDown: false,
				isKeyDownPressed: false,
				moveLeft: false,
				isKeyLeftPressed: false,
				moveRight: false,
				isKeyRightPressed: false,
				speed: 3,
				moveDir: null,
				isMoving: false
		};
		
		this.mainCharacterBoundingRect = {
				x: this.mainCharacter.x + 4,
				y: this.mainCharacter.y + 28,
				width: 20,
				height: 8
		};
		
		this.mainCharacter.spriteUp = new Sprite(96, 32, 3, 2, story.sprites[0], this.mainCharacter, this.gameContext);  // create Sprites
		this.mainCharacter.spriteDown = new Sprite(96, 32, 3, 2, story.sprites[1], this.mainCharacter, this.gameContext);
		this.mainCharacter.spriteLeft = new Sprite(96, 32, 3, 2, story.sprites[2], this.mainCharacter, this.gameContext);
		this.mainCharacter.spriteRight = new Sprite(96, 32, 3, 2, story.sprites[3], this.mainCharacter, this.gameContext);
		this.mainCharacter.spriteIdle = new Sprite(32, 32, 1, 2, story.sprites[1], this.mainCharacter, this.gameContext);
	},
	
	detectCollision: function(){
		var collision = {
				top: false,
				bottom: false,
				left: false,
				right: false
		},
			char = this.mainCharacter,
			charBox = this.mainCharacterBoundingRect,
			activeBlocks = this.characterLocation(),
			len = activeBlocks.length;
		
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
		
		for (var i = 0; i < len; i++){
			var temp = activeBlocks[i],
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
			
			if(temp.row != 0){
				upper = this.currentLevel[temp.row - 1][temp.col];
			}
			if(temp.row < this.currentLevel.length - 1){
				lower = this.currentLevel[temp.row + 1][temp.col];
			}
			if(temp.col != 0){
				left = this.currentLevel[temp.row][temp.col - 1];
			}
			if(temp.row < this.currentLevel[0].length - 1){
				right = this.currentLevel[temp.row][temp.col + 1];
			}
			if(temp.row != 0 && temp.col != 0){
				upperLeft = this.currentLevel[temp.row - 1][temp.col - 1];
			}
			if(temp.col != 0 && temp.col < this.currentLevel[0].length - 1){
				upperRight = this.currentLevel[temp.row - 1][temp.col + 1];
			}
			if(temp.col != 0 && temp.row < this.currentLevel.length - 1){
				lowerLeft = this.currentLevel[temp.row + 1][temp.col - 1];
			}
			if(temp.col < this.currentLevel[0].length - 1 && temp.row < this.currentLevel.length - 1){
				lowerRight = this.currentLevel[temp.row + 1][temp.col + 1];
			}
			
			
			if(right && right.type == 0){
				if(charBox.x + charBox.width > temp.x + temp.width){
					collision.right = true;
					/*if(char.moveRight == true && len == 3){
						if(upper.isActive){
							if(char.moveDown == false){
								char.y -= 1;
								charBox.y -= 1;
								break;
							}
						}
						if(lower.isActive){
							if(char.moveUp == false){
								char.y += 1;
								charBox.y += 1;
								break;
							}
						}
					}*/
				}
			}
			if(lower && lower.type == 0){
				if(charBox.y + charBox.height > temp.y + temp.height){
					collision.bottom = true;
					/*if(char.moveDown == true && len == 3){
						if(right.isActive){
							offset = right.x - charBox.x;
							if(offset < normalOffset){
								char.x += 1;
								charBox.x += 1;
								break;															
							}
						}
						if(left.isActive){
							offset = (charBox.x + charBox.width) - (left.width + left.x);
							if(offset < normalOffset){
								char.x -= 1;
								charBox.x -= 1;	
								break;								
							}
						}
					}*/					
				}
			}
			if(left && left.type == 0){
				if(charBox.x < temp.x){
					collision.left = true;
					/*if(char.moveLeft == true && len == 3){
						if(upper.isActive){
							if(char.moveDown == false){
								char.y -= 1;
								charBox.y -= 1;
								break;
							}							
						}
						if(lower.isActive){
							if(char.moveUp == false){
								char.y += 1;
								charBox.y += 1;
								break;							
							}
						}
					}*/
				}
			}
			if(upper && upper.type == 0){
				if(charBox.y < temp.y){
					collision.top = true;
					/*if(char.moveUp == true && len == 3){
						if(right.isActive){
							char.x += 1;
							charBox.x += 1;
							break;
							
						}
						if(left.isActive){
							char.x -= 5;
							charBox.x -= 5;
							break;
						}
					}*/
				}
			}
			
			if(upperLeft && upperLeft.type == 0){
				if(((charBox.x > upperLeft.x && charBox.x < upperLeft.x + upperLeft.width) || (charBox.x + charBox.width > upperLeft.x && charBox.x + charBox.width < upperLeft.x + upperLeft.width)) && ((charBox.y > upperLeft.y && charBox.y < upperLeft.y + upperLeft.height) || (charBox.y + charBox.height > upperLeft.y && charBox.y + charBox.height < upperLeft.y + upperLeft.height))){
					if(len == 3){
						console.log('hello');
						offsetX = (upperLeft.x + upperLeft.width) - charBox.x;
						offsetY = (upperLeft.y + upperLeft.height) - charBox.y;
						console.log("Y: " + offsetY + " X: " + offsetX);
						if(offsetX > offsetY){
							char.y += offsetY;
							charBox.y += offsetY;
							break;
						}
						if(offsetY > offsetX){
							char.x += offsetX;
							charBox.x += offsetX;
							break;
						}
						if(offsetY == offsetX){
							char.x += offsetX;
							charBox.x += offsetX;
							break;
						}
					}
				}         
			}
			if(upperRight && upperRight.type == 0){
				if(((charBox.x > upperRight.x && charBox.x < upperRight.x + upperRight.width) || (charBox.x + charBox.width > upperRight.x && charBox.x + charBox.width < upperRight.x + upperRight.width)) && ((charBox.y > upperRight.y && charBox.y < upperRight.y + upperRight.height) || (charBox.y + charBox.height > upperRight.y && charBox.y + charBox.height < upperRight.y + upperRight.height))){
					if(len == 3){
						offsetX = (charBox.x + charBox.width) - upperRight.x;
						offsetY = (upperRight.y + upperRight.height) - charBox.y;
						console.log("Y: " + offsetY + " X: " + offsetX);
						
						if(offsetX > offsetY){
							char.y += offsetY;
							charBox.y += offsetY;
						}
						if(offsetY > offsetX){
							char.x -= offsetX;
							charBox.x -= offsetX;
						}
						if(offsetY == offsetX){
							char.x -= offsetX;
							charBox.x -= offsetX;
						}
					}
				}
			}
			if(lowerLeft && lowerLeft.type == 0){
				
			}
			if(lowerRight && lowerRight.type == 0){
				
			}
			
		}
		
		return collision;
	},

	updateCharacter: function(){
		var collision = this.detectCollision();
		var char = this.mainCharacter,
			charBox = this.mainCharacterBoundingRect;

		if(char.moveUp == true){
			if(char.moveLeft == true){
				char.spriteLeft.drawSprite();
				if(!collision.left){
					char.x -= char.speed;
					charBox.x -= char.speed;					
				}
			}

			if(char.moveRight == true){
				char.spriteRight.drawSprite();
				if(!collision.right){
					char.x += char.speed;
					charBox.x += char.speed;					
				}
			}
			if(!char.moveLeft && !char.moveRight){
				char.spriteUp.drawSprite();
			}
			if(!collision.top){
				char.y -= char.speed;
				charBox.y -= char.speed;				
			}
			return;
			//char.spriteIdle.drawSprite();
		}

		if(char.moveDown == true){
			if(char.moveLeft == true){
				char.spriteLeft.drawSprite();
				if(!collision.left){
					char.x -= char.speed;
					charBox.x -= char.speed;					
				}
			}

			if(char.moveRight == true){
				char.spriteRight.drawSprite();
				if(!collision.right){
					char.x += char.speed;
					charBox.x += char.speed;					
				}
			}
			if(!char.moveLeft && !char.moveRight){
				char.spriteDown.drawSprite()
			}
			if(!collision.bottom){
				char.y += char.speed;
				charBox.y += char.speed;			
			}
			return;
		}

		if(char.moveLeft == true){
			if(char.moveUp == true){
				if(!collision.top){
					char.y -= char.speed;
					charBox.y -= char.speed;					
				}
			}

			if(char.moveDown == true){
				if(!collision.bottom){
					char.y += char.speed;
					charBox.y += char.speed;					
				}
			}

			char.spriteLeft.drawSprite();
			if(!collision.left){
				char.x -= char.speed;
				charBox.x -= char.speed;				
			}
			return;
		}

		if(char.moveRight == true){
			if(char.moveUp == true){
				if(!collision.up){
					char.y -= char.speed;
					charBox.y -= char.speed;					
				}
			}

			if(char.moveDown == true){
				if(!collision.bottom){
					char.y += char.speed;
					charBox.y += char.speed;					
				}
			}

			char.spriteRight.drawSprite();
			if(!collision.right){
				char.x += char.speed;
				charBox.x += char.speed;				
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

	}

	

/*	createLevelOne: function(){
		var level = [];

		level.push(this.createLevelBlock(50, 50, 100, 50, false));
		level.push(this.createLevelBlock(100, 54, 50, 100, false));

		return level;
	},

	drawLevel: function(){
		for(var i = 0; i < this.currentLevel.length; i++){
			var temp = this.currentLevel[i];
			this.gameContext.strokeRect(temp.x, temp.y, temp.width, temp.height);
		}
	}*/
});











	
	



// function ElfGame(){
// 	var game = this;
// 	var canvas = $('#elf-game-canvas')[0];
// 	var gameContext = null;
// 	var mainCharacter = null;
// 	var moveDir = null;
// 	var currentLevel = null;
	
// 	game.level = [];
	
// 	game.getContext = function(){
// 		gameContext = canvas.getContext('2d');
// 	};
	
// 	game.createLevelBlock = function(x, y, width, height, isFinish){
// 		var block = {
// 				x: x,
// 				y: y,
// 				width: width,
// 				height: height,
// 				isFinish: isFinish
// 		};
// 		return block;
// 	};

// 	game.createLevelOne = function(){
// 		var level = [];

// 		level.push(game.createLevelBlock(50, 50, 100, 50, false));

// 		return level;
// 	}

// 	game.createMainCharacter = function(x, y){
// 		mainCharacter = {
// 				x: x,
// 				y: y,
// 				width: 32,
// 				height: 32,
// 				moveUp: false,
// 				moveDown: false,
// 				moveLeft: false,
// 				moveRight: false,
// 				speed: 3,
// 				isMoving: false
// 		};
// 		mainCharacter.spriteUp = new Sprite(96, 32, 3, 2, story.sprites[0], mainCharacter, gameContext);  // create Sprites
// 		mainCharacter.spriteDown = new Sprite(96, 32, 3, 2, story.sprites[1], mainCharacter, gameContext);
// 		mainCharacter.spriteLeft = new Sprite(96, 32, 3, 2, story.sprites[2], mainCharacter, gameContext);
// 		mainCharacter.spriteRight = new Sprite(96, 32, 3, 2, story.sprites[3], mainCharacter, gameContext);
// 		mainCharacter.spriteIdle = new Sprite(32, 32, 1, 2, story.sprites[1], mainCharacter, gameContext);
// 	};
	
// 	game.updateCharacter = function() {

// 		var isBlocked = game.detectCollision();

// 		if(mainCharacter.moveUp == true){
// 			if(mainCharacter.moveLeft == true){
// 				mainCharacter.spriteLeft.drawSprite();
// 				mainCharacter.x -= mainCharacter.speed;
// 				mainCharacter.y -= mainCharacter.speed;
// 				return;
// 			}
// 			if(mainCharacter.moveRight == true){
// 				mainCharacter.spriteRight.drawSprite();
// 				mainCharacter.y -= mainCharacter.speed;
// 				mainCharacter.x += mainCharacter.speed;
// 				return;
// 			}

// 			mainCharacter.spriteUp.drawSprite();
// 			mainCharacter.y -= mainCharacter.speed;
// 			return;
// 		}
// 		if(mainCharacter.moveDown == true){
// 			if(mainCharacter.moveLeft == true){
// 				mainCharacter.spriteLeft.drawSprite();
// 				mainCharacter.x -= mainCharacter.speed;
// 				mainCharacter.y += mainCharacter.speed;
// 				return;
// 			}
// 			if(mainCharacter.moveRight == true){
// 				mainCharacter.spriteRight.drawSprite();
// 				mainCharacter.x += mainCharacter.speed;
// 				mainCharacter.y += mainCharacter.speed;
// 				return;
// 			}

// 			mainCharacter.spriteDown.drawSprite();
// 			mainCharacter.y += mainCharacter.speed;
// 			return;
// 		}
// 		if(mainCharacter.moveLeft == true){
// 			if(mainCharacter.moveUp == true){
// 				mainCharacter.spriteLeft.drawSprite();
// 				mainCharacter.x -= mainCharacter.speed;
// 				mainCharacter.y -= mainCharacter.speed;
// 				return;
// 			}
// 			if(mainCharacter.moveDown == true){
// 				mainCharacter.spriteLeft.drawSprite();
// 				mainCharacter.x -= mainCharacter.speed;
// 				mainCharacter.y += mainCharacter.speed;
// 				return;
// 			}

// 			mainCharacter.spriteLeft.drawSprite();
// 			mainCharacter.x -= mainCharacter.speed;
// 			return;
// 		}
// 		if(mainCharacter.moveRight == true){
// 			if(mainCharacter.moveUp == true){
// 				mainCharacter.spriteRight.drawSprite();
// 				mainCharacter.x += mainCharacter.speed;
// 				mainCharacter.y -= mainCharacter.speed;
// 				return;
// 			}
// 			if(mainCharacter.moveDown == true){
// 				mainCharacter.spriteRight.drawSprite();
// 				mainCharacter.x += mainCharacter.speed;
// 				mainCharacter.y += mainCharacter.speed;
// 				return;
// 			}

// 			mainCharacter.spriteRight.drawSprite();
// 			mainCharacter.x += mainCharacter.speed;
// 			return;
// 		}
// 		if(!mainCharacter.isMoving || isBlocked == true){
// 			mainCharacter.spriteIdle.drawSprite();
// 		}
// 	};
	
// 	game.stopCharacter = function(){
// 		mainCharacter.moveUp = false;
// 		mainCharacter.moveDown = false;
// 		mainCharacter.moveLeft = false;
// 		mainCharacter.moveRight = false;
// 		mainCharacter.isMoving = false;
// 	}

// 	game.onKeyDown = function(e){
// 		if(e.keyCode == 38){
// 			mainCharacter.moveUp = true;
// 			mainCharacter.isMoving = true;
// 			e.preventDefault();
// 		}
// 		if(e.keyCode == 40){
// 			mainCharacter.moveDown = true;
// 			mainCharacter.isMoving = true;
// 			e.preventDefault();
// 		}
// 		if(e.keyCode == 37){
// 			mainCharacter.moveLeft = true;
// 			mainCharacter.isMoving = true;
// 			e.preventDefault();
// 		}
// 		if(e.keyCode == 39){
// 			mainCharacter.moveRight = true;
// 			mainCharacter.isMoving = true;
// 			e.preventDefault();
// 		}
// 	};
	
// 	game.onKeyUp = function(e){
// 		e.preventDefault();
// 		if(e.keyCode == 38){
// 			mainCharacter.isMoving = false;
// 			mainCharacter.moveUp = false;
// 		}
// 		if(e.keyCode == 40){
// 			mainCharacter.isMoving = false;
// 			mainCharacter.moveDown = false;
// 		}
// 		if(e.keyCode == 37){
// 			mainCharacter.isMoving = false;
// 			mainCharacter.moveLeft = false;
// 		}
// 		if(e.keyCode == 39){
// 			mainCharacter.isMoving = false;
// 			mainCharacter.moveRight = false;
// 		}
// 	};
// 	game.addEventListeners = function(){
// 		window.addEventListener('keydown', game.onKeyDown, false);
// 		window.addEventListener('keyup', game.onKeyUp, false);
// 	}
// 	game.removeEventListeners = function(){
// 		// to do 
// 	};
	
// 	game.drawLevelOne = function(){
// 		for(var i = 0; i < currentLevel.length; i++){
// 			var temp = currentLevel[i];
// 			gameContext.fillRect(temp.x, temp.y, temp.width, temp.height);
// 		}
// 	};
	
// 	game.drawLevelTwo = function(){
// 		//to do
// 	};
	
// 	game.drawLevelThree = function(){
// 		//to do
// 	};
	
// 	game.detectCollision = function(){
// 		var char = mainCharacter;
// 		var collision = false;

// 		if(char.x < 0){
// 			char.moveLeft = false;
// 			collision = true;
// 		}
// 		if(char.y < 0){
// 			char.moveUp = false;
// 			collision = true;
// 		}
// 		if(char.x + 32 > canvas.width){
// 			char.moveRight = false;
// 			collision = true;
// 		}
// 		if(char.y + 32 > canvas.height){
// 			char.moveDown = false;
// 			collision = true;
// 		}
// 		for(var i = 0; i < currentLevel.length; i++){
// 			var temp = currentLevel[i];
// 			if()
// 		}


// 		return collision;
// 	};
	
// 	game.addPickup = function(){
// 		//to do
// 	};
	
// 	game.removePickup = function(){
// 		//to do
// 	};
	
// 	game.mainLoop = function(){
// 		gameContext.save();
// 		gameContext.clearRect(0, 0, canvas.width, canvas.height);
// 		game.drawLevelOne();
// 		game.updateCharacter();
// 		gameContext.restore();
// 	};
	
// 	game.start = function(){
// 		game.getContext();
// 		currentLevel = game.createLevelOne();
// 		game.createMainCharacter(10, 10);
// 		window.addEventListener('keydown', game.onKeyDown, false);
// 		window.addEventListener('keyup', game.onKeyUp, false);
// 		setInterval(game.mainLoop, 30);
// 	};
// }