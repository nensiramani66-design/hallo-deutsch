(() => {
const turns=[
 {line:"Guten Morgen! Was möchten Sie?",task:"You would like one coffee. Choose a polite order.",choices:["Ich möchte einen Kaffee, bitte.","Ich bin einen Kaffee.","Wo ist der Bahnhof?"],answer:0,hint:"Start with “Ich möchte …” (I would like …).",note:"“Ich möchte …, bitte” is a polite way to order: “I would like …, please.”"},
 {line:"Möchten Sie Milch und Zucker?",task:"You would like both milk and sugar.",choices:["Ja, bitte. Mit Milch und Zucker.","Ich heiße Milch und Zucker.","Die Rechnung ist hier."],answer:0,hint:"Say yes, then name both things with “mit”.",note:"“Mit Milch und Zucker” means “with milk and sugar.”"},
 {line:"Und möchten Sie etwas essen?",task:"You would like a croissant.",choices:["Ein Croissant, bitte.","Ich wohne ein Croissant.","Nein, ich bin müde."],answer:0,hint:"Name the food, then add “bitte”.",note:"“Ein Croissant, bitte” is a simple and natural way to order food."},
 {line:"Möchten Sie hier trinken oder zum Mitnehmen?",task:"You want to drink your coffee here.",choices:["Hier trinken, bitte.","Mit Karte, bitte.","Ich komme aus Berlin."],answer:0,hint:"Choose the option that means “here”.",note:"“Hier trinken, bitte” means “I’ll have it here, please.”"},
 {line:"Möchten Sie bar oder mit Karte zahlen?",task:"You want to pay by card.",choices:["Mit Karte, bitte.","Hier ist mein Kaffee.","Guten Morgen, Frau Müller."],answer:0,hint:"“Karte” means card; answer with “mit”.",note:"“Mit Karte, bitte” means “By card, please.”"},
 {line:"Hier ist Ihr Kaffee. Guten Appetit!",task:"Thank the server.",choices:["Danke schön!","Ich heiße Danke.","Auf dem Bahnhof."],answer:0,hint:"Use the short, friendly phrase for “Thank you very much.”",note:"“Danke schön” means “Thank you very much.” You completed a polite café conversation."}
];
const start=document.getElementById("game-start"),play=document.getElementById("game-play"),results=document.getElementById("game-results");
const options=document.getElementById("game-options"),feedback=document.getElementById("game-feedback");
let index=0,score=0,missed=[];
function say(text){if(!("speechSynthesis"in window)||!("SpeechSynthesisUtterance"in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="de-DE";const v=window.speechSynthesis.getVoices().find(x=>x.lang.toLowerCase().startsWith("de"));if(v)u.voice=v;window.speechSynthesis.speak(u)}
function render(){
 const q=turns[index];document.getElementById("round-label").textContent="Turn "+(index+1)+" of "+turns.length;
 document.getElementById("score-label").textContent="Score: "+score;
 const pct=Math.round(index/turns.length*100);document.getElementById("progress-fill").style.width=pct+"%";document.querySelector(".game-progress-track").setAttribute("aria-valuenow",String(pct));
 document.getElementById("scene-line").textContent=q.line;document.getElementById("task-text").textContent=q.task;document.getElementById("sentence-text").textContent="";
 const hint=document.getElementById("hint-text");hint.textContent=q.hint;hint.hidden=true;
 document.getElementById("hint-button").hidden=false;document.getElementById("game-actions").hidden=true;feedback.hidden=true;feedback.className="game-feedback";options.replaceChildren();
 q.choices.forEach((choice,i)=>{const b=document.createElement("button");b.type="button";b.className="game-choice";b.textContent=choice;b.addEventListener("click",()=>choose(i));options.append(b)});
}
function choose(choice){
 const q=turns[index],buttons=[...options.children],correct=choice===q.answer;
 buttons.forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add("is-correct");else if(i===choice)b.classList.add("is-wrong")});
 if(correct)score+=10;else missed.push({number:index+1,answer:q.choices[q.answer]});
 feedback.hidden=false;feedback.className="game-feedback"+(correct?"":" is-wrong");feedback.textContent=(correct?"Correct! ":"Not quite. The natural reply is “"+q.choices[q.answer]+"”. ")+q.note;
 document.getElementById("score-label").textContent="Score: "+score;document.getElementById("turn-score").textContent=correct?"+10 points":"Keep going";
 document.getElementById("hint-button").hidden=true;document.getElementById("game-actions").hidden=false;
 document.getElementById("next-button").innerHTML=index===turns.length-1?"See your results <span aria-hidden=\"true\">→</span>":"Next <span aria-hidden=\"true\">→</span>";
}
document.getElementById("start-button").addEventListener("click",()=>{start.hidden=true;play.hidden=false;render()});
document.getElementById("hint-button").addEventListener("click",()=>{document.getElementById("hint-text").hidden=false});
document.getElementById("listen-button").addEventListener("click",()=>say(turns[index].line));
document.getElementById("next-button").addEventListener("click",()=>{
 if(index<turns.length-1){index++;render();return}
 play.hidden=true;results.hidden=false;document.getElementById("progress-fill").style.width="100%";document.querySelector(".game-progress-track").setAttribute("aria-valuenow","100");
 document.getElementById("final-score").textContent=score+"/"+(turns.length*10);
 const pct=Math.round(score/(turns.length*10)*100);document.getElementById("result-title").textContent=pct===100?"Perfect order!":pct>=70?"Lovely work!":"Good practice!";
 document.getElementById("result-message").textContent="You completed the café conversation with "+score/10+" of "+turns.length+" first-try answers correct. You can replay and practise any phrase.";
 const list=document.getElementById("game-review");list.replaceChildren();missed.forEach(m=>{const li=document.createElement("li");li.textContent="Turn "+m.number+" · Practise: "+m.answer;list.append(li)});
});
document.getElementById("play-again-button").addEventListener("click",()=>{index=0;score=0;missed=[];results.hidden=true;start.hidden=false;document.getElementById("progress-fill").style.width="0";});
if(!("speechSynthesis"in window))document.getElementById("listen-button").hidden=true;
})();
