import AdminLayout from "@/components/layouts/AdminLayout";
import PlanBadge from "@/components/shared/PlanBadge";
import { useState } from "react";
import { Search, UserCheck, UserX, Filter } from "lucide-react";
import type { PlanType, UserRole } from "@/types/auth";

interface MockUser {
  id: string;
  name: string;
  phone: string;
  city: string;
  role: UserRole;
  plan: PlanType;
  isActive: boolean;
  createdAt: string;
  storeName?: string;
}

const mockUsers: MockUser[] = [
  { id: "a1", name: "محمد ب.", phone: "0611111111", city: "الدار البيضاء", role: "affiliate", plan: "vip", isActive: true, createdAt: "2026-01-10" },
  { id: "a2", name: "سارة ل.", phone: "0622222222", city: "مراكش", role: "affiliate", plan: "premium", isActive: true, createdAt: "2026-01-15" },
  { id: "a3", name: "يوسف ع.", phone: "0633333333", city: "الرباط", role: "affiliate", plan: "standard", isActive: true, createdAt: "2026-02-01" },
  { id: "m1", name: "متجر التقنية", phone: "0711111111", city: "الدار البيضاء", role: "merchant", plan: "vip", isActive: true, createdAt: "2026-01-05", storeName: "متجر التقنية" },
  { id: "m2", name: "متجر الجمال", phone: "0722222222", city: "مراكش", role: "merchant", plan: "premium", isActive: true, createdAt: "2026-01-20", storeName: "متجر الجمال" },
  { id: "m3", name: "عطور المغرب", phone: "0733333333", city: "فاس", role: "merchant", plan: "standard", isActive: false, createdAt: "2026-02-15", storeName: "عطور المغرب" },
];

const roleFilters = ["الكل", "affiliate", "merchant"];
const roleLabels: Record<string, string> = { affiliate: "مسوق", merchant: "تاجر" };

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("الكل");
  const [users, setUsers] = useState(mockUsers);

  const filtered = users
    .filter(u => roleFilter === "الكل" || u.role === roleFilter)
    .filter(u => !search || u.name.includes(search) || u.phone.includes(search));

  const toggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pr-10 pl-4 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 w-48 transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              {roleFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setRoleFilter(f)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    roleFilter === f ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {f === "الكل" ? "الكل" : roleLabels[f]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">إجمالي</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{users.filter(u => u.isActive).length}</p>
            <p className="text-xs text-muted-foreground">نشط</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{users.filter(u => !u.isActive).length}</p>
            <p className="text-xs text-muted-foreground">معطل</p>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-right p-4 font-medium text-muted-foreground">المستخدم</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الهاتف</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المدينة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الدور</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الخطة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
                          u.role === "merchant" ? "bg-accent/20 text-accent" : "gradient-teal text-primary-foreground"
                        }`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          {u.storeName && <p className="text-xs text-muted-foreground">{u.storeName}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono text-xs" dir="ltr">{u.phone}</td>
                    <td className="p-4 text-muted-foreground">{u.city}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.role === "merchant" ? "text-accent bg-accent/10" : "text-primary bg-primary/10"
                      }`}>
                        {roleLabels[u.role]}
                      </span>
                    </td>
                    <td className="p-4"><PlanBadge plan={u.plan} /></td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.isActive ? "text-green-400 bg-green-400/10" : "text-destructive bg-destructive/10"
                      }`}>
                        {u.isActive ? "نشط" : "معطل"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleActive(u.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          u.isActive ? "hover:bg-destructive/10 text-muted-foreground hover:text-destructive" : "hover:bg-green-400/10 text-muted-foreground hover:text-green-400"
                        }`}
                      >
                        {u.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
