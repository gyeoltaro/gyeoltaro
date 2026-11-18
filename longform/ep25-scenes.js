/* ════════════════════════════════════════════════════════════════════
   장면 (LF.25 동네 철물점 계산서 — 한 달 1,600만 = 가게 600 · 출장 400 · 납품 600 · 가게 몫 210 − 고정비 210 = 0원 · 사장님 몫 416만은 가게 밖) — 수치·출처는 docs/longform-ep25.md
   중심 그림: 매출 세 기둥(가게·출장·납품) → 몫 기둥(210 · 296 · 120). 가게 몫은 고정비 210에 그대로 들어간다 (예시).
   ════════════════════════════════════════════════════════════════════ */
const SEQ=['6','0','0','0','0','0','0','×','0','.','3','5','−','2','1','0','0','0','0','0','='];   // 6,000,000 × 0.35 − 2,100,000 = 0 (0 개수: 6000000 은 여섯, 2100000 은 다섯)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433',max:460});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:32,w:900,c:'#3a4256',max:280});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433'});});
});}
function arrowR(x1,y,x2,col='#fff',lw=8){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=lw;ctx.lineCap='round';line(x1,y,x2-lw*2,y);ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-lw*4,y-lw*2.6);ctx.lineTo(x2-lw*4,y+lw*2.6);ctx.closePath();ctx.fill();ctx.restore();}
function fmtExpr(s){return s.replace(/\d+(\.\d+)?/g,m=>m.includes('.')?m:Number(m).toLocaleString('ko-KR'));}

