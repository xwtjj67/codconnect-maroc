import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import AffiliateSignup from "./pages/AffiliateSignup";
import MerchantSignup from "./pages/MerchantSignup";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";

// Merchant pages
import MerchantDashboard from "./pages/merchant/MerchantDashboard";
import MerchantProducts from "./pages/merchant/MerchantProducts";
import MerchantOrders from "./pages/merchant/MerchantOrders";
import MerchantAnalytics from "./pages/merchant/MerchantAnalytics";

// Affiliate pages
import AffiliateDashboard from "./pages/affiliate/AffiliateDashboard";
import AffiliateProducts from "./pages/affiliate/AffiliateProducts";
import AffiliateOrders from "./pages/affiliate/AffiliateOrders";
import AffiliateReferrals from "./pages/affiliate/AffiliateReferrals";
import AffiliateTraining from "./pages/affiliate/AffiliateTraining";

const queryClient = new QueryClient();

const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === "merchant" ? "/merchant/dashboard" : "/affiliate/dashboard"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/affiliate-signup" element={<AffiliateSignup />} />
            <Route path="/merchant-signup" element={<MerchantSignup />} />
            <Route path="/support" element={<Support />} />

            {/* Legacy redirect */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Merchant routes */}
            <Route path="/merchant/dashboard" element={<ProtectedRoute requiredRole="merchant"><MerchantDashboard /></ProtectedRoute>} />
            <Route path="/merchant/products" element={<ProtectedRoute requiredRole="merchant"><MerchantProducts /></ProtectedRoute>} />
            <Route path="/merchant/orders" element={<ProtectedRoute requiredRole="merchant"><MerchantOrders /></ProtectedRoute>} />
            <Route path="/merchant/analytics" element={<ProtectedRoute requiredRole="merchant"><MerchantAnalytics /></ProtectedRoute>} />

            {/* Affiliate routes */}
            <Route path="/affiliate/dashboard" element={<ProtectedRoute requiredRole="affiliate"><AffiliateDashboard /></ProtectedRoute>} />
            <Route path="/affiliate/products" element={<ProtectedRoute requiredRole="affiliate"><AffiliateProducts /></ProtectedRoute>} />
            <Route path="/affiliate/orders" element={<ProtectedRoute requiredRole="affiliate"><AffiliateOrders /></ProtectedRoute>} />
            <Route path="/affiliate/referrals" element={<ProtectedRoute requiredRole="affiliate"><AffiliateReferrals /></ProtectedRoute>} />
            <Route path="/affiliate/training" element={<ProtectedRoute requiredRole="affiliate"><AffiliateTraining /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
