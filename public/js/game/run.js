function run()
{
	requestAnimationFrame(run);	
	
	timeSinceLastFrame = Date.now() - oldDate;
	oldDate = Date.now();
	
	var i = 0;
	for (p in players)
	{
		if (players[p].connected && i < 7)
		{
			getId("p" + (i+1) +"N").innerHTML = players[p].name;
			getId("p" + (i+1) +"S").innerHTML = players[p].score;
			i++;
		}
		else if (i < 7)
		{
			getId("p" + (i+1) +"N").innerHTML = "NC";
			getId("p" + (i+1) +"S").innerHTML = "0";
			i++;
		}
	}
	
	// Clear
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, imgBackW, imgBackH);
	ctx.drawImage(imgBack, 0, 0, imgBackW, imgBackH, 0, 0, imgBackW, imgBackH);
	
	// Accelerate
	if(keyUpDown || keyDownDown ||keyLeftDown || keyRightDown)
	{
		players[myIndex].accelerateMe();
	}
	
	// Move
	
	if(keyUpDown)
	{
		players[myIndex].orientation = UP;
		players[myIndex].Move(); 
	}
		
	if(keyDownDown)
	{
		players[myIndex].orientation = DOWN;
		players[myIndex].Move();
	}
		
	if(keyLeftDown)
	{
		players[myIndex].orientation = LEFT;
		players[myIndex].Move();
	}
		
	if(keyRightDown)
	{
		players[myIndex].orientation = RIGHT;
		players[myIndex].Move();
	}
	
	// desceleration
	if(players[myIndex].desceleration)
	{
		players[myIndex].descelerateMe();
	}
	
	if(players[myIndex].isRecule)
	{
		players[myIndex].recule();
	}
	
	if(players[myIndex].isPousse)
	{
		players[myIndex].pousse();
	}
	
	// draw sang
	for(var i = 0; i < tacheTab.length; i++)
	{
		tacheTab[i].drawMe(ctx);
	}
	
	// draw players
	displayListOrder = new Array()
	// mise a jour de l'ordre d'affichage
	for (var y = 0; y < canvas.height; y+=10)
	{
		for (n in players)
		{
			if (!players[n].connected)
			{
				continue;
			}
			if (players[n].posY <= y
			&& players[n].posY > y - 10)
			{
				displayListOrder.push(n);
			}
		}
	}
	
	for (var i = 0; i < displayListOrder.length; i++)
	{
		var n = displayListOrder[i];
		if(!players[n].dead)
		{
			if (Math.abs(players[n].destX - players[n].posX) > 17 && n != myIndex)
			{
				if (players[n].destX > players[n].posX)
				{
					players[n].posX += 17;
				}
				else if (players[n].destX < players[n].posX)
				{
					players[n].posX -= 17;
				}
			}
			
			if (Math.abs(players[n].destY - players[n].posY) > 17 && n != myIndex)
			{
				if (players[n].destY > players[n].posY)
				{
					players[n].posY += 17;
				}
				else if (players[n].destY < players[n].posY)
				{
					players[n].posY -= 17;
				}
			}
			
			players[n].drawMe(ctx);
			players[n].isAnimated = false;
			
			if(players[n].isPousse)
			{
				players[n].pousse();
			}
			
			if(players[n].isStun)
			{
				players[n].stunAnimation();
			}
		 }
	}
	
	// Draw ExlosionSang

	for (var i = 0; i < explosionSangTab.length; i++)
	{
		explosionSangTab[i].drawMe(ctx);
		
		if(explosionSangTab[i].toDeath)
		{
			if(i != explosionSangTab.length-1)
			{
				explosionSangTab[i]=explosionSangTab[explosionSangTab.length-1]; 
			}
			explosionSangTab.pop(); 
		}
	}
	
	if (imDead)
	{
		ctx.fillStyle = "red";
		ctx.font = "30pt Calibri,Geneva,Arial";
		ctx.fillText("You will respawn in : " + timeRespawn + "sec",
					800, 400);
	}
}