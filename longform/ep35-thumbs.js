/* ── LF.35 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(통장 600만 · 석 달마다 321만 · 한 달 107만 1,000원)를 쓴다.
   A안 = 우리 채널 1위 꼴 T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(통장·고지서)에,
   B안 = 시험 대기 1순위 T1 따옴표 — 예시 대사 딱지 · S4 따옴표 글씨 + S10 불 켜진 가게 ↔ 고지서 두 장면,
   C안 = T3 질문(답 숨김) · S5 걱정하는 계산이를 가게 앞에 + 고지서 '?원'.
   상표·실존 인물은 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  const T0=T;T=0;
  if(v===0){
    nightBG();shop35(470,330,.9,{});
    book35(1110,230,1.05,[['남은 돈','600만 원','#1f9d5b']],{w:540,h:220,rs:52});
    doc35(1600,420,1.05,'부가세 고지서',[['석 달마다','321만 원','#c0392b']],{w:520,h:220,head:'#8a2b2b',rot:.04,rs:52});
    bottomShade(540);grain();
    tagBox('부가가치세법 원문 · 국세청 통계 · 가게 숫자는 예시',50,640,'#FFC531','#1d2433',40);
    bigLine('600만 원 남는 고깃집,',50,790,135,'#fff',{max:1820});
    bigLine('석 달마다 321만 원 빠진다',50,965,140,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();
    ctx.fillStyle='rgba(53,224,138,.10)';ctx.fillRect(0,0,960,560);ctx.fillStyle='rgba(255,77,77,.12)';ctx.fillRect(960,0,960,560);
    shop35(480,330,.8,{});doc35(1440,300,1.05,'부가세 고지서',[['고지 금액','321만 3,000원','#c0392b']],{w:640,h:260,head:'#8a2b2b'});
    text('매달 600만 남는데',480,70,{f:'D',s:60,c:'#35E08A',st:8});text('석 달마다 한 장',1440,70,{f:'D',s:60,c:'#FF4D4D',st:8});
    bottomShade(560);grain();
    tagBox('예시 대사 · 법 조문은 부가가치세법 원문',50,650,'#FFC531','#1d2433',40);
    bigLine('"통장엔 돈이 있었는데요"',50,800,130,'#fff',{max:1820});
    bigLine('고지서 한 장 321만 원',50,970,140,'#FFD23F',{max:1820});
  }else{
    nightBG();shop35(460,330,.9,{});drawMascot(1060,300,.95,'worry');
    group(1600,280,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-230,-150,460,300,18);ctx.fill();text('매출 3,300만',0,-80,{f:'D',s:44,c:'#59627c'});text('부가세',0,-10,{f:'D',s:44,c:'#59627c'});text('?원',0,90,{f:'D',s:110,c:'#b5451b'});});
    bottomShade(540);grain();
    tagBox('부가가치세법 제30·42·46·48조',50,640,'#e0242c','#fff',40);
    bigLine('고깃집 매출 3,300만 원,',50,790,130,'#fff',{max:1820});
    bigLine('부가세는 얼마 낼까?',50,965,150,'#FF4D4D',{max:1820});
  }
  T=T0;
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
