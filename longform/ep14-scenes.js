/* ════════════════════════════════════════════════════════════════════
   장면 (LF.14 빵 하나 1,500원 동네 빵집 계산서) — 수치·출처는 docs/longform-ep14.md
   중심 그림: 빵 하나 1,500원 = 100원 동전 15개. 재료 5 · 인건비 4 · 월세 2 · 잡비 2 · 사장님 2(버린 빵 반 개를 빼면 1.5).
   밀가루는 재료 동전 다섯 개 안의 80원(동전 0.8개). 반전: 밀가루 5% = 빵 하나 4원, 그런데 빵값 100원을 내리면 한 달 180만 → 65만.
   ════════════════════════════════════════════════════════════════════ */
const GR=[ // 동전 묶음 (동전 15개 = 1,500원)
  {k:'mat',name:'재료비',n:5,v:500,col:'#E8A33A'},
  {k:'labor',name:'인건비',n:4,v:400,col:'#c08cff'},
  {k:'rent',name:'월세·관리비',n:2,v:200,col:'#2ec4b6'},
  {k:'etc',name:'전기·가스·포장·카드',n:2,v:200,col:'#9aa4b8'},
  {k:'own',name:'사장님 몫',n:2,v:200,col:'#35E08A'},
];
const GRK=Object.fromEntries(GR.map(s=>[s.k,s]));
const SEQ=['1','8','0','0','0','0','0','÷','3','9','0','='];   // 한 달 몫 1,800,000 ÷ 390시간 = 4,615.38 (0 개수: 1800000 다섯, 390 하나)
function grT(k){return {mat:KT('s1',0),labor:KT('s3',0),rent:KT('s4',0),etc:KT('s5',0),own:KT('s6',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}

/* 100원 동전. ring: 묶음 색 테두리, part: 0~1 채운 비율(왼쪽부터), pc: 채움 색 */
function coin(x,y,r,o={}){const al=o.alpha??1;if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.translate(x,y);
  ctx.fillStyle='#7d8492';ctx.beginPath();ctx.arc(0,4,r,0,7);ctx.fill();
  const g=ctx.createLinearGradient(-r,-r,r,r);g.addColorStop(0,'#eef1f5');g.addColorStop(1,'#a9b0bc');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();
  if(o.pc){ctx.save();ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.clip();ctx.fillStyle=o.pc;ctx.fillRect(-r,-r,2*r*(o.part??1),2*r);ctx.restore();}
  ctx.strokeStyle=o.ring||'rgba(90,96,110,.9)';ctx.lineWidth=o.ring?Math.max(4,r*.12):Math.max(2,r*.05);ctx.beginPath();ctx.arc(0,0,r*.94,0,7);ctx.stroke();
  ctx.strokeStyle='rgba(80,86,100,.35)';ctx.lineWidth=Math.max(1.5,r*.03);ctx.beginPath();ctx.arc(0,0,r*.78,0,7);ctx.stroke();
  if(!o.noTxt)text('100',0,3,{f:'D',s:r*.62,c:o.pc&&(o.part??1)>.6?'#14161c':'#5b616e'});
  ctx.restore();}
/* 단팥빵 (위에서 본 둥근 빵 + 깨). s=1 이면 지름 약 200 */
function bread(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,70,110,24,0,0,7);ctx.fill();
  const g=ctx.createRadialGradient(-30,-40,10,0,0,110);g.addColorStop(0,o.burnt?'#8a5a2b':'#e9a85a');g.addColorStop(.7,o.burnt?'#5e3a1b':'#c0742e');g.addColorStop(1,o.burnt?'#3e2410':'#8f4f1c');
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,105,82,0,0,7);ctx.fill();
  ctx.fillStyle='rgba(255,240,200,.35)';ctx.beginPath();ctx.ellipse(-30,-36,40,18,-.4,0,7);ctx.fill();
  ctx.fillStyle='#fff3d6';[[-14,-8],[4,-14],[18,-2],[-4,6],[10,10],[-20,8]].forEach(([a,b])=>{ctx.beginPath();ctx.ellipse(a,b,4.5,2.6,a*.05,0,7);ctx.fill();});
  if(o.cut){ctx.fillStyle='#4a1f1a';ctx.beginPath();ctx.ellipse(0,20,60,26,0,0,7);ctx.fill();}
});}
/* 소금빵 (초승달꼴 롤) */
function saltBread(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(0,52,130,20,0,0,7);ctx.fill();
  for(let i=-3;i<=3;i++){const w=150-Math.abs(i)*28,yy=-Math.abs(i)*6;const g=ctx.createLinearGradient(0,yy-50,0,yy+50);g.addColorStop(0,'#f0c27a');g.addColorStop(1,'#b8722f');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(i*34,yy,w*.32,50-Math.abs(i)*5,0,0,7);ctx.fill();}
  ctx.fillStyle='#fff';[[-50,-30],[-12,-38],[30,-34],[62,-24],[0,-20],[-34,-14]].forEach(([a,b])=>{ctx.fillRect(a,b,5,5);});
});}
/* 밀가루 포대 (상표 없음) */
function flourBag(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='#f2ede2';ctx.beginPath();ctx.moveTo(-110,-150);ctx.lineTo(110,-150);ctx.lineTo(126,140);ctx.quadraticCurveTo(0,166,-126,140);ctx.closePath();ctx.fill();
  ctx.fillStyle='#e2dccd';ctx.beginPath();ctx.moveTo(-110,-150);ctx.lineTo(110,-150);ctx.lineTo(96,-120);ctx.lineTo(-96,-120);ctx.closePath();ctx.fill();
  ctx.fillStyle=o.col||'#2c6fd1';rr(-90,-80,180,110,10);ctx.fill();text('밀가루',0,-38,{s:38,w:900,c:'#fff'});text(o.kg||'20kg',0,8,{s:30,w:900,c:'#dbe8ff'});
  ctx.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(-60+i*30,110+(i%2)*8,6,0,7);ctx.fill();}
});}
/* 동네 빵집 외관 (상표 없음) */
function bakeryFront(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='#f6eadb';rr(-400,-300,800,560,18);ctx.fill();
  for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#fff':(o.aw||'#d9534f');ctx.beginPath();ctx.moveTo(-400+i*100,-200);ctx.lineTo(-300+i*100,-200);ctx.lineTo(-300+i*100,-140);ctx.quadraticCurveTo(-350+i*100,-110,-400+i*100,-140);ctx.closePath();ctx.fill();}
  ctx.fillStyle='#6b4423';rr(-400,-300,800,100,14);ctx.fill();text(o.name||'동네 빵집',0,-246,{f:'D',s:62,c:'#fff3d6'});
  ctx.fillStyle='#ffe9c2';rr(-360,-100,720,330,12);ctx.fill();ctx.strokeStyle='#6b4423';ctx.lineWidth=8;rr(-360,-100,720,330,12);ctx.stroke();
  for(let r=0;r<2;r++){ctx.fillStyle='#c79a6b';ctx.fillRect(-340,10+r*120,680,10);for(let i=0;i<6;i++)bread(-280+i*112,-14+r*120,.34);}
  if(o.light){ctx.fillStyle='rgba(255,220,120,.18)';rr(-360,-100,720,330,12);ctx.fill();}
});}
/* 오븐 */
function oven(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='#3b404c';rr(-200,-170,400,340,22);ctx.fill();ctx.fillStyle='#22252d';rr(-170,-120,340,190,16);ctx.fill();
  const g=ctx.createLinearGradient(0,-120,0,70);g.addColorStop(0,'rgba(255,140,40,.55)');g.addColorStop(1,'rgba(255,80,20,.15)');ctx.fillStyle=g;rr(-160,-110,320,170,12);ctx.fill();
  for(let i=0;i<3;i++)bread(-100+i*100,-10,.32);
  ctx.fillStyle='#c9ced9';rr(-140,100,280,20,8);ctx.fill();[-120,0,120].forEach(a=>{ctx.fillStyle='#9aa4b8';ctx.beginPath();ctx.arc(a,145,12,0,7);ctx.fill();});
});}
/* 진열대 (빵 n개, 버릴 빵은 회색) */
function shelf(x,y,n,keep,o={}){const cols=o.cols||10,gap=o.gap||74;for(let i=0;i<n;i++){const bx=x+(i%cols)*gap,by=y+Math.floor(i/cols)*gap*.82,k=o.t0==null?1:P(T,o.t0+i*.02,.15);if(k<=0)continue;bread(bx,by,.3*k,{alpha:i<keep?1:(o.fade??.35),burnt:i>=keep&&o.burnt});}}
/* 동전 15개 줄 (쪼개기 장면용). own 은 사장님 몫 동전 2개, wasteK 0~1 → 마지막 동전 반쪽이 버린 빵(빨강) */
function coinRow(X,y,r,gap,o={}){let i=0;GR.forEach(g=>{for(let j=0;j<g.n;j++,i++){const t=o.all?-1e9:grT(g.k);const on=T>=t;let pc=on?g.col:null,part=1;
  coin(X+i*gap,y,r,{pc,part,ring:on?g.col:null,alpha:o.alpha??1});
  if(g.k==='mat'&&j===0&&o.flourK>0){ctx.save();ctx.beginPath();ctx.arc(X,y,r,0,7);ctx.clip();ctx.fillStyle='#ffffff';ctx.fillRect(X-r,y-r,2*r*.8*o.flourK,2*r);ctx.restore();text('80',X,y+3,{f:'D',s:r*.6,c:'#14161c'});}
  if(g.k==='own'&&j===1&&o.wasteK>0){ctx.save();ctx.beginPath();ctx.arc(X+i*gap,y,r,0,7);ctx.clip();ctx.fillStyle=C.red;ctx.fillRect(X+i*gap,y-r,r*o.wasteK,2*r);ctx.restore();}
}});}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o2')){
      flourBag(520,560,1.5*E.back(P(a,0,.5))+.001);
      group(1300,330,1,-.03,P(a,.2,.3),()=>{panel(-420,-120,840,240,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:5});text('밀가루 · 설탕 공급가',0,-50,{s:44,w:900,c:C.dim});const q=K('o1',0);text(q>=0?'4~6% 인하':'?',0,40,{f:'D',s:96,c:C.gold});});
      if(T>FR('o1',.75))pill('2026년 2월 뉴스',1300,560,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('o1',.75),.3)});
      srcLine('제분·제당업계 설탕·밀가루 4~6% 인하 (뉴시스 2026.2.26)');
    }else if(T<CT('o3')){
      const b=L('o2');
      bread(560,520,1.6*E.back(P(b,0,.4))+.001);
      text('1,500원짜리 빵',560,780,{f:'D',s:56,alpha:P(b,.2,.3)});
      text('밀가루 5%가 내려 주는 돈',1350,300,{f:'D',s:50,c:C.dim,alpha:P(b,.4,.3)});
      big('o2',0,1350,470,'4원',{f:'D',s:200,c:C.red,glow:'rgba(255,77,77,.45)'});
      srcLine('예시 빵 · 밀가루 80원 가정 · 계산은 아래 장에서');
    }else if(T<CT('o4')){
      const b=L('o3');
      flourBag(420,560,1,{alpha:P(b,0,.3)});bread(700,640,.8,{alpha:P(b,.15,.3)});
      drawMascot(1450,520,.95,'think',{alpha:P(b,0,.3)});
      group(1260,190,E.back(P(b,.2,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-470,-60,940,120,30);ctx.fill();text('빵값 = 밀가루값 아닐까?',0,4,{s:46,w:900,c:C.ink});});
    }else if(T<CT('o5')){
      const b=L('o4');
      text('예시 동네 빵집 · 빵 하나 1,500원',960,180,{f:'D',s:56,c:C.dim,alpha:P(b,0,.3)});
      coinRow(190,360,48,110,{all:true,alpha:P(b,0,.3)});
      const q=K('o4',0);
      if(q>=0){const k=E.out(P(q,0,.5));ctx.save();ctx.globalAlpha*=k;ctx.strokeStyle=C.red;ctx.lineWidth=6;rr(190+5*110-64,280,8*110+18,160,24);ctx.stroke();ctx.restore();
        text('사람과 가게 800원',190+5*110+8*110/2-55,500,{f:'D',s:60,c:C.red,alpha:k});
        ctx.save();ctx.globalAlpha*=k;ctx.strokeStyle='#E8A33A';ctx.lineWidth=6;rr(190-64,280,5*110+18,160,24);ctx.stroke();ctx.restore();
        text('재료 전부 500원',190+2*110,500,{f:'D',s:48,c:'#E8A33A',alpha:k});}
      else text('?',960,560,{f:'D',s:100,c:C.gold});
      if(T>FR('o4',.7))stampBox('사람·가게 800원 > 재료 500원',960,700,T-FR('o4',.7),{s:60,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('예시 가정 · 인건비 400 + 월세 200 + 잡비 200');
    }else if(T<CT('o6')){
      const b=L('o5');
      text('빵값을 100원 내리면 (손님 그대로)',960,180,{f:'D',s:58,c:C.gold,alpha:P(b,0,.3)});
      text('180만',560,400,{f:'D',s:110,c:C.dim});text('→',880,400,{f:'D',s:100,c:C.dim});big('o5',0,1300,400,'65만 원',{f:'D',s:150,c:C.red,glow:'rgba(255,77,77,.45)'});
      text('사장님 한 달 몫',960,560,{s:44,w:900,c:C.dim,alpha:P(b,.3,.3)});
      srcLine('예시 가정 · 밀가루 5% 인하를 넣은 계산');
    }else if(T<CT('o7')){
      const b=L('o6');
      text('굽는 빵 440개 그대로 · 손님 10% 줄면',960,180,{f:'D',s:54,c:C.gold,alpha:P(b,0,.3)});
      shelf(250,330,44,36,{cols:11,gap:130,t0:CT('o6'),fade:.3});
      const q=K('o6',0);if(q>=0)stampBox('사장님 몫 0원',960,800,q,{s:76,c:C.red,bg:'rgba(40,0,0,.9)'});
      srcLine('그림 빵 하나 = 10개 · 예시 가정');
    }else{
      const k9=L('o7'),k10=L('o8');
      text('빵값을 정하기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:76,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['빵 물가·원가 비중 (보도·보고서)','밀가루 가격 (보도·공정위)','가게 숫자 = 예시 가정'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,400+i*560,760,{s:32,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o9');
    text('빵 하나 1,500원 동네 빵집 계산서',960,250,{f:'D',s:120,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1750});
    text('빵값은 밀가루값일까',960,400,{s:56,w:900,alpha:P(a,.3,.3)});
    bakeryFront(700,740,.5,{alpha:P(a,.2,.3)});bread(1130,800,.9,{alpha:P(a,.3,.3)});drawMascot(1450,720,.8,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p2',()=>{bakeryFront(560,500,.85,{light:true});
      if(L('p2')>=0){text('골목 동네 빵집',1380,300,{f:'D',s:56,c:C.gold});
        ['사장님이 새벽에 직접 굽는다','직원 한 명 + 알바','세금 제외'].forEach((s,i)=>pill(s,1380,420+i*100,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p2',.3+i*.15),.3)}));
        text('예시 가정',1380,720,{s:36,w:900,c:C.dim,alpha:P(L('p2'),1,.3)});}});
    sub('p3','p3',()=>{text('빵 하나 평균 가격',960,170,{f:'D',s:56,c:C.gold});
      const q=K('p3',0);bread(560,500,1.4);text(q>=0?'1,500원':'?',560,740,{f:'D',s:90,c:C.gold,alpha:q>=0?P(q,0,.3):1});text('예시 가게',560,820,{s:32,w:900,c:C.dim});
      if(T>FR('p3',.4))group(1340,480,1,0,P(T,FR('p3',.4),.3),()=>{panel(-400,-200,800,400,{bd:'rgba(255,255,255,.3)'});text('한 대형 프랜차이즈 단팥빵',0,-130,{s:38,w:900,c:C.dim});
        text('1,600원',-170,-10,{f:'D',s:70,c:C.dim});text('→',40,-10,{f:'D',s:60,c:C.dim});text('1,500원',230,-10,{f:'D',s:80,c:C.gold});text('2026년 3월부터',0,110,{s:36,w:900});});
      srcLine('뉴시스·세계일보 2026.2.26 (브랜드 이름은 쓰지 않음)');});
    sub('p4','p4',()=>{text('하루 440개를 굽고',960,170,{f:'D',s:56,c:C.gold});
      shelf(300,310,44,40,{cols:11,gap:120,t0:CT('p4')});
      const q=K('p4',0);if(q>=0){text('팔리는 빵 400개',700,720,{f:'D',s:64,c:C.green,alpha:P(q,0,.3)});text('남는 빵 40개',1400,720,{f:'D',s:52,c:C.dim,alpha:P(q,.2,.3)});}
      if(T>FR('p4',.6))pill('한 달 1만 2,000개 · 매출 1,800만 원',960,820,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p4',.6),.3)});
      srcLine('그림 빵 하나 = 10개 · 예시 가정',872-0);});
    sub('p5','p5',lt=>{bread(420,480,1.3*(1-P(lt,1,.6))+.001);
      for(let i=0;i<15;i++){const k=E.back(P(lt,1+i*.06,.3));if(k<=0)continue;coin(700+(i%5)*220,330+Math.floor(i/5)*190,70*k);}
      text('빵 하나 1,500원 = 100원 동전 15개',960,820,{f:'D',s:60,c:C.gold,alpha:P(lt,1.5,.4)});});
  }},
  /* ── 1,500원 쪼개기 ── */
  cut:{draw(){
    const X=190,y=320,r=48,gap=110;
    const fk=L('s2')>=0?E.out(P(K('s2',0),0,.5)):0,wk=L('s7')>=0?E.out(P(K('s7',0),0,.5)):0;
    text('빵 하나 1,500원 = 동전 15개',X-50,200,{a:'left',f:'D',s:44,c:C.gold});
    coinRow(X,y,r,gap,{flourK:K('s2',0)>=0?fk:0,wasteK:wk});
    // 묶음 이름표
    let i0=0;GR.forEach((g,gi)=>{const t=grT(g.k);if(T>=t){const al=P(T,t,.3),x0=X+i0*gap-r,x1=X+(i0+g.n-1)*gap+r,yy=y+r+26;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=g.col;ctx.lineWidth=4;line(x0+6,yy,x1-6,yy);line(x0+6,yy,x0+6,yy-14);line(x1-6,yy,x1-6,yy-14);ctx.restore();
      text(g.name,(x0+x1)/2,yy+38,{s:g.n>2?30:24,w:900,c:g.col,alpha:al,max:x1-x0+10});text((g.k==='own'&&wk>.5?150:g.v).toLocaleString('ko-KR')+'원',(x0+x1)/2,yy+78,{f:'D',s:34,c:g.k==='own'?C.green:'#fff',alpha:al});}i0+=g.n;});
    if(wk>0){const xw=X+14*gap;text('버린 빵 50',xw+40,y-r-26,{f:'D',s:30,c:C.red,alpha:wk});}
    if(fk>0)text('밀가루 80',X+10,y-r-26,{f:'D',s:30,c:'#fff',alpha:fk});
    const Y=760;
    sub('s1','s1',()=>{text('첫 번째: 재료비',960,Y-90,{f:'D',s:54,c:GRK.mat.col});text('밀가루 · 버터 · 설탕 · 팥 (예시)',960,Y-10,{s:36,w:900});popText(KT('s1',0),960,Y+75,'500원 = 동전 5개',{f:'D',s:72,c:GRK.mat.col});});
    sub('s2','s2',()=>{text('그중 밀가루',960,Y-90,{f:'D',s:54,c:'#fff'});text('예시 가정 · 동전 한 개도 안 된다',960,Y-10,{s:36,w:900});popText(KT('s2',0),960,Y+75,'80원',{f:'D',s:90,c:'#fff'});});
    sub('s3','s3',()=>{text('두 번째: 인건비',960,Y-90,{f:'D',s:54,c:GRK.labor.col});text('직원 + 알바 한 달 480만 ÷ 1만 2,000개 (예시)',960,Y-10,{s:36,w:900});popText(KT('s3',0),960,Y+75,'400원',{f:'D',s:80,c:GRK.labor.col});});
    sub('s4','s4',()=>{text('세 번째: 월세 · 관리비',960,Y-90,{f:'D',s:54,c:GRK.rent.col});text('한 달 240만 ÷ 1만 2,000개 (예시)',960,Y-10,{s:36,w:900});popText(KT('s4',0),960,Y+75,'200원',{f:'D',s:80,c:GRK.rent.col});});
    sub('s5','s5',()=>{text('네 번째: 오븐 전기 · 가스 · 포장 · 카드 수수료',960,Y-90,{f:'D',s:50,c:GRK.etc.col});text('한 달 240만 ÷ 1만 2,000개 (예시)',960,Y-10,{s:36,w:900});popText(KT('s5',0),960,Y+75,'200원',{f:'D',s:80,c:'#fff'});});
    sub('s6','s6',()=>{text('1,500 − 500 − 400 − 200 − 200',960,Y-90,{f:'D',s:46,c:C.dim});text('사장님 몫',960-270,Y+20,{f:'D',s:56,c:C.green});big('s6',0,960+140,Y+20,'200원',{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)'});});
    sub('s7','s7',()=>{text('버린 빵: 하루 40개 × 재료 500원 × 30일 = 한 달 60만 원',960,Y-90,{s:38,w:900,c:C.dim,max:1800});text('60만 ÷ 1만 2,000개',960,Y-20,{s:36,w:900});popText(KT('s7',0),960,Y+70,'빵 하나에 −50원',{f:'D',s:80,c:C.red});});
    sub('s8','s8',()=>{text('사장님 몫',960-420,Y-60,{f:'D',s:44,c:C.dim});big('s8',0,960-420,Y+40,'150원',{f:'D',s:100,c:C.green,glow:'rgba(53,224,138,.45)'});
      text('× 1만 2,000개',960+380,Y-60,{s:40,w:900,c:C.dim,alpha:P(T,FR('s8',.5),.3)});text('한 달 180만 원',960+380,Y+40,{f:'D',s:76,c:C.gold,alpha:P(T,FR('s8',.6),.3)});});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('÷'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} ÷ ${n2.replace('=','')} =`;bigS='4,615.38';}else if(n2!==undefined){small=`${fmt(n1)} ÷`;bigS=n2||fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('사장님 한 달 몫 180만 원',1350,250,{f:'D',s:56,c:C.gold,alpha:P(a,.2,.3),max:1000});text('÷ 일한 시간 (새벽 4시부터 하루 13시간 × 30일)',1350,345,{s:34,w:900,alpha:P(a,.4,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{const c2=L('c2');group(1350,520,1,0,P(c2,0,.3),()=>{panel(-470,-80,940,160,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('사장님 시급 (390시간)',0,-30,{s:36,w:900,c:C.dim});const q=K('c2',0);text(q>=0?'4,615원':'?',0,32,{f:'D',s:60,c:C.red});});
        if(L('c3')>=0){group(1350,700,1,0,P(L('c3'),0,.3),()=>{hbar(-430,0,640,56,4615,11000,C.red,'',{});ctx.strokeStyle=C.gold;ctx.lineWidth=5;const mx=-430+640*10320/11000;line(mx,-40,mx,40);text('최저시급 1만 320원',mx-10,-62,{s:30,w:900,c:C.gold});});
          if(T>FR('c3',.5))stampBox('알바보다 낮은 사장님 시급',1350,850,T-FR('c3',.5),{s:44,c:C.red,bg:'rgba(40,0,0,.9)'});}}}
    if(dt>=0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 밀가루 5%의 계산 ── */
  flour:{draw(){
    sub('f1','f1',lt=>{flourBag(560,520,1.5*E.back(P(lt,0,.5))+.001);text('밀가루가 내리면',1300,330,{f:'D',s:86,c:C.gold});text('빵값은 얼마나?',1300,460,{f:'D',s:80});drawMascot(1700,780,.6,'think',{alpha:P(lt,.5,.3)});});
    sub('f2','f2',()=>{text('한 제분 업체 밀가루 가격 인하 (2026년)',960,165,{f:'D',s:52,c:C.gold});
      [['1월 · 업소용','−4%',CT('f2')+.4,420],['2월 · 소비자용','−5.5%',FR('f2',.35),960],['2월 말 · 추가','−5%',FR('f2',.7),1500]].forEach(([l,v,t,x])=>{const k=E.back(P(T,t,.4));if(k<=0)return;group(x,450,k,0,1,()=>{flourBag(0,-40,.75);text(v,0,170,{f:'D',s:80,c:'#6FD3FF'});text(l,0,250,{s:36,w:900});});});
      srcLine('뉴시스·세계일보 2026.2.26 (평균 인하율, 업체 발표)');});
    sub('f3','f4',()=>{text('빵 하나에서 줄어드는 돈',960,160,{f:'D',s:56,c:C.gold});
      const rows=[['밀가루 80원 × 5%',4,'4원','f3',KT('f3',0),'#fff'],['재료 500원 전부 × 5%',25,'25원','f4',KT('f4',0),'#E8A33A'],['한 프랜차이즈 단팥빵 인하',100,'100원','f4',KT('f4',1),C.red]];
      rows.forEach(([l,v,lab,id,t,col],i)=>{if(L(id)<0)return;const y=320+i*160;text(l,700,y,{a:'right',f:'D',s:44,c:i===2?'#ffb3b3':'#fff'});if(T<t){text('?',780,y,{f:'D',s:60,c:C.gold});return;}hbar(740,y,1000,90,v,110,col,lab,{s:54,k:E.out(P(T,t,.6))});});
      if(L('f4')>=0&&K('f4',1)>.8)srcLine('예시 빵 숫자는 가정 · 단팥빵 1,600 → 1,500원 (뉴시스 2026.2.26)');});
    sub('f5','f5',()=>{text('다른 대형 프랜차이즈 (2026년 3월)',960,170,{f:'D',s:54,c:C.gold});
      group(560,480,1,0,1,()=>{panel(-380,-200,760,400,{bd:'rgba(255,255,255,.3)'});text('가맹점에 넘기는 공급가',0,-120,{s:38,w:900,c:C.dim});const q=K('f5',0);text(q>=0?'평균 −8.2%':'?',0,0,{f:'D',s:96,c:'#6FD3FF'});text('빵 · 케이크 17종',0,110,{s:34,w:900});});
      if(T>FR('f5',.6))group(1360,480,1,0,P(T,FR('f5',.6),.3),()=>{panel(-380,-200,760,400,{bd:'rgba(255,255,255,.3)'});text('권장 소비자가격',0,-120,{s:38,w:900,c:C.dim});text('100~1,100원',0,0,{f:'D',s:84,c:C.gold});text('빵류 16종 인하',0,110,{s:34,w:900});});
      srcLine('뉴시스·세계일보 2026.2.26 · 가맹점 몫 변화는 공개되지 않음');});
    sub('f6','f7',()=>{text('동네 빵집이 100원을 따라 내리면 (손님 그대로)',960,160,{f:'D',s:50,c:C.gold});
      const rows=[['재룟값 (밀가루 −5%)','빵 하나 −4원','#6FD3FF',FR('f6',.45)],['매출','한 달 −120만 원',C.red,FR('f6',.75)]];
      rows.forEach(([l,v,col,t],i)=>{if(T<t)return;const y=290+i*110;text(l,780,y,{a:'right',f:'D',s:44,c:C.dim,alpha:P(T,t,.3)});text(v,820,y,{a:'left',f:'D',s:56,c:col,alpha:P(T,t,.3)});});
      if(L('f7')>=0){text('사장님 한 달 몫',600,560,{f:'D',s:40,c:C.dim});text('180만 →',600,650,{f:'D',s:60,c:C.dim});big('f7',0,600,760,'65만 원',{f:'D',s:100,c:C.red,glow:'rgba(255,77,77,.4)'});
        text('되돌리려면 하루',1380,560,{f:'D',s:40,c:C.dim});const q=K('f7',1);if(q>=0){text('400 → 443개',1380,680,{f:'D',s:84,c:C.gold,alpha:P(q,0,.3)});pill('+11%',1380,790,{s:40,alpha:P(q,.3,.3),bg:'rgba(255,230,150,.95)'});}else text('?',1380,680,{f:'D',s:100,c:C.gold});}
      else srcLine('예시 가정 · 한 달 1만 2,000개 × 100원 = 120만 원');});
    sub('f8','f8',lt=>{text('손님이 기대하는',560,300,{f:'D',s:50,c:C.dim});text('100원',560,460,{f:'D',s:160,c:C.gold});
      text('밀가루가 내려 준',1360,300,{f:'D',s:50,c:C.dim});text('4원',1360,460,{f:'D',s:160,c:'#6FD3FF'});
      text('↔',960,460,{f:'D',s:100,c:C.dim});stampBox('그 사이에 동네 빵집의 고민',960,720,lt-1.2,{s:56,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 빵값을 올린 것 ── */
  report:{draw(){
    sub('r1','r1',lt=>{bread(600,520,1.6*E.back(P(lt,0,.5))+.001);text('빵값은 왜',1300,360,{f:'D',s:90,c:C.gold});text('그렇게 올랐을까?',1300,490,{f:'D',s:76});});
    sub('r2','r3',()=>{text('빵 물가 (2025년 5월, 1년 전 대비)',960,165,{f:'D',s:52,c:C.gold});
      text('빵',560,340,{a:'right',f:'D',s:56});hbar(600,340,900,100,6.4,8,C.red,'+6.4%',{s:56,k:E.out(P(T,KT('r2',0),.6))});if(K('r2',0)<0)text('?',700,340,{f:'D',s:60,c:C.gold});
      text('가공식품',560,490,{a:'right',f:'D',s:50,c:C.dim});hbar(600,490,900,100,4.1,8,'#9aa4b8','+4.1%',{s:50,k:E.out(P(T,FR('r2',.8),.6))});
      if(L('r3')>=0)group(960,700,1,0,P(L('r3'),0,.3),()=>{panel(-620,-90,1240,180,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('빵 물가지수 (2020년 = 100)',-560,-30,{a:'left',s:36,w:900,c:C.dim});const q=K('r3',0);text(q>=0?'138.48 · 5년 +38%':'?',-560,40,{a:'left',f:'D',s:60,c:C.gold});});
      srcLine('통계청 소비자물가 (아시아경제 2025.7.19 인용)');});
    sub('r4','r5',()=>{text('빵을 만드는 비용 중 (2022년)',960,160,{f:'D',s:54,c:C.gold});
      text('빵',360,250,{f:'D',s:44,c:'#fff'});text('식품제조업 평균',360,300,{s:28,w:900,c:C.dim});
      const rows=[['원재료비',50.1,74.5,'r4',KT('r4',0),'#E8A33A'],['인건비',28.7,8.1,'r5',KT('r5',0),'#c08cff']];
      rows.forEach(([l,v,avg,id,t,col],i)=>{if(L(id)<0)return;const y=400+i*220;text(l,360,y+20,{a:'right',f:'D',s:50,c:col});
        if(T<t){text('?',460,y,{f:'D',s:56,c:C.gold});}else hbar(400,y-24,1100,70,v,80,col,v+'%',{s:50,k:E.out(P(T,t,.6))});
        hbar(400,y+56,1100,40,avg,80,'rgba(255,255,255,.35)','평균 '+avg+'%',{s:32,lc:C.dim});});
      if(L('r5')>=0&&T>FR('r5',.65))pill('2018~2022 인건비 비중 +12.1%p',1300,860-60,{s:34,bg:'rgba(230,210,255,.95)',alpha:P(T,FR('r5',.65),.3)});
      srcLine('공정위 의뢰 \'제빵산업 시장분석\' 보고서 (공주대 산학협력단, 아시아경제 2025.7.19 인용)');});
    sub('r6','r7',()=>{text('공정위 · 제분사 7곳 밀가루 담합 제재 (2026년 5월)',960,165,{f:'D',s:50,c:C.gold,max:1800});
      for(let i=0;i<7;i++)flourBag(260+i*230,400,.55,{alpha:P(T,CT('r6')+.2+i*.1,.3),col:'#7d8492'});
      const q=K('r6',0);if(q>=0)stampBox('과징금 6,710억 원 · 역대 최대',960,620,q,{s:56,c:C.red,bg:'rgba(40,0,0,.9)'});
      if(L('r7')>=0)group(960,790,1,0,P(L('r7'),0,.3),()=>{panel(-700,-60,1400,120,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.3)'});text('2019.12 → 2022.9 회사별 밀가루 판매가',-640,4,{a:'left',s:36,w:900,max:760});const r=K('r7',0);text(r>=0?'+38~74%':'?',640,4,{a:'right',f:'D',s:56,c:C.red});});
      srcLine('공정위 발표 (뉴시스 2026.5.20) · 담합 기간 2019.11~2025.10 · 중력분 회사별 평균',872+0);});
    sub('r8','r8',lt=>{text('예시 빵의 밀가루 80원이 74% 오르면',960,170,{f:'D',s:54,c:C.gold});
      coin(560,450,110,{pc:'#fff',part:.8});text('80원',560,620,{f:'D',s:56});text('→',860,450,{f:'D',s:90,c:C.dim});
      const q=K('r8',0);if(q>=0){coin(1160,450,110,{pc:'#fff',part:1,alpha:P(q,0,.3)});coin(1420,450,110,{pc:C.red,part:.39,alpha:P(q,0,.3)});text('139원 (+59원)',1290,620,{f:'D',s:60,c:C.red,alpha:P(q,0,.3)});}else text('?',1290,450,{f:'D',s:120,c:C.gold});
      if(T>FR('r8',.7))stampBox('더 큰 덩어리는 사람 손에',960,780,T-FR('r8',.7),{s:56,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 버리는 빵 ── */
  waste:{draw(){
    sub('w1','w1',lt=>{coin(600,480,170*E.back(P(lt,0,.5))+.001,{pc:C.red,part:.5});const q=K('w1',0);if(q>=0)popText(q,600,720,'버리는 빵',{f:'D',s:80,c:C.red});text('동전 반 개',1300,420,{f:'D',s:90,c:C.gold,alpha:P(lt,.3,.3)});text('= 빵 하나에 50원',1300,540,{f:'D',s:60,alpha:P(lt,.5,.3)});});
    sub('w2','w2',lt=>{text('저녁 진열대',600,170,{f:'D',s:54,c:C.gold});
      group(600,500,1,0,1,()=>{ctx.fillStyle='#6b4423';rr(-420,-240,840,480,20);ctx.fill();for(let r=0;r<3;r++){ctx.fillStyle='#c79a6b';ctx.fillRect(-400,-120+r*140,800,12);}
        const left=Math.max(0,Math.round(18*(1-P(lt,.5,2))));for(let i=0;i<left;i++)bread(-330+(i%6)*130,-160+Math.floor(i/6)*140,.36);});
      text('빈 진열대 →',1380,420,{f:'D',s:60,c:C.dim,alpha:P(lt,2,.3)});text('손님은 다른 빵집으로',1380,520,{f:'D',s:56,c:C.red,alpha:P(lt,2.4,.3)});});
    sub('w3','w3',()=>{text('400개를 팔려고 440개를 굽는다',960,160,{f:'D',s:56,c:C.gold});
      shelf(300,300,44,40,{cols:11,gap:120,burnt:true,fade:.9});
      text('남는 40개 × 재료 500원',960,670,{s:44,w:900,c:C.dim});big('w3',0,700,770,'하루 2만 원',{f:'D',s:80,c:C.red});
      if(T>FR('w3',.8))text('한 달 60만 원',1300,770,{f:'D',s:70,c:C.red,alpha:P(T,FR('w3',.8),.3)});
      srcLine('그림 빵 하나 = 10개 · 예시 가정 (버리는 비율에 공식 통계 없음)');});
    sub('w4','w5',()=>{text('마감 반값 (750원) 계산',960,160,{f:'D',s:56,c:C.gold});
      text('버리면',560,330,{a:'right',f:'D',s:50,c:C.dim});text('−500원 (재룟값)',600,330,{a:'left',f:'D',s:56,c:C.red});
      text('반값에 팔면',560,450,{a:'right',f:'D',s:50});const q=K('w4',0);text(q>=0?'+250원 (750 − 500)':'?',600,450,{a:'left',f:'D',s:56,c:C.green,alpha:q>=0?P(q,0,.3):1});
      if(L('w5')>=0)group(960,700,1,0,P(L('w5'),0,.3),()=>{panel(-760,-120,1520,240,{bg:'rgba(6,13,32,1)',bd:C.red,lw:4});text('정가로 팔리던 빵 하루 10개가 반값으로 옮겨 가면',0,-50,{s:38,w:900,max:1440});text('10개 × 750원 × 30일',-280,40,{f:'D',s:46,c:C.dim});const r=K('w5',0);text(r>=0?'한 달 −22만 5,000원':'?',380,40,{f:'D',s:56,c:C.red});});});
    sub('w6','w6',lt=>{['굽는 개수','마감 시간','손님 습관'].forEach((s,i)=>{const k=E.back(P(lt,.2+i*.3,.4));if(k<=0)return;group(420+i*540,420,k,0,1,()=>{panel(-220,-130,440,260,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text(s,0,0,{f:'D',s:56,c:C.gold});});});
      stampBox('셋을 같이 봐야 버리는 빵이 준다',960,720,lt-1.4,{s:52,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 990원 소금빵 ── */
  salt:{draw(){
    sub('x1','x1',lt=>{saltBread(600,500,2.4*E.back(P(lt,0,.5))+.001);const q=K('x1',0);group(1350,420,q>=0?lerp(1.4,1,E.out(P(q,0,.35))):1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-300,-110,600,220,24);ctx.fill();text('소금빵',0,-48,{s:40,w:900,c:C.ink});text(q>=0?'990원':'?',0,36,{f:'D',s:110,c:'#d62f2f'});});
      text('한 팝업 빵집 (2025년 가을)',1350,640,{s:38,w:900,c:C.dim,alpha:P(lt,.4,.3)});srcLine('아시아경제 2025.9.1');});
    sub('x2','x3',()=>{text('990원이 가능했던 이유 (보도)',960,160,{f:'D',s:54,c:C.gold});
      ['직거래로 유통 줄이기','모양·포장 단순화 → 일손 줄이기','마진율 아닌 마진액'].forEach((s,i)=>{const t=i<2?CT('x2')+.4+i*.8:CT('x3');if(T<t)return;pill(s,960,280+i*100,{s:40,alpha:P(T,t,.3),bg:i===2?'rgba(255,230,150,.95)':'rgba(255,255,255,.92)'});});
      if(L('x3')>=0){[['원가 200원',200,'1,000원',600],['원가 1,200원',1200,'2,000원',1320]].forEach(([l,v,p,x],i)=>{const t=FR('x3',.35+i*.15);if(T<t)return;const k=E.out(P(T,t,.5)),base=830,sc=.17;vCash(x-110,base-v*sc*k,220,v*sc*k,'#9aa4b8');vCash(x-110,base-(v+800)*sc*k,220,800*sc*k-4,C.green);text(l,x-150,base-v*sc/2,{a:'right',s:30,w:900,c:C.dim,alpha:k});text('판매가 '+p,x,base-(v+800)*sc-30,{f:'D',s:40,c:'#fff',alpha:k});});
        const q=K('x3',0);if(q>=0)stampBox('빵마다 800원',960,640,q,{s:50,c:C.green,bg:'rgba(0,40,20,.9)',rot:-.04});}
      srcLine('아시아경제 2025.9.1 (기사 속 마진액 예시)');});
    sub('x4','x5',()=>{text('우리 예시 빵집이 소금빵을 990원에 팔면',960,160,{f:'D',s:52,c:C.gold});
      const base=780,sc=.42,x=760;
      ctx.strokeStyle=C.gold;ctx.lineWidth=5;ctx.setLineDash([12,8]);line(x-260,base-990*sc,x+700,base-990*sc);ctx.setLineDash([]);text('판매가 990원',x+720,base-990*sc,{a:'left',f:'D',s:40,c:C.gold});
      vCash(x-150,base-400*sc,300,400*sc,'#E8A33A');text('재료 400',x,base-200*sc,{f:'D',s:40,c:'#2a1a05'});
      if(T>FR('x4',.6)){const k=E.out(P(T,FR('x4',.6),.6));vCash(x-150,base-(400+800*k)*sc,300,800*sc*k-4,'#c08cff');text('사람·가게 800',x,base-800*sc,{f:'D',s:40,c:'#1a0d2a',alpha:k});}
      if(L('x5')>=0){const q=K('x5',0);if(q>=0){ctx.save();ctx.globalAlpha*=P(q,0,.3);ctx.fillStyle='rgba(255,77,77,.35)';rr(x-150,base-1200*sc,300,210*sc,10);ctx.fill();ctx.restore();big('x5',0,1340,560,'하나에 −210원',{f:'D',s:76,c:C.red,glow:'rgba(255,77,77,.4)'});}else text('?',1340,560,{f:'D',s:90,c:C.gold});}
      srcLine('예시 가정 · 사람·가게 800원 = 인건비 400 + 월세 200 + 잡비 200');});
    sub('x6','x6',()=>{text('가게 빵을 전부 990원에 판다면',960,165,{f:'D',s:56,c:C.gold});
      text('한 달 고정비 960만 원 ÷ 한 개 590원 (990 − 400)',960,280,{s:40,w:900,c:C.dim});
      text('지금 하루',480,400,{f:'D',s:44,c:C.dim});text('400개',480,500,{f:'D',s:80});
      text('본전 하루',1400,400,{f:'D',s:44,c:C.dim});big('x6',0,1400,500,'543개',{f:'D',s:100,c:C.red});
      if(T>FR('x6',.75))stampBox('+36%',960,700,T-FR('x6',.75),{s:80,c:C.red,bg:'rgba(40,0,0,.9)'});});
    sub('x7','x7',lt=>{saltBread(520,520,1.6);text('990원 =',1280,360,{f:'D',s:70,c:C.dim});text('많이 팔 수 있는 곳에서',1280,470,{f:'D',s:66,c:C.gold});text('고정비를 잘게 나눈 숫자',1280,570,{f:'D',s:66,c:C.gold});});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('예시 동네 빵집 사장님 한 달 몫 · 하나씩만 바꿔 보면',960,165,{f:'D',s:44,c:C.gold,alpha:P(a,0,.3),max:1800});
    if(T<CT('l2'))text('바꿀 수 있는 숫자는?',960,500,{f:'D',s:90,alpha:P(a,.2,.3)});
    const rows=[['지금',180,'l1','180만'],['밀가루 −5%',185.3,'l2','185만'],['버리는 빵 절반',210,'l3','210만'],['빵값 +100원',300,'l4','300만'],['손님 +10%',300,'l5','300만'],['빵값 −100원',60,'l6','60만'],['손님 −10%',0,'l7','0원']];
    const Z=520,SCL=3.2;
    ctx.save();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;if(T>=CT('l1')+1)line(Z,215,Z,820);ctx.restore();
    if(T>=CT('l2')){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(Z+180*SCL,215,Z+180*SCL,820);ctx.restore();}
    rows.forEach(([l,v,id,lab],i)=>{const t=i?CT(id):CT('l1')+1.2;if(T<t-.1)return;const y=250+i*84,tk=i?KT(id,0):t,k=E.out(P(T,tk,.6));const bad=id==='l6'||id==='l7';text(l,60,y,{a:'left',s:34,w:900,max:440,c:bad?'#ffb3b3':'#fff'});
      if(T<tk){text('?',Z+60,y,{f:'D',s:52,c:C.gold});return;}
      const w=Math.max(6,v*SCL*k),col=bad?C.red:i===0?'#5b6275':C.green;ctx.fillStyle=col;rr(Z,y-28,w,56,14);ctx.fill();
      text(lab,Z+w+18,y+2,{a:'left',f:'D',s:44,c:col==='#5b6275'?'#c9ced9':col,alpha:k});});
    if(L('l5')>=0&&L('l6')<0&&T>FR('l5',.55))pill('100원 올리기 = 손님 10% 늘기',1400,590,{s:36,bg:'rgba(255,230,150,.95)'});
    sub('l8','l8',()=>{group(960,830,1,0,1,()=>{panel(-760,-46,1520,92,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('한 달을 흔드는 건 밀가루값보다 팔리는 빵의 개수',0,4,{f:'D',s:38,c:C.gold,max:1480});});});
    if(L('l8')<0&&T>=CT('l2'))srcLine('예시 계산 · 한 번에 하나씩 · 손님 −10%는 굽는 개수 그대로',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('빵값을 정하기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','빵 하나의 고정비','(인건비 + 월세 + 잡비) ÷ 판매 개수','오늘 가게: 800원'],['k3','재료비 중 밀가루 몫','원재료 뉴스 → 내 빵 하나에 몇 원','오늘 가게: 80원 (5% = 4원)'],['k4','버리는 빵 비율','구운 개수 − 판 개수, 일주일 기록','오늘 가게: 440개 중 40개'],
      ['k5','100원의 무게','100원 내리면 몇 개 더 팔아야?','오늘 가게: 하루 400 → 443개'],['k6','손님 10%의 무게','손님 −10%면 내 몫은?','오늘 가게: 180만 → 0원']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-760,-280,1520,540,{bg:'rgba(6,13,32,1)',bd:C.gold});text('하루 300개 · 평균 2,000원 · 재료 하나에 600원',0,-200,{f:'D',s:40,max:1440});text('한 달 고정비 900만 원 · 하루 30개를 버리면 → 사장님 한 달 몫은?',0,-140,{f:'D',s:38,max:1440});
      const b=L('k7b');text('하나 1,400원 × 한 달 9,000개 = 1,260만 원',0,-50,{f:'D',s:44,c:b>=0?C.gold:'#fff',alpha:b>=0?1:0,max:1440});
      if(b>=0)text('− 고정비 900만 − 버린 빵 54만 (30개 × 600원 × 30일)',0,30,{f:'D',s:40,alpha:P(T,FR('k7b',.45),.3),max:1440});
      const k=K('k7b',0);if(k>=0)text('306만 원',0,140,{f:'D',s:100,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});else text('?',0,140,{f:'D',s:110,c:C.gold});
      if(L('k7c')>=0)text('빵값 계산서는 진열대에 남은 빵까지 세어야 끝난다',0,232,{s:34,w:900,alpha:P(L('k7c'),0,.3)});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('빵 하나 1,500원',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      const k=P(L('z2'),0,4.5),X=190,y=380,r=48,gap=110;
      const parts=[['재료',5,'#E8A33A'],['인건비',4,'#c08cff'],['월세',2,'#2ec4b6'],['잡비',2,'#9aa4b8'],['버린 빵',.5,C.red],['사장님',1.5,C.green]];
      let acc=0;parts.forEach(([nm,n,col],pi)=>{const shown=clamp(k*6-pi);if(shown<=0){acc+=n;return;}
        for(let j=Math.floor(acc);j<Math.ceil(acc+n-1e-6);j++){const s0=Math.max(acc,j),s1=Math.min(acc+n,j+1);const cx=X+j*gap;ctx.save();ctx.globalAlpha*=shown;ctx.beginPath();ctx.arc(cx,y,r,0,7);ctx.clip();ctx.fillStyle=col;ctx.fillRect(cx-r+(s0-j)*2*r,y-r,(s1-s0)*2*r,2*r);ctx.restore();
          ctx.save();ctx.globalAlpha*=shown;ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,y,r,0,7);ctx.stroke();ctx.restore();}
        const mid=X+(acc+n/2-.5)*gap;text(nm,mid,y+r+44+(n<1?40:0),{s:n<2?24:30,w:900,c:col,alpha:shown,max:Math.max(n*gap,90)});acc+=n;});
      if(T>FR('z2',.85)){ctx.save();ctx.beginPath();ctx.arc(X,y,r,0,7);ctx.clip();ctx.fillStyle='#fff';ctx.fillRect(X-r,y-r,2*r*.8,2*r);ctx.restore();text('밀가루 80',X+20,y-r-26,{f:'D',s:30,c:'#fff'});}
      const b=L('z2b');if(b>=0)group(960,720,1,0,P(b,0,.3),()=>{ctx.fillStyle='#fff';rr(-660,-90,1320,180,30);ctx.fill();text('밀가루 −5% = 빵 하나 4원',0,-28,{f:'D',s:46,c:'#1f6fd1',max:1260});text('빵값 −100원 = 한 달 180만 → 65만 원',0,42,{f:'D',s:42,c:'#d62f2f',max:1260});});
    }else{
      oven(560,500,1.2);bread(1200,470,1.3);drawMascot(1560,520,.6,'happy');
      stampBox('빵값 = 새벽의 사람 + 가게 값',960,780,c,{s:66,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1440,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-380,-70,760,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 하루 몇 개가 남으세요?',0,4,{s:36,w:900,c:C.ink,max:720});});
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
