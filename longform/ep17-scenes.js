/* ════════════════════════════════════════════════════════════════════
   장면 (LF.17 아메리카노 3,000원 동네 카페 계산서) — 수치·출처는 docs/longform-ep17.md
   중심 그림: 테이크아웃 컵 하나를 층으로 쌓은 3,000원. 재료 400 · 월세 600 · 알바 600 · 전기·수수료 400 · 사장님 몫 1,000.
   반전: 도장 열 개의 공짜 한 잔은 새 손님에겐 재료 400원, 어차피 올 단골에겐 3,000원 — 단골에게만 가면 10% 할인과 같은 90만.
   ════════════════════════════════════════════════════════════════════ */
const LY=[ // 아래에서 위로 쌓는 층 (원)
  {k:'mat',name:'재료',v:400,col:'#b07a45'},
  {k:'rent',name:'월세',v:600,col:'#2ec4b6'},
  {k:'alba',name:'알바',v:600,col:'#6FD3FF'},
  {k:'etc',name:'전기·수수료',v:400,col:'#9aa4b8'},
  {k:'own',name:'사장님 몫',v:1000,col:'#35E08A'},
];
const LYK=Object.fromEntries(LY.map(s=>[s.k,s]));
const SEQ=['4','0','0','×','3','0','0','='];   // 공짜 한 잔 재료비 400 × 공짜 300잔 = 120,000 (0 개수: 400 둘, 300 둘)
function lyT(k){return {mat:KT('s1',0),rent:KT('s2',0),alba:KT('s3',0),etc:KT('s4',0),own:KT('s5',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}
function bubble(x,y,w,h,str,o={}){group(x,y,o.k??1,o.rot||0,o.alpha??1,()=>{ctx.fillStyle='#fff';rr(-w/2,-h/2,w,h,30);ctx.fill();if(o.tail!==false){ctx.beginPath();ctx.moveTo(-w*.2,h/2);ctx.lineTo(-w*.26,h/2+50);ctx.lineTo(-w*.1,h/2);ctx.fill();}text(str,0,4,{f:'D',s:o.s||60,c:o.c||C.ink,max:w-60});});}

/* 테이크아웃 컵 (상표 없음). 층 그림: cupStack */
function coffeeCup(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(0,150,120,18,0,0,7);ctx.fill();
  ctx.fillStyle=o.free?'#fff4d6':'#f4efe6';ctx.beginPath();ctx.moveTo(-100,-120);ctx.lineTo(100,-120);ctx.lineTo(76,150);ctx.lineTo(-76,150);ctx.closePath();ctx.fill();
  ctx.fillStyle=o.sleeve||'#8a5a3c';ctx.beginPath();ctx.moveTo(-93,-30);ctx.lineTo(93,-30);ctx.lineTo(86,60);ctx.lineTo(-86,60);ctx.closePath();ctx.fill();
  ctx.fillStyle='#e8e2d6';rr(-112,-150,224,34,12);ctx.fill();ctx.fillStyle='#d6cfc2';rr(-80,-170,160,24,10);ctx.fill();
  if(o.label)text(o.label,0,16,{f:'D',s:o.ls||46,c:'#fff3d6',max:170});
});}
function cupStack(cx,yb,Hc,o={}){ // 위 폭 o.wt, 아래 폭 o.wb. o.on(k) → 켜짐 정도 0~1, o.cut: 몫 층에서 깎인 원
  const wt=o.wt||440,wb=o.wb||330,sc=Hc/3000,hw=y=>lerp(wb/2,wt/2,(yb-y)/Hc);
  let acc=0;
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(cx,yb+16,wb*.62,20,0,0,7);ctx.fill();
  LY.forEach(g=>{const y0=yb-acc*sc,y1=yb-(acc+g.v)*sc;const on=o.on?o.on(g.k):1;
    ctx.fillStyle=on>0?g.col:'rgba(255,255,255,.08)';ctx.save();if(on>0)ctx.globalAlpha*=lerp(.25,1,on);
    ctx.beginPath();ctx.moveTo(cx-hw(y0),y0);ctx.lineTo(cx+hw(y0),y0);ctx.lineTo(cx+hw(y1),y1);ctx.lineTo(cx-hw(y1),y1);ctx.closePath();ctx.fill();ctx.restore();
    ctx.strokeStyle='rgba(6,13,32,.55)';ctx.lineWidth=3;line(cx-hw(y1),y1,cx+hw(y1),y1);
    if(o.labels!==false&&on>0){const yy=(y0+y1)/2;text(g.name,cx,yy-(g.v>=600?16:0)+2,{f:'D',s:g.v>=600?36:30,c:'#0d1a12',alpha:on,max:wb-30});if(g.v>=600)text(g.v.toLocaleString('ko-KR')+'원',cx,yy+26,{f:'D',s:32,c:'#0d1a12',alpha:on});}
    acc+=g.v;});
  if(o.cut){const y1=yb-3000*sc,y2=yb-(3000-o.cut)*sc;ctx.save();ctx.fillStyle='rgba(255,77,77,.85)';ctx.beginPath();ctx.moveTo(cx-hw(y2),y2);ctx.lineTo(cx+hw(y2),y2);ctx.lineTo(cx+hw(y1),y1);ctx.lineTo(cx-hw(y1),y1);ctx.closePath();ctx.fill();ctx.restore();}
  ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx-wb/2,yb);ctx.lineTo(cx-wt/2,yb-Hc);ctx.moveTo(cx+wb/2,yb);ctx.lineTo(cx+wt/2,yb-Hc);ctx.stroke();
  ctx.fillStyle='#e8e2d6';rr(cx-wt/2-14,yb-Hc-34,wt+28,36,12);ctx.fill();ctx.fillStyle='#d6cfc2';rr(cx-wt/3,yb-Hc-58,wt*2/3,26,10);ctx.fill();
  return {top:yb-Hc,yOf:v=>yb-v*sc};
}
/* 도장 쿠폰 (칸 10개) */
function stampCard(x,y,s,n,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';rr(-346,-150,700,310,24);ctx.fill();
  ctx.fillStyle='#fff7e6';rr(-350,-160,700,310,24);ctx.fill();ctx.strokeStyle='#8a5a3c';ctx.lineWidth=5;rr(-334,-144,668,278,18);ctx.stroke();
  text(o.title||'도장 10개 = 아메리카노 한 잔',0,-104,{f:'D',s:36,c:'#5b3a24',max:640});
  for(let i=0;i<10;i++){const cx=-256+(i%5)*128,cy=-20+Math.floor(i/5)*110;ctx.strokeStyle='rgba(91,58,36,.45)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,42,0,7);ctx.stroke();
    const k=clamp(n-i);if(k>0){group(cx,cy,lerp(1.6,1,E.out(k)),-.2,k,()=>{ctx.fillStyle='#d62f2f';ctx.beginPath();ctx.arc(0,0,38,0,7);ctx.fill();ctx.strokeStyle='#fff7e6';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,28,0,7);ctx.stroke();text('★',0,3,{s:30,c:'#fff7e6',w:900});});}}
});}
/* 동네 카페 (상표 없음) */
function cafeFront(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,262,470,30,0,0,7);ctx.fill();
  ctx.fillStyle='#efe4d0';rr(-440,-200,880,460,12);ctx.fill();
  ctx.fillStyle='#3d4a63';rr(-460,-250,920,80,10);ctx.fill();text(o.name||'동네 카페',0,-208,{f:'D',s:50,c:'#fff3d6'});
  for(let i=0;i<10;i++){ctx.fillStyle=i%2?'#ffffff':'#2e8b6a';ctx.beginPath();ctx.moveTo(-440+i*88,-170);ctx.lineTo(-352+i*88,-170);ctx.lineTo(-360+i*88,-110);ctx.lineTo(-432+i*88,-110);ctx.closePath();ctx.fill();}
  ctx.fillStyle=o.dark?'#1f2633':'rgba(255,214,120,.9)';rr(-400,-80,500,260,10);ctx.fill();ctx.strokeStyle='#5b3a24';ctx.lineWidth=8;rr(-400,-80,500,260,10);ctx.stroke();line(-150,-80,-150,180);
  ctx.fillStyle='#5b3a24';rr(170,-60,200,320,8);ctx.fill();ctx.fillStyle='rgba(255,214,120,.8)';rr(195,-35,150,150,6);ctx.fill();ctx.fillStyle='#e8d6b0';ctx.beginPath();ctx.arc(340,120,10,0,7);ctx.fill();
  if(!o.dark){coffeeCup(-300,90,.38);coffeeCup(-40,90,.38);}
  ctx.fillStyle='#fff';rr(-470,130,150,120,10);ctx.fill();text('아메리카노',-395,165,{s:22,w:900,c:C.ink});text(o.price||'3,000원',-395,212,{f:'D',s:34,c:'#d62f2f'});
});}
/* 원두 한 알 */
function beanDot(x,y,r,rot=0){group(x,y,1,rot,1,()=>{ctx.fillStyle='#5b3a24';ctx.beginPath();ctx.ellipse(0,0,r,r*.7,0,0,7);ctx.fill();ctx.strokeStyle='#2e1c10';ctx.lineWidth=r*.18;ctx.beginPath();ctx.moveTo(-r*.7,0);ctx.quadraticCurveTo(0,r*.3,r*.7,0);ctx.stroke();});}
function person(x,y,s,col,al=1){if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-48*s,22*s,0,7);ctx.fill();rr(x-30*s,y-20*s,60*s,70*s,22*s);ctx.fill();ctx.restore();}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o2')){
      const a=L('o1'),q=K('o1',0);
      stampCard(640,430,1.15*E.back(P(a,0,.5))+.001,clamp((T-CT('o1')-.3)*5,0,10));
      coffeeCup(1340,440,1.1,{alpha:P(T,FR('o1',.3),.3),free:1,label:'FREE',sleeve:'#d62f2f'});
      text('도장 10개 → 1잔 공짜',1340,690,{f:'D',s:48,c:C.gold,alpha:P(T,FR('o1',.3),.3)});
      if(q>=0)stampBox('= 10% 할인?',960,800,q,{s:60,c:C.gold,bg:'rgba(40,30,0,.9)'});
    }else if(T<CT('o3')){
      const b=L('o2');
      coffeeCup(520,470,1.4*E.back(P(b,0,.4))+.001,{free:1,label:'FREE',sleeve:'#d62f2f'});
      text('공짜 한 잔에 실제로 나가는 돈',1300,300,{f:'D',s:52,c:C.dim,alpha:P(b,.3,.3)});
      big('o2',0,1300,470,'400원',{f:'D',s:190,c:'#d9a066',glow:'rgba(217,160,102,.45)'});
      srcLine('예시 가정: 원두 두 샷 약 220원 + 컵·뚜껑·빨대 150원 + 얼음·냅킨 30원');
    }else if(T<CT('o3b')){
      const b=L('o3'),q=K('o3',0);
      text('열 잔 매출 3만 원 + 공짜 한 잔',960,190,{f:'D',s:58,c:C.gold,alpha:P(b,0,.3)});
      for(let i=0;i<11;i++)coffeeCup(180+i*156,420,.5,{alpha:P(b,.1+i*.04,.3),free:i===10,sleeve:i===10?'#d62f2f':null,label:i===10?'0':'3천',ls:40});
      text('3만 원',920,600,{f:'D',s:60,alpha:P(b,.6,.3)});text('400원',1740,600,{f:'D',s:60,c:'#d9a066',alpha:P(b,.8,.3)});
      if(q>=0)stampBox('400원 ÷ 3만 원 = 1.3%',960,770,q,{s:60,c:'#d9a066',bg:'rgba(40,25,10,.92)'});
    }else if(T<CT('o4')){
      const b=L('o3b');drawMascot(560,540,.95,'think',{alpha:P(b,0,.3)});
      bubble(1300,400,860,180,'할인보다 7배 넘게 싸다?',{k:E.back(P(b,.1,.4))+.001,s:62});
    }else if(T<CT('o5')){
      const b=L('o4'),q=K('o4',0);
      text('도장이 없어도 매일 오는 단골',960,190,{f:'D',s:56,c:C.gold,alpha:P(b,0,.3)});
      person(420,520,2.4,'#c9ced9',P(b,.1,.3));
      for(let d=0;d<11;d++){const x=720+(d%11)*100;coffeeCup(x,470,.32,{alpha:P(b,.2+d*.05,.2),free:d===10,sleeve:d===10?'#d62f2f':null});text(d===10?'11번째':(d+1)+'',x,560,{s:26,w:900,c:d===10?C.red:C.dim,alpha:P(b,.2+d*.05,.2)});}
      text('같은 공짜 한 잔이',1220,680,{f:'D',s:48,alpha:P(b,.5,.3)});big('o4',0,1220,790,'−3,000원',{f:'D',s:96,c:C.red});
    }else if(T<CT('o6')){
      const b=L('o5'),q=K('o5',0);
      text('한 달 공짜 300잔이 전부 단골에게 가면',960,190,{f:'D',s:54,c:C.gold,alpha:P(b,0,.3)});
      group(560,450,1,0,P(b,.1,.3),()=>{panel(-330,-150,660,300,{bd:'#d9a066'});text('도장 (단골만)',0,-70,{f:'D',s:54});text('300잔 × 3,000원',0,20,{s:40,w:900,c:C.dim});text(q>=0?'−90만 원':'?',0,100,{f:'D',s:60,c:q>=0?C.red:C.gold});});
      group(1360,450,1,0,P(b,.4,.3),()=>{panel(-330,-150,660,300,{bd:'rgba(255,255,255,.3)'});text('10% 할인',0,-70,{f:'D',s:54});text('900만 원 × 10%',0,20,{s:40,w:900,c:C.dim});text(q>=0?'−90만 원':'?',0,100,{f:'D',s:60,c:q>=0?C.red:C.gold});});
      if(q>=0)group(960,450,lerp(1.6,1,E.out(P(q,0,.3))),0,P(q,0,.2),()=>text('=',0,0,{f:'D',s:120,c:'#fff'}));
      if(T>FR('o5',.6))stampBox('갈림길: 한 번 더 왔느냐',960,770,T-FR('o5',.6),{s:58,c:C.gold,bg:'rgba(40,30,0,.9)'});
    }else{
      const k9=L('o6'),k10=L('o7');
      text('카페를 차리거나 쿠폰을 만들기 전 꼭 볼 숫자',960,230,{f:'D',s:68,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['원두·컵 가격 (보도)','카페 수·생존율 (통계)','카페 숫자 = 예시 가정'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,380+i*580,760,{s:32,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('아메리카노 3,000원 동네 카페 계산서',960,240,{f:'D',s:104,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('도장 열 개의 진짜 값',960,380,{s:56,w:900,alpha:P(a,.3,.3)});
    cafeFront(700,690,.5,{alpha:P(a,.2,.3)});stampCard(1230,640,.42,10,{alpha:P(a,.3,.3)});drawMascot(1600,720,.75,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 카페 ── */
  setup:{draw(){
    sub('p1','p2',()=>{cafeFront(600,520,.85);
      if(L('p2')>=0){text('테이블 여섯 개 개인 카페',1460,300,{f:'D',s:54,c:C.gold});
        ['주택가 골목','사장님이 직접 운영','바쁜 시간 알바 한 명','세금 제외'].forEach((s,i)=>pill(s,1460,420+i*100,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p2',.2+i*.15),.3)}));}
      text('예시 가정',600,860,{s:30,w:900,c:C.dim});});
    sub('p3','p3',()=>{text('아메리카노 한 잔',960,170,{f:'D',s:56,c:C.gold});
      const q=K('p3',0);coffeeCup(560,470,1.5,{alpha:q>=0?1:.35});
      text(q>=0?'3,000원':'?',1360,440,{f:'D',s:160,c:C.gold});text('오늘은 아메리카노 한 가지로 (예시)',1360,580,{s:38,w:900,c:C.dim});});
    sub('p4','p4',()=>{text('하루 100잔 × 30일',960,165,{f:'D',s:56,c:C.gold});
      const q=K('p4',0);for(let i=0;i<100;i++){const x=330+(i%20)*64,y=270+Math.floor(i/20)*84;const k=q>=0?P(q,i*.008,.15):0;if(k<=0){ctx.fillStyle='rgba(255,255,255,.08)';rr(x-20,y-28,40,56,8);ctx.fill();}else coffeeCup(x,y,.2,{alpha:k});}
      if(q>=0)text('한 달 3,000잔 · 매출 900만 원',960,760,{f:'D',s:66,c:C.green,alpha:P(T,FR('p4',.55),.3)});
      srcLine('예시 가정 · 컵 하나 = 하루 한 잔');});
    sub('p5','p5',lt=>{cupStack(960,800,560,{on:()=>0,labels:false});
      text('3,000원',1360,300,{f:'D',s:90,c:C.gold,alpha:P(lt,.3,.3)});text('한 잔을 층으로 나눠 보면',1360,400,{s:40,w:900,alpha:P(lt,.5,.3)});
      text('?',960,560,{f:'D',s:140,c:C.gold,alpha:P(lt,.4,.3)});});
  }},
  /* ── 3,000원 쪼개기 ── */
  cut:{draw(){
    const cx=420,yb=830,Hc=560;
    cupStack(cx,yb,Hc,{on:k=>P(T,lyT(k),.4)});
    // 층 옆 금액 (작은 층)
    let acc=0;LY.forEach(g=>{const t=lyT(g.k);const y=yb-(acc+g.v/2)*(Hc/3000);if(T>=t&&g.v<600){text(g.v+'원',cx+250,y,{a:'left',f:'D',s:40,c:g.col,alpha:P(T,t,.3)});}acc+=g.v;});
    text('아메리카노 3,000원',cx,150,{f:'D',s:40,c:C.gold});
    const X=1240;
    sub('s1','s1b',()=>{text('첫 번째: 재료',X,230,{f:'D',s:56,c:LYK.mat.col});
      [['원두 두 샷 (20g)','약 220원'],['컵·뚜껑·빨대','150원'],['얼음·냅킨','30원']].forEach(([l,v],i)=>{const k=P(T,FR('s1',.2+i*.18),.3);text(l,X-320,340+i*80,{a:'left',s:40,w:900,alpha:k});text(v,X+320,340+i*80,{a:'right',f:'D',s:46,c:'#d9a066',alpha:k});});
      ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;line(X-320,570,X+320,570);
      popText(KT('s1',0),X,640,'= 400원',{f:'D',s:90,c:'#d9a066'});
      if(L('s1b')>=0){pill('원두 10g = 111원 (소비자단체협의회 추정)',X,750,{s:30,bg:'rgba(255,240,220,.95)',alpha:P(L('s1b'),0,.3)});pill('일회용 컵 시장가 개당 50~100원 (정부 발표)',X,820,{s:30,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('s1b',.5),.3)});}});
    sub('s2','s2',()=>{text('두 번째: 월세',X,300,{f:'D',s:60,c:LYK.rent.col});text('한 달 180만 ÷ 3,000잔 (예시)',X,400,{s:40,w:900});popText(KT('s2',0),X,540,'600원',{f:'D',s:110,c:LYK.rent.col});});
    sub('s3','s3',()=>{text('세 번째: 알바 인건비',X,300,{f:'D',s:60,c:LYK.alba.col});text('바쁜 시간 알바 한 달 180만 (예시)',X,400,{s:40,w:900});popText(KT('s3',0),X,540,'600원',{f:'D',s:110,c:LYK.alba.col});});
    sub('s4','s4b',()=>{text('네 번째: 전기·수도·카드 수수료·수리',X,300,{f:'D',s:50,c:LYK.etc.col,max:900});text('한 달 120만 (예시)',X,400,{s:40,w:900});popText(KT('s4',0),X,540,'400원',{f:'D',s:110,c:'#c9ced9'});
      if(L('s4b')>=0)pill('월세·알바·전기 = 손님이 와도, 안 와도 나간다',X,700,{s:34,bg:'rgba(180,240,235,.95)',alpha:P(L('s4b'),0,.3)});});
    sub('s5','s5',()=>{text('3,000 − 400 − 600 − 600 − 400',X,300,{f:'D',s:46,c:C.dim});text('사장님 몫',X,400,{f:'D',s:60,c:C.green});big('s5',0,X,540,'1,000원',{f:'D',s:130,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('s5',.55))text('× 3,000잔 = 한 달 300만 원',X,690,{f:'D',s:50,c:C.gold,alpha:P(T,FR('s5',.55),.3)});});
  }},
  calc:{draw(){
    if(T<CT('c1')){const a=L('c0');
      stampCard(560,450,1.05,clamp(a*4,0,10));coffeeCup(1060,450,.7,{free:1,label:'FREE',sleeve:'#d62f2f',alpha:P(a,.8,.3)});
      text('모두가 끝까지 채운다고 크게 잡으면',1500,330,{f:'D',s:40,c:C.dim,alpha:P(a,.2,.3),max:700});
      text('3,000잔 ÷ 10',1500,440,{f:'D',s:56,alpha:P(T,FR('c0',.5),.3)});text('공짜 300잔',1500,560,{f:'D',s:90,c:'#d9a066',alpha:P(T,FR('c0',.7),.3)});
      srcLine('예시 가정 · 실제로 끝까지 채우는 손님 비율은 공식 통계가 없다 (크게 잡은 값)');return;}
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('×'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} × ${n2.replace('=','')} =`;bigS='120,000';}else if(n2!==undefined){small=`${fmt(n1)} ×`;bigS=n2||fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('공짜 한 잔 재료비 400원 × 300잔',1350,250,{f:'D',s:54,c:C.gold,alpha:P(a,.2,.3),max:1000});text('도장으로 나가는 한 달 돈',1350,345,{s:36,w:900,alpha:P(a,.4,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{const c2=L('c2');
        text('도장 공짜 300잔',1000,450,{a:'left',f:'D',s:40,alpha:P(c2,0,.3)});const q=K('c2',0);if(q<0)text('?',1060,520,{f:'D',s:56,c:C.gold});else hbar(1000,520,620,76,12,95,'#d9a066','12만 원',{s:50,k:E.out(P(q,0,.5))});
        if(L('c3')>=0){text('10% 할인',1000,620,{a:'left',f:'D',s:40});const r=K('c3',0);if(r<0)text('?',1060,690,{f:'D',s:56,c:C.gold});else hbar(1000,690,620,76,90,95,C.red,'90만 원',{s:50,k:E.out(P(r,0,.6))});
          if(T>FR('c3',.7))stampBox('7.5배 차이',1500,810,T-FR('c3',.7),{s:60,c:C.gold,bg:'rgba(40,30,0,.9)'});}}}
    if(dt>=0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 공짜 한 잔은 400원 ── */
  stamp:{draw(){
    sub('d1','d1',lt=>{stampCard(560,460,.9,10);coffeeCup(1000,470,.6,{free:1,label:'FREE',sleeve:'#d62f2f'});text('12만 vs 90만, 왜?',1460,470,{f:'D',s:80,c:C.gold,alpha:P(lt,.3,.3)});});
    sub('d2','d2',()=>{text('10% 할인: 3,000원에서 300원을 깎으면',960,170,{f:'D',s:52,c:C.gold});
      cupStack(560,830,560,{cut:T>FR('d2',.35)?300:0});
      if(T>FR('d2',.35))text('−300원',800,280,{a:'left',f:'D',s:60,c:C.red,alpha:P(T,FR('d2',.35),.3)});
      if(T>FR('d2',.6))group(1360,520,1,0,P(T,FR('d2',.6),.3),()=>{panel(-400,-130,800,260,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('사장님 몫',0,-50,{s:40,w:900,c:C.dim});text('1,000원 → 700원',0,40,{f:'D',s:76,c:C.red});});});
    sub('d3','d3',()=>{text('공짜 한 잔을 하나 더 만들 때 새로 드는 돈',960,170,{f:'D',s:50,c:C.gold});
      cupStack(560,830,560,{on:k=>k==='mat'?1:(k==='own'?0:.15)});
      ['rent','alba','etc'].forEach((k,i)=>{const y=[640,520,420][i];if(T>FR('d3',.25))text('이미 냄',830,y,{a:'left',f:'D',s:40,c:C.dim,alpha:P(T,FR('d3',.25+i*.08),.3)});});
      const q=K('d3',0);group(1420,520,1,0,1,()=>{text('새로 드는 돈',0,-110,{s:44,w:900,c:C.dim});if(q<0)text('?',0,20,{f:'D',s:120,c:C.gold});else group(0,20,lerp(1.5,1,E.out(P(q,0,.3))),0,1,()=>text('재료 400원',0,0,{f:'D',s:96,c:'#d9a066'}));});});
    sub('d4','d4b',()=>{text('한 잔 더 팔면 사장님에게 남는 돈',960,180,{f:'D',s:54,c:C.gold});
      text('1,000원',560,420,{f:'D',s:90,c:'#c9ced9'});if(T>FR('d4',.3)){ctx.save();ctx.strokeStyle=C.red;ctx.lineWidth=10;line(390,420,730,410);ctx.restore();text('(층으로 나눈 몫)',560,510,{s:34,w:900,c:C.dim});}
      text('3,000 − 400 =',1260,330,{f:'D',s:56,alpha:P(T,FR('d4',.5),.3)});big('d4',0,1260,460,'2,600원',{f:'D',s:140,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(L('d4b')>=0)stampBox('🔑 오늘 계산의 열쇠: 2,600원',960,720,L('d4b'),{s:60,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('한 잔 더 = 월세·알바·전기는 그대로, 재료만 더 든다 (단순 계산)');});
    sub('d5','d6',()=>{text('예시 카페 사장님 한 달 몫',960,170,{f:'D',s:54,c:C.gold});
      text('도장 없음',620,320,{a:'right',f:'D',s:44});hbar(660,320,1000,86,300,330,'#5b6275','300만 원',{s:50,lc:'#c9ced9'});
      text('도장 (공짜 300잔)',620,460,{a:'right',f:'D',s:44,c:'#d9a066'});const q=K('d5',0);if(q<0)text('?',720,460,{f:'D',s:56,c:C.gold});else hbar(660,460,1000,86,288,330,C.green,'288만 원',{s:50,k:E.out(P(q,0,.6))});
      text('10% 할인',620,600,{a:'right',f:'D',s:44,c:C.red});const r=K('d5',1);if(r<0)text('?',720,600,{f:'D',s:56,c:C.gold});else hbar(660,600,1000,86,210,330,C.red,'210만 원',{s:50,k:E.out(P(r,0,.6))});
      if(L('d6')>=0&&T>FR('d6',.5))stampBox('손님 혜택은 비슷, 빠지는 돈은 12만 vs 90만',960,770,T-FR('d6',.5),{s:46,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('예시 계산 · 도장은 공짜 잔이 모두 새로 팔린 잔일 때(재료비만) · 할인은 900만 × 10%');});
  }},
  /* ── 어차피 올 단골 ── */
  regular:{draw(){
    sub('r1','r2',lt=>{text('숨은 가정',960,280,{f:'D',s:90,c:C.gold,alpha:P(lt,0,.3)});
      if(L('r2')>=0)bubble(960,520,1400,170,'공짜 한 잔 = 원래는 안 팔렸을 한 잔?',{s:60,tail:false,alpha:P(L('r2'),0,.3)});});
    sub('r3','r3',lt=>{person(340,560,2.6,'#c9ced9',1);text('매일 아침 출근길 단골',340,760,{f:'D',s:40,c:C.gold});
      text('도장이 있든 없든 매일 온다',1180,230,{f:'D',s:52,alpha:P(lt,.3,.3)});
      for(let d=0;d<30;d++){const x=760+(d%10)*86,y=360+Math.floor(d/10)*120;const k=P(lt,.4+d*.04,.15);ctx.fillStyle='rgba(255,255,255,.08)';rr(x-36,y-46,72,92,10);ctx.fill();if(k>0)coffeeCup(x,y,.24,{alpha:k});}
      srcLine('예시 · 한 달 30일');});
    sub('r4','r5b',()=>{
      if(L('r5')<0){text('열한 번째 잔을 공짜로 주면',960,170,{f:'D',s:54,c:C.gold});
        for(let i=0;i<11;i++)coffeeCup(180+i*156,380,.48,{free:i===10,sleeve:i===10?'#d62f2f':null,label:i===10?'0':'3천',ls:40});
        group(960,610,1,0,P(T,FR('r4',.25),.3),()=>{panel(-700,-110,1400,220,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('원래 받았을 3,000원을 못 받는다 · 재료비는 어차피 든다',0,-40,{s:36,w:900,max:1340});const q=K('r4',0);text(q>=0?'빠지는 돈 3,000원':'?',0,40,{f:'D',s:64,c:q>=0?C.red:C.gold});});}
      else{text('공짜 300잔이 전부 원래 올 단골에게 가면',960,170,{f:'D',s:52,c:C.gold});
        text('300잔 × 3,000원',560,360,{f:'D',s:56});big('r5',0,560,480,'90만 원',{f:'D',s:110,c:C.red});
        text('10% 할인',1360,360,{f:'D',s:56});text('90만 원',1360,480,{f:'D',s:110,c:C.red,alpha:P(T,FR('r5',.6),.3)});
        if(T>FR('r5',.6))text('=',960,470,{f:'D',s:120});
        if(L('r5b')>=0)pill('손님 입장: 열한 잔에 3만 원 = 사실상 9.1% 할인',960,700,{s:38,bg:'rgba(255,230,150,.95)',alpha:P(L('r5b'),0,.3)});}
      srcLine('예시 계산 · 단골이 공짜 잔 대신 돈을 냈을 3,000원이 빠진다');});
    sub('r6','r8',()=>{text('도장의 본전',960,165,{f:'D',s:56,c:C.gold});
      // 저울
      const tilt=L('r7')>=0?0:-.08;group(960,470,1,tilt,1,()=>{ctx.strokeStyle='#c9ced9';ctx.lineWidth=10;line(-520,0,520,0);
        group(-420,0,1,-tilt,1,()=>{ctx.strokeStyle='#c9ced9';ctx.lineWidth=4;line(-140,0,0,-0);line(-140,0,-140,90);line(140,0,140,90);ctx.fillStyle='rgba(255,77,77,.2)';rr(-200,90,400,150,20);ctx.fill();text('도장 한 장에 거는 돈',0,130,{s:30,w:900,c:C.dim});text('최대 3,000원',0,190,{f:'D',s:50,c:C.red});});
        group(420,0,1,-tilt,1,()=>{ctx.fillStyle='rgba(53,224,138,.2)';rr(-200,90,400,150,20);ctx.fill();text('한 번 더 오면',0,130,{s:30,w:900,c:C.dim});text('+2,600원',0,190,{f:'D',s:50,c:C.green});});});
      ctx.fillStyle='#c9ced9';ctx.beginPath();ctx.moveTo(960,470);ctx.lineTo(920,600);ctx.lineTo(1000,600);ctx.closePath();ctx.fill();
      if(L('r6')>=0&&L('r7')<0)pill('도장 때문에 한 번 더 온 손님 = 한 잔에 2,600원',960,300,{s:36,bg:'rgba(200,255,225,.95)'});
      const q=K('r7',0);if(L('r7')>=0)text(q>=0?'3,000 ÷ 2,600 = 1.15번':'3,000 ÷ 2,600 = ?',960,300,{f:'D',s:60,c:q>=0?C.gold:'#fff'});
      if(L('r8')>=0)stampBox('가게 전체: 한 달 347잔 · 하루 약 12잔 더',960,800,L('r8'),{s:50,c:C.green,bg:'rgba(0,40,20,.9)'});
      srcLine('90만 ÷ 2,600원 = 346.2 → 347잔 · ÷ 30일 = 11.6잔 (단순 계산)');});
    sub('r9','r9',lt=>{stampCard(560,460,.9,10);text('도장의 값은',1400,330,{f:'D',s:60,c:C.dim,alpha:P(lt,.2,.3)});text('공짜 한 잔이 아니라',1400,440,{f:'D',s:60,alpha:P(lt,.5,.3)});text('한 번 더 왔느냐',1400,570,{f:'D',s:84,c:C.gold,alpha:P(lt,.9,.3)});});
  }},
  /* ── 원두값 ── */
  bean:{draw(){
    sub('b1','b1',lt=>{for(let i=0;i<40;i++)beanDot(300+(i%10)*140+(i%3)*14,300+Math.floor(i/10)*120,30*E.back(P(lt,i*.02,.3))+.01,i*.7);text('원두값이 오르면?',960,800,{f:'D',s:72,c:C.gold,alpha:P(lt,.3,.3)});});
    sub('b2','b3',()=>{text('원두와 커피값 (2025년 보도)',960,165,{f:'D',s:52,c:C.gold});
      text('아라비카 원두 · 연초 대비',720,320,{a:'right',f:'D',s:40});const q=K('b2',0);if(q<0)text('?',800,320,{f:'D',s:56,c:C.gold});else hbar(760,320,800,90,19.95,25,'#d9a066','+19.95%',{s:54,k:E.out(P(q,0,.6))});
      if(T>FR('b2',.4))text('2025.10.31 · 1톤 8,643달러',760,390,{a:'left',s:30,w:900,c:C.dim});
      if(L('b3')>=0){text('커피(외식) 물가 · 1년 전 대비',720,500,{a:'right',f:'D',s:40});const r=K('b3',0);if(r<0)text('?',800,500,{f:'D',s:56,c:C.gold});else hbar(760,500,800,90,14.7,25,C.red,'+14.7%',{s:54,k:E.out(P(r,0,.6))});
        if(T>FR('b3',.6))group(960,700,1,0,P(T,FR('b3',.6),.3),()=>{pill('한 저가 브랜드 아메리카노 1,500원 → 1,700원',0,0,{s:38,bg:'rgba(255,255,255,.92)'});});}
      srcLine('헤럴드경제 2025.11.3 (aT 식품산업통계정보 · 통계청 2025년 10월 소비자물가동향)');});
    sub('b4','b4',()=>{text('원두가 아메리카노 값에서 차지하는 비중',960,165,{f:'D',s:52,c:C.gold});
      cupStack(560,820,520,{on:()=>0,labels:false});const q=K('b4',0);
      ctx.fillStyle='#5b3a24';const hb=520*.047;ctx.fillRect(560-170,820-hb,340,hb);
      text(q>=0?'약 5%':'?',560,500,{f:'D',s:110,c:q>=0?'#d9a066':C.gold});
      group(1360,480,1,0,P(T,FR('b4',.5),.3),()=>{panel(-420,-150,840,300,{bg:'rgba(6,13,32,1)',bd:'#d9a066',lw:5});text('4,700원짜리 두 샷',0,-80,{s:40,w:900,c:C.dim});text('원두 222원 = 4.7%',0,10,{f:'D',s:64,c:'#d9a066'});text('원두 10g = 111원으로 계산',0,90,{s:32,w:900,c:C.dim});});
      srcLine('한국소비자단체협의회 추정 (파이낸셜뉴스 2025.9.15) · 업계는 이 산정 방식에 반론');});
    sub('b5','b5',()=>{text('우리 카페 3,000원에서는',960,165,{f:'D',s:54,c:C.gold});
      text('원두 222원 = 7.4%',560,330,{f:'D',s:60,c:'#d9a066'});text('원두값 +20%',560,450,{f:'D',s:52});text('한 잔에 약 +44원',560,540,{f:'D',s:56,c:C.red,alpha:P(T,FR('b5',.45),.3)});
      text('× 3,000잔',1360,330,{f:'D',s:56,alpha:P(T,FR('b5',.6),.3)});big('b5',0,1360,470,'13만 3,200원',{f:'D',s:96,c:C.red});
      srcLine('예시 계산 · 222 × 0.2 = 44.4원 × 3,000잔');});
    sub('b6','b7',()=>{text('원두값 20% vs 단골',960,165,{f:'D',s:54,c:C.gold});
      text('원두값 +20%',640,330,{a:'right',f:'D',s:44,c:'#d9a066'});hbar(680,330,900,86,13.32,15,'#d9a066','13만 3,200원',{s:46});
      text('단골 한 명',640,470,{a:'right',f:'D',s:44,c:C.green});hbar(680,470,900,86,6.5,15,C.green,'6만 5,000원',{s:46,k:E.out(P(T,FR('b6',.4),.6))});
      if(T>FR('b6',.4))text('한 달 25번 × 2,600원',680,540,{a:'left',s:30,w:900,c:C.dim});
      const q=K('b7',0);if(L('b7')>=0){text('단골 두 명',640,630,{a:'right',f:'D',s:44,c:C.red});if(q<0)text('?',740,630,{f:'D',s:56,c:C.gold});else hbar(680,630,900,86,13,15,C.red,'13만 원',{s:46,k:E.out(P(q,0,.6))});}
      if(q>=0)stampBox('원두값 20% ≈ 단골 두 명',1400,780,q,{s:48,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 카페 수 (어두운 장) ── */
  market:{draw(){
    sub('m1','m1',lt=>{for(let i=0;i<9;i++)cafeFront(260+(i%3)*700,300+Math.floor(i/3)*230,.24,{alpha:P(lt,i*.06,.3)});text('옆 가게는 몇 곳?',960,860,{f:'D',s:60,c:C.gold,alpha:P(lt,.4,.3)});});
    sub('m2','m3',()=>{text('전국 커피음료점 (국세통계)',960,165,{f:'D',s:52,c:C.gold});
      text('2025년 4월',600,330,{a:'right',f:'D',s:44,c:C.dim});hbar(640,330,900,90,95250,100000,'#9aa4b8','9만 5,250곳',{s:50,lc:'#c9ced9'});
      text('2026년 4월',600,470,{a:'right',f:'D',s:44});const q=K('m2',0);if(q<0)text('?',720,470,{f:'D',s:56,c:C.gold});else hbar(640,470,900,90,93551,100000,C.red,'9만 3,551곳',{s:50,k:E.out(P(q,0,.6))});
      if(T>FR('m2',.7))stampBox('1년 새 −1,699곳 (−1.8%)',1260,620,T-FR('m2',.7),{s:50,c:C.red,bg:'rgba(40,0,0,.9)'});
      if(L('m3')>=0)pill('2024년 1분기 처음 감소 → 2년 연속 감소',960,760,{s:36,bg:'rgba(255,255,255,.92)',alpha:P(L('m3'),0,.3)});
      srcLine('세계일보 2026.10.9 (국세청 국세통계포털)');});
    sub('m4','m4',()=>{text('카페 생존율 (2023년 기준)',960,165,{f:'D',s:54,c:C.gold});
      [['1년',83.5,FR('m4',.45)],['3년',53.2,FR('m4',.6)],['5년',34.6,KT('m4',0)]].forEach(([l,v,t],i)=>{const x=560+i*400,base=760,h=v*4.6,k=E.out(P(T,t,.5));if(T<t){text('?',x,base-120,{f:'D',s:80,c:C.gold});text(l+' 뒤',x,base+44,{f:'D',s:40});return;}
        vCash(x-110,base-h*k,220,h*k,i===2?C.red:'#9aa4b8');text(v+'%',x,base-h-36,{f:'D',s:56,c:i===2?C.red:'#c9ced9',alpha:k});text(l+' 뒤',x,base+44,{f:'D',s:40});});
      if(L('m4')>=0&&T>KT('m4',0)+.5)pill('세 곳이 열면 5년 뒤 한 곳 남짓',1560,300,{s:32,bg:'rgba(255,200,200,.95)'});
      srcLine('국세청 100대 생활업종 생존율 (세계일보 2026.10.9 인용)');});
    sub('m5','m5b',()=>{text('국내 커피산업 규모 (제품 판매액 + 수출)',960,165,{f:'D',s:50,c:C.gold});
      text('2018년',600,330,{a:'right',f:'D',s:44,c:C.dim});hbar(640,330,900,90,2.755,4,'#9aa4b8','',{});
      text('2024년',600,470,{a:'right',f:'D',s:44});const q=K('m5',0);if(q<0)text('?',720,470,{f:'D',s:56,c:C.gold});else{hbar(640,470,900,90,3.7359,4,C.green,'',{k:E.out(P(q,0,.6))});text('3조 7,359억 원 (+35.6%)',1080,560,{f:'D',s:48,c:C.green,alpha:P(q,.3,.3)});}
      if(L('m5b')>=0)pill('원두·커피믹스 같은 제품 판매액 = 카페 매출과 다르다',960,700,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('m5b'),0,.3)});
      srcLine('농식품부·한국농촌경제연구원 2026.8 분석 (세계일보 2026.10.9 인용) · 2018년 막대는 +35.6% 에서 거꾸로 그림');});
    sub('m6','m6',lt=>{['시장은 커지고','가게는 줄고','다투는 건 같은 단골의 하루 한 잔'].forEach((s,i)=>text(s,960,330+i*140,{f:'D',s:66,c:i===2?C.gold:'#fff',alpha:P(lt,.2+i*.5,.3),max:1800}));});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('예시 카페 사장님 한 달 몫 · 하나씩만 바꿔 보면',960,165,{f:'D',s:44,c:C.gold,alpha:P(a,0,.3),max:1800});
    if(T<CT('l2'))text('바꿀 수 있는 숫자는?',960,500,{f:'D',s:90,alpha:P(a,.2,.3)});
    const rows=[['지금',300,CT('l1')+1.2,'300만','l1'],['값 +200원',360,KT('l2',0),'360만','l2'],['하루 10잔 덜',222,KT('l3',0),'222만','l3'],['원두값 +20%',287,KT('l4',0),'287만','l4'],['도장 · 새 손님',288,KT('l5',0),'288만','l5'],['도장 · 원래 단골',210,KT('l5',1),'210만','l5']];
    const Z=560,SCL=3.0;
    if(T>=CT('l1')+1){ctx.save();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;line(Z,215,Z,760);ctx.restore();}
    if(T>=CT('l2')){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(Z+300*SCL,215,Z+300*SCL,760);ctx.restore();}
    rows.forEach(([l,v,t,lab,id],i)=>{if(T<CT('l1')+1.1)return;if(L(id)<0)return;const y=260+i*88;const bad=v<300;text(l,60,y,{a:'left',s:36,w:900,max:480,c:bad?'#ffb3b3':'#fff'});
      if(T<t){text('?',Z+60,y,{f:'D',s:52,c:C.gold});return;}const k=E.out(P(T,t,.6));
      const w=Math.max(6,v*SCL*k),col=bad?C.red:i===0?'#5b6275':C.green;ctx.fillStyle=col;rr(Z,y-30,w,60,14);ctx.fill();
      text(lab,Z+w+18,y+2,{a:'left',f:'D',s:44,c:col==='#5b6275'?'#c9ced9':col,alpha:k});});
    if(L('l6')>=0){group(960,820,1,0,P(L('l6'),0,.3),()=>{panel(-760,-46,1520,92,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text(L('l6b')>=0?'가장 큰 손잡이 = 원두가 아니라 하루 잔 수':'하루 10잔(−78만) ≈ 원두값 20%(−13만)의 여섯 배',0,4,{f:'D',s:40,c:C.gold,max:1480});});}
    else if(T>=CT('l2'))srcLine('예시 계산 · 한 번에 하나씩 · 기준 하루 100잔 · 한 잔 더 = 2,600원',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('쿠폰을 만들기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','한 잔 재료비','원두 + 컵 + 얼음, 한 잔 단위로','오늘 카페: 400원'],['k3','한 잔 더 팔면 남는 돈','값 − 재료비','오늘 카페: 2,600원'],['k4','하루 본전 잔 수','고정비 ÷ 한 잔 더 남는 돈','오늘 카페: 하루 62잔'],
      ['k5','도장이 데려온 손님','원래 매일 오던 손님은 몇 명?','새 손님 400원 · 단골 3,000원'],['k6','원두 비중','원두가 한 잔 값의 몇 %?','오늘 카페: 7.4%']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(L('k4')>=0&&ov<0&&L('k5')<0)srcLine('480만 ÷ 2,600원 = 1,846잔 ÷ 30일 = 61.5 → 하루 62잔 (사장님 몫 0원 기준)');
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-760,-280,1520,540,{bg:'rgba(6,13,32,1)',bd:C.gold});text('아메리카노 4,000원 · 재료비 500원 · 하루 80잔 · 30일',0,-200,{f:'D',s:42,max:1440});text('월세·알바·전기 고정비 600만 원 → 한 달 몫은?',0,-140,{f:'D',s:40,max:1440});
      const b=L('k7b');text('(4,000 − 500) × 2,400잔 = 840만 원',0,-50,{f:'D',s:46,c:b>=0?C.gold:'#fff',alpha:b>=0?1:0,max:1440});
      if(b>=0)text('− 고정비 600만 원',0,30,{f:'D',s:46,alpha:P(T,FR('k7b',.55),.3),max:1440});
      const k=K('k7b',0);if(k>=0)text('240만 원',0,140,{f:'D',s:100,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});else text('?',0,140,{f:'D',s:110,c:C.gold});
      if(L('k7c')>=0)text('본전: 600만 ÷ 3,500원 = 1,715잔 → 하루 약 58잔',0,232,{s:34,w:900,c:'#6FD3FF',alpha:P(L('k7c'),0,.3)});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('아메리카노 3,000원',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      const k=P(L('z2'),0,4.5);cupStack(480,820,560,{on:kk=>clamp(k*5-LY.findIndex(g=>g.k===kk))});
      if(T>FR('z2',.75))group(1300,400,1,0,P(T,FR('z2',.75),.3),()=>{panel(-440,-120,880,240,{bg:'rgba(6,13,32,1)',bd:C.green,lw:5});text('한 잔 더 팔면 남는 돈',0,-44,{s:40,w:900,c:C.dim});text('2,600원',0,44,{f:'D',s:80,c:C.green});});
      const b=L('z2b');if(b>=0)group(1300,700,1,0,P(b,0,.3),()=>{ctx.fillStyle='#fff';rr(-520,-90,1040,180,30);ctx.fill();text('공짜 한 잔: 새 손님 400원',0,-30,{f:'D',s:44,c:'#8a5a3c',max:980});text('원래 올 단골 3,000원',0,40,{f:'D',s:44,c:'#d62f2f',max:980});});
    }else{
      cafeFront(620,500,.7);stampCard(1260,460,.55,10);drawMascot(1640,600,.55,'happy');
      stampBox('도장의 값 = 손님이 한 번 더 왔느냐',960,800,c,{s:56,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-500,-70,1000,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 도장 끝까지 채우는 손님, 몇 명 중 몇 명?',0,4,{s:36,w:900,c:C.ink,max:940});});
      const g=L('z6');if(g>=0){ctx.fillStyle=`rgba(6,13,32,${P(g,0,.3)})`;ctx.fillRect(0,0,W,H);calcLogo(960,420,1.3*E.back(P(g,.1,.4))+.001);text('비밀의 계산기',960,640,{f:'D',s:110,c:C.gold,alpha:P(g,.3,.3)});}
    }
  }},
  chap:{draw(s){
    const n=s.n,ch=s.ch,lt=T-s.t;
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,0,W,H);
    text('PART '+n,960,340,{f:'D',s:70,c:'rgba(255,255,255,.55)',alpha:P(lt,0,.3)});
    group(960,480,lerp(1.15,1,E.out(P(lt,0,.5))),0,P(lt,.1,.3),()=>text(ch,0,0,{f:'D',s:110,c:C.gold,glow:'rgba(255,197,49,.45)',max:1700}));
    ctx.fillStyle=C.gold;ctx.fillRect(960-400*E.out(P(lt,.2,.6)),570,800*E.out(P(lt,.2,.6)),6);
    drawMascot(960,790,.6,'happy',{alpha:P(lt,.3,.3)});
  }},
  end:{draw(){
    const lt=T-TL.voiceEnd;
    drawMascot(420,470,1.1,'wave');
    text('다음 계산서도',420,780,{f:'D',s:70,c:C.gold,alpha:P(lt,.3,.3)});text('같이 두드려요',420,870,{f:'D',s:70,c:'#fff',alpha:P(lt,.5,.3)});
    ctx.save();ctx.setLineDash([18,12]);ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;rr(900,170,880,495,24);ctx.stroke();ctx.beginPath();ctx.arc(1340,860,110,0,7);ctx.stroke();ctx.restore();
    text('다음 영상',1340,417,{s:44,w:900,c:'rgba(255,255,255,.35)'});text('구독',1340,862,{s:40,w:900,c:'rgba(255,255,255,.35)'});
  }},
};
