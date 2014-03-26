var canvas = null,
	context = null,
	img = null,
	coin = null;
window.onload = function(){
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	canvas.style.border = "2px solid black";
	img = new Image();
	img.src = 'source/coin-sprite-animation-sprite-sheet.png';
	
	coin = sprite({
		context: context,
		width: 50,
		height: 40, 
		image: img
	});
	
	coin.render();
};


function sprite(options){
	var that = {},
		frameIndex = 0,
		tickCount = 0,
		ticksPerFrame = ticksPerFrame || 0;
		
	that.height = options.height;
	that.width = options.width;
	that.context = options.context;
	that.image = options.image;
	
	that.render = function(){
		that.context.drawImage(
		           that.image,
		           frameIndex * that.width / numberOfFrames,
		           0,
		           that.width / numberOfFrames,
		           that.height,
		           0,
		           0,
		           that.width / numberOfFrames,
		           that.height);
	};
	
	that.update = function () {
		
		tickCount += 1;
		
		if (tickCount > ticksPerFrame) {
			tickCount = 0;
			frameIndex += 1;
		}
	};
	
	return that;
};


