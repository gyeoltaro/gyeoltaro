# EP.13 무인 문구점 · EP.14 동네 빵집 · EP.15 동네 호프집 — 포맷 v2 (build_batch3.py 의 공용 함수 재사용)
# 2026.10.29 첫 성과 반영: 커버(0.3초)를 '두 숫자 대비'로, 업로드 제목에 금액을 넣는다.
src = open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'build_batch3.py'), encoding='utf-8').read()
exec(src[:src.index("# ═══════════════════════════════ EP.07")])

SH = '/home/user/gyeoltaro/shorts/'

def cover2(ep, title, ts, top_lb, top_v, bot_lb, bot_v, prop, glow='rgba(255,197,49,.20)', bot_col='#E53935'):
    """커버: 업종 제목 + 흰 칸(앞 숫자) ↓ 빨간 칸(뒤 숫자). 아래 280px 은 쇼츠 UI 자리라 비운다."""
    return r"""/* 썸네일 커버 — 영상 맨 앞 0.3초 + 시작 화면 + 썸네일 PNG (두 숫자 대비) */
function drawCover(){
  drawBG();
  const g=ctx.createRadialGradient(540,960,40,540,960,820);g.addColorStop(0,'@GLOW@');g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(0,0,0,.35)';rr(60,70,420,84,42);ctx.fill();
  ctx.strokeStyle=C.gold;ctx.lineWidth=3;rr(60,70,420,84,42);ctx.stroke();
  calcLogo(112,112,.32);text('비밀의 계산기',292,113,{s:40,w:900,c:C.gold});
  text('@EPNUM@',1020,113,{a:'right',s:40,w:700,c:'rgba(255,255,255,.75)'});
  group(540,330,1,-.03,1,()=>text('@TITLE@',0,0,{f:'D',s:@TS@,c:'#fff',st:24,sc:'#0a1228'}));
  @PROP@
  group(540,880,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-430,-120,860,240,32);ctx.fill();text('@TOPLB@',0,-58,{s:46,w:900,c:'#59627c'});text('@TOPV@',0,38,{f:'D',s:120,c:C.ink});});
  text('↓',540,1075,{f:'D',s:120,c:'#fff',st:16});
  group(540,1270,1,.03,1,()=>{ctx.fillStyle='@BOTCOL@';rr(-460,-130,920,260,32);ctx.fill();text('@BOTLB@',0,-62,{s:46,w:900,c:'rgba(255,255,255,.85)'});text('@BOTV@',0,42,{f:'D',s:128,c:'#fff'});});
  vignette();
}
""".replace('@GLOW@', glow).replace('@EPNUM@', ep).replace('@TITLE@', title).replace('@TS@', str(ts)).replace('@PROP@', prop) \
   .replace('@TOPLB@', top_lb).replace('@TOPV@', top_v).replace('@BOTLB@', bot_lb).replace('@BOTV@', bot_v).replace('@BOTCOL@', bot_col)

def cost_scene(rev_label, rev_col1='#9fe3ff', rev_col2='#2a8fd0', rev_col='C.cyan'):
    """매출 막대 vs 비용 막대 (EP.12와 같은 틀). COSTS 단위: 만 원, REV·SCL·X0 상수 필요."""
    return r"""
  /* ── 비용 차감: 매출 막대 vs 비용 막대 ── */
  cost:{draw(){
    let spent=0;COSTS.forEach(c=>{spent+=c.v*E.out(P(T-c.tr,0,.6));});
    const m=REV-spent,col=m>REV*.35?C.gold:m>0?'#FF9F43':C.red;
    text('이번 달 남은 돈',540,232,{s:40,w:700,c:C.dim});
    let bump=0;COSTS.forEach(c=>{const d=T-c.tr;if(d>=0&&d<.3)bump=Math.max(bump,Math.sin(d/.3*Math.PI));});
    group(540,330,1+bump*.06,0,1,()=>text((m<0?'−':'')+won(Math.abs(m)*10000)+'원',0,0,{f:'D',s:120,c:col,glow:m<0?'rgba(255,77,77,.6)':null,gb:40}));
    text('@REVLB@',X0,470,{a:'left',s:32,w:900,c:@REVCOL@});
    cashBar(X0,X0+REV*SCL,495,90,'@C1@','@C2@');
    text('비용',X0,640,{a:'left',s:32,w:900,c:'#ff9a9a'});
    ctx.fillStyle='rgba(255,255,255,.06)';rr(X0,665,900,90,18);ctx.fill();
    let x=X0;COSTS.forEach((c,k)=>{const w=c.v*SCL*E.out(P(T-c.tr,0,.6));if(w<=0)return;
      ctx.fillStyle=k%2?'#ff6b6b':'#e04848';ctx.fillRect(x,665,w-2,90);if(w>70)emoji(c.ic,x+w/2,710,36);
      const d=T-c.tr;if(d>=0&&d<1)text('−'+c.v+'만',x+w/2,630-d*40,{f:'D',s:52,c:C.red,alpha:1-P(d,.6,.4),st:8});x+=w;});
    ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle='#fff';ctx.lineWidth=3;line(X0+REV*SCL,470,X0+REV*SCL,790);ctx.restore();
""".replace('@REVLB@', rev_label).replace('@C1@', rev_col1).replace('@C2@', rev_col2).replace('@REVCOL@', rev_col) + chips_grid(870, 90, 70) + "  }},\n"

