/* ════════════════════════════════════════════════════════════════════
   장면 (LF.22 월세 300만 원 빈 상가 계산서 — 월세 = 건물값 · 50만 원 깎으면 1억 5,000만 원 · 반년 비워 두는 값 · 석 달 공짜의 비밀) — 수치·출처는 docs/longform-ep22.md
   중심 그림: 월세 만 원짜리 한 장 = 건물값 벽돌 한 칸(300만 원). 월세 300만 원 = 벽돌 300칸 = 9억 원(수익률 4%, 예시).
   반전: 50만 원 깎으면 벽돌 50칸(1억 5,000만) — 반년 공실 2,040만의 일곱 배. 석 달 공짜(900만)는 계약서 월세 300만을 지켜 벽돌이 그대로.
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['5','0','0','0','0','0','×','1','2','÷','0','.','0','4','='];   // 500,000 × 12 ÷ 0.04 = 150,000,000 (0 개수: 500000 은 다섯)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}
function bubble(x,y,w,h,str,o={}){group(x,y,o.k??1,o.rot||0,o.alpha??1,()=>{ctx.fillStyle='#fff';rr(-w/2,-h/2,w,h,30);ctx.fill();if(o.tail!==false){ctx.beginPath();ctx.moveTo(-w*.2,h/2);ctx.lineTo(-w*.26,h/2+50);ctx.lineTo(-w*.1,h/2);ctx.fill();}if(str)text(str,0,4,{f:'D',s:o.s||60,c:o.c||C.ink,max:w-60});});}
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:32,w:900,c:'#3a4256',max:260});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433'});});
});}

/* 1층 가게 한 칸 (상표 없음). vacant = 불 꺼진 유리 + '임대' 종이 · lit = 장사 중 */
function shopUnit(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='#3b4258';rr(-300,-200,600,400,10);ctx.fill();
  ctx.fillStyle=o.vacant?'#5b6275':'#f3e6c8';rr(-300,-200,600,80,8);ctx.fill();
  if(!o.vacant)text(o.name||'',0,-158,{f:'D',s:48,c:'#7a2b1f',max:540});
  if(o.vacant){ctx.fillStyle='#1e2433';rr(-270,-100,540,280,6);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=6;line(-230,160,-100,-80);line(-150,170,0,-70);
    ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(-2,-100,4,280);
    group(-120,30,1,-.05,1,()=>{ctx.fillStyle='#fff';rr(-95,-70,190,140,6);ctx.fill();text('임대',0,-14,{f:'D',s:58,c:'#d62f2f'});text('010-○○○○',0,40,{s:22,w:900,c:'#3a4256'});});}
  else{ctx.save();ctx.shadowColor='rgba(255,224,140,.6)';ctx.shadowBlur=30;ctx.fillStyle='#ffe9b8';rr(-270,-100,540,280,6);ctx.fill();ctx.restore();
    for(let j=0;j<3;j++){ctx.fillStyle='#8a5a3c';rr(-230+j*160,110,110,14,6);ctx.fill();}ctx.fillStyle='rgba(74,59,47,.4)';ctx.fillRect(-2,-100,4,280);}
  if(o.tag)group(170,-40,1,.06,1,()=>{ctx.fillStyle='#ffd23f';rr(-120,-46,240,92,14);ctx.fill();text(o.tag,0,3,{f:'D',s:40,c:'#1d2433',max:220});});
});}
/* 3층 건물 (1층 = shopUnit) */
function bldg(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,410,380,26,0,0,7);ctx.fill();
  ctx.fillStyle='#8a93a8';rr(-330,-400,660,810,14);ctx.fill();ctx.fillStyle='#727b91';ctx.fillRect(-330,-400,660,30);
  for(let f=0;f<2;f++)for(let i=0;i<3;i++){const wx=-260+i*190,wy=-340+f*190;ctx.fillStyle=(o.litUp??true)&&((i+f)%2===0)?'#ffe9b8':'#2b3348';rr(wx,wy,140,130,6);ctx.fill();ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(wx+68,wy,4,130);}
  shopUnit(0,200,1,{vacant:o.vacant,name:o.name,tag:o.tag});
  if(o.value)group(0,-460,1,0,1,()=>{ctx.fillStyle='#1f2b1c';rr(-210,-52,420,104,18);ctx.fill();ctx.strokeStyle=C.gold;ctx.lineWidth=5;rr(-210,-52,420,104,18);ctx.stroke();text(o.value,0,4,{f:'D',s:56,c:C.gold,max:390});});
});}
/* 만 원짜리 지폐 (그림, 실제 도안 아님) */
function manBill(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='#7fbf8a';rr(-160,-80,320,160,12);ctx.fill();ctx.strokeStyle='#3f7d4c';ctx.lineWidth=6;rr(-146,-66,292,132,8);ctx.stroke();
  ctx.fillStyle='rgba(63,125,76,.35)';ctx.beginPath();ctx.arc(80,0,46,0,7);ctx.fill();
  text('10,000',-40,-10,{f:'D',s:52,c:'#1f4a2a'});text('월세 1만 원',-40,42,{s:24,w:900,c:'#1f4a2a'});
});}
/* 건물값 벽돌판: 300칸 = 9억 (한 칸 300만 원). fn(i) → {col, al, dy} */
function brickWall(x0,y0,cell,fn,cols=20,n=300){for(let i=0;i<n;i++){const st=fn(i);if(!st||st.al<=0)continue;const cx=x0+(i%cols)*cell,cy=y0+Math.floor(i/cols)*cell*.62+(st.dy||0);ctx.save();ctx.globalAlpha*=st.al;ctx.fillStyle=st.col;rr(cx+2,cy+2,cell-4,cell*.62-4,4);ctx.fill();ctx.restore();}}
const BR='#c97b4a', BRX='#FF4D4D';
/* 계약서 한 장 */
function contract(x,y,s,rent,o={}){group(x,y,s,o.rot??-.03,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';rr(-222,-292,460,600,10);ctx.fill();ctx.fillStyle='#fbfaf4';rr(-230,-300,460,600,10);ctx.fill();
  text('상가 임대차 계약서',0,-240,{f:'D',s:40,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.15)';ctx.lineWidth=3;for(let i=0;i<4;i++)line(-190,-170+i*44,190,-170+i*44);
  text('월 차임',-190,40,{a:'left',s:30,w:900,c:'#59627c'});text(rent,190,40,{a:'right',f:'D',s:60,c:o.rc||'#1d2433',max:250});
  if(o.note)text(o.note,0,130,{s:28,w:900,c:'#1f8a50',max:420});
  ctx.strokeStyle='#d62f2f';ctx.lineWidth=5;ctx.beginPath();ctx.arc(140,220,44,0,7);ctx.stroke();text('인',140,224,{f:'D',s:40,c:'#d62f2f'});
});}
/* 계산기 화면 글자 꾸미기: 숫자 묶음마다 쉼표 */
function arrowR(x1,y,x2,col='#fff',lw=8){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=lw;ctx.lineCap='round';line(x1,y,x2-lw*2,y);ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-lw*4,y-lw*2.6);ctx.lineTo(x2-lw*4,y+lw*2.6);ctx.closePath();ctx.fill();ctx.restore();}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o2')){
      const a=L('o1');
      bldg(520,500,.78*E.back(P(a,0,.5))+.001,{vacant:1});
      text('1층 월세',1360,300,{f:'D',s:52,c:C.dim,alpha:P(a,.2,.3)});
      big('o1',0,1360,420,'300만 원',{f:'D',s:130,c:C.gold,glow:'rgba(255,197,49,.45)'});
      if(T>FR('o1',.45)){pill('반년째 빈 자리',1360,600,{s:44,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('o1',.45),.3)});text('월세 인하 0원',1360,720,{f:'D',s:60,c:'#ffb3b3',alpha:P(T,FR('o1',.65),.3)});}
      srcLine('예시 가정 · 동네 1층 상가 · 보증금·세금 제외');
    }else if(T<CT('o3')){
      const b=L('o2');
      bldg(520,500,.78,{vacant:1});
      bubble(1360,330,820,180,'"250만 원이면 바로 계약할게요"',{s:50,k:E.back(P(b,0,.4))+.001});
      text('깎아 달라는 돈',1360,560,{f:'D',s:46,c:C.dim,alpha:P(b,.3,.3)});
      big('o2',0,1360,680,'한 달 50만 원',{f:'D',s:100,c:'#ff9a9a'});
      srcLine('예시 가정 · 예비 사장님 말은 예시 대사');
    }else if(T<CT('o4')){
      const b=L('o3'),c3=L('o3b');
      if(c3<0){text('반년 비워 둔 손해 (예시)',960,200,{f:'D',s:56,c:C.gold,alpha:P(b,0,.3)});
        receipt(960,520,.95,[['못 받은 월세 6개월','1,800만','#d62f2f'],['관리비·재산세 등','240만','#d62f2f'],['합계','2,040만','#d62f2f']],{title:'공실 6개월',alpha:P(b,.2,.3)});}
      else{[['건물주','#FFC531'],['세입자','#6FD3FF']].forEach(([n,col],i)=>{const k=E.back(P(c3,.1+i*.3,.4));if(k<=0)return;group(560+i*800,470,k,0,1,()=>{calcLogo(0,-40,1.1);text(n+'의 계산기',0,240,{f:'D',s:60,c:col});});});}
    }else if(T<CT('o5')){
      const b=L('o4');
      text('건물주의 계산기로 보면',960,170,{f:'D',s:54,c:C.gold,alpha:P(b,0,.3)});
      group(520,480,1,0,P(b,.1,.3),()=>{panel(-340,-200,680,400,{bd:'#ff9a9a'});text('깎아 주는 월세',0,-110,{f:'D',s:48,c:C.dim});text('한 달 50만 원',0,20,{f:'D',s:80,c:'#ff9a9a'});});
      arrowR(900,480,1020,'#fff',10);
      group(1400,480,1,0,P(b,.2,.3),()=>{panel(-340,-200,680,400,{bd:C.red});text('사라지는 건물값',0,-110,{f:'D',s:48,c:C.dim});});
      big('o4',0,1400,500,'1억 5,000만 원',{f:'D',s:82,c:C.red,glow:'rgba(255,77,77,.4)'});
      srcLine('예시 가정 · 수익률 4%로 건물값을 매긴다고 할 때');
    }else{
      const k9=L('o5'),k10=L('o6');
      text('상가 계약 전 꼭 볼 숫자',960,230,{f:'D',s:68,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['공실률·임대료 (부동산원 보도)','건물값 매기는 법 (보도 예시)','월세·수익률 = 예시'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,380+i*580,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o7');
    text('월세 300만 원 빈 상가 계산서',960,220,{f:'D',s:104,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('월세 = 건물값 · 깎느니 비워 둔다 · 석 달 공짜의 비밀',960,350,{s:48,w:900,alpha:P(a,.3,.3),max:1780});
    bldg(560,700,.42,{vacant:1,tag:'월세 300만',alpha:P(a,.2,.3)});manBill(1120,680,.9,{rot:-.08,alpha:P(a,.3,.3)});drawMascot(1600,690,.72,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 상가 ── */
  setup:{draw(){
    sub('p1','p2',()=>{bldg(560,500,.8,{vacant:1});
      if(L('p2')>=0){text('동네 큰길가 1층',1420,250,{f:'D',s:50,c:C.dim});const q=K('p2',0);text('월세',1420,380,{f:'D',s:52,c:C.gold});text(q>=0?'300만 원':'?',1420,500,{f:'D',s:120,c:C.gold});
        if(T>FR('p2',.6))pill('보증금·세금은 빼고 계산',1420,680,{s:36,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p2',.6),.3)});}
      srcLine('예시 가정 · 월세 300만 원 · 보증금·부가세·소득세 제외');});
    sub('p3','p3',lt=>{bldg(480,500,.72,{vacant:1});
      [1,2,3,4,5,6].forEach(m=>{const k=P(lt,.1+m*.08,.2);ctx.save();ctx.globalAlpha*=k;ctx.fillStyle='#2b3348';rr(860+(m-1)*170,200,150,130,14);ctx.fill();ctx.restore();text(m+'월째',860+(m-1)*170+75,240,{s:28,w:900,c:C.dim,alpha:k});text('빈 자리',860+(m-1)*170+75,295,{s:30,w:900,c:'#ffb3b3',alpha:k});});
      drawMascot(1060,620,.5,'happy',{alpha:P(lt,.4,.3)});
      bubble(1520,520,640,150,'"250만 원이면 계약할게요"',{s:44,alpha:P(lt,.5,.3)});
      const q=K('p3',0);text('예비 사장님이 말한 월세',1520,690,{f:'D',s:40,c:C.dim});text(q>=0?'250만 원':'?',1520,780,{f:'D',s:80,c:'#6FD3FF'});
      srcLine('예시 가정 · 반년 공실 · 제안 월세 250만 원');});
    sub('p4','p4',()=>{bldg(480,500,.72,{vacant:1});
      receipt(1340,470,.95,[['관리비','?'],['재산세 (나눠서)','?'],['화재보험료 등','?'],['= 한 달',K('p4',0)>=0?'40만 원':'?','#d62f2f']],{title:'비어 있어도 나가는 돈'});
      srcLine('예시 가정 · 한 달 40만 원 · 항목은 디지털데일리 2026.7.18 (관리비·재산세·대출 이자·화재보험료)');});
    sub('p5','p6',()=>{text('건물주라면?',960,170,{f:'D',s:60,c:C.gold});
      [['A','50만 원 깎고 오늘 채우기','월세 250만','#ff9a9a'],['B','더 기다리기','월세 300만 · 언제?','#6FD3FF']].forEach(([n,t1,t2,col],i)=>{group(560+i*800,470,1,0,1,()=>{panel(-350,-220,700,440,{bd:col});text(n,0,-140,{f:'D',s:80,c:col});text(t1,0,0,{f:'D',s:48,max:640});text(t2,0,90,{s:36,w:900,c:C.dim});});});
      if(L('p6')>=0)stampBox('먼저 볼 것: 건물값 매기는 법',960,790,L('p6'),{s:44,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 월세 1만 원 = 건물값 300만 원 ── */
  cut:{draw(){
    sub('s1','s3',()=>{bldg(400,520,.66,{vacant:0,name:'(세입자 가게)',value:K('s2',1)>=0?'건물값 9억':null});
      text('건물값 = 1년 월세 ÷ 수익률',1220,220,{f:'D',s:62,c:C.gold});
      if(L('s2')>=0){const q0=K('s2',0);text('1년 월세',900,380,{a:'left',f:'D',s:44,c:C.dim});text('300만 × 12 = 3,600만',1780,380,{a:'right',f:'D',s:52});
        text('수익률 (예시)',900,480,{a:'left',f:'D',s:44,c:C.dim});text(q0>=0?'4% = 0.04':'?',1780,480,{a:'right',f:'D',s:52,c:q0>=0?'#fff':C.gold});
        ctx.save();ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(900,540,1780,540);ctx.restore();
        text('3,600만 ÷ 0.04',900,610,{a:'left',f:'D',s:44,c:C.dim});big('s2',1,1600,610,'9억 원',{f:'D',s:86,c:C.gold,glow:'rgba(255,197,49,.4)'});}
      if(L('s3')>=0)pill('1년에 100원 버는 건물 = 2,500원 (100 ÷ 0.04)',1340,760,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('s3'),.1,.3)});
      srcLine('예시 가정 · 수익률 4% · 실제 건물값은 감정평가·거래 사례로 정해진다');});
    sub('s4','s5',()=>{manBill(460,460,1.25,{rot:-.05});
      text('월세 만 원 한 장 =',960,200,{f:'D',s:56,c:C.gold});
      arrowR(760,460,1060,'#fff',10);
      const q=K('s5',0);
      if(q<0)text('?',1420,460,{f:'D',s:130,c:C.gold});
      else{group(1420,460,lerp(1.6,1,E.out(P(q,0,.35))),0,P(q,0,.15),()=>{ctx.fillStyle=BR;rr(-280,-110,560,220,16);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=5;line(-280,0,280,0);line(0,-110,0,0);line(-140,0,-140,110);line(140,0,140,110);text('건물값 300만 원',0,4,{f:'D',s:62,c:'#fff',st:8});});
        stampBox('만 원 × 12 ÷ 0.04 = 300만 원',1180,740,q-.4,{s:46,c:C.gold,bg:'rgba(40,30,0,.9)'});}
      srcLine('10,000원 × 12달 ÷ 0.04 = 3,000,000원 (예시 수익률 4%)');});
    sub('s6','s6',lt=>{text('월세 300만 원 = 만 원 300장 = 벽돌 300칸',960,170,{f:'D',s:52,c:C.gold});
      brickWall(560,230,40,i=>({col:BR,al:P(lt,.1+i*.004,.15)}));
      text('= 9억 원',1480,560,{f:'D',s:96,c:C.gold,alpha:P(lt,1.3,.3)});
      text('한 칸 = 300만 원',360,560,{f:'D',s:44,c:'#e3a77d',alpha:P(lt,.6,.3)});
      if(T>FR('s6',.4))pill('한 보도의 예시: 수익환원율 4% · 월세 300만 원 → 자산가치 9억 원',960,760,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('s6',.4),.3)});
      srcLine('국민일보 2025.12.4 「상가는 계속 비어가는데… 임대료 못 내리는 속사정」의 계산 예시');});
  }},
  calc:{draw(){
    if(T<CT('c1')){const a=L('c0');
      text('월세 50만 원을 깎으면?',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      brickWall(560,240,40,i=>({col:i>=250?'#e8b08a':BR,al:1}));
      if(T>FR('c0',.4)){text('연한 칸 = 마지막 50칸?',960,700,{f:'D',s:70,c:C.red,alpha:P(T,FR('c0',.4),.3)});}
      srcLine('벽돌 한 칸 = 건물값 300만 원 (예시 수익률 4%)');return;}
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='500,000 × 12 ÷ 0.04 =';bigS='150,000,000';}
    else if(typed){const parts=typed.split(/[×÷]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(520,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(520,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:done?66:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('월세 50만 × 12달 ÷ 수익률 0.04',1340,190,{f:'D',s:48,c:C.gold,alpha:P(a,.2,.3),max:980});
    const q0=K('c2',0);
    brickWall(940,260,40,i=>{if(i<250)return{col:BR,al:1};if(q0<0)return{col:'#e8b08a',al:1};const k=E.io(P(q0,(i-250)*.012,.5));return{col:BRX,al:1-k,dy:k*70};});
    if(dt>=0&&L('c2')<0)group(1340,560,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(q0>=0)popText(KT('c2',0),1340,700,'벽돌 50칸 = −1억 5,000만 원',{f:'D',s:56,c:C.red});
    const q1=K('c2',1);if(q1>=0&&L('c3')<0)popText(KT('c2',1),1340,790,'9억 → 7억 5,000만 원',{f:'D',s:56,c:'#fff'});
    if(L('c3')>=0)stampBox('월세 −50만 = 건물값 −1억 5,000만',1340,790,L('c3'),{s:44,c:C.gold,bg:'rgba(40,30,0,.92)'});
  }},
  /* ── 반년 비워 두는 값 (어두운 장) ── */
  vacant:{draw(){
    sub('v1','v1',lt=>{bldg(560,500,.78,{vacant:1,litUp:false});text('비워 두면 얼마나 잃나',1380,480,{f:'D',s:66,c:'#ffb3b3',alpha:P(lt,.1,.3),max:900});});
    sub('v2','v3',()=>{text('공실 6개월 (예시)',960,170,{f:'D',s:56,c:C.gold});
      const SC=1100/2100,X0=520;
      text('못 받은 월세',X0-30,320,{a:'right',f:'D',s:44});const q=K('v2',0);if(q<0)text('?',X0+60,320,{f:'D',s:56,c:C.gold});else hbar(X0,320,1100,90,1800*E.out(P(q,0,.6)),2100,'#ff6b6b','1,800만',{s:50});
      text('관리비·세금',X0-30,460,{a:'right',f:'D',s:44});const r=K('v2',1);if(r<0)text('?',X0+60,460,{f:'D',s:56,c:C.gold});else hbar(X0,460,1100,90,240*E.out(P(r,0,.6)),2100,'#ff9a9a','240만',{s:50});
      text('합계',X0-30,620,{a:'right',f:'D',s:50,c:C.gold});const z=K('v3',0);if(z<0)text('?',X0+60,620,{f:'D',s:60,c:C.gold});else hbar(X0,620,1100,110,2040*E.out(P(z,0,.6)),2100,C.red,'2,040만',{s:58});
      srcLine('예시 가정 · 300만 × 6 = 1,800만 · 40만 × 6 = 240만');});
    sub('v4','v5b',()=>{text('같은 저울에 올리면 (예시)',960,165,{f:'D',s:52,c:C.gold});
      const Y0=760,SC=400/15000;
      [['반년 비워 두기',2040,'2,040만','#ff9a9a',620],['50만 원 깎기 (건물값)',15000,'1억 5,000만',C.red,1300]].forEach(([l,v,lab,col,x])=>{const h=v*SC;ctx.fillStyle=col;rr(x-130,Y0-h,260,h,14);ctx.fill();text(lab,x,Y0-h-46,{f:'D',s:54,c:col});text(l,x,Y0+40,{f:'D',s:40,max:520});});
      const q=K('v4',0);if(q>=0)stampBox('일곱 배 넘게',880,520,q,{s:64,c:C.red,bg:'rgba(40,0,0,.92)'});
      if(L('v5b')>=0)pill('월세 10% 인하 = 1년에 한 달 치 조금 넘게',640,300,{s:32,bg:'rgba(255,255,255,.92)',alpha:P(L('v5b'),.1,.3)});
      srcLine('1억 5,000만 ÷ 2,040만 = 7.35배 (python3) · 건물값 손실은 팔 때 드러나는 숫자 · 10% 인하 계산은 디지털데일리 2026.7.18');});
    sub('v6','v8',()=>{text('비워 둔 달 수만큼 쌓이는 손해 (예시, 한 달 340만)',960,165,{f:'D',s:44,c:C.gold,max:1800});
      const X0=260,X1=1760,M=48,Y0=780,SC=560/16000,xm=m=>X0+m/M*(X1-X0),yv=v=>Y0-v*SC;
      ctx.save();ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(X0,Y0,X1,Y0);ctx.restore();
      [0,12,24,36,48].forEach(m=>text(m+'개월',xm(m),Y0+30,{s:24,w:800,c:C.dim}));
      const upto=L('v7b')>=0?48*E.io(P(T,KT('v7b',0)-.8,1.6)):12*E.out(P(T,CT('v6')+.3,1.4));
      ctx.save();ctx.strokeStyle='#ff9a9a';ctx.lineWidth=7;line(xm(0),yv(0),xm(Math.max(.01,upto)),yv(340*upto));ctx.restore();
      const q=K('v6',0);if(q>=0){ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.setLineDash([12,8]);line(X0,yv(3000),X1,yv(3000));ctx.restore();text('5년 동안 깎아 준 월세 3,000만',X1,yv(3000)-28,{a:'right',f:'D',s:36,c:C.gold});}
      const r=K('v7',0);if(r>=0){ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(xm(8.82),yv(3000),14,0,7);ctx.fill();popText(KT('v7',0),xm(8.82)+40,yv(3000)+60,'약 9개월',{f:'D',s:44,c:C.gold});}
      if(L('v7b')>=0){ctx.save();ctx.strokeStyle=C.red;ctx.lineWidth=4;ctx.setLineDash([12,8]);line(X0,yv(15000),X1,yv(15000));ctx.restore();text('깎으면 사라지는 건물값 1억 5,000만',X0+10,yv(15000)-28,{a:'left',f:'D',s:36,c:C.red});
        const z=K('v7b',0);if(z>=0&&upto>44){ctx.fillStyle=C.red;ctx.beginPath();ctx.arc(xm(44.1),yv(15000),14,0,7);ctx.fill();popText(KT('v7b',0)+1.2,xm(44.1),yv(15000)-50,'44개월',{f:'D',s:44,c:C.red});}}
      if(L('v8')>=0)stampBox('반년 공실 = 계산이 선 선택',600,420,L('v8'),{s:48,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('50만 × 60달 = 3,000만 ÷ 340만 = 8.8달 · 1억 5,000만 ÷ 340만 = 44.1달 (python3)');});
  }},
  /* ── 석 달 공짜의 비밀 ── */
  rentfree:{draw(){
    const cal=(x0,y0,lt)=>{for(let m=0;m<12;m++){const x=x0+(m%6)*190,y=y0+Math.floor(m/6)*170,free=m<3,k=P(lt,.1+m*.05,.2);ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=free?'#1f8a50':'#2b3348';rr(x,y,170,150,14);ctx.fill();ctx.restore();
      text((m+1)+'월',x+85,y+40,{s:28,w:900,c:C.dim,alpha:k});text(free?'0원':'300만',x+85,y+100,{f:'D',s:free?50:44,c:free?'#b6f5d3':'#fff',alpha:k});}};
    sub('f1','f2',lt=>{text('첫해 12달 (예시)',960,170,{f:'D',s:54,c:C.gold});cal(390,230,lt);
      if(L('f2')>=0){pill('렌트프리 = 처음 몇 달 월세 면제',960,640,{s:38,bg:'rgba(53,224,138,.95)',alpha:P(L('f2'),0,.3)});
        if(T>FR('f2',.35))text('"명목상 상가 가치를 지키기 위해 일정 기간 임대료를 면제해주는 상가들도 적지 않게"',960,750,{s:32,w:900,c:'#c9ced9',alpha:P(T,FR('f2',.35),.3),max:1800});}
      srcLine('비즈한국 2019.6.7 「강남 상가 건물주, 임대료 인하보다 '+"'면제'"+' 택하는 이유」');});
    sub('f3','f4',()=>{cal(140,230,9);
      const q=K('f3',0);text('건물주가 덜 받는 돈',1600,260,{f:'D',s:42,c:C.dim});text(q>=0?'900만 원':'?',1600,360,{f:'D',s:86,c:q>=0?'#ff9a9a':C.gold});text('(한 번뿐)',1600,440,{s:34,w:900,c:C.dim});
      if(L('f4')>=0){contract(1600,690,.55,K('f4',0)>=0?'300만 원':'?',{rot:.03});}
      if(L('f4')>=0&&T>FR('f4',.55))stampBox('건물값 9억 그대로',840,690,T-FR('f4',.55),{s:56,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('예시 가정 · 300만 × 3달 = 900만 · 계약서 월세 300만 × 12 ÷ 0.04 = 9억');});
    sub('f5','f5b',()=>{text('세입자가 첫해 실제로 낸 월세',960,170,{f:'D',s:52,c:C.gold});
      const X0=560,MX=320;
      text('계약서 월세',X0-30,320,{a:'right',f:'D',s:42});hbar(X0,320,1000,80,300,MX,'#8a93a8','300만',{s:46});
      text('50만 깎았다면',X0-30,450,{a:'right',f:'D',s:42});hbar(X0,450,1000,80,250,MX,'#6FD3FF','250만',{s:46});
      text('석 달 공짜 (평균)',X0-30,580,{a:'right',f:'D',s:42,c:C.green});const q=K('f5',0);if(q<0)text('?',X0+60,580,{f:'D',s:56,c:C.gold});else hbar(X0,580,1000,90,225*E.out(P(q,0,.6)),MX,C.green,'225만',{s:54});
      if(L('f5b')>=0)pill('개업 첫 석 달 = 인테리어·재료로 돈이 가장 많이 나갈 때',960,740,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('f5b'),.1,.3)});
      srcLine('300만 × 9달 = 2,700만 ÷ 12 = 225만 (예시)');});
    sub('f6','f6',lt=>{bldg(480,520,.62,{vacant:0,name:'새 가게',value:'건물값 9억'});
      group(1300,480,1,0,P(lt,.1,.3),()=>{panel(-480,-230,960,460,{bd:C.gold});text('건물주의 계산',0,-150,{f:'D',s:50,c:C.gold});text('석 달 공짜 900만 원으로',0,-30,{f:'D',s:56});text('1억 5,000만 원을 지켰다',0,80,{f:'D',s:62,c:C.green});});});
  }},
  /* ── 세입자 쪽 계산서 ── */
  tenant:{draw(){
    sub('t1','t1',lt=>{shopUnit(620,500,1,{name:'새 가게'});drawMascot(1380,520,.85,'think',{alpha:P(lt,.1,.3)});});
    sub('t2','t3',()=>{text('세입자가 5년 동안 내는 월세 (인상 없이, 예시)',960,170,{f:'D',s:46,c:C.gold,max:1800});
      const X0=560,MX=18000;
      text('석 달 공짜 + 300만',X0-30,340,{a:'right',f:'D',s:40});const q=K('t2',0);if(q<0)text('?',X0+60,340,{f:'D',s:56,c:C.gold});else hbar(X0,340,1000,90,17100*E.out(P(q,0,.6)),MX,'#ff9a9a','1억 7,100만',{s:48});
      if(L('t3')>=0){text('처음부터 250만',X0-30,490,{a:'right',f:'D',s:40});const r=K('t3',0);if(r<0)text('?',X0+60,490,{f:'D',s:56,c:C.gold});else hbar(X0,490,1000,90,15000*E.out(P(r,0,.6)),MX,'#6FD3FF','1억 5,000만',{s:48});}
      const z=K('t3',1);if(z>=0)stampBox('2,100만 원 더 낸다',1160,680,z,{s:56,c:C.red,bg:'rgba(40,0,0,.92)'});
      srcLine('300만 × 57달 = 1억 7,100만 · 250만 × 60달 = 1억 5,000만 (python3)');});
    sub('t4','t7',()=>{
      contract(440,500,.82,'300만 원',{note:'다음 인상의 바탕'});
      text('상가건물 임대차보호법: 올릴 때 지금 월세의 5%까지',1260,190,{f:'D',s:40,c:C.gold,max:1180,alpha:P(L('t4'),0,.3)});
      if(L('t5')>=0){[['바탕 300만','+15만 원','#ff9a9a',0],['바탕 250만','+12만 5,000원','#6FD3FF',1]].forEach(([l,v,col,j],i)=>{group(1000+i*520,450,1,0,1,()=>{panel(-230,-160,460,320,{bd:col});text(l,0,-80,{f:'D',s:44,c:C.dim});const q=K('t5',j);if(q>=0)popText(KT('t5',j),0,40,v,{f:'D',s:v.length>6?50:66,c:col,max:420});else text('?',0,40,{f:'D',s:66,c:C.gold});});});}
      if(L('t6')>=0&&L('t7')<0)pill(L('t6b')>=0?'300만 = 다음 계약의 출발점이 되기 쉽다':'갱신 요구 10년 동안 따라다니는 숫자',1260,720,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('t6'),.1,.3)});
      if(L('t7')>=0)stampBox('석 달 공짜보다 계약서 숫자',1260,720,L('t7'),{s:46,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('상가건물 임대차보호법 제10조(갱신 요구 10년)·제11조, 시행령 제4조(5%) — 환산보증금 기준 안쪽 상가 · 국민일보 2025.12.4');});
  }},
  /* ── 실제 숫자로 보면 ── */
  real:{draw(){
    sub('r1','r1',lt=>{[0,1,2].forEach(i=>shopUnit(380+i*580,480,.85,{vacant:i!==1,name:'영업 중',alpha:P(lt,.1+i*.15,.3)}));});
    sub('r2','r2',()=>{text('전국 상가 공실률 · 2026년 2분기',960,170,{f:'D',s:52,c:C.gold});
      big('r2',0,960,400,'13.4%',{f:'D',s:200,c:C.red,glow:'rgba(255,77,77,.4)'});
      if(T>FR('r2',.55))stampBox('2015년 통계 작성 뒤 가장 높다',960,650,T-FR('r2',.55),{s:50,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('한국부동산원 상업용부동산 임대동향조사 (뉴시스 2026.7.30) · 일반상가');});
    sub('r3','r3',()=>{text('1층 상가 100곳 (2026년 2분기)',960,170,{f:'D',s:52,c:C.gold});
      const q=K('r3',0);for(let i=0;i<100;i++){const x=430+(i%20)*54,y=250+Math.floor(i/20)*72;const off=q>=0&&i>=93;const k=off?P(q,(i-93)*.08,.2):0;ctx.fillStyle=k>0?'#2b3348':'#ffe9b8';rr(x,y,44,58,6);ctx.fill();if(k>0){ctx.fillStyle='#fff';ctx.globalAlpha*=1;rr(x+10,y+18,24,18,3);ctx.fill();}}
      text(q>=0?'6.7% — 100곳 중 7곳 가까이 빈 자리':'?',960,700,{f:'D',s:52,c:q>=0?'#ffb3b3':C.gold});
      srcLine('한국부동산원 (뉴시스 2026.7.30) · 일반상가 1층 공실률 6.7% · 서울 1층 4.8%');});
    sub('r4','r4',()=>{text('3분기엔 더 올랐다 (2026년 3분기 공실률)',960,170,{f:'D',s:50,c:C.gold});
      const X0=600,MX=18;
      [['일반상가',13.7,'#ff6b6b',0],['중대형 상가',14.7,'#ff9a9a',.4],['소규모 상가',8.7,'#ffb3b3',.8]].forEach(([l,v,col,d],i)=>{const y=330+i*150;text(l,X0-30,y,{a:'right',f:'D',s:44});const q=K('r4',0)-d;if(q<0)text('?',X0+60,y,{f:'D',s:56,c:C.gold});else hbar(X0,y,1000,90,v*E.out(P(q,0,.6)),MX,col,v+'%',{s:50});});
      srcLine('한국부동산원 2026년 3분기 (SBS Biz 2026.10.29 · 경북매일 2026.10.29)');});
    sub('r5','r6',()=>{text('같은 3분기 (전 분기 대비)',960,170,{f:'D',s:52,c:C.gold});
      group(540,470,1,0,1,()=>{panel(-360,-220,720,440,{bd:C.red});text('공실률',0,-130,{f:'D',s:50,c:C.dim});text('13.4 → 13.7%',0,-10,{f:'D',s:76,c:C.red});text('빈 가게는 늘었다',0,110,{s:36,w:900,c:'#ffb3b3'});});
      group(1380,470,1,0,1,()=>{panel(-360,-220,720,440,{bd:'#6FD3FF'});text('상가 임대가격지수',0,-130,{f:'D',s:50,c:C.dim});const q=K('r5',0);if(q>=0)popText(KT('r5',0),0,-10,'−0.02%',{f:'D',s:96,c:'#6FD3FF'});else text('?',0,-10,{f:'D',s:96,c:C.gold});text('월세는 거의 그대로',0,110,{s:36,w:900,c:'#b6e8ff'});});
      if(L('r6')>=0)stampBox('빈 가게 ↑ · 월세 그대로',960,790,L('r6'),{s:48,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('한국부동산원 2026년 2·3분기 일반상가 공실률 · 3분기 통합 임대가격지수 (뉴시스 2026.7.30 · SBS Biz 2026.10.29)');});
    sub('r7','r8',()=>{
      group(960,380,1,0,P(L('r7'),0,.3),()=>{panel(-820,-170,1640,340,{bd:'rgba(255,255,255,.4)'});text('"공실이 발생한다 해도',0,-60,{f:'D',s:64});text('임대료를 내리는 건물주는 찾기 힘들다"',0,40,{f:'D',s:64,c:C.gold,max:1560});text('— 강남역 상권 공인중개업소 관계자 (조선비즈 2023.6.15)',0,120,{s:30,w:900,c:C.dim,max:1560});});
      if(L('r7b')>=0)pill('6개월 넘게 새 임차인을 못 구한 상가 주인 — "대출 이자만 계속 나간다" (국민일보 2025.12.4)',960,640,{s:30,bg:'rgba(255,255,255,.92)',alpha:P(L('r7b'),.1,.3)});
      if(L('r8')>=0)stampBox('그 말 뒤의 숫자 = 월세 × 12 ÷ 수익률',960,770,L('r8'),{s:46,c:C.gold,bg:'rgba(40,30,0,.92)'});});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    if(T<CT('g4')){
      text('월세 50만 원 인하 → 사라지는 건물값 · 수익률만 바꾸면 (예시)',960,165,{f:'D',s:42,c:C.gold,max:1800});
      const X0=520,MX=21000;
      const rows=[['수익률 3%',20000,'2억','g2',0],['수익률 4% (오늘)',15000,'1억 5,000만',null,0],['수익률 5%',12000,'1억 2,000만','g2',1],['수익률 6%',10000,'1억','g2',2]];
      rows.forEach(([l,v,lab,id,j],i)=>{const y=280+i*120;text(l,X0-30,y,{a:'right',f:'D',s:42,c:i===1?C.gold:'#fff'});
        if(id&&K(id,j)<0){text('?',X0+60,y,{f:'D',s:52,c:C.gold});return;}const k=id?E.out(P(K(id,j),0,.6)):1;hbar(X0,y,1000,80,v*k,MX,i===1?C.gold:C.red,lab,{s:46});});
      if(L('g3')>=0&&L('g3b')<0)pill('수익률을 낮게 쳐 주는 곳일수록 → 같은 50만 원이 더 큰 건물값',960,780,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('g3'),.1,.3)});
      if(L('g3b')>=0)pill('수익률을 높게 쳐 주는 곳이라면 → 깎는 쪽이 덜 아프다',960,780,{s:34,bg:'rgba(111,211,255,.95)',alpha:P(L('g3b'),.1,.3)});
      srcLine('600만 ÷ 0.03 = 2억 · ÷ 0.05 = 1억 2,000만 · ÷ 0.06 = 1억 (예시 수익률)');
    }else{
      bldg(440,520,.62,{vacant:1,value:'9억?'});
      group(1300,330,1,0,P(L('g4'),0,.3),()=>{panel(-500,-150,1000,300,{bd:C.gold});text('9억 원의 조건',0,-70,{f:'D',s:48,c:C.gold});text('누군가 월세 300만 원을 내고 들어온다',0,30,{f:'D',s:48,max:940});});
      if(L('g5')>=0)group(1300,610,1,0,P(L('g5'),0,.3),()=>{panel(-500,-120,1000,240,{bd:C.red});text('그 자리 시세가 250만이라면',0,-50,{f:'D',s:46,c:'#ffb3b3'});text('9억 = 계산서에만 있는 숫자',0,40,{f:'D',s:52,c:C.red});});
      if(L('g5b')>=0&&L('g6')<0)pill('갈림길: 시세가 300만 근처인가, 250만 근처인가',1300,800,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('g5b'),.1,.3)});
      if(L('g6')>=0)stampBox('깎을까, 더 비워 둘까',1300,800,L('g6'),{s:50,c:C.gold,bg:'rgba(40,30,0,.92)'});
    }
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('상가 계약 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','비어 있던 기간','오래 비었을수록 이야기할 여지','오늘: 반년'],['k3','첫해 실제 평균 월세','공짜 기간까지 넣어 ÷ 12','오늘: 225만'],['k4','계약서에 적히는 월세','다음 5% 인상의 바탕','오늘: 300만 → +15만'],
      ['k5','관리비까지 더한 자리값','월세만 보면 싸 보인다','월세 + 관리비'],['k6','10년 뒤 최대 월세','해마다 5%씩 최대로 오르면','오늘: 약 465만']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-760,-280,1520,540,{bg:'rgba(6,13,32,1)',bd:C.gold});text('월세 200만 원 · 수익률 5% · 월세를 20만 원 깎으면',0,-200,{f:'D',s:42,max:1440});text('건물값은 얼마나 줄어들까?',0,-140,{f:'D',s:44,max:1440});
      const b=L('k7b');
      if(b>=0)text('20만 × 12 = 240만 ÷ 0.05',0,-40,{f:'D',s:50,alpha:P(b,0,.3),max:1440});
      const k=K('k7b',0);if(k>=0)text('4,800만 원',0,90,{f:'D',s:110,c:C.red,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,90,{f:'D',s:110,c:C.gold});
      if(L('k7c')>=0)text('건물값 4억 8,000만 원 (200만 × 12 ÷ 0.05)의 10분의 1',0,210,{s:36,w:900,c:'#6FD3FF',alpha:P(L('k7c'),0,.3),max:1440});});}
    if(ov<0&&L('k6')>=0)srcLine('300만 × 1.05⁹ = 465만 (1년 안 재인상 금지 → 10년에 최대 9번, 환산보증금 기준 안쪽 상가 · 예시)');
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('월세 300만 원 빈 상가',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      bldg(460,560,.62,{vacant:1,value:'9억',alpha:P(a,0,.3)});
      const b=L('z2b');
      if(b>=0){[['50만 원 깎으면','−1억 5,000만',C.red],['반년 비워 두면','−2,040만','#ff9a9a'],['석 달 공짜','−900만 · 9억 유지',C.green]].forEach(([l,v,col],i)=>{const kk=P(b,i*.8,.3);if(kk<=0)return;group(1320,330+i*170,1,0,kk,()=>{panel(-500,-70,1000,140,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-450,4,{a:'left',f:'D',s:44,max:420});text(v,450,4,{a:'right',f:'D',s:v.length>9?46:60,c:col,max:500});});});}
      else if(L('z2')>=0){[['월세 300만 · 수익률 4%','건물값 9억',C.gold],['월세 만 원 한 장','건물값 300만','#e3a77d']].forEach(([l,v,col],i)=>{const kk=P(L('z2'),.4+i*1.4,.3);if(kk<=0)return;text(l,1000,380+i*170,{a:'left',f:'D',s:46,alpha:kk});text(v,1800,450+i*170,{a:'right',f:'D',s:66,c:col,alpha:kk});});}
    }else{
      bldg(560,500,.6,{vacant:1,tag:'월세 300만'});manBill(1140,470,.8,{rot:-.06});drawMascot(1600,560,.55,'happy');
      stampBox('빈 가게의 월세 = 건물의 값',960,800,c,{s:56,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      if(L('z4')>=0&&L('z4b')<0)pill('예시 가정 · 투자·창업 권유 아님',1500,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-520,-70,1040,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 동네 빈 1층 가게, 몇 달째인가요?',0,4,{s:40,w:900,c:C.ink,max:980});});
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
