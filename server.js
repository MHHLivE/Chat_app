var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("Server Running...");

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', (socket) => {
	connections.push(socket);
	// console.log(socket);
	console.log(`Connected: ${connections.length} sockets are connected`);

	//Disconnecting :
	socket.on('disconnect', (data) => {
		console.log(socket.username);
		connections.splice(connections.indexOf(socket), 1);
		console.log(connections.indexOf(socket));
		if(!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		console.log(users.indexOf(socket.username));
		updateUsernames();
		console.log(`ِDisconnected: ${connections.length} sockets are connected`);
	});

	//Send message :
	socket.on('send message', (data) => {
		io.sockets.emit('new message', {msg: data, username: socket.username});
	});

	//New user :
	socket.on('new user', (data, callback) =>{
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	// Update usernames :
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});