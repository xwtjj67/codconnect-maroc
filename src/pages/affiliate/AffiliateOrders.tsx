import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Filter } from "lucide-react";
import { useState } from "react";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار", confirmed: "مؤكد", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي",
};
const statusColors: Record<string, string> = {
  pending: "text-accent bg-accent/10", confirmed: "text-primary bg-primary/10", shipped: "text-blue-400 bg-blue-400/10", delivered: "text-green-400 bg-green-400/10", cancelled: "text-destructive bg-destructive/10",
};

const orders = [
  { id: "1", product: "سماعات بلوتوث", client: "أحمد", city: "الدار البيضاء", status: "confirmed", commission: 40 },
  { id: "2", product: "كريم العناية", client: "فاطمة", city: "مراكش", status: "pending", commission: 35 },
  { id: "3", product: "حزام رياضي", client: "يوسف", city: "الرباط", status: "delivered", commission: 50 },
  { id: "4", product: "ساعة رقمية", client: "سارة", city: "طنجة", status: "shipped", commission: 45 },
  { id: "5", product: "عطر فاخر", client: "كريم", city: "فاس", status: "cancelled", commission: 0 },
  { id: "6", product: "سماعات بلوتوث", client: "نور", city: "أكادير", status: "confirmed", commission: 40 },
];

const commissionData = [
  { name: "يناير", commission: 120 },
  { name: "فبراير", commission: 85 },
  { name: "مارس", commission: 210 },
  { name: "أبريل", commission: 165 },
  { name: "ماي", commission: 290 },
  { name: "يونيو", commission: 240 },
];

const statusFilters = ["الكل", "pending", "confirmed", "shipped", "delivered", "cancelled"];

const AffiliateOrders = () => {
  const [filter, setFilter] = useState("الكل");
  const filtered = filter === "الكل" ? orders : orders.filter(o => o.status === filter);
  const totalEarned = orders.filter(o => o.status === "confirmed" || o.status === "delivered").reduce((s, o) => s + o.commission, 0);

  return (
    <AffiliateLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">طلباتي</h1>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            <p className="text-xs text-muted-foreground">إجمالي الطلبات</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{totalEarned} DH</p>
            <p className="text-xs text-muted-foreground">عمولات مؤكدة</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{orders.filter(o => o.status === "pending").length}</p>
            <p className="text-xs text-muted-foreground">قيد الانتظار</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold">العمولات الشهرية (DH)</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                <XAxis dataKey="name" stroke="hsl(210 15% 55%)" fontSize={12} />
                <YAxis stroke="hsl(210 15% 55%)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(210 45% 13%)", border: "1px solid hsl(174 50% 30%)", borderRadius: "8px", color: "hsl(210 20% 95%)" }} />
                <Bar dataKey="commission" fill="hsl(42 78% 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm flex-wrap">
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

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-right p-4 font-medium text-muted-foreground">المنتج</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">العميل</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المدينة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">العمولة</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium">{order.product}</td>
                    <td className="p-4 text-muted-foreground">{order.client}</td>
                    <td className="p-4 text-muted-foreground">{order.city}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-accent">{order.commission} DH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateOrders;
