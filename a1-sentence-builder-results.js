(() => {
  const levels=window.SENTENCE_BUILDER_LEVELS;
  const p=new URLSearchParams(location.search), key=p.get("level")||"introduction";
  const level=levels[key]||levels.introduction;
  document.body.dataset.level=key;
  document.getElementById("result-title").textContent=level.title+" · Sentence review";
  document.getElementById("play-again").href="a1-sentence-builder-play.html?level="+encodeURIComponent(key);
  let report=null;
  try{report=JSON.parse(sessionStorage.getItem("a1SentenceBuilderResults_"+key)||"null")}catch(_){}
  const summary=document.getElementById("sb-review-summary"),root=document.getElementById("sb-review-list");
  if(!report||!Array.isArray(report.questions)){
    summary.textContent="Your review is not available in this tab yet. Complete the ten sentences to see your results here.";
    root.hidden=true;return;
  }
  const correct=report.questions.filter(q=>q.answeredCorrectly).length;
  summary.textContent=""+level.title+" · "+correct+" of 10 correct · Score: "+(Number(report.score)||0)+" points";
  report.questions.forEach(item=>{
    const card=document.createElement("article");
    const wrong=Array.isArray(item.wrongAttempts)?item.wrongAttempts:[];
    card.className="sb-review-card "+(wrong.length?"is-mistake":item.answeredCorrectly?"is-correct":"is-unanswered");
    const label=document.createElement("p");label.className="sb-review-number";label.textContent="SENTENCE "+item.number+" OF 10";
    const prompt=document.createElement("h2");prompt.textContent=item.prompt;card.append(label,prompt);
    if(wrong.length){
      wrong.forEach((attempt,n)=>{
        const row=document.createElement("p");row.className="sb-review-wrong";
        const l=document.createElement("span");l.textContent=wrong.length>1?"Your attempt "+(n+1):"Your attempt";
        const t=document.createElement("strong");t.textContent=attempt;row.append(l,t);card.appendChild(row);
      });
      const row=document.createElement("p");row.className="sb-review-correct";
      const l=document.createElement("span");l.textContent="Correct sentence";
      const t=document.createElement("strong");t.textContent=item.correctSentence;row.append(l,t);card.appendChild(row);
    }else if(item.answeredCorrectly){
      const row=document.createElement("p");row.className="sb-review-correct-only";row.textContent=item.correctSentence;card.appendChild(row);
    }else{
      const row=document.createElement("p");row.className="sb-review-unanswered";
      row.textContent="Not answered · Correct sentence: "+item.correctSentence;card.appendChild(row);
    }
    root.appendChild(card);
  });
})();

