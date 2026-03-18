import { apiClient } from "./api";
import type { LeaderboardEntry, PayoutRecord } from "@/types/models";

export const affiliateService = {
  async getReferralStats() {
    return apiClient.get("/affiliate/referrals/stats");
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return apiClient.get<LeaderboardEntry[]>("/affiliate/referrals/leaderboard");
  },

  async getPayouts(): Promise<PayoutRecord[]> {
    return apiClient.get<PayoutRecord[]>("/affiliate/payouts");
  },

  async getDashboardStats() {
    return apiClient.get("/affiliate/dashboard/stats");
  },

  async getMerchantDashboardStats() {
    return apiClient.get("/merchant/dashboard/stats");
  },
};
