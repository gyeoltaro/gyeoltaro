/* ── LF.25 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(하루 손님 24명 · 가게 몫 0원 · 사장님 몫 416만 · 평균 15년 10개월)를 쓴다.
   A안 = T6 역설 + 금액 + 이유 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(영수증)에,
   B안 = 시험 대기 1순위 T1 따옴표(예시 대사임을 딱지로 밝힘) + S4 따옴표 글씨 · 문에 '출장 중' 쪽지,
   C안 = T2 한산한 가게 + 질문(답 숨김) · S5 걱정하는 계산이를 가게 옆에.
   상표·실존 가게는 그리지 않는다. 핵심 그림은 위 55%. */
function thumbReceipt25(x,y,s){group(x,y,s,.05,1,()=>{ctx.fillStyle='#fffdf6';rr(-270,-230,540,460,14);ctx.fill();
  text('가게 손님 한 달',0,-175,{f:'D',s:44,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-230,-135,230,-135);ctx.setLineDash([]);
  text('남는 돈',-230,-80,{a:'left',s:36,w:900,c:'#3a4256'});text('210만',230,-80,{a:'right',f:'D',s:44,c:'#1d2433'});
  text('고정비',-230,-10,{a:'left',s:36,w:900,c:'#3a4256'});text('−210만',230,-10,{a:'right',f:'D',s:44,c:'#1d2433'});
  line(-230,40,230,40);text('=',-230,110,{a:'left',f:'D',s:60,c:'#d62f2f'});text('0원',230,110,{a:'right',f:'D',s:96,c:'#d62f2f'});});}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();hwShop(470,330,1.0,{});toolBag(960,400,.85,-.08);
    thumbReceipt25(1530,300,1.0);
    bottomShade(540);grain();
    tagBox('예시 가게 · 하루 손님 24명 · 사장님 몫 416만 원은 가게 밖에서',50,640,'#FFC531','#1d2433',42);
    bigLine('손님 24명이 와도 0원',50,790,140,'#fff',{max:1820});
    bigLine('철물점이 안 망하는 이유',50,965,140,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();hwShop(560,320,1.05,{note:1});toolBag(1250,380,.8,.06);emoji('🚚',1640,330,200);
    bottomShade(560);grain();
    tagBox('예시 대사 · 철물점 평균 15년 10개월 버틴다 (국세청 2022)',50,650,'#35E08A','#0d1a12',42);
    bigLine('"가게 손님으론',50,800,150,'#fff',{max:1820});
    bigLine('월세도 안 나와요"',50,970,160,'#FFD23F',{max:1820});
  }else{
    nightBG();hwShop(520,330,1.0,{dim:true});drawMascot(1180,360,.95,'worry');toolBag(1600,330,.75,.08);
    group(1600,140,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-200,-50,400,100,14);ctx.fill();text('사장님 몫 416만',0,4,{f:'D',s:44,c:'#1a8a4a',max:370});});
    bottomShade(540);grain();
    tagBox('가게 손님 몫 210만 − 고정비 210만 = 0원 (예시)',50,640,'#e0242c','#fff',42);
    bigLine('손님 없는 철물점',50,790,140,'#fff',{max:1820});
    bigLine('416만 원은 어디서(?)',50,965,160,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
