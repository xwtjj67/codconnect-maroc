import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const milestones = [
  { count: 0, label: "0" },
  { count: 10, label: "10" },
  { count: 20, label: "20" },
  { count: 30, label: "30" },
];

const ReferralSlider = () => {
  const { user } = useAuth();
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.getReferralCount().then(({ count }) => setReferralCount(count || 0)).catch(() => {});
  }, [user]);

  // Non-linear progress: 0→0%, 10→30%, 20→60%, 30→100%
  const getProgress = (count: number): number => {
    if (count <= 0) return 0;
    if (count >= 30) return 100;
    if (count <= 10) return (count / 10) * 30;
    if (count <= 20) return 30 + ((count - 10) / 10) * 30;
    return 60 + ((count - 20) / 10) * 40;
  };

  const progress = getProgress(referralCount);

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm">🔥 تقدم الإحالات</h3>
        <span className="text-xs text-muted-foreground">اربح عمولة على كل شخص تسجّل من رابطك</span>
      </div>
      <div className="relative">
        {/* Progress bar */}
        <div className="h-4 rounded-full bg-secondary/50 overflow-hidden relative">
          <div 
            className="h-full rounded-full gradient-teal transition-all duration-1000 ease-out relative" 
            style={{ width: `${progress}%` }}
          >
            {/* Fire emoji indicator */}
            {progress > 0 && (
              <div 
                className="absolute -top-1 -right-3 text-lg animate-bounce"
                style={{ filter: "drop-shadow(0 0 4px rgba(255,100,0,0.6))" }}
              >
                🔥
              </div>
            )}
          </div>
        </div>
        
        {/* Milestone markers */}
        <div className="flex justify-between mt-3">
          {milestones.map(m => {
            const reached = referralCount >= m.count;
            const milestonePosition = m.count === 0 ? 0 : m.count === 10 ? 30 : m.count === 20 ? 60 : 100;
            return (
              <div key={m.count} className="flex flex-col items-center" style={{ width: '25%' }}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  reached ? "gradient-teal text-primary-foreground scale-110" : "bg-secondary/70 text-muted-foreground"
                }`}>
                  {reached && m.count > 0 ? "🔥" : m.label}
                </div>
                <span className={`text-[10px] mt-1 ${reached ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReferralSlider;
