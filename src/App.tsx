import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const AffiliateSignup = lazy(() => import("./pages/AffiliateSignup"));
const MerchantSignup = lazy(() => import("./pages/MerchantSignup"));
const MerchantHome = lazy(() => import("./pages/MerchantHome"));
const PendingApproval = lazy(() => import("./pages/PendingApproval"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Support = lazy(() => import("./pages/Support"));
const Services = lazy(() => import("./pages/Services"));

const MerchantDashboard = lazy(() => import("./pages/merchant/MerchantDashboard"));
const MerchantProducts = lazy(() => import("./pages/merchant/MerchantProducts"));
const MerchantOrders = lazy(() => import("./pages/merchant/MerchantOrders"));
const MerchantAnalytics = lazy(() => import("./pages/merchant/MerchantAnalytics"));

const AffiliateDashboard = lazy(() => import("./pages/affiliate/AffiliateDashboard"));
const AffiliateProducts = lazy(() => import("./pages/affiliate/AffiliateProducts"));
const AffiliateOrders = lazy(() => import("./pages/affiliate/AffiliateOrders"));
const AffiliateReferrals = lazy(() => import("./pages/affiliate/AffiliateReferrals"));
const AffiliateTraining = lazy(() => import("./pages/affiliate/AffiliateTraining"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminDistribution = lazy(() => import("./pages/admin/AdminDistribution"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminTraining = lazy(() => import("./pages/admin/AdminTraining"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const DashboardRedirect = () => {
  const { user, isAuthenticated, isPending, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isPending) return <Navigate to="/pending-approval" replace />;
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to={user?.role === "product_owner" ? "/merchant/dashboard" : "/affiliate/dashboard"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/merchant-home" element={<MerchantHome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/affiliate-signup" element={<AffiliateSignup />} />
              <Route path="/merchant-signup" element={<MerchantSignup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* Pending page is PUBLIC — no auth required */}
              <Route path="/pending-approval" element={<PendingApproval />} />
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
              <Route path="/admin/services" element={<ProtectedRoute requiredRole="admin"><AdminServices /></ProtectedRoute>} />
              <Route path="/admin/training" element={<ProtectedRoute requiredRole="admin"><AdminTraining /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
