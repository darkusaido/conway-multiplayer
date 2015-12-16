"use strict";

//instance vars
var _x = Symbol();
var _y = Symbol();
var _id = Symbol();
var _alive = Symbol();
var _color = Symbol();
var _r = Symbol();
var _g = Symbol();
var _b = Symbol();

//constants
var deadColor = '#eeeeee';

module.exports = class Cell {
	constructor(x, y){
		this[_x] = x; 
		this[_y] = y; 
		this[_id] = x + '-' + y;
		this[_alive] = 0;
		this[_color] = deadColor;
		var rgb = hexToRgb(deadColor);
		this[_r] = rgb.r
		this[_g] = rgb.g
		this[_b] = rgb.b
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
	get color(){
		return this[_color];
	}
	get r(){
		return this[_r];
	}
	get g(){
		return this[_g];
	}
	get b(){
		return this[_b];
	}

	set color(value){
		this[_color] = value;
		var rgb = hexToRgb(value);
		this[_r] = rgb.r
		this[_g] = rgb.g
		this[_b] = rgb.b
	}

	toggleLife(){
		this[_alive] = this[_alive] ? 0 : 1;
	}

	cellEquals(otherCell){
		if(this[_x] === otherCell.x && this[_y] === otherCell.y 
			&& this[_id] === otherCell.id && this[_alive] === otherCell.alive 
			&& this[_color] === otherCell.color && this[_r] === otherCell.r
			&& this[_g] === otherCell.g && this[_b] === otherCell.b){
			return true;
		}
		return false;
	}

	clone(){ 
		var twin = new Cell(this[_x], this[_y]);
		if(this[_alive] !== twin.alive){
			twin.toggleLife();
		}
		twin.color = this[_color];
		return twin;
	}

	toString(){
		return 'x:' + this[_x] + ' y:' + this[_y] + ' alive:' + this[_alive] + ' color:' + this[_color];
	}
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}