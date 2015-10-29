var createCell = function (row, col){

	//ARGGH x => COL, y => ROW

	var Cell = function (x, y) {
		this.x = x;
		this.y = y;
		this.color = '#444444';
		this.alive = true;
	}

	Cell.prototype.getID = function () {
		return '' + this.y + '-' + this.x;
	}

	return new Cell(col, row);
}

module.exports = {
	'createCell': createCell
}