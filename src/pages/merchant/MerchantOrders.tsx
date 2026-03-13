import MerchantLayout from "@/components/layouts/MerchantLayout";

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

const mockOrders = [
  { id: "1", product: "سماعات بلوتوث", affiliate: "محمد ب.", client: "أحمد", city: "الدار البيضاء", status: "confirmed", price: "199 DH" },
  { id: "2", product: "كريم العناية", affiliate: "سارة ل.", client: "فاطمة", city: "مراكش", status: "pending", price: "149 DH" },
  { id: "3", product: "حزام رياضي", affiliate: "يوسف ع.", client: "يوسف", city: "الرباط", status: "delivered", price: "249 DH" },
  { id: "4", product: "ساعة رقمية", affiliate: "محمد ب.", client: "سارة", city: "طنجة", status: "confirmed", price: "179 DH" },
  { id: "5", product: "عطر فاخر", affiliate: "سارة ل.", client: "كريم", city: "فاس", status: "cancelled", price: "320 DH" },
];

const MerchantOrders = () => {
  return (
    <MerchantLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
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
                  <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 last:border-0">
                    <td className="p-4 font-medium">{order.product}</td>
                    <td className="p-4 text-muted-foreground">{order.affiliate}</td>
                    <td className="p-4 text-muted-foreground">{order.client}</td>
                    <td className="p-4 text-muted-foreground">{order.city}</td>
                    <td className="p-4 font-bold text-foreground">{order.price}</td>
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
