function tableCreator(rows, cols){
	var table = document.createElement("table");

	for (var i = 0; i < rows; i++){
		var tr = document.createElement("tr");
		tr.setAttribute('id', i.toString());
		for (var j = 0; j < cols; j++){
			var td = document.createElement("td");
			td.setAttribute('id', j.toString() + '-' + i.toString());
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	return table;
}