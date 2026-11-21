(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const controls = document.querySelectorAll('.ui-button,.game-dock a,.page-jumps a,.view-option');
  controls.forEach(button => {
    if(getComputedStyle(button).position==='static')button.style.position='relative';
    button.classList.add('motion-control');
    button.addEventListener('pointerdown', event => {
      if(reduce.matches || event.button !== 0 || button.matches(':disabled,[aria-disabled=true]')) return;
      const rect = button.getBoundingClientRect();
      const size = Math.hypot(rect.width,rect.height)*2;
      const ripple = document.createElement('span');
      ripple.className = 'motion-ripple'; ripple.setAttribute('aria-hidden','true');
      Object.assign(ripple.style,{width:`${size}px`,height:`${size}px`,left:`${event.clientX-rect.left-size/2}px`,top:`${event.clientY-rect.top-size/2}px`});
      button.querySelectorAll('.motion-ripple').forEach(el=>el.remove());
      button.append(ripple); ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});
    });
  });
  // Individual translate leaves the header's existing positioning transform intact.
  const magnetic = document.querySelector('.header-cta');
  let frame=0, x=0, y=0, vx=0, vy=0, tx=0, ty=0, time=0;
  function reset(){cancelAnimationFrame(frame);frame=0;x=y=vx=vy=tx=ty=time=0;if(magnetic)magnetic.style.translate='';}
  function spring(now){
    const dt=Math.min((now-(time||now-16))/1000,.032);time=now;
    vx+=(100*(tx-x)-10*vx)*dt;vy+=(100*(ty-y)-10*vy)*dt;x+=vx*dt;y+=vy*dt;
    magnetic.style.translate=`${x}px ${y}px`;
    if(Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(vx)+Math.abs(vy)>.05)frame=requestAnimationFrame(spring);
    else {frame=0;time=0;magnetic.style.translate=`${tx}px ${ty}px`;}
  }
  function start(){if(!frame)frame=requestAnimationFrame(spring);}
  magnetic?.addEventListener('pointermove',event=>{
    if(!fine.matches||reduce.matches||event.pointerType!=='mouse')return;
    const r=magnetic.getBoundingClientRect();
    tx=Math.max(-5,Math.min(5,(event.clientX-r.left-r.width/2+x)*.12));
    ty=Math.max(-4,Math.min(4,(event.clientY-r.top-r.height/2+y)*.12));start();
  });
  magnetic?.addEventListener('pointerleave',()=>{tx=ty=0;if(!reduce.matches)start();else reset();});
  magnetic?.addEventListener('blur',reset);
  document.addEventListener('keydown',reset,true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
  fine.addEventListener('change',reset);reduce.addEventListener('change',reset);

  // Enhance the existing disclosure menu and keep its Escape/link handling.
  const nav=document.querySelector('#navigation'), menu=document.querySelector('.menu');
  if(nav&&menu&&document.documentElement.dataset.chrome==='compact'){
    nav.classList.add('motion-nav');
    function sync(){nav.inert=menu.getAttribute('aria-expanded')!=='true';}
    menu.addEventListener('click',event=>{if(event.detail===0&&menu.getAttribute('aria-expanded')==='true'){nav.inert=false;nav.querySelector('a')?.focus();}});
    sync();new MutationObserver(sync).observe(menu,{attributes:true,attributeFilter:['aria-expanded']});
    document.addEventListener('pointerdown',event=>{if(menu.getAttribute('aria-expanded')==='true'&&!event.target.closest('.header'))closeMenu();});
    document.querySelector('.header').addEventListener('focusout',()=>queueMicrotask(()=>{if(!document.activeElement.closest('.header'))closeMenu();}));
  }
  // A single photo opens with scroll. No pinned section or artificial scroll distance.
  const reveal=document.querySelector('.motion-reveal');
  if(reveal){
    let queued=false;
    function paint(){queued=false;
      if(reduce.matches||document.documentElement.dataset.input==='keyboard'){reveal.style.transform='';reveal.style.clipPath='';return;}
      const r=reveal.parentElement.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(innerHeight*.95-r.top)/(innerHeight*.75)));
      const mobile=innerWidth<=650,scale=(mobile?.94:.82)+(mobile?.06:.18)*progress;
      reveal.style.transform=`scale(${scale})`;
      reveal.style.clipPath=`inset(0 ${(1-progress)*(mobile?2:7)}% round 12px)`;
    }
    function schedule(){if(!queued){queued=true;requestAnimationFrame(paint);}}
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduce.addEventListener('change',schedule);
    document.addEventListener('keydown',schedule);document.fonts.ready.then(schedule);paint();
  }
  document.querySelectorAll('.motion-gallery').forEach(gallery=>{
    const items=[...gallery.querySelectorAll('.motion-frame')];
    const select=item=>items.forEach(el=>el.classList.toggle('is-active',el===item));
    items.forEach(item=>{
      item.addEventListener('pointerenter',()=>{if(fine.matches)select(item);});
      item.addEventListener('focus',()=>select(item));
    });
    gallery.addEventListener('keydown',event=>{
      const index=items.indexOf(document.activeElement);if(index<0)return;
      const target=event.key==='ArrowRight'?items[(index+1)%items.length]:event.key==='ArrowLeft'?items[(index+items.length-1)%items.length]:null;
      if(target){event.preventDefault();target.focus({preventScroll:true});target.scrollIntoView({block:'nearest',inline:'center',behavior:'instant'});}
    });
  });
})();
