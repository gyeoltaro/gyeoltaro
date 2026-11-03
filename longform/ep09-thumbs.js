/* ── LF.09 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   A 사실형(권리금 3,800만 → 못 받으면 매달 63만) · B 비교형(다 받으면 220만 vs 0원이면 157만) · C 시장형(호프주점 1년 −1,894명) */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();hofFront(440,330,.8,{});drawMascot(1740,330,.85,'shock');
    group(1210,165,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-300,-85,600,170,24);ctx.fill();text('들어갈 때 권리금',0,-42,{s:34,w:900,c:'#59627c'});text('3,800만',0,22,{f:'D',s:100,c:C.ink});});
    text('↓',1210,290,{f:'D',s:80,c:'#fff',st:12});
    group(1210,405,1,.03,1,()=>{ctx.fillStyle='#e0242c';rr(-300,-90,600,180,24);ctx.fill();text('나갈 때',0,-44,{s:34,w:900,c:'#ffd6d6'});text('0원(?)',0,24,{f:'D',s:110,c:'#fff'});});
    bottomShade(430);grain();
    tagBox('예시 호프집 · 한국부동산원 · 국세통계로 계산',50,575,'#e0242c','#fff',54);
    bigLine('호프집 권리금 3,800만 원',50,735,155,'#fff',{max:1820});
    bigLine('못 받으면 매달 63만 원 월세',50,930,160,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();
    const X0=330,sc=4.2;[['다 받으면',220,'#35E08A'],['0원이면',157,'#FF4D4D']].forEach(([l,val,col],i)=>{const y=150+i*170;text(l,X0-30,y,{a:'right',f:'D',s:66,st:10});ctx.fillStyle=col;rr(X0,y-60,val*sc,120,24);ctx.fill();text(val+'만',X0+val*sc+24,y+4,{a:'left',f:'D',s:96,c:col,st:12});});
    drawMascot(1700,300,.8,'worry');
    bottomShade(480);grain();
    tagBox('5년 장사 · 한 달 남는 돈 · 예시 호프집',50,590,'#FFC531','#1d2433',56);
    bigLine('같은 호프집 같은 5년',50,765,165,'#fff',{max:1820});
    bigLine('나갈 때 권리금이 가른다',50,950,170,'#FFD23F',{max:1820});
  }else{
    nightBG();
    const base=490,sc=.016,bw=300;[['2025.8',21401,'#4fb6ff'],['2026.8',19507,'#FF4D4D']].forEach(([l,val,col],i)=>{const x=330+i*420;vCash(x-bw/2,base-val*sc,bw,val*sc,col);text(won(val),x,base-val*sc-50,{f:'D',s:76,c:i?'#FF4D4D':'#fff',st:10});text(l,x,base+44,{s:40,w:900,st:6});});
    emoji('🍺',1250,250,190);drawMascot(1700,330,.8,'worry');
    bottomShade(520);grain();
    tagBox('국세통계 · 호프주점 사업자 수',50,620,'#FFC531','#1d2433',56);
    bigLine('호프집 1년 새 1,894명 감소',50,775,165,'#fff',{max:1820});
    bigLine('권리금 받을 사람이 준다',50,955,170,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
