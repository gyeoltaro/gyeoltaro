# EP.16 1인 미용실 · EP.17 동네 피자집 · EP.18 필라테스 — 포맷 v2 (build_batch5.py 의 공용 함수 재사용)
# 반전: 노쇼(빈 의자도 월세) · 할인의 함정(남는 돈 3분의 1) · 선결제 착시(받은 돈 ≠ 번 돈)
# 이미 만든 묶음 파일(build_batch2~5)은 다시 돌리지 않는다 — build() 가 그 편 html 의 bundledTTS 를 비운다.
src = open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'build_batch5.py'), encoding='utf-8').read()
exec(src[:src.index("# ═══════════════════════════════ EP.13")])

SH = '/home/user/gyeoltaro/shorts/'

def cost_scene6(*a, **k):
    """cost_scene 과 같고, 1,000 이상 금액에 쉼표를 붙인다 (1,400만)."""
    return cost_scene(*a, **k).replace("'−'+c.v+'만'", "'−'+won(c.v)+'만'")

# ═══════════════════════════════ EP.16 1인 미용실 — 노쇼 ═══════════════════════════════
EP16_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'예약이 꽉 찬 1인 미용실, 월 매출 [700만 원].',sfx:[[0,'whoosh'],['w7','impact']],shake:[['w7',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 예약 열 건 중 한 건은 [안 오죠].',sfx:[['w7','buzz']]},
  {id:'k1',sc:'cost',   text:'염색약과 파마약 재료비 {140만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {150만 원}.'},
  {id:'k3',sc:'cost',   text:'전기료와 카드 수수료 {60만 원}.'},
  {id:'k4',sc:'cost',   text:'의자와 기계 할부 {100만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <250만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'noshow', text:'그런데 열 건 중 한 건이 안 오면, 사라지는 매출이 {70만 원}.',sfx:[[0,'scratch'],[.02,'impact'],['w6','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'noshow', text:'월세와 할부는 그대로, 아끼는 건 재료비 <14만 원> 뿐이죠.',sfx:[['w6','pop'],['w8','buzz']]},
  {id:'t3',sc:'noshow', text:'그래서 남는 돈은 250만 원에서 <194만 원>, 1년이면 {672만 원}.',sfx:[['w5','pop'],['w8','buzz']],shake:[['w8',10,.3]]},
  {id:'t4',sc:'noshow', text:'빈 의자도 월세를 내는 거죠.',pause:300,sfx:[['w1','pop']]},
  {id:'e1',sc:'end',    text:'예약표는 매출이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[오는 손님만 매출]이었던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 1인 미용실 월 비용 (단위: 만 원) — 예시
const COSTS=[
  {cue:'k1',ic:'🧴',lb:'염색·파마 재료비',v:140},
  {cue:'k2',ic:'🏠',lb:'임대료',v:150},
  {cue:'k3',ic:'⚡',lb:'전기·카드 수수료',v:60},
  {cue:'k4',ic:'💺',lb:'의자·기계 할부',v:100},
];
"""
EP16_CONSTS = """// 매출 700만 원 vs 비용 450만 원 (단위: 만 원)
const REV=700,SCL=900/700,X0=90;
const SLOT=['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
"""
EP16_HELPERS = COIN + r"""/* 1인 미용실 외관 (상표 없음) */
function drawSalon(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#2b2140';rr(-400,-290,800,580,22);ctx.fill();
    ctx.save();ctx.shadowColor='rgba(255,122,168,.7)';ctx.shadowBlur=36;ctx.fillStyle='#ff7aa8';rr(-290,-260,580,100,50);ctx.fill();ctx.restore();
    text('HAIR',0,-208,{f:'D',s:76,c:'#fff'});
    ctx.fillStyle='#bfe3f5';rr(-340,-120,290,340,16);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.45)';ctx.save();ctx.beginPath();ctx.rect(-340,-120,290,340);ctx.clip();
    for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-340+i*90,-120);ctx.lineTo(-300+i*90,-120);ctx.lineTo(-340+i*90-120,220);ctx.lineTo(-380+i*90-120,220);ctx.fill();}ctx.restore();
    emoji('💈',300,-70,130);
    ctx.fillStyle='#e04848';rr(10,20,230,120,28);ctx.fill();rr(50,-110,150,150,28);ctx.fill();
    ctx.fillStyle='#39405a';ctx.fillRect(115,140,20,80);rr(55,215,140,26,12);ctx.fill();
    if(o.empty){ctx.save();ctx.fillStyle='rgba(43,33,64,.0)';ctx.restore();}
    else emoji('💇',125,-30,120);
  });
}
"""
EP16_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 월 매출 700만 원 · 예약표 10칸 중 한 칸이 노쇼 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b'),miss=b>=0&&T>=WT('h1b',7);
    text('예약이 꽉 찬 1인 미용실 (월)',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('매출 700만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    for(let i=0;i<10;i++){
      const x=160+(i%5)*190,y=640+Math.floor(i/5)*270,k=i===0?1:E.back(P(a,.05+i*.04,.3));if(k<=0)continue;
      const no=miss&&i===6;
      group(x,y,k,0,1,()=>{
        ctx.fillStyle=no?'#e53935':'#fff';rr(-82,-105,164,210,18);ctx.fill();
        text(SLOT[i],0,-68,{f:'D',s:34,c:no?'#fff':'#59627c'});
        emoji(no?'💺':'💇',0,6,88);
        text(no?'노쇼':'예약',0,72,{s:30,w:900,c:no?'#fff':C.green});
      });
    }
    stampBox('10건 중 1건 노쇼?',540,1265,T-WT('h1b',7),{s:70,rot:-.06});
  }},
""" + cost_scene6('미용실 매출 700만', '#e8c8ff', '#a066d9', "'#D9B3FF'") + calc_op('2,500,000') + r"""
  /* ── 결과: 한 달 250만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('1인 미용실, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '250만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,8*k,'#9ff0c4');
    text('예약이 다 찼다면',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 노쇼 → 매출 −70만 → 재료비 +14만 → 남는 돈 194만 · 1년 672만 ── */
  noshow:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('예약 10건 중 1건이 노쇼',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      const miss=T>=WT('t1',6);
      for(let i=0;i<10;i++){
        const x=160+(i%5)*190,y=560+Math.floor(i/5)*270,no=miss&&i===6;
        ctx.fillStyle=no?'#e53935':'rgba(255,255,255,.92)';rr(x-82,y-105,164,210,18);ctx.fill();
        text(SLOT[i],x,y-68,{f:'D',s:34,c:no?'#fff':'#59627c'});emoji(no?'💺':'💇',x,y+6,88);text(no?'노쇼':'예약',x,y+72,{s:30,w:900,c:no?'#fff':C.green});
      }
      stampBox('노쇼',540,1110,T-WT('t1',6),{s:90,rot:-.06});
      const k=T-WT('t1',10);if(k>=0)group(540,1250,lerp(1.5,1,E.out(P(k,0,.25))),0,P(k,0,.1),()=>text('매출 −70만 원',0,0,{f:'D',s:100,c:C.red,glow:'rgba(255,77,77,.5)'}));
    }else if(c<0){
      text('노쇼가 나면',540,250,{s:46,w:900});
      group(540,520,1,0,P(b,0,.3),()=>{ctx.fillStyle='rgba(255,255,255,.1)';rr(-400,-90,800,180,24);ctx.fill();text('월세·할부·전기는 그대로',0,-30,{s:40,w:900});text('0원 절약',0,40,{f:'D',s:60,c:C.red});});
      const g=T-WT('t2',6);
      if(g>=0){group(540,820,lerp(1.4,1,E.out(P(g,0,.25))),0,P(g,0,.12),()=>{ctx.fillStyle='rgba(53,224,138,.18)';rr(-400,-90,800,180,24);ctx.fill();text('아끼는 재료비',0,-30,{s:40,w:900});text('+14만 원',0,40,{f:'D',s:72,c:C.green});});}
      if(T>=WT('t2',8))group(540,1120,1,0,1,()=>text('실제 손실 −56만 원',0,0,{f:'D',s:88,c:C.red,glow:'rgba(255,77,77,.5)'}));
    }else if(d<0){
      text('한 달 남는 돈',540,250,{s:46,w:900});
      const k=E.out(P(T-WT('t3',5),0,.6)),base=1060;
      vCash2(210,base-500,260,500);text('250만',340,base-545,{f:'D',s:60,c:C.green});text('노쇼 없이',340,base+50,{s:36,w:900,c:C.dim});
      const h2=500*(1-.224*k);vCash2(590,base-h2,260,h2);ctx.fillStyle='rgba(255,77,77,.6)';ctx.fillRect(590,base-500,260,500-h2);
      text((250-Math.round(56*k))+'만',720,base-545,{f:'D',s:60,c:'#FF9F43'});text('노쇼 10%',720,base+50,{s:36,w:900,c:C.dim});
      stampBox('1년 672만 원',540,1260,T-WT('t3',8),{s:84,rot:-.05});
    }else{
      text('빈 의자',540,250,{s:46,w:900});
      emoji('💺',540,640,330);
      ctx.fillStyle='#fff';rr(250,860,580,110,26);ctx.fill();text('월세 150만 원 청구서',540,918,{s:40,w:900,c:C.ink});
      stampBox('빈 의자도 월세를 낸다',540,1180,T-WT('t4',1),{s:66,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawSalon(540,720,E.back(P(a,0,.45))*.95+.001);
    stampBox('오는 손님만 매출',540,1250,T-WT('e2',0),{s:76,rot:-.06});
  }},
};
"""
EP16_COVER = cover2('EP.16', '1인 미용실', 160, '예약 10건 중 1건 노쇼', '매출 −70만 원', '한 달 남는 돈', '250만 → 194만',
                    "drawSalon(540,560,.40);", 'rgba(255,122,168,.22)')
