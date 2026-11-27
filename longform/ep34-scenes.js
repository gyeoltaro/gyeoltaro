/* ════════════════════════════════════════════════════════════════════
   장면 (LF.34 커피 가맹점 재계약 리뉴얼 계산서 —
   가맹사업법 [법률 제21857호, 2026.10.2 시행] 제12조의2(부당한 점포환경개선 강요 금지)·제13조(가맹계약의 갱신, 10년) ·
   같은 법 시행령 [대통령령 제36561호, 2026.8.4 시행] 제13조의2(정당한 사유 · 간판·인테리어만 · 20%/40% · 90일 · 3년 안 종료면 비례 환수) — 국가법령정보센터 원문 ·
   서울시 2024 가맹사업 등록현황(매일경제 2025.7.1): 2023년 말 창업비 1억 1,300만 · 인테리어 5,150만(45.6%) · 가맹비 1,070만 · 평균 28평 · 평당 190만 ·
   비즈한국 2023.6.28: 평균 4~5년 주기 리뉴얼 요구 · 2018 한 치킨 본사 '요청서' 과징금 3억 · 공정위 실태조사(뉴데일리 2019.1.30): 1,250건 · 자발 40.3% · 본부 부담 평균 1,510만 · 63%)
   예시 가게: 20평 · 처음 인테리어 3,800만 · 월 몫 300만 · 리뉴얼 4,000만(간판·인테리어 3,000 + 머신·집기 1,000)
   중심 그림: 커피 가게 앞모습(낡음 → 새것) · 만 원짜리 300장 · 견적서·요청서 종이 · 10년 띠.
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['4','0','0','0','0','0','0','0','÷','6','0','='];   // 40,000,000 ÷ 60 = 666,666.7 (4 뒤 0 일곱)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CMINE='#FF4D4D', CHQ='#35E08A', CEQ='#8d96a8', CY='#FFC531', CINT='#B98CFF', CFEE2='#6FA8FF', CREST='#5d6678', CBRN='#c98b4a';
/* 커피 가게 앞모습 (상표 없음) · o.old 낡음 · o.work 공사 중 · o.fresh 새 단장 */
function shop34(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  const wall=o.old?'#8a7a68':'#f3ead9',aw1=o.old?'#7a4f3a':'#c0392b',aw2=o.old?'#a89a88':'#fdf6e8';
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,232,300,14,0,0,7);ctx.fill();
  ctx.fillStyle=wall;rr(-260,-200,520,430,10);ctx.fill();
  ctx.fillStyle=o.old?'#4a3a30':'#3b2a20';rr(-240,-180,480,70,8);ctx.fill();
  text('COFFEE',0,-143,{f:'D',s:52,c:o.old?'#b8a690':'#FFC531'});
  for(let i=0;i<8;i++){ctx.fillStyle=i%2?aw2:aw1;ctx.beginPath();ctx.moveTo(-260+i*65,-100);ctx.lineTo(-260+(i+1)*65,-100);ctx.lineTo(-260+(i+1)*65-6,-50);ctx.lineTo(-260+i*65-6,-50);ctx.closePath();ctx.fill();}
  ctx.fillStyle=o.old?'#5d6a72':'#bfe3f7';rr(-235,-30,260,200,6);ctx.fill();
  ctx.strokeStyle=o.old?'#3c3530':'#3b2a20';ctx.lineWidth=8;rr(-235,-30,260,200,6);ctx.stroke();line(-105,-30,-105,170);
  ctx.fillStyle=o.old?'#4a3a30':'#5a3d2b';rr(60,-30,170,258,6);ctx.fill();ctx.fillStyle='#FFC531';ctx.beginPath();ctx.arc(200,110,9,0,7);ctx.fill();
  ctx.fillStyle=o.old?'#6b5d52':'#fff';rr(80,0,130,70,6);ctx.fill();text(o.old?'OPEN':'OPEN',145,37,{f:'D',s:30,c:o.old?'#3c3530':'#c0392b'});
  // 컵 그림 (창 안)
  ctx.fillStyle=o.old?'#9a8a78':'#fff';ctx.beginPath();ctx.moveTo(-200,60);ctx.lineTo(-140,60);ctx.lineTo(-150,140);ctx.lineTo(-190,140);ctx.closePath();ctx.fill();ctx.fillStyle=o.old?'#6b5d52':'#7a4f3a';rr(-205,48,70,16,4);ctx.fill();
  if(o.old){ctx.strokeStyle='rgba(30,20,10,.55)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-250,40);ctx.lineTo(-215,90);ctx.lineTo(-230,140);ctx.stroke();ctx.beginPath();ctx.moveTo(240,-190);ctx.lineTo(205,-150);ctx.stroke();
    ctx.fillStyle='rgba(40,30,20,.35)';rr(-180,-175,90,20,4);ctx.fill();}
  if(o.work){ctx.strokeStyle='#FFC531';ctx.lineWidth=10;[-250,-80,90,250].forEach(px=>line(px,-230,px,230));[-150,0,150].forEach(py=>line(-262,py,262,py));
    ctx.strokeStyle='rgba(255,197,49,.7)';ctx.lineWidth=6;line(-250,-150,-80,0);line(-80,-150,90,0);line(90,-150,250,0);
    [[-200,212],[200,212]].forEach(([cx,cy])=>{ctx.fillStyle='#FF7A1A';ctx.beginPath();ctx.moveTo(cx-22,cy+16);ctx.lineTo(cx,cy-34);ctx.lineTo(cx+22,cy+16);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(cx-12,cy-8,24,8);});}
  if(o.fresh){for(let i=0;i<5;i++){const a=T*2+i*1.3,px=-220+i*110,py=-230+Math.sin(a)*8;ctx.fillStyle='rgba(255,230,120,.9)';ctx.beginPath();for(let j=0;j<8;j++){const r=j%2?6:16,an=j*Math.PI/4;ctx.lineTo(px+Math.cos(an)*r,py+Math.sin(an)*r);}ctx.closePath();ctx.fill();}}
});}
/* 만 원짜리 한 장 */
function bill34(x,y,w,h,col,o={}){ctx.save();ctx.globalAlpha*=(o.alpha??1);ctx.fillStyle=col;rr(x-w/2,y-h/2,w,h,3);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x+w*.22,y,h*.22,h*.3,0,0,7);ctx.stroke();ctx.restore();}
/* 종이 서류 (제목 + 줄들) · lines = [[왼쪽, 오른쪽, 색]] */
function doc34(x,y,s,title,lines,o={}){group(x,y,s,o.rot??-.02,o.alpha??1,()=>{const w=o.w||620,h=o.h||(150+lines.length*74);
  ctx.fillStyle='rgba(0,0,0,.35)';rr(-w/2+12,-h/2+14,w,h,10);ctx.fill();ctx.fillStyle='#fdfbf5';rr(-w/2,-h/2,w,h,10);ctx.fill();
  ctx.fillStyle=o.head||'#2f3a52';rr(-w/2,-h/2,w,84,10);ctx.fill();ctx.fillRect(-w/2,-h/2+60,w,24);text(title,0,-h/2+44,{f:'D',s:o.ts||40,c:'#fff',max:w-40});
  lines.forEach(([l,r,col,t0],i)=>{if(t0!==undefined&&T<t0)return;const yy=-h/2+130+i*74,k=t0!==undefined?P(T,t0,.3):1;ctx.save();ctx.globalAlpha*=k;
    text(l,-w/2+34,yy,{a:'left',f:'D',s:o.ls||32,c:'#2b2f3a',max:w*.58});if(r)text(r,w/2-34,yy,{a:'right',f:'D',s:o.rs||36,c:col||'#2b2f3a',max:w*.42});
    ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=2;line(-w/2+30,yy+34,w/2-30,yy+34);ctx.restore();});
  if(o.sign){text('서명',w/2-180,h/2-44,{f:'D',s:26,c:'#8a8f9c'});ctx.strokeStyle='#2b2f3a';ctx.lineWidth=3;ctx.beginPath();const sx=w/2-140,sy=h/2-44;ctx.moveTo(sx,sy);for(let i=1;i<=20;i++)ctx.lineTo(sx+i*5,sy+Math.sin(i*1.4)*10*Math.min(1,o.sign));ctx.stroke();}
});}
/* 커피 컵 (fill 0~1 만큼 갈색) */
function cup34(x,y,s,fill,o={}){group(x,y,s,0,o.alpha??1,()=>{ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.moveTo(-34,-50);ctx.lineTo(34,-50);ctx.lineTo(26,50);ctx.lineTo(-26,50);ctx.closePath();ctx.fill();
  if(fill>0){ctx.save();ctx.beginPath();ctx.moveTo(-34,-50);ctx.lineTo(34,-50);ctx.lineTo(26,50);ctx.lineTo(-26,50);ctx.closePath();ctx.clip();ctx.fillStyle=o.col||CBRN;const hh=100*Math.min(1,fill);ctx.fillRect(-40,50-hh,80,hh);ctx.restore();}
  ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-34,-50);ctx.lineTo(34,-50);ctx.lineTo(26,50);ctx.lineTo(-26,50);ctx.closePath();ctx.stroke();ctx.fillStyle='#fff';rr(-40,-64,80,16,5);ctx.fill();});}
