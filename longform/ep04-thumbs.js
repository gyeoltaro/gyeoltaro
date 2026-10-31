/* ── LF.04 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다.
   A 사실형(한 잔 1,800원 → 점주 380원) · B 질문형(하루 296잔 아래면 적자) · C 비교형(점포 2배 · 본사 매출 5.6배 · 점주 매출 +10.7%) */
function thumbGraph(x0,y0,w,h){
  // 한 달 남는 돈 선 그래프 (잔 수 200→430, 296잔에서 0원)
  ctx.save();ctx.fillStyle='rgba(255,255,255,.1)';rr(x0,y0,w,h,24);ctx.fill();
  const Y0=y0+h*.62,mx=n=>x0+60+(w-120)*(n-200)/230,yv=v=>Y0-v*(h*.0007*1.0);
  ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=5;line(x0+40,Y0,x0+w-40,Y0);
  ctx.lineWidth=18;ctx.lineCap='round';
  for(let n=200;n<430;n+=3){const v=4.35*n-1285,v2=4.35*Math.min(430,n+3)-1285;ctx.strokeStyle=v<0?'#FF4D4D':'#35E08A';line(mx(n),yv(v),mx(Math.min(430,n+3)),yv(v2));}
  ctx.fillStyle='#FFC531';ctx.beginPath();ctx.arc(mx(296),Y0,26,0,7);ctx.fill();
  ctx.restore();
  tagBox('296잔 = 0원',mx(296)-30,Y0-96,'#FFC531','#1d2433',54);
  text('적자',mx(230),Y0+130,{f:'D',s:80,c:'#FF4D4D',st:12});text('흑자',mx(380),Y0-190,{f:'D',s:80,c:'#35E08A',st:12});
}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();cafeFront(560,470,1.05);drawMascot(1720,330,.95,'shock');
    group(1250,165,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-260,-85,520,170,24);ctx.fill();text('한 잔 팔면',0,-42,{s:34,w:900,c:'#59627c'});text('1,800원',0,22,{f:'D',s:96,c:C.ink});});
    text('↓',1250,290,{f:'D',s:80,c:'#fff',st:12});
    group(1250,405,1,.03,1,()=>{ctx.fillStyle='#e0242c';rr(-260,-90,520,180,24);ctx.fill();text('점주 손엔',0,-44,{s:34,w:900,c:'#ffd6d6'});text('380원',0,24,{f:'D',s:110,c:'#fff'});});
    bottomShade(430);grain();
    tagBox('감사보고서·공정위 자료로 계산',50,575,'#e0242c','#fff',58);
    bigLine('아메리카노 1,800원 팔면',50,735,160,'#fff',{max:1820});
    bigLine('점주 손엔 380원',50,930,190,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();thumbGraph(980,40,880,470);drawMascot(430,330,.85,'worry');
    group(430,120,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-300,-70,600,140,24);ctx.fill();text('아메리카노 1,800원',0,4,{f:'D',s:60,c:C.ink});});
    bottomShade(470);grain();
    tagBox('하루 400잔 → 월 455만 원일 때',50,600,'#FFC531','#1d2433',56);
    bigLine('저가 커피 하루 296잔',50,765,165,'#fff',{max:1820});
    bigLine('아래면 한 달 적자',50,950,170,'#FF4D4D',{max:1820});
  }else{
    nightBG();
    const bars=[['점포 수','2배',2.09,'#8e98ad'],['본사 매출','5.6배',5.64,'#FF4D4D'],['점주 매출','+10.7%',1.107,'#35E08A']];
    bars.forEach(([l,lab,val,col],i)=>{const x=330+i*480,h=val*52,base=430;ctx.fillStyle=col;rr(x-140,base-h,280,h,18);ctx.fill();
      text(lab,x,base-h-52,{f:'D',s:92,c:col,st:12});text(l,x,base+48,{s:50,w:900,st:8});});
    drawMascot(1740,300,.7,'shock');
    bottomShade(470);grain();
    tagBox('한 저가 커피 본사 · 2021 → 2024',50,610,'#FFC531','#1d2433',56);
    bigLine('점포는 2배, 본사 매출은 5.6배',50,770,150,'#fff',{max:1820});
    bigLine('점주 매출은 겨우 +10.7%',50,955,170,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
