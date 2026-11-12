(() => {
  const variant = document.body.dataset.variant;
  if (!variant) return;
  document.querySelectorAll('.review-bar nav a').forEach(a => {if(a.getAttribute('href') === variant + '.html')a.setAttribute('aria-current','page');});
  const toggle = document.querySelector('.motion-toggle');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px) and (pointer: fine)');
  let paused=false, context, lenis, tick, net, ballTimeline, generation=0;
  const scriptPromises=new Map();
  function script(src){if(!scriptPromises.has(src))scriptPromises.set(src,new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.append(s);}));return scriptPromises.get(src);}
  function stop(){generation++;context?.revert();context=null;ballTimeline=null;if(tick&&window.gsap)gsap.ticker.remove(tick);tick=null;lenis?.destroy();lenis=null;net?.destroy();net=null;}
  async function setup(){
    stop(); const version=generation;
    const off=paused||reduce.matches;
    toggle.setAttribute('aria-pressed',String(off));toggle.textContent=off?'Включить движение':'Без движения';
    toggle.disabled=reduce.matches;if(reduce.matches)toggle.textContent='Движение отключено системой';
    document.querySelector('.replay')?.toggleAttribute('hidden',off);
    if(off||!window.gsap||!window.ScrollTrigger)return;
    gsap.registerPlugin(ScrollTrigger);
    if(desktop.matches&&window.Lenis){lenis=new Lenis({lerp:.1,smoothWheel:true,syncTouch:false,anchors:true});lenis.on('scroll',ScrollTrigger.update);tick=t=>lenis?.raf(t*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);}
    context=gsap.context(()=>{
      gsap.from('.hero h1',{y:24,opacity:.35,duration:.8,ease:'power3.out'});
      if(variant==='character'){
        if(desktop.matches)gsap.to('.portrait-photo',{yPercent:8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
        gsap.fromTo('.club-image',{clipPath:'inset(0% 8% 0% 8% round 12px)'},{clipPath:'inset(0% 0% 0% 0% round 12px)',ease:'none',scrollTrigger:{trigger:'.club-image',start:'top 90%',end:'top 25%',scrub:true}});
      }
      if(variant==='serve'){
        ballTimeline=gsap.timeline({delay:.2}).fromTo('.ball-small',{y:-100},{y:0,duration:1.3,ease:'bounce.out'}).from('.ball-left',{x:-35,rotation:-4,transformOrigin:'50% 80%',duration:1,ease:'power3.out'},0).from('.ball-right',{x:35,rotation:3,transformOrigin:'50% 80%',duration:1,ease:'power3.out'},0);
        if(desktop.matches)gsap.to('.ball-scene',{y:80,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
      }
      if(variant==='equipment')gsap.from('.racket',{y:35,rotation:-5,duration:1,ease:'power3.out'});
    });
    if(variant==='equipment'&&desktop.matches){
      try{await script('vendor/three.min.js');await script('vendor/vanta.net.min.js');if(version!==generation||paused||reduce.matches||!desktop.matches)return;net=VANTA.NET({el:'#net',THREE:window.THREE,mouseControls:true,touchControls:false,gyroControls:false,color:0x7e8b8d,backgroundColor:0xe8e4da,points:5,maxDistance:22,spacing:20,showDots:false,scale:1.5});}catch(e){document.querySelector('#net').dataset.fallback='true';}
    }
    ScrollTrigger.refresh();
  }
  toggle.addEventListener('click',()=>{paused=!paused;setup();});
  document.querySelector('.replay')?.addEventListener('click',()=>ballTimeline?.restart());
  reduce.addEventListener('change',setup);desktop.addEventListener('change',setup);
  document.querySelectorAll('[data-kit]').forEach(button=>button.addEventListener('click',async()=>{
    const img=document.querySelector('#kit-photo');document.querySelectorAll('[data-kit]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    img.src='../assets/'+button.dataset.kit;img.alt=(button.dataset.kit==='kit.jpeg'?'Бежевая':'Синяя')+' форма POUND4PADEL';
    try{await img.decode();}catch{}
    if(!paused&&!reduce.matches)img.animate([{opacity:.5},{opacity:1}],{duration:220,easing:'ease-out'});
  }));
  // Keep keyboard focus and native anchors visible with or without smooth scrolling.
  document.addEventListener('keydown',e=>{if(e.key==='Tab')lenis?.stop();});
  document.addEventListener('pointerdown',()=>lenis?.start());
  document.addEventListener('wheel',()=>lenis?.start(),{passive:true});
  addEventListener('pagehide',stop);addEventListener('pageshow',e=>{if(e.persisted)setup();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){net?.destroy();net=null;}else if(variant==='equipment')setup();});
  document.fonts.ready.then(setup);
})();
