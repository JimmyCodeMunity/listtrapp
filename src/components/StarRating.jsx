import { Star } from "lucide-react";

export const StarRating = ({ rating, onRatingChange, readonly = false, size = 20 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            size={size}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

export const StarRatingDisplay = ({ rating, count, size = 16 }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <Star size={size} className="fill-yellow-400 text-yellow-400" />
        <span className="ml-1 font-medium">{rating?.toFixed(1) || "0.0"}</span>
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-500">({count} reviews)</span>
      )}
    </div>
  );
};
