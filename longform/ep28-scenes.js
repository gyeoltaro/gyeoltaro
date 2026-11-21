/* ════════════════════════════════════════════════════════════════════
   장면 (LF.28 동네 목욕탕 계산서 — 서울 목욕료 평균 1만 1,000원(2026.7) · 손님 한 번 더 = 1만 원 · 단골 한 명 = 한 달 8만 원 · 본전 250명 · 단골 −10% → 남는 돈 400 → 160만 · 해마다 10%면 2년째 −56만 · 전국 목욕장 8,904 → 5,656곳 · 새 손님 여덟 명 = 단골 한 명 · 포항 공공 목욕탕 4,000원) — 수치·출처는 docs/longform-ep28.md
   중심 그림: 단골 300명을 작은 사람 300개(20 × 15)로 그린 판. 본전 250명은 노랑, 남는 몫 50명은 초록, 떠난 단골은 회색 (예시).
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['2','6','4','0','0','0','0','0','−','2','4','0','0','0','0','0','−','2','0','0','0','0','0','0','0','='];   // 26,400,000 − 2,400,000 − 20,000,000 = 4,000,000 (0 개수: 2640 뒤 넷, 240 뒤 다섯 → 26400000 은 0 다섯 개, 2400000 은 0 다섯 개, 20000000 은 0 일곱 개)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold,a:o.a});}
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433',max:460});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:30,w:900,c:'#3a4256',max:270});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433',max:180});});
});}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CF='#FF7A45', CSF='#6FA8FF', CRT='#B98CFF', CET='#9aa3b8', CSO='#4FD1C5', CP='#35E08A', CR='#FF4D4D', CW='#7FD8FF', CY='#FFC531';   // 연료 · 사람 · 월세 · 기타 · 소모품 · 남는 돈 · 손실 · 물 · 단골
/* 동네 목욕탕 건물 (상표 없음). o.dim 이면 불 꺼짐, o.price 간판 아래 값 */
function bath28(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,214,300,18,0,0,7);ctx.fill();
  // 굴뚝 + 김
  ctx.fillStyle=o.dim?'#6b6f7a':'#d9d4cc';ctx.fillRect(170,-300,56,300);ctx.fillStyle=o.dim?'#7a2e2e':'#e0503c';[-280,-200].forEach(yy=>ctx.fillRect(170,yy,56,26));
  if(!o.dim)for(let i=0;i<4;i++){const ph=(T*.6+i*.25)%1;ctx.fillStyle=`rgba(255,255,255,${.5*(1-ph)})`;ctx.beginPath();ctx.arc(198+Math.sin(ph*6+i)*18,-320-ph*120,22+ph*26,0,7);ctx.fill();}
  // 건물
  ctx.fillStyle=o.dim?'#4a4f5c':'#efe6d6';rr(-260,-120,480,330,12);ctx.fill();
  ctx.fillStyle=o.dim?'#3a3f4a':'#3a6ea5';ctx.fillRect(-280,-140,520,40);
  // 간판
  ctx.fillStyle=o.dim?'#2a2f3a':'#1f4f8a';rr(-200,-90,360,84,12);ctx.fill();text('동네 목욕탕',-20,-46,{f:'D',s:48,c:o.dim?'#7d8494':'#fff',max:330});
  // 창문 타일
  for(let i=0;i<4;i++){ctx.fillStyle=o.dim?'#2b2f38':'#bfe3f5';rr(-230+i*110,20,80,60,8);ctx.fill();}
  // 문 (남·여)
  ctx.fillStyle=o.dim?'#2b2f38':'#7a4a2a';rr(-150,110,120,100,8);ctx.fill();rr(10,110,120,100,8);ctx.fill();
  text('남',-90,162,{f:'D',s:40,c:o.dim?'#555':'#9fd0ff'});text('여',70,162,{f:'D',s:40,c:o.dim?'#555':'#ffb3c8'});
  if(o.price)group(-20,262,1,0,1,()=>{ctx.fillStyle='rgba(6,13,32,.92)';rr(-200,-34,400,68,34);ctx.fill();text(o.price,0,3,{f:'D',s:36,c:C.gold,max:380});});
});}
/* 탕 (타일 + 물 + 김) */
function tub28(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='#e9eef3';rr(-260,-40,520,140,16);ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=2;for(let i=1;i<8;i++)line(-260+i*65,-40,-260+i*65,100);line(-260,30,260,30);
  ctx.fillStyle=CW;rr(-240,-30,480,40,10);ctx.fill();
  for(let i=0;i<5;i++){const ph=(T*.5+i*.2)%1;ctx.strokeStyle=`rgba(255,255,255,${.7*(1-ph)})`;ctx.lineWidth=6;ctx.beginPath();const bx=-180+i*90;ctx.moveTo(bx,-50-ph*80);ctx.bezierCurveTo(bx+20,-70-ph*80,bx-20,-90-ph*80,bx,-110-ph*80);ctx.stroke();}
});}
/* 사람 한 명 */
function head28(x,y,s,col){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-10*s,7*s,0,7);ctx.fill();rr(x-8*s,y-2*s,16*s,14*s,5*s);ctx.fill();}
/* 단골 판: n 명, cols 줄, cell 간격, colFn(i) 색, k 나타나는 정도 */
function crowd28(x0,y0,n,cols,cell,colFn,k=1,sz=1.9){for(let i=0;i<n;i++){const kk=P(k,i*.003,.25);if(kk<=0)continue;const r=Math.floor(i/cols),c=i%cols;ctx.save();ctx.globalAlpha*=kk;head28(x0+c*cell+cell/2,y0+r*cell+cell/2+6,sz,colFn(i));ctx.restore();}}
/* 천 원짜리 한 장 */
function bill28(x,y,w,h,o={}){ctx.save();ctx.globalAlpha*=(o.alpha??1);ctx.fillStyle='#7a8f6a';rr(x,y,w,h,8);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;rr(x+6,y+6,w-12,h-12,6);ctx.stroke();text('1,000',x+w/2,y+h/2+2,{f:'D',s:30,c:'rgba(255,255,255,.6)'});ctx.restore();}
/* 0 을 기준으로 좌우로 뻗는 막대 */
function dbar(x0,y,v,scale,h,col,label){const w=v*scale;ctx.fillStyle=col;if(w>=0)rr(x0,y-h/2,Math.max(4,w),h,h/4);else rr(x0+w,y-h/2,-w,h,h/4);ctx.fill();if(label)text(label,w>=0?x0+w+16:x0+w-16,y+2,{a:w>=0?'left':'right',f:'D',s:42,c:col});}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3')){
      const a=L('o1');
      bath28(470,470,1.05*E.back(P(a,0,.5))+.001,{});
      text('그림은 예시 · 실제 가게 아님',470,800,{s:26,w:800,c:C.dim,alpha:P(a,.4,.3)});
      group(1340,260,1,0,P(a,0,.3),()=>{panel(-480,-110,960,220,{bd:CW,bg:'rgba(6,13,32,.7)'});text('서울 대중목욕탕 한 번 · 평균 (2026.7)',-440,-56,{a:'left',f:'D',s:34,c:C.dim,max:880});});
      big('o1',0,1340,310,'1만 1,000원',{f:'D',s:90,c:CW});
      if(L('o2')>=0){group(1340,520,1,0,P(L('o2'),0,.3),()=>{panel(-480,-110,960,220,{bd:CP,bg:'rgba(6,13,32,.7)'});text('손님 한 명이 더 오면 · 사장님 몫',-440,-56,{a:'left',f:'D',s:34,c:C.dim,max:880});});
        big('o2',0,1340,570,'1만 원',{f:'D',s:90,c:CP});}
      srcLine('소비자24 개인서비스요금 · 서울 성인 일반 대중탕 1회 평균 11,000원 (한국경제 2026.9.27) · 1만 원 = 값 − 수건·비누 1,000원 (예시)');
    }else if(T<CT('o4')){
      const b=L('o3');
      group(560,420,1,0,P(b,0,.3),()=>{panel(-380,-170,760,340,{bd:CY,bg:'rgba(6,13,32,.7)'});text('단골',0,-100,{f:'D',s:44,c:C.dim});});
      big('o3',0,560,450,'−10%',{f:'D',s:120,c:CY});
      group(1360,420,1,0,P(b,.3,.3),()=>{panel(-380,-170,760,340,{bd:CR,bg:'rgba(6,13,32,.7)'});text('남는 돈',0,-100,{f:'D',s:44,c:C.dim});});
      big('o3',1,1360,450,'−60%',{f:'D',s:120,c:CR});
      if(L('o3b')>=0&&L('o3c')<0)stampBox('해마다 조금씩 · 복리로 줄어든다',960,720,K('o3b',0),{s:50,c:C.gold,bg:'rgba(40,30,0,.92)'});
      if(L('o3c')>=0){const k=L('o3c');group(960,720,1,0,P(k,0,.3),()=>{for(let i=0;i<9;i++)head28(-700+i*54,30,3,i%3===1?'rgba(255,255,255,.15)':CY);text('빈자리는 새 손님이?',-180,10,{f:'D',s:56,c:C.gold,a:'left',max:760});});}
      srcLine('예시 계산: 단골 300 → 270명 · 남는 돈 400만 → 160만 원 (python3) · 손님 수·비용은 예시 가정');
    }else{
      const k9=L('o4'),k10=L('o5');
      text('목욕탕 장부에서 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['목욕료 · 소비자24','목욕탕 수 · 복지부 · 보도','손님 수 · 비용 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.6,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('동네 목욕탕 계산서',960,200,{f:'D',s:110,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('목욕 한 번 1만 1,000원 · 단골 한 명 = 한 달 8만 원 · 해마다 10%',960,325,{s:44,w:900,alpha:P(a,.3,.3),max:1780});
    bath28(560,620,.7,{alpha:P(a,.2,.3)});tub28(1130,700,.65,{alpha:P(a,.3,.3)});drawMascot(1600,660,.7,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 목욕탕 ── */
  setup:{draw(){
    sub('p1','p2',()=>{
      bath28(430,480,.95,{});
      text('예시 목욕탕',1300,200,{f:'D',s:50,c:C.gold});
      if(L('p2')>=0){const q=K('p2',0);
        text('아침 6시 · 손님은 거의 다 동네 단골',1300,280,{f:'D',s:38,c:C.dim,max:950});
        text('단골',1060,380,{f:'D',s:44,c:C.dim,a:'left'});text(q>=0?'300명':'?',1540,380,{f:'D',s:80,c:q>=0?CY:C.gold,a:'right'});
        if(q>=0)crowd28(880,440,300,30,28,()=>CY,q,1.5);
        if(T>FR('p2',.75))pill('일주일에 두 번씩',1300,790,{s:32,bg:'rgba(255,255,255,.92)'});}
      srcLine('예시 가정 · 단골 수·방문 횟수는 계산을 위한 예');});
    sub('p3','p3',()=>{
      text('한 달 입장',960,190,{f:'D',s:54,c:C.gold});
      text('300명 × 한 달 8번',960,330,{f:'D',s:60});
      big('p3',0,960,450,'= 2,400번',{f:'D',s:90,c:CY});
      if(T>KT('p3',0)+.5)text('× 1만 1,000원',960,580,{f:'D',s:56,c:C.dim});
      big('p3',1,960,710,'= 한 달 매출 2,640만 원',{f:'D',s:80,c:CW});
      srcLine('300 × 8 = 2,400 · × 11,000 = 26,400,000 (python3) · 예시 가정');});
    sub('p4','p5',()=>{
      const rows=[['탕 데우는 연료비','900만',null,.12],['사람','600만',null,.3],['월세','300만',null,.42],['전기·수도 기본·수리','200만',null,.6]];
      const vis=rows.filter(r=>T>FR('p4',r[3])).map(r=>[r[0],r[1]]);
      const q=K('p4',0);vis.push(['= 고정비',q>=0?'2,000만':'?','#d62f2f']);
      receipt(560,470,1,vis,{title:'한 달 나가는 돈 (예시)'});
      if(L('p4b')>=0)group(1360,330,1,0,P(L('p4b'),0,.3),()=>{panel(-440,-110,880,220,{bd:CSO,bg:'rgba(6,13,32,1)'});text('+ 손님 한 번마다',0,-40,{f:'D',s:40,c:C.dim});text('수건·비누·물 1,000원',0,40,{f:'D',s:54,c:CSO,max:820});});
      if(L('p5')>=0)group(1360,640,1,0,P(L('p5'),0,.3),()=>{panel(-440,-100,880,200,{bd:'rgba(255,255,255,.4)',bg:'rgba(6,13,32,1)'});text('수도권 한 사우나 · 유지비',0,-36,{f:'D',s:36,c:C.dim,max:820});text('한 달 3,000만 원 정도 (보도)',0,38,{f:'D',s:46,max:820});});
      srcLine('비용 항목·금액은 예시 가정 · 수도권 사우나 유지비 월 3,000만 원 정도: 한국경제 2026.4.15');});
  }},
  /* ── 1만 1,000원 쪼개기 (천 원짜리 열한 장) ── */
  cut:{draw(){
    const X0=140,WW=1640,Y=300,HH=200,bw=WW/11;
    text('목욕 한 번 1만 1,000원 = 천 원짜리 열한 장',960,190,{f:'D',s:52,c:C.gold,max:1800});
    const k1=L('s1');
    for(let i=0;i<11;i++){const k=E.back(P(k1,.1+i*.06,.3));if(k<=0)continue;bill28(X0+i*bw+4,Y,bw-8,HH,{alpha:Math.min(1,k)});}
    const segs=[[3750,'연료비',CF,KT('s2',0)],[2500,'사람',CSF,FR('s3',.08)],[1250,'월세',CRT,FR('s3',.3)],[833,'전기·수도·수리',CET,FR('s3',.52)],[1000,'수건·비누',CSO,FR('s3',.8)],[1667,'남는 돈',CP,KT('s4',0)]];
    let acc=0;segs.forEach(([v,l,col,t0],i)=>{const x=X0+acc/1000*bw,w=v/1000*bw;acc+=v;if(L('s2')<0||T<t0)return;const k=E.out(P(T,t0,.5));
      ctx.save();ctx.globalAlpha*=.88;ctx.fillStyle=col;rr(x+2,Y,(w-4)*k,HH,8);ctx.fill();ctx.restore();
      const ly=i%2?650:560;ctx.strokeStyle=col;ctx.lineWidth=3;line(x+w/2,Y+HH+8,x+w/2,ly-40);
      text(l,x+w/2,ly-10,{f:'D',s:30,c:col,max:Math.max(180,w+40)});text(v.toLocaleString('ko-KR')+'원',x+w/2,ly+34,{f:'D',s:38,c:'#fff'});});
    if(L('s5')>=0)stampBox('평균일 뿐 · 고정비는 손님 수와 상관없다',960,780,L('s5'),{s:46,c:C.gold,bg:'rgba(40,30,0,.92)'});
    srcLine('고정비 2,000만 ÷ 2,400번 (연료 3,750 · 사람 2,500 · 월세 1,250 · 기타 833) + 소모품 1,000 + 남는 돈 1,667 = 11,000 (python3) · 예시 가정');
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='26,400,000 − 2,400,000 − 20,000,000 =';bigS='4,000,000';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:22,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:done?84:76,f:'D',c:done?'#1a7a44':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('매출 − 소모품 − 고정비',1320,180,{f:'D',s:44,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0),X0=920,WW=820,MX=2700;
    [['매출',2640,'2,640만',CW,CT('c2')],['소모품',240,'240만',CSO,FR('c2',.3)],['고정비',2000,'2,000만',CF,FR('c2',.5)]].forEach(([l,v,lb,col,t0],i)=>{const y=290+i*110;if(L('c2')<0)return;const k=E.out(P(T,t0,.5));text(l,X0,y-44,{a:'left',f:'D',s:32,c:C.dim});hbar(X0,y,WW,56,v*k,MX,col,T>t0?lb:'',{s:38});});
    text('한 달 남는 돈',X0,580,{a:'left',f:'D',s:40});hbar(X0,640,WW,74,q2>=0?400*E.out(P(q2,0,.6)):0,MX,CP,q2>=0?'400만 원':'?',{s:50,lc:q2>=0?CP:C.gold});
    if(dt>=0&&q2<0)group(1300,690,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(L('c3')>=0&&L('c4')<0)pill('새벽부터 밤까지 · 부부 둘이 일해서',1330,770,{s:32,bg:'rgba(255,255,255,.94)',alpha:P(L('c3'),.1,.3)});
    if(L('c4')>=0)group(1330,770,1,0,P(L('c4'),0,.3),()=>{panel(-440,-50,880,100,{bg:'rgba(6,13,32,1)',bd:CY});text('그럼 단골 한 명은 얼마짜리?',0,4,{f:'D',s:42,c:CY,max:840});});
  }},
  /* ── 단골 한 명의 값 ── */
  regular:{draw(){
    sub('r1','r3b',()=>{
      const out=L('r3')>=0;
      group(420,470,1,0,1,()=>{head28(0,40,14,out?'rgba(255,255,255,.25)':CY);});
      text(out?'안 오면':'단골 한 명',420,720,{f:'D',s:48,c:out?CR:CY});
      const q1=K('r1',0);
      group(1240,250,1,0,P(L('r1'),0,.3),()=>{panel(-560,-70,1120,140,{bg:'rgba(6,13,32,1)',bd:CW});text('한 번 1만 1,000원 − 수건·비누 1,000원',-520,4,{a:'left',f:'D',s:36,max:700});text(q1>=0?'= 1만 원':'?',520,4,{a:'right',f:'D',s:52,c:q1>=0?CP:C.gold});});
      if(L('r2')>=0){const q=K('r2',0);group(1240,410,1,0,P(L('r2'),0,.3),()=>{panel(-560,-70,1120,140,{bg:'rgba(6,13,32,1)',bd:CP});text('× 한 달 8번',-520,4,{a:'left',f:'D',s:40});text(q>=0?'= 한 달 8만 원':'?',520,4,{a:'right',f:'D',s:56,c:q>=0?CP:C.gold});});}
      if(out){group(1240,570,1,0,P(L('r3'),0,.3),()=>{panel(-560,-70,1120,140,{bg:'rgba(40,0,0,.9)',bd:CR});text('한 명이 안 오면',-520,4,{a:'left',f:'D',s:40});text('−8만 원',520,4,{a:'right',f:'D',s:56,c:CR});});
        if(L('r3b')<0)tub28(1240,760,.6,{});}
      if(L('r3b')>=0)group(1240,740,1,0,P(L('r3b'),0,.3),()=>{panel(-560,-70,1120,140,{bg:'rgba(6,13,32,1)',bd:CR});text('1년이면',-520,4,{a:'left',f:'D',s:40});text('−96만 원',520,4,{a:'right',f:'D',s:56,c:CR});});
      srcLine('11,000 − 1,000 = 10,000 · × 8 = 80,000 · × 12 = 960,000 (python3) · 고정비는 손님 수와 상관없이 나간다고 가정');});
    sub('r4','r6',()=>{
      const X0=160,Y0=250,CELL=34;
      const q4=K('r4',0),q5=K('r5',0),r6=L('r6');
      crowd28(X0,Y0,300,20,CELL,i=>{if(r6>=0&&i>=270)return 'rgba(255,255,255,.14)';if(q4<0)return 'rgba(255,255,255,.55)';return i<250?CY:CP;},1,2.0);
      if(q4>=0){const yb=Y0+12.5*CELL;ctx.save();ctx.strokeStyle='#fff';ctx.setLineDash([10,8]);ctx.lineWidth=4;line(X0-10,yb,X0+20*CELL+10,yb);ctx.restore();}
      const RX=1340;
      text('고정비 2,000만 ÷ 단골 한 명 8만',RX,200,{f:'D',s:42,c:C.gold,max:1000});
      big('r4',0,RX,320,'본전 단골 250명',{f:'D',s:72,c:CY});
      if(q5>=0)group(RX,470,1,0,P(q5,0,.3),()=>{panel(-440,-70,880,140,{bg:'rgba(0,40,20,.9)',bd:CP});text('여유',-400,4,{a:'left',f:'D',s:40});text('50명 = 여섯 명 중 한 명',400,4,{a:'right',f:'D',s:46,c:CP,max:620});});
      if(r6>=0){group(RX,615,1,0,P(r6,0,.3),()=>{panel(-440,-110,880,220,{bg:'rgba(6,13,32,1)',bd:CR});text('단골 −10% (30명)',0,-50,{f:'D',s:42,c:CY});
        text(K('r6',0)>=0?'남는 돈 400만 → 160만 원':'남는 돈 ?',0,30,{f:'D',s:50,c:K('r6',0)>=0?CR:C.gold,max:840});});
        if(K('r6',1)>=0)stampBox('손님 −10% · 남는 돈 −60%',RX,815,K('r6',1),{s:48,c:CR,bg:'rgba(40,0,0,.92)'});}
      srcLine('20,000,000 ÷ 80,000 = 250 · 270 × 80,000 − 20,000,000 = 1,600,000 (python3) · 사람 하나 = 단골 한 명 · 예시 가정');});
  }},
  /* ── 단골은 복리로 줄어든다 ── */
  decay:{draw(){
    sub('d1','d3',()=>{
      text('단골이 해마다 10%씩 줄면 (예시)',960,175,{f:'D',s:50,c:C.gold});
      const N=[300,270,243,219,197,177],V=[400,160,-56,-250,-425,-583],X0=330,DX=250,Z=545,SC=.36;
      const on=[CT('d1')+.6,CT('d2')+.3,KT('d2',0),CT('d2b')+.3,FR('d2b',.25),KT('d3',0)];
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;line(200,Z,1780,Z);text('0원',190,Z,{a:'right',s:26,w:900,c:C.dim});
      N.forEach((n,i)=>{const x=X0+i*DX;text(i===0?'지금':i+'년 뒤',x,250,{f:'D',s:34,c:'#c9ced9'});
        if(T<on[i]){if(L('d2')>=0||i===0)text('?',x,300,{f:'D',s:40,c:C.gold});return;}
        const k=E.out(P(T,on[i],.5));text(n+'명',x,300,{f:'D',s:40,c:CY});
        const v=V[i]*k,h=Math.abs(v)*SC,col=v>=0?CP:CR;ctx.fillStyle=col;if(v>=0)rr(x-70,Z-h,140,h,10);else rr(x-70,Z,140,h,10);ctx.fill();
        if(k>.9)text((V[i]>0?'+':'')+V[i]+'만',x,V[i]>=0?Z-h-30:Z+h+32,{f:'D',s:36,c:col});});
      srcLine('300 × 0.9^n · 단골 × 8만 − 2,000만 (python3) · 줄어드는 비율 10%는 예시 가정');});
    sub('d4','d4',()=>{
      text('10%씩 다섯 번 = 50%?',960,190,{f:'D',s:56,c:C.gold});
      const X0=420,WW=1200;
      text('생각',X0-30,330,{a:'right',f:'D',s:42,c:C.dim});hbar(X0,330,WW,80,50,100,'rgba(255,255,255,.35)','50%',{s:46,lc:'#fff'});
      ctx.save();ctx.strokeStyle=CR;ctx.lineWidth=8;line(X0+WW*.5+40,300,X0+WW*.5+150,360);ctx.restore();
      const q=K('d4',0);text('실제',X0-30,470,{a:'right',f:'D',s:42,c:CY});hbar(X0,470,WW,80,q>=0?41*E.out(P(q,0,.6)):0,100,CY,q>=0?'41%':'?',{s:46,lc:q>=0?CY:C.gold});
      if(T>FR('d4',.6)){const xx=X0+WW*.167;ctx.save();ctx.strokeStyle=CR;ctx.setLineDash([10,8]);ctx.lineWidth=5;line(xx,260,xx,560);ctx.restore();
        group(xx+20,650,1,0,P(T,FR('d4',.6),.3),()=>{panel(-60,-60,900,120,{bg:'rgba(40,0,0,.92)',bd:CR});text('남는 돈 0원 = 단골 −17% (50명)',-30,4,{a:'left',f:'D',s:42,c:CR,max:850});});}
      srcLine('1 − 0.9^5 = 0.41 · 50 ÷ 300 = 16.7% (python3)');});
    sub('d5','d6',()=>{
      text('전국 목욕장 영업소 (곳)',960,175,{f:'D',s:50,c:C.gold});
      const Y=['2000','2010','2015','2020','2025'],V=[8904,8426,7467,6529,5656],X0=260,DX=235,BASE=740,HH=430,MX=9500,k5=L('d5'),q=K('d5',0);
      V.forEach((v,i)=>{const t0=i<4?CT('d5')+.8+i*.5:KT('d5',0);if(T<t0){text(Y[i],X0+i*DX,BASE+40,{s:30,w:900,c:'#c9ced9'});return;}const k=E.out(P(T,t0,.5)),h=HH*v/MX*k,x=X0+i*DX,col=i===4?CR:CET;ctx.fillStyle=col;rr(x-75,BASE-h,150,h,10);ctx.fill();if(k>.9)text(v.toLocaleString('ko-KR'),x,BASE-h-30,{f:'D',s:38,c:col});text(Y[i],x,BASE+40,{s:30,w:900,c:'#c9ced9'});});
      if(q>=0&&L('d6')<0)stampBox('2020년보다 −13.3%',1500,330,q+.5,{s:50,c:CR,bg:'rgba(40,0,0,.92)'});
      if(L('d6')>=0)group(1520,330,1,0,P(L('d6'),0,.3),()=>{panel(-360,-90,720,180,{bg:'rgba(6,13,32,1)',bd:CY});text('서울 663곳 중 132곳',0,-30,{f:'D',s:44,c:CY});text('문 연 지 30년 넘음 (19.9%)',0,36,{f:'D',s:36,max:680});});
      srcLine('보건복지부 자료(김선민 의원실) — 한국경제 2026.4.15 · 서울시 인허가 기준 663곳 · 국가통계포털은 2025년 5,668곳으로 집계 기준이 달라 섞지 않음');});
    sub('d7','d8',()=>{
      bath28(400,460,.85,{dim:true});
      group(1260,300,1,0,P(L('d7'),0,.3),()=>{panel(-560,-110,1120,220,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.4)'});text('경북 김천 · 25년째 한 사장님 (보도)',0,-50,{f:'D',s:36,c:C.dim,max:1060});text('단골인 동네 어르신들이 줄어든다',0,30,{f:'D',s:48,max:1060});});
      if(T>FR('d7',.55))group(1260,560,1,0,P(T,FR('d7',.55),.3),()=>{ctx.fillStyle='#fff';rr(-560,-80,1120,160,30);ctx.fill();ctx.beginPath();ctx.moveTo(-300,80);ctx.lineTo(-340,126);ctx.lineTo(-240,80);ctx.fill();text('“요새는 코로나 때보다 손님이 없다”',0,4,{f:'D',s:44,c:C.ink,max:1060});});
      if(T>FR('d7',.55))text('서울 영등포 한 목욕탕 직원',1260,690,{s:28,w:900,c:C.dim});
      if(L('d8')>=0)pill('오늘의 10%는 예시 · 단골 감소율 공식 통계는 못 찾음',960,800,{s:32,bg:'rgba(255,255,255,.95)',alpha:P(L('d8'),.1,.3)});
      srcLine('한국경제 2026.4.15 \'물 끓이기 너무 비싸…동네 목욕탕 사라진다\' (김천 사장님 말은 기사 요약, 영등포 직원 말은 기사 인용)');});
  }},
  /* ── 새 손님은 한 달에 한 번 ── */
  newbie:{draw(){
    sub('n1','n3',()=>{
      text('새 손님이 메워 줄까?',960,190,{f:'D',s:56,c:C.gold});
      if(L('n2')>=0){group(600,470,1,0,P(L('n2'),0,.3),()=>{panel(-420,-200,840,400,{bd:CW,bg:'rgba(6,13,32,.8)'});text('한 쇼핑 앱 · 사우나 검색',0,-130,{f:'D',s:40,c:C.dim});text('2026년 1~9월 · 1년 전보다',0,140,{s:30,w:900,c:C.dim});});
        big('n2',0,600,480,'23배',{f:'D',s:160,c:CW});}
      if(L('n3')>=0)group(1380,470,1,0,P(L('n3'),0,.3),()=>{tub28(0,-60,.8,{});text('“대형 목욕탕 이야기일 뿐”',0,140,{f:'D',s:46,c:C.gold,max:800});text('서울 한 목욕탕 관계자 (보도)',0,210,{s:28,w:900,c:C.dim});});
      srcLine('29CM 검색 데이터 — 비즈워치 2026.10.7 · 서울 목욕탕 관계자·영등포 직원 말 — 한국경제 2026.4.15');});
    sub('n4','n7',()=>{
      const q5=K('n5',0);
      text('단골 한 명',420,220,{f:'D',s:46,c:CY});head28(420,440,11,CY);text('주 2번 · 한 달 8만 원',420,620,{f:'D',s:40,c:CY});
      text('새 손님 (예시)',1330,220,{f:'D',s:46,c:CW});
      const n=q5>=0?Math.min(8,1+Math.floor(P(q5,0,1.2)*7)):(L('n4')>=0?1:0);
      for(let i=0;i<n;i++)head28(1060+(i%4)*180,360+Math.floor(i/4)*150,4.6,CW);
      if(K('n4',0)>=0)text('한 달 1번 · 1만 원씩',1330,620,{f:'D',s:40,c:CW});
      if(q5>=0)popText(q5+.3,800,440,'=',{f:'D',s:110,c:'#fff'});
      if(L('n6')>=0)group(960,740,1,0,P(L('n6'),0,.3),()=>{panel(-640,-70,1280,140,{bg:'rgba(6,13,32,1)',bd:CR});text('해마다 떠나는 단골 30명',-600,4,{a:'left',f:'D',s:40,max:620});text(K('n6',0)>=0?'→ 새 손님 240명':'?',600,4,{a:'right',f:'D',s:56,c:K('n6',0)>=0?CR:C.gold,max:620});});
      if(L('n6b')>=0&&L('n7')<0)pill('한 달에 스무 명씩 · 빠짐없이',960,840,{s:30,bg:'rgba(255,255,255,.95)',alpha:P(L('n6b'),.1,.3)});
      if(L('n7')>=0)stampBox('사람 수보다 오는 횟수',960,480,L('n7'),{s:60,c:C.gold,bg:'rgba(40,30,0,.95)'});
      srcLine('80,000 ÷ 10,000 = 8 · 30 × 8 = 240 · ÷ 12 = 20 (python3) · 새 손님이 한 달 한 번 온다는 건 예시 가정');});
  }},
  /* ── 길 건너 4,000원 목욕탕 (어두운 장) ── */
  public:{draw(){
    sub('u1','u3',()=>{
      bath28(470,430,.8,{price:'민간 9,000원 정도'});
      const q=K('u2',0);
      group(1400,430,.8,0,P(L('u1'),.3,.3),()=>{ctx.fillStyle='#dfe7ee';rr(-260,-120,520,330,12);ctx.fill();ctx.fillStyle='#2f7d5a';ctx.fillRect(-280,-140,560,40);ctx.fillStyle='#2f7d5a';rr(-210,-90,420,84,12);ctx.fill();text('복지회관 목욕탕',0,-46,{f:'D',s:44,c:'#fff',max:390});
        for(let i=0;i<4;i++){ctx.fillStyle='#bfe3f5';rr(-230+i*120,30,90,60,8);ctx.fill();}ctx.fillStyle='#5a6470';rr(-70,110,140,100,8);ctx.fill();
        ctx.fillStyle='rgba(6,13,32,.92)';rr(-200,228,400,68,34);ctx.fill();text(q>=0?'어른 4,000원':'?',0,264,{f:'D',s:40,c:q>=0?CP:C.gold});});
      if(L('u3')>=0)group(960,770,1,0,P(L('u3'),0,.3),()=>{panel(-800,-70,1600,140,{bg:'rgba(6,13,32,1)',bd:CR});text('한 달 매출 1,500만 원 정도',-760,4,{a:'left',f:'D',s:38,max:620});text(K('u3',0)>=0?'한 해 적자 1억 5,000만 → 시가 2억 가까이':'?',760,4,{a:'right',f:'D',s:40,c:CR,max:900});});
      srcLine('경북매일 2026.2.19 (포항 한 공공 복지회관 목욕탕 어른 4,000원 · 민간 약 9,000원 · 월 매출 1,500만 · 연 적자 약 1억 5,000만 · 시 보전 2억 가까이)');});
    sub('u4','u4',()=>{
      const X0=160,Y0=270,CELL=34,q=K('u4',0),tm=T-FR('u4',.35),mv=tm>=0?E.io(P(tm,0,1.2)):0;
      text('단골 270명 중 30%가 옮겨 가면 (예시)',960,190,{f:'D',s:48,c:C.gold});
      for(let i=0;i<270;i++){const r=Math.floor(i/18),c=i%18;let x=X0+c*CELL+CELL/2,y=Y0+r*CELL+CELL/2+6;const go=i>=189;if(go){x=lerp(x,1380+((i-189)%9)*34,mv);y=lerp(y,330+Math.floor((i-189)/9)*34,mv);}head28(x,y,2.0,go?CP:CY);}
      if(tm>=0)text('81명',1530,300,{f:'D',s:44,c:CP,alpha:P(tm,1,.3)});
      if(q>=0)group(1530,720,1,0,P(q,0,.3),()=>{panel(-340,-90,680,180,{bg:'rgba(40,0,0,.92)',bd:CR});text('남은 189명 · 남는 돈',0,-34,{f:'D',s:36,c:C.dim});text('−488만 원',0,40,{f:'D',s:64,c:CR});});
      srcLine('270 × 0.7 = 189 · 189 × 80,000 − 20,000,000 = −4,880,000 (python3) · 옮겨 가는 비율 30%는 예시 가정');});
    sub('u5','u6',()=>{
      group(520,400,1,0,P(L('u5'),0,.3),()=>{panel(-400,-180,800,360,{bd:CP,bg:'rgba(6,13,32,1)'});text('공공 목욕탕이 필요하다',0,-110,{f:'D',s:42,c:CP,max:760});text('집에서 물 데우기 부담스러운',0,-30,{s:32,w:900,max:760});text('어르신들 (전문가 의견)',0,20,{s:32,w:900,max:760});text('태백 · 25억 원 · 두 번째 공공 목욕탕',0,100,{f:'D',s:34,c:C.gold,max:760});});
      group(1400,400,1,0,P(L('u5'),.6,.3),()=>{panel(-400,-180,800,360,{bd:CR,bg:'rgba(6,13,32,1)'});text('동네 목욕탕 장부',0,-110,{f:'D',s:42,c:CR,max:760});text('떠나는 단골 한 명',0,-10,{f:'D',s:44,max:760});text('= 한 달 8만 원',0,70,{f:'D',s:56,c:CR,max:760});});
      if(L('u6')>=0)stampBox('어느 쪽이 맞다고 단정하지 않는다',960,720,L('u6'),{s:48,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('코리아헤럴드 2026.4.16 (건양사이버대 교수 의견 · 태백 25억 원, 2028년까지 두 번째 공공 목욕탕)');});
  }},
  /* ── 숫자를 바꾸는 손잡이 ── */
  knob:{draw(){
    const Z=900,SC=1.9;
    sub('k1','k3',()=>{
      text('손잡이 ① 값 · 단골 243명일 때 (2년째)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;line(Z,260,Z,620);text('0원',Z,650,{s:26,w:900,c:C.dim});
      text('1만 1,000원',200,280,{a:'left',f:'D',s:40});dbar(Z,350,L('k2')>=0?-56:0,SC,90,CR,L('k2')>=0?'−56만':'');
      const q=K('k2',0);text('1만 2,000원',200,450,{a:'left',f:'D',s:40,c:q>=0?CP:'rgba(255,255,255,.3)'});dbar(Z,520,q>=0?138*E.out(P(q,0,.6)):0,SC,90,CP,q>=0?'+138만':'?');
      if(L('k3')>=0)group(960,760,1,0,P(L('k3'),0,.3),()=>{panel(-700,-70,1400,140,{bg:'rgba(6,13,32,1)',bd:CY});text('올린 탓에 22명(열에 하나)이 더 떠나도 본전',0,4,{f:'D',s:44,c:CY,max:1340});});
      srcLine('243 × 8 × 11,000 − 2,000만 = 138만 · 243 × 8 × 10,000 ÷ (8 × 11,000) = 220.9명 (python3) · 예시 가정');});
    sub('k4','k4',()=>{
      text('손잡이 ② 연료비 +10% (한 달 +90만 원)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const X0=620,WW=1000,MX=300,q=K('k4',0);
      text('지금',X0-30,360,{a:'right',f:'D',s:44,c:CY});hbar(X0,360,WW,96,250,MX,CY,'본전 250명',{s:46});
      text('연료비 +10%',X0-30,540,{a:'right',f:'D',s:44,c:q>=0?CF:'rgba(255,255,255,.3)'});hbar(X0,540,WW,96,q>=0?262*E.out(P(q,0,.6)):0,MX,CF,q>=0?'본전 262명':'?',{s:46,lc:q>=0?CF:C.gold});
      srcLine('(20,000,000 + 900,000) ÷ 80,000 = 261.25 → 262명 (python3) · 예시 가정');});
    sub('k5','k6',()=>{
      text('손잡이 ③ 오는 횟수 · 단골 300명 그대로',960,170,{f:'D',s:50,c:C.gold,max:1800});
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;line(Z,260,Z,620);text('0원',Z,650,{s:26,w:900,c:C.dim});
      text('주 2번 (한 달 8번)',200,280,{a:'left',f:'D',s:40});dbar(Z,350,400,SC*.9,90,CP,'+400만');
      const q=K('k5',0);text('주 1번 반 (한 달 6번)',200,450,{a:'left',f:'D',s:40,c:q>=0?CR:'rgba(255,255,255,.3)'});dbar(Z,520,q>=0?-200*E.out(P(q,0,.6)):0,SC*.9,90,CR,q>=0?'−200만':'?');
      if(L('k6')>=0)stampBox('안 떠나도 · 덜 오기만 해도 적자',960,770,L('k6'),{s:50,c:CR,bg:'rgba(40,0,0,.92)'});
      srcLine('300 × 6 × 10,000 − 20,000,000 = −2,000,000 (python3) · 예시 가정');});
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('q1'),ov=L('q7');
    text('목욕탕 장부, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)*(ov>=0?1-P(ov,0,.3):1),max:1800});
    const cards=[['q2','단골 한 명의 값','한 번 남는 돈 × 오는 횟수','오늘: 한 달 8만 원'],['q3','본전 단골 수','고정비 ÷ 단골 한 명의 값','오늘: 250명'],['q4','여유 인원','지금 단골 − 본전','오늘: 50명 = 여섯 명 중 하나'],
      ['q5','해마다 줄어드는 비율','10%면 2년째 적자','오늘: 243명 → −56만'],['q6','새 손님이 오는 횟수','한 달 한 번이면','오늘: 단골 1명 = 새 손님 8명']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:34,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,500,1,0,P(ov,0,.3),()=>{panel(-800,-320,1600,620,{bg:'rgba(6,13,32,1)',bd:C.gold});text('단골 200명 · 한 달 6번 · 9,000원 · 소모품 1,000원 · 고정비 1,000만',0,-240,{f:'D',s:38,max:1500});text('한 달 남는 돈은?',0,-170,{f:'D',s:44,max:1500,c:C.gold});
      const b=L('q7b');
      if(b>=0)text('8,000 × 6 = 4만 8,000 · × 200명 = 960만 − 1,000만',0,-60,{f:'D',s:42,alpha:P(b,0,.3),max:1500});
      const k=K('q7b',0);if(k>=0)text('−40만 원',0,90,{f:'D',s:130,c:CR,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,90,{f:'D',s:120,c:C.gold});
      if(L('q7c')>=0)text('본전 단골 209명 · 아홉 명만 더',0,230,{s:40,w:900,c:'#ffd0a3',alpha:P(L('q7c'),0,.3),max:1500});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('동네 목욕탕 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      bath28(400,480,.75,{alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['서울 목욕료 평균 (2026.7)','1만 1,000원',CW,b,.2],['손님 한 번 더 · 단골 한 명','1만 원 · 한 달 8만 원',CP,b,2.6],['단골 −10%','남는 돈 −60% · 해마다면 2년째 적자',CR,b2,.3]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;group(1300,320+i*160,1,0,kk,()=>{panel(-560,-65,1120,130,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-520,4,{a:'left',f:'D',s:32,max:400});text(v,520,4,{a:'right',f:'D',s:34,c:col,max:640});});});
    }else{
      bath28(520,500,.75,{});tub28(1120,600,.55,{});drawMascot(1620,540,.55,'happy');
      stampBox('목욕탕의 장부 = 오늘 손님 수가 아니라 단골의 나이',960,790,c,{s:42,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      if(L('z4')>=0&&L('z4b')<0)pill('예시 가정 · 창업 권유 아님',1560,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-520,-70,1040,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 우리 동네 목욕료 · 일주일에 몇 번?',0,4,{s:40,w:900,c:C.ink,max:980});});
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
