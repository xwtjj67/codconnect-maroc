import AdminLayout from "@/components/layouts/AdminLayout";
import PlanBadge from "@/components/shared/PlanBadge";
import { useState } from "react";
import {
  Search, UserCheck, UserX, Clock, CheckCircle, Ban,
  MessageCircle, Eye, ChevronDown, X
} from "lucide-react";
import type { PlanType, UserRole, UserStatus } from "@/types/auth";

interface ManagedUser {
  id: string;
  name: string;
  phone: string;
  city: string;
  whatsapp: string;
  role: UserRole;
  plan: PlanType;
  status: UserStatus;
  createdAt: string;
  storeName?: string;
}

// Start empty — real data comes from API
const [initialUsers] = [[] as ManagedUser[]];

const roleLabels: Record<UserRole, string> = { affiliate: "مسوق", merchant: "صاحب منتجات", admin: "أدمن" };
const statusLabels: Record<UserStatus, string> = { pending: "في الانتظار", approved: "مقبول", active: "نشط", suspended: "معلق" };
const statusColors: Record<UserStatus, string> = {
  pending: "text-amber-400 bg-amber-400/10",
  approved: "text-blue-400 bg-blue-400/10",
  active: "text-green-400 bg-green-400/10",
  suspended: "text-destructive bg-destructive/10",
};
const statusIcons: Record<UserStatus, typeof Clock> = {
  pending: Clock,
  approved: CheckCircle,
  active: CheckCircle,
  suspended: Ban,
};

type FilterTab = "all" | "pending" | "active" | "suspended";

