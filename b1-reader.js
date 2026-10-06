const chapters=window.b1Chapters;
const params=new URLSearchParams(location.search);
const hasChapter=params.has("chapter");
let chapterNumber=Math.min(12,Math.max(1,Number(params.get("chapter"))||1));
let pageNumber=Math.max(0,Number(params.get("page"))||0);
const picker=document.getElementById("reader-chapter-picker");
const readerContent=document.getElementById("reader-content");
const chapterSelect=document.getElementById("reader-chapter");
const wordList=document.getElementById("reader-words");
const backLink=document.getElementById("reader-back");
const chapterOptions=[];
for(const [number,chapter] of Object.entries(chapters)){
 const n=Number(number);
 const card=document.createElement("a");card.className="reader-chapter-choice";card.href="b1-reader.html?chapter="+n;
 const numberBox=document.createElement("span");numberBox.className="reader-chapter-number";numberBox.textContent=String(n).padStart(2,"0");
 const label=document.createElement("strong");label.textContent=chapter.title;
 card.append(numberBox,label);picker.append(card);
 const option=document.createElement("option");option.value=number;option.textContent="Chapter "+number+" · "+chapter.title;chapterSelect.append(option);
}
function renderReader(){
 if(!hasChapter){
  readerContent.hidden=true;picker.hidden=false;
  document.getElementById("reader-title").textContent="Read vocabularies for B1";
  document.getElementById("reader-description").textContent="Choose one of the 12 chapters to open its dictionary.";
  document.getElementById("reader-kicker").textContent="B1 · CHAPTER DICTIONARY";
  document.title="Read B1 vocabularies · Hallo Deutsch";
  backLink.href="./#a1";
  return;
 }
 picker.hidden=true;readerContent.hidden=false;
 const chapter=chapters[chapterNumber],words=chapter.words,totalPages=Math.ceil(words.length/10);
 pageNumber=Math.min(pageNumber,totalPages-1);
 document.title=chapter.title+" · B1 Vocabulary · Hallo Deutsch";
 document.getElementById("reader-kicker").textContent="B1 · CHAPTER "+chapterNumber+" · "+chapter.title.toLocaleUpperCase();
 document.getElementById("reader-title").textContent=chapter.title;
 document.getElementById("reader-description").textContent="Ten words per page. Tap a speaker to hear the German or English pronunciation.";
 document.getElementById("reader-count").textContent=words.length+" words";
 chapterSelect.value=String(chapterNumber);
 document.getElementById("reader-quiz-link").href="b1-chapter.html?chapter="+chapterNumber;
 backLink.href="b1-reader.html";
 const start=pageNumber*10,visible=words.slice(start,start+10);
 wordList.replaceChildren();
 visible.forEach(word=>{
  const row=document.createElement("article");row.className="reader-row";
  row.append(makeCell("German",word.german,"de-DE"));
  row.append(makeCell("English",word.english,"en-US"));
  wordList.append(row);
 });
 document.getElementById("reader-page-label").textContent=(start+1)+"–"+Math.min(start+10,words.length)+" of "+words.length+" · page "+(pageNumber+1)+" of "+totalPages;
 document.getElementById("reader-previous").disabled=pageNumber===0;
 document.getElementById("reader-next").disabled=pageNumber===totalPages-1;
 params.set("chapter",String(chapterNumber));params.set("page",String(pageNumber));
 history.replaceState(null,"",location.pathname+"?"+params.toString());
}
function makeCell(label,text,locale){
 const cell=document.createElement("div");cell.className="reader-cell"+(label==="English"?" english":"");
 const words=document.createElement("span");words.className="reader-cell-label";
 const small=document.createElement("small");small.textContent=label;
 const strong=document.createElement("strong");strong.textContent=text;words.append(small,strong);
 const button=document.createElement("button");button.className="speak-button";button.type="button";button.textContent="🔊";button.setAttribute("aria-label","Hear "+label+": "+text);
 button.addEventListener("click",()=>speak(text,locale));
 cell.append(words,button);return cell;
}
function speak(text,locale){
 const note=document.getElementById("speech-note");
 if(!("speechSynthesis" in window)||!("SpeechSynthesisUtterance" in window)){note.textContent="Speech playback is not available in this browser.";return}
 speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(text);utterance.lang=locale;
 const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(locale.slice(0,2).toLowerCase()));
 if(voice)utterance.voice=voice;
 speechSynthesis.speak(utterance);note.textContent="Playing "+(locale==="de-DE"?"German":"English")+" pronunciation.";
}
const referrerIsLocal=(()=>{try{return !!document.referrer&&new URL(document.referrer).origin===location.origin}catch{return false}})();
backLink.addEventListener("click",event=>{if(referrerIsLocal){event.preventDefault();history.back()}});
chapterSelect.addEventListener("change",()=>{chapterNumber=Number(chapterSelect.value);pageNumber=0;params.set("chapter",String(chapterNumber));params.set("page","0");history.pushState(null,"",location.pathname+"?"+params.toString());renderReader()});
document.getElementById("reader-previous").addEventListener("click",()=>{pageNumber--;renderReader()});
document.getElementById("reader-next").addEventListener("click",()=>{pageNumber++;renderReader()});
window.addEventListener("popstate",()=>{
 const restored=new URLSearchParams(location.search);
 if(restored.has("chapter")){
  chapterNumber=Math.min(12,Math.max(1,Number(restored.get("chapter"))||1));
  pageNumber=Math.max(0,Number(restored.get("page"))||0);
  chapterSelect.value=String(chapterNumber);
  renderReader();
 }
});
renderReader();