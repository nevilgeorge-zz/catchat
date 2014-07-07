// app.js
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// allows stylesheet "styling.css" to be used
app.use(express.static(__dirname));

app.get('/', function(request, response) {
	response.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log('A user has connected!');
	socket.on('join', function(name) {
		socket.nickname = name;
	});

	socket.on('message', function(msg){
		var nickname = socket.nickname;
		io.emit('message', nickname + ': ' + msg);
	});
});

http.listen(8080, function() {
	console.log('Listening on 8080...');
});