import { apiClient } from "./api";
import type { LeaderboardEntry, PayoutRecord } from "@/types/models";

const MOCK_MODE = true;

export const affiliateService = {
  async getReferralStats() {
    if (MOCK_MODE) {
      return {
        referralLink: "codconnect.ma/ref/username",
        totalSignups: 25,
        totalEarnings: 320,
        totalClicks: 1480,
        totalSales: 18,
        conversionRate: 7.2,
      };
    }
    return apiClient.get("/affiliate/referrals/stats");
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (MOCK_MODE) {
      return [
        { rank: 1, name: "محمد ب.", avatar: "م", referrals: 42, sales: 38, earnings: 1260 },
        { rank: 2, name: "سارة ل.", avatar: "س", referrals: 31, sales: 27, earnings: 930 },
        { rank: 3, name: "يوسف ع.", avatar: "ي", referrals: 25, sales: 22, earnings: 750 },
        { rank: 4, name: "أمينة ر.", avatar: "أ", referrals: 19, sales: 15, earnings: 520 },
        { rank: 5, name: "حسن م.", avatar: "ح", referrals: 14, sales: 11, earnings: 380 },
      ];
    }
    return apiClient.get<LeaderboardEntry[]>("/affiliate/referrals/leaderboard");
  },

  async getPayouts(): Promise<PayoutRecord[]> {
    if (MOCK_MODE) {
      return [
        { id: "1", affiliateId: "a1", amount: 500, status: "completed", method: "CashPlus", createdAt: "2026-03-01" },
        { id: "2", affiliateId: "a1", amount: 320, status: "processing", method: "Virement", createdAt: "2026-03-10" },
        { id: "3", affiliateId: "a1", amount: 170, status: "pending", method: "CashPlus", createdAt: "2026-03-15" },
      ];
    }
    return apiClient.get<PayoutRecord[]>("/affiliate/payouts");
  },

  async getDashboardStats() {
    if (MOCK_MODE) {
      return { earnings: 170, orders: 5, sales: 3, referrals: 25, conversionRate: 12.5, pendingPayouts: 170 };
    }
    return apiClient.get("/affiliate/dashboard/stats");
  },

  async getMerchantDashboardStats() {
    if (MOCK_MODE) {
      return { revenue: 1096, orders: 7, products: 6, affiliates: 12, conversionRate: 14.2, monthlyGrowth: 18.5 };
    }
    return apiClient.get("/merchant/dashboard/stats");
  },
};
