(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const body = document.body;
  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceQuery.matches || body.classList.contains('reduce-motion');
  const ease = 'cubic-bezier(.23,1,.32,1)';
  function motion(el, frames, duration = 220) {
    el.getAnimations().forEach(a => a.cancel());
    if (!reduced()) el.animate(frames, {duration, easing:ease});
  }
  const variants = {
    club:['Клубный.','Спокойные формы, мягкая заливка кнопок и плавная смена фотографий.'],
    sport:['Спортивный.','Срезанные углы, быстрые переходы и выбор игры прямо на фотографии.'],
    rally:['Розыгрыш.','Мяч отвечает на наведение, элементы мягко раскрываются, фотографии выходят на первый план.']
  };
  let saved = '';
  try { saved = localStorage.getItem('p4p-component-choice') || ''; } catch {}
  function updateSave() {
    const active = saved === body.dataset.style;
    $('#save-button').setAttribute('aria-pressed', String(active));
    $('#save-button span').textContent = active ? 'Вариант сохранён' : 'Сохранить вариант';
  }
  function setVariant(name, updateURL = true) {
    if (!variants[name]) name = 'club';
    body.dataset.style = name;
    $$('.variants button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.variant === name)));
    $('#variant-title').textContent = variants[name][0];
    $('#variant-description').textContent = variants[name][1];
    if (updateURL) {const url = new URL(location.href);url.searchParams.set('style',name);history.replaceState(null,'',url);}
    $('#feedback').textContent = '';
    updateSave();
    $$('.faq.is-open').forEach(f => { const a=f.querySelector('.answer'); a.style.height=a.firstElementChild.scrollHeight+'px'; });
  }
  $$('.variants button').forEach(b => b.addEventListener('click',()=>setVariant(b.dataset.variant)));
  setVariant(new URLSearchParams(location.search).get('style') || 'club', false);
  $('.motion-toggle').addEventListener('click',e=>{
    const off=body.classList.toggle('reduce-motion');e.currentTarget.setAttribute('aria-pressed',String(off));
    e.currentTarget.textContent=off?'Включить движение':'Без движения';
    if(off) $$('.reveal').forEach(el=>el.classList.add('is-visible'));
  });
  $('#save-button').addEventListener('click',()=>{
    saved = saved === body.dataset.style ? '' : body.dataset.style;
    let stored=true;try{localStorage.setItem('p4p-component-choice',saved);}catch{stored=false;}
    updateSave();$('#feedback').textContent=saved?(stored?'Выбор сохранён в этом браузере: '+variants[saved][0]:'Выбор отмечен на этой странице. Браузер не разрешил сохранение.'):'Отметка снята.';
  });
  let loadingTimer;
  $('#loading-demo').addEventListener('click',e=>{
    const b=e.currentTarget;clearTimeout(loadingTimer);b.disabled=true;b.classList.add('is-loading');b.setAttribute('aria-busy','true');b.lastElementChild.textContent='Демонстрация загрузки';
    loadingTimer=setTimeout(()=>{b.disabled=false;b.classList.remove('is-loading');b.removeAttribute('aria-busy');b.lastElementChild.textContent='Показать загрузку';$('#feedback').textContent='Так выглядит ожидание загрузки фотографии.';},1600);
  });
  const formats = {
    start:{image:'assets/play-court.png',alt:'Падел-корт для знакомства с игрой',title:'Начни с первого удара.',text:'Знакомство с кортом, ракеткой и правилами. О вводной тренировке и инвентаре можно узнать у клуба.',cta:'О первой игре',url:'club.html?format=start#play'},
    friends:{image:'assets/play-friends.jpg',alt:'Друзья играют в падел',title:'Собери свою четвёрку.',text:'Падел играют парами. Встречайтесь с друзьями на корте, меняйтесь партнёрами и проводите время вместе.',cta:'Об игре с друзьями',url:'club.html?format=friends#play'},
    coach:{image:'assets/play-coach.jpg',alt:'Тренировка на падел-корте',title:'От первого удара к точному.',text:'Подача, движение и игра у сетки. Формат тренировки и доступное время согласуйте с клубом.',cta:'О тренировках',url:'club.html?format=practice#play'}
  };
  let formatToken=0;
  async function setFormat(key, keyboard=false) {
    const data=formats[key], tabs=$$('[data-format]'), index=tabs.findIndex(t=>t.dataset.format===key), token=++formatToken;
    tabs.forEach(t=>{const active=t.dataset.format===key;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
    $('.tab-indicator').style.transform=`translateX(${index*100}%)`;
    $('#format-copy').setAttribute('aria-labelledby','tab-'+key);
    $('#format-title').textContent=data.title;$('#format-text').textContent=data.text;$('#format-link span').textContent=data.cta;$('#format-link').href=data.url;
    if(!keyboard)motion($('#format-copy'),[{opacity:.4,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}]);
    const image=new Image();image.src=data.image;
    try{await image.decode();}catch{return;}
    if(token!==formatToken)return;
    $('#format-image').src=data.image;$('#format-image').alt=data.alt;
    if(!keyboard)motion($('#format-image'),body.dataset.style==='sport'?[{opacity:.6,transform:'translateX(12px)'},{opacity:1,transform:'translateX(0)'}]:[{opacity:.4},{opacity:1}]);
  }
  $$('[data-format]').forEach((t,index)=>{
    t.addEventListener('click',e=>setFormat(t.dataset.format,e.detail===0));
    t.addEventListener('keydown',e=>{const tabs=$$('[data-format]');let i;
      if(e.key==='ArrowRight')i=(index+1)%tabs.length;if(e.key==='ArrowLeft')i=(index+tabs.length-1)%tabs.length;if(e.key==='Home')i=0;if(e.key==='End')i=tabs.length-1;
      if(i!==undefined){e.preventDefault();tabs[i].focus();setFormat(tabs[i].dataset.format,true);}
    });
  });
  $$('.faq button').forEach(b=>b.addEventListener('click',()=>{
    const f=b.closest('.faq'),a=f.querySelector('.answer'),open=b.getAttribute('aria-expanded')!=='true';
    b.setAttribute('aria-expanded',String(open));f.classList.toggle('is-open',open);a.inert=!open;a.style.height=open?a.firstElementChild.scrollHeight+'px':'0px';b.querySelector('.faq-label').textContent=open?'Скрыть':'Читать';
  }));
  new ResizeObserver(()=>{$$('.faq.is-open .answer').forEach(a=>a.style.height=a.firstElementChild.scrollHeight+'px');}).observe($('.faq-list'));
  const albums={
    club:{title:'Клуб',images:['assets/club-entrance.jpg','assets/club-interior/584A3247.webp','assets/club-interior/584A3156.webp','assets/club-interior/584A3217.webp','assets/club-interior/584A3298.webp']},
    people:{title:'Наши люди',images:['assets/club-community.jpg','assets/club-people/HAN08291.jpg','assets/club-people/HAN08735.jpg','assets/club-people/HAN08757.jpg','assets/club-people/HAN08300.jpg','assets/club-people/HAN08342.jpg']},
    tournament:{title:'Турниры клуба',images:['assets/club-awards.jpg','assets/club-tournament/HAN05462.jpg','assets/club-tournament/HAN05530.jpg','assets/club-tournament/HAN05557.jpg','assets/club-tournament/HAN05583.jpg','assets/club-tournament/HAN05637.jpg','assets/club-tournament/HAN05743.jpg','assets/club-tournament/HAN05763.jpg','assets/club-tournament/HAN05892.jpg']}
  };
  const dialog=$('.album-dialog');let album=null,photoIndex=0,photoToken=0,opener=null,overflow='';
  async function showPhoto(index,direction=0,keyboard=false){
    const token=++photoToken;photoIndex=(index+album.images.length)%album.images.length;
    const src=album.images[photoIndex],img=$('#album-image');$('.photo-loading').hidden=false;$('#photo-error').hidden=true;img.style.visibility='hidden';
    $$('.thumbs button').forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===photoIndex));if(i===photoIndex)b.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});});
    const preload=new Image();preload.src=src;
    try {await preload.decode();if(token!==photoToken||!dialog.open)return;
      img.src=src;img.alt=album.title+', фото '+(photoIndex+1);img.style.visibility='visible';$('.photo-loading').hidden=true;
      $('#photo-status').textContent=album.title+': фото '+(photoIndex+1)+' из '+album.images.length;
      if(!keyboard)motion(img,[{opacity:.3,transform:`translateX(${direction*28}px)`},{opacity:1,transform:'translateX(0)'}],220);
      const next=new Image();next.src=album.images[(photoIndex+1)%album.images.length];
    }catch{if(token!==photoToken||!dialog.open)return;$('.photo-loading').hidden=true;$('#photo-error').hidden=false;$('#photo-status').textContent='Фото не загрузилось';}
  }
  $$('[data-album]').forEach(b=>b.addEventListener('click',e=>{
    opener=b;album=albums[b.dataset.album];$('#album-name').textContent=album.title;
    $('.thumbs').replaceChildren(...album.images.map((src,i)=>{const button=document.createElement('button'),image=document.createElement('img');button.type='button';button.setAttribute('aria-label',album.title+', фото '+(i+1));button.setAttribute('aria-pressed','false');image.src=src;image.alt='';image.loading='lazy';button.append(image);button.addEventListener('click',e=>showPhoto(i,Math.sign(i-photoIndex),e.detail===0));return button;}));
    overflow=body.style.overflow;body.style.overflow='hidden';dialog.showModal();showPhoto(0);if(e.detail!==0)motion(dialog,[{opacity:0,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}]);
  }));
  function closeAlbum(){dialog.close();}
  $('#close-album').addEventListener('click',closeAlbum);
  dialog.addEventListener('close',()=>{++photoToken;body.style.overflow=overflow;if(opener)opener.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeAlbum();}});
  $('.prev').addEventListener('click',e=>showPhoto(photoIndex-1,-1,e.detail===0));$('.next').addEventListener('click',e=>showPhoto(photoIndex+1,1,e.detail===0));
  $('#retry-photo').addEventListener('click',()=>showPhoto(photoIndex));
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const d=e.key==='ArrowRight'?1:-1;showPhoto(photoIndex+d,d,true);}});
  let touch=null;$('.photo-holder').addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&e.isPrimary)touch={x:e.clientX,y:e.clientY};});
  $('.photo-holder').addEventListener('pointerup',e=>{if(!touch)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)showPhoto(photoIndex+(dx<0?1:-1),dx<0?1:-1);});
  $('.photo-holder').addEventListener('pointercancel',()=>touch=null);
  if('IntersectionObserver' in window){body.classList.add('js');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}
  $('#replay').addEventListener('click',e=>{const scene=$('.scroll-scene');scene.classList.add('is-visible');if(reduced())return;const type=body.dataset.style;
    motion(scene,type==='sport'?[{opacity:.3,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0 0 0 0)'}]:type==='rally'?[{opacity:0,transform:'translateY(28px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}]:[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],600);
  });
})();
