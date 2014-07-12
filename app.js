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
		redisClient.ltrim('messages', 0, 20);
	});
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

	socket.on('check db', function(name) {
		redisClient.sismember('users', name, function(err, reply) {
			socket.emit('user status', reply, name);
		});
	});

	socket.on('join', function(name) {
		if (name != 'Untamed Wildcat') {
			redisClient.sadd('users', name);
		}
		socket.nickname = name;
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