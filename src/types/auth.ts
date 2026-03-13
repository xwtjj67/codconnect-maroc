export type UserRole = "merchant" | "affiliate";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  whatsapp: string;
  role: UserRole;
  storeName?: string; // merchant only
  token: string;
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
