
import { useState } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Rocket, Globe, Crown, MessageCircle } from "lucide-react";

interface Service {
  title: string;
  description: string;
  badge?: "VIP" | "NEW" | "POPULAR";
}

interface ServiceCategory {
  title: string;
  icon: typeof Sparkles;
  services: Service[];
}

const categories: ServiceCategory[] = [
  {
    title: "نمو المسوقين",
    icon: Rocket,
    services: [
      { title: "حسابات Facebook Ads", description: "حسابات إعلانية جاهزة ومفعلة للإطلاق الفوري لحملاتك الإعلانية", badge: "POPULAR" },
      { title: "حسابات TikTok Ads", description: "حسابات إعلانية على تيك توك لاستهداف الجمهور المغربي بفعالية", badge: "NEW" },
      { title: "Creative Pack", description: "باقة تصاميم إعلانية احترافية جاهزة لزيادة معدل التحويل", badge: "POPULAR" },
      { title: "Landing Page جاهزة", description: "صفحة هبوط احترافية مصممة خصيصاً لمنتجك لزيادة المبيعات" },
      { title: "إعداد Funnel", description: "بناء قمع مبيعات كامل من الإعلان إلى التحويل" },
      { title: "إعداد الإعلانات", description: "إطلاق وإدارة حملاتك الإعلانية من الصفر حتى أول طلبية" },
      { title: "استراتيجية Scaling", description: "خطة توسيع متقدمة لمضاعفة أرباحك مع تقليل التكاليف", badge: "VIP" },
    ],
  },
  {
    title: "نمو الموردين",
    icon: Sparkles,
    services: [
      { title: "استراتيجية إطلاق المنتج", description: "خطة شاملة لإطلاق منتجك في السوق المغربي بنجاح", badge: "NEW" },
      { title: "تحسين التسعير", description: "تحليل وتعديل أسعارك لتحقيق أقصى ربح مع الحفاظ على التنافسية" },
      { title: "اختبار المنتجات", description: "اختبار منتجك مع جمهور حقيقي قبل الإطلاق الكامل" },
      { title: "ترويج المنتج المميز", description: "عرض منتجك بشكل مميز أمام جميع المسوقين على المنصة", badge: "POPULAR" },
      { title: "تحسين COD", description: "تقليل نسبة الإرجاع وتحسين معدل التوصيل الناجح" },
    ],
  },
  {
    title: "خدمات الوكالة",
    icon: Globe,
    services: [
      { title: "إنشاء موقع إلكتروني", description: "تصميم وتطوير موقع احترافي كامل لعلامتك التجارية", badge: "POPULAR" },
      { title: "إدارة السوشل ميديا (SMMA)", description: "إدارة شاملة لحساباتك على جميع منصات التواصل الاجتماعي" },
      { title: "التسويق بالمؤثرين", description: "التفاوض وإدارة حملات المؤثرين لزيادة الوعي بعلامتك", badge: "NEW" },
      { title: "إدارة الإعلانات المدفوعة", description: "إدارة كاملة لحملاتك الإعلانية على جميع المنصات" },
      { title: "خدمة Done-For-You", description: "نقوم بكل شيء نيابة عنك — من الإعلان إلى التحويل", badge: "VIP" },
    ],
  },
  {
    title: "Premium",
    icon: Crown,
    services: [
      { title: "كوتشينغ خاص", description: "جلسات تدريب فردية مع خبراء التسويق والتجارة الإلكترونية", badge: "VIP" },
      { title: "خطة نمو VIP", description: "خطة نمو مخصصة وشاملة لتطوير عملك بشكل كامل", badge: "VIP" },
      { title: "إعداد الأتمتة الكاملة", description: "أتمتة جميع عملياتك من الطلبيات إلى التتبع والتقارير", badge: "VIP" },
    ],
  },
];

const badgeStyles: Record<string, string> = {
  VIP: "bg-accent/20 text-accent border-accent/30",
  NEW: "bg-primary/20 text-primary border-primary/30",
  POPULAR: "bg-teal/20 text-primary border-primary/30",
};

const Services = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRequest = async () => {
    if (!name.trim() || !phone.trim() || !role || !selectedService) {
      toast({ title: "يرجى ملء جميع الحقول", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("service_requests").insert({
        name: name.trim(),
        phone: phone.trim(),
        role,
        service_name: selectedService,
      });
      if (error) throw error;
      toast({ title: "✅ تم إرسال طلبك بنجاح", description: "سنتواصل معك قريباً" });
      setDialogOpen(false);
      setName("");
      setPhone("");
      setRole("");
    } catch {
      toast({ title: "حدث خطأ", description: "يرجى المحاولة مرة أخرى", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (serviceName: string) => {
    const msg = encodeURIComponent(`أريد طلب خدمة: ${serviceName}`);
    window.open(`https://wa.me/212778133038?text=${msg}`, "_blank");
  };

  return (
    <PublicLayout>
      <div className="min-h-screen py-16" dir="rtl">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              خدماتنا
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              حلول متكاملة لتنمية أعمالك في التجارة الإلكترونية والتسويق بالعمولة
            </p>
          </div>

          {categories.map((cat) => (
            <section key={cat.title} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <cat.icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">{cat.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.services.map((svc) => (
                  <Card key={svc.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-all duration-300 group">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {svc.title}
                        </h3>
                        {svc.badge && (
                          <Badge className={`text-[10px] ${badgeStyles[svc.badge]}`}>
                            {svc.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                        {svc.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          onClick={() => { setSelectedService(svc.title); setDialogOpen(true); }}
                        >
                          اطلب الخدمة
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openWhatsApp(svc.title)}
                          title="تواصل عبر واتساب"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">طلب خدمة: {selectedService}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>الاسم الكامل</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسمك" />
            </div>
            <div>
              <Label>رقم الهاتف</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06XXXXXXXX" />
            </div>
            <div>
              <Label>الدور</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue placeholder="اختر دورك" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="affiliate">مسوق بالعمولة</SelectItem>
                  <SelectItem value="seller">مورد / بائع</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={handleRequest} disabled={loading}>
                {loading ? "جاري الإرسال..." : "إرسال الطلب"}
              </Button>
              <Button variant="outline" onClick={() => openWhatsApp(selectedService)} className="gap-2">
                <MessageCircle className="h-4 w-4" /> واتساب
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
};

export default Services;
