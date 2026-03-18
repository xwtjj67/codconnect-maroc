import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { useState, useEffect } from "react";
import { Search, Package, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import LockedFeature from "@/components/shared/LockedFeature";

interface ProductItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  sellingPrice: number | null;
  commission: number | null;
  category: string | null;
  visibility: string;
}

const categories = ["الكل", "الكترونيات", "تجميل", "ملابس", "منتجات ترند"];

const visibilityAccess: Record<string, string[]> = {
  standard: ["standard"],
  premium: ["standard", "premium"],
  vip: ["standard", "premium", "vip"],
};

const AffiliateProducts = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const userPlan = user?.plan || "standard";
  const allowedVisibility = visibilityAccess[userPlan] || ["standard"];

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("approval_status", "approved")
        .eq("is_active", true);

      setProducts(
        (data || []).map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          image: p.image,
          sellingPrice: p.selling_price ? Number(p.selling_price) : null,
          commission: p.commission ? Number(p.commission) : null,
          category: p.category,
          visibility: p.visibility,
        }))
      );
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = products
    .filter(p => activeCategory === "الكل" || p.category === activeCategory)
    .filter(p => !search || p.name.includes(search));

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

        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">لا توجد منتجات متاحة حالياً</p>
            <p className="text-sm text-muted-foreground/70">سيتم إضافة المنتجات قريباً</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => {
              const isLocked = !allowedVisibility.includes(product.visibility);
              return (
                <LockedFeature key={product.id} isLocked={isLocked} message="قم بالترقية للوصول لهذا المنتج">
                  <div className="glass-card-hover p-5 space-y-3">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                    )}
                    <h3 className="font-bold">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-semibold">
                        {product.sellingPrice ? `${product.sellingPrice} DH` : "—"}
                      </span>
                      {product.commission && (
                        <span className="gold-badge">عمولة: {product.commission} DH</span>
                      )}
                    </div>
                    {product.category && (
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-secondary/50 text-muted-foreground">
                        {product.category}
                      </span>
                    )}
                  </div>
                </LockedFeature>
              );
            })}
          </div>
        )}
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateProducts;
