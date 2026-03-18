import { apiClient } from "./api";
import type { AuthResponse, LoginCredentials, AffiliateSignupData, MerchantSignupData, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", credentials);
  },

  async signupAffiliate(data: AffiliateSignupData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/signup/affiliate", data);
  },

  async signupMerchant(data: MerchantSignupData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/signup/merchant", data);
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>("/auth/profile");
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },
};
