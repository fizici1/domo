document.getElementById('controle').className= 'active';

var socket = io.connect('http://127.0.0.1:8080');


var btn = document.getElementById('LEDbtn');
btn.addEventListener('click', updateBtn);

function updateBtn() {
	if (btn.value === 'Allumer') {
		btn.value = 'Eteindre';
		socket.emit('LED', 'on');
	} else {
		btn.value = 'Allumer';
		socket.emit('LED','off');
	}
}
