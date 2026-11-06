/* ════════════════════════════════════════════════════════════════════
   장면 (LF.12 무한리필 고깃집 계산서) — 수치·출처는 docs/longform-ep12.md
   중심 그림: 1만 9,900원 = 불판 위 고기 열 점(한 점 1,990원). 왼쪽부터 고기값·쌈반찬·인건비·월세·잡비가 고기를 칠하고
   오른쪽 끝 2,500원이 사장님 몫. 반전은 '안 오는 손님' — 800g 먹는 손님도 5,700원을 남기지만 빈 의자는 0원.
   ════════════════════════════════════════════════════════════════════ */
const LY=[ // 1만 9,900원에서 칠하는 순서 (원, 한 달 2,250명 기준)
  {k:'meat',name:'고기값',v:6000,col:'#E8A33A'},
  {k:'side',name:'쌈·반찬',v:2200,col:'#7bd389'},
  {k:'labor',name:'인건비',v:5000,col:'#c08cff'},
  {k:'rent',name:'월세',v:2000,col:'#2ec4b6'},
  {k:'etc',name:'잡비',v:2200,col:'#9aa4b8'},
  {k:'own',name:'사장님 몫',v:2500,col:'#35E08A'},
];
const LYK=Object.fromEntries(LY.map(s=>[s.k,s]));
const PRICE=19900;
const SEQ=['2','0','7','0','÷','1','.','1','7','='];   // 고정비 2,070만 ÷ 1만 1,700원 = 1,769.23 (만 단위로 누름, 0 개수: 2070 = 2·0·7·0)
function layT(k){return {meat:KT('s1',0),side:KT('s2',0),labor:KT('s3',0),rent:KT('s4',0),etc:KT('s5',0),own:KT('s6',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}

/* 삼겹살 한 점 (위에서 본 줄무늬). w×h 가운데 기준. o.cooked: 구운 색 + 불판 자국 */
function meatSlice(x,y,w,h,o={}){const al=o.alpha??1;if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);
  const ck=o.cooked?1:0,cm=ck?'#c7774a':'#e9858d',cf=ck?'#f1cf9e':'#f8e6dc';
  ctx.fillStyle=cf;rr(-w/2,-h/2,w,h,Math.min(w,h)*.18);ctx.fill();
  ctx.save();rr(-w/2,-h/2,w,h,Math.min(w,h)*.18);ctx.clip();ctx.fillStyle=cm;
  const bands=[[.08,.22],[.36,.2],[.64,.24]];bands.forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(-w/2,-h/2+h*a);for(let i=0;i<=8;i++){const xx=-w/2+w*i/8;ctx.lineTo(xx,-h/2+h*a+Math.sin(i*1.3+a*9)*h*.025);}for(let i=8;i>=0;i--){const xx=-w/2+w*i/8;ctx.lineTo(xx,-h/2+h*(a+b)+Math.sin(i*1.1+b*7)*h*.03);}ctx.closePath();ctx.fill();});
  if(ck){ctx.strokeStyle='rgba(60,25,10,.55)';ctx.lineWidth=Math.max(3,w*.05);for(let i=-2;i<=2;i++)line(-w/2,i*h*.22-h*.1,w/2,i*h*.22+h*.1);}
  ctx.restore();ctx.restore();}
/* 불판 (둥근 석쇠) */
function grill(x,y,r,o={}){group(x,y,1,0,o.alpha??1,()=>{
  ctx.fillStyle='#2a2d36';ctx.beginPath();ctx.arc(0,0,r*1.08,0,7);ctx.fill();ctx.fillStyle='#14161c';ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(0,0,r*.96,0,7);ctx.clip();ctx.strokeStyle='#4a4f5c';ctx.lineWidth=Math.max(3,r*.03);for(let i=-10;i<=10;i++)line(i*r*.1,-r,i*r*.1,r);
  const g=ctx.createRadialGradient(0,0,r*.1,0,0,r);g.addColorStop(0,'rgba(255,120,40,.28)');g.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=g;ctx.fillRect(-r,-r,2*r,2*r);ctx.restore();
  const n=o.n??0;for(let i=0;i<n;i++){const a=i*2.4,rr0=r*.25+r*.45*((i*37%10)/10);meatSlice(Math.cos(a)*rr0,Math.sin(a)*rr0,r*.42,r*.2,{cooked:i%3!==0,rot:a*.7});}
});}
/* 접시 위 고기 (그램 표시용). n: 100g 접시 수 */
function plate(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{ctx.fillStyle='#e9edf3';ctx.beginPath();ctx.ellipse(0,0,120,46,0,0,7);ctx.fill();ctx.fillStyle='#cfd5df';ctx.beginPath();ctx.ellipse(0,0,92,32,0,0,7);ctx.fill();
  for(let i=0;i<3;i++)meatSlice(-50+i*50,-8+(i%2)*6,70,34,{rot:-.3+i*.25});});}
