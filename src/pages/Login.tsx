import PublicLayout from "@/components/layouts/PublicLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone.trim() || !password.trim()) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      await login(phone, password);
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        const user = JSON.parse(stored);
        const path = user.role === "admin" ? "/admin/dashboard"
          : user.role === "merchant" ? "/merchant/dashboard"
          : "/affiliate/dashboard";
        navigate(path, { replace: true });
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
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">رقم الهاتف</label>
              <input
                type="tel"
                placeholder="06XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">كلمة السر</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-teal text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ما عندكش حساب؟{" "}
              <Link to="/affiliate-signup" className="text-primary hover:underline">سجل كمسوق</Link>
              {" أو "}
              <Link to="/merchant-signup" className="text-accent hover:underline">سجل كتاجر</Link>
            </p>
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground/60">تجربة: 06X = مسوق، 07X = تاجر، 0500000000 = أدمن</p>
            <p className="text-xs text-muted-foreground/60">الرقم ينتهي بـ 1 = Premium، بـ 2 = VIP</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;
