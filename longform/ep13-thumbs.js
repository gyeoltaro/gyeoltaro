/* ── LF.13 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   A 반전형(옆집도 내리면 둘 다 256만) · B 역설형(소주 1,500원 현수막 vs 들여오는 값 1,600원) · C 비교형(사장님 몫 729만 → 256만) */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===1){
    nightBG();grill(330,330,210,{n:7});
    banner(900,190,1.05,'1,500원',{rot:-.03});
    sojuBottle(1330,520,1.25);
    group(1640,230,1,.04,1,()=>{ctx.fillStyle='#e0242c';rr(-230,-90,460,180,24);ctx.fill();text('들여오는 값',0,-44,{s:34,w:900,c:'#ffd6d6'});text('1,600원',0,26,{f:'D',s:90,c:'#fff'});});
    drawMascot(1720,470,.55,'shock');
    bottomShade(470);grain();
    tagBox('예시 고깃집 · 매입가 2023~2024 보도 기준 · 세금 제외',50,590,'#e0242c','#fff',48);
    bigLine('소주 1,500원 고깃집',50,750,165,'#fff',{max:1820});
    bigLine('한 병 팔 때마다 −100원',50,940,165,'#FFD23F',{max:1820});
  }else if(v===2){
    nightBG();
    [['소주 5,000원',729,'#35E08A','729만'],['소주 1,500원',256,'#FF4D4D','256만']].forEach(([l,val,col,lab],i)=>{const y=140+i*160;text(l,560,y,{a:'right',f:'D',s:66,st:8});ctx.fillStyle=col;rr(590,y-58,val*1.3,116,24);ctx.fill();text(lab,590+val*1.3+24,y+4,{a:'left',f:'D',s:96,c:col,st:10});});
    sojuBottle(1700,500,1.05);
    bottomShade(500);grain();
    tagBox('예시 고깃집 · 사장님 한 달 몫 · 손님 수 그대로',50,610,'#FFC531','#1d2433',52);
    bigLine('소주값 내렸더니',50,770,165,'#fff',{max:1820});
    bigLine('사장님 몫 473만 원 증발',50,955,165,'#FF4D4D',{max:1820});
  }else if(v===0){
    nightBG();
    shopFront(470,330,.62,{ban:'1,500원'});shopFront(1250,330,.62,{ban:'1,500원',name:'옆집 고깃집',sign:'#2c5aa0'});
    group(860,110,1,-.04,1,()=>{ctx.fillStyle='#e0242c';rr(-260,-60,520,120,24);ctx.fill();text('둘 다 256만 원',0,6,{f:'D',s:62,c:'#fff'});});
    drawMascot(1740,380,.7,'worry');
    bottomShade(520);grain();
    tagBox('예시 계산 · 둘 다 5,000원일 땐 둘 다 729만 원',50,620,'#FFC531','#1d2433',52);
    bigLine('옆집도 따라 내리면',50,775,165,'#fff',{max:1820});
    bigLine('손님은 그대로, 술값만 사라진다',50,955,150,'#FFD23F',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
