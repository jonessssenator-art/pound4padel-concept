(() => {
  const button = document.getElementById('clear-site-storage');
  button.addEventListener('click', () => {
    let failed = false;
    try { sessionStorage.removeItem('p4p-photo-intro-v2'); } catch { failed = true; }
    try { localStorage.removeItem('p4p-component-choice'); } catch { failed = true; }
    document.getElementById('storage-result').textContent = failed
      ? 'Браузер ограничил доступ. Удалите данные сайта в настройках браузера.'
      : 'Настройки сайта удалены. Заставка может появиться снова.';
  });
})();
