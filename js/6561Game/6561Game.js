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
        this.plot = $("#Game6561");
        this.multiplyBy = 2;
        this.gameArray = [[0, 0, 0, 0],
                          [0, 0, 0, 0],
                          [0, 0, 0, 0],
                          [0, 0, 0, 0]];
    },
    start: function () {
        this.addGameToPlot();
        this.putStartingNumbers();
    },
    endGame: function () {

    },
    addBonuses: function (bonuses) {

    },
    checkIfBoxCanMove: function (row, col) {
        var array = this.gameArray,
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

        self.gameArray[randomRowFirst][randomColFirst] = new Node(randomColFirst, randomRowFirst, randomDigitFirst);
        self.gameArray[randomRowFirst][randomColFirst].addToCell();
        self.gameArray[randomRowSecond][randomColSecond] = new Node(randomColSecond, randomRowSecond, randomDigitSecond);
        self.gameArray[randomRowSecond][randomColSecond].addToCell();
    },
    countZeroes: function () {
        var zeroes = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (self.gameArray[i][j] == 0) { zeroes++; };
            }
        }
        return zeroes;
    }



    });

///////////////////////////////////////////
function Gamez() {
    // Here we will implement the game
    var self = this,
        length = 4,
        multiplyBy = 2,
        gameEnd = false,
        gameLost = false;
    self.gameArray = [[0, 0, 0, 0],
                      [0, 0, 0, 0],
                      [0, 0, 0, 0],
                      [0, 0, 0, 0]];

    self.putFirstTwoRandomNumbers = function () {
        var randomRowFirst = Math.floor((Math.random() * 4)),
            randomColFirst = Math.floor((Math.random() * 4)),
            randomDigitFirst = Math.random() < 0.9 ? 2 : 4,

            randomRowSecond = Math.floor((Math.random() * 4)),
            randomColSecond = Math.floor((Math.random() * 4)),
            randomDigitSecond = Math.random() < 0.9 ? 2 : 4;

        self.gameArray[randomRowFirst][randomColFirst] = new Node(randomColFirst, randomRowFirst, randomDigitFirst);
        self.gameArray[randomRowFirst][randomColFirst].addToCell();
        self.gameArray[randomRowSecond][randomColSecond] = new Node(randomColSecond, randomRowSecond, randomDigitSecond);
        self.gameArray[randomRowSecond][randomColSecond].addToCell();
    };
    self.countZeroes = function () {
        var zeroes = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (self.gameArray[i][j] == 0) { zeroes++; };
            }
        }
        return zeroes;
    };
    self.checkIfBoxCanMove = function (row, col) {
        var array = self.gameArray,
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
    };
    self.putRandomNumber = function () {
        var zeroes = self.countZeroes(),
            rand = Math.floor((Math.random() * zeroes)) + 1,
            zeroCounter = 0,
            randomDigit = Math.random() < 0.9 ? 2 : 4,
            isOver = true;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (self.gameArray[i][j] == 0) {
                    zeroCounter++;
                    if (zeroCounter == rand) {
                        self.gameArray[i][j] = new Node(j, i, randomDigit);
                        self.gameArray[i][j].addToCell();
                    }
                }
                else {
                    if (zeroes <= 0 && isOver) {
                        console.log(zeroes);
                        if (self.checkIfBoxCanMove(i, j)) {
                            isOver = false;
                        }
                    }
                    self.gameArray[i][j].unitedOnTurn = false;
                }
            }
        }
        if (zeroes <= 0) {
            gameLost = isOver;
        }
        
    };
    self.show = function () {
        var msg1 = "",
            msg2 = "",
            msg3 = "",
            msg4 = "";
        for (var i = 0; i < length; i++) {
            for (var j = 0 ; j < length; j++) {
                switch (i) {
                    case 0:
                        if (self.gameArray[i][j] != 0) {
                            msg1 += self.gameArray[i][j].value + " ";
                        }
                        else {
                            msg1 += 0 + " "
                        }
                        break;
                    case 1:
                        if (self.gameArray[i][j] != 0) {
                            msg2 += self.gameArray[i][j].value + " ";
                        }
                        else {
                            msg2 += 0 + " "
                        }
                        break;                      
                    case 2:
                        if (self.gameArray[i][j] != 0) {
                            msg3 += self.gameArray[i][j].value + " ";
                        }
                        else {
                            msg3 += 0 + " "
                        }
                        break;                      
                    case 3:
                        if (self.gameArray[i][j] != 0) {
                            msg4 += self.gameArray[i][j].value + " ";
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
    };
    self.endGame = function () {
        this.endGame = true;
        console.log("GOOD GAME!");
    };
    self.move = function (direction) {
        if (gameLost) {
            self.endGame();
        }
        else {
            switch (direction) {
                case "left":
                    for (var i = 0; i < length; i++) {
                        self.moveLeftByRowBETA(i);
                    };
                    break;
                case "right":
                    for (var i = 0; i < length; i++) {
                        self.moveRightByRowBETA(i);
                    };
                    break;
                case "up":
                    for (var i = 0; i < length; i++) {
                        self.moveUpByColBETA(i);
                    };
                    break;
                case "down":
                    for (var i = 0; i < length; i++) {
                        self.moveDownByColBETA(i);
                    };
                    break;
                default:
                    break;

            }
            self.show();
            self.putRandomNumber();
            console.log("-----------------");
            self.show();
            console.log("-----------------");
        }
    };
     /*[[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]];*/
    self.moveElement = function (element, moving) {
        var col = element.col,
            row = element.row;
        switch (moving) {
            case "left":
                self.gameArray[row][col] = 0;
                self.gameArray[row][col - 1] = element;
                element.moveLeft();
                break;
            case "right":
                self.gameArray[row][col] = 0;
                self.gameArray[row][col + 1] = element;
                element.moveRight();
                break;
            case "up":
                self.gameArray[row][col] = 0;
                self.gameArray[row - 1][col] = element;
                element.moveUp();
                break;
            case "down":
                self.gameArray[row][col] = 0;
                self.gameArray[row + 1][col] = element;
                element.moveDown();
            default:
                break;

        }
    };
    self.uniteElements = function (newNode, current, moving) {
        self.gameArray[current.row][current.col] = 0;
        self.gameArray[newNode.row][newNode.col] = newNode;
    };
    self.moveLeftByRowBETAaaaa = function (row) {
        var col = 0,
            moving = "left",
            currentNode = -1,
            i = 0,
            previous = 0,
            flag = true;
        for (col; col < length; col++) {
            flag = true;
            currentNode = self.gameArray[row][col];
            if (currentNode != 0) {
                // [2,0,0,2]
                i = col - 1;
                while (flag) {
                    if (i < 0) {
                        flag = false;
                        break;
                    }
                    previous = self.gameArray[row][i];
                    if (previous == 0) {
                        self.moveElement(currentNode, moving);
                    }
                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {

                        var newNode = currentNode.unite(previous);
                        self.uniteElements(newNode, currentNode, moving);
                    }
                    else {
                        flag = false;
                    }
                    i--;
                };
            }
        }
    };

    self.moveLeftByRowBETA = function (row) {
        var col = 0,
            moving = "left",
            currentNode = -1,
            i = 0,
            previous = 0,
            flag = true;
        for (col; col < length; col++) {
            flag = true;
            currentNode = self.gameArray[row][col];
            if (currentNode != 0) {
                // [2,0,0,2]
                i = col - 1;
                while (flag) {
                    if (i < 0) {
                        flag = false;
                        break;
                    }
                    previous = self.gameArray[row][i];
                    if (previous == 0) {
                        self.moveElement(currentNode, moving);
                    }
                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
                        
                        var newNode = currentNode.unite(previous);
                        self.uniteElements(newNode, currentNode, moving);
                    }
                    else {
                        flag = false;
                    }
                    i--;
                };
            }
        }
    };
    self.moveRightByRowBETA = function (row) {
        var col = 3,
            moving = "right",
            currentNode = -1,
            i = 3,
            previous = 0,
            flag = true;
        for (col; col >= 0; col--) {
            flag = true;
            currentNode = self.gameArray[row][col];
            if (currentNode != 0) {
                // [2,0,0,2]
                i = col + 1;
                while (flag) {
                    
                    if (i > 3) {
                        flag = false;
                        break;
                    }
                    previous = self.gameArray[row][i];
                    if (previous == 0) {
                        self.moveElement(currentNode, moving);
                    }
                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
                        var newNode = currentNode.unite(previous);
                        self.uniteElements(newNode, currentNode, moving);
                    }
                    else {
                        flag = false;
                    }
                    i++;
                };
            }
        }
    };
  
    self.moveUpByColBETA = function (col) {
        var row = 0,
            moving = "up",
            currentNode = -1,
            i = 0,
            previous = 0,
            flag = true;
        for (row; row < length; row++) {
            flag = true;
            currentNode = self.gameArray[row][col];
            if (currentNode != 0) {
                i = row - 1;
                while (flag) {
                    if (i < 0) {
                        flag = false;
                        break;
                    }
                    previous = self.gameArray[i][col];
                    if (previous == 0) {
                        self.moveElement(currentNode, moving);
                    }
                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
                        
                        var newNode = currentNode.unite(previous);
                        self.uniteElements(newNode, currentNode, moving);
                    }
                    else {
                        flag = false;
                    }
                    i--;
                };
            }
        }
    };
    self.moveDownByColBETA = function (col) {
        var row = 3,
            moving = "down",
            currentNode = -1,
            i = 3,
            previous = 0,
            flag = true;
        for (row; row >= 0; row--) {
            flag = true;
            currentNode = self.gameArray[row][col];
            if (currentNode != 0) {
                // [2,0,0,2]
                i = row + 1;
                while (flag) {

                    if (i > 3) {
                        flag = false;
                        break;
                    }
                    previous = self.gameArray[i][col];
                    if (previous == 0) {
                        self.moveElement(currentNode, moving);
                    }
                    else if (previous.value == currentNode.value && !previous.unitedOnTurn) {
                        var newNode = currentNode.unite(previous);
                        self.uniteElements(newNode, currentNode, moving);
                    }
                    else {
                        flag = false;
                    }
                    i++;
                };
            }
        }
    };

//    self.moveLeftByRow = function (row) {
//        var col = 0,
//            firstNodeCol = -1,
//            firstFreeSpaceCol = -1,
//            currentNode = -1;

//        for (col; col < length; col++) {
//            currentNode = self.gameArray[row][col];
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
//                self.gameArray[row][col] = 0;
//                self.gameArray[row][firstFreeSpaceCol] = currentNode;
//                firstNodeCol = firstFreeSpaceCol;
//                firstFreeSpaceCol += 1;
//            }
//            else {
//                if (self.gameArray[row][firstNodeCol] != currentNode) {
//                    if (firstFreeSpaceCol != -1) {
//                        self.gameArray[row][firstFreeSpaceCol] = currentNode;
//                        firstNodeCol = firstFreeSpaceCol;
//                        self.gameArray[row][col] = 0;
//                        firstFreeSpaceCol += 1;
//                    }
//                    else {
//                        firstNodeCol = col;
//                    }
//                }
//                else {
//                    self.gameArray[row][firstNodeCol] *= multiplyBy;
//                    self.gameArray[row][col] = 0;
//                    firstFreeSpaceCol = firstNodeCol + 1;
//                }
//            }
//        }
//    };
//    self.moveRightByRow = function (row) {
//        var col = 3,
//            firstNodeCol = -1,
//            firstFreeSpaceCol = -1,
//            currentNode = -1;

//        for (col; col >= 0; col--) {
//            currentNode = self.gameArray[row][col];
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
//                self.gameArray[row][col] = 0;
//                self.gameArray[row][firstFreeSpaceCol] = currentNode;
//                firstNodeCol = firstFreeSpaceCol;
//                firstFreeSpaceCol -= 1;
//            }
//            else {
//                if (self.gameArray[row][firstNodeCol] != currentNode) {
//                    if (firstFreeSpaceCol != -1) {
//                        self.gameArray[row][firstFreeSpaceCol] = currentNode;
//                        firstNodeCol = firstFreeSpaceCol;
//                        self.gameArray[row][col] = 0;
//                        firstFreeSpaceCol -= 1;
//                    }
//                    else {
//                        firstNodeCol = col;
//                    }
//                }
//                else {
//                    self.gameArray[row][firstNodeCol] *= multiplyBy;
//                    self.gameArray[row][col] = 0;
//                    firstFreeSpaceCol = firstNodeCol - 1;
//                }
//            }
//        }
//    };
//    self.moveDownByCol = function (col) {
//        var row = 3,
//            firstNodeRow = -1,
//            firstFreeSpaceRow = -1,
//            currentNode = -1;

//        for (row; row >= 0; row--) {
//            currentNode = self.gameArray[row][col];
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
//                self.gameArray[row][col] = 0;
//                self.gameArray[firstFreeSpaceRow][col] = currentNode;
//                firstNodeRow = firstFreeSpaceRow;
//                firstFreeSpaceRow -= 1;
//            }
//            else {
//                if (self.gameArray[firstNodeRow][col] != currentNode) {
//                    if (firstFreeSpaceRow != -1) {
//                        self.gameArray[firstFreeSpaceRow][col] = currentNode;
//                        firstNodeRow = firstFreeSpaceRow;
//                        self.gameArray[row][col] = 0;
//                        firstFreeSpaceRow -= 1;
//                    }
//                    else {
//                        firstNodeRow = row;
//                    }
//                }
//                else {
//                    self.gameArray[firstNodeRow][col] *= multiplyBy;
//                    self.gameArray[row][col] = 0;
//                    firstFreeSpaceRow = firstNodeRow - 1;
//                }
//            }
//        }
//    };
//    self.moveUpByCol = function (col) {
//        var row = 0,
//            firstNodeRow = -1,
//            firstFreeSpaceRow = -1,
//            currentNode = -1;

//        for (row; row < length; row++) {
//            currentNode = self.gameArray[row][col];
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
//                self.gameArray[row][col] = 0;
//                self.gameArray[firstFreeSpaceRow][col] = currentNode;
//                firstNodeRow = firstFreeSpaceRow;
//                firstFreeSpaceRow += 1;
//            }
//            else {
//                if (self.gameArray[firstNodeRow][col] != currentNode) {
//                    if (firstFreeSpaceRow != -1) {
//                        self.gameArray[firstFreeSpaceRow][col] = currentNode;
//                        firstNodeRow = firstFreeSpaceRow;
//                        self.gameArray[row][col] = 0;
//                        firstFreeSpaceRow += 1;
//                    }
//                    else {
//                        firstNodeRow = row;
//                    }
//                }
//                else {
//                    self.gameArray[firstNodeRow][col] *= multiplyBy;
//                    self.gameArray[row][col] = 0;
//                    firstFreeSpaceRow = firstNodeRow + 1;
//                }
//            }
//        }
//    };
}