var baseSpeed = 7;
var baseAnimSpeed = 60;
var accelerationSpeed = 600;
var maxAcceleration = 1000;
var miniSprintToDerap = 600;
var timeToRecule = 100;
var timeToPousse = 250;
var maxSpeed = 18;

var persoWidth = 80;
var persoHeight = 50;

var explosionSangNbKey = 7;
var explosionSangWidth = 300;
var explosionSangHeight = 300;
var explosionSangUrl = "/img/sang/explosion_sang.png";
var explosionSangAnimeSpeed = 40;

var urlMove 		= "/img/sprites/perso.png";
var urlMoveBlood 	= "/img/sprites/persoBlood.png";
var urlRespawn  	 = "/img/sprites/respawn.png";
var urlRespawnShadow = "/img/sprites/respawn_shadow.png";
var urlStun 		 = "/img/sprites/persoStun.png";
var urlStunBlood 	 = "/img/sprites/persoStunBlood.png";

var urlbloodTache1 = "/img/sang/sang_1.png";
var urlbloodTache2 = "/img/sang/sang_2.png";
var urlbloodTache3 = "/img/sang/sang_3.png";
var urlbloodTache4 = "/img/sang/sang_4.png";

var tacheWidthMin   = 60;
var tacheWidthMax   = 200;
var tacheHeightMin  = 60;
var tacheHeightMax  = 160;

var dureeStun = 2000;
var speedForStun = 12;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var myIndex = 0;
var myName = "";

var moveVertical = false;
var moveHorizontal = false;

var screenWidth, screenHeight;

var firstBlood = false;
var imDead = false;
var timeRespawn = 3;
var timeIsUp = false;

var imgBack = new Image()
	, imgBackW = 0
	, imgBackH = 0;

var displayListOrder = new Array();
var connected = false,
	sendDatasCount = 0,
	maxCountToSend = 3;