/* ════════════════════════════════════════════════════════════════════
   장면 (LF.27 개인택시 번호판 계산서 — 서울 평균 거래가 1억 1,537만 원 · 이자 월 28만 8,425원(연 3% 예시) · 10년 3,461만 = 백 칸 중 서른 칸 · 팔 때 값 −10%마다 열 칸 · 2019년 −12.5% · 2021 양수 요건 완화 뒤 +46% · 60세 이상 76.2% · 뉴욕 −81%) — 수치·출처는 docs/longform-ep27.md
   중심 그림: 노란 번호판을 백 칸(한 칸 ≈ 115만 원)으로 나눈 판. 이자는 주황 칸, 팔 때 값이 내린 몫은 빨간 칸으로 칠한다 (예시).
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['1','1','5','3','7','0','0','0','0','×','0','.','0','3','÷','1','2','='];   // 115,370,000 × 0.03 ÷ 12 = 288,425 (0 개수: 115370000 은 넷)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold,a:o.a});}
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433',max:460});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:32,w:900,c:'#3a4256',max:260});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433',max:190});});
});}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CY='#F5C400', CI='#FF9F43', CR='#FF4D4D', CP='#35E08A', CG='#9aa3b8', CS='#6FD3FF';   // 번호판 노랑 · 이자 · 값 하락 · 남는 돈 · 회색 · 서울
/* 영업용 번호판 (가짜 번호). o.tag 아래 딱지 */
function plate27(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,150,260,16,0,0,7);ctx.fill();
  ctx.fillStyle=CY;rr(-260,-120,520,240,22);ctx.fill();ctx.strokeStyle='#1d2433';ctx.lineWidth=8;rr(-244,-104,488,208,16);ctx.stroke();
  text('서울 00 바',0,-46,{f:'D',s:58,c:'#1d2433'});text('0000',0,48,{f:'D',s:104,c:'#1d2433'});
  ctx.fillStyle='#1d2433';[-210,210].forEach(px=>{ctx.beginPath();ctx.arc(px,-80,9,0,7);ctx.fill();});
  if(o.tag)group(0,186,1,0,1,()=>{ctx.fillStyle='rgba(6,13,32,.92)';rr(-230,-34,460,68,34);ctx.fill();text(o.tag,0,3,{f:'D',s:36,c:C.gold,max:430});});
});}
/* 개인택시 옆모습 (상표 없음) */
function taxi27(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,118,360,22,0,0,7);ctx.fill();
  ctx.fillStyle=o.dim?'#7d7f86':'#f2f2ee';ctx.beginPath();ctx.moveTo(-340,70);ctx.lineTo(-330,0);ctx.lineTo(-210,-10);ctx.lineTo(-120,-90);ctx.lineTo(130,-90);ctx.lineTo(220,-10);ctx.lineTo(330,0);ctx.lineTo(345,70);ctx.closePath();ctx.fill();
  ctx.fillStyle='#22324a';ctx.beginPath();ctx.moveTo(-190,-12);ctx.lineTo(-112,-74);ctx.lineTo(-10,-74);ctx.lineTo(-10,-12);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(10,-12);ctx.lineTo(10,-74);ctx.lineTo(122,-74);ctx.lineTo(196,-12);ctx.closePath();ctx.fill();
  ctx.fillStyle=o.dim?'#9a8a40':CY;rr(-60,-132,120,40,10);ctx.fill();text('개인',0,-110,{f:'D',s:28,c:'#1d2433'});
  ctx.fillStyle=CY;ctx.fillRect(-338,22,684,14);
  [-200,200].forEach(wx=>{ctx.fillStyle='#1b1d22';ctx.beginPath();ctx.arc(wx,72,52,0,7);ctx.fill();ctx.fillStyle='#8c93a3';ctx.beginPath();ctx.arc(wx,72,22,0,7);ctx.fill();});
  ctx.fillStyle='#ffe9a3';rr(318,8,26,18,6);ctx.fill();
});}
/* 사람 한 명 (줄 그림용) */
function person27(x,y,s,col){ctx.save();ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-34*s,16*s,0,7);ctx.fill();rr(x-17*s,y-14*s,34*s,50*s,12*s);ctx.fill();ctx.restore();}
/* 번호판 백 칸 판. col(i) 가 칸 색을 돌려준다(null 이면 빈 칸). k = 나타나는 정도 */
function grid27(x0,y0,cell,gap,col,k=1){
  ctx.fillStyle=CY;rr(x0-18,y0-18,10*(cell+gap)-gap+36,10*(cell+gap)-gap+36,18);ctx.fill();
  for(let i=0;i<100;i++){const r=Math.floor(i/10),cc=i%10,kk=E.back(P(k,i*.006,.3));if(kk<=0)continue;const cx=x0+cc*(cell+gap)+cell/2,cy=y0+r*(cell+gap)+cell/2,w=cell*Math.min(1,kk);
    ctx.fillStyle=col(i)||'#2a3146';rr(cx-w/2,cy-w/2,w,w,8);ctx.fill();}
}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3b')){
      const a=L('o1');
      taxi27(480,560,1.05*E.back(P(a,0,.5))+.001,{});
      plate27(480,300,.62*E.back(P(a,.3,.5))+.001,{});
      text('그림은 예시 · 실제 번호 아님',480,760,{s:26,w:800,c:C.dim,alpha:P(a,.4,.3)});
      group(1340,250,1,0,P(a,0,.3),()=>{panel(-500,-100,1000,200,{bd:CY,bg:'rgba(6,13,32,.7)'});text('서울 개인택시 번호판 · 평균 거래가 (2026.1)',-460,-46,{a:'left',f:'D',s:34,c:C.dim,max:920});});
      big('o1',0,1340,300,'1억 1,537만 원',{f:'D',s:84,c:CY});
      if(L('o2')>=0)group(1340,500,1,0,P(L('o2'),.2,.3),()=>{ctx.fillStyle='#fff';rr(-470,-70,940,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-200,70);ctx.lineTo(-240,118);ctx.lineTo(-140,70);ctx.fill();text('“번호판은 팔면 그대로 돌아오는 돈”',0,4,{f:'D',s:40,c:C.ink,max:900});});
      if(K('o3',0)>=0)stampBox('돌려주는 사람 = 다음에 사 줄 사람',1340,720,K('o3',0),{s:46,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('서울시 교통 누리집 \'택시 현황\' (개인택시면허 양도·양수 평균 거래가, 2026.1) · 그림은 예시');
    }else if(T<CT('o4')){
      const b=L('o3b');
      text('팔 때 값이 10%만 내려도',960,190,{f:'D',s:60,c:C.gold});
      group(560,470,1,0,P(b,0,.3),()=>{panel(-380,-170,760,340,{bd:CR,bg:'rgba(6,13,32,.7)'});text('사라지는 돈',0,-100,{f:'D',s:44,c:C.dim});});
      big('o3b',0,560,500,'−1,154만 원',{f:'D',s:96,c:CR});
      group(1360,470,1,0,P(b,.3,.3),()=>{panel(-380,-170,760,340,{bd:CI,bg:'rgba(6,13,32,.7)'});text('한 달 남는 돈 300만 원으로',0,-100,{f:'D',s:40,c:C.dim,max:700});});
      big('o3b',1,1360,500,'네 달 치',{f:'D',s:110,c:CI});
      if(L('o3c')>=0){const k=L('o3c');group(960,700,1,0,P(k,0,.3),()=>{for(let i=0;i<7;i++)person27(-620+i*80,40,1.4,i===6?C.gold:'rgba(255,255,255,.35)');text('다음에 사 줄 사람은?',-60,10,{f:'D',s:54,c:C.gold,a:'left',max:600});});}
      srcLine('예시 계산: 115,370,000 × 0.1 = 11,537,000 · ÷ 3,000,000 = 3.85달 (python3) · 한 달 남는 돈 300만 원은 예시 가정');
    }else{
      const k9=L('o4'),k10=L('o5');
      text('번호판 사기 전에 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['거래가 · 서울시 통계','기사 나이 · 양수 요건 · 보도','수입 · 금리 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.6,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('개인택시 번호판 계산서',960,210,{f:'D',s:106,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('평균 1억 1,537만 원 · 이자 한 달 28만 원 · 값은 다음 사람이 정한다',960,335,{s:44,w:900,alpha:P(a,.3,.3),max:1780});
    taxi27(560,660,.75,{alpha:P(a,.2,.3)});plate27(1120,640,.5,{alpha:P(a,.3,.3),rot:-.05});drawMascot(1600,680,.7,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 기사님 ── */
  setup:{draw(){
    sub('p1','p3',()=>{
      emoji('🧓',420,420,250);taxi27(420,700,.6,{});
      text('예시 기사님',1320,200,{f:'D',s:50,c:C.gold});
      if(L('p2')>=0){const q=K('p2',0);
        text('예순 살 · 회사를 그만두고 · 모아 둔 돈으로',1320,290,{f:'D',s:38,c:C.dim,max:950});
        text('번호판',1320,380,{f:'D',s:44,c:C.dim});text(q>=0?'1억 1,537만 원':'?',1320,470,{f:'D',s:96,c:q>=0?CY:C.gold});
        if(T>FR('p2',.7))pill('차값은 따로 · 오늘은 번호판만',1320,560,{s:30,bg:'rgba(255,255,255,.92)'});}
      if(L('p3')>=0){const k=E.out(P(L('p3'),.2,1.2)),X0=880,WW=880,Y=720;
        ctx.fillStyle='rgba(255,255,255,.12)';rr(X0,Y-20,WW,40,20);ctx.fill();ctx.fillStyle=CY;rr(X0,Y-20,WW*k,40,20);ctx.fill();
        text('60세 · 산다',X0,Y-56,{a:'left',f:'D',s:38});if(k>.95){text('70세 · 판다',X0+WW,Y-56,{a:'right',f:'D',s:38,c:C.gold});}text('10년 동안 몬다',X0+WW/2,Y+62,{f:'D',s:36,c:C.dim,alpha:k});}
      srcLine('예시 가정 · 나이·기간·자금은 계산을 위한 예 · 1억 1,537만 원: 서울시 평균 거래가 2026.1');});
    sub('p3b','p3b',lt=>{
      text('서울 개인택시 면허 수 (서울시)',960,180,{f:'D',s:54,c:C.gold});
      const X=[640,1280],BASE=640;
      [[49269,'2016년',CG,1],[49048,'2026년 1월',CY,E.out(P(lt,1,.6))]].forEach(([v,y,col,k],i)=>{const h=340*k;ctx.fillStyle=col;rr(X[i]-140,BASE-h,280,h,14);ctx.fill();text(y,X[i],BASE+48,{f:'D',s:42});if(k>0)text(v.toLocaleString('ko-KR')+'대',X[i],BASE-h-44,{f:'D',s:60,c:col});});
      if(T>FR('p3b',.6))stampBox('새로 늘지 않는다 → 누군가의 번호판을 산다',960,770,T-FR('p3b',.6),{s:42,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('서울시 교통 누리집 \'택시 현황\' 연도별 택시면허 현황 (개인 49,269 → 49,048, 면허 취소로 감소) · 두 막대는 같은 높이로 그림(차이 221대, 0.4%)');});
    sub('p4','p5',()=>{
      receipt(560,460,1,[['업계가 말하는 수입','월 400만대'],['연료·보험·정비 등','빼고'],['= 한 달 남는 돈',K('p4',0)>=0?'300만':'?','#1a7a44']],{title:'기사님 한 달 (예시)'});
      if(L('p5')>=0){plate27(1360,430,.9*E.back(P(L('p5'),.1,.4))+.001,{});text('1억 1,537만 원 → 백 칸?',1360,700,{f:'D',s:56,c:C.gold,alpha:P(L('p5'),.4,.3)});}
      srcLine('300만 원은 예시 가정 · 월 400만 원대: 전국개인택시운송사업조합연합회 설명(연합뉴스 2026.1.4 인용, 비용을 뺀 금액인지는 기사에 없음)');});
  }},
  /* ── 1억 1,537만 원 쪼개기 (백 칸) ── */
  cut:{draw(){
    const X0=200,Y0=240,CELL=50,GAP=6;
    const q3=K('s3',0),fill=q3>=0?Math.floor(30*E.io(P(q3,0,1.2))):0;
    grid27(X0,Y0,CELL,GAP,i=>i<fill?CI:null,L('s1'));
    const RX=1280;
    text('번호판 1억 1,537만 원 = 백 칸',RX,200,{f:'D',s:50,c:C.gold,max:1000});
    if(L('s1')>=0){const q=K('s1',0);group(RX,330,1,0,P(L('s1'),.2,.3),()=>{panel(-430,-70,860,140,{bd:CY,bg:'rgba(6,13,32,1)'});text('한 칸',-390,4,{a:'left',f:'D',s:44});text(q>=0?'≈ 115만 원':'?',390,4,{a:'right',f:'D',s:60,c:q>=0?CY:C.gold});});}
    if(L('s2')>=0)group(RX,480,1,0,P(L('s2'),.1,.3),()=>{panel(-430,-60,860,120,{bd:CI,bg:'rgba(6,13,32,1)'});text('은행에 넣었다면 · 연 3% (예시)',0,4,{f:'D',s:42,c:CI,max:800});});
    if(L('s3')>=0){text('1년 346만 원 · 10년',RX,590,{f:'D',s:40,c:C.dim});big('s3',0,RX,670,'3,461만 원',{f:'D',s:80,c:CI});
      if(K('s3',1)>=0)popText(KT('s3',1),RX,770,'= 서른 칸',{f:'D',s:66,c:CI,glow:'rgba(255,159,67,.35)'});}
    if(L('s4')>=0&&L('s4b')<0)stampBox('기회비용',X0+280,Y0+280,L('s4'),{s:80,c:CI,bg:'rgba(40,20,0,.92)'});
    if(L('s4b')>=0)group(X0+280,Y0+280,1,0,P(L('s4b'),0,.3),()=>{panel(-330,-110,660,220,{bd:CI,bg:'rgba(6,13,32,.95)'});text('한 달 28만 원 남짓은',0,-36,{f:'D',s:44,max:600});text('은행에 둬도 받았을 돈',0,40,{f:'D',s:44,c:CI,max:600});});
    srcLine('115,370,000 ÷ 100 = 1,153,700 · × 3% × 10년 = 34,611,000 = 30칸 (python3) · 금리 3%는 예시, 세금·복리 제외');
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='115,370,000 × 0.03 ÷ 12 =';bigS='288,425';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:24,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:done?84:80,f:'D',c:done?'#b5451b':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('번호판 값 × 금리 3% ÷ 12달',1320,180,{f:'D',s:44,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0);
    text('한 달 남는 돈 (예시)',920,320,{a:'left',f:'D',s:40});hbar(920,390,820,70,300,320,CP,'300만',{s:42});
    text('그중 번호판 이자',920,490,{a:'left',f:'D',s:40});hbar(920,560,820,70,q2>=0?28.8*E.out(P(q2,0,.6)):0,320,CI,q2>=0?'28만 8,425':'?',{s:42,lc:q2>=0?CI:C.gold});
    if(q2>=0&&L('c3')<0)stampBox('한 달 28만 8,425원',1330,690,q2,{s:56,c:CI,bg:'rgba(40,20,0,.92)'});
    if(dt>=0&&q2<0)group(1300,690,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    if(L('c3')>=0)group(1330,690,1,0,P(L('c3'),0,.3),()=>{panel(-440,-50,880,100,{bg:'rgba(6,13,32,1)',bd:CI});text('남는 돈의',-400,4,{a:'left',f:'D',s:38});text('9.6% ≈ 열에 하나',400,4,{a:'right',f:'D',s:46,c:CI});});
    if(L('c3b')>=0)group(1330,810,1,0,P(L('c3b'),0,.3),()=>{panel(-440,-46,880,92,{bg:'rgba(6,13,32,1)',bd:'rgba(255,255,255,.4)'});text('1년 346만 원 = 남는 돈 한 달 치 넘게',0,4,{f:'D',s:36,max:840});});
    if(L('c4')>=0)pill('※ 산 값 그대로 팔 때',1330,250,{s:30,bg:'rgba(255,255,255,.94)',alpha:P(L('c4'),.2,.3)});
  }},
  /* ── 팔 때 값이 정한다 ── */
  sell:{draw(){
    const X0=200,Y0=240,CELL=46,GAP=6;
    const q3=K('e3',0),q4=K('e4',0);
    let red=0;if(q3>=0)red=Math.floor(10*E.io(P(q3,0,.8)));if(L('e4')>=0)red=20;if(q4>=0)red=20+Math.floor(10*E.io(P(q4,0,.8)));
    grid27(X0,Y0,CELL,GAP,i=>i<30?CI:(i>=100-red?CR:null),1);
    const leg=[[CI,'이자 (10년)'],[CR,'팔 때 내린 값']];leg.forEach(([c,t],i)=>{ctx.fillStyle=c;rr(X0+i*300,Y0+548,30,30,6);ctx.fill();text(t,X0+i*300+44,Y0+564,{a:'left',s:28,w:900,c:'#fff'});});
    const RX=1280,rows=[['그대로 팔면','28만 8,425',CI,'e2',0],['10% 내리면','38만 4,567',C.gold,'e3',KT('e3',0)],['20% 내리면','48만 708','#ff8a5a','e4',CT('e4')],['30% 내리면','57만 6,850',CR,'e5',KT('e5',0)]];
    text('번호판이 한 달에 쓰는 돈 (10년)',RX,190,{f:'D',s:44,c:C.gold,max:1000});
    rows.forEach(([l,v,col,id,t0],i)=>{if(L(id)<0)return;const vis=t0===0?L(id)>=0:T>=t0;const y=300+i*120;
      group(RX,y,1,0,vis?P(T,t0||CT(id),.3):.35,()=>{panel(-430,-50,860,100,{bg:'rgba(6,13,32,1)',bd:col,lw:3});text(l,-400,4,{a:'left',f:'D',s:38});text(vis?v+'원':'?',400,4,{a:'right',f:'D',s:44,c:vis?col:C.gold});});});
    if(K('e5',1)>=0&&L('e5b')<0)stampBox('남는 돈의 5분의 1',RX,800,K('e5',1),{s:52,c:CR,bg:'rgba(40,0,0,.92)'});
    if(L('e5b')>=0&&L('e6')<0)pill('값이 오르면 돌아온다 → 맞히는 문제가 아니라 정할 수 없는 문제',RX,800,{s:28,bg:'rgba(255,255,255,.95)',alpha:P(L('e5b'),.2,.3)});
    if(L('e6')>=0)stampBox('팔 때 값 = 다음 사람이 정한다',RX,800,L('e6'),{s:50,c:C.gold,bg:'rgba(40,30,0,.92)'});
    srcLine('예시 계산: 이자 288,425 + 하락분 ÷ 120달 (10% = 96,142) (python3) · 금리 3%·10년·하락률은 예시 가정');
  }},
  /* ── 값은 오르기만 했을까 (서울시 평균 거래가) ── */
  hist:{draw(){
    const Y=['2018','2019','2020','2021','2022','2023','2024','2025','2026.1'],V=[8494,7432,7883,8277,8342,9033,10960,11353,11537],TX=[1866,2039,2178,3197,2725,2881,3243,3530,312];
    const X0=260,DX=180,BASE=760,MX=12000,HH=400,h7=L('h7');
    if(h7<0){
      text('서울 개인택시 번호판 평균 거래가 (만 원)',960,170,{f:'D',s:48,c:C.gold,max:1800});
      const q2=K('h2',0),h4=L('h4');
      V.forEach((v,i)=>{let k;if(i===0)k=E.out(P(L('h1'),.6,.6));else if(i===1)k=q2>=0?E.out(P(q2,0,.6)):0;else k=h4>=0?E.out(P(h4,.2+(i-2)*.25,.5)):0;if(k<=0)return;
        const h=HH*v/MX*k,x=X0+i*DX;let col=i===1?CR:(i>=2?CY:CG);if(i===8)col=CP;
        if(L('h4b')>=0&&L('h5')<0&&(i===5||i===6))col=i===6?C.gold:'#d9b64a';
        ctx.fillStyle=col;rr(x-60,BASE-h,120,h,10);ctx.fill();
        if(k>.95)text(v.toLocaleString('ko-KR'),x,BASE-h-30,{f:'D',s:34,c:col});});
      Y.forEach((y,i)=>text(y,X0+i*DX,BASE+40,{s:28,w:900,c:'#c9ced9'}));
      if(K('h2',1)>=0&&h4<0)stampBox('한 해 −12.5% (−1,062만)',X0+DX*1+380,330,K('h2',1),{s:46,c:CR,bg:'rgba(40,0,0,.92)'});
      if(L('h3')>=0&&h4<0)pill('왜 내려갔는지는 이 표만으로 알 수 없다',1200,520,{s:30,bg:'rgba(255,255,255,.95)',alpha:P(L('h3'),.2,.3)});
      if(K('h4',0)>=0&&L('h4b')<0)stampBox('2020 → 2026.1  +46%',760,300,K('h4',0),{s:50,c:CP,bg:'rgba(0,40,20,.92)'});
      if(L('h4b')>=0&&L('h5')<0)stampBox('한 해 +1,927만',X0+DX*5.5-260,300,L('h4b'),{s:50,c:C.gold,bg:'rgba(40,30,0,.92)'});
      if(L('h5')>=0){const xm=X0+DX*2.5;ctx.save();ctx.strokeStyle='#fff';ctx.setLineDash([10,8]);ctx.lineWidth=4;line(xm,260,xm,BASE);ctx.restore();
        group(640,300,1,0,P(L('h5'),0,.3),()=>{panel(-420,-100,840,200,{bd:C.gold,bg:'rgba(6,13,32,1)'});text('2021.1.1 양수 요건 완화',0,-50,{f:'D',s:42,c:C.gold});text('사업용 경력 없이도 · 무사고 5년 + 교육 5일',0,6,{s:30,w:900,c:'#fff',max:800});if(L('h6')>=0)text('목적: 고령화 완화 · 청장년층 유입 · 값이 오른 이유로 단정 못 함',0,60,{s:26,w:900,c:'#ffd27a',max:800,alpha:P(L('h6'),.1,.3)});});}
      srcLine('서울시 교통 누리집 \'택시 현황\' 개인택시면허 양도·양수 평균 거래가 · 2021 양수 요건: 서울시 교통 누리집 보도(규제 완화) · 2026.1 은 1월 한 달 값');
    }else{
      text('서울 개인택시 번호판 거래 대수 (한 해)',960,170,{f:'D',s:48,c:C.gold,max:1800});
      const MX2=4000;
      TX.slice(0,8).forEach((v,i)=>{const k=E.out(P(h7,.2+i*.15,.5));if(k<=0)return;const h=HH*v/MX2*k,x=X0+i*DX+90;const col=i===7?CS:CG;ctx.fillStyle=col;rr(x-60,BASE-h,120,h,10);ctx.fill();if(k>.95)text(v.toLocaleString('ko-KR'),x,BASE-h-30,{f:'D',s:34,c:col});text(Y[i],x,BASE+40,{s:28,w:900,c:'#c9ced9'});});
      if(K('h7',0)>=0)stampBox('백 대 중 일곱 대꼴 주인이 바뀐다',760,300,K('h7',0)+.6,{s:46,c:CS,bg:'rgba(0,25,40,.92)'});
      srcLine('서울시 교통 누리집 \'택시 현황\' (총 거래대수 · 2025년 3,530대 ÷ 개인택시 면허 49,049대 = 7.2%, python3)');
    }
  }},
  /* ── 사 줄 사람의 줄 ── */
  queue:{draw(){
    sub('a1','a3b',()=>{
      text('전국 개인택시 기사 나이 (2025.10 · 16만 4천여 명)',960,170,{f:'D',s:46,c:C.gold,max:1800});
      const rows=[['30세 미만',0.04,'0.04% · 70명',KT('a3',0)],['30대',0.71,'0.71%',CT('a3')+1.5],['40대',4.9,'4.9%',CT('a1')+1.2],['50대',18.1,'18.1%',CT('a1')+1.6],['60세 이상',76.2,'76.2%',KT('a2',0)]];
      const X0=520,WW=1100,MX=80;
      rows.forEach(([t,v,lb,t0],i)=>{const y=290+i*108,on=t0>0&&T>=t0,k=on?E.out(P(T,t0,.6)):0;
        text(t,X0-30,y,{a:'right',f:'D',s:40,c:on?(i===4?CR:'#fff'):'rgba(255,255,255,.3)'});
        hbar(X0,y,WW,74,v*k,MX,i===4?CR:(i===3?'#ffb36b':CS),on&&k>.9?lb:(on?'':'?'),{s:40,lc:i===4?CR:'#fff'});
        if(i===4&&L('a3')>=0){ctx.fillStyle='rgba(120,0,0,.6)';rr(X0,y-37,WW*55.4/MX,74,24);ctx.fill();text('65세 이상 55.4%',X0+WW*55.4/MX/2,y+2,{f:'D',s:34,c:'#fff'});}});
      if(L('a3b')>=0)pill('법인택시 기사도 60세 이상 60.3%',960,860-50,{s:32,bg:'rgba(255,255,255,.95)',alpha:P(L('a3b'),.2,.3)});
      srcLine('한국교통안전공단 운수종사자관리시스템 (2025.10 말, 전국) — 연합뉴스 팩트체크 2026.1.4 인용');});
    sub('a4','a4b',()=>{
      text('두 줄의 길이 (전국 개인택시 기사)',960,170,{f:'D',s:50,c:C.gold});
      const k=L('a4');
      text('65세 이상',360,330,{a:'right',f:'D',s:42,c:CR});text('9만 1천여 명',360,385,{a:'right',s:30,w:900,c:C.dim});
      for(let i=0;i<20;i++){if(P(k,.1+i*.04,.2)<=0)break;person27(440+i*68,370,1.5,CR);}
      text('50세 미만',360,560,{a:'right',f:'D',s:42,c:CS});
      const q=K('a4',0);text(q>=0?'약 9,300명':'?',360,615,{a:'right',s:30,w:900,c:q>=0?C.dim:C.gold});
      if(q>=0)for(let i=0;i<2;i++){if(P(q,.1+i*.2,.2)<=0)break;person27(440+i*68,600,1.5,CS);}
      if(q>=0)popText(q+.6,1200,600,'열 배 가까운 차이',{f:'D',s:60,c:C.gold});
      if(L('a4b')>=0)pill('지금 50대 2만 9천여 명 → 10년 뒤엔 모두 60대',960,790,{s:32,bg:'rgba(255,255,255,.95)',alpha:P(L('a4b'),.2,.3)});
      srcLine('91,000 ÷ (8,043 + 1,172 + 70) = 9.8배 (python3) · 한 사람 그림 ≈ 4,600명 · 연합뉴스 2026.1.4 (교통안전공단 자료)');});
    sub('a5','a7',()=>{
      const k5=L('a5');
      text('번호판은 언젠가 판다',960,170,{f:'D',s:56,c:C.gold});
      group(560,400,1,0,P(k5,.1,.3),()=>{panel(-400,-150,800,300,{bd:C.gold,bg:'rgba(6,13,32,1)'});text('택시 자격유지검사',0,-90,{f:'D',s:42,c:C.dim});text('65세~ 3년마다',0,-10,{f:'D',s:56});text('70세~ 해마다',0,80,{f:'D',s:56,c:C.gold});});
      const a6=L('a6');
      if(a6>=0){group(1360,330,1,0,P(a6,0,.3),()=>{text('파는 줄',-300,0,{f:'D',s:40,c:CR,a:'left'});for(let i=0;i<9;i++)person27(-120+i*52,20,1.1,CR);});
        group(1360,470,1,0,P(a6,.8,.3),()=>{text('사는 줄',-300,0,{f:'D',s:40,c:CS,a:'left'});for(let i=0;i<3;i++)person27(-120+i*52,20,1.1,CS);text('주로 은퇴를 앞둔 바깥사람',-300,72,{s:28,w:900,c:C.dim,a:'left',max:500});});}
      if(L('a6')>=0&&T>FR('a6',.7))stampBox('두 줄의 길이 = 번호판 값',1360,640,T-FR('a6',.7),{s:50,c:C.gold,bg:'rgba(40,30,0,.92)'});
      if(L('a7')>=0)pill('나이 숫자 = 전국 기준 · 서울만 따로 나눈 자료 아님',960,800,{s:32,bg:'rgba(255,255,255,.95)',alpha:P(L('a7'),.1,.3)});
      srcLine('자격유지검사 주기: 문화일보 2023.1.27 (교통안전공단) · \'은퇴자들이 개인택시에 몰리면서\': 연합뉴스 2026.1.4 · 줄 그림은 비율이 아닌 예시');});
  }},
  /* ── 뉴욕의 번호판 (어두운 장) ── */
  nyc:{draw(){
    sub('y1','y3',()=>{
      emoji('🗽',360,420,220);text('뉴욕 노란 택시 면허',360,640,{f:'D',s:44,c:C.gold});text('(메달리온)',360,700,{f:'D',s:38,c:C.dim});
      const BASE=760,HH=460,MX=1300,X=[980,1480];
      const k2=K('y2',0),q3=K('y3',0);
      [[1300,'2013년','130만 달러',CG,k2>=0?E.out(P(k2,0,.6)):0],[241,'2017년 3월 · 한 건','24만 1,000달러',CR,q3>=0?E.out(P(q3,0,.6)):0]].forEach(([v,y,lb,col,k],i)=>{
        text(y,X[i],BASE+44,{f:'D',s:36,c:'#c9ced9'});if(k<=0){if(L('y2')>=0)text('?',X[i],BASE-80,{f:'D',s:80,c:C.gold});return;}const h=HH*v/MX*k;ctx.fillStyle=col;rr(X[i]-120,BASE-h,240,h,12);ctx.fill();text(lb,X[i],BASE-h-40,{f:'D',s:46,c:col});});
      if(K('y3',1)>=0)stampBox('−81%',1480,420,K('y3',1),{s:100,c:CR,bg:'rgba(40,0,0,.92)'});
      srcLine('CBS News 2017.4.14 \'How much is a NYC taxi medallion worth these days?\' (4년 전 130만 달러 · 2017년 3월 24만 1,000달러 한 건) · 241 ÷ 1,300 − 1 = −81% (python3)');});
    sub('y3b','y4',()=>{
      text('그 무렵 뉴욕 (2017년 보도)',960,170,{f:'D',s:52,c:C.gold});
      const X0=640,WW=1100,MX=55000,k=L('y3b');
      text('노란 택시 면허',X0-30,320,{a:'right',f:'D',s:42,c:CY});hbar(X0,320,WW,90,13587*E.out(P(k,.2,.6)),MX,CY,'1만 3,587장 (묶여 있음)',{s:42});
      text('한 호출 회사 차',X0-30,470,{a:'right',f:'D',s:42,c:CS});hbar(X0,470,WW*.82,90,T>FR('y3b',.55)?51000*E.out(P(T,FR('y3b',.55),.6)):0,MX,CS,T>FR('y3b',.55)?'5만 1,000대':'',{s:42});
      if(L('y4')>=0)group(960,690,1,0,P(L('y4'),0,.3),()=>{panel(-640,-80,1280,160,{bd:'rgba(255,255,255,.4)',bg:'rgba(6,13,32,1)'});text('2016년 거래 값: 32만 5,000 ~ 75만 달러',0,4,{f:'D',s:48,max:1200});});
      srcLine('CBS News 2017.4.14 (뉴욕 TLC 인용: 면허 상한 13,587 · 한 호출 회사 연계 차량 51,000대 · 2016년 거래 32만 5,000~75만 달러)');});
    sub('y5','y5b',()=>{
      taxi27(560,520,.9,{dim:true});
      group(1340,360,1,0,P(L('y5'),.1,.3),()=>{panel(-470,-110,940,220,{bd:'rgba(255,255,255,.4)',bg:'rgba(6,13,32,1)'});text('제도도 시장도 다르다',0,-34,{f:'D',s:46,max:880});text('우리도 그렇게 된다는 뜻은 아님',0,40,{s:34,w:900,c:C.dim,max:880});});
      if(L('y5b')>=0)stampBox('가장 크게 잃는 사람 = 마지막에 산 사람',960,720,L('y5b'),{s:48,c:CR,bg:'rgba(40,0,0,.92)'});
      srcLine('뉴욕 사례는 다른 나라·다른 제도 · 원인은 보도에 나온 차량 호출 서비스 등장까지만 적음');});
  }},
  /* ── 숫자를 바꾸는 손잡이 ── */
  knob:{draw(){
    const X0=620,WW=980,MX=62;
    sub('k1','k2',()=>{
      text('손잡이 ① 금리 · 한 달 이자',960,170,{f:'D',s:52,c:C.gold});
      const q=K('k2',0),t2=CT('k2')+.6;
      [['2%',19.2,'19만 2,283',CP,T>t2],['3% (지금)',28.8,'28만 8,425',CI,L('k1')>=0],['4%',38.5,'38만 4,567',CR,q>=0]].forEach(([t,v,lb,col,on],i)=>{const y=330+i*150;text(t,X0-30,y,{a:'right',f:'D',s:44,c:on?col:'rgba(255,255,255,.3)'});hbar(X0,y,WW,90,on?v:0,MX,col,on?lb:'?',{s:46,lc:on?col:C.gold});});
      srcLine('115,370,000 × 금리 ÷ 12 (python3) · 금리는 예시');});
    sub('k3','k3',()=>{
      text('손잡이 ② 파는 값 · 10년 몰 때 한 달 (이자 + 내린 값)',960,170,{f:'D',s:46,c:C.gold,max:1800});
      const q=K('k3',0);
      [['그대로',28.8,'28만 8,425'],['−10%',38.5,'38만 4,567'],['−20%',48.1,'48만 708'],['−30%',57.7,'57만 6,850']].forEach(([t,v,lb],i)=>{const y=300+i*120,on=i===0||q>=0,col=i===0?CI:CR;text(t,X0-30,y,{a:'right',f:'D',s:44,c:on?col:'rgba(255,255,255,.3)'});hbar(X0,y,WW,80,on?v*E.out(P(T,i?q+i*.3:0,.5)):0,MX,col,on?lb:'?',{s:44,lc:on?col:C.gold});});
      if(q>=0)popText(q+.3,1500,780,'10%마다 +9만 6,142원',{f:'D',s:46,c:CR});
      srcLine('하락분 ÷ 120달 + 이자 288,425 (python3) · 예시 가정');});
    sub('k4','k5',()=>{
      text('손잡이 ③ 모는 기간 · 30% 내린 몫만, 한 달',960,170,{f:'D',s:48,c:C.gold,max:1800});
      const q=K('k4',0),t15=FR('k4',.45);
      [['15년',19.2,'19만 2,283',CP,T>t15],['10년',28.8,'28만 8,425',CI,L('k4')>=0],['5년',57.7,'57만 6,850',CR,q>=0]].forEach(([t,v,lb,col,on],i)=>{const y=330+i*150;text(t,X0-30,y,{a:'right',f:'D',s:44,c:on?col:'rgba(255,255,255,.3)'});hbar(X0,y,WW,90,on?v:0,MX,col,on?lb:'?',{s:46,lc:on?col:C.gold});});
      if(L('k5')>=0)stampBox('기사님이 돌릴 손잡이 = 얼마나 오래 모느냐',960,790,L('k5'),{s:46,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('34,611,000 ÷ 180 · 120 · 60달 (python3) · 예시 가정');});
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('q1'),ov=L('q7');
    text('번호판 사기 전, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)*(ov>=0?1-P(ov,0,.3):1),max:1800});
    const cards=[['q2','평균 거래가의 흐름','내린 해도 본다','오늘: 2019년 −12.5%'],['q3','번호판 이자','값 × 금리 ÷ 12','오늘: 28만 8,425원'],['q4','팔 때 10%의 값','값 × 0.1','오늘: 1,154만 = 네 달 치'],
      ['q5','사 줄 사람의 줄','기사 나이 · 양수 요건','오늘: 60세 이상 76.2%'],['q6','내가 팔 나이','몇 년 몰고 언제 팔까','오늘: 60 → 70세']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:34,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,500,1,0,P(ov,0,.3),()=>{panel(-800,-320,1600,620,{bg:'rgba(6,13,32,1)',bd:C.gold});text('번호판 1억 원 · 금리 4% · 15년 몰고 · 20% 내린 값에 판다',0,-240,{f:'D',s:40,max:1500});text('번호판이 한 달에 쓰는 돈은?',0,-170,{f:'D',s:44,max:1500,c:C.gold});
      const b=L('q7b');
      if(b>=0)text('이자 33만 3,333 + 2,000만 ÷ 180 = 11만 1,111',0,-60,{f:'D',s:42,alpha:P(b,0,.3),max:1500});
      const k=K('q7b',0);if(k>=0)text('44만 4,444원',0,90,{f:'D',s:130,c:CI,glow:'rgba(255,159,67,.4)',alpha:P(k,0,.3)});else text('?',0,90,{f:'D',s:120,c:C.gold});
      if(L('q7c')>=0)text('번호판 = 맡겨 두는 돈이 아니라 매달 쓰는 돈',0,230,{s:38,w:900,c:'#ffd0a3',alpha:P(L('q7c'),0,.3),max:1500});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('개인택시 번호판 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      plate27(430,480,.75,{alpha:P(a,0,.3)});
      const b=L('z2'),b2=L('z2b');
      const rows=[['서울 평균 거래가 (2026.1)','1억 1,537만 원',CY,b,.2],['이자 (연 3% 예시)','한 달 28만 8,425 · 10년 3,461만',CI,b,2.5],['팔 때 30% 내리면','이자만큼 한 번 더 · 정하는 건 다음 사람',CR,b2,.3]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;group(1300,320+i*160,1,0,kk,()=>{panel(-560,-65,1120,130,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-520,4,{a:'left',f:'D',s:32,max:380});text(v,520,4,{a:'right',f:'D',s:34,c:col,max:660});});});
    }else{
      taxi27(520,520,.75);plate27(1120,470,.55,{rot:-.05});drawMascot(1620,540,.55,'happy');
      stampBox('번호판 값 = 내가 버는 돈이 아니라 다음 사람이 낼 돈',960,790,c,{s:42,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      if(L('z4')>=0&&L('z4b')<0)pill('예시 가정 · 투자·창업 권유 아님',1560,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-520,-70,1040,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 몇 살에 사서 몇 살에 파시겠어요?',0,4,{s:40,w:900,c:C.ink,max:980});});
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
function vCashH(x,y,w,h,col){if(w<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
