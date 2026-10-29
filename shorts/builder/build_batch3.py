# EP.07 저가 커피 · EP.08 스터디카페 · EP.09 셀프 사진관 — build_batch2.py 의 공용 함수 재사용
import json
src = open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'build_batch2.py'), encoding='utf-8').read()
exec(src[:src.index("# ═══════════════════════════════ EP.04")])

def end_card2(ep, disclaimer):
    lines = disclaimer.split('|')
    body = end_card(ep, 'DISC_LINE0')
    js = ''.join(f"text('{l.strip()}',540,{1230+i*40},{{s:24,w:600,c:C.dim,alpha:P(z,.5,.4)}});" for i,l in enumerate(lines))
    return body.replace("text('DISC_LINE0',540,1230,{s:22,w:600,c:C.dim,alpha:P(z,.5,.4)});", js)

REF_JS = r"""/* 제목 띠 — 영상 내내 위쪽에 훅 제목 두 줄 + 가정 고지문 고정 (참고: docs/references.md) */
const HEAD=@HEAD@,DISC='@DISC@';
const STAGE_Y=356,STAGE_S=.9;    // 장면 본문(220~1380)을 제목 띠 아래(356~1400)로 줄여서 그림
function stageXf(){ctx.translate(540,STAGE_Y);ctx.scale(STAGE_S,STAGE_S);ctx.translate(-540,-220);}
function fillScreen(){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillRect(0,0,W,H);ctx.restore();}
function drawHead(){
  ctx.fillStyle='rgba(3,6,16,.8)';ctx.fillRect(0,166,W,168);
  ctx.fillStyle=C.gold;ctx.fillRect(0,332,W,3);
  HEAD.forEach((t,i)=>{ctx.font=`400 66px ${FD}`;const sz=Math.min(66,66*980/ctx.measureText(t).width);
    text(t,540,204+i*70,{f:'D',s:sz,c:i?C.gold:'#fff'});});
  text(DISC,540,314,{s:22,w:600,c:'rgba(255,255,255,.55)'});
}
"""

def apply_ref(path, head, disc):
    s = open(path, encoding='utf-8').read()
    def rep(a, b):
        nonlocal s
        assert s.count(a) == 1, (path, a[:60]); s = s.replace(a, b)
    rep("const TAIL=2.8;                                   // 나레이션 끝난 뒤 엔딩 카드 시간(초)",
        "const TAIL=.6;                                    // 엔딩 카드 없이 마지막 단어 0.6초 뒤 끝 → 바로 반복 재생")
    rep("/* 썸네일 커버", REF_JS.replace('@HEAD@', json.dumps(head, ensure_ascii=False)).replace('@DISC@', disc) + "/* 썸네일 커버")
    rep("if(sh>0){const k=Math.floor(R*60);ctx.translate((rnd(k)-.5)*2*sh,(rnd(k+7)-.5)*2*sh);}",
        "if(sh>0){const k=Math.floor(R*60);ctx.translate((rnd(k)-.5)*2*sh,(rnd(k+7)-.5)*2*sh);}\n  stageXf();")
    rep("vignette();drawSubs();drawTop();", "vignette();drawHead();drawSubs();drawTop();")
    i, j = s.index("const SCENES={"), s.index("function drawBG(){")
    s = s[:i] + s[i:j].replace("ctx.fillRect(0,0,W,H)", "fillScreen()") + s[j:]
    open(path, 'w', encoding='utf-8').write(s)

def calc_op(result, op='−', **kw):
    s = calc_scene(result, **kw)
    if op != '−':
        s = s.replace("typed.split('−')", f"typed.split('{op}')").replace("`${fmt(n1)} − ${fmt(n2)} =`", f"`${{fmt(n1)}} {op} ${{fmt(n2)}} =`").replace("`${fmt(n1)} −`", f"`${{fmt(n1)}} {op}`")
    return s

CASHBAR = r"""function cashBar(x0,x1,y,h,col1,col2,alpha=1){
  if(x1-x0<1)return;
  ctx.save();ctx.globalAlpha*=alpha;const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,col1);g.addColorStop(1,col2);
  ctx.fillStyle=g;rr(x0,y,x1-x0,h,18);ctx.fill();
  ctx.save();rr(x0,y,x1-x0,h,18);ctx.clip();ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=3;for(let x=x0+16;x<x1;x+=18)line(x,y+10,x,y+h-10);ctx.restore();
  ctx.restore();
}
"""
DARK = r"""    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,0,W,H);
    {const g=ctx.createRadialGradient(540,900,200,540,900,1200);g.addColorStop(0,'rgba(255,40,40,0)');g.addColorStop(1,`rgba(255,40,40,${.15+.06*Math.sin(R*5)})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
    if(GLITCH<.4)for(let i=0;i<8;i++){const s=Math.floor(R*40)+i*17;ctx.fillStyle=i%2?'rgba(111,211,255,.25)':'rgba(255,77,77,.28)';ctx.fillRect((rnd(s)-.5)*80,rnd(s+3)*H,W,10+rnd(s+5)*50);}
    ctx.restore();
"""
def dark(var): return DARK.replace('GLITCH', var)

def chips_right(n_y0=470, step=104, unit='원'):
    return r"""    COSTS.forEach((c,k)=>{
      const ap=P(T-c.tr,.15,.3);if(ap<=0)return;const x=690,y=Y0+k*STEP;
      group((1-E.out(ap))*40,0,1,0,ap,()=>{
        ctx.fillStyle='rgba(255,255,255,.06)';rr(x,y,350,92,18);ctx.fill();
        emoji(c.ic,x+38,y+46,38);text(c.lb,x+76,y+28,{a:'left',s:24,w:800,c:C.dim});
        text('−'+c.v+'UNIT',x+76,y+66,{a:'left',f:'D',s:42,c:C.red});
      });
    });
""".replace('Y0', str(n_y0)).replace('STEP', str(step)).replace('UNIT', unit)

def chips_grid(y0, step, h=60, fmtv="c.v+'만'", colfn="C.red", tintfn="'rgba(255,255,255,.06)'"):
    return r"""    COSTS.forEach((c,k)=>{
      const x=k%2?552:100,y=Y0+Math.floor(k/2)*STEP,ap=P(T-c.tr,.15,.3);if(ap<=0)return;
      group((1-E.out(ap))*30,0,1,0,ap,()=>{
        ctx.fillStyle=TINT;rr(x,y,428,HH,14);ctx.fill();
        emoji(c.ic,x+32,y+HH/2+1,30);text(c.lb,x+60,y+HH/2+1,{a:'left',s:c.lb.length>10?23:26,w:800});
        text('−'+FMTV,x+412,y+HH/2+2,{a:'right',s:34,f:'D',c:COLF});
      });
    });
""".replace('Y0', str(y0)).replace('STEP', str(step)).replace('HH', str(h)).replace('FMTV', fmtv).replace('COLF', colfn).replace('TINT', tintfn)

