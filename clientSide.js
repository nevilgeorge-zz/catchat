var socket = io();

var askNickname = function() {
	var nickname = prompt('What is your nickname?');
	if (nickname === null || nickname === '') {
		nickname = 'Untamed Wildcat';
	}
	return nickname;
}

socket.on('connect', function() {
	var nickname = askNickname();
	socket.emit('join', nickname);
});

socket.on('user error', function(error) {
	alert(error);
	var nickname = askNickname();
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
