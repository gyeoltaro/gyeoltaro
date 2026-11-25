/* ════════════════════════════════════════════════════════════════════
   장면 (LF.32 문 닫는 식당 주방 계산서 — 국세청 2024 폐업 100만 8,282명 · 음식점업 15.2% · 사업 부진 50만 6,198명 (SBS Biz 2025.7.6) · 경향신문 2021.5.2 사례 1,500만 → 60만 (4%) · 국제뉴스 2025.8.2 중고 주방기구 신품의 30~50% · KB Think 2026.6.24 철거비 3.3㎡당 20만 · 최대 600만 · 중기부 2026.6.15 우정사업본부 현장 확인 · 예시 식당 20평 주방 2,000만 · 매입 10% 200만 · 철거비 400만 · 손질 200만 · 판매 40% 800만) — 수치·출처는 docs/longform-ep32.md
   중심 그림: 만 원짜리 200장 주방 + 철거 날짜에 빨간 동그라미가 쳐진 달력. 같은 기계에 붙은 가격표 셋(2,000만 · 200만 · 800만).
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['2','0','0','0','0','0','0','0','×','0','.','1','='];   // 20,000,000 × 0.1 = 2,000,000 (2 뒤 0 일곱)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}
function receipt32(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-300,-h/2);ctx.lineTo(300,-h/2);ctx.lineTo(300,h/2);for(let i=0;i<15;i++){ctx.lineTo(300-(i+.5)*40,h/2+(i%2?0:14));}ctx.lineTo(-300,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433',max:540});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-270,-h/2+84,270,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-270,yy,{a:'left',s:30,w:900,c:'#3a4256',max:330});text(v,270,yy,{a:'right',f:'D',s:38,c:c||'#1d2433',max:220});});
});}

const CNEW='#6FA8FF', CBUY='#FF4D4D', CSELL='#35E08A', CBOOK='#B98CFF', CDEM='#FF9F43', CY='#FFC531', CSTEEL='#c9d1dd';   // 새 값 · 철거 날 받는 값 · 다음 가게 값 · 장부 값 · 철거비 · 강조 · 스테인리스
/* 업소용 냉장고 (문 넷) */
function fridge32(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,150,120,10,0,0,7);ctx.fill();
  ctx.fillStyle=o.dim?'#7d838e':CSTEEL;rr(-110,-150,220,300,10);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=3;line(0,-140,0,140);line(-100,0,100,0);
  ctx.fillStyle='#5a6270';[[-20,-75],[20,-75],[-20,70],[20,70]].forEach(([hx,hy])=>{rr(hx-4,hy-26,8,52,4);ctx.fill();});
  ctx.fillStyle='#1d2433';rr(-60,-140,120,22,5);ctx.fill();ctx.fillStyle='#35E08A';text('3°C',0,-128,{s:16,w:900,c:'#35E08A'});
});}
/* 화구 (가스레인지 두 구 + 냄비) */
function stove32(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,80,120,10,0,0,7);ctx.fill();
  ctx.fillStyle=o.dim?'#6f757f':'#aab3c0';rr(-110,-20,220,100,8);ctx.fill();ctx.fillStyle='#2a2f3a';rr(-110,-40,220,24,6);ctx.fill();
  [-55,55].forEach(bx=>{ctx.strokeStyle=o.dim?'#555':'#FF7A2F';ctx.lineWidth=5;ctx.beginPath();ctx.arc(bx,-46,26,Math.PI,0);ctx.stroke();});
  ctx.fillStyle='#3a404d';rr(-90,-110,70,60,8);ctx.fill();ctx.fillStyle='#555c6a';rr(30,-96,60,46,8);ctx.fill();
  ctx.fillStyle='#1d2433';[-70,-25,20,65].forEach(kx=>{ctx.beginPath();ctx.arc(kx,30,9,0,7);ctx.fill();});
});}
/* 식기세척기 */
function dish32(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,110,90,10,0,0,7);ctx.fill();
  ctx.fillStyle=o.dim?'#7d838e':CSTEEL;rr(-80,-110,160,220,10);ctx.fill();ctx.fillStyle='#8f98a6';rr(-70,-40,140,120,8);ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=3;for(let i=0;i<5;i++)line(-55+i*27,-30,-55+i*27,70);
  ctx.fillStyle='#1d2433';rr(-60,-95,120,30,6);ctx.fill();ctx.fillStyle='#6FD3FF';ctx.beginPath();ctx.arc(-40,-80,6,0,7);ctx.fill();
});}
/* 주방 한 줄: 냉장고 둘 · 화구 · 식기세척기 */
function kitchen32(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(255,255,255,.05)';rr(-470,-230,940,420,24);ctx.fill();
  ctx.fillStyle='#8a929e';rr(-440,-230,880,40,10);ctx.fill();ctx.fillStyle='#6b7380';rr(-160,-260,320,40,8);ctx.fill();   // 후드
  fridge32(-330,30,.95,o);fridge32(-110,30,.95,o);stove32(120,90,.9,o);dish32(330,60,.85,o);
});}
/* 가격표 */
function tag32(x,y,s,str,col,o={}){group(x,y,s,o.rot??-.06,o.alpha??1,()=>{ctx.font=`400 ${o.fs||48}px ${FD}`;const w=ctx.measureText(str).width+70,h=(o.fs||48)*1.6;
  ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-w/2,-h/2);ctx.lineTo(w/2-20,-h/2);ctx.lineTo(w/2+18,0);ctx.lineTo(w/2-20,h/2);ctx.lineTo(-w/2,h/2);ctx.closePath();ctx.fill();
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(w/2-14,0,7,0,7);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-w/2,-h/2);ctx.lineTo(w/2-20,-h/2);ctx.lineTo(w/2+18,0);ctx.lineTo(w/2-20,h/2);ctx.lineTo(-w/2,h/2);ctx.closePath();ctx.stroke();
  if(o.label)text(o.label,-w/2+16,-h/2-24,{a:'left',f:'D',s:26,c:col});
  text(str,-10,3,{f:'D',s:o.fs||48,c:col});});}
