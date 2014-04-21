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
        this.stopEvents = false;
        this.length = 4;
        this.plot = $("#Game6561");
        this.multiplyBy = 2;
        this.matrix = [[0, 0, 0, 0],
                       [0, 0, 0, 0],
                       [0, 0, 0, 0],
                       [0, 0, 0, 0]];
    },
    start: function () {
        this.addGameToPlot();
        this.putStartingNumbers();
        this.addEvents();
    },
    endGame: function () {
        this.gameOver = true;
        this.removeGameFromPlot();
        this.stopEvents = true;
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
                        console.log(zeroes);
                        if (this.checkIfBoxCanMove(i, j)) {
                            isOver = false;
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
            setTimeout(function () { self.stopEvents = false; }, 50);
        }, 180);
        if (zeroes <= 0) {
            this.gameOver = isOver;
        }
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
            }
        }
    },
    addEvents: function () {
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
            this.show();
            this.proceedToNextTurn();
            console.log("-----------------");
            this.show();
            console.log("-----------------");
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

///////////////////////////////////////////
//function Gamez() {
//    // Here we will implement the game
//    var this = this,
//        this.length = 4,
//        multiplyBy = 2,
//        gameEnd = false,
//        gameLost = false;
//    this.matrix = [[0, 0, 0, 0],
//                      [0, 0, 0, 0],
//                      [0, 0, 0, 0],
//                      [0, 0, 0, 0]];
//
//    this.putFirstTwoRandomNumbers = function () {
//        var randomRowFirst = Math.floor((Math.random() * 4)),
//            randomColFirst = Math.floor((Math.random() * 4)),
//            randomDigitFirst = Math.random() < 0.9 ? 2 : 4,
//
//            randomRowSecond = Math.floor((Math.random() * 4)),
//            randomColSecond = Math.floor((Math.random() * 4)),
//            randomDigitSecond = Math.random() < 0.9 ? 2 : 4;
//
//        this.matrix[randomRowFirst][randomColFirst] = new Node(randomColFirst, randomRowFirst, randomDigitFirst);
//        this.matrix[randomRowFirst][randomColFirst].addToCell();
//        this.matrix[randomRowSecond][randomColSecond] = new Node(randomColSecond, randomRowSecond, randomDigitSecond);
//        this.matrix[randomRowSecond][randomColSecond].addToCell();
//    };
//    this.countZeroes = function () {
//        var zeroes = 0;
//        for (var i = 0; i < 4; i++) {
//            for (var j = 0; j < 4; j++) {
//                if (this.matrix[i][j] == 0) { zeroes++; };
//            }
//        }
//        return zeroes;
//    };
//    this.checkIfBoxCanMove = function (row, col) {
//        var array = this.matrix,
//            canMoveUp = false,
//            canMoveLeft = false,
//            canMoveRight = false,
//            canMoveDown = false;
//        if (array[row][col] != 0) {
//            var value = array[row][col].value;
//            if ((typeof array[row][col + 1] == "object" && array[row][col + 1].value == value) || array[row][col + 1] == 0) {
//                canMoveRight = true;
//            }
//            if ((typeof array[row][col - 1] == "object" && array[row][col - 1].value == value) || array[row][col - 1] == 0) {
//                canMoveLeft = true;
//            }
//            if (typeof array[row + 1] != "undefined") {
//                if ((typeof array[row + 1][col] == "object" && array[row + 1][col].value == value) || array[row + 1][col] == 0) {
//                    canMoveDown = true;
//                }
//            }
//            if (typeof array[row - 1] != "undefined") {
//                if ((typeof array[row - 1][col] == "object" && array[row - 1][col].value == value) || array[row - 1][col] == 0) {
//                    canMoveUp = true;
//                }
//            }
//            if (canMoveDown || canMoveLeft || canMoveRight || canMoveUp) {
//                return true;
//            }
//            return false;
//        }
//    };
//    this.putRandomNumber = function () {
//        var zeroes = this.countZeroes(),
//            rand = Math.floor((Math.random() * zeroes)) + 1,
//            zeroCounter = 0,
//            randomDigit = Math.random() < 0.9 ? 2 : 4,
//            isOver = true;
//        for (var i = 0; i < 4; i++) {
//            for (var j = 0; j < 4; j++) {
//                if (this.matrix[i][j] == 0) {
//                    zeroCounter++;
//                    if (zeroCounter == rand) {
//                        this.matrix[i][j] = new Node(j, i, randomDigit);
//                        this.matrix[i][j].addToCell();
//                    }
//                }
//                else {
//                    if (zeroes <= 0 && isOver) {
//                        console.log(zeroes);
//                        if (this.checkIfBoxCanMove(i, j)) {
//                            isOver = false;
//                        }
//                    }
//                    this.matrix[i][j].unitedOnTurn = false;
//                }
//            }
//        }
//        if (zeroes <= 0) {
//            gameLost = isOver;
//        }
//        
//    };
//    this.show = function () {
//       var msg1 = "",
//           msg2 = "",
//           msg3 = "",
//           msg4 = "";
//       for (var i = 0; i < this.length; i++) {
//           for (var j = 0 ; j < this.length; j++) {
//               switch (i) {
//                   case 0:
//                       if (this.matrix[i][j] != 0) {
//                           msg1 += this.matrix[i][j].value + " ";
//                       }
//                       else {
//                           msg1 += 0 + " "
//                       }
//                       break;
//                   case 1:
//                       if (this.matrix[i][j] != 0) {
//                           msg2 += this.matrix[i][j].value + " ";
//                       }
//                       else {
//                           msg2 += 0 + " "
//                       }
//                       break;                      
//                   case 2:
//                       if (this.matrix[i][j] != 0) {
//                           msg3 += this.matrix[i][j].value + " ";
//                       }
//                       else {
//                           msg3 += 0 + " "
//                       }
//                       break;                      
//                   case 3:
//                       if (this.matrix[i][j] != 0) {
//                           msg4 += this.matrix[i][j].value + " ";
//                       }
//                       else {
//                           msg4 += 0 + " "
//                       }
//                       break;
//                   default:
//                       break;
//               }
//           }
//       }
//       console.log(msg1);
//       console.log(msg2);
//       console.log(msg3);
//       console.log(msg4);
//   };
//    this.endGame = function () {
//        this.endGame = true;
//        console.log("GOOD GAME!");
//    };
//    this.move = function (direction) {
//        if (gameLost) {
//            this.endGame();
//        }
//        else {
//            switch (direction) {
//                case "left":
//                    for (var i = 0; i < this.length; i++) {
//                        this.moveLeftByRowBETA(i);
//                    };
//                    break;
//                case "right":
//                    for (var i = 0; i < this.length; i++) {
//                        this.moveRightByRowBETA(i);
//                    };
//                    break;
//                case "up":
//                    for (var i = 0; i < this.length; i++) {
//                        this.moveUpByColBETA(i);
//                    };
//                    break;
//                case "down":
//                    for (var i = 0; i < this.length; i++) {
//                        this.moveDownByColBETA(i);
//                    };
//                    break;
//                default:
//                    break;
//
//            }
//            this.show();
//            this.putRandomNumber();
//            console.log("-----------------");
//            this.show();
//            console.log("-----------------");
//        }
//    };
//     /*[[0, 0, 0, 0],
//        [0, 0, 0, 0],
//        [0, 0, 0, 0],
//        [0, 0, 0, 0]];*/
//    this.moveElement = function (element, moving) {
//        var col = element.col,
//            row = element.row;
//        switch (moving) {
//            case "left":
//                this.matrix[row][col] = 0;
//                this.matrix[row][col - 1] = element;
//                element.moveLeft();
//                break;
//            case "right":
//                this.matrix[row][col] = 0;
//                this.matrix[row][col + 1] = element;
//                element.moveRight();
//                break;
//            case "up":
//                this.matrix[row][col] = 0;
//                this.matrix[row - 1][col] = element;
//                element.moveUp();
//                break;
//            case "down":
//                this.matrix[row][col] = 0;
//                this.matrix[row + 1][col] = element;
//                element.moveDown();
//            default:
//                break;
//
//        }
//    };
//    this.uniteElements = function (newNode, current, moving) {
//        this.matrix[current.row][current.col] = 0;
//        this.matrix[newNode.row][newNode.col] = newNode;
//    };
//    this.moveNode = function(node, row, col) {
//        node.movedTo = {
//            row: row,
//            col: col
//        };
//        this.matrix[row][col] = node;
//        this.matrix[node.row][node.col] = 0;
//    };
//    this.mergeNode = function (node, row, col) {
//        node.mergedTo = {
//            row: row,
//            col: col
//        };
//        this.matrix[row][col] = node;
//        this.matrix[node.row][node.col] = 0;
//        node.powerUpValue();
//    }
//    this.moveLeftByRowBETAa = function (row) {
//        var col = 0,
//            currentNode = -1,
//            lastZeroIndex = -1,
//            i = 0,
//            previous = 0,
//            flag = true;
//        for (col; col < this.length; col++) {
//            lastZeroIndex = -1;
//            flag = true;
//            currentNode = this.matrix[row][col];
//            if (currentNode != 0) {
//                i = col - 1;
//                while (flag) {
//                    if (i < 0) {
//                        if (lastZeroIndex != -1) {
//                            this.moveNode(currentNode, row, lastZeroIndex);
//                        }
//                        flag = false;
//                        break;
//                    }
//                    previous = this.matrix[row][i];
//                    if (previous == 0) {
//                        lastZeroIndex = i;
//                    }
//                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
//                        this.mergeNode(currentNode, row, i);
//                        flag = false;
//                    }
//                    else {
//                        if (lastZeroIndex != -1) {
//                            this.moveNode(currentNode, row, lastZeroIndex);
//                        }
//                        flag = false;
//                    }
//                    i--;
//                };
//            }
//        }
//    };
//
//    this.moveLeftByRowBETA = function (row) {
//        var col = 0,
//            moving = "left",
//            currentNode = -1,
//            i = 0,
//            previous = 0,
//            flag = true;
//        for (col; col < this.length; col++) {
//            flag = true;
//            currentNode = this.matrix[row][col];
//            if (currentNode != 0) {
//                // [2,0,0,2]
//                i = col - 1;
//                while (flag) {
//                    if (i < 0) {
//                        flag = false;
//                        break;
//                    }
//                    previous = this.matrix[row][i];
//                    if (previous == 0) {
//                        this.moveElement(currentNode, moving);
//                    }
//                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
//                        
//                        var newNode = currentNode.unite(previous);
//                        this.uniteElements(newNode, currentNode, moving);
//                    }
//                    else {
//                        flag = false;
//                    }
//                    i--;
//                };
//            }
//        }
//    };
//    this.moveRightByRowBETA = function (row) {
//        var col = 3,
//            moving = "right",
//            currentNode = -1,
//            i = 3,
//            previous = 0,
//            flag = true;
//        for (col; col >= 0; col--) {
//            flag = true;
//            currentNode = this.matrix[row][col];
//            if (currentNode != 0) {
//                // [2,0,0,2]
//                i = col + 1;
//                while (flag) {
//                    
//                    if (i > 3) {
//                        flag = false;
//                        break;
//                    }
//                    previous = this.matrix[row][i];
//                    if (previous == 0) {
//                        this.moveElement(currentNode, moving);
//                    }
//                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
//                        var newNode = currentNode.unite(previous);
//                        this.uniteElements(newNode, currentNode, moving);
//                    }
//                    else {
//                        flag = false;
//                    }
//                    i++;
//                };
//            }
//        }
//    };
//    this.moveRightByRowBETAa = function (row) {
//        var col = 3,
//            moving = "right",
//            currentNode = -1,
//            i = 3,
//            previous = 0,
//            flag = true,
//            lastZeroIndex = -1;
//        for (col; col >= 0; col--) {
//            lastZeroIndex = -1;
//            flag = true;
//            currentNode = this.matrix[row][col];
//            if (currentNode != 0) {
//                i = col + 1;
//                while (flag) {
//                    if (i > 3) {
//                        if (lastZeroIndex != -1) {
//                            this.moveNode(currentNode, row, lastZeroIndex);
//                        }
//                        flag = false;
//                        break;
//                    }
//                    previous = this.matrix[row][i];
//                    if (previous == 0) {
//                        lastZeroIndex = i;
//                    }
//                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
//                        this.mergeNode(currentNode, row, i);
//                        flag = false;
//                    }
//                    else {
//                        if (lastZeroIndex != -1) {
//                            this.moveNode(currentNode, row, lastZeroIndex);
//                        }
//                        flag = false;
//                    }
//                    i++;
//                };
//            }
//        }
//    };
//  
//    this.moveUpByColBETA = function (col) {
//        var row = 0,
//            moving = "up",
//            currentNode = -1,
//            i = 0,
//            previous = 0,
//            flag = true;
//        for (row; row < this.length; row++) {
//            flag = true;
//            currentNode = this.matrix[row][col];
//            if (currentNode != 0) {
//                i = row - 1;
//                while (flag) {
//                    if (i < 0) {
//                        flag = false;
//                        break;
//                    }
//                    previous = this.matrix[i][col];
//                    if (previous == 0) {
//                        this.moveElement(currentNode, moving);
//                    }
//                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
//                        
//                        var newNode = currentNode.unite(previous);
//                        this.uniteElements(newNode, currentNode, moving);
//                    }
//                    else {
//                        flag = false;
//                    }
//                    i--;
//                };
//            }
//        }
//    };
//    this.moveUpByColBETAa = function (col) {
//        var row = 0,
//            moving = "up",
//            currentNode = -1,
//            i = 0,
//            previous = 0,
//            flag = true,
//            lastZeroIndex = -1;
//        for (row; row < this.length; row++) {
//            lastZeroIndex = -1;
//            flag = true;
//            currentNode = this.matrix[row][col];
//            if (currentNode != 0) {
//                i = row - 1;
//                while (flag) {
//                    if (i < 0) {
//                        if (lastZeroIndex != -1) {
//                            this.moveNode(currentNode, lastZeroIndex, col);
//                        }
//                        flag = false;
//                        break;
//                    }
//                    previous = this.matrix[i][col];
//                    if (previous == 0) {
//                        lastZeroIndex = i;
//                    }
//                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
//                        this.mergeNode(currentNode, i, col);
//                        flag = false;
//                    }
//                    else {
//                        if (lastZeroIndex != -1) {
//                            this.moveNode(currentNode, lastZeroIndex, col);
//                        }
//                        flag = false;
//                    }
//                    i--;
//                };
//            }
//        }
//    };
//    this.moveDownByColBETA = function (col) {
//        var row = 3,
//            moving = "down",
//            currentNode = -1,
//            i = 3,
//            previous = 0,
//            flag = true;
//        for (row; row >= 0; row--) {
//            flag = true;
//            currentNode = this.matrix[row][col];
//            if (currentNode != 0) {
//                // [2,0,0,2]
//                i = row + 1;
//                while (flag) {
//
//                    if (i > 3) {
//                        flag = false;
//                        break;
//                    }
//                    previous = this.matrix[i][col];
//                    if (previous == 0) {
//                        this.moveElement(currentNode, moving);
//                    }
//                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
//                        var newNode = currentNode.unite(previous);
//                        this.uniteElements(newNode, currentNode, moving);
//                    }
//                    else {
//                        flag = false;
//                    }
//                    i++;
//                };
//            }
//        }
//    };
//    this.moveDownByColBETAa = function (col) {
//        var row = 3,
//            moving = "down",
//            currentNode = -1,
//            i = 3,
//            previous = 0,
//            flag = true;
//            lastZeroIndex = -1;
//            for (row; row >= 0; row--) {
//                flag = true;
//                lastZeroIndex = -1;
//                currentNode = this.matrix[row][col];
//                if (currentNode != 0) {
//                    i = row + 1;
//                    while (flag) {
//                        if (i > 3) {
//                            if (lastZeroIndex != -1) {
//                                this.moveNode(currentNode, lastZeroIndex, col);
//                            }
//                            flag = false;
//                            break;
//                        }
//                        previous = this.matrix[i][col];
//                        if (previous == 0) {
//                            lastZeroIndex = i;
//                        }
//                        else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
//                            this.mergeNode(currentNode, i, col);
//                            flag = false;
//                        }
//                        else {
//                            if (lastZeroIndex != -1) {
//                                this.moveNode(currentNode, lastZeroIndex, col);
//                            }
//                            flag = false;
//                        }
//                        i++;
//                };
//            }
//        }
//    };

//    this.moveLeftByRow = function (row) {
//        var col = 0,
//            firstNodeCol = -1,
//            firstFreeSpaceCol = -1,
//            currentNode = -1;

//        for (col; col < this.length; col++) {
//            currentNode = this.matrix[row][col];
//            if (currentNode == 0 && firstFreeSpaceCol == -1) {
//                firstFreeSpaceCol = col;
//                continue;
//            }
//            else if (currentNode == 0) {
//                continue;
//            }
//            else if (firstFreeSpaceCol == -1 && firstNodeCol == -1) {
//                firstNodeCol = col;
//                continue;
//            }
//            else if (firstNodeCol == -1) {
//                this.matrix[row][col] = 0;
//                this.matrix[row][firstFreeSpaceCol] = currentNode;
//                firstNodeCol = firstFreeSpaceCol;
//                firstFreeSpaceCol += 1;
//            }
//            else {
//                if (this.matrix[row][firstNodeCol] != currentNode) {
//                    if (firstFreeSpaceCol != -1) {
//                        this.matrix[row][firstFreeSpaceCol] = currentNode;
//                        firstNodeCol = firstFreeSpaceCol;
//                        this.matrix[row][col] = 0;
//                        firstFreeSpaceCol += 1;
//                    }
//                    else {
//                        firstNodeCol = col;
//                    }
//                }
//                else {
//                    this.matrix[row][firstNodeCol] *= multiplyBy;
//                    this.matrix[row][col] = 0;
//                    firstFreeSpaceCol = firstNodeCol + 1;
//                }
//            }
//        }
//    };
//    this.moveRightByRow = function (row) {
//        var col = 3,
//            firstNodeCol = -1,
//            firstFreeSpaceCol = -1,
//            currentNode = -1;

//        for (col; col >= 0; col--) {
//            currentNode = this.matrix[row][col];
//            if (currentNode == 0 && firstFreeSpaceCol == -1) {
//                firstFreeSpaceCol = col;
//                continue;
//            }
//            else if (currentNode == 0) {
//                continue;
//            }
//            else if (firstFreeSpaceCol == -1 && firstNodeCol == -1) {
//                firstNodeCol = col;
//                continue;
//            }
//            else if (firstNodeCol == -1) {
//                this.matrix[row][col] = 0;
//                this.matrix[row][firstFreeSpaceCol] = currentNode;
//                firstNodeCol = firstFreeSpaceCol;
//                firstFreeSpaceCol -= 1;
//            }
//            else {
//                if (this.matrix[row][firstNodeCol] != currentNode) {
//                    if (firstFreeSpaceCol != -1) {
//                        this.matrix[row][firstFreeSpaceCol] = currentNode;
//                        firstNodeCol = firstFreeSpaceCol;
//                        this.matrix[row][col] = 0;
//                        firstFreeSpaceCol -= 1;
//                    }
//                    else {
//                        firstNodeCol = col;
//                    }
//                }
//                else {
//                    this.matrix[row][firstNodeCol] *= multiplyBy;
//                    this.matrix[row][col] = 0;
//                    firstFreeSpaceCol = firstNodeCol - 1;
//                }
//            }
//        }
//    };
//    this.moveDownByCol = function (col) {
//        var row = 3,
//            firstNodeRow = -1,
//            firstFreeSpaceRow = -1,
//            currentNode = -1;

//        for (row; row >= 0; row--) {
//            currentNode = this.matrix[row][col];
//            if (currentNode == 0 && firstFreeSpaceRow == -1) {
//                firstFreeSpaceRow = row;
//                continue;
//            }
//            else if (currentNode == 0) {
//                continue;
//            }
//            else if (firstFreeSpaceRow == -1 && firstNodeRow == -1) {
//                firstNodeRow = row;
//                continue;
//            }
//            else if (firstNodeRow == -1) {
//                this.matrix[row][col] = 0;
//                this.matrix[firstFreeSpaceRow][col] = currentNode;
//                firstNodeRow = firstFreeSpaceRow;
//                firstFreeSpaceRow -= 1;
//            }
//            else {
//                if (this.matrix[firstNodeRow][col] != currentNode) {
//                    if (firstFreeSpaceRow != -1) {
//                        this.matrix[firstFreeSpaceRow][col] = currentNode;
//                        firstNodeRow = firstFreeSpaceRow;
//                        this.matrix[row][col] = 0;
//                        firstFreeSpaceRow -= 1;
//                    }
//                    else {
//                        firstNodeRow = row;
//                    }
//                }
//                else {
//                    this.matrix[firstNodeRow][col] *= multiplyBy;
//                    this.matrix[row][col] = 0;
//                    firstFreeSpaceRow = firstNodeRow - 1;
//                }
//            }
//        }
//    };
//    this.moveUpByCol = function (col) {
//        var row = 0,
//            firstNodeRow = -1,
//            firstFreeSpaceRow = -1,
//            currentNode = -1;

//        for (row; row < this.length; row++) {
//            currentNode = this.matrix[row][col];
//            if (currentNode == 0 && firstFreeSpaceRow == -1) {
//                firstFreeSpaceRow = row;
//                continue;
//            }
//            else if (currentNode == 0) {
//                continue;
//            }
//            else if (firstFreeSpaceRow == -1 && firstNodeRow == -1) {
//                firstNodeRow = row;
//                continue;
//            }
//            else if (firstNodeRow == -1) {
//                this.matrix[row][col] = 0;
//                this.matrix[firstFreeSpaceRow][col] = currentNode;
//                firstNodeRow = firstFreeSpaceRow;
//                firstFreeSpaceRow += 1;
//            }
//            else {
//                if (this.matrix[firstNodeRow][col] != currentNode) {
//                    if (firstFreeSpaceRow != -1) {
//                        this.matrix[firstFreeSpaceRow][col] = currentNode;
//                        firstNodeRow = firstFreeSpaceRow;
//                        this.matrix[row][col] = 0;
//                        firstFreeSpaceRow += 1;
//                    }
//                    else {
//                        firstNodeRow = row;
//                    }
//                }
//                else {
//                    this.matrix[firstNodeRow][col] *= multiplyBy;
//                    this.matrix[row][col] = 0;
//                    firstFreeSpaceRow = firstNodeRow + 1;
//                }
//            }
//        }
//    };
//}