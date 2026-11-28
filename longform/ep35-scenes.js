/* ════════════════════════════════════════════════════════════════════
   장면 (LF.35 동네 고깃집 부가세 계산서 —
   부가가치세법 [법률 제21065호, 2026.1.2 시행] 제30조(세율 10%) · 제42조(의제매입 · 개인 음식점 108분의 8, 과세표준 2억 이하 2026.12.31까지 109분의 9) ·
   제46조(카드 등 매출 1.3%, 연 1,000만 한도, 2026.12.31까지) · 제48조③(예정고지 직전 과세기간 납부세액의 50% · 50만 원 미만 징수 안 함) · ④(사업 부진 예정신고) · 제49조(끝난 뒤 25일)
   국세청 1분기 국세통계(한국세정신문 2025.3.28): 2024년 말 정리중 체납 19조 4,000억 · 부가세 8조 4,000억 43.5% · 소득세 4조 20.8% · 법인세 2조 1,000억 11%
   2026 1기 확정(한국세정신문 2026.7.14): 692만 · 개인 일반 556만 · 103만 명 2개월 직권 연장(매출 급감 소상공인 43만 1,000)
   예시 가게: 월 매출 3,300만(부가세 포함) · 면세 재료 1,090 · 과세 매입 440 · 월세 220 · 그 밖 950 → 통장 600 · 부가세 300 − 40 − 20 − 90 − 42.9 = 107.1
   중심 그림: 고깃집 앞모습 · 통장 · 만 원짜리 330장(30장 × 11줄, 한 줄 = 부가세) · 고지서 · 석 달 톱니 그래프.
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['3','3','0','0','0','0','0','0','÷','1','1','='];   // 33,000,000 ÷ 11 = 3,000,000 (33 뒤 0 여섯)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CVAT='#FF4D4D', CBACK='#8d96a8', CUI='#35E08A', CCARD='#6FA8FF', CMY='#35E08A', CY='#FFC531', CREST='#5d6678', CMEAT='#d9534f';
/* 고깃집 앞모습 (상표 없음) · o.dim 손님 없음 */
function shop35(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,232,300,14,0,0,7);ctx.fill();
  ctx.fillStyle='#7a3b2a';rr(-260,-200,520,430,10);ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=3;for(let r=0;r<9;r++){const yy=-190+r*46;line(-260,yy,260,yy);for(let c2=0;c2<6;c2++){const xx=-260+c2*104+(r%2?52:0);line(xx,yy,xx,yy+46);}}
  ctx.fillStyle='#1d1410';rr(-240,-185,480,80,8);ctx.fill();
  text('숯불구이',0,-143,{f:'D',s:56,c:o.dim?'#8a7a68':'#FFC531'});
  [-200,200].forEach(px=>{ctx.fillStyle=o.dim?'#6b2b2b':'#e0242c';ctx.beginPath();ctx.ellipse(px,-70,26,34,0,0,7);ctx.fill();ctx.fillStyle='#1d1410';ctx.fillRect(px-14,-108,28,8);ctx.fillRect(px-14,-40,28,8);});
  ctx.fillStyle=o.dim?'#3a3f4a':'#ffd9a0';rr(-235,-20,300,190,6);ctx.fill();
  ctx.strokeStyle='#2a1a12';ctx.lineWidth=8;rr(-235,-20,300,190,6);ctx.stroke();line(-85,-20,-85,170);
  if(!o.dim){[[-160,110],[-10,110]].forEach(([gx,gy])=>{ctx.fillStyle='#3b3b3b';ctx.beginPath();ctx.ellipse(gx,gy,50,16,0,0,7);ctx.fill();ctx.fillStyle=CMEAT;rr(gx-30,gy-14,26,10,3);ctx.fill();rr(gx+4,gy-12,26,10,3);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;for(let i=0;i<3;i++){const sx=gx-20+i*20,ph=T*2+i;ctx.beginPath();ctx.moveTo(sx,gy-20);ctx.quadraticCurveTo(sx+Math.sin(ph)*10,gy-50,sx,gy-80);ctx.stroke();}});}
  ctx.fillStyle='#3a2418';rr(95,-20,140,248,6);ctx.fill();ctx.fillStyle='#FFC531';ctx.beginPath();ctx.arc(210,110,9,0,7);ctx.fill();
});}
/* 통장 (펼친 모습) · rows = [[날짜·내용, 금액, 색]] */
function book35(x,y,s,rows,o={}){group(x,y,s,o.rot??-.02,o.alpha??1,()=>{const w=o.w||620,h=o.h||(170+rows.length*70);
  ctx.fillStyle='rgba(0,0,0,.35)';rr(-w/2+12,-h/2+14,w,h,12);ctx.fill();
  ctx.fillStyle='#2b6cb0';rr(-w/2,-h/2,w,h,12);ctx.fill();ctx.fillStyle='#f6f9ff';rr(-w/2+14,-h/2+70,w-28,h-84,8);ctx.fill();
  text(o.title||'사업용 통장',0,-h/2+38,{f:'D',s:36,c:'#fff'});
  rows.forEach(([l,r,col,t0],i)=>{if(t0!==undefined&&T<t0)return;const yy=-h/2+120+i*70,k=t0!==undefined?P(T,t0,.3):1;ctx.save();ctx.globalAlpha*=k;
    text(l,-w/2+40,yy,{a:'left',f:'D',s:o.ls||30,c:'#2b2f3a',max:w*.55});text(r,w/2-40,yy,{a:'right',f:'D',s:o.rs||38,c:col||'#2b2f3a',max:w*.42});
    ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=2;line(-w/2+30,yy+32,w/2-30,yy+32);ctx.restore();});
});}
/* 만 원짜리 한 장 */
function bill35(x,y,w,h,col,o={}){ctx.save();ctx.globalAlpha*=(o.alpha??1);ctx.fillStyle=col;rr(x-w/2,y-h/2,w,h,3);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x+w*.22,y,h*.22,h*.3,0,0,7);ctx.stroke();ctx.restore();}
/* 종이 서류 (제목 + 줄들) */
function doc35(x,y,s,title,lines,o={}){group(x,y,s,o.rot??-.02,o.alpha??1,()=>{const w=o.w||620,h=o.h||(150+lines.length*74);
  ctx.fillStyle='rgba(0,0,0,.35)';rr(-w/2+12,-h/2+14,w,h,10);ctx.fill();ctx.fillStyle='#fdfbf5';rr(-w/2,-h/2,w,h,10);ctx.fill();
  ctx.fillStyle=o.head||'#2f3a52';rr(-w/2,-h/2,w,84,10);ctx.fill();ctx.fillRect(-w/2,-h/2+60,w,24);text(title,0,-h/2+44,{f:'D',s:o.ts||40,c:'#fff',max:w-40});
  lines.forEach(([l,r,col,t0],i)=>{if(t0!==undefined&&T<t0)return;const yy=-h/2+130+i*74,k=t0!==undefined?P(T,t0,.3):1;ctx.save();ctx.globalAlpha*=k;
    text(l,-w/2+34,yy,{a:'left',f:'D',s:o.ls||32,c:'#2b2f3a',max:w*.58});if(r)text(r,w/2-34,yy,{a:'right',f:'D',s:o.rs||36,c:col||'#2b2f3a',max:w*.42});
    ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=2;line(-w/2+30,yy+34,w/2-30,yy+34);ctx.restore();});
});}
/* 가격표 */
function tag35(x,y,s,str,col,o={}){group(x,y,s,o.rot??-.05,o.alpha??1,()=>{ctx.font=`400 ${o.fs||48}px ${FD}`;const w=ctx.measureText(str).width+70,h=(o.fs||48)*1.6;
  const path=()=>{ctx.beginPath();ctx.moveTo(-w/2,-h/2);ctx.lineTo(w/2-20,-h/2);ctx.lineTo(w/2+18,0);ctx.lineTo(w/2-20,h/2);ctx.lineTo(-w/2,h/2);ctx.closePath();};
  ctx.fillStyle='#fff';path();ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=6;path();ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(w/2-14,0,7,0,7);ctx.fill();
  if(o.label)text(o.label,-w/2+16,-h/2-24,{a:'left',f:'D',s:26,c:col});
  text(str,-10,3,{f:'D',s:o.fs||48,c:col});});}
