const chapters=window.b1Chapters,params=new URLSearchParams(location.search);
const chapterNumber=Math.min(12,Math.max(1,Number(params.get("chapter"))||1)),chapter=chapters[chapterNumber],words=chapter.words;
const stateKey="hallo-deutsch-b1-chapter-"+chapterNumber;
let state={answers:{},options:{},finishAttempted:false};try{const saved=JSON.parse(localStorage.getItem(stateKey));if(saved&&saved.answers)state={...state,...saved}}catch{}
const groupSize=10,groupCount=Math.ceil(words.length/groupSize),selectedGroup=params.has("group")?Math.min(groupCount-1,Math.max(0,Number(params.get("group"))||0)):null;
const rangeGrid=document.getElementById("range-grid"),questionGrid=document.getElementById("question-grid"),submitArea=document.getElementById("submit-area");
document.title="Quiz number · "+chapter.title+" · Hallo Deutsch";
document.getElementById("numbers-kicker").textContent="B1 · CHAPTER "+chapterNumber+" · QUIZ REVIEW";
document.getElementById("number-card-kicker").textContent="CHAPTER "+chapterNumber+" · "+chapter.title;
const back=document.getElementById("numbers-back");back.href=selectedGroup===null?"b1-chapter.html?chapter="+chapterNumber:"b1-quiz-numbers.html?chapter="+chapterNumber;
back.addEventListener("click",event=>{if(document.referrer&&new URL(document.referrer).origin===location.origin){event.preventDefault();history.back()}});
function save(){try{localStorage.setItem(stateKey,JSON.stringify(state))}catch{}}
function answered(i){return Object.prototype.hasOwnProperty.call(state.answers,i)}
function addRange(label,index){
 const first=index*groupSize,last=Math.min(words.length,first+groupSize),complete=Array.from({length:last-first},(_,n)=>answered(first+n)).every(Boolean);
 const link=document.createElement("a");link.className="range-choice";link.href="b1-quiz-numbers.html?chapter="+chapterNumber+"&group="+index;
 if(complete)link.classList.add("range-complete");else if(state.finishAttempted)link.classList.add("range-incomplete");
 const text=document.createElement("strong");text.textContent=label;
 const status=document.createElement("small");status.textContent=complete?"Complete":(last-first)+" questions";
 link.append(text,status);rangeGrid.append(link);
}
if(selectedGroup===null){
 document.getElementById("number-card-title").textContent="Question ranges";
 document.getElementById("numbers-description").textContent="Select a range to revisit questions. Green means answered; red shows questions still to finish.";
 for(let g=0;g<groupCount;g++){const start=g*groupSize+1,end=Math.min(words.length,start+groupSize-1);addRange(start+"–"+end,g)}
 document.getElementById("number-progress").textContent=Object.keys(state.answers).length+" of "+words.length+" answered";
 const submitButton=document.getElementById("submit-quiz"),confirmation=document.getElementById("submission-confirmation");
 submitButton.addEventListener("click",()=>{
  const missing=words.map((_,i)=>i).filter(i=>!answered(i));
  if(missing.length){
   state.finishAttempted=true;save();
   document.querySelectorAll(".range-choice").forEach((link,g)=>{const start=g*groupSize,end=Math.min(words.length,start+groupSize);const incomplete=Array.from({length:end-start},(_,n)=>!answered(start+n)).some(Boolean);link.classList.toggle("range-incomplete",incomplete);link.classList.toggle("range-complete",!incomplete)});
   document.getElementById("submit-message").textContent=missing.length+" question"+(missing.length===1?"":"s")+" unanswered. The red ranges show where to continue.";
   confirmation.hidden=false;submitButton.hidden=true;document.getElementById("confirm-submit").focus();return;
  }
  location.href="b1-quiz-results.html?chapter="+chapterNumber;
 });
 document.getElementById("confirm-submit").addEventListener("click",()=>{location.href="b1-quiz-results.html?chapter="+chapterNumber});
 document.getElementById("cancel-submit").addEventListener("click",()=>{confirmation.hidden=true;submitButton.hidden=false;submitButton.focus()});
}else{
 rangeGrid.hidden=true;submitArea.hidden=true;questionGrid.hidden=false;
 document.getElementById("number-card-title").textContent="Questions "+(selectedGroup*groupSize+1)+"–"+Math.min(words.length,(selectedGroup+1)*groupSize);
 document.getElementById("numbers-description").textContent="Choose a number to return to that quiz question. Red means unfinished; green means answered.";
 document.getElementById("number-progress").textContent="Chapter "+chapterNumber;
 document.getElementById("return-ranges").hidden=false;document.getElementById("return-ranges").href="b1-quiz-numbers.html?chapter="+chapterNumber;
 const start=selectedGroup*groupSize,end=Math.min(words.length,start+groupSize);
 for(let i=start;i<end;i++){
  const link=document.createElement("a");link.className="question-number-choice";link.href="b1-chapter.html?chapter="+chapterNumber+"&word="+i;
  link.textContent=String(i+1);
  if(answered(i))link.classList.add("question-complete");else if(state.finishAttempted)link.classList.add("question-incomplete");
  questionGrid.append(link);
 }
}
