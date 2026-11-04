// Independent from the game format selector.
const investorTabs = [...document.querySelectorAll('.investor-options [role="tab"]')];
function selectInvestorTab(selected, animate = false) {
  if (selected.getAttribute("aria-selected") === "true") return;
  document.querySelectorAll(".investor-panel").forEach(panel => panel.getAnimations({subtree:true}).forEach(a => a.cancel()));
  investorTabs.forEach(tab => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
  const panel = document.getElementById(selected.getAttribute("aria-controls"));
  if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const easing = getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim() || 'cubic-bezier(.23,1,.32,1)';
    panel.querySelector('figure').animate([{opacity:.45,transform:'scale(.98)'},{opacity:1,transform:'scale(1)'}], {duration:220,easing});
    panel.querySelector('.investor-description').animate([{opacity:.4,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}], {duration:220,easing});
  }
}
investorTabs.forEach((tab, index) => {
  tab.addEventListener('click', event => selectInvestorTab(tab, event.detail > 0));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % investorTabs.length;
    if (event.key === 'ArrowLeft') next = (index + investorTabs.length - 1) % investorTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = investorTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectInvestorTab(investorTabs[next]);
    investorTabs[next].focus();
  });
});
