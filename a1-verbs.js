(() => {
  const groupKey = document.body.dataset.verbGroup;
  const group = window.A1_VERB_GROUPS && window.A1_VERB_GROUPS[groupKey];
  if (!group) return;

  const title = document.getElementById("group-title");
  const description = document.getElementById("group-description");
  const head = document.getElementById("verb-table-head");
  const body = document.getElementById("verb-table-body");
  const input = document.getElementById("verb-search");
  const count = document.getElementById("verb-count");
  const empty = document.getElementById("verb-empty");

  title.textContent = group.title;
  description.textContent = group.description;

  const headerRow = document.createElement("tr");
  group.columns.forEach(([label]) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headerRow.append(th);
  });
  head.replaceChildren(headerRow);

  function render() {
    const query = input.value.trim().toLocaleLowerCase();
    const filtered = group.verbs.filter(verb =>
      verb.join(" ").toLocaleLowerCase().includes(query)
    );
    body.replaceChildren(...filtered.map(verb => {
      const row = document.createElement("tr");
      group.columns.forEach(([, index]) => {
        const cell = document.createElement("td");
        cell.textContent = verb[index];
        row.append(cell);
      });
      return row;
    }));
    count.textContent = query
      ? filtered.length + " of " + group.verbs.length + " verbs"
      : group.verbs.length + " verbs";
    empty.hidden = filtered.length !== 0;
  }

  input.addEventListener("input", render);
  render();
})();
