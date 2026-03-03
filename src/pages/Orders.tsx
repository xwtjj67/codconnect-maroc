import DashboardLayout from "@/components/layouts/DashboardLayout";

const orders = [
  { product: "سماعات بلوتوث", client: "أحمد", city: "الدار البيضاء", status: "مؤكد", commission: "40 DH" },
  { product: "كريم العناية", client: "فاطمة", city: "مراكش", status: "قيد الانتظار", commission: "35 DH" },
  { product: "حزام رياضي", client: "يوسف", city: "الرباط", status: "تم التوصيل", commission: "50 DH" },
];

const statusColors: Record<string, string> = {
  "مؤكد": "text-primary bg-primary/10",
  "قيد الانتظار": "text-accent bg-accent/10",
  "تم التوصيل": "text-green-400 bg-green-400/10",
};

const Orders = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">الطلبات</h1>
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
                {orders.map((order, i) => (
                  <tr key={i} className="border-b border-border/30 last:border-0">
                    <td className="p-4 font-medium">{order.product}</td>
                    <td className="p-4 text-muted-foreground">{order.client}</td>
                    <td className="p-4 text-muted-foreground">{order.city}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                        {order.status}
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
    </DashboardLayout>
  );
};

export default Orders;
