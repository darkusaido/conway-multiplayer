var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var game = require('./GOL.js');

var port = process.env.PORT || 5003;

app.use(express.static(__dirname+ '/../client'));

app.get('/', function(request, response){
	response.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

var liveCells = {};
var running = false;

io.on('connection', function(socket){
	console.log('someone connected');
	socket.emit('join', game.currentGen || liveCells, running, game.getGenerationNumber());

	socket.on('stopping', function(){
		running = false;
		game.killGame();
		liveCells = game.currentGen;
		io.sockets.emit('stopping');
	});

	socket.on('running', function(){
		running = true;
		io.sockets.emit('running');
		game.initializeGame(liveCells);
		game.runGame(io);
	});

	socket.on('clear', function(){
		io.sockets.emit('clear', liveCells);
		liveCells = {};
	});

	socket.on('cell-selected', function(id){
		var rowCol = id.split('-');
		liveCells['cell' + id] = {'id': id, 'row': rowCol[0], 'col':rowCol[1], 'live': true, 'neighbors': 0};
		io.sockets.emit('life', id);
	});

	socket.on('cell-deselected', function(id){
		delete liveCells['cell' + id];
		io.sockets.emit('death', id);
	});

	socket.on('disconnect', function(){
		console.log('someone disconnected');
	});
});

http.listen(port);
