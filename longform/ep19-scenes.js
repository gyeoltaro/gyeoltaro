/* ════════════════════════════════════════════════════════════════════
   장면 (LF.19 당구 10분 1,500원 동네 당구장 계산서 — 요금표 50% · 물가로 5% · 시급으로 반값) — 수치·출처는 docs/longform-ep19.md
   중심 그림: 한 시간 요금 9,000원 = 천 원짜리 아홉 장. 월세 3장 · 알바 2장 · 전기 1장 · 수수료·소모품 1장 · 사장님 몫 2장.
   반전: 2008년 기사 속 10분 1,000원 → 지금 1,500원(+50%)은 물가(1.43배)로 5%, 최저시급(2.74배)으로 재면 55% = 거의 반값.
   ════════════════════════════════════════════════════════════════════ */
const BL=[ // 천 원짜리 아홉 장 (순서대로)
  {k:'rent',name:'월세·관리비',n:3,col:'#2ec4b6'},
  {k:'alba',name:'알바',n:2,col:'#6FD3FF'},
  {k:'elec',name:'전기·냉난방',n:1,col:'#FFD23F'},
  {k:'etc',name:'수수료·소모품',n:1,col:'#9aa4b8'},
  {k:'own',name:'사장님 몫',n:2,col:'#35E08A'},
];
const BLK=Object.fromEntries(BL.map(s=>[s.k,s]));
const BILLS=[];BL.forEach(g=>{for(let i=0;i<g.n;i++)BILLS.push(g);});
const SEQ=['2','0','0','0','×','9','0','0','='];   // 사장님 몫 2,000 × 900시간 = 1,800,000 (0 개수: 2000 셋, 900 둘)
function blT(k){return {rent:KT('s1',0),alba:KT('s2',0),elec:KT('s3',0),etc:KT('s4',0),own:KT('s5',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}
function bubble(x,y,w,h,str,o={}){group(x,y,o.k??1,o.rot||0,o.alpha??1,()=>{ctx.fillStyle='#fff';rr(-w/2,-h/2,w,h,30);ctx.fill();if(o.tail!==false){ctx.beginPath();ctx.moveTo(-w*.2,h/2);ctx.lineTo(-w*.26,h/2+50);ctx.lineTo(-w*.1,h/2);ctx.fill();}text(str,0,4,{f:'D',s:o.s||60,c:o.c||C.ink,max:w-60});});}
function person(x,y,s,col,al=1){if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-48*s,22*s,0,7);ctx.fill();rr(x-30*s,y-20*s,60*s,70*s,22*s);ctx.fill();ctx.restore();}

/* 당구대 (위에서 본 모습, 포켓 없는 캐롬 테이블) */
function poolTable(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  if(o.lamp!==false){ctx.fillStyle='rgba(255,236,170,.10)';ctx.beginPath();ctx.ellipse(0,0,330,200,0,0,7);ctx.fill();}
  ctx.fillStyle='rgba(0,0,0,.3)';rr(-288,-158,590,330,30);ctx.fill();
  ctx.fillStyle='#6b3d1f';rr(-300,-170,600,340,30);ctx.fill();
  ctx.fillStyle=o.off?'#24324a':'#1f6fb2';rr(-262,-132,524,264,10);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.08)';rr(-262,-132,524,60,10);ctx.fill();
  ctx.fillStyle='#e9d9b0';for(let i=1;i<8;i++){ctx.beginPath();ctx.arc(-262+i*65.5,-151,5,0,7);ctx.fill();ctx.beginPath();ctx.arc(-262+i*65.5,151,5,0,7);ctx.fill();}
  if(!o.off)[['#d62f2f',-120,-40],['#d62f2f',90,50],['#f7f3e8',-30,60],['#ffd23f',150,-60]].forEach(([c,bx,by])=>{ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.arc(bx+5,by+6,22,0,7);ctx.fill();ctx.fillStyle=c;ctx.beginPath();ctx.arc(bx,by,22,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.arc(bx-7,by-8,6,0,7);ctx.fill();});
  if(o.cue&&!o.off){ctx.save();ctx.rotate(-.35);ctx.fillStyle='#e8c48a';rr(-560,-60,420,12,6);ctx.fill();ctx.fillStyle='#3a2414';rr(-560,-61,150,14,7);ctx.fill();ctx.fillStyle='#2b6fd1';rr(-144,-59,10,10,3);ctx.fill();ctx.restore();}
  if(o.price)group(200,-190,1,.05,1,()=>{ctx.fillStyle='#fff';rr(-150,-46,300,92,14);ctx.fill();text(o.price,0,3,{f:'D',s:42,c:'#d62f2f',max:270});});
});}
/* 상가 2층 동네 당구장 (상표 없음). o.closed → 불 꺼진 창 + 임대 */
function billiardHall(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,342,470,28,0,0,7);ctx.fill();
  ctx.fillStyle='#bfc3cc';rr(-440,-330,880,670,10);ctx.fill();
  ctx.fillStyle='#9aa0ad';rr(-440,-20,880,16,0);ctx.fill();
  // 2층 창 (당구장)
  ctx.fillStyle=o.closed?'#2a3040':'#ffe9a8';rr(-400,-280,800,220,8);ctx.fill();ctx.strokeStyle='#4c5466';ctx.lineWidth=8;rr(-400,-280,800,220,8);ctx.stroke();line(-133,-280,-133,-60);line(133,-280,133,-60);
  if(!o.closed){[-266,0,266].forEach(cx=>{ctx.fillStyle='#1f6fb2';rr(cx-100,-150,200,60,8);ctx.fill();ctx.fillStyle='rgba(255,255,255,.5)';rr(cx-40,-250,80,14,6);ctx.fill();});
    text('당 구',0,-210,{f:'D',s:96,c:'#d62f2f',alpha:.9});}
  else{text('임 대',0,-170,{f:'D',s:110,c:'#ffd23f'});}
  // 1층 가게
  ctx.fillStyle='#6b7385';rr(-400,30,520,260,6);ctx.fill();ctx.fillStyle='#8fa1b8';rr(-380,50,480,220,4);ctx.fill();
  ctx.fillStyle='#3a4256';rr(170,30,230,310,6);ctx.fill();ctx.fillStyle='#596277';rr(190,50,190,290,4);ctx.fill();
  text('계단 ↑ 2층',285,190,{s:30,w:900,c:'#fff'});
  // 2층 간판
  ctx.fillStyle='#14304f';rr(-200,-330,400,60,10);ctx.fill();text(o.name||'○○ 당구장',0,-300,{f:'D',s:40,c:'#ffd23f'});
  if(o.price&&!o.closed)group(-260,160,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-120,-60,240,120,12);ctx.fill();text('10분',0,-24,{s:30,w:900,c:C.ink});text(o.price,0,22,{f:'D',s:44,c:'#d62f2f'});});
});}
/* 천 원짜리 한 장 */
function bill(x,y,s,col,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';rr(-96,-46,200,100,10);ctx.fill();
  ctx.fillStyle=col||'#cfe3c8';rr(-100,-50,200,100,10);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;rr(-88,-38,176,76,6);ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.15)';ctx.beginPath();ctx.arc(46,0,26,0,7);ctx.fill();
  text(o.label||'1,000',-30,2,{f:'D',s:34,c:'#0d1a12'});
});}
/* 아홉 장 격자 (3 × 3). on(k) */
function billGrid(cx,cy,o={}){
  BILLS.forEach((g,i)=>{const x=cx+(i%3-1)*230,y=cy+(Math.floor(i/3)-1)*140;const on=o.on?o.on(g.k):0;
    if(on<=0){ctx.save();ctx.strokeStyle='rgba(255,255,255,.25)';ctx.setLineDash([10,8]);ctx.lineWidth=3;rr(x-100,y-50,200,100,10);ctx.stroke();ctx.restore();text('1,000',x,y,{f:'D',s:30,c:'rgba(255,255,255,.25)'});return;}
    bill(x,y,lerp(1.25,1,E.out(on)),g.col,{alpha:Math.min(1,on*2)*(o.dim&&o.dim(g.k)?.25:1)});});
}
/* 신문 조각 */
function paper(x,y,s,o={}){group(x,y,s,o.rot??-.03,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';rr(-372,-232,760,480,8);ctx.fill();ctx.fillStyle='#f1ead8';rr(-380,-240,760,480,8);ctx.fill();
  text(o.date||'2008년 2월 · 대구',-340,-196,{a:'left',s:26,w:900,c:'#6b6252'});ctx.fillStyle='#3a3326';rr(-340,-170,680,4,0);ctx.fill();
  text(o.head||'"당구장이 돌아왔다"',0,-120,{f:'D',s:52,c:'#1d1a14',max:680});
  ctx.fillStyle='rgba(60,50,30,.25)';for(let i=0;i<7;i++){if(i===3)continue;rr(-340,-60+i*40,i%2?560:680,14,6);ctx.fill();}
  if(o.hl){ctx.fillStyle='rgba(255,210,63,.75)';rr(-350,52,700,56,8);ctx.fill();text(o.hl,0,80,{s:34,w:900,c:'#1d1a14',max:680});}
});}
/* 시계 원 (분 단위 부채꼴) */
function minuteClock(x,y,r,mins,col,o={}){
  ctx.fillStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  const full=Math.floor(mins/60),rest=mins%60;
  ctx.save();ctx.fillStyle=col;ctx.globalAlpha*=.9;ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+Math.min(mins,60)/60*Math.PI*2);ctx.closePath();ctx.fill();ctx.restore();
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;line(x+Math.cos(a)*(r-16),y+Math.sin(a)*(r-16),x+Math.cos(a)*r,y+Math.sin(a)*r);}
  if(full>=1&&rest>0){const r2=r*.55,x2=x+r+r2+20;ctx.fillStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.arc(x2,y,r2,0,7);ctx.fill();ctx.save();ctx.fillStyle=col;ctx.globalAlpha*=.9;ctx.beginPath();ctx.moveTo(x2,y);ctx.arc(x2,y,r2,-Math.PI/2,-Math.PI/2+rest/60*Math.PI*2);ctx.closePath();ctx.fill();ctx.restore();ctx.strokeStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(x2,y,r2,0,7);ctx.stroke();text('+',x+r+10,y,{f:'D',s:40});}
}
/* 영수증 (숫자를 장면 속 물건에) */
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:32,w:900,c:'#3a4256',max:250});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433'});});
});}
/* 번개 (전기요금 인상 한 번) */
function bolt(x,y,s,col,al=1){if(al<=0)return;group(x,y,s,0,al,()=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(10,-60);ctx.lineTo(-30,8);ctx.lineTo(-2,8);ctx.lineTo(-14,60);ctx.lineTo(32,-12);ctx.lineTo(4,-12);ctx.closePath();ctx.fill();});}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o2')){
      const a=L('o1');
      poolTable(560,470,.95*E.back(P(a,0,.5))+.001,{cue:1,price:'10분 1,500원'});
      text('× 6 = 한 시간',1380,290,{f:'D',s:52,c:C.dim,alpha:P(a,.3,.3)});
      big('o1',0,1380,430,'9,000원',{f:'D',s:160,c:C.gold,glow:'rgba(255,197,49,.45)'});
      if(T>FR('o1',.55))paper(1380,700,.5,{hl:'10분에 1천 원',alpha:P(T,FR('o1',.55),.3)});
    }else if(T<CT('o3')){
      const b=L('o2');
      text('2008년 10분 1,000원 → 지금 1,500원',960,180,{f:'D',s:56,c:C.gold,alpha:P(b,0,.3)});
      text('요금표로는',560,330,{f:'D',s:50,c:C.dim,alpha:P(b,.2,.3)});text('+50%',560,470,{f:'D',s:150,c:'#9aa4b8',alpha:P(b,.3,.3)});
      text('물가로 바꾸면',1360,330,{f:'D',s:50,c:C.dim,alpha:P(T,FR('o2',.5),.3)});big('o2',0,1360,470,'+5%',{f:'D',s:150,c:C.red,glow:'rgba(255,77,77,.4)'});
      srcLine('소비자물가지수 2008 → 2025 약 1.43배 · 1,500원은 예시 요금');
    }else if(T<CT('o4')){
      const b=L('o3'),q=K('o3',0);
      text('한 시간 요금으로 쓸 수 있는 알바 시간',960,170,{f:'D',s:54,c:C.gold,alpha:P(b,0,.3)});
      group(0,0,1,0,P(b,.2,.3),()=>{minuteClock(420,480,150,95.5,'#9aa4b8');text('2008년 · 6,000원',540,720,{f:'D',s:42});text('1시간 35분',540,790,{f:'D',s:56,c:'#c9ced9'});});
      group(0,0,1,0,q>=0?1:.35,()=>{minuteClock(1400,480,150,q>=0?52.3*E.out(P(q,0,.6)):0,C.red);text('지금 · 9,000원',1400,720,{f:'D',s:42});text(q>=0?'52분':'?',1400,790,{f:'D',s:56,c:q>=0?C.red:C.gold});});
      srcLine('최저시급 2008년 3,770원 · 2026년 1만 320원 (최저임금위원회)');
    }else if(T<CT('o5')){
      const b=L('o4');
      group(560,440,1,0,P(b,0,.3),()=>{panel(-340,-170,680,340,{bd:'#9aa4b8'});text('요금표로 재면',0,-80,{f:'D',s:52});text('+50%',0,40,{f:'D',s:110,c:'#c9ced9'});});
      group(1360,440,1,0,P(b,.3,.3),()=>{panel(-340,-170,680,340,{bd:C.red});text('시급으로 재면',0,-80,{f:'D',s:52});text('반값',0,40,{f:'D',s:120,c:C.red});});
      srcLine('요금이 시급만큼 올랐다면 10분 2,737원 · 지금 1,500원은 그 55%');
    }else{
      const k9=L('o5'),k10=L('o6');
      text('요금을 정하기 전 꼭 볼 숫자',960,230,{f:'D',s:68,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['당구비·당구장 수 (보도)','물가·시급·전기 (공공 통계)','가게 숫자 = 예시 가정'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,380+i*580,760,{s:32,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o7');
    text('동네 당구장 10분 1,500원 계산서',960,230,{f:'D',s:104,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('요금표 +50% · 물가로 5% · 시급으로 재면',960,370,{s:52,w:900,alpha:P(a,.3,.3)});
    billiardHall(560,700,.45,{alpha:P(a,.2,.3),price:'1,500원'});poolTable(1130,690,.5,{alpha:P(a,.3,.3)});drawMascot(1620,720,.72,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 당구장 ── */
  setup:{draw(){
    sub('p1','p2b',()=>{billiardHall(600,480,.85,{price:'1,500원'});
      if(L('p2')>=0){text('당구대 열 대 동네 당구장',1460,240,{f:'D',s:52,c:C.gold});
        ['상가 2층','낮 카운터 = 사장님','저녁·주말 = 알바','세금 제외'].forEach((s,i)=>pill(s,1460,360+i*96,{s:38,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p2',.15+i*.15),.3)}));}
      if(L('p2b')>=0)pill('보증금·시설비는 빼고 한 달 나가는 돈만',1460,770,{s:30,bg:'rgba(200,225,255,.95)',alpha:P(L('p2b'),0,.3)});
      srcLine('예시 가정');});
    sub('p3','p3',()=>{text('요금',960,170,{f:'D',s:56,c:C.gold});
      const q=K('p3',0);poolTable(560,480,1,{alpha:q>=0?1:.4,cue:1});
      text('10분',1380,320,{f:'D',s:60,c:C.dim});text(q>=0?'1,500원':'?',1380,450,{f:'D',s:140,c:C.gold});
      if(T>FR('p3',.35))text('× 6 = 한 시간 9,000원',1380,590,{f:'D',s:52,alpha:P(T,FR('p3',.35),.3)});
      srcLine('예시 요금 · 동네·테이블 크기마다 다르다 (커뮤니티·매물 글에서 흔히 보이는 값, 공식 통계 아님)');});
    sub('p4','p4b',()=>{text('당구대 열 대 · 하루 합계 30시간 (예시)',960,165,{f:'D',s:52,c:C.gold});
      const q=K('p4',0);
      for(let t=0;t<10;t++){const x=230+(t%5)*365,y=t<5?330:560;group(x,y,.42,0,1,()=>poolTable(0,0,1,{off:q<0,lamp:false}));
        for(let h=0;h<12;h++){const on=q>=0&&h<3?P(q,t*.05+h*.04,.15):0;ctx.fillStyle=on>0?'#FFD23F':'rgba(255,255,255,.12)';ctx.save();ctx.globalAlpha*=on>0?lerp(.3,1,on):1;rr(x-132+h*22,y+86,18,18,4);ctx.fill();ctx.restore();}}
      if(L('p4b')<0&&T>FR('p4',.55))text('한 달 30일 = 900시간 · 매출 810만 원',960,780,{f:'D',s:56,c:C.green,alpha:P(T,FR('p4',.55),.3)});
      if(L('p4b')>=0)pill('칸 하나 = 한 시간 · 열두 시간 영업 중 세 시간 (4분의 1)',960,780,{s:36,bg:'rgba(255,255,255,.92)',alpha:P(L('p4b'),0,.3)});
      srcLine('예시 가정 · 테이블 한 대 하루 평균 3시간');});
    sub('p5','p5',lt=>{billGrid(600,480,{on:()=>0});
      text('9,000원',1420,380,{f:'D',s:110,c:C.gold,alpha:P(lt,.3,.3)});text('한 시간 요금 = 천 원짜리 아홉 장',1420,500,{s:40,w:900,alpha:P(lt,.5,.3),max:820});});
  }},
  /* ── 9,000원 쪼개기 ── */
  cut:{draw(){
    const cx=520,cy=500;
    billGrid(cx,cy,{on:k=>P(T,blT(k),.4)});
    text('한 시간 9,000원',cx,230,{f:'D',s:44,c:C.gold});
    const X=1340;
    sub('s1','s1',()=>{text('첫 번째: 월세·관리비',X,250,{f:'D',s:58,c:BLK.rent.col});
      text('한 달 270만 ÷ 900시간 (예시)',X,360,{s:40,w:900});text('당구대 열 대 = 넓은 2층',X,430,{s:34,w:900,c:C.dim});
      popText(KT('s1',0),X,580,'3,000원 · 세 장',{f:'D',s:88,c:BLK.rent.col});});
    sub('s2','s2',()=>{text('두 번째: 알바',X,300,{f:'D',s:60,c:BLK.alba.col});text('저녁·주말 한 달 180만 (예시)',X,400,{s:40,w:900});popText(KT('s2',0),X,540,'2,000원 · 두 장',{f:'D',s:88,c:BLK.alba.col});});
    sub('s3','s3',()=>{text('세 번째: 전기·냉난방',X,280,{f:'D',s:60,c:BLK.elec.col});
      text('당구대마다 조명 · 넓은 공간',X,380,{s:38,w:900,c:C.dim});text('한 달 90만 (예시)',X,450,{s:40,w:900});
      popText(KT('s3',0),X,590,'1,000원',{f:'D',s:110,c:BLK.elec.col});});
    sub('s4','s4',()=>{text('네 번째: 카드 수수료·소모품',X,280,{f:'D',s:52,c:'#c9ced9',max:900});text('공·큐 팁·당구대 천·음료',X,380,{s:38,w:900,c:C.dim});text('한 달 90만 (예시)',X,450,{s:40,w:900});popText(KT('s4',0),X,590,'1,000원',{f:'D',s:110,c:'#c9ced9'});
      srcLine('단순화: 카드 수수료는 실제로는 매출에 따라 움직이지만 이 계산에선 한 달 고정으로 넣었다 (예시)');});
    sub('s5','s5',()=>{text('9,000 − 3,000 − 2,000 − 1,000 − 1,000',X,300,{f:'D',s:44,c:C.dim,max:900});text('사장님 몫',X,400,{f:'D',s:60,c:C.green});big('s5',0,X,540,'2,000원',{f:'D',s:130,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('s5',.5))text('천 원짜리 두 장',X,680,{f:'D',s:48,c:C.gold,alpha:P(T,FR('s5',.5),.3)});});
  }},
  calc:{draw(){
    if(T<CT('c1')){const a=L('c0');
      billGrid(600,480,{on:()=>1,dim:k=>k!=='own'});
      text('사장님 몫 2,000원 × 900시간',1400,380,{f:'D',s:52,c:C.gold,alpha:P(a,.2,.3),max:900});text('= ?',1400,500,{f:'D',s:110,c:C.gold,alpha:P(a,.4,.3)});
      srcLine('예시 가정 · 한 달 당구대 가동 900시간');return;}
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('×'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} × ${n2.replace('=','')} =`;bigS='1,800,000';}else if(n2!==undefined){small=`${fmt(n1)} ×`;bigS=n2||fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:done?76:84,f:'D',c:done?'#1f8a50':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('사장님 몫 2,000원 × 900시간',1350,250,{f:'D',s:52,c:C.gold,alpha:P(a,.2,.3),max:1000});text('9,000 − 3,000 − 2,000 − 1,000 − 1,000 = 2,000',1350,340,{s:32,w:900,alpha:P(a,.4,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{const c2=L('c2');
        text('한 달 매출',1000,440,{a:'left',f:'D',s:38,alpha:P(c2,0,.3)});hbar(1000,500,560,64,810,900,'#5b6275','810만',{s:46,lc:'#c9ced9'});
        text('사장님 몫',1000,590,{a:'left',f:'D',s:38,alpha:P(c2,0,.3)});const q=K('c2',0);if(q<0)text('?',1060,650,{f:'D',s:56,c:C.gold});else hbar(1000,650,560,64,180,900,C.green,'180만',{s:46,k:E.out(P(q,0,.5))});
        if(T>FR('c2',.5)&&L('c3')<0)text('낮 카운터 = 사장님이 직접',1000,740,{a:'left',s:34,w:900,c:C.dim,alpha:P(T,FR('c2',.5),.3)});
        if(L('c3')>=0){const r=L('c3');stampBox('17년 전보다 요금 +50%인데?',1330,810,r,{s:44,c:C.gold,bg:'rgba(40,30,0,.9)'});}}}
    if(dt>=0&&L('c2')<0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 17년 동안 50% ── */
  price:{draw(){
    sub('q1','q1',lt=>{poolTable(560,480,.9,{price:'10분 1,500원'});text('정말',1420,380,{f:'D',s:70,c:C.dim,alpha:P(lt,.2,.3)});text('올랐을까?',1420,500,{f:'D',s:96,c:C.gold,alpha:P(lt,.4,.3)});});
    sub('q2','q3',()=>{const q=K('q2',0);
      paper(600,470,1.05,{hl:q>=0?'"10분당 1천 원 … 10년 넘게 요지부동"':'',date:'매일신문 2008.2.16 · 대구'});
      if(L('q3')<0){text('2008년 10분 당구비',1460,330,{f:'D',s:46,c:C.dim});big('q2',0,1460,470,'1,000원',{f:'D',s:130,c:C.gold});
        if(T>FR('q2',.7))pill('그때도 이미 10년 넘게 그대로',1460,620,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('q2',.7),.3)});}
      else{text('대구 당구장 수 (같은 기사)',1460,250,{f:'D',s:40,c:C.gold});
        [['한때',1800,'#5b6275'],['가장 적을 때',250,C.red],['2008년 초',650,C.green]].forEach(([l,v,c],i)=>{const k=P(T,FR('q3',.15+i*.22),.4);if(k<=0)return;const x=1250+i*210,base=720,hh=v/1800*380*E.out(k);vCash(x-70,base-hh,140,hh,c);text(v.toLocaleString('ko-KR')+'곳',x,base-hh-30,{f:'D',s:36,c:c==='#5b6275'?'#c9ced9':c});text(l,x,base+36,{s:26,w:900,c:C.dim});});}
      srcLine('매일신문 2008.2.16 "당구장이 돌아왔다" (대구 지역 기사 · 당시 값)');});
    sub('q4','q4',()=>{text('소비자물가지수 (2020년 = 100)',960,165,{f:'D',s:52,c:C.gold});
      [['2008년',81.7,'#5b6275','약 81.7',.1],['2020년',100,'#8fb6ff','100',.35],['2025년',116.61,C.red,'116.61',.6]].forEach(([l,v,c,lab,t],i)=>{const k=E.out(P(T,FR('q4',t),.5));if(k<=0)return;const x=560+i*400,base=760,hh=v*4*k;vCash(x-90,base-hh,180,hh,c);text(lab,x,base-hh-34,{f:'D',s:46,c:c==='#5b6275'?'#c9ced9':c});text(l,x,base+36,{s:30,w:900,c:C.dim});});
      srcLine('2025년 116.61: 국가데이터처 (머니투데이·노컷뉴스 2025.12.31) · 2008년: OECD 소비자물가 (FRED) 2008 ÷ 2020 × 100 = 81.66');});
    sub('q5','q6b',()=>{
      const r=K('q5',0);
      text('물가',300,250,{f:'D',s:46,c:C.dim});
      if(r<0)text('?',300,350,{f:'D',s:80,c:C.gold});else text('× 1.43',300,350,{f:'D',s:80,c:C.gold});
      const rows=[['2008년 요금','1,000원',1000,'#5b6275',CT('q5')],['지금 돈으로','1,428원',1428,'#8fb6ff',KT('q5',0)+.6],['우리 가게','1,500원',1500,C.gold,CT('q6')]];
      rows.forEach(([l,lab,v,c,t],i)=>{if(T<t)return;const y=480+i*120;text(l,560,y,{a:'right',f:'D',s:42});hbar(600,y,900,80,v,1700,c,lab,{s:46,lc:c==='#5b6275'?'#c9ced9':c,k:E.out(P(T,t,.5))});});
      if(L('q6')>=0&&L('q6b')<0){const q=K('q6',0);if(q>=0)stampBox('+72원 = 5%',1480,260,q,{s:56,c:C.red,bg:'rgba(40,0,0,.85)'});}
      if(L('q6b')>=0){group(960,820,1,0,P(L('q6b'),0,.3),()=>{panel(-640,-50,1280,100,{bg:'rgba(6,13,32,1)',bd:C.red,lw:4});const q=K('q6b',0);text('1,000원을 그대로 받았다면 → 지금 돈으로 '+(q>=0?'700원':'?'),0,4,{f:'D',s:44,c:q>=0?C.red:'#fff'});});}
      else srcLine('1,000 × 116.61 ÷ 81.66 = 1,428원 · 1,500 ÷ 1,428 = 1.05');});
    sub('q7','q7',lt=>{group(560,450,1,0,P(lt,0,.3),()=>{panel(-340,-170,680,340,{bd:'#9aa4b8'});text('요금표로는',0,-80,{f:'D',s:52});text('+50%',0,40,{f:'D',s:110,c:'#c9ced9'});});
      group(1360,450,1,0,P(lt,.4,.3),()=>{panel(-340,-170,680,340,{bd:C.red});text('물가로는',0,-80,{f:'D',s:52});text('+5%',0,40,{f:'D',s:110,c:C.red});});
      if(T>FR('q7',.5))stampBox('물가를 겨우 따라왔다',960,760,T-FR('q7',.5),{s:56,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 시급으로 재면 ── */
  wage:{draw(){
    sub('w1','w1',lt=>{drawMascot(560,520,.95,'think',{alpha:P(lt,0,.3)});bubble(1300,420,860,180,'비용은 물가만큼만 오를까?',{k:E.back(P(lt,.1,.4))+.001,s:58});});
    sub('w2','w2',()=>{text('최저시급',960,165,{f:'D',s:56,c:C.gold});
      text('2008년',560,360,{a:'right',f:'D',s:46,c:C.dim});hbar(600,360,900,90,3770,11000,'#5b6275','3,770원',{s:50,lc:'#c9ced9'});
      text('2026년',560,520,{a:'right',f:'D',s:46});const q=K('w2',0);if(q<0)text('?',660,520,{f:'D',s:60,c:C.gold});else hbar(600,520,900,90,10320,11000,C.red,'1만 320원',{s:50,k:E.out(P(q,0,.6))});
      if(T>FR('w2',.7))stampBox('2.74배',1300,700,T-FR('w2',.7),{s:66,c:C.red,bg:'rgba(40,0,0,.85)'});
      srcLine('최저임금위원회 고시 · 2008년 3,770원 · 2026년 1만 320원');});
    sub('w3','w5b',()=>{
      const showW5=L('w5')>=0;
      if(!showW5){text('한 시간 요금으로 알바를 몇 분 쓸 수 있나',960,165,{f:'D',s:50,c:C.gold});
        const q3=K('w3',0);group(0,0,1,0,q3>=0?1:.35,()=>{minuteClock(330,470,150,q3>=0?95.5*E.out(P(q3,0,.6)):0,'#8fb6ff');text('2008년: 6,000원 ÷ 3,770원',480,700,{f:'D',s:38});text(q3>=0?'1시간 35분':'?',480,780,{f:'D',s:60,c:q3>=0?'#8fb6ff':C.gold});});
        const q4=K('w4',0);if(L('w4')>=0)group(0,0,1,0,q4>=0?1:.35,()=>{minuteClock(1440,470,150,q4>=0?52.3*E.out(P(q4,0,.6)):0,C.red);text('지금: 9,000원 ÷ 1만 320원',1440,700,{f:'D',s:38});text(q4>=0?'52분':'?',1440,780,{f:'D',s:60,c:q4>=0?C.red:C.gold});});
        srcLine('6,000 ÷ 3,770 = 1.59시간 · 9,000 ÷ 10,320 = 0.87시간 (52분)');}
      else{text('10분 요금이 시급만큼 올랐다면',960,165,{f:'D',s:52,c:C.gold});
        text('2008년',560,330,{a:'right',f:'D',s:44,c:C.dim});hbar(600,330,900,80,1000,3000,'#5b6275','1,000원',{s:46,lc:'#c9ced9'});
        text('시급만큼',560,450,{a:'right',f:'D',s:44});const q=K('w5',0);if(q<0)text('?',660,450,{f:'D',s:56,c:C.gold});else hbar(600,450,900,80,2737,3000,'#8fb6ff','2,737원',{s:46,k:E.out(P(q,0,.6))});
        text('지금',560,570,{a:'right',f:'D',s:44});if(T>FR('w5',.55))hbar(600,570,900,80,1500,3000,C.red,'1,500원 = 55%',{s:46,k:E.out(P(T,FR('w5',.55),.6))});
        if(L('w5b')>=0)pill('한 시간 요금: 2008년 시급의 1.6배 → 지금 시급의 0.87배',960,720,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('w5b'),0,.3)});
        srcLine('1,000 × 10,320 ÷ 3,770 = 2,737원 · 1,500 ÷ 2,737 = 0.55');}});
    sub('w6','w6',()=>{text('우리 가게 알바비 한 달 (같은 시간)',960,170,{f:'D',s:52,c:C.gold});
      receipt(620,500,1,[['지금 시급','180만'],['2008년 시급이면','66만'],['더 드는 돈','114만','#d62f2f']],{title:'알바비 (예시)'});
      text('2008년 시급으로',1400,380,{f:'D',s:46,c:C.dim});big('w6',0,1400,500,'66만 원',{f:'D',s:120,c:'#8fb6ff'});
      srcLine('180만 × 3,770 ÷ 10,320 = 65만 7,558원');});
    sub('w7','w7',lt=>{billiardHall(560,480,.6,{price:'1,500원'});drawMascot(560,700,.4,'happy',{alpha:P(lt,.2,.3)});
      ['낮 카운터는','사장님이 직접','몫 180만 = 사장님 시급 포함'].forEach((s,i)=>text(s,1400,300+i*120,{f:'D',s:i===2?46:60,c:i===2?C.gold:'#fff',alpha:P(lt,.2+i*.5,.3),max:900}));});
  }},
  /* ── 전기요금 ── */
  elec:{draw(){
    sub('e1','e1',lt=>{poolTable(560,480,.9,{});for(let i=0;i<3;i++)bolt(1300+i*170,460,1.6,'#FFD23F',P(lt,.2+i*.2,.3));text('전기요금',1470,640,{f:'D',s:70,c:C.gold,alpha:P(lt,.6,.3)});});
    sub('e2','e2',()=>{text('2022년 4월 이후 전기요금 인상',960,170,{f:'D',s:52,c:C.gold});
      const q=K('e2',0);for(let i=0;i<7;i++){const on=P(T,CT('e2')+.4+i*.25,.3);const isGen=i<6;bolt(330+i*210,430,1.5,q>=0?(isGen?'#FFD23F':'#5b6275'):'#FFD23F',on);if(q>=0)text(isGen?'일반용':'',330+i*210,560,{s:28,w:900,c:C.gold,alpha:P(q,i*.06,.2)});}
      text('일곱 번',960,680,{f:'D',s:60,alpha:P(T,CT('e2')+2,.3)});if(q>=0)text('소상공인 일반용은 그중 여섯 번',960,770,{f:'D',s:48,c:C.gold,alpha:P(q,0,.3)});
      srcLine('전북일보 2025.7.8 (한국전력 요금 인상 정리 인용)');});
    sub('e3','e3',()=>{text('kWh당 전기요금',960,170,{f:'D',s:54,c:C.gold});
      text('2022년',560,360,{a:'right',f:'D',s:46,c:C.dim});hbar(600,360,900,90,125,180,'#5b6275','약 125원',{s:50,lc:'#c9ced9'});
      text('2025년',560,520,{a:'right',f:'D',s:46});const q=K('e3',0);if(q<0)text('?',660,520,{f:'D',s:60,c:C.gold});else hbar(600,520,900,90,160,180,C.red,'약 160원',{s:50,k:E.out(P(q,0,.6))});
      if(T>FR('e3',.6))stampBox('3년에 약 30%',1300,700,T-FR('e3',.6),{s:60,c:C.red,bg:'rgba(40,0,0,.85)'});
      srcLine('전북일보 2025.7.8 · 기사 표현 "kWh당 전기요금" (일반용만의 단가인지는 기사에 명시되지 않음)');});
    sub('e4','e5',()=>{
      if(L('e5')<0){text('우리 가게 전기·냉난방 한 달',960,170,{f:'D',s:52,c:C.gold});
        text('3년 전 단가면',560,360,{a:'right',f:'D',s:44,c:C.dim});hbar(600,360,900,90,70.3,100,'#5b6275','약 70만',{s:50,lc:'#c9ced9'});
        text('지금',560,520,{a:'right',f:'D',s:44});hbar(600,520,900,90,90,100,'#FFD23F','90만',{s:50});
        const q=K('e4',0);if(q>=0)stampBox('한 달 +20만 원',1320,700,q,{s:60,c:C.red,bg:'rgba(40,0,0,.85)'});
        srcLine('예시 계산 · 90만 × 125 ÷ 160 = 70만 3,125원 · 사용량은 그대로라고 가정');}
      else{text('20만 원 = 당구대 몇 시간?',960,170,{f:'D',s:52,c:C.gold});
        text('20만 ÷ 9,000원',560,380,{f:'D',s:56,alpha:P(L('e5'),0,.3)});big('e5',0,560,520,'22시간',{f:'D',s:120,c:C.gold});
        poolTable(1380,440,.6,{});
        for(let d=0;d<7;d++){const x=1110+d*90;text('일월화수목금토'[d],x,660,{s:28,w:900,c:C.dim});for(let h=0;h<3;h++){const on=P(T,FR('e5',.55)+d*.08+h*.03,.2);ctx.fillStyle=on>0?'#FFD23F':'rgba(255,255,255,.12)';rr(x-30,700+h*44,60,36,8);ctx.fill();}}
        srcLine('19만 6,875 ÷ 9,000 = 21.9시간 · 일주일 매일 3시간 + 한 시간 남짓');}});
    sub('e6','e6',lt=>{group(560,450,1,0,P(lt,0,.3),()=>{panel(-340,-170,680,340,{bd:'#9aa4b8'});text('당구 요금',0,-90,{f:'D',s:52});text('17년에 +50%',0,30,{f:'D',s:84,c:'#c9ced9'});});
      group(1360,450,1,0,P(lt,.4,.3),()=>{panel(-340,-170,680,340,{bd:'#FFD23F'});text('전기요금',0,-90,{f:'D',s:52});text('3년에 +30%',0,30,{f:'D',s:84,c:'#FFD23F'});});
      if(T>FR('e6',.5))stampBox('오르는 속도가 다르다',960,760,T-FR('e6',.5),{s:56,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 당구장 수 (어두운 장) ── */
  count:{draw(){
    sub('n1','n1',lt=>{billiardHall(560,480,.62,{closed:1});bubble(1360,420,820,180,'당구장은 얼마나 남았나',{k:E.back(P(lt,.1,.4))+.001,s:58});});
    sub('n2','n2',()=>{text('대전 당구장 수 (국세통계 · 매년 10월)',960,165,{f:'D',s:50,c:C.gold});
      const D=[['2017',545],['2022',500],['2023',483],['2024',472],['2025',466]];const q=K('n2',0);
      D.forEach(([y,v],i)=>{const t=i===4?(q>=0?q:-1):T-CT('n2')-.3-i*.35;if(t<0){if(i===4)text('?',400+i*280,560,{f:'D',s:70,c:C.gold});return;}const k=E.out(P(t,0,.5));const x=400+i*280,base=760,hh=(v-300)*1.6*k;vCash(x-90,base-hh,180,hh,i===4?C.red:'#5b6275');text(v+'곳',x,base-hh-34,{f:'D',s:46,c:i===4?C.red:'#c9ced9',alpha:k});text(y+'년',x,base+36,{s:30,w:900,c:C.dim});});
      text('막대는 300곳부터',1660,240,{s:24,w:800,c:C.dim});
      srcLine('대전일보 2025.12.7 (국세통계포털 · 대전 지역)');});
    sub('n3','n3',()=>{text('인천에서 문 닫은 당구장 (한 해 폐업)',960,165,{f:'D',s:50,c:C.gold});
      const D=[['2023',43],['2024',78],['2025',144]];const q=K('n3',0);
      D.forEach(([y,v],i)=>{const t=i===2?(q>=0?q:-1):T-FR('n3',.2+i*.15);if(t<0){if(i===2)text('?',560+i*400,560,{f:'D',s:70,c:C.gold});return;}const k=E.out(P(t,0,.5));const x=560+i*400,base=760,hh=v*3.4*k;vCash(x-100,base-hh,200,hh,i===2?C.red:'#5b6275');text(v+'곳',x,base-hh-34,{f:'D',s:48,c:i===2?C.red:'#c9ced9',alpha:k});text(y+'년',x,base+36,{s:30,w:900,c:C.dim});});
      if(T>FR('n3',.8))stampBox('2년 만에 3배 넘게',1540,280,T-FR('n3',.8),{s:46,c:C.red,bg:'rgba(40,0,0,.85)'});
      srcLine('인천일보 2026.3.4 (행정안전부 인허가 데이터 · 인천 지역)');});
    sub('n4','n4',lt=>{billiardHall(500,480,.6,{closed:1});
      bubble(1320,420,940,260,'',{k:E.back(P(lt,.1,.4))+.001});
      group(1320,420,E.back(P(lt,.1,.4))+.001,0,1,()=>{text('"보증금도 얼마 안 되고',0,-60,{f:'D',s:44,c:C.ink,max:860});text('시설투자금도 들 게 없어서',0,0,{f:'D',s:44,c:C.ink,max:860});text('초기 비용이 없는데도 문의가 많지 않다"',0,60,{f:'D',s:40,c:'#d62f2f',max:860});});
      text('— 인천의 한 당구장 운영자',1320,640,{s:32,w:900,c:C.dim,alpha:P(lt,.6,.3)});
      srcLine('인천일보 2026.3.4');});
    sub('n5','n5b',()=>{text('두 숫자는 따로 본다',960,170,{f:'D',s:54,c:C.gold});
      group(560,420,1,0,1,()=>{panel(-360,-150,720,300,{bd:'#8fb6ff'});text('대전',0,-80,{f:'D',s:52});text('국세통계 사업자 수',0,0,{s:36,w:900,c:C.dim});text('545 → 466곳',0,70,{f:'D',s:56,c:'#8fb6ff'});});
      group(1360,420,1,0,1,()=>{panel(-360,-150,720,300,{bd:C.red});text('인천',0,-80,{f:'D',s:52});text('인허가 폐업 건수',0,0,{s:36,w:900,c:C.dim});text('43 → 144곳',0,70,{f:'D',s:56,c:C.red});});
      if(L('n5b')<0)text('집계 기준이 달라 한 그래프로 잇지 않음 · 방향은 같다',960,680,{f:'D',s:40,alpha:P(T,FR('n5',.5),.3)});
      else pill('당구비 인상 폭 공식 통계 = 못 찾음 → 1,500원은 예시',960,680,{s:36,bg:'rgba(255,255,255,.92)',alpha:P(L('n5b'),0,.3)});});
    sub('n6','n6',lt=>{billiardHall(560,480,.62,{closed:1});
      ['요금이','시급을 못 따라가는 사이','당구장은 줄었다'].forEach((s,i)=>text(s,1400,300+i*120,{f:'D',s:58,c:i===2?C.gold:'#fff',alpha:P(lt,.2+i*.5,.3),max:900}));});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('예시 당구장 사장님 한 달 몫 · 하나씩만 바꿔 보면',960,165,{f:'D',s:44,c:C.gold,alpha:P(a,0,.3),max:1800});
    if(T<CT('l2'))text('바꿀 수 있는 숫자는?',960,500,{f:'D',s:90,alpha:P(a,.2,.3)});
    const rows=[['지금',180,CT('l1')+1.2,'180만','l1'],['시급 +3%',174.6,KT('l2',0),'174만 6천','l2'],['전기 +10%',171,KT('l3',0),'171만','l3'],['10분 +100원',234,KT('l4',0),'234만','l4'],['+100원 · 손님 −10%',147.6,KT('l5',0),'147만 6천','l5'],['가동 시간 −10%',99,KT('l6',0),'99만','l6']];
    const Z=600,SCL=4.4;
    if(T>=CT('l1')+1){ctx.save();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;line(Z,215,Z,760);ctx.restore();}
    if(T>=CT('l2')){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(Z+180*SCL,215,Z+180*SCL,760);ctx.restore();}
    rows.forEach(([l,v,t,lab,id],i)=>{if(T<CT('l1')+1.1)return;if(L(id)<0)return;const y=260+i*88;const bad=v<180;text(l,60,y,{a:'left',s:36,w:900,max:520,c:bad?'#ffb3b3':'#fff'});
      if(T<t){text('?',Z+60,y,{f:'D',s:52,c:C.gold});return;}const k=E.out(P(T,t,.6));
      const w=Math.max(6,v*SCL*k),col=bad?C.red:i===0?'#5b6275':C.green;ctx.fillStyle=col;rr(Z,y-30,w,60,14);ctx.fill();
      text(lab,Z+w+18,y+2,{a:'left',f:'D',s:44,c:col==='#5b6275'?'#c9ced9':col,alpha:k});});
    if(L('l6b')>=0&&L('l7')<0){group(960,820,1,0,P(L('l6b'),0,.3),()=>{panel(-760,-46,1520,92,{bg:'rgba(6,13,32,1)',bd:'#8fb6ff',lw:4});text('손님 −10%: 올린 쪽 147만 6천 · 그대로 둔 쪽 99만',0,4,{f:'D',s:40,c:'#8fb6ff',max:1480});});}
    else if(L('l7')>=0){group(960,820,1,0,P(L('l7'),0,.3),()=>{panel(-760,-46,1520,92,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text(T>FR('l7',.45)?'가장 큰 손잡이 = 요금보다 당구대가 도는 시간':'+100원의 본전: 손님 감소 6.25%까지 (900 → 843.75시간)',0,4,{f:'D',s:40,c:C.gold,max:1480});});}
    else if(T>=CT('l2'))srcLine('예시 계산 · 한 번에 하나씩 · 기준 한 달 900시간 × 9,000원 · 고정비 630만',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('요금을 정하기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','마지막 인상 해 + 물가','그해 요금 × 물가 배율','오늘: 1,000원 → 1,428원'],['k3','한 시간 요금 ÷ 알바 시급','요금이 알바 몇 분을 사나','오늘 가게: 52분'],['k4','당구대 하루 가동 시간','열 대 합계 · 요일별로','오늘 가게: 하루 30시간'],
      ['k5','kWh당 전기요금','고지서 3년 전 vs 지금','약 125원 → 약 160원'],['k6','버틸 수 있는 손님 감소율','올린 요금으로 지금 몫을 내려면','오늘 가게 +100원: 6.25%']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:34,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-760,-280,1520,540,{bg:'rgba(6,13,32,1)',bd:C.gold});text('대대 10분 2,000원 · 여섯 대 · 하루 24시간 · 30일',0,-200,{f:'D',s:42,max:1440});text('고정비 700만 원 → 요금 10% 올리면 손님 몇 %까지 버틸까?',0,-140,{f:'D',s:40,max:1440});
      const b=L('k7b');
      if(b>=0)text('864만 ÷ 1만 3,200원 = 654.5시간 (지금 720시간)',0,-40,{f:'D',s:44,alpha:P(b,0,.3),max:1440});
      const k=K('k7b',0);if(k>=0)text('약 9%',0,90,{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});else text('?',0,90,{f:'D',s:110,c:C.gold});
      if(L('k7c')>=0)text('지금 몫 164만 원 · 손님이 9% 넘게 빠지면 올린 게 손해',0,210,{s:34,w:900,c:'#6FD3FF',alpha:P(L('k7c'),0,.3),max:1440});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('당구 한 시간 9,000원',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      const k=P(L('z2'),0,4.5);billGrid(520,500,{on:kk=>clamp(k*5-BL.findIndex(g=>g.k===kk))});
      const b=L('z2b');if(b>=0){[['요금표','+50%','#c9ced9'],['물가로','+5%','#FFD23F'],['시급으로','반값',C.red]].forEach(([l,v,col],i)=>{const kk=P(b,i*.7,.3);if(kk<=0)return;group(1420,300+i*170,1,0,kk,()=>{panel(-380,-70,760,140,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-330,4,{a:'left',f:'D',s:46});text(v,330,4,{a:'right',f:'D',s:70,c:col});});});}
    }else{
      billiardHall(620,480,.6,{price:'1,500원'});poolTable(1250,470,.5,{});drawMascot(1650,600,.55,'happy');
      stampBox('10분 1,500원 = 시급으로 재면 반값',960,800,c,{s:54,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-500,-70,1000,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 우리 동네 당구비는 10분에 얼마?',0,4,{s:38,w:900,c:C.ink,max:940});});
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
