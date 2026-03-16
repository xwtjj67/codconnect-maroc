import AdminLayout from "@/components/layouts/AdminLayout";
import { useState } from "react";
import { Filter } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار", confirmed: "مؤكد", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي",
};
const statusColors: Record<string, string> = {
  pending: "text-accent bg-accent/10", confirmed: "text-primary bg-primary/10", shipped: "text-blue-400 bg-blue-400/10", delivered: "text-green-400 bg-green-400/10", cancelled: "text-destructive bg-destructive/10",
};

const allOrders = [
  { id: "1", product: "سماعات بلوتوث", merchant: "متجر التقنية", affiliate: "محمد ب.", client: "أحمد", city: "الدار البيضاء", price: 199, commission: 40, status: "confirmed" },
  { id: "2", product: "كريم العناية", merchant: "متجر الجمال", affiliate: "سارة ل.", client: "فاطمة", city: "مراكش", price: 149, commission: 35, status: "pending" },
  { id: "3", product: "حزام رياضي", merchant: "متجر التقنية", affiliate: "يوسف ع.", client: "يوسف", city: "الرباط", price: 249, commission: 50, status: "delivered" },
  { id: "4", product: "ساعة رقمية", merchant: "متجر التقنية", affiliate: "محمد ب.", client: "سارة", city: "طنجة", price: 179, commission: 45, status: "shipped" },
  { id: "5", product: "عطر فاخر", merchant: "عطور المغرب", affiliate: "سارة ل.", client: "كريم", city: "فاس", price: 320, commission: 0, status: "cancelled" },
];

const statusFilters = ["الكل", "pending", "confirmed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [filter, setFilter] = useState("الكل");
  const filtered = filter === "الكل" ? allOrders : allOrders.filter(o => o.status === filter);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">جميع الطلبات</h1>

        <div className="flex items-center gap-2 text-sm flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {statusFilters.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === s ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>
              {s === "الكل" ? "الكل" : statusLabels[s]}
            </button>
          ))}
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-right p-4 font-medium text-muted-foreground">المنتج</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">التاجر</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المسوق</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">العميل</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المدينة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">السعر</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">العمولة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium">{o.product}</td>
                    <td className="p-4 text-muted-foreground">{o.merchant}</td>
                    <td className="p-4 text-muted-foreground">{o.affiliate}</td>
                    <td className="p-4 text-muted-foreground">{o.client}</td>
                    <td className="p-4 text-muted-foreground">{o.city}</td>
                    <td className="p-4 font-bold">{o.price} DH</td>
                    <td className="p-4"><span className="gold-badge">{o.commission} DH</span></td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[o.status]}`}>
                        {statusLabels[o.status]}
                      </span>
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

export default AdminOrders;
