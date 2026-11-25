/* ── LF.32 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(주방 2,000만 원 → 철거 날 200만 원 · 다음 가게 800만 원)를 쓴다.
   A안 = 우리 채널 1위 꼴 T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(가격표)에,
   B안 = 시험 대기 1순위 T1 따옴표 — 예시 대사 딱지 · S4 따옴표 글씨 + S10 문 닫은 가게 ↔ 다음 가게로 가는 트럭 두 장면,
   C안 = T3 질문(답 숨김) · S5 걱정하는 계산이를 주방 앞에.
   상표·실존 가게는 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();kitchen32(560,330,.85,{});
    tag32(1380,170,1.15,'새 값 2,000만',CNEW,{fs:56});ctx.strokeStyle=CBUY;ctx.lineWidth=10;line(1090,190,1680,150);
    tag32(1440,380,1.3,'철거 날 200만',CBUY,{fs:60});
    bottomShade(540);grain();
    tagBox('예시 · 20평 식당 · 매입 10% · 중고는 신품의 30~50%에 판매 (보도)',50,640,'#FFC531','#1d2433',40);
    bigLine('2,000만 원 들인 주방이',50,790,140,'#fff',{max:1820});
    bigLine('문 닫는 날 200만(?)',50,965,150,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();
    ctx.fillStyle='rgba(255,77,77,.12)';ctx.fillRect(0,0,960,560);ctx.fillStyle='rgba(53,224,138,.12)';ctx.fillRect(960,0,960,560);
    shop32(470,300,.75,{closed:true,note:'철거 2주 전'});truck32(1440,330,1.3,{});kitchen32(1380,170,.32,{});
    text('철거 날 200만',470,520,{f:'D',s:56,c:'#FF6b6b',st:8});text('다음 가게 800만',1440,520,{f:'D',s:56,c:'#35E08A',st:8});
    bottomShade(560);grain();
    tagBox('예시 대사 · 주방 2,000만 원 · 계산은 예시 가정',50,650,'#35E08A','#0d1a12',40);
    bigLine('"철거 날짜가 잡혀서요"',50,800,130,'#fff',{max:1820});
    bigLine('같은 기계가 4배 차이(?)',50,970,140,'#FFD23F',{max:1820});
  }else{
    nightBG();kitchen32(470,320,.75,{dim:true});cal32(1040,280,.75,'D-14',{});drawMascot(1430,330,.9,'worry');
    group(1740,250,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-170,-110,340,220,18);ctx.fill();text('받는 돈',0,-50,{f:'D',s:40,c:'#59627c'});text('?원',0,40,{f:'D',s:100,c:'#b5451b'});});
    bottomShade(540);grain();
    tagBox('예시 계산 · 2024년 폐업 신고 100만 8,282명 (국세청)',50,640,'#e0242c','#fff',40);
    bigLine('식당 주방 2,000만 원,',50,790,140,'#fff',{max:1820});
    bigLine('문 닫는 날 얼마 받을까?',50,965,140,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
