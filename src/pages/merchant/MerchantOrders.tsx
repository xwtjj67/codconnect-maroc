import MerchantLayout from "@/components/layouts/MerchantLayout";
import { ShoppingCart } from "lucide-react";

const MerchantOrders = () => {
  // Empty — orders will come from API
  const orders: any[] = [];

  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">الطلبات</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">إجمالي</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">مؤكد</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-green-400">0</p>
            <p className="text-xs text-muted-foreground">تم التوصيل</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">0</p>
            <p className="text-xs text-muted-foreground">قيد الانتظار</p>
          </div>
        </div>

        <div className="glass-card p-12 text-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">لا توجد طلبات بعد</p>
          <p className="text-sm text-muted-foreground/70">ستظهر الطلبات هنا عند بدء البيع</p>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default MerchantOrders;
