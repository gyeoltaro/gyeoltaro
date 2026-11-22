/* ── LF.29 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(커트 2만 원 · 카드 수수료 80원 · 현금 할인 2,000원 = 25배)를 쓴다.
   A안 = 우리 채널 1위 꼴 T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(카드 단말기 화면·영수증)에,
   B안 = 시험 대기 1순위 T1 따옴표 — 예시 대사라는 딱지를 붙인다 · S4 따옴표 글씨 + 미용실 장면,
   C안 = T3 숫자 + 질문(답 숨김) · S5 걱정하는 계산이를 미용실 의자 옆에.
   상표·실존 가게는 그리지 않는다. 핵심 그림은 위 55%. */
function thumbReceipt29(x,y,s){group(x,y,s,.05,1,()=>{ctx.fillStyle='#fffdf6';rr(-280,-220,560,440,14);ctx.fill();
  text('커트 2만 원 (예시)',0,-165,{f:'D',s:42,c:'#1d2433',max:520});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-240,-125,240,-125);ctx.setLineDash([]);
  text('카드 수수료',-240,-70,{a:'left',s:38,w:900,c:'#3a4256'});text('80원',240,-70,{a:'right',f:'D',s:52,c:'#1d2433'});
  text('현금 할인',-240,10,{a:'left',s:38,w:900,c:'#3a4256'});text('2,000원',240,10,{a:'right',f:'D',s:52,c:'#d62f2f'});
  line(-240,60,240,60);text('할인 나누기 수수료',-240,125,{a:'left',f:'D',s:36,c:'#d62f2f'});text('25배',240,125,{a:'right',f:'D',s:72,c:'#d62f2f'});});}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();salon29(430,330,.95,{});terminal29(900,330,1.05,{amt:'수수료 80'});
    thumbReceipt29(1500,300,1.0);
    bottomShade(540);grain();
    tagBox('예시 · 1인 미용실 · 영세 가맹점 신용카드 수수료 0.40% (금융위)',50,640,'#FFC531','#1d2433',42);
    bigLine('수수료 80원 아끼려다',50,790,140,'#fff',{max:1820});
    bigLine('2,000원을 깎아 줬다',50,965,150,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();salon29(470,320,1.0,{});
    group(1340,250,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-470,-120,940,240,34);ctx.fill();ctx.beginPath();ctx.moveTo(-300,120);ctx.lineTo(-360,190);ctx.lineTo(-210,120);ctx.fill();text('현금이면',0,-50,{f:'D',s:70,c:'#1d2433'});text('2,000원 빼 드릴게요',0,50,{f:'D',s:78,c:'#d62f2f',max:880});});
    bottomShade(560);grain();
    tagBox('예시 대사 · 커트 2만 원 · 카드 수수료는 80원',50,650,'#35E08A','#0d1a12',42);
    bigLine('"현금이면 2,000원 빼 드려요"',50,800,124,'#fff',{max:1820});
    bigLine('아끼는 돈은 80원(?)',50,970,150,'#FFD23F',{max:1820});
  }else{
    nightBG();salon29(430,320,.95,{});chair29(960,330,1.3,false);drawMascot(1260,330,.95,'worry');
    group(1640,280,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-220,-110,440,220,18);ctx.fill();text('카드 수수료',0,-50,{f:'D',s:44,c:'#59627c'});text('?원',0,40,{f:'D',s:96,c:'#b5451b'});});
    bottomShade(540);grain();
    tagBox('예시 계산 · 성인 여성 커트 평균 1만 9,558원 (참가격 2025.8)',50,640,'#e0242c','#fff',40);
    bigLine('커트 2만 원, 카드로 받으면',50,790,136,'#fff',{max:1820});
    bigLine('사장님이 내는 수수료는 얼마?',50,965,130,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
