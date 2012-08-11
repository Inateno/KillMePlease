function onKeyDown(event)
{
	var key = event.keyCode;
	switch (key)
	{
		case 38: // Up
			{
				if(!keyUpDown && !players[myIndex].isRecule
				&& !timeIsUp
				&& !players[myIndex].isStun)
				{
					keyUpDown = true;
					moveVertical = true;
				}
				event.preventDefault();
			}
		break;
		case 40: // Down
			{
				if(!keyDownDown && !players[myIndex].isRecule
				&& !timeIsUp
				&& !players[myIndex].isStun)
				{
					keyDownDown = true;
					moveVertical = true;
				}
				event.preventDefault();
			}
		break;
		case 37: // Left
			{
				if(!keyLeftDown && !players[myIndex].isRecule
				&& !timeIsUp
				&& !players[myIndex].isStun)
				{
					keyLeftDown = true;
					moveHorizontal= true;
				}
				event.preventDefault();
			}
		break;
		case 39: // Right
			{
				if(!keyRightDown && !players[myIndex].isRecule
				&& !timeIsUp
				&& !players[myIndex].isStun)
				{
					keyRightDown = true;
					moveHorizontal= true;
				}
				event.preventDefault();
			}
		break;
	}
}

function onKeyUp(event)
{
	var key = event.keyCode;
	switch (key)
	{
		case 38: // Up
			{
				keyUpDown = false;
				
				if(players[myIndex].sprintTime >= miniSprintToDerap)
				{
					players[myIndex].desceleration = true;
				}
				else
				{
					players[myIndex].sprintTime = 0;
				}
				
				if (!keyDownDown)
				moveVertical = false;
				event.preventDefault();
			}
		break;
		case 40: // Down
			{
				keyDownDown = false;
				
				if(players[myIndex].sprintTime >= miniSprintToDerap)
				{
					players[myIndex].desceleration = true;
				}
				else
				{
					players[myIndex].sprintTime = 0;
				}
				
				if (!keyUpDown)
				moveVertical = false;
				event.preventDefault();
			}
		break;
		case 37: // Left
			{
				keyLeftDown = false;
				
				if(players[myIndex].sprintTime >= miniSprintToDerap)
				{
					players[myIndex].desceleration = true;
				}
				else
				{
					players[myIndex].sprintTime = 0;
				}
			
				if (!keyRightDown)
				moveHorizontal = false;
				event.preventDefault();
			}
		break;
		case 39: // Right
			{
				keyRightDown = false;
				
				if(players[myIndex].sprintTime >= miniSprintToDerap)
				{
					players[myIndex].desceleration = true;
				}
				else
				{
					players[myIndex].sprintTime = 0;
				}
				
				if (!keyLeftDown)
				moveHorizontal = false;
				event.preventDefault();
			}
		break;
	}
	
	if(!keyRightDown && !keyLeftDown && !keyUpDown && !keyDownDown)
	{
		SEbruitDePas.pause();
	}
}