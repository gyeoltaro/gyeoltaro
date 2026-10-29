import json,sys
for slug in ['stationery','bakery','pub']:
    p=f'/home/user/gyeoltaro/shorts/{slug}.html'; s=open(p,encoding='utf-8').read()
    d=json.load(open(slug.replace('-','_')+'_tts.json',encoding='utf-8'))  # gen_short.js 가 만든 파일 (현재 폴더)
    tag='<script type="application/json" id="bundledTTS"></script>'
    assert s.count(tag)==1,slug
    s=s.replace(tag,'<script type="application/json" id="bundledTTS">'+json.dumps(d,ensure_ascii=False,separators=(',',':'))+'</script>')
    open(p,'w',encoding='utf-8').write(s); print(slug,len(s))