const WHATSAPP_BASE = "https://api.whatsapp.com/send?phone=";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  const updateStatus = (id: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    if (selectedUser?.id === id) setSelectedUser(prev => prev ? { ...prev, status } : null);
    // TODO: call adminService.updateUserStatus(id, status)
  };

  const filtered = users
    .filter(u => {
      if (filterTab === "pending") return u.status === "pending";
      if (filterTab === "active") return u.status === "active" || u.status === "approved";
      if (filterTab === "suspended") return u.status === "suspended";
      return true;
    })
    .filter(u => roleFilter === "all" || u.role === roleFilter)
    .filter(u => !search || u.name.includes(search) || u.phone.includes(search));

  const pendingCount = users.filter(u => u.status === "pending").length;
  const activeCount = users.filter(u => u.status === "active" || u.status === "approved").length;
  const suspendedCount = users.filter(u => u.status === "suspended").length;

  const filterTabs: { key: FilterTab; label: string; count: number; color: string }[] = [
    { key: "all", label: "الكل", count: users.length, color: "" },
    { key: "pending", label: "في الانتظار", count: pendingCount, color: "text-amber-400" },
    { key: "active", label: "نشط", count: activeCount, color: "text-green-400" },
    { key: "suspended", label: "معلق", count: suspendedCount, color: "text-destructive" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
            <p className="text-sm text-muted-foreground mt-1">تفعيل الحسابات وإدارة الأدوار</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">إجمالي</p>
          </div>
          <div className="glass-card p-4 text-center border-amber-400/20">
            <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">في الانتظار</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{activeCount}</p>
            <p className="text-xs text-muted-foreground">نشط</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{suspendedCount}</p>
            <p className="text-xs text-muted-foreground">معلق</p>
          </div>
        </div>

        {/* Pending Alert */}
        {pendingCount > 0 && (
          <div className="glass-card p-4 border-amber-400/30 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-400/10 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-400">{pendingCount} مستخدم في انتظار التفعيل</p>
              <p className="text-xs text-muted-foreground">قم بمراجعة الحسابات وتفعيلها</p>
            </div>
            <button
              onClick={() => setFilterTab("pending")}
              className="px-4 py-2 rounded-lg bg-amber-400/10 text-amber-400 text-sm font-medium hover:bg-amber-400/20 transition-colors"
            >
              عرض المعلقين
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  filterTab === tab.key
                    ? "gradient-teal text-primary-foreground font-medium"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] font-bold ${filterTab === tab.key ? "text-primary-foreground/80" : tab.color || "text-muted-foreground"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mr-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "all" | UserRole)}
              className="h-9 px-3 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">كل الأدوار</option>
              <option value="affiliate">مسوق</option>
              <option value="merchant">صاحب منتجات</option>
            </select>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو الهاتف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pr-10 pl-4 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 w-56 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
              <UserCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">لا يوجد مستخدمون</p>
            <p className="text-sm text-muted-foreground/70">
              {users.length === 0
                ? "لم يسجل أي مستخدم بعد في المنصة"
                : "لا توجد نتائج مطابقة للفلتر الحالي"}
            </p>
          </div>
        )}

        {/* Users Table */}
        {filtered.length > 0 && (
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
                    <th className="text-right p-4 font-medium text-muted-foreground">التاريخ</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const StatusIcon = statusIcons[u.status];
                    return (
                      <tr key={u.id} className={`border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors ${
                        u.status === "pending" ? "bg-amber-400/[0.03]" : ""
                      }`}>
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
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[u.status]}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusLabels[u.status]}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">{u.createdAt}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            {u.status === "pending" && (
                              <button
                                onClick={() => updateStatus(u.id, "active")}
                                className="p-2 rounded-lg hover:bg-green-400/10 text-green-400 transition-colors"
                                title="تفعيل الحساب"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
                            {(u.status === "active" || u.status === "approved") && (
                              <button
                                onClick={() => updateStatus(u.id, "suspended")}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                title="تعليق الحساب"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            )}
                            {u.status === "suspended" && (
                              <button
                                onClick={() => updateStatus(u.id, "active")}
                                className="p-2 rounded-lg hover:bg-green-400/10 text-muted-foreground hover:text-green-400 transition-colors"
                                title="إعادة تفعيل"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
                            {u.whatsapp && (
                              <a
                                href={`${WHATSAPP_BASE}${u.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                title="تواصل واتساب"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </a>
                            )}
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
            <div className="w-full max-w-lg glass-card p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">تفاصيل المستخدم</h2>
                <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold ${
                  selectedUser.role === "merchant" ? "bg-accent/20 text-accent" : "gradient-teal text-primary-foreground"
                }`}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedUser.name}</p>
                  {selectedUser.storeName && <p className="text-sm text-muted-foreground">{selectedUser.storeName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "الهاتف", value: selectedUser.phone },
                  { label: "واتساب", value: selectedUser.whatsapp },
                  { label: "المدينة", value: selectedUser.city },
                  { label: "تاريخ التسجيل", value: selectedUser.createdAt },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-medium" dir={item.label === "الهاتف" || item.label === "واتساب" ? "ltr" : "rtl"}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedUser.role === "merchant" ? "text-accent bg-accent/10" : "text-primary bg-primary/10"
                }`}>
                  {roleLabels[selectedUser.role]}
                </span>
                <PlanBadge plan={selectedUser.plan} />
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[selectedUser.status]}`}>
                  {statusLabels[selectedUser.status]}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                {selectedUser.status === "pending" && (
                  <button
                    onClick={() => updateStatus(selectedUser.id, "active")}
                    className="flex-1 py-2.5 rounded-xl bg-green-500/10 text-green-400 font-semibold text-sm hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <UserCheck className="h-4 w-4" />
                    تفعيل الحساب
                  </button>
                )}
                {(selectedUser.status === "active" || selectedUser.status === "approved") && (
                  <button
                    onClick={() => updateStatus(selectedUser.id, "suspended")}
                    className="flex-1 py-2.5 rounded-xl bg-destructive/10 text-destructive font-semibold text-sm hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Ban className="h-4 w-4" />
                    تعليق الحساب
                  </button>
                )}
                {selectedUser.status === "suspended" && (
                  <button
                    onClick={() => updateStatus(selectedUser.id, "active")}
                    className="flex-1 py-2.5 rounded-xl bg-green-500/10 text-green-400 font-semibold text-sm hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <UserCheck className="h-4 w-4" />
                    إعادة التفعيل
                  </button>
                )}
                {selectedUser.whatsapp && (
                  <a
                    href={`${WHATSAPP_BASE}${selectedUser.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl gradient-teal text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    واتساب
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
