function Node (x, y, value) {
    this.col = x;
    this.row = y;
    this.value = value;
};
Node.prototype.updatePosition = function updatePosition(x, y) {
    this.col = x;
    this.row = y;
};
Node.prototype.unite = function unite(node) {
    if (node.value == this.value) {
        return new Node(node.col, node.row, node.value * node.value);
    }
};