/* تسجيل إجباري لمرة واحدة + مزامنة تلقائية — كراسات المزرعة الذكية (مركز د. الغمري) */
(function(){
  var KEY='ghamry_identity';
  function norm(s){return String(s||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)})
    .replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)});}
  function cleanPhone(p){var d=norm(p).replace(/\D/g,'');
    var m=d.match(/^(?:20|0020)?(1[0125]\d{8})$/); if(m) return '0'+m[1];
    if(/^01[0125]\d{8}$/.test(d)) return d;
    return (d.length>=9&&d.length<=15)?d:'';}
  function get(){try{return JSON.parse(localStorage.getItem(KEY))||null;}catch(e){return null;}}
  function valid(id){return !!(id&&id.name&&String(id.name).trim().length>=2&&cleanPhone(id.phone));}
  function save(name,phone){try{localStorage.setItem(KEY,JSON.stringify({name:String(name).trim(),phone:cleanPhone(phone)}));}catch(e){}}
  window.ghIdValid=function(){return valid(get());};
  window.ghIdName=function(){var i=get();return valid(i)?String(i.name).trim():'';};
  window.ghIdPhone=function(){var i=get();return valid(i)?cleanPhone(i.phone):'';};

  function apply(){ if(!valid(get()))return;
    try{ if(typeof window.ghamryApplyIdentity==='function') window.ghamryApplyIdentity(get()); }catch(e){} }
  function flush(){ if(!valid(get()))return;
    try{ if(typeof window.ghamryFlush==='function') window.ghamryFlush(); }catch(e){} }

  function show(){
    if(document.getElementById('ghRegOverlay'))return;
    var o=document.createElement('div'); o.id='ghRegOverlay';
    o.setAttribute('dir','rtl');
    o.style.cssText='position:fixed;inset:0;z-index:2147483000;background:rgba(15,30,25,.82);display:flex;align-items:center;justify-content:center;padding:16px;font-family:inherit;overflow:auto';
    o.innerHTML='<div style="background:#fff;color:#1c2b26;border-radius:16px;max-width:420px;width:100%;padding:22px 20px;box-shadow:0 12px 40px rgba(0,0,0,.35);line-height:1.7">'
      +'<h2 style="margin:0 0 6px;font-size:20px;color:#1f5c46">أهلاً بيك في كراسات المزرعة الذكية 🌿</h2>'
      +'<p style="margin:0 0 14px;font-size:14px;color:#44574f">سجّل اسم المزرعة ورقم الموبايل مرة واحدة بس، عشان بياناتك تتحفظ وتقدر ترجعها في أي وقت لو غيّرت الموبايل أو اتمسح التطبيق.</p>'
      +'<label style="display:block;font-size:13px;font-weight:700;margin:8px 0 4px">اسم المزرعة / اسمك</label>'
      +'<input id="ghRegName" autocomplete="organization" style="width:100%;box-sizing:border-box;padding:11px;border:1.5px solid #b9c7c0;border-radius:10px;font-size:16px" placeholder="مثال: مزرعة الأمل">'
      +'<label style="display:block;font-size:13px;font-weight:700;margin:10px 0 4px">رقم الموبايل (واتساب)</label>'
      +'<input id="ghRegPhone" type="tel" inputmode="numeric" autocomplete="tel" style="width:100%;box-sizing:border-box;padding:11px;border:1.5px solid #b9c7c0;border-radius:10px;font-size:16px;direction:ltr;text-align:right" placeholder="01xxxxxxxxx">'
      +'<div id="ghRegErr" style="color:#b3261e;font-size:13px;min-height:18px;margin-top:6px"></div>'
      +'<button id="ghRegGo" style="width:100%;margin-top:6px;padding:13px;border:none;border-radius:12px;background:#1f5c46;color:#fff;font-size:16px;font-weight:700;cursor:pointer">ابدأ استخدام الكراسة</button>'
      +'<p style="margin:10px 0 0;font-size:12px;color:#6b7c75">الاستخدام مجاني — بياناتك بتتحفظ على سحابة مركز د. الغمري.</p></div>';
    document.body.appendChild(o);
    var n=o.querySelector('#ghRegName'),p=o.querySelector('#ghRegPhone'),e=o.querySelector('#ghRegErr');
    function go(){
      var name=n.value.trim(), ph=cleanPhone(p.value);
      if(name.length<2){e.textContent='اكتب اسم المزرعة أو اسمك';n.focus();return;}
      if(!ph){e.textContent='اكتب رقم موبايل صحيح (مثال: 01012345678)';p.focus();return;}
      save(name,ph); o.remove(); apply(); flush();
    }
    o.querySelector('#ghRegGo').addEventListener('click',go);
    [n,p].forEach(function(x){x.addEventListener('keydown',function(ev){if(ev.key==='Enter')go();});});
    setTimeout(function(){try{n.focus();}catch(e){}},50);
  }

  function init(){
    if(!valid(get())){
      var g=null; try{ if(typeof window.ghamryGuessIdentity==='function') g=window.ghamryGuessIdentity(); }catch(e){}
      if(g&&g.name&&cleanPhone(g.phone)){ save(g.name,g.phone); }
    }
    if(valid(get())){ apply(); setTimeout(flush,4000); } else { show(); }
  }
  window.addEventListener('online',flush);
  document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='hidden') flush(); });
  window.addEventListener('pagehide',flush);
  window.ghamryRegister={init:init,show:show,apply:apply};
  if(document.readyState==='complete') setTimeout(init,300);
  else window.addEventListener('load',function(){setTimeout(init,300);});
})();
