/* ════════════════════════════════════════════════════════════════════
   장면 (LF.24 동네 중국집 서비스 만두 계산서 — 원가 1,000원 × 1,200봉지 = 120만 · 216만 → 96만 · 처음엔 남는 장사 · 빼면 14.7%까지) — 수치·출처는 docs/longform-ep24.md
   중심 그림: 한 건 2만 원 = 100원 동전 200개. 재료 80개 · 배달앱 52개 · (서비스 만두 10개) · 남는 68개 → 58개 (예시).
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['5','8','0','0','×','1','2','0','0','−','6','0','0','0','0','0','0','='];   // 5,800 × 1,200 − 6,000,000 = 960,000 (0 개수: 5800 은 둘, 1200 은 둘, 6000000 은 여섯)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}
function bubble(x,y,w,h,str,o={}){group(x,y,o.k??1,o.rot||0,o.alpha??1,()=>{ctx.fillStyle='#fff';rr(-w/2,-h/2,w,h,30);ctx.fill();if(o.tail!==false){ctx.beginPath();ctx.moveTo(-w*.2,h/2);ctx.lineTo(-w*.26,h/2+50);ctx.lineTo(-w*.1,h/2);ctx.fill();}if(str)text(str,0,4,{f:'D',s:o.s||60,c:o.c||C.ink,max:w-60});});}
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:32,w:900,c:'#3a4256',max:280});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433'});});
});}
function arrowR(x1,y,x2,col='#fff',lw=8){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=lw;ctx.lineCap='round';line(x1,y,x2-lw*2,y);ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-lw*4,y-lw*2.6);ctx.lineTo(x2-lw*4,y+lw*2.6);ctx.closePath();ctx.fill();ctx.restore();}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CF='#ff9f5a', CA='#8f7bff', CM='#e2a64a', CP='#35E08A', CB='#6FD3FF';
/* 만두 한 개 (반달) */
function dmDumpling(x,y,s,rot=0,al=1){group(x,y,s,rot,al,()=>{
  ctx.fillStyle='#d9973c';ctx.beginPath();ctx.moveTo(-60,18);ctx.quadraticCurveTo(-58,-46,0,-50);ctx.quadraticCurveTo(58,-46,60,18);ctx.quadraticCurveTo(0,34,-60,18);ctx.closePath();ctx.fill();
  ctx.fillStyle='#f3c77a';ctx.beginPath();ctx.moveTo(-50,8);ctx.quadraticCurveTo(-46,-36,0,-40);ctx.quadraticCurveTo(46,-36,50,8);ctx.quadraticCurveTo(0,20,-50,8);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#b8741f';ctx.lineWidth=4;ctx.lineCap='round';for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*16,-44+Math.abs(i)*3);ctx.lineTo(i*18,-24+Math.abs(i)*2);ctx.stroke();}
  ctx.fillStyle='rgba(120,60,0,.35)';ctx.beginPath();ctx.ellipse(0,22,58,8,0,0,7);ctx.fill();
});}
/* 짜장면 그릇 */
function dmBowl(x,y,s,al=1){group(x,y,s,0,al,()=>{
  ctx.fillStyle='#e8e2d6';ctx.beginPath();ctx.ellipse(0,-10,120,34,0,0,7);ctx.fill();
  ctx.fillStyle='#3a2414';ctx.beginPath();ctx.ellipse(0,-12,104,26,0,0,7);ctx.fill();
  ctx.fillStyle='#5a3a1e';for(let i=0;i<7;i++){ctx.beginPath();ctx.arc(-60+i*20,-16+(i%2)*8,8,0,7);ctx.fill();}
  ctx.fillStyle='#7fbf5a';ctx.fillRect(-12,-30,22,8);
  ctx.fillStyle='#f4efe6';ctx.beginPath();ctx.moveTo(-120,-10);ctx.quadraticCurveTo(-110,70,0,74);ctx.quadraticCurveTo(110,70,120,-10);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#c0392b';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-100,30);ctx.quadraticCurveTo(0,52,100,30);ctx.stroke();
});}
/* 배달 봉지 (상표 없음) */
function dmBag(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=14;ctx.beginPath();ctx.arc(-70,-150,48,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.arc(70,-150,48,Math.PI,0);ctx.stroke();
  ctx.fillStyle='rgba(250,250,250,.95)';ctx.beginPath();ctx.moveTo(-170,-150);ctx.lineTo(170,-150);ctx.lineTo(190,170);ctx.quadraticCurveTo(0,190,-190,170);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=3;for(let i=-2;i<=2;i++)line(i*60,-130,i*66,160);
  text(o.label||'',0,30,{f:'D',s:54,c:'#c0392b'});
});}
/* 동네 중국집 앞 (상표 없음). o.name 간판, o.svc 만두 서비스 현수막 0~1, o.dim */
function dmShop(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,214,300,20,0,0,7);ctx.fill();
  ctx.fillStyle='#4a2a2a';rr(-260,-210,520,420,10);ctx.fill();
  ctx.fillStyle=o.dim?'#5a4040':'#c0392b';rr(-260,-210,520,96,8);ctx.fill();
  text(o.name||'중화요리',0,-160,{f:'D',s:56,c:o.dim?'#a08080':'#ffe08a',max:480});
  ctx.save();if(!o.dim){ctx.shadowColor='rgba(255,224,140,.55)';ctx.shadowBlur=26;}ctx.fillStyle=o.dim?'#2a2020':'#ffe9b8';rr(-230,-90,460,270,6);ctx.fill();ctx.restore();
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-2,-90,4,270);
  for(let i=0;i<3;i++){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.ellipse(-150+i*150,-82,26,32,0,0,7);ctx.fill();ctx.fillStyle='#ffd23f';ctx.fillRect(-156+i*150,-56,12,10);}
  if(o.svc>0)group(0,110,lerp(1.6,1,E.out(o.svc)),-.04,Math.min(1,o.svc*3),()=>{ctx.fillStyle='#ffd23f';rr(-210,-44,420,88,12);ctx.fill();text(o.svcText||'군만두 서비스!',0,4,{f:'D',s:48,c:'#7a1a10',max:390});});
  if(o.tag)group(0,250,1,0,1,()=>{ctx.fillStyle='rgba(6,13,32,.9)';rr(-150,-34,300,68,34);ctx.fill();text(o.tag,0,3,{f:'D',s:36,c:C.gold,max:280});});
});}
/* 동전 200개 (20 × 10). fn(i) → {col, al, dy, x} */
function dmCoins(x0,y0,cell,fn){const r=cell*.43;for(let i=0;i<200;i++){const st=fn(i);if(!st||st.al<=0)continue;const cx=x0+(i%20)*cell,cy=y0+Math.floor(i/20)*cell+(st.dy||0);ctx.save();ctx.globalAlpha*=st.al;ctx.fillStyle=st.col;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,r*.72,0,7);ctx.stroke();if(st.x){ctx.strokeStyle='#fff';ctx.lineWidth=3;line(cx-r*.6,cy-r*.6,cx+r*.6,cy+r*.6);line(cx+r*.6,cy-r*.6,cx-r*.6,cy+r*.6);}ctx.restore();}}
/* 카테고리: 0~79 재료 · 80~131 배달앱 · 132~141 만두 · 142~199 남는 돈 */
function coinCat(i,svc){return i<80?CF:i<132?CA:i<142?(svc?CM:CP):CP;}
/* 꺾은선 도우미 */
function chartAxes(X0,X1,Y0,Ytop,xt,xl){ctx.save();ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(X0,Y0,X1,Y0);line(X0,Y0,X0,Ytop);ctx.restore();xt.forEach(([v,x])=>text(v,x,Y0+32,{s:26,w:800,c:C.dim}));text(xl,X1,Y0+70,{a:'right',s:26,w:800,c:C.dim});}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3')){
      const a=L('o1');
      dmBag(470,500,1.05*E.back(P(a,0,.5))+.001,{label:''});
      dmBowl(400,520,.62,P(a,.3,.3));dmBowl(560,560,.62,P(a,.45,.3));
      const q=K('o1',0);for(let i=0;i<4;i++){const k=q<0?0:E.back(P(q,i*.12,.35));if(k>0)dmDumpling(330+i*90,660,.62*k,(i%2?.15:-.15));}
      text('금요일 저녁 7시 · 예시',470,190,{f:'D',s:44,c:C.dim,alpha:P(a,.2,.3)});
      if(L('o2')>=0){text('만두 한 봉지 원가',1360,240,{f:'D',s:46,c:C.dim});big('o2',0,1360,350,'1,000원',{f:'D',s:110,c:CM});
        text('× 한 달 1,200봉지',1360,490,{f:'D',s:46,c:C.dim,alpha:P(T,FR('o2',.55),.3)});big('o2',1,1360,620,'120만 원',{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.45)'});}
      srcLine('예시 가정 · 동네 중국집 한 곳의 한 달 계산 · 그림은 실제 가게가 아님');
    }else if(T<CT('o4')){
      const b=L('o3'),q=K('o3',0);
      text('사장님 손에 남는 돈 (한 달)',960,180,{f:'D',s:52,c:C.gold});
      text('만두 없을 때',560,340,{a:'right',f:'D',s:44});hbar(600,340,1000,90,216*E.out(P(b,.2,.6)),240,CP,'216만',{s:52});
      text('만두 넣고',560,500,{a:'right',f:'D',s:44});hbar(600,500,1000,90,q>=0?96*E.out(P(q,0,.6)):0,240,C.red,q>=0?'96만':'?',{s:52,lc:q>=0?C.red:C.gold});
      if(L('o3b')>=0){[['처음 만두 넣은 달','+19만?',CP],['그다음','?',C.red],['빼면','?','#fff']].forEach(([t,v,col],i)=>{const k=P(L('o3b'),.2+i*.6,.3);if(k>0)group(420+i*540,720,1,0,k,()=>{panel(-240,-80,480,160,{bd:col});text(t,0,-30,{s:32,w:900,c:C.dim});text(v,0,32,{f:'D',s:54,c:col});});});}
      srcLine('예시 가정 · 216만 − 120만 = 96만');
    }else{
      const k9=L('o4'),k10=L('o5');
      text('서비스 넣기 전에 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['짜장면 값 · 한국소비자원 (보도)','식재료비 · 정부 조사 (보도)','배달앱 비용 · 중기중앙회 (보도)'].forEach((s,i)=>{const k=P(k10,.4+i*.6,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('동네 중국집 서비스 만두 계산서',960,220,{f:'D',s:100,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('원가 1,000원 × 1,200봉지 · 사장님 몫 216만 → 96만',960,350,{s:48,w:900,alpha:P(a,.3,.3),max:1780});
    dmShop(560,680,.62,{alpha:P(a,.2,.3)});for(let i=0;i<4;i++)dmDumpling(1000+i*95,700+(i%2)*20,.75,(i%2?.2:-.15),P(a,.3+i*.08,.3));drawMascot(1600,690,.72,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 중국집 ── */
  setup:{draw(){
    sub('p1','p3',()=>{
      dmShop(480,470,1);
      const q0=K('p2',0),q1=K('p2',1);
      if(L('p2')>=0&&L('p3')<0){text('하루 배달 40건 · 한 건 평균',1340,230,{f:'D',s:40,c:C.dim});text(q0>=0?'2만 원':'?',1340,330,{f:'D',s:96,c:q0>=0?'#fff':C.gold});
        text('한 달',1340,460,{f:'D',s:40,c:C.dim});text(q1>=0?'1,200건':'?',1340,560,{f:'D',s:96,c:C.gold});
        if(q1>=0)text('매출 2,400만 원',1340,680,{f:'D',s:56,c:'#fff',alpha:P(T,FR('p2',.8),.3)});}
      if(L('p3')>=0){dmBowl(1250,430,1.3);group(1250,640,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-180,-50,360,100,14);ctx.fill();text('짜장면 7,000원',0,4,{f:'D',s:46,c:'#c0392b',max:330});});
        pill('전국 평균 7,233원 (한국소비자원 참가격, 2026.9)',1250,790,{s:30,bg:'rgba(255,255,255,.92)',alpha:P(L('p3'),.5,.3)});}
      srcLine('예시 가정 · 하루 40건 × 30일 = 1,200건 · 한 건 2만 원');});
    sub('p4','p5',()=>{
      receipt(560,470,1,[['월세','150만'],['주방 직원 인건비','350만'],['가스·전기·기타','100만'],['= 고정비',K('p4',0)>=0?'600만':'?','#d62f2f']],{title:'주문이 없어도 나가는 돈'});
      if(L('p5')>=0){group(1380,470,1,0,P(L('p5'),0,.3),()=>{panel(-420,-190,840,380,{bd:CA});text('주문마다 나가는 돈',0,-120,{f:'D',s:44,c:C.dim});
        text('재료비',-360,-20,{a:'left',f:'D',s:52,c:CF});text('배달앱에 내는 돈',-360,90,{a:'left',f:'D',s:52,c:CA});dmBag(300,30,.38);});}
      srcLine('예시 가정 · 보증금·세금·사장님 인건비 제외');});
  }},
  /* ── 2만 원 = 동전 200개 ── */
  cut:{draw(){
    const X0=330,Y0=250,CE=52;
    const t2=KT('s2',0),t3=KT('s3',0),t4=KT('s4',0),t6=KT('s6',0);
    const svc=T>=t6;
    text(svc?'만두 서비스를 넣으면':'한 건 2만 원 = 100원 동전 200개',960,170,{f:'D',s:56,c:svc?CM:C.gold});
    const q=K('s1',0);
    dmCoins(X0,Y0,CE,i=>{const base=q<0?0:P(q,i*.004,.2);let col='#ffd36b';
      if(i<80&&T>=t2)col=CF;else if(i>=80&&i<132&&T>=t3)col=CA;else if(i>=132&&T>=t4)col=CP;
      if(i>=132&&i<142&&svc)col=CM;
      return{col,al:base,dy:(i>=132&&i<142&&svc)?-8*Math.sin(P(T,t6,.4)*Math.PI):0};});
    const LX=1400;
    const rows=[['재료 80개 · 8,000원',CF,t2],['배달앱 52개 · 5,200원',CA,t3]];
    if(svc)rows.push(['만두 10개 · 1,000원',CM,t6]);
    rows.push([svc?'남는 돈 58개 · 5,800원':'남는 돈 68개 · 6,800원',CP,t4]);
    rows.forEach(([t,col,t0],i)=>{const k=P(T,t0,.3);if(k<=0)return;ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=col;ctx.beginPath();ctx.arc(LX,300+i*110,20,0,7);ctx.fill();ctx.restore();text(t,LX+40,302+i*110,{a:'left',f:'D',s:38,c:col,alpha:k,max:440});});
    if(L('s5')>=0&&!svc)pill('6,800 × 1,200건 − 600만 = 216만 원',960,800,{s:38,bg:'rgba(53,224,138,.95)',alpha:P(L('s5'),.3,.3)});
    if(L('s7')>=0)pill('5,800 × 1,200건 − 600만 = ?',960,800,{s:38,bg:'rgba(255,255,255,.94)',alpha:P(L('s7'),.3,.3)});
    if(svc&&L('s7')<0)for(let i=0;i<4;i++)dmDumpling(1500+i*80,760,.5,(i%2?.2:-.15),P(T,t6,.3));
    srcLine('예시 가정 · 재료 40% (외식업 평균 40.7% 근처) · 배달앱 26% (입점업체 평균 26.2% 근처) · 동전 1개 = 100원');
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='5,800 × 1,200 − 6,000,000 =';bigS='960,000';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:28,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('한 건 5,800원 × 1,200건 − 고정비 600만',1300,180,{f:'D',s:44,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0),q3=K('c3',0);
    text('만두 없을 때',920,330,{a:'left',f:'D',s:40});hbar(920,400,820,70,216,240,CP,'216만',{s:46});
    text('만두 넣고',920,500,{a:'left',f:'D',s:40});hbar(920,570,820,70,q2>=0?96*E.out(P(q2,0,.6)):0,240,C.red,q2>=0?'96만':'?',{s:46,lc:q2>=0?C.red:C.gold});
    if(dt>=0&&L('c2')<0)group(1300,720,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(q3>=0){for(let i=0;i<4;i++)dmDumpling(1000+i*80,700,.45,(i%2?.2:-.15));stampBox('만두 1,200봉지 = 120만 원 (몫의 절반 넘게)',1330,790,q3,{s:40,c:C.gold,bg:'rgba(40,30,0,.92)'});}
  }},
  /* ── 처음엔 남는 장사 ── */
  first:{draw(){
    sub('f1','f2',()=>{
      for(let i=0;i<4;i++)dmDumpling(330+i*150,450,1.05,(i%2?.15:-.1));
      if(L('f2')>=0){group(1300,330,1,0,P(L('f2'),0,.3),()=>{panel(-380,-90,760,180,{bd:CM});text('사장님이 쓰는 돈',0,-34,{s:32,w:900,c:C.dim});text('원가 1,000원',0,32,{f:'D',s:60,c:CM});});
        group(1300,580,1,0,P(T,KT('f2',0),.3),()=>{panel(-380,-110,760,220,{bd:CP,bg:'rgba(53,224,138,.08)'});text('손님 눈에 보이는 값',0,-46,{s:32,w:900,c:C.dim});const q=K('f2',0);if(q>=0)popText(KT('f2',0),0,30,'3,000원어치',{f:'D',s:80,c:CP});else text('?',0,30,{f:'D',s:80,c:C.gold});});}
      else text('왜 만두를 넣었을까?',1300,450,{f:'D',s:64,c:C.gold});
      srcLine('예시 가정 · 메뉴판 군만두 값은 가게마다 다르다');});
    sub('f3','f4',()=>{
      text('만두 넣은 첫 달 (예시: 주문 +20%)',960,170,{f:'D',s:52,c:C.gold});
      const q=K('f3',0),q4=K('f4',0),X0=560;
      text('주문',X0-30,320,{a:'right',f:'D',s:44});hbar(X0,320,1000,80,q>=0?1200+240*E.out(P(q,0,.6)):1200,1500,CB,q>=0?'1,440건':'1,200건',{s:46});
      text('만두 없을 때',X0-30,500,{a:'right',f:'D',s:40});hbar(X0,500,1000,80,216,260,'#9aa3b8','216만',{s:46});
      text('만두 + 주문 +20%',X0-30,640,{a:'right',f:'D',s:40,max:470});hbar(X0,640,1000,80,q4>=0?235*E.out(P(q4,0,.6)):0,260,CP,q4>=0?'235만 (+19만)':'?',{s:46,lc:q4>=0?CP:C.gold});
      srcLine('5,800 × 1,440 − 600만 = 235만 2,000원 (python3) · 예시 가정');});
    sub('f5','f6',()=>{
      text('주문이 몇 % 늘어야 만두가 본전?',960,170,{f:'D',s:52,c:C.gold});
      const X0=300,X1=1700,Y0=760,xm=d=>X0+d/30*(X1-X0),yv=v=>Y0-(v-50)/250*460;
      chartAxes(X0,X1,Y0,yv(300),[0,5,10,15,20,25,30].map(d=>[d+'%',xm(d)]),'만두 넣고 늘어난 주문');
      ctx.save();ctx.strokeStyle='#9aa3b8';ctx.lineWidth=5;ctx.setLineDash([16,10]);line(xm(0),yv(216),xm(30),yv(216));ctx.restore();text('만두 없을 때 216만',xm(0)+20,yv(216)-34,{a:'left',s:30,w:900,c:'#c9ced9'});
      const up=30*E.out(P(L('f5'),.1,1.2)),pf=d=>(5800*1200*(1+d/100)-6e6)/1e4;
      ctx.save();ctx.lineWidth=7;ctx.strokeStyle=CP;ctx.beginPath();for(let d=0;d<=up;d+=.5){const x=xm(d),y=yv(pf(d));d===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();ctx.restore();
      text('96만',xm(0)+20,yv(96)+36,{a:'left',f:'D',s:34,c:C.red});
      const q=K('f5',0);if(q>=0){ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(xm(17.24),yv(216),16,0,7);ctx.fill();popText(KT('f5',0),xm(17.24),yv(216)+70,'17% = 본전',{f:'D',s:48,c:C.gold});}
      if(up>=20){ctx.fillStyle=CP;ctx.beginPath();ctx.arc(xm(20),yv(235.2),12,0,7);ctx.fill();text('+20% → 235만',xm(20)+20,yv(235.2)-40,{a:'left',f:'D',s:34,c:CP});}
      if(L('f6')>=0)stampBox('이때 만두 = 광고',620,300,L('f6'),{s:56,c:CP,bg:'rgba(0,30,15,.9)'});
      srcLine('본전 = 6,800 × 1,200 ÷ 5,800 = 1,407건 → +17.2% (python3) · 예시 가정');});
  }},
  /* ── 옆집도 만두를 주면 (어두운 장) ── */
  follow:{draw(){
    sub('n1','n2',()=>{
      dmShop(520,450,.9,{name:'우리 가게',svc:1});
      const k=L('n2')>=0?P(L('n2'),.5,.4):0;dmShop(1400,450,.9,{name:'길 건너 중국집',svc:k,svcText:'우리도 군만두!'});
      if(L('n2')>=0)pill('석 달 뒤 (예시)',1400,800,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('n2'),.2,.3)});
      srcLine('그림은 예시 · 실제 가게가 아님');});
    sub('n3','n4',()=>{
      text('손님은 이제 만두로 고르지 않는다',960,170,{f:'D',s:54,c:C.gold});
      const q=K('n3',0),q4=K('n4',0),X0=560;
      text('주문',X0-30,330,{a:'right',f:'D',s:44});const ord=q>=0?1440-240*E.out(P(q,0,.6)):1440;hbar(X0,330,1000,80,ord,1500,CB,won(ord)+'건',{s:46});
      if(q>=0)popText(KT('n3',0),1300,430,'늘었던 240건 → 0건',{f:'D',s:44,c:C.red});
      text('만두 없을 때',X0-30,560,{a:'right',f:'D',s:40});hbar(X0,560,1000,80,216,260,'#9aa3b8','216만',{s:46});
      text('지금',X0-30,700,{a:'right',f:'D',s:40});hbar(X0,700,1000,80,q4>=0?96*E.out(P(q4,0,.6)):0,260,C.red,q4>=0?'96만':'?',{s:46,lc:q4>=0?C.red:C.gold});
      srcLine('5,800 × 1,200 − 600만 = 96만 · 예시 가정');});
    sub('n5','n6',()=>{
      dmShop(520,450,.85,{name:'우리 가게',svc:1});
      const q=K('n5',0);
      if(q>=0)stampBox('광고 → 기본값',1360,300,q,{s:76,c:C.gold,bg:'rgba(40,30,0,.92)'});
      if(L('n6')>=0){bubble(1360,580,820,150,'"저번엔 만두 줬는데…?"',{s:52,k:E.back(P(L('n6'),.2,.4))+.001});text('예시 대사 · 실제 리뷰 아님',1360,720,{s:28,w:800,c:C.dim,alpha:P(L('n6'),.6,.3)});}
      srcLine('예시 가정 · 서비스를 뺐을 때 리뷰·주문이 얼마나 주는지는 공식 통계가 없다');});
  }},
  /* ── 실제 숫자로 보면 ── */
  real:{draw(){
    sub('r1','r2',()=>{
      text('전국 짜장면 평균 값 (한국소비자원 참가격)',960,170,{f:'D',s:50,c:C.gold,max:1700});
      const q=K('r2',0),X0=560;
      text('2025년 9월',X0-30,380,{a:'right',f:'D',s:44});hbar(X0,380,1000,100,6994*E.out(P(L('r2'),.1,.6)),7500,'#9aa3b8','6,994원',{s:50});
      text('2026년 9월',X0-30,560,{a:'right',f:'D',s:44});hbar(X0,560,1000,100,q>=0?7233*E.out(P(q,0,.6)):0,7500,C.gold,q>=0?'7,233원':'?',{s:50});
      if(q>=0)stampBox('1년 +3.4%',1450,740,T-FR('r2',.8),{s:50,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('한국소비자원 참가격 · 뉴시스(파이낸셜뉴스) 2026.10.19 · 0부터 그린 막대라 차이가 작게 보인다');});
    sub('r3','r4',()=>{
      text('외식업체 경영실태조사 (농식품부, 2026.3 발표)',960,170,{f:'D',s:48,c:C.gold,max:1700});
      const q3=K('r3',0),q4=K('r4',0);
      group(520,470,1,0,1,()=>{panel(-400,-230,800,460,{bd:CF});text('매출 중 식재료비',0,-160,{f:'D',s:44,c:C.dim});text('36.3%',0,-50,{f:'D',s:72,c:'#c9ced9'});arrowR(-30,30,30,'#fff',6);text(q3>=0?'40.7%':'?',0,120,{f:'D',s:96,c:q3>=0?CF:C.gold});});
      if(L('r4')>=0)group(1400,470,1,0,P(L('r4'),0,.3),()=>{panel(-400,-230,800,460,{bd:C.red});text('외식업 영업이익률',0,-160,{f:'D',s:44,c:C.dim});text('12.1%',0,-50,{f:'D',s:72,c:'#c9ced9'});arrowR(-30,30,30,'#fff',6);text(q4>=0?'8.7%':'?',0,120,{f:'D',s:96,c:q4>=0?C.red:C.gold});});
      if(T>FR('r4',.7))pill('오늘 예시 가게: 216만 ÷ 2,400만 = 9%',960,790,{s:34,bg:'rgba(255,255,255,.94)'});
      srcLine('농림축산식품부 보도자료 2026.3.29 (2025년 외식업체 경영실태조사) · 비교 연도는 보도자료 기준');});
    sub('r5','r7',()=>{
      text('배달앱 입점업체 거래비용 (중기중앙회 2026 조사, 1,250곳)',960,170,{f:'D',s:44,c:C.gold,max:1760});
      const q=K('r5',0),fr=q>=0?.262*E.out(P(q,0,.8)):0;
      ctx.fillStyle='rgba(255,255,255,.1)';ctx.beginPath();ctx.arc(480,500,220,0,7);ctx.fill();
      if(fr>0){ctx.fillStyle=CA;ctx.beginPath();ctx.moveTo(480,500);ctx.arc(480,500,220,-Math.PI/2,-Math.PI/2+fr*Math.PI*2);ctx.closePath();ctx.fill();}
      text(q>=0?'26.2%':'?',480,500,{f:'D',s:90,c:'#fff',st:8});text('월매출 중',480,770,{f:'D',s:40,c:C.dim});
      if(L('r6')>=0){const parts=[['중개 수수료',42.0],['배달비',29.9],['광고비',15.6],['결제 수수료',12.4]];let acc=0;const BX=900,BW=900;
        parts.forEach(([t,v],i)=>{const k=P(L('r6'),.2+i*.4,.3);const x=BX+acc/100*BW,w=v/100*BW;acc+=v;if(k<=0)return;ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=['#8f7bff','#b3a6ff','#d0c8ff','#6a5acd'][i];rr(x+2,330,w-4,110,10);ctx.fill();ctx.restore();
          text(t,x+w/2,i<2?290:480,{s:26,w:900,c:'#d9d4ff',alpha:k,max:Math.max(w,150)});text(v+'%',x+w/2,386,{f:'D',s:32,c:'#1d1650',alpha:k,max:w-10});});
        text('26.2% 안을 나누면',BX,240,{a:'left',s:30,w:900,c:C.dim});
        if(T>FR('r6',.65))pill('배달앱 입점업체 매출의 48.5% = 배달앱에서',1350,570,{s:32,bg:'rgba(255,255,255,.94)'});}
      if(L('r7')>=0)group(1350,700,1,0,P(L('r7'),0,.3),()=>{panel(-440,-80,880,160,{bd:'#ff9a9a',bg:'rgba(6,13,32,1)'});text('업계 반박: 성격이 다른 비용을 합친 값',0,-26,{s:30,w:900,c:'#ffb3b3',max:820});text('→ 오늘은 \'배달앱으로 나가는 돈 전체\'로 씀',0,30,{s:30,w:900,c:'#fff',max:820});});
      srcLine('중소기업중앙회 2026 온라인플랫폼 입점사 거래 실태조사 (6.18~7.3) · 경북매일·바이라인네트워크 2026.9.15 · 한국온라인쇼핑협회 반박');});
    sub('r8','r8',lt=>{
      text('매출 100이면',960,170,{f:'D',s:54,c:C.gold});
      const X0=560;
      text('남는 돈',X0-30,380,{a:'right',f:'D',s:46});hbar(X0,380,1000,100,9*E.out(P(lt,.2,.5)),12,CP,'9',{s:60});
      text('만두 한 봉지',X0-30,560,{a:'right',f:'D',s:46});hbar(X0,560,1000,100,5*E.out(P(lt,.6,.5)),12,CM,'5',{s:60});
      stampBox('만두가 남는 돈의 절반 넘게',1180,760,lt-1.2,{s:50,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('예시 가게: 216만 ÷ 2,400만 = 9% · 1,000 ÷ 20,000 = 5%');});
  }},
  /* ── 빼면 몇 명이 떠나야 본전 ── */
  remove:{draw(){
    sub('m1','m2',()=>{
      text('만두를 빼면',960,170,{f:'D',s:56,c:C.gold});
      group(540,460,1,0,1,()=>{panel(-380,-200,760,400,{bd:CP,bg:'rgba(53,224,138,.08)'});text('한 건마다 돌아오는 돈',0,-130,{s:34,w:900,c:C.dim});text('+1,000원',0,-30,{f:'D',s:90,c:CP});for(let i=0;i<4;i++)dmDumpling(-150+i*100,110,.55,(i%2?.2:-.15),.5);});
      if(L('m2')>=0&&T>FR('m2',.4))group(1380,460,1,0,P(T,FR('m2',.4),.3),()=>{panel(-380,-200,760,400,{bd:C.red});text('떠난 주문 한 건마다',0,-130,{s:34,w:900,c:C.dim});text('−6,800원',0,-30,{f:'D',s:90,c:C.red});text('재료·배달앱 빼고 남던 돈 전부',0,100,{s:30,w:900,c:'#ffb3b3'});});
      srcLine('예시 가정 · 만두를 빼면 한 건 남는 돈 5,800 → 6,800원');});
    sub('m3','m6',()=>{
      text('만두를 빼서 주문이 줄면 남는 돈은?',960,165,{f:'D',s:50,c:C.gold});
      const X0=300,X1=1700,Y0=760,xm=d=>X0+d/25*(X1-X0),yv=v=>Y0-(v-20)/220*470;
      chartAxes(X0,X1,Y0,yv(240),[0,5,10,15,20,25].map(d=>[d+'%',xm(d)]),'만두 빼고 줄어든 주문');
      ctx.save();ctx.strokeStyle=C.red;ctx.lineWidth=5;ctx.setLineDash([16,10]);line(xm(0),yv(96),xm(25),yv(96));ctx.restore();text('만두 계속 주면 96만',xm(25),yv(96)+36,{a:'right',s:30,w:900,c:'#ffb3b3'});
      const pf=d=>(6800*1200*(1-d/100)-6e6)/1e4,up=25*E.out(P(L('m3'),.1,1.2));
      ctx.save();ctx.lineWidth=7;ctx.strokeStyle=CP;ctx.beginPath();for(let d=0;d<=up;d+=.5){const x=xm(d),y=yv(pf(d));d===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();ctx.restore();
      text('216만',xm(0)+20,yv(216)-30,{a:'left',f:'D',s:34,c:CP});
      const q=K('m3',0);if(q>=0&&L('m4')<0){ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(xm(14.7),yv(96),16,0,7);ctx.fill();popText(KT('m3',0),xm(14.7),yv(96)-70,'14.7% = 본전',{f:'D',s:50,c:C.gold});}
      const pts=[['m4',0,5,'175만'],['m4',1,10,'134만'],['m5',0,15,'94만'],['m5',1,20,'53만']];
      pts.forEach(([id,j,d,lab])=>{const k=K(id,j);if(k<0)return;const v=pf(d),col=v>96?CP:C.red;ctx.fillStyle=col;ctx.beginPath();ctx.arc(xm(d),yv(v),14,0,7);ctx.fill();popText(KT(id,j),xm(d)+(d>=15?-10:16),yv(v)+(d>=15?50:-44),'−'+d+'% → '+lab,{f:'D',s:36,c:col,a:d>=15?'right':'left'});});
      const q6=K('m6',0);if(q6>=0)stampBox('모르는 숫자 = 매달 120만 원 보험료',1080,300,q6,{s:44,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('6,800 × 1,200 × (1 − 감소율) − 600만 · 본전 1,024건 = −14.7% (python3) · 감소율은 예시');});
    sub('m7','m7',lt=>{
      text('한꺼번에 말고, 나눠서 재 보기',960,170,{f:'D',s:56,c:C.gold});
      group(520,470,1,0,1,()=>{panel(-380,-220,760,440,{bd:CM});text('네 개 → 두 개',0,-150,{f:'D',s:52,c:CM});for(let i=0;i<4;i++)dmDumpling(-150+i*100,0,.7,(i%2?.2:-.15),i<2?1:1-P(lt,.6,.5));text('원가 1,000 → 500원 (예시)',0,140,{s:32,w:900,c:'#fff'});});
      group(1400,470,1,0,P(lt,1.2,.3),()=>{panel(-380,-220,760,440,{bd:CB});text('일정 금액 이상 주문만',0,-150,{f:'D',s:46,c:CB,max:700});dmBag(0,40,.5);text('예시: 2만 원 이상',0,160,{s:32,w:900,c:'#fff'});});
      srcLine('방법은 예시 · 효과는 가게마다 다르다 · 서비스를 빼라는 권유 아님');});
  }},
  /* ── 만두 대신 1,000원 깎으면 ── */
  price:{draw(){
    sub('q1','q3',()=>{
      receipt(520,450,.95,[['주문','20,000'],['재료','−8,000'],['배달앱 26%','−5,200'],['만두 서비스','−1,000','#b8741f'],['한 건 남는 돈','5,800','#1a8a4a']],{title:'만두 서비스'});
      if(L('q2')>=0){const q=K('q2',0);receipt(1400,450,.95,[['주문 (1,000원 할인)','19,000'],['재료','−8,000'],['배달앱 26%','−4,940'],['만두','0'],['한 건 남는 돈',q>=0?'6,060':'?','#1a8a4a']],{title:'1,000원 할인',alpha:P(L('q2'),0,.3)});}
      const q3=K('q3',0);if(q3>=0)stampBox('한 달 96만 → 127만',960,820,q3,{s:46,c:CP,bg:'rgba(0,30,15,.92)'});else if(L('q3')>=0)pill('260원 차이 = 배달앱 26%가 할인에도 같이 줄어서',960,820,{s:32,bg:'rgba(255,255,255,.94)'});
      srcLine('19,000 × 0.26 = 4,940 · 6,060 × 1,200 − 600만 = 127만 2,000원 (python3) · 예시 가정');});
    sub('q4','q5',()=>{
      text('손님 눈에 보이는 것',960,170,{f:'D',s:56,c:C.gold});
      group(520,470,1,0,1,()=>{panel(-380,-230,760,460,{bd:'#9aa3b8'});text('2만 원 → 1만 9,000원',0,-120,{s:40,w:900,c:'#c9ced9'});text('−1,000원',0,0,{s:44,w:800,c:'#9aa3b8'});text('영수증 숫자 하나',0,140,{s:30,w:800,c:C.dim});});
      group(1400,470,1,0,P(L('q4'),.8,.3),()=>{panel(-380,-230,760,460,{bd:CM});dmBag(0,-30,.55,{label:''});for(let i=0;i<4;i++)dmDumpling(-150+i*100,40,.7,(i%2?.2:-.15));text('3,000원어치 만두',0,170,{f:'D',s:52,c:CM});});
      if(L('q5')>=0)stampBox('더 크게 보이는 1,000원 · 대신 빼기 어렵다',960,820,L('q5'),{s:42,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('예시 가정');});
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('서비스 넣기 전, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3),max:1800});
    const cards=[['k2','한 개 원가','만두 + 기름 + 용기까지','오늘: 1,000원'],['k3','한 달 건수 × 원가','한 번 넣으면 매달 나가는 돈','오늘: 120만 원'],['k4','몇 % 늘어야 본전','늘어난 주문으로 원가를 메우나','오늘: 17%'],
      ['k5','옆집이 따라 할 수 있나','따라 하면 비용만 남는다','광고 → 기본값'],['k6','뺄 때 몇 %까지 떠나도 되나','남는 돈 그대로 지키는 선','오늘: 14.7%']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-780,-290,1560,560,{bg:'rgba(6,13,32,1)',bd:C.gold});text('한 건 1만 5,000원 · 재료 6,000원 · 배달앱 26% · 서비스 500원',0,-210,{f:'D',s:40,max:1460});text('한 달 1,000건 · 고정비 400만 · 서비스 빼면 몇 %까지 줄어도 될까?',0,-145,{f:'D',s:40,max:1460});
      const b=L('k7b');
      if(b>=0)text('15,000 − 6,000 − 3,900 = 5,100 · 서비스 넣으면 4,600 · 4,600 ÷ 5,100 = 0.902',0,-45,{f:'D',s:40,alpha:P(b,0,.3),max:1460});
      const k=K('k7b',0);if(k>=0)text('9.8%',0,90,{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,90,{f:'D',s:120,c:C.gold});
      if(L('k7c')>=0)text('오늘 가게 14.7%보다 좁다 · 한 건 몫이 작을수록 빼기 어렵다',0,215,{s:36,w:900,c:'#6FD3FF',alpha:P(L('k7c'),0,.3),max:1460});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('동네 중국집 서비스 만두 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      dmShop(430,520,.75,{svc:1,alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['만두 원가','1,000원 × 1,200봉지 = 120만','#fff',b,.3],['첫 달 (주문 +20%)','216만 → 235만',CP,b,1.4],['옆집도 주자','216만 → 96만',C.red,b2,.3]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;group(1300,320+i*160,1,0,kk,()=>{panel(-520,-65,1040,130,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-470,4,{a:'left',f:'D',s:40,max:360});text(v,470,4,{a:'right',f:'D',s:48,c:col,max:600});});});
    }else{
      dmShop(480,480,.7,{svc:1});for(let i=0;i<4;i++)dmDumpling(1000+i*95,480+(i%2)*20,.8,(i%2?.2:-.15));drawMascot(1640,540,.55,'worry');
      stampBox('서비스 군만두 = 끊을 수 없는 월 고정비',960,790,c,{s:50,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      if(L('z4')>=0&&L('z4b')<0)pill('예시 가정 · 빼라는 권유·창업 권유 아님',1460,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-520,-70,1040,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 동네 중국집, 서비스로 뭘 넣어 주나요?',0,4,{s:40,w:900,c:C.ink,max:980});});
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

