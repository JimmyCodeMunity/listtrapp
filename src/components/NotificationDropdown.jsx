// src/components/NotificationDropdown.jsx
import { useState, useEffect } from "react";
import { Bell, X, Check } from "lucide-react";
import api from "../lib/api";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { socket, connected } = useSocket();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/user/all");
      // Filter out expired notifications
      const activeNotifications = res.data.notifications.filter(
        (notif) => new Date(notif.expiresAt) > new Date()
      );
      setNotifications(activeNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/user/unread-count");
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Poll every 60 seconds as fallback (reduced from 30s since we have real-time now)
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Listen for real-time notifications via Socket.IO
  useEffect(() => {
    if (!socket || !connected) return;

    const handleNewNotification = (notification) => {
      console.log("📢 New notification received:", notification);
      
      // Add to notifications list
      setNotifications((prev) => [notification, ...prev]);
      
      // Increment unread count
      setUnreadCount((prev) => prev + 1);
      
      // Show toast notification
      toast.success(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket, connected]);

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/user/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      fetchUnreadCount();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await api.post("/notifications/user/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get type icon color
  const getTypeColor = (type) => {
    const colors = {
      info: "text-blue-600 bg-blue-100",
      warning: "text-yellow-600 bg-yellow-100",
      success: "text-green-600 bg-green-100",
      error: "text-red-600 bg-red-100",
      announcement: "text-purple-600 bg-purple-100",
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-4 h-4 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.filter((n) => !n.isRead).length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications
                    .filter((notif) => !notif.isRead)
                    .map((notif) => (
                      <div
                        key={notif._id}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer bg-blue-50"
                        onClick={() => markAsRead(notif._id)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Type Icon */}
                          <div
                            className={`p-2 rounded-full ${getTypeColor(
                              notif.type
                            )}`}
                          >
                            <Bell className="w-4 h-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm text-gray-900">
                                {notif.title}
                              </h4>
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDistanceToNow(new Date(notif.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
