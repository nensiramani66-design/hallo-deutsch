const params=new URLSearchParams(location.search),chapterNumber=Math.min(12,Math.max(1,Number(params.get("chapter"))||1));
const chapter=window.a1Chapters[chapterNumber],words=chapter.words,key="hallo-deutsch-a1-chapter-"+chapterNumber;
let state={answers:{}};try{state=JSON.parse(localStorage.getItem(key))||state}catch{}
const answered=Object.keys(state.answers||{}).length,correct=Object.values(state.answers||{}).filter(a=>a.correct).length,complete=answered===words.length;
const pct=complete?Math.round(correct/words.length*100):0;
document.title="Quiz result · "+chapter.title+" · Hallo Deutsch";
document.getElementById("result-kicker").textContent="A1 · CHAPTER "+chapterNumber+" · "+chapter.title.toLocaleUpperCase();
document.getElementById("result-title").textContent=complete?"Quiz complete":"Finish every question";
document.getElementById("result-count").textContent="Quiz 1 of "+words.length;
document.getElementById("result-correct").textContent=correct+" correct";
document.getElementById("read-result").href="a1-reader.html?chapter="+chapterNumber;
document.getElementById("review-result").href="chapter-1.html?chapter="+chapterNumber;
if(!complete){
 const warning=document.getElementById("incomplete-message");warning.hidden=false;warning.textContent=(words.length-answered)+" questions are still unanswered. Complete them before submitting your score.";
 document.querySelector(".score-ring-wrap").hidden=true;document.getElementById("score-message").textContent="";
 document.getElementById("review-result").href="quiz-numbers.html?chapter="+chapterNumber;
 document.getElementById("review-result").textContent="Open quiz numbers";
}else{
 document.getElementById("score-percent").textContent=pct+"%";
 document.getElementById("score-message").textContent=pct===100?"Perfect score! Your practice is paying off.":pct>=70?"Great progress. Every word you practise makes German feel more familiar.":"Good work finishing the chapter. Keep practising and watch your score grow.";
 const ring=document.getElementById("ring-progress"),circumference=2*Math.PI*94;
 ring.style.strokeDasharray=String(circumference);ring.style.strokeDashoffset=String(circumference);
 requestAnimationFrame(()=>{ring.style.strokeDashoffset=String(circumference*(1-pct/100))});
}
