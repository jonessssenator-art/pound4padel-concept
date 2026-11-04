// Independent from the game format selector.
const investorTabs = [...document.querySelectorAll('.investor-options [role="tab"]')];
function selectInvestorTab(selected) {
  investorTabs.forEach(tab => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
}
investorTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectInvestorTab(tab));
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
