import { apiClient } from "./api";

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Order {
  id: string;
  productName: string;
  clientName: string;
  city: string;
  status: OrderStatus;
  commission: string;
  price: string;
  createdAt: string;
  affiliateId?: string;
  merchantId?: string;
}

const MOCK_MODE = true;

const mockOrders: Order[] = [
  { id: "1", productName: "سماعات بلوتوث", clientName: "أحمد", city: "الدار البيضاء", status: "confirmed", commission: "40 DH", price: "199 DH", createdAt: "2026-03-10" },
  { id: "2", productName: "كريم العناية", clientName: "فاطمة", city: "مراكش", status: "pending", commission: "35 DH", price: "149 DH", createdAt: "2026-03-11" },
  { id: "3", productName: "حزام رياضي", clientName: "يوسف", city: "الرباط", status: "delivered", commission: "50 DH", price: "249 DH", createdAt: "2026-03-12" },
  { id: "4", productName: "ساعة رقمية", clientName: "سارة", city: "طنجة", status: "confirmed", commission: "45 DH", price: "179 DH", createdAt: "2026-03-12" },
  { id: "5", productName: "عطر فاخر", clientName: "كريم", city: "فاس", status: "cancelled", commission: "0 DH", price: "320 DH", createdAt: "2026-03-09" },
];

export const orderService = {
  async getAll(): Promise<Order[]> {
    if (MOCK_MODE) return mockOrders;
    return apiClient.get<Order[]>("/orders");
  },

  async getAffiliateOrders(): Promise<Order[]> {
    if (MOCK_MODE) return mockOrders;
    return apiClient.get<Order[]>("/orders/affiliate");
  },

  async getMerchantOrders(): Promise<Order[]> {
    if (MOCK_MODE) return mockOrders;
    return apiClient.get<Order[]>("/orders/merchant");
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    if (MOCK_MODE) {
      const order = mockOrders.find(o => o.id === id);
      if (!order) throw new Error("Order not found");
      return { ...order, status };
    }
    return apiClient.put<Order>(`/orders/${id}/status`, { status });
  },

  async getStats(): Promise<{ totalOrders: number; confirmed: number; delivered: number; pending: number; totalCommission: string; totalRevenue: string }> {
    if (MOCK_MODE) {
      return {
        totalOrders: mockOrders.length,
        confirmed: mockOrders.filter(o => o.status === "confirmed").length,
        delivered: mockOrders.filter(o => o.status === "delivered").length,
        pending: mockOrders.filter(o => o.status === "pending").length,
        totalCommission: "170 DH",
        totalRevenue: "1,096 DH",
      };
    }
    return apiClient.get("/orders/stats");
  },
};
