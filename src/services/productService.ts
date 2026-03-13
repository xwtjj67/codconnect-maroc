import { apiClient } from "./api";

export interface Product {
  id: string;
  name: string;
  price: string;
  commission: string;
  category: string;
  image: string;
  description?: string;
  merchantId?: string;
  stock?: number;
  createdAt?: string;
}

const MOCK_MODE = true;

const mockProducts: Product[] = [
  { id: "1", name: "سماعات بلوتوث لاسلكية", price: "199 DH", commission: "40 DH", category: "الكترونيات", image: "/placeholder.svg" },
  { id: "2", name: "كريم العناية بالبشرة", price: "149 DH", commission: "35 DH", category: "تجميل", image: "/placeholder.svg" },
  { id: "3", name: "حزام رياضي ذكي", price: "249 DH", commission: "50 DH", category: "الكترونيات", image: "/placeholder.svg" },
  { id: "4", name: "عطر فاخر للرجال", price: "320 DH", commission: "60 DH", category: "تجميل", image: "/placeholder.svg" },
  { id: "5", name: "تيشيرت قطني", price: "89 DH", commission: "20 DH", category: "ملابس", image: "/placeholder.svg" },
  { id: "6", name: "ساعة رقمية", price: "179 DH", commission: "45 DH", category: "منتجات ترند", image: "/placeholder.svg" },
];

export const productService = {
  async getAll(category?: string): Promise<Product[]> {
    if (MOCK_MODE) {
      if (category && category !== "الكل") return mockProducts.filter(p => p.category === category);
      return mockProducts;
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
};
