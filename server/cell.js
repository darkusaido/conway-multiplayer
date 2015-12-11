"use strict";

//instance vars
var _x = Symbol();
var _y = Symbol();
var _id = Symbol();
var _alive = Symbol();

module.exports = class cell {
	constructor(x, y){
		this[_x] = x; 
		this[_y] = y; 
		this[_id] = x + '-' + y;
		this[_alive] = 0;
	}

	get x(){
		 return this[_x];
	}
	get y(){
		 return this[_y];
	}
	get id(){
		return this[_id];
	}
	get alive(){
		return this[_alive];
	}

	toggleLife(){
		this[_alive] = this[_alive] ? 0 : 1;
	}

	cellEquals(otherCell){
		if(this[_x] === otherCell.x && this[_y] === otherCell.y 
			&& this[_id] === otherCell.id && this[_alive] === otherCell.alive){
			return true;
		}
		return false;
	}

	toString(){
		return 'x:' + this[_x] + ' y:' + this[_y] + ' alive:' + this[_alive];
	}
}
