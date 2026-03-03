import PublicLayout from "@/components/layouts/PublicLayout";
import { Link } from "react-router-dom";
import { useState } from "react";

const MerchantSignup = () => {
  const [form, setForm] = useState({ name: "", store: "", phone: "", city: "", whatsapp: "", password: "" });

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md glass-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">افتح حسابك كتاجر وأضف منتجاتك</h1>
            <p className="text-sm text-muted-foreground">وسع مبيعاتك عبر شبكة مسوقين CodConnect</p>
          </div>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {[
              { label: "الاسم الكامل", key: "name", type: "text", placeholder: "أدخل اسمك الكامل" },
              { label: "اسم المتجر", key: "store", type: "text", placeholder: "اسم متجرك" },
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
            <button type="submit" className="w-full py-3 rounded-xl gradient-teal text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              إنشاء حساب كتاجر
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            عندك حساب؟{" "}
            <Link to="/dashboard" className="text-primary hover:underline">تسجيل الدخول</Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/affiliate-signup" className="text-primary hover:underline">سجل كمسوق بدلا من ذلك</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default MerchantSignup;
