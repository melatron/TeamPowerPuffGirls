MoveableBox = Class.extend({
    init: function (p, x, y, w, h) {
        this.position = p;
        this.image = null;
        this.coordinates = {
            x: x,
            y: y,
        }
        this.size = {
            w: w,
            h: h,
        }
    },
    swapBox: function (position, nextPosition,that) {
        var position = position,
        nextPosition = nextPosition,
        swap;

        if (position >= 0 && position <=8) {
            swap = that.moveableBoxes[position];
            that.moveableBoxes[position] = that.moveableBoxes[nextPosition];
            that.moveableBoxes[nextPosition] = swap;

            swap = that.moveableBoxes[position].coordinates;
            that.moveableBoxes[position].coordinates = that.moveableBoxes[nextPosition].coordinates;
            that.moveableBoxes[nextPosition].coordinates = swap;
        }
    },
    drawBox: function (ctx) {
        //
    },
    isClicked: function (mouseX, mouseY) {
        if ((mouseX > this.coordinates.x && mouseX < (this.coordinates.x + this.size.w)) && (mouseY > this.coordinates.y && mouseY < (this.coordinates.y + this.size.h))) {
            return true;
        }
    }

});

MoveableEmptyBox = MoveableBox.extend({
    init: function (p, x, y, w, h) {
        this._super(p, x, y, w, h);
    },
    swapBox: function () {

    }
});
MoveableLeftBox = MoveableBox.extend({
    init: function (p, x, y, w, h) {
        this._super(p, x, y, w, h);
    },
    drawBox: function (ctx) {
        ctx.drawImage(this.image, this.coordinates.x, this.coordinates.y, this.size.w, this.size.h);
    }
});
MoveableRightBox = MoveableBox.extend({
    init: function (p, x, y, w, h) {
        this._super(p, x, y, w, h);
    },
    drawBox: function (ctx) {
        ctx.drawImage(this.image, this.coordinates.x, this.coordinates.y, this.size.w, this.size.h);
    }
});

