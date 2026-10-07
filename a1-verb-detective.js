(() => {
const clues=[
 {before:"Anna ",after:" einen Kaffee vor der Fahrt.",answer:"trinkt",choices:["trinkt","trinken","trinkst"],task:"Anna drinks a coffee before the journey.",hint:"Anna = sie. With “sie”, trinken becomes trinkt.",group:"Normal verb",meaning:"to drink"},
 {before:"Sie ",after:" ein Ticket online.",answer:"kauft",choices:["kaufen","kauft","kaufst"],task:"She buys a ticket online.",hint:"Sie (she) takes the third-person singular form of kaufen.",group:"Normal verb",meaning:"to buy"},
 {before:"Am Bahnhof ",after:" Anna ihre Freundin.",answer:"trifft",choices:["trefft","trifft","treffen"],task:"At the station, Anna meets her friend.",hint:"treffen changes e → i with er/sie/es.",group:"Strong verb",meaning:"to meet"},
 {before:"Anna ",after:" den Zug auf der Anzeige.",answer:"sieht",choices:["sehen","sieht","siehst"],task:"Anna sees the train on the display.",hint:"sehen changes e → ie with er/sie/es.",group:"Strong verb",meaning:"to see"},
 {before:"Sie ",after:" am Gleis auf den Zug.",answer:"wartet",choices:["wartest","warten","wartet"],task:"She waits for the train at the platform.",hint:"warten has a stem ending in t, so this form adds an extra e: wartet.",group:"T-D verb",meaning:"to wait"},
 {before:"Der Zug ",after:" pünktlich an.",answer:"kommt",choices:["kommen","kommt","kommst"],task:"The train arrives on time.",hint:"Der Zug = er. The verb is ankommen: kommt … an.",group:"Normal verb",meaning:"to arrive"},
 {before:"Ihre Freundin ",after:" den Koffer.",answer:"trägt",choices:["trägt","tragen","trägst"],task:"Her friend carries the suitcase.",hint:"tragen changes a → ä with er/sie/es.",group:"Strong verb",meaning:"to carry"},
 {before:"Anna ",after:" ihrer Freundin mit der Tasche.",answer:"hilft",choices:["hilft","helfen","helft"],task:"Anna helps her friend with the bag.",hint:"helfen changes e → i with er/sie/es.",group:"Strong verb",meaning:"to help"},
 {before:"Am Abend ",after:" Anna nach Hause.",answer:"fährt",choices:["fahren","fährt","fahrt"],task:"In the evening, Anna travels home.",hint:"fahren changes a → ä with er/sie/es.",group:"Strong verb",meaning:"to travel"}
];
const start=document.getElementById("game-start"),play=document.getElementById("game-play"),results=document.getElementById("game-results");
const options=document.getElementById("game-options"),feedback=document.getElementById("game-feedback");
let index=0,score=0,missed=[];
function say(text){if(!("speechSynthesis"in window)||!("SpeechSynthesisUtterance"in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="de-DE";const v=window.speechSynthesis.getVoices().find(x=>x.lang.toLowerCase().startsWith("de"));if(v)u.voice=v;window.speechSynthesis.speak(u)}
function sentence(q,filled){const p=document.getElementById("sentence-text");p.replaceChildren();p.append(document.createTextNode(q.before));if(filled){const strong=document.createElement("strong");strong.textContent=q.answer;p.append(strong)}else p.append(document.createTextNode("___"));p.append(document.createTextNode(q.after))}
function render(){
 const q=clues[index];document.getElementById("round-label").textContent="Clue "+(index+1)+" of "+clues.length;
 document.getElementById("score-label").textContent="Score: "+score;
 const pct=Math.round(index/clues.length*100);document.getElementById("progress-fill").style.width=pct+"%";document.querySelector(".game-progress-track").setAttribute("aria-valuenow",String(pct));
 document.getElementById("scene-label").textContent="CLUE · "+q.group.toUpperCase();
 document.getElementById("scene-line").textContent="The station trail continues…";
 document.getElementById("task-text").textContent=q.task;
 sentence(q,false);
 const hint=document.getElementById("hint-text");hint.textContent=q.hint;hint.hidden=true;
 document.getElementById("hint-button").hidden=false;document.getElementById("game-actions").hidden=true;feedback.hidden=true;feedback.className="game-feedback";options.replaceChildren();
 q.choices.forEach(choice=>{const b=document.createElement("button");b.type="button";b.className="game-choice";b.textContent=choice;b.addEventListener("click",()=>choose(choice));options.append(b)});
}
function choose(choice){
 const q=clues[index],buttons=[...options.children],correct=choice===q.answer;
 buttons.forEach(b=>{b.disabled=true;if(b.textContent===q.answer)b.classList.add("is-correct");else if(b.textContent===choice)b.classList.add("is-wrong")});
 if(correct)score+=10;else missed.push({number:index+1,answer:q.before+q.answer+q.after,verb:q.answer,meaning:q.meaning});
 sentence(q,true);
 feedback.hidden=false;feedback.className="game-feedback"+(correct?"":" is-wrong");feedback.textContent=(correct?"Correct! ":"The correct form is “"+q.answer+"”. ")+q.hint+" (“"+q.answer+"” = "+q.meaning+")";
 document.getElementById("score-label").textContent="Score: "+score;document.getElementById("turn-score").textContent=correct?"+10 points":"Keep going";
 document.getElementById("hint-button").hidden=true;document.getElementById("game-actions").hidden=false;
 document.getElementById("next-button").innerHTML=index===clues.length-1?"Solve the case <span aria-hidden=\"true\">→</span>":"Next clue <span aria-hidden=\"true\">→</span>";
}
document.getElementById("start-button").addEventListener("click",()=>{start.hidden=true;play.hidden=false;render()});
document.getElementById("hint-button").addEventListener("click",()=>{document.getElementById("hint-text").hidden=false});
document.getElementById("listen-button").addEventListener("click",()=>{const q=clues[index];say(q.before+q.answer+q.after)});
document.getElementById("next-button").addEventListener("click",()=>{
 if(index<clues.length-1){index++;render();return}
 play.hidden=true;results.hidden=false;document.getElementById("progress-fill").style.width="100%";document.querySelector(".game-progress-track").setAttribute("aria-valuenow","100");
 document.getElementById("final-score").textContent=score+"/"+(clues.length*10);
 const pct=Math.round(score/(clues.length*10)*100);document.getElementById("result-title").textContent=pct===100?"Case solved!":pct>=70?"Excellent detective work!":"Good practice!";
 document.getElementById("result-message").textContent="You solved the station case with "+score/10+" of "+clues.length+" first-try answers correct. Review the verbs below, then play again.";
 const list=document.getElementById("game-review");list.replaceChildren();missed.forEach(m=>{const li=document.createElement("li");li.textContent="Clue "+m.number+" · "+m.answer+" — "+m.verb+" means "+m.meaning;list.append(li)});
});
document.getElementById("play-again-button").addEventListener("click",()=>{index=0;score=0;missed=[];results.hidden=true;start.hidden=false;document.getElementById("progress-fill").style.width="0";});
if(!("speechSynthesis"in window))document.getElementById("listen-button").hidden=true;
})();
