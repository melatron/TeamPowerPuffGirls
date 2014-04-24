var EmptySlot = Class.extend({
    init: function (x, y, n) {
        this.number = n;
        this.coordinates = {
            x: x,
            y: y,
        }
        this.size = {
            w: 60,
            h: 60,
        }
    },
    drawJewel: function (ctx) {

    }
});

var Jewel = EmptySlot.extend({
    init: function (x, y, n) {
        this._super(x, y, n);
        this.image = null;
        this.newCoordinates = {
            x: x,
            y: y
        };
    },
    
    drawJewel: function (ctx) {
        if (this.newCoordinates.x < this.coordinates.x) {
            this.newCoordinates.x += 5;
        }
        else if (this.newCoordinates.x > this.coordinates.x){
            this.newCoordinates.x -= 5;
        }
        if (this.newCoordinates.y < this.coordinates.y) {
            this.newCoordinates.y += 5;
        }
        else if (this.newCoordinates.y > this.coordinates.y) {
            this.newCoordinates.y -= 5;
        }
        ctx.drawImage(this.image,this.newCoordinates.x, this.newCoordinates.y, this.size.w, this.size.h);
    }
});
var EightPuzzle = Game.extend({
    init: function () {
        _this = this;
        this.canvasLoop = null;
        this.stopEvents = false;
        this.canvas = null;
        this.context = null;
        this.tableArray = new Array();
        this.emptySlotPosition = new Array();
        this.tableState = new TableState();
        this.gameOver = false;
        this.plot = $('#eightPuzzle');

        this.canvas = $("#eightPuzzleCanvas")[0];
        this.context = this.canvas.getContext("2d");

        this.animation = null;
        this.update = function () {
            _this.drawTableArray();
            if (_this.isGameOver()) {
                setTimeout(_this.endGame,700);
                cancelAnimationFrame(this.animation);
            }
            _this.animation = requestAnimationFrame(_this.update);
        };

    },
    start: function () {
        this.gameOver = false;
        this.addGameToPlot();
        this.createTableArray();
        this.getEmptySlot();
        $(document).on('keydown', this, this.listenKeyEvents);
        this.update();
    },
    endGame: function () {
        _this.gameOver = true;
        _this.removeGameFromPlot();
        _this.stopEvents = true;

    },
    addBonuses: function (bonuses) {

    },
    createTableArray: function () {
        var startArray = new Array(),
            x = 250,
            y = 20;
        var initialState = this.tableState.getRandomState();

        for (var i = 0; i < 3; i++) {
            this.tableArray[i] = new Array();
            for (var j = 0; j < 3; j++) {
                if (initialState[i][j] == 9) {
                    this.tableArray[i].push(new EmptySlot(x, y, initialState[i][j]));
                }
                else {
                    this.tableArray[i].push(new Jewel(x, y, initialState[i][j]));
                    this.tableArray[i][j].image = new Image();
                    this.tableArray[i][j].image.src = "source/" + initialState[i][j] + ".png";

                }
                x += 70;
            }
            y += 70;
            x = 250;
        }
    },
    drawTableArray: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                this.tableArray[i][j].drawJewel(this.context)
            }
        }
    },
    getEmptySlot: function () {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (!(this.tableArray[i][j] instanceof Jewel)) {
                    this.emptySlotPosition.push(i, j);
                }
            }
        }
    },
    swapFunction: function (a, b, c, d) {
        var swap;
        swap = this.tableArray[a][b];
        this.tableArray[a][b] = this.tableArray[c][d];
        this.tableArray[c][d] = swap;

        swap = this.tableArray[a][b].coordinates;
        this.tableArray[a][b].coordinates = this.tableArray[c][d].coordinates;
        this.tableArray[c][d].coordinates = swap;

        this.emptySlotPosition[0] = c;
        this.emptySlotPosition[1] = d;
    },
    swapTop: function () {
        var i = this.emptySlotPosition[0],
            j = this.emptySlotPosition[1];

        if (i - 1 >= 0) this.swapFunction(i, j, (i - 1), j);
    },
    swapBot: function (){
        var i = this.emptySlotPosition[0],
            j = this.emptySlotPosition[1];

        if (i + 1 <= 2) this.swapFunction(i, j, (i + 1), j);
    },
    swapLeft: function () {
        var i = this.emptySlotPosition[0],
            j = this.emptySlotPosition[1];

        if (j - 1 >=0) this.swapFunction(i, j, i, (j - 1));
    },
    swapRight: function () {
        var i = this.emptySlotPosition[0],
            j = this.emptySlotPosition[1];

        if (j + 1 <= 2) this.swapFunction(i, j, i, (j + 1));
    },
    isGameOver: function () {
        var gameOver = true;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.tableState.goalState[i][j] != this.tableArray[i][j].number) {
                    gameOver = false;
                }
            }
        }
        return gameOver;
    },
    listenKeyEvents: function (e) {
        console.log('hello');
        if (!e.data.stopEvents) {
            switch (e.keyCode) {
                case 37:
                    e.preventDefault();
                    e.data.swapRight();
                    break;
                case 38:
                    e.preventDefault();
                    e.data.swapBot();;
                    break;
                case 39:
                    e.preventDefault();
                    e.data.swapLeft();
                    break;
                case 40:
                    e.preventDefault();
                    e.data.swapTop();
                    break;
            }
        }
    }
});
