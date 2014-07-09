var socket = io();

socket.on('connect', function() {
	var nickname = prompt('What is your nickname?');
	if (nickname === null) {
		nickname = 'Untamed Wildcat';
	}
	socket.emit('join', nickname);
});

socket.on('user error', function(error) {
	console.log(error);
	alert(error);
});

$('form').submit(function(event) {
	var msg = $('#m').val();
	if (msg != '') {
		socket.emit('message', msg);
	}
	$('#m').val('');
	event.preventDefault();
});

socket.on('message', function(data) {
	$('#messages').append('<li>' + data + '</li>');
});
