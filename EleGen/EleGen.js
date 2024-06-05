class Person {
	constructor(indi, x, y, options = {"hideDates": false}, parentElement = null) {
		if (!indi) return;
		this.indi = indi;
		this.el = document.createElement("div");
		this.el.classList.add("person");
		this.el.classList.add(indi.sex);
		this.el.onclick = () => {selectPerson("@I"+indi.rfn+"@");};

		if (parentElement == null) document.documentElement.getElementsByClassName("persons")[0].appendChild(this.el);
		else parentElement.appendChild(this.el);

		let infoButton = document.createElement("span");
		//this.el.appendChild(infoButton);
		infoButton.innerText = "◯";
		infoButton.classList.add("infoButton");
		let tooltip = document.createElement("span");
		tooltip.innerText = "more info";
		tooltip.classList.add("tooltip");
		infoButton.appendChild(tooltip);
		infoButton.onclick = () => {alert("more info")};
		

		if (!indi.death && !indi.birth) options.hideDates = true;

		this.el.style.top = y+"%";
		this.el.style.left = x+"%";

		if (this.indi.name) {
			this.name = document.createElement("span");
			this.name.classList.add("name");
			this.name.innerText = indi.name.replaceAll("/", "");
			this.name.style.fontSize = "100%";
			this.el.appendChild(this.name);
			
		} 
		if (options && options.hideDates) {
			this.el.style.height = "4em";
			return;
		}
		if (this.indi.birth) {
			let text = document.createElement("span");
			text.innerText = "birth";
			text.style.fontWeight = "bold";
			this.el.appendChild(document.createElement("hr"));
			this.el.appendChild(text);
			this.birth = document.createElement("span");
			this.birth.classList.add("birth");
			this.birth.innerText = indi.birth.date + "\n" + indi.birth.plac;
			this.el.appendChild(this.birth);
		} if (this.indi.death) {
			let text = document.createElement("span");
			text.innerHTML = "death";
			text.style.fontWeight = "bold";
			this.el.appendChild(document.createElement("hr"));
			this.el.appendChild(text);
			this.death = document.createElement("span");
			this.death.classList.add("death");
			this.death.innerText = indi.death.date + "\n" + indi.death.plac;
			this.el.appendChild(this.death);
		}



		//  ◯
	}
}

class Line{
	constructor(horizontal, start, end, limit, label = "", dotted = false) {
		this.el = document.createElement("div");
		if (dotted) this.el.style.border = "2px dashed white";
		else this.el.style.border = "2px solid white";
		this.el.style.position = "absolute";
		if (horizontal) {
			this.el.style.height = "0";
			this.el.style.width = (end - start)+"%";
			this.el.style.top = limit+"%";
			this.el.style.left = start+"%";
		
			this.label = document.createElement("span");
			this.label.innerText = label;
			this.label.style.position = "absolute";
			this.label.style.top = (limit - 2)+"%";
			this.label.style.left = ((start+end)/2)+"%";
			document.documentElement.getElementsByClassName("lines")[0].appendChild(this.label);

		} else {
			this.el.style.width = "0";
			this.el.style.height = (end - start)+"%";
			this.el.style.left = limit+"%";
			this.el.style.top = start+"%";
		}
		document.documentElement.getElementsByClassName("lines")[0].appendChild(this.el);
	}
}

let childrenObjects = [];

