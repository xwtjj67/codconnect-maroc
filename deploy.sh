#!/bin/bash
set -e

# ============================================
# CodConnect - Auto Deploy Script
# ============================================

APP_DIR="/home/codconnect"
BRANCH="main"
PM2_APP="codconnect-api"

echo "=========================================="
echo "  🚀 CodConnect - بدء التحديث التلقائي"
echo "=========================================="

# 1. Pull latest code
echo ""
echo "⬇️  [1/7] جلب آخر التحديثات..."
cd "$APP_DIR"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
echo "✅ تم جلب الكود"

# 2. Install frontend deps & build
echo ""
echo "📦 [2/7] تثبيت اعتماديات الواجهة..."
cd "$APP_DIR/frontend"
npm install --production=false --silent 2>/dev/null || npm install
echo "✅ تم التثبيت"

echo ""
echo "🔨 [3/7] بناء الواجهة الأمامية..."
VITE_API_URL=https://codconnect.ma/api npm run build
echo "✅ تم البناء → dist/"

# 3. Backend update
echo ""
echo "🔧 [4/7] تحديث الباكند..."
cd "$APP_DIR/server"
npm install --production --silent 2>/dev/null || npm install
echo "✅ تم تثبيت اعتماديات الباكند"

# 4. Run schema (safe — IF NOT EXISTS)
echo ""
echo "🗄️  [5/7] تحديث قاعدة البيانات..."
sudo -u postgres psql -d codconnect_db -f "$APP_DIR/server/config/schema.sql" 2>/dev/null && echo "✅ Schema updated" || echo "⚠️  Schema update skipped"

# 5. Restart PM2
echo ""
echo "🔄 [6/7] إعادة تشغيل الخادم..."
pm2 delete "$PM2_APP" 2>/dev/null || true
cd "$APP_DIR/server"
pm2 start server.js --name "$PM2_APP"
pm2 save
echo "✅ تم تشغيل الباكند"

# 6. Reload Nginx
echo ""
echo "🌐 [7/7] إعادة تحميل Nginx..."
sudo nginx -t && sudo systemctl reload nginx
echo "✅ تم إعادة تحميل Nginx"

# 7. Health check
echo ""
echo "🏥 فحص صحة النظام..."
sleep 3
HEALTH=$(curl -sf http://localhost:3001/api/health 2>/dev/null || echo "FAIL")
if echo "$HEALTH" | grep -q "ok"; then
  echo "✅ API يعمل بنجاح!"
else
  echo "⚠️  API لم يستجب - تحقق: pm2 logs $PM2_APP"
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
