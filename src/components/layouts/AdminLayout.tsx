import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Package, ShoppingCart, BarChart3, Shield, LogOut, Menu, X, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import codconnectLogo from "@/assets/codconnect-logo.png";

const sidebarItems = [
  { title: "لوحة التحكم", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "المستخدمين", url: "/admin/users", icon: Users },
  { title: "المنتجات", url: "/admin/products", icon: Package },
  { title: "الطلبات", url: "/admin/orders", icon: ShoppingCart },
  { title: "التحليلات", url: "/admin/analytics", icon: BarChart3 },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-sidebar border-l border-sidebar-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={codconnectLogo} alt="CodConnect" className="h-8 w-auto" />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-destructive/20 text-destructive border border-destructive/30 flex items-center gap-1">
              <Shield className="h-3 w-3" /> أدمن
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground"><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-5 w-5" /><span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground"><Menu className="h-5 w-5" /></button>
          <span className="text-sm text-muted-foreground">لوحة الإدارة</span>
          <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive text-xs font-bold">
            <Shield className="h-4 w-4" />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
