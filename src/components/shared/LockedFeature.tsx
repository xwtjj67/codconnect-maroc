import { Lock, TrendingUp } from "lucide-react";

interface LockedFeatureProps {
  children: React.ReactNode;
  isLocked: boolean;
  message?: string;
}

const LockedFeature = ({ children, isLocked, message = "قم بالترقية للوصول" }: LockedFeatureProps) => {
  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-xl">
        <div className="glass-card p-6 text-center space-y-3 max-w-xs">
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6 text-accent" />
          </div>
          <p className="font-semibold text-foreground">🔒 {message}</p>
          <button className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
            <TrendingUp className="h-4 w-4" />
            ترقية الخطة
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockedFeature;
