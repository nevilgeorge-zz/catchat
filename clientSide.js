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
	socket.emit('check db', nickname);
});

socket.on('user status', function(status, name) {
	if (status == 1) {
		alert('User already exists!');
		var nickname = askNickname();
		socket.emit('check db', nickname);
	} else {
		console.log(name);
		socket.emit('join', name);
	}
})

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
