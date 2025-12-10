import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { StarRating, StarRatingDisplay } from "./StarRating";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export const SellerReviews = ({ sellerId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [shipping, setShipping] = useState(5);
  const [productQuality, setProductQuality] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [sellerId]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/seller/${sellerId}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/reviews/seller/${sellerId}`, {
        rating,
        comment: comment.trim(),
        communication,
        shipping,
        productQuality,
      });
      
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(5);
      setCommunication(5);
      setShipping(5);
      setProductQuality(5);
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Seller Reviews</h3>
        {user && !showForm && user.user?._id !== sellerId && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Review Seller
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Review This Seller</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Overall Rating</label>
              <StarRating rating={rating} onRatingChange={setRating} size={24} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Communication</label>
              <StarRating rating={communication} onRatingChange={setCommunication} size={20} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Shipping Speed</label>
              <StarRating rating={shipping} onRatingChange={setShipping} size={20} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product Quality</label>
              <StarRating rating={productQuality} onRatingChange={setProductQuality} size={20} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this seller..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setComment("");
                setRating(5);
                setCommunication(5);
                setShipping(5);
                setProductQuality(5);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No reviews yet. Be the first to review this seller!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{review.reviewer?.username || "Anonymous"}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <StarRatingDisplay rating={review.rating} size={14} />
                  
                  {/* Rating Breakdown */}
                  {(review.communication || review.shipping || review.productQuality) && (
                    <div className="flex gap-4 mt-2 text-xs text-gray-600">
                      {review.communication && <span>Communication: {review.communication}★</span>}
                      {review.shipping && <span>Shipping: {review.shipping}★</span>}
                      {review.productQuality && <span>Quality: {review.productQuality}★</span>}
                    </div>
                  )}
                  
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