/* 달력 한 장 (빨간 동그라미 + 글자) */
function cal32(x,y,s,day,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='#fdf6e8';rr(-170,-170,340,340,16);ctx.fill();ctx.fillStyle='#c0392b';rr(-170,-170,340,80,16);ctx.fillRect(-170,-110,340,20);
  text(o.month||'철거 날',0,-128,{f:'D',s:40,c:'#fff'});
  ctx.fillStyle='#bfb6a4';for(let r=0;r<4;r++)for(let c=0;c<7;c++){ctx.beginPath();ctx.arc(-135+c*45,-50+r*55,6,0,7);ctx.fill();}
  text(day,0,40,{f:'D',s:86,c:'#1d2433',max:300});
  if(o.circle!==false){const k=o.k??1;ctx.strokeStyle='#FF4D4D';ctx.lineWidth=10;ctx.beginPath();ctx.ellipse(0,40,95,80,-.1,0,Math.PI*2*k);ctx.stroke();}
});}
/* 만 원짜리 한 장 (작은 칸) */
function won32(x,y,w,h,col,o={}){ctx.save();ctx.globalAlpha*=(o.alpha??1);ctx.fillStyle=col;rr(x-w/2,y-h/2,w,h,4);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x+w*.22,y,h*.22,h*.3,0,0,7);ctx.stroke();ctx.restore();}
/* 동네 식당 가게 (상표 없음) */
function shop32(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,214,300,18,0,0,7);ctx.fill();
  ctx.fillStyle='#d9cdb8';rr(-260,-140,520,350,12);ctx.fill();
  ctx.fillStyle='#2f5d4a';rr(-250,-150,500,60,10);ctx.fill();
  ctx.fillStyle='#2a1b14';rr(-210,-250,420,90,14);ctx.fill();text(o.sign||'동네 식당',0,-203,{f:'D',s:48,c:o.closed?'#7a6a55':'#ffcf6a',max:390});
  if(o.closed){ctx.fillStyle='#8d939c';rr(-230,-80,460,280,8);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;for(let i=0;i<9;i++)line(-230,-60+i*30,230,-60+i*30);
    ctx.fillStyle='#fff';ctx.save();ctx.translate(0,40);ctx.rotate(-.05);rr(-110,-60,220,120,6);ctx.fill();ctx.restore();text('임대',0,20,{f:'D',s:56,c:'#c0392b'});text(o.note||'폐업 정리',0,80,{s:24,w:900,c:'#3a4256'});}
  else{ctx.fillStyle='#ffd98a';rr(-230,-70,300,230,10);ctx.fill();ctx.fillStyle='#5a3420';rr(110,10,110,200,8);ctx.fill();ctx.fillStyle='#ffd27a';ctx.beginPath();ctx.arc(130,110,7,0,7);ctx.fill();
    ctx.fillStyle='#2a2f3a';rr(-200,40,240,110,8);ctx.fill();ctx.fillStyle='#FF7A2F';ctx.beginPath();ctx.arc(-120,60,10,0,7);ctx.arc(-40,60,10,0,7);ctx.fill();}
});}
/* 작은 트럭 */
function truck32(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{ctx.fillStyle='#3a7bd5';rr(-160,-90,220,130,10);ctx.fill();ctx.fillStyle='#2a5aa0';rr(60,-60,100,100,12);ctx.fill();ctx.fillStyle='#bfe3ff';rr(80,-48,60,40,6);ctx.fill();
  ctx.fillStyle='#1d2433';[-110,10,110].forEach(wx=>{ctx.beginPath();ctx.arc(wx,48,24,0,7);ctx.fill();});ctx.fillStyle='#9aa3b8';[-110,10,110].forEach(wx=>{ctx.beginPath();ctx.arc(wx,48,9,0,7);ctx.fill();});});}
