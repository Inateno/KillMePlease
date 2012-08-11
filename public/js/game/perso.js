function Perso(posX, posY, id, name, color, connected)
{
	this.connected = connected;
	
	this.posX    = posX;
	this.posY    = posY;
	this.destX	= posX;
	this.destY	= posY;
	
	this.hbsX	 = 10;
	this.hbsY	 = 50;
	this.width	 = persoWidth;
	this.height  = persoHeight
	
	this.speed 	 = baseSpeed;
	this.id	   	 = id;
	this.animeKey = 0;
	this.animeSpeed = baseAnimSpeed;
	this.desceleration = false;

	this.timeToNextAnime = 0;
	
	this.imgMove			= new Image();
	this.imgMove.pointer	= this;
	this.imgMove.src = urlMove;
	this.imgMoveWidth = 0;
	this.imgMoveHeight = 0;
	
	this.imgMoveBlood			= new Image();
	this.imgMoveBlood.pointer	= this;
	this.imgMoveBlood.src = urlMoveBlood;
	this.imgMoveBloodWidth = 0;
	this.imgMoveBloodHeight = 0;
	
	this.imgRespawn			= new Image();
	this.imgRespawn.pointer	= this;
	this.imgRespawn.src = urlRespawn;
	this.imgRespawnWidth = 0;
	this.imgRespawnHeight = 0;
	
	this.imgRespawnShadow			= new Image();
	this.imgRespawnShadow.pointer	= this;
	this.imgRespawnShadow.src = urlRespawn;
	this.imgRespawnShadowWidth = 0;
	this.imgRespawnShadowHeight = 0;
	
	this.imgStun		= new Image();
	this.imgStun.src = urlStun;
	
	this.imgStunBlood	= new Image();
	this.imgStunBlood.src	= urlStunBlood;
	
	this.sprintTime = 0;
	this.isAnimated = false;
	
	this.orientation = RIGHT;
	this.direction = -1;
	
	this.dead = false;
	this.isRecule = false;
	
	this.isStun = false;
	this.timeStun = 0;
	
	this.timeToRecule = 0;
	this.timeToPousse = 0;
	
	this.otherDirection = 0;
	this.otherBounceId = -1;
	
	this.isBlooded = false;
	
	this.score = 0;
	
	if (!name) var name= "N00b";
	if (!color) var color = "white";
	this.name = name;
	this.color = color;
	
	this.imgMove.onload = function() 
	{
		if (!this.complete) 
			throw "Erreur de chargement du sprite nommé \"" + url + "\".";

		this.pointer.imgMoveWidth = this.width;
		this.pointer.imgMoveHeight = this.height;
	}
	
	this.drawMe = function(ctx)
	{
		if (!this.imgMoveHeight || !this.imgMoveWidth || !this.imgMove)
		{
			return;
		}
		
		var W = this.imgMoveWidth * 0.25;
		var H = this.imgMoveHeight * 0.25;
		
		if(!this.isBlooded && !this.isStun)
		{
			ctx.drawImage(this.imgMove,
				Math.floor(this.animeKey * W),
				Math.floor(this.orientation * H) ,
				W, H,
				this.posX, this.posY,
				W, H);
		}
		else if(this.isBlooded && !this.isStun)
		{
			ctx.drawImage(this.imgMoveBlood,
				Math.floor(this.animeKey * W),
				Math.floor(this.orientation * H),
				W, H,
				this.posX, this.posY,
				W, H);
		}
		else if(!this.isBlooded && this.isStun)
		{
			ctx.drawImage(this.imgStun,
				Math.floor(this.animeKey * W),
				Math.floor(this.orientation * H) ,
				W, H,
				this.posX, this.posY,
				W, H);
		}
		else if(this.isBlooded && this.isStun)
		{
			ctx.drawImage(this.imgStunBlood,
				Math.floor(this.animeKey * W),
				Math.floor(this.orientation * H),
				W, H,
				this.posX, this.posY,
				W, H);
		}
		
		/*ctx.fillStyle = "red";
		ctx.globalAlpha = 0.5;
		ctx.fillRect(this.posX + this.hbsX, this.posY + this.hbsY,
						this.width, this.height);
		
		ctx.globalAlpha = 1;*/
		
		
		ctx.fillStyle = this.color;
		ctx.font = "20pt Calibri,Geneva,Arial";
		ctx.fillText(this.name, this.posX, this.posY - 10, W);
	}
	
	this.Move = function()
	{
		if (moveHorizontal && moveVertical)
		{
			this.speed = this.speed/2;
		}
		
		this.direction = this.orientation;
		
		switch (this.orientation)
		{
			
			case LEFT:
				{
					this.direction = this.orientation;
					if(this.CanMove(this.direction))
					this.posX -= this.speed;
				}
			break;
			case RIGHT:
				{
					if(this.CanMove(this.orientation))
					this.posX += this.speed;
				}
			break;
			case DOWN:
				{
					if(this.CanMove(this.orientation))
					this.posY += this.speed;
				}
			break;
			case UP:
				{
					if(this.CanMove(this.orientation))
					this.posY -= this.speed;
				}
			break;
		}

		this.animateMe();
		
		if (sendDatasCount == maxCountToSend)
		{
			socket.emit('move',
						this.id,
						this.name,
						this.posX,
						this.posY,
						this.direction,
						this.orientation,
						this.animeKey
						);
			sendDatasCount = 0;
		}
		else
		{
			socket.emit('upDir', this.id, this.orientation);
			sendDatasCount++;
		}
		
		if (moveHorizontal && moveVertical)
		{				
			this.speed = this.speed*2;
		}
	}
	
	this.animateMe = function()
	{
		if (moveHorizontal && moveVertical)
		{
			this.timeToNextAnime += timeSinceLastFrame/2;
		}
		else
		{
			this.timeToNextAnime += timeSinceLastFrame;
		}
		
		if(this.timeToNextAnime >= this.animeSpeed && !this.isAnimated)
		{
			this.animeKey++;
			this.isAnimated = true;
												
			if (this.animeKey > 3)
				this.animeKey = 0;
			this.timeToNextAnime = 0;	
			
			SEbruitDePas.play();
		}
	}
	
	this.accelerateMe = function()
	{
		if (moveHorizontal && moveVertical)
		{
				this.sprintTime -= timeSinceLastFrame;
				
				if(this.sprintTime < 300)
					this.sprintTime = 300;
		}
		else
		{
			this.sprintTime += timeSinceLastFrame;
		}
		
		if(this.sprintTime > maxAcceleration)
		{
			this.sprintTime = maxAcceleration;

		}
		
		this.speed 	 = baseSpeed + baseSpeed * (this.sprintTime/accelerationSpeed);
		this.previewDateToAccelerate  = Date.now();
	}
	
	this.descelerateMe = function()
	{
		this.sprintTime -= timeSinceLastFrame*2;
		
		if(this.sprintTime > 0)
		{
				this.speed 	 = baseSpeed + baseSpeed*(this.sprintTime/accelerationSpeed);
				this.previewDateToAccelerate  = Date.now();
				this.Move();
		}
		else
		{
			this.desceleration = false;
		}
	}
	
	this.CanMove = function(direction)
	{
		if (this.dead)
		{
			return;
		}
		switch (direction)
		{
			case LEFT:
			{
				if(this.posX-this.speed >= 0)
				{		
					if(this.testColideWithOther())	
						{
							return true;
						}
					else
						return false;
				}
				else
				{
					SEcollision.play();
					return false;
				}
			}
			break;
			case RIGHT:
			{
				if(this.posX+this.speed + this.width <= ctxWidth)
				{
					if(this.testColideWithOther())	
						{
							return true;
						}
					else
						return false;
				}
				else
				{
					SEcollision.play();
					return false;
				}
			}
			break;
			case DOWN:
			{
				if(this.posY+this.speed+this.height <= ctxHeight - 50)
				{
					if(this.testColideWithOther())	
						{
							return true;
						}
					else
						return false;
				}
				else
				{
					SEcollision.play();
					return false;
				}
			}
			break;
			case UP:
			{
				if(this.posY-this.speed >= 0 && this.testColideWithOther())
				{
						if(this.testColideWithOther())	
						{
							return true;
						}
					else
						return false;
				}
				else
				{
					SEcollision.play();
					return false;
				}
			}
			break;
			default:
			{
				return false;
			}
			break;
		}
	}
		
	this.testColideWithOther = function()
	{
		for (i in players)
		{
			if (!players[i].connected)
			{
				continue;
			}
			
			if(i != this.id && i != this.otherBounceId && !players[i].dead )
			{
							
				if(this.posX >= players[i].posX 
					&& this.posX <= players[i].posX + players[i].width
					
						&& ((this.posY >= players[i].posY
							&& this.posY <= players[i].posY + players[i].height)
					||	( this.posY + this.height >= players[i].posY
							&& this.posY + this.height <= players[i].posY + players[i].height))	
					)
					{		
						this.collision( players[i]);
						return false;
					}

				if(this.posX + this.width >= players[i].posX 
					&& this.posX + this.width <= players[i].posX + players[i].width
					
						&& ((this.posY >= players[i].posY
							&& this.posY <= players[i].posY + players[i].height)
					||	( this.posY + this.height >= players[i].posY
							&& this.posY + this.height <= players[i].posY + players[i].height))	
					)
				{		
						this.collision( players[i]);
						return false;
				}
		

				if(
					this.posY + this.height >= players[i].posY
						&& this.posY + this.height <= players[i].posY +  players[i].height
					
						&& ((this.posX >= players[i].posX
							&& this.posX <= players[i].posX + players[i].width)
					||	( this.posX + this.width >= players[i].posX
							&& this.posX + this.width <= players[i].posX + players[i].width))
						
					)
					{	
						this.collision( players[i]);
						return false;
					}
		

				if(
					this.posY > players[i].posY
						&& this.posY  <= players[i].posY +  players[i].height
					
						&& ((this.posX >= players[i].posX
							&& this.posX <= players[i].posX + players[i].width)
					||	( this.posX + this.width >= players[i].posX
							&& this.posX + this.width <= players[i].posX + players[i].width))
						
					)
					{	
						this.collision(players[i]);
						return false;
					}
			}
		}
		return true;
	}
		
	this.collision = function (otherPlayer)
	{
		switch (this.direction)
		{
			case LEFT:
				{
					switch (otherPlayer.orientation)
					{
						case LEFT:
						{
							switch (this.orientation)
							{
								case LEFT:
									{
										if (this.posX > otherPlayer.posX)
										{
											this.collisionAss(otherPlayer);
										}
									}
								break;
								case RIGHT:
									{
										if (this.posX > otherPlayer.posX)
										{
											this.collisionAss(otherPlayer);
											otherPlayer.collisionAss(this);
										}
									}
								break;
								case DOWN:
									{
										if (this.posX > otherPlayer.posX)
										{
											this.collisionAss(otherPlayer);
										}
									}
								break;
								case UP:
									{
										if (this.posX > otherPlayer.posX)
										{
											this.collisionAss(otherPlayer);
										}
									}
								break;
							}
						}
						break;
						case RIGHT:
						{
							switch (this.orientation)
							{
								case LEFT:
									{
										this.collisionFace(otherPlayer);
									}
								break;
								case RIGHT:
									{
										if (this.posX > otherPlayer.posX)
										{
											otherPlayer.collisionAss(this);
										}
									}
								break;
								case DOWN:
									{
										this.collisionSide(otherPlayer);
									}
								break;
								case UP:
									{
										this.collisionSide(otherPlayer);
									}
								break;
							}
						}
						break;
						case DOWN:
						{
							switch (this.orientation)
							{
								case LEFT:
									{
										this.collisionSide(otherPlayer);
									}
								break;
								case RIGHT:
									{
										if (this.posX > otherPlayer.posX)
										{
											otherPlayer.collisionAss(this);
										}
									}
								break;
								case DOWN:
									{
										this.collisionSide(otherPlayer);
									}
								break;
								case UP:
									{
										this.collisionSide(otherPlayer);
									}
								break;
							}
						}
						break;
						case UP:
						{
							switch (this.orientation)
							{
								case LEFT:
									{
										this.collisionSide(otherPlayer);
									}
								break;
								case RIGHT:
									{
										if (this.posX > otherPlayer.posX)
										{
											otherPlayer.collisionAss(this);
										}
									}
								break;
								case DOWN:
									{
										this.collisionSide(otherPlayer);
									}
								break;
								case UP:
									{
										this.collisionSide(otherPlayer);
									}
								break;
							}
						}
						break;
					}
				}
			break;
			case RIGHT:
				{
					switch (otherPlayer.orientation)
						{
							case LEFT:
								{
										switch (this.orientation)
										{
											case LEFT:
												{
													if (this.posX < otherPlayer.posX)
													{
														otherPlayer.collisionAss(this);
													}
												}
											break;
											case RIGHT:
												{
													this.collisionFace(otherPlayer);
												}
											break;
											case DOWN:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case UP:
												{
													this.collisionSide(otherPlayer);
												}
											break;
										}
								}
							break;
							case RIGHT:
								{
									if (this.posX < otherPlayer.posX)
									{
										switch (this.orientation)
										{
											case LEFT:
												{
													this.collisionAss(otherPlayer);
													otherPlayer.collisionAss(this);
												}
											break;
											case RIGHT:
												{
													this.collisionAss(otherPlayer);
												}
											break;
											case DOWN:
												{
													this.collisionAss(otherPlayer);
												}
											break;
											case UP:
												{
													this.collisionAss(otherPlayer);
												}
											break;
										}
									}
								}
							break;
							case DOWN:
								{
										switch (this.orientation)
										{
											case LEFT:
												{
													if (this.posX < otherPlayer.posX)
													{
														otherPlayer.collisionAss(this);
													}
												}
											break;
											case RIGHT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case DOWN:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case UP:
												{
													this.collisionSide(otherPlayer);
												}
											break;
										}
								}
							break;
							case UP:
								{
									switch (this.orientation)
										{
											case LEFT:
												{
													if (this.posX < otherPlayer.posX)
													{
														otherPlayer.collisionAss(this);
													}
												}
											break;
											case RIGHT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case DOWN:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case UP:
												{
													this.collisionSide(otherPlayer);
												}
											break;
										}
								}
							break;
						}
				}
			break;
			case DOWN:
				{
						switch (otherPlayer.orientation)
						{
							case LEFT:
								{
									switch (this.orientation)
										{
											case LEFT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case RIGHT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case DOWN:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case UP:
												{
													if (this.posY < otherPlayer.posY)
													{
														otherPlayer.collisionAss(this);
													}
												}
											break;
										}
								}
							break;
							case RIGHT:
								{									
									switch (this.orientation)
										{
											case LEFT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case RIGHT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case DOWN:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case UP:
												{
													if (this.posY < otherPlayer.posY)
													{
														otherPlayer.collisionAss(this);
													}
												}
											break;
										}
								}
							break;
							case DOWN:
								{
									if (this.posY < otherPlayer.posY)
									{
										switch (this.orientation)
										{
											case LEFT:
												{
													this.collisionAss(otherPlayer);
												}
											break;
											case RIGHT:
												{
													this.collisionAss(otherPlayer);
												}
											break;
											case DOWN:
												{
													this.collisionAss(otherPlayer);
												}
											break;
											case UP:
												{
													this.collisionAss(otherPlayer);
													otherPlayer.collisionAss(this);
												}
											break;
										}
									}
								}
							break;
							case UP:
								{
									switch (this.orientation)
										{
											case LEFT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case RIGHT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case DOWN:
												{
													this.collisionFace(otherPlayer);
												}
											break;
											case UP:
												{
													if (this.posY < otherPlayer.posY)
													{
														this.collisionAss(otherPlayer);
													}
												}
											break;
										}
								}
							break;
						}
				}
			break;
			case UP:
				{
						switch (otherPlayer.orientation)
						{
							case LEFT:
								{
									switch (this.orientation)
										{
											case LEFT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case RIGHT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case DOWN:
												{
													if (this.posY > otherPlayer.posY)
													{
														otherPlayer.collisionAss(this);
													}
												}
											break;
											case UP:
												{
													this.collisionSide(otherPlayer);
												}
											break;
										}
								}
							break;
							case RIGHT:
								{											
									switch (this.orientation)
										{
											case LEFT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case RIGHT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case DOWN:
												{
													if (this.posY > otherPlayer.posY)
													{
														otherPlayer.collisionAss(this);
													}
												}
											break;
											case UP:
												{
													this.collisionSide(otherPlayer);
												}
											break;
										}
								}
							break;
							case DOWN:
								{
									switch (this.orientation)
										{
											case LEFT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case RIGHT:
												{
													this.collisionSide(otherPlayer);
												}
											break;
											case DOWN:
												{
													if (this.posY > otherPlayer.posY)
													{
														otherPlayer.collisionAss(this);
													}
												}
											break;
											case UP:
												{
													this.collisionFace(otherPlayer);
												}
											break;
										}
								}
							break;
							case UP:
								{
									if (this.posY > otherPlayer.posY)
									{
										switch (this.orientation)
										{
											case LEFT:
												{
													this.collisionAss(otherPlayer);
												}
											break;
											case RIGHT:
												{
													this.collisionAss(otherPlayer);
												}
											break;
											case DOWN:
												{
													otherPlayer.collisionAss(this);
													this.collisionAss(otherPlayer);
												}
											break;
											case UP:
												{
													this.collisionAss(otherPlayer);
												}
											break;
										}
									}
								}
							break;
						}
				}
			break;
		}
	}
	
	this.death = function(killer)
	{
		if (this.dead == false)
		{
			this.dead = true;
			SEsplash2.play();
			this.isBlooded = false;
			killer.isBlooded = true;
			playRandomDeathVoice();
			
			socket.emit('death',
					this.id,
					this.name,
					this.dead,
					killer.id
					);
		}
	}
	
	this.collisionAss = function (otherPlayer)
	{
		this.death(otherPlayer);
	}
	
	this.collisionFace = function (otherPlayer)
	{
		this.collisionSide(otherPlayer);
		if(this.speed > speedForStun || otherPlayer.speed > speedForStun)
		{
			this.isStun = true;
			otherPlayer.isStun = true;
			SEstun.play();	
		}
	}
	
	this.collisionSide = function (otherPlayer)
	{
		
		this.isRecule = true;
		
		keyUpDown = false;
		keyDownDown = false;
		keyLeftDown = false;
		keyRightDown = false;
		
		otherPlayer.isPousse = true;
		SEpousse.play();
		otherPlayer.otherDirection = this.direction;
		
		otherPlayer.otherBounceId = this.id;
		this.otherBounceId = otherPlayer.id;
		
		playRandomKnockVoice();
	}
	
	this.recule = function()
	{
		if (moveHorizontal && moveVertical)
		{
			this.speed = this.speed/2;
		}
		
		switch (this.direction)
		{
			case LEFT:
				{
					if(this.CanMove(this.direction))
					this.posX += this.speed;
				}
			break;
			case RIGHT:
				{
						if(this.CanMove(this.direction))
					this.posX -= this.speed;
				}
			break;
			case DOWN:
				{
						if(this.CanMove(this.direction))
					this.posY -= this.speed;
				}
			break;
			case UP:
				{
						if(this.CanMove(this.direction))
					this.posY += this.speed;
				}
			break;
			
	
		}
		
		if (moveHorizontal && moveVertical)
		{				
			this.speed = this.speed*2;
		}
		
		this.timeToRecule += timeSinceLastFrame;
		if(this.timeToRecule >= timeToRecule)
		{
			this.timeToRecule = 0;
			this.isRecule = false;
			this.otherBounceId = -1;
		}
		
		if (sendDatasCount == maxCountToSend)
		{
			socket.emit('move',
						this.id,
						this.name,
						this.posX,
						this.posY,
						this.direction,
						this.orientation,
						this.animeKey
						);
			sendDatasCount = 0;
		}
		else
		{
			socket.emit('upDir', this.id, this.orientation);
			sendDatasCount++;
		}
	}
	
	this.pousse = function()
	{
		this.direction = this.otherDirection;
		switch (this.otherDirection)
		{
			case LEFT:
				{
					if(this.CanMove(this.otherDirection))
					this.posX -= this.speed;

				}
			break;
			case RIGHT:
				{
					if(this.CanMove(this.otherDirection))
					this.posX += this.speed;
				
				}
			break;
			case DOWN:
				{
					if(this.CanMove(this.otherDirection))
					this.posY += this.speed;
				
				}
			break;
			case UP:
				{
					if(this.CanMove(this.otherDirection))
					this.posY -= this.speed;
					
				}
			break;
			default:
			{
			
			}
			break;
		}
		
		this.timeToPousse += timeSinceLastFrame;
		if(this.timeToPousse >= timeToPousse)
		{
			this.timeToPousse = 0;
			this.isPousse = false;
			this.otherBounceId = -1;
		}
		
		this.destX = this.posX;
		this.destY = this.posY;
		
		if (sendDatasCount == maxCountToSend)
		{
			socket.emit('bounce',
						this.id,
						this.name,
						this.posX,
						this.posY,
						this.direction,
						this.orientation,
						this.animeKey
						);
			sendDatasCount = 0;
		}
		else
		{
			socket.emit('upDir', this.id, this.orientation);
			sendDatasCount++;
		}
	}
	
	this.stunAnimation = function()
	{
		this.timeStun += timeSinceLastFrame;
		
		if(this.timeStun >= dureeStun)
		{
			this.isStun = false;
		}
	}
	
	this.respawnAnimation = function()
	{
		
	}
}