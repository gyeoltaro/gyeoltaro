/* ════════════════════════════════════════════════════════════════════
   장면 (LF.20 편의점 담배 한 갑 4,500원 계산서 — 매출 1위, 몫은 꼴찌 · 세금에도 붙는 카드 수수료 · 값을 정할 수 없는 물건) — 수치·출처는 docs/longform-ep20.md
   중심 그림: 4,500원 = 100원짜리 동전 45개. 세금·부담금 33개(3,323원) · 제조사·유통 8개(772원) · 사장님 몫 4개(405원).
   반전: 예시 가게 매출의 40%가 담배인데, 물건에서 남는 돈으로는 16.7%. 카드 수수료는 세금까지 든 4,500원에 붙고, 값은 공고 가격 그대로 11년째.
   ════════════════════════════════════════════════════════════════════ */
const CG=[ // 동전 45개 (순서대로)
  {k:'tax',name:'세금·부담금',n:33,col:'#FF4D4D'},
  {k:'maker',name:'제조사·유통',n:8,col:'#6FA8FF'},
  {k:'own',name:'사장님 몫',n:4,col:'#35E08A'},
];
const CGK=Object.fromEntries(CG.map(s=>[s.k,s]));
const SEQ=['4','0','5','×','1','2','0','='];   // 405 × 120 = 48,600 (0 개수: 405 하나, 120 하나)
const TAXI=[['담배소비세',1007],['국민건강증진부담금',841],['개별소비세',594],['지방교육세',443],['부가가치세',409],['폐기물부담금·연초 기금',29]];
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}
function bubble(x,y,w,h,str,o={}){group(x,y,o.k??1,o.rot||0,o.alpha??1,()=>{ctx.fillStyle='#fff';rr(-w/2,-h/2,w,h,30);ctx.fill();if(o.tail!==false){ctx.beginPath();ctx.moveTo(-w*.2,h/2);ctx.lineTo(-w*.26,h/2+50);ctx.lineTo(-w*.1,h/2);ctx.fill();}if(str)text(str,0,4,{f:'D',s:o.s||60,c:o.c||C.ink,max:w-60});});}
function person(x,y,s,col,al=1){if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-48*s,22*s,0,7);ctx.fill();rr(x-30*s,y-20*s,60*s,70*s,22*s);ctx.fill();ctx.restore();}
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:32,w:900,c:'#3a4256',max:250});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433'});});
});}

