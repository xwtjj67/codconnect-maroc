import { Skeleton } from "@/components/ui/skeleton";

export const StatCardSkeleton = () => (
  <div className="glass-card p-5 flex items-center gap-4">
    <Skeleton className="h-12 w-12 rounded-xl" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-7 w-16" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="glass-card overflow-hidden">
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card p-6 space-y-4">
    <Skeleton className="h-5 w-40" />
    <div className="h-64 flex items-end gap-2 pt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="flex-1 rounded-t-md" style={{ height: `${30 + Math.random() * 60}%` }} />
      ))}
    </div>
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="glass-card overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);