/* 의자 (옆에서). o.empty: 빈 의자, o.person: 앉은 손님 */
function chair(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle=o.empty?'#5b6275':'#8a6f5a';rr(-50,-150,22,150,8);ctx.fill();rr(-50,-10,110,22,8);ctx.fill();rr(-46,10,16,90,6);ctx.fill();rr(40,10,16,90,6);ctx.fill();
  if(o.person){ctx.fillStyle=o.pc||'#ffcf9f';ctx.beginPath();ctx.arc(10,-120,34,0,7);ctx.fill();ctx.fillStyle=o.sc||'#4fb6ff';rr(-20,-82,64,76,18);ctx.fill();}
});}
/* 고깃집 외관 (상표 없음) */
function bbqFront(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='#3a2f2a';rr(-400,-300,800,560,18);ctx.fill();
  ctx.fillStyle='#c0392b';rr(-400,-300,800,120,14);ctx.fill();
  text('무한리필 고깃집',0,-238,{f:'D',s:66,c:'#fff'});
  if(o.closed){ctx.fillStyle='#8e98ad';rr(-370,-130,740,370,8);ctx.fill();ctx.strokeStyle='#6c768b';ctx.lineWidth=4;for(let i=0;i<11;i++)line(-370,-100+i*32,370,-100+i*32);return;}
  const g=ctx.createLinearGradient(0,-130,0,240);g.addColorStop(0,'#ffe9c7');g.addColorStop(1,'#f3c78f');ctx.fillStyle=g;rr(-370,-130,740,370,10);ctx.fill();
  for(let b=0;b<3;b++){const bx=-240+b*240;ctx.fillStyle='#6b4b3a';rr(bx-90,120,180,24,8);ctx.fill();ctx.fillStyle='#1d1f26';ctx.beginPath();ctx.ellipse(bx,112,58,18,0,0,7);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;for(let i=0;i<3;i++){const sx=bx-20+i*20;ctx.beginPath();ctx.moveTo(sx,90);ctx.quadraticCurveTo(sx+14,60,sx,30);ctx.stroke();}}
  ctx.fillStyle='#fff';rr(220,-110,130,60,12);ctx.fill();text('1인 ₩',285,-80,{s:26,w:900,c:'#c0392b'});
});}
/* 의자 줄 (n개 중 빈 의자 empty개, 오른쪽부터 빈다) */
function chairRow(x0,y,n,empty,s=.8,gap=150,al=1){for(let i=0;i<n;i++){const e=i>=n-empty;chair(x0+i*gap,y,s,{empty:e,person:!e,sc:['#4fb6ff','#ff9f43','#b18cff','#35e08a','#ff6fa8'][i%5],alpha:al});}}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o2')){
      grill(560,470,300*E.back(P(a,0,.5))+1,{n:9});
      group(1400,320,1,-.03,1,()=>{panel(-330,-140,660,280,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('한 사람 고기 마음껏',0,-70,{s:40,w:900,c:C.dim});text('1만 9,900원',0,30,{f:'D',s:110,c:C.gold});});
      text('하루 75명 × 30일',1400,560,{s:44,w:900,alpha:P(T,FR('o1',.55),.3)});text('= 한 달 매출 약 4,478만 원',1400,630,{f:'D',s:54,alpha:P(T,FR('o1',.75),.3)});
    }else if(T<CT('o3')){
      const b=L('o2');
      text('예시 고깃집이 한 달 남기는 돈',760,240,{f:'D',s:60,c:C.dim,alpha:P(b,0,.3)});
      big('o2',0,760,430,'+562만 원',{f:'D',s:170,c:C.green,glow:'rgba(53,224,138,.45)'});
      drawMascot(1600,540,.9,'happy',{alpha:P(b,.3,.3)});
    }else if(T<CT('o4')){
      const b=L('o3');
      for(let i=0;i<5;i++)plate(380+(i%2)*60,640-i*70,.9,{alpha:P(b,.1+i*.12,.2)});
      drawMascot(1450,500,.95,'think',{alpha:P(b,0,.3)});
      group(1300,180,E.back(P(b,.2,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-470,-60,940,120,30);ctx.fill();text('많이 먹는 손님 때문에 망하겠지?',0,4,{s:44,w:900,c:C.ink});});
    }else if(T<CT('o5')){
      if(T<CT('o4b')){
        const b=L('o4');
        text('고기 800그램 먹는 손님 한 명',960,180,{f:'D',s:60,c:C.dim,alpha:P(b,0,.3)});
        for(let i=0;i<8;i++)plate(300+i*95,560-i*34,.75,{alpha:P(b,.1+i*.08,.2)});
        chair(1180,620,1.1,{person:1,sc:'#ff9f43'});
        text('가게에 남기는 돈',1550,360,{f:'D',s:50,c:C.dim});big('o4',0,1550,500,'+5,700원',{f:'D',s:120,c:C.green,glow:'rgba(53,224,138,.4)'});
      }else{
        const b=L('o4b');
        text('진짜 무서운 건: 오지 않는 손님',960,180,{f:'D',s:62,c:C.gold,alpha:P(b,0,.3)});
        chairRow(300,520,10,1,.9,150,P(b,.1,.3));
        if(T>FR('o4b',.35))popText(FR('o4b',.35),1650,300,'열 명 중 한 명',{f:'D',s:44,c:C.red});
        text('한 달 남는 돈',600,760,{f:'D',s:50,c:C.dim,alpha:P(b,.5,.3)});text('562만 →',980,760,{f:'D',s:60,c:C.dim,alpha:P(b,.5,.3)});big('o4b',0,1380,760,'299만 원',{f:'D',s:110,c:C.red,glow:'rgba(255,77,77,.4)'});
      }
    }else if(T<CT('o6')){
      const b=L('o5');
      text('한 무한리필 브랜드 (보도)',960,180,{f:'D',s:60,c:C.gold,alpha:P(b,0,.3)});
      group(560,480,1,0,P(b,.2,.3),()=>{panel(-380,-200,760,400,{bd:'rgba(255,255,255,.3)'});text('매장 수',0,-130,{s:40,w:900,c:C.dim});text('545 → 465곳',0,-20,{f:'D',s:90});text('2년 새 −80곳',0,90,{f:'D',s:50,c:C.red});});
      group(1360,480,1,0,P(T,FR('o5',.55),.3),()=>{panel(-380,-200,760,400,{bd:C.red,bg:'rgba(255,77,77,.08)'});text('점주 평균 매출',0,-130,{s:40,w:900,c:C.dim});const q=K('o5',0);text(q>=0?'−13.2%':'?',0,10,{f:'D',s:130,c:q>=0?C.red:C.gold});});
      srcLine('뉴시스 2024.3.11 (정보공개서 2020 → 2022 기준) · 브랜드 이름은 쓰지 않음');
    }else{
      const k9=L('o6'),k10=L('o7');
      text('무한리필 가게 차리기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:76,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['고기·외식 가격 자료 (보도 인용)','브랜드 숫자 (언론 보도)','가게 숫자 = 예시 가정'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,400+i*560,760,{s:32,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('무한리필 고깃집 계산서',960,250,{f:'D',s:140,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1700});
    text('진짜 손해는 어느 손님일까',960,400,{s:56,w:900,alpha:P(a,.3,.3)});
    bbqFront(700,720,.55,{alpha:P(a,.2,.3)});drawMascot(1300,720,.85,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p2',()=>{bbqFront(560,500,.85);
      if(L('p2')>=0){text('테이블 15개 · 돼지고기',1380,300,{f:'D',s:56,c:C.gold});
        ['직원 넷 + 사장님','점심부터 밤까지','한 사람 고기 마음껏'].forEach((s,i)=>pill(s,1380,420+i*100,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p2',.3+i*.15),.3)}));
        text('예시 가정',1380,720,{s:36,w:900,c:C.dim,alpha:P(L('p2'),1,.3)});}});
    sub('p3','p3b',()=>{
      text('한 사람 가격',960,170,{f:'D',s:56,c:C.gold});
      const base=700,bw=280,sc=.017;
      [['예시 가게',19900,'1만 9,900원',KT('p3',0),C.gold,520,'p3'],['보도 속 한 브랜드 (2024)',18900,'1만 8,900원',FR('p3',.6),'#4fb6ff',960,'p3'],['서울 삼겹살 1인분 200g (2026.4)',21321,'2만 1,321원',KT('p3b',0),C.red,1400,'p3b']].forEach(([l,v,lab,t,col,x,id])=>{
        if(L(id)<0)return;ctx.fillStyle='rgba(255,255,255,.07)';rr(x-bw/2,base-400,bw,400,14);ctx.fill();
        if(T<t)text('?',x,base-200,{f:'D',s:80,c:C.gold});else{const k=E.out(P(T,t,.6));vCash(x-bw/2,base-v*sc*k,bw,v*sc*k,col);text(lab,x,base-v*sc-40,{f:'D',s:48,c:'#fff',alpha:k});}
        text(l,x,base+40,{s:28,w:900,max:420});});
      if(L('p3b')>=0&&T>FR('p3b',.8))pill('1년 전보다 +4.3%',1400,230,{s:32,bg:'rgba(255,190,190,.95)'});
      srcLine(L('p3b')>=0?'한국소비자원 참가격 (아주경제 2026.6.1 인용) · 예시 가게 가격은 가정':'뉴시스 2024.3.11 · 예시 가게 가격은 가정');});
    sub('p4','p4b',()=>{text('예시 고깃집 한 달',960,190,{f:'D',s:60,c:C.gold});
      text('하루 75명 × 30일',600,370,{f:'D',s:56,c:C.dim});text('2,250명',600,500,{f:'D',s:140});
      text('2,250 × 1만 9,900원',1340,370,{s:44,w:900,c:C.dim});big('p4',0,1340,500,'4,477만 5,000원',{f:'D',s:96,c:C.gold});
      if(L('p4b')>=0){group(960,720,1,0,P(L('p4b'),0,.3),()=>{panel(-720,-70,1440,140,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.3)',lw:4});text('보도 속 브랜드 2022년 점주 평균 매출: 한 해 5억 3,111만 = 한 달 약 4,426만',0,4,{s:34,w:900,max:1380});});srcLine('뉴시스 2024.3.11 · 세금 제외');}
      else pill('세금 제외',960,700,{s:36,alpha:P(T,FR('p4',.8),.3),bg:'rgba(255,255,255,.92)'});});
    sub('p5','p5',lt=>{grill(960,330,lerp(120,200,E.out(P(lt,0,.6))),{n:0});
      for(let i=0;i<10;i++){const x=960-9*85+i*170,k=E.out(P(lt,.6+i*.08,.4));meatSlice(lerp(960,x,k),lerp(330,560,k),140,70,{alpha:k});text('1,990원',x,640,{f:'D',s:30,alpha:P(lt,1.6+i*.1,.3)});}
      text('1만 9,900원 = 고기 열 점',960,770,{f:'D',s:66,c:C.gold,alpha:P(lt,1,.4)});});
  }},
  /* ── 1만 9,900원 쪼개기 ── */
  cut:{draw(){
    const CX=960,cy=260,SW=150,SH=200,x0=CX-800,x1=CX+800;
    for(let i=0;i<10;i++)meatSlice(x0+80+i*160,cy,SW,SH,{});
    ctx.save();ctx.beginPath();for(let i=0;i<10;i++)ctx.rect(x0+80+i*160-SW/2,cy-SH/2,SW,SH);ctx.clip();
    let acc=0;const labs=[];
    LY.forEach(s=>{const t=T-layT(s.k);const w=s.v/PRICE*(x1-x0);if(t>=0){const f=E.out(P(t,0,.7));ctx.fillStyle=s.col;ctx.globalAlpha=.82;ctx.fillRect(x0+acc,cy-SH/2,w*f,SH);ctx.globalAlpha=1;if(f>.3)labs.push({s,xm:x0+acc+w/2,al:P(t,0,.3)});}acc+=w;});
    ctx.restore();
    for(let i=0;i<10;i++){ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=3;rr(x0+80+i*160-SW/2,cy-SH/2,SW,SH,SW*.18);ctx.stroke();}
    labs.forEach(({s,xm,al})=>{const i=LY.indexOf(s),y=cy+SH/2+56+(i%2)*92;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=s.col;ctx.lineWidth=3;line(xm,cy+SH/2-4,xm,y-36);ctx.restore();
      text(s.name,xm,y-12,{s:28,w:900,c:s.col,alpha:al});text(won(s.v)+'원',xm,y+28,{f:'D',s:34,c:s.k==='own'?C.green:'#fff',alpha:al});});
    const Y=740;
    sub('s1','s1b',()=>{text('첫 번째: 고기값',CX,Y-90,{f:'D',s:54,c:LYK.meat.col});
      if(L('s1b')<0){text('평균 400g × 100g당 1,500원 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s1',0),CX-120,Y+75,'6,000원',{f:'D',s:80,c:LYK.meat.col});text('= 세 점 남짓',CX+200,Y+75,{s:40,w:900,alpha:P(T,FR('s1',.85),.3)});}
      else{text('국내산 삼겹살 소비자 가격 100g 2,910원 → 여러 부위 도매가를 절반쯤으로 (예시)',CX,Y-10,{s:34,w:900,max:1500});text('6,000원',CX,Y+75,{f:'D',s:80,c:LYK.meat.col});srcLine('축산유통정보 다봄 (헤럴드경제 2026.10.26 인용) · 도매가 1,500원은 예시 가정');}});
    sub('s2','s2',()=>{text('두 번째: 쌈 · 반찬 · 밥 · 숯 · 카드 수수료',CX,Y-90,{f:'D',s:50,c:LYK.side.col});text('손님 한 명마다 드는 돈 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s2',0),CX,Y+75,'2,200원',{f:'D',s:80,c:LYK.side.col});});
    sub('s3','s3',()=>{text('세 번째: 인건비',CX,Y-90,{f:'D',s:54,c:LYK.labor.col});text('직원 넷 한 달 1,125만 ÷ 2,250명 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s3',0),CX-120,Y+75,'5,000원',{f:'D',s:80,c:LYK.labor.col});text('= 두 점 반',CX+200,Y+75,{s:40,w:900,alpha:P(T,FR('s3',.85),.3)});});
    sub('s4','s4',()=>{text('네 번째: 월세 · 관리비',CX,Y-90,{f:'D',s:54,c:LYK.rent.col});text('한 달 450만 ÷ 2,250명 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s4',0),CX,Y+75,'2,000원',{f:'D',s:80,c:LYK.rent.col});});
    sub('s5','s5',()=>{text('다섯 번째: 가스 · 전기 · 환기 · 잡비',CX,Y-90,{f:'D',s:54,c:LYK.etc.col});text('한 달 495만 (예시)',CX,Y-10,{s:36,w:900});popText(KT('s5',0),CX,Y+75,'2,200원',{f:'D',s:80,c:'#fff'});});
    sub('s6','s6',()=>{text('19,900 − 6,000 − 2,200 − 5,000 − 2,000 − 2,200',CX,Y-90,{f:'D',s:42,c:C.dim});text('사장님 몫',CX-270,Y+20,{f:'D',s:56,c:C.green});big('s6',0,CX+140,Y+20,'2,500원',{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('s6',.7))text('열 점 중 한 점을 조금 넘는다',CX,Y+112,{s:36,w:900,alpha:P(T,FR('s6',.7),.3)});});
    sub('s7','s7',()=>{text('한 달 (2,250명)',CX-420,Y-60,{f:'D',s:44,c:C.dim});big('s7',0,CX-420,Y+40,'562만 5,000원',{f:'D',s:84,c:C.green,glow:'rgba(53,224,138,.45)'});
      text('하루 12시간 × 30일 = 360시간',CX+400,Y-60,{s:36,w:900,c:C.dim,alpha:P(T,FR('s7',.55),.3)});text('시급 1만 5,625원',CX+400,Y+30,{f:'D',s:68,c:C.gold,alpha:P(T,FR('s7',.75),.3)});});
    sub('s7b','s7b',lt=>{group(CX,Y+10,1,0,1,()=>{
      panel(-760,-110,700,220,{bd:LYK.meat.col,bg:'rgba(232,163,58,.1)'});text('손님 수만큼 드는 돈',-410,-50,{s:34,w:900,c:C.dim});text('8,200원 / 명',-410,30,{f:'D',s:66,c:LYK.meat.col});
      ctx.save();ctx.globalAlpha*=P(lt,1.5,.3);panel(60,-110,700,220,{bd:LYK.labor.col,bg:'rgba(192,140,255,.1)'});ctx.restore();text('오든 안 오든 나가는 돈',410,-50,{s:34,w:900,c:C.dim,alpha:P(lt,1.5,.3)});text('2,070만 / 달',410,30,{f:'D',s:66,c:LYK.labor.col,alpha:P(lt,1.5,.3)});});
      srcLine('고정비 2,070만 = 인건비 1,125만 + 월세 450만 + 잡비 495만 (예시)');});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('÷'),done=typed.endsWith('=');
    let small='',bigS='0';if(done){small=`${n1} ÷ ${n2.replace('=','')} =`;bigS='1,769.23';}else if(n2!==undefined){small=`${n1} ÷`;bigS=n2||n1;}else if(n1)bigS=n1;
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:done?92:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('한 달 고정비 2,070만 원',1350,250,{f:'D',s:56,c:C.gold,alpha:P(a,.2,.3),max:1000});text('÷ 손님 한 명이 메우는 돈 1만 1,700원',1350,345,{s:38,w:900,alpha:P(a,.4,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{const c2=L('c2');group(1350,520,1,0,P(c2,0,.3),()=>{panel(-470,-80,940,160,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:5});text('19,900 − 8,200 =',0,-30,{s:36,w:900,c:C.dim});const q=K('c2',0);text(q>=0?'1만 1,700원':'?',0,32,{f:'D',s:56,c:C.gold});});
        const q=K('c3',0);if(L('c3')>=0)group(1350,700,lerp(1.5,1,E.out(P(Math.max(0,q),0,.3))),0,1,()=>text(q>=0?'본전 한 달 1,769명 · 하루 59명':'본전 손님 ?',0,0,{f:'D',s:58,c:C.red,glow:'rgba(255,77,77,.4)',max:1000}));
        if(L('c3b')>=0)stampBox('마지막 16명이 사장님 몫',1350,840,T-CT('c3b'),{s:44,c:C.green,bg:'rgba(0,40,20,.9)'});}}
    if(dt>=0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 많이 먹는 손님 ── */
  heavy:{draw(){
    sub('h1','h1',lt=>{text('많이 먹는 손님은 얼마나 손해일까?',960,180,{f:'D',s:76,c:C.gold});
      for(let i=0;i<8;i++)plate(520+(i%2)*70,720-i*60,.9,{alpha:P(lt,.3+i*.1,.2)});chair(1100,700,1.2,{person:1,sc:'#ff9f43'});drawMascot(1600,560,.8,'think',{alpha:P(lt,.5,.3)});});
    sub('h2','h6',()=>{text('손님 한 명이 먹는 양에 따라 가게에 남기는 돈 (예시)',960,165,{f:'D',s:46,c:C.gold,max:1800});
      const base=650,SC=.026,D=[[200,14700,KT('h2',0)],[400,11700,FR('h3',.3)],[600,8700,KT('h3',0)],[800,5700,KT('h4',0)],[1180,0,KT('h5',0)]];
      ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;line(240,base,1700,base);
      D.forEach(([g,v,t],i)=>{const x=380+i*300;text(won(g)+'g',x,base+50,{f:'D',s:44,c:i===4?C.red:'#fff'});
        text('고기값 '+won(g*15)+'원',x,base+100,{s:28,w:900,c:C.dim});
        if(T<t-.05){text('?',x,base-120,{f:'D',s:70,c:C.gold});return;}const k=E.out(P(T,t,.5)),h=Math.max(4,v*SC*k);
        vCash(x-90,base-h,180,h,v>0?C.green:C.red);text(v>0?'+'+won(v)+'원':'0원',x,base-h-36,{f:'D',s:46,c:v>0?'#fff':C.red,alpha:k});});
      if(L('h5')>=0&&T>FR('h5',.62))pill('삼겹살 1인분 200g으로 여섯 인분 가까이',1500,260,{s:32,bg:'rgba(255,255,255,.95)',alpha:P(T,FR('h5',.62),.3)});
      if(L('h6')>=0)stampBox('덜 남기는 손님 ≠ 손해 손님',960,820,T-CT('h6')-.2,{s:56,c:C.gold,bg:'rgba(40,30,0,.9)'});
      else srcLine('손님 한 명이 남기는 돈 = 19,900 − 고기값(100g당 1,500원) − 쌈·반찬 2,200원 · 예시 가정');});
    sub('h7','h7b',()=>{text('한 사람이 아니라, 모든 손님이 100g씩 더 먹으면',960,180,{f:'D',s:54,c:C.gold,max:1800});
      text('한 달 남는 돈',560,440,{f:'D',s:54,c:C.dim});text('562만',960,440,{f:'D',s:80});text('→',1200,440,{f:'D',s:80,c:C.dim});big('h7',0,1480,440,'225만 원',{f:'D',s:100,c:C.red,glow:'rgba(255,77,77,.4)'});
      text('100g × 1,500원 × 2,250명 = 한 달 337만 5,000원',960,580,{s:38,w:900,c:'#ffb3b3',alpha:P(T,FR('h7',.6),.3)});
      if(L('h7b')>=0)pill('평균이 움직이면 = 고기값이 오른 것과 같다',960,740,{s:40,bg:'rgba(255,255,255,.95)',alpha:P(L('h7b'),0,.3)});});
  }},
  /* ── 안 오는 손님 (반전) ── */
  empty:{draw(){
    sub('e1','e1',lt=>{text('가장 비싼 손님',960,190,{f:'D',s:80,c:C.gold});chairRow(360,560,8,0,1,170);
      const q=K('e1',0);if(q>=0){ctx.save();ctx.globalAlpha*=E.out(P(q,0,.4));chair(360+7*170,560,1,{empty:1});ctx.restore();text('오지 않는 손님',1550,300,{f:'D',s:56,c:C.red,alpha:P(q,0,.3)});text('?',360+7*170,330,{f:'D',s:120,c:C.red,alpha:P(q,.2,.3)});}});
    sub('e2','e2',()=>{text('손님 한 명이 가게에 남기는 돈',960,170,{f:'D',s:56,c:C.gold});
      group(560,480,1,0,1,()=>{panel(-380,-220,760,440,{bd:C.green,bg:'rgba(53,224,138,.07)'});for(let i=0;i<4;i++)plate(-170+i*20,90-i*34,.6);chair(190,90,.8,{person:1,sc:'#ff9f43'});text('800g 먹는 손님',0,175,{f:'D',s:44});text('+5,700원',0,-160,{f:'D',s:60,c:C.green});});
      group(1360,480,1,0,1,()=>{panel(-380,-220,760,440,{bd:C.red,bg:'rgba(255,77,77,.07)'});chair(0,90,1,{empty:1});text('빈 의자',0,175,{f:'D',s:44});const q=K('e2',0);text(q>=0?'0원':'?',0,-160,{f:'D',s:72,c:q>=0?C.red:C.gold});});
      if(T>FR('e2',.6))pill('월세 · 인건비는 빈 의자 몫까지 그대로',960,800,{s:36,bg:'rgba(255,190,190,.95)',alpha:P(T,FR('e2',.6),.3)});});
    sub('e3','e4',()=>{text('손님이 줄면 한 달 남는 돈 (예시)',960,165,{f:'D',s:52,c:C.gold});
      const base=640,SC=.62,D=[['그대로','하루 75명',562.5,CT('e3')+.2,'562만'],['열 명 중 한 명 ↓','하루 67.5명',299.25,KT('e3',0),'299만'],['열 명 중 두 명 ↓','하루 60명',36,KT('e4',0),'36만']];
      ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;line(300,base,1620,base);
      D.forEach(([l,d,v,t,lb],i)=>{const x=520+i*440;text(l,x,base+48,{f:'D',s:40,c:i?'#ffb3b3':'#fff'});text(d,x,base+96,{s:30,w:900,c:C.dim});if(L(i<2?'e3':'e4')<0)return;
        if(T<t-.05){text('?',x,base-140,{f:'D',s:70,c:C.gold});return;}const k=E.out(P(T,t,.5)),h=Math.max(4,v*SC*k);vCash(x-110,base-h,220,h,i?C.red:C.green);text(lb,x,base-h-38,{f:'D',s:56,c:'#fff',alpha:k});});
      if(L('e4')>=0&&T>FR('e4',.6))pill('본전 하루 59명에 거의 닿는다',1400,240,{s:34,bg:'rgba(255,255,255,.95)',alpha:P(T,FR('e4',.6),.3)});
      srcLine('손님 한 명이 메우는 돈 1만 1,700원 × 손님 수 − 고정비 2,070만 · 예시 가정');});
    sub('e5','e6',()=>{text('한 무한리필 갈빗집 브랜드 가맹점 수',960,165,{f:'D',s:54,c:C.gold});
      const base=640,SC=.62,D=[['2018',124],['2019',455],['2020',545],['2021',507],['2022',465]];
      D.forEach(([y,v],i)=>{const x=460+i*250,t=CT('e5')+.3+i*.35,last=i===4,tt=last?KT('e5',0):t;if(T<tt-.05){text('?',x,base-120,{f:'D',s:60,c:C.gold});text(y,x,base+40,{s:32,w:900});return;}
        const k=E.out(P(T,tt,.5)),h=v*SC*k;vCash(x-80,base-h,160,h,last?C.red:i===2?C.gold:'#4fb6ff');text(v+'곳',x,base-h-34,{f:'D',s:44,c:'#fff',alpha:k});text(y,x,base+40,{s:32,w:900});});
      if(L('e6')>=0){group(960,800,1,0,P(L('e6'),0,.3),()=>{panel(-560,-55,1120,110,{bg:'rgba(6,13,32,1)',bd:C.red,lw:4});text('2022년 한 해: 개점 20곳 · 폐점',-90,4,{s:40,w:900});const q=K('e6',0);text(q>=0?'63곳':'?',330,4,{f:'D',s:56,c:C.red});});}
      else srcLine('뉴시스 2024.3.11 (공정위 정보공개서 기준 보도 · 2020년은 본문에 544곳으로도 표기)');});
    sub('e7','e8',()=>{text('같은 브랜드 점주 평균 매출 (한 해)',960,165,{f:'D',s:54,c:C.gold});
      [['2020년',61179,'6억 1,179만','#4fb6ff',CT('e7')+.3],['2022년',53111,'5억 3,111만',C.red,FR('e7',.55)]].forEach(([l,v,lab,col,t],i)=>{const y=320+i*130;text(l,560,y,{a:'right',f:'D',s:52});hbar(600,y,900,90,v,64000,col,lab,{s:50,k:E.out(P(T,t,.6))});});
      const q=K('e7',0);if(q>=0)stampBox('−13.2%',1500,560,q,{s:72,c:C.red,bg:'rgba(40,0,0,.88)'});
      if(L('e8')>=0){group(960,770,1,0,P(L('e8'),0,.3),()=>{panel(-700,-70,1400,140,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('예시 가게 손님이 13.2% 줄면 → 한 달 남는 돈',-150,4,{s:38,w:900,max:900});const r=K('e8',0);text(r>=0?'215만 원':'?',480,4,{f:'D',s:60,c:C.red});});}
      else srcLine('뉴시스 2024.3.11 · 점주 평균 매출 = 가맹점 평균');});
    sub('e9','e10',()=>{text('올해 10월 보도 · 다른 무한리필 고깃집 브랜드 본사',960,165,{f:'D',s:50,c:C.gold,max:1800});
      group(560,430,1,0,1,()=>{panel(-380,-180,760,360,{bd:'rgba(255,255,255,.3)'});text('본사 영업이익 (지난해)',0,-110,{s:36,w:900,c:C.dim});text('+19억 1,000만',0,-20,{f:'D',s:64,c:C.green});text('↓',0,50,{f:'D',s:50,c:C.dim});const q=K('e9',0);text(q>=0?'−5억 5,000만 원':'?',0,120,{f:'D',s:60,c:q>=0?C.red:C.gold});});
      group(1360,430,1,0,P(T,FR('e9',.2),.3),()=>{panel(-380,-180,760,360,{bd:C.red,bg:'rgba(255,77,77,.08)'});emoji('⚖️',0,-60,120);text('회생 절차',0,70,{f:'D',s:70,c:C.red});text('같은 회사 다른 브랜드: 225 → 125곳',0,140,{s:28,w:900,max:700});});
      if(L('e10')>=0)stampBox('배달 어려운 고깃집 = 방문객 감소를 그대로',960,790,T-CT('e10')-.2,{s:46,c:C.red,bg:'rgba(40,0,0,.9)'});
      else srcLine('일요신문 2026.10.29 (가맹점 수: 2022년 말 → 2024년 말 정보공개서 기준 보도) · 브랜드 이름은 쓰지 않음');});
  }},
  /* ── 값을 올리면 ── */
  price:{draw(){
    sub('r1','r1',()=>{text('값을 올리면',760,330,{f:'D',s:110,c:C.gold});text('되지 않을까?',760,480,{f:'D',s:80});drawMascot(1580,540,1,'think');});
    sub('r2','r2b',()=>{text('국내산 삼겹살 소비자 가격 (100g)',960,170,{f:'D',s:52,c:C.gold});
      const base=700,bw=260,sc=.13;[['평년 (6월 기준)',2665,'2,665원',CT('r2b')+.2,'#4fb6ff',520,'r2b'],['2026년 6월',2900,'2,900원',KT('r2b',0),C.orange,960,'r2b'],['2026년 10월',2910,'2,910원',KT('r2',0),C.red,1400,'r2']].forEach(([l,v,lab,t,col,x,id])=>{
        ctx.fillStyle='rgba(255,255,255,.07)';rr(x-bw/2,base-420,bw,420,14);ctx.fill();if(L(id)<0||T<t){text('?',x,base-200,{f:'D',s:80,c:C.gold});}else{const k=E.out(P(T,t,.6));vCash(x-bw/2,base-(v-0)*sc*k,bw,v*sc*k,col);text(lab,x,base-v*sc-40,{f:'D',s:50,c:'#fff',alpha:k});}text(l,x,base+40,{s:32,w:900});});
      if(T>FR('r2',.8))pill('1년 전보다 +3.0%',1400,800,{s:32,bg:'rgba(255,190,190,.95)'});
      const q=K('r2b',0);if(q>=0)stampBox('평년보다 +8.8%',740,800,q,{s:52,c:C.red,bg:'rgba(40,0,0,.88)'});
      srcLine(L('r2b')>=0?'축산물품질평가원 (아주경제 2026.6.1 인용) · 10월: 축산유통정보 다봄 (헤럴드경제 2026.10.26)':'축산유통정보 다봄 (헤럴드경제 2026.10.26 인용)');});
    sub('r3','r3',()=>{text('예시 가게 고기값이 8.8% 오르면',960,180,{f:'D',s:60,c:C.gold});
      text('한 사람 고기값',560,360,{a:'right',f:'D',s:50});text('6,000원',760,360,{f:'D',s:60,c:C.dim});text('→',960,360,{f:'D',s:60,c:C.dim});text('6,528원',1180,360,{f:'D',s:66,c:C.red,alpha:P(T,FR('r3',.3),.3)});
      text('한 달',560,560,{a:'right',f:'D',s:60});text('562만',760,560,{f:'D',s:60,c:C.dim});text('→',960,560,{f:'D',s:60,c:C.dim});big('r3',0,1280,560,'443만 7,000원',{f:'D',s:90,c:C.red,glow:'rgba(255,77,77,.4)'});});
    sub('r4','r5',()=>{text('1,000원 올려 2만 900원을 받으면',960,170,{f:'D',s:58,c:C.gold});
      text('손님 그대로',560,350,{a:'right',f:'D',s:50});const q=K('r4',0);hbar(600,350,1000,90,787.5,900,C.green,q>=0?'787만 5,000원':'',{s:50,k:q>=0?E.out(P(q,0,.6)):0});if(q<0)text('?',700,350,{f:'D',s:60,c:C.gold});
      text('올리기 전',560,480,{a:'right',f:'D',s:50,c:C.dim});hbar(600,480,1000,90,562.5,900,'#5b6275','562만 5,000원',{s:46,lc:'#c9ced9'});
      if(L('r5')>=0){const r=K('r5',0);group(960,700,1,0,P(L('r5'),0,.3),()=>{panel(-720,-90,1440,180,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('손님이 이만큼만 빠져도 올리기 전보다 못하다',0,-36,{s:38,w:900});text(r>=0?'한 달 177명 (7.9%)':'?',0,36,{f:'D',s:64,c:C.red});});}});
    sub('r6','r6',()=>{text('그냥 고깃집과의 가격 차이',960,170,{f:'D',s:58,c:C.gold});
      const base=700,bw=300,sc=.018;[['서울 삼겹살 1인분 200g',21321,'2만 1,321원',CT('r6')+.2,C.red,480],['무한리필 1만 9,900원',19900,'1만 9,900원',FR('r6',.6),C.gold,960],['무한리필 2만 900원',20900,'2만 900원',FR('r6',.35),'#ff9f43',1440]].forEach(([l,v,lab,t,col,x])=>{
        ctx.fillStyle='rgba(255,255,255,.07)';rr(x-bw/2,base-420,bw,420,14);ctx.fill();if(T<t)text('?',x,base-200,{f:'D',s:80,c:C.gold});else{const k=E.out(P(T,t,.6));vCash(x-bw/2,base-v*sc*k,bw,v*sc*k,col);text(lab,x,base-v*sc-40,{f:'D',s:46,c:'#fff',alpha:k});}text(l,x,base+40,{s:30,w:900,max:440});});
      const q=K('r6',0);if(q>=0)stampBox('차이 421원',1440,250,q,{s:52,c:C.red,bg:'rgba(40,0,0,.88)'});
      if(T>FR('r6',.82))pill('1만 9,900원일 땐 차이 1,421원',960,250,{s:32,bg:'rgba(255,255,255,.95)'});
      srcLine('한국소비자원 참가격 2026년 4월 서울 (아주경제 2026.6.1 인용)');});
    sub('r7','r7',()=>{bbqFront(560,470,.75);text('=',960,470,{f:'D',s:120,c:C.dim});group(1360,470,1,0,1,()=>{panel(-300,-160,600,320,{bd:C.gold,bg:'rgba(255,197,49,.08)'});text('간판',0,-70,{s:44,w:900,c:C.dim});text('싸다',0,40,{f:'D',s:130,c:C.gold});});
      stampBox('싸다는 것 자체가 간판',960,790,T-CT('r7')-.2,{s:60,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('예시 고깃집 한 달 남는 돈 · 하나씩만 바꿔 보면',960,165,{f:'D',s:46,c:C.gold,alpha:P(a,0,.3),max:1800});
    if(T<CT('l2'))text('사장님이 바꿀 수 있는 숫자는?',960,500,{f:'D',s:90,alpha:P(a,.2,.3)});
    const rows=[['지금 그대로',562,'l1'],['손님 +10%',826,'l2'],['고기 100g당 100원 싸게',653,'l3'],['1,000원 올리고 손님 −5%',645,'l4'],['손님 −10%',299,'l5'],['첫째~셋째 한꺼번에',1010,'l6']];
    const Z=520,SCL=1.05;
    ctx.save();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;if(T>=CT('l1')+1)line(Z,215,Z,740);ctx.restore();
    if(T>=CT('l2')){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(Z+562*SCL,215,Z+562*SCL,740);ctx.restore();}
    rows.forEach(([l,v,id],i)=>{const t=i?CT(id):CT('l1')+1.2;if(T<t-.1)return;const y=255+i*92,tk=i?KT(id,0):t,k=E.out(P(T,tk,.6));text(l,60,y,{a:'left',s:34,w:900,max:440,c:id==='l5'?'#ffb3b3':'#fff'});
      if(T<tk){text('?',Z+60,y,{f:'D',s:56,c:C.gold});return;}
      const w=Math.max(6,v*SCL*k),col=id==='l5'?C.red:id==='l6'?C.gold:i===0?'#5b6275':C.green,lab=won(v)+'만';ctx.fillStyle=col;rr(Z,y-30,w,60,14);ctx.fill();
      text(lab,Z+w+18,y+2,{a:'left',f:'D',s:46,c:col==='#5b6275'?'#c9ced9':col,alpha:k});});
    if(L('l2b')>=0&&L('l3')<0)pill('빈 평일 점심 · 늦은 밤 채우기 = 점심 메뉴 · 단체 예약',1100,820,{s:32,bg:'rgba(255,255,255,.95)'});
    if(L('l5b')>=0&&L('l6')<0)pill('손님 수는 상권 · 경기에도 달렸다 = 손잡이보다 날씨',1100,820,{s:32,bg:'rgba(255,190,190,.95)'});
    sub('l7','l7',()=>{group(960,820,1,0,1,()=>{panel(-760,-50,1520,100,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('고기 아끼기(+90만)보다 빈 의자 채우기(+263만)가 더 크게 움직인다',0,4,{f:'D',s:36,c:C.gold,max:1480});});});
    if(L('l7')<0&&L('l2b')<0&&L('l5b')<0&&T>=CT('l2'))srcLine('예시 계산 · 손님 한 명 1만 1,700원 · 고정비 2,070만 · 한 번에 하나씩 (마지막 줄만 셋 다) · 만 원 아래 반올림',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('무한리필 가게 차리기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','본전 손님 수','고정비 ÷ 손님 한 명이 남기는 돈','오늘 가게: 하루 59명'],['k3','한 사람이 먹는 양','평균 g × 100g 원가','400g × 1,500원 = 6,000원'],['k4','손해 손님 기준','몇 g부터 손해인가','오늘 가게: 1,180g'],
      ['k5','그냥 고깃집과의 가격 차이','참가격 1인분 vs 우리 가격','2만 1,321원 vs 1만 9,900원'],['k6','빈 시간대','평일 낮 · 늦은 밤 빈 의자','빈 의자 = 0원, 고정비는 그대로']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(L('k5')>=0&&ov<0)srcLine('외식 가격: 한국소비자원 참가격 (지역·품목별로 매달 공개)');
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-700,-260,1400,500,{bg:'rgba(6,13,32,1)',bd:C.gold});text('한 사람 1만 5,900원 · 고기와 반찬 7,000원 · 고정비 한 달 1,800만',0,-180,{f:'D',s:42,max:1320});
      text('손님 한 명이 남기는 돈 15,900 − 7,000 = 8,900원',0,-95,{f:'D',s:46,c:L('k7b')>=0?C.gold:'#fff',max:1320});const k=K('k7b',0);
      if(k>=0){text('1,800만 ÷ 8,900원 = 2,023명',0,10,{f:'D',s:60,alpha:P(k,0,.3)});text('하루 약 68명',0,110,{f:'D',s:96,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});}else text('?',0,40,{f:'D',s:120,c:C.gold});
      if(L('k7c')>=0)text('무한리필 계산서는 의자 수로 끝난다',0,205,{s:34,w:900,alpha:P(L('k7c'),0,.3)});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('1만 9,900원 한 사람',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      const X=160,Wd=1600,y=380,h=150,s=Wd/PRICE,k=E.out(P(L('z2'),0,5));let xx=X;
      LY.forEach((o,i)=>{const w=o.v*s,kk=clamp(k*LY.length-i);if(kk<=0){xx+=w;return;}ctx.fillStyle=o.col;rr(xx,y-h/2,Math.max(2,w*kk-3),h,10);ctx.fill();if(kk>.5){text(won(o.v),xx+w/2,y+2,{f:'D',s:w>150?46:30,c:'#101420',max:w-10});text(o.name,xx+w/2,y+110+(w<150&&i%2?44:0),{s:w>150?30:24,w:900,c:o.k==='own'?C.green:'rgba(255,255,255,.85)',max:Math.max(w-8,70)});}xx+=w;});
      const b=L('z2b');if(b>=0)group(960,720,1,0,P(b,0,.3),()=>{ctx.fillStyle='#fff';rr(-640,-90,1280,180,30);ctx.fill();text('800g 먹는 손님도 +5,700원',0,-28,{s:38,w:900,c:C.ink,max:1240});text('손님 열 명 중 한 명 줄면: 한 달 562만 → 299만 원',0,40,{f:'D',s:50,c:'#d62f2f',max:1240});});
    }else{
      chairRow(560,470,6,1,.9,170);
      stampBox('적은 안 오는 손님',960,740,c,{s:72,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1440,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-380,-70,760,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 손님 한 명 평균 몇 g 드세요?',0,4,{s:34,w:900,c:C.ink,max:720});});
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
