
elegenMenuItems.push(
    new SimpleMenuItem("EleGen/graphs/assets/relations_selected.png", "Relaties", renderRelations)
);

function renderRelations() {
    currentGraph = 1;
    let layoutMain = elegenLayout;
    while (layoutMain.htmlEl.firstChild) {
        layoutMain.htmlEl.removeChild(layoutMain.htmlEl.lastChild);
    }

    layoutMain.appendChild(elegenMenu);

    let rel = buildRel(selectedId, indis, fams);
    if (!rel) return;

    let gen0 = new GenLayout("row");
    let gen0Cards = [];
    gen0.htmlEl.classList.add("gen0");
    layoutMain.appendChild(gen0);
    
    if (rel.gen0.husb) {
        let c = new PersonCard(rel.gen0.husb);
        gen0.appendChild(c);
        gen0Cards.push(c);
    }
    if (rel.gen0.wife) {
        let c = new PersonCard(rel.gen0.wife);
        gen0.appendChild(c);
        gen0Cards.push(c);
    }
    
    let gen1 = new GenLayout("row");
    let gen1Cards = [];
    gen1.htmlEl.classList.add("gen1");
    let parsLayout = new Layout("column");
    parsLayout.htmlEl.classList.add("parsList");
    gen1.appendChild(parsLayout);
    layoutMain.appendChild(gen1);
    
    let sel = new PersonCard(rel.gen1.sel, false);
    if (sel) {
        gen1.appendChild(sel);
        sel.htmlEl.classList.add("sel");
    }

    for (let i = 0; i < rel.gen1.pars.length; i++) {
        let par = rel.gen1.pars[i];
        if (par) {
            par = new PersonCard(par);
            parsLayout.appendChild(par);
            gen1Cards.push(par);
        }
    }

    let gen2 = new GenLayout("row");
    let gen2Cards = [];
    gen2.htmlEl.classList.add("gen2");
    gen2.htmlEl.classList.add("scroll-container");
    layoutMain.appendChild(gen2);

    for (let i = 0; i < rel.gen2.length; i++) {
        let p = rel.gen2[i];
        if (p) {
            p = new PersonCard(p);
            gen2.appendChild(p);
            gen2Cards.push(p);
        }
    }

    /*------------*\
    |     NOTE     |
    \*------------*/

    if (rel.gen1.sel.note) {
        let noteLayout = new Layout();
        noteLayout.htmlEl.classList.add("noteLayout");
        gen1.appendChild(noteLayout);

        let note = new Card();
        note.appendChild(rel.gen1.sel.note);
        noteLayout.appendChild(note);
    }

    /*-------------*\
    |     LINES     |
    \*-------------*/

    let lineLayout = new Layout();
    lineLayout.htmlEl.classList.add("lineLayout");
    layoutMain.appendChild(lineLayout);
    // lineLayout.appendChild(new BlockLine("v", {x: 100, y: 100}, {x: 200, y: 200}));

    setTimeout(() => {drawLines(layoutMain, lineLayout, sel, gen0Cards, gen1Cards, gen2Cards)}, 100)
    addEventListener("resize", () => {drawLines(layoutMain, lineLayout, sel, gen0Cards, gen1Cards, gen2Cards)})
    gen2.htmlEl.addEventListener('scroll', () => {drawLines(layoutMain, lineLayout, sel, gen0Cards, gen1Cards, gen2Cards)})
}

