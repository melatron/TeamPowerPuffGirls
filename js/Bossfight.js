Bossfight = Game.extend({
	init: function(){
		this._super();
	}
});

BObject = Class.extend({
	init: function(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
});

BMovableObject = BObject.extend({
	
});