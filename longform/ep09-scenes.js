/* ════════════════════════════════════════════════════════════════════
   장면 (LF.09 호프집 권리금 계산서) — 수치·출처는 docs/longform-ep09.md
   중심 그림: 손님이 낸 1만 원 = 500cc 맥주잔. 바닥부터 재료비·월세·인건비·기타가 차오르고,
   맨 위 거품(1,467원)이 사장님 몫. 권리금을 못 받으면 그 거품에서 422원이 빨갛게 빠진다(두 번째 월세).
   ════════════════════════════════════════════════════════════════════ */
const LY=[ // 1만 원에서 채우는 순서 (원, 한 달 비용 ÷ 1,500만 × 1만)
  {k:'mat',name:'재료비',v:3333,col:'#E8A33A'},
  {k:'rent',name:'월세',v:1467,col:'#2ec4b6'},
  {k:'labor',name:'인건비',v:3000,col:'#B18CFF'},
  {k:'etc',name:'기타',v:733,col:'#6FD3FF'},
  {k:'foam',name:'사장님 몫',v:1467,col:'#FFF6DE'},
];
const LYK=Object.fromEntries(LY.map(s=>[s.k,s]));
const SEQ=['3','8','0','0','÷','2','2','0','='];   // 3,800만 ÷ 220만 = 17.27 (만 단위로 누름, 0 개수: 3800 = 3·8·0·0, 220 = 2·2·0)
function layT(k){return {mat:KT('s2',0),rent:KT('s3',0),labor:KT('s4',0),etc:KT('s5',0),foam:KT('s6',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function srcLineR(s){srcLine(s,872,1340);}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}

/* 동네 호프집 외관 (상표 없음) */
function hofFront(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#3a2618';rr(-420,-300,840,560,18);ctx.fill();
    ctx.fillStyle='#24170e';rr(-420,-300,840,110,14);ctx.fill();
    ctx.save();ctx.shadowColor='#FFB347';ctx.shadowBlur=34;text('호프',-110,-245,{f:'D',s:84,c:'#ffd27a'});ctx.restore();emoji('🍺',150,-245,80);
    // 따뜻한 유리창
    const g=ctx.createLinearGradient(0,-160,0,220);g.addColorStop(0,'#ffcf7a');g.addColorStop(1,'#d9822b');ctx.fillStyle=g;rr(-390,-160,560,380,10);ctx.fill();
    ctx.fillStyle='rgba(60,30,10,.55)';for(let i=0;i<3;i++){rr(-360+i*180,90,140,24,6);ctx.fill();ctx.fillRect(-300+i*180,114,20,90);}
    for(let i=0;i<5;i++){const px=-350+i*110+(i%2)*20;ctx.fillStyle='rgba(60,30,10,.6)';ctx.beginPath();ctx.arc(px,40,26,0,7);ctx.fill();rr(px-30,66,60,60,14);ctx.fill();}
    ctx.strokeStyle='#5a3b24';ctx.lineWidth=10;line(-110,-160,-110,220);line(-390,30,170,30);
    // 문
    ctx.fillStyle='#5a3b24';rr(200,-160,180,380,10);ctx.fill();ctx.fillStyle='rgba(255,210,140,.55)';rr(214,-144,152,210,6);ctx.fill();
    text('OPEN',290,120,{f:'D',s:34,c:'#35E08A'});
    if(o.money)emoji('💰',330,300,110);
  });
}
/* 500cc 맥주잔. o.full: 다 채움 · o.bite(0~1): 거품 중 422원을 빨갛게 · o.labels: 왼쪽 이름표 */
function beerMug(cx,cy,o={}){
  const HG=600,WG=300,top=cy-HG/2,bot=cy+HG/2,sc=o.s||1;
  group(cx,cy,sc,0,o.alpha??1,()=>{
    const X=-WG/2,Y0=-HG/2,Y1=HG/2;
    // 손잡이
    ctx.strokeStyle='rgba(220,235,255,.75)';ctx.lineWidth=26;ctx.beginPath();ctx.moveTo(WG/2,Y0+130);ctx.bezierCurveTo(WG/2+150,Y0+130,WG/2+150,Y1-150,WG/2,Y1-150);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.06)';rr(X,Y0,WG,HG,26);ctx.fill();
    let acc=0;const labs=[];
    LY.forEach(s=>{const t=o.full?99:T-layT(s.k);if(t<0){return;}const f=E.out(P(t,0,.8)),h=s.v/10000*(HG-24)*f,yb=Y1-12-acc;
      ctx.save();ctx.fillStyle=s.col;rr(X+12,yb-h,WG-24,h,s.k==='mat'?16:3);ctx.fill();
      if(s.k==='foam'&&h>8){ctx.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<9;i++){const bx=X+30+i*30,br=12+rnd(i)*10;ctx.beginPath();ctx.arc(bx,yb-h+4,br,0,7);ctx.fill();}}
      if(s.k==='mat'&&h>40){ctx.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<7;i++){const bx=X+40+rnd(i+3)*(WG-80),by=yb-((T*60+i*53)%Math.max(10,h-10));ctx.beginPath();ctx.arc(bx,by,4,0,7);ctx.fill();}}
      ctx.restore();
      if(o.labels&&f>.3)labs.push({s,ym:yb-(s.v/10000*(HG-24))/2,al:P(t,0,.3)});
      acc+=s.v/10000*(HG-24);});
    for(let i=1;i<labs.length;i++){if(labs[i-1].ym-labs[i].ym<84)labs[i].ym=labs[i-1].ym-84;}
    labs.forEach(({s,ym,al})=>{text(s.name,X-30,ym-18,{a:'right',s:30,w:900,c:s.k==='foam'?'#fff':s.col,alpha:al});text(won(s.v)+'원',X-30,ym+20,{a:'right',f:'D',s:38,c:s.k==='foam'?C.green:'#fff',alpha:al});});
    if(o.bite>0){const hb=422/10000*(HG-24),yt=Y1-12-(HG-24);ctx.save();ctx.globalAlpha*=o.bite;ctx.fillStyle=C.red;rr(X+12,yt,WG-24,hb,3);ctx.fill();ctx.setLineDash([8,6]);ctx.strokeStyle='#fff';ctx.lineWidth=3;rr(X+12,yt,WG-24,hb,3);ctx.stroke();ctx.restore();}
    ctx.strokeStyle='rgba(220,235,255,.85)';ctx.lineWidth=8;rr(X,Y0,WG,HG,26);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.18)';rr(X+26,Y0+30,22,HG-80,10);ctx.fill();
  });
}
/* 1만 원 지폐 (상표·인물 없음) */
function bill10k(x,y,s,rot=0,alpha=1){group(x,y,s,rot,alpha,()=>{ctx.fillStyle='#cfe3c6';rr(-260,-120,520,240,18);ctx.fill();ctx.strokeStyle='#7fa874';ctx.lineWidth=6;rr(-244,-104,488,208,12);ctx.stroke();text('10,000',0,-10,{f:'D',s:90,c:'#3d6b33'});text('원',150,60,{f:'D',s:44,c:'#3d6b33'});ctx.fillStyle='rgba(61,107,51,.25)';ctx.beginPath();ctx.arc(-160,40,46,0,7);ctx.fill();});}
/* 사람 줄 (넘겨받을 사람) */
function people(x0,y,n,lit,o={}){for(let i=0;i<n;i++){const on=i<lit;emoji('🧑',x0+i*(o.dx||110),y,o.sz||80,{alpha:on?1:.18});}}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o2')){
      hofFront(540,500,.9*E.back(P(a,0,.4))+.001,{money:1});
      group(1420,330,1,-.03,1,()=>{panel(-360,-140,720,280,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('들어갈 때 낸 권리금',0,-70,{s:42,w:900,c:C.dim});text('3,800만 원',0,30,{f:'D',s:120,c:C.gold});});
      text('≈ 음식점 평균 권리금',1420,560,{s:40,w:900,alpha:P(T,FR('o1',.5),.3)});text('(한국부동산원 2024년 4분기 · 숙박음식점업 3,818만)',1420,620,{s:28,w:800,c:C.dim,alpha:P(T,FR('o1',.5),.3)});
    }else if(T<CT('o3')){
      const b=L('o2'),b2=L('o2b');
      text('예시 호프집이 한 달 남기는 돈',760,240,{f:'D',s:64,c:C.dim,alpha:P(b,0,.3)});
      big('o2',0,760,430,'+220만 원',{f:'D',s:190,c:C.green,glow:'rgba(53,224,138,.45)'});
      if(T>FR('o2',.6)&&b2<0)pill('권리금 3,800만 ÷ 220만 ≈ 17개월',760,640,{s:44,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('o2',.6),.3)});
      if(b2>=0){drawMascot(1560,560,.9,'smug',{alpha:P(b2,0,.3)});group(1420,250,E.back(P(b2,.1,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-380,-80,760,160,30);ctx.fill();ctx.beginPath();ctx.moveTo(60,80);ctx.lineTo(100,140);ctx.lineTo(140,80);ctx.fill();text('나갈 때 받으면 되니까,',0,-24,{s:36,w:900,c:C.ink});text('비용은 아니겠지?',0,32,{f:'D',s:48,c:C.ink});});
        pill('권리금 3,800만 ÷ 220만 ≈ 17개월',760,640,{s:44,bg:'rgba(255,255,255,.92)'});}
    }else if(T<CT('o5')){
      const b=L('o3'),k=K('o4',0);
      text('5년 장사하고 나갈 때 권리금을',960,200,{f:'D',s:60,c:C.dim,alpha:P(b,0,.3)});
      const rows=[['다 받으면',220,C.green,'220만',CT('o3')+.3],['0원이면',157,C.red,'157만',KT('o4',0)]];
      rows.forEach(([l,v,col,lab,t],i)=>{const y=380+i*200;if(T<t-.4)return;text(l,520,y,{a:'right',f:'D',s:64,alpha:P(T,t-.4,.3)});if(T<t){text('?',640,y,{f:'D',s:80,c:C.gold});return;}hbar(560,y,1000,120,v,240,col,lab+' 원',{s:80,k:E.out(P(T,t,.6))});});
      if(k>=0)text('한 달 남는 돈 (예시 가게)',960,780,{s:36,w:900,c:C.dim,alpha:P(k,.5,.3)});
    }else if(T<CT('o6')){
      const b=L('o5');
      text('장부에는 안 보이는',760,280,{f:'D',s:80,c:C.dim,alpha:P(b,0,.3)});text('두 번째 월세',760,430,{f:'D',s:150,c:C.gold,alpha:P(b,.2,.3),glow:'rgba(255,197,49,.4)'});
      if(T>FR('o5',.5))pill('장사가 안될수록 더 비싸진다',760,620,{s:48,bg:C.red,c:'#fff',alpha:P(T,FR('o5',.5),.3)});
      drawMascot(1580,520,1.0,'worry',{alpha:P(b,0,.3)});
    }else{
      const k9=L('o6'),k10=L('o7');
      text('권리금 내기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:80,c:C.gold,alpha:P(k9,0,.3)});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['한국부동산원 조사','국세통계','언론 보도'].forEach((s,i)=>{const k=P(k10,.5+i*.4,.3);if(k>0)pill(s,480+i*480,760,{s:36,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('호프집 권리금 계산서',960,280,{f:'D',s:150,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1700});
    text('들어갈 때 낸 돈, 나올 때 얼마나 돌아올까',960,430,{s:56,w:900,alpha:P(a,.3,.3)});
    hofFront(700,750,.55,{alpha:P(a,.2,.3),money:1});drawMascot(1300,720,.85,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p2',()=>{hofFront(560,500,.85);
      if(L('p2')>=0){text('동네 호프집 테이블',1380,320,{f:'D',s:56,c:C.gold});big('p2',0,1380,480,'12개',{f:'D',s:150});
        text('저녁 5시 ~ 새벽 1시 · 예시 가정',1380,640,{s:38,w:900,c:C.dim,alpha:P(L('p2'),1,.3)});}});
    sub('p3','p3',()=>{text('하루 평균 매출 (예시)',960,200,{f:'D',s:60,c:C.gold});
      big('p3',0,960,370,'50만 원',{f:'D',s:150,c:'#fff'});
      const k=P(T,FR('p3',.45),.4);if(k>0){for(let i=0;i<12;i++)emoji('🍺',420+i*90,580,70,{alpha:clamp(k*12-i)});text('생맥주 500cc 하루 약 60잔',960,680,{s:40,w:900,alpha:k});
        text('+ 나머지는 안주',960,740,{s:36,w:900,c:C.dim,alpha:P(T,FR('p3',.8),.3)});}});
    sub('p4','p4',()=>{text('한 달 매출 (예시)',960,200,{f:'D',s:60,c:C.gold});text('50만 원 × 30일',960,330,{f:'D',s:70});
      big('p4',0,960,500,'= 1,500만 원',{f:'D',s:140,c:C.gold,glow:'rgba(255,197,49,.4)'});pill('세금 제외',960,700,{s:36,alpha:P(L('p4'),1.4,.3),bg:'rgba(255,255,255,.92)'});});
    sub('p5','p5',()=>{hofFront(520,480,.7);
      const q=K('p5',0);group(1380,330,1,0,P(L('p5'),0,.3),()=>{text('들어올 때 앞 사장님께',0,-40,{s:44,w:900,c:C.dim});});
      if(q>=0){group(1380,480,lerp(1.5,1,E.out(P(q,0,.3))),-.03,P(q,0,.15),()=>{panel(-330,-100,660,200,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('권리금 3,800만 원',0,6,{f:'D',s:80,c:C.gold});});
        emoji('💰',1380,690,110,{alpha:P(q,.4,.3)});}else text('?',1380,480,{f:'D',s:120,c:C.gold});});
    sub('p6','p6',lt=>{const k=E.out(P(lt,0,.5));bill10k(560,470,lerp(1.1,.9,k),-.04,1-P(lt,1.4,.4));
      if(lt>1.4)beerMug(560,470,{full:1,s:.75*E.out(P(lt,1.4,.6))+.001});
      text('손님이 낸 1만 원',1360,380,{f:'D',s:80,c:C.gold,alpha:P(lt,.6,.4)});text('= 500cc 맥주잔 한 잔',1360,500,{f:'D',s:70,alpha:P(lt,1.4,.4)});text('바닥부터 비용을 채워 보면?',1360,620,{s:40,w:900,c:C.dim,alpha:P(lt,2.2,.4)});});
  }},
  /* ── 1만 원 맥주잔 쪼개기 ── */
  glass:{draw(){
    beerMug(560,470,{labels:1});
    const PX=1000,CX=PX+420;
    sub('s1','s2',()=>{text('🍗 첫 번째: 재료비',PX,210,{a:'left',f:'D',s:56,c:LYK.mat.col});
      if(L('s2')>=0){text('맥주 · 안주 재료 한 달 500만 (예시)',CX,350,{s:40,w:900,max:820});text('500만 ÷ 1,500만 × 1만 원',CX,430,{s:36,w:900,c:C.dim});popText(KT('s2',0),CX,580,'3,333원',{f:'D',s:120,c:LYK.mat.col});}});
    sub('s3','s3',()=>{text('🏠 두 번째: 월세',PX,210,{a:'left',f:'D',s:56,c:LYK.rent.col});text('한 달 220만 (예시)',CX,360,{s:42,w:900});text('220만 ÷ 1,500만 × 1만 원',CX,440,{s:36,w:900,c:C.dim});popText(KT('s3',0),CX,590,'1,467원',{f:'D',s:120,c:LYK.rent.col});});
    sub('s4','s4',()=>{text('🧑‍🍳 세 번째: 인건비',PX,210,{a:'left',f:'D',s:56,c:LYK.labor.col});text('알바 2명 × 6시간 × 30일 × 10,320원',CX,320,{s:36,w:900,max:840});text('+ 주휴수당 → 한 달 약 450만',CX,390,{s:34,w:900,c:C.dim,max:820});popText(KT('s4',0),CX,560,'3,000원',{f:'D',s:120,c:LYK.labor.col});
      srcLineR('2026년 최저시급 10,320원 (최저임금위원회 고시)');});
    sub('s5','s5',()=>{text('🧾 네 번째: 기타',PX,210,{a:'left',f:'D',s:56,c:LYK.etc.col});text('전기 · 가스 · 카드 수수료 110만 (예시)',CX,360,{s:38,w:900,max:820});popText(KT('s5',0),CX,540,'733원',{f:'D',s:120,c:LYK.etc.col});});
    sub('s6','s6',()=>{text('남은 윗부분 = 거품',CX,230,{f:'D',s:60,c:C.dim});text('3,333 + 1,467 + 3,000 + 733 = 8,533원',CX,330,{f:'D',s:44,max:840});text('사장님 몫',CX,450,{f:'D',s:56,c:C.green});big('s6',0,CX,580,'1,467원',{f:'D',s:150,c:C.green,glow:'rgba(53,224,138,.45)'});});
    sub('s7','s7',()=>{text('한 달로 바꾸면',CX,230,{f:'D',s:60,c:C.dim});big('s7',0,CX,400,'220만 원',{f:'D',s:160,c:C.green,glow:'rgba(53,224,138,.45)'});
      text('1,500만 − (500 + 220 + 450 + 110)',CX,540,{s:38,w:900,c:C.dim});pill('사장님이 매일 8시간 직접 서서',CX,650,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('s7',.6),.3)});});
    sub('s8','s8',()=>{group(CX,470,1,0,1,()=>{panel(-400,-260,800,520,{bg:'#f4ecd8',r:18});text('한 달 장부',0,-200,{f:'D',s:52,c:C.ink});
        [['재료비','500만'],['월세','220만'],['인건비','450만'],['기타','110만']].forEach(([l,v],i)=>{text(l,-300,-110+i*66,{a:'left',s:38,w:900,c:'#3a3a3a'});text(v,300,-110+i*66,{a:'right',f:'D',s:44,c:'#3a3a3a'});});
        ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-320,150,640,3);const k=P(L('s8'),1,.3);text('권리금',-300,200,{a:'left',s:38,w:900,c:C.red,alpha:k});text('??',300,200,{a:'right',f:'D',s:48,c:C.red,alpha:k});});
      pill('한 번 낸 돈이라 매달 적히지 않는다',CX,800,{s:36,bg:C.gold,c:C.ink,alpha:P(T,FR('s8',.4),.3)});});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('÷'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s.replace('=','')).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} ÷ ${fmt(n2)} =`;bigS='17.2727';}else if(n2!==undefined){small=`${fmt(n1)} ÷`;bigS=n2?fmt(n2):fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:done?96:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('권리금 3,800만 원',1350,260,{f:'D',s:60,c:C.gold,alpha:P(a,.2,.3)});text('÷ 한 달 남는 돈 220만 원',1350,360,{s:44,w:900,alpha:P(a,.4,.3)});
    if(dt>=0){const q=K('c2',0);
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{group(1350,520,lerp(1.6,1,E.out(P(Math.max(0,q),0,.3))),0,1,()=>text(q>=0?'= 17.27개월':'= ?',0,0,{f:'D',s:110,c:C.red,glow:'rgba(255,77,77,.45)',max:1000}));
        if(q>=0)text('처음 17개월은 들어올 때 낸 돈을 버는 장사',1350,640,{s:38,w:900,alpha:P(q,.8,.3),max:980});}
      const c3=L('c3');if(c3>=0){group(1350,780,1,0,P(c3,0,.3),()=>{panel(-470,-80,940,160,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:5});text('나갈 때 받으면 돌아온다',0,-30,{s:36,w:900});text('문제는 그게 얼마냐',0,32,{f:'D',s:50,c:C.gold});});}}
    if(dt>=0)group(1180,160,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 권리금이라는 돈 ── */
  km:{draw(){
    sub('k1','k1',()=>{hofFront(560,480,.7);text('권리금 = ?',1380,470,{f:'D',s:120,c:C.gold});});
    sub('k2','k2',()=>{const k=L('k2');
      group(540,460,1,0,P(k,0,.3),()=>{panel(-380,-260,760,520,{bd:C.gold,bg:'rgba(255,197,49,.08)',lw:6});text('권리금',0,-190,{f:'D',s:72,c:C.gold});emoji('🤝',0,-70,110);text('→ 앞 사장님',0,40,{f:'D',s:52});text('자리 · 손님 · 시설 값',0,110,{s:34,w:900,c:C.dim});
        if(T>FR('k2',.55)){text('✗ 돌려받지 못함',0,190,{f:'D',s:50,c:C.red,alpha:P(T,FR('k2',.55),.3)});}});
      group(1380,460,1,0,P(T,FR('k2',.45),.3),()=>{panel(-380,-260,760,520,{bd:'rgba(255,255,255,.4)',lw:5});text('보증금',0,-190,{f:'D',s:72});emoji('🏢',0,-70,110);text('→ 건물주에게 맡김',0,40,{f:'D',s:52});
        checkMark(-170,190,56,C.green,P(T,FR('k2',.7),.4));text('끝나면 돌려받음',40,190,{f:'D',s:46,c:C.green,alpha:P(T,FR('k2',.7),.3)});});});
    sub('k3','k3',()=>{text('권리금이 있는 상가 (전국)',960,190,{f:'D',s:60,c:C.gold});
      const q=K('k3',0),lit=q>=0?Math.round(56*E.out(P(q,0,1))):0;
      for(let i=0;i<100;i++){const x=300+(i%10)*62,y=270+Math.floor(i/10)*56;ctx.fillStyle=i<lit?C.gold:'rgba(255,255,255,.1)';rr(x,y,50,44,8);ctx.fill();}
      text(q>=0?'56.47%':'?',1420,460,{f:'D',s:160,c:q>=0?C.gold:C.gold});text('100곳 중 약 56곳',1420,600,{s:40,w:900,c:C.dim,alpha:q>=0?1:0});
      srcLine('한국부동산원 상업용부동산 임대동향조사 2024년 4분기 (대전일보 2025.2.2 인용)');});
    sub('k4','k4',()=>{text('업종별 평균 권리금 (2024년 4분기)',960,180,{f:'D',s:56,c:C.gold});
      const R=[['숙박음식점업',3818,C.orange],['여가관련서비스업',3641,'#4fb6ff'],['도소매업',3568,'#4fb6ff'],['부동산업',2591,'#4fb6ff']];
      const X0=620,SC=.26;R.forEach(([l,v,col],i)=>{const y=300+i*110,k=E.out(P(L('k4'),.2+i*.25,.6));text(l,X0-30,y,{a:'right',s:40,w:900,c:i?'#fff':C.orange});vCash(X0,y-36,v*SC*k,72,col);text(won(v)+'만',X0+v*SC*k+16,y+2,{a:'left',f:'D',s:48,c:i?'#fff':C.orange,alpha:k});});
      const q=K('k4',0);if(q>=0){const x=X0+3443*SC;ctx.save();ctx.setLineDash([12,8]);ctx.strokeStyle=C.gold;ctx.lineWidth=4;line(x,250,x,720);ctx.restore();popText(KT('k4',0),x,770,'전국 평균 3,443만',{f:'D',s:46,c:C.gold});}
      srcLine('한국부동산원 2024년 4분기 (대전일보 2025.2.2 인용) · 전국 평균은 전년보다 하락');});
    sub('k4b','k5',()=>{const k=L('k4b');text('권리금 금액 분포 (전국)',560,190,{f:'D',s:52,c:C.gold});
      const cx=560,cy=480,r=200,f=E.out(P(k,.2,.8));ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.fillStyle='#4fb6ff';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*.665*f);ctx.closePath();ctx.fill();
      text('66.5%',cx,cy-10,{f:'D',s:80,st:10});text('3,000만 원 이하',cx,cy+60,{s:30,w:900,st:6});
      text('대전 권리금 있는 상가',1380,300,{s:40,w:900,alpha:P(T,FR('k4b',.5),.3)});text('71.43%',1380,400,{f:'D',s:100,c:C.gold,alpha:P(T,FR('k4b',.5),.3)});text('(전국 최고 · 충북 18.37% 최저)',1380,480,{s:30,w:900,c:C.dim,alpha:P(T,FR('k4b',.5),.3)});
      const k5=L('k5');if(k5>=0)group(1380,660,1,0,P(k5,0,.3),()=>{panel(-420,-80,840,160,{bg:'rgba(6,13,32,1)',bd:C.orange,lw:5});text('오늘 예시 가게 3,800만',0,-26,{f:'D',s:48,c:C.orange});text('= 음식점 평균 3,818만에 맞춤',0,36,{s:34,w:900});});
      srcLine('한국부동산원 2024년 4분기 (대전일보 2025.2.2 인용)');});
    sub('k6','k6',()=>{emoji('⚖️',480,440,240);
      group(1300,360,1,0,1,()=>{panel(-500,-150,1000,300,{bd:'rgba(255,255,255,.4)'});text('상가건물 임대차보호법',0,-90,{s:36,w:900,c:C.dim});text('계약 끝나기 6개월 전부터',0,-20,{f:'D',s:56});text('건물주는 권리금 거래를 방해 못 함',0,60,{s:38,w:900});});
      stampBox('지켜 주는 건 받을 기회 · 금액 아님',1220,700,T-FR('k6',.6),{s:50,c:C.gold,bg:'rgba(40,30,0,.88)'});
      srcLine('상가건물 임대차보호법 제10조의4 (권리금 회수기회 보호)');});
  }},
  /* ── 나올 때 받는 권리금 (반전) ── */
  exit:{draw(){
    sub('x1','x1',()=>{emoji('🚪',560,470,260);text('5년 뒤 나갈 때',1300,380,{f:'D',s:80,c:C.dim});text('권리금은 얼마나?',1300,520,{f:'D',s:100,c:C.gold});});
    sub('x2','x2',()=>{text('5년 동안 남긴 돈 (예시 가게)',960,200,{f:'D',s:60,c:C.gold});text('220만 원 × 60개월',960,340,{f:'D',s:70});
      big('x2',0,960,520,'1억 3,200만 원',{f:'D',s:150,c:C.green,glow:'rgba(53,224,138,.4)'});});
    sub('x3','x5',()=>{text('나갈 때 받는 권리금에 따라 · 한 달 남는 돈',960,180,{f:'D',s:52,c:C.gold});
      const R=[['3,800만 다 받음',220,C.green,'220만','x3',null],['1,900만 (절반)',188,C.orange,'188만','x4',0],['0원',157,C.red,'157만','x5',0]];
      R.forEach(([l,v,col,lab,id,j],i)=>{const y=330+i*170;if(L(id)<0)return;text(l,640,y,{a:'right',f:'D',s:52,alpha:P(L(id),0,.3)});const t=j===null?CT(id)+.4:KT(id,0);if(T<t){text('?',740,y,{f:'D',s:70,c:C.gold});return;}hbar(680,y,1000,110,v,230,col,lab,{s:70,k:E.out(P(T,t,.6))});});
      if(L('x4')>=0)text('못 받은 돈 ÷ 60개월이 매달 빠진다',960,820,{s:34,w:900,c:C.dim});});
    sub('x6','x6',()=>{beerMug(560,470,{full:1,labels:1,bite:P(K('x6',0),0,.5)});
      text('3,800만 ÷ 60개월',1380,240,{f:'D',s:60,c:C.dim});text('= 한 달 63만 원',1380,340,{f:'D',s:84,c:C.red});text('두 번째 월세',1380,450,{f:'D',s:90,c:C.gold,glow:'rgba(255,197,49,.4)'});
      const q=K('x6',0);if(q>=0){text('거품 1,467원 중',1380,590,{s:40,w:900,alpha:P(q,0,.3)});popText(KT('x6',0),1380,690,'−422원',{f:'D',s:110,c:C.red});}});
    sub('x7','x7',()=>{text('다음 사람은 이걸 보고 권리금을 낸다',960,190,{f:'D',s:60,c:C.gold});
      const sw=Math.sin(T*1.2)*.08*P(L('x7'),1,.5);
      group(960,520,1,0,1,()=>{ctx.fillStyle='#8e98ad';ctx.fillRect(-12,-60,24,300);ctx.save();ctx.rotate(sw);ctx.fillRect(-460,-70,920,16);
        group(-380,-70,1,-sw,1,()=>{panel(-170,-170,340,170,{bd:C.green,bg:'rgba(53,224,138,.1)'});text('남는 돈',0,-110,{s:34,w:900});text('220만',0,-50,{f:'D',s:56,c:C.green});});
        group(380,-70,1,-sw,1,()=>{panel(-170,-170,340,170,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text('받을 권리금',0,-110,{s:34,w:900});text('3,800만',0,-50,{f:'D',s:56,c:C.gold});});ctx.restore();});
      pill('잘되면 받기 쉽고 · 안되면 깎인다',960,800,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('x7',.55),.3)});});
    sub('x8','x8',()=>{text('매출이 줄 때',960,200,{f:'D',s:70,c:C.dim});
      group(560,470,1,0,P(L('x8'),.3,.3),()=>{panel(-320,-150,640,300,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:5});text('남는 돈 ↓',0,-30,{f:'D',s:70,c:C.red});text('매달',0,60,{s:40,w:900,c:'#ffb3b3'});});
      group(1360,470,1,0,P(L('x8'),1,.3),()=>{panel(-320,-150,640,300,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:5});text('권리금 ↓',0,-30,{f:'D',s:70,c:C.red});text('나갈 때',0,60,{s:40,w:900,c:'#ffb3b3'});});
      stampBox('한꺼번에 온다',960,740,T-FR('x8',.6),{s:80,c:C.red,bg:'rgba(40,0,0,.85)'});});
    sub('x9','x9',()=>{text('예: 장사가 기울면 (예시)',960,190,{f:'D',s:56,c:C.gold});
      const k=E.io(P(L('x9'),.8,1.2));text('남는 돈',520,330,{s:42,w:900,c:C.dim});text(won(lerp(220,120,k))+'만',520,450,{f:'D',s:110,c:k>.5?C.red:C.green});
      text('받을 권리금',1400,330,{s:42,w:900,c:C.dim});const k2=E.io(P(T,FR('x9',.35),1.2));text(won(lerp(3800,1900,k2))+'만',1400,450,{f:'D',s:110,c:k2>.5?C.red:C.gold});
      if(k2>.5)text('"반만 내겠습니다"',1400,570,{s:40,w:900,c:'#ffb3b3',alpha:P(k2,.5,.2)});
      pill('거절하기 어렵다 · 버틸수록 손해',960,720,{s:44,bg:C.red,c:'#fff',alpha:P(T,FR('x9',.7),.3)});});
  }},
  /* ── 줄어드는 호프집 ── */
  shrink:{draw(){
    sub('d1','d1',()=>{hofFront(620,500,.8);text('얼마나 남았을까?',1420,480,{f:'D',s:90,c:C.gold});});
    sub('d2','d4',()=>{text('전국 호프주점 사업자 (국세통계)',960,170,{f:'D',s:56,c:C.gold});
      const base=760,sc=.016,bw=240;const D=[['2025.8',21401,KT('d2',0)],['2026.5',19863,CT('d4')+.3],['2026.8',19507,KT('d3',0)]];
      D.sort((a,b)=>a[0]<b[0]?-1:1).forEach(([l,v,t],i)=>{const x=340+i*400;ctx.fillStyle='rgba(255,255,255,.07)';rr(x-bw/2,base-21401*sc,bw,21401*sc,14);ctx.fill();if(T<t){text('?',x,base-200,{f:'D',s:70,c:C.gold});}else{const k=E.out(P(T,t,.6));vCash(x-bw/2,base-v*sc*k,bw,v*sc*k,i===2?C.red:'#4fb6ff');text(won(v)+'명',x,base-v*sc-40,{f:'D',s:52,c:i===2?C.red:'#fff',alpha:k});}text(l,x,base+40,{s:34,w:900});});
      if(T>=CT('d4')){
        text('2020.11 3만 명 아래 → 2026.5 2만 명 아래',960,250,{s:34,w:900,c:'#ffb3b3',alpha:P(T,FR('d4',.5),.3)});}
      const q=K('d3',0);if(q>=0){stampBox('1년 새 −8.9%',1600,400,q-.6,{s:54,c:C.red,bg:'rgba(40,0,0,.85)'});text('−1,894명',1600,520,{f:'D',s:60,c:C.red,alpha:P(q,.8,.3)});}
      srcLine('국세청 국세통계 (뉴스1 · 파이낸셜뉴스 2026.10.8 인용) · 사업자 수 기준');});
    sub('d5','d5',()=>{text('간이주점 사업자',960,200,{f:'D',s:60,c:C.gold});
      text('2025.8',560,380,{a:'right',s:44,w:900});hbar(600,380,1000,90,8492,9000,'#4fb6ff','8,492명',{s:56,k:E.out(P(L('d5'),.3,.6))});
      const q=K('d5',0);text('2026.8',560,540,{a:'right',s:44,w:900});hbar(600,540,1000,90,7775,9000,C.red,q>=0?'7,775명 (−8.5%)':'?',{s:56,k:q>=0?E.out(P(q,0,.6)):0,lc:q>=0?C.red:C.gold});
      srcLine('국세청 국세통계 (뉴스1 · 파이낸셜뉴스 2026.10.8 인용)');});
    sub('d6','d6',()=>{emoji('🍺',560,460,240);text('지난해 주류 출고량',1360,300,{f:'D',s:60,c:C.dim});text('−5.2%',1360,440,{f:'D',s:150,c:C.red,glow:'rgba(255,77,77,.4)',alpha:P(T,FR('d6',.3),.3)});text('2018년 집계 이후 가장 적다',1360,580,{s:42,w:900,alpha:P(T,FR('d6',.6),.3)});
      srcLine('주류 출고량 2,987,726kL (뉴스1 · 파이낸셜뉴스 2026.10.8 인용)');});
    sub('d7','d7',()=>{text('가게를 넘겨받을 사람',960,200,{f:'D',s:60,c:C.gold});const k=P(L('d7'),.6,2);people(450,400,10,Math.round(10-3*k),{dx:110,sz:86});
      pill('권리금을 제값에 받기 어려워진다',960,580,{s:44,bg:'rgba(255,255,255,.92)',alpha:P(L('d7'),1.5,.3)});
      text('전국 평균 권리금도 전년보다 하락 (한국부동산원 2024년 4분기)',960,720,{s:36,w:900,c:'#ffb3b3',alpha:P(T,FR('d7',.6),.3)});});
  }},
  /* ── 생맥주 세금 ── */
  tax:{draw(){
    sub('t1','t1',()=>{emoji('🍺',620,470,260);text('내년부터 바뀌는 숫자',1320,400,{f:'D',s:70,c:C.dim});text('생맥주 세금',1320,520,{f:'D',s:110,c:C.gold});});
    sub('t2','t2',()=>{group(960,420,1,0,1,()=>{panel(-640,-160,1280,320,{bd:C.gold,bg:'rgba(255,197,49,.08)',lw:5});text('생맥주 주세 20% 깎아 주던 제도',0,-60,{f:'D',s:64});text('→ 올해 말 끝날 예정 (보도)',0,50,{f:'D',s:60,c:C.red,alpha:P(L('t2'),1.5,.3)});});
      srcLine('뉴스1 · 파이낸셜뉴스 2026.10.8');});
    sub('t3','t3',()=>{text('맥주 주세 (1킬로리터당)',960,190,{f:'D',s:60,c:C.gold});
      text('생맥주 지금',560,360,{a:'right',s:42,w:900});hbar(600,360,1000,90,708560,900000,'#4fb6ff','70만 8,560원',{s:52,k:E.out(P(L('t3'),.3,.6))});
      const q=K('t3',0);text('내년 (일반 맥주와 같게)',560,520,{a:'right',s:42,w:900,max:500});hbar(600,520,1000,90,885700,900000,C.red,q>=0?'':'?',{s:52,k:q>=0?E.out(P(q,0,.6)):0,lc:C.gold});
      if(q>=0)text('88만 5,700원',1580,600,{a:'right',f:'D',s:52,c:C.red,alpha:P(q,.4,.3)});
      srcLine('뉴스1 · 파이낸셜뉴스 2026.10.8');});
    sub('t4','t4',()=>{text('500cc 한 잔에 더 붙는 세금 (계산)',960,180,{f:'D',s:56,c:C.gold});
      const R=[['주세 (17만 7,140원 ÷ 2,000잔)',89,C.red,.15],['교육세 (주세의 30%)',27,C.orange,.4],['부가가치세 (10%)',12,'#FFE066',.55]];
      R.forEach(([l,v,col,f],i)=>{const y=300+i*100,k=P(T,FR('t4',f),.3);text(l,1000,y,{a:'right',s:36,w:900,alpha:k,max:720});text(v+'원',1060,y,{a:'left',f:'D',s:56,c:col,alpha:k});});
      ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(560,560,800,4);text('합계',1000,640,{a:'right',s:44,w:900});const q=K('t4',0);if(q>=0)popText(KT('t4',0),1060,640,'약 127원',{a:'left',f:'D',s:90,c:C.red});else text('?',1110,640,{f:'D',s:90,c:C.gold});
      if(T>FR('t4',.8))pill('기사: 한 잔에 130원쯤',960,770,{s:38,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('t4',.8),.3)});});
    sub('t5','t5',()=>{text('예시 가게 · 한 달',960,180,{f:'D',s:60,c:C.gold});
      for(let i=0;i<30;i++)emoji('🍺',330+(i%15)*90,320+Math.floor(i/15)*90,60,{alpha:P(L('t5'),i*.03,.2)});
      text('60잔 × 30일 = 1,800잔 × 127원',960,530,{f:'D',s:56});big('t5',0,960,660,'≈ 한 달 23만 원',{f:'D',s:100,c:C.red,glow:'rgba(255,77,77,.4)'});
      pill('잔값을 못 올리면 그대로 사장님 몫에서',960,790,{s:36,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('t5',.7),.3)});});
    sub('t6','t6',()=>{emoji('📢',560,460,220);group(1300,460,1,0,1,()=>{panel(-500,-160,1000,320,{bd:C.gold,bg:'rgba(255,197,49,.08)',lw:5});text('소상공인연합회',0,-90,{s:40,w:900,c:C.dim});text('"영세 음식점·주점이',0,-10,{f:'D',s:54});text('비용을 직접 흡수할 가능성"',0,70,{f:'D',s:54});});
      srcLine('뉴스1 · 파이낸셜뉴스 2026.10.8');});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('하나씩만 바꿔 보면 (권리금 0원 회수 · 지금 한 달 157만)',960,170,{f:'D',s:50,c:C.gold,alpha:P(a,0,.3),max:1800});if(T<CT('l2'))text('사장님이 정할 수 있는 숫자는?',960,500,{f:'D',s:96,alpha:P(a,.2,.3)});
    const rows=[['10년 장사','약 188만',188,C.green,'l2'],['2년 만에 나옴','약 62만',62,C.red,'l3'],['매출 −10%','약 57만',57,C.red,'l4'],['생맥주 세금 떠안음','약 134만',134,C.red,'l5'],['권리금 3,000만에 합의','약 170만',170,C.green,'l5b']];
    const Z=720,SCL=4;ctx.fillStyle='rgba(255,255,255,.35)';if(T>=CT('l2'))ctx.fillRect(Z-2,240,4,560);
    rows.forEach(([l,lab,v,col,id],i)=>{const t=CT(id);if(T<t-.1)return;const y=300+i*112,k=E.out(P(T,KT(id,0),.6));text(l,Z-30,y,{a:'right',s:38,w:900,max:620});
      if(T<KT(id,0)){text('?',Z+60,y,{f:'D',s:56,c:C.gold});return;}
      const w=Math.max(6,v*SCL*k);ctx.fillStyle=col;rr(Z,y-30,w,60,14);ctx.fill();text(lab,Z+w+20,y+2,{a:'left',f:'D',s:46,c:col,alpha:k});});
    if(T>=CT('l2')){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=C.gold;ctx.lineWidth=3;line(Z+157*SCL,240,Z+157*SCL,820);ctx.restore();text('지금 157만',Z+157*SCL,226,{s:28,w:900,c:C.gold});}
    sub('l6','l6',()=>pill('가장 크게 정할 수 있는 건, 들어올 때 내는 권리금',960,844,{s:36,bg:'rgba(255,255,255,.95)'}));
    if(L('l6')<0&&T>=CT('l2'))srcLine('예시 계산 · 한 번에 하나씩만 바꿈 · 매출이 줄면 재료비도 같은 비율로 준다고 가정',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('y1'),ov=L('y7');
    text('권리금 내기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:64,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['y2','몇 달 치인가','권리금 ÷ 지금 한 달 남는 돈','오늘 가게: 17.27개월'],['y3','두 번째 월세','못 받는다고 보고 ÷ 장사할 개월 수','3,800만 ÷ 60 = 63만'],['y4','무엇에 내는 돈인가','시설값 · 단골과 매출값 · 자리값','나눠서 물어보기'],
      ['y5','남은 계약 기간','다음 사람 데려올 시간 · 재계약 조건','6개월 전부터 보호'],['y6','동네 가게 수','같은 업종이 느나 주나','호프주점 1년 −8.9%']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:40,max:440});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-700,-240,1400,460,{bg:'rgba(6,13,32,1)',bd:C.gold});text('권리금 5,000만 · 한 달 250만 · 3년 · 0원 회수',0,-160,{f:'D',s:50,max:1300});
      text('250만 − 5,000만 ÷ 36개월',0,-70,{f:'D',s:60,c:L('y7b')>=0?C.gold:'#fff'});const k=K('y7b',0);
      if(k>=0){text('= 한 달 111만 원',0,50,{f:'D',s:100,c:C.red,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});text('두 번째 월세 139만 = 남는 돈의 절반 가까이',0,150,{s:36,w:900,alpha:P(k,1,.3)});}else text('?',0,60,{f:'D',s:120,c:C.gold});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('손님이 낸 1만 원',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      const X=160,Wd=1600,y=380,h=150,s=Wd/10000,k=E.out(P(L('z2'),0,4));let xx=X;
      LY.forEach((o,i)=>{const w=o.v*s,kk=clamp(k*LY.length-i);if(kk<=0){xx+=w;return;}ctx.fillStyle=o.col;rr(xx,y-h/2,Math.max(2,w*kk-3),h,10);ctx.fill();if(kk>.5){text(won(o.v),xx+w/2,y+2,{f:'D',s:46,c:'#101420',max:w-10});text(o.name,xx+w/2,y+110,{s:w>150?30:24,w:900,c:o.k==='foam'?C.green:'rgba(255,255,255,.85)',max:w-8});}xx+=w;});
      const b=L('z2b');if(b>=0){const fx=X+8533*s,bw=422*s;ctx.save();ctx.globalAlpha*=P(b,0,.4);ctx.fillStyle=LYK.foam.col;rr(fx,y-h/2,1467*s-3,h,6);ctx.fill();ctx.fillStyle=C.red;rr(X+Wd-bw-3,y-h/2,bw,h,6);ctx.fill();ctx.restore();text('1,045',fx+(1467*s-bw)/2,y+2,{f:'D',s:40,c:'#101420',alpha:P(b,0,.4)});text('−422 두 번째 월세',X+Wd,y-120,{a:'right',f:'D',s:40,c:C.red,alpha:P(b,0,.4)});if(0)text('',0,0,{f:'D',s:40,c:C.red,alpha:P(b,0,.4)});
        group(960,720,1,0,P(b,.3,.3),()=>{ctx.fillStyle='#fff';rr(-560,-80,1120,160,30);ctx.fill();text('5년 뒤 권리금 0원이면',0,-22,{s:38,w:900,c:C.ink});text('한 달 220만 → 157만 원',0,38,{f:'D',s:54,c:'#d62f2f'});});}
    }else{
      drawMascot(960,400,1.0,'think');
      stampBox('매달 나눠 내는 두 번째 월세',960,740,c,{s:64,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1480,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-330,-70,660,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 권리금, 나올 때 받으셨나요?',0,4,{s:34,w:900,c:C.ink,max:620});});
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
