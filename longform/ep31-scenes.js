/* ════════════════════════════════════════════════════════════════════
   장면 (LF.31 24시간 해장국집 밤 10시 계산서 — 근로기준법 제56조③ 야간 22~06시 통상임금 50% 이상 가산 · 제11조 상시 5명 이상 적용 · 시행령 제7조의2 연인원 ÷ 가동 일수 · 외식업체 영업시간 10.6시간 · 12시간 미만 53.5 → 68.6% · 편의점 비24시간 23.6 → 24.4% / 17.0 → 19.7% · 예시 해장국집 1만 원 · 재료 40% · 밤 35그릇 · 밤 직원 두 명 8시간 · 하룻밤 +24,880 → −57,680원) — 수치·출처는 docs/longform-ep31.md
   중심 그림: 밤 10시를 넘는 순간 바뀌는 시급 표지판 + 직원 다섯 명 줄(다섯 번째 자리가 켜지면 밤 두 명의 시급이 함께 오른다).
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['2','1','0','0','0','0','−','1','6','5','1','2','0','−','2','0','0','0','0','='];   // 210,000 − 165,120 − 20,000 = 24,880 (21 뒤 0 넷 · 16512 뒤 0 하나 · 2 뒤 0 넷)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function receipt31(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433',max:460});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:30,w:900,c:'#3a4256',max:270});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433',max:200});});
});}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CIN='#4FD1C5', CLB='#B98CFF', CGS='#9aa3b8', CP='#35E08A', CR='#FF4D4D', CY='#FFC531', CNT='#6FA8FF', CSP='#E8A05A';   // 재료 · 인건비 · 불·가스 · 남는 돈 · 손실 · 강조 · 밤 · 국물
/* 24시간 해장국집 가게 (상표 없음) */
function shop31(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,214,300,18,0,0,7);ctx.fill();
  ctx.fillStyle='#d9cdb8';rr(-260,-140,520,350,12);ctx.fill();
  ctx.fillStyle='#7a1f1f';rr(-250,-150,500,60,10);ctx.fill();
  ctx.fillStyle='#2a1b14';rr(-210,-250,420,90,14);ctx.fill();text(o.sign||'24시 해장국',0,-203,{f:'D',s:48,c:o.dark?'#7a6a55':'#ffcf6a',max:390});
  ctx.fillStyle=o.dark?'#2b3245':'#ffd98a';rr(-230,-70,300,230,10);ctx.fill();
  if(!o.dark){ctx.fillStyle='#8a5a3a';ctx.fillRect(-220,90,280,10);for(let i=0;i<3;i++)bowl31(-170+i*95,70,.45,{steam:false});}
  ctx.fillStyle='#5a3420';rr(110,10,110,200,8);ctx.fill();ctx.fillStyle='#ffd27a';ctx.beginPath();ctx.arc(130,110,7,0,7);ctx.fill();
  if(o.open!==false){ctx.fillStyle=o.dark?'#444':'#ff4d4d';rr(-60,-130,120,34,8);ctx.fill();text(o.dark?'CLOSED':'OPEN 24',0,-112,{f:'D',s:22,c:'#fff'});}
});}
/* 해장국 한 그릇 */
function bowl31(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  if(o.steam!==false){ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=6;ctx.lineCap='round';for(let i=-1;i<=1;i++){const ph=(T*2+i)%2;ctx.beginPath();ctx.moveTo(i*30,-50);ctx.quadraticCurveTo(i*30+16,-80-ph*6,i*30,-110-ph*6);ctx.stroke();}}
  ctx.fillStyle='#1f1f24';ctx.beginPath();ctx.ellipse(0,-20,80,22,0,0,7);ctx.fill();
  ctx.fillStyle=o.dim?'#6b6f7a':CSP;ctx.beginPath();ctx.ellipse(0,-22,70,17,0,0,7);ctx.fill();
  ctx.fillStyle='#2a2a30';ctx.beginPath();ctx.moveTo(-80,-20);ctx.quadraticCurveTo(-74,40,0,44);ctx.quadraticCurveTo(74,40,80,-20);ctx.closePath();ctx.fill();
  ctx.fillStyle='#d34a2a';ctx.beginPath();ctx.arc(-20,-24,9,0,7);ctx.arc(22,-20,8,0,7);ctx.fill();ctx.fillStyle='#3f8f3a';ctx.fillRect(-4,-30,16,6);
});}
/* 시계 (h 시) */
function clock31(x,y,r,h,o={}){group(x,y,1,0,o.alpha??1,()=>{ctx.fillStyle=o.bg||'#fdf6e8';ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.strokeStyle='#2a1b14';ctx.lineWidth=r*.08;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.stroke();
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ctx.lineWidth=r*.04;line(Math.sin(a)*r*.8,-Math.cos(a)*r*.8,Math.sin(a)*r*.9,-Math.cos(a)*r*.9);}
  const ah=(h%12)/12*Math.PI*2,am=(h%1)*Math.PI*2;ctx.strokeStyle='#1d2433';ctx.lineCap='round';ctx.lineWidth=r*.09;line(0,0,Math.sin(ah)*r*.5,-Math.cos(ah)*r*.5);ctx.lineWidth=r*.06;line(0,0,Math.sin(am)*r*.75,-Math.cos(am)*r*.75);
  ctx.fillStyle=CR;ctx.beginPath();ctx.arc(0,0,r*.07,0,7);ctx.fill();});}
