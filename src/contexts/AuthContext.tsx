import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
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
  username?: string;
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
  login: (email: string, password: string) => Promise<AppUser>;
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

async function fetchAppUser(userId: string, email?: string): Promise<AppUser | null> {
  try {
    console.log("[fetchAppUser] Starting for userId:", userId);
    
    // Add timeout to prevent hanging
    const timeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
      Promise.race([
        promise,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Query timeout")), ms))
      ]);

    const [profileRes, roleRes, statusRes] = await timeout(Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("user_roles").select("role").eq("user_id", userId).single(),
      supabase.from("user_statuses").select("status").eq("user_id", userId).single(),
    ]), 10000);

    console.log("[fetchAppUser] Profile:", profileRes.data, profileRes.error?.message);
    console.log("[fetchAppUser] Role:", roleRes.data, roleRes.error?.message);
    console.log("[fetchAppUser] Status:", statusRes.data, statusRes.error?.message);

    const profile = profileRes.data;
    if (!profile) {
      console.error("[fetchAppUser] No profile found");
      return null;
    }

    // Subscription query separately - may not exist for all users
    const subQuery = supabase
      .from("subscriptions")
      .select("plan, seller_plan, is_active")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    const { data: subData } = await timeout(Promise.resolve(subQuery), 10000);

    console.log("[fetchAppUser] Subscription:", subData);

    return {
      id: userId,
      email: email || "",
      name: profile.name,
      phone: profile.phone,
      city: profile.city || "",
      whatsapp: profile.whatsapp || "",
      username: (profile as any).username || undefined,
      storeName: profile.store_name || undefined,
      role: (roleRes.data?.role as UserRole) || "affiliate",
      status: (statusRes.data?.status as UserStatus) || "pending",
      plan: (subData?.plan as PlanType) || undefined,
      sellerPlan: (subData?.seller_plan as SellerPlanType) || undefined,
    };
  } catch (err) {
    console.error("[fetchAppUser] error:", err);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const skipListenerRef = useRef(false);

  const loadUser = async (authUser: SupabaseUser) => {
    setSupabaseUser(authUser);
    const appUser = await fetchAppUser(authUser.id, authUser.email);
    setUser(appUser);
    setIsLoading(false);
  };

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await loadUser(authUser);
    } else {
      setSupabaseUser(null);
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (skipListenerRef.current) return; // Skip when login handles it directly
        if (session?.user) {
          await loadUser(session.user);
        } else {
          setSupabaseUser(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        loadUser(session.user);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (identifier: string, password: string): Promise<AppUser> => {
    skipListenerRef.current = true;
    try {
      let email = identifier;
      // If not an email, look up the email by username
      if (!identifier.includes("@")) {
        const { data: profile, error: lookupErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", identifier)
          .single();
        if (lookupErr || !profile) throw new Error("اسم المستخدم غير موجود");
        // Get user email from auth - we need to use the profile id
        // Since we can't query auth.users, we'll try to sign in and let Supabase handle it
        // Actually we need the email. Let's store it: for now query won't work without email.
        // Workaround: try signing in with identifier as email first, if fails, error
        throw new Error("يرجى استخدام البريد الإلكتروني لتسجيل الدخول، أو تحقق من اسم المستخدم");
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      
      const appUser = await fetchAppUser(data.user.id, data.user.email);
      if (!appUser) throw new Error("فشل جلب بيانات المستخدم");
      
      setSupabaseUser(data.user);
      setUser(appUser);
      setIsLoading(false);
      return appUser;
    } finally {
      skipListenerRef.current = false;
    }
  };

  const signupAffiliate = async (data: { name: string; username: string; email: string; phone: string; city: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name, phone: data.phone, city: data.city,
          username: data.username, role: "affiliate",
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
          name: data.name, phone: data.phone, city: data.city,
          whatsapp: data.whatsapp, store_name: data.storeName, role: "product_owner",
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
