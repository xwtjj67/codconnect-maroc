import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Instagram, Mail, Facebook } from "lucide-react";
import codconnectLogo from "@/assets/codconnect-logo.png";

const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <img src={codconnectLogo} alt="CodConnect" className="h-9 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="/#how" className="hover:text-foreground transition-colors duration-150">طريقة العمل</a>
          <a href="/#pricing" className="hover:text-foreground transition-colors duration-150">الباقات</a>
          <a href="/#faq" className="hover:text-foreground transition-colors duration-150">أسئلة</a>
          <Link to="/support" className="hover:text-foreground transition-colors duration-150">الدعم</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/affiliate-signup"
            className="text-sm px-3 py-2 rounded text-foreground hover:bg-secondary transition-colors duration-150"
          >
            إنشاء حساب
          </Link>
          <Link
            to="/login"
            className="text-sm px-4 py-2 rounded bg-primary text-primary-foreground font-medium hover:bg-accent transition-colors duration-150"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </header>
  );
};

const PublicFooter = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <img src={codconnectLogo} alt="CodConnect" className="h-9 w-auto" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              منصة مغربية تربط الموردين بالمسوقين بنظام الدفع عند الاستلام. المنتجات والتأكيد والشحن من طرفنا، التسويق من طرفك.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">روابط</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#how" className="hover:text-foreground transition-colors duration-150">طريقة العمل</a></li>
              <li><a href="/#pricing" className="hover:text-foreground transition-colors duration-150">الباقات</a></li>
              <li><Link to="/merchant-signup" className="hover:text-foreground transition-colors duration-150">تسجيل مورد</Link></li>
              <li><Link to="/support" className="hover:text-foreground transition-colors duration-150">الدعم</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">تواصل</h2>
            <div className="flex items-center gap-4 text-muted-foreground">
              <button
                onClick={() => window.open("https://wa.me/212778133038", "_blank")}
                aria-label="واتساب"
                className="hover:text-foreground transition-colors duration-150"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <a href="https://instagram.com/codconnect_" target="_blank" rel="noopener noreferrer" aria-label="إنستغرام" className="hover:text-foreground transition-colors duration-150">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61584374087643" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="hover:text-foreground transition-colors duration-150">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@codconnect_" target="_blank" rel="noopener noreferrer" aria-label="تيك توك" className="hover:text-foreground transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
                </svg>
              </a>
              <a href="mailto:support@codconnect.ma" aria-label="البريد" className="hover:text-foreground transition-colors duration-150">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">support@codconnect.ma</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CodConnect. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-muted-foreground">الرباط، المغرب</p>
        </div>
      </div>
    </footer>
  );
};

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