SwapPuzzle = Game.extend({
    init: function () {
        this._super();
        this.moveableBoxes = []; 
        _self = this;
        this.canvas = null;       //$("#swapPuzzleCanvas");
        this.context = null;      //canvas.getContext("2d");
        this.background;
        this.reverseButton;
        this.swapPuzzleLoop;
        this.reverseParameters = null;
        this.plot = $('#swapPuzzle');
        this.stopEvents = true;
    },
    start: function (obj, getReward) {
        this._super(obj, getReward);
        this.getReward = getReward;
        this.stopEvents = false;
        this.reverseParameters = {
            position: [],
            lastPosition: [],
            reversesDone: 0
        }

        var instructions = 'Click on the gems to move them.Your goal is to swap their places.If you are stuck use the reverse button in top left corner.';
        this.writeOnScroll(instructions, {
            fontSize: '12px'
        });

        this.addGameToPlot();
        this.canvas = $("#swapPuzzleCanvas")[0];
        this.context = this.canvas.getContext("2d");
        this.createMoveableBoxes();
        this.preloadImages(
            "source/leftGem.png",
            "source/rightGem.png",
            "source/puzzleBackground.png",
            "source/reverse_button.png"
            );
        this.swapPuzzleLoop = setInterval(this.puzzleswapPuzzleLoop, 30);
    },
    addEventListeners: function () {
        $("#swapPuzzleCanvas").on('click', this, this.checkIfClicked);
    },
    endGame: function () {
        this.gameOver = true;
        this.stopEvents = true;
        this.removeGameFromPlot();
        clearInterval(this.swapPuzzleLoop);
        $("#swapPuzzleCanvas").off();

        this.score = (this.reverseParameters.reversesDone) ?
            Math.floor(500 / this.reverseParameters.reversesDone) : 750;

        // add condition : if you've done well in the game get the reward
        if (this.score > 499) {
            this.getReward('ring');
        }
    },
    addBonuses: function (bonuses) {
    
    },
    createMoveableBoxes: function () {
        var x = 5,
            y = 70,
            w = 65,
            h = 100;
        for (var i = 0; i < 9; i++) {
            if (i < 4) {
                this.moveableBoxes[i] = new MoveableRightBox(i, x, y, w, h);
                x += 70;
            }
            else if (i == 4) {
                this.moveableBoxes[i] = new MoveableEmptyBox(i, x, y, w, h);
                x += 70;
            }
            else if (i > 4) {
                this.moveableBoxes[i] = new MoveableLeftBox(i, x, y, w, h);
                x += 70;
            }
        }
    },
    onClick: function (p) {
        var direction, OpType, position = p;

        if (this.moveableBoxes[position] instanceof MoveableLeftBox) {
            direction =-1;
            OpType = MoveableRightBox;
        } else {
            direction = 1;
            OpType = MoveableLeftBox;
        }
        //get the directionection of my clicked box and oposite type
        if (this.moveableBoxes[position + direction] instanceof MoveableEmptyBox) {                                      /*next element is empty*/
            this.moveableBoxes[position].swapBox(position,position + direction,this);                                         //object move one time
            this.reverseParameters.position.unshift(position + direction);
            this.reverseParameters.lastPosition.unshift(position);
        }
        else if (this.moveableBoxes[position + direction] instanceof OpType) {
            if (this.moveableBoxes[position + direction + direction] instanceof MoveableEmptyBox) {                            /*element after oposite element is empty*/
                this.moveableBoxes[position].swapBox(position,position + 2*direction,this);                                  //object move two times
                this.reverseParameters.position.unshift(position + 2*direction);
                this.reverseParameters.lastPosition.unshift(position);
            }
        }
    },
    checkIfClicked: function (ev) {
        if (!ev.data.stopEvents) {
            var rect = ev.data.canvas.getBoundingClientRect(),
                mouseX = ev.clientX - rect.left,
                mouseY = ev.clientY - rect.top;

            console.log("Mouse X: " + mouseX + " Mouse Y: " + mouseY);

            if ((mouseX > 0 && mouseX < (0 + 20)) && (mouseY > 0 && mouseY < (0 + 20))) {
                ev.data.reverseSwap();
            }
            else {
                for (var i = 0; i < ev.data.moveableBoxes.length; i++) {  // check if clicked
                    if (ev.data.moveableBoxes[i].isClicked(mouseX, mouseY)) {
                        ev.data.onClick(i);
                        if (ev.data.moveableBoxes[i] instanceof MoveableRightBox) {
                            console.log(ev.data.moveableBoxes[i]);
                        }
                        console.log(i);
                    }
                }
            }
        }
    },
    reverseSwap: function () {
        var n = this.reverseParameters.reversesDone,
            i = this.reverseParameters.position[0],
            j = this.reverseParameters.lastPosition[0];

        this.moveableBoxes[i].swapBox(i, j,this);
        this.reverseParameters.reversesDone += 1;
        this.reverseParameters.position.splice(0, 1);
        this.reverseParameters.lastPosition.splice(0, 1);
    },
    preloadImages: function (left, right,background,reverseButton) {
        for (var i = 0; i < this.moveableBoxes.length; i++) {
            if (i < 4) {
                this.moveableBoxes[i].image = new Image();
                this.moveableBoxes[i].image.src = left;
            } else if (i > 4) {
                this.moveableBoxes[i].image = new Image();
                this.moveableBoxes[i].image.src = right;
            }
        }
        this.background = new Image();
        this.background.src = background;
        this.reverseButton = new Image();
        this.reverseButton.src = reverseButton;
    },
    drawBoxes: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //this.context.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.reverseButton, 0, 0,20,20);

        for (var i = 0; i < this.moveableBoxes.length; i++) {
            this.moveableBoxes[i].drawBox(this.context);
        }
    },
    isGameOver: function () {
        if (this.moveableBoxes[3].position == 8 && this.moveableBoxes[5].position == 0) {
            this.endGame();
        }
    },

    puzzleswapPuzzleLoop: function () {
        _self.drawBoxes();
        _self.isGameOver();
    },

})

