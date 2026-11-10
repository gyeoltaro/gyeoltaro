/* ── LF.16 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다: A안 = 가장 센 꼴(S1 아래 큰 글씨 + S6 숫자를 장면 속 영수증에 · 제목 T6 역설 + 금액),
   B안 = 시험 대기 1순위(T1 따옴표 → 썸네일 S4 따옴표 글씨), C안 = 다른 감정(S5 걱정하는 계산이가 펜션 안에).
   세 안 모두 같은 숫자(1박 10만 원 · 청소 3만 원 · 한 달 180만)를 쓰고 꼴만 다르게 한다. 상표·실존 펜션은 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();pension(560,330,.62);
    receipt(1480,300,.95,[['1박 요금','100,000'],['청소·세탁','−30,000','#d62f2f'],['한 달 60팀','−1,800,000','#d62f2f']],{title:'펜션 영수증 (예시)',rot:.03});
    bottomShade(520);grain();
    tagBox('예시 펜션 · 방 5개 · 한 달 60팀 · 세금 제외',50,630,'#FFC531','#1d2433',48);
    bigLine('1박 손님 받을수록 덜 남는다',50,785,140,'#fff',{max:1820});
    bigLine('청소비만 한 달 180만 원(?)',50,960,150,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();pension(520,330,.6);mop(1180,330,.75);drawMascot(1640,360,.55,'shock');
    bottomShade(470);grain();
    tagBox('한 펜션 \'퇴실 청소 면제\' 옵션 · 2025 보도 · 실제 드는 돈은 예시 3만 원',50,600,'#e0242c','#fff',42);
    bigLine('"청소 안 할 거면',50,775,165,'#fff',{max:1820});
    bigLine('3만 7,000원"',50,960,180,'#FFD23F',{max:1820});
  }else{
    nightBG();pension(600,360,.7,{lit:[1,0,1,0,1]});
    mop(1130,430,.55);drawMascot(1360,380,.62,'worry');
    group(1660,220,1,.04,1,()=>{ctx.fillStyle='#fff7e0';rr(-230,-120,460,240,20);ctx.fill();text('청소비 180만',0,-40,{f:'D',s:56,c:'#1f6fd1'});text('= 사장님 몫',0,44,{f:'D',s:56,c:'#16794a'});});
    bottomShade(540);grain();
    tagBox('예시 펜션 · 1박 10만 원 · 2박 손님 30팀',50,640,'#35E08A','#0d1a12',48);
    bigLine('2박 손님에 10% 깎았더니',50,790,145,'#fff',{max:1820});
    bigLine('한 달 36만 원 더 남았다',50,965,160,'#35E08A',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
