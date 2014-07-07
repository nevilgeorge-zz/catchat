// app.js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(request, response) {
	response.sendfile('index.html');
});

io.on('connection', function(client) {
	console.log('A user has connected!');
	client.on('disconnect', function() {
		console.log('A user has disconnected.');
	});
});

http.listen(8080, function() {
	console.log('Listening on 8080...');
});