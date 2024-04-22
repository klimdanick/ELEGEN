/*{
    _TEST_Indis_length();
    _TEST_Indi_By_Id();
    _TEST_Indi_Parse();
    _TEST_Fams_length();
    _TEST_Fams_Parse();
    _TEST_build_fam();
    _TEST_build_rel();
}*/

async function a() {
    let lines = await fetchGed();
    let a = 100;
    let tot = 0, totOpt = 0;
    for (let i = 0; i < a; i++) {
        let t = Date.now();
        await getIndis(lines);
        tot += Date.now() - t;
        let t2 = Date.now();
        await getIndisOpt(lines);
        totOpt += Date.now() - t2;
    }
    tot/=a;
    totOpt/=a;

    console.table({tot, totOpt});
    console.log("\n");
}
a();

async function _TEST_Indis_length() {
    let pass = true;
    let time = Date.now();
    let indis = await getIndisOpt();
    time = Date.now() - time;
    pass = indis.length == 5559;

    console.log(_TEST_Indis_length.name);
    if (pass) console.table({pass, passOpt, time, timeOpt});
    else console.table({pass, passOpt, time, timeOpt, "length": indis.length, "lengthOpt": indisOpt.length});
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
    //console.log(f);
}

async function _TEST_build_rel() {
    let indis = await getIndis();
    let fams = await getFams();
    let p = "@I1335@";
    let rel = await buildRel(p, indis, fams);

    let result = {"gen0": [], "gen1": [], "gen2": []};

    result.gen0["husb"] = rel.gen0.husb.name == "Pieter Willem /IMHOLZ/";
    result.gen0["wife"] = rel.gen0.wife.name == "Anna Maria Eduarda /KONERMANN/";

    result.gen1["husb"] = rel.gen1.husb.name == "Koen Pieter Willem /Imholz/";
    result.gen1["wife"] = rel.gen1.wife.name == "Louise Johanna /Komijn/";

    result.gen2["chil1"] = rel.gen2[0].name == "Mylene Angelica /Imholz/";
    result.gen2["chil2"] = rel.gen2[1].name == "Danick Xavier /Imholz/";

    console.log(_TEST_build_rel.name);
    console.table(result);
    console.log("\n");
}