import React from "react";

// Skeleton loader for conversation list items
export const ConversationSkeleton = () => {
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-100 animate-pulse">
      {/* Avatar skeleton */}
      <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>

      {/* Content skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
  );
};

// Skeleton loader for message items
export const MessageSkeleton = () => {
  return (
    <div className="flex justify-start mb-4 animate-pulse">
      <div className="max-w-xs md:max-w-md">
        <div className="h-16 bg-gray-200 rounded-lg w-64"></div>
        <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
      </div>
    </div>
  );
};

// Generic skeleton loader
export const Skeleton = ({ className = "" }) => {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
  );
};

export default {
  ConversationSkeleton,
  MessageSkeleton,
  Skeleton,
};
