async function fetchGed() {
	let lines = [];
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
		for (i++; i < lines.length; i++) {
			if (lines[i].startsWith("0")) break;
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
					if (!lines[i].startsWith("2")) break;
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
					if (!lines[i].startsWith("2")) break;
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
					if (!lines[i].startsWith("2")) break;
					if (lines[i].includes("DATE"))
						death.date = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("PLAC"))
						death.place = lines[i].substring(7, lines[i].length);
					if (lines[i].includes("SOUR"))
						death.src = lines[i].substring(7, lines[i].length);
				}
				indi.death = death;
			}
			/*
			if (lines[i].includes("NOTE")) {
				let note = lines[i].substring(7, lines[i].length);
				for (i++; i < lines.length; i++) {
					if (!lines[i].startsWith("2")) break;
					note += "\n" + lines[i].substring(7, lines[i].length);
				}
			}
			*/
		}
		INDIS.push(indi);
	}
	return INDIS;
}

function findByName(name, indis) {
	for (let i = 0; i < indis.length; i++) 
		if (indis[i].name.includes(name))
			return indis[i];
}

class INDI {
	constructor(id) {
		this.id = id;
	}
}