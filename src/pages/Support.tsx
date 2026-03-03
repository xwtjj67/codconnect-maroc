import DashboardLayout from "@/components/layouts/DashboardLayout";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

const Support = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold">الدعم</h1>

        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold">أرسل لنا رسالة</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-medium">الاسم</label>
              <input
                type="text"
                placeholder="اسمك الكامل"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">الرسالة</label>
              <textarea
                placeholder="اكتب رسالتك هنا..."
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl gradient-teal text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              إرسال
            </button>
          </form>
        </div>

        <a
          href="https://wa.me/212778133038"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card-hover p-5 flex items-center gap-4 group"
        >
          <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 group-hover:bg-green-500/30 transition-colors">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">تواصل عبر واتساب</p>
            <p className="text-sm text-muted-foreground">دعم مباشر وسريع</p>
          </div>
        </a>
      </div>
    </DashboardLayout>
  );
};

export default Support;
