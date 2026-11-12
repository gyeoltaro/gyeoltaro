/* ── LF.19 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다.
   A안 = T6 역설("50% 올렸는데 반값") + S1 가게 정면 · 당구대 + 신문 조각(2008 10분 1천 원),
   B안 = S6 숫자를 장면 속 물건에 (시계 두 개: 95분 → 52분) · 제목 T4 두 숫자 대비,
   C안 = S5 걱정하는 계산이를 불 꺼진 당구장 앞에 · 제목 T4 두 배율 대비(물가 vs 시급).
   상표·실존 당구장은 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();billiardHall(470,330,.6,{price:'1,500원'});poolTable(1150,300,.85,{cue:1,price:'10분 1,500원'});paper(1640,250,.42,{hl:'10분에 1천 원',rot:.06});
    bottomShade(520);grain();
    tagBox('2008년 10분 1,000원 → 지금 1,500원 · 예시 당구장',50,630,'#FFC531','#1d2433',44);
    bigLine('당구비 50% 올렸는데',50,785,140,'#fff',{max:1820});
    bigLine('시급으로 재면 반값(?)',50,960,160,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();
    minuteClock(330,300,170,95.5,'#8fb6ff');text('2008년',470,520,{f:'D',s:60,c:'#8fb6ff'});
    minuteClock(1400,300,170,52.3,'#FF4D4D');text('지금',1400,520,{f:'D',s:60,c:'#FF4D4D'});
    text('→',1000,300,{f:'D',s:140,c:'#fff'});
    bottomShade(560);grain();
    tagBox('당구 한 시간 요금으로 쓸 수 있는 알바 시간',50,640,'#35E08A','#0d1a12',48);
    bigLine('1시간 35분 → 52분',50,790,160,'#fff',{max:1820});
    bigLine('당구 한 시간 = 알바 52분',50,965,140,'#FFD23F',{max:1820});
  }else{
    nightBG();billiardHall(600,360,.62,{closed:1});drawMascot(1480,390,.7,'worry');
    group(1580,150,1,.04,1,()=>{ctx.fillStyle='#fff7e0';rr(-260,-90,520,180,20);ctx.fill();text('물가 1.43배',0,-30,{f:'D',s:50,c:'#8a5a3c'});text('시급 2.74배',0,44,{f:'D',s:50,c:'#d62f2f'});});
    bottomShade(540);grain();
    tagBox('당구비 17년 +50% · 전기요금 3년 +30%',50,640,'#e0242c','#fff',48);
    bigLine('당구비는 물가만큼 올랐는데',50,790,135,'#fff',{max:1820});
    bigLine('알바 시급은 2.7배',50,965,160,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
