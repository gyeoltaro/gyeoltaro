/* ════════════════════════════════════════════════════════════════════
   장면 (LF.06 배달 분식 계산서) — 수치·출처는 docs/longform-ep06.md
   중심 그림: 배달 주문 1만 8천 원 = 떡볶이 떡 18개(하나 1,000원). 가져가는 순서대로 떡이 물든다.
   마지막 '월세·인건비 몫'은 남은 떡을 다 먹고도 176원이 모자란다(사장님 몫 −176원).
   ════════════════════════════════════════════════════════════════════ */
const CO=[ // 가져가는 순서 (주문 1건, 원)
  {k:'food',name:'재료비',ic:'🌶️',v:6300,col:'#FF9F43'},
  {k:'pack',name:'포장',ic:'🥡',v:700,col:'#FFE066'},
  {k:'med',name:'중개수수료',ic:'📱',v:1404,col:'#B18CFF'},
  {k:'pay',name:'결제수수료',ic:'💳',v:432,col:'#6FD3FF'},
  {k:'dlv',name:'배달비',ic:'🛵',v:3400,col:'#FF6FA8'},
  {k:'fixed',name:'월세·인건비 몫',ic:'🏠',v:5764,col:'#8e98ad'}, // 실제 몫은 5,940원 → 176원 모자람
];
const COK=Object.fromEntries(CO.map(s=>[s.k,s]));
const SEQ=['5','2','3','6','×','4','0','0','='];   // 5,236 × 400 = 2,094,400 (0 개수 확인: 400 = 4·0·0)
const ORD=[[10000,44.2],[14000,34.5],[18000,29.1],[25000,23.8],[35000,19.9]]; // 주문 금액 → 배달앱·라이더 몫 비율(%) = (7.8%+2.4%)+3,400원
function coinT(k){return {food:KT('s2',0),pack:KT('s3',0),med:KT('s4',0),pay:KT('s5',0),dlv:KT('s6',0),fixed:KT('s10',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim});}
function srcLineR(s){srcLine(s,872,1340);}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
const neg=n=>(n<0?'−':'')+won(Math.abs(n));

