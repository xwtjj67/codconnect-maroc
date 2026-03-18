import AdminLayout from "@/components/layouts/AdminLayout";
import StatCard from "@/components/shared/StatCard";
import { Users, ShoppingCart, Package, DollarSign, TrendingUp, UserCheck, Store, Activity, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">لوحة تحكم الإدارة</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي المستخدمين" value={0} icon={<Users className="h-6 w-6" />} tooltip="جميع المسوقين وأصحاب المنتجات" />
          <StatCard title="إجمالي الإيرادات" value={0} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" tooltip="إيرادات المنصة" />
          <StatCard title="إجمالي الطلبات" value={0} icon={<ShoppingCart className="h-6 w-6" />} tooltip="جميع الطلبات" />
          <StatCard title="المنتجات النشطة" value={0} icon={<Package className="h-6 w-6" />} tooltip="المنتجات المتاحة" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="المسوقين" value={0} icon={<UserCheck className="h-6 w-6" />} />
          <StatCard title="أصحاب المنتجات" value={0} icon={<Store className="h-6 w-6" />} />
          <StatCard title="العمولات المدفوعة" value={0} icon={<Activity className="h-6 w-6" />} suffix=" DH" />
          <StatCard title="في انتظار التفعيل" value={0} icon={<Clock className="h-6 w-6" />} />
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/users" className="glass-card-hover p-6 space-y-3 block">
            <div className="h-12 w-12 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-semibold">المستخدمين المعلقين</h3>
            <p className="text-sm text-muted-foreground">مراجعة وتفعيل الحسابات الجديدة</p>
          </Link>
          <Link to="/admin/products" className="glass-card-hover p-6 space-y-3 block">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">إدارة المنتجات</h3>
            <p className="text-sm text-muted-foreground">مراجعة والموافقة على المنتجات</p>
          </Link>
          <Link to="/admin/orders" className="glass-card-hover p-6 space-y-3 block">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold">الطلبات</h3>
            <p className="text-sm text-muted-foreground">متابعة وإدارة جميع الطلبات</p>
          </Link>
        </div>

        {/* Empty State */}
        <div className="glass-card p-8 text-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">لا توجد بيانات بعد</p>
          <p className="text-sm text-muted-foreground/70">ستظهر الإحصائيات والرسوم البيانية بعد بدء تسجيل المستخدمين</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
