import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const BoostCountdown = ({ endDate, status }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${seconds}s`);
        }
      } else {
        setTimeLeft("Expired");
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "expired":
        return "text-red-600 bg-red-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Active";
      case "pending":
        return "Pending Approval";
      case "expired":
        return "Expired";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`px-2 py-1 rounded-full font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </div>
      {status === "active" && (
        <div className="flex items-center gap-1 text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{timeLeft}</span>
        </div>
      )}
    </div>
  );
};

export default BoostCountdown;