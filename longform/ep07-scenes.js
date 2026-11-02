/* ════════════════════════════════════════════════════════════════════
   장면 (LF.07 스터디카페 계산서) — 수치·출처는 docs/longform-ep07.md
   중심 그림: 한 달 매출 1,225만 원 = 좌석 70석(한 석 17만 5천 원). 가져가는 순서대로 좌석이 물든다. 사장님 몫은 마지막 10석.
   ════════════════════════════════════════════════════════════════════ */
const CO=[ // 가져가는 순서 (한 달, 만 원)
  {k:'rent',name:'임대료',ic:'🏢',v:510,col:'#FF9F43'},
  {k:'util',name:'전기·냉난방',ic:'💡',v:120,col:'#FFE066'},
  {k:'clean',name:'청소·관리',ic:'🧹',v:100,col:'#6FD3FF'},
  {k:'kiosk',name:'키오스크·보안',ic:'🧾',v:70,col:'#B18CFF'},
  {k:'inter',name:'인테리어(상각)',ic:'🛋️',v:250,col:'#8e98ad'},
  {k:'boss',name:'사장님 몫',ic:'🧑‍💼',v:175,col:'#35E08A'},
];
const SEQ=['1','2','2','5','00','00','−','1','0','5','00','00','0','='];   // 12,250,000 − 10,500,000 (0 개수: 8자리 − 8자리)
function seatT(k){return {rent:KT('s2',0),util:KT('s3',0),clean:KT('s4',0),kiosk:KT('s5',0),inter:KT('s6',0),boss:KT('s8',0)}[k];}
function sub(a,b,fn){const t0=CT(a)-.15,t1=nextStart(IDX[b]);if(T<t0||T>t1+.3)return;const al=P(T,t0,.3)*(1-P(T,t1,.3));if(al<=0)return;ctx.save();ctx.globalAlpha*=al;fn(T-t0);ctx.restore();}
function srcLine(s,y=872,x=960){text(s,x,y,{s:22,w:700,c:C.dim});}
function srcLineR(s){srcLine(s,872,1340);}
function hbar(x,y,w,h,v,max,col,label,o={}){ctx.fillStyle='rgba(255,255,255,.07)';rr(x,y-h/2,w,h,h/3);ctx.fill();const ww=Math.max(6,w*Math.min(1,Math.max(0,v)/max)*(o.k??1));ctx.fillStyle=col;rr(x,y-h/2,ww,h,h/3);ctx.fill();if(label)text(label,x+ww+16,y+2,{a:'left',f:'D',s:o.s||44,c:o.lc||col});}
function popText(t0,x,y,str,o){const k=T-t0;if(k<0)return;group(x,y,lerp(1.4,1,E.out(P(k,0,.3))),0,P(k,0,.15),()=>text(str,0,0,o));}
function vCash(x,y,w,h,col){if(h<1)return;ctx.fillStyle=col;rr(x,y,w,h,Math.min(16,h/2));ctx.fill();}
const neg=n=>(n<0?'−':'')+won(Math.abs(n));

const mw=n=>n.toLocaleString('ko-KR')+'만';
/* 스터디카페 건물 (상표 없음) */
function studyBuilding(x,y,s,o={}){
  group(x,y,s,0,o.alpha??1,()=>{
    ctx.fillStyle='#3b4766';rr(-380,-260,760,520,18);ctx.fill();
    ctx.fillStyle='#2a3350';rr(-380,-260,760,110,14);ctx.fill();
    text('24H 스터디카페',0,-205,{f:'D',s:56,c:C.gold});
    for(let r=0;r<2;r++)for(let i=0;i<5;i++){ctx.save();ctx.shadowColor='rgba(255,230,160,.6)';ctx.shadowBlur=24;ctx.fillStyle='#ffe9b0';rr(-340+i*142,-120+r*170,110,130,10);ctx.fill();ctx.restore();ctx.fillStyle='rgba(60,50,30,.55)';rr(-325+i*142,-60+r*170,80,12,4);ctx.fill();}
    ctx.fillStyle='#1d2433';rr(-60,160,120,100,8);ctx.fill();
  });
}
/* 좌석 70석: 10 × 7. 비용 순서대로 물든다. o.full = 처음부터 다 물듦, o.k = 칸 크기 배율 */
function seatGrid(x0,y0,o={}){
  const cw=104*(o.sc||1),chh=96*(o.sc||1),w=88*(o.sc||1),h=78*(o.sc||1);let acc=0;const ranges=[];
  CO.forEach(s=>{const n=s.v/17.5,t=o.full?9:T-seatT(s.k),f=t>=0?E.out(P(t,0,Math.min(1.4,.3+n*.05))):0;if(!o.upto||CO.indexOf(s)<=o.upto)ranges.push([acc,acc+n*f,s.col]);acc+=n;});
  if(o.only){ranges.length=0;ranges.push(...o.only);}
  for(let i=0;i<70;i++){const x=x0+(i%10)*cw,y=y0+Math.floor(i/10)*chh;
    ctx.fillStyle='#2b3550';rr(x,y,w,h,14);ctx.fill();
    ranges.forEach(([a,b,col])=>{const s0=Math.max(a,i),s1=Math.min(b,i+1);if(s1<=s0)return;ctx.save();rr(x,y,w,h,14);ctx.clip();ctx.fillStyle=col;ctx.fillRect(x+(s0-i)*w,y,(s1-s0)*w,h);ctx.restore();});
    ctx.fillStyle='rgba(0,0,0,.28)';rr(x+w*.18,y+h*.62,w*.64,h*.12,4);ctx.fill();ctx.fillStyle='rgba(255,255,255,.35)';rr(x+w*.3,y+h*.2,w*.4,h*.3,5);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=3;rr(x,y,w,h,14);ctx.stroke();}
}
function ring(cx,cy,r,frac,col,lw=60){ctx.lineWidth=lw;ctx.strokeStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();if(frac>0){ctx.strokeStyle=col;ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*frac);ctx.stroke();}}
function bigNum(str,x,y,s,col,id,j,o={}){const q=K(id,j);if(q>=0)group(x,y,lerp(1.5,1,E.out(P(q,0,.3))),0,P(q,0,.15),()=>text(str,0,0,{f:'D',s,c:col,glow:o.glow,max:o.max||900}));else text('?',x,y,{f:'D',s,c:C.gold});}
function vbar(x,base,w,h,col,lab,lc,o={}){if(h===0)return;ctx.fillStyle=col;if(h>0)rr(x,base-h,w,Math.max(h,4),14);else rr(x,base,w,Math.max(-h,4),14);ctx.fill();if(lab)text(lab,x+w/2,h>0?base-h-48:base-h+48,{f:'D',s:o.s||52,c:lc||col,st:8,max:w+60});}

