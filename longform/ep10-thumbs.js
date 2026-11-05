/* ── LF.10 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   A 사실형(6개월 본전 → 석 달 늦으면 −7,525만) · B 비교형(같은 7,000만, 세 가게 누적선) · C 시장형(개업 71 vs 폐업 118) */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();shopFront(430,320,.75,{closed:1});drawMascot(1740,330,.85,'shock');
    group(1180,160,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-290,-85,580,170,24);ctx.fill();text('정점엔 본전',0,-42,{s:34,w:900,c:'#59627c'});text('6개월',0,22,{f:'D',s:100,c:C.ink});});
    text('↓',1180,290,{f:'D',s:80,c:'#fff',st:12});
    group(1180,405,1,.03,1,()=>{ctx.fillStyle='#e0242c';rr(-310,-90,620,180,24);ctx.fill();text('석 달 늦게 열면',0,-44,{s:34,w:900,c:'#ffd6d6'});text('−7,525만',0,24,{f:'D',s:100,c:'#fff'});});
    bottomShade(430);grain();
    tagBox('예시 탕후루 가게 · 행안부 인허가 · 카드 매출 보도로 계산',50,575,'#e0242c','#fff',50);
    bigLine('탕후루 6개월이면 본전?',50,735,155,'#fff',{max:1820});
    bigLine('석 달 늦으면 5,000만 원 차이',50,930,150,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();
    const X0=150,DX=78,yv=val=>90+(1000-val)*(380/12000);
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;line(X0,yv(0),X0+DX*12,yv(0));text('본전',X0-14,yv(0),{a:'right',f:'D',s:40,c:'#35E08A',st:8});
    STORES.forEach(st=>{const cum=cumOf(st.i0);ctx.strokeStyle=st.col;ctx.lineWidth=12;ctx.lineJoin='round';ctx.beginPath();cum.forEach((c,j)=>{const x=X0+j*DX,y=yv(c);j?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
      text(st.end,X0+12*DX+20,yv(cum[12]),{a:'left',f:'D',s:54,c:st.col,st:10});});
    drawMascot(1760,250,.65,'worry');
    bottomShade(500);grain();
    tagBox('같은 가게 · 같은 7,000만 · 1년 뒤 (예시)',50,600,'#FFC531','#1d2433',54);
    bigLine('문 연 달만 달랐다',50,765,165,'#fff',{max:1820});
    bigLine('탕후루 1년 뒤 −1억까지',50,950,165,'#FF4D4D',{max:1820});
  }else{
    nightBG();
    const X0=430,sc=.62;[['2023 개업',1374,'#4fb6ff'],['2023 폐업',72,'#FF4D4D'],['2024 개업',71,'#4fb6ff'],['2024 폐업',118,'#FF4D4D']].forEach(([l,val,col],i)=>{const y=110+i*105;text(l,X0-24,y,{a:'right',f:'D',s:50,st:8});ctx.fillStyle=col;rr(X0,y-38,Math.max(10,val*sc),76,18);ctx.fill();text(won(val),X0+Math.max(10,val*sc)+20,y+4,{a:'left',f:'D',s:64,c:col,st:10});});
    drawMascot(1720,300,.8,'shock');
    bottomShade(520);grain();
    tagBox('행정안전부 인허가 데이터 · 2024년은 5월 13일까지',50,620,'#FFC531','#1d2433',52);
    bigLine('1,374곳 열고 1년 만에',50,775,165,'#fff',{max:1820});
    bigLine('닫는 가게가 더 많아졌다',50,955,165,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
