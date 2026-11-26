(() => {
  'use strict';

  // Sets 2–10 use the same timed exam, one-question navigation, scoring and review as Set 1.
  const setNumber = Number(new URLSearchParams(location.search).get('set'));
  const source = window.HOEREN_SETS && window.HOEREN_SETS[setNumber];
  if (!source || source.length !== 15) {
    document.getElementById('main-content').innerHTML = '<div class="hoeren-mock-shell"><h1>Practice set unavailable</h1><p><a href="a1-hoeren-preparations.html">Back to listening sets</a></p></div>';
    return;
  }
  const emojiFor = label => /Euro|€/.test(label) ? '💶' : /Uhr|^\d{2}:\d{2}/.test(label) ? '🕒' : /Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag|Mai|Juni|Juli/.test(label) ? '📅' : /Bus|Zug|Gleis|Straßenbahn|Auto|Fahrrad/.test(label) ? '🚆' : '◯';
  const questions = source.map((item, index) => ({
    id: index + 1,
    part: item.part,
    prompt: item.question,
    answer: item.part === 2 ? (item.answer === 0 ? 'richtig' : 'falsch') : 'abc'[item.answer],
    choices: item.part === 2 ? undefined : item.options.map((label, i) => ['abc'[i], label, emojiFor(label)]),
    script: item.script.split('\n'),
    reason: [item.explanation, 'Entscheidend ist die Stelle im Hörtext: „' + item.evidence + '“.'],
    evidence: item.evidence
  }));
  // Update the set-specific labels without changing Exam Preparation 1.
  for (const element of document.querySelectorAll('[data-en][data-de]')) {
    element.dataset.en = element.dataset.en.replaceAll('Exam Preparation 1', 'Exam Preparation ' + setNumber);
    element.dataset.de = element.dataset.de.replaceAll('Prüfungsvorbereitung 1', 'Prüfungsvorbereitung ' + setNumber);
    element.textContent = document.documentElement.lang === 'de' ? element.dataset.de : element.dataset.en;
  }
  document.body.dataset.titleEn = 'Hören · Exam Preparation ' + setNumber + ' · Hallo Deutsch';
  document.body.dataset.titleDe = 'Hören · Prüfungsvorbereitung ' + setNumber + ' · Hallo Deutsch';
  document.title = document.body.dataset[document.documentElement.lang === 'de' ? 'titleDe' : 'titleEn'];

  const byId = id => document.getElementById(id);
  const german = () => document.documentElement.lang === 'de';
  const t = (en, de) => german() ? de : en;
  const parts = {
    1: {en: 'Conversations', de: 'Gespräche', audioEn: 'CONVERSATION', audioDe: 'GESPRÄCH', plays: 2},
    2: {en: 'Announcements', de: 'Durchsagen', audioEn: 'ANNOUNCEMENT', audioDe: 'DURCHSAGE', plays: 1},
    3: {en: 'Phone messages', de: 'Telefonische Mitteilungen', audioEn: 'PHONE MESSAGE', audioDe: 'TELEFONNACHRICHT', plays: 2}
  };
  const audioEvidence = Object.fromEntries(questions.map(q => [q.id, q.evidence]));
  const answers = {};
  const openExplanations = new Set();
  let currentIndex = 0;
  let remaining = 20 * 60;
  let timerId = null;
  let deadline = 0;
  let started = false;
  let finished = false;
  let timedOutResult = false;
  let speechToken = 0;
  let playing = false;
  let utteranceTimer = null;
  const speechAvailable = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const completedAudio = new Set();
  const allowReplay = () => Boolean(byId('practice-replay')?.checked);

  function make(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  }

  function highlightedTranscript(question) {
    const transcript = make('p', 'hoeren-transcript');
    transcript.lang = 'de';
    const text = question.script.join('\n');
    const phrase = audioEvidence[question.id];
    const index = text.indexOf(phrase);
    if (index === -1) {
      transcript.textContent = text;
      return transcript;
    }
    transcript.append(
      document.createTextNode(text.slice(0, index)),
      make('mark', 'hoeren-evidence', text.slice(index, index + phrase.length)),
      document.createTextNode(text.slice(index + phrase.length))
    );
    return transcript;
  }

  function updateCounter() {
    const count = Object.keys(answers).length;
    byId('exam-answered').textContent = t(`${count} / 15 answered`, `${count} / 15 beantwortet`);
    byId('exam-progress-bar').style.width = `${(count / 15) * 100}%`;
  }

  function buildIndex() {
    const container = byId('question-index');
    container.replaceChildren();
    for (const q of questions) {
      const button = make('button', 'hoeren-index-button', String(q.id));
      button.type = 'button';
      button.setAttribute('aria-label', t(`Question ${q.id}`, `Aufgabe ${q.id}`));
      if (q.id === questions[currentIndex].id) {
        button.classList.add('is-current');
        button.setAttribute('aria-current', 'step');
      }
      if (answers[q.id]) button.classList.add('is-answered');
      if (q.id === 7 || q.id === 11) button.classList.add('is-part-start');
      button.addEventListener('click', () => goTo(q.id - 1));
      container.append(button);
    }
  }

  function updateAudioButton() {
    const locked = !playing && started && !finished && completedAudio.has(questions[currentIndex].id) && !allowReplay();
    byId('audio-button-icon').textContent = playing ? '■' : locked ? '✓' : '▶';
    byId('audio-button-text').textContent = playing ? t('Stop audio', 'Audio stoppen')
      : locked ? t('Already played', 'Bereits gehört') : t('Play audio', 'Audio abspielen');
    byId('play-audio').disabled = locked;
    byId('play-audio').classList.toggle('is-playing', playing);
  }

  function stopAudio() {
    speechToken++;
    if (utteranceTimer !== null) window.clearTimeout(utteranceTimer);
    utteranceTimer = null;
    if (speechAvailable) {
      try { window.speechSynthesis.cancel(); } catch (_) { /* Voice engines vary. */ }
    }
    playing = false;
    updateAudioButton();
  }

  function showFallback(question) {
    byId('audio-fallback').hidden = false;
    byId('fallback-script').textContent = question.script.join('\n');
    byId('audio-status').textContent = t('Audio is unavailable here.', 'Die Sprachausgabe ist hier nicht verfügbar.');
  }

  function playAudio() {
    const question = questions[currentIndex];
    if (completedAudio.has(question.id) && !allowReplay()) {
      byId('audio-status').textContent = t('Audio already played in exam mode.', 'Im Prüfungsmodus bereits gehört.');
      return;
    }
    if (playing) {
      stopAudio();
      byId('audio-status').textContent = t('Playback stopped.', 'Wiedergabe beendet.');
      return;
    }
    if (!speechAvailable) {
      showFallback(question);
      return;
    }
    stopAudio();
    const token = ++speechToken;
    let voices = [];
    try { voices = window.speechSynthesis.getVoices().filter(voice => /^de([-_]|$)/i.test(voice.lang)); }
    catch (_) { showFallback(question); return; }
    const repetitions = parts[question.part].plays;
    const steps = [];
    for (let round = 1; round <= repetitions; round++) {
      question.script.forEach((line, index) => steps.push({round, index, text: line.replace(/^[AB]:\s*/, '')}));
    }
    let next = 0;
    playing = true;
    updateAudioButton();
    function finish(messageEn, messageDe, failed = false) {
      if (token !== speechToken) return;
      playing = false;
      if (!failed) completedAudio.add(question.id);
      updateAudioButton();
      byId('audio-status').textContent = t(messageEn, messageDe);
      if (failed) showFallback(question);
    }
    function speakNext() {
      if (token !== speechToken) return;
      if (next === steps.length) {
        finish('Audio finished. Choose your answer.', 'Audio beendet. Wähle deine Antwort.');
        return;
      }
      const step = steps[next++];
      byId('audio-status').textContent = t(`Playing ${step.round} of ${repetitions}…`, `Wiedergabe ${step.round} von ${repetitions}…`);
      const utterance = new SpeechSynthesisUtterance(step.text);
      utterance.lang = 'de-DE';
      utterance.rate = .91;
      utterance.pitch = step.index % 2 ? .96 : 1.05;
      if (voices.length) utterance.voice = voices[step.index % voices.length];
      utterance.onend = () => {
        if (token !== speechToken) return;
        const following = steps[next];
        const pause = following && following.round !== step.round ? 1350 : 420;
        utteranceTimer = window.setTimeout(speakNext, pause);
      };
      utterance.onerror = () => finish('Could not play audio.', 'Audio konnte nicht abgespielt werden.', true);
      try { window.speechSynthesis.speak(utterance); }
      catch (_) { finish('Could not play audio.', 'Audio konnte nicht abgespielt werden.', true); }
    }
    speakNext();
  }

  function renderQuestion() {
    const q = questions[currentIndex];
    const part = parts[q.part];
    byId('exam-part-label').textContent = `TEIL ${q.part} / ${german() ? part.de : part.en}`;
    byId('question-position').textContent = t(`Question ${q.id} of 15`, `Aufgabe ${q.id} von 15`);
    byId('question-number').textContent = String(q.id).padStart(2, '0');
    byId('question-title').textContent = q.prompt;
    byId('audio-category').textContent = german() ? part.audioDe : part.audioEn;
    byId('audio-instruction').textContent = allowReplay()
      ? (part.plays === 1
        ? t('Plays once · replay allowed in practice mode.', 'Einmal pro Klick · Wiederholen im Übungsmodus erlaubt.')
        : t('Plays twice automatically · replay allowed in practice mode.', 'Automatisch zweimal · Wiederholen im Übungsmodus erlaubt.'))
      : (part.plays === 1
        ? t('Exam mode · plays once, without replay.', 'Prüfungsmodus · einmal hören, ohne Wiederholung.')
        : t('Exam mode · plays twice automatically, without replay.', 'Prüfungsmodus · automatisch zweimal hören, ohne Wiederholung.'));
    byId('audio-status').textContent = '';
    byId('audio-fallback').hidden = true;
    byId('fallback-script').textContent = '';

    const fieldset = byId('answer-options');
    fieldset.replaceChildren();
    const legend = make('legend', 'sr-only', t('Choose one answer', 'Wähle eine Antwort'));
    fieldset.append(legend);
    const options = q.part === 2
      ? [['richtig', 'Richtig', '✓'], ['falsch', 'Falsch', '✕']]
      : q.choices;
    options.forEach(([value, label, emoji]) => {
      const wrapper = make('label', 'hoeren-option');
      const input = make('input');
      input.type = 'radio';
      input.name = `question-${q.id}`;
      input.value = value;
      input.checked = answers[q.id] === value;
      input.addEventListener('change', () => {
        answers[q.id] = value;
        updateCounter();
        buildIndex();
      });
      const visual = window.HOEREN_VISUALS?.forOption(label, emoji) || {text:emoji, className:''};
      const picture = make('span', 'hoeren-option-picture ' + visual.className, visual.text);
      picture.setAttribute('aria-hidden', 'true');
      const caption = make('span', 'hoeren-option-label', `${q.part === 2 ? '' : value + ')  '}${label}`);
      if (visual.className === 'is-symbol' && q.part !== 2) wrapper.append(input, caption);
      else wrapper.append(input, picture, caption);
      fieldset.append(wrapper);
    });
    updateAudioButton();
    byId('prev-question').disabled = currentIndex === 0;
    byId('next-question').hidden = currentIndex === questions.length - 1;
    byId('submit-exam').hidden = currentIndex !== questions.length - 1;
    updateCounter();
    buildIndex();
  }

  function goTo(index) {
    if (!started || finished || index < 0 || index >= questions.length) return;
    stopAudio();
    currentIndex = index;
    renderQuestion();
    byId('exam-workspace').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  }

  function formatTime(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  function tick() {
    if (finished || !started) return;
    remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const time = byId('exam-timer');
    time.textContent = formatTime(remaining);
    time.classList.toggle('is-urgent', remaining <= 120);
    if (remaining === 0) submitExam(true);
  }

  function startExam() {
    stopAudio();
    if (timerId !== null) window.clearInterval(timerId);
    Object.keys(answers).forEach(key => delete answers[key]);
    completedAudio.clear();
    openExplanations.clear();
    currentIndex = 0;
    remaining = 20 * 60;
    deadline = Date.now() + remaining * 1000;
    started = true;
    finished = false;
    timedOutResult = false;
    byId('exam-intro').hidden = true;
    byId('exam-results').hidden = true;
    byId('exam-workspace').hidden = false;
    byId('exam-timer').textContent = '20:00';
    renderQuestion();
    timerId = window.setInterval(tick, 500);
    byId('exam-workspace').scrollIntoView({block: 'start'});
  }

  function renderResults(timedOut) {
    const score = questions.filter(q => answers[q.id] === q.answer).length;
    const unanswered = questions.length - Object.keys(answers).length;
    byId('results-score').replaceChildren(String(score), make('span', '', '/15'));
    byId('result-summary').textContent = t(
      `${score} of 15 correct · ${unanswered} unanswered.${timedOut ? ' Time is up.' : ''} Your result is for practice only.`,
      `${score} von 15 richtig · ${unanswered} unbeantwortet.${timedOut ? ' Die Zeit ist abgelaufen.' : ''} Dies ist nur ein Übungsergebnis.`
    );

    const partsContainer = byId('result-parts');
    partsContainer.replaceChildren();
    [1, 2, 3].forEach(id => {
      const set = questions.filter(q => q.part === id);
      const correct = set.filter(q => answers[q.id] === q.answer).length;
      const card = make('div', 'hoeren-part-result');
      card.append(make('span', '', `Teil ${id} · ${german() ? parts[id].de : parts[id].en}`), make('strong', '', `${correct} / ${set.length}`));
      partsContainer.append(card);
    });

    const review = byId('result-review');
    review.replaceChildren();
    questions.forEach(q => {
      const chosen = answers[q.id] || null;
      const correct = chosen === q.answer;
      const entry = make('div', 'hoeren-review-entry');
      const details = make('details', 'hoeren-review-item' + (correct ? ' is-correct' : ' is-wrong'));
      const summary = make('summary', '', `${t('Question', 'Aufgabe')} ${q.id} · ${correct ? t('Correct', 'Richtig') : !chosen ? t('Not answered', 'Nicht beantwortet') : t('Incorrect', 'Falsch')}`);
      const content = make('div', 'hoeren-review-detail');
      content.id = `hoeren-review-detail-${q.id}`;
      content.append(make('strong', '', q.prompt));
      const labels = q.part === 2 ? {richtig: 'Richtig', falsch: 'Falsch'} : Object.fromEntries(q.choices.map(([key, label]) => [key, label]));
      content.append(make('p', '', `${t('Your answer:', 'Deine Antwort:')} ${chosen ? labels[chosen] : t('No answer', 'Keine Antwort')}`));
      const correctLine = make('p', 'hoeren-correct-line');
      correctLine.append(
        make('span', '', t('Correct answer: ', 'Richtige Antwort: ')),
        make('mark', 'hoeren-answer-highlight', `${q.part === 2 ? '' : q.answer + ') '}${labels[q.answer]}`)
      );
      content.append(correctLine);
      content.append(make('p', 'hoeren-review-reason', q.reason[german() ? 1 : 0]));
      content.append(make('p', 'hoeren-script-caption', t('Listening text:', 'Hörtext:')));
      content.append(highlightedTranscript(q));
      details.append(summary, content);
      const explanationLink = make('button', 'hoeren-explain-link');
      explanationLink.type = 'button';
      explanationLink.setAttribute('aria-controls', content.id);
      if (openExplanations.has(q.id)) details.open = true;
      const syncLink = () => {
        explanationLink.textContent = details.open
          ? t('Hide answer, script & explanation', 'Antwort, Hörtext & Erklärung ausblenden')
          : t('See correct answer, script & explanation', 'Richtige Antwort, Hörtext & Erklärung ansehen');
        explanationLink.setAttribute('aria-expanded', String(details.open));
        if (details.open) openExplanations.add(q.id);
        else openExplanations.delete(q.id);
      };
      details.addEventListener('toggle', syncLink);
      explanationLink.addEventListener('click', () => {
        details.open = !details.open;
        syncLink();
      });
      syncLink();
      entry.append(details, explanationLink);
      review.append(entry);
    });
  }

  function submitExam(timedOut = false) {
    if (!started || finished) return;
    stopAudio();
    finished = true;
    timedOutResult = timedOut;
    if (timerId !== null) window.clearInterval(timerId);
    timerId = null;
    byId('exam-workspace').hidden = true;
    byId('exam-results').hidden = false;
    renderResults(timedOut);
    byId('exam-results').scrollIntoView({block: 'start'});
  }

  byId('start-exam').addEventListener('click', startExam);
  byId('retry-exam').addEventListener('click', startExam);
  byId('prev-question').addEventListener('click', () => goTo(currentIndex - 1));
  byId('next-question').addEventListener('click', () => goTo(currentIndex + 1));
  byId('submit-exam').addEventListener('click', () => submitExam(false));
  byId('play-audio').addEventListener('click', playAudio);
  if (!speechAvailable) byId('audio-status').textContent = t('Audio is not supported by this browser.', 'Dieser Browser unterstützt keine Sprachausgabe.');
  byId('exam-language').addEventListener('change', () => {
    updateAudioButton();
    if (started && !finished) renderQuestion();
    if (finished) renderResults(timedOutResult);
  });
  window.addEventListener('pagehide', () => {
    stopAudio();
    if (timerId !== null) window.clearInterval(timerId);
    timerId = null;
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted && started && !finished && timerId === null) {
      tick();
      if (!finished) timerId = window.setInterval(tick, 500);
    }
  });
})();
