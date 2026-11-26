/* ── LF.33 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(하루 230km · 빈 차 71km · 시급 9,729원 · 매출 359만)를 쓴다.
   A안 = 우리 채널 1위 꼴 T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(길 위 거리 띠·가격표)에,
   B안 = 시험 대기 1순위 T1 따옴표 — 예시 대사 딱지 · S4 따옴표 글씨 + S10 짐 실은 트럭 ↔ 빈 트럭 두 장면,
   C안 = T3 질문(답 숨김, 11.26 공부 '1톤 얼마나 벌까?' 215배와 같은 꼴) · S5 걱정하는 계산이를 밤 주차장 트럭 옆에.
   상표·실존 인물은 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();road33(40,1880,330,120);
    ctx.fillStyle=CLOAD;rr(60,400,1240,34,10);ctx.fill();ctx.fillStyle=CEMPTY;rr(1300,400,560,34,10);ctx.fill();
    truck33(700,300,1.0,{load:true});truck33(1600,300,.8,{dim:true});
    tag33(700,120,1,'짐 싣고 159km',CLOAD,{fs:50});tag33(1560,120,1,'빈 차 71km · 0원',CRED,{fs:50});
    bottomShade(540);grain();
    tagBox('한국교통연구원 1톤 기사 1,375명 조사 (2025) · 하루 230.5km',50,640,'#FFC531','#1d2433',40);
    bigLine('하루 230km 달리는 1톤 트럭',50,790,130,'#fff',{max:1820});
    bigLine('71km는 공짜로 달린다(?)',50,965,150,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();
    ctx.fillStyle='rgba(53,224,138,.12)';ctx.fillRect(0,0,960,560);ctx.fillStyle='rgba(141,150,168,.14)';ctx.fillRect(960,0,960,560);
    road33(40,920,400,90);road33(1000,1880,400,90);
    truck33(470,330,1.15,{load:true});truck33(1440,330,1.15,{dim:true,flip:true});
    text('내려갈 땐 짐',470,130,{f:'D',s:66,c:'#35E08A',st:8});text('올라올 땐 빈 차',1440,130,{f:'D',s:66,c:'#c9ced9',st:8});
    bottomShade(560);grain();
    tagBox('예시 대사 · 숫자는 한국교통연구원 2025 조사 평균',50,650,'#35E08A','#0d1a12',40);
    bigLine('"올라올 땐 빈 차예요"',50,800,130,'#fff',{max:1820});
    bigLine('1톤 기사님 시급 9,729원(?)',50,970,140,'#FFD23F',{max:1820});
  }else{
    nightBG();road33(40,1300,420,100);truck33(560,330,1.2,{load:true});drawMascot(1250,300,.95,'worry');
    group(1660,250,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-200,-120,400,240,18);ctx.fill();text('기사님 시급',0,-55,{f:'D',s:44,c:'#59627c'});text('?원',0,45,{f:'D',s:110,c:'#b5451b'});});
    bottomShade(540);grain();
    tagBox('한국교통연구원 1톤 이하 화물차주 1,375명 조사 (2025)',50,640,'#e0242c','#fff',40);
    bigLine('1톤 용달 한 달 매출 359만 원,',50,790,130,'#fff',{max:1820});
    bigLine('기사님 시급은 얼마일까?',50,965,145,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
