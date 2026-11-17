/* ── LF.24 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(만두 원가 1,000원 · 한 달 120만 · 사장님 몫 216만 → 96만)를 쓴다.
   A안 = T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(영수증)에,
   B안 = 시험 대기 1순위 T1 따옴표(예시 대사임을 딱지로 밝힘) + S4 따옴표 글씨 + S10 두 가게 좌우(11.17 공부: 제목은 사장 말, 썸네일은 손님 말),
   C안 = T7 숨긴 범인 · S5 걱정하는 계산이를 가게 안에.
   상표·실존 가게는 그리지 않는다. 핵심 그림은 위 55%. */
function thumbReceipt(x,y,s){group(x,y,s,.05,1,()=>{ctx.fillStyle='#fffdf6';rr(-260,-230,520,460,14);ctx.fill();
  text('서비스 군만두',0,-175,{f:'D',s:44,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-135,220,-135);ctx.setLineDash([]);
  text('1봉지',-220,-80,{a:'left',s:36,w:900,c:'#3a4256'});text('1,000원',220,-80,{a:'right',f:'D',s:44,c:'#1d2433'});
  text('× 한 달',-220,-10,{a:'left',s:36,w:900,c:'#3a4256'});text('1,200봉지',220,-10,{a:'right',f:'D',s:44,c:'#1d2433'});
  line(-220,40,220,40);text('=',-220,110,{a:'left',f:'D',s:60,c:'#d62f2f'});text('120만 원',220,110,{a:'right',f:'D',s:84,c:'#d62f2f'});});}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();dmBag(430,330,1.0,{label:''});dmBowl(360,360,.6);dmBowl(520,390,.6);for(let i=0;i<4;i++)dmDumpling(820+i*120,360+(i%2)*26,1.05,(i%2?.2:-.15));
    thumbReceipt(1560,310,1.0);
    bottomShade(540);grain();
    tagBox('한 건 2만 원 · 한 달 1,200건 동네 중국집 (예시)',50,640,'#FFC531','#1d2433',44);
    bigLine('공짜 군만두 하나에',50,790,140,'#fff',{max:1820});
    bigLine('남는 돈 216만 → 96만(?)',50,965,150,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();dmShop(480,320,.95,{name:'우리 가게',svc:1});dmShop(1440,320,.95,{name:'길 건너 가게',svc:1,svcText:'우리도 군만두!'});
    text('VS',960,320,{f:'D',s:110,c:'#FFD23F',st:14});
    bottomShade(560);grain();
    tagBox('예시 대사 · 옆집도 주면 남는 돈 216만 → 96만',50,650,'#35E08A','#0d1a12',44);
    bigLine('"저번엔 만두',50,800,150,'#fff',{max:1820});
    bigLine('줬잖아요"',50,970,165,'#FFD23F',{max:1820});
  }else{
    nightBG();dmShop(520,330,1.0,{svc:1});drawMascot(1180,360,.95,'worry');for(let i=0;i<4;i++)dmDumpling(1500+i*95,250+(i%2)*30,.9,(i%2?.2:-.15));
    group(1640,420,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-200,-50,400,100,14);ctx.fill();text('몫의 절반 넘게',0,4,{f:'D',s:46,c:'#d62f2f',max:370});});
    bottomShade(540);grain();
    tagBox('원가 1,000원 × 1,200봉지 = 한 달 120만 원 (예시)',50,640,'#e0242c','#fff',42);
    bigLine('사장님 몫을 먹은 건',50,790,140,'#fff',{max:1820});
    bigLine('서비스 군만두(?)',50,965,160,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
