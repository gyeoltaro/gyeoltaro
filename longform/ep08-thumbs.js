/* ── LF.08 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   A 사실형(한 시간 1,000원 → 사장님 −289원) · B 반전형(PC −375만을 라면이 메운다) · C 경고형(본전 27% vs 지금 30%) */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();pcFront(500,430,1.0,{});emoji('🍜',900,560,140);drawMascot(1720,330,.95,'shock');
    group(1250,165,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-270,-85,540,170,24);ctx.fill();text('PC 한 시간',0,-42,{s:34,w:900,c:'#59627c'});text('1,000원',0,22,{f:'D',s:100,c:C.ink});});
    text('↓',1250,290,{f:'D',s:80,c:'#fff',st:12});
    group(1250,405,1,.03,1,()=>{ctx.fillStyle='#e0242c';rr(-270,-90,540,180,24);ctx.fill();text('사장님 몫',0,-44,{s:34,w:900,c:'#ffd6d6'});text('−289원',0,24,{f:'D',s:110,c:'#fff'});});
    bottomShade(430);grain();
    tagBox('예시 PC방 60석 · 국세통계 · 보도로 계산',50,575,'#e0242c','#fff',54);
    bigLine('PC방 한 시간 1,000원',50,735,160,'#fff',{max:1820});
    bigLine('팔 때마다 289원 손해',50,930,175,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();
    const y0=230,sc=.5;ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(200,y0-3,1100,6);
    vCash(240,y0,300,375*sc,'#FF4D4D');text('PC −375만',390,y0+375*sc+60,{f:'D',s:70,c:'#FF4D4D',st:10});
    vCash(640,y0+375*sc-540*sc,300,540*sc,'#35E08A');emoji('🍜',790,y0+375*sc-540*sc-80,120);
    text('+540만',790,y0+375*sc-270*sc,{f:'D',s:72,c:'#1d2433'});
    drawMascot(1580,330,.9,'smug');
    bottomShade(520);grain();
    tagBox('한 달 · 예시 PC방 60석',50,620,'#FFC531','#1d2433',56);
    bigLine('PC 적자 375만 원을',50,775,165,'#fff',{max:1820});
    bigLine('라면이 메운다',50,955,175,'#35E08A',{max:1820});
  }else{
    nightBG();
    const X0=160,SC=30,Y=330,px=p=>X0+p*SC;
    ctx.fillStyle='rgba(255,255,255,.15)';rr(px(0),Y-55,50*SC,110,26);ctx.fill();ctx.fillStyle='#4fb6ff';rr(px(0),Y-55,30*SC,110,26);ctx.fill();
    ctx.fillStyle='#35E08A';ctx.fillRect(px(27)-6,Y-110,12,220);text('본전 27%',px(27)-30,Y-160,{f:'D',s:70,c:'#35E08A',st:10});
    text('지금 30%',px(30)+40,Y+150,{f:'D',s:70,c:'#FFD23F',st:10,a:'left'});
    drawMascot(1700,330,.75,'worry');
    bottomShade(520);grain();
    tagBox('라면을 더해도 남는 여유 3%포인트',50,620,'#FFC531','#1d2433',56);
    bigLine('자리 25%만 차면',50,775,165,'#fff',{max:1820});
    bigLine('한 달 −114만 원',50,955,175,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
