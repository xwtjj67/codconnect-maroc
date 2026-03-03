import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Copy, Trophy, Users, DollarSign } from "lucide-react";
import { useState } from "react";

const Referral = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "codconnect.ma/ref/username";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const leaderboard = [
    { name: "محمد ب.", referrals: 42, earnings: "1,260 DH" },
    { name: "سارة ل.", referrals: 31, earnings: "930 DH" },
    { name: "يوسف ع.", referrals: 25, earnings: "750 DH" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">برنامج الإحالة</h1>

        {/* Referral link */}
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

        {/* Stats */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl gradient-teal flex items-center justify-center text-primary-foreground">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">عدد المسجلين</p>
              <p className="text-2xl font-bold">25</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">أرباح الإحالات</p>
              <p className="text-2xl font-bold">320 DH</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            أفضل المسوقين
          </h2>
          <div className="space-y-3">
            {leaderboard.map((user, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? "bg-accent/20 text-accent" : i === 1 ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.referrals} إحالة</p>
                </div>
                <span className="gold-badge">{user.earnings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Referral;
