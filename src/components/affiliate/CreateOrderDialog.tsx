import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AvailableProduct {
  id: string;
  name: string;
  selling_price: number | null;
  commission: number | null;
  cost_price: number;
  merchant_id: string;
}

const CreateOrderDialog = ({ onOrderCreated }: { onOrderCreated: () => void }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<AvailableProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (!open) return;
    supabase
      .from("products")
      .select("id, name, selling_price, commission, cost_price, merchant_id")
      .eq("approval_status", "approved")
      .eq("is_active", true)
      .then(({ data }) => setProducts(data || []));
  }, [open]);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = async () => {
    if (!user || !selectedProduct || !clientName.trim() || !clientPhone.trim() || !city.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    if (clientPhone.trim().length < 10) {
      toast.error("رقم الهاتف غير صالح");
      return;
    }

    setLoading(true);
    const sellingPrice = selectedProduct.selling_price || 0;
    const commissionAmount = selectedProduct.commission || 0;
    const platformProfit = sellingPrice - selectedProduct.cost_price - commissionAmount;

    const { error } = await supabase.from("orders").insert({
      affiliate_id: user.id,
      product_id: selectedProduct.id,
      merchant_id: selectedProduct.merchant_id,
      client_name: clientName.trim(),
      client_phone: clientPhone.trim(),
      city: city.trim(),
      selling_price: sellingPrice,
      cost_price: selectedProduct.cost_price,
      commission_amount: commissionAmount,
      platform_profit: platformProfit > 0 ? platformProfit : 0,
      status: "pending",
    });

    setLoading(false);
    if (error) {
      toast.error("حدث خطأ أثناء إنشاء الطلب");
      console.error(error);
      return;
    }

    toast.success("تم إنشاء الطلب بنجاح!");
    setOpen(false);
    setSelectedProductId("");
    setClientName("");
    setClientPhone("");
    setCity("");
    onOrderCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إنشاء طلب جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء طلب جديد</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>اختر المنتج</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="اختر منتج..." />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {p.selling_price || 0} DH
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="flex gap-3 text-sm p-3 rounded-lg bg-secondary/50">
              <div>
                <span className="text-muted-foreground">السعر: </span>
                <span className="font-bold">{selectedProduct.selling_price || 0} DH</span>
              </div>
              <div>
                <span className="text-muted-foreground">عمولتك: </span>
                <span className="font-bold text-accent">{selectedProduct.commission || 0} DH</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>اسم العميل</Label>
            <Input
              placeholder="أدخل اسم العميل"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>رقم هاتف العميل</Label>
            <Input
              placeholder="06XXXXXXXX"
              value={clientPhone}
              onChange={e => setClientPhone(e.target.value)}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>المدينة</Label>
            <Input
              placeholder="أدخل مدينة العميل"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "جاري الإنشاء..." : "تأكيد الطلب"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderDialog;
