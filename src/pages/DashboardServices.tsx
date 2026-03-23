import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Rocket, Globe, Crown, MessageCircle } from "lucide-react";
import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import MerchantLayout from "@/components/layouts/MerchantLayout";

interface Service { title: string; description: string; badge?: "VIP" | "NEW" | "POPULAR"; }
interface ServiceCategory { title: string; icon: typeof Sparkles; services: Service[]; }

const categories: ServiceCategory[] = [
  { title: "نمو المسوقين", icon: Rocket, services: [
    { title: "حسابات Facebook Ads", description: "حسابات إعلانية جاهزة ومفعلة للإطلاق الفوري لحملاتك الإعلانية", badge: "POPULAR" },
    { title: "حسابات TikTok Ads", description: "حسابات إعلانية على تيك توك لاستهداف الجمهور المغربي بفعالية", badge: "NEW" },
    { title: "Creative Pack", description: "باقة تصاميم إعلانية احترافية جاهزة لزيادة معدل التحويل", badge: "POPULAR" },
    { title: "Landing Page جاهزة", description: "صفحة هبوط احترافية مصممة خصيصاً لمنتجك لزيادة المبيعات" },
    { title: "إعداد Funnel", description: "بناء قمع مبيعات كامل من الإعلان إلى التحويل" },
    { title: "إعداد الإعلانات", description: "إطلاق وإدارة حملاتك الإعلانية من الصفر حتى أول طلبية" },
    { title: "استراتيجية Scaling", description: "خطة توسيع متقدمة لمضاعفة أرباحك مع تقليل التكاليف", badge: "VIP" },
  ]},
  { title: "نمو الموردين", icon: Sparkles, services: [
    { title: "استراتيجية إطلاق المنتج", description: "خطة شاملة لإطلاق منتجك في السوق المغربي بنجاح", badge: "NEW" },
    { title: "تحسين التسعير", description: "تحليل وتعديل أسعارك لتحقيق أقصى ربح مع الحفاظ على التنافسية" },
    { title: "ترويج المنتج المميز", description: "عرض منتجك بشكل مميز أمام جميع المسوقين على المنصة", badge: "POPULAR" },
  ]},
  { title: "خدمات الوكالة", icon: Globe, services: [
    { title: "إنشاء موقع إلكتروني", description: "تصميم وتطوير موقع احترافي كامل لعلامتك التجارية", badge: "POPULAR" },
    { title: "إدارة السوشل ميديا (SMMA)", description: "إدارة شاملة لحساباتك على جميع منصات التواصل الاجتماعي" },
    { title: "خدمة Done-For-You", description: "نقوم بكل شيء نيابة عنك — من الإعلان إلى التحويل", badge: "VIP" },
  ]},
  { title: "Premium", icon: Crown, services: [
    { title: "كوتشينغ خاص", description: "جلسات تدريب فردية مع خبراء التسويق والتجارة الإلكترونية", badge: "VIP" },
    { title: "خطة نمو VIP", description: "خطة نمو مخصصة وشاملة لتطوير عملك بشكل كامل", badge: "VIP" },
  ]},
];

const badgeStyles: Record<string, string> = { VIP: "bg-accent/20 text-accent border-accent/30", NEW: "bg-primary/20 text-primary border-primary/30", POPULAR: "bg-teal/20 text-primary border-primary/30" };

const ServicesContent = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRequest = async () => {
    if (!selectedService || !user) return;
    setLoading(true);
    try {
      await api.submitServiceRequest({ name: user.name, phone: user.phone, role: user.role, service_name: selectedService });
      toast({ title: "✅ تم إرسال طلبك بنجاح", description: "سنتواصل معك قريباً" });
      setDialogOpen(false);
    } catch { toast({ title: "حدث خطأ", description: "يرجى المحاولة مرة أخرى", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const openWhatsApp = (serviceName: string) => { window.open(`https://wa.me/212778133038?text=${encodeURIComponent(`أريد طلب خدمة: ${serviceName}`)}`, "_blank"); };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">خدماتنا</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">حلول متكاملة لتنمية أعمالك في التجارة الإلكترونية والتسويق بالعمولة</p>
      </div>
      {categories.map(cat => (
        <section key={cat.title} className="mb-8">
          <div className="flex items-center gap-3 mb-4"><cat.icon className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold text-foreground">{cat.title}</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.services.map(svc => (
              <Card key={svc.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-all duration-300 group">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2"><h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{svc.title}</h3>{svc.badge && <Badge className={`text-[10px] ${badgeStyles[svc.badge]}`}>{svc.badge}</Badge>}</div>
                  <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">{svc.description}</p>
                  <div className="flex gap-2"><Button className="flex-1" size="sm" onClick={() => { setSelectedService(svc.title); setDialogOpen(true); }}>اطلب الخدمة</Button><Button variant="outline" size="icon" onClick={() => openWhatsApp(svc.title)}><MessageCircle className="h-4 w-4" /></Button></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader><DialogTitle className="text-right">طلب خدمة: {selectedService}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">سيتم إرسال طلبك باسمك ورقم هاتفك المسجل في المنصة.</p>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={handleRequest} disabled={loading}>{loading ? "جاري الإرسال..." : "تأكيد الطلب"}</Button>
              <Button variant="outline" onClick={() => openWhatsApp(selectedService)} className="gap-2"><MessageCircle className="h-4 w-4" /> واتساب</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DashboardServices = () => {
  const { user } = useAuth();

  if (user?.role === "product_owner") {
    return <MerchantLayout><ServicesContent /></MerchantLayout>;
  }

  return <AffiliateLayout><ServicesContent /></AffiliateLayout>;
};

export default DashboardServices;
