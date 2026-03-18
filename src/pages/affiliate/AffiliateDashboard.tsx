import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import StatCard from "@/components/shared/StatCard";
import { DollarSign, ShoppingCart, Target, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PlanBadge from "@/components/shared/PlanBadge";
import { PLANS } from "@/types/auth";
import { TrendingUp } from "lucide-react";

const AffiliateDashboard = () => {
  const { user } = useAuth();
  const plan = user?.plan ? PLANS[user.plan] : PLANS.standard;

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="الأرباح" value={0} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" tooltip="إجمالي العمولات المؤكدة" />
          <StatCard title="الطلبات" value={0} icon={<ShoppingCart className="h-6 w-6" />} tooltip="عدد الطلبات هذا الشهر" />
          <StatCard title="معدل التحويل" value={0} icon={<Target className="h-6 w-6" />} suffix="%" tooltip="نسبة النقرات التي تحولت لطلبات" />
          <StatCard title="الإحالات" value={0} icon={<Users className="h-6 w-6" />} tooltip="عدد المسجلين عبر رابط الإحالة" />
        </div>

        {/* Empty State */}
        <div className="glass-card p-8 text-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">لا توجد بيانات بعد</p>
          <p className="text-sm text-muted-foreground/70">ابدأ بالترويج للمنتجات لتظهر إحصائياتك هنا</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold mb-1">خطتك الحالية: {plan.label}</h2>
              <p className="text-sm text-muted-foreground">العمولة: {plan.commission}% • {plan.price} DH</p>
            </div>
            {user?.plan !== "vip" && (
              <a
                href={`https://api.whatsapp.com/send?phone=212778133038&text=${encodeURIComponent(`أريد ترقية خطتي`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" /> ترقية الخطة
              </a>
            )}
          </div>
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateDashboard;
