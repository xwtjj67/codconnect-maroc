import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import StatCard from "@/components/shared/StatCard";
import ReferralSlider from "@/components/shared/ReferralSlider";
import { DollarSign, ShoppingCart, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PlanBadge from "@/components/shared/PlanBadge";
import { PLANS } from "@/types/auth";
import { useEffect, useState } from "react";
import api from "@/services/api";

const AffiliateDashboard = () => {
  const { user } = useAuth();
  const plan = user?.plan ? PLANS[user.plan] : PLANS.standard;
  const [stats, setStats] = useState({ earnings: 0, orders: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getMyOrders().then(({ orders }) => {
      const confirmed = orders.filter((o: any) => ["confirmed", "delivered"].includes(o.status));
      const pendingCount = orders.filter((o: any) => o.status === "pending").length;
      const earnings = confirmed.reduce((s: number, o: any) => s + Number(o.commission_amount), 0);
      setStats({ earnings, orders: orders.length, pending: pendingCount });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  return (
    <AffiliateLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">لوحة تحكم المسوق</h1>
            <p className="text-sm text-muted-foreground mt-1">مرحبا بك، {user?.name}</p>
          </div>
          {user?.plan && <PlanBadge plan={user.plan} />}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="الأرباح المؤكدة" value={stats.earnings} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" tooltip="إجمالي العمولات المؤكدة" />
          <StatCard title="إجمالي الطلبات" value={stats.orders} icon={<ShoppingCart className="h-6 w-6" />} tooltip="عدد الطلبات الإجمالي" />
          <StatCard title="قيد الانتظار" value={stats.pending} icon={<Target className="h-6 w-6" />} tooltip="طلبات لم يتم تأكيدها بعد" />
        </div>

        {/* Referral Gamification Slider */}
        <ReferralSlider />

        {stats.orders === 0 && !loading && (
          <div className="glass-card p-8 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">لا توجد بيانات بعد</p>
            <p className="text-sm text-muted-foreground/70">ابدأ بالترويج للمنتجات لتظهر إحصائياتك هنا</p>
          </div>
        )}

        <div className="glass-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold mb-1">خطتك الحالية: {plan.label}</h2>
              <p className="text-sm text-muted-foreground">العمولة: {plan.commission}% • {plan.price} DH/شهر</p>
            </div>
            {user?.plan !== "vip" && (
              <button
                onClick={() => window.open(`https://wa.me/212778133038?text=${encodeURIComponent("أريد ترقية خطتي")}`, "_blank")}
                className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" /> ترقية الخطة
              </button>
            )}
          </div>
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateDashboard;
