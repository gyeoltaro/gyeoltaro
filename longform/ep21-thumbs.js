/* ── LF.21 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(장부 +75만 · 통장 −50만)를 쓴다.
   A안 = T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장부·통장(장면 속 물건)에,
   B안 = 시험 대기 1순위 T1 따옴표 · S4 따옴표 글씨 + 칼국숫집 + 층 나뉜 그릇,
   C안 = S5 걱정하는 계산이를 가게 안에 + 그릇 하나 장부 1,875 / 통장 1,250 판.
   상표·실존 가게는 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();kalBowl(420,300,.62,{fill:kalFull,split:true,noodle:1,steam:1});
    ledgerBook(1010,300,.78,'+75만','#1f8a50',{sub:'이번 달 이익',as:110});
    bankBook(1560,300,.78,'−50만','#d62f2f',{sub:'이번 달 남은 돈',as:110});
    bottomShade(520);grain();
    tagBox('대출 원금은 장부에 안 나온다 · 예시 칼국숫집',50,640,'#FFC531','#1d2433',44);
    bigLine('장부는 75만 원 흑자',50,790,150,'#fff',{max:1820});
    bigLine('통장은 50만 원 적자(?)',50,965,160,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();kalShop(520,330,.72,{price:'1만 원'});kalBowl(1380,320,.7,{fill:kalFull,split:true,noodle:1,steam:1});
    group(1660,110,1,.05,1,()=>{ctx.fillStyle='#c2185b';rr(-170,-56,340,112,18);ctx.fill();text('원금 625원',0,4,{f:'D',s:52,c:'#fff'});});
    bottomShade(560);grain();
    tagBox('장부 +75만 · 통장 −50만 (예시 가게)',50,650,'#35E08A','#0d1a12',48);
    bigLine('"장사는 남는데',50,800,150,'#fff',{max:1820});
    bigLine('통장이 비어요"',50,970,160,'#FFD23F',{max:1820});
  }else{
    nightBG();kalShop(520,360,.7,{});drawMascot(1120,380,.75,'worry');
    group(1620,270,1,.04,1,()=>{ctx.fillStyle='#fff7e0';rr(-260,-170,520,340,20);ctx.fill();text('칼국수 한 그릇',0,-110,{f:'D',s:38,c:'#59627c'});text('장부',-120,-40,{f:'D',s:40,c:'#59627c'});text('1,875',-120,40,{f:'D',s:84,c:'#1f8a50'});text('통장',120,-40,{f:'D',s:40,c:'#59627c'});text('1,250',120,40,{f:'D',s:84,c:'#1f6f8b'});text('원 · 예시 가게',0,125,{s:30,w:900,c:'#8a5a3c'});});
    bottomShade(540);grain();
    tagBox('거치 1년이 끝나는 13개월째, 통장 375만 → 250만',50,640,'#e0242c','#fff',44);
    bigLine('칼국수 한 그릇에서',50,790,145,'#fff',{max:1820});
    bigLine('625원이 사라진다',50,965,165,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
