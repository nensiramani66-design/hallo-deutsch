const params=new URLSearchParams(location.search),chapterNumber=Math.min(12,Math.max(1,Number(params.get("chapter"))||1));
const chapter=window.b1Chapters[chapterNumber],words=chapter.words,key="hallo-deutsch-b1-chapter-"+chapterNumber;
let state={answers:{}};try{state=JSON.parse(localStorage.getItem(key))||state}catch{}
const answered=Object.keys(state.answers||{}).length,correct=Object.values(state.answers||{}).filter(answer=>answer.correct).length,complete=answered===words.length;
const pct=complete?Math.round(correct/words.length*100):0;
document.title="Quiz result · "+chapter.title+" · Hallo Deutsch";
document.getElementById("result-kicker").textContent="B1 · CHAPTER "+chapterNumber+" · "+chapter.title.toLocaleUpperCase();
document.getElementById("result-title").textContent=complete?"Quiz complete":"Quiz submitted";
document.getElementById("result-count").textContent="Quiz 1 of "+words.length;
document.getElementById("result-correct").textContent=correct+" correct";
document.getElementById("read-result").href="b1-reader.html?chapter="+chapterNumber;
document.getElementById("review-result").href="b1-chapter.html?chapter="+chapterNumber;
document.getElementById("restart-result").addEventListener("click",()=>{
 try{localStorage.removeItem(key)}catch{}
 location.href="b1-chapter.html?chapter="+chapterNumber;
});
if(!complete){
 const warning=document.getElementById("incomplete-message");warning.hidden=false;
 warning.textContent=(words.length-answered)+" questions were left unanswered. You can review or restart the quiz.";
 document.querySelector(".score-ring-wrap").hidden=true;
 document.getElementById("score-message").textContent="";
 document.getElementById("review-result").href="b1-quiz-numbers.html?chapter="+chapterNumber;
 document.getElementById("review-result").textContent="Review quiz";
}else{
 const ring=document.getElementById("ring-progress"),percent=document.getElementById("score-percent"),circumference=2*Math.PI*94;
 ring.style.strokeDasharray=String(circumference);
 ring.style.strokeDashoffset=String(circumference);
 percent.textContent="0%";
 document.getElementById("score-message").textContent=pct===100?"Perfect score! Your practice is paying off.":pct>=70?"Great progress. Every word you practise makes German feel more familiar.":"Good work finishing the chapter. Keep practising and watch your score grow.";
 const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(reduceMotion){ring.style.strokeDashoffset=String(circumference*(1-pct/100));percent.textContent=pct+"%"}
 else{
  let startTime;
  const duration=1800;
  function animateScore(time){
   if(startTime===undefined)startTime=time;
   const progress=Math.min(1,(time-startTime)/duration),ease=1-Math.pow(1-progress,3);
   ring.style.strokeDashoffset=String(circumference*(1-(pct*ease)/100));
   percent.textContent=Math.round(pct*ease)+"%";
   if(progress<1)requestAnimationFrame(animateScore);
  }
  requestAnimationFrame(animateScore);
 }
}
