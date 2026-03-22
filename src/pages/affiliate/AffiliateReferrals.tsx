import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { Copy, Users, MousePointerClick, TrendingUp, Target } from "lucide-react";
import { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import { useAuth } from "@/contexts/AuthContext";

const AffiliateReferrals = () => {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const username = user?.username || user?.id || "username";
  const referralLink = `codconnect.ma/ref/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AffiliateLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">برنامج الإحالات</h1>

        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold">رابط الإحالة ديالك</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-secondary/50 rounded-lg px-4 py-3 text-sm text-muted-foreground font-mono" dir="ltr">
              {referralLink}
            </div>
            <button onClick={handleCopy} className="px-4 py-3 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              <Copy className="h-4 w-4" />
              {copied ? "تم النسخ!" : "نسخ"}
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="النقرات" value={0} icon={<MousePointerClick className="h-6 w-6" />} tooltip="عدد النقرات على رابط الإحالة" />
          <StatCard title="التسجيلات" value={0} icon={<Users className="h-6 w-6" />} tooltip="عدد المسجلين عبر رابطك" />
          <StatCard title="المبيعات" value={0} icon={<TrendingUp className="h-6 w-6" />} tooltip="عدد المبيعات من إحالاتك" />
          <StatCard title="معدل التحويل" value={0} icon={<Target className="h-6 w-6" />} suffix="%" tooltip="نسبة التحويل من نقرة لتسجيل" />
        </div>

        <div className="glass-card p-8 text-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">لا توجد إحالات بعد</p>
          <p className="text-sm text-muted-foreground/70">شارك رابط الإحالة لبدء كسب العمولات</p>
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateReferrals;
