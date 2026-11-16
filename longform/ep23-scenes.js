/* ════════════════════════════════════════════════════════════════════
   장면 (LF.23 동네 노래방 계산서 — 손님은 길 건너 고깃집에서 온다 · 매출 −21% → 남는 돈 −63% · 본전선 2차 손님 −48%) — 수치·출처는 docs/longform-ep23.md
   중심 그림: 매출 1,000만 원 = 만 원짜리 100장. 고정비 60장 · 손님 올 때만 나가는 돈 10장 · 사장님 몫 30장 (예시).
   같은 100장을 손님이 온 곳으로 칠하면 70장 = 2차 손님. 회식 −30% → 21장이 빠지고, 몫은 30장 → 11장.
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['7','9','0','0','0','0','0','×','0','.','9','−','6','0','0','0','0','0','0','='];   // 7,900,000 × 0.9 − 6,000,000 = 1,110,000 (0 개수: 7900000 은 다섯, 6000000 은 여섯)
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

/* 마이크 (그림) */
function nrMic(x,y,s,rot=0,o={}){group(x,y,s,rot,o.alpha??1,()=>{
  ctx.fillStyle='#2b2f3d';rr(-16,10,32,150,14);ctx.fill();ctx.fillStyle='#4a5068';rr(-20,0,40,30,8);ctx.fill();
  ctx.fillStyle='#c9ced9';ctx.beginPath();ctx.arc(0,-30,46,0,7);ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;for(let i=-2;i<=2;i++){line(i*16,-70,i*16,8);}line(-44,-30,44,-30);line(-36,-56,36,-56);line(-36,-4,36,-4);
});}
/* 동네 가게 한 칸 (상표 없음). o.name 간판 글자, o.col 간판색, o.dim 불 꺼짐, o.neon 노래방 네온 */
function nrShop(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,214,300,20,0,0,7);ctx.fill();
  ctx.fillStyle='#3b4258';rr(-260,-210,520,420,10);ctx.fill();
  ctx.fillStyle=o.dim?'#4a5068':(o.col||'#f3e6c8');rr(-260,-210,520,96,8);ctx.fill();
  if(o.neon&&!o.dim){ctx.save();ctx.shadowColor='#ff5fd2';ctx.shadowBlur=26;ctx.strokeStyle='#ff9be6';ctx.lineWidth=6;rr(-244,-198,488,72,10);ctx.stroke();ctx.restore();}
  text(o.name||'',0,-160,{f:'D',s:o.ns||52,c:o.dim?'#8a93a8':(o.tc||'#3a1f14'),max:480,glow:o.neon&&!o.dim?'rgba(255,95,210,.6)':null});
  if(o.dim){ctx.fillStyle='#1e2433';rr(-230,-90,460,270,6);ctx.fill();}
  else{ctx.save();ctx.shadowColor='rgba(255,224,140,.55)';ctx.shadowBlur=26;ctx.fillStyle=o.win||'#ffe9b8';rr(-230,-90,460,270,6);ctx.fill();ctx.restore();}
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-2,-90,4,270);
  if(o.time)group(0,250,1,0,1,()=>{ctx.fillStyle='rgba(6,13,32,.9)';rr(-110,-34,220,68,34);ctx.fill();text(o.time,0,3,{f:'D',s:38,c:C.gold});});
});}
/* 만 원짜리 100장 판: 10열 × 10줄. fn(i) → {col, al, dy, x} */
function nrBills(x0,y0,cw,fn){const ch=cw*.52;for(let i=0;i<100;i++){const st=fn(i);if(!st||st.al<=0)continue;const cx=x0+(i%10)*cw,cy=y0+Math.floor(i/10)*(ch+8)+(st.dy||0);ctx.save();ctx.globalAlpha*=st.al;ctx.fillStyle=st.col;rr(cx+3,cy,cw-6,ch,5);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=2;rr(cx+8,cy+5,cw-16,ch-10,3);ctx.stroke();if(st.x){ctx.strokeStyle='#fff';ctx.lineWidth=3;line(cx+10,cy+6,cx+cw-10,cy+ch-6);line(cx+cw-10,cy+6,cx+10,cy+ch-6);}ctx.restore();}}
const BF='#8a93a8', BV='#ffb36b', BP='#35E08A', B2='#ff6fae', BD='#6FD3FF';
/* 카테고리 색: 0~59 고정비 · 60~69 손님 올 때만 · 70~99 몫 */
function catCol(i){return i<60?BF:i<70?BV:BP;}
/* 방 10개 (5 × 2) — on(i) 이 참이면 불 켜짐 */
function nrRooms(x0,y0,s,on,o={}){for(let i=0;i<10;i++){const x=x0+(i%5)*130*s,y=y0+Math.floor(i/5)*150*s,lit=on(i);ctx.fillStyle=lit?'#ffd36b':'#2b3348';rr(x,y,110*s,130*s,10*s);ctx.fill();ctx.fillStyle=lit?'rgba(122,60,0,.5)':'rgba(255,255,255,.08)';rr(x+20*s,y+18*s,70*s,46*s,6*s);ctx.fill();text((i+1)+'번',x+55*s,y+100*s,{s:26*s,w:900,c:lit?'#5a3200':C.dim});}}
/* 사람 점 */
function nrDot(x,y,col,al=1,r=13){ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-r*1.6,r*.8,0,7);ctx.fill();rr(x-r,y-r*.6,r*2,r*2.2,r);ctx.fill();ctx.restore();}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o2')){
      const a=L('o1');
      nrShop(480,470,1.05*E.back(P(a,0,.5))+.001,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1});
      text('한 달 매출',1360,230,{f:'D',s:48,c:C.dim,alpha:P(a,.2,.3)});
      big('o1',0,1360,350,'−21%',{f:'D',s:130,c:'#ff9a9a'});
      text('사장님 손에 남는 돈',1360,520,{f:'D',s:48,c:C.dim,alpha:P(T,FR('o1',.5),.3)});
      big('o1',1,1360,650,'−63%',{f:'D',s:150,c:C.red,glow:'rgba(255,77,77,.45)'});
      srcLine('예시 가정 · 동네 노래방 한 곳의 한 달 계산');
    }else if(T<CT('o3b')){
      const b=L('o2'),c3=L('o3');
      nrShop(480,470,1.05,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1});
      if(c3<0){['방 10개 그대로','노래 기계 그대로','요금 그대로'].forEach((t,i)=>{const k=P(b,.2+i*.5,.3);if(k>0){pill(t,1360,300+i*150,{s:46,alpha:k,bg:'rgba(255,255,255,.92)'});}});}
      else{nrShop(1360,430,.8,{name:'고깃집',col:'#f3c58a',time:'길 건너'});
        if(K('o3',0)>=0)stampBox('손님을 데려가던 곳',1360,760,K('o3',0),{s:50,c:C.gold,bg:'rgba(40,30,0,.92)'});}
      srcLine('예시 가정 · 그림은 실제 가게가 아님');
    }else if(T<CT('o4')){
      const b=L('o3b');
      nrShop(330,470,.62,{name:'고깃집',col:'#f3c58a',time:'7시'});nrShop(960,470,.62,{name:'호프',col:'#ffd23f',time:'9시'});nrShop(1590,470,.62,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1,ns:44,time:'10시~'});
      arrowR(530,470,760,'#fff',9);arrowR(1160,470,1390,'#fff',9);
      text('손님은 어디서 오나 · 왜 세 배 빨리 줄어드나',960,180,{f:'D',s:52,c:C.gold,alpha:P(b,0,.3),max:1800});
    }else{
      const k9=L('o4'),k10=L('o5');
      text('남의 손님으로 장사하는 가게, 계약 전 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['노래방 수 · 국세청 (보도)','술자리 결제 · 카드사 (보도)','매출·비용 = 예시'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,380+i*580,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('동네 노래방 계산서',960,220,{f:'D',s:110,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('손님은 길 건너에서 온다 · 매출 −21% → 남는 돈 −63%',960,350,{s:48,w:900,alpha:P(a,.3,.3),max:1780});
    nrShop(560,680,.62,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1,alpha:P(a,.2,.3)});nrMic(1110,690,1.4,-.25,{alpha:P(a,.3,.3)});drawMascot(1550,690,.72,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 노래방 ── */
  setup:{draw(){
    sub('p1','p3b',()=>{
      const lit=L('p3')>=0;nrRooms(220,250,1.15,i=>!lit||i<6||(L('p3b')>=0&&Math.sin(R*2+i)>-.2));
      const q0=K('p2',0),q1=K('p2',1);
      if(L('p2')>=0){text('한 시간',1340,250,{f:'D',s:44,c:C.dim});text(q0>=0?'2만 원':'?',1340,340,{f:'D',s:86,c:q0>=0?'#fff':C.gold});
        text('한 달 매출',1340,470,{f:'D',s:44,c:C.dim});text(q1>=0?'1,000만 원':'?',1340,570,{f:'D',s:96,c:C.gold});}
      if(L('p3')>=0&&L('p3b')<0)pill('1,000만 ÷ 2만 = 500시간 · 방 10개 × 30일 → 하루 1시간 40분',960,760,{s:32,bg:'rgba(255,255,255,.92)',alpha:P(L('p3'),.1,.3)});
      if(L('p3b')>=0)pill('가장 붐비는 때: 저녁 먹은 뒤 밤 10시 전후 (예시)',960,760,{s:34,bg:'rgba(255,111,174,.95)',alpha:P(L('p3b'),.1,.3)});
      srcLine('예시 가정 · 방 10개 · 한 시간 2만 원 · 한 달 매출 1,000만 원');});
    sub('p4','p6',()=>{
      receipt(560,470,1,[['월세','200만'],['밤 카운터 알바','250만'],['전기·곡 사용료·관리','150만'],['= 고정비',K('p4',0)>=0?'600만':'?','#d62f2f']],{title:'손님이 없어도 나가는 돈'});
      if(L('p5')>=0){group(1380,330,1,0,P(L('p5'),0,.3),()=>{panel(-420,-110,840,220,{bd:BV});text('손님이 올 때만 나가는 돈',0,-50,{f:'D',s:40,c:C.dim});text('카드 수수료·음료',-380,40,{a:'left',s:34,w:900,c:'#ffd6ad'});text(K('p5',0)>=0?'매출의 10%':'?',380,40,{a:'right',f:'D',s:58,c:BV});});}
      if(L('p6')>=0){group(1380,620,1,0,P(L('p6'),0,.3),()=>{panel(-420,-120,840,240,{bd:BP,bg:'rgba(53,224,138,.08)'});text('1,000만 − 100만 − 600만',0,-55,{f:'D',s:40,c:C.dim});const q=K('p6',0);if(q>=0)popText(KT('p6',0),0,40,'사장님 몫 300만 원',{f:'D',s:68,c:BP});else text('?',0,40,{f:'D',s:68,c:C.gold});});}
      srcLine('예시 가정 · 보증금·세금 제외 · 곡 사용료는 노래 반주기 저작권 사용료 등');});
    sub('p7','p7',lt=>{
      text('손님 열 팀 중',960,170,{f:'D',s:56,c:C.gold});
      for(let i=0;i<10;i++){const x=330+i*140,two=i<7,k=P(lt,.2+i*.12,.25);nrDot(x,470,two?B2:BD,k,30);}
      text('일곱 팀 = 저녁 먹고 넘어온 2차 손님',700,640,{f:'D',s:46,c:B2,alpha:P(lt,1.3,.3)});
      text('세 팀 = 노래하러 온 손님',1560,640,{f:'D',s:40,c:BD,alpha:P(lt,1.6,.3)});
      srcLine('예시 가정 · 2차 손님 70%');});
  }},
  /* ── 만 원짜리 100장 ── */
  cut:{draw(){
    sub('s1','s2',()=>{text('매출 1,000만 원 = 만 원짜리 100장',960,165,{f:'D',s:56,c:C.gold});
      const q=K('s1',0),ls=L('s2');
      nrBills(440,230,96,i=>{const k=q<0?0:P(q,i*.008,.2);return{col:ls>=0&&T>FR('s2',.05)?catCol(i):'#7fbf8a',al:k};});
      if(ls>=0){[['고정비 60장',BF,FR('s2',.05)],['손님 올 때만 10장',BV,FR('s2',.35)],['사장님 몫 30장',BP,KT('s2',0)]].forEach(([t,col,t0],i)=>{const k=P(T,t0,.3);if(k>0){ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=col;rr(1470,300+i*130,40,40,8);ctx.fill();ctx.restore();text(t,1530,322+i*130,{a:'left',f:'D',s:40,c:col,alpha:k,max:330});}});}
      srcLine('예시 가정 · 한 장 = 만 원');});
    sub('s3','s5',()=>{text(L('s5')>=0?'고깃집 회식이 30% 줄면?':'같은 100장 · 손님이 어디서 왔나',960,165,{f:'D',s:56,c:L('s5')>=0?C.red:C.gold});
      const q=L('s4');
      nrBills(440,230,96,i=>({col:q<0?'#7fbf8a':(i<70?B2:BD),al:1}));
      if(q>=0){text('2차 손님 70장',1480,330,{a:'left',f:'D',s:42,c:B2,max:380});text('(고깃집·술집에서)',1480,390,{a:'left',s:30,w:900,c:'#ffc2dc',max:380});text('노래하러 온 손님 30장',1480,620,{a:'left',f:'D',s:38,c:BD,max:380});}
      if(L('s5')>=0)pill('몫 30장은 몇 장?',1660,760,{s:34,bg:'rgba(255,255,255,.94)',alpha:P(L('s5'),.2,.3)});
      srcLine('예시 가정 · 2차 손님 70%');});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='7,900,000 × 0.9 − 6,000,000 =';bigS='1,110,000';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:28,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:done?76:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('매출 790만 × 0.9 − 고정비 600만',1300,180,{f:'D',s:46,c:C.gold,alpha:P(a,.2,.3),max:1000});
    /* 100장 판: 21장 빠지고 → 몫 30장 → 11장 */
    const q2=K('c2',0),q4=K('c4',0);
    nrBills(900,240,80,i=>{
      if(q4>=0){if(i<60)return{col:BF,al:1};if(i<68)return{col:BV,al:1};if(i<79)return{col:BP,al:1};return{col:'rgba(255,77,77,.18)',al:1};}
      if(i>=79&&q2>=0){const k=E.io(P(q2,(i-79)*.03,.5));return{col:C.red,al:1-k*.85,dy:k*40,x:1};}
      return{col:catCol(i),al:1};});
    if(dt>=0&&L('c2')<0)group(1300,560,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(q2>=0&&L('c3')<0)popText(KT('c2',0),1300,795,'21장 = −210만 원 (매출 −21%)',{f:'D',s:50,c:C.red});
    if(L('c3')>=0&&q4<0)popText(CT('c3'),1300,795,'고정비 60장은 그대로',{f:'D',s:54,c:'#fff'});
    const q5=K('c4',1);if(q4>=0&&q5<0)popText(KT('c4',0),1300,795,'몫 30장 → 11장',{f:'D',s:60,c:BP});
    if(q5>=0)stampBox('몫 30장 → 11장 · 300만 → 111만 원 (−63%)',1300,795,q5,{s:46,c:C.gold,bg:'rgba(40,30,0,.92)'});
  }},
  /* ── 21%가 63%가 되는 이유 ── */
  lever1:{draw(){
    sub('l1','l1',lt=>{const X0=600;text('같은 손님 감소, 다른 크기',960,190,{f:'D',s:56,c:C.gold});
      text('매출',X0-30,380,{a:'right',f:'D',s:50});hbar(X0,380,1000,110,21*E.out(P(lt,.3,.6)),70,'#ff9a9a','−21%',{s:60});
      text('남는 돈',X0-30,560,{a:'right',f:'D',s:50});hbar(X0,560,1000,110,63*E.out(P(lt,.9,.8)),70,C.red,'−63%',{s:60});
      srcLine('예시 가정 · 300만 → 111만 · 1,000만 → 790만');});
    sub('l2','l3',()=>{
      group(420,420,1.1,-.05,1,()=>{ctx.fillStyle='#7fbf8a';rr(-170,-85,340,170,12);ctx.fill();ctx.strokeStyle='#3f7d4c';ctx.lineWidth=6;rr(-156,-71,312,142,8);ctx.stroke();text('10,000',0,-10,{f:'D',s:60,c:'#1f4a2a'});text('손님이 덜 쓴 돈',0,44,{s:26,w:900,c:'#1f4a2a'});});
      arrowR(660,420,860,'#fff',10);
      group(1250,300,1,0,1,()=>{panel(-360,-90,720,180,{bd:BV});text('음료·카드 수수료 덜 나감',0,-30,{s:32,w:900,c:'#ffd6ad'});text('+1,000원',0,36,{f:'D',s:56,c:BV});});
      group(1250,540,1,0,1,()=>{panel(-360,-110,720,220,{bd:C.red});text('사장님 몫에서 빠짐',0,-45,{s:34,w:900,c:'#ffb3b3'});const q=K('l2',0);if(q>=0)popText(KT('l2',0),0,40,'−9,000원',{f:'D',s:86,c:C.red});else text('?',0,40,{f:'D',s:86,c:C.gold});});
      if(L('l3')>=0){const q=K('l3',0);pill(q>=0?'빠진 매출 210만 × 0.9 = 남는 돈 −189만':'빠진 매출 210만 × 0.9 = ?',960,780,{s:40,bg:'rgba(255,255,255,.94)'});}
      srcLine('예시 가정 · 손님이 올 때만 나가는 돈 = 매출의 10%');});
    sub('l4','l4b',()=>{
      /* 지렛대: 받침점 가까이에 매출, 멀리 남는 돈 */
      const tilt=L('l4b')>=0?-.13*E.io(P(L('l4b'),.2,.8)):.13*E.io(P(L('l4'),.2,.8));
      group(960,520,1,0,1,()=>{ctx.fillStyle='#59627c';ctx.beginPath();ctx.moveTo(-60,120);ctx.lineTo(60,120);ctx.lineTo(0,10);ctx.closePath();ctx.fill();
        group(-300,0,1,tilt,1,()=>{ctx.fillStyle='#c9ced9';rr(-500,-12,1300,24,10);ctx.fill();
          ctx.fillStyle='#ff9a9a';rr(-60,-90,240,78,12);ctx.fill();text('매출',60,-50,{f:'D',s:40,c:'#3a1f14'});
          ctx.fillStyle=L('l4b')>=0?BP:C.red;rr(560,-110,240,98,12);ctx.fill();text('남는 돈',680,-60,{f:'D',s:44,c:'#fff'});});
        text('받침점 = 고정비 600만',0,170,{s:32,w:900,c:C.dim});});
      if(L('l4b')<0)text('고정비가 클수록 지렛대가 길다',960,180,{f:'D',s:52,c:C.gold});
      else{text('늘 때도 같은 지렛대',960,180,{f:'D',s:52,c:C.gold});const q=K('l4b',0);if(q>=0)popText(KT('l4b',0),1500,300,'1,210만 → 489만 원 (+63%)',{f:'D',s:46,c:BP});}
      srcLine('예시 가정 · 2차 손님 +30% → 매출 1,210만 × 0.9 − 600만 = 489만');});
    sub('l5','l7',()=>{
      text('2차 손님이 얼마나 줄면 남는 돈 0원?',960,165,{f:'D',s:52,c:C.gold});
      const X0=300,X1=1700,Y0=760,xm=d=>X0+d/60*(X1-X0),yv=v=>Y0-v/300*480;
      ctx.save();ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(X0,Y0,X1,Y0);line(X0,Y0,X0,yv(320));ctx.restore();
      [0,10,20,30,40,50,60].forEach(d=>text(d+'%',xm(d),Y0+32,{s:26,w:800,c:C.dim}));
      text('2차 손님 감소',X1,Y0+70,{a:'right',s:26,w:800,c:C.dim});
      const up=L('l6')>=0?60:30*E.out(P(L('l5'),.2,1));
      ctx.save();ctx.strokeStyle=BP;ctx.lineWidth=7;const pf=d=>1000*(1-.7*d/100)*.9-600;ctx.beginPath();ctx.moveTo(xm(0),yv(pf(0)));for(let d=0;d<=Math.min(up,47.6);d+=.5)ctx.lineTo(xm(d),yv(pf(d)));ctx.stroke();
      if(up>47.6){ctx.strokeStyle=C.red;ctx.beginPath();ctx.moveTo(xm(47.6),yv(0));for(let d=47.6;d<=up;d+=.5)ctx.lineTo(xm(d),yv(Math.max(-30,pf(d))));ctx.stroke();}ctx.restore();
      text('300만',xm(0)+20,yv(300)-30,{a:'left',f:'D',s:36,c:BP});
      ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(xm(30),yv(111),12,0,7);ctx.fill();text('30% → 111만',xm(30)+24,yv(111)-36,{a:'left',f:'D',s:34,c:C.gold});
      const q=K('l6',1);if(q>=0){ctx.fillStyle=C.red;ctx.beginPath();ctx.arc(xm(47.6),yv(0),16,0,7);ctx.fill();popText(KT('l6',1),xm(47.6),yv(0)-70,'48% → 0원',{f:'D',s:52,c:C.red});}
      const q0=K('l6',0);if(q0>=0&&L('l7')<0)pill('본전 매출 = 600만 ÷ 0.9 ≈ 667만',1300,300,{s:36,bg:'rgba(255,255,255,.94)'});
      if(L('l7')>=0)stampBox('남는 돈 = 길 건너 손님 수',1300,300,L('l7'),{s:48,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('(1,000만 − 666.7만) ÷ 700만 = 47.6% (python3) · 예시 가정');});
  }},
  /* ── 손님은 길 건너에서 온다 (어두운 장) ── */
  chain:{draw(){
    const xs=[330,960,1590],tm=['저녁 7시','밤 9시','10시~'];
    const shops=(al=1)=>{nrShop(xs[0],430,.62,{name:'고깃집',col:'#f3c58a',time:tm[0],alpha:al});nrShop(xs[1],430,.62,{name:'호프·술집',col:'#ffd23f',time:tm[1],alpha:al});nrShop(xs[2],430,.62,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1,ns:44,time:tm[2],alpha:al});};
    sub('h1','h3',()=>{shops();
      const h2=L('h2');
      if(h2>=0){const cyc=(R*.35)%1;for(let j=0;j<10;j++){const ph=(cyc+j/10)%1,x=lerp(xs[0],xs[2],ph),stage=ph<.5?0:1;const al=(stage===0||j%10<7)?1:0;if(j>=7&&ph>.5)continue;nrDot(x,690+((j%3)-1)*18,B2,al*P(h2,.3,.4),12);}
        arrowR(520,600,770,'rgba(255,255,255,.5)',6);arrowR(1150,600,1400,'rgba(255,255,255,.5)',6);
        const q=K('h2',0);if(q>=0)stampBox('노래방 = 줄의 끝',xs[2],180,q,{s:48,c:C.gold,bg:'rgba(40,30,0,.92)'});else text('1차 → 2차 → 노래방',960,180,{f:'D',s:52,c:C.gold});}
      if(L('h3')>=0)pill('앞 가게 손님이 줄면 → 내 손님도 준다 (나는 그대로인데)',960,800,{s:36,bg:'rgba(255,255,255,.94)',alpha:P(L('h3'),.1,.3)});
      srcLine('그림은 예시 · 시각은 예시');});
    sub('h4','h5',()=>{shops(.9);
      text('줄의 뒤로 갈수록 더 빠진다 (그림은 예시)',960,170,{f:'D',s:50,c:C.gold});
      const n=[10,6,4],m=[8,4,2],mk=L('h4');
      xs.forEach((x,si)=>{for(let j=0;j<n[si];j++){const gone=mk>=0&&j>=m[si];const k=gone?P(mk,.6+si*.5,.4):0;nrDot(x-((n[si]-1)*34)/2+j*34,720,gone?'#ff6b6b':B2,1-k*.75,13);}
        if(mk>=0){const lose=1-m[si]/n[si];text('−'+Math.round(lose*100)+'%',x,800,{f:'D',s:44,c:C.red,alpha:P(mk,.8+si*.5,.3)});}});
      if(L('h4b')>=0&&L('h5')<0)pill('줄의 끝은 몇 팀을 잃을지 고를 수 없다',960,250,{s:36,bg:'rgba(255,255,255,.94)',alpha:P(L('h4b'),.1,.3)});
      if(L('h5')>=0)stampBox('실제 카드 결제에서도',960,250,L('h5'),{s:48,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('점 개수는 설명용 예시 (10 → 8 · 6 → 4 · 4 → 2)');});
  }},
  /* ── 실제 숫자로 보면 ── */
  real:{draw(){
    sub('r1','r1b',()=>{text('일반 주점 카드 결제 · 2026년 상반기 vs 2023년 상반기',960,165,{f:'D',s:46,c:C.gold,max:1800});
      group(960,330,1,0,P(L('r1'),.1,.3),()=>{panel(-700,-90,1400,180,{bd:'rgba(255,255,255,.35)'});text('NH농협은행 · 개인 카드 고객 738만 명 · 결제 1억 2,700만 건',0,0,{f:'D',s:40,max:1340});});
      if(L('r1b')>=0){const q0=K('r1b',0),q1=K('r1b',1);
        [['이용 건수',q0,'−34%'],['이용 금액',q1,'−30%']].forEach(([l,q,v],i)=>{group(560+i*800,560,1,0,1,()=>{panel(-300,-110,600,220,{bd:C.red});text(l,0,-50,{f:'D',s:42,c:C.dim});if(q>=0)popText(T-q,0,40,v,{f:'D',s:90,c:C.red});else text('?',0,40,{f:'D',s:90,c:C.gold});});});
        if(T>FR('r1b',.45))pill('20대 −52% · 30대 −35% · 40대 −40% · 50대 −24% · 60대 이상 +9%',960,770,{s:32,bg:'rgba(255,255,255,.94)',alpha:P(T,FR('r1b',.45),.3)});}
      srcLine('NH농협은행 결제 데이터 분석 (인사이트 2026.9.8 「20대 술자리 3년 새 반토막… '+"'2차'"+'도 옛말」)');});
    sub('r2','r4',()=>{text('평일 주점 이용 건수 · 시간대별 (3년 전 대비)',960,165,{f:'D',s:48,c:C.gold});
      const bars=[['6~7시',29,'r2',0],['9~10시',35,'r3',0],['11~12시',40,'r3',1],['0~1시',42,'r3',2],['1시 이후',43,null,0]];
      const Y0=280,SC=8;
      bars.forEach(([l,v,id,j],i)=>{const x=360+i*300;text(l,x,Y0-50,{f:'D',s:38});
        const shown=id?K(id,j):(L('r4')>=0?L('r4'):-1);
        if(shown<0){text('?',x,Y0+90,{f:'D',s:60,c:C.gold});return;}
        const h=v*SC*E.out(P(shown,0,.6));ctx.fillStyle=i>=3?C.red:'#ff9a9a';rr(x-80,Y0,160,h,12);ctx.fill();text('−'+v+'%',x,Y0+h+42,{f:'D',s:46,c:i>=3?C.red:'#ff9a9a'});});
      if(L('r4')>=0)stampBox('늦을수록 더 줄었다 = 줄의 뒤쪽',960,780,L('r4'),{s:44,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('NH농협은행 (인사이트 2026.9.8) · 평일 기준 · 1시 이후 −43%');});
    sub('r5','r7',()=>{text('전국 노래방 수 (국세청 100대 생활업종)',960,165,{f:'D',s:50,c:C.gold});
      const X0=520,MX=38000;
      [['2016년',35000,'3만 5,000여','r5',0],['2020년',28758,'2만 8,758',null,0],['2024년 7월',25990,'2만 5,990','r5',1]].forEach(([l,v,lab,id,j],i)=>{const y=300+i*130;text(l,X0-30,y,{a:'right',f:'D',s:42});
        const q=id?K(id,j):(K('r5',0)>=0?K('r5',0)-.6:-1);if(q<0){text('?',X0+60,y,{f:'D',s:52,c:C.gold});return;}hbar(X0,y,900,80,v*E.out(P(q,0,.6)),MX,i===2?C.red:'#c9a0ff',lab,{s:44});});
      if(L('r6')>=0&&L('r7')<0)pill('"식사 후 2·3차에 찾던 노래방에 발길이 뜸해졌기 때문" (보도)',960,720,{s:32,bg:'rgba(255,255,255,.94)',alpha:P(L('r6'),.1,.3)});
      if(L('r7')>=0)group(960,720,1,0,P(L('r7'),0,.3),()=>{panel(-800,-80,1600,160,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.4)'});text('"저녁 회식하는 직장인들이 없으니 방 6개 중 1개도 찰까 말까"',0,-12,{f:'D',s:42,max:1540});text('— 서울 서초동 노래방 사장님 (중앙일보 2024.10.7)',0,48,{s:26,w:900,c:C.dim});});
      srcLine('국세청 100대 생활업종 통계 (중앙일보 2024.10.7 「"밥값도 비싼데 2차는 무슨"…전국 노래방 25% 사라졌다」)');});
    sub('r8','r8',()=>{text('2025년 주류 출고량',960,170,{f:'D',s:56,c:C.gold});
      big('r8',0,960,380,'299만 kL 아래',{f:'D',s:140,c:C.red,glow:'rgba(255,77,77,.4)'});
      if(T>FR('r8',.55))stampBox('1998년 뒤 처음 300만 kL 밑',960,620,T-FR('r8',.55),{s:50,c:C.gold,bg:'rgba(40,30,0,.9)'});
      if(T>FR('r8',.7))text('맥주 약 152만 kL (−7.2%) · 소주 79만 3,000kL',960,760,{s:34,w:900,c:C.dim,alpha:P(T,FR('r8',.7),.3)});
      srcLine('국세청 자료 (연합뉴스, Korea JoongAng Daily 2026.8.23)');});
    sub('r9','r9',()=>{text('2025년 2분기 매출 (1년 전 대비)',960,170,{f:'D',s:52,c:C.gold});
      [['술집','r9',0,9.2,'#ffb36b'],['예술·스포츠·여가 (노래방 포함)','r9',1,8.3,'#c9a0ff']].forEach(([l,id,j,v,col],i)=>{group(560+i*800,470,1,0,1,()=>{panel(-340,-200,680,400,{bd:col});text(l,0,-120,{f:'D',s:l.length>6?34:48,c:C.dim,max:620});const q=K(id,j);if(q>=0)popText(KT(id,j),0,20,'−'+v+'%',{f:'D',s:110,c:col});else text('?',0,20,{f:'D',s:110,c:C.gold});text(i?'뒤 가게':'앞 가게',0,140,{s:34,w:900,c:'#fff'});});});
      if(T>FR('r9',.75))stampBox('앞 가게와 뒤 가게가 같이 움직였다',960,800,T-FR('r9',.75),{s:44,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('한국신용데이터 「2025년 2분기 소상공인 동향」 (SBS Biz 2025.8.18)');});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    if(T<CT('g4')){
      text('회식 −30% · 2차 손님 비율만 바꾸면 (예시)',960,165,{f:'D',s:50,c:C.gold,max:1800});
      const X0=640,MX=330;
      const rows=[['2차 손님 5팀 / 10',165,'165만','g2',0,'#6FD3FF'],['7팀 / 10 (오늘)',111,'111만',null,0,C.gold],['9팀 / 10',57,'57만','g2',1,C.red]];
      text('남는 돈 (원래 300만)',X0,240,{a:'left',s:30,w:900,c:C.dim});
      rows.forEach(([l,v,lab,id,j,col],i)=>{const y=330+i*140;text(l,X0-30,y,{a:'right',f:'D',s:42,c:i===1?C.gold:'#fff'});
        if(id&&K(id,j)<0){text('?',X0+60,y,{f:'D',s:52,c:C.gold});return;}const k=id?E.out(P(K(id,j),0,.6)):1;hbar(X0,y,900,90,v*k,MX,col,lab,{s:50});});
      if(L('g3')>=0)pill('앞 가게에 기대는 비율이 클수록 더 크게 흔들린다',960,780,{s:36,bg:'rgba(255,255,255,.94)',alpha:P(L('g3'),.1,.3)});
      srcLine('1,000만 × (1 − 비율 × 0.3) × 0.9 − 600만 · 50% → 165만 · 90% → 57만 (python3)');
    }else{
      text('2차 손님 70% · 줄어드는 폭만 바꾸면 (예시)',960,165,{f:'D',s:50,c:C.gold,max:1800});
      const X0=640,MX=330;
      const rows=[['30% (오늘)',111,'111만',null,0,C.gold],['35% (밤 9시대처럼)',79.5,'79만 5,000','g4',0,'#ff9a9a'],['42% (자정 넘어처럼)',35.4,'35만','g5',0,C.red],['48% (본전선)',0,'0원',null,0,'#fff']];
      rows.forEach(([l,v,lab,id,j,col],i)=>{const y=270+i*125;text(l,X0-30,y,{a:'right',f:'D',s:40,c:i===0?C.gold:'#fff'});
        if(id&&K(id,j)<0){text('?',X0+60,y,{f:'D',s:52,c:C.gold});return;}if(i===3&&K('g5',0)<0)return;const k=id?E.out(P(K(id,j),0,.6)):1;hbar(X0,y,900,84,v*k,MX,col,lab,{s:48});});
      if(L('g6')>=0)pill('카드 자료 = 주점 이용 건수 · 노래방 손님이 꼭 그만큼 준다는 뜻은 아님',960,790,{s:32,bg:'rgba(111,211,255,.95)',alpha:P(L('g6'),.1,.3)});
      srcLine('1,000만 × (1 − 0.7 × 감소율) × 0.9 − 600만 · 35% → 79.5만 · 42% → 35.4만 (python3) · 감소율은 NH농협은행 주점 자료를 빌린 예시');
    }
  }},
  /* ── 내 손님을 직접 데려오려면 ── */
  own:{draw(){
    sub('d1','d3',()=>{
      if(L('d2')<0){nrShop(620,470,.9,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1});drawMascot(1360,500,.8,'think');return;}
      text('되찾을 남는 돈 189만 원',960,165,{f:'D',s:52,c:C.gold});
      const q0=K('d2',0),q1=K('d2',1),q2=K('d3',0);
      [['필요한 매출',q0,'210만 원','189만 ÷ 0.9','#fff'],['한 시간 2만 원이면',q1,'105시간','한 달','#6FD3FF'],['하루로 나누면',q2,'3시간 30분','방 10개 중 어딘가에서',BP]].forEach(([l,q,v,n,col],i)=>{group(360+i*600,470,1,0,1,()=>{panel(-270,-200,540,400,{bd:col});text(l,0,-120,{f:'D',s:40,c:C.dim});if(q>=0)popText(T-q,0,0,v,{f:'D',s:v.length>5?66:80,c:col});else text('?',0,0,{f:'D',s:80,c:C.gold});text(n,0,120,{s:30,w:900,c:C.dim});});if(i<2)arrowR(640+i*600,470,680+i*600,'#fff',6);});
      srcLine('189만 ÷ 0.9 = 210만 · 210만 ÷ 2만 = 105시간 · ÷ 30일 = 3.5시간 (예시)');});
    sub('d4','d6',()=>{
      if(L('d5')<0){text('2026년 상반기 노래방 결제 건수',960,165,{f:'D',s:50,c:C.gold});
        const q=K('d4',0),fr=q>=0?.577*E.out(P(q,0,.8)):0;
        ctx.fillStyle='rgba(255,255,255,.1)';ctx.beginPath();ctx.arc(600,500,230,0,7);ctx.fill();
        if(fr>0){ctx.fillStyle=BD;ctx.beginPath();ctx.moveTo(600,500);ctx.arc(600,500,230,-Math.PI/2,-Math.PI/2+fr*Math.PI*2);ctx.closePath();ctx.fill();}
        text(q>=0?'57.7%':'?',600,500,{f:'D',s:96,c:'#fff',st:8});text('20대',600,780,{f:'D',s:46,c:BD});
        if(T>FR('d4',.5)){group(1330,470,1,0,P(T,FR('d4',.5),.3),()=>{panel(-440,-160,880,320,{bd:'#ff9a9a'});text('20대 주점 이용',0,-80,{f:'D',s:44,c:C.dim});text('3년 새 −52%',0,10,{f:'D',s:80,c:'#ff9a9a'});text('그래도 노래방에선 절반 넘게',0,100,{s:34,w:900,c:'#b6e8ff'});});}
        srcLine('NH농협은행 (인사이트 2026.9.8) · 오락실·게임방 57.0% · 완구점 50.1%도 20대');}
      else{text('줄에서 벗어난 손님',960,165,{f:'D',s:56,c:C.gold});
        nrShop(960,460,.8,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1});
        [['낮 시간 요금',420,300],['혼자 오는 손님',420,560],['모임 예약',1500,430]].forEach(([t,x,y],i)=>{const k=L('d6')>=0?P(L('d6'),.2+i*.4,.3):0;if(k>0){pill(t,x,y,{s:40,alpha:k,bg:'rgba(111,211,255,.95)'});}});
        if(L('d6')<0)pill('처음부터 노래하러 오는 손님 = 이 계산의 출구',960,790,{s:38,bg:'rgba(255,255,255,.94)',alpha:P(L('d5'),.2,.3)});
        else stampBox('1차 가게와 상관없이 오는 손님 수',960,790,FR('d6',.75)<T?T-FR('d6',.75):-1,{s:44,c:C.gold,bg:'rgba(40,30,0,.92)'});
        srcLine('방법은 예시 · 효과는 가게마다 다르다');}
    });
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('남의 손님으로 장사하는 가게, 계약 전 숫자 5가지',960,170,{f:'D',s:54,c:C.gold,alpha:P(a,0,.3),max:1800});
    const cards=[['k2','내 손님이 어디서 오나','열 팀 중 몇 팀이 앞 가게를 거쳐 오나','오늘: 7팀'],['k3','앞 가게 업종의 흐름','고깃집·술집 손님이 느나, 주나','주점 이용 −34% (3년)'],['k4','고정비 비중','매출 100장 중 몇 장 = 지렛대 길이','오늘: 60장'],
      ['k5','만 원 덜 쓸 때 사라지는 몫','고정비는 그대로','오늘: 9,000원'],['k6','본전까지의 거리','2차 손님이 몇 % 줄면 0원','오늘: 48%']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-780,-290,1560,560,{bg:'rgba(6,13,32,1)',bd:C.gold});text('매출 800만 · 고정비 500만 · 올 때만 나가는 돈 10%',0,-210,{f:'D',s:42,max:1460});text('2차 손님 절반 · 2차 손님이 40% 줄면 남는 돈은?',0,-145,{f:'D',s:42,max:1460});
      const b=L('k7b');
      if(b>=0)text('800만 × 0.5 × 0.4 = 160만 → 640만 × 0.9 − 500만',0,-45,{f:'D',s:44,alpha:P(b,0,.3),max:1460});
      const k=K('k7b',0);if(k>=0)text('76만 원',0,90,{f:'D',s:120,c:C.red,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,90,{f:'D',s:120,c:C.gold});
      if(L('k7c')>=0)text('220만 → 76만 · 매출 −20% · 남는 돈 −65%',0,215,{s:38,w:900,c:'#6FD3FF',alpha:P(L('k7c'),0,.3),max:1460});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('동네 노래방 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      nrShop(430,520,.75,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1,alpha:P(a,0,.3)});
      const b=L('z2');
      if(b>=0){[['2차 손님','−30%','#fff'],['매출','−21%','#ff9a9a'],['남는 돈','300만 → 111만 (−63%)',C.red]].forEach(([l,v,col],i)=>{const kk=P(b,.3+i*.9,.3);if(kk<=0)return;group(1300,320+i*160,1,0,kk,()=>{panel(-520,-65,1040,130,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-470,4,{a:'left',f:'D',s:44,max:320});text(v,470,4,{a:'right',f:'D',s:v.length>8?46:62,c:col,max:620});});});}
      if(L('z2b')>=0)pill('줄의 끝 = 늦은 시간일수록 더 크게 빠지는 손님을 받아 낸다',960,800,{s:34,bg:'rgba(255,255,255,.94)',alpha:P(L('z2b'),.1,.3)});
    }else{
      nrShop(420,480,.62,{name:'고깃집',col:'#f3c58a'});arrowR(640,480,880,'#fff',9);nrShop(1100,480,.62,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1,ns:44});drawMascot(1640,540,.55,'happy');
      stampBox('노래방 매출 = 길 건너 고깃집 회식',960,790,c,{s:52,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      if(L('z4')>=0&&L('z4b')<0)pill('예시 가정 · 창업 권유 아님',1560,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-520,-70,1040,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 동네 노래방, 몇 시에 가장 붐비나요?',0,4,{s:40,w:900,c:C.ink,max:980});});
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
