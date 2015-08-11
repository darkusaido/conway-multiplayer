function tableGenerator (rows, columns, content){
	var tableContents = '';
	var id = '';
	for(var i = 0, x = rows; i < x; i++){
		tableContents += '<tr>\n';
		for(var j = 0, y = columns; j < y; j++){
			id = i + '-' + j;
			tableContents += '\t<td id=\'' + id + '\'>' + content + '</td>\n';
		}
		tableContents += '</tr>\n';
	}
	return tableContents;
}