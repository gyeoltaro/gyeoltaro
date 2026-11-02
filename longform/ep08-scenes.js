/* ════════════════════════════════════════════════════════════════════
   장면 (LF.08 PC방 계산서) — 수치·출처는 docs/longform-ep08.md
   중심 그림: PC 한 시간 1,000원 = 100원 동전 10개. 가져가는 순서대로 동전이 물들고,
   PC 값부터는 동전이 모자라 빨간 점선 동전 3개 가까이를 더 꺼낸다(사장님 몫 −289원).
   ════════════════════════════════════════════════════════════════════ */
const CO=[ // 한 시간 1,000원에서 가져가는 순서 (원, 한 달 비용 ÷ 1만 2,960시간)
  {k:'game',name:'게임 사용료',ic:'🎮',v:125,col:'#B18CFF'},
  {k:'elec',name:'전기',ic:'⚡',v:154,col:'#6FD3FF'},
  {k:'rent',name:'월세',ic:'🏠',v:309,col:'#2ec4b6'},
  {k:'labor',name:'인건비',ic:'🧑‍💼',v:382,col:'#FF9F43'},
  {k:'pc',name:'PC 값',ic:'🖥️',v:257,col:'#FF6FA8'},
  {k:'etc',name:'기타',ic:'🧾',v:62,col:'#FFE066'},
];
const COK=Object.fromEntries(CO.map(s=>[s.k,s]));
const COST=CO.reduce((a,s)=>a+s.v,0); // 1,289
const SEQ=['2','8','9','×','1','2','9','6','0','='];   // 289 × 12,960 = 3,745,440 (0 개수 확인: 12960 = 1·2·9·6·0)
function coinT(k){return {game:KT('s3',0),elec:KT('s4',0),rent:KT('s5',0),labor:KT('s6',0),pc:KT('s8',0),etc:KT('s9',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim});}
function srcLineR(s){srcLine(s,872,1340);}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
const neg=n=>(n<0?'−':'')+won(Math.abs(n));
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}

