import PublicLayout from "@/components/layouts/PublicLayout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus, Package, BadgeDollarSign, ShieldCheck, Truck, Headphones,
  TrendingUp, Check, Star, Zap, Clock, LayoutGrid, Crown, Layers, BarChart3,
  GraduationCap, Shield, Infinity, Rocket, Flame, Timer, BookOpen, MessageCircle,
  Users, ShoppingCart, ClipboardCheck, Search, Wallet, LogIn, CheckCircle,
  Award, ThumbsUp, ArrowDown,
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

const openWhatsApp = (text: string) => {
  window.open(`https://wa.me/212778133038?text=${encodeURIComponent(text)}`, "_blank");
};

const plans = [
  {
    name: "Standard",
    originalPrice: "100",
    price: "30",
    badge: null,
    highlighted: false,
    features: [
      { icon: BadgeDollarSign, text: "عمولة: 10% على كل طلب مؤكد" },
      { icon: Package, text: "الوصول إلى 3 منتجات جاهزة" },
      { icon: Clock, text: "سحب الأرباح كل 30 يوم" },
      { icon: LayoutGrid, text: "عرض منتج أساسي" },
      { icon: Zap, text: "دخول فوري للمنصة" },
      { icon: Headphones, text: "دعم عبر واتساب" },
    ],
    cta: "ابدأ الآن — 30 DH فقط",
  },
  {
    name: "Premium",
    originalPrice: "350",
    price: "200",
    badge: "الأكثر مبيعاً",
    highlighted: false,
    features: [
      { icon: BadgeDollarSign, text: "عمولة: 20% — ضعف الربح" },
      { icon: Package, text: "الوصول إلى 5 منتجات مختارة" },
      { icon: Clock, text: "سحب الأرباح كل 20 يوم" },
      { icon: Layers, text: "صفحة منتج احترافية مفصلة" },
      { icon: Star, text: "أولوية في عرض المنتجات" },
      { icon: GraduationCap, text: "دورة تدريبية فيديو مجانية" },
    ],
    cta: "اشترك الآن — وفر 150 DH",
  },
  {
    name: "VIP",
    originalPrice: "500",
    price: "350",
    badge: "🔥 أفضل قيمة",
    highlighted: true,
    features: [
      { icon: BadgeDollarSign, text: "عمولة: 30% — أعلى عمولة" },
      { icon: Infinity, text: "منتجات غير محدودة" },
      { icon: Clock, text: "سحب الأرباح كل 10 أيام فقط" },
      { icon: BarChart3, text: "تحليلات متقدمة + بيانات حصرية" },
      { icon: Rocket, text: "أدوات تسويق VIP" },
      { icon: Shield, text: "دعم بريميوم 24/7" },
      { icon: TrendingUp, text: "استراتيجية نمو شخصية" },
      { icon: BookOpen, text: "فيديوهات تدريبية حصرية" },
    ],
    cta: "ابدأ VIP — وفر 150 DH",
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
          <h2 className="text-3xl md:text-4xl font-bold">اختر الباقة وابدأ الربح اليوم</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            لا تحتاج رأس مال، لا تحتاج مخزون. فقط اختر باقتك وابدأ
          </p>
        </div>

        {!expired && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative glass-card p-5 text-center space-y-3 border-accent/40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-accent/5 via-transparent to-accent/5 animate-glow-pulse" />
              <div className="relative flex items-center justify-center gap-2 text-accent font-bold text-lg animate-pulse">
                <Flame className="h-5 w-5" />
                <span>🔥 عرض الإطلاق — الأماكن محدودة!</span>
                <Flame className="h-5 w-5" />
              </div>
              <p className="relative text-sm text-muted-foreground">
                سجل الآن واحصل على أقل سعر. العرض ينتهي قريباً
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
                      <span className="text-muted-foreground text-sm">DH/شهر</span>
                    </div>
                    <p className="text-[11px] text-accent font-medium">⚡ لفترة محدودة جداً</p>
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

                <button
                  onClick={() => openWhatsApp(`أريد الاشتراك في خطة ${plan.name}`)}
                  className={`flex items-center justify-center gap-2 text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? "gradient-teal text-primary-foreground teal-glow hover:opacity-90"
                      : "border-2 border-primary/30 text-primary hover:bg-primary/10"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          ✅ بدون التزام طويل • إلغاء في أي وقت • دعم مباشر عبر واتساب
        </p>
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium mb-4">
            <Flame className="h-4 w-4" />
            +500 مسوق يربحون معنا الآن
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            ابدأ تجارة مربحة بدون رأس مال
            <br />
            <span className="text-primary">عبر نظام COD</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            نحن نوفر لك منتجات جاهزة، وأنت تربح من كل طلب بدون تخزين أو شحن.
            <br />
            <strong className="text-foreground">نحن نوفر المنتجات، أنت تسوق فقط.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/affiliate-signup" className="px-8 py-4 rounded-xl gradient-teal text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity teal-glow flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              ابدأ الربح اليوم
            </Link>
            <a href="#pricing" className="px-8 py-4 rounded-xl border-2 border-primary/40 text-primary font-semibold text-lg hover:bg-primary/10 transition-colors flex items-center gap-2">
              <ArrowDown className="h-5 w-5" />
              شوف الباقات
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login" className="px-6 py-2.5 rounded-lg bg-secondary/50 text-foreground font-medium hover:bg-secondary transition-colors flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              تسجيل الدخول
            </Link>
            <button onClick={() => openWhatsApp("مرحبا، عندي استفسار عن CodConnect")} className="px-6 py-2.5 rounded-lg bg-secondary/50 text-foreground font-medium hover:bg-secondary transition-colors flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              تواصل معنا
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground/70">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> منصة مغربية 100%</span>
            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> شحن وتأكيد مجاني</span>
            <span className="flex items-center gap-1.5"><Headphones className="h-4 w-4 text-primary" /> دعم مباشر 7/7</span>
          </div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section className="py-10 border-y border-border/30 bg-secondary/20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "+500", label: "مسوق نشط", icon: Users },
              { value: "+2,000", label: "طلب تمت معالجته", icon: ShoppingCart },
              { value: "+50", label: "منتج جاهز للتسويق", icon: Package },
              { value: "98%", label: "نسبة رضا العملاء", icon: ThumbsUp },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <span className="text-2xl md:text-3xl font-extrabold text-foreground">{stat.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">علاش CodConnect هي الخيار الأمثل؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              نحن نوفر المنتجات، أنت تسوق فقط — بدون مخاطرة
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Package, title: "منتجات جاهزة ومختارة", desc: "لا تبحث عن منتجات. نختار لك أفضل المنتجات الرابحة ونجهزها للتسويق فوراً" },
              { icon: BadgeDollarSign, title: "عمولات مضمونة تصل لـ 30%", desc: "اربح عمولة على كل طلب مؤكد. بدون حد أدنى، بدون مخاطرة مالية" },
              { icon: TrendingUp, title: "لوحة تحكم ذكية", desc: "تابع مبيعاتك، عمولاتك، وأداءك لحظة بلحظة من داشبورد احترافي" },
            ].map((item, i) => (
              <div key={i} className="glass-card-hover p-8 space-y-4 text-center">
                <div className="h-14 w-14 rounded-2xl gradient-teal flex items-center justify-center mx-auto">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">كيفاش تبدأ في 3 خطوات؟</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">
            الأمر بسيط: سجل، اختر، واربح. بدون تعقيد
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "الخطوة الأولى", title: "سجل حسابك مجاناً", desc: "أنشئ حسابك كمسوق في أقل من دقيقة واختر الباقة المناسبة", icon: ClipboardCheck },
              { step: "الخطوة الثانية", title: "اختر المنتجات وروّج", desc: "تصفح المنتجات الرابحة واحصل على روابط التسويق الخاصة بك", icon: Search },
              { step: "الخطوة الثالثة", title: "اربح العمولة", desc: "عند تأكيد الطلب من الزبون، تُضاف عمولتك تلقائياً لحسابك", icon: Wallet },
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

      {/* Social Proof */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">مسوقون حقيقيون، نتائج حقيقية</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "محمد ب.", city: "الدار البيضاء", text: "بديت من 0 وفي أول شهر ربحت أكثر من 2000 DH. المنتجات جاهزة والتأكيد سريع.", earnings: "2,340 DH" },
              { name: "سارة ل.", city: "مراكش", text: "أفضل منصة COD جربتها. الدعم سريع والعمولات تتحول في الوقت. أنصح بها!", earnings: "3,800 DH" },
              { name: "يوسف ع.", city: "الرباط", text: "كنت خايف نبدا، ولكن مع CodConnect كلشي واضح. باقة VIP غيرت لعبتي!", earnings: "5,200 DH" },
            ].map((t, i) => (
              <div key={i} className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                  <span className="gold-badge">{t.earnings}/شهر</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <PricingSection />

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-secondary/20">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">أسئلة متكررة</h2>
          <div className="space-y-4">
            {[
              { q: "واش خاصني رأس مال باش نبدا؟", a: "لا! أنت تدفع فقط اشتراك الباقة الشهرية (ابتداءً من 30 DH). المنتجات، الشحن، والتأكيد علينا." },
              { q: "كيفاش كنربح؟", a: "كل ما زبون يشري عن طريق رابطك، تاخد عمولة مباشرة (10% إلى 30% حسب باقتك)." },
              { q: "واش المنتجات ديالي ولا ديالكم؟", a: "المنتجات ديالنا. نحن نوفرها ونتحكم في السعر والشحن. أنت دورك هو التسويق فقط." },
              { q: "فوقتاش كنسحب أرباحي؟", a: "حسب باقتك: Standard كل 30 يوم، Premium كل 20 يوم، VIP كل 10 أيام." },
            ].map((faq, i) => (
              <div key={i} className="glass-card p-5 space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-sm text-muted-foreground pr-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container text-center space-y-8">
          <div className="max-w-2xl mx-auto glass-card p-12 space-y-6 teal-glow">
            <h2 className="text-3xl md:text-4xl font-bold">جاهز تبدأ تربح بدون رأس مال؟</h2>
            <p className="text-muted-foreground">
              انضم لأكثر من 500 مسوق يربحون يومياً مع CodConnect
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/affiliate-signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-teal text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
              >
                <Rocket className="h-5 w-5" />
                ابدأ الربح اليوم
              </Link>
              <button
                onClick={() => openWhatsApp("مرحبا، أريد الانضمام لـ CodConnect")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-primary/30 text-primary font-semibold text-lg hover:bg-primary/10 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                تواصل عبر واتساب
              </button>
            </div>
            <p className="text-xs text-muted-foreground/60">
              ✅ تسجيل سريع • ✅ بدون التزام • ✅ منتجات جاهزة
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
