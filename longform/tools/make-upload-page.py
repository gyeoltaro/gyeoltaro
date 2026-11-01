#!/usr/bin/env python3
# 사용: python3 longform/tools/make-upload-page.py docs/longform-epNN.md "LF.05" "무인 가게 계산서" 영상파일명.mp4 출력.html
# docs/longform-epNN.md 의 '### 제목', '### 설명', '### 태그', '### 고정 댓글' (+ '정정' 댓글 블록이 있으면) 를 읽어 복사 버튼 페이지(HTML)를 만든다.
# 만든 html 은 Artifact 도구로 올린다(같은 파일 경로로 다시 올리면 같은 링크가 갱신된다).
import json, re, sys, os
md_path, ep, name, mp4, out = sys.argv[1:6]
md = open(md_path, encoding='utf-8').read()
def first_block(after):
    i = md.index(after)
    m = re.search(r'```\n(.*?)\n```', md[i:], re.S)
    return m.group(1)
titles = re.findall(r'^- (?:\*\*추천[^:]*:\*\* |대안[^:]*: )`(.*?)`$', md, re.M)
assert len(titles) >= 2, '제목 줄을 못 찾음 (- **추천 …:** `제목` / - 대안 …: `제목` 꼴)'
fields = [[f't{i}', '제목 ' + 'ABC'[i] + (' (추천)' if i == 0 else ''), '썸네일 ' + 'ABC'[i] + '와 짝', t] for i, t in enumerate(titles[:3])]
fields += [['dd', '설명', '첫 줄이 훅 · 해시태그는 맨 끝', first_block('### 설명')],
           ['tg', '태그', '쉼표로 구분', first_block('### 태그')],
           ['pn', '고정 댓글', '업로드 뒤 올리고 고정', first_block('### 고정 댓글')]]
m = re.search(r'^### ([^\n]*정정[^\n]*)\n', md, re.M)
if m: fields.append(['fx', m.group(1)[:30], '직접 확인 후 게시', first_block(m.group(0))])
for f in fields: assert '<' not in f[3] and '>' not in f[3], f[0] + ' 에 < > 가 있음'
dd = [f for f in fields if f[0] == 'dd'][0][3]
assert len(dd.encode()) <= 5000, f'설명 {len(dd.encode())}바이트 > 5,000'
checks = ['영상 · 썸네일 A/B/C 준비', '썸네일(과 제목) 테스트: 변수는 하나만', '자막: 한국어 → 파일 업로드 → 타이밍 있음 → ko.srt', '시청자층: 아니요, 아동용이 아닙니다', '합성 콘텐츠: 아니요 (그래픽·합성 음성)', '카테고리 교육 · 재생목록', '최종 화면 (영상 + 구독) · 카드 · 쇼츠 관련 동영상 연결', '예약 공개']
data = [dict(ep=ep, name=name, date='예약', time='미정', file=mp4, thumb='_thumbA/B/C.png', fields=fields, checks=checks)]
tpl = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'upload-page.tpl.html'), encoding='utf-8').read()
tpl = tpl.replace('<title>롱폼 업로드 문구</title>', f'<title>롱폼 {ep} 업로드 문구</title>').replace('롱폼 LF.04 업로드 문구', f'롱폼 {ep} 업로드 문구').replace('LF.04 저가 커피 계산서 · 칸마다', f'{ep} {name} · 칸마다')
open(out, 'w', encoding='utf-8').write(tpl.replace('__DATA__', json.dumps(data, ensure_ascii=False).replace('</', '<\\/')))
print('written', out, '설명', len(dd.encode()), '바이트')
