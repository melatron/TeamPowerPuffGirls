

//Story = Class.extend({
//
//    init: function () {
//        var self = this;
//        this.interactableObjects = [];
//        this.stopEvents = false;
//        this.inGame = false;
//
//        this.canvas = $("#canvas")[0];
//        this.ctx = this.canvas.getContext('2d');
//
//        this.storyFinished = false;
//        this.hero = new Hero(0, 256, 32, 32, "hero");
//        this.elder = null;
//        this.dragon = null;
//        this.elf = null;
//        this.bandit = null;
//        this.orc = null;
//        
//        
//        this.gamesFinished = 0;
//        this.gamesAmount = 6;
//        this.buttons = [];
//        var toggleMusic = new ButtonsObject(0, 0, 40, 40, "ToggleMusic"),
//            finishGame = new ButtonsObject(984, 0, 40, 40, "FinishGame");
//        this.buttons.push(toggleMusic);
//        this.buttons.push(finishGame);
//        this.endStoryScreenOn = false;
//
//        
//        //
//        this.movableObjects = [];
//        this.staticSpriteObjects = [];
//        this.mainCanvas = document.getElementById("canvas");
//        
//        // Hero have is not yet implemented!
//        
//
//        this.soundTrack = null;
//
//        this.animation = null;
//
//        this.mousePos = {};
//
//        this.mainLoop = function () {
//            self.ctx.save();
//            self.ctx.clearRect(0, 0, canvas.width, canvas.height);
//            self.elder.setRandomDestination();
//            self.dragon.setRandomDestination();
//            self.elf.setRandomDestination();
//            self.bandit.setRandomDestination();
//            self.orc.setRandomDestination();
//            self.hero.moveHeroToDestination();
//            self.drawInteractableObject();
//            self.checkIfSpeaking();
//            self.initializeCurrentQuest();
//            //self.hero.drawSpeechBubble();
//            self.soundTrack.startNextSong();
//            self.startGameAfterConversation();
//            self.checkIfGamePlayed();
//            self.checkIfFocused();
//            self.ctx.restore();
//            self.animation = requestAnimationFrame(self.mainLoop);
//            if (self.endStoryScreenOn) {
//                self.endStoryScreen();
//            }
//        };
//
//        this.inventory = new Inventory();
//    },
//    loadMovableObjects: function () {
//        
//
//        this.elder = new AIMovableObject(790, 200, 32, 32, "theMage", this.interactableObjects[3], {
//            x: 820,
//            y: 200
//        }, {
//            xMin: 780,
//            xMax: 820,
//            yMin: 200,
//            yMax: 240
//        });
//        this.dragon = new AIMovableObject(730, 330, 96, 96, "dragon", this.interactableObjects[4], {
//            x: 780,
//            y: 300
//        }, {
//            xMin: 680,
//            xMax: 810,
//            yMin: 260,
//            yMax: 330
//        });
//        this.elf = new AIMovableObject(210, 300, 32, 32, "elf", this.interactableObjects[2], {
//            x: 210,
//            y: 300
//        }, {
//            xMin: 200,
//            xMax: 220,
//            yMin: 300,
//            yMax: 340
//        });
//        this.bandit = new AIMovableObject(400, 400, 32, 32, 'bandit', this.interactableObjects[5], {
//            x: 400,
//            y: 400
//        }, {
//            xMin: 390,
//            xMax: 410,
//            yMin: 390,
//            yMax: 410
//        });
//        this.orc = new AIMovableObject(370, 80, 32, 32, 'orc', this.interactableObjects[6], {
//            x: 370,
//            y: 75
//        }, {
//            xMin: 360,
//            xMax: 410,
//            yMin: 75,
//            yMax: 100
//        });
//    },
//    addCheckPoints: function () {
//       var  elfGame = new RadoGame(),
//            digitGame = new TonyGame(),
//            squareGame = new SquareGame(),
//            swapPuzzle = new SwapPuzzle(),
//            pathFinder = new PathFinder(),
//            eightPuzzle = new EightPuzzle();
//        var humanCastle = new ClickPoint(106, -13, 150, 140, "humanCastle",
//        													{
//        													    x: 175,
//        													    y: 150
//        													},
//            squareGame,
//            {                  // HERO SPEECH
//                before: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ],
//                after: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ],
//                done: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ]
//            },
//            {                  //QUEST SPEECH
//                before: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ],
//                after: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ],
//                done: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ]
//            }
//        	),
//            dwarfCamp = new ClickPoint(740, -5, 130, 130, "dwarfCamp",
//            												{
//            												    x: 655,
//            												    y: 130
//            												}, digitGame,
//            {                  // HERO SPEECH
//                before: " ",
//                after: " ",
//                done: " "
//            },
//            {                  //QUEST SPEECH
//                before: " ",
//                after: " ",
//                done: " "
//            }
//            ),
//            treeOfLife = new ClickPoint(83, 372, 100, 100, "treeOfLife", {
//                x: 175,
//                y: 350
//            },
//            elfGame,
//            {                  // HERO SPEECH
//                before: " ",
//                after: " ",
//                done: " "
//            },
//            {                  //QUEST SPEECH
//                before: " ",
//                after: " ",
//                done: " "
//            }
//
//            ),
//            mage = new ClickPoint(800, 200, 50, 50, 'mage',
//            												{
//            												    x: 810,
//            												    y: 250
//            												}, swapPuzzle,
//            {                  // HERO SPEECH
//                before: " ",
//                after: " ",
//                done: " "
//            },
//            {                  //QUEST SPEECH
//                before: " ",
//                after: " ",
//                done: " "
//            }
//            ),
//            dragon = new ClickPoint(675, 300, 200, 200, 'dragon',
//                                                            {
//                                                                x: 660,
//                                                                y: 345
//                                                            }, null,
//             {                  // HERO SPEECH
//                 before: " ",
//                 after: " ",
//                 done: " "
//             },
//            {                  //QUEST SPEECH
//                before: " ",
//                after: " ",
//                done: " "
//            }
//
//            ),
//            bandit = new ClickPoint(451, 310, 100, 150, 'banditTavern',
//            												{
//            												    x: 430,
//            												    y: 355
//            												}, pathFinder,
//             {                  // HERO SPEECH
//                 before: " ",
//                 after: " ",
//                 done: " "
//             },
//            {                  //QUEST SPEECH
//                before: " ",
//                after: " ",
//                done: " "
//            }
//            ),
//            orcCamp = new ClickPoint(440, 22, 100, 100, 'orcCamp',
//            												{
//            												    x: 430,
//            												    y: 140
//            												}, eightPuzzle,
//                 {                  // HERO SPEECH
//                     before: " ",
//                     after: " ",
//                     done: " "
//                 },
//                {                  //QUEST SPEECH
//                    before: " ",
//                    after: " ",
//                    done: " "
//                }
//            );
//        this.interactableObjects.push(humanCastle);
//        this.interactableObjects.push(dwarfCamp);
//        this.interactableObjects.push(treeOfLife);
//        this.interactableObjects.push(mage);
//        this.interactableObjects.push(dragon);
//        this.interactableObjects.push(bandit);
//        this.interactableObjects.push(orcCamp);
//    },
//    // ---- Methods for preloading images ---- //
//    addEvents: function () {
//        this.stopEvents = false;
//        $('#canvas').on('click', this, this.clickEvent);
//        $(document).on('keyup', this, this.handleKeyPressed);
//        $(document).on('mousemove', this, this.onMouseMove);
//    },
//    handleKeyPressed: function (ev) {
//        if (!ev.data.stopEvents) {
//            ev.preventDefault();
//            switch (ev.keyCode) {
//                case 13:
//                    //console.log(ev);
//                    if (ev.type == 'keyup') {
//                        ev.data.changeSpeaker();
//                    }
//                    break;
//
//            }
//        }
//    },
//    clickEvent: function (ev) {
//        if (!ev.data.stopEvents) {
//            //console.log('rado is a gay persona');
//            var rect = ev.data.mainCanvas.getBoundingClientRect(),
//                    mouseX = ev.clientX - rect.left,
//                    mouseY = ev.clientY - rect.top,
//                    currentObject;
//
//            console.log("Mouse X: " + mouseX + " Mouse Y: " + mouseY);
//
//            for (var i = 0; i < ev.data.interactableObjects.length; i++) {  // check if clicked
//                currentObject = ev.data.interactableObjects[i];
//                if (currentObject.checkIfClicked(mouseX, mouseY) && currentObject.isAvailable) {
//                    ev.data.hero.prepareObjectForSpeaking(currentObject);
//                    currentObject.prepareObjectForSpeaking("");
//                    for (var j = 0; j < ev.data.interactableObjects.length; j++) {
//                        ev.data.interactableObjects[j].isInteracting = false;           // set all other click points to "inactive"
//                    }
//                }
//            }
//            ev.data.pauseMusicButton(mouseX, mouseY);
//        }
//        // here we will add events for the buttons that will apear when the end game screen is on !
//        if (ev.data.endStoryScreenOn && ev.data.stopEvents) {
//            ev.data.endStoryButton(mouseX, mouseY);
//            ev.data.continueStoryButton(mouseX, mouseY);
//        }
//    },
//    // Here is the functionallity of the buttons:
//    pauseMusicButton: function (x, y) {
//        if (this.buttons[0].checkIfClicked(x, y)) {
//            if (this.buttons[0].toggled) {
//                this.soundTrack.pauseMainMusic();
//            }
//            else {
//                this.soundTrack.resumeMainMusic();
//            }
//        }
//    },
//    endStoryScreenButton: function (x, y) {
//        if (this.buttons[1].checkIfClicked(x, y)) {
//            if (this.storyEnded) {
//                this.endStoryScreen();
//            }
//        }
//    },
//    endStoryButton: function () {
//        if (this.buttons[2].checkIfClicked(x, y)) {
//            this.endStory();
//        }
//    },
//    continueStoryButton: function () {
//        if (this.buttons[3].checkIfClicked(x, y)) {
//            this.endStoryScreenOn = false;
//            this.stopEvents = false;
//        }
//    },
//
//    onMouseMove: function (e) {
//        if (!e.data.stopEvents) {
//            var rect = e.data.mainCanvas.getBoundingClientRect();
//            e.data.mousePos.x = e.clientX - rect.left;
//            e.data.mousePos.y = e.clientY - rect.top;
//        }
//    },
//
//    checkIfFocused: function(){
//        var i, temp, len = this.interactableObjects.length;
//        for(i = 0; i < len; i++){
//            temp = this.interactableObjects[i];
//            if((this.mousePos.x > temp.x && this.mousePos.x < temp.x + temp.width) && 
//                (this.mousePos.y > temp.y && this.mousePos.y < temp.y + temp.height))
//            {
//                if(this.stopEvents == false && temp.isAvailable){
//                    if(temp.spriteGlow){
//                        temp.spriteGlow.drawSprite();
//                    }
//                }
//            }
//            else if(temp.spriteGlow){ 
//                temp.spriteGlow.frameCounter = 6;
//            }
//        }
//    },
//    initializeCurrentQuest: function () {
//        if (this.gamesFinished == 0) {
//             this.interactableObjects[this.gamesFinished].spriteGlow.drawSprite();
//        }
//        else if (this.interactableObjects[this.gamesFinished - 1].progress.done) {
//             this.interactableObjects[this.gamesFinished].spriteGlow.drawSprite();
//        }
//    },
//
//
// 
//	checkIfSpeaking: function () {
//	    for (var i = 0; i < this.interactableObjects.length; i++) {
//	        if (this.interactableObjects[i].isInteracting) {
//	            if (this.interactableObjects[i].isSpeaking && !(this.interactableObjects[i].speech.conversetionEnded)) {
//	                this.blackenScreen();
//	                this.hero.portrait.drawPortrait();
//	                this.interactableObjects[i].portrait.drawPortrait();
//	                this.interactableObjects[i].drawSpeechBubble();
//	            }
//	            else if (this.hero.isSpeaking && !(this.hero.speech.conversetionEnded)) {
//	                this.blackenScreen();
//	                this.hero.drawSpeechBubble();
//	                this.hero.portrait.drawPortrait();
//	                this.interactableObjects[i].portrait.drawPortrait();
//	            }
//	        }
//	    }
//	},
//	blackenScreen: function () {
//	    this.ctx.save();
//	    this.ctx.globalAlpha = 0.7;
//	    this.ctx.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
//	    this.ctx.restore();
//	},
//	changeSpeaker: function () {
//	    if (this.hero.speakingTo != null && this.hero.speakingTo.isInteracting) {
//	        //console.log(this.hero.speech.conversetionEnded + " " + this.hero.speakingTo.speech.conversetionEnded + " " + this.hero.isSpeaking);
//	        if (this.hero.isSpeaking && !this.hero.speech.conversetionEnded) {
//	            this.hero.isSpeaking = false;
//	            this.hero.speakingTo.isSpeaking = true;
//	            this.hero.speech.counter += 1;
//
//	            if (this.hero.speech.counter == this.hero.speech.textArray.length) {
//	                this.hero.speech.conversetionEnded = true;
//	            }
//	        }
//	        else if (this.hero.speakingTo.isSpeaking && !this.hero.speakingTo.speech.conversetionEnded) {
//	            this.hero.speakingTo.isSpeaking = false;
//	            this.hero.isSpeaking = true;
//	            this.hero.speakingTo.speech.counter += 1;
//
//	            if (this.hero.speakingTo.speech.counter == this.hero.speakingTo.speech.textArray.length) {
//	                this.hero.speakingTo.speech.conversetionEnded = true;
//	            }
//	        }
//	        else {
//	            if (this.hero.speakingTo.isSpeaking) {
//	                this.hero.isSpeaking = true;
//	                this.hero.speakingTo.isSpeaking = false;
//	            }
//	            else {
//	                this.hero.speakingTo.isSpeaking = true;
//	                this.hero.isSpeaking = false;
//	            }
//	        }
//	    }
//	},
//    /* This is the method that checks if the game is finished and starts the after game conversations.
//       Also here we will add the end game logic which will darken the screen and asks you if you want to continue
//       or you want to end the game! */
//	checkIfGamePlayed: function () {
//	    if (this.hero.speakingTo && this.hero.speakingTo != null && this.hero.speakingTo.game) {
//	        if (this.hero.speakingTo.game.gameOver && this.hero.speakingTo.speech.conversetionEnded && this.hero.speech.conversetionEnded) {
//	            this.stopEvents = false;
//	                this.inGame = false;
//	                this.hero.speakingTo.game.gameOver = false;
//	            /*Here we will add the points from the finished game into the click point in which the game is.*/
//	            if(this.hero.speakingTo.score == 0) {
//	                this.gamesFinished++;
//	                if (this.gamesFinished == this.gamesAmount) {
//	                    this.storyEnded = true;
//	                    this.endStoryScreenOn = true;
//	                    this.stopEvents = true;
//	                }
//	            }
//	            if(this.hero.speakingTo.score < this.hero.speakingTo.game.score) {
//	              this.hero.speakingTo.score = this.hero.speakingTo.game.score;
//	            }
//	            if (this.hero.speakingTo.progress.after) {
//	                for (var i = 0; i < this.interactableObjects.length-1; i++){
//	                    if (this.interactableObjects[i] == this.hero.speakingTo) {
//	                        this.interactableObjects[i + 1].isAvailable = true;
//	                        break;
//	                    }
//	                }
//	                this.hero.prepareObjectForSpeaking(this.hero.speakingTo);
//	                this.hero.speakingTo.prepareObjectForSpeaking("");
//	            }
//	            else {
//	                this.hero.speakingTo = null;
//	            }
//	        }
//	    }
//	},
//	startGameAfterConversation: function(){
//	    if (this.hero.speakingTo != null && this.hero.speech.conversetionEnded && this.hero.speakingTo.speech.conversetionEnded && !this.inGame) {
//            
//	        if (this.hero.speakingTo.progress.before) { 
//	            this.inGame = true;
//	            this.hero.speakingTo.isSpeaking = false;
//	            this.hero.isSpeaking = false;
//	            this.hero.speakingTo.progress.before = false;
//	            this.hero.speakingTo.progress.after = true;
//
//	            if (this.hero.speakingTo.game) {
//	                //console.log('asdaskdalsdkalskdlaskdlakdlaskdlaksdlakdlaskdlakdlasdkalsdkaldkadkal');
//	                this.stopEvents = true;
//	                this.hero.speakingTo.startGame();
//	            }
//	        }
//	        else if (this.hero.speakingTo.progress.after) {
//	            this.hero.speakingTo.progress.after = false;
//	            this.hero.speakingTo.progress.done = true;
//	            this.hero.speakingTo = null;
//	            this.stopEvents = false;
//	        }
//	        else if (this.hero.speakingTo.progress.done) {
//	            this.inGame = true;
//	            this.hero.speakingTo.isSpeaking = false;
//	            this.hero.isSpeaking = false;
//
//	            if (this.hero.speakingTo.game) {
//	                this.stopEvents = true;
//	                this.hero.speakingTo.startGame();
//	            }
//	        }
//	    }
//	},
//    // here is the method which will draw the end game screen!
//	endStoryScreen: function () {
//	    if (this.endStoryScreenOn) {
//	        this.blackenScreen();
//	        this.buttons[2].drawButton();
//	        this.buttons[3].drawButton();
//	    }   
//	},
//	calculateFinalScore: function () {
//	    var array = this.interactableObjects,
//            finalScore = 0;
//	    for (var i = 0; i < array.length; i++) {
//	        finalScore += array[i].score;
//	    }
//	    return finalScore;
//	},
//    // here is the mehtod which will end the this if you have finished all 7 games and you have clicked finish button
//	endStory: function () {
//    
//	},
//    addInteractableObject: function (iObject) {
//        this.interactableObjects.push(iObject);
//    },
//    addMovableObjects: function (mObject) {
//        this.movableObjects.push(mObject);
//    },
//    addStaticSpriteObjects: function (sObject) {
//        this.staticSpriteObjects.push(sObject);
//    },
//    searchInteractableObjectByName: function (name) {
//        var array = this.interactableObjects;
//        for (var i = 0; i < array.length; i++) {
//            if (array[i].name == name) {
//                return array[i];
//            }
//        }
//    },
//    searchMovableObjectsByName: function (name) {
//        var array = this.MovableObjects;
//        for (var i = 0; i < array.length; i++) {
//            if (array[i].name == name) {
//                return array[i];
//            }
//        }
//    },
//    drawInteractableObject: function () {
//        for (var i = 0, len = this.interactableObjects.length; i < len; i++) {
//            this.interactableObjects[i].drawObj();
//        }
//    },
//    preloadSprites: function () {
//
//        this.hero.spriteUp = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(0), this.hero, this.ctx);  // create Sprites
//        this.hero.spriteDown = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(1), this.hero, this.ctx);
//        this.hero.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(2), this.hero, this.ctx);
//        this.hero.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(3), this.hero, this.ctx);
//        this.hero.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(1), this.hero, this.ctx);
//
//        this.elder.spriteUp = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(4), this.elder, this.ctx);
//        this.elder.spriteDown = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(5), this.elder, this.ctx);
//        this.elder.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(6), this.elder, this.ctx);
//        this.elder.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(7), this.elder, this.ctx);
//        this.elder.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(5), this.elder, this.ctx);
//
//        this.dragon.spriteUp = new Sprite(384, 96, 4, 10, preloader.getSpriteByIndex(8), this.dragon, this.ctx);
//        this.dragon.spriteDown = new Sprite(384, 96, 4, 10, preloader.getSpriteByIndex(9), this.dragon, this.ctx);
//        this.dragon.spriteLeft = new Sprite(384, 96, 4, 10, preloader.getSpriteByIndex(10), this.dragon, this.ctx);
//        this.dragon.spriteRight = new Sprite(384, 96, 4, 10, preloader.getSpriteByIndex(11), this.dragon, this.ctx);
//        this.dragon.spriteIdle = new Sprite(96, 96, 1, 10, preloader.getSpriteByIndex(9), this.dragon, this.ctx);
//        this.dragon.getDestinationDelay = 500;
//
//        this.elf.spriteUp = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(12), this.elf, this.ctx);
//        this.elf.spriteDown = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(13), this.elf, this.ctx);
//        this.elf.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(14), this.elf, this.ctx);
//        this.elf.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(15), this.elf, this.ctx);
//        this.elf.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(13), this.elf, this.ctx);
//        this.elf.getDestinationDelay = 300;
//
//        this.bandit.spriteUp = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(16), this.bandit, this.ctx);
//        this.bandit.spriteDown = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(17), this.bandit, this.ctx);
//        this.bandit.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(18), this.bandit, this.ctx);
//        this.bandit.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(19), this.bandit, this.ctx);
//        this.bandit.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(17), this.bandit, this.ctx);
//        this.bandit.getDestinationDelay = 160;
//
//        this.orc.spriteUp = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(20), this.orc, this.ctx);
//        this.orc.spriteDown = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(21), this.orc, this.ctx);
//        this.orc.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(22), this.orc, this.ctx);
//        this.orc.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(23), this.orc, this.ctx);
//        this.orc.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(21), this.orc, this.ctx);
//        this.orc.getDestinationDelay = 248;
//
//        this.interactableObjects[0].spriteGlow = new Sprite(1700, 140, 10, 4, preloader.getSpriteByIndex(33), this.interactableObjects[0], this.ctx);
//        this.interactableObjects[1].spriteGlow = new Sprite(1200, 100, 10, 4, preloader.getSpriteByIndex(34), this.interactableObjects[1], this.ctx);
//        this.interactableObjects[2].spriteGlow = new Sprite(850, 100, 10, 4, preloader.getSpriteByIndex(35), this.interactableObjects[2], this.ctx);
//        this.interactableObjects[3].spriteGlow = new Sprite(960, 40, 24, 2, preloader.getSpriteByIndex(36), this.interactableObjects[3], this.ctx);
//        this.interactableObjects[4].spriteGlow = new Sprite(960, 40, 24, 2, preloader.getSpriteByIndex(37), this.interactableObjects[4], this.ctx);
//        this.interactableObjects[5].spriteGlow = new Sprite(900, 135, 10, 4, preloader.getSpriteByIndex(38), this.interactableObjects[5], this.ctx);
//        this.interactableObjects[6].spriteGlow = new Sprite(800, 100, 10, 4, preloader.getSpriteByIndex(39), this.interactableObjects[6], this.ctx);
//    },
//
//    // ==== Portrait preloader ==== //
//
//    preloadPortraits: function () {
//      
//
//        this.hero.setImage(preloader.getPortraitByIndex(0));
//        this.interactableObjects[3].setImage(preloader.getPortraitByIndex(1));
//        this.interactableObjects[2].setImage(preloader.getPortraitByIndex(2));
//        this.interactableObjects[1].setImage(preloader.getPortraitByIndex(3));
//        this.interactableObjects[0].setImage(preloader.getPortraitByIndex(4));
//        this.interactableObjects[5].setImage(preloader.getPortraitByIndex(5));
//        this.interactableObjects[4].setImage(preloader.getPortraitByIndex(6));
//        this.interactableObjects[6].setImage(preloader.getPortraitByIndex(7));
//
//    },
//    checkRequestAnimationFrame: function(){
//        if (!window.requestAnimationFrame) {
//
//            window.requestAnimationFrame = (function() {
//
//            return window.webkitRequestAnimationFrame ||
//            window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
//            window.oRequestAnimationFrame ||
//            window.msRequestAnimationFrame ||
//            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
//
//                window.setTimeout(callback, 1000 / 60);
//
//                };
//
//            })();
//
//        }
//    },
//    
//    preloadEverything: function () {
//        preloader.preloadEverything();
//        this.addCheckPoints();
//        this.loadMovableObjects();
//        this.soundTrack = new PlayList();
//        this.soundTrack.startMainMusic();
//        this.preloadSprites();
//        this.preloadPortraits();
//
//        
//        this.checkRequestAnimationFrame();
//
//        /* all quests are available */
//        this.interactableObjects[0].isAvailable = true;
//        var len = this.interactableObjects.length;
//        for (var i = 0; i < len; i++) {
//            this.interactableObjects[i].isAvailable = true;
//        };
//        
//        this.addEvents();
//        this.mainLoop();
//    }
//
//});
//
////  Everything after this paragraph has to be moved to the this class.
//
//$(window).load(function () {
//    menu = new Menu();
//
//    menu.initializeMenu();
//});



