/* ── LF.06 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   A 사실형(1만 8천 원 → 배달앱 쪽 5,236원 · 사장님 −176원) · B 소액형(1만 원 주문 44%) · C 반전형(배달 끊으면 402만 → 172만) */
function thumbBars(x0,y0){
  const base=y0+420,bw=150,gap=40;ORD.forEach(([o,p],i)=>{const x=x0+i*(bw+gap),h=p*8.2;ctx.fillStyle=i===0?'#FF4D4D':'#B18CFF';rr(x,base-h,bw,h,14);ctx.fill();
    text(p.toFixed(0)+'%',x+bw/2,base-h-40,{f:'D',s:i===0?80:52,c:i===0?'#FF4D4D':'#fff',st:10});text((o/10000)+'만',x+bw/2,base+40,{f:'D',s:44,st:8});});
}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();storeFront(540,450,1.0,{noBike:1});emoji('🛵',930,560,150);drawMascot(1720,330,.95,'shock');
    group(1250,165,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-270,-85,540,170,24);ctx.fill();text('배달 주문 한 건',0,-42,{s:34,w:900,c:'#59627c'});text('18,000원',0,22,{f:'D',s:96,c:C.ink});});
    text('↓',1250,290,{f:'D',s:80,c:'#fff',st:12});
    group(1250,405,1,.03,1,()=>{ctx.fillStyle='#e0242c';rr(-270,-90,540,180,24);ctx.fill();text('사장님 몫',0,-44,{s:34,w:900,c:'#ffd6d6'});text('−176원',0,24,{f:'D',s:110,c:'#fff'});});
    bottomShade(430);grain();
    tagBox('참여연대 · 중기부 자료로 계산',50,575,'#e0242c','#fff',58);
    bigLine('떡볶이 배달 1만 8천 원',50,735,160,'#fff',{max:1820});
    bigLine('배달앱 쪽 5,236원',50,930,190,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();thumbBars(860,60);drawMascot(400,330,.85,'worry');
    group(400,110,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-300,-70,600,140,24);ctx.fill();text('주문 금액별 떼이는 비율',0,4,{f:'D',s:46,c:C.ink});});
    bottomShade(520);grain();
    tagBox('배달비 3,400원은 주문이 작아도 그대로',50,620,'#FFC531','#1d2433',52);
    bigLine('1만 원 주문이면 44%',50,775,165,'#fff',{max:1820});
    bigLine('작을수록 더 떼인다',50,955,165,'#FF4D4D',{max:1820});
  }else{
    nightBG();
    const bars=[['지금','402만',402,'#35E08A'],['배달 끊으면','172만',172,'#FF4D4D']];
    bars.forEach(([l,lab,val,col],i)=>{const x=480+i*560,h=val*.9,base=480;ctx.fillStyle=col;rr(x-160,base-h,320,h,18);ctx.fill();
      text(lab,x,base-h-56,{f:'D',s:96,c:col,st:12});text(l,x,base+50,{s:50,w:900,st:8});});
    text('→',760,330,{f:'D',s:120,c:'#fff',st:12});emoji('🛵',1720,130,130);drawMascot(1680,380,.6,'shock');
    bottomShade(520);grain();
    tagBox('한 달 남는 돈 · 예시 분식집',50,620,'#FFC531','#1d2433',56);
    bigLine('한 건은 적자인데',50,775,165,'#fff',{max:1820});
    bigLine('배달을 못 끊는 이유',50,955,165,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
