Square = Class.extend({

    init: function (x, y, color, duty, index) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.duty = duty;
        this.index = index;
        var that = this;

        this.dom = $('<div class="square"> </div>');
        this.dom.css({
            left: (this.x) * 40 + 15 + 'px',
            top: (this.y) * 40 + 15 + 'px',
            backgroundColor: this.color,            
        });


        if (this.duty === 'leader') {

            if (this.index == 0) {
                this.direction = 'positive';
            } else {
                this.direction = 'negative';
            };
        };


        if (this.duty === 'leader') {
            $(this.dom).on('click', this, this.pickLeader);
        };


        $(this.dom).appendTo($('#square-game'));
    },


    updatePosition : function () {
        this.dom.animate({
            width: '26px',
            height: '26px',
            left: (this.x) * 40 + 15 + 'px',
            top: (this.y) * 40 + 15 + 'px',
        }, 300);
    },


    pickLeader : function (e) {
        console.log (e.data.direction);
            
        e.data.dom.css({
            width: '30px',
            height: '30px',
            left: (e.data.x) * 40 + 13 + 'px',
            top: (e.data.y) * 40 + 13 + 'px',
        });
        $(e.data.dom).unbind();
        $('#square-game').on('mousedown', e.data, e.data.placeLeader)

    },


     placeLeader : function (e) {           

        var mouseX = Math.floor((e.pageX - squareGame.mapBoundaries.left) / squareGame.squareWidth),
            mouseY = Math.floor((e.pageY - squareGame.mapBoundaries.top) / squareGame.squareWidth);           
            
        if ((mouseX !== e.data.x || mouseY !== e.data.y) && 
            ((mouseX >= (e.data.x - 1) && mouseX <= (e.data.x + 1) && mouseY == e.data.y) ||
            (mouseY >= (e.data.y - 1) && mouseY <= (e.data.y + 1) && mouseX == e.data.x)) &&
            (squareGame.firstMap[mouseY][mouseX] == 1)) {                    

                    e.data.followLeader(e.data);
                    e.data.x = mouseX;
                    e.data.y = mouseY;
                    e.data.updatePosition();
                    squareGame.firstMap[mouseY][mouseX] =2;                   
            } else {
                e.data.updatePosition();
            };

        $('#square-game').unbind();
        e.data.dom.on( 'click', e.data, e.data.pickLeader);

    },



    followLeader : function (that) {
            console.log(that.direction);
            if (that.direction === 'positive') {

                squareGame.firstMap[that.array[that.array.length - 1].y][that.array[that.array.length -1].x] =1;

                for (var i = (that.array.length - 1) ; i > 0; i--) {
                    console.log('follow leader');
                    that.array[i].followNext(that.array[i - 1]);
                };
            }

            if (that.direction === "negative") {

                squareGame.firstMap[that.array[0].y][that.array[0].x] =1;

                for (var i = 0; i < (that.array.length - 1) ; i++) {
                    that.array[i].followNext(that.array[i + 1]);
                };
                
            };

    },

    followNext : function (nextObject) {
        
        this.x = nextObject.x;
        this.y = nextObject.y;
        this.updatePosition();
    }
});

var GreenSquare = Square.extend({

    init: function (x, y, color, duty, index) {
        this._super(x, y, color, duty, index);
        this.array = squareGame.greenSquares;
    }
});

var RedSquare = GreenSquare.extend({

    init: function (x, y, color, duty, index) {
        this._super(x, y, color, duty, index);
        this.array = squareGame.redSquares;
    },
});


var YellowSquare = GreenSquare.extend({

    init: function (x, y, color, duty, index) {
        this._super(x, y, color, duty, index);
        this.array = squareGame.yellowSquares;
    },

});




var SquareGame = Class.extend({

    squareWidth: 40,
    greenSquares: [],
    redSquares: [],
    yellowSquares: [],
    firstMap: [],

    init: function () {

        this.firstMap = [[0, 0, 2, 2, 2, 2],
                         [2, 2, 2, 0, 0, 2],
                         [2, 0, 1, 0, 0, 2],
                         [2, 2, 1, 2, 2, 2],
                         [0, 2, 0, 2, 0, 0],
                         [1, 2, 1, 2, 2, 1]],


        this.secondMap = [];


        this.mapBoundaries = {

            left: $('#square-game-map').offset().left,
            top: $('#square-game-map').offset().top,
            right: $('#square-game-map').offset().left + 260,
            bottom: $('#square-game-map').offset().top + 260
        };

    }, 

    createSquare: function ( x, y, color, duty, index) {
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
    },

    populateFirstMap : function () {
            
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
});


