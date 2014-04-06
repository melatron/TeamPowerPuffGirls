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


        this.defineDirection = (function () {
            if (that.duty === 'leader') {

                if (that.index == 0) {

                    that.direction = 'positive';

                } else {

                    that.direction = 'negative';

                };
            };

        })();


        this.updatePosition = function () {
            this.dom.animate({
                width: '26px',
                height: '26px',
                left: (this.x) * 40 + 15 + 'px',
                top: (this.y) * 40 + 15 + 'px',

            }, 300);
        };


        this.pickLeader = function () {
            console.log('aa');
            
            that.dom.css({
                width: '30px',
                height: '30px',
                left: (that.x) * 40 + 13 + 'px',
                top: (that.y) * 40 + 13 + 'px',
            });
            $(that.dom).unbind();
            $('#square-game').on('mousedown', that.placeLeader)

        };

        this.placeLeader = function (e) {
            
            var mouseX = Math.floor((e.pageX - squareGame.mapBoundaries.left) / squareGame.squareWidth),
                mouseY = Math.floor((e.pageY - squareGame.mapBoundaries.top) / squareGame.squareWidth);

            console.log(mouseX + ':x/mouse/y:' + mouseY);
            console.log(that.x + ':x/y:' + that.y);
            
            if ( //(e.pageX > squareGame.mapBoundaries.left && e.pageX < squareGame.mapBoundaries.right) &&
                //(e.pageY > squareGame.mapBoundaries.top && e.pageY < squareGame.mapBoundaries.bottom) &&
                 (mouseX !== that.x || mouseY !== that.y) && 
                 (mouseX >= (that.x - 1) && mouseX <= (that.x + 1)) && (mouseY >= (that.y - 1) && mouseY <= (that.y + 1)) &&
                 (squareGame.firstMap[mouseY][mouseX] == 1)) {
                    console.log('ok')
                        that.followLeader();
                        that.x = mouseX;
                        that.y = mouseY;
                        that.updatePosition();
                } else {
                    that.updatePosition();
                };

            $('#square-game').unbind();
            $(that.dom).on('click', that.pickLeader);

        };

        this.followNext = function (nextObject) {
            
            this.x = nextObject.x;
            this.y = nextObject.y;
            this.updatePosition();

        };

        this.followLeader = function () {
            console.log('ac');
            if (that.direction === 'positive') {
                for (var i = (that.array.length - 1) ; i > 0; i--) {
                    that.array[i].followNext(that.array[i - 1]);
                };
            }

            if (that.direction === "negative") {
                for (var i = 0; i < (that.array.length - 1) ; i++) {
                    that.array[i].followNext(that.array[i + 1]);
                }
            };



            /* if (that.currentIndex <= that.maxIndex && that.direction === 'positive') {
                 that.currentIndex++;
                 object.followLeader(Game.greenSquares[that.currentIndex]);
             } else {
                 if (that.direction === 'positive' && that.currentIndex > that.maxIndex) {
                     that.currentIndex = that.maxIndex;
                 };
             };

             if (that.direction === 'negative' && that.currentIndex >= that.maxIndex) {
                 that.currentIndex--;
                 object.followLeader(Game.greenSquares[that.currentIndex]);
             } else {
                 if (that.direction === 'negative' && that.currentIndex < that.maxIndex) {
                     that.currentIndex = that.maxIndex;
                 };
             }*/


        };

        if (this.duty === 'leader') {
            $(this.dom).on('click', this.pickLeader);
        };

        $(this.dom).appendTo($('#square-game'));
    },
});

var GreenSquare = Square.extend({
    init: function (x, y, color, duty, index) {
        this._super(x, y, color, duty, index);
        this.array = squareGame.greenSquares;
        var that = this;


    }
});

var RedSquare = GreenSquare.extend({
    init: function (x, y, color, duty, index) {
        this._super(x, y, color, duty, index);
        this.array = squareGame.redSquares;
        var that = this;

    },
});


var YellowSquare = GreenSquare.extend({
    init: function (x, y, color, duty, index) {
        this._super(x, y, color, duty, index);
        this.array = squareGame.yellowSquares;
        var that = this;

    },

});




var SquareGame = Class.extend({

    squareWidth: 40,
    greenSquares: [],
    redSquares: [],
    yellowSquares: [],
    firstMap: [],
    init: function () {
        this.drawMaps = function () {
            this.firstMap = [ [0, 0, 1, 1, 1, 1] ,
                              [1, 1, 1, 0, 0, 1] ,
                              [1, 0, 1, 0, 0, 1] ,
                              [1, 1, 1, 1, 1, 1] ,
                              [0, 1, 0, 1, 0, 0] ,
                              [1, 1, 1, 1, 1, 1] ]
        };

        this.mapBoundaries = (function() {
            var object = {};
            object.left = $('#square-game-map').offset().left;
            object.top = $('#square-game-map').offset().top;
            object.right = $('#square-game-map').offset().left + 260;
            object.bottom = $('#square-game-map').offset().top + 260;
            return object;
        })();

        this.populateMap = function () {
            var temp;
            temp = new GreenSquare(0, 1, 'green', 'leader', 0);
            this.greenSquares.push(temp);

            temp = new GreenSquare(1, 1, 'green', 'filler', 1);
            this.greenSquares.push(temp);

            temp = new GreenSquare(2, 1, 'green', 'leader', 2);
            this.greenSquares.push(temp);

            temp = new RedSquare(2, 0, 'red', 'leader', 0);
            this.redSquares.push(temp);

            temp = new RedSquare(3, 0, 'red', 'filler', 1);
            this.redSquares.push(temp);

            temp = new RedSquare(4, 0, 'red', 'filler', 2);
            this.redSquares.push(temp);

            temp = new RedSquare(5, 0, 'red', 'filler', 3);
            this.redSquares.push(temp);

            temp = new RedSquare(5, 1, 'red', 'filler', 4)
            this.redSquares.push(temp);

            temp = new RedSquare(5, 2, 'red', 'filler', 5)
            this.redSquares.push(temp);

            temp = new RedSquare(5, 3, 'red', 'filler', 6)
            this.redSquares.push(temp);

            temp = new RedSquare(4, 3, 'red', 'filler', 7)
            this.redSquares.push(temp);

            temp = new RedSquare(3, 3, 'red', 'filler', 8)
            this.redSquares.push(temp);

            temp = new RedSquare(3, 4, 'red', 'filler', 9)
            this.redSquares.push(temp);

            temp = new RedSquare(3, 5, 'red', 'filler', 10)
            this.redSquares.push(temp);

            temp = new RedSquare(4, 5, 'red', 'leader', 11)
            this.redSquares.push(temp);

            temp = new YellowSquare(0, 2, 'yellow', 'leader', 0);
            this.yellowSquares.push(temp);

            temp = new YellowSquare(0, 3, 'yellow', 'filler', 1);
            this.yellowSquares.push(temp);

            temp = new YellowSquare(1, 3, 'yellow', 'filler', 2);
            this.yellowSquares.push(temp);

            temp = new YellowSquare(1, 4, 'yellow', 'filler', 3);
            this.yellowSquares.push(temp);

            temp = new YellowSquare(1, 5, 'yellow', 'leader', 5);
            this.yellowSquares.push(temp);
        };

    },

});


