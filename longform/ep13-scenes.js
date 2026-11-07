/* ════════════════════════════════════════════════════════════════════
   장면 (LF.13 소주 1,500원 고깃집 계산서) — 수치·출처는 docs/longform-ep13.md
   중심 그림: 한 사람 계산서 2만 3,750원 = 막대 하나. 재료비·소주 매입·인건비·월세·잡비를 칠하고 남은 4,050원이 사장님 몫.
   그 몫의 63%(2,550원)가 소주. 반전은 '옆집도 내리면' — 손님은 그대로, 두 가게 모두 술값만 사라진다.
   ════════════════════════════════════════════════════════════════════ */
const LY=[ // 2만 3,750원에서 칠하는 순서 (원, 한 달 1,800명 기준)
  {k:'food',name:'재료비',v:8000,col:'#E8A33A'},
  {k:'soju',name:'소주 매입',v:1200,col:'#3fbf7f'},
  {k:'labor',name:'인건비',v:5500,col:'#c08cff'},
  {k:'rent',name:'월세',v:2000,col:'#2ec4b6'},
  {k:'etc',name:'잡비',v:3000,col:'#9aa4b8'},
  {k:'own',name:'사장님 몫',v:4050,col:'#35E08A'},
];
const LYK=Object.fromEntries(LY.map(s=>[s.k,s]));
const PRICE=23750;
const SEQ=['1','3','5','0','×','3','4','0','0','='];   // 한 달 소주 1,350병 × 한 병 마진 3,400원 = 4,590,000 (0 개수: 1350 하나, 3400 둘)
function layT(k){return {food:KT('s1',0),soju:KT('s2',0),labor:KT('s3',0),rent:KT('s4',0),etc:KT('s5',0),own:KT('s6',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim,max:1840});}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
function big(id,j,x,y,str,o){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,o));else text('?',x,y,{f:'D',s:o.s,c:C.gold});}

/* 초록 소주병 (상표 없음). 가운데 아래 기준, s=1 이면 높이 약 300 */
function sojuBottle(x,y,s,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  ctx.fillStyle='#1f8f4e';rr(-42,-210,84,210,22);ctx.fill();
  ctx.beginPath();ctx.moveTo(-42,-190);ctx.quadraticCurveTo(-40,-250,-16,-262);ctx.lineTo(16,-262);ctx.quadraticCurveTo(40,-250,42,-190);ctx.fill();
  rr(-16,-300,32,48,6);ctx.fill();ctx.fillStyle=o.cap||'#d9dde4';rr(-19,-312,38,24,6);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.22)';rr(-30,-190,12,170,6);ctx.fill();
  ctx.fillStyle='#f4f1e6';rr(-38,-150,76,90,8);ctx.fill();text('소주',0,-104,{s:26,w:900,c:'#1f6b3f'});
});}
/* 소주잔 */
function shotGlass(x,y,s,al=1){group(x,y,s,0,al,()=>{ctx.fillStyle='rgba(220,240,255,.35)';ctx.beginPath();ctx.moveTo(-28,-60);ctx.lineTo(28,-60);ctx.lineTo(20,0);ctx.lineTo(-20,0);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,255,255,.75)';ctx.beginPath();ctx.moveTo(-24,-40);ctx.lineTo(24,-40);ctx.lineTo(20,-4);ctx.lineTo(-20,-4);ctx.closePath();ctx.fill();});}
/* 현수막 (빨간 비닐) */
function banner(x,y,s,str,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{ctx.fillStyle='#d8262d';rr(-330,-90,660,180,10);ctx.fill();ctx.strokeStyle='#ffe14d';ctx.lineWidth=6;rr(-314,-74,628,148,8);ctx.stroke();
  ctx.fillStyle='#ddd';[[-330,-90],[318,-90],[-330,78],[318,78]].forEach(([a,b])=>{ctx.beginPath();ctx.arc(a+6,b+6,7,0,7);ctx.fill();});
  text(o.top||'소주 한 병',0,-38,{s:36,w:900,c:'#ffe9a8'});text(str,0,30,{f:'D',s:o.s||96,c:'#fff'});});}
/* 삼겹살 한 점 */
function meatSlice(x,y,w,h,o={}){const al=o.alpha??1;if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);
  const ck=o.cooked?1:0,cm=ck?'#c7774a':'#e9858d',cf=ck?'#f1cf9e':'#f8e6dc';
  ctx.fillStyle=cf;rr(-w/2,-h/2,w,h,Math.min(w,h)*.18);ctx.fill();
  ctx.save();rr(-w/2,-h/2,w,h,Math.min(w,h)*.18);ctx.clip();ctx.fillStyle=cm;
  [[.08,.22],[.36,.2],[.64,.24]].forEach(([a,b])=>{ctx.fillRect(-w/2,-h/2+h*a,w,h*b);});
  if(ck){ctx.strokeStyle='rgba(60,25,10,.55)';ctx.lineWidth=Math.max(3,w*.05);for(let i=-2;i<=2;i++)line(-w/2,i*h*.22-h*.1,w/2,i*h*.22+h*.1);}
  ctx.restore();ctx.restore();}
function grill(x,y,r,o={}){group(x,y,1,0,o.alpha??1,()=>{
  ctx.fillStyle='#2a2d36';ctx.beginPath();ctx.arc(0,0,r*1.08,0,7);ctx.fill();ctx.fillStyle='#14161c';ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(0,0,r*.96,0,7);ctx.clip();ctx.strokeStyle='#4a4f5c';ctx.lineWidth=Math.max(3,r*.03);for(let i=-10;i<=10;i++)line(i*r*.1,-r,i*r*.1,r);
  const g=ctx.createRadialGradient(0,0,r*.1,0,0,r);g.addColorStop(0,'rgba(255,120,40,.28)');g.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=g;ctx.fillRect(-r,-r,2*r,2*r);ctx.restore();
  const n=o.n??0;for(let i=0;i<n;i++){const a=i*2.4,rr0=r*.25+r*.45*((i*37%10)/10);meatSlice(Math.cos(a)*rr0,Math.sin(a)*rr0,r*.42,r*.2,{cooked:i%3!==0,rot:a*.7});}
});}
function plate(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{ctx.fillStyle='#e9edf3';ctx.beginPath();ctx.ellipse(0,0,120,46,0,0,7);ctx.fill();ctx.fillStyle='#cfd5df';ctx.beginPath();ctx.ellipse(0,0,92,32,0,0,7);ctx.fill();
  for(let i=0;i<3;i++)meatSlice(-50+i*50,-8+(i%2)*6,70,34,{rot:-.3+i*.25});});}
