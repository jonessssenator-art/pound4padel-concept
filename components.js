// Shared controls: input-aware motion and a single selection indicator per group.
document.addEventListener('keydown', () => { document.documentElement.dataset.input = 'keyboard'; }, true);
document.addEventListener('pointerdown', () => { document.documentElement.dataset.input = 'pointer'; }, true);
document.querySelectorAll('.ui-segmented').forEach(group => {
  const indicator = document.createElement('span');
  indicator.className = 'segment-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  group.prepend(indicator);
  function positionIndicator() {
    const selected = group.querySelector('[aria-selected="true"]');
    if (!selected) return;
    indicator.style.width = `${selected.offsetWidth}px`;
    indicator.style.transform = `translateX(${selected.offsetLeft}px)`;
    group.classList.add('is-ready');
  }
  new MutationObserver(positionIndicator).observe(group, {subtree:true,attributes:true,attributeFilter:['aria-selected']});
  new ResizeObserver(positionIndicator).observe(group);
  document.fonts.ready.then(positionIndicator);
  positionIndicator();
});
