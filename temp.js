var Story = function () {
    var self = this;
    var interactableObjects = [];
    var stopEvents = false;
    var inGame = false;

    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');

    var storyFinished = false;
    var hero = new Heroes(0, 256, 32, 32, "hero");
    var elder = null;
    var dragon = null;
    var elf = null;
    var bandit = null;
    var orc = null;


    var gamesFinished = 0;
    var gamesAmount = 6;
    var buttons = [];
    var toggleMusic = new ButtonsObject(0, 0, 40, 40, "ToggleMusic"),
        finishGame = new ButtonsObject(984, 0, 40, 40, "FinishGame");
    buttons.push(toggleMusic);
    buttons.push(finishGame);
    var endStoryScreenOn = false;


    //
    var movableObjects = [];
    var staticSpriteObjects = [];
    var mainCanvas = document.getElementById("canvas");

    var sprites = [];
    var portraits = [];
    // Hero have is not yet implemented!


    var soundTrack = new PlayList();

    var animation = null;

    var mousePos = {};

    var mainLoop = function () {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        elder.setRandomDestination();
        dragon.setRandomDestination();
        elf.setRandomDestination();
        bandit.setRandomDestination();
        orc.setRandomDestination();
        hero.moveHeroToDestination();
        drawInteractableObject();
        checkIfSpeaking();
        initializeCurrentQuest();
        // hero.drawSpeechBubble();
        soundTrack.startNextSong();
        startGameAfterConversation();
        checkIfGamePlayed();
        checkIfFocused();
        ctx.restore();
        animation = requestAnimationFrame(mainLoop);
        if (endStoryScreenOn) {
            endStoryScreen();
        }
    };

    var inventory = new Inventory();

    var loadMovableObjects = function () {


        elder = new AIMovableObject(790, 200, 32, 32, "theMage", interactableObjects[3], {
            x: 820,
            y: 200
        }, {
            xMin: 780,
            xMax: 820,
            yMin: 200,
            yMax: 240
        });
        dragon = new AIMovableObject(730, 330, 96, 96, "dragon", interactableObjects[4], {
            x: 780,
            y: 300
        }, {
            xMin: 680,
            xMax: 810,
            yMin: 260,
            yMax: 330
        });
        elf = new AIMovableObject(210, 300, 32, 32, "elf", interactableObjects[2], {
            x: 210,
            y: 300
        }, {
            xMin: 200,
            xMax: 220,
            yMin: 300,
            yMax: 340
        });
        bandit = new AIMovableObject(400, 400, 32, 32, 'bandit', interactableObjects[5], {
            x: 400,
            y: 400
        }, {
            xMin: 390,
            xMax: 410,
            yMin: 390,
            yMax: 410
        });
        orc = new AIMovableObject(370, 80, 32, 32, 'orc', interactableObjects[6], {
            x: 370,
            y: 75
        }, {
            xMin: 360,
            xMax: 410,
            yMin: 75,
            yMax: 100
        });
    };
    var addCheckPoints = function () {
        var elfGame = new RadoGame(),
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
        interactableObjects.push(humanCastle);
        interactableObjects.push(dwarfCamp);
        interactableObjects.push(treeOfLife);
        interactableObjects.push(mage);
        interactableObjects.push(dragon);
        interactableObjects.push(bandit);
        interactableObjects.push(orcCamp);
    };
    // ---- Methods for preloading images ---- //
    var addEvents = function () {
        stopEvents = false;
        $('#canvas').on('click', this, clickEvent);
        $(document).on('keyup', this, handleKeyPressed);
        $(document).on('mousemove', this, onMouseMove);
    };
    var handleKeyPressed = function (ev) {
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
    var clickEvent = function (ev) {
        if (!stopEvents) {
            //console.log('rado is a gay persona');
            var rect = mainCanvas.getBoundingClientRect(),
                    mouseX = ev.clientX - rect.left,
                    mouseY = ev.clientY - rect.top,
                    currentObject;

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
            pauseMusicButton(mouseX, mouseY);
        }
        // here we will add events for the buttons that will apear when the end game screen is on !
        if (endStoryScreenOn && stopEvents) {
            endStoryButton(mouseX, mouseY);
            continueStoryButton(mouseX, mouseY);
        }
    };
    // Here is the functionallity of the buttons:
    var pauseMusicButton = function (x, y) {
        if (buttons[0].checkIfClicked(x, y)) {
            if (buttons[0].toggled) {
                soundTrack.pauseMainMusic();
            }
            else {
                soundTrack.resumeMainMusic();
            }
        }
    };
    var endStoryScreenButton = function (x, y) {
        if (buttons[1].checkIfClicked(x, y)) {
            if (storyEnded) {
                endStoryScreen();
            }
        }
    };
    var endStoryButton = function () {
        if (buttons[2].checkIfClicked(x, y)) {
            endStory();
        }
    };
    var continueStoryButton = function () {
        if (buttons[3].checkIfClicked(x, y)) {
            endStoryScreenOn = false;
            stopEvents = false;
        }
    };

    var onMouseMove = function (e) {
        if (!stopEvents) {
            var rect = mainCanvas.getBoundingClientRect();
            mousePos.x = e.clientX - rect.left;
            mousePos.y = e.clientY - rect.top;
        }
    };

    var checkIfFocused = function () {
        var i, temp, len = interactableObjects.length;
        for (i = 0; i < len; i++) {
            temp = interactableObjects[i];
            if ((mousePos.x > temp.x && mousePos.x < temp.x + temp.width) &&
                (mousePos.y > temp.y && mousePos.y < temp.y + temp.height)) {
                if (stopEvents == false && temp.isAvailable) {
                    if (temp.spriteGlow) {
                        temp.spriteGlow.drawSprite();
                    }
                }
            }
            else if (temp.spriteGlow) {
                temp.spriteGlow.frameCounter = 6;
            }
        }
    };
    var initializeCurrentQuest = function () {
        if (gamesFinished == 0) {
            interactableObjects[gamesFinished].spriteGlow.drawSprite();
        }
        else if (interactableObjects[gamesFinished - 1].progress.done) {
            interactableObjects[gamesFinished].spriteGlow.drawSprite();
        }
    };



    var checkIfSpeaking = function () {
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
    var blackenScreen = function () {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
        ctx.restore();
    };
    var changeSpeaker = function () {
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
    var checkIfGamePlayed = function () {
        if (hero.speakingTo && hero.speakingTo != null && hero.speakingTo.game) {
            if (hero.speakingTo.game.gameOver && hero.speakingTo.speech.conversetionEnded && hero.speech.conversetionEnded) {
                stopEvents = false;
                inGame = false;
                hero.speakingTo.game.gameOver = false;
                /*Here we will add the points from the finished game into the click point in which the game is.*/
                if (hero.speakingTo.score == 0) {
                    gamesFinished++;
                    if (gamesFinished == gamesAmount) {
                        storyEnded = true;
                        endStoryScreenOn = true;
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
    var startGameAfterConversation = function () {
        if (hero.speakingTo != null && hero.speech.conversetionEnded && hero.speakingTo.speech.conversetionEnded && !inGame) {

            if (hero.speakingTo.progress.before) {
                inGame = true;
                hero.speakingTo.isSpeaking = false;
                hero.isSpeaking = false;
                hero.speakingTo.progress.before = false;
                hero.speakingTo.progress.after = true;

                if (hero.speakingTo.game) {
                    //console.log('asdaskdalsdkalskdlaskdlakdlaskdlaksdlakdlaskdlakdlasdkalsdkaldkadkal');
                    stopEvents = true;
                    hero.speakingTo.startGame();
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
                    hero.speakingTo.startGame();
                }
            }
        }
    };
    // here is the method which will draw the end game screen!
    var endStoryScreen = function () {
        if (endStoryScreenOn) {
            blackenScreen();
            buttons[2].drawButton();
            buttons[3].drawButton();
        }
    };
    var calculateFinalScore = function () {
        var array = interactableObjects,
            finalScore = 0;
        for (var i = 0; i < array.length; i++) {
            finalScore += array[i].score;
        }
        return finalScore;
    };
    // here is the mehtod which will end the this if you have finished all 7 games and you have clicked finish button
    var endStory = function () {

    };
    var addInteractableObject = function (iObject) {
        interactableObjects.push(iObject);
    };
    var addMovableObjects = function (mObject) {
        movableObjects.push(mObject);
    };
    var addStaticSpriteObjects = function (sObject) {
        staticSpriteObjects.push(sObject);
    };
    var searchInteractableObjectByName = function (name) {
        var array = interactableObjects;
        for (var i = 0; i < array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    };
    var searchMovableObjectsByName = function (name) {
        var array = MovableObjects;
        for (var i = 0; i < array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    };
    var drawInteractableObject = function () {
        for (var i = 0, len = interactableObjects.length; i < len; i++) {
            interactableObjects[i].drawObj();
        }
    };
    var preloadSprites = function () {
        //define sprites


        for (var i = 0; i < arguments.length; i++) {  // create image objects and define src
            sprites[i] = new Image();
            sprites[i].src = arguments[i];
        }

        hero.spriteUp = new Sprite(96, 32, 3, 4, sprites[0], hero, ctx);  // create Sprites
        hero.spriteDown = new Sprite(96, 32, 3, 4, sprites[1], hero, ctx);
        hero.spriteLeft = new Sprite(96, 32, 3, 4, sprites[2], hero, ctx);
        hero.spriteRight = new Sprite(96, 32, 3, 4, sprites[3], hero, ctx);
        hero.spriteIdle = new Sprite(32, 32, 1, 4, sprites[1], hero, ctx);

        elder.spriteUp = new Sprite(96, 32, 3, 4, sprites[4], elder, ctx);
        elder.spriteDown = new Sprite(96, 32, 3, 4, sprites[5], elder, ctx);
        elder.spriteLeft = new Sprite(96, 32, 3, 4, sprites[6], elder, ctx);
        elder.spriteRight = new Sprite(96, 32, 3, 4, sprites[7], elder, ctx);
        elder.spriteIdle = new Sprite(32, 32, 1, 4, sprites[5], elder, ctx);

        dragon.spriteUp = new Sprite(384, 96, 4, 10, sprites[8], dragon, ctx);
        dragon.spriteDown = new Sprite(384, 96, 4, 10, sprites[9], dragon, ctx);
        dragon.spriteLeft = new Sprite(384, 96, 4, 10, sprites[10], dragon, ctx);
        dragon.spriteRight = new Sprite(384, 96, 4, 10, sprites[11], dragon, ctx);
        dragon.spriteIdle = new Sprite(96, 96, 1, 10, sprites[9], dragon, ctx);
        dragon.getDestinationDelay = 500;

        elf.spriteUp = new Sprite(96, 32, 3, 4, sprites[12], elf, ctx);
        elf.spriteDown = new Sprite(96, 32, 3, 4, sprites[13], elf, ctx);
        elf.spriteLeft = new Sprite(96, 32, 3, 4, sprites[14], elf, ctx);
        elf.spriteRight = new Sprite(96, 32, 3, 4, sprites[15], elf, ctx);
        elf.spriteIdle = new Sprite(32, 32, 1, 4, sprites[13], elf, ctx);
        elf.getDestinationDelay = 300;

        bandit.spriteUp = new Sprite(96, 32, 3, 4, sprites[16], bandit, ctx);
        bandit.spriteDown = new Sprite(96, 32, 3, 4, sprites[17], bandit, ctx);
        bandit.spriteLeft = new Sprite(96, 32, 3, 4, sprites[18], bandit, ctx);
        bandit.spriteRight = new Sprite(96, 32, 3, 4, sprites[19], bandit, ctx);
        bandit.spriteIdle = new Sprite(32, 32, 1, 4, sprites[17], bandit, ctx);
        bandit.getDestinationDelay = 160;

        orc.spriteUp = new Sprite(96, 32, 3, 4, sprites[20], orc, ctx);
        orc.spriteDown = new Sprite(96, 32, 3, 4, sprites[21], orc, ctx);
        orc.spriteLeft = new Sprite(96, 32, 3, 4, sprites[22], orc, ctx);
        orc.spriteRight = new Sprite(96, 32, 3, 4, sprites[23], orc, ctx);
        orc.spriteIdle = new Sprite(32, 32, 1, 4, sprites[21], orc, ctx);
        orc.getDestinationDelay = 248;

        interactableObjects[0].spriteGlow = new Sprite(1700, 140, 10, 4, sprites[33], interactableObjects[0], ctx);
        interactableObjects[1].spriteGlow = new Sprite(1200, 100, 10, 4, sprites[34], interactableObjects[1], ctx);
        interactableObjects[2].spriteGlow = new Sprite(850, 100, 10, 4, sprites[35], interactableObjects[2], ctx);
        interactableObjects[3].spriteGlow = new Sprite(960, 40, 24, 2, sprites[36], interactableObjects[3], ctx);
        interactableObjects[4].spriteGlow = new Sprite(960, 40, 24, 2, sprites[37], interactableObjects[4], ctx);
        interactableObjects[5].spriteGlow = new Sprite(900, 135, 10, 4, sprites[38], interactableObjects[5], ctx);
        interactableObjects[6].spriteGlow = new Sprite(800, 100, 10, 4, sprites[39], interactableObjects[6], ctx);
    };

    // ==== Portrait preloader ==== //

    var preloadPortraits = function () {

        for (var i = 0; i < arguments.length; i++) {
            portraits[i] = new Image();
            portraits[i].src = arguments[i];
        }

        hero.setImage(portraits[0]);
        interactableObjects[3].setImage(portraits[1]);
        interactableObjects[2].setImage(portraits[2]);
        interactableObjects[1].setImage(portraits[3]);
        interactableObjects[0].setImage(portraits[4]);
        interactableObjects[5].setImage(portraits[5]);
        interactableObjects[4].setImage(portraits[6]);
        interactableObjects[6].setImage(portraits[7]);

    };
    var checkRequestAnimationFrame = function () {
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

    var preloadEverything = function () {
        addCheckPoints();
        loadMovableObjects();
        checkRequestAnimationFrame();

        /* all quests are available */
        interactableObjects[0].isAvailable = true;
        interactableObjects[1].isAvailable = true;
        interactableObjects[2].isAvailable = true;
        interactableObjects[3].isAvailable = true;
        interactableObjects[4].isAvailable = true;
        interactableObjects[5].isAvailable = true;
        interactableObjects[6].isAvailable = true;



        inventory.getItem('dagger');
        inventory.getItem('ring');
        inventory.getItem('sword');
        addEvents();


        preloadSprites(
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

        preloadPortraits(
    		'source/heroPortrait.png',
    		'source/elderPortrait.png',
    		'source/elfPortrait.png',
    		'source/dwarfPortrait.png',
    		'source/kingPortrait.png',
            'source/banditPortrait.png',
            'source/dragonPortrait.png',
            'source/orcPortrait.png'
    	);
        soundTrack.preloadMainSounds(
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
        mainLoop();
    }

}
