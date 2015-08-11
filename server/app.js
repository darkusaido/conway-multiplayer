var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(__dirname+ '/../client'));

app.get('/', function(request, response){
	response.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

var livingCells = {};
var running = false;

io.on('connection', function(socket){
	console.log('someone connected');
	socket.emit('join', livingCells, running);

	socket.on('stopping', function(){
		running = false;
		io.sockets.emit('stopping');
	});

	socket.on('running', function(){
		running = true;
		io.sockets.emit('running');
	});

	socket.on('clear', function(){
		io.sockets.emit('clear', livingCells);
		livingCells = {};
	})

	socket.on('cell-selected', function(id){
		livingCells['cell' + id] = id; 
		io.sockets.emit('life', id);
	});

	socket.on('cell-deselected', function(id){
		delete livingCells['cell' + id];
		io.sockets.emit('death', id);
	});

	socket.on('disconnect', function(){
		console.log('someone disconnected');
	});
});

http.listen(80);