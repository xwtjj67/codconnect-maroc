import MerchantLayout from "@/components/layouts/MerchantLayout";
import { useState } from "react";
import { Plus, Edit, Trash2, Pause, Play, Eye, ShoppingCart, TrendingUp, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PLANS } from "@/types/auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const mockProducts = [
  { id: "1", name: "سماعات بلوتوث لاسلكية", price: 199, commission: 40, stock: 50, image: "/placeholder.svg", views: 1240, clicks: 380, orders: 45, conversionRate: 11.8, isActive: true },
  { id: "2", name: "كريم العناية بالبشرة", price: 149, commission: 35, stock: 120, image: "/placeholder.svg", views: 890, clicks: 210, orders: 32, conversionRate: 15.2, isActive: true },
  { id: "3", name: "حزام رياضي ذكي", price: 249, commission: 50, stock: 30, image: "/placeholder.svg", views: 670, clicks: 150, orders: 18, conversionRate: 12.0, isActive: false },
];

const MerchantProducts = () => {
  const [products] = useState(mockProducts);
  const { user, canAddProduct } = useAuth();
  const plan = user?.plan ? PLANS[user.plan] : PLANS.standard;
  const canAdd = canAddProduct(products.length);

  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">منتجاتي</h1>
            <p className="text-sm text-muted-foreground">
              {products.length} / {plan.maxProducts === -1 ? "∞" : plan.maxProducts} منتجات
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled={!canAdd}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity ${
                  canAdd ? "gradient-teal text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {canAdd ? <Plus className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                إضافة منتج
              </button>
            </TooltipTrigger>
            {!canAdd && (
              <TooltipContent><p>وصلت للحد الأقصى. قم بترقية خطتك لإضافة المزيد</p></TooltipContent>
            )}
          </Tooltip>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-right p-4 font-medium text-muted-foreground">المنتج</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">السعر</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">العمولة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المخزون</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الأداء</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg bg-secondary object-cover" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{p.price} DH</td>
                    <td className="p-4"><span className="gold-badge">{p.commission} DH</span></td>
                    <td className="p-4">
                      <span className={p.stock < 20 ? "text-destructive" : "text-muted-foreground"}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views}</span>
                        <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" /> {p.orders}</span>
                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {p.conversionRate}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.isActive ? "text-green-400 bg-green-400/10" : "text-muted-foreground bg-muted"}`}>
                        {p.isActive ? "نشط" : "متوقف"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                          {p.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default MerchantProducts;
