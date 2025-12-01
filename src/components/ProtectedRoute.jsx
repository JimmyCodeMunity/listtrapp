import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingPage from "./LoadingPage";

const ProtectedRoute = ({ children, redirectTo = "/auth/signin" }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingPage />;
  }

  // Redirect to login page if not authenticated
  // Pass original location to login page for post-login redirect
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
