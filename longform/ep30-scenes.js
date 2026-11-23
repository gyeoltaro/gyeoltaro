/* ════════════════════════════════════════════════════════════════════
   장면 (LF.30 동네 빵집 마감 할인 계산서 — 빵 +5.9%(국가데이터처 2026.10) · 기후에너지환경부 마감 할인 2026.6.15 · 한 앱 오후 8시 이후 정상가 20% 이상 · 음식물류 폐기물 연 약 500만 톤 · 예시 빵집 3,000원 × 110개 + 남는 10개 · 30% 할인 2,100원 = 하루 +2만 1,000원 · 옮겨 온 손님 한 명 −900원 · 본전 24명 · 할인 20/30/50/70% → 40/24/10/5명) — 수치·출처는 docs/longform-ep30.md
   중심 그림: 낮(해) 진열대와 밤 8시(달) 진열대 두 칸. 손님 머리가 낮에서 밤으로 하나씩 건너간다.
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['8','2','5','0','0','0','0','−','2','7','0','0','0','0','0','−','3','5','0','0','0','0','0','='];   // 8,250,000 − 2,700,000 − 3,500,000 = 2,050,000 (825 뒤 0 넷 · 27 뒤 0 다섯 · 35 뒤 0 다섯)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold,a:o.a});}
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433',max:460});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:30,w:900,c:'#3a4256',max:270});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433',max:180});});
});}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CIN='#4FD1C5', CFX='#B98CFF', CWS='#9aa3b8', CP='#35E08A', CR='#FF4D4D', CY='#FFC531', CBR='#E0A458', CNT='#6FA8FF';   // 재료 · 고정비 · 버린 빵 몫 · 남는 돈 · 손실 · 강조 · 빵 · 밤
/* 동네 빵집 가게 (상표 없음). o.night 밤 불빛 */
function bakery30(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,214,300,18,0,0,7);ctx.fill();
  ctx.fillStyle='#efe3cf';rr(-260,-130,520,340,12);ctx.fill();
  for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#fff4e0':'#c46a2b';ctx.beginPath();ctx.moveTo(-280+i*70,-150);ctx.lineTo(-210+i*70,-150);ctx.lineTo(-200+i*70,-90);ctx.lineTo(-270+i*70,-90);ctx.closePath();ctx.fill();}
  ctx.fillStyle='#3b2a20';rr(-190,-240,380,84,14);ctx.fill();text(o.sign||'동네 빵집',0,-196,{f:'D',s:46,c:'#ffe7b8',max:350});
  ctx.fillStyle=o.night?'#ffd98a':'#cfe8f5';rr(-230,-60,300,220,10);ctx.fill();
  // 진열대 두 칸 + 빵
  ctx.fillStyle='#8a5a3a';ctx.fillRect(-220,40,280,10);ctx.fillRect(-220,120,280,10);
  for(let i=0;i<5;i++){bread30(-190+i*56,18,.42);if(i<(o.left??5))bread30(-190+i*56,98,.42);}
  ctx.fillStyle='#7a4a2a';rr(110,10,110,200,8);ctx.fill();ctx.fillStyle='#ffd27a';ctx.beginPath();ctx.arc(130,110,7,0,7);ctx.fill();
});}
/* 빵 하나 (둥근 빵) */
function bread30(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle=o.dim?'#6b6f7a':CBR;ctx.beginPath();ctx.ellipse(0,0,58,40,0,0,7);ctx.fill();
  ctx.fillStyle=o.dim?'#878b96':'#f2c27e';ctx.beginPath();ctx.ellipse(-6,-12,40,20,0,0,7);ctx.fill();
  ctx.strokeStyle=o.dim?'#555':'#9b5a24';ctx.lineWidth=5;ctx.lineCap='round';for(let i=-1;i<=1;i++)line(-14+i*22,-22,-2+i*22,-2);
});}
/* 가격표 */
function tag30(x,y,s,txt,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{ctx.fillStyle=o.bg||'#fff';rr(-120,-50,240,100,14);ctx.fill();text(txt,0,4,{f:'D',s:o.fs||52,c:o.c||'#1d2433',max:220});if(o.strike){ctx.strokeStyle=CR;ctx.lineWidth=8;line(-100,10,100,-6);}});}
/* 시계 (h 시) */
function clock30(x,y,r,h,o={}){group(x,y,1,0,o.alpha??1,()=>{ctx.fillStyle=o.bg||'#fdf6e8';ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.strokeStyle='#3b2a20';ctx.lineWidth=r*.08;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.stroke();
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ctx.lineWidth=r*.04;line(Math.sin(a)*r*.8,-Math.cos(a)*r*.8,Math.sin(a)*r*.9,-Math.cos(a)*r*.9);}
  const ah=(h%12)/12*Math.PI*2;ctx.strokeStyle='#1d2433';ctx.lineCap='round';ctx.lineWidth=r*.09;line(0,0,Math.sin(ah)*r*.5,-Math.cos(ah)*r*.5);ctx.lineWidth=r*.06;line(0,0,0,-r*.75);
  ctx.fillStyle=CR;ctx.beginPath();ctx.arc(0,0,r*.07,0,7);ctx.fill();});}
