/* ── LF.14 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   A 역설형(밀가루 5% 내리면 빵 하나 4원) · B 비교형(100원 내리면 사장님 몫 180만 → 65만) · C 시급형(새벽 4시 빵집 사장님 시급 4,615원) */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===1){
    nightBG();
    [['빵값 그대로',180,'#35E08A','180만'],['100원 내리면',65,'#FF4D4D','65만']].forEach(([l,val,col,lab],i)=>{const y=140+i*160;text(l,560,y,{a:'right',f:'D',s:66,st:8});ctx.fillStyle=col;rr(590,y-58,val*4.2,116,24);ctx.fill();text(lab,590+val*4.2+24,y+4,{a:'left',f:'D',s:96,c:col,st:10});});
    bread(1720,200,1.0);drawMascot(1740,470,.48,'shock');
    bottomShade(500);grain();
    tagBox('예시 동네 빵집 · 사장님 한 달 몫 · 손님 수 그대로',50,610,'#FFC531','#1d2433',52);
    bigLine('빵값 100원 내렸더니',50,770,165,'#fff',{max:1820});
    bigLine('사장님 몫 180만 → 65만',50,955,165,'#FF4D4D',{max:1820});
  }else if(v===2){
    nightBG();bakeryFront(520,330,.62,{light:true});oven(1180,320,.75);
    group(1640,200,1,.04,1,()=>{ctx.fillStyle='#e0242c';rr(-230,-90,460,180,24);ctx.fill();text('사장님 시급',0,-44,{s:34,w:900,c:'#ffd6d6'});text('4,615원',0,26,{f:'D',s:90,c:'#fff'});});
    drawMascot(1700,440,.55,'worry');
    bottomShade(500);grain();
    tagBox('예시 동네 빵집 · 새벽 4시부터 하루 13시간 · 세금 제외',50,610,'#e0242c','#fff',48);
    bigLine('새벽 4시에 굽는 빵집',50,770,165,'#fff',{max:1820});
    bigLine('사장님 시급, 최저의 절반 아래',50,955,160,'#FFD23F',{max:1820});
  }else if(v===0){
    nightBG();flourBag(360,300,1.05,{rot:-.05});bread(820,330,1.25);
    group(1250,250,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-250,-120,500,240,24);ctx.fill();text('밀가루 −5%',0,-58,{s:44,w:900,c:'#1f6fd1'});text('빵 하나 4원',0,36,{f:'D',s:96,c:'#d62f2f'});});
    drawMascot(1720,380,.68,'shock');
    bottomShade(520);grain();
    tagBox('예시 빵 1,500원 · 밀가루 80원 가정 · 2026년 인하 보도 기준',50,620,'#FFC531','#1d2433',50);
    bigLine('밀가루값 내렸는데',50,775,165,'#fff',{max:1820});
    bigLine('빵 하나에선 겨우 4원',50,955,150,'#FFD23F',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
