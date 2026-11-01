# EP.25 동네 도시락 가게 · EP.26 동네 카페 · EP.27 동네 옷가게 — 포맷 v2 (build_batch5.py 의 공용 함수 재사용)
# 반전: 거래처 집중(한 곳이 끊기면 적자) · 월세 해마다 5% 복리 인상(5년 뒤 100만 → 17만) · 정가 판매 비율(정가 다 팔면 300만 → 실제 0원)
# 이미 만든 묶음 파일(build_batch2~8)은 다시 돌리지 않는다 — build() 가 그 편 html 의 bundledTTS 를 비운다.
src = open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'build_batch5.py'), encoding='utf-8').read()
exec(src[:src.index("# ═══════════════════════════════ EP.13")])

SH = '/home/user/gyeoltaro/shorts/'

def cost_scene6(*a, **k):
    """cost_scene 과 같고, 1,000 이상 금액에 쉼표를 붙인다."""
    return cost_scene(*a, **k).replace("'−'+c.v+'만'", "'−'+won(c.v)+'만'")

# ═══════════════════════════════ EP.25 동네 도시락 가게 — 거래처 집중 ═══════════════════════════════
EP25_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'점심 도시락 가게, 월 매출 [1,500만 원].',sfx:[[0,'whoosh'],['w5','impact']],shake:[['w5',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 이 중 [회사 한 곳이] 40%를 차지하죠.',sfx:[['w3','buzz']]},
  {id:'k1',sc:'cost',   text:'식재료비 {600만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {200만 원}.'},
  {id:'k3',sc:'cost',   text:'알바 인건비 {300만 원}.'},
  {id:'k4',sc:'cost',   text:'포장과 가스비 {100만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <300만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'client', text:'그런데 이 회사가 주문을 끊으면 매출이 {600만 원} 줄죠.',sfx:[[0,'scratch'],[.02,'impact'],['w6','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'client', text:'재료비는 {240만 원} 줄지만, 월세와 알바비는 그대로죠.',sfx:[['w1','buzz']],shake:[['w1',10,.3]]},
  {id:'t3',sc:'client', text:'남는 돈은 300만 원이 아니라 {60만 원} 적자죠.',sfx:[['w5','pop']]},
  {id:'t4',sc:'client', text:'월 매출 1,000만 원이 넘어야 겨우 본전이죠.',pause:300,sfx:[['w2','pop']]},
  {id:'e1',sc:'end',    text:'도시락집은 도시락을 파는 장사가 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[거래처 한 곳에 기대는 장사]였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 도시락 가게 월 비용 (단위: 만 원) — 예시: 재료 40%
const COSTS=[
  {cue:'k1',ic:'🥬',lb:'식재료비 40%',v:600},
  {cue:'k2',ic:'🏠',lb:'임대료',v:200},
  {cue:'k3',ic:'👤',lb:'알바 인건비',v:300},
  {cue:'k4',ic:'🔥',lb:'포장·가스비',v:100},
];
"""
EP25_CONSTS = """// 매출 1,500만 원 vs 비용 1,200만 원 (단위: 만 원)
const REV=1500,SCL=900/1500,X0=90;
"""
EP25_HELPERS = COIN + r"""/* 도시락 (상표 없음) */
function drawLunch(x,y,s,o={}){
  group(x,y,s,o.rot||0,o.alpha??1,()=>{
    ctx.fillStyle='#4a3326';rr(-340,-200,680,400,38);ctx.fill();
    ctx.fillStyle='#f7ecd9';rr(-308,-168,616,336,26);ctx.fill();
    ctx.fillStyle='#fff';rr(-292,-152,300,304,18);ctx.fill();
    ctx.fillStyle='#ffe9a8';rr(24,-152,268,142,18);ctx.fill();
    ctx.fillStyle='#d9f2c8';rr(24,10,268,142,18);ctx.fill();
    emoji('🍚',-142,0,170);emoji('🍖',158,-80,96);emoji('🥬',158,82,96);
    ctx.strokeStyle='#c9965a';ctx.lineWidth=12;ctx.lineCap='round';line(-300,235,300,222);line(-300,262,300,250);ctx.lineCap='butt';
  });
}
"""
EP25_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 도시락 월 매출 1,500만 원 → 회사 한 곳이 40% ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('점심 도시락 가게 (월)',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('1,500만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawLunch(540,830,E.back(P(a,0,.5))*.95+.001);
    if(b>=0){group(540,470,1,0,P(b,0,.3),()=>{ctx.fillStyle='rgba(255,255,255,.92)';rr(-300,-38,600,76,38);ctx.fill();text('🏢 회사 단체 주문 한 곳 = 600만 원',0,2,{s:34,w:900,c:C.ink});});
      stampBox('한 곳이 40%?',540,1265,T-WT('h1b',5),{s:72,rot:-.06});}
  }},
""" + cost_scene6('도시락 매출 1,500만', '#ffe0b3', '#e08a00', "'#FFC16B'") + calc_op('3,000,000') + r"""
  /* ── 결과: 한 달 300만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('도시락집, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '300만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,10*k,'#9ff0c4');
    text('하루 약 10만 원',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 회사 한 곳(600만)이 끊기면 → 재료비만 줄고 고정비 그대로 → −60만 → 본전선 1,000만 ── */
  client:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('한 달 매출 1,500만 원',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      const k=E.out(P(a,.1,.6)),X=90,w1=540*k,w2=360*k,cut=T-WT('t1',6);
      cashBar(X,X+w1,520,170,'#9ff0c4','#1fa864');
      if(cut<0)cashBar(X+w1,X+w1+w2,520,170,'#ffd27a','#e08a00');
      else{cashBar(X+w1,X+w1+w2,520,170,'#ff9a9a','#c42b2b',1-.55*P(cut,0,.4));
        group(X+540+180,605,lerp(1.6,1,E.out(P(cut,0,.3))),0,P(cut,0,.15),()=>text('✕',0,0,{f:'D',s:170,c:'#fff',st:10,sc:'#c42b2b'}));}
      if(k>.8){text('개인 손님 900만',X+270,730,{s:38,w:900,c:C.green});text('🏢 회사 한 곳 600만',X+720,730,{s:38,w:900,c:cut<0?'#ffd27a':'#ff9a9a',max:380});}
      if(cut>=0)text('주문이 끊기면 −600만',540,930,{f:'D',s:78,c:C.red,glow:'rgba(255,77,77,.5)',alpha:P(cut,.2,.3)});
    }else if(c<0){
      text('한 곳이 끊겨도',540,250,{s:46,w:900});
      [['재료비 600 → 360만','−240만',C.green],['월세·알바·포장비 600만','그대로',C.red]].forEach(([l,v,col],i)=>{
        const k=P(b,.1+i*.35,.3);if(k<=0)return;const y=540+i*170;
        group(0,(1-E.out(k))*30,1,0,k,()=>{ctx.fillStyle='rgba(255,255,255,.08)';rr(90,y-70,900,140,20);ctx.fill();text(l,120,y-8,{a:'left',s:38,w:900,max:520});text(v,960,y,{a:'right',f:'D',s:68,c:col});});
      });
      stampBox('고정비는 안 줄어든다',540,1000,T-WT('t2',1)-.1,{s:64,rot:-.05});
    }else if(d<0){
      text('한 달 남는 돈',540,250,{s:46,w:900});
      const k=E.out(P(T-WT('t3',5),0,.6)),base=900;
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=4;line(120,base,960,base);
      vCash2(210,base-360,260,360);text('300만',340,base-405,{f:'D',s:60,c:C.green});text('거래처 있을 때',340,400,{s:34,w:900,c:C.dim});
      const h2=72*k;ctx.fillStyle='#e04848';rr(590,base,260,Math.max(h2,1),16);ctx.fill();
      text('한 곳 끊기면',720,400,{s:34,w:900,c:C.dim});if(k>.3)text('−60만',720,base+72+55,{f:'D',s:60,c:C.red});
      stampBox('흑자에서 적자로',540,1250,T-WT('t3',5)-.2,{s:68,rot:-.05});
    }else{
      text('손익분기 매출',540,250,{s:46,w:900});
      const X=90,mx=v=>X+v*.6;
      ctx.fillStyle='rgba(255,255,255,.06)';rr(X,520,900,120,20);ctx.fill();
      const k=E.out(P(d,0,.6));ctx.fillStyle='#e04848';rr(X,520,540*k,120,20);ctx.fill();text('남은 매출 900만',X+270,580,{s:38,w:900,c:'#fff',alpha:k});
      ctx.save();ctx.setLineDash([14,10]);ctx.strokeStyle=C.gold;ctx.lineWidth=6;line(mx(1000),470,mx(1000),700);ctx.restore();
      const q=T-WT('t4',2);
      group(mx(1000),420,q>=0?lerp(1.4,1,E.out(P(q,0,.3))):1,0,1,()=>text('본전선 1,000만',0,0,{f:'D',s:48,c:C.gold}));
      text('(월세·알바·포장 600만 ÷ 마진 60%)',540,790,{s:32,w:800,c:C.dim,alpha:P(d,.4,.3)});
      stampBox('1,000만 넘어야 본전',540,1060,T-WT('t4',2),{s:70,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawLunch(540,700,E.back(P(a,0,.45))*.95+.001);
    stampBox('거래처 한 곳 장사',540,1250,T-WT('e2',0),{s:76,rot:-.06});
  }},
};
"""
EP25_COVER = cover2('EP.25', '도시락', 190, '한 달 남는 돈', '300만 원', '회사 한 곳 끊기면', '−60만 원',
                    "drawLunch(540,560,.42);", 'rgba(224,138,0,.22)')
build(SH + 'lunchbox.html', '비밀의 계산기 도시락 편', 'EP.25 도시락', 'lunchbox', 'lunchbox', 'EP25', 'EP.25',
      EP25_CUES, EP25_CONSTS, EP25_HELPERS,
      "const SEQ=['1','5','00','00','00','−','1','2','00','00','00','=';   // 15,000,000 − 12,000,000".replace("'=';", "'='];"),
      KEYS_EXTRA, EP25_SCENES, EP25_COVER, 'client')
apply_ref(SH + 'lunchbox.html', ['회사 한 곳이 매출의 40%','끊기면 300만 원이 −60만 원'], '도시락 매출·거래처 비중 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.26 동네 카페 — 월세 복리 인상 ═══════════════════════════════
EP26_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'동네 카페, 하루 100잔, 월 매출 [1,350만 원].',sfx:[[0,'whoosh'],['w6','impact']],shake:[['w6',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 월세가 해마다 [5%씩] 오르면 큰일 나죠.',sfx:[['w3','buzz']]},
  {id:'k1',sc:'cost',   text:'재료와 컵 {400만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {300만 원}.'},
  {id:'k3',sc:'cost',   text:'알바 인건비 {450만 원}.'},
  {id:'k4',sc:'cost',   text:'전기와 카드 수수료 {100만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <100만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'rent',   text:'월세가 해마다 5%씩 오르면, 5년 뒤엔 {383만 원}.',sfx:[[0,'scratch'],[.02,'impact'],['w6','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'rent',   text:'매출은 그대로인데 월세만 {83만 원} 늘었죠.',sfx:[['w3','buzz']],shake:[['w3',10,.3]]},
  {id:'t3',sc:'rent',   text:'남는 돈은 100만 원에서 {17만 원}.',sfx:[['w4','pop']]},
  {id:'t4',sc:'rent',   text:'10년이 지나면 월 {89만 원} 적자죠.',pause:300,sfx:[['w3','buzz']],shake:[['w3',10,.3]]},
  {id:'e1',sc:'end',    text:'카페는 커피를 파는 장사가 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[월세를 쫓아가는 장사]였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 동네 카페 월 비용 (단위: 만 원) — 예시: 한 잔 4,500원 × 하루 100잔 × 30일
const COSTS=[
  {cue:'k1',ic:'☕',lb:'재료·컵',v:400},
  {cue:'k2',ic:'🏠',lb:'임대료',v:300},
  {cue:'k3',ic:'👤',lb:'알바 인건비',v:450},
  {cue:'k4',ic:'⚡',lb:'전기·카드 수수료',v:100},
];
"""
EP26_CONSTS = """// 매출 1,350만 원 vs 비용 1,250만 원 (단위: 만 원)
const REV=1350,SCL=900/1350,X0=90;
"""
EP26_HELPERS = COIN + r"""/* 동네 카페 외관 (상표 없음) */
function drawCafeShop(x,y,s,o={}){
  group(x,y,s,o.rot||0,o.alpha??1,()=>{
    ctx.fillStyle='#3a2f4a';rr(-380,-250,760,540,20);ctx.fill();
    for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#f4e9d8':'#d9534f';ctx.fillRect(-380+i*95,-250,95,110);}
    ctx.save();ctx.shadowColor='rgba(255,214,150,.6)';ctx.shadowBlur=40;ctx.fillStyle='#fff0cf';rr(-330,-110,420,330,10);ctx.fill();ctx.restore();
    emoji('☕',-120,30,180);
    ctx.fillStyle='#cfe8ff';rr(130,-110,200,400,10);ctx.fill();ctx.fillStyle='rgba(42,49,80,.5)';ctx.fillRect(228,-110,4,400);
    ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(230,-190,38,0,7);ctx.fill();text('OPEN',230,-188,{f:'D',s:28,c:'#2f2a3d'});
  });
}
"""
EP26_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 카페 월 매출 1,350만 원 → 월세 해마다 5% ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('동네 카페 · 하루 100잔 (월)',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('1,350만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawCafeShop(540,830,E.back(P(a,0,.5))*.95+.001);
    if(b>=0){group(540,470,1,0,P(b,0,.3),()=>{ctx.fillStyle='rgba(255,255,255,.92)';rr(-260,-38,520,76,38);ctx.fill();text('월세 300만 원 · 해마다 +5%?',0,2,{s:36,w:900,c:C.ink});});
      stampBox('월세가 오르면?',540,1265,T-WT('h1b',3),{s:72,rot:-.06});}
  }},
""" + cost_scene6('카페 매출 1,350만', '#f0dcc8', '#a0693d', "'#D9B38C'") + calc_op('1,000,000') + r"""
  /* ── 결과: 한 달 100만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('카페, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '100만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,3*k,'#9ff0c4');
    text('하루 약 3만 3천 원',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 월세 300 → 5년 뒤 383 → +83만 → 남는 돈 100 → 17 → 10년 −89 ── */
  rent:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('월세 (해마다 +5%)',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      const base=1100,labs=['지금','1년','2년','3년','4년','5년'];
      for(let i=0;i<6;i++){const rent=300*Math.pow(1.05,i),k=E.out(P(a,.2+i*.22,.4)),h=rent*1.35*k,x=110+i*150,last=i===5;
        vCash2(x,base-h,110,h,last?'#ff9a9a':'#d9b38c',last?'#c42b2b':'#a0693d');
        text(labs[i],x+55,base+44,{s:30,w:900,c:C.dim});
        if(k>.5)text(String(Math.round(rent))+'만',x+55,base-h-34,{f:'D',s:last?54:34,c:last?C.red:'#f0dcc8'});}
    }else if(c<0){
      text('월세만 오르고 매출은 그대로',540,250,{s:44,w:900});
      group(540,600,1,0,P(b,0,.3),()=>{ctx.fillStyle='rgba(255,255,255,.08)';rr(-420,-110,840,220,24);ctx.fill();
        text('월세',-300,-30,{s:40,w:900,c:C.dim});text('300만',-90,-30,{f:'D',s:64,c:'#f0dcc8'});text('→',60,-30,{f:'D',s:64,c:'#fff'});text('383만',250,-30,{f:'D',s:64,c:C.red});
        text('매출 1,350만 원 그대로',0,60,{s:36,w:900,c:C.dim});});
      const q=T-WT('t2',3);if(q>=0)group(540,940,lerp(1.6,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('+83만 원',0,0,{f:'D',s:140,c:C.red,glow:'rgba(255,77,77,.5)'}));
    }else if(d<0){
      text('한 달 남는 돈',540,250,{s:46,w:900});
      const k=E.out(P(T-WT('t3',4),0,.6)),base=1060;
      vCash2(210,base-500,260,500);text('100만',340,base-545,{f:'D',s:60,c:C.green});text('지금',340,base+50,{s:36,w:900,c:C.dim});
      const h2=500*(1-.83*k);vCash2(590,base-h2,260,h2);ctx.fillStyle='rgba(255,77,77,.6)';ctx.fillRect(590,base-500,260,500-h2);
      text((100-Math.round(83*k))+'만',720,base-545,{f:'D',s:60,c:'#FF9F43'});text('5년 뒤',720,base+50,{s:36,w:900,c:C.dim});
      stampBox('매출은 그대로인데',540,1260,T-WT('t3',4)-.3,{s:64,rot:-.05});
    }else{
      text('월 남는 돈, 해마다',540,250,{s:46,w:900});
      const base=760,sc=3.4;ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=4;line(70,base,1010,base);
      for(let y=0;y<=10;y++){const v=100-(300*Math.pow(1.05,y)-300),k=E.out(P(d,.1+y*.13,.35)),x=76+y*86,h=Math.abs(v)*sc*k;
        ctx.fillStyle=v<0?'#e04848':'#35e08a';if(v>=0)rr(x,base-h,66,Math.max(h,2),8);else rr(x,base,66,Math.max(h,2),8);ctx.fill();
        text(y?String(y):'지금',x+33,base-380,{s:26,w:800,c:C.dim});}
      const q=T-WT('t4',3);
      if(q>=0)group(540,1160,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('10년 뒤 −89만 원',0,0,{f:'D',s:96,c:C.red,glow:'rgba(255,77,77,.5)'}));
      text('6년째부터 적자',540,1290,{s:44,w:900,c:C.dim,alpha:P(d,1.8,.4)});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawCafeShop(540,700,E.back(P(a,0,.45))*.95+.001);
    stampBox('월세를 쫓아가는 장사',540,1250,T-WT('e2',0),{s:66,rot:-.06});
  }},
};
"""
EP26_COVER = cover2('EP.26', '카페', 200, '한 달 남는 돈', '100만 원', '월세 5년 오르면', '17만 원',
                    "drawCafeShop(540,560,.42);", 'rgba(160,105,61,.25)')
build(SH + 'cafe-rent.html', '비밀의 계산기 카페 편', 'EP.26 카페', 'cafe-rent', 'cafe_rent', 'EP26', 'EP.26',
      EP26_CUES, EP26_CONSTS, EP26_HELPERS,
      "const SEQ=['1','3','5','00','00','−','1','2','5','00','00','='];   // 13,500,000 − 12,500,000",
      KEYS_EXTRA, EP26_SCENES, EP26_COVER, 'rent')
apply_ref(SH + 'cafe-rent.html', ['월세가 해마다 5%씩 오르면','5년 뒤 100만 원이 17만 원'], '매출 고정·월세 해마다 5% 인상 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.27 동네 옷가게 — 정가 판매 비율 ═══════════════════════════════
EP27_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'동네 옷가게, 한 벌 6만 원에 월 200벌, 매출 [1,200만 원].',sfx:[[0,'whoosh'],['w9','impact']],shake:[['w9',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 [정가로 팔린 옷은] 열 벌 중 몇 벌일까요?',sfx:[['w1','buzz']]},
  {id:'k1',sc:'cost',   text:'옷 매입비 {600만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {120만 원}.'},
  {id:'k3',sc:'cost',   text:'주말 알바 {120만 원}.'},
  {id:'k4',sc:'cost',   text:'전기와 카드 수수료 {60만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'정가로 다 팔면 얼마 남을까요? <300만 원>.',pause:300,sfx:[[0,'whoosh'],['w5','coin']]},
  {id:'t1',sc:'rack',   text:'그런데 정가로 팔린 건 열 벌 중 [여섯 벌], 세 벌은 반값 세일이었죠.',sfx:[[0,'scratch'],[.02,'impact'],['w7','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'rack',   text:'나머지 한 벌은 {재고로 남았죠}.',sfx:[['w3','buzz']],shake:[['w3',10,.3]]},
  {id:'t3',sc:'rack',   text:'매출은 1,200만 원이 아니라 {900만 원}.',sfx:[['w4','pop']]},
  {id:'t4',sc:'rack',   text:'남는 돈은 300만 원에서 {0원이죠}.',pause:300,sfx:[['w4','stamp']],shake:[['w4',10,.3]]},
  {id:'e1',sc:'end',    text:'옷가게는 옷을 파는 장사가 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[정가로 팔리는 여섯 벌 장사]였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 동네 옷가게 월 비용 (단위: 만 원) — 예시: 월 200벌 매입(벌당 3만 원), 정가 6만 원
const COSTS=[
  {cue:'k1',ic:'👕',lb:'옷 매입 200벌',v:600},
  {cue:'k2',ic:'🏠',lb:'임대료',v:120},
  {cue:'k3',ic:'👤',lb:'주말 알바',v:120},
  {cue:'k4',ic:'⚡',lb:'전기·카드 수수료',v:60},
];
"""
EP27_CONSTS = """// 정가로 다 팔면 매출 1,200만 원 vs 비용 900만 원 (단위: 만 원)
const REV=1200,SCL=900/1200,X0=90;
"""
EP27_HELPERS = COIN + r"""/* 옷걸이 줄 (상표 없음) */
function drawRack(x,y,s,o={}){
  group(x,y,s,o.rot||0,o.alpha??1,()=>{
    ctx.strokeStyle='#c8d0e0';ctx.lineWidth=14;ctx.lineCap='round';line(-380,-160,380,-160);line(-380,-160,-380,250);line(380,-160,380,250);ctx.lineCap='butt';
    ['👗','👕','🧥','👚','👖'].forEach((e,i)=>{const cx=-290+i*145;ctx.strokeStyle='#c8d0e0';ctx.lineWidth=6;line(cx,-160,cx,-125);emoji(e,cx,-30,130);
      ctx.fillStyle='#fff';rr(cx-42,70,84,44,10);ctx.fill();text('6만',cx,93,{f:'D',s:30,c:'#d6301f'});});
    ctx.fillStyle='#39405a';rr(-400,235,800,26,12);ctx.fill();
  });
}
/* 옷 한 칸: state 0 정가(초록) · 1 세일(주황) · 2 재고(회색) · -1 아직 모름 */
function shirtCell(x,y,st,k=1){
  group(x,y,k,0,1,()=>{const cols=[['#c8f5d4','#2fa35a'],['#ffe0b3','#e08a00'],['#4a5063','#7d8499'],['#ffffff','#9aa3b8']],c=cols[st<0?3:st];
    ctx.fillStyle=c[0];rr(-82,-100,164,200,18);ctx.fill();ctx.strokeStyle=c[1];ctx.lineWidth=6;rr(-82,-100,164,200,18);ctx.stroke();
    ctx.save();if(st===2)ctx.globalAlpha*=.5;emoji('👕',0,-18,92);ctx.restore();
    if(st>=0)text(['정가 6만','반값 3만','재고'][st],0,64,{f:'D',s:30,c:st===2?'#cfd6e6':'#1d2433'});else text('?',0,64,{f:'D',s:44,c:'#59627c'});});
}
"""
EP27_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 옷가게 월 매출 1,200만 원 → 정가로 팔린 옷은 몇 벌? ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('동네 옷가게 · 한 벌 6만 원 · 월 200벌',540,236,{s:36,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('1,200만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawRack(540,800,E.back(P(a,0,.5))*.95+.001);
    if(b>=0)stampBox('정가로 팔린 건?',540,1265,T-WT('h1b',1),{s:72,rot:-.06});
  }},
""" + cost_scene6('정가로 다 팔면 매출 1,200만', '#d9d0ff', '#7b61d6', "'#BFB0FF'") + calc_op('3,000,000') + r"""
  /* ── 결과: 정가로 다 팔면 한 달 300만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('옷가게, 정가로 다 팔면',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 5, '300만 원', y=420, s=180) + r"""    const q=T-WT('r1',5),k=P(q,.3,.8);coinStack(540,1130,10*k,'#9ff0c4');
    text('한 벌도 안 깎고 다 팔았을 때',540,1240,{f:'D',s:48,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 정가 6 · 세일 3 · 재고 1 → 매출 900 → 남는 돈 300 → 0 ── */
  rack:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(c<0){
      text(b<0?'열 벌이 팔린 모습':'안 팔린 옷은 매입비가 그대로 묻힌다',540,250,{s:b<0?46:38,w:900,alpha:P(a,0,.3)});
      const t6=WT('t1',7),t3=WT('t1',9),t1=WT('t2',3);
      for(let i=0;i<10;i++){const st=i<6?(T>=t6+i*.12?0:-1):i<9?(T>=t3+(i-6)*.15?1:-1):(T>=t1?2:-1),k=E.back(P(a,i*.03,.3));if(k<=0)continue;
        shirtCell(130+(i%5)*205,i<5?560:850,st,k);}
      if(T>=t6)text('정가 6벌',540,1070,{f:'D',s:60,c:C.green,alpha:P(T-t6,0,.3)});
      if(T>=t3+.4)text('반값 세일 3벌',540,1160,{f:'D',s:56,c:'#FF9F43',alpha:P(T-t3,.4,.3)});
      if(T>=t1)text('재고 1벌',540,1250,{f:'D',s:56,c:'#cfd6e6',alpha:P(T-t1,0,.3)});
    }else if(d<0){
      text('이번 달 매출',540,250,{s:46,w:900});
      const k=E.out(P(T-WT('t3',4),0,.6)),base=1060;
      vCash2(210,base-600,260,600);text('1,200만',340,base-645,{f:'D',s:58,c:C.dim});text('정가로 다 팔면',340,base+50,{s:34,w:900,c:C.dim});
      const h2=600-150*k;vCash2(590,base-h2,260,h2,'#ffd27a','#e08a00');
      text(won(1200-Math.round(300*k))+'만',720,base-h2-45,{f:'D',s:60,c:'#FF9F43'});text('실제 팔린 값',720,base+50,{s:34,w:900,c:C.dim});
      text('정가 720만 + 세일 180만',540,1190,{s:36,w:900,c:C.dim,alpha:P(c,.8,.3)});
    }else{
      text('한 달 남는 돈',540,250,{s:46,w:900});
      const k=E.out(P(T-WT('t4',4),0,.6)),base=1060;
      vCash2(210,base-500,260,500);text('300만',340,base-545,{f:'D',s:60,c:C.green});text('정가로 다 팔면',340,base+50,{s:34,w:900,c:C.dim});
      const h2=500*(1-k);if(h2>2){vCash2(590,base-h2,260,h2);ctx.fillStyle='rgba(255,77,77,.6)';ctx.fillRect(590,base-500,260,500-h2);}
      text('실제',720,base+50,{s:34,w:900,c:C.dim});
      const q=T-WT('t4',4);
      if(q>=0)group(720,base-60,lerp(1.6,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('0원',0,0,{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.55)'}));
      stampBox('팔린 만큼이 아니라 정가로',540,1260,q-.2,{s:56,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawRack(540,700,E.back(P(a,0,.45))*.95+.001);
    stampBox('정가로 팔리는 여섯 벌',540,1250,T-WT('e2',0),{s:66,rot:-.06});
  }},
};
"""
EP27_COVER = cover2('EP.27', '옷가게', 170, '정가로 다 팔면', '300만 원', '실제 정가는 열 벌 중 6', '0원',
                    "drawRack(540,560,.42);", 'rgba(123,97,214,.25)')
build(SH + 'clothes.html', '비밀의 계산기 옷가게 편', 'EP.27 옷가게', 'clothes', 'clothes', 'EP27', 'EP.27',
      EP27_CUES, EP27_CONSTS, EP27_HELPERS,
      "const SEQ=['1','2','00','00','00','−','9','00','00','00','=');   // 12,000,000 − 9,000,000".replace("'=');", "'='];"),
      KEYS_EXTRA, EP27_SCENES, EP27_COVER, 'rack')
apply_ref(SH + 'clothes.html', ['정가로 팔린 건 열 벌 중 여섯','남는 돈 300만 원이 0원'], '정가 판매 60%·세일 30%·재고 10% 가정 예시 · 세금 제외')