/* 동네 분식집 외관 (상표 없음) */
function storeFront(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#3a2a2a';rr(-420,-300,840,560,18);ctx.fill();
    ctx.fillStyle='#e0242c';rr(-420,-300,840,100,14);ctx.fill();
    text('분식',0,-250,{f:'D',s:66,c:'#fff'});
    for(let i=0;i<12;i++){ctx.fillStyle=i%2?'#fff':'#e0242c';ctx.beginPath();ctx.moveTo(-420+i*70,-200);ctx.lineTo(-350+i*70,-200);ctx.lineTo(-385+i*70,-160);ctx.closePath();ctx.fill();}
    ctx.save();ctx.shadowColor='rgba(255,210,150,.5)';ctx.shadowBlur=40;ctx.fillStyle='#ffe9c9';rr(-390,-140,520,370,8);ctx.fill();ctx.restore();
    // 떡볶이 판
    ctx.fillStyle='#555';ctx.beginPath();ctx.ellipse(-130,40,200,70,0,0,7);ctx.fill();ctx.fillStyle='#d8321f';ctx.beginPath();ctx.ellipse(-130,32,180,56,0,0,7);ctx.fill();
    for(let i=0;i<9;i++){ctx.fillStyle='#fbeedd';rr(-270+i*30+(i%2)*8,10+(i%3)*14,26,12,6);ctx.fill();}
    text('떡볶이 · 튀김 · 순대',-130,-80,{f:'D',s:40,c:'#7a1f14'});
    // 문 + 배달 오토바이
    ctx.fillStyle='#2b3550';rr(200,-140,180,370,10);ctx.fill();ctx.fillStyle='rgba(180,220,255,.5)';rr(214,-124,152,200,6);ctx.fill();
    if(!o.noBike)emoji('🛵',300,330,110);
  });
}
/* 떡볶이 판 위 떡 18개 (6 × 3). 가져가는 순서대로 물든다. 반환값 = 남은 돈(원, 음수 가능) */
function drawCakes(cx,cy,o={}){
  const cols=6,cw=118,ch=84,x0=cx-cols*cw/2,y0=cy-1.5*ch;
  ctx.fillStyle='#3d3d44';ctx.beginPath();ctx.ellipse(cx,cy+8,cols*cw/2+70,1.5*ch+70,0,0,7);ctx.fill();
  ctx.fillStyle='#c8321f';ctx.beginPath();ctx.ellipse(cx,cy,cols*cw/2+46,1.5*ch+46,0,0,7);ctx.fill();
  let acc=0,taken=0;const ranges=[];
  CO.forEach(s=>{const n=s.v/1000,t=T-(o.full?-99:coinT(s.k)),f=t>=0?E.out(P(t,0,Math.min(1.4,.3+n*.12))):0;ranges.push([acc,acc+n*f,s.col]);taken+=(s.k==='fixed'?5940:s.v)*f;acc+=n;});
  for(let i=0;i<18;i++){const x=x0+(i%cols)*cw+10,y=y0+Math.floor(i/cols)*ch+14,w=cw-20,h=ch-28;
    ctx.fillStyle='#fbeedd';rr(x,y,w,h,h/2);ctx.fill();
    ranges.forEach(([a,b,col])=>{const s0=Math.max(a,i),s1=Math.min(b,i+1);if(s1<=s0)return;ctx.save();rr(x,y,w,h,h/2);ctx.clip();ctx.fillStyle=col;ctx.fillRect(x+(s0-i)*w,y,(s1-s0)*w,h);ctx.restore();});
    ctx.strokeStyle='rgba(90,20,10,.35)';ctx.lineWidth=3;rr(x,y,w,h,h/2);ctx.stroke();}
  return 18000-taken;
}
/* 주문 1만 8천 원 가로 막대 (구성) */
function orderBar(x,y,w,h,k=1){let xx=x;CO.forEach((s,i)=>{const ww=w*s.v/18000,kk=E.out(P(k,i*.1,.4));ctx.fillStyle=s.col;rr(xx,y-h/2,Math.max(2,ww*kk-3),h,10);ctx.fill();if(ww>110&&kk>.5)text(won(s.k==='fixed'?5940:s.v),xx+ww/2,y+2,{f:'D',s:h*.36,c:'#101420',max:ww-10});xx+=ww;});}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o3')){
      group(520,500,E.back(P(a,0,.4))*.9+.001,0,1,()=>drawCakes(0,0,{}));
      group(1420,300,lerp(1.6,1,E.out(P(a,.1,.3))),-.03,P(a,0,.15),()=>{panel(-330,-120,660,240,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('배달 주문 한 건',0,-60,{s:40,w:900,c:C.dim});text('18,000원',0,30,{f:'D',s:120,c:C.gold});});
      const b=L('o2');if(b>=0){text('🛵 배달앱 · 라이더 쪽으로',1420,520,{s:42,w:900,alpha:P(b,0,.3)});const k=K('o2',0);
        if(k>=0)group(1420,650,lerp(1.5,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text('5,236원',0,0,{f:'D',s:120,c:C.red,glow:'rgba(255,77,77,.4)'}));else text('?',1420,650,{f:'D',s:120,c:C.gold});
        if(k>=0)text('≈ 3분의 1',1420,780,{f:'D',s:56,c:'#fff',alpha:P(k,.6,.3)});}
    }else if(T<CT('o4')){
      const k=K('o3',0);
      text('월세 · 인건비까지 나누면',960,250,{f:'D',s:64,c:C.dim,alpha:P(L('o3'),0,.3)});text('이 주문 한 건, 사장님 몫',960,370,{f:'D',s:72,alpha:P(L('o3'),.3,.3)});
      if(k>=0)group(960,580,lerp(1.6,1,E.out(P(k,0,.35))),0,P(k,0,.15),()=>text('−176원',0,0,{f:'D',s:230,c:C.red,glow:'rgba(255,77,77,.5)'}));else text('?',960,580,{f:'D',s:230,c:C.gold});
      drawMascot(1620,640,.6,'shock',{alpha:P(k,0,.3)});
    }else if(T<CT('o5')){
      const b=L('o4'),k=K('o4',0);
      text('주문이 작을수록 더 떼인다',960,200,{f:'D',s:70,c:C.gold,alpha:P(b,0,.3)});
      group(560,520,1,0,P(b,.2,.3),()=>{panel(-330,-200,660,400,{bd:'rgba(255,255,255,.35)'});emoji('🍢',0,-80,130);text('떡볶이 1인분',0,50,{f:'D',s:60});text('10,000원 주문',0,130,{s:44,w:900,c:C.dim});});
      group(1360,520,1,0,P(b,.5,.3),()=>{panel(-330,-200,660,400,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:6});text('먼저 빠지는 돈',0,-120,{s:40,w:900,c:C.dim});
        if(k>=0)group(0,20,lerp(1.5,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text('44%',0,0,{f:'D',s:180,c:C.red,glow:'rgba(255,77,77,.5)'}));else text('?',0,20,{f:'D',s:180,c:C.gold});
        text('배달앱 · 라이더 쪽',0,140,{s:36,w:900,c:'rgba(255,255,255,.75)'});});
    }else if(T<CT('o6')){
      const b=L('o5');text('그런데도',700,300,{f:'D',s:80,c:C.dim,alpha:P(b,0,.3)});text('배달을 끊지 못한다',700,430,{f:'D',s:96,c:C.gold,alpha:P(b,.2,.3),glow:'rgba(255,197,49,.4)'});
      emoji('🛵',700,660,200,{alpha:P(b,.4,.3)});drawMascot(1500,560,1.1,'think',{alpha:P(b,0,.3)});
    }else{
      const k9=L('o6'),k10=L('o7');
      text('배달하기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:80,c:C.gold,alpha:P(k9,0,.3)});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['참여연대 보고서','중기부 조사','언론 보도'].forEach((s,i)=>{const k=P(k10,.5+i*.4,.3);if(k>0)pill(s,480+i*480,760,{s:36,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('배달 분식 계산서',960,300,{f:'D',s:160,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3)});
    text('주문 1만 8천 원, 누가 얼마를 가져가나',960,450,{s:56,w:900,alpha:P(a,.3,.3)});
    storeFront(700,760,.55,{alpha:P(a,.2,.3)});drawMascot(1300,720,.85,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p2',()=>{storeFront(560,500,.85);
      const q=K('p2',0);if(L('p2')>=0){text('동네 분식집 한 달 매출',1380,360,{f:'D',s:56,c:C.gold});if(q>=0)group(1380,520,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('2,000만 원',0,0,{f:'D',s:130}));else text('?',1380,520,{f:'D',s:130,c:C.gold});}
      text('(예시 가정)',1380,660,{s:36,w:900,c:C.dim,alpha:P(L('p2'),.8,.3)});});
    sub('p3','p3',()=>{text('배달앱 입점 가게, 매출 중 배달앱 비중',960,200,{f:'D',s:56,c:C.gold});
      const q=K('p3',0),k=q>=0?E.out(P(q,0,.8)):0;const cx=640,cy=520,r=230;
      ctx.lineWidth=70;ctx.strokeStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
      if(k>0){ctx.strokeStyle=C.pink;ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*.36*k);ctx.stroke();}
      text(q>=0?'36%':'?',cx,cy,{f:'D',s:120,c:q>=0?C.pink:C.gold});
      group(1340,520,1,0,P(L('p3'),.4,.3),()=>{panel(-380,-160,760,320,{bd:'rgba(255,255,255,.35)'});text('중소벤처기업부 조사',0,-80,{f:'D',s:48});text('배달앱 입점업체 808곳',0,0,{s:38,w:900,c:C.dim});text('2025년 상반기 월평균 매출 기준',0,70,{s:32,w:900,c:C.dim});});
      srcLine('중소벤처기업부 2025년 배달앱 입점업체 인식 조사 (2026.2.5 발표, 보도 인용)');});
    sub('p4','p5',()=>{text('2,000만 원 = 배달 36% + 가게 64%',960,200,{f:'D',s:60,c:C.gold});
      const k=E.out(P(L('p4'),0,.8));ctx.fillStyle=C.pink;rr(200,300,1520*.36*k,130,18);ctx.fill();ctx.fillStyle='#6FD3FF';const k2=E.out(P(L('p5'),0,.8));if(L('p5')>=0){rr(200+1520*.36,300,1520*.64*k2,130,18);ctx.fill();}
      text('🛵 배달 720만',200+1520*.18,365,{f:'D',s:48,c:'#1d2433',alpha:k});if(L('p5')>=0)text('🍽️ 가게 · 포장 1,280만',200+1520*.68,365,{f:'D',s:48,c:'#1d2433',alpha:k2});
      const q=K('p4',0);group(560,620,1,0,P(L('p4'),.8,.3),()=>{panel(-360,-110,720,220,{bd:C.pink,bg:'rgba(255,111,168,.08)',lw:5});text('주문 한 건 18,000원',0,-40,{f:'D',s:52});text(q>=0?'× 한 달 400건':'× ?',0,50,{f:'D',s:64,c:C.pink});});
      sub('p5','p5',()=>group(1360,620,1,0,1,()=>{panel(-360,-110,720,220,{bd:'#6FD3FF',bg:'rgba(111,211,255,.08)',lw:5});text('가게에서 먹거나',0,-40,{f:'D',s:52});text('들러서 포장',0,50,{f:'D',s:60,c:'#6FD3FF'});}));});
    sub('p6','p7',()=>{text('한 달 고정비 (예시)',960,200,{f:'D',s:60,c:C.gold});
      [['🏠','월세','180만'],['👩‍🍳','인건비','350만'],['🔥','전기 · 가스','70만'],['🧾','기타','60만']].forEach(([ic,l,v],i)=>{const k=E.back(P(L('p6'),.2+i*.7,.35));if(k>0)group(300+i*440,450,k,0,1,()=>{panel(-190,-160,380,320,{bd:'rgba(255,197,49,.6)'});emoji(ic,0,-60,100);text(l,0,40,{s:40,w:900});text(v,0,110,{f:'D',s:56,c:C.gold});});});
      const q=K('p6',0);if(q>=0)stampBox('= 한 달 660만 원',960,740,q,{s:66,c:C.red,bg:'rgba(40,0,0,.85)'});
      sub('p7','p7',()=>pill('세금 제외',1600,180,{s:36,bg:'rgba(255,255,255,.92)'}));});
    sub('p8','p8',lt=>{const k=E.out(P(lt,0,.5));group(460,480,lerp(1.2,.9,k),0,1-P(lt,1.4,.4),()=>{ctx.fillStyle='#d8e4f0';rr(-280,-130,560,260,20);ctx.fill();text('18,000원',0,6,{f:'D',s:110,c:'#2a3f5a'});});
      if(lt>1.4){group(520,480,.8*E.out(P(lt,1.4,.6))+.001,0,1,()=>drawCakes(0,0,{none:1}));}
      text('= 떡 18개',1360,420,{f:'D',s:96,c:C.gold,alpha:P(lt,.8,.4)});text('떡 하나 = 1,000원',1360,560,{f:'D',s:60,alpha:P(lt,1.6,.4)});});
  }},
  /* ── 1만 8천 원 쪼개기 ── */
  coins:{draw(){
    const left=drawCakes(470,440,{});
    const hide=T>=CT('s11')&&T<KT('s11',0);const ln=Math.round(left);
    text('남은 돈',470,730,{s:32,w:900,c:C.dim});text(hide?'?':neg(ln)+'원',470,800,{f:'D',s:84,c:hide?C.gold:ln<0?C.red:ln<6000?C.green:'#fff'});
    const PX=1000;
    sub('s1','s2',()=>{text('🌶️ 첫 번째: 재료비',PX,210,{a:'left',f:'D',s:56,c:COK.food.col});text('떡 · 어묵 · 튀김 · 순대 · 소스',PX+420,330,{s:40,w:900});text('매출의 35% (예시)',PX+420,410,{f:'D',s:52});popText(KT('s2',0),PX+420,560,'6,300원',{f:'D',s:110,c:COK.food.col});
      if(T>=KT('s2',0))text('떡 여섯 개 남짓',PX+420,680,{s:40,w:900,c:C.dim,alpha:P(T-KT('s2',0),.5,.3)});});
    sub('s3','s3',()=>{text('🥡 두 번째: 포장',PX,210,{a:'left',f:'D',s:56,c:COK.pack.col});text('그릇 · 뚜껑 · 봉투 · 젓가락',PX+420,360,{s:42,w:900});text('(예시)',PX+420,430,{s:34,w:900,c:C.dim});popText(KT('s3',0),PX+420,580,'700원',{f:'D',s:110,c:COK.pack.col});});
    sub('s4','s7',()=>{text('📱 세 번째부터: 배달앱',PX,210,{a:'left',f:'D',s:56,c:COK.med.col});
      const rows=[['중개수수료 7.8%','1,404원',KT('s4',0),COK.med.col],['결제수수료 약 2.4%','432원',KT('s5',0),COK.pay.col],['배달비 (사장님 부담)','3,400원',KT('s6',0),COK.dlv.col]];
      rows.forEach(([l,v,t,col],i)=>{const y=330+i*110;if(T<t-1.2)return;text(l,PX,y,{a:'left',s:40,w:900});if(T>=t)popText(t,PX+760,y,v,{a:'right',f:'D',s:60,c:col});});
      const q=K('s7',0);if(q>=0){ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(PX,640,780,4);group(PX+390,720,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('합계 5,236원',0,0,{f:'D',s:84,c:C.red,glow:'rgba(255,77,77,.4)'}));}
      if(L('s6')>=0&&L('s7')<0)pill('가장 큰 덩어리',PX+390,720,{s:40,bg:COK.dlv.col,c:'#1d2433'});
      srcLineR('중개수수료 7.8%: 배민 상생요금제 매출 상위 35% 구간 (2025.2.26 시행, 디지털데일리)');});
    sub('s8','s8',()=>{text('참여연대 분석 · 경기도 A분식집',PX,210,{a:'left',f:'D',s:48,c:C.gold});text('2025년 8월 배달앱 정산 기준',PX,280,{a:'left',s:34,w:900,c:C.dim});
      const segs=[['중개',7.80,COK.med.col],['결제',2.41,COK.pay.col],['배달비',16.17,COK.dlv.col]];let xx=PX;
      segs.forEach(([l,v,col],i)=>{const k=E.out(P(L('s8'),.4+i*.4,.5)),w=v*26;ctx.fillStyle=col;rr(xx,370,Math.max(4,w*k-4),120,12);ctx.fill();if(k>.6){text(l,xx+w/2,410,{s:w>120?32:24,w:900,c:'#1d2433',max:w-6});text(v.toFixed(2),xx+w/2,456,{f:'D',s:w>120?40:26,c:'#1d2433',max:w-6});}xx+=w;});
      const q=K('s8',0);text(q>=0?'총수수료 26.39%':'총수수료 ?',PX+340,600,{f:'D',s:80,c:q>=0?C.red:C.gold});
      text('배달비만 16%가 넘는다',PX+340,710,{s:40,w:900,c:'#ffb3b3',alpha:P(L('s8'),3.2,.3)});
      srcLineR('참여연대 「배달의민족 수수료 부담 실태」 2025.10.22 · 표1 A매장(경기도 분식집)');});
    sub('s9','s9',()=>{text('여기까지 남은 돈',PX+400,240,{f:'D',s:60,c:C.green});const q=K('s9',0);
      if(q>=0)group(PX+400,450,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('5,764원',0,0,{f:'D',s:170,c:C.green,glow:'rgba(53,224,138,.45)'}));else text('?',PX+400,450,{f:'D',s:170,c:C.gold});
      text('떡 다섯 개 반',PX+400,620,{s:44,w:900,c:C.dim});});
    sub('s10','s10',()=>{text('🏠 아직 남은 것: 월세 · 인건비',PX,210,{a:'left',f:'D',s:52,c:'#c7cfdf'});text('고정비 660만 ÷ 매출 2,000만 = 33%',PX+420,350,{f:'D',s:50,max:840});text('이 주문 18,000원 × 33%',PX+420,440,{s:40,w:900,c:C.dim});popText(KT('s10',0),PX+420,590,'5,940원',{f:'D',s:110,c:'#c7cfdf'});});
    sub('s11','s11',()=>{text('사장님 몫',PX+420,220,{f:'D',s:64,c:C.gold});
      const k=T-KT('s11',0);if(k>=0){group(PX+420,450,lerp(1.6,1,E.out(P(k,0,.35))),0,P(k,0,.15),()=>text('−176원',0,0,{f:'D',s:200,c:C.red,glow:'rgba(255,77,77,.45)'}));stampBox('떡이 하나도 안 남는다',PX+420,680,k-.5,{s:56,c:C.red,bg:'rgba(40,0,0,.85)'});}
      else text('?',PX+420,450,{f:'D',s:280,c:C.gold,alpha:P(L('s11'),0,.3)});});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('×'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s.replace('=','')).toLocaleString('ko-KR'):'';
    let small='',big='0';if(done){small=`${fmt(n1)} × ${fmt(n2)} =`;big=(5236*400).toLocaleString('ko-KR');}else if(n2!==undefined){small=`${fmt(n1)} ×`;big=n2?fmt(n2):fmt(n1);}else if(n1)big=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(big,225,-310,{a:'right',s:done?96:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('배달앱 · 라이더 쪽 한 건 5,236원',1350,260,{f:'D',s:54,c:C.gold,alpha:P(a,.2,.3),max:900});text('× 한 달 배달 400건',1350,360,{s:44,w:900,alpha:P(a,.4,.3)});
    if(dt>=0){const q=K('c2',0);
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{group(1350,520,lerp(1.6,1,E.out(P(Math.max(0,q),0,.3))),0,1,()=>text(q>=0?'= 한 달 209만 4,400원':'= ?',0,0,{f:'D',s:84,c:C.red,glow:'rgba(255,77,77,.45)',max:1000}));}
      const c3=L('c3');if(c3>=0){const r=K('c3',0);group(1350,720,1,0,P(c3,0,.3),()=>{panel(-470,-90,940,180,{bg:'rgba(6,13,32,1)',bd:C.green,lw:5});text('같은 18,000원을 가게에서 팔면',0,-36,{s:36,w:900});text(r>=0?'고정비 몫 내고도 +5,760원':'고정비 몫 내고도 ?',0,34,{f:'D',s:52,c:r>=0?C.green:C.gold});});}}
    if(dt>=0)group(1180,160,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 작은 주문 ── */
  small:{draw(){
    const a=L('m1');
    if(T<CT('m5')){
      text('주문 금액별 배달앱 · 라이더 쪽 몫 (중개 7.8% + 결제 2.4% + 배달비 3,400원)',960,170,{f:'D',s:40,c:C.gold,alpha:P(a,0,.3),max:1800});
      const base=780,sc=9,bw=230,X0=250;
      ORD.forEach(([o,p],i)=>{const x=X0+i*300,k=E.out(P(a,.3+i*.15,.6)),h=p*sc*k,hd=3400/o*100*sc*k;
        ctx.fillStyle='rgba(255,255,255,.08)';rr(x,base-420,bw,420,14);ctx.fill();
        ctx.fillStyle=COK.dlv.col;rr(x,base-hd,bw,hd,12);ctx.fill();ctx.fillStyle=COK.med.col;rr(x,base-h,bw,h-hd+2,12);ctx.fill();
        if(k>.5&&T<CT('m2'))text('배달비 3,400',x+bw/2,base-hd/2,{s:26,w:900,c:'#1d2433',max:bw-10});
        text(won(o)+'원',x+bw/2,base+40,{f:'D',s:40});
        const show=T>=CT('m2')&&(i===4?T>=KT('m3',0):i===2?T>=KT('m3',1):i===0?T>=KT('m4',0):T>=CT('m3')+1);
        if(show)popText(i===4?KT('m3',0):i===2?KT('m3',1):i===0?KT('m4',0):CT('m3')+1,x+bw/2,base-h-44,p.toFixed(1).replace('.0','')+'%',{f:'D',s:i===0?64:50,c:i===0?C.red:'#fff'});});
      if(L('m4')>=0)group(X0+bw/2+300,base-44.2*sc-60,E.back(P(K('m4',0),0,.4))+.001,0,1,()=>pill('떡볶이 1인분',0,0,{s:34,bg:C.red,c:'#fff'}));
    }else if(T<CT('m6')){
      text('1만 원 주문 한 건 (예시)',960,180,{f:'D',s:60,c:C.gold});
      const rows=[['재료비 35%','3,500'],['포장','700'],['배달앱 · 라이더 쪽','4,420']];rows.forEach(([l,v],i)=>{const k=P(L('m5'),.2+i*.5,.3);text(l,560,300+i*90,{a:'right',s:44,w:900,alpha:k});text('−'+v,620,300+i*90,{a:'left',f:'D',s:56,c:C.red,alpha:k});});
      text('= 1,380원',620,580,{a:'left',f:'D',s:72,c:C.green,alpha:P(L('m5'),1.8,.3)});
      group(1380,460,1,0,P(L('m5'),2.4,.3),()=>{panel(-380,-180,760,360,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:6});text('고정비 몫 33% = 3,300원',0,-100,{s:40,w:900});const q=K('m5',0);text(q>=0?'−1,920원':'?',0,30,{f:'D',s:140,c:q>=0?C.red:C.gold});text('받을수록 손해',0,130,{f:'D',s:44,c:'#ffb3b3',alpha:q>=0?P(q,.4,.3):0});});
    }else if(T<CT('m8')){
      text('참여연대 · A분식집 1만 5천~2만 원 주문',960,170,{f:'D',s:56,c:C.gold});
      const base=720,sc=13,yrs=[['2023',25.74,17.06],['2024',29.63,18.36],['2025',30.25,20.07]];
      yrs.forEach(([y,t,d],i)=>{const x=260+i*260,k=E.out(P(L('m6'),.2+i*.4,.6));ctx.fillStyle=COK.dlv.col;rr(x,base-d*sc*k,180,d*sc*k,12);ctx.fill();ctx.fillStyle=COK.med.col;rr(x,base-t*sc*k,180,(t-d)*sc*k+2,12);ctx.fill();
        text(y+'년 8월',x+90,base+40,{s:34,w:900});if(k>.6)text(t.toFixed(2)+'%',x+90,base-t*sc-40,{f:'D',s:50,c:i===2?C.red:'#fff'});});
      text('■ 배달비',280,base+100,{a:'left',s:28,w:900,c:COK.dlv.col});text('■ 중개 · 결제',480,base+100,{a:'left',s:28,w:900,c:COK.med.col});
      const m7=L('m7');if(m7>=0){const q=K('m7',0),cx=1450,cy=480,r=210,k=q>=0?E.out(P(q,0,.8)):0;
        ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.fillStyle=C.red;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*.58*k);ctx.fill();
        text(q>=0?'58%':'?',cx,cy,{f:'D',s:110,c:'#fff',st:10});text('전체 주문 건수 중 이 금액대',cx,cy+270,{s:34,w:900});text('(2025년 8월 178건 중 103건)',cx,cy+320,{s:28,w:900,c:C.dim});}
      srcLine('참여연대 2025.10.22 · 표2 (1만 5천~2만 원 미만 구간)');
    }else{
      sub('m8','m8',()=>{group(960,440,1,0,1,()=>{panel(-760,-200,1520,400,{bd:'rgba(255,255,255,.35)'});text('배달앱 회사의 반박',0,-120,{f:'D',s:56,c:C.gold});text('“조사 대상이 3곳뿐 · 휴가철 8월에 한정”',0,-20,{s:44,w:900});text('그래도 배달비는 주문 금액과 상관없이 붙는다',0,90,{f:'D',s:52,c:COK.dlv.col});});
        srcLine('참여연대 입장문 2025.10.23 (배달의민족 반박 내용 인용)');});
      sub('m9','m9',()=>{text('최소주문금액',960,220,{f:'D',s:70,c:C.gold});text('1만 3천 ~ 1만 5천 원 이상',960,400,{f:'D',s:110});text('“1만 원 주문은 받을수록 손해”',960,560,{s:48,w:900,c:'#ffb3b3',alpha:P(L('m9'),2,.3)});
        srcLine('점주 인터뷰 (뉴스토마토 2025.6.19)');});
      sub('m9b','m9b',()=>{group(960,430,1,0,1,()=>{panel(-760,-230,1520,460,{bd:C.green,bg:'rgba(53,224,138,.06)',lw:5});text('2025년 6월 배달앱 · 입점업주 중간 합의안',0,-150,{f:'D',s:52,c:C.green});text('1만 원 이하 주문: 중개수수료 0원',0,-50,{f:'D',s:60});text('1만 원 초과 ~ 1만 5천 원: 차등 지원',0,40,{s:44,w:900});text('“최소주문금액이 대부분 1만 원 넘어 효과 작다”',0,140,{s:40,w:900,c:'#ffb3b3',alpha:P(L('m9b'),3,.3)});});
        srcLine('뉴스토마토 2025.6.19 「1만원 이하 배달음식 드문데…중개이용료 인하 실효성 의문」');});
    }
  }},
  /* ── 못 끊는 이유 ── */
  fixed:{draw(){
    sub('f1','f1',()=>{emoji('🛵',700,480,240);text('✂️',980,480,{s:160});text('끊으면?',1400,480,{f:'D',s:120,c:C.gold});});
    sub('f2','f7',()=>{text('한 달 남는 돈 (예시 가게)',960,170,{f:'D',s:56,c:C.gold});
      const base=740,sc=.4,X=[340,860,1380];
      // 1) 고정비 막대
      const k0=E.out(P(L('f2'),.6,.6));vCash(X[0],base-660*sc*k0,300,660*sc*k0,'#8e98ad');text('고정비 660만',X[0]+150,base-660*sc*k0-46,{f:'D',s:46,c:'#c7cfdf',alpha:k0});text('끊어도 그대로',X[0]+150,base+44,{s:34,w:900});
      // 2) 지금: 가게 832 + 배달 230
      if(L('f3')>=0){const k1=E.out(P(L('f3'),0,.6)),q3=K('f3',0);vCash(X[1],base-832*sc*k1,300,832*sc*k1,'#6FD3FF');if(q3>=0){const kk=E.out(P(q3,0,.5));ctx.fillStyle=C.pink;rr(X[1],base-(832+230.6*kk)*sc,300,230.6*sc*kk,14);ctx.fill();text('배달 +230만',X[1]+150,base-(832+115)*sc,{f:'D',s:40,c:'#1d2433',alpha:kk});}
        text('가게 +832만',X[1]+150,base-416*sc,{f:'D',s:40,c:'#1d2433',alpha:k1});text('지금',X[1]+150,base+44,{s:34,w:900});
        const q4=K('f4',0);text(q4>=0?'남는 돈 402만':'남는 돈 ?',X[1]+150,base-1062.6*sc-46,{f:'D',s:48,c:q4>=0?C.green:C.gold,alpha:L('f4')>=0?1:0});}
      // 3) 배달 끊으면
      if(L('f5')>=0){const k2=E.out(P(L('f5'),0,.6)),q5=K('f5',0);vCash(X[2],base-832*sc*k2,300,832*sc*k2,'#6FD3FF');text('가게 +832만',X[2]+150,base-416*sc,{f:'D',s:40,c:'#1d2433',alpha:k2});text('배달 끊으면',X[2]+150,base+44,{s:34,w:900});
        text(q5>=0?'남는 돈 172만':'남는 돈 ?',X[2]+150,base-1062.6*sc-46,{f:'D',s:48,c:q5>=0?C.red:C.gold});
        ctx.save();ctx.setLineDash([12,8]);ctx.strokeStyle=C.pink;ctx.lineWidth=4;rr(X[2],base-1062.6*sc,300,230.6*sc,14);ctx.stroke();ctx.restore();if(q5>=0)text('−230만',X[2]+150,base-947*sc+4,{f:'D',s:44,c:C.pink,alpha:P(q5,.3,.3)});}
      const ln=y=>{ctx.save();ctx.setLineDash([16,10]);ctx.strokeStyle=C.gold;ctx.lineWidth=4;line(X[1]-30,y,X[2]+330,y);ctx.restore();};if(L('f4')>=0)ln(base-660*sc);
      if(L('f4')>=0)text('고정비 선',X[2]+340,base-660*sc,{a:'left',s:26,w:900,c:C.gold});
      sub('f6','f7',()=>pill('배달 = 월세 · 인건비를 나눠 내 주는 돈',960,860,{s:40,bg:'rgba(255,255,255,.92)'}));});
  }},
  /* ── 음식값 ── */
  price:{draw(){
    sub('r1','r1',()=>{emoji('🧾',700,480,240);text('결국 누가 낼까?',1300,480,{f:'D',s:100,c:C.gold});});
    sub('r2','r4',()=>{text('참여연대 보고서 속 분식집 메뉴판',960,180,{f:'D',s:56,c:C.gold});
      group(960,500,1,0,1,()=>{ctx.fillStyle='#f4f1e8';rr(-700,-240,1400,480,22);ctx.fill();
        text('2023년',-20,-180,{f:'D',s:44,c:'#6a6f7d'});text('2025년',330,-180,{f:'D',s:44,c:'#d62f2f'});
        const rows=[['돈가스',6000,8500,KT('r2',0)],['국수',6000,7500,CT('r3')+.3],['비빔밥',6500,8000,CT('r3')+1.6]];
        rows.forEach(([m,a,b,t],i)=>{const y=-80+i*110;text(m,-450,y,{f:'D',s:60,c:C.ink});text(won(a)+'원',-20,y,{f:'D',s:56,c:'#3a3f4d'});if(T>=t){popText(t,330,y,won(b)+'원',{f:'D',s:64,c:'#d62f2f'});text('+'+won(b-a),490,y,{a:'left',s:32,w:900,c:'#d62f2f',alpha:P(T-t,.3,.3)});}else text('?',330,y,{f:'D',s:56,c:'#b0b4c0'});});});
      sub('r4','r4',()=>pill('세 가게 모두 해마다 평균 1,000원 넘게 올렸다 (응답)',960,820,{s:38,bg:'rgba(255,255,255,.92)'}));
      srcLine('참여연대 2025.10.22 · 표3 A매장 음식 가격');});
    sub('r5','r5b',()=>{text('손님 쪽 계산 (A분식집 예시)',960,180,{f:'D',s:56,c:C.gold});
      group(560,480,1,0,1,()=>{panel(-340,-200,680,400,{bd:'rgba(255,255,255,.35)'});text('2023년',0,-130,{f:'D',s:52});text('배달비 3,000원',0,0,{f:'D',s:66});text('손님이 따로 낸다',0,100,{s:36,w:900,c:C.dim});});
      const q=K('r5b',0);if(L('r5b')>=0)group(1360,480,1,0,P(L('r5b'),.3,.3),()=>{panel(-340,-200,680,400,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:6});text('2025년 “무료 배달”',0,-130,{f:'D',s:48,c:C.gold});text('구독료 1,990원',0,-20,{f:'D',s:60});text(q>=0?'+ 오른 음식값 2,000원':'+ ?',0,80,{f:'D',s:56,c:C.red});});
      if(L('r5b')<0)text('배달비는 음식값 안으로',1360,480,{f:'D',s:66,c:C.gold,alpha:P(L('r5'),.5,.3)});
      srcLine('참여연대 2025.10.22 · 표4 소비자 배달비 변화');});
    sub('r6','r6',()=>{text('중개수수료 · 배달비 수준에 만족하는 가게',960,200,{f:'D',s:56,c:C.gold});
      const q=K('r6',0);for(let i=0;i<100;i++){const x=560+(i%20)*42,y=330+Math.floor(i/20)*70,on=q>=0&&i<28.3*E.out(P(q,0,.8));ctx.fillStyle=on?C.green:'rgba(255,255,255,.18)';ctx.beginPath();ctx.arc(x,y,16,0,7);ctx.fill();}
      text(q>=0?'28.3%':'?',300,500,{f:'D',s:120,c:q>=0?C.green:C.gold});text('100곳 중 28곳',300,620,{s:36,w:900,c:C.dim,alpha:q>=0?1:0});
      srcLine('중소벤처기업부 2025년 배달앱 입점업체 인식 조사 (808곳, 2026.2.5 발표)');});
  }},
  /* ── 적정선과 15% 상한 ── */
  rule:{draw(){
    sub('q1','q1',()=>{text('얼마가 적당할까?',960,440,{f:'D',s:120,c:C.gold});drawMascot(1600,640,.6,'think');});
    sub('q2','q3',()=>{text('지금 vs 가게들이 생각하는 적정선 (중기부 조사)',960,180,{f:'D',s:52,c:C.gold});
      const k=E.out(P(L('q2'),0,.6)),q=K('q2',0);text('중개수수료',360,340,{a:'right',s:40,w:900});hbar(400,320,900,60,8.2,9,COK.med.col,'평균 8.2%',{s:44,k});if(q>=0)hbar(400,400,900,60,4.5,9,C.green,'적정 4.5%',{s:44,k:E.out(P(q,0,.6))});
      if(L('q3')>=0){const k3=E.out(P(L('q3'),0,.6)),q3=K('q3',0);text('건당 배달비',360,580,{a:'right',s:40,w:900});hbar(400,560,900,60,3333,3700,COK.dlv.col,'평균 3,333원',{s:44,k:k3});if(q3>=0)hbar(400,640,900,60,2300,3700,C.green,'적정 2,300원',{s:44,k:E.out(P(q3,0,.6))});}
      srcLine('중소벤처기업부 2025년 배달 3사 체감도 조사 · 입점업체 인식 조사 (2026.2.5 발표, 매출 1위 앱 기준)');});
    sub('q4','q5b',()=>{text('우리 주문 18,000원을 적정선으로 다시 계산하면',960,180,{f:'D',s:52,c:C.gold});
      group(560,450,1,0,1,()=>{panel(-360,-170,720,340,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:5});text('지금',0,-100,{s:40,w:900,c:C.dim});text('5,236원',0,0,{f:'D',s:100,c:C.red});text('7.8% + 2.4% + 3,400원',0,100,{s:32,w:900,c:C.dim});});
      const q=K('q4',0);group(1360,450,1,0,P(L('q4'),.8,.3),()=>{panel(-360,-170,720,340,{bd:C.green,bg:'rgba(53,224,138,.08)',lw:5});text('적정선이면',0,-100,{s:40,w:900,c:C.dim});text(q>=0?'3,542원':'?',0,0,{f:'D',s:100,c:q>=0?C.green:C.gold});text('4.5% + 2.4% + 2,300원',0,100,{s:32,w:900,c:C.dim});});
      sub('q5','q5b',()=>{const q5=K('q5',0),qb=K('q5b',0);group(960,760,1,0,1,()=>{panel(-700,-80,1400,160,{bg:'rgba(6,13,32,1)',bd:C.green,lw:5});text('한 건 +1,694원 × 400건 =',-190,4,{f:'D',s:52});text(qb>=0?'1년 813만':(q5>=0?'한 달 +68만':'?'),430,4,{f:'D',s:66,c:C.green});});});});
    sub('q6','q8',()=>{text('국회 법안: 배달비 + 수수료 + 광고비 ≤ 주문 금액의 15%',960,180,{f:'D',s:48,c:C.gold,max:1800});
      const X=260,Wd=1400,y=420,k=E.out(P(L('q6'),.5,.6));ctx.fillStyle='rgba(255,255,255,.1)';rr(X,y-70,Wd,140,16);ctx.fill();
      text('2만 원 주문',X-20,y,{a:'right',s:36,w:900});
      const cap=X+Wd*.15;ctx.save();ctx.strokeStyle=C.green;ctx.lineWidth=6;ctx.globalAlpha*=k;line(cap,y-110,cap,y+110);ctx.restore();text('15% = 3,000원',cap,y-140,{f:'D',s:40,c:C.green,alpha:k});
      if(L('q7')>=0){const q=K('q7',0),k2=E.out(P(L('q7'),0,.8));ctx.fillStyle=COK.dlv.col;rr(X,y-70,Wd*.165*k2,140,16);ctx.fill();text('배달비 3,300원',X+Wd*.165+20,y-20,{a:'left',f:'D',s:44,c:COK.dlv.col,alpha:k2});if(q>=0)text('= 16.5%, 이미 넘는다',X+Wd*.165+20,y+40,{a:'left',f:'D',s:48,c:C.red,alpha:P(q,0,.3)});}
      sub('q8','q8',()=>{['배달비는 누가 내나?','라이더 보수는?','손님 부담은?'].forEach((s,i)=>{const k=E.back(P(L('q8'),.3+i*.4,.35));if(k>0)group(420+i*540,700,k,0,1,()=>pill(s,0,0,{s:40,bg:'rgba(255,255,255,.92)'}));});});
      srcLine('이코노미스트 2026.10.6 (배달플랫폼 거래 공정화 법률안 · 2만 원 주문 배달비 3,300원 = 16.5% 예시)');});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('사장님이 바꿀 수 있는 손잡이',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});if(T<CT('l2'))text('직접 바꿀 수 있는 숫자는?',960,500,{f:'D',s:100,alpha:P(a,.2,.3)});
    const rows=[['주문 크기 1만 → 1만 8천','떼이는 비율 44% → 29%',60,C.green,'l2'],['배달 100건 → 직접 포장','+52만 / 월',52,C.green,'l3'],['내 요금 구간 확인','중개 7.8% · 6.8% · 2%',40,'#B18CFF','l4'],['배달 비중 36% → 50%','402만 → 310만',-92,C.red,'l5']];
    rows.forEach(([l,lab,v,col,id],i)=>{const t=CT(id);if(T<t-.1)return;const y=310+i*150,k=E.out(P(T-t,.1,.6));text(l,600,y,{a:'right',s:38,w:900,max:560});ctx.fillStyle='rgba(255,255,255,.07)';rr(640,y-34,800,68,14);ctx.fill();const w=Math.abs(v)/100*800*k;ctx.fillStyle=col;rr(640,y-34,Math.max(6,w),68,14);ctx.fill();text(lab,640+Math.max(6,w)+20,y+2,{a:'left',f:'D',s:42,c:col,alpha:k,max:1860-(640+Math.max(6,w)+20)});});
    srcLine('예시 계산 · 포장 = 재료 6,300 + 용기 700만 빠진다고 가정 (가게에 직접 들러 결제)',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('y1'),ov=L('y7');
    text('배달하기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:64,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['y2','y2','주문 한 건 총수수료','(중개 + 결제 + 배달비) ÷ 주문 금액','18,000원 → 5,236원 = 29%'],['y3','y3','가장 많은 금액대','평균 말고 제일 많이 받는 금액','A분식집: 1만 5천~2만 원 58%'],['y4','y4','최소주문금액','그 주문이 고정비 몫까지 내나','1만 원 → −1,920원'],
      ['y5','y5','배달 비중','끊으면 얼마가 사라지나','오늘 가게: 402만 → 172만'],['y6','y6','내 요금 구간','정산서의 수수료율 · 건당 배달비','7.8% · 6.8% · 2%']];
    cards.forEach(([id,ex,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:40,max:440});text(f,-250,0,{a:'left',s:30,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(ex),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-700,-220,1400,420,{bg:'rgba(6,13,32,1)',bd:C.gold});text('25,000원 × (7.8% + 2.4%) + 배달비 3,400원',0,-130,{f:'D',s:54,max:1300});
      const k=K('y7b',0);text('= 2,550 + 3,400 =',0,-30,{f:'D',s:56,c:L('y7b')>=0?C.gold:'#fff'});if(k>=0)text('5,950원 (약 24%)',0,100,{f:'D',s:120,c:C.red,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,100,{f:'D',s:120,c:C.gold});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('배달 주문 18,000원',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      orderBar(160,380,1600,150,E.out(P(L('z2'),0,2.6)));
      let xx=160;CO.forEach((s,i)=>{const w=1600*s.v/18000,kk=P(L('z2'),i*.5,.4);if(kk>0){if(w>60)emoji(s.ic,xx+w/2,280,44,{alpha:kk});if(w>70)text(s.name,xx+w/2,490,{s:w>150?28:22,w:900,c:'rgba(255,255,255,.85)',alpha:kk,max:w-8});}xx+=w;});
      const kn=P(L('z2'),3,.4);if(kn>0){ctx.save();ctx.globalAlpha*=kn;ctx.setLineDash([10,8]);ctx.strokeStyle=C.red;ctx.lineWidth=4;rr(1760,305,16,150,6);ctx.stroke();ctx.restore();text('−176원 모자람',1760,560,{a:'right',f:'D',s:40,c:C.red,alpha:kn});}
      const b=L('z2b');if(b>=0){emoji('🛵',520,740,130,{alpha:P(b,0,.3)});group(1180,740,1,0,P(b,.3,.3),()=>{ctx.fillStyle='#fff';rr(-460,-80,920,160,30);ctx.fill();text('그래도 한 달 230만 원을 보태서',0,-22,{s:38,w:900,c:C.ink});text('가게는 402만 원을 남긴다',0,38,{f:'D',s:50,c:'#1fa864'});});}
    }else{
      drawMascot(960,430,1.05,'think');
      stampBox('월세를 같이 내 주는 장사',960,760,c,{s:64,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1480,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-330,-70,660,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 보통 얼마짜리 주문? 댓글로!',0,4,{s:34,w:900,c:C.ink,max:620});});
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
