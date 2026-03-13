import MerchantLayout from "@/components/layouts/MerchantLayout";
import StatCard from "@/components/shared/StatCard";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

const MerchantDashboard = () => {
  return (
    <MerchantLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">لوحة تحكم التاجر</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="الإيرادات" value="1,096 DH" icon={<DollarSign className="h-6 w-6" />} />
          <StatCard title="الطلبات" value="5" icon={<ShoppingCart className="h-6 w-6" />} />
          <StatCard title="المنتجات" value="6" icon={<Package className="h-6 w-6" />} />
          <StatCard title="المسوقين النشطين" value="12" icon={<Users className="h-6 w-6" />} />
        </div>
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4">آخر الطلبات</h2>
          <p className="text-muted-foreground text-sm">يتم عرض آخر الطلبات هنا عند ربط Backend.</p>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default MerchantDashboard;
