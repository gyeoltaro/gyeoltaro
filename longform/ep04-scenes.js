/* ════════════════════════════════════════════════════════════════════
   장면 (LF.04 저가 커피 계산서) — 수치·출처는 docs/longform-ep04.md
   중심 그림: 아메리카노 한 잔 1,800원 = 100원짜리 동전 18개. 가져가는 순서대로 동전이 물든다. 남은 3개 반 = 점주 몫.
   ════════════════════════════════════════════════════════════════════ */
const CO=[ // 동전 순서 = 가져가는 순서 (한 잔당 원)
  {k:'bean',name:'원두',ic:'☕',v:230,col:'#C08552'},
  {k:'cup',name:'컵·부자재',ic:'🥤',v:120,col:'#6FD3FF'},
  {k:'alba',name:'알바생',ic:'🧑',v:670,col:'#B18CFF'},
  {k:'rent',name:'건물주',ic:'🏠',v:250,col:'#FF6FA8'},
  {k:'misc',name:'전기·카드·잡비',ic:'⚡',v:150,col:'#FFE066'},
  {k:'owner',name:'점주',ic:'🧑‍💼',v:380,col:'#35E08A'},
];
const COK=Object.fromEntries(CO.map(s=>[s.k,s]));
const SEQ=['1','2','8','5','00','00','÷','4','3','5','00','='];   // 12,850,000 ÷ 43,500 = 295.4 (0 개수 확인: 1285만 = 12850000, 1,450원 × 30일 = 43500)
function coinT(k){return {bean:KT('s2',0),cup:KT('s3',0),alba:KT('s5',0),rent:KT('s6',0),misc:KT('s7',0),owner:KT('s9',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim});}
function srcLineR(s){srcLine(s,872,1340);}
function arrowR(x1,y,x2,col='#fff',lw=8){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=lw;ctx.lineCap='round';line(x1,y,x2-18,y);ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-30,y-18);ctx.lineTo(x2-30,y+18);ctx.closePath();ctx.fill();ctx.restore();}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}

