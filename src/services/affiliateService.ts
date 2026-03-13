import { apiClient } from "./api";

export interface ReferralStats {
  referralLink: string;
  totalSignups: number;
  totalEarnings: string;
}

export interface LeaderboardEntry {
  name: string;
  referrals: number;
  earnings: string;
}

const MOCK_MODE = true;

export const affiliateService = {
  async getReferralStats(): Promise<ReferralStats> {
    if (MOCK_MODE) {
      return { referralLink: "codconnect.ma/ref/username", totalSignups: 25, totalEarnings: "320 DH" };
    }
    return apiClient.get<ReferralStats>("/affiliate/referrals/stats");
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (MOCK_MODE) {
      return [
        { name: "محمد ب.", referrals: 42, earnings: "1,260 DH" },
        { name: "سارة ل.", referrals: 31, earnings: "930 DH" },
        { name: "يوسف ع.", referrals: 25, earnings: "750 DH" },
      ];
    }
    return apiClient.get<LeaderboardEntry[]>("/affiliate/referrals/leaderboard");
  },

  async getDashboardStats(): Promise<{ earnings: string; orders: number; sales: number; referrals: number }> {
    if (MOCK_MODE) {
      return { earnings: "170 DH", orders: 5, sales: 3, referrals: 25 };
    }
    return apiClient.get("/affiliate/dashboard/stats");
  },

  async getMerchantDashboardStats(): Promise<{ revenue: string; orders: number; products: number; affiliates: number }> {
    if (MOCK_MODE) {
      return { revenue: "1,096 DH", orders: 5, products: 6, affiliates: 12 };
    }
    return apiClient.get("/merchant/dashboard/stats");
  },
};
