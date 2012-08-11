/*///////////////////////
- created by Roliano Antoine aka Inateno


1_ in this "app.js" I use connect, socket.io, express and ejs (all files already in folders)

problems with deconnection
//////*/

var gamePort = 1001;

var players = {},
	nPlayers = 0;

var loopActivated= true
	, lastSecond = 0;

var totalScore = 0;

var respawnTime = 3000;

var timeIsUp = false;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var NONE = -1;

const path = require('path')
    , express = require('express')
    , app = module.exports = express.createServer()
    , port = gamePort //process.env.PORT || gamePort
    ;
 
/** Configuration */
app.configure(function()
	{
		this.set('views', path.join(__dirname, 'views'));
		this.set('view engine', 'ejs');
		this.use(express.static(path.join(__dirname, '/public')));
		// Allow parsing cookies from request headers
		this.use(express.cookieParser());
		// Session management
		// Internal session data storage engine, this is the default engine embedded with connect.
		// Much more can be found as external modules (Redis, Mongo, Mysql, file...). look at "npm search connect session store"
		this.sessionStore = new express.session.MemoryStore(
					{
						reapInterval: 60000 * 10
					}
		);
		
		this.use(express.session({
			// Private crypting key
			"secret": "some private string",
			"store":  this.sessionStore
		}));
		// Allow parsing form data
		this.use(express.bodyParser());
	}
);

app.configure('development',
		function()
		{
			this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
		}
);

app.configure('production',
		function()
		{
			this.use(express.errorHandler());
		}
);
 
/** Routes */
app.get('/session-index',
		function (req, res, next)
		{
			// Increment "index" in session
			req.session.index = (req.session.index || 0) + 1;
			// View "session-index.ejs"
			res.render('session-index',
						{
							"index":  req.session.index,
							"sessId": req.sessionID
						}
					);
		}
);

/** Middleware for limited access */
function requireLogin (req, res, next)
{
	if (req.session.username)
	{
		// User is authenticated, let him in
		next();
	}
	else
	{
		// Otherwise, we redirect him to login form
		res.redirect("/login");
	}
}

/** Home page (requires authentication) */
app.get('/', [requireLogin],
		function (req, res, next)
		{
			res.render('index',
						{
							"username": req.session.username
						}
					);
		}
);

/** Login form */
app.get("/login", function (req, res)
{
	// Show form, default value = current username
	res.render("login",
					{
						"username": req.session.username,
						"error": null 
					}
			);
});

app.post("/login",
	function (req, res)
	{
		var options = {
			"username": req.body.username,
			"error": null
		};
		if (!req.body.username)
		{
			options.error = "User name is required";
			res.render("login", options);
		}
		else if (req.body.username == req.session.username)
		{
			// User has not changed username, accept it as-is
			res.redirect("/");
		}
		else if (!req.body.username.match(/^[a-zA-Z0-9\-_]{3,}$/) ||
		req.body.username.match(/^[a-zA-Z0-9\-_]{11,}$/))
		{
			options.error = "User name must have at least 3 alphanumeric characters and less than 10";
			res.render("login", options);
		}
		else
		{
			// Validate if username is free
			req.sessionStore.all(function (err, sessions)
			{
				if (!err)
				{
					var found = false;
					for (var i = 0; i < sessions.length; i++)
					{
						var session = JSON.parse(sessions[i]);
						if (session.username == req.body.username)
						{
							err = "User name already used by someone else";
							found = true;
							break;
						}
					}
				}
				if (err)
				{
					options.error = ""+err;
					res.render("login", options);
				}
				else
				{
					req.session.username = req.body.username;
					res.redirect("/");
				}
			});
		}
	}
);

/** WebSocket */
var io = require('socket.io').listen(app);
io.set("log level", 1);
var sockets = io.of('/killMePlz');
const parseCookie = require('connect').utils.parseCookie;

