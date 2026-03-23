import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const milestones = [{ count: 3, label: "3" }, { count: 10, label: "10" }, { count: 30, label: "30" }];

const ReferralSlider = () => {
  const { user } = useAuth();
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.getReferralCount().then(({ count }) => setReferralCount(count || 0)).catch(() => {});
  }, [user]);

  const maxMilestone = milestones[milestones.length - 1].count;
  const progress = Math.min((referralCount / maxMilestone) * 100, 100);

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between"><h3 className="font-bold text-sm">🔥 تقدم الإحالات</h3><span className="text-xs text-muted-foreground">اربح عمولة على كل شخص تسجّل من رابطك</span></div>
      <div className="relative">
        <div className="h-3 rounded-full bg-secondary/50 overflow-hidden"><div className="h-full rounded-full gradient-teal transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} /></div>
        <div className="flex justify-between mt-2">{milestones.map(m => { const reached = referralCount >= m.count; return (<div key={m.count} className="flex flex-col items-center"><div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${reached ? "gradient-teal text-primary-foreground" : "bg-secondary/70 text-muted-foreground"}`}>{reached ? "🔥" : m.label}</div><span className={`text-[10px] mt-1 ${reached ? "text-primary font-bold" : "text-muted-foreground"}`}>{m.label}</span></div>); })}</div>
      </div>
    </div>
  );
};

export default ReferralSlider;
