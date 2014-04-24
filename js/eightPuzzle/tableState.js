var TableState = Class.extend({
    init: function () {
        this.state1 =
            [
                [3, 1, 7],
                [5, 2, 4],
                [6, 8, 9]
            ];
        this.state2 =
            [
                [7, 5, 8],
                [2, 9, 1],
                [3, 4, 6]
            ];
        this.state3 =
            [
                [4, 5, 8],
                [1, 9, 6],
                [2, 7, 4]
            ];
        this.state4 =
            [
                [8, 5, 7],
                [4, 3, 2],
                [9, 1, 2]
            ];
        this.state5 =
            [
                [9, 4, 2],
                [6, 1, 3],
                [7, 5, 8]
            ];
        this.state6 =
            [
                [6, 2, 9],
                [4, 5, 1],
                [3, 7, 8]
            ];
        this.state7 =
            [
                [5, 2, 4],
                [6, 9, 3],
                [8, 1, 7]
            ];
        this.state8 =
            [
                [6, 7, 9],
                [2, 8, 1],
                [3, 5, 4]
            ];
        this.state9 =
            [
                [9, 2, 6],
                [3, 5, 7],
                [1, 4, 8]
            ];
        this.state10 =
            [
                [1, 5, 2],
                [6, 4, 8],
                [3, 7, 9]
            ];
        this.states =
            [
                this.state1, this.state2, this.state3, this.state4, this.state5,
                this.state6, this.state7, this.state8, this.state9, this.state10
            ];
        this.goalState =
            [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

    },
    getRandomState: function () {
        var n;
        n = Math.floor((Math.random()*10));

        return this.states[n];
    }
})