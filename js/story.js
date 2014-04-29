


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
        finishGame = null,
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
            ctx.restore();
            animation = requestAnimationFrame(mainLoop);
            if (storyEnded) {
                drawEndScreen();
            };
           
            drawButtons();
    };

    var inventory = new Inventory();
    

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
               ['Well sire, this', 'is the only part', ' of the chambers i have', 'any pleasure in visiting.', ' *His look accidentally wanders', 'at the queens dormitory*'],
               ['Oh, theres nothing tiresome', ' about it your highness.']],
               after: [["Hell yes!", "I still got it!"]],
               done: [["Oh, well ..."]]
           },
           {                  //QUEST SPEECH
               before: [['...'], ['Rise and spare me the',' pleasantries, i am in no mood', ' for your groveling.'],
                   ['Would you be so kind', 'as to explain',' what you are doing', 'in the royal chambers',' at this time of day?'],
               ['You wouldnt have', 'happened to have heard', 'some rather disturbingly', ' loud moaning sounds', ' while you were walking', 'around the chambers,','did you?'],
               ['I didnt mention that they', ' were coming from this', ' side "Insert name here".'],
               ['Dont you get tired', 'of visiting the same', 'rooms over and over?', ' "said the king with', 'a spiteful tone"'],
               ['Why you insolent wench!', 'GUARDS!! Take this arrogant', 'sard to the dungeons, i shall', ' be there as soon as i figure', ' a proper form of', 'punishment!']],
               after: [["After him!", "AFTER HIM, YOU FOOLS !!"]],
               done: [["You! Off to the prison with you, ", "scumbag!"]]
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
               before: [["A taller and more ", "handsome version of ", "your father!"],["I come seeking refuge in ", "your local tavern and to ", "earn some coin, won't be ", "any trouble of course."],["Thank you.", "I will be on my way then."],["I am always up for a challenge,", "especially if it involves coins ", "and profit."]],
               after: [["Well, I am too modest to boast. ", "Who is this person you speak of? ", "Where can they be found?"], ["Alright, I hope this is ", "not just a wild ", "goose chase."]],
               done: [["Piece of cake!"]]
           },
           {                  //QUEST SPEECH
               before: [["Hold!", "Who goes there?"],["Why you son of a ", "motherless ogre!! Speak your ", "business before I leave ", "you tongueless!"],["Aye, fine... You better not ", "be causing any. The Irongate ", "watch will have you out on your face ",  "in the mud before you even ", "try anything!"],
                        ["Before you go laddy, ", "I challenge you to play a game to prove your worth. ", "I might be able to point you ", "in the right direction if you ", "wish to make some profit.", "That is, should you succeed."],["Okay, ", "here is what you have ", "to do..."]],
               after: [["Well well, I am impressed... ", "Few people have ever completed the challenge. ", "Perhaps there is someone who ", "might make use of your talents ", "after all."],["There is a wizard, ", "he is not far from this place. ", "Travel south and you should be ", "able to find him, or rather ", "he will likely find you."]],
               done: [["Want another go at my challenge?", "Go ahead, I dare you!"]]
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
               before: [["I only want a small piece, ", "just enough to slay a ", "dragon with it."], ["There must be a way ", "I can get a small piece, ", "surely?"], ["*The hero simply proceeds to ", "quickly chop off a small ", "piece and starts running ", "as the elves begin to ", "chase*"]],
               after: [["Thanks for the tinder, ", "bitchachos!!!"]],
               done: [["Uhh..", " not ... me?"], ["Uh oh ..."]]
           },
           {                  //QUEST SPEECH
               before: [["Defiler!! ", "Get away from our ", "sacred tree!!"], ["Stand back or you will ", "suffer the consequences."], ["Don't you dare.."]],
               after: [["Be gone and never ", "come back to these lands ", "or it will be your ", "last!"]],
               done: [["What was that!?"], ["GET HIM !!"]]
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
               before: [["Who the heck are you? ", "Turn off the lights and ", "special effects!"], ["Too long, did not listen. ", "You are the wizard ", "I assume?"],
                        ["I seek passage through ", "these lands and I was told that ", "you might be able to pay me, ", "provided that I assist you with ", "some chore?"], ["Do I have to ", "kill someone?"],
                        ["You want me to kill the ", "dragon that has been flying ", "around?"], ["*Laughs with an amused look ", "on his face* Well okay then, ", "I guess I will be going..."],
                        ["How do you want me to ", "slay a dragon, when ", "the royal guards could not ", "do it?"]],
               after: [["So what now? ", "We have the magical ", "hocus-pocus stone. ", "How does that help?"], ["What?"], ["Here we go again."]],
               done: [["..."], ["What's up, ol'timer?"], ["Ugh .. sure."]]
           },
           {                  //QUEST SPEECH
               before: [["You there, ", "yes you!"], ["Much courage lays in you. ", "Hidden underneath a shell ", "of selfishness it is."], ["Depends on what you ", "mean by wizard, for some I am ", "simply a crazy old hobo ", "with a staff."],
                        ["If it is coin you seek, ", "then maybe your sword can speak. ", "There is a small task that you ", "might be able to aid me with."], ["Not someone, something. ", "You have no doubt heard of ", "the dragon, have you not?"],
                        ["Why yes, there is ", "good coin involved for ", "brave dragon slayers such as ", "yourself."], ["*The mage summons a large and ", "thick wall of ice, blocking ", "the path of the hero.* ", "Please, do consider my ", "offer."],
                        ["First you must help me ", "merge the stones of a ", "thousand truths."]],
               after: [["I am glad I did not ", "misjudge you. You did well ", "merging the stones!"], ["Now that we know you are ", "not a complete imbecile when it comes ", "to magic, there is one more thing ", "that needs to be done before ", "you face the dragon."],
                       ["Travel you must, to the ",  "land of the elves. There you will need to ", "chop off a small piece from their ", "sacred tree for the next part of ", "the plan. *The mage ", "suddenly vanishes*"]],
               done: [["BOO!"], ["Oh, it's *you* ..."], ["I need help with ", "my stones again.", "Care to help?"]]
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
                before: [[""]],
                after: [[""]],
                done: [[""]]
            },
           {                  //QUEST SPEECH
               before: [[""]],
               after: [[""]],
               done: [[""]]
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
                before: [["Is that any way to ", "treat an old friend?"], ["I came for practice, ", "I need training."]],
                after: [["The dragon will not be ", "as hospitable as you guys."], ["Farewell my friend, ", "I will see you around!"]],
                done: [["This is gonna be", " interesting .."]]
            },
           {                  //QUEST SPEECH
               before: [["You've got a lot of ", "guts coming back here."], ["Why are you here you scumbag? ", "Even the people in this place ", "aren't fond of you and that ", "is saying something."],
                        ["Practice? Well I guess", " we can help you out ", "for old times sake.", "*The bandit winks at ", "the two guards to open the ", "gates to the training grounds", "for the hero*."]],
               after: [["Just like old times. ", "I hope it was not too ", "hard for you?"], ["Dragon? What dragon? ", "You did not say anything about ", "a dragon!?"]],
               done: [["Want another go?", "Step right up!"]]
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
                    after: [["I guess I'm a pro when", "it comes to valuables ..."],["Uhh .. see you later,", "I guess .. you brain-dead orc"], ["*Starts running*"]],
                    done: [["Woah, what happened??"], ["*sigh*", "Let me see ..."]]
                },
               {                  //QUEST SPEECH
                   before: [["Hey old friend! it's been","a while since you","last came here, hm?"], ["Hahaha! You need", "money? Am I Right?"], ["I don't want to hear about", "it! If you help me with those", " gems I'll give you money.."], ],
                   after: [["Woah! I've been banging my ", "ugly head for hours over", "those gems."], ["*Kogat seems too entices ", "with his gems to remember you", "were ever there.*"], ["What was that?"]],
                   done: [["*crying*"], ["*sobs*", "My gems .. they are all ", "messed up again", "*sobs*"]]
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
            drawEndScreen();
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

        server.isHighScore(finalScore);

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
            if (Math.pow(temp.circle.x - mousePos.x, 2) + Math.pow(temp.circle.y - mousePos.y, 2) = Math.pow(temp.circle.r, 2)) {
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

        //var yolo = new Bossfight();
        //yolo.start();
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