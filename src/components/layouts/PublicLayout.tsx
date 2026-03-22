import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Instagram, Mail } from "lucide-react";
import codconnectLogo from "@/assets/codconnect-logo.png";

const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <img src={codconnectLogo} alt="CodConnect" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-3">
          <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            خدماتنا
          </Link>
          <Link to="/affiliate-signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            إنشاء حساب
          </Link>
          <Link to="/login" className="text-sm px-4 py-2 rounded-lg gradient-teal text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </header>
  );
};

const PublicFooter = () => {
  return (
    <footer className="border-t border-border/50 bg-navy-deep py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-6 text-center">
          <img src={codconnectLogo} alt="CodConnect" className="h-10 w-auto" />
          <p className="text-muted-foreground text-sm max-w-md">
            CodConnect — منصة مغربية للتوريد والتسويق بنظام الدفع عند الاستلام (COD)
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => window.open("https://wa.me/212778133038", "_blank")} className="text-primary hover:text-teal-glow transition-colors">
              <MessageCircle className="h-5 w-5" />
            </button>
            <a href="https://instagram.com/codconnect_" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-teal-glow transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="mailto:support@codconnect.ma" className="text-primary hover:text-teal-glow transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <p className="text-muted-foreground/60 text-xs">
            © {new Date().getFullYear()} CodConnect. جميع الحقوق محفوظة.
          </p>
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
