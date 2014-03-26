
Story = Class.extend({
    
    init: function () {
        this.interactableObjects = new Array();
        this.mainCanvas;
    },
    clickEvent: function (ev) {
        var rect = this.mainCanvas.getBoundingClientRect();
        var mouseX=ev.clientX-rect.left,
            mouseY=ev.clientY-rect.top;
        for (var i = 0, len = this.interactableObjects.length; i < len; i++) {
            if (this.interactableObjects[i].isClicked(mouseX, mouseY)) {
                //console.log(this.interactableObjects[i]);
            }
        }
    },
   
})


    var story = new Story();
    var humanCastle = new ClickPoint(160, 150, 10, 10),
        dwarfCamp=new ClickPoint(650,150,10,10)
    function myfunction(e) {
        story.clickEvent(e);
    }

    window.onload = function () {

        story.interactableObjects.push(humanCastle);
        story.interactableObjects.push(dwarfCamp);
        story.mainCanvas = document.getElementById("canvas");
        for (var i = 0, len = story.interactableObjects.length; i < len; i++) {
            story.interactableObjects[i].drawObj(story.mainCanvas);
        }
        story.mainCanvas.addEventListener("click", myfunction, false);


};

