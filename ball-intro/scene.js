const bounce = document.querySelector('.bounce');
const pause = document.querySelector('#pause');
let paused = false;
function syncPause(){document.body.classList.toggle('paused',paused || document.hidden);pause.textContent=paused?'Продолжить':'Пауза';pause.setAttribute('aria-pressed',String(paused));}
document.querySelector('#replay').addEventListener('click',()=>{paused=false;syncPause();bounce.style.animation='none';void bounce.getBoundingClientRect();bounce.style.animation='';});
pause.addEventListener('click',()=>{paused=!paused;syncPause();});
document.addEventListener('visibilitychange',syncPause);
Promise.all([...document.images].map(img=>img.decode().catch(()=>{}))).then(()=>{bounce.style.animation='none';requestAnimationFrame(()=>requestAnimationFrame(()=>{bounce.style.animation='';}));});
