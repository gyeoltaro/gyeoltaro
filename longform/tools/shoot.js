// 사용: NODE_PATH=$(npm root -g) node longform/tools/shoot.js <절대경로 html> <출력폴더> <문장id+초 ...>
//   예) node longform/tools/shoot.js $PWD/longform/ep04-cheap-coffee.html /tmp/f o1+1 s9+2  → 문장 시작 시각 + 오프셋 초의 장면을 JPG 로 저장. 음성이 내장된 html 이어야 한다.
const { chromium } = require('playwright');const fs=require('fs');
(async()=>{
  const [file,out,...spec]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
  const b=await chromium.launch(process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY}}:{});
  const p=await b.newPage({viewport:{width:1280,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+file+'?export');
  await p.waitForFunction(()=>window.__exp&&window.__exp.ready(),null,{timeout:120000});await p.waitForTimeout(600);
  const info=await p.evaluate(()=>window.__exp.info());console.log('end',info.end.toFixed(1),'voiceEnd',info.voiceEnd.toFixed(1),'chapters',info.chapters.length);
  let i=0;
  for(const sp of spec){const [id,off]=sp.split('+');const t=await p.evaluate(id=>window.__exp.cueT(id),id);const tt=t+(+off||0);
    const u=await p.evaluate(t=>window.__exp.frame(t,.8),tt);fs.writeFileSync(`${out}/${String(i).padStart(2,'0')}_${id}_${(+off||0)}.jpg`,Buffer.from(u.split(',')[1],'base64'));i++;}
  console.log('errors',errs);await b.close();
})();
