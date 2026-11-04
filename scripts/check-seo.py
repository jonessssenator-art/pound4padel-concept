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
