import PublicLayout from "@/components/layouts/PublicLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const AffiliateSignup = () => {
  const [form, setForm] = useState({ name: "", phone: "", city: "", whatsapp: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signupAffiliate } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim() || !form.city.trim() || !form.whatsapp.trim() || !form.password.trim()) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    if (form.password.length < 6) {
      setError("كلمة السر يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      await signupAffiliate(form);
      navigate("/affiliate/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md glass-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">افتح حسابك كمسوق في CodConnect</h1>
            <p className="text-sm text-muted-foreground">سجل مجانا وابدأ في الربح من العمولات</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { label: "الاسم الكامل", key: "name", type: "text", placeholder: "أدخل اسمك الكامل" },
              { label: "رقم الهاتف", key: "phone", type: "tel", placeholder: "06XXXXXXXX" },
              { label: "المدينة", key: "city", type: "text", placeholder: "مثال: الدار البيضاء" },
              { label: "WhatsApp", key: "whatsapp", type: "tel", placeholder: "رقم واتساب" },
              { label: "كلمة السر", key: "password", type: "password", placeholder: "••••••••" },
            ].map((f) => (
              <div key={f.key} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-teal text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            عندك حساب؟{" "}
            <Link to="/login" className="text-primary hover:underline">تسجيل الدخول</Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/merchant-signup" className="text-accent hover:underline">سجل كتاجر بدلا من ذلك</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AffiliateSignup;
