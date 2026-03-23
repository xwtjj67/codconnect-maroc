import MerchantLayout from "@/components/layouts/MerchantLayout";
import { useState, useEffect } from "react";
import { Plus, Lock, Package, Loader2, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SELLER_PLANS } from "@/types/auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import MultiImageUpload from "@/components/shared/MultiImageUpload";

const approvalLabels: Record<string, string> = { pending: "قيد الموافقة", approved: "مقبول", rejected: "مرفوض" };
const approvalColors: Record<string, string> = { pending: "text-accent bg-accent/10", approved: "text-green-400 bg-green-400/10", rejected: "text-destructive bg-destructive/10" };

interface ProductRow { id: string; name: string; costPrice: number; sellingPrice: number | null; stock: number; approvalStatus: string; image: string | null; }

const MerchantProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const plan = user?.sellerPlan ? SELLER_PLANS[user.sellerPlan] : SELLER_PLANS.basic;
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", costPrice: "", stock: "", description: "", category: "" });
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const canAdd = products.length < plan.maxProducts;

  const mapProducts = (data: any[]) => data.map(p => ({ id: p.id, name: p.name, costPrice: Number(p.cost_price), sellingPrice: p.selling_price ? Number(p.selling_price) : null, stock: p.stock, approvalStatus: p.approval_status, image: p.image }));

  useEffect(() => {
    if (!user) return;
    api.getMyProducts().then(({ products: data }) => { setProducts(mapProducts(data)); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  const clearForm = () => { setForm({ name: "", costPrice: "", stock: "", description: "", category: "" }); images.forEach(img => URL.revokeObjectURL(img.preview)); setImages([]); setVideoFile(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim() || !form.costPrice || images.length === 0) { if (images.length === 0) toast({ title: "خطأ", description: "يرجى إضافة صورة واحدة على الأقل", variant: "destructive" }); return; }
    setSubmitting(true);

    const imageUrls: string[] = [];
    for (const img of images) { const url = await api.uploadFile(img.file, "images"); if (url) imageUrls.push(url); }
    if (imageUrls.length === 0) { toast({ title: "خطأ", description: "فشل رفع الصور", variant: "destructive" }); setSubmitting(false); return; }

    let videoUrl: string | null = null;
    if (videoFile) { videoUrl = await api.uploadFile(videoFile, "videos"); }

    try {
      await api.createProduct({ name: form.name.trim(), cost_price: Number(form.costPrice), stock: Number(form.stock) || 0, description: form.description.trim() || null, category: form.category.trim() || null, image: imageUrls[0], images: imageUrls, video_url: videoUrl, thumbnail: imageUrls[0] });
      toast({ title: "تم بنجاح", description: "تم إضافة المنتج وهو قيد الموافقة" });
      clearForm(); setShowForm(false);
      const { products: data } = await api.getMyProducts();
      setProducts(mapProducts(data));
    } catch (err: any) { toast({ title: "خطأ", description: err.message, variant: "destructive" }); }
    setSubmitting(false);
  };

  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div><h1 className="text-2xl font-bold">منتجاتي</h1><p className="text-sm text-muted-foreground">{products.length} / {plan.maxProducts} منتجات</p></div>
          <Tooltip><TooltipTrigger asChild><button disabled={!canAdd} onClick={() => canAdd && setShowForm(!showForm)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity ${canAdd ? "gradient-teal text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>{canAdd ? <Plus className="h-4 w-4" /> : <Lock className="h-4 w-4" />}إضافة منتج</button></TooltipTrigger>{!canAdd && <TooltipContent><p>وصلت للحد الأقصى. قم بترقية باقتك</p></TooltipContent>}</Tooltip>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">إضافة منتج جديد</h2>
            <MultiImageUpload images={images} onChange={setImages} maxImages={10} disabled={submitting} />
            <div className="space-y-1"><label className="text-sm font-medium">فيديو المنتج (اختياري)</label><div className="flex items-center gap-3"><button type="button" onClick={() => document.getElementById("video-input")?.click()} disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50"><Video className="h-4 w-4" />{videoFile ? videoFile.name : "اختر فيديو"}</button>{videoFile && <button type="button" onClick={() => setVideoFile(null)} className="text-xs text-destructive hover:underline">حذف</button>}</div><input id="video-input" type="file" accept="video/*" className="hidden" disabled={submitting} onChange={e => { if (e.target.files?.[0]) setVideoFile(e.target.files[0]); e.target.value = ""; }} /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm font-medium">اسم المنتج *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">سعر التكلفة (DH) *</label><input type="number" value={form.costPrice} onChange={e => setForm(f => ({ ...f, costPrice: e.target.value }))} required min="0" className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" dir="ltr" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">المخزون</label><input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} min="0" className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" dir="ltr" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">الفئة</label><input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">الوصف</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" /></div>
            <div className="flex gap-3"><button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-lg gradient-teal text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50">{submitting && <Loader2 className="h-4 w-4 animate-spin" />}إضافة المنتج</button><button type="button" onClick={() => { setShowForm(false); clearForm(); }} className="px-6 py-2.5 rounded-lg bg-secondary/50 text-muted-foreground text-sm hover:bg-secondary transition-colors">إلغاء</button></div>
          </form>
        )}

        {loading ? <div className="glass-card p-12 text-center"><div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div> : products.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3"><div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto"><Package className="h-8 w-8 text-muted-foreground" /></div><p className="text-lg font-medium text-muted-foreground">لا توجد منتجات بعد</p></div>
        ) : (
          <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50"><th className="text-right p-4 font-medium text-muted-foreground">الصورة</th><th className="text-right p-4 font-medium text-muted-foreground">المنتج</th><th className="text-right p-4 font-medium text-muted-foreground">التكلفة</th><th className="text-right p-4 font-medium text-muted-foreground">سعر البيع</th><th className="text-right p-4 font-medium text-muted-foreground">المخزون</th><th className="text-right p-4 font-medium text-muted-foreground">الحالة</th></tr></thead>
            <tbody>{products.map(p => (<tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors"><td className="p-4">{p.image ? <img src={p.image} alt={p.name} loading="lazy" className="h-10 w-10 rounded-lg object-cover" /> : <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center"><Package className="h-4 w-4 text-muted-foreground" /></div>}</td><td className="p-4 font-medium">{p.name}</td><td className="p-4 text-muted-foreground">{p.costPrice} DH</td><td className="p-4 text-muted-foreground">{p.sellingPrice ? `${p.sellingPrice} DH` : "يحدد لاحقاً"}</td><td className="p-4 text-muted-foreground">{p.stock}</td><td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${approvalColors[p.approvalStatus]}`}>{approvalLabels[p.approvalStatus]}</span></td></tr>))}</tbody></table></div></div>
        )}
      </div>
    </MerchantLayout>
  );
};

export default MerchantProducts;
