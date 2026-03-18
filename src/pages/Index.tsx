import PublicLayout from "@/components/layouts/PublicLayout";
import { useState, useEffect } from "react";
import {
  UserPlus, Package, BadgeDollarSign, ShieldCheck, Truck, Headphones,
  TrendingUp, Check, Star, Zap, Clock, LayoutGrid, Crown, Layers, BarChart3,
  GraduationCap, Shield, Infinity, Rocket, Flame, Timer, BookOpen, MessageCircle,
  Users, ShoppingCart, ClipboardCheck, Search, Wallet,
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

const WHATSAPP_BASE = "https://api.whatsapp.com/send?phone=212778133038&text=";
const getWhatsAppLink = (planName: string) => {
  const msg = encodeURIComponent(
    `أنا عميل مسوق وكنهتم بالاشتراك معكم في باقاتكم. بعد الاطلاع على الخيارات المتاحة، أحب أبدأ معكم مباشرة بخطة ${planName}.`
  );
  return `${WHATSAPP_BASE}${msg}`;
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

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl md:text-3xl font-extrabold text-foreground tabular-nums bg-secondary/60 rounded-lg px-3 py-1 min-w-[3rem] text-center border border-border/50">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[10px] text-muted-foreground mt-1">{label}</span>
  </div>
);

const PricingSection = () => {
  const { h, m, s, expired } = useCountdown(48);

  return (
    <section id="pricing" className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="container relative">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">اختر الخطة المناسبة لك</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            ابدأ التسويق عبر نظام COD بسهولة وبدون رأس مال
          </p>
        </div>

        {/* Launch Offer Banner */}
        {!expired && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative glass-card p-5 text-center space-y-3 border-accent/40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-accent/5 via-transparent to-accent/5 animate-glow-pulse" />
              <div className="relative flex items-center justify-center gap-2 text-accent font-bold text-lg animate-pulse">
                <Flame className="h-5 w-5" />
                <span>🔥 عرض الإطلاق — ينتهي خلال 48 ساعة</span>
                <Flame className="h-5 w-5" />
              </div>
              <p className="relative text-sm text-muted-foreground">
                ابدأ الآن قبل انتهاء العرض واستفد من أقل سعر
              </p>
              <div className="relative flex items-center justify-center gap-3">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <CountdownUnit value={h} label="ساعة" />
                  <span className="text-xl font-bold text-muted-foreground pb-4">:</span>
                  <CountdownUnit value={m} label="دقيقة" />
                  <span className="text-xl font-bold text-muted-foreground pb-4">:</span>
                  <CountdownUnit value={s} label="ثانية" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-[1px] transition-transform duration-300 hover:scale-[1.03] ${
                plan.highlighted
                  ? "bg-gradient-to-b from-primary via-teal-glow to-primary shadow-[0_0_50px_rgba(20,184,166,0.3)]"
                  : "bg-border/50"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className={`inline-flex items-center gap-1 px-4 py-1 rounded-full text-xs font-bold ${
                    plan.highlighted
                      ? "gradient-teal text-primary-foreground"
                      : "bg-accent/20 text-accent border border-accent/30"
                  }`}>
                    {plan.highlighted && <Crown className="h-3 w-3" />}
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`flex flex-col flex-1 rounded-2xl p-8 space-y-6 ${
                plan.highlighted ? "bg-card" : "bg-card/80"
              }`}>
                <div className="text-center space-y-2">
                  <h3 className={`text-2xl font-bold ${plan.highlighted ? "text-primary" : "text-foreground"}`}>
                    {plan.name}
                  </h3>
                  <div className="space-y-1">
                    <span className="text-sm line-through text-destructive/70">{plan.originalPrice} DH</span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">DH</span>
                    </div>
                    <p className="text-xs text-muted-foreground">اشتراك شهري</p>
                    <p className="text-[11px] text-accent font-medium">لفترة محدودة</p>
                  </div>
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <f.icon className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-primary" : "text-primary/70"}`} />
                      {f.text}
                    </li>
                  ))}
                </ul>

                <a
                  href={getWhatsAppLink(plan.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? "gradient-teal text-primary-foreground teal-glow hover:opacity-90"
                      : "border-2 border-primary/30 text-primary hover:bg-primary/10"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
            نوفر لك منتجات جاهزة للتسويق
            <br />
            <span className="text-primary">بنظام COD — بدون رأس مال</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            سجل كمسوق، اختر المنتجات، وابدأ الربح من العمولات.
            <br />
            CodConnect تتكفل بالمنتج، الشحن، والتأكيد.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing" className="px-8 py-3 rounded-xl gradient-teal text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity teal-glow">
              شوف الباقات
            </a>
            <a href="https://wa.me/212778133038" target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-xl border-2 border-primary/40 text-primary font-semibold text-lg hover:bg-primary/10 transition-colors flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              تواصل معنا
            </a>
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

      {/* For Affiliates */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">علاش CodConnect؟</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Package, title: "منتجات جاهزة", desc: "نوفر لك منتجات مختارة بعناية جاهزة للتسويق" },
              { icon: BadgeDollarSign, title: "عمولات مضمونة", desc: "اربح عمولة على كل طلب مؤكد — بدون مخاطرة" },
              { icon: TrendingUp, title: "أدوات تتبع متقدمة", desc: "تابع أداءك، مبيعاتك، وأرباحك من لوحة تحكمك" },
            ].map((item, i) => (
              <div key={i} className="glass-card-hover p-8 space-y-4 text-center">
                <div className="h-14 w-14 rounded-2xl gradient-teal flex items-center justify-center mx-auto">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">كيفاش تبدأ؟</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "الخطوة الأولى", title: "سجل حسابك", desc: "أنشئ حسابك كمسوق واختر الباقة المناسبة", icon: ClipboardCheck },
              { step: "الخطوة الثانية", title: "اختر المنتجات", desc: "تصفح المنتجات الجاهزة وابدأ الترويج لها", icon: Search },
              { step: "الخطوة الثالثة", title: "اربح العمولة", desc: "عند تأكيد الطلب، تربح عمولتك مباشرة", icon: Wallet },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="h-14 w-14 rounded-2xl gradient-teal flex items-center justify-center mx-auto">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <p className="text-xs font-semibold text-primary">{item.step}</p>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">أرقام المنصة</h2>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: "مسوقين نشطين", value: "+120", icon: Users },
              { label: "طلبات مؤكدة", value: "+340", icon: ShoppingCart },
              { label: "منتجات متوفرة", value: "+48", icon: Package },
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

      {/* Pricing Plans */}
      <PricingSection />

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container text-center space-y-8">
          <div className="max-w-2xl mx-auto glass-card p-12 space-y-6 teal-glow">
            <h2 className="text-3xl md:text-4xl font-bold">جاهز تبدأ تسويق وتربح؟</h2>
            <p className="text-muted-foreground">تواصل معنا عبر واتساب وابدأ اليوم</p>
            <a
              href="https://wa.me/212778133038"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl gradient-teal text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-5 w-5" />
              تواصل عبر واتساب
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
