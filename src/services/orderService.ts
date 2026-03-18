import { apiClient } from "./api";
import type { Order } from "@/types/models";
import type { OrderStatus } from "@/types/auth";

export const orderService = {
  async getAll(): Promise<Order[]> {
    return apiClient.get<Order[]>("/orders");
  },

  async getAffiliateOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>("/orders/affiliate");
  },

  async getMerchantOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>("/orders/merchant");
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return apiClient.put<Order>(`/orders/${id}/status`, { status });
  },

  async getStats() {
    return apiClient.get("/orders/stats");
  },
};
