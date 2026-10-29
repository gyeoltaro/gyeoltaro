# EP.04 헬스장 · EP.05 무인 아이스크림 · EP.06 탕후루 — EP.01 엔진(muin-cafe.html) 바탕
import re
SRC = '/home/user/gyeoltaro/shorts/muin-cafe.html'
BASE = open(SRC, encoding='utf-8').read()

SIG = "{id:'c1',sc:'calc',  sig:true,text:'[계산기를 두드려보면] 머리가 {띵해지는} 순간이죠.',pause:600,sfx:[[0,'whoosh'],['w3','ding'],['w3','impact']],shake:[['w3',30,.9]],flash:[['w3',.6]]},"

def calc_scene(result, typing=80, small=30, done=112):
    return r"""
  /* ── 시그니처: 계산기 ── */
  calc:{draw(){
    const a=L('c1'),ding=WT('c1',3),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const n=PLAN.keys.filter(k=>k.t<=T).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('−');
    const done=typed.endsWith('=');
    const fmt=s=>s?Number(s.replace('=','')).toLocaleString('ko-KR'):'';
    let small='',big='0';
    if(done){small=`${fmt(n1)} − ${fmt(n2)} =`;big='RESULT';}
    else if(n2!==undefined){small=`${fmt(n1)} −`;big=n2?fmt(n2):fmt(n1);}
    else if(n1)big=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){
      const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;
      ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(540,840,120+q*720,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    group(540,840,lerp(.82,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=50;ctx.shadowOffsetY=20;
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();
      ctx.shadowColor='transparent';ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:SMALL,w:700,c:'#4a5a44'});
      text(big,225,-310,{a:'right',s:done?DONESZ:TYPING,f:'D',c:done?'#d62f2f':'#1f2b1c'});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{
        const x=-250+ci*130,y=-200+ri*130;
        const pressed=PLAN.keys.some(q=>q.k===k&&T>=q.t&&T<q.t+.07);
        const isEq=k==='=',isOp=ci===3;
        ctx.fillStyle=isEq?(pressed?'#ff8a8a':'#ff4d4d'):isOp?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');
        rr(x,y+(pressed?6:0),110,110,26);ctx.fill();
        if(!pressed){ctx.fillStyle='rgba(0,0,0,.35)';rr(x,y+100,110,10,5);ctx.fill();}
        text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});
      }));
    });
    if(dt>=0){
      const ap=P(dt,0,.2);
      for(let i=0;i<6;i++){const ang=R*4+i*Math.PI/3;text('★',540+Math.cos(ang)*230,290+Math.sin(ang)*48,{s:60,c:i%2?C.gold:'#fff',alpha:ap*(.6+.4*Math.sin(ang))});}
      group(880,250,E.back(P(dt,0,.3)),.18,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    }
  }},
""".replace('RESULT', result).replace('TYPING', str(typing)).replace('SMALL', str(small)).replace('DONESZ', str(done))

def end_card(ep, disclaimer):
    return r"""
    if(z>=0){
      const k=E.out(P(z,0,.5));
      calcLogo(540,540,1.3*k+.001);
      text('비밀의 계산기',540,760,{f:'D',s:120,c:C.gold,glow:'rgba(255,197,49,.5)',alpha:k});
      text('EPNAME',540,870,{s:46,w:900,alpha:k});
      group(540,1010,1+.03*Math.sin(R*6),0,P(z,.3,.3),()=>{ctx.fillStyle='#ff2b2b';rr(-260,-56,520,112,56);ctx.fill();text('구독하고 다음 계산 보기',0,3,{s:40,w:900});});
      text('DISC',540,1230,{s:22,w:600,c:C.dim,alpha:P(z,.5,.4)});
    }""".replace('EPNAME', ep).replace('DISC', disclaimer)

def cover(ep, title, ts, band, bw, bs, bottom, bots, prop, glow='rgba(255,197,49,.20)'):
    return r"""/* 썸네일 커버 — 영상 맨 앞 0.3초 + 시작 화면 + 썸네일 PNG */
function drawCover(){
  drawBG();
  const g=ctx.createRadialGradient(540,960,40,540,960,820);g.addColorStop(0,'@GLOW@');g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(0,0,0,.35)';rr(60,70,420,84,42);ctx.fill();
  ctx.strokeStyle=C.gold;ctx.lineWidth=3;rr(60,70,420,84,42);ctx.stroke();
  calcLogo(112,112,.32);text('비밀의 계산기',292,113,{s:40,w:900,c:C.gold});
  text('@EPNUM@',1020,113,{a:'right',s:40,w:700,c:'rgba(255,255,255,.75)'});
  group(540,350,1,-.04,1,()=>text('@TITLE@',0,0,{f:'D',s:@TS@,c:'#fff',st:24,sc:'#0a1228'}));
  group(540,560,1,-.04,1,()=>{ctx.fillStyle=C.gold;rr(-@BW@/2,-76,@BW@,152,26);ctx.fill();text('@BAND@',0,8,{f:'D',s:@BS@,c:C.ink});});
  group(700,990,.8,.08,1,()=>{
    ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=60;ctx.shadowOffsetY=24;
    ctx.fillStyle='#1d2230';rr(-240,-320,480,640,60);ctx.fill();ctx.shadowColor='transparent';
    ctx.strokeStyle=C.gold;ctx.lineWidth=14;rr(-240,-320,480,640,60);ctx.stroke();
    ctx.fillStyle='#c9e6bf';rr(-195,-270,390,170,26);ctx.fill();
    text('???',170,-182,{a:'right',f:'D',s:150,c:'#d62f2f'});
    [['7','8','9'],['4','5','6'],['1','2','=']].forEach((row,r)=>row.forEach((k,c)=>{const x=-195+c*136,y=-65+r*120;ctx.fillStyle=k==='='?C.gold:'#343d58';rr(x,y,118,100,22);ctx.fill();
      text(k,x+59,y+52,{s:52,w:900,c:k==='='?C.ink:'#c9d4f0'});}));
  });
  @PROP@
  group(540,1430,1,-.02,1,()=>{ctx.fillStyle='#E53935';rr(-450,-88,900,176,32);ctx.fill();text('@BOTTOM@',0,8,{f:'D',s:@BOTS@,c:'#fff'});});
  vignette();
}
""".replace('@GLOW@', glow).replace('@EPNUM@', ep).replace('@TITLE@', title).replace('@TS@', str(ts)).replace('@BAND@', band).replace('@BW@', str(bw)) \
   .replace('@BS@', str(bs)).replace('@BOTTOM@', bottom).replace('@BOTS@', str(bots)).replace('@PROP@', prop)

