# EP.28 동네 정육점 · EP.29 식자재 납품 · EP.30 동네 베이글 가게 — 포맷 v2 (build_batch5.py 의 공용 함수 재사용)
# 반전: 수율(손질하고 남은 고기만 판다) · 입금 지연(장부 흑자, 통장 적자) · 계단식 고정비(손님 20% 늘어도 직원 1명 값)
# 공감 한 줄 시험(EP.28~): EP.28·EP.29 있음 / EP.30 없음.
# 이미 만든 묶음 파일(build_batch2~9)은 다시 돌리지 않는다 — build() 가 그 편 html 의 bundledTTS 를 비운다.
src = open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'build_batch5.py'), encoding='utf-8').read()
exec(src[:src.index("# ═══════════════════════════════ EP.13")])

SH = '/home/user/gyeoltaro/shorts/'

def cost_scene6(*a, **k):
    return cost_scene(*a, **k).replace("'−'+c.v+'만'", "'−'+won(c.v)+'만'")

# ═══════════════════════════════ EP.28 동네 정육점 — 수율 ═══════════════════════════════
EP28_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'동네 정육점, 고기 800kg 팔면 월 매출 [2,000만 원].',sfx:[[0,'whoosh'],['w7','impact']],shake:[['w7',12,.35]]},
  {id:'h1b',sc:'hook',  text:'손질하다 버리는 뼈와 지방, 이게 [남는 돈을 깎죠].',sfx:[['w5','buzz']]},
  {id:'k1',sc:'cost',   text:'고기 매입비 {1,200만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {200만 원}.'},
  {id:'k3',sc:'cost',   text:'인건비 {250만 원}.'},
  {id:'k4',sc:'cost',   text:'전기와 포장비 {100만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <250만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'yield',  text:'그런데 손질하면 뼈와 지방이 {25%}, 팔 수 있는 건 75%죠.',sfx:[[0,'scratch'],[.02,'impact'],['w4','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'yield',  text:'팔 고기가 {600kg이면} 매출은 {1,500만 원}.',sfx:[['w4','pop']]},
  {id:'t3',sc:'yield',  text:'매입비는 그대로라 남는 돈은 {250만 원 적자}.',sfx:[['w4','stamp']],shake:[['w4',10,.3]]},
  {id:'t4',sc:'yield',  text:'그래서 kg당 {4,200원} 더 받아야 본전이죠.',pause:300,sfx:[['w2','pop']]},
  {id:'e1',sc:'end',    text:'정육점은 고기를 파는 장사가 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[손질하고 남은 고기를 파는 장사]였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 정육점 월 비용 (단위: 만 원) — 예시: 매입 kg당 15,000원 × 800kg
const COSTS=[
  {cue:'k1',ic:'🥩',lb:'고기 매입 800kg',v:1200},
  {cue:'k2',ic:'🏠',lb:'임대료',v:200},
  {cue:'k3',ic:'👤',lb:'인건비',v:250},
  {cue:'k4',ic:'⚡',lb:'전기·포장비',v:100},
];
"""
EP28_CONSTS = """// 800kg × 25,000원 = 매출 2,000만 원 vs 비용 1,750만 원 (단위: 만 원)
const REV=2000,SCL=900/2000,X0=90;
"""
EP28_HELPERS = COIN + r"""/* 정육점 진열대 (상표 없음) */
function drawMeat(x,y,s,o={}){
  group(x,y,s,o.rot||0,o.alpha??1,()=>{
    ctx.fillStyle='#5a2a2a';rr(-380,-40,760,300,28);ctx.fill();
    ctx.fillStyle='#e9d9c4';rr(-340,-20,680,70,18);ctx.fill();
    emoji('🥩',-180,-150,230);emoji('🥩',40,-175,200);emoji('🍖',230,-150,190);
    ctx.fillStyle='#fff';rr(-90,90,180,70,16);ctx.fill();text('800kg',0,126,{f:'D',s:44,c:'#b3261e'});
  });
}
"""
EP28_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 정육점 월 매출 2,000만 원 → 뼈·지방이 남는 돈을 깎는다 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('동네 정육점 · 고기 800kg (월)',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('2,000만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawMeat(540,830,E.back(P(a,0,.5))*.95+.001);
    if(b>=0){group(540,470,1,0,P(b,0,.3),()=>{ctx.fillStyle='rgba(255,255,255,.92)';rr(-300,-38,600,76,38);ctx.fill();text('🦴 뼈·지방은 못 판다',0,2,{s:36,w:900,c:C.ink});});
      stampBox('뼈와 지방은?',540,1265,T-WT('h1b',5),{s:72,rot:-.06});}
  }},
""" + cost_scene6('정육점 매출 2,000만', '#ffd3d0', '#d6453d', "'#FF8A80'") + calc_op('2,500,000') + r"""
  /* ── 결과: 한 달 250만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('정육점, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '250만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,8*k,'#9ff0c4');
    text('하루 약 8만 원',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 800kg → 팔 수 있는 600kg · 매출 2,000 → 1,500 · 250 → −250 · kg당 +4,200원 ── */
  yield:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('800kg를 손질하면',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      const k=E.out(P(a,.1,.5)),X=100,W1=840,cut=T-WT('t1',4);
      const wg=W1*.75,wb=W1*.25,sh=cut>=0?E.out(P(cut,0,.5))*90:0;
      ctx.globalAlpha*=k;
      vCash2(X,520,wg,200,'#ffb3ad','#d6453d');
      ctx.fillStyle=cut>=0?'#7d8499':'#d6453d';rr(X+wg+(cut>=0?18:0),520+sh,wb-(cut>=0?18:0),200,16);ctx.fill();
      ctx.globalAlpha/=Math.max(k,.001);
      if(k>.8){text('800kg',X+W1/2,470,{f:'D',s:56,c:'#fff',alpha:cut>=0?0:1});
        if(cut>=0){text('팔 수 있는 고기 600kg',X+wg/2,625,{s:34,w:900,c:'#fff',max:600});
          text('🦴 뼈·지방 200kg',X+wg+wb/2+10,635+sh,{s:30,w:900,c:'#cfd6e6',max:240});
          group(X+wg+wb/2,420,lerp(1.6,1,E.out(P(cut,0,.3))),0,P(cut,0,.15),()=>text('−25%',0,0,{f:'D',s:96,c:C.red,glow:'rgba(255,77,77,.5)'}));}}
    }else if(c<0){
      text('팔 수 있는 만큼만 번다',540,250,{s:46,w:900});
      const k=E.out(P(b,0,.6)),base=1060;
      vCash2(210,base-500,260,500,'#ffb3ad','#d6453d');text('2,000만',340,base-545,{f:'D',s:58,c:C.dim});text('800kg 다 팔면',340,base+50,{s:34,w:900,c:C.dim});
      const h2=500-125*k;vCash2(590,base-h2,260,h2,'#ffd27a','#e08a00');
      text(won(2000-Math.round(500*k))+'만',720,base-h2-45,{f:'D',s:60,c:'#FF9F43'});text('600kg 팔면',720,base+50,{s:34,w:900,c:C.dim});
    }else if(d<0){
      text('한 달 남는 돈',540,250,{s:46,w:900});
      const k=E.out(P(T-WT('t3',4),0,.6)),base=740;
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=4;line(120,base,960,base);
      vCash2(210,base-275,260,275);text('250만',340,base-320,{f:'D',s:60,c:C.green});text('800kg 다 팔면',340,350,{s:34,w:900,c:C.dim});
      const h2=275*k;ctx.fillStyle='#e04848';rr(590,base,260,Math.max(h2,1),16);ctx.fill();
      text('손질하고 팔면',720,350,{s:34,w:900,c:C.dim});if(k>.3)text('−250만',720,base+275+60,{f:'D',s:60,c:C.red});
      stampBox('흑자에서 적자로',540,1280,T-WT('t3',4)-.2,{s:68,rot:-.05});
    }else{
      text('본전이 되려면, kg당',540,250,{s:46,w:900});
      [['지금 받는 값','25,000원','#ffd27a'],['본전 값','29,200원','#9ff0c4']].forEach(([l,v,col],i)=>{
        const k=P(d,.1+i*.4,.3);if(k<=0)return;const y=520+i*190;
        group(0,(1-E.out(k))*30,1,0,k,()=>{ctx.fillStyle='rgba(255,255,255,.08)';rr(90,y-80,900,160,20);ctx.fill();text(l,130,y,{a:'left',s:40,w:900,c:C.dim});text(v,950,y,{a:'right',f:'D',s:78,c:col});});});
      const q=T-WT('t4',2);
      if(q>=0)group(540,1000,lerp(1.6,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('+4,200원',0,0,{f:'D',s:140,c:C.red,glow:'rgba(255,77,77,.5)'}));
      text('(1,750만 원 ÷ 600kg)',540,1140,{s:34,w:800,c:C.dim,alpha:P(q,.4,.3)});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawMeat(540,700,E.back(P(a,0,.45))*.95+.001);
    stampBox('손질하고 남은 고기',540,1250,T-WT('e2',0),{s:70,rot:-.06});
  }},
};
"""
EP28_COVER = cover2('EP.28', '정육점', 170, '고기 다 팔면', '250만 원', '손질하고 나면', '−250만 원',
                    "drawMeat(540,560,.42);", 'rgba(214,69,61,.22)')
build(SH + 'butcher.html', '비밀의 계산기 정육점 편', 'EP.28 정육점', 'butcher', 'butcher', 'EP28', 'EP.28',
      EP28_CUES, EP28_CONSTS, EP28_HELPERS,
      "const SEQ=['2','0','00','00','00','−','1','7','5','00','00','='];   // 20,000,000 − 17,500,000",
      KEYS_EXTRA, EP28_SCENES, EP28_COVER, 'yield')
apply_ref(SH + 'butcher.html', ['고기 800kg 다 팔면 250만 원','손질하면 250만 원 적자'], '매입 kg당 15,000원·판매 25,000원·손질 손실 25% 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.29 식자재 납품 — 입금 지연 ═══════════════════════════════
EP29_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'식자재 납품, 매출이 2배로 뛰어 월 [3,000만 원].',sfx:[[0,'whoosh'],['w6','impact']],shake:[['w6',12,.35]]},
  {id:'h1b',sc:'hook',  text:'입금 기다려 본 적 있다면, [장부 숫자는] 믿으면 안 되죠.',sfx:[['w5','buzz']]},
  {id:'k1',sc:'cost',   text:'식재료 매입 {2,200만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료와 창고 {150만 원}.'},
  {id:'k3',sc:'cost',   text:'배송 인건비 {250만 원}.'},
  {id:'k4',sc:'cost',   text:'차량과 기름값 {100만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <300만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'late',   text:'그런데 거래처 입금은 [두 달 뒤] 들어오죠.',sfx:[[0,'scratch'],[.02,'impact'],['w3','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'late',   text:'이번 달 통장에 들어온 돈은 두 달 전 매출 {1,500만 원}.',sfx:[['w9','pop']]},
  {id:'t3',sc:'late',   text:'나간 돈 2,700만 원을 빼면 통장은 {−1,200만 원}.',sfx:[['w6','stamp']],shake:[['w6',10,.3]]},
  {id:'t4',sc:'late',   text:'장부는 흑자인데, 장사가 잘될수록 {돈이 마르죠}.',pause:300,sfx:[['w4','buzz']],shake:[['w4',10,.3]]},
  {id:'e1',sc:'end',    text:'식자재 납품은 물건을 파는 장사가 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[입금을 기다리는 장사]였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 식자재 납품 월 비용 (단위: 만 원) — 예시
const COSTS=[
  {cue:'k1',ic:'🥬',lb:'식재료 매입',v:2200},
  {cue:'k2',ic:'🏠',lb:'임대료·창고',v:150},
  {cue:'k3',ic:'👤',lb:'배송 인건비',v:250},
  {cue:'k4',ic:'⛽',lb:'차량·기름값',v:100},
];
"""
EP29_CONSTS = """// 매출 3,000만 원 vs 비용 2,700만 원 (단위: 만 원)
const REV=3000,SCL=900/3000,X0=90;
"""
EP29_HELPERS = COIN + r"""/* 납품 트럭 (상표 없음) */
function drawTruck(x,y,s,o={}){
  group(x,y,s,o.rot||0,o.alpha??1,()=>{
    ctx.fillStyle='#e9eef8';rr(-380,-170,520,330,26);ctx.fill();
    ctx.fillStyle='#3d6fd1';rr(150,-90,230,250,30);ctx.fill();ctx.fillStyle='#cfe3ff';rr(200,-60,150,100,14);ctx.fill();
    emoji('📦',-250,-70,140);emoji('🥬',-120,-70,140);emoji('📦',10,-70,140);
    [[-250,190],[60,190],[280,190]].forEach(([cx,cy])=>{ctx.fillStyle='#222';ctx.beginPath();ctx.arc(cx,cy,48,0,7);ctx.fill();ctx.fillStyle='#aab';ctx.beginPath();ctx.arc(cx,cy,20,0,7);ctx.fill();});
  });
}
"""
EP29_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 식자재 납품 월 매출 3,000만 원 → 장부 숫자는 믿으면 안 된다 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('식자재 납품 (월) · 매출 2배',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('3,000만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawTruck(540,830,E.back(P(a,0,.5))*.95+.001);
    if(b>=0){group(540,470,1,0,P(b,0,.3),()=>{ctx.fillStyle='rgba(255,255,255,.92)';rr(-300,-38,600,76,38);ctx.fill();text('📒 장부 ≠ 통장',0,2,{s:38,w:900,c:C.ink});});
      stampBox('입금은 언제?',540,1265,T-WT('h1b',5),{s:72,rot:-.06});}
  }},
""" + cost_scene6('납품 매출 3,000만', '#d6f0c8', '#3f9a2b', "'#9BE37F'") + calc_op('3,000,000') + r"""
  /* ── 결과: 장부상 한 달 300만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('납품, 장부상 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '300만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,10*k,'#9ff0c4');
    text('하루 약 10만 원 (장부에서)',540,1240,{f:'D',s:48,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 입금 두 달 뒤 → 이번 달 통장 +1,500 → 나간 2,700 → 통장 −1,200 ── */
  late:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('판 돈이 들어오는 날',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      const nodes=[['판매',150],['한 달 뒤',540],['두 달 뒤 입금',930]],k=E.out(P(a,.1,.7));
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=8;line(150,640,150+780*k,640);
      nodes.forEach(([l,x],i)=>{const on=k>=i/2-.01;ctx.fillStyle=i===2?'#ffd27a':'#fff';ctx.globalAlpha*=on?1:.25;ctx.beginPath();ctx.arc(x,640,i===2?44:32,0,7);ctx.fill();
        text(l,x,740,{s:36,w:900,c:i===2?'#ffd27a':'#fff',max:300});ctx.globalAlpha/=on?1:.25;});
      const q=T-WT('t1',3);if(q>=0)group(930,520,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('2달',0,0,{f:'D',s:110,c:'#ffd27a',glow:'rgba(255,197,49,.5)'}));
      text('매출 3,000만 원 = 아직 못 받음',540,960,{s:44,w:900,c:C.dim,alpha:P(a,1.2,.4)});
    }else if(c<0){
      text('이번 달 통장에 들어온 돈',540,250,{s:46,w:900});
      [['이번 달 판 돈','3,000만 · 아직 못 받음','#ff9a9a',.6],['들어온 돈 (두 달 전 매출)','1,500만 원','#9ff0c4',1]].forEach(([l,v,col,al],i)=>{
        const k=P(b,.05+i*.5,.3);if(k<=0)return;const y=540+i*190;
        group(0,(1-E.out(k))*30,1,0,k*al,()=>{ctx.fillStyle='rgba(255,255,255,.08)';rr(90,y-80,900,160,20);ctx.fill();text(l,120,y-24,{a:'left',s:34,w:900,c:C.dim,max:700});text(v,120,y+34,{a:'left',f:'D',s:60,c:col,max:800});});});
    }else if(d<0){
      text('이번 달 통장',540,250,{s:46,w:900});
      const k=E.out(P(c,.1,.6));
      ctx.fillStyle='#35e08a';rr(120,500,450*k,150,18);ctx.fill();text('들어온 돈 1,500만',120,470,{a:'left',s:34,w:900,c:'#9ff0c4'});
      ctx.fillStyle='#e04848';rr(120,760,810*k,150,18);ctx.fill();text('나간 돈 2,700만',120,730,{a:'left',s:34,w:900,c:'#ff9a9a'});
      const q=T-WT('t3',6);
      if(q>=0)group(540,1100,lerp(1.6,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('−1,200만 원',0,0,{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.55)'}));
    }else{
      text('같은 달, 두 숫자',540,250,{s:46,w:900});
      [['📒 장부','+300만 원','#9ff0c4'],['💳 통장','−1,200만 원','#ff9a9a']].forEach(([l,v,col],i)=>{
        const k=P(d,.05+i*.4,.3);if(k<=0)return;const y=540+i*190;
        group(0,(1-E.out(k))*30,1,0,k,()=>{ctx.fillStyle='rgba(255,255,255,.08)';rr(90,y-80,900,160,20);ctx.fill();text(l,130,y,{a:'left',s:44,w:900,c:C.dim});text(v,950,y,{a:'right',f:'D',s:72,c:col});});});
      stampBox('잘될수록 돈이 마른다',540,1060,T-WT('t4',4),{s:64,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawTruck(540,700,E.back(P(a,0,.45))*.95+.001);
    stampBox('입금을 기다리는 장사',540,1250,T-WT('e2',0),{s:66,rot:-.06});
  }},
};
"""
EP29_COVER = cover2('EP.29', '식자재 납품', 130, '장부에선', '+300만 원', '통장에선', '−1,200만 원',
                    "drawTruck(540,560,.4);", 'rgba(63,154,43,.22)')
build(SH + 'receivable.html', '비밀의 계산기 식자재 납품 편', 'EP.29 식자재 납품', 'receivable', 'receivable', 'EP29', 'EP.29',
      EP29_CUES, EP29_CONSTS, EP29_HELPERS,
      "const SEQ=['3','0','00','00','00','−','2','7','00','00','00','='];   // 30,000,000 − 27,000,000",
      KEYS_EXTRA, EP29_SCENES, EP29_COVER, 'late')
apply_ref(SH + 'receivable.html', ['매출이 2배로 뛴 달','장부 +300만, 통장 −1,200만'], '매출·비용·입금 두 달 지연 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.30 동네 베이글 가게 — 계단식 고정비 ═══════════════════════════════
EP30_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'동네 베이글 가게, 하루 150개, 월 매출 [1,575만 원].',sfx:[[0,'whoosh'],['w7','impact']],shake:[['w7',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 [손님이 20% 늘면] 오히려 줄어들죠.',sfx:[['w1','buzz']]},
  {id:'k1',sc:'cost',   text:'재료비 {550만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {250만 원}.'},
  {id:'k3',sc:'cost',   text:'알바 인건비 {300만 원}.'},
  {id:'k4',sc:'cost',   text:'전기와 포장비 {100만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <375만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'step',   text:'손님이 20% 늘면 매출은 {315만 원} 늘고,',sfx:[[0,'scratch'],[.02,'impact'],['w4','pop']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'step',   text:'재료비 {110만 원}, 알바 한 명 더 {216만 원}.',sfx:[['w1','buzz'],['w7','buzz']],shake:[['w7',10,.3]]},
  {id:'t3',sc:'step',   text:'남는 돈은 375만 원에서 {364만 원}.',sfx:[['w4','pop']]},
  {id:'t4',sc:'step',   text:'손님이 20% 늘었는데 {11만 원 줄었죠}.',pause:300,sfx:[['w3','stamp']],shake:[['w3',10,.3]]},
  {id:'e1',sc:'end',    text:'베이글 가게는 빵을 파는 장사가 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[직원 한 명 단위로 커지는 장사]였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 베이글 가게 월 비용 (단위: 만 원) — 예시: 3,500원 × 하루 150개 × 30일
const COSTS=[
  {cue:'k1',ic:'🥯',lb:'재료비 35%',v:550},
  {cue:'k2',ic:'🏠',lb:'임대료',v:250},
  {cue:'k3',ic:'👤',lb:'알바 인건비',v:300},
  {cue:'k4',ic:'⚡',lb:'전기·포장비',v:100},
];
"""
EP30_CONSTS = """// 매출 1,575만 원 vs 비용 1,200만 원 (단위: 만 원)
const REV=1575,SCL=900/1575,X0=90;
"""
EP30_HELPERS = COIN + r"""/* 베이글 진열 (상표 없음) */
function drawBagel(x,y,s,o={}){
  group(x,y,s,o.rot||0,o.alpha??1,()=>{
    ctx.fillStyle='#6b4a2f';rr(-380,60,760,200,28);ctx.fill();
    ctx.fillStyle='#e9d3b0';rr(-340,80,680,60,18);ctx.fill();
    emoji('🥯',-210,-60,230);emoji('🥯',20,-90,260);emoji('🥯',240,-50,210);
    ctx.fillStyle='#fff';rr(-90,150,180,70,16);ctx.fill();text('3,500원',0,186,{f:'D',s:44,c:'#8a5a2b'});
  });
}
"""
EP30_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 베이글 월 매출 1,575만 원 → 손님이 20% 늘면 오히려 줄어든다 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('동네 베이글 · 하루 150개 (월)',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('1,575만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawBagel(540,830,E.back(P(a,0,.5))*.95+.001);
    if(b>=0){group(540,470,1,0,P(b,0,.3),()=>{ctx.fillStyle='rgba(255,255,255,.92)';rr(-300,-38,600,76,38);ctx.fill();text('손님 +20% → 남는 돈은?',0,2,{s:36,w:900,c:C.ink});});
      stampBox('손님이 늘면?',540,1265,T-WT('h1b',1),{s:72,rot:-.06});}
  }},
""" + cost_scene6('베이글 매출 1,575만', '#ffe3bd', '#c47d2a', "'#E8B26A'") + calc_op('3,750,000') + r"""
  /* ── 결과: 한 달 375만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('베이글 가게, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '375만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,12*k,'#9ff0c4');
    text('하루 약 12만 원',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 손님 +20% → 매출 +315 → 재료비 +110 · 알바 +216 → 375 → 364 ── */
  step:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('손님이 20% 늘면',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      const k=E.out(P(a,.1,.6)),base=1060;
      vCash2(210,base-394*k,260,394*k);text('1,575만',340,base-394*k-45,{f:'D',s:58,c:C.dim});text('지금',340,base+50,{s:34,w:900,c:C.dim});
      vCash2(590,base-472*k,260,472*k,'#ffe08a','#d99a2b');text('1,890만',720,base-472*k-45,{f:'D',s:58,c:'#ffd27a'});text('손님 +20%',720,base+50,{s:34,w:900,c:C.dim});
      const q=T-WT('t1',4);if(q>=0)group(540,420,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('+315만 원',0,0,{f:'D',s:96,c:C.green,glow:'rgba(53,224,138,.5)'}));
    }else if(c<0){
      text('그런데 같이 늘어나는 돈',540,250,{s:46,w:900});
      [['재료비 20% 더','−110만 원','🥯'],['알바 한 명 더','−216만 원','👤']].forEach(([l,v,ic],i)=>{
        const k=P(b,.1+i*.7,.3);if(k<=0)return;const y=540+i*190;
        group(0,(1-E.out(k))*30,1,0,k,()=>{ctx.fillStyle='rgba(255,255,255,.08)';rr(90,y-80,900,160,20);ctx.fill();emoji(ic,170,y,80);text(l,240,y,{a:'left',s:42,w:900,max:420});text(v,950,y,{a:'right',f:'D',s:72,c:C.red});});});
      text('(주 40시간 풀타임 · 최저시급 10,320원 기준)',540,980,{s:30,w:800,c:C.dim,alpha:P(b,1.1,.3)});
      stampBox('직원은 한 명 단위로 는다',540,1120,T-WT('t2',7)-.1,{s:56,rot:-.05});
    }else{
      text('한 달 남는 돈',540,250,{s:46,w:900});
      const k=E.out(P(c,.05,.6)),base=1000;
      vCash2(210,base-375,260,375);text('375만',340,base-420,{f:'D',s:60,c:C.green});text('지금',340,base+50,{s:34,w:900,c:C.dim});
      const h2=375-11*k;vCash2(590,base-h2,260,h2,'#ffb3ad','#d6453d');text('364만',720,base-h2-45,{f:'D',s:60,c:'#FF9F43'});text('손님 +20%',720,base+50,{s:34,w:900,c:C.dim});
      const q=T-WT('t4',3);
      if(d>=0)group(540,1160,lerp(1.6,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('−11만 원',0,0,{f:'D',s:120,c:C.red,glow:'rgba(255,77,77,.55)'}));
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawBagel(540,700,E.back(P(a,0,.45))*.95+.001);
    stampBox('직원 한 명 단위로',540,1250,T-WT('e2',0),{s:70,rot:-.06});
  }},
};
"""
EP30_COVER = cover2('EP.30', '베이글', 190, '지금 남는 돈', '375만 원', '손님 20%↑ 하면', '364만 원',
                    "drawBagel(540,560,.42);", 'rgba(196,125,42,.25)')
build(SH + 'bagel.html', '비밀의 계산기 베이글 편', 'EP.30 베이글', 'bagel', 'bagel', 'EP30', 'EP.30',
      EP30_CUES, EP30_CONSTS, EP30_HELPERS,
      "const SEQ=['1','5','7','5','00','00','−','1','2','00','00','00','='];   // 15,750,000 − 12,000,000",
      KEYS_EXTRA, EP30_SCENES, EP30_COVER, 'step')
apply_ref(SH + 'bagel.html', ['손님이 20% 늘면','남는 돈이 11만 원 줄어든다'], '알바 1명 추가·최저시급 기준 가정 예시 · 세금 제외')