const CS='#6FD3FF', CT2='#FF9F43', CN='#B18CFF', CP='#35E08A', CG='#9aa3b8';   // 가게 · 출장 · 납품 · 몫 · 회색
/* 동네 철물점 앞 (상표 없음). o.note 문 쪽지 0~1, o.tags ['창고','간판'] 0~1, o.dim */
function hwShop(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,214,320,20,0,0,7);ctx.fill();
  ctx.fillStyle='#3d4a5c';rr(-280,-210,560,420,10);ctx.fill();
  ctx.fillStyle=o.dim?'#4b5566':'#1f6fb2';rr(-280,-210,560,96,8);ctx.fill();
  text(o.name||'○○ 철물',0,-160,{f:'D',s:58,c:o.dim?'#a9b2c0':'#fff',max:500});
  /* 진열창: 공구가 걸린 판 */
  ctx.save();if(!o.dim){ctx.shadowColor='rgba(255,236,170,.45)';ctx.shadowBlur=22;}ctx.fillStyle=o.dim?'#2b3240':'#f3ead2';rr(-250,-90,300,270,6);ctx.fill();ctx.restore();
  ctx.fillStyle='rgba(0,0,0,.12)';for(let r=0;r<4;r++)for(let c=0;c<6;c++){ctx.beginPath();ctx.arc(-225+c*50,-70+r*60,3,0,7);ctx.fill();}
  /* 망치 · 렌치 · 드라이버 (그림) */
  ctx.save();ctx.translate(-190,0);ctx.rotate(-.3);ctx.fillStyle='#8a5a2b';ctx.fillRect(-6,-10,12,90);ctx.fillStyle='#6b7280';ctx.fillRect(-28,-26,56,22);ctx.restore();
  ctx.save();ctx.translate(-100,10);ctx.rotate(.25);ctx.fillStyle='#9ca3af';ctx.fillRect(-7,-60,14,110);ctx.beginPath();ctx.arc(0,-66,20,0,7);ctx.fill();ctx.fillStyle=o.dim?'#2b3240':'#f3ead2';ctx.fillRect(-7,-90,14,26);ctx.restore();
  ctx.save();ctx.translate(-10,0);ctx.rotate(-.15);ctx.fillStyle='#e74c3c';ctx.fillRect(-10,-50,20,56);ctx.fillStyle='#cbd5e1';ctx.fillRect(-3,6,6,70);ctx.restore();
  ctx.fillStyle='#d4a017';ctx.beginPath();ctx.arc(-160,130,26,0,7);ctx.fill();ctx.fillStyle='#f3ead2';ctx.beginPath();ctx.arc(-160,130,10,0,7);ctx.fill();
  ctx.fillStyle='#2f9e5b';rr(-90,104,110,50,8);ctx.fill();
  /* 문 */
  ctx.fillStyle=o.dim?'#262c38':'#cfe3f0';rr(80,-90,170,300,6);ctx.fill();ctx.fillStyle='#64748b';ctx.beginPath();ctx.arc(230,60,8,0,7);ctx.fill();
  if(o.note>0)group(165,10,lerp(1.5,1,E.out(Math.min(1,o.note))),.06,Math.min(1,o.note*3),()=>{ctx.fillStyle='#fff8c4';rr(-74,-62,148,124,6);ctx.fill();text('출장 중',0,-26,{f:'D',s:30,c:'#c0392b'});text('☎ 전화 주세요',0,14,{s:20,w:900,c:'#1d2433',max:136});text('010-○○○○',0,42,{s:18,w:800,c:'#3a4256'});});
  /* 바깥 자재 */
  ctx.fillStyle='#b98b5a';for(let i=0;i<5;i++)ctx.fillRect(-300+i*10,60-i*4,8,150+i*4);
  if(o.tags>0){[['창고',-120,-250],['간판',140,-250]].forEach(([t,tx,ty],i)=>group(tx,ty,1,0,P(o.tags,i*.4,.3),()=>{ctx.fillStyle='rgba(6,13,32,.92)';rr(-110,-38,220,76,38);ctx.fill();text(t,0,3,{f:'D',s:44,c:C.gold});}));}
  if(o.tag)group(0,250,1,0,1,()=>{ctx.fillStyle='rgba(6,13,32,.9)';rr(-170,-34,340,68,34);ctx.fill();text(o.tag,0,3,{f:'D',s:34,c:C.gold,max:320});});
});}
/* 공구 가방 (그림) */
function toolBag(x,y,s,rot=0,al=1){group(x,y,s,rot,al,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,92,150,14,0,0,7);ctx.fill();
  ctx.strokeStyle='#3a3a3a';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(-60,-60);ctx.quadraticCurveTo(0,-130,60,-60);ctx.stroke();
  ctx.fillStyle='#9ca3af';ctx.save();ctx.translate(-50,-70);ctx.rotate(-.4);ctx.fillRect(-6,-50,12,70);ctx.beginPath();ctx.arc(0,-56,16,0,7);ctx.fill();ctx.restore();
  ctx.fillStyle='#e74c3c';ctx.save();ctx.translate(40,-66);ctx.rotate(.35);ctx.fillRect(-8,-40,16,40);ctx.fillStyle='#cbd5e1';ctx.fillRect(-3,0,6,10);ctx.restore();
  ctx.fillStyle='#d97706';rr(-140,-60,280,150,18);ctx.fill();ctx.fillStyle='#b45309';rr(-140,-60,280,34,14);ctx.fill();
  ctx.fillStyle='#fde68a';rr(-30,-6,60,30,6);ctx.fill();
});}
/* 세 덩어리 정보 */
const PARTS=[['가게 판매',CS,600,210,'s2'],['출장 수리',CT2,400,296,'s3'],['납품',CN,600,120,'s4']];
function colBar(cx,baseY,w,v,max,hpx,col,al=1){if(v<=0)return;const h=hpx*v/max;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=col;rr(cx-w/2,baseY-h,w,h,12);ctx.fill();ctx.restore();}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o3')){
      const a=L('o1');
      hwShop(470,480,.95*E.back(P(a,0,.5))+.001,{});
      text('예시 가게 · 그림은 실제 가게가 아님',470,790,{s:28,w:800,c:C.dim,alpha:P(a,.3,.3)});
      text('하루 가게 손님',1380,210,{f:'D',s:44,c:C.dim,alpha:P(a,.2,.3)});big('o1',0,1380,300,'24명',{f:'D',s:96,c:'#fff'});
      if(KT('o1',0)<T)text('가게에서 판 물건으로 남는 돈',1380,420,{f:'D',s:44,c:C.dim,alpha:P(T,KT('o1',0),.3)});
      if(KT('o1',0)<T)big('o1',1,1380,520,'0원',{f:'D',s:120,c:C.red,glow:'rgba(255,77,77,.45)'});
      if(L('o2')>=0){const q=K('o2',0);toolBag(1160,700,.55*E.back(P(L('o2'),0,.4))+.001);text('사장님 몫',1420,660,{f:'D',s:40,c:C.dim});text(q>=0?'416만 원':'?',1420,740,{f:'D',s:72,c:q>=0?CP:C.gold});}
      srcLine('예시 가정 · 동네 철물점 한 곳의 한 달 계산 · 사장님 혼자 운영');
    }else if(T<CT('o4')){
      const b=L('o3'),q=K('o3',0);
      text('평균 사업 존속 기간 (국세청, 2022년 말)',960,190,{f:'D',s:50,c:C.gold,max:1700});
      text('철물점',560,360,{a:'right',f:'D',s:46});hbar(600,360,1000,96,q>=0?190*E.out(P(q,0,.6)):0,200,C.gold,q>=0?'15년 10개월':'?',{s:50});
      text('100대 생활업종 평균',560,520,{a:'right',f:'D',s:40,max:500});hbar(600,520,1000,96,105*E.out(P(b,.2,.6)),200,CG,'8년 9개월',{s:50});
      if(L('o3b')>=0)group(960,720,1,0,P(L('o3b'),0,.3),()=>{panel(-520,-70,1040,140,{bd:C.gold,bg:'rgba(255,197,49,.08)'});text('손님 없어 보이는데 어떻게?',0,4,{f:'D',s:56,c:'#fff',max:980});});
      srcLine('국세청 보도참고자료 2023.5.9 \'100대 생활업종\' (2018~2022년 사업자 데이터)');
    }else{
      const k9=L('o4'),k10=L('o5');
      text('가게 차리기 전에 꼭 볼 숫자',960,230,{f:'D',s:60,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['철물점 수 · 존속 기간 · 나이 · 국세청','평균 매출 · 마진 · 국세청 인용 보도','가게 숫자 · 예시 가정'].forEach((s,i)=>{const k=P(k10,.4+i*.6,.3);if(k>0)pill(s,360+i*600,760,{s:30,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o6');
    text('동네 철물점 계산서',960,220,{f:'D',s:110,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('가게 손님 몫 = 0원 · 사장님 몫 416만 원은 어디서?',960,350,{s:48,w:900,alpha:P(a,.3,.3),max:1780});
    hwShop(560,660,.62,{alpha:P(a,.2,.3)});toolBag(1060,700,.8,-.05,P(a,.3,.3));drawMascot(1560,690,.72,'think',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 철물점 ── */
  setup:{draw(){
    sub('p1','p3b',()=>{
      hwShop(480,470,1);
      if(L('p2')>=0){const q=K('p2',0);
        text('사장님 혼자 · 08:00~19:00',1340,220,{f:'D',s:44,c:C.dim});
        text('한 달 매출',1340,350,{f:'D',s:44,c:C.dim});text(q>=0?'1,600만 원':'?',1340,460,{f:'D',s:110,c:q>=0?'#fff':C.gold});}
      if(L('p3')>=0){pill('철물점 평균 매출 1억 9,313만 원 (2022)',1340,590,{s:32,bg:'rgba(255,255,255,.94)',alpha:P(L('p3'),.2,.3)});
        text('÷ 12 = 1,609만 원',1340,680,{f:'D',s:52,c:C.gold,alpha:P(T,FR('p3',.6),.3)});}
      if(L('p3b')>=0)group(1340,790,1,0,P(L('p3b'),.2,.3),()=>{ctx.fillStyle='rgba(6,13,32,1)';rr(-460,-50,920,100,20);ctx.fill();text('대부분 1인 운영 · 물건 마진 30~40% (보도)',0,4,{f:'D',s:38,c:CS,max:880});});
      srcLine('예시 가정 · 평균 매출: 국세청 자료 인용 보도 (한국경제·캐어유뉴스 2024.10)');});
    sub('p4','p5',()=>{
      receipt(560,470,1,[['월세','130만'],['작은 트럭·기름','40만'],['전기·통신·기타','40만'],['= 고정비',K('p4',0)>=0?'210만':'?','#d62f2f']],{title:'손님이 없어도 나가는 돈'});
      if(L('p5')>=0){const icons=[['🏪','가게 판매',CS],['🔧','출장 수리',CT2],['🚚','납품',CN]];
        icons.forEach(([e,t,col],i)=>{const k=E.back(P(L('p5'),.2+i*.25,.35));if(k<=0)return;group(1380,250+i*200,k,0,1,()=>{panel(-330,-80,660,160,{bd:col});if(i===0){hwShop(-220,10,.22);}else emoji(e,-220,4,90);text(t,-100,4,{a:'left',f:'D',s:56,c:col});});});}
      srcLine('예시 가정 · 보증금·세금·사장님 인건비 제외');});
  }},
  /* ── 1,600만 원을 세 덩어리로 ── */
  cut:{draw(){
    const BASE=730,HP=400,MAX=600,BW=260,XS=[440,960,1480];
    const t6=KT('s6',0),t6b=KT('s6',1),t7=KT('s7',0);
    const share=T>=t6;
    text(share?'사장님 몫 (고정비 빼기 전)':'한 달 매출 1,600만 원',960,170,{f:'D',s:56,c:share?CP:C.gold});
    ctx.save();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;line(200,BASE,1720,BASE);ctx.restore();
    PARTS.forEach(([name,col,rev,keep,id],i)=>{
      const q=K(id,0);if(q<0&&L(id)<0)return;const cx=XS[i];
      const g=q>=0?E.out(P(q,0,.6)):0;
      const shown=(i===0&&T>=t6)||(i===2&&T>=t6b)||(i===1&&T>=t7);
      colBar(cx,BASE,BW,rev*g,MAX,HP,col,shown?.28:1);
      if(shown){const tk=i===0?t6:i===2?t6b:t7,kk=E.out(P(T,tk,.6));
        if(i===1){colBar(cx,BASE,BW,56*kk,MAX,HP,'#9be7c0');const h56=HP*56/MAX;ctx.save();ctx.translate(0,-h56);colBar(cx,BASE,BW,240*kk,MAX,HP,CP);ctx.restore();
          if(kk>.9){text('공임 240',cx,BASE-h56-HP*120/MAX,{f:'D',s:30,c:'#0d1a12'});text('부품 56',cx,BASE-h56/2,{f:'D',s:24,c:'#0d1a12'});}}
        else colBar(cx,BASE,BW,keep*kk,MAX,HP,CP);
        popText(tk,cx,BASE-HP*Math.max(keep,i===1?296:keep)/MAX-40,keep+'만',{f:'D',s:56,c:CP});}
      else if(q>=0)text(rev+'만',cx,BASE-HP*rev*g/MAX-36,{f:'D',s:52,c:col});
      text(name,cx,BASE+40,{f:'D',s:42,c:col});
      if(i===1&&L('s3')>=0)text('80건 × (부품 2만 + 공임 3만)',cx,BASE+84,{s:24,w:800,c:C.dim,max:440});
      if(i===0&&L('s2')>=0)text('하루 24명 × 1만 원 × 25일',cx,BASE+84,{s:24,w:800,c:C.dim,max:440});
      if(i===2&&L('s4')>=0)text('인테리어 업체·관리사무소',cx,BASE+84,{s:24,w:800,c:C.dim,max:440});
    });
    if(K('s2',0)<0)group(960,470,1,0,P(L('s1'),.2,.3),()=>{text('1,600만 원',0,-20,{f:'D',s:130,c:'#fff'});text('= 가게 + 출장 + 납품',0,110,{f:'D',s:56,c:C.gold});});
    if(L('s5')>=0&&!share){const k=P(L('s5'),.1,.3);group(960,250,1,0,k,()=>{text('매출의 25% · 가장 작다',0,0,{f:'D',s:40,c:CT2});});
      if(T>FR('s5',.55))group(1700,330,1,0,1,()=>text('몫은?',0,0,{f:'D',s:56,c:C.gold}));}
    if(share&&L('c1')<0&&T>t7+1)pill('210 + 296 + 120 = 626만 (고정비 빼기 전)',960,850,{s:30,bg:'rgba(255,255,255,.94)'});
    srcLine('예시 가정 · 가게 마진 35% (보도된 철물 마진 30~40% 가운데) · 납품 마진 20% · 출장 부품 마진 35%',872);
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),done=typed.endsWith('=');
    let small='',bigS='0';
    if(done){small='6,000,000 × 0.35 − 2,100,000 =';bigS='0';}
    else if(typed){const parts=typed.split(/[×÷−]/);bigS=fmtExpr(parts[parts.length-1]||'0');if(parts.length>1)small=fmtExpr(typed.slice(0,typed.length-(parts[parts.length-1]||'').length));}
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(480,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(480,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:26,w:700,c:'#4a5a44',max:470});text(bigS,225,-310,{a:'right',s:96,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('가게 판매 600만 × 35% − 고정비 210만',1300,180,{f:'D',s:44,c:C.gold,alpha:P(a,.2,.3),max:1000});
    const q2=K('c2',0);
    if(L('c3')<0){
      text('가게 판매 몫',920,330,{a:'left',f:'D',s:40});hbar(920,400,820,70,210,450,CS,'210만',{s:46});
      text('고정비',920,500,{a:'left',f:'D',s:40});hbar(920,570,820,70,210,450,C.red,'210만',{s:46});
      if(q2>=0)stampBox('= 0원',1330,720,q2,{s:80,c:C.red,bg:'rgba(40,0,0,.92)'});
      if(dt>=0&&q2<0)group(1300,720,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
    }else{
      const c3=L('c3');
      text('사장님 몫 416만 원은 어디서?',1300,300,{f:'D',s:44,c:'#fff',max:900});
      const XL=920,WW=820,tot=416;const k=E.out(P(c3,.4,.8));
      ctx.fillStyle=CT2;rr(XL,380,WW*296/tot*k,110,14);ctx.fill();ctx.fillStyle=CN;rr(XL+WW*296/tot*k,380,WW*120/tot*k,110,14);ctx.fill();
      if(k>.9){text('출장 296만',XL+WW*296/tot/2,436,{f:'D',s:44,c:'#1d2433'});text('납품 120',XL+WW*296/tot+WW*120/tot/2,436,{f:'D',s:36,c:'#1d2433',max:220});}
      text('가게 판매 0원',XL,560,{a:'left',f:'D',s:40,c:CS,alpha:P(c3,1,.3)});
      const q4=K('c4',0);if(q4>=0)stampBox('매출 25% → 몫 47%',1330,730,q4,{s:60,c:C.gold,bg:'rgba(40,30,0,.92)'});
    }
  }},
  /* ── 가게를 비우는 한 시간 ── */
  hour:{draw(){
    sub('h1','h2',()=>{
      const n=L('h2')>=0?P(L('h2'),.2,.4):0;
      hwShop(560,460,1,{note:n,dim:L('h2')>=0});
      if(L('h1')>=0){const k=P(L('h1'),.6,.6);toolBag(1150+500*k,560,.7,0,1-P(L('h1'),2.2,.4));emoji('🚚',1250+520*k,460,150,{alpha:1-P(L('h1'),2.2,.4)});}
      if(L('h2')>=0)text('그동안 온 손님은 돌아갈 수도',1360,640,{f:'D',s:44,c:C.dim,alpha:P(L('h2'),.8,.3),max:900});
      srcLine('예시 · 그림은 실제 가게가 아님');});
    sub('h3','h5b',()=>{
      text('가게에 있는 1시간 vs 출장 1건',960,170,{f:'D',s:54,c:C.gold});
      group(520,430,1,0,1,()=>{panel(-380,-190,760,380,{bd:CS});text('가게에 있는 1시간',0,-120,{f:'D',s:40,c:C.dim});text('210만 ÷ 275시간',0,-50,{s:32,w:900,c:'#c9ced9'});const q=K('h3',0);if(q>=0)popText(KT('h3',0),0,60,'7,636원',{f:'D',s:96,c:CS});else text('?',0,60,{f:'D',s:96,c:C.gold});text('25일 × 11시간',0,150,{s:26,w:800,c:C.dim});});
      if(L('h4')>=0)group(1400,430,1,0,P(L('h4'),0,.3),()=>{panel(-380,-190,760,380,{bd:CT2});text('출장 1건 (1시간 반)',0,-120,{f:'D',s:40,c:C.dim});text('부품 마진 7,000 + 공임 30,000',0,-50,{s:30,w:900,c:'#c9ced9',max:700});const q=K('h4',0);if(q>=0)popText(KT('h4',0),0,60,'3만 7,000원',{f:'D',s:90,c:CT2});else text('?',0,60,{f:'D',s:90,c:C.gold});});
      if(L('h5')>=0){const q=K('h5',0);group(960,695,1,0,P(L('h5'),0,.3),()=>{text('비운 1시간 반에 놓칠 수 있는 돈 최대 1만 1,455원',0,-40,{s:32,w:900,c:'#ffb3b3',max:1500});});
        if(q>=0)stampBox('나가면 +2만 5,545원',960,735,q,{s:46,c:CP,bg:'rgba(0,30,15,.92)'});}
      if(L('h5b')>=0)pill('☎ 기다리는 손님 · 출장 길에 받아 가는 손님 → 실제로 놓치는 돈은 더 적다',960,820,{s:30,bg:'rgba(255,255,255,.94)',alpha:P(L('h5b'),.2,.3)});
      srcLine('7,636 × 1.5 = 11,455 · 37,000 − 11,455 = 25,545 (python3) · 출장 시간·단가는 예시');});
    sub('h6','h7',()=>{
      const t7=L('h7');
      hwShop(560,470,1,{note:1,tags:t7>=0?P(t7,.2,.8)+.01:0});
      if(L('h6')>=0)stampBox('출장 중 = 돈 버는 시간',1380,360,L('h6'),{s:56,c:C.gold,bg:'rgba(40,30,0,.92)'});
      if(t7>=0)group(1380,620,1,0,P(t7,.6,.3),()=>{panel(-420,-110,840,220,{bd:'rgba(255,255,255,.4)'});text('파는 곳보다',0,-40,{f:'D',s:44,c:C.dim});text('부품 창고 + 전화번호 간판',0,36,{f:'D',s:52,c:'#fff',max:780});});
      srcLine('예시 가정');});
  }},
  /* ── 실제 숫자로 보면 ── */
  real:{draw(){
    sub('r1','r3b',()=>{
      text('평균 사업 존속 기간 (국세청, 2022년 말)',960,170,{f:'D',s:50,c:C.gold,max:1700});
      const q=K('r2',0),X0=600;
      text('철물점',X0-30,330,{a:'right',f:'D',s:46});hbar(X0,330,980,90,q>=0?190*E.out(P(q,0,.6)):0,200,C.gold,q>=0?'15년 10개월':'?',{s:48});
      const r3=L('r3');
      text('100대 업종 평균',X0-30,490,{a:'right',f:'D',s:40,alpha:r3>=0?1:.25});hbar(X0,490,980,90,r3>=0?105*E.out(P(r3,0,.6)):0,200,CG,r3>=0?'8년 9개월':'',{s:48});
      if(L('r3b')>=0){const q4=K('r3b',0);group(960,540,1,0,P(L('r3b'),0,.3),()=>{panel(-880,-300,1760,600,{bg:'rgba(6,13,32,1)',bd:C.gold});text('100대 생활업종 존속 기간 순위',0,-235,{f:'D',s:46,c:C.gold});
        [['1','담배가게','17년 11개월'],['2','이발소','16년'],['3','시계·귀금속점','15년 11개월'],['4','철물점','15년 10개월']].forEach(([r,n,v],i)=>{const k=P(L('r3b'),.3+i*.5,.3);if(k<=0)return;const hi=i===3;const y=-130+i*110;
          if(hi&&q4<0)return;group(0,y,1,0,k,()=>{if(hi){ctx.fillStyle='rgba(255,197,49,.18)';rr(-700,-46,1400,92,18);ctx.fill();}text(r,-620,4,{f:'D',s:52,c:hi?C.gold:'#c9ced9'});text(n,-520,4,{a:'left',f:'D',s:50,c:hi?C.gold:'#fff'});text(v,640,4,{a:'right',f:'D',s:50,c:hi?C.gold:'#c9ced9'});});});});}
      if(L('r3b')<0)text('커피음료점',X0-30,650,{a:'right',f:'D',s:40,alpha:r3>=0?1:.25});if(L('r3b')<0)hbar(X0,650,980,90,r3>=0&&T>FR('r3',.55)?37*E.out(P(T,FR('r3',.55),.6)):0,200,'#c0864a',T>FR('r3',.55)?'3년 1개월':'',{s:48});
      srcLine('국세청 보도참고자료 2023.5.9 \'국세데이터 분석을 통해 생활밀접 업종의 동향을 읽다\' 붙임 5');});
    sub('r4','r4',lt=>{
      text('전국 철물점 사업자 수',960,170,{f:'D',s:54,c:C.gold});
      const q=K('r4',0),X0=520;
      text('2018년 말',X0-30,360,{a:'right',f:'D',s:44});hbar(X0,360,1000,96,8899*E.out(P(lt,.2,.6)),9500,CG,'8,899곳',{s:50});
      text('2022년 말',X0-30,520,{a:'right',f:'D',s:44});hbar(X0,520,1000,96,q>=0?9034*E.out(P(q,0,.6)):0,9500,C.gold,q>=0?'9,034곳':'?',{s:50});
      if(q>=0)stampBox('+1.5%',1580,360,T-KT('r4',0)-.4,{s:50,c:C.gold,bg:'rgba(40,30,0,.92)'});
      if(T>FR('r4',.7))pill('2024년 7월 9,107곳 (보도 · 1년 전보다 64곳 많음)',960,720,{s:34,bg:'rgba(255,255,255,.94)'});
      srcLine('국세청 2023.5.9 붙임 2 · 2024.7 수치는 국세청 발표 인용 보도(캐어유뉴스 2024.10.22) · 0부터 그린 막대라 차이가 작게 보인다');});
    sub('r5','r6',()=>{
      text('철물점 사업자 9,034명의 나이 (2022년 말)',960,170,{f:'D',s:50,c:C.gold,max:1700});
      const ages=[['30세 미만',133,'#4b5566'],['30대',469,'#64748b'],['40대',1267,'#8794a8'],['50대',2451,'#b8c0cc'],['60세 이상',4714,C.red]];
      const X0=160,WW=1600,Y=330;let acc=0;const k=E.out(P(L('r5'),.2,1));
      ages.forEach(([t,v,col],i)=>{const x=X0+WW*acc/9034*k,w=WW*v/9034*k;acc+=v;ctx.fillStyle=col;rr(x+1,Y,Math.max(0,w-2),120,8);ctx.fill();
        if(k>.95&&v>1000)text(t,x+w/2,Y+60,{f:'D',s:v>4000?44:32,c:i===4?'#fff':'#1d2433',max:w-10});});
      if(k>.95)text('30대 이하 602명',X0,Y+160,{a:'left',s:28,w:800,c:C.dim});
      const q=K('r5',0);if(q>=0)popText(KT('r5',0),X0+WW*(1-4714/9034/2),Y+220,'52.2%',{f:'D',s:110,c:C.red,glow:'rgba(255,77,77,.4)'});
      if(L('r6')>=0)group(560,690,1,0,P(L('r6'),0,.3),()=>{panel(-400,-80,800,160,{bd:CS});text('남성 사업자 72.4%',0,4,{f:'D',s:56,c:CS});});
      srcLine('국세청 2023.5.9 붙임 3·4 (성별·연령별 사업자 수) · 4,714 ÷ 9,034 = 52.2% (python3)');});
    sub('r7','r7',lt=>{
      text('공식 통계가 없는 것',960,170,{f:'D',s:56,c:C.gold});
      group(960,450,1,0,1,()=>{panel(-700,-200,1400,400,{bd:'#ff9a9a',bg:'rgba(6,13,32,1)'});
        text('출장 수리·납품이 매출에서 얼마인지',0,-110,{f:'D',s:50,c:'#fff',max:1300});
        text('→ 찾지 못했다 (보도: \'출장 수리 수입 비중이 커졌다\')',0,-20,{s:36,w:900,c:'#ffb3b3',max:1300});
        text('오늘 600 · 400 · 600 = 예시 가정',0,90,{f:'D',s:56,c:C.gold,alpha:P(lt,1.5,.3),max:1300});});
      srcLine('캐어유뉴스 2024.10.22 (국세청 \'100대 생활업종\' 인용 · 인테리어·출장 수리 병행)');});
  }},
  /* ── 인터넷이 가져가면 ── */
  online:{draw(){
    sub('n1','n2',()=>{
      emoji('📦',520,420,240);text('다음 날 도착',520,640,{f:'D',s:54,c:C.gold});
      if(T>FR('n1',.55))pill('보도: 해외 쇼핑몰도 주방 철물·조명을 싸게',520,760,{s:30,bg:'rgba(255,255,255,.94)'});
      if(L('n2')>=0)PARTS.forEach(([t,col],i)=>{const k=E.back(P(L('n2'),.3+i*.2,.35));if(k<=0)return;group(1380,260+i*190,k,0,1,()=>{panel(-330,-70,660,140,{bd:col});text(t+' −30%?',0,4,{f:'D',s:52,c:col});});});
      srcLine('캐어유뉴스 2024.10.22 · 감소율 30%는 예시');});
    sub('n3','n6',()=>{
      text('손님 30%가 떠나면 · 사장님 몫 416만 원에서',960,165,{f:'D',s:48,c:C.gold,max:1760});
      const X0=640,WW=900,MX=440;
      text('지금',X0-30,280,{a:'right',f:'D',s:40});hbar(X0,280,WW,70,416,MX,CG,'416만',{s:44});
      const rows=[['n3','가게 판매 −30%',353,'−63만',CS],['n4','부품 지참 30%',399.2,'−16만 8,000',CT2],['n5','출장 −30%',327.2,'−88만 8,000',C.red],['n5b','납품 −30%',380,'−36만',CN]];
      rows.forEach(([id,t,v,d,col],i)=>{const y=385+i*100;if(L(id)<0)return;const q=K(id,0);text(t,X0-30,y,{a:'right',f:'D',s:38,c:col,max:560});hbar(X0,y,WW,64,id==='n5b'?416-36*E.out(P(L(id),.3,.6)):q>=0?416-(416-v)*E.out(P(q,0,.6)):416,MX,col,id==='n5b'?d:q>=0?d:'?',{s:40,lc:id==='n5b'?col:q>=0?(i===2?C.red:col):C.gold});});
      if(L('n6')>=0)stampBox('쉽게 빼앗기는 조각 = 가장 작은 조각',960,780,L('n6'),{s:44,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('210 × 0.3 = 63 · 56 × 0.3 = 16.8 · 296 × 0.3 = 88.8 · 120 × 0.3 = 36 (만 원, python3) · 감소율은 예시');});
  }},
  /* ── 진짜 위험은 사장님 몸 (어두운 장) ── */
  body:{draw(){
    sub('b1','b2',()=>{
      toolBag(520,470,1.3);
      text('한 달 출장 80건 × 1시간 반',1380,260,{f:'D',s:44,c:C.dim});
      text('120시간',1380,380,{f:'D',s:110,c:CT2});
      if(L('b2')>=0)group(1380,620,1,0,P(L('b2'),.5,.3),()=>{panel(-420,-90,840,180,{bd:C.red});text('철물점 사장님 52.2%',0,-26,{f:'D',s:48,c:'#fff'});text('60세 이상 (국세청, 2022년 말)',0,40,{s:30,w:900,c:'#ffb3b3'});});
      srcLine('출장 시간은 예시 가정');});
    sub('b3','b4b',()=>{
      text('출장을 줄이면 · 사장님 몫',960,170,{f:'D',s:54,c:C.gold});
      const X0=640,WW=1000;
      text('지금',X0-30,330,{a:'right',f:'D',s:44});hbar(X0,330,WW,90,416,450,CG,'416만',{s:48});
      const q=K('b3',0);text('출장 절반',X0-30,490,{a:'right',f:'D',s:44});hbar(X0,490,WW,90,q>=0?416-148*E.out(P(q,0,.6)):416,450,C.red,q>=0?'268만':'?',{s:48,lc:q>=0?C.red:C.gold});
      if(L('b4b')>=0){const q=K('b4b',0);group(960,790,1,0,P(L('b4b'),0,.3),()=>{panel(-640,-60,1280,120,{bg:'rgba(6,13,32,1)',bd:C.red});text('하루 쉬면: 3.2건 × 3만 7,000원 =',-60,4,{f:'D',s:40,c:'#fff',max:820});text(q>=0?'11만 8,400원':'?',600,4,{a:'right',f:'D',s:46,c:q>=0?C.red:C.gold});});}
      if(L('b4')>=0){text('출장 0건',X0-30,650,{a:'right',f:'D',s:44});hbar(X0,650,WW,90,120*E.out(P(L('b4'),.2,.6)),450,C.red,'120만 (납품만)',{s:48});}
      srcLine('416 − 296 ÷ 2 = 268 · 416 − 296 = 120 · 80 ÷ 25 = 3.2건 (python3) · 예시 가정');});
    sub('b5','b6',()=>{
      text('가게를 넘길 때',960,170,{f:'D',s:56,c:C.gold});
      group(520,470,1,0,1,()=>{panel(-380,-220,760,440,{bd:CP});text('넘어가는 것',0,-150,{f:'D',s:48,c:CP});hwShop(0,30,.4);text('진열대 · 재고',0,170,{f:'D',s:40,c:'#fff'});});
      group(1400,470,1,0,P(L('b5'),1.5,.3),()=>{panel(-380,-220,760,440,{bd:C.red});text('안 넘어가는 것',0,-150,{f:'D',s:48,c:C.red});emoji('📞',-110,10,120);toolBag(110,40,.5);text('단골 전화번호 · 손기술',0,170,{f:'D',s:40,c:'#fff',max:700});});
      if(L('b6')>=0)stampBox('버티는 힘 = 사장님 손',960,775,L('b6'),{s:54,c:C.gold,bg:'rgba(40,30,0,.92)'});
      srcLine('예시 · 권리금·가게 값은 계산하지 않았다');});
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('가게 차리기 전, 숫자 5가지',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3),max:1800});
    const cards=[['k2','매장 손님 × 객단가 × 마진','고정비를 넘나','오늘: 딱 0원'],['k3','출장 한 건의 몫','부품 마진 + 공임','오늘: 3만 7,000원'],['k4','가게 비우는 1시간 값','나가면 놓치는 돈','오늘: 7,636원'],
      ['k5','매출 비중 말고 몫 비중','매출 25%가 몫 47%','출장 296 ÷ 626'],['k6','내 몸이 하루 몇 건','출장은 몸이 하는 일','오늘: 하루 3건 남짓']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?1-P(ov,0,.3):1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:34,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-780,-290,1560,560,{bg:'rgba(6,13,32,1)',bd:C.gold});text('하루 손님 15명 · 객단가 1만 2,000원 · 마진 30% · 25일 · 고정비 150만',0,-210,{f:'D',s:38,max:1460});text('출장 한 건 몫 3만 원 · 사장님 몫 300만 원이 되려면 한 달 몇 건?',0,-145,{f:'D',s:38,max:1460});
      const b=L('k7b');
      if(b>=0)text('가게 몫 135만 − 150만 = −15만 · (300 + 15) ÷ 3 = ?',0,-45,{f:'D',s:40,alpha:P(b,0,.3),max:1460});
      const k=K('k7b',0);if(k>=0)text('105건',0,90,{f:'D',s:130,c:CT2,glow:'rgba(255,159,67,.4)',alpha:P(k,0,.3)});else text('?',0,90,{f:'D',s:120,c:C.gold});
      if(L('k7c')>=0)text('하루 4.2건 · 오늘 가게(하루 3.2건)보다 몸이 더 바쁘다',0,215,{s:36,w:900,c:'#6FD3FF',alpha:P(L('k7c'),0,.3),max:1460});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('동네 철물점 계산서',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      hwShop(430,520,.75,{alpha:P(a,0,.3),note:1});
      const b=L('z2'),b2=L('z2b');
      const rows=[['한 달 매출','1,600만 (가게 600 · 출장 400 · 납품 600)','#fff',b,.3],['가게 판매 몫 − 고정비','210만 − 210만 = 0원',C.red,b,2.5],['사장님 몫','416만 = 출장 296 + 납품 120',CP,b2,.3]];
      rows.forEach(([l,v,col,t0,d],i)=>{if(t0<0)return;const kk=P(t0,d,.3);if(kk<=0)return;group(1300,320+i*160,1,0,kk,()=>{panel(-540,-65,1080,130,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-500,4,{a:'left',f:'D',s:36,max:330});text(v,500,4,{a:'right',f:'D',s:36,c:col,max:640});});});
    }else{
      hwShop(480,480,.7,{note:1});toolBag(1060,520,.9);drawMascot(1640,540,.55,'happy');
      stampBox('철물점의 힘 = 가게 손님이 아니라 공구 가방',960,790,c,{s:46,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      if(L('z4')>=0&&L('z4b')<0)pill('예시 가정 · 창업 권유 아님',1560,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-520,-70,1040,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 동네 철물점 사장님, 출장도 오시나요?',0,4,{s:40,w:900,c:C.ink,max:980});});
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
