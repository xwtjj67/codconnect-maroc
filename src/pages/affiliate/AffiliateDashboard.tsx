import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import StatCard from "@/components/shared/StatCard";
import { DollarSign, ShoppingCart, TrendingUp, Users, Target, Wallet } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import PlanBadge from "@/components/shared/PlanBadge";
import { PLANS } from "@/types/auth";

const earningsChart = [
  { day: "السبت", earnings: 40 },
  { day: "الأحد", earnings: 65 },
  { day: "الإثنين", earnings: 30 },
  { day: "الثلاثاء", earnings: 85 },
  { day: "الأربعاء", earnings: 50 },
  { day: "الخميس", earnings: 95 },
  { day: "الجمعة", earnings: 70 },
];

const recentActivity = [
  { text: "طلب جديد - سماعات بلوتوث", time: "منذ 5 دقائق", type: "order" },
  { text: "عمولة مؤكدة: 40 DH", time: "منذ ساعة", type: "commission" },
  { text: "تسجيل جديد عبر رابط الإحالة", time: "منذ 3 ساعات", type: "referral" },
  { text: "طلب تم توصيله - كريم العناية", time: "أمس", type: "delivered" },
];

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
          <StatCard title="الأرباح" value={170} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" tooltip="إجمالي العمولات المؤكدة" trend={15} />
          <StatCard title="الطلبات" value={5} icon={<ShoppingCart className="h-6 w-6" />} tooltip="عدد الطلبات هذا الشهر" trend={12} />
          <StatCard title="معدل التحويل" value={12.5} icon={<Target className="h-6 w-6" />} suffix="%" tooltip="نسبة النقرات التي تحولت لطلبات" trend={3.2} />
          <StatCard title="الإحالات" value={25} icon={<Users className="h-6 w-6" />} tooltip="عدد المسجلين عبر رابط الإحالة" trend={8} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="font-semibold">أرباحك هذا الأسبوع (DH)</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsChart}>
                  <defs>
                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(42 78% 55%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(42 78% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="day" stroke="hsl(210 15% 55%)" fontSize={11} />
                  <YAxis stroke="hsl(210 15% 55%)" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(210 45% 13%)", border: "1px solid hsl(174 50% 30%)", borderRadius: "8px", color: "hsl(210 20% 95%)" }} />
                  <Area type="monotone" dataKey="earnings" stroke="hsl(42 78% 55%)" fill="url(#earnGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">آخر النشاطات</h2>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0">
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                    a.type === "commission" ? "bg-accent" : a.type === "order" ? "bg-primary" : a.type === "referral" ? "bg-blue-400" : "bg-green-400"
                  }`} />
                  <div>
                    <p className="text-sm">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold mb-1">خطتك الحالية: {plan.label}</h2>
              <p className="text-sm text-muted-foreground">العمولة: {plan.commission}% • {plan.price} DH</p>
            </div>
            {user?.plan !== "vip" && (
              <button className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
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
