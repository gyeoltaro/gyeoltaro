/* ════════════════════════════════════════════════════════════════════
   장면 (LF.26 동네서점 계산서 — 정가 1만 5,000원 · 공급률 75% = 1만 1,250원 · 서점 몫 3,750원 · 인터넷서점 65% 9,750원 → 2,250원 싸게 팔고 3,000원 · 할인 따라가면 1,500원 · 2.5배) — 수치·출처는 docs/longform-ep26.md
   중심 그림: 천 원짜리 열다섯 장 → 11장 하고 4분의 1이 '들여오는 값', 3장 하고 4분의 3이 서점 몫. 할인 장에서는 15,000원 띠의 오른쪽 끝(몫)을 할인·적립이 갉아먹는다 (예시).
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['1','5','0','0','0','×','0','.','2','5','×','5','0','0','−','1','2','0','0','0','0','0','='];   // 15,000 × 0.25 × 500 − 1,200,000 = 675,000 (0 개수: 15000 은 셋, 1200000 은 다섯)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433',max:460});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:32,w:900,c:'#3a4256',max:250});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433',max:200});});
});}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CL='#6FD3FF', CO='#B18CFF', CP='#35E08A', CG='#9aa3b8', CB='#c9a27a';   // 동네서점 · 인터넷서점 · 몫 · 회색 · 들여오는 값
/* 동네서점 앞 (상표 없음). o.dim 불 꺼짐, o.tag 아래 딱지 */
function bookShop26(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,214,320,20,0,0,7);ctx.fill();
  ctx.fillStyle='#4a3f38';rr(-280,-210,560,420,10);ctx.fill();
  ctx.fillStyle=o.dim?'#5a5048':'#2f6b4f';rr(-280,-210,560,96,8);ctx.fill();
  text(o.name||'○○ 책방',0,-160,{f:'D',s:58,c:o.dim?'#b9b0a6':'#fff4d6',max:500});
  /* 진열창: 책장 세 칸 */
  ctx.save();if(!o.dim){ctx.shadowColor='rgba(255,226,160,.5)';ctx.shadowBlur=24;}ctx.fillStyle=o.dim?'#2b2a2c':'#f6e7c8';rr(-250,-90,300,270,6);ctx.fill();ctx.restore();
  const cols=['#e85d4f','#3c7dd9','#f2b134','#3aa66b','#8e5bd6','#e0723a','#2c9fb0','#c94a7a'];
  for(let r=0;r<3;r++){let bx=-238;let i=r*3;while(bx<36){const bw=18+((i*7)%3)*6,bh=58+((i*5)%3)*8;ctx.fillStyle=o.dim?'#444':cols[i%cols.length];ctx.fillRect(bx,-90+(r+1)*88-6-bh,bw,bh);bx+=bw+3;i++;}
    ctx.fillStyle=o.dim?'#3a3430':'#8a6a45';ctx.fillRect(-250,-90+(r+1)*88-6,300,8);}
  /* 문 */
  ctx.fillStyle=o.dim?'#262c38':'#d9ead9';rr(80,-90,170,300,6);ctx.fill();ctx.fillStyle='#64748b';ctx.beginPath();ctx.arc(230,60,8,0,7);ctx.fill();
  if(!o.dim){ctx.fillStyle='#fff8c4';rr(110,-60,110,70,6);ctx.fill();text('OPEN',165,-24,{f:'D',s:28,c:'#2f6b4f'});}
  /* 바깥 화분 */
  ctx.fillStyle='#8a5a2b';rr(-300,160,40,50,6);ctx.fill();ctx.fillStyle='#3aa66b';ctx.beginPath();ctx.arc(-280,150,30,0,7);ctx.fill();
  if(o.tag)group(0,250,1,0,1,()=>{ctx.fillStyle='rgba(6,13,32,.9)';rr(-190,-34,380,68,34);ctx.fill();text(o.tag,0,3,{f:'D',s:34,c:C.gold,max:350});});
});}
/* 책 한 권 (앞표지) + 정가 딱지 */
function book26(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,170,150,14,0,0,7);ctx.fill();
  ctx.fillStyle='#e9e2d0';rr(-118,-158,236,318,8);ctx.fill();
  ctx.fillStyle=o.col||'#3c7dd9';rr(-128,-162,236,318,10);ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-128,-162,22,318);
  ctx.fillStyle='rgba(255,255,255,.9)';rr(-80,-110,150,18,6);ctx.fill();rr(-80,-80,110,14,6);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.arc(-5,30,46,0,7);ctx.fill();
  if(o.price!==false)group(70,110,1,-.12,1,()=>{ctx.fillStyle='#fff';rr(-92,-34,184,68,12);ctx.fill();ctx.strokeStyle='#d62f2f';ctx.lineWidth=4;rr(-92,-34,184,68,12);ctx.stroke();text(o.price||'정가 15,000원',0,3,{f:'D',s:28,c:'#1d2433',max:170});});
});}
/* 천 원짜리 한 장. f = 왼쪽부터 칠해진 비율, fc = 칠하는 색 */
function bill26(x,y,w,h,f,fc,o={}){ctx.save();ctx.globalAlpha*=(o.alpha??1);
  ctx.fillStyle='#d8e6c9';rr(x,y,w,h,8);ctx.fill();
  if(f>0){ctx.save();rr(x,y,w,h,8);ctx.clip();ctx.fillStyle=fc;ctx.fillRect(x,y,w*Math.min(1,f),h);ctx.restore();}
  if(o.g>0){ctx.save();rr(x,y,w,h,8);ctx.clip();ctx.fillStyle=CP;ctx.globalAlpha*=o.g;ctx.fillRect(x+w*Math.min(1,f),y,w*(1-Math.min(1,f)),h);ctx.restore();}
  ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;rr(x+6,y+6,w-12,h-12,6);ctx.stroke();
  ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(-Math.PI/2);text('1,000',0,2,{f:'D',s:30,c:'rgba(29,36,51,.75)'});ctx.restore();
  ctx.restore();}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3b')){
      const a=L('o1');
      book26(420,470,1.15*E.back(P(a,0,.5))+.001,{});
      text('예시 책 · 그림은 실제 책이 아님',420,780,{s:26,w:800,c:C.dim,alpha:P(a,.3,.3)});
      const rows=[['동네서점 · 정가를 다 받으면','o1',0,'3,750원',CL],['인터넷서점 · 2,250원 싸게 팔고도','o2',0,'3,000원',CO],['동네서점이 할인을 따라가면','o3',0,'1,500원',C.red]];
      rows.forEach(([lb,id,j,v,col],i)=>{if(L(id)<0)return;const y=230+i*220;
        group(1300,y,1,0,P(L(id),0,.3),()=>{panel(-520,-90,1040,180,{bd:col,bg:'rgba(6,13,32,.6)'});text(lb,-480,-38,{a:'left',f:'D',s:38,c:C.dim,max:900});text('서점에 남는 돈',-480,40,{a:'left',f:'D',s:40,max:420});});
        big(id,j,1640,y+28,v,{f:'D',s:84,c:col,a:'right'});});
      if(K('o3',1)>=0)stampBox('같은 돈 = 2.5배 팔기',1330,850-40,K('o3',1),{s:46,c:C.red,bg:'rgba(40,0,0,.92)'});
      srcLine('예시 가정 · 정가 1만 5,000원 책 한 권 · 세금·카드 수수료 제외');
    }else if(T<CT('o4')){
      const b=L('o3b');
      text('같은 정가 1만 5,000원',960,190,{f:'D',s:60,c:C.gold});
      book26(560,500,1,{col:'#3c7dd9'});text('동네서점',560,740,{f:'D',s:50,c:CL});
      book26(1360,500,1,{col:'#8e5bd6'});text('인터넷서점',1360,740,{f:'D',s:50,c:CO});
      group(960,470,E.back(P(b,.4,.4))+.001,0,1,()=>text('?',0,0,{f:'D',s:200,c:C.gold,glow:'rgba(255,197,49,.5)'}));
    }else{
      const k9=L('o4'),k10=L('o5');
      text('서점 차리기 전에 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['공급률 · 할인 한도 · 보도','실태조사 · 판매 통계 · 공공 자료','가게 숫자 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.6,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('동네서점 계산서',960,220,{f:'D',s:110,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('정가 1만 5,000원 · 서점 몫 3,750원 · 할인하면 1,500원',960,350,{s:48,w:900,alpha:P(a,.3,.3),max:1780});
    bookShop26(560,660,.62,{alpha:P(a,.2,.3)});book26(1060,690,.75,{alpha:P(a,.3,.3),rot:-.06});drawMascot(1560,690,.72,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 서점 ── */
  setup:{draw(){
    sub('p1','p3b',()=>{
      bookShop26(480,470,1);
      if(L('p2')>=0){const q=K('p2',0);
        text('사장님 혼자 · 하루 10시간 · 26일',1340,210,{f:'D',s:42,c:C.dim,max:900});
        text('한 달에 파는 책',1340,310,{f:'D',s:44,c:C.dim});text(q>=0?'500권':'?',1340,410,{f:'D',s:110,c:q>=0?'#fff':C.gold});
        if(q>=0)text('× 1만 5,000원 = 매출 750만 원',1340,505,{f:'D',s:40,c:C.gold,alpha:P(q,.4,.3),max:900});}
      if(L('p3')>=0){const q=K('p3',0);group(1340,610,1,0,P(L('p3'),.1,.3),()=>{panel(-470,-56,940,112,{bd:CL,bg:'rgba(6,13,32,1)'});text('한 해 매출 1억 원 미만 서점',-430,4,{a:'left',f:'D',s:36,max:560});text(q>=0?'49.5%':'?',430,4,{a:'right',f:'D',s:56,c:q>=0?CL:C.gold});});}
      if(L('p3b')>=0)group(1340,760,1,0,P(L('p3b'),.2,.3),()=>{ctx.fillStyle='rgba(6,13,32,1)';rr(-470,-56,940,112,20);ctx.fill();text('2025년 1조 7,720억 원 ÷ 1억 573만 부',0,-18,{s:30,w:900,c:'#c9ced9',max:900});text('≈ 한 권 1만 6,760원',0,28,{f:'D',s:40,c:C.gold,alpha:P(T,FR('p3b',.7),.3)});});
      srcLine('예시 가정 · 49.5%: 2024 지역서점 실태조사(출판진흥원) 인용 뉴시스 2025.8.17 · 판매: 출판유통통합전산망 2025 연간(출판진흥원)');});
    sub('p4','p5',()=>{
      receipt(560,470,1,[['월세','90만'],['전기·통신·기타','30만'],['= 고정비',K('p4',0)>=0?'120만':'?','#d62f2f']],{title:'책이 안 팔려도 나가는 돈'});
      if(L('p5')>=0){book26(1360,450,.9*E.back(P(L('p5'),.1,.4))+.001,{});text('1만 5,000원은 어디로?',1360,740,{f:'D',s:56,c:C.gold,alpha:P(L('p5'),.4,.3)});}
      srcLine('예시 가정 · 보증금·세금·카드 수수료·사장님 인건비 제외');});
  }},
  /* ── 1만 5,000원 쪼개기 (천 원짜리 열다섯 장) ── */
  cut:{draw(){
    const BW=96,BH=210,GAP=8,X0=960-(15*(BW+GAP)-GAP)/2,Y0=370;
    const q3=K('s3',0),prog=q3>=0?E.io(P(q3,0,1.4)):0,q5=K('s5',0),g=q5>=0?P(q5,0,.6):0;
    text(L('s2')<0?'정가 1만 5,000원 = 천 원짜리 15장':'공급률 = 정가에 대한 들여오는 값의 비율',960,180,{f:'D',s:52,c:C.gold,max:1800});
    for(let i=0;i<15;i++){const k=E.back(P(L('s1'),.2+i*.06,.35));if(k<=0)continue;const f=Math.max(0,Math.min(1,11.25*prog-i));
      const lift=L('s4')>=0&&f>=1?-26*E.out(P(L('s4'),.2,.5)):0;
      group(X0+i*(BW+GAP)+BW/2,Y0+BH/2+lift,k,0,L('s4')>=0&&f>=1?1-.45*P(L('s4'),.2,.5):1,()=>bill26(-BW/2,-BH/2,BW,BH,f,CB,{g:i>=11?g:0}));}
    if(L('s2')>=0&&q3<0)group(960,680,1,0,P(L('s2'),.3,.3),()=>{panel(-560,-70,1120,140,{bd:CB,bg:'rgba(6,13,32,1)'});text('📚 출판사·도매상 → 서점',0,4,{f:'D',s:52,c:'#fff',max:1060});});
    if(q3>=0){const xe=X0+11.25*(BW+GAP);ctx.save();ctx.strokeStyle=CB;ctx.lineWidth=5;line(X0,Y0-30,xe-GAP,Y0-30);line(X0,Y0-44,X0,Y0-16);line(xe-GAP,Y0-44,xe-GAP,Y0-16);ctx.restore();
      popText(KT('s3',0),(X0+xe)/2,Y0-80,'들여오는 값 1만 1,250원 (75%)',{f:'D',s:44,c:CB});}
    if(L('s4')>=0)text('책이 서점에 들어오기도 전에 나가는 돈',(X0+X0+11.25*(BW+GAP))/2,Y0+BH+70,{f:'D',s:40,c:'#e8cfb2',alpha:P(L('s4'),.3,.3),max:1100});
    if(q5>=0){const xs=X0+11.25*(BW+GAP),xe=X0+15*(BW+GAP)-GAP;ctx.save();ctx.strokeStyle=CP;ctx.lineWidth=5;line(xs,Y0+BH+30,xe,Y0+BH+30);ctx.restore();
      popText(KT('s5',0),(xs+xe)/2-30,Y0+BH+150,'서점 몫 3,750원',{f:'D',s:58,c:CP,glow:'rgba(53,224,138,.35)'});
      if(T>FR('s5',.55))text('→ 월세 · 전기 · 사장님 몫',(xs+xe)/2-30,Y0+BH+220,{s:30,w:900,c:'#c9ced9'});}
    srcLine('작은 서점 공급률 65~75%: 주간경향 2024.2.23 · 75%는 그 범위 안의 예시 · 15,000 × 0.75 = 11,250 (python3)');
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='15,000 × 0.25 × 500 − 1,200,000 =';bigS='675,000';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:24,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:done?84:96,f:'D',c:done?'#1a7a44':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('한 권 몫 3,750원 × 500권 − 고정비 120만',1320,180,{f:'D',s:42,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0);
    text('책 500권 몫',920,320,{a:'left',f:'D',s:40});hbar(920,390,820,70,187.5,220,CP,'187만 5,000',{s:42});
    text('고정비',920,490,{a:'left',f:'D',s:40});hbar(920,560,820,70,120,220,C.red,'120만',{s:42});
    if(q2>=0)stampBox('사장님 몫 67만 5,000원',1330,680,q2,{s:56,c:C.gold,bg:'rgba(40,30,0,.92)'});
    if(dt>=0&&q2<0)group(1300,690,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(L('c3')>=0){const q=K('c3',0);group(1330,800,1,0,P(L('c3'),0,.3),()=>{panel(-440,-50,880,100,{bg:'rgba(6,13,32,1)',bd:C.red});text('÷ 260시간 = 시간당',-400,4,{a:'left',f:'D',s:38,max:480});text(q>=0?'2,596원':'?',400,4,{a:'right',f:'D',s:50,c:q>=0?C.red:C.gold});});}
    if(L('c4')>=0)pill('※ 손님이 정가를 다 냈을 때',1330,250,{s:30,bg:'rgba(255,255,255,.94)',alpha:P(L('c4'),.2,.3)});
  }},
  /* ── 인터넷서점은 어떻게 싸게 팔까 ── */
  online:{draw(){
    sub('n1','n3',()=>{
      text('공급률 (정가에 대한 들여오는 값)',960,170,{f:'D',s:52,c:C.gold,max:1700});
      const X0=640,WW=1100,y1=320,y2=470;const k2=L('n2');
      [[y1,'온라인·대형서점',60,65,CO],[y2,'작은 서점',65,75,CL]].forEach(([y,t,a,b,col],i)=>{
        text(t,X0-30,y,{a:'right',f:'D',s:42,c:col,alpha:k2>=0?1:.3});ctx.fillStyle='rgba(255,255,255,.07)';rr(X0,y-40,WW,80,24);ctx.fill();
        const k=k2>=0?E.out(P(k2,.4+i*.4,.6)):0;if(k>0){ctx.fillStyle=col;rr(X0,y-40,WW*b/100*k,80,24);ctx.fill();ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(X0+WW*a/100*k,y-40,3,80);}
        if(k>.95)text(a+'~'+b+'%',X0+WW*b/100+16,y+2,{a:'left',f:'D',s:44,c:col});});
      ctx.save();ctx.strokeStyle='rgba(255,255,255,.25)';ctx.setLineDash([6,6]);ctx.lineWidth=2;[50,100].forEach(p=>line(X0+WW*p/100,y1-60,X0+WW*p/100,y2+60));ctx.restore();
      text('50%',X0+WW*.5,y2+84,{s:24,w:800,c:C.dim});
      if(L('n3')>=0){const q=K('n3',0);
        group(620,700,1,0,P(L('n3'),0,.3),()=>{panel(-330,-80,660,160,{bd:CO});text('정가 1만 원 → 온라인서점',0,-30,{f:'D',s:34,c:C.dim,max:600});text('6,500원',0,38,{f:'D',s:60,c:CO});});
        group(1300,700,1,0,P(L('n3'),.4,.3),()=>{panel(-330,-80,660,160,{bd:CL});text('정가 1만 원 → 작은 서점',0,-30,{f:'D',s:34,c:C.dim,max:600});text(q>=0?'7,500원':'?',0,38,{f:'D',s:60,c:q>=0?CL:C.gold});});}
      srcLine('주간경향 2024.2.23 \'도서 할인을 허하노라…비싸게 사와 싸게 팔라고?\' (공급률·1만 원 책 예)');});
    sub('n4','n6',()=>{
      const q4=K('n4',0),n5=L('n5');
      receipt(560,450,.92,[['들여오는 값',q4>=0?'−9,750':'?','#d62f2f'],['파는 값 (−10%)',n5>=0?'13,500':'',''],['적립 5%',n5>=0?'−750':'','#d62f2f'],['남는 돈',n5>=0&&T>FR('n5',.6)?'3,000':'','#1a7a44']],{title:'인터넷서점 (공급률 65%)'});
      receipt(1360,450,.92,[['들여오는 값','−11,250','#d62f2f'],['파는 값 (정가)','15,000'],['적립','0'],['남는 돈','3,750','#1a7a44']],{title:'동네서점 (공급률 75%)',alpha:.85});
      if(L('n6')>=0)stampBox('들여오는 값 차이 1,500원',960,790,L('n6'),{s:52,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('예시 계산: 15,000 × 0.65 = 9,750 · 15,000 × 0.9 − 750 − 9,750 = 3,000 (python3) · 할인·적립 10%·5%는 도서정가제 15% 안의 예');});
    sub('n7','n7',lt=>{
      text('정가 2만 원짜리 책 · 서점 몫',960,170,{f:'D',s:54,c:C.gold});
      const X0=560,WW=1000;
      text('공급률 80%',X0-30,360,{a:'right',f:'D',s:46,c:CL});hbar(X0,360,WW,100,4000*E.out(P(lt,.6,.6)),9000,CL,'4,000원',{s:54});
      text('공급률 60%',X0-30,540,{a:'right',f:'D',s:46,c:CO});hbar(X0,540,WW,100,T>FR('n7',.5)?8000*E.out(P(T,FR('n7',.5),.6)):0,9000,CO,T>FR('n7',.5)?'8,000원':'',{s:54});
      if(T>FR('n7',.75))stampBox('20%p 차이 → 몫 2배',960,730,T-FR('n7',.75),{s:56,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('주간경향 2025.11.24 \'반 아마존법 한국서도 가능할까\' (정가 2만 원 책, 공급률 80% → 4,000원 · 60% → 8,000원)');});
  }},
  /* ── 할인을 따라가면 (어두운 장) ── */
  disc:{draw(){
    sub('d1','d2',()=>{
      book26(520,470,1.1,{price:false});
      group(560,430,1,-.08,1,()=>{ctx.fillStyle='#fff';rr(-150,-50,300,100,14);ctx.fill();text('15,000원',0,4,{f:'D',s:56,c:'#1d2433'});
        const k=P(L('d1'),1,.4);if(k>0){ctx.strokeStyle='#d62f2f';ctx.lineWidth=8;line(-130,0,-130+260*k,0);}});
      if(L('d2')>=0){group(1340,300,1,0,P(L('d2'),0,.3),()=>{panel(-470,-80,940,160,{bd:C.gold,bg:'rgba(6,13,32,1)'});text('도서정가제: 정가의 15% 안에서',0,-26,{f:'D',s:40,c:C.gold,max:880});text('할인 + 적립(마일리지·사은품)',0,36,{s:34,w:900,c:'#fff',max:880});});
        const k=P(T,FR('d2',.6),.3);if(k>0)group(1340,560,1,0,k,()=>{text('10% 할인 → 13,500원',0,-40,{f:'D',s:56,c:'#fff'});text('5% 적립 → 750원',0,50,{f:'D',s:56,c:'#fff'});});}
      srcLine('도서정가제: 정가의 15% 이내 가격 할인 + 경제상 이익(주간경향 2024.2.23) · 10%·5%는 예시');});
    sub('d3','d4',()=>{
      text('정가 1만 5,000원 한 권이 나뉘는 곳',960,170,{f:'D',s:50,c:C.gold});
      const X0=210,PX=0.1,Y=330,HH=130,q3=K('d3',0),cut=q3>=0?E.out(P(q3,-.6,.8)):0;
      ctx.fillStyle=CB;rr(X0,Y,11250*PX,HH,14);ctx.fill();text('들여오는 값 11,250',X0+11250*PX/2,Y+HH/2+2,{f:'D',s:46,c:'#1d2433'});
      ctx.fillStyle=CP;rr(X0+11250*PX,Y,3750*PX,HH,14);ctx.fill();
      if(cut>0){ctx.save();ctx.fillStyle=C.red;ctx.globalAlpha*=.9;rr(X0+(15000-2250*cut)*PX,Y,2250*PX*cut,HH,14);ctx.fill();ctx.restore();
        ctx.save();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=4;for(let xx=X0+(15000-2250*cut)*PX;xx<X0+15000*PX;xx+=26)line(xx,Y+HH,xx+26,Y);ctx.restore();}
      if(cut<.5)text('몫 3,750',X0+(11250+1875)*PX,Y+HH/2+2,{f:'D',s:40,c:'#0d1a12'});
      else text('1,500',X0+(11250+750)*PX,Y+HH/2+2,{f:'D',s:40,c:'#0d1a12'});
      if(cut>.9){text('할인 1,500 + 적립 750',X0+(15000-1125)*PX,Y-34,{f:'D',s:32,c:'#ffb3b3'});}
      if(q3>=0)popText(KT('d3',0),X0+(11250+750)*PX,Y+HH+90,'남는 돈 1,500원',{f:'D',s:66,c:C.red,glow:'rgba(255,77,77,.4)'});
      if(L('d4')>=0){group(820,700,1,0,P(L('d4'),0,.3),()=>{panel(-560,-70,1120,140,{bd:C.red,bg:'rgba(6,13,32,1)'});text('손님이 아낀 2,250원 = 전부 서점 몫에서',0,4,{f:'D',s:44,c:'#fff',max:1060});});
        const q=K('d4',0);if(q>=0)stampBox('−60%',1580,700,q,{s:80,c:C.red,bg:'rgba(40,0,0,.92)'});}
      srcLine('15,000 × 0.85 − 11,250 = 1,500 · 1 − 1,500 ÷ 3,750 = 60% (python3) · 막대 길이는 금액 비례');});
    sub('d5','d5',()=>{
      text('한 달 500권 · 고정비 120만 원',960,170,{f:'D',s:52,c:C.gold});
      const X0=620,WW=1000;
      text('정가로 팔면',X0-30,340,{a:'right',f:'D',s:44,c:CP});hbar(X0,340,WW,96,187.5,200,CP,'187만 5,000',{s:46});
      const q=K('d5',0);text('할인하면',X0-30,500,{a:'right',f:'D',s:44,c:C.red});hbar(X0,500,WW,96,75*E.out(P(L('d5'),.3,.6)),200,C.red,'75만',{s:46});
      ctx.save();ctx.strokeStyle='#fff';ctx.setLineDash([10,8]);ctx.lineWidth=4;const xf=X0+WW*120/200;line(xf,270,xf,570);ctx.restore();text('고정비 120만',X0+WW*120/200,610,{f:'D',s:34,c:'#fff'});
      if(q>=0)stampBox('적자 −45만 원',1200,740,q,{s:60,c:C.red,bg:'rgba(40,0,0,.92)'});
      srcLine('500 × 1,500 = 75만 · 75 − 120 = −45만 (python3) · 예시 가정');});
    sub('d6','d7',()=>{
      text('할인하고 몇 권을 팔아야 할까',960,170,{f:'D',s:52,c:C.gold});
      const X0=560,WW=1100,MX=1400;
      text('지금',X0-30,320,{a:'right',f:'D',s:42});hbar(X0,320,WW,84,500,MX,CG,'500권',{s:46});
      const q1=K('d6',0),q2=K('d6',1);
      text('고정비만 내기',X0-30,460,{a:'right',f:'D',s:40,max:420});hbar(X0,460,WW,84,q1>=0?800*E.out(P(q1,0,.6)):0,MX,C.gold,q1>=0?'800권':'?',{s:46,lc:C.gold});
      text('원래 몫 지키기',X0-30,600,{a:'right',f:'D',s:40,max:420});hbar(X0,600,WW,84,q2>=0?1250*E.out(P(q2,0,.6)):0,MX,C.red,q2>=0?'1,250권':'?',{s:46,lc:q2>=0?C.red:C.gold});
      if(q2>=0)stampBox('2.5배',1650,450,q2-.5,{s:70,c:C.red,bg:'rgba(40,0,0,.92)'});
      if(L('d7')>=0)stampBox('들여오는 값이 비싸면 할인 = 적자',960,770,L('d7'),{s:46,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('120만 ÷ 1,500 = 800권 · 187만 5,000 ÷ 1,500 = 1,250권 (python3) · 예시 가정');});
  }},
  /* ── 할인 한도를 바꾸면 ── */
  rule:{draw(){
    sub('l1','l2',()=>{
      text('할인 한도 = 정가의 15% (도서정가제)',960,170,{f:'D',s:52,c:C.gold,max:1700});
      book26(480,470,1,{});
      if(L('l2')>=0){group(1300,380,1,0,P(L('l2'),0,.3),()=>{panel(-540,-140,1080,280,{bd:C.gold,bg:'rgba(6,13,32,1)'});text('2024년 1월 · 민생 토론회 (정부 발표)',0,-80,{f:'D',s:38,c:C.dim,max:1000});text('최대 15% → 영세서점에 한해',0,0,{f:'D',s:50,c:'#fff',max:1000});text('추가 할인 허용',0,72,{f:'D',s:56,c:C.gold});});
        if(T>FR('l2',.7))pill('보도 기준 · 시행 여부는 따로 확인',1300,640,{s:32,bg:'rgba(255,255,255,.94)'});}
      srcLine('주간경향 2024.2.23 (정부 개선안: 현재 최대 15%인 직·간접 할인율을 영세서점에 한해 추가 허용)');});
    sub('l3','l4',()=>{
      text('동네서점 한 권 몫 · 할인 폭에 따라',960,170,{f:'D',s:52,c:C.gold});
      const X0=640,WW=1000,MX=4200,q=K('l3',0);
      text('정가 그대로',X0-30,320,{a:'right',f:'D',s:42});hbar(X0,320,WW,90,3750,MX,CL,'3,750원',{s:48});
      text('15% (10 + 5)',X0-30,470,{a:'right',f:'D',s:42});hbar(X0,470,WW,90,1500,MX,'#ff9a9a','1,500원',{s:48});
      text('20%',X0-30,620,{a:'right',f:'D',s:42,c:C.red});hbar(X0,620,WW,90,q>=0?750*E.out(P(q,0,.6)):0,MX,C.red,q>=0?'750원':'?',{s:48,lc:q>=0?C.red:C.gold});
      if(L('l4')>=0)stampBox('더 깎을 자유 = 더 큰 적자',1300,780,L('l4'),{s:50,c:C.red,bg:'rgba(40,0,0,.92)'});
      srcLine('15,000 × 0.8 − 11,250 = 750 (python3) · 20%는 예시');});
    sub('l5','l6',()=>{
      const l6=L('l6');
      if(l6<0){
        group(560,450,1,0,P(L('l5'),0,.3),()=>{panel(-380,-200,760,400,{bd:CL,bg:'rgba(6,13,32,1)'});emoji('🇫🇷',0,-90,110);text('프랑스 · 2014년부터',0,30,{f:'D',s:42,c:C.dim});text('온라인서점 할인 금지',0,110,{f:'D',s:50,c:'#fff',max:700});});
        group(1360,450,1,0,P(L('l5'),1.5,.3),()=>{panel(-380,-200,760,400,{bd:CL,bg:'rgba(6,13,32,1)'});emoji('🇩🇪',0,-90,110);text('독일 · 책이 나온 뒤',0,30,{f:'D',s:42,c:C.dim});text('18개월 할인 없음',0,110,{f:'D',s:50,c:'#fff',max:700});});
      }else{
        text('모두 정가 1만 5,000원에 판다면 · 한 권 몫',960,170,{f:'D',s:50,c:C.gold,max:1700});
        const X0=640,WW=1000,MX=6000,q=K('l6',0);
        text('인터넷서점 (65%)',X0-30,340,{a:'right',f:'D',s:42,c:CO});hbar(X0,340,WW,96,q>=0?5250*E.out(P(q,0,.6)):0,MX,CO,q>=0?'5,250원':'?',{s:50,lc:q>=0?CO:C.gold});
        text('동네서점 (75%)',X0-30,500,{a:'right',f:'D',s:42,c:CL});hbar(X0,500,WW,96,3750,MX,CL,'3,750원',{s:50});
        if(T>FR('l6',.6))stampBox('값이 같아지면 → 경험으로 겨룬다',960,720,T-FR('l6',.6),{s:50,c:C.gold,bg:'rgba(40,30,0,.92)'});
      }
      srcLine('주간경향 2024.2.23 (프랑스 2014 반아마존법 · 독일 발행 후 18개월 할인 배제) · 15,000 × 0.35 = 5,250 (python3)');});
  }},
  /* ── 실제 숫자로 보면 ── */
  real:{draw(){
    sub('r1','r2b',()=>{
      text('2025년 책 판매 비중 (출판유통통합전산망)',960,170,{f:'D',s:50,c:C.gold,max:1700});
      const segs=[['온라인서점',64.5,CO],['대형서점',29.4,'#8794a8'],['지역서점',6.1,CL]];const X0=160,WW=1600,Y=320,k=E.out(P(L('r2'),.1,1.2));let acc=0;
      if(L('r2')>=0)segs.forEach(([t,v,col],i)=>{const x=X0+WW*acc/100*k,w=WW*v/100*k;acc+=v;ctx.fillStyle=col;rr(x+1,Y,Math.max(0,w-2),140,10);ctx.fill();
        if(k>.95&&v>20){text(t,x+w/2,Y+48,{f:'D',s:40,c:'#1d2433'});text(v+'%',x+w/2,Y+100,{f:'D',s:48,c:'#1d2433'});}});
      const q=K('r2',0);if(q>=0){ctx.save();ctx.strokeStyle=CL;ctx.lineWidth=4;line(X0+WW*.97,Y+150,X0+WW*.9,Y+230);ctx.restore();popText(KT('r2',0),X0+WW*.84,Y+290,'지역서점 6.1%',{f:'D',s:72,c:CL,glow:'rgba(111,211,255,.35)'});}
      if(L('r2b')>=0)pill('⚠ 전산망엔 일부 지역서점만 자료를 보낸다 → 실제보다 작게 잡혔을 수 있다',960,770,{s:30,bg:'rgba(255,255,255,.94)',alpha:P(L('r2b'),.2,.3)});
      srcLine('한국출판문화산업진흥원 \'출판유통통합전산망 판매 데이터 리포트 2025년 12월\' (PDF 원문) · 2025년 1억 573만 887부 · 약 1조 7,720억 원');});
    sub('r3','r3',lt=>{
      text('종이책을 주로 사는 곳 (1순위)',960,170,{f:'D',s:54,c:C.gold});
      const X0=600,WW=1000,q=K('r3',0);
      text('인터넷서점',X0-30,330,{a:'right',f:'D',s:44,c:CO});hbar(X0,330,WW,90,41.2*E.out(P(lt,.3,.6)),50,CO,'41.2%',{s:50});
      text('대형서점',X0-30,470,{a:'right',f:'D',s:44,c:'#a9b4c6'});hbar(X0,470,WW,90,28*E.out(P(lt,.6,.6)),50,'#8794a8','28.0%',{s:50,lc:'#a9b4c6'});
      text('동네서점',X0-30,610,{a:'right',f:'D',s:44,c:CL});hbar(X0,610,WW,90,q>=0?11.7*E.out(P(q,0,.6)):0,50,CL,q>=0?'11.7%':'?',{s:50,lc:q>=0?CL:C.gold});
      srcLine('지역서점 이용 실태조사 (출판진흥원, 2023.7~2024.6, 만 10세 이상 1,000명) — 아시아경제 2025.11.13 인용 · 나머지는 그 밖의 곳');});
    sub('r4','r5',()=>{
      text('한 해 매출로 본 지역서점 (2024 실태조사 · 2023년 기준)',960,170,{f:'D',s:46,c:C.gold,max:1800});
      const X0=160,WW=1600,Y=290,k=E.out(P(L('r4'),.2,1));
      ctx.fillStyle=C.red;rr(X0,Y,WW*.316*k,130,10);ctx.fill();ctx.fillStyle='#ff9a9a';rr(X0+WW*.316*k,Y,WW*.179*k,130,10);ctx.fill();ctx.fillStyle='rgba(255,255,255,.1)';rr(X0+WW*.495*k,Y,WW*(1-.495*k),130,10);ctx.fill();
      if(k>.95){text('5,000만 미만 31.6%',X0+WW*.158,Y+66,{f:'D',s:38,c:'#fff',max:480});text('~1억 17.9%',X0+WW*(.316+.0895),Y+66,{f:'D',s:32,c:'#1d2433',max:270});text('1억 원 이상',X0+WW*.75,Y+66,{f:'D',s:38,c:C.dim});}
      const q=K('r4',0);if(q>=0){ctx.save();ctx.strokeStyle='#fff';ctx.lineWidth=4;line(X0,Y+150,X0+WW*.495,Y+150);ctx.restore();popText(KT('r4',0),X0+WW*.25,Y+220,'1억 원 미만 49.5%',{f:'D',s:68,c:C.red});}
      if(L('r5')>=0){const it=[['홍보·마케팅','3.48'],['임차료','3.46'],['재고·반품 관리','3.20']];it.forEach(([t,v],i)=>{const kk=E.back(P(L('r5'),.2+i*.3,.35));if(kk<=0)return;group(400+i*560,700,kk,0,1,()=>{panel(-250,-80,500,160,{bd:i===2?C.gold:'rgba(255,255,255,.4)',bg:'rgba(6,13,32,1)'});text(t,0,-26,{f:'D',s:40,c:'#fff',max:460});text(v+' / 5점',0,42,{f:'D',s:40,c:C.gold});});});
        text('사장님들이 꼽은 어려움 (5점 만점)',960,590,{s:30,w:900,c:C.dim,alpha:P(L('r5'),0,.3)});}
      srcLine('2024 지역서점 실태조사 (출판진흥원) — 아시아경제 2025.11.13 · 뉴시스 2025.8.17 인용 · 31.6 + 17.9 = 49.5 (python3)');});
    sub('r6','r6',lt=>{
      group(560,400,1,0,P(lt,0,.3),()=>{panel(-420,-170,840,340,{bd:'rgba(255,255,255,.4)',bg:'rgba(6,13,32,1)'});text('“한 달에 100권',0,-60,{f:'D',s:60,c:'#fff'});text('팔기도 힘들다”',0,30,{f:'D',s:60,c:'#fff'});text('— 한 독립서점 운영자 (뉴시스)',0,120,{s:28,w:800,c:C.dim});});
      text('새로 문을 연 독립서점',1380,190,{f:'D',s:44,c:C.gold});
      const X=[1200,1560],BASE=700,q=K('r6',0);
      [[135,'2019년',CG,1],[42,'2024년',C.red,q>=0?E.out(P(q,0,.6)):0]].forEach(([v,y,col,k],i)=>{const h=340*v/135*k;ctx.fillStyle=col;rr(X[i]-90,BASE-h,180,h,12);ctx.fill();text(y,X[i],BASE+44,{f:'D',s:40});if(k>0)text(v+'곳',X[i],BASE-h-40,{f:'D',s:56,c:col});else if(i===1)text('?',X[i],BASE-60,{f:'D',s:56,c:C.gold});});
      srcLine('뉴시스 2025.8.17 (독립서점 서비스 기업 \'트렌드 2024\' 인용: 신규 독립서점 2019년 135곳 → 2024년 42곳)');});
  }},
  /* ── 숫자를 바꾸는 손잡이 ── */
  knob:{draw(){
    sub('k1','k3',()=>{
      text('손잡이 ① 공급률 · 사장님 몫 (500권, 고정비 120만)',960,170,{f:'D',s:46,c:C.gold,max:1800});
      const X0=600,WW=1000,MX=160,k2=L('k2'),q=K('k2',0);
      text('75% (지금)',X0-30,330,{a:'right',f:'D',s:42});hbar(X0,330,WW,84,67.5,MX,CG,'67만 5,000',{s:44});
      text('70%',X0-30,470,{a:'right',f:'D',s:42,alpha:k2>=0?1:.3});hbar(X0,470,WW,84,q>=0?105*E.out(P(q,0,.6)):0,MX,CP,q>=0?'105만':'',{s:44});
      const t65=FR('k2',.75);text('65%',X0-30,610,{a:'right',f:'D',s:42,alpha:T>t65?1:.3});hbar(X0,610,WW,84,T>t65?142.5*E.out(P(T,t65,.6)):0,MX,CP,T>t65?'142만 5,000':'',{s:44});
      if(L('k3')>=0)pill('공급률 1%p = 한 달 7만 5,000원 · 정하는 건 출판사·도매상 (작은 서점은 협상 어렵다 — 보도)',960,780,{s:28,bg:'rgba(255,255,255,.94)',alpha:P(L('k3'),.2,.3)});
      srcLine('500 × 15,000 × (1 − 공급률) − 120만 (python3) · 협상 어려움: 주간경향 2025.11.24');});
    sub('k4','k6',()=>{
      text('손잡이 ② 권수 · ③ 할인',960,170,{f:'D',s:52,c:C.gold});
      const X0=600,WW=900,MX=120;
      const rows=[['500권 (지금)',67.5,CG,'67만 5,000',null],['600권',105,CP,'105만',['k4',FR('k4',.35)]],['400권',30,C.red,'30만',['k4',KT('k4',0)]],['10% 할인',-7.5,C.red,'−7만 5,000 (적자)',['k5',KT('k5',0)]]];
      rows.forEach(([t,v,col,lb,on],i)=>{const y=300+i*120;const vis=!on||(L(on[0])>=0&&T>=on[1]);text(t,X0-30,y,{a:'right',f:'D',s:40,c:vis?(i?col:'#fff'):'rgba(255,255,255,.3)'});
        hbar(X0,y,WW,76,vis?Math.max(0,v)*E.out(P(T,on?on[1]:0,.6)):0,MX,col,vis?lb:'',{s:42});});
      if(L('k6')>=0)stampBox('혼자 돌릴 수 있는 손잡이 = 권수',960,800,L('k6'),{s:46,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('100권 × 3,750 = 37만 5,000 · 500 × 2,250 − 120만 = −7만 5,000 (python3) · 예시 가정');});
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('q1'),ov=L('q7');
    text('서점 차리기 전, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3),max:1800});
    const cards=[['q2','내 공급률','정가에서 얼마에 들여오나','오늘: 75%'],['q3','한 권의 몫','정가 × (1 − 공급률)','오늘: 3,750원'],['q4','본전 권수','고정비 ÷ 한 권 몫','오늘: 320권'],
      ['q5','할인했을 때의 몫','할인은 몫에서 빠진다','오늘: 3,750 → 1,500'],['q6','책 말고 손님 부를 것','모임 · 강연 · 음료','권수 손잡이']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:34,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-780,-290,1560,560,{bg:'rgba(6,13,32,1)',bd:C.gold});text('정가 2만 원 · 공급률 70% · 한 달 300권 · 고정비 100만 원',0,-210,{f:'D',s:40,max:1460});text('지금 사장님 몫 80만 원 → 10% 깎아 주면?',0,-145,{f:'D',s:40,max:1460,c:C.gold});
      const b=L('q7b');
      if(b>=0)text('한 권 몫 6,000 → 4,000원 · 4,000 × 300 − 100만 = ?',0,-45,{f:'D',s:40,alpha:P(b,0,.3),max:1460});
      const k=K('q7b',0);if(k>=0)text('20만 원',0,90,{f:'D',s:130,c:CP,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});else text('?',0,90,{f:'D',s:120,c:C.gold});
      if(L('q7c')>=0)text('10% 할인 → 사장님 몫 80만 → 20만 (4분의 1)',0,215,{s:36,w:900,c:'#ffb3b3',alpha:P(L('q7c'),0,.3),max:1460});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('동네서점 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      bookShop26(430,520,.75,{alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['동네서점 (75%)','11,250에 들여와 → 3,750',CL,b,.3],['인터넷서점 (65%)','9,750에 들여와 → 2,250 싸게, 3,000',CO,b,3],['할인을 따라가면','1,500원 · 같은 돈에 2.5배',C.red,b2,.3]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;group(1300,320+i*160,1,0,kk,()=>{panel(-540,-65,1080,130,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-500,4,{a:'left',f:'D',s:34,max:330});text(v,500,4,{a:'right',f:'D',s:34,c:col,max:660});});});
    }else{
      bookShop26(480,480,.7);book26(1060,520,.8,{rot:-.05});drawMascot(1640,540,.55,'happy');
      stampBox('서점 몫 = 손님이 내는 값이 아니라 들여오는 값',960,790,c,{s:44,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      if(L('z4')>=0&&L('z4b')<0)pill('예시 가정 · 창업 권유 아님',1560,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-520,-70,1040,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 동네서점에서 마지막으로 책 산 날은?',0,4,{s:40,w:900,c:C.ink,max:980});});
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
function vCashH(x,y,w,h,col){if(w<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