build(SH + 'hair-salon.html', '비밀의 계산기 1인 미용실 편', 'EP.16 1인 미용실', 'hair-salon', 'hair_salon', 'EP16', 'EP.16',
      EP16_CUES, EP16_CONSTS, EP16_HELPERS,
      "const SEQ=['7','00','00','00','−','4','5','00','00','0','='];   // 7,000,000 − 4,500,000",
      KEYS_EXTRA, EP16_SCENES, EP16_COVER, 'noshow')
apply_ref(SH + 'hair-salon.html', ['예약 열 건 중 한 건이 안 오면','빈 의자도 월세를 낸다'], '월 매출 700만·노쇼 10% 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.17 동네 피자집 — 할인의 함정 ═══════════════════════════════
EP17_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'한 판 [2만 원] 동네 피자집, 한 달에 천 판 팔죠.',sfx:[[0,'whoosh'],['w2','impact']],shake:[['w2',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 20% 할인을 하면, 오히려 [손해] 날 수 있죠.',sfx:[['w5','buzz']]},
  {id:'k1',sc:'cost',   text:'재료와 포장비, 카드 수수료 {1,400만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {200만 원}.'},
  {id:'k3',sc:'cost',   text:'알바 한 명 {200만 원}.'},
  {id:'k4',sc:'cost',   text:'전기와 가스비 {50만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마 남을까요? <150만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'discount',text:'한 판에 남는 돈은 [6천 원], 20% 할인하면 {2천 원}.',sfx:[[0,'scratch'],[.02,'impact'],['w6','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'discount',text:'주문이 두 배로 늘어도 한 달 {50만 원} 적자죠.',sfx:[['w6','buzz']],shake:[['w6',10,.3]]},
  {id:'t3',sc:'discount',text:'원래만큼 벌려면, 천 판이 아니라 [삼천 판] 팔아야 하죠.',sfx:[['w5','stamp']],shake:[['w5',10,.3]]},
  {id:'t4',sc:'discount',text:'하루 백 판, 오븐이 쉴 틈이 없죠.',pause:300,sfx:[['w1','pop']]},
  {id:'e1',sc:'end',    text:'할인은 20%를 깎는 게 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[남는 돈 3분의 2를 깎는] 거였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 동네 피자집 월 비용 (단위: 만 원) — 한 판 2만 원 × 1,000판, 변동비 70% 예시
const COSTS=[
  {cue:'k1',ic:'🍕',lb:'재료·포장·수수료',v:1400},
  {cue:'k2',ic:'🏠',lb:'임대료',v:200},
  {cue:'k3',ic:'👤',lb:'알바 1명',v:200},
  {cue:'k4',ic:'🔥',lb:'전기·가스',v:50},
];
"""
EP17_CONSTS = """// 매출 2,000만 원 vs 비용 1,850만 원 (단위: 만 원)
const REV=2000,SCL=900/2000,X0=90;
"""
EP17_HELPERS = COIN + r"""/* 피자 한 판 (상표 없음) */
function drawPizza(x,y,r,o={}){
  group(x,y,o.s||1,o.rot||0,o.alpha??1,()=>{
    ctx.fillStyle='#d99a3b';ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();
    ctx.fillStyle='#f4c542';ctx.beginPath();ctx.arc(0,0,r*.86,0,7);ctx.fill();
    ctx.fillStyle='#d6301f';[[.38,.18],[-.4,.28],[.1,-.46],[-.22,-.2],[.5,-.3],[-.52,-.1],[.06,.56],[.3,.5]].forEach(([px,py])=>{ctx.beginPath();ctx.arc(px*r,py*r,r*.12,0,7);ctx.fill();});
    ctx.strokeStyle='rgba(120,70,10,.55)';ctx.lineWidth=Math.max(3,r*.02);for(let i=0;i<8;i++){const an=i*Math.PI/4;line(0,0,Math.cos(an)*r*.86,Math.sin(an)*r*.86);}
    if(o.tag){ctx.fillStyle='#fff';rr(-r*.5,r*.55,r,r*.34,r*.1);ctx.fill();text(o.tag,0,r*.72,{f:'D',s:r*.24,c:C.ink});}
  });
}
/* 동네 피자집 간판 */
function drawPizzaShop(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#3a1f18';rr(-400,-280,800,560,22);ctx.fill();
    ctx.save();ctx.shadowColor='rgba(255,140,60,.8)';ctx.shadowBlur=36;ctx.fillStyle='#ff8a3d';rr(-280,-250,560,100,50);ctx.fill();ctx.restore();
    text('PIZZA',0,-198,{f:'D',s:76,c:'#fff'});
    drawPizza(-130,50,170,{tag:o.tag});
    ctx.fillStyle='#c9d4f0';rr(150,-70,200,260,16);ctx.fill();ctx.fillStyle='#1b2236';rr(170,-50,160,150,12);ctx.fill();emoji('🔥',250,30,90);
  });
}
"""
EP17_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 한 판 2만 원 → 20% 할인하면 손해? ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('동네 피자집, 한 판',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('20,000원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawPizza(540,800,330,{s:E.back(P(a,0,.5))*1+.001,tag:b>=0&&T>=WT('h1b',1)?'−20%':null});
    if(b>=0)stampBox('할인하면 손해?',540,1265,T-WT('h1b',5),{s:72,rot:-.06});
  }},
""" + cost_scene6('피자 매출 2,000만', '#ffd9a8', '#e07b1a', "'#FFB36B'") + calc_op('1,500,000') + r"""
  /* ── 결과: 한 달 150만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('동네 피자집, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '150만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,6*k,'#9ff0c4');
    text('한 판당 약 1,500원',540,1240,{f:'D',s:56,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 한 판 6,000원 → 2,000원 · 두 배 팔아도 −50만 · 세 배 팔아야 ── */
  discount:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('피자 한 판에 남는 돈',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      [[0,'정가 20,000원',20000,6000,'#fff'],[1,'20% 할인 16,000원',16000,2000,C.red]].forEach(([i,l,tot,gain,col])=>{
        const y=480+i*330,k=i?E.out(P(T-WT('t1',6),0,.5)):E.out(P(a,.1,.5));if(k<=0)return;
        text(l,90,y-70,{a:'left',s:40,w:900,c:col,alpha:k});
        const wc=560*k,wg=760*gain/20000*k;
        ctx.fillStyle='#7a5a52';rr(90,y-30,wc,100,14);ctx.fill();text('재료·포장 14,000',90+wc/2,y+20,{s:28,w:900,c:'#fff',alpha:k});
        ctx.fillStyle=i?'#FF9F43':C.green;rr(90+wc,y-30,Math.max(wg,1),100,14);ctx.fill();
        const lk=i?P(T-WT('t1',8),0,.25):P(T-WT('t1',4),0,.25);
        if(lk>0)text('남는 돈 '+won(gain)+'원',90+wc+Math.max(wg,1)+20,y+20,{a:'left',f:'D',s:48,c:i?'#FF9F43':C.green,alpha:lk});
      });
      stampBox('남는 돈 3분의 1',540,1180,T-WT('t1',8)-.1,{s:76,rot:-.05});
    }else if(c<0){
      text('주문이 두 배 (2,000판)',540,250,{s:46,w:900});
      [['매출 2,000판 × 16,000원','3,200만',C.green],['재료·포장 2,000판','−2,800만',C.red],['임대·알바·전기','−450만',C.red]].forEach(([l,v,col],i)=>{
        const k=P(b,.1+i*.3,.3);if(k<=0)return;const y=470+i*130;
        group(0,(1-E.out(k))*30,1,0,k,()=>{ctx.fillStyle='rgba(255,255,255,.08)';rr(90,y-50,900,100,18);ctx.fill();text(l,120,y,{a:'left',s:34,w:800});text(v,960,y,{a:'right',f:'D',s:56,c:col});});
      });
      const g=T-WT('t2',6);
      if(g>=0)group(540,980,lerp(1.5,1,E.out(P(g,0,.25))),0,P(g,0,.12),()=>text('−50만 원',0,0,{f:'D',s:150,c:C.red,glow:'rgba(255,77,77,.55)'}));
      stampBox('두 배 팔았는데 적자',540,1240,T-WT('t2',6)-.1,{s:64,rot:-.05});
    }else if(d<0){
      text('같은 150만 원을 벌려면',540,250,{s:46,w:900});
      drawPizza(260,640,150,{alpha:P(c,0,.3)});text('1,000판',260,830,{f:'D',s:60,alpha:P(c,0,.3)});text('정가',260,900,{s:34,w:900,c:C.dim,alpha:P(c,0,.3)});
      text('→',540,640,{f:'D',s:110,c:C.gold,alpha:P(c,.2,.3)});
      for(let i=0;i<3;i++){const k=E.back(P(T-WT('t3',5),i*.12,.3));if(k>0)drawPizza(700+(i%2)*190,560+i*130,.001+90*k,{});}
      text('3,000판',800,990,{f:'D',s:60,c:C.red,alpha:P(T-WT('t3',5),.3,.3)});text('20% 할인',800,1050,{s:34,w:900,c:C.dim,alpha:P(T-WT('t3',5),.3,.3)});
      stampBox('3배 팔아야',540,1250,T-WT('t3',5)-.4,{s:84,rot:-.05});
    }else{
      text('3,000판 ÷ 30일',540,250,{s:46,w:900});
      emoji('🔥',540,620,260);
      group(540,930,lerp(1.5,1,E.out(P(d,0,.25))),0,P(d,0,.15),()=>text('하루 100판',0,0,{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.5)'}));
      stampBox('오븐이 쉴 틈 없다',540,1180,T-WT('t4',3),{s:68,rot:-.05});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawPizzaShop(540,720,E.back(P(a,0,.45))*.95+.001,{tag:'−20%'});
    stampBox('남는 돈 3분의 2가 사라진다',540,1250,T-WT('e2',0),{s:60,rot:-.06});
  }},
};
"""
EP17_COVER = cover2('EP.17', '동네 피자집', 150, '한 판 남는 돈', '6,000원', '20% 할인하면', '2,000원',
                    "drawPizza(540,560,150);", 'rgba(255,140,60,.22)')
build(SH + 'pizza.html', '비밀의 계산기 동네 피자집 편', 'EP.17 동네 피자집', 'pizza', 'pizza', 'EP17', 'EP.17',
      EP17_CUES, EP17_CONSTS, EP17_HELPERS,
      "const SEQ=['2','0','00','00','00','−','1','8','5','00','00','0','='];   // 20,000,000 − 18,500,000",
      KEYS_EXTRA, EP17_SCENES, EP17_COVER, 'discount')
apply_ref(SH + 'pizza.html', ['피자 20% 할인하면','몇 판을 더 팔아야 본전?'], '한 판 2만 원·남는 돈 30% 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.18 필라테스 — 선결제 착시 ═══════════════════════════════
EP18_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'필라테스 30회권, 신규 회원 30명이 결제하면 통장에 [2,700만 원].',sfx:[[0,'whoosh'],['w7','impact']],shake:[['w7',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 이 돈은 아직, 다 번 돈이 [아니죠].',sfx:[['w7','buzz']]},
  {id:'k1',sc:'cost',   text:'강사 급여 {450만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {300만 원}.'},
  {id:'k3',sc:'cost',   text:'기구 할부 {150만 원}.'},
  {id:'k4',sc:'cost',   text:'전기료와 카드 수수료 {100만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'통장에는 얼마 남을까요? <1,700만 원>.',pause:300,sfx:[[0,'whoosh'],['w3','coin']]},
  {id:'t1',sc:'prepaid',text:'그런데 이번 달 수업은 한 명당 여덟 번, 번 돈은 [720만 원].',sfx:[[0,'scratch'],[.02,'impact'],['w10','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'prepaid',text:'나머지 {1,980만 원}은 앞으로 해 줘야 할 [수업값]이죠.',sfx:[['w1','buzz']]},
  {id:'t3',sc:'prepaid',text:'번 돈 720만 원에서 비용 1,000만 원을 빼면, {280만 원} 적자죠.',sfx:[['w8','buzz']],shake:[['w8',10,.3]]},
  {id:'t4',sc:'prepaid',text:'받은 돈을 미리 쓰면, 남은 수업을 할 돈이 없죠.',pause:300,sfx:[['w1','pop']]},
  {id:'e1',sc:'end',    text:'선결제 매출은 번 돈이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[아직 안 한 수업값]이었던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 필라테스 월 비용 (단위: 만 원) — 30회권 90만 원(회당 3만 원) × 30명, 예시
const COSTS=[
  {cue:'k1',ic:'🧘',lb:'강사 급여',v:450},
  {cue:'k2',ic:'🏠',lb:'임대료',v:300},
  {cue:'k3',ic:'🏋️',lb:'기구 할부',v:150},
  {cue:'k4',ic:'⚡',lb:'전기·카드 수수료',v:100},
];
"""
EP18_CONSTS = """// 선결제 입금 2,700만 원 vs 비용 1,000만 원 (단위: 만 원)
const REV=2700,SCL=900/2700,X0=90;
"""
EP18_HELPERS = COIN + r"""/* 필라테스 스튜디오 (상표 없음) */
function drawStudio(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#22304a';rr(-400,-290,800,580,22);ctx.fill();
    ctx.save();ctx.shadowColor='rgba(120,220,200,.7)';ctx.shadowBlur=36;ctx.fillStyle='#5fd6c4';rr(-290,-260,580,100,50);ctx.fill();ctx.restore();
    text('PILATES',0,-208,{f:'D',s:72,c:'#0b1020'});
    ctx.fillStyle='#e8f1ff';rr(-350,-120,700,300,16);ctx.fill();
    ctx.fillStyle='#9ad0c8';for(let i=0;i<3;i++)rr(-300+i*210,100,180,40,20),ctx.fill();
    [-210,0,210].forEach(px=>emoji('🧘',px,-10,120));
  });
}
/* 통장 입금 카드 */
function bankCard(x,y,s,label,val,col){
  group(x,y,s,0,1,()=>{ctx.fillStyle='#f4f1e8';rr(-380,-120,760,240,26);ctx.fill();ctx.fillStyle=col;ctx.fillRect(-380,-120,760,56);
    text(label,0,-92,{s:34,w:900,c:'#fff'});text(val,0,30,{f:'D',s:110,c:C.ink});});
}
"""
EP18_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 통장에 2,700만 원 → 다 번 돈이 아니다 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('필라테스 30회권 × 30명',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('통장에 2,700만 원',540,334,{f:'D',s:120,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawStudio(540,800,E.back(P(a,0,.5))*1.05+.001);
    if(b>=0)stampBox('다 번 돈일까?',540,1265,T-WT('h1b',7),{s:72,rot:-.06});
  }},
""" + cost_scene6('선결제 입금 2,700만', '#bff5ea', '#27a58f', "'#8FEBD8'") + calc_op('17,000,000', done=96) + r"""
  /* ── 결과: 통장에 1,700만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('필라테스, 통장에 남은 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 3, '1,700만 원', y=420, s=170) + r"""    const q=T-WT('r1',3),k=P(q,.3,.8);coinStack(540,1130,12*k,'#9ff0c4');
    text('잘 되는 것 같지만…',540,1240,{f:'D',s:56,c:C.gold,alpha:P(q,.6,.3)});
  }},

  /* ── 반전: 번 돈 720만 · 앞으로 할 수업 1,980만 · 실제 −280만 ── */
  prepaid:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(c<0){
      text('통장에 들어온 돈 2,700만 원',540,250,{s:44,w:900,alpha:P(a,0,.3)});
      const x0=90,W9=900,gx=W9*720/2700,k1=E.out(P(T-WT('t1',10),0,.5)),hl=b>=0?.5+.5*Math.sin(R*7):0;
      ctx.fillStyle='rgba(255,255,255,.08)';rr(x0,330,W9,110,20);ctx.fill();
      ctx.fillStyle=b>=0?`rgba(255,159,67,${.75+.2*hl})`:'#f1c24b';rr(x0+gx*k1,330,W9-gx*k1,110,20);ctx.fill();
      if(k1>0){ctx.fillStyle=C.green;rr(x0,330,Math.max(gx*k1,2),110,20);ctx.fill();}
      if(k1>.8)text('번 돈 720만',x0+gx/2,500,{s:36,w:900,c:C.green});
      if(b>=0)text('아직 안 한 수업 1,980만',x0+gx+(W9-gx)/2,500,{s:36,w:900,c:'#FF9F43',alpha:P(b,.15,.3)});
      text('회원 1명의 30회권',540,590,{s:40,w:900,c:C.dim,alpha:P(a,.1,.3)});
      for(let i=0;i<30;i++){const col=i%10,row=Math.floor(i/10),x=130+col*86,y=680+row*100,used=i<8,kk=E.back(P(a,.1+i*.015,.25));if(kk<=0)continue;
        group(x,y,kk,0,1,()=>{ctx.fillStyle=used&&T>=WT('t1',6)+i*.05?C.green:'rgba(255,255,255,.1)';rr(-34,-38,68,76,12);ctx.fill();ctx.strokeStyle=used?C.green:'#FF9F43';ctx.lineWidth=4;rr(-34,-38,68,76,12);ctx.stroke();
          text(String(i+1),0,2,{f:'D',s:32,c:used&&T>=WT('t1',6)+i*.05?'#0b1020':'#fff'});});}
      text('이번 달 8회',300,1010,{f:'D',s:48,c:C.green,alpha:P(T-WT('t1',6),.3,.3)});
      if(b>=0)text('남은 22회',720,1010,{f:'D',s:48,c:'#FF9F43',alpha:P(b,.2,.3)});
    }else if(d<0){
      text('이번 달 진짜 계산',540,250,{s:46,w:900});
      [['번 돈 (8회 × 30명)','720만',C.green],['비용','−1,000만',C.red]].forEach(([l,v,col],i)=>{
        const k=P(c,.05+i*.25,.3);if(k<=0)return;const y=480+i*150;
        group(0,(1-E.out(k))*30,1,0,k,()=>{ctx.fillStyle='rgba(255,255,255,.08)';rr(90,y-55,900,110,18);ctx.fill();text(l,120,y,{a:'left',s:36,w:800});text(v,960,y,{a:'right',f:'D',s:64,c:col});});
      });
      const g=T-WT('t3',8);
      if(g>=0)group(540,900,lerp(1.5,1,E.out(P(g,0,.25))),0,P(g,0,.12),()=>text('−280만 원',0,0,{f:'D',s:150,c:C.red,glow:'rgba(255,77,77,.55)'}));
      stampBox('통장 +1,700만, 실제 −280만',540,1160,T-WT('t3',8)-.1,{s:56,rot:-.05});
    }else{
      text('받은 돈을 미리 쓰면',540,250,{s:46,w:900});
      emoji('👛',540,560,240);
      group(540,800,1,0,P(d,.2,.3),()=>{ctx.fillStyle='rgba(255,255,255,.1)';rr(-440,-60,880,120,20);ctx.fill();text('남은 22회를 할 돈이 없다',0,2,{f:'D',s:56,c:C.red});});
      const base=1330;text('폐업 뒤 선불거래 피해구제 신청 (한국소비자원)',540,base-250,{s:26,w:700,c:C.dim,alpha:P(d,.5,.3)});
      [[0,'2021년',37,'#8e98ad'],[1,'2024년',264,C.red]].forEach(([i,l,v,col])=>{const k=P(d,.7+i*.2,.5);if(k<=0)return;const x=360+i*360,h=130*v/264*E.out(k);
        ctx.fillStyle=col;rr(x-70,base-60-h,140,h,10);ctx.fill();text(v+'건',x,base-60-h-28,{f:'D',s:40,c:col});text(l,x,base-28,{s:28,w:900});});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawStudio(540,720,E.back(P(a,0,.45))*.95+.001);
    stampBox('아직 안 한 수업값',540,1250,T-WT('e2',0),{s:76,rot:-.06});
  }},
};
"""
EP18_COVER = cover2('EP.18', '필라테스', 190, '통장에 들어온 돈', '2,700만 원', '이번 달 진짜 번 돈', '720만 원',
                    "drawStudio(540,560,.40);", 'rgba(95,214,196,.22)')
build(SH + 'pilates.html', '비밀의 계산기 필라테스 편', 'EP.18 필라테스', 'pilates', 'pilates', 'EP18', 'EP.18',
      EP18_CUES, EP18_CONSTS, EP18_HELPERS,
      "const SEQ=['2','7','00','00','00','−','1','0','00','00','00','='];   // 27,000,000 − 10,000,000",
      KEYS_EXTRA, EP18_SCENES, EP18_COVER, 'prepaid')
apply_ref(SH + 'pilates.html', ['통장에 2,700만 원 들어왔는데','진짜 번 돈은?'], '30회권 90만·한 달 8회 수업 가정 예시 · 세금 제외')
