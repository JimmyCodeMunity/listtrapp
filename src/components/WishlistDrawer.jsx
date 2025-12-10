import { Heart, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export function WishlistDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlist, loading, removeFromWishlist } = useWishlist();

  // Remove from wishlist
  const handleRemove = async (adId, e) => {
    e.stopPropagation();
    await removeFromWishlist(adId);
  };

  // Navigate to product
  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-white fill-white" />
              <h2 className="text-xl font-bold text-white">My Wishlist</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Count */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Heart className="w-20 h-20 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Save items you love to view them later
                </p>
                <button
                  onClick={() => {
                    navigate("/");
                    onClose();
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {wishlist.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleProductClick(item)}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Heart size={24} />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {item.category?.name}
                          {item.subcategory?.name && ` • ${item.subcategory.name}`}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-orange-600">
                            ${item.price?.toLocaleString()}
                          </p>
                          <button
                            onClick={(e) => handleRemove(item._id, e)}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  navigate("/");
                  onClose();
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-medium transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
