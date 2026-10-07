(() => {
  const levels=window.SENTENCE_BUILDER_LEVELS;
  const p=new URLSearchParams(location.search);
  const key=p.get("level")||"introduction";
  const level=levels[key]||levels.introduction;
  document.body.dataset.level=key;
  document.getElementById("picker-level-name").textContent=level.title+" · Choose a question from 1 to 10.";
  document.getElementById("picker-back").href="a1-sentence-builder-play.html?level="+encodeURIComponent(key)+"&resume=1";
  const grid=document.getElementById("sb-picker-grid");
  for(let n=1;n<=level.tasks.length;n++){
    const a=document.createElement("a");
    a.href="a1-sentence-builder-play.html?level="+encodeURIComponent(key)+"&question="+n;
    a.textContent=String(n);a.setAttribute("aria-label","Open sentence "+n);
    grid.appendChild(a);
  }
})();

