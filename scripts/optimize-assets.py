"""Generate lossily compressed responsive copies without cropping or changing originals."""
import argparse,json,re
from pathlib import Path
from PIL import Image,ImageOps,features
p=argparse.ArgumentParser();p.add_argument('--manifest',required=True);a=p.parse_args()
root=Path(__file__).resolve().parents[1]
sources=set()
for name in ['index.html','club.html','women.html','equipment.html','investors.html','app.js','chrome-options.css']:
    sources.update(re.findall(r'assets/[^\s"\x27()<>]+?\.(?:jpg|jpeg|png|webp)',(root/name).read_text()))
out=[]
for name in sorted(sources):
    src=root/name
    if not src.exists():continue
    with Image.open(src) as original:
        im=ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() else 'RGB')
        gallery=any(x in name for x in ['club-interior/','club-people/','club-tournament/']) or name in ['assets/club-entrance.jpg','assets/club-community.jpg','assets/club-opening.jpg','assets/club-awards.jpg']
        widths=([160] if gallery else [])+([800,1600] if src.suffix.lower()!='.webp' and src.stat().st_size>100000 else [])
        if name=='assets/club-interior/584A3168.webp':widths.append(800)
        if not widths:continue
        variants=[]
        for width in widths:
            width=min(width,im.width);height=round(im.height*width/im.width)
            resized=im.resize((width,height),Image.Resampling.LANCZOS)
            formats=['webp']+(['avif'] if features.check('avif') and width!=160 and name!='assets/club-interior/584A3168.webp' else [])
            for fmt in formats:
                target=Path('assets/optimized')/Path(name).relative_to('assets').parent/(src.stem+f'-{width}.{fmt}')
                dest=root/target;dest.parent.mkdir(parents=True,exist_ok=True)
                resized.save(dest,format=fmt.upper(),quality=(82 if name=='assets/club-interior/584A3168.webp' and width==800 else 84) if fmt=='webp' else 65,**({'method':6} if fmt=='webp' else {}))
                with Image.open(dest) as check:
                    assert check.size==(width,height)
                    assert ('A' in check.getbands())==('A' in im.getbands())
                variants.append({'src':str(target),'width':width,'height':height,'bytes':dest.stat().st_size,'format':fmt,'thumbnail':width==160})
        out.append({'source':name,'width':im.width,'height':im.height,'bytes':src.stat().st_size,'alpha':'A' in im.getbands(),'variants':variants})
Path(a.manifest).parent.mkdir(parents=True,exist_ok=True)
Path(a.manifest).write_text(json.dumps({x['source']:x for x in out},ensure_ascii=False,indent=2))
print(f'{len(out)} sources, {sum(len(x["variants"]) for x in out)} variants')
