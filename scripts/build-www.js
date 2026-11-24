// يبني مجلد www من مجلد site: ينسخ الصفحات، يزيل خدمة PWA وصفحة لوحة الطبيب، ويضيف طبقة التطبيق
const fs=require('fs'),path=require('path');
const SRC=path.join(__dirname,'..','site'),OUT=path.join(__dirname,'..','www'),OV=path.join(__dirname,'..','app-overlay');
const SKIP=new Set(['dashboard.html','manifest-dashboard.json','service-worker.js','manifest.json']);
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});
for(const f of fs.readdirSync(SRC)){
  if(SKIP.has(f))continue;
  let buf=fs.readFileSync(path.join(SRC,f));
  if(f.endsWith('.html')){
    let s=buf.toString('utf8');
    s=s.replace(/<script>if\('serviceWorker' in navigator[\s\S]*?<\/script>\s*/g,'');
    s=s.replace(/if \('serviceWorker' in navigator\) \{[\s\S]*?\n\}\n?/g,'');
    s=s.replace(/<link[^>]*rel="manifest"[^>]*>\s*/g,'');
    s=s.replace('</head>','<script src="./app-shell.js"></script>\n</head>');
    buf=Buffer.from(s,'utf8');
  }
  fs.writeFileSync(path.join(OUT,f),buf);
}
for(const f of fs.readdirSync(OV))fs.copyFileSync(path.join(OV,f),path.join(OUT,f));
console.log('www ready:',fs.readdirSync(OUT).length,'files');
