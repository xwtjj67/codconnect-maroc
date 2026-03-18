import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { PlayCircle, BookOpen, FileDown, TrendingUp, Target, Lightbulb, Users, ShoppingCart, BarChart3 } from "lucide-react";

const articles = [
  {
    title: "كيف تبدأ في التسويق بنظام COD؟",
    desc: "دليل شامل للمبتدئين في عالم التسويق بنظام الدفع عند الاستلام. تعلم الأساسيات وابدأ رحلة الربح.",
    icon: BookOpen,
    category: "أساسيات",
    readTime: "5 دقائق",
  },
  {
    title: "أفضل 5 استراتيجيات لزيادة المبيعات",
    desc: "اكتشف الطرق الأكثر فعالية لزيادة مبيعاتك وتحسين معدل التأكيد مع نصائح عملية مجربة.",
    icon: TrendingUp,
    category: "استراتيجيات",
    readTime: "7 دقائق",
  },
  {
    title: "كيف تختار المنتج الرابح؟",
    desc: "معايير اختيار المنتجات التي تحقق أعلى مبيعات ونصائح لتجنب المنتجات الخاسرة.",
    icon: Target,
    category: "اختيار المنتجات",
    readTime: "6 دقائق",
  },
  {
    title: "أسرار التسويق عبر واتساب",
    desc: "تعلم كيفية استخدام واتساب كأداة تسويق فعالة لتحقيق مبيعات يومية مستمرة.",
    icon: Lightbulb,
    category: "تسويق",
    readTime: "8 دقائق",
  },
  {
    title: "بناء قاعدة عملاء وفية",
    desc: "كيف تحول المشترين إلى عملاء دائمين وتبني شبكة إحالات قوية تزيد أرباحك.",
    icon: Users,
    category: "إدارة العملاء",
    readTime: "5 دقائق",
  },
  {
    title: "فهم التحليلات واستخدام البيانات",
    desc: "تعلم قراءة إحصائيات لوحة التحكم واستخدامها لاتخاذ قرارات تسويقية ذكية.",
    icon: BarChart3,
    category: "تحليلات",
    readTime: "6 دقائق",
  },
];

const quickResources = [
  {
    icon: PlayCircle,
    title: "فيديوهات تدريبية",
    desc: "شاهد فيديوهات تعليمية حول كيفية البيع عبر نظام COD وتحقيق أقصى ربح.",
    action: "شاهد الفيديوهات",
  },
  {
    icon: FileDown,
    title: "تحميل دليل PDF",
    desc: "حمل الدليل الكامل للمسوقين الجدد واحتفظ به كمرجع دائم.",
    action: "تحميل الدليل",
  },
  {
    icon: ShoppingCart,
    title: "أمثلة طلبات ناجحة",
    desc: "تعلم من أمثلة حقيقية لطلبات ناجحة وكيف حققت أرباحاً عالية.",
    action: "شاهد الأمثلة",
  },
];

const AdSlot = () => (
  <div className="glass-card p-6 text-center border-dashed border-2 border-border/50">
    <p className="text-xs text-muted-foreground/50">— مساحة إعلانية —</p>
    {/* AdSense Slot: Replace with actual ad code */}
  </div>
);

const AffiliateTraining = () => {
  return (
    <AffiliateLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">مركز التدريب</h1>
          <p className="text-sm text-muted-foreground mt-1">تعلم واكتسب مهارات جديدة لزيادة أرباحك</p>
        </div>

        {/* Quick Resources */}
        <div className="grid sm:grid-cols-3 gap-4">
          {quickResources.map((item, i) => (
            <div key={i} className="glass-card-hover p-5 space-y-3">
              <div className="h-10 w-10 rounded-xl gradient-teal flex items-center justify-center text-primary-foreground">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              <button className="w-full py-2 rounded-lg border border-primary/30 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">
                {item.action}
              </button>
            </div>
          ))}
        </div>

        <AdSlot />

        {/* Articles Grid */}
        <div>
          <h2 className="text-lg font-bold mb-4">مقالات تعليمية</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {articles.slice(0, 3).map((article, i) => (
              <div key={i} className="glass-card-hover p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{article.readTime}</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 mt-0.5">
                    <article.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{article.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{article.desc}</p>
                  </div>
                </div>
                <button className="text-xs text-primary font-medium hover:underline">اقرأ المقال ←</button>
              </div>
            ))}
          </div>
        </div>

        <AdSlot />

        <div className="grid sm:grid-cols-2 gap-4">
          {articles.slice(3).map((article, i) => (
            <div key={i} className="glass-card-hover p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                  {article.category}
                </span>
                <span className="text-[10px] text-muted-foreground">{article.readTime}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 mt-0.5">
                  <article.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{article.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{article.desc}</p>
                </div>
              </div>
              <button className="text-xs text-primary font-medium hover:underline">اقرأ المقال ←</button>
            </div>
          ))}
        </div>

        <AdSlot />

        {/* Newsletter CTA */}
        <div className="glass-card p-6 text-center space-y-3">
          <h3 className="font-bold">ابقَ على اطلاع بأحدث النصائح</h3>
          <p className="text-sm text-muted-foreground">سنرسل لك أفضل المحتوى التعليمي مباشرة</p>
          <button
            onClick={() => window.open("https://wa.me/212778133038?text=" + encodeURIComponent("أريد الاشتراك في نشرة التدريب"), "_blank")}
            className="px-6 py-2.5 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            اشترك عبر واتساب
          </button>
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateTraining;
