	let initHTML =
		`<input type="text" id="search" name="search" value="">
		<input type="button" name="searchSub" value="Zoek" onClick="search(document.getElementById('search').value);">`;
	

	document.getElementById("menu").innerHTML = initHTML + document.getElementById("menu").innerHTML;
	//document.getElementsByTagName("head")[0].innerHTML += `<link rel="stylesheet" href="EleGen/EleGen.css">`;





		let baseGraph = document.getElementById("EleGen").innerHTML;
		
		/* graphtypes:
			0: parenteel
			1: kwartiekstaat
			2: fan diagram
			3: relations
		*/
		
		let graphType = 3;
		
		let currentREC = "@I2@";
	
		//var canvas = document.getElementById("myCanvas");
		//var ctx = canvas.getContext("2d");
		
		function search(input) {
			let results = searchPersonByName(input);
			if (results.length == 1) {
				jumpTo(results[0].person.REC);
			} else if (results.length > 1) {
				drawSearchResults(results);
			} else {
				document.getElementById("search").value = "No Results Found!";
			}
		}
		
		function changeGraph(gT) {
			graphType = gT;
			switch (graphType) {
					case 0: drawParenteel(currentREC); break;
					case 1: drawKwartierstaat(currentREC); break;
					case 2: drawFanDiagram(currentREC); break;
					case 3: drawRelations(currentREC); break;
			}
		}
		
		function jumpTo(i) {
			currentREC = i;
			//console.log(INDI);
			/*
			GEN1[0] = family.gen1.HUSB;
			GEN1[1] = family.gen1.WIFE;
			GEN2[0] = family.gen2.HUSB;
			GEN2[1] = family.gen2.WIFE;
			GEN3 = family.gen3.CHIL;
			*/
			switch (graphType) {
					case 0: drawParenteel(i); break;
					case 1: drawKwartierstaat(i); break;
					case 2: drawFanDiagram(i); break;
					case 3: drawRelations(i); break;
			}
			
		}
		
		function drawSearchResults (results) {
			/*
				<a class="SelCard" id="M" onClick="jumpTo('@I184@');"><div><b>Danick Imholz</b><br>geslacht: Man<br>geboren: 8 DEC 2003</div></a>
				<a class="card" id="F" onClick="jumpTo('@I184@');"><div><b>Mylene Imholz</b><br>geslacht: Vrouw<br>geboren: 26 FEB 2001</div></a>
			*/
			let graph = document.getElementById("EleGen");
			//console.log(graph);
			graph.innerHTML = baseGraph;
			
			graph.innerHTML += "<div id='gen1'><h1>Zoek resultaten:</h1></div><div id='gen2'></div><div id='gen3'></div>";
			gen2 = document.getElementById("gen3");
			for (let i = 0; i < results.length; i++) {
				gen2.innerHTML += "<br>" + getHTMLelement(results[i].person);
			}
			
			lines = document.getElementById("lines");
			lines.innerHTML = "";
		}
		
		
		
		let fileLines = [];
		let file = "";
		let INDI = [];
		let FAM = [];
		
		function parseFile(lines) {	
			//reset all data before parsing new data
			fileLines = []; 
			file = "";
			INDI = [];
			FAM = [];
			
			let recNumb = -1;
			let famRecNumb = -1;
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				if (line.includes("INDI")) {
					recNumb++;
					let rec = "@" + line.split("@")[1] + "@";
					//console.log(rec);
					INDI.push({REC: rec, fNAME: "", lNAME: "", SEX: "", FAM: {FAMS: "", FAMC: ""}, BIRT: {}, DEAT: {}, NOTE: ""});
				}
				if (recNumb >= 0) {
					if (line.includes("NAME") && !INDI[recNumb].fNAME && !INDI[recNumb].lNAME) {
						let fname = line.split("NAME ")[1].split("/")[0].split("\r")[0];
						let lname = line.split("NAME ")[1].split("/")[1].split("\r")[0];
						INDI[recNumb].fNAME = fname;
						INDI[recNumb].lNAME = lname;
					}
					if (line.includes("SEX")) {
					let sex;
						if (line.includes("F")) sex = "F";
						else if (line.includes("M")) sex = "M";
						INDI[recNumb].SEX = sex;
					}
					if (line.includes("FAMS")) {
						let fam = line.split("FAMS ")[1].split("\\")[0].split("\r")[0];
						INDI[recNumb].FAM.FAMS = fam;
					}
					if (line.includes("FAMC")) {
						let fam = line.split("FAMC ")[1].split("\\")[0].split("\r")[0];
						INDI[recNumb].FAM.FAMC = fam;
					}
					if (line.includes("BIRT")) {
						let DATE, PLAC;
						if (lines[i+1].includes("DATE")) DATE = lines[i+1].split("DATE ")[1].split("\r")[0];
						if (lines[i+2].includes("PLAC")) PLAC = lines[i+2].split("PLAC ")[1].split("\r")[0];
						if (lines[i+2].includes("DATE")) DATE = lines[i+2].split("DATE ")[1].split("\r")[0];
						if (lines[i+1].includes("PLAC")) PLAC = lines[i+1].split("PLAC ")[1].split("\r")[0];
						INDI[recNumb].BIRT = {DATE, PLAC};
					}
					if (line.includes("DEAT")) {
						let DATE, PLAC;
						if (lines[i+1].includes("DATE")) DATE = lines[i+1].split("DATE ")[1].split("\r")[0];
						if (lines[i+2].includes("PLAC")) PLAC = lines[i+2].split("PLAC ")[1].split("\r")[0];
						if (lines[i+2].includes("DATE")) DATE = lines[i+2].split("DATE ")[1].split("\r")[0];
						if (lines[i+1].includes("PLAC")) PLAC = lines[i+1].split("PLAC ")[1].split("\r")[0];
						INDI[recNumb].DEAT = {DATE, PLAC};
					}
					if (line.includes("NOTE")) {
						let NOTE = line.split("NOTE ")[1].split("\r")[0];
						INDI[recNumb].NOTE += NOTE;
					}
				}
				if (line.includes("FAM") && !line.includes("FAMS") && !line.includes("FAMC")) {
					famRecNumb++;
					let rec = "@" + line.split("@")[1] + "@";
					//console.log(rec);
					FAM.push({REC: rec, PAR: {HUSB: "", WIFE: "", MARR: false, PLAC: "", DATE: ""}, CHIL: []});
				}
				if (famRecNumb >= 0) {
					if (line.includes("HUSB")) {
						let HUSB = line.split("HUSB ")[1].split("\r")[0];
						FAM[famRecNumb].PAR.HUSB = HUSB;
					}
					if (line.includes("WIFE")) {
						let WIFE = line.split("WIFE ")[1].split("\r")[0];
						FAM[famRecNumb].PAR.WIFE = WIFE;
					}
					if (line.includes("MARR")) {
						FAM[famRecNumb].PAR.MARR = true;
					}
					if (line.includes("CHIL")) {
						let CHIL = line.split("CHIL ")[1].split("\r")[0];
						FAM[famRecNumb].CHIL.push(CHIL);
					}
					if (line.includes("DATE")) {
						let DATE = line.split("DATE ")[1].split("\r")[0];
						FAM[famRecNumb].PAR.DATE = DATE;
						DATE="test123";
					}
					if (line.includes("PLAC")) {
						let PLAC = line.split("PLAC ")[1].split("\r")[0];
						FAM[famRecNumb].PAR.PLAC = PLAC;
					}
				}
			}
			
			jumpTo(currentREC);
		}
			
		function getRec(REC) {
			if (REC.includes("I")) REC = REC.split("I")[1];
			if (REC.includes("F")) REC = REC.split("F")[1];
			REC = REC.split("@")[0];
			return parseInt(REC);
		}
		
		function getIndex(REC) {
			let index;
			if (REC.includes("I")) index = searchPersonByREC(REC)[0].index;
			if (REC.includes("F")) index = searchFamilyByREC(REC)[0].index;
			return index;
		}
		
		function searchPersonByName(name) {
			let persons = [];
			for (let i = 0; i < INDI.length; i++) {
				let person = INDI[i];
				if (person.fNAME.toLowerCase().includes(name.toLowerCase()) || person.lNAME.toLowerCase().includes(name.toLowerCase())) persons.push({person, index: i});
			}
			return persons;
		} 
		
		function searchPersonByREC(rec) {
			let persons = [];
			for (let i = 0; i < INDI.length; i++) {
				let person = INDI[i];
				if (person.REC.includes(rec)) persons.push({person, index: i});
			}
			return persons;
		}
		
		function searchFamilyByREC(rec) {
			let familys = [];
			for (let i = 0; i < FAM.length; i++) {
				let family = FAM[i];
				if (FAM[i].REC.includes(rec)) familys.push({family, index: i});
			}
			return familys;
		}
		
		function getFamily(REC) {
			//console.log("geting Family");
			let person = searchPersonByREC(REC)[0];
			let FAMSrec = person.person.FAM.FAMS;
			let FAMCrec = person.person.FAM.FAMC;
			
			//console.log(person);
			//console.log(FAMSrec);
			//console.log(FAMCrec);
			
			let FAMS = "";
			let FAMC = "";
			
			//console.log(FAMSrec.length > 0);
			//console.log(FAMSrec);
			//console.log(searchFamilyByREC(FAMSrec).length > 0);
			//console.log(searchFamilyByREC(FAMSrec));
			if (FAMSrec.length > 0 && searchFamilyByREC(FAMSrec).length > 0) FAMS = searchFamilyByREC(FAMSrec)[0].family;
			//console.log(FAMCrec.length > 0);
			//console.log(FAMCrec);
			//console.log(searchFamilyByREC(FAMCrec).length > 0);
			//console.log(searchFamilyByREC(FAMCrec));
			if (FAMCrec.length > 0 && searchFamilyByREC(FAMCrec).length > 0) FAMC = searchFamilyByREC(FAMCrec)[0].family;
			
			let gen1 = {HUSB: "", WIFE: ""};
			let gen2 = {HUSB: "", WIFE: ""};
			let gen3 = {CHIL: []};
			
			if (FAMC) {
				let HUSB = FAMC.PAR.HUSB;
				let WIFE = FAMC.PAR.WIFE;
				gen1 = {HUSB, WIFE};
			}
			
			if (FAMS) {
				let HUSB = FAMS.PAR.HUSB;
				let WIFE = FAMS.PAR.WIFE;
				gen2 = {HUSB, WIFE, SEL: ""};
				
				gen3 = {CHIL: FAMS.CHIL};
			} 
			gen2.SEL = REC;
			
			let family = {gen1, gen2, gen3};
			return family;
		}
		
		function getFamilyFull(REC) {
			let fam = getFamily(REC);
			let fam2 = {gen1: {HUSB: "", WIFE: ""}, gen2: {HUSB: "", WIFE: ""}, gen3: {CHIL: []}};
			if (fam.gen1.HUSB.length > 0) fam2.gen1.HUSB = searchPersonByREC(fam.gen1.HUSB)[0].person;
			if (fam.gen1.WIFE.length > 0) fam2.gen1.WIFE = searchPersonByREC(fam.gen1.WIFE)[0].person;
			if (fam.gen2.HUSB.length > 0) fam2.gen2.HUSB = searchPersonByREC(fam.gen2.HUSB)[0].person;
			if (fam.gen2.WIFE.length > 0) fam2.gen2.WIFE = searchPersonByREC(fam.gen2.WIFE)[0].person;
			if (fam.gen2.SEL.length > 0) fam2.gen2.SEL = searchPersonByREC(fam.gen2.SEL)[0].person;
			for (let i = 0; i < fam.gen3.CHIL.length; i++) {
				fam2.gen3.CHIL[i] = searchPersonByREC(fam.gen3.CHIL[i])[0].person;
			}
			return fam2;
		}
		
		
		let httpRequest = new XMLHttpRequest();
		let mainLink = "https://elmental-cors.herokuapp.com/";
		
		function HttpRequest(url) {
			let finalURL = mainLink + url;

			httpRequest.open("GET", url, false);

			httpRequest.send();

			return httpRequest.responseText;
		}
		var webURL;
		webURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
		console.log(HttpRequest(webURL + "/ged.txt").replace("â", "e"));
		fileLines = HttpRequest(webURL + "/ged.txt").replace("â", "e").split("\r");
		if (HttpRequest(webURL + "/ged.txt").includes("The resource you are looking for has been removed, had its name changed, or is temporarily unavailable.")) {
			let gedLink;
			if (window.location.host != "stamboom.klimda.nl/") {console.log(window.location.host); gedLink = mainLink + "stamboom.klimda.nl/" + window.location.host + "/ged.txt";}
			else gedLink = "stamboom.klimda.nl/stamboom.klimda.nl/ged.txt";
			fileLines = HttpRequest(gedLink).replace("â", "e").split("\r");
			console.log(fileLines);
		}
		//console.log(webURL);
		parseFile(fileLines);
		
		function changeCSS(cssFile, cssLinkIndex) {

			var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

			var newlink = document.createElement("link");
			newlink.setAttribute("rel", "stylesheet");
			newlink.setAttribute("type", "text/css");
			newlink.setAttribute("href", cssFile);

			document.getElementsByTagName("head").item(cssLinkIndex).replaceChild(newlink, oldlink);
		}
		