function drawLines(layoutMain, lineLayout, sel, gen0Cards, gen1Cards, gen2Cards) {
    let rel = buildRel(selectedId, indis, fams);

    if (currentGraph != 1) return;
    while (lineLayout.htmlEl.firstChild) {
        lineLayout.htmlEl.removeChild(lineLayout.htmlEl.lastChild);
    }

    for (let i = 0; i < gen0Cards.length; i++) {
        let pos1 = calcPosition(gen0Cards[i].htmlEl, layoutMain.htmlEl);
        let pos2 = calcPosition(sel.htmlEl, layoutMain.htmlEl);

        lineLayout.appendChild(new BlockLine("v", pos1, pos2));

        let par = false;
        if (i == 0 && rel.gen0.husb.famc) par = true;
        if (i == 1 && rel.gen0.wife.famc) par = true;
        if (par) {
            let line = new BlockLine("v", pos1, {x: pos1.x, y: pos1.y-1000});
            line.htmlEl.classList.add("dashed");
            lineLayout.appendChild(line);
        }
    }

    for (let i = 0; i < gen1Cards.length; i++) {
        let pos1 = calcPosition(gen1Cards[i].htmlEl, layoutMain.htmlEl);
        let pos2 = calcPosition(sel.htmlEl, layoutMain.htmlEl);

        lineLayout.appendChild(new BlockLine("h", pos1, pos2));

        if (rel.gen1.pars[i].famc) {
            let line = new BlockLine("v", pos1, {x: pos1.x, y: pos1.y-1000});
            line.htmlEl.classList.add("dashed");
            lineLayout.appendChild(line);
        }

        let label;
        if (rel.gen1.pars[i].mar) label = rel.gen1.pars[i].mar.date + "\n\n" + rel.gen1.pars[i].mar.plac;
        if (label) {
            label = new Text(label);
            label.style.position = "absolute";
            label.style.left = `${pos1.x+200}px`;
            label.style.top = `${pos1.y-40}px`;
            lineLayout.appendChild(label);
        }
    }

    for (let i = 0; i < gen2Cards.length; i++) {
        let pos1 = calcPosition(gen2Cards[i].htmlEl, layoutMain.htmlEl);
        let pos2 = calcPosition(sel.htmlEl, layoutMain.htmlEl);

        if (gen1Cards.length > 0) {
            let pos3 = calcPosition(gen1Cards[0].htmlEl, layoutMain.htmlEl);
            pos2.x += (pos3.x - pos2.x)/2
        }

        lineLayout.appendChild(new BlockLine("v", pos1, {x: pos2.x, y: pos2.y}));

        let children = false;
		for (let j = 0; j < rel.gen2[i].fams.length; j++) {
			chil = findFamByRec(rel.gen2[i].fams[j], fams)[0].chil;
			if (chil && chil.length>0) children = true;
		}

        if (children) {
            let line = new BlockLine("v", pos1, {x: pos1.x, y: pos1.y+1000});
            line.htmlEl.classList.add("dashed");
            lineLayout.appendChild(line);
        }
    }
}


function calcPosition(target, outer) {
    const outerRect = outer.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    const relativeX = targetRect.left - outerRect.left;
    const relativeY = targetRect.top - outerRect.top;

    const centerX = relativeX + targetRect.width / 2;
    const centerY = relativeY + targetRect.height / 2;

    return {x: centerX, y: centerY};
}

class GenLayout extends Layout {
    constructor(dir) {
        super(dir);
        this.htmlEl.classList.add("genLayout");
    }
}

class PersonCard extends Card {
    constructor(indi, compact = true) {
        super(180);
        this.indi = indi;
        this.htmlEl.classList.add("personCard");
        this.htmlEl.classList.add(indi.sex);

        const match = indi.name.match(/^(.+?)\/(.+?)\/$/);
        if (match) {
            const firstNames = match[1].trim().split(" ")[0];
            const lastName = match[2].trim();
            if (firstNames == "X") {
                this.style.width = "";
                return;
            }
            // this.htmlEl.classList.remove(indi.sex);
            
            this.appendChild(`<span>${firstNames} <b>${lastName}</b></span>`);

            let lifespanLayout = new Layout("row");
            this.appendChild(lifespanLayout);
            let s = "";
            if (indi.birth && indi.death) {
                s = `<span class="lifespan">${indi.birth.date}`; if (!compact) s += `\n${indi.birth.plac}</span>`;
                lifespanLayout.appendChild(s);
                lifespanLayout.appendChild(`<span class="lifespan"><b>-</b></span>`);
                s = `<span class="lifespan">${indi.death.date}`; if (!compact) s+= `\n${indi.death.plac}</span>`
                lifespanLayout.appendChild(s);
            } else if (indi.birth) {
                s = `<span class="lifespan">${indi.birth.date}`; if (!compact) s += `\n${indi.birth.plac}</span>`;
                lifespanLayout.appendChild(s);
                lifespanLayout.appendChild(`<span class="lifespan"><b>-</b></span>`);
                lifespanLayout.appendChild(`<span class="lifespan">unknown</span>`);
            } else if (indi.death) {
                lifespanLayout.appendChild(`<span class="lifespan">unknown</span>`);
                lifespanLayout.appendChild(`<span class="lifespan"><b>-</b></span>`);
                s = `<span class="lifespan">${indi.death.date}`; if (!compact) s+= `\n${indi.death.plac}</span>`
            }
            // TODO more info button
        } else this.style.width = "";
    }

    onClick() {
        selectPerson(this.indi.id);
    }
}




function buildRel(indi, indis, fams) {
    let p = findByRec(indi, indis);
    if (!p) return;
    let famC = findFamByRec([p.famc], fams)[0];
    buildFam(famC, indis);
    // console.log(famC);

    let famS = findFamByRec(p.fams, fams);
    for (let i = 0; i < famS.length; i++) buildFam(famS[i], indis);
    // console.log(famS);

    let pars = [];
    for (let i = 0; i < famS.length; i++) {
        if (famS[i].wife && famS[i].wife.id != p.id) {
            pars.push(famS[i].wife);
            pars[i].mar = famS[i].mar;
        }
        if (famS[i].husb && famS[i].husb.id != p.id) {
            pars.push(famS[i].husb);
            pars[i].mar = famS[i].mar;
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