/* 화살표 */
function arrow35(x0,y0,x1,y1,col,k=1,o={}){if(k<=0)return;ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=o.lw||10;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+(x1-x0)*k,y0+(y1-y0)*k);ctx.stroke();
  if(k>.95){const ang=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-30*Math.cos(ang-.45),y1-30*Math.sin(ang-.45));ctx.lineTo(x1-30*Math.cos(ang+.45),y1-30*Math.sin(ang+.45));ctx.closePath();ctx.fill();}
  ctx.restore();}
/* 결과 상자 */
function rowBox(x,y,w,l,v,col,o={}){group(x,y,1,0,o.alpha??1,()=>{panel(-w/2,-50,w,100,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-w/2+36,4,{a:'left',f:'D',s:o.ls||34,max:w*.55});text(v,w/2-36,4,{a:'right',f:'D',s:o.vs||42,c:col,max:w*.42});});}
/* 법 조문 종이 */
function lawCard(x,y,w,h,head,lines,o={}){group(x,y,1,0,o.alpha??1,()=>{panel(-w/2,-h/2,w,h,{bg:'#fdfbf5',bd:'#2f3a52',lw:5,r:14});
  text(head,-w/2+40,-h/2+46,{a:'left',f:'D',s:30,c:'#59627c'});
  lines.forEach(([s,col],i)=>text(s,0,-h/2+110+i*62,{f:'D',s:o.s||40,c:col||'#2b2f3a',max:w-80}));});}
