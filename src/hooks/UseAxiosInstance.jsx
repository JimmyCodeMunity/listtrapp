import api from "../lib/api";

// This hook now returns the centralized api client
// Kept for backward compatibility, but components should import api directly
const useAxiosInstance = () => {
  return api;
};

export default useAxiosInstance;
