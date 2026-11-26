(() => {
  'use strict';

  const forms = [...document.querySelectorAll('.listen-question')];
  const progress = document.getElementById('listen-progress');
  const audioPanels = [...document.querySelectorAll('.listen-audio-panel')];
  const speechAvailable = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let speechToken = 0;
  let playingPanel = null;

  const german = () => document.documentElement.lang === 'de';
  const translate = (english, deutsch) => german() ? deutsch : english;

  function updateProgress() {
    const reviewed = forms.filter(form => form.dataset.result === 'correct' || form.dataset.result === 'retry').length;
    progress.firstChild.textContent = `${reviewed} / ${forms.length} `;
    progress.classList.toggle('is-complete', reviewed === forms.length);
  }

  function setFeedback(form, result) {
    const messages = {
      empty: translate('Choose an answer first.', 'Bitte wähle zuerst eine Antwort.'),
      correct: translate('Correct! Check the explanation below.', 'Richtig! Lies die Erklärung unten.'),
      retry: translate('Not quite. Look at the explanation and try again.', 'Noch nicht richtig. Lies die Erklärung und versuche es erneut.')
    };
    form.dataset.result = result;
    const feedback = form.querySelector('.listen-feedback');
    feedback.textContent = messages[result];
    feedback.dataset.result = result;
    form.querySelector('.listen-explanation').hidden = result === 'empty';
    updateProgress();
  }

  forms.forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const selected = form.querySelector('input:checked');
      setFeedback(form, !selected ? 'empty' : selected.value === form.dataset.answer ? 'correct' : 'retry');
    });
    form.addEventListener('change', () => {
      delete form.dataset.result;
      const feedback = form.querySelector('.listen-feedback');
      feedback.textContent = '';
      delete feedback.dataset.result;
      form.querySelector('.listen-explanation').hidden = true;
      updateProgress();
    });
  });

  function idleButton(panel) {
    const button = panel.querySelector('.listen-play-button');
    button.querySelector('.listen-play-icon').textContent = '▶';
    button.querySelector('.listen-play-label').textContent = translate('Play listening sample', 'Hörbeispiel abspielen');
    panel.classList.remove('is-playing');
  }

  function stopSpeech() {
    speechToken++;
    if (speechAvailable) window.speechSynthesis.cancel();
    if (playingPanel) {
      idleButton(playingPanel);
      playingPanel = null;
    }
  }

  function showAudioStatus(panel, english, deutsch) {
    panel.querySelector('.listen-audio-status').textContent = translate(english, deutsch);
  }

  function getScriptLines(panel) {
    // The displayed original script is the single source for audio and transcript.
    const source = panel.closest('.listen-part').querySelector('.listen-script-text');
    return source.innerText.split(/\n+/).map(text => text.replace(/^[AB]:\s*/, '').trim()).filter(Boolean);
  }

  function playSpeech(panel) {
    if (playingPanel === panel) {
      stopSpeech();
      showAudioStatus(panel, 'Playback stopped.', 'Wiedergabe beendet.');
      return;
    }
    stopSpeech();

    if (!speechAvailable) {
      showAudioStatus(panel, 'Speech playback is unavailable here. Read the transcript or try the official audio test below.', 'Sprachausgabe ist hier nicht verfügbar. Lies den Hörtext oder nutze den offiziellen Audiotest unten.');
      return;
    }

    const lines = getScriptLines(panel);
    const repetitions = Number(panel.dataset.playbacks);
    const voices = window.speechSynthesis.getVoices().filter(voice => /^de([-_]|$)/i.test(voice.lang));
    const steps = [];
    for (let round = 1; round <= repetitions; round++) {
      for (let line = 0; line < lines.length; line++) steps.push({round, line, text: lines[line]});
    }
    if (!steps.length) return;

    const token = ++speechToken;
    playingPanel = panel;
    panel.classList.add('is-playing');
    panel.querySelector('.listen-play-icon').textContent = '■';
    panel.querySelector('.listen-play-label').textContent = translate('Stop audio', 'Audio stoppen');
    showAudioStatus(panel, `Playing 1 of ${repetitions}…`, `Wiedergabe 1 von ${repetitions}…`);
    let nextIndex = 0;

    function finish(english, deutsch) {
      if (token !== speechToken) return;
      playingPanel = null;
      idleButton(panel);
      showAudioStatus(panel, english, deutsch);
    }

    function nextUtterance() {
      if (token !== speechToken) return;
      if (nextIndex >= steps.length) {
        finish('Finished. Choose your answer.', 'Fertig. Wähle deine Antwort.');
        return;
      }
      const step = steps[nextIndex++];
      showAudioStatus(panel, `Playing ${step.round} of ${repetitions}…`, `Wiedergabe ${step.round} von ${repetitions}…`);
      const utterance = new SpeechSynthesisUtterance(step.text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.91;
      if (voices.length) utterance.voice = voices[Math.min(step.line % voices.length, voices.length - 1)];
      utterance.onend = () => {
        if (token !== speechToken) return;
        // A short separation between sentences and between full playbacks.
        const next = steps[nextIndex];
        const delay = next && next.round !== step.round ? 700 : 280;
        window.setTimeout(nextUtterance, delay);
      };
      utterance.onerror = () => finish(
        'Audio could not play. Try again or use the official test below.',
        'Audio konnte nicht abgespielt werden. Versuche es erneut oder nutze den offiziellen Test unten.'
      );
      try { window.speechSynthesis.speak(utterance); }
      catch (_) {
        finish('Audio playback is not available in this browser.', 'Die Audio-Wiedergabe ist in diesem Browser nicht verfügbar.');
      }
    }
    nextUtterance();
  }

  audioPanels.forEach(panel => {
    panel.querySelector('.listen-play-button').addEventListener('click', () => playSpeech(panel));
    if (!speechAvailable) {
      const button = panel.querySelector('.listen-play-button');
      button.disabled = true;
      showAudioStatus(panel, 'Speech playback is not supported in this browser. The transcript is available below.', 'Dieser Browser unterstützt keine Sprachausgabe. Der Hörtext steht unten.');
    }
  });

  document.getElementById('exam-language').addEventListener('change', () => {
    forms.forEach(form => { if (form.dataset.result) setFeedback(form, form.dataset.result); });
    audioPanels.forEach(panel => {
      if (panel === playingPanel) {
        panel.querySelector('.listen-play-label').textContent = translate('Stop audio', 'Audio stoppen');
      } else {
        idleButton(panel);
      }
    });
    // Keep an active playback or unsupported-voice notice understandable after switching languages.
    if (playingPanel) showAudioStatus(playingPanel, 'Playing audio…', 'Audio wird abgespielt…');
  });

  const navLinks = [...document.querySelectorAll('.listen-part-nav a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-20% 0px -60% 0px', threshold: 0});
    document.querySelectorAll('.listen-part').forEach(part => observer.observe(part));
  }
  window.addEventListener('hashchange', stopSpeech);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopSpeech(); });
  window.addEventListener('pagehide', stopSpeech);
  updateProgress();
})();
