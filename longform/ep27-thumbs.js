/* ── LF.27 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(평균 거래가 1억 1,537만 원 · 이자 한 달 28만 원)를 쓴다.
   A안 = 우리 채널 1위 꼴 T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 번호판 값표에,
   B안 = 시험 대기 1순위 T1 따옴표(예시 대사임을 딱지로 밝힘) + S4 따옴표 글씨,
   C안 = T3 숫자 + 질문(답 숨김) · S5 걱정하는 계산이 + 줄 선 사람들.
   실존 번호·상표는 그리지 않는다. 핵심 그림은 위 55%. */
function thumbTag27(x,y,s){group(x,y,s,.05,1,()=>{ctx.fillStyle='#fffdf6';rr(-260,-150,520,300,14);ctx.fill();
  text('번호판 평균 거래가',0,-95,{f:'D',s:40,c:'#1d2433',max:480});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-220,-55,220,-55);ctx.setLineDash([]);
  text('1억 1,537만',0,10,{f:'D',s:78,c:'#1d2433',max:480});text('이자만 한 달 28만 원',0,95,{f:'D',s:40,c:'#d62f2f',max:480});});}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();taxi27(520,360,1.15,{});plate27(1030,230,.55,{rot:-.06});
    thumbTag27(1560,300,1.0);
    bottomShade(540);grain();
    tagBox('예시 · 서울 평균 거래가 2026.1 · 이자는 연 3% 가정',50,640,'#FFC531','#1d2433',42);
    bigLine('팔면 돌려받는 1억?',50,790,140,'#fff',{max:1820});
    bigLine('매달 28만 원씩 쓰는 돈',50,965,140,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();plate27(560,300,1.25,{rot:-.04});taxi27(1420,360,.95,{});
    bottomShade(560);grain();
    tagBox('예시 대사 · 서울 개인택시 번호판 평균 1억 1,537만 원 (2026.1)',50,650,'#35E08A','#0d1a12',42);
    bigLine('"번호판은 팔면',50,800,150,'#fff',{max:1820});
    bigLine('그대로 돌아와요"',50,970,150,'#FFD23F',{max:1820});
  }else{
    nightBG();plate27(470,280,1.0,{rot:-.05});drawMascot(1000,330,.95,'worry');
    for(let i=0;i<7;i++)person27(1330+i*66,400,1.8,'rgba(255,255,255,.75)');person27(1330+7*66,400,1.8,'#FFC531');
    group(1580,170,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-230,-50,460,100,14);ctx.fill();text('다음에 사 줄 사람은?',0,4,{f:'D',s:42,c:'#b5451b',max:430});});
    bottomShade(540);grain();
    tagBox('기사 60세 이상 76.2% (전국, 2025.10) · 번호판 값은 사는 사람이 정한다',50,640,'#e0242c','#fff',40);
    bigLine('번호판 1억 1,537만 원',50,790,140,'#fff',{max:1820});
    bigLine('10년 뒤엔 누가 사 줄까(?)',50,965,140,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
