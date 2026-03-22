import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import AffiliateSignup from "./pages/AffiliateSignup";
import MerchantSignup from "./pages/MerchantSignup";
import MerchantHome from "./pages/MerchantHome";
import PendingApproval from "./pages/PendingApproval";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";
import Services from "./pages/Services";

import MerchantDashboard from "./pages/merchant/MerchantDashboard";
import MerchantProducts from "./pages/merchant/MerchantProducts";
import MerchantOrders from "./pages/merchant/MerchantOrders";
import MerchantAnalytics from "./pages/merchant/MerchantAnalytics";

import AffiliateDashboard from "./pages/affiliate/AffiliateDashboard";
import AffiliateProducts from "./pages/affiliate/AffiliateProducts";
import AffiliateOrders from "./pages/affiliate/AffiliateOrders";
import AffiliateReferrals from "./pages/affiliate/AffiliateReferrals";
import AffiliateTraining from "./pages/affiliate/AffiliateTraining";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminDistribution from "./pages/admin/AdminDistribution";
import AdminServices from "./pages/admin/AdminServices";

const queryClient = new QueryClient();

const DashboardRedirect = () => {
  const { user, isAuthenticated, isPending, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isPending) return <Navigate to="/pending-approval" replace />;
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to={user?.role === "product_owner" ? "/merchant/dashboard" : "/affiliate/dashboard"} replace />;
};

const PendingRoute = () => {
  const { isAuthenticated, isPending, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isPending) return <Navigate to="/dashboard" replace />;
  return <PendingApproval />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/merchant-home" element={<MerchantHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/affiliate-signup" element={<AffiliateSignup />} />
            <Route path="/merchant-signup" element={<MerchantSignup />} />
            <Route path="/pending-approval" element={<PendingRoute />} />
            <Route path="/support" element={<Support />} />
            <Route path="/services" element={<Services />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />

            <Route path="/merchant/dashboard" element={<ProtectedRoute requiredRole="product_owner"><MerchantDashboard /></ProtectedRoute>} />
            <Route path="/merchant/products" element={<ProtectedRoute requiredRole="product_owner"><MerchantProducts /></ProtectedRoute>} />
            <Route path="/merchant/orders" element={<ProtectedRoute requiredRole="product_owner"><MerchantOrders /></ProtectedRoute>} />
            <Route path="/merchant/analytics" element={<ProtectedRoute requiredRole="product_owner"><MerchantAnalytics /></ProtectedRoute>} />

            <Route path="/affiliate/dashboard" element={<ProtectedRoute requiredRole="affiliate"><AffiliateDashboard /></ProtectedRoute>} />
            <Route path="/affiliate/products" element={<ProtectedRoute requiredRole="affiliate"><AffiliateProducts /></ProtectedRoute>} />
            <Route path="/affiliate/orders" element={<ProtectedRoute requiredRole="affiliate"><AffiliateOrders /></ProtectedRoute>} />
            <Route path="/affiliate/referrals" element={<ProtectedRoute requiredRole="affiliate"><AffiliateReferrals /></ProtectedRoute>} />
            <Route path="/affiliate/training" element={<ProtectedRoute requiredRole="affiliate"><AffiliateTraining /></ProtectedRoute>} />

            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute requiredRole="admin"><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute requiredRole="admin"><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/distribution" element={<ProtectedRoute requiredRole="admin"><AdminDistribution /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
