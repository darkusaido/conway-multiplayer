var createCell = function (id, color, row, col, live, neighbors){
	return {
		'id': id,
		'row': row,
		'col': col,
		'live': live,
		'neighbors': neighbors,
		'color': color
	} 
}

module.exports = {
	'createCell': createCell
}