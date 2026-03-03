interface ProductCardProps {
  image: string;
  name: string;
  price?: string;
  commission: string;
  showActions?: boolean;
}

const ProductCard = ({ image, name, price, commission, showActions = false }: ProductCardProps) => {
  return (
    <div className="glass-card-hover overflow-hidden group">
      <div className="aspect-square bg-secondary/50 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground">{name}</h3>
        {price && <p className="text-primary font-bold text-lg">{price}</p>}
        <span className="gold-badge inline-block">{commission} عمولة</span>
        {showActions ? (
          <div className="space-y-2 pt-2">
            <button className="w-full py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              نسخ رابط البيع
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
