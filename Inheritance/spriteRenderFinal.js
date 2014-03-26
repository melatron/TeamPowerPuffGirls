/**
 * 
 */

function spriteRender(spriteSource, context, frames, sourceX, sourceY){
	var img = new Image();
	img.src = spriteSource;
	
	var spriteWidth = img.naturalWidth;
	var spriteheight = img.naturalHeight;
	
	var frameIndex = 0,
	numOfFrames = frames,
	tickCount = 0,
	ticksPerFrame = ticksPerFrame || 0;
	
	context.drawImage(img, 
					frameIndex * (spriteWidth / frames), 
					0, 
				spriteWidth/frames, 
				spriteHeight, 
				sourceX, 
				sourceY,
				spriteWidth/frames, 
				spriteHeight);
}