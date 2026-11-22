/* ════════════════════════════════════════════════════════════════════
   장면 (LF.29 1인 미용실 현금 할인 계산서 — 커트 2만 원(참가격 여성 커트 평균 1만 9,558원 2025.8) · 영세 가맹점 신용 0.40% = 80원 · 체크 0.15% = 30원 · '현금이면 2,000원' = 25배 · 한 달 할인 20만 vs 수수료 8,000원 · 할인 한 달 > 수수료 반년 치 · 영세 가맹점 평균 연 수수료 18만 9,000원(2023) · 여전법 19조 · 개정안 '수수료 차액 범위' → 80원 · 새 손님 11명) — 수치·출처는 docs/longform-ep29.md
   중심 그림: 천 원짜리 스무 장 띠에서 카드 수수료 80원이 얼마나 얇은 줄인지 보여 주고, 그 옆에 2,000원(두 장)을 빼는 그림.
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['8','0','0','0','0','0','0','−','6','0','0','0','0','0','−','2','4','0','0','0','0','0','−','3','2','0','0','0','='];   // 8,000,000 − 600,000 − 2,400,000 − 32,000 = 4,968,000 (8 뒤 0 여섯 · 6 뒤 0 다섯 · 24 뒤 0 다섯 · 32 뒤 0 셋)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold,a:o.a});}
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433',max:460});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:30,w:900,c:'#3a4256',max:270});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433',max:180});});
});}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CRT='#B98CFF', CMG='#6FA8FF', CAP='#9aa3b8', CMT='#4FD1C5', CFE='#FF7A45', CP='#35E08A', CR='#FF4D4D', CY='#FFC531', CK='#FF8FC7';   // 월세 · 관리비 · 앱·소모품 · 재료 · 카드 수수료 · 남는 돈 · 손실 · 강조 · 미용실
/* 1인 미용실 가게 (상표 없음). o.sign 간판 글자, o.dim 불 꺼짐 */
function salon29(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,214,300,18,0,0,7);ctx.fill();
  ctx.fillStyle=o.dim?'#4a4f5c':'#f3ece4';rr(-260,-130,520,340,12);ctx.fill();
  // 차양 줄무늬
  for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#ffffff':(o.dim?'#5a3d4a':CK);ctx.beginPath();ctx.moveTo(-280+i*70,-150);ctx.lineTo(-210+i*70,-150);ctx.lineTo(-200+i*70,-90);ctx.lineTo(-270+i*70,-90);ctx.closePath();ctx.fill();}
  ctx.fillStyle=o.dim?'#2a2f3a':'#2b2f45';rr(-190,-240,380,84,14);ctx.fill();text(o.sign||'동네 미용실',0,-196,{f:'D',s:46,c:o.dim?'#7d8494':'#fff',max:350});
  // 큰 유리창 + 의자 하나 + 거울
  ctx.fillStyle=o.dim?'#2b2f38':'#cfe8f5';rr(-230,-60,300,220,10);ctx.fill();
  ctx.fillStyle=o.dim?'#3a3f4a':'#e9f6ff';rr(-200,-40,90,120,8);ctx.fill();
  chair29(-90,110,.55,o.dim);
  // 문
  ctx.fillStyle=o.dim?'#2b2f38':'#7a4a2a';rr(110,10,110,200,8);ctx.fill();ctx.fillStyle='#ffd27a';ctx.beginPath();ctx.arc(130,110,7,0,7);ctx.fill();
  // 회전 간판 기둥
  const ph=(T*1.2)%1;ctx.save();ctx.beginPath();rr(236,-40,36,170,18);ctx.clip();ctx.fillStyle='#fff';ctx.fillRect(236,-40,36,170);
  for(let i=-2;i<8;i++){ctx.fillStyle=i%2?'#e0342c':'#2f5fd0';ctx.beginPath();const yy=-40+i*30+(o.dim?0:ph*60);ctx.moveTo(236,yy);ctx.lineTo(272,yy-20);ctx.lineTo(272,yy-5);ctx.lineTo(236,yy+15);ctx.closePath();ctx.fill();}
  ctx.restore();
});}
/* 미용실 의자 (💺 는 비행기 좌석이라 직접 그린다) */
function chair29(x,y,s,dim){group(x,y,s,0,1,()=>{
  ctx.fillStyle=dim?'#555':'#222838';rr(-12,40,24,60,6);ctx.fill();ctx.fillRect(-60,96,120,14);
  ctx.fillStyle=dim?'#6b4a55':'#c2185b';rr(-70,-20,140,60,16);ctx.fill();rr(-60,-140,120,130,24);ctx.fill();
  ctx.fillStyle=dim?'#444':'#9aa3b8';ctx.fillRect(-90,0,24,10);ctx.fillRect(66,0,24,10);
});}
/* 가위 */
function scissors29(x,y,s,rot=0){group(x,y,s,rot,1,()=>{
  ctx.strokeStyle='#d8dde6';ctx.lineWidth=14;ctx.lineCap='round';line(-10,-10,110,-60);line(-10,10,110,60);
  ctx.strokeStyle=CK;ctx.lineWidth=12;ctx.beginPath();ctx.arc(-50,-30,26,0,7);ctx.stroke();ctx.beginPath();ctx.arc(-50,30,26,0,7);ctx.stroke();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,8,0,7);ctx.fill();
});}
/* 카드 단말기. o.amt 화면 글자 */
function terminal29(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='#262c3d';rr(-110,-170,220,340,30);ctx.fill();
  ctx.fillStyle='#bfe6c4';rr(-85,-140,170,90,12);ctx.fill();text(o.amt||'20,000',72,-94,{a:'right',f:'D',s:36,c:'#1f2b1c',max:150});
  for(let r=0;r<3;r++)for(let c2=0;c2<3;c2++){ctx.fillStyle='#3d4560';rr(-80+c2*58,-30+r*50,46,38,8);ctx.fill();}
  ctx.fillStyle='#e9eef6';rr(-95,130,190,26,6);ctx.fill();
  // 꽂힌 카드
  ctx.fillStyle='#3a6ee8';rr(-70,150,140,90,10);ctx.fill();ctx.fillStyle='#ffd27a';rr(-50,170,34,26,5);ctx.fill();
});}
/* 천 원짜리 한 장 */
function bill29(x,y,w,h,o={}){ctx.save();ctx.globalAlpha*=(o.alpha??1);ctx.fillStyle='#7a8f6a';rr(x,y,w,h,8);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;rr(x+6,y+6,w-12,h-12,6);ctx.stroke();text('1,000',x+w/2,y+h/2+2,{f:'D',s:o.fs||26,c:'rgba(255,255,255,.6)'});ctx.restore();}
/* 사람 한 명 */
function head29(x,y,s,col){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-10*s,7*s,0,7);ctx.fill();rr(x-8*s,y-2*s,16*s,14*s,5*s);ctx.fill();}
/* 동전 하나 (10원) */
function coin29(x,y,r,col='#d9a35b'){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r*.75,0,7);ctx.stroke();}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3')){
      const a=L('o1');
      salon29(440,500,1.0*E.back(P(a,0,.5))+.001,{});
      text('그림은 예시 · 실제 가게 아님',440,800,{s:26,w:800,c:C.dim,alpha:P(a,.4,.3)});
      group(1330,250,1,0,P(a,.2,.3),()=>{ctx.fillStyle='#fff';rr(-500,-90,1000,180,30);ctx.fill();ctx.beginPath();ctx.moveTo(-320,90);ctx.lineTo(-360,140);ctx.lineTo(-250,90);ctx.fill();
        text('“현금이면',-440,4,{a:'left',f:'D',s:56,c:C.ink});const q=K('o1',0);text(q>=0?'2,000원 빼 드릴게요”':'?',440,4,{a:'right',f:'D',s:56,c:q>=0?'#d62f2f':C.gold,max:560});});
      if(L('o2')>=0){terminal29(1000,600,.8,{alpha:P(L('o2'),0,.3)});
        group(1450,560,1,0,P(L('o2'),0,.3),()=>{panel(-330,-120,660,240,{bd:CFE,bg:'rgba(6,13,32,.85)'});text('커트 2만 원 · 카드 수수료',0,-60,{f:'D',s:34,c:C.dim,max:620});});
        big('o2',0,1450,600,'80원',{f:'D',s:110,c:CFE});}
      srcLine('영세 가맹점(1년 매출 3억 원 이하) 신용카드 우대수수료율 0.40% — 금융위원회 보도자료 2024.12.17 · 20,000 × 0.4% = 80원 · 미용실 장면·대사는 예시');
    }else if(T<CT('o4')){
      const b=L('o3');
      group(560,400,1,0,P(b,0,.3),()=>{panel(-360,-170,720,340,{bd:CFE,bg:'rgba(6,13,32,.7)'});text('아끼는 카드 수수료',0,-100,{f:'D',s:42,c:C.dim});text('80원',0,30,{f:'D',s:120,c:CFE});});
      group(1360,400,1,0,P(b,.3,.3),()=>{panel(-360,-170,720,340,{bd:CR,bg:'rgba(6,13,32,.7)'});text('깎아 주는 돈',0,-100,{f:'D',s:42,c:C.dim});text('2,000원',0,30,{f:'D',s:120,c:CR});});
      if(K('o3',0)>=0&&L('o3b')<0)stampBox('25배',960,400,K('o3',0),{s:90,c:C.gold,bg:'rgba(40,30,0,.92)'});
      if(L('o3b')>=0&&L('o3c')<0)stampBox('한 달 할인이 카드 수수료 반년 치보다 크다',960,700,K('o3b',0),{s:50,c:CR,bg:'rgba(40,0,0,.92)'});
      if(L('o3c')>=0)group(960,700,1,0,P(L('o3c'),0,.3),()=>{panel(-620,-70,1240,140,{bg:'rgba(6,13,32,1)',bd:C.gold});text('⚖️',-540,4,{s:70});text('국회 개정안이 통과돼도 · 줄 수 있는 할인은?',40,4,{f:'D',s:44,c:C.gold,max:1080});});
      srcLine('예시 계산 (python3): 2,000 ÷ 80 = 25 · 현금 손님 100명 할인 20만 원 vs 카드 수수료 한 달 3만 2,000원 × 6 = 19만 2,000원');
    }else{
      const k9=L('o4'),k10=L('o5');
      text('결제 방법별 값, 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['수수료율 · 금융위원회','커트값 · 참가격 · 법 · 보도','손님 수 · 비용 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.6,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('1인 미용실 현금 할인 계산서',960,200,{f:'D',s:104,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('커트 2만 원 · 카드 수수료 80원 · “현금이면 2,000원”',960,325,{s:44,w:900,alpha:P(a,.3,.3),max:1780});
    salon29(560,640,.68,{alpha:P(a,.2,.3)});terminal29(1080,640,.75,{alpha:P(a,.3,.3)});drawMascot(1550,660,.7,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 미용실 ── */
  setup:{draw(){
    sub('p1','p2',()=>{
      salon29(440,500,.95,{});
      text('예시 미용실',1320,210,{f:'D',s:50,c:C.gold});
      if(L('p2')>=0){const q=K('p2',0);
        text('사장님 혼자 · 의자 하나',1320,290,{f:'D',s:40,c:C.dim});
        scissors29(1080,470,1.1,-.3);
        text('손님 한 명',1240,430,{f:'D',s:44,c:C.dim,a:'left'});text(q>=0?'2만 원':'?',1240,520,{f:'D',s:96,c:q>=0?CK:C.gold,a:'left'});
        if(q>=0)pill('계산을 쉽게 · 커트 한 가지로',1320,700,{s:32,bg:'rgba(255,255,255,.92)',alpha:P(q,.3,.3)});}
      srcLine('예시 가정 · 실제 미용실은 펌·염색 등 값이 다른 시술이 섞인다');});
    sub('p2b','p2c',()=>{
      text('성인 여성 커트 평균 (한국소비자원 참가격)',960,180,{f:'D',s:48,c:C.gold,max:1800});
      const X0=520,WW=1100,MX=26000,q=K('p2b',0),c2=L('p2c');
      [['2020.8',15789,'1만 5,789원','rgba(255,255,255,.45)',CT('p2b')+.4],['2025.8',19558,'1만 9,558원',CK,CT('p2b')+1.6]].forEach(([l,v,lb,col,t0],i)=>{const y=310+i*120;if(T<t0)return;const k=E.out(P(T,t0,.6));text(l,X0-30,y,{a:'right',f:'D',s:40,c:'#c9ced9'});hbar(X0,y,WW,80,v*k,MX,col,k>.9?lb:'',{s:44});});
      if(q>=0)stampBox('5년 +23.9%',1450,515,q,{s:46,c:CK,bg:'rgba(40,0,20,.92)'});
      if(c2>=0)[['인천 (가장 비쌈)',25000,'2만 5,000원',CR],['전북 (가장 쌈)',15200,'1만 5,200원','#6FA8FF']].forEach(([l,v,lb,col],i)=>{const y=600+i*110,k=E.out(P(c2,.3+i*.5,.6));if(k<=0)return;text(l,X0-30,y,{a:'right',f:'D',s:36,c:'#c9ced9'});hbar(X0,y,WW,70,v*k,MX,col,k>.9?lb:'',{s:40});});
      srcLine('아시아경제 2025.9.14 (한국소비자원 참가격, 2025년 8월 성인 여성 커트 평균 · 2020년 8월 1만 5,789원 대비 23.9%) · 1만 9,558 ≈ 2만 원은 예시로 반올림');});
    sub('p2d','p2d',()=>{
      text('미용실 폐업 (건)',960,180,{f:'D',s:52,c:C.gold});
      const Y=['2022','2023','2024'],V=[11503,12646,13292],X0=560,DX=400,BASE=720,HH=420,MX=14500;
      V.forEach((v,i)=>{const t0=i<2?CT('p2d')+1.0+i*1.2:KT('p2d',0);const x=X0+i*DX;text(Y[i],x,BASE+44,{f:'D',s:36,c:'#c9ced9'});if(T<t0){text('?',x,BASE-60,{f:'D',s:60,c:C.gold});return;}const k=E.out(P(T,t0,.5)),h=HH*v/MX*k,col=i===2?CR:CAP;ctx.fillStyle=col;rr(x-90,BASE-h,180,h,10);ctx.fill();if(k>.9)text(v.toLocaleString('ko-KR'),x,BASE-h-34,{f:'D',s:44,c:col});});
      srcLine('아시아경제 2025.9.14 (미용실 폐업 2022 1만 1,503 · 2023 1만 2,646 · 2024 1만 3,292건 — 기사에 집계 기관 표기 없음)');});
    sub('p3','p3',()=>{
      text('한 달 손님과 매출 (예시)',960,190,{f:'D',s:54,c:C.gold});
      text('하루 16명 × 25일',960,330,{f:'D',s:60});
      big('p3',0,960,450,'= 400명',{f:'D',s:90,c:CK});
      if(T>KT('p3',0)+.5)text('× 2만 원',960,580,{f:'D',s:56,c:C.dim});
      big('p3',1,960,710,'= 한 달 매출 800만 원',{f:'D',s:80,c:CP});
      if(T>FR('p3',.85))pill('1년 9,600만 원 → 3억 원 이하',960,810,{s:30,bg:'rgba(255,255,255,.92)'});
      srcLine('16 × 25 = 400 · × 20,000 = 8,000,000 · × 12 = 96,000,000 (python3) · 예시 가정');});
    sub('p4','p4b',()=>{
      const rows=[['월세','150만',null,.08],['관리비·전기·수도','50만',null,.3],['예약 앱·소모품','40만',null,.55]];
      const vis=rows.filter(r=>T>FR('p4',r[3])).map(r=>[r[0],r[1]]);
      const q=K('p4',0);vis.push(['= 고정비',q>=0?'240만':'?','#d62f2f']);
      receipt(560,450,1,vis,{title:'한 달 나가는 돈 (예시)'});
      if(L('p4b')>=0)group(1360,450,1,0,P(L('p4b'),0,.3),()=>{panel(-440,-120,880,240,{bd:CMT,bg:'rgba(6,13,32,1)'});text('+ 손님 한 명마다',0,-50,{f:'D',s:40,c:C.dim});text('샴푸·약제 재료비 1,500원',0,40,{f:'D',s:52,c:CMT,max:820});});
      srcLine('비용 항목·금액은 예시 가정');});
    sub('p5','p5b',()=>{
      text('영세 가맹점 · 신용카드 수수료',960,180,{f:'D',s:52,c:C.gold});
      terminal29(380,500,1.15,{amt:'20,000'});
      big('p5',0,1100,380,'0.40%',{f:'D',s:170,c:CFE});
      text('1년 매출 3억 원 이하',1100,520,{f:'D',s:44,c:C.dim,alpha:P(L('p5'),.3,.3)});
      if(L('p5b')>=0){const k=L('p5b');
        group(1100,660,1,0,P(k,0,.3),()=>{panel(-520,-60,1040,120,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.35)'});text('2025.2부터',-480,4,{a:'left',f:'D',s:36,c:C.dim});text('0.50% → 0.40%',480,4,{a:'right',f:'D',s:48,c:CFE});});
        group(1100,790,1,0,P(k,1.5,.3),()=>{panel(-520,-55,1040,110,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.35)'});text('체크카드',-480,4,{a:'left',f:'D',s:36,c:C.dim});text('0.25% → 0.15%',480,4,{a:'right',f:'D',s:44,c:'#ffb38a'});});}
      srcLine('금융위원회 보도자료 2024.12.17 「소상공인·자영업자 부담경감을 위해 영세·중소가맹점 우대수수료율을 인하합니다」 (2025.2.14 선정 시점부터 적용 예정으로 발표)');});
  }},
  /* ── 2만 원 쪼개기 (천 원짜리 스무 장) ── */
  cut:{draw(){
    const X0=120,WW=1680,Y=290,HH=170,bw=WW/20;
    text('커트 한 번 2만 원 = 천 원짜리 스무 장',960,190,{f:'D',s:52,c:C.gold,max:1800});
    const k1=L('s1');
    for(let i=0;i<20;i++){const k=E.back(P(k1,.1+i*.04,.3));if(k<=0)continue;bill29(X0+i*bw+3,Y,bw-6,HH,{alpha:Math.min(1,k),fs:20});}
    const segs=[[3750,'월세',CRT,FR('s2',.05)],[1250,'관리비·공과금',CMG,FR('s2',.25)],[1000,'앱·소모품',CAP,FR('s2',.55)],[1500,'재료비',CMT,FR('s2',.8)],[80,'카드 수수료',CFE,KT('s3',0)],[12420,'남는 돈',CP,KT('s4',0)]];
    let acc=0;segs.forEach(([v,l,col,t0],i)=>{const x=X0+acc/1000*bw,w=Math.max(4,v/1000*bw);acc+=v;if(L('s2')<0||T<t0)return;const k=E.out(P(T,t0,.5));
      ctx.save();ctx.globalAlpha*=.9;ctx.fillStyle=col;rr(x+1,Y,Math.max(3,(w-2)*k),HH,i===4?2:8);ctx.fill();ctx.restore();
      if(i===4){ // 수수료: 얇은 줄 → 오른쪽으로 꺾어 이름표
        ctx.strokeStyle=CFE;ctx.lineWidth=4;line(x+2,Y+HH+8,x+2,505);line(x+2,505,900,505);
        text('카드 수수료 80원',915,507,{a:'left',f:'D',s:44,c:CFE});return;}
      const ly=[540,640,540,740,0,640][i];ctx.strokeStyle=col;ctx.lineWidth=3;line(x+w/2,Y+HH+8,x+w/2,ly-40);
      text(l,x+w/2,ly-10,{f:'D',s:28,c:col,max:Math.max(150,w+30)});text(v.toLocaleString('ko-KR')+'원',x+w/2,ly+30,{f:'D',s:34,c:'#fff'});});
    if(K('s3',1)>=0&&L('s4')<0)stampBox('천 원짜리 한 장의 12분의 1도 안 된다',1240,780,K('s3',1),{s:44,c:CFE,bg:'rgba(40,20,0,.92)'});
    if(L('s4')>=0&&K('s4',0)>=0)pill('사장님 손으로 버는 몫',1300,780,{s:34,bg:'rgba(255,255,255,.94)',alpha:P(K('s4',0),.4,.3)});
    srcLine('고정비 240만 ÷ 400명 = 6,000 (월세 3,750 · 관리비 1,250 · 앱·소모품 1,000) + 재료 1,500 + 수수료 80 + 남는 돈 12,420 = 20,000 (python3) · 예시 가정');
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='8,000,000 − 600,000 − 2,400,000 − 32,000 =';bigS='4,968,000';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:22,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:done?84:76,f:'D',c:done?'#1a7a44':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('매출 − 재료비 − 고정비 − 카드 수수료',1320,180,{f:'D',s:42,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0),X0=920,WW=760,MX=850;
    [['매출',800,'800만',CP,CT('c2')],['재료비',60,'60만',CMT,FR('c2',.25)],['고정비',240,'240만',CRT,FR('c2',.4)],['카드 수수료',3.2,'3만 2,000',CFE,FR('c2',.58)]].forEach(([l,v,lb,col,t0],i)=>{const y=280+i*90;if(L('c2')<0)return;const k=E.out(P(T,t0,.5));text(l,X0,y-38,{a:'left',f:'D',s:28,c:C.dim});hbar(X0,y,WW,44,v*k,MX,col,T>t0?lb:'',{s:34});});
    text('한 달 남는 돈',X0,640,{a:'left',f:'D',s:38});hbar(X0,700,WW,70,q2>=0?496.8*E.out(P(q2,0,.6)):0,MX,CP,q2>=0?'496만 8,000원':'?',{s:44,lc:q2>=0?CP:C.gold});
    if(dt>=0&&q2<0)group(1300,690,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(L('c3')>=0&&L('c4')<0)pill('전부 카드여도 수수료 3만 2,000원 · 월세의 2%',1320,800,{s:30,bg:'rgba(255,255,255,.94)',alpha:P(L('c3'),.1,.3)});
    if(L('c4')>=0)group(1320,800,1,0,P(L('c4'),0,.3),()=>{panel(-460,-50,920,100,{bg:'rgba(6,13,32,1)',bd:CR});text('“현금이면 2,000원”은 얼마짜리?',0,4,{f:'D',s:40,c:CR,max:880});});
  }},
  /* ── 현금이면 2,000원 ── */
  discount:{draw(){
    sub('d1','d4',()=>{
      text('한 달 손님 400명 · 넷 중 한 명이 현금 (예시)',960,175,{f:'D',s:46,c:C.gold,max:1800});
      const X0=130,Y0=240,CELL=28;
      for(let i=0;i<400;i++){const r=Math.floor(i/20),c2=i%20;head29(X0+c2*CELL+CELL/2,Y0+r*CELL+CELL/2+6,1.5,i<100?'#7dd87d':'rgba(111,168,255,.75)');}
      text('현금 100명',X0,Y0+20*CELL+30,{a:'left',f:'D',s:30,c:'#7dd87d'});text('카드 300명',X0+20*CELL,Y0+20*CELL+30,{a:'right',f:'D',s:30,c:'#6FA8FF'});
      const RX=1300,q2=K('d2',0),q3=K('d3',0),q4=K('d4',0);
      if(L('d2')>=0)group(RX,320,1,0,P(L('d2'),0,.3),()=>{panel(-520,-80,1040,160,{bg:'rgba(0,40,20,.9)',bd:CP});text('아낀 카드 수수료',-480,-26,{a:'left',f:'D',s:32,c:C.dim});text('100명 × 80원',-480,30,{a:'left',f:'D',s:40});text(q2>=0?'+8,000원':'?',480,4,{a:'right',f:'D',s:64,c:q2>=0?CP:C.gold});});
      if(L('d3')>=0)group(RX,510,1,0,P(L('d3'),0,.3),()=>{panel(-520,-80,1040,160,{bg:'rgba(40,0,0,.9)',bd:CR});text('깎아 준 돈',-480,-26,{a:'left',f:'D',s:32,c:C.dim});text('100명 × 2,000원',-480,30,{a:'left',f:'D',s:40});text(q3>=0?'−20만 원':'?',480,4,{a:'right',f:'D',s:64,c:q3>=0?CR:C.gold});});
      if(L('d4')>=0)group(RX,700,1,0,P(L('d4'),0,.3),()=>{panel(-520,-80,1040,160,{bg:'rgba(6,13,32,1)',bd:C.gold});text('한 달',-480,4,{a:'left',f:'D',s:44});text(q4>=0?'−19만 2,000원':'?',480,4,{a:'right',f:'D',s:68,c:q4>=0?CR:C.gold});});
      srcLine('100 × 80 = 8,000 · 100 × 2,000 = 200,000 · 차이 192,000 (python3) · 현금 손님 비율·할인 금액은 예시 가정');});
    sub('d5','d6',()=>{
      text('현금 할인 한 달 vs 카드 수수료',960,175,{f:'D',s:50,c:C.gold});
      // 카드 수수료 6달 (3.2만씩) vs 할인 한 달 20만 — 세로 막대
      const BASE=700,SC=2.1;
      for(let i=0;i<6;i++){const t0=CT('d5')+.6+i*.35;if(T<t0)continue;const k=E.out(P(T,t0,.4)),h=32*SC*k;ctx.fillStyle=CFE;rr(300,BASE-(i+1)*32*SC+(32*SC-h),220,h-4,8);ctx.fill();if(k>.9)text((i+1)+'달',560,BASE-(i+.5)*32*SC,{a:'left',f:'D',s:28,c:CFE});}
      text('카드 수수료 (손님 전부 카드)',410,BASE+50,{f:'D',s:30,c:CFE,max:560});text('한 달 3만 2,000원 × 6',410,BASE+92,{s:26,w:900,c:C.dim});
      const t2=FR('d5',.35);if(T>t2){const k=E.out(P(T,t2,.6)),h=200*SC*k;ctx.fillStyle=CR;rr(1000,BASE-h,240,h,10);ctx.fill();if(k>.9)text('20만 원',1120,BASE-h-34,{f:'D',s:46,c:CR});}
      text('현금 할인 한 달',1120,BASE+50,{f:'D',s:30,c:CR});
      if(K('d5',0)>=0&&L('d6')<0)stampBox('할인 한 달이 수수료 반년 치보다 크다',1440,300,K('d5',0),{s:38,c:CR,bg:'rgba(40,0,0,.92)'});
      if(L('d6')>=0)group(1560,420,1,0,P(L('d6'),0,.3),()=>{panel(-300,-170,600,340,{bg:'rgba(6,13,32,1)',bd:CY});text('1년이면',0,-110,{f:'D',s:36,c:C.dim});text('230만 4,000원',0,-40,{f:'D',s:56,c:CR});text(K('d6',0)>=0?'한 달 ≈ 10시간':'?',0,70,{f:'D',s:52,c:K('d6',0)>=0?CY:C.gold});text('공짜로 일하는 셈',0,130,{s:28,w:900,c:C.dim});});
      srcLine('32,000 × 6 = 192,000 · 200,000 ÷ 32,000 = 6.25 · 192,000 × 12 = 2,304,000 · 남는 돈 496.8만 ÷ 250시간 = 시간당 19,872원 → 192,000 ÷ 19,872 = 9.7시간 (python3)');});
    sub('d7','d8',()=>{
      text('영세 가맹점 한 곳 · 1년 카드 수수료 평균',960,175,{f:'D',s:48,c:C.gold,max:1800});
      const X0=560,WW=1000,MX=24,q=K('d7',0);
      text('2023년 (인하 전)',X0-30,330,{a:'right',f:'D',s:36,c:'#c9ced9'});hbar(X0,330,WW,84,q>=0?18.9*E.out(P(q,0,.6)):0,MX,CFE,q>=0?'18만 9,000원':'?',{s:44,lc:q>=0?CFE:C.gold});
      if(L('d8')>=0){const k=L('d8');text('이번 인하로',X0-30,460,{a:'right',f:'D',s:36,c:'#c9ced9',alpha:P(k,0,.3)});hbar(X0,460,WW,70,4.5*E.out(P(k,0,.6)),MX,CP,'−4만 5,000원',{s:40});
        text('예시 미용실 · 현금 할인 한 달',X0-30,610,{a:'right',f:'D',s:36,c:CR,alpha:P(k,1.2,.3)});if(k>1.2)hbar(X0,610,WW,84,20*E.out(P(k,1.2,.6)),MX,CR,'20만 원',{s:44});}
      srcLine('금융위원회 보도자료 2024.12.17 (3억 원 이하 230.2만 곳 · 1곳 평균 연 수수료 18.9만 원 → 4.5만 원 경감, 2023년 기준) · 평균이라 아주 작은 가게까지 섞여 있다');});
  }},
  /* ── 법이 바뀌어도 80원 (어두운 장) ── */
  law:{draw(){
    sub('l1','l3',()=>{
      emoji('⚖️',380,470,240);
      group(1220,330,1,0,P(L('l2'),0,.3),()=>{panel(-600,-150,1200,300,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.4)'});text('여신전문금융업법 19조 1항 (카드 의무수납제)',0,-90,{f:'D',s:36,c:C.dim,max:1140});
        text('카드 결제를 거절하거나',0,-10,{f:'D',s:50,max:1140});text(K('l2',0)>=0?'카드 손님을 불리하게 대우하지 못한다':'카드 손님을 … 대우하지 못한다',0,70,{f:'D',s:50,c:K('l2',0)>=0?CY:'#fff',max:1140});});
      if(L('l3')>=0)group(1220,640,1,0,P(L('l3'),0,.3),()=>{panel(-600,-90,1200,180,{bg:'rgba(40,0,0,.9)',bd:CR});text('“현금 결제 시 할인하는 행위”',0,-28,{f:'D',s:46,c:CR,max:1140});text('금융위원회가 밝힌 부당 대우 신고 대상 (보도)',0,40,{s:32,w:900,max:1140});});
      srcLine('머니투데이 2026.10.20 「현금·페이머니 쓰면 10% 할인?… 간편결제, 최대 수혜자 되나」 (현행 여전법 19조1항 · 금융위 신고 대상 설명)');});
    sub('l4','l6',()=>{
      text('국회 개정안 (2026년 10월 발의 · 통과 전)',960,175,{f:'D',s:48,c:C.gold,max:1800});
      group(960,320,1,0,P(L('l4'),0,.3),()=>{panel(-820,-90,1640,180,{bg:'rgba(6,13,32,1)',bd:C.gold});text('카드보다 수수료가 적은 결제 수단에는',0,-30,{f:'D',s:40,max:1580});text(K('l4',0)>=0?'수수료 차액 범위에서 할인해도 된다':'… 할인해도 된다',0,40,{f:'D',s:46,c:C.gold,max:1580});});
      if(L('l5')>=0){const q=K('l5',0);
        // 2만 원 커트 위에서 허용 할인 80원 vs 2,000원
        const X0=420,WW=1240,MX=2200;
        text('허용 범위 (신용 0.40%)',X0-30,560,{a:'right',f:'D',s:32,c:CP,max:380});hbar(X0,560,WW,80,q>=0?80*E.out(P(q,0,.5)):0,MX,CP,q>=0?'80원':'?',{s:48,lc:q>=0?CP:C.gold});
        text('“현금이면”',X0-30,690,{a:'right',f:'D',s:36,c:CR});hbar(X0,690,WW,80,T>FR('l5',.2)?2000:0,MX,CR,T>FR('l5',.2)?'2,000원':'',{s:48});}
      if(L('l6')>=0){const q=K('l6',0);group(1460,800,1,0,P(L('l6'),0,.3),()=>{panel(-380,-46,760,92,{bg:'rgba(6,13,32,1)',bd:'#ffb38a'});text(q>=0?'체크카드(0.15%)와 차이 30원':'체크카드와 차이 ?',0,4,{f:'D',s:38,c:'#ffb38a',max:720});});}
      srcLine('머니투데이 2026.10.20 (강준현 의원 대표발의 여전법 개정안 · 여신금융협회 의견 수렴 중) · 현금(수수료 0) 대비 신용 20,000 × 0.40% = 80 · 체크 × 0.15% = 30 (python3)');});
    sub('l7','l8',()=>{
      text('카드 매출 · 현금영수증 매출',960,175,{f:'D',s:52,c:C.gold});
      terminal29(520,470,.95,{amt:'20,000'});
      group(1000,470,1,0,1,()=>{ctx.fillStyle='#fffdf6';rr(-150,-200,300,400,12);ctx.fill();text('현금영수증',0,-140,{f:'D',s:36,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-120,-100,120,-100);ctx.setLineDash([]);text('20,000',0,0,{f:'D',s:56,c:'#1d2433'});text('발행',0,90,{f:'D',s:34,c:'#2f7d5a'});});
      group(1500,420,1,0,P(L('l7'),.3,.3),()=>{panel(-320,-170,640,340,{bg:'rgba(6,13,32,1)',bd:CP});text('둘 다',0,-110,{f:'D',s:38,c:C.dim});text('매출의 1.3%',0,-20,{f:'D',s:72,c:CP});text('부가세 공제',0,60,{f:'D',s:42});text('연 매출 10억 원 이하 개인 · 2026년까지',0,128,{s:26,w:900,c:C.dim,max:600});});
      if(L('l8')>=0)stampBox('영수증을 끊으면 · 차이는 수수료 80원뿐',960,790,L('l8'),{s:46,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('금융위원회 보도자료 2024.12.17 (\'26년까지 연매출 10억 원 이하 개인사업자, 신용·체크카드·현금영수증 등 매출액의 1.3%, 연 1,000만 원 한도 부가세 공제)');});
  }},
  /* ── 할인은 누가 가져가나 ── */
  newbie:{draw(){
    sub('n1','n3',()=>{
      text('할인 덕에 새 손님이 오면?',960,180,{f:'D',s:54,c:C.gold});
      head29(380,470,11,'#ffd27a');text('새 손님 한 명',380,660,{f:'D',s:44,c:'#ffd27a'});
      const q2=K('n2',0);
      if(L('n2')>=0)group(1250,330,1,0,P(L('n2'),0,.3),()=>{panel(-560,-80,1120,160,{bg:'rgba(6,13,32,1)',bd:CP});text('2만 − 재료 1,500 − 수수료 80',-520,4,{a:'left',f:'D',s:38,max:640});text(q2>=0?'= 1만 8,420원':'?',520,4,{a:'right',f:'D',s:54,c:q2>=0?CP:C.gold});});
      if(L('n3')>=0){const q=K('n3',0);group(1250,560,1,0,P(L('n3'),0,.3),()=>{panel(-560,-110,1120,220,{bg:'rgba(6,13,32,1)',bd:CY});text('한 달 19만 2,000원 나누기 1만 8,420원',0,-50,{f:'D',s:38,max:1060});text(q>=0?'새 손님 11명이 와야 본전':'?',0,40,{f:'D',s:60,c:q>=0?CY:C.gold,max:1060});});}
      srcLine('20,000 − 1,500 − 80 = 18,420 · 192,000 ÷ 18,420 = 10.4 → 11명 (python3) · 고정비는 이미 나가 있다고 가정');});
    sub('n4','n5',()=>{
      text('현금 할인 받는 100명은 누구일까 (예시)',960,175,{f:'D',s:48,c:C.gold,max:1800});
      const X0=260,Y0=250,CELL=56,k=L('n4');
      for(let i=0;i<100;i++){const r=Math.floor(i/20),c2=i%20,isNew=i>=95;head29(X0+c2*CELL+CELL/2,Y0+r*CELL+CELL/2+8,2.4,isNew?'#ffd27a':(T>FR('n4',.45)?'#6FA8FF':'#7dd87d'));}
      if(T>FR('n4',.45)){text('원래 오던 단골',X0,Y0+5*CELL+40,{a:'left',f:'D',s:36,c:'#6FA8FF'});text('새 손님은?',X0+20*CELL,Y0+5*CELL+40,{a:'right',f:'D',s:36,c:'#ffd27a'});}
      if(L('n5')>=0)group(960,720,1,0,P(L('n5'),0,.3),()=>{panel(-760,-70,1520,140,{bg:'rgba(40,0,0,.9)',bd:CR});text('단골에게 할인 = 광고가 아니라',-720,4,{a:'left',f:'D',s:42,max:760});text(K('n5',0)>=0?'2,000원 덜 받기':'?',720,4,{a:'right',f:'D',s:56,c:K('n5',0)>=0?CR:C.gold});});
      srcLine('새 손님 다섯 명은 그림을 위한 예시 · 할인으로 새로 온 손님 비율은 공식 자료가 없다');});
    sub('n6','n7',()=>{
      salon29(440,470,.9,{});
      text('의자 하나 · 손 하나',1300,250,{f:'D',s:56,c:C.gold});
      // 하루 16칸 시간표 꽉 참
      for(let i=0;i<16;i++){const x=900+(i%8)*100,y=380+Math.floor(i/8)*120,k=P(L('n6'),.2+i*.06,.2);if(k<=0)continue;ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=CK;rr(x,y,84,96,12);ctx.fill();scissors29(x+52,y+48,.45,-.5);ctx.restore();}
      text('하루 16명 · 꽉 차면 새 손님 받을 시간이 없다',1300,670,{f:'D',s:36,c:'#fff',alpha:P(L('n6'),1.4,.3),max:900});
      if(L('n7')>=0)stampBox('할인은 원래 오던 손님이 가져간다',960,790,L('n7'),{s:50,c:C.gold,bg:'rgba(40,30,0,.95)'});
      srcLine('하루 16명 · 25일은 예시 가정');});
  }},
  /* ── 숫자를 바꾸는 손잡이 ── */
  knob:{draw(){
    sub('k1','k2',()=>{
      text('손잡이 ① 할인 폭 · 2,000원 → 1,000원',960,175,{f:'D',s:50,c:C.gold,max:1800});
      const X0=560,WW=1000,MX=2200,q=K('k2',0);
      text('카드 수수료',X0-30,320,{a:'right',f:'D',s:38,c:CFE});hbar(X0,320,WW,80,80,MX,CFE,'80원',{s:44});
      text('할인 1,000원',X0-30,460,{a:'right',f:'D',s:38,c:CR});hbar(X0,460,WW,80,L('k2')>=0?1000:0,MX,CR,L('k2')>=0?'1,000원':'',{s:44});
      if(q>=0)stampBox('그래도 12.5배',1300,630,q,{s:56,c:CR,bg:'rgba(40,0,0,.92)'});
      if(T>FR('k2',.75))pill('한 달 −9만 2,000원',600,640,{s:36,bg:'rgba(255,255,255,.94)'});
      srcLine('1,000 ÷ 80 = 12.5 · 100 × (1,000 − 80) = 92,000 (python3) · 예시 가정');});
    sub('k3','k3',()=>{
      text('손잡이 ② 현금 손님 · 넷 중 하나 → 둘 중 하나',960,175,{f:'D',s:48,c:C.gold,max:1800});
      const X0=600,WW=1000,MX=45,q=K('k3',0);
      text('100명 (25%)',X0-30,340,{a:'right',f:'D',s:40,c:'#7dd87d'});hbar(X0,340,WW,90,19.2,MX,CR,'−19만 2,000원',{s:44});
      text('200명 (50%)',X0-30,500,{a:'right',f:'D',s:40,c:'#7dd87d'});hbar(X0,500,WW,90,q>=0?38.4*E.out(P(q,0,.6)):0,MX,CR,q>=0?'−38만 4,000원':'?',{s:44,lc:q>=0?CR:C.gold});
      srcLine('200 × (2,000 − 80) = 384,000 (python3) · 예시 가정');});
    sub('k4','k5',()=>{
      text('손잡이 ③ 매출 구간 · 1년 3억 원을 넘으면',960,175,{f:'D',s:48,c:C.gold,max:1800});
      const rows=[['3억 이하','0.40%','80원'],['3억~5억','1.00%','200원'],['5억~10억','1.15%','230원'],['10억~30억','1.45%','290원']];
      rows.forEach(([a1,b1,c1],i)=>{const y=290+i*96,on=i===0||(i===1&&K('k4',0)>=0)||(i>1&&T>FR('k4',.55));group(960,y,1,0,on?1:.35,()=>{panel(-640,-40,1280,80,{bg:i===1&&K('k4',0)>=0?'rgba(255,122,69,.2)':'rgba(6,13,32,1)',bd:'rgba(255,255,255,.25)'});text(a1,-600,4,{a:'left',f:'D',s:36});text(b1,0,4,{f:'D',s:38,c:CFE});text('커트 한 번 '+c1,600,4,{a:'right',f:'D',s:38,max:400});});});
      if(T>FR('k4',.7)&&L('k5')<0)stampBox('2,000원 할인은 그래도 10배',960,720,T-FR('k4',.7),{s:50,c:CR,bg:'rgba(40,0,0,.92)'});
      if(L('k5')>=0)stampBox('어느 쪽으로 돌려도 · 할인이 아끼는 수수료보다 크다',960,720,L('k5'),{s:48,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('금융위원회 보도자료 2024.12.17 신용카드 우대수수료율 (3억 이하 0.40 · 3~5억 1.00 · 5~10억 1.15 · 10~30억 1.45%) · 20,000 × 율 (python3)');});
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('q1'),ov=L('q7');
    text('결제 방법별 값, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)*(ov>=0?1-P(ov,0,.3):1),max:1800});
    const cards=[['q2','내 수수료율','1년 매출 구간으로 정해진다','오늘: 신용 0.40% · 체크 0.15%'],['q3','한 번 수수료','값 × 수수료율','오늘: 80원'],['q4','할인 나누기 수수료','몇 배를 깎아 주나','오늘: 25배'],
      ['q5','할인 받는 손님 중 새 손님','원래 오던 손님이면 = 값 깎기','오늘: 대부분 단골'],['q6','본전 새 손님 수','(할인 − 아낀 수수료) ÷ 한 명 몫','오늘: 11명']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      if(ov>=0&&P(ov,0,.3)>=1)return;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:32,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,500,1,0,P(ov,0,.3),()=>{panel(-820,-330,1640,640,{bg:'rgba(6,13,32,1)',bd:C.gold});text('1년 매출 2억 원 네일숍 · 시술 한 번 4만 원',0,-250,{f:'D',s:40,max:1540});text('“현금이면 5,000원” · 현금 손님 한 달 60명',0,-185,{f:'D',s:40,max:1540,c:'#ffd0a3'});text('한 달에 얼마가 빠질까?',0,-115,{f:'D',s:46,max:1540,c:C.gold});
      const b=L('q7b');
      if(b>=0)text('수수료 0.40% = 160원 · 할인은 31배 넘게',0,-20,{f:'D',s:40,alpha:P(b,0,.3),max:1540});
      if(b>=0&&T>FR('q7b',.5))text('할인 30만 − 아낀 수수료 9,600',0,50,{f:'D',s:40,alpha:P(T,FR('q7b',.5),.3),max:1540});
      const k=K('q7b',0);if(k>=0)text('−29만 400원',0,180,{f:'D',s:120,c:CR,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,180,{f:'D',s:120,c:C.gold});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('1인 미용실 현금 할인 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      salon29(380,500,.72,{alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['커트 한 번 · 카드 수수료','2만 원 · 80원',CFE,b,.2],['“현금이면 2,000원”','수수료의 25배',CR,b,2.6],['한 달 할인 20만 원','수수료 반년 치 · 법이 바뀌어도 80원',C.gold,b2,.3]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;group(1260,320+i*160,1,0,kk,()=>{panel(-600,-65,1200,130,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-560,4,{a:'left',f:'D',s:32,max:440});text(v,560,4,{a:'right',f:'D',s:34,c:col,max:680});});});
    }else{
      salon29(500,500,.75,{});terminal29(1080,560,.7,{});drawMascot(1600,540,.55,'happy');
      stampBox('현금 할인 = 수수료 아끼기가 아니라 값 깎기',960,790,c,{s:44,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      if(L('z4')>=0&&L('z4b')<0)pill('예시 가정 · 창업·결제 권유 아님',1520,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-540,-70,1080,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 단골 미용실 커트값 · 현금 할인 받아 봤나요?',0,4,{s:38,w:900,c:C.ink,max:1020});});
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
