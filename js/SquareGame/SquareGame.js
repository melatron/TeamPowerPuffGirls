Square = Class.extend({

    init: function (x, y, color, duty, index) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.duty = duty;
        this.index = index;
        

        this.dom = $('<div class="square"> </div>');
        this.dom.css({
            left: (this.x) * 40 + 15 + 'px',
            top: (this.y) * 40 + 15 + 'px',
           //backgroundColor: this.color,
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
            width: '26px',
            height: '26px',
            left: (this.x) * 40 + 15 + 'px',
            top: (this.y) * 40 + 15 + 'px',
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

    activeArray: null,
    squareWidth: 40,
    greenSquares: [],
    redSquares: [],
    yellowSquares: [],
    blueSquares:[],
    currentMap: [],
    movesCounter: 0,


    init: function () {
        this._super();

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
                right: $('#square-game-map').offset().left + 260,
                bottom: $('#square-game-map').offset().top + 260
            };
        };
    },


    pickLeader: function (e) {
        // define the array being moved
        if (e.data.objectContext.color === 'green') { e.data.gameContext.activeArray = e.data.gameContext.greenSquares }
        if (e.data.objectContext.color === 'red') { e.data.gameContext.activeArray = e.data.gameContext.redSquares }
        if (e.data.objectContext.color === 'yellow') { e.data.gameContext.activeArray = e.data.gameContext.yellowSquares }
        if (e.data.objectContext.color === 'blue') { e.data.gameContext.activeArray = e.data.gameContext.blueSquares }

        e.data.objectContext.dom.css({
            width: '30px',
            height: '30px',
            left: (e.data.objectContext.x) * 40 + 13 + 'px',
            top: (e.data.objectContext.y) * 40 + 13 + 'px',
        });

        $(e.data.objectContext.dom).unbind();
        e.data.gameContext.plot.on('mousedown', e.data, e.data.gameContext.placeLeader);
        e.data.gameContext.drawPossibleMoves(e.data.objectContext);
    },


    placeLeader: function (e) {

        var mouseX = Math.floor((e.pageX - e.data.gameContext.mapBoundaries.left) / e.data.gameContext.squareWidth),
            mouseY = Math.floor((e.pageY - e.data.gameContext.mapBoundaries.top) / e.data.gameContext.squareWidth);

        if ((mouseX !== e.data.objectContext.x || mouseY !== e.data.objectContext.y) &&
            ((mouseX >= (e.data.objectContext.x - 1) && mouseX <= (e.data.objectContext.x + 1) && mouseY == e.data.objectContext.y) ||
            (mouseY >= (e.data.objectContext.y - 1) && mouseY <= (e.data.objectContext.y + 1) && mouseX == e.data.objectContext.x)) &&
            (e.data.gameContext.currentMap[mouseY][mouseX] == 1)) {

            e.data.gameContext.followLeader(e.data);
            e.data.objectContext.x = mouseX;
            e.data.objectContext.y = mouseY;
            e.data.objectContext.updatePosition();
            e.data.gameContext.currentMap[mouseY][mouseX] = 2;
            e.data.gameContext.movesCounter++;


            //====CHECKS IF THE FIRST MAP IS OVER====//
            if (e.data.gameContext.currentMap == e.data.gameContext.firstMap &&
                mouseX == 5 && mouseY == 5 && e.data.objectContext.color == 'green') {

                console.log('first map is over in ' + e.data.gameContext.movesCounter + ' moves');
                e.data.gameContext.plot.html(' ');
                e.data.gameContext.populateSecondMap();
            };

            //====CHECKS IF THE SECOND MAP IS OVER====//
            if (e.data.gameContext.currentMap == e.data.gameContext.secondMap &&
                mouseX == 0 && mouseY == 0 && e.data.objectContext.color == 'green') {

                console.log('good game in ' + e.data.gameContext.movesCounter + ' moves!');
                e.data.gameContext.endGame();
            }



        } else {
            e.data.objectContext.updatePosition();
        };

        e.data.gameContext.plot.unbind();
        e.data.objectContext.dom.on('click', e.data, e.data.gameContext.pickLeader);

    },


    followLeader: function (that) {
        var leaderX,
            leaderY;

        if (that.objectContext.direction === 'positive') {
            //define the coordinates of the leader being followed
            leaderX = that.gameContext.activeArray[that.gameContext.activeArray.length - 1].x;
            leaderY = that.gameContext.activeArray[that.gameContext.activeArray.length - 1].y;

            that.gameContext.currentMap[leaderY][leaderX] = 1;

            //itterate through all the elements of the current array and activate the 'followNext' method
            for (var i = (that.gameContext.activeArray.length - 1) ; i > 0; i--) {                
                that.gameContext.activeArray[i].followNext(that.gameContext.activeArray[i - 1]);
            };
        }


        if (that.objectContext.direction === "negative") {

            leaderX = that.gameContext.activeArray[0].x;
            leaderY = that.gameContext.activeArray[0].y;

            that.gameContext.currentMap[leaderY][leaderX] = 1;

            for (var i = 0; i < (that.gameContext.activeArray.length - 1) ; i++) {
                that.gameContext.activeArray[i].followNext(that.gameContext.activeArray[i + 1]);
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
    drawPossibleMoves : function (objectContext) {
        
        var ctx = $('#square-game-map')[0].getContext('2d');
        ctx.beginPath();
        //ctx.strokeStyle = 'red';
        ctx.moveTo(objectContext.x*40+20 , (objectContext.y*40 + 20));
        ctx.lineTo((objectContext.x+1)*40+20, objectContext.y*40 + 20);
        ctx.stroke();
        console.log(objectContext.x);
    },



    populateFirstMap: function () {

        this.currentMap = this.firstMap;
        this.addGameToPlot();
        this.defineMapBoundaries();

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
    },

    start: function () {
        this.addGameToPlot();
        this.populateFirstMap();
    }
});



/*  
    linear-gradient(to left bottom, #5A607A 44%, #BEB5FF 100%);
    */