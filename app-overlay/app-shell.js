/* طبقة خاصة بتطبيق الأندرويد فقط — لا تُنشر على الموقع */
(function(){
  window.GHAMRY_NATIVE = true;
  var css=document.createElement('style');
  css.textContent='#ghInstallBtn,#ghIosTip{display:none!important}'
   +'#ghBkFab{position:fixed;left:12px;bottom:14px;z-index:9000;background:#1e4d3b;color:#fff;border:none;border-radius:24px;padding:10px 16px;font:700 14px inherit;font-family:inherit;box-shadow:0 3px 10px rgba(0,0,0,.3);cursor:pointer}'
   +'#ghBkOv{position:fixed;inset:0;z-index:9500;background:rgba(15,30,25,.7);display:flex;align-items:center;justify-content:center;padding:16px;direction:rtl}'
   +'#ghBkOv .bx{background:#fff;color:#1c2b26;border-radius:16px;max-width:400px;width:100%;padding:20px;line-height:1.7;font-family:inherit}'
   +'#ghBkOv button{display:block;width:100%;margin-top:10px;padding:12px;border:none;border-radius:12px;font:700 15px inherit;font-family:inherit;cursor:pointer}'
   +'#ghBkOv .p{background:#1f5c46;color:#fff}#ghBkOv .g{background:#e8eee9;color:#1c2b26}';
  (document.head||document.documentElement).appendChild(css);

  var KEYS_RE=/^(elghamry_ledger_v1|elghamry_layer_v1|duck_breeders_v1|turkey_breeders_v1|chicken_breeders_v1|duck_meat_booklet_app_v1|turkey_meat_booklet_app_v1|ghamry_identity|ghamry_last_sync_.+|duck_meat_last_backup_v1|turkey_meat_last_backup_v1)$/;
  var Bk=window.GhBackup={};
  Bk.collect=function(){var items={};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(KEYS_RE.test(k))items[k]=localStorage.getItem(k);}}catch(e){}
    return {app:'farmbooks',version:1,exported_at:new Date().toISOString(),items:items};};
  Bk.restore=function(obj){
    if(!obj||obj.app!=='farmbooks'||!obj.items||typeof obj.items!=='object')throw new Error('الملف ده مش نسخة احتياطية من كراسة المزرعة');
    var n=0;Object.keys(obj.items).forEach(function(k){if(KEYS_RE.test(k)&&typeof obj.items[k]==='string'){localStorage.setItem(k,obj.items[k]);n++;}});
    if(!n)throw new Error('النسخة فاضية');return n;};
  function fname(){return 'farmbooks-backup-'+new Date().toISOString().slice(0,10)+'.json';}
  Bk.exportFile=async function(){
    var data=JSON.stringify(Bk.collect()),P=(window.Capacitor&&window.Capacitor.Plugins)||{};
    if(P.Filesystem&&P.Share){
      var r=await P.Filesystem.writeFile({path:fname(),data:data,directory:'CACHE',encoding:'utf8'});
      await P.Share.share({title:'نسخة احتياطية - كراسة المزرعة',text:'نسخة احتياطية من كراسة المزرعة',url:r.uri,dialogTitle:'احفظ النسخة (Drive / واتساب / ملفات)'});
    }else{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=fname();document.body.appendChild(a);a.click();a.remove();}
    try{localStorage.setItem('ghamry_last_export',new Date().toISOString());}catch(e){}
  };
  Bk.importText=function(text){
    var obj=JSON.parse(text);
    try{localStorage.setItem('ghamry_pre_import_backup',JSON.stringify(Bk.collect()));}catch(e){}
    return Bk.restore(obj);
  };
  function closeOv(){var o=document.getElementById('ghBkOv');if(o)o.remove();}
  function openDlg(){
    if(document.getElementById('ghBkOv'))return;
    var last='';try{var l=localStorage.getItem('ghamry_last_export');if(l)last='<div style="font-size:12px;color:#6b7c75">آخر نسخة احتياطية: '+new Date(l).toLocaleString('ar-EG')+'</div>';}catch(e){}
    var o=document.createElement('div');o.id='ghBkOv';
    o.innerHTML='<div class="bx"><h3 style="margin:0 0 6px">💾 النسخة الاحتياطية</h3>'
      +'<div style="font-size:13px;color:#44574f">احفظ نسخة من كل بياناتك على موبايلك أو Drive، وتقدر ترجعها في أي وقت أو على موبايل جديد.</div>'+last
      +'<button class="p" id="ghBkExp">⬆️ حفظ / مشاركة نسخة احتياطية</button>'
      +'<button class="g" id="ghBkImp">⬇️ استعادة من ملف</button>'
      +'<input type="file" id="ghBkFile" accept=".json,application/json" style="display:none">'
      +'<div id="ghBkMsg" style="color:#b3261e;font-size:13px;min-height:18px;margin-top:8px"></div>'
      +'<button class="g" id="ghBkClose">إغلاق</button></div>';
    document.body.appendChild(o);
    var msg=o.querySelector('#ghBkMsg');
    o.querySelector('#ghBkClose').onclick=closeOv;
    o.querySelector('#ghBkExp').onclick=function(){msg.style.color='#1f5c46';msg.textContent='جاري التجهيز...';Bk.exportFile().then(function(){msg.textContent='تم ✔';}).catch(function(e){msg.style.color='#b3261e';msg.textContent='تعذر الحفظ: '+(e&&e.message||e);});};
    var fi=o.querySelector('#ghBkFile');
    o.querySelector('#ghBkImp').onclick=function(){fi.click();};
    fi.onchange=function(){var f=fi.files&&fi.files[0];if(!f)return;var r=new FileReader();
      r.onload=function(){try{
        if(!confirm('هتستبدل البيانات الحالية بالنسخة الموجودة في الملف. متأكد؟'))return;
        var n=Bk.importText(String(r.result));msg.style.color='#1f5c46';msg.textContent='تمت الاستعادة ('+n+' عنصر) — جاري إعادة التشغيل...';setTimeout(function(){location.href='./index.html';},900);
      }catch(e){msg.style.color='#b3261e';msg.textContent=(e&&e.message)||'ملف غير صالح';}};r.readAsText(f);};
  }
  Bk.open=openDlg;
  function addFab(){
    if(!/(^|\/)(index\.html)?$/.test(location.pathname))return;
    var b=document.createElement('button');b.id='ghBkFab';b.type='button';b.textContent='💾 نسخة احتياطية';b.onclick=openDlg;document.body.appendChild(b);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addFab);else addFab();
})();
