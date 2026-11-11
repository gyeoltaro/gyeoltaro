/* ════════════════════════════════════════════════════════════════════
   장면 (LF.18 김치찌개 백반 9,000원 동네 백반집 계산서 — 하루 쉬는 값) — 수치·출처는 docs/longform-ep18.md
   중심 그림: 둥근 쟁반을 조각으로 나눈 9,000원. 재료 3,600 · 월세 1,000 · 직원 1,500 · 공과금·수수료 800 · 사장님 몫 2,100.
   반전: 하루 쉬는 값은 매출 54만도, 평균 몫 12만 6천도 아닌 '남는 돈 5,400원 × 60그릇 = 32만 4천'. 손님 절반인 일요일을 열면 5만 9,440원(시급 5,944원).
   ════════════════════════════════════════════════════════════════════ */
const SL=[ // 쟁반 조각 (원) — 12시 방향부터 시계 방향
  {k:'mat',name:'식재료',v:3600,col:'#e07b39'},
  {k:'rent',name:'월세',v:1000,col:'#2ec4b6'},
  {k:'staff',name:'직원',v:1500,col:'#6FD3FF'},
  {k:'util',name:'공과금·수수료',v:800,col:'#9aa4b8'},
  {k:'own',name:'사장님 몫',v:2100,col:'#35E08A'},
];
const SLK=Object.fromEntries(SL.map(s=>[s.k,s]));
const SEQ=['5','4','0','0','×','6','0','='];   // 한 그릇 남는 돈 5,400 × 60그릇 = 324,000 (0 개수: 5400 둘, 60 하나)
function slT(k){return {mat:KT('s1',0),rent:KT('s2',0),staff:KT('s3',0),util:KT('s4',0),own:KT('s5',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}
function bubble(x,y,w,h,str,o={}){group(x,y,o.k??1,o.rot||0,o.alpha??1,()=>{ctx.fillStyle='#fff';rr(-w/2,-h/2,w,h,30);ctx.fill();if(o.tail!==false){ctx.beginPath();ctx.moveTo(-w*.2,h/2);ctx.lineTo(-w*.26,h/2+50);ctx.lineTo(-w*.1,h/2);ctx.fill();}text(str,0,4,{f:'D',s:o.s||60,c:o.c||C.ink,max:w-60});});}
function person(x,y,s,col,al=1){if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-48*s,22*s,0,7);ctx.fill();rr(x-30*s,y-20*s,60*s,70*s,22*s);ctx.fill();ctx.restore();}

/* 공깃밥 한 그릇 (작은 아이콘) */
function riceBowl(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='#fbfbf6';ctx.beginPath();ctx.ellipse(0,-6,44,30,0,Math.PI,0);ctx.fill();
  ctx.fillStyle=o.col||'#e9eef5';ctx.beginPath();ctx.moveTo(-50,-4);ctx.lineTo(50,-4);ctx.quadraticCurveTo(44,40,0,42);ctx.quadraticCurveTo(-44,40,-50,-4);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(60,90,140,.35)';rr(-46,8,92,7,3);ctx.fill();
});}
/* 김치찌개 백반 한 상 (쟁반 + 밥 + 뚝배기 + 반찬 넷) */
function baekbanSet(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';rr(-330,-170,680,370,40);ctx.fill();
  ctx.fillStyle='#b5793f';rr(-340,-190,680,370,40);ctx.fill();ctx.fillStyle='#c98c4c';rr(-318,-168,636,326,30);ctx.fill();
  // 반찬 넷
  [['#3f9b4a',-230,-100],['#e2b13c',-80,-100],['#d64a2f',70,-100],['#8a5a3c',220,-100]].forEach(([c,dx,dy])=>{ctx.fillStyle='#f4f1ea';ctx.beginPath();ctx.ellipse(dx,dy,62,34,0,0,7);ctx.fill();ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(dx,dy-4,40,20,0,0,7);ctx.fill();});
  // 밥
  ctx.save();ctx.translate(-150,50);ctx.scale(1.5,1.5);riceBowl(0,0,1);ctx.restore();
  // 뚝배기 김치찌개
  ctx.fillStyle='#2b2320';ctx.beginPath();ctx.ellipse(130,60,120,64,0,0,7);ctx.fill();
  ctx.fillStyle='#c6372a';ctx.beginPath();ctx.ellipse(130,48,98,46,0,0,7);ctx.fill();
  ctx.fillStyle='#f3e6c8';rr(92,30,30,22,5);ctx.fill();rr(140,42,30,22,5);ctx.fill();ctx.fillStyle='#4f9d3f';rr(170,24,26,8,4);ctx.fill();rr(100,62,30,8,4);ctx.fill();
  if(o.steam!==false){ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=7;for(let i=0;i<3;i++){const sx=90+i*40;ctx.beginPath();ctx.moveTo(sx,0);ctx.bezierCurveTo(sx-18,-30,sx+18,-50,sx,-80);ctx.stroke();}}
  if(o.price)group(250,140,1,-.06,1,()=>{ctx.fillStyle='#fff';rr(-110,-40,220,80,14);ctx.fill();text(o.price,0,3,{f:'D',s:44,c:'#d62f2f'});});
});}
/* 동네 백반집 정면 (상표 없음) */
function bapjip(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,262,470,30,0,0,7);ctx.fill();
  ctx.fillStyle='#e9dfcd';rr(-440,-200,880,460,12);ctx.fill();
  ctx.fillStyle='#7a2b22';rr(-460,-260,920,92,10);ctx.fill();text(o.name||'동네 백반',0,-212,{f:'D',s:58,c:'#ffe7b0'});
  ctx.fillStyle=o.closed?'#2a3040':'rgba(255,214,120,.92)';rr(-400,-130,520,300,10);ctx.fill();ctx.strokeStyle='#5b3a24';ctx.lineWidth=8;rr(-400,-130,520,300,10);ctx.stroke();
  if(o.closed){ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=4;for(let i=0;i<9;i++)line(-396,-100+i*30,116,-100+i*30);}
  else{line(-140,-130,-140,170);[[-320,40],[-220,40],[-40,40],[50,40]].forEach(([px,py],i)=>person(px,py+60,1.1,['#5b6275','#3d4a63','#6b5a4a','#4a5d6b'][i]));ctx.fillStyle='#8a5a3c';rr(-390,90,500,20,6);ctx.fill();}
  ctx.fillStyle='#5b3a24';rr(170,-110,200,370,8);ctx.fill();ctx.fillStyle=o.closed?'#2a3040':'rgba(255,214,120,.8)';rr(195,-85,150,150,6);ctx.fill();ctx.fillStyle='#e8d6b0';ctx.beginPath();ctx.arc(340,100,10,0,7);ctx.fill();
  if(o.closed)group(270,-10,1,-.05,1,()=>{ctx.fillStyle='#fff';rr(-90,-46,180,92,10);ctx.fill();text('오늘 휴무',0,3,{f:'D',s:36,c:'#d62f2f'});});
  ctx.fillStyle='#fff';rr(-470,180,170,110,10);ctx.fill();text('김치찌개 백반',-385,212,{s:22,w:900,c:C.ink});text(o.price||'9,000원',-385,256,{f:'D',s:34,c:'#d62f2f'});
});}
/* 한 달 달력 (1일 = 일요일, 30일 → 일요일 5번). st(d) → 'open'|'sun'|'off'|'hl' */
function calMonth(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  const cw=110,chh=86,w=cw*7+40,h=chh*5+150;
  ctx.fillStyle='rgba(0,0,0,.3)';rr(-w/2+8,-h/2+10,w,h,24);ctx.fill();ctx.fillStyle='#fffdf6';rr(-w/2,-h/2,w,h,24);ctx.fill();
  ctx.fillStyle='#7a2b22';rr(-w/2,-h/2,w,70,24);ctx.fill();ctx.fillRect(-w/2,-h/2+40,w,30);text(o.title||'한 달 (예시)',0,-h/2+37,{f:'D',s:38,c:'#ffe7b0'});
  '일월화수목금토'.split('').forEach((d,i)=>text(d,-w/2+20+cw*i+cw/2,-h/2+100,{s:28,w:900,c:i===0?'#d62f2f':'#3a4256'}));
  for(let d=1;d<=30;d++){const i=d-1,cx=-w/2+20+(i%7)*cw+cw/2,cy=-h/2+130+Math.floor(i/7)*chh+chh/2;const st=o.st?o.st(d):(i%7===0?'sun':'open');const k=o.k?o.k(d):1;
    ctx.save();ctx.globalAlpha*=k;
    ctx.fillStyle=st==='sun'?'#e9e4dc':st==='off'?'#ffd6d6':st==='hl'?'#ffe9a8':st==='sunopen'?'#c9f2db':'#ffffff';rr(cx-cw/2+5,cy-chh/2+5,cw-10,chh-10,10);ctx.fill();
    text(d+'',cx-cw/2+22,cy-chh/2+24,{s:22,w:900,c:i%7===0?'#d62f2f':'#3a4256'});
    if(st==='sun')text('휴무',cx+8,cy+10,{f:'D',s:26,c:'#a09a90'});
    else if(st==='off'){ctx.strokeStyle='#d62f2f';ctx.lineWidth=7;line(cx-14,cy-6,cx+30,cy+30);line(cx+30,cy-6,cx-14,cy+30);}
    else if(st==='sunopen')text('영업',cx+8,cy+10,{f:'D',s:26,c:'#1f8a50'});
    else riceBowl(cx+10,cy+12,.32);
    ctx.restore();}
});}
/* 쟁반 원그래프. o.on(k) 0~1 · o.labels · o.dim(k) */
function trayPie(cx,cy,r,o={}){
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(cx+10,cy+16,r+40,r+40,0,0,7);ctx.fill();
  ctx.fillStyle='#b5793f';ctx.beginPath();ctx.arc(cx,cy,r+36,0,7);ctx.fill();ctx.fillStyle='#c98c4c';ctx.beginPath();ctx.arc(cx,cy,r+18,0,7);ctx.fill();
  let a0=-Math.PI/2;
  SL.forEach(g=>{const a1=a0+g.v/9000*Math.PI*2;const on=o.on?o.on(g.k):1;
    ctx.save();ctx.fillStyle=on>0?g.col:'rgba(255,255,255,.1)';if(on>0)ctx.globalAlpha*=lerp(.25,1,on);
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,a0,a1);ctx.closePath();ctx.fill();ctx.restore();
    ctx.strokeStyle='rgba(6,13,32,.6)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a0)*r,cy+Math.sin(a0)*r);ctx.stroke();
    if(o.labels!==false&&on>0){const am=(a0+a1)/2,rr2=r*(g.v>=1500?.6:.7),lx=cx+Math.cos(am)*rr2,ly=cy+Math.sin(am)*rr2;
      text(g.name,lx,ly-(g.v>=1000?18:0),{f:'D',s:g.v>=1500?38:g.v>=1000?32:26,c:'#0d1a12',alpha:on,max:r*.7});
      if(g.v>=1000)text(g.v.toLocaleString('ko-KR')+'원',lx,ly+24,{f:'D',s:g.v>=1500?34:28,c:'#0d1a12',alpha:on});}
    a0=a1;});
  ctx.strokeStyle='rgba(6,13,32,.6)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
}
/* 영수증 (숫자를 장면 속 물건에) */
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:32,w:900,c:'#3a4256',max:250});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433'});});
});}
/* 54만 원 한 줄 막대: 재료 21.6 · 고정비 19.8 · 몫 12.6 (만 원) */
function dayBar(x,y,w,h,o={}){
  const parts=[['mat','재료비',21.6,'#e07b39'],['fix','고정비',19.8,'#5b8fd9'],['own','몫',12.6,'#35E08A']];let acc=0;
  parts.forEach(([k,l,v,c])=>{const x0=x+w*acc/54,ww=w*v/54,on=o.on?o.on(k):1;ctx.save();ctx.globalAlpha*=lerp(.18,1,on);ctx.fillStyle=c;rr(x0+2,y-h/2,ww-4,h,14);ctx.fill();ctx.restore();
    if(on>.01){text(l,x0+ww/2,y-16,{f:'D',s:34,c:'#0d1a12',alpha:on});text(v.toFixed(1).replace('.0','')+'만',x0+ww/2,y+26,{f:'D',s:32,c:'#0d1a12',alpha:on});}
    if(o.cross&&o.cross(k)>0){const q=o.cross(k);ctx.save();ctx.globalAlpha*=q;ctx.strokeStyle=C.red;ctx.lineWidth=10;line(x0+10,y-h/2+10,x0+ww-10,y+h/2-10);line(x0+ww-10,y-h/2+10,x0+10,y+h/2-10);ctx.restore();}
    acc+=v;});
}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o2')){
      const a=L('o1'),q=K('o1',0);
      baekbanSet(560,430,.95*E.back(P(a,0,.5))+.001,{price:'9,000원'});
      text('× 하루 60그릇',1360,300,{f:'D',s:56,c:C.dim,alpha:P(a,.3,.3)});
      big('o1',0,1360,440,'54만 원',{f:'D',s:170,c:C.gold,glow:'rgba(255,197,49,.45)'});
      if(T>FR('o1',.62))bubble(1300,720,980,150,'"하루 쉬면 54만 원 손해"',{s:56,k:E.back(P(T,FR('o1',.62),.4))+.001});
    }else if(T<CT('o3')){
      const b=L('o2'),q=K('o2',0);
      calMonth(520,480,.82,{st:d=>d===10?'off':((d-1)%7===0?'sun':'open'),alpha:P(b,0,.3)});
      text('하루 더 쉬면',1380,250,{f:'D',s:52,c:C.dim,alpha:P(b,.2,.3)});
      text('54만 원',1380,380,{f:'D',s:96,c:'#9aa4b8',alpha:P(b,.3,.3)});
      if(T>FR('o2',.3)){ctx.save();ctx.globalAlpha*=P(T,FR('o2',.3),.3);ctx.strokeStyle=C.red;ctx.lineWidth=10;line(1200,390,1560,370);ctx.restore();text('재료 21만 6,000원은 안 쓴다',1380,470,{s:36,w:900,c:'#e07b39',alpha:P(T,FR('o2',.3),.3)});}
      big('o2',0,1380,620,'−32만 4,000원',{f:'D',s:104,c:C.red});
      srcLine('예시 가정 · 재료비 40% = 하루 21만 6,000원');
    }else if(T<CT('o4')){
      const b=L('o3'),q=K('o3',0);
      text('같은 날, 문을 열었다면 사장님 몫',960,200,{f:'D',s:56,c:C.gold,alpha:P(b,0,.3)});
      [['매출','54만',.1,'#9aa4b8'],['빠지는 돈','32만 4천',.3,C.red]].forEach(([l,v,t,c],i)=>{const x=420+i*560;text(l,x,370,{f:'D',s:44,c:C.dim,alpha:P(b,t,.3)});text(v,x,480,{f:'D',s:84,c,alpha:P(b,t,.3)});});
      text('그날 몫',1540,370,{f:'D',s:44,c:C.dim});big('o3',0,1540,480,'12만 6천',{f:'D',s:84,c:C.green});
      if(q>=0)stampBox('셋 중 어느 게 진짜 하루 값?',960,720,q,{s:58,c:C.gold,bg:'rgba(40,30,0,.9)'});
    }else if(T<CT('o5')){
      const b=L('o4'),q=K('o4',0);
      calMonth(520,480,.82,{st:d=>(d-1)%7===0?'sunopen':'open',alpha:P(b,0,.3),title:'일요일도 연다면?'});
      text('일요일 손님 = 평일의 절반 (예시)',1380,250,{f:'D',s:40,c:C.dim,alpha:P(b,.2,.3),max:820});
      text('사장님 시급',1380,400,{f:'D',s:56,alpha:P(T,FR('o4',.5),.3)});
      big('o4',0,1380,540,'5,944원',{f:'D',s:150,c:C.red,glow:'rgba(255,77,77,.4)'});
      if(q>=0)text('최저시급 1만 320원의 58%',1380,680,{s:38,w:900,c:C.dim,alpha:P(q,.3,.3)});
    }else if(T<CT('o6')){
      const b=L('o5');
      group(560,470,1,0,P(b,0,.3),()=>{panel(-340,-180,680,360,{bd:C.red});text('평일 하루 쉬면',0,-90,{f:'D',s:54});text('−32만 원',0,40,{f:'D',s:110,c:C.red});});
      group(1360,470,1,0,P(b,.4,.3),()=>{panel(-340,-180,680,360,{bd:C.green});text('일요일 하루 열면',0,-90,{f:'D',s:54});text('+6만 원',0,40,{f:'D',s:110,c:C.green});});
      srcLine('예시 계산 · 일요일 손님 절반 · 알바 8시간 · 가스·전기 2만 원');
    }else{
      const k9=L('o6'),k10=L('o7');
      text('가게 문 닫는 날을 정하기 전 꼭 볼 숫자',960,230,{f:'D',s:68,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['백반값·식재료비 (정부 조사)','사장님 휴무일 (통계·보도)','가게 숫자 = 예시 가정'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,380+i*580,760,{s:32,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('동네 백반집 하루 쉬는 값 계산서',960,230,{f:'D',s:104,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('김치찌개 백반 9,000원 · 하루 60그릇',960,370,{s:56,w:900,alpha:P(a,.3,.3)});
    bapjip(640,690,.5,{alpha:P(a,.2,.3)});baekbanSet(1200,680,.5,{alpha:P(a,.3,.3)});drawMascot(1610,720,.75,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 백반집 ── */
  setup:{draw(){
    sub('p1','p2',()=>{bapjip(600,500,.85);
      if(L('p2')>=0){text('테이블 여덟 개 백반집',1460,300,{f:'D',s:54,c:C.gold});
        ['오피스 골목','사장님이 직접 요리','주방 직원 한 명','세금 제외'].forEach((s,i)=>pill(s,1460,420+i*100,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p2',.2+i*.15),.3)}));}
      text('예시 가정',600,860,{s:30,w:900,c:C.dim});});
    sub('p3','p3',()=>{text('김치찌개 백반 한 그릇',960,170,{f:'D',s:56,c:C.gold});
      const q=K('p3',0);baekbanSet(560,500,1.05,{alpha:q>=0?1:.4});
      text(q>=0?'9,000원':'?',1380,430,{f:'D',s:150,c:C.gold});
      if(T>FR('p3',.45))group(1380,600,1,0,P(T,FR('p3',.45),.3),()=>{pill('참가격 전국 평균 9,092원 (2026.9)',0,0,{s:36,bg:'rgba(255,255,255,.92)'});});
      srcLine('한국소비자원 참가격 · 뉴시스(파이낸셜뉴스) 2026.10.19 · 우리 가게 9,000원은 예시');});
    sub('p4','p4',()=>{text('하루 60그릇 · 한 달 25일',960,165,{f:'D',s:56,c:C.gold});
      const q=K('p4',0);for(let i=0;i<60;i++){const x=270+(i%15)*92,y=290+Math.floor(i/15)*100;const k=q>=0?P(q,i*.012,.15):0;if(k<=0){ctx.fillStyle='rgba(255,255,255,.08)';rr(x-34,y-26,68,56,10);ctx.fill();}else riceBowl(x,y,.62,{alpha:k});}
      if(T>FR('p4',.45))pill('일요일 휴무 → 30일 중 25일',960,700,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p4',.45),.3)});
      if(T>FR('p4',.7))text('한 달 1,500그릇 · 매출 1,350만 원',960,790,{f:'D',s:60,c:C.green,alpha:P(T,FR('p4',.7),.3)});
      srcLine('예시 가정 · 그릇 하나 = 하루 한 그릇');});
    sub('p5','p5',lt=>{trayPie(700,500,300,{on:()=>0,labels:false});
      text('9,000원',1400,380,{f:'D',s:110,c:C.gold,alpha:P(lt,.3,.3)});text('한 그릇을 쟁반 위에 나누면',1400,500,{s:40,w:900,alpha:P(lt,.5,.3)});
      text('?',700,500,{f:'D',s:140,c:C.gold,alpha:P(lt,.4,.3)});});
  }},
  /* ── 9,000원 쪼개기 ── */
  cut:{draw(){
    const cx=470,cy=545,r=290;
    trayPie(cx,cy,r,{on:k=>P(T,slT(k),.4)});
    text('김치찌개 백반 9,000원',cx,180,{f:'D',s:40,c:C.gold});
    const X=1290;
    sub('s1','s1',()=>{text('첫 번째: 식재료',X,230,{f:'D',s:58,c:SLK.mat.col});
      text('외식업체 식재료비 비중',X,340,{s:38,w:900,c:C.dim});
      text('36.3% → 40.7%',X,420,{f:'D',s:60,alpha:P(T,FR('s1',.2),.3)});
      text('우리 가게: 40% (예시)',X,510,{s:40,w:900,alpha:P(T,FR('s1',.5),.3)});
      popText(KT('s1',0),X,640,'= 3,600원',{f:'D',s:96,c:SLK.mat.col});
      srcLine('농식품부·한국농촌경제연구원 2025년 외식업체 경영실태조사 (2026.3.29 보도자료) · 전국 외식업체 3,138곳');});
    sub('s2','s2',()=>{text('두 번째: 월세',X,300,{f:'D',s:60,c:SLK.rent.col});text('한 달 150만 ÷ 1,500그릇 (예시)',X,400,{s:40,w:900});popText(KT('s2',0),X,540,'1,000원',{f:'D',s:110,c:SLK.rent.col});});
    sub('s3','s3',()=>{text('세 번째: 주방 직원',X,250,{f:'D',s:60,c:SLK.staff.col});
      text('1만 320원 × 209시간 = 215만 6,880원',X,350,{s:38,w:900,max:860});text('+ 보험료 등 → 225만 (예시)',X,420,{s:38,w:900,c:C.dim,alpha:P(T,FR('s3',.55),.3)});
      popText(KT('s3',0),X,570,'1,500원',{f:'D',s:110,c:SLK.staff.col});srcLine('2026년 최저시급 1만 320원 (최저임금위원회) · 주 40시간 + 주휴 = 월 209시간');});
    sub('s4','s4b',()=>{text('네 번째: 가스·전기·수도·카드 수수료',X,300,{f:'D',s:48,c:SLK.util.col,max:900});text('한 달 120만 (예시)',X,400,{s:40,w:900});popText(KT('s4',0),X,540,'800원',{f:'D',s:110,c:'#c9ced9'});
      if(L('s4b')>=0)pill('월세·월급·공과금 = 여는 날이든 쉬는 날이든 나간다',X,700,{s:32,bg:'rgba(200,225,255,.95)',alpha:P(L('s4b'),0,.3)});
      if(L('s4b')>=0)srcLine('단순화: 카드 수수료는 실제로는 매출에 따라 움직이지만 이 계산에선 고정비에 넣었다 (예시)');});
    sub('s5','s5',()=>{text('9,000 − 3,600 − 1,000 − 1,500 − 800',X,300,{f:'D',s:44,c:C.dim,max:900});text('사장님 몫',X,400,{f:'D',s:60,c:C.green});big('s5',0,X,540,'2,100원',{f:'D',s:130,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('s5',.4))text('× 1,500그릇 = 한 달 315만 원',X,680,{f:'D',s:48,c:C.gold,alpha:P(T,FR('s5',.4),.3)});
      if(T>FR('s5',.7))text('÷ 25일 = 하루 12만 6,000원',X,770,{f:'D',s:44,c:'#fff',alpha:P(T,FR('s5',.7),.3)});});
  }},
  calc:{draw(){
    if(T<CT('c1')){const a=L('c0');
      calMonth(520,480,.82,{st:d=>d===10?'off':((d-1)%7===0?'sun':'open'),title:'일요일 말고 하루 더 쉬면'});
      text('매출',1400,280,{f:'D',s:44,c:C.dim,alpha:P(a,.2,.3)});text('−54만 원',1400,370,{f:'D',s:80,c:C.red,alpha:P(a,.3,.3)});
      if(T>FR('c0',.6)){text('재료는 안 산다',1400,500,{f:'D',s:44,c:C.dim,alpha:P(T,FR('c0',.6),.3)});text('+21만 6,000원',1400,590,{f:'D',s:80,c:'#e07b39',alpha:P(T,FR('c0',.68),.3)});}
      srcLine('예시 가정 · 재료비 40% · 월세·월급·공과금은 쉬어도 그대로');return;}
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('×'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} × ${n2.replace('=','')} =`;bigS='324,000';}else if(n2!==undefined){small=`${fmt(n1)} ×`;bigS=n2||fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('한 그릇 남는 돈 5,400원 × 60그릇',1350,250,{f:'D',s:52,c:C.gold,alpha:P(a,.2,.3),max:1000});text('9,000원 − 재료 3,600원 = 5,400원',1350,340,{s:34,w:900,alpha:P(a,.4,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{const c2=L('c2');
        text('매출',1000,430,{a:'left',f:'D',s:38,alpha:P(c2,0,.3)});hbar(1000,490,620,64,54,60,'#5b6275','54만',{s:46,lc:'#c9ced9'});
        text('하루 쉬는 값',1000,580,{a:'left',f:'D',s:38,alpha:P(c2,0,.3)});const q=K('c2',0);if(q<0)text('?',1060,640,{f:'D',s:56,c:C.gold});else hbar(1000,640,620,64,32.4,60,C.red,'32만 4천',{s:46,k:E.out(P(q,0,.5))});
        if(L('c3')>=0){text('그날 사장님 몫',1000,730,{a:'left',f:'D',s:38});hbar(1000,790,620,64,12.6,60,C.green,'12만 6천',{s:46,k:E.out(P(L('c3'),.6,.6))});
          const r=K('c3',0);if(r>=0)stampBox('몫의 2.6배',1600,170,r,{s:56,c:C.gold,bg:'rgba(40,30,0,.9)'});}}}
    if(dt>=0&&L('c3')<0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 쉬는 날 빠지는 돈 ── */
  dayoff:{draw(){
    sub('d1','d1',lt=>{[['54만','매출','#9aa4b8'],['32만','빠지는 돈',C.red],['12만','그날 몫',C.green]].forEach(([v,l,c],i)=>{const x=420+i*540,k=E.back(P(lt,.2+i*.4,.4));if(k<=0)return;group(x,430,k,0,1,()=>{panel(-230,-170,460,340,{bd:c});text(v,0,-20,{f:'D',s:120,c});text(l,0,100,{f:'D',s:44,c:C.dim});});});
      text('진짜 하루 값은?',960,780,{f:'D',s:66,c:C.gold,alpha:P(lt,1.6,.3)});});
    sub('d2','d6',()=>{
      const st=L('d3')>=0,st4=L('d4')>=0,st5=L('d5')>=0;
      text('하루 매출 54만 원을 한 줄로 펴면',960,165,{f:'D',s:52,c:C.gold});
      dayBar(200,330,1520,120,{on:k=>k==='mat'?1:st?1:.0,cross:k=>k==='mat'?P(T,FR('d2',.5),.3):0});
      if(L('d3')<0)text('쉬는 날엔 안 쓰는 돈',200+1520*10.8/54,440,{f:'D',s:40,c:'#e07b39',alpha:P(T,FR('d2',.5),.3)});
      if(st&&!st4)group(200+1520*(21.6+16.2)/54,470,1,0,P(L('d3'),0,.3),()=>{text('한 달 몫 315만 ÷ 25일 = 12만 6천',0,0,{f:'D',s:36,c:C.green});text('하루 고정비 495만 ÷ 25일 = 19만 8천',0,56,{f:'D',s:34,c:'#8fb6ff'});});
      if(st4&&!st5){const k=P(L('d4'),0,.3);text('쉬어도 그대로 나간다',200+1520*31.5/54,440,{f:'D',s:40,c:'#8fb6ff',alpha:k});
        for(let i=0;i<5;i++){const x=300+i*300;group(x,640,1,0,P(T,FR('d4',.45+i*.06),.3),()=>{riceBowl(0,0,1);text('나머지 날',0,80,{s:28,w:900,c:C.dim});});}
        if(T>FR('d4',.45))text('↓ 19만 8천을 나눠 메운다',960,560,{f:'D',s:38,c:'#8fb6ff',alpha:P(T,FR('d4',.45),.3)});}
      if(st5){const x0=200+1520*21.6/54,x1=1720;ctx.save();ctx.strokeStyle=C.red;ctx.lineWidth=6;line(x0,420,x0,450);line(x0,450,x1,450);line(x1,420,x1,450);ctx.restore();
        text('= 5,400원 × 60그릇',(x0+x1)/2,510,{f:'D',s:42,alpha:P(L('d5'),.1,.3)});big('d5',0,(x0+x1)/2,620,'32만 4,000원',{f:'D',s:96,c:C.red});
        if(L('d6')>=0){group(960,780,1,0,P(L('d6'),0,.3),()=>{panel(-640,-60,1280,120,{bg:'rgba(6,13,32,1)',bd:C.red,lw:4});const q=K('d6',0);text('한 달 몫: 315만 원 → '+(q>=0?'282만 6,000원':'?'),0,4,{f:'D',s:50,c:q>=0?C.red:'#fff'});});}}
      srcLine('예시 계산 · 고정비 = 월세 150 + 직원 225 + 공과금·수수료 120 = 495만 원');});
    sub('d7','d7',lt=>{[['매출로 세면','54만','손해가 부푼다','#9aa4b8'],['평균 몫으로 세면','12만 6천','작아 보인다',C.green],['남는 돈으로 세면','32만 4천','진짜 하루 값',C.red]].forEach(([a,v,b,c],i)=>{const y=300+i*170;group(960,y,1,0,P(lt,.2+i*.6,.3),()=>{panel(-700,-70,1400,140,{bd:c,bg:i===2?'rgba(255,77,77,.12)':'rgba(255,255,255,.05)'});text(a,-650,4,{a:'left',f:'D',s:44});text(v,120,4,{f:'D',s:64,c});text(b,650,4,{a:'right',f:'D',s:40,c:C.dim});});});});
  }},
  /* ── 일요일에 열면 ── */
  sunday:{draw(){
    sub('u1','u1',lt=>{calMonth(760,480,.9,{st:d=>(d-1)%7===0?'hl':'open',title:'지금 쉬는 일요일 다섯 번'});text('열면?',1560,480,{f:'D',s:110,c:C.gold,alpha:P(lt,.5,.3)});});
    sub('u2','u2',()=>{text('일요일 손님 = 평일의 절반 (예시)',960,165,{f:'D',s:52,c:C.gold});
      for(let i=0;i<60;i++){const x=270+(i%15)*92,y=290+Math.floor(i/15)*90;if(i<30)riceBowl(x,y,.55,{alpha:P(T,FR('u2',.1+i*.008),.2)});else{ctx.fillStyle='rgba(255,255,255,.08)';rr(x-30,y-24,60,50,10);ctx.fill();}}
      text('30그릇 × 5,400원',960,700,{f:'D',s:52,alpha:P(T,FR('u2',.5),.3)});big('u2',0,960,800,'16만 2,000원',{f:'D',s:80,c:C.green});});
    sub('u3','u5',()=>{text('일요일 하루 장사',960,160,{f:'D',s:54,c:C.gold});
      const base=780,sc=26,cols=[['남는 돈',16.2,C.green,CT('u3')-.1,'16만 2천'],['알바 8시간',-8.256,C.red,FR('u3',.55),'−8만 2,560'],['가스·전기',-2,C.red,FR('u4',.25),'−2만'],['사장님 손에',5.944,C.gold,KT('u4',0),'5만 9,440']];
      let acc=0;cols.forEach(([l,v,c,t,lab],i)=>{const x=400+i*380;text(l,x,base+50,{f:'D',s:36,c:T>=t?'#fff':C.dim});if(T<t){text('?',x,base-120,{f:'D',s:70,c:C.gold});return;}const k=E.out(P(T,t,.5));
        let y0,y1;if(i===3){y0=base;y1=base-v*sc;}else if(v>0){y0=base;y1=base-v*sc;acc=v;}else{y0=base-acc*sc;y1=base-(acc+v)*sc;acc+=v;}
        const top=Math.min(y0,y1),hh=Math.abs(y1-y0)*k;vCash(x-120,v>0||i===3?y0-hh:top,240,hh,c);text(lab,x,(v>0||i===3?y0-Math.abs(y1-y0):top)-34,{f:'D',s:40,c,alpha:k});});
      if(L('u5')>=0)group(1500,360,1,0,P(L('u5'),0,.3),()=>{panel(-300,-120,600,240,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('÷ 사장님 10시간',0,-50,{s:36,w:900,c:C.dim});const q=K('u5',0);text(q>=0?'시급 5,944원':'?',0,40,{f:'D',s:66,c:q>=0?C.red:C.gold});});
      if(L('u5')>=0&&T>FR('u5',.55))srcLine('2026년 최저시급 1만 320원의 57.6% · 알바 1만 320원 × 8시간 = 8만 2,560원 (주휴수당 제외 단순 계산)');
      else srcLine('예시 계산 · 일요일은 주방 직원이 쉬는 날이라 알바를 쓴다고 가정');});
    sub('u6','u6',()=>{text('일요일에 사장님도 최저시급을 벌려면',960,170,{f:'D',s:54,c:C.gold});
      receipt(600,500,1,[['알바 8시간','8만 2,560'],['가스·전기','2만'],['사장님 10시간','10만 3,200'],['합계','20만 5,760','#d62f2f']],{title:'일요일 본전 (예시)'});
      text('÷ 5,400원',1360,380,{f:'D',s:60,alpha:P(T,FR('u6',.55),.3)});big('u6',0,1360,520,'39그릇',{f:'D',s:140,c:C.gold});
      srcLine('20만 5,760 ÷ 5,400 = 38.1 → 39그릇 · 지금 예시 일요일은 30그릇');});
    sub('u7','u7',lt=>{group(560,450,1,0,P(lt,0,.3),()=>{panel(-340,-180,680,360,{bd:C.red});text('평일 하루 쉬면',0,-100,{f:'D',s:52});text('−32만 4천',0,10,{f:'D',s:96,c:C.red});text('손님 60그릇',0,110,{s:36,w:900,c:C.dim});});
      group(1360,450,1,0,P(lt,.4,.3),()=>{panel(-340,-180,680,360,{bd:C.green});text('일요일 하루 열면',0,-100,{f:'D',s:52});text('+5만 9천',0,10,{f:'D',s:96,c:C.green});text('손님 30그릇',0,110,{s:36,w:900,c:C.dim});});
      if(T>FR('u7',.6))stampBox('하루의 값 = 그날 오는 손님 수',960,770,T-FR('u7',.6),{s:54,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 실제 휴무 (어두운 장) ── */
  rest:{draw(){
    sub('h1','h1',lt=>{drawMascot(560,520,.95,'think',{alpha:P(lt,0,.3)});bubble(1300,420,820,180,'사장님들은 얼마나 쉴까?',{k:E.back(P(lt,.1,.4))+.001,s:62});});
    sub('h2','h3',()=>{text('외식업 사장님 6만 6,000명의 결제 기록',960,165,{f:'D',s:52,c:C.gold});
      text('매주 정해 둔 휴무',560,300,{f:'D',s:46,c:C.dim});big('h2',0,560,440,'1.46일',{f:'D',s:140,c:'#6FD3FF'});
      for(let i=0;i<7;i++){const x=290+i*90,k=i<1?1:i===1?.46:0;ctx.fillStyle='rgba(255,255,255,.1)';rr(x-38,560,76,76,12);ctx.fill();if(k>0){ctx.fillStyle='#6FD3FF';rr(x-38,560,76*k,76,12);ctx.fill();}text('일월화수목금토'[i],x,600,{s:28,w:900,c:'#0d1a12'});}
      if(L('h3')>=0){text('그 밖에 따로 쉰 날',1360,300,{f:'D',s:46,c:C.dim});big('h3',0,1360,440,'1년 1.3일',{f:'D',s:110,c:C.red});
        if(T>FR('h3',.5))pill('매출 0원인 날 = 쉰 날로 셈',1360,600,{s:34,bg:'rgba(255,255,255,.92)'});}
      srcLine('헤럴드경제 2026.1.16 (결제 플랫폼 페이히어 의뢰 분석 · 외식업 자영업자 6만 6,000명)');});
    sub('h4','h5',()=>{text('정기 휴무일이 없는 가맹점 (2023년)',960,165,{f:'D',s:52,c:C.gold});
      text('15개 업종 전체',600,320,{a:'right',f:'D',s:44});const q=K('h4',0);if(q<0)text('?',700,320,{f:'D',s:56,c:C.gold});else hbar(640,320,1000,90,62.7,100,C.red,'62.7%',{s:52,k:E.out(P(q,0,.6))});
      if(T>FR('h4',.6)){text('편의점',600,460,{a:'right',f:'D',s:44});hbar(640,460,1000,90,99.2,100,'#9aa4b8','',{k:E.out(P(T,FR('h4',.6),.6))});text('99.2%',1600,540,{f:'D',s:48,c:'#c9ced9'});}
      if(T>FR('h4',.3))text('16만 9,364곳 / 27만 86곳',640,385,{a:'left',s:30,w:900,c:C.dim});
      if(L('h5')>=0){text('하루 14시간 넘게',600,660,{a:'right',f:'D',s:44});hbar(640,660,1000,90,27.0,100,C.gold,'27.0%',{s:52,k:E.out(P(L('h5'),0,.6))});}
      srcLine('통계청 프랜차이즈 조사 2023년 기준 (주간경향 2025.4.23 인용)');});
    sub('h6','h6',lt=>{bapjip(560,480,.62,{closed:1});
      ['쉬는 하루가','매출 54만으로 보이면','쉬기 어렵다'].forEach((s,i)=>text(s,1400,300+i*120,{f:'D',s:58,c:i===2?C.gold:'#fff',alpha:P(lt,.2+i*.5,.3),max:900}));
      if(T>FR('h6',.6))stampBox('먼저: 진짜 하루 값 32만',1400,720,T-FR('h6',.6),{s:50,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 재료비 ── */
  cost:{draw(){
    sub('m1','m1',lt=>{trayPie(760,500,300,{on:k=>k==='mat'?1:.25});text('재료 조각이',1460,400,{f:'D',s:60,alpha:P(lt,.2,.3)});text('커지면?',1460,500,{f:'D',s:80,c:'#e07b39',alpha:P(lt,.5,.3)});});
    sub('m2','m3',()=>{text('외식업체 경영실태조사',960,165,{f:'D',s:52,c:C.gold});
      const cols=[['식재료비 비중','36.3%','40.7%',36.3,40.7,'#e07b39','m2'],['영업이익률','12.1%','8.7%',12.1,8.7,C.red,'m3']];
      cols.forEach(([l,a,b,va,vb,c,id],i)=>{if(L(id)<0)return;const x=560+i*800,base=760,sc=i===0?9:30;text(l,x,240,{f:'D',s:46});
        vCash(x-200,base-va*sc,160,va*sc,'#5b6275');text(a,x-120,base-va*sc-34,{f:'D',s:42,c:'#c9ced9'});text(i===0?'5년 전':'2020년',x-120,base+40,{s:30,w:900,c:C.dim});
        const q=K(id,0);if(q<0){text('?',x+120,base-200,{f:'D',s:70,c:C.gold});}else{const k=E.out(P(q,0,.5));vCash(x+40,base-vb*sc*k,160,vb*sc*k,c);text(b,x+120,base-vb*sc-34,{f:'D',s:46,c,alpha:k});}
        text(i===0?'최근':'2024년',x+120,base+40,{s:30,w:900,c:C.dim});});
      if(L('m3')>=0&&T>FR('m3',.6))pill('매출은 +41.4% (2020 → 2024)',1360,860-40,{s:32,bg:'rgba(255,255,255,.92)'});
      srcLine('농식품부·한국농촌경제연구원 2025년 외식업체 경영실태조사 (2026.3.29 보도자료)',872,560);});
    sub('m4','m5',()=>{text('우리 가게 재료비 40% → 44%',960,165,{f:'D',s:54,c:C.gold});
      text('한 달 몫',560,300,{a:'right',f:'D',s:44});hbar(600,300,800,80,315,330,'#5b6275','315만',{s:46,lc:'#c9ced9'});
      const q=K('m4',0);if(q<0)text('?',660,410,{f:'D',s:56,c:C.gold});else hbar(600,410,800,80,261,330,C.red,'261만',{s:46,k:E.out(P(q,0,.6))});
      if(T>FR('m4',.3))text('한 그릇 재료 3,600 → 3,960원',600,470,{a:'left',s:30,w:900,c:C.dim});
      if(L('m5')>=0){text('하루 쉬는 값',560,600,{a:'right',f:'D',s:44});hbar(600,600,800,80,32.4,34,'#5b6275','32만 4천',{s:46,lc:'#c9ced9'});
        const r=K('m5',0);if(r<0)text('?',660,710,{f:'D',s:56,c:C.gold});else hbar(600,710,800,80,30.24,34,'#e07b39','30만 2,400',{s:46,k:E.out(P(r,0,.6))});}
      srcLine('예시 계산 · (9,000 − 3,960) × 1,500 − 495만 = 261만 · (9,000 − 3,960) × 60 = 30만 2,400');});
    sub('m6','m7',()=>{text('참가격 김치찌개 백반 (전국 평균)',960,165,{f:'D',s:52,c:C.gold});
      text('2025년 9월',600,300,{a:'right',f:'D',s:44,c:C.dim});hbar(640,300,900,80,8741,9500,'#5b6275','8,741원',{s:46,lc:'#c9ced9'});
      text('2026년 9월',600,410,{a:'right',f:'D',s:44});hbar(640,410,900,80,9092,9500,'#e07b39','9,092원',{s:46,k:E.out(P(L('m6'),.3,.6))});
      if(T>FR('m6',.6))stampBox('+351원 (+4.0%)',1300,520,T-FR('m6',.6),{s:48,c:C.gold,bg:'rgba(40,30,0,.9)'});
      if(L('m7')>=0)group(960,700,1,0,P(L('m7'),0,.3),()=>{panel(-700,-90,1400,180,{bg:'rgba(6,13,32,1)',bd:C.green,lw:5});text('우리 가게 9,350원 · 재료비 3,960원',0,-36,{s:38,w:900,c:C.dim});const q=K('m7',0);text('한 달 몫 261만 → '+(q>=0?'313만 5,000원':'?'),0,40,{f:'D',s:54,c:q>=0?C.green:'#fff'});});
      srcLine('한국소비자원 참가격 (뉴시스·파이낸셜뉴스 2026.10.19) · 우리 가게 숫자는 예시, 손님 수는 그대로라고 가정');});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('예시 백반집 사장님 한 달 몫 · 하나씩만 바꿔 보면',960,165,{f:'D',s:44,c:C.gold,alpha:P(a,0,.3),max:1800});
    if(T<CT('l2'))text('바꿀 수 있는 숫자는?',960,500,{f:'D',s:90,alpha:P(a,.2,.3)});
    const rows=[['지금',315,CT('l1')+1.2,'315만','l1'],['하루 더 쉬면',282.6,KT('l2',0),'282만 6천','l2'],['일요일 다 열면',344.7,KT('l3',0),'약 345만','l3'],['하루 5그릇 덜',247.5,KT('l4',0),'247만 5천','l4'],['재료비 44%',261,KT('l5',0),'261만','l5'],['값 +500원',390,KT('l6',0),'390만','l6']];
    const Z=560,SCL=2.6;
    if(T>=CT('l1')+1){ctx.save();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;line(Z,215,Z,760);ctx.restore();}
    if(T>=CT('l2')){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(Z+315*SCL,215,Z+315*SCL,760);ctx.restore();}
    rows.forEach(([l,v,t,lab,id],i)=>{if(T<CT('l1')+1.1)return;if(L(id)<0)return;const y=260+i*88;const bad=v<315;text(l,60,y,{a:'left',s:36,w:900,max:480,c:bad?'#ffb3b3':'#fff'});
      if(T<t){text('?',Z+60,y,{f:'D',s:52,c:C.gold});return;}const k=E.out(P(T,t,.6));
      const w=Math.max(6,v*SCL*k),col=bad?C.red:i===0?'#5b6275':C.green;ctx.fillStyle=col;rr(Z,y-30,w,60,14);ctx.fill();
      text(lab,Z+w+18,y+2,{a:'left',f:'D',s:44,c:col==='#5b6275'?'#c9ced9':col,alpha:k});});
    if(L('l7')>=0){group(960,820,1,0,P(L('l7'),0,.3),()=>{panel(-760,-46,1520,92,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text(T>FR('l7',.6)?'가장 큰 손잡이 = 쉬는 날보다 여는 날의 그릇 수':'일요일 다섯 번 다 열어도 +29만 7,200 · 하루 5그릇 덜이면 −67만 5,000',0,4,{f:'D',s:40,c:C.gold,max:1480});});}
    else if(T>=CT('l2'))srcLine('예시 계산 · 한 번에 하나씩 · 기준 하루 60그릇 · 25일 · 한 그릇 더 = 5,400원',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('쉬는 날을 정하기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','한 그릇에 남는 돈','값 − 재료비','오늘 가게: 5,400원'],['k3','하루 고정비','월세 + 월급 + 공과금 ÷ 여는 날','오늘 가게: 19만 8,000원'],['k4','쉬는 날 빠지는 돈','남는 돈 × 그릇 수 (매출 아님)','오늘 가게: 32만 4,000원'],
      ['k5','더 여는 날 본전 그릇','(알바 + 가스 + 사장님 시급) ÷ 남는 돈','오늘 가게 일요일: 39그릇'],['k6','요일별 그릇 수','일요일은 평일의 몇 %?','한 달만 적어 보기']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-760,-280,1520,540,{bg:'rgba(6,13,32,1)',bd:C.gold});text('김치찌개 1만 원 · 재료비 4,000원 · 하루 50그릇 · 26일',0,-200,{f:'D',s:42,max:1440});text('고정비 450만 원 → 하루 쉬면 얼마가 빠질까?',0,-140,{f:'D',s:40,max:1440});
      const b=L('k7b');if(b>=0){text('매출 50만 원',0,-50,{f:'D',s:46,c:'#9aa4b8'});ctx.strokeStyle=C.red;ctx.lineWidth=8;line(-170,-50,170,-50);}
      if(b>=0)text('(10,000 − 4,000) × 50그릇',0,30,{f:'D',s:46,alpha:P(T,FR('k7b',.4),.3),max:1440});
      const k=K('k7b',0);if(k>=0)text('30만 원',0,140,{f:'D',s:100,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});else text('?',0,140,{f:'D',s:110,c:C.gold});
      if(L('k7c')>=0)text('한 달 몫 330만 · 본전 450만 ÷ 6,000 ÷ 26일 = 하루 약 29그릇',0,232,{s:32,w:900,c:'#6FD3FF',alpha:P(L('k7c'),0,.3),max:1440});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('김치찌개 백반 9,000원',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      const k=P(L('z2'),0,4.5);trayPie(480,520,290,{on:kk=>clamp(k*5-SL.findIndex(g=>g.k===kk))});
      if(T>FR('z2',.75))group(1320,380,1,0,P(T,FR('z2',.75),.3),()=>{panel(-440,-120,880,240,{bg:'rgba(6,13,32,1)',bd:C.green,lw:5});text('한 그릇 더 팔면 남는 돈',0,-44,{s:40,w:900,c:C.dim});text('5,400원',0,44,{f:'D',s:80,c:C.green});});
      const b=L('z2b');if(b>=0)group(1380,690,1,0,P(b,0,.3),()=>{ctx.fillStyle='#fff';rr(-480,-90,960,180,30);ctx.fill();text('하루 쉬면: −32만 원 (54만도 12만도 아닌)',0,-30,{f:'D',s:40,c:'#d62f2f',max:980});text('손님 적은 일요일 열면: +6만 원',0,40,{f:'D',s:40,c:'#1f8a50',max:980});});
    }else{
      bapjip(620,480,.68);baekbanSet(1250,470,.55);drawMascot(1650,600,.55,'happy');
      stampBox('하루 쉬는 값 = 매출 54만이 아니라 남는 돈 32만',960,800,c,{s:50,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-500,-70,1000,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 쉬는 하루, 얼마로 느껴지세요?',0,4,{s:38,w:900,c:C.ink,max:940});});
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
