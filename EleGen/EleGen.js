let lines = [];

async function fetchGed() {
	//if (lines != []) return lines;
	await fetch('ged.txt').then((response) => response.text()).then((data) => {
		lines = data.split("\r\n");
	});
	return lines;
}

async function getIndis() {
	let lines = await fetchGed();
	let INDIS = [];
	for (let i = 0; i < lines.length; i++) {
		if (!lines[i].startsWith("0")) continue;
		if (!lines[i].includes("INDI")) continue;
		let indi = new INDI(lines[i].split(" ")[1]);
		INDIS.push(indi);
		for (i++; i < lines.length; i++) {
			if (lines[i].startsWith("0")) {i--; break;}
			if (!lines[i].startsWith("1")) continue;
			if (lines[i].includes("NAME"))
				indi.name = lines[i].substring(7, lines[i].length);
			if (lines[i].includes("SEX"))
				indi.sex = lines[i].substring(6, lines[i].length);
			if (lines[i].includes("RFN"))
				indi.ref = lines[i].substring(6, lines[i].length);
			if (lines[i].includes("FAMC"))
				indi.famc = lines[i].substring(7, lines[i].length);
			if (lines[i].includes("FAMS"))
				indi.fams = lines[i].substring(7, lines[i].length);
			if (lines[i].includes("BIRT")) {
				let birth = {};
				for (i++; i < lines.length; i++) {
					if (!lines[i].startsWith("2")) {i--; break;}
					if (lines[i].includes("DATE"))
						birth.date = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("PLAC"))
						birth.place = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("SOUR"))
						birth.src = lines[i].substring(7, lines[i].length);
				}
				indi.birth = birth;
			}
			if (lines[i].includes("CHR")) {
				let baptized = {};
				for (i++; i < lines.length; i++) {
					if (!lines[i].startsWith("2")) {i--; break;}
					if (lines[i].includes("DATE"))
						baptized.date = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("PLAC"))
						baptized.place = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("SOUR"))
						baptized.src = lines[i].substring(7, lines[i].length);
				}
				indi.baptized = baptized;
			}
			if (lines[i].includes("DEAT")) {
				let death = {};
				for (i++; i < lines.length; i++) {
					if (!lines[i].startsWith("2")) {i--; break;}
					if (lines[i].includes("DATE"))
						death.date = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("PLAC"))
						death.place = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("SOUR"))
						death.src = lines[i].substring(7, lines[i].length);
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
	for (let i = 0; i < indis.length; i++) 
		if (indis[i].name.includes(name))
			return indis[i];
}

function findByRec(id, indis) {
	for (let i = 0; i < indis.length; i++) 
		if (indis[i].id == id)
			return indis[i];
	return null; 
}

function findFamByRec(id, fams) {
	for (let i = 0; i < fams.length; i++) 
		if (fams[i].id == id)
			return fams[i];
	return null; 
}

function buildFam(fam, indis) {
	fam.husb=findByRec(fam.husb, indis);
	fam.wife=findByRec(fam.wife, indis);
	for (let i = 0; i < fam.chil.length; i++) {
		fam.chil[i] = findByRec(fam.chil[i], indis);
	}
	return fam;
}

function buildRel(indi, indis, fams) {
	let p = findByRec(indi, indis);
	let famC = buildFam(findFamByRec(p.famc, fams), indis);
	let famS = buildFam(findFamByRec(p.fams, fams), indis);
	console.log(famC);
	let Rel = {
		"sel": p,
		 "par": {
			"dad": famC.husb, 
			"mam": famC.wife
		},
		"chil": []
	};
	if (famS.chil) {
		for (let i = 0; i < famS.chil.length; i++)
			Rel.chil.push(famS.chil[i]);
	}

	return Rel;
}


async function getFams() {
	let lines = await fetchGed();
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


class INDI {
	constructor(id) {
		this.id = id;
	}
}

class FAM {
	constructor(id) {
		this.id = id;
		this.chil = [];
	}
}