/* 휴대폰 마감 할인 화면 (상표 없음) */
function phone30(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='#1b1f2b';rr(-150,-290,300,580,40);ctx.fill();ctx.fillStyle='#f6f7fb';rr(-130,-250,260,500,20);ctx.fill();
  ctx.fillStyle='#e65f2b';rr(-130,-250,260,70,20);ctx.fill();ctx.fillRect(-130,-205,260,25);text('마감 할인',0,-212,{f:'D',s:34,c:'#fff'});
  for(let i=0;i<3;i++){const yy=-130+i*120;ctx.fillStyle='#fff';rr(-115,yy-50,230,100,12);ctx.fill();bread30(-70,yy,.5);text(['빵','도시락','빵'][i],-20,yy-18,{a:'left',s:24,w:900,c:'#3a4256'});text(o.pct||'20%↓',105,yy+22,{a:'right',f:'D',s:30,c:'#e0342c'});}
});}
/* 사람 한 명 */
function head30(x,y,s,col){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-10*s,7*s,0,7);ctx.fill();rr(x-8*s,y-2*s,16*s,14*s,5*s);ctx.fill();}
/* 100원 동전 하나를 구간 색으로 나눠 칠한다 (v0~v1 원 범위) */
function coinSeg30(x,y,r,v0,segs){ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  segs.forEach(([a,b,col,k])=>{const lo=Math.max(a,v0),hi=Math.min(b,v0+100);if(hi<=lo||k<=0)return;const x0=x-r+(lo-v0)/100*2*r,ww=(hi-lo)/100*2*r*k;ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.clip();ctx.fillStyle=col;ctx.fillRect(x0,y-r,ww,2*r);ctx.restore();});
  ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r*.78,0,7);ctx.stroke();text('100',x,y+3,{f:'D',s:r*.5,c:'rgba(255,255,255,.55)'});}
