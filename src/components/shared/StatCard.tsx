import { useEffect, useState, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  tooltip?: string;
  trend?: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: string | number; prefix?: string; suffix?: string }) => {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (typeof value === "number" && typeof prevRef.current === "number") {
      const start = prevRef.current as number;
      const end = value;
      const duration = 600;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(start + (end - start) * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    } else {
      setDisplay(value);
    }
    prevRef.current = value;
  }, [value]);

  return <span>{prefix}{typeof display === "number" ? display.toLocaleString() : display}{suffix}</span>;
};

const StatCard = ({ title, value, icon, tooltip, trend, prefix, suffix }: StatCardProps) => {
  return (
    <div className="glass-card-hover p-5 flex items-center gap-4 group">
      <div className="h-12 w-12 rounded-xl gradient-teal flex items-center justify-center text-primary-foreground shrink-0 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-muted-foreground text-sm truncate">{title}</p>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        </p>
        {trend !== undefined && (
          <p className={`text-xs font-medium ${trend >= 0 ? "text-green-400" : "text-destructive"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
