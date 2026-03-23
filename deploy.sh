#!/bin/bash
set -e

# ============================================
# CodConnect - Auto Deploy Script
# ============================================

APP_DIR="/var/www/codconnect"
BRANCH="main"
PM2_APP="codconnect-api"

echo "=========================================="
echo "  🚀 CodConnect - بدء التحديث التلقائي"
echo "=========================================="

cd "$APP_DIR"

# 1. Pull latest code
echo ""
echo "⬇️  [1/6] جلب آخر التحديثات..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
echo "✅ تم جلب الكود"

# 2. Install frontend deps & build
echo ""
echo "📦 [2/6] تثبيت اعتماديات الواجهة..."
npm install --production=false --silent
echo "✅ تم التثبيت"

echo ""
echo "🔨 [3/6] بناء الواجهة الأمامية..."
VITE_API_URL=https://codconnect.ma/api npm run build
echo "✅ تم البناء → dist/"

# 3. Backend update
echo ""
echo "🔧 [4/6] تحديث الباكند..."
cd "$APP_DIR/server"
npm install --production --silent
echo "✅ تم تثبيت اعتماديات الباكند"

# 4. Restart PM2 (handle duplicates)
echo ""
echo "🔄 [5/6] إعادة تشغيل الخادم..."
pm2 delete "$PM2_APP" 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
echo "✅ تم تشغيل الباكند"

# 5. Reload Nginx
echo ""
echo "🌐 [6/6] إعادة تحميل Nginx..."
sudo nginx -t && sudo systemctl reload nginx
echo "✅ تم إعادة تحميل Nginx"

# 6. Health check
echo ""
echo "🏥 فحص صحة النظام..."
sleep 2
HEALTH=$(curl -sf http://localhost:3001/api/health 2>/dev/null || echo "FAIL")
if echo "$HEALTH" | grep -q "ok"; then
  echo "✅ API يعمل بنجاح!"
else
  echo "⚠️  API لم يستجب - تحقق من السجلات:"
  echo "   pm2 logs $PM2_APP"
fi

AUTH_TEST=$(curl -sf http://localhost:3001/api/auth/test 2>/dev/null || echo "FAIL")
if echo "$AUTH_TEST" | grep -q "API works"; then
  echo "✅ Auth endpoint يعمل!"
else
  echo "⚠️  Auth endpoint لم يستجب"
fi

echo ""
echo "=========================================="
echo "  ✅ تم التحديث بنجاح!"
echo "=========================================="
echo ""
echo "📋 أوامر مفيدة:"
echo "   pm2 logs $PM2_APP     → سجلات الباكند"
echo "   pm2 status            → حالة العمليات"
echo "   pm2 restart $PM2_APP  → إعادة تشغيل"
echo "   nginx -t              → فحص Nginx"
echo ""