/* 담배 한 갑 (상표 없음 · 경고 그림 칸은 회색 상자) */
function cigPack(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';rr(-104,-162,226,346,16);ctx.fill();
  ctx.fillStyle='#f4f1e8';rr(-112,-172,224,344,16);ctx.fill();
  ctx.fillStyle=o.col||'#2b4c7e';rr(-112,-172,224,96,16);ctx.fill();ctx.fillRect(-112,-110,224,34);
  ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;line(-112,-76,112,-76);
  text('담배',0,-20,{f:'D',s:56,c:'#2b2b2b'});text('20개비',0,34,{s:24,w:800,c:'#6b6b6b'});
  ctx.fillStyle='#8a8f99';rr(-96,64,192,92,10);ctx.fill();text('경고 그림',0,110,{s:24,w:900,c:'#eef0f4'});
  if(o.price)group(70,-200,1,.08,1,()=>{ctx.fillStyle='#ffd23f';rr(-110,-40,220,80,14);ctx.fill();text(o.price,0,3,{f:'D',s:44,c:'#1d2433',max:200});});
});}
/* 동네 편의점 (상표 없음) */
function cvsFront(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,282,460,26,0,0,7);ctx.fill();
  ctx.fillStyle='#2a3150';rr(-420,-300,840,580,18);ctx.fill();
  ctx.fillStyle='#e9eef7';rr(-420,-300,840,96,14);ctx.fill();text(o.name||'○○ 편의점',0,-252,{f:'D',s:56,c:'#2a3150'});
  for(let i=0;i<14;i++){ctx.fillStyle=i%2?'#2bb3a3':'#ff8c42';ctx.fillRect(-420+i*60,-204,60,24);}
  ctx.save();if(!o.dark){ctx.shadowColor='rgba(255,224,140,.6)';ctx.shadowBlur=36;}ctx.fillStyle=o.dark?'#3a4256':'#fff3c4';rr(-380,-160,500,380,8);ctx.fill();ctx.restore();
  if(!o.dark){for(let r=0;r<3;r++){ctx.fillStyle='rgba(42,49,80,.35)';ctx.fillRect(-370,-112+r*112,480,10);for(let j=0;j<9;j++){ctx.fillStyle=['#ff6b6b','#4dabf7','#69db7c','#ffd43b','#b197fc'][(r*3+j)%5];rr(-360+j*52,-152+r*112,38,40,6);ctx.fill();}}
    // 계산대 뒤 담배 진열장
    ctx.fillStyle='#2b4c7e';rr(-380,170,500,50,6);ctx.fill();for(let j=0;j<16;j++){ctx.fillStyle=['#f4f1e8','#d9d4c4'][j%2];rr(-372+j*31,176,24,38,3);ctx.fill();}}
  ctx.fillStyle='#cfe8ff';rr(160,-160,220,440,8);ctx.fill();ctx.fillStyle='rgba(42,49,80,.5)';ctx.fillRect(268,-160,4,440);
  if(o.price)group(-130,-30,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-150,-60,300,120,12);ctx.fill();text('담배 한 갑',0,-24,{s:30,w:900,c:C.ink});text(o.price,0,22,{f:'D',s:46,c:'#d62f2f'});});
});}
/* 100원짜리 동전 45개 (9 × 5). fill(k) = 0~1 그 무리가 몇 개째까지 물들었나, dim(k) */
function coins45(x0,y0,cell,o={}){
  const r=cell*.44;let acc=0;const rg=CG.map(g=>{const a=acc;acc+=g.n;return [a,a+g.n*(o.fill?o.fill(g.k):0),g.col,g.k];});
  for(let i=0;i<45;i++){const cx=x0+(i%9)*cell+cell/2,cy=y0+Math.floor(i/9)*cell+cell/2;
    const g=ctx.createRadialGradient(cx-r*.3,cy-r*.3,r*.1,cx,cy,r);g.addColorStop(0,'#f1f3f7');g.addColorStop(1,'#9aa3b5');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();
    rg.forEach(([a,b,col,k])=>{const s0=Math.max(a,i),s1=Math.min(b,i+1);if(s1<=s0)return;ctx.save();if(o.dim&&o.dim(k))ctx.globalAlpha*=.25;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2+(s0-i)*Math.PI*2,-Math.PI/2+(s1-i)*Math.PI*2);ctx.closePath();ctx.fill();ctx.restore();});
    ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
    text('100',cx,cy+1,{s:r*.62,w:900,c:'rgba(20,24,40,.45)'});}
  if(o.ring)for(let i=41;i<45;i++){const cx=x0+(i%9)*cell+cell/2,cy=y0+Math.floor(i/9)*cell+cell/2;ctx.save();ctx.globalAlpha*=o.ring;ctx.strokeStyle=C.green;ctx.lineWidth=6;ctx.shadowColor=C.green;ctx.shadowBlur=20;ctx.beginPath();ctx.arc(cx,cy,r+6,0,7);ctx.stroke();ctx.restore();}
}
function cgFill(k){
  if(k==='tax'){const t0=CT('s1')+.8,t1=KT('s2',0);return t1>t0?E.out(P(T,t0,t1-t0)):P(T,t1,.4);}
  if(k==='maker')return E.out(P(T,KT('s4',0),.6));
  return E.out(P(T,KT('s5',0),.5));
}
/* 카드 단말기 */
function cardTerm(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';rr(-150,-200,316,420,30);ctx.fill();
  ctx.fillStyle='#2c3346';rr(-160,-210,320,420,30);ctx.fill();
  ctx.fillStyle='#c9e6bf';rr(-130,-180,260,120,14);ctx.fill();text(o.amt||'4,500원',110,-120,{a:'right',f:'D',s:52,c:'#1f2b1c',max:230});
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){ctx.fillStyle='#4a5470';rr(-120+c*84,-30+r*62,72,48,10);ctx.fill();}
  ctx.fillStyle='#6FD3FF';rr(-60,170,120,40,8);ctx.fill();
});}
/* 법 조문 종이 */
function lawDoc(x,y,s,o={}){group(x,y,s,o.rot??-.02,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';rr(-372,-252,760,520,8);ctx.fill();ctx.fillStyle='#f6f3ea';rr(-380,-260,760,520,8);ctx.fill();
  text('담배사업법',0,-200,{f:'D',s:54,c:'#1d1a14'});text('제18조 (담배의 판매가격)',0,-138,{s:32,w:900,c:'#6b6252'});
  ctx.fillStyle='rgba(60,50,30,.25)';for(let i=0;i<4;i++){rr(-330,-80+i*40,i%2?560:660,14,6);ctx.fill();}
  if(o.hl>0){ctx.save();ctx.globalAlpha*=o.hl;ctx.fillStyle='rgba(255,210,63,.8)';rr(-350,96,700,120,8);ctx.fill();ctx.restore();}
  text('⑤ 소매인은 공고된 판매가격으로',0,128,{s:34,w:900,c:'#1d1a14',max:680});text('담배를 판매하여야 한다.',0,180,{s:34,w:900,c:'#1d1a14',max:680});
});}
/* 5분짜리 초 시계 (알바 시간) */
function secClock(x,y,r,secs,col){
  ctx.fillStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  ctx.save();ctx.fillStyle=col;ctx.globalAlpha*=.9;ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+Math.min(secs,300)/300*Math.PI*2);ctx.closePath();ctx.fill();ctx.restore();
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();
  for(let i=0;i<5;i++){const a=-Math.PI/2+i/5*Math.PI*2;line(x+Math.cos(a)*(r-18),y+Math.sin(a)*(r-18),x+Math.cos(a)*r,y+Math.sin(a)*r);text(i+'분',x+Math.cos(a)*(r+36),y+Math.sin(a)*(r+36),{s:24,w:900,c:C.dim});}
}
/* 100% 가로 띠 두 칸 */
function split2(x,y,w,h,f,c1,c2,l1,l2,k=1){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,14);ctx.fill();const w1=w*f*k;ctx.fillStyle=c1;rr(x,y-h/2,Math.max(6,w1),h,14);ctx.fill();if(k>=1){ctx.fillStyle=c2;rr(x+w1+6,y-h/2,w-w1-6,h,14);ctx.fill();text(l1,x+w1/2,y+2,{f:'D',s:40,c:'#fff',max:Math.max(60,w1-16)});text(l2,x+w1+(w-w1)/2,y+2,{f:'D',s:40,c:'#0d1a12',max:w-w1-30});}}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o2')){
      const a=L('o1');
      cvsFront(500,500,.8*E.back(P(a,0,.5))+.001,{});
      cigPack(1180,470,1.05,{alpha:P(a,.3,.3)});
      text('한 갑',1560,300,{f:'D',s:52,c:C.dim,alpha:P(a,.3,.3)});
      big('o1',0,1560,410,'4,500원',{f:'D',s:120,c:C.gold,glow:'rgba(255,197,49,.45)'});
      if(L('o1')>=0&&T>FR('o1',.55)){text('사장님 손에',1560,560,{f:'D',s:46,c:C.dim,alpha:P(T,FR('o1',.55),.3)});big('o1',1,1560,670,'405원',{f:'D',s:130,c:C.green,glow:'rgba(53,224,138,.45)'});}
    }else if(T<CT('o3')){
      const b=L('o2');
      coins45(100,260,96,{fill:k=>k==='tax'?E.out(P(b,0,1)):0});
      text('세금·부담금',1420,320,{f:'D',s:56,c:C.dim,alpha:P(b,0,.3)});big('o2',0,1420,450,'3,323원',{f:'D',s:140,c:C.red,glow:'rgba(255,77,77,.4)'});
      if(T>FR('o2',.6))pill('값도 사장님이 못 정한다',1420,620,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('o2',.6),.3)});
      srcLine('담뱃값 4,500원 중 세금·부담금 3,323원 (파이낸셜뉴스 2025.9.6)');
    }else if(T<CT('o4')){
      const b=L('o3'),q=K('o3',0);
      text('예시 가게 · 담배가 차지하는 몫',960,170,{f:'D',s:56,c:C.gold,alpha:P(b,0,.3)});
      text('매출',360,380,{a:'right',f:'D',s:50,alpha:P(b,.2,.3)});if(b>.3)split2(400,380,1300,110,.4,'#2b4c7e','#5b6275','담배 40%','나머지 60%',E.out(P(b,.3,.6)));
      text('남는 돈',360,580,{a:'right',f:'D',s:50,alpha:P(b,.2,.3)});if(q>=0)split2(400,580,1300,110,.167,C.red,C.green,'17%','나머지 83%',E.out(P(q,0,.6)));else text('?',460,580,{f:'D',s:70,c:C.gold});
      srcLine('예시 가정 · 담배 마진율 9% (보도) · 나머지 30% (예시)');
    }else if(T<CT('o5')){
      const b=L('o4');
      cardTerm(560,470,1.1,{alpha:P(b,0,.3)});
      group(1360,420,1,0,P(b,.2,.3),()=>{panel(-420,-190,840,380,{bd:C.red});text('수수료가 붙는 돈',0,-110,{f:'D',s:50});text('4,500원 전체',0,0,{f:'D',s:100,c:C.red});text('(세금 3,323원 포함)',0,100,{s:38,w:900,c:C.dim});});
    }else{
      const k9=L('o5'),k10=L('o6');
      text('품목을 정리하기 전 꼭 볼 숫자',960,230,{f:'D',s:68,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['담뱃값·마진율 (보도)','카드 수수료율·법 조문','가게 숫자 = 예시 가정'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,380+i*580,760,{s:32,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o7');
    text('편의점 담배 한 갑 4,500원 계산서',960,220,{f:'D',s:104,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('매출 1위 · 몫은 꼴찌 · 값은 못 정한다',960,360,{s:52,w:900,alpha:P(a,.3,.3)});
    cvsFront(560,680,.5,{alpha:P(a,.2,.3),price:'4,500원'});cigPack(1130,660,.7,{alpha:P(a,.3,.3)});drawMascot(1620,690,.72,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 편의점 ── */
  setup:{draw(){
    sub('p1','p2',()=>{cvsFront(600,490,.8,{});
      if(L('p2')>=0){text('주택가 동네 편의점',1460,230,{f:'D',s:52,c:C.gold});const q=K('p2',0);
        text('하루 매출',1460,350,{f:'D',s:44,c:C.dim});text(q>=0?'135만 원':'?',1460,460,{f:'D',s:110,c:C.gold});
        if(T>FR('p2',.6))text('× 30일 = 한 달 4,050만 원',1460,590,{f:'D',s:46,alpha:P(T,FR('p2',.6),.3)});}
      srcLine('예시 가정 · 세금 제외');});
    sub('p3','p3b',()=>{text('담배 하루 120갑 (예시)',960,165,{f:'D',s:54,c:C.gold});
      const q=K('p3',0);
      for(let i=0;i<120;i++){const x=150+(i%20)*44,y=270+Math.floor(i/20)*66;const on=q>=0?P(q,i*.008,.15):0;ctx.save();ctx.globalAlpha*=on>0?lerp(.3,1,on):.25;ctx.fillStyle=on>0?'#f4f1e8':'rgba(255,255,255,.5)';rr(x,y,34,52,5);ctx.fill();ctx.fillStyle='#2b4c7e';rr(x,y,34,16,5);ctx.fill();ctx.restore();}
      text('× 4,500원',1400,330,{f:'D',s:56,c:C.dim});text(q>=0?'54만 원':'?',1400,450,{f:'D',s:110,c:C.gold});
      if(T>FR('p3',.6))stampBox('하루 매출의 40%',1400,600,T-FR('p3',.6),{s:50,c:C.gold,bg:'rgba(40,30,0,.9)'});
      if(L('p3b')>=0)pill('보도: 편의점 매출 중 담배 30~45%',960,720,{s:36,bg:'rgba(255,255,255,.92)',alpha:P(L('p3b'),0,.3)});
      srcLine('딜사이트 2023.6.19 (30~40%) · 비즈니스워치 2018.7.5 (40~45%) · 120갑은 예시');});
    sub('p4','p4',lt=>{text('나머지 81만 원',960,190,{f:'D',s:64,c:C.green});
      ['🥤','🍪','🍱','🧻','🍜'].forEach((e,i)=>emoji(e,360+i*300,450,150,{sc:E.back(P(lt,.1+i*.12,.4))+.001}));
      text('음료 · 과자 · 도시락 · 생활용품',960,660,{f:'D',s:48,alpha:P(lt,.6,.3)});});
    sub('p5','p5',lt=>{coins45(90,260,96,{});
      cigPack(1440,440,.9,{alpha:P(lt,.1,.3)});text('4,500원 = 100원 × 45개',1440,720,{f:'D',s:50,c:C.gold,alpha:P(lt,.3,.3)});});
  }},
  /* ── 4,500원 쪼개기 ── */
  cut:{draw(){
    const x0=60,y0=300,cell=96;
    coins45(x0,y0,cell,{fill:cgFill,ring:P(T,KT('s5',0),.4)});
    text('담배 한 갑 4,500원',x0+432,230,{f:'D',s:46,c:C.gold});
    const X=1420;
    sub('s1','s3',()=>{text('첫 번째: 세금·부담금',X,200,{f:'D',s:54,c:CGK.tax.col});
      TAXI.forEach(([n,v],i)=>{const t=i<3?FR('s1',.35+i*.2):FR('s2',i===5?.35:.05+(i-3)*.14);if(T<t)return;const y=290+i*66,k=P(T,t,.3);text(n,X-330,y,{a:'left',s:34,w:900,alpha:k,max:440});text(won(v)+'원',X+330,y,{a:'right',f:'D',s:40,c:'#ffb3b3',alpha:k});});
      const q=K('s2',0);if(q>=0){ctx.save();ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(X-330,690,X+330,690);ctx.restore();popText(KT('s2',0),X,750,'3,323원 · 동전 33개',{f:'D',s:66,c:CGK.tax.col});}
      if(L('s3')>=0)stampBox('4,500원의 73.8%',X,180,L('s3'),{s:50,c:C.red,bg:'rgba(40,0,0,.9)'});
      srcLine('파이낸셜뉴스 2025.9.6 (일반 궐련 4,500원 기준 · 폐기물부담금 24원 + 연초생산안정화기금 5원)');});
    sub('s4','s4',()=>{text('두 번째: 제조사·유통',X,280,{f:'D',s:58,c:'#6FA8FF'});text('만들고, 가게까지 실어 오는 쪽',X,380,{s:38,w:900,c:C.dim});
      popText(KT('s4',0),X,520,'772원 · 약 8개',{f:'D',s:88,c:'#6FA8FF'});
      srcLine('계산값: 4,500 − 3,323 − 405 = 772원 (제조 원가·이익·유통을 합친 나머지)');});
    sub('s5','s5b',()=>{text('4,500 − 3,323 − 772',X,260,{f:'D',s:46,c:C.dim});text('사장님 몫',X,360,{f:'D',s:60,c:C.green});big('s5',0,X,500,'405원',{f:'D',s:140,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(L('s5b')<0){if(T>FR('s5',.5))text('보도된 마진율 9%',X,650,{f:'D',s:48,c:C.gold,alpha:P(T,FR('s5',.5),.3)});}
      else{const b=L('s5b');[['7%','315원'],['9%','405원'],['10%','450원']].forEach(([p,v],i)=>{const k=P(b,.6+i*.4,.3);if(k>0)pill(p+' → '+v,X,640+i*76,{s:36,alpha:k,bg:i===1?'rgba(53,224,138,.95)':'rgba(255,255,255,.92)'});});}
      srcLine('마진율: 비즈니스워치 2018.7.5 "9%" · 딜사이트 2023.6.19 "제품별 7~10% 안팎"');});
  }},
  calc:{draw(){
    if(T<CT('c1')){const a=L('c0');
      coins45(90,260,96,{fill:()=>1,dim:k=>k!=='own',ring:1});
      text('405원 × 하루 120갑',1440,380,{f:'D',s:56,c:C.gold,alpha:P(a,.2,.3),max:860});text('= ?',1440,500,{f:'D',s:110,c:C.gold,alpha:P(a,.4,.3)});
      srcLine('예시 가정 · 하루 120갑');return;}
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('×'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} × ${n2.replace('=','')} =`;bigS='48,600';}else if(n2!==undefined){small=`${fmt(n1)} ×`;bigS=n2||fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:84,f:'D',c:done?'#1f8a50':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('사장님 몫 405원 × 하루 120갑',1350,250,{f:'D',s:52,c:C.gold,alpha:P(a,.2,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{const c2=L('c2');
        text('담배 하루 매출',1000,440,{a:'left',f:'D',s:38,alpha:P(c2,0,.3)});hbar(1000,500,600,64,54,60,'#2b4c7e','54만',{s:46,lc:'#8fb6ff'});
        text('담배로 남는 돈',1000,590,{a:'left',f:'D',s:38,alpha:P(c2,0,.3)});const q=K('c2',0);if(q<0)text('?',1060,650,{f:'D',s:56,c:C.gold});else hbar(1000,650,600,64,4.86,60,C.green,'4만 8,600원',{s:46,k:E.out(P(q,0,.5))});
        if(L('c3')>=0){const r=L('c3');stampBox('나머지 81만 원어치는?',1330,800,r,{s:46,c:C.gold,bg:'rgba(40,30,0,.9)'});}}}
    if(dt>=0&&L('c2')<0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 매출 1위, 몫은 꼴찌 ── */
  share:{draw(){
    sub('m1','m2',()=>{['🥤','🍺','🍪','🍙'].forEach((e,i)=>emoji(e,300+i*250,420,150,{sc:E.back(P(T,CT('m1')+.2+i*.15,.4))+.001}));
      pill('보도: 주류 평균 마진율 30% 안팎 (담배의 3배 이상)',600,640,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('m1',.55),.3)});
      text('나머지 81만 × 30%',1500,330,{f:'D',s:50,c:C.dim});text('(예시)',1500,400,{s:34,w:900,c:C.dim});big('m2',0,1500,520,'24만 3,000원',{f:'D',s:96,c:C.green,glow:'rgba(53,224,138,.4)'});
      srcLine('딜사이트 2023.6.19 · 음료·과자 30%는 예시 가정 (품목마다 다르다)');});
    sub('m3','m4b',()=>{text('예시 가게 하루',960,165,{f:'D',s:56,c:C.gold});
      text('매출 135만',380,360,{a:'right',f:'D',s:44});split2(420,360,1300,120,.4,'#2b4c7e','#5b6275','담배 54만 (40%)','나머지 81만 (60%)',1);
      const q=K('m3',0);text('남는 돈 29만 1,600',380,580,{a:'right',f:'D',s:40,max:360});if(q>=0)split2(420,580,1300,120,.167,C.red,C.green,'16.7%','나머지 24만 3,000 (83.3%)',E.out(P(q,0,.6)));else text('?',480,580,{f:'D',s:70,c:C.gold});
      if(L('m4')>=0&&L('m4b')<0)stampBox('매출 40% → 몫 17%',1240,760,L('m4'),{s:54,c:C.red,bg:'rgba(40,0,0,.9)'});
      if(L('m4b')>=0)pill('가장 많이 꺼내는 물건이 가장 적게 남긴다',960,760,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(L('m4b'),0,.3)});
      srcLine('담배 120 × 405 = 4만 8,600 · 나머지 81만 × 30% = 24만 3,000 · 4만 8,600 ÷ 29만 1,600 = 16.7%');});
    sub('m5','m6',()=>{receipt(620,480,1,[['담배 몫','145만 8천'],['나머지 몫','729만'],['합계','874만 8천','#1f8a50']],{title:'한 달 남는 돈 (예시)'});
      if(L('m6')<0){text('한 달 30일',1420,360,{f:'D',s:50,c:C.dim});text('담배 145만 8천',1420,470,{f:'D',s:64,c:C.red});text('나머지 729만',1420,570,{f:'D',s:64,c:C.green});}
      else{text('매출에선',1420,320,{f:'D',s:54,c:C.dim});text('주인공',1420,420,{f:'D',s:90,c:'#8fb6ff'});text('남는 돈에선',1420,540,{f:'D',s:54,c:C.dim});text('조연',1420,640,{f:'D',s:90,c:C.red});}});
  }},
  /* ── 카드 수수료 ── */
  card:{draw(){
    sub('f1','f2',()=>{cardTerm(480,470,1.1,{});
      if(L('f2')<0)text('카드 수수료',1340,470,{f:'D',s:96,c:C.gold});
      else{coins45(880,260,96,{fill:()=>1});ctx.save();ctx.strokeStyle='#6FD3FF';ctx.lineWidth=8;ctx.setLineDash([16,10]);rr(872,252,880,496,24);ctx.stroke();ctx.restore();
        pill('수수료 = 45개 전체에 (세금 33개 포함)',1312,800,{s:36,bg:'rgba(111,211,255,.95)',alpha:P(L('f2'),.3,.3)});}});
    sub('f3','f4',()=>{text('담배 한 갑 카드 수수료 vs 사장님 몫',960,165,{f:'D',s:52,c:C.gold});
      text('사장님 몫',500,330,{a:'right',f:'D',s:42});hbar(540,330,1000,80,405,420,C.green,'405원',{s:46});
      text('연 매출 10억 이하',500,480,{a:'right',f:'D',s:40,max:460});const q=K('f3',0);if(q<0)text('?',600,480,{f:'D',s:56,c:C.gold});else hbar(540,480,1000,80,18,420,'#6FD3FF','0.4% = 18원 (몫의 4.4%)',{s:44,k:E.out(P(q,0,.5))});
      if(L('f4')>=0){text('10억 넘고 30억 이하',500,630,{a:'right',f:'D',s:40,max:460});const r=K('f4',0);if(r<0)text('?',600,630,{f:'D',s:56,c:C.gold});else hbar(540,630,1000,80,65,420,C.red,'1.45% = 65원 (몫의 16%)',{s:44,k:E.out(P(r,0,.5))});}
      srcLine('신용카드 우대 수수료율 (2025.2 인하 뒤) · 이코노미스트 2025.2.17 · 4,500 × 0.4% = 18원 · 4,500 × 1.45% = 65원');});
    sub('f5','f7',()=>{text('하루 300만 원 파는 편의점 (예시) · 연 매출',960,165,{f:'D',s:48,c:C.gold,max:1800});
      const X0=160,SC=1500/12;
      const k=E.out(P(T,CT('f5')+.3,.8));vCash(X0,330,10.95*SC*k,120,'#5b6275');text('연 매출 10억 9,500만 원',X0+20,390,{a:'left',f:'D',s:44,alpha:k});
      const q=K('f6',0);if(q>=0){const w=3.234*SC*E.out(P(q,0,.6));ctx.save();ctx.fillStyle=C.red;rr(X0+10.95*SC-w,330,w,120,14);ctx.fill();ctx.restore();text('그중 담배 세금 약 3억 2,000만',X0+10.95*SC-3.234*SC/2,520,{f:'D',s:40,c:C.red,alpha:P(q,.3,.3)});}
      else if(L('f6')>=0)text('?',X0+10.95*SC-3.234*SC/2,520,{f:'D',s:56,c:C.gold});
      ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=6;ctx.setLineDash([14,10]);line(X0+10*SC,290,X0+10*SC,470);ctx.restore();text('우대 구간 끝 10억',X0+10*SC,265,{f:'D',s:34,c:C.gold});
      if(L('f7')>=0){const b=L('f7');text('세금을 빼면 7억 7,000만 원대 → 0.4% 구간',960,640,{f:'D',s:44,alpha:P(b,0,.3),max:1700});
        const r=K('f7',0);if(r>=0)stampBox('한 달 약 96만 원 차이',960,760,r,{s:54,c:C.red,bg:'rgba(40,0,0,.9)'});}
      srcLine('예시 계산 · 담배 40% × 73.8% = 세금 · (1.45% − 0.4%) × 10억 9,500만 = 1,149만 7,500원 (전부 신용카드로 가정)');});
    sub('f8','f9',()=>{if(L('f9')<0){bubble(960,400,1300,260,'',{k:E.back(P(L('f8'),0,.4))+.001});
        group(960,400,E.back(P(L('f8'),0,.4))+.001,0,1,()=>{text('"담뱃세·유류세 등 세금을 뺀',0,-40,{f:'D',s:52,c:C.ink,max:1200});text('판매가로 카드 수수료를 산정해 달라"',0,40,{f:'D',s:52,c:'#d62f2f',max:1200});});
        text('— 소상공인 측 요청 (2025년 2월 보도)',960,640,{s:34,w:900,c:C.dim,alpha:P(L('f8'),.5,.3)});srcLine('이코노미스트 2025.2.17 · 실제 반영 여부는 확인하지 못함');}
      else{const b=L('f9');cvsFront(560,480,.6,{});text('우리 예시 가게',1400,280,{f:'D',s:52,c:C.gold});text('연 매출 4억 9,275만',1400,390,{f:'D',s:56});text('→ 0.4% 구간',1400,480,{f:'D',s:56,c:'#6FD3FF'});
        stampBox('한 달 수수료 16만 2,000원',1400,640,b,{s:48,c:'#6FD3FF',bg:'rgba(0,20,40,.9)'});srcLine('4,050만 × 0.4% = 16만 2,000원 (예시 · 전부 신용카드로 가정)');}});
  }},
  /* ── 값을 정할 수 없는 물건 ── */
  price:{draw(){
    sub('q1','q1',lt=>{cigPack(560,480,1.1,{price:'4,500원'});drawMascot(1380,520,.9,'think',{alpha:P(lt,.1,.3)});});
    sub('q2','q3',()=>{const q=K('q2',0);lawDoc(620,470,1,{hl:q>=0?E.out(P(q,0,.4)):0});
      text('값 = 공고 가격 그대로',1460,330,{f:'D',s:52,c:C.gold});
      if(L('q3')>=0){['할인 ✕','인상 ✕'].forEach((s,i)=>pill(s,1460,460+i*100,{s:48,bg:'rgba(255,120,120,.95)',alpha:P(L('q3'),.1+i*.3,.3)}));text('어기면 과태료 대상',1460,680,{f:'D',s:44,c:C.red,alpha:P(L('q3'),.8,.3)});}
      srcLine('담배사업법 제18조 ⑤ · 과태료 제28조 (법률 제8852호 조문 · 위키문헌) — 현행 조문 번호는 개정으로 다를 수 있다');});
    sub('q4','q4b',()=>{text('담배 한 갑 값',960,165,{f:'D',s:56,c:C.gold});
      text('2014년까지',560,360,{a:'right',f:'D',s:44,c:C.dim});hbar(600,360,900,90,2500,5000,'#5b6275','2,500원',{s:50,lc:'#c9ced9'});
      text('2015년부터',560,520,{a:'right',f:'D',s:44});hbar(600,520,900,90,4500,5000,'#2b4c7e','4,500원',{s:50,lc:'#8fb6ff'});
      const q=K('q4',0);if(q>=0&&L('q4b')<0)stampBox('11년째 그대로',1300,700,q,{s:62,c:C.gold,bg:'rgba(40,30,0,.9)'});
      if(L('q4b')>=0)pill('보도: OECD 평균의 절반 수준 (평균 약 9,869원, 2023년 기준)',960,700,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('q4b'),0,.3)});
      srcLine('파이낸셜뉴스 2025.9.6 (2015년 2,500 → 4,500원) · 뉴시스 2026.3.3 (OECD 비교)');});
    sub('q5','q6',()=>{
      if(L('q6')<0){text('최저시급',960,165,{f:'D',s:56,c:C.gold});
        text('2015년',560,360,{a:'right',f:'D',s:46,c:C.dim});hbar(600,360,900,90,5580,11000,'#5b6275','5,580원',{s:50,lc:'#c9ced9'});
        text('2026년',560,520,{a:'right',f:'D',s:46});hbar(600,520,900,90,10320,11000,C.red,'1만 320원',{s:50,k:E.out(P(L('q5'),.5,.6))});
        srcLine('최저임금위원회 고시 · 2015년 5,580원 · 2026년 1만 320원');}
      else{text('담배 한 갑 몫 405원으로 쓸 수 있는 알바 시간',960,165,{f:'D',s:48,c:C.gold,max:1800});
        secClock(480,470,170,261,'#8fb6ff');text('2015년',480,720,{f:'D',s:44,c:C.dim});text('4분 21초',480,795,{f:'D',s:60,c:'#8fb6ff'});
        const q=K('q6',0);group(0,0,1,0,q>=0?1:.35,()=>{secClock(1440,470,170,q>=0?141*E.out(P(q,0,.6)):0,C.red);text('지금',1440,720,{f:'D',s:44,c:C.dim});text(q>=0?'2분 21초':'?',1440,795,{f:'D',s:60,c:q>=0?C.red:C.gold});});
        srcLine('405 ÷ 5,580 × 60 = 4.35분 · 405 ÷ 10,320 × 60 = 2.35분');}});
    sub('q7','q7',lt=>{group(560,450,1,0,P(lt,0,.3),()=>{panel(-340,-170,680,340,{bd:'#8fb6ff'});text('405원의 알바 시간',0,-90,{f:'D',s:46});text('4분 21초 → 2분 21초',0,30,{f:'D',s:60,c:'#8fb6ff',max:620});});
      group(1360,450,1,0,P(lt,.4,.3),()=>{panel(-340,-170,680,340,{bd:C.red});text('오르는 비용',0,-90,{f:'D',s:46});text('손님에게 못 넘긴다',0,30,{f:'D',s:58,c:C.red,max:620});});
      if(T>FR('q7',.6))stampBox('값을 못 정하는 물건',960,760,T-FR('q7',.6),{s:56,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 그래도 못 빼는 이유 (어두운 장) ── */
  why:{draw(){
    sub('n1','n1',lt=>{cvsFront(560,480,.62,{dark:1});bubble(1360,420,820,180,'담배를 빼 버리면?',{k:E.back(P(lt,.1,.4))+.001,s:64});});
    sub('n2','n2b',lt=>{cvsFront(500,480,.6,{});
      person(1250,560,2.2,'#8fb6ff',P(lt,0,.3));cigPack(1450,420,.45,{alpha:P(lt,.3,.3)});
      if(T>FR('n2',.5))['🥤','🍪'].forEach((e,i)=>emoji(e,1590+i*130,420,100,{sc:E.back(P(T,FR('n2',.5)+i*.2,.4))+.001}));
      if(L('n2b')>=0)['🥛','🍜','🔋'].forEach((e,i)=>emoji(e,1300+i*170,700,100,{sc:E.back(P(L('n2b'),i*.2,.4))+.001}));});
    sub('n3','n4',()=>{text('담배 손님 하루 120명 · 세 명 중 한 명이 같이 산다면 (예시)',960,165,{f:'D',s:44,c:C.gold,max:1800});
      const q=K('n3',0);
      for(let i=0;i<120;i++){const x=110+(i%20)*44,y=290+Math.floor(i/20)*80;const hl=i%3===2;const on=hl?P(T,FR('n3',.35)+i*.006,.2):0;person(x+4,y+14,.5,on>0?'#35E08A':'rgba(255,255,255,.3)',1);}
      if(L('n4')<0){text('40명 × 600원',1460,330,{f:'D',s:56,c:C.dim});text('(2,000원 × 30%)',1460,400,{s:34,w:900,c:C.dim});big('n3',0,1460,520,'2만 4,000원',{f:'D',s:96,c:C.green,glow:'rgba(53,224,138,.4)'});}
      else{const b=L('n4');text('하나가 남기는 돈',1460,260,{f:'D',s:44,alpha:P(b,0,.3)});
        text('음료 하나',1080,380,{a:'left',f:'D',s:38});hbar(1080,440,560,64,600,700,C.green,'600원',{s:44,k:E.out(P(b,.2,.5))});
        text('담배 한 갑',1080,540,{a:'left',f:'D',s:38});hbar(1080,600,560,64,405,700,'#8fb6ff','405원',{s:44,k:E.out(P(b,.5,.5))});}
      srcLine('같이 사는 비율 1/3 · 2,000원 · 마진 30% = 전부 예시 가정');});
    sub('n5','n6',()=>{text('담배 손님이 10% 줄면 (하루 12명)',960,170,{f:'D',s:52,c:C.gold});
      receipt(620,500,1,[['담배 12갑 몫','−14만 5,800'],['같이 사던 4개 몫','−7만 2,000'],['카드 수수료','+7,440'],['한 달 합계','−21만 360','#d62f2f']],{title:'한 달 몫 변화 (예시)'});
      const q=K('n5',0);if(q>=0)stampBox('한 달 −21만 원',1400,420,q,{s:64,c:C.red,bg:'rgba(40,0,0,.9)'});
      if(L('n6')>=0)pill('같이 사는 비율 공식 통계 = 못 찾음 → 예시',1400,640,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('n6'),0,.3)});});
    sub('n7','n7',lt=>{cvsFront(560,480,.62,{});
      ['담배는','돈을 남기기보다','손님을 부르는 물건'].forEach((s,i)=>text(s,1400,300+i*120,{f:'D',s:i===2?62:58,c:i===2?C.gold:'#fff',alpha:P(lt,.2+i*.5,.3),max:900}));});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    if(T<CT('l3')){
      const a=L('l1');text('예시 가게 한 달',960,165,{f:'D',s:52,c:C.gold});
      receipt(620,500,.92,[['물건에서 남는 돈','874만 8천','#1f8a50'],['월세','−200만'],['알바','−350만'],['전기·관리비','−80만'],['기타','−30만'],['카드 수수료','−16만 2천']],{title:'한 달 (예시)'});
      if(L('l2')>=0){text('사장님 몫',1420,340,{f:'D',s:56,c:C.dim});big('l2',0,1420,470,'198만 6,000원',{f:'D',s:90,c:C.green,glow:'rgba(53,224,138,.4)'});
        if(T>FR('l2',.45))pill('가맹점이면 본사 몫은 따로',1420,640,{s:36,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('l2',.45),.3)});}
      srcLine('고정비는 전부 예시 가정 · 세금 제외');return;}
    text('예시 가게 사장님 한 달 몫 · 하나씩만 바꿔 보면',960,165,{f:'D',s:44,c:C.gold,max:1800});
    const rows=[['지금',198.6,CT('l3'),'198만 6천','l3'],['담배 하루 +10갑',210.21,KT('l3',0),'210만 2천','l3'],['담배 손님 −10%',177.564,KT('l4',0),'177만 6천','l4'],['음료·과자 +10%',270.528,KT('l5',0),'270만 5천','l5'],['수수료 1.45% 구간',156.075,KT('l6',0),'156만 1천','l6']];
    const Z=620,SCL=3.6;
    ctx.save();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;line(Z,215,Z,720);ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.4)';line(Z+198.6*SCL,215,Z+198.6*SCL,720);ctx.restore();
    rows.forEach(([l,v,t,lab,id],i)=>{if(L(id)<0)return;const y=270+i*100;const bad=v<198.6;text(l,70,y,{a:'left',s:38,w:900,max:520,c:bad?'#ffb3b3':'#fff'});
      if(T<t){text('?',Z+60,y,{f:'D',s:52,c:C.gold});return;}const k=E.out(P(T,t,.6));
      const w=Math.max(6,v*SCL*k),col=bad?C.red:i===0?'#5b6275':C.green;ctx.fillStyle=col;rr(Z,y-32,w,64,14);ctx.fill();
      text(lab,Z+w+18,y+2,{a:'left',f:'D',s:44,c:col==='#5b6275'?'#c9ced9':col,alpha:k});});
    if(L('l7')>=0){group(960,800,1,0,P(L('l7'),0,.3),()=>{panel(-780,-48,1560,96,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('담배 +10갑 = +11만 6천 · 음료·과자 +10% = +71만 9천 (6.2배)',0,4,{f:'D',s:40,c:C.gold,max:1500});});}
    else srcLine('예시 계산 · 한 번에 하나씩 · 담배 손님 −10%엔 같이 사던 4개 몫 포함 · 수수료 구간은 매출 그대로 가정',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('품목을 정리하기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','품목별 마진율','거래 명세서에서 품목마다','오늘: 담배 9% · 나머지 30%'],['k3','매출 비중 vs 몫 비중','두 가지 막대로 그려 보기','오늘 가게: 40% → 17%'],['k4','카드 수수료 구간','10억 근처면 그 안의 세금','0.4% ↔ 1.45%'],
      ['k5','정가 품목 몫 ÷ 시급','몫이 알바 몇 분을 사나','405원 = 2분 21초'],['k6','같이 사는 비율','담배 + 다른 물건 영수증 세기','오늘 가게: 세 명 중 한 명 (예시)']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:34,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-760,-280,1520,540,{bg:'rgba(6,13,32,1)',bd:C.gold});text('담배 하루 200갑 · 나머지 매출 하루 100만 원 · 마진 30%',0,-200,{f:'D',s:42,max:1440});text('남는 돈에서 담배 몫은 몇 %?',0,-140,{f:'D',s:44,max:1440});
      const b=L('k7b');
      if(b>=0)text('200 × 405 = 8만 1,000원 · 100만 × 30% = 30만 원',0,-40,{f:'D',s:44,alpha:P(b,0,.3),max:1440});
      const k=K('k7b',0);if(k>=0)text('약 21%',0,90,{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});else text('?',0,90,{f:'D',s:110,c:C.gold});
      if(L('k7c')>=0)text('매출로는 47% (90만 ÷ 190만) · 몫으로는 21%',0,210,{s:36,w:900,c:'#6FD3FF',alpha:P(L('k7c'),0,.3),max:1440});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('담배 한 갑 4,500원',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      const k=P(L('z2'),0,4.5);coins45(60,300,96,{fill:kk=>clamp(k*3-CG.findIndex(g=>g.k===kk)),ring:P(L('z2'),3,.4)});
      const b=L('z2b');if(b>=0){[['매출 비중','40%','#8fb6ff'],['몫 비중','17%',C.red],['값','11년째 그대로','#FFD23F']].forEach(([l,v,col],i)=>{const kk=P(b,i*.7,.3);if(kk<=0)return;group(1460,330+i*170,1,0,kk,()=>{panel(-380,-70,760,140,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-330,4,{a:'left',f:'D',s:46});text(v,330,4,{a:'right',f:'D',s:v.length>4?52:70,c:col,max:420});});});}
      else if(L('z2')>=0){[['세금·부담금','3,323원',C.red],['제조사·유통','772원','#6FA8FF'],['사장님 몫','405원',C.green]].forEach(([l,v,col],i)=>{const kk=P(L('z2'),.5+i*1.2,.3);if(kk<=0)return;text(l,1180,360+i*130,{a:'left',f:'D',s:46,alpha:kk});text(v,1820,360+i*130,{a:'right',f:'D',s:64,c:col,alpha:kk});});}
    }else{
      cvsFront(620,480,.6,{price:'4,500원'});cigPack(1250,470,.7,{});drawMascot(1650,600,.55,'happy');
      stampBox('담배 4,500원 = 나라 돈을 대신 받아 주는 값',960,800,c,{s:50,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-500,-70,1000,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 담배 사러 가서 같이 사는 물건은?',0,4,{s:38,w:900,c:C.ink,max:940});});
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
