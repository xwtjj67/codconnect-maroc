export type UserRole = "merchant" | "affiliate" | "admin";
export type UserStatus = "pending" | "approved" | "active" | "suspended";
export type PlanType = "standard" | "premium" | "vip";
export type SellerPlanType = "basic" | "pro";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface UserPlan {
  type: PlanType;
  commission: number;
  maxProducts: number;
  label: string;
  price: number;
}

export interface SellerPlan {
  type: SellerPlanType;
  maxProducts: number;
  label: string;
  price: number;
}

export const PLANS: Record<PlanType, UserPlan> = {
  standard: { type: "standard", commission: 10, maxProducts: 3, label: "Standard", price: 70 },
  premium: { type: "premium", commission: 20, maxProducts: 5, label: "Premium", price: 200 },
  vip: { type: "vip", commission: 30, maxProducts: -1, label: "VIP", price: 350 },
};

export const SELLER_PLANS: Record<SellerPlanType, SellerPlan> = {
  basic: { type: "basic", maxProducts: 3, label: "Basic", price: 350 },
  pro: { type: "pro", maxProducts: 10, label: "Pro", price: 500 },
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
  sellerPlan?: SellerPlanType;
  status: UserStatus;
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
