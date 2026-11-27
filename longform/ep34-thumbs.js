/* ── LF.34 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(리뉴얼 4,000만 · 한 달 66만 7,000원 · 본사 몫 600만 ↔ 0원)를 쓴다.
   A안 = 우리 채널 1위 꼴 T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 물건(견적서)에,
   B안 = 시험 대기 1순위 T1 따옴표 — 예시 대사 딱지 · S4 따옴표 글씨 + S10 낡은 가게 ↔ 공사 중 가게 두 장면,
   C안 = T3 질문(답 숨김) · S5 걱정하는 계산이를 공사 중 가게 앞에 + 요청서 '본사 몫 ?원'.
   상표·실존 인물은 그리지 않는다. 핵심 그림은 위 55%. */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  const T0=T;T=0;
  if(v===0){
    nightBG();shop34(520,330,.95,{work:true});
    doc34(1350,290,1.05,'리뉴얼 견적서',[['간판·인테리어','3,000만'],['머신·집기','1,000만'],['합계','4,000만 원','#c0392b']],{w:700,ls:36,rs:44});
    bottomShade(540);grain();
    tagBox('가맹사업법 원문 · 서울시 창업비 통계 · 가게 숫자는 예시',50,640,'#FFC531','#1d2433',40);
    bigLine('5년 장사하고 재계약하려면',50,790,130,'#fff',{max:1820});
    bigLine('4,000만 원 또 낸다(?)',50,965,150,'#FF4D4D',{max:1820});
  }else if(v===1){
    nightBG();
    ctx.fillStyle='rgba(141,150,168,.14)';ctx.fillRect(0,0,960,560);ctx.fillStyle='rgba(255,197,49,.12)';ctx.fillRect(960,0,960,560);
    shop34(480,330,.8,{old:true});shop34(1440,330,.8,{work:true});
    text('5년 된 가게',480,70,{f:'D',s:64,c:'#c9ced9',st:8});text('재계약 조건',1440,70,{f:'D',s:64,c:'#FFC531',st:8});
    bottomShade(560);grain();
    tagBox('예시 대사 · 법 조문은 국가법령정보센터 원문',50,650,'#FFC531','#1d2433',40);
    bigLine('"리뉴얼 해야 재계약돼요"',50,800,130,'#fff',{max:1820});
    bigLine('한 달 66만 7,000원(?)',50,970,140,'#FFD23F',{max:1820});
  }else{
    nightBG();shop34(460,330,.9,{work:true});drawMascot(1060,300,.95,'worry');
    group(1600,280,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-230,-150,460,300,18);ctx.fill();text('리뉴얼 4,000만',0,-80,{f:'D',s:44,c:'#59627c'});text('본사 몫',0,-10,{f:'D',s:44,c:'#59627c'});text('?원',0,90,{f:'D',s:110,c:'#b5451b'});});
    bottomShade(540);grain();
    tagBox('가맹사업법 제12조의2 · 시행령 제13조의2 원문',50,640,'#e0242c','#fff',40);
    bigLine('커피 가맹점 리뉴얼 4,000만 원,',50,790,125,'#fff',{max:1820});
    bigLine('본사는 얼마 낼까?',50,965,150,'#FF4D4D',{max:1820});
  }
  T=T0;
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
