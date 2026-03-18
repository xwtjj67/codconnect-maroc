import { apiClient } from "./api";
import type { User, UserStatus } from "@/types/auth";
import type { PlatformStats } from "@/types/models";

export const adminService = {
  async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>("/admin/users");
  },

  async updateUserStatus(userId: string, status: UserStatus): Promise<void> {
    return apiClient.put(`/admin/users/${userId}/status`, { status });
  },

  async toggleUserStatus(userId: string): Promise<void> {
    return apiClient.put(`/admin/users/${userId}/toggle`);
  },

  async approveUser(userId: string): Promise<void> {
    return apiClient.put(`/admin/users/${userId}/status`, { status: "active" });
  },

  async suspendUser(userId: string): Promise<void> {
    return apiClient.put(`/admin/users/${userId}/status`, { status: "suspended" });
  },

  async getPlatformStats(): Promise<PlatformStats> {
    return apiClient.get<PlatformStats>("/admin/stats");
  },

  async getRevenueChart() {
    return apiClient.get("/admin/analytics/revenue");
  },
};
