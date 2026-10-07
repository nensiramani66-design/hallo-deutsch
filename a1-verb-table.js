(() => {
  const groups = window.A1_VERB_GROUPS || {};
  const groupKey = new URLSearchParams(window.location.search).get("group") || document.body.dataset.verbGroup || "normal";
  const group = groups[groupKey];
  const title = document.getElementById("table-title");
  const description = document.getElementById("table-description");
  const head = document.getElementById("pdf-table-head");
  const body = document.getElementById("pdf-table-body");
  const search = document.getElementById("table-search");
  const count = document.getElementById("table-count");
  const empty = document.getElementById("table-empty");
  const continueLink = document.getElementById("continue-to-examples");

  if (!group) {
    title.textContent = "Verb group not found";
    description.textContent = "Please return to the A1 verb groups and choose a table.";
    document.querySelector(".verb-list-panel").hidden = true;
    return;
  }

  title.textContent = group.title;
  description.textContent = "Complete A1 verb list. Search by German form or English meaning.";
  document.querySelector(".pdf-table-scroll table").dataset.columns = String(group.columns.length);
  document.title = group.title + " Table | Hallo Deutsch A1";
  continueLink.href = "a1-verbs-" + groupKey + ".html";

  group.columns.forEach(([label]) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    head.append(th);
  });

  const render = () => {
    const query = search.value.trim().toLocaleLowerCase();
    const matches = group.verbs.filter(row => row.some(value => String(value).toLocaleLowerCase().includes(query)));
    body.replaceChildren();
    matches.forEach(row => {
      const tr = document.createElement("tr");
      group.columns.forEach(([, index]) => {
        const td = document.createElement("td");
        td.textContent = row[index] ?? "";
        tr.append(td);
      });
      body.append(tr);
    });
    count.textContent = matches.length + (matches.length === 1 ? " verb" : " verbs");
    empty.hidden = matches.length !== 0;
  };

  search.addEventListener("input", render);
  render();
})();
