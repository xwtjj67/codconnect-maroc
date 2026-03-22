import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { PlayCircle, BookOpen, FileDown, ShoppingCart, Lock, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AdSlot from "@/components/shared/AdSlot";
import LockedFeature from "@/components/shared/LockedFeature";
import SecureVideoPlayer from "@/components/shared/SecureVideoPlayer";

interface TrainingItem {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  type: string;
  category: string;
  accessLevel: string;
  videoUrl: string | null;
  readTime: string | null;
}

const accessLevels: Record<string, string[]> = {
  standard: ["standard"],
  premium: ["standard", "premium"],
  vip: ["standard", "premium", "vip"],
};

const categoryFilters = ["الكل", "أساسيات", "استراتيجيات", "اختيار المنتجات", "تسويق", "إدارة العملاء", "تحليلات"];

// Static fallback content
const staticArticles = [
  { title: "كيف تبدأ في التسويق بنظام COD؟", desc: "دليل شامل للمبتدئين في عالم التسويق بنظام الدفع عند الاستلام.", category: "أساسيات", readTime: "5 دقائق", accessLevel: "standard" },
  { title: "أفضل 5 استراتيجيات لزيادة المبيعات", desc: "اكتشف الطرق الأكثر فعالية لزيادة مبيعاتك وتحسين معدل التأكيد.", category: "استراتيجيات", readTime: "7 دقائق", accessLevel: "standard" },
  { title: "كيف تختار المنتج الرابح؟", desc: "معايير اختيار المنتجات التي تحقق أعلى مبيعات.", category: "اختيار المنتجات", readTime: "6 دقائق", accessLevel: "standard" },
  { title: "أسرار التسويق عبر واتساب", desc: "تعلم كيفية استخدام واتساب كأداة تسويق فعالة.", category: "تسويق", readTime: "8 دقائق", accessLevel: "premium" },
  { title: "بناء قاعدة عملاء وفية", desc: "كيف تحول المشترين إلى عملاء دائمين.", category: "إدارة العملاء", readTime: "5 دقائق", accessLevel: "premium" },
  { title: "فهم التحليلات واستخدام البيانات", desc: "تعلم قراءة إحصائيات لوحة التحكم.", category: "تحليلات", readTime: "6 دقائق", accessLevel: "vip" },
];

const AffiliateTraining = () => {
  const { user } = useAuth();
  const [dbContent, setDbContent] = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedArticle, setSelectedArticle] = useState<TrainingItem | null>(null);

  const userPlan = user?.plan || "standard";
  const allowed = accessLevels[userPlan] || ["standard"];

  useEffect(() => {
    supabase
      .from("training_content")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setDbContent(
          (data || []).map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description,
            content: d.content,
            type: d.type,
            category: d.category,
            accessLevel: d.access_level,
            videoUrl: d.video_url,
            readTime: d.read_time,
          }))
        );
        setLoading(false);
      });
  }, []);

  // Combine DB content with static fallback
  const allContent: TrainingItem[] = dbContent.length > 0
    ? dbContent
    : staticArticles.map((a, i) => ({
        id: `static-${i}`,
        title: a.title,
        description: a.desc,
        content: null,
        type: "article",
        category: a.category,
        accessLevel: a.accessLevel,
        videoUrl: null,
        readTime: a.readTime,
      }));

  const filtered = allContent.filter(
    c => activeCategory === "الكل" || c.category === activeCategory
  );

  const articles = filtered.filter(c => c.type === "article");
  const videos = filtered.filter(c => c.type === "video");

  return (
    <AffiliateLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">مركز التدريب</h1>
          <p className="text-sm text-muted-foreground mt-1">تعلم واكتسب مهارات جديدة لزيادة أرباحك</p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeCategory === cat
                  ? "gradient-teal text-primary-foreground font-medium"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Resources */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: PlayCircle, title: "فيديوهات تدريبية", desc: "شاهد فيديوهات تعليمية حول التسويق بنظام COD.", action: "شاهد الفيديوهات" },
            { icon: FileDown, title: "تحميل دليل PDF", desc: "حمل الدليل الكامل للمسوقين الجدد.", action: "تحميل الدليل" },
            { icon: ShoppingCart, title: "أمثلة طلبات ناجحة", desc: "تعلم من أمثلة حقيقية لطلبات ناجحة.", action: "شاهد الأمثلة" },
          ].map((item, i) => (
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

        {/* Video courses section */}
        {videos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">🎬 دورات فيديو</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {videos.map(video => {
                const isLocked = !allowed.includes(video.accessLevel);
                return (
                  <LockedFeature key={video.id} isLocked={isLocked} message="قم بالترقية للوصول إلى هذا المحتوى">
                    <div className="glass-card-hover p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                          {video.category}
                        </span>
                        {video.accessLevel !== "standard" && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            video.accessLevel === "vip" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                          }`}>
                            {video.accessLevel.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm">{video.title}</h3>
                      {video.description && <p className="text-xs text-muted-foreground">{video.description}</p>}
                      {video.videoUrl && !isLocked && (
                        <SecureVideoPlayer url={video.videoUrl} title={video.title} />
                      )}
                    </div>
                  </LockedFeature>
                );
              })}
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">📚 مقالات تعليمية</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {articles.map((article, i) => {
              const isLocked = !allowed.includes(article.accessLevel);
              return (
                <LockedFeature key={article.id} isLocked={isLocked} message="قم بالترقية للوصول إلى هذا المحتوى">
                  <div className="glass-card-hover p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {article.accessLevel !== "standard" && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            article.accessLevel === "vip" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                          }`}>
                            {article.accessLevel.toUpperCase()}
                          </span>
                        )}
                        {article.readTime && (
                          <span className="text-[10px] text-muted-foreground">{article.readTime}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{article.title}</h3>
                        {article.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1">{article.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => !isLocked && setSelectedArticle(article)}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      اقرأ المقال ←
                    </button>
                  </div>
                </LockedFeature>
              );
            })}
          </div>
        </div>

        {/* Insert ad between sections */}
        {articles.length > 3 && <AdSlot />}

        {/* Article Reader Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedArticle(null)}>
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">{selectedArticle.title}</h2>
                <button onClick={() => setSelectedArticle(null)} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{selectedArticle.category}</span>
                {selectedArticle.readTime && <span>{selectedArticle.readTime}</span>}
              </div>
              <div className="prose prose-sm prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </div>
              <AdSlot />
            </div>
          </div>
        )}

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
