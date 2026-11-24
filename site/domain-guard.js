/* ============================================================
   Ghamry Farm App — Domain Guard
   حماية بسيطة: لو اتفتح التطبيق من دومين مش مصرح له بالتشغيل،
   يظهر تحذير واضح يمنع استخدامه بدل ما يشتغل عادي منسوب لحد تاني.
   عدّل قائمة ALLOWED_HOSTS هنا لو ضفت دومين رسمي جديد مستقبلاً.
   © مركز د. السيد الغمري لأمراض الدواجن — جميع الحقوق محفوظة.
   ============================================================ */
(function () {
  var ALLOWED_HOSTS = [
    "plain-haze-ffa1.poultrylabcenter.workers.dev",
    "localhost",
    "127.0.0.1"
  ];
  var OWNER = "مركز د. السيد الغمري لأمراض الدواجن";

  var host = location.hostname;
  var ok = ALLOWED_HOSTS.some(function (h) {
    return host === h || host.endsWith('.' + h);
  });
  if (ok) return;

  document.documentElement.style.visibility = 'hidden';

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.innerHTML =
      '<head><meta charset="UTF-8"><title>نسخة غير مصرح بها</title></head>' +
      '<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;' +
      'background:#143528;color:#f3efe4;font-family:Tahoma,Arial,sans-serif;text-align:center;' +
      'direction:rtl;padding:24px">' +
      '<div style="max-width:420px">' +
      '<div style="font-size:40px;margin-bottom:14px">⚠️</div>' +
      '<h1 style="font-size:19px;margin:0 0 10px">نسخة غير مصرح بها</h1>' +
      '<p style="font-size:14px;line-height:1.8;color:#d7e6dd">' +
      'هذا التطبيق ملك ' + OWNER +
      '، ولا يجوز استخدامه أو نشره من نطاق آخر غير النطاق الرسمي.' +
      '</p>' +
      '<p style="font-size:12.5px;color:#a9c2b3;margin-top:16px">النطاق الحالي: ' + host + '</p>' +
      '</div></body>';
    document.documentElement.style.visibility = 'visible';
  });
})();