# ═══════════════════════════════ EP.07 저가 커피 ═══════════════════════════════
EP7_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',  text:'아메리카노 한 잔 [1,800원], 동네 [저가 커피].',sfx:[[0,'whoosh'],['w5','impact']],shake:[['w5',12,.35]]},
  {id:'h1b',sc:'hook', text:'그런데 진짜 돈 버는 사람은 [따로] 있죠.',sfx:[['w5','pop']]},
  {id:'h2',sc:'cost',  text:'한 잔에 들어가는 원두는 고작 [230원].',sfx:[[0,'whoosh']]},
  {id:'k1',sc:'cost',  text:'컵과 뚜껑, 빨대 {120원}.'},
  {id:'k2',sc:'cost',  text:'알바 두 명 인건비 {670원}.'},
  {id:'k3',sc:'cost',  text:'월세는 {250원}.'},
  {id:'k4',sc:'cost',  text:'전기와 로열티, 수수료 {150원}.',pause:200},
  {id:'r1',sc:'result',text:'한 잔 팔면 얼마나 남을까요? <380원>.',pause:300,sfx:[[0,'whoosh'],['w5','coin']]},
  {id:'t1',sc:'supply',text:'그런데 원두와 컵은 [본사에서만] 사야 하죠.',sfx:[[0,'scratch'],[.02,'impact']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'supply',text:'한 본사가 2023년 가맹점에 판 물건은 [410억 원],',sfx:[['w6','kaching']]},
  {id:'t3',sc:'supply',text:'원가는 고작 {35억 원}.',pause:200,sfx:[['w2','buzz']],shake:[['w2',10,.3]]},
  """ + SIG + r"""
  {id:'r2',sc:'margin',text:'원가율 [8.5%], 영업이익률은 <41%>.',sfx:[[0,'whoosh'],['w3','kaching']]},
  {id:'r3',sc:'margin',text:'고급 브랜드는 5% 안팎이죠.',pause:250,sfx:[['w2','stamp']]},
  {id:'e1',sc:'end',   text:'저가 커피 본사의 진짜 손님은,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',   text:'커피 사는 사람이 아니라, [가게를 연 사장님]이었습니다.',sfx:[['w4','stamp']],shake:[['w4',10,.3]]},
];
// 아메리카노 1잔(1,800원)당 비용 (단위: 원) — 하루 400잔, 월 1만 2천 잔 가정
const COSTS=[
  {cue:'h2',ic:'🫘',lb:'원두 (판매가의 약 13%)',v:230},
  {cue:'k1',ic:'🥤',lb:'컵·뚜껑·빨대',v:120},
  {cue:'k2',ic:'👥',lb:'알바비 (2명×13시간)',v:670},
  {cue:'k3',ic:'🏠',lb:'월세 (1잔당)',v:250},
  {cue:'k4',ic:'⚡',lb:'전기·로열티·수수료',v:150},
];
"""
EP7_CONSTS = """// 아메리카노 1잔 1,800원에서 비용만큼 커피가 줄어듦
const PRICE=1800;
(()=>{let top=PRICE;COSTS.forEach(c=>{c.hi=top;c.lo=top-c.v;top=c.lo;});})();
"""
EP7_HELPERS = r"""const CX=300,CW=360,CB=270,CTOP=580,CH=660;
function cupPath(x,y,w,b,h){const d=(w-b)/2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w-d,y+h);ctx.lineTo(x+d,y+h);ctx.closePath();}
/* 저가 커피 가게: 노란 차양 + COFFEE 간판 */
function drawShop(x,y,s){
  group(x,y,s,0,1,()=>{
    ctx.fillStyle='#16203f';rr(-70,-40,140,100,8);ctx.fill();
    ctx.fillStyle='rgba(255,224,138,.85)';rr(-56,-6,64,52,4);ctx.fill();ctx.fillStyle='#0b1430';rr(18,-6,38,66,4);ctx.fill();
    for(let i=0;i<7;i++){ctx.fillStyle=i%2?'#fff':C.gold;ctx.fillRect(-80+i*160/7,-62,160/7+1,26);}
    ctx.fillStyle=C.gold;rr(-60,-104,120,40,8);ctx.fill();text('COFFEE',0,-83,{f:'D',s:26,c:C.ink});
  });
}
/* 아이스 아메리카노: val(원)만큼 커피가 남음 */
function drawCoffee(val,x=CX,y=CTOP,w=CW,b=CB,h=CH,o={}){
  ctx.save();
  ctx.strokeStyle='#FF6B6B';ctx.lineWidth=w*.05;ctx.lineCap='round';line(x+w*.64,y-h*.12,x+w*.5,y+h*.8);
  cupPath(x,y,w,b,h);ctx.fillStyle='rgba(214,232,255,.10)';ctx.fill();
  ctx.save();cupPath(x,y,w,b,h);ctx.clip();
  const lh=h*clamp(val/PRICE),ly=y+h-lh;
  const g=ctx.createLinearGradient(0,ly,0,y+h);g.addColorStop(0,'#9a6633');g.addColorStop(1,'#3b2412');
  ctx.fillStyle=g;ctx.fillRect(x-20,ly,w+40,lh);
  if(o.tint){const y1=y+h-h*o.tintHi/PRICE,y2=y+h-h*o.tintLo/PRICE;ctx.fillStyle=o.tint;ctx.fillRect(x-20,y1,w+40,y2-y1);}
  for(let i=0;i<5;i++){const iy=ly+16+i*w*.22;if(iy>y+h-w*.2)break;ctx.fillStyle='rgba(225,242,255,.32)';rr(x+w*.12+(i%2)*w*.38+rnd(i)*w*.1,iy,w*.24,w*.2,w*.04);ctx.fill();}
  ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(x+w*.12,y,w*.06,h);
  ctx.restore();
  ctx.fillStyle='rgba(230,240,255,.45)';ctx.beginPath();ctx.ellipse(x+w/2,y,w/2+w*.04,w*.1,0,Math.PI,0);ctx.fill();
  cupPath(x,y,w,b,h);ctx.strokeStyle='rgba(214,232,255,.85)';ctx.lineWidth=Math.max(2,w*.014);ctx.stroke();
  ctx.restore();
}
"""
EP7_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 아메리카노 1,800원 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('아메리카노 1잔',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('1,800원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    text('하루 400잔 판매 가정',540,425,{s:34,w:800,c:C.dim,alpha:P(a,.4,.3)});
    group(0,(1-E.out(P(a,0,.5)))*300,1,0,P(a,0,.2),()=>drawCoffee(PRICE));
    if(b>=0&&T>=WT('h1b',4)){const k=E.back(P(T-WT('h1b',4),0,.4));
      group(840,760,k+.001,-.05,1,()=>{ctx.fillStyle='#3a0d12';rr(-150,-170,300,340,24);ctx.fill();ctx.strokeStyle=C.red;ctx.lineWidth=5;rr(-150,-170,300,340,24);ctx.stroke();
        text('진짜 돈 버는',0,-110,{s:36,w:900});text('사람은?',0,-62,{s:36,w:900});text('?',0,70,{f:'D',s:180,c:C.red,glow:'rgba(255,77,77,.5)'});});
    }else group(840,760,E.back(P(a,.3,.4))+.001,.05,1,()=>{
      ctx.fillStyle='#0b1430';rr(-150,-170,300,340,24);ctx.fill();ctx.strokeStyle=C.gold;ctx.lineWidth=4;rr(-150,-170,300,340,24);ctx.stroke();
      text('MENU',0,-118,{f:'D',s:48,c:C.gold});
      [['아메리카노','1,800'],['라떼','2,900'],['에이드','3,500']].forEach(([n,p],i)=>{text(n,-125,-40+i*72,{a:'left',s:28,w:800});text(p,125,-40+i*72,{a:'right',f:'D',s:32,c:C.gold});});
    });
  }},

  /* ── 비용 차감: 컵 속 커피가 비용만큼 줄어듦 ── */
  cost:{draw(){
    const a=L('h2');
    let m=PRICE;COSTS.forEach(c=>{m-=c.v*E.out(P(T-c.tr,0,.6));});
    const col=m>1000?C.gold:m>500?'#FF9F43':C.red;
    text('1잔 팔면 남는 돈',540,232,{s:40,w:700,c:C.dim});
    let bump=0;COSTS.forEach(c=>{const d=T-c.tr;if(d>=0&&d<.3)bump=Math.max(bump,Math.sin(d/.3*Math.PI));});
    group(540,330,1+bump*.06,0,1,()=>text(won(Math.round(m))+'원',0,0,{f:'D',s:128,c:col,glow:col===C.red?'rgba(255,77,77,.6)':null,gb:40}));
    const act=COSTS.find(c=>T>=CT(c.cue)&&T<c.tr);
    drawCoffee(m,CX,CTOP,CW,CB,CH,act?{tint:`rgba(255,77,77,${.45+.3*Math.sin(R*14)})`,tintLo:act.lo,tintHi:act.hi}:{});
    COSTS.forEach((c,k)=>{const d=T-c.tr;if(d<0||d>.8)return;const f=E.io(P(d,0,.55)),y0=CTOP+CH-CH*c.hi/PRICE;
      ctx.save();ctx.globalAlpha*=1-P(d,.55,.25);ctx.translate(lerp(CX+CW/2,860,f),lerp(y0+20,516+k*104,f));ctx.scale(lerp(1,.3,f),lerp(1,.3,f));
      ctx.fillStyle='#8a5a2b';ctx.beginPath();ctx.arc(0,0,60,0,7);ctx.fill();ctx.restore();});
""" + chips_right(470, 104, '원') + r"""  }},

  /* ── 결과: 1잔 380원 → 하루 15만 2천 원 ── */
  result:{draw(){
    const a=L('r1'),q=T-WT('r1',5);
    text('1잔 팔면 사장님 몫',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    if(q<0)text('?',540,430,{f:'D',s:220,c:C.gold,alpha:P(a,0,.2)});
    else group(540,430,lerp(1.7,1,E.out(P(q,.05,.3))),0,P(q,0,.15),()=>text('380원',0,0,{f:'D',s:220,c:C.green,glow:'rgba(53,224,138,.45)'}));
    text('× 하루 400잔',540,640,{f:'D',s:72,alpha:P(q,.4,.3)});
    for(let i=0;i<10;i++){const t=q-(.6+i*.06);if(t<0)break;drawCoffee(PRICE,140+i*82,760,60,46,110);}
    text('컵 1개 = 40잔',960,935,{a:'right',s:26,w:700,c:C.dim,alpha:P(q,.9,.3)});
    text('= 하루 152,000원',540,1080,{f:'D',s:96,c:C.gold,alpha:P(q,1.1,.3)});
  }},

  /* ── 반전: 원두·컵은 본사에서만 → 410억 vs 원가 35억 ── */
  supply:{draw(){
    const a=L('t1'),b=L('t2'),b2=b>=0?T-WT('t2',4):-1,c=L('t3');
""" + dark('a') + r"""    const up=b>=0?E.io(P(b,0,.5)):0;
    group(540,lerp(620,470,up),lerp(1.15,.95,up),0,P(a,0,.3),()=>{
      ctx.fillStyle='#2e4377';rr(-120,-210,240,270,16);ctx.fill();ctx.strokeStyle='#8fb4ff';ctx.lineWidth=4;rr(-120,-210,240,270,16);ctx.stroke();
      for(let r=0;r<4;r++)for(let q=0;q<4;q++){ctx.fillStyle=rnd(r*7+q+Math.floor(R*1.5))>.35?'rgba(255,214,102,.9)':'rgba(140,170,230,.18)';ctx.fillRect(-96+q*52,-180+r*56,36,30);}
      ctx.fillStyle=C.gold;rr(-90,-270,180,56,12);ctx.fill();text('본사',0,-242,{f:'D',s:40,c:C.ink});
      for(let i=0;i<5;i++){const sx=-400+i*200;drawShop(sx,290,.9);
        const ph=(R*.55+i/5)%1;emoji(i%2?'🫘':'🥤',lerp(0,sx,ph),lerp(70,180,ph),42,{alpha:1-P(ph,.8,.2)});}
    });
    stampBox('본사에서만',800,290,T-WT('t1',3),{s:62,rot:.08});
    if(b>=0)text('한 저가 커피 본사 · 2023년',540,830,{s:40,w:900,c:C.gold,alpha:P(b,.2,.3)});
    if(b2>=0){
      const k=E.out(P(T-WT('t2',6),0,.6));
      text('가맹점에 판 물건 (매출)',90,885,{a:'left',s:36,w:800,c:C.gold,alpha:P(b2,0,.3)});
      text(Math.round(410*k)+'억 원',990,885,{a:'right',f:'D',s:56,c:C.gold,alpha:P(b2,0,.3)});
      ctx.fillStyle='rgba(255,255,255,.06)';rr(90,912,900,100,18);ctx.fill();cashBar(90,90+900*k,912,100,'#FFE07a','#F2A900');
    }
    if(c>=0){
      const k=E.out(P(T-WT('t3',2),0,.5));
      text('그 물건의 원가',90,1065,{a:'left',s:36,w:800,c:'#ff9a9a',alpha:P(c,0,.3)});
      text(Math.round(35*k)+'억 원',990,1065,{a:'right',f:'D',s:56,c:C.red,alpha:P(c,0,.3)});
      ctx.fillStyle='rgba(255,255,255,.06)';rr(90,1092,900,100,18);ctx.fill();cashBar(90,90+900*35/410*k,1092,100,'#ff9a9a','#d62f2f');
    }
    text('한국경제 (2025.2.5) · 2023년 실적',540,1275,{s:28,w:700,c:C.dim,alpha:b>=0?P(b,.3,.3):0});
  }},
""" + calc_op('8.5%', op='÷', typing=110, small=40) + r"""
  /* ── 원가율 8.5% · 영업이익률 41% vs 5% ── */
  margin:{draw(){
    const a=L('r2'),b=L('r3');
    text('원가율',540,250,{s:44,w:800,c:C.dim,alpha:P(a,0,.25)});
    group(540,350,lerp(1.6,1,E.out(P(a,.05,.3))),0,P(a,0,.15),()=>text('8.5%',0,0,{f:'D',s:150,c:C.red,glow:'rgba(255,77,77,.5)'}));
    text('영업이익률',540,520,{s:44,w:800,c:C.dim,alpha:P(a,.4,.3)});
    const k1=E.out(P(T-WT('r2',2),0,.6));
    text('저가 커피 본사',90,610,{a:'left',s:38,w:900,c:C.gold,alpha:P(a,.4,.3)});
    text('41%',990,610,{a:'right',f:'D',s:60,c:C.gold,alpha:P(a,.4,.3)});
    ctx.fillStyle='rgba(255,255,255,.06)';rr(90,645,900,110,18);ctx.fill();cashBar(90,90+900*(41/45)*k1,645,110,'#FFE07a','#F2A900');
    if(b>=0){
      const k2=E.out(P(b,.2,.5));
      text('고급 커피 브랜드',90,830,{a:'left',s:38,w:900,c:'#c8d0e0'});
      text('5% 안팎',990,830,{a:'right',f:'D',s:60,c:'#c8d0e0'});
      ctx.fillStyle='rgba(255,255,255,.06)';rr(90,865,900,110,18);ctx.fill();cashBar(90,90+900*(5/45)*k2,865,110,'#d6dbe6','#8e98ad');
      stampBox('약 8배',760,1100,T-WT('r3',2)-.1,{s:90,c:C.gold,rot:-.08,bg:'rgba(40,30,0,.7)'});
    }
  }},

  /* ── 마무리: 진짜 손님은 가맹점주 + 엔딩 ── */
  end:{draw(){
    const a=L('e1'),fade=1;
    if(fade>0)group(0,0,1,0,fade,()=>{
      group(540,650,E.back(P(a,0,.45))+.001,0,1,()=>{
        drawShop(0,40,2.6);emoji('👑',0,-330,110);
        ctx.fillStyle=C.gold;rr(-170,-250,340,90,45);ctx.fill();text('VIP 고객',0,-204,{f:'D',s:56,c:C.ink});
      });
      text('원두 · 컵 · 빨대 · 시럽',540,950,{s:46,w:900,c:C.cyan,alpha:P(a,.4,.3)});
      text('매일 본사에서 사는 손님',540,1030,{s:40,w:800,c:C.dim,alpha:P(a,.6,.3)});
      stampBox('진짜 손님 = 사장님',540,1230,T-WT('e2',4),{s:76,c:C.gold,rot:-.06,bg:'rgba(40,30,0,.75)'});
    });"""+r"""
  }},
};

"""
EP7_COVER = cover('EP.07', '저가 커피', 230, '1,800원의 비밀', 640, 104, '본사는 얼마 남길까?', 100,
                  "drawCoffee(PRICE,120,860,240,180,440);", 'rgba(255,197,49,.20)')
