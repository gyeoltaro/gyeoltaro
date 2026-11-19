/* ── LF.26 썸네일 3안 (1280×720) ──
   docs/title-thumbnail-playbook.md 로 짰다. 세 안 모두 같은 숫자(정가 1만 5,000원 · 서점 몫 3,750원 · 할인하면 1,500원 · 인터넷서점 3,000원)를 쓴다.
   A안 = T6 역설 + 금액 · S1 아래 큰 글씨 두 줄 + S6 숫자를 장면 속 영수증에,
   B안 = 시험 대기 1순위 T1 따옴표(예시 대사임을 딱지로 밝힘) + S4 따옴표 글씨,
   C안 = T2 + 질문(답 숨김) · S5 걱정하는 계산이를 불 꺼진 서점 앞에.
   상표·실존 서점은 그리지 않는다. 핵심 그림은 위 55%. */
function thumbReceipt26(x,y,s){group(x,y,s,.05,1,()=>{ctx.fillStyle='#fffdf6';rr(-280,-240,560,480,14);ctx.fill();
  text('책 한 권 1만 5,000원',0,-185,{f:'D',s:42,c:'#1d2433',max:520});ctx.strokeStyle='rgba(0,0,0,.25)';ctx.setLineDash([8,6]);ctx.lineWidth=3;line(-240,-145,240,-145);ctx.setLineDash([]);
  text('들여오는 값',-240,-95,{a:'left',s:34,w:900,c:'#3a4256'});text('−11,250',240,-95,{a:'right',f:'D',s:42,c:'#1d2433'});
  text('할인·적립 15%',-240,-25,{a:'left',s:34,w:900,c:'#3a4256'});text('−2,250',240,-25,{a:'right',f:'D',s:42,c:'#d62f2f'});
  line(-240,30,240,30);text('서점 몫',-240,105,{a:'left',f:'D',s:44,c:'#d62f2f'});text('1,500원',240,105,{a:'right',f:'D',s:84,c:'#d62f2f'});
  text('(정가면 3,750원)',240,180,{a:'right',s:28,w:900,c:'#3a4256'});});}
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();bookShop26(470,330,1.0,{});book26(990,360,.95,{rot:-.08});
    thumbReceipt26(1540,300,1.0);
    bottomShade(540);grain();
    tagBox('예시 · 정가 1만 5,000원 책 · 서점 몫 3,750원 → 할인하면 1,500원',50,640,'#FFC531','#1d2433',42);
    bigLine('책값 2,250원 깎아 주면',50,790,140,'#fff',{max:1820});
    bigLine('서점 몫 60%가 사라진다',50,965,140,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();bookShop26(560,320,1.05,{});book26(1240,340,.9,{rot:.06});book26(1560,340,.9,{rot:-.05,col:'#8e5bd6',price:'인터넷 13,500원'});
    bottomShade(560);grain();
    tagBox('예시 대사 · 정가 1만 5,000원 책 · 공급률 75% 가정',50,650,'#35E08A','#0d1a12',42);
    bigLine('"정가 다 받아도',50,800,150,'#fff',{max:1820});
    bigLine('한 권에 3,750원 남아요"',50,970,150,'#FFD23F',{max:1820});
  }else{
    nightBG();bookShop26(500,330,1.0,{dim:true});drawMascot(1130,360,.95,'worry');book26(1580,330,.9,{rot:.06,col:'#8e5bd6',price:'인터넷 13,500원'});
    group(1580,110,1,-.04,1,()=>{ctx.fillStyle='#fff';rr(-210,-50,420,100,14);ctx.fill();text('싸게 팔고도 남는다?',0,4,{f:'D',s:40,c:'#6b3fb0',max:390});});
    bottomShade(540);grain();
    tagBox('같은 정가 1만 5,000원 · 들여오는 값이 다르다 (예시)',50,640,'#e0242c','#fff',42);
    bigLine('같은 책 1만 5,000원',50,790,140,'#fff',{max:1820});
    bigLine('인터넷은 어떻게 남길까(?)',50,965,140,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
