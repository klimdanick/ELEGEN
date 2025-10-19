function findByName(name, indis) {
	let result = [];
	for (let i = 0; i < indis.length; i++) 
		if (indis[i].name.toLowerCase().includes(name.toLowerCase()))
			result.push(indis[i]);
	return result;
}

function findByRec(id, indis) {
	for (let i = 0; i < indis.length; i++) 
		if (indis[i].id == id)
			return indis[i];
	return null; 
}

function findFamByRec(ids, fams) {
	let fams_ = [];
	for (let i = 0; i < fams.length; i++) 
		if (ids.includes(fams[i].id))
			fams_.push(fams[i]);
	return fams_; 
}