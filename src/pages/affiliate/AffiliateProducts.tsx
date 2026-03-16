import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import ProductCard from "@/components/shared/ProductCard";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const categories = ["الكل", "الكترونيات", "تجميل", "ملابس", "منتجات ترند"];

const products = [
  { image: "/placeholder.svg", name: "سماعات بلوتوث لاسلكية", price: 199, commission: 40, category: "الكترونيات", merchantName: "متجر التقنية", merchantPlan: "vip" as const, views: 1240, orders: 45, conversionRate: 11.8 },
  { image: "/placeholder.svg", name: "كريم العناية بالبشرة", price: 149, commission: 35, category: "تجميل", merchantName: "متجر الجمال", merchantPlan: "premium" as const, views: 890, orders: 32, conversionRate: 15.2 },
  { image: "/placeholder.svg", name: "حزام رياضي ذكي", price: 249, commission: 50, category: "الكترونيات", merchantName: "متجر التقنية", merchantPlan: "vip" as const, views: 670, orders: 18, conversionRate: 12.0 },
  { image: "/placeholder.svg", name: "عطر فاخر للرجال", price: 320, commission: 60, category: "تجميل", merchantName: "عطور المغرب", merchantPlan: "standard" as const, views: 450, orders: 12, conversionRate: 10.0 },
  { image: "/placeholder.svg", name: "تيشيرت قطني", price: 89, commission: 20, category: "ملابس", merchantName: "ملابس الأناقة", merchantPlan: "premium" as const, views: 320, orders: 8, conversionRate: 10.0 },
  { image: "/placeholder.svg", name: "ساعة رقمية", price: 179, commission: 45, category: "منتجات ترند", merchantName: "متجر التقنية", merchantPlan: "vip" as const, views: 980, orders: 38, conversionRate: 13.1 },
];

const planPriority = { vip: 0, premium: 1, standard: 2 };

const AffiliateProducts = () => {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [search, setSearch] = useState("");

  const filtered = products
    .filter(p => activeCategory === "الكل" || p.category === activeCategory)
    .filter(p => !search || p.name.includes(search))
    .sort((a, b) => planPriority[a.merchantPlan] - planPriority[b.merchantPlan]);

  return (
    <AffiliateLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">سوق المنتجات</h1>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pr-10 pl-4 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 w-56 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                activeCategory === cat
                  ? "gradient-teal text-primary-foreground font-medium"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          المنتجات مرتبة حسب خطة التاجر: VIP أولاً، ثم Premium، ثم Standard
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <ProductCard key={i} {...p} showActions />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>لا توجد منتجات مطابقة للبحث</p>
          </div>
        )}
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateProducts;