/* 손님 머리·몸 (위에서 비스듬히) */
function guest(x,y,s,col,al=1){group(x,y,s,0,al,()=>{ctx.fillStyle='#ffcf9f';ctx.beginPath();ctx.arc(0,-70,34,0,7);ctx.fill();ctx.fillStyle=col;rr(-40,-34,80,80,22);ctx.fill();});}
/* 동네 삼겹살집 외관 (상표 없음). o.ban: 현수막 문구, o.name */
function shopFront(x,y,s,o={}){group(x,y,s,0,o.alpha??1,()=>{
  ctx.fillStyle='#3a2f2a';rr(-400,-300,800,560,18);ctx.fill();
  ctx.fillStyle=o.sign||'#c0392b';rr(-400,-300,800,120,14);ctx.fill();
  text(o.name||'동네 삼겹살집',0,-238,{f:'D',s:66,c:'#fff'});
  const g=ctx.createLinearGradient(0,-130,0,240);g.addColorStop(0,'#ffe9c7');g.addColorStop(1,'#f3c78f');ctx.fillStyle=g;rr(-370,-130,740,370,10);ctx.fill();
  for(let b=0;b<3;b++){const bx=-240+b*240;ctx.fillStyle='#6b4b3a';rr(bx-90,120,180,24,8);ctx.fill();ctx.fillStyle='#1d1f26';ctx.beginPath();ctx.ellipse(bx,112,58,18,0,0,7);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;for(let i=0;i<3;i++){const sx=bx-20+i*20;ctx.beginPath();ctx.moveTo(sx,90);ctx.quadraticCurveTo(sx+14,60,sx,30);ctx.stroke();}}
  if(o.ban)banner(0,-30,.62,o.ban);
});}
/* 사람 점 (n명, 한 줄 cols개) */
function dots(x0,y0,n,cols,gap,col,t0){for(let i=0;i<n;i++){const k=t0==null?1:P(T,t0+i*.012,.15);if(k<=0)continue;ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x0+(i%cols)*gap,y0+Math.floor(i/cols)*gap*1.25,gap*.32,0,7);ctx.fill();rr(x0+(i%cols)*gap-gap*.3,y0+Math.floor(i/cols)*gap*1.25+gap*.36,gap*.6,gap*.5,gap*.2);ctx.fill();ctx.restore();}}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o2')){
      grill(520,560,260*E.back(P(a,0,.5))+1,{n:8});
      sojuBottle(900,760,1.1*E.back(P(a,.2,.4))+.001);
      const q=K('o1',0);
      if(q<0)group(1380,330,1,-.03,P(a,.3,.3),()=>{banner(0,0,1.15,'?');});
      else group(1380,330,lerp(1.4,1.15,E.out(P(q,0,.35))),-.03,1,()=>banner(0,0,1,'1,500원'));
      if(T>FR('o1',.75))pill('손님에겐 반가운 숫자',1380,600,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('o1',.75),.3)});
    }else if(T<CT('o3')){
      const b=L('o2');
      text('소주 한 병',960,180,{f:'D',s:64,c:C.gold,alpha:P(b,0,.3)});
      const base=700,bw=320;
      [['식당이 파는 값',1500,'1,500원',CT('o2')+.2,C.gold,640],['식당이 들여오는 값',1600,'1,500원 넘게',KT('o2',0),C.red,1280]].forEach(([l,v,lab,t,col,x])=>{ctx.fillStyle='rgba(255,255,255,.07)';rr(x-bw/2,base-420,bw,420,14);ctx.fill();
        if(T<t)text('?',x,base-200,{f:'D',s:90,c:C.gold});else{const k=E.out(P(T,t,.5)),h=v*.24*k;vCash(x-bw/2,base-h,bw,h,col);text(lab,x,base-v*.24-44,{f:'D',s:56,c:'#fff',alpha:k});}text(l,x,base+44,{s:34,w:900});});
      srcLine('아시아경제 2024.5.17 (한 고깃집 관리자: 주세를 생각하면 한 병에 1,500원 넘게 주고 들여온다)');
    }else if(T<CT('o4')){
      const b=L('o3');
      for(let i=0;i<5;i++)plate(380+(i%2)*60,660-i*70,.9,{alpha:P(b,.1+i*.12,.2)});
      drawMascot(1450,520,.95,'think',{alpha:P(b,0,.3)});
      group(1260,190,E.back(P(b,.2,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-470,-60,940,120,30);ctx.fill();text('고기를 많이 팔면 되겠지?',0,4,{s:46,w:900,c:C.ink});});
    }else if(T<CT('o5')){
      const b=L('o4');
      text('예시 고깃집 · 소주 5,000원일 때 사장님 몫',960,180,{f:'D',s:56,c:C.dim,alpha:P(b,0,.3),max:1800});
      big('o4',0,960,340,'한 달 729만 원',{f:'D',s:130,c:C.green,glow:'rgba(53,224,138,.45)'});
      const t=FR('o4',.62);if(T>t){const k=E.out(P(T,t,.8)),X=260,Wd=1400,y=600;
        ctx.fillStyle='#3fbf7f';rr(X,y-60,Wd*459/729*k,120,18);ctx.fill();ctx.fillStyle='#E8A33A';rr(X+Wd*459/729*k+6,y-60,Wd*270/729*k,120,18);ctx.fill();
        text('소주에서 459만',X+Wd*459/729/2,y+4,{f:'D',s:52,c:'#0d2a1a',alpha:k});text('고기·식사 270만',X+Wd*(459+270/2)/729,y+4,{f:'D',s:40,c:'#2a1a05',alpha:k,max:Wd*270/729-20});
        sojuBottle(X-60,y+80,.45,{alpha:k});}
      srcLine('예시 가정 · 계산은 아래 장에서');
    }else if(T<CT('o6')){
      const b=L('o5');
      text('소주를 1,500원으로 내리면 (손님 그대로)',960,180,{f:'D',s:58,c:C.gold,alpha:P(b,0,.3),max:1800});
      text('729만',560,400,{f:'D',s:110,c:C.dim});text('→',880,400,{f:'D',s:100,c:C.dim});big('o5',0,1300,400,'256만 원',{f:'D',s:140,c:C.red,glow:'rgba(255,77,77,.45)'});
      if(T>FR('o5',.6))group(960,660,1,0,P(T,FR('o5',.6),.3),()=>{panel(-620,-80,1240,160,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('사장님 시급 7,125원  <  최저시급 1만 320원',0,4,{f:'D',s:54,c:'#ffb3b3',max:1180});});
    }else if(T<CT('o7')){
      const b=L('o6');
      shopFront(520,500,.62,{ban:'1,500원',alpha:P(b,0,.3)});shopFront(1400,500,.62,{ban:'1,500원',name:'옆집 고깃집',sign:'#2c5aa0',alpha:P(T,FR('o6',.15),.3)});
      const q=K('o6',0);if(q>=0)stampBox('손님은 그대로 · 술값만 사라진다',960,820,q,{s:56,c:C.red,bg:'rgba(40,0,0,.9)'});
    }else{
      const k9=L('o7'),k10=L('o8');
      text('술값을 내리기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:76,c:C.gold,alpha:P(k9,0,.3),max:1800});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['소주 가격·물가 (보도·통계청)','매출 숫자 (언론 보도)','가게 숫자 = 예시 가정'].forEach((s,i)=>{const k=P(k10,.5+i*.5,.3);if(k>0)pill(s,400+i*560,760,{s:32,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o9');
    text('소주 1,500원 고깃집 계산서',960,250,{f:'D',s:130,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3),max:1750});
    text('고깃집 이익은 어디에 들어 있었을까',960,400,{s:56,w:900,alpha:P(a,.3,.3)});
    shopFront(700,730,.5,{ban:'1,500원',alpha:P(a,.2,.3)});sojuBottle(1120,840,.9,{alpha:P(a,.3,.3)});drawMascot(1420,720,.8,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p2',()=>{shopFront(560,500,.85);
      if(L('p2')>=0){text('테이블 12개 · 동네 삼겹살집',1380,300,{f:'D',s:52,c:C.gold});
        ['직원 셋 + 사장님','저녁 장사','하루 손님 60명'].forEach((s,i)=>pill(s,1380,420+i*100,{s:40,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p2',.3+i*.15),.3)}));
        text('예시 가정',1380,720,{s:36,w:900,c:C.dim,alpha:P(L('p2'),1,.3)});}});
    sub('p3','p3',()=>{text('손님 한 사람이 고기와 식사로 쓰는 돈',960,170,{f:'D',s:54,c:C.gold});
      const base=720,bw=320,sc=.017;
      [['예시 가게 (고기 + 식사)',20000,'2만 원',KT('p3',0),C.gold,640],['서울 삼겹살 1인분 200g (2026.4)',21321,'2만 1,321원',FR('p3',.6),C.red,1280]].forEach(([l,v,lab,t,col,x])=>{ctx.fillStyle='rgba(255,255,255,.07)';rr(x-bw/2,base-420,bw,420,14);ctx.fill();
        if(T<t)text('?',x,base-200,{f:'D',s:80,c:C.gold});else{const k=E.out(P(T,t,.6));vCash(x-bw/2,base-v*sc*k,bw,v*sc*k,col);text(lab,x,base-v*sc-40,{f:'D',s:50,c:'#fff',alpha:k});}text(l,x,base+40,{s:30,w:900,max:520});});
      srcLine('한국소비자원 참가격 (아주경제 2026.6.1 인용) · 예시 가게 금액은 가정');});
    sub('p4','p5',()=>{
      const tx=760,ty=520;ctx.fillStyle='#6b4b3a';rr(tx-380,ty-150,760,300,30);ctx.fill();grill(tx,ty,110,{n:6});
      [[-260,-210],[260,-210],[-260,270],[260,270]].forEach(([dx,dy],i)=>guest(tx+dx,ty+dy,1,['#4fb6ff','#ff9f43','#b18cff','#35e08a'][i]));
      for(let i=0;i<3;i++)sojuBottle(tx-150+i*150,ty+120,.55,{alpha:P(L('p4'),.4+i*.25,.3)});
      text('손님 넷이 소주 세 병',1480,300,{f:'D',s:56});
      const q=K('p4',0);text('한 사람',1480,430,{s:40,w:900,c:C.dim});text(q>=0?'4분의 3병':'?',1480,530,{f:'D',s:90,c:C.gold,alpha:q>=0?P(q,0,.3):1});
      if(L('p5')>=0){group(1480,720,1,0,P(L('p5'),0,.3),()=>{panel(-330,-80,660,160,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text('소주 한 병',0,-30,{s:34,w:900,c:C.dim});text('5,000원',0,34,{f:'D',s:64,c:C.gold});});
        srcLine('데일리안 2024.1.17 (서울 무교동 식당가 대부분 5,000~6,000원) · 마시는 양은 예시 가정');}});
    sub('p6','p6',()=>{text('예시 고깃집 한 달',960,180,{f:'D',s:60,c:C.gold});
      text('하루 60명 × 30일 = 1,800명',960,300,{f:'D',s:54,c:C.dim});
      group(960,560,1,0,1,()=>{ctx.fillStyle='#fbf7ee';rr(-420,-200,840,400,20);ctx.fill();text('한 사람 계산서',0,-150,{s:34,w:900,c:'#6b5b45'});
        text('고기 · 식사',-360,-70,{a:'left',s:40,w:900,c:C.ink});text('20,000',360,-70,{a:'right',f:'D',s:44,c:C.ink});
        text('소주 4분의 3병',-360,10,{a:'left',s:40,w:900,c:C.ink});text('3,750',360,10,{a:'right',f:'D',s:44,c:'#1f8f4e'});
        ctx.fillStyle='#c9bfa9';ctx.fillRect(-360,60,720,4);const q=K('p6',0);text('합계',-360,125,{a:'left',f:'D',s:48,c:C.ink});text(q>=0?'23,750원':'?',360,125,{a:'right',f:'D',s:60,c:'#d62f2f'});});
      pill('세금 제외',1560,560,{s:34,bg:'rgba(255,255,255,.92)',alpha:P(T,FR('p6',.8),.3)});});
    sub('p7','p7',lt=>{const k=E.out(P(lt,.2,.8));ctx.fillStyle='rgba(255,255,255,.12)';rr(160,380,1600*k,160,20);ctx.fill();ctx.strokeStyle=C.gold;ctx.lineWidth=5;rr(160,380,1600*k,160,20);ctx.stroke();
      text('2만 3,750원 = 막대 하나',960,250,{f:'D',s:72,c:C.gold,alpha:P(lt,.6,.4)});text('여기에 비용을 칠한다',960,680,{s:44,w:900,c:C.dim,alpha:P(lt,1.2,.4)});});
  }},
  /* ── 2만 3,750원 쪼개기 ── */
  cut:{draw(){
    const X=160,Wd=1600,y=300,h=170;
    ctx.fillStyle='rgba(255,255,255,.12)';rr(X,y-h/2,Wd,h,20);ctx.fill();
    let acc=0;const labs=[];
    LY.forEach((s,i)=>{const t=T-layT(s.k);const w=s.v/PRICE*Wd;if(t>=0){const f=E.out(P(t,0,.7));ctx.fillStyle=s.col;rr(X+acc+2,y-h/2,Math.max(2,w*f-4),h,12);ctx.fill();if(f>.3)labs.push({s,i,xm:X+acc+w/2,w,al:P(t,0,.3)});}acc+=w;});
    ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=3;rr(X,y-h/2,Wd,h,20);ctx.stroke();
    labs.forEach(({s,i,xm,w,al})=>{const yy=y+h/2+50+(i%2)*84;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=s.col;ctx.lineWidth=3;line(xm,y+h/2,xm,yy-30);ctx.restore();
      text(s.name,xm,yy-6,{s:28,w:900,c:s.col,alpha:al});text(won(s.v)+'원',xm,yy+32,{f:'D',s:32,c:s.k==='own'?C.green:'#fff',alpha:al});
      text(won(s.v),xm,y+4,{f:'D',s:w>120?40:26,c:'#101420',alpha:al,max:w-10});});
    text('한 사람 2만 3,750원',X,y-h/2-36,{a:'left',f:'D',s:40,c:C.gold});
    // s8: 사장님 몫 안에서 소주가 남긴 2,550원
    if(L('s8')>=0){const ox=X+(PRICE-4050)/PRICE*Wd,sw=2550/PRICE*Wd,q=K('s8',0);if(q>=0){const k=E.out(P(q,0,.5));ctx.save();ctx.fillStyle='#1f8f4e';rr(ox+2,y-h/2,sw*k,h,12);ctx.fill();ctx.fillStyle=LYK.own.col;rr(ox+sw+2,y-h/2,(4050-2550)/PRICE*Wd-4,h,12);ctx.fill();ctx.restore();text('2,550',ox+sw/2,y+4,{f:'D',s:34,c:'#fff',alpha:k});text('1,500',ox+sw+(1500/PRICE*Wd)/2,y+4,{f:'D',s:28,c:'#101420',alpha:k});
      group(ox+sw/2,y-h/2-36,1,0,P(q,0,.3),()=>{ctx.fillStyle='#1f8f4e';rr(-170,-30,340,60,14);ctx.fill();text('소주에서 2,550원',0,3,{f:'D',s:32,c:'#fff'});});}}
    const Y=740;
    sub('s1','s1',()=>{text('첫 번째: 고기 · 반찬 재료비',960,Y-90,{f:'D',s:54,c:LYK.food.col});text('음식값 2만 원 × 40% (예시)',960,Y-10,{s:36,w:900});popText(KT('s1',0),960,Y+75,'8,000원',{f:'D',s:80,c:LYK.food.col});});
    sub('s2','s2b',()=>{text('두 번째: 소주 매입값',960,Y-90,{f:'D',s:54,c:LYK.soju.col});
      if(L('s2b')<0){text('한 병 1,600원 (예시) × 4분의 3병',960,Y-10,{s:36,w:900});popText(KT('s2',0),960,Y+75,'1,200원',{f:'D',s:80,c:LYK.soju.col});}
      else{text('식당 매입가: 2023년 1,600~1,800원 · 2024년 "1,500원 넘게"',960,Y-10,{s:36,w:900,max:1700});text('1,200원',960,Y+75,{f:'D',s:80,c:LYK.soju.col});srcLine('데일리안 2023.3.7 · 매일경제 2023.11.2 (1,600~1,700원) · 아시아경제 2024.5.17 · 1,600원은 예시 가정');}});
    sub('s3','s3',()=>{text('세 번째: 인건비',960,Y-90,{f:'D',s:54,c:LYK.labor.col});text('직원 셋 한 달 990만 ÷ 1,800명 (예시)',960,Y-10,{s:36,w:900});popText(KT('s3',0),960,Y+75,'5,500원',{f:'D',s:80,c:LYK.labor.col});});
    sub('s4','s4',()=>{text('네 번째: 월세 · 관리비',960,Y-90,{f:'D',s:54,c:LYK.rent.col});text('한 달 360만 ÷ 1,800명 (예시)',960,Y-10,{s:36,w:900});popText(KT('s4',0),960,Y+75,'2,000원',{f:'D',s:80,c:LYK.rent.col});});
    sub('s5','s5',()=>{text('다섯 번째: 숯 · 가스 · 전기 · 카드 수수료',960,Y-90,{f:'D',s:52,c:LYK.etc.col});text('한 달 540만 ÷ 1,800명 (예시)',960,Y-10,{s:36,w:900});popText(KT('s5',0),960,Y+75,'3,000원',{f:'D',s:80,c:'#fff'});});
    sub('s6','s6',()=>{text('23,750 − 8,000 − 1,200 − 5,500 − 2,000 − 3,000',960,Y-90,{f:'D',s:42,c:C.dim});text('사장님 몫',960-270,Y+20,{f:'D',s:56,c:C.green});big('s6',0,960+140,Y+20,'4,050원',{f:'D',s:110,c:C.green,glow:'rgba(53,224,138,.45)'});});
    sub('s7','s7',()=>{text('한 달 (1,800명)',960-420,Y-60,{f:'D',s:44,c:C.dim});big('s7',0,960-420,Y+40,'729만 원',{f:'D',s:96,c:C.green,glow:'rgba(53,224,138,.45)'});
      text('하루 12시간 × 30일 = 360시간',960+400,Y-60,{s:36,w:900,c:C.dim,alpha:P(T,FR('s7',.55),.3)});text('시급 2만 250원',960+400,Y+30,{f:'D',s:68,c:C.gold,alpha:P(T,FR('s7',.75),.3)});});
    sub('s8','s8',()=>{text('소주 4분의 3병이 남긴 돈 = (5,000 − 1,600) × 0.75',960,Y-60,{s:38,w:900,c:C.dim});const q=K('s8',0);
      text(q>=0?'2,550원':'?',960-260,Y+50,{f:'D',s:90,c:'#3fbf7f'});if(T>FR('s8',.7))stampBox('사장님 몫의 63%',960+300,Y+50,T-FR('s8',.7),{s:60,c:C.gold,bg:'rgba(40,30,0,.9)'});});
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('×'),done=typed.endsWith('=');
    let small='',bigS='0';if(done){small=`${n1} × ${n2.replace('=','')} =`;bigS='4,590,000';}else if(n2!==undefined){small=`${n1} ×`;bigS=n2||n1;}else if(n1)bigS=n1;
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(bigS,225,-310,{a:'right',s:done?84:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('한 달 소주 1,350병',1350,250,{f:'D',s:56,c:C.gold,alpha:P(a,.2,.3),max:1000});text('× 한 병에 남는 돈 5,000 − 1,600 = 3,400원',1350,345,{s:36,w:900,alpha:P(a,.4,.3),max:1000});
    if(dt>=0){
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{const c2=L('c2');group(1350,520,1,0,P(c2,0,.3),()=>{panel(-470,-80,940,160,{bg:'rgba(6,13,32,1)',bd:'#3fbf7f',lw:5});text('술로 남는 돈 (한 달)',0,-30,{s:36,w:900,c:C.dim});const q=K('c2',0);text(q>=0?'459만 원':'?',0,32,{f:'D',s:60,c:'#3fbf7f'});});
        if(L('c3')>=0){const q=K('c3',0);group(1350,690,lerp(1.5,1,E.out(P(Math.max(0,q),0,.3))),0,1,()=>text(q>=0?'고기·식사만으로는 270만 원':'고기·식사만으로는 ?',0,0,{f:'D',s:54,c:C.red,glow:'rgba(255,77,77,.4)',max:1000}));
          if(T>FR('c3',.45))stampBox('고기로 문을 열고, 술로 월급을',1350,840,T-FR('c3',.45),{s:44,c:C.green,bg:'rgba(0,40,20,.9)'});}}}
    if(dt>=0)group(1180,150,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 소주 한 병이 남기던 돈 ── */
  bottle:{draw(){
    sub('b1','b1',lt=>{sojuBottle(620,820,2*E.back(P(lt,0,.5))+.001);text('소주 한 병은',1300,330,{f:'D',s:90,c:C.gold});text('원래 얼마나 남겼을까?',1300,470,{f:'D',s:70});drawMascot(1700,780,.6,'think',{alpha:P(lt,.5,.3)});});
    sub('b2','b3',()=>{text('소주 한 병 값이 식탁까지 오는 길 (2023년 보도)',960,165,{f:'D',s:50,c:C.gold,max:1800});
      const base=700,bw=300,sc=.07;
      [['출고가 (세금 포함)',1200,'1,100~1,200원대',CT('b2')+.5,'#4fb6ff',420,'b2'],['도매 → 식당',1550,'1,400원대 중반~1,500원대 후반',KT('b2',0),C.orange,960,'b2'],['식당 판매가',6000,'6,000원',CT('b3')+.2,C.gold,1500,'b3']].forEach(([l,v,lab,t,col,x,id])=>{
        if(L(id)<0||T<t){text('?',x,base-150,{f:'D',s:70,c:C.gold});text(l,x,base+40,{s:30,w:900});return;}const k=E.out(P(T,t,.6));vCash(x-bw/2,base-v*sc*k,bw,v*sc*k,col);text(lab,x,base-v*sc-40,{f:'D',s:v>5000?54:30,c:'#fff',alpha:k,max:520});text(l,x,base+40,{s:30,w:900});});
      const q=K('b3',0);if(q>=0)stampBox('한 병에 4,400원 남는다',800,330,q,{s:48,c:C.green,bg:'rgba(0,40,20,.9)'});
      srcLine('머니투데이 2023.2.24 (시중 음식점·주류업계 가격 취합)');});
    sub('b4','b4',()=>{text('2014년 → 2023년 (같은 기사)',960,170,{f:'D',s:56,c:C.gold});
      text('식당 소주',560,360,{a:'right',f:'D',s:50});hbar(600,360,800,100,66.7,80,C.red,'+66.7%  (3,000 → 5,000원)',{s:40,k:E.out(P(T,KT('b4',0),.6))});if(K('b4',0)<0)text('?',700,360,{f:'D',s:60,c:C.gold});
      text('공장 출고가',560,520,{a:'right',f:'D',s:50,c:C.dim});hbar(600,520,800,100,21.3,80,'#4fb6ff','+21.3%',{s:46,k:E.out(P(T,FR('b4',.75),.6))});
      srcLine('데일리안 2023.3.7 (출고가: 대표 소주 961.7원 → 1,166.6원, 세금 포함)');});
    sub('b5','b5',()=>{text('2024년 1월 출고분부터 · 세금 계산 방식 변경',960,170,{f:'D',s:52,c:C.gold});
      sojuBottle(560,700,1.3);text('대표 소주 출고가',1250,340,{s:40,w:900,c:C.dim});text('1,247원',1050,470,{f:'D',s:80,c:C.dim});text('→',1250,470,{f:'D',s:70,c:C.dim});big('b5',0,1470,470,'1,115원',{f:'D',s:90,c:'#4fb6ff'});
      if(T>FR('b5',.8))pill('−10.6% (예상치로 보도)',1250,620,{s:38,bg:'rgba(200,230,255,.95)'});
      srcLine('아주경제 2023.12.19 (국산 소주 기준판매비율 22% 적용)');});
    sub('b6','b6',lt=>{group(960,340,1,0,1,()=>{ctx.fillStyle='#fff';rr(-760,-120,1520,240,30);ctx.fill();ctx.beginPath();ctx.moveTo(-200,120);ctx.lineTo(-240,190);ctx.lineTo(-120,120);ctx.fill();
        text('"재룟값이 올라도 음식값을 안 올리고',0,-36,{s:48,w:900,c:C.ink,max:1460});text('버틸 수 있었던 것" — 술 매출 덕분',0,44,{s:48,w:900,c:C.ink,max:1460});});
      stampBox('소주 = 고깃집에서 가장 많이 남는 메뉴',960,700,lt-1.5,{s:56,c:C.gold,bg:'rgba(40,30,0,.9)'});
      srcLine('매일경제 2023.11.2 (한 자영업자 인터뷰)');});
  }},
  /* ── 1,500원 소주의 계산 ── */
  cheap:{draw(){
    sub('q1','q1',lt=>{const q=K('q1',0);group(960,400,q>=0?lerp(1.5,1.3,E.out(P(q,0,.35))):1.2,-.03,1,()=>banner(0,0,1,q>=0?'1,500원':'?'));text('이 값에 팔면?',960,720,{f:'D',s:72,alpha:P(lt,1,.3)});});
    sub('q2','q3',()=>{text('2024년 5월 · 동네 식당가 현수막',960,165,{f:'D',s:54,c:C.gold});
      [['서울 동작·양천',420],['인천',960],['경기',1500]].forEach(([l,x],i)=>{banner(x,370,.7,i===1?'2,000원':'1,500원',{rot:(i-1)*.04,alpha:P(T,CT('q2')+.4+i*.4,.3)});text(l,x,520,{s:36,w:900,alpha:P(T,CT('q2')+.4+i*.4,.3)});});
      if(L('q3')>=0){group(960,700,1,0,P(L('q3'),0,.3),()=>{ctx.fillStyle='#fff';rr(-760,-80,1520,160,30);ctx.fill();text('"한 병에 1,500원 넘게 주고 들여와',0,-26,{s:40,w:900,c:C.ink});const q=K('q3',0);text(q>=0?'남는 게 거의 없다" — 한 고깃집 관리자':'…',0,34,{s:40,w:900,c:'#d62f2f'});});}
      srcLine('아시아경제 2024.5.17 (소주·맥주 1,500~2,000원)');});
    sub('q4','q4',()=>{text('예시 가게 소주 한 병',960,170,{f:'D',s:60,c:C.gold});
      text('사 오는 값',560,360,{a:'right',f:'D',s:50});hbar(600,360,1000,100,1600,1800,C.red,'1,600원',{s:50});
      text('파는 값',560,500,{a:'right',f:'D',s:50});hbar(600,500,1000,100,1500,1800,C.gold,'1,500원',{s:50});
      big('q4',0,960,700,'한 병에 −100원',{f:'D',s:96,c:C.red,glow:'rgba(255,77,77,.4)'});});
    sub('q5','q6',()=>{text('손님이 그대로일 때',960,165,{f:'D',s:56,c:C.gold});
      const rows=[['한 사람 몫','4,050원','1,425원','q5'],['한 달','729만 원','256만 5,000원','q6']];
      rows.forEach(([l,a1,b1,id],i)=>{if(L(id)<0)return;const y=330+i*170;text(l,420,y,{a:'right',f:'D',s:50,c:C.dim});text(a1,700,y,{f:'D',s:66,c:C.dim});text('→',980,y,{f:'D',s:60,c:C.dim});big(id,0,1360,y,b1,{f:'D',s:84,c:C.red,glow:'rgba(255,77,77,.4)'});});
      if(L('q6')>=0&&T>FR('q6',.45)){const k=P(T,FR('q6',.45),.3);group(960,720,1,0,k,()=>{panel(-700,-100,1400,200,{bg:'rgba(6,13,32,1)',bd:C.red,lw:4});
        text('사장님 시급',-560,-38,{a:'left',s:34,w:900,c:C.dim});hbar(-560,26,700,56,7125,11000,C.red,'7,125원',{s:40});
        ctx.strokeStyle=C.gold;ctx.lineWidth=5;const mx=-560+700*10320/11000;line(mx,-20,mx,72);text('최저시급 1만 320원',mx,-46,{s:30,w:900,c:C.gold});});}});
    sub('q7','q8',()=>{text('원래 몫(729만)으로 돌아가려면',960,165,{f:'D',s:56,c:C.gold});
      text('지금 하루',300,300,{f:'D',s:44,c:C.dim});dots(120,370,60,15,44,'#9aa4b8',CT('q7'));text('60명',300,690,{f:'D',s:56});
      text('필요한 하루',1300,300,{f:'D',s:44,c:C.dim});const q=K('q7',0);if(q>=0){dots(1000,370,60,15,44,'#9aa4b8');dots(1000+0,370+44*1.25*4,13,15,44,C.red,KT('q7',0));text('73명 (+22%)',1300,690,{f:'D',s:60,c:C.red,alpha:P(q,0,.3)});}else text('?',1300,470,{f:'D',s:100,c:C.gold});
      if(L('q8')>=0){group(960,800,1,0,P(L('q8'),0,.3),()=>{panel(-700,-60,1400,120,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('본전 하루 손님: 소주 5,000원 43명 →',-140,4,{s:40,w:900,max:1000});const r=K('q8',0);text(r>=0?'1,500원 53명':'?',470,4,{f:'D',s:52,c:C.red});});}});
  }},
  /* ── 옆집도 내리면 (반전) ── */
  war:{draw(){
    sub('w1','w1',lt=>{shopFront(560,500,.7,{ban:'5,000원'});const q=K('w1',0);shopFront(1360,500,.7,{name:'옆집 고깃집',sign:'#2c5aa0',ban:q>=0?'1,500원':'5,000원',alpha:P(lt,.3,.3)});
      if(q>=0)popText(q,1360,140,'옆집',{f:'D',s:80,c:C.red});});
    sub('w2','w3',()=>{text('외식 소주 물가 (1년 전 대비)',960,170,{f:'D',s:56,c:C.gold});
      text('2025년 3월',560,330,{f:'D',s:50,c:C.dim});big('w2',0,560,470,'−1.3%',{f:'D',s:150,c:C.red,glow:'rgba(255,77,77,.4)'});
      if(T>FR('w2',.8))pill('7개월 연속 하락',560,620,{s:40,bg:'rgba(255,190,190,.95)'});
      if(L('w3')>=0)group(1360,450,1,0,P(L('w3'),0,.3),()=>{panel(-400,-200,800,400,{bd:'rgba(255,255,255,.3)'});text('2000년 이후 내린 적',0,-120,{s:38,w:900,c:C.dim});text('2005년 7월',0,-20,{f:'D',s:64});text('한 번뿐',0,80,{f:'D',s:64,c:C.gold});});
      srcLine('통계청 2025년 3월 소비자물가 동향 (SBS Biz 2025.4.6 인용)');});
    sub('w4','w4',()=>{text('소주·맥주 2,000원을 내건 한 고깃집 프랜차이즈',960,170,{f:'D',s:52,c:C.gold,max:1800});
      for(let i=0;i<33;i++){const k=P(T,CT('w4')+.3+i*.05,.2);if(k<=0)continue;const r=Math.floor(i/11);ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=r?C.red:'#4fb6ff';rr(300+(i%11)*120,300+r*125+(r?30:0),90,100,12);ctx.fill();ctx.fillStyle='#fff';rr(310+(i%11)*120,310+r*125+(r?30:0),70,24,6);ctx.fill();ctx.restore();}
      text('1년여 전',260,350,{a:'right',s:30,w:900,c:C.dim});text('지금',260,540,{a:'right',s:30,w:900,c:C.dim});
      big('w4',0,960,770,'220곳+ (1년여 만에 두 배 넘게)',{f:'D',s:66,c:C.red});
      srcLine('SBS Biz 2025.4.6 · 그림 한 칸은 상징 (실제 칸 수 아님) · 브랜드 이름은 쓰지 않음');});
    sub('w5','w8',()=>{text('같은 길, 고깃집 두 곳 · 한 달 남는 돈 (예시)',960,160,{f:'D',s:50,c:C.gold});
      text('우리 가게',900,240,{f:'D',s:36});text('옆집',1450,240,{f:'D',s:36,c:'#8fb8ff'});
      const rows=[['둘 다 5,000원',729,729,'w8',CT('w8')+.2,CT('w8')+.2],['우리만 1,500원',686,205,'w5',KT('w5',0),KT('w6',0)],['둘 다 1,500원',256,256,'w7',KT('w7',0),KT('w7',0)]];
      rows.forEach(([l,a1,b1,id,ta,tb],i)=>{const y=330+i*150;if(L(id)<0)return;text(l,600,y,{a:'right',f:'D',s:40,c:i===2?'#ffb3b3':'#fff'});
        [[a1,ta,680],[b1,tb,1230]].forEach(([v,t,x],j)=>{if(T<t-.05){text('?',x+60,y,{f:'D',s:50,c:C.gold});return;}const k=E.out(P(T,t,.5));const col=v>=600?C.green:v>=250?C.orange:C.red;ctx.fillStyle=col;rr(x,y-32,v*.36*k,64,14);ctx.fill();text(won(v)+'만',x+v*.36*k+14,y+2,{a:'left',f:'D',s:40,c:col,alpha:k});});});
      if(L('w8')>=0){const q=K('w8',0);if(q>=0)stampBox('손님은 그대로 · 473만 원씩 술값만 사라졌다',960,800,q,{s:46,c:C.red,bg:'rgba(40,0,0,.92)'});}
      else srcLine('예시 가정 · 우리만 내리면 옆집 손님 일부가 넘어와 우리 +20%, 옆집 −20%');});
    sub('w9','w9',lt=>{text('지난해 2분기 술집 매출 (1년 전 대비)',960,190,{f:'D',s:56,c:C.gold});text('−9.2%',960,380,{f:'D',s:170,c:C.red,glow:'rgba(255,77,77,.4)',alpha:P(lt,.3,.3)});
      stampBox('싼 술값으로 손님 모아도 결국 적자 싸움',960,640,lt-1.5,{s:50,c:C.red,bg:'rgba(40,0,0,.9)'});
      srcLine('한국신용데이터 2025년 2분기 소상공인 동향 (경북매일 2025.8.19 인용)');});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('소주 1,500원 예시 가게 한 달 남는 돈 · 하나씩만 바꿔 보면',960,165,{f:'D',s:44,c:C.gold,alpha:P(a,0,.3),max:1800});
    if(T<CT('l2'))text('바꿀 수 있는 숫자는?',960,500,{f:'D',s:90,alpha:P(a,.2,.3)});
    const rows=[['지금 (소주 1,500원)',256.5,'l1','256만'],['소주 2,000원으로',324,'l2','324만'],['음식값 +1,000원',364.5,'l3','364만'],['손님 +10%',471,'l4','471만'],['고깃값 +3%',213.3,'l5','213만'],['손님 −10%',41.85,'l6','42만']];
    const Z=560,SCL=2.0;
    ctx.save();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;if(T>=CT('l1')+1)line(Z,215,Z,740);ctx.restore();
    if(T>=CT('l2')){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(Z+256.5*SCL,215,Z+256.5*SCL,740);ctx.restore();}
    rows.forEach(([l,v,id,lab],i)=>{const t=i?CT(id):CT('l1')+1.2;if(T<t-.1)return;const y=255+i*92,tk=i?KT(id,0):t,k=E.out(P(T,tk,.6));const bad=id==='l5'||id==='l6';text(l,60,y,{a:'left',s:34,w:900,max:480,c:bad?'#ffb3b3':'#fff'});
      if(T<tk){text('?',Z+60,y,{f:'D',s:56,c:C.gold});return;}
      const w=Math.max(6,v*SCL*k),col=bad?C.red:i===0?'#5b6275':C.green;ctx.fillStyle=col;rr(Z,y-30,w,60,14);ctx.fill();
      text(lab,Z+w+18,y+2,{a:'left',f:'D',s:46,c:col==='#5b6275'?'#c9ced9':col,alpha:k});});
    if(L('l5b')>=0&&L('l6')<0)srcLine('국내산 삼겹살 소비자 가격 100g 2,910원, 1년 새 +3.0% (축산유통정보 다봄 · 헤럴드경제 2026.10.26) · 예시: 재료비 전체 +3%');
    sub('l7','l7',()=>{group(960,820,1,0,1,()=>{panel(-760,-50,1520,100,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:4});text('술값을 내린 가게 = 손님 수 한 줄에 모든 걸 거는 가게',0,4,{f:'D',s:38,c:C.gold,max:1480});});});
    if(L('l7')<0&&L('l5b')<0&&T>=CT('l2'))srcLine('예시 계산 · 한 번에 하나씩 · 만 원 아래 버림',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('k1'),ov=L('k7');
    text('술값을 내리기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['k2','사장님 몫 중 술의 비중','한 병 마진 × 한 달 병 수 ÷ 내 몫','오늘 가게: 63%'],['k3','한 병 매입값','거래명세서 · 세금 · 공병까지','오늘 가게: 1,600원 (예시)'],['k4','더 와야 하는 손님 수','줄어든 술 마진 ÷ 손님 한 명 몫','오늘 가게: 하루 60 → 73명'],
      ['k5','옆집의 다음 수','옆집도 내리면 손님은 돌아간다','둘 다 내리면 둘 다 256만'],['k6','되돌릴 수 있는 값인가','1,500원을 본 손님에게 5,000원','한 번 내리면 올리기 어렵다']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:36,max:450});text(f,-250,0,{a:'left',s:28,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-760,-280,1520,540,{bg:'rgba(6,13,32,1)',bd:C.gold});text('음식 1만 8,000원 · 원가 40% · 소주 반 병 (2,000원에 팔고 1,600원에 사 옴)',0,-200,{f:'D',s:38,max:1440});text('한 달 고정비 1,500만 원 → 하루 몇 명이 와야 본전?',0,-140,{f:'D',s:38,max:1440});
      const b=L('k7b');text('손님 한 명 몫: 1만 800원 + 소주 200원 = 1만 1,000원',0,-50,{f:'D',s:44,c:b>=0?C.gold:'#fff',alpha:b>=0?1:0,max:1440});const k=K('k7b',0);
      if(k>=0){text('1,500만 ÷ 1만 1,000원 = 한 달 1,364명',0,50,{f:'D',s:54,alpha:P(k,0,.3)});text('하루 약 46명',0,150,{f:'D',s:96,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});}else text('?',0,90,{f:'D',s:120,c:C.gold});
      if(L('k7c')>=0)text('술값 계산서는 길 건너 가게까지 같이 봐야 끝난다',0,232,{s:34,w:900,alpha:P(L('k7c'),0,.3)});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('한 사람 2만 3,750원',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      const X=160,Wd=1600,y=380,h=150,s=Wd/PRICE,k=E.out(P(L('z2'),0,5));let xx=X;
      LY.forEach((o,i)=>{const w=o.v*s,kk=clamp(k*LY.length-i);if(kk<=0){xx+=w;return;}ctx.fillStyle=o.col;rr(xx,y-h/2,Math.max(2,w*kk-3),h,10);ctx.fill();if(kk>.5){text(won(o.v),xx+w/2,y+2,{f:'D',s:w>150?46:30,c:'#101420',max:w-10});text(o.name,xx+w/2,y+110+(w<150&&i%2?44:0),{s:w>150?30:24,w:900,c:o.k==='own'?C.green:'rgba(255,255,255,.85)',max:Math.max(w-8,70)});}xx+=w;});
      if(T>FR('z2',.85)){const ox=X+(PRICE-4050)*s;ctx.fillStyle='rgba(31,143,78,.95)';rr(ox,y-h/2,2550*s,h,10);ctx.fill();ctx.fillStyle=LYK.own.col;rr(ox+2550*s+3,y-h/2,1500*s-3,h,10);ctx.fill();text('2,550',ox+2550*s/2,y+2,{f:'D',s:36,c:'#fff'});}
      const b=L('z2b');if(b>=0)group(960,720,1,0,P(b,0,.3),()=>{ctx.fillStyle='#fff';rr(-660,-90,1320,180,30);ctx.fill();text('소주 1,500원: 한 달 729만 → 256만 원',0,-28,{f:'D',s:46,c:'#d62f2f',max:1260});text('옆집도 내리면 손님은 그대로, 술값만 사라진다',0,42,{s:38,w:900,c:C.ink,max:1260});});
    }else{
      sojuBottle(960,560,1.3);grill(560,450,150,{n:6});
      stampBox('이익은 소주병에 들어 있었다',960,760,c,{s:72,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1440,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-380,-70,760,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 소주 한 병 얼마에 들여오세요?',0,4,{s:34,w:900,c:C.ink,max:720});});
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
