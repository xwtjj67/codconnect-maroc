import MerchantLayout from "@/components/layouts/MerchantLayout";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار", confirmed: "مؤكد", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي",
};
const statusColors: Record<string, string> = {
  pending: "text-accent bg-accent/10", confirmed: "text-primary bg-primary/10", shipped: "text-blue-400 bg-blue-400/10", delivered: "text-green-400 bg-green-400/10", cancelled: "text-destructive bg-destructive/10",
};

interface OrderRow {
  id: string;
  productName: string;
  clientName: string;
  city: string;
  sellingPrice: number;
  status: string;
  createdAt: string;
}

const MerchantOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase.from("orders").select("*").eq("merchant_id", user.id).order("created_at", { ascending: false });
      if (!data) { setLoading(false); return; }

      const productIds = [...new Set(data.map(o => o.product_id))];
      const { data: products } = await supabase.from("products").select("id, name").in("id", productIds.length ? productIds : ["00000000-0000-0000-0000-000000000000"]);
      const productMap = Object.fromEntries((products || []).map(p => [p.id, p.name]));

      setOrders(data.map(o => ({
        id: o.id,
        productName: productMap[o.product_id] || "—",
        clientName: o.client_name,
        city: o.city,
        sellingPrice: Number(o.selling_price),
        status: o.status,
        createdAt: new Date(o.created_at).toLocaleDateString("ar-MA"),
      })));
      setLoading(false);
    };
    fetch();
  }, [user]);

  const totalOrders = orders.length;
  const confirmedCount = orders.filter(o => o.status === "confirmed").length;
  const deliveredCount = orders.filter(o => o.status === "delivered").length;
  const pendingCount = orders.filter(o => o.status === "pending").length;

  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">الطلبات</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
            <p className="text-xs text-muted-foreground">إجمالي</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{confirmedCount}</p>
            <p className="text-xs text-muted-foreground">مؤكد</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{deliveredCount}</p>
            <p className="text-xs text-muted-foreground">تم التوصيل</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">قيد الانتظار</p>
          </div>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">لا توجد طلبات بعد</p>
            <p className="text-sm text-muted-foreground/70">ستظهر الطلبات هنا عند بدء البيع</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-right p-4 font-medium text-muted-foreground">المنتج</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">العميل</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">المدينة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">السعر</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="p-4 font-medium">{o.productName}</td>
                      <td className="p-4 text-muted-foreground">{o.clientName}</td>
                      <td className="p-4 text-muted-foreground">{o.city}</td>
                      <td className="p-4 font-bold">{o.sellingPrice} DH</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[o.status]}`}>
                          {statusLabels[o.status]}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{o.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
};

export default MerchantOrders;
