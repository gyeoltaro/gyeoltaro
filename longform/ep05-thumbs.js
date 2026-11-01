/* ── LF.05 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   A 사실형(하나 1,000원 → 점주 83원) · B 계절형(열두 달 막대, 넉 달 적자) · C 도난형(절도 3,514 → 1만 1,015건) */
function thumbMonths(x0,y0,w,h){
  ctx.save();ctx.fillStyle='rgba(255,255,255,.1)';rr(x0,y0,w,h,24);ctx.fill();
  const bw=(w-80)/12*.78,gap=(w-80)/12*.22,base=y0+h-50,sc=(h-110)/2300;
  MON.forEach((v,i)=>{const x=x0+40+i*(bw+gap),loss=mProfit(v)<0;ctx.fillStyle=loss?'#FF4D4D':'#35E08A';rr(x,base-v*sc,bw,v*sc,10);ctx.fill();});
  const ly=base-825*sc;ctx.setLineDash([16,10]);ctx.strokeStyle='#FFC531';ctx.lineWidth=6;line(x0+30,ly,x0+w-30,ly);ctx.restore();
  emoji('❄️',x0+120,y0+80,90);emoji('☀️',x0+w/2+20,y0+70,90);
}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();storeFront(560,450,1.0);drawMascot(1720,330,.95,'shock');
    group(1250,165,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-260,-85,520,170,24);ctx.fill();text('하나 팔면',0,-42,{s:34,w:900,c:'#59627c'});text('1,000원',0,22,{f:'D',s:96,c:C.ink});});
    text('↓',1250,290,{f:'D',s:80,c:'#fff',st:12});
    group(1250,405,1,.03,1,()=>{ctx.fillStyle='#e0242c';rr(-260,-90,520,180,24);ctx.fill();text('점주 손엔',0,-44,{s:34,w:900,c:'#ffd6d6'});text('83원',0,24,{f:'D',s:120,c:'#fff'});});
    bottomShade(430);grain();
    tagBox('경찰청·카드사·닐슨 자료로 계산',50,575,'#e0242c','#fff',58);
    bigLine('무인 아이스크림 1,000원 팔면',50,735,150,'#fff',{max:1820});
    bigLine('점주 손엔 83원',50,930,190,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();thumbMonths(900,40,960,490);drawMascot(430,330,.85,'worry');
    group(430,110,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-300,-70,600,140,24);ctx.fill();text('무인 아이스크림',0,4,{f:'D',s:60,c:C.ink});});
    bottomShade(500);grain();
    tagBox('1년 평균 한 달 100만 원인데',50,610,'#FFC531','#1d2433',56);
    bigLine('1년 중 넉 달은 적자',50,770,165,'#fff',{max:1820});
    bigLine('여름 돈으로 겨울 버틴다',50,955,160,'#FF4D4D',{max:1820});
  }else{
    nightBG();
    const bars=[['2021년','3,514건',3514,'#8e98ad'],['2025년','1만 1,015건',11015,'#FF4D4D']];
    bars.forEach(([l,lab,val,col],i)=>{const x=430+i*560,h=val*.03,base=470;ctx.fillStyle=col;rr(x-160,base-h,320,h,18);ctx.fill();
      text(lab,x,base-h-56,{f:'D',s:88,c:col,st:12});text(l,x,base+50,{s:52,w:900,st:8});});
    text('→',710,360,{f:'D',s:120,c:'#fff',st:12});emoji('🚨',1740,140,130);drawMascot(1700,380,.6,'shock');
    bottomShade(500);grain();
    tagBox('경찰청 · 무인점포 절도',50,610,'#FFC531','#1d2433',56);
    bigLine('무인점포 절도 4년 새 3배',50,770,160,'#fff',{max:1820});
    bigLine('하나 털리면 3개 더 팔아야',50,955,160,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