def build(dst, title_tag, ep_long, slug, slug_us, ep_code, ep_num, cues_costs, consts, helpers, seq, extra, scenes, cov, dark, amount_re=None):
    s = BASE
    def between(text, start, end, new):
        assert text.count(start) == 1, start
        i = text.index(start); j = text.index(end, i)
        return text[:i] + new + text[j:]
    s = re.sub(r'(<script type="application/json" id="bundledTTS">).*?(</script>)', r'\1\2', s, count=1, flags=re.S)
    s = between(s, 'const CUES=[', 'const IDX=Object.fromEntries', cues_costs)
    s = between(s, '// 그리드: 1칸 = 5만 원', '\n/* ═', consts)
    i0 = s.index('function drawCup(x,y,s,o={}){'); i1 = s.rindex('/*', 0, s.index('   3. 타임라인'))
    s = s[:i0] + helpers + s[i1:]
    s = s.replace("const SEQ=['6','00','00','00','−','5','8','00','00','0','='];", seq)
    s = between(s, '  const ci=IDX.c1,cs=TL.cue[ci]', "  ev.sort((a,b)=>a.t-b.t);", extra + "\n")
    s = between(s, 'function drawCafe(){', 'function drawBG(){', scenes)
    s = between(s, '/* 썸네일 커버', '/* 캔버스 자막', cov)
    s = s.replace("PLAN.scenes[sceneIndexAt(tl)].id==='bank'", f"PLAN.scenes[sceneIndexAt(tl)].id==='{dark}'")
    if amount_re:
        a = "CUES[i].words.findIndex(w=>/\\d만$/.test(w.t))"
        assert s.count(a) == 1
        s = s.replace(a, f"CUES[i].words.findIndex(w=>{amount_re}.test(w.t))")
    for x, y in [('<title>비밀의 계산기 무인 카페 편</title>', f'<title>{title_tag}</title>'),
                 ('EP.01 무인 카페', ep_long), ('muin-cafe', slug), ('muin_cafe', slug_us),
                 ('EP01', ep_code), ('EP.01', ep_num)]:
        s = s.replace(x, y)
    for bad in ['무인 카페', 'muin', 'drawCup', 'drawMachine', 'OWNER', "'bank'"]:
        assert bad not in s, (dst, bad)
    open(dst, 'w', encoding='utf-8').write(s)
    print('written', dst, len(s))

KEYS_EXTRA = r"""  const ci=IDX.c1,cs=TL.cue[ci],kd=clamp((TL.word[ci][2]-.05-cs-.1)/SEQ.length,.04,.09);
  const keys=SEQ.map((k,j)=>({k,t:cs+.1+j*kd}));keys.forEach(k=>ev.push({t:k.t,n:'click'}));
"""

# ═══════════════════════════════ EP.04 동네 헬스장 ═══════════════════════════════
EP4_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',  text:'회원 [500명], 동네 [헬스장].',sfx:[[0,'whoosh'],[.1,'roll']]},
  {id:'h2',sc:'hook',  text:'월 회비 평균 3만 5천 원이면, 매출 [1,750만 원].',pause:250,sfx:[[0,'pop'],['w7','stamp']],shake:[['w7',8,.3]]},
  {id:'k1',sc:'cost',  text:'임대료 {700만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',  text:'트레이너와 데스크 인건비 {500만 원}.'},
  {id:'k3',sc:'cost',  text:'냉난방과 샤워실 전기세 {180만 원}.'},
  {id:'k4',sc:'cost',  text:'운동기구 1억 2천, 5년으로 나누면 {월 200만 원}.'},
  {id:'k5',sc:'cost',  text:'수건과 청소, 광고비 {130만 원}.',pause:400},
  """ + SIG + r"""
  {id:'r1',sc:'result',text:'남는 돈은 한 달 <40만 원>.',sfx:[[0,'whoosh'],[.15,'coin']]},
  {id:'r2',sc:'result',text:'회원 500명 중, 사장님 몫은 [11명]분.',pause:450,sfx:[['w5','pop']]},
  {id:'t1',sc:'twist', text:'그런데 이 계산엔 비밀이 하나 있습니다.',sfx:[[0,'scratch'],[.02,'impact']],shake:[[.02,18,.5]],flash:[[0,.45]]},
  {id:'t2',sc:'twist', text:'회원 500명이 매일 다 오면, 이 헬스장은 터지죠.',sfx:[[0,'rumble'],['w7','impact']],shake:[['w7',22,.6]]},
  {id:'t3',sc:'twist', text:'해외 조사에선, 신규 회원 절반이 [6개월] 안에 발길을 끊습니다.',pause:400,sfx:[[0,'whoosh'],['w5','stamp']]},
  {id:'e1',sc:'end',   text:'헬스장의 진짜 VIP는, [돈만 내고 안 오는] 회원이었습니다.',sfx:[[0,'whoosh'],['w3','stamp'],['w3','kaching']],shake:[['w3',10,.3]]},
];
// 월 비용 (단위: 만 원) — 수도권 80평 동네 헬스장, 회원권 매출만 (PT 제외)
const COSTS=[
  {cue:'k1',ic:'🏢',lb:'임대료·관리비',v:700},
  {cue:'k2',ic:'👥',lb:'트레이너·데스크',v:500},
  {cue:'k3',ic:'⚡',lb:'냉난방·전기',v:180},
  {cue:'k4',ic:'🏋️',lb:'운동기구 (5년)',v:200},
  {cue:'k5',ic:'🧺',lb:'수건·청소·광고',v:130},
];
"""
EP4_CONSTS = """// 회원 1명 = 월 3.5만 원. 비용을 회원 수로 환산해 뒤쪽 회원부터 지움
const MEM=500,FEE=3.5,TOTAL=1750;
(()=>{let top=TOTAL;COSTS.forEach(c=>{c.hi=top;c.lo=top-c.v;top=c.lo;});})();
"""
EP4_HELPERS = r"""function drawDumbbell(x,y,s,rot){
  group(x,y,s,rot,1,()=>{
    const g=ctx.createLinearGradient(0,-14,0,14);g.addColorStop(0,'#e3eaf8');g.addColorStop(1,'#7a86a8');
    ctx.fillStyle=g;rr(-175,-14,350,28,12);ctx.fill();
    [-1,1].forEach(d=>{
      ctx.fillStyle='#2a3350';rr(d>0?105:-145,-95,40,190,14);ctx.fill();
      ctx.strokeStyle=C.gold;ctx.lineWidth=4;rr(d>0?105:-145,-95,40,190,14);ctx.stroke();
      ctx.fillStyle='#3a4568';rr(d>0?149:-177,-68,28,136,10);ctx.fill();
    });
  });
}
"""
EP4_SCENES = r"""const DX0=120,DY0=500,DS=35;
const dotXY=i=>[DX0+(i%25)*DS,DY0+Math.floor(i/25)*DS];
/* 회원 500명 점: n명까지 불이 켜짐, tint = 곧 빠질 회원 구간 */
function memberDots(n,o={}){
  for(let i=0;i<MEM;i++){
    const [x,y]=dotXY(i),k=o.appear!=null?clamp((o.appear-i*.003)/.2):1;if(k<=0)continue;
    let col=i<n?(i%7===0?C.gold:C.cyan):'rgba(255,255,255,.08)';
    if(o.tint&&i>=o.tint[0]&&i<o.tint[1])col=o.tintCol;
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,12*k,0,7);ctx.fill();
  }
}

