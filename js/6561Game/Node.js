function Node (x, y, value) {
    this.col = x;
    this.row = y;
    this.value = value;
    this.unitedOnTurn = false;
    this.animateNew = true;
    this.multuply = 2;
    this.movedTo = null;
    this.mergedTo = null;
    this.node = $("<div class = 'node'></div>");
    this.node.html(value);
};
Node.prototype.removeFromCell = function() {
    $(".row").eq(this.row).find(".cell").eq(this.col).find(".node").remove();
};
Node.prototype.addToCell = function () {
    if (this.animateNew) {
        var styles = {
            left: "0px",
            top: "0px",
            right: "0px",
            down: "0px",
            margin: "0 auto",
            width: "0px",
            height: "0px"
        },
            self = this;
        this.node.html(this.value);
        this.node.css(styles);
        $(".row").eq(this.row).find(".cell").eq(this.col).empty()
                                                        .append(this.node);
        this.node.animate({
            width: "89px",
            height: "55px"
        }, 100, function myfunction() {
            self.animateNew = false;
        });
    }
    else {
        var styles = {
            left: "0px",
            top: "0px",
            right: "0px",
            down: "0px",
            margin: "auto",
            width: "89px",
            height: "55px"
        };
        this.node.html(this.value);
        this.node.css(styles);
        $(".row").eq(this.row).find(".cell").eq(this.col).empty()
                                                        .append(this.node);
    }
    
    
   
};
Node.prototype.transferToCell = function (row, col) {
    $(".row").eq(row).find(".cell").eq(col).append(this.node);
};
Node.prototype.changeUnite = function changeUnite() {
    this.unitedOnTurn = false;
};
Node.prototype.powerUpValue = function () {
    this.value *= this.multuply;
};
Node.prototype.calculateAnimation = function () {
    var moveBy = 0,
        a = 0,
        row = 0,
        col = 0,
        flag = false;
    if (this.movedTo != null) {
        flag = true;
        row = this.movedTo.row;
        col = this.movedTo.col;
    }
    else {
        flag = true;
        row = this.mergedTo.row;
        col = this.mergedTo.col;
    }
    if (flag) {
        if (row == this.row) {
            a = this.col - col;
            switch (a) {
                case -1:
                    moveBy = 90
                    break;
                case -2:
                    moveBy = 180
                    break;
                case -3:
                    moveBy = 270
                    break;
                case 1:
                    moveBy = -90;
                    break;
                case 2:
                    moveBy = -180;
                    break;
                case 3:
                    moveBy = -270;
                    break;
                default:
                    break;
            }
            return {
                left: "+=" + moveBy
            }
        }
        else {
            a = this.row - row;
            switch (a) {
                case -1:
                    moveBy = 57;
                    break;
                case -2:
                    moveBy = 114;
                    break;
                case -3:
                    moveBy = 171;
                    break;
                case 1:
                    moveBy = -57;
                    break;
                case 2:
                    moveBy = -114;
                    break;
                case 3:
                    moveBy = -171;
                    break;
                default:
                    break;
            }
            return {
                top: "+=" + moveBy
            }
        }
    }
    
    
};
Node.prototype.proceed = function () {
    var self = this;
    
    if (this.movedTo != null) {
        this.node.animate(this.calculateAnimation(), 100, function () {
            self.col = self.movedTo.col;
            self.row = self.movedTo.row;
            self.movedTo = null;
            self.mergedTo = null;
        });
    }
    else if (this.mergedTo != null) {
        this.node.animate(this.calculateAnimation(), 100, function () {
            self.col = self.mergedTo.col;
            self.row = self.mergedTo.row;
            self.movedTo = null;
            self.mergedTo = null;
        });
    }
    this.unitedOnTurn = false;
};
Node.prototype.moveUp = function () {
    if (this.row > 0) {
        this.removeFromCell();
        this.row--;
        this.addToCell();
    }
    else {
        return false;
    }
    return true;
};
Node.prototype.moveDown = function () {
    if (this.row < 3) {
        this.removeFromCell();
        this.row++;
        this.addToCell();
    }
    else {
        return false;
    }
    return true;
};
Node.prototype.moveLeft = function () {
    if (this.col > 0) {
        this.removeFromCell();
        this.col--;
        this.addToCell();
        
    }
    else {
        return false;
    }
    return true;
};
Node.prototype.moveRight = function () {
    if (this.col < 3) {
        this.removeFromCell();
        this.col++;
        this.addToCell();
    }
    else {
        return false;
    }
    return true;
};
Node.prototype.updatePosition = function () {
    this.col = x;
    this.row = y;
};
Node.prototype.unite = function unite(node) {
    if (node.value == this.value) {
        this.removeFromCell();
        node.removeFromCell();
        var newNode = new Node(node.col, node.row, node.value * node.multuply);
        newNode.unitedOnTurn = true;
        newNode.addToCell();
        return newNode;
    }
};
