(() => {
 const section=document.querySelector('.complex-overview');
 if(!section)return;
 const tabs=[...section.querySelectorAll('[role=tab]')];
 const panels=[...section.querySelectorAll('[role=tabpanel]')];
 const scene=section.querySelector('.complex-scene');
 const img=scene.querySelector('img');
 const label=scene.querySelector('.complex-scene-label');
 const labels=['Входная зона','Сервисный блок','Второй этаж','Фасады комплекса'];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function select(index,animate=false){
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});
  scene.dataset.zone=index;
  label.textContent=labels[index];
  section.querySelector('.complex-caption').textContent=index===3?'Исходные виды фасада. Размещение вывесок требует согласования.':'Концепция на 7 кортов. Выделение показывает общий блок, а не точные границы помещений.';
  img.src=index===3?'assets/investor-document/page-1.webp':'assets/investor-7-straight.webp';
  img.alt=index===3?'Четыре архитектурных вида фасада POUND4PADEL':'Концепция на 7 кортов: '+labels[index];
  const link=scene.querySelector('a');link.href=index===3?'#document-page-1':'#document-page-5';link.textContent=index===3?'Рассмотреть фасады':'Посмотреть планировку';
  panels.forEach(p=>p.getAnimations().forEach(a=>a.cancel()));
  if(animate&&!reduced.matches)panels[index].animate([{opacity:.3,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing:'cubic-bezier(.23,1,.32,1)'});
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',e=>select(i,e.detail>0));
  tab.addEventListener('keydown',e=>{
   let next;
   if(e.key==='ArrowRight')next=(i+1)%tabs.length;
   if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
   if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;
   if(next!==undefined){e.preventDefault();select(next);tabs[next].focus();}
  });
 });
 const steps=[...document.querySelectorAll('.route-step')];
 const observer=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
  if(visible.length){const active=visible[0].target;steps.forEach(s=>s.classList.toggle('is-active',s===active));const track=document.querySelector('.route-steps');track.style.setProperty('--route-progress',String(Math.max(0,Math.min(1,(active.offsetTop+12)/(track.clientHeight-55)))));}
 },{rootMargin:'-20% 0px -35% 0px',threshold:[0,.25,.5,.75]});
 steps.forEach(step=>observer.observe(step));
})();
