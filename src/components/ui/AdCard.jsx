import { Heart, TrendingUp, Zap } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";

const AdCard = ({ product }) => {
  const url = import.meta.env.VITE_WS_URL;
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist, operationLoading } = useWishlist();
  const navigate = useNavigate();

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

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/product/${product._id}`);
  };

  // check isUser
  

  return (
    <div
      onClick={handleClick}
      className="relative w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
    >
      {/* Wishlist Button */}
      <button
        // onClick={handleWishlistToggle}
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

      {/* Boost Badge */}
      {product?.isBoosted && product?.boostStatus === "active" && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
          <Zap size={12} />
          Featured
        </div>
      )}

      <div className="relative md:h-60 h-28 overflow-hidden bg-gray-100">
        <img
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
          src={`${url}/${product?.images?.[0]}`}
          alt="product image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
      </div>
      {/* <span className="absolute top-0 left-0 w-28 translate-y-4 -translate-x-6 -rotate-45 bg-black text-center text-sm text-white">
        Sale
      </span> */}
      <div className="mt-4 md:px-5 px-2 md:pb-5 pb-3">
        <h5 className="text-md font-semibold tracking-tight text-slate-900 line-clamp-2 min-h-[48px]">
          {product?.title}
        </h5>
        <div className="md:mt-2.5 mb-5 flex items-center justify-between">
          {/* <div className="flex items-center">
            <span className="mr-2 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
              5.0
            </span>
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-yellow-300"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div> */}
          <p>
            <span className="text-sm font-bold text-orange-600">
              KES.{product?.price?.toLocaleString()}
            </span>
          </p>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={handleClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white md:py-2 py-1 rounded-full text-sm font-medium transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