def amount_pop(cue, word, val, y=400, col='C.green', glow='rgba(53,224,138,.45)', s=200, q_y=None):
    """질문 뒤 답 단어에서 숫자가 뜬다. 그 전에는 큰 '?' (교훈: 답 전 빈 화면)."""
    return f"""    {{const q=T-WT('{cue}',{word});
    if(q<0)text('?',540,{q_y or y},{{f:'D',s:220,c:C.gold,alpha:P(L('{cue}'),0,.2)}});
    else group(540,{y},lerp(1.7,1,E.out(P(q,.05,.3))),0,P(q,0,.15),()=>text('{val}',0,0,{{f:'D',s:{s},c:{col},glow:'{glow}'}}));}}
"""

COIN = r"""function coinStack(x,y,n,col){
  for(let i=0;i<Math.ceil(n);i++){const part=Math.min(1,n-i),cy=y-i*30;
    ctx.save();ctx.globalAlpha*=part;ctx.fillStyle='#b8860b';ctx.beginPath();ctx.ellipse(x,cy+8,80,22,0,0,7);ctx.fill();
    ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(x,cy,80,22,0,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;ctx.stroke();ctx.restore();}
}
function vCash2(x0,y0,w,h,c1='#9ff0c4',c2='#1fa864'){if(h<1)return;const g=ctx.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;rr(x0,y0,w,h,Math.min(16,h/2));ctx.fill();}
"""

# ═══════════════════════════════ EP.13 무인 문구점 ═══════════════════════════════
EP13_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'교문 앞 무인 문구점, 월 매출 [1,000만 원].',sfx:[[0,'whoosh'],['w6','impact']],shake:[['w6',12,.35]]},
  {id:'h1b',sc:'hook',  text:'직원이 없으니 다 남을 것 같죠? 그런데 [돈을 안 내는] 손님도 있죠.',sfx:[['w8','buzz']]},
  {id:'k1',sc:'cost',   text:'과자와 문구 매입값 {750만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {100만 원}.'},
  {id:'k3',sc:'cost',   text:'키오스크와 CCTV {20만 원}.'},
  {id:'k4',sc:'cost',   text:'전기료와 카드 수수료 {30만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'한 달에 얼마나 남을까요? <100만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'theft',  text:'그런데 무인점포 절도는 작년 [1만 1,015건], 역대 최고였죠.',sfx:[[0,'scratch'],[.02,'impact'],['w4','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'theft',  text:'천 원짜리 과자 하나를 가져가면, 원가 {750원}.',sfx:[['w6','buzz']]},
  {id:'t3',sc:'theft',  text:'이걸 메우려면 같은 과자를 [세 개] 더 팔아야 하죠.',sfx:[['w4','pop']]},
  {id:'t4',sc:'theft',  text:'하루 열 개만 사라져도 한 달 {22만 원}, 남는 돈의 4분의 1이죠.',pause:300,sfx:[['w6','buzz']],shake:[['w6',10,.3]]},
  {id:'e1',sc:'end',    text:'무인점포는 사람이 없는 가게가 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[사장님이 CCTV로 지키는 가게]였던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 무인 문구점 월 비용 (단위: 만 원) — 매입 75% 예시
const COSTS=[
  {cue:'k1',ic:'🍬',lb:'과자·문구 매입 75%',v:750},
  {cue:'k2',ic:'🏠',lb:'임대료',v:100},
  {cue:'k3',ic:'📷',lb:'키오스크·CCTV',v:20},
  {cue:'k4',ic:'⚡',lb:'전기·카드 수수료',v:30},
];
"""
EP13_CONSTS = """// 매출 1,000만 원 vs 비용 900만 원 (단위: 만 원)
const REV=1000,SCL=900/1000,X0=90;
"""
EP13_HELPERS = COIN + r"""/* 무인 문구점 외관 (상표 없음) */
function drawStationery(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#24304f';rr(-380,-300,760,600,18);ctx.fill();
    ctx.fillStyle='#ff7aa8';rr(-380,-300,760,110,16);ctx.fill();text('무인 문구·과자',0,-243,{f:'D',s:66,c:'#fff'});
    ctx.save();ctx.shadowColor='rgba(255,236,170,.6)';ctx.shadowBlur=40;ctx.fillStyle='#fff5d6';rr(-340,-160,470,420,10);ctx.fill();ctx.restore();
    for(let r=0;r<3;r++){ctx.fillStyle='rgba(36,48,79,.35)';ctx.fillRect(-330,-90+r*130,450,10);
      for(let j=0;j<6;j++)emoji(['🍬','🍭','✏️','🧃','🍫','📒'][(r*2+j)%6],-295+j*76,-128+r*130,52);}
    ctx.fillStyle='#1b2236';rr(170,-160,170,300,14);ctx.fill();ctx.fillStyle='#6FD3FF';rr(190,-140,130,100,8);ctx.fill();text('결제',255,-90,{s:32,w:900,c:'#0b1020'});
    ctx.fillStyle='#39405a';rr(205,0,100,30,6);ctx.fill();
    emoji('📷',300,-215,56);
    if(o.ghost){ctx.save();ctx.globalAlpha*=o.ghost;emoji('🏃',-60,190,170);ctx.restore();}
  });
}
/* 과자 봉지 */
function snackBag(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{ctx.fillStyle=o.col||'#ff9f43';ctx.beginPath();ctx.moveTo(-90,-130);ctx.lineTo(90,-130);ctx.lineTo(110,130);ctx.lineTo(-110,130);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.85)';rr(-70,-60,140,90,16);ctx.fill();text('과자',0,-15,{f:'D',s:44,c:'#d6301f'});ctx.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<9;i++)ctx.fillRect(-90+i*20,-140,10,14);
  if(o.price)text(o.price,0,90,{f:'D',s:40,c:'#fff',st:6});});}
