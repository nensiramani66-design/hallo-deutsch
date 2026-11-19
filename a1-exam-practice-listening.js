(() => {
  'use strict';
  const views = [...document.querySelectorAll('.listen-view')];
  const links = [...document.querySelectorAll('[data-listen-link]')];
  function showView(scroll) {
    const requested = location.hash.slice(1);
    const current = views.find(view => view.id === requested) || views[0];
    views.forEach(view => { view.hidden = view !== current; });
    links.forEach(link => {
      if (link.dataset.listenLink === current.id) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    if (scroll) {
      const heading = current.querySelector('h2');
      heading.tabIndex = -1;
      heading.focus({preventScroll: true});
      document.querySelector('.listen-nav').scrollIntoView({block: 'start', behavior: 'auto'});
    }
  }
  showView(false);
  addEventListener('hashchange', () => {
    // Footer and skip links remain ordinary document anchors.
    if (!location.hash || views.some(view => '#' + view.id === location.hash)) showView(true);
  });
  const forms = [...document.querySelectorAll('.listen-question')];
  function setFeedback(form, result) {
    form.dataset.result = result;
    const german = document.documentElement.lang === 'de';
    const messages = {
      empty: german ? 'Bitte wähle zuerst eine Antwort.' : 'Choose an answer first.',
      correct: german ? 'Richtig. Lies die Erklärung unten.' : 'Correct. Read the explanation below.',
      retry: german ? 'Noch nicht richtig. Prüfe die entscheidende Information unten.' : 'Not quite. Check the key detail below.'
    };
    const feedback = form.querySelector('.listen-feedback');
    feedback.textContent = messages[result];
    feedback.dataset.result = result;
    form.querySelector('.listen-explanation').hidden = result === 'empty';
  }
  forms.forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const selected = form.querySelector('input:checked');
      setFeedback(form, !selected ? 'empty' : selected.value === form.dataset.answer ? 'correct' : 'retry');
    });
    form.addEventListener('change', () => {
      delete form.dataset.result;
      form.querySelector('.listen-feedback').textContent = '';
      form.querySelector('.listen-explanation').hidden = true;
    });
  });
  document.getElementById('exam-language').addEventListener('change', () => {
    forms.forEach(form => { if (form.dataset.result) setFeedback(form, form.dataset.result); });
  });
})();
