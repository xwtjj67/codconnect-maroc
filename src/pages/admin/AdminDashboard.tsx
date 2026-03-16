import AdminLayout from "@/components/layouts/AdminLayout";
import StatCard from "@/components/shared/StatCard";
import { Users, ShoppingCart, Package, DollarSign, TrendingUp, UserCheck, Store, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const revenueChart = [
  { month: "يناير", revenue: 4200, commissions: 720 },
  { month: "فبراير", revenue: 5800, commissions: 990 },
  { month: "مارس", revenue: 7200, commissions: 1230 },
  { month: "أبريل", revenue: 8400, commissions: 1440 },
  { month: "ماي", revenue: 12800, commissions: 2190 },
  { month: "يونيو", revenue: 14000, commissions: 2390 },
];

const userGrowth = [
  { month: "يناير", affiliates: 15, merchants: 3 },
  { month: "فبراير", affiliates: 28, merchants: 5 },
  { month: "مارس", affiliates: 45, merchants: 8 },
  { month: "أبريل", affiliates: 62, merchants: 12 },
  { month: "ماي", affiliates: 89, merchants: 18 },
  { month: "يونيو", affiliates: 120, merchants: 25 },
];

const planDistribution = [
  { name: "Standard", value: 85 },
  { name: "Premium", value: 38 },
  { name: "VIP", value: 22 },
];

const COLORS = ["hsl(210 30% 50%)", "hsl(174 72% 46%)", "hsl(42 78% 55%)"];

const recentUsers = [
  { name: "أحمد ب.", role: "affiliate", plan: "standard", date: "منذ 2 ساعة" },
  { name: "متجر النور", role: "merchant", plan: "premium", date: "منذ 5 ساعات" },
  { name: "سارة م.", role: "affiliate", plan: "vip", date: "أمس" },
];

const chartStyle = { backgroundColor: "hsl(210 45% 13%)", border: "1px solid hsl(174 50% 30%)", borderRadius: "8px", color: "hsl(210 20% 95%)" };

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">لوحة تحكم الإدارة</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي المستخدمين" value={145} icon={<Users className="h-6 w-6" />} trend={18.5} tooltip="جميع المسوقين والتجار" />
          <StatCard title="إجمالي الإيرادات" value={52400} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" trend={22} tooltip="إيرادات المنصة الكاملة" />
          <StatCard title="إجمالي الطلبات" value={340} icon={<ShoppingCart className="h-6 w-6" />} trend={15} tooltip="جميع الطلبات في المنصة" />
          <StatCard title="المنتجات النشطة" value={48} icon={<Package className="h-6 w-6" />} trend={8} tooltip="المنتجات المتاحة حاليا" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="المسوقين" value={120} icon={<UserCheck className="h-6 w-6" />} trend={12} />
          <StatCard title="التجار" value={25} icon={<Store className="h-6 w-6" />} trend={8} />
          <StatCard title="العمولات المدفوعة" value={8960} icon={<Activity className="h-6 w-6" />} suffix=" DH" trend={18} />
          <StatCard title="نمو شهري" value={18.5} icon={<TrendingUp className="h-6 w-6" />} suffix="%" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">الإيرادات والعمولات الشهرية</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="month" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(210 15% 55%)" fontSize={12} />
                  <Tooltip contentStyle={chartStyle} />
                  <Bar dataKey="revenue" fill="hsl(174 72% 46%)" radius={[4, 4, 0, 0]} name="الإيرادات" />
                  <Bar dataKey="commissions" fill="hsl(42 78% 55%)" radius={[4, 4, 0, 0]} name="العمولات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">نمو المستخدمين</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth}>
                  <defs>
                    <linearGradient id="affGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(174 72% 46%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(174 72% 46%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="merGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(42 78% 55%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(42 78% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="month" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(210 15% 55%)" fontSize={12} />
                  <Tooltip contentStyle={chartStyle} />
                  <Area type="monotone" dataKey="affiliates" stroke="hsl(174 72% 46%)" fill="url(#affGrad)" strokeWidth={2} name="مسوقين" />
                  <Area type="monotone" dataKey="merchants" stroke="hsl(42 78% 55%)" fill="url(#merGrad)" strokeWidth={2} name="تجار" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">توزيع الخطط</h2>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
                    {planDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="font-semibold">آخر المسجلين</h2>
            <div className="space-y-3">
              {recentUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    u.role === "merchant" ? "bg-accent/20 text-accent" : "gradient-teal text-primary-foreground"
                  }`}>
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.role === "merchant" ? "تاجر" : "مسوق"} • {u.plan}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{u.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
