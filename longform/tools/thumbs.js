// 사용: NODE_PATH=$(npm root -g) node longform/tools/thumbs.js <절대경로 html> <출력폴더>  → thumb0~2.png (1280×720)
const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const [file,out]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch(process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY}}:{});const p=await b.newPage({viewport:{width:1280,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+file+'?export');await p.waitForFunction(()=>window.__exp&&window.__exp.ready(),null,{timeout:120000});await p.waitForTimeout(500);
 for(const v of [0,1,2]){const u=await p.evaluate(v=>window.__exp.thumb(v),v);fs.writeFileSync(`${out}/thumb${v}.png`,Buffer.from(u.split(',')[1],'base64'));}
 // 장면 재확인 프레임
 console.log('errors',errs);await b.close();})();
