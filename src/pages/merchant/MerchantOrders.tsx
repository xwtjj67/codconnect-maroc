import MerchantLayout from "@/components/layouts/MerchantLayout";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const statusLabels: Record<string, string> = { pending: "قيد الانتظار", confirmed: "مؤكد", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي" };
const statusColors: Record<string, string> = { pending: "text-accent bg-accent/10", confirmed: "text-primary bg-primary/10", shipped: "text-blue-400 bg-blue-400/10", delivered: "text-green-400 bg-green-400/10", cancelled: "text-destructive bg-destructive/10" };

const MerchantOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getMerchantOrders().then(({ orders: data }) => {
      setOrders(data.map((o: any) => ({ id: o.id, productName: o.product_name || "—", clientName: o.client_name, city: o.city, sellingPrice: Number(o.selling_price), status: o.status, createdAt: new Date(o.created_at).toLocaleDateString("ar-MA") })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">الطلبات</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-foreground">{orders.length}</p><p className="text-xs text-muted-foreground">إجمالي</p></div>
          <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-primary">{orders.filter(o => o.status === "confirmed").length}</p><p className="text-xs text-muted-foreground">مؤكد</p></div>
          <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-green-400">{orders.filter(o => o.status === "delivered").length}</p><p className="text-xs text-muted-foreground">تم التوصيل</p></div>
          <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-accent">{orders.filter(o => o.status === "pending").length}</p><p className="text-xs text-muted-foreground">قيد الانتظار</p></div>
        </div>
        {loading ? <div className="glass-card p-12 text-center"><div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div> : orders.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3"><div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto"><ShoppingCart className="h-8 w-8 text-muted-foreground" /></div><p className="text-lg font-medium text-muted-foreground">لا توجد طلبات بعد</p></div>
        ) : (
          <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50"><th className="text-right p-4 font-medium text-muted-foreground">المنتج</th><th className="text-right p-4 font-medium text-muted-foreground">العميل</th><th className="text-right p-4 font-medium text-muted-foreground">المدينة</th><th className="text-right p-4 font-medium text-muted-foreground">السعر</th><th className="text-right p-4 font-medium text-muted-foreground">الحالة</th><th className="text-right p-4 font-medium text-muted-foreground">التاريخ</th></tr></thead>
            <tbody>{orders.map((o: any) => (<tr key={o.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors"><td className="p-4 font-medium">{o.productName}</td><td className="p-4 text-muted-foreground">{o.clientName}</td><td className="p-4 text-muted-foreground">{o.city}</td><td className="p-4 font-bold">{o.sellingPrice} DH</td><td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[o.status]}`}>{statusLabels[o.status]}</span></td><td className="p-4 text-muted-foreground text-xs">{o.createdAt}</td></tr>))}</tbody></table></div></div>
        )}
      </div>
    </MerchantLayout>
  );
};

export default MerchantOrders;
