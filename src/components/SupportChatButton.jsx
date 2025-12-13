// front/src/components/SupportChatButton.jsx
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import api from "../lib/api";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

export function SupportChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket, connected } = useSocket();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Load support conversation
  useEffect(() => {
    if (isOpen && !conversationId) {
      loadSupportConversation();
    }
  }, [isOpen]);

  // Listen for new support messages
  useEffect(() => {
    if (!socket || !connected) return;

    const handleSupportMessage = (message) => {
      console.log("📨 Support message received:", message);
      
      // Add to messages
      setMessages((prev) => [...prev, message]);
      
      // Increment unread if chat is closed
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
        toast.success("New message from support");
      }
    };

    socket.on("support:message", handleSupportMessage);

    return () => {
      socket.off("support:message", handleSupportMessage);
    };
  }, [socket, connected, isOpen]);

  // Load or create support conversation
  const loadSupportConversation = async () => {
    try {
      console.log("Loading support conversation...");
      const res = await api.get("/support/conversation");
      console.log("Conversation loaded:", res.data);
      
      if (res.data.conversation && res.data.conversation._id) {
        setConversationId(res.data.conversation._id);
        setMessages(res.data.messages || []);
        setUnreadCount(0);
        console.log("Conversation ID set:", res.data.conversation._id);
      } else {
        console.error("Invalid conversation response:", res.data);
        toast.error("Failed to initialize chat");
      }
    } catch (err) {
      console.error("Error loading support conversation:", err);
      console.error("Error details:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to load chat");
    }
  };

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    let currentConversationId = conversationId;

    // If no conversation ID, load it first
    if (!currentConversationId) {
      console.log("No conversation ID, loading conversation first...");
      try {
        const res = await api.get("/support/conversation");
        console.log("Conversation loaded for send:", res.data);
        
        if (res.data.conversation && res.data.conversation._id) {
          currentConversationId = res.data.conversation._id;
          setConversationId(currentConversationId);
          setMessages(res.data.messages || []);
        } else {
          toast.error("Failed to initialize chat. Please try again.");
          return;
        }
      } catch (err) {
        console.error("Error loading conversation:", err);
        toast.error("Failed to initialize chat. Please try again.");
        return;
      }
    }

    console.log("Sending message:", { conversationId: currentConversationId, text: messageText.trim() });
    setSending(true);
    try {
      const res = await api.post("/support/send", {
        conversationId: currentConversationId,
        text: messageText.trim(),
      });

      console.log("Send response:", res.data);

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setMessageText("");
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      console.error("Error response:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Toggle chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-400 hover:bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Popover */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-orange-400 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Support Chat</h3>
                <p className="text-xs text-blue-100">
                  {connected ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-orange-500 p-1 rounded"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Start a conversation with support</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = !msg.isAdmin;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        isUser
                          ? "bg-orange-400 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      {!isUser && (
                        <p className="text-xs font-normal mb-1 text-orange-400">
                          Support Team
                        </p>
                      )}
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isUser ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white rounded-b-lg">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                disabled={sending || !connected}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <button
                type="submit"
                disabled={sending || !messageText.trim() || !connected}
                className="bg-orange-400 hover:bg-orange-500 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
