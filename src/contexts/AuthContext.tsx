import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User, UserRole } from "@/types/auth";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  signupAffiliate: (data: { name: string; phone: string; city: string; whatsapp: string; password: string }) => Promise<void>;
  signupMerchant: (data: { name: string; storeName: string; phone: string; city: string; whatsapp: string; password: string }) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        authService.logout();
      }
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

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role: UserRole) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, signupAffiliate, signupMerchant, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
