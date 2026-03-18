import AdminLayout from "@/components/layouts/AdminLayout";
import { Package } from "lucide-react";
import { useState } from "react";

const AdminProducts = () => {
  const [tab, setTab] = useState<"all" | "pending">("all");

  // Empty — products will come from API
  const products: any[] = [];
  const pendingCount = 0;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <div className="flex gap-2">
            <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-lg text-sm transition-all ${tab === "all" ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground"}`}>
              الكل (0)
            </button>
            <button onClick={() => setTab("pending")} className={`px-4 py-2 rounded-lg text-sm transition-all ${tab === "pending" ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground"}`}>
              قيد الموافقة ({pendingCount})
            </button>
          </div>
        </div>

        <div className="glass-card p-12 text-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">لا توجد منتجات بعد</p>
          <p className="text-sm text-muted-foreground/70">ستظهر المنتجات هنا عند إضافتها من أصحاب المنتجات</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
