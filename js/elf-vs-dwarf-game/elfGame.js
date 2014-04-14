

RadoGame = Game.extend({
	init: function(){
		var game = this,
			mainLoop = null;

		this.levels = [];            //array of levels
		this.levelIndex = 0;
		this.currentLevel = null;	//current level
		this.passableBlocks = [];	//array of all passable blocks
		this.impassableBlocks = [];	//array of all impassable blocks
		this.finishBlocks = [];		//array of all finish blocks
		this.startingBlock = null;	//the hero starting point
		
		this.plot = $("#elf-game");
		this.canvas = $('#elf-game-canvas')[0];	
		this.gameContext = $('#elf-game-canvas')[0].getContext('2d');
		this.mainCharacter = {};
		
		// -- MAIN LOOP -- //
		
		this.mainLoop = function(){
			game.gameContext.save();
			game.gameContext.clearRect(0, 0, canvas.width, canvas.height);
			game.drawLevel();
			game.updateCharacter();
			game.checkLevelProgress();
			game.gameContext.restore();
		};
	},
	
	// ===== START METHOD ====== //
	start: function(){
		this.getContext();
		this.addGameToPlot();
		this.createLevels();
		this.currentLevel = this.levels[this.levelIndex];
		this.populateLevel(this.currentLevel);
		this.createMainCharacter(this.startingBlock.x, this.startingBlock.y);
		this.addEventListeners();
		mainLoop = setInterval(this.mainLoop, 30);
	},
	
	startNewLevel: function(){
		this.passableBlocks = [];
		this.impassableBlocks = [];
		this.finishBlocks = [];
		this.startingBlock = null;
		this.populateLevel(this.currentLevel);
		this.createMainCharacter(this.startingBlock.x, this.startingBlock.y);
	},
	
	gameOver: function(){
		clearInterval(myLoop);
		this.removeGameFromPlot();
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
	
	createLevel: function(number, layout){
		var level = {
				layout: layout,
				number: number,
				isFinished: false
		};
		return level;
	},
	
	// ======= CREATING THE LEVELS ======== //
	
	createLevels: function(){
		this.levels.push(this.createLevel(
				1,
				[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],		// 0 - impassable,
                 [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],		// 1 - passable,
                 [3, 1, 1, 1, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],		// 2 - finish,
                 [0, 1, 1, 1, 0, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0],		// 3 - starting 
                 [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]]
				)
		);
		
		this.levels.push(this.createLevel(
				2,
				[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                 [3, 1, 1, 1, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 0, 2, 2, 0, 0],
                 [0, 1, 1, 1, 0, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 0, 1, 2, 0, 0],
                 [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0],
                 [0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]]
                 )
		);
		
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
	
	// ====== DRAWING THE LEVEL (TEST) ===== //
	
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
	
	// ====== MAIN CHARACTER CONSTRUCTOR ===== //
	
	createMainCharacter: function(x, y){
		this.mainCharacter = {
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
				if(this.areOverlapping(charBox, upperRight)){
					if(len == 3){
						offsetX = (charBox.x + charBox.width) - upperRight.x;
						offsetY = (upperRight.y + upperRight.height) - charBox.y;
						
						if(offsetX > offsetY){
							char.y += offsetY + char.speed;
							charBox.y += offsetY + char.speed;
							break;
						}
						if(offsetY > offsetX){
							char.x -= offsetX;
							charBox.x -= offsetX;
							break;
						}
						if(offsetY == offsetX){
							char.y -= offsetY;
							charBox.y -= offsetY;
							break;
						}
					}
				}
			}
			
			if(lowerLeft && lowerLeft.type == 0){
				if(this.areOverlapping(charBox, lowerLeft)){
					if(len == 3){
						offsetX = (lowerLeft.x + lowerLeft.width) - charBox.x;
						offsetY = (charBox.y + charBox.height) - lowerLeft.y;
						
						console.log("X: " + offsetX + " Y: " + offsetY);						
						if(offsetX > offsetY){
							char.y -= offsetY;
							charBox.y -= offsetY;
							break;
						}
						if(offsetY > offsetX){
							char.x += offsetX + char.speed;
							charBox.x += offsetX + char.speed;
							break;
						}
						if(offsetX == offsetY){
							char.x += offsetX + char.speed;
							charBox.x += offsetX + char.speed;
							break;
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
							char.x -= offsetX + char.speed;
							charBox.x -= offsetX + char.speed;
							break;
						}
						if(offsetX == offsetY){
							char.x -= offsetX + char.speed;
							charBox.x -= offsetX + char.speed;
							break;
						}
					}
				}
			}		
		}
		
		return collision;
	},

	// ===== UPDATE CHARACTER LOCATION ========== //
	
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
	
	areOverlapping: function(obj1, obj2){
		if(((obj1.x > obj2.x && obj1.x < obj2.x + obj2.width) || (obj1.x + obj1.width > obj2.x && obj1.x + obj1.width < obj2.x + obj2.width)) && 
				((obj1.y > obj2.y && obj1.y < obj2.y + obj2.height) || (obj1.y + obj1.height > obj2.y && obj1.y + obj1.height < obj2.y + obj2.height))){
			return true;
		}
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

	}
});