/* 모래시계 */
function hourglass32(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{ctx.fillStyle='#8a5a3a';rr(-80,-130,160,22,6);ctx.fill();rr(-80,108,160,22,6);ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-60,-108);ctx.lineTo(60,-108);ctx.lineTo(8,0);ctx.lineTo(60,108);ctx.lineTo(-60,108);ctx.lineTo(-8,0);ctx.closePath();ctx.stroke();
  const f=(T*.15)%1;ctx.fillStyle=CY;ctx.beginPath();ctx.moveTo(-50*(1-f),-100+90*f);ctx.lineTo(50*(1-f),-100+90*f);ctx.lineTo(4,-6);ctx.lineTo(-4,-6);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-55*f-5,104);ctx.lineTo(55*f+5,104);ctx.lineTo(4,104-90*f);ctx.lineTo(-4,104-90*f);ctx.closePath();ctx.fill();});}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3')){
      const a=L('o1');
      kitchen32(560,500,.9*E.back(P(a,0,.5))+.001,{dim:L('o2')<0&&K('o1',0)>=0});
      text('그림은 예시 · 실제 가게 아님',560,770,{s:26,w:800,c:C.dim,alpha:P(a,.4,.3)});
      tag32(1400,230,1,'2,000만 원',CNEW,{label:'2년 전 새 값',alpha:P(a,.4,.3)});
      const q=K('o1',0);
      if(q>=0){ctx.save();ctx.globalAlpha*=P(q,0,.2);ctx.strokeStyle=CBUY;ctx.lineWidth=8;line(1220,250,1590,215);ctx.restore();
        group(1400,430,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>tag32(0,0,1.1,'200만 원',CBUY,{label:'철거 날 받는 값'}));}
      else if(a>.8)text('?',1400,430,{f:'D',s:90,c:C.gold});
      if(L('o2')>=0){const k=K('o2',0);
        if(k>=0)group(1400,640,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>tag32(0,0,1.1,'800만 원',CSELL,{label:'닦아서 다음 가게로'}));else text('?',1400,640,{f:'D',s:90,c:C.gold});
        if(T>FR('o2',.6))pill('같은 기계 · 같은 달',560,140,{s:34,bg:'rgba(255,255,255,.94)'});}
      srcLine('가게 숫자는 예시 가정 (매입 = 새 값의 10% · 판매 = 40%) · 중고 주방기구 신품의 30~50%에 판매: 국제뉴스 2025.8.2 (EBS 극한직업 소개)');
    }else if(T<CT('o3c')){
      const b=L('o3'),q=K('o3',0);
      text('차이는 기계가 아니라',960,180,{f:'D',s:56,c:'#fff',alpha:P(b,0,.3)});
      cal32(560,500,1.05,'D-14',{alpha:P(b,.2,.3),month:'철거 날',k:q>=0?E.out(P(q,0,.5)):0});
      text('날짜에 쫓기는 사람',560,760,{f:'D',s:40,c:CBUY,alpha:P(b,.3,.3)});
      hourglass32(1360,480,1.3,{alpha:P(b,.5,.3)});text('기다릴 수 있는 사람',1360,760,{f:'D',s:40,c:CSELL,alpha:P(b,.5,.3)});
      if(q>=0)stampBox('날짜',960,470,q,{s:80,c:C.gold,bg:'rgba(40,30,0,.92)'});
    }else{
      const k0=L('o3c'),k9=L('o4'),k10=L('o5');
      if(k9<0){shop32(520,500,.9,{closed:true,alpha:P(k0,0,.3)});cal32(1060,450,.8,'D-14',{alpha:P(k0,.2,.3)});drawMascot(1550,520,.75,'think',{alpha:P(k0,.3,.3)});text('주방 2,000만 원 · 20평 · 예시',960,820,{f:'D',s:36,c:C.gold,alpha:P(k0,.5,.3)});}
      else{
      text('가게 열기 전, 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['폐업 통계 · 보도','철거비 지원 · 공식 안내','식당 숫자 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.7,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});}
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('문 닫는 식당 주방 계산서',960,200,{f:'D',s:104,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('주방 2,000만 원 · 철거 날 200만 원 · 다음 가게 800만 원',960,325,{s:44,w:900,alpha:P(a,.3,.3),max:1780});
    kitchen32(640,640,.6,{alpha:P(a,.2,.3)});cal32(1160,630,.62,'D-14',{alpha:P(a,.3,.3)});drawMascot(1580,660,.7,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 문 닫는 가게가 늘었다 ── */
  news:{draw(){
    sub('p1','p4',()=>{
      text('폐업 신고 사업자 (개인 + 법인)',960,170,{f:'D',s:52,c:C.gold});
      const q2=K('p2',0),X0=420,WW=1000,MX=110;
      [['2019',92.2159,'92만 2,159명','rgba(111,168,255,.55)',CT('p1')+.3],['2022',86.7292,'86만 7,292명','rgba(111,168,255,.55)',CT('p1')+.6],['2023',98.6487,'98만 6,487명','rgba(111,168,255,.7)',CT('p1')+.9],['2024',100.8282,'100만 8,282명',CBUY,KT('p2',0)]].forEach(([l,v,lb,col,t0],i)=>{const y=280+i*100;text(l,X0-24,y,{a:'right',f:'D',s:38,c:i===3?CBUY:'#c9ced9'});if(T<t0){text('?',X0+40,y,{f:'D',s:44,c:C.gold});return;}hbar(X0,y,WW,70,v*E.out(P(T,t0,.5)),MX,col,lb,{s:i===3?46:38});});
      if(q2>=0&&L('p3')<0)stampBox('1995년 통계 이후 처음 100만 명',960,700,q2-1.2,{s:44,c:CBUY,bg:'rgba(40,0,0,.9)'});
      if(L('p3')>=0&&L('p4')<0){const k=K('p3',0);group(960,700,1,0,P(L('p3'),0,.3),()=>{panel(-700,-80,1400,160,{bg:'rgba(6,13,32,1)',bd:CY});text('그 가운데 음식점업',-520,-28,{a:'left',f:'D',s:34,c:C.dim});text(k>=0?'15.2% · 약 15만 명 · 하루 400명 넘게':'?',-520,30,{a:'left',f:'D',s:46,c:k>=0?CY:C.gold,max:1200});});}
      if(L('p4')>=0){const k=K('p4',0);group(960,700,1,0,P(L('p4'),0,.3),()=>{panel(-700,-80,1400,160,{bg:'rgba(6,13,32,1)',bd:CBUY});text('폐업 사유 · 사업 부진',-520,-28,{a:'left',f:'D',s:34,c:C.dim});text(k>=0?'50만 6,198명 · 절반 넘게':'?',-520,30,{a:'left',f:'D',s:46,c:k>=0?CBUY:C.gold,max:1200});});}
      srcLine('SBS Biz 2025.7.6 「\'장사 접어요\' 폐업자 100만명 넘었다」 (국세청 국세통계 인용) · 음식점 약 15만 명 = 1,008,282 × 15.2% = 153,259 ÷ 366일 ≈ 419 (python3 계산)');});
    sub('p5','p6',()=>{
      text('한 식당의 마지막 날 (2021년 보도 사례)',960,170,{f:'D',s:50,c:C.gold});
      const q=K('p5',0),q6=K('p6',0);
      text('주방에 들인 돈',260,290,{a:'left',f:'D',s:34,c:C.dim});hbar(260,350,1300,80,1500*E.out(P(L('p5'),.3,.6)),1500,CNEW,'1,500만 원쯤',{s:40,lc:'#fff',k:.82});
      text('되판 돈',260,450,{a:'left',f:'D',s:34,c:C.dim});
      if(q>=0){hbar(260,510,1300,80,60*E.out(P(q,0,.5)),1500,CBUY,'60만 원',{s:44,k:.82});
        fridge32(560,700,.5);fridge32(760,700,.5);tag32(560,600,.6,'25만',CBUY);tag32(760,600,.6,'35만',CBUY);}
      else text('?',300,510,{f:'D',s:56,c:C.gold});
      if(L('p6')>=0){text('나머지 = 고철',1150,700,{f:'D',s:44,c:'#9aa3b8',alpha:P(L('p6'),0,.3)});stampBox('4%',1500,680,q6,{s:96,c:CBUY,bg:'rgba(40,0,0,.92)'});
        if(T>FR('p6',.55))pill('한 가게 사례 · 2021년',1150,790,{s:28,bg:'rgba(255,255,255,.9)'});}
      srcLine('경향신문 2021.5.2 「폐업 늘자 중고용품이 넘친다」 (주방에 1,500만 원 · 냉장고 25만 · 35만 원 매입 · 나머지 고철) · 60 ÷ 1,500 = 4% (python3)');});
  }},
  /* ── 예시 식당 ── */
  setup:{draw(){
    sub('s0','s0b',()=>{
      text('예시 식당 · 전용면적 20평',960,170,{f:'D',s:52,c:C.gold});
      const q=K('s0',0);
      kitchen32(760,520,1.0,{alpha:P(L('s0'),.2,.3)});
      if(q>=0)tag32(1560,300,1.1,'2,000만 원',CNEW,{label:'주방에 들인 돈'});else text('?',1560,300,{f:'D',s:90,c:C.gold});
      if(L('s0b')>=0){[['냉장고 둘',430,750],['화구',880,750],['식기세척기',1090,750],['작업대 · 후드',760,290]].forEach(([l,x,y],i)=>{const k=P(L('s0b'),.2+i*.5,.3);if(k>0)pill(l,x,y,{s:28,alpha:k,bg:'rgba(255,255,255,.92)'});});
        if(T>FR('s0b',.75))pill('전부 새것',1560,480,{s:36,bg:C.gold});}
      srcLine('식당 규모·주방 비용은 예시 가정 (실제 가게 아님)');});
    sub('s0c','s0d',()=>{
      shop32(480,500,.95,{closed:true});
      const q=K('s0c',0);
      text('2년 뒤',1250,190,{f:'D',s:56,c:C.gold});
      cal32(1250,460,1,'D-14',{k:q>=0?E.out(P(q,0,.5)):0});
      if(q>=0)stampBox('이 날까지 비우기',1250,690,q,{s:44,c:CBUY,bg:'rgba(40,0,0,.92)'});
      if(L('s0d')>=0)pill('원상복구까지',1250,790,{s:34,alpha:P(L('s0d'),0,.3),bg:'rgba(255,255,255,.92)'});
      srcLine('예시 가정 · 철거·원상복구 날짜는 임대차 계약에 따른다');});
  }},
  /* ── 2,000만 원 쪼개기 (만 원짜리 200장) ── */
  cut:{draw(){
    text('주방 2,000만 원 = 만 원짜리 200장',960,170,{f:'D',s:52,c:C.gold,max:1800});
    const k1=L('t1'),q2=K('t2',0),q3=K('t3',0);
    const CW=64,CH=32,GX=10,GY=10,X0=960-(20*CW+19*GX)/2+CW/2,Y0=250;   // 10줄 × 42 = 420 → y 234 ~ 654
    for(let i=0;i<200;i++){const r=Math.floor(i/20),c2=i%20,k=P(k1,.1+i*.006,.2);if(k<=0)continue;
      let col=CNEW,al=1;
      if(q2>=0&&i<20)col=CSELL;
      if(q3>=0&&i>=20){al=1-.8*P(q3,(i-20)*.004,.3);col='#5a6270';}
      won32(X0+c2*(CW+GX),Y0+r*(CH+GY),CW,CH,col,{alpha:k*al});}
    if(q2>=0){group(520,740,1,0,P(q2,0,.3),()=>{ctx.fillStyle=CSELL;rr(-180,-24,48,48,6);ctx.fill();text('철거 날 돌아오는 돈 · 20장',-110,2,{a:'left',f:'D',s:38,c:CSELL,max:600});});}
    else if(L('t2')>=0)text('철거 날 돌아오는 돈 · ?장',520,740,{f:'D',s:38,c:C.gold});
    if(q3>=0){group(1400,740,1,0,P(q3,0,.3),()=>{ctx.fillStyle='#5a6270';rr(-220,-24,48,48,6);ctx.fill();text('문 닫는 날 사라지는 돈 · 180장',-150,2,{a:'left',f:'D',s:38,c:'#c9ced9',max:620});});}
    if(L('t3')>=0&&T>FR('t3',.1)&&q3<0)pill('보도 사례는 4% · 10%도 넉넉한 예시',1400,740,{s:30,bg:'rgba(255,255,255,.92)'});
    srcLine('매입 = 새 값의 10% (예시 가정 · 2021년 보도 사례는 1,500만 → 60만 = 4%) · 2,000만 × 10% = 200만 = 20장 (python3)',850);
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='20,000,000 × 0.1 =';bigS='2,000,000';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:22,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:done?80:72,f:'D',c:done?'#b5451b':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('새 값 × 철거 날 매입 10%',1320,180,{f:'D',s:44,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0),X0=920,WW=760,MX=2000;
    if(L('c2')>=0){text('2년 전 새 값',X0,280,{a:'left',f:'D',s:30,c:C.dim});hbar(X0,340,WW*.8,64,2000*E.out(P(L('c2'),0,.5)),MX,CNEW,'2,000만',{s:40});
      text('오늘 받는 값',X0,440,{a:'left',f:'D',s:30,c:C.dim});hbar(X0,500,WW*.8,64,q2>=0?200*E.out(P(q2,0,.5)):0,MX,CBUY,q2>=0?'200만 원':'?',{s:46,lc:q2>=0?CBUY:C.gold});}
    if(dt>=0&&q2<0)group(1300,650,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(L('c3')>=0)group(1320,700,1,0,P(L('c3'),0,.3),()=>{panel(-470,-80,940,160,{bg:'rgba(6,13,32,1)',bd:CBOOK});text('가게 장부에는',0,-28,{f:'D',s:34,c:C.dim,max:900});text('이 주방이 얼마로 적혀 있을까?',0,30,{f:'D',s:40,c:CBOOK,max:900});});
  }},
  /* ── 장부 값과 파는 값 ── */
  book:{draw(){
    text('같은 주방, 두 가지 값',960,160,{f:'D',s:52,c:C.gold});
    const GX=300,GY=780,GW=1100,GH=520,MX=2000,yv=v=>GY-v/MX*GH,xv=t=>GX+t/5*GW;
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;line(GX,GY,GX+GW+40,GY);line(GX,GY,GX,GY-GH-20);
    for(let t=0;t<=5;t++)text(t+'년',xv(t),GY+34,{s:26,w:800,c:C.dim});
    [0,1000,2000].forEach(v=>text(v===0?'0':v.toLocaleString()+'만',GX-16,yv(v),{a:'right',s:24,w:800,c:C.dim}));
    const b1=L('b1');
    if(b1>=0){const k=E.out(P(b1,.3,1.2));ctx.strokeStyle=CBOOK;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(xv(0),yv(2000));ctx.lineTo(xv(5*k),yv(2000-2000*k));ctx.stroke();
      text('장부 값 (5년에 똑같이 깎기)',xv(3.2),yv(2000)+40,{a:'left',f:'D',s:30,c:CBOOK,alpha:P(b1,1,.3)});
      if(K('b1',0)>=0)pill('한 해 400만 원씩',xv(1)+150,yv(1600)-40,{s:28,alpha:P(K('b1',0),0,.3),bg:'rgba(185,140,255,.9)'});}
    const q2=K('b2',0);
    if(L('b2')>=0){ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(xv(2),GY,xv(2),yv(2000)-10);ctx.setLineDash([]);
      if(q2>=0){ctx.fillStyle=CBOOK;ctx.beginPath();ctx.arc(xv(2),yv(1200),14,0,7);ctx.fill();text('장부 1,200만',xv(2)-24,yv(1200)-6,{a:'right',f:'D',s:38,c:CBOOK});}}
    const q3=K('b3',0);
    if(L('b3')>=0){ctx.fillStyle=CBUY;ctx.beginPath();ctx.arc(xv(2),yv(200),14,0,7);ctx.fill();text('철거 날 200만',xv(2)-24,yv(200),{a:'right',f:'D',s:38,c:CBUY});
      if(q3>=0){const k=E.out(P(q3,0,.5));ctx.strokeStyle=CY;ctx.lineWidth=6;const bx=xv(2)+40;line(bx,yv(1200),bx+20,yv(1200));line(bx+20,yv(1200),bx+20,yv(1200)+(yv(200)-yv(1200))*k);line(bx,yv(200),bx+20,yv(200));
        text('1,000만 원',bx+40,(yv(1200)+yv(200))/2,{a:'left',f:'D',s:52,c:CY,alpha:P(q3,.3,.3)});}}
    if(L('b4')>=0){ctx.fillStyle=CSELL;ctx.beginPath();ctx.arc(xv(2),yv(800),14,0,7);ctx.fill();text('다음 가게 800만',xv(2)-24,yv(800),{a:'right',f:'D',s:38,c:CSELL,alpha:P(L('b4'),.5,.3)});
      stampBox('급한 값',1560,330,K('b4',0),{s:64,c:CY,bg:'rgba(40,30,0,.92)'});}
    if(L('b5')>=0)pill('장부 값 = 비용을 나누는 방법 · 팔리는 값이 아니다',1180,330+120,{s:28,alpha:P(L('b5'),0,.3),bg:'rgba(255,255,255,.92)'});
    srcLine('정액법 5년 · 잔존가치 0 (예시 가정, 실제 내용연수는 세법·회계 기준에 따른다) · 2,000 − 2 × 400 = 1,200 · 1,200 − 200 = 1,000 (python3)');
  }},
  /* ── 철거 날짜의 값 ── */
  demol:{draw(){
    sub('d1','d3',()=>{
      text('문 닫는 날 나가는 돈 · 철거와 원상복구',960,170,{f:'D',s:50,c:C.gold,max:1800});
      shop32(430,520,.85,{closed:true,note:'철거 예정'});
      const q2=K('d2',0),q3=K('d3',0);
      if(L('d2')>=0)group(1260,380,1,0,P(L('d2'),0,.3),()=>{panel(-500,-150,1000,300,{bg:'#f4efe2',bd:'#8a6d3b',lw:5,r:16});text('희망리턴패키지 · 점포 철거비 지원',-460,-100,{a:'left',f:'D',s:36,c:'#3a2a10',max:920});
        text('전용면적 3.3㎡ (한 평) 당',-460,-25,{a:'left',s:32,w:900,c:'#3a4256'});text(q2>=0?'20만 원':'?',440,-25,{a:'right',f:'D',s:52,c:q2>=0?'#b5451b':'#c08a00'});
        text('2025.7.11 이후 폐업 · 최대',-460,60,{a:'left',s:32,w:900,c:'#3a4256',alpha:T>FR('d2',.7)?1:0});text('600만 원',440,60,{a:'right',f:'D',s:52,c:'#b5451b',alpha:T>FR('d2',.8)?1:0});});
      if(L('d3')>=0){group(1260,700,1,0,P(L('d3'),0,.3),()=>{panel(-500,-70,1000,140,{bg:'rgba(6,13,32,1)',bd:CDEM});text('예시: 실제 철거비도 한 평 20만 원 × 20평',-460,-20,{a:'left',f:'D',s:30,c:C.dim,max:920});text(q3>=0?'400만 원':'?',0,32,{f:'D',s:50,c:q3>=0?CDEM:C.gold});});}
      srcLine('KB Think 2026.6.24 「희망리턴패키지로 재기하는 법?」 (공고 기준 3.3㎡당 20만 원 · 2025.7.11 이후 폐업 최대 600만 원) · 실제 철거비는 예시 가정 · 20 × 20 = 400 (python3)');});
    sub('d4','d5',()=>{
      text('문 닫는 날의 영수증 (20평)',960,160,{f:'D',s:50,c:C.gold});
      const q4=K('d4',0),q4b=K('d4b',0),q5=K('d5',0);
      const big=L('d4b')>=0&&L('d5')<0;
      const rows=big?[['주방 판 돈','+200만',CSELL],['철거비 (30평이면)','−600만',CBUY],['남는 돈',q4b>=0?'−400만':'?',CBUY]]:[['주방 판 돈','+200만',CSELL],['철거비','−400만',CBUY],['남는 돈 (지원 없음)',q4>=0?'−200만':'?',CBUY]];
      if(L('d5')>=0)rows.push(['철거비 지원','+400만','#1a7a44'],['남는 돈 (지원 받음)',q5>=0?'+200만':'?','#1a7a44']);
      receipt32(560,520,1,rows,{title:big?'30평 식당이라면':'철거 날 영수증'});
      if(q4>=0&&L('d4b')<0)stampBox('문 닫는 데도 돈이 든다',1400,330,q4,{s:46,c:CBUY,bg:'rgba(40,0,0,.92)'});
      if(big&&q4b>=0)pill('지원 한도 600만 원 = 딱 30평 몫',1400,330,{s:34,bg:'rgba(255,255,255,.94)'});
      if(L('d5')>=0){const k=P(T,FR('d5',.3),.3);if(k>0)group(1400,500,1,0,k,()=>{panel(-420,-190,840,380,{bg:'rgba(6,13,32,1)',bd:C.gold});text('지원 조건',0,-140,{f:'D',s:38,c:C.gold});
        ['철거 전에 신청','사업자등록 업체가 철거','직접 먼저 뜯으면 대상 밖'].forEach((s,i)=>{const kk=P(T,FR('d5',.4+i*.15),.2);if(kk<=0)return;if(i<2)checkMark(-340,-60+i*90,40,CSELL,kk);else{ctx.save();ctx.globalAlpha*=kk;ctx.strokeStyle=CBUY;ctx.lineWidth=7;ctx.lineCap='round';line(-358,-78+i*90,-322,-42+i*90);line(-322,-78+i*90,-358,-42+i*90);ctx.restore();}text(s,-290,-60+i*90,{a:'left',f:'D',s:38,alpha:kk,max:680});});});}
      srcLine('KB Think 2026.6.24 (철거 전 신청 원칙 · 사업자등록 업체 철거 · 자력 철거 먼저 하면 제외 · 유상 임차 점포 원칙) · 200 − 400 = −200 · +400 = +200 · 30평 20 × 30 = 600 (python3)');});
    sub('d6','d6',()=>{
      text('철거 현장, 직접 확인한다',960,190,{f:'D',s:56,c:C.gold});
      group(960,470,1,0,P(L('d6'),0,.3),()=>{panel(-640,-160,1280,320,{bg:'#f4efe2',bd:'#8a6d3b',lw:5,r:16});text('중소벤처기업부 × 우정사업본부 · 2026.6.15 업무협약',0,-90,{f:'D',s:40,c:'#3a2a10',max:1200});
        text('희망리턴패키지 점포철거비 지원 · 현장확인 협력',0,-10,{s:34,w:900,c:'#3a4256',max:1200});text('허위 철거 등 부정수급 예방 · 충청권 시범 먼저',0,70,{s:34,w:900,c:'#b5451b',max:1200,alpha:P(T,FR('d6',.5),.3)});});
      truck32(1500,760,.6,{alpha:P(L('d6'),.4,.3)});
      srcLine('중소벤처기업부 보도자료 2026.6.15 (KDI 경제교육·정보센터 게시) 「희망리턴패키지 점포철거비 지원 투명성 높인다」');});
  }},
  /* ── 중고상의 계산 ── */
  dealer:{draw(){
    text('200만 원에 사 간 쪽의 계산',960,160,{f:'D',s:52,c:C.gold});
    const m1=L('m1'),q2=K('m2',0),q3=K('m3',0),q4=K('m4',0);
    truck32(330,360,.9,{alpha:P(m1,0,.3)});kitchen32(330,620,.42,{alpha:P(m1,.2,.3),dim:q3<0});
    const X0=700,WW=1000,MX=900;
    [['사 온 값','200만',200,CBUY,CT('m1')+.5,'−'],['운반 · 세척 · 수리 · 창고','200만',200,CDEM,KT('m2',0),'−'],['다음 가게에 판 값 (새 값의 40%)','800만',800,CSELL,KT('m3',0),'+']].forEach(([l,lb,v,col,t0,sg],i)=>{const y=290+i*130;if(m1<0)return;text(l,X0,y-44,{a:'left',f:'D',s:30,c:C.dim,max:900});if(T<t0){text('?',X0+40,y,{f:'D',s:48,c:C.gold});return;}hbar(X0,y,WW,60,v*E.out(P(T,t0,.5)),MX,col,sg+lb,{s:42});});
    if(L('m3')>=0&&L('m4')<0&&T>FR('m3',.2))pill('보도: 손질해서 신품의 30~50% 값에 판다',1200,700,{s:30,bg:'rgba(255,255,255,.94)'});
    if(q4>=0){group(1200,690,1,0,P(q4,0,.3),()=>{panel(-500,-70,1000,140,{bg:'rgba(6,13,32,1)',bd:CSELL});text('800 − 200 − 200 =',-80,4,{a:'right',f:'D',s:40});text('+400만 원',-50,4,{a:'left',f:'D',s:56,c:CSELL});});}
    if(L('m3b')>=0&&L('m5')<0)pill('폐업이 늘수록 창고엔 싸게 사 온 기계가 쌓인다',1200,815,{s:28,alpha:P(L('m3b'),.3,.3),bg:'rgba(255,255,255,.9)'});
    if(L('m5')>=0){const k=P(L('m5'),0,.3);ctx.fillStyle=`rgba(6,13,32,${k})`;ctx.fillRect(0,110,W,770);
      group(960,480,1,0,k,()=>{cal32(-450,0,.9,'D-14',{});hourglass32(450,0,1.2);text('날짜에 쫓긴 쪽',-450,230,{f:'D',s:40,c:CBUY});text('창고와 시간을 가진 쪽',450,230,{f:'D',s:40,c:CSELL});});
      stampBox('기다릴 수 있는 쪽 +400만',960,805,K('m5',0)-2.5,{s:48,c:CSELL,bg:'rgba(0,40,20,.92)'});}
    srcLine('국제뉴스 2025.8.2 (EBS 극한직업 869화 소개: 신품의 30~50% 가격으로 판매 · 폐업 신고 100만 명 · 45%가 소매·음식점) · 손질 비용·판매 40%는 예시 가정 · 800 − 200 − 200 = 400 (python3)');
  }},
  /* ── 다음 사장님 ── */
  next:{draw(){
    const n1=L('n1'),q1=K('n1',0);
    if(L('n2')<0){
      text('800만 원에 사는 다음 사장님',960,170,{f:'D',s:52,c:C.gold});
      shop32(480,500,.85,{sign:'새 식당'});
      tag32(1300,330,1,'새것 2,000만',CNEW,{});tag32(1300,500,1,'중고 800만',CSELL,{});
      if(q1>=0)stampBox('1,200만 원 아낌',1300,700,q1,{s:56,c:CSELL,bg:'rgba(0,40,20,.92)'});
    }else{
      text('언젠가 문을 닫는 날 · 나올 때 잃는 값',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const X0=520,WW=1100,MX=2000,q3=K('n3',0),q4=K('n4',0);
      [['새것으로 시작',1800,'−1,800만 원',CBUY,q3,330],['중고로 시작',600,'−600만 원',CY,q4,560]].forEach(([l,v,lb,col,q,y])=>{text(l,X0-24,y,{a:'right',f:'D',s:40,c:'#fff'});
        text(l==='새것으로 시작'?'2,000만 내고 200만 받음':'800만 내고 200만 받음',X0,y-70,{a:'left',s:28,w:800,c:C.dim});
        if(q<0){text('?',X0+40,y,{f:'D',s:56,c:C.gold});return;}hbar(X0,y,WW,90,v*E.out(P(q,0,.6)),MX,col,lb,{s:50});});
      if(q4>=0)pill('잃을 수 있는 돈 = 3분의 1',1100,675,{s:36,alpha:P(q4,.8,.3),bg:'rgba(255,255,255,.94)'});
      if(L('n5')>=0&&L('n5b')<0)stampBox('봐야 할 숫자 = 나올 때 잃는 값',960,790,K('n5',0),{s:44,c:C.gold,bg:'rgba(40,30,0,.9)'});
      if(L('n5b')>=0)pill('중고는 고장 위험 · 손질 상태를 직접 본다',960,790,{s:32,alpha:P(L('n5b'),0,.3),bg:'rgba(255,255,255,.92)'});
    }
    srcLine('예시 계산 (python3): 2,000 − 800 = 1,200 · 2,000 − 200 = 1,800 · 800 − 200 = 600 · 같은 매입 200만을 받는다고 가정');
  }},
  /* ── 숫자를 바꿔 보면 ── */
  knob:{draw(){
    if(L('k4')<0){
      text('손잡이 ① 매입상이 부르는 값 (20평 · 철거비 400만)',960,160,{f:'D',s:46,c:C.gold,max:1800});
      const cols=[[560,'매입 값'],[960,'지원 없이'],[1400,'지원 받으면']];
      cols.forEach(([x,l])=>text(l,x,260,{f:'D',s:36,c:C.dim,alpha:P(L('k1'),.3,.3)}));
      const rows=[['4% (보도 사례)','80만','−320만','+80만','k2'],['10% (오늘 예시)','200만','−200만','+200만','k3'],['20%','400만','0원','+400만','k3']];
      rows.forEach(([r,a,b,c,id],i)=>{const y=380+i*140,t0=i===0?CT('k2'):i===1?CT('k3'):FR('k3',.5);if(T<t0-.2)return;const k=P(T,t0,.3),on=(i===0&&L('k3')<0)||(i===1&&T<FR('k3',.5))||(i===2&&T>=FR('k3',.5));
        group(0,0,1,0,k,()=>{panel(160,y-55,1600,110,{bg:on?'rgba(255,197,49,.14)':'rgba(255,255,255,.05)',bd:on?C.gold:null});text(r,200,y,{a:'left',f:'D',s:34,max:300});text(a,560,y,{f:'D',s:40});text(b,960,y,{f:'D',s:44,c:b==='0원'?'#fff':CBUY});text(c,1400,y,{f:'D',s:44,c:CSELL});});});
      srcLine('철거비 400만 · 지원 400만 (20평 × 20만) · 매입률은 예시 가정 · 80 − 400 = −320 · 200 − 400 = −200 · 400 − 400 = 0 (python3)');
    }else{
      text('손잡이 ② 두 달 기다리면',960,160,{f:'D',s:52,c:C.gold});
      const q5=K('k5',0);
      group(520,450,1,0,P(L('k4'),0,.3),()=>{panel(-380,-220,760,440,{bg:'rgba(6,13,32,1)',bd:CBUY});cal32(0,-60,.5,'D-14',{});text('오늘 매입상에게 10%',0,90,{f:'D',s:38});text('+200만',0,160,{f:'D',s:60,c:CSELL});});
      group(1400,450,1,0,P(L('k4'),.6,.3),()=>{panel(-380,-220,760,440,{bg:'rgba(6,13,32,1)',bd:CSELL});hourglass32(-230,-80,.6);text('두 달 뒤 직접 30%',60,-130,{f:'D',s:38});text('+600만',60,-60,{f:'D',s:56,c:CSELL});
        if(L('k5')>=0){text('월세 200만 × 2',60,20,{f:'D',s:36,c:C.dim});text(q5>=0?'−400만':'?',60,80,{f:'D',s:56,c:q5>=0?CBUY:C.gold});if(T>FR('k5',.55))text('= +200만',60,160,{f:'D',s:60,c:CSELL});}});
      if(T>FR('k5',.8))text('=',960,450,{f:'D',s:120,c:C.gold});
      if(L('k6')>=0&&L('k6b')<0)stampBox('월세가 차이를 먹는다',960,790,K('k6',0)+.01,{s:48,c:C.gold,bg:'rgba(40,30,0,.9)'});
      if(L('k6b')>=0)pill('매입이 5%뿐이고 월세가 싸면 → 기다리는 편이 낫다',960,790,{s:32,alpha:P(L('k6b'),0,.3),bg:'rgba(255,255,255,.92)'});
      srcLine('예시 가정: 월세 200만 원 · 두 달 뒤 30% (600만)에 직접 판매 · 600 − 400 = 200 = 2,000 × 10% (python3)');
    }
  }},
  /* ── 체크 ── */
  check:{draw(){
    const a=L('q1'),ov=L('q7');
    text('가게 열기 전, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)*(ov>=0?1-P(ov,0,.3):1),max:1800});
    const cards=[['q2','주방 새 값','장비 · 집기 전부','오늘: 2,000만 원'],['q3','나올 때 받는 값','철거 날 매입','오늘: 10% · 200만 (사례 4%)'],['q4','철거비','평수 × 한 평 20만 원','오늘: 20평 400만 · 지원 조건'],
      ['q5','기다리는 값','한 달 월세 = 한 달 기다림','오늘: 두 달 400만'],['q6','나올 때 잃는 값','들어간 값 − 받는 값','새것 1,800만 · 중고 600만']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      if(ov>=0&&P(ov,0,.3)>=1)return;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:34,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,500,1,0,P(ov,0,.3),()=>{panel(-820,-330,1640,640,{bg:'rgba(6,13,32,1)',bd:C.gold});text('카페 장비 3,000만 원 · 문 닫을 때 10%',0,-250,{f:'D',s:40,max:1540});text('가게 15평 · 철거비 한 평 20만 원 · 지원 없음',0,-185,{f:'D',s:40,max:1540,c:'#ffd0a3'});text('얼마가 남거나 모자랄까?',0,-115,{f:'D',s:46,max:1540,c:C.gold});
      const b=L('q7b');
      if(b>=0)text('받는 돈 3,000만 × 10% = 300만 원',0,-20,{f:'D',s:40,alpha:P(b,0,.3),max:1540});
      if(b>=0&&T>FR('q7b',.2))text('철거비 15평 × 20만 = 300만 원',0,50,{f:'D',s:40,alpha:P(T,FR('q7b',.2),.3),max:1540});
      const k=K('q7b',0);if(k>=0)text('0원',0,180,{f:'D',s:130,c:CBUY,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,180,{f:'D',s:120,c:C.gold});});}
  }},
  /* ── 마무리 ── */
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('문 닫는 식당 주방 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      kitchen32(400,500,.55,{alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['2년 전 새 값','2,000만 원',CNEW,b,.2],['철거 날 받는 값','200만 원',CBUY,b,1.6],['장부에 남은 값','1,200만 원',CBOOK,b,3.2],['닦아서 다음 가게로','800만 원',CSELL,b2,.2],['기다릴 수 있는 쪽','+400만 원',CSELL,b2,2.2]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;group(1260,270+i*125,1,0,kk,()=>{panel(-560,-52,1120,104,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-520,4,{a:'left',f:'D',s:34,max:560});text(v,520,4,{a:'right',f:'D',s:42,c:col,max:480});});});
    }else{
      kitchen32(560,480,.7,{});cal32(1250,470,.7,'D-14',{});drawMascot(1650,540,.55,'happy');
      stampBox('주방 기계의 값 = 산 값이 아니라 철거 날짜',960,790,c,{s:42,c:C.gold,bg:'rgba(40,30,0,.85)'});
      if(L('z4')>=0&&L('z4b')<0)pill('중고 거래를 하지 말자는 게 아니다',1300,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('예시 가정 · 창업 권유·만류 아님 · 📌 출처는 설명란',1320,140,{s:30,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-540,-70,1080,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 주방 기계, 얼마에 넘기셨나요?',0,4,{s:40,w:900,c:C.ink,max:1020});});
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
