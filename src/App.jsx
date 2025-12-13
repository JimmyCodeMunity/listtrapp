import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductView from "./pages/ProductView";
import ScrollToTop from "./layout/ScrollToTop";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPage from "./pages/auth/ForgotPage";
import VerifyPage from "./pages/auth/VerifyPage";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { useMaintenance } from "./context/MaintenanceContext";
import LoadingPage from "./components/LoadingPage";
import { MaintenancePage } from "./pages/MaintenancePage";
import ProfilePage from "./pages/ProfilePage";
import SellerCatalogue from "./pages/SellerCatalogue";
import ChatPage from "./pages/ChatPage";
import SignInPage from "./pages/auth/SignInPage";
import SearchPage from "./pages/SearchPage";
import { SupportChatButton } from "./components/SupportChatButton";
import BoostRatesPage from "./pages/BoostRatesPage";

function App() {
  // add loading page before rendering a page
  const { loading, isAuthenticated } = useAuth();
  const { maintenanceMode, maintenanceMessage, loading: maintenanceLoading } = useMaintenance();

  // Show loading while checking maintenance status
  if (maintenanceLoading || loading) {
    return <LoadingPage />;
  }

  // Show maintenance page if enabled
  if (maintenanceMode) {
    return <MaintenancePage message={maintenanceMessage} />;
  }

  return (
    <>
      <ScrollToTop />
      <Toaster 
      
      position="bottom-right" />
      {(
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/boost-rates" element={<BoostRatesPage />} />

          {/* Protected Routes */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/:id"
            element={
              <ProtectedRoute>
                <SellerCatalogue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:tab"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="auth/signin" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="auth/signup" element={<RegisterPage />} />
          <Route path="auth/forgot-credentials" element={<ForgotPage />} />
          <Route path="auth/verify-email/:token" element={<VerifyPage />} />
          <Route
            path="auth/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      )}
      
      {/* Support Chat Button - Only show when authenticated */}
      {isAuthenticated && <SupportChatButton />}
    </>
  );
}

export default App;