/* 해 · 달 */
function sun30(x,y,r){ctx.fillStyle='#FFC531';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.strokeStyle='#FFC531';ctx.lineWidth=6;for(let i=0;i<8;i++){const a=i/8*Math.PI*2;line(x+Math.cos(a)*r*1.3,y+Math.sin(a)*r*1.3,x+Math.cos(a)*r*1.7,y+Math.sin(a)*r*1.7);}}
function moon30(x,y,r){ctx.fillStyle='#ffe9a8';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.fillStyle='#0b1226';ctx.beginPath();ctx.arc(x+r*.45,y-r*.25,r*.85,0,7);ctx.fill();}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3')){
      const a=L('o1');
      bakery30(440,480,1.0*E.back(P(a,0,.5))+.001,{night:true,left:5});
      text('그림은 예시 · 실제 가게 아님',440,790,{s:26,w:800,c:C.dim,alpha:P(a,.4,.3)});
      clock30(1000,250,90,8,{alpha:P(a,.2,.3)});text('밤 8시',1000,385,{f:'D',s:40,c:C.gold,alpha:P(a,.2,.3)});
      // 남은 빵 열 개
      for(let i=0;i<10;i++){const k=E.back(P(a,.4+i*.06,.3));if(k<=0)continue;bread30(1180+(i%5)*130,210+Math.floor(i/5)*110,.9*k);}
      const q=K('o1',0);
      if(q>=0){tag30(1250,500,1,'3,000원',{strike:true,alpha:P(q,0,.2)});group(1590,500,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>{tag30(0,0,1,'2,100원',{bg:'#e0342c',c:'#fff'});});}
      if(L('o2')>=0)group(1420,690,1,0,P(L('o2'),0,.3),()=>{panel(-420,-90,840,180,{bd:CP,bg:'rgba(6,13,32,.9)'});text('버릴 빵 열 개 → 하루',-380,4,{a:'left',f:'D',s:36,c:C.dim});});
      if(L('o2')>=0)big('o2',0,1600,694,'+2만 1,000원',{f:'D',s:60,c:CP});
      srcLine('예시 계산 (python3): 3,000 × 0.7 = 2,100 · × 10개 = 21,000 · × 25일 = 525,000 · 빵집 장면·숫자는 예시 가정');
    }else if(T<CT('o3c')){
      const b=L('o3');
      // 낮 → 밤 8시로 옮겨 가는 손님
      group(480,420,1,0,P(b,0,.3),()=>{panel(-330,-230,660,460,{bd:CY,bg:'rgba(6,13,32,.7)'});sun30(-200,-130,40);text('낮 · 3,000원',60,-130,{f:'D',s:44,c:CY});});
      group(1440,420,1,0,P(b,.2,.3),()=>{panel(-330,-230,660,460,{bd:CNT,bg:'rgba(6,13,32,.7)'});moon30(-200,-130,40);text('밤 8시 · 2,100원',60,-130,{f:'D',s:44,c:CNT});});
      for(let i=0;i<24;i++){const t0=CT('o3')+.8+i*.12,k=E.io(P(T,t0,1.0)),c2=i%8,r=Math.floor(i/8);const x0=230+c2*72,x1=1190+c2*72,y=450+r*88;if(T<t0){head30(x0,y,3.4,'#ffd27a');continue;}head30(lerp(x0,x1,k),y-Math.sin(k*Math.PI)*60,3.4,'#ffd27a');}
      if(K('o3',0)>=0&&L('o3b')<0)stampBox('24명이면 · 할인으로 번 돈 0원',960,760,K('o3',0),{s:60,c:CR,bg:'rgba(40,0,0,.92)'});
      if(L('o3b')>=0)stampBox('할인이 클수록 · 그 숫자는 더 작다',960,760,K('o3b',0)>=0?K('o3b',0):L('o3b'),{s:56,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('예시 계산 (python3): 손님 한 명이 옮기면 3,000 − 2,100 = 900원 · 21,000 ÷ 900 = 23.3 → 24명');
    }else{
      const k0=L('o3c'),k9=L('o4'),k10=L('o5');
      if(k9<0){bakery30(560,500,.9,{night:true,alpha:P(k0,0,.3)});clock30(1100,420,120,8,{alpha:P(k0,.2,.3)});drawMascot(1550,520,.75,'think',{alpha:P(k0,.3,.3)});}
      else{
      text('마감 할인 전, 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['마감 할인 · 정부 발표·보도','빵값 · 국가데이터처','판매량 · 비용 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.6,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});}
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('동네 빵집 마감 할인 계산서',960,200,{f:'D',s:104,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('빵 하나 3,000원 · 밤 8시 30% · 남은 빵 열 개',960,325,{s:44,w:900,alpha:P(a,.3,.3),max:1780});
    bakery30(560,640,.68,{night:true,alpha:P(a,.2,.3)});clock30(1080,620,110,8,{alpha:P(a,.3,.3)});drawMascot(1550,660,.7,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 마감 할인이 생겼다 ── */
  news:{draw(){
    sub('p1','p2',()=>{
      text('빵값 · 1년 전보다 (2026년 10월)',960,180,{f:'D',s:52,c:C.gold});
      const X0=560,WW=1000,MX=7.5,q=K('p2',0);
      text('가공식품 전체',X0-30,360,{a:'right',f:'D',s:40,c:'#c9ced9'});hbar(X0,360,WW,90,L('p2')>=0?2.9*E.out(P(FR('p2',.6)<T?T-FR('p2',.6):0,0,.6)):0,MX,CNT,T>FR('p2',.6)+.5?'+2.9%':'',{s:48});
      text('빵',X0-30,520,{a:'right',f:'D',s:48,c:CBR});hbar(X0,520,WW,90,q>=0?5.9*E.out(P(q,0,.6)):0,MX,CBR,q>=0?'+5.9%':'?',{s:56,lc:q>=0?CBR:C.gold});
      bread30(320,700,1.2,{alpha:P(L('p1'),0,.3)});
      if(T>FR('p2',.85))pill('손님도 싼 빵을 찾는다',1100,720,{s:34,bg:'rgba(255,255,255,.94)'});
      srcLine('국가데이터처 2026년 10월 소비자물가동향 (정책브리핑 2026.11.3 브리핑 · 새턴경제 2026.11.3: 빵 5.9%, 가공식품 2.9% — 전년 동월 대비)');});
    sub('p3','p3b',()=>{
      phone30(420,480,1.15,{});
      const q=K('p3',0);
      group(1240,300,1,0,P(L('p3'),0,.3),()=>{panel(-560,-110,1120,220,{bg:'rgba(6,13,32,1)',bd:C.gold});text('2026년 6월 15일 시작 · 기후에너지환경부 + 배달앱',0,-45,{f:'D',s:36,c:C.dim,max:1060});text(q>=0?'미판매 식품 마감 할인':'?',0,40,{f:'D',s:60,c:q>=0?C.gold:C.gold,max:1060});});
      if(T>FR('p3b',.15))group(1240,520,1,0,P(T,FR('p3b',.15),.3),()=>{panel(-560,-70,1120,140,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.35)'});text('그날 안 팔린 빵 · 소비기한이 가까운 음식',0,4,{f:'D',s:40,max:1060});});
      if(L('p3b')>=0){const k=K('p3b',0);group(1240,720,1,0,P(L('p3b'),.6,.3),()=>{panel(-560,-80,1120,160,{bg:'rgba(40,0,0,.9)',bd:CR});text('음식물류 폐기물 · 해마다',-520,4,{a:'left',f:'D',s:38,c:C.dim});text(k>=0?'약 500만 톤':'?',520,4,{a:'right',f:'D',s:62,c:k>=0?CR:C.gold});});}
      srcLine('뉴스1·아주경제 2026.6.14 (기후에너지환경부: 6월 15일부터 미판매 식품 마감할인 서비스 · 매년 약 500만 t 음식물류 폐기물 발생)');});
    sub('p4','p4',()=>{
      text('마감 할인은 몇 시부터? (보도 기준)',960,180,{f:'D',s:52,c:C.gold});
      const X0=520,X1=1780,H0=18,H1=24,hx=h=>X0+(h-H0)/(H1-H0)*(X1-X0);
      for(let h=18;h<=24;h++){text(h+'시',hx(h),330,{f:'D',s:32,c:'#c9ced9'});ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=2;line(hx(h),360,hx(h),760);}
      const rows=[['한 앱',20,23,'정상가보다 20% 이상 · 매장 마감까지',CY,CT('p4')+.2],['다른 앱',21,23,'밤 9시 이후 · 20% 이상',CNT,FR('p4',.62)],['또 다른 앱',18,24,'저녁 6시 ~ 자정',CP,FR('p4',.8)]];
      rows.forEach(([l,a,b,d,col,t0],i)=>{const y=430+i*130;text(l,X0-30,y,{a:'right',f:'D',s:38,c:col});if(T<t0)return;const k=E.out(P(T,t0,.5));ctx.fillStyle=col;rr(hx(a),y-34,(hx(b)-hx(a))*k,68,20);ctx.fill();if(k>.9)text(d,hx(a)+18,y+2,{a:'left',f:'D',s:30,c:'#1d2433',max:hx(b)-hx(a)-30});if(b===23)text('…',hx(b)+30,y,{f:'D',s:40,c:col});});
      const q=K('p4',0);if(q>=0)stampBox('오후 8시',hx(20),790,q,{s:52,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('뉴시스 2026.6.16 (한 앱: 오후 8시 이후 ~ 매장 마감, 정상가 대비 20% 이상, 서울·인천·광주·세종 시범 · 다른 앱: 오후 9시 이후 · 또 다른 앱: 오후 6시 ~ 자정) · 더위드카 2026.6.16');});
  }},
  /* ── 예시 빵집 ── */
  setup:{draw(){
    sub('p5','p6',()=>{
      bakery30(400,480,.9,{});
      text('예시 빵집',1240,190,{f:'D',s:50,c:C.gold});
      const q=K('p5',0);
      bread30(900,330,1.3);text(q>=0?'빵 하나 3,000원':'빵 하나 ?',1040,310,{a:'left',f:'D',s:56,c:q>=0?CBR:C.gold});
      if(T>FR('p5',.6))text('재료비 900원',1040,380,{a:'left',f:'D',s:40,c:CIN});
      // 하루 120개
      if(T>FR('p5',.8)){const t0=FR('p5',.8),k6=K('p6',0);
        for(let i=0;i<120;i++){const r=Math.floor(i/20),c2=i%20,k=P(T,t0+i*.008,.2);if(k<=0)continue;const left=i>=110;bread30(860+c2*50,480+r*52,.36,{alpha:k,dim:left&&k6>=0});}
        text('하루 120개',860,450,{a:'left',f:'D',s:34,c:C.dim});
        if(k6>=0){text('정가로 110개',860,820,{a:'left',f:'D',s:34,c:CBR});text('남는 10개 → 버림',1830,820,{a:'right',f:'D',s:34,c:CWS});}}
      srcLine('빵값·재료비·굽는 개수·남는 개수는 예시 가정 · 실제 빵집은 빵마다 값과 재료비가 다르다');});
    sub('p7','p8',()=>{
      const q7=K('p7',0),q8=K('p8',0);
      const rows=[['매출 110 × 3,000 × 25',q7>=0?'825만':'?',q7>=0?'#1a7a44':null],['재료비 120 × 900 × 25',T>FR('p7',.6)?'270만':'?']];
      receipt(520,450,1,rows,{title:'한 달 (25일)'});
      if(L('p8')>=0){const r2=[['월세','150만',null,.08],['전기·가스','70만',null,.25],['알바비','130만',null,.45]].filter(r=>T>FR('p8',r[3])).map(r=>[r[0],r[1]]);r2.push(['= 고정비',q8>=0?'350만':'?','#d62f2f']);receipt(1340,450,1,r2,{title:'한 달 나가는 돈'});}
      if(T>FR('p8',.8))pill('카드 수수료·세금은 빼고 본다',1340,800,{s:30,bg:'rgba(255,255,255,.92)'});
      srcLine('110 × 3,000 × 25 = 8,250,000 · 120 × 900 × 25 = 2,700,000 · 150 + 70 + 130 = 350만 (python3) · 전부 예시 가정');});
  }},
  /* ── 3,000원 쪼개기 (100원 동전 서른 개) ── */
  cut:{draw(){
    text('빵 하나 3,000원 = 100원 동전 서른 개',960,180,{f:'D',s:52,c:C.gold,max:1800});
    const k1=L('s1');
    const segs=[[0,900,CIN,FR('s2',.05)],[900,2172.7,CFX,FR('s2',.45)],[2172.7,2254.5,CWS,KT('s3',0)],[2254.5,3000,CP,KT('s4',0)]].map(([a,b,col,t0])=>[a,b,col,L('s2')<0||T<t0?0:E.out(P(T,t0,.6))]);
    for(let i=0;i<30;i++){const r=Math.floor(i/10),c2=i%10,k=E.back(P(k1,.1+i*.03,.3));if(k<=0)continue;group(330+c2*140,290+r*125,Math.min(1,k),0,1,()=>coinSeg30(0,0,54,i*100,segs));}
    const leg=[['재료비','900원',CIN,0],['고정비 몫','1,273원',CFX,1],['버린 빵 몫','82원',CWS,2],['남는 돈','745원',CP,3]];
    leg.forEach(([l,v,col,i])=>{if(segs[i][3]<=0)return;const x=240+i*440;group(x+180,760,1,0,Math.min(1,segs[i][3]*2),()=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(-150,0,22,0,7);ctx.fill();text(l,-115,-18,{a:'left',f:'D',s:30,c:col});text(v,-115,26,{a:'left',f:'D',s:40,c:'#fff'});});});
    if(K('s3',0)>=0&&L('s4')<0)stampBox('동전 한 개도 안 된다',1500,640,K('s3',0),{s:44,c:CWS,bg:'rgba(20,20,30,.92)'});
    if(K('s4',0)>=0)stampBox('일곱 개 반',1560,640,K('s4',0),{s:50,c:CP,bg:'rgba(0,40,20,.92)'});
    srcLine('고정비 350만 ÷ 팔린 빵 2,750개 = 1,273 · 버린 빵 재료비 10 × 900 ÷ 110 = 82 · 남는 돈 205만 ÷ 2,750 = 745 · 합 3,000 (python3) · 예시 가정');
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='8,250,000 − 2,700,000 − 3,500,000 =';bigS='2,050,000';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:22,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:done?84:76,f:'D',c:done?'#1a7a44':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('매출 − 재료비 − 고정비',1320,180,{f:'D',s:44,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0),X0=920,WW=760,MX=900;
    [['매출',825,'825만',CP,CT('c2')],['재료비',270,'270만',CIN,FR('c2',.25)],['고정비',350,'350만',CFX,FR('c2',.45)]].forEach(([l,v,lb,col,t0],i)=>{const y=290+i*100;if(L('c2')<0)return;const k=E.out(P(T,t0,.5));text(l,X0,y-40,{a:'left',f:'D',s:28,c:C.dim});hbar(X0,y,WW,48,v*k,MX,col,T>t0?lb:'',{s:36});});
    text('한 달 남는 돈',X0,600,{a:'left',f:'D',s:38});hbar(X0,660,WW,70,q2>=0?205*E.out(P(q2,0,.6)):0,MX,CP,q2>=0?'205만 원':'?',{s:46,lc:q2>=0?CP:C.gold});
    if(dt>=0&&q2<0)group(1300,650,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(T>FR('c2',.85)&&L('c3')<0)pill('하루 8만 2,000원',1320,780,{s:34,bg:'rgba(255,255,255,.94)'});
    if(L('c3')>=0)group(1320,780,1,0,P(L('c3'),0,.3),()=>{panel(-470,-60,940,120,{bg:'rgba(6,13,32,1)',bd:CWS});text('버린 빵 재료비 한 달 22만 5,000원',0,-14,{f:'D',s:34,c:CWS,max:900});text(T>FR('c3',.5)?'밤에 팔면 얼마가 늘까?':'',0,34,{f:'D',s:32,c:C.gold,max:900});});
  }},
  /* ── 버릴 빵이 돈이 된다 ── */
  sale:{draw(){
    sub('d1','d3',()=>{
      clock30(260,300,100,8);text('밤 8시',260,440,{f:'D',s:40,c:C.gold});
      for(let i=0;i<10;i++)bread30(560+(i%5)*130,280+Math.floor(i/5)*110,.9);
      const q=K('d1',0);
      tag30(1500,280,1,'3,000원',{strike:q>=0});
      if(q>=0)group(1500,420,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>tag30(0,0,1,'2,100원',{bg:'#e0342c',c:'#fff'}));
      if(L('d2')>=0)group(960,610,1,0,P(L('d2'),0,.3),()=>{panel(-760,-70,1520,140,{bg:'rgba(6,13,32,1)',bd:CWS});text('남은 빵 재료비 900원 = 이미 쓴 돈',-720,4,{a:'left',f:'D',s:42,max:900});text('팔든 버리든 돌아오지 않는다',720,4,{a:'right',f:'D',s:34,c:C.dim,max:560});});
      if(L('d3')>=0){const k=K('d3',0);group(960,770,1,0,P(L('d3'),0,.3),()=>{panel(-760,-70,1520,140,{bg:'rgba(0,40,20,.9)',bd:CP});text(k>=0?'2,100원 전부 + · 열 개면':'2,100원 … ',-720,4,{a:'left',f:'D',s:44,max:900});text(T>FR('d3',.6)?'하루 +2만 1,000원':'?',720,4,{a:'right',f:'D',s:58,c:T>FR('d3',.6)?CP:C.gold});});}
      srcLine('예시 가정: 30% 할인 3,000 × 0.7 = 2,100 · 이미 쓴 재료비(매몰 비용)는 판단에서 뺀다 · 2,100 × 10 = 21,000 (python3)');});
    sub('d4','d5b',()=>{
      text('한 달 남는 돈 (예시)',960,180,{f:'D',s:52,c:C.gold});
      const X0=560,WW=1000,MX=300,q=K('d4',0);
      text('버릴 때',X0-30,330,{a:'right',f:'D',s:40,c:'#c9ced9'});hbar(X0,330,WW,90,205,MX,'rgba(53,224,138,.55)','205만 원',{s:48});
      text('마감 할인',X0-30,470,{a:'right',f:'D',s:40,c:CP});hbar(X0,470,WW,90,q>=0?205+52.5*E.out(P(q,0,.6)):205,MX,CP,q>=0?'257만 5,000원':'?',{s:48,lc:q>=0?CP:C.gold});
      if(q>=0&&L('d5')<0)pill('+52만 5,000원 · 4분의 1 증가',1100,580,{s:34,bg:'rgba(255,255,255,.94)',alpha:P(q,.5,.3)});
      if(L('d5')>=0&&L('d5b')<0){const k=K('d5',0);group(960,620,1,0,P(L('d5'),0,.3),()=>{panel(-700,-60,1400,120,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.35)'});text('70% 깎아 900원에 팔아도 · 버리는 것보다 낫다',0,4,{f:'D',s:40,max:1340});});
        if(k>=0)stampBox('손해 볼 수 없는 장사?',960,770,k,{s:56,c:C.gold,bg:'rgba(40,30,0,.92)'});}
      if(L('d5b')>=0)['가게 · 버리는 비용 ↓','손님 · 싸게 산다','음식물 쓰레기 ↓'].forEach((s,i)=>{const k=P(L('d5b'),.3+i*.6,.3);if(k>0)pill(s,420+i*540,690,{s:36,alpha:k,bg:'rgba(255,255,255,.92)'});});
      srcLine('205 + 52.5 = 257.5만 · 52.5 ÷ 205 = 25.6% (python3) · 예시 가정 — 남은 열 개가 매일 다 팔린다고 본다');});
  }},
  /* ── 8시를 배운 손님 (어두운 장) ── */
  wait:{draw(){
    sub('w1','w3',()=>{
      group(480,430,1,0,1,()=>{panel(-380,-300,760,600,{bd:CY,bg:'rgba(255,197,49,.06)'});sun30(-250,-200,40);text('낮 · 정가 3,000원',40,-200,{f:'D',s:44,c:CY});});
      group(1440,430,1,0,1,()=>{panel(-380,-300,760,600,{bd:CNT,bg:'rgba(111,168,255,.06)'});moon30(-250,-200,40);text('밤 8시 · 2,100원',40,-200,{f:'D',s:44,c:CNT});});
      for(let i=0;i<5;i++)bread30(1240+i*100,560,.6);
      // 단골 한 명이 낮에서 밤으로
      const q=K('w2',0),k=q>=0?E.io(P(q,0,1.2)):0;
      head30(lerp(480,1440,k),400-Math.sin(k*Math.PI)*120,7,'#ffd27a');text('단골',lerp(480,1440,k),575-Math.sin(k*Math.PI)*120,{f:'D',s:36,c:'#ffd27a'});
      if(L('w1')>=0&&L('w2')<0)text('버려질 빵만 사러 오는 손님만 있을까?',960,820,{f:'D',s:40,c:'#fff',alpha:P(L('w1'),.3,.3)});
      if(L('w3')>=0){const k3=K('w3',0);group(960,800,1,0,P(L('w3'),0,.3),()=>{panel(-700,-60,1400,120,{bg:'rgba(40,0,0,.95)',bd:CR});text('낮에 팔릴 빵이 밤에 2,100원에 · 한 명마다',-660,4,{a:'left',f:'D',s:38,max:960});text(k3>=0?'−900원':'?',660,4,{a:'right',f:'D',s:60,c:k3>=0?CR:C.gold});});}
      srcLine('예시 가정 · 3,000 − 2,100 = 900원');});
    sub('w4','w4',()=>{
      text('낮 손님 110명 가운데 (예시)',960,175,{f:'D',s:48,c:C.gold});
      const X0=270,Y0=250,CELL=66,q=K('w4',0);
      for(let i=0;i<110;i++){const r=Math.floor(i/22),c2=i%22;const col=i<24&&q>=0&&T>KT('w4',0)+i*.05?CNT:'#ffd27a';head30(X0+c2*CELL,Y0+r*68+20,1.9,col);}
      if(q>=0)text('8시로 옮긴 24명',X0,Y0+5*68+10,{a:'left',f:'D',s:30,c:CNT,alpha:P(q,1.2,.3)});
      text('21,000 ÷ 900 = 23.3',960,620,{f:'D',s:48,c:'#fff',alpha:P(L('w4'),.3,.3)});
      if(q>=0)stampBox('24명 · 다섯 명 중 한 명이면 번 돈 0원',960,760,q,{s:52,c:CR,bg:'rgba(40,0,0,.92)'});
      srcLine('21,000 ÷ 900 = 23.3 → 24명 · 24 ÷ 110 = 22% (python3) · 예시 가정');});
    sub('w5','w6',()=>{
      text('옮겨 오는 손님 수를 돌려 보면 (하루)',960,175,{f:'D',s:48,c:C.gold,max:1800});
      if(L('w5')>=0&&L('w6')<0)pill('공식 통계 없음 · 예시 세 가지',960,330,{s:36,alpha:P(L('w5'),.3,.3),bg:'rgba(255,255,255,.92)'});
      const ZX=960,SC=26,rows=[['10명',12000,'+1만 2,000원',CP,CT('w6')+.3],['24명',-600,'−600원',CR,FR('w6',.33)],['40명',-15000,'−1만 5,000원',CR,KT('w6',0)]];
      if(L('w6')>=0){ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;line(ZX,280,ZX,640);text('0',ZX,660,{f:'D',s:30,c:C.dim});
        rows.forEach(([l,v,lb,col,t0],i)=>{const y=330+i*110;text(l,520,y,{a:'right',f:'D',s:44,c:'#ffd27a'});if(T<t0)return;const k=E.out(P(T,t0,.5)),w=Math.max(6,Math.abs(v)/1000*SC*k);ctx.fillStyle=col;if(v>=0){rr(ZX,y-36,w,72,14);ctx.fill();if(k>.9)text(lb,ZX+w+18,y+2,{a:'left',f:'D',s:44,c:col});}else{rr(ZX-w,y-36,w,72,14);ctx.fill();if(k>.9)text(lb,ZX+20,y+2,{a:'left',f:'D',s:44,c:col});}});
        if(T>FR('w6',.75))group(960,760,1,0,P(T,FR('w6',.75),.3),()=>{panel(-700,-60,1400,120,{bg:'rgba(6,13,32,1)',bd:CR});text('40명이면 한 달 −37만 5,000원 · 남는 돈 205만 → 167만 5,000원',0,4,{f:'D',s:36,c:'#ffb3b3',max:1340});});}
      srcLine('21,000 − 900 × 10 = 12,000 · − 900 × 24 = −600 · − 900 × 40 = −15,000 · × 25 = −375,000 (python3) · 옮겨 오는 손님 수는 예시 가정');});
    sub('w7','w9',()=>{
      text('한 빵집 사장님의 글 (보도)',960,175,{f:'D',s:50,c:C.gold});
      const steps=[['밤 9시 이후 할인',CT('w8')+.2],['정가 손님이 할인 시간에 맞춰 온다',FR('w8',.18)],['낮에도 할인가를 해 달라는 손님',FR('w8',.32)],['전체 매출이 줄었다',FR('w8',.5)]];
      if(L('w7')>=0)group(960,290,1,0,P(L('w7'),0,.3),()=>{panel(-760,-60,1520,120,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.35)'});text('2026년 7월 · 온라인 커뮤니티 글을 옮긴 기사 · 한 가게 사례',0,4,{f:'D',s:36,c:C.dim,max:1460});});
      steps.forEach(([s,t0],i)=>{if(T<t0)return;const k=E.out(P(T,t0,.4));group(700,400+i*90,1,0,k,()=>{ctx.fillStyle=CNT;ctx.beginPath();ctx.arc(-380,0,24,0,7);ctx.fill();text((i+1)+'',-380,3,{f:'D',s:30,c:C.ink});text(s,-330,2,{a:'left',f:'D',s:40,max:1100});});});
      moon30(1620,470,60);
      const q=K('w8',0);if(q>=0&&L('w9')<0)stampBox('결국 남은 빵을 전부 버렸다',1380,760,q,{s:50,c:CR,bg:'rgba(40,0,0,.92)'});
      if(L('w9')>=0)pill('한 가게 이야기 · 전체가 그렇다는 뜻은 아니다',960,780,{s:34,alpha:P(L('w9'),0,.3),bg:'rgba(255,255,255,.92)'});
      srcLine('인사이트 2026.7.27 「“나눔했더니 재판매”… 빵집 사장이 남은 빵 폐기하는 이유」 (7월 25일 온라인 커뮤니티 글 인용 · 금액·비율 수치 없음)');});
  }},
  /* ── 시간이 정해지면 ── */
  rule:{draw(){
    sub('r1','r3',()=>{
      clock30(340,420,170,8);
      const q=K('r1',0);
      text(q>=0?'시간이 정해져 있다':'?',1200,230,{f:'D',s:64,c:q>=0?C.gold:C.gold});
      if(L('r2')>=0)['매일 같은 시각','같은 빵집','적어도 20% 싸게'].forEach((s,i)=>{const k=P(L('r2'),.5+i*.9,.3);if(k>0)pill(s,800+i*360,350,{s:36,alpha:k,bg:'rgba(255,255,255,.92)'});});
      if(L('r3')>=0){const k=P(L('r3'),0,.3);group(1200,600,1,0,k,()=>{panel(-660,-170,1320,340,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.35)'});
        head30(-400,-20,8,'#ffd27a');text('버려질 빵을 사는 손님',-400,110,{f:'D',s:32,max:520});
        text('=',0,-10,{f:'D',s:110,c:C.gold});
        head30(400,-20,8,'#ffd27a');text('원래 사던 빵을 기다린 단골',400,110,{f:'D',s:32,max:520});});
        const k2=K('r3',0);if(k2>=0)stampBox('앱 화면에선 구별이 안 된다',1200,800,k2,{s:46,c:CR,bg:'rgba(40,0,0,.92)'});}
      srcLine('보도된 앱 규칙: 오후 8시 이후 · 정상가 대비 20% 이상 (뉴시스 2026.6.16)');});
    sub('r4','r6',()=>{
      text('가게가 할 수 있는 두 가지',960,175,{f:'D',s:52,c:C.gold});
      group(520,470,1,0,P(L('r4'),0,.3),()=>{panel(-400,-220,800,440,{bd:CY,bg:'rgba(6,13,32,1)'});text('① 할인 시각을 마감 직전으로',0,-160,{f:'D',s:38,c:CY,max:760});clock30(-150,20,110,8,{});text('→',20,20,{f:'D',s:80,c:C.gold});clock30(190,20,110,11,{});text('낮 손님이 기다리기엔 너무 늦게',0,170,{s:30,w:900,c:C.dim,max:760});});
      if(L('r5')>=0)group(1400,470,1,0,P(L('r5'),0,.3),()=>{panel(-400,-220,800,440,{bd:CNT,bg:'rgba(6,13,32,1)'});text('② 남는 날만 올린다',0,-160,{f:'D',s:38,c:CNT,max:760});phone30(-180,40,.45,{});text('오늘 남은 빵',100,-30,{a:'left',f:'D',s:32,c:'#fff'});text(K('r5',0)>=0?'0개일 수도':'?개',100,40,{a:'left',f:'D',s:48,c:K('r5',0)>=0?CR:C.gold});});
      if(L('r6')>=0)stampBox('빈손으로 돌아간 날이 생기면 · 단골은 다시 낮에 온다',960,790,L('r6'),{s:42,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('가게 쪽 방법 두 가지는 계산을 위한 예시 · 특정 앱의 실제 기능을 뜻하지 않는다');});
  }},
  /* ── 숫자를 바꾸는 손잡이 ── */
  knob:{draw(){
    sub('k1','k4',()=>{
      text('손잡이 ① 할인 폭 · 본전이 되는 옮겨 온 손님 수',960,175,{f:'D',s:46,c:C.gold,max:1800});
      if(L('k2')<0)['① 할인 폭','② 남는 빵 개수','③ 덜 굽기'].forEach((s,i)=>{const k=P(L('k1'),.4+i*.5,.3);if(k>0)pill(s,480+i*480,520,{s:44,alpha:k,bg:'rgba(255,255,255,.92)'});});
      text('할인',260,260,{f:'D',s:30,c:C.dim});text('할인가',470,260,{f:'D',s:30,c:C.dim});text('한 명 값',700,260,{f:'D',s:30,c:C.dim});text('본전 손님 (하루)',1250,260,{f:'D',s:30,c:C.dim});
      const rows=[['20%','2,400원','−600원',40,'40명',KT('k2',0)],['30%','2,100원','−900원',23.3,'24명',FR('k3',.05)],['50%','1,500원','−1,500원',10,'10명',KT('k3',0)],['70%','900원','−2,100원',4.3,'다섯 명 미만',FR('k4',.15)]];
      rows.forEach(([d,p,c,v,lb,t0],i)=>{const y=340+i*115;if(L('k2')<0||T<t0)return;const k=E.out(P(T,t0,.5));group(0,0,1,0,Math.min(1,k*1.5),()=>{text(d,260,y,{f:'D',s:48,c:CY});text(p,470,y,{f:'D',s:40});text(c,700,y,{f:'D',s:40,c:CR});});hbar(860,y,700,70,v*k,45,i===3?CR:CNT,k>.9?lb:'',{s:40});});
      if(L('k4')>=0&&T>FR('k4',.45))group(960,790,1,0,P(T,FR('k4',.45),.3),()=>{panel(-820,-50,1640,100,{bg:'rgba(6,13,32,1)',bd:CR});text('할인이 클수록 · 버릴 빵값은 덜 건지고, 옮겨 온 한 명은 더 비싸다',0,4,{f:'D',s:36,c:'#ffb3b3',max:1580});});
      srcLine('본전 = 남은 10개 × 할인가 ÷ (3,000 − 할인가) · 20% 40 · 30% 23.3 · 50% 10 · 70% 4.3 (python3) · 예시 가정');});
    sub('k5','k5',()=>{
      text('손잡이 ② 남는 빵 개수 (30% 할인)',960,175,{f:'D',s:50,c:C.gold});
      const X0=560,WW=1000,MX=55,q=K('k5',0);
      text('10개 남는 가게',X0-30,360,{a:'right',f:'D',s:40,c:'#c9ced9'});hbar(X0,360,WW,90,23.3,MX,CNT,'24명',{s:48});
      text('20개 남는 가게',X0-30,520,{a:'right',f:'D',s:40,c:'#c9ced9'});hbar(X0,520,WW,90,q>=0?46.7*E.out(P(q,0,.6)):0,MX,CNT,q>=0?'47명':'?',{s:48,lc:q>=0?CNT:C.gold});
      srcLine('20 × 2,100 ÷ 900 = 46.7 → 47명 (python3) · 예시 가정');});
    sub('k5b','k6',()=>{
      text('손잡이 ③ 아예 덜 굽는다 · 120개 → 110개',960,175,{f:'D',s:48,c:C.gold,max:1800});
      for(let i=0;i<10;i++)bread30(250+(i%5)*110,330+Math.floor(i/5)*100,.75,{alpha:.35});
      ctx.strokeStyle=CR;ctx.lineWidth=10;line(190,270,740,450);
      const q=K('k5b',0);text(q>=0?'재료비 하루 −9,000원':'재료비 하루 ?',480,560,{f:'D',s:46,c:q>=0?CP:C.gold});
      if(L('k5c')>=0){const k=L('k5c');group(1340,420,1,0,P(k,0,.3),()=>{panel(-470,-230,940,460,{bg:'rgba(6,13,32,1)',bd:CR});clock30(-300,-80,90,7,{});text('저녁 7시 · 빈 진열대',-160,-100,{a:'left',f:'D',s:40,max:600});text('돌아간 손님 한 명',-160,-30,{a:'left',f:'D',s:34,c:C.dim});text('−2,100원',-160,30,{a:'left',f:'D',s:54,c:CR});
        text('9,000 ÷ 2,100 = 4.3',0,130,{f:'D',s:40,alpha:P(k,1.5,.3)});text(K('k5c',0)>=0?'다섯 명부터 손해':'?',0,190,{f:'D',s:44,c:K('k5c',0)>=0?CR:C.gold});});}
      if(L('k6')>=0)stampBox('남는 빵을 없애는 것도 공짜가 아니다',960,790,L('k6'),{s:46,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('10 × 900 = 9,000 · 3,000 − 900 = 2,100 · 9,000 ÷ 2,100 = 4.3 (python3) · 예시 가정');});
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('q1'),ov=L('q7');
    text('마감 할인 전, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)*(ov>=0?1-P(ov,0,.3):1),max:1800});
    const cards=[['q2','하루 남는 개수','버릴 뻔한 빵','오늘: 10개'],['q3','할인가 × 남는 개수','버릴 빵이 벌어 오는 돈','오늘: 하루 2만 1,000원'],['q4','옮겨 온 한 명의 값','정가 − 할인가','오늘: 900원'],
      ['q5','본전 손님 수','② ÷ ③','오늘: 24명'],['q6','낮 손님 중 그 비율','단골이 많을수록 넘기 쉽다','오늘: 110명의 22%']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      if(ov>=0&&P(ov,0,.3)>=1)return;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:32,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,500,1,0,P(ov,0,.3),()=>{panel(-820,-330,1640,640,{bg:'rgba(6,13,32,1)',bd:C.gold});text('도시락 하나 6,000원 · 밤마다 여덟 개가 남는다',0,-250,{f:'D',s:40,max:1540});text('40% 깎아 3,600원',0,-185,{f:'D',s:40,max:1540,c:'#ffd0a3'});text('낮 손님 몇 명이 옮겨 와야 본전?',0,-115,{f:'D',s:46,max:1540,c:C.gold});
      const b=L('q7b');
      if(b>=0)text('남은 여덟 개 × 3,600원 = 2만 8,800원',0,-20,{f:'D',s:40,alpha:P(b,0,.3),max:1540});
      if(b>=0&&T>FR('q7b',.4))text('옮겨 온 한 명 = 6,000 − 3,600 = 2,400원',0,50,{f:'D',s:40,alpha:P(T,FR('q7b',.4),.3),max:1540});
      const k=K('q7b',0);if(k>=0)text('12명',0,180,{f:'D',s:120,c:CR,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,180,{f:'D',s:120,c:C.gold});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('동네 빵집 마감 할인 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      bakery30(380,500,.72,{night:true,alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['남은 빵 열 개 · 30% 할인','하루 +2만 1,000원',CP,b,.2],['낮 손님 24명이 8시를 배우면','0원',CR,b2,.2],['할인이 클수록','본전 손님 수는 더 작다',C.gold,b2,2.4]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;group(1260,320+i*160,1,0,kk,()=>{panel(-600,-65,1200,130,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-560,4,{a:'left',f:'D',s:32,max:560});text(v,560,4,{a:'right',f:'D',s:36,c:col,max:560});});});
    }else{
      bakery30(500,500,.75,{night:true});clock30(1060,470,110,8);drawMascot(1600,540,.55,'happy');
      stampBox('마감 할인의 값 = 남은 빵이 아니라 8시를 배운 손님 수',960,790,c,{s:40,c:C.gold,bg:'rgba(40,30,0,.85)'});
      if(L('z4')>=0&&L('z4b')<0)pill('덜 버리는 건 좋은 일 · 누가 할인을 가져가나',1440,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('예시 가정 · 창업 권유 아님 · 📌 출처는 설명란',1440,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-540,-70,1080,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 마감 할인 기다려 본 적 있나요? 몇 시에 하나요?',0,4,{s:38,w:900,c:C.ink,max:1020});});
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
