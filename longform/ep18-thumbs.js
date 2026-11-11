/* ── LF.18 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다.
   A안 = T1 따옴표 + S4 따옴표 글씨 (예시 사장님 말 "하루 쉬면 54만 원 손해" → 실제 32만 원) · 백반집 + 한 상,
   B안 = S6 숫자를 장면 속 물건에 (달력 + 일요일 장사 영수증) · 제목 T6 역설(열어도 시급 5,944원),
   C안 = S5 걱정하는 계산이를 셔터 내린 가게 앞에 · 제목 T4 두 금액 대비.
   상표·실존 식당은 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();bapjip(560,330,.62);baekbanSet(1400,300,.95,{price:'9,000원'});
    bottomShade(520);grain();
    tagBox('예시 백반집 · 김치찌개 백반 9,000원 × 하루 60그릇 · 세금 제외',50,630,'#FFC531','#1d2433',44);
    bigLine('"하루 쉬면 54만 원 손해"',50,785,128,'#fff',{max:1820});
    bigLine('실제로는 32만 원(?)',50,960,160,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();calMonth(540,320,.82,{st:d=>(d-1)%7===0?'sunopen':'open',title:'일요일도 연다면'});
    receipt(1440,300,.92,[['남는 돈 30그릇','16만 2천'],['알바 8시간','−8만 2,560','#d62f2f'],['가스·전기','−2만','#d62f2f'],['사장님 10시간','5만 9,440','#1f8a50']],{title:'일요일 장사 (예시)',rot:.03});
    bottomShade(540);grain();
    tagBox('예시 백반집 · 일요일 손님 = 평일 절반',50,640,'#35E08A','#0d1a12',48);
    bigLine('일요일에 문 열면',50,790,150,'#fff',{max:1820});
    bigLine('사장님 시급 5,944원',50,965,165,'#FFD23F',{max:1820});
  }else{
    nightBG();bapjip(620,350,.66,{closed:1});drawMascot(1480,390,.7,'worry');
    group(1580,150,1,.04,1,()=>{ctx.fillStyle='#fff7e0';rr(-250,-90,500,180,20);ctx.fill();text('매출 54만?',0,-30,{f:'D',s:50,c:'#8a5a3c'});text('빠지는 돈 32만',0,44,{f:'D',s:50,c:'#d62f2f'});});
    bottomShade(540);grain();
    tagBox('예시 백반집 · 재료비 40% · 고정비 하루 19만 8천',50,640,'#e0242c','#fff',48);
    bigLine('하루 쉬면 32만 원 빠지고',50,790,140,'#fff',{max:1820});
    bigLine('열면 6만 원 남는다',50,965,165,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
