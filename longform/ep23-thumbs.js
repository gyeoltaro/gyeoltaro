/* ── LF.23 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(매출 −21% → 남는 돈 −63%, 300만 → 111만)를 쓴다.
   A안 = T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(계산기 화면)에,
   B안 = 시험 대기 1순위 T1 따옴표(실제 보도된 노래방 사장님 말) · S4 따옴표 글씨 + S2 불 꺼진 노래방 방 복도,
   C안 = T7 숨긴 범인 · S5 걱정하는 계산이 + 고깃집 → 노래방 화살표 장면.
   상표·실존 가게는 그리지 않는다. 핵심 그림은 위 55%. */
function thumbCalc2(x,y,s){group(x,y,s,-.04,1,()=>{ctx.fillStyle='#1d2230';rr(-300,-210,600,420,40);ctx.fill();ctx.fillStyle='#c9e6bf';rr(-260,-170,520,340,22);ctx.fill();
  text('매출',-230,-95,{a:'left',s:36,w:900,c:'#4a5a44'});text('−21%',230,-95,{a:'right',f:'D',s:70,c:'#4a5a44'});
  ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=3;line(-230,-30,230,-30);
  text('남는 돈',-230,60,{a:'left',s:36,w:900,c:'#4a5a44'});text('−63%',230,60,{a:'right',f:'D',s:112,c:'#d62f2f'});});}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();nrShop(480,330,1.05,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1});nrMic(900,360,1.1,-.3);
    thumbCalc2(1400,300,1.1);
    bottomShade(540);grain();
    tagBox('방 10개 · 한 달 매출 1,000만 원 노래방 (예시)',50,640,'#FFC531','#1d2433',44);
    bigLine('손님은 21% 줄었는데',50,790,140,'#fff',{max:1820});
    bigLine('남는 돈은 63% 증발(?)',50,965,158,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();
    /* 방 복도: 방 6개 중 1개만 불 */
    for(let i=0;i<6;i++){const x=200+i*260,lit=i===2;ctx.fillStyle=lit?'#ffd36b':'#232a3d';rr(x,120,220,330,14);ctx.fill();ctx.fillStyle=lit?'rgba(122,60,0,.45)':'rgba(255,255,255,.07)';rr(x+40,160,140,100,8);ctx.fill();text((i+1)+'번 방',x+110,400,{f:'D',s:40,c:lit?'#5a3200':'#59627c'});}
    group(1500,560,1,.05,1,()=>{ctx.fillStyle='#fff';rr(-260,-80,520,160,16);ctx.fill();text('예시 계산: 남는 돈',0,-28,{s:32,w:900,c:'#59627c'});text('300만 → 111만',0,30,{f:'D',s:52,c:'#d62f2f',max:480});});
    bottomShade(560);grain();
    tagBox('실제 보도된 서초동 노래방 사장님 말 (2024)',50,650,'#35E08A','#0d1a12',44);
    bigLine('"방 6개 중 1개도',50,800,150,'#fff',{max:1820});
    bigLine('찰까 말까"',50,970,165,'#FFD23F',{max:1820});
  }else{
    nightBG();nrShop(330,330,.78,{name:'고깃집',col:'#f3c58a'});arrowR(600,330,880,'#FF4D4D',14);nrShop(1150,330,.78,{name:'노래 연습장',col:'#3a1450',tc:'#ffd1f3',neon:1,ns:44});drawMascot(1650,380,.7,'worry');
    bottomShade(540);grain();
    tagBox('주점 이용 자정~1시 −42% (NH농협은행, 3년 전 대비)',50,640,'#e0242c','#fff',42);
    bigLine('노래방 손님을',50,790,150,'#fff',{max:1820});
    bigLine('데려간 건 고깃집(?)',50,965,160,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
