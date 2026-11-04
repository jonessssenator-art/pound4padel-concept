// Enhance the original, directly linked document without changing other site viewers.
(() => {
  const reader = document.querySelector('.pdf-reader');
  if (!reader) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim() || 'cubic-bezier(.23,1,.32,1)';
  const viewport = reader.querySelector('.reader-viewport');
  const image = viewport.querySelector('img');
  const status = reader.querySelector('#reader-status');
  const error = reader.querySelector('.reader-error');
  const select = reader.querySelector('select');
  const zoom = reader.querySelector('[data-reader-zoom]');
  const previous = reader.querySelector('[data-reader-step="-1"]');
  const next = reader.querySelector('[data-reader-step="1"]');
  const thumbnails = [...reader.querySelectorAll('[data-reader-index]')];
  const pages = [...document.querySelectorAll('.document-pages figure')].map(figure => ({
    title: figure.querySelector('h3').textContent,
    src: figure.querySelector('img').getAttribute('src')
  }));
  let current = 0;
  let requested = 0;
  let trigger;
  let previousOverflow;
  let zoomed = false;

  function setZoom(value) {
    zoomed = value;
    viewport.classList.toggle('is-zoomed', value);
    zoom.setAttribute('aria-pressed', String(value));
    zoom.querySelector('span').textContent = value ? 'По размеру окна' : 'Увеличить';
    viewport.scrollTo({top:0, left:0, behavior:'instant'});
  }

  async function show(index, animate = false) {
    const target = Math.max(0, Math.min(pages.length - 1, index));
    const direction = target >= current ? 1 : -1;
    const token = ++requested;
    current = target;
    setZoom(false);
    select.value = String(target + 1);
    previous.disabled = target === 0;
    next.disabled = target === pages.length - 1;
    thumbnails.forEach((button, i) => button.setAttribute('aria-pressed', String(i === target)));
    // Horizontal scrolling only: keep the document and the page underneath stationary.
    const thumb = thumbnails[target];
    const strip = reader.querySelector('.reader-thumbnails');
    strip.scrollTo({left:thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2,behavior:'instant'});
    image.getAnimations().forEach(animation => animation.cancel());
    viewport.setAttribute('aria-busy', 'true');
    error.hidden = true;
    status.textContent = `Загрузка страницы ${target + 1} из ${pages.length}`;
    const preload = new Image();
    preload.src = pages[target].src;
    try {
      await preload.decode();
      if (token !== requested || !reader.open) return;
      image.src = pages[target].src;
      image.alt = pages[target].title;
      image.hidden = false;
      viewport.removeAttribute('aria-busy');
      status.textContent = `${pages[target].title}. Страница ${target + 1} из ${pages.length}`;
      if (animate && !reduce.matches) {
        image.animate([{opacity:.35,transform:`translateX(${direction * 18}px)`},{opacity:1,transform:'translateX(0)'}],{duration:220,easing:ease});
      }
    } catch {
      if (token !== requested || !reader.open) return;
      viewport.removeAttribute('aria-busy');
      image.hidden = true;
      error.hidden = false;
      status.textContent = `Не удалось загрузить страницу ${target + 1}`;
    }
  }

  document.querySelectorAll('[data-document-page]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      reader.showModal();
      show(Number(link.dataset.documentPage) - 1);
    });
  });
  reader.querySelector('.reader-close').addEventListener('click', () => reader.close());
  reader.addEventListener('close', () => {
    requested++;
    image.getAnimations().forEach(animation => animation.cancel());
    document.body.style.overflow = previousOverflow;
    trigger?.focus({preventScroll:true});
  });
  reader.addEventListener('click', event => {
    if (event.target !== reader) return;
    const rect = reader.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) reader.close();
  });
  reader.querySelectorAll('[data-reader-step]').forEach(button => button.addEventListener('click', event => show(current + Number(button.dataset.readerStep), event.detail > 0)));
  thumbnails.forEach((button, index) => button.addEventListener('click', event => show(index, event.detail > 0)));
  select.addEventListener('change', () => show(Number(select.value) - 1));
  zoom.addEventListener('click', () => setZoom(!zoomed));
  reader.addEventListener('keydown', event => {
    if (event.target === select || zoomed || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  // A horizontal swipe flips one sheet; scrolling and pinch-zoom remain native.
  let touch;
  viewport.addEventListener('touchstart', event => {
    touch = !zoomed && event.touches.length === 1 ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
  }, {passive:true});
  viewport.addEventListener('touchmove', event => { if (event.touches.length !== 1) touch = null; }, {passive:true});
  viewport.addEventListener('touchcancel', () => { touch = null; }, {passive:true});
  viewport.addEventListener('touchend', event => {
    if (!touch || event.touches.length || zoomed) return;
    const dx = event.changedTouches[0].clientX - touch.x;
    const dy = event.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1), true);
  }, {passive:true});
})();
