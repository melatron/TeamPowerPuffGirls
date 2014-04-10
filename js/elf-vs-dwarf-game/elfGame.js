
var a = 10;

function ElfGame(){
	var game = this;
	var canvas = $('#elf-game-canvas')[0];
	var gameContext = null;
	var mainCharacter = null;
	var moveDir = null;
	var currentLevel = null;
	
	game.level = [];
	
	game.getContext = function(){
		gameContext = canvas.getContext('2d');
	};
	
	game.createLevelBlock = function(x, y, width, height, isFinish){
		var block = {
				x: x,
				y: y,
				width: width,
				height: height,
				isFinish: isFinish
		};
		return block;
	};

	game.createLevelOne = function(){
		var level = [];

		level.push(game.createLevelBlock(50, 50, 100, 50, false));

		return level;
	}

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
				speed: 3,
				isMoving: false
		};
		mainCharacter.spriteUp = new Sprite(96, 32, 3, 2, story.sprites[0], mainCharacter, gameContext);  // create Sprites
		mainCharacter.spriteDown = new Sprite(96, 32, 3, 2, story.sprites[1], mainCharacter, gameContext);
		mainCharacter.spriteLeft = new Sprite(96, 32, 3, 2, story.sprites[2], mainCharacter, gameContext);
		mainCharacter.spriteRight = new Sprite(96, 32, 3, 2, story.sprites[3], mainCharacter, gameContext);
		mainCharacter.spriteIdle = new Sprite(32, 32, 1, 2, story.sprites[1], mainCharacter, gameContext);
	};
	
	game.updateCharacter = function() {

		var isBlocked = game.detectCollision();

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

			mainCharacter.spriteUp.drawSprite();
			mainCharacter.y -= mainCharacter.speed;
			return;
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

			mainCharacter.spriteDown.drawSprite();
			mainCharacter.y += mainCharacter.speed;
			return;
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

			mainCharacter.spriteLeft.drawSprite();
			mainCharacter.x -= mainCharacter.speed;
			return;
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
		if(!mainCharacter.isMoving || isBlocked == true){
			mainCharacter.spriteIdle.drawSprite();
		}
	};
	
	game.stopCharacter = function(){
		mainCharacter.moveUp = false;
		mainCharacter.moveDown = false;
		mainCharacter.moveLeft = false;
		mainCharacter.moveRight = false;
		mainCharacter.isMoving = false;
	}

	game.onKeyDown = function(e){
		if(e.keyCode == 38){
			mainCharacter.moveUp = true;
			mainCharacter.isMoving = true;
			e.preventDefault();
		}
		if(e.keyCode == 40){
			mainCharacter.moveDown = true;
			mainCharacter.isMoving = true;
			e.preventDefault();
		}
		if(e.keyCode == 37){
			mainCharacter.moveLeft = true;
			mainCharacter.isMoving = true;
			e.preventDefault();
		}
		if(e.keyCode == 39){
			mainCharacter.moveRight = true;
			mainCharacter.isMoving = true;
			e.preventDefault();
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
		for(var i = 0; i < currentLevel.length; i++){
			var temp = currentLevel[i];
			gameContext.fillRect(temp.x, temp.y, temp.width, temp.height);
		}
	};
	
	game.drawLevelTwo = function(){
		//to do
	};
	
	game.drawLevelThree = function(){
		//to do
	};
	
	game.detectCollision = function(){
		var char = mainCharacter;
		var collision = false;

		if(char.x < 0){
			char.moveLeft = false;
			collision = true;
		}
		if(char.y < 0){
			char.moveUp = false;
			collision = true;
		}
		if(char.x + 32 > canvas.width){
			char.moveRight = false;
			collision = true;
		}
		if(char.y + 32 > canvas.height){
			char.moveDown = false;
			collision = true;
		}
		for(var i = 0; i < currentLevel.length; i++){
			var temp = currentLevel[i];

			if(temp.x < char.x && char.x < temp.x + temp.width){
				if((temp.y < char.y && char.y < temp.y + temp.height) || (temp.y < char.y + char.height && char.y + char.height < temp.y + temp.height)){
					char.moveLeft = false;
					console.log("collision: left");
					collision = true;
					return collision;
				}
			}
			if(temp.x < char.x + char.width && char.x + char.width < temp.x + temp.width){
				if((temp.y < char.y && char.y < temp.y + temp.height) || (temp.y < char.y + char.height && char.y + char.height < temp.y + temp.height)){
					char.moveRight = false;
					console.log("collision: right");
					collision = true;
					return collision;
				}
			}
			if(temp.y < char.y && char.y < temp.y + temp.height){
				if((temp.x < char.x && char.x < temp.x + temp.width) || (temp.x < char.x + char.width && char.x + char.width < temp.x + temp.width)){
					char.moveDown = false;
					console.log("collision: up");
					collision = true;
					return collision;
				}
			}
		}
		return collision;
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
		game.drawLevelOne();
		game.updateCharacter();
		gameContext.restore();
	};
	
	game.start = function(){
		game.getContext();
		currentLevel = game.createLevelOne();
		game.createMainCharacter(10, 10);
		window.addEventListener('keydown', game.onKeyDown, false);
		window.addEventListener('keyup', game.onKeyUp, false);
		setInterval(game.mainLoop, 30);
	};
}