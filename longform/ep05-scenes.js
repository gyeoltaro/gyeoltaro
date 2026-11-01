/* ════════════════════════════════════════════════════════════════════
   장면 (LF.05 무인 가게 계산서) — 수치·출처는 docs/longform-ep05.md
   중심 그림: 아이스크림 하나 1,000원 = 100원짜리 동전 10개. 가져가는 순서대로 동전이 물든다. 마지막 동전의 83% = 점주 몫.
   ════════════════════════════════════════════════════════════════════ */
const CO=[ // 동전 순서 = 가져가는 순서 (하나당 원)
  {k:'cost',name:'물건값',ic:'🍦',v:700,col:'#6FD3FF'},
  {k:'rent',name:'건물주',ic:'🏠',v:125,col:'#FF6FA8'},
  {k:'elec',name:'냉동고 전기',ic:'⚡',v:58.33,col:'#FFE066'},
  {k:'fee',name:'수수료',ic:'💳',v:16.67,col:'#B18CFF'},
  {k:'theft',name:'도난',ic:'🚨',v:16.67,col:'#FF9F43'},
  {k:'owner',name:'점주',ic:'🧑‍💼',v:83.33,col:'#35E08A'},
];
const COK=Object.fromEntries(CO.map(s=>[s.k,s]));
const SEQ=['2','2','00','00','0','÷','8','0','0','0','='];   // 2,200,000 ÷ 8,000 = 275 (0 개수 확인: 220만 = 2200000 = 2·2·00·00·0, 267원 × 30일 = 8000 = 8·0·0·0)
const MON=[600,550,850,1000,1300,1700,2300,2300,1500,1000,700,600]; // 월 매출 예시(만 원), 평균 1,200
const mProfit=s=>s*(800/3)/1000-220; // 한 달 남는 돈(만 원) = 매출 × 26.67% − 220
function coinT(k){return {cost:KT('s2',0),rent:KT('s3',0),elec:KT('s4',0),fee:KT('s5',0),theft:KT('s5',1),owner:KT('s7',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim});}
function srcLineR(s){srcLine(s,872,1340);}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}

