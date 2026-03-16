import { Copy, Eye, ShoppingCart, TrendingUp } from "lucide-react";
import PlanBadge from "./PlanBadge";
import type { PlanType } from "@/types/auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface ProductCardProps {
  image: string;
  name: string;
  price?: number | string;
  commission: number | string;
  showActions?: boolean;
  merchantName?: string;
  merchantPlan?: PlanType;
  views?: number;
  orders?: number;
  conversionRate?: number;
}

const ProductCard = ({ image, name, price, commission, showActions = false, merchantName, merchantPlan, views, orders, conversionRate }: ProductCardProps) => {
  const [copied, setCopied] = useState(false);
  const commissionDisplay = typeof commission === "number" ? `${commission} DH` : commission;
  const priceDisplay = typeof price === "number" ? `${price} DH` : price;

  const handleCopy = () => {
    navigator.clipboard.writeText(`codconnect.ma/p/${name.replace(/\s/g, "-")}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="glass-card-hover overflow-hidden group">
      <div className="aspect-square bg-secondary/50 overflow-hidden relative">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {merchantPlan && (
          <div className="absolute top-2 right-2">
            <PlanBadge plan={merchantPlan} />
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground truncate">{name}</h3>
        {merchantName && <p className="text-xs text-muted-foreground">{merchantName}</p>}
        {priceDisplay && <p className="text-primary font-bold text-lg">{priceDisplay}</p>}
        <span className="gold-badge inline-block">{commissionDisplay} عمولة</span>

        {(views !== undefined || orders !== undefined) && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
            {views !== undefined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {views}</span>
                </TooltipTrigger>
                <TooltipContent><p>مشاهدات</p></TooltipContent>
              </Tooltip>
            )}
            {orders !== undefined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" /> {orders}</span>
                </TooltipTrigger>
                <TooltipContent><p>طلبات</p></TooltipContent>
              </Tooltip>
            )}
            {conversionRate !== undefined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {conversionRate}%</span>
                </TooltipTrigger>
                <TooltipContent><p>معدل التحويل</p></TooltipContent>
              </Tooltip>
            )}
          </div>
        )}

        {showActions ? (
          <div className="space-y-2 pt-2">
            <button onClick={handleCopy} className="w-full py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Copy className="h-3.5 w-3.5" />
              {copied ? "تم النسخ!" : "نسخ رابط البيع"}
            </button>
            <button className="w-full py-2 rounded-lg border border-border text-muted-foreground text-sm hover:bg-secondary transition-colors">
              تحميل الصور
            </button>
          </div>
        ) : (
          <button className="w-full py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
            عرض المنتج
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
