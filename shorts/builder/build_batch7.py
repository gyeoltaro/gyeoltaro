# EP.19 개인택시 · EP.20 무인 세탁점 · EP.21 동네 백반집 — 포맷 v2 (build_batch5.py 의 공용 함수 재사용)
# 반전: 기회비용(번호판 값의 이자) · 교체 주기(7년 뒤 또 사야 할 기계값) · 작은 자동이체(월 3만 원 × 10)
# 이미 만든 묶음 파일(build_batch2~6)은 다시 돌리지 않는다 — build() 가 그 편 html 의 bundledTTS 를 비운다.
src = open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'build_batch5.py'), encoding='utf-8').read()
exec(src[:src.index("# ═══════════════════════════════ EP.13")])

SH = '/home/user/gyeoltaro/shorts/'

def cost_scene6(*a, **k):
    """cost_scene 과 같고, 1,000 이상 금액에 쉼표를 붙인다."""
    return cost_scene(*a, **k).replace("'−'+c.v+'만'", "'−'+won(c.v)+'만'")

# ═══════════════════════════════ EP.19 개인택시 — 기회비용 ═══════════════════════════════
EP19_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'개인택시 한 달 요금 수입 [480만 원].',sfx:[[0,'whoosh'],['w5','impact']],shake:[['w5',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 번호판 값 [1억 1,500만 원에] 숨은 비용이 있죠.',sfx:[['w3','buzz']]},
  {id:'k1',sc:'cost',   text:'연료비 {130만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'보험료 {60만 원}.'},
  {id:'k3',sc:'cost',   text:'정비와 소모품 {40만 원}.'},
  {id:'k4',sc:'cost',   text:'카드 수수료와 조합비 {30만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <220만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'plate',  text:'번호판 값을 연 3% 예금에 뒀다면, 이자가 한 달 {29만 원}.',sfx:[[0,'scratch'],[.02,'impact'],['w9','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'plate',  text:'택시로 번 220만 원에서 이자 29만 원을 빼면, <191만 원>.',sfx:[['w8','pop']]},
  {id:'t3',sc:'plate',  text:'1년이면 이자만 {345만 원}이 새죠.',sfx:[['w2','buzz']],shake:[['w2',10,.3]]},
  {id:'t4',sc:'plate',  text:'묶인 돈은 일을 안 하죠.',pause:300,sfx:[['w0','pop']]},
  {id:'e1',sc:'end',    text:'번호판은 공짜 자산이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[해마다 못 받는 이자]였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 개인택시 월 비용 (단위: 만 원) — 예시
const COSTS=[
  {cue:'k1',ic:'⛽',lb:'연료비',v:130},
  {cue:'k2',ic:'🛡️',lb:'보험료',v:60},
  {cue:'k3',ic:'🔧',lb:'정비·소모품',v:40},
  {cue:'k4',ic:'💳',lb:'카드 수수료·조합비',v:30},
];
"""
EP19_CONSTS = """// 요금 수입 480만 원 vs 비용 260만 원 (단위: 만 원)
const REV=480,SCL=900/480,X0=90;
"""
EP19_HELPERS = COIN + r"""/* 번호판 카드 (실제 번호 없음) */
function drawPlate(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#f1c40f';rr(-400,-150,800,300,36);ctx.fill();
    ctx.strokeStyle='#1b1b1b';ctx.lineWidth=10;rr(-384,-134,768,268,28);ctx.stroke();
    text('서울 개인택시 번호판',0,-80,{s:38,w:900,c:'#1b1b1b'});
    text('1억 1,500만 원',0,26,{f:'D',s:100,c:'#1b1b1b'});
    text('예시 시세 · 비공식',0,106,{s:30,w:700,c:'#5a4600'});
  });
}
"""
EP19_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 요금 수입 480만 원 → 번호판 값에 숨은 비용 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('개인택시 한 달 요금 수입',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('480만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    emoji('🚕',540,700,E.back(P(a,0,.5))*360+.001);
    if(b>=0)drawPlate(540,1050,E.back(P(b,0,.4))*.9+.001);
    if(b>=0)stampBox('숨은 비용?',540,1265,T-WT('h1b',5),{s:72,rot:-.06});
  }},
""" + cost_scene6('택시 요금 수입 480만', '#fff0a8', '#e0a800', "'#FFE066'") + calc_op('2,200,000') + r"""
  /* ── 결과: 한 달 220만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('개인택시, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '220만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,8*k,'#9ff0c4');
    text('운전한 값만 봤을 때',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 번호판 값을 예금에 뒀다면 월 이자 29만 → 191만 · 1년 345만 ── */
  plate:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('번호판 값을 은행에 뒀다면',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      drawPlate(540,520,E.back(P(a,.05,.35))*.9+.001);
      const k=P(a,.5,.3);
      text('↓',540,760,{f:'D',s:100,c:C.gold,alpha:k});
      group(540,930,1,0,k,()=>{ctx.fillStyle='#f4f1e8';rr(-380,-100,760,200,26);ctx.fill();ctx.fillStyle='#2a8fd0';ctx.fillRect(-380,-100,760,56);text('연 3% 예금 (예시)',0,-72,{s:34,w:900,c:'#fff'});text('가만히 두기만 해도',0,26,{f:'D',s:56,c:C.ink});});
      const q=T-WT('t1',9);
      if(q>=0){group(540,1180,lerp(1.5,1,E.out(P(q,0,.25))),0,P(q,0,.12),()=>text('이자 월 29만 원',0,0,{f:'D',s:100,c:C.green,glow:'rgba(53,224,138,.5)'}));}
    }else if(c<0){
      text('택시로 번 돈에서 이자를 빼면',540,250,{s:42,w:900});
      const k=E.out(P(T-WT('t2',5),0,.6)),base=1060;
      vCash2(210,base-500,260,500);text('220만',340,base-545,{f:'D',s:60,c:C.green});text('운전 수입',340,base+50,{s:36,w:900,c:C.dim});
      const h2=500*(1-.132*k);vCash2(590,base-h2,260,h2);ctx.fillStyle='rgba(255,77,77,.6)';ctx.fillRect(590,base-500,260,500-h2);
      text((220-Math.round(29*k))+'만',720,base-545,{f:'D',s:60,c:'#FF9F43'});text('이자까지 뺀 돈',720,base+50,{s:36,w:900,c:C.dim});
    }else if(d<0){
      text('이자만 모아 보면',540,250,{s:46,w:900});
      emoji('💸',540,600,260);
      group(540,900,lerp(1.5,1,E.out(P(c,0,.25))),0,P(c,0,.15),()=>text('1년 345만 원',0,0,{f:'D',s:120,c:C.red,glow:'rgba(255,77,77,.5)'}));
      stampBox('이자가 새는 중',540,1160,T-WT('t3',2),{s:70,rot:-.05});
    }else{
      text('묶여 있는 번호판 값',540,250,{s:46,w:900});
      drawPlate(540,560,.9);
      emoji('💤',860,420,150);
      stampBox('일 안 하는 돈',540,980,T-WT('t4',0)-.1,{s:76,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    emoji('🚕',540,560,E.back(P(a,0,.45))*340+.001);
    drawPlate(540,960,E.back(P(a,.1,.45))*.85+.001);
    stampBox('해마다 못 받는 이자',540,1250,T-WT('e2',0),{s:70,rot:-.06});
  }},
};
"""
EP19_COVER = cover2('EP.19', '개인택시', 190, '한 달 남는 돈', '220만 원', '번호판 이자까지 빼면', '191만 원',
                    "emoji('🚕',540,560,260);", 'rgba(255,197,49,.22)')
build(SH + 'taxi.html', '비밀의 계산기 개인택시 편', 'EP.19 개인택시', 'taxi', 'taxi', 'EP19', 'EP.19',
      EP19_CUES, EP19_CONSTS, EP19_HELPERS,
      "const SEQ=['4','8','00','00','0','−','2','6','00','00','0','='];   // 4,800,000 − 2,600,000",
      KEYS_EXTRA, EP19_SCENES, EP19_COVER, 'plate')
apply_ref(SH + 'taxi.html', ['번호판 1억 1,500만 원','이자를 빼면 남는 돈은?'], '월 수입 480만·번호판 시세·예금 3% 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.20 무인 세탁점 — 교체 주기 ═══════════════════════════════
EP20_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'무인 세탁점 월 매출 [500만 원].',sfx:[[0,'whoosh'],['w4','impact']],shake:[['w4',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 사장님 통장은 7년 뒤에 [비죠].',sfx:[['w5','buzz']]},
  {id:'k1',sc:'cost',   text:'임대료 {150만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'전기와 가스, 수도요금 {130만 원}.'},
  {id:'k3',sc:'cost',   text:'세제와 청소 알바 {60만 원}.'},
  {id:'k4',sc:'cost',   text:'결제 수수료와 관리비 {30만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <130만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'swap',   text:'세탁기와 건조기 값 8,000만 원, 7년 쓰면 {새로 사야} 하죠.',sfx:[[0,'scratch'],[.02,'impact'],['w3','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'swap',   text:'7년 동안 번 돈은 <1억 920만 원>.',sfx:[['w4','pop']]},
  {id:'t3',sc:'swap',   text:'기계값 8,000만 원을 빼면 {2,920만 원}, 한 달 <35만 원>.',sfx:[['w4','buzz'],['w8','pop']],shake:[['w4',10,.3]]},
  {id:'t4',sc:'swap',   text:'안 모으면 7년째에 통장이 비죠.',pause:300,sfx:[['w1','pop']]},
  {id:'e1',sc:'end',    text:'세탁기 값은 한 번이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[7년마다 내는 돈]이었던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 무인 세탁점 월 비용 (단위: 만 원) — 예시
const COSTS=[
  {cue:'k1',ic:'🏠',lb:'임대료',v:150},
  {cue:'k2',ic:'⚡',lb:'전기·가스·수도',v:130},
  {cue:'k3',ic:'🧴',lb:'세제·청소 알바',v:60},
  {cue:'k4',ic:'💳',lb:'결제 수수료·관리',v:30},
];
"""
EP20_CONSTS = """// 매출 500만 원 vs 비용 370만 원 (단위: 만 원)
const REV=500,SCL=900/500,X0=90;
"""
EP20_HELPERS = COIN + r"""/* 세탁기 한 대 (상표 없음) */
function drawWasher(x,y,s,o={}){
  group(x,y,s,o.rot||0,o.alpha??1,()=>{
    ctx.fillStyle=o.old?'#8a8f9c':'#e8eef8';rr(-100,-130,200,260,18);ctx.fill();
    ctx.fillStyle='#39405a';ctx.fillRect(-80,-112,160,24);
    ctx.fillStyle=o.old?'#555c6e':'#5a6b8c';ctx.beginPath();ctx.arc(0,30,72,0,7);ctx.fill();
    ctx.fillStyle=o.old?'#7a8294':'#9fd0ff';ctx.beginPath();ctx.arc(0,30,54,0,7);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(-18,12,14,0,7);ctx.fill();
  });
}
/* 무인 세탁점 외관 */
function drawLaundry(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#1e2f4d';rr(-400,-290,800,580,22);ctx.fill();
    ctx.save();ctx.shadowColor='rgba(95,179,255,.8)';ctx.shadowBlur=36;ctx.fillStyle='#5fb3ff';rr(-300,-260,600,100,50);ctx.fill();ctx.restore();
    text('LAUNDRY',0,-208,{f:'D',s:72,c:'#0b1020'});
    [-250,0,250].forEach(px=>drawWasher(px,50,.95,{old:o.old}));
  });
}
"""
EP20_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 월 매출 500만 원 → 7년 뒤 통장이 빈다 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('무인 세탁점 한 달',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('매출 500만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawLaundry(540,780,E.back(P(a,0,.5))*.95+.001);
    if(b>=0)stampBox('7년 뒤 통장이?',540,1265,T-WT('h1b',5),{s:72,rot:-.06});
  }},
""" + cost_scene6('세탁점 매출 500만', '#bfe3ff', '#2a8fd0', "'#8FD0FF'") + calc_op('1,300,000') + r"""
  /* ── 결과: 한 달 130만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('무인 세탁점, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '130만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,6*k,'#9ff0c4');
    text('기계값을 빼기 전',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 기계값 8,000만 원은 7년 뒤 또 → 7년 번 돈 1억 920만 − 8,000만 = 2,920만 → 월 35만 ── */
  swap:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('세탁기·건조기 값 8,000만 원',540,250,{s:44,w:900,alpha:P(a,0,.3)});
      for(let i=0;i<6;i++){const k=E.back(P(a,.05+i*.05,.3));if(k>0)drawWasher(170+i*148,500,.62*k+.001,{old:T>=WT('t1',7)});}
      text('7년 쓰면 (예시)',540,720,{s:40,w:900,c:C.dim,alpha:P(a,.3,.3)});
      for(let i=0;i<7;i++){const k=E.back(P(a,.4+i*.05,.25));if(k<=0)continue;const worn=T>=WT('t1',6)+i*.08;
        group(142+i*133,860,k,0,1,()=>{ctx.fillStyle=worn?'#ff6b6b':'rgba(255,255,255,.14)';rr(-52,-52,104,104,16);ctx.fill();text((i+1)+'년',0,2,{f:'D',s:40,c:worn?'#fff':'#9aa3b8'});});}
      stampBox('새로 사야 함',540,1120,T-WT('t1',7),{s:84,rot:-.05});
    }else if(c<0){
      text('7년 동안 번 돈',540,250,{s:46,w:900});
      const q=T-WT('t2',4),k=P(q,.15,.9);coinStack(540,1160,10*k,'#9ff0c4');
      text('130만 × 84개월',540,430,{s:42,w:900,c:C.dim,alpha:P(b,0,.3)});
      if(q>=0)group(540,700,lerp(1.6,1,E.out(P(q,.05,.3))),0,P(q,0,.15),()=>text('1억 920만 원',0,0,{f:'D',s:120,c:C.green,glow:'rgba(53,224,138,.5)'}));
    }else if(d<0){
      text('기계값을 빼면',540,250,{s:46,w:900});
      const x0=90,W9=900,gw=W9*2920/10920,k1=E.out(P(T-WT('t3',1),0,.5));
      ctx.fillStyle='rgba(255,255,255,.08)';rr(x0,330,W9,100,20);ctx.fill();
      ctx.fillStyle=C.green;rr(x0,330,Math.max(gw*k1,2),100,20);ctx.fill();
      ctx.fillStyle='#ff6b6b';rr(x0+gw*k1,330,(W9-gw)*k1,100,20);ctx.fill();
      if(k1>.8){text('남는 돈 2,920만',x0+gw/2,480,{s:34,w:900,c:C.green});text('기계값 8,000만',x0+gw+(W9-gw)/2,380,{s:36,w:900,c:'#fff'});}
      const base=1180,q=E.out(P(T-WT('t3',8),0,.6));
      vCash2(210,base-460,260,460);text('130만',340,base-505,{f:'D',s:60,c:C.dim});text('기계값 빼기 전',340,base+50,{s:34,w:900,c:C.dim});
      const h2=460*(1-.73*q);vCash2(590,base-h2,260,h2);
      text((130-Math.round(95*q))+'만',720,base-h2-45,{f:'D',s:60,c:'#FF9F43'});text('기계값 빼면',720,base+50,{s:34,w:900,c:C.dim});
    }else{
      text('교체비를 안 모으면',540,250,{s:46,w:900});
      emoji('👛',540,560,260);
      group(540,800,1,0,P(d,.1,.3),()=>{ctx.fillStyle='rgba(255,255,255,.1)';rr(-400,-70,800,140,24);ctx.fill();text('7년째 통장 0원',0,0,{f:'D',s:76,c:C.red});});
      stampBox('또 8,000만 원',540,1100,T-WT('t4',1),{s:80,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawLaundry(540,720,E.back(P(a,0,.45))*.95+.001,{old:true});
    stampBox('7년마다 내는 돈',540,1250,T-WT('e2',0),{s:76,rot:-.06});
  }},
};
"""
EP20_COVER = cover2('EP.20', '무인 세탁점', 150, '한 달 남는 돈', '130만 원', '기계값까지 빼면', '35만 원',
                    "drawLaundry(540,560,.40);", 'rgba(95,179,255,.22)')
build(SH + 'laundry.html', '비밀의 계산기 무인 세탁점 편', 'EP.20 무인 세탁점', 'laundry', 'laundry', 'EP20', 'EP.20',
      EP20_CUES, EP20_CONSTS, EP20_HELPERS,
      "const SEQ=['5','00','00','00','−','3','7','00','00','0','='];   // 5,000,000 − 3,700,000",
      KEYS_EXTRA, EP20_SCENES, EP20_COVER, 'swap')
apply_ref(SH + 'laundry.html', ['무인 세탁점 월 130만 원','7년 뒤 기계값 8,000만 원'], '월 매출 500만·장비 8,000만·수명 7년 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.21 동네 백반집 — 작은 자동이체 ═══════════════════════════════
EP21_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'백반 한 상 9천 원, 하루 80상이면 월 매출 [2,160만 원].',sfx:[[0,'whoosh'],['w9','impact']],shake:[['w9',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 장부에 안 보이는 돈이 [새죠].',sfx:[['w5','buzz']]},
  {id:'k1',sc:'cost',   text:'재료비 {880만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {250만 원}.'},
  {id:'k3',sc:'cost',   text:'알바 두 명 {600만 원}.'},
  {id:'k4',sc:'cost',   text:'전기와 가스비 {200만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <230만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'leak',   text:'정수기, 카드 단말기, 인터넷, 보험료 같은 월 [3만 원짜리] 열 개가 있죠.',sfx:[[0,'scratch'],[.02,'impact'],['w7','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'leak',   text:'한 달 {30만 원}, 남는 돈은 <200만 원으로> 줄죠.',sfx:[['w2','buzz'],['w6','pop']]},
  {id:'t3',sc:'leak',   text:'1년이면 {360만 원}, 한 달 순이익보다 많죠.',sfx:[['w1','buzz']],shake:[['w1',10,.3]]},
  {id:'t4',sc:'leak',   text:'자동이체는 조용히 빠져나가죠.',pause:300,sfx:[['w0','pop']]},
  {id:'e1',sc:'end',    text:'백반집은 큰 비용이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[작은 자동이체]에 새고 있었던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 동네 백반집 월 비용 (단위: 만 원) — 예시
const COSTS=[
  {cue:'k1',ic:'🥬',lb:'재료비',v:880},
  {cue:'k2',ic:'🏠',lb:'임대료',v:250},
  {cue:'k3',ic:'👤',lb:'알바 2명',v:600},
  {cue:'k4',ic:'🔥',lb:'전기·가스',v:200},
];
"""
EP21_CONSTS = """// 매출 2,160만 원 vs 비용 1,930만 원 (단위: 만 원)
const REV=2160,SCL=900/2160,X0=90;
"""
EP21_HELPERS = COIN + r"""/* 백반 한 상 */
function drawTray(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#8a5a2b';rr(-330,-190,660,380,36);ctx.fill();
    ctx.fillStyle='#a8743c';rr(-310,-170,620,340,28);ctx.fill();
    emoji('🍚',-170,-70,150);emoji('🍲',10,-70,150);emoji('🥬',170,-70,130);
    emoji('🥢',-120,80,100);emoji('🍳',60,80,120);emoji('🥒',200,80,100);
  });
}
/* 작은 자동이체 칩 */
const SUBS=['정수기','카드 단말기','인터넷','보험료','포스 프로그램','CCTV','방역','음악 저작권','쓰레기봉투','배달앱 월정액'];
"""
EP21_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 백반 9천 원 × 80상 → 장부에 안 보이는 돈이 샌다 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('백반 한 상 9천 원 × 하루 80상',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('월 매출 2,160만 원',540,334,{f:'D',s:112,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawTray(540,780,E.back(P(a,0,.5))*1.05+.001);
    if(b>=0)stampBox('안 보이는 돈?',540,1265,T-WT('h1b',5),{s:72,rot:-.06});
  }},
""" + cost_scene6('백반집 매출 2,160만', '#d8f5c8', '#4aa832', "'#A8E68F'") + calc_op('2,300,000') + r"""
  /* ── 결과: 한 달 230만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('동네 백반집, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '230만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,7*k,'#9ff0c4');
    text('큰 비용만 뺐을 때',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 월 3만 원 × 10 = 30만 → 200만 · 1년 360만 > 한 달 순이익 ── */
  leak:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('월 3만 원짜리 자동이체',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      for(let i=0;i<10;i++){const col=i%2,row=Math.floor(i/2),k=E.back(P(a,.05+i*.06,.25));if(k<=0)continue;
        group(300+col*480,420+row*150,k,0,1,()=>{ctx.fillStyle='rgba(255,255,255,.92)';rr(-220,-52,440,104,22);ctx.fill();text(SUBS[i],-190,-2,{a:'left',s:32,w:900,c:C.ink});text('3만',190,0,{a:'right',f:'D',s:44,c:C.red});});}
      stampBox('월 3만 원 × 10',540,1260,T-WT('t1',7),{s:76,rot:-.05});
    }else if(c<0){
      text('한 달 합치면',540,250,{s:46,w:900});
      group(540,520,lerp(1.4,1,E.out(P(b,0,.25))),0,P(b,0,.15),()=>text('−30만 원',0,0,{f:'D',s:140,c:C.red,glow:'rgba(255,77,77,.5)'}));
      const k=E.out(P(T-WT('t2',6),0,.6)),base=1180;
      vCash2(210,base-460,260,460);text('230만',340,base-505,{f:'D',s:60,c:C.green});text('큰 비용만 뺀 돈',340,base+50,{s:34,w:900,c:C.dim});
      const h2=460*(1-.13*k);vCash2(590,base-h2,260,h2);ctx.fillStyle='rgba(255,77,77,.6)';ctx.fillRect(590,base-460,260,460-h2);
      text((230-Math.round(30*k))+'만',720,base-505,{f:'D',s:60,c:'#FF9F43'});text('자동이체까지',720,base+50,{s:34,w:900,c:C.dim});
    }else if(d<0){
      text('1년이면',540,250,{s:46,w:900});
      const base=1130;
      vCash2(210,base-460,260,460,'#ffb3b3','#e04848');text('360만',340,base-505,{f:'D',s:60,c:C.red,alpha:P(c,.1,.3)});text('1년 자동이체',340,base+50,{s:34,w:900,c:C.dim});
      vCash2(590,base-300,260,300);text('230만',720,base-345,{f:'D',s:60,c:C.green});text('한 달 순이익',720,base+50,{s:34,w:900,c:C.dim});
      stampBox('한 달 순이익보다 많다',540,1280,T-WT('t3',3),{s:56,rot:-.05});
    }else{
      text('조용히 빠져나가는 돈',540,250,{s:46,w:900});
      emoji('🚰',540,620,300);
      for(let i=0;i<4;i++){const f=((R*1.4+i*.25)%1);ctx.save();ctx.globalAlpha*=1-f;emoji('💧',540+(i%2?18:-18),820+f*260,60);ctx.restore();}
      stampBox('티 안 나게 샌다',540,1180,T-WT('t4',0)-.1,{s:72,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawTray(540,700,E.back(P(a,0,.45))*1+.001);
    stampBox('작은 자동이체',540,1250,T-WT('e2',0),{s:80,rot:-.06});
  }},
};
"""
EP21_COVER = cover2('EP.21', '동네 백반집', 150, '한 달 남는 돈', '230만 원', '작은 자동이체, 1년', '−360만 원',
                    "drawTray(540,560,.55);", 'rgba(120,200,80,.22)')
build(SH + 'baekban.html', '비밀의 계산기 동네 백반집 편', 'EP.21 동네 백반집', 'baekban', 'baekban', 'EP21', 'EP.21',
      EP21_CUES, EP21_CONSTS, EP21_HELPERS,
      "const SEQ=['2','1','6','00','00','0','−','1','9','3','00','00','0','='];   // 21,600,000 − 19,300,000",
      KEYS_EXTRA, EP21_SCENES, EP21_COVER, 'leak')
apply_ref(SH + 'baekban.html', ['월 3만 원짜리 열 개','1년에 새는 돈 360만 원'], '백반 9천 원·하루 80상·항목당 월 3만 원 가정 예시 · 세금 제외')
