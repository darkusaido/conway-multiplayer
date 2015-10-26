var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var game = require('./GOL.js');
var _ = require('lodash');
var cellCreator = require('./cell.js');

var port = process.env.PORT || 5003;

app.use(express.static(__dirname+ '/../client'));

app.get('/', function(request, response){
	response.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

var liveCells = {};
var running = false;

io.on('connection', function(socket){
	console.log('someone connected');
	var currentLiveCells = game.currentLiveCells()
	socket.emit('join', _.isEmpty(currentLiveCells) ? liveCells : currentLiveCells, running, game.getGenerationNumber());

	socket.on('stopping', function(){
		running = false;
		game.killGame();
		liveCells = game.currentLiveCells();
		io.sockets.emit('stopping');
	});

	socket.on('running', function(){
		running = true;
		io.sockets.emit('running');
		game.initializeGame(liveCells);
		game.runGame(io);
	});

	socket.on('clear', function(){
		game.resetGame();
		io.sockets.emit('clear', liveCells, game.getGenerationNumber());
		liveCells = {};
	});

	socket.on('cell-selected', function(id, color){
		var rowCol = id.split('-');
		console.log("cell with " + color);
		liveCells['cell' + id] = cellCreator.createCell(id, color, parseInt(rowCol[0], 10), parseInt(rowCol[1], 10), true, 0);
		io.sockets.emit('life', liveCells['cell' + id]);
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
