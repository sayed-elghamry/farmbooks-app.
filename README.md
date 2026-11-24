# كراسة المزرعة (Farmbooks) — مشروع تطبيق الأندرويد
- `site/`  : نسخة من موقع الكراسات (مصدر المحتوى). عند تحديث الموقع انسخ المجلد الجديد هنا.
- `scripts/build-www.js` : يجهّز `www` (يزيل خدمة PWA ولوحة الطبيب ويضيف طبقة التطبيق).
- `app-overlay/` : ملفات خاصة بالتطبيق فقط.
- `.github/workflows/android.yml` : يبني APK تجريبي، وAAB موقّع لو أُضيفت الأسرار.
الأسرار المطلوبة في GitHub (Settings ▸ Secrets ▸ Actions): KEYSTORE_BASE64, KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD
