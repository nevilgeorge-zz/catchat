var socket = io();

socket.on('connect', function() {
	var nickname = prompt('What is your nickname?');
	socket.emit('join', nickname);
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
