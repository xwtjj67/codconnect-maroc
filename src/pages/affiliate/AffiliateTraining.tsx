import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { PlayCircle, BookOpen, FileDown } from "lucide-react";

const trainingItems = [
  {
    icon: PlayCircle,
    title: "فيديوهات تدريبية",
    desc: "شاهد فيديوهات تعليمية حول كيفية البيع عبر نظام COD وتحقيق أقصى ربح.",
    action: "شاهد الفيديوهات",
  },
  {
    icon: BookOpen,
    title: "نصائح للبيع عبر COD",
    desc: "تعلم أفضل الاستراتيجيات لزيادة مبيعاتك وتحسين معدل التأكيد.",
    action: "اقرأ النصائح",
  },
  {
    icon: FileDown,
    title: "تحميل دليل PDF",
    desc: "حمل الدليل الكامل للمسوقين الجدد واحتفظ به كمرجع دائم.",
    action: "تحميل الدليل",
  },
];

const AffiliateTraining = () => {
  return (
    <AffiliateLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">التدريب</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainingItems.map((item, i) => (
            <div key={i} className="glass-card-hover p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl gradient-teal flex items-center justify-center text-primary-foreground">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              <button className="w-full py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateTraining;
