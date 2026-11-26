/* Shared selector and mock-exam player for Lesen, Schreiben and Sprechen. */
(() => {
  'use strict';
  const MODULES = {
    lesen: {name:'Lesen', english:'Reading', minutes:25, parts:3, icon:'📖', guide:'a1-exam-practice-reading.html', tasks:'15 questions', synopsis:'Read short messages, find information online and understand everyday signs.'},
    schreiben: {name:'Schreiben', english:'Writing', minutes:20, parts:2, icon:'✎', guide:'a1-exam-practice-writing.html', tasks:'2 tasks', synopsis:'Complete a form and write a short German message of about 30 words.'},
    sprechen: {name:'Sprechen', english:'Speaking', minutes:15, parts:3, icon:'♬', guide:'a1-exam-practice-speaking.html', tasks:'3 parts', synopsis:'Introduce yourself, ask for information and make polite requests.'}
  };
  const params = new URLSearchParams(location.search);
  const key = params.get('module');
  const module = MODULES[key];
  const $ = (selector) => document.querySelector(selector);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const one = (tag, attrs = {}, text = '') => {const el = document.createElement(tag); for (const [k,v] of Object.entries(attrs)) el.setAttribute(k,v); if(text) el.textContent = text; return el;};
  const selectorURL = `a1-module-preparations.html?module=${key}`;
  const testURL = (n) => `a1-module-practice.html?module=${key}&set=${n}`;

  if (!module) {
    $('#main').innerHTML = '<section class="part-card"><h1>Module not found</h1><p>Please choose Lesen, Schreiben or Sprechen from the preparation menu.</p><a class="primary" href="a1-exam-hub.html">Go to preparation menu</a></section>';
    return;
  }
  if (document.body.dataset.view === 'selector') return renderSelector();
  const index = Number(params.get('set'));
  const bank = window.A1_MODULE_DATA && window.A1_MODULE_DATA[key];
  if (!Number.isInteger(index) || index < 1 || index > 10 || !Array.isArray(bank) || bank.length !== 10) {
    $('#main').innerHTML = `<section class="part-card"><h1>Practice exam not found</h1><a class="primary" href="${selectorURL}">Back to ten exams</a></section>`;
    return;
  }
  const data = bank[index-1];
  let running = false, submitted = false, timeRemaining = module.minutes * 60, ticker = null;
  const examAnswers = {};

  function renderSelector(){
    document.title = `${module.name} · 10 Exam Preparations · Hallo Deutsch`;
    $('#crumb-module').textContent = module.name;
    $('#page-title').textContent = `Choose your ${module.name} exam preparation`;
    $('#page-description').textContent = `Ten different original A1 ${module.english.toLowerCase()} practice exams. Each exam follows the Goethe-Zertifikat A1: Start Deutsch 1 task types. ${module.synopsis}`;
    $('#module-meta').textContent = `${module.minutes} minutes · ${module.tasks}`;
    $('#guide-link').href = module.guide;
    $('#guide-link').textContent = `Read the ${module.name} guide →`;
    const grid = $('#exam-grid');
    for (let n=1;n<=10;n++) {
      const link = one('a',{class:'exam-choice',href:testURL(n),'aria-label':`${module.name} exam preparation ${n}`});
      link.innerHTML = `<div class="choice-top"><span class="choice-number">${String(n).padStart(2,'0')}</span><span class="choice-badge">Available</span></div><span class="choice-title">Exam Preparation ${n}</span><span class="choice-copy">${module.name} · Original A1 practice · ${module.minutes} min</span><span class="choice-action">Start preparation →</span>`;
      grid.append(link);
    }
  }

  const parts = {
    lesen:[['Teil 1 · Nachrichten','5 statements','Richtig / Falsch'],['Teil 2 · Anzeigen und Webseiten','5 questions','Choose a or b'],['Teil 3 · Schilder und Hinweise','5 statements','Richtig / Falsch']],
    schreiben:[['Teil 1 · Formular','5 missing entries','Complete from the given information'],['Teil 2 · Kurze Nachricht','About 30 words','Greeting, 3 points and closing']],
    sprechen:[['Teil 1 · Sich vorstellen','About 5 minutes','Introduce yourself; spelling/numbers'],['Teil 2 · Informationen','About 5 minutes','Ask and answer with topic cards'],['Teil 3 · Bitten','About 5 minutes','Make requests and respond']]
  };

  document.title = `${module.name} · Exam ${index} · Hallo Deutsch`;
  $('#back-link').href = selectorURL;
  $('#crumb-back').href = selectorURL;
  $('#crumb-back').textContent = `${module.name} exams`;
  $('#crumb-current').textContent = `Preparation ${index}`;
  $('#exam-eyebrow').textContent = `GOETHE A1 · ${module.english.toUpperCase()} PRACTICE`;
  $('#exam-title').textContent = `${module.name} · Exam ${index}`;
  $('#exam-subtitle').textContent = `${data.title}. ${module.synopsis}`;
  $('#hero-icon').textContent = module.icon;
  $('#metric-row').innerHTML = `<div class="metric"><strong>${module.minutes}</strong><small>minutes</small></div><div class="metric"><strong>${module.tasks}</strong><small>in this practice</small></div><div class="metric"><strong>${module.parts}</strong><small>exam parts</small></div>`;
  $('#parts-rows').innerHTML = parts[key].map(([part,task,format]) => `<tr><td>${part}</td><td>${task}</td><td>${format}</td></tr>`).join('');
  $('#exam-note').textContent = key === 'sprechen' ? 'In the official Goethe A1 exam, speaking takes place in a group without preparation time. Practise aloud with a partner if possible; the example answers are aids, not fixed required answers.' : key === 'schreiben' ? 'Goethe A1 Schreiben contains a 5-point form task and a 10-point message task. Model answers are examples only; this page does not automatically grade your German.' : 'Like the Goethe A1 model: 3 parts with 5 questions each. One point is awarded for each correct answer in this original practice.';
  const heroButton = $('.exam-hero .primary');
  heroButton.addEventListener('click', begin);
  const content = $('#exam-content');
  let readingQuestions = [];
  if (key === 'lesen') renderLesen(content);
  if (key === 'schreiben') renderSchreiben(content);
  if (key === 'sprechen') renderSprechen(content);

  function begin(){
    if (running || submitted) return;
    running = true;
    heroButton.textContent = 'Continue your exam ↓';
    const clock = one('span',{class:'meta-pill',id:'clock',role:'timer','aria-label':'Time remaining'},'');
    $('.selector-actions')?.append(clock);
    $('.bottom-actions').prepend(clock);
    updateClock();
    ticker = setInterval(() => {if (timeRemaining>0) timeRemaining--; updateClock(); if(timeRemaining===0){stopClock(); if(key==='lesen'){submitLesen(true);}else {const msg=one('p',{class:'notice'},'Practice time is over. You may still review your work.'); content.prepend(msg);}}},1000);
  }
  function updateClock(){const el=$('#clock');if(el)el.textContent=`Time left ${String(Math.floor(timeRemaining/60)).padStart(2,'0')}:${String(timeRemaining%60).padStart(2,'0')}`;}
  function stopClock(){running=false;clearInterval(ticker);}
  function section(number,title,instruction){
    const card=one('section',{class:'part-card',id:`part-${number}`});
    card.innerHTML=`<div class="part-heading"><h2>${escapeHTML(title)}</h2><span class="part-label">TEIL ${number}</span></div><p class="instructions">${escapeHTML(instruction)}</p>`;
    content.append(card);return card;
  }
  function appendSource(parent,source,heading=''){const div=one('div',{class:'text-source'});if(heading){const h=one('strong',{},heading);div.append(h,document.createElement('br'));}div.append(document.createTextNode(source));parent.append(div);return div;}
  function addQuestion(parent,number,claim,choices,context,answer,renderMode='simple'){
    const q=one('div',{class:'question',id:`question-${number}`});
    q.innerHTML=`<span class="question-index">QUESTION ${number} / 15</span><h3>${escapeHTML(claim)}</h3>`;
    const options=one('div',{class:renderMode==='sites'?'options website-options':'options'});
    choices.forEach((choice,i)=>{
      const label=one('label',{class:'option'});
      const radio=one('input',{type:'radio',name:`q${number}`,value:String(i),'aria-label':`Question ${number}: option ${i+1}`});
      radio.addEventListener('change',()=>{examAnswers[number]=i;updateProgress();});
      label.append(radio);
      if(renderMode==='sites') {const head=one('span',{class:'website-title'},`${i===0?'a':'b'} · ${choice[0]}`);const description=one('span',{class:'website-copy'},choice[1]);label.append(head,description);}else label.append(one('span',{},choice));
      options.append(label);
    });
    q.append(options);parent.append(q);
    return {number,claim,choices,context,answer,renderMode};
  }
  function renderLesen(target){
    const first=section(1,'Teil 1 · Kurze Nachrichten','Lesen Sie die beiden Nachrichten und die Aussagen 1 bis 5. Kreuzen Sie Richtig oder Falsch an.');
    let number=0;
    data.messages.forEach(([heading,body,claims])=>{
      appendSource(first,body,heading);
      claims.forEach(([claim,isTrue])=>{number++;readingQuestions.push(addQuestion(first,number,claim,['Richtig','Falsch'],`${heading}\n${body}`,isTrue?0:1));});
    });
    const second=section(2,'Teil 2 · Anzeigen und Webseiten','Wo finden Sie die gesuchte Information? Lesen Sie beide Angebote und wählen Sie a oder b.');
    data.sites.forEach(([need,aName,aDesc,bName,bDesc,correct])=>{number++;readingQuestions.push(addQuestion(second,number,need,[[aName,aDesc],[bName,bDesc]],`a · ${aName}: ${aDesc}\nb · ${bName}: ${bDesc}`,correct,'sites'));});
    const third=section(3,'Teil 3 · Hinweise und Schilder','Lesen Sie jeden Hinweis. Entscheiden Sie: Richtig oder Falsch.');
    data.signs.forEach(([where,notice,claim,correct])=>{number++;appendSource(third,notice,where);readingQuestions.push(addQuestion(third,number,claim,['Richtig','Falsch'],`${where}\n${notice}`,correct?0:1));});
    const actions=$('#bottom-actions');const progress=one('span',{class:'progress',id:'answer-progress'},'0 of 15 answered');
    const button=one('button',{class:'primary',id:'finish-reading'},'Finish exam · Show my result →');button.addEventListener('click',()=>submitLesen(false));
    actions.append(progress,button);
  }
  function updateProgress(){const progress=$('#answer-progress');if(progress)progress.textContent=`${Object.keys(examAnswers).length} of 15 answered`;}
  function submitLesen(timedOut){
    if(submitted)return;
    const count=Object.keys(examAnswers).length;
    if(!timedOut && count<15 && !window.confirm(`You answered ${count} of 15 questions. Submit and review now?`))return;
    submitted=true;stopClock();
    const totals=[0,0,0], answered=[0,0,0];
    readingQuestions.forEach((q,i)=>{const part=Math.floor(i/5);if(Object.hasOwn(examAnswers,q.number)){answered[part]++;if(examAnswers[q.number]===q.answer)totals[part]++;}});
    document.querySelectorAll('input[type=radio]').forEach(input=>input.disabled=true);
    const score=totals.reduce((a,b)=>a+b,0);
    const panel=one('section',{class:'result-card',id:'results'});
    panel.innerHTML=`<span class="eyebrow">YOUR RESULT</span><h2>Your ${module.name} result</h2><div class="result-score">${score}<span>/15</span></div><p>${score} of 15 correct · ${15-count} unanswered. This is an independent practice score, not an official Goethe result.</p><div class="result-stats">${totals.map((s,i)=>`<div class="stat">Teil ${i+1}<strong>${s} / 5</strong></div>`).join('')}</div><h3>Review all 15 questions</h3><p>Open any question to see the original reading text, correct answer and a short explanation.</p>`;
    readingQuestions.forEach(q=>{
      const answer=Object.hasOwn(examAnswers,q.number)?examAnswers[q.number]:null;
      const correct=answer===q.answer;
      const detail=one('details',{class:`review-item ${correct?'is-correct':''}`});
      const summary=one('summary',{},`Question ${q.number} · ${correct?'Correct':answer===null?'Not answered':'Check the answer'}`);
      const body=one('div',{class:'review-body'});
      body.append(one('p',{},q.claim));
      appendSource(body,q.context,'Reading text:');
      const expected=q.renderMode==='sites'?`${q.answer===0?'a':'b'} · ${q.choices[q.answer][0]}`:q.choices[q.answer];
      const picked=answer===null?'No answer':q.renderMode==='sites'?`${answer===0?'a':'b'} · ${q.choices[answer][0]}`:q.choices[answer];
      body.append(one('p',{},`Your answer: ${picked}`));
      const explanation=one('div',{class:'feedback'});
      explanation.append(one('strong',{},`Correct answer: ${expected}`));
      explanation.append(one('p',{},q.renderMode==='sites'?`The relevant offer says: ${q.choices[q.answer][1]}`:`The statement is ${expected} according to the reading text above. Compare the dates, times, places and negative words carefully.`));
      body.append(explanation);detail.append(summary,body);panel.append(detail);
    });
    content.hidden=true;$('.exam-info').hidden=true;$('.exam-hero').hidden=true;
    $('#bottom-actions').replaceChildren();$('#main').insertBefore(panel,$('.disclaimer'));
    const restart=one('div',{class:'bottom-actions'});restart.innerHTML=`<a class="secondary" href="${testURL(index)}">Try again</a><a class="primary" href="${selectorURL}">Choose another exam →</a>`;panel.after(restart);
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderSchreiben(){
    const first=section(1,'Teil 1 · Ein Formular ausfüllen','Lesen Sie die Situation. Tragen Sie die fünf fehlenden Informationen in das Formular ein.');
    appendSource(first,data.scenario,'Situation:');
    const title=one('h3',{},data.form);first.append(title);
    const grid=one('div',{class:'form-grid'});
    data.fields.forEach(([label],i)=>{
      const field=one('label',{class:'field'});field.append(one('span',{},`${i+1}. ${label}`));
      field.append(one('input',{type:'text',autocomplete:'off',name:`form${i}`,placeholder:'Ihre Antwort',id:`form${i}`}));grid.append(field);
    });first.append(grid);
    const second=section(2,'Teil 2 · Eine kurze Nachricht schreiben','Schreiben Sie circa 30 Wörter. Beantworten Sie alle drei Punkte. Beginnen Sie mit einer Anrede und enden Sie mit einem Gruß.');
    appendSource(second,data.task,'Schreibaufgabe:');
    const list=one('ul',{class:'bullet-list'});data.bullets.forEach(point=>list.append(one('li',{},point)));second.append(list);
    const textarea=one('textarea',{class:'writing-area',id:'writing-answer',placeholder:'Liebe/Lieber …\n\nSchreiben Sie hier Ihre Nachricht …','aria-label':'Your German message'});second.append(textarea);
    const counter=one('p',{class:'subtle',id:'word-counter'},'0 words · aim for about 30 words');second.append(counter);
    textarea.addEventListener('input',()=>{const count=textarea.value.trim()?textarea.value.trim().split(/\s+/).length:0;counter.textContent=`${count} words · aim for about 30 words`;});
    const actions=$('#bottom-actions');const button=one('button',{class:'primary'},'Review my writing →');button.addEventListener('click',()=>{
      if(!running)begin();stopClock();
      const panel=$('#writing-review')||one('section',{class:'result-card',id:'writing-review'});panel.replaceChildren();
      panel.append(one('span',{class:'eyebrow'},'MODEL ANSWERS & SELF-REVIEW'),one('h2',{},'Check your Schreiben practice'));
      panel.append(one('p',{},'Teil 1 · Compare each entry with the situation. Alternative spellings may also be correct.'));
      const list=one('div',{class:'self-check'});
      data.fields.forEach(([label,answer],i)=>{const row=one('div',{class:'answer-key'});row.append(one('strong',{},`${i+1}. ${label}: ${answer}`));row.append(one('p',{},`Your answer: ${$(`#form${i}`).value.trim()||'—'}`));list.append(row);});panel.append(list);
      panel.append(one('h3',{},'Teil 2 · Example of a suitable message'));
      const example=one('div',{class:'answer-key'});example.append(one('p',{},data.model));panel.append(example);
      panel.append(one('p',{},'Check your message against this list. There is no automatic Goethe grade. Ask a teacher or fluent speaker to check grammar and whether your message is understandable.'));
      const checks=one('div',{class:'self-check'});['I answered the first content point.','I answered the second content point.','I answered the third content point.','I used an appropriate greeting and closing.','My message is understandable and about 30 words.'].forEach((item,i)=>{const label=one('label');label.append(one('input',{type:'checkbox',id:`writing-check-${i}`}));label.append(one('span',{},item));checks.append(label);});panel.append(checks);
      const existing=$('#writing-review');if(!existing)content.append(panel);
      panel.scrollIntoView({behavior:'smooth'});
    });actions.append(button,one('a',{class:'secondary',href:selectorURL},'All Schreiben exams'));
  }

  function renderSprechen(){
    const introductions = [
      'Guten Tag. Ich heiße Maria Lopez. Ich bin 24 Jahre alt und komme aus Spanien. Ich wohne in Bonn. Ich spreche Spanisch und ein bisschen Deutsch. Ich bin Studentin. Mein Hobby ist Musik.',
      'Hallo. Mein Name ist Amir Kaya. Ich bin 31 Jahre alt. Ich komme aus der Türkei und wohne in Essen. Ich spreche Türkisch und etwas Deutsch. Ich bin Koch. Ich lese gern.',
      'Guten Tag. Ich heiße Li Chen. Ich bin 22 und komme aus China. Ich lebe in Berlin. Ich spreche Chinesisch, Englisch und ein wenig Deutsch. Ich studiere. Mein Hobby ist Tennis.',
      'Hallo. Ich bin Eva Novak, 40 Jahre alt. Ich komme aus Tschechien. Ich wohne in Dresden. Ich spreche Tschechisch und Deutsch. Ich bin Verkäuferin. Ich arbeite gern im Garten.',
      'Guten Tag. Mein Name ist Omar Said. Ich bin 28 Jahre alt und komme aus Ägypten. Jetzt wohne ich in Köln. Ich spreche Arabisch und etwas Deutsch. Ich bin Mechaniker. Ich spiele gern Fußball.',
      'Hallo. Ich heiße Sofia Rossi. Ich bin 35. Ich komme aus Italien und wohne in Frankfurt. Ich spreche Italienisch und Deutsch. Ich bin Friseurin. Ich koche gern.',
      'Guten Tag. Ich heiße David Silva. Ich bin 26 Jahre alt. Ich komme aus Brasilien und wohne in Hamburg. Ich spreche Portugiesisch und ein bisschen Deutsch. Ich bin Krankenpfleger. Mein Hobby ist Schwimmen.',
      'Hallo. Mein Name ist Anna Kowalska. Ich bin 30 Jahre alt. Ich komme aus Polen und lebe in Leipzig. Ich spreche Polnisch und Deutsch. Ich arbeite im Büro. Ich tanze gern.',
      'Guten Tag. Ich bin Hiro Tanaka. Ich bin 23 und komme aus Japan. Ich wohne in München. Ich spreche Japanisch, Englisch und etwas Deutsch. Ich bin Student. Ich wandere gern.',
      'Hallo. Ich heiße Fatima Hassan. Ich bin 29 Jahre alt. Ich komme aus Marokko und wohne in Nürnberg. Ich spreche Arabisch, Französisch und etwas Deutsch. Ich bin Lehrerin. Mein Hobby ist Fotografieren.'
    ];
    const first=section(1,'Teil 1 · Sich vorstellen','Sprechen Sie laut. In der Goethe-Prüfung stellen Sie sich kurz vor. Sagen Sie Ihre persönlichen Angaben und beantworten Sie eine kurze Zusatzfrage.');
    const prompt=one('div',{class:'task-hint'},data.warmup);first.append(prompt);
    const intro=one('div',{class:'speak-card'});intro.innerHTML='<span class="topic">YOUR INTRODUCTION CARD</span><div class="keyword">Name · Alter · Land · Wohnort · Sprachen · Beruf · Hobby</div>';
    const introDetails=one('details');introDetails.append(one('summary',{},'See an A1 example introduction'));introDetails.append(one('div',{class:'example'},introductions[index-1]));intro.append(introDetails);first.append(intro);
    first.append(one('p',{class:'task-hint'},`Extra task: ${data.spell}`));
    const second=section(2,'Teil 2 · Um Informationen bitten','Sprechen Sie mit einer Partnerin oder einem Partner. Lesen Sie das Thema und das Wort auf der Karte. Stellen Sie dazu eine einfache Frage. Antworten Sie auch auf die Fragen Ihres Partners.');
    data.info.forEach(([topic,word,question,answer],i)=>second.append(speakingCard(i+1,topic,word,question,answer,'question')));
    const third=section(3,'Teil 3 · Bitten formulieren','Sehen Sie die Situation und das Wort auf der Karte. Bitten Sie höflich um etwas. Üben Sie auch eine kurze Antwort auf die Bitte Ihres Partners.');
    data.requests.forEach(([topic,word,request,response],i)=>third.append(speakingCard(i+1,topic,word,request,response,'request')));
    const actions=$('#bottom-actions');const btn=one('button',{class:'primary'},'Finish speaking · Self-review →');btn.addEventListener('click',()=>{
      if(!running)begin();stopClock();
      let panel=$('#speaking-review');if(!panel){panel=one('section',{class:'result-card',id:'speaking-review'});content.append(panel);}
      panel.replaceChildren(one('span',{class:'eyebrow'},'YOUR SPEAKING REVIEW'),one('h2',{},'Check your Sprechen practice'),one('p',{},'There is no automatic score for speaking. Practise aloud with a partner and mark what you could do. Open the sample answers on each card to compare.'));
      const checks=one('div',{class:'self-check'});['I introduced myself with all seven personal details.','I completed the spelling or number task.','I asked understandable questions about the topic cards.','I answered my partner using short German sentences.','I made polite requests and reacted appropriately.','I spoke clearly and asked for repetition when necessary.'].forEach((txt,i)=>{const label=one('label');label.append(one('input',{type:'checkbox',id:`speaking-check-${i}`}));label.append(one('span',{},txt));checks.append(label);});panel.append(checks);
      panel.scrollIntoView({behavior:'smooth'});
    });actions.append(btn,one('a',{class:'secondary',href:selectorURL},'All Sprechen exams'));
  }
  function speakingCard(number,topic,word,example,answer,type){
    const card=one('article',{class:'speak-card'});card.innerHTML=`<div class="topic">CARD ${number} · ${escapeHTML(topic)}</div><div class="keyword">${escapeHTML(word)}</div><p>${type==='request'?'Make a polite request. How would your partner reply?':'Ask a German question using this word. Then give a short answer.'}</p>`;
    const detail=one('details');detail.append(one('summary',{},'See example question and response'));const ex=one('div',{class:'example'});ex.append(one('strong',{},'You: '),document.createTextNode(example),document.createElement('br'),one('strong',{},'Partner: '),document.createTextNode(answer));detail.append(ex);card.append(detail);return card;
  }
})();
