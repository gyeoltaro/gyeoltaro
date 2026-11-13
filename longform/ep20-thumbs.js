/* ── LF.20 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(4,500원 → 405원)를 쓴다.
   A안 = T6 역설 + 금액("팔아도 405원") · S1 아래 큰 글씨 두 줄 + S2 편의점 정면 + 담배 한 갑 가격표,
   B안 = 시험 대기 1순위 T1 따옴표 · S4 따옴표 글씨 + 동전 45개 판(빨강 33 · 초록 4),
   C안 = S5 걱정하는 계산이를 가게 안에 + 매출 40% → 몫 17% 두 칸.
   상표·실존 편의점은 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();cvsFront(520,330,.72,{});cigPack(1200,330,1.0,{price:'4,500원'});
    group(1640,270,1,.04,1,()=>{ctx.fillStyle='#fff';rr(-200,-110,400,220,22);ctx.fill();text('사장님 몫',0,-50,{s:38,w:900,c:'#59627c'});text('405원',0,30,{f:'D',s:96,c:'#1f8a50'});});
    bottomShade(520);grain();
    tagBox('세금 3,323원 · 마진율 9% (보도) · 예시 편의점',50,640,'#FFC531','#1d2433',44);
    bigLine('담배 4,500원 팔면',50,790,150,'#fff',{max:1820});
    bigLine('사장님 몫은 405원(?)',50,965,160,'#35E08A',{max:1820});
  }else if(v===1){
    nightBG();
    const x0=120,y0=60,cell=104,r=cell*.44;
    for(let i=0;i<45;i++){const cx=x0+(i%9)*cell+cell/2,cy=y0+Math.floor(i/9)*cell+cell/2;ctx.fillStyle=i<33?'#FF4D4D':i<41?'#6FA8FF':'#35E08A';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=3;ctx.stroke();}
    cigPack(1500,330,1.1,{price:'4,500원'});
    bottomShade(560);grain();
    tagBox('100원 동전 45개 중 사장님 몫은 4개',50,650,'#35E08A','#0d1a12',48);
    bigLine('"담배 많이 팔면',50,800,150,'#fff',{max:1820});
    bigLine('남는 거 아니에요?"',50,970,160,'#FFD23F',{max:1820});
  }else{
    nightBG();cvsFront(560,360,.7,{});drawMascot(1180,380,.75,'worry');
    group(1620,250,1,.04,1,()=>{ctx.fillStyle='#fff7e0';rr(-250,-150,500,300,20);ctx.fill();text('매출',-120,-80,{f:'D',s:40,c:'#59627c'});text('40%',-120,0,{f:'D',s:90,c:'#2b4c7e'});text('몫',120,-80,{f:'D',s:40,c:'#59627c'});text('17%',120,0,{f:'D',s:90,c:'#d62f2f'});text('담배 비중 (예시 가게)',0,100,{s:30,w:900,c:'#8a5a3c'});});
    bottomShade(540);grain();
    tagBox('카드 수수료는 세금까지 든 4,500원에 붙는다',50,640,'#e0242c','#fff',46);
    bigLine('편의점 매출 1위 담배',50,790,145,'#fff',{max:1820});
    bigLine('남는 돈은 꼴찌',50,965,170,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
