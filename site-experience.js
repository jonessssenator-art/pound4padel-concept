(() => {
  if (!document.body.classList.contains('site-experience')) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const easing = getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim();
  const animations = new Set();
  function animate(element, frames, duration = 220, delay = 0) {
    if (reduce.matches || document.documentElement.dataset.input === 'keyboard') return;
    element.getAnimations().forEach(animation => animation.cancel());
    const animation = element.animate(frames, {duration, delay, easing, fill:'backwards'});
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  }
  // One reveal for each visual destination. Content is visible without JS, outside
  // the viewport, during keyboard navigation and when reduced motion is requested.
  const revealTargets = document.querySelectorAll('.teaser-photo:not(.motion-reveal),.home-products>a,.investor-teaser-image,.club-story,.page-wide-photo,.women-lead,.equipment-scene,.equipment-grid>figure,.packing dl>div,.walk-zoom');
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    visible.forEach((entry, index) => {
      observer.unobserve(entry.target);
      const isPacking = entry.target.parentElement.matches('.packing dl');
      animate(entry.target, isPacking ? [
        {opacity:.4,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}
      ] : [
        {opacity:.6,clipPath:'inset(0 0 8% 0 round 12px)',transform:'translateY(16px)'},
        {opacity:1,clipPath:'inset(0 0 0 0 round 12px)',transform:'translateY(0)'}
      ], 500, Math.min(index * 60, 180));
    });
  }, {threshold:.12});
  revealTargets.forEach(element => observer.observe(element));
  reduce.addEventListener('change', event => {if(event.matches)animations.forEach(animation=>animation.cancel());});
  document.addEventListener('keydown', () => animations.forEach(animation=>animation.cancel()), {capture:true});
  // Keep the existing native dialogs and focus handling. Animate only actual
  // changes of the displayed gallery image, after the new image has decoded.
  const dialog = document.querySelector('.image-dialog');
  const photo = dialog?.querySelector('img');
  if (photo) {
    let version = 0;
    new MutationObserver(async () => {
      const request = ++version;
      try {await photo.decode();} catch {return;}
      if(request !== version || !dialog.open)return;
      animate(photo,[{opacity:.45,transform:'scale(.985)'},{opacity:1,transform:'scale(1)'}]);
    }).observe(photo,{attributes:true,attributeFilter:['src']});
  }
  const detail = document.querySelector('.detail-note');
  if(detail)new MutationObserver(()=>{
    if(!detail.hidden)animate(detail,[{opacity:.3,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}]);
  }).observe(detail,{attributes:true,attributeFilter:['hidden']});
})();
