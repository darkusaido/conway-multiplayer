var cellCreator = require('./cell.js');

// GAME OF LIFE AS OBJECT
//considers a "cell" to be any object with a row and col field
var GameOfLife = function(liveCellArray, width, height) {
	this.width = width;
	this.height = height;
	this.currentArray = [];

	var currentCell;

	//set defaults
	for(var x = 0; x < width; x++) {
		for(var y = 0; y < height; y++) {
			//null means dead/not alive
			currentArray[x][y] = null;
		}
	}

	//add currently alive cells
	for(var cell_num = 0; cell_num < liveCellArray.length; cell_num++) {
		currentCell = liveCellArray[cell_num];
		currentArray[currentCell.col][currentCell.row] = currentCell;
	}
}

//iterate once, and report any cells that have changed as an array
GameOfLife.prototype.iterate = function () {
	var newArray = [];
	var currentSum = 0;
	var changedCells = [];

	var getValue = function(x, y) {
		var cell = this.currentArray[x][y];

		//null is dead cell, undefined is bad access
		return !!cell ? 1 : 0;
	}

	var getSum = function (x, y) {
		var sum = 0;

		// each cell in 3x3 around center, including center
		for(var x_index = x-1; x_index <= x+1; x_index++) {
			for(var y_index = y-1; y_index <= y+1; y_index++) {
				sum += getValue(x_index, y_index);
			}
		}
	}

	for(var x = 0; x < this.width; x++) {
		for(var y = 0; y < this.height; y++) {
			currentSum = getSum(x, y);

			// more succint version of the rules based on the total sum in a 3x3 (including center)

			//LIFE
			if(currentSum == 3) {
				newArray[x][y] = cellCreator.createCell(x, y);

				//if changed, add to toggle list
				if(currentArray[x][y] === null) {
					changedCells.push_back(newArray[x][y]);
				}

				//CONSTANT
			} else if (currentSum == 4) {
				newArray[x][y] = currentArray[x][y];

				// DEATH
			} else {
				newArray[x][y] = null;

				//if changed, add to toggle list
				if(currentArray[x][y] !== null) {
					changedCells.push_back(currentArray[x][y]);
				}
			}
		}
	}

	return changedCells;
}

GameOfLife.prototype.addCell(cell) {
	currentArray[cell.x][cell.y] = cell;
}

GameOfLife.prototype.currentCells() {
	var liveCells = [];
	
	for(var x = 0; x < this.width; x++) {
		for(var y = 0; y < this.height; y++) {
			liveCells.push_back(currentArray[x][y]);
		}
	}

	return liveCells;
}


module.exports = GameOfLife;