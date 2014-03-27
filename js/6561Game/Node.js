function Node (x, y, value) {
    this.col = x;
    this.row = y;
    this.value = value;
    this.unitedOnTurn = false;
    this.multuply = 2;
};
Node.prototype.changeUnite = function changeUnite() {
    this.unitedOnTurn = false;
};
Node.prototype.moveUp = function () {
    if (this.row > 0) {
        this.row--;
    }
    else {
        return false;
    }
    return true;
};
Node.prototype.moveDown = function () {
    if (this.row < 3) {
        this.row++;
    }
    else {
        return false;
    }
    return true;
};
Node.prototype.moveLeft = function () {
    if (this.col > 0) {
        this.col--;
    }
    else {
        return false;
    }
    return true;
};
Node.prototype.moveRight = function () {
    if (this.col < 3) {
        this.col++;
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
        var newNode = new Node(node.col, node.row, node.value * node.multuply);
        newNode.unitedOnTurn = true;
        return newNode;
    }
};
