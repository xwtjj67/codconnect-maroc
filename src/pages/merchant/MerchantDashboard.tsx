import MerchantLayout from "@/components/layouts/MerchantLayout";
import StatCard from "@/components/shared/StatCard";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SELLER_PLANS } from "@/types/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MerchantDashboard = () => {
  const { user } = useAuth();
  const plan = user?.sellerPlan ? SELLER_PLANS[user.sellerPlan] : SELLER_PLANS.basic;
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, monthSales: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [{ data: orders }, { count: productCount }] = await Promise.all([
        supabase.from("orders").select("*").eq("merchant_id", user.id),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("merchant_id", user.id),
      ]);

      const confirmed = (orders || []).filter(o => ["confirmed", "delivered"].includes(o.status));
      const revenue = confirmed.reduce((s, o) => s + Number(o.selling_price) - Number(o.commission_amount), 0);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const monthSales = (orders || []).filter(o => o.created_at >= monthStart).length;

      setStats({ revenue, orders: (orders || []).length, products: productCount || 0, monthSales });
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">لوحة تحكم المورد</h1>
            <p className="text-sm text-muted-foreground mt-1">مرحبا بك، {user?.name}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="الإيرادات" value={stats.revenue} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" tooltip="إجمالي الإيرادات بعد خصم العمولات" />
          <StatCard title="الطلبات" value={stats.orders} icon={<ShoppingCart className="h-6 w-6" />} tooltip="إجمالي الطلبات" />
          <StatCard title="المنتجات" value={stats.products} icon={<Package className="h-6 w-6" />} tooltip={`الحد الأقصى: ${plan.maxProducts}`} />
          <StatCard title="المبيعات هذا الشهر" value={stats.monthSales} icon={<TrendingUp className="h-6 w-6" />} tooltip="عدد المبيعات هذا الشهر" />
        </div>

        {stats.orders === 0 && !loading && (
          <div className="glass-card p-8 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">لا توجد بيانات بعد</p>
            <p className="text-sm text-muted-foreground/70">أضف منتجاتك وسيتم عرض الإحصائيات هنا</p>
          </div>
        )}

        <div className="glass-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold mb-1">باقتك الحالية: {plan.label}</h2>
              <p className="text-sm text-muted-foreground">المنتجات: {stats.products} / {plan.maxProducts}</p>
            </div>
            {user?.sellerPlan !== "pro" && (
              <a
                href={`https://api.whatsapp.com/send?phone=212778133038&text=${encodeURIComponent(`أريد ترقية باقتي كصاحب منتجات`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" /> ترقية الباقة
              </a>
            )}
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default MerchantDashboard;
