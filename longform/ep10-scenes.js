/* ════════════════════════════════════════════════════════════════════
   장면 (LF.10 탕후루 계산서) — 수치·출처는 docs/longform-ep10.md
   중심 그림: 4,000원 딸기 탕후루 한 꼬치 = 딸기 네 알(한 알 1,000원). 왼쪽부터 재료비·월세·인건비·기타가 알을 칠하고
   오른쪽 끝 1,378원이 사장님 몫. 반전은 '언제 들어갔나' — 같은 가게를 7월·10월·1월에 연 세 가게의 누적 그래프.
   ════════════════════════════════════════════════════════════════════ */
const LY=[ // 4,000원에서 칠하는 순서 (원, 정점 한 달 9,000개 기준)
  {k:'mat',name:'재료비',v:1400,col:'#E8A33A'},
  {k:'rent',name:'월세',v:333,col:'#2ec4b6'},
  {k:'labor',name:'인건비',v:667,col:'#B18CFF'},
  {k:'etc',name:'기타',v:222,col:'#6FD3FF'},
  {k:'own',name:'사장님 몫',v:1378,col:'#35E08A'},
];
const LYK=Object.fromEntries(LY.map(s=>[s.k,s]));
const SEQ=['7','0','0','0','÷','1','2','4','0','='];   // 7,000만 ÷ 1,240만 = 5.645 (만 단위로 누름, 0 개수: 7000 = 7·0·0·0, 1240 = 1·2·4·0)
// 하루 판매량 예시 (2023.7 ~ 2024.12, 전국 카드 매출 흐름을 본뜬 가정) · 한 개 2,600원 남김 · 고정비 1,100만
const MON=['23.7','23.8','23.9','23.10','23.11','23.12','24.1','24.2','24.3','24.4','24.5','24.6','24.7','24.8','24.9','24.10','24.11','24.12'];
const DAY=[300,300,300,260,190,170,160,150,150,110,100,90,85,80,80,75,70,70];
const PROF=DAY.map(d=>d*30*2600/1e4-1100); // 만 원
function cumOf(i0){const a=[-7000];for(let j=0;j<12;j++)a.push(a[j]+PROF[i0+j]);return a;}
const STORES=[{n:'가',i0:0,lab:'2023.7 개업',col:'#35E08A',end:'−2,416만'},{n:'나',i0:3,lab:'2023.10 개업',col:'#FFC531',end:'−7,525만'},{n:'다',i0:6,lab:'2024.1 개업',col:'#FF4D4D',end:'−1억 684만'}];
function layT(k){return {mat:KT('s1',0),rent:KT('s2',0),labor:KT('s3',0),etc:KT('s4',0),own:KT('s5',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}

/* 딸기 한 알 (반들반들 설탕 코팅) */
function berry(x,y,r,col='#e8343f',alpha=1){ctx.save();ctx.globalAlpha*=alpha;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x,y+r);ctx.bezierCurveTo(x-r*1.25,y+r*.2,x-r,y-r*.95,x,y-r*.8);ctx.bezierCurveTo(x+r,y-r*.95,x+r*1.25,y+r*.2,x,y+r);ctx.fill();
  ctx.fillStyle='rgba(255,235,160,.85)';for(let i=0;i<7;i++){const a=i*2.3,d=r*(.25+.35*rnd(i+5));ctx.beginPath();ctx.ellipse(x+Math.cos(a)*d,y+Math.sin(a)*d*.8,3.5,5,a,0,7);ctx.fill();}
  ctx.fillStyle='rgba(255,255,255,.45)';ctx.beginPath();ctx.ellipse(x-r*.35,y-r*.35,r*.16,r*.3,-.6,0,7);ctx.fill();ctx.restore();}
/* 4,000원 탕후루 한 꼬치 (가로). o.full: 다 칠함 · o.labels: 아래 이름표 · o.plain: 그냥 딸기 */
function tangStick(cx,cy,o={}){
  const R=o.R||110,x0=cx-4*R,x1=cx+4*R;
  ctx.fillStyle='#d9b98a';rr(x0-120,cy-9,x1-x0+240,18,9);ctx.fill();
  for(let i=0;i<4;i++)berry(x0+R+i*2*R,cy,R*.98,'#e8343f');
  if(o.plain)return;
  ctx.save();ctx.beginPath();for(let i=0;i<4;i++){ctx.moveTo(x0+R+i*2*R+R,cy);ctx.arc(x0+R+i*2*R,cy,R*.98,0,7);}ctx.clip();
  let acc=0;const labs=[];
  LY.forEach(s=>{const t=o.full?99:T-layT(s.k);const w=s.v/4000*(x1-x0);if(t>=0){const f=E.out(P(t,0,.7));ctx.fillStyle=s.col;ctx.globalAlpha=.86;ctx.fillRect(x0+acc,cy-R,w*f,2*R);ctx.globalAlpha=1;if(o.labels&&f>.3)labs.push({s,xm:x0+acc+w/2,al:P(t,0,.3)});}acc+=w;});
  ctx.restore();
  for(let i=0;i<4;i++){ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x0+R+i*2*R,cy,R*.98,0,7);ctx.stroke();}
  labs.forEach(({s,xm,al},i)=>{const y=cy+R+56+(i%2)*92;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=s.col;ctx.lineWidth=3;line(xm,cy+R-4,xm,y-36);ctx.restore();
    text(s.name,xm,y-12,{s:28,w:900,c:s.col,alpha:al});text(won(s.v)+'원',xm,y+28,{f:'D',s:36,c:s.k==='own'?C.green:'#fff',alpha:al});});
}
/* 탕후루 가게 외관 (상표 없음). o.closed: 셔터 + 임대 종이 */
function shopFront(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#3b2a3f';rr(-400,-300,800,560,18);ctx.fill();
    ctx.fillStyle='#ff5d8f';rr(-400,-300,800,120,14);ctx.fill();
    text('과일 탕후루',-60,-238,{f:'D',s:72,c:'#fff'});berry(250,-240,40);
    if(o.closed){ctx.fillStyle='#8e98ad';rr(-370,-160,740,400,8);ctx.fill();ctx.strokeStyle='#6c768b';ctx.lineWidth=4;for(let i=0;i<12;i++)line(-370,-130+i*32,370,-130+i*32);
      ctx.fillStyle='#fff';rr(-110,-60,220,150,6);ctx.fill();text('임대',0,10,{f:'D',s:64,c:'#d62f2f'});}
    else{const g=ctx.createLinearGradient(0,-160,0,240);g.addColorStop(0,'#ffe3ec');g.addColorStop(1,'#ffb3c7');ctx.fillStyle=g;rr(-370,-160,740,400,10);ctx.fill();
      ctx.fillStyle='rgba(120,40,60,.25)';rr(-340,80,680,26,6);ctx.fill();
      for(let i=0;i<6;i++){const sx=-280+i*112;ctx.fillStyle='#d9b98a';ctx.fillRect(sx-3,-60,6,140);for(let j=0;j<3;j++)berry(sx,-40+j*42,20,j%2?'#ff9f1a':'#e8343f');}
      if(o.queue)for(let i=0;i<5;i++)emoji('🧑',-300+i*150,200,64);}
  });
}
/* 작은 가게 아이콘 (닫히면 셔터) */
function miniShop(x,y,sz,closed,alpha=1){ctx.save();ctx.globalAlpha*=alpha;ctx.fillStyle=closed?'#5b6275':'#ff5d8f';rr(x-sz/2,y-sz/2,sz,sz*.28,4);ctx.fill();ctx.fillStyle=closed?'#8e98ad':'#ffd0dc';rr(x-sz/2,y-sz/2+sz*.3,sz,sz*.7,4);ctx.fill();
  if(closed){ctx.strokeStyle='#6c768b';ctx.lineWidth=2;for(let i=1;i<4;i++)line(x-sz/2,y-sz/2+sz*.3+i*sz*.17,x+sz/2,y-sz/2+sz*.3+i*sz*.17);}ctx.restore();}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o2')){
      shopFront(560,500,.9*E.back(P(a,0,.4))+.001,{queue:1});
      group(1420,330,1,-.03,1,()=>{panel(-360,-140,720,280,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('2023년 새로 연 탕후루 가게',0,-70,{s:40,w:900,c:C.dim});text('1,300곳+',0,30,{f:'D',s:120,c:C.gold});});
      text('한 집 건너 하나',1420,560,{s:44,w:900,alpha:P(T,FR('o1',.5),.3)});text('(행정안전부 인허가 데이터 · 언론 인용)',1420,620,{s:28,w:800,c:C.dim,alpha:P(T,FR('o1',.5),.3)});
    }else if(T<CT('o3')){
      const b=L('o2');
      text('정점의 예시 가게가 한 달 남기는 돈',760,240,{f:'D',s:60,c:C.dim,alpha:P(b,0,.3)});
      big('o2',0,760,430,'+1,240만 원',{f:'D',s:170,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('o2',.62))pill('창업비 7,000만 ÷ 1,240만 ≈ 6개월이면 본전',760,640,{s:42,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('o2',.62),.3)});
      drawMascot(1600,540,.9,'happy',{alpha:P(b,.3,.3)});
    }else if(T<CT('o5')){
      const b=L('o3');
      text('같은 가게 · 같은 7,000만 원 · 1년 뒤',960,190,{f:'D',s:58,c:C.dim,alpha:P(b,0,.3)});
      const rows=[['7월에 연 가게',2416,C.orange,'−2,416만',KT('o3',0)],['10월에 연 가게',7525,C.red,'−7,525만',KT('o4',0)]];
      rows.forEach(([l,v,col,lab,t],i)=>{const y=360+i*190;if(T<t-.3)return;text(l,560,y,{a:'right',f:'D',s:56,alpha:P(T,t-.3,.3)});if(T<t){text('?',680,y,{f:'D',s:80,c:C.gold});return;}hbar(600,y,1000,110,v,8000,col,lab,{s:70,k:E.out(P(T,t,.6))});});
      const q=K('o3',0);if(q>=0)stampBox('석 달 차이 → 5,000만 원+',960,760,q,{s:56,c:C.gold,bg:'rgba(40,30,0,.88)'});
    }else if(T<CT('o6')){
      const b=L('o5');
      text('본전 계산에 빠진 것',760,280,{f:'D',s:80,c:C.dim,alpha:P(b,0,.3)});text('시간',760,450,{f:'D',s:200,c:C.gold,alpha:P(b,.4,.3),glow:'rgba(255,197,49,.4)'});
      emoji('⏳',760,660,120,{alpha:P(b,.8,.3)});drawMascot(1580,520,1.0,'worry',{alpha:P(b,0,.3)});
    }else{
      const k9=L('o6'),k10=L('o7');
      text('유행 업종 들어가기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:76,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['행정안전부 인허가 데이터','카드 매출 분석','언론 보도'].forEach((s,i)=>{const k=P(k10,.5+i*.4,.3);if(k>0)pill(s,480+i*480,760,{s:34,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('탕후루 계산서',960,270,{f:'D',s:160,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1700});
    text('6개월 본전은 왜 오지 않았나',960,420,{s:56,w:900,alpha:P(a,.3,.3)});
    shopFront(700,720,.55,{alpha:P(a,.2,.3)});drawMascot(1300,720,.85,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p2',()=>{shopFront(560,500,.85,{queue:L('p2')>=0?1:0});
      if(L('p2')>=0){text('딸기 탕후루 한 꼬치',1380,320,{f:'D',s:56,c:C.gold});big('p2',0,1380,480,'4,000원',{f:'D',s:150});
        text('번화가 10평 · 예시 가정',1380,640,{s:38,w:900,c:C.dim,alpha:P(L('p2'),1,.3)});}});
    sub('p3','p3',()=>{text('창업비 (예시 · 보증금 제외)',960,200,{f:'D',s:60,c:C.gold});
      ['가맹비','인테리어','설비'].forEach((s,i)=>pill(s,600+i*360,350,{s:44,bg:'rgba(255,255,255,.92)',alpha:P(L('p3'),.3+i*.3,.3)}));
      big('p3',0,960,560,'= 7,000만 원',{f:'D',s:150,c:C.gold,glow:'rgba(255,197,49,.4)'});});
    sub('p4','p4',()=>{text('유행 정점 (예시)',960,190,{f:'D',s:60,c:C.gold});
      text('하루',600,370,{f:'D',s:60,c:C.dim});big('p4',0,600,500,'300개',{f:'D',s:140});
      text('한 달 9,000개 × 4,000원',1340,370,{s:44,w:900,c:C.dim,alpha:P(T,FR('p4',.45),.3)});big('p4',1,1340,500,'3,600만 원',{f:'D',s:120,c:C.gold});
      pill('세금 제외',960,700,{s:36,alpha:P(T,FR('p4',.8),.3),bg:'rgba(255,255,255,.92)'});});
    sub('p5','p5',lt=>{tangStick(960,380,{plain:1,R:lerp(80,110,E.out(P(lt,0,.6)))});
      for(let i=0;i<4;i++)text('1,000원',960-330+i*220,560,{f:'D',s:44,alpha:P(lt,1.6+i*.2,.3)});
      text('4,000원 한 꼬치 = 딸기 네 알',960,700,{f:'D',s:64,c:C.gold,alpha:P(lt,.8,.4)});});
  }},
  /* ── 4,000원 탕후루 쪼개기 ── */
  stick:{draw(){
    tangStick(960,290,{labels:1,R:105});
    const CX=960,Y=730;
    sub('s1','s1',()=>{text('첫 번째: 재료비',CX,Y-90,{f:'D',s:54,c:LYK.mat.col});text('딸기 · 설탕 · 꼬치 · 포장 = 매출의 35% (예시)',CX,Y-10,{s:36,w:900,max:1400});popText(KT('s1',0),CX,Y+70,'1,400원',{f:'D',s:80,c:LYK.mat.col});});
    sub('s2','s2',()=>{text('두 번째: 월세',CX,Y-90,{f:'D',s:54,c:LYK.rent.col});text('한 달 300만 ÷ 9,000개 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s2',0),CX,Y+70,'333원',{f:'D',s:80,c:LYK.rent.col});});
    sub('s3','s3',()=>{text('세 번째: 인건비',CX,Y-90,{f:'D',s:54,c:LYK.labor.col});text('알바 2명 × 8시간 × 30일 × 10,320원 + 주휴수당 ≈ 600만',CX,Y-10,{s:34,w:900,max:1500});popText(KT('s3',0),CX,Y+70,'667원',{f:'D',s:80,c:LYK.labor.col});
      srcLine('2026년 최저시급 10,320원 (최저임금위원회 고시)');});
    sub('s4','s4',()=>{text('네 번째: 기타',CX,Y-90,{f:'D',s:54,c:LYK.etc.col});text('가맹 관리비 · 전기 · 카드 수수료 200만 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s4',0),CX,Y+70,'222원',{f:'D',s:80,c:LYK.etc.col});});
    sub('s5','s5',()=>{text('4,000 − 1,400 − 333 − 667 − 222',CX,Y-90,{f:'D',s:44,c:C.dim});text('사장님 몫',CX-260,Y+20,{f:'D',s:56,c:C.green});big('s5',0,CX+140,Y+20,'1,378원',{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('s5',.7))text('딸기 한 알 반이 안 된다',CX,Y+112,{s:36,w:900,alpha:P(T,FR('s5',.7),.3)});});
    sub('s6','s6',()=>{text('한 달로 바꾸면 (정점 9,000개)',CX-380,Y-40,{f:'D',s:44,c:C.dim});big('s6',0,CX-380,Y+60,'1,240만 원',{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)'});
      text('3,600 − (1,260 + 300 + 600 + 200)',CX+420,Y-10,{s:38,w:900,c:C.dim});pill('정점에선 정말 잘 벌었다',CX+420,Y+70,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('s6',.6),.3)});});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('÷'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s.replace('=','')).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} ÷ ${fmt(n2)} =`;bigS='5.6451';}else if(n2!==undefined){small=`${fmt(n1)} ÷`;bigS=n2?fmt(n2):fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:done?96:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('창업비 7,000만 원',1350,260,{f:'D',s:60,c:C.gold,alpha:P(a,.2,.3)});text('÷ 정점 한 달 1,240만 원',1350,360,{s:44,w:900,alpha:P(a,.4,.3)});
    if(dt>=0){const q=K('c2',0);
      if(L('c2')<0)drawMascot(1350,620,.6,'happy');
      else{group(1350,520,lerp(1.6,1,E.out(P(Math.max(0,q),0,.3))),0,1,()=>text(q>=0?'= 5.65개월':'= ?',0,0,{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)',max:1000}));
        if(q>=0&&L('c3b')<0)text('6개월이면 본전?',1350,640,{f:'D',s:50,alpha:P(q,.8,.3)});}
      const c3=L('c3');if(c3>=0){group(1350,790,1,0,P(c3,0,.3),()=>{panel(-470,-80,940,160,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('숨은 가정',0,-30,{s:36,w:900,c:'#ffb3b3'});text('하루 300개가 여섯 달 그대로',0,32,{f:'D',s:50,c:C.gold,max:900});});}
      if(L('c3b')>=0)stampBox('유행 업종에선 가장 먼저 깨진다',1350,660,T-CT('c3b'),{s:44,c:C.red,bg:'rgba(40,0,0,.9)'});}
    if(dt>=0)group(1180,160,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 본전 판매량 ── */
  be:{draw(){
    sub('b1','b1',()=>{tangStick(960,380,{full:1,R:90});text('하루 몇 개가 본전일까?',960,640,{f:'D',s:90,c:C.gold});});
    sub('b2','b2',()=>{text('덜 팔아도 그대로 나가는 돈 (한 달)',960,190,{f:'D',s:56,c:C.gold});
      [['월세','300만',LYK.rent.col],['인건비','600만',LYK.labor.col],['기타','200만',LYK.etc.col]].forEach(([l,v,col],i)=>{const k=E.back(P(L('b2'),.2+i*.3,.4));if(k<=0)return;group(500+i*460,400,k,0,1,()=>{panel(-190,-110,380,220,{bd:col,bg:'rgba(255,255,255,.05)',lw:5});text(l,0,-45,{s:40,w:900,c:col});text(v,0,35,{f:'D',s:70});});});
      big('b2',0,960,640,'= 1,100만 원',{f:'D',s:110,c:C.gold});});
    sub('b3','b3b',()=>{text('한 꼬치 4,000원 − 재료비 1,400원 = 2,600원',960,190,{f:'D',s:50,c:C.dim});
      text('1,100만 ÷ 2,600원 = 한 달 4,231개',960,300,{f:'D',s:58,alpha:P(L('b3'),1,.3)});
      text('하루',760,470,{f:'D',s:70,c:C.dim});big('b3',0,1060,470,'141개',{f:'D',s:170,c:C.gold,glow:'rgba(255,197,49,.4)'});
      const k=L('b3b');if(k>=0){for(let i=0;i<12;i++){const x=420+i*98;ctx.fillStyle='rgba(255,255,255,.1)';rr(x-40,630,80,120,10);ctx.fill();const f=clamp(k*3-i*.2);if(f>0){ctx.fillStyle=C.gold;rr(x-40,750-120*f,80,120*f,10);ctx.fill();}}text('하루 12시간 → 한 시간에 약 12개',960,800,{s:36,w:900,alpha:P(k,.5,.3)});}});
    sub('b4','b4',()=>{text('하루 판매량',960,180,{f:'D',s:56,c:C.gold});
      const X0=520,sc=3.4;[['정점',300,C.green],['본전',141,C.gold]].forEach(([l,v,col],i)=>{const y=330+i*170;text(l,X0-30,y,{a:'right',f:'D',s:60});hbar(X0,y,1100,110,v,320,col,v+'개',{s:70,k:E.out(P(L('b4'),.2+i*.4,.6))});});
      const x=X0+141*sc;ctx.save();ctx.setLineDash([12,8]);ctx.strokeStyle=C.red;ctx.lineWidth=4;line(x+X0*0+0,250,x,600);ctx.restore();
      stampBox('이 선 아래면 매달 적자',960,720,T-FR('b4',.55),{s:60,c:C.red,bg:'rgba(40,0,0,.85)'});});
    sub('b5','b5',()=>{group(960,400,1,0,1,()=>{panel(-640,-200,1280,400,{bd:C.gold,bg:'rgba(255,197,49,.06)',lw:5});text('창업비 7,000만 원은 아직 계산 밖',0,-110,{f:'D',s:60,c:C.gold});
        text('본전 = 적자가 오기 전에',0,0,{f:'D',s:66});text('7,000만 원을 다 버는 것',0,90,{f:'D',s:66,c:C.green,alpha:P(T,FR('b5',.55),.3)});});
      drawMascot(1700,740,.5,'worry');});
  }},
  /* ── 유행 곡선 ── */
  curve:{draw(){
    sub('u1','u1',()=>{shopFront(620,500,.8);text('유행은 얼마나 갔을까?',1420,480,{f:'D',s:80,c:C.gold});});
    sub('u2','u3',()=>{text('전국 탕후루 카드 매출 흐름 (2023년 4월 = 1)',960,170,{f:'D',s:50,c:C.gold});
      const M=['23.4','5','6','7','8','9','10','11','12','24.1','2','3','4'],V=[1,1.6,2.4,3.4,4.5,5.3,5.0,3.6,3.0,2.6,2.3,2.05,1.5],AN=[0,5,7,12];
      const X0=260,DX=118,Y0=760,SY=85,nShow=T<KT('u2',0)?6:13,k=E.io(P(T,T<KT('u2',0)?CT('u2'):KT('u2',0),2));
      ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=2;line(X0,Y0,X0+DX*12,Y0);
      M.forEach((m,i)=>text(m,X0+i*DX,Y0+34,{s:26,w:800,c:C.dim}));
      const upto=T<KT('u2',0)?5*k:(L('u3')>=0?5+7*E.io(P(L('u3'),0,2.5)):5);
      ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=8;ctx.lineJoin='round';ctx.beginPath();for(let i=0;i<=Math.floor(upto);i++){const x=X0+i*DX,y=Y0-V[i]*SY;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
      const fi=Math.floor(upto),fr=upto-fi;if(fi<12&&fr>0){ctx.lineTo(X0+(fi+fr)*DX,Y0-lerp(V[fi],V[fi+1],fr)*SY);}ctx.stroke();ctx.restore();
      AN.forEach(i=>{if(i>upto+.01)return;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(X0+i*DX,Y0-V[i]*SY,11,0,7);ctx.fill();});
      if(upto>=5){popText(KT('u2',0),X0+5*DX,Y0-5.3*SY-44,'정점 5.3배',{f:'D',s:46,c:C.gold});}
      if(L('u3')>=0&&upto>=7)popText(KT('u3',0),X0+7*DX+60,Y0-3.6*SY-50,'한 달 새 −28%',{f:'D',s:44,c:C.red,a:'left'});
      if(upto>=12)popText(FR('u3',.75),X0+12*DX-20,Y0-1.5*SY-60,'−27%',{f:'D',s:44,c:C.red});
      srcLine('BC카드 가맹점 데이터 분석 (경향신문 2024.5.28 인용) · 점 = 보도된 값, 사이는 이어 그림');});
    sub('u4','u5',()=>{text('탕후루 가게 개업 vs 폐업 (행정안전부 인허가 데이터)',960,170,{f:'D',s:48,c:C.gold,max:1800});
      const X0=640,sc=.72;const R=[['2023년 개업',1374,'#4fb6ff',CT('u4')+.3,'u4'],['2023년 폐업',72,C.red,KT('u4',0)+.6,'u4'],['2024.1~5.13 개업',71,'#4fb6ff',CT('u5')+.4,'u5'],['2024.1~5.13 폐업',118,C.red,KT('u5',0),'u5']];
      R.forEach(([l,v,col,t,id],i)=>{const y=290+i*125+(i>1?30:0);if(L(id)<0)return;text(l,X0-30,y,{a:'right',s:40,w:900});if(T<t){text('?',X0+50,y,{f:'D',s:60,c:C.gold});return;}hbar(X0,y,1000,84,v,1400,col,won(v)+'곳',{s:54,k:E.out(P(T,t,.6))});});
      if(L('u5')>=0&&T>FR('u5',.6))stampBox('닫는 가게가 더 많아졌다',1380,700,T-FR('u5',.6),{s:48,c:C.red,bg:'rgba(40,0,0,.88)'});
      srcLine('행정안전부 지방행정인허가데이터 (파이낸셜뉴스 2024.5.16 인용, 2024년은 5월 13일까지)');});
    sub('u5b','u5b',()=>{text('가장 큰 한 탕후루 브랜드 매장 수',960,180,{f:'D',s:54,c:C.gold});
      const base=740,sc=.82,bw=240;[['2022',43,CT('u5b')+.3,'#4fb6ff'],['2023',532,KT('u5b',0),C.gold],['2024.6',490,FR('u5b',.7),C.red]].forEach(([l,v,t,col],i)=>{const x=520+i*440;ctx.fillStyle='rgba(255,255,255,.07)';rr(x-bw/2,base-540*sc,bw,540*sc,14);ctx.fill();
        if(T<t){text('?',x,base-200,{f:'D',s:70,c:C.gold});}else{const k=E.out(P(T,t,.6));vCash(x-bw/2,base-v*sc*k,bw,v*sc*k,col);text(v+'곳',x,base-v*sc-40,{f:'D',s:56,c:col===C.red?C.red:'#fff',alpha:k});}text(l,x,base+40,{s:34,w:900});});
      srcLine('2022~2023: 공정위 가맹사업정보 (뉴시스 2024.1.31 인용) · 2024.6: 파이낸셜뉴스 2024.6.24 (500호점 → 490곳, 집계 기준이 다를 수 있음)');});
    sub('u6','u6',()=>{text('2024년 6월 1일 ~ 17일 문 닫은 탕후루 가게',960,180,{f:'D',s:52,c:C.gold});
      const k=P(L('u6'),.3,3);for(let i=0;i<34;i++){const x=330+(i%17)*74,y=340+Math.floor(i/17)*110;miniShop(x,y,60,i<Math.round(34*k));}
      text('34곳',960,600,{f:'D',s:90,c:C.red,alpha:P(L('u6'),1.5,.3)});big('u6',0,960,730,'하루 평균 두 곳',{f:'D',s:70,c:C.red});
      srcLine('행정안전부 지방행정인허가데이터 (파이낸셜뉴스 2024.6.24 인용)');});
    sub('u7','u7',()=>{text('2025년 2월 · 이름에 \'탕후루\'가 들어간 가게',960,180,{f:'D',s:52,c:C.gold});
      for(let i=0;i<20;i++)miniShop(250+(i%5)*110,330+Math.floor(i/5)*95,70,false,P(L('u7'),.2+i*.02,.2));text('영업 중',470,730,{s:40,w:900});text('565곳',470,790,{f:'D',s:60,c:C.green});
      const q=K('u7',0);for(let i=0;i<25;i++)miniShop(1200+(i%5)*110,330+Math.floor(i/5)*80,70,true,q>=0?P(q,i*.02,.2):0);text('폐업 상태',1420,730,{s:40,w:900});text(q>=0?'715곳':'?',1420,790,{f:'D',s:60,c:q>=0?C.red:C.gold});
      text('<',960,560,{f:'D',s:120,c:C.red,alpha:q>=0?P(q,.6,.3):0});
      srcLine('행정안전부 지방행정인허가데이터 · 휴게음식점 업소명 기준 (아시아타임즈 2025.2.15 인용)');});
    sub('u8','u8',()=>{text('누가 먼저 끝났나',960,180,{f:'D',s:60,c:C.gold});
      text('본전까지',520,360,{a:'right',f:'D',s:56});hbar(560,360,1100,100,6,7,C.green,'6개월 (정점 매출이면)',{s:46,k:E.out(P(L('u8'),.2,.6))});
      text('정점 → 크게 꺾임',520,520,{a:'right',f:'D',s:56,max:480});hbar(560,520,1100,100,2,7,C.red,'2개월',{s:46,k:E.out(P(L('u8'),.8,.6))});
      stampBox('유행이 먼저 식었다',960,720,T-FR('u8',.55),{s:72,c:C.red,bg:'rgba(40,0,0,.85)'});});
  }},
  /* ── 언제 들어갔나 (반전) ── */
  three:{draw(){
    sub('w1','w1',()=>{[0,1,2].forEach(i=>{shopFront(380+i*580,450,.5);pill(['2023.7','2023.10','2024.1'][i]+' 개업',380+i*580,680,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(L('w1'),.4+i*.3,.3)});});
      text('같은 가게 · 같은 7,000만 원 · 각각 1년',960,800,{f:'D',s:50,c:C.gold});});
    sub('w2','w2',()=>{text('하루 판매량 (예시 가정 · 전국 카드 매출 흐름을 본뜸)',960,170,{f:'D',s:46,c:C.gold,max:1800});
      const X0=230,DX=82,Y0=740,SY=1.6,k=P(L('w2'),.3,4);
      DAY.forEach((d,i)=>{const f=clamp(k*DAY.length-i);if(f<=0)return;const x=X0+i*DX;ctx.fillStyle=d>=141?'#4fb6ff':C.red;rr(x-30,Y0-d*SY*f,60,d*SY*f,8);ctx.fill();text(d+'',x,Y0-d*SY-24,{s:26,w:900,alpha:f});text(MON[i],x,Y0+30,{s:22,w:800,c:C.dim});});
      const y=Y0-141*SY;ctx.save();ctx.setLineDash([12,8]);ctx.strokeStyle=C.gold;ctx.lineWidth=4;line(X0-50,y,X0+DX*17+50,y);ctx.restore();text('본전 141개',X0+DX*17+40,y-26,{a:'right',s:30,w:900,c:C.gold});});
    sub('w3','w7',()=>{const id=['w3','w5','w6'];text('1년 동안 쌓인 돈 (창업비 7,000만에서 출발, 예시)',960,160,{f:'D',s:44,c:C.gold,max:1800});
      const X0=300,DX=100,yv=v=>250+(1000-v)*(520/12000);
      ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=2;[0,-4000,-8000].forEach(v=>{line(X0,yv(v),X0+DX*12,yv(v));text(v?won(v)+'만':'본전 0',X0-20,yv(v)+2,{a:'right',s:26,w:900,c:v?C.dim:C.green});});
      for(let j=0;j<=12;j+=3)text(j+'개월',X0+j*DX,yv(-11000)+26,{s:24,w:800,c:C.dim});
      STORES.forEach((st,si)=>{const t0=CT(id[si]);if(T<t0)return;const cum=cumOf(st.i0),k=E.io(P(T,t0+.3,3));const upto=12*k;
        ctx.save();ctx.strokeStyle=st.col;ctx.lineWidth=7;ctx.lineJoin='round';ctx.beginPath();for(let j=0;j<=Math.floor(upto);j++){const x=X0+j*DX,y=yv(cum[j]);j?ctx.lineTo(x,y):ctx.moveTo(x,y);}const fi=Math.floor(upto),fr=upto-fi;if(fi<12&&fr>0)ctx.lineTo(X0+(fi+fr)*DX,yv(lerp(cum[fi],cum[fi+1],fr)));ctx.stroke();ctx.restore();
        text('['+st.n+'] '+st.lab,X0+12*DX+24,yv(cum[12])-26,{a:'left',s:28,w:900,c:st.col,alpha:P(T,t0+3.2,.3)});
        const q=K(id[si],0);if(q>=0)text(st.end,X0+12*DX+24,yv(cum[12])+16,{a:'left',f:'D',s:40,c:st.col,alpha:P(q,0,.3)});});
      if(L('w4')>=0&&L('w5')<0){const cum=cumOf(0),x=X0+9*DX,y=yv(cum[9]);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,12,0,7);ctx.fill();ctx.save();ctx.setLineDash([8,6]);ctx.strokeStyle='#fff';ctx.lineWidth=3;line(x,y,x,yv(0));ctx.restore();pill('9개월째: 본전까지 1,456만 모자람',x,yv(0)-40,{s:32,bg:'rgba(255,255,255,.95)'});}
      if(L('w3b')>=0&&L('w4')<0)pill('정점 석 달 +3,720만 → 내리막에서 다시 내줌',960,850,{s:34,bg:'rgba(255,255,255,.95)'});
      if(L('w7')>=0)stampBox('석 달 차이 = 5,109만 원',960,560,T-CT('w7'),{s:60,c:C.gold,bg:'rgba(40,30,0,.92)'});});
    sub('w8','w8b',()=>{text('탕후루 신규 영업허가 (2023년)',960,170,{f:'D',s:56,c:C.gold});
      const base=640,sc=1.4,bw=200,D=[['7월',160],['8월',232],['9월',242],['10월',164],['11월',63]];
      D.forEach(([l,v],i)=>{const x=440+i*260,k=E.out(P(L('w8'),.2+i*.15,.5));vCash(x-bw/2,base-v*sc*k,bw,v*sc*k,i===2?C.gold:i<4?'#4fb6ff':'rgba(255,255,255,.35)');text(v+'',x,base-v*sc-30,{f:'D',s:48,alpha:k});text(l,x,base+36,{s:34,w:900});});
      if(K('w8',0)>=0){ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.setLineDash([10,8]);rr(310,base-242*sc-80,1040,242*sc+130,18);ctx.stroke();ctx.restore();popText(KT('w8',0),1520,330,'넉 달 798곳',{f:'D',s:60,c:C.gold});text('9월 = 매출 정점',1520,420,{s:34,w:900,c:C.dim,alpha:P(K('w8',0),.5,.3)});}
      if(L('w8b')>=0)pill('늦게 들어올수록 남은 손님을 또 나눈다',960,780,{s:40,bg:C.red,c:'#fff',alpha:P(L('w8b'),0,.3)});
      srcLine('행정안전부 지방행정인허가데이터 (파이낸셜뉴스 2024.4.8 인용)');});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('[나] 가게(2023.10 개업) 1년 손해 · 하나씩만 바꿔 보면',960,170,{f:'D',s:46,c:C.gold,alpha:P(a,0,.3),max:1800});if(T<CT('l2'))text('사장님이 바꿀 수 있는 숫자는?',960,500,{f:'D',s:90,alpha:P(a,.2,.3)});
    const rows=[['지금 그대로','−7,525만',7525,C.red,'l1'],['알바 1명 대신 직접','−3,925만',3925,C.orange,'l2'],['창업비 4,000만','−4,525만',4525,C.orange,'l3'],['6개월 만에 닫기','−5,176만',5176,C.orange,'l4'],['셋 다 하면','−376만',376,C.gold,'l5']];
    const Z=640,SCL=.12;
    rows.forEach(([l,lab,v,col,id],i)=>{const t=i?CT(id):CT('l1')+1.2;if(T<t-.1)return;const y=290+i*104,tk=i?KT(id,0):t,k=E.out(P(T,tk,.6));text(l,Z-30,y,{a:'right',s:38,w:900,max:560});
      if(T<tk){text('?',Z+60,y,{f:'D',s:56,c:C.gold});return;}
      const w=Math.max(6,v*SCL*k);ctx.fillStyle=col;rr(Z,y-30,w,60,14);ctx.fill();text(lab,Z+w+20,y+2,{a:'left',f:'D',s:46,c:col,alpha:k});});
    if(L('l2b')>=0&&L('l3')<0)pill('사장님 하루 8시간 = 0원으로 계산',960,800,{s:32,bg:'rgba(255,255,255,.95)'});
    sub('l6','l6',()=>{group(960,800,1,0,1,()=>{panel(-700,-50,1400,100,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('[가] vs [나] 차이 5,109만 원 > 어떤 손잡이보다 크다',0,4,{f:'D',s:40,c:C.gold,max:1360});});});
    if(L('l6')<0&&T>=CT('l2'))srcLine('예시 계산 · 손해 = 1년 동안 남긴 돈 − 창업비 · 한 번에 하나씩만 바꿈 (마지막 줄만 셋 다)',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('y1'),ov=L('y7');
    text('유행 업종 들어가기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:62,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['y2','본전 개월 수','창업비 ÷ 평소 한 달 남는 돈','정점 말고 평소로'],['y3','본전 판매량','고정비 ÷ 한 개 팔아 남는 돈','오늘 가게: 하루 141개'],['y4','여는 가게 vs 닫는 가게','한 달 개업 수와 폐업 수 비교','2024.5: 개업 71 < 폐업 118'],
      ['y5','사람들의 관심','언급량 · 검색량 추이','12만 8,931 → 1만 6,521건'],['y6','바꿀 수 있는 설비','유행이 끝나면 다른 메뉴로?','설비가 한 메뉴 전용이면 위험']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:38,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(L('y5')>=0&&ov<0)srcLine('썸트렌드 언급량 2023.9 → 2024.4 (파이낸셜뉴스 2024.5.16 인용)');
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-700,-260,1400,500,{bg:'rgba(6,13,32,1)',bd:C.gold});text('창업비 5,000만 · 하루 200개 · 한 개 2,600원 · 고정비 1,100만',0,-180,{f:'D',s:44,max:1320});
      text('200 × 30 × 2,600 − 1,100만 = 460만',0,-95,{f:'D',s:52,c:L('y7b')>=0?C.gold:'#fff'});const k=K('y7b',0);
      if(k>=0){text('5,000만 ÷ 460만 = 10.9개월',0,20,{f:'D',s:84,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});text('하루 100개로 꺾이면 → 매달 −320만',0,120,{f:'D',s:46,c:C.red,alpha:P(T,FR('y7b',.7),.3)});}else text('?',0,40,{f:'D',s:120,c:C.gold});
      if(L('y7c')>=0)text('정점 본전은, 정점이 끝나는 날 다시 계산',0,200,{s:34,w:900,alpha:P(L('y7c'),0,.3)});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('4,000원 탕후루 한 꼬치',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      const X=160,Wd=1600,y=380,h=150,s=Wd/4000,k=E.out(P(L('z2'),0,4));let xx=X;
      LY.forEach((o,i)=>{const w=o.v*s,kk=clamp(k*LY.length-i);if(kk<=0){xx+=w;return;}ctx.fillStyle=o.col;rr(xx,y-h/2,Math.max(2,w*kk-3),h,10);ctx.fill();if(kk>.5){text(won(o.v),xx+w/2,y+2,{f:'D',s:46,c:'#101420',max:w-10});text(o.name,xx+w/2,y+110,{s:w>150?30:24,w:900,c:o.k==='own'?C.green:'rgba(255,255,255,.85)',max:w-8});}xx+=w;});
      const b=L('z2b');if(b>=0)group(960,700,1,0,P(b,0,.3),()=>{ctx.fillStyle='#fff';rr(-640,-90,1280,180,30);ctx.fill();text('정점 1,240만 · 본전 6개월 → 매출은 두 달 만에 꺾였다',0,-28,{s:36,w:900,c:C.ink,max:1240});text('석 달 늦게 연 가게: 1년 뒤 −7,525만 원',0,40,{f:'D',s:52,c:'#d62f2f',max:1240});});
    }else{
      drawMascot(960,400,1.0,'think');
      stampBox('유행이 몇 달 가느냐',960,740,c,{s:72,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1480,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-340,-70,680,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 다음에 쪼개 볼 유행 디저트는?',0,4,{s:34,w:900,c:C.ink,max:640});});
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
