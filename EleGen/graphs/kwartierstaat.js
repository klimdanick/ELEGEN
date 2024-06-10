async function buildKwartierStaat(id) {
	let rels = await buildRel(id, indis, fams);
	let gens = [];
    rels.gen1.sel.genPos = 0;
	gens.push([rels.gen1.sel]);
	while (true) {
		let currentGen = [];
		let lastGen = gens[gens.length-1]
		//console.log(lastGen);
		for (let i = 0; i < lastGen.length; i++) {
			let p = lastGen[i]
			let r = findFamByRec([p.famc], fams)[0];
            //console.log(r);
			if (!r) continue;
			if (r.husb) {
				if (typeof r.husb === 'string') r.husb = findByRec(r.husb, indis)
				r.husb.genPos = p.genPos*2;
                currentGen.push(r.husb)
            }
			if (r.wife) {
				if (typeof r.wife === 'string') r.wife = findByRec(r.wife, indis)
				r.wife.genPos = p.genPos*2+1;
                currentGen.push(r.wife)
            }
            console.log(r);
		}
		if (currentGen.length <= 0) break;
		gens.push(currentGen);
		//console.table(currentGen);
	}
	//console.log(gens);
	return gens;

}
/*
function renderKwartierstaat(gens) {
	document.getElementById("searchRes").style.display = "none";
	document.documentElement.getElementsByClassName("persons")[0].innerHTML = "";
	document.documentElement.getElementsByClassName("lines")[0].innerHTML = "";
	for (let i = 0; i < gens.length && i < 10; i++) {
		for (let j = 0; j < gens[i].length; j++) {
			let p = new Person(gens[i][j], 45, 90, {"hideDates": true})
            let xpos = 0;
            let ypos = (-50-i*160);
            let subangle = 180/Math.pow(2, i)
            let angle = -subangle*(Math.pow(2, i)/2)+subangle*(j+0.5)
            if (i == 0) angle = 0;
            p.el.style.transformOrigin = `$50% ${-ypos}%`;
			p.el.style.transform = `rotate(${angle}deg)`;
            p.el.style.transform += `translate(${xpos}%, ${ypos}%)`;
		}
	}
}*/

async function renderKwartierstaat(id, gen = 0, subangle = 90, angle = 0, depth = 100) {
    if (depth == 0) return;
    if (gen == 0) {
        document.getElementById("searchRes").style.display = "none";
        document.getElementById("titleScreen").style.display = "none";
        document.documentElement.getElementsByClassName("persons")[0].innerHTML = "";
        document.documentElement.getElementsByClassName("lines")[0].innerHTML = "";
    }

    let rels = await buildRel(id, indis, fams);
    let sel = rels.gen1.sel;
	let p = new Person(sel, 50, 80, {"hideDates": true, "onclick": `renderKwartierstaat("${id}");`})

    let xpos = -50;
    let ypos = (-50-gen*140);
    
    if (gen > 0) {
        subangle = subangle/2
        if (sel.sex == "F") angle += subangle;
        if (sel.sex == "M") angle -= subangle;
    }

    p.el.style.transformOrigin = `${0}% ${0}%`;
	p.el.style.transform = `rotate(${angle}deg)`;
    p.el.style.transform += `translate(${xpos}%, ${ypos}%)`;
    p.el.style.width = (10/Math.pow(gen, 0.7))+"%";

    let husb = rels.gen0.husb;
    let wife = rels.gen0.wife;

    if (husb) {
        if (typeof husb === 'string') husb = findByRec(husb, indis)
        renderKwartierstaat(husb.id, gen+1, subangle, angle, depth-1);
    }
    if (wife) {
        if (typeof wife === 'string') wife = findByRec(wife, indis)
        renderKwartierstaat(wife.id, gen+1, subangle, angle, depth-1);
    }
}