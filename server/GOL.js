var cellCreator = require('./cell.js');
var _ = require('lodash');
var interval;
var ticksPerSecond = 10;
var generationNumber = 0;
var maxRow = 0;
var maxCol = 0;
var globalCurrentEnvironment = {};
var globalLiveCells = {};
var DEAD_COLOR = "#eeeeee";

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var killGame = function killGame(){
	clearInterval(interval);
};

var initializeGame = function initializeGame(initialLiveCells, maxRows, maxCols){
	if(!maxRows){
		maxRow = 29;
	}
	if(!maxCol){
		maxCol = 49;
	}
	globalLiveCells = initialLiveCells;
}

var runGame = function runGame(io){
	var game = function(liveCells){
		currentEnvironment = {};
		countNeighbors(liveCells, currentEnvironment);
		var nextGeneration = nextGen(currentEnvironment, liveCells);
		io.sockets.emit('nextGen', ++generationNumber, nextGeneration.cellsBorn, nextGeneration.cellsDied);
		console.log('generation: #%d', generationNumber);
		globalLiveCells = nextGeneration.liveCells;
	};
	interval = setInterval(game, 100,  _.clone(globalLiveCells, true));
};

var currentLiveCells = function currentLiveCells(){
	return globalLiveCells;
};

var getGenerationNumber = function getGenerationNumber(){
	return generationNumber;
};

var resetGame = function resetGame(){
	console.log('reseting generation number')
	generationNumber = 0;
	globalLiveCells = {};
	globalCurrentEnvironment = {};
}

var changeGridSize = function changeGridSize(rows, cols){
	maxRow = rows - 1;
	maxCol = cols - 1;
}

var nextGen = function nextGen(currentEnvironment, liveCells){
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

var killCell = function killCell(cell, environment, liveCells, cellsDied){
	cell.live = false;
	delete liveCells['cell' + cell.id];
	cellsDied['cell' + cell.id] = cell;
	updateNeighborCount(cell, environment, liveCells, -1);
};

var cellBorn = function cellBorn(cell, environment, liveCells, cellsBorn){
	cell.live = true;
	liveCells['cell' + cell.id] = cell;
	cellsBorn['cell' + cell.id] = cell;
	updateNeighborCount(cell, environment, liveCells, 1);
	console.log("new cell born" + JSON.stringify(cell));
	if(cell.neighbors > 0){
	cell.color = rgbToHex(Math.ceil(cell.intendedRed/cell.neighbors), Math.ceil(cell.intendedGreen/cell.neighbors), Math.ceil(cell.intendedBlue/cell.neighbors));
	} else {
		// WHY DOES THIS HAPPEN
		cell.color = "#000000";
	}
};

var countNeighbors = function countNeighbors(liveCells, environment){
	for(cell in liveCells){
		updateNeighborCount(liveCells[cell], environment, liveCells, 1);
	}
};

var addColors = function addColors(cell, borderCell) {
	// why does this happen
	//console.log
	if(!borderCell.color){
		return;
	}
	console.log ("converting " + borderCell.color);
	borderColors = hexToRgb(borderCell.color);
	cell.intendedRed += borderColors.r;
	cell.intendedGreen += borderColors.g;
	cell.intendedBlue += borderColors.b;

}

//i get the sense that this code could be vastly improved :P
//factor out repeating stuff into a function at least?
var updateNeighborCount = function updateNeighborCount(cell, environment, liveCells, change){
	var row = cell.row;
	var col = cell.col;
	var newID;
	var isAlive;

	cell.intendedRed = 0;
	cell.intendedGreen = 0;
	cell.intendedBlue = 0;

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
			addColors(cell, liveCells['cell' + newID]);
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, isAlive ? liveCells['cell' + newID].color : DEAD_COLOR, row - 1, col - 1, isAlive, 0); //{'id': newID, 'row': row - 1, 'col': col - 1, live: isAlive, 'neighbors': 0};
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
			addColors(cell, liveCells['cell' + newID]);
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, isAlive ? liveCells['cell' + newID].color : DEAD_COLOR, row - 1, col, isAlive, 0);//{'id': newID, 'row': row - 1, 'col': col, live: isAlive,'neighbors': 0};
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
			addColors(cell, liveCells['cell' + newID]);
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, isAlive ? liveCells['cell' + newID].color : DEAD_COLOR, row - 1, col + 1, isAlive, 0);//{'id': newID, 'row': row - 1, 'col': col + 1, live: isAlive, 'neighbors': 0};
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
			addColors(cell, liveCells['cell' + newID]);
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, isAlive ? liveCells['cell' + newID].color : DEAD_COLOR, row, col - 1, isAlive, 0);//{'id': newID, 'row': row, 'col': col - 1, live: isAlive, 'neighbors': 0};
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
			addColors(cell, liveCells['cell' + newID]);
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, isAlive ? liveCells['cell' + newID].color : DEAD_COLOR, row , col + 1, isAlive, 0);//{'id': newID, 'row': row, 'col': col + 1, live: isAlive, 'neighbors': 0};
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
			addColors(cell, liveCells['cell' + newID]);
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, isAlive ? liveCells['cell' + newID].color : DEAD_COLOR, row + 1, col - 1, isAlive, 0);//{'id': newID, 'row': row + 1, 'col': col - 1, live: isAlive, 'neighbors': 0};
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
			addColors(cell, liveCells['cell' + newID]);
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, isAlive ? liveCells['cell' + newID].color : DEAD_COLOR, row + 1, col, isAlive, 0);//{'id': newID, 'row': row + 1, 'col': col, live: isAlive, 'neighbors': 0};
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
			addColors(cell, liveCells['cell' + newID]);
		}
		if(!environment['cell' + newID]){
			environment['cell' + newID] = cellCreator.createCell(newID, isAlive ? liveCells['cell' + newID].color : DEAD_COLOR, row + 1, col + 1, isAlive, 0);//{'id': newID, 'row': row + 1, 'col': col + 1, live: isAlive, 'neighbors': 0};
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
		'resetGame': resetGame
};