/* 가격표 */
function tag34(x,y,s,str,col,o={}){group(x,y,s,o.rot??-.05,o.alpha??1,()=>{ctx.font=`400 ${o.fs||48}px ${FD}`;const w=ctx.measureText(str).width+70,h=(o.fs||48)*1.6;
  const path=()=>{ctx.beginPath();ctx.moveTo(-w/2,-h/2);ctx.lineTo(w/2-20,-h/2);ctx.lineTo(w/2+18,0);ctx.lineTo(w/2-20,h/2);ctx.lineTo(-w/2,h/2);ctx.closePath();};
  ctx.fillStyle='#fff';path();ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=6;path();ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(w/2-14,0,7,0,7);ctx.fill();
  if(o.label)text(o.label,-w/2+16,-h/2-24,{a:'left',f:'D',s:26,c:col});
  text(str,-10,3,{f:'D',s:o.fs||48,c:col});});}
/* 화살표 */
function arrow34(x0,y0,x1,y1,col,k=1,o={}){if(k<=0)return;ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=o.lw||10;if(o.dash)ctx.setLineDash(o.dash);
  const cx=(x0+x1)/2+(o.bend||0),cy=(y0+y1)/2-(o.bend||0)*.3;const q=(t)=>[(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*x1,(1-t)*(1-t)*y0+2*(1-t)*t*cy+t*t*y1];
  ctx.beginPath();ctx.moveTo(x0,y0);for(let i=1;i<=30;i++){const t=i/30*k;const [a,b]=q(t);ctx.lineTo(a,b);}ctx.stroke();ctx.setLineDash([]);
  if(k>.95){const [a,b]=q(1),[c2,d]=q(.95),ang=Math.atan2(b-d,a-c2);ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(a-30*Math.cos(ang-.45),b-30*Math.sin(ang-.45));ctx.lineTo(a-30*Math.cos(ang+.45),b-30*Math.sin(ang+.45));ctx.closePath();ctx.fill();}
  ctx.restore();}
/* 결과 상자 (왼쪽 이름 · 오른쪽 값) */
function rowBox(x,y,w,l,v,col,o={}){group(x,y,1,0,o.alpha??1,()=>{panel(-w/2,-50,w,100,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-w/2+36,4,{a:'left',f:'D',s:o.ls||34,max:w*.55});text(v,w/2-36,4,{a:'right',f:'D',s:o.vs||42,c:col,max:w*.42});});}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3')){
      const a=L('o1'),q=K('o1',0);
      shop34(520,500,1.05*E.back(P(a,0,.5))+.001,{old:true});
      text('5년 된 커피 가맹점 · 그림은 예시',520,800,{s:26,w:800,c:C.dim,alpha:P(a,.4,.3)});
      if(q>=0)group(1420,270,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>tag34(0,0,1.1,'리뉴얼 4,000만 원',CMINE,{label:'재계약 서류의 한 줄'}));else if(a>.6)text('?',1420,270,{f:'D',s:90,c:C.gold});
      if(L('o2')>=0){const k=K('o2',0);
        if(k>=0)group(1420,500,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>tag34(0,0,1.1,'매달 66만 7,000원',CMINE,{label:'다음 5년 · 60달로 나누면'}));else text('?',1420,500,{f:'D',s:90,c:C.gold});
        if(T>FR('o2',.7))pill('한 달 300만 원 남던 가게면 22%',1420,680,{s:32,bg:'rgba(255,255,255,.94)'});}
      srcLine('예시 계산 (python3): 4,000만 ÷ 60달 = 66만 6,667원 · 66.7 ÷ 300 = 22.2% · 가게 숫자는 모두 예시 가정');
    }else if(T<CT('o3c')){
      const b=L('o3'),q=K('o3',0);
      text('같은 4,000만 원, 서류 한 장',960,180,{f:'D',s:56,c:'#fff',alpha:P(b,0,.3)});
      doc34(560,500,1,'본사가 권한 공사',[['간판·인테리어','3,000만'],['본사가 내는 돈',q>=0?'600만 원':'?',CHQ]],{alpha:P(b,.1,.3),head:'#2f6f4f'});
      doc34(1360,500,1,'점주 요청서',[['간판·인테리어','3,000만'],['본사가 내는 돈',T>FR('o3',.85)?'0원':'?',CMINE]],{alpha:P(b,.4,.3),head:'#8a2b2b',rot:.02});
      if(T>FR('o3',.85))stampBox('600만 원 ↔ 0원',960,790,P(T,FR('o3',.85),.3)>0?T-FR('o3',.85):-1,{s:56,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('가맹사업법 제12조의2 ② · 시행령 제13조의2 ③ (확장·이전 없는 공사 20%) · 자발적 공사면 본사 부담 없음 · 공사비는 예시');
    }else{
      const k0=L('o3c'),k9=L('o4'),k10=L('o5');
      if(k9<0){shop34(560,480,.9,{old:true,alpha:P(k0,0,.3)});drawMascot(1400,480,.8,'think',{alpha:P(k0,.3,.3)});text('창업비는 정말 한 번만 낼까?',960,820,{f:'D',s:44,c:C.gold,alpha:P(k0,.5,.3)});}
      else{
        text('재계약 전, 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
        for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
        if(k10>=0)['법 조문 · 국가법령정보센터 원문','창업비 · 서울시 발표 인용 보도','가게 숫자 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.8,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});}
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('커피 가맹점 재계약 계산서',960,200,{f:'D',s:100,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('리뉴얼 4,000만 원 · 한 달 66만 7,000원 · 본사 몫 600만 ↔ 0원',960,325,{s:44,w:900,alpha:P(a,.3,.3),max:1780});
    shop34(760,640,.62,{work:true,alpha:P(a,.2,.3)});drawMascot(1450,640,.7,'think',{alpha:P(a,.3,.3)});
  }},
  /* ── 창업비의 절반은 인테리어 ── */
  news:{draw(){
    sub('p1','p4',()=>{
      text('가맹점 하나 평균 창업비용 (서울, 2023년 말)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const q2=K('p2',0),q3=K('p3',0),q4=K('p4',0),X0=210,WW=1500,TOT=11300,Y=420;
      if(q2>=0){const k=E.out(P(q2,0,.6));ctx.fillStyle=CREST;rr(X0,Y-70,WW*k,140,16);ctx.fill();
        text('1억 1,300만 원',960,Y-120,{f:'D',s:60,c:'#fff',alpha:P(q2,0,.3)});}
      else text('?',960,Y,{f:'D',s:90,c:C.gold});
      if(q3>=0){const w=WW*5150/TOT*E.out(P(q3,0,.6));ctx.fillStyle=CINT;rr(X0,Y-70,w,140,16);ctx.fill();text('인테리어 5,150만',X0+WW*5150/TOT/2,Y-10,{f:'D',s:44,c:'#1d1030',alpha:P(q3,.3,.3)});text('45.6%',X0+WW*5150/TOT/2,Y+40,{f:'D',s:40,c:'#1d1030',alpha:P(q3,.3,.3)});}
      if(q4>=0){const x1=X0+WW*5150/TOT,w=WW*1070/TOT*E.out(P(q4,0,.5));ctx.fillStyle=CFEE2;rr(x1+4,Y-70,w,140,10);ctx.fill();text('가맹비',x1+WW*1070/TOT/2,Y-10,{f:'D',s:34,c:'#0d1a33',alpha:P(q4,.3,.3)});text('1,070만',x1+WW*1070/TOT/2,Y+36,{f:'D',s:30,c:'#0d1a33',alpha:P(q4,.3,.3)});
        text('그 밖 (보증금·설비·교육 등)',X0+WW*(6220+5080/2)/TOT,Y+2,{f:'D',s:30,c:'#d6dae3',alpha:P(q4,.5,.3),max:WW*5080/TOT-30});
        stampBox('인테리어 = 가맹비의 약 다섯 배',960,640,q4,{s:52,c:CY,bg:'rgba(40,30,0,.92)'});
        if(T>FR('p4',.6))pill('보도 계산: 평균 28평 · 한 평에 약 190만 원',960,770,{s:32,bg:'rgba(255,255,255,.94)'});}
      srcLine('매일경제 2025.7.1 (서울시 「2024년 서울시 가맹사업 등록현황」, 정보공개서 기준 2023년 말) · 창업비 평균 1억 1,300만 · 인테리어 5,150만 (45.6%) · 가맹비 1,070만 · 28평 · 평당 190만');});
    sub('p5','p6',()=>{
      text('인테리어는 한 번으로 끝날까?',960,170,{f:'D',s:56,c:C.gold});
      const X0=200,WW=1520,Y=470,q=K('p5',0);
      ctx.fillStyle='rgba(255,255,255,.12)';rr(X0,Y-14,WW,28,14);ctx.fill();
      for(let i=0;i<=10;i++){const x=X0+WW*i/10;ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(x-2,Y-26,4,52);text(i+'년',x,Y+64,{f:'D',s:30,c:'#c9ced9'});}
      group(X0,Y-130,1,0,P(L('p5'),0,.3),()=>{shop34(0,0,.32,{});text('처음 인테리어',0,110,{f:'D',s:28,c:CINT});});
      if(q>=0){ctx.fillStyle='rgba(255,197,49,.25)';rr(X0+WW*.4,Y-40,WW*.1,80,10);ctx.fill();rr(X0+WW*.8,Y-40,WW*.2,80,10);ctx.fill();
        [[.45,.1],[.9,.6]].forEach(([fx,d])=>{const k=E.back(P(q,d,.4));if(k>0)group(X0+WW*fx,Y-130,k,0,1,()=>{shop34(0,0,.32,{work:true});text('리뉴얼?',0,110,{f:'D',s:30,c:CY});});});
        stampBox('평균 4~5년마다 (보도)',960,700,q,{s:52,c:CY,bg:'rgba(40,30,0,.92)'});}
      if(L('p6')>=0)pill('창업비의 절반이 다시 돌아올 수 있다',960,810,{s:32,alpha:P(L('p6'),0,.3),bg:'rgba(255,255,255,.94)'});
      srcLine('비즈한국 2023.6.28 「"5년마다 리뉴얼 의무" 가맹점주 울리는 프랜차이즈 인테리어 비용」 · "가맹본부가 평균 4~5년을 주기로 매장 리뉴얼을 요구"');});
  }},
  /* ── 예시 가게의 5년 ── */
  setup:{draw(){
    sub('s1','s3',()=>{
      text('예시 가게 · 20평 커피 가맹점',960,170,{f:'D',s:52,c:C.gold});
      shop34(460,500,.9,{});
      const q1=K('s1',0),q2=K('s2',0),q3=K('s3',0);
      if(L('s1')>=0)rowBox(1320,320,900,'처음 인테리어 (20평 × 190만)',q1>=0?'3,800만 원':'?',q1>=0?CINT:C.gold,{alpha:P(L('s1'),0,.3)});
      if(L('s2')>=0)rowBox(1320,460,900,'한 달 남는 돈 (예시)',q2>=0?'300만 원':'?',q2>=0?CHQ:C.gold,{alpha:P(L('s2'),0,.3)});
      if(L('s3')>=0)rowBox(1320,600,900,'첫 계약 5년 · 남는 돈 합계',q3>=0?'1억 8,000만 원':'?',q3>=0?CHQ:C.gold,{alpha:P(L('s3'),0,.3)});
      if(q2>=0)pill('월세·인건비·재료비를 다 낸 뒤 · 예시 가정',1320,760,{s:30,bg:'rgba(255,255,255,.94)'});
      srcLine('예시 가정 · 평당 190만 원은 서울시 2023년 말 평균 (매일경제 2025.7.1) · 20 × 190 = 3,800만 · 300만 × 60달 = 1억 8,000만 (python3)');});
    sub('s4','s5',()=>{
      text('5년째 봄, 본사에서 온 견적서',960,170,{f:'D',s:52,c:C.gold});
      const q=K('s4',0);
      shop34(400,520,.8,{old:true});
      doc34(1240,500,1,'매장 리뉴얼 견적서',[['간판·인테리어 공사','3,000만',CINT,CT('s4')+.6],['커피 머신·집기 교체','1,000만',CEQ,FR('s4',.62)],['합계',q>=0?'4,000만 원':'?',q>=0?CMINE:'#c08a00',FR('s4',.8)]],{w:760,ls:34,rs:42});
      if(L('s5')>=0)pill('처음 인테리어보다 조금 싸게 잡은 견적 · 모두 예시',1240,800,{s:30,alpha:P(L('s5'),0,.3),bg:'rgba(255,255,255,.94)'});
      srcLine('예시 견적 · 장비·집기 교체비는 법이 정한 본사 분담 대상이 아니다 (시행령 제13조의2 ② 2호)');});
  }},
  /* ── 300만 원 쪼개기 (만 원짜리 300장) ── */
  cut:{draw(){
    text('한 달 남는 300만 원 = 만 원짜리 300장',960,170,{f:'D',s:52,c:C.gold,max:1800});
    const k1=L('t1'),q2=K('t2',0),q3=K('t3',0);
    const CW=56,CH=30,GX=6,GY=8,COLS=25,X0=960-(COLS*CW+(COLS-1)*GX)/2+CW/2,Y0=250;   // 12줄 × 38 = 456 → y 235 ~ 691
    for(let i=0;i<300;i++){const r=Math.floor(i/COLS),c2=i%COLS,k=P(k1,.1+i*.004,.2);if(k<=0)continue;
      let col=CHQ;if(i>=233&&q2>=0&&T>=KT('t2',0)+(i-233)*.012)col=CMINE;
      bill34(X0+c2*(CW+GX),Y0+r*(CH+GY),CW,CH,col,{alpha:k*(col===CMINE&&L('t4')>=0?.6:1)});}
    if(L('t2')>=0&&q2<0)text('?',960,770,{f:'D',s:60,c:C.gold});
    if(q2>=0&&L('t4')<0)group(960,775,1,0,P(q2,0,.3),()=>{panel(-760,-50,1520,100,{bg:'rgba(6,13,32,1)',bd:CMINE});text('리뉴얼 4,000만 ÷ 60달 = 한 달 67장',-20,4,{a:'right',f:'D',s:38});text(q3>=0?'남는 233장 · −22%':'',20,4,{a:'left',f:'D',s:44,c:q3>=0?CY:'#fff'});});
    if(L('t4')>=0)group(960,775,1,0,P(L('t4'),0,.3),()=>{panel(-820,-56,1640,112,{bg:'rgba(6,13,32,1)',bd:CY});text('처음 5년: 처음 인테리어를 벌어서 갚고',-40,-18,{a:'right',f:'D',s:30,c:'#d6dae3'});text('다음 5년: 새 인테리어를 갚는다',40,-18,{a:'left',f:'D',s:30,c:'#d6dae3'});
      text(K('t4',0)>=0?'장사가 그대로여도 매달 나가는 돈이 하나 생긴다':'',0,30,{f:'D',s:36,c:CY,max:1560});});
    srcLine('예시 계산 (python3): 4,000만 ÷ 60 = 66만 6,667원 ≈ 67장 · 300 − 67 = 233장 · 66.7 ÷ 300 = 22.2%');
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='40,000,000 ÷ 60 =';bigS='666,666.7';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:22,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:done?70:72,f:'D',c:done?'#b5451b':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('리뉴얼 4,000만 원 나누기 60달',1320,180,{f:'D',s:44,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0);
    if(L('c2')>=0){
      rowBox(1320,340,860,'한 달',q2>=0?'66만 6,667원':'?',q2>=0?CMINE:C.gold);
      if(T>FR('c2',.6))rowBox(1320,470,860,'하루 (30일로)','2만 2,222원',CMINE,{alpha:P(T,FR('c2',.6),.3)});}
    if(dt>=0&&q2<0)group(1300,650,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(L('c3')>=0)group(1320,700,1,0,P(L('c3'),0,.3),()=>{panel(-470,-80,940,160,{bg:'rgba(6,13,32,1)',bd:CHQ});text('이 4,000만 원,',0,-26,{f:'D',s:34,c:C.dim,max:900});text('정말 전부 사장님 돈일까?',0,32,{f:'D',s:44,c:'#fff',max:900});});
  }},
  /* ── 법이 정한 본사 몫 ── */
  law:{draw(){
    sub('l1','l2',()=>{
      text('가맹사업법 제12조의2 (부당한 점포환경개선 강요 금지)',960,170,{f:'D',s:46,c:C.gold,max:1800});
      group(960,360,1,0,P(L('l1'),0,.3),()=>{panel(-820,-110,1640,220,{bg:'#fdfbf5',bd:'#2f3a52',lw:5,r:14});
        text('① 가맹본부는 대통령령으로 정하는 정당한 사유 없이',0,-36,{f:'D',s:40,c:'#2b2f3a',max:1560});
        text('점포환경개선을 강요하여서는 아니 된다.',0,30,{f:'D',s:44,c:K('l1',0)>=0?'#b5451b':'#2b2f3a',max:1560});});
      if(L('l2')>=0){text('시행령이 정한 정당한 사유',960,560,{f:'D',s:38,c:'#fff',alpha:P(L('l2'),0,.3)});
        [['시설·장비·인테리어 노후화가 객관적으로 인정될 때',FR('l2',.3)],['위생·안전 결함 등으로 정상 영업에 현저한 지장',FR('l2',.65)]].forEach(([s,t0],i)=>{if(T<t0)return;group(960,650+i*96,1,0,P(T,t0,.3),()=>{panel(-700,-40,1400,80,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.4)'});checkMark(-650,0,40,C.gold);text(s,-600,4,{a:'left',f:'D',s:32,max:1260});});});}
      srcLine('국가법령정보센터 · 가맹사업거래의 공정화에 관한 법률 [법률 제21857호, 2026.10.2 시행] 제12조의2 ① · 같은 법 시행령 [대통령령 제36561호] 제13조의2 ①');});
    sub('l3','l4',()=>{
      text('본사가 권하거나 요구한 공사 · 본사 몫',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const q3=K('l3',0);
      [['넓히거나 옮기지 않음','20%',q3>=0,CHQ],['넓히거나 옮김','40%',T>FR('l3',.85),CFEE2]].forEach(([l,v,on,col],i)=>{const x=560+i*800;group(x,380,1,0,P(L('l3'),.2+i*.3,.3),()=>{panel(-340,-130,680,260,{bg:'rgba(6,13,32,1)',bd:on?col:'rgba(255,255,255,.3)'});text(l,0,-70,{f:'D',s:38,c:C.dim});text(on?v:'?',0,40,{f:'D',s:110,c:on?col:C.gold});});});
      if(L('l4')>=0){const q4=K('l4',0);
        group(560,700,1,0,P(L('l4'),0,.3),()=>{panel(-340,-70,680,140,{bg:'rgba(53,224,138,.12)',bd:CHQ});text('간판·인테리어 공사비',0,-20,{f:'D',s:36});text('비율을 곱한다',0,36,{f:'D',s:32,c:CHQ});});
        group(1360,700,1,0,P(L('l4'),.4,.3),()=>{panel(-340,-70,680,140,{bg:'rgba(141,150,168,.12)',bd:CEQ});text('커피 머신·집기 교체',0,-20,{f:'D',s:36});text(q4>=0?'빠진다 (0%)':'?',0,36,{f:'D',s:34,c:q4>=0?CMINE:C.gold});if(q4>=0){ctx.strokeStyle=CMINE;ctx.lineWidth=8;line(-300,-60,300,60);}});}
      srcLine('시행령 제13조의2 ② (간판 교체비용 · 인테리어 공사비용 — 장비·집기 교체비용 제외) · ③ (확장·이전 없으면 100분의 20, 있으면 100분의 40)');});
    sub('l5','l6',()=>{
      text('예시 견적 4,000만 원을 나누면',960,170,{f:'D',s:52,c:C.gold});
      const X0=210,WW=1500,Y=360,q5=K('l5',0),q6=K('l6',0);
      ctx.fillStyle=CMINE;rr(X0,Y-60,WW,120,14);ctx.fill();
      if(q5>=0){ctx.fillStyle=CHQ;rr(X0,Y-60,WW*600/4000*E.out(P(q5,0,.5)),120,14);ctx.fill();text('본사 600만',X0+WW*.075,Y-100,{f:'D',s:38,c:CHQ});}
      text(q5>=0?'사장님 3,400만':'?',X0+WW*.575,Y+4,{f:'D',s:48,c:'#fff'});
      text('= 공사비 3,000만 × 20%',X0+WW*.075+40,Y+100,{a:'left',f:'D',s:30,c:CHQ,alpha:q5>=0?P(q5,.3,.3):0});
      if(L('l6')>=0){rowBox(960,560,1200,'사장님 몫 3,400만 ÷ 60달',q6>=0?'한 달 56만 7,000원':'?',q6>=0?CMINE:C.gold,{alpha:P(L('l6'),0,.3)});
        if(T>FR('l6',.5))rowBox(960,690,1200,'한 달 남는 돈','300만 → 243만 3,000원',CY,{alpha:P(T,FR('l6',.5),.3)});}
      srcLine('예시 계산 (python3): 3,000 × 0.2 = 600 · 4,000 − 600 = 3,400 · 3,400 ÷ 60 = 56.67만 · 300 − 56.67 = 243.33만');});
    sub('l7','l9',()=>{
      text('본사 몫 600만 원, 그런데 조건이 하나',960,170,{f:'D',s:50,c:C.gold,max:1800});
      if(L('l7')>=0)pill('청구한 날부터 90일 안에 지급 (본사 지정 업체 공사면 끝난 날부터 90일)',960,260,{s:30,bg:'rgba(255,255,255,.94)'});
      const X0=360,WW=1200,Y=470;
      if(L('l8')>=0){const q8=K('l8',0);
        [0,1,2].forEach(i=>{const x=X0+WW*i/3,back=L('l9')>=0&&i>=1&&K('l9',0)>=0;const k=P(L('l8'),.2+i*.2,.3);if(k<=0)return;
          group(x+WW/6,Y,1,0,k,()=>{panel(-WW/6+8,-70,WW/3-16,140,{bg:back?'rgba(255,77,77,.25)':'rgba(53,224,138,.2)',bd:back?CMINE:CHQ});text((i+1)+'년째',0,-30,{f:'D',s:32,c:C.dim});text('200만',0,26,{f:'D',s:44,c:back?CMINE:CHQ});});});
        text('공사 끝난 날',X0,Y+110,{f:'D',s:28,c:'#c9ced9'});text('3년',X0+WW,Y+110,{f:'D',s:28,c:'#c9ced9'});
        if(q8>=0&&L('l9')<0)pill('3년 안에 본사 책임 없는 이유로 계약이 끝나면 → 남은 기간만큼 환수',960,680,{s:30,bg:'rgba(255,255,255,.94)'});}
      if(L('l9')>=0){const q9=K('l9',0);const xc=X0+WW/3;ctx.fillStyle=CY;ctx.fillRect(xc-4,Y-110,8,220);text('1년 뒤 문 닫음',xc,Y-130,{f:'D',s:32,c:CY});
        if(q9>=0){arrow34(X0+WW*.66,Y+90,X0+WW*.66,Y+200,CMINE,E.out(P(q9,0,.5)),{lw:10});stampBox('400만 원 → 다시 본사로',960,740,q9,{s:52,c:CMINE,bg:'rgba(40,10,10,.92)'});}
        if(T>FR('l9',.75))pill('본사 몫도 3년에 걸쳐 나눠 주는 셈',960,830,{s:30,bg:'rgba(255,255,255,.94)'});}
      srcLine('시행령 제13조의2 ⑤ (청구일부터 90일, 합의 시 1년 분할) · ⑥ (본사·지정 업체 공사는 끝난 날부터 90일) · ⑦ (3년 안 종료 시 나머지 기간 비례 미지급·환수) · 600 × 2/3 = 400 (python3)',872);});
  }},
  /* ── 요청서 한 장 ── */
  letter:{draw(){
    sub('r1','r4',()=>{
      text('본사가 한 푼도 안 내는 경우',960,170,{f:'D',s:54,c:C.gold});
      const on=L('r2')>=0,q3=K('r3',0);
      doc34(520,470,1,'본사가 권한 공사',[['본사 (20%)','600만',CHQ],['사장님','3,400만',CMINE],['한 달 (60달)','56만 7,000',CMINE]],{head:'#2f6f4f',w:640});
      if(on)doc34(1400,470,1,'점주 자발적 공사',[['본사','0원',CMINE,FR('r2',.6)],['사장님',q3>=0?'4,000만':'?',CMINE,CT('r3')],['한 달 (60달)',q3>=0?'66만 7,000':'?',CMINE,CT('r3')+.3]],{head:'#8a2b2b',w:640,rot:.02,alpha:P(L('r2'),0,.3)});
      if(q3>=0&&L('r4')<0)text('남는 돈 243만 3,000 ↔ 233만 3,000',960,770,{f:'D',s:40,c:'#fff',alpha:P(q3,.2,.3)});
      if(L('r4')>=0)stampBox('누가 먼저 원했나 = 한 달 10만 원',960,780,K('r4',0),{s:50,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('가맹사업법 제12조의2 ② 단서 1호 "가맹본부의 권유 또는 요구가 없음에도 가맹점사업자의 자발적 의사에 의하여" → 본사 부담 없음 · 66.67 − 56.67 = 10만 (python3)');});
    sub('r5','r6',()=>{
      text('2018년 · 한 치킨 본사 (보도)',960,170,{f:'D',s:54,c:C.gold});
      const q5=K('r5',0),q6=K('r6',0);
      doc34(620,500,1.05,'점포환경개선 요청서',[['요청인','가맹점주'],['요청 내용','매장 인테리어 개선'],['사유','점주의 요청']],{head:'#5a3d2b',w:700,sign:q5>=0?P(q5,0,1):0});
      if(L('r5')>=0&&T>FR('r5',.35))pill('"고쳐야 재계약이 된다"는 설명',1450,320,{s:32,bg:'rgba(255,255,255,.94)'});
      if(q5>=0&&L('r6')<0)stampBox('점주가 원한 것처럼',1450,480,q5,{s:52,c:CY,bg:'rgba(40,30,0,.92)'});
      if(q6>=0){stampBox('과징금 3억 원',1450,480,q6,{s:64,c:CMINE,bg:'rgba(40,10,10,.92)'});if(T>FR('r6',.55))pill('보도: 점주들은 공사비를 전부 자기 돈으로',1450,640,{s:30,bg:'rgba(255,255,255,.94)'});}
      srcLine('비즈한국 2023.6.28 · 2018년 공정위, 재계약을 조건으로 점포환경개선 요청서를 받은 한 치킨 본사에 과징금 3억 원 (보도 내용 · 영상에선 이름을 쓰지 않음)');});
    sub('r7','r8',()=>{
      text('점포환경개선 1,250건, 왜 했나 (공정위 조사)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const X0=600,WW=900,MX=60,q7=K('r7',0);
      [['점포 노후화',54.3,'rgba(255,255,255,.45)',CT('r7')+.4],['가맹점 자발적 의사',40.3,CY,KT('r7',0)],['위생 개선',3.1,'rgba(255,255,255,.45)',FR('r7',.9)]].forEach(([l,v,col,t0],i)=>{const y=300+i*110;text(l,X0-24,y,{a:'right',f:'D',s:36,c:i===1?CY:'#fff'});if(T<t0){if(i===1)text('?',X0+40,y,{f:'D',s:50,c:C.gold});return;}hbar(X0,y,WW,70,v*E.out(P(T,t0,.5)),MX,col,v+'%',{s:42,lc:i===1?CY:'#fff',k:.9});});
      if(L('r8')>=0){group(960,650,1,0,P(L('r8'),0,.3),()=>{panel(-760,-50,1520,100,{bg:'rgba(6,13,32,1)',bd:CHQ});text('같은 조사 · 본사 부담 평균 1,510만 원 · 부담 비율 63%',0,4,{f:'D',s:36,c:'#fff',max:1460});});
        if(K('r8',0)>=0)stampBox('서류에 누가 원한 공사로 적히나',960,780,K('r8',0),{s:48,c:CY,bg:'rgba(40,30,0,.92)'});}
      srcLine('뉴데일리 2019.1.30 (공정위 가맹 분야 서면 실태조사, 200개 본부·2,500개 가맹점 · 조사 기간 중 1,250건) · 숫자는 그때 조사 기준 — 최신 조사(2025.12.30 발표)엔 이 항목이 없다');});
  }},
  /* ── 10년의 벽 ── */
  wall:{draw(){
    const X0=200,WW=1520,Y=420;
    if(L('w5')<0){
      text('계약 갱신 요구권 (가맹사업법 제13조)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      ctx.fillStyle='rgba(53,224,138,.35)';rr(X0,Y-40,WW*5/12,80,12);ctx.fill();text('첫 계약 5년',X0+WW*2.5/12,Y+4,{f:'D',s:36});
      const q2=K('w2',0);
      if(L('w2')>=0){ctx.fillStyle='rgba(111,168,255,.4)';rr(X0+WW*5/12+6,Y-40,WW*5/12*E.out(P(L('w2'),.3,.6)),80,12);ctx.fill();text('재계약 5년',X0+WW*7.5/12,Y+4,{f:'D',s:36,alpha:P(L('w2'),.6,.3)});}
      if(q2>=0){ctx.fillStyle='rgba(255,77,77,.25)';rr(X0+WW*10/12+6,Y-40,WW*2/12-6,80,12);ctx.fill();text('권리 없음',X0+WW*11/12,Y+4,{f:'D',s:32,c:CMINE});
        ctx.fillStyle=CY;ctx.fillRect(X0+WW*10/12-4,Y-90,8,180);text('10년',X0+WW*10/12,Y-112,{f:'D',s:44,c:CY});}
      for(let i=0;i<=12;i++){const x=X0+WW*i/12;text(i+'',x,Y+76,{s:24,w:800,c:'#9aa3b8'});}
      if(L('w2')>=0&&L('w3')<0)pill('점주가 갱신을 요구하면 정당한 사유 없이 거절 못 한다 · 전체 10년까지',960,600,{s:30,bg:'rgba(255,255,255,.94)'});
      if(L('w3')>=0)group(960,640,1,0,P(L('w3'),0,.3),()=>{panel(-820,-80,1640,160,{bg:'rgba(6,13,32,1)',bd:CMINE});text('예외 · 제13조 ① 2호',0,-34,{f:'D',s:30,c:CMINE});text('다른 가맹점에 통상 적용되는 계약 조건·영업 방침을 받아들이지 않으면',0,24,{f:'D',s:34,max:1580});});
      if(L('w4')>=0)stampBox('어디까지가 강요인지는 사안마다',960,790,K('w4',0)>=0?K('w4',0):T-CT('w4'),{s:44,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('국가법령정보센터 · 가맹사업법 제13조 ① (갱신 요구 거절 금지 · 단서 2호) · ② (전체 가맹계약기간 10년을 넘지 않는 범위) · 제12조의2 ① (강요 금지)');
    }else{
      text('10년째 리뉴얼 · 다음 계약이 짧다면',960,170,{f:'D',s:52,c:C.gold,max:1800});
      const q6=K('w6',0),q7=K('w7',0);
      group(960,270,1,0,P(L('w5'),0,.3),()=>{panel(-700,-50,1400,100,{bg:'rgba(255,77,77,.15)',bd:CMINE});text('10년이 지나면 갱신을 요구할 권리 자체가',-20,4,{a:'right',f:'D',s:36});text(K('w5',0)>=0?'없다':'?',20,4,{a:'left',f:'D',s:48,c:CMINE});});
      if(L('w6')>=0){text('사장님 몫 3,400만 원을 나누면',960,380,{f:'D',s:36,c:C.dim,alpha:P(L('w6'),0,.3)});
        [['5년 계약 · 60달',56.7,'56만 7,000원',CFEE2,CT('w6')+.5],['2년 계약 · 24달 (예시)',141.7,q6>=0?'141만 7,000원':'?',CMINE,q6>=0?KT('w6',0):FR('w6',.7)]].forEach(([l,v,lb,col,t0],i)=>{const y=470+i*120;text(l,560,y,{a:'right',f:'D',s:34});if(T<t0)return;hbar(590,y,1000,76,v*E.out(P(T,t0,.5)),160,col,lb,{s:42,lc:i===1?CMINE:'#fff',k:.85});});}
      if(L('w7')>=0)rowBox(960,760,1300,'한 달 남는 돈 300만 원 →',q7>=0?'158만 3,000원':'?',q7>=0?CMINE:C.gold,{alpha:P(L('w7'),0,.3)});
      srcLine('예시 계산 (python3): 3,400 ÷ 24 = 141.67만 · 300 − 141.67 = 158.33만 · 3,400 ÷ 60 = 56.67만 · 2년 계약은 예시 가정');
    }
  }},
  /* ── 손잡이 ── */
  knob:{draw(){
    if(L('k4')<0){
      const two=L('k3')>=0;
      text(two?'손잡이 ② 나눌 달 수 (본사 20%, 3,400만 원)':'손잡이 ① 본사 몫 (같은 견적 · 60달)',960,170,{f:'D',s:48,c:C.gold,max:1800});
      const rows=two?[['5년 · 60달','56만 7,000원','243만 3,000원','#fff',FR('k3',.15)],['3년 · 36달','94만 4,000원','205만 6,000원',CY,FR('k3',.45)],['2년 · 24달','141만 7,000원','158만 3,000원',CMINE,KT('k3',0)]]
        :[['본사 0% (자발적)','66만 7,000원','233만 3,000원',CMINE,FR('k2',.15)],['본사 20%','56만 7,000원','243만 3,000원','#fff',FR('k2',.45)],['본사 40% (넓힘·옮김)','46만 7,000원','253만 3,000원',CHQ,KT('k2',0)]];
      [[560,two?'나눌 기간':'본사 몫'],[1060,'한 달 나가는 돈'],[1500,'한 달 남는 돈']].forEach(([x,l])=>text(l,x,290,{f:'D',s:34,c:C.dim}));
      rows.forEach(([r,a,b,col,t0],i)=>{const y=400+i*130;if(T<t0-.1){text('?',1060,y,{f:'D',s:44,c:C.gold,alpha:.6});return;}const k=P(T,t0,.3);
        group(0,0,1,0,k,()=>{panel(200,y-52,1560,104,{bg:'rgba(255,255,255,.05)',bd:i===2?col:null});text(r,560,y,{f:'D',s:38,max:640});text(a,1060,y,{f:'D',s:42,c:col});text(b,1500,y,{f:'D',s:42,c:col});});});
      if(!two)pill('40%는 같은 공사비라고 칠 때 · 실제로는 옮기면 공사비 자체가 커진다',960,800,{s:28,alpha:P(L('k2'),.5,.3),bg:'rgba(255,255,255,.94)'});
      else if(T>FR('k3',.7))stampBox('짧을수록 한 달 몫이 커진다',960,800,T-FR('k3',.7),{s:46,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('예시 계산 (python3): 4,000 ÷ 60 = 66.67 · 3,400 ÷ 60 = 56.67 · 2,800 ÷ 60 = 46.67 · 3,400 ÷ 36 = 94.44 · 3,400 ÷ 24 = 141.67 (만 원)',872);
    }else{
      text('손잡이 ③ 리뉴얼로 손님이 늘면',960,170,{f:'D',s:50,c:C.gold});
      group(960,280,1,0,P(L('k4'),0,.3),()=>{panel(-700,-50,1400,100,{bg:'rgba(6,13,32,1)',bd:CBRN});text('한 잔 더 팔 때 남는 돈 2,000원 (예시)',0,4,{f:'D',s:38,c:'#fff'});});
      const q5=K('k5',0);
      if(L('k5')>=0){text('하루 더 팔아야 할 잔 수',960,400,{f:'D',s:36,c:C.dim});
        for(let i=0;i<10;i++){const f=q5>=0?Math.min(1,Math.max(0,9.44-i))*E.out(P(q5,i*.06,.4)):0;cup34(330+i*140,530,1.1,f);}
        text(q5>=0?'하루 9.4잔 · 한 달 284잔':'?',960,660,{f:'D',s:54,c:q5>=0?CY:C.gold});}
      if(L('k6')>=0)stampBox('리뉴얼의 값 = 늘어날 손님 수',960,790,K('k6',0),{s:52,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('예시 계산 (python3): 566,667 ÷ 2,000 = 283.3잔 ≈ 284잔 · ÷ 30일 = 9.4잔 · 한 잔 2,000원은 예시 가정');
    }
  }},
  /* ── 체크 ── */
  check:{draw(){
    const a=L('q1'),ov=L('q7');
    text('재계약 전, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)*(ov>=0?1-P(ov,0,.3):1),max:1800});
    const cards=[['q2','리뉴얼 주기','계약서에 몇 년마다로 적혔나','보도: 평균 4~5년'],['q3','나뉘는 비용','간판·인테리어 vs 머신·집기','머신·집기는 본사 몫 없음'],['q4','본사 몫','넓힘·옮김 없으면 20%, 있으면 40%','청구하면 90일 안'],
      ['q5','남은 기간','10년 중 몇 년째 · 다음 계약 몇 달','그 달 수로 나눈다'],['q6','본전 잔 수','한 달 몫 나누기 한 잔 더 남는 돈','오늘: 하루 9.4잔']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      if(ov>=0&&P(ov,0,.3)>=1)return;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:34,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,500,1,0,P(ov,0,.3),()=>{panel(-820,-330,1640,640,{bg:'rgba(6,13,32,1)',bd:C.gold});text('리뉴얼 견적 5,000만 원 · 간판·인테리어 4,000만',0,-250,{f:'D',s:42,max:1540});text('넓히지 않음 · 본사가 권한 공사 · 다음 계약 5년',0,-185,{f:'D',s:40,max:1540,c:'#ffd0a3'});text('한 달에 얼마일까?',0,-115,{f:'D',s:46,max:1540,c:C.gold});
      const b=L('q7b');
      if(b>=0)text('5,000만 − 본사 800만 (4,000만 × 20%) = 4,200만 나누기 60달',0,-10,{f:'D',s:38,alpha:P(b,0,.3),max:1540});
      const k=K('q7b',0);if(k>=0)text('70만 원',0,150,{f:'D',s:130,c:CMINE,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,150,{f:'D',s:120,c:C.gold});
      if(k>=0&&T>FR('q7b',.6))text('본사 몫은 간판·인테리어에만 붙는다',0,265,{f:'D',s:34,c:'#fff',max:1540});});}
  }},
  /* ── 마무리 ── */
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('커피 가맹점 재계약 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      shop34(400,520,.75,{work:true,alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['창업비 중 인테리어 (서울 평균)','45.6%',CINT,b,.2],['리뉴얼 4,000만 원 ÷ 60달','66만 7,000원',CMINE,b,4.5],['남는 돈 300만 원 중','22%',CMINE,b,6.5],['본사 몫 (권한 공사 · 넓힘 없음)','20% · 자발적이면 0%',CHQ,b2,.2],['갱신을 요구할 권리','10년까지',CY,b2,3.5]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;rowBox(1260,270+i*125,1120,l,v,col,{alpha:kk,ls:32});});
    }else{
      shop34(560,480,.8,{fresh:true});drawMascot(1450,470,.6,'happy');
      stampBox('창업비 = 한 번이 아니라 5년마다 돌아오는 할부',960,780,c,{s:42,c:C.gold,bg:'rgba(40,30,0,.85)'});
      if(L('z4')>=0&&L('z4b')<0)pill('가맹점을 하지 말자는 게 아니다',1300,180,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('법 조문 원문 · 통계는 보도 · 가게는 예시 · 법률 자문·창업 권유 아님 · 📌 출처는 설명란',1100,180,{s:28,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,180,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-540,-70,1080,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 재계약 때 리뉴얼 이야기 나왔나요?',0,4,{s:40,w:900,c:C.ink,max:1020});});
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
