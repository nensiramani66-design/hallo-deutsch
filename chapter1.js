const words=window.chapter1Words.map(row=>({type:row[1],german:row[2],english:row[3]}));
let index=0,score=0,answered=false,currentOptions=[];
const answerOptions=document.getElementById("answer-options");
const feedback=document.getElementById("answer-feedback");
const nextButton=document.getElementById("next-button");
const questionPanel=document.getElementById("question-panel");
const completePanel=document.getElementById("chapter-complete");
function shuffle(list){const copy=[...list];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function renderQuestion(){
 const question=words[index];answered=false;
 document.getElementById("question-count").textContent="Word "+(index+1)+" of "+words.length;
 document.getElementById("correct-count").textContent=score+" correct";
 document.getElementById("english-word").textContent=question.english;
 nextButton.disabled=true;
 nextButton.querySelector("span:first-child").textContent=index===words.length-1?"Finish chapter":"Next word";
 feedback.hidden=true;feedback.className="feedback";questionPanel.hidden=false;completePanel.hidden=true;
 document.querySelector(".quiz-bottom").hidden=false;
 let distractors=shuffle(words.filter(item=>item.type===question.type&&item.german!==question.german&&item.english!==question.english));
 if(distractors.length<3)distractors=shuffle(words.filter(item=>item.german!==question.german&&item.english!==question.english));
 currentOptions=shuffle([question,...distractors.slice(0,3)]);
 answerOptions.replaceChildren();
 currentOptions.forEach(item=>{
  const button=document.createElement("button");button.type="button";button.className="answer-option";
  button.innerHTML='<span></span><span class="answer-mark" aria-hidden="true"></span>';
  button.querySelector("span").textContent=item.german;
  button.addEventListener("click",()=>choose(item,button));answerOptions.append(button);
 });
 const progress=Math.round(index/words.length*100);
 document.getElementById("progress-fill").style.width=progress+"%";
 document.querySelector(".progress-track").setAttribute("aria-valuenow",String(progress));
}
function choose(item,selected){
 if(answered)return;answered=true;
 const correct=item.german===words[index].german&&item.english===words[index].english;
 if(correct)score++;
 Array.from(answerOptions.children).forEach(button=>{
  const right=button.querySelector("span").textContent===words[index].german;
  button.disabled=true;
  if(correct&&button===selected){button.classList.add("is-correct");button.querySelector(".answer-mark").textContent="✓"}
  else if(!correct&&right){button.classList.add("is-correct");button.querySelector(".answer-mark").textContent="✓"}
  else if(!correct){button.classList.add("is-wrong");button.querySelector(".answer-mark").textContent="×"}
 });
 feedback.hidden=false;feedback.className="feedback"+(correct?"":" is-wrong");
 feedback.innerHTML='<span class="feedback-icon" aria-hidden="true"></span><span></span>';
 feedback.querySelector(".feedback-icon").textContent=correct?"✓":"×";
 feedback.querySelector("span:last-child").textContent=correct
  ?"Correct! "+words[index].german+" means “"+words[index].english+"”."
  :"The correct answer is "+words[index].german+" — “"+words[index].english+"”.";
 document.getElementById("correct-count").textContent=score+" correct";nextButton.disabled=false;
}
function finish(){
 questionPanel.hidden=true;completePanel.hidden=false;document.querySelector(".quiz-bottom").hidden=true;
 document.getElementById("question-count").textContent="Chapter complete";
 document.getElementById("chapter-result").textContent="You got "+score+" of "+words.length+" answers correct.";
 document.getElementById("progress-fill").style.width="100%";document.querySelector(".progress-track").setAttribute("aria-valuenow","100");
}
nextButton.addEventListener("click",()=>{if(!answered)return;if(index<words.length-1){index++;renderQuestion()}else finish()});
document.getElementById("restart-button").addEventListener("click",()=>{index=0;score=0;renderQuestion()});
renderQuestion();
