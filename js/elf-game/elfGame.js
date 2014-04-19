

RadoGame = Game.extend({
	init: function(){
		var game = this;

		this.levels = [];            //array of levels
		this.levelIndex = 1;
		this.currentLevel = null;	//current level
		this.passableBlocks = [];	//array of all passable blocks
		this.impassableBlocks = [];	//array of all impassable blocks
		this.finishBlocks = [];		//array of all finish blocks
		this.startingBlock = null;	//the hero starting point
		
		this.plot = $('#elf-game');
		this.canvas = $('#elf-game-canvas')[0];
		this.gameContext = $('#elf-game-canvas')[0].getContext('2d');
		this.mainCharacter = {};
		
		this.elves = [];
		
		this.animation = null;
		// -- MAIN LOOP -- //
		
		this.mainLoop = function(){
			game.gameContext.save();
			game.gameContext.clearRect(0, 0, canvas.width, canvas.height);
			game.drawLevel();
			game.updateCoins();
			game.updateElves();
			game.updateCharacter();
			game.checkLevelProgress();
			game.gameContext.restore();
			game.animation = requestAnimationFrame(game.mainLoop);
		};
	},
	
	// ===== START METHOD ====== //
	start: function(){
		this.getContext();
		this.addGameToPlot();
		this.createLevels();
		this.currentLevel = this.levels[this.levelIndex];
		this.populateLevel(this.currentLevel);
		this.createCoins();
		this.createElves();
		this.createMainCharacter(this.startingBlock.x, this.startingBlock.y);
		this.addEventListeners();
		this.mainLoop();
	},
	
	startNewLevel: function(){
		this.passableBlocks = [];
		this.impassableBlocks = [];
		this.finishBlocks = [];
		this.startingBlock = null;
		this.populateLevel(this.currentLevel);
		this.createCoins();
		this.createElves();
		this.createMainCharacter(this.startingBlock.x, this.startingBlock.y);
	},
	
	endGame: function(){
		cancelAnimationFrame(this.animation);
		this.removeGameFromPlot();
		this.removeEventListeners();
		this.gameOver = true;
	},
	
	// ===== GET CONTEXT ====== //
	
	getContext: function(){
		this.gameContext = this.canvas.getContext('2d');
	},
	
	// ===== LEVEL BLOCK CONSTRUCTOR ===== //
	
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
	
	// ======== LEVEL CONSTRUCTOR ======= //
	
	createLevel: function(number, layout, sprite){
		var level = {
				x: 0,
				y: 0,
				number: number,
				layout: layout,
				isFinished: false,
				elves: [],
				coins: [],
				sprite: null
		};
		return level;
	},
	
	// ======= CREATING THE LEVELS ======== //
	
	createLevels: function(){
		
		
		
		this.levels.push(this.createLevel(
				1,
				[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],		// 0 - impassable,
                 [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],		// 1 - passable,
                 [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],		// 2 - finish,
                 [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],		// 3 - starting 
                 [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
                 [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
				)
		);
		
		this.levels[0].sprite = new Sprite(1920, 224, 3, 10, story.sprites[24], this.levels[0], this.gameContext);
		
		this.levels.push(this.createLevel(
				2,
				[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 3, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                 [0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                 [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0],
                 [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
                 )
		);
		
		this.levels[1].sprite = new Sprite(1920, 224, 3, 10, story.sprites[25], this.levels[1], this.gameContext);
		
		this.levels.push(this.createLevel(
				3,
				[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                 [3, 1, 1, 1, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 1, 1, 1, 0, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0],
                 [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0]]
                 )
		);
	},
	
	// ====== INSERTING BLOCKS IN MATRIX ======= //
	
	populateLevel: function(level){
		for(var row = 0; row < level.layout.length; row++){
			for(var col = 0; col < level.layout[row].length; col++){
				var type = level.layout[row][col],
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
				
				level.layout[row][col] = block;
			}
		}
	},
	
	checkLevelProgress: function(){
		var i,
			len = this.finishBlocks.length;
		
		for(i = 0; i < len; i ++){
			var temp = this.finishBlocks[i];
			if(temp.isActive == true){
				this.currentLevel.isFinished = true;
			}
		}
		if(this.currentLevel.isFinished){
			if(this.levelIndex < this.levels.length - 1){
				this.levelIndex++;
				this.currentLevel = this.levels[this.levelIndex];
				this.startNewLevel();
			}
			else{
//				this.gameOver();
			}
		}
	},
	
	checkIfGameOver: function(){
		
	},
	
	// ====== DETERMINE HERO LOCATION ======= //
	
	characterLocation: function(){
		var activeBlocks = new Array(),
			charBox = this.mainCharacterBoundingRect,
			i,
			len = this.passableBlocks.length;
		for(i = 0; i < len; i++){
			var temp = this.passableBlocks[i];
			
			if(this.areOverlapping(charBox, temp)){
				temp.isActive = true;
				activeBlocks.push(temp);
			}
			else{
				temp.isActive = false;
			}
		}
		
		return activeBlocks;
	},
	
	// ====== DRAWING THE LEVEL (TEST) ===== //
	
	drawLevel: function(){
		
		this.currentLevel.sprite.drawSprite();
		
//		for(var i = 0; i < this.passableBlocks.length; i++){
//			var temp = this.passableBlocks[i];
//			
//			if (temp.isActive){
//				this.gameContext.save();
//				this.gameContext.strokeStyle = 'red';
//				this.gameContext.strokeRect(temp.x, temp.y, temp.width, temp.height);
//				this.gameContext.restore();
//			}
//			else{
//				this.gameContext.strokeRect(temp.x, temp.y, temp.width, temp.height);				
//			}
//		}
//		for(var j = 0; j < this.impassableBlocks.length; j++){
//			var temp = this.impassableBlocks[j];
//			this.gameContext.fillRect(temp.x, temp.y, temp.width, temp.height);
//		}
//		for(var k = 0; k < this.finishBlocks.length; k++){
//			var temp = this.finishBlocks[k];
//			this.gameContext.fillStyle = 'rgba(89, 49, 143, 0.3)';
//			this.gameContext.fillRect(temp.x, temp.y, temp.width, temp.height);
//		}
		
	},
	
	// ====== MAIN CHARACTER CONSTRUCTOR ===== //
	
	createMainCharacter: function(x, y){
		var self = this;
		this.mainCharacter = {
				x: x,
				y: y,
				width: 32,
				height: 32,
				moveUp: false,
				moveDown: false,
				moveLeft: false,
				moveRight: false,
				speed: 2,
				isMoving: false,
				isCaught: false
		};

		this.mainCharacterBoundingRect = {
				x: this.mainCharacter.x + 6,
				y: this.mainCharacter.y + 28,
				width: 20,
				height: 8
		};
		
		this.mainCharacter.spriteUp = new Sprite(96, 32, 3, 4, story.sprites[0], this.mainCharacter, this.gameContext);  // create Sprites
		this.mainCharacter.spriteDown = new Sprite(96, 32, 3, 4, story.sprites[1], this.mainCharacter, this.gameContext);
		this.mainCharacter.spriteLeft = new Sprite(96, 32, 3, 4, story.sprites[2], this.mainCharacter, this.gameContext);
		this.mainCharacter.spriteRight = new Sprite(96, 32, 3, 4, story.sprites[3], this.mainCharacter, this.gameContext);
		this.mainCharacter.spriteIdle = new Sprite(32, 32, 1, 4, story.sprites[1], this.mainCharacter, this.gameContext);
	},

	createElf: function(type, width, height, movePatternType, direction, startBlock, endBlock, speed){
		var elf = {
			startBlock: startBlock,
			x: startBlock.x,
			y: startBlock.y - 10,
			width: width,
			height: height,
			speed: speed,
			moveUp: false,
			moveDown: false,
			moveLeft: false,
			moveRight: false,
			movePattern: this.createMovePattern(movePatternType, direction, startBlock, endBlock)
		};
		var game = this;
		if(movePatternType == 'follow'){
			elf.moveTo = function(destination){
				//console.log(this);
				if(game.areOverlapping(destination, elf, 5, 5, 5, 5) == false){
					if(elf.x < destination.x - 2){
						elf.moveRight = true;
						elf.moveLeft = false;
					}
					else if(elf.x > destination.x + 2){
						elf.moveLeft = true;
						elf.moveRight = false;
					}
					else{
						elf.moveLeft = false;
						elf.moveRight = false;
					}

					if(elf.y < destination.y){
						elf.moveDown = true;
						elf.moveUp = false;
					}
					else if(elf.y > destination.y){
						elf.moveUp = true;
						elf.moveDown = false;
					}
					else {
					elf.moveUp = false;
					elf.moveDown = false;
					}
				}
/*				else {
					elf.moveUp = false;
					elf.moveDown = false;
					elf.moveLeft = false;
					elf.moveRight = false;
				}*/
			}
		}
		
//		elf.movePattern = this.createMovePattern(movePatternType, direction, startBlock, endBlock);
		if(type == 'green'){
			elf.spriteUp = new Sprite(96, 32, 3, 4, story.sprites[12], elf, this.gameContext);
			elf.spriteDown = new Sprite(96, 32, 3, 4, story.sprites[13], elf, this.gameContext);
			elf.spriteLeft = new Sprite(96, 32, 3, 4, story.sprites[14], elf, this.gameContext);
			elf.spriteRight = new Sprite(96, 32, 3, 4, story.sprites[15], elf, this.gameContext);
			elf.spriteIdle = new Sprite(32, 32, 1, 4, story.sprites[13], elf, this.gameContext);
		}
		else if (type == 'brown'){
			elf.spriteUp = new Sprite(96, 32, 3, 4, story.sprites[29], elf, this.gameContext);
			elf.spriteDown = new Sprite(96, 32, 3, 4, story.sprites[30], elf, this.gameContext);
			elf.spriteLeft = new Sprite(96, 32, 3, 4, story.sprites[31], elf, this.gameContext);
			elf.spriteRight = new Sprite(96, 32, 3, 4, story.sprites[32], elf, this.gameContext);
			elf.spriteIdle = new Sprite(32, 32, 1, 4, story.sprites[30], elf, this.gameContext);
		}
		

		return elf;
	},
	
	// ================ POPULATES THE LEVELS WITH ELVES ====================== //
	
	createElves: function(){
		var level1 = this.levels[0],
			level2 = this.levels[1],
			level3 = this.levels[2];
		
		level1.elves[0] = this.createElf (
				'green',
				32, 
				32, 
				'linear', 
				'horizontal', 
				level1.layout[1][12], 
				level1.layout[1][18],
				4
				);
		level1.elves[1] = this.createElf (
				'green',
				32,
				32,
				'linear',
				'horizontal',
				level1.layout[2][18],
				level1.layout[2][12],
				4
		);
		level1.elves[2] = this.createElf(
				'green',
				32,
				32,
				'linear',
				'horizontal',
				level1.layout[4][12],
				level1.layout[4][18],
				3
		);
		level1.elves[3] = this.createElf(
				'green',
				32,
				32,
				'circular',
				'clockwise',
				level1.layout[1][1],
				level1.layout[4][4],
				3
			);
		level1.elves[4] = this.createElf(
				'green',
				32,
				32,
				'circular',
				'clockwise',
				level1.layout[1][4],
				level1.layout[4][7],
				3
			);
		level1.elves[5] = this.createElf(
				'green',
				32,
				32,
				'circular',
				'clockwise',
				level1.layout[1][7],
				level1.layout[4][10],
				3
			);
		level2.elves[0] = this.createElf(
				'green',
				32,
				32,
				'circular',
				'clockwise',
				level2.layout[2][2],
				level2.layout[3][3],
				1
			);
		level2.elves[1] = this.createElf(
				'brown',
				32,
				32,
				'circular',
				'clockwise',
				level2.layout[2][4],
				level2.layout[3][5],
				2
			);
		level2.elves[2] = this.createElf(
				'green',
				32,
				32,
				'circular',
				'clockwise',
				level2.layout[4][2],
				level2.layout[5][3],
				2
			);
		level2.elves[3] = this.createElf(
				'brown',
				32,
				32,
				'circular',
				'clockwise',
				level2.layout[4][4],
				level2.layout[5][5],
				1
			);
		level2.elves[4] = this.createElf(
				'green',
				32,
				32,
				'circular',
				'counterClockwise',
				level2.layout[4][6],
				level2.layout[5][7],
				2
			);
		level2.elves[5] = this.createElf(
				'green',
				32,
				32,
				'circular',
				'clockwise',
				level2.layout[2][8],
				level2.layout[3][9],
				1
			);
		level2.elves[6] = this.createElf(
				'brown',
				32,
				32,
				'linear',
				'horizontal',
				level2.layout[5][8],
				level2.layout[5][11],
				2
			);
		level2.elves[7] = this.createElf(
				'green',
				32,
				32,
				'linear',
				'horizontal',
				level2.layout[4][11],
				level2.layout[4][8],
				2
			);
		level2.elves[8] = this.createElf(
				'brown',
				32,
				32,
				'circular',
				'clockwise',
				level2.layout[2][10],
				level2.layout[3][11],
				1
			);
		level2.elves[9] = this.createElf(
				'green',
				32,
				32,
				'follow',
				null,
				level2.layout[5][17],
				null,
				1
			);
	},
	
	createCoins: function(){
		var level1 = this.levels[0],
			level2 = this.levels[1],
			level3 = this.levels[2];
		
		level1.coins[0] = this.createCoin(level1.layout[4][4]);
		level1.coins[1] = this.createCoin(level1.layout[4][7]);
		level1.coins[2] = this.createCoin(level1.layout[4][10]);
		level2.coins[0] = this.createCoin(level2.layout[3][8]);
		level2.coins[1] = this.createCoin(level2.layout[5][11]);
		level2.coins[2] = this.createCoin(level2.layout[5][2]);
	},
	
	updateCoins: function(){
		var i, len = this.currentLevel.coins.length, temp;
		
		for(i = 0; i < len; i++){
			temp = this.currentLevel.coins[i];
			
			if(this.areOverlapping(this.mainCharacter, temp, 8, 4, 8, 4)){
				console.log('pickup');
				temp.isCollected = true;
			}
			if(temp.isCollected == false){
				temp.sprite.drawSprite();
			}
		}
	},
	
	resetCoins: function(){
		var i, len = this.currentLevel.coins.length, temp;
		
		for(i = 0; i < len; i++){
			temp = this.currentLevel.coins[i];
			temp.isCollected = false;
		}
	},
	
	// ================== MOVE PATTERN OBJECT ================= //
	
	createMovePattern: function(type, direction, startBlock, endBlock){
		var pattern = {
			type: type,
			direction: direction || null,
			startBlock: startBlock,
			endBlock: endBlock || null
		};

		return pattern;
	},
	
	// ============= MOVE PATTERN IMPLEMENTATION ============= //
	
	implementMovePattern: function(elf){
		var type = elf.movePattern.type,
			start = elf.movePattern.startBlock,
			end = elf.movePattern.endBlock || null,
			direction = elf.movePattern.direction || null,
			char = this.mainCharacter;
		
		if(type != 'follow'){
			if(start.x > end.x){
				var temp = start;
				start = end;
				end = temp;
			}

		}
		
		switch(type){
		case 'linear':
			if(direction == 'horizontal'){
				if(elf.x >= end.x){
					elf.moveLeft = true;
				}
				else if(elf.x <= start.x){
					elf.moveLeft = false;
					elf.moveRight = true;
					console.log('change');
				}
			}
			else if(direction == 'vertical'){
				if(elf.y >= end.y){
					elf.moveUp = true;
				}
				if(elf.y <= start.y){
					elf.moveDown = true;
				}
			}

			break;
		case 'circular':
			var start1 = this.currentLevel.layout[start.row][end.col],
				end1 = this.currentLevel.layout[end.row][start.col],
				horizontal = true;
			if(direction == 'clockwise'){
				if(elf.x <= start.x && elf.y <= start.y - 10){
					elf.moveRight = true;
					elf.moveUp = false;
				}
				else if(elf.x >= start1.x && elf.y <= start.y - 10){
					elf.moveDown = true;
					elf.moveRight = false;
				}
				else if(elf.x >= start1.x && elf.y >= end.y - 10){
					elf.moveLeft = true;
					elf.moveDown = false;
				}
				else if(elf.x <= end1.x && elf.y >= end1.y - 10){
					elf.moveUp = true;
					elf.moveLeft = false;
				}
			}
			else if(direction == 'counterClockwise'){
				if(elf.x <= start.x && elf.y <= start.y - 10){
					elf.moveDown = true;
					elf.moveLeft = false;
				}
				else if(elf.x <= end1.x && elf.y >= end1.y - 10){
					elf.moveRight = true;
					elf.moveDown = false;
				}
				else if(elf.x >= end.x && elf.y >= end.y - 10){
					elf.moveUp = true;
					elf.moveRight = false;
				}
				else if(elf.x >= start1.x && elf.y <= start1.y - 10){
					elf.moveLeft = true;
					elf.moveUp = false;
				}
			}

			break;
		case 'follow':

			
			var level = this.currentLevel,
				follow = true,
				destination = char,
				line = {
				x1: elf.startBlock.x + elf.width/2,
				y1: elf.startBlock.y + elf.height/2,
				x2: char.x + char.width/2,
				y2: char.y + char.height
			};

			

			this.gameContext.save();
			this.gameContext.strokeStyle = 'red';
			this.gameContext.beginPath();
			this.gameContext.moveTo(line.x1, line.y1);
			this.gameContext.lineTo(line.x2, line.y2);
			this.gameContext.stroke();
			this.gameContext.restore();

			for(var row = 0; row < level.layout.length; row++){
				for(var col = 0; col < level.layout[row].length; col++){
					var temp = level.layout[row][col];
					if(this.detectLineIntersection(temp, line)){
						this.gameContext.save();
						this.gameContext.strokeStyle = 'blue';
						this.gameContext.strokeRect(temp.x, temp.y, temp.width, temp.height);
						this.gameContext.restore();

						if(temp.type == 0){
							destination = elf.startBlock;
							break;
						}
					}
				}
			}

			elf.moveTo(destination);

			break;

		default:
			break;
		}
	},

	updateElf: function(elf){
		
		this.implementMovePattern(elf);
		
		if(elf.moveLeft == true){
			elf.spriteLeft.drawSprite();
			elf.x -= elf.speed;
		}
		if(elf.moveRight == true){
			elf.spriteRight.drawSprite();
			elf.x += elf.speed;
		}
		if(elf.moveUp == true){
			elf.spriteUp.drawSprite();
			elf.y -= elf.speed;
		}
		if(elf.moveDown == true){
			elf.spriteDown.drawSprite();
			elf.y += elf.speed;
		}
		if(!elf.moveUp && !elf.moveDown && !elf.moveLeft && !elf.moveRight){
			elf.spriteIdle.drawSprite();
		}
	},
	
	updateElves: function(){
		var i,
			len = this.currentLevel.elves.length;
		
		for(i = 0; i < len; i++){
			this.updateElf(this.currentLevel.elves[i]);
			if(this.areOverlapping(this.currentLevel.elves[i], this.mainCharacter, 8, 4, 8, 4)){
			//	this.mainCharacter.isCaught = true;
			}
		}
	},
	
	//=========== COIN OBJECT ===========//
	
	createCoin: function(position){
		var coin = {
			x: position.x,
			y: position.y,
			width: 32,
			height: 32,
			isCollected: false
		};
		
		coin.sprite = new Sprite(2048, 32, 64, 2, story.sprites[27], coin, this.gameContext);
		
		return coin;
	},
	
	// =========================== COLLISION DETECTION METHOD ============================== //
	
	detectCollision: function(){
		var collision = {
				top: false,
				bottom: false,
				left: false,
				right: false
		},
			char = this.mainCharacter,						// main character
			charBox = this.mainCharacterBoundingRect,		// main character bounding rect
			activeBlocks = this.characterLocation(),		// determine 'active' blocks
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
				layout = this.currentLevel.layout,
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
			
			if(temp.col != 0 && temp.col < layout[0].length - 1) upperRight = layout[temp.row - 1][temp.col + 1];
			
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
	    
	    if (maxX > rect.x + rect.width)
	        maxX = rect.x + rect.width;
	    
	    if (minX < rect.x)
	        minX = rect.x;
	    
	    if (minX > maxX)
	        return false;
	    
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
	    
	    if (maxY > rect.y + rect.height)
	        maxY = rect.y + rect.height;
	    
	    if (minY < rect.y)
	        minY = rect.y;
	    
	    if (minY > maxY)
	        return false;
	    
	    return true;
	},

	// ===== UPDATE CHARACTER LOCATION ========== //
	
	updateCharacter: function(){
		var collision = this.detectCollision();
		var char = this.mainCharacter,
			charBox = this.mainCharacterBoundingRect;

		//this.gameContext.fillRect(this.mainCharacterBoundingRect.x, this.mainCharacterBoundingRect.y, this.mainCharacterBoundingRect.width, this.mainCharacterBoundingRect.height);
		if (char.isCaught){
			char.x = this.startingBlock.x;
			charBox.x = this.startingBlock.x + 6;
			char.y = this.startingBlock.y;
			charBox.y = this.startingBlock.y + 28;
			char.isCaught = false;
			
			this.resetCoins();
		}

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
	
	// ======== CHECK IF OVERLAPPING METHOD =========== //
	
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
	
	// ============ EVENT HANDLERS ============ //
	
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