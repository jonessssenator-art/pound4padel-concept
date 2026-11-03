const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
const tabs=[...document.querySelectorAll('[role=tab]')];
const captions=['Четверо на корте. Ты в игре.','Своя компания. Общий азарт.','Каждый розыгрыш - шаг вперёд.'];
function activate(tab){
 tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});
 const index=tabs.indexOf(tab);document.querySelector('#court-caption').textContent=captions[index];
 document.querySelector('.p1').style.transform=index===2?'translate(32px, 12px)':index===1?'translate(8px, 16px)':'';
 document.querySelector('.p4').style.transform=index===2?'translate(-18px, -24px)':'';
 document.querySelector('.ball').style.transform=index===2?'translate(24px, 14px)':index===1?'translate(-22px, 30px)':'';
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();activate(tabs[next]);}});});