/* 사람 한 명 (s 배율, 머리 높이 약 29s) */
function head31(x,y,s,col){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-10*s,7*s,0,7);ctx.fill();rr(x-8*s,y-2*s,16*s,14*s,5*s);ctx.fill();}
/* 천 원짜리 한 장을 구간 색으로 칠한다 (v0~v0+1000 원) */
function bill31(x,y,w,h,v0,segs){ctx.fillStyle='rgba(255,255,255,.10)';rr(x-w/2,y-h/2,w,h,8);ctx.fill();
  segs.forEach(([a,b,col,k])=>{const lo=Math.max(a,v0),hi=Math.min(b,v0+1000);if(hi<=lo||k<=0)return;const x0=x-w/2+(lo-v0)/1000*w,ww=(hi-lo)/1000*w*k;ctx.save();rr(x-w/2,y-h/2,w,h,8);ctx.clip();ctx.fillStyle=col;ctx.fillRect(x0,y-h/2,ww,h);ctx.restore();});
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;rr(x-w/2,y-h/2,w,h,8);ctx.stroke();ctx.beginPath();ctx.ellipse(x+w*.25,y,h*.22,h*.3,0,0,7);ctx.stroke();text('1,000',x-w*.18,y+3,{f:'D',s:h*.3,c:'rgba(255,255,255,.6)'});}
/* 달 */
function moon31(x,y,r){ctx.fillStyle='#ffe9a8';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.fillStyle='#0b1226';ctx.beginPath();ctx.arc(x+r*.45,y-r*.25,r*.85,0,7);ctx.fill();}
function sun31(x,y,r){ctx.fillStyle='#FFC531';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.strokeStyle='#FFC531';ctx.lineWidth=6;for(let i=0;i<8;i++){const a=i/8*Math.PI*2;line(x+Math.cos(a)*r*1.3,y+Math.sin(a)*r*1.3,x+Math.cos(a)*r*1.7,y+Math.sin(a)*r*1.7);}}
/* 시급 표지판 */
function wageSign31(x,y,s,v,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{panel(-230,-80,460,160,{bg:o.bg||'rgba(6,13,32,1)',bd:o.bd||CY});text(o.label||'밤 직원 시급',0,-38,{f:'D',s:30,c:C.dim});text(v,0,30,{f:'D',s:66,c:o.c||'#fff'});});}
/* 조문 카드 */
function lawCard31(x,y,w,title,body,o={}){group(x,y,1,0,o.alpha??1,()=>{const h=o.h||200;panel(-w/2,-h/2,w,h,{bg:'#f4efe2',bd:'#8a6d3b',lw:5,r:14});text('§',-w/2+50,-h/2+52,{f:'D',s:52,c:'#8a6d3b'});text(title,-w/2+95,-h/2+50,{a:'left',f:'D',s:36,c:'#3a2a10',max:w-130});
  (Array.isArray(body)?body:[body]).forEach((b,i)=>text(b,-w/2+50,-h/2+118+i*52,{a:'left',s:32,w:900,c:'#3a4256',max:w-90}));});}
