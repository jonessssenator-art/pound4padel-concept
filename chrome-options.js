// Preserve an explicitly selected comparison variant across local navigation.
const chromeVariant=new URLSearchParams(location.search).get('chrome');
if(['balanced','compact','clubhouse'].includes(chromeVariant)){document.querySelectorAll('a[href]').forEach(a=>{const url=new URL(a.getAttribute('href'),location.href);if(url.origin===location.origin&&!a.getAttribute('href').startsWith('#')&&(url.pathname.endsWith('.html')||url.pathname.endsWith('/'))){url.searchParams.set('chrome',chromeVariant);a.href=url.href}})}
