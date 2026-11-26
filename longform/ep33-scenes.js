/* ════════════════════════════════════════════════════════════════════
   장면 (LF.33 1톤 용달 계산서 — 한국교통연구원 「2025년도 화물운송시장 실태조사 화물차주 조사 보고서」(화물운송시장 동향 2025년도 연간보고서, 2026.3.23 게시) Ⅱ장 카고형 화물자동차(소형, 1톤 이하) 1,375명:
   매출 359만 · 지출 178.2만 · 순수입 190만(유가보조금 포함) · 21.7일 · 1.9회 · 230.5km(적재 159.0 · 공차 71.5 = 31.0%) · 근로 9.0시간(운행 5.4 · 운행 외 3.6) · 운임 수도권 내 62,816 · 부산권 262,000 · 65.5세 · 차값 2,134만 · 주선 41.7 · 정보망 36.2)
   중심 그림: 1톤 카고 트럭 한 대가 짐을 싣고 가는 길(초록)과 빈 차로 돌아오는 길(회색). 만 원짜리 359장.
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['1','9','0','0','0','0','0','÷','1','9','5','.','3','='];   // 1,900,000 ÷ 195.3 = 9,728.6 (19 뒤 0 다섯)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CLOAD='#35E08A', CEMPTY='#8d96a8', CFUEL='#FF9F43', CFEE='#B98CFF', CTOLL='#6FA8FF', CINS='#4DD0C8', CREP='#FF7AB6', CETC='#5d6678', CY='#FFC531', CRED='#FF4D4D';
/* 1톤 카고 트럭 (오른쪽을 본다 · o.flip 이면 왼쪽) */
function truck33(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{if(o.flip)ctx.scale(-1,1);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(-20,70,220,12,0,0,7);ctx.fill();
  const body=o.dim?'#7d8594':'#e9edf3',cab=o.dim?'#5f6f8a':'#2f6fd0';
  if(o.load){[[-185,-70,90,64,'#c98b4a'],[-90,-70,80,64,'#d9a066'],[-185,-128,70,58,'#b8793c'],[-110,-118,90,48,'#e3b27a']].forEach(([bx,by,bw,bh,bc])=>{ctx.fillStyle=bc;rr(bx,by,bw,bh,4);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;line(bx+bw/2,by,bx+bw/2,by+bh);});}
  ctx.fillStyle=body;rr(-200,-8,250,22,4);ctx.fill();ctx.strokeStyle=body;ctx.lineWidth=6;line(-200,-8,-200,-60);line(48,-8,48,-60);line(-200,-60,-194,-60);
  ctx.fillStyle=cab;rr(52,-96,118,110,14);ctx.fill();ctx.fillStyle=o.dim?'#a9b4c4':'#cfe8ff';ctx.beginPath();ctx.moveTo(108,-86);ctx.lineTo(160,-86);ctx.lineTo(166,-36);ctx.lineTo(108,-36);ctx.closePath();ctx.fill();
  ctx.fillStyle='#1d2433';rr(52,10,120,22,6);ctx.fill();rr(-200,12,250,14,4);ctx.fill();
  ctx.fillStyle='#ffd27a';rr(160,-20,12,14,3);ctx.fill();
  [-150,-20,120].forEach(wx=>{ctx.fillStyle='#1d2433';ctx.beginPath();ctx.arc(wx,36,28,0,7);ctx.fill();ctx.fillStyle='#9aa3b8';ctx.beginPath();ctx.arc(wx,36,11,0,7);ctx.fill();});
});}
/* 길 (가로 띠 + 가운데 점선) */
function road33(x0,x1,y,h=70,o={}){ctx.save();ctx.globalAlpha*=(o.alpha??1);ctx.fillStyle='#2b3140';rr(x0,y-h/2,x1-x0,h,10);ctx.fill();ctx.strokeStyle='rgba(255,210,90,.6)';ctx.lineWidth=4;ctx.setLineDash([26,20]);line(x0+10,y,x1-10,y);ctx.setLineDash([]);ctx.restore();}
/* 만 원짜리 한 장 (작은 칸) */
function won33(x,y,w,h,col,o={}){ctx.save();ctx.globalAlpha*=(o.alpha??1);ctx.fillStyle=col;rr(x-w/2,y-h/2,w,h,3);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x+w*.22,y,h*.22,h*.3,0,0,7);ctx.stroke();ctx.restore();}
/* 시계 (분침이 돈다) */
function clock33(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{ctx.fillStyle='#fdf6e8';ctx.beginPath();ctx.arc(0,0,90,0,7);ctx.fill();ctx.strokeStyle='#1d2433';ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,90,0,7);ctx.stroke();
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;line(Math.sin(a)*74,-Math.cos(a)*74,Math.sin(a)*84,-Math.cos(a)*84);}
  if(o.arc){ctx.fillStyle=o.arcCol||'rgba(141,150,168,.55)';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,70,-Math.PI/2,-Math.PI/2+o.arc*Math.PI*2);ctx.closePath();ctx.fill();}
  const m=(T*.6)%1;ctx.lineWidth=7;ctx.lineCap='round';line(0,0,Math.sin(m*6.283)*62,-Math.cos(m*6.283)*62);ctx.lineWidth=9;line(0,0,Math.sin(m*.5236)*40,-Math.cos(m*.5236)*40);ctx.lineCap='butt';
  ctx.fillStyle='#1d2433';ctx.beginPath();ctx.arc(0,0,8,0,7);ctx.fill();});}
/* 가격표 */
function tag33(x,y,s,str,col,o={}){group(x,y,s,o.rot??-.05,o.alpha??1,()=>{ctx.font=`400 ${o.fs||48}px ${FD}`;const w=ctx.measureText(str).width+70,h=(o.fs||48)*1.6;
  const path=()=>{ctx.beginPath();ctx.moveTo(-w/2,-h/2);ctx.lineTo(w/2-20,-h/2);ctx.lineTo(w/2+18,0);ctx.lineTo(w/2-20,h/2);ctx.lineTo(-w/2,h/2);ctx.closePath();};
  ctx.fillStyle='#fff';path();ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=6;path();ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(w/2-14,0,7,0,7);ctx.fill();
  if(o.label)text(o.label,-w/2+16,-h/2-24,{a:'left',f:'D',s:26,c:col});
  text(str,-10,3,{f:'D',s:o.fs||48,c:col});});}
