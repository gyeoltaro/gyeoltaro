/* ── LF.07 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   A 좌석형(70석 중 건물주 29석 · 사장님 딱 10석) · B 가동률형(70석 중 쓰이는 건 12%) · C 안전거리형(회원 35명 빠지면 0원) */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();seatGrid(60,30,{full:1,sc:.7});drawMascot(1720,330,.95,'shock');
    group(1250,130,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-270,-70,540,140,24);ctx.fill();text('한 달 매출 1,225만 원',0,-6,{f:'D',s:46,c:C.ink,max:500});});
    group(1250,330,1,.03,1,()=>{ctx.fillStyle='#e0242c';rr(-270,-90,540,180,24);ctx.fill();text('사장님 몫',0,-44,{s:34,w:900,c:'#ffd6d6'});text('175만 원',0,24,{f:'D',s:100,c:'#fff'});});
    bottomShade(430);grain();
    tagBox('KB국민카드 · 한국부동산원 자료로 계산',50,575,'#e0242c','#fff',54);
    bigLine('건물주는 29석',50,735,160,'#fff',{max:1820});
    bigLine('사장님은 딱 10석',50,930,190,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();ring(520,300,230,.12,'#FF4D4D',80);text('12%',520,300,{f:'D',s:150,c:'#FF4D4D',st:12});drawMascot(1500,300,.95,'worry');
    group(1160,130,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-300,-70,600,140,24);ctx.fill();text('70석 · 24시간 열어 두면',0,4,{f:'D',s:46,c:C.ink,max:560});});
    bottomShade(520);grain();
    tagBox('시간당 2,000원 · 회원 250명 가정',50,620,'#FFC531','#1d2433',52);
    bigLine('70석 중 쓰이는 건',50,775,165,'#fff',{max:1820});
    bigLine('겨우 12%',50,955,190,'#FF4D4D',{max:1820});
  }else{
    nightBG();
    ctx.fillStyle='rgba(255,255,255,.12)';rr(160,150,1600,120,24);ctx.fill();ctx.fillStyle='#35E08A';rr(160,150,1600*250/300,120,24);ctx.fill();
    ctx.save();ctx.setLineDash([16,12]);ctx.strokeStyle='#FF4D4D';ctx.lineWidth=10;line(160+1600*215/300,110,160+1600*215/300,310);ctx.restore();
    text('본전 215명',160+1600*215/300,70,{f:'D',s:56,c:'#FF4D4D',st:10});text('지금 250명',160+1600*250/300-30,350,{f:'D',s:56,c:'#35E08A',st:10});
    text('안전거리 35명',960,470,{f:'D',s:120,c:'#fff',st:14});drawMascot(1690,470,.55,'shock');
    bottomShade(520);grain();
    tagBox('월 매출 1,225만 원 · 70석 · 예시 가정',50,620,'#FFC531','#1d2433',52);
    bigLine('회원 35명만 빠져도',50,775,165,'#fff',{max:1820});
    bigLine('남는 돈 0원',50,955,190,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
