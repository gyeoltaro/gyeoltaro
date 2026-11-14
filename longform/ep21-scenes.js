/* ════════════════════════════════════════════════════════════════════
   장면 (LF.21 칼국수 한 그릇 1만 원 대출 계산서 — 장부는 흑자, 통장은 적자 · 원금은 비용에 안 보인다 · 거치 1년이 끝나는 날) — 수치·출처는 docs/longform-ep21.md
   중심 그림: 1만 원짜리 칼국수 그릇을 국물 높이(= 금액)로 나눈다. 재료 4,000 · 인건비 2,000 · 월세 1,250 · 기타 750 · 이자 125 · 장부 몫 1,875(= 원금 625 + 통장 1,250).
   반전: 이자는 장부 비용, 원금은 장부 밖. 손님이 25% 줄면 장부 +75만 · 통장 −50만. 장부 본전 하루 55그릇, 통장 본전 64그릇.
   ════════════════════════════════════════════════════════════════════ */
const KL=[ // 그릇 층 (아래부터)
  {k:'mat',name:'재료비',v:4000,col:'#E8A25A'},
  {k:'lab',name:'인건비',v:2000,col:'#6FA8FF'},
  {k:'rent',name:'월세',v:1250,col:'#B197FC'},
  {k:'etc',name:'기타',v:750,col:'#8a93a8'},
  {k:'int',name:'이자',v:125,col:'#FF4D4D'},
  {k:'prin',name:'원금',v:625,col:'#c2185b'},
  {k:'cash',name:'통장 몫',v:1250,col:'#35E08A'},
];
const SEQ=['1','8','7','5','×','2','0','0','0','='];   // 1,875 × 2,000 = 3,750,000 (0 개수: 2000 은 셋)
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}
function bubble(x,y,w,h,str,o={}){group(x,y,o.k??1,o.rot||0,o.alpha??1,()=>{ctx.fillStyle='#fff';rr(-w/2,-h/2,w,h,30);ctx.fill();if(o.tail!==false){ctx.beginPath();ctx.moveTo(-w*.2,h/2);ctx.lineTo(-w*.26,h/2+50);ctx.lineTo(-w*.1,h/2);ctx.fill();}if(str)text(str,0,4,{f:'D',s:o.s||60,c:o.c||C.ink,max:w-60});});}
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-250,-h/2);ctx.lineTo(250,-h/2);ctx.lineTo(250,h/2);for(let i=0;i<13;i++){ctx.lineTo(250-(i+.5)*38.5,h/2+(i%2?0:14));}ctx.lineTo(-250,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-h/2+84,220,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-220,yy,{a:'left',s:32,w:900,c:'#3a4256',max:250});text(v,220,yy,{a:'right',f:'D',s:38,c:c||'#1d2433'});});
});}

