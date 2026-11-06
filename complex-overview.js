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
  img.src=index===3?'assets/investor-document/page-1.webp?v=2':'assets/investor-7-straight.webp';
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
 const route=document.querySelector('.project-route');
 const steps=[...route.querySelectorAll('.route-step')];
 steps.forEach(step=>step.classList.remove('is-active'));
 const ns='http://www.w3.org/2000/svg';
 const svg=document.createElementNS(ns,'svg');
 svg.classList.add('route-arrows');svg.setAttribute('aria-hidden','true');
 const lines=steps.map((step,i)=>{
  const group=document.createElementNS(ns,'g');
  group.style.setProperty('--arrow-delay',i*600+'ms');
  const line=document.createElementNS(ns,'path');
  line.classList.add('route-arrow-line');line.setAttribute('pathLength','1');
  const tip=document.createElementNS(ns,'path');tip.classList.add('route-arrow-tip');
  group.append(line,tip);svg.append(group);return {line,tip};
 });
 route.prepend(svg);
 function layout(){
  const box=route.getBoundingClientRect();
  const title=route.querySelector('.route-title').getBoundingClientRect();
  const heading=route.querySelector('.route-title h2').getBoundingClientRect();
  const mobile=matchMedia('(max-width:800px)').matches;
  svg.setAttribute('viewBox','0 0 '+box.width+' '+box.height);
  const x=mobile?title.left-box.left+5:heading.right-box.left+18;
  const y=mobile?title.bottom-box.top+18:heading.top-box.top+heading.height/2;
  lines.forEach(({line,tip},i)=>{
   const target=steps[i].querySelector('h3').getBoundingClientRect();
   const tx=target.left-box.left-18,ty=target.top-box.top+target.height/2;
   const d=mobile
    ? 'M '+x+' '+y+' V '+(ty-12)+' Q '+x+' '+ty+' '+(x+12)+' '+ty+' H '+tx
    : 'M '+x+' '+y+' C '+(x+(tx-x)*.5)+' '+y+' '+(x+(tx-x)*.5)+' '+ty+' '+tx+' '+ty;
   line.setAttribute('d',d);
   tip.setAttribute('d','M '+(tx-7)+' '+(ty-5)+' L '+tx+' '+ty+' L '+(tx-7)+' '+(ty+5));
  });
 }
 const resize=new ResizeObserver(layout);resize.observe(route);resize.observe(route.querySelector('.route-title'));
 document.fonts.ready.then(layout);layout();
 const reveal=new IntersectionObserver(entries=>{
  if(entries.some(e=>e.isIntersecting)){route.classList.add('arrows-visible');reveal.disconnect();}
 },{threshold:.15});
 reveal.observe(route);
})();