build('/home/user/gyeoltaro/shorts/cheap-coffee.html', '비밀의 계산기 저가 커피 편', 'EP.07 저가 커피', 'cheap-coffee', 'cheap_coffee', 'EP07', 'EP.07',
      EP7_CUES, EP7_CONSTS, EP7_HELPERS,
      "const SEQ=['3','5','÷','4','1','0','='];   // 35억 ÷ 410억",
      KEYS_EXTRA + "  for(let i=0;i<10;i++)ev.push({t:TL.word[IDX.r1][5]+.6+i*.06,n:'tick'});",
      EP7_SCENES, EP7_COVER, 'supply', amount_re=r"/^\d+원[.,]?$/")
apply_ref('/home/user/gyeoltaro/shorts/cheap-coffee.html', ['1,800원 아메리카노','진짜 돈 버는 사람은?'], '하루 400잔 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.08 스터디카페 ═══════════════════════════════
EP8_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',    text:'스터디카페 이용자 한 달 평균 [4만 9천 원].',sfx:[[0,'whoosh'],['w5','impact']],shake:[['w5',10,.3]]},
  {id:'h1b',sc:'hook',   text:'그런데 이 돈, 사장님보다 [3배] 더 가져가는 사람이 있죠.',sfx:[['w4','pop']]},
  {id:'h2',sc:'hook',    text:'회원 250명이면 월 매출 [1,225만 원].',pause:250,sfx:[[0,'rise'],['w4','stamp']]},
  {id:'k1',sc:'cost',    text:'임대료와 관리비 {510만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',    text:'24시간 냉난방과 조명 {120만 원}.'},
  {id:'k3',sc:'cost',    text:'청소와 관리 알바 {100만 원}.'},
  {id:'k4',sc:'cost',    text:'키오스크와 보안, 소모품 {70만 원}.'},
  {id:'k5',sc:'cost',    text:'인테리어 1억 5천, 5년이면 {월 250만 원}.',pause:250},
  """ + SIG + r"""
  {id:'r1',sc:'result',  text:'사장님 몫은 얼마일까요? <175만 원>, 70석 중 [10석]이죠.',pause:300,sfx:[[0,'whoosh'],['w3','coin'],['w7','pop']]},
  {id:'t1',sc:'landlord',text:'그 사람은 매달 [510만 원]을 가져가죠.',sfx:[[0,'scratch'],[.02,'impact']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'landlord',text:'바로 건물주입니다. 사장님의 [3배]죠.',pause:300,sfx:[['w1','stamp'],['w3','kaching']],shake:[['w1',10,.3]]},
  {id:'e1',sc:'end',     text:'스터디카페 사장님은 공부방 주인이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',     text:'[건물주의 월세를 버는] 사람이었던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 월 비용 (단위: 만 원) — 수도권 60평 2층, 좌석 70석, 회원 250명 × 월 4.9만 원
const COSTS=[
  {cue:'k1',ic:'🏢',lb:'임대료·관리비 (건물주)',v:510,landlord:true},
  {cue:'k2',ic:'⚡',lb:'냉난방·조명 (24시간)',v:120},
  {cue:'k3',ic:'🧹',lb:'청소·관리 알바',v:100},
  {cue:'k4',ic:'🔐',lb:'키오스크·보안·소모품',v:70},
  {cue:'k5',ic:'🪑',lb:'인테리어·좌석 (5년)',v:250},
];
"""
EP8_CONSTS = """// 좌석 1석 = 매출 17.5만 원. 비용을 좌석으로 환산해 뒤쪽 좌석부터 불을 끔
const SEATS=70,PER=17.5,TOTAL=1225;
(()=>{let top=TOTAL;COSTS.forEach(c=>{c.hi=top;c.lo=top-c.v;top=c.lo;});})();
"""
EP8_HELPERS = r"""const seatXY=i=>[104+(i%10)*88,480+Math.floor(i/10)*90];
/* 스터디카페 좌석 하나: lit = 불 켜진 비율, o.col = 색, o.tint = 곧 빠질 구간 */
function drawSeat(i,lit,o={}){
  const [x,y]=seatXY(i);
  ctx.save();
  ctx.fillStyle='#0f1730';rr(x,y,76,64,12);ctx.fill();
  if(lit>0){ctx.save();rr(x,y,76,64,12);ctx.clip();ctx.fillStyle=o.col||'#4fb3e8';ctx.globalAlpha*=.85;ctx.fillRect(x,y+64*(1-lit),76,64*lit);ctx.restore();}
  if(o.tint){const [a,b]=o.tintFrac;ctx.save();rr(x,y,76,64,12);ctx.clip();ctx.fillStyle=o.tint;ctx.fillRect(x,y+64*(1-b),76,64*(b-a));ctx.restore();}
  ctx.strokeStyle=lit>0?'rgba(255,255,255,.5)':'#2c3756';ctx.lineWidth=2;rr(x,y,76,64,12);ctx.stroke();
  ctx.fillStyle=lit>.5?'#FFE08A':'#3a4560';ctx.beginPath();ctx.arc(x+60,y+16,7,0,7);ctx.fill();
  ctx.restore();
}
function drawDesk(x,y,s,rot){
  group(x,y,s,rot,1,()=>{
    ctx.fillStyle='#3a2a1a';rr(-200,0,400,30,8);ctx.fill();ctx.fillRect(-180,30,20,180);ctx.fillRect(160,30,20,180);
    ctx.strokeStyle='#d6e8ff';ctx.lineWidth=10;line(120,0,120,-180);line(120,-180,40,-230);
    ctx.fillStyle=C.gold;ctx.beginPath();ctx.moveTo(10,-250);ctx.lineTo(90,-250);ctx.lineTo(70,-200);ctx.lineTo(30,-200);ctx.closePath();ctx.fill();
    const g=ctx.createRadialGradient(50,-190,10,50,-60,220);g.addColorStop(0,'rgba(255,224,138,.45)');g.addColorStop(1,'rgba(255,224,138,0)');ctx.fillStyle=g;ctx.fillRect(-200,-200,400,200);
    ctx.fillStyle='#f6f1e4';rr(-150,-36,150,36,6);ctx.fill();ctx.fillStyle='#6FD3FF';rr(-140,-62,130,26,6);ctx.fill();
  });
}
"""
EP8_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 월 4만 9천 원 → 좌석 70석, 월 매출 1,225만 원 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h2'),q=L('h1b');
    if(q>=0&&b<0)stampBox('사장님보다 3배?',540,1250,T-WT('h1b',4),{s:66,c:C.purple,rot:-.06,bg:'rgba(30,10,60,.75)'});
    if(b<0){
      text('이용자 한 명의 월평균 지출',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
      text('49,000원',540,334,{f:'D',s:136,c:C.cyan,glow:'rgba(111,211,255,.45)',alpha:P(a,0,.15)});
      text('KB국민카드 분석 (2024)',540,425,{s:32,w:700,c:C.dim,alpha:P(a,.3,.3)});
      drawDesk(540,900,E.back(P(a,0,.5))*1.2+.001,0);
    }else{
      text('월 매출',540,236,{s:40,w:700,c:C.dim});
      text(won(12250000*E.out(P(b,.1,1.1)))+'원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)'});
      text('회원 250명 × 4만 9천 원',540,425,{s:36,w:800,c:C.dim,alpha:P(b,.2,.3)});
      for(let i=0;i<SEATS;i++){const t=b-(.1+i*.012);if(t<0)break;group(0,0,1,0,P(t,0,.15),()=>drawSeat(i,E.out(P(t,0,.25))));}
      text('좌석 1석 = 매출 17.5만 원',960,1130,{a:'right',s:28,w:700,c:C.dim,alpha:P(b,1,.3)});
    }
  }},

  /* ── 비용 차감: 좌석 70석의 불이 비용만큼 꺼짐 ── */
  cost:{draw(){
    const a=L('k1');
    let m=TOTAL;COSTS.forEach(c=>{m-=c.v*E.out(P(T-c.tr,0,.6));});
    const col=m>600?C.gold:m>250?'#FF9F43':C.red;
    text('이번 달 남은 돈',540,232,{s:40,w:700,c:C.dim});
    let bump=0;COSTS.forEach(c=>{const d=T-c.tr;if(d>=0&&d<.3)bump=Math.max(bump,Math.sin(d/.3*Math.PI));});
    group(540,330,1+bump*.06,0,1,()=>text(won(m*10000)+'원',0,0,{f:'D',s:128,c:col,glow:col===C.red?'rgba(255,77,77,.6)':null,gb:40}));
    text(`좌석 ${(m/PER).toFixed(1)}석분 남음`,540,425,{s:36,w:800,c:col});
    const act=COSTS.find(c=>T>=CT(c.cue)&&T<c.tr);
    for(let i=0;i<SEATS;i++){
      let o={};
      if(act){const lo=Math.max(i*PER,act.lo),hi=Math.min((i+1)*PER,act.hi);
        if(hi>lo)o={tint:act.landlord?`rgba(177,140,255,${.55+.3*Math.sin(R*10)})`:`rgba(255,77,77,${.55+.3*Math.sin(R*14)})`,tintFrac:[(lo-i*PER)/PER,(hi-i*PER)/PER]};}
      drawSeat(i,clamp((m-i*PER)/PER),o);
    }
    COSTS.forEach(c=>{const d=T-c.tr;if(d<0||d>1.1)return;const al=1-P(d,.7,.4),y=800-d*40;
      ctx.save();ctx.globalAlpha*=al;ctx.fillStyle='rgba(7,12,28,.88)';rr(250,y-56,580,112,56);ctx.fill();ctx.strokeStyle=c.landlord?C.purple:C.red;ctx.lineWidth=4;rr(250,y-56,580,112,56);ctx.stroke();ctx.restore();
      text(`−${c.v}만 = ${Math.round(c.v/PER)}석`,540,y+2,{f:'D',s:60,c:c.landlord?C.purple:C.red,alpha:al});});
""" + chips_grid(1150, 62, 52, "c.v+'만'", "c.landlord?C.purple:C.red", "c.landlord?'rgba(177,140,255,.16)':'rgba(255,255,255,.06)'") + r"""  }},
""" + calc_op('1,750,000', done=96) + r"""
  /* ── 결과: 월 175만 원 = 좌석 10석 ── */
  result:{draw(){
    const a=L('r1'),q=T-WT('r1',3);
    text('한 달에 사장님이 가져가는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    if(q<0)text('?',540,380,{f:'D',s:150,c:C.gold,alpha:P(a,0,.2)});
    else group(540,380,lerp(1.6,1,E.out(P(q,.05,.3))),0,P(q,0,.15),()=>text('1,750,000원',0,0,{f:'D',s:130,c:C.green,glow:'rgba(53,224,138,.45)'}));
    text('하루 약 58,000원',540,490,{s:44,w:900,c:C.gold,alpha:P(q,.4,.3)});
    const hi=T-WT('r1',7);
    for(let i=0;i<SEATS;i++)group(0,90,1,0,P(a-i*.005,.3,.2),()=>drawSeat(i,1,{col:i<10?(hi>=0?C.gold:'#4fb3e8'):'#253252'}));
    text('좌석 70석 중 사장님 몫 10석',540,1250,{s:46,w:900,c:C.gold,alpha:P(hi,0,.3)});
  }},

  /* ── 반전 1: 같은 가게에서 510만 원을 가져가는 사람 = 건물주 ── */
  landlord:{draw(){
    const a=L('t1'),b=L('t2');
""" + dark('a') + r"""    text('이 가게에서 매달 가져가는 돈',540,262,{s:44,w:900,alpha:P(a,0,.3)});
    const k=E.out(P(a,.3,.7)),base=1150,sc=560/510;
    const bar=(cx,v,col1,col2,lb,ic,show,reveal)=>{
      if(show<=0)return;const h=v*sc*E.out(show);
      ctx.fillStyle='rgba(255,255,255,.06)';rr(cx-140,base-v*sc,280,v*sc,24);ctx.fill();
      const g=ctx.createLinearGradient(0,base-h,0,base);g.addColorStop(0,col1);g.addColorStop(1,col2);ctx.fillStyle=g;rr(cx-140,base-h,280,h,24);ctx.fill();
      text(won(v*E.out(show))+'만',cx,base-h-50,{f:'D',s:64,c:col1});
      text(lb,cx,base+56,{s:44,w:900,c:col1,alpha:reveal});
      emoji(ic,cx,base-h-140,90,{alpha:reveal});
    };
    bar(320,510,'#C9B0FF','#7a52d6',b>=0?'건물주':'???',b>=0?'🏢':'❔',k,1);
    bar(760,175,'#FFE07a','#F2A900','사장님','📚',P(a,.6,.5),1);
    if(b>=0)emoji('👑',320,base-510*sc-205,64,{sc:E.back(P(T-WT('t2',1),0,.4))});
    stampBox('3배',560,560,T-WT('t2',3),{s:110,c:C.purple,rot:-.1,bg:'rgba(30,10,60,.7)'});
  }},

  /* ── 마무리: 월세 봉투가 건물로 + 엔딩 ── */
  end:{draw(){
    const a=L('e1'),b=L('e2'),fade=1;
    if(fade>0)group(0,0,1,0,fade,()=>{
      group(540,700,E.back(P(a,0,.45))+.001,0,1,()=>{
        ctx.fillStyle='#2e4377';rr(-200,-300,400,560,20);ctx.fill();ctx.strokeStyle='#8fb4ff';ctx.lineWidth=5;rr(-200,-300,400,560,20);ctx.stroke();
        for(let r=0;r<5;r++)for(let q=0;q<4;q++){const lit=r===3;ctx.fillStyle=lit?'rgba(255,224,138,.95)':'rgba(140,170,230,.2)';ctx.fillRect(-170+q*88,-270+r*100,64,60);}
        ctx.fillStyle=C.gold;rr(-140,120,280,56,12);ctx.fill();text('2F 스터디카페',0,149,{s:32,w:900,c:C.ink});
        emoji('👑',0,-370,100);
      });
      for(let i=0;i<4;i++){const t=a-(.4+i*.35);if(t<0||t>1)continue;const q=E.io(P(t,0,.8));
        ctx.save();ctx.globalAlpha*=1-P(q,.85,.15);ctx.translate(lerp(150,540,q),lerp(1200,450,q)-Math.sin(q*Math.PI)*120);
        ctx.fillStyle='#f6f1e4';rr(-60,-38,120,76,8);ctx.fill();text('월세',0,2,{s:28,w:900,c:'#C62828'});ctx.restore();}
      stampBox('건물주의 월세를 버는 장사',540,1230,T-WT('e2',0),{s:60,c:C.purple,rot:-.05,bg:'rgba(30,10,60,.75)'});
    });"""+r"""
  }},
};

"""
EP8_COVER = cover('EP.08', '스터디카페', 200, '좌석 70석', 560, 112, '사장님 몫은 몇 석?', 104,
                  "drawDesk(280,1180,.95,-.1);", 'rgba(111,211,255,.20)')
build('/home/user/gyeoltaro/shorts/study-cafe.html', '비밀의 계산기 스터디카페 편', 'EP.08 스터디카페', 'study-cafe', 'study_cafe', 'EP08', 'EP.08',
      EP8_CUES, EP8_CONSTS, EP8_HELPERS,
      "const SEQ=['1','2','2','5','00','00','−','1','0','5','00','00','0','='];   // 12,250,000 − 10,500,000",
      KEYS_EXTRA + "  for(let i=0;i<10;i++)ev.push({t:TL.cue[IDX.h2]+.1+i*.084,n:'tick'});",
      EP8_SCENES, EP8_COVER, 'landlord')
apply_ref('/home/user/gyeoltaro/shorts/study-cafe.html', ['스터디카페 사장님보다','3배 더 버는 사람(?)'], '수도권 좌석 70석 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.09 셀프 사진관 ═══════════════════════════════
EP9_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',  text:'한 번에 [4,000원], 키오스크 3대짜리 [셀프 사진관].',sfx:[[0,'whoosh'],['w2','click'],['w5','impact']],shake:[['w5',12,.35]]},
  {id:'h1b',sc:'hook', text:'그런데 딱 한 가지 때문에 {적자}로 돌아서죠.',sfx:[['w5','buzz']],shake:[['w5',8,.25]]},
  {id:'h2',sc:'hook',  text:'하루 120번 찍으면 월 매출 [1,440만 원].',pause:250,sfx:[[0,'rise'],['w5','stamp']]},
  {id:'k1',sc:'cost',  text:'인화지와 결제 수수료 {252만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',  text:'번화가 1층 임대료 {250만 원}.'},
  {id:'k3',sc:'cost',  text:'키오스크와 인테리어 {월 126만 원}.'},
  {id:'k4',sc:'cost',  text:'전기와 소품, 청소 {140만 원}.',pause:300},
  {id:'r1',sc:'result',text:'남는 돈 <672만 원>. 꽤 괜찮죠?',pause:200,sfx:[[0,'whoosh'],[.15,'kaching']]},
  {id:'t1',sc:'map',   text:'그런데 1km 안에 사진관이 [10개] 넘게 생기면,',sfx:[[0,'scratch'],[.02,'impact']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'map',   text:'같은 손님을 나눠 갖죠. 하루 120번이 {40번}으로.',pause:200,sfx:[['w6','shatter']],shake:[['w6',12,.35]]},
  """ + SIG + r"""
  {id:'r2',sc:'loss',  text:'매출 480만 원, 매달 {120만 원} 적자.',pause:200,sfx:[[0,'whoosh'],['w4','buzz']],shake:[['w4',12,.35]]},
  {id:'t3',sc:'used',  text:'그래서 중고 시장엔 [급매 키오스크]가 쏟아집니다.',pause:150,sfx:[[0,'whoosh'],['w3','stamp']]},
  {id:'e1',sc:'end',   text:'진짜 경쟁자는 손님 지갑이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',   text:'[옆 가게 간판]이었습니다.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 잘 될 때 월 비용 (단위: 만 원) — 번화가 10평, 키오스크 3대, 1회 4,000원
const COSTS=[
  {cue:'k1',ic:'🧾',lb:'인화지·결제 수수료',v:252},
  {cue:'k2',ic:'🏠',lb:'번화가 1층 임대료',v:250},
  {cue:'k3',ic:'📸',lb:'키오스크·인테리어 (5년)',v:126},
  {cue:'k4',ic:'💡',lb:'전기·소품·청소',v:140},
];
"""
EP9_CONSTS = """// 막대 1개 = 잘 될 때 월 매출 1,440만 원. 비용은 오른쪽부터 잘라 감
const GROSS=1440,BX=90,BWID=900;
(()=>{let top=GROSS;COSTS.forEach(c=>{c.hi=top;c.lo=top-c.v;top=c.lo;});})();
const vx=v=>BX+v/GROSS*BWID;
"""
EP9_HELPERS = r"""/* 네 컷 사진 띠 */
function drawStrip(x,y,s,rot,alpha=1){
  group(x,y,s,rot,alpha,()=>{
    ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=30;ctx.fillStyle='#ffffff';rr(-90,-300,180,600,12);ctx.fill();ctx.shadowColor='transparent';
    const cols=[['#FF9AC8','#B18CFF'],['#6FD3FF','#7CFFB2'],['#FFC531','#FF6B6B'],['#B18CFF','#6FD3FF']];
    cols.forEach(([c1,c2],i)=>{const g=ctx.createLinearGradient(-75,-285+i*136,75,-165+i*136);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;rr(-75,-285+i*136,150,120,8);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(-20,-235+i*136,16,0,7);ctx.arc(22,-235+i*136,16,0,7);ctx.fill();});
    text('PHOTO',0,268,{f:'D',s:28,c:'#1d2433'});
  });
}
/* 포토 키오스크 부스 */
function drawBooth(x,y,s){
  group(x,y,s,0,1,()=>{
    ctx.fillStyle='#1b2240';rr(-230,-360,460,720,30);ctx.fill();ctx.strokeStyle='#8fb4ff';ctx.lineWidth=5;rr(-230,-360,460,720,30);ctx.stroke();
    ctx.fillStyle='#FF5FD2';rr(-230,-360,460,90,{})&&0;ctx.save();ctx.beginPath();rr(-230,-360,460,720,30);ctx.clip();ctx.fillRect(-230,-360,460,90);ctx.restore();
    text('SELF PHOTO',0,-314,{f:'D',s:48,c:'#fff'});
    ctx.fillStyle='#070c1c';rr(-170,-240,340,240,20);ctx.fill();
    ctx.fillStyle='#6FD3FF';ctx.beginPath();ctx.arc(0,-120,46,0,7);ctx.fill();ctx.fillStyle='#070c1c';ctx.beginPath();ctx.arc(0,-120,24,0,7);ctx.fill();
    for(let i=0;i<6;i++){ctx.fillStyle=i%2?'#ffe0f2':'#ffc2e4';ctx.fillRect(-200+i*68,40,60,300);}
    ctx.fillStyle='#05070f';rr(-80,330,160,14,7);ctx.fill();
  });
}
"""
EP9_SCENES = CASHBAR + r"""const BAR_Y=560,BAR_H=160;
const PINS=[[-250,-160],[210,-230],[300,90],[-310,140],[40,300],[-120,-330],[350,-60],[-60,140],[150,-60],[-200,320]];
const SCENES={
  /* ── 훅: 1회 4,000원 → 하루 120번, 월 매출 1,440만 원 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h2'),q=L('h1b');
    if(q>=0&&b<0)stampBox('적자 전환?',540,1290,T-WT('h1b',5),{s:72,rot:-.06});
    if(b<0){
      text('1회 촬영',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
      text('4,000원',540,334,{f:'D',s:136,c:'#FF5FD2',glow:'rgba(255,95,210,.5)',alpha:P(a,0,.15)});
    }else{
      text('월 매출',540,236,{s:40,w:700,c:C.dim});
      text(won(14400000*E.out(P(b,.1,1.1)))+'원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)'});
      text('하루 120번 × 4,000원 × 30일',540,425,{s:36,w:800,c:C.dim,alpha:P(b,.2,.3)});
    }
    drawBooth(420,850,E.back(P(a,0,.5))*.9+.001);
    const st=T-WT('h1',2);
    if(st>=0){const fl=st<.15;if(fl){ctx.fillStyle=`rgba(255,255,255,${.5*(1-st/.15)})`;ctx.fillRect(0,0,W,H);}
      drawStrip(lerp(560,820,E.out(P(st,0,.5))),lerp(1100,830,E.out(P(st,0,.5))),.8,lerp(0,.15,P(st,0,.5)));}
  }},

  /* ── 비용 차감 (잘 될 때) ── */
  cost:{draw(){
    const a=L('k1');
    let m=GROSS;COSTS.forEach(c=>{m-=c.v*E.out(P(T-c.tr,0,.6));});
    const col=m>900?C.gold:m>400?'#FF9F43':C.red;
    text('이번 달 남은 돈 (잘 될 때)',540,232,{s:40,w:700,c:C.dim});
    let bump=0;COSTS.forEach(c=>{const d=T-c.tr;if(d>=0&&d<.3)bump=Math.max(bump,Math.sin(d/.3*Math.PI));});
    group(540,330,1+bump*.06,0,1,()=>text(won(m*10000)+'원',0,0,{f:'D',s:128,c:col}));
    text(`매출의 ${(m/14.4).toFixed(0)}%`,540,425,{s:36,w:800,c:col});
    ctx.fillStyle='rgba(255,255,255,.06)';rr(BX,BAR_Y,BWID,BAR_H,18);ctx.fill();
    cashBar(BX,vx(m),BAR_Y,BAR_H,'#FFB0DD','#E04A9E');
    const act=COSTS.find(c=>T>=CT(c.cue)&&T<c.tr);
    if(act){ctx.save();ctx.fillStyle=`rgba(255,77,77,${.45+.3*Math.sin(R*14)})`;rr(vx(act.lo),BAR_Y,vx(act.hi)-vx(act.lo),BAR_H,14);ctx.fill();ctx.restore();}
    COSTS.forEach((c,k)=>{
      const d=T-c.tr;if(d<0||d>.75)return;
      const f=E.io(P(d,0,.55)),cx=k%2?552+214:100+214,cy=900+Math.floor(k/2)*90+35;
      const x0=lerp(vx(c.lo),cx-60,f),x1=lerp(vx(c.hi),cx+60,f),y=lerp(BAR_Y,cy-20,f),h=lerp(BAR_H,40,f);
      ctx.save();ctx.globalAlpha*=1-P(d,.5,.25);ctx.fillStyle=C.red;rr(x0,y,Math.max(8,x1-x0),h,12);ctx.fill();ctx.restore();
      text('−'+c.v+'만',(vx(c.lo)+vx(c.hi))/2,BAR_Y+BAR_H/2-d*50,{f:'D',s:60,c:C.red,alpha:1-P(d,.4,.35),st:9});
    });
""" + chips_grid(900, 90, 70) + r"""    drawStrip(960,1250,.32,.25,P(a,0,.3));
  }},

  /* ── 결과 (잘 될 때): 672만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('잘 될 때 한 달 순이익',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    group(540,390,lerp(1.6,1,E.out(P(a,.05,.3))),0,P(a,0,.15),()=>text('6,720,000원',0,0,{f:'D',s:130,c:C.green,glow:'rgba(53,224,138,.45)'}));
    for(let i=0;i<5;i++){const t=a-(.4+i*.1);if(t<0)break;drawStrip(220+i*160,800,.62*E.back(P(t,0,.3))+.001,(i-2)*.08);}
    text('꽤 괜찮죠?',540,1180,{f:'D',s:90,c:C.gold,alpha:P(a,1.1,.3)});
  }},

  /* ── 반전: 1km 안에 10곳 → 하루 120번이 40번 ── */
  map:{draw(){
    const a=L('t1'),b=L('t2');
""" + dark('a') + r"""    const cx=540,cy=870,RR=400;
    ctx.save();ctx.strokeStyle='rgba(120,170,255,.18)';ctx.lineWidth=14;
    for(let i=-3;i<=3;i++){line(cx-RR-60,cy+i*130,cx+RR+60,cy+i*130);line(cx+i*130,cy-RR-60,cx+i*130,cy+RR+60);}ctx.restore();
    ctx.save();ctx.setLineDash([16,12]);ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,RR,0,7);ctx.stroke();ctx.restore();
    text('반경 1km',cx+RR-20,cy-RR+10,{a:'right',s:34,w:900,c:C.gold});
    const pin=(x,y,col,s)=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-30*s,26*s,Math.PI*.15,Math.PI*.85,true);ctx.lineTo(x,y);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y-34*s,9*s,0,7);ctx.fill();};
    const nPins=T-WT('t1',4);
    PINS.forEach(([dx,dy],i)=>{const t=nPins-i*.08;if(t<0)return;pin(cx+dx,cy+dy,'#FF5FD2',E.back(P(t,0,.3))*1.1+.001);});
    pin(cx,cy,C.gold,1.8);text('우리 가게',cx,cy+40,{s:30,w:900,c:C.gold});
    if(b>=0){
      const cut=T-WT('t2',6);
      for(let i=0;i<60;i++){const t=b-i*.012;if(t<0)break;const f=E.out(P(t,0,.7)),dst=PINS[i%PINS.length],keep=i%3===0;
        const tx=keep?cx+(rnd(i)-.5)*60:cx+dst[0],ty=keep?cy+(rnd(i+3)-.5)*60:cy+dst[1];
        ctx.fillStyle=keep?C.cyan:'rgba(111,211,255,.55)';ctx.beginPath();ctx.arc(lerp(cx+(rnd(i+9)-.5)*120,tx,f),lerp(cy+(rnd(i+11)-.5)*120,ty,f),9,0,7);ctx.fill();}
      const n=cut<0?120:Math.round(lerp(120,40,E.out(P(cut,0,.5))));
      text('우리 가게 하루 촬영',540,300,{s:40,w:800,c:C.dim});
      text(n+'번',540,390,{f:'D',s:110,c:cut<0?'#fff':C.red});
    }else text('같은 상권, 늘어나는 간판',540,330,{s:44,w:900,alpha:P(a,.2,.3)});
    text('비즈한국 (2025.6.2) 폐업 점주 사례',540,1310,{s:28,w:700,c:C.dim,alpha:P(a,.5,.3)});
  }},
""" + calc_op('−1,200,000', typing=86, small=32, done=84) + r"""
  /* ── 결과: 하루 40번이면 매달 120만 원 적자 ── */
  loss:{draw(){
    const a=L('r2');
    text('하루 40번으로 줄면, 한 달',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    group(540,390,lerp(1.6,1,E.out(P(a,.05,.3))),0,P(a,0,.15),()=>text('−1,200,000원',0,0,{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.5)'}));
    const rows=[['매출 (하루 40번)','4,800,000',C.green],['인화지·수수료','−840,000',C.red],['임대료','−2,500,000',C.red],['키오스크·인테리어','−1,260,000',C.red],['전기·소품·청소','−1,400,000',C.red]];
    rows.forEach((r,i)=>{const k=P(a-.4-i*.12,0,.25);if(k<=0)return;const y=560+i*92;
      group((1-E.out(k))*40,0,1,0,k,()=>{text(r[0],130,y,{a:'left',s:38,w:800});text(r[1],950,y,{a:'right',f:'D',s:46,c:r[2]});if(i<4)dashed(130,y+46,950,'rgba(255,255,255,.12)');});});
    text('임대료·장비값은 손님이 줄어도 그대로',540,1110,{s:40,w:900,c:C.gold,alpha:P(a,1.2,.3)});
  }},

  /* ── 결과 2: 중고 시장의 급매 키오스크 ── */
  used:{draw(){
    const a=L('t3');
    text('중고 거래 앱',540,280,{s:44,w:900,alpha:P(a,0,.3)});
    const items=[['포토 키오스크 급매','300만 원'],['폐업 정리, 키오스크 넘겨요','200만 원'],['급처 · 직접 가져가실 분','100만 원']];
    items.forEach(([t,p],i)=>{const k=E.out(P(a-.2-i*.25,0,.35));if(k<=0)return;const y=420+i*230;
      group((1-k)*300,0,1,0,k,()=>{
        ctx.fillStyle='rgba(255,255,255,.08)';rr(90,y,900,200,24);ctx.fill();
        ctx.fillStyle='#1b2240';rr(115,y+25,150,150,16);ctx.fill();emoji('📸',190,y+100,80);
        text(t,300,y+70,{a:'left',s:38,w:800});text(p,300,y+138,{a:'left',f:'D',s:56,c:C.gold});
        ctx.fillStyle=C.red;rr(800,y+30,160,56,28);ctx.fill();text('급매',880,y+58,{s:30,w:900});
      });});
    stampBox('쏟아지는 매물',560,1170,T-WT('t3',3)+.2,{s:72,rot:-.07});
    text('비즈한국: 중고 키오스크 200~300만 원, 100만 원 매물도',540,1310,{s:26,w:700,c:C.dim,alpha:P(a,.5,.3)});
  }},

  /* ── 마무리: 늘어나는 간판 + 엔딩 ── */
  end:{draw(){
    const a=L('e1'),fade=1;
    if(fade>0)group(0,0,1,0,fade,()=>{
      const cols=['#FF5FD2','#6FD3FF','#FFC531','#7CFFB2','#B18CFF','#FF6B6B'];
      for(let i=0;i<12;i++){const t=a-i*.12;if(t<0)break;const k=E.back(P(t,0,.3)),x=180+(i%3)*360,y=420+Math.floor(i/3)*190;
        group(x,y,k+.001,(rnd(i)-.5)*.1,1,()=>{const c=cols[i%6];ctx.fillStyle='#0b1430';rr(-150,-60,300,120,20);ctx.fill();ctx.shadowColor=c;ctx.shadowBlur=24;ctx.strokeStyle=c;ctx.lineWidth=6;rr(-150,-60,300,120,20);ctx.stroke();ctx.shadowColor='transparent';
          text(['PHOTO','네컷','SNAP','포토','4CUT','셀카'][i%6],0,4,{f:'D',s:52,c});});}
      stampBox('옆 가게 간판',540,1230,T-WT('e2',0),{s:84,c:C.red,rot:-.06});
    });"""+r"""
  }},
};

"""
EP9_COVER = cover('EP.09', '셀프 사진관', 200, '한 번에 4,000원', 680, 100, '옆에 10개 생기면?', 104,
                  "drawStrip(250,1080,1.05,-.15);", 'rgba(255,95,210,.22)')
build('/home/user/gyeoltaro/shorts/photo-booth.html', '비밀의 계산기 셀프 사진관 편', 'EP.09 셀프 사진관', 'photo-booth', 'photo_booth', 'EP09', 'EP.09',
      EP9_CUES, EP9_CONSTS, EP9_HELPERS,
      "const SEQ=['4','8','00','00','0','−','6','00','00','00','='];   // 4,800,000 − 6,000,000",
      KEYS_EXTRA + "",
      EP9_SCENES, EP9_COVER, 'map')
apply_ref('/home/user/gyeoltaro/shorts/photo-booth.html', ['한 번에 4,000원 셀프 사진관','적자로 돌아서는 이유'], '키오스크 3대·1회 4,000원 가정 예시 · 세금 제외')
