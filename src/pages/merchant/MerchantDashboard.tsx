import MerchantLayout from "@/components/layouts/MerchantLayout";
import StatCard from "@/components/shared/StatCard";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import PlanBadge from "@/components/shared/PlanBadge";
import { PLANS } from "@/types/auth";

const recentOrders = [
  { id: "1", product: "سماعات بلوتوث", affiliate: "محمد ب.", status: "confirmed", price: 199 },
  { id: "2", product: "كريم العناية", affiliate: "سارة ل.", status: "pending", price: 149 },
  { id: "3", product: "حزام رياضي", affiliate: "يوسف ع.", status: "delivered", price: 249 },
];

const revenueChart = [
  { day: "السبت", revenue: 320 },
  { day: "الأحد", revenue: 480 },
  { day: "الإثنين", revenue: 280 },
  { day: "الثلاثاء", revenue: 590 },
  { day: "الأربعاء", revenue: 420 },
  { day: "الخميس", revenue: 710 },
  { day: "الجمعة", revenue: 540 },
];

const statusLabels: Record<string, string> = { pending: "قيد الانتظار", confirmed: "مؤكد", delivered: "تم التوصيل" };
const statusColors: Record<string, string> = { pending: "text-accent bg-accent/10", confirmed: "text-primary bg-primary/10", delivered: "text-green-400 bg-green-400/10" };

const MerchantDashboard = () => {
  const { user } = useAuth();
  const plan = user?.plan ? PLANS[user.plan] : PLANS.standard;

  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">لوحة تحكم التاجر</h1>
            <p className="text-sm text-muted-foreground mt-1">مرحبا بك، {user?.name}</p>
          </div>
          {user?.plan && <PlanBadge plan={user.plan} />}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="الإيرادات" value={1096} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" tooltip="إجمالي الإيرادات من الطلبات المؤكدة" trend={18.5} />
          <StatCard title="الطلبات" value={7} icon={<ShoppingCart className="h-6 w-6" />} tooltip="إجمالي الطلبات هذا الشهر" trend={12} />
          <StatCard title="المنتجات" value={6} icon={<Package className="h-6 w-6" />} tooltip={`الحد الأقصى: ${plan.maxProducts === -1 ? "غير محدود" : plan.maxProducts}`} />
          <StatCard title="المسوقين النشطين" value={12} icon={<Users className="h-6 w-6" />} tooltip="عدد المسوقين الذين باعوا منتجاتك" trend={8} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">الإيرادات هذا الأسبوع</h2>
              <span className="text-xs text-primary flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +18.5%</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(174 72% 46%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(174 72% 46%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="day" stroke="hsl(210 15% 55%)" fontSize={11} />
                  <YAxis stroke="hsl(210 15% 55%)" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(210 45% 13%)", border: "1px solid hsl(174 50% 30%)", borderRadius: "8px", color: "hsl(210 20% 95%)" }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(174 72% 46%)" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">آخر الطلبات</h2>
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{o.product}</p>
                    <p className="text-xs text-muted-foreground">{o.affiliate}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">{o.price} DH</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[o.status]}`}>
                      {statusLabels[o.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Info */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold mb-1">خطتك الحالية: {plan.label}</h2>
              <p className="text-sm text-muted-foreground">العمولة: {plan.commission}% • المنتجات: {plan.maxProducts === -1 ? "غير محدودة" : plan.maxProducts} • {plan.price} DH</p>
            </div>
            {user?.plan !== "vip" && (
              <button className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> ترقية الخطة
              </button>
            )}
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default MerchantDashboard;
