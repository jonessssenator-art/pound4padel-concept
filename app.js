const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
const tabs=[...document.querySelectorAll('.play [role=tab]')];
function selectTab(tab,animate=true){const format=tab.id.replace("tab-","");document.querySelector(".play-experience").dataset.format=format;document.querySelectorAll('[data-scene]').forEach(img=>{const active=img.dataset.scene===format;img.classList.toggle('is-active',active);img.setAttribute('aria-hidden',String(!active));});tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});const panel=document.getElementById(tab.getAttribute('aria-controls'));panel.getAnimations().forEach(a=>a.cancel());if(animate&&!reduced.matches)panel.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.23,1,.32,1)'});}
tabs.forEach((tab,i)=>{tab.addEventListener('click',e=>selectTab(tab,e.detail>0));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectTab(tabs[n],false);tabs[n].focus();}});});
function animateIntro(){if(reduced.matches)return;document.querySelectorAll('.hero h1 span').forEach((el,i)=>el.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,delay:100+i*80,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'}));}
document.fonts.ready.then(animateIntro);
let ticking=false;const energy=document.querySelector('.energy');const balls=document.querySelector('.balls-photo');
function paintScroll(){ticking=false;if(reduced.matches||!energy||!balls)return;const rect=energy.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){const progress=Math.max(-1,Math.min(1,(innerHeight/2-(rect.top+rect.height/2))/innerHeight));balls.style.transform=`translateY(${progress*32}px) scale(1.055)`;}}
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(paintScroll);}},{passive:true});
reduced.addEventListener('change',()=>{if(balls)balls.style.transform='none';});
// Product controls preserve complete, uncropped source images.
const viewer=document.querySelector('.image-dialog');let viewerTrigger;
const interiorItems=[
 {src:'assets/club-interior/584A3126.webp',caption:'Вход в клуб'},
 {src:'assets/club-interior/584A3202.webp',caption:'Экипировка в клубе'},
 {src:'assets/club-interior/584A3144.webp',caption:'Лестница к кортам'},
 {src:'assets/club-interior/584A3156.webp',caption:'Галерея вдоль кортов'},
 {src:'assets/club-interior/584A3247.webp',caption:'Вид на корты с галереи'},
 {src:'assets/club-interior/584A3185.webp',caption:'Места для отдыха у корта'},
 {src:'assets/club-interior/584A3217.webp',caption:'Корт POUND4PADEL'},
 {src:'assets/club-interior/584A3298.webp',caption:'Раздевалка'},
 {src:'assets/club-entrance.jpg',caption:'Вход в POUND4PADEL'}
];
const peopleItems=[
 {src:'assets/club-community.jpg',caption:'Наши люди'},
 {src:'assets/club-people/HAN08291.jpg',caption:'Гости клуба'},
 {src:'assets/club-people/HAN08735.jpg',caption:'Гости POUND4PADEL'},
 {src:'assets/club-people/HAN08757.jpg',caption:'Встречи в клубе'},
 {src:'assets/club-opening.jpg',caption:'Открытие клуба'},
 {src:'assets/club-people/HAN08300.jpg',caption:'Гости клуба'},
 {src:'assets/club-people/HAN08342.jpg',caption:'Встречи в клубе'},
 {src:'assets/club-people/HAN08372.jpg',caption:'Открытие клуба'},
 {src:'assets/club-people/HAN08610.jpg',caption:'Гости на галерее'},
 {src:'assets/club-people/HAN08764.jpg',caption:'Встреча на открытии'}
];
const tournamentItems=[
 {src:'assets/club-awards.jpg',caption:'Награждение участников'},
 {src:'assets/club-tournament/HAN05462.jpg',caption:'Парная игра'},
 {src:'assets/club-tournament/HAN05530.jpg',caption:'Розыгрыш на корте'},
 {src:'assets/club-tournament/HAN05557.jpg',caption:'Участник турнира'},
 {src:'assets/club-tournament/HAN05583.jpg',caption:'Зрители турнира'},
 {src:'assets/club-tournament/HAN05637.jpg',caption:'Игра у сетки'},
 {src:'assets/club-tournament/HAN05743.jpg',caption:'Приём мяча'},
 {src:'assets/club-tournament/HAN05763.jpg',caption:'Матч турнира'},
 {src:'assets/club-tournament/HAN05892.jpg',caption:'Между матчами'}
];
const galleryControls=viewer.querySelector('.gallery-controls');
let galleryIndex=0;
let galleryItems=interiorItems;
function showGallery(index){
 galleryIndex=(index+galleryItems.length)%galleryItems.length;
 const item=galleryItems[galleryIndex];const img=viewer.querySelector('img');
 img.src=item.src;img.alt=item.caption;viewer.querySelector('p').textContent=item.caption;
 viewer.querySelectorAll('[data-gallery-index]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===galleryIndex)));
}
function selectGallery(items){
 galleryItems=items;
 const thumbs=viewer.querySelector('.gallery-thumbs');thumbs.replaceChildren();
 const title=items===interiorItems?'Интерьер клуба':items===tournamentItems?'Турниры клуба':'Наши люди';
 viewer.setAttribute('aria-label',title);thumbs.setAttribute('aria-label','Фотографии: '+title);
 galleryItems.forEach((item,index)=>{const button=document.createElement('button');button.type='button';button.dataset.galleryIndex=index;button.setAttribute('aria-label',item.caption);button.setAttribute('aria-pressed','false');const img=document.createElement('img');img.src=item.src;img.alt='';img.loading='lazy';button.append(img);button.addEventListener('click',()=>showGallery(index));thumbs.append(button);});
}
document.querySelectorAll('.zoom-image').forEach(button=>button.addEventListener('click',()=>{
 viewerTrigger=button;const isGallery=(button.classList.contains('club-story')||button.hasAttribute('data-gallery'));galleryControls.hidden=!isGallery;viewer.classList.toggle('is-gallery',isGallery);
 if(isGallery){selectGallery(tournamentItems.some(item=>item.src===button.dataset.image)?tournamentItems:peopleItems.some(item=>item.src===button.dataset.image)?peopleItems:interiorItems);showGallery(Math.max(0,galleryItems.findIndex(item=>item.src===button.dataset.image)));}else{viewer.setAttribute('aria-label','Просмотр изображения');const img=viewer.querySelector('img');img.src=button.dataset.image;img.alt=button.dataset.caption;viewer.querySelector('p').textContent=button.dataset.caption;}
 viewer.showModal();document.body.style.overflow='hidden';
}));
viewer.querySelectorAll('[data-gallery-step]').forEach(b=>b.addEventListener('click',()=>showGallery(galleryIndex+Number(b.dataset.galleryStep))));
viewer.addEventListener('keydown',e=>{if(galleryControls.hidden)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showGallery(galleryIndex+(e.key==='ArrowRight'?1:-1));}});
let swipeStart=null;
viewer.querySelector('img').addEventListener('touchstart',e=>{swipeStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
viewer.querySelector('img').addEventListener('touchend',e=>{if(!swipeStart||galleryControls.hidden)return;const dx=e.changedTouches[0].clientX-swipeStart.x,dy=e.changedTouches[0].clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showGallery(galleryIndex+(dx<0?1:-1));},{passive:true});
document.querySelectorAll('[data-format-choice]').forEach(a=>a.addEventListener('click',e=>{const tab=document.getElementById('tab-'+a.dataset.formatChoice);if(!tab)return;e.preventDefault();selectTab(tab,e.detail>0);tab.focus({preventScroll:true});document.querySelector('#play').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}));
viewer.querySelector('.dialog-close').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});viewer.addEventListener('close',()=>{document.body.style.overflow='';viewerTrigger?.focus();});
document.querySelectorAll('.view-option').forEach(button=>button.addEventListener('click',async()=>{const img=document.getElementById(button.dataset.target);button.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));img.src=button.dataset.src;img.alt=button.dataset.alt;img.closest('.zoom-image').dataset.image=button.dataset.src;if(button.dataset.label)document.querySelector('#kit-caption').textContent=button.dataset.label;try{await img.decode();}catch{}img.getAnimations().forEach(a=>a.cancel());if(!reduced.matches&&document.documentElement.dataset.input!=='keyboard')img.animate([{opacity:.2,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}],{duration:280,easing:'cubic-bezier(.23,1,.32,1)'});}));
document.querySelector('.detail-point')?.addEventListener('click',e=>{const b=e.currentTarget;const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));document.getElementById(b.getAttribute('aria-controls')).hidden=!open;b.firstElementChild.textContent=open?'−':'+';});
document.querySelectorAll('.space-view').forEach(b=>b.addEventListener('click',async()=>{const img=document.querySelector('.space>img');img.src=b.dataset.src;img.alt=b.textContent==='Открытие'?'Фотография с открытия POUND4PADEL':'Вход в клуб POUND4PADEL';document.querySelectorAll('.space-view').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));try{await img.decode();}catch{}img.getAnimations().forEach(a=>a.cancel());if(!reduced.matches&&document.documentElement.dataset.input!=='keyboard')img.animate([{opacity:.35,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:220,easing:'cubic-bezier(.23,1,.32,1)'});}));
const progress=document.createElement('div');progress.className='progress-bar';progress.setAttribute('aria-hidden','true');document.body.append(progress);
let sceneFrame=false;function updateScenes(){sceneFrame=false;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;if(reduced.matches)return;const scene=document.querySelector('.equipment-scene');if(!scene)return;const r=scene.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const k=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));scene.querySelector('img').style.transform=`scale(${.97+k*.03})`;}}
window.addEventListener('scroll',()=>{if(!sceneFrame){sceneFrame=true;requestAnimationFrame(updateScenes);}},{passive:true});

// A format selected on the home page opens the matching club panel.
const requestedFormat = new URLSearchParams(location.search).get('format');
if (['start','friends','practice'].includes(requestedFormat)) {
  const requestedTab = document.getElementById('tab-' + requestedFormat);
  if (requestedTab) selectTab(requestedTab, false);
}
// Preserve old links into the former one-page visitor guide.
if (document.body.classList.contains('home-page') && ['#play','#first','#availability'].includes(location.hash)) {
  location.replace('club.html' + location.hash);
}
