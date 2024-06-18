let childrenObjects = [];

async function selectPerson(id) {
	document.getElementById("titleScreen").style.display = "none";
	document.getElementById("searchRes").style.display = "none";
	document.documentElement.getElementsByClassName("persons")[0].innerHTML = "";
	document.documentElement.getElementsByClassName("lines")[0].innerHTML = "";
	//let lines = await fetchGed();
	//let indis = await getIndis(lines);
	let fams = await getFams(lines);
	let rels = await buildRel(id, indis, fams);

	if (rels.gen0.husb) {
	new Person(rels.gen0.husb, 33, 15);
	if (rels.gen0.husb) new Line(true, 33, 50, 15);
	if (rels.gen0.husb.famc) new Line(false, 0, 15, 33, "", true);
	}

	if (rels.gen0.wife) {
	new Person(rels.gen0.wife, 66, 15);
	if (rels.gen0.wife) new Line(true, 50, 66, 15);
	if (rels.gen0.wife.famc) new Line(false, 0, 15, 66, "", true);
	}

	if (rels.gen0.wife || rels.gen0.husb)
		new Line(false, 15, 40, 50);
	new Person(rels.gen1.sel, 50, 40);
	if (rels.gen1.pars.length > 0 || rels.gen2.length > 0) new Line(true, 40, 50, 40);
	for (let i = 0; i < rels.gen1.pars.length; i++) {
		new Person(rels.gen1.pars[i], 20, 40+10*(i-Math.floor(rels.gen1.pars.length/2)), {"hideDates": rels.gen1.pars.length >= 2, "onclick": "selectPerson(\"@I\"+indi.rfn+\"@\");"});
		let label = "";
		if (rels.gen1.pars[i].mar) label = rels.gen1.pars[i].mar.date + "\n" + rels.gen1.pars[i].mar.plac;
		new Line(true, 20, 40, 40+10*(i-Math.floor(rels.gen1.pars.length/2)), label);
		new Line(false, Math.min(40+10*(i-Math.floor(rels.gen1.pars.length/2)), 40), Math.max(40+10*(i-Math.floor(rels.gen1.pars.length/2)), 40), 40);
	}
	childrenObjects = [];
	let offset = -Math.floor(rels.gen2.length/2);
	if (rels.gen2.length % 2 == 0) offset += 0.5;
	for (let i = 0; i < rels.gen2.length; i++) {
		childrenObjects.push(new Person(rels.gen2[i], 50+11*(i+offset), 80));
		childrenObjects.push(new Line(false, 60, 80, 50+11*(i+offset)));
		let begin = Math.min(50+11*(i+offset), 50);
		let end = Math.max(50+11*(i+offset), 50);
		childrenObjects.push(new Line(true, begin, end, 60));

		let children = false;
		for (let j = 0; j < rels.gen2[i].fams.length; j++) {
			chil = findFamByRec(rels.gen2[i].fams[j], fams)[0].chil;
			if (chil && chil.length>0) children = true;
		}

		if (children) childrenObjects.push(new Line(false, 80, 100, 50+11*(i+offset), "", true));
	}
	if (rels.gen2.length > 0) {
		new Line(false, 40, 60, 40);
		new Line(true, 40, 50, 60);
	}

	if (rels.gen1.sel.note) {
		document.getElementById("note").innerText = rels.gen1.sel.note;
		document.getElementById("note").style.display = "block";
	} else document.getElementById("note").style.display = "none";

	let leastX = 100;
	let mostX = 0;

	for (let i = 0; i < childrenObjects.length; i++) {
		leastX = Math.min(leastX, parseFloat(childrenObjects[i].el.style.left))
		mostX = Math.max(mostX, parseFloat(childrenObjects[i].el.style.left))
	}
	console.table({mostX, leastX});
	if (leastX < MinLimit) document.getElementById("leftScrBut").style.display = "block";
	else document.getElementById("leftScrBut").style.display = "none";
	if (mostX > MaxLimit) document.getElementById("rightScrBut").style.display = "block";
	else document.getElementById("rightScrBut").style.display = "none";
}

let MaxLimit = 86;
let MinLimit = 13;

function scrollChildren(x) {
	let leastX = 100;	// 13
	let mostX = 0;		// 86

	for (let i = 0; i < childrenObjects.length; i++) {
		leastX = Math.min(leastX, parseFloat(childrenObjects[i].el.style.left))
		mostX = Math.max(mostX, parseFloat(childrenObjects[i].el.style.left))
	}
	console.table({mostX, leastX});
	if (leastX > MinLimit && x > 0) return;
	if (mostX < MaxLimit && x < 0) return;
	let i = 0;
	
	let intervalID = setInterval(() => {
		let offset = (Math.sign(x)*0.5)
		for (let i = 0; i < childrenObjects.length; i++) {
			childrenObjects[i].el.style.left = parseFloat(childrenObjects[i].el.style.left) + offset + "%";
		}
		i+= offset;
		if (x > 0 && i >= x) clearInterval(intervalID);
		if (x < 0 && i <= x) clearInterval(intervalID);
	}, 10);


}