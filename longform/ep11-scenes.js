/* ════════════════════════════════════════════════════════════════════
   장면 (LF.11 동네 꽃집 계산서) — 수치·출처는 docs/longform-ep11.md
   중심 그림: 5만 원 꽃다발 = 꽃 열 송이(한 송이 5,000원). 왼쪽부터 꽃값·포장·월세·전기·잡비가 송이를 칠하고
   오른쪽 끝 8,333원이 사장님 몫. 반전은 '버린 꽃값' — 열 송이 다발에 열네 송이를 사 오고, 버린 꽃이 사장님 몫보다 크다.
   ════════════════════════════════════════════════════════════════════ */
const LY=[ // 5만 원에서 칠하는 순서 (원, 한 달 120다발 기준)
  {k:'mat',name:'꽃값',v:20000,col:'#E8A33A'},
  {k:'pack',name:'포장',v:3333,col:'#c08cff'},
  {k:'rent',name:'월세',v:12500,col:'#2ec4b6'},
  {k:'elec',name:'전기',v:2500,col:'#6FD3FF'},
  {k:'etc',name:'잡비',v:3333,col:'#9aa4b8'},
  {k:'own',name:'사장님 몫',v:8333,col:'#35E08A'},
];
const LYK=Object.fromEntries(LY.map(s=>[s.k,s]));
const SEQ=['2','4','0','÷','0','.','7','='];   // 판 꽃 240만 ÷ 0.7 = 342.857 (만 단위로 누름, 0 개수: 240 = 2·4·0)
const FLC=['#ff5d8f','#ffb3c7','#ff9f1a','#f4f0f6','#e8343f','#c08cff','#ffd23f','#ff7aa8','#ffffff','#ff8a5c','#f7a1c4','#e05c8a','#ffe08a','#d68cff'];
function layT(k){return {mat:KT('s1',0),pack:KT('s2',0),rent:KT('s3',0),elec:KT('s4',0),etc:KT('s5',0),own:KT('s6',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}

/* 꽃 한 송이 (위에서 본 모양) */
function flower(x,y,r,col='#ff5d8f',alpha=1,o={}){if(alpha<=0)return;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);
  if(o.wilt){ctx.globalAlpha*=.75;col='#8a6f5a';}
  ctx.fillStyle=col;for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.ellipse(Math.cos(a)*r*.5,Math.sin(a)*r*.5,r*.48,r*.36,a,0,7);ctx.fill();}
  ctx.fillStyle='rgba(0,0,0,.12)';for(let i=0;i<6;i++){const a=i*Math.PI/3+.5;ctx.beginPath();ctx.ellipse(Math.cos(a)*r*.28,Math.sin(a)*r*.28,r*.26,r*.18,a,0,7);ctx.fill();}
  ctx.fillStyle=o.wilt?'#5e4a3a':'#ffcf3f';ctx.beginPath();ctx.arc(0,0,r*.26,0,7);ctx.fill();ctx.restore();}
/* 줄기 달린 꽃 (옆에서) */
function stemFlower(x,y,h,r,col,alpha=1,rot=0,wilt=0){if(alpha<=0)return;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle='#4f9a52';ctx.lineWidth=Math.max(3,r*.18);line(0,0,0,-h);
  ctx.fillStyle='#4f9a52';ctx.beginPath();ctx.ellipse(r*.35,-h*.45,r*.4,r*.16,-.6,0,7);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);flower(0,-h,r,col,alpha,{wilt});ctx.restore();}
