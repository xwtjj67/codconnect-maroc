# CODConnect — منصة مغربية للتوريد والتسويق بنظام الدفع عند الاستلام (COD)

---

# 🎨 Brand & Design System

- Deep navy primary background (#0B1C2D style)
- Teal / cyan gradient accents for buttons and highlights
- Soft gold badges for commissions and premium indicators
- Glassmorphism cards with subtle blur and soft teal borders
- Clean white text with modern Arabic font (SaaS style)
- Fully RTL layout globally
- Mobile-first responsive design
- Smooth hover transitions and subtle glow effects
- CODConnect logo embedded in header (top-right in RTL)
- No purple tones at all

Tone: Professional Moroccan SaaS platform — serious, trustworthy, not hype-driven.

---

# 🌍 Public Website Structure

---

## 1️⃣ Homepage (`/`)

### Header (Public Layout)

- Logo on the right
- Login / Register on the left
- Sticky transparent navbar that becomes solid on scroll

---

### Hero Section

Headline:

ابدأ التجارة بلا رأس مال عبر نظام COD

Subheadline:

سواء كنت تاجرًا تريد بيع منتجاتك عبر شبكة مسوقين،  
أو مسوقًا ترغب في الربح بدون مخزون — CodConnect تربطك بالحل الكامل.

Buttons:

[ سجل كمسوق ]  
[ سجل كتاجر ]

Teal gradient with soft glow hover.

Optional small trust line below buttons:

منصة مغربية — شحن سريع — دعم مباشر

---

### Audience Split Section (Very Important Addition)

Title:

لمن هذه المنصة؟

Two clean glass cards side by side:

#### 🟢 للمسوقين

- عمولات على كل طلب مؤكد
- لا تحتاج مخزون
- روابط بيع خاصة بك

#### 🟢 للتجار

- وصول إلى شبكة مسوقين
- إدارة الطلبات عبر لوحة تحكم
- تكفل بالشحن و COD

This clarifies dual positioning immediately.

---

### How It Works

Title: كيفاش كتخدم المنصة؟

Horizontal timeline (modern minimal icons):

1️⃣ إنشاء حساب  
2️⃣ اختيار أو إضافة منتج  
3️⃣ تأكيد الطلب وربح العمولة

Simple and clean.

---

### Trending Products Preview

Title: منتجات ترند حاليا

3 product preview cards:

- Product image
- Product name
- Gold commission badge (مثال: 40 DH عمولة)
- Button: عرض المنتج

Minimal, clean, not cluttered.

---

### Platform Stats

Title: أرقام المنصة

Minimal counters:

- Affiliates
- طلبات
- تجار

No fake inflated numbers.

---

### Final CTA Section

Headline:

انضم الآن إلى CodConnect وابدأ اليوم

Button:

إنشاء حساب

Strong centered layout with gradient background section.

---

### Footer

Short brand statement:

CodConnect — منصة مغربية للتوريد والتسويق بنظام الدفع عند الاستلام (COD)

Links: WhatsApp | Instagram | Support

Minimal teal icons.

---

# 🔐 Authentication Pages

---

## 2️⃣ Affiliate Signup (`/affiliate-signup`)

Centered glass card.

Title: افتح حسابك كمسوق في CodConnect

Fields:

- الاسم الكامل
- رقم الهاتف
- المدينة (text input)
- WhatsApp
- كلمة السر

Button: إنشاء حساب

Add small login link below form.

---

## 3️⃣ Merchant Signup (`/merchant-signup`)

Title: افتح حسابك كتاجر وأضف منتجاتك

Fields:

- الاسم الكامل
- اسم المتجر
- رقم الهاتف
- المدينة
- WhatsApp
- كلمة السر

Button: إنشاء حساب كتاجر

---

# 🖥 Dashboard (Protected Area)

Create separate layout from public pages.

Dashboard layout includes:

- RTL sidebar
- Top navbar with user name and logout
- Clean SaaS structure

Sidebar Items:

Dashboard  
Products  
Orders  
Referral  
Training  
Support  
Logout

Active page indicator in teal.

---

## 4️⃣ Dashboard Home (`/dashboard`)

Top stat cards (4 cards):

- الأرباح (DH)
- الطلبات
- المبيعات
- عدد الإحالات

All start at 0.

Cards with subtle teal glow border and clean layout.

---

## 5️⃣ Products Page (`/products`)

Title: منتجات متاحة للبيع

Top filter bar:

الفئة:

- الكترونيات
- تجميل
- ملابس
- منتجات ترند

Product grid:

Each card includes:

- Image
- Name
- Price
- Gold commission badge
- Button: نسخ رابط البيع
- Button: تحميل الصور
- Optional: تحميل الفيديو

Clean SaaS-style grid spacing.

---

## 6️⃣ Orders Page (`/orders`) 🔥 (Important Addition)

Add simple orders table:

Columns:

- اسم المنتج
- اسم العميل
- المدينة
- الحالة (Pending / Confirmed / Delivered)
- العمولة

Modern minimal table style.

Even if static for now.

---

## 7️⃣ Referral Page (`/referral`)

Title: برنامج الإحالة

Section:

رابط الإحالة ديالك: codconnect.ma/ref/username

Copy button.

Stats:

- عدد المسجلين
- أرباح الإحالات

Mini leaderboard:

Top 3 affiliates (clean ranking cards).

---

## 8️⃣ Training Page (`/training`)

Glass cards:

- فيديوهات تدريبية
- نصائح للبيع عبر COD
- تحميل دليل PDF

Clean educational layout.

---

## 9️⃣ Support Page (`/support`)

Contact form:

- الاسم
- البريد الإلكتروني
- الرسالة

Plus:

زر واتساب مباشر للدعم

---

# ⚙️ Technical Architecture

- Separate layouts:
  - PublicLayout (Header + Footer)
  - DashboardLayout (Sidebar + Content)
- Reusable components:
  - ProductCard
  - StatCard
  - GlassCard
  - Button component
  - Badge component
- React Router structure:

/ /affiliate-signup /merchant-signup /dashboard /products /orders /referral /training /support

- Mock/static data for now
- Structure ready for backend API integration
- RTL direction set globally
- Clean folder organization