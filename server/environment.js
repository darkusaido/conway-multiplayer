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
			this[_liveCells][cell.id] = cell.clone();
		}
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
				var neighborCount = this.neighborCount(i,j);
				if(alive && (neighborCount < 2 || neighborCount > 3)) {
					nextEnv.flipCell(i,j);
					delete this[_liveCells][currCell.id];
					var clone = currCell.clone();
					clone.toggleLife();
					this[_cellsDied][currCell.id] = clone;
				}
				else if(!alive && neighborCount === 3){
					nextEnv.flipCell(i,j);	
					var clone = currCell.clone();
					clone.toggleLife();
					this[_liveCells][currCell.id] = clone;
					this[_cellsBorn][currCell.id] = clone;
				}
			}
		}
		this[_cells] = nextEnv.cells;
	}

	neighborCount(x,y){
		if(x < 0 || x >= this[_columns] || y < 0 || y >= this[_rows]){
			throw new RangeError("index out of bounds");
		}
		var neighbors = this[_cells].slice(x-1<0?0:x-1, x+2).map(function(subArr){return subArr.slice(y-1<0?0:y-1, y+2);});
		var count = 0; 
		for(var i = 0; i < neighbors.length; i++){
			for(var j = 0; j < neighbors[i].length; j++){
				if(neighbors[i][j].alive){
					count++;
				}
			}
		}
		if(this[_cells][x][y].alive){
			count--;
		}
		return count;
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