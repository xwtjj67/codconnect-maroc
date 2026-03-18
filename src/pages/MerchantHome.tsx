import PublicLayout from "@/components/layouts/PublicLayout";
import { Link } from "react-router-dom";
import {
  Package, BarChart3, Users, ShieldCheck, Zap, Headphones,
  TrendingUp, MessageCircle, Crown, Rocket, Star,
  HandCoins, Truck, LogIn, Store, Settings, Layers,
  ShoppingCart, CheckCircle, Warehouse,
} from "lucide-react";

const openWhatsApp = (text: string) => {
  window.open(`https://wa.me/212778133038?text=${encodeURIComponent(text)}`, "_blank");
};

const sellerPlans = [
  {
    name: "Basic",
    subtitle: "صاحب متجر",
    price: "300",
    priceLabel: "DH/شهر",
    badge: null,
    highlighted: false,
    features: [
      { icon: Store, text: "متجر خاص داخل المنصة" },
      { icon: Settings, text: "التحكم الكامل في المنتجات والأسعار" },
      { icon: ShoppingCart, text: "استقبال الطلبات مباشرة" },
      { icon: HandCoins, text: "أرباح مباشرة من البيع" },
      { icon: Warehouse, text: "تخزين المنتجات (مستودع)" },
      { icon: Headphones, text: "دعم تقني أساسي" },
    ],
    cta: "ابدأ الآن — 300 DH",
  },
  {
    name: "Pro",
    subtitle: "شراكة مع CodConnect",
    price: null,
    priceLabel: "حسب الاتفاق",
    badge: "أفضل خيار",
    highlighted: true,
    features: [
      { icon: Rocket, text: "إدارة كاملة من طرف CodConnect" },
      { icon: Users, text: "تسويق احترافي عبر شبكة المسوقين" },
      { icon: TrendingUp, text: "إمكانية تحقيق مبيعات كبيرة" },
      { icon: Warehouse, text: "تخزين المنتجات وإدارة الطلبات" },
      { icon: Layers, text: "شروط خاصة حسب الاتفاق" },
      { icon: BarChart3, text: "دعم العمليات والتتبع" },
      { icon: ShieldCheck, text: "دعم بريميوم مخصص" },
    ],
    cta: "تواصل معنا للتفاوض",
  },
];

const MerchantHome = () => {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="container relative text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            حوّل منتجاتك إلى مصدر دخل مستمر
            <br />
            <span className="text-accent">بدون عناء التسويق أو إدارة الطلبات</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            نحن نوفر لك شبكة مسوقين نشطين ونساعدك على تصريف منتجاتك بسرعة،
            <br />
            مع نظام مرن يضمن لك بيع كميات أكبر بأقل مجهود.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#seller-plans" className="px-8 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(202,158,60,0.3)]">
              شوف الباقات
            </a>
            <Link to="/merchant-signup" className="px-8 py-3 rounded-xl border-2 border-accent/40 text-accent font-semibold text-lg hover:bg-accent/10 transition-colors flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              سجل كمورد منتجات
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">كيف يعمل النظام؟</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            نظام بسيط ومرن يناسب موردي المنتجات
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "وفر المنتج", desc: "أضف منتجاتك وحدد سعر التكلفة الخاص بك", icon: Package },
              { step: "2", title: "نحن نتكفل بالباقي", desc: "CodConnect تدير التسويق، التأكيد، والشحن عبر شبكة مسوقين", icon: ShieldCheck },
              { step: "3", title: "اربح من المبيعات", desc: "تربح حسب الكمية المباعة بدون أي مجهود تسويقي", icon: HandCoins },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mx-auto">
                  <item.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <p className="text-xs font-semibold text-accent">الخطوة {item.step}</p>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">علاش تختار CodConnect؟</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Users, title: "شبكة مسوقين جاهزة", desc: "مسوقون نشطون يروجون لمنتجاتك فورًا بدون أي جهد منك" },
              { icon: Truck, title: "لا تسويق ولا شحن", desc: "نحن نتكفل بكل شيء: التسويق، التأكيد، والشحن" },
              { icon: BarChart3, title: "تتبع المبيعات", desc: "تابع الطلبات والأرباح من لوحة التحكم الخاصة بك" },
            ].map((item, i) => (
              <div key={i} className="glass-card-hover p-8 space-y-4 text-center">
                <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mx-auto">
                  <item.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Plans */}
      <section id="seller-plans" className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        <div className="container relative">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">اختر الباقة المناسبة لك</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              سواء كنت تريد متجرك الخاص أو شراكة كاملة، لدينا ما يناسبك
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
            {sellerPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-[1px] transition-transform duration-300 hover:scale-[1.03] ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-accent via-gold to-accent shadow-[0_0_50px_rgba(202,158,60,0.3)]"
                    : "bg-border/50"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full text-xs font-bold bg-accent text-accent-foreground">
                      <Crown className="h-3 w-3" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`flex flex-col flex-1 rounded-2xl p-8 space-y-6 ${
                  plan.highlighted ? "bg-card" : "bg-card/80"
                }`}>
                  <div className="text-center space-y-2">
                    <h3 className={`text-2xl font-bold ${plan.highlighted ? "text-accent" : "text-foreground"}`}>
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
                    <div className="space-y-1">
                      {plan.price ? (
                        <>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                            <span className="text-muted-foreground text-sm">{plan.priceLabel}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-semibold text-accent">{plan.priceLabel}</p>
                          <p className="text-xs text-muted-foreground">يتطلب موافقة</p>
                        </>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <f.icon className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-accent" : "text-accent/70"}`} />
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
                        ? "bg-accent text-accent-foreground shadow-[0_0_20px_rgba(202,158,60,0.3)] hover:opacity-90"
                        : "border-2 border-accent/30 text-accent hover:bg-accent/10"
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

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container text-center space-y-8">
          <div className="max-w-2xl mx-auto glass-card p-12 space-y-6 border-accent/30 shadow-[0_0_40px_rgba(202,158,60,0.15)]">
            <h2 className="text-3xl md:text-4xl font-bold">جاهز تبدأ البيع؟</h2>
            <p className="text-muted-foreground">تواصل معنا عبر واتساب وابدأ اليوم</p>
            <a
              href="https://wa.me/212778133038"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
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

export default MerchantHome;
