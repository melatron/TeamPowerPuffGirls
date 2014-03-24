function Game() {
    // Here we will implement the game
    var self = this,
        length = 4,
        gameWon = false;
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
        self.gameArray[randomRowFirst][randomColFirst] = randomDigitFirst;
        self.gameArray[randomRowSecond][randomColSecond] = randomDigitSecond;
    };
    self.putFirstTwoRandomNumbers();
    self.countZeroes = function () {
        var zeroes = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (self.gameArray[i][j] == 0) { zeroes++; };
            }
        }
        return zeroes;
    };
    self.putRandomNumber = function () {
        var zeroes = self.countZeroes(),
            rand = Math.floor((Math.random() * zeroes)) + 1,
            zeroCounter = 0,
            randomDigit = Math.random() < 0.9 ? 2 : 4,
            stopSearch = false;
        for (var i = 0; i < 4 && !stopSearch; i++) {
            for (var j = 0; j < 4 && !stopSearch; j++) {
                if (self.gameArray[i][j] == 0) {
                    zeroCounter++;
                    if (zeroCounter == rand) {
                        self.gameArray[i][j] = randomDigit;
                        stopSearch = true;
                    };
                };
            }
        }
    };
    self.show = function () {
        console.log(self.gameArray[0]);
        console.log(self.gameArray[1]);
        console.log(self.gameArray[2]);
        console.log(self.gameArray[3]);
    };
    self.move = function (direction) {
        switch (direction) {
            case "left":
                for (var i = 0; i < length; i++) {
                    self.moveLeftByRow(i);
                };
                break;
            case "right":
                for (var i = 0; i < length; i++) {
                    self.moveRightByRow(i);
                };
                break;
            case "up":
                for (var i = 0; i < length; i++) {
                    self.moveUpByCol(i);
                };
                break;
            case "down":
                for (var i = 0; i < length; i++) {
                    self.moveDownByCol(i);
                };
                break;
            default:
                break;

        }
        self.show();
        self.putRandomNumber();
        self.show();
    };
    self.moveLeftByRow = function (row) {
        var col = 0,
            multiplyBy = 2,
            firstNodeCol = -1,
            firstFreeSpaceCol = -1,
            currentNode = -1;

        for (col; col < length; col++) {
            currentNode = self.gameArray[row][col];
            if (currentNode == 0 && firstFreeSpaceCol == -1) {
                firstFreeSpaceCol = col;
                continue;
            }
            else if (currentNode == 0) {
                continue;
            }
            else if (firstFreeSpaceCol == -1 && firstNodeCol == -1) {
                firstNodeCol = col;
                continue;
            }
            else if (firstNodeCol == -1) {
                self.gameArray[row][col] = 0;
                self.gameArray[row][firstFreeSpaceCol] = currentNode;
                firstNodeCol = firstFreeSpaceCol;
                firstFreeSpaceCol += 1;
            }
            else {
                if (self.gameArray[row][firstNodeCol] != currentNode) {
                    if (firstFreeSpaceCol != -1) {
                        self.gameArray[row][firstFreeSpaceCol] = currentNode;
                        firstNodeCol = firstFreeSpaceCol;
                        self.gameArray[row][col] = 0;
                        firstFreeSpaceCol += 1;
                    }
                    else {
                        firstNodeCol = col;
                    }
                }
                else {
                    self.gameArray[row][firstNodeCol] *= multiplyBy;
                    self.gameArray[row][col] = 0;
                    firstFreeSpaceCol = firstNodeCol + 1;
                }
            }
        }
    };
    self.moveRightByRow = function (row) {
        var col = 3,
            multiplyBy = 2,
            firstNodeCol = -1,
            firstFreeSpaceCol = -1,
            currentNode = -1;

        for (col; col >= 0; col--) {
            currentNode = self.gameArray[row][col];
            if (currentNode == 0 && firstFreeSpaceCol == -1) {
                firstFreeSpaceCol = col;
                continue;
            }
            else if (currentNode == 0) {
                continue;
            }
            else if (firstFreeSpaceCol == -1 && firstNodeCol == -1) {
                firstNodeCol = col;
                continue;
            }
            else if (firstNodeCol == -1) {
                self.gameArray[row][col] = 0;
                self.gameArray[row][firstFreeSpaceCol] = currentNode;
                firstNodeCol = firstFreeSpaceCol;
                firstFreeSpaceCol -= 1;
            }
            else {
                if (self.gameArray[row][firstNodeCol] != currentNode) {
                    if (firstFreeSpaceCol != -1) {
                        self.gameArray[row][firstFreeSpaceCol] = currentNode;
                        firstNodeCol = firstFreeSpaceCol;
                        self.gameArray[row][col] = 0;
                        firstFreeSpaceCol -= 1;
                    }
                    else {
                        firstNodeCol = col;
                    }
                }
                else {
                    self.gameArray[row][firstNodeCol] *= multiplyBy;
                    self.gameArray[row][col] = 0;
                    firstFreeSpaceCol = firstNodeCol - 1;
                }
            }
        }
    };
    self.moveDownByCol = function (col) {
        var row = 3,
            multiplyBy = 2,
            firstNodeRow = -1,
            firstFreeSpaceRow = -1,
            currentNode = -1;

        for (row; row >= 0; row--) {
            currentNode = self.gameArray[row][col];
            if (currentNode == 0 && firstFreeSpaceRow == -1) {
                firstFreeSpaceRow = row;
                continue;
            }
            else if (currentNode == 0) {
                continue;
            }
            else if (firstFreeSpaceRow == -1 && firstNodeRow == -1) {
                firstNodeRow = row;
                continue;
            }
            else if (firstNodeRow == -1) {
                self.gameArray[row][col] = 0;
                self.gameArray[firstFreeSpaceRow][col] = currentNode;
                firstNodeRow = firstFreeSpaceRow;
                firstFreeSpaceRow -= 1;
            }
            else {
                if (self.gameArray[firstNodeRow][col] != currentNode) {
                    if (firstFreeSpaceRow != -1) {
                        self.gameArray[firstFreeSpaceRow][col] = currentNode;
                        firstNodeRow = firstFreeSpaceRow;
                        self.gameArray[row][col] = 0;
                        firstFreeSpaceRow -= 1;
                    }
                    else {
                        firstNodeRow = row;
                    }
                }
                else {
                    self.gameArray[firstNodeRow][col] *= multiplyBy;
                    self.gameArray[row][col] = 0;
                    firstFreeSpaceRow = firstNodeRow - 1;
                }
            }
        }
    };
    self.moveUpByCol = function (col) {
        var row = 0,
            multiplyBy = 2,
            firstNodeRow = -1,
            firstFreeSpaceRow = -1,
            currentNode = -1;

        for (row; row < length; row++) {
            currentNode = self.gameArray[row][col];
            if (currentNode == 0 && firstFreeSpaceRow == -1) {
                firstFreeSpaceRow = row;
                continue;
            }
            else if (currentNode == 0) {
                continue;
            }
            else if (firstFreeSpaceRow == -1 && firstNodeRow == -1) {
                firstNodeRow = row;
                continue;
            }
            else if (firstNodeRow == -1) {
                self.gameArray[row][col] = 0;
                self.gameArray[firstFreeSpaceRow][col] = currentNode;
                firstNodeRow = firstFreeSpaceRow;
                firstFreeSpaceRow += 1;
            }
            else {
                if (self.gameArray[firstNodeRow][col] != currentNode) {
                    if (firstFreeSpaceRow != -1) {
                        self.gameArray[firstFreeSpaceRow][col] = currentNode;
                        firstNodeRow = firstFreeSpaceRow;
                        self.gameArray[row][col] = 0;
                        firstFreeSpaceRow += 1;
                    }
                    else {
                        firstNodeRow = row;
                    }
                }
                else {
                    self.gameArray[firstNodeRow][col] *= multiplyBy;
                    self.gameArray[row][col] = 0;
                    firstFreeSpaceRow = firstNodeRow + 1;
                }
            }
        }
    };
}