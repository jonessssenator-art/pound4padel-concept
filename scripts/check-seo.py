"""Check static metadata, linked identities, source assets and sitemap consistency."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://jonessssenator-art.github.io/pound4padel-concept/'
PAGES = ['index', 'club', 'women', 'equipment', 'investors']

class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []; self.json = []; self.capture = False; self.h1 = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == 'h1': self.h1 += 1
        if tag == 'script' and attrs.get('type') == 'application/ld+json': self.capture = True
    def handle_endtag(self, tag):
        if tag == 'script': self.capture = False
    def handle_data(self, data):
        if self.capture: self.json.append(data)

canonicals = []; descriptions = []; organizations = []
for name in PAGES:
    page = Head(); page.feed((ROOT / (name + '.html')).read_text())
    def attrs(tag, key, value):
        found = [a for t, a in page.tags if t == tag and a.get(key) == value]
        assert len(found) == 1, (name, tag, key, value, len(found))
        return found[0]
    url = BASE + ('' if name == 'index' else name + '.html')
    assert attrs('link', 'rel', 'canonical')['href'] == url
    assert attrs('meta', 'property', 'og:url')['content'] == url
    assert 'noindex' not in attrs('meta', 'name', 'robots')['content']
    description = attrs('meta', 'name', 'description')['content']
    assert attrs('meta', 'property', 'og:description')['content'] == description
    assert page.h1 == 1
    graph = json.loads(''.join(page.json))['@graph']
    nodes = {n['@id']: n for n in graph}
    assert len(nodes) == len(graph)
    assert nodes[url + '#webpage']['description'] == description
    organizations.append(nodes[BASE + '#club'])
    if name != 'index':
        items = nodes[url + '#breadcrumb']['itemListElement']
        assert [i['position'] for i in items] == [1, 2]
        assert [i['item'] for i in items] == [BASE, url]
    def walk(value):
        if isinstance(value, dict):
            if set(value) == {'@id'}: assert value['@id'] in nodes, value
            for child in value.values(): walk(child)
        elif isinstance(value, list):
            for child in value: walk(child)
        elif isinstance(value, str) and value.startswith(BASE + 'assets/'):
            assert (ROOT / value.removeprefix(BASE)).is_file(), value
    walk(graph)
    canonicals.append(url); descriptions.append(description)
    print(name + ': metadata, JSON-LD, references and assets OK')
assert len(set(descriptions)) == 5
assert all(org == organizations[0] for org in organizations)
urls = [n.text for n in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')]
assert urls == canonicals
print('Sitemap: all 5 canonical URLs match')

# Auxiliary documents remain crawlable but excluded from search results.
AUXILIARY = ['privacy.html', 'cookies.html', 'component-lab.html',
             'tactile-preview.html', 'loader-preview.html', 'ball-intro/index.html']
import re
import hashlib
import base64
all_files = sorted(ROOT.glob('*.html')) + [ROOT / 'ball-intro/index.html']
assert {p.relative_to(ROOT).as_posix() for p in all_files} == {
    *(name + '.html' for name in PAGES), *AUXILIARY
}, 'New HTML page requires explicit indexation review'
titles = []
for path in all_files:
    source = path.read_text()
    page = Head(); page.feed(source)
    title = re.findall(r'<title>(.*?)</title>', source, re.S)
    assert len(title) == 1 and title[0].strip(), path
    titles.append(title[0])
    assert page.h1 == 1, (path, 'H1 count', page.h1)
    robots = [a['content'] for t,a in page.tags if t == 'meta' and a.get('name') == 'robots']
    assert len(robots) == 1, (path, 'robots count')
    relative = path.relative_to(ROOT).as_posix()
    if relative in AUXILIARY:
        assert 'noindex' in robots[0], relative
        assert BASE + relative not in urls, relative
    if path.stem in ['privacy','cookies']:
        document = json.loads(''.join(page.json))
        assert document['@type'] == 'WebPage'
        assert document['url'] == BASE + relative
        assert document['description'] == next(a['content'] for t,a in page.tags if t == 'meta' and a.get('name') == 'description')
        assert next(a['href'] for t,a in page.tags if t == 'link' and a.get('rel') == 'canonical') == document['url']
    # SEO JSON-LD changes must not leave outdated inline script hashes in CSP.
    policies = [a['content'] for t,a in page.tags if t == 'meta' and a.get('http-equiv') == 'Content-Security-Policy']
    assert len(policies) == 1
    for attributes, body in re.findall(r'<script\b([^>]*)>(.*?)</script>', source, re.S|re.I):
        if not re.search(r'\bsrc\s*=', attributes) and body.strip():
            digest = base64.b64encode(hashlib.sha256(body.encode()).digest()).decode()
            assert "'sha256-" + digest + "'" in policies[0], (path, 'CSP hash is stale')
assert len(titles) == len(set(titles)), 'Duplicate titles'
print('All 11 HTML pages: titles, H1, indexation, draft schemas and CSP hashes OK')
