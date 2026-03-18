import AdminLayout from "@/components/layouts/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminProduct {
  id: string;
  name: string;
  merchantName: string;
  costPrice: number;
  sellingPrice: number | null;
  commission: number | null;
  stock: number;
  approvalStatus: string;
  visibility: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "pending">("all");
  const { user } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*, profiles!products_merchant_id_fkey(name)");
    if (data) {
      setProducts(data.map((p: any) => ({
        id: p.id,
        name: p.name,
        merchantName: p.profiles?.name || "غير معروف",
        costPrice: p.cost_price,
        sellingPrice: p.selling_price,
        commission: p.commission,
        stock: p.stock,
        approvalStatus: p.approval_status,
        visibility: p.visibility,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const updateApproval = async (id: string, status: string) => {
    await supabase.from("products").update({ approval_status: status as any }).eq("id", id);
    await supabase.from("approvals").insert({
      target_type: "product", target_id: id, admin_id: user?.id, action: status,
    });
    fetchProducts();
  };

  const displayed = tab === "pending" ? products.filter(p => p.approvalStatus === "pending") : products;
  const pendingCount = products.filter(p => p.approvalStatus === "pending").length;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <div className="flex gap-2">
            <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-lg text-sm transition-all ${tab === "all" ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground"}`}>
              الكل ({products.length})
            </button>
            <button onClick={() => setTab("pending")} className={`px-4 py-2 rounded-lg text-sm transition-all ${tab === "pending" ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground"}`}>
              قيد الموافقة ({pendingCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-right p-4 font-medium text-muted-foreground">المنتج</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">صاحب المنتج</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">التكلفة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">سعر البيع</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">العمولة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">المخزون</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map(p => (
                    <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4 text-muted-foreground">{p.merchantName}</td>
                      <td className="p-4 text-muted-foreground">{p.costPrice} DH</td>
                      <td className="p-4 text-muted-foreground">{p.sellingPrice ? `${p.sellingPrice} DH` : "—"}</td>
                      <td className="p-4">{p.commission ? <span className="gold-badge">{p.commission} DH</span> : "—"}</td>
                      <td className="p-4 text-muted-foreground">{p.stock}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          p.approvalStatus === "approved" ? "text-green-400 bg-green-400/10"
                          : p.approvalStatus === "rejected" ? "text-destructive bg-destructive/10"
                          : "text-accent bg-accent/10"
                        }`}>
                          {p.approvalStatus === "approved" ? "مقبول" : p.approvalStatus === "rejected" ? "مرفوض" : "قيد الموافقة"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {p.approvalStatus !== "approved" && (
                            <button onClick={() => updateApproval(p.id, "approved")}
                              className="p-2 rounded-lg hover:bg-green-400/10 text-muted-foreground hover:text-green-400 transition-colors">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {p.approvalStatus !== "rejected" && (
                            <button onClick={() => updateApproval(p.id, "rejected")}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
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
    </AdminLayout>
  );
};

export default AdminProducts;
