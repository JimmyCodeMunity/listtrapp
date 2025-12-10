import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // Enable cookies for refresh token
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Store access token in memory (not localStorage)
let accessToken = null;

// Queue to hold pending requests during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    // Attach access token to Authorization header if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and token refresh
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3; // Increased from 2 to 3

api.interceptors.response.use(
  (response) => {
    // Reset refresh attempts on successful response
    refreshAttempts = 0;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;

      // Check if we've exceeded max refresh attempts
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        // Redirect to login after max attempts
        console.log("❌ Max refresh attempts exceeded, logging out");
        refreshAttempts = 0;
        processQueue(new Error("Max refresh attempts exceeded"), null);
        
        // Dispatch custom event for unauthorized
        window.dispatchEvent(new CustomEvent("unauthorized"));
        
        return Promise.reject(error);
      }

      isRefreshing = true;
      refreshAttempts++;
      console.log(`🔄 Attempting token refresh (attempt ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS})`);

      try {
        // Call refresh token endpoint with longer timeout
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/refresh`,
          {},
          { 
            withCredentials: true,
            timeout: 15000 // 15 seconds timeout for refresh
          }
        );

        if (response.data && response.data.accessToken) {
          // Update access token in memory
          accessToken = response.data.accessToken;
          console.log("✅ Token refresh successful");
          
          // Reset refresh attempts on success
          refreshAttempts = 0;
          
          // Update Authorization header for original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          // Process queued requests
          processQueue(null, accessToken);
          
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log(`❌ Token refresh failed (attempt ${refreshAttempts}):`, refreshError.message);
        
        // Refresh failed
        processQueue(refreshError, null);
        
        // If we haven't hit max attempts, the error will be caught and retried
        // If we have hit max attempts, redirect to login
        if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
          console.log("❌ All refresh attempts failed, logging out");
          refreshAttempts = 0;
          window.dispatchEvent(new CustomEvent("unauthorized"));
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to set access token (called after login)
export const setAccessToken = (token) => {
  accessToken = token;
};

// Helper function to get access token
export const getAccessToken = () => {
  return accessToken;
};

// Helper function to clear access token (called on logout)
export const clearAccessToken = () => {
  accessToken = null;
  refreshAttempts = 0;
};

// API helper functions
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/userlogin", { email, password });
    
    // Store access token in memory
    if (response.data && response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/user-logout");
    
    // Clear access token from memory
    clearAccessToken();
    
    return response.data;
  } catch (error) {
    // Clear token even if logout fails
    clearAccessToken();
    throw error;
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    
    if (response.data && response.data.accessToken) {
      setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    }
    
    return null;
  } catch (error) {
    clearAccessToken();
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.post("/auth/user-data");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export configured axios instance as default
export default api;
