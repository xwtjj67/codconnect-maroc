import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { useState, useEffect } from "react";
import { Search, Package, PlayCircle, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import LockedFeature from "@/components/shared/LockedFeature";
import ImageGallery from "@/components/shared/ImageGallery";
import SecureVideoPlayer from "@/components/shared/SecureVideoPlayer";

interface ProductItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  images: string[];
  videoUrl: string | null;
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
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

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
          images: (p as any).images || (p.image ? [p.image] : []),
          videoUrl: (p as any).video_url || null,
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

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
            <div className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">{selectedProduct.name}</h2>
                <button onClick={() => setSelectedProduct(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>

              {selectedProduct.images.length > 0 && (
                <ImageGallery images={selectedProduct.images} alt={selectedProduct.name} />
              )}

              {selectedProduct.videoUrl && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <PlayCircle className="h-4 w-4" /> فيديو المنتج
                  </h3>
                  <SecureVideoPlayer url={selectedProduct.videoUrl} title={selectedProduct.name} />
                </div>
              )}

              {selectedProduct.description && (
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">
                  {selectedProduct.sellingPrice ? `${selectedProduct.sellingPrice} DH` : "—"}
                </span>
                {selectedProduct.commission && (
                  <span className="gold-badge">عمولة: {selectedProduct.commission} DH</span>
                )}
              </div>

              {selectedProduct.images.length > 0 && (
                <button
                  onClick={async () => {
                    for (let i = 0; i < selectedProduct.images.length; i++) {
                      try {
                        const res = await fetch(selectedProduct.images[i]);
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${selectedProduct.name}-${i + 1}.jpg`;
                        a.click();
                        URL.revokeObjectURL(url);
                      } catch {
                        window.open(selectedProduct.images[i], "_blank");
                      }
                    }
                  }}
                  className="w-full py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  تحميل الصور ({selectedProduct.images.length})
                </button>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card overflow-hidden animate-pulse">
                <div className="aspect-square bg-secondary/50" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-secondary/50 rounded" />
                  <div className="h-4 w-1/2 bg-secondary/50 rounded" />
                  <div className="h-4 w-1/3 bg-secondary/50 rounded" />
                </div>
              </div>
            ))}
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
                  <div
                    className="glass-card-hover overflow-hidden cursor-pointer"
                    onClick={() => !isLocked && setSelectedProduct(product)}
                  >
                    <div className="aspect-square bg-secondary/50 overflow-hidden relative">
                      {product.image ? (
                        <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      {product.videoUrl && (
                        <div className="absolute top-2 left-2 h-7 w-7 rounded-full bg-background/80 flex items-center justify-center">
                          <PlayCircle className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      {product.images.length > 1 && (
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-background/80 text-foreground">
                          {product.images.length} صور
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold truncate">{product.name}</h3>
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
