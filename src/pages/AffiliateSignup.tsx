import PublicLayout from "@/components/layouts/PublicLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import PasswordStrengthIndicator, { isPasswordStrong } from "@/components/auth/PasswordStrengthIndicator";
import UsernameField from "@/components/auth/UsernameField";

const AffiliateSignup = () => {
  const [form, setForm] = useState({ name: "", username: "", email: "", phone: "", city: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signupAffiliate } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.phone.trim() || !form.city.trim() || !form.password.trim()) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("البريد الإلكتروني غير صحيح");
      return;
    }
    if (!/^(06|07|05)\d{8}$/.test(form.phone)) {
      setError("رقم الهاتف غير صحيح (يجب أن يبدأ بـ 06 أو 07 أو 05)");
      return;
    }
    if (!isPasswordStrong(form.password)) {
      setError("كلمة السر ضعيفة، يرجى اتباع الشروط");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("كلمتا السر غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      await signupAffiliate({ name: form.name, username: form.username, email: form.email, phone: form.phone, city: form.city, password: form.password });
      // Google Sheets distribution is now handled server-side in signup
      navigate("/pending-approval", { replace: true });
    } catch (err: any) {
      // If pending status, redirect to pending page
      if (err.message?.includes("انتظار التفعيل")) {
        navigate("/pending-approval", { replace: true });
        return;
      }
      setError(err.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "الاسم الكامل", key: "name", type: "text", placeholder: "أدخل اسمك الكامل", icon: <UserPlus className="h-4 w-4" /> },
    { label: "البريد الإلكتروني", key: "email", type: "email", placeholder: "example@email.com", dir: "ltr", icon: <Mail className="h-4 w-4" /> },
    { label: "رقم الهاتف", key: "phone", type: "tel", placeholder: "06XXXXXXXX", dir: "ltr", icon: <Phone className="h-4 w-4" /> },
    { label: "المدينة", key: "city", type: "text", placeholder: "مثال: الدار البيضاء", icon: <MapPin className="h-4 w-4" /> },
  ];

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md glass-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">سجل كمسوق في CodConnect</h1>
            <p className="text-sm text-muted-foreground">أنشئ حسابك وابدأ الربح من العمولات</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">{error}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{f.label}</label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{f.icon}</span>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    dir={(f as any).dir}
                    className="w-full h-11 px-4 pr-10 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            ))}

            <UsernameField name={form.name} value={form.username} onChange={(v) => setForm({ ...form, username: v })} />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">كلمة السر</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-11 px-10 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrengthIndicator password={form.password} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">تأكيد كلمة السر</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full h-11 px-10 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl gradient-teal text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  جاري الإنشاء...
                </>
              ) : "إنشاء حساب"}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            عندك حساب؟ <Link to="/login" className="text-primary hover:underline">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AffiliateSignup;
