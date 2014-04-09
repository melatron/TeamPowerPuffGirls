
var a = 10;

function ElfGame(){
	var game = this;
	var canvas = $('#elf-game-canvas')[0];
	var gameContext = null;
	var mainCharacter = null;
	var moveDir = null;
	
	game.level = [];
	
	game.getContext = function(){
		gameContext = canvas.getContext('2d');
	};
	
	game.drawLevelBlock = function(x, y, width, height, isFinish){
		var block = {
				x: x,
				y: y,
				width: width,
				height: height,
				speed: 3,
				isFinish: isFinish
		};
		gameContext.save();
		gameContext.fillStyle = 'black';
		gameContext.strokeStyle = 'red';
		gameContext.fillRect(block.x, block.y, block.width, block.height);
		gameContext.restore();
		game.level.push(block);
	};
	
	game.createMainCharacter = function(x, y){
		mainCharacter = {
				x: x,
				y: y,
				width: 32,
				height: 32,
				moveUp: false,
				moveDown: false,
				moveLeft: false,
				moveRight: false,
				isMoving: false
		};
		mainCharacter.spriteUp = new Sprite(96, 32, 3, 2, story.sprites[0], mainCharacter, gameContext);  // create Sprites
		mainCharacter.spriteDown = new Sprite(96, 32, 3, 2, story.sprites[1], mainCharacter, gameContext);
		mainCharacter.spriteLeft = new Sprite(96, 32, 3, 2, story.sprites[2], mainCharacter, gameContext);
		mainCharacter.spriteRight = new Sprite(96, 32, 3, 2, story.sprites[3], mainCharacter, gameContext);
		mainCharacter.spriteIdle = new Sprite(32, 32, 1, 2, story.sprites[1], mainCharacter, gameContext);
	};
	
	game.updateCharacter = function() {
		//console.log('Up: '+ mainCharacter.moveUp + ' Down: ' + mainCharacter.moveDown + ' Left: ' + mainCharacter.moveLeft + ' Right: ' + mainCharacter.moveRight + ' isMoving: ' + mainCharacter.isMoving);
		if(mainCharacter.moveUp == true){
			if(mainCharacter.moveLeft == true){
				mainCharacter.spriteLeft.drawSprite();
				mainCharacter.x -= mainCharacter.speed;
				mainCharacter.y -= mainCharacter.speed;
				return;
			}
			if(mainCharacter.moveRight == true){
				mainCharacter.spriteRight.drawSprite();
				mainCharacter.y -= mainCharacter.speed;
				mainCharacter.x += mainCharacter.speed;
				return;
			}
		}
		if(mainCharacter.moveDown == true){
			if(mainCharacter.moveLeft == true){
				mainCharacter.spriteLeft.drawSprite();
				mainCharacter.x -= mainCharacter.speed;
				mainCharacter.y += mainCharacter.speed;
				return;
			}
			if(mainCharacter.moveRight == true){
				mainCharacter.spriteRight.drawSprite();
				mainCharacter.x += mainCharacter.speed;
				mainCharacter.y += mainCharacter.speed;
				return;
			}
		}
		if(mainCharacter.moveLeft == true){
			if(mainCharacter.moveUp == true){
				mainCharacter.spriteLeft.drawSprite();
				mainCharacter.x -= mainCharacter.speed;
				mainCharacter.y -= mainCharacter.speed;
				return;
			}
			if(mainCharacter.moveDown == true){
				mainCharacter.spriteLeft.drawSprite();
				mainCharacter.x -= mainCharacter.speed;
				mainCharacter.y += mainCharacter.speed;
				return;
			}
		}
		if(mainCharacter.moveRight == true){
			if(mainCharacter.moveUp == true){
				mainCharacter.spriteRight.drawSprite();
				mainCharacter.x += mainCharacter.speed;
				mainCharacter.y -= mainCharacter.speed;
				return;
			}
			if(mainCharacter.moveDown == true){
				mainCharacter.spriteRight.drawSprite();
				mainCharacter.x += mainCharacter.speed;
				mainCharacter.y += mainCharacter.speed;
				return;
			}

			mainCharacter.spriteRight.drawSprite();
			mainCharacter.x += mainCharacter.speed;
			return;
		}
		if(!mainCharacter.isMoving){
			mainCharacter.spriteIdle.drawSprite();
		}
	};
	
	game.onKeyDown = function(e){
		//e.preventDefault();
		if(e.keyCode == 38){
			mainCharacter.moveUp = true;
			mainCharacter.isMoving = true;
		}
		if(e.keyCode == 40){
			mainCharacter.moveDown = true;
			mainCharacter.isMoving = true;
		}
		if(e.keyCode == 37){
			mainCharacter.moveLeft = true;
			mainCharacter.isMoving = true;
		}
		if(e.keyCode == 39){
			mainCharacter.moveRight = true;
			mainCharacter.isMoving = true;
		}
	};
	
	game.onKeyUp = function(e){
		e.preventDefault();
		if(e.keyCode == 38){
			mainCharacter.isMoving = false;
			mainCharacter.moveUp = false;
		}
		if(e.keyCode == 40){
			mainCharacter.isMoving = false;
			mainCharacter.moveDown = false;
		}
		if(e.keyCode == 37){
			mainCharacter.isMoving = false;
			mainCharacter.moveLeft = false;
		}
		if(e.keyCode == 39){
			mainCharacter.isMoving = false;
			mainCharacter.moveRight = false;
		}
	};
	game.addEventListeners = function(){
		window.addEventListener('keydown', game.onKeyDown, false);
		window.addEventListener('keyup', game.onKeyUp, false);
	}
	game.removeEventListeners = function(){
		// to do 
	};
	
	game.drawLevelOne = function(){
		//to do
	};
	
	game.drawLevelTwo = function(){
		//to do
	};
	
	game.drawLevelThree = function(){
		//to do
	};
	
	game.detectCollision = function(){
		//to do
	};
	
	game.addPickup = function(){
		//to do
	};
	
	game.removePickup = function(){
		//to do
	};
	
	game.mainLoop = function(){
		gameContext.save();
		gameContext.clearRect(0, 0, canvas.width, canvas.height);
		game.updateCharacter();
		gameContext.restore();
	};
	
	game.start = function(){
		game.getContext();
		game.createMainCharacter(10, 10);
		window.addEventListener('keydown', game.onKeyDown, false);
		window.addEventListener('keyup', game.onKeyUp, false);
		setInterval(game.mainLoop, 30);
	};
}