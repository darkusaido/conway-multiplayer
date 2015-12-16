"use strict";
var _ = require('lodash');
var Cell = require('./cell.js');

//instance vars
var _cells = Symbol();
var _rows = Symbol();
var _columns = Symbol();
var _liveCells = Symbol();
var _cellsBorn = Symbol();
var _cellsDied = Symbol();
var _generationNumber = Symbol();

//constants
var deadColor = '#eeeeee';

module.exports = class Environment {
	constructor(rows, columns){
		this[_rows] = rows; 
		this[_columns] = columns;
		this[_cells] = make2DArray(rows, columns);
		this[_liveCells] = {};
		this[_generationNumber] = 0;
	}

	get cells(){
		return this[_cells];
	}

	get liveCells(){
		return this[_liveCells];
	}
	get cellsBorn(){
		return this[_cellsBorn];
	}
	get cellsDied(){
		return this[_cellsDied];
	}

	get generationNumber(){
		return this[_generationNumber];
	}

	//for internal use in the nextGeneration method only, not properly type checking since this 
	//will likely be the main operation of the game loop, and will probs not be needed externally 
	set cells(otherCells){
		for(var i = 0; i < otherCells.length; i++){
			var otherColumn = otherCells[i];
			for(var j = 0; j < otherColumn.length; j++){
				this[_cells][i][j] = otherColumn[j].clone();
			}
		}
	}

	flipCell(x,y){
		if(x < 0 || x >= this[_columns] || y < 0 || y >= this[_rows]){
			throw new RangeError("index out of bounds");
		}
		var cell = this[_cells][x][y]; 
		var wasAlive = cell.alive;
		cell.toggleLife();
		if(wasAlive){
			delete this[_liveCells][cell.id];
		}
		else {
			this[_liveCells][cell.id] = cell.color;
		}
	}

	setCellColor(x, y, color){
		if(x < 0 || x >= this[_columns] || y < 0 || y >= this[_rows]){
			throw new RangeError("index out of bounds");
		}
		this[_cells][x][y].color = color;
	}

	setColorAndFlipCell(x, y, color){
		this.setCellColor(x,y,color);
		this.flipCell(x,y);
	}

	nextGeneration(){
		this[_generationNumber]++;
		var nextEnv = new Environment(this[_rows], this[_columns]);
		nextEnv.cells = this[_cells];
		this[_cellsBorn] = {};
		this[_cellsDied] = {};
		for(var j = 0; j < this[_rows]; j++){
			for(var i = 0; i < this[_columns]; i++){
				var currCell = this[_cells][i][j];
				var alive = currCell.alive;
				var neighborCountAndColor = this.neighborCountAndAverageColor(i,j);
				var neighborCount = neighborCountAndColor.count;
				var averageColor = neighborCountAndColor.color;
				if(alive && (neighborCount < 2 || neighborCount > 3)) {
					nextEnv.setColorAndFlipCell(i,j,deadColor);
					delete this[_liveCells][currCell.id];
					//passing 0 as value because the cell id passed as the key expresses enough information
					this[_cellsDied][currCell.id] = 0;
				}
				else if(!alive && neighborCount === 3){
					nextEnv.setColorAndFlipCell(i,j,averageColor);
					//the client only needs to know the color
					this[_liveCells][currCell.id] = averageColor;
					this[_cellsBorn][currCell.id] = averageColor;
				}
			}
		}
		this[_cells] = nextEnv.cells;
	}

	//violates sigle responsability principle, but avoids passing through entire grid twice
	//returns how many neighbors, and the average color of all live neighbors
	neighborCountAndAverageColor(x,y){
		if(x < 0 || x >= this[_columns] || y < 0 || y >= this[_rows]){
			throw new RangeError("index out of bounds");
		}
		var neighbors = this[_cells].slice(x-1<0?0:x-1, x+2).map(function(subArr){return subArr.slice(y-1<0?0:y-1, y+2);});
		var count = 0;
		var averageR = 0;
		var averageG = 0;
		var averageB = 0;
		for(var i = 0; i < neighbors.length; i++){
			for(var j = 0; j < neighbors[i].length; j++){
				var neighbor = neighbors[i][j]; 
				if(neighbor.alive){
					count++;
					averageR += neighbor.r; 
					averageG += neighbor.g; 
					averageB += neighbor.b; 
				}
			}
		}
		if(this[_cells][x][y].alive){
			count--;
		}
		averageR = averageR/count | 0;
		averageG = averageG/count | 0;
		averageB = averageB/count | 0;
		var color = rgbToHex(averageR, averageG, averageB);
		return {
			'count': count,
			'color': color
		};
	}

	cellsEquals(otherCells){
		if(!(otherCells instanceof Array) || otherCells.length != this[_columns]){
			return false;			
		}
		for(var i = 0; i < this[_columns]; i++){
			var otherCellsColumn = otherCells[i];
			if(!(otherCellsColumn instanceof Array) || otherCellsColumn.length != this[_rows]){
				return false;		
			}
			for(var j = 0; j < this[_rows]; j++){
				if(!this[_cells][i][j].cellEquals(otherCellsColumn[j])){
					return false;
				}
			}
		}
		return true;
	}

	toString(){
		var result = '';
		for(var j = 0; j < this[_rows]; j++){
			for(var i = 0; i < this[_columns]; i++){
				result += this[_cells][i][j].alive + ' ';
			}
			result += '\n';
		}
		return result;
	}
}

function make2DArray(rows, columns){
	var arr = new Array(columns);
	for(var i = 0; i < columns; i++){
		arr[i] = new Array(rows);
		for(var j = 0; j < rows; j++){
			arr[i][j] = new Cell(i, j)
		}
	}
	return arr;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}