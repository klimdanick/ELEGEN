async function search() {
    document.getElementById("titleScreen").style.display = "none";
	let value = document.getElementById("searchbar").value;
	if (indis.length == 0) indis = await getIndis(await fetchGed());
	let result = findByName(value, indis);
	console.log(result);	
	let parentEl = document.getElementById("searchRes");
	parentEl.innerHTML = "";
	if (result.length > 0) {
		document.documentElement.getElementsByClassName("persons")[0].innerHTML = "";
		document.documentElement.getElementsByClassName("lines")[0].innerHTML = "";
		for (let i = 0; i < result.length; i++) {
			let x = i % 5 + 1;
			let y = Math.floor(i / 5)+1;
			new Person(result[i], x*15, y*25, {"hideDates": false}, parentEl);
		}
	}
	parentEl.style.display = "block";
}

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