/* 부가세 한 줄 (30장) — 색 배열로 */
function vatRow(y,cols,o={}){const n=30,BW=o.bw||52,BH=o.bh||70,G=4,X0=960-(n*BW+(n-1)*G)/2+BW/2;
  for(let i=0;i<n;i++){const c=cols(i);if(!c)continue;bill35(X0+i*(BW+G),y,BW,BH,c[0],{alpha:c[1]??1});}
  return {x:i=>X0+i*(BW+G),bw:BW};}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3')){
      const a=L('o1'),q=K('o1',0);
      shop35(430,520,1.0*E.back(P(a,0,.5))+.001,{});
      text('동네 고깃집 · 그림은 예시',430,815,{s:26,w:800,c:C.dim,alpha:P(a,.4,.3)});
      book35(1330,400,1,[['한 달 들어온 돈','+3,300만'],['재료·월세·인건비','−2,700만'],['남은 돈',q>=0?'600만 원':'?',q>=0?'#1f9d5b':'#c08a00']],{alpha:P(a,.3,.3),w:760});
      if(L('o2')>=0){const k=K('o2',0);
        if(k>=0)group(1330,700,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>tag35(0,0,1.1,'석 달마다 −321만 원',CVAT,{label:'부가가치세'}));else text('?',1330,700,{f:'D',s:90,c:C.gold});}
      srcLine('예시 가정 · 월 매출 3,300만 원 (부가세 포함) · 남는 돈 600만 원 · 부가세 계산은 뒤에서 (python3)');
    }else if(T<CT('o3c')){
      const b=L('o3'),q=K('o3',0),X0=260,WW=1400,Y=420;
      text('통장에 남는 600만 원, 다 사장님 몫일까',960,180,{f:'D',s:54,c:'#fff',alpha:P(b,0,.3),max:1800});
      ctx.fillStyle=CMY;rr(X0,Y-70,WW*E.out(P(b,0,.5)),140,16);ctx.fill();
      text('600만 원',X0+WW/2,Y-110,{f:'D',s:52,alpha:P(b,.2,.3)});
      if(T>FR('o3',.25)){const k=E.out(P(T,FR('o3',.25),.5)),w=WW*107.1/600;ctx.fillStyle=CVAT;rr(X0+WW-w*k,Y-70,w*k,140,16);ctx.fill();text('부가세 107만',X0+WW-w/2,Y+110,{f:'D',s:38,c:CVAT,alpha:k});}
      text(q>=0?'진짜 몫 492만 9,000원':'?',X0+(WW-WW*107.1/600)/2,Y+4,{f:'D',s:48,c:'#06331d'});
      if(q>=0)stampBox('600만 원 중 107만 원은 맡아 둔 돈',960,700,q,{s:52,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('예시 계산 (python3): 부가세 300 − 산 물건 60 − 면세 재료 90 − 카드 공제 42.9 = 107.1만 · 600 − 107.1 = 492.9만');
    }else{
      const k0=L('o3c'),k9=L('o4'),k10=L('o5');
      if(k9<0){shop35(560,480,.9,{alpha:P(k0,0,.3)});drawMascot(1400,480,.8,'think',{alpha:P(k0,.3,.3)});text('손님이 낸 돈, 얼마가 사장님 돈일까?',960,820,{f:'D',s:44,c:C.gold,alpha:P(k0,.5,.3)});}
      else{
        text('통장에서 미리 떼어 둘 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
        for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
        if(k10>=0)['법 조문 · 부가가치세법','통계 · 국세청 발표 인용 보도','가게 숫자 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.8,.3);if(k>0)pill(s,360+i*600,740,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});
        if(k10>=0&&T>FR('o5',.7))pill('이번 편은 부가세만 넣은 예시 · 소득세 제외',960,830,{s:28,alpha:P(T,FR('o5',.7),.3),bg:'rgba(255,197,49,.95)'});}
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('동네 고깃집 부가세 계산서',960,200,{f:'D',s:100,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('매출 3,300만 원 · 한 달 107만 1,000원 · 석 달마다 321만 원',960,325,{s:44,w:900,alpha:P(a,.3,.3),max:1780});
    shop35(760,640,.62,{alpha:P(a,.2,.3)});drawMascot(1450,640,.7,'think',{alpha:P(a,.3,.3)});
  }},
  /* ── 손님이 낸 돈의 11분의 1 ── */
  news:{draw(){
    sub('p1','p3',()=>{
      text('부가가치세법 제30조 (세율)',960,170,{f:'D',s:52,c:C.gold});
      lawCard(960,300,1500,150,'법률 제21065호 · 2026.1.2 시행',[['부가가치세의 세율은 10퍼센트로 한다.',K('p1',0)>=0?'#b5451b':'#2b2f3a']],{alpha:P(L('p1'),0,.3),s:46});
      if(L('p2')>=0){const q=K('p2',0),X0=360,WW=1200,Y=540;
        text('손님이 낸 1만 1,000원',960,450,{f:'D',s:40,alpha:P(L('p2'),0,.3)});
        ctx.fillStyle=CREST;rr(X0,Y-55,WW*10/11,110,14);ctx.fill();text('가게 몫 1만 원',X0+WW*5/11,Y+4,{f:'D',s:42});
        if(q>=0){ctx.fillStyle=CVAT;rr(X0+WW*10/11+6,Y-55,(WW/11-6)*E.out(P(q,0,.4)),110,14);ctx.fill();text('1,000원',X0+WW*21/22,Y+100,{f:'D',s:38,c:CVAT});text('부가세',X0+WW*21/22,Y+4,{f:'D',s:30,c:'#fff'});}
        else text('?',X0+WW*21/22,Y,{f:'D',s:60,c:C.gold});}
      if(L('p3')>=0)stampBox('10%가 아니라 11분의 1',960,750,K('p3',0)>=0?K('p3',0):-1,{s:56,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('부가가치세법 제30조 (casenote 사본 · 법률 제21065호, 2026.1.2 시행) · 11,000 나누기 11 = 1,000 · 메뉴판 값이 부가세 포함이라는 건 예시 가정');});
    sub('p4','p5',()=>{
      text('2026년 1기 확정신고 대상 (국세청)',960,170,{f:'D',s:50,c:C.gold});
      const q=K('p4',0);
      [['전체 사업자','692만 명',CREST,CT('p4')+.3],['개인 일반과세자',q>=0?'556만 명':'?',CY,q>=0?KT('p4',0):1e9]].forEach(([l,v,col,t0],i)=>{const x=600+i*720;group(x,360,1,0,P(L('p4'),.1+i*.3,.3),()=>{panel(-320,-120,640,240,{bg:'rgba(6,13,32,1)',bd:T>=t0?col:'rgba(255,255,255,.3)'});text(l,0,-60,{f:'D',s:36,c:C.dim});text(v,0,40,{f:'D',s:80,c:i?CY:'#fff'});});});
      if(L('p5')>=0){const k=L('p5');
        [['손님',300],['사장님 통장',960],['나라',1620]].forEach(([s,x],i)=>{if(k<i*.8)return;group(x,650,1,0,P(k,i*.8,.3),()=>{panel(-200,-60,400,120,{bg:'rgba(6,13,32,1)',bd:i===1?CY:'rgba(255,255,255,.4)'});text(s,0,4,{f:'D',s:40,c:i===1?CY:'#fff'});});});
        arrow35(510,650,750,650,'#fff',P(k,.5,.4),{lw:8});arrow35(1170,650,1410,650,'#fff',P(k,1.3,.4),{lw:8});
        text('받는 날',630,600,{f:'D',s:28,c:C.dim,alpha:P(k,.6,.3)});text('몇 달 뒤',1290,600,{f:'D',s:28,c:C.dim,alpha:P(k,1.4,.3)});
        if(K('p5',0)>=0)stampBox('그 사이 돈은 사장님 통장에',960,790,K('p5',0),{s:46,c:CY,bg:'rgba(40,30,0,.92)'});}
      srcLine('한국세정신문 2026.7.14 「이달 부가세 확정신고시 유의사항 3가지」 · 신고 대상 692만 (전년 679만) · 개인 일반과세자 556만 · 법인 136만');});
  }},
  /* ── 예시 고깃집의 한 달 ── */
  setup:{draw(){
    text('예시 고깃집 · 한 달 장부 (부가세 포함 금액)',960,170,{f:'D',s:50,c:C.gold,max:1800});
    shop35(420,500,.85,{});
    const q1=K('s1',0),q2=K('s2',0),q3=K('s3',0),s2=CT('s2');
    doc35(1270,480,.95,'한 달 장부 (예시)',[['매출',q1>=0?'3,300만':'?',q1>=0?'#1f6fb0':'#c08a00'],['고기·채소·쌀','−1,090만',CMEAT,s2+.2],['술·숯·가스·전기','−440만','#59627c',FR('s2',.45)],['월세',q2>=0?'−220만':'?','#59627c',FR('s2',.8)],['인건비·그 밖','−950만','#59627c',CT('s3')+.3],['통장에 남는 돈',q3>=0?'600만 원':'?',q3>=0?'#1f9d5b':'#c08a00',CT('s3')+1]],{w:820,ls:32,rs:38});
    if(L('s4')>=0)pill('반년 매출 (부가세 뺀 공급가액) 3,000만 × 6 = 1억 8,000만 원',1270,830,{s:28,alpha:P(L('s4'),0,.3),bg:'rgba(255,255,255,.94)'});
    srcLine('예시 가정 · 3,300 − 1,090 − 440 − 220 − 950 = 600만 (python3) · 고깃집 숫자는 통계가 아니라 계산을 보이기 위한 예시');
  }},
  /* ── 3,300만 원 쪼개기 (330장 = 30장 × 11줄) ── */
  cut:{draw(){
    text('매출 3,300만 원 = 만 원짜리 330장',960,170,{f:'D',s:52,c:C.gold,max:1800});
    const k1=L('t1'),q2=K('t2',0),q3=K('t3',0);
    const CW=50,CH=28,GX=6,GY=8,COLS=30,X0=960-(COLS*CW+(COLS-1)*GX)/2+CW/2,Y0=250;   // 11줄 × 36 = 396 → y 236 ~ 632
    for(let i=0;i<330;i++){const r=Math.floor(i/COLS),c2=i%COLS,k=P(k1,.1+i*.004,.2);if(k<=0)continue;
      let col=CREST;if(r===10&&q2>=0&&T>=KT('t2',0)+c2*.02)col=CVAT;
      if(r===10&&q3>=0&&c2<6&&T>=KT('t3',0)+c2*.1)col=CBACK;
      bill35(X0+c2*(CW+GX),Y0+r*(CH+GY),CW,CH,col,{alpha:k*(col===CBACK?.45:1)});}
    if(T>FR('t1',.6)&&q2<0)text('한 줄에 30장 · 열한 줄',960,690,{f:'D',s:40,c:'#fff'});
    if(L('t2')>=0&&q2<0)text('?',1800,Y0+10*(CH+GY),{f:'D',s:50,c:C.gold});
    if(q2>=0)text('맨 아래 한 줄 30장 = 부가세',960,Y0+10*(CH+GY)+56,{f:'D',s:34,c:CVAT,alpha:P(q2,0,.3)});
    if(q2>=0&&L('t3')<0)group(960,760,1,0,P(q2,.3,.3),()=>{panel(-700,-50,1400,100,{bg:'rgba(6,13,32,1)',bd:CVAT});text('3,300만 나누기 11 = 300만 원 (30장)',0,4,{f:'D',s:42});});
    if(L('t3')>=0){group(960,760,1,0,P(L('t3'),0,.3),()=>{panel(-820,-56,1640,112,{bg:'rgba(6,13,32,1)',bd:CBACK});
      text('술·숯·가스·전기 440만 안에 40만 + 월세 220만 안에 20만',0,-18,{f:'D',s:32,c:'#d6dae3',max:1560});
      text(q3>=0?(L('t4')>=0?'300 − 60 = 240만 원 · 그런데 한 줄이 더':'산 물건의 부가세 60만 원 (6장) 은 빼 준다'):'',0,32,{f:'D',s:36,c:L('t4')>=0?CY:'#fff',max:1560});});}
    srcLine('예시 계산 (python3): 3,300 ÷ 11 = 300 · 440 ÷ 11 = 40 · 220 ÷ 11 = 20 · 300 − 60 = 240 (만 원) · 월세는 부가세가 붙는 상가 임대 예시');
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='33,000,000 ÷ 11 =';bigS='3,000,000';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:22,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:72,f:'D',c:done?'#b5451b':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('매출 3,300만 원 나누기 11',1320,180,{f:'D',s:46,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0);
    if(L('c2')>=0)rowBox(1320,340,860,'손님이 맡긴 부가세',q2>=0?'300만 원':'?',q2>=0?CVAT:C.gold);
    if(dt>=0&&q2<0)group(1300,650,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(L('c3')>=0)group(1320,620,1,0,P(L('c3'),0,.3),()=>{panel(-470,-110,940,220,{bg:'rgba(6,13,32,1)',bd:CMEAT});text('고기값 1,090만 원 안에는',0,-40,{f:'D',s:38,c:C.dim,max:900});text('부가세가 얼마?',0,30,{f:'D',s:50,c:'#fff',max:900});text('?',0,90,{f:'D',s:40,c:C.gold});});
  }},
  /* ── 고기값엔 부가세가 없다 ── */
  meat:{draw(){
    sub('m1','m2',()=>{
      text('고기·채소·쌀 1,090만 원 안의 부가세',960,170,{f:'D',s:50,c:C.gold,max:1800});
      group(560,480,1,0,P(L('m1'),0,.3),()=>{ctx.fillStyle='#e8e4dc';rr(-300,-140,600,280,30);ctx.fill();
        for(let i=0;i<6;i++){const x=-210+(i%3)*150,y=-50+Math.floor(i/3)*110;ctx.fillStyle=CMEAT;rr(x-60,y-35,120,70,16);ctx.fill();ctx.fillStyle='#f6d5cc';rr(x-60,y-35,120,18,8);ctx.fill();}});
      const q=K('m1',0);
      if(q>=0)group(1340,400,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>tag35(0,0,1.2,'부가세 0원',CUI,{label:'가공하지 않은 고기·채소·쌀 = 면세'}));else text('?',1340,400,{f:'D',s:100,c:C.gold});
      if(L('m2')>=0)group(1340,640,1,0,P(L('m2'),0,.3),()=>{panel(-440,-70,880,140,{bg:'rgba(6,13,32,1)',bd:CY});text('낸 부가세가 없으니 뺄 것도 없다?',0,-18,{f:'D',s:34,c:'#fff'});text(T>FR('m2',.55)?'그런데 음식점엔 특례가 있다':'',0,36,{f:'D',s:34,c:CY});});
      srcLine('미가공 식료품(식육·채소·곡물 등)은 부가가치세 면세 (부가가치세법 제26조) · 영상의 1,090만 원은 예시 가정');});
    sub('m3','m4',()=>{
      text('부가가치세법 제42조 · 의제매입세액 공제',960,170,{f:'D',s:50,c:C.gold,max:1800});
      lawCard(960,330,1600,200,'면세로 산 재료값 × 정해진 비율 = 낸 셈 치고 빼 주는 돈',[['개인 음식점 108분의 8',K('m4',0)>=0?'#59627c':'#2b2f3a'],['과세표준 2억 원 이하 · 2026년 12월 31일까지 109분의 9',K('m4',0)>=0?'#b5451b':'#2b2f3a']],{alpha:P(L('m3'),0,.3),s:38});
      if(K('m3',0)>=0)pill('낸 셈 치고 빼 준다',960,500,{s:34,bg:'rgba(255,197,49,.95)'});
      if(L('m4')>=0&&T>FR('m4',.65))group(960,660,1,0,P(T,FR('m4',.65),.3),()=>{panel(-760,-60,1520,120,{bg:'rgba(6,13,32,1)',bd:CUI});text('예시 가게 반년 1억 8,000만 원 → 2억 원 이하 → 109분의 9',0,4,{f:'D',s:38,c:CUI,max:1460});});
      srcLine('부가가치세법 제42조 ① 표 (casenote 사본 · 법률 제21065호) · 2026 세제개편안: 우대 기한 2028.12.31까지 연장안 (한국세정신문 2026.8.5, 국회 통과 전) · 공제 한도(시행령)는 계산에 넣지 않음');});
    sub('m5','m7',()=>{
      text('부가세 한 줄 30장에서 빼 주는 것',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const q5=K('m5',0),q6=K('m6',0),q7=K('m7',0);
      const cols=i=>{if(i<6)return[CBACK,.45];if(i<15&&q5>=0&&T>=KT('m5',0)+(i-6)*.08)return[CUI,1];if(i<19&&q6>=0&&T>=KT('m6',0)+(i-15)*.1)return[CCARD,1];if(i===19&&q6>=0&&T>=KT('m6',0)+.4)return[CCARD,.6];return[CVAT,1];};
      const g=vatRow(330,cols,{bw:52,bh:96});
      [['산 물건 60만',0,6,CBACK,0],['면세 재료 90만',6,15,CUI,q5],['카드 42.9만',15,19.3,CCARD,q6]].forEach(([s,a0,a1,col,q])=>{if(q<0)return;const x=(g.x(a0)+g.x(Math.ceil(a1)-1))/2;text(s,x,440,{f:'D',s:28,c:col,max:(a1-a0)*56});});
      if(q5>=0&&L('m6')<0)rowBox(960,560,1300,'1,090만 × 109분의 9','90만 원',CUI);
      if(q6>=0&&L('m7')<0)rowBox(960,560,1300,'카드·현금영수증 매출 3,300만 × 1.3%','42만 9,000원',CCARD);
      if(L('m6')>=0&&L('m7')<0)pill('연 1,000만 원 한도 · 2026년 12월 31일까지 (제46조)',960,680,{s:28,alpha:P(L('m6'),0,.3),bg:'rgba(255,255,255,.94)'});
      if(L('m7')>=0){rowBox(960,560,1300,'300 − 60 − 90 − 42.9',q7>=0?'한 달 107만 1,000원':'?',q7>=0?CVAT:C.gold,{alpha:P(L('m7'),0,.3)});
        if(T>FR('m7',.75))stampBox('매출의 3.25%',960,720,T-FR('m7',.75),{s:56,c:CVAT,bg:'rgba(40,10,10,.92)'});}
      srcLine('예시 계산 (python3): 1,090 × 9 ÷ 109 = 90 · 3,300 × 0.013 = 42.9 (1년 514.8, 한도 안) · 300 − 60 − 90 − 42.9 = 107.1 · 107.1 ÷ 3,300 = 3.25% · 부가가치세법 제46조 ①');});
  }},
  /* ── 석 달마다 오는 고지서 ── */
  cal:{draw(){
    const X0=200,WW=1520,MW=WW/12;
    const marks=[[0,'확정',CVAT],[3,'예정고지',CY],[6,'확정',CVAT],[9,'예정고지',CY]];
    if(L('n5')<0){
      text('부가세가 나가는 달 (개인 일반과세자)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      for(let m=0;m<12;m++){const x=X0+m*MW;panel(x+4,250,MW-8,110,{bg:'rgba(255,255,255,.06)',r:12});text((m+1)+'월',x+MW/2,305,{f:'D',s:34,c:'#c9ced9'});}
      const on=[L('n1')>=0&&T>FR('n1',.6),L('n2')>=0&&K('n2',0)>=0];
      marks.forEach(([m,l,col],i)=>{const show=(i%2===0)?on[0]:on[1];if(!show)return;const x=X0+m*MW;ctx.save();ctx.strokeStyle=col;ctx.lineWidth=6;rr(x+4,250,MW-8,110,12);ctx.stroke();ctx.restore();text(l,x+MW/2,400,{f:'D',s:28,c:col});
        if(L('n4')>=0&&T>CT('n4')+.4+i*.3)text('321만',x+MW/2,450,{f:'D',s:34,c:col});});
      if(L('n1')>=0&&L('n2')<0)group(960,560,1,0,P(L('n1'),0,.3),()=>{panel(-760,-60,1520,120,{bg:'rgba(6,13,32,1)',bd:CVAT});text(K('n1',0)>=0?'제49조 · 과세기간이 끝나고 25일 안에 신고·납부':'제49조 · 과세기간이 끝나고 ? 안에',0,4,{f:'D',s:38,max:1460});});
      if(L('n2')>=0&&L('n3')<0)group(960,560,1,0,P(L('n2'),0,.3),()=>{panel(-760,-60,1520,120,{bg:'rgba(6,13,32,1)',bd:CY});text(K('n2',0)>=0?'제48조 ③ · 직전 과세기간 납부세액의 50%를 고지':'제48조 ③ · 직전 과세기간 납부세액의 ?',0,4,{f:'D',s:38,c:CY,max:1460});});
      if(L('n3')>=0&&L('n4')<0){const q=K('n3',0);doc35(960,640,.85,'부가가치세 예정고지 (예시)',[['직전 반년 낸 세금','642만 6,000원'],['고지 (50%)',q>=0?'321만 3,000원':'?',q>=0?CVAT:'#c08a00']],{w:900,head:'#8a2b2b',alpha:P(L('n3'),0,.3)});
        text('50만 원 미만이면 고지하지 않음',960,840-30,{f:'D',s:28,c:C.dim,alpha:P(L('n3'),.5,.3)});}
      if(L('n4')>=0){const q=K('n4',0);if(q>=0)stampBox('석 달마다 321만 원',960,640,q,{s:64,c:CVAT,bg:'rgba(40,10,10,.92)'});}
      srcLine('부가가치세법 제48조 ③ (직전 과세기간 납부세액의 50% · 징수할 금액 50만 원 미만이면 제외) · 제49조 ① (끝난 뒤 25일) · 107.1 × 6 = 642.6 · 나누기 2 = 321.3 (python3)');
    }else{
      text('통장 속 남의 돈 (석 달 톱니)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const BASE=740,SC=.95,k5=L('n5');
      ctx.fillStyle='rgba(255,255,255,.2)';ctx.fillRect(X0,BASE,WW,3);
      for(let m=0;m<12;m++){const kk=P(k5,.2+m*.25,.3);if(kk<=0)continue;const owed=107.1*((m%3)+1),x=X0+m*MW+14,w=MW-28;
        ctx.save();ctx.globalAlpha*=kk;ctx.fillStyle=CVAT;rr(x,BASE-owed*SC,w,owed*SC,8);ctx.fill();text(Math.round(owed)+'만',x+w/2,BASE-owed*SC-24,{f:'D',s:26,c:m%3===2?CVAT:'#e0b3b3'});text((m+1)+'월',x+w/2,BASE+26,{s:22,w:800,c:'#9aa3b8'});
        if(m%3===2){ctx.fillStyle=CY;ctx.fillRect(x+w+6,BASE-owed*SC,6,owed*SC);}ctx.restore();}
      if(K('n5',0)>=0)pill('매달 107만 원씩 · 석 달이면 321만 원 → 고지서 한 장으로 나간다',960,826,{s:28,bg:'rgba(255,255,255,.94)'});
      if(L('n6')>=0){const q=K('n6',0);group(1480,290,1,0,P(L('n6'),0,.3),()=>{panel(-300,-70,600,140,{bg:'rgba(6,13,32,1)',bd:CMY});text('진짜 몫 한 달',0,-24,{f:'D',s:30,c:C.dim});text('492만 9,000원',0,30,{f:'D',s:44,c:CMY});});
        if(q>=0)stampBox('고지서 한 장 = 진짜 몫의 65%',720,290,q,{s:46,c:CY,bg:'rgba(40,30,0,.92)'});}
      srcLine('예시 계산 (python3): 107.1 × 3 = 321.3 · 321.3 나누기 492.9 = 65% · 1년 내내 매출이 같다고 친 예시 (4월 고지는 지난해 7~12월 기준)');
    }
  }},
  /* ── 장사가 꺾인 석 달 ── */
  slump:{draw(){
    sub('d1','d3',()=>{
      text('7~9월 석 달, 매출·재료비 −30% (예시)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      shop35(330,520,.6,{dim:true});
      const q2=K('d2',0),q3=K('d3',0),X0=700,MX=360;
      if(L('d2')<0){text('이 석 달의 부가세는?',1150,360,{f:'D',s:44,c:'#fff',alpha:P(L('d1'),1,.3)});text('?',1150,500,{f:'D',s:120,c:C.gold,alpha:P(L('d1'),1.3,.3)});}
      text('월세 220만은 그대로',330,760,{f:'D',s:30,c:C.dim,alpha:P(L('d1'),.5,.3)});
      if(L('d2')>=0){[['이 석 달 실제 부가세',206.9,q2>=0?'206만 9,000원':'?',CMY,q2>=0?KT('d2',0):1e9],['10월 고지서 (지난 반년 기준)',321.3,'321만 3,000원',CVAT,FR('d2',.75)]].forEach(([l,v,lb,col,t0],i)=>{const y=340+i*170;text(l,X0,y-60,{a:'left',f:'D',s:34,c:'#fff'});if(T<t0){text('?',X0+40,y,{f:'D',s:50,c:C.gold});return;}hbar(X0,y,800,80,v*E.out(P(T,t0,.5)),MX,col,lb,{s:42,lc:col,k:.9});});}
      if(q3>=0)stampBox('114만 원을 먼저 낸다',1150,720,q3,{s:52,c:CVAT,bg:'rgba(40,10,10,.92)'});
      if(T>FR('d3',.6))pill('더 낸 돈은 1월 확정신고 때 정산',1150,820,{s:28,bg:'rgba(255,255,255,.94)'});
      srcLine('예시 계산 (python3): 3 × (300 × 0.7 − 90 × 0.7 − 40 × 0.7 − 20 − 42.9 × 0.7) = 206.91 · 321.3 − 206.9 = 114.4 (만 원) · 월세 공제 20만은 그대로');});
    sub('d4','d7',()=>{
      text('고지 대신 직접 신고 (부가가치세법 제48조 ④)',960,170,{f:'D',s:48,c:C.gold,max:1800});
      lawCard(960,290,1600,130,'법률 제21065호',[['휴업 또는 사업 부진으로 사업실적이 악화된 경우 등 → 예정신고',K('d4',0)>=0?'#b5451b':'#2b2f3a']],{alpha:P(L('d4'),0,.3),s:36});
      if(L('d5')>=0){text('기준 (세무 안내 자료의 설명): 석 달 값이 직전 반년의 3분의 1에 못 미치면',960,420,{f:'D',s:32,c:'#fff',alpha:P(L('d5'),0,.3),max:1800});}
      if(L('d6')>=0){const q=K('d6',0);
        [['매출 (공급가액)','석 달 6,300만','3분의 1 = 6,000만','못 미치지 않음',CBACK,CT('d6')+.5],['납부세액','석 달 206만 9,000','3분의 1 = 214만 2,000','못 미침',CMY,FR('d6',.6)]].forEach(([l,a,b,v,col,t0],i)=>{if(T<t0)return;const y=530+i*120;group(0,0,1,0,P(T,t0,.3),()=>{panel(160,y-50,1600,100,{bg:'rgba(6,13,32,1)',bd:col});text(l,200,y+4,{a:'left',f:'D',s:34,c:C.dim});text(a,760,y+4,{f:'D',s:36});text(b,1180,y+4,{f:'D',s:36});text(v,1600,y+4,{f:'D',s:38,c:col});if(i)checkMark(1450,y,40,CMY);});});
        if(q>=0&&L('d7')<0)stampBox('세금이 먼저 줄었다',960,790,q,{s:50,c:CY,bg:'rgba(40,30,0,.92)'});}
      if(L('d7')>=0)pill('월세 공제는 그대로 → 세금이 매출보다 빨리 준다 · 가만히 있으면 고지서대로',960,800,{s:30,alpha:P(L('d7'),0,.3),bg:'rgba(255,255,255,.94)'});
      srcLine('법 제48조 ④ (casenote 사본) · 3분의 1 기준은 시행령 제90조 — 영상은 세무 안내 자료(토스플레이스 2026.10.14) 설명을 옮김 · 18,000 나누기 3 = 6,000 · 642.6 나누기 3 = 214.2');});
    sub('d8','d8',()=>{
      text('2026년 7월 · 납부기한 직권 연장 (국세청)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const q=K('d8',0),X0=620,MX=110;
      [['전체',103,'103만 명',CY],['매출 급감 소상공인',43.1,'43만 1,000명',CMY],['창업 초기 청년사업자',26.4,'26만 4,000명',CCARD],['간이과세자',31.4,'31만 4,000명',CBACK]].forEach(([l,v,lb,col],i)=>{const y=310+i*110,t0=CT('d8')+.4+i*.4;text(l,X0-24,y,{a:'right',f:'D',s:34});if(T<t0)return;hbar(X0,y,900,70,v*E.out(P(T,t0,.5)),MX,col,lb,{s:38,lc:col,k:.9});});
      if(q>=0)stampBox('두 달 (9월 28일까지)',960,780,q,{s:52,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('한국세정신문 2026.7.14 · 고환율 피해기업 1만 7,000 · 청년사업자 26만 4,000 · 매출액 급감 소상공인 43만 1,000 · 간이과세자 31만 4,000 · 납부기한만 연장 (신고는 기한 안에)');});
  }},
  /* ── 가장 많이 밀린 세금 ── */
  debt:{draw(){
    text('국세청 정리중 체납액 · 2024년 말',960,170,{f:'D',s:52,c:C.gold});
    const q1=K('b1',0),q2=K('b2',0);
    if(L('b1')>=0)text(q1>=0?'모두 19조 4,000억 원':'?',960,260,{f:'D',s:56,c:'#fff',alpha:P(L('b1'),0,.3)});
    const X0=560,MX=9;
    [['부가가치세',8.4,'8조 4,000억 · 43.5%',CVAT,q2>=0?KT('b2',0):1e9],['소득세',4.0,'4조 · 20.8%',CBACK,FR('b2',.7)],['법인세',2.1,'2조 1,000억 · 11%',CBACK,FR('b2',.8)]].forEach(([l,v,lb,col,t0],i)=>{const y=380+i*110;text(l,X0-24,y,{a:'right',f:'D',s:38,c:i?'#fff':CVAT});if(T<t0){if(i===0&&L('b2')>=0)text('?',X0+40,y,{f:'D',s:50,c:C.gold});return;}hbar(X0,y,900,74,v*E.out(P(T,t0,.5)),MX,col,lb,{s:40,lc:col,k:.95});});
    if(L('b3')>=0&&L('b4')<0)pill('부가세 체납 업종: 건설업 2조 2,000억 · 제조업 1조 7,000억 · 도매업 8,000억 · 자영업만 뗀 숫자는 보도에 없음',960,740,{s:26,alpha:P(L('b3'),0,.3),bg:'rgba(255,255,255,.94)'});
    if(L('b4')>=0)stampBox('받은 돈을 몇 달 뒤에 한 번에 내는 세금',960,750,K('b4',0)>=0?K('b4',0):-1,{s:46,c:CY,bg:'rgba(40,30,0,.92)'});
    srcLine('한국세정신문 2025.3.28 「국세 정리중 체납액 19조4천억원…1년새 1조7천억 늘어」 (국세청 1분기 국세통계, 2024년 말 기준)');
  }},
  /* ── 손잡이 ── */
  knob:{draw(){
    text('손잡이 · 내년 공제가 바뀌면 (예시 가게, 한 달)',960,170,{f:'D',s:48,c:C.gold,max:1800});
    const rows=[['지금 (카드 1.3% · 109분의 9)','42만 9,000 · 90만','107만 1,000원','#fff',CT('k1')+.5],['카드 1.2%로 (개편안)','39만 6,000 · 90만','110만 4,000원',CY,KT('k2',0)],['카드 1.2% + 108분의 8','39만 6,000 · 80만 7,000','119만 7,000원',CVAT,KT('k4',0)]];
    [[520,'경우'],[1110,'카드 공제 · 재료 공제'],[1560,'한 달 넘길 돈']].forEach(([x,l])=>text(l,x,290,{f:'D',s:32,c:C.dim}));
    rows.forEach(([r,a,b,col,t0],i)=>{const y=400+i*130;if(T<t0-.1){text('?',1560,y,{f:'D',s:44,c:C.gold,alpha:.6});return;}const k=P(T,t0,.3);
      group(0,0,1,0,k,()=>{panel(160,y-52,1600,104,{bg:'rgba(255,255,255,.05)',bd:i===2?col:null});text(r,520,y,{f:'D',s:34,max:680});text(a,1110,y,{f:'D',s:34,c:'#c9ced9',max:440});text(b,1560,y,{f:'D',s:42,c:col});});});
    if(L('k1')>=0&&L('k3')<0)pill('정부 세제개편안 · 카드 공제 1.2% · 연 500만 원 한도 · 국회 통과 전',960,800,{s:28,alpha:P(L('k1'),.4,.3),bg:'rgba(255,255,255,.94)'});
    if(L('k3')>=0&&L('k4')<0)pill('109분의 9 우대는 2028년까지 연장안 · 끝나면 108분의 8이라고 칠 때',960,800,{s:28,alpha:P(L('k3'),0,.3),bg:'rgba(255,255,255,.94)'});
    if(K('k4',0)>=0)stampBox('같은 장사, 한 달 +12만 6,000원',960,770,K('k4',0),{s:46,c:CY,bg:'rgba(40,30,0,.92)'});
    srcLine('예시 계산 (python3): 3,300 × 0.012 = 39.6 · 1,090 × 8 ÷ 108 = 80.7 · 300 − 60 − 80.7 − 39.6 = 119.7 · 데일리팜 2026.9.5 (개편안 1.2%·500만) · 한국세정신문 2026.8.5 (우대 연장안)',872);
  }},
  /* ── 체크 ── */
  check:{draw(){
    const a=L('q1'),ov=L('q7');
    text('매달 떼어 둘 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)*(ov>=0?1-P(ov,0,.3):1),max:1800});
    const cards=[['q2','11분의 1','부가세 포함 매출 나누기 11','3,300만 → 300만'],['q3','산 물건의 부가세','세금계산서·카드로 산 과세 물건 + 월세','오늘: 60만'],['q4','면세 재료','재료값 × 109분의 9 (또는 108분의 8)','오늘: 90만'],
      ['q5','카드 공제','카드·현금영수증 매출 × 1.3%','올해 연 1,000만 한도'],['q6','고지서 달','4월·10월 절반 · 1월·7월 나머지','오늘: 석 달마다 321만']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      if(ov>=0&&P(ov,0,.3)>=1)return;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:34,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,500,1,0,P(ov,0,.3),()=>{panel(-820,-330,1640,640,{bg:'rgba(6,13,32,1)',bd:C.gold});text('매출 2,200만 · 면세 재료 545만 · 과세 물건 330만 · 월세 110만',0,-250,{f:'D',s:38,max:1540});text('카드 공제 1.3% · 우대율 109분의 9 (모두 부가세 포함 금액)',0,-185,{f:'D',s:36,max:1540,c:'#ffd0a3'});text('한 달에 얼마를 떼어 둘까?',0,-115,{f:'D',s:46,max:1540,c:C.gold});
      const b=L('q7b');
      if(b>=0)text('200만 − 30만 − 10만 − 45만 − 28만 6,000',0,-10,{f:'D',s:40,alpha:P(b,0,.3),max:1540});
      const k=K('q7b',0);if(k>=0)text('86만 4,000원',0,150,{f:'D',s:120,c:CVAT,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,150,{f:'D',s:120,c:C.gold});
      if(k>=0&&T>FR('q7b',.6))text('매출의 3.9% · 석 달이면 259만 2,000원',0,265,{f:'D',s:34,c:'#fff',max:1540});});}
  }},
  /* ── 마무리 ── */
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('동네 고깃집 부가세 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      shop35(400,520,.75,{alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['매출 3,300만 중 부가세 (11분의 1)','300만 원',CVAT,b,.2],['산 물건 · 면세 재료 · 카드 공제','−192만 9,000원',CUI,b,4.5],['한 달 넘길 돈','107만 1,000원',CVAT,b,7.5],['석 달마다 고지서','321만 원',CY,b2,.2],['장사가 꺾여도 고지는','지난 반년 기준',CY,b2,4]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;rowBox(1260,270+i*125,1120,l,v,col,{alpha:kk,ls:32});});
    }else{
      shop35(560,480,.8,{});drawMascot(1450,470,.6,'happy');
      stampBox('600만 원 = 번 돈이 아니라 맡아 둔 돈이 섞인 잔고',960,780,c,{s:40,c:C.gold,bg:'rgba(40,30,0,.85)'});
      if(L('z4')>=0&&L('z4b')<0)pill('들어온 날 미리 나눠 두면 고지서가 와도 그대로',1250,180,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('법 조문 · 통계는 보도 · 가게는 예시 · 세무 자문 아님 · 📌 출처는 설명란',1100,180,{s:28,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,180,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-540,-70,1080,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 고지서 오는 달, 통장은 어떠셨나요?',0,4,{s:40,w:900,c:C.ink,max:1020});});
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
