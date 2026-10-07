(() => {
  "use strict";
  const levels = window.SENTENCE_BUILDER_LEVELS;
  const params = new URLSearchParams(location.search);
  const levelKey = params.get("level") || "introduction";
  const level = levels[levelKey] || levels.introduction;
  const tasks = level.tasks;
  const progressKey = "a1SentenceBuilder_" + levelKey;
  const resultKey = "a1SentenceBuilderResults_" + levelKey;
  let current = Math.max(0, Math.min(tasks.length - 1, Number(params.get("question") || 1) - 1));
  let score = 0;
  let attempts = 0;
  let hintShown = false;
  let locked = false;
  let answer = [];
  let bank = [];
  let review = tasks.map(() => ({wrongAttempts:[], answeredCorrectly:false}));

  try {
    const saved = JSON.parse(sessionStorage.getItem(progressKey) || "null");
    if (saved && Array.isArray(saved.review) && saved.review.length === tasks.length) {
      review = saved.review;
      score = Number(saved.score) || 0;
      if (!params.has("question")) current = Math.max(0, Math.min(tasks.length - 1, Number(saved.current) || 0));
    }
  } catch (_) {}
  const $ = (id) => document.getElementById(id);
  const image = $("sb-scene-image");
  const phoneSource = $("sb-phone-source");
  $("sb-level-label").textContent = "A1 · " + level.label;
  $("sb-level-title").textContent = level.title;
  $("sb-level-subtitle").textContent = level.subtitle;
  document.body.dataset.level = levelKey;
  $("sb-question-picker").href = "a1-sentence-builder-questions.html?level=" + encodeURIComponent(levelKey) + "&resume=1";
  document.querySelector(".sb-explain-link").href = "a1-sentence-builder-guide.html?level=" + encodeURIComponent(levelKey);

  function save() {
    try { sessionStorage.setItem(progressKey, JSON.stringify({current, score, review})); } catch (_) {}
  }
  function shuffle(items) {
    for (let i=items.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1)); [items[i],items[j]]=[items[j],items[i]];
    }
    return items;
  }
  function showFeedback(message, wrong) {
    const node=$("sb-feedback"); node.textContent=message;
    node.classList.toggle("is-wrong",Boolean(wrong)); node.hidden=false;
  }
  function renderTiles() {
    const answerNode=$("sb-answer-zone"), bankNode=$("sb-word-bank");
    answerNode.replaceChildren(); bankNode.replaceChildren();
    if (!answer.length) {
      const empty=document.createElement("span"); empty.className="sb-empty-note";
      empty.textContent="Your sentence will appear here."; answerNode.appendChild(empty);
    }
    answer.forEach((tile,index)=>{
      const button=document.createElement("button"); button.type="button"; button.className="sb-tile";
      button.textContent=tile.word; button.setAttribute("aria-label",tile.word+", remove from sentence");
      button.disabled=locked; button.addEventListener("click",()=>{
        if(locked)return; bank.push(answer.splice(index,1)[0]); renderTiles();
      }); answerNode.appendChild(button);
    });
    bank.forEach((tile,index)=>{
      const button=document.createElement("button"); button.type="button"; button.className="sb-tile";
      button.textContent=tile.word; button.disabled=locked; button.addEventListener("click",()=>{
        if(locked)return; answer.push(bank.splice(index,1)[0]); renderTiles();
      }); bankNode.appendChild(button);
    });
    $("sb-check-button").disabled=locked||!answer.length;
  }
  function renderNav() {
    const nav=$("sb-question-nav"); nav.replaceChildren();
    tasks.forEach((_,index)=>{
      const b=document.createElement("button"); b.type="button"; b.textContent=String(index+1);
      b.setAttribute("aria-label","Open sentence "+(index+1));
      if(index===current)b.classList.add("is-current");
      if(review[index].answeredCorrectly)b.classList.add("is-complete");
      b.addEventListener("click",()=>{current=index;render();document.querySelector(".sb-board").scrollIntoView({block:"start",behavior:"smooth"});});
      nav.appendChild(b);
    });
  }
  function render() {
    const task=tasks[current], scene=level.scenes[Math.floor(current/2)];
    attempts=0; hintShown=false;
    $("sb-round").textContent="Sentence "+(current+1)+" of "+tasks.length;
    $("sb-score").textContent="Score: "+score;
    $("sb-progress").style.width=(((current+1)/tasks.length)*100)+"%";
    $("sb-progressbar").setAttribute("aria-valuenow",String(current+1));
    $("sb-chapter-label").textContent=level.label+" · SCENE "+(Math.floor(current/2)+1)+" OF 5";
    $("sb-chapter-title").textContent=level.theme;
    $("sb-chapter-note").textContent="Question "+(current+1)+" of 10 · Build a natural German sentence.";
    $("sb-scene-caption").textContent=scene.caption;
    image.src=scene.desktop; image.alt=scene.alt;
    phoneSource.srcset=scene.phone;
    $("sb-prompt").textContent=task.prompt;
    $("sb-hint").textContent=task.hint;
    $("sb-hint").hidden=true; $("sb-hint-button").setAttribute("aria-expanded","false");
    $("sb-feedback").hidden=true; $("sb-correction").hidden=true;
    $("sb-answer-zone").classList.remove("is-wrong","is-correct");
    const prior=review[current];
    $("sb-next-button").textContent=current===tasks.length-1?"Submit sentences →":"Next sentence →";
    if(prior.answeredCorrectly){
      locked=true; answer=(prior.correctSentence||task.target).split(" ").map(word=>({word}));
      bank=[]; $("sb-correction").hidden=false; $("sb-wrong-answer").hidden=true;
      $("sb-correct-text").textContent=prior.correctSentence||task.target;
      $("sb-answer-zone").classList.add("is-correct"); $("sb-check-button").hidden=true;
      $("sb-next-button").hidden=false;
    } else {
      locked=false; answer=[]; bank=shuffle(task.target.split(" ").map((word,index)=>({word,id:index})));
      $("sb-check-button").hidden=false; $("sb-next-button").hidden=true;
    }
    renderTiles(); renderNav(); save();
  }
  $("sb-hint-button").addEventListener("click",()=>{
    const node=$("sb-hint"); node.hidden=!node.hidden;
    $("sb-hint-button").setAttribute("aria-expanded",String(!node.hidden));
    if(!node.hidden)hintShown=true;
  });
  $("sb-reset-button").addEventListener("click",()=>{
    if(locked)return;
    bank=shuffle(tasks[current].target.split(" ").map((word,index)=>({word,id:index})));
    answer=[]; $("sb-answer-zone").classList.remove("is-wrong","is-correct"); renderTiles();
  });
  $("sb-check-button").addEventListener("click",()=>{
    if(locked||!answer.length)return;
    const task=tasks[current], built=answer.map(x=>x.word).join(" ");
    const correct=built===task.target||(task.accepted||[]).includes(built);
    const record=review[current];
    locked=true;
    if(correct){
      if(!record.answeredCorrectly)score+=(attempts===0&&!hintShown?10:5);
      record.answeredCorrectly=true; record.correctSentence=built;
      showFeedback("Correct! "+task.note,false);
      $("sb-answer-zone").classList.add("is-correct");
      $("sb-correction").hidden=false; $("sb-wrong-answer").hidden=true;
      $("sb-correct-text").textContent=built;
    } else {
      attempts++;
      record.wrongAttempts.push(built);
      showFeedback("Not quite. The correct sentence is shown below. You can continue and review it at the end.",true);
      $("sb-answer-zone").classList.add("is-wrong");
      $("sb-correction").hidden=false; $("sb-wrong-answer").hidden=false;
      $("sb-attempt-text").textContent=built; $("sb-correct-text").textContent=task.target;
      $("sb-explain-link").href="a1-sentence-builder-guide.html?level="+encodeURIComponent(levelKey)+"#sentence-"+(current+1);
    }
    $("sb-check-button").hidden=true; $("sb-next-button").hidden=false;
    $("sb-next-button").textContent=current===tasks.length-1?"Submit sentences →":"Next sentence →";
    $("sb-score").textContent="Score: "+score; save(); renderTiles();
  });
  $("sb-next-button").addEventListener("click",()=>{
    if(current===tasks.length-1){
      const report={level:levelKey,title:level.title,score,questions:tasks.map((task,index)=>({
        number:index+1,prompt:task.prompt,correctSentence:task.target,
        answeredCorrectly:Boolean(review[index].answeredCorrectly),
        wrongAttempts:review[index].wrongAttempts||[]
      }))};
      try { sessionStorage.setItem(resultKey,JSON.stringify(report)); } catch (_) {}
      location.href="a1-sentence-builder-results.html?level="+encodeURIComponent(levelKey);
      return;
    }
    current++; attempts=0; hintShown=false; render();
  });
  render();
})();

