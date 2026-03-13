import { apiClient } from "./api";
import type { AuthResponse, LoginCredentials, AffiliateSignupData, MerchantSignupData, User } from "@/types/auth";

// Mock mode — set to false when your backend is live
const MOCK_MODE = true;

const mockUser = (role: "merchant" | "affiliate", overrides?: Partial<User>): User => ({
  id: crypto.randomUUID(),
  name: overrides?.name || "مستخدم تجريبي",
  email: "test@codconnect.ma",
  phone: overrides?.phone || "0600000000",
  city: overrides?.city || "الدار البيضاء",
  whatsapp: overrides?.whatsapp || "0600000000",
  role,
  storeName: role === "merchant" ? (overrides?.storeName || "متجر تجريبي") : undefined,
  token: "mock_jwt_" + Date.now(),
});

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (MOCK_MODE) {
      // Simulate: phone starting with 06 = affiliate, 07 = merchant
      const role = credentials.phone.startsWith("07") ? "merchant" : "affiliate";
      const user = mockUser(role, { phone: credentials.phone });
      return { user, token: user.token };
    }
    return apiClient.post<AuthResponse>("/auth/login", credentials);
  },

  async signupAffiliate(data: AffiliateSignupData): Promise<AuthResponse> {
    if (MOCK_MODE) {
      const user = mockUser("affiliate", data);
      return { user, token: user.token };
    }
    return apiClient.post<AuthResponse>("/auth/signup/affiliate", data);
  },

  async signupMerchant(data: MerchantSignupData): Promise<AuthResponse> {
    if (MOCK_MODE) {
      const user = mockUser("merchant", { ...data, storeName: data.storeName });
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
