/** Form */
var messageInput = document.getElementById('message-input');
/** Display */
var messagesArea = document.getElementById('messages');
var sio = null, socket = null;

var p1, p2, p3, p4, p5, p6, p7, p8;

// par arthur
var canvas = document.getElementById("canvas")
var ctx = null;
var ctxWidth = 0;
var ctxHeight = 0; 

var players = {};
var tacheTab = Array();
var explosionSangTab = Array();

var keyUpDown 	 = false;
var keyDownDown  = false;
var keyLeftDown  = false;
var keyRightDown = false;

var keyUpDown2	  = false;
var keyDownDown2  = false;
var keyLeftDown2  = false;
var keyRightDown2 = false;

var timeSinceLastFrame = 0;
var oldDate =  Date.now();

window.onload = function()
{
	sio = io.connect();
	socket = sio.socket.of('/killMePlz');
	
	myName = getId("myName").innerHTML;
	
	initSocket();
	
	screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	
	canvas.width = 1800;//screenWidth - 120;
	canvas.height= 850;	//screenHeight - 150;
	ctx = canvas.getContext("2d");
	checkConnection();
}

function checkConnection()
{
	if (connected == false)
	{
		setTimeout(function()
			{
				if (connected == false)
				{
					socket.emit('initDatas');
					checkConnection();
				}
			}, 2500);
	}
}

function initGame()
{
	if (firstBlood)
	{
		BGMthemeBrutal.play();
	}
	else
	{
		BGMthemeCalme.play();
	}
	
	if(!ctx)
	{
		alert("Canvas Creation problem");
	}
	
	imgBack.src = "/img/killmeplease_sol02.png";
	
	imgBack.onload = function() 
	{
		if (!this.complete) 
			throw "Erreur de chargement du sprite nommé \"" + url + "\".";
		
		imgBackW = this.width;
		imgBackH = this.height;
	}
	
	window.onkeyup = function(event) 
	{
		onKeyUp(event);
	}
	
	window.onkeydown = function(event)
	{
		onKeyDown(event);
	}
	
	p1 = getId("p1");p2 = getId("p2");
	p3 = getId("p3");p4 = getId("p4");
	p5 = getId("p5");p6 = getId("p6");
	p7 = getId("p7");p8 = getId("p8");
	
	// Initialisation de la taille du canvas.
	ctxWidth = canvas.width;
	ctxHeight = canvas.height;
	run();
}

function decreaseRespawnTime()
{
	timeRespawn--;
	
	if (timeRespawn > 0)
	{
		setTimeout(decreaseRespawnTime, 1000);
	}
}
// fonction getId
function getId(id){return  document.getElementById(id);}