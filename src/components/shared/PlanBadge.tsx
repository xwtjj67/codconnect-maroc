import { Badge } from "@/components/ui/badge";
import type { PlanType } from "@/types/auth";
import { Crown, Star, Zap } from "lucide-react";

const planConfig: Record<PlanType, { label: string; icon: typeof Crown; className: string }> = {
  vip: { label: "VIP", icon: Crown, className: "bg-accent/20 text-accent border-accent/30" },
  premium: { label: "Premium", icon: Star, className: "bg-primary/20 text-primary border-primary/30" },
  standard: { label: "Standard", icon: Zap, className: "bg-muted text-muted-foreground border-border" },
};

const PlanBadge = ({ plan }: { plan: PlanType }) => {
  const config = planConfig[plan];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

export default PlanBadge;
