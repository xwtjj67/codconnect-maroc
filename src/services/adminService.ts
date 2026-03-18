import { apiClient } from "./api";
import type { User } from "@/types/auth";
import type { PlatformStats } from "@/types/models";

export const adminService = {
  async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>("/admin/users");
  },

  async toggleUserStatus(userId: string): Promise<void> {
    return apiClient.put(`/admin/users/${userId}/toggle`);
  },

  async getPlatformStats(): Promise<PlatformStats> {
    return apiClient.get<PlatformStats>("/admin/stats");
  },

  async getRevenueChart() {
    return apiClient.get("/admin/analytics/revenue");
  },
};
