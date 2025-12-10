// src/pages/MaintenancePage.jsx
import { Wrench, Clock, RefreshCw } from "lucide-react";

export function MaintenancePage({ message }) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-orange-500 rounded-full p-6">
              <Wrench className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Under Maintenance
          </h1>
          <p className="text-gray-600">
            {message || "We are currently performing scheduled maintenance. We'll be back soon!"}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Expected downtime: 15-30 minutes</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Check Again
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400">
          Thank you for your patience. We're working hard to improve your experience.
        </p>
      </div>
    </div>
  );
}