/* 동네 PC방 외관 (상표 없음) */
function pcFront(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#1c2140';rr(-420,-300,840,560,18);ctx.fill();
    ctx.fillStyle='#0d1024';rr(-420,-300,840,110,14);ctx.fill();
    ctx.save();ctx.shadowColor='#6FD3FF';ctx.shadowBlur=30;text('PC',-150,-245,{f:'D',s:84,c:'#9fe6ff'});ctx.shadowColor='#FF6FA8';text('24시',110,-245,{f:'D',s:64,c:'#ffb3d1'});ctx.restore();
    // 유리창 속 모니터 줄
    ctx.fillStyle='#0a0d1c';rr(-390,-160,560,380,10);ctx.fill();
    for(let r=0;r<3;r++)for(let i=0;i<5;i++){const mx=-360+i*108,my=-130+r*120,on=rnd(r*7+i)>.45;
      ctx.fillStyle=on?'#4fb6ff':'#26304d';rr(mx,my,86,56,6);ctx.fill();if(on){ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(mx+8,my+8,30,6);}
      ctx.fillStyle='#3b4466';ctx.fillRect(mx+38,my+56,10,14);ctx.fillStyle=on?'#e0242c':'#3a2a35';rr(mx+20,my+74,46,26,8);ctx.fill();}
    // 문
    ctx.fillStyle='#2b3550';rr(200,-160,180,380,10);ctx.fill();ctx.fillStyle='rgba(180,220,255,.45)';rr(214,-144,152,210,6);ctx.fill();
    text('OPEN',290,120,{f:'D',s:34,c:'#35E08A'});
    if(o.ramen)emoji('🍜',330,300,110);
  });
}
/* 100원 동전 (은색) */
function coin100(x,y,r,o={}){
  ctx.save();ctx.globalAlpha*=(o.alpha??1);
  if(o.dash){ctx.setLineDash([10,8]);ctx.strokeStyle=C.red;ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();ctx.restore();return;}
  const g=ctx.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r);g.addColorStop(0,'#ffffff');g.addColorStop(.55,'#c9ced8');g.addColorStop(1,'#8a909c');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.strokeStyle='rgba(60,66,80,.6)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r*.84,0,7);ctx.stroke();
  ctx.restore();
}
/* 동전 13칸(10개 + 모자란 3칸). 반환값 = 남은 돈(원, 음수 가능) */
function drawCoins(cx,cy,o={}){
  const r=56,dx=136,dy=140;let acc=0,taken=0;const ranges=[];
  CO.forEach(s=>{const n=s.v/100,t=T-(o.full?-99:coinT(s.k)),f=t>=0?E.out(P(t,0,Math.min(1.4,.3+n*.2))):0;ranges.push([acc,acc+n*f,s.col]);taken+=s.v*f;acc+=n;});
  const over=acc*0+ranges.reduce((m,[a,b])=>Math.max(m,b),0); // 지금까지 덮인 끝
  for(let i=0;i<13;i++){const row=Math.floor(i/5),x=cx+((i%5)-2)*dx,y=cy+(row-1)*dy;
    if(i>=10){if(over<=10.02)continue;const vis=clamp((over-i)*3+.4);if(vis<=0)continue;coin100(x,y,r,{dash:1,alpha:vis});}
    else coin100(x,y,r);
    ranges.forEach(([a,b,col])=>{const s0=Math.max(a,i),s1=Math.min(b,i+1);if(s1<=s0)return;ctx.save();ctx.fillStyle=col;ctx.globalAlpha*=(i>=10?.75:.92);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,-Math.PI/2+(s0-i)*Math.PI*2,-Math.PI/2+(s1-i)*Math.PI*2);ctx.closePath();ctx.fill();ctx.restore();});
    if(i<10)text('100',x,y+2,{f:'D',s:34,c:'rgba(30,34,44,.75)'});}
  return 1000-taken;
}
/* 좌석 격자 (가동률) */
function seatGrid(x0,y0,n,lit,o={}){const cols=o.cols||10,cw=o.cw||64,chh=o.ch||58;for(let i=0;i<n;i++){const x=x0+(i%cols)*cw,y=y0+Math.floor(i/cols)*chh,on=i<lit;ctx.fillStyle=on?(o.col||'#4fb6ff'):'rgba(255,255,255,.12)';rr(x,y,cw-14,chh-22,6);ctx.fill();ctx.fillStyle=on?'rgba(255,255,255,.5)':'rgba(255,255,255,.08)';ctx.fillRect(x+(cw-14)/2-4,y+chh-22,8,10);}}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o3')){
      pcFront(540,500,.9*E.back(P(a,0,.4))+.001,{});
      group(1420,300,lerp(1.6,1,E.out(P(a,.1,.3))),-.03,P(a,0,.15),()=>{panel(-330,-120,660,240,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('PC방 한 시간',0,-60,{s:40,w:900,c:C.dim});text('1,000원',0,30,{f:'D',s:120,c:C.gold});});
      const b=L('o2');if(b>=0){text('한 시간 팔 때마다 사장님은',1420,520,{s:42,w:900,alpha:P(b,0,.3)});big('o2',0,1420,650,'−289원',{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.4)'});
        text('(예시 가게)',1420,780,{s:34,w:900,c:C.dim,alpha:P(b,.6,.3)});}
    }else if(T<CT('o4')){
      text('한 달이면 PC에서만',960,260,{f:'D',s:72,c:C.dim,alpha:P(L('o3'),0,.3)});
      big('o3',0,960,520,'−375만 원',{f:'D',s:220,c:C.red,glow:'rgba(255,77,77,.5)'});
      drawMascot(1640,700,.55,'shock',{alpha:P(K('o3',0),0,.3)});
    }else if(T<CT('o5')){
      const b=L('o4'),k=K('o4',0);
      group(420,460,1,0,P(b,0,.3),()=>{panel(-260,-170,520,340,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:5});emoji('🖥️',0,-60,110);text('PC −375만',0,90,{f:'D',s:60,c:C.red});});
      text('+',780,460,{f:'D',s:120,alpha:P(b,.3,.3)});
      group(1140,460,1,0,P(b,.5,.3),()=>{panel(-260,-170,520,340,{bd:C.green,bg:'rgba(53,224,138,.08)',lw:5});emoji('🍜',0,-60,110);text('라면 +540만',0,90,{f:'D',s:60,c:C.green});});
      text('=',1480,460,{f:'D',s:120,alpha:P(b,.7,.3)});
      big('o4',0,1700,460,'+165만',{f:'D',s:96,c:C.green,glow:'rgba(53,224,138,.4)'});
      if(k>=0)pill('메워 주는 건 PC가 아니라 라면',960,760,{s:44,alpha:P(k,.8,.3),bg:'rgba(255,255,255,.92)'});
    }else if(T<CT('o6')){
      const b=L('o5');text('손님이 조금만 줄어도',760,300,{f:'D',s:80,c:C.dim,alpha:P(b,0,.3)});text('라면으로도 못 메우는 선',760,430,{f:'D',s:96,c:C.gold,alpha:P(b,.2,.3),glow:'rgba(255,197,49,.4)'});
      seatGrid(420,560,30,9,{cols:10,cw:70,ch:62});drawMascot(1580,560,1.0,'think',{alpha:P(b,0,.3)});
    }else{
      const k9=L('o6'),k10=L('o7');
      text('PC방 차리기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:80,c:C.gold,alpha:P(k9,0,.3)});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['국세통계포털','콘텐츠진흥원 조사','언론 보도'].forEach((s,i)=>{const k=P(k10,.5+i*.4,.3);if(k>0)pill(s,480+i*480,760,{s:36,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('PC방 계산서',960,300,{f:'D',s:170,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3)});
    text('한 시간 1,000원, 누가 얼마를 가져가나',960,450,{s:56,w:900,alpha:P(a,.3,.3)});
    pcFront(700,760,.55,{alpha:P(a,.2,.3),ramen:1});drawMascot(1300,720,.85,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p2',()=>{pcFront(560,500,.85);
      if(L('p2')>=0){text('동네 PC방 자리',1380,340,{f:'D',s:56,c:C.gold});big('p2',0,1380,500,'60석',{f:'D',s:150});
        text('24시간 영업 · 예시 가정',1380,650,{s:38,w:900,c:C.dim,alpha:P(L('p2'),.8,.3)});}});
    sub('p3','p3',()=>{text('한 시간 기본 요금',960,220,{f:'D',s:60,c:C.gold});
      group(960,460,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-380,-140,760,280,30);ctx.fill();ctx.fillStyle=C.red;ctx.beginPath();ctx.arc(-320,0,26,0,7);ctx.fill();text('1,000원',30,4,{f:'D',s:170,c:C.ink});});
      const q=K('p3',0);if(q>=0)pill('20년 넘게 그대로 (업계 보도)',960,700,{s:44,alpha:P(q,0,.3),bg:C.gold,c:C.ink});
      srcLine('바이라인네트워크 2025.11.21 (PC방 시간당 1,000원 요금 20년 넘게 유지)');});
    sub('p4','p4',()=>{text('하루 평균 자리가 찬 비율 (예시)',960,200,{f:'D',s:56,c:C.gold});
      const q=K('p4',0),lit=q>=0?Math.round(18*E.out(P(q,0,.8))):0;seatGrid(300,300,60,lit,{cols:10,cw:72,ch:66});
      text(q>=0?'30%':'?',1460,420,{f:'D',s:160,c:q>=0?'#4fb6ff':C.gold});text('60석 중 18석',1460,560,{s:40,w:900,c:C.dim,alpha:q>=0?1:0});
      text('낮엔 비고 · 저녁 · 주말에 몰림',1460,640,{s:34,w:900,c:C.dim,alpha:P(L('p4'),2.5,.3)});});
    sub('p5','p5',()=>{text('한 달에 팔리는 PC 시간',960,200,{f:'D',s:60,c:C.gold});
      const parts=['60석','× 24시간','× 30%','× 30일'];parts.forEach((s,i)=>{const k=P(T,FR('p5',.12+i*.14),.3);if(k>0)popText(FR('p5',.12+i*.14),360+i*400,420,s,{f:'D',s:84});});
      const q=K('p5',0);if(q>=0)group(960,640,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('= 1만 2,960시간',0,0,{f:'D',s:120,c:'#4fb6ff',glow:'rgba(79,182,255,.4)'}));});
    sub('p6','p8',()=>{text('한 달 매출 (예시)',960,180,{f:'D',s:60,c:C.gold});
      const sc=.32,base=760,X=[460,960];const k1=E.out(P(K('p6',0),0,.6));
      if(K('p6',0)>=0){vCash(X[0]-150,base-1296*sc*k1,300,1296*sc*k1,'#4fb6ff');text('🖥️ PC 요금',X[0],base+44,{s:38,w:900});text('1,296만',X[0],base-1296*sc*k1-46,{f:'D',s:56,c:'#4fb6ff'});}
      const q7=K('p7',0);if(q7>=0){const k2=E.out(P(q7,0,.6));vCash(X[1]-150,base-900*sc*k2,300,900*sc*k2,C.orange);text('🍜 먹거리',X[1],base+44,{s:38,w:900});text('900만',X[1],base-900*sc*k2-46,{f:'D',s:56,c:C.orange});}
      if(L('p7')>=0)text('하루 50건 × 평균 6,000원',X[1],base+92,{s:30,w:900,c:C.dim,alpha:P(L('p7'),2,.3)});
      const p8=L('p8');if(p8>=0){group(1490,430,1,0,P(p8,0,.3),()=>{panel(-300,-150,600,300,{bd:C.gold,bg:'rgba(255,197,49,.1)',lw:5});text('월 매출',0,-70,{s:40,w:900,c:C.dim});text('2,196만',0,30,{f:'D',s:100,c:C.gold});});pill('세금 제외',1490,680,{s:36,alpha:P(p8,1,.3),bg:'rgba(255,255,255,.92)'});}});
    sub('p9','p9',lt=>{const k=E.out(P(lt,0,.5));group(460,460,lerp(1.2,.9,k),0,1-P(lt,1.4,.4),()=>{ctx.fillStyle='#d8e4f0';rr(-280,-130,560,260,20);ctx.fill();text('한 시간 1,000원',0,6,{f:'D',s:80,c:'#2a3f5a'});});
      if(lt>1.4){group(520,470,.85*E.out(P(lt,1.4,.6))+.001,0,1,()=>{for(let i=0;i<10;i++){const x=((i%5)-2)*136,y=(Math.floor(i/5)-.5)*140;coin100(x,y,56);text('100',x,y+2,{f:'D',s:34,c:'rgba(30,34,44,.75)'});}});}
      text('= 100원 동전 10개',1380,420,{f:'D',s:90,c:C.gold,alpha:P(lt,.8,.4)});text('한 시간 팔 때 들어오는 돈',1380,560,{s:44,w:900,alpha:P(lt,1.6,.4)});});
  }},
  /* ── 한 시간 1,000원 쪼개기 ── */
  coins:{draw(){
    const left=drawCoins(470,430,{});
    const hide=T>=CT('s11')&&T<KT('s11',0);const ln=Math.round(left);
    text('남은 돈',470,700,{s:32,w:900,c:C.dim});text(hide?'?':neg(ln)+'원',470,770,{f:'D',s:84,c:hide?C.gold:ln<0?C.red:ln<200?C.green:'#fff'});
    const PX=1000,CX=PX+420;
    sub('s1','s3',()=>{text('🎮 첫 번째: 게임 사용료',PX,210,{a:'left',f:'D',s:56,c:COK.game.col});
      text('PC방 → 게임 회사, 시간당 사용료',CX,330,{s:40,w:900,alpha:P(L('s2'),0,.3)});
      if(L('s3')>=0){text('손님 시간의 절반 × 시간당 250원 (예시)',CX,420,{s:36,w:900,c:C.dim,max:820});popText(KT('s3',0),CX,570,'125원',{f:'D',s:120,c:COK.game.col});}});
    sub('s4','s4',()=>{text('⚡ 두 번째: 전기',PX,210,{a:'left',f:'D',s:56,c:COK.elec.col});text('PC 60대 + 에어컨 · 한 달 200만 (예시)',CX,340,{s:38,w:900,max:820});text('200만 ÷ 1만 2,960시간',CX,420,{s:36,w:900,c:C.dim});popText(KT('s4',0),CX,570,'154원',{f:'D',s:120,c:COK.elec.col});
      srcLineR('참고: 한 PC방 6월 전기요금 154만 원 (뉴스토마토 2023.7.21 점주 인터뷰)');});
    sub('s5','s5',()=>{text('🏠 세 번째: 월세',PX,210,{a:'left',f:'D',s:56,c:COK.rent.col});text('한 달 400만 (예시)',CX,360,{s:42,w:900});text('400만 ÷ 1만 2,960시간',CX,440,{s:36,w:900,c:C.dim});popText(KT('s5',0),CX,590,'309원',{f:'D',s:120,c:COK.rent.col});});
    sub('s6','s6',()=>{text('🧑‍💼 네 번째: 인건비',PX,210,{a:'left',f:'D',s:56,c:COK.labor.col});text('알바 16시간 × 30일 × 10,320원',CX,330,{s:38,w:900,max:820});text('= 한 달 495만 (사장님 8시간은 무급)',CX,400,{s:34,w:900,c:C.dim,max:820});popText(KT('s6',0),CX,560,'382원',{f:'D',s:120,c:COK.labor.col});
      srcLineR('2026년 최저시급 10,320원 (최저임금위원회 고시)');});
    sub('s7','s7',()=>{text('여기까지 나간 돈',CX,240,{f:'D',s:56,c:C.dim});text('125 + 154 + 309 + 382 = 970원',CX,340,{f:'D',s:52,max:840});text('남은 돈',CX,460,{f:'D',s:56,c:C.green});big('s7',0,CX,590,'30원',{f:'D',s:150,c:C.green,glow:'rgba(53,224,138,.45)'});});
    sub('s8','s8',()=>{text('🖥️ 아직 남은 것: PC 값',PX,210,{a:'left',f:'D',s:56,c:COK.pc.col});text('200만 원 × 60대 ÷ 36개월',CX,330,{s:40,w:900});text('= 한 달 333만 (3년 쓰고 교체, 예시)',CX,400,{s:34,w:900,c:C.dim,max:820});popText(KT('s8',0),CX,550,'257원',{f:'D',s:120,c:COK.pc.col});
      if(K('s8',0)>.6)pill('동전이 모자란다',CX,690,{s:40,bg:C.red,c:'#fff',alpha:P(K('s8',0),.6,.3)});});
    sub('s9','s9',()=>{text('🧾 마지막: 기타',PX,210,{a:'left',f:'D',s:56,c:COK.etc.col});text('인터넷 · 관리 프로그램 · 청소 80만 (예시)',CX,360,{s:36,w:900,max:820});popText(KT('s9',0),CX,540,'62원',{f:'D',s:120,c:COK.etc.col});});
    sub('s10','s10',()=>{text('한 시간에 드는 돈',CX,220,{f:'D',s:60,c:C.gold});
      CO.forEach((s,i)=>{const y=310+i*58;text(s.ic+' '+s.name,PX+120,y,{a:'left',s:34,w:900,alpha:P(L('s10'),i*.12,.3)});text(won(s.v),PX+720,y,{a:'right',f:'D',s:40,c:s.col,alpha:P(L('s10'),i*.12,.3)});});
      ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(PX+100,660,640,4);big('s10',0,CX,730,'합계 1,289원',{f:'D',s:80,c:C.red,glow:'rgba(255,77,77,.4)'});});
    sub('s11','s11',()=>{text('PC 한 시간, 사장님 몫',CX,220,{f:'D',s:60,c:C.gold});
      const k=K('s11',0);if(k>=0){group(CX,450,lerp(1.6,1,E.out(P(k,0,.35))),0,P(k,0,.15),()=>text('−289원',0,0,{f:'D',s:200,c:C.red,glow:'rgba(255,77,77,.45)'}));stampBox('동전 3개 가까이 모자람',CX,680,k-.5,{s:52,c:C.red,bg:'rgba(40,0,0,.85)'});}
      else text('?',CX,450,{f:'D',s:280,c:C.gold,alpha:P(L('s11'),0,.3)});});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('×'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s.replace('=','')).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} × ${fmt(n2)} =`;bigS=(289*12960).toLocaleString('ko-KR');}else if(n2!==undefined){small=`${fmt(n1)} ×`;bigS=n2?fmt(n2):fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:done?96:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('PC 한 시간 적자 289원',1350,260,{f:'D',s:56,c:C.gold,alpha:P(a,.2,.3),max:900});text('× 한 달 1만 2,960시간',1350,360,{s:44,w:900,alpha:P(a,.4,.3)});
    if(dt>=0){const q=K('c2',0);
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{group(1350,520,lerp(1.6,1,E.out(P(Math.max(0,q),0,.3))),0,1,()=>text(q>=0?'= 한 달 374만 5,440원':'= ?',0,0,{f:'D',s:80,c:C.red,glow:'rgba(255,77,77,.45)',max:1000}));
        if(q>=0)text('PC에서만 한 달 약 375만 원 적자',1350,620,{s:40,w:900,alpha:P(q,.8,.3)});}
      const c3=L('c3');if(c3>=0){group(1350,760,1,0,P(c3,0,.3),()=>{panel(-470,-80,940,160,{bg:'rgba(6,13,32,1)',bd:'#4fb6ff',lw:5});text('자리가 비어서 생긴 적자이기도',0,-30,{s:36,w:900});text('자리가 더 차면 줄어든다 → 뒤에서 계산',0,32,{f:'D',s:44,c:'#4fb6ff',max:900});});}}
    if(dt>=0)group(1180,160,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 라면이 메운다 ── */
  food:{draw(){
    sub('f1','f1',()=>{pcFront(620,500,.8);text('어떻게 버틸까?',1420,480,{f:'D',s:96,c:C.gold});});
    sub('f2','f2',()=>{group(960,500,1,0,1,()=>{ctx.fillStyle='#5a3b2a';rr(-700,40,1400,200,20);ctx.fill();ctx.fillStyle='#7a5238';rr(-700,30,1400,40,10);ctx.fill();
        ['🍜','🥤','🍳','🍟','🌭'].forEach((e,i)=>{const k=E.back(P(L('f2'),.2+i*.15,.35));if(k>0)emoji(e,-520+i*260,-40,130,{sc:k});});
        text('카운터 뒤 주방',0,150,{f:'D',s:70,c:'#ffe9c9'});});});
    sub('f3','f3',()=>{text('먹거리 한 건 (예시)',960,190,{f:'D',s:60,c:C.gold});emoji('🍜',420,470,200);emoji('🥤',600,520,110);
      const rows=[['라면 + 음료 평균','6,000원','#fff'],['재료 · 용기 원가 40%','−2,400원',C.red]];rows.forEach(([l,v,col],i)=>{const k=P(L('f3'),.4+i*1.2,.3);text(l,1240,330+i*110,{a:'right',s:44,w:900,alpha:k});text(v,1290,330+i*110,{a:'left',f:'D',s:60,c:col,alpha:k});});
      ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(840,520,820,4);text('남는 돈',1240,610,{a:'right',s:44,w:900});const q=K('f3',0);if(q>=0)popText(KT('f3',0),1290,610,'3,600원',{a:'left',f:'D',s:90,c:C.green});else text('?',1340,610,{f:'D',s:90,c:C.gold});});
    sub('f4','f4',()=>{text('3,600원 ÷ PC 한 시간 적자 289원',960,190,{f:'D',s:60,c:C.gold});
      const q=K('f4',0),n=q>=0?12.5*E.out(P(q,0,1.2)):0;
      for(let i=0;i<13;i++){const x=300+(i%7)*200,y=380+Math.floor(i/7)*190,f=clamp(n-i);ctx.fillStyle='rgba(255,255,255,.1)';rr(x-70,y-50,140,90,10);ctx.fill();if(f>0){ctx.fillStyle='#4fb6ff';rr(x-70,y-50,140*f,90,10);ctx.fill();}ctx.fillStyle='#3b4466';ctx.fillRect(x-8,y+40,16,20);}
      text(q>=0?'= PC 12시간 반의 적자':'= ?',960,760,{f:'D',s:80,c:q>=0?C.green:C.gold});
      emoji('🍜',1700,560,120);});
    sub('f5','f6',()=>{text('한 달 남는 돈 (예시 가게)',960,170,{f:'D',s:56,c:C.gold});
      const y0=430,sc=.62,X=[300,780,1260];ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(220,y0-2,1500,4);text('0',200,y0,{a:'right',s:30,w:900,c:C.dim});
      const k1=E.out(P(L('f5'),0,.6));vCash(X[0],y0,300,375*sc*k1,C.red);text('PC −375만',X[0]+150,y0+375*sc+50,{f:'D',s:46,c:C.red,alpha:k1});
      const q5=K('f5',0);if(q5>=0){const k2=E.out(P(q5,0,.6));vCash(X[1],y0+375*sc-540*sc*k2,300,540*sc*k2,C.green);text('🍜 먹거리 +540만',X[1]+150,y0+375*sc-540*sc-46,{f:'D',s:44,c:C.green,alpha:k2});
        ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;line(X[0]+300,y0+375*sc,X[1],y0+375*sc);ctx.restore();}
      const q6=K('f6',0);if(q6>=0){const k3=E.out(P(q6,0,.6));vCash(X[2],y0-165*sc*k3,300,165*sc*k3,'#35E08A');text('+165만',X[2]+150,y0-165*sc-60,{f:'D',s:72,c:C.green,alpha:k3});text('남는 돈',X[2]+150,y0+50,{s:36,w:900});}});
    sub('f7','f7',()=>{text('매출 중 먹거리 비중',960,200,{f:'D',s:60,c:C.gold});
      text('오늘 예시 가게',560,370,{a:'right',s:40,w:900});hbar(600,370,1000,80,41,100,C.orange,'약 41%',{s:56,k:E.out(P(L('f7'),.3,.6))});
      if(T>FR('f7',.45)){text('26년 차 점주 가게',560,540,{a:'right',s:40,w:900});const k=E.out(P(T,FR('f7',.45),.6));ctx.fillStyle='rgba(255,255,255,.07)';rr(600,500,1000,80,26);ctx.fill();ctx.fillStyle=C.orange;rr(600,500,600*k,80,26);ctx.fill();ctx.fillStyle='rgba(255,159,67,.45)';rr(600+600*k,500,100*k,80,0);ctx.fill();text('60~70%',600+700*k+16,542,{a:'left',f:'D',s:56,c:C.orange,alpha:k});}
      text('(한 가게 사례)',960,680,{s:34,w:900,c:C.dim,alpha:P(T,FR('f7',.6),.3)});
      srcLine('뉴스토마토 2023.7.21 「1세대 PC방 사장의 한숨 “여긴 이제 식당”」 (점주 인터뷰, 한 가게 사례)');});
    sub('f8','f8',()=>{group(960,460,1,0,1,()=>{panel(-680,-200,1360,400,{bd:C.orange,bg:'rgba(255,159,67,.08)',lw:6});text('“여긴 이제 식당”',60,-20,{f:'D',s:130,c:'#ffe9c9'});text('26년 차 PC방 사장님 (보도)',60,120,{s:38,w:900,c:C.dim});emoji('🍜',-520,-20,150);});
      srcLine('뉴스토마토 2023.7.21 (점주 인터뷰)');});
    sub('f9','f9',()=>{text('사장님 시급 (예시)',960,190,{f:'D',s:60,c:C.gold});text('165만 ÷ (8시간 × 30일 = 240시간)',960,300,{f:'D',s:52});
      const q=K('f9',0);text('사장님',560,470,{a:'right',s:42,w:900});hbar(600,470,1000,80,6889,10320,C.red,q>=0?'약 6,900원':'?',{s:60,k:q>=0?E.out(P(q,0,.6)):0,lc:q>=0?C.red:C.gold});
      text('알바 (최저시급)',560,610,{a:'right',s:42,w:900,alpha:P(L('f9'),1,.3)});hbar(600,610,1000,80,10320,10320,'#4fb6ff','10,320원',{s:52,k:E.out(P(L('f9'),1,.6))});
      if(q>=0)drawMascot(1700,720,.45,'worry',{alpha:P(q,.6,.3)});});
  }},
  /* ── 본전 가동률 (반전) ── */
  be:{draw(){
    sub('b1','b1',()=>{seatGrid(360,300,30,0,{cols:10,cw:80,ch:72});text('자리가 몇 % 차야 본전?',960,740,{f:'D',s:90,c:C.gold});});
    const X0=260,SC=30,Y=520,px=p=>X0+p*SC; // 0~50%
    sub('b2','b6',()=>{
      text('손님과 상관없이 나가는 돈: 한 달 약 1,509만',960,170,{f:'D',s:50,c:C.gold,max:1800});
      text('월세 400 · 인건비 495 · 전기 200 · PC 333 · 기타 80 (예시)',960,240,{s:32,w:900,c:C.dim});
      // 눈금
      ctx.fillStyle='rgba(255,255,255,.1)';rr(px(0),Y-40,50*SC,80,20);ctx.fill();
      for(let p=0;p<=50;p+=10){text(p+'%',px(p),Y+80,{s:30,w:900,c:C.dim});ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(px(p)-1,Y-50,2,100);}
      const mark=(p,col,lab,y,k,al='center')=>{if(k<=0)return;ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=col;ctx.fillRect(px(p)-4,Y-90,8,180);ctx.restore();text(lab,px(p)+(al==='right'?14:0),y,{a:al,f:'D',s:46,c:col,alpha:k});};
      const q3=K('b3',0),q4=K('b4',0),q5=K('b5',0),q6=K('b6',0);
      if(L('b3')>=0)text('PC 요금만으로: 1,509만 ÷ (1,000 − 125원)',960,320,{s:34,w:900,alpha:L('b4')<0?1:0});
      mark(40,C.red,'PC만 40%',Y-130,q3>=0?P(q3,0,.3):0);
      mark(27,C.green,'먹거리 포함 27%',Y+150,q4>=0?P(q4,0,.3):0,'right');
      if(L('b4')>=0)text('먹거리 마진 한 시간 417원 더해 → 1,509만 ÷ 1,292원',960,320,{s:34,w:900,alpha:P(L('b4'),0,.3)});
      if(q5>=0||L('b5')>=0){const now=q6>=0?lerp(30,25,E.io(P(q6,0,1))):30;const k=P(L('b5'),0,.3);
        ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=q6>=0?C.red:'#4fb6ff';rr(px(0),Y-40,(now)*SC,80,20);ctx.fill();ctx.restore();
        group(px(now),Y-40,1,0,k,()=>{ctx.fillStyle=C.gold;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-22,-36);ctx.lineTo(22,-36);ctx.closePath();ctx.fill();});
        if(q6>=0)text('25%',px(now)-14,Y-130,{a:'right',f:'D',s:50,c:C.red,alpha:k});else text('지금 30%',px(30)+30,Y+150,{a:'left',f:'D',s:46,c:C.gold,alpha:k});
        if(q5>=0&&q6<0){ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.setLineDash([8,6]);rr(px(27),Y-48,3*SC,96,10);ctx.stroke();ctx.restore();pill('겨우 3%포인트',px(28.5),Y+240,{s:40,bg:C.gold,c:C.ink,alpha:P(q5,0,.3)});}
        if(q6>=0)group(1500,760,E.back(P(q6,.6,.4))+.001,0,1,()=>{panel(-300,-80,600,160,{bg:'rgba(40,0,0,.9)',bd:C.red,lw:5});text('한 달 약 −114만',0,4,{f:'D',s:60,c:C.red});});}
      srcLine('예시 계산 · 손님이 줄면 먹거리 주문도 같은 비율로 준다고 가정',872);});
    sub('b7','b7',()=>{text('빈자리 하나가',960,200,{f:'D',s:70,c:C.dim});
      group(560,480,1,0,P(L('b7'),.3,.3),()=>{panel(-320,-150,640,300,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:5});emoji('🖥️',0,-50,100);text('PC 요금 ↓',0,80,{f:'D',s:60,c:C.red});});
      group(1360,480,1,0,P(L('b7'),1,.3),()=>{panel(-320,-150,640,300,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:5});emoji('🍜',0,-50,100);text('라면 주문 ↓',0,80,{f:'D',s:60,c:C.red});});
      stampBox('두 번 아프다',960,740,L('b7')-2.5,{s:80,c:C.red,bg:'rgba(40,0,0,.85)'});});
  }},
  /* ── 줄어드는 PC방 ── */
  shrink:{draw(){
    sub('d1','d1',()=>{pcFront(620,500,.8);text('얼마나 남았을까?',1420,480,{f:'D',s:90,c:C.gold});});
    sub('d2','d5',()=>{text('전국 PC방 수 (국세통계포털)',960,170,{f:'D',s:56,c:C.gold});
      const base=760,sc=.04,bw=240;const D=[['2018.8',9459,KT('d2',0)],['2025.1',7205,KT('d3',0)],['2025.6',6999,FR('d3',.75)],['2026.1',6792,KT('d4',0)]];
      D.forEach(([l,v,t],i)=>{const x=330+i*340;ctx.fillStyle='rgba(255,255,255,.07)';rr(x-bw/2,base-9459*sc,bw,9459*sc,14);ctx.fill();if(T<t){text('?',x,base-150,{f:'D',s:70,c:C.gold});}else{const k=E.out(P(T,t,.6));vCash(x-bw/2,base-v*sc*k,bw,v*sc*k,i===3?C.red:'#4fb6ff');text(won(v)+'곳',x,base-v*sc-40,{f:'D',s:52,c:i===3?C.red:'#fff',alpha:k});}text(l,x,base+40,{s:34,w:900});});
      if(T>=FR('d3',.75)){ctx.save();ctx.setLineDash([12,8]);ctx.strokeStyle=C.gold;ctx.lineWidth=3;line(160,base-7000*sc,1660,base-7000*sc);ctx.restore();text('7,000곳',1680,base-7000*sc,{a:'left',s:28,w:900,c:C.gold});}
      if(L('d4')>=0)text('1년 새 −413곳',1350,base-6792*sc-110,{s:34,w:900,c:'#ffb3b3',alpha:P(K('d4',0),.8,.3)});
      const q=K('d5',0);if(q>=0)stampBox('7년여 사이 약 −28%',1200,250,q,{s:56,c:C.red,bg:'rgba(40,0,0,.85)'});
      srcLine('국세통계포털 (세계일보 2025.9.5 · 헤럴드경제 2026.3.20 인용) · 등록 기준, 실제 영업 수는 더 적을 수 있음');});
    sub('d6','d6',()=>{text('게임 이용률 (2025)',960,200,{f:'D',s:60,c:C.gold});
      text('📱 모바일',560,380,{a:'right',s:46,w:900});hbar(600,380,1000,90,89.1,100,C.green,'89.1%',{s:60,k:E.out(P(L('d6'),1,.6))});
      const q=K('d6',0);text('🖥️ PC',560,540,{a:'right',s:46,w:900});hbar(600,540,1000,90,58.1,100,'#4fb6ff',q>=0?'58.1%':'?',{s:60,k:q>=0?E.out(P(q,0,.6)):0,lc:q>=0?'#4fb6ff':C.gold});
      srcLine('한국콘텐츠진흥원 「2025 게임이용자 실태조사」 (헤럴드경제 2026.3.20 인용)');});
    sub('d7','d7',()=>{group(620,470,1,0,1,()=>{ctx.fillStyle='#2b3248';rr(-300,-120,600,240,18);ctx.fill();ctx.fillStyle='#151a2a';[-150,90].forEach(cx=>{ctx.beginPath();ctx.arc(cx,0,90,0,7);ctx.fill();ctx.strokeStyle='#4a5370';ctx.lineWidth=6;for(let i=0;i<6;i++){const a=i*Math.PI/3+T;line(cx,0,cx+Math.cos(a)*80,Math.sin(a)*80);}});ctx.fillStyle='#d4af37';ctx.fillRect(-280,120,420,24);text('그래픽카드',0,190,{f:'D',s:48,c:'#fff'});});
      text('한두 해 사이',1380,330,{f:'D',s:56,c:C.dim});text('최대 2배 가까이',1380,450,{f:'D',s:90,c:C.red,glow:'rgba(255,77,77,.4)',alpha:P(L('d7'),1,.3)});text('(업계 말 · 일부 최신 제품)',1380,560,{s:34,w:900,c:C.dim});
      pill('몇 년마다 PC를 바꿔야 하는 가게엔 큰 부담',960,760,{s:38,bg:'rgba(255,255,255,.92)',alpha:P(L('d7'),3.5,.3)});
      srcLine('헤럴드경제 2026.3.20 (업계 관계자 인용)');});
  }},
  /* ── 20년째 1,000원 ── */
  price:{draw(){
    sub('r1','r1',()=>{emoji('🏷️',700,480,240);text('요금을 올리면?',1300,480,{f:'D',s:100,c:C.gold});});
    sub('r2','r2',()=>{group(760,460,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-360,-140,720,280,30);ctx.fill();text('1,000원',20,4,{f:'D',s:160,c:C.ink});});
      emoji('🔒',1120,320,110,{alpha:P(L('r2'),1,.3)});text('20년 넘게',1420,440,{f:'D',s:80,c:C.gold,alpha:P(L('r2'),.6,.3)});text('경쟁 심한 곳은 1,000원 아래',1420,560,{s:40,w:900,c:'#ffb3b3',alpha:P(T,FR('r2',.6),.3)});
      srcLine('바이라인네트워크 2025.11.21');});
    sub('r3','r3',()=>{text('한 시간 1,000원 vs 알바 시급 10,320원',960,190,{f:'D',s:56,c:C.gold});
      const q=K('r3',0),n=q>=0?Math.min(10.32,10.32*P(T,KT('r3',0)+.2,2.4)):0;
      for(let i=0;i<11;i++){const f=clamp(n-i);if(f<=0)continue;emoji('🧑',260+i*140,420,100,{alpha:f>=1?1:.35+f*.4});text('1,000',260+i*140,510,{s:26,w:900,c:C.dim,alpha:f});}
      text(q>=0?'손님 열 명 × 한 시간 ≈ 알바 한 시간':'?',960,680,{f:'D',s:60,c:q>=0?'#fff':C.gold,alpha:q>=0?P(T,FR('r3',.6),.3):1,max:1700});});
    sub('r4','r5',()=>{text('한 게임 회사의 PC방 시간당 사용료',960,170,{f:'D',s:54,c:C.gold});
      const base=700,sc=1.4,bw=200;const B=[['이전',233,214,CT('r4')+.3,'#8e98ad'],['2025.12.3~',269,247,KT('r4',0),C.red]];
      B.forEach(([l,v,d,t,col],i)=>{const x=360+i*360;if(T<t){text('?',x,base-150,{f:'D',s:80,c:C.gold});}else{const k=E.out(P(T,t,.6));vCash(x-bw/2,base-v*sc*k,bw,v*sc*k,col);text('약 '+v+'원',x,base-v*sc-46,{f:'D',s:50,c:i?C.red:'#fff',alpha:k});text('할인 후 '+d+'원',x,base-90,{s:28,w:900,c:'#1d2433',alpha:k});}text(l,x,base+40,{s:34,w:900});});
      if(T>=KT('r4',0))text('+15%',540,base-330,{f:'D',s:60,c:C.red,alpha:P(K('r4',0),.6,.3)});
      if(L('r5')>=0){const q=K('r5',0),cx=1420,cy=450,r=200;ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();const k=q>=0?E.out(P(q,0,.8)):0;ctx.fillStyle=C.red;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*.247*k);ctx.closePath();ctx.fill();
        text('1,000원 중 247원',cx,cy+260,{f:'D',s:44});text(q>=0?'≈ 4분의 1':'?',cx,cy,{f:'D',s:q>=0?70:110,c:q>=0?'#fff':C.gold,st:10});}
      srcLine('바이라인네트워크 2025.11.21 (12월 3일 시행, 약 15년 만의 인상 · 할인 적용가 214 → 247원)');});
    sub('r6','r6',()=>{emoji('📢',620,460,220);group(1300,460,1,0,1,()=>{panel(-460,-140,920,280,{bd:C.gold,bg:'rgba(255,197,49,.08)',lw:5});text('PC방 업주 단체 기자회견',0,-40,{f:'D',s:60});text('사용료 인상에 항의 (2025.11.21)',0,50,{s:38,w:900,c:C.dim});});
      srcLine('바이라인네트워크 2025.11.21');});
    sub('r7','r7',()=>{group(560,460,1,0,1,()=>{panel(-330,-200,660,400,{bd:'rgba(255,255,255,.35)'});emoji('🔒',0,-70,120);text('요금',0,60,{f:'D',s:70});text('묶여 있다',0,140,{s:40,w:900,c:C.dim});});
      group(1360,460,1,0,P(L('r7'),.6,.3),()=>{panel(-330,-200,660,400,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:6});text('⬆',0,-70,{f:'D',s:120,c:C.red});text('빠져나가는 돈',0,60,{f:'D',s:66,c:C.red});text('사용료 · 부품값 · 시급',0,140,{s:36,w:900,c:'#ffb3b3'});});});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('하나씩만 바꿔 보면 (지금 한 달 165만)',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});if(T<CT('l2'))text('사장님이 바꿀 수 있는 숫자는?',960,500,{f:'D',s:96,alpha:P(a,.2,.3)});
    const rows=[['요금 1,000 → 1,200원','약 425만',425,C.green,'l2'],['먹거리 하루 50 → 60건','약 273만',273,C.green,'l3'],['PC 한 대 200 → 300만','약 −1만',-1,C.red,'l4'],['자리 30% → 25%','약 −114만',-114,C.red,'l5']];
    const Z=960,SCL=1.25;ctx.fillStyle='rgba(255,255,255,.35)';if(T>=CT('l2'))ctx.fillRect(Z-2,250,4,620-30);
    rows.forEach(([l,lab,v,col,id],i)=>{const t=CT(id);if(T<t-.1)return;const y=320+i*140,k=E.out(P(T,KT(id,0),.6));text(l,Z-40-(v<0?Math.abs(v)*SCL*k:0),y,{a:'right',s:38,w:900,max:640});
      if(T<KT(id,0)){text('?',Z+60,y,{f:'D',s:56,c:C.gold});return;}
      const w=Math.max(6,Math.abs(v)*SCL*k);ctx.fillStyle=col;rr(v<0?Z-w:Z,y-32,w,64,14);ctx.fill();
      if(v>=0)text(lab,Z+w+20,y+2,{a:'left',f:'D',s:46,c:col,alpha:k});else text(lab,Z+20,y+2,{a:'left',f:'D',s:46,c:col,alpha:k});});
    // 165만 기준선
    if(T>=CT('l2')){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=C.gold;ctx.lineWidth=3;line(Z+165*SCL,250,Z+165*SCL,840);ctx.restore();text('지금 165만',Z+165*SCL,240,{s:28,w:900,c:C.gold});}
    sub('l6','l6',()=>pill('사장님 손에 있는 건, 사실상 주방 하나',960,880-36,{s:38,bg:'rgba(255,255,255,.95)'}));
    if(L('l6')<0&&T>=CT('l2'))srcLine('예시 계산 · 한 번에 하나씩만 바꿈 · 요금 인상은 손님이 그대로라는 가정',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('y1'),ov=L('y7');
    text('PC방 차리기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:64,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['y2','한 시간 원가','(월세+인건비+전기+PC+기타) ÷ 팔리는 시간','오늘 가게: 1,289원'],['y3','본전 가동률','PC만 · 먹거리 포함 각각','오늘 가게: 40% · 27%'],['y4','먹거리 한 건 마진','한 건이 PC 몇 시간 적자를 메우나','3,600원 = 12시간 반'],
      ['y5','PC 교체 비용','다시 살 PC 값 ÷ 쓰는 달 수','200만 × 60 ÷ 36 = 333만'],['y6','게임 사용료','시간당 사용료 · 인상 소식','한 게임 233 → 269원']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:40,max:440});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-700,-240,1400,460,{bg:'rgba(6,13,32,1)',bd:C.gold});text('40석 · 사용료 뺀 비용 한 달 1,200만 원',0,-160,{f:'D',s:50,max:1300});
      text('1,200만 ÷ (1,000 − 125원)',0,-70,{f:'D',s:60,c:L('y7b')>=0?C.gold:'#fff'});const k=K('y7b',0);
      if(k>=0){text('= 1만 3,714시간',0,50,{f:'D',s:100,c:C.red,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});text('40석 × 24시간 × 30일 = 2만 8,800시간 중 약 48%',0,150,{s:36,w:900,alpha:P(k,1,.3)});}else text('?',0,60,{f:'D',s:120,c:C.gold});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('PC 한 시간 1,000원에 드는 돈',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      const X=160,Wd=1600,y=380,h=150,s=Wd/COST,k=E.out(P(L('z2'),0,4));let xx=X;
      CO.forEach((o,i)=>{const w=o.v*s,kk=clamp(k*CO.length-i);if(kk<=0){xx+=w;return;}ctx.fillStyle=o.col;rr(xx,y-h/2,Math.max(2,w*kk-3),h,10);ctx.fill();if(kk>.5){if(w>90)text(won(o.v),xx+w/2,y+2,{f:'D',s:46,c:'#101420',max:w-10});emoji(o.ic,xx+w/2,y-120,44);text(o.name,xx+w/2,y+110,{s:w>150?28:22,w:900,c:'rgba(255,255,255,.85)',max:w-8});}xx+=w;});
      const x1=X+1000*s;ctx.save();ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.globalAlpha*=P(L('z2'),.5,.4);ctx.strokeRect(X-6,y-h/2-10,1000*s+6,h+20);ctx.restore();
            const kn=P(L('z2'),5,.4);if(kn>0){ctx.save();ctx.globalAlpha*=kn;ctx.setLineDash([10,8]);ctx.strokeStyle=C.red;ctx.lineWidth=5;rr(x1,y-h/2-14,X+Wd-x1,h+28,10);ctx.stroke();ctx.restore();text('−289원 모자람',X+Wd,y+180,{a:'right',f:'D',s:44,c:C.red,alpha:kn});text('← 요금 1,000원',x1-10,y+180,{a:'right',s:30,w:900,alpha:kn});}
      const b=L('z2b');if(b>=0){emoji('🍜',520,740,130,{alpha:P(b,0,.3)});group(1180,740,1,0,P(b,.3,.3),()=>{ctx.fillStyle='#fff';rr(-460,-80,920,160,30);ctx.fill();text('라면과 음료가 메워서',0,-22,{s:38,w:900,c:C.ink});text('한 달 165만 원을 남긴다',0,38,{f:'D',s:50,c:'#1fa864'});});}
    }else{
      drawMascot(960,430,1.05,'think');
      stampBox('라면을 파는 식당',960,760,c,{s:70,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1480,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-330,-70,660,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 PC방 가면 꼭 시키는 메뉴는?',0,4,{s:34,w:900,c:C.ink,max:620});});
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
