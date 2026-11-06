(() => {
  const key = 'p4p-photo-intro-v2';
  const force = new URLSearchParams(location.search).get('intro') === '1';
  try { if (!force && sessionStorage.getItem(key)) return; } catch {}
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host = document.createElement('div');
  host.className = 'p4p-photo-loader';
  host.setAttribute('role', 'status');
  host.setAttribute('aria-label', 'POUND4PADEL. Загрузка сайта');
  host.innerHTML = `<div class="p4p-scene" aria-hidden="true">
<img class="p4p-plate" src="ball-intro/assets/court-plate.jpg" alt="">
<div class="p4p-shadow p4p-shadow-left"></div><div class="p4p-shadow p4p-shadow-right"></div>
<svg class="p4p-balls" viewBox="0 0 1672 941" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="p4p-small"><path d="M0 0H305V325H0Z"/></clipPath><clipPath id="p4p-left"><path d="M305 0H800V941H0V325H305Z"/></clipPath><clipPath id="p4p-right"><path d="M800 0H1672V941H800Z"/></clipPath></defs>
<g class="p4p-left"><image href="ball-intro/assets/balls-cutout.png" width="1672" height="941" clip-path="url(#p4p-left)"/></g>
<g class="p4p-right"><image href="ball-intro/assets/balls-cutout.png" width="1672" height="941" clip-path="url(#p4p-right)"/></g>
<g class="p4p-bounce"><image href="ball-intro/assets/balls-cutout.png" width="1672" height="941" clip-path="url(#p4p-small)"/></g>
</svg>
</div>
<img class="p4p-logo" src="ball-intro/assets/logo.svg" alt="POUND4PADEL">
<div class="p4p-copy"><h1>Почувствуй<br>энергию<br>падела.</h1></div>

`;
  root.classList.add('p4p-loading');
  root.append(host);
  let finished = false;
  let timer;
  const finish = (instant = false) => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    clearTimeout(deadline);
    document.removeEventListener('keydown', skip);
    try { sessionStorage.setItem(key, '1'); } catch {}
    host.classList.add('p4p-leaving');
    root.classList.remove('p4p-loading');
    if (instant || reduced) host.remove();
    else setTimeout(() => host.remove(), 240);
  };
  const skip = () => finish(true);
  document.addEventListener('keydown', skip, {once:true});
  host.addEventListener('pointerdown', skip, {once:true});
  const deadline = setTimeout(() => finish(), 3800);
  const ready = document.readyState === 'complete' ? Promise.resolve() : new Promise(resolve => window.addEventListener('load', resolve, {once:true}));
  // Decode the cutout too: SVG image nodes are not in document.images.
  const art = ['ball-intro/assets/balls-cutout.png','ball-intro/assets/court-plate.jpg','ball-intro/assets/logo.svg'].map(src => {
    const img = new Image(); img.src=src; return img.decode().catch(()=>{});
  });
  Promise.all(art).then(() => {
    if (finished) return;
    host.classList.add('p4p-ready');
    const minimum = new Promise(resolve => { timer=setTimeout(resolve,reduced?200:1800); });
    Promise.all([ready,minimum]).then(()=>finish());
  });
  window.addEventListener('pageshow', event => { if(event.persisted) finish(true); });
})();
