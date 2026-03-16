import AffiliateLayout from "@/components/layouts/AffiliateLayout";
import { Copy, Trophy, Users, DollarSign, MousePointerClick, TrendingUp, Wallet, Target } from "lucide-react";
import { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const referralChart = [
  { month: "يناير", signups: 3, sales: 2 },
  { month: "فبراير", signups: 5, sales: 3 },
  { month: "مارس", signups: 7, sales: 5 },
  { month: "أبريل", signups: 4, sales: 3 },
  { month: "ماي", signups: 8, sales: 6 },
  { month: "يونيو", signups: 6, sales: 4 },
];

const payouts = [
  { id: "1", amount: 500, status: "completed", method: "CashPlus", date: "2026-03-01" },
  { id: "2", amount: 320, status: "processing", method: "Virement", date: "2026-03-10" },
  { id: "3", amount: 170, status: "pending", method: "CashPlus", date: "2026-03-15" },
];

const payoutStatusLabels: Record<string, string> = { completed: "تم الدفع", processing: "قيد المعالجة", pending: "قيد الانتظار" };
const payoutStatusColors: Record<string, string> = { completed: "text-green-400 bg-green-400/10", processing: "text-blue-400 bg-blue-400/10", pending: "text-accent bg-accent/10" };

const AffiliateReferrals = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "codconnect.ma/ref/username";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const leaderboard = [
    { name: "محمد ب.", avatar: "م", referrals: 42, sales: 38, earnings: 1260 },
    { name: "سارة ل.", avatar: "س", referrals: 31, sales: 27, earnings: 930 },
    { name: "يوسف ع.", avatar: "ي", referrals: 25, sales: 22, earnings: 750 },
    { name: "أمينة ر.", avatar: "أ", referrals: 19, sales: 15, earnings: 520 },
    { name: "حسن م.", avatar: "ح", referrals: 14, sales: 11, earnings: 380 },
  ];

  return (
    <AffiliateLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">برنامج الإحالات</h1>

        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold">رابط الإحالة ديالك</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-secondary/50 rounded-lg px-4 py-3 text-sm text-muted-foreground font-mono" dir="ltr">
              {referralLink}
            </div>
            <button onClick={handleCopy} className="px-4 py-3 rounded-lg gradient-teal text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              <Copy className="h-4 w-4" />
              {copied ? "تم النسخ!" : "نسخ"}
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="النقرات" value={1480} icon={<MousePointerClick className="h-6 w-6" />} tooltip="عدد النقرات على رابط الإحالة" />
          <StatCard title="التسجيلات" value={25} icon={<Users className="h-6 w-6" />} tooltip="عدد المسجلين عبر رابطك" trend={12} />
          <StatCard title="المبيعات" value={18} icon={<TrendingUp className="h-6 w-6" />} tooltip="عدد المبيعات من إحالاتك" trend={8} />
          <StatCard title="معدل التحويل" value={7.2} icon={<Target className="h-6 w-6" />} suffix="%" tooltip="نسبة التحويل من نقرة لتسجيل" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold">تطور الإحالات والمبيعات</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referralChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                  <XAxis dataKey="month" stroke="hsl(210 15% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(210 15% 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(210 45% 13%)", border: "1px solid hsl(174 50% 30%)", borderRadius: "8px", color: "hsl(210 20% 95%)" }} />
                  <Bar dataKey="signups" fill="hsl(174 72% 46%)" radius={[4, 4, 0, 0]} name="تسجيلات" />
                  <Bar dataKey="sales" fill="hsl(42 78% 55%)" radius={[4, 4, 0, 0]} name="مبيعات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              لوحة المتصدرين
            </h2>
            <div className="space-y-2">
              {leaderboard.map((user, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? "bg-accent/20 text-accent" : i === 1 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="h-8 w-8 rounded-full gradient-teal flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.referrals} إحالة • {user.sales} بيع</p>
                  </div>
                  <span className="gold-badge whitespace-nowrap">{user.earnings} DH</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payouts */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            سجل المدفوعات
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-right p-3 font-medium text-muted-foreground">المبلغ</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">الطريقة</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">التاريخ</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b border-border/30 last:border-0">
                    <td className="p-3 font-bold">{p.amount} DH</td>
                    <td className="p-3 text-muted-foreground">{p.method}</td>
                    <td className="p-3 text-muted-foreground">{p.date}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${payoutStatusColors[p.status]}`}>
                        {payoutStatusLabels[p.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateReferrals;