/* CCTV 모니터 */
function cctvMon(x,y,s){group(x,y,s,0,1,()=>{ctx.fillStyle='#0b0f1d';rr(-300,-210,600,380,22);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=6;rr(-300,-210,600,380,22);ctx.stroke();
  [[-150,-105],[150,-105],[-150,70],[150,70]].forEach(([cx,cy],i)=>{ctx.fillStyle='#1d2a3a';rr(cx-135,cy-80,270,160,8);ctx.fill();ctx.save();ctx.globalAlpha*=.8;emoji(['🍬','🧃','✏️','🏃'][i],cx,cy,70);ctx.restore();
    text('CAM '+(i+1),cx-120,cy-62,{a:'left',s:20,w:900,c:'#9ff0c4'});});
  ctx.fillStyle=`rgba(255,77,77,${.5+.5*Math.sin(R*8)})`;ctx.beginPath();ctx.arc(270,-185,12,0,7);ctx.fill();
  ctx.fillStyle='#2a3046';ctx.fillRect(-30,170,60,60);rr(-120,225,240,22,10);ctx.fill();});}
"""
EP13_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 무인 문구점 월 매출 1,000만 원 → 돈을 안 내는 손님 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b');
    text('교문 앞 무인 문구점 (월)',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    text('1,000만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
    drawStationery(540,820,E.back(P(a,0,.5))*1.05+.001,{ghost:b>=0?P(T-WT('h1b',7),0,.3):0});
    if(b>=0){group(540,470,1,0,P(b,0,.3),()=>{ctx.fillStyle='rgba(255,255,255,.92)';rr(-230,-38,460,76,38);ctx.fill();text('직원 0명 · 인건비 0원',0,2,{s:36,w:900,c:C.ink});});stampBox('돈을 안 내는 손님?',540,1265,T-WT('h1b',8),{s:70,rot:-.06});}
  }},
""" + cost_scene('과자·문구 매출 1,000만') + calc_op('1,000,000') + r"""
  /* ── 결과: 한 달 100만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('무인 문구점, 한 달 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '100만 원', y=420, s=180) + r"""    const q=T-WT('r1',4),k=P(q,.3,.8);coinStack(540,1130,10*k,'#9ff0c4');
    text('하루 약 3만 3천 원',540,1240,{f:'D',s:60,c:C.green,alpha:P(q,.5,.3)});
  }},

  /* ── 반전: 무인점포 절도 1만 1,015건 → 과자 하나 = 세 개 ── */
  theft:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('무인점포 절도 (경찰청)',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      const base=1100,k=E.out(P(T-WT('t1',4),0,.7));
      [[0,'2021년',3514,'#8e98ad'],[1,'2025년',11015,C.red]].forEach(([i,l,v,col])=>{const kk=i?k:P(a,.2,.4),h=600*v/11015*kk,x=330+i*420;
        ctx.fillStyle=col;rr(x-120,base-h,240,h,16);ctx.fill();text(won(Math.round(v*kk))+'건',x,base-h-50,{f:'D',s:64,c:col});text(l,x,base+50,{s:40,w:900});});
      stampBox('역대 최고',330,520,T-WT('t1',6),{s:76,rot:-.06});
      text('권칠승 의원실 · 경찰청 자료 (세계일보 2026.4.15)',540,1230,{s:24,w:700,c:C.dim});
    }else if(d<0){
      text('천 원짜리 과자 하나',540,250,{s:48,w:900});
      snackBag(300,620,1.2,{price:'1,000원'});
      const k=P(T-WT('t2',6),0,.3);if(k>0){emoji('🏃',300,860,130,{alpha:k});text('원가 −750원',300,1000,{f:'D',s:56,c:C.red,alpha:k});}
      text('=',540,640,{f:'D',s:120,alpha:P(c,0,.3)});
      if(c>=0)for(let i=0;i<3;i++){const kk=E.back(P(T-WT('t3',4),i*.15,.35));if(kk>0)snackBag(700+(i%2)*150,470+i*170,.62*kk,{col:'#35E08A'});}
      if(c>=0)text('하나 팔면 이익 250원',780,1040,{s:34,w:900,c:C.green,alpha:P(c,.3,.3)});
      stampBox('3개 더 팔아야',540,1250,T-WT('t3',5),{s:76,rot:-.05});
    }else{
      text('하루 10개만 사라져도 (한 달)',540,250,{s:46,w:900});
      text('300개 × 원가 750원 =',540,360,{f:'D',s:56,alpha:P(d,0,.3)});
      group(540,470,1,0,P(T-WT('t4',6),0,.2),()=>text('22만 원',0,0,{f:'D',s:120,c:C.red,glow:'rgba(255,77,77,.5)'}));
      const k=E.out(P(T-WT('t4',7),0,.6)),base=1180;
      vCash2(240,base-500,260,500);text('100만',370,base-540,{f:'D',s:56,c:C.green});text('원래',370,base+50,{s:36,w:900,c:C.dim});
      const h2=500*(1-.22*k);vCash2(620,base-h2,260,h2);ctx.fillStyle='rgba(255,77,77,.6)';ctx.fillRect(620,base-500,260,500-h2);
      text((100-Math.round(22*k))+'만',750,base-540,{f:'D',s:56,c:'#FF9F43'});text('도난 뒤',750,base+50,{s:36,w:900,c:C.dim});
      stampBox('남는 돈의 4분의 1',540,1310,T-WT('t4',8),{s:62,rot:-.05});
    }
  }},

  /* ── 마무리: CCTV로 지키는 가게 ── */
  end:{draw(){
    const a=L('e1');
    cctvMon(540,700,E.back(P(a,0,.45))*1.05+.001);
    emoji('🧑‍💼',860,1010,140,{alpha:P(a,.3,.3)});
    stampBox('CCTV로 지키는 가게',540,1250,T-WT('e2',0),{s:72,rot:-.06});
  }},
};
"""
EP13_COVER = cover2('EP.13', '무인 문구점', 150, '과자 1개 도난', '원가 750원', '메우려면', '3개 더 팔아야',
                    "drawStationery(540,560,.42);", 'rgba(255,122,168,.22)')
build(SH + 'stationery.html', '비밀의 계산기 무인 문구점 편', 'EP.13 무인 문구점', 'stationery', 'stationery', 'EP13', 'EP.13',
      EP13_CUES, EP13_CONSTS, EP13_HELPERS,
      "const SEQ=['1','0','00','00','00','−','9','00','00','00','='];   // 10,000,000 − 9,000,000",
      KEYS_EXTRA, EP13_SCENES, EP13_COVER, 'theft')
apply_ref(SH + 'stationery.html', ['직원 없는 무인 문구점','과자 하나 훔치면 얼마 손해?'], '월 매출 1,000만·매입 75% 가정 예시 · 세금 제외')

# ═══════════════════════════════ EP.14 동네 빵집 ═══════════════════════════════
EP14_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'동네 빵집 알바 시급, [1만 320원].',sfx:[[0,'whoosh'],['w4','impact']],shake:[['w4',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 진짜 시급은 [따로] 있죠.',sfx:[['w3','buzz']]},
  {id:'h2',sc:'hook',   text:'이 빵집 월 매출은 [1,500만 원].',pause:250,sfx:[[0,'rise'],['w4','stamp']]},
  {id:'k1',sc:'cost',   text:'빵 재료비 {500만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {180만 원}.'},
  {id:'k3',sc:'cost',   text:'오븐 연료비 {70만 원}.'},
  {id:'k4',sc:'cost',   text:'카드 수수료와 포장재 {50만 원}.'},
  {id:'k5',sc:'cost',   text:'알바 하루 8시간, 시급대로 {248만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'사장님 계산으로는 얼마 남을까요? <452만 원>.',pause:300,sfx:[[0,'whoosh'],['w4','coin']]},
  {id:'t1',sc:'wage',   text:'그런데 주 15시간 이상 일하면 [주휴수당], 하루치 시급이 더 붙죠.',sfx:[[0,'scratch'],[.02,'impact'],['w5','stamp']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'wage',   text:'진짜 시급은 [1만 2,384원]. 인건비는 {297만 원}.',sfx:[['w2','pop'],['w5','buzz']]},
  {id:'t3',sc:'wage',   text:'남는 돈은 <403만 원>. 1년이면 {594만 원}, 계산에서 빠진 돈이죠.',pause:300,sfx:[['w5','buzz']],shake:[['w5',10,.3]]},
  {id:'e1',sc:'end',    text:'알바 시급은 1만 320원이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[1만 2천 원이 넘는 돈]이었던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 동네 빵집 월 비용 (단위: 만 원) — 알바는 주휴수당 빼고 계산한 '사장님 계산'
const COSTS=[
  {cue:'k1',ic:'🥐',lb:'재료비 (33%)',v:500},
  {cue:'k2',ic:'🏠',lb:'임대료',v:180},
  {cue:'k3',ic:'🔥',lb:'오븐 전기·가스',v:70},
  {cue:'k4',ic:'💳',lb:'카드·포장재',v:50},
  {cue:'k5',ic:'👤',lb:'알바 (시급×시간)',v:248},
];
"""
EP14_CONSTS = """// 매출 1,500만 원 vs 비용 1,048만 원 (단위: 만 원)
const REV=1500,SCL=900/1500,X0=90;
"""
EP14_HELPERS = COIN + r"""/* 빵 진열대 */
function drawBakery(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#3b2a1f';rr(-400,-280,800,560,22);ctx.fill();
    ctx.fillStyle='#f4d58d';rr(-400,-280,800,100,18);ctx.fill();text('BAKERY',0,-228,{f:'D',s:70,c:'#5a3a1a'});
    for(let r=0;r<2;r++){ctx.fillStyle='#e9d3b0';rr(-360,-130+r*190,720,26,8);ctx.fill();
      for(let j=0;j<5;j++)emoji(['🥐','🍞','🥖','🥯','🧁'][(r*2+j)%5],-280+j*140,-185+r*190,96);}
    ctx.fillStyle='#fff';rr(-120,150,240,90,16);ctx.fill();text('시급 10,320',0,197,{f:'D',s:40,c:'#5a3a1a'});
  });
}
/* 장부 */
function ledgerBook(x,y,s,lines,res,col){group(x,y,s,-.03,1,()=>{ctx.fillStyle='#f4f1e8';rr(-300,-360,600,720,18);ctx.fill();ctx.fillStyle='#d9534f';ctx.fillRect(-300,-360,600,70);text('사장님 계산',0,-322,{f:'D',s:48,c:'#fff'});
  lines.forEach(([l,v],i)=>{text(l,-260,-230+i*80,{a:'left',s:34,w:800,c:'#3a3f4d'});text(v,260,-230+i*80,{a:'right',f:'D',s:40,c:v.startsWith('−')?'#d62f2f':C.ink});});
  ctx.strokeStyle='#b9b19c';ctx.lineWidth=3;ctx.setLineDash([10,8]);line(-260,230,260,230);ctx.setLineDash([]);text('남는 돈',-260,290,{a:'left',s:40,w:900,c:C.ink});text(res,260,292,{a:'right',f:'D',s:64,c:col});});}
"""
EP14_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 알바 시급 1만 320원 → 진짜 시급은 따로 → 월 매출 1,500만 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b'),c=L('h2');
    if(c<0){
      text('동네 빵집 알바 시급',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
      text('10,320원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
      drawBakery(540,800,E.back(P(a,0,.5))*1.05+.001);
      if(b>=0)stampBox('진짜 시급은 따로?',540,1265,T-WT('h1b',3),{s:72,rot:-.06});
    }else{
      text('빵집 월 매출',540,236,{s:40,w:700,c:C.dim});
      text(won(15000000*E.out(P(T-WT('h2',4),0,.8)))+'원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)'});
      for(let i=0;i<30;i++){const k=E.back(P(c,.1+i*.025,.3));if(k<=0)continue;emoji(['🥐','🍞','🥖','🥯','🧁'][i%5],150+(i%6)*156,560+Math.floor(i/6)*150,100,{sc:k});}
    }
  }},
