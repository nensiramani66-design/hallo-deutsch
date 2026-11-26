/* Recording-first Sprechen practice. Audio stays in this tab: no upload or automatic grading. */
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  if (document.body.dataset.view !== 'exam' || params.get('module') !== 'sprechen') return;
  const set = Number(params.get('set'));
  const data = window.A1_MODULE_DATA?.sprechen?.[set - 1];
  const content = document.getElementById('exam-content');
  const footer = document.getElementById('bottom-actions');
  const oldStart = document.querySelector('.exam-hero .primary');
  const introduction = content?.querySelector('#part-1 .speak-card .example')?.textContent.trim();
  if (!data || !content || !footer || !oldStart || !introduction) return;

  const el = (tag, className = '', text = '') => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const button = (className, text, action) => {
    const node = el('button', className, text);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  };
  const tasks = [
    {id:'intro',part:1,kind:'intro',thema:'Sich vorstellen',
      word:'Name · Alter · Land · Wohnort · Sprachen · Beruf · Hobby',
      instruction:'Introduce yourself in German. Include your name, age, country, city, languages, occupation and hobby. Speak naturally in short sentences.',
      example:introduction,reply:''},
    ...data.info.map(([thema,word,example,reply],i)=>({
      id:`info-${i+1}`,part:2,kind:'question',thema,word,
      instruction:'Ask one simple German question about this Thema using the word on your card. Then give a short example answer, as if practising both sides with a partner.',
      example,reply
    })),
    ...data.requests.map(([thema,word,example,reply,picture],i)=>({
      id:`request-${i+1}`,part:3,kind:'request',thema,word,picture,
      instruction:'Make one polite request in German about the picture or situation. Then give a short reply as if another candidate had asked you.',
      example,reply
    }))
  ];
  const saved = new Map();
  const entries = new Map();
  let active = null;
  let pendingPermission = false;
  let started = false;
  let submitted = false;
  let remaining = 15 * 60;
  let examClock = null;

  const title = el('div','oral-session');
  title.innerHTML = '<div><span class="oral-kicker">GOETHE A1 · SPRECHEN PRACTICE</span><h2>Speak your answers</h2><p>Read the German Thema, then record what you would say.</p></div>';
  const timer = el('span','oral-clock','15:00');
  timer.setAttribute('role','timer');
  timer.setAttribute('aria-label','Practice time remaining');
  title.append(timer);

  const privacy = el('p','oral-privacy',
    'Microphone required. Your recordings stay in this browser tab, are not uploaded, and disappear if you reload or leave. Submit opens a self-review, not an automatic Goethe grade.');
  const progressBox = el('div','oral-progress-box');
  const progressText = el('strong','oral-progress-label','0 / 7 answers saved');
  const progress = el('progress','oral-progress');
  progress.max = tasks.length;
  progress.value = 0;
  progress.setAttribute('aria-label','Recorded answers saved');
  progressBox.append(progressText,progress);
  const stage = el('div','oral-stage');
  stage.id = 'oral-stage';
  stage.append(title,privacy,progressBox);

  const descriptions = {
    1:['Teil 1 · Sich vorstellen','Introduce yourself using the seven German prompts.'],
    2:['Teil 2 · Informationen','Each word card asks you to form a question.'],
    3:['Teil 3 · Bitten','Each picture card asks you to make a polite request.']
  };
  const parts = new Map();
  for (const [part, [name,help]] of Object.entries(descriptions)) {
    const section = el('section','oral-part');
    section.id = `sprechen-part-${part}`;
    const head = el('div','oral-part-header');
    head.append(el('h2','',name),el('p','',help));
    section.append(head);
    stage.append(section);
    parts.set(Number(part),section);
  }

  function setStatus(entry,message) { entry.status.textContent=message; }
  function updateProgress() {
    const count=tasks.filter(task=>saved.get(task.id)).length;
    progress.value=count;
    progressText.textContent=`${count} / ${tasks.length} answers saved`;
    submitButton.textContent=count===tasks.length?'Submit all my speaking answers':'Submit my answers';
  }
  function clearRecording(entry) {
    if (entry.url) URL.revokeObjectURL(entry.url);
    entry.url=null;
    entry.blob=null;
    saved.delete(entry.task.id);
    entry.preview.pause();
    entry.preview.removeAttribute('src');
    entry.preview.load();
    entry.preview.hidden=true;
    entry.download.hidden=true;
    entry.use.hidden=true;
    entry.again.hidden=true;
    entry.record.hidden=false;
    entry.record.disabled=false;
    entry.stop.hidden=true;
    entry.done.hidden=true;
    updateProgress();
  }

  async function startRecording(entry) {
    if (submitted) return;
    if (active || pendingPermission) {setStatus(entry,'Finish the current recording first.');return;}
    if (!window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
      setStatus(entry,'Microphone recording is not supported here. Try an updated Chrome, Edge, Firefox or Safari browser over HTTPS.');
      return;
    }
    if(entry.blob)clearRecording(entry);
    pendingPermission=true;
    setStatus(entry,'Waiting for microphone permission…');
    let stream;
    try {stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});}
    catch(error) {
      setStatus(entry,error?.name==='NotAllowedError'?'Microphone permission was denied. Allow microphone access in your browser to record.':'Could not open your microphone. Check that another app is not using it.');
      pendingPermission=false;return;
    }
    pendingPermission=false;
    if(submitted){stream.getTracks().forEach(track=>track.stop());return;}
    const supported=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(type=>MediaRecorder.isTypeSupported?.(type));
    let recorder;
    try {recorder=new MediaRecorder(stream,supported?{mimeType:supported}:undefined);}
    catch(error) {
      stream.getTracks().forEach(track=>track.stop());
      setStatus(entry,'Recording could not start with this audio format.');
      return;
    }
    const chunks=[];
    const startedAt=Date.now();
    const maxSeconds=entry.task.kind==='intro'?90:45;
    entry.record.hidden=true;
    entry.stop.hidden=false;
    entry.stop.disabled=false;
    entry.done.hidden=true;
    setStatus(entry,'Recording… 0 seconds');
    const session={entry,recorder,stream,interval:null};
    active=session;
    recorder.addEventListener('dataavailable',event=>{if(event.data?.size)chunks.push(event.data);});
    recorder.addEventListener('error',()=>setStatus(entry,'A recording error occurred. Please re-record.'));
    recorder.addEventListener('stop',()=>{
      clearInterval(session.interval);
      stream.getTracks().forEach(track=>track.stop());
      if(active===session)active=null;
      entry.stop.hidden=true;
      const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});
      if(!blob.size){
        entry.record.hidden=false;
        setStatus(entry,'No audio was captured. Please try again.');
        return;
      }
      entry.blob=blob;
      entry.url=URL.createObjectURL(blob);
      entry.preview.src=entry.url;
      entry.preview.hidden=false;
      const extension=blob.type.includes('mp4')?'m4a':'webm';
      entry.download.href=entry.url;
      entry.download.download=`hallo-deutsch-sprechen-${set}-${entry.task.id}.${extension}`;
      entry.download.hidden=false;
      entry.again.hidden=false;
      entry.use.hidden=false;
      setStatus(entry,'Recording ready. Listen, save this answer or re-record it.');
    });
    try {recorder.start(250);}
    catch(error) {
      stream.getTracks().forEach(track=>track.stop());
      active=null;entry.record.hidden=false;entry.stop.hidden=true;
      setStatus(entry,'Recording failed to start. Please try again.');
      return;
    }
    session.interval=setInterval(()=>{
      const seconds=Math.floor((Date.now()-startedAt)/1000);
      setStatus(entry,`Recording… ${seconds} seconds (maximum ${maxSeconds})`);
      if(seconds>=maxSeconds && recorder.state==='recording')recorder.stop();
    },500);
  }
  function stopRecording(entry) {
    if(active?.entry===entry && active.recorder.state==='recording') {
      entry.stop.disabled=true;
      setStatus(entry,'Preparing your recording…');
      active.recorder.stop();
    }
  }
  function useRecording(entry) {
    if(!entry.blob || submitted)return;
    saved.set(entry.task.id,true);
    entry.use.hidden=true;
    entry.done.hidden=false;
    setStatus(entry,'Answer saved in this tab. You can still re-record it before submitting.');
    updateProgress();
  }
  function buildTask(task,number) {
    const card=el('article','oral-task');
    card.id=`oral-${task.id}`;
    const heading=el('div','oral-card-heading');
    heading.append(el('span','oral-number',`TASK ${String(number).padStart(2,'0')}`),el('span','oral-role',task.part===1?'INTRODUCTION':task.part===2?'ASK & ANSWER':'REQUEST & RESPOND'));
    card.append(heading);
    card.append(el('span','oral-theme-label','THEMA'));
    const thema=el('h3','oral-theme',task.thema);thema.lang='de';card.append(thema);
    if(task.picture) {
      const picture=el('div','oral-picture',task.picture);
      picture.setAttribute('role','img');
      picture.setAttribute('aria-label',task.word);
      card.append(picture);
    }
    const keyword=el('div','oral-keyword',task.word);keyword.lang='de';card.append(keyword);
    card.append(el('p','oral-instruction',task.instruction));
    const recorderBox=el('div','oral-recorder');
    const controls=el('div','oral-record-controls');
    const entry={task,blob:null,url:null,record:null,stop:null,again:null,use:null,preview:null,download:null,status:null,done:null};
    entry.record=button('oral-record','🎙 Record my answer',()=>startRecording(entry));
    entry.stop=button('oral-stop','■ Stop recording',()=>stopRecording(entry));
    entry.stop.hidden=true;
    entry.again=button('oral-again','↻ Re-record',()=>startRecording(entry));
    entry.again.hidden=true;
    entry.use=button('oral-use','Use this answer',()=>useRecording(entry));
    entry.use.hidden=true;
    entry.done=el('strong','oral-saved','✓ Answer saved');entry.done.hidden=true;
    controls.append(entry.record,entry.stop,entry.again,entry.use,entry.done);
    entry.preview=el('audio','oral-playback');entry.preview.controls=true;entry.preview.preload='metadata';entry.preview.hidden=true;
    entry.download=el('a','oral-download','Download my audio');entry.download.hidden=true;
    entry.status=el('p','oral-record-status','Not recorded yet.');
    entry.status.setAttribute('role','status');
    recorderBox.append(controls,entry.preview,entry.download,entry.status);
    card.append(recorderBox);
    entries.set(task.id,entry);
    return card;
  }
  tasks.forEach((task,i)=>parts.get(task.part).append(buildTask(task,i+1)));

  const submitStatus=el('p','oral-submit-status');
  submitStatus.setAttribute('role','status');
  const submitButton=button('primary oral-submit','Submit my answers',submitAnswers);
  footer.replaceChildren(submitStatus,submitButton);
  content.replaceChildren(stage);
  content.hidden=true;
  footer.hidden=true;

  // Clone to detach the previous practice player's Start handler and timer.
  const replacement=oldStart.cloneNode(true);
  replacement.textContent='Start speaking exam';
  oldStart.replaceWith(replacement);
  replacement.addEventListener('click',()=>{
    if(started)return;
    started=true;
    content.hidden=false;
    footer.hidden=false;
    document.querySelector('.exam-hero').hidden=true;
    document.querySelector('.exam-info').hidden=true;
    examClock=setInterval(()=>{
      if(remaining>0)remaining--;
      const minutes=String(Math.floor(remaining/60)).padStart(2,'0');
      const seconds=String(remaining%60).padStart(2,'0');
      timer.textContent=`${minutes}:${seconds}`;
      if(remaining===0){
        clearInterval(examClock);
        submitStatus.textContent='The 15-minute practice time has ended. You can finish and review your recordings.';
      }
    },1000);
  });

  function sentencePattern(task) {
    if(task.kind==='intro')return 'Introduce yourself with short statements: Ich heiße … . Ich bin … Jahre alt. Ich komme aus … . Ich wohne in … .';
    if(task.kind==='question')return 'For a W-question: Wo / Was / Wann / Wie + verb + subject + … ? For a yes/no question: Verb + subject + … ?';
    return 'For a polite request: Können Sie bitte + infinitive … ? or Bitte + verb + object … . Include bitte and use a friendly tone.';
  }
  function submitAnswers() {
    if(submitted)return;
    const missing=tasks.filter(task=>!saved.get(task.id));
    if(missing.length){
      submitStatus.textContent=`Record and save ${missing.length} more answer${missing.length===1?'':'s'} before submitting.`;
      entries.get(missing[0].id).record.closest('.oral-task').scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
    submitted=true;
    clearInterval(examClock);
    const results=el('section','oral-results');
    results.id='oral-results';
    results.append(el('span','oral-kicker','YOUR SPRECHEN REVIEW'),el('h2','','All 7 speaking answers submitted'));
    results.append(el('p','', 'Listen to what you recorded, then open the model sentences and sentence patterns. Different correct German answers are possible; this is a self-review, not an automatic pronunciation or grammar grade.'));
    results.append(el('p','oral-privacy','Your audio is still only in this tab. Download any recording you want to keep before leaving or refreshing the page.'));
    for(const [i,task] of tasks.entries()){
      const entry=entries.get(task.id);
      const card=el('article','oral-review-card');
      card.append(el('span','oral-number',`TASK ${String(i+1).padStart(2,'0')} · TEIL ${task.part}`));
      const heading=el('h3','',task.thema+' · '+task.word);heading.lang='de';card.append(heading);
      card.append(el('strong','oral-play-title','Your recording'));
      const playback=el('audio','oral-playback');playback.controls=true;playback.src=entry.url;card.append(playback);
      const link=el('a','oral-download','Download this recording');link.href=entry.url;link.download=entry.download.download;card.append(link);
      const details=el('details','oral-model');
      details.append(el('summary','','Check model answer & sentence formation'));
      const inner=el('div','oral-model-body');
      inner.append(el('strong','','Possible A1 answer'));
      const answer=el('p','oral-german-example',task.example);answer.lang='de';inner.append(answer);
      if(task.reply){
        inner.append(el('strong','','Possible partner response'));
        const response=el('p','oral-german-example',task.reply);response.lang='de';inner.append(response);
      }
      inner.append(el('strong','','Sentence pattern to compare'));
      inner.append(el('p','oral-pattern',sentencePattern(task)));
      const check=el('label','oral-self-check');
      const checkbox=el('input');checkbox.type='checkbox';
      check.append(checkbox,el('span','','I addressed this Thema and used an understandable A1 sentence.'));
      inner.append(check);
      inner.append(el('p','oral-caveat','Use the model as guidance, not as the only correct answer. A teacher or speaking partner is needed for reliable grammar and pronunciation feedback.'));
      details.append(inner);card.append(details);results.append(card);
    }
    const actions=el('div','oral-final-actions');
    const again=el('a','secondary','Try this exam again');
    again.href=`a1-module-practice.html?module=sprechen&set=${set}`;
    const all=el('a','primary','Choose another speaking exam');
    all.href='a1-module-preparations.html?module=sprechen';
    actions.append(again,all);results.append(actions);
    stage.hidden=true;footer.hidden=true;
    content.append(results);
    results.scrollIntoView({behavior:'smooth',block:'start'});
  }
  window.addEventListener('pagehide',()=>{
    clearInterval(examClock);
    if(active){if(active.recorder.state==='recording')active.recorder.stop();active.stream.getTracks().forEach(track=>track.stop());}
    for(const entry of entries.values())if(entry.url)URL.revokeObjectURL(entry.url);
  },{once:true});
})();