function Story() {
    var self = this,
        interactableObjects = [],
        stopEvents = false,
        inGame = false,
        initializeCurrentQuestCounter = 0,

        canvas = $("#canvas")[0],
        ctx = canvas.getContext('2d'),
       
        storyFinished = false,
        hero = new Hero(0, 256, 32, 32, "hero"),
        elder = null,
        dragon = null,
        elf = null,
        bandit = null,
        orc = null,
       
       
        gamesFinished = 0,
        gamesAmount = 6,
        buttons = [],
        finishGameSprite = null;
    

    var endStoryScreenOn = false,
        storyEnded = false,
        movableObjects = [],
        staticSpriteObjects = [],
        mainCanvas = $("#canvas")[0],

    // Hero have is not yet implemented!


        soundTrack = null,

        animation = null,

        mousePos = {},

        mainLoop = function () {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            elder.setRandomDestination();
            dragon.setRandomDestination();
            elf.setRandomDestination();
            bandit.setRandomDestination();
            orc.setRandomDestination();
            hero.moveHeroToDestination();
            //drawInteractableObject();
            checkIfSpeaking();
            initializeCurrentQuest();
            //hero.drawSpeechBubble();
            soundTrack.startNextSong();
            startGameAfterConversation();
            checkIfGamePlayed();
            checkIfFocused();
            drawButtons();
            ctx.restore();
            animation = requestAnimationFrame(mainLoop);
            if (storyEnded) {
                drawEndScreen();
            };
           
            
    };

    var inventory = new Inventory();
    inventory.getItem('sword');
    inventory.getItem('ring');
    inventory.getItem('boots');


    function loadMovableObjects() {


        elder = new AIMovableObject(790, 200, 32, 32, "mage", searchInteractableObjectByName("mage"), {
            x: 820,
            y: 200
        }, {
            xMin: 780,
            xMax: 820,
            yMin: 200,
            yMax: 240
        });
        dragon = new AIMovableObject(730, 330, 96, 96, "dragon", searchInteractableObjectByName("dragon"), {
            x: 780,
            y: 300
        }, {
            xMin: 680,
            xMax: 810,
            yMin: 260,
            yMax: 330
        });
        elf = new AIMovableObject(210, 300, 32, 32, "treeOfLife", searchInteractableObjectByName("treeOfLife"), {
            x: 210,
            y: 300
        }, {
            xMin: 200,
            xMax: 220,
            yMin: 300,
            yMax: 340
        });
        bandit = new AIMovableObject(400, 400, 32, 32, 'banditTavern', searchInteractableObjectByName("banditTavern"), {
            x: 400,
            y: 400
        }, {
            xMin: 390,
            xMax: 410,
            yMin: 390,
            yMax: 410
        });
        orc = new AIMovableObject(370, 80, 32, 32, 'orcCamp', searchInteractableObjectByName("orcCamp"), {
            x: 370,
            y: 75
        }, {
            xMin: 360,
            xMax: 410,
            yMin: 75,
            yMax: 100
        });
    };
    function addCheckPoints() {
        var elfGame = new RadoGame(),
             digitGame = new TonyGame(),
             squareGame = new SquareGame(),
             swapPuzzle = new SwapPuzzle(),
             pathFinder = new PathFinder(),
             eightPuzzle = new EightPuzzle();
        /*
        You: Ah, my lord! (Stuttering voice) "bows"
King: Rise and spare me the pleasantries, i am in no mood for your groveling.
You: Yes of course, my liege.
King: Would you be so kind as to explain what you are doing in the royal chambers at this time of day/night?
You: I was merely telling some war stories with the royal guard sir, they were quite anxious to hear of my recent exploits. 
King: You wouldn't have happened to have heard some rather disturbingly loud moaning sounds while you were walking around the chambers, did you?
You: No, haven't heard anything on this side of the chambers.
King: I didn't mention that they were coming from this side "Insert name here". 
You: Well sire, this is the only part of the chambers i have any pleasure in visiting. "His look accidentally wanders at the queen's dormitory"
King: Don't you get tired of visiting the same rooms over and over? "said the king with a spiteful tone"
You: Oh, there's nothing tiresome about it your highness.
King: Why you insolent wench!!GUARDS!! Take this arrogant sard to the dungeons, i shall be there as soon as i figure a proper form of punishment!
        */
        var humanCastle = new ClickPoint(106, -13, 150, 140, "humanCastle",
                                                            {
                                                                x: 175,
                                                                y: 150
                                                            },
            squareGame,
            {                  // HERO SPEECH
                before: [['Ah, my lord!', '(Stuttering voice) *bows*'], ['Yes of course, my liege.'], 
                    ['I was merely telling some','war stories with the', 'royal guard sir, ','they were quite anxious to', 'hear of my recent exploits. '],
                ['No, havent heard anything', ' on this side of the chambers.'],
                ['Well sire, this', 'is the only part', ' of the chambers i have', 'any pleasure in visiting.', ' "His look accidentally wanders', 'at the queens dormitory"'],
                ['Oh, theres nothing tiresome', ' about it your highness.']],
                after: [''],
                done: ['']
            },
            {                  //QUEST SPEECH
                before: [['...'], ['Rise and spare me the',' pleasantries, i am in no mood', ' for your groveling.'],
                    ['Would you be so kind', 'as to explain',' what you are doing', 'in the royal chambers',' at this time of day?'],
                ['You wouldnt have', 'happened to have heard', 'some rather disturbingly', ' loud moaning sounds', ' while you were walking', 'around the chambers,','did you?'],
                ['I didnt mention that they', ' were coming from this', ' side "Insert name here".'],
                ['Dont you get tired', 'of visiting the same', 'rooms over and over?', ' "said the king with', 'a spiteful tone"'],
                ['Why you insolent wench!', 'GUARDS!! Take this arrogant', 'sard to the dungeons, i shall', ' be there as soon as i figure', ' a proper form of', 'punishment!']],
                after: [''],
                done: ['']
            },
            {
                x: 192,
                y: 62,
                r: 58,
            }
            ),
            dwarfCamp = new ClickPoint(740, -5, 130, 130, "dwarfCamp",
                                                            {
                                                                x: 655,
                                                                y: 130
                                                            }, eightPuzzle,
            {                  // HERO SPEECH
                before: " ",
                after: " ",
                done: " "
            },
            {                  //QUEST SPEECH
                before: " ",
                after: " ",
                done: " "
            },
            {
                x: 798,
                y: 45,
                r: 47,
            }
            ),
            treeOfLife = new ClickPoint(83, 372, 100, 100, "treeOfLife", {
                x: 175,
                y: 350
            },
            elfGame,
            {                  // HERO SPEECH
                before: [['What!?', 'Who!?'], ["I'll just go ahead and chop off", "a piece of that little", "fruit tree over there"], ["Just a little bit!", "You won't even notice it ..."], ["If you catch me!"]],
                after: [["Thanks for the", "tinder, greenies!", "Hahahaha!"]],
                done: [["Uh oh .."]]
            },
            {                  //QUEST SPEECH
                before: [['Halt!!', 'Who dares to enter', 'the sacred forest of Nazareth, ', 'son of Nazgul Almighty!'], ['Go away!', 'Outsiders are NOT', 'welcome here!'], ["Excuse me?", "That's the tree of life!", "It's our sacred heritage"], ["If you as much as", "breathe on that tree,", "WE WILL ANIHILATE YOU!!!"]],
                after: [["After him!", "AFTER HIM, YOU FOOLS!"]],
                done: [["You again!?", "GET HIM!!"]]
            },
            {
                x: 120,
                y: 425,
                r: 40,
            }

            ),
            mage = new ClickPoint(800, 200, 50, 50, 'mage',
                                                            {
                                                                x: 810,
                                                                y: 250
                                                            }, digitGame,
            {                  // HERO SPEECH
                before: " ",
                after: " ",
                done: " "
            },
            {                  //QUEST SPEECH
                before: " ",
                after: " ",
                done: " "
            },
            {
                x: 810,
                y: 225,
                r: 35,
            }
            ),
            dragon = new ClickPoint(644, 413, 200, 200, 'dragon',
                                                            {
                                                                x: 660,
                                                                y: 345
                                                            }, null,
             {                  // HERO SPEECH
                 before: " ",
                 after: " ",
                 done: " "
             },
            {                  //QUEST SPEECH
                before: " ",
                after: " ",
                done: " "
            },
            {
                x: 772,
                y: 530,
                r: 110,
            }

            ),
            bandit = new ClickPoint(451, 310, 100, 150, 'banditTavern',
                                                            {
                                                                x: 430,
                                                                y: 355
                                                            }, pathFinder,
             {                  // HERO SPEECH
                 before: " ",
                 after: " ",
                 done: " "
             },
            {                  //QUEST SPEECH
                before: " ",
                after: " ",
                done: " "
            },
            {
                x: 493,
                y: 396,
                r: 35,
            }
            ),
            orcCamp = new ClickPoint(440, 22, 100, 100, 'orcCamp',
                                                            {
                                                                x: 430,
                                                                y: 140
                                                            }, swapPuzzle,
                 {                  // HERO SPEECH
                     before: [["Kogar, you fat orc!", "How are you!?"], ["You know I wouldn't ask ","if I did't need it.."], ["Sure. Let's get", "to work.."], ],
                     after: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ],
                     done: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ]
                 },
                {                  //QUEST SPEECH
                    before: [["Hey old friend! it's been","a while since you","last came here, hm?"], ["Hahaha! You need", "money? Am I Right?"], ["I don't want to hear about", "it! If you help me with those", " gems I'll give you money.."], ],
                    after: [["Nicely done ", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ],
                    done: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ]
                },
            {
                x: 471,
                y: 78,
                r: 30,
            }
            );
        interactableObjects.push(orcCamp); //6
        interactableObjects.push(humanCastle);//0
        interactableObjects.push(dwarfCamp);//1
        interactableObjects.push(mage);    //3
        interactableObjects.push(treeOfLife);//2
        interactableObjects.push(bandit);  //5
        interactableObjects.push(dragon);  //4
    };
    // ---- Methods for preloading images ---- //
    function addEvents() {
        stopEvents = false;
        $('#canvas').on('click', this, clickEvent);
        $(document).on('keyup', this, handleKeyPressed);
        $(document).on('mousemove', this, onMouseMove);
    };
    function addGameEvents() {
        var i, temp, len = interactableObjects.length;
        for (i = 0; i < len-1; i++) {
            temp = interactableObjects[i];
            console.log(temp);
            temp.game.addEventListeners();
        }
    };
    function handleKeyPressed(ev) {
        if (!stopEvents) {
            ev.preventDefault();
            switch (ev.keyCode) {
                case 13:
                    //console.log(ev);
                    if (ev.type == 'keyup') {
                        changeSpeaker();
                    }
                    break;

            }
        }
    };
    function clickEvent(ev) {
        var rect = mainCanvas.getBoundingClientRect(),
                mouseX = ev.clientX - rect.left,
                mouseY = ev.clientY - rect.top,
                currentObject;

        if (!stopEvents) {
            //console.log('rado is a gay persona');
            

            console.log("Mouse X: " + mouseX + " Mouse Y: " + mouseY);

            for (var i = 0; i < interactableObjects.length; i++) {  // check if clicked
                currentObject = interactableObjects[i];
                if (currentObject.checkIfClicked(mouseX, mouseY) && currentObject.isAvailable) {
                    hero.prepareObjectForSpeaking(currentObject);
                    currentObject.prepareObjectForSpeaking("");
                    for (var j = 0; j < interactableObjects.length; j++) {
                        interactableObjects[j].isInteracting = false;           // set all other click points to "inactive"
                    }
                }
            }
           
            
        };
        // here we will add events for the buttons that will apear when the end game screen is on !

        pauseMusicButton(mouseX, mouseY);

        if (storyEnded) {

            endStoryScreenButton(mouseX,mouseY);
        };
        if (endStoryScreenOn) {
            
            endStoryButton(mouseX, mouseY);
            continueStoryButton(mouseX, mouseY);          
        };
        
    };
    // Here is the functionallity of the buttons:
    function pauseMusicButton(x, y) {
        if (buttons[0].checkIfClicked(x, y)) {
            if (buttons[0].toggled) {
                soundTrack.pauseMainMusic();
                buttons[0].image = preloader.getSpriteByIndex(48);
            }
            else {
                soundTrack.resumeMainMusic();
                buttons[0].image = preloader.getSpriteByIndex(47);
            }
        }
    };
    function endStoryScreenButton(x, y) {
        if (buttons[1].checkIfClicked(x, y)) {            

            endStoryScreenOn=true;

        }
    };
    function endStoryButton(x, y) {
        if (buttons[2].checkIfClicked(x, y)) {
            endStory();
        }
    };
    function continueStoryButton(x, y) {
        if (buttons[3].checkIfClicked(x, y)) {
            endStoryScreenOn = false;
            stopEvents = false;
        }
    };

    testFn = function testEndgameScreen () {
        storyEnded = true;
        //endStoryScreenOn = true;
        stopEvents = true;
    };

    function calculateFinalScore() {
        var array = interactableObjects,
            finalScore = 0;
        for (var i = 0; i < array.length; i++) {
            finalScore += array[i].score;
        }
        return finalScore;
    };
    // here is the mehtod which will end the this if you have finished all 7 games and you have clicked finish button
    function endStory() {
        clearInterval(this.mainLoop);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stopEvents = true;
        menu.isGameStarted = false;
        $('#main').fadeOut(2000, function () {
            menu.initializeMenu();
            console.log(menu);
        });
    };

    function onMouseMove(e) {
        if (!stopEvents) {
            var rect = mainCanvas.getBoundingClientRect();
            mousePos.x = e.clientX - rect.left;
            mousePos.y = e.clientY - rect.top;
        }
    };

    function checkIfFocused() {
        var i, temp, len = interactableObjects.length;
        for (i = 0; i < len; i++) {
            temp = interactableObjects[i];                                 
            if (Math.pow(temp.circle.x - mousePos.x,2) + Math.pow(temp.circle.y - mousePos.y,2) < Math.pow(temp.circle.r,2)) {                                    //((temp.x + (60) - mousePos.x)
                if (stopEvents == false && temp.isAvailable) { 
                    if (temp.spriteGlow) {
                        temp.spriteGlow.drawSprite();
                    }
                }
            }
        }
    };
    function resetGlowFrameCounter() {
        var i, temp, len = interactableObjects.length;
        for (i = 0; i < len; i++) {
        	temp = interactableObjects[i];
            if (Math.pow(temp.circle.x - mousePos.x, 2) + Math.pow(temp.circle.y - mousePos.y, 2) == Math.pow(temp.circle.r, 2)) {
                temp.spriteGlow.frameCounter = 6;
            }
        }
    }
    function initializeCurrentQuest() {

        var temp = interactableObjects[gamesFinished];
        
            if (gamesFinished == 0 && temp.spriteGlow) {
                temp.spriteGlow.drawSprite();
            }
            else if (interactableObjects[gamesFinished - 1].progress.done && temp.spriteGlow) {
                temp.spriteGlow.drawSprite();
            }
        
    };



    function checkIfSpeaking() {
        for (var i = 0; i < interactableObjects.length; i++) {
            if (interactableObjects[i].isInteracting) {
                if (interactableObjects[i].isSpeaking && !(interactableObjects[i].speech.conversetionEnded)) {
                    blackenScreen();
                    hero.portrait.drawPortrait();
                    interactableObjects[i].portrait.drawPortrait();
                    interactableObjects[i].drawSpeechBubble();
                }
                else if (hero.isSpeaking && !(hero.speech.conversetionEnded)) {
                    blackenScreen();
                    hero.drawSpeechBubble();
                    hero.portrait.drawPortrait();
                    interactableObjects[i].portrait.drawPortrait();
                }
            }
        }
    };
    function blackenScreen() {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
        ctx.restore();
    };
    function changeSpeaker() {
        if (hero.speakingTo != null && hero.speakingTo.isInteracting) {
            //console.log(hero.speech.conversetionEnded + " " + hero.speakingTo.speech.conversetionEnded + " " + hero.isSpeaking);
            if (hero.isSpeaking && !hero.speech.conversetionEnded) {
                hero.isSpeaking = false;
                hero.speakingTo.isSpeaking = true;
                hero.speech.counter += 1;

                if (hero.speech.counter == hero.speech.textArray.length) {
                    hero.speech.conversetionEnded = true;
                }
            }
            else if (hero.speakingTo.isSpeaking && !hero.speakingTo.speech.conversetionEnded) {
                hero.speakingTo.isSpeaking = false;
                hero.isSpeaking = true;
                hero.speakingTo.speech.counter += 1;

                if (hero.speakingTo.speech.counter == hero.speakingTo.speech.textArray.length) {
                    hero.speakingTo.speech.conversetionEnded = true;
                }
            }
            else {
                if (hero.speakingTo.isSpeaking) {
                    hero.isSpeaking = true;
                    hero.speakingTo.isSpeaking = false;
                }
                else {
                    hero.speakingTo.isSpeaking = true;
                    hero.isSpeaking = false;
                }
            }
        }
    };
    /* This is the method that checks if the game is finished and starts the after game conversations.
       Also here we will add the end game logic which will darken the screen and asks you if you want to continue
       or you want to end the game! */
    function checkIfGamePlayed() {
        if (hero.speakingTo && hero.speakingTo != null && hero.speakingTo.game) {
            if (hero.speakingTo.game.gameOver && hero.speakingTo.speech.conversetionEnded && hero.speech.conversetionEnded) {
                stopEvents = false;
                inGame = false;
                hero.speakingTo.game.gameOver = false;
                getReward(hero.speakingTo.game.rewardItem);
                /*Here we will add the points from the finished game into the click point in which the game is.*/
                if (hero.speakingTo.score == 0) {
                    gamesFinished++;

                    if (gamesFinished == gamesAmount) {
                        storyEnded = true;
                        //endStoryScreenOn = true;
                        stopEvents = true;

                    }
                }
                if (hero.speakingTo.score < hero.speakingTo.game.score) {
                    hero.speakingTo.score = hero.speakingTo.game.score;
                }
                if (hero.speakingTo.progress.after) {
                    for (var i = 0; i < interactableObjects.length - 1; i++) {
                        if (interactableObjects[i] == hero.speakingTo) {
                            interactableObjects[i + 1].isAvailable = true;
                            break;
                        }
                    }
                    hero.prepareObjectForSpeaking(hero.speakingTo);
                    hero.speakingTo.prepareObjectForSpeaking("");
                }
                else {
                    hero.speakingTo = null;
                }
            }
        }
    };
    //=============================================================================//
    // HERE WE SEE IF THE CONVERSATION HAS ENDED AND WE START THE FRICKING GAME !
    //=============================================================================//
    function startGameAfterConversation() {
        var bonuses;
        if (hero.speakingTo != null && hero.speech.conversetionEnded && hero.speakingTo.speech.conversetionEnded && !inGame) {

            if (hero.speakingTo.progress.before) {
                inGame = true;
                hero.speakingTo.isSpeaking = false;
                hero.isSpeaking = false;
                hero.speakingTo.progress.before = false;
                hero.speakingTo.progress.after = true;

                if (hero.speakingTo.game) {
                    stopEvents = true;
                    bonuses = calculateBonuses();
                    hero.speakingTo.startGame(bonuses, getReward);
                }
            }
            else if (hero.speakingTo.progress.after) {
                hero.speakingTo.progress.after = false;
                hero.speakingTo.progress.done = true;
                hero.speakingTo = null;
                stopEvents = false;
            }
            else if (hero.speakingTo.progress.done) {
                inGame = true;
                hero.speakingTo.isSpeaking = false;
                hero.isSpeaking = false;

                if (hero.speakingTo.game) {
                    stopEvents = true;
                    bonuses = calculateBonuses();
                    hero.speakingTo.startGame(bonuses , getReward);
                }
            }
        }
    };

    function drawButtons() {
        if (!storyEnded) {
            buttons[0].drawButton();
            buttons[1].drawButton();
        }
        if(storyEnded && !endStoryScreenOn){
            buttons[0].drawButton();
            //buttons[1].drawButton();
            finishGameSprite.drawSprite();
        };

    }

    // here is the method which will draw the end game screen!
    function drawEndScreen() {
        if (endStoryScreenOn) {            
            blackenScreen();
            buttons[2].drawButton();
            buttons[3].drawButton();
        };
    };
    //=========global test function for the endgame button//will be deleted soon==========//
    
   
    function addInteractableObject(iObject) {
        interactableObjects.push(iObject);
    };
    function addMovableObjects(mObject) {
        movableObjects.push(mObject);
    };
    function addStaticSpriteObjects(sObject) {
        staticSpriteObjects.push(sObject);
    };
    function searchInteractableObjectByName(name) {
        var array = interactableObjects;
        for (var i = 0; i < array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    };
    function searchMovableObjectsByName(name) {
        var array = movableObjects;
        for (var i = 0; i < array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    };
    function drawInteractableObject() {
        for (var i = 0, len = interactableObjects.length; i < len; i++) {
            interactableObjects[i].drawObj();
        }
    };
    /// Matei's Inventory methods for calculating the bonuses and 
    function calculateBonuses() {
        var object = {
            moves : 0,
            speed : 0,
            time : 0,
            checkpoints: 0,
            lives : 0
        },

        item; 

        for(var i in inventory.slots){ 
            
            if(inventory.slots[i] !== 0){

                item = inventory.slots[i];

                for (var attribute in object) {

                    object[attribute] += item[attribute];

                };
            }
        };
       return object;
    };
    

    function getReward(rewardItem) {
        //adds an item to the inventory if it's not already
        //type - string (ex. : 'sword' / 'ring' / 'dagger')
		if (rewardItem !== null) {
	        for (var index in inventory.slots) {
	            if (inventory.slots[index] !== 0 &&
	               inventory.slots[index].type === rewardItem) {
	                return;
	            };
	        };
	        inventory.getItem(rewardItem);
        };
    };

    function preloadButtons() {
        var toggleMusic = new ButtonsObject(965, 465, 40, 40, "ToggleMusic", preloader.getSpriteByIndex(47)),   
            finishGame = new ButtonsObject(960, 400, 50, 50, "FinishGame", preloader.getSpriteByIndex(49)),         
            continueButton = new ButtonsObject(550,250,220,100,"ContinueStory", preloader.getSpriteByIndex(52)),
            endButton = new ButtonsObject(250,250,220,100,"EndStory", preloader.getSpriteByIndex(51));

        buttons.push(toggleMusic);       
        buttons.push(finishGame);        
        buttons.push(continueButton);
        buttons.push(endButton);

    };
    function preloadSprites() {

        hero.spriteUp = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(0), hero, ctx);  // create Sprites
        hero.spriteDown = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(1), hero, ctx);
        hero.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(2), hero, ctx);
        hero.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(3), hero, ctx);
        hero.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(1), hero, ctx);

        elder.spriteUp = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(4), elder, ctx);
        elder.spriteDown = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(5), elder, ctx);
        elder.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(6), elder, ctx);
        elder.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(7), elder, ctx);
        elder.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(5), elder, ctx);

        dragon.spriteUp = new Sprite(384, 96, 4, 10, preloader.getSpriteByIndex(8), dragon, ctx);
        dragon.spriteDown = new Sprite(384, 96, 4, 10, preloader.getSpriteByIndex(9), dragon, ctx);
        dragon.spriteLeft = new Sprite(384, 96, 4, 10, preloader.getSpriteByIndex(10), dragon, ctx);
        dragon.spriteRight = new Sprite(384, 96, 4, 10, preloader.getSpriteByIndex(11), dragon, ctx);
        dragon.spriteIdle = new Sprite(96, 96, 1, 10, preloader.getSpriteByIndex(9), dragon, ctx);
        dragon.getDestinationDelay = 500;

        elf.spriteUp = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(12), elf, ctx);
        elf.spriteDown = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(13), elf, ctx);
        elf.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(14), elf, ctx);
        elf.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(15), elf, ctx);
        elf.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(13), elf, ctx);
        elf.getDestinationDelay = 300;

        bandit.spriteUp = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(16), bandit, ctx);
        bandit.spriteDown = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(17), bandit, ctx);
        bandit.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(18), bandit, ctx);
        bandit.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(19), bandit, ctx);
        bandit.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(17), bandit, ctx);
        bandit.getDestinationDelay = 160;

        orc.spriteUp = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(20), orc, ctx);
        orc.spriteDown = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(21), orc, ctx);
        orc.spriteLeft = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(22), orc, ctx);
        orc.spriteRight = new Sprite(96, 32, 3, 4, preloader.getSpriteByIndex(23), orc, ctx);
        orc.spriteIdle = new Sprite(32, 32, 1, 4, preloader.getSpriteByIndex(21), orc, ctx);
        orc.getDestinationDelay = 248;

        finishGameSprite = new Sprite(600, 60, 10, 6, preloader.getSpriteByIndex(50), buttons[1], ctx);

        searchInteractableObjectByName("humanCastle").spriteGlow = new Sprite(1700, 140, 10, 4, preloader.getSpriteByIndex(33), searchInteractableObjectByName("humanCastle"), ctx);
        searchInteractableObjectByName("dwarfCamp").spriteGlow = new Sprite(1200, 100, 10, 4, preloader.getSpriteByIndex(34), searchInteractableObjectByName("dwarfCamp"), ctx);
        searchInteractableObjectByName("treeOfLife").spriteGlow = new Sprite(850, 100, 10, 4, preloader.getSpriteByIndex(35), searchInteractableObjectByName("treeOfLife"), ctx);
        searchInteractableObjectByName("mage").spriteGlow = new Sprite(960, 40, 24, 2, preloader.getSpriteByIndex(36), searchInteractableObjectByName("mage"), ctx);
        searchInteractableObjectByName("dragon").spriteGlow = new Sprite(2500, 100, 10, 4, preloader.getSpriteByIndex(46), searchInteractableObjectByName("dragon"), ctx);
        searchInteractableObjectByName("banditTavern").spriteGlow = new Sprite(900, 135, 10, 4, preloader.getSpriteByIndex(38), searchInteractableObjectByName("banditTavern"), ctx);
        searchInteractableObjectByName("orcCamp").spriteGlow = new Sprite(800, 100, 10, 4, preloader.getSpriteByIndex(39), searchInteractableObjectByName("orcCamp"), ctx);

        //interactableObjects[0].spriteGlow = new Sprite(1700, 140, 10, 4, preloader.getSpriteByIndex(33), interactableObjects[0], ctx);
        //interactableObjects[1].spriteGlow = new Sprite(1200, 100, 10, 4, preloader.getSpriteByIndex(34), interactableObjects[1], ctx);
        //interactableObjects[2].spriteGlow = new Sprite(850, 100, 10, 4, preloader.getSpriteByIndex(35), interactableObjects[2], ctx);
        //interactableObjects[3].spriteGlow = new Sprite(960, 40, 24, 2, preloader.getSpriteByIndex(36), interactableObjects[3], ctx);
        //interactableObjects[4].spriteGlow = new Sprite(2500, 100, 10, 4, preloader.getSpriteByIndex(46), interactableObjects[4], ctx);
        //interactableObjects[5].spriteGlow = new Sprite(900, 135, 10, 4, preloader.getSpriteByIndex(38), interactableObjects[5], ctx);
        //interactableObjects[6].spriteGlow = new Sprite(800, 100, 10, 4, preloader.getSpriteByIndex(39), interactableObjects[6], ctx);
    };

    // ==== Portrait preloader ==== //

    function preloadPortraits() {


        hero.setImage(preloader.getPortraitByIndex(0));

        searchInteractableObjectByName("mage").setImage(preloader.getPortraitByIndex(1));
        searchInteractableObjectByName("treeOfLife").setImage(preloader.getPortraitByIndex(2));
        searchInteractableObjectByName("dwarfCamp").setImage(preloader.getPortraitByIndex(3));
        searchInteractableObjectByName("humanCastle").setImage(preloader.getPortraitByIndex(4));
        searchInteractableObjectByName("banditTavern").setImage(preloader.getPortraitByIndex(5));
        searchInteractableObjectByName("dragon").setImage(preloader.getPortraitByIndex(6));
        searchInteractableObjectByName("orcCamp").setImage(preloader.getPortraitByIndex(7));

        //interactableObjects[3].setImage(preloader.getPortraitByIndex(1));
        //interactableObjects[2].setImage(preloader.getPortraitByIndex(2));
        //interactableObjects[1].setImage(preloader.getPortraitByIndex(3));
        //interactableObjects[0].setImage(preloader.getPortraitByIndex(4));
        //interactableObjects[5].setImage(preloader.getPortraitByIndex(5));
        //interactableObjects[4].setImage(preloader.getPortraitByIndex(6));
        //interactableObjects[6].setImage(preloader.getPortraitByIndex(7));

    };
    function checkRequestAnimationFrame() {
        if (!window.requestAnimationFrame) {

            window.requestAnimationFrame = (function () {

                return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

                    window.setTimeout(callback, 1000 / 60);

                };

            })();

        }
    };
    

    this.preloadEverything = function () {
        preloader.preloadEverything();
        addCheckPoints();
        loadMovableObjects();
        soundTrack = new PlayList();
        soundTrack.startMainMusic();
        preloadButtons();
        preloadSprites();
        preloadPortraits();
        

        checkRequestAnimationFrame();

        /* all quests are available */
        var len = interactableObjects.length;
        for (var i = 0; i < len; i++) {
            interactableObjects[i].isAvailable = true;
        };

        
        addEvents();
        addGameEvents();
        mainLoop();
    };

}


//  Everything after this paragraph has to be moved to the this class.

$(window).load(function () {
    menu = new Menu();

    menu.initializeMenu();
});