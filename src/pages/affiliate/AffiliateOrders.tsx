import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const statusColors: Record<string, string> = {
  pending: "text-accent bg-accent/10",
  confirmed: "text-primary bg-primary/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-destructive bg-destructive/10",
};

const orders = [
  { id: "1", product: "سماعات بلوتوث", client: "أحمد", city: "الدار البيضاء", status: "confirmed", commission: "40 DH" },
  { id: "2", product: "كريم العناية", client: "فاطمة", city: "مراكش", status: "pending", commission: "35 DH" },
  { id: "3", product: "حزام رياضي", client: "يوسف", city: "الرباط", status: "delivered", commission: "50 DH" },
  { id: "4", product: "ساعة رقمية", client: "سارة", city: "طنجة", status: "confirmed", commission: "45 DH" },
  { id: "5", product: "عطر فاخر", client: "كريم", city: "فاس", status: "cancelled", commission: "0 DH" },
];

const commissionData = [
  { name: "يناير", commission: 120 },
  { name: "فبراير", commission: 85 },
  { name: "مارس", commission: 210 },
  { name: "أبريل", commission: 165 },
  { name: "ماي", commission: 290 },
  { name: "يونيو", commission: 240 },
];

const AffiliateOrders = () => {
  return (
    <AffiliateLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">طلباتي</h1>

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
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 last:border-0">
                    <td className="p-4 font-medium">{order.product}</td>
                    <td className="p-4 text-muted-foreground">{order.client}</td>
                    <td className="p-4 text-muted-foreground">{order.city}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-accent">{order.commission}</td>
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