""" + cost_scene('빵 매출 1,500만', '#ffe2a8', '#d99a2b', "'#FFD27A'") + calc_op('4,520,000') + r"""
  /* ── 결과: 사장님 계산 452만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('사장님 계산으로는, 한 달',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 4, '452만 원', y=420, s=180) + r"""    ledgerBook(540,960,.85*E.back(P(a,.2,.4))+.001,[['재료비','−500만'],['임대료','−180만'],['전기·가스','−70만'],['카드·포장','−50만'],['알바 (시급×시간)','−248만']],T>=WT('r1',4)?'452만':'?',C.green);
  }},

  /* ── 반전: 주휴수당 → 진짜 시급 12,384원 → 1년 594만 원 ── */
  wage:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3');
""" + dark('a') + r"""    if(b<0){
      text('주 15시간 이상 일하면',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      const days=['월','화','수','목','금','토','일'];
      days.forEach((d,i)=>{const x=150+i*130,k=E.back(P(a,.2+i*.08,.3));if(k<=0)return;const off=i===6,pay=off&&T>=WT('t1',5);
        group(x,620,k,0,1,()=>{ctx.fillStyle=pay?'#FFC531':off?'rgba(255,255,255,.12)':'#B18CFF';rr(-55,-90,110,180,16);ctx.fill();text(d,0,-40,{f:'D',s:48,c:pay||!off?'#0b1020':'#fff'});text(off?(pay?'유급':'휴일'):'근무',0,35,{s:28,w:900,c:pay||!off?'#0b1020':'#fff'});});});
      stampBox('주휴수당',540,860,T-WT('t1',5),{s:84,rot:-.05});
      text('근로기준법 제55조 · 1주 15시간 이상 일한 근로자',540,1230,{s:26,w:700,c:C.dim});
    }else{
      text('알바 시급',540,250,{s:46,w:900});
      [[0,'계산한 시급',10320,'#8e98ad'],[1,'진짜 시급',12384,C.red]].forEach(([i,l,v,col])=>{const y=420+i*150,k=i?E.out(P(T-WT('t2',2),0,.6)):1;
        text(l,90,y-50,{a:'left',s:34,w:900,c:col});ctx.fillStyle=col;rr(90,y-20,760*v/12384*k,80,16);ctx.fill();text(won(Math.round(v*k))+'원',90+760*v/12384*k+20,y+20,{a:'left',f:'D',s:52,c:col});});
      text('+20%',940,560,{f:'D',s:56,c:C.red,alpha:P(T-WT('t2',2),.4,.3)});
      if(T>=WT('t2',5)){text('인건비 248만 → 297만',540,820,{f:'D',s:66,c:'#ffb3b3'});}
      if(c>=0){text('남는 돈 452만 → 403만',540,940,{f:'D',s:66,c:'#FF9F43',alpha:P(c,0,.3)});
        stampBox('1년 594만 원',540,1180,T-WT('t3',5),{s:84,rot:-.05});}
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawBakery(540,760,E.back(P(a,0,.45))*.95+.001);
    stampBox('진짜 시급 1만 2천 원+',540,1250,T-WT('e2',0),{s:72,rot:-.06});
  }},
};
"""
EP14_COVER = cover2('EP.14', '동네 빵집', 170, '알바 시급', '10,320원', '진짜 시급', '12,384원',
                    "drawBakery(540,580,.42);", 'rgba(244,213,141,.22)')
build(SH + 'bakery.html', '비밀의 계산기 동네 빵집 편', 'EP.14 동네 빵집', 'bakery', 'bakery', 'EP14', 'EP.14',
      EP14_CUES, EP14_CONSTS, EP14_HELPERS,
      "const SEQ=['1','5','00','00','00','−','1','0','4','8','0','00','0','='];   // 15,000,000 − 10,480,000",
      KEYS_EXTRA, EP14_SCENES, EP14_COVER, 'wage')
apply_ref(SH + 'bakery.html', ['알바 시급 1만 320원?','빵집 사장님 계산에서 빠진 돈'], '월 매출 1,500만·알바 하루 8시간 가정 예시 · 4대 보험·세금 제외')

# ═══════════════════════════════ EP.15 동네 호프집 ═══════════════════════════════
EP15_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'동네 호프집 권리금, 평균 [3,800만 원].',sfx:[[0,'whoosh'],['w4','impact']],shake:[['w4',12,.35]]},
  {id:'h1b',sc:'hook',  text:'그런데 이 돈, 나올 때 [돌려받을 수] 있을까요?',sfx:[['w5','buzz']]},
  {id:'h2',sc:'hook',   text:'월 매출은 [1,500만 원].',pause:250,sfx:[[0,'rise'],['w2','stamp']]},
  {id:'k1',sc:'cost',   text:'술과 안주 재료비 {500만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'임대료 {220만 원}.'},
  {id:'k3',sc:'cost',   text:'저녁 알바 두 명 {450만 원}.'},
  {id:'k4',sc:'cost',   text:'전기, 가스와 카드 수수료 {110만 원}.',pause:200},
  """ + SIG + r"""
  {id:'r1',sc:'result', text:'사장님 몫은 얼마일까요? <220만 원>.',pause:300,sfx:[[0,'whoosh'],['w3','coin']]},
  {id:'t1',sc:'exit',   text:'그런데 손님이 줄어 가게를 내놓으면, 다음 사람이 권리금을 [안 낼 수도] 있죠.',sfx:[[0,'scratch'],[.02,'impact'],['w8','buzz']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'exit',   text:'그러면 들어올 때 낸 3,800만 원은 {0원}.',sfx:[['w6','stamp']],shake:[['w6',12,.35]]},
  {id:'t3',sc:'exit',   text:'[17개월] 동안 번 돈이 통째로 사라지는 셈이죠.',sfx:[['w0','buzz']]},
  {id:'t4',sc:'exit',   text:'법이 지켜 주는 건, 권리금을 받을 [기회] 하나뿐이죠.',pause:300,sfx:[['w6','pop']]},
  {id:'e1',sc:'end',    text:'권리금은 맡겨 둔 돈이 아니라,',sfx:[[0,'whoosh']]},
  {id:'e2',sc:'end',    text:'[다음 사람에게 팔아야] 돌아오는 돈이었던 거죠.',sfx:[['w0','stamp']],shake:[['w0',10,.3]]},
];
// 동네 호프집 월 비용 (단위: 만 원) — 예시
const COSTS=[
  {cue:'k1',ic:'🍺',lb:'술·안주 재료비',v:500},
  {cue:'k2',ic:'🏠',lb:'임대료',v:220},
  {cue:'k3',ic:'👥',lb:'저녁 알바 2명',v:450},
  {cue:'k4',ic:'⚡',lb:'전기·가스·카드',v:110},
];
"""
EP15_CONSTS = """// 매출 1,500만 원 vs 비용 1,280만 원 (단위: 만 원)
const REV=1500,SCL=900/1500,X0=90;
"""
EP15_HELPERS = COIN + r"""/* 호프집: 맥주잔 + 간판 */
function drawPub(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#2a1d14';rr(-400,-300,800,600,22);ctx.fill();
    ctx.save();ctx.shadowColor='rgba(255,170,60,.8)';ctx.shadowBlur=40;ctx.fillStyle='#ffb347';rr(-260,-270,520,100,50);ctx.fill();ctx.restore();text('호프',0,-218,{f:'D',s:72,c:'#2a1d14'});
    if(o.lease){ctx.fillStyle='#f4f1e8';rr(-200,-120,400,320,10);ctx.fill();text('임 대',0,-20,{f:'D',s:120,c:'#d61f1f'});text('문의',0,110,{s:46,w:900,c:'#333'});}
    else{[[-200,40],[0,20],[200,40]].forEach(([mx,my],i)=>{group(mx,my,1,0,1,()=>{ctx.fillStyle='rgba(255,255,255,.25)';rr(-70,-110,140,220,18);ctx.fill();ctx.fillStyle='#f2a900';rr(-60,-70,120,170,12);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(0,-75,70,26,0,0,7);ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=10;ctx.beginPath();ctx.arc(80,0,40,-1.2,1.2);ctx.stroke();});});emoji('🍗',0,220,90);}
  });
}
"""
EP15_SCENES = CASHBAR + r"""
const SCENES={
  /* ── 훅: 권리금 평균 3,800만 원 → 돌려받을 수 있나 → 월 매출 1,500만 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h1b'),c=L('h2');
    if(c<0){
      text('음식점 평균 권리금',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
      text('3,800만 원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.15)});
      drawPub(540,800,E.back(P(a,0,.5))*1.05+.001);
      text('한국부동산원 · 숙박음식점업 3,818만 원 (2024.6)',540,1150,{s:26,w:700,c:C.dim,alpha:P(a,.5,.3)});
      if(b>=0)stampBox('나올 때 돌려받을까?',540,1265,T-WT('h1b',5),{s:70,rot:-.06});
    }else{
      text('호프집 월 매출',540,236,{s:40,w:700,c:C.dim});
      text(won(15000000*E.out(P(T-WT('h2',2),0,.8)))+'원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)'});
      drawPub(540,800,1.05);
    }
  }},
""" + cost_scene('호프 매출 1,500만', '#ffd37a', '#d98a00', "'#FFD27A'") + calc_op('2,200,000') + r"""
  /* ── 결과: 사장님 몫 220만 원 ── */
  result:{draw(){
    const a=L('r1');
    text('호프집 사장님, 한 달',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
""" + amount_pop('r1', 3, '220만 원', y=420, s=180) + r"""    const q=T-WT('r1',3),k=P(q,.3,.8);coinStack(540,1130,11*k,'#9ff0c4');
    text('권리금 3,800만 = 이 돈의 17달 치',540,1240,{f:'D',s:52,c:C.gold,alpha:P(q,.6,.3)});
  }},

  /* ── 반전: 나갈 때 권리금 0원 → 17개월 → 법은 '기회'만 ── */
  exit:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3'),d=L('t4');
""" + dark('a') + r"""    if(b<0){
      text('손님이 줄어 가게를 내놓으면',540,250,{s:46,w:900,alpha:P(a,0,.3)});
      drawPub(540,760,E.back(P(a,.2,.4))*1.0+.001,{lease:true});
      stampBox('다음 사람이 권리금을 안 낸다면?',540,1250,T-WT('t1',8),{s:56,rot:-.05});
    }else if(c<0){
      text('들어올 때 낸 권리금',540,250,{s:46,w:900});
      const k=E.out(P(T-WT('t2',6),0,.8)),base=1150,h=640*(1-k);
      ctx.fillStyle='rgba(255,255,255,.06)';rr(340,base-640,400,640,20);ctx.fill();
      vCash2(340,base-h,400,h,'#ffe08a','#d99a2b');
      text(won(Math.round(3800*(1-k)))+'만 원',540,base-Math.max(h,0)-50,{f:'D',s:80,c:k>.9?C.red:C.gold});
      if(k>.9)stampBox('0원',540,700,T-WT('t2',6)-.8,{s:150,rot:-.06});
    }else if(d<0){
      text('사장님이 번 돈으로 치면',540,250,{s:46,w:900});
      for(let i=0;i<17;i++){const x=150+(i%6)*156,y=440+Math.floor(i/6)*190,k=E.back(P(c,.1+i*.05,.25));if(k<=0)continue;
        group(x,y,k,0,1,()=>{ctx.fillStyle='rgba(255,255,255,.1)';rr(-60,-70,120,140,14);ctx.fill();text((i+1)+'월',0,-20,{f:'D',s:36,c:'#fff'});text('220만',0,30,{s:24,w:900,c:C.green});
          const x2=P(c,1.2+i*.04,.2);if(x2>0){ctx.strokeStyle=`rgba(255,77,77,${x2})`;ctx.lineWidth=10;line(-50,-60,50,60);line(50,-60,-50,60);}});}
      stampBox('17개월이 0원',540,1250,T-WT('t3',0)+1.5,{s:76,rot:-.05});
    }else{
      text('법이 지켜 주는 것',540,250,{s:46,w:900});
      group(540,640,1,0,P(d,0,.3),()=>{ctx.fillStyle='#f4f1e8';rr(-420,-230,840,460,20);ctx.fill();text('상가건물 임대차보호법',0,-160,{s:36,w:900,c:'#59627c'});
        text('권리금 회수 기회 보호',0,-70,{f:'D',s:60,c:C.ink});text('건물주가 새 세입자와의 거래를',0,30,{s:34,w:800,c:'#3a3f4d'});text('방해하지 못하게 할 뿐',0,85,{s:34,w:800,c:'#3a3f4d'});text('금액은 보장하지 않는다',0,170,{f:'D',s:46,c:'#d62f2f'});});
      stampBox('기회뿐',540,1180,T-WT('t4',6),{s:96,rot:-.06});
    }
  }},

  /* ── 마무리 ── */
  end:{draw(){
    const a=L('e1');
    drawPub(540,740,E.back(P(a,0,.45))*.95+.001);
    stampBox('팔아야 돌아오는 돈',540,1250,T-WT('e2',0),{s:76,rot:-.06});
  }},
};
"""
EP15_COVER = cover2('EP.15', '동네 호프집', 160, '들어갈 때 권리금', '3,800만 원', '나올 때', '0원(?)',
                    "drawPub(540,580,.42);", 'rgba(255,179,71,.22)')
build(SH + 'pub.html', '비밀의 계산기 동네 호프집 편', 'EP.15 동네 호프집', 'pub', 'pub', 'EP15', 'EP.15',
      EP15_CUES, EP15_CONSTS, EP15_HELPERS,
      "const SEQ=['1','5','00','00','00','−','1','2','8','00','00','0','='];   // 15,000,000 − 12,800,000",
      KEYS_EXTRA, EP15_SCENES, EP15_COVER, 'exit')
apply_ref(SH + 'pub.html', ['호프집 권리금 3,800만 원','나올 때 돌려받을 수 있을까?'], '권리금 한국부동산원 숙박음식점업 평균(2024.6) · 운영비 예시 · 세금 제외')
