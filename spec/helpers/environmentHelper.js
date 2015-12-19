var cellsObjectsEquals = function (cells1, cells2){
	for(var cellKey in cells1){
		if(typeof cells2[cellKey] === 'undefined' || cells1[cellKey] !== cells2[cellKey]){
			return false;
		}
	}
	for(var cellKey in cells2){
		if(typeof cells1[cellKey] === 'undefined' || cells1[cellKey] !== cells2[cellKey]){
			return false;
		}
	}
	return true;
}

module.exports = { cellsObjectsEquals: cellsObjectsEquals};