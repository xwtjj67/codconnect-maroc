import { apiClient } from "./api";
import type { Product } from "@/types/models";

export const productService = {
  async getAll(category?: string): Promise<Product[]> {
    const query = category && category !== "الكل" ? `?category=${encodeURIComponent(category)}` : "";
    return apiClient.get<Product[]>(`/products${query}`);
  },

  async getById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async create(data: Omit<Product, "id">): Promise<Product> {
    return apiClient.post<Product>("/products", data);
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/products/${id}`);
  },

  async getMerchantProducts(): Promise<Product[]> {
    return apiClient.get<Product[]>("/products/merchant");
  },

  async getMarketplace(): Promise<Product[]> {
    return apiClient.get<Product[]>("/products/marketplace");
  },
};
