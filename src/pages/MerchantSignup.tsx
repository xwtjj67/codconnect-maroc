import PublicLayout from "@/components/layouts/PublicLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { distributeToSheet } from "@/services/sheetsDistribution";

const MerchantSignup = () => {
  const [form, setForm] = useState({ name: "", email: "", storeName: "", phone: "", city: "", whatsapp: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signupMerchant } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.storeName.trim() || !form.phone.trim() || !form.city.trim() || !form.whatsapp.trim() || !form.password.trim()) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("كلمتا السر غير متطابقتين");
      return;
    }
    if (form.password.length < 6) {
      setError("كلمة السر يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      await signupMerchant({
        name: form.name, email: form.email, storeName: form.storeName,
        phone: form.phone, city: form.city, whatsapp: form.whatsapp, password: form.password,
      });
      await distributeToSheet({
        name: form.name,
        phone: form.phone,
        role: "product_owner",
        plan: "Basic",
        date: new Date().toISOString(),
      });
      navigate("/pending-approval", { replace: true });
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
            <h1 className="text-2xl font-bold">سجل كصاحب منتجات</h1>
            <p className="text-sm text-muted-foreground">وفر منتجاتك ودعنا نبيعها لك</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { label: "الاسم الكامل", key: "name", type: "text", placeholder: "أدخل اسمك الكامل" },
              { label: "البريد الإلكتروني", key: "email", type: "email", placeholder: "example@email.com", dir: "ltr" },
              { label: "اسم المتجر / العلامة التجارية", key: "storeName", type: "text", placeholder: "اسم المتجر" },
              { label: "رقم الهاتف", key: "phone", type: "tel", placeholder: "06XXXXXXXX", dir: "ltr" },
              { label: "المدينة", key: "city", type: "text", placeholder: "مثال: الدار البيضاء" },
              { label: "WhatsApp", key: "whatsapp", type: "tel", placeholder: "رقم واتساب", dir: "ltr" },
              { label: "كلمة السر", key: "password", type: "password", placeholder: "••••••••" },
              { label: "تأكيد كلمة السر", key: "confirmPassword", type: "password", placeholder: "••••••••" },
            ].map((f) => (
              <div key={f.key} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  dir={(f as any).dir}
                  className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
            </button>
          </form>
          <div className="text-center space-y-2 text-sm text-muted-foreground">
            <p>
              عندك حساب؟{" "}
              <Link to="/login" className="text-primary hover:underline">تسجيل الدخول</Link>
            </p>
            <p>
              <Link to="/affiliate-signup" className="text-primary hover:underline">سجل كمسوق بدلا من ذلك</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default MerchantSignup;
