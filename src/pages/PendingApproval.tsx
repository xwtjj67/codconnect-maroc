import PublicLayout from "@/components/layouts/PublicLayout";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const openWhatsAppActivation = () => {
  window.open(`https://wa.me/212778133038?text=${encodeURIComponent("أنا سجلت في المنصة وأريد تفعيل حسابي")}`, "_blank");
};

const PendingApproval = () => {
  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg glass-card p-10 space-y-8 text-center">
          <div className="h-20 w-20 rounded-full gradient-teal flex items-center justify-center mx-auto">
            <Clock className="h-10 w-10 text-primary-foreground" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">في انتظار التفعيل</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              تم إنشاء حسابك بنجاح.
              <br />
              يرجى التواصل معنا عبر واتساب لتفعيل حسابك.
            </p>
          </div>

          <div className="glass-card p-5 space-y-3 border-accent/30">
            <div className="flex items-center justify-center gap-2 text-accent font-semibold text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>خطوات التفعيل</span>
            </div>
            <ol className="text-sm text-muted-foreground space-y-2 text-right">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">١</span>
                <span>اضغط على زر واتساب أسفله</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">٢</span>
                <span>أرسل الرسالة للفريق</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">٣</span>
                <span>سيتم تفعيل حسابك في أقرب وقت</span>
              </li>
            </ol>
          </div>

          <button
            onClick={openWhatsAppActivation}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-teal text-primary-foreground font-semibold hover:opacity-90 transition-opacity teal-glow"
          >
            <MessageCircle className="h-5 w-5" />
            تواصل عبر واتساب للتفعيل
          </button>

          <Link
            to="/login"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PendingApproval;
