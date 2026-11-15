/* ── LF.22 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(월세 −50만 → 건물값 −1억 5,000만)를 쓴다.
   A안 = T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(계산기 화면)에,
   B안 = 시험 대기 1순위 T1 따옴표 · S4 따옴표 글씨 + S2 빈 가게 '임대' 종이,
   C안 = T2 모순 · S5 걱정하는 계산이를 빈 가게 앞에 + 공실률 딱지.
   상표·실존 건물은 그리지 않는다. 핵심 그림은 위 55%. */
function thumbCalc(x,y,s,l1,l2){group(x,y,s,-.04,1,()=>{ctx.fillStyle='#1d2230';rr(-300,-200,600,400,40);ctx.fill();ctx.fillStyle='#c9e6bf';rr(-260,-160,520,320,22);ctx.fill();
  text(l1,230,-80,{a:'right',f:'D',s:54,c:'#4a5a44',max:480});text(l2,230,50,{a:'right',f:'D',s:96,c:'#d62f2f',max:480});text('건물값',-230,50,{a:'left',s:34,w:900,c:'#4a5a44'});});}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();bldg(470,330,.58,{vacant:1,tag:'월세 300만'});
    thumbCalc(1330,290,1.15,'월세 −50만 원','−1억 5천');
    bottomShade(520);grain();
    tagBox('수익률 4%로 건물값을 매기면 · 예시 상가',50,640,'#FFC531','#1d2433',44);
    bigLine('월세 50만 원 깎으면',50,790,150,'#fff',{max:1820});
    bigLine('건물값 1억 5천 증발(?)',50,965,160,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();shopUnit(600,330,1.25,{vacant:1});
    group(1460,300,1,.05,1,()=>{ctx.fillStyle='#fff';rr(-300,-150,600,300,20);ctx.fill();text('월세 50만 원 인하',0,-70,{f:'D',s:50,c:'#3a4256'});text('= −1억 5천',0,40,{f:'D',s:96,c:'#d62f2f'});text('건물값 (예시)',0,115,{s:30,w:900,c:'#59627c'});});
    bottomShade(560);grain();
    tagBox('반년째 빈 1층 · 건물주의 계산 (예시)',50,650,'#35E08A','#0d1a12',48);
    bigLine('"월세 깎으면',50,800,150,'#fff',{max:1820});
    bigLine('건물값이 떨어져요"',50,970,160,'#FFD23F',{max:1820});
  }else{
    nightBG();shopUnit(560,360,1.05,{vacant:1});drawMascot(1130,390,.75,'worry');
    group(1620,280,1,.04,1,()=>{ctx.fillStyle='#fff7e0';rr(-250,-180,500,360,20);ctx.fill();text('공실 6개월',0,-120,{f:'D',s:40,c:'#59627c'});text('−2,040만',0,-50,{f:'D',s:70,c:'#c0392b'});text('월세 50만 인하',0,30,{f:'D',s:40,c:'#59627c'});text('−1억 5천',0,105,{f:'D',s:80,c:'#d62f2f'});});
    bottomShade(540);grain();
    tagBox('상가 공실률 13.7% (2026년 3분기, 부동산원)',50,640,'#e0242c','#fff',44);
    bigLine('비워 두는 게',50,790,150,'#fff',{max:1820});
    bigLine('일곱 배 싸다(?)',50,965,165,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