const SCENES={
  /* ── 훅: 회원 500명 → 월 매출 1,750만 원 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h2');
    if(b<0){
      text('등록 회원',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
      text(Math.round(500*E.out(P(a,.1,1.0)))+'명',540,334,{f:'D',s:136,c:C.cyan,glow:'rgba(111,211,255,.45)',alpha:P(a,0,.15)});
    }else{
      const pulse=T>=WT('h2',7)?Math.max(0,Math.sin(P(T-WT('h2',7),0,.3)*Math.PI)):0;
      text('월 매출',540,236,{s:40,w:700,c:C.dim});
      group(540,334,1+pulse*.06,0,1,()=>text(won(17500000*E.out(P(b,.1,1.2)))+'원',0,0,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)'}));
      text('회원 500명 × 평균 3만 5천 원',540,425,{s:36,w:800,c:C.dim,alpha:P(b,.2,.3)});
    }
    memberDots(MEM,{appear:a*1.4});
    text('● 1개 = 회원 1명',960,1200,{a:'right',s:28,w:700,c:C.dim,alpha:P(a,.6,.3)});
  }},

  /* ── 비용 차감: 비용을 회원 수로 환산해 지움 ── */
  cost:{draw(){
    const a=L('k1');
    let m=TOTAL;COSTS.forEach(c=>{m-=c.v*E.out(P(T-c.tr,0,.6));});
    const col=m>900?C.gold:m>300?'#FF9F43':C.red;
    text('이번 달 남은 돈',540,232,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    let bump=0;COSTS.forEach(c=>{const d=T-c.tr;if(d>=0&&d<.3)bump=Math.max(bump,Math.sin(d/.3*Math.PI));});
    group(540,330,1+bump*.06,0,1,()=>text(won(m*10000)+'원',0,0,{f:'D',s:128,c:col,glow:col===C.red?'rgba(255,77,77,.6)':null,gb:40}));
    text(`회원 ${Math.floor(m/FEE)}명분 남음`,540,425,{s:36,w:800,c:col});
    const act=COSTS.find(c=>T>=CT(c.cue)&&T<c.tr);
    memberDots(Math.floor(m/FEE),act?{tint:[Math.floor(act.lo/FEE),Math.ceil(act.hi/FEE)],tintCol:`rgba(255,77,77,${.6+.3*Math.sin(R*14)})`}:{});
    COSTS.forEach(c=>{const d=T-c.tr;if(d<0||d>1.1)return;const [x,y]=dotXY(Math.floor((c.lo+c.hi)/2/FEE));
      text(`−${c.v}만 = 회원 ${Math.round(c.v/FEE)}명분`,540,clamp(y,580,1100)-d*40,{f:'D',s:58,c:C.red,alpha:1-P(d,.7,.4),st:10});});
    COSTS.forEach((c,k)=>{
      const x=k%2?552:100,y=1200+Math.floor(k/2)*58,ap=P(T-c.tr,.15,.3);if(ap<=0)return;
      group((1-E.out(ap))*30,0,1,0,ap,()=>{
        ctx.fillStyle='rgba(255,255,255,.06)';rr(x,y,428,52,14);ctx.fill();
        emoji(c.ic,x+30,y+27,30);text(c.lb,x+58,y+27,{a:'left',s:26,w:800});
        text('−'+c.v+'만',x+412,y+28,{a:'right',s:34,f:'D',c:C.red});
      });
    });
  }},
""" + calc_scene('400,000') + r"""
  /* ── 결과: 월 40만 원 = 회원 11명분 ── */
  result:{draw(){
    const a=L('r1'),b=L('r2');
    text('한 달에 사장님이 가져가는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    group(540,380,lerp(1.6,1,E.out(P(a,.05,.3))),0,P(a,0,.15),()=>text('400,000원',0,0,{f:'D',s:140,c:C.green,glow:'rgba(53,224,138,.45)'}));
    text('하루 약 13,000원',540,495,{s:44,w:900,c:C.gold,alpha:P(a,.5,.3)});
    if(b>=0){
      for(let i=0;i<MEM;i++){const k=clamp((b*1.8-i*.002)/.2);if(k<=0)continue;
        const x=228+(i%25)*26,y=640+Math.floor(i/25)*26,own=i<11;
        ctx.fillStyle=own?C.gold:'rgba(255,255,255,.12)';if(own){ctx.shadowColor=C.gold;ctx.shadowBlur=16;}
        ctx.beginPath();ctx.arc(x,y,(own?11:8)*k,0,7);ctx.fill();ctx.shadowColor='transparent';}
      text('회원 500명 중 사장님 몫 11명',540,1210,{s:46,w:900,c:C.gold,alpha:P(T-WT('r2',5),0,.3)});
    }
  }},

  /* ── 반전: 다 오면 터지는 헬스장 → 절반은 6개월 안에 안 온다 ── */
  twist:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3');
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,W,H);
    const g=ctx.createRadialGradient(540,900,200,540,900,1200);g.addColorStop(0,'rgba(255,40,40,0)');g.addColorStop(1,`rgba(255,40,40,${.16+.06*Math.sin(R*5)})`);
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    if(a<.4)for(let i=0;i<8;i++){const s=Math.floor(R*40)+i*17;ctx.fillStyle=i%2?'rgba(111,211,255,.25)':'rgba(255,77,77,.28)';ctx.fillRect((rnd(s)-.5)*80,rnd(s+3)*H,W,10+rnd(s+5)*50);}
    if(c<0){
      const fx=150,fy=440,fw=780,fh=620,ap=P(a,0,.3);
      text('헬스장 평면도 · 동시 이용 약 80명',540,350,{s:40,w:800,c:C.dim,alpha:ap});
      ctx.save();ctx.globalAlpha*=ap;ctx.strokeStyle=C.line;ctx.lineWidth=5;ctx.strokeRect(fx,fy,fw,fh);
      for(let r=0;r<6;r++)for(let cc=0;cc<10;cc++){ctx.fillStyle='rgba(214,232,255,.18)';rr(fx+30+cc*74,fy+40+r*95,50,40,8);ctx.fill();}
      ctx.restore();
      if(b<0)text('?',540,fy+fh/2,{f:'D',s:300,c:C.gold,glow:'rgba(255,197,49,.8)',alpha:P(a,.3,.3)});
      if(b>=0){
        for(let i=0;i<MEM;i++){const t=b-i*.004;if(t<0)break;const f=E.out(P(t,0,.6));
          const inside=i<80,side=rnd(i+7),tx=inside?fx+30+rnd(i)*(fw-60):side<.6?60+rnd(i)*960:(side<.8?50+rnd(i)*80:950+rnd(i)*80),ty=inside?fy+30+rnd(i+999)*(fh-60):side<.6?1090+rnd(i+3)*250:fy+rnd(i+3)*fh;
          ctx.fillStyle=inside?C.cyan:C.red;ctx.beginPath();ctx.arc(lerp(540+(rnd(i+5)-.5)*500,tx,f),lerp(1450,ty,f),9,0,7);ctx.fill();}
        stampBox('터짐!',540,750,T-WT('t2',7),{s:130,rot:-.1});
      }
    }else{
      const ox=170,oy=1000,gw=760,gh=520,ap=P(c,0,.3);
      text('신규 회원 출석 비율',540,350,{s:44,w:900,alpha:ap});
      text('해외 조사 (Statista)',540,410,{s:30,w:700,c:C.dim,alpha:ap});
      ctx.save();ctx.globalAlpha*=ap;ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;line(ox,oy,ox+gw,oy);line(ox,oy,ox,oy-gh);ctx.restore();
      for(let mth=0;mth<=6;mth++)text(mth?mth+'개월':'가입',ox+mth*gw/6,oy+40,{s:28,w:700,c:C.dim,alpha:ap});
      text('100%',ox-20,oy-gh,{a:'right',s:28,w:700,c:C.dim,alpha:ap});text('50%',ox-20,oy-gh/2,{a:'right',s:28,w:700,c:C.dim,alpha:ap});
      const k=E.io(P(c,.2,1.2));ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=12;ctx.lineCap='round';ctx.beginPath();
      for(let i=0;i<=60*k;i++){const t=i/60,v=1-.5*(1-Math.pow(1-t,1.6));const x=ox+t*gw,y=oy-gh*v;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.restore();
      if(k>=1){ctx.fillStyle=C.red;ctx.beginPath();ctx.arc(ox+gw,oy-gh/2,18,0,7);ctx.fill();}
      stampBox('절반이 안 옴',720,620,T-WT('t3',5),{s:72,rot:-.08});
    }
  }},

  /* ── 마무리: VIP 회원 카드 + 엔딩 ── */
  end:{draw(){
    const a=L('e1'),z=T-(TL.voiceEnd+.3),fade=1-P(z,0,.4);
    if(fade>0)group(0,0,1,0,fade,()=>{
      group(540,720,E.back(P(a,0,.45))+.001,-.05,1,()=>{
        ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=50;ctx.shadowOffsetY=20;
        const g=ctx.createLinearGradient(-380,-240,380,240);g.addColorStop(0,'#FFE38A');g.addColorStop(.5,'#F5B800');g.addColorStop(1,'#C98A00');
        ctx.fillStyle=g;rr(-380,-240,760,480,40);ctx.fill();ctx.shadowColor='transparent';
        ctx.fillStyle='rgba(255,255,255,.25)';ctx.beginPath();ctx.moveTo(-380,-60);ctx.lineTo(-120,-240);ctx.lineTo(40,-240);ctx.lineTo(-380,60);ctx.closePath();ctx.fill();
        text('VIP 연회원',-330,-160,{a:'left',f:'D',s:76,c:'#3a2a00'});
        text('결제 완료 ✔',-330,-60,{a:'left',s:44,w:900,c:'#3a2a00'});
        text('출석 0회',-330,60,{a:'left',f:'D',s:110,c:'#C62828'});
        text('HEALTH CLUB · 2026',-330,180,{a:'left',s:28,w:800,c:'#5b4a00'});
        ctx.fillStyle='#d9b45a';rr(200,-150,110,80,14);ctx.fill();
      });
      drawDumbbell(540,1060,.75,-.08);
      stampBox('최고의 고객',540,1250,T-WT('e1',3),{s:84,c:C.gold,rot:-.06,bg:'rgba(40,30,0,.75)'});
    });""" + end_card('EP.04 동네 헬스장', '※ 수도권 80평 헬스장 가정 예시 · PT 매출 제외 · 출석률은 해외 조사(Statista) · 세금 제외') + r"""
  }},
};

