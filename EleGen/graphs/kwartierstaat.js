async function buildKwartierStaat(id) {
	let rels = await buildRel(id, indis, fams);
	let gens = [];
	gens.push([rels.gen1.sel]);
	while (true) {
		let currentGen = [];
		let lastGen = gens[gens.length-1]
		//console.log(lastGen);
		for (let i = 0; i < lastGen.length; i++) {
			let p = lastGen[i]
			let r = findFamByRec([p.famc], fams)[0];
			if (!r) continue;
			if (r.husb) 
				if (typeof r.husb === 'string') currentGen.push(findByRec(r.husb, indis))
				else currentGen.push(r.husb)
			if (r.wife) 
				if (typeof r.wife === 'string') currentGen.push(findByRec(r.wife, indis))
				else currentGen.push(r.wife)
			
		}
		if (currentGen.length <= 0) break;
		gens.push(currentGen);
		//console.table(currentGen);
	}
	console.log(gens);
	return gens;

}

function renderKwartierstaat() {
	document.getElementById("searchRes").style.display = "none";
	document.documentElement.getElementsByClassName("persons")[0].innerHTML = "";
	document.documentElement.getElementsByClassName("lines")[0].innerHTML = "";
	for (let i = 0; i < gens.length && i < 3; i++) {
		for (let j = 0; j < gens[i].length; j++) {
			let p = new Person(gens[i][j], 50, 90, {"hideDates": true})
			//p.el.style.transformOrigin = `-50% `+(-50-i*100)+`%`;
			p.el.style.transform = `rotate(`+10/*(j/gens[i].length*180-90)*/+`deg)`;
			p.el.style.transform+= `translate(-50%, `+(-50-i*100)+`%)`;
		}
	}
}