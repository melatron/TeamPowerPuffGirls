function Preloader(){
    var sprites = [];
    var portraits = [];
    var gameSounds = [];
    var mainMusic = [];
    var questMusic = [];

    this.preloadEverything = function(){
        var a = ['music/Dirt.mp3',
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
            'music/ChaosCity.mp3'];

        for(var i = 0; i < a.length; i++){
            mainMusic[i] = new Audio();
            mainMusic[i].src = a[i];
        }
        
        var b = ['source/heroMoveUp.png',
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
                'source/PathFinder/yellowBoard.png',

                'source/square-glow.png',
                
                'source/dragonGlowSprite.png',
                'source/sound-on.png',]; //47

        for (var i = 0; i < b.length; i++) {  // create image objects and define src
            sprites[i] = new Image();
            sprites[i].src = b[i];
        }

        var c = ['source/heroPortrait.png',
            'source/elderPortrait.png',
            'source/elfPortrait.png',
            'source/dwarfPortrait.png',
            'source/kingPortrait.png',
            'source/banditPortrait.png',
            'source/dragonPortrait.png',
            'source/orcPortrait.png'];

        for (var i = 0; i < c.length; i++) {
            portraits[i] = new Image();
            portraits[i].src = c[i];
        }

        var d = [];

        for (var i = 0; i < d.length; i++){
            questMusic[i] = new Audio();
            questMusic[i].src = d[i];
        }

        var e = ['source/scroll.mp3'];

        for (var i = 0; i < e.length; i++){
            gameSounds[i] = new Audio();
            gameSounds[i].src = e[i];
        }
    };

    this.getGameSoundByIndex = function(index){
        return gameSounds[index];
    };

    this.getSpriteByIndex = function(index){
        return sprites[index];
    };

    this.getPortraitByIndex = function(index){
        return portraits[index];
    };

    this.returnMainMusicArrayCopy = function(){
        var copy = [],
            i,
            len = mainMusic.length;

        for(i = 0; i < len; i++){
            copy[i] = mainMusic[i];
        }

        return copy;
    };

    this.returnQuestMusicArrayCopy = function(){
        var copy = [],
            i,
            len = questMusic.length;
        for(i = 0; i < len; i++){
            copy[i] = sounds[i];
        }

        return copy;
    };
}




var preloader = (function () {

    var instance;
    var preloader = new Preloader();
    function createInstance() {
        // Here we will put the public methods which will be needed for the game
        var object = {
            preloadEverything: preloader.preloadEverything,
            getGameSoundByIndex: preloader.getGameSoundByIndex,
            getSpriteByIndex: preloader.getSpriteByIndex,
            getPortraitByIndex: preloader.getPortraitByIndex,
            returnMainMusicArrayCopy: preloader.returnMainMusicArrayCopy,
            returnQuestMusicArrayCopy: preloader.returnQuestMusicArrayCopy
        };
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
                return instance;
            }

            
        }
    };
})().getInstance();




/*
this.inventory.getItem('dagger');
        this.inventory.getItem('ring');
        this.inventory.getItem('sword');
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
*/