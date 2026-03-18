import AdminLayout from "@/components/layouts/AdminLayout";
import { useState, useEffect } from "react";
import { Filter, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار", confirmed: "مؤكد", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي",
};
const statusColors: Record<string, string> = {
  pending: "text-accent bg-accent/10", confirmed: "text-primary bg-primary/10", shipped: "text-blue-400 bg-blue-400/10", delivered: "text-green-400 bg-green-400/10", cancelled: "text-destructive bg-destructive/10",
};

interface OrderRow {
  id: string;
  productName: string;
  merchantName: string;
  affiliateName: string;
  clientName: string;
  city: string;
  sellingPrice: number;
  commissionAmount: number;
  status: string;
}

const statusFilters = ["الكل", "pending", "confirmed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("الكل");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data } = await supabase.from("orders").select("*");
      if (!data) { setLoading(false); return; }

      // Fetch related names
      const productIds = [...new Set(data.map(o => o.product_id))];
      const affiliateIds = [...new Set(data.map(o => o.affiliate_id))];
      const merchantIds = [...new Set(data.map(o => o.merchant_id))];

      const [{ data: products }, { data: affiliateProfiles }, { data: merchantProfiles }] = await Promise.all([
        supabase.from("products").select("id, name").in("id", productIds),
        supabase.from("profiles").select("id, name").in("id", affiliateIds),
        supabase.from("profiles").select("id, name").in("id", merchantIds),
      ]);

      const productMap = Object.fromEntries((products || []).map(p => [p.id, p.name]));
      const affMap = Object.fromEntries((affiliateProfiles || []).map(p => [p.id, p.name]));
      const merMap = Object.fromEntries((merchantProfiles || []).map(p => [p.id, p.name]));

      setOrders(data.map(o => ({
        id: o.id,
        productName: productMap[o.product_id] || "—",
        merchantName: merMap[o.merchant_id] || "—",
        affiliateName: affMap[o.affiliate_id] || "—",
        clientName: o.client_name,
        city: o.city,
        sellingPrice: Number(o.selling_price),
        commissionAmount: Number(o.commission_amount),
        status: o.status,
      })));
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus as any }).eq("id", orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filtered = filter === "الكل" ? orders : orders.filter(o => o.status === filter);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">جميع الطلبات</h1>

        <div className="flex items-center gap-2 text-sm flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {statusFilters.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === s ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>
              {s === "الكل" ? "الكل" : statusLabels[s]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">لا توجد طلبات</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-right p-4 font-medium text-muted-foreground">المنتج</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">التاجر</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">المسوق</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">العميل</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">المدينة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">السعر</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">العمولة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => (
                    <tr key={o.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="p-4 font-medium">{o.productName}</td>
                      <td className="p-4 text-muted-foreground">{o.merchantName}</td>
                      <td className="p-4 text-muted-foreground">{o.affiliateName}</td>
                      <td className="p-4 text-muted-foreground">{o.clientName}</td>
                      <td className="p-4 text-muted-foreground">{o.city}</td>
                      <td className="p-4 font-bold">{o.sellingPrice} DH</td>
                      <td className="p-4"><span className="gold-badge">{o.commissionAmount} DH</span></td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[o.status]}`}>
                          {statusLabels[o.status]}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          className="bg-secondary/50 border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        >
                          {Object.entries(statusLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
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

export default AdminOrders;
