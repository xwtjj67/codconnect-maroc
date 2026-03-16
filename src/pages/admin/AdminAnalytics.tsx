import AdminLayout from "@/components/layouts/AdminLayout";
import StatCard from "@/components/shared/StatCard";
import { DollarSign, TrendingUp, ShoppingCart, Users, Target, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const monthlyData = [
  { month: "يناير", revenue: 4200, orders: 28, conversions: 6.2 },
  { month: "فبراير", revenue: 5800, orders: 38, conversions: 7.5 },
  { month: "مارس", revenue: 7200, orders: 48, conversions: 9.1 },
  { month: "أبريل", revenue: 8400, orders: 56, conversions: 10.3 },
  { month: "ماي", revenue: 12800, orders: 85, conversions: 13.8 },
  { month: "يونيو", revenue: 14000, orders: 93, conversions: 14.2 },
];

const topProducts = [
  { name: "سماعات بلوتوث", orders: 45, revenue: 8955 },
  { name: "ساعة رقمية", orders: 38, revenue: 6802 },
  { name: "كريم العناية", orders: 32, revenue: 4768 },
  { name: "حزام رياضي", orders: 18, revenue: 4482 },
];

const topAffiliates = [
  { name: "محمد ب.", orders: 38, commission: 1260 },
  { name: "سارة ل.", orders: 27, commission: 930 },
  { name: "يوسف ع.", orders: 22, commission: 750 },
];

const chartStyle = { backgroundColor: "hsl(210 45% 13%)", border: "1px solid hsl(174 50% 30%)", borderRadius: "8px", color: "hsl(210 20% 95%)" };

const AdminAnalytics = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">تحليلات المنصة</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي الإيرادات" value={52400} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" trend={22} />
          <StatCard title="إجمالي الطلبات" value={340} icon={<ShoppingCart className="h-6 w-6" />} trend={15} />
          <StatCard title="معدل التحويل" value={14.2} icon={<Target className="h-6 w-6" />} suffix="%" trend={5.3} />
          <StatCard title="نمو شهري" value={18.5} icon={<TrendingUp className="h-6 w-6" />} suffix="%" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">نمو الإيرادات</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(174 72% 46%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(174 72% 46%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="month" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(210 15% 55%)" fontSize={12} />
                  <Tooltip contentStyle={chartStyle} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(174 72% 46%)" fill="url(#adminRev)" strokeWidth={2} name="الإيرادات (DH)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">الطلبات ومعدل التحويل</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="month" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis yAxisId="ord" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis yAxisId="conv" orientation="left" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <Tooltip contentStyle={chartStyle} />
                  <Bar yAxisId="ord" dataKey="orders" fill="hsl(174 72% 46%)" radius={[4, 4, 0, 0]} name="الطلبات" />
                  <Line yAxisId="conv" type="monotone" dataKey="conversions" stroke="hsl(42 78% 55%)" strokeWidth={2} name="التحويل (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">أفضل المنتجات</h2>
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
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">أفضل المسوقين</h2>
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
