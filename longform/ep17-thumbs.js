/* ── LF.17 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 이번 편은 '4. 시험 대기' 2번을 가린다:
   A안 = S1 아래 큰 글씨만 (카페 장면 + 글씨, 장면 속 숫자 없음) · 제목 T6/T4,
   B안 = S6 숫자를 장면 속 물건에 (도장 쿠폰 + 영수증 숫자) · 제목 T3,
   C안 = 다른 감정 S5 (걱정하는 계산이를 카페 안에, 원두 자루) · 제목 T7.
   세 안 모두 같은 숫자(공짜 한 잔 400원 · 단골이면 3,000원 · 3,000원 아메리카노)를 쓴다. 상표·실존 카페는 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();cafeFront(700,330,.62);coffeeCup(1420,300,1.05,{free:1,label:'FREE',sleeve:'#d62f2f'});
    bottomShade(520);grain();
    tagBox('예시 카페 · 아메리카노 3,000원 · 도장 10개 = 1잔 · 세금 제외',50,630,'#FFC531','#1d2433',46);
    bigLine('공짜 커피 한 잔, 새 손님엔 400원',50,785,128,'#fff',{max:1820});
    bigLine('단골엔 3,000원(?)',50,960,160,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();stampCard(560,300,1.05,10);
    receipt(1440,300,.95,[['아메리카노','3,000'],['공짜 한 잔 재료','−400','#d62f2f'],['단골이면','−3,000','#d62f2f']],{title:'도장 영수증 (예시)',rot:.03});
    bottomShade(520);grain();
    tagBox('예시 카페 · 한 잔 더 팔면 2,600원 남는다',50,630,'#35E08A','#0d1a12',48);
    bigLine('도장 열 개의 진짜 값',50,785,150,'#fff',{max:1820});
    bigLine('400원 vs 3,000원',50,960,170,'#FFD23F',{max:1820});
  }else{
    nightBG();cafeFront(620,360,.66,{dark:1});
    for(let i=0;i<14;i++)beanDot(1180+(i%5)*56,300+Math.floor(i/5)*50,24,i);drawMascot(1520,360,.66,'worry');
    group(1640,150,1,.04,1,()=>{ctx.fillStyle='#fff7e0';rr(-250,-90,500,180,20);ctx.fill();text('원두값 +20%',0,-30,{f:'D',s:50,c:'#8a5a3c'});text('= 단골 두 명',0,44,{f:'D',s:50,c:'#d62f2f'});});
    bottomShade(540);grain();
    tagBox('예시 카페 · 하루 100잔 · 원두 비중 7.4%',50,640,'#e0242c','#fff',48);
    bigLine('원두값보다 무서운 건',50,790,150,'#fff',{max:1820});
    bigLine('단골 두 명이었다',50,965,165,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
/* 영수증 (숫자를 장면 속 물건에, LF.16 과 같은 꼴) */
function receipt(x,y,s,rows,o={}){group(x,y,s,o.rot||0,o.alpha??1,()=>{
  const h=110+rows.length*70;ctx.fillStyle='#fffdf6';ctx.beginPath();ctx.moveTo(-230,-h/2);ctx.lineTo(230,-h/2);ctx.lineTo(230,h/2);for(let i=0;i<12;i++){ctx.lineTo(230-(i+.5)*38.3,h/2+(i%2?0:14));}ctx.lineTo(-230,h/2);ctx.closePath();ctx.fill();
  text(o.title||'영수증',0,-h/2+46,{f:'D',s:40,c:'#1d2433'});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-200,-h/2+84,200,-h/2+84);ctx.setLineDash([]);
  rows.forEach(([l,v,c],i)=>{const yy=-h/2+130+i*70;text(l,-200,yy,{a:'left',s:34,w:900,c:'#3a4256'});text(v,200,yy,{a:'right',f:'D',s:40,c:c||'#1d2433'});});
});}
