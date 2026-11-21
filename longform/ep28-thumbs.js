/* ── LF.28 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(목욕 한 번 1만 1,000원 · 단골 −10% → 남는 돈 400만 → 160만)를 쓴다.
   A안 = 우리 채널 1위 꼴 T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 영수증에,
   B안 = 시험 대기 1순위 T1 따옴표 — 이번엔 예시 대사가 아니라 보도에 실린 실제 말(서울 영등포 한 목욕탕 직원, 한국경제 2026.4.15) · S4 따옴표 글씨,
   C안 = T3 숫자 + 질문(답 숨김) · S5 걱정하는 계산이를 불 꺼진 목욕탕 옆에.
   상표·실존 가게는 그리지 않는다. 핵심 그림은 위 55%. */
function thumbReceipt28(x,y,s){group(x,y,s,.05,1,()=>{ctx.fillStyle='#fffdf6';rr(-280,-230,560,460,14);ctx.fill();
  text('동네 목욕탕 한 달 (예시)',0,-175,{f:'D',s:40,c:'#1d2433',max:520});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-240,-135,240,-135);ctx.setLineDash([]);
  text('단골',-240,-80,{a:'left',s:36,w:900,c:'#3a4256'});text('300 → 270명',240,-80,{a:'right',f:'D',s:44,c:'#1d2433'});
  text('줄어든 비율',-240,-10,{a:'left',s:36,w:900,c:'#3a4256'});text('−10%',240,-10,{a:'right',f:'D',s:44,c:'#1d2433'});
  line(-240,40,240,40);text('남는 돈',-240,100,{a:'left',f:'D',s:40,c:'#d62f2f'});text('400 → 160만',240,100,{a:'right',f:'D',s:54,c:'#d62f2f',max:300});
  text('(−60%)',240,180,{a:'right',f:'D',s:40,c:'#d62f2f'});});}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();bath28(470,330,.95,{});
    thumbReceipt28(1500,300,1.0);
    bottomShade(540);grain();
    tagBox('예시 · 목욕 한 번 1만 1,000원 (서울 평균 2026.7) · 단골 300명 가정',50,640,'#FFC531','#1d2433',42);
    bigLine('단골 10%만 줄었는데',50,790,140,'#fff',{max:1820});
    bigLine('남는 돈 60%가 사라졌다',50,965,140,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();bath28(520,320,1.0,{});tub28(1380,380,1.1,{});
    bottomShade(560);grain();
    tagBox('보도 속 실제 말 · 서울 한 동네 목욕탕 직원 (한국경제 2026.4.15)',50,650,'#35E08A','#0d1a12',42);
    bigLine('"요새는 코로나 때보다',50,800,140,'#fff',{max:1820});
    bigLine('손님이 없다"',50,970,150,'#FFD23F',{max:1820});
  }else{
    nightBG();bath28(470,320,.95,{dim:true});drawMascot(1060,330,.95,'worry');
    for(let i=0;i<10;i++)head28(1330+(i%5)*90,200+Math.floor(i/5)*130,4.2,i>=8?'rgba(255,255,255,.2)':'#FFC531');
    group(1520,470,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-230,-50,460,100,14);ctx.fill();text('단골 해마다 −10%',0,4,{f:'D',s:44,c:'#b5451b',max:430});});
    bottomShade(540);grain();
    tagBox('예시 계산 · 서울 목욕료 평균 1만 1,000원 (2026.7) · 전국 목욕탕 5,656곳 (2025)',50,640,'#e0242c','#fff',38);
    bigLine('목욕 한 번 1만 1,000원',50,790,140,'#fff',{max:1820});
    bigLine('동네 목욕탕은 몇 년 버틸까(?)',50,965,130,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
