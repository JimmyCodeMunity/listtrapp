import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "../lib/api";
import toast from "react-hot-toast";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Heart } from "lucide-react";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setWishlistIds([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/wishlist");
      const wishlistData = res.data.wishlist || [];
      setWishlist(wishlistData);
      setWishlistIds(wishlistData.map((item) => item._id));
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setWishlist([]);
      setWishlistIds([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  // Add to wishlist
  const addToWishlist = useCallback(
    async (productId) => {
      if (!user) {
        toast.error("Please login to add to wishlist");
        return false;
      }

      setOperationLoading(true);
      try {
        const res = await api.post(`/wishlist/${productId}`);
        if (res.data.success) {
          await fetchWishlist();
          toast.success("Added to wishlist");
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error adding to wishlist:", err);
        toast.error(err.response?.data?.message || "Failed to add to wishlist");
        return false;
      } finally {
        setOperationLoading(false);
      }
    },
    [user, fetchWishlist]
  );

  // Remove from wishlist
  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!user) {
        return false;
      }

      setOperationLoading(true);
      try {
        const res = await api.delete(`/wishlist/${productId}`);
        if (res.data.success) {
          await fetchWishlist();
          toast.success("Removed from wishlist");
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error removing from wishlist:", err);
        toast.error("Failed to remove from wishlist");
        return false;
      } finally {
        setOperationLoading(false);
      }
    },
    [user, fetchWishlist]
  );

  // Toggle wishlist (add if not present, remove if present)
  const toggleWishlist = useCallback(
    async (productId) => {
      if (!user) {
        toast.error("Please login to add to wishlist");
        return { success: false, isInWishlist: false };
      }

      setOperationLoading(true);
      try {
        const res = await api.post(`/wishlist/toggle/${productId}`);
        if (res.data.success) {
          await fetchWishlist();
          toast.success(res.data.message);
          return {
            success: true,
            isInWishlist: res.data.isInWishlist,
          };
        }
        return { success: false, isInWishlist: false };
      } catch (err) {
        console.error("Error toggling wishlist:", err);
        const errorMessage = err.response?.data?.message || "Failed to update wishlist";
        toast.error(errorMessage);
        return { success: false, isInWishlist: false };
      } finally {
        setOperationLoading(false);
      }
    },
    [user, fetchWishlist]
  );

  // Clear wishlist (on logout)
  const clearWishlist = useCallback(() => {
    setWishlist([]);
    setWishlistIds([]);
  }, []);

  const value = {
    wishlist,
    wishlistIds,
    loading,
    operationLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlist,
    clearWishlist,
    wishlistCount: wishlistIds.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <LoadingOverlay 
        isVisible={operationLoading} 
        message="Updating wishlist..." 
        icon={<Heart className="w-6 h-6 text-red-500 animate-pulse" />}
      />
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
