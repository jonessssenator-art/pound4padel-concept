const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab){const format=tab.id.replace("tab-","");document.querySelector(".play-experience").dataset.format=format;document.querySelectorAll('[data-scene]').forEach(img=>{const active=img.dataset.scene===format;img.classList.toggle('is-active',active);img.setAttribute('aria-hidden',String(!active));});tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});const panel=document.getElementById(tab.getAttribute('aria-controls'));if(!reduced.matches)panel.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.23,1,.32,1)'});}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectTab(tabs[n]);tabs[n].focus();}});});
function animateIntro(){if(reduced.matches)return;document.querySelectorAll('.hero h1 span').forEach((el,i)=>el.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,delay:100+i*80,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'}));}
document.fonts.ready.then(animateIntro);
let ticking=false;const energy=document.querySelector('.energy');const balls=document.querySelector('.balls-photo');
function paintScroll(){ticking=false;if(reduced.matches)return;const rect=energy.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){const progress=Math.max(-1,Math.min(1,(innerHeight/2-(rect.top+rect.height/2))/innerHeight));balls.style.transform=`translateY(${progress*32}px) scale(1.055)`;}}
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(paintScroll);}},{passive:true});
reduced.addEventListener('change',()=>{balls.style.transform='none';});
// Product controls preserve complete, uncropped source images.
const viewer=document.querySelector('.image-dialog');let viewerTrigger;
const galleryItems=[
 {src:'assets/club-community.jpg',caption:'Наши люди'},
 {src:'assets/club-awards.jpg',caption:'Турнир POUND4PADEL'},
 {src:'assets/club-opening.jpg',caption:'Открытие клуба'},
 {src:'assets/club-entrance.jpg',caption:'Вход в POUND4PADEL'}
];
const galleryControls=viewer.querySelector('.gallery-controls');
let galleryIndex=0;
function showGallery(index){
 galleryIndex=(index+galleryItems.length)%galleryItems.length;
 const item=galleryItems[galleryIndex];const img=viewer.querySelector('img');
 img.src=item.src;img.alt=item.caption;viewer.querySelector('p').textContent=item.caption;
 viewer.querySelectorAll('[data-gallery-index]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===galleryIndex)));
}
galleryItems.forEach((item,index)=>{const button=document.createElement('button');button.type='button';button.dataset.galleryIndex=index;button.setAttribute('aria-label',item.caption);button.setAttribute('aria-pressed','false');const img=document.createElement('img');img.src=item.src;img.alt='';img.loading='lazy';button.append(img);button.addEventListener('click',()=>showGallery(index));viewer.querySelector('.gallery-thumbs').append(button);});
document.querySelectorAll('.zoom-image').forEach(button=>button.addEventListener('click',()=>{
 viewerTrigger=button;const isGallery=button.classList.contains('club-story');galleryControls.hidden=!isGallery;viewer.classList.toggle('is-gallery',isGallery);
 if(isGallery){showGallery(galleryItems.findIndex(item=>item.src===button.dataset.image));}else{const img=viewer.querySelector('img');img.src=button.dataset.image;img.alt=button.dataset.caption;viewer.querySelector('p').textContent=button.dataset.caption;}
 viewer.showModal();document.body.style.overflow='hidden';
}));
viewer.querySelectorAll('[data-gallery-step]').forEach(b=>b.addEventListener('click',()=>showGallery(galleryIndex+Number(b.dataset.galleryStep))));
viewer.addEventListener('keydown',e=>{if(galleryControls.hidden)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showGallery(galleryIndex+(e.key==='ArrowRight'?1:-1));}});
let swipeStart=null;
viewer.querySelector('img').addEventListener('touchstart',e=>{swipeStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
viewer.querySelector('img').addEventListener('touchend',e=>{if(!swipeStart||galleryControls.hidden)return;const dx=e.changedTouches[0].clientX-swipeStart.x,dy=e.changedTouches[0].clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showGallery(galleryIndex+(dx<0?1:-1));},{passive:true});
document.querySelectorAll('[data-format-choice]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const tab=document.getElementById('tab-'+a.dataset.formatChoice);selectTab(tab);tab.focus({preventScroll:true});document.querySelector('#play').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}));
viewer.querySelector('.dialog-close').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});viewer.addEventListener('close',()=>{document.body.style.overflow='';viewerTrigger?.focus();});
document.querySelectorAll('.view-option').forEach(button=>button.addEventListener('click',async()=>{const img=document.getElementById(button.dataset.target);button.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));img.src=button.dataset.src;img.alt=button.dataset.alt;img.closest('.zoom-image').dataset.image=button.dataset.src;if(button.dataset.label)document.querySelector('#kit-caption').textContent=button.dataset.label;try{await img.decode();}catch{}if(!reduced.matches)img.animate([{opacity:.2,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}],{duration:280,easing:'cubic-bezier(.23,1,.32,1)'});}));
document.querySelector('.detail-point').addEventListener('click',e=>{const b=e.currentTarget;const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));document.getElementById(b.getAttribute('aria-controls')).hidden=!open;b.firstElementChild.textContent=open?'−':'+';});
document.querySelectorAll('.space-view').forEach(b=>b.addEventListener('click',async()=>{const img=document.querySelector('.space>img');img.src=b.dataset.src;img.alt=b.textContent==='Открытие'?'Фотография с открытия POUND4PADEL':'Вход в клуб POUND4PADEL';document.querySelectorAll('.space-view').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));try{await img.decode();}catch{}if(!reduced.matches)img.animate([{opacity:.35,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:500,easing:'cubic-bezier(.23,1,.32,1)'});}));
const progress=document.createElement('div');progress.className='progress-bar';progress.setAttribute('aria-hidden','true');document.body.append(progress);
let sceneFrame=false;function updateScenes(){sceneFrame=false;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;if(reduced.matches)return;const scene=document.querySelector('.equipment-scene');const r=scene.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const k=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));scene.querySelector('img').style.transform=`scale(${.97+k*.03})`;}}
window.addEventListener('scroll',()=>{if(!sceneFrame){sceneFrame=true;requestAnimationFrame(updateScenes);}},{passive:true});
const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;revealObserver.unobserve(entry.target);if(!reduced.matches)entry.target.animate([{opacity:.35,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.23,1,.32,1)'});}},{threshold:.18});document.querySelectorAll('.product-window, .women-heading, .women-bottom').forEach(el=>revealObserver.observe(el));
