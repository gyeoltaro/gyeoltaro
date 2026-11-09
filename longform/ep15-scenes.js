/* ════════════════════════════════════════════════════════════════════
   장면 (LF.15 붕어빵 세 마리 2,000원 노점 계산서) — 수치·출처는 docs/longform-ep15.md
   중심 그림: 한 봉지(세 마리) 2,000원 = 100원 동전 20개. 반죽 3 · 팥 앙금 2 · 가스·봉투 2 · 자리·전기 1 · 두 사람 몫 12.
   반전: 팥값이 평년보다 43.6% 높아도 한 봉지 60원. 값은 천 원짜리 단위 계단(333 → 500 → 667 → 1,000원)으로만 오른다.
   ════════════════════════════════════════════════════════════════════ */
const GR=[ // 동전 묶음 (동전 20개 = 2,000원)
  {k:'dough',name:'반죽',n:3,v:300,col:'#E8C27A'},
  {k:'bean',name:'팥 앙금',n:2,v:200,col:'#c8553d'},
  {k:'gas',name:'가스·봉투',n:2,v:200,col:'#6FD3FF'},
  {k:'place',name:'자리',n:1,v:100,col:'#9aa4b8'},
  {k:'own',name:'두 사람 몫',n:12,v:1200,col:'#35E08A'},
];
const GRK=Object.fromEntries(GR.map(s=>[s.k,s]));
const SEQ=['3','0','0','0','0','0','0','÷','5','0','0','='];   // 한 달 몫 3,000,000 ÷ 500시간 = 6,000 (0 개수: 3000000 여섯, 500 둘)
function grT(k){return {dough:KT('s1',0),bean:KT('s2',0),gas:KT('s3',0),place:KT('s4',0),own:KT('s5',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}

/* 100원 동전 */
function coin(x,y,r,o={}){const al=o.alpha??1;if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.translate(x,y);
  ctx.fillStyle='#7d8492';ctx.beginPath();ctx.arc(0,4,r,0,7);ctx.fill();
  const g=ctx.createLinearGradient(-r,-r,r,r);g.addColorStop(0,'#eef1f5');g.addColorStop(1,'#a9b0bc');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();
  if(o.pc){ctx.save();ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.clip();ctx.fillStyle=o.pc;ctx.fillRect(-r,-r,2*r*(o.part??1),2*r);ctx.restore();}
  ctx.strokeStyle=o.ring||'rgba(90,96,110,.9)';ctx.lineWidth=o.ring?Math.max(4,r*.12):Math.max(2,r*.05);ctx.beginPath();ctx.arc(0,0,r*.94,0,7);ctx.stroke();
  if(!o.noTxt)text('100',0,3,{f:'D',s:r*.62,c:o.pc&&(o.part??1)>.6?'#14161c':'#5b616e'});
  ctx.restore();}
/* 붕어빵 (머리 왼쪽). s=1 이면 폭 약 280 */
function fish(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,74,130,18,0,0,7);ctx.fill();
  const g=ctx.createLinearGradient(0,-80,0,80);g.addColorStop(0,o.frozen?'#e9d7b8':'#f0b25a');g.addColorStop(1,o.frozen?'#b9a07a':'#b8691f');ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-140,0);ctx.quadraticCurveTo(-120,-78,-10,-70);ctx.quadraticCurveTo(70,-62,96,-22);ctx.lineTo(146,-64);ctx.quadraticCurveTo(128,0,146,64);ctx.lineTo(96,22);ctx.quadraticCurveTo(70,62,-10,70);ctx.quadraticCurveTo(-120,78,-140,0);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(110,55,10,.55)';ctx.lineWidth=5;ctx.stroke();
  ctx.lineWidth=4;for(let i=0;i<4;i++)for(let j=-1;j<=1;j++){ctx.beginPath();ctx.arc(-34+i*30,j*30,15,-1.2,1.2);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-86,-50);ctx.quadraticCurveTo(-72,0,-86,50);ctx.stroke();
  for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(108,-14+i*14);ctx.lineTo(138,-40+i*40);ctx.stroke();}
  ctx.fillStyle='#4a2508';ctx.beginPath();ctx.arc(-108,-16,8,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-110,-19,2.5,0,7);ctx.fill();
  ctx.fillStyle='rgba(255,240,200,.3)';ctx.beginPath();ctx.ellipse(-40,-44,50,12,-.1,0,7);ctx.fill();
});}
/* 종이봉투 (세 마리) */
function pouch(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  fish(-40,-120,.42,{rot:-1.2});fish(10,-130,.42,{rot:-1.55});fish(58,-118,.42,{rot:-1.9});
  ctx.fillStyle='#d9b382';ctx.beginPath();ctx.moveTo(-110,-90);ctx.lineTo(110,-90);ctx.lineTo(96,130);ctx.lineTo(-96,130);ctx.closePath();ctx.fill();
  ctx.fillStyle='#c79c66';ctx.beginPath();ctx.moveTo(-110,-90);ctx.lineTo(110,-90);ctx.lineTo(104,-60);ctx.lineTo(-104,-60);ctx.closePath();ctx.fill();
  if(o.label)text(o.label,0,30,{f:'D',s:o.ls||40,c:'#5a3a14',max:180});
});}
/* 붕어빵 노점 (상표 없음) */
function stall(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  const dim=o.dim?.45:1;ctx.save();ctx.globalAlpha*=dim;
  ctx.fillStyle='#2f3542';rr(-330,40,660,230,16);ctx.fill();ctx.fillStyle='#565f73';rr(-330,40,660,40,10);ctx.fill();
  [[-250,280],[250,280]].forEach(([a,b])=>{ctx.fillStyle='#1b1f27';ctx.beginPath();ctx.arc(a,b,34,0,7);ctx.fill();ctx.fillStyle='#8a93a6';ctx.beginPath();ctx.arc(a,b,12,0,7);ctx.fill();});
  ctx.fillStyle='rgba(255,170,90,.18)';ctx.fillRect(-310,-210,620,250);
  ctx.strokeStyle='#6b6f7a';ctx.lineWidth=10;line(-310,-200,-310,40);line(310,-200,310,40);
  for(let i=0;i<7;i++){ctx.fillStyle=i%2?'#f08a24':'#e0442c';ctx.beginPath();ctx.moveTo(-360+i*103,-270);ctx.lineTo(-257+i*103,-270);ctx.lineTo(-257+i*103,-200);ctx.quadraticCurveTo(-308+i*103,-170,-360+i*103,-200);ctx.closePath();ctx.fill();}
  ctx.fillStyle='#e0442c';rr(-360,-330,720,70,14);ctx.fill();text(o.name||'붕어빵',0,-294,{f:'D',s:52,c:'#fff3d6'});
  ctx.fillStyle='#3a3f4b';rr(-250,-20,500,60,10);ctx.fill();for(let i=0;i<5;i++){ctx.fillStyle='#1d2027';rr(-236+i*96,-12,84,44,8);ctx.fill();}
  if(!o.empty){for(let i=0;i<4;i++)fish(-200+i*125,-70,.36);}
  if(o.light!==false&&!o.dim){ctx.fillStyle='rgba(255,220,140,.9)';ctx.beginPath();ctx.arc(0,-185,12,0,7);ctx.fill();}
  if(!o.empty&&!o.dim)for(let i=0;i<3;i++){const ph=(T*.6+i*.33)%1;ctx.strokeStyle=`rgba(255,255,255,${.35*(1-ph)})`;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-120+i*120,-110-ph*80);ctx.quadraticCurveTo(-100+i*120,-140-ph*80,-120+i*120,-170-ph*80);ctx.stroke();}
  ctx.restore();
});}
/* LPG 가스통 */
function lpg(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='#3a6fd1';rr(-100,-150,200,300,60);ctx.fill();ctx.fillStyle='#2a4f99';rr(-60,-200,120,60,14);ctx.fill();ctx.fillStyle='#c9ced9';rr(-20,-230,40,40,8);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.2)';rr(-80,-130,30,240,14);ctx.fill();text('LPG',0,-20,{f:'D',s:56,c:'#fff'});text(o.kg||'20kg',0,40,{s:30,w:900,c:'#dbe8ff'});
});}
/* 팥 포대 */
function beanSack(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='#d8c9a8';ctx.beginPath();ctx.moveTo(-120,-140);ctx.quadraticCurveTo(0,-170,120,-140);ctx.lineTo(136,140);ctx.quadraticCurveTo(0,170,-136,140);ctx.closePath();ctx.fill();
  ctx.fillStyle='#7a1f1f';ctx.beginPath();ctx.ellipse(0,-140,112,26,0,0,7);ctx.fill();
  for(let i=0;i<40;i++){ctx.fillStyle=i%3?'#a52a2a':'#c0392b';ctx.beginPath();ctx.ellipse(-90+rnd(i*3.3)*180,-150+rnd(i*1.7)*24,7,5,rnd(i)*3,0,7);ctx.fill();}
  ctx.fillStyle='#a52a2a';rr(-90,-60,180,110,10);ctx.fill();text('국산 팥',0,-20,{s:36,w:900,c:'#fff'});text('40kg',0,24,{s:30,w:900,c:'#ffd6d6'});
});}
/* 냉동 붕어빵 봉지 (상표 없음) */
function frozenBag(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='#2b6cb0';rr(-150,-190,300,380,24);ctx.fill();ctx.fillStyle='#cfe6ff';rr(-150,-190,300,60,24);ctx.fill();
  text('❄',0,-160,{s:40,c:'#2b6cb0'});text('냉동 붕어빵',0,-80,{f:'D',s:40,c:'#fff'});
  fish(0,30,.6);text('11~12마리',0,140,{s:30,w:900,c:'#dbe8ff'});
});}
/* 천 원짜리 */
function bill(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='#7fb7e6';rr(-150,-70,300,140,12);ctx.fill();ctx.strokeStyle='#3d6f9e';ctx.lineWidth=5;rr(-140,-60,280,120,10);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(70,0,40,0,7);ctx.fill();text('1,000',-40,4,{f:'D',s:46,c:'#123a63'});
});}
/* 사람 */
function person(x,y,s,col,al=1){if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-48*s,22*s,0,7);ctx.fill();rr(x-30*s,y-20*s,60*s,70*s,22*s);ctx.fill();ctx.restore();}
/* 동전 20개 줄 */
function coinRow(X,y,r,gap,o={}){let i=0;GR.forEach(g=>{for(let j=0;j<g.n;j++,i++){const t=o.all?-1e9:grT(g.k);const on=T>=t;
  coin(X+i*gap,y,r,{pc:on?g.col:null,ring:on?g.col:null,alpha:o.alpha??1});
  if(g.k==='own'&&j===0&&o.extraK>0){ctx.save();ctx.beginPath();ctx.arc(X+i*gap,y,r,0,7);ctx.clip();ctx.fillStyle=C.red;ctx.fillRect(X+i*gap-r,y-r,2*r*.84*o.extraK,2*r);ctx.restore();}
}});}
/* 계단 (한 마리 값) */
function stairs(x0,base,o={}){const steps=[[333,'3개 1,000원'],[500,'2개 1,000원'],[667,'3개 2,000원'],[1000,'1개 1,000원']];const sw=o.sw||300,sc=o.sc||.42;
  steps.forEach(([v,l],i)=>{const t=o.t?o.t[i]:-1e9;if(T<t)return;const k=E.out(P(T,t,.5));const hl=o.hl===i;
    ctx.fillStyle=hl?C.gold:i===3?'rgba(255,77,77,.75)':'rgba(255,255,255,.18)';rr(x0+i*sw,base-v*sc*k,sw-14,v*sc*k,12);ctx.fill();
    text(l,x0+i*sw+(sw-14)/2,base+36,{s:30,w:900,c:hl?C.gold:'#fff',alpha:k,max:sw-10});
    if(o.num)text(v.toLocaleString('ko-KR')+'원',x0+i*sw+(sw-14)/2,base-v*sc-34,{f:'D',s:46,c:hl?C.gold:'#fff',alpha:k});});
  if(o.pct&&o.pctK>0)['+50%','+33%','+50%'].forEach((p,i)=>{const v2=[500,667,1000][i];pill(p,x0+(i+1)*sw+(sw-14)/2,base-v2*sc+44,{s:30,alpha:P(o.pctK,i*.25,.3),bg:'rgba(255,230,150,.95)'});});
}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o2')){
      const a=L('o1');
      stall(540,560,.95*E.back(P(a,0,.5))+.001);
      group(1380,360,1,-.03,P(a,.3,.3),()=>{panel(-420,-150,840,300,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:5});text('국산 붉은 팥 중도매가',0,-80,{s:42,w:900,c:C.dim});const q=K('o1',0);text(q>=0?'평년보다 +43.6%':'?',0,20,{f:'D',s:84,c:C.red});text('2026년 11월',0,100,{s:34,w:900});});
      srcLine('aT 농산물유통정보 (아시아경제 2026.11.6 · 경기일보 2026.11.9)');
    }else if(T<CT('o3')){
      const b=L('o2');
      fish(540,500,1.7*E.back(P(b,0,.4))+.001);
      text('붕어빵 한 마리',540,720,{f:'D',s:56,alpha:P(b,.2,.3)});
      text('팥값이 더 드는 돈',1360,300,{f:'D',s:52,c:C.dim,alpha:P(b,.3,.3)});
      big('o2',0,1360,480,'20원',{f:'D',s:220,c:C.red,glow:'rgba(255,77,77,.45)'});
      srcLine('예시 가정: 앙금 한 마리 25g · 앙금값이 팥값만큼 오른다고 치면 · 계산은 아래 장에서');
    }else if(T<CT('o4')){
      const b=L('o3');
      pouch(480,520,1.1,{label:'2개 1,000원',ls:34,alpha:P(b,0,.3)});text('한 마리 500원',480,740,{f:'D',s:50,c:C.dim,alpha:P(b,0,.3)});
      text('→',960,520,{f:'D',s:110,c:C.dim,alpha:P(b,.2,.3)});
      if(T>FR('o3',.5))pouch(1440,520,1.1,{label:'3개 2,000원',ls:34,alpha:P(T,FR('o3',.5),.3)});
      if(T>FR('o3',.5))text('한 마리 667원',1440,740,{f:'D',s:50,c:C.gold,alpha:P(T,FR('o3',.5),.3)});
      const q=K('o3',0);if(q>=0)stampBox('한 번에 +33%',960,250,q,{s:80,c:C.red,bg:'rgba(40,0,0,.9)'});
      srcLine('같은 노점이 지난해 2마리 1,000원 → 올해 3개 2,000원 (아시아경제 2026.11.6)');
    }else if(T<CT('o5')){
      const b=L('o4');
      drawMascot(480,560,.95,'worry',{alpha:P(b,0,.3)});
      group(1300,400,1,0,P(b,.2,.3),()=>{panel(-480,-140,960,280,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('예시 노점 · 두 사람 시급',0,-70,{s:40,w:900,c:C.dim});const q=K('o4',0);text(q>=0?'6,000원':'?',0,40,{f:'D',s:120,c:C.red});});
      if(K('o4',0)>=0)group(1300,700,1,0,P(K('o4',0),.3,.3),()=>{hbar(-460,0,720,50,6000,11000,C.red,'',{});ctx.strokeStyle=C.gold;ctx.lineWidth=5;const mx=-460+720*10320/11000;line(mx,-40,mx,40);text('최저시급 1만 320원',mx-10,-62,{s:30,w:900,c:C.gold});});
      srcLine('예시 가정 · 계산은 아래 장에서');
    }else if(T<CT('o6')){
      const b=L('o5'),q=K('o5',0);
      text('한 마리 1,000원으로 올리면',960,190,{f:'D',s:66,c:C.gold,alpha:P(b,0,.3)});
      for(let i=0;i<10;i++){const gone=q>=0&&i>=6;person(330+i*140,520,1.6,gone?C.red:'#c9ced9',gone?1-P(q,.2+(i-6)*.12,.4)*.8:P(b,.2+i*.04,.3));}
      if(q>=0)text('열 명 중 네 명이 떠나도',960,700,{f:'D',s:60,c:'#fff',alpha:P(q,.2,.3)});
      if(T>FR('o5',.62))stampBox('사장님 몫은 그대로',960,820,T-FR('o5',.62),{s:60,c:C.green,bg:'rgba(0,40,20,.9)'});
    }else{
      const k9=L('o6'),k10=L('o7');
      text('붕어빵 값을 정하기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:72,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['팥값·가스값 (공공 통계 보도)','노점 수 (서울시 집계 보도)','노점 숫자 = 예시 가정'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,380+i*580,760,{s:32,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('붕어빵 세 마리 2,000원 노점 계산서',960,250,{f:'D',s:112,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('값은 왜 계단으로만 오를까',960,400,{s:56,w:900,alpha:P(a,.3,.3)});
    stall(700,760,.55,{alpha:P(a,.2,.3)});pouch(1150,760,.8,{alpha:P(a,.3,.3)});drawMascot(1480,720,.8,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 노점 ── */
  setup:{draw(){
    sub('p1','p2',()=>{stall(560,520,.95);
      if(L('p2')>=0){text('동네 길목 붕어빵 노점',1380,300,{f:'D',s:56,c:C.gold});
        ['부부 두 사람','하루 10시간 × 한 달 25일','세금 제외'].forEach((s,i)=>pill(s,1380,420+i*100,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p2',.3+i*.15),.3)}));
        text('예시 가정',1380,720,{s:36,w:900,c:C.dim,alpha:P(L('p2'),1,.3)});}});
    sub('p3','p3',()=>{text('한 봉지 값',960,170,{f:'D',s:56,c:C.gold});
      const q=K('p3',0);pouch(520,500,1.3);text(q>=0?'3개 2,000원':'?',520,760,{f:'D',s:80,c:C.gold,alpha:q>=0?P(q,0,.3):1});
      if(T>FR('p3',.4))group(1340,480,1,0,P(T,FR('p3',.4),.3),()=>{panel(-400,-200,800,400,{bd:'rgba(255,255,255,.3)'});text('서울 신당역 근처 한 노점',0,-130,{s:38,w:900,c:C.dim});
        text('2마리 1,000원',-170,-10,{f:'D',s:56,c:C.dim});text('→',60,-10,{f:'D',s:56,c:C.dim});text('3개 2,000원',240,-10,{f:'D',s:56,c:C.gold});text('지난해 겨울 → 올해',0,110,{s:36,w:900});});
      srcLine('아시아경제 2026.11.6 · 경기일보 2026.11.9');});
    sub('p4','p4',()=>{text('하루 100봉지 (300마리)',960,170,{f:'D',s:56,c:C.gold});
      const q=K('p4',0);for(let i=0;i<100;i++){const k=q>=0?P(q,i*.008,.15):0;if(k<=0)continue;pouch(230+(i%20)*76,310+Math.floor(i/20)*96,.24*k);}
      if(T>FR('p4',.45))group(960,820,1,0,P(T,FR('p4',.45),.3),()=>{panel(-700,-50,1400,100,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:3});text('2025년 겨울 르포: 한 노점, 저녁 5시간에 붕어빵 261마리',0,4,{s:36,w:900,c:C.gold,max:1360});});
      srcLine('그림 봉지 하나 = 한 봉지 · 예시 가정 · 르포: 헤럴드경제 2025.11.25',872+0);});
    sub('p5','p5',lt=>{pouch(400,480,1.2*(1-P(lt,1.4,.6))+.001);
      if(lt<1.6)text('한 달 2,500봉지 · 매출 500만 원',1300,480,{f:'D',s:60,c:C.gold,alpha:P(lt,.2,.3)*(1-P(lt,1.3,.3))});
      for(let i=0;i<20;i++){const k=E.back(P(lt,1.5+i*.05,.3));if(k<=0)continue;coin(560+(i%5)*200,240+Math.floor(i/5)*150,60*k);}
      text('한 봉지 2,000원 = 100원 동전 20개',960,860,{f:'D',s:56,c:C.gold,alpha:P(lt,2.4,.4)});});
  }},
  /* ── 2,000원 쪼개기 ── */
  cut:{draw(){
    const X=124,y=320,r=38,gap=88;
    text('한 봉지(세 마리) 2,000원 = 동전 20개',X-30,200,{a:'left',f:'D',s:44,c:C.gold});
    coinRow(X,y,r,gap);
    let i0=0;GR.forEach(g=>{const t=grT(g.k);if(T>=t){const al=P(T,t,.3),x0=X+i0*gap-r,x1=X+(i0+g.n-1)*gap+r,yy=y+r+24;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=g.col;ctx.lineWidth=4;line(x0+6,yy,x1-6,yy);line(x0+6,yy,x0+6,yy-14);line(x1-6,yy,x1-6,yy-14);ctx.restore();
      text(g.name,(x0+x1)/2,yy+36,{s:g.n>1?28:22,w:900,c:g.col,alpha:al,max:x1-x0+12});text(g.v.toLocaleString('ko-KR')+'원',(x0+x1)/2,yy+74,{f:'D',s:g.n>1?32:26,c:g.k==='own'?C.green:'#fff',alpha:al});}i0+=g.n;});
    const Y=760;
    sub('s1','s1',()=>{text('첫 번째: 반죽',960,Y-90,{f:'D',s:54,c:GRK.dough.col});text('5kg 1만 원 → 100마리쯤 = 한 마리 100원 × 3',960,Y-10,{s:36,w:900});popText(KT('s1',0),960,Y+75,'300원 = 동전 3개',{f:'D',s:72,c:GRK.dough.col});});
    sub('s2','s2',()=>{text('두 번째: 팥 앙금',960,Y-90,{f:'D',s:54,c:GRK.bean.col});text('3kg 8,000원 · 한 마리 25g (예시) → 120마리',960,Y-10,{s:36,w:900});popText(KT('s2',0),960,Y+75,'200원',{f:'D',s:80,c:GRK.bean.col});});
    sub('s3','s3',()=>{text('세 번째: 가스 · 봉투',960,Y-90,{f:'D',s:54,c:GRK.gas.col});text('20kg 한 통 약 5만 6,000원 × 주 2통 × 4주 = 45만 ÷ 2,500봉지 + 봉투 20원',960,Y-10,{s:34,w:900,max:1800});popText(KT('s3',0),960,Y+75,'200원',{f:'D',s:80,c:GRK.gas.col});});
    sub('s4','s4',()=>{text('네 번째: 자리 · 전기 · 틀 수리',960,Y-90,{f:'D',s:54,c:GRK.place.col});text('한 달 25만 원 ÷ 2,500봉지 (예시)',960,Y-10,{s:36,w:900});popText(KT('s4',0),960,Y+75,'100원',{f:'D',s:80,c:'#fff'});});
    sub('s5','s5',()=>{text('2,000 − 300 − 200 − 200 − 100',960,Y-90,{f:'D',s:46,c:C.dim});text('두 사람 몫',960-300,Y+20,{f:'D',s:56,c:C.green});big('s5',0,960+160,Y+20,'1,200원',{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)'});});
    sub('s6','s6',()=>{text('1,200원 × 2,500봉지',960-400,Y-60,{s:40,w:900,c:C.dim});big('s6',0,960-400,Y+40,'300만 원',{f:'D',s:96,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('s6',.5))text('매출 500만의 60%',960+420,Y-10,{f:'D',s:64,c:C.gold,alpha:P(T,FR('s6',.5),.3)});
      srcLine('반죽·앙금·봉투·가스 단가: 헤럴드경제 2025.11.25 르포 · 한국경제 2026.11.4 (가스 한 통 환산) · 나머지는 예시');});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('÷'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} ÷ ${n2.replace('=','')} =`;bigS='6,000';}else if(n2!==undefined){small=`${fmt(n1)} ÷`;bigS=n2||fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('두 사람 한 달 몫 300만 원',1350,250,{f:'D',s:56,c:C.gold,alpha:P(a,.2,.3),max:1000});text('÷ 일한 시간 (2명 × 하루 10시간 × 25일)',1350,345,{s:36,w:900,alpha:P(a,.4,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{const c2=L('c2');group(1350,520,1,0,P(c2,0,.3),()=>{panel(-470,-80,940,160,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('한 사람 시급 (500시간)',0,-30,{s:36,w:900,c:C.dim});const q=K('c2',0);text(q>=0?'6,000원':'?',0,32,{f:'D',s:60,c:C.red});});
        if(L('c3')>=0){group(1350,700,1,0,P(L('c3'),0,.3),()=>{hbar(-430,0,640,56,6000,11000,C.red,'',{});ctx.strokeStyle=C.gold;ctx.lineWidth=5;const mx=-430+640*10320/11000;line(mx,-40,mx,40);text('최저시급 1만 320원',mx-10,-62,{s:30,w:900,c:C.gold});});
          if(T>FR('c3',.45))stampBox('둘이 최저시급이면 516만 원',1350,850,T-FR('c3',.45),{s:44,c:C.red,bg:'rgba(40,0,0,.9)'});}}}
    if(dt>=0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 팥값 43.6% ── */
  bean:{draw(){
    sub('b1','b1',lt=>{pouch(600,520,1.6*E.back(P(lt,0,.5))+.001);text('뉴스 속 재룟값은',1300,360,{f:'D',s:80,c:C.gold});text('이 봉지에 얼마?',1300,480,{f:'D',s:80});});
    sub('b2','b2',()=>{text('국산 붉은 팥 40kg 중도매 가격',960,165,{f:'D',s:52,c:C.gold});
      beanSack(300,500,1.1);
      text('평년',700,400,{a:'right',f:'D',s:48,c:C.dim});hbar(740,400,900,90,47.2,75,'#9aa4b8','47만 2,316원',{s:44,lc:'#c9ced9'});
      text('2026년 11월',700,560,{a:'right',f:'D',s:44,c:'#fff'});const q=K('b2',0);if(q<0)text('?',800,560,{f:'D',s:60,c:C.gold});else hbar(740,560,900,90,67.8,75,C.red,'67만 8,000원',{s:50,k:E.out(P(q,0,.6))});
      if(T>FR('b2',.75))stampBox('+43.6%',1300,730,T-FR('b2',.75),{s:70,c:C.red,bg:'rgba(40,0,0,.9)'});
      srcLine('aT 농산물유통정보 · 당월 평균 (아시아경제 2026.11.6 · 경기일보 2026.11.9 인용)');});
    sub('b3','b3',()=>{text('우리 노점 붕어빵 한 마리의 팥 앙금',960,165,{f:'D',s:52,c:C.gold});
      text('평년 값이면',560,330,{f:'D',s:44,c:C.dim});text('47원',560,440,{f:'D',s:110,c:'#c9ced9'});
      text('→',960,440,{f:'D',s:90,c:C.dim});text('지금',1360,330,{f:'D',s:44,c:C.dim});text('67원',1360,440,{f:'D',s:110,c:C.red});
      text('한 마리 +20원 × 세 마리',960,610,{s:40,w:900,alpha:P(T,FR('b3',.5),.3)});big('b3',0,960,720,'한 봉지 +60원',{f:'D',s:90,c:C.red});
      srcLine('예시 가정: 앙금 3kg 8,000원(2025 르포) · 앙금값이 팥값만큼 움직인다고 치면 (실제로는 설탕·가공비가 섞인다)');});
    sub('b4','b4a',()=>{text('가스값',960,165,{f:'D',s:56,c:C.gold});lpg(380,500,1.2);
      group(1200,370,1,0,1,()=>{panel(-560,-110,1120,220,{bg:'rgba(6,13,32,1)',bd:C.red,lw:4});text('취사용 LPG · 2026년 10월 · 1년 전 대비',0,-50,{s:36,w:900,c:C.dim});const q=K('b4',0);text(q>=0?'+15.2%':'?',0,40,{f:'D',s:90,c:C.red});});
      if(T>FR('b4',.6))pill('프로판 평균 판매가 kg당 2,812원 (1년 전 2,446원)',1200,560,{s:32,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('b4',.6),.3)});
      if(L('b4a')>=0)group(1200,700,1,0,P(L('b4a'),0,.3),()=>{ctx.fillStyle='#fff';rr(-520,-70,1040,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-200,70);ctx.lineTo(-230,120);ctx.lineTo(-150,70);ctx.fill();text('"일주일에 한 통, 5만 원 → 5만 5,000원"',0,4,{s:38,w:900,c:C.ink,max:1000});});
      srcLine('국가데이터처 10월 소비자물가 · 오피넷 (아시아경제 2026.11.6 · 한국경제 2026.11.4) · 상인 말: 한국경제');});
    sub('b5','b5',()=>{text('한 봉지에서 늘어난 돈',960,165,{f:'D',s:54,c:C.gold});
      const rows=[['가스 180원 × 15%','+23원',C.red,KT('b5',0)],['종이봉투 20원 × 5.1%','+1원','#c9ced9',FR('b5',.65)]];
      rows.forEach(([l,v,col,t],i)=>{const y=360+i*170;text(l,900,y,{a:'right',f:'D',s:52,c:'#fff'});if(T<t){text('?',980,y,{f:'D',s:64,c:C.gold});return;}text(v,980,y,{a:'left',f:'D',s:80,c:col,alpha:P(T,t,.3)});});
      srcLine('한국은행 9월 생산자물가: 기타 종이제품 +5.1% (비닐 등 포장용 플라스틱은 +39.2%) · 예시 노점 단가로 환산');});
    sub('b6','b6',lt=>{text('올해 오른 비용, 다 합치면',960,165,{f:'D',s:54,c:C.gold});
      const X=124,y=360,r=38,gap=88;for(let i=0;i<20;i++){const own=i>=8;coin(X+i*gap,y,r,{pc:own?C.green:'#5b6275',ring:own?C.green:null});}
      const k=E.out(P(lt,.6,.8));if(k>0){ctx.save();ctx.beginPath();ctx.arc(X+8*gap,y,r,0,7);ctx.clip();ctx.fillStyle=C.red;ctx.fillRect(X+8*gap-r,y-r,2*r*.84*k,2*r);ctx.restore();text('+84원',X+8*gap,y-r-30,{f:'D',s:40,c:C.red,alpha:k});}
      text('팥 60 + 가스 23 + 봉투 1 = 한 봉지 84원 · 한 달 21만 원',960,520,{f:'D',s:46,max:1800,alpha:P(lt,.3,.3)});
      if(T>FR('b6',.6))stampBox('동전 한 개도 안 된다',960,720,T-FR('b6',.6),{s:64,c:C.gold,bg:'rgba(40,30,0,.9)'});});
    sub('b7','b7',()=>{text('손님이 느끼는 값',960,165,{f:'D',s:54,c:C.gold});
      text('오른 비용',600,330,{a:'right',f:'D',s:48,c:C.dim});hbar(640,330,1000,90,84,560,'#c9ced9','+84원',{s:50,lc:'#c9ced9'});
      text('봉지 값',600,500,{a:'right',f:'D',s:48});if(T>FR('b7',.25))hbar(640,500,1000,90,500,560,C.red,'+500원',{s:56,k:E.out(P(T,FR('b7',.25),.6))});
      if(T>FR('b7',.25))text('1,500원 → 2,000원',1140,600,{f:'D',s:44,c:C.red,alpha:P(T,FR('b7',.3),.3)});
      if(T>FR('b7',.75))text('그 차이는 어디서?',960,760,{f:'D',s:80,c:C.gold,alpha:P(T,FR('b7',.75),.3)});});
  }},
  /* ── 값은 계단으로 ── */
  stair:{draw(){
    sub('t1','t1',lt=>{fish(560,520,1.6*E.back(P(lt,0,.5))+.001);text('붕어빵 값이',1320,380,{f:'D',s:86,c:C.gold});text('걸어온 길',1320,500,{f:'D',s:86});});
    sub('t2','t3',()=>{text('한 봉지 값 → 한 마리 값',960,160,{f:'D',s:54,c:C.gold});
      const t=[CT('t2')+.3,FR('t2',.4),FR('t2',.62),FR('t2',.82)];
      stairs(380,760,{t,num:L('t3')>=0,pct:true,pctK:K('t3',0)});
      srcLine('3개 1,000원 → 코로나 뒤 2개 1,000원 → 3개 2,000원 · 1개 1,000원 (한국경제 2026.11.4)');});
    sub('t4','t4',lt=>{text('붕어빵은 천 원짜리로 사는 간식',960,165,{f:'D',s:54,c:C.gold});
      bill(520,420,1.1,{alpha:P(lt,.2,.3)});bill(640,560,1.1,{alpha:P(lt,.5,.3),rot:.06});
      text('한 장, 두 장',580,720,{f:'D',s:56,alpha:P(lt,.6,.3)});
      if(T>FR('t4',.6)){const k=P(T,FR('t4',.6),.3);text('3개 2,060원?',1380,430,{f:'D',s:90,c:'#fff',alpha:k});for(let i=0;i<6;i++)coin(1180+i*80,580,30,{alpha:k,noTxt:true});
        if(T>FR('t4',.8)){ctx.save();ctx.globalAlpha*=P(T,FR('t4',.8),.2);ctx.strokeStyle=C.red;ctx.lineWidth=14;line(1120,360,1640,640);ctx.restore();}}});
    sub('t5','t5',lt=>{text('값은 계단 위에 멈추고, 비용은 조금씩 오른다',960,165,{f:'D',s:50,c:C.gold});
      const x0=260,x1=1660,base=780,sc=.6;ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;line(x0,base,x1,base);
      const k=E.out(P(lt,.2,2.4)),xe=x0+(x1-x0)*k;
      ctx.save();ctx.beginPath();ctx.rect(x0,0,xe-x0,H);ctx.clip();
      ctx.fillStyle='rgba(53,224,138,.25)';ctx.beginPath();ctx.moveTo(x0,base-750*sc);ctx.lineTo(x1,base-750*sc);ctx.lineTo(x1,base-560*sc);ctx.lineTo(x0,base-330*sc);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#fff';ctx.lineWidth=8;line(x0,base-750*sc,x1,base-750*sc);
      ctx.strokeStyle=C.red;ctx.setLineDash([16,10]);line(x0,base-330*sc,x1,base-560*sc);ctx.setLineDash([]);ctx.restore();
      text('봉지 값 (그대로)',x0+20,base-750*sc-36,{a:'left',f:'D',s:40});text('비용 (조금씩 오름)',x1,base-560*sc+50,{a:'right',f:'D',s:40,c:C.red,alpha:k});
      if(T>FR('t5',.6))text('사장님 몫 ↓',1180,base-640*sc+40,{f:'D',s:50,c:C.green,alpha:P(T,FR('t5',.6),.3)});
      srcLine('개념 그림 · 예시');});
    sub('t6','t8',()=>{text('예시: 2개 1,000원으로 3년 버티면 (손님 그대로)',960,160,{f:'D',s:48,c:C.gold,max:1800});
      const bars=[['1년차','봉지 비용 690원',202.5,'202만',FR('t6',.62)],['2년차','745원',188.75,'189만',FR('t6',.75)],['3년차','800원',175,'175만',KT('t6',0)],['올해','3개 2,000원',300,'300만',CT('t8')+.4]];
      const base=700,sc=1.45;bars.forEach(([l,c2,v,lab,t],i)=>{const x=420+i*360;if(T<t){if(i<3&&L('t6')>=0)text('?',x,base-80,{f:'D',s:70,c:C.gold});return;}const k=E.out(P(T,t,.6));const col=i===3?C.green:i===2?C.red:'#9aa4b8';
        vCash(x-110,base-v*sc*k,220,v*sc*k,col);text(lab,x,base-v*sc-34,{f:'D',s:52,c:col,alpha:k});text(l,x,base+40,{f:'D',s:40});text(c2,x,base+86,{s:28,w:900,c:C.dim});});
      if(L('t7')>=0&&L('t8')<0){group(1500,270,1,0,P(L('t7'),0,.3),()=>{panel(-300,-80,600,160,{bg:'rgba(6,13,32,1)',bd:C.red,lw:4});text('3년차 시급',0,-30,{s:34,w:900,c:C.dim});const q=K('t7',0);text(q>=0?'3,500원':'?',0,34,{f:'D',s:64,c:C.red});});
        if(T>FR('t7',.5))stampBox('올리기 바로 전 해가 가장 덜 번다',700,270,T-FR('t7',.5),{s:46,c:C.red,bg:'rgba(40,0,0,.9)'});}
      if(L('t8')>=0&&T>FR('t8',.45))stampBox('손님: 하룻밤 +33% · 사장님: 3년 치',960,300,T-FR('t8',.45),{s:46,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('예시 가정 · 한 달 2,500봉지 · 두 사람 500시간');});
  }},
  /* ── 한 계단의 무게 ── */
  leave:{draw(){
    sub('v1','v2',()=>{text('다음 계단: 한 마리 1,000원',960,160,{f:'D',s:56,c:C.gold});
      stairs(160,640,{num:true,hl:3,sw:250,sc:.36});
      if(L('v2')>=0){group(1560,420,1,0,P(L('v2'),0,.3),()=>{panel(-320,-170,640,340,{bg:'rgba(6,13,32,1)',bd:C.green,lw:4});text('세 마리 3,000원 · 손님 그대로',0,-100,{s:32,w:900,c:C.dim,max:600});text('두 사람 한 달 몫',0,-30,{s:36,w:900});const q=K('v2',0);text(q>=0?'550만 원':'?',0,70,{f:'D',s:90,c:C.green});});}
      srcLine('예시 가정 · (3,000 − 520) × 2,500봉지 − 고정비 70만');});
    sub('v3','v4a',()=>{text('손님이 얼마나 떠나도 몫 300만 원이 그대로일까',960,160,{f:'D',s:48,c:C.gold,max:1800});
      text('한 봉지 3,000 − 520 = 2,480원 · (300만 + 70만) ÷ 2,480',960,250,{s:36,w:900,c:C.dim,max:1800});
      text('지금 (3개 2,000원)',700,380,{a:'right',f:'D',s:42});hbar(740,380,1000,80,2500,2700,'#9aa4b8','2,500봉지',{s:46,lc:'#c9ced9'});
      text('1개 1,000원 본전',700,510,{a:'right',f:'D',s:42,c:C.gold});const q=K('v3',0);if(q<0)text('?',800,510,{f:'D',s:60,c:C.gold});else hbar(740,510,1000,80,1492,2700,C.gold,'1,492봉지',{s:46,k:E.out(P(q,0,.6))});
      const r=K('v4',0);for(let i=0;i<10;i++){const gone=r>=0&&i>=6;person(560+i*90,720,1,gone?C.red:'#c9ced9',gone?1-P(r,.2,.5)*.75:1);}
      if(r>=0)stampBox('40%가 떠나도 그대로',1620,720,r,{s:52,c:C.green,bg:'rgba(0,40,20,.9)'});
      if(L('v4a')>=0)drawMascot(260,700,.45,'worry',{alpha:P(L('v4a'),0,.3)});});
    sub('v5','v6',()=>{text('손님이 갈 곳이 생겼다',960,160,{f:'D',s:56,c:C.gold});
      frozenBag(360,480,1.05);
      group(1180,330,1,0,1,()=>{panel(-520,-100,1040,200,{bg:'rgba(6,13,32,1)',bd:'#6FD3FF',lw:4});text('한 식품회사 냉동 붕어빵 (2025년 겨울)',0,-45,{s:34,w:900,c:C.dim});const q=K('v5',0);text(q>=0?'한 마리 약 630원':'?',0,40,{f:'D',s:72,c:'#6FD3FF'});});
      if(T>FR('v5',.7))pill('온라인 판매량 +45% (2025년 11월, 전년 대비)',1180,500,{s:32,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('v5',.7),.3)});
      if(L('v6')>=0){group(1180,680,1,0,P(L('v6'),0,.3),()=>{panel(-520,-90,1040,180,{bg:'rgba(6,13,32,1)',bd:C.red,lw:4});text('한 편의점 붕어빵 배달 매출 (10월 1~25일)',0,-40,{s:32,w:900,c:C.dim});const q=K('v6',0);text(q>=0?'+382.9%':'?',0,40,{f:'D',s:70,c:C.red});});}
      srcLine(L('v6')>=0?'경기일보 2026.11.9 (편의점 자료)':'SBS Biz 2025.12.11 (식품회사 자료 · 한 봉지 11~12마리 7,600원)');});
    sub('v7','v8',()=>{text('계단 사이의 계단',960,160,{f:'D',s:56,c:C.gold});
      const steps=[[667,'3개 2,000원'],[750,'2개 1,500원'],[1000,'1개 1,000원']],base=640,sc=.36;
      steps.forEach(([v,l],i)=>{const t=i===1?FR('v7',.3):CT('v7');if(T<t)return;const k=E.out(P(T,t,.5)),x=180+i*290;ctx.fillStyle=i===1?C.gold:'rgba(255,255,255,.2)';rr(x,base-v*sc*k,270,v*sc*k,12);ctx.fill();text(l,x+135,base+36,{s:30,w:900,c:i===1?C.gold:'#fff'});text(v.toLocaleString('ko-KR')+'원',x+135,base-v*sc-34,{f:'D',s:44,c:i===1?C.gold:'#fff',alpha:k});});
      const q=K('v7',0);if(q>=0)pill('+12.5%',605,base-750*sc-110,{s:34,alpha:P(q,0,.3),bg:'rgba(255,230,150,.95)'});
      if(L('v8')>=0){group(1500,420,1,0,P(L('v8'),0,.3),()=>{panel(-370,-200,740,400,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('2개 1,500원이면',0,-140,{s:36,w:900,c:C.dim});
          text('손님 그대로',-170,-50,{s:34,w:900});text('362만 원',170,-50,{f:'D',s:56,c:C.green});
          text('손님 −14%',-170,50,{s:34,w:900,alpha:P(T,FR('v8',.3),.3)});text('300만 원',170,50,{f:'D',s:56,c:C.gold,alpha:P(T,FR('v8',.3),.3)});
          text('(지금과 같다)',0,130,{s:30,w:900,c:C.dim,alpha:P(T,FR('v8',.35),.3)});});
        if(T>FR('v8',.62))stampBox('묶음 수를 바꾸면 계단이 잘게',960,800,T-FR('v8',.62),{s:50,c:C.gold,bg:'rgba(40,30,0,.9)'});}
      else srcLine('2개 1,500원 노점: 아시아경제 2025.11.7 (서울 노점 2개 1,500~2,000원) · 계산은 예시');});
  }},
  /* ── 붕어빵은 어디로 ── */
  street:{draw(){
    sub('r1','r1',lt=>{stall(600,540,.9,{dim:true,empty:true});text('?',600,380,{f:'D',s:200,c:C.gold,alpha:P(lt,.3,.3)});text('붕어빵 노점,',1340,380,{f:'D',s:80,c:C.gold});text('어디 갔지?',1340,500,{f:'D',s:80});});
    sub('r2','r2',()=>{text('서울의 노점 수 (서울시 집계)',960,165,{f:'D',s:54,c:C.gold});
      text('2020년',600,360,{a:'right',f:'D',s:50,c:C.dim});hbar(640,360,1000,100,6079,6800,'#9aa4b8','6,079곳',{s:52,lc:'#c9ced9'});
      text('2024년',600,520,{a:'right',f:'D',s:50});const q=K('r2',0);if(q<0)text('?',720,520,{f:'D',s:60,c:C.gold});else hbar(640,520,1000,100,4741,6800,C.red,'4,741곳',{s:56,k:E.out(P(q,0,.6))});
      if(T>FR('r2',.6))stampBox('4년 새 −22%',1300,700,T-FR('r2',.6),{s:60,c:C.red,bg:'rgba(40,0,0,.9)'});
      srcLine('서울시 (아시아경제 2025.11.7 인용) · 붕어빵 노점만이 아닌 노점 전체 · 무허가 노점은 정확히 셀 수 없다');});
    sub('r3','r3',()=>{text('2025년 11월 6일 오후, 서울 네 개 구 노점 15곳',960,165,{f:'D',s:48,c:C.gold,max:1800});
      const q=K('r3',0);for(let i=0;i<15;i++){const on=i===2||i===7||i===11;stall(330+(i%5)*315,320+Math.floor(i/5)*165,.22,{dim:!on||q<0,empty:!on,light:on});}
      if(q>=0)stampBox('문 연 곳 3곳',1500,790,q,{s:56,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('아시아경제 2025.11.7 (강북·도봉·성북·중구 일대 기자 현장 확인)',872);});
    sub('r4','r4a',()=>{text('2025년 겨울 르포 · 노부부 노점 5시간',960,165,{f:'D',s:52,c:C.gold});
      [['판매 (붕어빵·호떡 등)','29만 원','#fff',CT('r4')+.4],['남은 돈','9만 416원',C.green,FR('r4',.35)],['두 사람 최저시급 (2025년)','10만 300원',C.gold,FR('r4',.7)]].forEach(([l,v,col,t],i)=>{if(T<t)return;const y=330+i*120;text(l,860,y,{a:'right',f:'D',s:44,c:C.dim,alpha:P(T,t,.3)});text(v,900,y,{a:'left',f:'D',s:64,c:col,alpha:P(T,t,.3)});});
      if(L('r4a')>=0)group(960,760,1,0,P(L('r4a'),0,.3),()=>{panel(-560,-70,1120,140,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.3)'});text('🕙 오전 10시 굽기 시작 → 자정 마감',0,4,{s:42,w:900,max:1080});});
      srcLine('헤럴드경제 2025.11.25 르포 (기자가 직접 일한 날)');});
    sub('r5','r6',()=>{text('붕어빵은 겨울 장사',960,165,{f:'D',s:56,c:C.gold});
      const M=['1','2','3','4','5','6','7','8','9','10','11','12'];M.forEach((m,i)=>{const on=i<3||i>=10;const x=250+i*130;ctx.fillStyle=on?'rgba(111,211,255,.85)':'rgba(255,255,255,.08)';rr(x-55,280,110,130,14);ctx.fill();text(m+'월',x,345,{f:'D',s:38,c:on?'#0b1430':C.dim});});
      text('다섯 달 × 300만 = 1년 몫 1,500만 원',960,520,{f:'D',s:56,alpha:P(T,FR('r5',.6),.3)});
      if(L('r6')>=0){text('÷ 12달',960,620,{s:40,w:900,c:C.dim});big('r6',0,960,730,'두 사람 한 달 125만 원',{f:'D',s:84,c:C.red,glow:'rgba(255,77,77,.4)'});if(T>FR('r6',.6))text('한 사람 62만 5,000원',960,820,{f:'D',s:44,c:'#ffb3b3',alpha:P(T,FR('r6',.6),.3)});}
      else srcLine('예시 가정 · 11월~3월 장사 · 나머지 달 다른 일은 빼고');});
    sub('r7','r7',lt=>{stall(520,540,.8,{dim:true,empty:true});for(let i=0;i<6;i++)person(1080+i*120,560,1.3,'#c9ced9',P(lt,i*.1,.3));
      stampBox('찾는 사람은 많은데 파는 곳이 준다',960,820,lt-1,{s:52,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('붕어빵 값을 정하기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','한 봉지 재료비','반죽 + 앙금 + 봉투','오늘 노점: 520원'],['k3','한 달 고정비','가스 통 수 + 자리값 + 전기','오늘 노점: 70만 원'],['k4','두 사람 시급','한 달 몫 ÷ 둘이 일한 시간','오늘 노점: 6,000원'],
      ['k5','한 계단의 무게','다음 값에서 떠나도 되는 손님','1개 1,000원: 40%'],['k6','장사하는 달 수','겨울 몫 ÷ 12달','다섯 달: 한 달 125만 원']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-760,-280,1520,540,{bg:'rgba(6,13,32,1)',bd:C.gold});text('3개 2,000원 · 하루 80봉지 · 한 달 25일',0,-200,{f:'D',s:42,max:1440});text('재료·봉투 한 봉지 600원 · 한 달 고정비 60만 원 → 한 달 몫은?',0,-140,{f:'D',s:38,max:1440});
      const b=L('k7b');text('1,400원 × 2,000봉지 = 280만 원',0,-50,{f:'D',s:46,c:b>=0?C.gold:'#fff',alpha:b>=0?1:0,max:1440});
      if(b>=0)text('− 고정비 60만 원',0,30,{f:'D',s:42,alpha:P(T,FR('k7b',.45),.3),max:1440});
      const k=K('k7b',0);if(k>=0)text('220만 원',0,140,{f:'D',s:100,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});else text('?',0,140,{f:'D',s:110,c:C.gold});
      if(L('k7c')>=0)text('천 원짜리 몇 장에 몇 마리를 담느냐에서 시작',0,232,{s:34,w:900,alpha:P(L('k7c'),0,.3)});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('붕어빵 한 봉지 2,000원',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      const k=P(L('z2'),0,4.5),X=124,y=380,r=38,gap=88;let acc=0;
      GR.forEach((g,gi)=>{const shown=clamp(k*5-gi);for(let j=0;j<g.n;j++)coin(X+(acc+j)*gap,y,r,{pc:shown>0?g.col:null,ring:shown>0?g.col:null,alpha:1});
        if(shown>0){const mid=X+(acc+(g.n-1)/2)*gap;text(g.name,mid,y+r+44,{s:g.n>1?28:22,w:900,c:g.col,alpha:shown,max:g.n*gap+10});text(g.v.toLocaleString('ko-KR')+'원',mid,y+r+84,{f:'D',s:30,c:'#fff',alpha:shown});}acc+=g.n;});
      if(T>FR('z2',.8))pill('시급 6,000원',1500,620,{s:40,bg:'rgba(255,190,190,.95)',alpha:P(T,FR('z2',.8),.3)});
      const b=L('z2b');if(b>=0)group(960,760,1,0,P(b,0,.3),()=>{ctx.fillStyle='#fff';rr(-660,-90,1320,180,30);ctx.fill();text('팥값 평년보다 +43.6% = 한 봉지 60원',0,-28,{f:'D',s:44,c:'#a52a2a',max:1260});text('값은 한 번에 500원씩, 계단으로',0,42,{f:'D',s:44,c:'#1f6fd1',max:1260});});
    }else{
      stairs(300,640,{num:true,sw:260,sc:.32});pouch(1470,470,1.05);drawMascot(1700,600,.5,'happy');
      stampBox('붕어빵 값 = 천 원짜리 한 장의 계단',960,800,c,{s:60,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1240,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-420,-70,840,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 동네 붕어빵, 몇 마리에 얼마?',0,4,{s:36,w:900,c:C.ink,max:800});});
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