const SCENES={
  /* ── 오프닝 ── */
  open:{draw(){
    const a=L('o1');
    if(T<CT('o3')){
      seatGrid(60,170,{});
      group(1480,300,lerp(1.6,1,E.out(P(a,.1,.3))),-.03,P(a,0,.15),()=>{panel(-330,-120,660,240,{bd:C.gold,bg:'rgba(255,197,49,.12)',lw:6});text('스터디카페 70석, 한 달 매출',0,-60,{s:36,w:900,c:C.dim});text('1,225만 원',0,30,{f:'D',s:112,c:C.gold});});
      const b=L('o2');if(b>=0){group(1480,560,1,0,P(b,0,.3),()=>{panel(-330,-90,660,180,{bd:'#FF9F43',bg:'rgba(255,159,67,.08)'});text('🏢 건물주에게',0,-40,{s:36,w:900,c:C.dim});});bigNum('510만 원',1480,590,92,C.red,'o2',0,{glow:'rgba(255,77,77,.4)'});
        group(1480,760,1,0,P(b,.2,.3),()=>{panel(-330,-90,660,180,{bd:C.green,bg:'rgba(53,224,138,.08)'});text('🧑‍💼 사장님 몫',0,-40,{s:36,w:900,c:C.dim});});if(K('o2',1)>=0)bigNum('175만 원',1480,790,92,C.green,'o2',1);else text('?',1480,790,{f:'D',s:92,c:C.gold});}
    }else if(T<CT('o4')){
      const b=L('o3');seatGrid(60,170,{full:1});
      text('건물주 29석',1480,330,{f:'D',s:80,c:'#FF9F43',alpha:P(b,0,.3)});text('+ 시설·전기·청소 31석',1480,450,{s:44,w:900,c:C.dim,alpha:P(b,.2,.3)});
      if(K('o3',0)>=0)group(1480,620,lerp(1.5,1,E.out(P(K('o3',0),0,.3))),0,1,()=>text('사장님 딱 10석',0,0,{f:'D',s:92,c:C.green,glow:'rgba(53,224,138,.4)'}));else text('사장님 ?석',1480,620,{f:'D',s:92,c:C.gold});
    }else if(T<CT('o5')){
      const b=L('o4'),k=K('o4',0);text('70석을 하루 24시간 열어 두면',960,210,{f:'D',s:64,c:C.dim,alpha:P(b,0,.3)});
      ring(640,540,230,k>=0?E.out(P(k,0,.8))*.12:0,C.red,70);text(k>=0?'12%':'?',640,540,{f:'D',s:130,c:k>=0?C.red:C.gold});
      text('실제로 쓰이는 시간',1350,430,{f:'D',s:60,alpha:P(b,.3,.3)});text('(시간당 2,000원 가정)',1350,530,{s:36,w:900,c:C.dim,alpha:P(b,.4,.3)});
    }else if(T<CT('o6')){
      const b=L('o5'),k=K('o5',0);text('본전까지 안전거리',960,210,{f:'D',s:64,c:C.dim,alpha:P(b,0,.3)});
      ctx.fillStyle='rgba(255,255,255,.1)';rr(240,420,1440,90,20);ctx.fill();ctx.fillStyle='#35E08A';rr(240,420,1440*250/300,90,20);ctx.fill();
      ctx.save();ctx.setLineDash([14,10]);ctx.strokeStyle=C.red;ctx.lineWidth=6;line(240+1440*215/300,380,240+1440*215/300,550);ctx.restore();
      text('본전 215명',240+1440*215/300,340,{f:'D',s:44,c:C.red});text('지금 250명',240+1440*250/300,590,{f:'D',s:44,c:C.green});
      bigNum('35명',960,790,150,C.red,'o5',0,{glow:'rgba(255,77,77,.4)'});
    }else{
      const k9=L('o6'),k10=L('o7');
      text('스터디카페 열기 전 꼭 계산해 볼 숫자',960,230,{f:'D',s:76,c:C.gold,alpha:P(k9,0,.3)});
      for(let i=0;i<5;i++){const k=E.back(P(k9,.3+i*.15,.35));if(k<=0)continue;group(320+i*320,470,k,0,1,()=>{panel(-130,-150,260,300,{bd:C.gold,bg:'rgba(255,197,49,.1)'});text((i+1)+'',0,-80,{f:'D',s:60,c:C.gold});text('?',0,40,{f:'D',s:110});});}
      if(k10>=0)['KB국민카드 분석','한국부동산원 조사','가게 숫자는 예시'].forEach((s,i)=>{const k=P(k10,.5+i*.4,.3);if(k>0)pill(s,480+i*480,760,{s:36,alpha:k,bg:'rgba(255,255,255,.9)'});});
    }
  }},
  title:{draw(){
    const a=L('o8');
    text('스터디카페 계산서',960,300,{f:'D',s:160,c:C.gold,glow:'rgba(255,197,49,.45)',alpha:P(a,0,.3)});
    text('좌석 70석, 한 달 1,225만 원은 누구 몫일까',960,450,{s:56,w:900,alpha:P(a,.3,.3)});
    studyBuilding(700,760,.55,{alpha:P(a,.2,.3)});drawMascot(1300,720,.85,'happy',{alpha:P(a,.2,.3)});
  }},
  /* ── 예시 가게 ── */
  setup:{draw(){
    sub('p1','p1',()=>{studyBuilding(560,500,.8);text('예시 가게를 정합니다',1380,420,{f:'D',s:72,c:C.gold});text('독서실 → 스터디카페',1380,540,{s:48,w:900});});
    sub('p2','p2',()=>{text('스터디카페 가맹점 수',960,190,{f:'D',s:60,c:C.gold});const k=E.out(P(L('p2'),.2,.9)),q=K('p2',0);
      vbar(520,760,200,112*.45,'#6FD3FF','112곳','#6FD3FF');text('2015년 말',620,810,{s:38,w:900,c:C.dim});
      const h=q>=0?460*E.out(P(q,0,.9)):30;vbar(1100,760,200,h,C.gold,q>=0?'6,944곳':'?',C.gold);text('2024년 10월',1200,810,{s:38,w:900,c:C.dim});
      if(q>=0)text('약 62배',860,420,{f:'D',s:90,c:C.red,alpha:P(q,.8,.3)});
      srcLine('KB국민카드 카드 매출 분석 (세계일보 2024.11.27 보도)');});
    sub('p3','p3',()=>{text('독서실 대 스터디카페 비중',960,190,{f:'D',s:60,c:C.gold});const k=E.out(P(L('p3'),.2,.8)),k2=E.out(P(L('p3'),1.4,.8));
      [['2015년',96,4,k],['2024년 10월',25,75,k2]].forEach(([lb,a1,b1,kk],i)=>{const y=380+i*220;text(lb,300,y,{a:'right',s:44,w:900,max:260});
        ctx.fillStyle='#8e98ad';rr(340,y-50,1200*a1/100*kk,100,16);ctx.fill();ctx.fillStyle=C.gold;rr(340+1200*a1/100*kk,y-50,1200*b1/100*kk,100,16);ctx.fill();
        if(kk>.5){text('독서실 '+a1,340+1200*a1/200,y+2,{f:'D',s:40,c:'#1d2433'});if(b1>10)text('스터디카페 '+b1,340+1200*a1/100+1200*b1/200,y+2,{f:'D',s:40,c:'#1d2433'});else text('4',340+1200*(a1+b1/2)/100,y+2,{f:'D',s:36,c:'#1d2433'});}});
      srcLine('KB국민카드 분석 (세계일보 2024.11.27 보도)');});
    sub('p4','p4',()=>{text('이용자의 한 달 평균 결제액',960,190,{f:'D',s:60,c:C.gold});bigNum('4만 9천 원',640,470,130,C.gold,'p4',0,{glow:'rgba(255,197,49,.4)'});
      ring(1380,470,160,E.out(P(L('p4'),1.2,.8))*.71,C.pink,56);text('71%',1380,470,{f:'D',s:90,c:C.pink,alpha:P(L('p4'),1.2,.3)});text('결제 한 건이 1만 원 이하',1380,700,{s:40,w:900,alpha:P(L('p4'),1.2,.3)});
      srcLine('KB국민카드 분석 (세계일보 2024.11.27 보도)');});
    sub('p5','p5',()=>{[['월 정액','독서실',false,560],['시간 단위로 결제','스터디카페',true,1360]].forEach(([t1,t2,on,x],i)=>{const k=E.back(P(L('p5'),.1+i*.5,.4));if(k>0)group(x,520,k,0,1,()=>{panel(-340,-200,680,400,{bd:on?C.gold:'rgba(255,255,255,.3)',bg:on?'rgba(255,197,49,.08)':'rgba(255,255,255,.04)',lw:6});text(t2,0,-100,{f:'D',s:60,c:on?C.gold:C.dim});text(t1,0,20,{f:'D',s:54});text(on?'안 쓰면 안 낸다':'안 가도 낸다',0,120,{s:38,w:900,c:C.dim});});});});
    sub('p6','p6b',()=>{studyBuilding(480,520,.62);const k=K('p6',0);
      text('수도권 상가 2층 · 60평',1360,330,{f:'D',s:56,c:C.gold});if(k>=0)group(1360,470,lerp(1.5,1,E.out(P(k,0,.3))),0,1,()=>text('좌석 70석',0,0,{f:'D',s:110}));else text('좌석 ?석',1360,470,{f:'D',s:110,c:C.gold});
      text('회원 250명 × 4만 9천 원',1360,610,{f:'D',s:56,c:C.green,alpha:P(L('p6'),.8,.3)});
      sub('p6b','p6b',()=>text('한 석 = 0.86평 ≈ 2.8㎡',1360,740,{s:44,w:900,c:C.dim}));});
    sub('p7','p7',()=>{const q=K('p7',0);text('250명 × 4만 9천 원',960,330,{f:'D',s:80});text('=',960,450,{f:'D',s:80,c:C.dim});
      if(q>=0)group(960,640,lerp(1.5,1,E.out(P(q,0,.3))),0,1,()=>text('월 매출 1,225만 원',0,0,{f:'D',s:120,c:C.gold,glow:'rgba(255,197,49,.4)'}));else text('?',960,640,{f:'D',s:140,c:C.gold});
      pill('세금 제외 · 예시 가정',960,820,{s:36,bg:'rgba(255,255,255,.92)'});});
    sub('p8','p8',lt=>{const k=E.out(P(lt,0,.5));group(460,500,lerp(1.2,.9,k),0,1-P(lt,1.4,.4),()=>{ctx.fillStyle='#d8e4f0';rr(-300,-130,600,260,20);ctx.fill();text('1,225만 원',0,6,{f:'D',s:100,c:'#2a3f5a'});});
      if(lt>1.4)group(0,0,1,0,P(lt,1.4,.4),()=>seatGrid(180,300,{full:1,only:[[0,70,'#FFE066']],sc:.9}));
      text('= 좌석 70석',1500,380,{f:'D',s:90,c:C.gold,alpha:P(lt,.8,.4)});text('한 석 = 17만 5천 원',1500,520,{f:'D',s:60,alpha:P(lt,1.6,.4)});});
  }},
  /* ── 70석 쪼개기 ── */
  seats:{draw(){
    seatGrid(110,180,{});
    const rows=CO.map(s=>({s,t:seatT(s.k)}));
    rows.forEach(({s,t},i)=>{const q=T-t;const y=250+i*100;if(q<-.05&&s.k!=='boss')return;if(s.k==='boss'&&q<-.05)return;const al=P(q,0,.3);
      group(0,0,1,0,al*(L('s9')>=0?.0:1),()=>{ctx.fillStyle=s.col;rr(1230,y-38,30,76,8);ctx.fill();emoji(s.ic,1310,y,56);text(s.name,1360,y,{a:'left',s:38,w:900,max:300});text((s.k==='boss'?'':'−')+won(s.v)+'만',1860,y,{a:'right',f:'D',s:56,c:s.k==='boss'?C.green:C.red});});});
    const tk=CO.slice(0,5).reduce((a,s)=>a+(T>=seatT(s.k)?s.v:0),0);
    if(T>=seatT('rent')&&L('s9')<0){text('비용 합계 −'+won(tk)+'만',1560,870,{f:'D',s:46,c:C.dim});}
    if(T>=seatT('boss')&&L('s9')<0)group(900,140,lerp(1.4,1,E.out(P(T-seatT('boss'),0,.3))),-.03,1,()=>text('남은 좌석 10석 = 175만 원',0,0,{f:'D',s:60,c:C.green,st:10}));
    sub('s8b','s8b',()=>pill('매출의 14% · 100원 벌면 14원',960,1000,{s:40,bg:'rgba(255,255,255,.92)'}));
    const g=L('s9');if(g>=0){ctx.fillStyle='rgba(6,13,32,1)';ctx.fillRect(1180,120,740,760);group(1550,500,1,0,P(g,0,.3),()=>{
      text('임대료 vs 사장님 몫',0,-300,{f:'D',s:50,c:C.gold});hbar(-330,-170,440,80,510,510,'#FF9F43','510만',{s:44});hbar(-330,-50,440*175/510,80,175,175,C.green,'175만',{s:44});
      text('약 3배',0,150,{f:'D',s:130,c:C.red,glow:'rgba(255,77,77,.4)'});text('인테리어 1억 5천만 원은 사장님이 냈다',0,270,{s:36,w:900,c:C.dim,max:700});});}
  }},
  calc:{draw(){
    const a=L('c1'),ding=KT('c1',0),dt=T-ding;
    const KEYS=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['0','00','.','=']];
    const s1=CT('c1'),kd=(ding-.15-s1)/SEQ.length,n=SEQ.filter((k,j)=>T>=s1+.1+j*kd).length,typed=SEQ.slice(0,n).join(''),[n1,n2]=typed.split('−'),done=typed.endsWith('=');
    const fmt=s=>s?Number(s.replace('=','')).toLocaleString('ko-KR'):'';
    let small='',big='0';if(done){small=`${fmt(n1)} − ${fmt(n2)} =`;big=(1750000).toLocaleString('ko-KR');}else if(n2!==undefined){small=`${fmt(n1)} −`;big=n2?fmt(n2):fmt(n1);}else if(n1)big=fmt(n1);
    if(dt>=0)for(let i=0;i<3;i++){const q=P(dt,i*.12,.9);if(q<=0||q>=1)continue;ctx.save();ctx.strokeStyle=`rgba(255,197,49,${1-q})`;ctx.lineWidth=14*(1-q)+2;ctx.beginPath();ctx.arc(640,520,120+q*700,0,7);ctx.stroke();ctx.restore();}
    group(640,520,.82*lerp(.85,1,E.back(P(a,0,.4))),dt>=0?Math.sin(dt*40)*.03*(1-P(dt,0,.6)):0,P(a,0,.15),()=>{
      ctx.fillStyle='#1d2230';rr(-290,-500,580,1000,58);ctx.fill();ctx.strokeStyle='#3a4560';ctx.lineWidth=5;rr(-290,-500,580,1000,58);ctx.stroke();
      ctx.fillStyle=dt>=0&&dt<.5&&Math.sin(dt*50)>0?'#ffd6d6':'#c9e6bf';rr(-250,-455,500,215,26);ctx.fill();
      text(small,225,-405,{a:'right',s:30,w:700,c:'#4a5a44',max:460});text(big,225,-310,{a:'right',s:done?96:84,f:'D',c:done?'#d62f2f':'#1f2b1c',max:460});
      KEYS.forEach((row,ri)=>row.forEach((k,ci)=>{const x=-250+ci*130,y=-200+ri*130,pressed=SEQ.some((q,j)=>q===k&&T>=s1+.1+j*kd&&T<s1+.17+j*kd);
        ctx.fillStyle=k==='='?(pressed?'#ff8a8a':'#ff4d4d'):ci===3?(pressed?'#ffd27a':'#ff9f1a'):(pressed?'#5a6684':'#323a50');rr(x,y+(pressed?6:0),110,110,26);ctx.fill();text(k,x+55,y+57+(pressed?6:0),{s:k.length>1?40:54,w:900});}));
    });
    text('한 달 매출 − 비용',1350,230,{f:'D',s:54,c:C.gold,alpha:P(a,.2,.3)});text('1,225만 − 1,050만',1350,330,{f:'D',s:56,alpha:P(a,.4,.3)});
    if(dt>=0){const q=K('c2',0);
      if(L('c2')<0)drawMascot(1350,620,.6,'shock');
      else{group(1350,520,lerp(1.6,1,E.out(P(Math.max(0,q),0,.3))),0,1,()=>text(q>=0?'= 한 달 175만 원':'= ?',0,0,{f:'D',s:96,c:C.green,glow:'rgba(53,224,138,.45)',max:1000}));text('하루 약 5만 8천 원',1350,610,{s:44,w:900,c:C.dim,alpha:P(L('c2'),1.2,.3)});}
      const c3=L('c3');if(c3>=0&&L('c4')<0){const r=K('c3',0);group(1350,760,1,0,P(c3,0,.3),()=>{panel(-470,-100,940,200,{bg:'rgba(6,13,32,1)',bd:C.gold,lw:5});text('매출 대비 몫',0,-56,{s:36,w:900});text(r>=0?'건물주 41% · 사장님 14%':'건물주 ?% · 사장님 ?%',0,28,{f:'D',s:56,c:r>=0?C.gold:C.gold});});}
      if(L('c4')>=0)group(1350,760,1,0,P(L('c4'),0,.3),()=>{panel(-470,-100,940,200,{bg:'rgba(6,13,32,1)',bd:C.red,lw:5});text('사장님 본인 인건비는',0,-40,{s:40,w:900});text('아직 들어 있지 않다',0,40,{f:'D',s:60,c:C.red});});}
    if(dt>=0)group(1180,160,E.back(P(dt,0,.3)),.12,1,()=>text('띵—!',0,0,{f:'D',s:96,c:C.gold,st:12}));
  }},
  /* ── 좌석 가동률 ── */
  use:{draw(){
    sub('u1','u1',()=>{text('70석은 얼마나 쓰일까',960,420,{f:'D',s:110,c:C.gold});seatGrid(430,540,{full:1,only:[],sc:.6});});
    sub('u2','u2',()=>{text('시간당 2,000원 (가정)',960,200,{f:'D',s:60,c:C.gold});text('49,000원 ÷ 2,000원',960,400,{f:'D',s:90});text('=',960,520,{f:'D',s:70,c:C.dim});bigNum('24.5시간',960,680,150,C.green,'u2',0);text('한 사람이 한 달에 쓰는 시간',960,830,{s:42,w:900,c:C.dim});});
    sub('u3','u3',()=>{text('회원 250명이 쓰는 시간',960,200,{f:'D',s:60,c:C.gold});text('250명 × 24.5시간',960,420,{f:'D',s:90});text('=',960,540,{f:'D',s:70,c:C.dim});bigNum('6,125시간',960,700,150,C.green,'u3',0);});
    sub('u4','u4',()=>{text('쓸 수 있는 시간 (전부 열어 두면)',960,200,{f:'D',s:60,c:C.gold});text('70석 × 24시간 × 30일',960,420,{f:'D',s:90});text('=',960,540,{f:'D',s:70,c:C.dim});bigNum('50,400시간',960,700,150,C.gold,'u4',0);});
    sub('u5','u5',()=>{const k=K('u5',0);text('가동률',600,230,{f:'D',s:70,c:C.dim});ring(600,540,220,k>=0?E.out(P(k,0,.8))*.12:0,C.red,70);text(k>=0?'12%':'?',600,540,{f:'D',s:120,c:k>=0?C.red:C.gold});
      text('6,125 ÷ 50,400',1330,420,{f:'D',s:80});text('≈ 12%',1330,540,{f:'D',s:110,c:C.red,alpha:P(k,0,.3)});});
    sub('u6','u6',()=>{seatGrid(544,270,{full:1,only:[[0,8.5,'#35E08A']],sc:.8});text('쓰이는 좌석 12%',960,200,{f:'D',s:64,c:C.green});text('비어 있는 좌석 88% — 월세는 100%',960,850,{f:'D',s:60,c:C.red});});
    sub('u7','u7',()=>{text('시간당 요금을 바꿔도',960,190,{f:'D',s:60,c:C.gold});[['1,500원',16,'#6FD3FF'],['2,000원',12,C.red],['2,500원',10,'#B18CFF']].forEach(([l,v,col],i)=>{const k=E.out(P(L('u7'),.3+i*.4,.5)),y=380+i*170;text('시간당 '+l,420,y,{a:'right',s:44,w:900});ctx.fillStyle='rgba(255,255,255,.08)';rr(460,y-45,1000,90,16);ctx.fill();ctx.fillStyle=col;rr(460,y-45,Math.max(8,1000*v/100*k),90,16);ctx.fill();text(v+'%',460+1000*v/100*k+20,y+2,{a:'left',f:'D',s:56,c:col});});
      text('20%선',460+1000*.2,300,{s:34,w:900,c:C.dim});ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;line(460+1000*.2,320,460+1000*.2,740);ctx.restore();});
    sub('u8','u8',()=>{text('가동률 +1%포인트',960,220,{f:'D',s:70,c:C.gold});text('504시간 × 2,000원',960,400,{f:'D',s:90});text('=',960,520,{f:'D',s:70,c:C.dim});bigNum('+100만 원',960,690,150,C.green,'u8',0,{glow:'rgba(53,224,138,.4)'});text('한 달 (예시)',960,820,{s:40,w:900,c:C.dim});});
    sub('u9','u9',lt=>{text('시간대별 이용 (예시 모양)',960,190,{f:'D',s:56,c:C.gold});const prof=[6,4,3,2,2,3,5,8,12,15,16,16,15,14,14,15,16,18,22,28,32,30,24,14];
      prof.forEach((v,i)=>{const k=E.out(P(lt,i*.03,.4)),x=210+i*60,h=v*14*k;ctx.fillStyle=v>=24?C.red:v<=6?'#4a5470':'#6FD3FF';rr(x,820-h,46,h,8);ctx.fill();if(i%3===0)text(i+'시',x+23,860,{s:28,w:800,c:C.dim});});
      text('붐비는 시간 → 자리가 모자람',1440,330,{s:40,w:900,c:C.red,alpha:P(lt,1.2,.3)});text('새벽 → 텅 빔',560,640,{s:40,w:900,c:C.dim,alpha:P(lt,1.2,.3)});
      pill('실제 분포가 아닌 설명용 모양',1560,180,{s:30,bg:'rgba(255,255,255,.92)'});});
  }},
  /* ── 누가 돈을 내나 ── */
  who:{draw(){
    sub('w1','w1',()=>{text('이 회원들은 누구일까',960,420,{f:'D',s:110,c:C.gold});drawMascot(960,720,.8,'think');});
    sub('w2','w2',()=>{text('스터디카페 결제자 나이대',960,190,{f:'D',s:60,c:C.gold});[['20대',30],['30대',10],['40대',26],['50대',30],['60대+',4]].forEach(([l,v],i)=>{const k=E.out(P(L('w2'),.2+i*.25,.5)),x=260+i*300,h=v*17*k;vbar(x,760,200,h,i===2||i===3?C.gold:'#6FD3FF',v+'%',null);text(l,x+100,810,{s:40,w:900,c:C.dim});});srcLine('KB국민카드 분석 (세계일보 2024.11.27 보도)');});
    sub('w3','w3',()=>{text('40대 + 50대',960,230,{f:'D',s:70,c:C.dim});ctx.fillStyle='rgba(255,255,255,.1)';rr(240,420,1440,100,20);ctx.fill();const k=K('w3',0);ctx.fillStyle=C.gold;rr(240,420,1440*.56*(k>=0?E.out(P(k,0,.8)):0),100,20);ctx.fill();bigNum('56%',960,700,160,C.gold,'w3',0);text('부모 카드 결제 비중이 높다고 분석',960,860,{s:40,w:900,c:C.dim,alpha:P(L('w3'),1.4,.3)});});
    sub('w4','w4',()=>{emoji('🧑‍🎓',560,520,200);text('→',960,520,{f:'D',s:120,c:C.dim});emoji('💳',1360,520,200);text('쓰는 사람',560,700,{s:46,w:900});text('돈 내는 사람',1360,700,{s:46,w:900});});
    sub('w5','w6',()=>{text('시험철 · 방학 가정',960,190,{f:'D',s:60,c:C.gold});[['시험철 6개월',300,C.green],['비수기 6개월',200,'#6FD3FF']].forEach(([l,v,col],i)=>{const k=P(L('w6'),.2+i*.5,.5),y=420+i*200;text(l,420,y,{a:'right',s:44,w:900});ctx.fillStyle='rgba(255,255,255,.08)';rr(460,y-45,1100,90,16);ctx.fill();ctx.fillStyle=col;rr(460,y-45,1100*v/300*E.out(k),90,16);ctx.fill();text('회원 '+v+'명',460+1100*v/300*E.out(k)+20,y+2,{a:'left',f:'D',s:50,c:col,alpha:k});});
      if(L('w6')>=0)text('평균은 똑같이 250명',960,860,{f:'D',s:64,c:C.dim,alpha:P(L('w6'),1,.3)});});
    sub('w7','w7',()=>{text('한 달 남는 돈',960,190,{f:'D',s:60,c:C.gold});const b=800;ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=4;line(300,b,1620,b);
      const k0=K('w7',0),k1=K('w7',1);vbar(500,b,300,k0>=0?420*.9*E.out(P(k0,0,.7)):20,C.green,k0>=0?'420만':'?',C.green);text('시험철',650,b+60,{s:40,w:900,c:C.dim});
      const h=k1>=0?70*.9*E.out(P(k1,0,.7)):0;if(h>0){ctx.fillStyle=C.red;rr(1120,b,300,h,14);ctx.fill();}text(k1>=0?'−70만':'?',1270,b+h+60,{f:'D',s:56,c:k1>=0?C.red:C.gold});text('비수기',1270,b-40,{s:40,w:900,c:C.dim});});
    sub('w8','w8',()=>{const k=K('w8',0);text('시험철 6달 +2,520만',960,300,{f:'D',s:72,c:C.green});text('비수기 6달 −420만',960,420,{f:'D',s:72,c:C.red});text('=',960,530,{f:'D',s:60,c:C.dim});bigNum('1년 2,100만 원',960,690,120,C.green,'w8',0);text('월평균 175만 원',960,830,{s:44,w:900,c:C.dim,alpha:P(k,.4,.3)});});
    sub('w9','w9',lt=>{text('월세는 비수기에도 똑같이',960,190,{f:'D',s:60,c:C.gold});for(let i=0;i<12;i++){const k=E.out(P(lt,.2+i*.12,.35)),x=190+i*125,pos=i<6,h=(pos?420:70)*.7*k;if(pos){ctx.fillStyle=C.green;rr(x,620-h,90,h,10);}else{ctx.fillStyle=C.red;rr(x,620,90,h,10);}ctx.fill();text((i+1)+'월',x+45,i<6?670:700+h*0,{s:28,w:800,c:C.dim,alpha:k});}
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=4;line(160,620,1760,620);text('번 돈을 다 쓰면 비수기 첫 달부터 월세가 모자란다',960,860,{f:'D',s:48,c:C.red,alpha:P(lt,2.2,.4)});});
    sub('w10','w10',lt=>{text('스터디카페 점주 10명 중',960,200,{f:'D',s:60,c:C.gold});for(let i=0;i<10;i++){const k=E.back(P(lt,.2+i*.1,.3));if(k<=0)continue;emoji('🧑‍💼',270+i*155,520,i===0?120:100,{alpha:i===0?1:.55});}
      text('독서실을 운영해 본 사람 1명',960,720,{f:'D',s:60,c:C.gold,alpha:P(lt,1.4,.3)});text('이 출렁임을 처음 겪는 사람이 많다',960,820,{s:44,w:900,c:C.dim,alpha:P(lt,1.8,.3)});srcLine('KB국민카드 분석 (세계일보 2024.11.27 보도)');});
  }},
  /* ── 회원 몇 명이어야 본전 ── */
  be:{draw(){
    sub('m1','m1',()=>{text('회원이 몇 명이어야 본전?',960,420,{f:'D',s:100,c:C.gold});drawMascot(960,720,.8,'think');});
    sub('m2','m2',()=>{text('비용 1,050만 ÷ 4만 9천 원',960,330,{f:'D',s:80});text('≈ 214.3명',960,460,{f:'D',s:80,c:C.dim});bigNum('본전 215명',960,680,140,C.red,'m2',0,{glow:'rgba(255,77,77,.4)'});});
    sub('m3','m3',()=>{ctx.fillStyle='rgba(255,255,255,.1)';rr(240,420,1440,90,20);ctx.fill();ctx.fillStyle='#35E08A';rr(240,420,1440*250/300,90,20);ctx.fill();ctx.save();ctx.setLineDash([14,10]);ctx.strokeStyle=C.red;ctx.lineWidth=6;line(240+1440*215/300,380,240+1440*215/300,550);ctx.restore();
      text('본전 215명',240+1440*215/300,330,{f:'D',s:44,c:C.red});text('지금 250명',240+1440*250/300,590,{f:'D',s:44,c:C.green});bigNum('안전거리 35명',960,790,110,C.gold,'m3',0);text('250명의 14%',960,880,{s:40,w:900,c:C.dim});});
    sub('m4','m5',()=>{text('회원 수별 한 달 남는 돈',960,180,{f:'D',s:60,c:C.gold});const b=640;ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=4;line(300,b,1620,b);
      const k4=K('m4',0),k5=K('m5',0);vbar(420,b,260,k4>=0?70*.9*E.out(P(k4,0,.6))*-1:0,C.red,k4>=0?'−70만':'?',C.red);text('200명',550,b-30-(0),{s:40,w:900,c:C.dim});
      vbar(830,b,260,175*.9*E.out(P(L('m4'),.3,.6)),C.gold,'175만',C.gold);text('250명',960,b+60,{s:40,w:900,c:C.dim});
      if(L('m5')>=0)vbar(1240,b,260,k5>=0?420*.9*E.out(P(k5,0,.7)):20,C.green,k5>=0?'420만':'?',C.green);if(L('m5')>=0)text('300명',1370,b+60,{s:40,w:900,c:C.dim});
      text('회원 200명',550,b+60+(k4>=0?70*.9*0:0),{s:1,c:'rgba(0,0,0,0)'});});
    sub('m6','m6',()=>{text('50명 차이 = 남는 돈 245만 원',960,420,{f:'D',s:84,c:C.gold});text('비용이 거의 고정이라서',960,560,{s:56,w:900,c:C.dim});});
    sub('m7','m7',()=>{studyBuilding(560,520,.45);text('새 스터디카페',560,720,{s:40,w:900,c:C.dim});text('→',960,500,{f:'D',s:100,c:C.dim});text('회원 50명 이탈',1300,420,{s:48,w:900});bigNum('−70만 원',1300,560,120,C.red,'m7',0,{glow:'rgba(255,77,77,.4)'});text('한 달',1300,680,{s:40,w:900,c:C.dim});});
  }},
  /* ── 요금을 올리면 ── */
  price:{draw(){
    sub('q1','q1',()=>{text('요금을 올리면?',960,420,{f:'D',s:120,c:C.gold});drawMascot(960,730,.8,'think');});
    sub('q2','q2',()=>{text('시간당 2,000원 → 2,200원 (+10%)',960,300,{f:'D',s:72});text('회원 한 명이 한 달에 쓰는 돈',960,420,{s:44,w:900,c:C.dim});text('49,000원 →',560,590,{f:'D',s:80,c:C.dim});bigNum('53,900원',1300,590,120,C.gold,'q2',0);});
    sub('q3','q3',()=>{const b=800,k=K('q3',0);text('회원 250명 그대로라면',960,190,{f:'D',s:60,c:C.gold});vbar(540,b,300,175*1.5,'#6FD3FF','175만','#6FD3FF');text('지금',690,b+56,{s:40,w:900,c:C.dim});vbar(1080,b,300,k>=0?297.5*1.5*E.out(P(k,0,.7)):30,C.green,k>=0?'297만 5천':'?',C.green);text('10% 올리면',1230,b+56,{s:40,w:900,c:C.dim});});
    sub('q4','q4',()=>{text('요금 +10%',560,420,{f:'D',s:90});text('→',960,420,{f:'D',s:90,c:C.dim});text('남는 돈 +70%',1360,420,{f:'D',s:90,c:C.green});text('비용은 그대로라 올린 금액이 통째로 남는다',960,620,{s:48,w:900,c:C.dim});});
    sub('q5','q5',()=>{text('손님이 떠나면?',960,400,{f:'D',s:110,c:C.red});emoji('🚪',960,660,200);});
    sub('q6','q6',()=>{ctx.fillStyle='rgba(255,255,255,.1)';rr(240,420,1440,90,20);ctx.fill();ctx.fillStyle='#35E08A';rr(240,420,1440*227/300,90,20);ctx.fill();ctx.fillStyle='rgba(255,77,77,.7)';rr(240+1440*227/300,420,1440*23/300,90,10);ctx.fill();
      text('227명',240+1440*227/300,590,{f:'D',s:48,c:C.green});text('매출 1,223만 원 ≈ 올리기 전',960,260,{f:'D',s:60,c:C.dim});bigNum('회원 9% (23명)',960,790,100,C.red,'q6',0);});
    sub('q7','q7',()=>{text('이탈 9% 안 → 이득',560,500,{f:'D',s:70,c:C.green});text('9% 넘으면 → 손해',1360,500,{f:'D',s:70,c:C.red});});
    sub('q8','q8',()=>{text('요금 −10%',560,400,{f:'D',s:84});text('→',960,400,{f:'D',s:84,c:C.dim});bigNum('회원 +11%',1360,400,100,C.red,'q8',0);text('넘게 늘어야 본전',960,620,{s:56,w:900,c:C.dim});});
    sub('q9','q9',()=>{text('가장 센 손잡이',560,420,{f:'D',s:80,c:C.gold});text('가장 조심할 손잡이',1360,420,{f:'D',s:80,c:C.red});drawMascot(960,720,.7,'worry');});
  }},
  /* ── 무인이면 더 남을까 ── */
  unman:{draw(){
    sub('n1','n1',()=>{emoji('🤖',960,450,260);text('무인이면 더 남을까?',960,720,{f:'D',s:100,c:C.gold});});
    sub('n2','n2',()=>{text('사람 손으로 줄일 수 있는 비용',960,230,{f:'D',s:60,c:C.gold});ctx.fillStyle='#8e98ad';rr(180,380,1560*950/1050,120,18);ctx.fill();ctx.fillStyle='#6FD3FF';rr(180+1560*950/1050,380,1560*100/1050,120,10);ctx.fill();text('월세·전기·기기·시설 950만',180+1560*950/2100,442,{f:'D',s:48,c:'#1d2433'});
      bigNum('청소·관리 100만',1000,680,100,'#6FD3FF','n2',0);});
    sub('n3','n3',()=>{[['🏢 월세','510'],['💡 전기','120'],['🧾 기기','70'],['🛋️ 시설','250']].forEach(([l,v],i)=>{const k=E.back(P(L('n3'),.1+i*.5,.35));if(k>0)group(300+i*440,520,k,0,1,()=>{panel(-190,-150,380,300,{bd:'#8e98ad'});text(l,0,-60,{s:44,w:900});text(v+'만',0,50,{f:'D',s:72});text('사람을 줄여도 그대로',0,115,{s:26,w:800,c:C.dim});});});});
    sub('n4','n4',()=>{text('사람으로 못 줄이는 돈',960,330,{f:'D',s:64,c:C.dim});bigNum('전체의 90%',960,560,170,C.red,'n4',0,{glow:'rgba(255,77,77,.4)'});text('950만 ÷ 1,050만',960,760,{s:44,w:900,c:C.dim});});
    sub('n5','n5',()=>{text('청소 알바를 완전히 없애도',960,260,{f:'D',s:64,c:C.dim});text('175만 →',560,520,{f:'D',s:90});bigNum('275만 원',1250,520,130,C.green,'n5',0);pill('사장님이 직접 청소하는 값은 따로 계산',960,760,{s:36,bg:'rgba(255,255,255,.92)'});});
    sub('n6','n6',()=>{stampBox('사람이 아니라 공간과 회원 수',960,500,T-CT('n6')-.1,{s:70,c:C.gold,bg:'rgba(40,30,0,.85)'});});
    sub('n7','n7',()=>{drawMascot(960,520,.9,'think');text('광고 문구보다 비용 구성을 보자',960,860,{s:48,w:900,c:C.dim});});
  }},
  /* ── 건물주 쪽 숫자 ── */
  rent:{draw(){
    sub('r1','r1',()=>{emoji('🏢',960,450,300);text('건물주 쪽 숫자',960,740,{f:'D',s:110,c:C.gold});});
    sub('r2','r2',()=>{text('전국 소규모 상가 1층, 2026년 2분기',960,230,{f:'D',s:60,c:C.gold});text('1㎡당 월 임대료 평균',960,360,{s:50,w:900,c:C.dim});bigNum('2만 600원',960,560,170,C.gold,'r2',0,{glow:'rgba(255,197,49,.4)'});srcLine('한국부동산원 상업용부동산 임대동향조사 (뉴시스 2026.7.30 보도)');});
    sub('r3','r3',()=>{text('60평 ≈ 198㎡',960,250,{f:'D',s:76});text('198㎡ × 20,600원 ≈ 408만 원',960,400,{f:'D',s:76,c:C.gold});text('우리 가게 예시 510만 원 = 관리비 포함 · 수도권 가정',960,570,{s:44,w:900,c:C.dim});pill('1층 평균은 참고용 (스터디카페는 보통 2층 이상)',960,720,{s:34,bg:'rgba(255,255,255,.92)'});srcLine('한국부동산원 (뉴시스 2026.7.30 보도)');});
    sub('r4','r4',()=>{text('상가 공실률 (2026년 2분기)',960,200,{f:'D',s:60,c:C.gold});const b=780;const k=K('r4',0);vbar(560,b,300,k>=0?13.4*30*E.out(P(k,0,.7)):20,C.red,k>=0?'13.4%':'?',C.red);text('일반 상가 전체',710,b+56,{s:40,w:900,c:C.dim});vbar(1060,b,300,8.5*30*E.out(P(L('r4'),1.4,.6)),'#6FD3FF','8.5%','#6FD3FF');text('소규모 상가',1210,b+56,{s:40,w:900,c:C.dim});
      if(k>=0)text('2015년 통계 시작 이래 가장 높음',1100,330,{s:40,w:900,c:C.red,alpha:P(k,.8,.3)});srcLine('한국부동산원 (뉴시스 2026.7.30 보도)');});
    sub('r5','r5',()=>{emoji('🏢',560,500,200);text('→',860,500,{f:'D',s:100,c:C.dim});emoji('🙋',1160,500,200);text('월세를 꼬박 내는 임차인',1160,680,{s:44,w:900});});
    sub('r6','r6',lt=>{text('월세가 해마다 5%씩 오르면 (가정)',960,190,{f:'D',s:60,c:C.gold});const b=780;[0,1,2,3].forEach(i=>{const rent=510*Math.pow(1.05,i),k=E.out(P(lt,.2+i*.35,.5)),x=360+i*300,last=i===3,kk=K('r6',0);
      vbar(x,b,200,(last&&kk<0?30:rent*.75)*k,last?C.red:'#FF9F43',last?(kk>=0?'590만':'?'):Math.round(rent)+'만',last?C.red:'#FF9F43');text(i?i+'년 뒤':'지금',x+100,b+56,{s:38,w:900,c:C.dim});});});
    sub('r7','r7',()=>{text('매출 그대로일 때 한 달 남는 돈',960,190,{f:'D',s:60,c:C.gold});const b=760,k0=K('r7',0),k1=K('r7',1);vbar(360,b,260,175*1.8,C.green,'175만',C.green);text('지금',490,b+56,{s:40,w:900,c:C.dim});
      vbar(860,b,260,k0>=0?95*1.8*E.out(P(k0,0,.6)):20,'#FF9F43',k0>=0?'95만':'?','#FF9F43');text('3년 뒤',990,b+56,{s:40,w:900,c:C.dim});vbar(1360,b,260,k1>=0?34*1.8*E.out(P(k1,0,.6)):12,C.red,k1>=0?'34만':'?',C.red);text('5년 뒤',1490,b+56,{s:40,w:900,c:C.dim});});
    sub('r7b','r7b',()=>{text('회원 200명 + 월세 590만 원',960,330,{f:'D',s:72});text('=',960,450,{f:'D',s:60,c:C.dim});bigNum('−150만 원',960,640,160,C.red,'r7b',0,{glow:'rgba(255,77,77,.4)'});text('한 달',960,790,{s:44,w:900,c:C.dim});});
    sub('r8','r8',()=>{text('5년 뒤 남는 돈 34만 원',960,330,{f:'D',s:80,c:C.red});text('다시 1억 5천만 원을 넣을 수 있을까',960,480,{f:'D',s:60});drawMascot(960,740,.6,'worry');});
  }},
  /* ── 1억 5천만 원은 언제 돌아오나 ── */
  back:{draw(){
    sub('b1','b1',()=>{emoji('💰',960,450,280);text('1억 5천만 원은 언제 돌아올까',960,730,{f:'D',s:90,c:C.gold});});
    sub('b2','b2',()=>{text('175만 + 250만',960,330,{f:'D',s:90});text('(인테리어를 나눠 둔 몫을 다시 더한다)',960,430,{s:38,w:900,c:C.dim});bigNum('425만 원',960,640,160,C.green,'b2',0);text('매달 들어오는 현금',960,790,{s:44,w:900,c:C.dim});});
    sub('b3','b3',()=>{text('15,000만 ÷ 425만',960,260,{f:'D',s:80});ctx.fillStyle='rgba(255,255,255,.1)';rr(240,420,1440,90,20);ctx.fill();const k=K('b3',0);ctx.fillStyle=C.gold;rr(240,420,1440*(k>=0?35/60*E.out(P(k,0,.8)):0),90,20);ctx.fill();text('60개월(5년)',1680,590,{a:'right',s:40,w:900,c:C.dim});bigNum('약 35개월',960,740,130,C.gold,'b3',0);});
    sub('b4','b4',()=>{text('보증금 · 권리금은 넣지 않았다',960,420,{f:'D',s:80,c:C.dim});text('넣으면 회수 기간은 더 길어진다',960,560,{f:'D',s:64,c:C.red});});
    sub('b5','b5',()=>{text('425만 × 60개월 = 2억 5,500만',960,260,{f:'D',s:70});text('− 인테리어 1억 5천만',960,380,{f:'D',s:70,c:C.red});text('=',960,490,{f:'D',s:60,c:C.dim});bigNum('1억 500만 원',960,680,150,C.green,'b5',0);text('사장님 5년 몫 (175만 × 60개월)',960,830,{s:42,w:900,c:C.dim});});
    sub('b6','b6',()=>{text('510만 × 60개월 (월세 인상 없이)',960,290,{f:'D',s:70});text('=',960,400,{f:'D',s:60,c:C.dim});bigNum('3억 600만 원',960,590,150,'#FF9F43','b6',0);text('건물주 5년 수입 · 인테리어 부담 0원',960,780,{s:44,w:900,c:C.dim});});
    sub('b7','b7',()=>{const b=800;vbar(520,b,300,105*1.7,C.green,'1억 500만',C.green);text('사장님',670,b+56,{s:42,w:900,c:C.dim});vbar(1100,b,300,306*1.7,'#FF9F43','3억 600만','#FF9F43');text('건물주',1250,b+56,{s:42,w:900,c:C.dim});bigNum('약 2.9배',560,330,110,C.red,'b7',0);});
  }},
  /* ── 같은 70석, 세 가지 결과 ── */
  sc:{draw(){
    sub('v1','v1',()=>{seatGrid(430,300,{full:1,only:[],sc:.6});text('같은 70석, 결과는?',960,200,{f:'D',s:100,c:C.gold});});
    const rows=[['회원 300명','v3','+420만','+2억 5,200만',C.green],['회원 250명','v4','+175만','+1억 500만',C.gold],['회원 200명','v5','−70만','−4,200만',C.red]];
    if(T>=CT('v2')-.15&&T<nextStart(IDX['v8'])+.3){const al=P(T,CT('v2')-.15,.3)*(1-P(T,nextStart(IDX['v8']),.3));ctx.save();ctx.globalAlpha*=al;
      text('월세·시설 비용 같음, 달라지는 건 회원 수뿐',960,190,{f:'D',s:54,c:C.gold});text('한 달',1020,300,{f:'D',s:44,c:C.dim});text('5년',1500,300,{f:'D',s:44,c:C.dim});
      rows.forEach(([l,id,m,y5,col],i)=>{const k=P(T,CT(id)-.1,.4);if(k<=0)return;const y=420+i*160;group(0,(1-E.out(k))*20,1,0,k,()=>{panel(100,y-65,1720,130,{bd:col,bg:'rgba(255,255,255,.05)'});text(l,150,y,{a:'left',f:'D',s:52});
        const q1=K(id,0),q2=K(id,1);text(q1>=0?m:'?',1020,y,{f:'D',s:60,c:col});text(q2>=0?y5:'?',1500,y,{f:'D',s:60,c:col});});});
      const g=K('v6',0);if(L('v6')>=0)group(960,880,lerp(1.5,1,E.out(P(Math.max(g,0),0,.3))),0,1,()=>text(g>=0?'격차 2억 9,400만 원':'격차 ?',0,0,{f:'D',s:70,c:C.red,glow:'rgba(255,77,77,.4)'}));
      ctx.restore();}
    sub('v7','v7',()=>{});
  }},
  /* ── 손잡이 ── */
  lever:{draw(){
    const a=L('l1');
    text('사장님이 바꿀 수 있는 손잡이',960,170,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});if(T<CT('l2'))text('직접 바꿀 수 있는 숫자는?',960,500,{f:'D',s:100,alpha:P(a,.2,.3)});
    const rows=[['회원 +10명','+49만 / 월',49,C.green,'l2'],['월세 10% 협상','+51만 / 월',51,C.green,'l3'],['40평으로 이전','남는 돈 345만',170,C.green,'l4'],['가동률 +1%p','+100만 / 월',100,C.green,'l5'],['인상 한도 계약','5년 뒤 34만 방어',60,'#B18CFF','l6']];
    rows.forEach(([l,lab,v,col,id],i)=>{const t=CT(id);if(T<t-.1)return;const y=290+i*125,k=E.out(P(T-t,.1,.6));text(l,600,y,{a:'right',s:38,w:900,max:560});ctx.fillStyle='rgba(255,255,255,.07)';rr(640,y-34,800,68,14);ctx.fill();const w=v/200*800*k;ctx.fillStyle=col;rr(640,y-34,Math.max(6,w),68,14);ctx.fill();text(lab,640+Math.max(6,w)+20,y+2,{a:'left',f:'D',s:42,c:col,alpha:k,max:1860-(640+Math.max(6,w)+20)});});
    srcLine('예시 계산 · 40평 이전은 회원이 그대로라는 가정 (좌석이 줄면 붐비는 시간에 손님을 놓칠 수 있음)',872);
  }},
  /* ── 체크리스트 ── */
  check:{draw(){
    const a=L('y1'),ov=L('y7');
    text('열기 전 꼭 볼 숫자 5가지',960,170,{f:'D',s:64,c:C.gold,alpha:P(a,0,.3)});
    const cards=[['y2','임대료 비율','월세 ÷ 예상 매출','510 ÷ 1,225 = 41%'],['y3','본전 회원 수','비용 ÷ 평균 결제액','215명 · 안전거리 35명'],['y4','인테리어 비용','투자금 ÷ 5년을 비용에','빼면 250만 원 부풀려짐'],
      ['y5','가동률','회원 시간 ÷ 열린 시간','우리 가게 12%'],['y6','계약 조건','인상률 · 갱신 · 원상복구','5%씩 오르면 5년 뒤 34만']];
    cards.forEach(([id,t1,f,e],i)=>{const k=E.back(P(L(id),0,.4));if(k<=0)return;const x=i<3?340+i*620:650+(i-3)*620,y=i<3?380:690;
      group(x,y,k,0,ov>=0?.25:1,()=>{panel(-290,-130,580,260,{bd:'rgba(255,197,49,.6)'});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(-230,-80,34,0,7);ctx.fill();text((i+1)+'',-230,-77,{f:'D',s:44,c:C.ink});
        text(t1,-180,-80,{a:'left',f:'D',s:40,max:440});text(f,-250,0,{a:'left',s:30,w:800,c:'rgba(255,255,255,.8)',max:520});
        const q=P(L(id),1.5,.3);if(q>0)text(e,-250,72,{a:'left',s:28,w:900,c:C.gold,alpha:q,max:520});});});
    if(ov>=0){group(960,520,1,0,P(ov,0,.3),()=>{panel(-700,-220,1400,420,{bg:'rgba(6,13,32,1)',bd:C.gold});text('230명 × 4만 9천 원 − 1,050만 원',0,-130,{f:'D',s:54,max:1300});
      const k=K('y7b',0);text('= 1,127만 − 1,050만 =',0,-30,{f:'D',s:56,c:L('y7b')>=0?C.gold:'#fff'});if(k>=0)text('77만 원',0,100,{f:'D',s:130,c:C.green,glow:'rgba(53,224,138,.4)',alpha:P(k,0,.3)});else text('?',0,100,{f:'D',s:120,c:C.gold});});}
  }},
  outro:{draw(){
    const a=L('z1'),c=K('z3',0);
    if(c<0){
      text('한 달 매출 1,225만 원',960,180,{f:'D',s:60,c:C.gold,alpha:P(a,0,.3)});
      const z=E.out(P(L('z2'),0,2.6));let xx=160;CO.forEach((s,i)=>{const w=1600*s.v/1225*z,kk=P(L('z2'),i*.5,.4);ctx.fillStyle=s.col;if(w>2){rr(xx,330,Math.max(2,w-3),150,10);ctx.fill();}if(kk>0&&w>70){text(won(s.v),xx+w/2,405,{f:'D',s:w>150?44:30,c:'#101420',alpha:kk,max:w-8});text(s.name,xx+w/2,520,{s:w>150?26:20,w:900,c:'rgba(255,255,255,.85)',alpha:kk,max:w+20});}xx+=w;});
      const b=L('z2b');if(b>=0){group(560,740,1,0,P(b,0,.3),()=>{panel(-380,-90,760,180,{bd:C.red,bg:'rgba(255,77,77,.08)'});text('회원 35명만 빠져도',0,-30,{s:40,w:900});text('본전',0,40,{f:'D',s:64,c:C.red});});group(1360,740,1,0,P(b,.3,.3),()=>{panel(-380,-90,760,180,{bd:'#FF9F43',bg:'rgba(255,159,67,.08)'});text('월세 해마다 5%씩 오르면',0,-30,{s:40,w:900});text('5년 뒤 34만 원',0,40,{f:'D',s:64,c:'#FF9F43'});});}
      const d=L('z2c');if(d>=0&&L('z3')<0){ctx.fillStyle='rgba(6,13,32,1)';ctx.fillRect(0,640,W,230);text('같은 가게, 회원 300명 → 5년 +2억 5,200만',960,720,{f:'D',s:58,c:C.green,alpha:P(d,0,.3)});text('회원 200명 → 5년 −4,200만',960,810,{f:'D',s:58,c:C.red,alpha:P(d,.5,.3)});}
    }else{
      drawMascot(960,430,1.05,'think');
      stampBox('건물주 몫이 먼저 정해지는 장사',960,760,c,{s:60,c:C.gold,bg:'rgba(40,30,0,.85)'});
      const e=L('z4b');if(e>=0&&L('z5')<0)pill('📌 숫자·출처는 설명란에',1560,200,{s:32,alpha:P(e,0,.3),bg:'rgba(255,255,255,.92)'});
      const f=L('z5');if(f>=0&&L('z6')<0)group(1480,230,E.back(P(f,0,.4))+.001,0,1,()=>{ctx.fillStyle='#fff';rr(-330,-70,660,140,30);ctx.fill();ctx.beginPath();ctx.moveTo(-120,70);ctx.lineTo(-150,120);ctx.lineTo(-70,70);ctx.fill();text('💬 보통 몇 시간 쓰세요? 댓글로!',0,4,{s:34,w:900,c:C.ink,max:620});});
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
