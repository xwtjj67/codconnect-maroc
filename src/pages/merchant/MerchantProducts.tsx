import MerchantLayout from "@/components/layouts/MerchantLayout";
import { useState } from "react";
import { Plus, Lock, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SELLER_PLANS } from "@/types/auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const MerchantProducts = () => {
  const { user } = useAuth();
  const plan = user?.sellerPlan ? SELLER_PLANS[user.sellerPlan] : SELLER_PLANS.basic;
  // Empty — products will come from API
  const products: any[] = [];
  const canAdd = products.length < plan.maxProducts;

  return (
    <MerchantLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">منتجاتي</h1>
            <p className="text-sm text-muted-foreground">
              {products.length} / {plan.maxProducts} منتجات
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled={!canAdd}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity ${
                  canAdd ? "gradient-teal text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {canAdd ? <Plus className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                إضافة منتج
              </button>
            </TooltipTrigger>
            {!canAdd && (
              <TooltipContent><p>وصلت للحد الأقصى. قم بترقية باقتك لإضافة المزيد</p></TooltipContent>
            )}
          </Tooltip>
        </div>

        <div className="glass-card p-12 text-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">لا توجد منتجات بعد</p>
          <p className="text-sm text-muted-foreground/70">أضف منتجك الأول وحدد سعر التكلفة</p>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default MerchantProducts;