/* 직원 줄: n 명, 켜진 수 on, 밤 자리(idx) 표시 */
function crew31(x,y,on,o={}){for(let i=0;i<5;i++){const xx=x+i*150,lit=i<on,night=i>=2&&i<4;ctx.fillStyle=lit?(i===4?'rgba(255,77,77,.18)':'rgba(255,255,255,.06)'):'rgba(255,255,255,.02)';rr(xx-62,y-110,124,200,18);ctx.fill();
  if(!lit){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;rr(xx-62,y-110,124,200,18);ctx.stroke();ctx.restore();text('?',xx,y-6,{f:'D',s:60,c:'rgba(255,255,255,.3)'});continue;}
  head31(xx,y+10,4.4,i===4?CR:night?CNT:CY);text(i===4?'점심 알바':night?'밤':'낮',xx,y+70,{f:'D',s:26,c:i===4?CR:night?CNT:CY});}}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3')){
      const a=L('o1');
      shop31(430,500,1.0*E.back(P(a,0,.5))+.001,{});
      text('그림은 예시 · 실제 가게 아님',430,800,{s:26,w:800,c:C.dim,alpha:P(a,.4,.3)});
      clock31(1000,280,100,10,{alpha:P(a,.2,.3)});text('밤 10시',1000,420,{f:'D',s:42,c:C.gold,alpha:P(a,.2,.3)});
      const q=K('o1',0);
      wageSign31(1500,250,1,'1만 320원',{alpha:P(a,.5,.3),bd:CY});
      if(q>=0){ctx.save();ctx.globalAlpha*=P(q,0,.2);ctx.strokeStyle=CR;ctx.lineWidth=8;line(1330,295,1670,265);ctx.restore();
        group(1500,450,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>wageSign31(0,0,1,'1만 5,480원',{bd:CR,c:CR,label:'밤 10시부터'}));}
      if(L('o2')>=0){const k=K('o2',0);group(1440,660,1,0,P(L('o2'),0,.3),()=>{panel(-380,-80,760,160,{bd:C.gold,bg:'rgba(6,13,32,1)'});text('법이 정한 밤 가산 50%',0,-30,{f:'D',s:36,c:C.dim});text(k>=0?'직원 다섯 명 이상 가게만':'?',0,30,{f:'D',s:44,c:C.gold,max:720});});}
      srcLine('근로기준법 제56조③ (오후 10시 ~ 다음 날 오전 6시, 통상임금 50% 이상 가산) · 제11조 (상시 5명 이상) — 국가법령정보센터 원문 · 10,320 × 1.5 = 15,480 (python3)');
    }else if(T<CT('o3c')){
      const b=L('o3');
      text('직원 네 명 → 다섯 명',960,190,{f:'D',s:56,c:C.gold,alpha:P(b,0,.3)});
      crew31(660,380,T>FR('o3',.25)?5:4);
      const X0=560,WW=520,ZX=960,SC=1.6,q=K('o3',0);
      text('밤 장사 한 달',ZX,600,{f:'D',s:32,c:C.dim,alpha:P(b,.3,.3)});
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;line(ZX,630,ZX,800);
      const w1=74.6*SC*E.out(P(b,.5,.5));ctx.fillStyle=CP;rr(ZX,650,w1*1,60,14);ctx.fill();if(b>1)text('+74만 원',ZX+w1+16,682,{a:'left',f:'D',s:40,c:CP});text('네 명',ZX-30,682,{a:'right',f:'D',s:32,c:CY});
      text('다섯 명',ZX-30,762,{a:'right',f:'D',s:32,c:CR});if(q>=0){const w2=173*SC*E.out(P(q,0,.6));ctx.fillStyle=CR;rr(ZX-w2,732,w2,60,14);ctx.fill();if(P(q,0,.6)>.9)text('−173만 원',ZX+20,762,{a:'left',f:'D',s:40,c:CR});}
      else text('?',ZX+40,762,{f:'D',s:44,c:C.gold});
      if(T>FR('o3',.8))pill('손님은 한 명도 안 줄었다',1500,560,{s:32,bg:'rgba(255,255,255,.94)'});
      srcLine('예시 계산 (python3): 35그릇 × 6,000 − 2명 × 8시간 × 10,320 − 20,000 = 24,880 × 30 = 746,400 · 시급 15,480 이면 −57,680 × 30 = −1,730,400 · 가게 숫자는 예시 가정');
    }else{
      const k0=L('o3c'),k9=L('o4'),k10=L('o5');
      if(k9<0){shop31(560,500,.9,{alpha:P(k0,0,.3)});clock31(1100,420,120,10,{alpha:P(k0,.2,.3)});moon31(1100,190,40);drawMascot(1550,520,.75,'think',{alpha:P(k0,.3,.3)});}
      else{
      text('밤 장사 전, 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['법 조문 · 국가법령정보센터','영업시간 · 보도','손님 · 비용 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.7,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});}
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('24시간 해장국집 밤 10시 계산서',960,200,{f:'D',s:100,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('한 그릇 1만 원 · 밤 손님 35그릇 · 밤 직원 두 명',960,325,{s:44,w:900,alpha:P(a,.3,.3),max:1780});
    shop31(560,640,.68,{alpha:P(a,.2,.3)});clock31(1080,620,110,10,{alpha:P(a,.3,.3)});drawMascot(1550,660,.7,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 밤 장사를 접는 가게들 ── */
  news:{draw(){
    sub('p1','p3',()=>{
      text('외식업체 하루 평균 영업시간',960,180,{f:'D',s:52,c:C.gold});
      const q2=K('p2',0);
      clock31(330,420,150,10.6);text(q2>=0?'10.6시간':'?',330,640,{f:'D',s:64,c:q2>=0?'#fff':C.gold});text('2025년 (2018년보다 24분 ↓)',330,710,{s:28,w:800,c:C.dim});
      const X0=900,WW=820,MX=80,q3=K('p3',0);
      text('12시간 안쪽으로만 여는 가게',X0,300,{a:'left',f:'D',s:38,c:'#c9ced9',alpha:P(L('p2')>=0?L('p2'):-1,.5,.3)});
      if(L('p2')>=0&&L('p3')<0){text('2018',X0-20,400,{a:'right',f:'D',s:36,c:'#c9ced9',alpha:P(L('p2'),.5,.3)});text('2025',X0-20,520,{a:'right',f:'D',s:36,c:CNT,alpha:P(L('p2'),.5,.3)});text('?',X0+40,400,{f:'D',s:44,c:C.gold});text('?',X0+40,520,{f:'D',s:44,c:C.gold});}
      if(L('p3')>=0){text('2018',X0-20,400,{a:'right',f:'D',s:36,c:'#c9ced9'});hbar(X0,400,WW,80,53.5*E.out(P(L('p3'),.2,.5)),MX,'rgba(111,168,255,.6)','53.5%',{s:44});
        text('2025',X0-20,520,{a:'right',f:'D',s:36,c:CNT});hbar(X0,520,WW,80,q3>=0?68.6*E.out(P(q3,0,.6)):0,MX,CNT,q3>=0?'68.6%':'?',{s:48,lc:q3>=0?CNT:C.gold});
        if(q3>=0)pill('열 곳 중 일곱 곳',1300,650,{s:34,alpha:P(q3,.6,.3),bg:'rgba(255,255,255,.94)'});}
      srcLine('한국경제 2026.7.26 「"밤 10시까지 버텼는데"…자영업자들 밤 장사 포기하는 까닭」 (농림축산식품부 2025 외식업체 경영실태조사 인용: 10.6시간 · 12시간 미만 53.5% → 68.6%)');});
    sub('p4','p5',()=>{
      text('편의점 · 24시간 열지 않는 점포 비중',960,180,{f:'D',s:50,c:C.gold});
      const X0=640,WW=900,MX=30,q=K('p4',0);
      [['한 브랜드 2024',23.6,'23.6%','rgba(255,197,49,.55)',0,CT('p4')+.3],['한 브랜드 2025',24.4,'24.4%',CY,1,KT('p4',0)],['다른 브랜드 2024',17.0,'17.0%','rgba(111,168,255,.55)',2,FR('p4',.7)],['다른 브랜드 2025',19.7,'19.7%',CNT,3,FR('p4',.85)]].forEach(([l,v,lb,col,i,t0])=>{const y=300+i*95+(i>1?30:0);text(l,X0-24,y,{a:'right',f:'D',s:32,c:'#c9ced9'});if(T<t0){text('?',X0+40,y,{f:'D',s:40,c:C.gold});return;}hbar(X0,y,WW,64,v*E.out(P(T,t0,.5)),MX,col,lb,{s:40});});
      if(L('p5')>=0){const k=K('p5',0);group(960,770,1,0,P(L('p5'),0,.3),()=>{panel(-820,-75,1640,150,{bg:'rgba(6,13,32,1)',bd:CR});text('한 점주: 한밤에 20만 원어치 팔아 봐야 4만 원도 안 남는데',0,-28,{f:'D',s:34,max:1560});text(k>=0?'인건비 9만 원을 주면 5만 원 적자':'인건비 9만 원을 주면 … ?',0,32,{f:'D',s:40,c:k>=0?CR:C.gold,max:1560});});}
      srcLine('스마트투데이 2026.10.15 「밤엔 적자, 문 닫으면 혜택 달라져…편의점 3사 심야영업 딜레마」 (자료: 각 사 · 한 점주 인터뷰)');});
  }},
  /* ── 예시 해장국집 ── */
  setup:{draw(){
    sub('s0','s0c',()=>{
      shop31(380,480,.9,{});
      text('예시 해장국집',1240,190,{f:'D',s:50,c:C.gold});
      const q=K('s0',0);
      bowl31(870,340,1.3);text(q>=0?'한 그릇 1만 원':'한 그릇 ?',1010,320,{a:'left',f:'D',s:56,c:q>=0?CSP:C.gold});
      if(L('s0b')>=0){const k=K('s0b',0);text('재료비 40% = 4,000원',1010,390,{a:'left',f:'D',s:40,c:CIN});text('정부 조사 식재료비 40.7%에 맞춤',1010,440,{a:'left',s:26,w:800,c:C.dim});text(k>=0?'한 그릇 남는 돈 6,000원':'',1010,500,{a:'left',f:'D',s:44,c:CP});}
      if(L('s0c')>=0){const k=K('s0c',0);moon31(800,640,34);text('밤 10시 ~ 아침 6시 · 8시간',860,640,{a:'left',f:'D',s:36,c:CNT});
        for(let i=0;i<35;i++){const kk=k>=0?P(k,i*.03,.2):0;if(kk<=0)continue;bowl31(840+(i%12)*82,705+Math.floor(i/12)*52,.36,{alpha:kk,steam:false});}
        if(k<0)text('?그릇',830,730,{a:'left',f:'D',s:44,c:C.gold});}
      srcLine('값·재료비율·밤 손님 수는 예시 가정 · 식재료비 40.7%: 농림축산식품부 외식업체 경영실태조사 (뉴시스 2026.3.28)');});
    sub('s0d','s0e',()=>{
      text('이 가게에서 하루 일하는 사람',960,180,{f:'D',s:50,c:C.gold});
      crew31(660,360,4);
      const q=K('s0d',0);if(q>=0)stampBox('하루 네 명',1600,330,q,{s:52,c:CY,bg:'rgba(40,30,0,.92)'});
      if(L('s0e')>=0){const q8=K('s0e',0);const rows=[['밤 직원 두 명 × 8시간','시급 × 16'],['불 · 가스 하룻밤',q8>=0?'2만 원':'?']];receipt31(960,680,.85,rows,{title:'밤에만 새로 드는 돈'});
        pill('월세 같은 고정비 = 낮 장사가 낸다고 본다',960,500,{s:30,alpha:P(L('s0e'),0,.3),bg:'rgba(255,255,255,.92)'});}
      srcLine('직원 수·근무 시간·불값은 예시 가정 · 주휴수당·4대 보험료는 빼고 계산 (넣으면 인건비는 더 커진다)');});
  }},
  /* ── 밤의 1만 원 쪼개기 (천 원짜리 열 장) ── */
  cut:{draw(){
    text('밤 손님 한 그릇 1만 원 = 천 원짜리 열 장',960,180,{f:'D',s:52,c:C.gold,max:1800});
    const k1=L('t1');
    const segs=[[0,4000,CIN,FR('t2',.05)],[4000,8717.7,CLB,KT('t2',0)],[8717.7,9289.1,CGS,FR('t3',.05)],[9289.1,10000,CP,KT('t3',0)]].map(([a,b,col,t0])=>[a,b,col,L('t2')<0||T<t0?0:E.out(P(T,t0,.6))]);
    for(let i=0;i<10;i++){const r=Math.floor(i/5),c2=i%5,k=E.back(P(k1,.1+i*.05,.3));if(k<=0)continue;group(310+c2*325,330+r*170,Math.min(1,k),0,1,()=>bill31(0,0,290,140,i*1000,segs));}
    const leg=[['재료비','4,000원',CIN,0],['밤 인건비 몫','4,718원',CLB,1],['불 · 가스 몫','571원',CGS,2],['남는 돈','711원',CP,3]];
    leg.forEach(([l,v,col,i])=>{if(segs[i][3]<=0)return;const x=240+i*440;group(x+180,690,1,0,Math.min(1,segs[i][3]*2),()=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(-150,0,22,0,7);ctx.fill();text(l,-115,-18,{a:'left',f:'D',s:30,c:col});text(v,-115,26,{a:'left',f:'D',s:40,c:'#fff'});});});
    if(K('t3',0)>=0)stampBox('한 장도 안 된다',1560,560,K('t3',0),{s:44,c:CP,bg:'rgba(0,40,20,.92)'});
    srcLine('밤 인건비 2 × 8 × 10,320 = 165,120 ÷ 35 = 4,718 · 불·가스 20,000 ÷ 35 = 571 · 남는 돈 10,000 − 4,000 − 4,718 − 571 = 711 (python3) · 예시 가정',850);
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='210,000 − 165,120 − 20,000 =';bigS='24,880';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:22,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:done?84:76,f:'D',c:done?'#1a7a44':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('밤 손님이 남긴 돈 − 밤 인건비 − 불·가스',1320,180,{f:'D',s:40,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0),X0=920,WW=760,MX=230;
    [['밤 손님이 남긴 돈 (35 × 6,000)',210,'21만',CP,CT('c2')],['밤 인건비',165.12,'16만 5,120',CLB,FR('c2',.25)],['불 · 가스',20,'2만',CGS,FR('c2',.45)]].forEach(([l,v,lb,col,t0],i)=>{const y=300+i*100;if(L('c2')<0)return;const k=E.out(P(T,t0,.5));text(l,X0,y-40,{a:'left',f:'D',s:28,c:C.dim});hbar(X0,y,WW*.8,48,v*k,MX,col,T>t0?lb:'',{s:36});});
    text('하룻밤 남는 돈',X0,600,{a:'left',f:'D',s:38});hbar(X0,660,WW*.8,70,q2>=0?24.88*E.out(P(q2,0,.6)):0,MX,CP,q2>=0?'2만 4,880원':'?',{s:46,lc:q2>=0?CP:C.gold});
    if(dt>=0&&q2<0)group(1300,650,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(T>FR('c2',.8)&&L('c3')<0)pill('한 달 30일 · 74만 6,400원',1320,780,{s:34,bg:'rgba(255,255,255,.94)'});
    if(L('c3')>=0)group(1320,780,1,0,P(L('c3'),0,.3),()=>{panel(-470,-60,940,120,{bg:'rgba(6,13,32,1)',bd:CP});text('얇지만 흑자',0,-14,{f:'D',s:34,c:CP,max:900});text(T>FR('c3',.4)?'직원을 한 명 더 쓰면?':'',0,34,{f:'D',s:32,c:C.gold,max:900});});
  }},
  /* ── 다섯 번째 직원 (어두운 장) ── */
  fifth:{draw(){
    sub('f1','f3',()=>{
      text('점심 손님이 늘었다',960,175,{f:'D',s:50,c:C.gold});
      const q1=K('f1',0),on=q1>=0?5:4;
      crew31(660,360,on);
      if(q1>=0)group(1260,560,1,0,P(q1,0,.3),()=>{sun31(-300,0,30);text('하루 네 시간 · 일당 4만 1,280원',-230,2,{a:'left',f:'D',s:36,c:'#fff',max:640});});
      const q2=K('f2',0);if(q2>=0&&L('f3')<0)stampBox('상시 다섯 명 → 근로기준법 전부 적용',960,720,q2,{s:48,c:CR,bg:'rgba(40,0,0,.92)'});
      if(L('f3')>=0)lawCard31(960,720,1500,'시행령 제7조의2 · 상시 직원 수 세는 법',['지난 1개월 연인원 ÷ 그 기간 가동 일수','기간제·단시간 근로자 등 고용 형태를 가리지 않고 모두 포함'],{alpha:P(L('f3'),0,.3),h:220});
      srcLine('근로기준법 제11조① 상시 5명 이상 · 시행령 제7조의2 (국가법령정보센터 원문) · 4 × 10,320 = 41,280 (python3) · 알바 근무 시간은 예시 가정');});
    sub('f4','f5',()=>{
      const q4=K('f4',0);
      lawCard31(960,260,1500,'근로기준법 제56조 ③',['야간근로(오후 10시 ~ 다음 날 오전 6시)에 대하여는',q4>=0?'통상임금의 100분의 50 이상을 가산하여 지급':'통상임금의 … ?'],{alpha:P(L('f4'),0,.3),h:220});
      if(L('f5')>=0){const q5=K('f5',0);
        wageSign31(420,580,1,'1만 320원',{label:'밤 10시 전',bd:CY});text('→',740,580,{f:'D',s:90,c:C.gold});wageSign31(1060,580,1,'1만 5,480원',{label:'밤 10시 ~ 6시',bd:CR,c:CR});
        group(1560,580,1,0,P(L('f5'),.8,.3),()=>{panel(-230,-110,460,220,{bg:'rgba(40,0,0,.92)',bd:CR});text('하룻밤 인건비',0,-62,{f:'D',s:30,c:C.dim});text('16만 5,120 →',0,-10,{f:'D',s:36,c:'#c9ced9'});text(q5>=0?'24만 7,680원':'?',0,52,{f:'D',s:48,c:q5>=0?CR:C.gold});});}
      srcLine('근로기준법 제56조③ 원문 (국가법령정보센터, 2026.11.25 확인) · 10,320 × 1.5 = 15,480 · 2 × 8 × 15,480 = 247,680 (python3) · 통상임금은 최저시급으로 둔 예시');});
    sub('f6','f8',()=>{
      text('밤 장사 · 하룻밤 (35그릇)',960,175,{f:'D',s:50,c:C.gold});
      const ZX=860,SC=5.2,q=K('f6',0);
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;line(ZX,250,ZX,520);text('0',ZX,540,{f:'D',s:28,c:C.dim});
      text('직원 네 명',ZX-30,320,{a:'right',f:'D',s:38,c:CY});ctx.fillStyle=CP;rr(ZX,285,24.88*SC,70,14);ctx.fill();text('+2만 4,880원',ZX+24.88*SC+16,322,{a:'left',f:'D',s:42,c:CP});
      text('직원 다섯 명',ZX-30,450,{a:'right',f:'D',s:38,c:CR});
      if(q>=0){const w=57.68*SC*E.out(P(q,0,.6));ctx.fillStyle=CR;rr(ZX-w,415,w,70,14);ctx.fill();if(P(q,0,.6)>.9){text('−5만 7,680원',ZX+20,452,{a:'left',f:'D',s:42,c:CR});text('한 달 −173만 400원',ZX+20,505,{a:'left',f:'D',s:32,c:'#ffb3b3'});}}else text('?',ZX+40,450,{f:'D',s:44,c:C.gold});
      if(L('f7')>=0){const q7=K('f7',0);const X0=560,WW=900,MX=90000;
        text('점심 알바 일당',X0-30,660,{a:'right',f:'D',s:34,c:CY});hbar(X0,660,WW,64,41280*E.out(P(L('f7'),0,.5)),MX,CY,'4만 1,280원',{s:40});
        text('밤 두 명에게 더 주는 돈',X0-30,760,{a:'right',f:'D',s:34,c:CR});hbar(X0,760,WW,64,q7>=0?82560*E.out(P(q7,0,.6)):0,MX,CR,q7>=0?'8만 2,560원 · 두 배':'?',{s:40,lc:q7>=0?CR:C.gold});}
      if(L('f8')>=0)pill('보이는 비용보다 · 숫자 하나가 바꾼 비용이 더 크다',1400,250,{s:30,alpha:P(L('f8'),0,.3),bg:'rgba(255,255,255,.94)'});
      srcLine('210,000 − 247,680 − 20,000 = −57,680 · × 30 = −1,730,400 · 2 × 8 × (15,480 − 10,320) = 82,560 = 41,280 × 2 (python3) · 예시 가정');});
  }},
  /* ── 본전 그릇 수 ── */
  even:{draw(){
    sub('b1','b3',()=>{
      text('밤 장사 본전 그릇 수',960,175,{f:'D',s:52,c:C.gold});
      const X0=560,WW=1100,MX=50,q2=K('b2',0),q3=K('b3',0);
      text('가산 없음',X0-30,340,{a:'right',f:'D',s:40,c:CY});
      if(L('b2')>=0){text('(16만 5,120 + 2만) ÷ 6,000 = 30.9',X0,270,{a:'left',s:28,w:800,c:C.dim});hbar(X0,340,WW,80,q2>=0?30.85*E.out(P(q2,0,.6)):0,MX,CY,q2>=0?'31그릇':'?',{s:48,lc:q2>=0?CY:C.gold});}
      text('가산 50%',X0-30,520,{a:'right',f:'D',s:40,c:CR});
      if(L('b3')>=0){text('(24만 7,680 + 2만) ÷ 6,000 = 44.6',X0,450,{a:'left',s:28,w:800,c:C.dim});hbar(X0,520,WW,80,q3>=0?44.6*E.out(P(q3,0,.6)):0,MX,CR,q3>=0?'45그릇':'?',{s:48,lc:q3>=0?CR:C.gold});}
      if(q3>=0)for(let i=0;i<14;i++){const k=P(q3,.8+i*.06,.2);if(k>0)bowl31(580+i*66,700,.38,{alpha:k,steam:false});}
      if(q3>=0)text('밤마다 열네 그릇 더',1800,705,{a:'right',f:'D',s:36,c:CR,alpha:P(q3,1.5,.3)});
      srcLine('(165,120 + 20,000) ÷ 6,000 = 30.85 · (247,680 + 20,000) ÷ 6,000 = 44.61 (python3) · 예시 가정');});
    sub('b4','b6',()=>{
      text('밤 손님 수를 돌려 보면 (하룻밤)',960,175,{f:'D',s:50,c:C.gold});
      const CX=[820,1420];text('가산 없음',CX[0],270,{f:'D',s:38,c:CY});text('가산 50%',CX[1],270,{f:'D',s:38,c:CR});
      ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(220,305,1480,3);
      const rows=[[25,-35120,-117680,CT('b4')+.3,KT('b4',0)],[35,24880,-57680,CT('b5')+.2,FR('b5',.4)],[45,84880,2320,FR('b5',.55),KT('b5',0)]];
      rows.forEach(([n,a,b,t1,t2],i)=>{const y=380+i*110;bowl31(300,y+10,.42,{steam:false});text(n+'그릇',380,y,{a:'left',f:'D',s:48,c:'#fff'});
        [[a,t1,0],[b,t2,1]].forEach(([v,t0,j])=>{if(T<t0){text('?',CX[j],y,{f:'D',s:48,c:C.gold});return;}const k=E.out(P(T,t0,.4));const lb=(v>=0?'+':'−')+Math.abs(v).toLocaleString('ko-KR')+'원';group(CX[j],y,lerp(1.3,1,k),0,Math.min(1,k*2),()=>text(lb,0,0,{f:'D',s:54,c:v>=0?CP:CR}));});
        if(i===1&&T>FR('b5',.4)){ctx.save();ctx.strokeStyle='rgba(255,197,49,.8)';ctx.lineWidth=4;rr(240,y-48,1440,96,20);ctx.stroke();ctx.restore();}});
      if(L('b6')>=0)stampBox('손님이 애매한 가게는 같은 날 흑자 → 적자',960,775,L('b6'),{s:42,c:C.gold,bg:'rgba(40,30,0,.95)'});
      srcLine('n × 6,000 − 인건비 − 20,000 · 25그릇 −35,120 / −117,680 · 35그릇 +24,880 / −57,680 · 45그릇 +84,880 / +2,320 (python3) · 예시 가정');});
  }},
  /* ── 사장님이 밤을 지키면 ── */
  owner:{draw(){
    text('밤: 직원 한 명 + 사장님',960,175,{f:'D',s:52,c:C.gold});
    const a=L('m1');
    group(480,400,1,0,P(a,0,.3),()=>{panel(-330,-170,660,340,{bd:CNT,bg:'rgba(6,13,32,1)'});moon31(-250,-130,32);
      head31(-130,40,7,CNT);text('직원',-130,150,{f:'D',s:34,c:CNT});head31(130,40,7,C.gold);text('사장님',130,150,{f:'D',s:34,c:C.gold});});
    if(L('m2')>=0){const q=K('m2',0);receipt31(1340,400,.85,[['밤 손님이 남긴 돈','21만'],['직원 한 명 (가산)','−12만 3,840'],['불 · 가스','−2만'],['= 하룻밤',q>=0?'6만 6,160':'?','#1a7a44']],{title:'하룻밤'});}
    if(L('m3')>=0){const q=K('m3',0);group(960,650,1,0,P(L('m3'),0,.3),()=>{panel(-820,-80,1640,160,{bg:'rgba(40,0,0,.92)',bd:CR});text('6만 6,160 나누기 8시간 = 사장님 밤 시급',-780,4,{a:'left',f:'D',s:40,max:1000});text(q>=0?'8,270원':'?',780,4,{a:'right',f:'D',s:70,c:q>=0?CR:C.gold});});}
    if(L('m4')>=0)stampBox('옆 직원 1만 5,480원 · 사장님은 최저시급에도 못 미친다',960,795,L('m4'),{s:40,c:C.gold,bg:'rgba(40,30,0,.95)'});
    srcLine('사용자(사장님)는 근로자가 아니라 가산수당 대상이 아니다 · 8 × 15,480 = 123,840 · 210,000 − 123,840 − 20,000 = 66,160 ÷ 8 = 8,270 (python3) · 예시 가정');
  }},
  /* ── 법이 바뀌면 ── */
  law:{draw(){
    sub('l1','l2',()=>{
      text('지금: 상시 네 명 이하 가게',960,175,{f:'D',s:52,c:C.gold});
      lawCard31(960,360,1500,'근로기준법 제11조 · 적용 범위',['① 상시 5명 이상의 근로자를 사용하는 모든 사업 또는 사업장에 적용','② 상시 4명 이하는 대통령령(시행령 별표 1)으로 일부 규정만 적용'],{h:230});
      if(L('l2')>=0)['연장 가산','야간 가산','휴일 가산'].forEach((s,i)=>{const k=P(L('l2'),.5+i*.5,.3);if(k<=0)return;group(520+i*440,650,1,0,k,()=>{panel(-190,-60,380,120,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.35)'});text(s,0,4,{f:'D',s:40,c:'#c9ced9'});ctx.strokeStyle=CR;ctx.lineWidth=7;line(-150,30,150,-25);});});
      srcLine('근로기준법 제11조·시행령 제7조 (국가법령정보센터 원문) · 5명 미만에 연장·야간·휴일 가산 미적용: 한국경제 사설 2026.8.5');});
    sub('l3','l4',()=>{
      const q=K('l3',0);
      group(960,280,1,0,P(L('l3'),0,.3),()=>{panel(-800,-110,1600,220,{bg:'rgba(6,13,32,1)',bd:C.gold});text('2026년 8월 · 고용노동부 대통령 업무보고',0,-50,{f:'D',s:36,c:C.dim});text(q>=0?'5명 미만에도 근로기준법 확대 적용 → 사회적 대화 시작':'?',0,30,{f:'D',s:44,c:C.gold,max:1540});});
      if(L('l4')>=0){const k=K('l4',0);group(560,580,1,0,P(L('l4'),0,.3),()=>{panel(-380,-130,760,260,{bg:'rgba(40,0,0,.6)',bd:'rgba(255,255,255,.3)'});text('"이미 시행됐다"는 글',0,-50,{f:'D',s:40,c:'#c9ced9'});ctx.strokeStyle=CR;ctx.lineWidth=10;line(-300,70,300,-90);text('확인 안 됨',0,60,{f:'D',s:44,c:CR});});
        group(1360,580,1,0,P(L('l4'),.6,.3),()=>{panel(-380,-130,760,260,{bg:'rgba(0,40,20,.6)',bd:CP});text('현행 제11조 (2026.11.25 확인)',0,-50,{f:'D',s:34,c:C.dim,max:720});text(k>=0?'상시 다섯 명 이상':'?',0,30,{f:'D',s:54,c:k>=0?CP:C.gold});});}
      srcLine('한국경제 사설 2026.8.5 「5인 미만 사업장도 근로기준법…」 (고용노동부 업무보고: 사회적 대화) · 국가법령정보센터 근로기준법·시행령(2025.10.23 시행) 현행 조문');});
    sub('l5','l6',()=>{
      text('만약 넓혀 적용된다면 · 직원 네 명 그대로',960,175,{f:'D',s:48,c:C.gold,max:1800});
      crew31(660,360,4);
      const ZX=960;group(960,580,1,0,P(L('l5'),0,.3),()=>{panel(-600,-70,1200,140,{bg:'rgba(40,0,0,.92)',bd:CR});text('하룻밤 +2만 4,880원 →',-560,4,{a:'left',f:'D',s:40,c:'#c9ced9'});text('−5만 7,680원',560,4,{a:'right',f:'D',s:54,c:CR});});
      if(L('l6')>=0){const q=K('l6',0);group(960,750,1,0,P(L('l6'),0,.3),()=>{panel(-800,-70,1600,140,{bg:'rgba(6,13,32,1)',bd:CNT});text('같은 밤, 가게 크기에 따라 시급 차이',-760,4,{a:'left',f:'D',s:38,max:1000});text(q>=0?'5,160원':'?',760,4,{a:'right',f:'D',s:58,c:q>=0?CNT:C.gold});});
        if(T>FR('l6',.45))pill('옳고 그름이 아니라 · 숫자가 바뀌는 크기',1560,300,{s:26,alpha:P(T,FR('l6',.45),.3),bg:'rgba(255,255,255,.94)'});}
      srcLine('15,480 − 10,320 = 5,160 (python3) · 확대 적용의 범위·시기는 정해지지 않았다 — 계산은 야간 가산만 붙는다고 둔 예시');});
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('q1'),ov=L('q7');
    text('밤 장사 전, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)*(ov>=0?1-P(ov,0,.3):1),max:1800});
    const cards=[['q2','밤 손님 그릇 수','밤 8시간 동안','오늘: 35그릇'],['q3','한 그릇이 남기는 돈','값 − 재료비','오늘: 6,000원'],['q4','밤 직원 × 시간 × 시급','가산이 붙으면 1.5배','오늘: 16만 5,120 / 24만 7,680'],
      ['q5','상시 직원 수','한 달 연인원 ÷ 영업일','다섯 명이 넘는가'],['q6','본전 그릇 수','(인건비 + 불값) ÷ 한 그릇 몫','오늘: 31 / 45그릇']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      if(ov>=0&&P(ov,0,.3)>=1)return;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:32,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,500,1,0,P(ov,0,.3),()=>{panel(-820,-330,1640,640,{bg:'rgba(6,13,32,1)',bd:C.gold});text('김밥 한 줄 4,000원 · 재료비 40%',0,-250,{f:'D',s:40,max:1540});text('밤 여섯 시간 · 직원 한 명 · 불값 1만 원',0,-185,{f:'D',s:40,max:1540,c:'#ffd0a3'});text('가산수당이 붙으면 몇 줄이 본전?',0,-115,{f:'D',s:46,max:1540,c:C.gold});
      const b=L('q7b');
      if(b>=0)text('한 줄 몫 2,400원 · 인건비 1만 5,480 × 6 = 9만 2,880원',0,-20,{f:'D',s:38,alpha:P(b,0,.3),max:1540});
      if(b>=0&&T>FR('q7b',.45))text('(9만 2,880 + 1만) 나누기 2,400 = 42.9',0,50,{f:'D',s:40,alpha:P(T,FR('q7b',.45),.3),max:1540});
      const k=K('q7b',0);if(k>=0){text('43줄',0,180,{f:'D',s:120,c:CR,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});if(T>FR('q7b',.9))text('가산 없으면 30줄',420,200,{f:'D',s:36,c:CY});}else text('?',0,180,{f:'D',s:120,c:C.gold});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('24시간 해장국집 밤 10시 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      shop31(380,500,.72,{alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['직원 네 명 · 밤 35그릇','한 달 +74만 원',CP,b,.2],['점심 알바 한 명 → 상시 다섯 명','밤 시급 1.5배',C.gold,b2,.2],['같은 손님, 같은 밤','한 달 −173만 원',CR,b2,2.6]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;group(1260,320+i*160,1,0,kk,()=>{panel(-600,-65,1200,130,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-560,4,{a:'left',f:'D',s:32,max:600});text(v,560,4,{a:'right',f:'D',s:38,c:col,max:500});});});
    }else{
      shop31(500,500,.75,{});clock31(1060,470,110,10);drawMascot(1600,540,.55,'happy');
      stampBox('24시간 가게의 밤 = 손님 수가 아니라 다섯 번째 직원',960,790,c,{s:40,c:C.gold,bg:'rgba(40,30,0,.85)'});
      if(L('z4')>=0&&L('z4b')<0)pill('밤에 일하는 사람의 몫을 깎자는 게 아니다',1440,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('예시 가정 · 노무 상담·창업 권유 아님 · 📌 출처는 설명란',1400,140,{s:30,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-540,-70,1080,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 동네 24시간 식당, 아직 밤에도 여나요?',0,4,{s:38,w:900,c:C.ink,max:1020});});
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
