// app.js
var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);
	redis = require('redis'),
	redisClient = redis.createClient();

var storeMessage = function(name, message) {
	var string = name + ': ' + message;
	redisClient.lpush('messages', string, function() {
		redisClient.ltrim('messages', 0, 25);
	});
}

var checkDB = function(name) {
	var reply = redisClient.lrange('users', 0, -1);
	for (var i = 0; i < reply.length; i++) {
		console.log(reply.length);
		if (reply[i] == name) {
			return true;
		}
	}
	return false;
};

// allows stylesheet "styling.css" to be used
app.use(express.static(__dirname));

app.get('/', function(request, response) {
	response.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log('A user has connected!');
	/*socket.on('join', function(name) {
		socket.nickname = name;
	});*/

	socket.on('join', function(name) {
		var exists = checkDB(name);
		console.log(exists);
		if (!exists) {
			socket.nickname = name;
			redisClient.lpush('users', name);
		} else {
			console.log('exists!');
		}
	});

	socket.on('join', function(name) {
		redisClient.lrange('messages', 0, -1, function(err, reply) {
			var messages = reply.reverse();
			reply.forEach(function(message) {
				socket.emit('message', message);
			});
		});
	});

	socket.on('message', function(msg){
		var nickname = socket.nickname;
		io.emit('message', nickname + ': ' + msg);
	});

	socket.on('message', function(msg) {
		var nickname = socket.nickname;
		storeMessage(nickname, msg);
	});
});

http.listen(8080, function() {
	console.log('Listening on 8080...');
});