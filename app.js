const motion = matchMedia('(prefers-reduced-motion: reduce)');
const ease = 'cubic-bezier(.23,1,.32,1)';
const running = new Set();
function animate(element, frames, options = {}) {
  if (motion.matches || !element) return;
  element.getAnimations().forEach(animation => animation.cancel());
  const animation = element.animate(frames, { duration: 240, easing: ease, ...options });
  running.add(animation);
  animation.finished.catch(() => {}).finally(() => running.delete(animation));
  return animation;
}
const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Открыть меню');
}
menu.addEventListener('click', event => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  if (open && event.detail) animate(nav, [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 200 });
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); }
});

const tabs = [...document.querySelectorAll('[role=tab]')];
const captions = ['Четверо на корте. Ты в игре.', 'Своя компания. Общий азарт.', 'Каждый розыгрыш - шаг вперёд.'];
const board = document.querySelector('.court-lines');
const ball = document.querySelector('.ball');
let selectedFormat = 0;
function rally() {
  if (motion.matches) return;
  const width = board.clientWidth;
  const height = board.clientHeight;
  // Coordinates stay inside the responsive court; one rally, never an endless loop.
  const routes = [
    [[.43,.36],[.83,.72],[.14,.27],[.88,.24],[.18,.74],[.43,.36]],
    [[.43,.36],[.15,.27],[.81,.7],[.2,.72],[.85,.25],[.43,.36]],
    [[.43,.36],[.84,.25],[.23,.34],[.82,.68],[.23,.34],[.43,.36]]
  ];
  animate(ball, routes[selectedFormat].map(([x,y]) => ({ transform: `translate(${(x-.43)*width}px, ${(y-.36)*height}px)` })), { duration: 2400, easing: 'linear' });
  document.querySelectorAll('.player').forEach((player, i) => {
    const dx = (i % 2 ? -1 : 1) * width * .045;
    const dy = (i < 2 ? 1 : -1) * height * .07;
    animate(player, [{ transform: 'translate(0,0)' }, { transform: `translate(${dx}px,${dy}px)`, offset: .35 }, { transform: `translate(${-dx/2}px,${-dy/2}px)`, offset: .7 }, { transform: 'translate(0,0)' }], { duration: 2400, delay: i * 50 });
  });
}
function activate(tab, withMotion = true) {
  if (tab.getAttribute('aria-selected') === 'true') return;
  tabs.forEach(t => {
    const active = t === tab;
    t.setAttribute('aria-selected', String(active));
    t.tabIndex = active ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !active;
  });
  selectedFormat = tabs.indexOf(tab);
  document.querySelector('#court-caption').textContent = captions[selectedFormat];
  if (withMotion) {
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    animate(panel, [{ opacity: .3, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 240 });
    rally();
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', event => activate(tab, event.detail !== 0));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); tabs[next].focus(); activate(tabs[next], false); }
  });
});
const replay = document.createElement('button');
replay.className = 'rally-replay';
replay.textContent = 'Сыграть розыгрыш';
replay.addEventListener('click', rally);
document.querySelector('.court-board').append(replay);

// Content remains readable without JavaScript or if observers are unavailable.
const revealTargets = document.querySelectorAll('.intro h2, .intro > div, .section-top h2, .space .section-top > div, .space-photo img, .space-bottom > *, .first h2, .questions, .closing h2, .closing > div');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (entry.target.matches('h2')) {
        animate(entry.target, [{ clipPath: 'inset(0 0 100% 0)', transform: 'translateY(24px)' }, { clipPath: 'inset(0 0 0% 0)', transform: 'none' }], { duration: 750 });
      } else if (entry.target.matches('img')) {
        animate(entry.target, [{ transform: 'scale(1.045)', opacity: .65 }, { transform: 'scale(1)', opacity: 1 }], { duration: 1000 });
      } else {
        animate(entry.target, [{ opacity: .25, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 650 });
      }
    });
  }, { threshold: .15 });
  revealTargets.forEach(element => observer.observe(element));
  const courtObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { rally(); courtObserver.disconnect(); }
  }, { threshold: .6 });
  courtObserver.observe(board);
}

document.querySelectorAll('.questions details').forEach(details => {
  details.addEventListener('toggle', () => {
    if (details.open) animate(details.querySelector('p'), [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 200 });
  });
});

function stopMotion() { running.forEach(animation => animation.cancel()); running.clear(); }
motion.addEventListener('change', () => { if (motion.matches) stopMotion(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stopMotion(); });

const hero = document.querySelector('.hero');
const video = document.querySelector('.hero-video');
const videoToggle = document.querySelector('.video-toggle');
const videoLabel = videoToggle.querySelector('span');
const videoIcon = videoToggle.querySelector('path');
let userPaused = false;
let userRequested = false;
let inView = true;
let videoFailed = false;
let playPending = false;
const connection = navigator.connection;
function wantsVideo() {
  return !videoFailed && !userPaused && inView && !document.hidden &&
    (userRequested || (!motion.matches && !connection?.saveData));
}
function renderVideoControl() {
  const playing = !video.paused;
  videoLabel.textContent = playing ? 'Пауза' : 'Смотреть видео';
  videoToggle.setAttribute('aria-label', playing ? 'Приостановить фоновое видео' : 'Включить фоновое видео');
  videoIcon.setAttribute('d', playing ? 'M8 5v14M16 5v14' : 'M8 5l11 7-11 7V5Z');
}
async function syncVideo() {
  if (!wantsVideo()) { video.pause(); renderVideoControl(); return; }
  if (playPending || !video.paused) return;
  if (!video.getAttribute('src')) video.src = video.dataset.src;
  video.muted = true;
  playPending = true;
  try {
    await video.play();
    if (!wantsVideo()) video.pause();
  } catch { /* Autoplay can be blocked; keep the photograph and manual play control. */ }
  finally { playPending = false; renderVideoControl(); }
}
videoToggle.hidden = false;
videoToggle.addEventListener('click', () => {
  if (!video.paused || playPending) { userPaused = true; video.pause(); }
  else { userPaused = false; userRequested = true; }
  syncVideo();
});
video.addEventListener('playing', () => { hero.classList.add('has-video'); renderVideoControl(); });
video.addEventListener('pause', renderVideoControl);
video.addEventListener('error', () => {
  videoFailed = true;
  hero.classList.remove('has-video');
  videoToggle.hidden = true;
});
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    syncVideo();
  }, { threshold: .05 }).observe(hero);
}
motion.addEventListener('change', () => { userRequested = false; syncVideo(); });
connection?.addEventListener('change', syncVideo);
document.addEventListener('visibilitychange', syncVideo);
renderVideoControl();
syncVideo();
