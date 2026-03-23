import AdminLayout from "@/components/layouts/AdminLayout";
import { useState, useEffect } from "react";
import { Plus, Loader2, Trash2, BookOpen, PlayCircle, Edit, Eye, Link2 } from "lucide-react";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { extractDriveFileId } from "@/components/shared/GoogleDrivePlayer";

interface TrainingItem {
  id: string; title: string; description: string | null; content: string | null;
  type: string; category: string; accessLevel: string; videoUrl: string | null;
  readTime: string | null; isPublished: boolean; sortOrder: number;
  thumbnail: string | null; viewsCount: number;
}

const categories = ["أساسيات", "استراتيجيات", "اختيار المنتجات", "تسويق", "إدارة العملاء", "تحليلات"];
const accessLevels = ["standard", "premium", "vip"];
const accessLabels: Record<string, string> = { standard: "Standard", premium: "Premium", vip: "VIP" };
const accessColors: Record<string, string> = { standard: "bg-secondary/50 text-muted-foreground", premium: "bg-primary/10 text-primary", vip: "bg-accent/10 text-accent" };

const AdminTraining = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", content: "", type: "article",
    category: "أساسيات", accessLevel: "standard", videoUrl: "", readTime: "",
    isPublished: true, sortOrder: 0, thumbnail: "",
  });

  const fetchItems = async () => {
    try {
      const { content } = await api.getAllTraining();
      setItems(content.map((d: any) => ({
        id: d.id, title: d.title, description: d.description, content: d.content,
        type: d.type, category: d.category, accessLevel: d.access_level,
        videoUrl: d.video_url, readTime: d.read_time, isPublished: d.is_published,
        sortOrder: d.sort_order, thumbnail: d.thumbnail, viewsCount: d.views_count || 0,
      })));
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", content: "", type: "article", category: "أساسيات", accessLevel: "standard", videoUrl: "", readTime: "", isPublished: true, sortOrder: 0, thumbnail: "" });
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (item: TrainingItem) => {
    setForm({
      title: item.title, description: item.description || "", content: item.content || "",
      type: item.type, category: item.category, accessLevel: item.accessLevel,
      videoUrl: item.videoUrl || "", readTime: item.readTime || "",
      isPublished: item.isPublished, sortOrder: item.sortOrder, thumbnail: item.thumbnail || "",
    });
    setEditingId(item.id); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);

    let videoUrl = form.videoUrl.trim() || null;
    if (videoUrl && form.type === "video") {
      const fileId = extractDriveFileId(videoUrl);
      if (fileId) videoUrl = fileId;
    }

    const payload = {
      title: form.title.trim(), description: form.description.trim() || null,
      content: form.content.trim() || null, type: form.type, category: form.category,
      access_level: form.accessLevel, video_url: videoUrl,
      read_time: form.readTime.trim() || null, is_published: form.isPublished,
      sort_order: form.sortOrder, thumbnail: form.thumbnail.trim() || null,
    };

    try {
      if (editingId) {
        await api.updateTraining(editingId, payload);
      } else {
        await api.createTraining(payload);
      }
      toast({ title: "تم بنجاح", description: editingId ? "تم تحديث المحتوى" : "تم إضافة المحتوى" });
      resetForm(); fetchItems();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTraining(id);
      toast({ title: "تم الحذف" }); fetchItems();
    } catch { }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">إدارة المحتوى التدريبي</h1>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> إضافة محتوى
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">{editingId ? "تعديل المحتوى" : "إضافة محتوى جديد"}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm font-medium">العنوان *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">النوع</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"><option value="article">مقال</option><option value="video">فيديو (Google Drive)</option></select></div>
              <div className="space-y-1"><label className="text-sm font-medium">الفئة</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="space-y-1"><label className="text-sm font-medium">مستوى الوصول</label><select value={form.accessLevel} onChange={e => setForm(f => ({ ...f, accessLevel: e.target.value }))} className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">{accessLevels.map(l => <option key={l} value={l}>{accessLabels[l]}</option>)}</select></div>
              <div className="space-y-1"><label className="text-sm font-medium">وقت القراءة</label><input value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} placeholder="5 دقائق" className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">الترتيب</label><input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" dir="ltr" /></div>
            </div>
            {form.type === "video" && (
              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" /> رابط Google Drive</label>
                <input value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} dir="ltr" placeholder="https://drive.google.com/file/d/FILE_ID/view" className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <p className="text-xs text-muted-foreground">الصق رابط Google Drive وسيتم تحويله تلقائياً</p>
              </div>
            )}
            <div className="space-y-1"><label className="text-sm font-medium">رابط الصورة المصغرة (اختياري)</label><input value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} dir="ltr" className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">الوصف القصير</label><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">المحتوى الكامل</label><textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="published" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} /><label htmlFor="published" className="text-sm">منشور</label></div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-lg gradient-teal text-primary-foreground font-medium text-sm hover:opacity-90 flex items-center gap-2 disabled:opacity-50">{submitting && <Loader2 className="h-4 w-4 animate-spin" />}{editingId ? "تحديث" : "إضافة"}</button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-lg bg-secondary/50 text-muted-foreground text-sm hover:bg-secondary">إلغاء</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="glass-card p-12 text-center"><div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : items.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3"><BookOpen className="h-12 w-12 text-muted-foreground mx-auto" /><p className="text-lg font-medium text-muted-foreground">لا يوجد محتوى تدريبي بعد</p></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50">
                  <th className="text-right p-4 font-medium text-muted-foreground">العنوان</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">النوع</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الفئة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المستوى</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المشاهدات</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">إجراءات</th>
                </tr></thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="p-4 font-medium">{item.title}</td>
                      <td className="p-4"><span className="flex items-center gap-1 text-muted-foreground">{item.type === "video" ? <PlayCircle className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}{item.type === "video" ? "فيديو" : "مقال"}</span></td>
                      <td className="p-4 text-muted-foreground">{item.category}</td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs font-medium ${accessColors[item.accessLevel]}`}>{accessLabels[item.accessLevel]}</span></td>
                      <td className="p-4"><span className="flex items-center gap-1 text-muted-foreground"><Eye className="h-3.5 w-3.5" /> {item.viewsCount}</span></td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs font-medium ${item.isPublished ? "text-green-400 bg-green-400/10" : "text-muted-foreground bg-secondary/50"}`}>{item.isPublished ? "منشور" : "مسودة"}</span></td>
                      <td className="p-4"><div className="flex items-center gap-2">
                        <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-secondary/50 text-primary transition-colors"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTraining;