/* 꽃다발 (포장지 + 꽃 열 송이 + 리본) */
function bouquet(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const n=o.n??10;
  for(let i=0;i<n;i++){const a=-.55+i*(1.1/Math.max(1,9)),h=250+rnd(i+3)*60;stemFlower(0,120,h,46,FLC[i%FLC.length],1,a);}
  ctx.fillStyle='#c9a274';ctx.beginPath();ctx.moveTo(-190,-30);ctx.lineTo(190,-30);ctx.lineTo(40,300);ctx.lineTo(-40,300);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.moveTo(-190,-30);ctx.lineTo(-40,-30);ctx.lineTo(-10,300);ctx.lineTo(-40,300);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ff4d7a';rr(-60,150,120,34,10);ctx.fill();ctx.beginPath();ctx.ellipse(-60,180,40,20,.6,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(60,180,40,20,-.6,0,7);ctx.fill();
});}
/* 쓰레기통. fill: 0~1 차오른 버린 꽃 */
function trashCan(x,y,s,fill=0,alpha=1){group(x,y,s,0,alpha,()=>{
  const n=Math.round(fill*9);for(let i=0;i<n;i++)stemFlower(-80+i*20,-90,60+rnd(i)*70,30,FLC[(i+4)%FLC.length],1,-.7+rnd(i+9)*1.4,1);
  ctx.fillStyle='#5b6275';ctx.beginPath();ctx.moveTo(-130,-90);ctx.lineTo(130,-90);ctx.lineTo(105,170);ctx.lineTo(-105,170);ctx.closePath();ctx.fill();
  ctx.fillStyle='#7d869c';rr(-150,-115,300,34,10);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=6;for(let i=-1;i<=1;i++)line(i*55,-60,i*45,145);
});}
/* 동네 꽃집 외관 (상표 없음). o.closed: 셔터 */
function shopFront(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='#2f3b35';rr(-400,-300,800,560,18);ctx.fill();
  ctx.fillStyle='#3fa36b';rr(-400,-300,800,120,14);ctx.fill();for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#3fa36b':'#f4f0f6';ctx.beginPath();ctx.moveTo(-400+i*100,-180);ctx.lineTo(-300+i*100,-180);ctx.lineTo(-350+i*100,-140);ctx.closePath();ctx.fill();}
  text('동네 꽃집',0,-238,{f:'D',s:72,c:'#fff'});
  if(o.closed){ctx.fillStyle='#8e98ad';rr(-370,-130,740,370,8);ctx.fill();ctx.strokeStyle='#6c768b';ctx.lineWidth=4;for(let i=0;i<11;i++)line(-370,-100+i*32,370,-100+i*32);return;}
  const g=ctx.createLinearGradient(0,-130,0,240);g.addColorStop(0,'#eaf6ef');g.addColorStop(1,'#bfe3cf');ctx.fillStyle=g;rr(-370,-130,740,370,10);ctx.fill();
  for(let b=0;b<4;b++){const bx=-270+b*180;for(let i=0;i<5;i++)stemFlower(bx-40+i*20,150,90+rnd(b*7+i)*60,24,FLC[(b*3+i)%FLC.length],1,-.3+i*.15);ctx.fillStyle='#9aa4b8';rr(bx-60,140,120,90,12);ctx.fill();}
});}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o2')){
      bouquet(560,420,1.15*E.back(P(a,0,.4))+.001);
      group(1400,320,1,-.03,1,()=>{panel(-330,-140,660,280,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('졸업식 꽃다발 하나',0,-70,{s:40,w:900,c:C.dim});text('5만 원',0,30,{f:'D',s:130,c:C.gold});});
      text('하루 네 다발 × 30일',1400,560,{s:44,w:900,alpha:P(T,FR('o1',.55),.3)});text('= 한 달 매출 600만 원',1400,630,{f:'D',s:56,alpha:P(T,FR('o1',.75),.3)});
    }else if(T<CT('o3')){
      const b=L('o2');
      text('예시 꽃집이 한 달 남기는 돈',760,240,{f:'D',s:60,c:C.dim,alpha:P(b,0,.3)});
      big('o2',0,760,430,'+100만 원',{f:'D',s:180,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('o2',.62))pill('많진 않아도 남는 장사',760,640,{s:42,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('o2',.62),.3)});
      drawMascot(1600,540,.9,'happy',{alpha:P(b,.3,.3)});
    }else if(T<CT('o4')){
      const b=L('o3');
      bouquet(620,430,.9);drawMascot(1450,500,.95,'think',{alpha:P(b,0,.3)});
      group(1450,180,E.back(P(b,.2,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-380,-60,760,120,30);ctx.fill();text('사 온 꽃은 다 팔리겠지?',0,4,{s:44,w:900,c:C.ink});});
    }else if(T<CT('o5')){
      const b=L('o4');
      text('같은 꽃집 · 사 온 꽃 열 송이 중 세 송이를 버리면',960,180,{f:'D',s:52,c:C.dim,alpha:P(b,0,.3),max:1800});
      for(let i=0;i<10;i++){const thrown=i>=7,k=thrown?P(T,FR('o4',.45)+i*.12-.84,.5):0;const x0=330+i*95,y0=330;
        flower(lerp(x0,1500+(i-7)*60,E.io(k)),lerp(y0,520,E.io(k))-Math.sin(k*Math.PI)*120,40,FLC[i],P(b,i*.05,.2),{wilt:k>.7});}
      trashCan(1560,640,.8,P(T,FR('o4',.6),.6));
      text('한 달',600,600,{f:'D',s:56,c:C.dim});big('o4',0,600,720,'−3만 원',{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.4)'});
      if(L('o4b')>=0){const q=K('o4b',0);pill(q>=0?'버린 꽃 103만 원 > 사장님 몫 100만 원':'버린 꽃 ? > 사장님 몫 100만 원',960,840,{s:38,bg:'rgba(255,255,255,.95)',alpha:P(L('o4b'),0,.3)});}
    }else if(T<CT('o6')){
      const b=L('o5');
      text('꽃집 원가 계산에 빠진 것',760,260,{f:'D',s:76,c:C.dim,alpha:P(b,0,.3)});text('버린 꽃',760,450,{f:'D',s:200,c:C.red,alpha:P(b,.4,.3),glow:'rgba(255,77,77,.4)'});
      trashCan(760,720,.55,1,P(b,.8,.3));drawMascot(1580,520,1.0,'worry',{alpha:P(b,0,.3)});
    }else{
      const k9=L('o6'),k10=L('o7');
      text('꽃집 차리기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:80,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['화훼 경매 자료 (aT)','언론 보도','가게 숫자 = 예시 가정'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,480+i*480,760,{s:34,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('동네 꽃집 계산서',960,250,{f:'D',s:150,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1700});
    text('남는 장사가 왜 0원이 됐나',960,400,{s:56,w:900,alpha:P(a,.3,.3)});
    shopFront(700,720,.55,{alpha:P(a,.2,.3)});drawMascot(1300,720,.85,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p2b',()=>{shopFront(560,500,.85);
      if(L('p2')>=0){text('주택가 1층 · 8평',1380,300,{f:'D',s:60,c:C.gold});
        ['새벽에 꽃 사 오기','다발 만들기','가게 지키기'].forEach((s,i)=>pill(s,1380,420+i*100,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p2',.4+i*.15),.3)}));
        text('사장님 혼자 · 예시 가정',1380,700,{s:36,w:900,c:C.dim,alpha:P(L('p2'),1,.3)});}
      if(L('p2b')>=0){group(960,800,1,0,P(L('p2b'),0,.3),()=>{panel(-760,-55,1520,110,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('한국화원협회장: "화훼 산업은 2만 명이 넘는 소상공인의 생계 기반"',0,4,{s:34,w:900,max:1460});});srcLine('아시아경제 2026.1.15',890);}});
    sub('p3','p3',()=>{bouquet(560,430,1);text('대표 상품 꽃다발',1380,300,{f:'D',s:56,c:C.gold});big('p3',0,1380,460,'5만 원',{f:'D',s:150});
      if(T>FR('p3',.5))pill('보도 속 손님: "꽃다발 4만~5만 원"',1380,640,{s:36,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p3',.5),.3)});
      srcLine('한국경제 2026.5.12 「카네이션 문화 시들어간다」 · 가게 숫자는 예시 가정');});
    sub('p4','p4',()=>{text('예시 꽃집 한 달',960,190,{f:'D',s:60,c:C.gold});
      text('하루 4다발 × 30일',600,370,{f:'D',s:56,c:C.dim});text('120다발',600,500,{f:'D',s:140});
      text('120 × 5만 원',1340,370,{s:44,w:900,c:C.dim});big('p4',0,1340,500,'600만 원',{f:'D',s:130,c:C.gold});
      pill('세금 제외',960,700,{s:36,alpha:P(T,FR('p4',.8),.3),bg:'rgba(255,255,255,.92)'});});
    sub('p5','p5',lt=>{const R=lerp(56,74,E.out(P(lt,0,.6)));for(let i=0;i<10;i++){const x=960-9*R*1.1+i*R*2.2;flower(x,380,R,FLC[i]);text('5,000원',x,500,{f:'D',s:30,alpha:P(lt,1.6+i*.12,.3)});}
      text('5만 원 꽃다발 = 꽃 열 송이',960,680,{f:'D',s:66,c:C.gold,alpha:P(lt,.8,.4)});});
  }},
  /* ── 5만 원 꽃다발 쪼개기 ── */
  cut:{draw(){
    const CX=960,cy=250,R=80,x0=CX-10*R,x1=CX+10*R;
    for(let i=0;i<10;i++)flower(x0+R+i*2*R,cy,R*.96,'#f4f0f6');
    ctx.save();ctx.beginPath();for(let i=0;i<10;i++){ctx.moveTo(x0+R+i*2*R+R,cy);ctx.arc(x0+R+i*2*R,cy,R*.98,0,7);}ctx.clip();
    let acc=0;const labs=[];
    LY.forEach(s=>{const t=T-layT(s.k);const w=s.v/50000*(x1-x0);if(t>=0){const f=E.out(P(t,0,.7));ctx.fillStyle=s.col;ctx.globalAlpha=.8;ctx.fillRect(x0+acc,cy-R,w*f,2*R);ctx.globalAlpha=1;if(f>.3)labs.push({s,xm:x0+acc+w/2,al:P(t,0,.3)});}acc+=w;});
    ctx.restore();
    for(let i=0;i<10;i++){ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x0+R+i*2*R,cy,R*.98,0,7);ctx.stroke();}
    labs.forEach(({s,xm,al})=>{const i=LY.indexOf(s),y=cy+R+56+(i%2)*92;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=s.col;ctx.lineWidth=3;line(xm,cy+R-4,xm,y-36);ctx.restore();
      text(s.name,xm,y-12,{s:28,w:900,c:s.col,alpha:al});text(won(s.v)+'원',xm,y+28,{f:'D',s:34,c:s.k==='own'?C.green:'#fff',alpha:al});});
    const Y=740;
    sub('s1','s1',()=>{text('첫 번째: 꽃값',CX,Y-90,{f:'D',s:54,c:LYK.mat.col});text('다발에 들어간 꽃의 도매값 = 매출의 40% (예시)',CX,Y-10,{s:36,w:900,max:1400});popText(KT('s1',0),CX-120,Y+75,'2만 원',{f:'D',s:80,c:LYK.mat.col});text('= 네 송이 몫',CX+200,Y+75,{s:40,w:900,alpha:P(T,FR('s1',.85),.3)});});
    sub('s2','s2',()=>{text('두 번째: 포장지 · 리본',CX,Y-90,{f:'D',s:54,c:LYK.pack.col});text('한 달 40만 ÷ 120다발 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s2',0),CX,Y+75,'3,333원',{f:'D',s:80,c:LYK.pack.col});});
    sub('s3','s3',()=>{text('세 번째: 월세',CX,Y-90,{f:'D',s:54,c:LYK.rent.col});text('한 달 150만 ÷ 120다발 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s3',0),CX-120,Y+75,'1만 2,500원',{f:'D',s:76,c:LYK.rent.col});text('= 두 송이 반',CX+260,Y+75,{s:40,w:900,alpha:P(T,FR('s3',.85),.3)});});
    sub('s4','s4',()=>{text('네 번째: 꽃 냉장고 전기료',CX,Y-90,{f:'D',s:54,c:LYK.elec.col});text('하루 종일 돌리는 냉장고 · 한 달 30만 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s4',0),CX,Y+75,'2,500원',{f:'D',s:80,c:LYK.elec.col});});
    sub('s5','s5',()=>{text('다섯 번째: 카드 수수료 · 잡비',CX,Y-90,{f:'D',s:54,c:LYK.etc.col});text('한 달 40만 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s5',0),CX,Y+75,'3,333원',{f:'D',s:80,c:'#fff'});});
    sub('s6','s6',()=>{text('50,000 − 20,000 − 3,333 − 12,500 − 2,500 − 3,333',CX,Y-90,{f:'D',s:42,c:C.dim});text('사장님 몫',CX-270,Y+20,{f:'D',s:56,c:C.green});big('s6',0,CX+140,Y+20,'8,333원',{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('s6',.7))text('열 송이 중 한 송이 반을 조금 넘는다',CX,Y+112,{s:36,w:900,alpha:P(T,FR('s6',.7),.3)});});
    sub('s7','s7b',()=>{text('한 달 (120다발)',CX-420,Y-60,{f:'D',s:44,c:C.dim});big('s7',0,CX-420,Y+40,'100만 원',{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)'});
      text('하루 10시간 × 30일 = 300시간',CX+400,Y-60,{s:36,w:900,c:C.dim,alpha:P(T,FR('s7',.55),.3)});text('시급 3,333원',CX+400,Y+20,{f:'D',s:72,c:C.gold,alpha:P(T,FR('s7',.75),.3)});
      if(L('s7b')>=0)text('최저시급 1만 320원 × 300시간 ≈ 310만 원의 3분의 1도 안 된다',CX+170,Y+110,{s:32,w:900,c:'#ffb3b3',alpha:P(L('s7b'),0,.3),max:1300});
      if(L('s7b')<0)srcLine('2026년 최저시급 10,320원 (최저임금위원회 고시)');});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('÷'),done=typed.endsWith('=');
    let small='',bigS='0';if(done){small=`${n1} ÷ ${n2.replace('=','')} =`;bigS='342.857';}else if(n2!==undefined){small=`${n1} ÷`;bigS=n2||n1;}else if(n1)bigS=n1;
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:done?96:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('다발에 들어간 꽃 240만 원어치',1350,250,{f:'D',s:54,c:C.gold,alpha:P(a,.2,.3),max:1000});text('÷ 0.7 (열 송이 사서 일곱 송이만 판다면)',1350,345,{s:38,w:900,alpha:P(a,.4,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{const c2=L('c2');group(1350,520,1,0,P(c2,0,.3),()=>{panel(-470,-80,940,160,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('숨은 가정',0,-30,{s:36,w:900,c:'#ffb3b3'});text('사 온 꽃은 한 송이도 안 버린다',0,32,{f:'D',s:50,c:C.gold,max:900});});
        const q=K('c3',0);if(L('c3')>=0)group(1350,700,lerp(1.5,1,E.out(P(Math.max(0,q),0,.3))),0,1,()=>text(q>=0?'사 와야 할 꽃 343만 원':'사 와야 할 꽃 ?',0,0,{f:'D',s:72,c:C.red,glow:'rgba(255,77,77,.4)',max:1000}));
        if(L('c3b')>=0)stampBox('꽃집에선 매일 깨진다',1350,840,T-CT('c3b'),{s:44,c:C.red,bg:'rgba(40,0,0,.9)'});}}
    if(dt>=0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 버린 꽃값 (반전) ── */
  waste:{draw(){
    sub('w1','w1',lt=>{text('버린 꽃은 얼마어치일까?',960,180,{f:'D',s:80,c:C.gold});bouquet(560,520,.85);trashCan(1380,600,1,P(lt,1,1.2));
      text('?',1380,330,{f:'D',s:140,c:C.red,alpha:P(lt,.6,.3)});});
    sub('w2','w3',()=>{text('예시 꽃집 한 달 (사 온 꽃의 30%를 버리면)',960,170,{f:'D',s:52,c:C.gold,max:1800});
      const X0=560,SC=3.2;
      text('사 온 꽃',X0-30,320,{a:'right',f:'D',s:54});const k1=E.out(P(L('w2'),.2,.6));ctx.fillStyle='rgba(255,255,255,.07)';rr(X0,270,1200,100,30);ctx.fill();
      ctx.fillStyle=LYK.mat.col;rr(X0,270,240*SC*k1,100,30);ctx.fill();const q=K('w2',0);
      if(q>=0){const k=E.out(P(q,0,.6));ctx.fillStyle=C.red;rr(X0+240*SC,270,103*SC*k,100,20);ctx.fill();text('버린 꽃 103만',X0+240*SC+103*SC*k/2,320,{f:'D',s:40,c:'#fff',alpha:k,max:330});}
      text('343만',X0+343*SC+20,320,{a:'left',f:'D',s:50,c:C.gold,alpha:P(L('w2'),.6,.3)});
      text('판 꽃 240만',X0+120*SC,410,{s:32,w:900,c:LYK.mat.col,alpha:P(L('w2'),.6,.3)});
      if(L('w3')>=0){const b=L('w3');text('버린 꽃',X0-30,560,{a:'right',f:'D',s:50,c:C.red});hbar(X0,560,1100,80,103,120,C.red,'103만',{s:50,k:E.out(P(b,0,.5))});
        text('사장님 몫',X0-30,660,{a:'right',f:'D',s:50,c:C.green});hbar(X0,660,1100,80,100,120,C.green,'100만',{s:50,k:E.out(P(b,.3,.5))});
        const r=K('w3',0);group(960,800,1,0,1,()=>{text('한 달 남는 돈: 100만 →',-180,0,{f:'D',s:56,c:C.dim});if(r>=0)popText(KT('w3',0),330,0,'−3만 원',{f:'D',s:90,c:C.red});else text('?',300,0,{f:'D',s:90,c:C.gold});});}});
    sub('w4','w5b',()=>{text('열 송이 다발 하나를 만들려면',960,170,{f:'D',s:56,c:C.gold});
      const q=K('w4',0);for(let i=0;i<14;i++){const thrown=i>=10,x=210+i*112,y=330,k=thrown&&q>=0?E.io(P(q,.4+(i-10)*.2,.6)):0;
        flower(lerp(x,1480+(i-10)*60,k),lerp(y,560,k)-Math.sin(k*Math.PI)*90,44,FLC[i%FLC.length],q>=0||i<10?1:0,{wilt:k>.7});
}
      if(q>=0){ctx.save();ctx.strokeStyle=C.green;ctx.lineWidth=5;ctx.setLineDash([12,8]);rr(150,260,1120,140,24);ctx.stroke();ctx.restore();text('다발에 들어간 열 송이',710,440,{s:34,w:900,c:C.green});popText(KT('w4',0),1540,240,'열네 송이 남짓을 사 온다',{f:'D',s:46,c:C.gold});}
      trashCan(1560,690,.7,q>=0?P(q,.6,1):0);text('네 송이 넘게 버림',1560,840,{s:32,w:900,c:C.red,alpha:q>=0?P(q,1.2,.3):0});
      if(L('w5')>=0){const k=K('w5',0);text('다발 하나에 버린 꽃값',500,620,{f:'D',s:44,c:C.dim});big('w5',0,500,710,'8,571원',{f:'D',s:96,c:C.red});
        text('사장님 몫 8,333원',1000,620,{f:'D',s:40,c:C.green,alpha:P(T,FR('w5',.55),.3)});text('+238원',1000,700,{f:'D',s:60,c:C.red,alpha:P(T,FR('w5',.75),.3)});}
      if(L('w5b')>=0)pill('손님은 열 송이 값 · 사장님은 열네 송이 값을 먼저 낸다',960,820,{s:34,bg:'rgba(255,255,255,.95)',alpha:P(L('w5b'),0,.3)});});
    sub('w6','w6',()=>{bouquet(560,470,.8);text('→',960,470,{f:'D',s:120,c:C.dim});trashCan(1360,520,1,1);
      stampBox('팔 때마다 내 몫이 쓰레기통으로',960,790,T-CT('w6')-.2,{s:64,c:C.red,bg:'rgba(40,0,0,.88)'});});
    sub('w7','w7',()=>{text('버리는 비율에 따라 한 달 남는 돈 (예시)',960,170,{f:'D',s:52,c:C.gold});
      const base=620,SC=3.4,D=[['안 버림',100,'0%'],['열 송이 중 한 송이',73,'10%'],['두 송이',40,'20%'],['세 송이',-3,'30%']];
      ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;line(260,base,1660,base);text('0',240,base,{a:'right',s:28,w:900,c:C.dim});
      D.forEach(([l,v,p],i)=>{const x=420+i*380,t=i===0?CT('w7')+.3:i===1?FR('w7',.15):i===2?KT('w7',0):FR('w7',.62),k=E.out(P(T,t,.5));if(T<t-.2)return;
        const h=Math.abs(v)*SC*k;vCash(x-90,v>=0?base-h:base,180,h,v>=0?C.green:C.red);text((v>=0?'+':'−')+Math.abs(v)+'만',x,v>=0?base-h-40:base+h+44,{f:'D',s:54,c:v>=0?'#fff':C.red,alpha:k});
        text(p,x,base+110,{f:'D',s:44,c:C.gold});text(l,x,base+160,{s:28,w:900,c:C.dim});});
      [['−27만',FR('w7',.72)],['−33만',FR('w7',.8)],['−43만',FR('w7',.88)]].forEach(([s,t],i)=>popText(t,610+i*380,300,s,{f:'D',s:44,c:C.red}));
      if(T>FR('w7',.72))text('한 송이 늘 때마다 빠지는 돈이 커진다',960,230,{s:34,w:900,alpha:P(T,FR('w7',.72),.3)});});
    sub('w8','w8',()=>{group(960,420,1,0,1,()=>{panel(-700,-170,1400,340,{bd:C.gold,bg:'rgba(255,197,49,.06)',lw:5});text('버리는 비율 30% = 예시 가정',0,-70,{f:'D',s:70,c:C.gold});
      text('꽃집 폐기율을 따로 집계한 공식 통계는 찾지 못했다',0,50,{s:40,w:900});});drawMascot(1700,760,.5,'think');});
  }},
  /* ── 왜 버려지나 ── */
  why:{draw(){
    sub('q1','q1',()=>{emoji('🥀',620,480,300);text('꽃은 왜 버려질까?',1340,480,{f:'D',s:90,c:C.gold});});
    sub('q2','q2b',()=>{text('한 주 동안 (그림 예시)',960,170,{f:'D',s:52,c:C.gold});
      const D=['월','화','수','목','금','토','일'],V=[50,45,55,60,120,140,70],buy=80,base=620,SC=2.6;
      D.forEach((d,i)=>{const x=420+i*180,k=E.out(P(L('q2'),.2+i*.12,.4));vCash(x-60,base-V[i]*SC*k,120,V[i]*SC*k,V[i]>buy?C.gold:'#4fb6ff');
        if(V[i]<buy&&k>.9){ctx.fillStyle='rgba(255,77,77,.45)';rr(x-60,base-buy*SC,120,(buy-V[i])*SC,10);ctx.fill();}text(d,x,base+40,{s:34,w:900});});
      dashedH(320,1620,base-buy*SC,'#fff',4);text('매일 사 오는 꽃',1640,base-buy*SC-30,{a:'right',s:30,w:900});
      if(T>FR('q2',.55)){pill('대목엔 모자라고',1360,260,{s:34,bg:C.gold,alpha:P(T,FR('q2',.55),.3)});pill('평일엔 남는다 (빨강)',640,320,{s:34,bg:'rgba(255,120,120,.95)',alpha:P(T,FR('q2',.75),.3)});}
      if(L('q2b')>=0)['그날 못 판 꽃','다음 날 다발에 섞기','결국 버림'].forEach((s,i)=>pill(s,520+i*440,780,{s:36,bg:i===2?C.red:'rgba(255,255,255,.92)',c:i===2?'#fff':C.ink,alpha:P(L('q2b'),.3+i*.6,.3)}));});
    sub('q3','q4',()=>{text('양재동 화훼공판장 카네이션 경매량 (5월 1~13일)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const X0=520;[['2025년',40371,'#4fb6ff',CT('q3')+.4],['2026년',32832,C.red,KT('q3',0)-.6]].forEach(([l,v,col,t],i)=>{const y=320+i*150;text(l,X0-30,y,{a:'right',f:'D',s:56});hbar(X0,y,1000,100,v,42000,col,won(v)+'단',{s:56,k:E.out(P(T,t,.6))});});
      const q=K('q3',0);if(q>=0)stampBox('−18.7%',1420,560,q,{s:72,c:C.red,bg:'rgba(40,0,0,.88)'});
      if(L('q4')>=0){group(960,720,1,0,P(L('q4'),0,.3),()=>{panel(-720,-70,1440,140,{bg:'rgba(6,13,32,1)',bd:C.red,lw:4});emoji('🗑️',-640,0,70);text('한 상인: 기대하고 들여온 카네이션이 안 팔려',40,-24,{s:36,w:900});
        const r=K('q4',0);text(r>=0?'수백 송이를 버렸다':'? 송이를 버렸다',40,30,{f:'D',s:48,c:C.red});});}
      srcLine('한국농수산식품유통공사 화훼유통정보시스템 (뉴시스 2026.5.14 인용)');});
    sub('q5','q6b',()=>{text('카네이션 판매 (농림축산식품부 화훼재배현황)',960,170,{f:'D',s:50,c:C.gold});
      const base=640,bw=200;[['판매량 2005',12000,'1억 2,000만 본',CT('q5')+.3,'#4fb6ff',380],['지난해',1960,'1,960만 본',KT('q5',0),C.red,640],['판매액 2005',326,'326억 원',CT('q6'),'#4fb6ff',1180],['지난해',72,'72억 원',KT('q6',0),C.red,1440]].forEach(([l,v,lab,t,col,x],i)=>{
        const mx=i<2?12000:326,h=380*v/mx;if(L(i<2?'q5':'q6')<0)return;ctx.fillStyle='rgba(255,255,255,.07)';rr(x-bw/2,base-380,bw,380,14);ctx.fill();
        if(T<t){text('?',x,base-150,{f:'D',s:70,c:C.gold});}else{const k=E.out(P(T,t,.6));vCash(x-bw/2,base-h*k,bw,h*k,col);text(lab,x,base-h-34,{f:'D',s:40,c:col===C.red?C.red:'#fff',alpha:k});}text(l,x,base+38,{s:30,w:900});});
      if(T>FR('q5',.8))popText(FR('q5',.8),510,730,'20년 새 −83.7%',{f:'D',s:46,c:C.red});
      if(L('q6')>=0&&T>FR('q6',.75))popText(FR('q6',.75),1310,730,'4분의 1도 안 된다',{f:'D',s:46,c:C.red});
      if(L('q6b')>=0)pill('42년째 꽃집: "올해 판매량·배달 주문이 지난해의 절반" (한국경제 2026.5.12)',960,820,{s:30,bg:'rgba(255,255,255,.95)',alpha:P(L('q6b'),0,.3)});
      if(L('q6b')<0)srcLine('농림축산식품부 「2024 화훼재배현황」 (뉴시스 2026.5.14 인용) · 본 = 줄기 수');});
    sub('q7','q7',()=>{bouquet(560,440,.75);text('+',900,440,{f:'D',s:120,c:C.dim});emoji('📅',1180,430,200);text('대목 하루',1180,600,{s:40,w:900});trashCan(1580,470,.7,1);
      stampBox('대목에 들여온 꽃 = 버린 꽃값',960,780,T-CT('q7')-.2,{s:60,c:C.red,bg:'rgba(40,0,0,.88)'});});
  }},
  /* ── 꽃값이 오르면 ── */
  price:{draw(){
    sub('r1','r1',()=>{text('꽃값이 오르면',760,330,{f:'D',s:110,c:C.gold});text('버린 꽃값도 같이 커진다',760,480,{f:'D',s:70});trashCan(760,720,.5,1);drawMascot(1580,540,1,'worry');});
    sub('r2','r2b',()=>{text('양재 화훼공판장 장미 한 단 평균 경매가 (1월)',960,170,{f:'D',s:50,c:C.gold});
      const base=700,bw=300,sc=.021;[['1년 전 (계산)',10585,'약 1만 585원',CT('r2b')+.3,'#4fb6ff',640],['2026년 1월',17603,'1만 7,603원',KT('r2',0),C.red,1280]].forEach(([l,v,lab,t,col,x])=>{
        ctx.fillStyle='rgba(255,255,255,.07)';rr(x-bw/2,base-390,bw,390,14);ctx.fill();if(T<t){text('?',x,base-200,{f:'D',s:80,c:C.gold});}else{const k=E.out(P(T,t,.6));vCash(x-bw/2,base-v*sc*k,bw,v*sc*k,col);text(lab,x,base-v*sc-40,{f:'D',s:50,c:col===C.red?C.red:'#fff',alpha:k});}text(l,x,base+40,{s:34,w:900});});
      const q=K('r2',1);if(q>=0)stampBox('+66.3%',960,330,q,{s:70,c:C.red,bg:'rgba(40,0,0,.88)'});
      if(L('r2b')>=0)pill('같은 한 단에 7,000원 넘게 더',960,830-30,{s:34,bg:'rgba(255,255,255,.95)',alpha:P(L('r2b'),1,.3)});
      srcLine('한국농수산식품유통공사·화훼유통정보시스템 (아시아경제 2026.1.15 인용) · 1년 전 값 = 17,603 ÷ 1.663 으로 계산',872);});
    sub('r3','r3',()=>{text('2026년 1월 · 1년 전보다',960,180,{f:'D',s:56,c:C.gold});
      [['장미',66.3,'+66.3%',C.red],['거베라',70.7,'+70.7%',C.red],['튤립',19.9,'+19.9%',C.orange],['절화 물량',-12.5,'−12.5%','#4fb6ff']].forEach(([l,v,lab,col],i)=>{const y=310+i*120,k=E.out(P(L('r3'),.2+i*.35,.5));text(l,600,y,{a:'right',f:'D',s:52});hbar(640,y,900,80,Math.abs(v),80,col,lab,{s:52,k});});
      srcLine('한국농수산식품유통공사·화훼유통정보시스템 (아시아경제 2026.1.15 인용)');});
    sub('r4','r4',()=>{text('5월에도',960,180,{f:'D',s:56,c:C.gold});
      group(560,450,1,0,1,()=>{panel(-380,-180,760,360,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:5});text('카네이션 하루 평균 경매가',0,-110,{s:36,w:900,c:C.dim});text('1만 2,153원',0,-20,{f:'D',s:80});const q=K('r4',0);text(q>=0?'+42.2%':'?',0,100,{f:'D',s:80,c:q>=0?C.red:C.gold});});
      group(1360,450,1,0,P(T,FR('r4',.65),.3),()=>{panel(-380,-180,760,360,{bd:C.orange,bg:'rgba(255,159,26,.08)',lw:5});text('포장지 · 고무캡 같은 부자재',0,-110,{s:36,w:900,c:C.dim});text('+20~30%',0,20,{f:'D',s:96,c:C.orange});});
      srcLine('한국경제 2026.5.12 (대륜 카네이션 혼합 특2, 5월 1~11일 · 전년 같은 기간 대비)');});
    sub('r5','r5',()=>{text('예시 꽃집 · 꽃값만 20% 오르고 다발 값은 그대로라면',960,170,{f:'D',s:48,c:C.gold,max:1800});
      const rows=[['사 오는 꽃','343만','411만',FR('r5',.4)],['버리는 꽃','103만','123만',FR('r5',.6)]];
      rows.forEach(([l,a1,b1,t],i)=>{const y=340+i*130;text(l,560,y,{a:'right',f:'D',s:54});text(a1,760,y,{f:'D',s:60,c:C.dim});text('→',960,y,{f:'D',s:60,c:C.dim,alpha:P(T,t,.3)});text(b1,1160,y,{f:'D',s:66,c:C.red,alpha:P(T,t,.3)});});
      text('한 달',560,640,{a:'right',f:'D',s:60});text('−3만',760,640,{f:'D',s:60,c:C.dim});text('→',960,640,{f:'D',s:60,c:C.dim});big('r5',0,1240,640,'−71만 원',{f:'D',s:100,c:C.red,glow:'rgba(255,77,77,.4)'});});
    sub('r6','r6',()=>{drawMascot(560,520,.9,'think');group(1260,420,E.back(P(L('r6'),.6,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-470,-110,940,220,34);ctx.fill();ctx.beginPath();ctx.moveTo(-200,110);ctx.lineTo(-250,180);ctx.lineTo(-130,110);ctx.fill();
      text('보도 속 손님',0,-50,{s:34,w:900,c:'#59627c'});text('"꽃다발 4만~5만 원도 부담"',0,30,{f:'D',s:56,c:C.ink});});srcLine('한국경제 2026.5.12');});
    sub('r7','r7',()=>{const tilt=Math.sin((T-CT('r7'))*1.6)*.12;
      group(960,470,1,0,1,()=>{ctx.fillStyle='#c9ced9';rr(-12,-40,24,320,8);ctx.fill();rr(-120,270,240,30,10);ctx.fill();
        ctx.save();ctx.rotate(tilt);ctx.fillStyle='#c9ced9';rr(-520,-52,1040,20,8);ctx.fill();
        [[-480,'🗑️','버리는 꽃',C.red],[480,'💐','모자란 꽃',C.gold]].forEach(([x,e,l,col])=>{ctx.save();ctx.translate(x,-40);ctx.rotate(-tilt);ctx.strokeStyle='#c9ced9';ctx.lineWidth=4;line(-80,0,0,0);line(0,0,80,0);ctx.fillStyle='rgba(255,255,255,.12)';rr(-140,40,280,60,20);ctx.fill();emoji(e,0,-20,110);text(l,0,140,{f:'D',s:46,c:col});ctx.restore();});
        ctx.restore();});
      text('매일 아침의 저울질',960,840,{f:'D',s:60,c:C.gold,alpha:P(L('r7'),1.2,.3)});});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('예시 꽃집(버리는 비율 30%) 한 달 남는 돈 · 하나씩만 바꿔 보면',960,165,{f:'D',s:44,c:C.gold,alpha:P(a,0,.3),max:1800});
    if(T<CT('l2'))text('사장님이 바꿀 수 있는 숫자는?',960,500,{f:'D',s:90,alpha:P(a,.2,.3)});
    const rows=[['지금 그대로',-3,'l1'],['버리는 비율 20%',40,'l2'],['절반은 예약 주문',49,'l3'],['다발 5만 5,000원',57,'l4'],['꽃값 20% 오르면',-71,'l5'],['첫째~셋째 한꺼번에',130,'l6']];
    const Z=980,SCL=5.2;
    ctx.save();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;if(T>=CT('l1')+1)line(Z,215,Z,740);ctx.restore();
    rows.forEach(([l,v,id],i)=>{const t=i?CT(id):CT('l1')+1.2;if(T<t-.1)return;const y=255+i*92,tk=i?KT(id,0):t,k=E.out(P(T,tk,.6));text(l,60,y,{a:'left',s:38,w:900,max:380,c:id==='l5'?'#ffb3b3':'#fff'});
      if(T<tk){text('?',Z+(v<0?-60:60),y,{f:'D',s:56,c:C.gold});return;}
      const w=Math.max(6,Math.abs(v)*SCL*k),col=v<0?C.red:id==='l6'?C.gold:C.green,lab=(v<0?'−':'+')+Math.abs(v)+'만';ctx.fillStyle=col;rr(v<0?Z-w:Z,y-30,w,60,14);ctx.fill();
      text(lab,v<0?Z-w-18:Z+w+18,y+2,{a:v<0?'right':'left',f:'D',s:46,c:col,alpha:k});});
    if(L('l2b')>=0&&L('l3')<0)pill('시들기 전에 작은 다발 · 한 송이로 돌려 팔기',1300,820,{s:32,bg:'rgba(255,255,255,.95)'});
    if(L('l5b')>=0&&L('l6')<0)pill('꽃값은 사장님이 못 정한다 = 손잡이보다 날씨',1300,820,{s:32,bg:'rgba(255,190,190,.95)'});
    if(L('l6')>=0&&L('l7')<0&&T>FR('l6',.55))pill('버린 꽃을 안 셌던 처음 계산(100만)보다 많다',1300,820,{s:32,bg:'rgba(255,255,255,.95)'});
    sub('l7','l7',()=>{group(960,820,1,0,1,()=>{panel(-760,-50,1520,100,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('값 올리기 어려운 꽃집 → 버리는 꽃 한 송이 줄이기가 가장 손에 잡히는 손잡이',0,4,{f:'D',s:36,c:C.gold,max:1480});});});
    if(L('l7')<0&&L('l2b')<0&&T>=CT('l2'))srcLine('예시 계산 · 다른 비용 260만(포장 40·월세 150·전기 30·잡비 40) 고정 · 한 번에 하나씩 (마지막 줄만 셋 다)',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('꽃집 차리기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:62,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','버리는 비율','사 온 꽃값 ÷ 판 꽃값','오늘 가게: 343 ÷ 240'],['k3','버린 꽃값 vs 내 몫','다발 하나 기준으로 비교','8,571원 > 8,333원'],['k4','예약 주문 비중','미리 받은 주문 = 버릴 꽃 거의 0','절반이면 −3만 → +49만'],
      ['k5','대목 의존도','졸업식·5월에 몰리는 매출','카네이션 경매량 −18.7%'],['k6','꽃값이 오를 때','다발 값·꽃 수를 바꿀 수 있나','장미 경매가 +66.3%']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:38,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(L('k6b')>=0&&ov<0)srcLine('품목별 경매 시세: 한국농수산식품유통공사 화훼유통정보');
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-700,-260,1400,500,{bg:'rgba(6,13,32,1)',bd:C.gold});text('매출 800만 · 판 꽃값 320만 · 다른 비용 300만 · 4분의 1 버림',0,-180,{f:'D',s:42,max:1320});
      text('사 올 꽃 320 ÷ 0.75 = 427만 · 버린 꽃 107만',0,-95,{f:'D',s:48,c:L('k7b')>=0?C.gold:'#fff',max:1320});const k=K('k7b',0);
      if(k>=0){text('800 − 427 − 300 = 73만 원',0,20,{f:'D',s:84,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});text('안 버린다고 치면 180만 원',0,120,{f:'D',s:46,c:C.dim,alpha:P(T,FR('k7b',.75),.3)});}else text('?',0,40,{f:'D',s:120,c:C.gold});
      if(L('k7c')>=0)text('꽃집 원가표는 쓰레기통까지 넣어야 끝난다',0,200,{s:34,w:900,alpha:P(L('k7c'),0,.3)});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('5만 원 꽃다발 하나',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      const X=160,Wd=1600,y=380,h=150,s=Wd/50000,k=E.out(P(L('z2'),0,5));let xx=X;
      LY.forEach((o,i)=>{const w=o.v*s,kk=clamp(k*LY.length-i);if(kk<=0){xx+=w;return;}ctx.fillStyle=o.col;rr(xx,y-h/2,Math.max(2,w*kk-3),h,10);ctx.fill();if(kk>.5){text(won(o.v),xx+w/2,y+2,{f:'D',s:w>150?46:30,c:'#101420',max:w-10});text(o.name,xx+w/2,y+110+(w<150&&i%2?44:0),{s:w>150?30:24,w:900,c:o.k==='own'?C.green:'rgba(255,255,255,.85)',max:Math.max(w-8,70)});}xx+=w;});
      const b=L('z2b');if(b>=0)group(960,720,1,0,P(b,0,.3),()=>{ctx.fillStyle='#fff';rr(-640,-90,1280,180,30);ctx.fill();text('버리는 꽃을 안 세면 한 달 100만 원',0,-28,{s:38,w:900,c:C.ink,max:1240});text('30% 버리면: 버린 꽃 103만 → 한 달 −3만 원',0,40,{f:'D',s:52,c:'#d62f2f',max:1240});});
    }else{
      drawMascot(960,400,1.0,'think');
      stampBox('원가 = 사 온 꽃값',960,740,c,{s:72,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1440,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-380,-70,760,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 사 온 꽃 열 송이 중 몇 송이 버리세요?',0,4,{s:34,w:900,c:C.ink,max:720});});
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
