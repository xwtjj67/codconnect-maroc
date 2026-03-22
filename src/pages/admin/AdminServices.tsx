
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, RefreshCw, Headphones } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ServiceRequest {
  id: string;
  name: string;
  phone: string;
  role: string;
  service_name: string;
  status: "pending" | "contacted" | "closed";
  created_at: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "قيد الانتظار", className: "bg-accent/20 text-accent border-accent/30" },
  contacted: { label: "تم التواصل", className: "bg-primary/20 text-primary border-primary/30" },
  closed: { label: "مغلق", className: "bg-muted text-muted-foreground border-border" },
};

const AdminServices = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setRequests(data as unknown as ServiceRequest[]);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("service_requests" as any)
      .update({ status } as any)
      .eq("id", id);
    if (error) {
      toast({ title: "خطأ في تحديث الحالة", variant: "destructive" });
    } else {
      toast({ title: "✅ تم تحديث الحالة" });
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: status as any } : r));
    }
  };

  const openWhatsApp = (phone: string, serviceName: string) => {
    const msg = encodeURIComponent(`مرحباً، بخصوص طلبك لخدمة: ${serviceName}`);
    window.open(`https://wa.me/${phone.replace(/^0/, "212")}?text=${msg}`, "_blank");
  };

  return (
    <AdminLayout>
      <div dir="rtl" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Headphones className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">طلبات الخدمات</h1>
            <Badge variant="secondary">{requests.length}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRequests} className="gap-2">
            <RefreshCw className="h-4 w-4" /> تحديث
          </Button>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">لا توجد طلبات حالياً</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">الهاتف</TableHead>
                    <TableHead className="text-right">الدور</TableHead>
                    <TableHead className="text-right">الخدمة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => {
                    const sc = statusConfig[req.status] || statusConfig.pending;
                    return (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.name}</TableCell>
                        <TableCell dir="ltr" className="text-left">{req.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {req.role === "affiliate" ? "مسوق" : "مورد"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{req.service_name}</TableCell>
                        <TableCell>
                          <Select value={req.status} onValueChange={(v) => updateStatus(req.id, v)}>
                            <SelectTrigger className="w-[140px] h-8">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${sc.className}`}>
                                {sc.label}
                              </span>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">قيد الانتظار</SelectItem>
                              <SelectItem value="contacted">تم التواصل</SelectItem>
                              <SelectItem value="closed">مغلق</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {format(new Date(req.created_at), "dd MMM yyyy HH:mm", { locale: ar })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openWhatsApp(req.phone, req.service_name)}
                            title="تواصل عبر واتساب"
                          >
                            <MessageCircle className="h-4 w-4 text-primary" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