"""
EP4_COVER = cover('EP.04', '헬스장', 250, '회원 500명', 600, 112, '사장님 몫은 몇 명?', 104,
                  "drawDumbbell(300,1150,.95,-.35);", 'rgba(111,211,255,.20)')
build('/home/user/gyeoltaro/shorts/gym.html', '비밀의 계산기 헬스장 편', 'EP.04 동네 헬스장', 'gym', 'gym', 'EP04', 'EP.04',
      EP4_CUES, EP4_CONSTS, EP4_HELPERS,
      "const SEQ=['1','7','5','00','00','0','−','1','7','1','00','00','0','='];   // 17,500,000 − 17,100,000",
      KEYS_EXTRA + "  ev.push({t:TL.voiceEnd+.35,n:'win'});", EP4_SCENES, EP4_COVER, 'twist')

# ═══════════════════════════════ EP.05 무인 아이스크림 할인점 ═══════════════════════════════
EP5_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',  text:'편의점보다 반값, [무인 아이스크림] 할인점.',sfx:[[0,'whoosh'],['w2','impact']],shake:[['w2',12,.35]]},
  {id:'h2',sc:'hook',  text:'아이스크림 하나 [1,000원]을 팔면,',pause:200,sfx:[[0,'pop'],['w2','stamp']]},
  {id:'k1',sc:'cost',  text:'제조사에서 떼 오는 값 {700원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',  text:'월세 150만 원을 나누면 {125원}.'},
  {id:'k3',sc:'cost',  text:'24시간 도는 냉동고 전기세 {58원}.'},
  {id:'k4',sc:'cost',  text:'도난과 카드 수수료 {34원}.',pause:400},
  """ + SIG + r"""
  {id:'r1',sc:'result',text:'하나 팔면 남는 돈 <83원>.',sfx:[[0,'whoosh'],[.15,'coin']]},
  {id:'r2',sc:'result',text:'한 달 1만 2천 개를 팔아야 <100만 원>.',pause:450},
  {id:'t1',sc:'season',text:'그런데 이건 [1년 평균]입니다.',sfx:[[0,'scratch'],[.02,'impact']],shake:[[.02,16,.45]],flash:[[0,.4]]},
  {id:'t2',sc:'season',text:'여름엔 매출이 두 배라 <460만 원>을 벌지만,',sfx:[[0,'rise'],['w4','kaching']]},
  {id:'t3',sc:'season',text:'겨울엔 반토막, 냉동고는 그대로 돌아서 {80만 원} 적자.',pause:400,sfx:[['w5','buzz'],['w5','stamp']],shake:[['w5',14,.4]]},
  {id:'e1',sc:'end',   text:'무인 아이스크림은 [여름 석 달 벌어], 겨울을 버티는 장사였습니다.',sfx:[[0,'whoosh'],['w2','stamp']],shake:[['w2',10,.3]]},
];
// 아이스크림 1개(1,000원)당 비용 (단위: 원) — 월평균 매출 1,200만 원 = 1만 2천 개 가정
const COSTS=[
  {cue:'k1',ic:'🏭',lb:'납품가 (원가 70%)',v:700},
  {cue:'k2',ic:'🏠',lb:'월세 (1개당)',v:125},
  {cue:'k3',ic:'❄️',lb:'냉동고 전기세',v:58},
  {cue:'k4',ic:'🚨',lb:'도난·카드 수수료',v:34},
];
"""
EP5_CONSTS = """// 1개 1,000원에서 비용을 위에서부터 베어 먹음 (lo~hi = 그 비용 구간)
const PRICE=1000;
(()=>{let top=PRICE;COSTS.forEach(c=>{c.hi=top;c.lo=top-c.v;top=c.lo;});})();
const MONTHS=[-80,-80,-20,40,100,280,460,460,130,10,-50,-50];   // 월별 순이익(만 원), 평균 +100
"""
EP5_HELPERS = r"""const PX=290,PW=340,PTOP=470,PH=740;
/* 아이스크림 바: val(원)만큼 아래부터 남고, 위는 베어 먹은 자국 */
function drawPop(val,x=PX,y=PTOP,w=PW,h=PH,o={}){
  ctx.save();
  ctx.fillStyle='#E8C99A';rr(x+w/2-34,y+h-30,68,190,30);ctx.fill();
  const hh=h*val/PRICE,top=y+h-hh;
  if(hh>1){
    ctx.beginPath();ctx.moveTo(x,y+h);
    if(val>=PRICE){ctx.lineTo(x,top+w/2);ctx.arc(x+w/2,top+w/2,w/2,Math.PI,0);}
    else{ctx.lineTo(x,top);const n=3,bw=w/n;for(let i=0;i<n;i++)ctx.arc(x+bw*i+bw/2,top,bw/2,Math.PI,0,true);}
    ctx.lineTo(x+w,y+h);ctx.closePath();
    const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#FF9AC8');g.addColorStop(.5,'#FF6FAF');g.addColorStop(1,'#E04A8E');
    ctx.fillStyle=g;ctx.fill();
    if(o.tint){ctx.save();ctx.clip();ctx.fillStyle=o.tint;const y1=y+h-h*o.tintHi/PRICE,y2=y+h-h*o.tintLo/PRICE;ctx.fillRect(x,y1,w,y2-y1);ctx.restore();}
    ctx.save();ctx.clip();ctx.fillStyle='rgba(255,255,255,.28)';ctx.fillRect(x+w*.14,top,w*.12,hh);ctx.restore();
  }
  ctx.restore();
}
function freezer(x,y,w,h){
  ctx.save();ctx.fillStyle='rgba(214,232,255,.10)';rr(x,y,w,h,24);ctx.fill();ctx.strokeStyle=C.line;ctx.lineWidth=5;rr(x,y,w,h,24);ctx.stroke();
  ctx.fillStyle='rgba(111,211,255,.18)';rr(x+24,y+24,w-48,h*.55,16);ctx.fill();
  const cols=['#FF6FAF','#FFC531','#6FD3FF','#7CFFB2','#ffffff','#B18CFF'];
  for(let i=0;i<14;i++){const ix=x+44+(i%7)*((w-88)/7),iy=y+44+Math.floor(i/7)*(h*.25);ctx.fillStyle=cols[i%6];rr(ix,iy,(w-88)/7-14,h*.2,10);ctx.fill();}
  text('❄ 24h',x+w-30,y+h-40,{a:'right',s:36,w:900,c:C.cyan});
  ctx.restore();
}
function seasonChart(k,hl){   // k: 0~1 막대 성장, hl: 'summer'|'winter'|null
  const ox=110,base=980,bw=56,gap=14,sc=.78;
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;line(ox-10,base,ox+12*(bw+gap),base);
  MONTHS.forEach((v,i)=>{
    const x=ox+i*(bw+gap),hgt=Math.abs(v)*sc*E.out(clamp(k*1.3-i*.03)),up=v>=0;
    const summer=i>=5&&i<=7,winter=i<=1||i>=10;
    let col=up?'rgba(53,224,138,.55)':'rgba(255,77,77,.55)';
    if(hl==='summer'&&summer)col=C.green;if(hl==='winter'&&winter)col=C.red;
    ctx.fillStyle=col;rr(x,up?base-hgt:base,bw,Math.max(2,hgt),8);ctx.fill();
    text((i+1)+'월',x+bw/2,base+(up?40:-28)+(up?0:0),{s:24,w:700,c:C.dim});
    if((hl==='summer'&&i===6)||(hl==='winter'&&i===0))text((v>0?'+':'')+v,x+bw/2,up?base-hgt-28:base+hgt+30,{f:'D',s:34,c:up?C.green:C.red});
  });
  ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=C.gold;ctx.lineWidth=3;line(ox-10,base-100*sc,ox+12*(bw+gap),base-100*sc);ctx.restore();
  text('평균 +100만',ox+12*(bw+gap),base-100*sc-26,{a:'right',s:28,w:800,c:C.gold});
}
"""
EP5_SCENES = r"""const SCENES={
  /* ── 훅: 반값 냉동고 → 1,000원짜리 하나 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h2'),fa=b>=0?1-P(b,0,.3):1;
    if(fa>0)group(0,0,1,0,fa,()=>{
      text('무인 아이스크림 할인점',540,290,{f:'D',s:84,c:'#FF6FAF',glow:'rgba(255,111,175,.8)',gb:30,alpha:P(a,0,.2)});
      text('편의점보다 반값',540,390,{f:'D',s:60,c:C.cyan,alpha:P(a,.1,.2)});
      group(540,780,E.back(P(a,0,.4))+.001,0,1,()=>freezer(-380,-260,760,520));
      stampBox('50%',820,560,T-WT('h1',1),{s:110,rot:.14});
    });
    if(b>=0){
      text('아이스크림 1개',540,236,{s:40,w:700,c:C.dim,alpha:P(b,0,.2)});
      text('1,000원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(b,0,.2)});
      group(0,(1-E.out(P(b,0,.5)))*400,1,0,P(b,0,.2),()=>drawPop(PRICE));
    }
  }},

  /* ── 비용 차감: 1,000원짜리를 한 입씩 베어 먹음 ── */
  cost:{draw(){
    const a=L('k1');
    let m=PRICE;COSTS.forEach(c=>{m-=c.v*E.out(P(T-c.tr,0,.6));});
    const col=m>500?C.gold:m>200?'#FF9F43':C.red;
    text('1개 팔면 남는 돈',540,232,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    let bump=0;COSTS.forEach(c=>{const d=T-c.tr;if(d>=0&&d<.3)bump=Math.max(bump,Math.sin(d/.3*Math.PI));});
    group(540,330,1+bump*.06,0,1,()=>text(Math.round(m)+'원',0,0,{f:'D',s:128,c:col,glow:col===C.red?'rgba(255,77,77,.6)':null,gb:40}));
    const act=COSTS.find(c=>T>=CT(c.cue)&&T<c.tr);
    drawPop(m,PX,PTOP,PW,PH,act?{tint:`rgba(255,77,77,${.45+.3*Math.sin(R*14)})`,tintLo:act.lo,tintHi:act.hi}:{});
    COSTS.forEach((c,k)=>{
      const d=T-c.tr;if(d<0||d>.8)return;
      const f=E.io(P(d,0,.55)),y0=PTOP+PH-PH*c.hi/PRICE;
      ctx.save();ctx.globalAlpha*=1-P(d,.55,.25);ctx.translate(lerp(PX+PW/2,860,f),lerp(y0+20,560+k*110,f));ctx.scale(lerp(1,.25,f),lerp(1,.25,f));
      ctx.fillStyle='#FF6FAF';ctx.beginPath();ctx.arc(0,0,60,0,7);ctx.fill();ctx.restore();
    });
    COSTS.forEach((c,k)=>{
      const ap=P(T-c.tr,.15,.3);if(ap<=0)return;const x=670,y=510+k*110;
      group((1-E.out(ap))*40,0,1,0,ap,()=>{
        ctx.fillStyle='rgba(255,255,255,.06)';rr(x,y,360,96,18);ctx.fill();
        emoji(c.ic,x+40,y+48,40);text(c.lb,x+80,y+30,{a:'left',s:26,w:800,c:C.dim});
        text('−'+c.v+'원',x+80,y+70,{a:'left',f:'D',s:44,c:C.red});
      });
    });
    text('한 입 = 비용 하나',850,990,{s:30,w:800,c:C.dim,alpha:P(a,.3,.3)});
  }},
""" + calc_scene('83', typing=110, small=40) + r"""
  /* ── 결과: 1개 83원 → 한 달 1만 2천 개 = 100만 원 ── */
  result:{draw(){
    const a=L('r1'),b=L('r2');
    text('아이스크림 1개 팔면 남는 돈',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    group(540,420,lerp(1.7,1,E.out(P(a,.05,.3))),0,P(a,0,.15),()=>text('83원',0,0,{f:'D',s:220,c:C.green,glow:'rgba(53,224,138,.45)'}));
    if(b>=0){
      text('× 12,000개 (한 달)',540,600,{f:'D',s:72,alpha:P(b,0,.2)});
      for(let i=0;i<40;i++){const t=b-(.3+i*.02);if(t<0)break;const k=E.back(P(t,0,.2));
        ctx.save();ctx.translate(195+(i%10)*76,720+Math.floor(i/10)*110);ctx.scale(k,k);
        ctx.fillStyle='#E8C99A';rr(-6,20,12,30,6);ctx.fill();ctx.fillStyle='#FF6FAF';rr(-20,-30,40,56,16);ctx.fill();ctx.restore();}
      text('하루 400개씩 (아이콘 1개 = 10개)',540,1170,{s:34,w:800,c:C.dim,alpha:P(b,1.0,.3)});
      text('= 약 1,000,000원',540,1250,{f:'D',s:80,c:C.gold,alpha:P(b,1.2,.3)});
    }
  }},

  /* ── 반전: 1년 평균의 함정 — 여름에 벌고 겨울엔 적자 ── */
  season:{draw(){
    const a=L('t1'),b=L('t2'),c=L('t3');
    ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(0,0,W,H);
    text('월별 순이익 (만 원)',540,300,{s:44,w:900,alpha:P(a,0,.3)});
    seasonChart(P(a,.1,1.0),c>=0?'winter':b>=0?'summer':null);
    if(b>=0&&c<0)group(540,420,E.back(P(T-WT('t2',4),0,.35))+.001,0,1,()=>{emoji('☀️',-200,0,90);text('여름 +460만',60,6,{f:'D',s:80,c:C.green});});
    if(c>=0){
      group(540,420,E.back(P(c,0,.35))+.001,0,1,()=>{emoji('⛄',-200,0,90);text('겨울 −80만',60,6,{f:'D',s:80,c:C.red});});
      group(800,1150,1,0,P(c,.4,.3),()=>{freezer(-150,-110,300,220);});
      text('냉동고 전기세는 그대로',540,1320,{s:40,w:900,c:C.cyan,alpha:P(c,.6,.3)});
    }
  }},

  /* ── 마무리: 여름 석 달 강조 + 엔딩 ── */
  end:{draw(){
    const a=L('e1'),z=T-(TL.voiceEnd+.3),fade=1-P(z,0,.4);
    if(fade>0)group(0,0,1,0,fade,()=>{
      seasonChart(1,'summer');
      const ox=110,bw=56,gap=14,x0=ox+5*(bw+gap)-10,x1=ox+8*(bw+gap)-4;
      ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=6;ctx.globalAlpha*=P(a,.2,.3);rr(x0,570,x1-x0,460,20);ctx.stroke();ctx.restore();
      text('6~8월',(x0+x1)/2,535,{f:'D',s:50,c:C.gold,alpha:P(a,.2,.3)});
      stampBox('여름 석 달이 1년을 먹여 살림',540,1230,T-WT('e1',2),{s:56,c:C.gold,rot:-.05,bg:'rgba(40,30,0,.75)'});
    });""" + end_card('EP.05 무인 아이스크림', '※ 월평균 매출 1,200만 원 · 원가율 70% 가정 예시 (업계 블로그 30% 마진 기준) · 세금 제외') + r"""
  }},
};

"""
EP5_COVER = cover('EP.05', '무인 아이스크림', 140, '편의점보다 반값', 680, 104, '하나 팔면 얼마?', 112,
                  "drawPop(PRICE,170,880,230,420);", 'rgba(255,111,175,.20)')
