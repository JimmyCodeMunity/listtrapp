import React from "react";
import { Heart, Loader2 } from "lucide-react";

const LoadingOverlay = ({ isVisible, message = "Processing...", icon = null }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 shadow-xl">
        <div className="flex items-center space-x-2">
          {icon || <Loader2 className="w-6 h-6 animate-spin text-orange-500" />}
          <span className="text-lg font-medium text-gray-800">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;