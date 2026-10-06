const chapterData=window.a1Chapters;
const chapterNumber=Math.min(12,Math.max(1,Number(new URLSearchParams(location.search).get("chapter"))||1));
const chapter=chapterData[chapterNumber],words=chapter.words;
const stateKey="hallo-deutsch-a1-chapter-"+chapterNumber;
let state={answers:{},options:{}};
try{state=JSON.parse(localStorage.getItem(stateKey))||state}catch{}
let index=0,currentOptions=[];
const answerOptions=document.getElementById("answer-options");
const feedback=document.getElementById("answer-feedback");
const nextButton=document.getElementById("next-button");
const previousButton=document.getElementById("previous-button");
const questionPanel=document.getElementById("question-panel");
const completePanel=document.getElementById("chapter-complete");
const groupButtons=document.getElementById("question-groups");
const numberButtons=document.getElementById("question-numbers");
document.title="Chapter "+chapterNumber+" · "+chapter.title+" · Hallo Deutsch";
document.getElementById("quiz-chapter-kicker").textContent="A1 · CHAPTER "+chapterNumber;
document.getElementById("quiz-chapter-title").textContent=chapter.title;
document.querySelector(".quiz-back-link").href="a1-reader.html?chapter="+chapterNumber;
document.getElementById("reader-result-link").href="a1-reader.html?chapter="+chapterNumber;
const groupCount=Math.ceil(words.length/10);
for(let group=0;group<groupCount;group++){
 const first=group*10+1,last=Math.min(words.length,first+9);
 const button=document.createElement("button");button.type="button";button.className="question-group";
 button.textContent=first+"–"+last;button.setAttribute("aria-label","Questions "+first+" to "+last);
 button.addEventListener("click",()=>renderNumberGroup(group));groupButtons.append(button);
}
const finishButton=document.createElement("button");finishButton.type="button";finishButton.className="question-group finish-group";finishButton.textContent="Finish & Submit";
finishButton.addEventListener("click",finish);groupButtons.append(finishButton);
function shuffle(list){const copy=[...list];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function category(word){
 const s=word.german.toLocaleLowerCase();
 if(/^(der|die|das|der\/die|die\/das)\b/.test(s)||/\b(der|die|das)\s+[-–]/.test(s))return "noun";
 if(/\b(ich|du|er|sie|es|wir|ihr|Sie)\b/.test(word.german))return "phrase";
 if(/\b(ich|du|er|sie|es|wir|ihr|Sie)\b/.test(word.english))return "phrase";
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
function renderNumberGroup(group=Math.floor(index/10)){
 const start=group*10,end=Math.min(words.length,start+10);numberButtons.replaceChildren();
 for(let i=start;i<end;i++){
  const button=document.createElement("button");button.type="button";button.className="question-number";button.textContent=String(i+1);
  if(state.answers[i])button.classList.add(state.answers[i].correct?"number-correct":"number-wrong");
  if(i===index)button.classList.add("number-current");
  button.addEventListener("click",()=>{index=i;renderQuestion()});numberButtons.append(button);
 }
 Array.from(groupButtons.children).forEach((button,i)=>button.classList.toggle("group-active",i===group));
}
function renderQuestion(){
 const question=words[index];currentOptions=getOptions(index);
 document.getElementById("question-count").textContent="Word "+(index+1)+" of "+words.length;
 document.getElementById("correct-count").textContent=score()+" correct";
 document.getElementById("english-word").textContent=question.english;
 answerOptions.replaceChildren();
 const prior=state.answers[index];
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
  } else button.addEventListener("click",()=>choose(item,button));
  answerOptions.append(button);
 });
 feedback.hidden=!prior;feedback.className="feedback"+(prior&&!prior.correct?" is-wrong":"");
 if(prior){feedback.innerHTML='<span class="feedback-icon" aria-hidden="true"></span><span></span>';feedback.querySelector(".feedback-icon").textContent=prior.correct?"✓":"×";feedback.querySelector("span:last-child").textContent=prior.correct?"Correct! "+question.german+" means “"+question.english+"”.":"The correct answer is "+question.german+" — “"+question.english+"”."}
 const pct=Math.round(Object.keys(state.answers).length/words.length*100);
 document.getElementById("progress-fill").style.width=pct+"%";document.querySelector(".progress-track").setAttribute("aria-valuenow",String(pct));
 previousButton.disabled=index===0;nextButton.disabled=!prior;
 nextButton.querySelector("span:nth-child(2)").textContent="→";
 nextButton.querySelector("span:first-child").textContent=index===words.length-1?"Finish & Submit":"Next word";
 renderNumberGroup();
}
function choose(item,selected){
 if(state.answers[index])return;
 const correct=item.german===words[index].german;
 state.answers[index]={selected:item.german,correct};save();renderQuestion();
}
function finish(){
 questionPanel.hidden=true;completePanel.hidden=false;document.querySelector(".quiz-bottom").hidden=true;
 document.getElementById("question-count").textContent="Quiz submitted";
 const answered=Object.keys(state.answers).length,correct=score();
 document.getElementById("chapter-result").textContent="You scored "+correct+" out of "+words.length+" ("+Math.round(correct/words.length*100)+"%). Questions answered: "+answered+" of "+words.length+".";
 document.getElementById("progress-fill").style.width=Math.round(answered/words.length*100)+"%";
}
nextButton.addEventListener("click",()=>{if(index<words.length-1){index++;renderQuestion()}else finish()});
previousButton.addEventListener("click",()=>{if(index>0){index--;renderQuestion()}});
document.getElementById("restart-button").addEventListener("click",()=>{state={answers:{},options:{}};index=0;save();completePanel.hidden=true;questionPanel.hidden=false;document.querySelector(".quiz-bottom").hidden=false;renderQuestion()});
renderQuestion();