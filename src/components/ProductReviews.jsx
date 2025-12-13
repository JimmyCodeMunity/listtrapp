import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { StarRating, StarRatingDisplay } from "./StarRating";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export const ProductReviews = ({ productId,isSeller }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${productId}`);
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
      await api.post(`/reviews/product/${productId}`, {
        rating,
        comment: comment.trim(),
      });
      
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(5);
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
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        {user && !showForm && !isSeller && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && !isSeller && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Write Your Review</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <StarRating rating={rating} onRatingChange={setRating} size={24} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/1000 characters</p>
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
          <p>No reviews yet. Be the first to review this product!</p>
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
                    <span className="font-medium">{review.user?.username || "Anonymous"}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <StarRatingDisplay rating={review.rating} size={14} />
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
