

RadoGame = Game.extend({
	init: function(){
		var game = this;
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
		}
	},
	start: function(){
		this.getContext();
		this.currentLevel = this.createLevelOne();
		this.createMainCharacter(10, 10);
		this.addEventListeners();
		setInterval(this.mainLoop, 30);
	},

	getContext: function(){
		this.gameContext = this.canvas.getContext('2d');
	},

	createLevelBlock: function(x, y, width, height, isFinish){
		var block = {
				x: x,
				y: y,
				width: width,
				height: height,
				isFinish: isFinish,
				charPos: null
		};
		return block;
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
		this.mainCharacter.spriteUp = new Sprite(96, 32, 3, 2, story.sprites[0], this.mainCharacter, this.gameContext);  // create Sprites
		this.mainCharacter.spriteDown = new Sprite(96, 32, 3, 2, story.sprites[1], this.mainCharacter, this.gameContext);
		this.mainCharacter.spriteLeft = new Sprite(96, 32, 3, 2, story.sprites[2], this.mainCharacter, this.gameContext);
		this.mainCharacter.spriteRight = new Sprite(96, 32, 3, 2, story.sprites[3], this.mainCharacter, this.gameContext);
		this.mainCharacter.spriteIdle = new Sprite(32, 32, 1, 2, story.sprites[1], this.mainCharacter, this.gameContext);
	},

	updateCharacter: function(){
		var collision = this.detectCollision();
		var char = this.mainCharacter;

		if(char.moveUp == true){
			if(char.moveLeft == true){
				char.spriteLeft.drawSprite();
				if(!collision.fromRight){
					char.x -= char.speed;
				}	
			}

			if(char.moveRight == true){
				char.spriteRight.drawSprite();
				if(!collision.fromLeft){
					char.x += char.speed;
				}				
			}
			if(!char.moveLeft && !char.moveRight){
				char.spriteUp.drawSprite();
			}
			if(!collision.fromDown){
				char.y -= char.speed;
				return;
			}			
			//char.spriteIdle.drawSprite();
			return;
		}

		if(char.moveDown == true){
			if(char.moveLeft == true){
				char.spriteLeft.drawSprite();
				if(!collision.fromRight){
					char.x -= char.speed;
				}
			}

			if(char.moveRight == true){
				char.spriteRight.drawSprite();
				if(!collision.fromLeft){
					char.x += char.speed;
				}
			}
			if(!char.moveLeft && !char.moveRight){
				char.spriteDown.drawSprite()
			}
			if(!collision.fromUp){
				char.y += char.speed;
			}
			return;
		}

		if(char.moveLeft == true){
			if(char.moveUp == true){
				if(!collision.fromDown){
					char.y -= char.speed;
				}
			}

			if(char.moveDown == true){
				if(!collision.fromUp){
					char.y += char.speed;
				}
			}

			char.spriteLeft.drawSprite();
			if(!collision.fromRight){
				char.x -= char.speed;
			}
			return;
		}

		if(char.moveRight == true){
			if(char.moveUp == true){
				if(!collision.fromDown){
					char.y -= char.speed;
				}
			}

			if(char.moveDown == true){
				if(!collision.fromUp){
					char.y += char.speed;
				}
			}

			char.spriteRight.drawSprite();
			if(!collision.fromLeft){
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

	},

	detectCollision: function(){
		var char = this.mainCharacter;
		var collision = false;
		var collisionFromUp = false,
			collisionFromDown = false,
			collisionFromLeft = false,
			collisionFromRight = false;

		if(char.x < 0){
			collisionFromDown = true;
			if(char.x > 0){
				collisionFromRight = false;
			}
		}
		if(char.y < 0){
			collisionFromDown = true;
		}
		if(char.x + 32 > this.canvas.width){
			collisionFromDown = true;
		}
		if(char.y + 32 > this.canvas.height){
			char.moveDown = false;
			collision = true;
		}
		for(var i = 0; i < this.currentLevel.length; i++){
			var temp = this.currentLevel[i];
			if(char.x > temp.x + temp.width){
				if((char.y + 4 > temp.y && char.y + 4 < temp.y + temp.height) || (char.y + 28 > temp.y && char.y + 28 < temp.y + temp.height)){
					temp.charPos = 'toRight';
					
				}
			}
			if(char.x + 28 < temp.x){
				if((char.y + 4 > temp.y && char.y + 4 < temp.y + temp.height) || (char.y + 28 > temp.y && char.y + 28 < temp.y + temp.height)){
					temp.charPos = 'toLeft';
				}
			}
			if(char.y + 32< temp.y){
				if((char.x + 4 > temp.x && char.x + 4 < temp.x + temp.width) || (char.x + 28 > temp.x && char.x + 28 < temp.x + temp.width)){
					temp.charPos = 'toUp';
				}
			}
			if(char.y > temp.y + temp.height){
				if((char.x + 4 > temp.x && char.x + 4 < temp.x + temp.width) || (char.x + 28 > temp.x && char.x + 28 < temp.x + temp.width)){
					temp.charPos = 'toDown';
				}
			}

			switch (temp.charPos){
				case 'toUp':
					if(char.y + 32 > temp.y){
						//char.moveDown = false;
						collision = true;
						collisionFromUp = true;
						if((char.x > temp.x + temp.width || char.x + 28 < temp.x)  && char.isKeyDownPressed){
							collisionFromUp = false;
						}
					}
					break;
				case 'toDown':
					if(char.y < temp.y + temp.height){
						//char.moveUp = false;
						collision = true;
						collisionFromDown = true;
						if((char.x + 4 > temp.x + temp.width || char.x + 28 < temp.x) && char.isKeyUpPressed){
							collisionFromDown = false;
						}
					}
					break;
				case 'toLeft':
					if(char.x + 32 > temp.x){
						//char.moveRight = false;
						collision = true;
						collisionFromLeft = true;
						if((char.y > temp.y + temp.height || char.y + 28 < temp.y) && char.isKeyRightPressed){
							collisionFromLeft = false;
						}
					}
					break;
				case 'toRight':
					if(char.x < temp.x + temp.width){
						//char.moveLeft = false;
						collision = true;
						collisionFromRight = true;
						if((char.y > temp.y + temp.height || char.y + 28 < temp.y) && char.isKeyLeftPressed){
							collisionFromRight = false;
						}
					}
					break;
			}
		}
	 	return {
	 		isColiding: collision,
	 		fromLeft: collisionFromLeft,
	 		fromRight: collisionFromRight,
	 		fromUp: collisionFromUp,
	 		fromDown: collisionFromDown
	 	};
	},

	createLevelOne: function(){
		var level = [];

		level.push(this.createLevelBlock(50, 50, 100, 50, false));
		level.push(this.createLevelBlock(100, 51, 50, 100, false));

		return level;
	},

	drawLevel: function(){
		for(var i = 0; i < this.currentLevel.length; i++){
			var temp = this.currentLevel[i];
			this.gameContext.fillRect(temp.x, temp.y, temp.width, temp.height);
		}
	}
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