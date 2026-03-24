import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { useState, useEffect } from "react";
import { Search, Package, PlayCircle, Download, Lock } from "lucide-react";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import ImageGallery from "@/components/shared/ImageGallery";
import SecureVideoPlayer from "@/components/shared/SecureVideoPlayer";

interface ProductItem { id: string; name: string; description: string | null; image: string | null; images: string[]; videoUrl: string | null; sellingPrice: number | null; commission: number | null; category: string | null; visibility: string; }

const planLimits: Record<string, number> = { standard: 5, premium: 10, vip: -1 };
const planLabels: Record<string, string> = { standard: "Standard", premium: "Premium", vip: "VIP" };

const AffiliateProducts = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const userPlan = user?.plan || "standard";
  const maxVisible = planLimits[userPlan] || 5;

  useEffect(() => {
    if (!user) return;
    api.getApprovedProducts().then(({ products: data }) => {
      const mapped = data.map((p: any) => {
        const mediaImages = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
        const coverImage = p.image || p.thumbnail || mediaImages[0] || null;
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          image: coverImage,
          images: mediaImages.length > 0 ? mediaImages : (coverImage ? [coverImage] : []),
          videoUrl: p.video_url || null,
          sellingPrice: p.selling_price ? Number(p.selling_price) : null,
          commission: p.commission ? Number(p.commission) : null,
          category: p.category,
          visibility: p.visibility,
        };
      });
      
      // Smart distribution: use user ID hash to deterministically assign unique products
      const userId = user.id;
      const userHash = hashString(userId);
      
      if (maxVisible === -1) {
        // VIP gets all
        setProducts(mapped);
      } else {
        // Distribute unique products based on user hash
        const distributed = distributeProducts(mapped, userHash, maxVisible);
        setProducts(distributed);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const filtered = products.filter(p => !search || p.name.includes(search));

  return (
    <AffiliateLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">سوق المنتجات</h1>
            <p className="text-sm text-muted-foreground">باقتك: <span className="font-medium text-primary">{planLabels[userPlan]}</span> — {maxVisible === -1 ? "وصول كامل" : `${maxVisible} منتجات متاحة`}</p>
          </div>
          <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><input type="text" placeholder="ابحث عن منتج..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 pr-10 pl-4 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 w-56 transition-all" /></div>
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
            <div className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between"><h2 className="font-bold text-lg">{selectedProduct.name}</h2><button onClick={() => setSelectedProduct(null)} className="text-muted-foreground hover:text-foreground">✕</button></div>
              {selectedProduct.images.length > 0 && <ImageGallery images={selectedProduct.images} alt={selectedProduct.name} />}
              {selectedProduct.videoUrl && <div className="space-y-2"><h3 className="text-sm font-medium flex items-center gap-2"><PlayCircle className="h-4 w-4" /> فيديو المنتج</h3><SecureVideoPlayer url={selectedProduct.videoUrl} title={selectedProduct.name} /></div>}
              {selectedProduct.description && <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>}
              <div className="flex items-center justify-between text-sm"><span className="font-semibold">{selectedProduct.sellingPrice ? `${selectedProduct.sellingPrice} DH` : "—"}</span>{selectedProduct.commission && <span className="gold-badge">عمولة: {selectedProduct.commission} DH</span>}</div>
              {selectedProduct.images.length > 0 && <button onClick={async () => { for (const img of selectedProduct.images) { try { const res = await fetch(img); const blob = await res.blob(); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${selectedProduct.name}.jpg`; a.click(); URL.revokeObjectURL(url); } catch { window.open(img, "_blank"); } } }} className="w-full py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"><Download className="h-4 w-4" />تحميل الصور ({selectedProduct.images.length})</button>}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="glass-card overflow-hidden animate-pulse"><div className="aspect-square bg-secondary/50" /><div className="p-4 space-y-3"><div className="h-5 w-3/4 bg-secondary/50 rounded" /><div className="h-4 w-1/2 bg-secondary/50 rounded" /></div></div>))}</div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3"><div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto"><Package className="h-8 w-8 text-muted-foreground" /></div><p className="text-lg font-medium text-muted-foreground">لا توجد منتجات متاحة حالياً</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(product => (
              <div key={product.id} className="glass-card-hover overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <div className="aspect-square bg-secondary/50 overflow-hidden relative">
                  {product.image ? <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="h-12 w-12 text-muted-foreground/30" /></div>}
                  {product.videoUrl && <div className="absolute top-2 left-2 h-7 w-7 rounded-full bg-background/80 flex items-center justify-center"><PlayCircle className="h-4 w-4 text-primary" /></div>}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold truncate">{product.name}</h3>
                  <div className="flex items-center justify-between text-sm"><span className="text-foreground font-semibold">{product.sellingPrice ? `${product.sellingPrice} DH` : "—"}</span>{product.commission && <span className="gold-badge">عمولة: {product.commission} DH</span>}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AffiliateLayout>
  );
};

// Simple hash function for deterministic distribution
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Distribute products uniquely per affiliate based on their hash
function distributeProducts(allProducts: ProductItem[], userHash: number, limit: number): ProductItem[] {
  if (allProducts.length <= limit) return allProducts;
  
  // Create a deterministic offset based on user hash
  const offset = userHash % allProducts.length;
  const result: ProductItem[] = [];
  
  for (let i = 0; i < Math.min(limit, allProducts.length); i++) {
    const index = (offset + i) % allProducts.length;
    result.push(allProducts[index]);
  }
  
  return result;
}

export default AffiliateProducts;
