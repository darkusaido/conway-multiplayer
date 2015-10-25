var createCell = function (id, row, col, live, neighbors){
	return {
		'id': id,
		'row': row,
		'col': col,
		'live': live,
		'neighbors': neighbors
	} 
}

module.exports = {
	'createCell': createCell
}