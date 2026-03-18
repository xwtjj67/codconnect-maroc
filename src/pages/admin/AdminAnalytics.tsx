import AdminLayout from "@/components/layouts/AdminLayout";
import StatCard from "@/components/shared/StatCard";
import { DollarSign, TrendingUp, ShoppingCart, Users, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminAnalytics = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, commissions: 0, users: 0 });
  const [topProducts, setTopProducts] = useState<{ name: string; orders: number; revenue: number }[]>([]);
  const [topAffiliates, setTopAffiliates] = useState<{ name: string; orders: number; commission: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [{ data: orderData }, { count: userCount }, { data: products }, { data: profiles }] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("products").select("id, name"),
        supabase.from("profiles").select("id, name"),
      ]);

      const orders = orderData || [];
      const confirmedOrders = orders.filter(o => ["confirmed", "delivered"].includes(o.status));
      const revenue = confirmedOrders.reduce((s, o) => s + Number(o.selling_price), 0);
      const commissions = confirmedOrders.reduce((s, o) => s + Number(o.commission_amount), 0);

      setStats({ revenue, orders: orders.length, commissions, users: userCount || 0 });

      // Top products
      const productMap = Object.fromEntries((products || []).map(p => [p.id, p.name]));
      const productStats: Record<string, { orders: number; revenue: number }> = {};
      confirmedOrders.forEach(o => {
        if (!productStats[o.product_id]) productStats[o.product_id] = { orders: 0, revenue: 0 };
        productStats[o.product_id].orders++;
        productStats[o.product_id].revenue += Number(o.selling_price);
      });
      setTopProducts(
        Object.entries(productStats)
          .map(([id, s]) => ({ name: productMap[id] || "—", ...s }))
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 5)
      );

      // Top affiliates
      const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p.name]));
      const affStats: Record<string, { orders: number; commission: number }> = {};
      confirmedOrders.forEach(o => {
        if (!affStats[o.affiliate_id]) affStats[o.affiliate_id] = { orders: 0, commission: 0 };
        affStats[o.affiliate_id].orders++;
        affStats[o.affiliate_id].commission += Number(o.commission_amount);
      });
      setTopAffiliates(
        Object.entries(affStats)
          .map(([id, s]) => ({ name: profileMap[id] || "—", ...s }))
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 5)
      );

      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">تحليلات المنصة</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي الإيرادات" value={stats.revenue} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" />
          <StatCard title="إجمالي الطلبات" value={stats.orders} icon={<ShoppingCart className="h-6 w-6" />} />
          <StatCard title="العمولات المدفوعة" value={stats.commissions} icon={<TrendingUp className="h-6 w-6" />} suffix=" DH" />
          <StatCard title="المستخدمين" value={stats.users} icon={<Users className="h-6 w-6" />} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">أفضل المنتجات</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">لا توجد بيانات بعد</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                    }`}>{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.orders} طلب</p>
                    </div>
                    <span className="text-sm font-bold">{p.revenue.toLocaleString()} DH</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">أفضل المسوقين</h2>
            {topAffiliates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">لا توجد بيانات بعد</p>
            ) : (
              <div className="space-y-3">
                {topAffiliates.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                    }`}>{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.orders} طلب</p>
                    </div>
                    <span className="gold-badge">{a.commission} DH</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
