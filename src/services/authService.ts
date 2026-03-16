import { apiClient } from "./api";
import type { AuthResponse, LoginCredentials, AffiliateSignupData, MerchantSignupData, User, PlanType } from "@/types/auth";

const MOCK_MODE = true;

const mockUser = (role: "merchant" | "affiliate" | "admin", overrides?: Partial<User>): User => ({
  id: crypto.randomUUID(),
  name: overrides?.name || "مستخدم تجريبي",
  email: "test@codconnect.ma",
  phone: overrides?.phone || "0600000000",
  city: overrides?.city || "الدار البيضاء",
  whatsapp: overrides?.whatsapp || "0600000000",
  role,
  plan: (overrides?.plan || "standard") as PlanType,
  storeName: role === "merchant" ? (overrides?.storeName || "متجر تجريبي") : undefined,
  token: "mock_jwt_" + Date.now(),
  createdAt: new Date().toISOString(),
  isActive: true,
});

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (MOCK_MODE) {
      const role = credentials.phone === "0500000000" ? "admin" as const
        : credentials.phone.startsWith("07") ? "merchant" as const
        : "affiliate" as const;
      const plan: PlanType = credentials.phone.endsWith("1") ? "premium"
        : credentials.phone.endsWith("2") ? "vip" : "standard";
      const user = mockUser(role, { phone: credentials.phone, plan });
      return { user, token: user.token };
    }
    return apiClient.post<AuthResponse>("/auth/login", credentials);
  },

  async signupAffiliate(data: AffiliateSignupData): Promise<AuthResponse> {
    if (MOCK_MODE) {
      const user = mockUser("affiliate", { ...data, plan: "standard" });
      return { user, token: user.token };
    }
    return apiClient.post<AuthResponse>("/auth/signup/affiliate", data);
  },

  async signupMerchant(data: MerchantSignupData): Promise<AuthResponse> {
    if (MOCK_MODE) {
      const user = mockUser("merchant", { ...data, storeName: data.storeName, plan: "standard" });
      return { user, token: user.token };
    }
    return apiClient.post<AuthResponse>("/auth/signup/merchant", data);
  },

  async getProfile(): Promise<User> {
    if (MOCK_MODE) {
      const stored = localStorage.getItem("auth_user");
      if (stored) return JSON.parse(stored);
      throw new Error("Not authenticated");
    }
    return apiClient.get<User>("/auth/profile");
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },
};
