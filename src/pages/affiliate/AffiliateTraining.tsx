import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { PlayCircle, BookOpen, Search, Lock, X, Eye, Clock } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import LockedFeature from "@/components/shared/LockedFeature";
import GoogleDrivePlayer from "@/components/shared/GoogleDrivePlayer";

interface TrainingItem { id: string; title: string; description: string | null; content: string | null; type: string; category: string; accessLevel: string; videoUrl: string | null; readTime: string | null; thumbnail: string | null; viewsCount: number; }
const accessLevels: Record<string, string[]> = { standard: ["standard"], premium: ["standard", "premium"], vip: ["standard", "premium", "vip"] };
const categoryFilters = ["الكل", "أساسيات", "استراتيجيات", "اختيار المنتجات", "تسويق", "إدارة العملاء", "تحليلات"];
const accessBadge: Record<string, { label: string; cls: string }> = { standard: { label: "STANDARD", cls: "bg-secondary/50 text-muted-foreground" }, premium: { label: "PREMIUM", cls: "bg-primary/10 text-primary" }, vip: { label: "VIP", cls: "bg-accent/10 text-accent" } };

const AffiliateTraining = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<TrainingItem | null>(null);
  const userPlan = user?.plan || "standard";
  const allowed = accessLevels[userPlan] || ["standard"];

  useEffect(() => {
    api.getTrainingContent().then(({ content }) => {
      setItems(content.map((d: any) => ({ id: d.id, title: d.title, description: d.description, content: d.content, type: d.type, category: d.category, accessLevel: d.access_level, videoUrl: d.video_url, readTime: d.read_time, thumbnail: d.thumbnail, viewsCount: d.views_count || 0 })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const trackView = useCallback(async (item: TrainingItem) => {
    if (!user) return;
    try { await api.trackView(item.id); } catch { }
  }, [user]);

  const openItem = (item: TrainingItem) => { if (!allowed.includes(item.accessLevel)) return; setSelectedItem(item); trackView(item); };
  const filtered = items.filter(c => (activeCategory === "الكل" || c.category === activeCategory) && (!searchQuery.trim() || c.title.toLowerCase().includes(searchQuery.trim().toLowerCase())));
  const videos = filtered.filter(c => c.type === "video");
  const articles = filtered.filter(c => c.type === "article");

  return (
    <AffiliateLayout>
      <div className="space-y-8 animate-fade-in">
        <div><h1 className="text-2xl font-bold">أكاديمية CodConnect</h1><p className="text-sm text-muted-foreground mt-1">تعلم واكتسب مهارات جديدة لزيادة أرباحك</p></div>
        <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="ابحث في الدورات والمقالات..." className="w-full h-10 pr-10 pl-4 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground" /></div>
        <div className="flex flex-wrap gap-2">{categoryFilters.map(cat => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${activeCategory === cat ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>{cat}</button>))}</div>

        {loading ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="glass-card p-0 overflow-hidden animate-pulse"><div className="h-40 bg-secondary/30" /><div className="p-4 space-y-2"><div className="h-4 bg-secondary/30 rounded w-3/4" /></div></div>)}</div> : (
          <>
            {videos.length > 0 && <div className="space-y-4"><h2 className="text-lg font-bold flex items-center gap-2"><PlayCircle className="h-5 w-5 text-primary" /> دورات فيديو</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{videos.map(video => { const isLocked = !allowed.includes(video.accessLevel); const badge = accessBadge[video.accessLevel]; return (<LockedFeature key={video.id} isLocked={isLocked} message="هذا المحتوى متاح فقط للمشتركين في هذه الباقة"><div className="glass-card-hover p-0 overflow-hidden cursor-pointer group" onClick={() => openItem(video)}><div className="relative h-40 bg-secondary/20 flex items-center justify-center overflow-hidden">{video.thumbnail ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <PlayCircle className="h-12 w-12 text-primary/40" />}<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">{isLocked ? <Lock className="h-8 w-8 text-white" /> : <PlayCircle className="h-10 w-10 text-white" />}</div><span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${badge.cls}`}>{badge.label}</span></div><div className="p-4 space-y-2"><span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{video.category}</span><h3 className="font-bold text-sm line-clamp-2">{video.title}</h3><div className="flex items-center gap-3 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {video.viewsCount}</span></div></div></div></LockedFeature>); })}</div></div>}
            {articles.length > 0 && <div className="space-y-4"><h2 className="text-lg font-bold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> مقالات تعليمية</h2><div className="grid sm:grid-cols-2 gap-4">{articles.map(article => { const isLocked = !allowed.includes(article.accessLevel); const badge = accessBadge[article.accessLevel]; return (<LockedFeature key={article.id} isLocked={isLocked} message="هذا المحتوى متاح فقط للمشتركين في هذه الباقة"><div className="glass-card-hover p-5 space-y-3"><div className="flex items-center justify-between"><span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{article.category}</span>{article.accessLevel !== "standard" && <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.cls}`}>{badge.label}</span>}</div><h3 className="font-bold text-sm">{article.title}</h3><button onClick={() => openItem(article)} className="text-xs text-primary font-medium hover:underline">اقرأ المقال ←</button></div></LockedFeature>); })}</div></div>}
            {filtered.length === 0 && <div className="glass-card p-12 text-center space-y-3"><Search className="h-10 w-10 text-muted-foreground mx-auto" /><p className="text-muted-foreground">لم يتم العثور على محتوى</p></div>}
          </>
        )}

        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
            <div className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border/30"><h2 className="font-bold text-lg line-clamp-1">{selectedItem.title}</h2><button onClick={() => setSelectedItem(null)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button></div>
              {selectedItem.type === "video" && selectedItem.videoUrl && <div className="p-4"><GoogleDrivePlayer fileId={selectedItem.videoUrl} title={selectedItem.title} /></div>}
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{selectedItem.category}</span>{selectedItem.readTime && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {selectedItem.readTime}</span>}<span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {selectedItem.viewsCount + 1}</span></div>
                {selectedItem.content && <div className="prose prose-sm prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap">{selectedItem.content}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateTraining;
