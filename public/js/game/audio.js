// BGM

var BGMthemeCalme     = getId("BGMthemeCalme");
var BGMthemeBrutal    = getId("BGMthemeBrutal");

// SE

var SEbruitDePas 	  = getId("SEbruitDePas");
var SEclic 		 	  = getId("SEclic");
var SEcollision  	  = getId("SEcollision");
var SEcrashContreMur  = getId("SEcrashContreMur");
var SEpousse		  = getId("SEpousse");
var SEsplash1		  = getId("SEsplash1");
var SEsplash2		  = getId("SEsplash2");
var SEfirstBlood	  = getId("SEfirstBlood");
var SEstun			  = getId("SEstun");

// Voices

var Varggh	  	  = getId("Varggh");
var Vaye	  	  = getId("Vaye");
var Vbye	  	  = getId("Vbye");
var Vha 	  	  = getId("Vha");
var Vhaaa	 	  = getId("Vhaaa");
var Vhahou	 	  = getId("Vhahou");
var Vhahouille	  = getId("Vhahouille");
var Vhaye  		  = getId("Vhaye");
var Vhou 		  = getId("Vhou");
var Vlooser		  = getId("Vlooser");
var Vouch		  = getId("Vouch");
var Vouche		  = getId("Vouche");
var Vouille		  = getId("Vouille");
var Vvictory	  = getId("Vvictory");

// DeathVoices

var deathVoiceTab = Array();
deathVoiceTab.push(Varggh);
deathVoiceTab.push(Vbye);
deathVoiceTab.push(Vaye);

// knockVoice

var knockVoiceTab = Array();
knockVoiceTab.push(Vha);
knockVoiceTab.push(Vhaaa);
knockVoiceTab.push(Vha);
knockVoiceTab.push(Vhahou);
knockVoiceTab.push(Vhahouille);
knockVoiceTab.push(Vhaye);
knockVoiceTab.push(Vhou);
knockVoiceTab.push(Vouch);
knockVoiceTab.push(Vouche);
knockVoiceTab.push(Vouille);

playRandomDeathVoice = function()
{
	var i = Math.floor(Math.random()*deathVoiceTab.length)
	deathVoiceTab[i].play();
}

playRandomKnockVoice = function()
{
	var i = Math.floor(Math.random()*knockVoiceTab.length)
	knockVoiceTab[i].play();
}