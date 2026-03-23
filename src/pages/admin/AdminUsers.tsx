import AdminLayout from "@/components/layouts/AdminLayout";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { CheckCircle, XCircle, Search, Filter, MessageCircle, Crown, Tag } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserRow {
  id: string; name: string; phone: string; city: string;
  role: string; status: string; plan: string | null; sellerPlan: string | null;
  preferredCategory: string | null;
}

const CATEGORIES = [
  { value: "cosmetics", label: "تجميل" },
  { value: "electronics", label: "الكترونيات" },
  { value: "fashion", label: "ملابس" },
  { value: "home", label: "منزل" },
  { value: "fitness", label: "رياضة" },
  { value: "other", label: "أخرى" },
];

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

  // Category edit dialog
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { users: data } = await api.getUsers();
      setUsers(data.map((u: any) => ({
        id: u.id, name: u.name, phone: u.phone, city: u.city || "",
        role: u.role || "affiliate", status: u.status || "pending",
        plan: u.plan || null, sellerPlan: u.seller_plan || null,
        preferredCategory: u.preferred_category || null,
      })));
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateStatus = async (userId: string, newStatus: string) => {
    try {
      await api.updateUserStatus(userId, newStatus);
      fetchUsers();
    } catch { toast.error("حدث خطأ"); }
  };

  const updatePlan = async (userId: string, role: string, newPlan: string) => {
    setUpdatingPlan(userId);
    try {
      const planType = role === "affiliate" ? "plan" : "seller_plan";
      await api.updateUserPlan(userId, newPlan, planType as any);
      toast.success("تم تحديث الخطة بنجاح");
      fetchUsers();
    } catch { toast.error("حدث خطأ أثناء تحديث الخطة"); }
    finally { setUpdatingPlan(null); }
  };

  const saveCategory = async () => {
    if (!editUser) return;
    setSavingCategory(true);
    try {
      await api.updateUserCategory(editUser.id, editCategory);
      toast.success("تم تحديث الفئة");
      setEditUser(null);
      fetchUsers();
    } catch { toast.error("حدث خطأ"); }
    setSavingCategory(false);
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
                    <th className="text-right p-4 font-medium text-muted-foreground">الفئة</th>
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
                      <td className="p-4">
                        {u.role === "affiliate" ? (
                          <button onClick={() => { setEditUser(u); setEditCategory(u.preferredCategory || ""); }} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-secondary/50 hover:bg-secondary transition-colors">
                            <Tag className="h-3 w-3" />
                            {CATEGORIES.find(c => c.value === u.preferredCategory)?.label || "غير محدد"}
                          </button>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[u.status] || ""}`}>{statusLabels[u.status] || u.status}</span></td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Crown className="h-3.5 w-3.5 text-accent" />
                          {u.role === "affiliate" ? (
                            <select value={u.plan || "standard"} onChange={e => updatePlan(u.id, u.role, e.target.value)} disabled={updatingPlan === u.id}
                              className="h-8 px-2 rounded-lg bg-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                              {Object.entries(planLabels).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                            </select>
                          ) : u.role === "product_owner" ? (
                            <select value={u.sellerPlan || "basic"} onChange={e => updatePlan(u.id, u.role, e.target.value)} disabled={updatingPlan === u.id}
                              className="h-8 px-2 rounded-lg bg-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                              {Object.entries(sellerPlanLabels).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                            </select>
                          ) : (<span className="text-xs text-muted-foreground">—</span>)}
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

      {/* Category Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-sm" dir="rtl">
          <DialogHeader><DialogTitle>تعديل فئة المسوق</DialogTitle></DialogHeader>
          {editUser && (
            <div className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">المسوق: <span className="font-medium text-foreground">{editUser.name}</span></p>
              <div className="space-y-2">
                <Label>الفئة المفضلة</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={saveCategory} disabled={savingCategory} className="w-full">{savingCategory ? "جاري الحفظ..." : "حفظ"}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
