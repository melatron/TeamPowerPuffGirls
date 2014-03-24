var GameSingleton = (function () {

    var instance;
    var game = new Game();
    function createInstance() {
        // Here we will put the public methods which will be needed for the game
        var object = {
            name: "Ivan",
            age: 19
        };
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }

            return instance;
        }
    };
})();



