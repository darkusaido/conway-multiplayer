"use strict";
var _ = require('lodash');
var cell = require('./cell.js');

//instance vars
var _cells = Symbol();
var _rows = Symbol();
var _columns = Symbol();

module.exports = class environment {
	constructor(rows, columns){
		this[_rows] = rows; 
		this[_columns] = columns;
		this[_cells] = make2DArray(rows, columns);
	}

	get cells(){
		return this[_cells];
	}

	set cells(value){
		if(!(value instanceof Array) || value.length != this[_columns]){
			throw new TypeError("cannot set cells; expecting " + this[_columns] + "x" + this[_rows] + " array");
		}
		for(var i = 0; i < value.length; i++){
			var elem = value[i];
			if(!(value instanceof Array) || elem.length != this[_rows]){
				throw new TypeError("cannot set cells; expecting " + this[_columns] + "x" + this[_rows] + " array");		
			}
		}
		this[_cells] = _.cloneDeep(value);
	}

	flipCell(x,y){
		if(x < 0 || x >= this[_columns] || y < 0 || y >= this[_rows]){
			throw new RangeError("index out of bounds");
		}
		var curr = this[_cells][x][y];
		this[_cells][x][y] = curr ? 0 : 1;
	}

	nextGeneration(){
		var nextEnv = new environment(this[_rows], this[_columns]);
		nextEnv.cells = this[_cells];
		for(var j = 0; j < this[_rows]; j++){
			for(var i = 0; i < this[_columns]; i++){
				var alive = this[_cells][i][j];
				var neighborCount = this.neighborCount(i,j);
				if((alive && (neighborCount < 2 || neighborCount > 3)) || (!alive && neighborCount === 3)) {
					nextEnv.flipCell(i,j);
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
		function sum(prev, curr){return prev + curr;}
		var total = neighbors.map(function(subArr){return subArr.reduce(sum)}).reduce(sum);
		//exclude self from neighbors if alive
		return this[_cells][x][y] ? --total : total;
	}

	cellsEqual(otherCells){
		if(!(otherCells instanceof Array) || otherCells.length != this[_columns]){
			return false;			
		}
		for(var i = 0; i < value.length; i++){
			var elem = value[i];
			if(!(value instanceof Array) || elem.length != this[_rows]){
				throw new TypeError("cannot set cells; expecting " + this[_columns] + "x" + this[_rows] + " array");		
			}
		}
		if(otherCells
	}

	toString(){
		var result = '';
		for(var j = 0; j < this[_rows]; j++){
			for(var i = 0; i < this[_columns]; i++){
				result += this[_cells][i][j] + ' ';
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
			arr[i][j] = new cell(i, j)
		}
	}
	return arr;
}