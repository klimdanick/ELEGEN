renderGraphFunctions.push(renderRelations);

function renderRelations(layoutMain) {
    while (layoutMain.htmlEl.firstChild) {
        layoutMain.htmlEl.removeChild(layoutMain.htmlEl.lastChild);
    }

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
    
    let sel = new PersonCard(rel.gen1.sel);
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
    layoutMain.appendChild(gen2);

    for (let i = 0; i < rel.gen2.length; i++) {
        let p = rel.gen2[i];
        if (p) {
            p = new PersonCard(p);
            gen2.appendChild(p);
            gen2Cards.push(p);
        }
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
}

function drawLines(layoutMain, lineLayout, sel, gen0Cards, gen1Cards, gen2Cards) {
    if (currentGraph != 0) return;
    while (lineLayout.htmlEl.firstChild) {
        lineLayout.htmlEl.removeChild(lineLayout.htmlEl.lastChild);
    }

    for (let i = 0; i < gen0Cards.length; i++) {
        let pos1 = calcPosition(gen0Cards[i].htmlEl, layoutMain.htmlEl);
        let pos2 = calcPosition(sel.htmlEl, layoutMain.htmlEl);

        lineLayout.appendChild(new BlockLine("v", pos1, pos2));
    }

    for (let i = 0; i < gen1Cards.length; i++) {
        let pos1 = calcPosition(gen1Cards[i].htmlEl, layoutMain.htmlEl);
        let pos2 = calcPosition(sel.htmlEl, layoutMain.htmlEl);

        lineLayout.appendChild(new BlockLine("h", pos1, pos2));
    }

    for (let i = 0; i < gen2Cards.length; i++) {
        let pos1 = calcPosition(gen2Cards[i].htmlEl, layoutMain.htmlEl);
        let pos2 = calcPosition(sel.htmlEl, layoutMain.htmlEl);

        if (gen1Cards.length > 0) {
            let pos3 = calcPosition(gen1Cards[0].htmlEl, layoutMain.htmlEl);
            pos2.x += (pos3.x - pos2.x)/2
        }

        lineLayout.appendChild(new BlockLine("v", pos1, {x: pos2.x, y: pos2.y}));
    }
}


function calcPosition(target, outer) {
    const outerRect = outer.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    const relativeX = targetRect.left - outerRect.left;
    const relativeY = targetRect.top - outerRect.top;

    const centerX = relativeX + targetRect.width / 2;
    const centerY = relativeY + targetRect.height / 2;

    return {x: centerX+8, y: centerY+8};
}

class GenLayout extends Layout {
    constructor(dir) {
        super(dir);
        this.htmlEl.classList.add("genLayout");
    }
}

class PersonCard extends Card {
    constructor(indi) {
        super();
        this.indi = indi;
        this.htmlEl.classList.add("personCard");
        this.htmlEl.classList.add(indi.sex);

        const match = indi.name.match(/^(.+?)\/(.+?)\/$/);
        if (match) {
            const firstNames = match[1].trim().split(" ")[0];
            const lastName = match[2].trim();
            if (firstNames != "X") this.appendChild(`<span>${firstNames} <b>${lastName}</b></span>`);
            // else this.htmlEl.classList.remove(indi.sex);
        } else {
            // console.log("Invalid format");
            // this.htmlEl.classList.remove(indi.sex);
        }
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
    console.log(famC);

    let famS = findFamByRec(p.fams, fams);
    for (let i = 0; i < famS.length; i++) buildFam(famS[i], indis);
    console.log(famS);

    let pars = [];
    for (let i = 0; i < famS.length; i++) {
        if (famS[i].wife.id != p.id) {
            pars.push(famS[i].wife);
            pars[i].mar = famS[i].mar;
        }
        if (famS[i].husb.id != p.id) {
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