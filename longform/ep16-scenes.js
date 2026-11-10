/* ════════════════════════════════════════════════════════════════════
   장면 (LF.16 1박 10만 원 펜션 계산서) — 수치·출처는 docs/longform-ep16.md
   중심 그림: 1박 10만 원 = 만 원짜리 10장. 앱 수수료 1 · 고정비 3 · 청소·세탁 3 · 두 사람 몫 3.
   반전: 청소비는 손님이 나갈 때마다 붙는다 → 한 달 청소비 180만 = 두 사람 몫 180만. 같은 60박을 2박 손님으로 채우면 10% 깎고도 +36만.
   ════════════════════════════════════════════════════════════════════ */
const GR=[ // 만 원짜리 10장 = 10만 원
  {k:'app',name:'앱 수수료',n:1,v:1,col:'#9aa4b8'},
  {k:'fixed',name:'고정비',n:3,v:3,col:'#2ec4b6'},
  {k:'clean',name:'청소·세탁',n:3,v:3,col:'#6FD3FF'},
  {k:'own',name:'두 사람 몫',n:3,v:3,col:'#35E08A'},
];
const GRK=Object.fromEntries(GR.map(s=>[s.k,s]));
const SEQ=['3','0','0','0','0','×','6','0','='];   // 청소비 30,000 × 60팀 = 1,800,000 (0 개수: 30000 넷, 60 하나)
function grT(k){return {app:KT('s1',0),fixed:KT('s2',0),clean:KT('s4',0),own:KT('s5',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}

/* 만 원짜리 (상표·인물 없음). pc: 묶음 색 띠 */
function wonBill(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';rr(-78,-38,160,84,10);ctx.fill();
  ctx.fillStyle=o.dim?'#4a5466':'#cfe3c4';rr(-80,-42,160,84,10);ctx.fill();
  if(o.pc){ctx.fillStyle=o.pc;rr(-80,-42,160,84,10);ctx.fill();}
  ctx.strokeStyle='rgba(30,60,30,.45)';ctx.lineWidth=3;rr(-72,-34,144,68,8);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.arc(44,0,22,0,7);ctx.fill();
  text('10,000',-18,3,{f:'D',s:30,c:o.pc?'#0d1a12':'#2e5a2e'});
});}
function billRow(X,y,s,gap,o={}){let i=0;GR.forEach(g=>{for(let j=0;j<g.n;j++,i++){const on=o.all||T>=grT(g.k);wonBill(X+i*gap,y,s,{pc:on?g.col:null,alpha:o.alpha??1});}});}
/* 펜션 (방 다섯 개, 상표 없음) */
function pension(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,250,520,36,0,0,7);ctx.fill();
  ctx.fillStyle='#8a5a3c';rr(-480,-40,960,290,10);ctx.fill();
  for(let i=0;i<14;i++){ctx.fillStyle=i%2?'rgba(0,0,0,.06)':'rgba(255,255,255,.04)';ctx.fillRect(-480,-40+i*20.7,960,20.7);}
  ctx.fillStyle='#3d4a63';ctx.beginPath();ctx.moveTo(-540,-30);ctx.lineTo(0,-260);ctx.lineTo(540,-30);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2c3549';ctx.beginPath();ctx.moveTo(-540,-30);ctx.lineTo(540,-30);ctx.lineTo(500,-10);ctx.lineTo(-500,-10);ctx.closePath();ctx.fill();
  const lit=o.lit??[1,1,1,1,1];
  for(let i=0;i<5;i++){const dx=-384+i*192;ctx.fillStyle='#5b3a24';rr(dx-60,40,120,200,8);ctx.fill();
    ctx.fillStyle=lit[i]?'rgba(255,214,120,.95)':'#1f2633';rr(dx-42,62,84,70,6);ctx.fill();ctx.strokeStyle='#5b3a24';ctx.lineWidth=5;line(dx,62,dx,132);line(dx-42,97,dx+42,97);
    ctx.fillStyle='#e8d6b0';ctx.beginPath();ctx.arc(dx+40,180,7,0,7);ctx.fill();text((i+1)+'',dx,22,{f:'D',s:28,c:'#fff3d6'});}
  text(o.name||'바닷가 펜션',0,-110,{f:'D',s:56,c:'#fff3d6'});
});}
/* 청소 도구 (대걸레 + 양동이) */
function mop(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.strokeStyle='#c99a5b';ctx.lineWidth=14;ctx.lineCap='round';line(60,-220,-10,120);
  ctx.fillStyle='#e8eef7';for(let i=0;i<9;i++){ctx.beginPath();ctx.ellipse(-60+i*12,140,8,40,(i-4)*.08,0,7);ctx.fill();}
  ctx.fillStyle='#3a8be0';ctx.beginPath();ctx.moveTo(60,60);ctx.lineTo(220,60);ctx.lineTo(200,200);ctx.lineTo(80,200);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2a6fc0';rr(52,50,176,20,8);ctx.fill();ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.ellipse(140,58,70,8,0,0,7);ctx.fill();
});}
/* 수건·이불 더미 */
function linen(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  [['#ffffff',0],['#cfe6ff',-46],['#ffffff',-92],['#ffe9c2',-138]].forEach(([c,dy],i)=>{ctx.fillStyle=c;rr(-120+i*6,dy,240,46,14);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.15)';ctx.lineWidth=3;rr(-120+i*6,dy,240,46,14);ctx.stroke();});
});}
/* 영수증 (숫자를 장면 속 물건에) */
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-230,-h/2);ctx.lineTo(230,-h/2);ctx.lineTo(230,h/2);for(let i=0;i<12;i++){ctx.lineTo(230-(i+.5)*38.3,h/2+(i%2?0:14));}ctx.lineTo(-230,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-200,-h/2+84,200,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-200,yy,{a:'left',s:34,w:900,c:'#3a4256'});text(v,200,yy,{a:'right',f:'D',s:40,c:c||'#1d2433'});});
});}
/* 사람 */
function person(x,y,s,col,al=1){if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-48*s,22*s,0,7);ctx.fill();rr(x-30*s,y-20*s,60*s,70*s,22*s);ctx.fill();ctx.restore();}
/* 한 달 달력 (5방 × 30일). filled(i,d) → 색 */
function roomGrid(x0,y0,cw,ch,fill,o={}){for(let r=0;r<5;r++)for(let d=0;d<30;d++){const c=fill(r,d);const k=o.t0==null?1:P(T,o.t0+(d*5+r)*.006,.12);ctx.fillStyle=c?c:'rgba(255,255,255,.08)';ctx.globalAlpha*=1;rr(x0+d*cw,y0+r*ch,cw-4,ch-4,4);if(c){ctx.save();ctx.globalAlpha*=k;ctx.fill();ctx.restore();}else ctx.fill();}}
const WEEKEND=d=>d%7===4||d%7===5;           // 금·토 밤 (예시 달력)
const FILL60=(r,d)=>WEEKEND(d)||(r===0&&[1,2,3,6].includes(d%7))||(r===1&&d%7===3&&d<21);   // 금·토 40박 + 평일 20박 = 60박

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o2')){
      const a=L('o1'),q=K('o1',0);
      group(960,360,E.back(P(a,0,.5))+.001,-.02,1,()=>{ctx.fillStyle='#fff';rr(-700,-130,1400,260,40);ctx.fill();ctx.beginPath();ctx.moveTo(-240,130);ctx.lineTo(-290,210);ctx.lineTo(-150,130);ctx.fill();
        text('"청소 안 할 거면',-40,-38,{f:'D',s:84,c:C.ink});text(q>=0?'3만 7,000원"':'?',-40,62,{f:'D',s:96,c:'#d62f2f'});});
      if(T>FR('o1',.45))pill('한 펜션 \'퇴실 청소 면제\' 옵션 (2025년 보도)',960,640,{s:38,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('o1',.45),.3)});
      srcLine('머니투데이 2025.10.24 (옵션 이름 \'클리닝 프리\')');
    }else if(T<CT('o3')){
      const b=L('o2');
      mop(420,480,1.3*E.back(P(b,0,.4))+.001);linen(780,620,.9,{alpha:P(b,.2,.3)});
      text('손님이 한 번 나갈 때',1380,300,{f:'D',s:56,c:C.dim,alpha:P(b,.3,.3)});
      big('o2',0,1380,470,'3만 원',{f:'D',s:190,c:'#6FD3FF',glow:'rgba(111,211,255,.45)'});
      srcLine('예시 가정: 청소 인건비 + 이불·수건 세탁 + 소모품 · 청소 대행 단가는 공식 통계가 없다');
    }else if(T<CT('o3b')){
      const b=L('o3'),q=K('o3',0);
      text('1박 10만 원 = 만 원짜리 10장',960,190,{f:'D',s:60,c:C.gold,alpha:P(b,0,.3)});
      for(let i=0;i<10;i++){const on=q>=0&&i>=4&&i<7;wonBill(240+i*160,430,.92,{pc:on?'#6FD3FF':null,alpha:P(b,.1+i*.04,.3)});}
      if(q>=0){text('청소·세탁 3만 원',240+5*160,560,{f:'D',s:56,c:'#6FD3FF',alpha:P(q,0,.3)});}
      srcLine('예시 펜션 · 1박 평균 10만 원');
    }else if(T<CT('o4')){
      const b=L('o3b');drawMascot(560,540,.95,'think',{alpha:P(b,0,.3)});
      group(1300,400,E.back(P(b,.1,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-420,-90,840,180,30);ctx.fill();text('3만 원은 누가, 언제?',0,4,{f:'D',s:66,c:C.ink});});
    }else if(T<CT('o5')){
      const b=L('o4'),q=K('o4',0);
      text('예시 펜션 · 한 달 60팀',960,190,{f:'D',s:56,c:C.gold,alpha:P(b,0,.3)});
      text('청소비 한 달',560,360,{f:'D',s:50,c:'#6FD3FF'});text('두 사람 몫',1360,360,{f:'D',s:50,c:C.green});
      text(q>=0?'180만 원':'?',560,500,{f:'D',s:110,c:q>=0?'#6FD3FF':C.gold});text(q>=0?'180만 원':'?',1360,500,{f:'D',s:110,c:q>=0?C.green:C.gold});
      if(q>=0)group(960,500,lerp(1.6,1,E.out(P(q,0,.3))),0,P(q,0,.2),()=>text('=',0,0,{f:'D',s:140,c:'#fff'}));
      srcLine('예시 가정 · 계산은 아래 장에서');
    }else if(T<CT('o6')){
      const b=L('o5'),q=K('o5',0);
      text('같은 60박을 채우는 두 가지 방법',960,190,{f:'D',s:56,c:C.gold,alpha:P(b,0,.3)});
      group(560,450,1,0,P(b,.1,.3),()=>{panel(-330,-150,660,300,{bd:'rgba(255,255,255,.3)'});text('1박 손님 60팀',0,-70,{f:'D',s:56});text('청소 60번',0,20,{s:40,w:900,c:'#6FD3FF'});text('180만 원',0,100,{f:'D',s:56,c:'#c9ced9'});});
      group(1360,450,1,0,P(b,.4,.3),()=>{panel(-330,-150,660,300,{bd:C.green});text('2박 손님 30팀 (−10%)',0,-70,{f:'D',s:50});text('청소 30번',0,20,{s:40,w:900,c:'#6FD3FF'});text(q>=0?'216만 원':'?',0,100,{f:'D',s:56,c:q>=0?C.green:C.gold});});
      if(q>=0)stampBox('깎아 주고도 +36만 원',960,760,q,{s:60,c:C.green,bg:'rgba(0,40,20,.9)'});
    }else{
      const k9=L('o6'),k10=L('o7');
      text('숙소 요금을 정하기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:72,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['숙박 동향·민박 수 (보도·통계)','청소 옵션 논란 (보도)','펜션 숫자 = 예시 가정'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,380+i*580,760,{s:32,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('1박 10만 원 펜션 계산서',960,250,{f:'D',s:120,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('손님이 나갈 때마다 드는 돈',960,400,{s:56,w:900,alpha:P(a,.3,.3)});
    pension(760,760,.5,{alpha:P(a,.2,.3)});mop(1250,740,.6,{alpha:P(a,.3,.3)});drawMascot(1560,720,.8,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 펜션 ── */
  setup:{draw(){
    sub('p1','p2b',()=>{pension(600,520,.8);
      if(L('p2')>=0){text('방 다섯 개 작은 펜션',1460,300,{f:'D',s:54,c:C.gold});
        ['바닷가 근처','부부 두 사람이 운영','세금 제외'].forEach((s,i)=>pill(s,1460,420+i*100,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p2',.3+i*.15),.3)}));}
      if(L('p2b')>=0)pill('평일 1~2방 · 주말 5방',1460,720,{s:40,bg:'rgba(255,230,150,.95)',alpha:P(L('p2b'),0,.3)});
      text('예시 가정',600,860,{s:30,w:900,c:C.dim});});
    sub('p3','p3',()=>{text('1박 평균 요금',960,170,{f:'D',s:56,c:C.gold});
      const q=K('p3',0);for(let i=0;i<10;i++)wonBill(340+i*56,440-i*8,1.1,{rot:-.08+i*.016,alpha:q>=0?P(q,i*.03,.2):.25});
      text(q>=0?'10만 원':'?',1400,420,{f:'D',s:150,c:C.gold});text('평일·주말을 섞은 평균 (예시)',1400,560,{s:38,w:900,c:C.dim});});
    sub('p4','p4',()=>{text('방 5개 × 30일 = 150박 중',960,165,{f:'D',s:54,c:C.gold});
      const q=K('p4',0);roomGrid(300,250,44,70,(r,d)=>q>=0&&FILL60(r,d)?C.green:null,{t0:q>=0?KT('p4',0):null});
      ['1호','2호','3호','4호','5호'].forEach((l,i)=>text(l,260,284+i*70,{a:'right',s:28,w:900,c:C.dim}));
      if(q>=0){text('60박 · 가동률 40%',960,680,{f:'D',s:72,c:C.green,alpha:P(q,.4,.3)});}
      srcLine('예시 달력 · 칸 하나 = 방 하나의 하룻밤 · 금·토 밤이 꽉 차는 모양');});
    sub('p5','p5',lt=>{for(let i=0;i<10;i++){const k=E.back(P(lt,.3+i*.06,.3));if(k<=0)continue;wonBill(300+(i%5)*330,330+Math.floor(i/5)*170,1.3*k);}
      text('1박 10만 원 = 만 원짜리 10장',960,700,{f:'D',s:66,c:C.gold,alpha:P(lt,1,.4)});
      pill('한 달 1박 손님 60팀 · 매출 600만 원',960,810,{s:38,bg:'rgba(255,255,255,.92)',alpha:P(lt,.2,.3)});});
  }},
  /* ── 10만 원 쪼개기 ── */
  cut:{draw(){
    const X=240,y=330,s=.95,gap=160;
    text('1박 10만 원 = 만 원짜리 10장',X-80,200,{a:'left',f:'D',s:44,c:C.gold});
    billRow(X,y,s,gap);
    let i0=0;GR.forEach(g=>{const t=grT(g.k);if(T>=t){const al=P(T,t,.3),x0=X+i0*gap-76,x1=X+(i0+g.n-1)*gap+76,yy=y+70;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=g.col;ctx.lineWidth=4;line(x0+6,yy,x1-6,yy);line(x0+6,yy,x0+6,yy-14);line(x1-6,yy,x1-6,yy-14);ctx.restore();
      text(g.name,(x0+x1)/2,yy+38,{s:30,w:900,c:g.col,alpha:al,max:x1-x0+10});text(g.v+'만 원',(x0+x1)/2,yy+80,{f:'D',s:36,c:g.k==='own'?C.green:'#fff',alpha:al});}i0+=g.n;});
    const Y=770;
    sub('s1','s1',()=>{text('첫 번째: 예약 앱 수수료 · 광고비',960,Y-90,{f:'D',s:52,c:GRK.app.col});text('매출의 10% (예시)',960,Y-10,{s:36,w:900});popText(KT('s1',0),960,Y+70,'1만 원 = 한 장',{f:'D',s:72,c:'#c9ced9'});});
    sub('s2','s2b',()=>{text('두 번째: 고정비',960,Y-90,{f:'D',s:54,c:GRK.fixed.col});text('전기·난방·수도·인터넷·보험·수리 한 달 180만 ÷ 60박 (예시)',960,Y-10,{s:34,w:900,max:1800});popText(KT('s2',0),960,Y+70,'3만 원',{f:'D',s:80,c:GRK.fixed.col});
      if(L('s2b')>=0)pill('손님이 와도, 안 와도 나간다',1500,Y+70,{s:34,bg:'rgba(180,240,235,.95)',alpha:P(L('s2b'),0,.3)});});
    sub('s3','s4b',()=>{text('세 번째: 청소 · 세탁',960,Y-90,{f:'D',s:54,c:GRK.clean.col});
      if(L('s4')<0){['방 청소 인건비','이불·수건 세탁','칫솔·휴지 소모품'].forEach((s,i)=>pill(s,520+i*440,Y,{s:36,bg:'rgba(200,235,255,.95)',alpha:P(T,FR('s3',.3+i*.2),.3)}));}
      else{text('손님이 나갈 때마다 한 번 (예시)',960,Y-10,{s:36,w:900});popText(KT('s4',0),960,Y+70,'3만 원',{f:'D',s:80,c:GRK.clean.col});
        if(L('s4b')>=0)pill('방 하나 1시간 반 · 다섯 방이면 반나절 (예시)',960,600,{s:30,bg:'rgba(255,255,255,.92)',alpha:P(L('s4b'),0,.3)});}});
    sub('s5','s5',()=>{text('10 − 1 − 3 − 3',960,Y-90,{f:'D',s:46,c:C.dim});text('두 사람 몫',960-300,Y+20,{f:'D',s:56,c:C.green});big('s5',0,960+140,Y+20,'3만 원',{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('s5',.55))text('× 60박 = 한 달 180만 원',960,Y+110,{f:'D',s:44,c:C.gold,alpha:P(T,FR('s5',.55),.3)});});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('×'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} × ${n2.replace('=','')} =`;bigS='1,800,000';}else if(n2!==undefined){small=`${fmt(n1)} ×`;bigS=n2||fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:76,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('청소비 3만 원 × 한 달 60팀',1350,250,{f:'D',s:56,c:C.gold,alpha:P(a,.2,.3),max:1000});text('손님이 나갈 때마다 한 번',1350,345,{s:36,w:900,alpha:P(a,.4,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else if(L('c3b')<0){const c2=L('c2');group(1350,540,1,0,P(c2,0,.3),()=>{panel(-470,-110,940,220,{bg:'rgba(6,13,32,1)',bd:'#6FD3FF',lw:5});text('청소비 한 달',-230,-40,{s:36,w:900,c:C.dim});text('두 사람 몫',230,-40,{s:36,w:900,c:C.dim});const q=K('c2',0);text(q>=0?'180만':'?',-230,40,{f:'D',s:70,c:'#6FD3FF'});text('180만',230,40,{f:'D',s:70,c:C.green});text('=',0,40,{f:'D',s:70});});
        if(L('c3')>=0&&T>FR('c3',.3))stampBox('나갈 때마다 몫만큼 청소에',1350,800,T-FR('c3',.3),{s:46,c:C.gold,bg:'rgba(40,30,0,.9)'});}
      else{group(1350,560,1,0,P(L('c3b'),0,.3),()=>{panel(-470,-130,940,260,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('한 사람 90만 원',0,-50,{f:'D',s:66,c:C.red});text('= 최저시급 1만 320원 × 87시간',0,40,{s:38,w:900,max:880});});}}
    if(dt>=0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 손님이 바뀔 때마다 ── */
  turn:{draw(){
    sub('t1','t1',lt=>{pension(560,520,.75,{lit:[1,0,1,0,1]});text('손님이 덜 바뀌면?',1400,460,{f:'D',s:80,c:C.gold,alpha:P(lt,.3,.3)});});
    sub('t2','t5b',()=>{text('같은 60박 · 한 달',960,160,{f:'D',s:52,c:C.gold});
      const cols=[[620,'1박 손님 60팀','#c9ced9'],[1340,'2박 손님 30팀 (−10%)',C.green]];
      cols.forEach(([x,l,c],i)=>{if(i===1&&L('t2')<0)return;text(l,x,250,{f:'D',s:48,c});});
      const rows=[['매출','600만','540만','t3',CT('t3')],['앱 수수료','−60만','−54만','t3',FR('t3',.6)],['청소비','−180만','−90만','t4',KT('t4',0)],['고정비','−180만','−180만','t4',FR('t4',.8)],['두 사람 몫','180만','216만','t5',KT('t5',0)]];
      rows.forEach(([l,a,b,id,t],i)=>{const y=340+i*90;text(l,260,y,{a:'left',s:38,w:900,c:i===4?C.gold:'#fff'});text(a,620,y,{f:'D',s:48,c:i===4?'#c9ced9':'#fff'});
        if(L(id)<0||T<t){if(L('t2')>=0)text('?',1340,y,{f:'D',s:48,c:C.gold});return;}const k=P(T,t,.3);text(b,1340,y,{f:'D',s:i===4?64:48,c:i===2?'#6FD3FF':i===4?C.green:'#fff',alpha:k});});
      ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=3;line(240,700,1560,700);
      if(L('t5b')>=0)stampBox('깎아 주고 +36만 원',1500,800,L('t5b'),{s:46,c:C.green,bg:'rgba(0,40,20,.9)'});
      if(L('t3b')>=0&&L('t4')<0)pill('하룻밤 더 머물면 청소비 3만 원이 그대로 남는다',960,800,{s:34,bg:'rgba(200,235,255,.95)'});
      srcLine('예시 가정 · 앱 수수료 10% · 청소 한 번 3만 원 · 고정비 180만');});
    sub('t6','t6',()=>{text('손님 한 팀이 남기는 돈 (두 밤 기준)',960,165,{f:'D',s:52,c:C.gold});
      text('1박 손님 두 팀',620,330,{a:'right',f:'D',s:44});hbar(660,330,1000,90,12,14.5,'#9aa4b8','12만 원',{s:50,lc:'#c9ced9'});
      text('2박 손님 한 팀',620,470,{a:'right',f:'D',s:44,c:C.green});hbar(660,470,1000,90,13.2,14.5,C.green,'13만 2,000원',{s:50,k:E.out(P(T,FR('t6',.25),.6))});
      text('(9만 − 3만) × 2  vs  18만 × 0.9 − 3만',960,590,{s:34,w:900,c:C.dim});
      const q=K('t6',0);if(q>=0)stampBox('연박 할인 16.7%까지 손해 아님',960,740,q,{s:52,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('앱 수수료 10% 뒤 · 18만 × (1 − 할인) × 0.9 − 3만 = 12만 → 할인 16.7%');});
    sub('t7','t7',lt=>{group(540,440,1,0,P(lt,0,.3),()=>{panel(-360,-200,720,400,{bd:'rgba(255,255,255,.3)'});text('코인노래방',0,-120,{f:'D',s:56});text('손님이 자주 바뀔수록',0,-10,{s:40,w:900});text('번다',0,80,{f:'D',s:80,c:C.green});});
      group(1380,440,1,0,P(lt,.6,.3),()=>{panel(-360,-200,720,400,{bd:'#6FD3FF'});text('숙소',0,-120,{f:'D',s:56});text('손님이 바뀔 때마다',0,-10,{s:40,w:900});text('돈이 나간다',0,80,{f:'D',s:72,c:'#6FD3FF'});});
      text('↔',960,440,{f:'D',s:90,c:C.dim});});
  }},
  /* ── 청소하고 나가세요 ── */
  clean:{draw(){
    sub('q1','q1',lt=>{mop(500,480,1.3*E.back(P(lt,0,.5))+.001);group(1340,420,E.back(P(lt,.3,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-420,-80,840,160,30);ctx.fill();text('"청소하고 나가세요"',0,4,{f:'D',s:64,c:C.ink});});});
    sub('q2','q2',()=>{text('손님이 설거지·분리수거를 하고 나가면 (예시)',960,165,{f:'D',s:50,c:C.gold});
      text('청소 한 번',600,330,{a:'right',f:'D',s:46,c:C.dim});text('3만 원',660,330,{a:'left',f:'D',s:66,c:'#6FD3FF'});text('→',1000,330,{f:'D',s:66,c:C.dim});
      const q=K('q2',0);text(q>=0?'2만 원':'?',1100,330,{a:'left',f:'D',s:80,c:q>=0?C.green:C.gold});
      if(T>FR('q2',.65))stampBox('1만 원 × 60번 = 한 달 +60만 원',960,560,T-FR('q2',.65),{s:52,c:C.green,bg:'rgba(0,40,20,.9)'});});
    sub('q3','q3b',()=>{text('\'퇴실 청소 면제\' 옵션의 계산',960,165,{f:'D',s:52,c:C.gold});
      receipt(560,500,1,[['청소 면제 옵션','+37,000','#1d2433'],['더 드는 청소','−10,000','#d62f2f'],['한 팀에 남는 돈','+27,000','#16794a']],{title:'예시 계산'});
      const q=K('q3',0);if(q>=0)group(1360,420,1,0,P(q,0,.3),()=>{panel(-380,-130,760,260,{bg:'rgba(6,13,32,1)',bd:C.green,lw:5});text('한 팀에',0,-50,{s:40,w:900,c:C.dim});text('2만 7,000원',0,40,{f:'D',s:90,c:C.green});});
      if(L('q3b')>=0)pill('업계 해명: 인건비·운영비가 올라서',1360,680,{s:36,bg:'rgba(255,255,255,.92)',alpha:P(L('q3b'),0,.3)});
      srcLine('옵션 값: 머니투데이 2025.10.24 · 업계 해명: 경향신문 2025.5.10 · 더 드는 청소 1만 원은 예시');});
    sub('q4','q5',()=>{text('한국소비자원 펜션 이용 설문 (2024년 7월)',960,165,{f:'D',s:50,c:C.gold});
      const q=K('q4',0);for(let i=0;i<100;i++){const hurt=q>=0&&i<11.5;person(170+(i%20)*58,300+Math.floor(i/20)*96,.62,hurt?C.red:'rgba(201,206,217,.55)');}
      if(q>=0)text('응답자 1,568명 중 11.5% (180명) 피해',720,800,{f:'D',s:48,c:C.red,alpha:P(q,0,.3)});
      if(L('q5')>=0){group(1620,430,1,0,P(L('q5'),0,.3),()=>{panel(-260,-110,520,220,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('가장 많은 피해',0,-50,{s:34,w:900,c:C.dim});text('현장 추가 비용',0,0,{s:38,w:900});const r=K('q5',0);text(r>=0?'28.2%':'?',0,64,{f:'D',s:66,c:C.red});});}
      srcLine('경향신문 2025.5.10 (한국소비자원 설문 인용) · 그림 사람 하나 = 1%');});
    sub('q6','q7',()=>{text('공정위 지침 (2025년 10월 24일부터)',960,165,{f:'D',s:52,c:C.gold});
      group(960,420,1,0,1,()=>{ctx.fillStyle='#fff';rr(-640,-120,1280,240,30);ctx.fill();text('온라인에 적은 가격',0,-50,{s:44,w:900,c:'#59627c'});text('= 소비자가 실제 내는 총금액',0,40,{f:'D',s:66,c:C.ink});});
      if(L('q6b')>=0)text('청소비가 꼭 내야 하는 돈이면 → 처음 보이는 값 안에',960,640,{f:'D',s:46,c:'#6FD3FF',alpha:P(L('q6b'),0,.3),max:1800});
      if(L('q7')>=0&&T>FR('q7',.5))stampBox('문제는 언제 알려 주느냐',960,780,T-FR('q7',.5),{s:56,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('머니투데이 2025.10.24 · 공정거래위원회 전자상거래 지침 개정');});
  }},
  /* ── 주말과 여름 ── */
  season:{draw(){
    sub('m1','m1',lt=>{pension(600,520,.75,{lit:[0,0,0,0,0]});text('빈방은?',1400,460,{f:'D',s:100,c:C.gold,alpha:P(lt,.3,.3)});});
    sub('m2','m2b',()=>{group(960,230,1,0,1,()=>{ctx.fillStyle='#fff';rr(-560,-70,1120,140,30);ctx.fill();text('"하루 한두 팀만 받다 보니"',0,4,{f:'D',s:56,c:C.ink});});
      text('한 펜션 운영자 (경향신문 2025.5.10)',960,340,{s:30,w:900,c:C.dim});
      if(L('m2b')>=0){const t0=CT('m2b');roomGrid(300,420,44,56,(r,d)=>WEEKEND(d)?C.gold:(FILL60(r,d)?C.green:null),{t0});
        text('금·토 밤 5방 × 8번 = 40박',700,740,{f:'D',s:40,c:C.gold,alpha:P(T,FR('m2b',.3),.3)});text('나머지 20박 = 평일',1360,740,{f:'D',s:40,c:C.green,alpha:P(T,FR('m2b',.6),.3)});}
      srcLine('달력은 예시');});
    sub('m3','m4',()=>{text('펜션 객실당 매출 (야놀자리서치 숙박업 동향)',960,165,{f:'D',s:50,c:C.gold});
      text('2026년 3분기 · 2분기 대비',820,340,{a:'right',f:'D',s:40});const q=K('m3',0);if(q<0)text('?',900,340,{f:'D',s:60,c:C.gold});else hbar(860,340,700,90,45.8,60,C.green,'+45.8%',{s:56,k:E.out(P(q,0,.6))});
      if(L('m4')>=0){text('2025년 4분기 · 3분기 대비',820,500,{a:'right',f:'D',s:40});const r=K('m4',0);if(r<0)text('?',900,500,{f:'D',s:60,c:C.gold});else{hbar(860,500,700,90,28.3,60,C.red,'−28.3%',{s:56,k:E.out(P(r,0,.6))});}}
      if(T>FR('m3',.75))pill('여름 성수기',1500,250,{s:32,bg:'rgba(255,230,150,.95)'});
      srcLine('한국경제 2026.10.27 (2026년 3분기 보고서) · 2026.1.29 (2025년 4분기 보고서) · 2026년 3분기는 1년 전보다도 +5.5%');});
    sub('m5','m6',()=>{text('예시 펜션 비수기: 한 달 50박만 차면',960,165,{f:'D',s:52,c:C.gold});
      text('60박',560,330,{f:'D',s:50,c:C.dim});text('180만',560,440,{f:'D',s:90,c:'#c9ced9'});text('→',960,440,{f:'D',s:80,c:C.dim});
      text('50박',1360,330,{f:'D',s:50,c:C.dim});big('m5',0,1360,440,'120만',{f:'D',s:100,c:C.red});
      if(L('m5b')>=0)pill('성수기 1박 손님 꽉 차면 → 청소도 날마다 다섯 번',960,620,{s:36,bg:'rgba(200,235,255,.95)',alpha:P(L('m5b'),0,.3)});
      if(L('m6')>=0)stampBox('빈방: 청소비 0원, 고정비 180만 그대로',960,770,L('m6'),{s:48,c:C.red,bg:'rgba(40,0,0,.9)'});});
  }},
  /* ── 제주 ── */
  jeju:{draw(){
    sub('j1','j1',lt=>{for(let i=0;i<9;i++)pension(260+(i%3)*700,300+Math.floor(i/3)*230,.22,{alpha:P(lt,i*.06,.3),lit:[0,1,0,0,1]});text('방이 너무 많아진 곳',960,860,{f:'D',s:60,c:C.gold,alpha:P(lt,.4,.3)});});
    sub('j2','j3b',()=>{text('제주 농어촌민박 · 관광객 (제주도 통계)',960,165,{f:'D',s:50,c:C.gold});
      text('민박 2021년',640,320,{a:'right',f:'D',s:40,c:C.dim});hbar(680,320,760,80,4789,6800,'#9aa4b8','4,789곳',{s:46,lc:'#c9ced9'});
      text('민박 2025년 말',640,440,{a:'right',f:'D',s:40});const q=K('j2',0);if(q<0)text('?',760,440,{f:'D',s:56,c:C.gold});else hbar(680,440,760,80,6285,6800,C.red,'6,285곳 (+31.2%)',{s:46,k:E.out(P(q,0,.6))});
      if(L('j3')>=0){text('관광객 2025년',640,600,{a:'right',f:'D',s:40});const r=K('j3',0);text(r>=0?'1,384만 명 (1년 전보다 −0.6%)':'?',680,600,{a:'left',f:'D',s:48,c:r>=0?'#6FD3FF':C.gold});}
      if(L('j3b')>=0)stampBox('방은 늘고, 손님은 줄고',1300,760,L('j3b'),{s:52,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('경향신문 2026.1.14 (제주도 2025년 말 숙박시설·관광객 통계)');});
    sub('j4','j4',()=>{text('문을 닫은 제주 농어촌민박',960,165,{f:'D',s:54,c:C.gold});
      [['2022',357],['2023',243],['2024',491],['2025',490]].forEach(([y,v],i)=>{const x=480+i*320,base=720,sc=.8,t=i<3?CT('j4')+.3+i*.15:KT('j4',0),k=E.out(P(T,t,.5));if(T<t){if(i===3)text('?',x,base-120,{f:'D',s:80,c:C.gold});return;}
        vCash(x-100,base-v*sc*k,200,v*sc*k,i>=2?C.red:'#9aa4b8');text(v+'곳',x,base-v*sc-34,{f:'D',s:48,c:i>=2?C.red:'#c9ced9',alpha:k});text(y+'년',x,base+40,{f:'D',s:36});});
      srcLine('경향신문 2026.1.14 (제주도 통계)');});
    sub('j5','j5b',()=>{text('제주 숙박 객실 vs 적정 객실',960,165,{f:'D',s:54,c:C.gold});
      text('적정 객실 (2018년 관광객 1,431만 명 기준)',1000,320,{a:'right',s:36,w:900,c:C.dim,max:740});hbar(1040,320,760,80,46000,80000,'#9aa4b8','4만 6,000실',{s:40,lc:'#c9ced9'});
      text('지금 제주 숙박시설 객실 (2025년 말)',1000,450,{a:'right',s:36,w:900,max:740});if(T>FR('j5',.6))hbar(1040,450,760,80,78908,80000,C.red,'',{k:E.out(P(T,FR('j5',.6),.6))});
      if(T>FR('j5',.75))text('7만 8,908실',1420,530,{f:'D',s:50,c:C.red});
      if(L('j5b')>=0)stampBox('1.7배',960,720,L('j5b'),{s:90,c:C.red,bg:'rgba(40,0,0,.9)'});
      srcLine('한국은행 제주본부 적정 객실 추정 · 제주도 숙박시설 통계 (경향신문 2026.1.14 인용)');});
    sub('j6','j6',lt=>{['방이 손님보다 빨리 늘면','가동률이 먼저 떨어지고','그다음은 요금'].forEach((s,i)=>text(s,960,330+i*140,{f:'D',s:66,c:i===2?C.red:C.gold,alpha:P(lt,.2+i*.5,.3)}));});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('예시 펜션 두 사람 한 달 몫 · 하나씩만 바꿔 보면',960,165,{f:'D',s:44,c:C.gold,alpha:P(a,0,.3),max:1800});
    if(T<CT('l2'))text('바꿀 수 있는 숫자는?',960,500,{f:'D',s:90,alpha:P(a,.2,.3)});
    const rows=[['지금',180,CT('l1')+1.2,'180만'],['청소비 2만 원',240,KT('l2',0),'240만'],['청소비 4만 원',120,FR('l2',.7),'120만'],['전부 2박 · 10% 할인',216,KT('l3',0),'216만'],['요금 +1만 원',234,KT('l4',0),'234만'],['열 밤 더 참',240,KT('l5',0),'240만'],['열 밤 빔',120,KT('l5',1),'120만']];
    const Z=560,SCL=4.2;
    if(T>=CT('l1')+1){ctx.save();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;line(Z,215,Z,820);ctx.restore();}
    if(T>=CT('l2')){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(Z+180*SCL,215,Z+180*SCL,820);ctx.restore();}
    rows.forEach(([l,v,t,lab],i)=>{if(T<CT('l1')+1.1)return;const y=250+i*84;const ids=['l1','l2','l2','l3','l4','l5','l5'];if(L(ids[i])<0)return;const bad=v<180;text(l,60,y,{a:'left',s:34,w:900,max:480,c:bad?'#ffb3b3':'#fff'});
      if(T<t){text('?',Z+60,y,{f:'D',s:52,c:C.gold});return;}const k=E.out(P(T,t,.6));
      const w=Math.max(6,v*SCL*k),col=bad?C.red:i===0?'#5b6275':C.green;ctx.fillStyle=col;rr(Z,y-28,w,56,14);ctx.fill();
      text(lab,Z+w+18,y+2,{a:'left',f:'D',s:44,c:col==='#5b6275'?'#c9ced9':col,alpha:k});});
    if(L('l6')>=0){group(960,830,1,0,P(L('l6'),0,.3),()=>{panel(-760,-46,1520,92,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text(L('l6b')>=0?'청소비와 숙박 일수 = 생각보다 큰 손잡이':'청소비 1만 원 차이 = 열 밤의 손님',0,4,{f:'D',s:40,c:C.gold,max:1480});});}
    else if(T>=CT('l2'))srcLine('예시 계산 · 한 번에 하나씩 · 기준 60박 · 1박 손님',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('숙소 요금을 정하기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','한 번 나갈 때 드는 돈','청소 인건비 + 세탁 + 소모품','오늘 펜션: 3만 원'],['k3','평균 숙박 일수','한 팀이 몇 밤을 자고 가나','오늘 펜션: 전부 1박'],['k4','연박 할인의 한계','청소 한 번 아낀 돈보다 덜 깎기','오늘 펜션: 16.7%까지'],
      ['k5','비수기 가동률','가장 빈 달로 고정비 나누기','50박이면 120만 원'],['k6','총액으로 보이는 값','청소비까지 넣은 손님 눈의 값','10만 + 청소 옵션?']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-760,-280,1520,540,{bg:'rgba(6,13,32,1)',bd:C.gold});text('방 3개 · 1박 15만 원 · 한 달 40박 · 전부 1박',0,-200,{f:'D',s:42,max:1440});text('앱 수수료 10% · 청소 한 번 4만 원 · 고정비 150만 원 → 한 달 몫은?',0,-140,{f:'D',s:38,max:1440});
      const b=L('k7b');text('매출 600만 − 수수료 60만 − 청소비 160만 (40번 × 4만)',0,-50,{f:'D',s:42,c:b>=0?C.gold:'#fff',alpha:b>=0?1:0,max:1440});
      if(b>=0)text('− 고정비 150만 원',0,30,{f:'D',s:42,alpha:P(T,FR('k7b',.45),.3),max:1440});
      const k=K('k7b',0);if(k>=0)text('230만 원',0,140,{f:'D',s:100,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});else text('?',0,140,{f:'D',s:110,c:C.gold});
      if(L('k7c')>=0)text('청소비 160만 원 = 몫 230만 원의 70%',0,232,{s:34,w:900,c:'#6FD3FF',alpha:P(L('k7c'),0,.3)});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('1박 10만 원',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      const k=P(L('z2'),0,4.5),X=240,y=380,gap=160;let acc=0;
      GR.forEach((g,gi)=>{const shown=clamp(k*4-gi);for(let j=0;j<g.n;j++)wonBill(X+(acc+j)*gap,y,.95,{pc:shown>0?g.col:null});
        if(shown>0){const mid=X+(acc+(g.n-1)/2)*gap;text(g.name,mid,y+86,{s:30,w:900,c:g.col,alpha:shown,max:g.n*gap});text(g.v+'만 원',mid,y+126,{f:'D',s:34,c:'#fff',alpha:shown});}acc+=g.n;});
      if(T>FR('z2',.75))pill('청소비 한 달 180만 = 두 사람 몫 180만',960,620,{s:38,bg:'rgba(200,235,255,.95)',alpha:P(T,FR('z2',.75),.3)});
      const b=L('z2b');if(b>=0)group(960,770,1,0,P(b,0,.3),()=>{ctx.fillStyle='#fff';rr(-660,-70,1320,140,30);ctx.fill();text('같은 60박 · 2박 손님 · 10% 할인 → +36만 원',0,4,{f:'D',s:44,c:'#16794a',max:1260});});
    }else{
      pension(620,520,.7);mop(1240,520,.75);drawMascot(1600,560,.55,'happy');
      stampBox('비용 = 손님이 나갈 때마다 다시 차리는 방',960,800,c,{s:54,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1240,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-440,-70,880,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 한 번 나갈 때 청소비, 얼마 드세요?',0,4,{s:36,w:900,c:C.ink,max:840});});
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
