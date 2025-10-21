elegenMenuItems.push(
    new SimpleMenuItem("EleGen/graphs/assets/kwartier_selected.png", "Kwartierstaat", renderKwartierstaat)
);

let kwartLayout;

let options = { totalLevels: 6, baseRingWidth: 100 };
let FEMALE_COLOR, MALE_COLOR;

let imgs = [];

function renderInit() {
    currentGraph = 2;
    while (elegenLayout.htmlEl.firstChild) {
        elegenLayout.htmlEl.removeChild(elegenLayout.htmlEl.lastChild);
    }

    elegenLayout.appendChild(elegenMenu);

    FEMALE_COLOR = getComputedStyle(root).getPropertyValue('--FEMALE');
    MALE_COLOR = getComputedStyle(root).getPropertyValue('--MALE');

    kwartLayout = new Layout();
    kwartLayout.htmlEl.classList.add("kwartLayout");
    elegenLayout.appendChild(kwartLayout);

    // for (let i = 1; i <= 60; i++) {
    //     let image = new ImageEl();
    //     kwartLayout.appendChild(image);

    //     let blockImageSrc = generateRingBlockImage(i, "#4ab3e8");

    //     image.load(blockImageSrc);
    // }
}

async function renderKwartierstaat(id = selectedId, gen = 0, subangle = 90, angle = 0, depth = 100) {
    if (gen == 0) renderInit();
    if (depth == 0) return;


    let rels = await buildRel(id, indis, fams);
    // console.log(rels);
    let sel = rels.gen1.sel;
    if (!imgs[gen]) {
        let gen_ = gen <= 10 ? gen : 10;
        imgs[gen] = [];
        imgs[gen]["F"] = generateRingBlockImage(gen_, FEMALE_COLOR, options);
        imgs[gen]["M"] = generateRingBlockImage(gen_, MALE_COLOR, options);
    }

    let firstNames, lastName;
    const match = sel.name.match(/^(.+?)\/(.+?)\/$/);
    if (match) {
        firstNames = match[1].trim().split(" ")[0];
        lastName = match[2].trim();
        if (firstNames == "X") {
            this.style.width = "";
            return;
        }
    }
    // this.htmlEl.classList.remove(indi.sex);

    let image = document.createElement("img");
    let tile = new Element();
    tile.htmlEl.classList.add("tile");
    tile.htmlEl.classList.add(`gen${gen}`);
    if (gen < 4) tile.appendChild(`<span>${firstNames} <b>${lastName}</b></span>`);
    if (gen == 4) tile.appendChild(`<span style="font-size: 75%;">${firstNames} <b>${lastName}</b></span>`);
    if (gen == 5) tile.appendChild(`<span>${firstNames} <b>${lastName}</b></span>`);
    // if (gen == 6) tile.appendChild(`<span style="font-size: 50%; transform: rotate(90deg) translate(-5px, 15px); width: 30px"><b>${lastName}</b></span>`);
    tile.appendChild(image);
    tile.onClick = () => {
        selectPerson(sel.id);
    }
    kwartLayout.appendChild(tile);
    image.src = imgs[gen][sel.sex];

    let xpos = 50;
    let ypos = -options.baseRingWidth * gen + 30;
    if (gen == 0) ypos -= 25;
    if (gen == 1) ypos -= -7;
    if (gen == 2) ypos -= 0;
    if (gen == 3) ypos -= 0;
    if (gen == 4) ypos -= 0;
    if (gen == 5) ypos -= 0;

    if (gen > 0) {
        subangle = subangle / 2
        if (sel.sex == "F") angle += subangle;
        if (sel.sex == "M") angle -= subangle;
    }

    tile.style.transformOrigin = `${50}% ${100}%`;
    tile.style.transform = `rotate(${angle}deg)`;
    tile.style.transform += `translate(${0}%, ${ypos}px)`;

    let husb = rels.gen0.husb;
    let wife = rels.gen0.wife;

    if (husb) {
        if (typeof husb === 'string') husb = findByRec(husb, indis)
        renderKwartierstaat(husb.id, gen + 1, subangle, angle, depth - 1);
    }
    if (wife) {
        if (typeof wife === 'string') wife = findByRec(wife, indis)
        renderKwartierstaat(wife.id, gen + 1, subangle, angle, depth - 1);
    }
}

function generateRingBlockImage(ringLevel, color, options = {}) {
    const { totalLevels = 6, baseRingWidth = 50 } = options;
    // console.log(options);

    // Calculate radii
    const innerRadius = ringLevel * baseRingWidth;
    const outerRadius = (ringLevel + 1) * baseRingWidth;

    // Angle calculation: level 0 = 180°, then halves each level
    const totalAngle = Math.PI / Math.pow(2, ringLevel);
    const angleStart = -totalAngle / 2 - Math.PI / 2; // rotated 90° left
    const angleEnd = totalAngle / 2 - Math.PI / 2;    // rotated 90° left

    // Function to normalize angle between -PI and PI
    const normalize = a => ((a + Math.PI) % (2 * Math.PI)) - Math.PI;

    // Collect all critical angles for min/max x/y
    let criticalAngles = [angleStart, angleEnd];

    // Include axes if they are inside the arc
    const axes = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
    axes.forEach(a => {
        const na = normalize(a);
        if (na >= angleStart && na <= angleEnd) criticalAngles.push(a);
    });

    // Compute all x/y points
    let xs = [], ys = [];
    criticalAngles.forEach(a => {
        xs.push(innerRadius * Math.cos(a));
        xs.push(outerRadius * Math.cos(a));
        ys.push(innerRadius * Math.sin(a));
        ys.push(outerRadius * Math.sin(a));
    });

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    const canvas = document.createElement("canvas");
    canvas.width = width + 6;
    canvas.height = height + 6;
    const ctx = canvas.getContext("2d");

    // Offset to fit ring into canvas
    const cx = -minX + 3;
    const cy = -minY + 3;

    ctx.beginPath();
    ctx.moveTo(cx + innerRadius * Math.cos(angleStart), cy + innerRadius * Math.sin(angleStart));
    ctx.arc(cx, cy, innerRadius, angleStart, angleEnd);
    ctx.lineTo(cx + outerRadius * Math.cos(angleEnd), cy + outerRadius * Math.sin(angleEnd));
    ctx.arc(cx, cy, outerRadius, angleEnd, angleStart, true);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = CINDER_BLACK;
    if (ringLevel < 8) ctx.lineWidth = 3;
    else if (ringLevel < 10) ctx.lineWidth = 2;
    else ctx.lineWidth = 1;
    ctx.stroke();

    return canvas.toDataURL("image/png");
};