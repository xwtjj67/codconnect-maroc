import { useEffect, useState } from "react";
import api from "@/services/api";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, Send } from "lucide-react";

const AdminDistribution = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDistributionLogs().catch(() => ({ logs: [] })),
      api.getDistributionState().catch(() => ({ state: null })),
    ]).then(([logsRes, stateRes]) => {
      setLogs(logsRes.logs || []);
      setState(stateRes.state);
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">سجلات التوزيع</h1>
            <p className="text-muted-foreground text-sm">توزيع المسجلين على الشيتات تلقائياً</p>
          </div>
          {state && (
            <Badge variant="outline" className="text-sm px-3 py-1">
              <Send className="h-3.5 w-3.5 ml-1" />
              الشيت التالي: {(state.current_index % state.total_sheets) + 1} / {state.total_sheets}
            </Badge>
          )}
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="text-right">الاسم</TableHead><TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">الدور</TableHead><TableHead className="text-right">الشيت</TableHead>
              <TableHead className="text-right">الحالة</TableHead><TableHead className="text-right">التاريخ</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => (<TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>))}</TableRow>
                ))
              ) : !logs.length ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">لا توجد سجلات توزيع بعد</TableCell></TableRow>
              ) : (
                logs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.user_name || "—"}</TableCell>
                    <TableCell dir="ltr" className="text-right">{log.user_phone || "—"}</TableCell>
                    <TableCell><Badge variant="secondary">{log.user_role === "affiliate" ? "مسوق" : log.user_role === "product_owner" ? "مورد" : log.user_role || "—"}</Badge></TableCell>
                    <TableCell><Badge variant="outline">Sheet {log.sheet_index + 1}</Badge></TableCell>
                    <TableCell>{log.success ? <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-4 w-4" /> نجح</span> : <span className="flex items-center gap-1 text-destructive"><XCircle className="h-4 w-4" /> فشل</span>}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(log.created_at).toLocaleString("ar-MA")}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDistribution;
