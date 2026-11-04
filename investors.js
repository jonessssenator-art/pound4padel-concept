// Independent from the game format selector.
const investorTabs = [...document.querySelectorAll('.investor-options [role="tab"]')];
function selectInvestorTab(selected, animate = false) {
  if (selected.getAttribute("aria-selected") === "true") return;
  document.querySelectorAll(".investor-panel").forEach(panel => panel.getAnimations().forEach(a => a.cancel()));
  investorTabs.forEach(tab => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
  const panel = document.getElementById(selected.getAttribute("aria-controls"));
  if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    panel.animate([{opacity:.55},{opacity:1}], {duration:180,easing:"cubic-bezier(.23,1,.32,1)"});
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
