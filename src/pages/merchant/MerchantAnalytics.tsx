import MerchantLayout from "@/components/layouts/MerchantLayout";
import StatCard from "@/components/shared/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, Package } from "lucide-react";

const salesData = [
  { name: "يناير", revenue: 2400 },
  { name: "فبراير", revenue: 1800 },
  { name: "مارس", revenue: 3200 },
  { name: "أبريل", revenue: 2800 },
  { name: "ماي", revenue: 4100 },
  { name: "يونيو", revenue: 3600 },
];

const ordersData = [
  { name: "يناير", orders: 12 },
  { name: "فبراير", orders: 8 },
  { name: "مارس", orders: 18 },
  { name: "أبريل", orders: 14 },
  { name: "ماي", orders: 22 },
  { name: "يونيو", orders: 19 },
];

const MerchantAnalytics = () => {
  return (
    <MerchantLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">التحليلات</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي الإيرادات" value="17,900 DH" icon={<DollarSign className="h-6 w-6" />} />
          <StatCard title="نمو المبيعات" value="+14%" icon={<TrendingUp className="h-6 w-6" />} />
          <StatCard title="إجمالي الطلبات" value="93" icon={<ShoppingCart className="h-6 w-6" />} />
          <StatCard title="المنتجات النشطة" value="6" icon={<Package className="h-6 w-6" />} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">الإيرادات الشهرية (DH)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="name" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(210 15% 55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(210 45% 13%)", border: "1px solid hsl(174 50% 30%)", borderRadius: "8px", color: "hsl(210 20% 95%)" }}
                  />
                  <Bar dataKey="revenue" fill="hsl(174 72% 46%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">الطلبات الشهرية</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="name" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(210 15% 55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(210 45% 13%)", border: "1px solid hsl(174 50% 30%)", borderRadius: "8px", color: "hsl(210 20% 95%)" }}
                  />
                  <Line type="monotone" dataKey="orders" stroke="hsl(42 78% 55%)" strokeWidth={2} dot={{ fill: "hsl(42 78% 55%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default MerchantAnalytics;
