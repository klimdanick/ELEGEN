
document.getElementById("menu").innerHTML += "<br><input type='button' name='Kwartierstaat' value='Kwartierstaat' onClick='changeGraph(1)' style='width:auto; z-index: 100; position: relative;'>";

function drawKwartierstaat(i) {
	changeCSS("http://stamboom.klimda.nl/stamboom/EleGen/graphs/kwartierstaat.css", 0);
	let graph = document.getElementById("EleGen");
	graph.innerHTML = baseGraph;
	let lines = document.getElementById("lines");
	lines.innerHTML = "";
	let hard = document.getElementById("hard");
	if (hard) hard.remove();
	graph.innerHTML+="<h1 style='z-index: 0; position: absolute; width: 100%; font-size: 300%; text-align: center; top: 10px;'>Kwartierstaat</h1><div id=graph><hr></div>";
	graph = document.getElementById("graph");
	//graph.innerHTML += getHTMLelement(person);
	let draw = true;
	let I = [i];
	let GenNumber = 0;
	while (draw) {
		let newI = [];
		GenNumber++;
		makeGen(GenNumber);
		for (let j = 0; j < I.length; j++) {
			let Gen = document.getElementById(GenNumber);
			let person = "undefined";
			if (I[j] != "undefined") {
				person = searchPersonByREC(I[j])[0].person;
				if (person.FAM.FAMC) {
					let PAR = searchFamilyByREC(person.FAM.FAMC)[0].family.PAR;
					if (PAR.HUSB) newI[newI.length] = PAR.HUSB; else newI[newI.length] = "undefined";
					if (PAR.WIFE) newI[newI.length] = PAR.WIFE; else newI[newI.length] = "undefined";
					
				}
			}
			
			Gen.innerHTML += getHTMLelement(person);
			
		}
		if (newI.length == 0 || GenNumber == 5) draw = false;
		console.log(newI + " end of gen " + GenNumber);
		I = newI;
	}
}

function getHTMLelement(person, s) {
	if (person == "undefined") {
		let HTML = "<a class='card' id='" + M
		+ "><div>"
		+ "Niet" + " " + "Bekend";
		HTML += "</div></a>";
		return HTML;
	}
	//console.log(person.REC);
	if (!s) {
		let HTML = "<a class='card' id='" + person.SEX
			+ "' onClick='jumpTo(`" + person.REC + "`);'><div>"
			+ person.fNAME + " " + person.lNAME;
		HTML += "</div></a>";
		return HTML;
	} else if (s) {
		console.log("self");
		let HTML = "<a class='card' style='border-color: #ff7869;' id='" + person.SEX
			+ "' onClick='jumpTo(`" + person.REC + "`);'><div>"
			+ person.fNAME + " " + person.lNAME;
		HTML += "</div></a>";
		return HTML;
	}
}

function makeGen(genNumber) {
	let graph = document.getElementById("graph");
	graph.innerHTML = "<br><div class='gen' id='" + genNumber + "'></div>" + graph.innerHTML;
}