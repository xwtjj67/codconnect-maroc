import { apiClient } from "./api";
import type { User } from "@/types/auth";
import type { PlatformStats } from "@/types/models";

const MOCK_MODE = true;

const mockUsers: User[] = [
  { id: "a1", name: "محمد ب.", email: "m@test.ma", phone: "0611111111", city: "الدار البيضاء", whatsapp: "0611111111", role: "affiliate", plan: "vip", token: "", isActive: true, createdAt: "2026-01-10" },
  { id: "a2", name: "سارة ل.", email: "s@test.ma", phone: "0622222222", city: "مراكش", whatsapp: "0622222222", role: "affiliate", plan: "premium", token: "", isActive: true, createdAt: "2026-01-15" },
  { id: "a3", name: "يوسف ع.", email: "y@test.ma", phone: "0633333333", city: "الرباط", whatsapp: "0633333333", role: "affiliate", plan: "standard", token: "", isActive: true, createdAt: "2026-02-01" },
  { id: "m1", name: "متجر التقنية", email: "tech@test.ma", phone: "0711111111", city: "الدار البيضاء", whatsapp: "0711111111", role: "merchant", plan: "vip", storeName: "متجر التقنية", token: "", isActive: true, createdAt: "2026-01-05" },
  { id: "m2", name: "متجر الجمال", email: "beauty@test.ma", phone: "0722222222", city: "مراكش", whatsapp: "0722222222", role: "merchant", plan: "premium", storeName: "متجر الجمال", token: "", isActive: true, createdAt: "2026-01-20" },
  { id: "m3", name: "عطور المغرب", email: "perfume@test.ma", phone: "0733333333", city: "فاس", whatsapp: "0733333333", role: "merchant", plan: "standard", storeName: "عطور المغرب", token: "", isActive: false, createdAt: "2026-02-15" },
];

export const adminService = {
  async getUsers(): Promise<User[]> {
    if (MOCK_MODE) return mockUsers;
    return apiClient.get<User[]>("/admin/users");
  },

  async toggleUserStatus(userId: string): Promise<void> {
    if (MOCK_MODE) return;
    return apiClient.put(`/admin/users/${userId}/toggle`);
  },

  async getPlatformStats(): Promise<PlatformStats> {
    if (MOCK_MODE) {
      return {
        totalUsers: 145,
        totalAffiliates: 120,
        totalMerchants: 25,
        totalProducts: 48,
        totalOrders: 340,
        totalRevenue: 52400,
        totalCommissions: 8960,
        monthlyGrowth: 18.5,
      };
    }
    return apiClient.get<PlatformStats>("/admin/stats");
  },

  async getRevenueChart() {
    if (MOCK_MODE) {
      return [
        { month: "يناير", revenue: 4200, commissions: 720, orders: 28 },
        { month: "فبراير", revenue: 5800, commissions: 990, orders: 38 },
        { month: "مارس", revenue: 7200, commissions: 1230, orders: 48 },
        { month: "أبريل", revenue: 8400, commissions: 1440, orders: 56 },
        { month: "ماي", revenue: 12800, commissions: 2190, orders: 85 },
        { month: "يونيو", revenue: 14000, commissions: 2390, orders: 93 },
      ];
    }
    return apiClient.get("/admin/analytics/revenue");
  },
};