build('/home/user/gyeoltaro/shorts/ice-cream.html', '비밀의 계산기 무인 아이스크림 편', 'EP.05 무인 아이스크림', 'ice-cream', 'ice_cream', 'EP05', 'EP.05',
      EP5_CUES, EP5_CONSTS, EP5_HELPERS,
      "const SEQ=['1','0','0','0','−','9','1','7','='];   // 1,000 − 917",
      KEYS_EXTRA + "  for(let i=0;i<4;i++)ev.push({t:TL.cue[IDX.r2]+.3+i*.2,n:'tick'});\n  ev.push({t:TL.voiceEnd+.35,n:'win'});",
      EP5_SCENES, EP5_COVER, 'season', amount_re=r"/^\d+원[.,]?$/")

# ═══════════════════════════════ EP.06 탕후루 ═══════════════════════════════
EP6_CUES = r"""const CUES=[
  {id:'h1',sc:'hook',   text:'한 개 4천 원, 하루 [300개]씩 팔리던 [탕후루].',sfx:[[0,'whoosh'],[.1,'roll'],['w8','impact']],shake:[['w8',12,.35]]},
  {id:'h2',sc:'hook',   text:'한 달 매출 [3,600만 원].',pause:250,sfx:[['w2','stamp']],shake:[['w2',8,.3]]},
  {id:'k1',sc:'cost',   text:'과일과 설탕, 포장 {1,260만 원}.',sfx:[[0,'whoosh']]},
  {id:'k2',sc:'cost',   text:'번화가 임대료 {300만 원}.'},
  {id:'k3',sc:'cost',   text:'알바 세 명 {600만 원}.'},
  {id:'k4',sc:'cost',   text:'가맹비와 카드 수수료 {200만 원}.',pause:300},
  {id:'r1',sc:'payback',text:'남는 돈 <1,240만 원>, 창업비 1억은 [8개월]이면 회수.',pause:400,sfx:[[0,'whoosh'],[.15,'kaching']]},
  {id:'t1',sc:'trend',  text:'그런데 2023년 9월, 한 달에 [242곳]이 새로 문을 열었고,',sfx:[[0,'scratch'],[.02,'impact']],shake:[[.02,14,.4]],flash:[[0,.35]]},
  {id:'t2',sc:'trend',  text:'두 달 뒤엔 {63곳}으로 줄었죠.',pause:300,sfx:[['w3','buzz'],['w3','stamp']],shake:[['w3',12,.35]]},
  {id:'t3',sc:'drop',   text:'유행이 꺾이자 하루 300개가 {50개}로.',pause:300,sfx:[[0,'whoosh'],['w4','shatter']]},
  """ + SIG + r"""
  {id:'r2',sc:'loss',   text:'매출 600만 원, 매달 {160만 원} 적자.',pause:450,sfx:[[0,'whoosh'],['w4','buzz']],shake:[['w4',12,.35]]},
  {id:'e1',sc:'end',    text:'탕후루는 설탕이 아니라, [시간과 싸우는] 장사였습니다.',sfx:[[0,'whoosh'],['w3','stamp']],shake:[['w3',10,.3]]},
];
// 유행 정점 기준 월 비용 (단위: 만 원) — 번화가 프랜차이즈 탕후루 가정
const COSTS=[
  {cue:'k1',ic:'🍓',lb:'과일·설탕·포장',v:1260},
  {cue:'k2',ic:'🏠',lb:'번화가 임대료',v:300},
  {cue:'k3',ic:'👥',lb:'알바 3명',v:600},
  {cue:'k4',ic:'💳',lb:'가맹비·카드 수수료',v:200},
];
"""
EP6_CONSTS = """// 막대 1개 = 정점 월 매출 3,600만 원. 비용은 오른쪽부터 잘라 감
const GROSS=3600,BX=90,BWID=900;
(()=>{let top=GROSS;COSTS.forEach(c=>{c.hi=top;c.lo=top-c.v;top=c.lo;});})();
const vx=v=>BX+v/GROSS*BWID;
const PERMITS=[['7월',160],['8월',232],['9월',242],['10월',164],['11월',63]];   // 2023 탕후루 영업허가 (행정안전부 인허가데이터)
"""
EP6_HELPERS = r"""/* 탕후루 꼬치: 설탕 코팅 딸기 4알 */
function drawSkewer(x,y,s,rot,alpha=1){
  group(x,y,s,rot,alpha,()=>{
    ctx.fillStyle='#E8C99A';rr(-9,-170,18,760,9);ctx.fill();
    [300,165,30,-105].forEach((cy,i)=>{
      const g=ctx.createRadialGradient(-28,cy-30,10,0,cy,90);g.addColorStop(0,'#ff8a8a');g.addColorStop(.6,'#E53935');g.addColorStop(1,'#9f1a1a');
      ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,cy,78,70,0,0,7);ctx.fill();
      ctx.fillStyle='rgba(255,240,200,.85)';for(let k=0;k<7;k++){ctx.beginPath();ctx.ellipse(-40+rnd(i*9+k)*80,cy-40+rnd(i*7+k+3)*80,3,5,0,0,7);ctx.fill();}
      ctx.fillStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.ellipse(-30,cy-30,26,14,-.6,0,7);ctx.fill();
    });
    ctx.fillStyle='#35a853';ctx.beginPath();ctx.moveTo(-40,-170);ctx.quadraticCurveTo(0,-210,40,-170);ctx.quadraticCurveTo(0,-180,-40,-170);ctx.fill();
  });
}
function drawHourglass(x,y,s,k){
  group(x,y,s,0,1,()=>{
    ctx.fillStyle='#8a5a2b';rr(-200,-330,400,36,12);ctx.fill();rr(-200,294,400,36,12);ctx.fill();
    ctx.strokeStyle='rgba(214,232,255,.85)';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-160,-294);ctx.lineTo(160,-294);ctx.lineTo(18,0);ctx.lineTo(160,294);ctx.lineTo(-160,294);ctx.lineTo(-18,0);ctx.closePath();ctx.stroke();
    const top=1-k,ht=270*Math.sqrt(top);
    ctx.fillStyle='#ff6b6b';ctx.beginPath();ctx.moveTo(-160*ht/294,-ht);ctx.lineTo(160*ht/294,-ht);ctx.lineTo(10,-6);ctx.lineTo(-10,-6);ctx.closePath();ctx.fill();
    const hb=270*Math.sqrt(k);ctx.beginPath();ctx.moveTo(-160,290);ctx.lineTo(160,290);ctx.lineTo(160-160*(1-hb/294)*0,290-hb*0.001);ctx.lineTo(0,290-hb);ctx.closePath();ctx.fill();
    if(k<1){ctx.fillStyle='#ff6b6b';ctx.fillRect(-4,0,8,290-hb);}
  });
}
"""
EP6_SCENES = r"""function cashBar(x0,x1,y,h,col1,col2,alpha=1){
  if(x1-x0<1)return;
  ctx.save();ctx.globalAlpha*=alpha;const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,col1);g.addColorStop(1,col2);
  ctx.fillStyle=g;rr(x0,y,x1-x0,h,18);ctx.fill();
  ctx.save();rr(x0,y,x1-x0,h,18);ctx.clip();ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=3;for(let x=x0+16;x<x1;x+=18)line(x,y+10,x,y+h-10);ctx.restore();
  ctx.restore();
}
const BAR_Y=560,BAR_H=160;

const SCENES={
  /* ── 훅: 하루 300개 → 월 매출 3,600만 원 ── */
  hook:{draw(){
    const a=L('h1'),b=L('h2');
    if(b<0){
      text('하루 판매',540,236,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
      text(Math.round(300*E.out(P(a,.1,1.2)))+'개',540,334,{f:'D',s:136,c:'#FF6B6B',glow:'rgba(255,107,107,.5)',alpha:P(a,0,.15)});
      text('1개 4,000원',540,425,{s:36,w:800,c:C.dim,alpha:P(a,.2,.3)});
    }else{
      text('월 매출',540,236,{s:40,w:700,c:C.dim});
      text(won(36000000*E.out(P(b,.05,1.0)))+'원',540,334,{f:'D',s:136,c:C.gold,glow:'rgba(255,197,49,.45)'});
      text('300개 × 4,000원 × 30일',540,425,{s:36,w:800,c:C.dim,alpha:P(b,.2,.3)});
    }
    drawSkewer(540,820,E.back(P(a,0,.5))*.95+.001,Math.sin(R*2)*.05);
    for(let i=0;i<6;i++){const ph=(R*.25+i/6)%1;text('✦',200+i*140,1300-ph*700,{s:40,c:'rgba(255,240,200,.8)',alpha:1-ph});}
  }},

  /* ── 비용 차감: 정점 매출 3,600만 원 막대 ── */
  cost:{draw(){
    const a=L('k1');
    let m=GROSS;COSTS.forEach(c=>{m-=c.v*E.out(P(T-c.tr,0,.6));});
    const col=m>2000?C.gold:m>800?'#FF9F43':C.red;
    text('이번 달 남은 돈 (유행 정점)',540,232,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    let bump=0;COSTS.forEach(c=>{const d=T-c.tr;if(d>=0&&d<.3)bump=Math.max(bump,Math.sin(d/.3*Math.PI));});
    group(540,330,1+bump*.06,0,1,()=>text(won(m*10000)+'원',0,0,{f:'D',s:128,c:col}));
    text(`매출의 ${(m/36).toFixed(0)}%`,540,425,{s:36,w:800,c:col});
    ctx.fillStyle='rgba(255,255,255,.06)';rr(BX,BAR_Y,BWID,BAR_H,18);ctx.fill();
    cashBar(BX,vx(m),BAR_Y,BAR_H,'#FFE07a','#F2A900');
    const act=COSTS.find(c=>T>=CT(c.cue)&&T<c.tr);
    if(act){ctx.save();ctx.fillStyle=`rgba(255,77,77,${.45+.3*Math.sin(R*14)})`;rr(vx(act.lo),BAR_Y,vx(act.hi)-vx(act.lo),BAR_H,14);ctx.fill();ctx.restore();}
    COSTS.forEach((c,k)=>{
      const d=T-c.tr;if(d<0||d>.75)return;
      const f=E.io(P(d,0,.55)),cx=k%2?552+214:100+214,cy=900+Math.floor(k/2)*90+35;
      const x0=lerp(vx(c.lo),cx-60,f),x1=lerp(vx(c.hi),cx+60,f),y=lerp(BAR_Y,cy-20,f),h=lerp(BAR_H,40,f);
      ctx.save();ctx.globalAlpha*=1-P(d,.5,.25);ctx.fillStyle=C.red;rr(x0,y,Math.max(8,x1-x0),h,12);ctx.fill();ctx.restore();
      text('−'+won(c.v)+'만',(vx(c.lo)+vx(c.hi))/2,BAR_Y+BAR_H/2-d*50,{f:'D',s:60,c:C.red,alpha:1-P(d,.4,.35),st:9});
    });
    COSTS.forEach((c,k)=>{
      const x=k%2?552:100,y=900+Math.floor(k/2)*90,ap=P(T-c.tr,.15,.3);if(ap<=0)return;
      group((1-E.out(ap))*30,0,1,0,ap,()=>{
        ctx.fillStyle='rgba(255,255,255,.06)';rr(x,y,428,70,14);ctx.fill();
        emoji(c.ic,x+34,y+36,34);text(c.lb,x+66,y+36,{a:'left',s:c.lb.length>10?24:28,w:800});
        text('−'+won(c.v)+'만',x+412,y+37,{a:'right',s:36,f:'D',c:C.red});
      });
    });
    drawSkewer(940,1260,.28,.3,P(a,0,.3));
  }},

  /* ── 정점 수익 → 창업비 1억, 8개월 회수 ── */
  payback:{draw(){
    const a=L('r1');
    text('유행 정점의 한 달 순이익',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    group(540,380,lerp(1.6,1,E.out(P(a,.05,.3))),0,P(a,0,.15),()=>text('12,400,000원',0,0,{f:'D',s:120,c:C.green,glow:'rgba(53,224,138,.45)'}));
    text('창업비 1억 원 회수까지',540,560,{s:44,w:900,alpha:P(a,.5,.3)});
    const ws=T-WT('r1',6);
    for(let i=0;i<8;i++){
      const x=150+(i%4)*200,y=650+Math.floor(i/4)*200,k=P(ws-i*.12,0,.2);
      ctx.fillStyle=k>0?`rgba(255,197,49,${.25+.75*k})`:'rgba(255,255,255,.06)';rr(x,y,180,170,22);ctx.fill();
      text((i+1)+'개월',x+90,y+85,{f:'D',s:48,c:k>0?C.ink:'rgba(255,255,255,.3)'});
    }
    stampBox('8개월이면 본전',540,1150,ws-1.1,{s:72,c:C.green,rot:-.06,bg:'rgba(0,30,15,.6)'});
  }},

  /* ── 반전 1: 영업허가 그래프 (2023년) ── */
  trend:{draw(){
    const a=L('t1'),b=L('t2'),hi=T-WT('t1',5);
    ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,0,W,H);
    text('탕후루 가게 새 영업허가 (2023년)',540,290,{s:46,w:900,alpha:P(a,0,.3)});
    text('행정안전부 지방행정인허가데이터 · 파이낸셜뉴스(2024.4.8)',540,350,{s:26,w:700,c:C.dim,alpha:P(a,0,.3)});
    const base=1150,sc=520/242;
    PERMITS.forEach(([lb,v],i)=>{
      const show=i<3?P(a-i*.15,.1,.5):(b>=0?P(b-(i-3)*.25,0,.5):0);if(show<=0)return;
      const x=130+i*170,h=v*sc*E.out(show),sel=i===2&&hi>=0,drop=i===4;
      ctx.fillStyle=drop?C.red:sel?C.gold:i<3?'rgba(255,107,107,.75)':'rgba(255,107,107,.45)';
      if(sel){ctx.shadowColor=C.gold;ctx.shadowBlur=30;}rr(x,base-h,140,h,16);ctx.fill();ctx.shadowColor='transparent';
      text(Math.round(v*E.out(show))+'곳',x+70,base-h-40,{f:'D',s:52,c:sel?C.gold:drop?C.red:'#fff'});
      text(lb,x+70,base+40,{s:34,w:800,c:C.dim});
    });
    if(b>=0){
      const k=P(T-WT('t2',3),0,.4);
      if(k>0){ctx.save();ctx.strokeStyle=C.red;ctx.lineWidth=10;ctx.lineCap='round';const x1=130+2*170+70,y1=base-242*sc-90,x2=130+4*170+70,y2=base-63*sc-90;
        line(x1,y1,lerp(x1,x2,k),lerp(y1,y2,k));ctx.restore();}
      stampBox('2달 만에 −74%',540,470,T-WT('t2',3)-.15,{s:72,rot:-.06});
    }
  }},

  /* ── 반전 2: 하루 300개 → 50개 ── */
  drop:{draw(){
    const a=L('t3'),cut=T-WT('t3',4);
    text('하루 판매',540,250,{s:40,w:700,c:C.dim,alpha:P(a,0,.2)});
    const n=cut<0?300:Math.round(lerp(300,50,E.out(P(cut,0,.5))));
    text(n+'개',540,350,{f:'D',s:136,c:cut<0?'#fff':C.red});
    for(let i=0;i<30;i++){
      const x=150+(i%10)*86,y=560+Math.floor(i/10)*250,gone=i>=5&&cut>=0,k=gone?1-P(cut-(29-i)*.015,0,.25):1;
      if(k<=0)continue;drawSkewer(x,y,.21*k+.001,gone?(1-k)*1.5:0,gone?k:1);
    }
    text('꼬치 1개 = 10개',960,1330,{a:'right',s:28,w:700,c:C.dim,alpha:P(a,.3,.3)});
  }},
""" + calc_scene('−1,600,000', typing=86, small=32, done=84) + r"""
  /* ── 결과: 매달 160만 원 적자 ── */
  loss:{draw(){
    const a=L('r2');
    text('유행이 지난 뒤 한 달',540,250,{s:46,w:800,c:C.dim,alpha:P(a,0,.25)});
    group(540,390,lerp(1.6,1,E.out(P(a,.05,.3))),0,P(a,0,.15),()=>text('−1,600,000원',0,0,{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.5)'}));
    const rows=[['매출 (하루 50개)','6,000,000',C.green],['재료 (35%)','−2,100,000',C.red],['임대료','−3,000,000',C.red],['알바 1명','−1,500,000',C.red],['가맹·수수료','−1,000,000',C.red]];
    rows.forEach((r,i)=>{const k=P(a-.4-i*.12,0,.25);if(k<=0)return;const y=560+i*92;
      group((1-E.out(k))*40,0,1,0,k,()=>{text(r[0],130,y,{a:'left',s:38,w:800});text(r[1],950,y,{a:'right',f:'D',s:46,c:r[2]});if(i<4)dashed(130,y+46,950,'rgba(255,255,255,.12)');});});
    text('창업비 1억은 아직 못 갚았는데',540,1110,{s:42,w:900,c:C.gold,alpha:P(a,1.2,.3)});
  }},

  /* ── 마무리: 모래시계 + 엔딩 ── */
  end:{draw(){
    const a=L('e1'),z=T-(TL.voiceEnd+.3),fade=1-P(z,0,.4);
    if(fade>0)group(0,0,1,0,fade,()=>{
      drawHourglass(540,760,1,P(a,0,3.5));
      drawSkewer(870,640,.3,.4);
      stampBox('시간과 싸우는 장사',540,1230,T-WT('e1',3),{s:76,c:C.gold,rot:-.06,bg:'rgba(40,30,0,.75)'});
    });""" + end_card('EP.06 탕후루', '※ 가게 수익은 가정 예시 · 영업허가 수는 행정안전부 인허가데이터(2023) · 세금 제외') + r"""
  }},
};

"""
EP6_COVER = cover('EP.06', '탕후루', 270, '하루 300개 팔던 가게', 840, 92, '지금은 얼마 남을까?', 104,
                  "drawSkewer(250,1080,.62,-.28);", 'rgba(255,77,77,.20)')
build('/home/user/gyeoltaro/shorts/tanghulu.html', '비밀의 계산기 탕후루 편', 'EP.06 탕후루', 'tanghulu', 'tanghulu', 'EP06', 'EP.06',
      EP6_CUES, EP6_CONSTS, EP6_HELPERS,
      "const SEQ=['6','00','00','00','−','7','6','00','00','0','='];   // 6,000,000 − 7,600,000",
      KEYS_EXTRA + "  for(let i=0;i<8;i++)ev.push({t:TL.word[IDX.r1][6]+i*.12,n:'tick'});\n  ev.push({t:TL.voiceEnd+.35,n:'win'});",
      EP6_SCENES, EP6_COVER, 'trend')
