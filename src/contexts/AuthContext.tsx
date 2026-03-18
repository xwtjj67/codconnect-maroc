import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
  storeName?: string;
  role: UserRole;
  status: UserStatus;
  plan?: PlanType;
  sellerPlan?: SellerPlanType;
}

interface AuthContextType {
  user: AppUser | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPending: boolean;
  login: (email: string, password: string) => Promise<void>;
  signupAffiliate: (data: { name: string; email: string; phone: string; city: string; whatsapp: string; password: string }) => Promise<void>;
  signupMerchant: (data: { name: string; email: string; storeName: string; phone: string; city: string; whatsapp: string; password: string }) => Promise<void>;
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

async function fetchAppUser(userId: string): Promise<AppUser | null> {
  try {
    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!profile) return null;

    // Fetch role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    // Fetch status
    const { data: statusData } = await supabase
      .from("user_statuses")
      .select("status")
      .eq("user_id", userId)
      .single();

    // Fetch subscription
    const { data: subData } = await supabase
      .from("subscriptions")
      .select("plan, seller_plan, is_active")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Get email from auth
    const { data: { user: authUser } } = await supabase.auth.getUser();

    return {
      id: userId,
      email: authUser?.email || "",
      name: profile.name,
      phone: profile.phone,
      city: profile.city || "",
      whatsapp: profile.whatsapp || "",
      storeName: profile.store_name || undefined,
      role: (roleData?.role as UserRole) || "affiliate",
      status: (statusData?.status as UserStatus) || "pending",
      plan: (subData?.plan as PlanType) || undefined,
      sellerPlan: (subData?.seller_plan as SellerPlanType) || undefined,
    };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setSupabaseUser(authUser);
      const appUser = await fetchAppUser(authUser.id);
      setUser(appUser);
    } else {
      setSupabaseUser(null);
      setUser(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            const appUser = await fetchAppUser(session.user.id);
            setUser(appUser);
            setIsLoading(false);
          }, 0);
        } else {
          setSupabaseUser(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        fetchAppUser(session.user.id).then(appUser => {
          setUser(appUser);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signupAffiliate = async (data: { name: string; email: string; phone: string; city: string; whatsapp: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone,
          city: data.city,
          whatsapp: data.whatsapp,
          role: "affiliate",
        },
      },
    });
    if (error) throw new Error(error.message);
  };

  const signupMerchant = async (data: { name: string; email: string; storeName: string; phone: string; city: string; whatsapp: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone,
          city: data.city,
          whatsapp: data.whatsapp,
          store_name: data.storeName,
          role: "product_owner",
        },
      },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
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
      user, supabaseUser, isLoading, isAuthenticated: !!user, isPending,
      login, signupAffiliate, signupMerchant, logout, hasRole, hasPlan, canAddProduct, refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