/* 무인 아이스크림 가게 외관 (상표 없는 일반 가게) */
function storeFront(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#24304a';rr(-420,-300,840,560,18);ctx.fill();
    ctx.fillStyle='#e9f6ff';rr(-420,-300,840,90,14);ctx.fill();
    text('24시 무인 아이스크림',0,-255,{f:'D',s:50,c:'#1d4f8a'});
    ctx.fillStyle='#6FD3FF';ctx.fillRect(-420,-210,840,14);
    ctx.save();ctx.shadowColor='rgba(150,220,255,.6)';ctx.shadowBlur=40;ctx.fillStyle='#d9f1ff';rr(-390,-170,560,400,8);ctx.fill();ctx.restore();
    // 냉동고 두 대
    [-320,-60].forEach(fx=>{ctx.fillStyle='#f7fbff';rr(fx,-60,220,260,10);ctx.fill();ctx.fillStyle='#9fd6f5';rr(fx+12,-48,196,120,8);ctx.fill();
      const cols=['#FF6FA8','#FFE066','#B18CFF','#35E08A','#FF9F43','#6FD3FF'];for(let i=0;i<6;i++){ctx.fillStyle=cols[(i+(fx>0?2:0))%6];rr(fx+20+i*31,-36,24,96,6);ctx.fill();}
      ctx.fillStyle='#c7d4e3';ctx.fillRect(fx,90,220,8);});
    emoji('🍦',-200,-120,70);text('할인',-30,-120,{f:'D',s:44,c:'#e0242c'});
    // 키오스크
    ctx.fillStyle='#2b3550';rr(220,-140,140,340,14);ctx.fill();ctx.fillStyle='#6FD3FF';rr(236,-120,108,150,8);ctx.fill();text('결제',290,-45,{f:'D',s:32,c:'#1d2433'});ctx.fillStyle='#ffd166';rr(250,70,80,24,6);ctx.fill();
    if(!o.noCam){ctx.fillStyle='#e8ecf5';rr(300,-200,60,30,8);ctx.fill();ctx.fillStyle='#1d2433';ctx.beginPath();ctx.arc(316,-185,9,0,7);ctx.fill();}
  });
}
/* 100원짜리 동전 10개 (5 × 2). 가져가는 순서대로 물든다. 반환값 = 아직 안 가져간 돈(원) */
function drawCoins(x0,y0,cell){
  const N=10,cols=5,r=cell*.44;let acc=0,taken=0;const ranges=[];
  CO.forEach(s=>{const n=s.v/100,t=T-coinT(s.k),f=t>=0?E.out(P(t,0,Math.min(1.4,.3+n*.12))):0;ranges.push([acc,acc+n*f,s.col,s.k]);if(s.k!=='owner')taken+=s.v*f;acc+=n;});
  for(let i=0;i<N;i++){const cx=x0+(i%cols)*cell+cell/2,cy=y0+Math.floor(i/cols)*cell+cell/2;
    const g=ctx.createRadialGradient(cx-r*.3,cy-r*.3,r*.1,cx,cy,r);g.addColorStop(0,'#f1f3f7');g.addColorStop(1,'#9aa3b5');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();
    ranges.forEach(([a,b,col])=>{const s0=Math.max(a,i),s1=Math.min(b,i+1);if(s1<=s0)return;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2+(s0-i)*Math.PI*2,-Math.PI/2+(s1-i)*Math.PI*2);ctx.closePath();ctx.fill();});
    ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
    text('100',cx,cy+1,{s:r*.55,w:900,c:'rgba(20,24,40,.45)'});}
  if(T>=coinT('owner')){const k=P(T-coinT('owner'),0,.4),i=9,cx=x0+(i%cols)*cell+cell/2,cy=y0+Math.floor(i/cols)*cell+cell/2;ctx.save();ctx.globalAlpha*=k;ctx.strokeStyle=C.green;ctx.lineWidth=7;ctx.shadowColor=C.green;ctx.shadowBlur=24;ctx.beginPath();ctx.arc(cx,cy,r+8,0,7);ctx.stroke();ctx.restore();}
  return 1000-taken;
}
/* 하나 1,000원 가로 막대 (구성 비율) */
function itemBar(x,y,w,h,k=1){let xx=x;CO.forEach((s,i)=>{const ww=w*s.v/1000,kk=E.out(P(k,i*.1,.4));ctx.fillStyle=s.col;rr(xx,y-h/2,Math.max(2,ww*kk-3),h,10);ctx.fill();if(ww>70&&kk>.5)text(String(Math.round(s.v)),xx+ww/2,y+2,{f:'D',s:h*.42,c:'#101420'});xx+=ww;});}
/* 월별 매출 막대 (만 원) */
function monthBars(X0,base,bw,gap,sc,k,o={}){
  MON.forEach((v,i)=>{const kk=E.out(P(k,i*.08,.5)),h=v*sc*kk,x=X0+i*(bw+gap),loss=mProfit(v)<0;
    ctx.fillStyle=loss?C.red:(o.hl&&o.hl.includes(i)?C.green:'#6FD3FF');rr(x,base-h,bw,h,10);ctx.fill();
    text((i+1)+'월',x+bw/2,base+34,{s:28,w:900,c:'rgba(255,255,255,.7)'});});
  const ly=base-825*sc;ctx.save();ctx.setLineDash([16,10]);ctx.strokeStyle=C.gold;ctx.lineWidth=4;line(X0-20,ly,X0+12*(bw+gap),ly);ctx.restore();
  text('손익분기',X0+12*(bw+gap)+4,ly-18,{a:'left',s:26,w:900,c:C.gold});text('825만',X0+12*(bw+gap)+4,ly+18,{a:'left',s:26,w:900,c:C.gold});
}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o4')){
      storeFront(560,540,E.back(P(a,0,.4))+.001);
      group(1420,330,lerp(1.6,1,E.out(P(a,.1,.3))),-.03,P(a,0,.15),()=>{panel(-330,-120,660,240,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('아이스크림 하나',0,-60,{s:40,w:900,c:C.dim});text('1,000원',0,30,{f:'D',s:120,c:C.gold});});
      const b=L('o2');if(b>=0)text('× 하루 400개 × 30일 = 월 1,200만 원',1420,520,{f:'D',s:48,alpha:P(b,.2,.3),max:760});
      const k=K('o3',0);if(L('o3')>=0){text('알바 0명, 하나 팔면 점주 손에',1420,640,{s:40,w:900,alpha:P(L('o3'),0,.3)});if(k>=0)group(1420,760,lerp(1.5,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text('약 83원',0,0,{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.4)'}));else text('?',1420,760,{f:'D',s:110,c:C.gold});}
    }else if(T<CT('o5')){
      const b=K('o4',0),c=K('o4',1);
      group(520,420,lerp(1.2,1,E.out(P(Math.max(0,b),0,.4))),0,P(L('o4'),0,.2),()=>{text('한 달',0,-120,{s:44,w:900,c:C.dim});text(b>=0?'100만 원':'?',0,0,{f:'D',s:190,c:C.green,glow:'rgba(53,224,138,.4)'});text('1년 평균으로는',0,130,{s:34,w:800,c:C.dim});});
      emoji('😊',520,780,150,{alpha:P(L('o4'),.3,.3)});
      if(T>=FR('o4',.45)){const q=T-FR('o4',.45);group(1400,450,1,0,P(q,0,.3),()=>{panel(-380,-250,760,500,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:6});text('1년 열두 달 중',0,-170,{s:40,w:900,c:C.dim});text('넉 달은?',0,-60,{f:'D',s:92});
        for(let i=0;i<12;i++){const x=-330+i*56,red=[0,1,10,11].includes(i)&&c>=0;ctx.fillStyle=red?C.red:'rgba(255,255,255,.25)';rr(x,20,44,44,8);ctx.fill();}
        if(c>=0)group(0,160,lerp(1.5,1,E.out(P(c,0,.3))),0,P(c,0,.15),()=>text('적자',0,0,{f:'D',s:120,c:C.red,glow:'rgba(255,77,77,.5)'}));});}
    }else if(T<CT('o6')){
      const b=L('o5');text('어느 가게가 살아남든',700,320,{f:'D',s:86,alpha:P(b,0,.3)});text('냉동고 안에서 웃는 쪽?',700,460,{f:'D',s:86,c:C.gold,alpha:P(b,.2,.3),glow:'rgba(255,197,49,.4)'});
      text('?',700,690,{f:'D',s:260,c:C.red,alpha:P(b,.5,.3)});drawMascot(1500,560,1.1,'think',{alpha:P(b,0,.3)});
    }else{
      const k9=L('o6'),k10=L('o7');
      text('차리기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:80,c:C.gold,alpha:P(k9,0,.3)});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['경찰청 자료','카드사 분석','시장조사업체','언론 보도'].forEach((s,i)=>{const k=P(k10,.5+i*.35,.3);if(k>0)pill(s,330+i*420,760,{s:34,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('무인 가게 계산서',960,300,{f:'D',s:160,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3)});
    text('아이스크림 하나 1,000원, 누가 얼마를 가져가나',960,450,{s:56,w:900,alpha:P(a,.3,.3)});
    storeFront(700,760,.55,{alpha:P(a,.2,.3)});drawMascot(1300,720,.85,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p2',()=>{
      storeFront(560,500,.85);
      emoji('🍦',1380,330,150,{alpha:P(L('p2'),0,.3)});popText(KT('p2',0),1380,500,'하나 평균 1,000원',{f:'D',s:80,c:C.gold});popText(KT('p2',1),1380,660,'하루 400개',{f:'D',s:120,c:'#fff'});});
    sub('p3','p3',()=>{text('한 달 = 1만 2천 개',960,260,{f:'D',s:60,c:C.gold});
      const kt=T-KT('p3',0);if(kt<0)text('매출 ?',960,460,{f:'D',s:150,c:C.gold});else{const k=E.out(P(kt,0,.7));text('매출 '+won(Math.round(1200*k))+'만 원',960,460,{f:'D',s:150,c:C.gold,glow:'rgba(255,197,49,.4)'});}});
    sub('p4','p4b',()=>{text('무인 아이스크림 가게 초기 투자비',960,220,{f:'D',s:56,c:C.gold});
      const k=K('p4',0);group(560,470,1,0,1,()=>{panel(-340,-160,680,320,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text('점주 말 (보도)',0,-90,{s:36,w:900,c:C.dim});text(k>=0?'약 2,000만 원':'?',0,20,{f:'D',s:96,c:C.gold});});
      group(1360,470,1,0,P(L('p4'),1.5,.4),()=>{panel(-340,-160,680,320,{bd:'rgba(255,255,255,.35)'});text('일반 프랜차이즈의',0,-50,{s:44,w:900});text('절반도 안 된다',0,40,{f:'D',s:64});});
      sub('p4b','p4b',()=>{const q=K('p4b',0);group(960,760,1,0,1,()=>{panel(-620,-70,1240,140,{bg:'rgba(6,13,32,1)',bd:C.green,lw:5});text('2,000만 ÷ 한 달 100만 =',-120,4,{f:'D',s:54});text(q>=0?'20개월':'?',400,4,{f:'D',s:72,c:C.green});});});
      srcLine('뉴스토마토 2026.4.3 (무인 아이스크림 할인점 가맹점주 인터뷰)');});
    sub('p5','p5',()=>{text('알바생 0명',960,220,{f:'D',s:72,c:C.gold});
      [['📦','채우기'],['🧹','치우기']].forEach(([ic,l],i)=>{const k=E.back(P(L('p5'),.3+i*.3,.35));if(k>0)group(700+i*520,500,k,0,1,()=>{panel(-200,-170,400,340,{bd:'rgba(255,197,49,.6)'});emoji(ic,0,-40,130);text(l,0,100,{f:'D',s:50});});});
      pill('점주가 하루 2시간쯤 들른다 (예시)',960,780,{s:38,bg:'rgba(255,255,255,.92)'});});
    sub('p6','p6',()=>{[['세금 제외','🧾'],['점주에게 유리하게','👍']].forEach(([s,ic],i)=>{const k=E.back(P(L('p6'),i*.3,.35));if(k>0)group(700+i*520,480,k,0,1,()=>{panel(-230,-170,460,340,{bd:'rgba(255,197,49,.6)'});emoji(ic,0,-50,120);text(s,0,100,{f:'D',s:44});});});});
    sub('p7','p7',lt=>{const k=E.out(P(lt,0,.5));group(460,480,lerp(1.2,.9,k),0,1-P(lt,1.2,.4),()=>{ctx.fillStyle='#d8e4f0';rr(-260,-130,520,260,20);ctx.fill();text('1,000원',0,6,{f:'D',s:110,c:'#2a3f5a'});});
      if(lt>1.2){const q=P(lt,1.2,.8);ctx.save();ctx.globalAlpha*=q;for(let i=0;i<10;i++){const cx=280+(i%5)*90,cy=420+Math.floor(i/5)*90;ctx.fillStyle='#c3c9d6';ctx.beginPath();ctx.arc(cx,cy,36,0,7);ctx.fill();}ctx.restore();}
      text('= 100원짜리 동전 10개',1300,480,{f:'D',s:72,c:C.gold,alpha:P(lt,.8,.4)});});
  }},
  /* ── 1,000원 쪼개기 ── */
  coins:{draw(){
    const left=drawCoins(60,240,176);
    const hide=T>=CT('s6')&&T<KT('s7',0);
    text('남은 돈',500,690,{s:32,w:900,c:C.dim});text(hide?'?':won(Math.round(left))+'원',500,770,{f:'D',s:84,c:hide?C.gold:left<100?C.green:'#fff'});
    const PX=1000;
    sub('s1','s2b',()=>{text('🍦 첫 번째: 아이스크림 원가',PX,210,{a:'left',f:'D',s:54,c:'#6FD3FF'});
      text('업계 평균 마진율 약 30%',PX,310,{a:'left',f:'D',s:46});
      sub('s2','s2b',()=>{hbar(PX,430,640,84,700,700,COK.cost.col,'',{k:E.out(P(T-KT('s2',0),0,.8))});if(T>=KT('s2',0))text('물건값 700원',PX+320,432,{f:'D',s:50,c:'#0b1020',alpha:P(T-KT('s2',0),.4,.3)});});
      sub('s2b','s2b',()=>pill('동전 7개가 한 번에',PX+320,580,{s:40,bg:'rgba(255,255,255,.92)'}));
      srcLineR('“아이스크림 평균 마진율 약 30%” (업계, 뉴스토마토 2026.4.3)');});
    sub('s3','s3',()=>{text('🏠 두 번째: 건물주',PX,210,{a:'left',f:'D',s:56,c:'#FF6FA8'});text('월세 150만 원 (예시)',PX+420,360,{f:'D',s:60});text('÷ 1만 2천 개',PX+420,450,{s:44,w:900,c:C.dim});popText(KT('s3',0),PX+420,590,'하나 125원',{f:'D',s:96,c:'#FF6FA8'});});
    sub('s4','s4',()=>{text('⚡ 세 번째: 냉동고 전기',PX,210,{a:'left',f:'D',s:56,c:'#FFE066'});text('24시간 도는 냉동고',PX+420,350,{s:44,w:900});text('한 달 70만 원 (예시)',PX+420,440,{f:'D',s:56});popText(KT('s4',0),PX+420,590,'하나 58원',{f:'D',s:96,c:'#FFE066'});});
    sub('s5','s5',()=>{text('네 번째: 작은 동전 두 개',PX,210,{a:'left',f:'D',s:56,c:'#fff'});
      popText(KT('s5',0),PX+420,400,'💳 카드·키오스크 수수료 17원',{f:'D',s:52,c:'#B18CFF',max:840});popText(KT('s5',1),PX+420,540,'🚨 없어지는 물건 17원',{f:'D',s:52,c:'#FF9F43',max:840});
      text('각각 한 달 20만 원 (예시)',PX+420,660,{s:38,w:900,c:C.dim,alpha:P(L('s5'),.5,.3)});});
    sub('s6','s7',()=>{text('🧑‍💼 마지막: 점주',PX,210,{a:'left',f:'D',s:56,c:C.green});
      const k=T-KT('s7',0);if(k>=0){group(PX+420,460,lerp(1.6,1,E.out(P(k,0,.35))),0,P(k,0,.15),()=>text('83원',0,0,{f:'D',s:220,c:C.green,glow:'rgba(53,224,138,.45)'}));stampBox('동전 한 개도 안 된다',PX+420,690,k-.5,{s:56,c:C.gold,bg:'rgba(40,30,0,.8)'});}
      else text('?',PX+420,460,{f:'D',s:300,c:C.gold,alpha:P(L('s6'),0,.3)});});
    sub('s8','s9',()=>{group(PX+420,420,1,0,1,()=>{panel(-420,-150,840,300,{bd:C.green,bg:'rgba(53,224,138,.08)',lw:6});text('83원 × 1만 2천 개',0,-70,{f:'D',s:56});const q=K('s8',0);text(q>=0?'= 한 달 100만 원':'= ?',0,50,{f:'D',s:84,c:C.green,alpha:q>=0?P(q,0,.2):1});});
      const q=L('s9');if(q>=0)group(PX+420,720,1,0,P(q,0,.3),()=>pill('하루 400개를 팔 때만 나오는 돈',0,0,{s:38,bg:'rgba(255,255,255,.92)'}));});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('÷'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s.replace('=','')).toLocaleString('ko-KR'):'';
    let small='',big='0';if(done){small=`${fmt(n1)} ÷ ${fmt(n2)} =`;big=String(2200000/8000);}else if(n2!==undefined){small=`${fmt(n1)} ÷`;big=n2?fmt(n2):fmt(n1);}else if(n1)big=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(big,225,-310,{a:'right',s:done?120:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('월세 + 전기 = 한 달 220만 원',1350,260,{f:'D',s:56,c:C.gold,alpha:P(a,.2,.3)});text('÷ (하나 남는 약 267원 × 30일)',1350,360,{s:44,w:900,alpha:P(a,.4,.3),max:900});
    if(dt>=0){group(1350,520,lerp(1.6,1,E.out(P(dt,0,.3))),0,P(dt,0,.15),()=>text('= 하루 275개',0,0,{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.45)'}));text('이 아래로 내려가면 적자',1350,640,{s:44,w:900,c:C.dim,alpha:P(dt,.5,.3)});
      if(L('c3')<0)drawMascot(1350,820,.5,'shock');
      else{const p=K('c3',0),q=K('c3',1);if(p>=0)group(1150,780,E.back(P(p,0,.4)),0,1,()=>pill('300개 → +20만 원',0,0,{s:40,bg:C.green,c:'#0b1020'}));if(q>=0)group(1570,780,E.back(P(q,0,.4)),0,1,()=>pill('250개 → −20만 원',0,0,{s:40,bg:C.red,c:'#fff'}));}}
    if(dt>=0)group(1180,160,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 점주의 시간 ── */
  owner:{draw(){
    sub('w1','w1',()=>{storeFront(560,500,.8);text('무인 = 사람 없음?',1380,420,{f:'D',s:86});text('?',1380,640,{f:'D',s:220,c:C.gold});});
    sub('w2','w2',()=>{text('점주가 하는 일',960,200,{f:'D',s:60,c:C.gold});
      [['📦','냉동고 채우기'],['🍦','녹은 물건 빼기'],['🧹','바닥 청소'],['🖥️','키오스크 오류']].forEach(([ic,l],i)=>{const k=E.back(P(L('w2'),.2+i*.5,.35));if(k>0)group(300+i*440,450,k,0,1,()=>{panel(-190,-160,380,320,{bd:'rgba(255,197,49,.6)'});emoji(ic,0,-40,120);text(l,0,100,{f:'D',s:40,max:340});});});
      popText(KT('w2',0),960,760,'하루 2시간 × 30일 = 60시간',{f:'D',s:72,c:C.gold});});
    sub('w3','w3',()=>{text('점주 시급',960,220,{f:'D',s:60,c:C.gold});text('한 달 100만 원 ÷ 60시간',960,380,{f:'D',s:76});
      const q=K('w3',0);if(q>=0)group(960,560,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('약 1만 6,700원',0,0,{f:'D',s:140,c:C.green,glow:'rgba(53,224,138,.4)'}));else text('?',960,560,{f:'D',s:140,c:C.gold});
      emoji('😊',1560,560,120,{alpha:P(L('w3'),1.4,.3)});});
    sub('w4','w5',()=>{text('그 두 시간을 알바에게 맡기면',960,190,{f:'D',s:56,c:C.gold});
      const base=700,sc=4.0;const k0=E.out(P(L('w4'),0,.6));vCash(500,base-100*sc*k0,300,100*sc*k0,C.green);text('+100만',650,base-100*sc*k0-50,{f:'D',s:60,c:C.green,alpha:k0});text('점주가 직접',650,base+44,{s:36,w:900});
      const k1=E.out(P(L('w4'),.8,.6));vCash(1120,base-38*sc*k1,300,38*sc*k1,C.green);ctx.fillStyle='rgba(177,140,255,.85)';rr(1120,base-100*sc,300,62*sc*k1,14);ctx.fill();if(k1>.5)text('알바 62만',1270,base-100*sc+62*sc/2,{f:'D',s:44,c:'#1d2433'});
      const q=K('w4',0);text(q>=0?'+38만':'?',1270,base-100*sc-50,{f:'D',s:60,c:q>=0?C.green:C.gold});text('알바 60시간 × 10,320원',1270,base+44,{s:36,w:900});
      sub('w5','w5',()=>pill('인건비 0원 = 점주의 시간이 대신 내는 돈',960,850,{s:40,bg:'rgba(255,255,255,.92)'}));
      srcLineR('');});
  }},
  /* ── 도난 ── */
  theft:{draw(){
    sub('t1','t1',()=>{emoji('🚨',600,470,260);text('하나에 17원',1300,380,{f:'D',s:96,c:'#FF9F43'});text('충분할까?',1300,520,{f:'D',s:96});});
    sub('t2','t4',()=>{text('무인점포 절도 (경찰청 자료)',960,180,{f:'D',s:56,c:C.gold});
      const base=740,sc=420/11015,bars=[['2021년',3514,KT('t2',0),'#8e98ad'],['2023년',10847,CT('t3'),'#FF9F43'],['2024년',10769,CT('t3')+.6,'#FF9F43'],['2025년',11015,KT('t2',1),C.red]];
      bars.forEach(([l,v,t,col],i)=>{const x=330+i*360;text(l,x+110,base+40,{s:36,w:900,c:'rgba(255,255,255,.75)'});if(T<t)return;const k=E.out(P(T-t,0,.6)),h=v*sc*k;vCash(x,base-h,220,h,col);text(won(v)+'건',x+110,base-h-40,{f:'D',s:50,c:col,alpha:k});});
      const q=K('t2',1);if(q>=0)stampBox('3배 넘게',430,300,q-.3,{s:64,c:C.red,bg:'rgba(40,0,0,.85)'});
      sub('t4','t4',()=>pill('경찰이 처리하는 사건: 1,000~2,000원 소액 절도가 많다',960,862,{s:34,bg:'rgba(255,255,255,.92)'}));
      if(T<CT('t4'))srcLine('세계일보 2026.4.15 (권칠승 의원실 · 경찰청: 2021 3,514건 → 2025 1만 1,015건) · 파이낸셜뉴스 2026.1.18 (2023 1만 847건 · 2024 1만 769건)');});
    sub('t5','t5',()=>{text('1,000원짜리 하나가 없어지면',960,200,{f:'D',s:60,c:C.gold});
      group(520,470,1,0,1,()=>{panel(-300,-170,600,340,{bd:C.red,bg:'rgba(255,77,77,.1)',lw:6});emoji('🍦',0,-60,110);text('원가 700원 손실',0,90,{f:'D',s:60,c:'#ffb3b3'});});
      const q=K('t5',0);group(1380,470,1,0,1,()=>{panel(-400,-170,800,340,{bd:C.green,bg:'rgba(53,224,138,.08)',lw:6});text('700원 ÷ 하나 남는 267원',0,-100,{s:38,w:900});
        for(let i=0;i<3;i++){const k=q>=0?E.back(P(q,i*.15,.35)):0;if(k>0)emoji('🍦',-180+i*180,20,i===2?80:110,{alpha:i===2?.6:1});}
        if(q>=0)text('= 2.6개 더 팔아야',0,120,{f:'D',s:60,c:C.green,alpha:P(q,.5,.3)});else text('?',0,20,{f:'D',s:120,c:C.gold});});});
    sub('t6','t7',()=>{text('없어지는 물건이 늘면',960,190,{f:'D',s:56,c:C.gold});
      const base=740,sc=4.2,k0=E.out(P(L('t6'),0,.6));vCash(500,base-100*sc*k0,300,100*sc*k0,C.green);text('+100만',650,base-100*sc*k0-50,{f:'D',s:60,c:C.green,alpha:k0});text('하루 약 10개 (지금)',650,base+44,{s:36,w:900});
      const kt=K('t7',0);if(L('t7')>=0){const k1=E.out(P(L('t7'),0,.6));vCash(1120,base-79*sc*k1,300,79*sc*k1,C.green);if(kt>=0){ctx.fillStyle='rgba(255,159,67,.9)';rr(1120,base-100*sc,300,21*sc*E.out(P(kt,0,.5)),12);ctx.fill();text('−21만',1270,base-100*sc+44,{f:'D',s:40,c:'#1d2433',alpha:P(kt,.3,.3)});}
        text(kt>=0?'+79만':'?',1270,base-100*sc-50,{f:'D',s:60,c:kt>=0?C.green:C.gold});text('하루 20개가 되면',1270,base+44,{s:36,w:900});}
      sub('t6b','t6b',()=>pill('📹 CCTV 돌려 보기 · 신고하러 다니기 = 계산에 안 잡히는 점주의 시간',960,850,{s:32,bg:'rgba(255,255,255,.92)'}));});
  }},
  /* ── 계절 ── */
  season:{draw(){
    const a=L('m1');
    text('월 매출 예시 (만 원) · 1년 평균 1,200만 = 하루 400개',960,170,{f:'D',s:46,c:C.gold,alpha:P(a,0,.3)});
    if(T<CT('m2')){emoji('☀️',620,500,220,{alpha:P(a,.2,.3)});emoji('❄️',1300,500,220,{alpha:P(a,.5,.3)});return;}
    const X0=230,bw=96,gap=28,base=760,sc=.2;
    monthBars(X0,base,bw,gap,sc,L('m2'),{hl:T>=CT('m6')?[5,6,7]:[]});
    const lab=(i,str,col,t)=>{if(T<t)return;const v=MON[i],x=X0+i*(bw+gap)+bw/2,y=base-v*sc-32;group(x,y,E.back(P(T-t,0,.35)),0,1,()=>text(str,0,0,{f:'D',s:30,c:col,st:6}));};
    lab(6,'+393',C.green,KT('m3',0));lab(7,'+393',C.green,KT('m3',0)+.15);
    [11,0,1].forEach((i,j)=>lab(i,String(Math.round(mProfit(MON[i]))).replace('-','−'),C.red,KT('m4',0)+j*.15));
    lab(10,'−33',C.red,CT('m5'));
    const q=K('m5',0);if(q>=0&&T<CT('m6'))stampBox('넉 달 동안 −227만 원',1480,230,q,{s:46,c:C.red,bg:'rgba(40,0,0,.88)'});
    sub('m6','m6',()=>{const x0=X0+5*(bw+gap)-10,w=3*(bw+gap)+gap/2;ctx.save();ctx.strokeStyle=C.green;ctx.lineWidth=7;rr(x0,base-2300*sc-80,w,2300*sc+100,18);ctx.stroke();ctx.restore();
      group(1530,330,1,0,P(L('m6'),.3,.3),()=>pill('여름 석 달 +1,020만 = 겨울을 버틸 돈',0,0,{s:34,bg:C.green,c:'#0b1020'}));});
    sub('m7','m7',()=>pill('평균 한 달 100만 원 안에 숨은 굴곡',960,850,{s:40,bg:'rgba(255,255,255,.92)'}));
    if(T<CT('m6'))srcLine('월별 매출은 계절성을 보이려는 예시 가정 (전기료는 매달 같게 둠)',872);
  }},
  /* ── 옆 가게 ── */
  share:{draw(){
    sub('n1','n1',()=>{[0,1,2].forEach(i=>{const k=E.back(P(L('n1'),.2+i*.4,.4));if(k>0)storeFront(360+i*600,470,.5*k+.001,{noCam:true});});text('투자비가 낮다 = 옆에도 쉽게 생긴다',960,770,{f:'D',s:60,c:C.gold,alpha:P(L('n1'),1,.3)});});
    sub('n2','n3',()=>{text('무인점포 수',960,190,{f:'D',s:56,c:C.gold});
      const q=K('n2',0);group(560,450,1,0,1,()=>{panel(-360,-170,720,340,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:6});text('2020년 이후 (삼성카드)',0,-100,{s:36,w:900,c:C.dim});text(q>=0?'+314%':'?',0,20,{f:'D',s:150,c:C.red});});
      sub('n3','n3',()=>{group(1360,450,1,0,1,()=>{panel(-360,-170,720,340,{bd:'rgba(255,255,255,.35)'});text('포털 등록 프랜차이즈 (2025.4)',0,-100,{s:34,w:900,c:C.dim});text('9,300개',0,0,{f:'D',s:110});text('개인 매장 합치면 1만 개 이상 추정',0,100,{s:32,w:900,c:C.gold});});});
      srcLine('세계일보 2026.4.15 (삼성카드 집계 · 포털 등록 프랜차이즈 무인점포 수) · 뉴스토마토 2026.4.3');});
    sub('n3b','n4',()=>{const cx=560,cy=500;ctx.save();ctx.strokeStyle='rgba(255,197,49,.6)';ctx.setLineDash([14,10]);ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx,cy,280,0,7);ctx.stroke();ctx.restore();
      text('몇백 m',cx,cy+320,{s:32,w:900,c:C.gold});[[-120,-90],[130,-60],[-40,130],[150,140]].forEach(([dx,dy],i)=>{const k=E.back(P(L('n3b'),.2+i*.3,.35));if(k>0)group(cx+dx,cy+dy,k,0,1,()=>{ctx.fillStyle=i===0?C.green:'#6FD3FF';rr(-60,-50,120,100,14);ctx.fill();emoji('🍦',0,0,60);});});
      sub('n4','n4',()=>{group(1360,470,1,0,1,()=>{panel(-440,-180,880,360,{bd:C.gold,bg:'rgba(255,197,49,.08)',lw:6});text('서울 왕십리 4년 차 점주',0,-110,{s:34,w:900,c:C.dim});text('“근처에 새 가게가 들어선 뒤',0,-20,{f:'D',s:50});const q=K('n4',0);text(q>=0?'매출이 15%가량 감소”':'매출이 ?',0,70,{f:'D',s:60,c:C.red});});});
      srcLine('뉴스토마토 2026.4.3 (점주 인터뷰 · 반경 수백 m 안 3~4곳)');});
    sub('n5','n7',()=>{text('옆에 또 생기면 (한 곳마다 매출 −15%)',960,180,{f:'D',s:54,c:C.gold});
      const base=640,rows=[[1200,100,'지금 1,200만',CT('n5')-.3,C.green],[1020,52,'한 곳 생기면 1,020만',KT('n5',0),C.green],[867,11,'두 곳 생기면 867만',KT('n6',0),C.gold]];
      rows.forEach(([s,p,l,t,col],i)=>{const x=280+i*480;text(l,x+150,base+44,{s:34,w:900,c:C.dim});if(T<t)return;const k=E.out(P(T-t,0,.6)),h=p*3.4*k;vCash(x,base-h,300,h,col);text('+'+p+'만',x+150,base-h-46,{f:'D',s:60,c:col,alpha:k});});
      sub('n7','n7',()=>{const y=790;text('두 곳 생긴 가게의 열두 달',410,y,{a:'right',s:32,w:900});const q=K('n7',0);
        MON.forEach((v,i)=>{const loss=mProfit(v*.7225)<0;ctx.fillStyle=q>=0&&loss?C.red:'rgba(255,255,255,.25)';rr(440+i*76,y-30,64,60,10);ctx.fill();text((i+1)+'',440+i*76+32,y+2,{s:26,w:900,c:'#0b1020'});});
        if(q>=0)text('7달 적자',1430,y,{a:'left',f:'D',s:56,c:C.red,alpha:P(q,0,.3)});});});
  }},
  /* ── 제조사 ── */
  maker:{draw(){
    sub('h1','h1',()=>{group(960,500,1,0,1,()=>{ctx.fillStyle='#f7fbff';rr(-360,-260,720,520,20);ctx.fill();ctx.fillStyle='#9fd6f5';rr(-330,-230,660,300,14);ctx.fill();
      const cols=['#FF6FA8','#FFE066','#B18CFF','#35E08A','#FF9F43','#6FD3FF'];for(let r=0;r<2;r++)for(let i=0;i<9;i++){ctx.fillStyle=cols[(i+r*3)%6];rr(-300+i*68,-210+r*140,52,120,8);ctx.fill();}
      text('냉동고 안에서 웃는 쪽은?',0,170,{f:'D',s:56,c:'#1d2433'});});});
    sub('h2','h3',()=>{text('아이스크림 전체 매출에서 차지하는 비중 (2025)',960,200,{f:'D',s:54,c:C.gold});
      const k=E.out(P(T-KT('h2',0),0,.6)),k2=E.out(P(L('h2'),2.6,.6));
      text('무인 할인점',520,400,{a:'right',s:44,w:900});hbar(550,400,1000,90,34.3,40,'#6FD3FF',T>=KT('h2',0)?'34.3%':'',{s:60,k});
      text('편의점',520,560,{a:'right',s:44,w:900});hbar(550,560,1000,90,27.1,40,'#8e98ad',k2>.1?'27.1%':'',{s:60,k:k2});
      sub('h3','h3',()=>pill('아이스크림이 가장 많이 팔리는 곳 = 무인 할인점',960,720,{s:40,bg:'rgba(255,255,255,.92)'}));
      srcLine('닐슨 (뉴스토마토 2026.4.3 인용)');});
    sub('h4','h6',()=>{text('무인 채널에서 팔린 아이스크림, 누구 것?',960,190,{f:'D',s:54,c:C.gold});
      const X=180,Wd=1560,y=380,segs=[['제조사 A',45.5,'#FF6FA8'],['제조사 B',28.6,'#FFE066'],['제조사 C',17.4,'#B18CFF'],['기타',8.5,'#55607a']];let xx=X;
      segs.forEach(([l,v,col],i)=>{const k=E.out(P(L('h4'),.3+i*.5,.5)),w=Wd*v/100;if(k>0){ctx.fillStyle=col;rr(xx,y-70,Math.max(4,w*k-4),140,14);ctx.fill();if(k>.6){text(l,xx+w/2,y-20,{f:'D',s:w>200?40:26,c:'#1d2433',max:w-10});text(v+'%',xx+w/2,y+34,{f:'D',s:w>200?50:28,c:'#1d2433',max:w-10});}}xx+=w;});
      const q=K('h4',0);if(q>=0){const w3=Wd*.915;ctx.save();ctx.strokeStyle=C.red;ctx.lineWidth=8;ctx.globalAlpha*=P(q,0,.3);rr(X-8,y-84,w3+12,168,18);ctx.stroke();ctx.restore();stampBox('세 곳 합계 91.5%',960,580,q,{s:72,c:C.red,bg:'rgba(40,0,0,.88)'});}
      sub('h5','h5',()=>pill('점주끼리 손님을 나눠 가져도, 냉동고 안은 같은 세 회사',960,740,{s:38,bg:'rgba(255,255,255,.92)'}));
      sub('h6','h6',()=>{for(let i=0;i<8;i++){const k=E.back(P(L('h6'),i*.2,.3));if(k<=0)continue;group(270+i*197,750,k*.9,0,1,()=>{ctx.fillStyle='#f7fbff';rr(-80,-60,160,120,12);ctx.fill();['#FF6FA8','#FFE066','#B18CFF'].forEach((c,j)=>{ctx.fillStyle=c;rr(-62+j*42,-44,34,80,6);ctx.fill();});});}});
      srcLine('마크로밀 엠브레인 구매 데이터 (뉴스토마토 2026.4.3 인용) · 제조사 이름은 쓰지 않음');});
    sub('h7','h7',()=>{ctx.fillStyle='rgba(12,6,16,1)';ctx.fillRect(0,0,W,H);
      group(960,480,1,0,P(L('h7'),.2,.3),()=>{ctx.fillStyle='#f4f1e8';rr(-760,-200,1520,400,22);ctx.fill();text('경제 기사 제목',0,-130,{s:34,w:900,c:'#6a6f7d'});text('“우후죽순 늘어난 무인 할인점…',0,-30,{f:'D',s:66,c:C.ink});text('제조사는 방긋, 점주는 눈물”',0,70,{f:'D',s:76,c:'#d62f2f'});text('뉴스토마토 2026.4.3',0,150,{s:30,w:900,c:'#3a3f4d'});});
      emoji('😊',420,780,110,{alpha:P(L('h7'),1.6,.3)});emoji('😢',1500,780,110,{alpha:P(L('h7'),2.2,.3)});});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('숫자를 바꿀 수 있는 손잡이',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});if(T<CT('l2'))text('점주가 바꿀 수 있는 숫자는?',960,500,{f:'D',s:100,alpha:P(a,.2,.3)});
    const rows=[['5% 할인 (평균 950원)','−60만 (100 → 40만)',-60,C.red,'l2'],['월세 100만 원 자리','+50만 (→ 150만)',50,C.green,'l4'],['도난 하루 10개 → 5개','+10만',10,C.green,'l5'],['점주 시간 2시간 → 1시간','시급 1.67만 → 3.33만',66,'#B18CFF','l6']];
    rows.forEach(([l,lab,v,col,id],i)=>{const t=CT(id);if(T<t-.1)return;const y=310+i*150,k=E.out(P(T-t,.1,.6));text(l,600,y,{a:'right',s:38,w:900});ctx.fillStyle='rgba(255,255,255,.07)';rr(640,y-34,800,68,14);ctx.fill();const w=Math.abs(v)/80*800*k;ctx.fillStyle=col;rr(640,y-34,Math.max(6,w),68,14);ctx.fill();text(lab,640+Math.max(6,w)+20,y+2,{a:'left',f:'D',s:42,c:col,alpha:k,max:620});});
    sub('l3','l3',()=>{const q=K('l3',0);group(960,520,1,0,1,()=>{panel(-640,-90,1280,180,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('같은 100만 원을 남기려면 하루',-140,4,{f:'D',s:54});text(q>=0?'약 490개':'?',420,4,{f:'D',s:76,c:C.red});});});
    srcLine('예시 계산 · 하나 남는 돈 267원 → 950원이면 217원',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('y1'),ov=L('y7');
    text('무인 가게 차리기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:64,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['y2','y2','하루 손익분기 개수','월세·전기 ÷ 하나 남는 돈','오늘 가게: 220만 ÷ 8,000원 = 275개'],['y3','y3','가장 안 팔리는 달','평균 말고 1월 매출로','1월 600만 → 한 달 −60만'],['y4','y4','반경 몇백 m 같은 가게','하나 더 생기면 매출 −15%?','1,200만 → 1,020만 = +52만'],
      ['y5','y5','점주의 시간','채우고 치우는 시간 × 최저시급','60시간 = 약 62만 원'],['y6','y6b','도난과 할인','하루 몇 개 없어지고, 몇 % 깎나','5% 할인 → 100만이 40만']];
    cards.forEach(([id,ex,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:40,max:440});text(f,-250,0,{a:'left',s:30,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(ex),id===ex?1.5:0,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    sub('y6b','y6b',()=>pill('가맹점: 정보공개서의 개점·폐점 수 · 개인 가게: 동네를 걸으며 직접 세기',960,864,{s:28,bg:'rgba(255,255,255,.92)'}));
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-700,-220,1400,420,{bg:'rgba(6,13,32,1)',bd:C.gold});text('하루 350개 × 30일 × 약 267원 = 280만 원',0,-130,{f:'D',s:56,max:1300});
      const k=K('y7b',0);text(L('y7b')>=0?'− 월세·전기 220만 원 =':'− 월세·전기 220만 원 = ?',0,-30,{f:'D',s:56,c:L('y7b')>=0?C.gold:'#fff'});if(k>=0)text('한 달 60만 원',0,100,{f:'D',s:120,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('아이스크림 하나 1,000원',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      itemBar(160,380,1600,150,E.out(P(L('z2'),0,2.6)));
      let xx=160;CO.forEach((s,i)=>{const w=1600*s.v/1000,kk=P(L('z2'),i*.5,.4);if(kk>0){if(w>60)emoji(s.ic,xx+w/2,296,44,{alpha:kk});if(w>70)text(s.name,xx+w/2,480,{s:w>150?28:22,w:900,c:'rgba(255,255,255,.85)',alpha:kk,max:w-8});}xx+=w;});
      text('수수료 · 도난',160+1600*(883.33/1000),530,{s:24,w:900,c:'rgba(255,255,255,.7)',alpha:P(L('z2'),2,.4)});
      const b=L('z2b');if(b>=0){emoji('❄️',520,720,150,{alpha:P(b,0,.3)});group(1180,720,1,0,P(b,.3,.3),()=>{ctx.fillStyle='#fff';rr(-460,-80,920,160,30);ctx.fill();text('83원은 하루 400개를 팔 때의 이야기',0,-22,{s:38,w:900,c:C.ink});text('겨울 · 옆 가게 · 할인 앞에서 줄어든다',0,38,{f:'D',s:48,c:'#d62f2f'});});}
    }else{
      drawMascot(960,430,1.05,'think');
      stampBox('여름에 번 돈으로 겨울을 버티는 장사',960,760,c,{s:58,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1480,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-330,-70,660,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 동네 무인 가게 몇 곳? 댓글로!',0,4,{s:34,w:900,c:C.ink,max:620});});
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
