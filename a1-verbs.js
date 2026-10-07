(() => {
  const groupKey = document.body.dataset.verbGroup;
  const group = window.A1_VERB_GROUPS && window.A1_VERB_GROUPS[groupKey];
  const details = window.A1_VERB_DETAILS || {};
  if (!group) return;

  const pronouns = [
    "Ich", "Du", "Er", "sie (she)", "Es", "Wir", "Ihr", "sie (they)", "Sie (formal)"
  ];
  const title = document.getElementById("group-title");
  const description = document.getElementById("group-description");
  const list = document.getElementById("verb-entry-list");
  const input = document.getElementById("verb-search");
  const count = document.getElementById("verb-count");
  const empty = document.getElementById("verb-empty");

  title.textContent = group.title;
  description.textContent = group.description;

  function buildVerb(row) {
    const info = details[row[0]] || {};
    const particle = info.particle || "";
    let forms, meaning, rawPast;
    if (groupKey === "stark") {
      meaning = row[5];
      forms = [row[1], row[2], row[4], row[4], row[4], row[0], row[3], row[0], row[0]];
      rawPast = "";
    } else {
      meaning = row[4];
      const baseInfinitive = particle ? row[0].slice(particle.length) : row[0];
      const stem = baseInfinitive.replace(/en$/, "");
      const stripParticle = value => particle ? value.replace(new RegExp("\\s+" + particle + "$"), "") : value;
      const appendParticle = value => particle ? value + " " + particle : value;
      const finiteEr = stripParticle(row[1]);
      const finiteDu = stripParticle(row[2]);
      forms = [
        appendParticle(stem + "e"), appendParticle(finiteDu),
        appendParticle(finiteEr), appendParticle(finiteEr), appendParticle(finiteEr),
        row[0], appendParticle(finiteEr), row[0], row[0]
      ];
      rawPast = row[3];
    }

    const pastMatch = rawPast.match(/^(hat|ist)(?:\s*\/\s*(?:hat|ist))?\s+(.+)$/);
    const participle = info.participle || (pastMatch ? pastMatch[2] : "");
    const auxiliary = info.aux || (pastMatch && pastMatch[1] === "ist" ? "sein" : "haben");
    return {infinitive:row[0], meaning, forms, participle, auxiliary};
  }

  const entries = group.verbs.map(buildVerb);

  function makeFormChip(label, form, extraClass) {
    const chip = document.createElement("div");
    chip.className = "form-chip" + (extraClass ? " " + extraClass : "");
    const pronoun = document.createElement("span");
    pronoun.textContent = label;
    const value = document.createElement("strong");
    value.textContent = form;
    chip.append(pronoun, value);
    return chip;
  }

  function makeEntry(verb) {
    const article = document.createElement("article");
    article.className = "verb-entry";

    const identity = document.createElement("div");
    identity.className = "verb-identity";
    const infinitive = document.createElement("h2");
    infinitive.textContent = verb.infinitive;
    const meaning = document.createElement("p");
    meaning.className = "verb-meaning";
    meaning.textContent = verb.meaning;
    identity.append(infinitive, meaning);

    const formsHeading = document.createElement("p");
    formsHeading.className = "forms-heading";
    formsHeading.textContent = "Present tense";

    const forms = document.createElement("div");
    forms.className = "verb-forms-grid";
    verb.forms.forEach((form, index) => forms.append(makeFormChip(pronouns[index], form)));

    const past = makeFormChip("Past participle", verb.participle, "participle-chip");

    const link = document.createElement("a");
    link.className = "example-link";
    link.href = "a1-verb-examples.html?group=" + encodeURIComponent(groupKey) + "&verb=" + encodeURIComponent(verb.infinitive);
    link.textContent = "See example sentences";
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = " →";
    link.append(arrow);

    article.append(identity, formsHeading, forms, past, link);
    return article;
  }

  function render() {
    const query = input.value.trim().toLocaleLowerCase();
    const filtered = entries.filter(verb =>
      [verb.infinitive, verb.meaning, verb.participle, ...verb.forms]
        .join(" ").toLocaleLowerCase().includes(query)
    );
    list.replaceChildren(...filtered.map(makeEntry));
    count.textContent = query
      ? filtered.length + " of " + entries.length + " verbs"
      : entries.length + " verbs";
    empty.hidden = filtered.length !== 0;
  }

  input.addEventListener("input", render);
  render();
})();
