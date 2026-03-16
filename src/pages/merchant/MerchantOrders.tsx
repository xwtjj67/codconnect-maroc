import MerchantLayout from "@/components/layouts/MerchantLayout";
import { useState } from "react";
import { Filter } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار", confirmed: "مؤكد", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي",
};
const statusColors: Record<string, string> = {
  pending: "text-accent bg-accent/10", confirmed: "text-primary bg-primary/10", shipped: "text-blue-400 bg-blue-400/10", delivered: "text-green-400 bg-green-400/10", cancelled: "text-destructive bg-destructive/10",
};

const mockOrders = [
  { id: "1", product: "سماعات بلوتوث", affiliate: "محمد ب.", client: "أحمد", city: "الدار البيضاء", status: "confirmed", price: 199, commission: 40 },
  { id: "2", product: "كريم العناية", affiliate: "سارة ل.", client: "فاطمة", city: "مراكش", status: "pending", price: 149, commission: 35 },
  { id: "3", product: "حزام رياضي", affiliate: "يوسف ع.", client: "يوسف", city: "الرباط", status: "delivered", price: 249, commission: 50 },
  { id: "4", product: "ساعة رقمية", affiliate: "محمد ب.", client: "سارة", city: "طنجة", status: "shipped", price: 179, commission: 45 },
  { id: "5", product: "عطر فاخر", affiliate: "سارة ل.", client: "كريم", city: "فاس", status: "cancelled", price: 320, commission: 0 },
  { id: "6", product: "سماعات بلوتوث", affiliate: "محمد ب.", client: "نور", city: "أكادير", status: "confirmed", price: 199, commission: 40 },
  { id: "7", product: "كريم العناية", affiliate: "يوسف ع.", client: "هدى", city: "وجدة", status: "delivered", price: 149, commission: 35 },
];

const statusFilters = ["الكل", "pending", "confirmed", "shipped", "delivered", "cancelled"];

const MerchantOrders = () => {
  const [filter, setFilter] = useState("الكل");
  const filtered = filter === "الكل" ? mockOrders : mockOrders.filter(o => o.status === filter);

  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
          <div className="flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === s ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {s === "الكل" ? "الكل" : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{mockOrders.length}</p>
            <p className="text-xs text-muted-foreground">إجمالي</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{mockOrders.filter(o => o.status === "confirmed").length}</p>
            <p className="text-xs text-muted-foreground">مؤكد</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{mockOrders.filter(o => o.status === "delivered").length}</p>
            <p className="text-xs text-muted-foreground">تم التوصيل</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{mockOrders.filter(o => o.status === "pending").length}</p>
            <p className="text-xs text-muted-foreground">قيد الانتظار</p>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-right p-4 font-medium text-muted-foreground">المنتج</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المسوق</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">العميل</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المدينة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">السعر</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">العمولة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium">{order.product}</td>
                    <td className="p-4 text-muted-foreground">{order.affiliate}</td>
                    <td className="p-4 text-muted-foreground">{order.client}</td>
                    <td className="p-4 text-muted-foreground">{order.city}</td>
                    <td className="p-4 font-bold text-foreground">{order.price} DH</td>
                    <td className="p-4"><span className="gold-badge">{order.commission} DH</span></td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
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

export default MerchantOrders;
