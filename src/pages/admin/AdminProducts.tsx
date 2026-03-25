import AdminLayout from "@/components/layouts/AdminLayout";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { CheckCircle, XCircle, Package, Edit, Users, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AdminProduct {
  id: string; name: string; merchantName: string; merchantId: string;
  costPrice: number; sellingPrice: number | null; commission: number | null;
  stock: number; approvalStatus: string; visibility: string; image: string | null;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "pending">("all");
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [editSellingPrice, setEditSellingPrice] = useState("");
  const [editCommission, setEditCommission] = useState("");
  const [editVisibility, setEditVisibility] = useState("standard");
  const [saving, setSaving] = useState(false);

  // Merchant limits
  const [showMerchantLimits, setShowMerchantLimits] = useState(false);
  const [merchantLimits, setMerchantLimits] = useState<Record<string, number>>({});
  const [limitInputs, setLimitInputs] = useState<Record<string, string>>({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { products: data } = await api.getAllProducts();
      setProducts(data.map((p: any) => ({
        id: p.id, name: p.name, merchantName: p.merchant_name || "غير معروف",
        merchantId: p.merchant_id,
        costPrice: Number(p.cost_price), sellingPrice: p.selling_price ? Number(p.selling_price) : null,
        commission: p.commission ? Number(p.commission) : null,
        stock: p.stock, approvalStatus: p.approval_status, visibility: p.visibility,
        image: p.image || p.thumbnail || (Array.isArray(p.images) && p.images[0]) || null,
      })));
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openEditDialog = (p: AdminProduct) => {
    setEditProduct(p);
    setEditSellingPrice(p.sellingPrice?.toString() || "");
    setEditCommission(p.commission?.toString() || "");
    setEditVisibility(p.visibility);
  };

  const handleApproveWithPricing = async () => {
    if (!editProduct) return;
    const sp = parseFloat(editSellingPrice);
    const comm = parseFloat(editCommission);
    if (isNaN(sp) || sp <= 0) { toast.error("أدخل سعر بيع صحيح"); return; }
    if (isNaN(comm) || comm < 0) { toast.error("أدخل عمولة صحيحة"); return; }
    setSaving(true);
    try {
      await api.approveProduct(editProduct.id, {
        selling_price: sp, commission: comm, visibility: editVisibility, approval_status: "approved",
      });
      toast.success("تمت الموافقة وتحديث الأسعار بنجاح");
      setEditProduct(null);
      fetchProducts();
    } catch { toast.error("حدث خطأ"); }
    setSaving(false);
  };

  const handleSavePricing = async () => {
    if (!editProduct) return;
    const sp = parseFloat(editSellingPrice);
    const comm = parseFloat(editCommission);
    if (isNaN(sp) || sp <= 0) { toast.error("أدخل سعر بيع صحيح"); return; }
    if (isNaN(comm) || comm < 0) { toast.error("أدخل عمولة صحيحة"); return; }
    setSaving(true);
    try {
      await api.updateProduct(editProduct.id, {
        selling_price: sp, commission: comm, visibility: editVisibility,
      });
      toast.success("تم تحديث الأسعار بنجاح");
      setEditProduct(null);
      fetchProducts();
    } catch { toast.error("حدث خطأ"); }
    setSaving(false);
  };

  const handleReject = async (id: string) => {
    try {
      await api.rejectProduct(id);
      toast.success("تم رفض المنتج");
      fetchProducts();
    } catch { }
  };

  // Get unique merchants
  const merchants = [...new Map(products.map(p => [p.merchantId, { id: p.merchantId, name: p.merchantName }])).values()];
  const getMerchantProductCounts = (mid: string) => {
    const merchantProducts = products.filter(p => p.merchantId === mid);
    return { total: merchantProducts.length, approved: merchantProducts.filter(p => p.approvalStatus === "approved").length };
  };

  const displayed = tab === "pending" ? products.filter(p => p.approvalStatus === "pending") : products;
  const pendingCount = products.filter(p => p.approvalStatus === "pending").length;
  const profit = editProduct ? (parseFloat(editSellingPrice) || 0) - editProduct.costPrice - (parseFloat(editCommission) || 0) : 0;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <div className="flex gap-2">
            <button onClick={() => setShowMerchantLimits(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors">
              <Settings className="h-4 w-4" />حدود الموردين
            </button>
            <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-lg text-sm transition-all ${tab === "all" ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground"}`}>الكل ({products.length})</button>
            <button onClick={() => setTab("pending")} className={`px-4 py-2 rounded-lg text-sm transition-all ${tab === "pending" ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground"}`}>قيد الموافقة ({pendingCount})</button>
          </div>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center"><div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : displayed.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto"><Package className="h-8 w-8 text-muted-foreground" /></div>
            <p className="text-lg font-medium text-muted-foreground">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-right p-4 font-medium text-muted-foreground">الصورة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">المنتج</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">المورد</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">التكلفة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">سعر البيع</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">العمولة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map(p => (
                    <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="p-4">
                        {p.image ? <img src={p.image} alt={p.name} loading="lazy" className="h-10 w-10 rounded-lg object-cover" /> : <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center"><Package className="h-4 w-4 text-muted-foreground" /></div>}
                      </td>
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4 text-muted-foreground">{p.merchantName}</td>
                      <td className="p-4 text-muted-foreground">{p.costPrice} DH</td>
                      <td className="p-4 text-muted-foreground">{p.sellingPrice ? `${p.sellingPrice} DH` : "—"}</td>
                      <td className="p-4">{p.commission ? <span className="gold-badge">{p.commission} DH</span> : "—"}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.approvalStatus === "approved" ? "text-green-400 bg-green-400/10" : p.approvalStatus === "rejected" ? "text-destructive bg-destructive/10" : "text-accent bg-accent/10"}`}>
                          {p.approvalStatus === "approved" ? "مقبول" : p.approvalStatus === "rejected" ? "مرفوض" : "قيد الموافقة"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEditDialog(p)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Edit className="h-4 w-4" /></button>
                          {p.approvalStatus !== "rejected" && <button onClick={() => handleReject(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><XCircle className="h-4 w-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader><DialogTitle>تحديد سعر البيع والعمولة</DialogTitle></DialogHeader>
          {editProduct && (
            <div className="space-y-4 mt-2">
              <div className="p-3 rounded-lg bg-secondary/50 space-y-1">
                <p className="font-bold">{editProduct.name}</p>
                <p className="text-sm text-muted-foreground">المورد: {editProduct.merchantName}</p>
                <p className="text-sm text-muted-foreground">سعر التكلفة: <span className="font-bold text-foreground">{editProduct.costPrice} DH</span></p>
              </div>
              <div className="space-y-2"><Label>سعر البيع (DH)</Label><Input type="number" min={0} value={editSellingPrice} onChange={e => setEditSellingPrice(e.target.value)} dir="ltr" /></div>
              <div className="space-y-2"><Label>عمولة المسوق (DH)</Label><Input type="number" min={0} value={editCommission} onChange={e => setEditCommission(e.target.value)} dir="ltr" /></div>
              <div className="space-y-2">
                <Label>مستوى الرؤية</Label>
                <Select value={editVisibility} onValueChange={setEditVisibility}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={`p-3 rounded-lg text-sm text-center font-bold ${profit > 0 ? "bg-green-400/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>ربح المنصة: {profit.toFixed(2)} DH</div>
              <div className="flex gap-2">
                {editProduct.approvalStatus !== "approved" && <Button onClick={handleApproveWithPricing} disabled={saving} className="flex-1 gap-2"><CheckCircle className="h-4 w-4" />{saving ? "جاري الحفظ..." : "موافقة وحفظ"}</Button>}
                <Button onClick={handleSavePricing} disabled={saving} variant={editProduct.approvalStatus !== "approved" ? "outline" : "default"} className="flex-1">{saving ? "جاري الحفظ..." : "حفظ الأسعار فقط"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Merchant Limits Dialog */}
      <Dialog open={showMerchantLimits} onOpenChange={setShowMerchantLimits}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5" />حدود المنتجات للموردين</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2 max-h-[60vh] overflow-y-auto">
            {merchants.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">لا يوجد موردين</p>
            ) : (
              merchants.map(m => {
                const counts = getMerchantProductCounts(m.id);
                return (
                  <div key={m.id} className="p-3 rounded-lg bg-secondary/50 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{counts.approved} مقبول من {counts.total}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">الحد:</Label>
                      <Input
                        type="number" min={0} className="w-20 h-8 text-xs" dir="ltr"
                        value={limitInputs[m.id] ?? merchantLimits[m.id] ?? "3"}
                        onChange={e => setLimitInputs(prev => ({ ...prev, [m.id]: e.target.value }))}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
