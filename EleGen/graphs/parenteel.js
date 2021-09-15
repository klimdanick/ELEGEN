
document.getElementById("menu").innerHTML += "<br><input type='button' name='Parenteel' value='Parenteel' onClick='changeGraph(0)' style='width:auto; z-index: 100; position: relative;'>";

function drawParenteel(i) {
	changeCSS("http://stamboom.klimda.nl/stamboom/EleGen/graphs/kwartierstaat.css", 0);
	let graph = document.getElementById("EleGen");
	graph.innerHTML = baseGraph;
	let lines = document.getElementById("lines");
	lines.innerHTML = "";
	let hard = document.getElementById("hard");
	if (hard) hard.remove();
	graph.innerHTML+="<h1 style='z-index: 0; position: absolute; width: 100%; font-size: 300%; text-align: center; top: 10px;'>Parenteel</h1><div id=graph></div>";
	graph = document.getElementById("graph");
	//graph.innerHTML += getHTMLelement(person);
	let draw = true;
	let I = [i];
	let GenNumber = 0;
	while (draw) {
		let newI = [];
		GenNumber++;
		makeGen2(GenNumber);
		for (let j = 0; j < I.length; j++) {
			let Gen = document.getElementById(GenNumber);
			let person = searchPersonByREC(I[j])[0].person;
			if (person.FAM.FAMS) {
				let CHIL = searchFamilyByREC(person.FAM.FAMS)[0].family.CHIL;
				for (let g = 0; g < CHIL.length; g++) {
					newI[newI.length] = CHIL[g];
				}
			}
			Gen.innerHTML += getHTMLelement(person);
			
		}
		if (newI.length == 0 || GenNumber == 15) {draw = false; graph.innerHTML+="<hr>";}
		console.log(newI + " end of gen " + GenNumber);
		I = newI;
	}
}

function getHTMLelement(person) {
	if (person == "undifined") {
		let HTML = "<a class='card' id='" + M
		+ "><div>"
		+ "Niet" + " " + "Bekend";
		HTML += "</div></a>";
		return HTML;
	}
	//console.log(person.REC);
	let HTML = "<a class='card' id='" + person.SEX
		+ "' onClick='jumpTo(`" + person.REC + "`);'><div>"
		+ person.fNAME + " " + person.lNAME;
	HTML += "</div></a>";
	return HTML;
}

function makeGen2(genNumber) {
	let graph = document.getElementById("graph");
	graph.innerHTML += "<br><div class='gen' id='" + genNumber + "'></div>";
}