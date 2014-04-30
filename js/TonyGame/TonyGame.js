/*Game = Class.extend({
    init: function () {
        this.gameOver = false;
        this.objectives = null;
        this.score = null;
        this.plot = null;

    },
    start: function () {

    },
    endGame: function () {

    },
    addBonuses: function (bonuses) {

    },
    addGameToPlot: function () {
        plot.show();
    },
    removeGameFromPlot: function () {
        plot.hide();
    }


});*/
TonyGame = Game.extend({
    init: function () {
        this._super();
        //this.scroll = $('#scroll');
        this.stopEvents = true;
        this.length = 4;
        //this.score = 0;
        this.highestValue = 4;
        this.plot = $("#Game6561");
        this.multiplyBy = 2;
        this.matrix = [[0, 0, 0, 0],
                       [0, 0, 0, 0],
                       [0, 0, 0, 0],
                       [0, 0, 0, 0]];
    },
    start: function (obj) {
        this._super(obj);
        var instructions = 'Use the arrow keys to merge the equivalent stones!';
        this.writeOnScroll(instructions, {
            fontSize: '17px'
        });
        this.stopEvents = false;
        this.addGameToPlot();
        this.putStartingNumbers();
        //this.addEventListeners();
    },
    endGame: function () {
        this.gameOver = true;
        this.removeGameFromPlot();
        this.stopEvents = true;
        this.matrix = [[0, 0, 0, 0],
                       [0, 0, 0, 0],
                       [0, 0, 0, 0],
                       [0, 0, 0, 0]];

        this.score = this.highestValue;
        this.highestValue = 4;
        this.removeNodes();

        // add condition : if you've done well in the game get the reward
        if (this.score >= 300) {
            this.rewardItem = 'dagger';
        }
    },
    addBonuses: function (bonuses) {

    },
    checkIfBoxCanMove: function (row, col) {
        var array = this.matrix,
            canMoveUp = false,
            canMoveLeft = false,
            canMoveRight = false,
            canMoveDown = false;
        if (array[row][col] != 0) {
            var value = array[row][col].value;
            if ((typeof array[row][col + 1] == "object" && array[row][col + 1].value == value) || array[row][col + 1] == 0) {
                canMoveRight = true;
            }
            if ((typeof array[row][col - 1] == "object" && array[row][col - 1].value == value) || array[row][col - 1] == 0) {
                canMoveLeft = true;
            }
            if (typeof array[row + 1] != "undefined") {
                if ((typeof array[row + 1][col] == "object" && array[row + 1][col].value == value) || array[row + 1][col] == 0) {
                    canMoveDown = true;
                }
            }
            if (typeof array[row - 1] != "undefined") {
                if ((typeof array[row - 1][col] == "object" && array[row - 1][col].value == value) || array[row - 1][col] == 0) {
                    canMoveUp = true;
                }
            }
            if (canMoveDown || canMoveLeft || canMoveRight || canMoveUp) {
                return true;
            }
            return false;
        }
    },
    putStartingNumbers: function () {
        var randomRowFirst = Math.floor((Math.random() * 4)),
            randomColFirst = Math.floor((Math.random() * 4)),
            randomDigitFirst = Math.random() < 0.9 ? 2 : 4,
            randomRowSecond = Math.floor((Math.random() * 4)),
            randomColSecond = Math.floor((Math.random() * 4)),
            randomDigitSecond = Math.random() < 0.9 ? 2 : 4;
        while (randomRowSecond == randomRowFirst && randomColSecond == randomColFirst) {
            randomRowSecond = Math.floor((Math.random() * 4));
            randomColSecond = Math.floor((Math.random() * 4));
        };

        this.matrix[randomRowFirst][randomColFirst] = new Node(randomColFirst, randomRowFirst, randomDigitFirst);
        this.matrix[randomRowFirst][randomColFirst].addToCell();
        this.matrix[randomRowSecond][randomColSecond] = new Node(randomColSecond, randomRowSecond, randomDigitSecond);
        this.matrix[randomRowSecond][randomColSecond].addToCell();
    },
    countZeroes: function () {
        var zeroes = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.matrix[i][j] == 0) { zeroes++; };
            }
        }
        return zeroes;
    },
    moveNode: function (node, row, col) {
        node.movedTo = {
            row: row,
            col: col
        };
        this.matrix[row][col] = node;
        this.matrix[node.row][node.col] = 0;
    },
    mergeNode: function (from, to) {
        if (to.movedTo == null) {
            from.mergedTo = {
                row: to.row,
                col: to.col,
                node: to
            };
            this.matrix[to.row][to.col] = from;
            this.matrix[from.row][from.col] = 0;
            from.powerUpValue();
            from.unitedOnTurn = true;
            from.animateNew = true;
        }
        else {
            from.mergedTo = {
                row: to.movedTo.row,
                col: to.movedTo.col,
                node: to
            };
            this.matrix[to.movedTo.row][to.movedTo.col] = from;
            this.matrix[from.row][from.col] = 0;
            from.powerUpValue();
            from.unitedOnTurn = true;
        }
        
    },
    proceedToNextTurn: function () {
        
        var zeroes = this.countZeroes(),
            rand = Math.floor((Math.random() * zeroes)) + 1,
            zeroCounter = 0,
            randomDigit = Math.random() < 0.9 ? 2 : 4,
            isOver = true;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.matrix[i][j] == 0) {
                    zeroCounter++;
                    if (zeroCounter == rand) {
                        this.matrix[i][j] = new Node(j, i, randomDigit);
                        //this.matrix[i][j].addToCell();
                    }
                }
                else {
                    if (zeroes <= 0 && isOver) {
                        //console.log(zeroes);
                        if (this.checkIfBoxCanMove(i, j)) {
                            isOver = false;
                        }
                    }
                    if (this.matrix[i][j].value > this.highestValue) {
                        this.highestValue = this.matrix[i][j].value;
                        if (this.highestValue == 1024) {
                            this.endGame();
                        }
                    }
                    this.matrix[i][j].proceed();
                }
            }
        }
        var self = this;
        setTimeout(function () {
            self.removeNodes();
            self.addNodes();
            setTimeout(function () {
                self.stopEvents = false;
                if (zeroes <= 0) {
                    self.gameOver = isOver;
                    if (self.gameOver) {

                        self.endGame();
                    }
                }
            }, 50);
        }, 180);
        
    },
    listenKeyEvents: function (e) {
        if (!e.data.stopEvents) {
            switch (e.keyCode) {
                case 37:
                    e.preventDefault();
                    e.data.move("left");
                    break;
                case 38:
                    e.preventDefault();
                    e.data.move("up");
                    break;
                case 39:
                    e.preventDefault();
                    e.data.move("right");
                    break;
                case 40:
                    e.preventDefault();
                    e.data.move("down");
                    break;
                case 89:
                    e.data.endGame();
                    break;
            }
        }
    },
    addEventListeners: function () {
        $(document).on("keydown", this, this.listenKeyEvents);
    },
    move: function (direction) {
        //$(document).off();
        this.stopEvents = true;
        if (this.gameOver) {
            this.endGame();
        }
        else {
            switch (direction) {
                case "left":
                    for (var i = 0; i < this.length; i++) {
                        this.moveLeftByRow(i);
                    };
                    break;
                case "right":
                    for (var i = 0; i < this.length; i++) {
                        this.moveRightByRow(i);
                    };
                    break;
                case "up":
                    for (var i = 0; i < this.length; i++) {
                        this.moveUpByCol(i);
                    };
                    break;
                case "down":
                    for (var i = 0; i < this.length; i++) {
                        this.moveDownByCol(i);
                    };
                    break;
                default:
                    break;
            }
           //this.show();
           this.proceedToNextTurn();
           //console.log("-----------------");
           //this.show();
           //console.log("-----------------");
        }
    },
    goLeft: function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.matrix[i][j] != 0) {
                    this.matrix[i][j].proceed();
                }
            }
        }
    },
    goRight: function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 3; j >= 0; j--) {
                if (this.matrix[i][j] != 0) {
                    this.matrix[i][j].proceed();
                }
            }
        }
    },
    goUp: function () {
        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 4; i++) {
                if (this.matrix[i][j] != 0) {
                    this.matrix[i][j].proceed();
                }
            }
        }
    },
    goDown: function () {
        for (var j = 0; j < 4; j++) {
            for (var i = 3; i >= 0; i--) {
                if (this.matrix[i][j] != 0) {
                    this.matrix[i][j].proceed();
                }
            }
        }
    },
    removeNodes: function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.matrix[i][j] != 0) {
                    this.matrix[i][j].removeFromCell();
                }
                $(".row").eq(i).find(".cell").eq(j).empty();
            }
        }
    },
    addNodes: function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.matrix[i][j] != 0) {
                    this.matrix[i][j].addToCell();
                }
            }
        }
    },
    moveLeftByRow: function (row) {
        var col = 0,
            currentNode = -1,
            lastZeroIndex = -1,
            i = 0,
            previous = 0,
            flag = true;
        for (col; col < this.length; col++) {
            lastZeroIndex = -1;
            flag = true;
            currentNode = this.matrix[row][col];
            if (currentNode != 0) {
                i = col - 1;
                while (flag) {
                    if (i < 0) {
                        if (lastZeroIndex != -1) {
                            this.moveNode(currentNode, row, lastZeroIndex);
                        }
                        flag = false;
                        break;
                    }
                    previous = this.matrix[row][i];
                    if (previous == 0) {
                        lastZeroIndex = i;
                    }
                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
                        this.mergeNode(currentNode, previous);
                        flag = false;
                    }
                    else {
                        if (lastZeroIndex != -1) {
                            this.moveNode(currentNode, row, lastZeroIndex);
                        }
                        flag = false;
                    }
                    i--;
                };
            }
        }
    },
    moveUpByCol: function (col) {
        var row = 0,
            moving = "up",
            currentNode = -1,
            i = 0,
            previous = 0,
            flag = true,
            lastZeroIndex = -1;
        for (row; row < this.length; row++) {
            lastZeroIndex = -1;
            flag = true;
            currentNode = this.matrix[row][col];
            if (currentNode != 0) {
                i = row - 1;
                while (flag) {
                    if (i < 0) {
                        if (lastZeroIndex != -1) {
                            this.moveNode(currentNode, lastZeroIndex, col);
                        }
                        flag = false;
                        break;
                    }
                    previous = this.matrix[i][col];
                    if (previous == 0) {
                        lastZeroIndex = i;
                    }
                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
                        this.mergeNode(currentNode, previous);
                        flag = false;
                    }
                    else {
                        if (lastZeroIndex != -1) {
                            this.moveNode(currentNode, lastZeroIndex, col);
                        }
                        flag = false;
                    }
                    i--;
                };
            }
        }
    },
    moveRightByRow: function (row) {
        var col = 3,
            moving = "right",
            currentNode = -1,
            i = 3,
            previous = 0,
            flag = true,
            lastZeroIndex = -1;
        for (col; col >= 0; col--) {
            lastZeroIndex = -1;
            flag = true;
            currentNode = this.matrix[row][col];
            if (currentNode != 0) {
                i = col + 1;
                while (flag) {
                    if (i > 3) {
                        if (lastZeroIndex != -1) {
                            this.moveNode(currentNode, row, lastZeroIndex);
                        }
                        flag = false;
                        break;
                    }
                    previous = this.matrix[row][i];
                    if (previous == 0) {
                        lastZeroIndex = i;
                    }
                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
                        this.mergeNode(currentNode, previous);
                        flag = false;
                    }
                    else {
                        if (lastZeroIndex != -1) {
                            this.moveNode(currentNode, row, lastZeroIndex);
                        }
                        flag = false;
                    }
                    i++;
                };
            }
        }
    },
    moveDownByCol: function (col) {
        var row = 3,
            moving = "down",
            currentNode = -1,
            i = 3,
            previous = 0,
            flag = true;
        lastZeroIndex = -1;
        for (row; row >= 0; row--) {
            flag = true;
            lastZeroIndex = -1;
            currentNode = this.matrix[row][col];
            if (currentNode != 0) {
                i = row + 1;
                while (flag) {
                    if (i > 3) {
                        if (lastZeroIndex != -1) {
                            this.moveNode(currentNode, lastZeroIndex, col);
                        }
                        flag = false;
                        break;
                    }
                    previous = this.matrix[i][col];
                    if (previous == 0) {
                        lastZeroIndex = i;
                    }
                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
                        this.mergeNode(currentNode, previous);
                        flag = false;
                    }
                    else {
                        if (lastZeroIndex != -1) {
                            this.moveNode(currentNode, lastZeroIndex, col);
                        }
                        flag = false;
                    }
                    i++;
                };
            }
        }
    },
    show: function () {
           var msg1 = "",
               msg2 = "",
               msg3 = "",
               msg4 = "";
           for (var i = 0; i < this.length; i++) {
               for (var j = 0 ; j < this.length; j++) {
                   switch (i) {
                       case 0:
                           if (this.matrix[i][j] != 0) {
                               msg1 += this.matrix[i][j].value + " ";
                           }
                           else {
                               msg1 += 0 + " "
                           }
                           break;
                       case 1:
                           if (this.matrix[i][j] != 0) {
                               msg2 += this.matrix[i][j].value + " ";
                           }
                           else {
                               msg2 += 0 + " "
                           }
                           break;                      
                       case 2:
                           if (this.matrix[i][j] != 0) {
                               msg3 += this.matrix[i][j].value + " ";
                           }
                           else {
                               msg3 += 0 + " "
                           }
                           break;                      
                       case 3:
                           if (this.matrix[i][j] != 0) {
                               msg4 += this.matrix[i][j].value + " ";
                           }
                           else {
                               msg4 += 0 + " "
                           }
                           break;
                       default:
                           break;
                   }
               }
           }
           console.log(msg1);
           console.log(msg2);
           console.log(msg3);
           console.log(msg4);
       }

});

