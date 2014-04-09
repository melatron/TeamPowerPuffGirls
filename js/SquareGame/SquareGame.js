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



    // defineDirection : (function () {
    //         if (this.duty === 'leader') {

    //             if (this.index == 0) {

    //                 this.direction = 'positive';

    //             } else {

    //                 this.direction = 'negative';

    //             };
    //         };

    // })(),

    updatePosition : function () {
        this.dom.animate({
            width: '26px',
            height: '26px',
            left: (this.x) * 40 + 15 + 'px',
            top: (this.y) * 40 + 15 + 'px',

        }, 300);
    },


    pickLeader : function (e) {
        console.log (e.data.direction)
        //console.log('leader picked at ' + e.data.x + ' ' + e.data.y );
            
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
            console.log (e.data.array.length)

        var mouseX = Math.floor((e.pageX - squareGame.mapBoundaries.left) / squareGame.squareWidth),
            mouseY = Math.floor((e.pageY - squareGame.mapBoundaries.top) / squareGame.squareWidth);
            
            
            
        if ( //(e.pageX > squareGame.mapBoundaries.left && e.pageX < squareGame.mapBoundaries.right) &&
                //(e.pageY > squareGame.mapBoundaries.top && e.pageY < squareGame.mapBoundaries.bottom) &&
            (mouseX !== e.data.x || mouseY !== e.data.y) && 
            ((mouseX >= (e.data.x - 1) && mouseX <= (e.data.x + 1) && mouseY == e.data.y) ||
            (mouseY >= (e.data.y - 1) && mouseY <= (e.data.y + 1) && mouseX == e.data.x)) &&
            (squareGame.firstMap[mouseY][mouseX] == 1)) {
                    

                    e.data.followLeader(e.data);
                    e.data.x = mouseX;
                    e.data.y = mouseY;
                    e.data.updatePosition();

                    squareGame.firstMap[mouseY][mouseX] =2;
                    //e.data.array.[e.data.array.length]
                   // console.log('leader placed at ' + e.data.x + ' ' + e.data.y );
            } else {
                e.data.updatePosition();
            };

        $('#square-game').unbind();
        $(e.data.dom).on( 'click', e.data, e.data.pickLeader);

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
            this.firstMap = [ [0, 0, 2, 2, 2, 2] ,
                              [2, 2, 2, 0, 0, 2] ,
                              [2, 0, 1, 0, 0, 2] ,
                              [2, 2, 1, 2, 2, 2] ,
                              [0, 2, 0, 2, 0, 0] ,
                              [1, 2, 1, 2, 2, 1] ]
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


