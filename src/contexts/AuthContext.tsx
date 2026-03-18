import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User, UserRole, PlanType } from "@/types/auth";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPending: boolean;
  login: (phone: string, password: string) => Promise<void>;
  signupAffiliate: (data: { name: string; phone: string; city: string; whatsapp: string; password: string }) => Promise<void>;
  signupMerchant: (data: { name: string; storeName: string; phone: string; city: string; whatsapp: string; password: string }) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPlan: (plan: PlanType) => boolean;
  canAddProduct: (currentCount: number) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const planLimits: Record<PlanType, number> = { standard: 3, premium: 5, vip: -1 };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (token && storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { authService.logout(); }
    }
    setIsLoading(false);
  }, []);

  const persistAuth = (user: User, token: string) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    setUser(user);
  };

  const login = async (phone: string, password: string) => {
    const res = await authService.login({ phone, password });
    persistAuth(res.user, res.token);
  };

  const signupAffiliate = async (data: { name: string; phone: string; city: string; whatsapp: string; password: string }) => {
    const res = await authService.signupAffiliate(data);
    persistAuth(res.user, res.token);
  };

  const signupMerchant = async (data: { name: string; storeName: string; phone: string; city: string; whatsapp: string; password: string }) => {
    const res = await authService.signupMerchant(data);
    persistAuth(res.user, res.token);
  };

  const logout = () => { authService.logout(); setUser(null); };
  const hasRole = (role: UserRole) => user?.role === role;
  const hasPlan = (plan: PlanType) => user?.plan === plan;
  const isPending = !!user && user.status !== "active" && user.status !== "suspended";
  const canAddProduct = (currentCount: number) => {
    if (!user) return false;
    const limit = planLimits[user.plan];
    return limit === -1 || currentCount < limit;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, isPending, login, signupAffiliate, signupMerchant, logout, hasRole, hasPlan, canAddProduct }}>
      {children}
    </AuthContext.Provider>
  );
};
