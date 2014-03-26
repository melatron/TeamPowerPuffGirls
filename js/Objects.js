//Main Object class hae size and position and draw method (undefined)
Object = Class.extend({
    init: function (x,y,width,height) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    },
    getPosition: function () {
        var that = this;
        return {
            x: that.x,
            y: that.y,
        };
    },
    getSize: function () {
        var that = this;
        return {
            width: that.width,
            height: that.height,
        };
    },
    drawObj: function (canvas) {
        var c = canvas.getContext("2d");
    }
});

//
MoveableObject = Object.extend({
    init: function (x, y, width, height) {
        this._super(x, y, width, height);
        this.sprite = {
            width: null,
            height: null,
            image: null,
            frames: null,
        },
        drawSprite = function (s) {
            //TO DO
        }
    },

});

//Interactable object to do
InteractableObject = Object.extend({
    init: function (x, y, width, height) {
        this._super(x, y, width, height);
    },
});

//
ClickPoint = InteractableObject.extend({
    init: function (x, y, width, height) {
        this._super(x, y, width, height);
    },
    isClicked: function (mouseX, mouseY) {
        console.log(mouseX + " " + mouseY);
        // if x between this x and this.x + this.width AND if y between this.y and this.y+this.height
        if ((mouseX > this.x && mouseX < (this.x + this.width)) && (mouseY > this.y && mouseY < (this.y + this.height))) {
            console.log("hello");
            return true;
        }
    },
    drawObj: function (canvas) {
        var c = canvas.getContext("2d");
        c.fillRect(this.x, this.y, this.width, this.height);//testing
    },


});


