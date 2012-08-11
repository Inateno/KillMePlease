function ExplosionSang(posX, posY)
{
	this.posX   		 = posX;
	this.posY   		 = posY;
	this.animationKey    = 0;
	this.nbKey			 = explosionSangNbKey;
	this.width			 = explosionSangWidth;
	this.height			 = explosionSangHeight;
	
	this.img			= new Image();
	this.img.pointer	= this;
	this.img.src = explosionSangUrl ;
	this.imgWidth = 2100;
	this.imgHeight = 300;
	
	this.timeToNextAnime = 0;
	this.animeSpeed = explosionSangAnimeSpeed;
	
	this.toDeath = false;
	
	this.drawMe = function(ctx)
	{
	
		var W = this.imgWidth / this.nbKey;
	
		ctx.drawImage(this.img,
					  Math.floor(this.animationKey * W), 0,
					  W, this.imgHeight,
					  this.posX, this.posY,
					  this.width, this.height);
				
				
		this.animateMe();
	}
	
	this.animateMe = function()
	{
		this.timeToNextAnime += timeSinceLastFrame;
		
		if(this.timeToNextAnime >= this.animeSpeed)
		{
			this.animationKey++;
												
			if (this.animationKey > this.nbKey)
			{
				this.toDeath = true;
			}

			this.timeToNextAnime = 0;	
		}
	
	}
}