/* 저가 커피 가게 외관 (상표 없는 일반 가게) */
function cafeFront(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#2f2a3d';rr(-420,-300,840,560,18);ctx.fill();
    ctx.fillStyle='#fff7e0';rr(-420,-300,840,90,14);ctx.fill();
    for(let i=0;i<14;i++){ctx.fillStyle=i%2?'#ff7a3d':'#ffd166';ctx.fillRect(-420+i*60,-210,60,26);}
    text('COFFEE',-120,-255,{f:'D',s:56,c:'#2f2a3d'});
    ctx.save();ctx.shadowColor='rgba(255,214,150,.7)';ctx.shadowBlur=40;ctx.fillStyle='#fff0cf';rr(-380,-160,500,360,8);ctx.fill();ctx.restore();
    emoji('☕',-130,-30,170);
    text('아메리카노 1,800원',-130,130,{s:34,w:900,c:'#5a4a1a'});
    ctx.fillStyle='#cfe8ff';rr(160,-160,220,420,8);ctx.fill();ctx.fillStyle='rgba(42,49,80,.5)';ctx.fillRect(268,-160,4,420);
    ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(320,-255,40,0,7);ctx.fill();text('1.8',320,-253,{f:'D',s:36,c:'#2f2a3d'});
  });
}
/* 100원짜리 동전 18개 (6 × 3). 가져가는 순서대로 물든다. 반환값 = 아직 안 가져간 돈(원) */
function drawCoins(x0,y0,cell){
  const N=18,cols=6,r=cell*.44;let acc=0,taken=0;const ranges=[];
  CO.forEach(s=>{const n=s.v/100,t=T-coinT(s.k),f=t>=0?E.out(P(t,0,Math.min(1.2,.25+n*.07))):0;ranges.push([acc,acc+n*f,s.col,s.k]);if(s.k!=='owner')taken+=s.v*f;acc+=n;});
  for(let i=0;i<N;i++){const cx=x0+(i%cols)*cell+cell/2,cy=y0+Math.floor(i/cols)*cell+cell/2;
    const g=ctx.createRadialGradient(cx-r*.3,cy-r*.3,r*.1,cx,cy,r);g.addColorStop(0,'#f1f3f7');g.addColorStop(1,'#9aa3b5');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();
    ranges.forEach(([a,b,col,k])=>{const s0=Math.max(a,i),s1=Math.min(b,i+1);if(s1<=s0)return;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2+(s0-i)*Math.PI*2,-Math.PI/2+(s1-i)*Math.PI*2);ctx.closePath();ctx.fill();});
    ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
    text('100',cx,cy+1,{s:r*.62,w:900,c:'rgba(20,24,40,.45)'});}
  if(T>=coinT('owner')){const k=P(T-coinT('owner'),0,.4);[14,15,16,17].forEach(i=>{const cx=x0+(i%cols)*cell+cell/2,cy=y0+Math.floor(i/cols)*cell+cell/2;ctx.save();ctx.globalAlpha*=k;ctx.strokeStyle=C.green;ctx.lineWidth=6;ctx.shadowColor=C.green;ctx.shadowBlur=20;ctx.beginPath();ctx.arc(cx,cy,r+6,0,7);ctx.stroke();ctx.restore();});}
  return 1800-taken;
}
/* 한 잔 1,800원 가로 막대 (구성 비율) */
function cupBar(x,y,w,h,k=1,o={}){let xx=x;CO.forEach((s,i)=>{const ww=w*s.v/1800,kk=E.out(P(k,i*.1,.4));ctx.fillStyle=s.col;rr(xx,y-h/2,Math.max(2,ww*kk-3),h,10);ctx.fill();if(ww>70&&kk>.5)text(String(s.v),xx+ww/2,y+2,{f:'D',s:h*.42,c:'#101420'});xx+=ww;});}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o4')){
      cafeFront(560,540,E.back(P(a,0,.4))+.001);
      group(1420,330,lerp(1.6,1,E.out(P(a,.1,.3))),-.03,P(a,0,.15),()=>{panel(-330,-120,660,240,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('아메리카노 한 잔',0,-60,{s:40,w:900,c:C.dim});text('1,800원',0,30,{f:'D',s:120,c:C.gold});});
      const b=L('o2');if(b>=0)text('× 하루 400잔 × 30일 = 월 2,160만 원',1420,520,{f:'D',s:48,alpha:P(b,.2,.3),max:760});
      const k=K('o3',0);if(L('o3')>=0){text('한 잔 팔면 점주 손에',1420,640,{s:40,w:900,alpha:P(L('o3'),0,.3)});if(k>=0)group(1420,760,lerp(1.5,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text('약 380원',0,0,{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.4)'}));}
    }else if(T<CT('o6')){
      const b=L('o4'),c=K('o5',0);
      group(520,420,lerp(1.2,1,E.out(P(b,0,.4))),0,P(b,0,.2),()=>{text('한 달 약',0,-120,{s:44,w:900,c:C.dim});text('455만 원',0,0,{f:'D',s:190,c:C.green,glow:'rgba(53,224,138,.4)'});text('점주는 가게에 안 나가고, 알바생이 다 지킨다면',0,130,{s:34,w:800,c:C.dim,max:900});});
      emoji('😊',520,780,150,{alpha:P(b,.3,.3)});
      if(L('o5')>=0){const q=L('o5');group(1400,430,1,0,P(q,0,.3),()=>{panel(-380,-250,760,500,{bd:C.red,bg:'rgba(255,77,77,.08)',lw:6});text('하루 판매가',0,-170,{s:40,w:900,c:C.dim});text('300잔 아래?',0,-60,{f:'D',s:92});if(c>=0)group(0,100,lerp(1.5,1,E.out(P(c,0,.3))),0,P(c,0,.15),()=>text('한 달 적자',0,0,{f:'D',s:120,c:C.red,glow:'rgba(255,77,77,.5)'}));});}
    }else if(T<CT('o7')){
      const b=L('o6');text('같은 한 잔에서',700,340,{f:'D',s:90,alpha:P(b,0,.3)});text('돈이 더 크게 불어나는 곳?',700,480,{f:'D',s:90,c:C.gold,alpha:P(b,.2,.3),glow:'rgba(255,197,49,.4)'});
      text('?',700,700,{f:'D',s:260,c:C.red,alpha:P(b,.5,.3)});drawMascot(1500,560,1.1,'think',{alpha:P(b,0,.3)});
    }else{
      const k9=L('o7'),k10=L('o8');
      text('계약 전 꼭 볼 숫자',960,230,{f:'D',s:80,c:C.gold,alpha:P(k9,0,.3)});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['감사보고서','공정위 자료','언론 보도','최저임금위원회'].forEach((s,i)=>{const k=P(k10,.5+i*.35,.3);if(k>0)pill(s,330+i*420,760,{s:34,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o9');
    text('저가 커피 계산서',960,300,{f:'D',s:160,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3)});
    text('1,800원 한 잔, 누가 얼마를 가져가나',960,450,{s:56,w:900,alpha:P(a,.3,.3)});
    cafeFront(700,760,.55,{alpha:P(a,.2,.3)});drawMascot(1300,720,.85,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p2',()=>{
      group(520,520,1,0,1,()=>{panel(-380,-190,760,380,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('아메리카노 한 잔',0,-100,{s:44,w:900,c:C.dim});text('1,800원',0,10,{f:'D',s:150,c:C.gold});text('10평 안팎 저가 커피 가맹점',0,125,{s:32,w:800,c:C.dim});});
      emoji('☕',1380,340,170,{alpha:P(L('p2'),0,.3)});popText(KT('p2',1),1380,540,'하루 400잔',{f:'D',s:130,c:'#fff'});});
    sub('p3','p3',()=>{text('한 달 = 1만 2천 잔',960,260,{f:'D',s:60,c:C.gold});
      const kt=T-KT('p3',0);if(kt<0)text('매출 ?',960,440,{f:'D',s:140,c:C.gold});else{const k=E.out(P(kt,0,.7));text('매출 '+won(Math.round(2160*k))+'만 원',960,440,{f:'D',s:140,c:C.gold,glow:'rgba(255,197,49,.4)'});}
      text('1년으로 치면 약 2억 6천만 원',960,600,{s:46,w:900,c:C.dim,alpha:P(L('p3'),.6,.3)});});
    sub('p4','p4',()=>{text('정보공개서 기준 보도 · 저가 커피 가맹점 연평균 매출',960,230,{s:42,w:900});
      const X0=300,X1=1620,Y=540,mx=v=>X0+(X1-X0)*(v-2)/1.8;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;line(X0,Y,X1,Y);
      [2,2.5,3,3.5].forEach(v=>{line(mx(v),Y-12,mx(v),Y+12);text(v.toFixed(1)+'억',mx(v),Y+50,{s:28,w:800,c:'rgba(255,255,255,.6)'});});
      [2.30,2.65,3.19,3.49].forEach((v,i)=>{const k=E.back(P(L('p4'),.2+i*.15,.3));if(k>0){group(mx(v),Y,k,0,1,()=>{ctx.fillStyle='#c8d0e0';ctx.beginPath();ctx.arc(0,0,24,0,7);ctx.fill();});}});
      text('저가 커피 4개 브랜드',mx(2.9),Y+120,{s:34,w:900,c:C.dim,alpha:P(L('p4'),.8,.3)});
      const g=P(L('p4'),1.4,.4);if(g>0)group(mx(2.59),Y,E.back(g),0,1,()=>{ctx.fillStyle=C.green;ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(-24,-52);ctx.lineTo(24,-52);ctx.closePath();ctx.fill();pill('오늘 가게 2.6억',0,-96,{s:34,bg:C.green,c:'#0b1020'});});
      srcLine('아시아타임즈 2025.3.12 (공정위 정보공개서 기준 · 한 브랜드 2022, 나머지 3곳 2023)');});
    sub('p5','p5',()=>{text('13시간 영업, 알바생 2명',960,230,{f:'D',s:56,c:C.gold});
      const X=260,Wd=1400,k=E.out(P(L('p5'),.2,.8));[[420,'알바 A'],[560,'알바 B']].forEach(([y,l],i)=>{ctx.fillStyle='#B18CFF';rr(X,y-50,Wd*k,100,16);ctx.fill();if(k>.5)text(l+' · 13시간',X+Wd/2,y,{f:'D',s:46,c:'#1d2433'});});
      [10,13,16,19,23].forEach(h=>text(h+'시',X+Wd*(h-10)/13,670,{s:28,w:800,c:'rgba(255,255,255,.55)'}));
      pill('2명 × 13시간 × 30일 = 780시간',960,780,{s:38,bg:'rgba(255,255,255,.92)'});});
    sub('p6','p6',()=>{[['세금 제외','🧾'],['4대 보험 제외','🛡️'],['주휴수당 제외','🧮']].forEach(([s,ic],i)=>{const k=E.back(P(L('p6'),i*.3,.35));if(k>0)group(480+i*480,480,k,0,1,()=>{panel(-200,-170,400,340,{bd:'rgba(255,197,49,.6)'});emoji(ic,0,-50,120);text(s,0,100,{f:'D',s:46});});});});
    sub('p7','p7',lt=>{const k=E.out(P(lt,0,.5));group(460,480,lerp(1.2,.9,k),0,1-P(lt,1.2,.4),()=>{ctx.fillStyle='#e7d9a8';rr(-260,-130,520,260,20);ctx.fill();text('1,800원',0,6,{f:'D',s:110,c:'#5a4a1a'});});
      if(lt>1.2){const q=P(lt,1.2,.8);ctx.save();ctx.globalAlpha*=q;for(let i=0;i<18;i++){const cx=190+(i%6)*72,cy=330+Math.floor(i/6)*72;ctx.fillStyle='#c3c9d6';ctx.beginPath();ctx.arc(cx,cy,28,0,7);ctx.fill();}ctx.restore();}
      text('= 100원짜리 동전 18개',1300,480,{f:'D',s:72,c:C.gold,alpha:P(lt,.8,.4)});});
  }},
  /* ── 1,800원 쪼개기 ── */
  coins:{draw(){
    const left=drawCoins(70,210,148);
    const hide=T>=CT('s8')&&T<KT('s9',0);
    text('남은 돈',514,720,{s:32,w:900,c:C.dim});text(hide?'?':won(Math.round(left/10)*10)+'원',514,790,{f:'D',s:80,c:hide?C.gold:left<400?C.green:'#fff'});
    const PX=1000;
    sub('s1','s3',()=>{text('☕ 첫 번째: 원두·부자재',PX,210,{a:'left',f:'D',s:56,c:'#d4a373'});
      text('한 잔을 팔 때 사 오는 재료',PX,300,{a:'left',s:38,w:900});
      hbar(PX,420,700,80,230,700,COK.bean.col,'원두 230원',{s:44,k:E.out(P(T-KT('s2',0),0,.6))});
      sub('s3','s3',()=>{hbar(PX,540,700,80,120,700,COK.cup.col,'컵·뚜껑·빨대 120원',{s:44,k:E.out(P(T-KT('s3',0),0,.6))});});
      srcLineR('원두 230원은 2샷 기준 추정 222원(소비자단체협의회)과 비슷한 값으로 둔 예시');});
    sub('s4','s5',()=>{text('🧑 두 번째: 알바생',PX,210,{a:'left',f:'D',s:56,c:'#B18CFF'});
      text('2명 × 13시간 × 30일 = 780시간',PX,320,{a:'left',f:'D',s:44});text('× 최저시급 10,320원 = 약 805만 원',PX,400,{a:'left',f:'D',s:44});
      sub('s5','s5',()=>{popText(KT('s5',0),PX+420,560,'÷ 1만 2천 잔 = 한 잔 670원',{f:'D',s:58,c:'#B18CFF',max:860});});
      srcLineR('2026년 최저임금 10,320원 (최저임금위원회) · 근무 시간은 예시');});
    sub('s6','s6',()=>{text('🏠 세 번째: 건물주',PX,210,{a:'left',f:'D',s:56,c:'#FF6FA8'});text('월세 300만 원 (예시)',PX+420,400,{f:'D',s:60});popText(KT('s6',0),PX+420,540,'한 잔 250원',{f:'D',s:92,c:'#FF6FA8'});});
    sub('s7','s7',()=>{text('⚡ 네 번째: 작은 동전',PX,210,{a:'left',f:'D',s:56,c:'#FFE066'});text('전기·가스·카드 수수료·잡비',PX+420,380,{s:42,w:900});text('한 달 180만 원 (예시)',PX+420,460,{f:'D',s:56});popText(KT('s7',0),PX+420,590,'한 잔 150원',{f:'D',s:92,c:'#FFE066'});});
    sub('s8','s9',()=>{text('🧑‍💼 마지막: 점주',PX,210,{a:'left',f:'D',s:56,c:C.green});
      const k=T-KT('s9',0);if(k>=0){group(PX+420,470,lerp(1.6,1,E.out(P(k,0,.35))),0,P(k,0,.15),()=>text('380원',0,0,{f:'D',s:210,c:C.green,glow:'rgba(53,224,138,.45)'}));stampBox('1,800원의 21%',PX+420,690,k-.5,{s:60,c:C.gold,bg:'rgba(40,30,0,.8)'});}
      else text('?',PX+420,470,{f:'D',s:300,c:C.gold,alpha:P(L('s8'),0,.3)});});
    sub('s10','s11',()=>{group(PX+420,420,1,0,1,()=>{panel(-420,-150,840,300,{bd:C.green,bg:'rgba(53,224,138,.08)',lw:6});text('380원 × 1만 2천 잔',0,-70,{f:'D',s:56});popText(KT('s10',0),0,50,'= 한 달 약 455만 원',{f:'D',s:84,c:C.green});});
      const q=L('s11');if(q>=0)group(PX+420,720,1,0,P(q,0,.3),()=>pill('하루 400잔을 팔 때만 나오는 돈',0,0,{s:38,bg:'rgba(255,255,255,.92)'}));});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('÷'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s.replace('=','')).toLocaleString('ko-KR'):'';
    let small='',big='0';if(done){small=`${fmt(n1)} ÷ ${fmt(n2)} =`;big=(12850000/43500).toFixed(1);}else if(n2!==undefined){small=`${fmt(n1)} ÷`;big=n2?fmt(n2):fmt(n1);}else if(n1)big=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(big,225,-310,{a:'right',s:done?110:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('한 달 고정비 1,285만 원',1350,280,{f:'D',s:60,c:C.gold,alpha:P(a,.2,.3)});text('÷ (한 잔 남는 돈 1,450원 × 30일)',1350,380,{s:44,w:900,alpha:P(a,.4,.3),max:900});
    if(dt>=0){group(1350,540,lerp(1.6,1,E.out(P(dt,0,.3))),0,P(dt,0,.15),()=>text('= 하루 296잔',0,0,{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.45)'}));text('이 아래로 내려가면 적자',1350,660,{s:44,w:900,c:C.dim,alpha:P(dt,.5,.3)});drawMascot(1350,830,.5,'shock');}
    if(dt>=0)group(1180,170,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 원두값 ── */
  beans:{draw(){
    sub('a1','a1',()=>{emoji('☕',700,480,300);text('원두값 230원',1300,380,{f:'D',s:90,c:'#d4a373'});text('너무 싼 것 아닐까?',1300,520,{f:'D',s:90});text('?',1300,700,{f:'D',s:200,c:C.gold});});
    sub('a2','a2',()=>{text('소비자단체협의회 추정 (2025년 9월)',960,230,{s:44,w:900,c:C.dim});
      group(560,470,1,0,1,()=>{panel(-340,-170,680,340,{bd:'#d4a373',bg:'rgba(212,163,115,.1)'});text('원두 약 10g',0,-90,{s:40,w:900,c:C.dim});popText(KT('a2',0),0,10,'111원',{f:'D',s:150,c:'#d4a373'});});
      group(1360,470,1,0,1,()=>{panel(-340,-170,680,340,{bd:'#d4a373',bg:'rgba(212,163,115,.1)'});text('2샷 (한 잔)',0,-90,{s:40,w:900,c:C.dim});popText(KT('a2',1),0,10,'222원',{f:'D',s:150,c:'#d4a373'});});
      srcLine('파이낸셜뉴스 2025.9.15 (한국소비자단체협의회 · 원두 가격 급등 시기 추정, 업계는 등급별로 다르다고 반론)');});
    sub('a3','a3',()=>{text('한 잔 값에서 원두값이 차지하는 비율',960,200,{f:'D',s:56,c:C.gold});
      const X=260,Wmax=1400;[[400,'고급 브랜드 4,700원',4700,4.7,'4.7%'],[600,'저가 커피 1,800원',1800,12.8,'12~13%']].forEach(([y,l,p,pc,lab],i)=>{const k=E.out(P(L('a3'),.2+i*.4,.6)),w=Wmax*p/4700*k;text(l,X,y-60,{a:'left',s:38,w:900});ctx.fillStyle='rgba(255,255,255,.12)';rr(X,y-40,w,80,14);ctx.fill();ctx.fillStyle='#C08552';rr(X,y-40,Math.max(4,Wmax*222/4700*k),80,14);ctx.fill();text(lab,X+w+24,y+2,{a:'left',f:'D',s:60,c:i?C.red:C.green,alpha:k});});
      text('원두값(222원)은 같은데, 한 잔 값이 다르다',960,780,{s:40,w:900,c:C.dim,alpha:P(L('a3'),1.2,.4)});
      srcLine('파이낸셜뉴스 2025.9.15 (고급 브랜드 4,700원 대비 4.7%, 저가 1,700~1,800원 대비 12.3~13.1%)');});
    sub('a4','a6',()=>{text('저가 커피 한 잔 1,800원',960,200,{f:'D',s:56,c:C.gold});cupBar(160,420,1600,130,E.out(P(L('a4'),0,.8)));
      let xx=160;CO.forEach(s=>{const w=1600*s.v/1800;if(w>130)text(s.name,xx+w/2,525,{s:28,w:900,c:'rgba(255,255,255,.8)'});xx+=w;});
      const q=K('a5',0);if(q>=0){const x0=160+1600*(230+120)/1800,w=1600*(670+250)/1800;ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=8;rr(x0-4,345,w+8,150,16);ctx.stroke();ctx.restore();
        group(x0+w/2,620,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text('알바 + 월세 920원',0,0,{f:'D',s:72,c:C.gold}));
        text('원두 230원의 4배',x0+w/2,720,{s:44,w:900,c:C.dim,alpha:P(q,.3,.3)});}
      const r=K('a6',0);if(r>=0)stampBox('절반 넘게는 사람과 자리',960,820,r,{s:56,c:C.red,bg:'rgba(40,0,0,.8)'});});
  }},
  /* ── 손익분기 ── */
  breakeven:{draw(){
    const a=L('b1');
    text('하루 몇 잔을 팔아야 할까?',960,160,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    sub('b2','b3',()=>{group(520,255,1,0,P(L('b2'),0,.3),()=>{panel(-440,-70,880,140,{bd:C.red,bg:'rgba(255,77,77,.1)'});text('한 달 고정비 1,285만 원',0,-20,{f:'D',s:50,c:'#ffb3b3'});text('알바 805 + 월세 300 + 전기·카드·잡비 180',0,38,{s:26,w:800,c:C.dim});});});
    sub('b3','b4',()=>{group(1400,255,1,0,P(L('b3'),0,.3),()=>{panel(-440,-70,880,140,{bd:C.green,bg:'rgba(53,224,138,.1)'});text('한 잔 팔 때마다 1,450원',0,-20,{f:'D',s:50,c:C.green});text('1,800원 − 원두·부자재 350원',0,38,{s:26,w:800,c:C.dim});});});
    if(T>=CT('b3')){
      const X0=240,X1=1680,Y0=620,mx=n=>X0+(X1-X0)*(n-150)/300,yv=v=>Y0-v*.42,pf=n=>4.35*n-1285,k=E.out(P(T,CT('b3'),.8));
      ctx.save();ctx.globalAlpha*=k;ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;line(X0,Y0,X1,Y0);text('0원',X0-20,Y0,{a:'right',s:28,w:800,c:C.dim});
      [200,250,300,350,400].forEach(n=>{line(mx(n),Y0-8,mx(n),Y0+8);text(n+'',mx(n),Y0+36,{s:26,w:800,c:'rgba(255,255,255,.55)'});});
      text('하루 판매 잔 수',X1,Y0+90,{a:'right',s:26,w:800,c:'rgba(255,255,255,.5)'});text('한 달 남는 돈 (만 원)',X0,372,{a:'left',s:26,w:800,c:'rgba(255,255,255,.5)'});
      const reveal=T<KT('b4',0)?200:lerp(200,430,E.out(P(T,KT('b4',0),1.2)));
      ctx.lineWidth=10;ctx.lineCap='round';ctx.lineJoin='round';
      for(let n=200;n<reveal;n+=2){const v=pf(n),v2=pf(Math.min(reveal,n+2));ctx.strokeStyle=v<0?C.red:C.green;line(mx(n),yv(v),mx(Math.min(reveal,n+2)),yv(v2));}
      ctx.restore();
      const mk=(n,lab,col,t,above,dx=0)=>{if(t<0)return;const kk=E.back(P(t,0,.4)),x=mx(n),y=yv(pf(n));ctx.save();ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,16,0,7);ctx.fill();ctx.restore();group(x+dx,y+(above?-70:70),kk,0,1,()=>pill(lab,0,0,{s:32,bg:col,c:'#0b1020'}));};
      mk(296,'296잔 = 0원',C.gold,K('b4',0)+.3,true,-150);
      mk(400,'400잔 +455만',C.green,K('b5',0),true);mk(300,'300잔 +20만',C.green,K('b5',1),true,120);
      mk(250,'250잔 −198만',C.red,K('b6',0),false,40);mk(200,'200잔 −415만',C.red,K('b6',1),false,-30);
      const b7=K('b7',0);if(b7>=0)stampBox('100잔 줄면 455만 → 20만',1230,830,b7,{s:50,c:C.red,bg:'rgba(40,0,0,.85)'});
    }
  }},
  /* ── 옆 가게 ── */
  share:{draw(){
    const a=L('n1');
    sub('n1','n3',()=>{text('하루 잔 수는 누가 정할까?',960,700,{f:'D',s:72,c:C.gold,alpha:P(L('n1'),.5,.3)});[0,1,2].forEach(i=>{const k=E.back(P(L('n1'),i*.15,.4));if(k>0)cafeFront(360+i*600,520,.5*k+.001);});
      sub('n2','n2',()=>{group(960,820,1,0,1,()=>{panel(-700,-60,1400,120,{bd:'rgba(255,255,255,.35)'});text('“상가 1층에 1,500원 커피집만 나란히 3곳”',0,-8,{s:44,w:900,c:'#fff'});text('한국경제 2021.12.5 보도 제목',0,40,{s:24,w:800,c:C.dim});});});
      sub('n3','n3',()=>{ctx.fillStyle='rgba(6,13,32,.92)';ctx.fillRect(0,130,W,520);group(960,420,1,0,P(L('n3'),0,.3),()=>{panel(-760,-140,1520,280,{bd:C.gold,bg:'rgba(255,197,49,.08)',lw:6});text('업계 관계자',-720,-90,{a:'left',s:32,w:900,c:C.dim});text('한 상권에서 여러 매장이 매출을 나눠 갖는 구조',0,-20,{f:'D',s:56,max:1440});text('“다 같이 어려워지는 모양새”',0,70,{f:'D',s:56,c:C.gold});});srcLine('아시아타임즈 2025.3.12');});});
    sub('n4','n6',()=>{text('옆에 같은 값 커피집이 생기면',960,190,{f:'D',s:60,c:C.gold});
      const base=830,rows=[[400,'하루 400잔','+455만',C.green,0],[300,'300잔 (4분의 1 감소)','+20만',C.green,L('n4')],[250,'250잔','−198만',C.red,L('n5')]];
      rows.forEach(([n,l,v,col,t],i)=>{if(i&&t<0)return;const k=E.out(P(i?t:L('n4'),i?.1:0,.6)),h=n*1.1*k,x=420+i*540;vCash(x,base-h,300,h,col);text(v,x+150,base-h-50,{f:'D',s:64,c:col,alpha:k});text(l,x+150,base+44,{s:32,w:900,c:C.dim});});
      sub('n6','n6',()=>pill('본사는 점포가 늘수록 재료를 더 팔지만, 점주는 손님을 나눠 갖는다',960,830,{s:34,bg:'rgba(255,255,255,.92)'}));});
  }},
  /* ── 평균의 함정 ── */
  avg:{draw(){
    sub('v1','v6',()=>{text('정보공개서 · 가맹점 연매출 (2022년 기준, 한 브랜드)',960,190,{f:'D',s:52,c:C.gold});if(T<KT('v2',0))text('평균 매출, 믿어도 될까?',960,500,{f:'D',s:100,alpha:P(L('v1'),0,.3)});
      const X=500,Wd=900,mx=v=>Wd*v/12,rows=[['가장 많이 판 가게',11.7,'11억 7천만 원','#1fa864','v3',0],['연평균',3.49,'3억 4,900만 원',C.gold,'v2',0],['가장 적게 판 가게',.443,'4,430만 원',C.red,'v3',1]];
      rows.forEach(([l,v,lab,col,id,j],i)=>{const y=340+i*130,t=j?KT(id,1):id==='v3'?KT('v3',0):KT('v2',0);if(T<t)return;const k=E.out(P(T-t,0,.6));text(l,X-20,y,{a:'right',s:38,w:900});ctx.fillStyle='rgba(255,255,255,.07)';rr(X,y-40,Wd,80,14);ctx.fill();ctx.fillStyle=col;rr(X,y-40,Math.max(6,mx(v)*k),80,14);ctx.fill();text(lab,X+Math.max(6,mx(v)*k)+20,y+2,{a:'left',f:'D',s:46,c:col,max:420,alpha:k});});
      const q=L('v4');if(q>=0)stampBox('26배 차이',1500,780,q,{s:92,c:C.red,bg:'rgba(40,0,0,.85)'});
      sub('v4','v4',()=>pill('2023년 다른 한 브랜드도 최고·최저 25배 넘게 차이',620,780,{s:30,bg:'rgba(255,255,255,.92)'}));
      sub('v6','v6',()=>pill('정보공개서 매출 = 비용을 빼기 전 금액',960,700,{s:40,bg:'rgba(255,255,255,.92)'}));
      srcLine('아시아타임즈 2025.3.12 (공정위 정보공개서: 한 브랜드 2022 연평균 3억 4,902만 · 최고 11억 6,964만 · 최저 4,430만 / 다른 한 브랜드 2023 최고 8억 5,226만 · 최저 3,388만)');});
  }},
  /* ── 점주가 직접 서면 ── */
  self:{draw(){
    const a=L('e1');
    sub('e1','e2',()=>{text('알바 한 명 자리에 점주가 선다면',960,200,{f:'D',s:56,c:C.gold});
      [[560,'알바 2명','🧑🧑','455만 원',C.green,0],[1360,'점주 + 알바 1명','🧑‍💼🧑','858만 원',C.gold,1]].forEach(([x,t,ic,v,col,i])=>{const k=E.back(P(L('e1'),.2+i*.3,.4));if(k<=0)return;group(x,520,k,0,1,()=>{panel(-330,-200,660,400,{bd:col,bg:'rgba(255,255,255,.05)',lw:6});emoji(ic,0,-110,100);text(t,0,10,{s:42,w:900});
        if(i===0||T>=KT('e2',0))popText(i?KT('e2',0):CT('e1')+.6,0,110,'한 달 '+v,{f:'D',s:60,c:col,max:600});});});});
    sub('e3','e3',()=>{text('점주가 서는 시간',960,230,{f:'D',s:56,c:C.gold});text('13시간 × 30일 = 390시간',960,360,{f:'D',s:76});popText(KT('e3',0),960,560,'858만 ÷ 390시간 = 시급 약 2만 2천 원',{f:'D',s:72,c:C.green,max:1500});emoji('⏰',480,760,120,{alpha:P(L('e3'),.4,.3)});});
    sub('e4','e4',()=>{text('손익분기 (하루 잔 수)',960,230,{f:'D',s:56,c:C.gold});
      [[640,'알바 2명',296,C.red],[1280,'점주 + 알바 1명',203,C.green]].forEach(([x,l,v,col],i)=>{const k=E.out(P(L('e4'),.2+i*.4,.6)),h=v*1.5*k;vCash(x-150,780-h,300,h,col);text(l,x,830,{s:36,w:900});text(v+'잔',x,780-h-50,{f:'D',s:64,c:col,alpha:k});});
      text('고정비 1,285만 → 882만 원',960,900,{s:34,w:900,c:C.dim,alpha:P(L('e4'),1,.3)});});
    sub('e5','e5',()=>{text('하루 250잔을 팔면',960,220,{f:'D',s:60,c:C.gold});text('한 달 205만 원 ÷ 390시간',960,330,{f:'D',s:60});
      text('점주 시급',420,520,{a:'right',s:38,w:900});hbar(450,490,1000,70,5300,10320,C.red,'약 5,300원',{s:48,k:E.out(P(L('e5'),.3,.6))});text('최저시급',420,650,{a:'right',s:38,w:900});hbar(450,620,1000,70,10320,10320,'#B18CFF','10,320원',{s:48,lc:'#d9c8ff'});
      stampBox('최저시급의 절반',1380,790,K('e5',0),{s:60,c:C.red,bg:'rgba(40,0,0,.85)'});});
    sub('e6','e7',()=>{const k=K('e6',0);text('점주 시급 = 최저시급이 되려면',960,250,{f:'D',s:56,c:C.gold});
      group(960,520,lerp(1.5,1,E.out(P(Math.max(0,k),0,.3))),0,P(L('e6'),.6,.3),()=>text('하루 296잔',0,0,{f:'D',s:190,c:C.red,glow:'rgba(255,77,77,.45)'}));
      text('(1,285만 ÷ 4.35만 = 알바 2명일 때와 같은 선)',960,680,{s:34,w:900,c:C.dim,alpha:P(L('e6'),1,.3)});
      sub('e7','e7',()=>pill('점주의 시간이 들어가야 숫자가 맞아떨어진다',960,810,{s:42,bg:'rgba(255,255,255,.92)'}));});
  }},
  /* ── 본사 ── */
  hq:{draw(){
    sub('h1','h2',()=>{text('🏢 본사',460,270,{f:'D',s:80,c:C.red});text('☕ 가맹점',1460,270,{f:'D',s:80,c:C.gold});
      const k=E.out(P(L('h2'),0,.6));arrowR(700,380,1220,'#ff9a9a',8);text('원두·컵·시럽 (필수 품목)',960,330,{s:34,w:900,alpha:k});arrowR(1220,520,700,C.gold,8);text('공급가를 내고 구입',960,570,{s:34,w:900,alpha:k});
      const q=K('h2',0);if(q>=0)group(960,740,lerp(1.4,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>{panel(-640,-90,1280,180,{bd:C.red,bg:'rgba(255,77,77,.1)',lw:6});text('차액가맹금 = 본사가 재료를 공급하며 남기는 유통 마진',0,0,{f:'D',s:48,max:1200});});
      srcLine('머니투데이 2026.5.2 (차액가맹금: 원·부자재를 가맹점에 공급하며 얻는 유통 마진)');});
    sub('h3','h5',()=>{text('2025년 본사 매출총이익률 (감사보고서)',960,190,{f:'D',s:56,c:C.gold});
      [['브랜드 A',36.4],['브랜드 B',30.6],['브랜드 C',27.2],['브랜드 D',27.0],['브랜드 E',20.7]].forEach(([l,v],i)=>{const y=330+i*100,k=E.out(P(L('h3'),.2+i*.12,.5));text(l,380,y,{a:'right',s:38,w:900,alpha:k});hbar(410,y,1000,64,v,40,i===0?C.red:i===4?C.green:'#8e98ad',v.toFixed(1)+'%',{s:44,k});});
      sub('h4','h4',()=>pill('가장 낮은 곳: 본사가 할인 비용을 부담한 영향이라는 해석 (한국경제)',960,860,{s:30,bg:'rgba(255,255,255,.92)'}));
      sub('h5','h5',()=>{ctx.fillStyle='rgba(6,13,32,.94)';ctx.fillRect(0,130,W,760);group(960,470,1,0,P(L('h5'),0,.3),()=>{panel(-740,-170,1480,340,{bd:C.gold,bg:'rgba(255,197,49,.08)',lw:6});text('회계 전문가',-700,-120,{a:'left',s:32,w:900,c:C.dim});text('“높으면 본사가 많이 가져갔다고 볼 여지가 있지만,',0,-30,{f:'D',s:46,max:1400});text('사업 구조에 따라 달라 심증만으로 판단해선 안 된다”',0,60,{f:'D',s:46,c:C.gold,max:1400});});});
      srcLine('한국경제 2026.4.23 · 인사이트 2026.4.29 · 머니투데이 2026.5.2 (금감원 전자공시 감사보고서)');});
    sub('h6','h7',()=>{text('단순 계산 (예시)',960,200,{f:'D',s:60,c:C.gold});text('점주가 본사에서 사는 재료 한 잔 350원 × 총이익률 27~36%',960,290,{s:38,w:900,max:1500});
      const base=730,vs=[[460,'본사 약 95원',95,C.red,'×27%'],[960,'본사 약 127원',127,C.red,'×36%'],[1460,'점주 380원',380,C.green,'']];
      vs.forEach(([x,l,v,col,sm],i)=>{const k=E.out(P(L('h6'),.4+i*.25,.6)),h=v*.9*k;vCash(x-130,base-h,260,h,col);text(l,x,base+44,{s:34,w:900});if(sm)text(sm,x,base-h-90,{s:34,w:900,c:C.dim});text(v+'원',x,base-h-45,{f:'D',s:56,c:col,alpha:k});});
      sub('h7','h7',()=>pill('점주는 가게 한 곳, 본사는 점포 수만큼 곱해진다',960,850,{s:36,bg:'rgba(255,255,255,.92)'}));});
    sub('h8','h10',()=>{text('한 저가 커피 본사 · 2021 → 2024',960,190,{f:'D',s:56,c:C.gold});
      const X=520,Wd=700,mx=v=>Wd*v/6;[['점포 수',2.09,'약 2배 (1,593 → 3,325)','#8e98ad'],['본사 매출',5.64,'5.6배 (879억 → 4,960억)',C.red],['본사 영업이익',2.55,'2.5배 (422억 → 1,076억)',C.orange],['점포 한 곳 매출',1.107,'+10.7%',C.green]].forEach(([l,v,lab,col],i)=>{const y=330+i*130,t=[CT('h8'),KT('h8',0),KT('h9',0)-.3,KT('h9',0)][i];if(T<t)return;const k=E.out(P(T-t,0,.6));text(l,X-20,y,{a:'right',s:36,w:900});ctx.fillStyle='rgba(255,255,255,.07)';rr(X,y-36,Wd,72,14);ctx.fill();ctx.fillStyle=col;rr(X,y-36,Math.max(6,mx(v)*k),72,14);ctx.fill();text(lab,X+Math.max(6,mx(v)*k)+20,y+2,{a:'left',f:'D',s:40,c:col,alpha:k,max:700});});
      sub('h10','h10',()=>pill('점포가 늘수록 본사는 곱셈으로, 점주는 상권을 나눠 갖는다',960,880-40,{s:36,bg:'rgba(255,255,255,.92)'}));
      srcLine('국회 정무위 박성훈 의원실(공정위 자료) 분석: 한국경제·케이비매일 보도 · 아시아타임즈 2025.3.12 · 본사 매출은 가맹점에 파는 재료값 포함');});
    sub('h11','h11',()=>{text('점주들의 움직임',960,200,{f:'D',s:60,c:C.gold});
      [['2026년 4월 보도: 한 저가 커피 브랜드 점주 320여 명 집단 소송 시작','한국경제 2026.4.23 · 머니투데이 2026.5.2 (323명)'],['2026년 초 대법원, 한 피자 브랜드 차액가맹금을 부당이득으로 판단','한국경제 2026.4.23 보도']].forEach(([a,b],i)=>{const k=E.back(P(L('h11'),.3+i*1.5,.4));if(k<=0)return;group(960,420+i*240,k,0,1,()=>{panel(-740,-100,1480,200,{bd:'rgba(255,255,255,.35)'});text(a,0,-26,{f:'D',s:44,max:1400});text(b,0,52,{s:26,w:800,c:C.dim});});});});
    sub('h12','h12',()=>{ctx.fillStyle='rgba(12,6,16,1)';ctx.fillRect(0,0,W,H);text('바로잡습니다',960,230,{f:'D',s:90,c:C.gold,alpha:P(L('h12'),0,.3)});
      group(960,520,1,0,P(L('h12'),.3,.3),()=>{ctx.fillStyle='#f4f1e8';rr(-780,-190,1560,380,22);ctx.fill();text('쇼츠에서 말씀드린 “한 본사의 2023년 원가율 10% 미만”',0,-100,{f:'D',s:46,c:C.ink,max:1480});text('→ 그 브랜드 매출총이익률 2024년 69% → 2025년 27%',0,-10,{f:'D',s:46,c:'#d62f2f',max:1480});text('회계 집계 기준 변경 때문 (인사이트 2026.4.29)',0,70,{s:38,w:900,c:'#3a3f4d'});text('같은 기준으로 비교할 수 없어, 오늘은 2025년 숫자만 썼습니다',0,140,{s:36,w:900,c:'#3a3f4d'});});});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('숫자를 바꿀 수 있는 손잡이',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});if(T<CT('l2'))text('점주가 바꿀 수 있는 숫자는?',960,500,{f:'D',s:100,alpha:P(a,.2,.3)});
    const rows=[['가격 100원 ↑ (1,900원)','손님 그대로 +120만',120,C.green,'l2'],['가격 100원 ↑ + 손님 5% 이탈','+27만',27,C.green,'l3'],['알바 한 명 하루 4시간 줄이면','+124만',124,C.green,'l4'],['내년 최저시급 10,700원','−30만 (455 → 425만)',-30,C.red,'l5']];
    rows.forEach(([l,lab,v,col,id],i)=>{const t=CT(id);if(T<t-.1)return;const y=330+i*150,k=E.out(P(T-t,.1,.6));text(l,520,y-26,{a:'right',s:36,w:900});ctx.fillStyle='rgba(255,255,255,.07)';rr(560,y-34,900,68,14);ctx.fill();const w=Math.abs(v)/130*900*k;ctx.fillStyle=col;rr(560,y-34,Math.max(6,w),68,14);ctx.fill();text(lab,560+Math.max(6,w)+20,y,{a:'left',f:'D',s:44,c:col,alpha:k,max:760});});
    srcLine('2027년 최저시급 10,700원 (최저임금위원회 2026.7.14 의결, 이투데이 2026.7.15) · 나머지는 예시 계산',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('y1'),ov=L('y7');
    text('저가 커피 계약 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:64,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['y2','y2','평균 말고 최고·최저','정보공개서 연매출의 두 끝','한 브랜드 26배 (11.7억 vs 4,430만)'],['y3','y3','차액가맹금','필수 품목 공급가와 본사 이익','정보공개서 공급가 상·하한 확인'],['y4','y4','내 가게 손익분기 잔 수','고정비 ÷ 한 잔 남는 돈','오늘 가게: 1,285만 ÷ 4.35만 = 296잔'],
      ['y5','y5','옆 상권의 같은 가격 가게','내 손님이 4분의 1 줄면?','하루 300잔 → 한 달 +20만'],['y6','y6b','폐점·계약 해지 조건','신규 개점·폐점 수 + 위약금','정보공개서의 연도별 표']];
    cards.forEach(([id,ex,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:40,max:440});text(f,-250,0,{a:'left',s:30,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(ex),id===ex?1.5:0,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    sub('y6b','y6b',()=>pill('정보공개서: 공정위 가맹사업거래 누리집에서 무료 열람',960,880-30,{s:28,bg:'rgba(255,255,255,.92)'}));
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-700,-220,1400,420,{bg:'rgba(6,13,32,1)',bd:C.gold});text('하루 350잔 × 30일 × 1,450원 = 1,523만 원',0,-130,{f:'D',s:56});
      const k=K('y7b',0);text(L('y7b')>=0?'− 고정비 1,285만 원 =':'− 고정비 1,285만 원 = ?',0,-30,{f:'D',s:56,c:L('y7b')>=0?C.gold:'#fff'});if(k>=0)text('한 달 약 238만 원',0,100,{f:'D',s:120,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('아메리카노 1,800원',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      cupBar(160,380,1600,150,E.out(P(L('z2'),0,2.6)));
      let xx=160;CO.forEach((s,i)=>{const w=1600*s.v/1800,kk=P(L('z2'),i*.5,.4);if(kk>0){emoji(s.ic,xx+w/2,296,44,{alpha:kk});text(s.name,xx+w/2,480,{s:w>150?28:22,w:900,c:'rgba(255,255,255,.85)',alpha:kk,max:w-8});}xx+=w;});
      const b=L('z2b');if(b>=0){emoji('⏰',520,700,150,{alpha:P(b,0,.3)});group(1180,700,1,0,P(b,.3,.3),()=>{ctx.fillStyle='#fff';rr(-460,-80,920,160,30);ctx.fill();text('380원은 하루 400잔을 팔 때의 이야기',0,-22,{s:38,w:900,c:C.ink});text('296잔 아래에서는 한 달 적자',0,38,{f:'D',s:56,c:'#d62f2f'});});}
    }else{
      drawMascot(960,430,1.05,'think');
      stampBox('하루 300잔을 채워야 하는 장사',960,760,c,{s:60,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1480,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-330,-70,660,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 동네 저가 커피집 몇 곳? 댓글로!',0,4,{s:34,w:900,c:C.ink,max:620});});
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
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
