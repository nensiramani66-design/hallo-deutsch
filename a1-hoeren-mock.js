(() => {
  'use strict';

  // Original Hallo Deutsch A1 questions. No official Goethe questions or recordings are reproduced.
  const questions = [
    {
      id: 1, part: 1, prompt: 'Wann beginnt der Deutschkurs?', answer: 'b',
      choices: [['a', '09:00 Uhr', '🕘'], ['b', '09:30 Uhr', '🕤'], ['c', '10:30 Uhr', '🕥']],
      script: ['A: Entschuldigung, beginnt der Deutschkurs heute um neun Uhr?', 'B: Nein, heute beginnen wir erst um halb zehn. Die Lehrerin kommt etwas später.', 'A: Also um neun Uhr dreißig?', 'B: Ja, genau.'],
      reason: ['„Halb zehn“ means 09:30, and the second speaker confirms that time.', '„Halb zehn“ bedeutet 09:30 Uhr. Die zweite Person bestätigt die Uhrzeit.']
    },
    {
      id: 2, part: 1, prompt: 'Wie viel kostet das große Brot?', answer: 'b',
      choices: [['a', '2,00 €', '💶'], ['b', '3,50 €', '💶'], ['c', '5,00 €', '💶']],
      script: ['A: Guten Tag. Was kostet das Brot?', 'B: Das große Brot kostet drei Euro fünfzig. Das kleine Brot kostet zwei Euro.', 'A: Dann nehme ich das große, bitte.'],
      reason: ['The large bread costs €3.50; €2 is the price of the small bread.', 'Das große Brot kostet 3,50 €. Das kleine kostet 2 €.']
    },
    {
      id: 3, part: 1, prompt: 'Wie fahren die beiden zum Bahnhof?', answer: 'b',
      choices: [['a', 'Mit dem Bus', '🚌'], ['b', 'Mit der Straßenbahn', '🚋'], ['c', 'Mit dem Taxi', '🚕']],
      script: ['A: Fahren wir mit dem Bus zum Bahnhof?', 'B: Nein, der Bus kommt erst in einer Stunde. Nehmen wir die Straßenbahn Nummer vier.', 'A: Gut, die Haltestelle ist hier.'],
      reason: ['They decide on tram number four because the bus arrives too late.', 'Sie nehmen die Straßenbahn Nummer vier, weil der Bus erst später kommt.']
    },
    {
      id: 4, part: 1, prompt: 'In welchem Stock ist die Arztpraxis?', answer: 'c',
      choices: [['a', 'Im ersten Stock', '1️⃣'], ['b', 'Im zweiten Stock', '2️⃣'], ['c', 'Im dritten Stock', '3️⃣']],
      script: ['A: Entschuldigung, ist die Arztpraxis im ersten Stock?', 'B: Nein, die Praxis ist im dritten Stock. Sie können den Aufzug nehmen.', 'A: Danke schön.'],
      reason: ['The office is on the third floor, not on the first.', 'Die Praxis liegt im dritten Stock, nicht im ersten.']
    },
    {
      id: 5, part: 1, prompt: 'Was soll gekauft werden?', answer: 'a',
      choices: [['a', 'Sechs Bananen', '🍌'], ['b', 'Sechs Äpfel', '🍎'], ['c', 'Sechs Orangen', '🍊']],
      script: ['A: Kaufst du heute Äpfel?', 'B: Nein, Äpfel haben wir noch. Ich brauche sechs Bananen.', 'A: Gut, ich bringe sie mit.'],
      reason: ['There are already apples at home; they need six bananas.', 'Äpfel sind noch da. Sie brauchen sechs Bananen.']
    },
    {
      id: 6, part: 1, prompt: 'An welchem Tag treffen sie sich?', answer: 'b',
      choices: [['a', 'Am Montag', '📅'], ['b', 'Am Mittwoch', '📅'], ['c', 'Am Freitag', '📅']],
      script: ['A: Ist unser Termin am Montag?', 'B: Montag kann ich leider nicht. Wir treffen uns am Mittwoch, um elf Uhr.', 'A: Alles klar, bis Mittwoch.'],
      reason: ['Monday is not possible, so the meeting is on Wednesday.', 'Montag geht nicht. Das Treffen ist am Mittwoch.']
    },
    {
      id: 7, part: 2, prompt: 'Die Bäckerei ist heute bis 18 Uhr geöffnet.', answer: 'falsch',
      script: ['Liebe Kundinnen und Kunden, unsere Bäckerei schließt heute schon um siebzehn Uhr. Morgen sind wir wieder ab sieben Uhr für Sie da. Vielen Dank.'],
      reason: ['False. The bakery closes at 17:00 today; 07:00 is tomorrow’s opening time.', 'Falsch. Die Bäckerei schließt heute um 17:00 Uhr. 07:00 Uhr ist die Öffnungszeit morgen.']
    },
    {
      id: 8, part: 2, prompt: 'Der Zug nach Köln fährt zehn Minuten später.', answer: 'richtig',
      script: ['Achtung am Gleis vier. Der Zug nach Köln hat heute zehn Minuten Verspätung. Er fährt um vierzehn Uhr zehn ab. Wir bitten um Entschuldigung.'],
      reason: ['True. The announcement says the train is delayed by ten minutes.', 'Richtig. Der Zug hat zehn Minuten Verspätung.']
    },
    {
      id: 9, part: 2, prompt: 'Kasse drei ist jetzt geöffnet.', answer: 'richtig',
      script: ['Liebe Kundinnen und Kunden, die Kasse drei ist jetzt geöffnet. Bitte kommen Sie zur Kasse drei. Vielen Dank.'],
      reason: ['True. Customers are asked to go to checkout three.', 'Richtig. Die Kundinnen und Kunden sollen zur Kasse drei gehen.']
    },
    {
      id: 10, part: 2, prompt: 'Der Deutschkurs beginnt heute um neun Uhr.', answer: 'falsch',
      script: ['Guten Morgen. Der Deutschkurs in Raum zwei beginnt heute um acht Uhr. Bitte kommen Sie rechtzeitig. Vielen Dank.'],
      reason: ['False. The course starts at 08:00, not 09:00.', 'Falsch. Der Kurs beginnt um 08:00 Uhr und nicht um 09:00 Uhr.']
    },
    {
      id: 11, part: 3, prompt: 'Wo treffen sich Mia und Leon?', answer: 'c',
      choices: [['a', 'Im Park', '🌳'], ['b', 'Im Café', '☕'], ['c', 'Bei Leon zu Hause', '🏠']],
      script: ['Hallo Mia, hier ist Leon. Heute treffen wir uns nicht im Park. Es regnet. Komm bitte um drei Uhr zu mir nach Hause. Meine Adresse ist Blumenstraße acht. Bis später!'],
      reason: ['The park is cancelled. Leon asks Mia to come to his home.', 'Der Park fällt aus. Leon bittet Mia, zu ihm nach Hause zu kommen.']
    },
    {
      id: 12, part: 3, prompt: 'Um wie viel Uhr möchte Paula Sophie treffen?', answer: 'c',
      choices: [['a', '08:00 Uhr', '🕗'], ['b', '09:00 Uhr', '🕘'], ['c', '10:00 Uhr', '🕙']],
      script: ['Hallo Sophie, hier ist Paula. Ich kann heute nicht um acht zum Frühstück kommen. Ich bin noch beim Arzt. Wir treffen uns um zehn Uhr vor dem Café. Bis dann!'],
      reason: ['The original time of 08:00 is cancelled. Paula says 10:00.', 'Der Termin um 08:00 Uhr fällt aus. Paula sagt 10:00 Uhr.']
    },
    {
      id: 13, part: 3, prompt: 'Was soll der Gast ins Hotel mitbringen?', answer: 'a',
      choices: [['a', 'Den Ausweis', '🪪'], ['b', 'Einen Schlüssel', '🔑'], ['c', 'Einen Koffer', '🧳']],
      script: ['Guten Tag, hier ist Herr Klein aus dem Hotel Adler. Ihr Zimmer ist ab fünfzehn Uhr frei. Bitte bringen Sie Ihren Ausweis mit. Danke.'],
      reason: ['The hotel employee asks for an identity document (Ausweis).', 'Der Hotelmitarbeiter bittet darum, einen Ausweis mitzubringen.']
    },
    {
      id: 14, part: 3, prompt: 'Wo bekommt Tom seine Jacke?', answer: 'b',
      choices: [['a', 'Im Café', '☕'], ['b', 'In der Schule', '🏫'], ['c', 'Bei Lena zu Hause', '🏠']],
      script: ['Hi Tom, ich bin es, Lena. Ich habe deine Jacke. Du kannst sie morgen in der Schule abholen. Heute bin ich nicht zu Hause. Bis morgen!'],
      reason: ['Lena says Tom can pick up his jacket at school tomorrow.', 'Lena sagt, dass Tom die Jacke morgen in der Schule abholen kann.']
    },
    {
      id: 15, part: 3, prompt: 'An welchem Tag ist der neue Zahnarzttermin?', answer: 'c',
      choices: [['a', 'Am Dienstag', '📅'], ['b', 'Am Mittwoch', '📅'], ['c', 'Am Donnerstag', '📅']],
      script: ['Guten Tag, hier ist die Zahnarztpraxis Müller. Ihr Termin am Dienstag muss leider ausfallen. Bitte kommen Sie am Donnerstag um zehn Uhr. Auf Wiederhören.'],
      reason: ['Tuesday is cancelled. The new appointment is Thursday at 10:00.', 'Der Dienstagstermin fällt aus. Der neue Termin ist Donnerstag um 10:00 Uhr.']
    }
  ];

  const byId = id => document.getElementById(id);
  const german = () => document.documentElement.lang === 'de';
  const t = (en, de) => german() ? de : en;
  const parts = {
    1: {en: 'Conversations', de: 'Gespräche', audioEn: 'CONVERSATION', audioDe: 'GESPRÄCH', plays: 2},
    2: {en: 'Announcements', de: 'Durchsagen', audioEn: 'ANNOUNCEMENT', audioDe: 'DURCHSAGE', plays: 1},
    3: {en: 'Phone messages', de: 'Telefonische Mitteilungen', audioEn: 'PHONE MESSAGE', audioDe: 'TELEFONNACHRICHT', plays: 2}
  };
  // Each phrase comes directly from that question's original German audio script.
  const audioEvidence = {
    1: 'um halb zehn',
    2: 'drei Euro fünfzig',
    3: 'die Straßenbahn Nummer vier',
    4: 'im dritten Stock',
    5: 'sechs Bananen',
    6: 'am Mittwoch',
    7: 'um siebzehn Uhr',
    8: 'zehn Minuten Verspätung',
    9: 'die Kasse drei ist jetzt geöffnet',
    10: 'um acht Uhr',
    11: 'zu mir nach Hause',
    12: 'um zehn Uhr',
    13: 'Ihren Ausweis',
    14: 'in der Schule abholen',
    15: 'am Donnerstag'
  };
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