sockets.authorization(function (handshakeData, callback)
	{
		// Read cookies from handshake headers
		var cookies = parseCookie(handshakeData.headers.cookie);
		// We're now able to retrieve session ID
		var sessionID = cookies['connect.sid'];
		// No session? Refuse connection
		if (!sessionID)
		{
			callback('No session', false);
		}
		else
		{
			// Store session ID in handshake data, we'll use it later to associate
			// session with open sockets
			handshakeData.sessionID = sessionID;
			// On récupère la session utilisateur, et on en extrait son username
			app.sessionStore.get(sessionID,
			function (err, session)
			{
				if (!err && session && session.username)
				{
					// On stocke ce username dans les données de l'authentification, pour réutilisation directe plus tard
					handshakeData.username = session.username;
					// OK, on accepte la connexion
					callback(null, true);
				}
				else
				{
					// Session incomplète, ou non trouvée
					callback(err || 'User not authenticated', false);
				}
			});
		}
	}
);

// Active sockets by session
var connections = {};
var x = 150, y = 50;

var TIMESTAMP = Date.now();

sockets.on('connection',
	function (socket) // New client
	{
		// Store session ID from handshake
		var sessionID = socket.handshake.sessionID;
		
		// this is required if we want to access this data when user leaves, as handshake is
		// not available in "disconnect" event.
		var username = socket.handshake.username; // Same here, to allow event "bye" with username
		if ('undefined' == typeof connections[sessionID] || !players[username])
		{
			connections[sessionID] = {
										"length": 0
									};
			// First connection
			// add a player in players array
			
			var color = giveMeAColor(nPlayers);
			nPlayers++;
			
			var newPlayer = {"x" : x, "y" : y,
						"id"	: username,
						"name" : username,
						"dir" : NONE,
						"orient" : RIGHT,
						"key" : 0,
						"dead" : false,
						"score" : 0,
						"color" : color,
						"isBlooded" : false,
						"connected" : true
					};
			
			players[username] = newPlayer;

			x += 300;
			if (x > 1800)
			{
				y += 150;
				x = 0;
			}
			if (y > 600)
			{
				y = 0;
			}
			
			sockets.emit('join',
							Date.now(),
							newPlayer,
							nPlayers
						);
		}
		else
		{
			nPlayers++;
			players[username].connected = true;
			sockets.emit('join',
							Date.now(),
							players[username],
							nPlayers
						);
		}
		
		// Add connection to pool
		connections[sessionID][socket.id] = socket;
		connections[sessionID].length ++;
		// When user leaves
		socket.on('disconnect',
			function ()
			{
				// Is this socket associated to user session ?
				var userConnections = connections[sessionID];
				if (userConnections.length && userConnections[socket.id])
				{
					// Forget this socket
					userConnections.length --;
					delete userConnections[socket.id];
				}
				
				if (userConnections.length == 0)
				{
					players[username].connected = false;
					nPlayers--;
					// No more active sockets for this user: say bye
					sockets.emit('bye',
									username,
									Date.now()
								);
				}
			});
		
		// New message from client = "write" event
		socket.on('write',
			function (message)
			{
				sockets.emit('message',
								username,
								message,
								Date.now()
							);
			}
		);
		
		socket.on('move',
			function (id, name, x, y, dir, orient, key)
			{
				if (timeIsUp)
				{
					return;
				}
				
				players[id].x = x;
				players[id].y = y;
				players[id].dir = dir;
				players[id].orient = orient;
				players[id].key = key;
				
				if (Date.now() - TIMESTAMP > 50)
				{
					sockets.emit('updatePos', players);
					TIMESTAMP = Date.now();
				}
			}
		);
		
		socket.on('upDir',
			function (id, orient)
			{
				players[id].orient = orient;
				sockets.emit('updateDir', id, orient);
			}
		);
		
		// gameLoop
		socket.on('totalInfo',
			function (id, posX, posY, animKey,
				dead, orient, dir, isBlooded)
			{
				players[id].x	= posX;
				players[id].y	= posY;
				players[id].key = animKey;
				players[id].dead= dead;
				players[id].orient	= orient;
				players[id].dir		= dir;
				players[id].isBlooded= isBlooded;
			}
		);
		
		socket.on('death',
			function (id, name, dead, killer)
			{
				players[id].score+=3;
				players[id].dead = dead;
				players[id].isBlooded = false;
				totalScore++;
				
				players[killer].isBlooded = true;
				if (players[killer].score > 0)
				{
					players[killer].score--;
				}
				
				sockets.emit('playerDead',
								totalScore, players[id], id,
								respawnTime, // temps de respawn
								players[killer],
								killer
							);
				
				setTimeout(function()
					{
						players[id].dead = false;
						players[id].x = 100 + Math.ceil(Math.random() * 1500);
						players[id].y = 50 + Math.ceil(Math.random() * 600);
						
						sockets.emit('playerRevive',
								players[id], id);
					}, respawnTime);
			}
		);
		
		socket.on('bounce',
			function (id, name, x, y, dir, orient, key)
			{
				if (timeIsUp)
				{
					return;
				}
				
				players[id].x = x;
				players[id].y = y;
				players[id].dir = dir;
				players[id].orient = orient;
				players[id].key = key;
				
				if (Date.now() - TIMESTAMP > 50)
				{
					sockets.emit('updateBounce', players[id]);
					TIMESTAMP = Date.now();
				}
			}
		);
		
		socket.on('bounceAndStun',
			function (id)
			{
			
			}
		);
		
		socket.on('initDatas',
			function ()
			{
				sockets.emit('initRDatas', players);
			}
		);
	}
);

