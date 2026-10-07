(() => {
  const params = new URLSearchParams(location.search);
  const groupKey = params.get("group") || document.body.dataset.verbGroup;
  const group = window.A1_VERB_GROUPS && window.A1_VERB_GROUPS[groupKey];
  const details = window.A1_VERB_DETAILS || {};
  if (!group) return;

  const reflexives = ["mich", "dich", "sich", "sich", "sich", "uns", "euch", "sich", "sich"];
  const subjects = ["Ich", "Du", "Er", "Sie", "Es", "Wir", "Ihr", "Sie", "Sie"];
  const labels = ["Ich", "Du", "Er", "sie (she)", "Es", "Wir", "Ihr", "sie (they)", "Sie (formal)"];
  const haveForms = ["habe", "hast", "hat", "hat", "hat", "haben", "habt", "haben", "haben"];
  const beForms = ["bin", "bist", "ist", "ist", "ist", "sind", "seid", "sind", "sind"];

  function getVerb(row) {
    const info = details[row[0]] || {};
    let forms, rawPast, meaning;
    if (groupKey === "stark") {
      meaning = row[5];
      const infinitive = row[0];
      forms = [row[1], row[2], row[4], row[4], row[4], infinitive, row[3], infinitive, infinitive];
      rawPast = "";
    } else {
      meaning = row[4];
      const infinitive = row[0];
      const particle = info.particle || "";
      const base = particle ? infinitive.slice(particle.length) : infinitive;
      const stem = base.replace(/en$/, "");
      const makeFull = value => particle ? value + " " + particle : value;
      const du = particle ? row[2].replace(new RegExp("\\s+" + particle + "$"), "") : row[2];
      const er = particle ? row[1].replace(new RegExp("\\s+" + particle + "$"), "") : row[1];
      forms = [
        makeFull(stem + "e"), makeFull(du), makeFull(er), makeFull(er), makeFull(er),
        infinitive, makeFull(er), infinitive, infinitive
      ];
      rawPast = row[3];
    }
    const auxiliary = info.aux || (rawPast.startsWith("ist") ? "sein" : "haben");
    const participle = info.participle || rawPast.trim().split(" ").filter(Boolean).pop();
    return {infinitive:row[0], meaning, forms, auxiliary, participle, info};
  }

  const requested = params.get("verb");
  const verb = group.verbs.map(getVerb).find(item => item.infinitive === requested);
  const title = document.getElementById("example-title");
  const meaning = document.getElementById("example-meaning");
  const list = document.getElementById("sentence-list");
  const note = document.getElementById("example-note");
  const perfect = document.getElementById("perfect-sentence");
  const missing = document.getElementById("missing-verb");

  if (!verb) {
    document.getElementById("example-content").hidden = true;
    missing.hidden = false;
    return;
  }

  title.textContent = verb.infinitive;
  meaning.textContent = verb.meaning;
  document.title = verb.infinitive + " example sentences | Hallo Deutsch A1";
  document.getElementById("back-to-group").href = "a1-verbs-" + groupKey + ".html";

  function appendHighlightedSentence(target, subject, form, tail, particle, index) {
    target.append(document.createTextNode(subject + " "));
    const finite = particle ? form.replace(new RegExp("\\s+" + particle + "$"), "") : form;
    const verbMark = document.createElement("mark");
    verbMark.textContent = finite;
    target.append(verbMark);
    const cleanTail = tail.replace("{{reflexive}}", reflexives[index]);
    if (cleanTail) target.append(document.createTextNode(" " + cleanTail));
    if (particle) {
      target.append(document.createTextNode(" "));
      const particleMark = document.createElement("mark");
      particleMark.textContent = particle;
      target.append(particleMark);
    }
    target.append(document.createTextNode("."));
  }

  verb.forms.forEach((form, index) => {
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.className = "sentence-pronoun";
    label.textContent = labels[index];
    const sentence = document.createElement("p");
    sentence.className = "sentence-example";
    appendHighlightedSentence(sentence, subjects[index], form, verb.info.tail || "", verb.info.particle || "", index);
    item.append(label, sentence);
    list.append(item);
  });

  if (verb.info.note) {
    note.textContent = verb.info.note;
    note.hidden = false;
  }

  const auxForm = verb.auxiliary === "sein" ? beForms[0] : haveForms[0];
  perfect.append(document.createTextNode("Ich "));
  const auxMark = document.createElement("mark");
  auxMark.textContent = auxForm;
  perfect.append(auxMark);
  const perfectTail = (verb.info.tail || "").replace("{{reflexive}}", "mich");
  if (perfectTail) perfect.append(document.createTextNode(" " + perfectTail));
  perfect.append(document.createTextNode(" "));
  const participleMark = document.createElement("mark");
  participleMark.textContent = verb.participle;
  perfect.append(participleMark, document.createTextNode("."));
})();