async function selectPerson(id) {
	document.getElementById("searchRes").style.display = "none";
	document.documentElement.getElementsByClassName("persons")[0].innerHTML = "";
	document.documentElement.getElementsByClassName("lines")[0].innerHTML = "";
	let lines = await fetchGed();
	let indis = await getIndis(lines);
	let fams = await getFams(lines);
	let rels = await buildRel(id, indis, fams);
	console.log(rels);

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
	if (rels.gen1.pars.length > 0) new Line(true, 40, 50, 40);
	for (let i = 0; i < rels.gen1.pars.length; i++) {
		new Person(rels.gen1.pars[i], 20, 40+10*(i-Math.floor(rels.gen1.pars.length/2)), {"hideDates": rels.gen1.pars.length >= 2});
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
		let fams = await getFams(await fetchGed());
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

window.onload = () => {
	//selectPerson("@I1296@");
	selectPerson("@I1327@");
}

async function fetchGed() {
	//if (lines != []) return lines;
	await fetch('ged.txt').then((response) => response.text()).then((data) => {
		lines = data.split("\r\n");
		if (lines.length <= 1) lines = data.split("\n");
	});
	return lines;
}
///I1561   /// good example indi  I1335

async function getIndis(lines) {
	let INDIS = [];
	for (let i = 0; i < lines.length; i++) {
		if (!lines[i].startsWith("0")) continue;
		if (!lines[i].includes("INDI")) continue;
		let indi = new INDI(lines[i].split(" ")[1]);
		INDIS.push(indi);
		for (i++; i < lines.length; i++) {
			if (lines[i].startsWith("0")) {i--; break;}
			if (!lines[i].startsWith("1")) continue;
			{
				let list = ["NAME", "NICK", "SEX", "RFN", "FAMC"];
				let type = list.find(e => lines[i].includes(e));
				if (type) indi[type.toLowerCase()] = lines[i].substring(3+type.length, lines[i].length);
			}
			if (lines[i].includes("FAMS")) {
				indi["fams"].push(lines[i].substring(7, lines[i].length));
			}
			if (lines[i].includes("BIRT")) {
				let birth = {};
				for (i++; i < lines.length; i++) {
					if (!lines[i].startsWith("2")) {i--; break;}
					{
						let list = ["DATE", "PLAC", "SOUR"];
						let type = list.find(e => lines[i].includes(e));
						if (type) birth[type.toLowerCase()] = lines[i].substring(3+type.length, lines[i].length);
					}
				}
				indi.birth = birth;
			}
			if (lines[i].includes("CHR")) {
				let baptized = {};
				for (i++; i < lines.length; i++) {
					if (!lines[i].startsWith("2")) {i--; break;}
					{
						let list = ["DATE", "PLAC", "SOUR"];
						let type = list.find(e => lines[i].includes(e));
						if (type) baptized[type.toLowerCase()] = lines[i].substring(3+type.length, lines[i].length);
					}
				}
				indi.baptized = baptized;
			}
			if (lines[i].includes("DEAT")) {
				let death = {};
				for (i++; i < lines.length; i++) {
					if (!lines[i].startsWith("2")) {i--; break;}
					{
						let list = ["DATE", "PLAC", "SOUR"];
						let type = list.find(e => lines[i].includes(e));
						if (type) death[type.toLowerCase()] = lines[i].substring(3+type.length, lines[i].length);
					}
				}
				indi.death = death;
			}
			
			if (lines[i].includes("NOTE")) {
				let note = lines[i].substring(7, lines[i].length);
				for (i++; i < lines.length; i++) {
					if (!lines[i].startsWith("2")) {i--;break;}
					note += "\n" + lines[i].substring(7, lines[i].length);
				}
				indi.note = note;
			}
			
		}
	}
	return INDIS;
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

function buildFam(fam, indis) {
	if (!fam) return {};
	if (fam.husb) fam.husb=findByRec(fam.husb, indis);
	else fam.husb == null;
	if (fam.wife) fam.wife=findByRec(fam.wife, indis);
	else fam.wife == null;
	if (fam.chil) for (let i = 0; i < fam.chil.length; i++) {
		fam.chil[i] = findByRec(fam.chil[i], indis);
	} else fam.chil == [];
	return fam;
}

function buildRel(indi, indis, fams) {
	let p = findByRec(indi, indis);
	
	let famC = findFamByRec([p.famc], fams)[0];
	buildFam(famC, indis);

	let famS = findFamByRec(p.fams, fams);
	for (let i = 0; i < famS.length; i++) buildFam(famS[i], indis);
	
	let pars = [];
	for (let i = 0; i < famS.length; i++) {
	 	pars.push(famS[i].wife.rfn != p.rfn ? famS[i].wife : famS[i].husb);
		pars[i].mar = famS[i].mar;
	}
	let dad = null;
	let mom = null;
	if (famC) {
		dad = famC.husb;
		mom = famC.wife;
	}
	let Rel = {
		"gen0": {
			"husb": dad,
			"wife": mom
		},
		"gen1": {
			"sel": p,
			"pars": pars
		},
		"gen2": []
	};
	for (let j = 0; j < famS.length; j++) {
		if (famS[j].chil) {
			for (let i = 0; i < famS[j].chil.length; i++)
				Rel.gen2.push(famS[j].chil[i]);
		}
	}
	return Rel;
}


async function getFams(lines) {
	let fams = [];
	for (let i = 0; i < lines.length; i++) {
		if (!lines[i].startsWith("0")) continue;
		if (!lines[i].includes("FAM")) continue;
		let fam = new FAM(lines[i].split(" ")[1]);
		for (i++; i < lines.length; i++) {
			if (lines[i].startsWith("0")) {i--; break;}
			if (!lines[i].startsWith("1")) continue;
			if (lines[i].includes("CHIL"))
				fam.chil.push(lines[i].substring(7, lines[i].length));
			if (lines[i].includes("HUSB"))
				fam.husb = lines[i].substring(7, lines[i].length);
			if (lines[i].includes("WIFE"))
				fam.wife = lines[i].substring(7, lines[i].length);
			if (lines[i].includes("RFN"))
				fam.rfn = lines[i].substring(6, lines[i].length);
			if (lines[i].includes("MARR")) {
				let mar = {};
				for (i++; i < lines.length; i++) {
					if (!lines[i].startsWith("2")) {i--; break;}
					if (lines[i].includes("TYPE"))
						mar.type = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("DATE"))
						mar.date = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("PLAC"))
						mar.plac = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("SOUR"))
						mar.src = lines[i].substring(7, lines[i].length);
				}
				fam.mar = mar;
			}
		}
		fams.push(fam);
	}
	return fams;
}

let indis = [];

async function search() {
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

class INDI {
	constructor(id) {
		this.id = id;
		this.fams = [];
	}
}

class FAM {
	constructor(id) {
		this.id = id;
		this.chil = [];
	}
}

