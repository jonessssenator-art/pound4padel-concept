# -*- coding: utf-8 -*-
"""Regenerate per-page CSP after editing inline scripts. Run before publishing."""
from pathlib import Path
import base64, hashlib, re
root=Path(__file__).resolve().parent.parent
for path in root.rglob('*.html'):
    if '.git' in path.parts or '.playwright-cli' in path.parts: continue
    source=path.read_text()
    source=re.sub(r'<meta (?:http-equiv="Content-Security-Policy"|name="referrer")[^>]*>\s*', '', source)
    hashes=[]
    for attrs,body in re.findall(r'<script\b([^>]*)>(.*?)</script>',source,re.S|re.I):
        if not re.search(r'\bsrc\s*=',attrs) and body.strip():
            hashes.append("'sha256-"+base64.b64encode(hashlib.sha256(body.encode()).digest()).decode()+"'")
    policy="default-src 'none'; script-src 'self' "+' '.join(sorted(set(hashes)))+"; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests"
    meta='<meta http-equiv="Content-Security-Policy" content="'+policy+'"><meta name="referrer" content="no-referrer">'
    source=re.sub(r'(<meta charset="utf-8">)',lambda m:m[1]+meta,source,count=1,flags=re.I)
    if meta not in source: raise RuntimeError('No charset marker: '+str(path))
    path.write_text(source)
    print(path.relative_to(root))
