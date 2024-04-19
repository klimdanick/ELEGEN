{
    _TEST_Indis_length();
    _TEST_Indi_By_Id();
    _TEST_Indi_Parse();
    _TEST_Fams_length();
    _TEST_Fams_Parse();
    _TEST_build_fam();
    _TEST_build_rel();
}


async function _TEST_Indis_length() {
    let pass = true;
    let time = Date.now();
    let indis = await getIndis();
    time = Date.now() - time;
    pass = indis.length == 5559;
    console.log(_TEST_Indis_length.name);
    if (pass) console.table({pass, time});
    else console.table({pass, time, "length": indis.length});
    console.log("\n");
}

async function _TEST_Indi_By_Id() {
    let indis = await getIndis();
    let pass = true;
    let time = Date.now();
    let p = findByRec("@I4729@", indis);
    time = Date.now() - time;
    pass = p.name == "Joost Willemsz /de Bruijs/";
    console.log(_TEST_Indi_By_Id.name);
    if (pass) console.table({pass, time});
    else console.table({pass, time, "Person": p});
    console.log("\n");
}

async function _TEST_Indi_Parse() {
    let indis = await getIndis();
    let p = findByRec("@I5@", indis);
    let result = {"name": [], "nick": [], "sex": [], "rfn": [], "birth": [], "chr": [], "deat": [], "famc": [], "fams": []};

    result.name["value"] = p.name; result.name["passed"] = p.name == "Jennegien /van Aarst/";
    result.nick["value"] = p.nick; result.nick["passed"] = p.nick == "Jannetje/Jannigje";
    result.sex["value"] = p.sex; result.sex["passed"] = p.sex == "F";
    result.rfn["value"] = p.ref; result.rfn["passed"] = p.ref == "5";
    result.birth["value"] = p.birth.date; result.birth["passed"] = p.birth.date == "15 OCT 1806";
    result.chr["value"] = p.baptized.date; result.chr["passed"] = p.baptized.date == "02 NOV 1806";
    result.deat["value"] = p.death.date; result.deat["passed"] = p.death.date == "1887";
    result.famc["value"] = p.famc; result.famc["passed"] = p.famc == "@F2@";
    result.fams["value"] = p.fams; result.fams["passed"] = p.fams == "@F3@";
    console.log(_TEST_Indi_Parse.name);
    console.table(result);
    console.log("\n");
}

async function _TEST_Fams_length() {
    let pass = true;
    let time = Date.now();
    let fams = await getFams();
    time = Date.now() - time;
    pass = fams.length == 2119;
    console.log(_TEST_Fams_length.name);
    if (pass) console.table({pass, time});
    else console.table({pass, time, "length": fams.length});
    console.log("\n");
}

async function _TEST_Fams_Parse() {
    let fam = (await getFams())[0];
    let result = {"husb": [], "wife": [], "rfn": [], "mar": [], "chil": []};

    result.husb["value"] = fam.husb; result.husb["passed"] = fam.husb == "@I5542@";
    result.wife["value"] = fam.wife; result.wife["passed"] = fam.wife == "@I5543@";
    result.rfn["value"] = fam.rfn; result.rfn["passed"] = fam.rfn == "1";
    result.mar["value"] = fam.mar.type; result.mar["passed"] = fam.mar.type == "Civil";
    result.chil["value"] = fam.chil[0]; result.chil["passed"] = fam.chil[0] == "@I4506@";

    console.log(_TEST_Fams_Parse.name);
    console.table(result);
    console.log("\n");
}

async function _TEST_build_fam() {
    let indis = await getIndis();
    let fams = await getFams();
    let f = buildFam(fams[0], indis);
    console.log(f);
}

async function _TEST_build_fam() {
    let indis = await getIndis();
    let fams = await getFams();
    let p = "@I1284@";
    let rel = await buildRel(p, indis, fams);
    console.log(f);
}