/* 점과 이름 (지도) */
function city33(x,y,name,col,o={}){ctx.save();ctx.globalAlpha*=(o.alpha??1);ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,22,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,y,22,0,7);ctx.stroke();ctx.restore();text(name,x+(o.dx??0),y+(o.dy??-50),{f:'D',s:o.s||40,c:'#fff',alpha:o.alpha??1});}
/* 화살표 (곡선 · 점선 가능) */
function arrow33(x0,y0,x1,y1,col,k=1,o={}){if(k<=0)return;ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=o.lw||10;if(o.dash)ctx.setLineDash(o.dash);
  const cx=(x0+x1)/2+(o.bend||0),cy=(y0+y1)/2-(o.bend||0)*.3;const q=(t)=>[(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*x1,(1-t)*(1-t)*y0+2*(1-t)*t*cy+t*t*y1];
  ctx.beginPath();ctx.moveTo(x0,y0);for(let i=1;i<=30;i++){const t=i/30*k;const [a,b]=q(t);ctx.lineTo(a,b);}ctx.stroke();ctx.setLineDash([]);
  if(k>.95){const [a,b]=q(1),[c2,d]=q(.95),ang=Math.atan2(b-d,a-c2);ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(a-30*Math.cos(ang-.45),b-30*Math.sin(ang-.45));ctx.lineTo(a-30*Math.cos(ang+.45),b-30*Math.sin(ang+.45));ctx.closePath();ctx.fill();}
  ctx.restore();}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3')){
      const a=L('o1'),q=K('o1',0);
      road33(80,1100,640,90,{alpha:P(a,0,.3)});
      truck33(560,560,1.25*E.back(P(a,0,.5))+.001,{load:true});
      text('1톤 카고 트럭 · 그림은 예시',560,760,{s:26,w:800,c:C.dim,alpha:P(a,.4,.3)});
      if(q>=0)group(1450,280,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>tag33(0,0,1.15,'359만 원',CLOAD,{label:'한 달 매출'}));else if(a>.6)text('?',1450,280,{f:'D',s:90,c:C.gold});
      if(L('o2')>=0){const k=K('o2',0);
        if(k>=0)group(1450,500,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>tag33(0,0,1.15,'시급 9,729원',CRED,{label:'남는 돈 나누기 일한 시간'}));else text('?',1450,500,{f:'D',s:90,c:C.gold});
        if(T>FR('o2',.75))pill('2025년 최저시급 10,030원보다 적다',1450,680,{s:32,bg:'rgba(255,255,255,.94)'});}
      srcLine('한국교통연구원 「2025년도 화물운송시장 실태조사 화물차주 조사 보고서」 1톤 이하 카고 1,375명 · 순수입 190만 (유가보조금 포함) ÷ (21.7일 × 9.0시간) = 9,728.6원 (python3)');
    }else if(T<CT('o3c')){
      const b=L('o3'),q=K('o3',0),X0=200,WW=1520,k=E.out(P(b,.2,.8));
      text('하루에 달리는 230.5km',960,190,{f:'D',s:56,c:'#fff',alpha:P(b,0,.3)});
      road33(X0-20,X0+WW+20,440,110,{alpha:P(b,0,.3)});
      ctx.fillStyle=CLOAD;rr(X0,500,WW*.69*k,26,8);ctx.fill();
      if(q>=0){ctx.fillStyle=CEMPTY;rr(X0+WW*.69,500,WW*.31*E.out(P(q,0,.5)),26,8);ctx.fill();}
      truck33(X0+WW*.69*k-140,420,.7,{load:true,alpha:P(b,.2,.3)*(q>=0?1-P(q,0,.3):1)});
      if(q>=0)truck33(X0+WW*.69+WW*.31*E.out(P(q,0,.8))-90,420,.7,{dim:true});
      text('짐 실은 길 159km',X0+WW*.345,580,{f:'D',s:40,c:CLOAD,alpha:P(b,.8,.3)});
      if(q>=0){text('빈 차 71.5km',X0+WW*.845,580,{f:'D',s:40,c:'#c9ced9',alpha:P(q,0,.3)});stampBox('빈 차 31%',X0+WW*.845,720,q,{s:70,c:CY,bg:'rgba(40,30,0,.92)'});}
      srcLine('한국교통연구원 2025 보고서 표 Ⅱ-18 · 일평균 적재운행 159.0km (69.0%) · 공차운행 71.5km (31.0%) · 총 230.5km');
    }else{
      const k0=L('o3c'),k9=L('o4'),k10=L('o5');
      if(k9<0){road33(100,1000,640,90,{alpha:P(k0,0,.3)});truck33(540,560,1.05,{load:true,alpha:P(k0,0,.3)});drawMascot(1450,500,.8,'think',{alpha:P(k0,.3,.3)});text('1톤 용달 트럭 한 대의 한 달',960,820,{f:'D',s:40,c:C.gold,alpha:P(k0,.5,.3)});}
      else{
        text('화물차 시작 전, 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
        for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
        if(k10>=0)['한국교통연구원 · 1,375명 조사','2025년 보고서 (2026.3 게시)','손잡이 계산 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.8,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});}
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('1톤 용달 계산서',960,200,{f:'D',s:110,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('매출 359만 원 · 시급 9,729원 · 빈 차 31%',960,325,{s:46,w:900,alpha:P(a,.3,.3),max:1780});
    road33(260,1260,690,80,{alpha:P(a,.2,.3)});truck33(760,620,.85,{load:true,alpha:P(a,.2,.3)});drawMascot(1550,640,.7,'think',{alpha:P(a,.3,.3)});
  }},
  /* ── 1톤 기사님은 누구인가 ── */
  news:{draw(){
    sub('p1','p3b',()=>{
      text('1톤 기사님 나이 (2025 조사)',960,170,{f:'D',s:52,c:C.gold});
      const q2=K('p2',0),X0=520,WW=1000,MX=50;
      [['20대',0.2],['30대',0.4],['40대',4.7],['50대',14.9],['60대',47.0],['70대 이상',32.8]].forEach(([l,v],i)=>{const y=270+i*82,t0=CT('p1')+.3+i*.2;text(l,X0-24,y,{a:'right',f:'D',s:34,c:i>=3?'#fff':'#9aa3b8'});if(T<t0)return;hbar(X0,y,WW,52,v*E.out(P(T,t0,.5)),MX,i>=3?CTOLL:'rgba(111,168,255,.45)',v.toFixed(1)+'%',{s:34,k:.85});});
      if(q2>=0&&L('p3')<0)stampBox('평균 65.5세',1500,400,q2,{s:64,c:CY,bg:'rgba(40,30,0,.92)'});
      if(L('p3')>=0&&L('p3b')<0)pill('정년 뒤 시작한 분이 많다 · 평균 경력 18.8년',960,790,{s:32,alpha:P(L('p3'),.2,.3),bg:'rgba(255,255,255,.94)'});
      if(L('p3b')>=0)pill('택배 차 제외 · 1톤 이하 카고 트럭',960,790,{s:32,alpha:P(L('p3b'),0,.3),bg:'rgba(255,255,255,.94)'});
      srcLine('한국교통연구원 2025 보고서 표 Ⅱ-1 (운전자 연령 · 평균 65.5세) · 표 Ⅱ-2 (평균 경력 18.8년) · Q&A: 용달 통계는 택배 차주 제외');});
    sub('p4','p4',()=>{
      text('트럭 값',960,170,{f:'D',s:56,c:C.gold});
      road33(160,960,660,80);truck33(560,580,1.2,{});
      const q=K('p4',0);
      if(q>=0)group(1400,360,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>tag33(0,0,1.2,'2,134만 원',CTOLL,{label:'평균 구입 값 (신차·중고 합쳐)'}));else text('?',1400,360,{f:'D',s:90,c:C.gold});
      if(T>FR('p4',.6))pill('새 차로 시작 79.6%',1400,600,{s:38,bg:'rgba(255,255,255,.94)'});
      srcLine('한국교통연구원 2025 보고서 · 평균 차량구입 금액 2,134만 원 (전년 1,999만) · 신차 구입 비율 79.6%');});
    sub('p5','p5',()=>{
      text('일감은 어디서 오나 (물량 확보 방법)',960,170,{f:'D',s:52,c:C.gold});
      const X0=560,WW=900,MX=50;
      [['주선업체',41.7,CFEE],['화물 정보망',36.2,CFEE],['제조·유통 회사',7.4,'rgba(255,255,255,.4)'],['개인적으로',6.3,'rgba(255,255,255,.4)'],['다른 운송회사',5.2,'rgba(255,255,255,.4)'],['소속 운송회사',2.1,'rgba(255,255,255,.4)']].forEach(([l,v,col],i)=>{const y=270+i*80,t0=CT('p5')+.3+i*.25;text(l,X0-24,y,{a:'right',f:'D',s:34,c:i<2?'#fff':'#9aa3b8'});if(T<t0)return;hbar(X0,y,WW,50,v*E.out(P(T,t0,.5)),MX,col,v+'%',{s:34,lc:i<2?CFEE:'#c9ced9',k:.9});});
      const q=K('p5',0);if(q>=0)stampBox('열 건 중 여덟 건 = 중간을 거친 일',1180,780,q,{s:44,c:CFEE,bg:'rgba(30,10,50,.92)'});
      srcLine('한국교통연구원 2025 보고서 표 Ⅱ-8 · 주선업체 41.7% + 정보망 36.2% = 77.9% (공동사업장 1.1% 생략)');});
    sub('p6','p7',()=>{
      text('1톤 화물 운임 (한 번 실어 나를 때, 2025)',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const X0=560,WW=1000,MX=280000,q=K('p6',0);
      [['수도권 안',62816,KT('p6',0)],['수도권 → 대전권',130909,FR('p6',.6)],['수도권 → 대구권',180290,FR('p6',.68)],['수도권 → 광주권',211816,FR('p6',.76)],['수도권 → 부산권',262000,FR('p6',.84)]].forEach(([l,v,t0],i)=>{const y=280+i*96;text(l,X0-24,y,{a:'right',f:'D',s:34,c:'#fff'});if(T<t0){if(i===0)text('?',X0+40,y,{f:'D',s:44,c:C.gold});return;}hbar(X0,y,WW,58,v*E.out(P(T,t0,.5)),MX,i===0?CLOAD:'rgba(53,224,138,.5)',v.toLocaleString('ko-KR')+'원',{s:36,lc:i===0?CLOAD:'#c9ced9',k:.8});});
      if(L('p7')>=0){const k=K('p7',0);group(960,790,1,0,P(L('p7'),0,.3),()=>{panel(-640,-50,1280,100,{bg:'rgba(6,13,32,1)',bd:CY});text('수도권 안 2024년 61,152원 → 2025년 62,816원',-60,2,{f:'D',s:34,max:1000});text(k>=0?'+2.7%':'?',520,2,{f:'D',s:44,c:CY});});}
      srcLine('한국교통연구원 2025 보고서 표 Ⅱ-9 (주요 운송구간별 화물 운임) · (62,816 − 61,152) ÷ 61,152 = 2.7% (python3)',872);});
  }},
  /* ── 평균 기사님의 하루 ── */
  setup:{draw(){
    sub('s0','s0b',()=>{
      text('보고서 평균 · 기사님 한 분의 한 달',960,170,{f:'D',s:52,c:C.gold,max:1800});
      const q=K('s0',0),q2=K('s0b',0);
      group(480,480,1,0,P(L('s0'),0,.3),()=>{panel(-300,-230,600,460,{bg:'#fdf6e8',bd:'#c0392b',lw:5,r:18});ctx.fillStyle='#c0392b';rr(-300,-230,600,80,18);ctx.fill();ctx.fillRect(-300,-170,600,20);text('한 달 일한 날',0,-188,{f:'D',s:38,c:'#fff'});
        for(let i=0;i<30;i++){const r=Math.floor(i/7),c2=i%7,on=q>=0&&i<22;ctx.fillStyle=on?(i===21?'rgba(53,160,90,.45)':'#35a05a'):'#d8cfbd';rr(-255+c2*74,-120+r*64,60,50,8);ctx.fill();}
        text(q>=0?'21.7일':'?',0,200,{f:'D',s:56,c:q>=0?'#1d2433':'#c08a00'});});
      if(L('s0b')>=0){truck33(1300,420,.9,{load:true,alpha:P(L('s0b'),0,.3)});text('하루 짐 싣기 1.9번',1300,560,{f:'D',s:44,c:'#fff',alpha:P(L('s0b'),.2,.3)});text(q2>=0?'하루 230.5km':'하루 ?km',1300,650,{f:'D',s:54,c:q2>=0?CLOAD:C.gold});}
      srcLine('한국교통연구원 2025 보고서 표 Ⅱ-18 · 월평균 운행 일수 21.7일 · 일평균 운행 횟수 1.9회 · 일평균 총운행거리 230.5km');});
    sub('s0c','s0d',()=>{
      text('하루 일하는 시간',960,170,{f:'D',s:52,c:C.gold});
      const q=K('s0c',0),X0=260,WW=1400,H9=9;
      text('9시간',X0+WW/2,270,{f:'D',s:64,c:q>=0?'#fff':C.gold,alpha:P(L('s0c'),0,.3)});
      if(q>=0){const k=E.out(P(q,0,.6));ctx.fillStyle=CTOLL;rr(X0,340,WW*5.4/H9*k,110,14);ctx.fill();const k2=E.out(P(T,FR('s0c',.6),.6));ctx.fillStyle=CEMPTY;rr(X0+WW*5.4/H9,340,WW*3.6/H9*k2,110,14);ctx.fill();
        text('운전 5.4시간',X0+WW*2.7/H9,398,{f:'D',s:44,c:'#0d1a33',alpha:P(q,.3,.3)});if(k2>0)text('싣고·내리고·기다림 3.6시간',X0+WW*7.2/H9,398,{f:'D',s:34,c:'#1d2433',alpha:k2,max:WW*3.4/H9});
        clock33(X0+WW*7.2/H9,600,.9,{alpha:k2});}
      if(L('s0c2')>=0&&L('s0d')<0)stampBox('운임표에 없는 시간',1500,620,K('s0c2',0),{s:48,c:CY,bg:'rgba(40,30,0,.92)'});
      if(L('s0d')>=0){const k=K('s0d',0);group(700,640,1,0,P(L('s0d'),0,.3),()=>{panel(-420,-90,840,180,{bg:'rgba(6,13,32,1)',bd:C.gold});text('21.7일 × 9시간 =',-40,4,{a:'right',f:'D',s:40});text(k>=0?'195.3시간':'?',-10,4,{a:'left',f:'D',s:64,c:C.gold});});
        if(k>=0)stampBox('기억해 두세요',1450,640,k,{s:52,c:C.gold,bg:'rgba(40,30,0,.92)'});}
      srcLine('한국교통연구원 2025 보고서 표 Ⅱ-20 · 1일 평균 근로시간 9.0시간 = 운행 5.4 + 운행 외 업무 3.6 (상·하차 작업 및 대기, 배차 간 대기 포함) · 21.7 × 9 = 195.3 (python3)');});
  }},
  /* ── 359만 원 쪼개기 (만 원짜리 359장) ── */
  cut:{draw(){
    text('한 달 매출 359만 원 = 만 원짜리 359장',960,170,{f:'D',s:52,c:C.gold,max:1800});
    const k1=L('t1'),q2=K('t2',0),q3=K('t3',0),t3b=FR('t3',.6),q4=K('t4',0),t4a=FR('t4',.05),t4b=FR('t4',.25),q5=K('t5',0);
    // 순서: 기름 71 · 주선+정보망 24 · 통행료 17 · 보험 12 · 수리·타이어 16 · 기타 38 = 178 → 남는 181
    const grp=[[71,CFUEL,KT('t2',0)],[24,CFEE,KT('t3',0)],[17,CTOLL,t3b],[12,CINS,t4a],[16,CREP,t4b],[38,CETC,KT('t4',0)]];
    const CW=50,CH=26,GX=6,GY=7,COLS=30,X0=960-(COLS*CW+(COLS-1)*GX)/2+CW/2,Y0=250;   // 12줄 × 33 = 396 → y 237 ~ 630
    let start=0;const colOf=new Array(359).fill(null);grp.forEach(([n,col,t0])=>{for(let i=start;i<start+n;i++)colOf[i]=[col,t0];start+=n;});
    for(let i=0;i<359;i++){const r=Math.floor(i/COLS),c2=i%COLS,k=P(k1,.1+i*.004,.2);if(k<=0)continue;
      let col='#7fd9a8';const g=colOf[i];if(g&&T>=g[1]+(i%30)*.01)col=g[0];else if(q5>=0)col=CLOAD;
      won33(X0+c2*(CW+GX),Y0+r*(CH+GY),CW,CH,col,{alpha:k});}
    const leg=[['기름값 71',CFUEL,KT('t2',0)],['주선·정보망 24',CFEE,KT('t3',0)],['통행료 17',CTOLL,t3b],['보험 12',CINS,t4a],['수리·타이어 16',CREP,t4b],['그 밖 38',CETC,KT('t4',0)]];
    leg.forEach(([l,col,t0],i)=>{if(T<t0)return;const x=180+i*280,y=690;group(x,y,1,0,P(T,t0,.3),()=>{ctx.fillStyle=col;rr(-20,-18,36,36,5);ctx.fill();text(l,26,2,{a:'left',f:'D',s:30,c:'#fff',max:240});});});
    if(L('t2')>=0&&q2<0)text('?',960,770,{f:'D',s:60,c:C.gold});
    if(q4>=0&&L('t5')<0)group(960,780,1,0,P(q4,0,.3),()=>{panel(-420,-48,840,96,{bg:'rgba(6,13,32,1)',bd:CRED});text('지출 178만 2,000원 = 178장',0,4,{f:'D',s:42,c:CRED});});
    if(L('t5')>=0)group(960,780,1,0,P(L('t5'),0,.3),()=>{panel(-820,-52,1640,104,{bg:'rgba(6,13,32,1)',bd:CLOAD});text('남는 181장 + 유가보조금 14만 →',-60,4,{a:'right',f:'D',s:38});text(q5>=0?'보고서 순수입 190만 원':'?',-30,4,{a:'left',f:'D',s:46,c:q5>=0?CLOAD:C.gold});});
    if(L('t6')>=0)pill('항목별 평균이라 더하기가 딱 맞지 않음 → 보고서 190만 원을 쓴다',960,300,{s:32,alpha:P(L('t6'),0,.3),bg:'rgba(255,255,255,.96)'});
    srcLine('한국교통연구원 2025 보고서 표 Ⅱ-10·11·17 · 매출 359 · 지출 178.2 (유류 70.6 · 주선 21.5 · 정보망 2.3 · 통행 17.2 · 보험 12.2 · 수리 9.7 · 타이어 6.2 · 기타 등 38.5) · 순수입 190 (유가보조금 14.0 포함)',872);
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='1,900,000 ÷ 195.3 =';bigS='9,728.6';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:22,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:done?80:72,f:'D',c:done?'#b5451b':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('순수입 190만 원 나누기 한 달 195.3시간',1320,180,{f:'D',s:40,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0),X0=920,WW=720,MX=11000;
    if(L('c2')>=0){
      [['2025년 최저시급',10030,'10,030원','rgba(255,255,255,.55)',CT('c2')],['1톤 기사님 (2025 조사)',9729,'9,729원',CRED,KT('c2',0)],['2026년 최저시급',10320,'10,320원','rgba(255,255,255,.55)',L('c3')>=0?CT('c3')+.3:1e9]].forEach(([l,v,lb,col,t0],i)=>{const y=330+i*140;text(l,X0,y-50,{a:'left',f:'D',s:30,c:C.dim});if(T<t0){if(i===1)text('?',X0+40,y,{f:'D',s:50,c:C.gold});return;}hbar(X0,y,WW,60,v*E.out(P(T,t0,.5)),MX,col,lb,{s:42,lc:i===1?CRED:'#fff'});});}
    if(dt>=0&&q2<0)group(1300,650,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(q2>=0&&L('c3')<0&&T>FR('c2',.7))pill('2025년 최저시급보다 약 300원 적다',1300,760,{s:32,bg:'rgba(255,255,255,.94)'});
    if(L('c3')>=0&&T>FR('c3',.5))group(1300,780,1,0,P(T,FR('c3',.5),.3),()=>{panel(-470,-70,940,140,{bg:'rgba(6,13,32,1)',bd:CEMPTY});text('이 9시간 가운데',0,-24,{f:'D',s:32,c:C.dim,max:900});text('운임이 붙지 않는 시간은?',0,30,{f:'D',s:40,c:'#fff',max:900});});
  }},
  /* ── 빈 차로 달리는 길 ── */
  empty:{draw(){
    const X0=180,WW=1560;
    if(L('e4')<0){
      text('하루 230.5km, 짐이 있을 때와 없을 때',960,170,{f:'D',s:50,c:C.gold,max:1800});
      const e1=L('e1'),q2=K('e2',0),k=E.out(P(e1,.3,1));
      road33(X0-20,X0+WW+20,420,120);
      ctx.fillStyle=CLOAD;rr(X0,500,WW*.69*k,30,8);ctx.fill();
      if(q2>=0){ctx.fillStyle=CEMPTY;rr(X0+WW*.69,500,WW*.31*E.out(P(q2,0,.6)),30,8);ctx.fill();}
      const tp=q2>=0?X0+WW*.69+WW*.31*E.out(P(q2,0,1.2)):X0+WW*.69*k;
      truck33(tp-110,400,.75,{load:q2<0,dim:q2>=0});
      if(L('e2')>=0)text('짐 싣고 159km · 69%',X0+WW*.345,590,{f:'D',s:44,c:CLOAD});
      if(q2>=0)text('빈 차 71.5km · 31%',X0+WW*.845,590,{f:'D',s:44,c:'#c9ced9',alpha:P(q2,0,.3)});
      if(L('e3')>=0){[['내린 곳 → 다음 짐',560],['집으로 돌아오는 길',1360]].forEach(([s,x],i)=>{const kk=P(L('e3'),.2+i*.8,.3);if(kk>0)pill(s,x,690,{s:32,alpha:kk,bg:'rgba(255,255,255,.9)'});});
        const q3=K('e3',0);if(q3>=0)stampBox('운임 = 짐을 실은 길에만',960,790,q3,{s:46,c:CY,bg:'rgba(40,30,0,.92)'});}
      srcLine('한국교통연구원 2025 보고서 표 Ⅱ-18 · 적재운행 159.0km (69.0%) · 공차운행 71.5km (31.0%)');
    }else if(L('e6')<0){
      text('빈 차의 한 달',960,170,{f:'D',s:56,c:C.gold});
      const q4=K('e4',0),q5=K('e5',0);
      group(470,460,1,0,P(L('e4'),0,.3),()=>{panel(-380,-230,760,460,{bg:'rgba(6,13,32,1)',bd:CEMPTY});text('빈 차로 달린 길',0,-170,{f:'D',s:38,c:C.dim});text(q4>=0?'1,552km':'?',0,-80,{f:'D',s:80,c:q4>=0?'#fff':C.gold});
        text('71.5km × 21.7일',0,-10,{s:28,w:800,c:C.dim});clock33(-150,130,.75,{arc:q4>=0?.31*P(T,FR('e4',.6),.6):0});if(T>FR('e4',.6))text('하루 약 1시간 40분',90,130,{f:'D',s:36,c:'#c9ced9',max:400});});
      if(L('e5')>=0)group(1380,400,1,0,P(L('e5'),0,.3),()=>{panel(-420,-170,840,340,{bg:'rgba(6,13,32,1)',bd:CFUEL});text('한 달 기름값 70만 6,000원',0,-120,{f:'D',s:36,c:C.dim});
        ctx.fillStyle=CFUEL;rr(-360,-60,720*.69,70,12);ctx.fill();if(q5>=0){ctx.fillStyle=CEMPTY;rr(-360+720*.69,-60,720*.31*E.out(P(q5,0,.5)),70,12);ctx.fill();}
        text('짐 실은 길',-360+720*.345,-24,{f:'D',s:30,c:'#1d2433'});text(q5>=0?'빈 차 몫 21만 9,000원':'빈 차 몫 ?',0,90,{f:'D',s:46,c:q5>=0?'#c9ced9':C.gold});});
      if(L('e5b')>=0)group(1380,700,1,0,P(L('e5b'),0,.3),()=>{panel(-420,-60,840,120,{bg:'rgba(6,13,32,1)',bd:CRED});text('1km 기름값 약',-40,4,{a:'right',f:'D',s:36});text(T>FR('e5b',.3)?'141원 · 빈 차도 같다':'?',-10,4,{a:'left',f:'D',s:42,c:CRED,max:420});});
      srcLine('71.5 × 21.7 = 1,551.6km · 운행 5.4시간 × 31% = 1.68시간 · 유류비 70.6만 × 31% = 21.9만 · 70.6만 ÷ (230.5 × 21.7) = 141원/km (python3, 거리 비율로 나눈 예시 계산)');
    }else{
      text('빈 차 비율 (공차운행 나누기 총운행)',960,170,{f:'D',s:52,c:C.gold});
      const X0b=560,WWb=1000,MX=40;
      [['2023',36.2,'36.2%'],['2024',34.9,'34.9%'],['2025',31.0,'31.0%']].forEach(([l,v,lb],i)=>{const y=330+i*130,t0=CT('e6')+.3+i*.6;text(l,X0b-24,y,{a:'right',f:'D',s:40,c:'#fff'});if(T<t0)return;hbar(X0b,y,WWb,80,v*E.out(P(T,t0,.5)),MX,i===2?CEMPTY:'rgba(141,150,168,.5)',lb,{s:44,lc:'#fff',k:.85});});
      const q=K('e6',0);if(q>=0)stampBox('여전히 3분의 1 가까이',960,760,q,{s:52,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('한국교통연구원 2025 보고서 표 Ⅱ-18 · 공차운행 비율 2023 36.2% · 2024 34.9% · 2025 31.0%');
    }
  }},
  /* ── 한 탕의 모양 ── */
  trip:{draw(){
    if(L('r4')<0){
      text('한 탕의 모양 (평균으로 나눈 그림)',960,170,{f:'D',s:52,c:C.gold,max:1800});
      const q2=K('r2',0),q3=K('r3',0);
      const A=[260,520],B=[1060,520],Cc=[1560,330];
      if(L('r1')>=0){city33(A[0],A[1],'짐 싣는 곳',CLOAD,{s:34,dy:70});city33(B[0],B[1],'짐 내리는 곳',CLOAD,{s:34,dy:70,alpha:P(L('r1'),.3,.3)});
        arrow33(A[0]+30,A[1],B[0]-40,B[1],CLOAD,E.out(P(L('r1'),.4,1)),{lw:14});truck33(lerp(A[0]+120,B[0]-120,E.io(P(L('r1'),.4,1.6))),A[1]-70,.5,{load:true});}
      if(q2>=0)group(660,370,lerp(1.4,1,E.out(P(q2,0,.3))),0,P(q2,0,.15),()=>tag33(0,0,1,'약 8만 7,000원',CLOAD,{label:'한 탕 매출'}));else if(L('r2')>=0)text('?',660,370,{f:'D',s:80,c:C.gold});
      if(L('r3')>=0){text('84km',660,600,{f:'D',s:46,c:CLOAD});city33(Cc[0],Cc[1],'다음 짐',CY,{s:34,dy:-52});
        if(q3>=0){arrow33(B[0]+40,B[1]-20,Cc[0]-30,Cc[1]+20,CEMPTY,E.out(P(q3,0,1)),{lw:12,dash:[22,16],bend:60});truck33(lerp(B[0]+120,Cc[0]-60,E.io(P(q3,.2,1.4))),lerp(B[1]-60,Cc[1]+30,E.io(P(q3,.2,1.4))),.45,{dim:true});text('빈 차 38km',1420,560,{f:'D',s:46,c:'#c9ced9',alpha:P(q3,.3,.3)});}}
      if(L('r3b')>=0){const k=P(L('r3b'),0,.3);group(960,760,1,0,k,()=>{panel(-760,-56,1520,112,{bg:'rgba(6,13,32,1)',bd:CY});text('다음 짐이 가까우면 빈 길이 짧다 → 시급이 오른다',0,4,{f:'D',s:38,c:'#fff',max:1460});});}
      srcLine('359만 ÷ (21.7일 × 1.9회 = 41.2회) = 87,073원 · 159.0 ÷ 1.9 = 83.7km · 71.5 ÷ 1.9 = 37.6km (python3, 평균으로 나눈 예시 모양)');
    }else{
      text('먼 길 · 수도권 → 부산권',960,170,{f:'D',s:52,c:C.gold});
      const S=[520,280],Bs=[1380,700],q4=K('r4',0),q5=K('r5',0);
      city33(S[0],S[1],'수도권',CTOLL,{s:40,dx:-150,dy:10});city33(Bs[0],Bs[1],'부산권',CTOLL,{s:40,dx:150,dy:10});
      arrow33(S[0]+30,S[1]+20,Bs[0]-30,Bs[1]-30,CLOAD,E.out(P(L('r4'),.2,1)),{lw:14,bend:-120});
      if(q4>=0)group(700,560,1,0,P(q4,0,.3),()=>tag33(0,0,1,'26만 2,000원',CLOAD,{label:'한 방향 운임'}));
      truck33(lerp(S[0]+80,Bs[0]-140,E.io(P(L('r4'),.3,2))),lerp(S[1]+60,Bs[1]-60,E.io(P(L('r4'),.3,2)))-40,.5,{load:true});
      if(L('r5')>=0){arrow33(Bs[0]+10,Bs[1]-40,S[0]+50,S[1]+10,CEMPTY,E.out(P(L('r5'),0,1)),{lw:12,dash:[22,16],bend:-120});
        if(q5>=0){truck33(lerp(Bs[0]-60,S[0]+160,E.io(P(q5,0,2))),lerp(Bs[1]-100,S[1]-10,E.io(P(q5,0,2))),.45,{dim:true,flip:true});text('올라올 짐이 없으면 = 전부 빈 차',1400,330,{f:'D',s:40,c:'#c9ced9',alpha:P(q5,.3,.3),max:800});}
        if(T>FR('r5',.55))pill('돌아오는 짐 = 귀로 화물',1400,420,{s:32,bg:'rgba(255,255,255,.92)'});}
      if(L('r6')>=0)stampBox('기사님 계산 = 왕복',1450,560,K('r6',0),{s:60,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('한국교통연구원 2025 보고서 표 Ⅱ-9 · 수도권 → 부산권 262,000원 (2025 평균, 구간 한 방향) · 돌아오는 짐 여부는 조사에 따로 없음');
    }
  }},
  /* ── 빈 차를 줄이면 ── */
  knob:{draw(){
    if(L('k5b')<0){
      text('손잡이 ① 빈 차 비율 (달리는 거리·시간은 그대로)',960,160,{f:'D',s:46,c:C.gold,max:1800});
      if(L('k2')>=0)pill('짐 실은 1km = 매출 약 1,040원 · 주선료 6% 빼고',960,250,{s:32,alpha:P(L('k2'),0,.3),bg:'rgba(255,255,255,.94)'});
      const cols=[[560,'빈 차 비율'],[1060,'한 달 순수입'],[1500,'시급']];
      if(L('k2')>=0)cols.forEach(([x,l])=>text(l,x,340,{f:'D',s:36,c:C.dim}));
      const rows=[['21%','238만 9,000원','12,234원',CLOAD,'k3'],['31% (지금)','190만 원','9,729원','#fff','k2'],['41%','141만 1,000원','7,223원',CRED,'k4']];
      rows.forEach(([r,a,b,col,id],i)=>{const t0=id==='k2'?FR('k2',.5):CT(id);if(T<t0-.2)return;const k=P(T,t0,.3),on=(id==='k3'&&L('k4')<0)||(id==='k4'&&L('k5')<0&&L('k4')>=0)||(id==='k2'&&L('k3')<0);const kk=id==='k2'?1:K(id,0);
        group(0,0,1,0,k,()=>{panel(200,430+i*130-52,1560,104,{bg:on?'rgba(255,197,49,.14)':'rgba(255,255,255,.05)',bd:on?C.gold:null});const y=430+i*130;text(r,560,y,{f:'D',s:40});text(kk>=0?a:'?',1060,y,{f:'D',s:44,c:kk>=0?col:C.gold});text(kk>=0?b:'?',1500,y,{f:'D',s:44,c:kk>=0?col:C.gold});});});
      if(L('k5')>=0)stampBox('빈 차 10%p = 시급 ±2,500원',960,800,K('k5',0),{s:48,c:CY,bg:'rgba(40,30,0,.92)'});
      srcLine('예시 계산 (python3): 359만 ÷ 3,450km = 1,040원/km · 바뀌는 거리 10% × 5,002km = 500km × 1,040 × (1 − 6.0%) = 48.9만 · ÷ 195.3시간',872);
    }else{
      text('손잡이 ② 기다리는 시간이 한 시간 줄면',960,160,{f:'D',s:50,c:C.gold,max:1800});
      const q=K('k5b',0);
      [['지금 · 하루 9시간',195.3,'195.3시간 → 9,729원','#fff',CT('k5b')+.3],['기다림 −1시간 · 8시간',173.6,q>=0?'173.6시간 → 10,945원':'?',CLOAD,q>=0?KT('k5b',0):1e9]].forEach(([l,v,lb,col,t0],i)=>{const y=340+i*170;text(l,240,y-60,{a:'left',f:'D',s:34,c:C.dim});if(T<t0){text('?',280,y,{f:'D',s:50,c:C.gold});return;}hbar(240,y,1000,80,v*E.out(P(T,t0,.5)),200,i===0?CTOLL:CLOAD,lb,{s:42,lc:col});});
      if(q>=0)pill('같은 190만 원 · 2026년 최저시급 10,320원을 넘는다',960,690,{s:32,alpha:P(q,.6,.3),bg:'rgba(255,255,255,.94)'});
      if(L('k6')>=0)stampBox('짐이 늘면 싣는 시간도 는다 · 방향을 보는 예시',960,800,K('k6',0)+.01,{s:40,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('예시 계산 (python3): 21.7일 × 8시간 = 173.6시간 · 1,900,000 ÷ 173.6 = 10,944.7원 · 순수입은 그대로라고 가정');
    }
  }},
  /* ── 수수료가 먼저 가져간다 ── */
  fee:{draw(){
    if(L('f5')<0){
      text('2024년 → 2025년 (1톤 이하 · 한 달 평균)',960,160,{f:'D',s:50,c:C.gold,max:1800});
      const q2=K('f2',0),q3=K('f3',0),q4=K('f4',0);
      group(520,440,1,0,P(L('f1'),0,.3),()=>{panel(-380,-230,760,460,{bg:'rgba(6,13,32,1)',bd:CLOAD});text('매출',0,-180,{f:'D',s:40,c:C.dim});
        ctx.fillStyle='rgba(53,224,138,.45)';rr(-260,140-340*.6,200,340*.6,12);ctx.fill();text('340만',-160,170,{f:'D',s:34});
        if(L('f2')>=0){ctx.fillStyle=CLOAD;rr(60,140-359*.6*E.out(P(L('f2'),0,.6)),200,359*.6*E.out(P(L('f2'),0,.6)),12);ctx.fill();text('359만',160,170,{f:'D',s:34});}
        text(q2>=0?'+19만 원':'',0,-120,{f:'D',s:50,c:CLOAD});});
      if(L('f3')>=0)group(1400,440,1,0,P(L('f3'),0,.3),()=>{panel(-380,-230,760,460,{bg:'rgba(6,13,32,1)',bd:CFEE});text('주선료',0,-180,{f:'D',s:40,c:C.dim});
        ctx.fillStyle='rgba(185,140,255,.45)';rr(-260,140-14.9*7.5,200,14.9*7.5,12);ctx.fill();text('14만 9,000',-160,170,{f:'D',s:32});
        const k=E.out(P(L('f3'),.4,.6));ctx.fillStyle=CFEE;rr(60,140-21.5*7.5*k,200,21.5*7.5*k,12);ctx.fill();text('21만 5,000',160,170,{f:'D',s:32});
        text(q3>=0?'+44%':'?',0,-118,{f:'D',s:56,c:q3>=0?CFEE:C.gold});
        if(L('f3b')>=0)text(K('f3b',0)>=0?'매출의 4.4% → 6.0%':'매출의 ?',0,-62,{f:'D',s:30,c:'#fff'});});
      if(L('f4')>=0){group(960,790,1,0,P(L('f4'),0,.3),()=>{panel(-760,-56,1520,112,{bg:'rgba(6,13,32,1)',bd:CFEE});
        ctx.fillStyle=CLOAD;rr(-700,-22,600,44,10);ctx.fill();if(q4>=0){ctx.fillStyle=CFEE;rr(-700+600*(1-6.6/19),-22,600*6.6/19*E.out(P(q4,0,.5)),44,10);ctx.fill();}
        text('늘어난 매출 19만 원 중',-60,4,{a:'left',f:'D',s:32});text(q4>=0?'6만 6,000원 · 약 3분의 1 = 주선료':'?',290,4,{a:'left',f:'D',s:32,c:CFEE,max:440});});}
      srcLine('한국교통연구원 2025 보고서 표 Ⅱ-10·11 · 매출 340 → 359만 · 주선료 14.9 → 21.5만 (+44.3%) · 6.6 ÷ 19 = 35% · 14.9 ÷ 340 = 4.4% · 21.5 ÷ 359 = 6.0% (python3)');
    }else{
      if(L('f6')<0){
        text('회사가 둘 넘게 끼는 3단계 이상 거래',960,160,{f:'D',s:50,c:C.gold,max:1800});
        const nodes=['화주','운수사','운수사','기사님'];nodes.forEach((n,i)=>{const x=330+i*420,k=P(L('f5'),.1+i*.25,.3);if(k<=0)return;group(x,340,1,0,k,()=>{panel(-140,-60,280,120,{bg:i===3?'rgba(53,224,138,.2)':'rgba(255,255,255,.08)',bd:i===3?CLOAD:'rgba(255,255,255,.4)'});text(n,0,4,{f:'D',s:44});});if(i<3)arrow33(x+150,340,x+270,340,'rgba(255,255,255,.6)',k,{lw:8});});
        const q=K('f5',0);
        [['2024',13.3],['2025',26.9]].forEach(([l,v],i)=>{const y=530+i*110,t0=i===0?FR('f5',.3):KT('f5',0);text(l,500,y,{a:'right',f:'D',s:40});if(T<t0){if(i===1)text('?',540,y,{f:'D',s:50,c:C.gold});return;}hbar(530,y,900,70,v*E.out(P(T,t0,.5)),30,i===1?CRED:'rgba(255,77,77,.45)',v+'%',{s:44,lc:'#fff',k:.9});});
        if(q>=0&&T>FR('f5',.7))pill('중간이 길수록 운임은 여러 번 나눠진다',960,790,{s:32,bg:'rgba(255,255,255,.94)'});
        srcLine('한국교통연구원 2025 보고서 표 Ⅱ-7 · 3단계 이상 (3단계 + 4단계 + 5단계 이상) 2024 10.9 + 2.4 = 13.3% → 2025 24.9 + 2.0 = 26.9% · 2단계 = 화주 → 운수사 → 차주');
      }else{
        text('유가보조금 (한 달 환급액)',960,160,{f:'D',s:52,c:C.gold});
        const q=K('f6',0);
        [['2023',10.3],['2024',10.1],['2025',14.0]].forEach(([l,v],i)=>{const y=300+i*110,t0=i<2?CT('f6')+.3+i*.4:KT('f6',0);text(l,500,y,{a:'right',f:'D',s:40});if(T<t0){if(i===2)text('?',540,y,{f:'D',s:50,c:C.gold});return;}hbar(530,y,900,70,v*E.out(P(T,t0,.5)),16,i===2?CY:'rgba(255,197,49,.45)',v.toFixed(1)+'만 원',{s:42,lc:'#fff',k:.85});});
        group(960,700,1,0,P(L('f6'),.6,.3),()=>{panel(-820,-80,1640,160,{bg:'rgba(6,13,32,1)',bd:CY});text('리터당 지급 단가',0,-36,{f:'D',s:30,c:C.dim});text('152.37원 → 187.62 → 224.28 → 266.58 → 292.66원 (2025.11~)',0,26,{f:'D',s:34,max:1580});});
        srcLine('한국교통연구원 2025 보고서 표 Ⅱ-14 · 유가보조금 지급단가 (2022.7.1 ~ 2025.11.1 이후) · 순수입 190만 원은 보조금 포함');
      }
    }
  }},
  /* ── 체크 ── */
  check:{draw(){
    const a=L('q1'),ov=L('q7');
    text('화물차 시작 전, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)*(ov>=0?1-P(ov,0,.3):1),max:1800});
    const cards=[['q2','시급','순수입 ÷ 기다린 시간까지 전부','오늘: 9,729원'],['q3','빈 차 비율','짐 없는 길 ÷ 달린 길','오늘: 31%'],['q4','돌아오는 짐','먼 운임일수록 올라올 짐','부산권 26.2만은 한 방향'],
      ['q5','수수료','일감 열에 여덟이 중간을 거친다','오늘: 매출의 6%'],['q6','차값','평균 2,134만 원','할부면 매달 나간다']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      if(ov>=0&&P(ov,0,.3)>=1)return;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:34,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,500,1,0,P(ov,0,.3),()=>{panel(-820,-330,1640,640,{bg:'rgba(6,13,32,1)',bd:C.gold});text('한 달 매출 400만 원 · 지출 200만 원',0,-250,{f:'D',s:42,max:1540});text('하루 10시간 × 22일',0,-185,{f:'D',s:42,max:1540,c:'#ffd0a3'});text('시급은 얼마일까?',0,-115,{f:'D',s:46,max:1540,c:C.gold});
      const b=L('q7b');
      if(b>=0)text('남는 돈 200만 원 나누기 220시간',0,-10,{f:'D',s:42,alpha:P(b,0,.3),max:1540});
      const k=K('q7b',0);if(k>=0)text('9,091원',0,150,{f:'D',s:130,c:CRED,glow:'rgba(255,77,77,.4)',alpha:P(k,0,.3)});else text('?',0,150,{f:'D',s:120,c:C.gold});
      if(k>=0&&T>FR('q7b',.6))text('매출이 늘어도 시간이 같이 늘면 시급은 제자리',0,265,{f:'D',s:34,c:'#fff',max:1540});});}
  }},
  /* ── 마무리 ── */
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('1톤 용달 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      truck33(400,520,.9,{load:true,alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['한 달 매출','359만 원',CLOAD,b,.2],['순수입 (보조금 포함)','190만 원',CLOAD,b,2.2],['시급 (하루 9시간)','9,729원',CRED,b,4.2],['하루 중 빈 차','71.5km · 31%',CEMPTY,b2,.2],['늘어난 매출 중 주선료','약 3분의 1',CFEE,b2,2.2]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;group(1260,270+i*125,1,0,kk,()=>{panel(-560,-52,1120,104,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-520,4,{a:'left',f:'D',s:34,max:560});text(v,520,4,{a:'right',f:'D',s:42,c:col,max:480});});});
    }else{
      road33(120,1300,560,100);truck33(520,480,.9,{load:true});truck33(1050,480,.7,{dim:true,flip:true});drawMascot(1650,500,.55,'happy');
      stampBox('운임 = 달린 길이 아니라 짐을 실은 길의 값',960,780,c,{s:42,c:C.gold,bg:'rgba(40,30,0,.85)'});
      if(L('z4')>=0&&L('z4b')<0)pill('화물 일을 하지 말자는 게 아니다',1300,180,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('조사 평균 · 손잡이는 예시 · 창업 권유·만류 아님 · 📌 출처는 설명란',1200,180,{s:30,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,180,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-540,-70,1080,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 돌아오는 길, 짐 몇 번 실으세요?',0,4,{s:40,w:900,c:C.ink,max:1020});});
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
