function Node (x, y, value) {
    this.col = x;
    this.row = y;
    this.value = value;
    this.unitedOnTurn = false;
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
    console.log(this.col);
    console.log(this.row);
    $(".row").eq(this.row).find(".cell").eq(this.col).empty()
                                                     .append(this.node);
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
Node.prototype.proceed = function () {
    var self = this;
    if (this.movedTo != null) {
        console.log(this.movedTo);
        this.node.animate({
            //left: "+=100"
        }, 1000, function () {
            console.log(self.movedTo);
            self.removeFromCell();
            self.col = self.movedTo.col;
            self.row = self.movedTo.row;
            self.addToCell();
            this.movedTo = null;
            this.mergedTo = null;
        });
    }
    else if (this.mergedTo != null) {
        this.node.animate({
            //left: "+=100"
        }, 1000, function () {
            self.removeFromCell();
            self.col = self.mergedTo.col;
            self.row = self.mergedTo.row;
            self.addToCell();
            this.movedTo = null;
            this.mergedTo = null;
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
