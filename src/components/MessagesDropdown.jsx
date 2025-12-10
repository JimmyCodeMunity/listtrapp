import { useState, useEffect, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";

export function MessagesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { conversations, loadingConversations } = useSocket();
  const { user } = useAuth();

  // Calculate total unread count
  const unreadCount = conversations.reduce((total, conv) => {
    const userUnread = conv.unreadCount || 0;
    return total + userUnread;
  }, 0);

  // Get other participant in conversation
  const getOtherParticipant = useCallback(
    (conv) => {
      return conv?.participants?.find(
        (p) => p._id?.toString() !== user?.user?._id?.toString()
      );
    },
    [user?.user?._id]
  );

  // Sort conversations by most recent
  const sortedConversations = [...conversations]
    .sort((a, b) => {
      const aTime = new Date(a.lastMessage?.createdAt || a.createdAt);
      const bTime = new Date(b.lastMessage?.createdAt || b.createdAt);
      return bTime - aTime;
    })
    .slice(0, 5); // Show only 5 most recent

  // Navigate to conversation
  const handleConversationClick = (conv) => {
    const otherUser = getOtherParticipant(conv);
    if (otherUser) {
      navigate("/chats", { state: { author: otherUser } });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Message Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <MessageCircle className="w-4 h-4 text-gray-700" />
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
              <h3 className="font-semibold text-lg">Messages</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigate("/chats");
                    setIsOpen(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="overflow-y-auto flex-1">
              {loadingConversations ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading messages...</p>
                </div>
              ) : sortedConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet</p>
                  <button
                    onClick={() => {
                      navigate("/");
                      setIsOpen(false);
                    }}
                    className="mt-4 text-sm text-orange-600 hover:text-orange-700"
                  >
                    Browse products to start chatting
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {sortedConversations.map((conv) => {
                    const otherUser = getOtherParticipant(conv);
                    const unread = conv.unreadCount || 0;

                    return (
                      <div
                        key={conv._id}
                        onClick={() => handleConversationClick(conv)}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          unread > 0 ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {otherUser?.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            {unread > 0 && (
                              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {unread > 9 ? "9+" : unread}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm text-gray-900 truncate">
                                {otherUser?.username || "Unknown User"}
                              </h4>
                              {conv.lastMessage?.createdAt && (
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                  {formatDistanceToNow(
                                    new Date(conv.lastMessage.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-sm mt-1 line-clamp-2 ${
                                unread > 0
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-600"
                              }`}
                            >
                              {conv.lastMessage?.text || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {sortedConversations.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    navigate("/chats");
                    setIsOpen(false);
                  }}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  View all messages
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
