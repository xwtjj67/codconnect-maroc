import AdminLayout from "@/components/layouts/AdminLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Search, Filter, MessageCircle, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserRow {
  id: string;
  name: string;
  phone: string;
  city: string;
  role: string;
  status: string;
  plan: string | null;
  sellerPlan: string | null;
}

const openWhatsApp = (phone: string) => {
  window.open(`https://wa.me/${phone.replace(/^0/, "212")}`, "_blank");
};

const statusLabels: Record<string, string> = { pending: "معلق", approved: "معتمد", active: "نشط", suspended: "موقوف" };
const statusColors: Record<string, string> = { pending: "text-accent bg-accent/10", approved: "text-blue-400 bg-blue-400/10", active: "text-green-400 bg-green-400/10", suspended: "text-destructive bg-destructive/10" };
const roleLabels: Record<string, string> = { affiliate: "مسوق", product_owner: "مورد", admin: "أدمن" };
const planLabels: Record<string, string> = { standard: "Standard", premium: "Premium", vip: "VIP" };
const sellerPlanLabels: Record<string, string> = { basic: "Basic", pro: "Pro" };

const AdminUsers = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");
    const { data: statuses } = await supabase.from("user_statuses").select("*");
    const { data: subs } = await supabase.from("subscriptions").select("*").eq("is_active", true);
    if (!profiles) { setLoading(false); return; }
    setUsers(profiles.map(p => {
      const role = roles?.find(r => r.user_id === p.id);
      const status = statuses?.find(s => s.user_id === p.id);
      const sub = subs?.find(s => s.user_id === p.id);
      return {
        id: p.id,
        name: p.name,
        phone: p.phone,
        city: p.city || "",
        role: role?.role || "affiliate",
        status: status?.status || "pending",
        plan: sub?.plan || null,
        sellerPlan: sub?.seller_plan || null,
      };
    }));
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateStatus = async (userId: string, newStatus: string) => {
    await supabase.from("user_statuses").update({ status: newStatus as any }).eq("user_id", userId);
    await supabase.from("approvals").insert({ target_type: "user", target_id: userId, admin_id: currentUser?.id, action: newStatus === "active" ? "approved" : "suspended" });
    fetchUsers();
  };

  const updatePlan = async (userId: string, role: string, newPlan: string) => {
    setUpdatingPlan(userId);
    try {
      if (role === "affiliate") {
        // Update subscription plan
        const { data: existing } = await supabase.from("subscriptions").select("id").eq("user_id", userId).eq("is_active", true).limit(1).single();
        if (existing) {
          await supabase.from("subscriptions").update({ plan: newPlan as any }).eq("id", existing.id);
        } else {
          await supabase.from("subscriptions").insert({ user_id: userId, plan: newPlan as any, is_active: true });
        }
      } else if (role === "product_owner") {
        const { data: existing } = await supabase.from("subscriptions").select("id").eq("user_id", userId).eq("is_active", true).limit(1).single();
        if (existing) {
          await supabase.from("subscriptions").update({ seller_plan: newPlan as any }).eq("id", existing.id);
        } else {
          await supabase.from("subscriptions").insert({ user_id: userId, seller_plan: newPlan as any, is_active: true });
        }
      }
      toast.success("تم تحديث الخطة بنجاح");
      fetchUsers();
    } catch {
      toast.error("حدث خطأ أثناء تحديث الخطة");
    } finally {
      setUpdatingPlan(null);
    }
  };

  const filtered = users
    .filter(u => roleFilter === "all" || u.role === roleFilter)
    .filter(u => statusFilter === "all" || u.status === statusFilter)
    .filter(u => !search || u.name.includes(search) || u.phone.includes(search));

  const pendingCount = users.filter(u => u.status === "pending").length;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
            <p className="text-sm text-muted-foreground">{users.length} مستخدم • {pendingCount} معلق</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)}
              className="h-10 pr-10 pl-4 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 w-56" />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {["all", "affiliate", "product_owner"].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${roleFilter === r ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground"}`}>
                {r === "all" ? "الكل" : roleLabels[r]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["all", "pending", "active", "suspended"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${statusFilter === s ? "gradient-teal text-primary-foreground font-medium" : "bg-secondary/50 text-muted-foreground"}`}>
                {s === "all" ? "كل الحالات" : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="glass-card p-12 text-center"><div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-right p-4 font-medium text-muted-foreground">الاسم</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الهاتف</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">المدينة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الدور</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الخطة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4 text-muted-foreground" dir="ltr">{u.phone}</td>
                      <td className="p-4 text-muted-foreground">{u.city}</td>
                      <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.role === "affiliate" ? "text-primary bg-primary/10" : "text-accent bg-accent/10"}`}>{roleLabels[u.role] || u.role}</span></td>
                      <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[u.status] || ""}`}>{statusLabels[u.status] || u.status}</span></td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Crown className="h-3.5 w-3.5 text-accent" />
                          {u.role === "affiliate" ? (
                            <select
                              value={u.plan || "standard"}
                              onChange={e => updatePlan(u.id, u.role, e.target.value)}
                              disabled={updatingPlan === u.id}
                              className="h-8 px-2 rounded-lg bg-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                              {Object.entries(planLabels).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                              ))}
                            </select>
                          ) : u.role === "product_owner" ? (
                            <select
                              value={u.sellerPlan || "basic"}
                              onChange={e => updatePlan(u.id, u.role, e.target.value)}
                              disabled={updatingPlan === u.id}
                              className="h-8 px-2 rounded-lg bg-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                              {Object.entries(sellerPlanLabels).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {u.status !== "active" && <button onClick={() => updateStatus(u.id, "active")} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><CheckCircle className="h-4 w-4" /></button>}
                          {u.status !== "suspended" && <button onClick={() => updateStatus(u.id, "suspended")} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><XCircle className="h-4 w-4" /></button>}
                          {u.phone && <button onClick={() => openWhatsApp(u.phone)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><MessageCircle className="h-4 w-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground">لا توجد نتائج</div>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
