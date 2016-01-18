"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var _ = require('lodash');
var Cell = require('./cell.js');
var Environment = require('./environment.js');
var gol = require('./cpp/build/Release/gol.node');

var port = process.env.PORT || 5003;

app.use(express.static(__dirname+ '/../client'));

app.get('/', function expressRootRouter(request, response){
	response.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

var running = false;
var rows = 30;
var columns = 50;
var env = new Environment(rows,columns);
var interval;
var deadColor = '#eeeeee'
gol.createNewEnvironment(rows, columns);

io.on('connection', function socketConnectionHandler(socket){
	console.log('someone connected'); 
	socket.emit('join', env.liveCells, running, env.generationNumber);

	socket.on('stopping', function socketStoppingHandler(){
		running = false;
		io.sockets.emit('stopping');
		clearInterval(interval);
	});

	socket.on('running', function socketRunningHandler(){
		running = true;
		io.sockets.emit('running');
        var update = function (){
            gol.nextGeneration();
            console.log(gol.getGenerationNumber());
			env.nextGeneration();
			io.sockets.emit('nextGeneration', env.generationNumber, env.cellsBorn, env.cellsDied);
		};
		interval = setInterval(update, 80);
	});

	socket.on('clear', function socketClearingHandler(){
        gol.createNewEnvironment(rows, columns);
        env = new Environment(rows, columns);
		io.sockets.emit('clear');
	});

	socket.on('cell-selected', function socketCellSelectionHandler(id, color){
		var xY = id.split('-');
		var x = xY[0];
		var y = xY[1];
		env.setColorAndFlipCell(x,y,color);
		io.sockets.emit('life', id, color);
	});

	socket.on('cell-deselected', function socketCellDeselectionHandler(id){
		var xY = id.split('-');
		var x = xY[0];
		var y = xY[1];
		env.setColorAndFlipCell(x,y,deadColor);
		io.sockets.emit('death', id);
	});

	socket.on('disconnect', function socketDisconnectionHandler(){
		console.log('someone disconnected');
	});
});

http.listen(port);
