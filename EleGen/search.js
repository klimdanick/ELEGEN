function findByName(name, indis) {
	let result = [];
	for (let i = 0; i < indis.length; i++)
		if (indis[i].name.toLowerCase().includes(name.toLowerCase()))
			result.push(indis[i]);
	return result;
}

function findByRec(id, indis) {
	for (let i = 0; i < indis.length; i++)
		if (indis[i].id == id)
			return indis[i];
	return null;
}

function findFamByRec(ids, fams) {
	let fams_ = [];
	for (let i = 0; i < fams.length; i++)
		if (ids.includes(fams[i].id))
			fams_.push(fams[i]);
	return fams_;
}

// Lightweight fuzzy similarity (normalized intersection ratio)
function similarity(a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();
	if (!a || !b) return 0;
	if (a === b) return 1;
  
	// Simple token-based overlap (not heavy Levenshtein)
	const aTokens = a.split(/\s+/);
	const bTokens = b.split(/\s+/);
  
	let matches = 0;
	for (const at of aTokens) {
	  for (const bt of bTokens) {
		if (bt && at.includes(bt)) matches++;
	  }
	}
	return matches / Math.max(aTokens.length, bTokens.length);
  }
  
  async function getPeopleWithQuarry(value) {
	if (!value || value.trim() === "") return indis;
  
	const query = value.toLowerCase().trim();
	const queryWords = query.split(/\s+/);
  
	return indis
	  .map(person => {
		const fields = [
		  (person.name || "").replace(/[\/]/g, " "), // normalize names
		  person.note || "",
		  person.birth?.date || "",
		  person.death?.date || "",
		  person.mar?.date || ""
		].map(f => f.toLowerCase());
  
		// Base relevance: number of query words found
		let wordHits = 0;
		queryWords.forEach(q => {
		  if (fields.some(f => f.includes(q))) wordHits++;
		});
  
		// Fuzzy relevance: best similarity score
		const fuzzyScore = Math.max(...fields.map(f => similarity(f, query)));
  
		// Combine both metrics (weighted)
		const score = wordHits * 1.5 + fuzzyScore;
  
		return { person, score };
	  })
	  .filter(entry => entry.score > 0.2)
	  .sort((a, b) => b.score - a.score)
	  .map(entry => entry.person);
  }
  


async function search(value) {
	let results = await getPeopleWithQuarry(value);
	renderSearchResults(results);
}

function renderSearchResults(results) {
	currentGraph = 0;

	while (elegenLayout.htmlEl.firstChild) {
        elegenLayout.htmlEl.removeChild(elegenLayout.htmlEl.lastChild);
    }

    elegenLayout.appendChild(elegenMenu);

	let resultsLayout = new GenLayout("grid");
	setTimeout(() => {
		let w = resultsLayout.htmlEl.getBoundingClientRect().width;
		resultsLayout.setGrid({
			columns: `repeat(${Math.floor(w/200)-1}, 200px)`,
			rows: "auto",
			gap: "20px"
		});
	}, 100);
	elegenLayout.appendChild(resultsLayout);
	resultsLayout.style.height = "100%";
	resultsLayout.style.overflowY = "auto";

	for (let i = 0; i < results.length; i++) {
		let card = new PersonCard(results[i]);
		resultsLayout.appendChild(card);
	}
}