# EP.10 배달 떡볶이 · EP.11 동네 꽃집 · EP.12 PC방 — 포맷 v2 (build_batch3.py 의 공용 함수 재사용)
src = open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'build_batch3.py'), encoding='utf-8').read()
exec(src[:src.index("# ═══════════════════════════════ EP.07")])

SH = '/home/user/gyeoltaro/shorts/'
STEAM = r"""    for(let i=0;i<3;i++){const ph=(R*.6+i/3)%1;ctx.strokeStyle=`rgba(255,255,255,${.35*(1-ph)})`;ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-60+i*60,-120-ph*80);ctx.quadraticCurveTo(-30+i*60,-160-ph*80,-60+i*60,-200-ph*80);ctx.stroke();}
"""
def chips_bottom_rows(): return ""

# ═══════════════════════════════ EP.10 배달 떡볶이 ═══════════════════════════════
EP10_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'떡볶이 [2만 원], 매장 주문과 배달 주문.',sfx:[[0,'whoosh'],['w1','impact']],shake:[['w1',12,.35]]},
  {id:'h1b',sc:'hook',  text:'같은 2만 원인데, 남는 돈은 [열 배] 차이 나죠.',sfx:[['w5','pop']]},
  {id:'k1',sc:'cost',   text:'재료비 {7,000원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'월세와 인건비 몫 {6,000원}.'},
  {id:'r1',sc:'cost',   text:'매장에서 팔면 <7,000원>이 남죠.',pause:250,sfx:[['w2','coin']]},
  {id:'k3',sc:'cost',   text:'배달이면 포장 용기 {800원}.',sfx:[[0,'swipe']]},
  {id:'k4',sc:'cost',   text:'배달앱 중개수수료 7.8%, {1,560원}.'},
  {id:'k5',sc:'cost',   text:'결제 수수료 {600원}.'},
  {id:'k6',sc:'cost',   text:'배달비 {3,400원}.',pause:200},
  """ + SIG + r"""
  {id:'r2',sc:'result', text:'배달로 팔면 얼마나 남을까요? <640원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'split',  text:'그런데 배달앱과 라이더 몫은 {5,560원}.',sfx:[[0,'scratch'],[.02,'impact'],['w4','kaching']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'split',  text:'사장님 몫의 [여덟 배]가 넘죠.',pause:250,sfx:[['w2','stamp']],shake:[['w2',10,.3]]},
  {id:'t3',sc:'survey', text:'한 분식집은 2만 원 미만 주문에서 수수료가 [30%]를 넘었죠.',pause:300,sfx:[[0,'whoosh'],['w7','impact']],shake:[['w7',10,.3]]},
  {id:'e1',sc:'end',    text:'배달 주문의 진짜 주인은 사장님이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[배달앱]이었던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 2만 원 주문 1건의 비용 (단위: 원). both = 매장·배달 공통, app = 배달앱·라이더 몫
const COSTS=[
  {cue:'k1',ic:'🌶️',lb:'재료비 (35%)',v:7000,both:true},
  {cue:'k2',ic:'🏠',lb:'월세·인건비',v:6000,both:true},
  {cue:'k3',ic:'🥡',lb:'포장 용기',v:800},
  {cue:'k4',ic:'📱',lb:'중개 7.8%',v:1560,app:true},
  {cue:'k5',ic:'💳',lb:'결제 3%',v:600,app:true},
  {cue:'k6',ic:'🛵',lb:'배달비',v:3400,app:true},
];
"""
EP10_CONSTS = """// 2만 원 한 그릇: 비용만큼 매장(왼쪽)·배달(오른쪽) 막대가 줄어듦
const PRICE=20000,BXS=[300,780],BTOP=560,BH=760;
(()=>{let s=PRICE,d=PRICE;COSTS.forEach(c=>{c.hiD=d;c.loD=d-c.v;d=c.loD;if(c.both){c.hiS=s;c.loS=s-c.v;s=c.loS;}});})();
"""
EP10_HELPERS = r"""/* 떡볶이 한 그릇 */
function drawBowl(x,y,s){
  group(x,y,s,0,1,()=>{
""" + STEAM + r"""    ctx.fillStyle='#1f2230';ctx.beginPath();ctx.moveTo(-230,-20);ctx.quadraticCurveTo(-210,150,0,160);ctx.quadraticCurveTo(210,150,230,-20);ctx.closePath();ctx.fill();
    ctx.fillStyle='#14161f';ctx.beginPath();ctx.ellipse(0,-20,230,70,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#d6301f';ctx.beginPath();ctx.ellipse(0,-26,205,55,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,140,90,.35)';ctx.beginPath();ctx.ellipse(-50,-45,90,18,0,0,Math.PI*2);ctx.fill();
    [[-120,-34],[-60,-50],[10,-36],[80,-48],[140,-26],[-20,-12],[50,-8],[-100,-10]].forEach(([tx,ty],i)=>{ctx.save();ctx.translate(tx,ty);ctx.rotate((i%3-1)*.5);ctx.fillStyle='#f6ead6';rr(-34,-11,68,22,11);ctx.fill();ctx.restore();});
    ctx.fillStyle='#f2c46d';[[-150,-48],[100,-62],[20,-64]].forEach(([fx,fy])=>{ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+50,fy+10);ctx.lineTo(fx+12,fy+30);ctx.closePath();ctx.fill();});
    ctx.strokeStyle='#3a3f55';ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(0,-20,230,70,0,0,Math.PI*2);ctx.stroke();
  });
}
/* 세로 돈 막대 */
function vCash(x0,y0,w,h,col1,col2){
  if(h<1)return;
  ctx.save();const g=ctx.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,col1);g.addColorStop(1,col2);
  ctx.fillStyle=g;rr(x0,y0,w,h,Math.min(18,h/2));ctx.fill();
  ctx.save();rr(x0,y0,w,h,Math.min(18,h/2));ctx.clip();ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=3;for(let y=y0+14;y<y0+h;y+=18)line(x0+10,y,x0+w-10,y);ctx.restore();
  ctx.restore();
}
/* 동전 탑: n개 (소수점은 반쯤 그림) */
function coinStack(x,y,n,col){
  for(let i=0;i<Math.ceil(n);i++){const part=Math.min(1,n-i),cy=y-i*30;
    ctx.save();ctx.globalAlpha*=part;ctx.fillStyle='#b8860b';ctx.beginPath();ctx.ellipse(x,cy+8,80,22,0,0,7);ctx.fill();
    ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(x,cy,80,22,0,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;ctx.stroke();ctx.restore();}
}
"""
EP10_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 같은 2만 원, 매장 vs 배달 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b'),sp=T-WT('h1',3);
    text('떡볶이 세트',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('20,000원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawBowl(540,720,E.back(P(a,0,.5))*1.15+.001);
    [[250,'🍽️','매장',C.cyan,0],[830,'🛵','배달','#FF9AC8',2]].forEach(([x,ic,lb,col,w])=>{
      const k=E.back(P(T-WT('h1',3+w),0,.35));if(sp<0||k<=0)return;
      group(x,1050,k,0,1,()=>{ctx.fillStyle='rgba(255,255,255,.08)';rr(-150,-80,300,160,24);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=5;rr(-150,-80,300,160,24);ctx.stroke();
        emoji(ic,-70,0,70);text(lb,40,4,{f:'D',s:64,c:col});});
    });
    if(b>=0)stampBox('남는 돈 10배 차이?',540,1265,T-WT('h1b',5),{s:64,rot:-.06});
  }},

  /* ── 비용 차감: 매장·배달 두 막대 ── */
  cost:{draw(){
    let ms=PRICE,md=PRICE;
    COSTS.forEach(c=>{const k=E.out(P(T-c.tr,0,.6));md-=c.v*k;if(c.both)ms-=c.v*k;});
    text('2만 원 한 그릇, 남는 돈',540,236,{s:40,w:700,c:C.dim});
    const act=COSTS.find(c=>T>=CT(c.cue)&&T<c.tr);
    [[0,'매장',ms,'hiS','loS'],[1,'배달',md,'hiD','loD']].forEach(([i,lb,m,HI,LO])=>{
      const x=BXS[i],col=m>5000?C.green:m>1500?'#FF9F43':C.red;
      text(lb,x,320,{f:'D',s:60,c:i?'#FF9AC8':C.cyan});
      text(won(Math.round(m))+'원',x,410,{f:'D',s:70,c:col});
      ctx.fillStyle='rgba(255,255,255,.05)';rr(x-130,BTOP,260,BH,22);ctx.fill();
      COSTS.forEach(c=>{if(c[HI]==null||T<c.tr)return;const y1=BTOP+BH*(1-c[HI]/PRICE),hh=BH*c.v/PRICE;
        ctx.fillStyle=c.app?'rgba(177,140,255,.22)':'rgba(255,77,77,.14)';ctx.fillRect(x-130,y1,260,hh-2);
        if(hh>48){emoji(c.ic,x-80,y1+hh/2,34,{alpha:.8});text(c.lb,x+20,y1+hh/2,{s:24,w:800,c:c.app?'#d9c8ff':'#ffb3b3'});}});
      const h=BH*m/PRICE;vCash(x-130,BTOP+BH-h,260,h,col===C.red?'#ff9a9a':'#9ff0c4',col===C.red?'#d62f2f':'#1fa864');
      if(act&&act[HI]!=null){const y1=BTOP+BH*(1-act[HI]/PRICE),hh=BH*act.v/PRICE;ctx.fillStyle=`rgba(255,77,77,${.45+.3*Math.sin(R*14)})`;ctx.fillRect(x-130,y1,260,hh);}
    });
    COSTS.forEach(c=>{const d=T-c.tr;if(d<0||d>1.1)return;const y=BTOP+BH*(1-c.hiD/PRICE)-d*40;
      text('−'+won(c.v)+'원',540,y,{f:'D',s:44,c:c.app?C.purple:C.red,alpha:1-P(d,.7,.4),st:8});});
    const rs=T-WT('r1',2);
    if(rs>=0&&T<CT('k3')+.4){const y1=BTOP+BH-BH*7000/PRICE;group(0,0,1,0,P(rs,0,.25),()=>{ctx.strokeStyle=C.green;ctx.lineWidth=8;rr(BXS[0]-140,y1-10,280,BH*7000/PRICE+20,24);ctx.stroke();text('남는 돈',BXS[0],y1+130,{f:'D',s:52,c:'#06351d'});});}
  }},
""" + calc_op('640') + r"""
  /* ── 결과: 배달로 팔면 640원 ── */
  result:{draw(){
    const a=L('r2'),q=T-WT('r2',4);
    text('배달로 2만 원 팔면, 사장님 몫',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    if(q<0)text('?',540,420,{f:'D',s:220,c:C.gold,alpha:P(a,0,.2)});
    else group(540,420,lerp(1.7,1,E.out(P(q,.05,.3))),0,P(q,0,.15),()=>text('640원',0,0,{f:'D',s:220,c:'#FF9F43',glow:'rgba(255,159,67,.45)'}));
    const k=P(q,.3,.8);
    coinStack(300,1180,14*k,'#7fd3ff');coinStack(780,1180,1.28*k,'#FF9AC8');
    text('매장 7,000원',300,1270,{f:'D',s:52,c:C.cyan,alpha:P(q,.3,.3)});text('배달 640원',780,1270,{f:'D',s:52,c:'#FF9AC8',alpha:P(q,.3,.3)});
    text('동전 1개 = 500원',960,1335,{a:'right',s:24,w:700,c:C.dim,alpha:P(q,.6,.3)});
    stampBox('열 배 차이',780,900,q-1,{s:80,rot:-.08});
  }},

  /* ── 반전: 같은 주문, 배달앱·라이더 몫 5,560원 vs 사장님 640원 ── */
  split:{draw(){
    const a=L('t1'),b=L('t2');
""" + dark('a') + r"""    text('2만 원 배달 주문, 누가 가져갈까',540,250,{s:46,w:900,alpha:P(a,0,.3)});
    const parts=[['재료',7000,'#5d6577'],['월세·인건비',6000,'#4c5366'],['포장',800,'#5d6577'],['중개',1560,'#B18CFF'],['결제',600,'#8f6bff'],['배달비',3400,'#FF9F43'],['사장',640,C.green]];
    let x=90;const y=330,h=110;
    parts.forEach(([lb,v,col],i)=>{const w=900*v/20000,k=P(a,.1+i*.07,.25);ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=col;ctx.fillRect(x,y,w-3,h);ctx.restore();
      if(w>60)text(lb,x+w/2,y+h/2,{s:w>120?26:20,w:900,c:'#0b1020',alpha:k});x+=w;});
    text('▲ 사장님',90+900*19360/20000+14,y+h+30,{s:26,w:900,c:C.green,alpha:P(a,.7,.3)});
    const g=E.out(P(T-WT('t1',4),0,.7)),base=1250,sc=600/5560;
    if(T>=WT('t1',1)-.2){
      const xa=330,hA=1560*sc*g,hP=600*sc*g,hR=3400*sc*g;
      ctx.fillStyle='#B18CFF';rr(xa-130,base-hA,260,hA,12);ctx.fill();ctx.fillStyle='#8f6bff';ctx.fillRect(xa-130,base-hA-hP,260,hP);
      ctx.fillStyle='#FF9F43';rr(xa-130,base-hA-hP-hR,260,hR,18);ctx.fill();
      if(g>.6){text('배달비 3,400',xa,base-hA-hP-hR/2,{s:30,w:900,c:'#2a1600'});text('중개·결제 2,160',xa,base-(hA+hP)/2,{s:28,w:900,c:'#1a0f3a'});}
      if(g>.02)text(won(5560*g)+'원',xa,base-(hA+hP+hR)-50,{f:'D',s:64,c:'#FFB870'});
      text('배달앱·라이더',xa,base+50,{s:40,w:900,c:'#FFB870'});
      const hO=640*sc*g;vCash(650,base-hO,260,hO,'#9ff0c4','#1fa864');
      if(g>.02)text('640원',780,base-hO-50,{f:'D',s:64,c:C.green});text('사장님',780,base+50,{s:40,w:900,c:C.green});
    }
    stampBox('8배 넘게',780,900,T-WT('t2',2),{s:84,c:C.purple,rot:-.08,bg:'rgba(30,10,60,.75)'});
  }},

  /* ── 실제 사례: 한 분식집 총수수료 26.4%, 2만 원 미만 주문은 30% 넘음 ── */
  survey:{draw(){
    const a=L('t3');
    text('한 분식집의 배달 수수료 (2025년)',540,250,{s:44,w:900,alpha:P(a,0,.3)});
    text('참여연대 실태보고서 · 경향신문 2025.10.22',540,305,{s:26,w:700,c:C.dim,alpha:P(a,0,.3)});
    const k=E.out(P(a,.2,1)),cx=540,cy=640,r=210,segs=[[7.80,'#B18CFF','중개 7.80%'],[2.41,'#8f6bff','결제 2.41%'],[16.18,'#FF9F43','배달비 16.18%']];
    ctx.save();ctx.lineWidth=70;ctx.strokeStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
    let st=-Math.PI/2;segs.forEach(([v,col])=>{const sw=Math.PI*2*v/100*k;ctx.strokeStyle=col;ctx.beginPath();ctx.arc(cx,cy,r,st,st+sw);ctx.stroke();st+=sw;});ctx.restore();
    text((26.39*k).toFixed(1)+'%',cx,cy-10,{f:'D',s:110,c:'#fff'});text('매출 대비 수수료',cx,cy+70,{s:30,w:800,c:C.dim});
    segs.forEach(([v,col,lb],i)=>{const y=920+i*62;ctx.fillStyle=col;rr(250,y-18,36,36,8);ctx.fill();text(lb,310,y,{a:'left',s:38,w:800,c:col,alpha:P(a,.5+i*.15,.3)});});
    stampBox('2만 원 미만 주문 30%+',540,1250,T-WT('t3',7),{s:66,rot:-.05});
  }},

  /* ── 마무리: 진짜 주인은 배달앱 ── */
  end:{draw(){
    const a=L('e1');
    group(540,720,E.back(P(a,0,.45))+.001,0,1,()=>{
      ctx.fillStyle='#10131f';rr(-190,-330,380,660,48);ctx.fill();ctx.strokeStyle='#4a5272';ctx.lineWidth=8;rr(-190,-330,380,660,48);ctx.stroke();
      const g=ctx.createLinearGradient(0,-300,0,300);g.addColorStop(0,'#3a1f8a');g.addColorStop(1,'#120a33');ctx.fillStyle=g;rr(-165,-300,330,600,32);ctx.fill();
      text('배달앱',0,-220,{f:'D',s:72,c:'#fff'});drawBowl(0,40,.55);
      ctx.fillStyle=C.purple;rr(-120,170,240,70,35);ctx.fill();text('주문 접수',0,206,{s:34,w:900,c:'#1a0f3a'});
      emoji('👑',0,-410,110);
    });
    emoji('🛵',860,1010,130,{alpha:P(a,.3,.3)});
    stampBox('진짜 주인 = 배달앱',540,1250,T-WT('e2',0),{s:72,c:C.purple,rot:-.06,bg:'rgba(30,10,60,.75)'});
  }},
};

"""
EP10_COVER = cover('EP.10', '배달 떡볶이', 170, '같은 2만 원', 600, 104, '남는 돈 10배 차이?', 84,
                   "drawBowl(270,1080,.8);", 'rgba(255,77,77,.22)')
build(SH + 'delivery.html', '비밀의 계산기 배달 떡볶이 편', 'EP.10 배달 떡볶이', 'delivery', 'delivery', 'EP10', 'EP.10',
      EP10_CUES, EP10_CONSTS, EP10_HELPERS,
      "const SEQ=['2','00','00','−','1','9','3','6','0','='];   // 20,000 − 19,360",
      KEYS_EXTRA + "  for(let i=0;i<14;i++)ev.push({t:TL.word[IDX.r2][4]+.3+i*.036,n:'tick'});",
      EP10_SCENES, EP10_COVER, 'split', amount_re=r"/^[\d,]+원[.,]?$/")
apply_ref(SH + 'delivery.html', ['같은 2만 원 떡볶이','매장 vs 배달, 남는 돈은?'], '주문 1건 예시 · 중개 7.8%·배달비 3,400원 가정 · 세금 제외')

# ═══════════════════════════════ EP.11 동네 꽃집 ═══════════════════════════════
EP11_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'꽃다발 하나 [5만 원], 동네 [꽃집].',sfx:[[0,'whoosh'],['w2','impact']],shake:[['w2',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 꽃집이 제일 많이 사는 건, [버릴 꽃]이죠.',sfx:[['w6','buzz']]},
  {id:'h2',sc:'hook',   text:'하루 네 다발이면 월 매출 [600만 원].',pause:250,sfx:[[0,'rise'],['w5','stamp']]},
  {id:'k1',sc:'cost',   text:'판 꽃의 매입값 {240만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'포장지와 리본 {40만 원}.'},
  {id:'k3',sc:'cost',   text:'임대료 {150만 원}.'},
  {id:'k4',sc:'cost',   text:'꽃 냉장고 전기료 {30만 원}.'},
  {id:'k5',sc:'cost',   text:'카드 수수료와 잡비 {40만 원}.',pause:200},
  {id:'r1',sc:'result', text:'사장님 몫은 얼마일까요? <100만 원>.',pause:300,sfx:[[0,'whoosh'],['w3','coin']]},
  {id:'t1',sc:'waste',  text:'그런데 꽃은 사흘이면 시듭니다.',sfx:[[0,'scratch'],[.02,'impact']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'waste',  text:'사 온 꽃의 [30%]만 버려도, 버린 꽃값이 {103만 원}.',pause:200,sfx:[['w3','pop'],['w8','buzz']]},
  """ + SIG + r"""
  {id:'t3',sc:'loss',   text:'남는 돈 100만 원이 오히려 {3만 원} 적자로 바뀌죠.',pause:250,sfx:[['w5','buzz']],shake:[['w5',12,.35]]},
  {id:'t4',sc:'price',  text:'게다가 올 1월 장미 한 단 경매가는 1년 새 {66%} 올랐죠.',pause:300,sfx:[[0,'whoosh'],['w9','impact']]},
  {id:'e1',sc:'end',    text:'꽃집은 꽃을 파는 게 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[시드는 시간]과 싸우는 장사였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 1인 꽃집 월 비용 (단위: 만 원) — 하루 4다발 × 5만 원 × 30일
const COSTS=[
  {cue:'k1',ic:'💐',lb:'판 꽃 매입 (40%)',v:240},
  {cue:'k2',ic:'🎀',lb:'포장지·리본',v:40},
  {cue:'k3',ic:'🏠',lb:'임대료',v:150},
  {cue:'k4',ic:'❄️',lb:'꽃 냉장고 전기',v:30},
  {cue:'k5',ic:'💳',lb:'카드 수수료·잡비',v:40},
];
"""
EP11_CONSTS = """// 막대 1개 = 월 매출 600만 원. 비용은 오른쪽부터 잘라 감
const GROSS=600,BX=90,BWID=900;
(()=>{let top=GROSS;COSTS.forEach(c=>{c.hi=top;c.lo=top-c.v;top=c.lo;});})();
const vx=v=>BX+v/GROSS*BWID;
"""
EP11_HELPERS = r"""/* 두 색 섞기 (꽃이 시들 때) */
function mix(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')})`;}
/* 꽃다발: wilt 0 = 싱싱, 1 = 시듦 */
function drawBouquet(x,y,s,wilt=0){
  group(x,y,s,0,1,()=>{
    ctx.fillStyle=mix('#3fae6a','#7a6a3a',wilt);
    [[-150,-60,-.6],[150,-60,.6],[-90,-20,-.3],[95,-25,.3]].forEach(([lx,ly,r])=>{ctx.beginPath();ctx.ellipse(lx,ly+wilt*30,60,22,r+wilt*.5*Math.sign(r),0,7);ctx.fill();});
    [[-95,-170,'#FF6FA8'],[0,-205,'#FFD1E1'],[95,-165,'#FF4D6D'],[-45,-110,'#FFB3C7'],[50,-115,'#F9A8D4'],[-130,-95,'#FFE08A'],[130,-92,'#FFFFFF']].forEach(([fx,fy,c],i)=>{
      const dx=fx*(1+wilt*.25),dy=fy+wilt*(70+i*10),rs=1-wilt*.35;ctx.fillStyle=mix(c,'#8a6a4a',wilt);
      for(let p=0;p<6;p++){const an=p/6*Math.PI*2+i;ctx.beginPath();ctx.ellipse(dx+Math.cos(an)*22*rs,dy+Math.sin(an)*22*rs,20*rs,14*rs,an,0,7);ctx.fill();}
      ctx.fillStyle=mix('#FFC531','#5b4a2e',wilt);ctx.beginPath();ctx.arc(dx,dy,12*rs,0,7);ctx.fill();});
    ctx.fillStyle='#F6F1E4';ctx.beginPath();ctx.moveTo(-175,-80);ctx.lineTo(175,-80);ctx.lineTo(32,260);ctx.lineTo(-32,260);ctx.closePath();ctx.fill();
    ctx.fillStyle='#E4D8BC';ctx.beginPath();ctx.moveTo(-175,-80);ctx.lineTo(0,-40);ctx.lineTo(-32,260);ctx.closePath();ctx.fill();
    ctx.fillStyle='#E53935';rr(-62,118,124,30,8);ctx.fill();
    ctx.beginPath();ctx.moveTo(0,133);ctx.lineTo(-52,205);ctx.lineTo(-20,205);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(0,133);ctx.lineTo(52,205);ctx.lineTo(20,205);ctx.closePath();ctx.fill();
  });
}
/* 쓰레기통 */
function drawBin(x,y,s){
  group(x,y,s,0,1,()=>{
    ctx.fillStyle='#4a5266';ctx.beginPath();ctx.moveTo(-110,-120);ctx.lineTo(110,-120);ctx.lineTo(85,140);ctx.lineTo(-85,140);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#2c3244';ctx.lineWidth=6;for(let i=-1;i<=1;i++)line(i*45,-90,i*36,115);
    ctx.fillStyle='#5d667d';rr(-130,-150,260,34,12);ctx.fill();
  });
}
"""
EP11_SCENES = CASHBAR + r"""const BAR_Y=560,BAR_H=160;
const SCENES={
  /* ── 훅: 꽃다발 5만 원 → 버릴 꽃 → 월 매출 600만 원 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h2'),q=L('h1b');
    if(b<0){
      text('꽃다발 하나',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
      text('50,000원',540,334,{f:'D',s:136,c:'#FF6FA8',glow:'rgba(255,111,168,.45)',alpha:P(a,0,.15)});
      drawBouquet(q>=0?430:540,800,E.back(P(a,0,.5))*1.15+.001);
      if(q>=0){const k=E.back(P(T-WT('h1b',6),0,.4));
        group(850,1060,k*.85+.001,.08,1,()=>{drawBouquet(0,-150,.4,1);drawBin(0,0,1);});
        stampBox('버릴 꽃?',300,1270,T-WT('h1b',6),{s:72,rot:-.08});}
    }else{
      text('월 매출',540,236,{s:40,w:700,c:C.dim});
      text(won(6000000*E.out(P(b,.1,1.1)))+'원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)'});
      text('하루 4다발 × 5만 원 × 30일',540,425,{s:36,w:800,c:C.dim,alpha:P(b,.2,.3)});
      for(let i=0;i<4;i++){const t=b-(.2+i*.15);if(t<0)break;drawBouquet(195+i*230,820,.58*E.back(P(t,0,.3))+.001);}
      text('× 30일',540,1170,{f:'D',s:72,c:C.gold,alpha:P(b,.9,.3)});
    }
  }},

  /* ── 비용 차감 ── */
  cost:{draw(){
    let m=GROSS;COSTS.forEach(c=>{m-=c.v*E.out(P(T-c.tr,0,.6));});
    const col=m>300?C.gold:m>130?'#FF9F43':C.red;
    text('이번 달 남은 돈',540,232,{s:40,w:700,c:C.dim});
    let bump=0;COSTS.forEach(c=>{const d=T-c.tr;if(d>=0&&d<.3)bump=Math.max(bump,Math.sin(d/.3*Math.PI));});
    group(540,330,1+bump*.06,0,1,()=>text(won(m*10000)+'원',0,0,{f:'D',s:128,c:col}));
    text(`매출의 ${(m/6).toFixed(0)}%`,540,425,{s:36,w:800,c:col});
    ctx.fillStyle='rgba(255,255,255,.06)';rr(BX,BAR_Y,BWID,BAR_H,18);ctx.fill();
    cashBar(BX,vx(m),BAR_Y,BAR_H,'#FFB0DD','#E04A9E');
    const act=COSTS.find(c=>T>=CT(c.cue)&&T<c.tr);
    if(act){ctx.save();ctx.fillStyle=`rgba(255,77,77,${.45+.3*Math.sin(R*14)})`;rr(vx(act.lo),BAR_Y,vx(act.hi)-vx(act.lo),BAR_H,14);ctx.fill();ctx.restore();}
    COSTS.forEach(c=>{const d=T-c.tr;if(d<0||d>.75)return;
      text('−'+c.v+'만',(vx(c.lo)+vx(c.hi))/2,BAR_Y+BAR_H/2-d*50,{f:'D',s:60,c:C.red,alpha:1-P(d,.4,.35),st:9});});
""" + chips_grid(820, 90, 70) + r"""    drawBouquet(540,1220,.42);
  }},

  /* ── 결과: 사장님 몫 100만 원 ── */
  result:{draw(){
    const a=L('r1'),q=T-WT('r1',3);
    text('한 달 사장님 몫',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    if(q<0)text('?',540,400,{f:'D',s:200,c:C.gold,alpha:P(a,0,.2)});
    else group(540,400,lerp(1.6,1,E.out(P(q,.05,.3))),0,P(q,0,.15),()=>text('1,000,000원',0,0,{f:'D',s:130,c:C.green,glow:'rgba(53,224,138,.45)'}));
    text('하루 약 33,000원',540,520,{s:46,w:900,c:C.gold,alpha:P(q,.4,.3)});
    drawBouquet(540,880,.8);
    text('꽃다발 하나(5만 원)보다 적은 하루 몫',540,1200,{s:36,w:800,c:C.dim,alpha:P(q,.8,.3)});
  }},

  /* ── 반전: 사흘이면 시든다 → 30% 버리면 103만 원 ── */
  waste:{draw(){
    const a=L('t1'),b=L('t2');
""" + dark('a') + r"""    text('꽃은 사흘이면 시든다',540,250,{s:48,w:900,alpha:P(a,0,.3)});
    ['1일째','2일째','3일째'].forEach((d,i)=>{const k=P(a,.2+i*.3,.25);if(k<=0)return;
      group(0,0,1,0,k,()=>{drawBouquet(220+i*320,580,.5,i*.5);text(d,220+i*320,770,{f:'D',s:44,c:i===2?C.red:'#fff'});});});
    text('"매입 후 2~3일 안에 못 팔면 폐기" — 경남도민일보 2025.8.6',540,840,{s:24,w:700,c:C.dim,alpha:P(a,1,.3)});
    if(b>=0){
      const k=E.out(P(b,0,.5)),k2=E.out(P(T-WT('t2',3),0,.5)),y=930,h=130;
      text('사 온 꽃 343만 원어치',BX,y-30,{a:'left',s:34,w:900,alpha:k});
      ctx.fillStyle='rgba(255,255,255,.06)';rr(BX,y,BWID,h,18);ctx.fill();
      cashBar(BX,BX+BWID*.7*k,y,h,'#FFB0DD','#E04A9E');
      if(k2>0){ctx.fillStyle='#7a5a3a';rr(BX+BWID*.7,y,BWID*.3*k2,h,18);ctx.fill();emoji('🥀',BX+BWID*.85,y+h/2,64,{alpha:k2});}
      text('팔린 꽃 240만 (70%)',BX+BWID*.35,y+h+44,{s:32,w:900,c:'#FFB0DD',alpha:k});
      text('버린 꽃 103만 (30%)',BX+BWID*.85,y+h+44,{s:32,w:900,c:'#d9b38c',alpha:k2});
      stampBox('103만 원 버림',540,1270,T-WT('t2',8),{s:70,rot:-.06});
    }
  }},
""" + calc_op('−30,000', typing=90, small=32, done=100) + r"""
  /* ── 결과 2: 100만 원 → 3만 원 적자 ── */
  loss:{draw(){
    const a=L('t3'),q=T-WT('t3',5);
    text('버린 꽃값까지 넣으면, 한 달',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    if(q<0)text('1,000,000원',540,380,{f:'D',s:120,c:C.green});
    else group(540,380,lerp(1.6,1,E.out(P(q,.05,.3))),0,P(q,0,.15),()=>text('−30,000원',0,0,{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.5)'}));
    const rows=[['매출 (하루 4다발)','6,000,000',C.green],['팔린 꽃 매입','−2,400,000',C.red],['버린 꽃 (30%)','−1,030,000','#FF6B6B'],['포장지·리본','−400,000',C.red],['임대료','−1,500,000',C.red],['전기·카드·잡비','−700,000',C.red]];
    rows.forEach((r,i)=>{const k=P(a-.2-i*.1,0,.25);if(k<=0)return;const y=530+i*92;
      group((1-E.out(k))*40,0,1,0,k,()=>{if(i===2){ctx.fillStyle='rgba(255,77,77,.16)';rr(110,y-40,860,80,14);ctx.fill();}
        text(r[0],130,y,{a:'left',s:38,w:800});text(r[1],950,y,{a:'right',f:'D',s:46,c:r[2]});if(i<5)dashed(130,y+46,950,'rgba(255,255,255,.12)');});});
  }},

  /* ── 원가 압박: 장미 경매가 66% 상승 ── */
  price:{draw(){
    const a=L('t4'),k=E.out(P(T-WT('t4',9),0,.7));
    text('장미 1단 1월 평균 경매가',540,250,{s:46,w:900,alpha:P(a,0,.3)});
    text('aT 양재 화훼공판장 · 아시아경제 2026.1.15',540,305,{s:26,w:700,c:C.dim,alpha:P(a,0,.3)});
    const base=1150,sc=560/17603;
    const bar=(cx,v,c1,c2,lb,val,al)=>{const h=v*sc;ctx.fillStyle='rgba(255,255,255,.06)';rr(cx-140,base-h,280,h,24);ctx.fill();
      const g=ctx.createLinearGradient(0,base-h,0,base);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;rr(cx-140,base-h*al,280,h*al,24);ctx.fill();
      text(val,cx,base-h*al-50,{f:'D',s:60,c:c1,alpha:al>0?1:0});text(lb,cx,base+56,{s:40,w:900,c:C.dim});};
    bar(320,10585,'#d6dbe6','#8e98ad','2025년 1월','약 10,600원',P(a,.3,.5));
    bar(760,17603,'#FF8FB1','#d63a6a','2026년 1월',won(17603*k)+'원',k);
    stampBox('+66%',540,600,T-WT('t4',9)+.3,{s:110,rot:-.08});
  }},

  /* ── 마무리: 시드는 시간과 싸우는 장사 ── */
  end:{draw(){
    const a=L('e1');
    drawBouquet(400,780,E.back(P(a,0,.45))*1.05+.001,.15*Math.min(1,Math.max(0,a/3)));
    emoji('⏳',810,700,180,{alpha:P(a,.3,.3),rot:Math.sin(R*2)*.1});
    stampBox('시드는 시간과의 싸움',540,1250,T-WT('e2',0),{s:70,c:C.gold,rot:-.06,bg:'rgba(40,30,0,.75)'});
  }},
};

"""
EP11_COVER = cover('EP.11', '동네 꽃집', 200, '꽃다발 5만 원', 740, 96, '제일 많이 사는 건?', 88,
                   "drawBouquet(260,1110,.85);", 'rgba(255,111,168,.22)')
build(SH + 'flower-shop.html', '비밀의 계산기 동네 꽃집 편', 'EP.11 동네 꽃집', 'flower-shop', 'flower_shop', 'EP11', 'EP.11',
      EP11_CUES, EP11_CONSTS, EP11_HELPERS,
      "const SEQ=['1','00','00','00','−','1','0','3','00','00','='];   // 1,000,000 − 1,030,000",
      KEYS_EXTRA + "  for(let i=0;i<4;i++)ev.push({t:TL.cue[IDX.h2]+.2+i*.15,n:'pop'});",
      EP11_SCENES, EP11_COVER, 'waste')
apply_ref(SH + 'flower-shop.html', ['꽃다발 5만 원, 꽃집이','제일 많이 사는 것(?)'], '1인 꽃집·하루 4다발·폐기 30% 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.12 PC방 ═══════════════════════════════
EP12_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'한 시간 [1,200원], 동네 [PC방] 50석.',sfx:[[0,'whoosh'],['w4','impact']],shake:[['w4',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 PC방이 진짜 파는 건 [컴퓨터]가 아니죠.',sfx:[['w5','pop']]},
  {id:'h2',sc:'hook',   text:'좌석 30%만 차도 월 [1,300만 원].',pause:250,sfx:[[0,'rise'],['w4','stamp']]},
  {id:'k1',sc:'cost',   text:'임대료 {400만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'24시간 전기료 {250만 원}.'},
  {id:'k3',sc:'cost',   text:'알바비 {500만 원}.'},
  {id:'k4',sc:'cost',   text:'PC 50대 교체비 {월 350만 원}.'},
  {id:'k5',sc:'cost',   text:'게임 사용료와 관리비 {100만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'loss',   text:'그럼 남는 돈은요? {300만 원} 적자.',pause:300,sfx:[[0,'whoosh'],['w3','buzz']],shake:[['w3',12,.35]]},
  {id:'t1',sc:'food',   text:'그런데도 버티는 비결은 [라면과 음료]죠.',sfx:[[0,'scratch'],[.02,'impact'],['w3','pop']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'food',   text:'PC방 매출의 [34%]가 먹거리죠.',sfx:[['w2','kaching']]},
  {id:'t3',sc:'food',   text:'먹거리 시킨 손님은 [1.5배] 더 오래 앉아 있고요.',sfx:[['w3','stamp']]},
  {id:'t4',sc:'food',   text:'먹거리 이익 <400만 원>이 적자를 메워, 남는 돈 <100만 원>.',pause:300,sfx:[['w2','coin'],['w9','kaching']]},
  {id:'e1',sc:'end',    text:'PC방은 게임방이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[라면 파는 식당]이었던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// PC방 50석 월 비용 (단위: 만 원) — 좌석 30% 가동, 시간당 1,200원
const COSTS=[
  {cue:'k1',ic:'🏠',lb:'임대료',v:400},
  {cue:'k2',ic:'⚡',lb:'24시간 전기료',v:250},
  {cue:'k3',ic:'👤',lb:'알바비 (하루 16시간)',v:500},
  {cue:'k4',ic:'🖥️',lb:'PC 교체 (3년)',v:350},
  {cue:'k5',ic:'🎮',lb:'게임 사용료·관리',v:100},
];
"""
EP12_CONSTS = """// PC 요금 매출 1,300만 원 vs 비용 1,600만 원 (단위: 만 원)
const REV=1300,SCL=900/1700,X0=90;
"""
EP12_HELPERS = r"""/* 모니터 + 키보드 */
function drawPC(x,y,s,label='GAME'){
  group(x,y,s,0,1,()=>{
    const bad=label==='적자';
    ctx.fillStyle='#0b0f1d';rr(-260,-200,520,330,22);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=6;rr(-260,-200,520,330,22);ctx.stroke();
    const g=ctx.createLinearGradient(-240,-180,240,110);g.addColorStop(0,bad?'#5a0d14':'#2b1d6b');g.addColorStop(1,bad?'#b3202c':'#1f6fb0');
    ctx.fillStyle=g;rr(-238,-178,476,286,12);ctx.fill();
    text(label,0,-35,{f:'D',s:label.length>2?100:150,c:'#fff',glow:'rgba(255,255,255,.4)'});
    ctx.fillStyle='#2a3046';ctx.fillRect(-30,130,60,70);rr(-120,195,240,24,10);ctx.fill();
    ctx.fillStyle='#1b2033';rr(-220,240,440,64,14);ctx.fill();
    for(let r=0;r<3;r++)for(let q=0;q<12;q++){ctx.fillStyle='#39405a';rr(-205+q*35,250+r*16,28,11,3);ctx.fill();}
    ctx.fillStyle=`hsl(${(R*120)%360},90%,60%)`;ctx.fillRect(-220,300,440,4);
  });
}
/* 라면 한 그릇 */
function drawRamen(x,y,s){
  group(x,y,s,0,1,()=>{
""" + STEAM + r"""    ctx.fillStyle='#c62828';ctx.beginPath();ctx.moveTo(-230,-20);ctx.quadraticCurveTo(-210,150,0,160);ctx.quadraticCurveTo(210,150,230,-20);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=5;for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(-120+i*60,60,18,0,Math.PI);ctx.stroke();}
    ctx.fillStyle='#8e1b1b';ctx.beginPath();ctx.ellipse(0,-20,230,70,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#F2A33A';ctx.beginPath();ctx.ellipse(0,-26,205,55,0,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.beginPath();ctx.ellipse(0,-26,205,55,0,0,Math.PI*2);ctx.clip();ctx.strokeStyle='#FFE7A0';ctx.lineWidth=6;
    for(let r=0;r<6;r++){ctx.beginPath();for(let xx=-200;xx<=200;xx+=8)ctx.lineTo(xx,-62+r*14+Math.sin(xx*.08+r)*6);ctx.stroke();}ctx.restore();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(90,-36,48,30,.2,0,7);ctx.fill();ctx.fillStyle='#FFB300';ctx.beginPath();ctx.arc(94,-36,17,0,7);ctx.fill();
    ctx.fillStyle='#5cc35a';[[-110,-40],[-70,-20],[-30,-48],[10,-14],[-150,-24]].forEach(([gx,gy])=>{ctx.beginPath();ctx.arc(gx,gy,9,0,7);ctx.fill();});
  });
}
"""
EP12_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 한 시간 1,200원 → PC가 아니다? → 좌석 30%, 월 1,300만 원 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h2'),q=L('h1b');
    if(b<0){
      text('PC방 1시간',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
      text('1,200원',540,334,{f:'D',s:136,c:C.cyan,glow:'rgba(111,211,255,.45)',alpha:P(a,0,.15)});
      drawPC(540,780,E.back(P(a,0,.5))*1.1+.001,q>=0?'?':'GAME');
      if(q>=0)stampBox('PC가 아니다?',540,1265,T-WT('h1b',5),{s:70,rot:-.06});
    }else{
      text('PC 요금 매출 (월)',540,236,{s:40,w:700,c:C.dim});
      text(won(13000000*E.out(P(b,.1,1.1)))+'원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)'});
      text('50석 × 하루 좌석 30% × 1,200원',540,425,{s:36,w:800,c:C.dim,alpha:P(b,.2,.3)});
      const LIT=[1,4,7,12,15,18,22,26,29,33,36,40,43,46,48];
      for(let i=0;i<50;i++){const t=b-(.1+i*.012);if(t<0)break;const x=104+(i%10)*88,y=520+Math.floor(i/10)*110,on=LIT.includes(i);
        group(0,0,1,0,P(t,0,.15),()=>{ctx.fillStyle=on?'#1f6fb0':'#141b30';rr(x,y,76,60,10);ctx.fill();ctx.strokeStyle=on?'#6FD3FF':'#2c3756';ctx.lineWidth=3;rr(x,y,76,60,10);ctx.stroke();
          ctx.fillStyle='#2a3046';ctx.fillRect(x+30,y+60,16,14);if(on)emoji('🎮',x+38,y+30,28);});}
      text('켜진 자리 15석 = 30%',540,1120,{s:34,w:800,c:C.cyan,alpha:P(b,.9,.3)});
    }
  }},

  /* ── 비용 차감: 매출 막대 vs 비용 막대 ── */
  cost:{draw(){
    let spent=0;COSTS.forEach(c=>{spent+=c.v*E.out(P(T-c.tr,0,.6));});
    const m=REV-spent,col=m>600?C.gold:m>0?'#FF9F43':C.red;
    text('이번 달 남은 돈',540,232,{s:40,w:700,c:C.dim});
    let bump=0;COSTS.forEach(c=>{const d=T-c.tr;if(d>=0&&d<.3)bump=Math.max(bump,Math.sin(d/.3*Math.PI));});
    group(540,330,1+bump*.06,0,1,()=>text((m<0?'−':'')+won(Math.abs(m)*10000)+'원',0,0,{f:'D',s:120,c:col,glow:m<0?'rgba(255,77,77,.6)':null,gb:40}));
    text('PC 요금 매출 1,300만',X0,470,{a:'left',s:32,w:900,c:C.cyan});
    cashBar(X0,X0+REV*SCL,495,90,'#9fe3ff','#2a8fd0');
    text('비용',X0,640,{a:'left',s:32,w:900,c:'#ff9a9a'});
    ctx.fillStyle='rgba(255,255,255,.06)';rr(X0,665,900,90,18);ctx.fill();
    let x=X0;COSTS.forEach((c,k)=>{const w=c.v*SCL*E.out(P(T-c.tr,0,.6));if(w<=0)return;
      ctx.fillStyle=k%2?'#ff6b6b':'#e04848';ctx.fillRect(x,665,w-2,90);if(w>70)emoji(c.ic,x+w/2,710,36);
      const d=T-c.tr;if(d>=0&&d<1)text('−'+c.v+'만',x+w/2,630-d*40,{f:'D',s:52,c:C.red,alpha:1-P(d,.6,.4),st:8});x+=w;});
    ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle='#fff';ctx.lineWidth=3;line(X0+REV*SCL,470,X0+REV*SCL,790);ctx.restore();
    if(spent>REV){const ox=X0+REV*SCL,ow=(spent-REV)*SCL;ctx.save();ctx.strokeStyle=`rgba(255,77,77,${.6+.4*Math.sin(R*12)})`;ctx.lineWidth=6;rr(ox,659,ow,102,10);ctx.stroke();ctx.restore();
      text('적자',ox+ow/2,800,{f:'D',s:40,c:C.red});}
""" + chips_grid(870, 90, 70) + r"""  }},
""" + calc_op('−3,000,000', typing=86, small=30, done=84) + r"""
  /* ── 결과: PC 요금만으로는 300만 원 적자 ── */
  loss:{draw(){
    const a=L('r1'),q=T-WT('r1',3);
""" + dark('a') + r"""    text('PC 요금만으로는, 한 달',540,250,{s:46,w:800,c:'#fff',alpha:P(a,0,.25)});
    if(q<0)text('?',540,400,{f:'D',s:200,c:C.gold,alpha:P(a,0,.2)});
    else group(540,400,lerp(1.6,1,E.out(P(q,.05,.3))),0,P(q,0,.15),()=>text('−3,000,000원',0,0,{f:'D',s:120,c:C.red,glow:'rgba(255,77,77,.5)'}));
    drawPC(540,880,.9,q>=0?'적자':'GAME');
  }},

  /* ── 반전: 라면과 음료가 적자를 메운다 ── */
  food:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
    if(d<0){
      text('그런데도 버티는 비결',540,250,{s:48,w:900,alpha:P(a,0,.3)});
      if(T<WT('t1',3))text('?',540,580,{f:'D',s:260,c:C.gold,alpha:P(a,0,.3),glow:'rgba(255,197,49,.4)'});
      else drawRamen(360,560,E.back(P(T-WT('t1',3),0,.4))*.85+.001);
      emoji('🥤',800,540,170,{sc:E.back(P(T-WT('t1',4),0,.4))+.001});
      if(b>=0){const k=E.out(P(b,.1,.6)),y=800,h=110;
        ctx.fillStyle='rgba(255,255,255,.06)';rr(90,y,900,h,18);ctx.fill();
        cashBar(90,90+900*.66*k,y,h,'#9fe3ff','#2a8fd0');ctx.fillStyle='#FF9F43';rr(90+900*.66,y,900*.34*k,h,18);ctx.fill();
        text('컴퓨터 66%',90+900*.33,y+h/2,{s:36,w:900,c:'#06233a',alpha:k});text('먹거리 34%',90+900*.83,y+h/2,{s:36,w:900,c:'#2a1600',alpha:k});
        text('PC방 매출 구성 · 엔미디어플랫폼 분석 (NDC 2021)',540,y+h+40,{s:24,w:700,c:C.dim,alpha:k});}
      if(c>=0){const k=E.out(P(c,.1,.6));
        [['먹거리 안 시킨 손님',3.1,'#8e98ad'],['먹거리 시킨 손님',4.6,'#FF9F43']].forEach(([lb,h2,col],i)=>{const y=1060+i*110;
          text(lb,90,y-22,{a:'left',s:30,w:800,c:col,alpha:k});ctx.fillStyle=col;rr(90,y,640*h2/4.6*k,56,14);ctx.fill();
          text(h2+'시간',90+640*h2/4.6*k+20,y+28,{a:'left',f:'D',s:44,c:col,alpha:k});});
        stampBox('1.5배',540,1305,T-WT('t3',3),{s:76,c:C.gold,rot:-.06,bg:'rgba(40,30,0,.75)'});}
    }else{
      text('한 달 결산',540,250,{s:48,w:900});
      const base=760,f=E.out(P(T-WT('t4',2),0,.6)),n=E.out(P(T-WT('t4',9),0,.5));
      dashed(110,base,970,'rgba(255,255,255,.3)');
      ctx.fillStyle='#e04848';rr(170,base,220,300,16);ctx.fill();text('PC 요금',280,base+350,{s:38,w:900,c:'#ff9a9a'});text('−300만',280,base+150,{f:'D',s:52,c:'#fff'});
      ctx.fillStyle='#FF9F43';rr(430,base+300-400*f,220,400*f,16);ctx.fill();text('먹거리',540,base+350,{s:38,w:900,c:'#FFB870'});if(f>0)text('+400만',540,base+300-400*f-50,{f:'D',s:56,c:'#FFB870'});
      if(n>0){vCash2(690,base-100*n,220,100*n);text('남는 돈',800,base+350,{s:38,w:900,c:C.green});text('100만',800,base-100*n-50,{f:'D',s:60,c:C.green});}
    }
  }},

  /* ── 마무리: 라면 파는 식당 ── */
  end:{draw(){
    const a=L('e1');
    group(0,0,1,0,.55,()=>drawPC(300,640,.6,'GAME'));
    drawRamen(640,830,E.back(P(a,0,.45))*1.05+.001);
    group(640,520,E.back(P(a,.3,.4))+.001,-.04,1,()=>{ctx.fillStyle=C.gold;rr(-190,-60,380,120,24);ctx.fill();text('라면 맛집',0,4,{f:'D',s:72,c:C.ink});});
    stampBox('라면 파는 식당',540,1250,T-WT('e2',0),{s:80,c:C.gold,rot:-.06,bg:'rgba(40,30,0,.75)'});
  }},
};
function vCash2(x0,y0,w,h){if(h<1)return;const g=ctx.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,'#9ff0c4');g.addColorStop(1,'#1fa864');ctx.fillStyle=g;rr(x0,y0,w,h,Math.min(16,h/2));ctx.fill();}

"""
EP12_COVER = cover('EP.12', 'PC방', 260, '한 시간 1,200원', 760, 92, '진짜 돈은 어디서?', 96,
                   "drawPC(270,1130,.6,'GAME');", 'rgba(111,211,255,.22)')
build(SH + 'pc-bang.html', '비밀의 계산기 PC방 편', 'EP.12 PC방', 'pc-bang', 'pc_bang', 'EP12', 'EP.12',
      EP12_CUES, EP12_CONSTS, EP12_HELPERS,
      "const SEQ=['1','3','00','00','00','−','1','6','00','00','00','='];   // 13,000,000 − 16,000,000",
      KEYS_EXTRA + "  for(let i=0;i<8;i++)ev.push({t:TL.cue[IDX.h2]+.1+i*.08,n:'tick'});",
      EP12_SCENES, EP12_COVER, 'loss')
apply_ref(SH + 'pc-bang.html', ['PC방 한 시간 1,200원','진짜 돈은 어디서 벌까?'], '50석·좌석 30% 가동·먹거리 원가 40% 가정 예시 · 세금 제외')
