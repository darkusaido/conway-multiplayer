var createCell = function (row, col){
	return {
		//i like working in math
		'y': row,
		'x': col
	} 
}

module.exports = {
	'createCell': createCell
}