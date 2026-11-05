// Native details remain usable without JS; enhance only pointer-driven height changes.
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finishers = [];
  document.querySelectorAll('.faq-item').forEach(details => {
    const summary = details.querySelector('summary');
    let animation;
    let expanded = details.open;
    let version = 0;
    const settle = () => {
      version++;
      animation?.cancel();
      animation = null;
      details.open = expanded;
      summary.setAttribute('aria-expanded',String(expanded));
      details.style.height = '';
    };
    finishers.push(settle);
    summary.setAttribute('aria-expanded',String(expanded));
    summary.addEventListener('click', event => {
      event.preventDefault();
      const from = details.getBoundingClientRect().height;
      expanded = !expanded;
      summary.setAttribute('aria-expanded',String(expanded));
      if(reducedMotion.matches || event.detail === 0){settle();return;}
      const token = ++version;
      animation?.cancel();
      details.style.height = '';
      details.open = true;
      const border = parseFloat(getComputedStyle(details).borderTopWidth) + parseFloat(getComputedStyle(details).borderBottomWidth);
      const to = expanded ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + border;
      animation = details.animate([{height:from+'px'},{height:to+'px'}], {
        duration:220,easing:'cubic-bezier(.23,1,.32,1)',fill:'both'
      });
      animation.finished.then(()=>{if(token===version)settle();}).catch(()=>{});
    });
  });
  // Retain natural content height if text wraps differently or motion is disabled.
  window.addEventListener('resize',()=>finishers.forEach(finish=>finish()));
  reducedMotion.addEventListener('change',()=>finishers.forEach(finish=>finish()));
})();
