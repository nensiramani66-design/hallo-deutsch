(() => {
  'use strict';
  const select = document.getElementById('exam-language');
  if (!select) return;
  const storageKey = 'hallo-deutsch-exam-language';
  function setLanguage(language) {
    const chosen = language === 'de' ? 'de' : 'en';
    document.documentElement.lang = chosen;
    select.value = chosen;
    document.querySelectorAll('[data-en][data-de]').forEach(element => {
      element.textContent = element.dataset[chosen];
    });
    document.title = chosen === 'de'
      ? document.body.dataset.titleDe
      : document.body.dataset.titleEn;
    try { localStorage.setItem(storageKey, chosen); } catch (_) { /* Reading works without storage. */ }
  }
  let savedLanguage = 'en';
  try { savedLanguage = localStorage.getItem(storageKey) || 'en'; } catch (_) { /* Use the default. */ }
  setLanguage(savedLanguage);
  select.addEventListener('change', () => setLanguage(select.value));

  const currentFile = location.pathname.split('/').pop();
  document.querySelectorAll('.guide-sidebar nav a').forEach(link => {
    if (link.getAttribute('href') === currentFile) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
})();
