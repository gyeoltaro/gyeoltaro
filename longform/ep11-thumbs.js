/* ── LF.11 썸네일 3안 (1280×720) ──
   공식: 화면 가득 장면 + 아래 큰 글자 2줄(흰 + 노랑/빨강) + 구체 숫자 + 근거 딱지 + 감정 얼굴. 상표는 그리지 않는다. 핵심 그림은 위 55%.
   A 사실형(+100만 ↓ 세 송이 버리면 −3만) · B 비교형(버린 꽃 103만 vs 사장님 몫 100만) · C 시장형(장미 경매가 +66.3%) */
function drawThumb(v=0){
  const tc=document.createElement('canvas');tc.width=1920;tc.height=1080;const keep=ctx;ctx=tc.getContext('2d');R=1.3;
  if(v===0){
    nightBG();bouquet(330,250,.85);trashCan(760,360,.75,1);drawMascot(1750,330,.8,'shock');
    group(1250,150,1,-.03,1,()=>{ctx.fillStyle='#fff';rr(-300,-85,600,170,24);ctx.fill();text('다 팔면 한 달',0,-42,{s:34,w:900,c:'#59627c'});text('+100만',0,22,{f:'D',s:100,c:C.ink});});
    text('↓',1250,280,{f:'D',s:80,c:'#fff',st:12});
    group(1250,400,1,.03,1,()=>{ctx.fillStyle='#e0242c';rr(-320,-90,640,180,24);ctx.fill();text('세 송이 버리면',0,-44,{s:34,w:900,c:'#ffd6d6'});text('−3만',0,24,{f:'D',s:100,c:'#fff'});});
    bottomShade(430);grain();
    tagBox('예시 동네 꽃집 · 꽃다발 5만 원 · 화훼 경매 보도로 계산',50,575,'#e0242c','#fff',50);
    bigLine('꽃 열 송이 중 세 송이 버리면',50,735,150,'#fff',{max:1820});
    bigLine('꽃집 한 달 남는 돈 −3만 원',50,930,160,'#FFD23F',{max:1820});
  }else if(v===1){
    nightBG();
    [['버린 꽃',103,'#FF4D4D','103만'],['사장님 몫',100,'#35E08A','100만']].forEach(([l,val,col,lab],i)=>{const y=130+i*150;text(l,430,y,{a:'right',f:'D',s:70,st:8});ctx.fillStyle=col;rr(460,y-55,val*8,110,24);ctx.fill();text(lab,460+val*8+24,y+4,{a:'left',f:'D',s:90,c:col,st:10});});
    trashCan(1700,330,.7,1);
    bottomShade(500);grain();
    tagBox('예시 꽃집 · 한 달 · 사 온 꽃의 30%를 버리면',50,600,'#FFC531','#1d2433',54);
    bigLine('버린 꽃값이 내 몫보다 크다',50,765,160,'#fff',{max:1820});
    bigLine('5만 원 꽃다발의 진짜 원가',50,950,160,'#FF4D4D',{max:1820});
  }else{
    nightBG();
    const base=470;[['1년 전',10585,'#4fb6ff','약 1만 585원'],['2026.1',17603,'#FF4D4D','1만 7,603원']].forEach(([l,val,col,lab],i)=>{const x=330+i*460,h=val*.016;ctx.fillStyle=col;rr(x-140,base-h,280,h,18);ctx.fill();text(lab,x,base-h-44,{f:'D',s:58,c:col,st:10});text(l,x,base+40,{f:'D',s:46,st:8});});
    group(1260,200,1,-.05,1,()=>{ctx.fillStyle='#e0242c';rr(-200,-70,400,140,24);ctx.fill();text('+66.3%',0,6,{f:'D',s:90,c:'#fff'});});
    drawMascot(1720,330,.8,'worry');
    bottomShade(520);grain();
    tagBox('장미 한 단 평균 경매가 · aT 자료 (아시아경제 2026.1.15)',50,620,'#FFC531','#1d2433',52);
    bigLine('꽃값 66% 오르면',50,775,165,'#fff',{max:1820});
    bigLine('버리는 장미도 66% 비싸진다',50,955,165,'#FF4D4D',{max:1820});
  }
  const out=document.createElement('canvas');out.width=1280;out.height=720;const ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(tc,0,0,1280,720);
  ctx=keep;return out.toDataURL('image/png');
}
