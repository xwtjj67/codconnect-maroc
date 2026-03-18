import AdminLayout from "@/components/layouts/AdminLayout";
import StatCard from "@/components/shared/StatCard";
import { Users, ShoppingCart, Package, DollarSign, TrendingUp, UserCheck, Store, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0, affiliates: 0, merchants: 0, pendingUsers: 0,
    totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalCommissions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: totalUsers }, { count: affiliates }, { count: merchants }, { count: pendingUsers },
        { count: totalProducts }, { count: totalOrders },
        { data: orderData }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "affiliate"),
        supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "product_owner"),
        supabase.from("user_statuses").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("selling_price, commission_amount").in("status", ["confirmed", "delivered"]),
      ]);

      const totalRevenue = orderData?.reduce((s, o) => s + Number(o.selling_price), 0) || 0;
      const totalCommissions = orderData?.reduce((s, o) => s + Number(o.commission_amount), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0, affiliates: affiliates || 0, merchants: merchants || 0,
        pendingUsers: pendingUsers || 0, totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0, totalRevenue, totalCommissions,
      });
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">لوحة تحكم الإدارة</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي المستخدمين" value={stats.totalUsers} icon={<Users className="h-6 w-6" />} />
          <StatCard title="إجمالي الإيرادات" value={stats.totalRevenue} icon={<DollarSign className="h-6 w-6" />} suffix=" DH" />
          <StatCard title="إجمالي الطلبات" value={stats.totalOrders} icon={<ShoppingCart className="h-6 w-6" />} />
          <StatCard title="المنتجات" value={stats.totalProducts} icon={<Package className="h-6 w-6" />} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="المسوقين" value={stats.affiliates} icon={<UserCheck className="h-6 w-6" />} />
          <StatCard title="أصحاب المنتجات" value={stats.merchants} icon={<Store className="h-6 w-6" />} />
          <StatCard title="العمولات" value={stats.totalCommissions} icon={<TrendingUp className="h-6 w-6" />} suffix=" DH" />
          <StatCard title="في انتظار التفعيل" value={stats.pendingUsers} icon={<Clock className="h-6 w-6" />} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/users" className="glass-card-hover p-6 space-y-3 block">
            <div className="h-12 w-12 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-semibold">المستخدمين المعلقين</h3>
            <p className="text-sm text-muted-foreground">مراجعة وتفعيل الحسابات الجديدة ({stats.pendingUsers})</p>
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
