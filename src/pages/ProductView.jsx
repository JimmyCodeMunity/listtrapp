import React, { useState, useEffect } from "react";
import AppLayout from "../layout/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import BreadCrump from "../components/ui/BreadCrump";
import { Link } from "react-router-dom";
import { MessageCircle, PhoneCall, DollarSign, X, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { ProductReviews } from "../components/ProductReviews";
import { StarRatingDisplay } from "../components/StarRating";
import api from "../lib/api";

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const url = import.meta.env.VITE_WS_URL;

  const inWishlist = isInWishlist(product?._id);
  // console.log("product",product)
  // console.log("seller",user)

  // check if the seller matches the logged in user
  const isSeller =
    user?.user?.email === product?.author?.email &&
    user?.user?.username === product?.author?.username;
  // if(isSeller){
  //   console.log("you own this product")
  // }else{
  //   console.log("this is not your product")
  // }

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // This endpoint automatically increments view count
        const res = await api.get(`/ad/${id}`);
        console.log("Product response:", res.data);
        console.log("📊 Ad view tracked for:", res.data.data?.title);
        setProduct(res.data.data);
        setMainImage(res.data.data.images?.[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
        console.error("Error details:", err.response?.data);
        toast.error("Failed to load product");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  // Toggle wishlist
  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      navigate("/auth/signin");
      return;
    }
    if (isSeller) {
      toast.error("You cannot add your own product to wishlist");
      return;
    }

    setIsWishlistLoading(true);
    try {
      await toggleWishlist(product._id);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleMessageSeller = () => {
    if (!product?.author) {
      toast.error("Seller information not available");
      return;
    }
    navigate("/chats", {
      state: {
        author: product.author,
        product: {
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0],
        },
      },
    });
  };

  const handleMakeOffer = () => {
    if (!offerPrice || isNaN(offerPrice) || parseFloat(offerPrice) <= 0) {
      toast.error("Please enter a valid offer price");
      return;
    }

    if (parseFloat(offerPrice) >= product.price) {
      toast.error("Offer price should be less than the product price");
      return;
    }

    // Format the offer message cleanly
    const formattedOfferPrice = parseFloat(offerPrice).toLocaleString();
    const formattedListedPrice = product.price.toLocaleString();

    const offerMessage = `Hello! I am interested in your ${product.title}.

Listed Price: KSh ${formattedListedPrice}
My Offer: KSh ${formattedOfferPrice}

Would you be willing to accept my offer? Looking forward to your response.`;

    navigate("/chats", {
      state: {
        author: product.author,
        product: {
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0],
        },
        initialMessage: offerMessage,
      },
    });
    setShowOfferModal(false);
  };
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors"
          >
            Go Home
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <div className="">
      <AppLayout>
        <BreadCrump
          home="Home"
          category={product?.category?.categoryname}
          subcategory={product?.subcategory?.subcategoryname}
          productname={product?.title}
        />

        {/* product view */}
        <div className="w-full max-w-7xl mx-auto px-8 py-4">
          <div className="w-full grid grid-cols-2 sm:py-4 py-4">
            <div className="w-full h-full bg-white rounded-xl p-3 flex flex-row items-start gap-4">
              <div className="w-[20%] space-y-2">
                {product?.images?.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setMainImage(img);
                      setActiveIndex(index);
                    }}
                    className={`bg-transparent border overflow-hidden border-neutral-100 rounded-xl h-24 w-full flex items-center justify-center cursor-pointer ${
                      activeIndex === index ? "ring-2 ring-orange-500" : ""
                    }`}
                  >
                    <img
                      src={`${url}/${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/200x200?text=No+Image";
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="w-[80%] border border-neutral-100 rounded-xl overflow-hidden">
                <img
                  src={`${url}/${mainImage}`}
                  alt="Product"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x600?text=No+Image";
                  }}
                />
              </div>
            </div>
            <div className="w-full h-full p-5 flex flex-col items-start space-y-4">
              {isSeller && (
                <div
                  class="bg-yellow-50 w-full border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4"
                  role="alert"
                  tabindex="-1"
                  aria-labelledby="hs-with-description-label"
                >
                  <div class="flex">
                    <div class="shrink-0">
                      <svg
                        class="shrink-0 size-4 mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <path d="M12 9v4"></path>
                        <path d="M12 17h.01"></path>
                      </svg>
                    </div>
                    <div class="ms-4">
                      <h3
                        id="hs-with-description-label"
                        class="text-sm font-semibold"
                      >
                        Actions are limited to this product as it belongs to
                        you.
                      </h3>
                      <div class="mt-1 text-sm text-yellow-700">
                        Some features shal be disabled on this product.Kindly
                        view its details in "my ads section" in your profile.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{product?.title}</h2>
                  {product?.reviewCount > 0 && (
                    <div className="mt-2">
                      <StarRatingDisplay
                        rating={product.averageRating}
                        count={product.reviewCount}
                        size={18}
                      />
                    </div>
                  )}
                  <h2 className="text-2xl font-semibold mt-2">
                    Kshs.{product?.price?.toLocaleString()}
                  </h2>
                </div>
                {user && (
                  <button
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    className="p-3 bg-white border-2 border-gray-200 rounded-full hover:border-orange-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    title={
                      inWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart
                      className={`w-6 h-6 transition-all duration-200 ${
                        inWishlist
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    />
                  </button>
                )}
              </div>
              <p className="text-neutral-500 text-xs">{product?.description}</p>
              <div className="w-full grid grid-cols-2 gap-4 py-5">
                {product?.subcategory?.features?.map((feat) => (
                  <div
                    key={feat.key}
                    className="w-full flex flex-col gap-2 items-start"
                  >
                    <p className="font-medium text-sm">{feat.label}:</p>
                    <p className="text-neutral-600 text-xs">
                      {product?.featureValues?.[feat.key] || "N/A"}
                    </p>
                  </div>
                ))}
              </div>

              {/* seller card */}
              <div className="w-full ring-1 ring-neutral-100 shadow-sm min-h-32 rounded-xl p-3 flex flex-row items-center justify-between">
                <div className="w-full flex flex-row items-center space-x-4">
                  {/* profile/ads */}
                  <Link
                    to={isSeller ? `/profile/ads` : `/shop/${product?.author?._id}`}
                    className="h-12 w-12 rounded-full flex flex-row items-center justify-center bg-black"
                  >
                    <p className="text-2xl font-bold text-white">
                      {product?.author?.username?.slice(0, 1)}
                    </p>
                  </Link>
                  <div>
                    <p className="text-xl">{product?.author?.username}</p>
                  </div>
                </div>
                <div className="w-full">
                  {
                    !isSeller &&
                    <button
                    onClick={() => toast.success("Call feature coming soon!")}
                    className="h-12 w-12 rounded-full flex flex-row items-center justify-center bg-orange-500 hover:bg-orange-600 transition-colors"
                  >
                    <PhoneCall size={20} color="white" />
                  </button>
                  }
                </div>
                <div className="w-full">
                  {
                    !isSeller && <button
                    onClick={handleMessageSeller}
                    className="h-12 w-12 rounded-full flex flex-row items-center justify-center bg-neutral-200 hover:bg-neutral-300 transition-colors"
                    title="Message Seller"
                  >
                    <MessageCircle size={20} color="black" />
                  </button>
                  }
                </div>
              </div>

              {/* Make an Offer Button */}
              <button
                onClick={() => setShowOfferModal(true)}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
              >
                <DollarSign size={20} />
                Make an Offer
              </button>
            </div>
          </div>

          {/* Product Reviews */}
          {product && (
            <div className="mt-8">
              <ProductReviews productId={product._id} isSeller={isSeller} />
            </div>
          )}
        </div>

        {/* Make an Offer Modal */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Make an Offer</h3>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Product: {product?.title}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Listed Price:{" "}
                  <span className="font-semibold">
                    KSh {product?.price?.toLocaleString()}
                  </span>
                </p>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Offer Price (KSh)
                </label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="Enter your offer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="1"
                  max={product?.price - 1}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter an amount less than the listed price
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMakeOffer}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Send Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    </div>
  );
};

export default ProductView;
