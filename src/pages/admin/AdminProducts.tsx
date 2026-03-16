import AdminLayout from "@/components/layouts/AdminLayout";
import PlanBadge from "@/components/shared/PlanBadge";
import { useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import type { PlanType } from "@/types/auth";

interface AdminProduct {
  id: string;
  name: string;
  merchant: string;
  merchantPlan: PlanType;
  price: number;
  commission: number;
  stock: number;
  orders: number;
  isApproved: boolean;
}

const mockProducts: AdminProduct[] = [
  { id: "1", name: "سماعات بلوتوث لاسلكية", merchant: "متجر التقنية", merchantPlan: "vip", price: 199, commission: 40, stock: 50, orders: 45, isApproved: true },
  { id: "2", name: "كريم العناية بالبشرة", merchant: "متجر الجمال", merchantPlan: "premium", price: 149, commission: 35, stock: 120, orders: 32, isApproved: true },
  { id: "3", name: "حزام رياضي ذكي", merchant: "متجر التقنية", merchantPlan: "vip", price: 249, commission: 50, stock: 30, orders: 18, isApproved: true },
  { id: "4", name: "منتج جديد 1", merchant: "عطور المغرب", merchantPlan: "standard", price: 99, commission: 15, stock: 100, orders: 0, isApproved: false },
  { id: "5", name: "منتج جديد 2", merchant: "ملابس الأناقة", merchantPlan: "premium", price: 159, commission: 30, stock: 80, orders: 0, isApproved: false },
];

const AdminProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [tab, setTab] = useState<"all" | "pending">("all");

  const displayed = tab === "pending" ? products.filter(p => !p.isApproved) : products;
  const pendingCount = products.filter(p => !p.isApproved).length;

  const toggleApproval = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isApproved: !p.isApproved } : p));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <div className="flex gap-2">
            <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-lg text-sm transition-all ${tab === "all" ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground"}`}>
              الكل ({products.length})
            </button>
            <button onClick={() => setTab("pending")} className={`px-4 py-2 rounded-lg text-sm transition-all ${tab === "pending" ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground"}`}>
              قيد الموافقة ({pendingCount})
            </button>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-right p-4 font-medium text-muted-foreground">المنتج</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">التاجر</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">السعر</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">العمولة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المخزون</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الطلبات</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((p) => (
                  <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{p.merchant}</span>
                        <PlanBadge plan={p.merchantPlan} />
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{p.price} DH</td>
                    <td className="p-4"><span className="gold-badge">{p.commission} DH</span></td>
                    <td className="p-4 text-muted-foreground">{p.stock}</td>
                    <td className="p-4 text-muted-foreground">{p.orders}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.isApproved ? "text-green-400 bg-green-400/10" : "text-accent bg-accent/10"}`}>
                        {p.isApproved ? "مقبول" : "قيد الموافقة"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleApproval(p.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          p.isApproved ? "hover:bg-destructive/10 text-green-400 hover:text-destructive" : "hover:bg-green-400/10 text-accent hover:text-green-400"
                        }`}
                      >
                        {p.isApproved ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
