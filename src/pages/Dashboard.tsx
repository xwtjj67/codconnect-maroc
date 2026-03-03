import DashboardLayout from "@/components/layouts/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="الأرباح" value="0 DH" icon={<DollarSign className="h-6 w-6" />} />
          <StatCard title="الطلبات" value="0" icon={<ShoppingCart className="h-6 w-6" />} />
          <StatCard title="المبيعات" value="0" icon={<TrendingUp className="h-6 w-6" />} />
          <StatCard title="عدد الإحالات" value="0" icon={<Users className="h-6 w-6" />} />
        </div>
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4">آخر النشاطات</h2>
          <p className="text-muted-foreground text-sm">لا توجد نشاطات بعد. ابدأ بمشاركة روابط المنتجات لتحقيق أولى مبيعاتك.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
