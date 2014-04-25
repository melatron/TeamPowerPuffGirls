﻿var Square = Class.extend({   
    marginLeft: 204,
    marginTop: 9,

    init: function (x, y, color, duty, index) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.duty = duty;
        this.index = index;


        this.dom = $('<div class="square"> </div>');
        this.dom.css({
            left: (this.x) * 40 + this.marginLeft + 'px',
            top: (this.y) * 40 + this.marginTop + 'px',
        });

        if (this.duty === 'leader') {

            if (this.index == 0) {
                this.direction = 'positive';
            } else {
                this.direction = 'negative';
            };
        };

        $(this.dom).appendTo($('#square-game'));
    },


    updatePosition: function () {
        this.dom.animate({
            left: (this.x) * 40 + this.marginLeft + 'px',
            top: (this.y) * 40 + this.marginTop + 'px',
        }, 300);
    },

    followNext: function (nextObject) {
        this.x = nextObject.x;
        this.y = nextObject.y;
        this.updatePosition();
    }
});



var GreenSquare = Square.extend({

    init: function (x, y, color, duty, index) {
        this._super(x, y, color, duty, index);
        this.dom.addClass('green');
    }
});

var RedSquare = Square.extend({

    init: function (x, y, color, duty, index) {
        this._super(x, y, color, duty, index);
        this.dom.addClass('red');
    },

});

var YellowSquare = Square.extend({

    init: function (x, y, color, duty, index) {
        this._super(x, y, color, duty, index);
        this.dom.addClass('yellow');
    }
});

var BlueSquare = Square.extend({

    init: function (x, y, color, duty, index) {
        this._super(x, y, color, duty, index);
        this.dom.addClass('blue');
    }
});


