function Tache(posX, posY, width, height, type)
{
	this.posX      = posX;
	this.posY      = posY;
	this.height    = height;
	this.width     = width;
	this.type      = type;
	
	this.img			= new Image();
	this.img.pointer	= this;
	
	switch(this.type)
	{
		case 0:
		{
				this.img.src = urlbloodTache1;
		}
		break;
		case 1:
		{
				this.img.src = urlbloodTache2;
		}
		break;
			case 2:
		{
				this.img.src = urlbloodTache3;
		}
		break;
			case 3:
		{
				this.img.src = urlbloodTache4;
		}
		break;
	}

	
	this.imgWidth = 0;
	this.imgHeight = 0;
	
	this.img.onload = function() 
	{		
		
		this.pointer.imgWidth = this.width;
		this.pointer.imgHeight = this.height;
	}
	
	this.drawMe = function(ctx)
	{

			ctx.drawImage(this.img,
					 0,
					 0,
					  this.imgWidth, this.imgHeight,
					  this.posX, this.posY,
					  this.width, this.height);

	}
}