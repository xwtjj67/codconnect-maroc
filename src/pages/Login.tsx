import PublicLayout from "@/components/layouts/PublicLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      const appUser = await login(identifier.trim(), password);

      if (appUser.status !== "active") {
        navigate("/pending-approval", { replace: true });
      } else if (appUser.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (appUser.role === "product_owner") {
        navigate("/merchant/dashboard", { replace: true });
      } else {
        navigate("/affiliate/dashboard", { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md glass-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
            <p className="text-sm text-muted-foreground">ادخل إلى لوحة التحكم الخاصة بك</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">{error}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">البريد الإلكتروني أو اسم المستخدم</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="email@example.com أو ahmed.benali"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full h-11 px-4 pr-10 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">كلمة السر</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-10 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-teal text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  جاري الدخول...
                </>
              ) : "تسجيل الدخول"}
            </button>
          </form>

          <div className="text-center space-y-2 text-sm text-muted-foreground">
            <p>ما عندكش حساب؟ <Link to="/affiliate-signup" className="text-primary hover:underline">سجل كمسوق</Link></p>
            <p>عندك منتجات؟ <Link to="/merchant-signup" className="text-accent hover:underline">سجل كصاحب منتجات</Link></p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;
