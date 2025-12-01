import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { 
  clearAccessToken, 
  refreshAccessToken as apiRefreshToken,
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout
} from "../lib/api";

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null); // Store in memory only
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const tokenRefreshInterval = useRef(null);

  // Remove token from localStorage if present (cleanup from old implementation)
  useEffect(() => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    if (localStorage.getItem("accessToken")) {
      localStorage.removeItem("accessToken");
    }
  }, []);

  const getAllAds = async () => {
    try {
      const response = await api.get("/ad/getads");
      const data = response.data;
      setAds(data);
    } catch (error) {
      console.log("error", error);
      toast.error("error while fetching products");
    }
  };

  // get all categories
  const getAllCategories = async () => {
    try {
      const response = await api.get("/cat/getcategories");
      const data = response.data;
      setCategories(data);
    } catch (error) {
      console.log("errorr", error);
      toast.error("error fetching categories");
    }
  };

  const handleSubmit = async (url, body) => {
    try {
      const response = await api.post(url, body);
      return {
        status: response?.status,
        data: response?.data,
      };
    } catch (error) {
      console.log(error);
      return {
        status: error?.response?.status,
        data: error?.response?.data,
      };
    }
  };

  // Login function - stores access token in state (memory only)
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiLogin(email, password);
      
      if (response && response.accessToken) {
        // Store access token in state (memory only)
        setAccessTokenState(response.accessToken);
        
        // Get user data
        const userData = await getCurrentUser();
        setUser(userData);
        
        // Start token refresh interval
        startTokenRefreshInterval();
        
        toast.success("Login successful!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function - calls API logout endpoint and clears state
  const logout = async () => {
    try {
      // Call API logout endpoint
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear access token from memory
      clearAccessToken();
      setAccessTokenState(null);
      
      // Clear user data from state
      setUser(null);
      
      // Stop token refresh interval
      stopTokenRefreshInterval();
      
      // Dispatch custom event for socket disconnection
      window.dispatchEvent(new CustomEvent("logout"));
      
      // Redirect to login page
      navigate("/auth/signin");
      
      toast.success("Logged out successfully");
    }
  };

  // Refresh token function - calls API refresh endpoint
  const refreshToken = async (showErrorToast = false) => {
    try {
      console.log("Calling API refresh token...");
      const newAccessToken = await apiRefreshToken();
      
      if (newAccessToken) {
        console.log("New access token received");
        // Update access token state on successful refresh
        setAccessTokenState(newAccessToken);
        return true;
      }
      
      console.log("No access token returned from refresh");
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // Show error toast only if explicitly requested (not for background refreshes)
      if (showErrorToast) {
        toast.error("Session refresh failed. Please login again.");
      }
      
      // Clear user state and redirect to login if refresh fails
      setUser(null);
      setAccessTokenState(null);
      clearAccessToken();
      stopTokenRefreshInterval();
      
      return false;
    }
  };

  // Check token expiration and proactively refresh
  const checkTokenExpiration = () => {
    if (!accessToken) return;
    
    try {
      // Decode JWT to get expiration time
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;
      
      // Refresh if token expires in less than 5 minutes (300000 ms)
      if (timeUntilExpiration < 300000 && timeUntilExpiration > 0) {
        refreshToken();
      }
    } catch (error) {
      console.error("Error checking token expiration:", error);
    }
  };

  // Start interval to check token expiration every minute
  const startTokenRefreshInterval = () => {
    stopTokenRefreshInterval(); // Clear any existing interval
    
    tokenRefreshInterval.current = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Check every minute
  };

  // Stop token refresh interval
  const stopTokenRefreshInterval = () => {
    if (tokenRefreshInterval.current) {
      clearInterval(tokenRefreshInterval.current);
      tokenRefreshInterval.current = null;
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Attempt to refresh token to get new access token
        console.log("Attempting to refresh token on page load...");
        const refreshed = await refreshToken();
        
        if (refreshed) {
          console.log("Token refresh successful, loading user data...");
          // Load user data if refresh succeeds
          const userData = await getCurrentUser();
          setUser(userData);
          
          // Start token refresh interval
          startTokenRefreshInterval();
        } else {
          console.log("Token refresh returned false");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        console.error("Error details:", error.response?.data || error.message);
        setUser(null);
      } finally {
        // Set loading to false after check completes
        setLoading(false);
      }
    };

    checkAuth();
    
    // Cleanup interval on unmount
    return () => {
      stopTokenRefreshInterval();
    };
  }, []);

  // Listen for unauthorized event from API client
  useEffect(() => {
    const handleUnauthorized = () => {
      // Trigger logout when unauthorized event is fired
      setUser(null);
      setAccessTokenState(null);
      clearAccessToken();
      stopTokenRefreshInterval();
      
      // Dispatch logout event for socket disconnection
      window.dispatchEvent(new CustomEvent("logout"));
      
      // Show appropriate error message to user
      toast.error("Your session has expired. Please login again.");
      
      // Redirect to login
      navigate("/auth/signin");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  useEffect(() => {
    getAllAds();
    getAllCategories();
  }, []);

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    ads,
    getAllAds,
    handleSubmit,
    categories,
    setUser,
    accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
