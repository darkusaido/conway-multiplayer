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

	set alive(value){
		if(value !== 0 || value !== 1){
			throw new TypeError('Can only set variable \'alive\' to 0 or 1');
		}
		this[_alive] = value;
	}



	toString(){
		return 'x:' + this[_x] + ' y:' + this[_y] + ' alive:' + this[_alive];
	}
}
