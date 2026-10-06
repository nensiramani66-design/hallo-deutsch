const chapters=window.a1Chapters;
const chapterSelect=document.getElementById("reader-chapter");
const wordList=document.getElementById("reader-words");
const params=new URLSearchParams(location.search);
let chapterNumber=Math.min(12,Math.max(1,Number(params.get("chapter"))||1));
let pageNumber=Math.max(0,Number(params.get("page"))||0);
for(const [number,chapter] of Object.entries(chapters)){
 const option=document.createElement("option");option.value=number;option.textContent="Chapter "+number+" · "+chapter.title;chapterSelect.append(option);
}
chapterSelect.value=String(chapterNumber);
function renderReader(){
 const chapter=chapters[chapterNumber],words=chapter.words,totalPages=Math.ceil(words.length/10);
 pageNumber=Math.min(pageNumber,totalPages-1);
 document.title=chapter.title+" · A1 Vocabulary · Hallo Deutsch";
 document.getElementById("reader-kicker").textContent="A1 · CHAPTER "+chapterNumber+" · "+chapter.title.toLocaleUpperCase();
 document.getElementById("reader-title").textContent=chapter.title;
 document.getElementById("reader-count").textContent=words.length+" words";
 document.getElementById("reader-quiz-link").href="chapter-1.html?chapter="+chapterNumber;
 const start=pageNumber*10,visible=words.slice(start,start+10);
 wordList.replaceChildren();
 visible.forEach((word,index)=>{
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
chapterSelect.addEventListener("change",()=>{chapterNumber=Number(chapterSelect.value);pageNumber=0;renderReader()});
document.getElementById("reader-previous").addEventListener("click",()=>{pageNumber--;renderReader()});
document.getElementById("reader-next").addEventListener("click",()=>{pageNumber++;renderReader()});
renderReader();