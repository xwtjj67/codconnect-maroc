import MerchantLayout from "@/components/layouts/MerchantLayout";
import StatCard from "@/components/shared/StatCard";
import { DollarSign, TrendingUp, ShoppingCart, Package } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const MerchantAnalytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getMerchantStats().then(({ stats: s }) => { setStats(s); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  if (loading) return <MerchantLayout><div className="flex items-center justify-center py-20"><div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div></MerchantLayout>;

  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">التحليلات</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي الإيرادات" value={stats.revenue} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" />
          <StatCard title="إجمالي الطلبات" value={stats.orders} icon={<ShoppingCart className="h-6 w-6" />} />
          <StatCard title="المنتجات" value={stats.products} icon={<Package className="h-6 w-6" />} />
          <StatCard title="تم التوصيل" value={stats.delivered} icon={<TrendingUp className="h-6 w-6" />} />
        </div>
        <div className="glass-card p-8 text-center space-y-3"><p className="text-muted-foreground">الرسوم البيانية المتقدمة ستظهر هنا عند توفر بيانات كافية</p></div>
      </div>
    </MerchantLayout>
  );
};

export default MerchantAnalytics;
