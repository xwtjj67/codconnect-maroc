# 🚀 CodConnect — دليل النشر النهائي على VPS

## المتطلبات
- Ubuntu 22.04+ VPS
- Node.js 20 LTS
- PostgreSQL 16
- Nginx
- PM2

---

## 📋 الطريقة 1: نشر تقليدي (PM2 + Nginx)

### 1. إعداد قاعدة البيانات

```bash
# إنشاء المستخدم وقاعدة البيانات
sudo -u postgres psql <<EOF
CREATE USER codconnect_user WITH PASSWORD 'yZE8vCmsuka';
CREATE DATABASE codconnect_db OWNER codconnect_user;
GRANT ALL PRIVILEGES ON DATABASE codconnect_db TO codconnect_user;
\c codconnect_db
GRANT ALL ON SCHEMA public TO codconnect_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO codconnect_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO codconnect_user;
EOF

# تشغيل Schema
sudo -u postgres psql -d codconnect_db -f /home/codconnect/server/config/schema.sql

# إنشاء Admin
cd /home/codconnect/server && node config/seed-admin.js
```

### 2. إعداد ملف البيئة

```bash
cat > /home/codconnect/server/.env <<EOF
PORT=3001
FRONTEND_URL=https://codconnect.ma
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codconnect_db
DB_USER=codconnect_user
DB_PASSWORD=yZE8vCmsuka
JWT_SECRET=codconnect-jwt-secret-2024-prod
JWT_EXPIRES_IN=7d
EOF
```

### 3. بناء ونشر

```bash
cd /home/codconnect

# Frontend
npm install
VITE_API_URL=/api npm run build

# Backend
cd server
npm install --production

# PM2
pm2 delete codconnect-api 2>/dev/null || true
pm2 start server.js --name codconnect-api
pm2 save
pm2 startup
```

### 4. إعداد Nginx

```bash
sudo cp /home/codconnect/server/nginx/codconnect.conf /etc/nginx/sites-available/codconnect
sudo ln -sf /etc/nginx/sites-available/codconnect /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

> ⚠️ ملاحظة: ملف nginx الحالي يعمل مباشرة مع PM2 (بدون Docker).
> إذا كنت تستخدم Docker، انسخ ملف nginx المخصص لـ Docker.

### 5. SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d codconnect.ma -d www.codconnect.ma
```

### 6. نشر تلقائي

```bash
chmod +x /home/codconnect/deploy.sh
bash /home/codconnect/deploy.sh
```

---

## 📋 الطريقة 2: Docker Compose

### 1. تشغيل Docker

```bash
cd /home/codconnect

# إنشاء .env للسيرفر أولاً (نفس الخطوة 2 أعلاه مع تغيير DB_HOST=db)
cat > server/.env <<EOF
PORT=3001
FRONTEND_URL=https://codconnect.ma
DB_HOST=db
DB_PORT=5432
DB_NAME=codconnect_db
DB_USER=codconnect_user
DB_PASSWORD=yZE8vCmsuka
JWT_SECRET=codconnect-jwt-secret-2024-prod
JWT_EXPIRES_IN=7d
EOF

# بناء وتشغيل
docker compose up -d --build

# فحص
docker compose logs -f app
```

### 2. الوصول لـ pgAdmin

```
http://YOUR-IP:5050
Email: admin@codconnect.ma
Password: admin123
```

pgAdmin سيتصل تلقائياً بقاعدة البيانات (كلمة السر: yZE8vCmsuka).

---

## 🛠️ تثبيت Webmin

```bash
curl -o setup-repos.sh https://raw.githubusercontent.com/webmin/webmin/master/setup-repos.sh
sh setup-repos.sh
apt install -y webmin

# الوصول
# https://YOUR-IP:10000
# استخدم root username/password
```

---

## ✅ فحص النظام

```bash
# Health check
curl http://localhost:3001/api/health

# Auth test
curl http://localhost:3001/api/auth/test

# Debug users
curl http://localhost:3001/api/debug/users

# Test signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"0611111111","city":"Casa","password":"Test123!","role":"affiliate"}'

# Test login (admin)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"hachimiabdelhafid0@gmail.com","password":"Allo@Abdo@2026@!"}'
```

---

## 🔧 حل المشاكل الشائعة

### المستخدمون لا يُحفظون
```bash
# تحقق من اتصال DB
pm2 logs codconnect-api | grep "DB"

# تحقق من الصلاحيات
sudo -u postgres psql -d codconnect_db -c "GRANT ALL ON SCHEMA public TO codconnect_user;"
```

### PM2 عمليات مكررة
```bash
pm2 delete all
pm2 start /home/codconnect/server/server.js --name codconnect-api
pm2 save
```

### رفع الصور لا يعمل
```bash
mkdir -p /home/codconnect/server/uploads/products
chmod 755 /home/codconnect/server/uploads
```
