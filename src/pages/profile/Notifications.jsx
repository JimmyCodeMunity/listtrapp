import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Check, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/user/all`,
        { withCredentials: true }
      );
      // Filter out expired notifications
      const activeNotifications = (response.data.notifications || []).filter(
        (notif) => new Date(notif.expiresAt) > new Date()
      );
      setNotifications(activeNotifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    setActionLoading(notificationId);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/notifications/user/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      toast.success("Marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark as read");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteNotification = async (notificationId) => {
    setActionLoading(notificationId);
    try {
      // Just remove from local state - expired notifications are filtered on fetch
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
      toast.success("Notification removed");
    } catch (error) {
      console.error("Error removing notification:", error);
      toast.error("Failed to remove notification");
    } finally {
      setActionLoading(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/notifications/user/read-all`,
        {},
        { withCredentials: true }
      );
      
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="w-full p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl tracking-wider text-neutral-700 font-semibold">
            Notifications
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            {notifications.filter((n) => !n.isRead).length} unread notifications
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-orange-500 hover:text-orange-600 font-semibold hover:underline transition-all duration-200 px-3 py-1 rounded-lg hover:bg-orange-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="w-full rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-white/20 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -translate-y-12 translate-x-12 opacity-30"></div>
        {notifications.length === 0 ? (
          <div className="p-12 text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mb-6">
              <Bell className="h-10 w-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              No notifications yet
            </h3>
            <p className="text-neutral-500">
              When you get notifications, they'll show up here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 relative z-10">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-neutral-50 transition-colors ${
                  !notification.isRead ? "bg-orange-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-neutral-800">
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        disabled={actionLoading === notification._id}
                        className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-orange-100 rounded-xl transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                        title="Mark as read"
                      >
                        {actionLoading === notification._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      disabled={actionLoading === notification._id}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-100 rounded-xl transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                      title="Delete"
                    >
                      {actionLoading === notification._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
