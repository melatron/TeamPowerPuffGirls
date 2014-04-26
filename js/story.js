Story = Class.extend({

    init: function () {
        var self = this;
        this.interactableObjects = [];
        this.stopEvents = false;
        this.inGame = false;

        this.canvas = $("#canvas")[0];
        this.ctx = this.canvas.getContext('2d');

        this.storyFinished = false;
        this.hero = new Heroes(0, 256, 32, 32, "hero");
        this.elder = null;
        this.dragon = null;
        this.elf = null;
        this.bandit = null;
        this.orc = null;
        
        
        this.gamesFinished = 0;
        this.gamesAmount = 6;
        this.buttons = [];
        var toggleMusic = new ButtonsObject(0, 0, 40, 40, "ToggleMusic"),
            finishGame = new ButtonsObject(984, 0, 40, 40, "FinishGame");
        this.buttons.push(toggleMusic);
        this.buttons.push(finishGame);
        this.endStoryScreenOn = false;

        
        //
        this.movableObjects = [];
        this.staticSpriteObjects = [];
        this.mainCanvas = document.getElementById("canvas");
        
        this.sprites = [];
        this.portraits = [];
        // Hero have is not yet implemented!
        

        this.soundTrack = new PlayList();

        this.animation = null;

        this.mousePos = {};

        this.mainLoop = function () {
            self.ctx.save();
            self.ctx.clearRect(0, 0, canvas.width, canvas.height);
            self.elder.setRandomDestination();
            self.dragon.setRandomDestination();
            self.elf.setRandomDestination();
            self.bandit.setRandomDestination();
            self.orc.setRandomDestination();
            self.hero.moveHeroToDestination();
            self.drawInteractableObject();
            self.checkIfSpeaking();
            self.initializeCurrentQuest();
            //self.hero.drawSpeechBubble();
            self.soundTrack.startNextSong();
            self.startGameAfterConversation();
            self.checkIfGamePlayed();
            self.checkIfFocused();
            self.ctx.restore();
            self.animation = requestAnimationFrame(self.mainLoop);
            if (self.endStoryScreenOn) {
                self.endStoryScreen();
            }
        };

        this.inventory = new Inventory();
    },
    loadMovableObjects: function () {
        

        this.elder = new AIMovableObject(790, 200, 32, 32, "theMage", this.interactableObjects[3], {
            x: 820,
            y: 200
        }, {
            xMin: 780,
            xMax: 820,
            yMin: 200,
            yMax: 240
        });
        this.dragon = new AIMovableObject(730, 330, 96, 96, "dragon", this.interactableObjects[4], {
            x: 780,
            y: 300
        }, {
            xMin: 680,
            xMax: 810,
            yMin: 260,
            yMax: 330
        });
        this.elf = new AIMovableObject(210, 300, 32, 32, "elf", this.interactableObjects[2], {
            x: 210,
            y: 300
        }, {
            xMin: 200,
            xMax: 220,
            yMin: 300,
            yMax: 340
        });
        this.bandit = new AIMovableObject(400, 400, 32, 32, 'bandit', this.interactableObjects[5], {
            x: 400,
            y: 400
        }, {
            xMin: 390,
            xMax: 410,
            yMin: 390,
            yMax: 410
        });
        this.orc = new AIMovableObject(370, 80, 32, 32, 'orc', this.interactableObjects[6], {
            x: 370,
            y: 75
        }, {
            xMin: 360,
            xMax: 410,
            yMin: 75,
            yMax: 100
        });
    },
    addCheckPoints: function () {
       var  elfGame = new RadoGame(),
            digitGame = new TonyGame(),
            squareGame = new SquareGame(),
            swapPuzzle = new SwapPuzzle(),
            pathFinder = new PathFinder(),
            eightPuzzle = new EightPuzzle();
        var humanCastle = new ClickPoint(106, -13, 150, 140, "humanCastle",
        													{
        													    x: 175,
        													    y: 150
        													},
            squareGame,
            {                  // HERO SPEECH
                before: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ],
                after: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ],
                done: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ]
            },
            {                  //QUEST SPEECH
                before: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ],
                after: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ],
                done: [["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ["hello mister", "I'll try to help", "Farewell"], ]
            }
        	),
            dwarfCamp = new ClickPoint(740, -5, 130, 130, "dwarfCamp",
            												{
            												    x: 655,
            												    y: 130
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
            }
            ),
            treeOfLife = new ClickPoint(83, 372, 100, 100, "treeOfLife", {
                x: 175,
                y: 350
            },
            elfGame,
            {                  // HERO SPEECH
                before: " ",
                after: " ",
                done: " "
            },
            {                  //QUEST SPEECH
                before: " ",
                after: " ",
                done: " "
            }

            ),
            mage = new ClickPoint(800, 200, 50, 50, 'mage',
            												{
            												    x: 810,
            												    y: 250
            												}, swapPuzzle,
            {                  // HERO SPEECH
                before: " ",
                after: " ",
                done: " "
            },
            {                  //QUEST SPEECH
                before: " ",
                after: " ",
                done: " "
            }
            ),
            dragon = new ClickPoint(675, 300, 200, 200, 'dragon',
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
            }
            ),
            orcCamp = new ClickPoint(440, 22, 100, 100, 'orcCamp',
            												{
            												    x: 430,
            												    y: 140
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
                }
            );
        this.interactableObjects.push(humanCastle);
        this.interactableObjects.push(dwarfCamp);
        this.interactableObjects.push(treeOfLife);
        this.interactableObjects.push(mage);
        this.interactableObjects.push(dragon);
        this.interactableObjects.push(bandit);
        this.interactableObjects.push(orcCamp);
    },
    // ---- Methods for preloading images ---- //
    addEvents: function () {
        this.stopEvents = false;
        $('#canvas').on('click', this, this.clickEvent);
        $(document).on('keyup', this, this.handleKeyPressed);
        $(document).on('mousemove', this, this.onMouseMove);
    },
    handleKeyPressed: function (ev) {
        if (!ev.data.stopEvents) {
            ev.preventDefault();
            switch (ev.keyCode) {
                case 13:
                    //console.log(ev);
                    if (ev.type == 'keyup') {
                        ev.data.changeSpeaker();
                    }
                    break;

            }
        }
    },
    clickEvent: function (ev) {
        if (!ev.data.stopEvents) {
            //console.log('rado is a gay persona');
            var rect = ev.data.mainCanvas.getBoundingClientRect(),
                    mouseX = ev.clientX - rect.left,
                    mouseY = ev.clientY - rect.top,
                    currentObject;

            console.log("Mouse X: " + mouseX + " Mouse Y: " + mouseY);

            for (var i = 0; i < ev.data.interactableObjects.length; i++) {  // check if clicked
                currentObject = ev.data.interactableObjects[i];
                if (currentObject.checkIfClicked(mouseX, mouseY) && currentObject.isAvailable) {
                    ev.data.hero.prepareObjectForSpeaking(currentObject);
                    currentObject.prepareObjectForSpeaking("");
                    for (var j = 0; j < ev.data.interactableObjects.length; j++) {
                        ev.data.interactableObjects[j].isInteracting = false;           // set all other click points to "inactive"
                    }
                }
            }
            ev.data.pauseMusicButton(mouseX, mouseY);
        }
        // here we will add events for the buttons that will apear when the end game screen is on !
        if (ev.data.endStoryScreenOn && ev.data.stopEvents) {
            ev.data.endStoryButton(mouseX, mouseY);
            ev.data.continueStoryButton(mouseX, mouseY);
        }
    },
    // Here is the functionallity of the buttons:
    pauseMusicButton: function (x, y) {
        if (this.buttons[0].checkIfClicked(x, y)) {
            if (this.buttons[0].toggled) {
                this.soundTrack.pauseMainMusic();
            }
            else {
                this.soundTrack.resumeMainMusic();
            }
        }
    },
    endStoryScreenButton: function (x, y) {
        if (this.buttons[1].checkIfClicked(x, y)) {
            if (this.storyEnded) {
                this.endStoryScreen();
            }
        }
    },
    endStoryButton: function () {
        if (this.buttons[2].checkIfClicked(x, y)) {
            this.endStory();
        }
    },
    continueStoryButton: function () {
        if (this.buttons[3].checkIfClicked(x, y)) {
            this.endStoryScreenOn = false;
            this.stopEvents = false;
        }
    },

    onMouseMove: function (e) {
        if (!e.data.stopEvents) {
            var rect = e.data.mainCanvas.getBoundingClientRect();
            e.data.mousePos.x = e.clientX - rect.left;
            e.data.mousePos.y = e.clientY - rect.top;
        }
    },

    checkIfFocused: function(){
        var i, temp, len = this.interactableObjects.length;
        for(i = 0; i < len; i++){
            temp = this.interactableObjects[i];
            if((this.mousePos.x > temp.x && this.mousePos.x < temp.x + temp.width) && 
                (this.mousePos.y > temp.y && this.mousePos.y < temp.y + temp.height))
            {
                if(this.stopEvents == false && temp.isAvailable){
                    if(temp.spriteGlow){
                        temp.spriteGlow.drawSprite();
                    }
                }
            }
            else if(temp.spriteGlow){ 
                temp.spriteGlow.frameCounter = 6;
            }
        }
    },
    initializeCurrentQuest: function () {
        if (this.interactableObjects[this.gamesFinished].isAvailable) {

             this.interactableObjects[this.gamesFinished].spriteGlow.drawSprite();
        }

    },


 
	checkIfSpeaking: function () {
	    for (var i = 0; i < this.interactableObjects.length; i++) {
	        if (this.interactableObjects[i].isInteracting) {
	            if (this.interactableObjects[i].isSpeaking && !(this.interactableObjects[i].speech.conversetionEnded)) {
	                this.blackenScreen();
	                this.hero.portrait.drawPortrait();
	                this.interactableObjects[i].portrait.drawPortrait();
	                this.interactableObjects[i].drawSpeechBubble();
	            }
	            else if (this.hero.isSpeaking && !(this.hero.speech.conversetionEnded)) {
	                this.blackenScreen();
	                this.hero.drawSpeechBubble();
	                this.hero.portrait.drawPortrait();
	                this.interactableObjects[i].portrait.drawPortrait();
	            }
	        }
	    }
	},
	blackenScreen: function () {
	    this.ctx.save();
	    this.ctx.globalAlpha = 0.7;
	    this.ctx.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
	    this.ctx.restore();
	},
	changeSpeaker: function () {
	    if (this.hero.speakingTo != null && this.hero.speakingTo.isInteracting) {
	        //console.log(this.hero.speech.conversetionEnded + " " + this.hero.speakingTo.speech.conversetionEnded + " " + this.hero.isSpeaking);
	        if (this.hero.isSpeaking && !this.hero.speech.conversetionEnded) {
	            this.hero.isSpeaking = false;
	            this.hero.speakingTo.isSpeaking = true;
	            this.hero.speech.counter += 1;

	            if (this.hero.speech.counter == this.hero.speech.textArray.length) {
	                this.hero.speech.conversetionEnded = true;
	            }
	        }
	        else if (this.hero.speakingTo.isSpeaking && !this.hero.speakingTo.speech.conversetionEnded) {
	            this.hero.speakingTo.isSpeaking = false;
	            this.hero.isSpeaking = true;
	            this.hero.speakingTo.speech.counter += 1;

	            if (this.hero.speakingTo.speech.counter == this.hero.speakingTo.speech.textArray.length) {
	                this.hero.speakingTo.speech.conversetionEnded = true;
	            }
	        }
	        else {
	            if (this.hero.speakingTo.isSpeaking) {
	                this.hero.isSpeaking = true;
	                this.hero.speakingTo.isSpeaking = false;
	            }
	            else {
	                this.hero.speakingTo.isSpeaking = true;
	                this.hero.isSpeaking = false;
	            }
	        }
	    }
	},
    /* This is the method that checks if the game is finished and starts the after game conversations.
       Also here we will add the end game logic which will darken the screen and asks you if you want to continue
       or you want to end the game! */
	checkIfGamePlayed: function () {
	    if (this.hero.speakingTo && this.hero.speakingTo != null && this.hero.speakingTo.game) {
	        if (this.hero.speakingTo.game.gameOver && this.hero.speakingTo.speech.conversetionEnded && this.hero.speech.conversetionEnded) {
	            this.stopEvents = false;
	                this.inGame = false;
	                this.hero.speakingTo.game.gameOver = false;
	            /*Here we will add the points from the finished game into the click point in which the game is.*/
	            if(this.hero.speakingTo.score == 0) {
	                this.gamesFinished++;
	                if (this.gamesFinished == this.gamesAmount) {
	                    this.storyEnded = true;
	                    this.endStoryScreenOn = true;
	                    this.stopEvents = true;
	                }
	            }
	            if(this.hero.speakingTo.score < this.hero.speakingTo.game.score) {
	              this.hero.speakingTo.score = this.hero.speakingTo.game.score;
	            }
	            if (this.hero.speakingTo.progress.after) {
	                for (var i = 0; i < this.interactableObjects.length-1; i++){
	                    if (this.interactableObjects[i] == this.hero.speakingTo) {
	                        this.interactableObjects[i + 1].isAvailable = true;
	                        break;
	                    }
	                }
	                this.hero.prepareObjectForSpeaking(this.hero.speakingTo);
	                this.hero.speakingTo.prepareObjectForSpeaking("");
	            }
	            else {
	                this.hero.speakingTo = null;
	            }
	        }
	    }
	},
	startGameAfterConversation: function(){
	    if (this.hero.speakingTo != null && this.hero.speech.conversetionEnded && this.hero.speakingTo.speech.conversetionEnded && !this.inGame) {
            
	        if (this.hero.speakingTo.progress.before) { 
	            this.inGame = true;
	            this.hero.speakingTo.isSpeaking = false;
	            this.hero.isSpeaking = false;
	            this.hero.speakingTo.progress.before = false;
	            this.hero.speakingTo.progress.after = true;

	            if (this.hero.speakingTo.game) {
	                //console.log('asdaskdalsdkalskdlaskdlakdlaskdlaksdlakdlaskdlakdlasdkalsdkaldkadkal');
	                this.stopEvents = true;
	                this.hero.speakingTo.startGame();
	            }
	        }
	        else if (this.hero.speakingTo.progress.after) {
	            this.hero.speakingTo.progress.after = false;
	            this.hero.speakingTo.progress.done = true;
	            this.hero.speakingTo = null;
	            this.stopEvents = false;
	        }
	        else if (this.hero.speakingTo.progress.done) {
	            this.inGame = true;
	            this.hero.speakingTo.isSpeaking = false;
	            this.hero.isSpeaking = false;

	            if (this.hero.speakingTo.game) {
	                this.stopEvents = true;
	                this.hero.speakingTo.startGame();
	            }
	        }
	    }
	},
    // here is the method which will draw the end game screen!
	endStoryScreen: function () {
	    if (this.endStoryScreenOn) {
	        this.blackenScreen();
	        this.buttons[2].drawButton();
	        this.buttons[3].drawButton();
	    }   
	},
	calculateFinalScore: function () {
	    var array = this.interactableObjects,
            finalScore = 0;
	    for (var i = 0; i < array.length; i++) {
	        finalScore += array[i].score;
	    }
	    return finalScore;
	},
    // here is the mehtod which will end the this if you have finished all 7 games and you have clicked finish button
	endStory: function () {
    
	},
    addInteractableObject: function (iObject) {
        this.interactableObjects.push(iObject);
    },
    addMovableObjects: function (mObject) {
        this.movableObjects.push(mObject);
    },
    addStaticSpriteObjects: function (sObject) {
        this.staticSpriteObjects.push(sObject);
    },
    searchInteractableObjectByName: function (name) {
        var array = this.interactableObjects;
        for (var i = 0; i < array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    },
    searchMovableObjectsByName: function (name) {
        var array = this.MovableObjects;
        for (var i = 0; i < array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    },
    drawInteractableObject: function () {
        for (var i = 0, len = this.interactableObjects.length; i < len; i++) {
            this.interactableObjects[i].drawObj();
        }
    },
    preloadSprites: function () {
        //define sprites
       

        for (var i = 0; i < arguments.length; i++) {  // create image objects and define src
            this.sprites[i] = new Image();
            this.sprites[i].src = arguments[i];
        }

        this.hero.spriteUp = new Sprite(96, 32, 3, 4, this.sprites[0], this.hero, this.ctx);  // create Sprites
        this.hero.spriteDown = new Sprite(96, 32, 3, 4, this.sprites[1], this.hero, this.ctx);
        this.hero.spriteLeft = new Sprite(96, 32, 3, 4, this.sprites[2], this.hero, this.ctx);
        this.hero.spriteRight = new Sprite(96, 32, 3, 4, this.sprites[3], this.hero, this.ctx);
        this.hero.spriteIdle = new Sprite(32, 32, 1, 4, this.sprites[1], this.hero, this.ctx);

        this.elder.spriteUp = new Sprite(96, 32, 3, 4, this.sprites[4], this.elder, this.ctx);
        this.elder.spriteDown = new Sprite(96, 32, 3, 4, this.sprites[5], this.elder, this.ctx);
        this.elder.spriteLeft = new Sprite(96, 32, 3, 4, this.sprites[6], this.elder, this.ctx);
        this.elder.spriteRight = new Sprite(96, 32, 3, 4, this.sprites[7], this.elder, this.ctx);
        this.elder.spriteIdle = new Sprite(32, 32, 1, 4, this.sprites[5], this.elder, this.ctx);

        this.dragon.spriteUp = new Sprite(384, 96, 4, 10, this.sprites[8], this.dragon, this.ctx);
        this.dragon.spriteDown = new Sprite(384, 96, 4, 10, this.sprites[9], this.dragon, this.ctx);
        this.dragon.spriteLeft = new Sprite(384, 96, 4, 10, this.sprites[10], this.dragon, this.ctx);
        this.dragon.spriteRight = new Sprite(384, 96, 4, 10, this.sprites[11], this.dragon, this.ctx);
        this.dragon.spriteIdle = new Sprite(96, 96, 1, 10, this.sprites[9], this.dragon, this.ctx);
        this.dragon.getDestinationDelay = 500;

        this.elf.spriteUp = new Sprite(96, 32, 3, 4, this.sprites[12], this.elf, this.ctx);
        this.elf.spriteDown = new Sprite(96, 32, 3, 4, this.sprites[13], this.elf, this.ctx);
        this.elf.spriteLeft = new Sprite(96, 32, 3, 4, this.sprites[14], this.elf, this.ctx);
        this.elf.spriteRight = new Sprite(96, 32, 3, 4, this.sprites[15], this.elf, this.ctx);
        this.elf.spriteIdle = new Sprite(32, 32, 1, 4, this.sprites[13], this.elf, this.ctx);
        this.elf.getDestinationDelay = 300;

        this.bandit.spriteUp = new Sprite(96, 32, 3, 4, this.sprites[16], this.bandit, this.ctx);
        this.bandit.spriteDown = new Sprite(96, 32, 3, 4, this.sprites[17], this.bandit, this.ctx);
        this.bandit.spriteLeft = new Sprite(96, 32, 3, 4, this.sprites[18], this.bandit, this.ctx);
        this.bandit.spriteRight = new Sprite(96, 32, 3, 4, this.sprites[19], this.bandit, this.ctx);
        this.bandit.spriteIdle = new Sprite(32, 32, 1, 4, this.sprites[17], this.bandit, this.ctx);
        this.bandit.getDestinationDelay = 160;

        this.orc.spriteUp = new Sprite(96, 32, 3, 4, this.sprites[20], this.orc, this.ctx);
        this.orc.spriteDown = new Sprite(96, 32, 3, 4, this.sprites[21], this.orc, this.ctx);
        this.orc.spriteLeft = new Sprite(96, 32, 3, 4, this.sprites[22], this.orc, this.ctx);
        this.orc.spriteRight = new Sprite(96, 32, 3, 4, this.sprites[23], this.orc, this.ctx);
        this.orc.spriteIdle = new Sprite(32, 32, 1, 4, this.sprites[21], this.orc, this.ctx);
        this.orc.getDestinationDelay = 248;

        this.interactableObjects[0].spriteGlow = new Sprite(1700, 140, 10, 4, this.sprites[33], this.interactableObjects[0], this.ctx);
        this.interactableObjects[1].spriteGlow = new Sprite(1200, 100, 10, 4, this.sprites[34], this.interactableObjects[1], this.ctx);
        this.interactableObjects[2].spriteGlow = new Sprite(850, 100, 10, 4, this.sprites[35], this.interactableObjects[2], this.ctx);
        this.interactableObjects[3].spriteGlow = new Sprite(960, 40, 24, 2, this.sprites[36], this.interactableObjects[3], this.ctx);
        this.interactableObjects[4].spriteGlow = new Sprite(960, 40, 24, 2, this.sprites[37], this.interactableObjects[4], this.ctx);
        this.interactableObjects[5].spriteGlow = new Sprite(900, 135, 10, 4, this.sprites[38], this.interactableObjects[5], this.ctx);
        this.interactableObjects[6].spriteGlow = new Sprite(800, 100, 10, 4, this.sprites[39], this.interactableObjects[6], this.ctx);
    },

    // ==== Portrait preloader ==== //

    preloadPortraits: function () {
       
        for (var i = 0; i < arguments.length; i++) {
            this.portraits[i] = new Image();
            this.portraits[i].src = arguments[i];
        }

        this.hero.setImage(this.portraits[0]);
        this.interactableObjects[3].setImage(this.portraits[1]);
        this.interactableObjects[2].setImage(this.portraits[2]);
        this.interactableObjects[1].setImage(this.portraits[3]);
        this.interactableObjects[0].setImage(this.portraits[4]);
        this.interactableObjects[5].setImage(this.portraits[5]);
        this.interactableObjects[4].setImage(this.portraits[6]);
        this.interactableObjects[6].setImage(this.portraits[7]);

    },
    checkRequestAnimationFrame: function(){
        if (!window.requestAnimationFrame) {

            window.requestAnimationFrame = (function() {

            return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

                window.setTimeout(callback, 1000 / 60);

                };

            })();

        }
    },
    
    preloadEverything: function () {
        this.addCheckPoints();
        this.loadMovableObjects();
        this.checkRequestAnimationFrame();

        /* all quests are available */
        this.interactableObjects[0].isAvailable = true;
        this.interactableObjects[1].isAvailable = true;
        this.interactableObjects[2].isAvailable = true;
        this.interactableObjects[3].isAvailable = true;
        this.interactableObjects[4].isAvailable = true;
        this.interactableObjects[5].isAvailable = true;
        this.interactableObjects[6].isAvailable = true;



        this.inventory.getItem('dagger');
        this.inventory.getItem('ring');
        this.inventory.getItem('sword');
        this.addEvents();

        
    	this.preloadSprites(
    			'source/heroMoveUp.png',
    			'source/heroMoveDown.png',
    			'source/heroMoveLeft.png',
    			'source/heroMoveRight.png',
    			
    			'source/elderMoveUp.png',
    			'source/elderMoveDown.png',
    			'source/elderMoveLeft.png',
    			'source/elderMoveRight.png',
    			
                'source/dragonMoveUp.png',
                'source/dragonMoveDown.png',
                'source/dragonMoveLeft.png',
                'source/dragonMoveRight.png',
                
                'source/elfMoveUp.png',
                'source/elfMoveDown.png',
                'source/elfMoveLeft.png',
                'source/elfMoveRight.png',
                
                'source/banditMoveUp.png',
                'source/banditMoveDown.png',
                'source/banditMoveLeft.png',
                'source/banditMoveRight.png',
                
                'source/orcMoveUp.png',
                'source/orcMoveDown.png',
                'source/orcMoveLeft.png',
                'source/orcMoveRight.png',
                
                'source/elf game/spriteLevel1.png',
                'source/elf game/spriteLevel2.png',
                'source/elf game/spriteLevel3.png',
                
                'source/elf game/coinSprite.png',
                
                'source/lightning_width40px.png',

                'source/brownElfMoveUp.png',
                'source/brownElfMoveDown.png',
                'source/brownElfMoveLeft.png',
                'source/brownElfMoveRight.png',

                'source/castleGlowSprite.png',
                'source/dwarfGlowSprite.png',
                'source/treeGlowSprite.png',
                'source/defaultGlow.png',
                'source/defaultGlow.png',
                'source/banditCampGlowSprite.png',
                'source/orcGlowSprite.png',
                
                'source/PathFinder/spriteLevel1.png',
                'source/PathFinder/spriteLevel2.png',
                'source/PathFinder/spriteLevel3.png',
                
                'source/PathFinder/greenBoard.png',
                'source/PathFinder/yellowBoard.png'

    	);
    	
    	this.preloadPortraits(
    		'source/heroPortrait.png',
    		'source/elderPortrait.png',
    		'source/elfPortrait.png',
    		'source/dwarfPortrait.png',
    		'source/kingPortrait.png',
            'source/banditPortrait.png',
            'source/dragonPortrait.png',
            'source/orcPortrait.png'
    	);
    	this.soundTrack.preloadMainSounds(
            'music/Dirt.mp3',
            'music/Grass.mp3',
            'music/Rough.mp3',
            'music/Swamp.mp3',
            'music/Water.mp3',
            'music/Snow.mp3',
            'music/ElementalMetropolis.mp3',
            'music/Sand.mp3',
            'music/Volcanic.mp3',
            'music/Wizards.mp3',
            'music/ElvesTown.mp3',
            'music/Necropolis.mp3',
            'music/KnightsFortress.mp3',
            'music/ChaosCity.mp3',
            'source/scroll.mp3'
        );
    	this.mainLoop();
    }

});


//  Everything after this paragraph has to be moved to the this class.

$(window).load(function () {
    menu = new Menu();

    menu.initializeMenu();
});
//window.onload = function () {
//	
//	menu = new Menu();
//	
//	menu.initializeMenu();
//
//};
