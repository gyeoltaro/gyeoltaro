# 사용: (gen_short.js 가 만든 *_tts.json 이 있는 폴더에서) python3 embed6.py hair-salon pizza pilates
# 파일 slug 를 인자로 받아 shorts/<slug>.html 의 bundledTTS 에 음성 JSON 을 내장한다.
import json,sys
for slug in sys.argv[1:] or ['hair-salon','pizza','pilates']:
    p=f'/home/user/gyeoltaro/shorts/{slug}.html'; s=open(p,encoding='utf-8').read()
    d=json.load(open(slug.replace('-','_')+'_tts.json',encoding='utf-8'))
    tag='<script type="application/json" id="bundledTTS"></script>'
    assert s.count(tag)==1,slug
    s=s.replace(tag,'<script type="application/json" id="bundledTTS">'+json.dumps(d,ensure_ascii=False,separators=(',',':'))+'</script>')
    open(p,'w',encoding='utf-8').write(s); print(slug,len(s))
