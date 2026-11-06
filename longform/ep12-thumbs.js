/* ── LF.12 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   A 반전형(800g 먹어도 +5,700원 vs 빈 의자 0원) · B 비교형(손님 10% 줄면 562만 → 299만) · C 시장형(삼겹살 1인분 2만 1,321원 vs 무한리필 1만 9,900원) */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();for(let i=0;i<6;i++)plate(250+(i%2)*50,430-i*62,.95);chair(620,420,1.1,{person:1,sc:'#ff9f43'});
    group(1000,200,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-230,-85,460,170,24);ctx.fill();text('800g 먹는 손님',0,-42,{s:34,w:900,c:'#59627c'});text('+5,700원',0,22,{f:'D',s:84,c:'#1a9c5a'});});
    chair(1400,420,1.2,{empty:1});
    group(1450,170,1,.03,1,()=>{ctx.fillStyle='#e0242c';rr(-200,-85,400,170,24);ctx.fill();text('빈 의자',0,-42,{s:34,w:900,c:'#ffd6d6'});text('0원',0,24,{f:'D',s:96,c:'#fff'});});
    drawMascot(1760,360,.65,'shock');
    bottomShade(430);grain();
    tagBox('예시 무한리필 고깃집 · 1인 1만 9,900원 · 세금 제외',50,575,'#e0242c','#fff',50);
    bigLine('많이 먹는 손님보다 무서운 건',50,735,150,'#fff',{max:1820});
    bigLine('오지 않는 손님이었다',50,930,170,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();
    [['손님 그대로',562,'#35E08A','562만'],['10% 줄면',299,'#FF4D4D','299만']].forEach(([l,val,col,lab],i)=>{const y=130+i*150;text(l,520,y,{a:'right',f:'D',s:66,st:8});ctx.fillStyle=col;rr(550,y-55,val*1.6,110,24);ctx.fill();text(lab,550+val*1.6+24,y+4,{a:'left',f:'D',s:90,c:col,st:10});});
    chairRow(1450,400,3,1,.75,140);
    bottomShade(500);grain();
    tagBox('예시 무한리필 고깃집 · 한 달 남는 돈',50,600,'#FFC531','#1d2433',54);
    bigLine('손님 열 명 중 한 명 줄면',50,765,160,'#fff',{max:1820});
    bigLine('한 달 263만 원이 사라진다',50,950,160,'#FF4D4D',{max:1820});
  }else{
    nightBG();
    const base=470;[['삼겹살 1인분',21321,'#FF4D4D','2만 1,321원'],['무한리필',19900,'#FFC531','1만 9,900원']].forEach(([l,val,col,lab],i)=>{const x=330+i*460,h=val*.016;ctx.fillStyle=col;rr(x-140,base-h,280,h,18);ctx.fill();text(lab,x,base-h-44,{f:'D',s:58,c:col,st:10});text(l,x,base+40,{f:'D',s:46,st:8});});
    group(1260,200,1,-.05,1,()=>{ctx.fillStyle='#e0242c';rr(-220,-70,440,140,24);ctx.fill();text('차이 1,421원',0,6,{f:'D',s:70,c:'#fff'});});
    grill(1290,450,115,{n:6});drawMascot(1740,330,.75,'worry');
    bottomShade(520);grain();
    tagBox('서울 삼겹살 1인분 200g · 한국소비자원 참가격 2026.4',50,620,'#FFC531','#1d2433',52);
    bigLine('값을 1,000원 올리면',50,775,165,'#fff',{max:1820});
    bigLine('그냥 고깃집과 421원 차이',50,955,165,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