/* 칼국수 그릇 (옆에서 본 단면). fill(k) = 0~1 그 층이 얼마나 찼나. split = 장부 몫 1,875 를 원금·통장으로 나눴나 */
function kalBowl(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  const w=760,h=400; // 테두리 y=-h/2, 바닥 y=+h/2
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,h/2+34,260,24,0,0,7);ctx.fill();
  ctx.fillStyle='#e9e2d0';rr(-150,h/2-6,300,40,12);ctx.fill();
  ctx.save();ctx.beginPath();ctx.moveTo(-w/2,-h/2);ctx.ellipse(0,-h/2,w/2,h,0,0,Math.PI);ctx.closePath();
  ctx.fillStyle='#f5efe2';ctx.fill();ctx.clip();
  ctx.fillStyle='rgba(60,50,30,.12)';ctx.fillRect(-w/2,-h/2,w,h+20);
  let acc=0;
  KL.forEach(L0=>{const f=o.fill?o.fill(L0.k):0;if(f<=0){acc+=L0.v;return;}
    const y1=h/2-(acc/10000)*(h+4),hh=(L0.v/10000)*(h+4)*f;let col=L0.col;
    if(!o.split&&(L0.k==='prin'||L0.k==='cash'))col='#35E08A';
    if(o.dim&&o.dim(L0.k)){ctx.save();ctx.globalAlpha*=.25;}
    ctx.fillStyle=col;ctx.fillRect(-w/2,y1-hh,w,hh+.5);
    if(o.dim&&o.dim(L0.k))ctx.restore();
    if(o.split&&L0.k==='prin'){ctx.save();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;for(let i=-20;i<30;i++)line(i*34,y1,i*34+hh,y1-hh);ctx.restore();}
    acc+=L0.v;});
  if(o.noodle){ctx.save();ctx.strokeStyle='rgba(255,250,230,.85)';ctx.lineWidth=7;ctx.lineCap='round';const top=h/2-(h+4)*o.noodle;for(let i=0;i<7;i++){ctx.beginPath();for(let xx=-300;xx<=300;xx+=20){const yy=top+14+i*10+Math.sin(xx*.05+i*1.7)*8;xx===-300?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);}ctx.stroke();}ctx.restore();}
  ctx.restore();
  ctx.strokeStyle='#cfc4ab';ctx.lineWidth=10;ctx.beginPath();ctx.ellipse(0,-h/2,w/2,22,0,0,7);ctx.stroke();
  ctx.strokeStyle='#b7342f';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(0,-h/2+60,w/2-34,1,0,0,Math.PI);ctx.stroke();
  if(o.steam){ctx.save();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=8;ctx.lineCap='round';for(let i=0;i<3;i++){const sx=-120+i*120,ph=T*2+i;ctx.beginPath();for(let k=0;k<6;k++){const yy=-h/2-30-k*24,xx=sx+Math.sin(ph+k*.9)*16;k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();}ctx.restore();}
  if(o.price)group(w/2-40,-h/2-40,1,.06,1,()=>{ctx.fillStyle='#ffd23f';rr(-120,-42,240,84,14);ctx.fill();text(o.price,0,3,{f:'D',s:46,c:'#1d2433',max:220});});
});}
const kalFull=()=>1;
/* 동네 칼국숫집 (상표 없음) */
function kalShop(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,282,460,26,0,0,7);ctx.fill();
  ctx.fillStyle='#4a3b2f';rr(-420,-300,840,580,18);ctx.fill();
  ctx.fillStyle='#f3e6c8';rr(-420,-300,840,110,14);ctx.fill();text(o.name||'손칼국수',0,-244,{f:'D',s:66,c:'#7a2b1f'});
  for(let i=0;i<12;i++){ctx.fillStyle=i%2?'#c0392b':'#f3e6c8';ctx.beginPath();ctx.moveTo(-420+i*70,-190);ctx.lineTo(-350+i*70,-190);ctx.lineTo(-385+i*70,-150);ctx.closePath();ctx.fill();}
  const lit=!o.dark;ctx.save();if(lit){ctx.shadowColor='rgba(255,224,140,.6)';ctx.shadowBlur=36;}ctx.fillStyle=lit?'#ffe9b8':'#3a4256';rr(-380,-130,500,330,8);ctx.fill();ctx.restore();
  if(lit){for(let j=0;j<3;j++){ctx.fillStyle='#8a5a3c';rr(-350+j*160,90,120,16,6);ctx.fill();ctx.fillStyle='#f5efe2';ctx.beginPath();ctx.ellipse(-290+j*160,80,34,12,0,0,7);ctx.fill();}
    ctx.strokeStyle='rgba(122,43,31,.5)';ctx.lineWidth=4;line(-380,20,120,20);}
  if(o.shutter){ctx.fillStyle='#7d8494';rr(-380,-130,500,330,8);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;for(let i=0;i<14;i++)line(-380,-110+i*23,120,-110+i*23);ctx.fillStyle='#fff';rr(-250,-10,240,90,8);ctx.fill();text('폐업',-130,36,{f:'D',s:52,c:'#d62f2f'});}
  ctx.fillStyle='#cfe8ff';rr(160,-130,220,410,8);ctx.fill();ctx.fillStyle='rgba(74,59,47,.5)';ctx.fillRect(268,-130,4,410);
  if(o.price)group(-130,-60,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-150,-56,300,112,12);ctx.fill();text('칼국수',0,-22,{s:30,w:900,c:C.ink});text(o.price,0,22,{f:'D',s:46,c:'#d62f2f'});});
});}
/* 장부 (가계부 공책) · 통장 (예금 통장) — 상표 없음 */
function ledgerBook(x,y,s,amt,col,o={}){group(x,y,s,o.rot??-.03,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';rr(-232,-262,476,536,14);ctx.fill();
  ctx.fillStyle='#f6f0dd';rr(-240,-270,480,540,14);ctx.fill();ctx.fillStyle='#7a5a3a';rr(-240,-270,40,540,10);ctx.fill();
  text(o.title||'장부',20,-200,{f:'D',s:60,c:'#3d2c1c'});text(o.sub||'이번 달 이익',20,-130,{s:30,w:900,c:'#8a7558'});
  ctx.strokeStyle='rgba(61,44,28,.18)';ctx.lineWidth=3;for(let i=0;i<5;i++)line(-180,-80+i*50,210,-80+i*50);
  if(amt!=null)text(amt,20,150,{f:'D',s:o.as||84,c:col||'#1f8a50',max:400});
});}
function bankBook(x,y,s,amt,col,o={}){group(x,y,s,o.rot??.03,o.alpha??1,()=>{
  ctx.fillStyle='rgba(0,0,0,.3)';rr(-232,-262,476,536,22);ctx.fill();
  ctx.fillStyle='#1f6f8b';rr(-240,-270,480,540,22);ctx.fill();ctx.fillStyle='rgba(255,255,255,.12)';rr(-240,-270,480,150,22);ctx.fill();
  text(o.title||'통장',0,-200,{f:'D',s:60,c:'#fff'});text(o.sub||'이번 달 남은 돈',0,-130,{s:30,w:900,c:'#cfe8f2'});
  ctx.fillStyle='#f3f7fa';rr(-200,-70,400,300,14);ctx.fill();
  ctx.strokeStyle='rgba(31,111,139,.25)';ctx.lineWidth=3;for(let i=0;i<4;i++)line(-180,-30+i*50,180,-30+i*50);
  if(amt!=null)text(amt,0,150,{f:'D',s:o.as||84,c:col||'#1f8a50',max:380});
});}
/* 작은 그릇 아이콘 */
function miniBowl(x,y,r,col,al=1){if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-r,y-r*.3);ctx.ellipse(x,y-r*.3,r,r*.9,0,0,Math.PI);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.ellipse(x,y-r*.3,r,r*.22,0,0,7);ctx.fill();ctx.restore();}
function bowlGrid(x0,y0,n,cols,cell,onFn){for(let i=0;i<n;i++){const x=x0+(i%cols)*cell+cell/2,y=y0+Math.floor(i/cols)*cell+cell/2;const st=onFn(i);miniBowl(x,y,cell*.38,st.col,st.al);}}
/* 60개월 장부·통장 (만 원) */
const MON=[];(()=>{let bal=6000;for(let m=1;m<=60;m++){const it=bal*.05/12,pr=m>12?125:0;MON.push({m,it,led:400-it,cash:400-it-pr,bal:bal-pr});bal-=pr;}})();
function chartMonths(x0,y0,w,h,upto,o={}){ // y0 = 0원 선, 위로 h 가 450만
  const sc=h/450,bw=w/60;
  ctx.save();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;line(x0,y0,x0+w,y0);ctx.restore();
  [100,200,300,400].forEach(v=>{ctx.save();ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=2;line(x0,y0-v*sc,x0+w,y0-v*sc);ctx.restore();text(v+'만',x0-14,y0-v*sc,{a:'right',s:24,w:800,c:C.dim});});
  for(let i=0;i<Math.min(60,upto);i++){const d=MON[i],k=clamp(upto-i);ctx.fillStyle=i<12?'#35E08A':'#1f9a62';rr(x0+i*bw+2,y0-d.cash*sc*k,bw-4,d.cash*sc*k,3);ctx.fill();
    if(i>=12){ctx.fillStyle='rgba(194,24,91,.8)';rr(x0+i*bw+2,y0-d.led*sc*k,bw-4,(d.led-d.cash)*sc*k,3);ctx.fill();}}
  ctx.save();ctx.strokeStyle='#FFD23F';ctx.lineWidth=5;ctx.beginPath();for(let i=0;i<Math.min(60,Math.ceil(upto));i++){const d=MON[i],xx=x0+i*bw+bw/2,yy=y0-d.led*sc;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();ctx.restore();
  [1,13,24,36,48,60].forEach(m=>text(m+'월',x0+(m-.5)*bw,y0+30,{s:22,w:800,c:m===13?C.gold:C.dim}));
}
/* 하루 그릇 수 → 한 달 장부·통장 (만 원) */
const ledAt=n=>n*25*.6-825, cashAt=n=>ledAt(n)-125;

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    if(T<CT('o2')){
      const a=L('o1');
      kalShop(470,500,.78*E.back(P(a,0,.5))+.001,{});
      kalBowl(1180,520,.5,{fill:kalFull,noodle:1,steam:1,alpha:P(a,.3,.3)});
      big('o1',0,1180,250,'1만 원',{f:'D',s:100,c:C.gold,glow:'rgba(255,197,49,.45)'});
      if(T>FR('o1',.45)){text('장부에 남는 돈',1620,420,{f:'D',s:46,c:C.dim,alpha:P(T,FR('o1',.45),.3)});big('o1',1,1620,540,'1,875원',{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)'});}
    }else if(T<CT('o3')){
      const b=L('o2');
      ledgerBook(520,470,.95,'1,875원','#1f8a50',{sub:'한 그릇 이익',alpha:P(b,0,.3)});
      const q=K('o2',0);bankBook(1180,470,.95,q>=0?'1,250원':'?',q>=0?'#1f8a50':C.gold,{sub:'한 그릇 남은 돈',alpha:P(b,.1,.3)});
      if(T>FR('o2',.45))group(1640,300,E.back(P(T,FR('o2',.45),.4))+.001,.06,1,()=>{ctx.fillStyle='#c2185b';rr(-190,-70,380,140,20);ctx.fill();text('625원은',0,-24,{f:'D',s:44});text('어디로?',0,30,{f:'D',s:50,c:'#FFD23F'});});
      srcLine('예시 가정 · 한 그릇 1만 원 · 세금 제외');
    }else if(T<CT('o4')){
      const b=L('o3');
      text('한 달 대출 상환액 (예시)',960,170,{f:'D',s:54,c:C.gold,alpha:P(b,0,.3)});
      [['이자','25만 원','장부에 비용으로 ○','#FF4D4D'],['원금','125만 원','장부에 안 나온다 ✕','#c2185b']].forEach(([n,v,s,col],i)=>{const k=P(b,.15+i*.35,.3);if(k<=0)return;group(560+i*800,470,1,0,k,()=>{panel(-340,-210,680,420,{bd:col,bg:'rgba(255,255,255,.05)'});text(n,0,-130,{f:'D',s:60,c:col});text(v,0,-20,{f:'D',s:100});text(s,0,110,{f:'D',s:44,c:i?'#ffb3d0':'#ffb3b3',max:620});});});
    }else if(T<CT('o5')){
      const b=L('o4');
      text('손님이 4분의 1 줄어든 달 (예시)',960,170,{f:'D',s:54,c:C.gold,alpha:P(b,0,.3)});
      ledgerBook(560,500,.9,K('o4',0)>=0?'+75만 원':'?',K('o4',0)>=0?'#1f8a50':C.gold,{sub:'흑자',alpha:P(b,0,.3)});
      bankBook(1360,500,.9,K('o4',1)>=0?'−50만 원':'?',K('o4',1)>=0?'#d62f2f':C.gold,{sub:'적자',alpha:P(b,.1,.3)});
      srcLine('예시 가정 · 하루 80그릇 → 60그릇');
    }else{
      const k9=L('o5'),k10=L('o6');
      text('대출 받기 전 꼭 볼 숫자',960,230,{f:'D',s:68,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['칼국수 값 (참가격 보도)','대출·폐업 통계 (보도)','가게·대출 조건 = 예시'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,380+i*580,760,{s:32,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o7');
    text('칼국수 한 그릇 1만 원 대출 계산서',960,220,{f:'D',s:100,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1780});
    text('장부는 흑자 · 통장은 적자 · 원금은 어디에?',960,350,{s:50,w:900,alpha:P(a,.3,.3)});
    kalShop(520,680,.5,{alpha:P(a,.2,.3),price:'1만 원'});kalBowl(1130,690,.42,{fill:kalFull,noodle:1,steam:1,alpha:P(a,.3,.3)});drawMascot(1620,690,.72,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 칼국숫집 ── */
  setup:{draw(){
    sub('p1','p2',()=>{kalShop(560,490,.8,{});
      if(L('p2')>=0){text('서울 칼국수 평균 (2026년 3월)',1440,240,{f:'D',s:44,c:C.dim,max:820});text('1만 38원',1440,340,{f:'D',s:96,c:'#c9ced9'});
        const q=K('p2',0);text('우리 가게',1440,480,{f:'D',s:48,c:C.gold});text(q>=0?'1만 원':'?',1440,590,{f:'D',s:110,c:C.gold});}
      srcLine('참가격 서울 칼국수 평균 1만 38원 (SBS Biz 2026.4.16) · 전국 9,071원 (2026.9, 뉴시스·파이낸셜뉴스 2026.10.19)');});
    sub('p3','p3',()=>{text('하루 80그릇 (예시)',700,170,{f:'D',s:54,c:C.gold});
      const q=K('p3',0);bowlGrid(160,220,80,10,80,i=>({col:'#f5efe2',al:q>=0?lerp(.25,1,P(q,i*.01,.15)):.25}));
      text('× 25일',1520,330,{f:'D',s:56,c:C.dim});text('= 2,000그릇',1520,430,{f:'D',s:70});
      if(T>FR('p3',.55)){text('한 달 매출',1520,570,{f:'D',s:46,c:C.dim,alpha:P(T,FR('p3',.55),.3)});popText(FR('p3',.6),1520,680,'2,000만 원',{f:'D',s:96,c:C.gold});}
      srcLine('예시 가정 · 한 달 25일 영업');});
    sub('p4','p4',()=>{text('가게를 여는 데 든 돈 (소상공인 평균)',960,170,{f:'D',s:54,c:C.gold});
      const q=K('p4',0),X0=200,SC=1500/8300;
      if(q<0)text('?',960,400,{f:'D',s:110,c:C.gold});
      else{const k=E.out(P(q,0,.6));ctx.fillStyle='#5b6275';rr(X0,330,8300*SC*k,140,16);ctx.fill();text('8,300만 원',X0+8300*SC/2,400,{f:'D',s:70,alpha:P(q,.3,.3)});
        if(T>FR('p4',.55)){const k2=E.out(P(T,FR('p4',.55),.6));ctx.fillStyle='#35E08A';rr(X0,520,5900*SC*k2,110,14);ctx.fill();text('본인 돈 5,900만',X0+20,575,{a:'left',f:'D',s:48,c:'#0d1a12',alpha:k2});
          ctx.fillStyle='#c2185b';rr(X0+5900*SC+8,520,(2400*SC-8)*k2,110,14);ctx.fill();text('나머지 2,400만',X0+5900*SC+2400*SC/2,575,{f:'D',s:40,alpha:k2,max:2400*SC-20});}}
      srcLine('중기부·소진공 2024년 기준 소상공인실태조사 (파이낸셜뉴스 2026.3.13) · 2,400만 = 8,300 − 5,900 (계산값)');});
    sub('p5','p6',()=>{const q=K('p5',0);
      text('우리 가게 대출 (예시)',520,190,{f:'D',s:52,c:C.gold});text(q>=0?'6,000만 원':'?',520,320,{f:'D',s:110,c:q>=0?'#ff8fbf':C.gold});
      [['금리','연 5%'],['첫 1년','이자만'],['다음 4년','원금 똑같이 나눠 갚기']].forEach(([l,v],i)=>{const k=P(T,FR('p5',.4+i*.17),.3);if(k>0){text(l,140,470+i*90,{a:'left',f:'D',s:42,c:C.dim,alpha:k});text(v,900,470+i*90,{a:'right',f:'D',s:46,alpha:k,max:560});}});
      const X0=1040,WW=800;text('5년 상환표',X0+WW/2,240,{f:'D',s:44,c:C.dim});
      const k1=P(T,FR('p5',.55),.4);if(k1>0){ctx.save();ctx.globalAlpha*=k1;ctx.fillStyle='#5b6275';rr(X0,300,WW/5-6,180,14);ctx.fill();text('1년',X0+WW/10,350,{f:'D',s:40});text('이자만',X0+WW/10,420,{s:30,w:900});
        for(let i=1;i<5;i++){ctx.fillStyle='#c2185b';rr(X0+i*WW/5,300,WW/5-6,180,14);ctx.fill();text((i+1)+'년',X0+i*WW/5+WW/10,350,{f:'D',s:40});text('원금+이자',X0+i*WW/5+WW/10,420,{s:26,w:900,max:150});}ctx.restore();}
      if(L('p6')>=0){stampBox('거치 기간 = 원금을 미뤄 주는 기간',X0+WW/2,620,L('p6'),{s:40,c:C.gold,bg:'rgba(40,30,0,.9)'});}
      srcLine('대출 금액·금리·거치 1년·4년 원금 균등 상환은 예시 가정 (실제 조건은 상품마다 다르다)');});
    sub('p7','p7',lt=>{kalBowl(640,500,.95,{steam:1});text('1만 원 = 국물 높이',1460,400,{f:'D',s:64,c:C.gold,alpha:P(lt,.2,.3)});text('높이 1칸 = 금액',1460,500,{s:40,w:900,c:C.dim,alpha:P(lt,.4,.3)});});
  }},
  /* ── 1만 원 쪼개기 ── */
  cut:{draw(){
    const fl=k=>{const m={mat:KT('s1',0),lab:KT('s2',0),rent:KT('s3',0),etc:KT('s3',1),int:KT('s4',0),prin:KT('s5',0),cash:KT('s5',0)}[k];return E.out(P(T,m,.6));};
    const split=T>=KT('s6',0);
    kalBowl(520,520,.95,{fill:fl,split,steam:0,noodle:T>=KT('s5',0)?1:0});
    text('칼국수 한 그릇 1만 원',520,190,{f:'D',s:48,c:C.gold});
    const X1=1060,X2=1830;
    const rows=[['재료비','4,000원','#E8A25A',KT('s1',0)],['인건비','2,000원','#6FA8FF',KT('s2',0)],['월세','1,250원','#B197FC',KT('s3',0)],['기타','750원','#a7afc2',KT('s3',1)],['대출 이자','125원','#FF4D4D',KT('s4',0)]];
    rows.forEach(([n,v,col,t],i)=>{if(T<t)return;const y=230+i*74,k=P(T,t,.3);ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=col;rr(X1,y-22,44,44,10);ctx.fill();ctx.restore();text(n,X1+64,y,{a:'left',f:'D',s:42,alpha:k});text(v,X2,y,{a:'right',f:'D',s:46,c:col,alpha:k});});
    if(L('s1')>=0&&T<KT('s2',0)&&T>FR('s1',.6))pill('정부 조사: 외식업 식재료비 비중 40.7%',1440,700,{s:32,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('s1',.6),.3)});
    const t5=KT('s5',0);
    if(T>=t5){ctx.save();ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(X1,600,X2,600);ctx.restore();
      if(!split)popText(t5,1445,670,'장부 몫 1,875원',{f:'D',s:72,c:C.green});
      else{text('장부 몫 1,875원',X1,650,{a:'left',f:'D',s:44,c:'#9fe8c2'});
        popText(KT('s6',0),1445,720,'− 원금 625원',{f:'D',s:56,c:'#ff6fae'});
        const t7=KT('s7',0);if(T>=t7)stampBox('통장 몫 1,250원',1445,810,T-t7,{s:54,c:C.green,bg:'rgba(0,30,15,.92)'});}}
    else if(L('s5')>=0)text('?',1445,670,{f:'D',s:72,c:C.gold});
    if(T<t5)srcLine('예시 가정 · 재료 40% · 인건비 400만 · 월세 250만 · 기타 150만 · 이자 = 6,000만 × 5% ÷ 12 = 25만 (한 달 2,000그릇)');
    else if(!split)srcLine('10,000 − 4,000 − 2,000 − 1,250 − 750 − 125 = 1,875원');
    else srcLine('원금 125만 ÷ 2,000그릇 = 625원 (2년째부터) · 1,875 − 625 = 1,250원');
  }},
  calc:{draw(){
    if(T<CT('c1')){const a=L('c0');
      ledgerBook(560,470,.9,'?',C.gold,{sub:'한 달 이익',alpha:P(a,0,.3)});bankBook(1360,470,.9,'?',C.gold,{sub:'한 달 남은 돈',alpha:P(a,.15,.3)});
      text('1,875원 × 2,000그릇',960,170,{f:'D',s:56,c:C.gold,alpha:P(a,.2,.3)});
      srcLine('예시 가정 · 한 달 2,000그릇');return;}
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('×'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s).toLocaleString('ko-KR'):'';
    let small='',bigS='0';if(done){small=`${fmt(n1)} × ${fmt(n2.replace('=',''))} =`;bigS='3,750,000';}else if(n2!==undefined){small=`${fmt(n1)} ×`;bigS=n2?fmt(n2):fmt(n1);}else if(n1)bigS=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:done?72:84,f:'D',c:done?'#1f8a50':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('장부 몫 1,875원 × 한 달 2,000그릇',1350,250,{f:'D',s:50,c:C.gold,alpha:P(a,.2,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{const c2=L('c2');
        text('장부 이익',1000,420,{a:'left',f:'D',s:40,alpha:P(c2,0,.3)});const q=K('c2',0);if(q<0)text('?',1060,480,{f:'D',s:56,c:C.gold});else hbar(1000,480,560,70,375,400,'#FFD23F','375만',{s:48,k:E.out(P(q,0,.5))});
        text('통장에 남는 돈',1000,580,{a:'left',f:'D',s:40,alpha:P(c2,0,.3)});const r=K('c2',1);if(r<0)text('?',1060,640,{f:'D',s:56,c:C.gold});else hbar(1000,640,560,70,250,400,C.green,'250만',{s:48,k:E.out(P(r,0,.5))});
        if(L('c3')>=0)stampBox('같은 달, 숫자가 두 개',1330,780,L('c3'),{s:48,c:C.gold,bg:'rgba(40,30,0,.9)'});}}
    if(dt>=0&&L('c2')<0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 원금은 왜 장부에 안 보일까 ── */
  ledger:{draw(){
    sub('l1','l1',lt=>{drawMascot(620,520,.95,'think');bubble(1340,400,760,200,'왜 숫자가 두 개?',{k:E.back(P(lt,.1,.4))+.001,s:64});});
    sub('l2','l2',lt=>{text('6,000만 원을 빌린 날',960,170,{f:'D',s:56,c:C.gold});
      bankBook(560,500,.85,'+6,000만','#1f8a50',{sub:'들어온 돈',alpha:P(lt,.1,.3)});
      ledgerBook(1360,500,.85,T>FR('l2',.45)?'매출 0원':'?',T>FR('l2',.45)?'#8a7558':C.gold,{sub:'이번 달 매출',alpha:P(lt,.3,.3),as:72});
      if(T>FR('l2',.7))pill('빌린 돈 ≠ 번 돈',960,800,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('l2',.7),.3)});});
    sub('l3','l4',()=>{text('매달 갚는 150만 원 (2년째부터, 예시)',960,170,{f:'D',s:52,c:C.gold,max:1800});
      const q=K('l3',0);
      group(560,480,1,0,1,()=>{panel(-360,-220,720,440,{bd:'#c2185b'});text('원금 125만 원',0,-130,{f:'D',s:62,c:'#ff8fbf'});text('빌린 돈을 돌려주는 것',0,-30,{s:36,w:900,c:C.dim});
        if(q>=0)group(0,100,lerp(1.6,1,E.out(P(q,0,.3))),-.05,P(q,0,.15),()=>text('장부 비용 ✕',0,0,{f:'D',s:70,c:'#ff6fae'}));else text('?',0,100,{f:'D',s:70,c:C.gold});});
      if(L('l4')>=0)group(1360,480,1,0,P(L('l4'),0,.3),()=>{panel(-360,-220,720,440,{bd:'#FF4D4D'});text('이자 25만 원',0,-130,{f:'D',s:62,c:'#ff9a9a'});text('돈을 빌린 값',0,-30,{s:36,w:900,c:C.dim});text('장부 비용 ○',0,100,{f:'D',s:70,c:'#FF4D4D'});});});
    sub('l5','l6',()=>{ledgerBook(560,480,.9,'375만 원','#1f8a50',{sub:'가게가 번 돈'});bankBook(1360,480,.9,'250만 원','#1f8a50',{sub:'빚까지 갚고 남은 돈'});
      if(L('l5b')>=0&&L('l6')<0)pill('차이 125만 = 원금',960,800,{s:40,bg:'rgba(255,143,191,.95)',alpha:P(L('l5b'),.1,.3)});
      if(L('l6')>=0)stampBox('생활비 = 두 번째 숫자',1360,800,L('l6'),{s:50,c:C.gold,bg:'rgba(40,30,0,.9)'});});
    sub('l7','l7',lt=>{ledgerBook(560,480,.9,'375만 원','#1f8a50',{sub:'가게가 번 돈'});
      group(1360,470,1,0,P(lt,.1,.3),()=>{panel(-400,-170,800,340,{bd:'rgba(255,255,255,.4)'});text('오늘 계산에서 뺀 것',0,-90,{f:'D',s:46,c:C.gold});text('감가상각',0,0,{f:'D',s:74});text('(인테리어·장비 값을 해마다 나눠 비용으로)',0,90,{s:30,w:900,c:C.dim,max:740});});
      srcLine('단순화한 예시 · 실제 장부·세금 계산은 세무 기준을 따른다');});
  }},
  /* ── 거치 1년이 끝나는 날 ── */
  grace:{draw(){
    const X0=240,Y0=720,WW=1560,HH=470;
    let upto=0;
    if(T<CT('g4'))upto=12*E.out(P(T,CT('g2')+.3,1.6));
    else upto=12+48*E.io(P(T,KT('g4',0)-.6,2.2));
    text('한 달 장부 이익 (노란 선) vs 통장에 남는 돈 (막대) · 5년 (예시)',960,165,{f:'D',s:40,c:C.gold,max:1800});
    if(L('g6')<0||L('g7')>=0){chartMonths(X0,Y0,WW,HH,upto);
      const bw=WW/60;
      if(L('g2')>=0&&T<KT('g4',0)){const k=K('g2',0);if(k>=0)popText(KT('g2',0),X0+6*bw,Y0-400*HH/450-50,'둘 다 375만',{f:'D',s:48,c:C.green});else text('?',X0+6*bw,Y0-470,{f:'D',s:52,c:C.gold});}
      if(L('g3')>=0&&T<KT('g4',0))text('"이게 우리 가게 수입"',X0+WW*.6,360,{f:'D',s:56,c:'#c9ced9',alpha:P(L('g3'),.2,.3)});
      if(L('g3b')>=0&&T<KT('g4',0))pill('생활비 375만에 맞추면 → 13개월째부터 매달 −125만',X0+WW*.6,450,{s:32,bg:'rgba(255,143,191,.95)',alpha:P(L('g3b'),.2,.3)});
      const q=K('g4',0);if(q>=0&&L('g6')<0){ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=5;ctx.setLineDash([12,8]);line(X0+12*bw,Y0-460,X0+12*bw,Y0);ctx.restore();
        stampBox('13개월째 통장 250만',X0+12*bw+330,Y0-250*HH/450-60,q,{s:42,c:C.red,bg:'rgba(40,0,0,.9)'});
        if(L('g5')>=0){pill('분홍 = 원금 125만 (4년 내내)',X0+WW*.72,280,{s:32,bg:'rgba(255,143,191,.95)',alpha:P(L('g5'),0,.3)});pill('이자는 25만 → 마지막 달 약 5,200원',X0+WW*.72,350,{s:30,bg:'rgba(255,255,255,.92)',alpha:P(L('g5'),.6,.3)});}}
      if(L('g7')>=0)stampBox('차이 6,000만 = 처음 빌린 돈',960,250,L('g7'),{s:50,c:'#ff8fbf',bg:'rgba(40,0,20,.92)'});
      srcLine('예시 계산 · 6,000만 · 연 5% · 1년 거치 · 4년 원금 균등 · 이자 전 이익 월 400만 고정');}
    else{const b=L('g6');
      [['5년 이자 합계','912만 5,000원','#FF4D4D',KT('g6',0)],['5년 장부 이익 합계','약 2억 3,100만 원','#FFD23F',FR('g6',.4)],['5년 통장에 남은 돈','약 1억 7,100만 원',C.green,KT('g6',1)]].forEach(([l,v,col,t],i)=>{
        const y=300+i*170;group(960,y,1,0,P(b,0,.3),()=>{panel(-760,-70,1520,140,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-700,4,{a:'left',f:'D',s:46});if(T>=t)popText(t,400,4,v,{f:'D',s:66,c:col});else text('?',400,4,{f:'D',s:66,c:C.gold});});});
      srcLine('400만 × 60 − 이자 912만 5,000 = 2억 3,087만 5,000 · − 원금 6,000만 = 1억 7,087만 5,000 (python3)');}
  }},
  /* ── 손님이 25% 줄면 (어두운 장) ── */
  drop:{draw(){
    sub('d1','d2',lt=>{if(L('d2')<0){kalShop(560,480,.62,{dark:1});text('손님이 줄어든 달',1380,480,{f:'D',s:72,c:'#ffb3b3',alpha:P(lt,.1,.3)});return;}
      const q=K('d2',0);text('하루 80그릇 → 60그릇',700,170,{f:'D',s:54,c:C.gold});
      bowlGrid(160,220,80,10,80,i=>({col:i>=60&&q>=0?'#3a4256':'#f5efe2',al:i>=60&&q>=0?lerp(1,.3,P(q,(i-60)*.02,.3)):1}));
      if(T>FR('d2',.55)){text('한 달 매출',1520,380,{f:'D',s:46,c:C.dim});popText(FR('d2',.6),1520,490,'1,500만 원',{f:'D',s:96,c:'#ffb3b3'});text('(2,000만 → 1,500만)',1520,590,{s:34,w:900,c:C.dim});}
      srcLine('예시 가정 · 한 달 1,500그릇');});
    sub('d3','d6b',()=>{
      const rows=[['매출','1,500만'],['재료비 (40%)','−600만']];
      if(L('d3')>=0&&T>FR('d3',.45))rows.push(['인건비·월세·기타','−800만']);
      if(L('d4')>=0){rows.push(['이자','−25만']);if(K('d4',0)>=0)rows.push(['= 장부','+75만','#1f8a50']);}
      if(L('d5')>=0){rows.push(['원금','−125만','#c2185b']);if(K('d5',0)>=0)rows.push(['= 통장','−50만','#d62f2f']);}
      receipt(560,500,.86,rows,{title:'한 달 (예시)'});
      if(L('d6')<0){
        ledgerBook(1180,470,.62,K('d4',0)>=0?'+75만':'?',K('d4',0)>=0?'#1f8a50':C.gold,{sub:'흑자',alpha:P(L('d4'),0,.3)});
        bankBook(1600,470,.62,K('d5',0)>=0?'−50만':'?',K('d5',0)>=0?'#d62f2f':C.gold,{sub:'적자',alpha:P(L('d5'),0,.3)});
        if(L('d3')>=0&&L('d4')<0)pill('재료비만 줄고, 800만 원은 그대로',1390,780,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('d3'),.3,.3)});}
      else{drawMascot(1390,470,.72,'worry');text('매달 50만 원을',1390,730,{f:'D',s:52,c:'#ffb3b3',alpha:P(L('d6'),.3,.3)});text('메워 넣어야 한다',1390,800,{f:'D',s:52,c:'#ffb3b3',alpha:P(L('d6'),.5,.3)});
        if(L('d6b')>=0)pill('장부만 보면 "버틸 만하다"',1390,200,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('d6b'),.1,.3)});}});
    sub('d7','d8',()=>{text('하루 그릇 수별 한 달 숫자 (예시)',960,165,{f:'D',s:48,c:C.gold});
      const X0=220,X1=1680,n0=40,n1=90,Y0=500,SC=.5,xn=n=>X0+(n-n0)/(n1-n0)*(X1-X0),yv=v=>Y0-v*SC;
      ctx.save();ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(X0,Y0,X1,Y0);ctx.restore();text('0원',X0-16,Y0,{a:'right',s:26,w:800,c:C.dim});
      [40,50,60,70,80,90].forEach(n=>text(n+'',xn(n),Y0+300,{s:26,w:800,c:C.dim}));text('하루 그릇',X1+10,Y0+300,{a:'left',s:24,w:800,c:C.dim});
      const q1=K('d7',0),q2=K('d7',1);
      if(L('d8')>=0){ctx.save();ctx.globalAlpha*=.35*P(L('d8'),0,.3);ctx.fillStyle=C.red;ctx.fillRect(xn(55),Y0-280,xn(63.33)-xn(55),560);ctx.restore();}
      [[ledAt,'#FFD23F','장부',q1],[cashAt,'#6FD3FF','통장',q2]].forEach(([f,col,nm,q])=>{ctx.save();ctx.beginPath();ctx.rect(X0,Y0-300,X1-X0,600);ctx.clip();ctx.strokeStyle=col;ctx.lineWidth=7;line(xn(n0),yv(f(n0)),xn(n1),yv(f(n1)));ctx.restore();text(nm,X1+14,clamp(yv(f(n1)),230,760),{a:'left',f:'D',s:40,c:col});});
      if(q1>=0){ctx.fillStyle='#FFD23F';ctx.beginPath();ctx.arc(xn(55),Y0,14,0,7);ctx.fill();popText(KT('d7',0),xn(55)-40,Y0-170,'장부 본전 55그릇',{f:'D',s:40,c:'#FFD23F'});}
      if(q2>=0){ctx.fillStyle='#6FD3FF';ctx.beginPath();ctx.arc(xn(63.33),Y0,14,0,7);ctx.fill();popText(KT('d7',1),xn(63.33)+220,Y0+120,'통장 본전 64그릇',{f:'D',s:40,c:'#6FD3FF'});}
      if(L('d8')>=0)stampBox('장부 흑자 · 통장 적자 구간',xn(59),Y0+210,L('d8'),{s:40,c:C.red,bg:'rgba(40,0,0,.9)'});
      srcLine('장부 = 그릇 × 25일 × 6,000원 − 825만 · 통장 = 장부 − 원금 125만 · 825 ÷ 15 = 55 · 950 ÷ 15 = 63.3 → 64그릇');});
  }},
  /* ── 실제 숫자로 보면 ── */
  real:{draw(){
    sub('r1','r1',lt=>{kalShop(560,480,.62,{});drawMascot(1360,520,.85,'think',{alpha:P(lt,.1,.3)});});
    sub('r2','r2',()=>{text('한국은행 금융안정보고서 (2026년 1분기 말)',960,170,{f:'D',s:48,c:C.gold});
      [['사업자 대출을 가진 자영업자','320만 1,000명',0],['그 대출 잔액','1,095조 5,000억 원',1]].forEach(([l,v,j],i)=>{group(520+i*880,470,1,0,1,()=>{panel(-400,-200,800,400,{bd:'rgba(255,255,255,.35)'});text(l,0,-110,{f:'D',s:42,c:C.dim,max:740});const q=K('r2',j);if(q>=0)popText(KT('r2',j),0,30,v,{f:'D',s:80,c:'#fff',max:740});else text('?',0,30,{f:'D',s:80,c:C.gold});});});
      srcLine('한국은행 2026년 상반기 금융안정보고서 (메트로경제 2026.6.24) · 가계부채DB 기준');});
    sub('r3','r3',()=>{text('자영업자 대출 연체율',960,170,{f:'D',s:54,c:C.gold});
      text('전체 (2026.1Q)',560,330,{a:'right',f:'D',s:40});hbar(600,330,1100,80,2.04,14,'#c9ced9','2.04%',{s:46});
      text('취약 (2022.2Q)',560,470,{a:'right',f:'D',s:40,c:C.dim});hbar(600,470,1100,80,4.93,14,'#ff9a9a','4.93%',{s:46});
      text('취약 (2026.1Q)',560,610,{a:'right',f:'D',s:40});const q=K('r3',0);if(q<0)text('?',660,610,{f:'D',s:56,c:C.gold});else hbar(600,610,1100,80,12.68,14,C.red,'12.68%',{s:50,k:E.out(P(q,0,.6))});
      text('취약 = 저소득 또는 저신용 다중채무자',960,740,{s:32,w:900,c:C.dim});
      srcLine('한국은행 2026년 상반기 금융안정보고서 (메트로경제 2026.6.24)');});
    sub('r4','r5',()=>{text('폐업 소상공인 1,500명 조사 (2026.6 발표)',960,170,{f:'D',s:48,c:C.gold});
      const q=K('r4',0);for(let i=0;i<100;i++){const x=150+(i%10)*66,y=250+Math.floor(i/10)*58;const on=q>=0&&i<68.5?P(q,i*.01,.2):0;ctx.fillStyle=on>0?'#ff6fae':'rgba(255,255,255,.22)';ctx.beginPath();ctx.arc(x,y,22,0,7);ctx.fill();}
      text(q>=0?'68.5% 빚이 있었다':'?',480,860-30,{f:'D',s:44,c:q>=0?'#ff6fae':C.gold});
      text('빚이 있던 사람의 평균 빚',1420,280,{f:'D',s:42,c:C.dim});big('r4',1,1420,390,'8,531만 원',{f:'D',s:100,c:C.red,glow:'rgba(255,77,77,.4)'});
      if(K('r4',1)>=0)[['제1금융권','3,483만'],['지역신보 보증','2,585만'],['제2금융권','1,293만'],['정책자금','682만']].forEach(([l,v],i)=>{const k=P(K('r4',1),.4+i*.25,.3);if(k>0){text(l,1180,500+i*62,{a:'left',s:34,w:900,alpha:k});text(v,1700,500+i*62,{a:'right',f:'D',s:40,c:'#ffb3b3',alpha:k});}});
      if(L('r5')>=0)stampBox('문을 닫아도 원금은 남는다',1420,790,L('r5'),{s:42,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('중소벤처기업부 폐업 소상공인 실태 분석 (헤럴드경제 2026.6.29) · 폐업 결심 당시 기준');});
    sub('r6','r7',()=>{kalShop(470,470,.55,{shutter:1});
      text('2년째 끝에 문을 닫으면 (예시)',1300,190,{f:'D',s:48,c:C.gold});
      const X0=880,SC=900/6000,q=K('r6',0);
      text('남은 원금',X0,300,{a:'left',f:'D',s:40});if(q<0)text('?',X0+60,370,{f:'D',s:56,c:C.gold});else{vCashH(X0,340,4500*SC*E.out(P(q,0,.6)),70,'#c2185b');text('4,500만',X0+4500*SC+16,376,{a:'left',f:'D',s:46,c:'#ff8fbf'});}
      if(T>FR('r6',.55)){const k=E.out(P(T,FR('r6',.55),.6));text('평균 폐업 비용',X0,460,{a:'left',f:'D',s:40,alpha:k});vCashH(X0,500,1286*SC*k,70,'#ff9a9a');text('1,286만',X0+1286*SC+16,536,{a:'left',f:'D',s:46,c:'#ff9a9a',alpha:k});
        text('합 5,786만 원',X0,640,{a:'left',f:'D',s:60,c:'#fff',alpha:P(T,FR('r6',.75),.3)});}
      if(L('r7')>=0)stampBox('장부는 끝나도 상환표는 남는다',1300,780,L('r7'),{s:44,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('남은 원금 = 6,000 − 125 × 12 (예시) · 평균 폐업 비용 1,286만 (중기부 조사, 헤럴드경제 2026.6.29)');});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    text('손님 하루 60그릇인 달 · 통장에 남는 돈 · 하나씩만 바꾸면 (예시)',960,165,{f:'D',s:42,c:C.gold,max:1800});
    const Z=1080,SC=6;
    ctx.save();ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=4;line(Z,215,Z,690);ctx.restore();text('0원',Z,205,{s:26,w:900,c:C.dim});
    const rows=[['지금 (6,000만 · 5% · 4년)',-50,CT('v1')+.6,'−50만','v1'],['금리 3%',-40,KT('v2',0),'−40만','v2'],['7년에 나눠 갚기',3.57,KT('v3',0),'+3만 6천','v3'],['2,400만만 빌리기',40,KT('v4',0),'+40만','v4']];
    rows.forEach(([l,v,t,lab,id],i)=>{if(L(id)<0)return;const y=280+i*110;text(l,70,y,{a:'left',s:38,w:900,max:520,c:v<0?'#ffb3b3':'#b6f5d3'});
      if(T<t){text('?',Z+(i?60:-60),y,{f:'D',s:52,c:C.gold});return;}const k=E.out(P(T,t,.6));const w=Math.max(8,Math.abs(v)*SC*k);
      ctx.fillStyle=v<0?C.red:C.green;if(v<0)rr(Z-w,y-34,w,68,14);else rr(Z,y-34,w,68,14);ctx.fill();
      if(v<0)text(lab,Z-w-18,y+2,{a:'right',f:'D',s:46,c:C.red,alpha:k});else text(lab,Z+w+18,y+2,{a:'left',f:'D',s:46,c:C.green,alpha:k});});
    if(L('v5')>=0&&L('v6')<0)pill('2,400만 = 평균 창업비 8,300만 − 본인 돈 5,900만',960,780,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(L('v5'),0,.3)});
    if(L('v6')>=0)group(960,790,1,0,P(L('v6'),0,.3),()=>{panel(-760,-50,1520,100,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('금리 2%p = +10만 · 기간 7년 = +53만 6천 · 금액 2,400만 = +90만',0,4,{f:'D',s:40,c:C.gold,max:1460});});
    if(L('v5')<0)srcLine('예시 계산 · 이자 전 이익 100만 · 한 번에 하나씩 · 거치 1년 끝난 직후 달 기준 (이자 = 남은 원금 전체 기준)',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('대출 받기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','한 달 원금','이자 + 원금 = 한 달 상환액','오늘: 25만 + 125만'],['k3','거치 끝나는 달','그달부터 통장이 얼마나 주나','오늘: 375만 → 250만'],['k4','통장 본전 손님 수','장부 본전과 따로 계산','오늘: 55그릇 vs 64그릇'],
      ['k5','손님 4분의 1 준 달','그달에도 원금을 낼 수 있나','오늘: 통장 −50만'],['k6','문 닫으면 남는 원금','1·2·3년째 남는 빚 표','오늘: 2년째 끝 4,500만']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-760,-280,1520,540,{bg:'rgba(6,13,32,1)',bd:C.gold});text('이자 전 이익 한 달 300만 · 4,800만 원 · 연 5% · 4년 원금 균등',0,-200,{f:'D',s:42,max:1440});text('통장에 남는 돈은?',0,-140,{f:'D',s:44,max:1440});
      const b=L('k7b');
      if(b>=0)text('이자 20만 · 원금 100만 · 장부 280만',0,-40,{f:'D',s:46,alpha:P(b,0,.3),max:1440});
      const k=K('k7b',0);if(k>=0)text('180만 원',0,90,{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});else text('?',0,90,{f:'D',s:110,c:C.gold});
      if(L('k7c')>=0)text('180 ÷ 280 = 장부 숫자의 64%',0,210,{s:38,w:900,c:'#6FD3FF',alpha:P(L('k7c'),0,.3),max:1440});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('칼국수 한 그릇 1만 원',960,150,{f:'D',s:56,c:C.gold,alpha:P(a,0,.3)});
      kalBowl(520,520,.9,{fill:kalFull,split:true,steam:1,noodle:1,alpha:P(a,0,.3)});
      const b=L('z2b');
      if(b>=0){[['손님 −25%: 장부','+75만',C.green],['손님 −25%: 통장','−50만',C.red],['본전','55 vs 64그릇','#FFD23F']].forEach(([l,v,col],i)=>{const kk=P(b,i*.7,.3);if(kk<=0)return;group(1420,330+i*170,1,0,kk,()=>{panel(-420,-70,840,140,{bg:'rgba(6,13,32,1)',bd:col,lw:4});text(l,-370,4,{a:'left',f:'D',s:42,max:420});text(v,370,4,{a:'right',f:'D',s:v.length>6?50:66,c:col,max:380});});});}
      else if(L('z2')>=0){[['장부 몫','1,875원','#FFD23F'],['원금','625원','#ff8fbf'],['통장 몫','1,250원',C.green]].forEach(([l,v,col],i)=>{const kk=P(L('z2'),.4+i*1.1,.3);if(kk<=0)return;text(l,1120,360+i*130,{a:'left',f:'D',s:48,alpha:kk});text(v,1780,360+i*130,{a:'right',f:'D',s:66,c:col,alpha:kk});});}
    }else{
      kalShop(560,470,.6,{price:'1만 원'});kalBowl(1180,500,.42,{fill:kalFull,split:true,noodle:1,steam:1});drawMascot(1640,600,.55,'happy');
      stampBox('이익 = 원금까지 갚고 남은 돈',960,800,c,{s:54,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,140,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      if(L('z4')>=0&&L('z4b')<0)pill('예시 가정 · 창업·대출 권유 아님',1500,140,{s:32,alpha:P(L('z4'),0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1200,140,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-520,-70,1040,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 거치가 끝나던 달, 통장은 어땠나요?',0,4,{s:38,w:900,c:C.ink,max:980});});
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
