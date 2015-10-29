var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var _ = require('lodash');


var cellCreator = require('./cellFactory.js');
//create new game
var GameOfLife = require('./GameOfLife.js');
var game = new GameOfLife([], 50, 30);

var port = process.env.PORT || 5003;

app.use(express.static(__dirname+ '/../client'));

app.get('/', function(request, response){
	response.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

var runGame = function () {
	io.sockets.emit('iterate', game.iterate());
}

//run game every second, regardless of users
setInterval(runGame, 1000);

io.on('connection', function(socket){
	console.log('someone connected');
	socket.emit('join', game.getCurrentCells());

	socket.on('add', function(id){
		var rowCol = id.split('-');
		var row = parseInt(rowCol[0], 10);
		var col = parseInt(rowCol[1], 10);
		var newCell = cellCreator.createCell(row, col);
		game.addCell(newCell);
		io.sockets.emit('add', newCell);
	});
});

http.listen(port);
