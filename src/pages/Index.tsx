import PublicLayout from "@/components/layouts/PublicLayout";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  UserPlus, Package, BadgeDollarSign, ShieldCheck, Truck, Headphones,
  TrendingUp, Users, ShoppingCart, Store, Check, Star, Zap, BookOpen,
  Video, Clock, LayoutGrid, MessageCircle, Crown, Layers, BarChart3,
  GraduationCap, Shield, Infinity, Rocket, Flame, Timer
} from "lucide-react";

const useCountdown = (hours: number) => {
  const [end] = useState(() => {
    const stored = localStorage.getItem("codconnect_promo_end");
    if (stored) return parseInt(stored);
    const e = Date.now() + hours * 60 * 60 * 1000;
    localStorage.setItem("codconnect_promo_end", String(e));
    return e;
  });
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, end - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, end - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [end]);

  const h = Math.floor(timeLeft / 3600000);
  const m = Math.floor((timeLeft % 3600000) / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  return { h, m, s, expired: timeLeft <= 0 };
};

const plans = [
  {
    name: "Standard",
    originalPrice: "100",
    price: "30",
    badge: null,
    highlighted: false,
    features: [
      { icon: BadgeDollarSign, text: "عمولة: 10%" },
      { icon: Package, text: "عدد المنتجات: 3" },
      { icon: Clock, text: "مدة سحب الأرباح: 30 يوم" },
      { icon: LayoutGrid, text: "عرض منتج أساسي" },
      { icon: Zap, text: "وصول مجاني للمنصة" },
      { icon: Headphones, text: "دعم عادي" },
    ],
    cta: "ابدأ الآن",
  },
  {
    name: "Premium",
    originalPrice: "350",
    price: "200",
    badge: "الأكثر توازناً",
    highlighted: false,
    features: [
      { icon: BadgeDollarSign, text: "عمولة: 20%" },
      { icon: Package, text: "عدد المنتجات: 5" },
      { icon: Clock, text: "مدة سحب الأرباح: 20 يوم" },
      { icon: Layers, text: "صفحة منتج مفصلة" },
      { icon: Users, text: "وصول للمجموعة الخاصة" },
      { icon: Star, text: "أولوية في عرض المنتجات" },
      { icon: GraduationCap, text: "دورة فيديو مدمجة" },
    ],
    cta: "اشترك الآن",
  },
  {
    name: "VIP",
    originalPrice: "500",
    price: "350",
    badge: "أفضل خيار",
    highlighted: true,
    features: [
      { icon: BadgeDollarSign, text: "عمولة: 30%" },
      { icon: Infinity, text: "منتجات غير محدودة" },
      { icon: Clock, text: "مدة سحب الأرباح: 10 أيام" },
      { icon: BarChart3, text: "نظام معلومات متقدم للمنتجات" },
      { icon: Rocket, text: "أدوات تسويق متقدمة" },
      { icon: Shield, text: "دعم بريميوم 24/7" },
      { icon: TrendingUp, text: "تأكيد + استراتيجية نمو" },
      { icon: BookOpen, text: "فيديوهات تدريبية متقدمة" },
    ],
    cta: "ابدأ VIP",
  },
];

const Index = () => {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-glow/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="container relative text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            ابدأ التجارة بلا رأس مال
            <br />
            <span className="text-primary">عبر نظام COD</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            سواء كنت تاجرًا تريد بيع منتجاتك عبر شبكة مسوقين،
            <br />
            أو مسوقًا ترغب في الربح بدون مخزون — CodConnect تربطك بالحل الكامل.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/affiliate-signup" className="px-8 py-3 rounded-xl gradient-teal text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity teal-glow">
              سجل كمسوق
            </Link>
            <Link to="/merchant-signup" className="px-8 py-3 rounded-xl border-2 border-primary/40 text-primary font-semibold text-lg hover:bg-primary/10 transition-colors">
              سجل كتاجر
            </Link>
          </div>
          <p className="text-sm text-muted-foreground/70 flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-primary" /> منصة مغربية</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Truck className="h-4 w-4 text-primary" /> شحن سريع</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Headphones className="h-4 w-4 text-primary" /> دعم مباشر</span>
          </p>
        </div>
      </section>

      {/* Audience Split */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">لمن هذه المنصة؟</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card-hover p-8 space-y-5">
              <div className="h-14 w-14 rounded-2xl gradient-teal flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-primary">للمسوقين</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2"><BadgeDollarSign className="h-4 w-4 text-accent shrink-0" /> عمولات على كل طلب مؤكد</li>
                <li className="flex items-center gap-2"><Package className="h-4 w-4 text-accent shrink-0" /> لا تحتاج مخزون</li>
                <li className="flex items-center gap-2"><UserPlus className="h-4 w-4 text-accent shrink-0" /> روابط بيع خاصة بك</li>
              </ul>
            </div>
            <div className="glass-card-hover p-8 space-y-5">
              <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                <Store className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-accent">للتجار</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2"><Users className="h-4 w-4 text-primary shrink-0" /> وصول إلى شبكة مسوقين</li>
                <li className="flex items-center gap-2"><ShoppingCart className="h-4 w-4 text-primary shrink-0" /> إدارة الطلبات عبر لوحة تحكم</li>
                <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary shrink-0" /> تكفل بالشحن و COD</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">كيفاش كتخدم المنصة؟</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "١", title: "إنشاء حساب", desc: "سجل مجانا كمسوق أو كتاجر", icon: UserPlus },
              { step: "٢", title: "اختيار أو إضافة منتج", desc: "تصفح المنتجات أو أضف منتجاتك", icon: Package },
              { step: "٣", title: "تأكيد الطلب وربح العمولة", desc: "عند تأكيد الطلب تربح عمولتك", icon: BadgeDollarSign },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl gradient-teal flex items-center justify-center mx-auto text-primary-foreground text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <PricingSection />

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">أرقام المنصة</h2>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: "مسوقين", value: "+120", icon: Users },
              { label: "طلبات", value: "+340", icon: ShoppingCart },
              { label: "تجار", value: "+25", icon: Store },
            ].map((s, i) => (
              <div key={i} className="glass-card p-6 text-center space-y-2">
                <s.icon className="h-8 w-8 text-primary mx-auto" />
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container text-center space-y-8">
          <div className="max-w-2xl mx-auto glass-card p-12 space-y-6 teal-glow">
            <h2 className="text-3xl md:text-4xl font-bold">انضم الآن إلى CodConnect وابدأ اليوم</h2>
            <p className="text-muted-foreground">سجل مجانا وابدأ في الربح من نظام الدفع عند الاستلام</p>
            <Link to="/affiliate-signup" className="inline-block px-10 py-4 rounded-xl gradient-teal text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
