// Preserve the existing cascade while serving one render-blocking stylesheet per page.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pages=JSON.parse(fs.readFileSync(path.join(root,'scripts/css-sources.json'),'utf8'));
for(const [name,sources] of Object.entries(pages)){
  const css=sources.map(source=>`/* ${source} */\n${fs.readFileSync(path.join(root,source),'utf8')}`).join('\n');
  const hash=createHash('sha256').update(css).digest('hex').slice(0,10);
  const filename=`site-${name}.${hash}.css`;
  for(const old of fs.readdirSync(root))if(old.startsWith(`site-${name}.`)&&old.endsWith('.css')&&old!==filename)fs.unlinkSync(path.join(root,old));
  fs.writeFileSync(path.join(root,filename),css);
  const pagePath=path.join(root,name+'.html');
  let html=fs.readFileSync(pagePath,'utf8'),inserted=false;
  html=html.replace(/<link rel="stylesheet" href="[^"]+">/g,()=>{
    if(inserted)return '';
    inserted=true;
    return `<link rel="stylesheet" href="${filename}">`;
  });
  if(!inserted)throw new Error(`No stylesheet placeholder: ${name}`);
  fs.writeFileSync(pagePath,html);
  console.log(`${name}: ${sources.length} stylesheets -> ${filename} (${Buffer.byteLength(css)} bytes)`);
}
