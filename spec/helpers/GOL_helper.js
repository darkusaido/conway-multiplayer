module.exports = {
	'setUpEnvironment': function(rows, columns){
		var environment = {};
		for(var i = 0, x = rows; i < x; i++){
			for(var j = 0, y = columns; j < y; j++){
				var id = i + '-' + j;
				environment['cell' + id] = this.cell(i, j, false, 0);
			}
		}
		return environment;
	},
	'cell': function(row, column, live, neighbors){
		var id = row+ '-' + column;
		return {'id': id, 'row': row, 'col': column, 'live': live, 'neighbors': neighbors};
	}
}