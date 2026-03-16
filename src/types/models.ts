import type { OrderStatus, PlanType } from "./auth";

export interface Product {
  id: string;
  name: string;
  price: number;
  commission: number;
  category: string;
  image: string;
  description?: string;
  merchantId: string;
  merchantName?: string;
  merchantPlan?: PlanType;
  stock: number;
  views: number;
  clicks: number;
  orders: number;
  conversionRate: number;
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  clientName: string;
  clientPhone: string;
  city: string;
  status: OrderStatus;
  commission: number;
  price: number;
  affiliateId: string;
  affiliateName?: string;
  merchantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateLink {
  id: string;
  affiliateId: string;
  productId: string;
  code: string;
  url: string;
  clicks: number;
  registrations: number;
  sales: number;
  conversionRate: number;
}

export interface Commission {
  id: string;
  orderId: string;
  affiliateId: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
}

export interface AnalyticsData {
  date: string;
  revenue: number;
  orders: number;
  clicks: number;
  conversions: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  referrals: number;
  sales: number;
  earnings: number;
}

export interface PayoutRecord {
  id: string;
  affiliateId: string;
  amount: number;
  status: "pending" | "processing" | "completed";
  method: string;
  createdAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalAffiliates: number;
  totalMerchants: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommissions: number;
  monthlyGrowth: number;
}
