var cellCreator = require('./cell.js');
var _ = require('lodash');
var interval;
var ticksPerSecond = 10;
var generationNumber = 0;
var maxRow = 0;
var maxCol = 0;
var globalCurrentEnvironment = {};
var globalLiveCells = {};

var killGame = function(){
	clearInterval(interval);
};

var initializeGame = function (initialLiveCells, maxRows, maxCols){
	if(!maxRows){
		maxRow = 29;
	}
	if(!maxCol){
		maxCol = 49;
	}
	globalLiveCells = initialLiveCells;
}

var runGame = function(io){
	var game = function(liveCells){
		currentEnvironment = {};
		countNeighbors(liveCells, currentEnvironment);
		var nextGeneration = nextGen(currentEnvironment, liveCells);
		io.sockets.emit('nextGen', ++generationNumber, nextGeneration.cellsBorn, nextGeneration.cellsDied);
		console.log('generation: #%d', generationNumber);
		globalLiveCells = nextGeneration.liveCells;
	};
	interval = setInterval(game, 1000/ticksPerSecond,  _.clone(globalLiveCells, true));
};

var currentLiveCells = function(){
	return globalLiveCells;
};

var getGenerationNumber = function(){
	return generationNumber;
};

var resetGame = function(){
	console.log('reseting generation number')
	generationNumber = 0;
	globalLiveCells = {};
	globalCurrentEnvironment = {};
}

var changeGridSize = function(rows, cols){
	maxRow = rows - 1;
	maxCol = cols - 1;
}

var nextGen = function(currentEnvironment, liveCells){
	var cellsBorn = {};
	var cellsDied = {};
	var nextEnvironment = _.clone(currentEnvironment, true);

	for(cell in currentEnvironment){
		if(currentEnvironment[cell].live && (currentEnvironment[cell].neighbors < 2 || currentEnvironment[cell].neighbors > 3)){
			killCell(nextEnvironment[cell], nextEnvironment, liveCells, cellsDied);
		}
		else if(!currentEnvironment[cell].live && currentEnvironment[cell].neighbors === 3){
			cellBorn(nextEnvironment[cell], nextEnvironment, liveCells, cellsBorn);
		}
	}
	return {
		'nextEnvironment':nextEnvironment,
		'cellsBorn':cellsBorn,
		'cellsDied':cellsDied, 
		'liveCells':liveCells
	}
};

var killCell = function(cell, environment, liveCells, cellsDied){
	cell.live = false;
	delete liveCells['cell' + cell.id];
	cellsDied['cell' + cell.id] = cell;
	updateNeighborCount(cell, environment, liveCells, -1);
};

var cellBorn = function(cell, environment, liveCells, cellsBorn){
	cell.live = true;
	liveCells['cell' + cell.id] = cell;
	cellsBorn['cell' + cell.id] = cell;
	updateNeighborCount(cell, environment, liveCells, 1);
};

var countNeighbors = function(liveCells, environment){
	for(cell in liveCells){
		updateNeighborCount(liveCells[cell], environment, liveCells, 1);
	}
};

var updateNeighborCount = function(cell, environment, liveCells, change){
	var row = cell.row;
	var col = cell.col;
	var newID;
	var isAlive;

	//exclude out of bounds cells
	if(row < 0 || col < 0 || row > maxRow || col > maxCol){
		return;
	}
	//top left neighbor
	if(row > 0 && col > 0){
		isAlive = false;
		newID = (row - 1) + '-' + (col - 1);
		if(liveCells['cell' + newID]){
			liveCells['cell' + newID].neighbors += change;
			isAlive = true;
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, row - 1, col - 1, isAlive, 0); //{'id': newID, 'row': row - 1, 'col': col - 1, live: isAlive, 'neighbors': 0};
		}
		environment['cell' + newID].neighbors+= change;
	}
	//top neighbor
	if(row > 0){
		isAlive = false;
		newID = (row - 1) + '-' + (col);
		if(liveCells['cell' + newID]){
			liveCells['cell' + newID].neighbors+= change;
			isAlive = true;
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, row - 1, col, isAlive, 0);//{'id': newID, 'row': row - 1, 'col': col, live: isAlive,'neighbors': 0};
		}

		environment['cell' + newID].neighbors+= change;
	}
	//top right neighbor
	if(row > 0 && col < maxCol){
		isAlive = false;
		newID = (row - 1) + '-' + (col + 1);
		if(liveCells['cell' + newID]){
			liveCells['cell' + newID].neighbors+= change;
			isAlive = true;
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, row - 1, col + 1, isAlive, 0);//{'id': newID, 'row': row - 1, 'col': col + 1, live: isAlive, 'neighbors': 0};
		}

		environment['cell' + newID].neighbors+= change;
	}
	//left neighbor
	if(col > 0){
		isAlive = false;
		newID = (row) + '-' + (col - 1);
		if(liveCells['cell' + newID]){
			liveCells['cell' + newID].neighbors+= change;
			isAlive = true;
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, row, col - 1, isAlive, 0);//{'id': newID, 'row': row, 'col': col - 1, live: isAlive, 'neighbors': 0};
		}

		environment['cell' + newID].neighbors+= change;
	}
	//right neighbor
	if(col < maxCol){
		isAlive = false;
		newID = (row) + '-' + (col + 1);
		if(liveCells['cell' + newID]){
			liveCells['cell' + newID].neighbors+= change;
			isAlive = true;
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, row , col + 1, isAlive, 0);//{'id': newID, 'row': row, 'col': col + 1, live: isAlive, 'neighbors': 0};
		}

		environment['cell' + newID].neighbors+= change;
	}
	//bottom left neightbor
	if(row < maxRow && col > 0){
		isAlive = false;
		newID = (row + 1) + '-' + (col - 1);
		if(liveCells['cell' + newID]){
			liveCells['cell' + newID].neighbors+= change;
			isAlive = true;
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, row + 1, col - 1, isAlive, 0);//{'id': newID, 'row': row + 1, 'col': col - 1, live: isAlive, 'neighbors': 0};
		}

		environment['cell' + newID].neighbors+= change;
	}
	//bottom neighbor
	if(row < maxRow){
		isAlive = false;
		newID = (row + 1) + '-' + (col);
		if(liveCells['cell' + newID]){
			liveCells['cell' + newID].neighbors+= change;
			isAlive = true;
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, row + 1, col, isAlive, 0);//{'id': newID, 'row': row + 1, 'col': col, live: isAlive, 'neighbors': 0};
		}

		environment['cell' + newID].neighbors+= change;
	}
	//bottom right neighbor
	if(row < maxRow && col < maxCol){
		isAlive = false;
		newID = (row + 1) + '-' + (col + 1);
		if(liveCells['cell' + newID]){
			liveCells['cell' + newID].neighbors+= change;
			isAlive = true;
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, row + 1, col + 1, isAlive, 0);//{'id': newID, 'row': row + 1, 'col': col + 1, live: isAlive, 'neighbors': 0};
		}

		environment['cell' + newID].neighbors+= change;
	}
};

module.exports = {
		'killGame': killGame,
		'initializeGame': initializeGame,
		'runGame':runGame,
		'getGenerationNumber': getGenerationNumber,
		'currentLiveCells':currentLiveCells,
		'resetGame': resetGame,
		//test functions
		'updateNeighborCount': updateNeighborCount,
		'changeGridSize':changeGridSize
};
