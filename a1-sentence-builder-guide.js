(() => {
  const levels=window.SENTENCE_BUILDER_LEVELS;
  const p=new URLSearchParams(location.search), key=p.get("level")||"introduction";
  const level=levels[key]||levels.introduction;
  document.body.dataset.level=key;
  const back="a1-sentence-builder-play.html?level="+encodeURIComponent(key)+"&resume=1";
  document.getElementById("guide-back").href=back;
  document.getElementById("guide-return").href=back;
  document.getElementById("guide-title").textContent="How are these sentences built?";
  document.getElementById("guide-subtitle").textContent=level.title+" · Simple explanations for all ten sentences.";
  const list=document.getElementById("sb-guide-list");
  level.tasks.forEach((task,i)=>{
    const card=document.createElement("article");card.className="sb-guide-card";card.id="sentence-"+(i+1);
    const link=document.createElement("a");link.className="sb-guide-question-link";
    link.href="a1-sentence-builder-play.html?level="+encodeURIComponent(key)+"&question="+(i+1);
    link.setAttribute("aria-label","Return to sentence "+(i+1));link.textContent="←";
    const label=document.createElement("p");label.className="sb-chapter-label";label.textContent="SENTENCE "+(i+1)+" OF 10";
    const h=document.createElement("h2");h.textContent=task.target;
    const note=document.createElement("p");note.textContent=task.note;
    card.append(link,label,h,note);list.appendChild(card);
  });
})();

