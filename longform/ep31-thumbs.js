/* ── LF.31 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(밤 시급 1만 320 → 1만 5,480원 · 직원 네 명 +74만 → 다섯 명 −173만)를 쓴다.
   A안 = 우리 채널 1위 꼴 T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(시급 표지판·시계)에,
   B안 = 시험 대기 1순위 T1 따옴표 — 예시 대사 딱지 · S4 따옴표 글씨 + S10 불 켜진 가게 ↔ 불 꺼진 가게 두 장면,
   C안 = T3 질문(답 숨김) · S5 걱정하는 계산이를 가게 앞에.
   상표·실존 가게는 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();shop31(400,330,.95,{});clock31(850,250,110,10,{});moon31(850,80,34);
    wageSign31(1300,200,1.15,'1만 320원',{label:'밤 직원 시급',bd:CY});ctx.strokeStyle=CR;ctx.lineWidth=10;line(1060,260,1540,200);
    wageSign31(1620,410,1.15,'1만 5,480원',{label:'다섯 번째 직원 뒤',bd:CR,c:CR});
    bottomShade(540);grain();
    tagBox('예시 · 해장국 1만 원 · 밤 35그릇 · 밤 직원 2명 · 근로기준법 제56조',50,640,'#FFC531','#1d2433',40);
    bigLine('알바 한 명 더 뽑았더니',50,790,140,'#fff',{max:1820});
    bigLine('밤 장사 한 달 −173만(?)',50,965,146,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();
    ctx.fillStyle='rgba(255,197,49,.14)';ctx.fillRect(0,0,960,560);ctx.fillStyle='rgba(255,77,77,.12)';ctx.fillRect(960,0,960,560);
    shop31(480,320,.8,{});shop31(1440,320,.8,{dark:true});
    text('직원 4명 · 밤 +74만',480,515,{f:'D',s:52,c:'#35E08A',st:8});text('직원 5명 · 밤 −173만',1440,515,{f:'D',s:52,c:'#FF6b6b',st:8});
    bottomShade(560);grain();
    tagBox('예시 대사 · 해장국집 밤 8시간 · 계산은 예시 가정',50,650,'#35E08A','#0d1a12',40);
    bigLine('"알바 한 명 더 썼을 뿐인데"',50,800,128,'#fff',{max:1820});
    bigLine('밤 시급이 1.5배(?)',50,970,140,'#FFD23F',{max:1820});
  }else{
    nightBG();shop31(420,320,.95,{});clock31(880,260,120,10,{});drawMascot(1260,330,.95,'worry');
    group(1650,270,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-230,-120,460,240,18);ctx.fill();text('밤 8시간 남는 돈',0,-55,{f:'D',s:40,c:'#59627c'});text('?원',0,45,{f:'D',s:110,c:'#b5451b'});});
    bottomShade(540);grain();
    tagBox('예시 계산 · 외식업 영업시간 10.6시간 (농식품부 2025 조사)',50,640,'#e0242c','#fff',40);
    bigLine('24시간 해장국집,',50,790,140,'#fff',{max:1820});
    bigLine('밤 10시부터 얼마 남을까?',50,965,136,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
