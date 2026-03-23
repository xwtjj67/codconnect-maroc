import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/services/api";

export type UserRole = "affiliate" | "product_owner" | "admin";
export type UserStatus = "pending" | "approved" | "active" | "suspended";
export type PlanType = "standard" | "premium" | "vip";
export type SellerPlanType = "basic" | "pro";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  city: string;
  whatsapp: string;
  username?: string;
  storeName?: string;
  role: UserRole;
  status: UserStatus;
  plan?: PlanType;
  sellerPlan?: SellerPlanType;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPending: boolean;
  login: (identifier: string, password: string) => Promise<AppUser>;
  signupAffiliate: (data: { name: string; username: string; email: string; phone: string; city: string; password: string }) => Promise<void>;
  signupMerchant: (data: { name: string; username: string; email: string; storeName: string; phone: string; city: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasPlan: (plan: PlanType) => boolean;
  canAddProduct: (currentCount: number) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const planProductLimits: Record<PlanType, number> = { standard: 3, premium: 5, vip: -1 };
const sellerPlanLimits: Record<SellerPlanType, number> = { basic: 3, pro: 10 };

function mapUserData(u: any): AppUser {
  return {
    id: u.id,
    email: u.email || "",
    name: u.name || "",
    phone: u.phone || "",
    city: u.city || "",
    whatsapp: u.whatsapp || "",
    username: u.username || undefined,
    storeName: u.store_name || u.storeName || undefined,
    role: (u.role as UserRole) || "affiliate",
    status: (u.status as UserStatus) || "pending",
    plan: (u.plan as PlanType) || undefined,
    sellerPlan: (u.seller_plan || u.sellerPlan) as SellerPlanType || undefined,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!api.isLoggedIn()) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: userData } = await api.getMe();
        setUser(mapUserData(userData));
      } catch {
        api.clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const refreshUser = async () => {
    try {
      const { user: userData } = await api.getMe();
      setUser(mapUserData(userData));
    } catch {
      setUser(null);
    }
  };

  const login = async (identifier: string, password: string): Promise<AppUser> => {
    // This will throw if status is pending/suspended (403)
    const { user: userData } = await api.login(identifier, password);
    const appUser = mapUserData(userData);
    setUser(appUser);
    return appUser;
  };

  const signupAffiliate = async (data: { name: string; username: string; email: string; phone: string; city: string; password: string; preferredCategory?: string }) => {
    await api.signup({
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      password: data.password,
      role: "affiliate",
      username: data.username,
      preferred_category: data.preferredCategory,
    });
  };

  const signupMerchant = async (data: { name: string; username: string; email: string; storeName: string; phone: string; city: string; password: string }) => {
    await api.signup({
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      password: data.password,
      role: "product_owner",
      username: data.username,
      store_name: data.storeName,
    });
    // No token returned, no auto-login
  };

  const logout = async () => {
    api.logout();
    setUser(null);
  };

  const hasRole = (role: UserRole) => user?.role === role;
  const hasPlan = (plan: PlanType) => user?.plan === plan;
  const isPending = !!user && user.status !== "active";

  const canAddProduct = (currentCount: number) => {
    if (!user) return false;
    if (user.role === "affiliate" && user.plan) {
      const limit = planProductLimits[user.plan];
      return limit === -1 || currentCount < limit;
    }
    if (user.role === "product_owner" && user.sellerPlan) {
      const limit = sellerPlanLimits[user.sellerPlan];
      return currentCount < limit;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated: !!user, isPending,
      login, signupAffiliate, signupMerchant, logout, hasRole, hasPlan, canAddProduct, refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
