// app.js
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(request, response) {
	response.sendfile('index.html');
});

// allows stylesheet "styling.css" to be used
app.use(express.static(__dirname));

io.on('connection', function(client) {
	console.log('A user has connected!');

	// logs to console if a user disconnects
	client.on('disconnect', function() {
		console.log('A user has disconnected.');
	});

	client.on('message', function(data) {
		console.log(data);
	});
});

http.listen(8080, function() {
	console.log('Listening on 8080...');
});