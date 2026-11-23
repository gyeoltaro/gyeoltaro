/* ── LF.30 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(빵 3,000원 · 밤 8시 30% = 2,100원 · 낮 손님 24명이면 0원)를 쓴다.
   A안 = 우리 채널 1위 꼴 T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(가격표·시계)에,
   B안 = 시험 대기 1순위 T1 따옴표 — 예시 대사 딱지 · S4 따옴표 글씨 + S10 낮/밤 두 장면,
   C안 = T3 질문(답 숨김) · S5 걱정하는 계산이를 빵집 진열대 옆에.
   상표·실존 가게는 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();bakery30(400,330,.95,{night:true,left:5});clock30(860,250,110,8,{});
    tag30(1260,230,1.3,'3,000원',{strike:true});tag30(1640,230,1.3,'2,100원',{bg:'#e0342c',c:'#fff'});
    for(let i=0;i<5;i++)bread30(1150+i*130,420,.85);
    bottomShade(540);grain();
    tagBox('예시 · 빵 3,000원 · 남은 10개 30% 할인 · 낮 손님 24명이 8시로 오면',50,640,'#FFC531','#1d2433',40);
    bigLine('마감 할인할수록',50,790,146,'#fff',{max:1820});
    bigLine('손해 보는 빵집(?)',50,965,150,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();
    ctx.fillStyle='rgba(255,197,49,.16)';ctx.fillRect(0,0,960,560);ctx.fillStyle='rgba(111,168,255,.14)';ctx.fillRect(960,0,960,560);
    sun30(120,110,46);moon30(1800,110,46);
    bakery30(480,330,.8,{});bakery30(1440,330,.8,{night:true,left:5});
    text('낮 3,000원',480,520,{f:'D',s:56,c:'#FFC531',st:8});text('밤 8시 2,100원',1440,520,{f:'D',s:56,c:'#9cc3ff',st:8});
    bottomShade(560);grain();
    tagBox('예시 대사 · 빵 3,000원 · 30% 할인 · 계산은 예시 가정',50,650,'#35E08A','#0d1a12',40);
    bigLine('"8시에 오면 2,100원"',50,800,140,'#fff',{max:1820});
    bigLine('낮 손님 24명이면 0원(?)',50,970,140,'#FFD23F',{max:1820});
  }else{
    nightBG();bakery30(420,320,.95,{night:true,left:5});clock30(900,260,120,8,{});drawMascot(1260,330,.95,'worry');
    group(1650,270,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-230,-120,460,240,18);ctx.fill();text('낮 손님',0,-55,{f:'D',s:46,c:'#59627c'});text('?명',0,45,{f:'D',s:110,c:'#b5451b'});});
    bottomShade(540);grain();
    tagBox('예시 계산 · 빵값 1년 +5.9% (국가데이터처 2026.10)',50,640,'#e0242c','#fff',40);
    bigLine('남은 빵 30% 할인,',50,790,140,'#fff',{max:1820});
    bigLine('몇 명이 기다리면 0원?',50,965,140,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
