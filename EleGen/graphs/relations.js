
document.getElementById("menu").innerHTML += "<br><input type='button' name='Relaties' value='Relaties' onClick='changeGraph(3)' style='width:auto;'>"

let lorem = `<div id='text'><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis finibus eros, sed aliquam enim. Ut ac nulla in metus fermentum varius. Morbi varius varius quam, mattis pellentesque sem efficitur sed. Nam nec est porttitor, placerat nisl a, porta orci. Ut at turpis id nulla venenatis efficitur eu ut lectus. Mauris velit erat, tempus sit amet pellentesque at, pretium sit amet nunc. Aliquam congue volutpat auctor. Sed sit amet ante sit amet lacus eleifend tristique vel id lacus. Phasellus porttitor neque leo, id mollis mauris pretium sed. Quisque egestas eu mi eget posuere. Integer vel nunc hendrerit, fringilla erat quis, pharetra elit. Mauris varius sodales magna, sit amet scelerisque nisl sagittis a. Nulla ut dolor eu neque placerat faucibus sed ut ipsum. Quisque bibendum tincidunt velit et tincidunt. Nullam ornare risus id consectetur faucibus. Praesent quis mi id augue cursus iaculis.Ut vitae est feugiat, auctor odio at, rhoncus lectus. Aliquam vestibulum quam dui, non ultrices lorem fermentum id. Quisque sagittis nunc quis urna pellentesque elementum. Sed scelerisque neque vitae tortor vestibulum scelerisque. Cras eros turpis, consectetur in sagittis nec, dapibus et metus. Aliquam sagittis ut odio quis pellentesque. Pellentesque sed euismod ante, eu venenatis arcu. Aenean placerat eros vel. </p></div>`;
let tekst = "";

