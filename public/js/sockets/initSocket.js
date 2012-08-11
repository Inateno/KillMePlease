function initSocket()
{
	/** Socket */
	socket
	.on('connect',
		function ()
		{
			// I'm connected
		}
	)

	.on('join',
		function (time, newPlayer, lastPlayerN)
		{
			// someone joined room
			addMessage(newPlayer.name, 'joined game', time);
			
			if (newPlayer.name == myName)
			{
				myIndex = newPlayer.id;
			}
			
			players[newPlayer.name] = new Perso(newPlayer.x,
									newPlayer.y,
									newPlayer.id,
									newPlayer.name,
									newPlayer.color,
									newPlayer.connected
						);
		}
	)
	
	.on('initRDatas',
		function (allPlayers, totalScore)
		{
			if (connected == true) { return; }
			players = {};
			for (i in allPlayers)
			{
				if (allPlayers[i].name == myName)
				{
					myIndex = i;
				}
				players[i] = new Perso(allPlayers[i].x,
										allPlayers[i].y,
										allPlayers[i].id,
										allPlayers[i].name,
										allPlayers[i].color,
										allPlayers[i].connected
							);
			}
			
			var debugWin = getId('debugWindow');
				debugWin.innerHTML = "<h1>Welcome, Have fun !</h1>";
				
			setTimeout(function()
				{
					getId('debugWindow').innerHTML = "<h1>Wait during game is loading</h1>";
					getId('debugWindow').style.display = "none";
				}, 1500);
			
			if (totalScore > 0)
			{
				firstBlood = true;
			}
			
			connected = true;
			
			initGame();
		}
	)
	
	.on('refresh',
		function (allPlayers)
		{
			players = {};
			for (i in allPlayers)
			{
				if (players[i].name == myName)
				{
					myIndex = i;
				}
				
				players[i] = new Perso(allPlayers[i].x,
										allPlayers[i].y,
										i,
										allPlayers[i].name,
										allPlayers[i].color,
										allPlayers[i].connected
							);
			}
		}
	)
	
	.on('updatePos',
		function (allPlayers)
		{
			for (p in allPlayers)
			{
				if (!allPlayers[p].connected)
				{
					continue;
				}
				
				if (!players[p])
				{
					players[p] = new Perso(allPlayers[p].x,
										allPlayers[p].y,
										p,
										allPlayers[p].name,
										allPlayers[p].color,
										allPlayers[p].connected
							);
				}
				else
				{
					players[p].destX		= allPlayers[p].x;
					players[p].destY		= allPlayers[p].y;
					players[p].direction	= allPlayers[p].dir;
					players[p].orientation	= allPlayers[p].orient;
					players[p].animeKey		= allPlayers[p].key;
				}
			}
		}
	)
	
	.on('updateBounce',
		function (aPlayer)
		{
			players[aPlayer.id].posX		= aPlayer.x;
			players[aPlayer.id].posY		= aPlayer.y;
			players[aPlayer.id].destX		= aPlayer.x;
			players[aPlayer.id].destY		= aPlayer.y;
			players[aPlayer.id].direction	= aPlayer.dir;
			players[aPlayer.id].orientation = aPlayer.orient;
			players[aPlayer.id].animeKey	= aPlayer.key;
		}
	)
	
	// lorsqu'un joueur meurt
	.on('playerDead',
		function (totalScore, aPlayer, i, respawnTime, killer, kId)
		{
			if (totalScore == 1 && firstBlood == false)
			{
				firstBlood = true;
				
				//
				SEfirstBlood.play();
				
				setTimeout(function()
					{
						var pos = BGMthemeCalme.currentPosition;
						BGMthemeCalme.pause();
						BGMthemeBrutal.currentPosition = pos;
						BGMthemeBrutal.play();
					}, 1200);
			}
			
			var p = players[i];
			explosionSangTab.push(new ExplosionSang(p.posX - p.width * 0.5, p.posY - p.height * 0.5));
			
			players[i].score = aPlayer.score;
			players[i].dead = aPlayer.dead;
			players[i].isBlooded = false;
			
			if (i == myIndex)
			{
				imDead = true;
				timeRespawn = Math.ceil(respawnTime / 1000);
				
				decreaseRespawnTime();
			}
			console.log(killer);
			players[kId].score		= killer.score;
			players[kId].isBlooded	= true;
			var dX = 0, dY = 0;
			if (players[kId].orientation == UP)
			{
				dY = 70;
			}
			else if (players[kId].orientation == DOWN)
			{
				dY = -70;
			}
			else if (players[kId].orientation == RIGHT)
			{
				dX = -70;
			}
			else if (players[kId].orientation == LEFT)
			{
				dX = 70;
			}
			
			tacheTab.push(new Tache(players[kId].posX + dX, players[kId].posY + dY, tacheWidthMax , tacheHeightMax, Math.floor(Math.random()*4) ));
		}
	)
	
	.on('playerRevive',
		function (aPlayer, id)
		{
			players[id].posX = aPlayer.x;
			players[id].posY = aPlayer.y;
			players[id].destX = aPlayer.x;
			players[id].destY = aPlayer.y;
			players[id].dead = aPlayer.dead;
			
			if (id == myIndex)
			{
				imDead = false;
			}
		}
	)
	
	.on('updateTime',
		function (minutes, seconds)
		{
			if (seconds < 10)
			{
				seconds = "0" + seconds;
			}
			getId("time").innerHTML = minutes + ":" + seconds;
			
			if (seconds < 6 && minutes < 1)
			{
				getId("time").style.color = "red";
				getId("time").style.fontWeight = "bold";
			}
			else
			{
				getId("time").style.color = "white";
				getId("time").style.fontWeight = "normal";
			}
		}
	)
	
	.on('timesUp',
		function()
		{
			// time is up
			getId("endPannel").style.display = "block";
			timeIsUp = true;
			var lp = getId("listPlayers");
			
			while (lp.childNodes.length > 0)
			{
				lp.removeChild(lp.firstChild);
			}
			
			var bestSave = 0, n = 0;
			for (i in players)
			{
				if (!players[i].connected)
				{
					continue;
				}
			
				if (players[i].score > bestSave)
				{
					bestSave = players[i].score;
					n = i;
				}
			}
			
			for (i in players)
			{
				if (!players[i].connected)
				{
					continue;
				}
			
				var l = document.createElement("li");
				if (i == n && i == myIndex)
				{
					l.innerHTML = '<span class="first">' + players[i].name + '<span class="scored">'+players[i].score+'</span></span>';
					Vvictory.play();
				}
				else
				{
					l.innerHTML = players[i].name + '<span class="scored">'+players[i].score+'</span>';
					Vlooser.play();
				}
				
				lp.appendChild(l)
			}
		}
	)
	
	.on('restartGame',
		function(allPlayers)
		{
			firstBlood = false;
			timeIsUp = false;
			var pos = BGMthemeBrutal.currentPosition;
			BGMthemeBrutal.pause();
			BGMthemeBrutal.currentPosition = pos;
			BGMthemeCalme.play();
			
			getId("endPannel").style.display = "none";
			
			tacheTab = new Array();
			players = {};
			for (i in allPlayers)
			{
				if (allPlayers[i].name == myName)
				{
					myIndex = i;
				}
				players[i] = new Perso(allPlayers[i].x,
										allPlayers[i].y,
										allPlayers[i].id,
										allPlayers[i].name,
										allPlayers[i].color,
										allPlayers[i].connected
							);
			}
			console.log("restartGame okay, myIndex : " + myIndex);
		}
	)
	
	.on('bye',
		function (username, time)
		{
			// someone left room
			addMessage(username, 'left game', time);
			players[username].connected = false;
		}
	)

	.on('error',
		function (error)
		{
			// an error occured
			alert('Error: ' + error);
		}
	)

	.on('message',
		function (username, message, time)
		{
			// someone wrote a message
			addMessage(username, message, time);
		}
	)
	
	.on('updateDir',
		function (id, orient)
		{
			if (!players[id])
			{
				return;
			}
			players[id].orientation = orient;
		}
	);
	 
	document.getElementById('message-form').onsubmit = function ()
	{
		socket.emit('write', messageInput.value);
		messageInput.value = '';
		return false;
	}
	
	socket.emit('initDatas');
}