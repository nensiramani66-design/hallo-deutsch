const chapterData=window.b1Chapters;
const params=new URLSearchParams(location.search);
const chapterNumber=Math.min(12,Math.max(1,Number(params.get("chapter"))||1));
const chapter=chapterData[chapterNumber],words=chapter.words;
const stateKey="hallo-deutsch-b1-chapter-"+chapterNumber;
let state={answers:{},options:{},finishAttempted:false};
try{const saved=JSON.parse(localStorage.getItem(stateKey));if(saved&&saved.answers&&saved.options)state={...state,...saved}}catch{}
let index=Math.max(0,Math.min(words.length-1,Number(params.get("word"))||0));
const answerOptions=document.getElementById("answer-options");
const feedback=document.getElementById("answer-feedback");
const nextButton=document.getElementById("next-button");
const previousButton=document.getElementById("previous-button");
const questionPanel=document.getElementById("question-panel");
document.title="Chapter "+chapterNumber+" · "+chapter.title+" · Hallo Deutsch";
document.getElementById("quiz-chapter-kicker").textContent="B1 · CHAPTER "+chapterNumber;
document.getElementById("quiz-chapter-title").textContent=chapter.title;
document.querySelector(".quiz-back-link").href="b1-vocabulary.html";
document.getElementById("reader-result-link").href="b1-reader.html?chapter="+chapterNumber;
document.getElementById("quiz-number-link").href="b1-quiz-numbers.html?chapter="+chapterNumber;
function shuffle(list){const copy=[...list];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function category(word){
 const s=word.german.toLocaleLowerCase();
 if(/^(der|die|das|der\/die|die\/das)\b/.test(s))return "noun";
 if(/(?:en|ern|eln)$/.test(s.split(/[ ,]/)[0]))return "verb";
 return "other";
}
function getOptions(questionIndex){
 if(state.options[questionIndex])return state.options[questionIndex].map(i=>words[i]);
 const q=words[questionIndex],kind=category(q);
 let pool=words.map((word,i)=>({word,i})).filter(x=>x.i!==questionIndex&&x.word.german!==q.german&&x.word.english!==q.english);
 let similar=pool.filter(x=>category(x.word)===kind);
 if(kind==="noun"){const gender=q.german.match(/^(der|die|das)\b/i)?.[1];if(gender){const matched=similar.filter(x=>new RegExp("^"+gender+"\\b","i").test(x.word.german));if(matched.length>=3)similar=matched}}
 if(similar.length<3)similar=pool;
 const selected=shuffle(similar).slice(0,3).map(x=>x.i);const all=shuffle([questionIndex,...selected]);state.options[questionIndex]=all;save();
 return all.map(i=>words[i]);
}
function score(){return Object.values(state.answers).filter(a=>a.correct).length}
function save(){try{localStorage.setItem(stateKey,JSON.stringify(state))}catch{}}
function renderQuestion(){
 const question=words[index],currentOptions=getOptions(index),prior=state.answers[index];
 document.getElementById("question-count").textContent="Question "+(index+1)+" of "+words.length;
 document.getElementById("correct-count").textContent=score()+" correct";
 document.getElementById("english-word").textContent=question.english;
 answerOptions.replaceChildren();
 currentOptions.forEach(item=>{
  const button=document.createElement("button");button.type="button";button.className="answer-option";
  button.innerHTML='<span></span><span class="answer-mark" aria-hidden="true"></span>';
  button.querySelector("span").textContent=item.german;
  const right=item.german===question.german;
  if(prior){
   button.disabled=true;
   if(right){button.classList.add("is-correct");button.querySelector(".answer-mark").textContent="✓"}
   else if(!prior.correct){button.classList.add("is-wrong");button.querySelector(".answer-mark").textContent="×"}
   if(item.german===prior.selected&&!prior.correct)button.classList.add("was-selected");
  } else button.addEventListener("click",()=>choose(item));
  answerOptions.append(button);
 });
 feedback.hidden=!prior;feedback.className="feedback"+(prior&&!prior.correct?" is-wrong":"");
 if(prior){feedback.innerHTML='<span class="feedback-icon" aria-hidden="true"></span><span></span>';feedback.querySelector(".feedback-icon").textContent=prior.correct?"✓":"×";feedback.querySelector("span:last-child").textContent=prior.correct?"Correct! "+question.german+" means “"+question.english+"”.":"The correct answer is "+question.german+" — “"+question.english+"”."}
 const answeredCount=Object.keys(state.answers).length,pct=Math.round(answeredCount/words.length*100);
 document.getElementById("progress-fill").style.width=pct+"%";document.querySelector(".progress-track").setAttribute("aria-valuenow",String(pct));
 previousButton.disabled=index===0;
 nextButton.disabled=!prior||index===words.length-1;
 nextButton.querySelector("span:first-child").textContent=index===words.length-1?"Last question":"Next word";
 nextButton.querySelector("span:last-child").textContent="→";
}
function choose(item){
 if(state.answers[index])return;
 state.answers[index]={selected:item.german,correct:item.german===words[index].german};save();renderQuestion();
}
nextButton.addEventListener("click",()=>{if(index<words.length-1&&state.answers[index]){index++;params.set("word",String(index));history.replaceState(null,"",location.pathname+"?"+params.toString());renderQuestion()}});
previousButton.addEventListener("click",()=>{if(index>0){index--;params.set("word",String(index));history.replaceState(null,"",location.pathname+"?"+params.toString());renderQuestion()}});
renderQuestion();