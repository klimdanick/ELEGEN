let selectedId;
let indis;
let fams;
let elegenLayout;
let currentGraph = 0;

async function loadTree(layout) {
    elegenLayout = layout;
    let lines = await fetchGed();
    await getIndis(lines);
    await getFams(lines);
	let results = await getPeopleWithQuarry("danick");
	console.log(results );
    selectPerson(results[0].id); //I1296
}

function selectPerson(id) {
    selectedId = id;
    elegenMenu.selected.callback()
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
	if (fam.husb && typeof fam.husb == "string") fam.husb=findByRec(fam.husb, indis);
	else fam.husb == null;
	if (fam.wife && typeof fam.wife == "string") fam.wife=findByRec(fam.wife, indis);
	else fam.wife == null;
	if (fam.chil) for (let i = 0; i < fam.chil.length; i++) {
		if (typeof fam.chil[i] == "string") fam.chil[i] = findByRec(fam.chil[i], indis);
	} else fam.chil == [];
	return fam;
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

