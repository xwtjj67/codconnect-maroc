import MerchantLayout from "@/components/layouts/MerchantLayout";
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

const mockProducts = [
  { id: "1", name: "سماعات بلوتوث لاسلكية", price: "199 DH", commission: "40 DH", stock: 50, image: "/placeholder.svg" },
  { id: "2", name: "كريم العناية بالبشرة", price: "149 DH", commission: "35 DH", stock: 120, image: "/placeholder.svg" },
  { id: "3", name: "حزام رياضي ذكي", price: "249 DH", commission: "50 DH", stock: 30, image: "/placeholder.svg" },
];

const MerchantProducts = () => {
  const [products] = useState(mockProducts);

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">منتجاتي</h1>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" />
            إضافة منتج
          </button>
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
                  <th className="text-right p-4 font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border/30 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg bg-secondary object-cover" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{p.price}</td>
                    <td className="p-4"><span className="gold-badge">{p.commission}</span></td>
                    <td className="p-4 text-muted-foreground">{p.stock}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                          <Edit className="h-4 w-4" />
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
