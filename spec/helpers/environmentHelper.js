var cellsObjectsEquals = function (cells1, cells2){
	for(var cellKey in cells1){
		if(!cells2[cellKey] || !cells1[cellKey].cellEquals(cells2[cellKey])){
			return false;
		}
	}
	for(var cellKey in cells2){
		if(!cells1[cellKey] || !cells1[cellKey].cellEquals(cells2[cellKey])){
			return false;
		}
	}
	return true;
}

module.exports = { cellsObjectsEquals: cellsObjectsEquals};