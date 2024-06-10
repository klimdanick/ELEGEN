let indis = [];
let fams = [];

window.onload = () => {
	//selectPerson("@I1296@");
	//selectPerson("@I1327@");
	buildFrontpage();	
}

async function buildFrontpage() {
	let title = await fetch("https://vps.klimdanick.nl/ELEGEN/title/"+window.location.hostname)
	title = await title.text();
	let text = await fetch("https://vps.klimdanick.nl/ELEGEN/text/"+window.location.hostname)
	text = await text.text();
	//console.log(title + " | " + text);
	document.getElementById("titleScreen").innerHTML = `<h1>${title}</h1><p>${text}</p>`;
	let lines = await fetchGed();
	getIndis(lines);
	getFams(lines);
	let res = findByName("Danick", indis)
	new Person(res[0], 50, 65);
}


class Person {
	constructor(indi, x, y, options = {"hideDates": false, "onclick": "selectPerson(\"@I\"+indi.rfn+\"@\");"}, parentElement = null) {
		if (!indi) return;
		this.indi = indi;
		this.el = document.createElement("div");
		this.el.classList.add("person");
		this.el.classList.add(indi.sex);
		this.el.onclick = () => {console.log(options.onclick); eval(options.onclick)}

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
			if (indi.birth.date) this.birth.innerText = indi.birth.date;
			if (indi.birth.plac) this.birth.innerText += "\n" + indi.birth.plac;
			this.el.appendChild(this.birth);
		} if (this.indi.death) {
			let text = document.createElement("span");
			text.innerHTML = "death";
			text.style.fontWeight = "bold";
			this.el.appendChild(document.createElement("hr"));
			this.el.appendChild(text);
			this.death = document.createElement("span");
			this.death.classList.add("death");
			if (indi.death.date) this.death.innerText = indi.death.date;
			if (indi.death.plac) this.death.innerText += "\n" + indi.death.plac;
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
async function fetchGed() {
	//if (lines != []) return lines;
	var myHeaders = new Headers();
	myHeaders.append('Content-Type','text/plain; charset=UTF-8');

	await fetch('ged.txt', myHeaders).then((response) => response.text()).then((data) => {
		lines = data.split("\r\n");
		if (lines.length <= 1) lines = data.split("\n");
	});
	return lines;
}
///I1561   /// good example indi  I1335

async function getIndis(lines) {
	indis = [];
	for (let i = 0; i < lines.length; i++) {
		if (!lines[i].startsWith("0")) continue;
		if (!lines[i].includes("INDI")) continue;
		let indi = new INDI(lines[i].split(" ")[1]);
		indis.push(indi);
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
					if (lines[i].includes("CONT")) note += "\n" + lines[i].substring(7, lines[i].length);
					else if (lines[i].includes("CONC")) note += lines[i].substring(7, lines[i].length);
					else {
						i--;
						break;
					}
				}
				indi.note = note;
			}
			
		}
	}
	return indis;
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
		//console.log(famS[i]);
		if (famS[i].wife) {
	 		pars.push(famS[i].wife.rfn != p.rfn ? famS[i].wife : famS[i].husb);
			if (pars[i]) pars[i].mar = famS[i].mar;
		}
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
	fams = [];
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
			if (lines[i].includes("MARB")) continue;
			if (lines[i].includes("MARR")) {
				let mar = {};
				if (fam.mar) mar = fam.mar;
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
					if (lines[i].includes("_CHUR"))
						mar.chur = lines[i].substring(8, lines[i].length);
				}
				fam.mar = mar;
			}
		}
		fams.push(fam);
	}
	return fams;

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

