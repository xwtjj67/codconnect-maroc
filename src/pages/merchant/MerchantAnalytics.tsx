import MerchantLayout from "@/components/layouts/MerchantLayout";
import StatCard from "@/components/shared/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, Package, Users, Target } from "lucide-react";

const salesData = [
  { name: "يناير", revenue: 2400, orders: 12 },
  { name: "فبراير", revenue: 1800, orders: 8 },
  { name: "مارس", revenue: 3200, orders: 18 },
  { name: "أبريل", revenue: 2800, orders: 14 },
  { name: "ماي", revenue: 4100, orders: 22 },
  { name: "يونيو", revenue: 3600, orders: 19 },
];

const conversionData = [
  { name: "يناير", rate: 8.2 },
  { name: "فبراير", rate: 7.5 },
  { name: "مارس", rate: 11.3 },
  { name: "أبريل", rate: 9.8 },
  { name: "ماي", rate: 14.2 },
  { name: "يونيو", rate: 12.5 },
];

const topProducts = [
  { name: "سماعات بلوتوث", value: 45 },
  { name: "كريم العناية", value: 32 },
  { name: "حزام رياضي", value: 18 },
  { name: "ساعة رقمية", value: 38 },
];

const topAffiliates = [
  { name: "محمد ب.", orders: 38, revenue: 5200 },
  { name: "سارة ل.", orders: 27, revenue: 3800 },
  { name: "يوسف ع.", orders: 22, revenue: 3100 },
];

const CHART_COLORS = ["hsl(174 72% 46%)", "hsl(42 78% 55%)", "hsl(210 30% 50%)", "hsl(174 80% 55%)"];

const chartTooltipStyle = {
  backgroundColor: "hsl(210 45% 13%)",
  border: "1px solid hsl(174 50% 30%)",
  borderRadius: "8px",
  color: "hsl(210 20% 95%)",
};

const MerchantAnalytics = () => {
  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">التحليلات</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي الإيرادات" value={17900} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" trend={14} tooltip="إجمالي الإيرادات من بداية الحساب" />
          <StatCard title="نمو المبيعات" value={14} icon={<TrendingUp className="h-6 w-6" />} suffix="%" trend={14} tooltip="نسبة نمو المبيعات مقارنة بالشهر السابق" />
          <StatCard title="إجمالي الطلبات" value={93} icon={<ShoppingCart className="h-6 w-6" />} trend={22} tooltip="عدد الطلبات الإجمالي" />
          <StatCard title="معدل التحويل" value={12.5} icon={<Target className="h-6 w-6" />} suffix="%" trend={3.2} tooltip="نسبة الزوار الذين أكملوا طلبًا" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">الإيرادات والطلبات الشهرية</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="name" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis yAxisId="rev" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis yAxisId="ord" orientation="left" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar yAxisId="rev" dataKey="revenue" fill="hsl(174 72% 46%)" radius={[4, 4, 0, 0]} name="الإيرادات (DH)" />
                  <Bar yAxisId="ord" dataKey="orders" fill="hsl(42 78% 55%)" radius={[4, 4, 0, 0]} name="الطلبات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">معدل التحويل (%)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={conversionData}>
                  <defs>
                    <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(174 72% 46%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(174 72% 46%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="name" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(210 15% 55%)" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area type="monotone" dataKey="rate" stroke="hsl(174 72% 46%)" fill="url(#convGrad)" strokeWidth={2} name="معدل التحويل" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">أفضل المنتجات (حسب الطلبات)</h2>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={topProducts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {topProducts.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
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
                  <span className="gold-badge">{a.revenue} DH</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default MerchantAnalytics;
