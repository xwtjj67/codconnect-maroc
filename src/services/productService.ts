import { apiClient } from "./api";
import type { Product } from "@/types/models";

const MOCK_MODE = true;

const mockProducts: Product[] = [
  { id: "1", name: "سماعات بلوتوث لاسلكية", price: 199, commission: 40, category: "الكترونيات", image: "/placeholder.svg", merchantId: "m1", merchantName: "متجر التقنية", merchantPlan: "vip", stock: 50, views: 1240, clicks: 380, orders: 45, conversionRate: 11.8, isActive: true, createdAt: "2026-01-15" },
  { id: "2", name: "كريم العناية بالبشرة", price: 149, commission: 35, category: "تجميل", image: "/placeholder.svg", merchantId: "m2", merchantName: "متجر الجمال", merchantPlan: "premium", stock: 120, views: 890, clicks: 210, orders: 32, conversionRate: 15.2, isActive: true, createdAt: "2026-02-01" },
  { id: "3", name: "حزام رياضي ذكي", price: 249, commission: 50, category: "الكترونيات", image: "/placeholder.svg", merchantId: "m1", merchantName: "متجر التقنية", merchantPlan: "vip", stock: 30, views: 670, clicks: 150, orders: 18, conversionRate: 12.0, isActive: true, createdAt: "2026-02-10" },
  { id: "4", name: "عطر فاخر للرجال", price: 320, commission: 60, category: "تجميل", image: "/placeholder.svg", merchantId: "m3", merchantName: "عطور المغرب", merchantPlan: "standard", stock: 80, views: 450, clicks: 120, orders: 12, conversionRate: 10.0, isActive: true, createdAt: "2026-02-20" },
  { id: "5", name: "تيشيرت قطني", price: 89, commission: 20, category: "ملابس", image: "/placeholder.svg", merchantId: "m4", merchantName: "ملابس الأناقة", merchantPlan: "premium", stock: 200, views: 320, clicks: 80, orders: 8, conversionRate: 10.0, isActive: true, createdAt: "2026-03-01" },
  { id: "6", name: "ساعة رقمية", price: 179, commission: 45, category: "منتجات ترند", image: "/placeholder.svg", merchantId: "m1", merchantName: "متجر التقنية", merchantPlan: "vip", stock: 65, views: 980, clicks: 290, orders: 38, conversionRate: 13.1, isActive: true, createdAt: "2026-03-05" },
];

const planPriority = { vip: 0, premium: 1, standard: 2 };

export const productService = {
  async getAll(category?: string): Promise<Product[]> {
    if (MOCK_MODE) {
      let products = [...mockProducts];
      if (category && category !== "الكل") products = products.filter(p => p.category === category);
      return products.sort((a, b) => (planPriority[a.merchantPlan || "standard"] - planPriority[b.merchantPlan || "standard"]));
    }
    const query = category && category !== "الكل" ? `?category=${encodeURIComponent(category)}` : "";
    return apiClient.get<Product[]>(`/products${query}`);
  },

  async getById(id: string): Promise<Product> {
    if (MOCK_MODE) {
      const p = mockProducts.find(p => p.id === id);
      if (!p) throw new Error("Product not found");
      return p;
    }
    return apiClient.get<Product>(`/products/${id}`);
  },

  async create(data: Omit<Product, "id">): Promise<Product> {
    if (MOCK_MODE) return { ...data, id: crypto.randomUUID() };
    return apiClient.post<Product>("/products", data);
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    if (MOCK_MODE) return { ...mockProducts[0], ...data, id };
    return apiClient.put<Product>(`/products/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (MOCK_MODE) return;
    return apiClient.delete(`/products/${id}`);
  },

  async getMerchantProducts(): Promise<Product[]> {
    if (MOCK_MODE) return mockProducts.slice(0, 3);
    return apiClient.get<Product[]>("/products/merchant");
  },

  async getMarketplace(): Promise<Product[]> {
    if (MOCK_MODE) {
      return [...mockProducts]
        .filter(p => p.isActive)
        .sort((a, b) => planPriority[a.merchantPlan || "standard"] - planPriority[b.merchantPlan || "standard"]);
    }
    return apiClient.get<Product[]>("/products/marketplace");
  },
};
