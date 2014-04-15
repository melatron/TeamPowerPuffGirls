MainCharacter = Class.extend({
    init: function () {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
});





PathFinder = Game.extend({
    init: function () {
        var self = this;
        this.mainLoop = function () {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.animation = requestAnimationFrame(self.mainLoop);
        };
        this.mainCharacter = new MainCharacter();
    },
});