var interval;
var ticksPerSecond = 60;
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
	var liveCells = globalLiveCells;
	var currentEnvironment = globalCurrentEnvironment;
	countNeighbors(liveCells, currentEnvironment);
	var game = function(){
		var nextGeneration = nextGen(currentEnvironment, liveCells);
		io.sockets.emit('nextGen', ++generationNumber, nextGeneration.cellsBorn, nextGeneration.cellsDied);
		console.log('generation: #%d', generationNumber);
		currentEnvironment = nextGeneration.nextEnvironment;
		globalCurrentEnvironment = currentEnvironment;
		globalLiveCells = nextGeneration.liveCells;
	};
	interval = setInterval(game, 1000/ticksPerSecond);
};

var currentLiveCells = function(){
	return globalLiveCells;
};

var generationNumber = function(){
	return generationNumber;
};

var changeGridSize = function(rows, cols){
	maxRow = rows - 1;
	maxCol = cols - 1;
}

var nextGen = function(currentEnvironment, liveCells){
	var cellsBorn = cellsDied = {};
	var nextEnvironment = currentEnvironment;
	for(cell in currentEnvironment){
		if(currentEnvironment[cell].live && (currentEnvironment[cell].neighbors < 2 || currentEnvironment[cell].neighbors > 3)){
			killCell(currentEnvironment[cell], nextEnvironment, liveCells, cellsDied);
		}
		else if(!currentEnvironment[cell].live && currentEnvironment[cell].neighbors === 3){
			cellBorn(currentEnvironment[cell], nextEnvironment, liveCells, cellsBorn);
		}
	}
	return {
		'nextEnvironment':nextEnvironment,
		'cellsBorn':``,
		'cellsDied':cellsDied, 
		'liveCells':liveCells
	}
};

var killCell = function(cell, environment, liveCells, cellsDied){
	cell.live = false;
	delete liveCells['cell' + cell.id];
	cellsDied['cell' + cell.id] = cell;
	updateNeighborCount(cell, environment, -1);
};

var cellBorn = function(cell, environment, liveCells, cellsBorn){
	cell.live = true;
	liveCells['cell' + cell.id] = cell;
	cellsBorn['cell' + cell.id] = cell;
	updateNeighborCount(cell, environment, 1);
};

var countNeighbors = function(liveCells, currentEnvironment){
	for(cell in liveCells){
		updateNeighborCount(liveCells[cell], currentEnvironment, liveCells, 1);
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
			liveCells['cell' + newID].neighbors+= change;
			isAlive = true;
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = {'id': newID, 'row': row - 1, 'col': col - 1, live: isAlive, 'neighbors': 0};
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
			environment['cell' + newID] = {'id': newID, 'row': row - 1, 'col': col, live: isAlive,'neighbors': 0};
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
			environment['cell' + newID] = {'id': newID, 'row': row - 1, 'col': col + 1, live: isAlive, 'neighbors': 0};
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
			environment['cell' + newID] = {'id': newID, 'row': row, 'col': col - 1, live: isAlive, 'neighbors': 0};
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
			environment['cell' + newID] = {'id': newID, 'row': row, 'col': col + 1, live: isAlive, 'neighbors': 0};
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
			environment['cell' + newID] = {'id': newID, 'row': row + 1, 'col': col - 1, live: isAlive, 'neighbors': 0};
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
			environment['cell' + newID] = {'id': newID, 'row': row + 1, 'col': col, live: isAlive, 'neighbors': 0};
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
			environment['cell' + newID] = {'id': newID, 'row': row + 1, 'col': col + 1, live: isAlive, 'neighbors': 0};
		}

		environment['cell' + newID].neighbors+= change;
	}
};

module.exports = {
		'killGame': killGame,
		'initializeGame': initializeGame,
		'runGame':runGame,
		'generationNumber': generationNumber,
		'currentLiveCells':currentLiveCells,
		//test functions
		'updateNeighborCount': updateNeighborCount,
		'changeGridSize':changeGridSize
};
