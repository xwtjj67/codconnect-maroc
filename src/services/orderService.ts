import { apiClient } from "./api";
import type { Order } from "@/types/models";
import type { OrderStatus } from "@/types/auth";

const MOCK_MODE = true;

const mockOrders: Order[] = [
  { id: "1", productId: "1", productName: "سماعات بلوتوث", clientName: "أحمد", clientPhone: "0611111111", city: "الدار البيضاء", status: "confirmed", commission: 40, price: 199, affiliateId: "a1", affiliateName: "محمد ب.", merchantId: "m1", createdAt: "2026-03-10", updatedAt: "2026-03-10" },
  { id: "2", productId: "2", productName: "كريم العناية", clientName: "فاطمة", clientPhone: "0622222222", city: "مراكش", status: "pending", commission: 35, price: 149, affiliateId: "a2", affiliateName: "سارة ل.", merchantId: "m2", createdAt: "2026-03-11", updatedAt: "2026-03-11" },
  { id: "3", productId: "3", productName: "حزام رياضي", clientName: "يوسف", clientPhone: "0633333333", city: "الرباط", status: "delivered", commission: 50, price: 249, affiliateId: "a1", affiliateName: "محمد ب.", merchantId: "m1", createdAt: "2026-03-12", updatedAt: "2026-03-13" },
  { id: "4", productId: "6", productName: "ساعة رقمية", clientName: "سارة", clientPhone: "0644444444", city: "طنجة", status: "shipped", commission: 45, price: 179, affiliateId: "a3", affiliateName: "يوسف ع.", merchantId: "m1", createdAt: "2026-03-12", updatedAt: "2026-03-14" },
  { id: "5", productId: "4", productName: "عطر فاخر", clientName: "كريم", clientPhone: "0655555555", city: "فاس", status: "cancelled", commission: 0, price: 320, affiliateId: "a2", affiliateName: "سارة ل.", merchantId: "m3", createdAt: "2026-03-09", updatedAt: "2026-03-10" },
  { id: "6", productId: "1", productName: "سماعات بلوتوث", clientName: "نور", clientPhone: "0666666666", city: "أكادير", status: "confirmed", commission: 40, price: 199, affiliateId: "a1", affiliateName: "محمد ب.", merchantId: "m1", createdAt: "2026-03-14", updatedAt: "2026-03-14" },
  { id: "7", productId: "2", productName: "كريم العناية", clientName: "هدى", clientPhone: "0677777777", city: "وجدة", status: "delivered", commission: 35, price: 149, affiliateId: "a3", affiliateName: "يوسف ع.", merchantId: "m2", createdAt: "2026-03-08", updatedAt: "2026-03-11" },
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
      return { ...order, status, updatedAt: new Date().toISOString() };
    }
    return apiClient.put<Order>(`/orders/${id}/status`, { status });
  },

  async getStats() {
    if (MOCK_MODE) {
      const confirmed = mockOrders.filter(o => o.status === "confirmed").length;
      const delivered = mockOrders.filter(o => o.status === "delivered").length;
      const totalRevenue = mockOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.price, 0);
      const totalCommission = mockOrders.filter(o => o.status === "confirmed" || o.status === "delivered").reduce((s, o) => s + o.commission, 0);
      return {
        totalOrders: mockOrders.length,
        confirmed,
        delivered,
        shipped: mockOrders.filter(o => o.status === "shipped").length,
        pending: mockOrders.filter(o => o.status === "pending").length,
        totalCommission,
        totalRevenue,
      };
    }
    return apiClient.get("/orders/stats");
  },
};