var SquareGame = Game.extend({

    squareWidth: 40,
    marginLeft: 204,
    marginTop: 9,

    activeArray: null,
    greenSquares: [],
    redSquares: [],
    yellowSquares: [],
    blueSquares: [],
    currentMap: [],
    movesCounter: 0,
    activeLeader: null,


    init: function () {

        this._super();
        this.objectives = { moves: 300 };
        this.plot = $('#square-game');
        this.gameOver = false;

        this.firstMap = [[0, 0, 2, 2, 2, 2],
                         [2, 2, 2, 0, 0, 2],
                         [2, 0, 1, 0, 0, 2],
                         [2, 2, 1, 2, 2, 2],
                         [0, 2, 0, 2, 0, 0],
                         [1, 2, 1, 2, 2, 1]],


       this.secondMap = [[1, 1, 1, 1, 2, 1],
                         [0, 0, 0, 0, 2, 0],
                         [2, 2, 2, 2, 2, 0],
                         [0, 0, 1, 0, 2, 0],
                         [2, 2, 2, 2, 2, 1],
                         [2, 0, 0, 0, 0, 1]];


        this.defineMapBoundaries = function () {
            this.mapBoundaries = {
                left: $('#square-game-map').offset().left,
                top: $('#square-game-map').offset().top,

            };
        };

        this.plot.on('click', this, this.placeLeader);
    },


    addGameToPlot: function () {

        this.plot.fadeIn(1000, this.defineMapBoundaries());

    },

    pickLeader: function (e) {
        e.stopPropagation();
        e.data.gameContext.activeLeader = e.data.objectContext;

        // defines the array being moved
        if (e.data.objectContext.color === 'green') { e.data.gameContext.activeArray = e.data.gameContext.greenSquares }
        if (e.data.objectContext.color === 'red') { e.data.gameContext.activeArray = e.data.gameContext.redSquares }
        if (e.data.objectContext.color === 'yellow') { e.data.gameContext.activeArray = e.data.gameContext.yellowSquares }
        if (e.data.objectContext.color === 'blue') { e.data.gameContext.activeArray = e.data.gameContext.blueSquares }

        e.data.objectContext.dom.css({
            left: (e.data.objectContext.x) * e.data.gameContext.squareWidth + e.data.gameContext.marginLeft + 'px',
            top: (e.data.objectContext.y) * e.data.gameContext.squareWidth + e.data.gameContext.marginTop + 'px',
        });

        //$('.selected').removeClass('selected');
        e.data.objectContext.dom.addClass('selected');
       
    },


    placeLeader: function (e) {

        if (e.data.activeLeader !== null) {

            var mouseX = Math.floor((e.pageX - e.data.mapBoundaries.left) / e.data.squareWidth),
                mouseY = Math.floor((e.pageY - e.data.mapBoundaries.top) / e.data.squareWidth);

            if (((mouseX == e.data.activeLeader.x && mouseY == (e.data.activeLeader.y + 1)) ||
                (mouseX == e.data.activeLeader.x && mouseY == (e.data.activeLeader.y - 1)) ||
                (mouseX == (e.data.activeLeader.x + 1) && mouseY == e.data.activeLeader.y) ||
                (mouseX == (e.data.activeLeader.x - 1) && mouseY == e.data.activeLeader.y)) &&
                (e.data.currentMap[mouseY][mouseX] == 1)) {

                e.data.followLeader(e.data);
                e.data.activeLeader.x = mouseX;
                e.data.activeLeader.y = mouseY;
                e.data.activeLeader.updatePosition();
                e.data.currentMap[mouseY][mouseX] = 2;
                e.data.movesCounter++;

                e.data.checkLevelProgress();

            };

            e.data.activeLeader.dom.removeClass('selected');
        };
    },

    checkLevelProgress: function () {
        //====CHECKS IF THE FIRST MAP IS OVER====/
        if (this.currentMap == this.firstMap &&
             this.activeLeader.x == 5 && this.activeLeader.y == 5 && this.activeLeader.color == 'green') {

            this.plot.html(' ');
            this.populateSecondMap();
        };

        //====CHECKS IF THE SECOND MAP IS OVER====//
        if (this.currentMap == this.secondMap &&
            this.activeLeader.x == 0 &&
            this.activeLeader.y == 0 &&
            this.activeLeader.color == 'green') {

            this.endGame();
        }
    },

    followLeader: function (that) {
        var lastX,
            lastY;

        if (that.activeLeader.direction === 'positive') {
            //define the coordinates of the last element being moved
            lastX = that.activeArray[that.activeArray.length - 1].x;
            lastY = that.activeArray[that.activeArray.length - 1].y;

            that.currentMap[lastY][lastX] = 1;

            //itterate through all the elements of the current array and activate the 'followNext' method
            for (var i = (that.activeArray.length - 1) ; i > 0; i--) {
                that.activeArray[i].followNext(that.activeArray[i - 1]);
            };
        }


        if (that.activeLeader.direction === "negative") {

            lastX = that.activeArray[0].x;
            lastY = that.activeArray[0].y;

            that.currentMap[lastY][lastX] = 1;

            for (var i = 0; i < (that.activeArray.length - 1) ; i++) {
                that.activeArray[i].followNext(that.activeArray[i + 1]);
            };

        };

    },


    createSquare: function (x, y, color, duty, index) {
        var temp;
        if (color == 'green') {
            temp = new GreenSquare(x, y, color, duty, index);
            this.greenSquares.push(temp);
        };

        if (color == 'red') {
            temp = new RedSquare(x, y, color, duty, index);
            this.redSquares.push(temp);
        }

        if (color == 'yellow') {
            temp = new YellowSquare(x, y, color, duty, index);
            this.yellowSquares.push(temp);
        }

        if (color == 'blue') {
            temp = new BlueSquare(x, y, color, duty, index);
            this.blueSquares.push(temp);
        }

        if (temp.duty === 'leader') {
            temp.dom.on('click', { gameContext: this, objectContext: temp }, this.pickLeader);
        };
    },
    // working test
    drawPossibleMoves: function (objectContext) {

        var ctx = $('#square-game-map')[0].getContext('2d');
        ctx.beginPath();
        //ctx.strokeStyle = 'red';
        ctx.moveTo(objectContext.x * 40 + 20, (objectContext.y * 40 + 20));
        ctx.lineTo((objectContext.x + 1) * 40 + 20, objectContext.y * 40 + 20);
        ctx.stroke();

    },



    populateFirstMap: function () {

        this.currentMap = this.firstMap;


        this.createSquare(0, 1, 'green', 'leader', 0);
        this.createSquare(1, 1, 'green', 'filler', 1);
        this.createSquare(2, 1, 'green', 'leader', 2);
        this.createSquare(2, 0, 'red', 'leader', 0);
        this.createSquare(3, 0, 'red', 'filler', 1);
        this.createSquare(4, 0, 'red', 'filler', 2);
        this.createSquare(5, 0, 'red', 'filler', 3);
        this.createSquare(5, 1, 'red', 'filler', 4);
        this.createSquare(5, 2, 'red', 'filler', 5);
        this.createSquare(5, 3, 'red', 'filler', 6);
        this.createSquare(4, 3, 'red', 'filler', 7)
        this.createSquare(3, 3, 'red', 'filler', 8)
        this.createSquare(3, 4, 'red', 'filler', 9)
        this.createSquare(3, 5, 'red', 'filler', 10)
        this.createSquare(4, 5, 'red', 'leader', 11)
        this.createSquare(0, 2, 'yellow', 'leader', 0);
        this.createSquare(0, 3, 'yellow', 'filler', 1);
        this.createSquare(1, 3, 'yellow', 'filler', 2);
        this.createSquare(1, 4, 'yellow', 'filler', 3);
        this.createSquare(1, 5, 'yellow', 'leader', 5);
    },

    populateSecondMap: function () {
        this.plot.css('background-image', 'url(source/square-game-background2.png)')
        this.currentMap = this.secondMap;
        this.greenSquares = [];
        this.redSquares = [];
        this.yellowSquares = [];
        this.blueSquares = [];


        this.createSquare(4, 0, 'red', 'leader', 0);
        this.createSquare(4, 1, 'red', 'filler', 1);
        this.createSquare(4, 2, 'red', 'filler', 2);
        this.createSquare(4, 3, 'red', 'filler', 3);
        this.createSquare(4, 4, 'red', 'leader', 4);
        this.createSquare(0, 2, 'blue', 'leader', 0);
        this.createSquare(1, 2, 'blue', 'filler', 1);
        this.createSquare(2, 2, 'blue', 'filler', 2);
        this.createSquare(3, 2, 'blue', 'leader', 3);
        this.createSquare(0, 4, 'yellow', 'leader', 0);
        this.createSquare(0, 5, 'yellow', 'leader', 1);
        this.createSquare(1, 4, 'green', 'leader', 0);
        this.createSquare(2, 4, 'green', 'filler', 1);
        this.createSquare(3, 4, 'green', 'leader', 2);
    },

    endGame: function () {
        this.gameOver = true;
        this.plot.html(' ');
        this.removeGameFromPlot();
        this.score = (300 - this.movesCounter) * 10;

        if ((this.objectives.moves - this.gameBonuses.bonusMoves) < this.movesCounter) {
            this.getReward('sword');
        }
    },

    start: function () {
        this.calculateBonuses();
        this.addGameToPlot();
        this.populateFirstMap();
        setTimeout(this.defineMapBoundaries(), 3000);
    }
});
