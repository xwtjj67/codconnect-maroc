import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import ProductCard from "@/components/shared/ProductCard";
import { useState } from "react";

const categories = ["الكل", "الكترونيات", "تجميل", "ملابس", "منتجات ترند"];

const products = [
  { image: "/placeholder.svg", name: "سماعات بلوتوث لاسلكية", price: "199 DH", commission: "40 DH", category: "الكترونيات" },
  { image: "/placeholder.svg", name: "كريم العناية بالبشرة", price: "149 DH", commission: "35 DH", category: "تجميل" },
  { image: "/placeholder.svg", name: "حزام رياضي ذكي", price: "249 DH", commission: "50 DH", category: "الكترونيات" },
  { image: "/placeholder.svg", name: "عطر فاخر للرجال", price: "320 DH", commission: "60 DH", category: "تجميل" },
  { image: "/placeholder.svg", name: "تيشيرت قطني", price: "89 DH", commission: "20 DH", category: "ملابس" },
  { image: "/placeholder.svg", name: "ساعة رقمية", price: "179 DH", commission: "45 DH", category: "منتجات ترند" },
];

const AffiliateProducts = () => {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const filtered = activeCategory === "الكل" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <AffiliateLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">منتجات متاحة للبيع</h1>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <ProductCard key={i} {...p} showActions />
          ))}
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateProducts;
