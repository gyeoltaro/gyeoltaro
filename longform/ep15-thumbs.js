/* ── LF.15 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   2026.11.9 공부: 붕어빵·펜션 히트작이 마스코트를 장면 '안'에 세우고 숫자를 장면 속 판에 적었다 → 계산이를 노점 옆에, 숫자는 노점 가격판에.
   A 시급형(3개 2,000원 · 두 사람 시급 6,000원) · B 역설형(팥값 한 마리 20원 vs 값 +33%) · C 계단형(333 → 500 → 667 → 1,000원) */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();stall(560,330,.78);drawMascot(1060,420,.5,'worry');
    group(1520,230,1,.04,1,()=>{ctx.fillStyle='#fff7e0';rr(-300,-150,600,300,20);ctx.fill();ctx.strokeStyle='#6b4423';ctx.lineWidth=8;rr(-300,-150,600,300,20);ctx.stroke();text('3개 2,000원',0,-70,{f:'D',s:70,c:'#c0392b'});text('두 사람 시급',0,10,{s:36,w:900,c:'#59627c'});text('6,000원',0,90,{f:'D',s:90,c:'#d62f2f'});});
    bottomShade(500);grain();
    tagBox('예시 노점 · 하루 100봉지 · 둘이 500시간 · 세금 제외',50,620,'#FFC531','#1d2433',48);
    bigLine('붕어빵 3개 2,000원 받아도',50,775,150,'#fff',{max:1820});
    bigLine('사장님 시급 6,000원',50,955,165,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();beanSack(330,290,.95);fish(820,300,1.25);
    group(1340,230,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-260,-130,520,260,24);ctx.fill();text('팥값 +43.6%',0,-62,{s:44,w:900,c:'#a52a2a'});text('한 마리 20원',0,36,{f:'D',s:84,c:'#d62f2f'});});
    drawMascot(1740,380,.62,'shock');
    bottomShade(520);grain();
    tagBox('aT 팥 중도매가 2026.11 · 평년 대비 · 앙금 25g 예시',50,620,'#FFC531','#1d2433',48);
    bigLine('팥값은 한 마리 20원 올랐는데',50,775,140,'#fff',{max:1820});
    bigLine('붕어빵은 한 번에 33% 뛰었다',50,955,150,'#FFD23F',{max:1820});
  }else{
    nightBG();
    const steps=[[333,'3개 1천'],[500,'2개 1천'],[667,'3개 2천'],[1000,'1개 1천']];steps.forEach(([vv,l],i)=>{const x=160+i*330,h=vv*.42;ctx.fillStyle=i===3?'#FF4D4D':i===2?'#FFC531':'rgba(255,255,255,.35)';rr(x,560-h,300,h,14);ctx.fill();text(vv.toLocaleString('ko-KR')+'원',x+150,560-h-44,{f:'D',s:64,c:i>=2?(i===3?'#FF4D4D':'#FFC531'):'#fff'});text(l,x+150,520,{f:'D',s:40,c:'#14161c'});});
    fish(1600,230,.8);drawMascot(1700,440,.5,'think');
    bottomShade(560);grain();
    tagBox('붕어빵 한 마리 값 · 보도된 가격 단계',50,640,'#e0242c','#fff',48);
    bigLine('붕어빵 값은 왜',50,790,165,'#fff',{max:1820});
    bigLine('계단으로만 오를까',50,965,165,'#FFD23F',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
