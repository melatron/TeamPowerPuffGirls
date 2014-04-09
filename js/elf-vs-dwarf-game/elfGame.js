/**
 * 
 */
function ElfGame(){
	var game = this;
	var canvas = $('#elf-game-canvas')[0];
	var gameContext = null;
	var mainCharacter = null;
	var moveDir = null;
	var characterSpeed = 3;
	
	game.level = [];
	
	game.getContext = function(){
		gameContext = canvas.getContext('2d');
	}
	
	game.drawLevelBlock = function(x, y, width, height, isFinish){
		var block = {
				x: x,
				y: y,
				width: width,
				height: height,
				isFinish: isFinish
		}
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
				height: 32
		};
		mainCharacter.spriteUp = new Sprite(96, 32, 3, 2, story.sprites[0], mainCharacter, gameContext);  // create Sprites
		mainCharacter.spriteDown = new Sprite(96, 32, 3, 2, story.sprites[1], mainCharacter, gameContext);
		mainCharacter.spriteLeft = new Sprite(96, 32, 3, 2, story.sprites[2], mainCharacter, gameContext);
		mainCharacter.spriteRight = new Sprite(96, 32, 3, 2, story.sprites[3], mainCharacter, gameContext);
		mainCharacter.spriteIdle = new Sprite(32, 32, 1, 2, story.sprites[1], mainCharacter, gameContext);
	};
	
	game.updateCharacter = function(){
		if(moveDir){
			if(moveDir == 'up'){
				mainCharacter.spriteUp.drawSprite();
				mainCharacter.y -= characterSpeed;
			}
			if(moveDir == 'down'){
				mainCharacter.spriteDown.drawSprite();
				mainCharacter.y += characterSpeed;
			}
			if(moveDir == 'left'){
				mainCharacter.spriteLeft.drawSprite();
				mainCharacter.x -= characterSpeed;
			}
			if(moveDir == 'right'){
				mainCharacter.spriteRight.drawSprite();
				mainCharacter.x += characterSpeed;
			}
		}else{
			mainCharacter.spriteIdle.drawSprite();
		}
	};
	
	game.onKeyDown = function(e){
		if(e.keycode == 38){
			moveDir = 'up';
			console.log('moved');
		}
		if(e.keycode == 40){
			moveDir = 'down';
		}
		if(e.keycode == 37){
			moveDir = 'left';
		}
		if(e.keycode == 39){
			moveDir = 'right';
		}
	};
	
	game.onKeyUp = function(e){
		moveDir = null;
	};
	
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
//		gameContext.clearRect(0, 0, canvas.width, canvas.height);
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