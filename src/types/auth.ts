export type UserRole = "merchant" | "affiliate" | "admin";
export type PlanType = "standard" | "premium" | "vip";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface UserPlan {
  type: PlanType;
  commission: number; // percentage
  maxProducts: number; // -1 = unlimited
  label: string;
  price: number;
}

export const PLANS: Record<PlanType, UserPlan> = {
  standard: { type: "standard", commission: 10, maxProducts: 3, label: "Standard", price: 30 },
  premium: { type: "premium", commission: 20, maxProducts: 5, label: "Premium", price: 200 },
  vip: { type: "vip", commission: 30, maxProducts: -1, label: "VIP", price: 350 },
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  whatsapp: string;
  role: UserRole;
  plan: PlanType;
  storeName?: string;
  token: string;
  createdAt?: string;
  isActive?: boolean;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface AffiliateSignupData {
  name: string;
  phone: string;
  city: string;
  whatsapp: string;
  password: string;
}

export interface MerchantSignupData extends AffiliateSignupData {
  storeName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
