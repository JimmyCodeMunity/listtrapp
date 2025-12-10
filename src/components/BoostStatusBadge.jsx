import React from "react";
import { TrendingUp, Clock, XCircle, CheckCircle } from "lucide-react";

const BoostStatusBadge = ({ status, className = "" }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return {
          icon: TrendingUp,
          text: "Boosted",
          className: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
        };
      case "pending":
        return {
          icon: Clock,
          text: "Pending",
          className: "bg-yellow-500 text-white",
        };
      case "rejected":
        return {
          icon: XCircle,
          text: "Rejected",
          className: "bg-red-500 text-white",
        };
      case "expired":
        return {
          icon: Clock,
          text: "Expired",
          className: "bg-gray-500 text-white",
        };
      default:
        return {
          icon: CheckCircle,
          text: "Regular",
          className: "bg-gray-200 text-gray-700",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm ${config.className} ${className}`}>
      <Icon size={12} />
      {config.text}
    </div>
  );
};

export default BoostStatusBadge;