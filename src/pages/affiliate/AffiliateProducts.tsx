import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { useState } from "react";
import { Search, Package } from "lucide-react";

const categories = ["الكل", "الكترونيات", "تجميل", "ملابس", "منتجات ترند"];

const AffiliateProducts = () => {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [search, setSearch] = useState("");

  // Empty — products will come from API
  const products: any[] = [];

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

        {products.length === 0 && (
          <div className="glass-card p-12 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">لا توجد منتجات متاحة حالياً</p>
            <p className="text-sm text-muted-foreground/70">سيتم إضافة المنتجات قريباً</p>
          </div>
        )}
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateProducts;
