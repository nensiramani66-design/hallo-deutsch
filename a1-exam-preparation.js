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
      ? 'A1-Prüfungsvorbereitung · Hallo Deutsch'
      : 'A1 Exam Preparation · Hallo Deutsch';
    try { localStorage.setItem(storageKey, chosen); } catch (_) { /* Reading works without storage. */ }
  }
  let savedLanguage = 'en';
  try { savedLanguage = localStorage.getItem(storageKey) || 'en'; } catch (_) { /* Use the default. */ }
  setLanguage(savedLanguage);
  select.addEventListener('change', () => setLanguage(select.value));

  const navLinks = [...document.querySelectorAll('.guide-sidebar nav a')];
  function markCurrent(id) {
    navLinks.forEach(link => {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  markCurrent(location.hash.slice(1) || 'overview');
  window.addEventListener('hashchange', () => markCurrent(location.hash.slice(1)));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) markCurrent(visible[0].target.id);
    }, { rootMargin: '-8% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('.guide-section[id]').forEach(section => observer.observe(section));
  }
})();
