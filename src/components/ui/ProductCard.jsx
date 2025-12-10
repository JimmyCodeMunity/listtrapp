import { Heart } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist, operationLoading } = useWishlist();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_WS_URL;

  const inWishlist = isInWishlist(product?._id);

  // Toggle wishlist
  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add to wishlist");
      navigate("/auth/signin");
      return;
    }

    await toggleWishlist(product._id);
  };

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleProductClick}
      className="relative w-full shrink-0 overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={operationLoading}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-md disabled:opacity-50"
      >
        <Heart
          className={`w-5 h-5 transition-all duration-200 ${
            inWishlist
              ? "fill-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500"
          }`}
        />
      </button>

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {product?.images && product.images.length > 0 ? (
          <img
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            src={`${url}/${product.images[0]}`}
            alt={product.title || "Product"}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Heart size={48} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h5 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[40px]">
          {product?.title || "Product Title"}
        </h5>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-orange-600">
              ${product?.price?.toLocaleString() || "0"}
            </span>
            {product?.category?.name && (
              <span className="text-xs text-gray-500">{product.category.name}</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleProductClick();
          }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full text-sm font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