var seconds, minutes;
function timeRemaining()
{
	seconds--;
	if (seconds < 0)
	{
		seconds = 59;
		minutes--;
	}
	
	if (minutes > 0 || seconds > 0)
	{
		sockets.emit('updateTime', minutes, seconds);
		setTimeout(timeRemaining, 1000);
	}
	else
	{
		loopActivated = false;
		sockets.emit('timesUp');
		
		timeIsUp = true;
		seconds = 10;
		decountTimeDisplayScorePannel();
	}
}

function decountTimeDisplayScorePannel()
{
	seconds--;
	
	if (seconds >= 0)
	{
		sockets.emit('updateTime', minutes, seconds);
		setTimeout(decountTimeDisplayScorePannel, 1000);
	}
	else
	{
		initGame();
	}
}

function initGame()
{
	loopActivated = true;
	
	seconds = 0;
	minutes = 2;
	
	totalScore = 0;
	var i = 0;
	// reset all players position
	for (p in players)
	{
		if (players[p].connected == false)
		{
			delete players[p];
			continue;
		}
		
		if (i < 4)
		{
			players[p].x = 50 + 300 * (i);
			players[p].y = 50;
		}
		else if (i < 8)
		{
			players[p].x = 50 + 300 * (i-4);
			players[p].y = 700;
		}
		else
		{
			players[p].x = 50 + 300 * Math.ceil(i / 8);
			players[p].y = 500;
		}
		players[p].score	= 0;
		players[p].dir		= NONE;
		players[p].dead		= false;
		i++;
	}
	
	sockets.emit('restartGame', players)
	timeIsUp = false;
	timeRemaining();
}

function giveMeAColor(id)
{
	switch (id)
	{
		case 0:
			return "red";
			break;
		case 1:
			return "green";
			break;
		case 2:
			return "blue";
			break;
		case 3:
			return "orange";
			break;
		case 4:
			return "purple";
			break;
		case 5:
			return "cyan";
			break;
		case 6:
			return "pink";
			break;
		case 7:
			return "yellow";
			break;
		default:
			return "rgb(" + Math.ceil(Math.random() * 255) + "," + Math.ceil(Math.random() * 255) + "," + Math.ceil(Math.random() * 255) + ")";
	}
}

initGame();

/** Start server */
if (!module.parent)
{
	app.listen(port)
}
