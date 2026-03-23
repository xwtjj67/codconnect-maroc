#!/bin/bash
set -e

# ============================================
# CodConnect - Full Deploy Script (PM2 + Nginx)
# ============================================

APP_DIR="/home/codconnect"
PM2_APP="codconnect-api"
BRANCH="main"

echo "=========================================="
echo "  🚀 CodConnect — بدء النشر الكامل"
echo "=========================================="

# 1. Pull latest
echo ""
echo "⬇️  [1/8] جلب آخر التحديثات..."
cd "$APP_DIR"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
echo "✅ تم"

# 2. Frontend deps + build
echo ""
echo "📦 [2/8] بناء الواجهة..."
npm install --production=false --silent 2>/dev/null || npm install
VITE_API_URL=/api npm run build
echo "✅ تم بناء dist/"

# 3. Backend deps
echo ""
echo "🔧 [3/8] تثبيت اعتماديات الباكند..."
cd "$APP_DIR/server"
npm install --production --silent 2>/dev/null || npm install --production
echo "✅ تم"

# 4. Create uploads dir
echo ""
echo "📁 [4/8] إنشاء مجلد الرفع..."
mkdir -p "$APP_DIR/server/uploads/products"
echo "✅ تم"

# 5. Update schema
echo ""
echo "🗄️  [5/8] تحديث قاعدة البيانات..."
sudo -u postgres psql -d codconnect_db -f "$APP_DIR/server/config/schema.sql" 2>/dev/null && echo "✅ Schema OK" || echo "⚠️ Schema skipped"

# 6. Restart PM2
echo ""
echo "🔄 [6/8] إعادة تشغيل السيرفر..."
cd "$APP_DIR/server"
pm2 delete "$PM2_APP" 2>/dev/null || true
pm2 start server.js --name "$PM2_APP" --max-memory-restart 300M
pm2 save
echo "✅ تم"

# 7. Reload Nginx
echo ""
echo "🌐 [7/8] إعادة تحميل Nginx..."
sudo nginx -t && sudo systemctl reload nginx
echo "✅ تم"

# 8. Health check
echo ""
echo "🏥 [8/8] فحص صحة النظام..."
sleep 3

HEALTH=$(curl -sf http://localhost:3001/api/health 2>/dev/null || echo "FAIL")
if echo "$HEALTH" | grep -q "ok"; then
  echo "✅ API يعمل!"
else
  echo "⚠️ API لم يستجب — pm2 logs $PM2_APP"
fi

AUTH=$(curl -sf http://localhost:3001/api/auth/test 2>/dev/null || echo "FAIL")
if echo "$AUTH" | grep -q "API works"; then
  echo "✅ Auth يعمل!"
else
  echo "⚠️ Auth لم يستجب"
fi

echo ""
echo "=========================================="
echo "  ✅ تم النشر بنجاح!"
echo "=========================================="
echo ""
echo "📋 أوامر مفيدة:"
echo "   pm2 logs $PM2_APP"
echo "   pm2 status"
echo "   pm2 restart $PM2_APP"
echo ""