function drawRelations(i) {
			changeCSS("http://stamboom.klimda.nl/stamboom/EleGen/graphs/relations.css", 0);
			let family = getFamilyFull(i);
			//console.log(family);
			let family2 = getFamilyFull(family.gen1.HUSB.REC);	
			//console.log(family2);
			if (window.location.host != "stamboom.klimda.nl") {console.log(window.location.host); tekst = HttpRequest(mainLink +"stamboom.klimda.nl/" + window.location.host + "/tekst/" + family.gen2.SEL.FAM.FAMS + ".txt");}
			else {console.log("stamboom"); tekst = HttpRequest("http://stamboom.klimda.nl/stamboom.klimda.nl/tekst/" + family.gen2.SEL.FAM.FAMS + ".txt");}
			if (tekst.includes("The resource you are looking for has been removed, had its name changed, or is temporarily unavailable.")) tekst = "";
			//console.log(tekst);
			
			document.title = family.gen2.SEL.FAM.FAMS + " | " + family.gen2.SEL.fNAME + " " + family.gen2.SEL.lNAME;
			
			/*
				<a class="SelCard" id="M" onClick="jumpTo('@I184@');"><div><b>Danick Imholz</b><br>geslacht: Man<br>geboren: 8 DEC 2003</div></a>
				<a class="card" id="F" onClick="jumpTo('@I184@');"><div><b>Mylene Imholz</b><br>geslacht: Vrouw<br>geboren: 26 FEB 2001</div></a>
			*/
			let graph = document.getElementById("EleGen");
			graph.innerHTML = baseGraph;
			//console.log(family);
			graph.innerHTML += "<div id='gen1'></div><div id='gen2'></div><div id='gen3'></div>";
			gen1 = document.getElementById("gen1");
			text = document.getElementById("text");
			gen2 = document.getElementById("gen2");
			gen3 = document.getElementById("gen3");
			
			if (family.gen1.HUSB != "") {
				gen1.innerHTML += getHTMLelement(family.gen1.HUSB);
			} 
			if (family.gen1.WIFE != "") {
				gen1.innerHTML += getHTMLelement(family.gen1.WIFE);
			}
			if (family.gen2.SEL != "") {
				gen2.innerHTML += getHTMLelement2(family.gen2.SEL);
			} 
			if (family.gen2.SEL.SEX == "F" && family.gen2.HUSB != "") {
				gen2.innerHTML += getHTMLelement2(family.gen2.HUSB);
			} else if (family.gen2.WIFE != "") {
				gen2.innerHTML += getHTMLelement2(family.gen2.WIFE);
			} else {
				gen2.innerHTML += "<p></p>";
			}
			gen2.innerHTML += "<div id='text'><p>" + tekst + "</p></div>" + "<div id='BenS'></div>";
			BenS = document.getElementById("BenS");
			//gen2.innerHTML += ;
			for (let i = 0; i < family2.gen3.CHIL.length; i++) {
				if (family2.gen3.CHIL[i].REC != family.gen2.SEL.REC) BenS.innerHTML += getHTMLelement3(family2.gen3.CHIL[i]);
			}
			//gen2.innerHTML += "</div>";
			for (let i = 0; i < family.gen3.CHIL.length; i++) {
				gen3.innerHTML += getHTMLelement(family.gen3.CHIL[i]);
			}
			//loremtext.innerHTML += lorem;
			
			setTimeout(() => {  
				drawLines(family); 
				let hard = document.getElementById("hard");
				if (hard != null) hard.remove();
				if (searchFamilyByREC(family.gen2.SEL.FAM.FAMS)[0].family.PAR.MARR) {
					let left = gen2.children[0].offsetLeft + gen2.children[0].offsetWidth + (gen2.children[1].offsetLeft - (gen2.children[0].offsetLeft + gen2.children[0].offsetWidth))/2;
					let top = gen2.children[1].offsetTop + gen2.children[1].offsetHeight/2;
					left -= 25;
					top -= 60;
					setTimeout(() => {  
						document.documentElement.innerHTML += '<img id="hard" style="position: absolute; left: ' + left + 'px; top: ' + top + 'px; height: 50px; width: 50px;" src="http://stamboom.klimda.nl/stamboom/images/hard.png">';
					}, 1);
				}
				
			}, 1);
			
			gen3.innerHTML += '<a href="http://stamboom.klimda.nl/stamboom/images/' + family.gen2.SEL.FAM.FAMS + '.png"><img onerror="this.style.display=`none`" style="position: absolute; left: ' + (gen2.children[0].offsetLeft) + 'px; top: ' + (gen2.children[0].offsetTop + gen2.children[0].offsetHeight + 10) + 'px; height: auto; width: auto; max-height:' + (gen3.children[0].offsetTop - (gen2.children[0].offsetTop + gen2.children[0].offsetHeight)-30) + 'px;" src="http://stamboom.klimda.nl/stamboom/images/' + family.gen2.SEL.FAM.FAMS + '.png"></a>';
			gen3.innerHTML += '<a href="http://stamboom.klimda.nl/stamboom/images/' + family.gen2.SEL.FAM.FAMS + '.jpg"><img onerror="this.style.display=`none`" style="position: absolute; left: ' + (gen2.children[0].offsetLeft) + 'px; top: ' + (gen2.children[0].offsetTop + gen2.children[0].offsetHeight + 10) + 'px; height: auto; width: auto; max-height:' + (gen3.children[0].offsetTop - (gen2.children[0].offsetTop + gen2.children[0].offsetHeight)-30) + 'px; max-width:' + gen2.children[0].offsetWidth + 'px;" src="http://stamboom.klimda.nl/stamboom/images/' + family.gen2.SEL.FAM.FAMS + '.jpg"></a>';
		}
		
		function getHTMLelement(person) {
			console.log(person.REC);
			let HTML = "<a class='card' id='" + person.SEX
				+ "' onClick='jumpTo(`" + person.REC + "`);'><div><b>"
				+ person.fNAME + " " + person.lNAME + "</b>";
			HTML += "</div></a>";
			return HTML;
		}
		
		function getHTMLelement2(person) {
			console.log(person.REC);
			let HTML = "<a class='SelCard' id='" + person.SEX
				+ "' onClick='jumpTo(`" + person.REC + "`);'><div><b>"
				+ person.fNAME + " " + person.lNAME + "</b><br>Geslacht: ";
			if (person.SEX == "M")	HTML += "Man";
			else if (person.SEX == "F")	HTML += "Vrouw";
			if (person.BIRT.DATE) HTML += "<br>geboren: " + person.BIRT.DATE.replace("(", "").replace(")", "") + " | " + person.BIRT.PLAC;
			if (person.DEAT.DATE) HTML += "<br>gestorven: " + person.DEAT.DATE.replace("(", "").replace(")", "") + " | " + person.DEAT.PLAC;
			//console.log(person);
			if (person.FAM.FAMS) {
				let fams = searchFamilyByREC(person.FAM.FAMS)[0];
				if (fams.family.PAR.DATE)  HTML += "<br>getrouwd: " + fams.family.PAR.DATE.replace("(", "").replace(")", "") + " | " + fams.family.PAR.PLAC;
			}
			HTML += "</div></a>";
			HTML = HTML.replace("undefined", "");
			return HTML;
		}
		
		function getHTMLelement3(person) {
			console.log(person.REC);
			let HTML = "<a class='card2' id='" + person.SEX
				+ "' onClick='jumpTo(`" + person.REC + "`);'><div><b>"
				+ person.fNAME + " " + person.lNAME + "</b>";
			HTML += "</div></a>";
			return HTML;
		}
		
		function drawLines(family) {
			lines = document.getElementById("lines");
			if (lines == null) return ;
			lines.innerHTML = "";
			
			let width = (gen1.children[1].offsetLeft) - (gen1.children[0].offsetLeft + gen1.children[0].offsetWidth);
			let left = gen1.children[0].offsetLeft + gen1.children[0].offsetWidth;
			let top = gen1.children[0].offsetTop + gen1.children[0].offsetHeight/2;
			let height = 2;
			
			line(width,height,top,left,lines);
			
			width = 2;
			left = ((gen1.children[1].offsetLeft) + (gen1.children[0].offsetLeft + gen1.children[0].offsetWidth))/2;
			height = ((gen1.children[0].offsetTop + gen2.children[0].offsetTop)/2) - top;
			
			line(width,height,top,left,lines);
			
			if (gen2.children[3].firstChild != null) {
				left = (gen2.children[0].offsetLeft + gen2.children[0].offsetWidth/2);
				width = (gen2.children[3].offsetLeft - gen2.children[0].offsetLeft) - (gen2.children[3].offsetWidth/2);
				top += height;
				height = 2;
			} else {
				gen2.children[3].style.borderStyle = "none";
				width = (left - (gen2.children[0].offsetLeft + gen2.children[0].offsetWidth/2));
				left = (gen2.children[0].offsetLeft + gen2.children[0].offsetWidth/2);
				top += height;
				height = 2;
			}
			
			line(width,height,top,left,lines);
			
			if (gen2.children[3].firstChild != null) {
				left += width;
				width = 2;
				height = gen2.children[3].offsetTop - top;
			
				line(width,height,top,left,lines);
			}
			
			left = (gen2.children[0].offsetLeft + gen2.children[0].offsetWidth/2);
			width = 2;
			height = gen2.children[0].offsetTop - top;
			
			line(width,height,top,left,lines);
			
			if (gen2.children[1].outerHTML == "<p></p>") return;
			
			left = gen2.children[0].offsetLeft + gen2.children[0].offsetWidth;
			top = gen2.children[1].offsetTop + gen2.children[1].offsetHeight/2;
			width = gen2.children[1].offsetLeft - left;
			height = 2;
			
			line(width,height,top,left,lines);
			
			
			if (gen3.children.length <= 2) return;
			
			left += width/2
			width = 2;
			height = gen3.children[0].offsetTop - top - 10;
			
			line(width,height,top,left,lines);
			
			top += height;
			height = 2;
			width = gen3.children[0].offsetLeft - left;
			
			line(width,height,top,left,lines);
			
			
			height = gen3.children[0].offsetHeight + 20;
			width = gen3.children[gen3.children.length-1].offsetLeft + gen3.children[gen3.children.length-1].offsetWidth - gen3.children[0].offsetLeft ;
			left = gen3.children[0].offsetLeft - 10;
			
			gen3.innerHTML = '<div style=" z-index: -1; width: ' + width + 'px; height: ' + height + 'px; border-style: solid; border-color: black; border-radius: 10px; position: absolute; top: ' + top + 'px; left: ' + left + 'px;"></div>' + gen3.innerHTML;
			for (let i = 0; i < family.gen3.CHIL.length; i++) {
				if (getFamily(family.gen3.CHIL[i].REC).gen3.CHIL.length != 0) {
					height = 50;
					width = 0;
					top = gen3.children[i+1].offsetTop + gen3.children[i+1].offsetHeight - 2;
					left = 0;
					left = gen3.children[i+1].offsetLeft + gen3.children[i+1].offsetWidth/2;
					console.log(gen3.children[i+1].offsetLeft+" "+gen3.children[i+1].offsetWidth/2+" "+i);
					gen3.innerHTML += '<div style=" z-index: '+i+'; width: ' + width + 'px; height: ' + height + 'px; border-style: solid; border-color: #FFD369; border-radius: 2px; position: absolute; top: ' + top + 'px; left: ' + left + 'px;"></div>';
				}
			}
		}
		
		
		function line(width, height, top, left, lines) {
			lines.innerHTML += '<div style="width: ' + width + 'px; height: ' + height + 'px; background-color: black; position: absolute; top: ' + top + 'px; left: ' + left + 'px;"></div>';
		}
		// <div style="width: 500px; height: 2px; background-color: white; position: absolute; top: 100px; left: 100px;"></div>