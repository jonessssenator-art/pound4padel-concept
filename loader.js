(() => {
  const key = 'p4p-brand-intro-seen';
  try { if (sessionStorage.getItem(key)) return; } catch {}
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const started = performance.now();
  let leaving = false;
  let closeTimer;
  root.classList.add('p4p-loading');
  const remove = () => root.classList.remove('p4p-loading', 'p4p-loader-leaving');
  const finish = (immediate = false) => {
    if (leaving) return;
    leaving = true;
    clearTimeout(deadline);
    document.removeEventListener('keydown', onKey);
    try { sessionStorage.setItem(key, '1'); } catch {}
    const delay = immediate || reduced ? 0 : Math.max(0, 700 - (performance.now() - started));
    closeTimer = setTimeout(() => {
      root.classList.add('p4p-loader-leaving');
      setTimeout(remove, reduced || immediate ? 0 : 240);
    }, delay);
  };
  const onKey = () => finish(true);
  const deadline = setTimeout(() => finish(), 2200);
  document.addEventListener('keydown', onKey, {once: true});
  window.addEventListener('load', () => finish(), {once: true});
  window.addEventListener('pageshow', event => {
    if (event.persisted) { clearTimeout(closeTimer); clearTimeout(deadline); remove(); }
  });
  if (document.readyState === 'complete') finish();
})();
