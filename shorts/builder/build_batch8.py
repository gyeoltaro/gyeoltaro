# EP.22 당구장 · EP.23 무인 인형뽑기방 · EP.24 공부방 — 포맷 v2 (build_batch5.py 의 공용 함수 재사용)
# 반전: 시간대 편중(낮 12시간은 적자) · 확률 설정(한 칸이 남는 돈을 가른다) · 마지막 몇 명(고정비 뒤의 사장님 몫)
# 이미 만든 묶음 파일(build_batch2~7)은 다시 돌리지 않는다 — build() 가 그 편 html 의 bundledTTS 를 비운다.
src = open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'build_batch5.py'), encoding='utf-8').read()
exec(src[:src.index("# ═══════════════════════════════ EP.13")])

SH = '/home/user/gyeoltaro/shorts/'

def cost_scene6(*a, **k):
    """cost_scene 과 같고, 1,000 이상 금액에 쉼표를 붙인다."""
    return cost_scene(*a, **k).replace("'−'+c.v+'만'", "'−'+won(c.v)+'만'")

# ═══════════════════════════════ EP.22 당구장 — 시간대 편중 ═══════════════════════════════
EP22_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'당구대 10대, 하루 16시간 영업, 월 매출 [1,200만 원].',sfx:[[0,'whoosh'],['w7','impact']],shake:[['w7',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 낮 시간은 문을 열수록 [손해죠].',sfx:[['w5','buzz']]},
  {id:'k1',sc:'cost',   text:'임대료 {350만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'전기와 냉난방 {140만 원}.'},
  {id:'k3',sc:'cost',   text:'알바 인건비 {500만 원}.'},
  {id:'k4',sc:'cost',   text:'당구대와 큐 교체비 {100만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <110만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'hours',  text:'매출은 저녁 네 시간이 {840만 원}, 낮 열두 시간은 [360만 원].',sfx:[[0,'scratch'],[.02,'impact'],['w9','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'hours',  text:'낮에 드는 전기와 알바비는 {480만 원}.',sfx:[['w4','buzz']],shake:[['w4',10,.3]]},
  {id:'t3',sc:'hours',  text:'낮 영업만 보면 {120만 원} 적자, 저녁만 열면 <230만 원>.',sfx:[['w3','buzz'],['w8','pop']]},
  {id:'t4',sc:'hours',  text:'문을 늦게 여는 게 이득이죠.',pause:300,sfx:[['w0','pop']]},
  {id:'e1',sc:'end',    text:'당구장은 오래 여는 장사가 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[붐비는 네 시간 장사]였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 당구장 월 비용 (단위: 만 원) — 예시
const COSTS=[
  {cue:'k1',ic:'🏠',lb:'임대료',v:350},
  {cue:'k2',ic:'⚡',lb:'전기·냉난방',v:140},
  {cue:'k3',ic:'👤',lb:'알바 인건비',v:500},
  {cue:'k4',ic:'🎱',lb:'당구대·큐 교체',v:100},
];
"""
EP22_CONSTS = """// 매출 1,200만 원 vs 비용 1,090만 원 (단위: 만 원)
const REV=1200,SCL=900/1200,X0=90;
"""
EP22_HELPERS = COIN + r"""/* 당구대 한 대 (상표 없음) */
function drawPool(x,y,s,o={}){
  group(x,y,s,o.rot||0,o.alpha??1,()=>{
    ctx.fillStyle='#5b3a1e';rr(-400,-230,800,460,30);ctx.fill();
    ctx.fillStyle='#1f8a4c';rr(-360,-190,720,380,16);ctx.fill();
    [[-180,-30,'#ffffff'],[120,-50,'#e53935'],[210,60,'#f4c542'],[-50,80,'#e53935']].forEach(([bx,by,col])=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(bx,by,28,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=3;ctx.stroke();});
    ctx.strokeStyle='#e0b97e';ctx.lineWidth=14;ctx.lineCap='round';line(-330,150,-215,40);ctx.lineCap='butt';
  });
}
"""
EP22_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 당구대 10대 · 하루 16시간 · 월 매출 1,200만 원 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('당구대 10대 · 하루 16시간',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('월 매출 1,200만 원',540,334,{f:'D',s:116,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawPool(540,800,E.back(P(a,0,.5))*.95+.001);
    if(b>=0)stampBox('낮에는 손해?',540,1265,T-WT('h1b',5),{s:72,rot:-.06});
  }},
""" + cost_scene6('당구장 매출 1,200만', '#c8f5d4', '#2fa35a', "'#9BE8B3'") + calc_op('1,100,000') + r"""
  /* ── 결과: 한 달 110만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('당구장, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '110만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,4*k,'#9ff0c4');
    text('16시간 다 열었을 때',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 저녁 4시간 840만 · 낮 12시간 360만 · 낮 비용 480만 → 낮 −120만 · 저녁만 열면 230만 ── */
  hours:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('시간대별 매출',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      const base=1130,k1=E.out(P(T-WT('t1',4),0,.5)),k2=E.out(P(T-WT('t1',9),0,.5));
      vCash2(190,base-600*k1,270,600*k1);if(k1>.2)text('840만',325,base-600*k1-45,{f:'D',s:60,c:C.green});
      text('저녁 4시간',325,base+50,{s:36,w:900,c:C.dim});
      vCash2(610,base-257*k2,270,257*k2,'#9aa3b8','#5d6678');if(k2>.2)text('360만',745,base-257*k2-45,{f:'D',s:60,c:'#c3cada'});
      text('낮 12시간',745,base+50,{s:36,w:900,c:C.dim});
    }else if(c<0){
      text('낮 12시간만 따로 보면',540,250,{s:46,w:900});
      const k=E.out(P(T-WT('t2',4),0,.5));
      text('낮 매출',90,420,{a:'left',s:36,w:900,c:C.green});
      ctx.fillStyle='rgba(255,255,255,.06)';rr(90,445,900,100,18);ctx.fill();cashBar(90,90+675,445,100,'#9ff0c4','#1fa864');text('360만',990,495,{a:'right',f:'D',s:56,c:C.green});
      text('낮 전기·알바비',90,640,{a:'left',s:36,w:900,c:'#ff9a9a'});
      ctx.fillStyle='rgba(255,255,255,.06)';rr(90,665,900,100,18);ctx.fill();
      ctx.fillStyle='#e04848';rr(90,665,Math.max(900*k,2),100,18);ctx.fill();if(k>.4)text('480만',990,715,{a:'right',f:'D',s:56,c:'#fff'});
      stampBox('매출보다 비용이 크다',540,1000,T-WT('t2',4)-.2,{s:62,rot:-.05});
    }else if(d<0){
      text('낮 영업 vs 저녁만 열면',540,250,{s:46,w:900});
      const g=T-WT('t3',3);
      if(g>=0)group(540,430,lerp(1.5,1,E.out(P(g,0,.25))),0,P(g,0,.12),()=>text('낮 영업 −120만 원',0,0,{f:'D',s:84,c:C.red,glow:'rgba(255,77,77,.5)'}));
      const base=1230,k=E.out(P(T-WT('t3',8),0,.6));
      vCash2(210,base-264,260,264);text('110만',340,base-309,{f:'D',s:60,c:C.dim});text('16시간 영업',340,base+50,{s:34,w:900,c:C.dim});
      const h2=264+288*k;vCash2(590,base-h2,260,h2);text((110+Math.round(120*k))+'만',720,base-h2-45,{f:'D',s:60,c:C.green});text('저녁 4시간만',720,base+50,{s:34,w:900,c:C.dim});
    }else{
      text('문을 열 시간',540,250,{s:46,w:900});
      emoji('🌙',540,600,300);
      group(540,880,lerp(1.5,1,E.out(P(d,0,.25))),0,P(d,0,.15),()=>text('저녁 7~11시',0,0,{f:'D',s:110,c:C.gold,glow:'rgba(255,197,49,.5)'}));
      stampBox('늦게 여는 게 이득',540,1130,T-WT('t4',1),{s:72,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawPool(540,700,E.back(P(a,0,.45))*.95+.001);
    stampBox('붐비는 네 시간 장사',540,1250,T-WT('e2',0),{s:70,rot:-.06});
  }},
};
"""
EP22_COVER = cover2('EP.22', '당구장', 190, '한 달 남는 돈', '110만 원', '낮 12시간 문 닫으면', '230만 원',
                    "drawPool(540,560,.42);", 'rgba(47,163,90,.22)')
build(SH + 'billiard.html', '비밀의 계산기 당구장 편', 'EP.22 당구장', 'billiard', 'billiard', 'EP22', 'EP.22',
      EP22_CUES, EP22_CONSTS, EP22_HELPERS,
      "const SEQ=['1','2','00','00','00','−','1','0','9','00','00','='];   // 12,000,000 − 10,900,000",
      KEYS_EXTRA, EP22_SCENES, EP22_COVER, 'hours')
apply_ref(SH + 'billiard.html', ['낮 12시간 문 열수록 손해','저녁 4시간만 열면 230만 원'], '당구대 10대·시간대 가동률 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.23 무인 인형뽑기방 — 확률 설정 ═══════════════════════════════
EP23_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'무인 인형뽑기방, 한 달 1만 8천 판, 매출 [1,800만 원].',sfx:[[0,'whoosh'],['w8','impact']],shake:[['w8',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 뽑힐 확률 설정 한 칸이 [남는 돈을] 가르죠.',sfx:[['w6','buzz']]},
  {id:'k1',sc:'cost',   text:'경품 구입비 {540만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {300만 원}.'},
  {id:'k3',sc:'cost',   text:'기계 할부 {170만 원}.'},
  {id:'k4',sc:'cost',   text:'전기와 관리 알바 {190만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <600만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'odds',   text:'경품 원가 3천 원, 열 판에 한 번 나오게 설정하면 한 판 {300원}.',sfx:[[0,'scratch'],[.02,'impact'],['w12','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'odds',   text:'다섯 판에 한 번으로 바꾸면, 경품비가 {1,080만 원}.',sfx:[['w6','buzz']],shake:[['w6',10,.3]]},
  {id:'t3',sc:'odds',   text:'남는 돈은 600만 원에서 <60만 원>.',sfx:[['w4','pop']]},
  {id:'t4',sc:'odds',   text:'잘 뽑힌다는 소문이 날수록 가게는 줄죠.',pause:300,sfx:[['w0','pop']]},
  {id:'e1',sc:'end',    text:'인형뽑기방은 기계 장사가 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[확률 설정 장사]였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 무인 인형뽑기방 월 비용 (단위: 만 원) — 예시: 기계 20대 × 하루 30판 × 30일 = 1만 8천 판, 1판 1,000원
const COSTS=[
  {cue:'k1',ic:'🧸',lb:'경품 구입비',v:540},
  {cue:'k2',ic:'🏠',lb:'임대료',v:300},
  {cue:'k3',ic:'🎰',lb:'기계 할부',v:170},
  {cue:'k4',ic:'⚡',lb:'전기·관리 알바',v:190},
];
"""
EP23_CONSTS = """// 매출 1,800만 원 vs 비용 1,200만 원 (단위: 만 원)
const REV=1800,SCL=900/1800,X0=90;
"""
EP23_HELPERS = COIN + r"""/* 뽑기 기계 (상표 없음) */
function drawCrane(x,y,s,o={}){
  group(x,y,s,o.rot||0,o.alpha??1,()=>{
    ctx.fillStyle='#d6336c';rr(-260,-300,520,600,28);ctx.fill();
    text('뽑기',0,-276,{f:'D',s:44,c:'#fff'});
    ctx.fillStyle='#bfe3f5';rr(-220,-240,440,360,18);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.moveTo(-220,-240);ctx.lineTo(-140,-240);ctx.lineTo(-220,-120);ctx.fill();
    emoji('🧸',-110,50,120);emoji('🐻',100,50,120);
    ctx.strokeStyle='#444';ctx.lineWidth=10;ctx.lineCap='round';line(0,-240,0,-120);line(0,-120,-42,-62);line(0,-120,42,-62);ctx.lineCap='butt';
    ctx.fillStyle='#39405a';rr(-200,150,400,110,14);ctx.fill();
    ctx.fillStyle='#f4c542';ctx.beginPath();ctx.arc(110,205,32,0,7);ctx.fill();emoji('🕹️',-90,205,76);
  });
}
/* n판에 한 번 나오는 줄: n개 동그라미 중 마지막이 경품 */
function oddsRow(n,y,r,gap,x0,lit){
  for(let i=0;i<n;i++){const x=x0+i*gap,last=i===n-1&&lit;
    ctx.fillStyle=last?C.gold:'rgba(255,255,255,.16)';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
    if(last)emoji('🧸',x,y,r*1.2);else text('1,000',x,y,{s:r*.5,w:700,c:'#c3cada'});}
}
"""
EP23_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 매출 1,800만 원 → 확률 설정 한 칸 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('무인 인형뽑기방 한 달 1만 8천 판',540,236,{s:38,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('매출 1,800만 원',540,334,{f:'D',s:120,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawCrane(540,800,E.back(P(a,0,.5))*.95+.001);
    if(b>=0)stampBox('확률 설정 한 칸?',540,1265,T-WT('h1b',6),{s:72,rot:-.06});
  }},
""" + cost_scene6('인형뽑기방 매출 1,800만', '#ffd0e2', '#d6336c', "'#FF9FC4'") + calc_op('6,000,000') + r"""
  /* ── 결과: 한 달 600만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('인형뽑기방, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '600만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,10*k,'#9ff0c4');
    text('열 판에 한 번 나올 때',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 10판에 1번(판당 300원) → 5판에 1번(경품비 1,080만) → 남는 돈 600만 → 60만 ── */
  odds:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('경품 원가 3,000원 짜리 하나',540,250,{s:44,w:900,alpha:P(a,0,.3)});
      oddsRow(10,520,40,86,126,T>=WT('t1',8));
      text('열 판에 한 번',540,640,{s:40,w:900,c:C.dim,alpha:P(a,.2,.3)});
      text('3,000원 ÷ 10판',540,790,{f:'D',s:64,c:'#fff',alpha:P(a,.35,.3)});
      const q=T-WT('t1',12);
      if(q>=0)group(540,980,lerp(1.5,1,E.out(P(q,0,.25))),0,P(q,0,.12),()=>text('한 판 300원',0,0,{f:'D',s:130,c:C.green,glow:'rgba(53,224,138,.5)'}));
    }else if(c<0){
      text('다섯 판에 한 번으로 바꾸면',540,250,{s:46,w:900});
      oddsRow(5,480,56,180,180,true);
      const k=E.out(P(T-WT('t2',6),0,.5));
      text('열 판에 한 번 · 경품비',90,700,{a:'left',s:34,w:900,c:C.dim});
      ctx.fillStyle='rgba(255,255,255,.06)';rr(90,725,900,100,18);ctx.fill();cashBar(90,90+450,725,100,'#ffd0e2','#d6336c');text('540만',990,775,{a:'right',f:'D',s:50,c:'#ffd0e2'});
      ctx.fillStyle='#e04848';rr(90,870,Math.max(900*k,2),100,18);ctx.fill();if(k>.4)text('1,080만',990,920,{a:'right',f:'D',s:56,c:'#fff'});
      text('다섯 판에 한 번 · 경품비',90,845,{a:'left',s:34,w:900,c:'#ff9a9a'});
    }else if(d<0){
      text('한 달 남는 돈',540,250,{s:46,w:900});
      const k=E.out(P(T-WT('t3',4),0,.6)),base=1060;
      vCash2(210,base-500,260,500);text('600만',340,base-545,{f:'D',s:60,c:C.green});text('열 판에 한 번',340,base+50,{s:36,w:900,c:C.dim});
      const h2=500*(1-.9*k);vCash2(590,base-h2,260,h2);ctx.fillStyle='rgba(255,77,77,.6)';ctx.fillRect(590,base-500,260,500-h2);
      text((600-Math.round(540*k))+'만',720,base-545,{f:'D',s:60,c:'#FF9F43'});text('다섯 판에 한 번',720,base+50,{s:36,w:900,c:C.dim});
      stampBox('설정 한 칸에 −540만',540,1260,T-WT('t3',4)-.3,{s:64,rot:-.05});
    }else{
      text('잘 뽑힌다는 소문이 나면',540,250,{s:46,w:900});
      emoji('🧸',540,600,300);
      group(540,900,lerp(1.5,1,E.out(P(d,0,.25))),0,P(d,0,.15),()=>text('손님 늘고 이익 줄고',0,0,{f:'D',s:76,c:C.gold}));
      stampBox('확률 설정 한 칸',540,1150,T-WT('t4',1),{s:72,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawCrane(540,700,E.back(P(a,0,.45))*.95+.001);
    stampBox('확률 설정 장사',540,1250,T-WT('e2',0),{s:80,rot:-.06});
  }},
};
"""
EP23_COVER = cover2('EP.23', '인형뽑기방', 150, '한 달 남는 돈', '600만 원', '5판에 1번 나오게 하면', '60만 원',
                    "drawCrane(540,560,.42);", 'rgba(214,51,108,.22)')
build(SH + 'crane.html', '비밀의 계산기 인형뽑기방 편', 'EP.23 인형뽑기방', 'crane', 'crane', 'EP23', 'EP.23',
      EP23_CUES, EP23_CONSTS, EP23_HELPERS,
      "const SEQ=['1','8','00','00','00','−','1','2','00','00','00','='];   // 18,000,000 − 12,000,000",
      KEYS_EXTRA, EP23_SCENES, EP23_COVER, 'odds')
apply_ref(SH + 'crane.html', ['5판에 1번 나오게 하면','남는 돈 600만 → 60만 원'], '경품 원가 3천 원·1판 1,000원 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.24 공부방 — 마지막 몇 명 ═══════════════════════════════
EP24_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'공부방 학생 25명, 월 교습비 [750만 원].',sfx:[[0,'whoosh'],['w5','impact']],shake:[['w5',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 학생 [두 명만] 그만둬도 큰일 나죠.',sfx:[['w2','buzz']]},
  {id:'k1',sc:'cost',   text:'강사 인건비 {300만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {200만 원}.'},
  {id:'k3',sc:'cost',   text:'교재와 소모품 {75만 원}.'},
  {id:'k4',sc:'cost',   text:'전기와 광고비 {100만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <75만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'quit',   text:'학생 한 명이 그만두면 {27만 원이} 사라지죠.',sfx:[[0,'scratch'],[.02,'impact'],['w4','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'quit',   text:'월세와 강사료는 그대로니까요.',sfx:[['w0','buzz']]},
  {id:'t3',sc:'quit',   text:'두 명이 나가면 남는 돈은 75만 원에서 <21만 원>.',sfx:[['w7','pop']],shake:[['w5',10,.3]]},
  {id:'t4',sc:'quit',   text:'손익분기는 23명, 사장님 몫은 마지막 세 명이죠.',pause:300,sfx:[['w1','pop'],['w6','stamp']]},
  {id:'e1',sc:'end',    text:'학원 월급은 학생 전부가 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[마지막 세 명]이었던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 공부방 월 비용 (단위: 만 원) — 학생 25명 × 30만 원, 교재 1인 3만 원(예시)
const COSTS=[
  {cue:'k1',ic:'👩‍🏫',lb:'강사 인건비',v:300},
  {cue:'k2',ic:'🏠',lb:'임대료',v:200},
  {cue:'k3',ic:'📚',lb:'교재·소모품',v:75},
  {cue:'k4',ic:'💡',lb:'전기·광고비',v:100},
];
"""
EP24_CONSTS = """// 매출 750만 원 vs 비용 675만 원 (단위: 만 원)
const REV=750,SCL=900/750,X0=90;
"""
EP24_HELPERS = COIN + r"""/* 학생 칸 그리드: n칸 중 gone 번호는 빈 자리 */
function seatGrid(x0,y0,dx,dy,w,h,gone,k){
  for(let i=0;i<25;i++){const col=i%5,row=Math.floor(i/5),x=x0+col*dx,y=y0+row*dy,kk=E.back(P(k,i*.012,.25));if(kk<=0)continue;
    const g=gone.includes(i);
    group(x,y,kk,0,1,()=>{ctx.fillStyle=g?'rgba(229,57,53,.35)':'rgba(255,255,255,.92)';rr(-w/2,-h/2,w,h,14);ctx.fill();
      if(g)text('✕',0,0,{f:'D',s:h*.6,c:'#fff'});else emoji('🎒',0,0,h*.62);});}
}
/* 공부방 칠판 */
function drawBoard(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#8a5a2b';rr(-400,-260,800,520,24);ctx.fill();
    ctx.fillStyle='#1f5a3a';rr(-370,-230,740,360,12);ctx.fill();
    text('25명 × 30만',0,-120,{f:'D',s:80,c:'#f4f1e8'});text('= 750만 원',0,-20,{f:'D',s:80,c:'#f4f1e8'});
    ctx.fillStyle='#e8d9b0';rr(-300,150,220,30,10);ctx.fill();
    [-260,-100,60,220].forEach(px=>emoji('🎒',px,215,90));
  });
}
"""
EP24_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 학생 25명 · 월 750만 원 → 두 명만 그만둬도 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('공부방 학생 25명',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('월 교습비 750만 원',540,334,{f:'D',s:112,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    seatGrid(190,520,175,150,140,110,b>=0&&T>=WT('h1b',2)?[8,16]:[],E.out(P(a,0,.6)));
    if(b>=0)stampBox('두 명만 빠져도?',540,1265,T-WT('h1b',2),{s:72,rot:-.06});
  }},
""" + cost_scene6('공부방 교습비 750만', '#ffe9a8', '#e0a800', "'#FFE066'") + calc_op('750,000') + r"""
  /* ── 결과: 한 달 75만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('공부방, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '75만 원', y=420, s=190) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,3*k,'#9ff0c4');
    text('학생 25명이 다 있을 때',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 한 명 = 27만 · 고정비 그대로 · 두 명이면 75 → 21 · 사장님 몫은 마지막 세 명 ── */
  quit:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('학생 한 명이 그만두면',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      seatGrid(210,420,150,115,120,90,T>=WT('t1',2)?[12]:[],E.out(P(a,0,.5)));
      const q=T-WT('t1',4);
      if(q>=0)group(540,1060,lerp(1.5,1,E.out(P(q,0,.25))),0,P(q,0,.12),()=>text('−27만 원',0,0,{f:'D',s:140,c:C.red,glow:'rgba(255,77,77,.55)'}));
      text('교실에 한 칸이 빈다',540,1200,{s:40,w:900,c:C.dim,alpha:P(q,.3,.3)});
    }else if(c<0){
      text('한 명이 빠져도',540,250,{s:46,w:900});
      [['임대료 200만','그대로',C.red],['강사 인건비 300만','그대로',C.red]].forEach(([l,v,col],i)=>{
        const k=P(b,.1+i*.3,.3);if(k<=0)return;const y=520+i*160;
        group(0,(1-E.out(k))*30,1,0,k,()=>{ctx.fillStyle='rgba(255,255,255,.08)';rr(90,y-60,900,120,20);ctx.fill();text(l,120,y,{a:'left',s:42,w:900});text(v,960,y,{a:'right',f:'D',s:64,c:col});});
      });
      stampBox('고정비는 안 줄어든다',540,980,T-WT('t2',0)-.2,{s:66,rot:-.05});
    }else if(d<0){
      text('두 명이 나가면',540,250,{s:46,w:900});
      const k=E.out(P(T-WT('t3',5),0,.6)),base=1080;
      vCash2(210,base-500,260,500);text('75만',340,base-545,{f:'D',s:60,c:C.green});text('학생 25명',340,base+50,{s:36,w:900,c:C.dim});
      const h2=500*(1-.72*k);vCash2(590,base-h2,260,h2);ctx.fillStyle='rgba(255,77,77,.6)';ctx.fillRect(590,base-500,260,500-h2);
      text((75-Math.round(54*k))+'만',720,base-545,{f:'D',s:60,c:'#FF9F43'});text('학생 23명',720,base+50,{s:36,w:900,c:C.dim});
      stampBox('남는 돈 72% 증발',540,1260,T-WT('t3',5)-.2,{s:70,rot:-.05});
    }else{
      text('학생 25명 중 사장님 몫은',540,250,{s:44,w:900});
      for(let i=0;i<25;i++){const k=E.back(P(d,i*.018,.25));if(k<=0)continue;const mine=i>=22,x=108+i*36;
        group(x,640,k,0,1,()=>{ctx.fillStyle=mine?C.gold:'rgba(255,255,255,.22)';rr(-16,-70,32,140,8);ctx.fill();});}
      text('월세·강사료 몫 22명',108,830,{a:'left',s:34,w:900,c:C.dim,alpha:P(d,.5,.3)});
      text('사장님 몫',990,780,{a:'right',s:40,w:900,c:C.gold,alpha:P(d,.6,.3)});
      stampBox('마지막 세 명',540,1050,T-WT('t4',6),{s:84,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawBoard(540,700,E.back(P(a,0,.45))*.95+.001);
    stampBox('마지막 세 명',540,1250,T-WT('e2',0),{s:80,rot:-.06});
  }},
};
"""
EP24_COVER = cover2('EP.24', '공부방', 190, '한 달 남는 돈', '75만 원', '학생 2명 그만두면', '21만 원',
                    "drawBoard(540,560,.46);", 'rgba(255,197,49,.22)')
build(SH + 'tutoring.html', '비밀의 계산기 공부방 편', 'EP.24 공부방', 'tutoring', 'tutoring', 'EP24', 'EP.24',
      EP24_CUES, EP24_CONSTS, EP24_HELPERS,
      "const SEQ=['7','5','00','00','0','−','6','7','5','00','00','='];   // 7,500,000 − 6,750,000",
      KEYS_EXTRA, EP24_SCENES, EP24_COVER, 'quit')
apply_ref(SH + 'tutoring.html', ['학생 두 명 그만두면','75만 원이 21만 원으로'], '학생 25명·월 30만·교재 3만 가정 예시 · 세금 제외')
