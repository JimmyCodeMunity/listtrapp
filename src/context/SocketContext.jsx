import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getAccessToken } from "../lib/api";
import api from "../lib/api";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated, accessToken } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // 'connected', 'reconnecting', 'disconnected'
  const [reconnectAttempt, setReconnectAttempt] = useState(0); // Current reconnection attempt count
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeouts = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff

  // Connect socket only when user is authenticated
  const connect = useCallback(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    // Create socket instance with authentication
    const newSocket = io(import.meta.env.VITE_WS_URL || "http://localhost:5000", {
      withCredentials: true,
      autoConnect: false,
      reconnection: false, // We'll handle reconnection manually
      auth: {
        token: getAccessToken() || accessToken, // Pass access token in auth object
      },
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      setConnected(true);
      setConnectionStatus("connected");
      reconnectAttempts.current = 0;
      setReconnectAttempt(0);
      
      // Sync missed messages on successful reconnection
      if (activeConversation) {
        syncMissedMessages(activeConversation._id);
      }
    });

    newSocket.on("disconnect", (reason) => {
      setConnected(false);
      setConnectionStatus("disconnected");
      
      // Attempt reconnection with exponential backoff
      if (reason === "io server disconnect") {
        // Server disconnected, don't reconnect automatically
        return;
      }
      
      attemptReconnection(newSocket);
    });

    // Handle authentication errors from socket server
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      
      if (error.message === "Authentication error" || error.message === "Invalid token") {
        toast.error("Chat authentication failed. Please refresh the page and login again.");
        setConnectionStatus("disconnected");
        return;
      }
      
      // Attempt reconnection for other errors
      attemptReconnection(newSocket);
    });

    // Message events
    newSocket.on("message:new", handleNewMessage);
    newSocket.on("message:delivered", handleMessageDelivered);
    newSocket.on("message:read", handleMessageRead);

    // Presence events
    newSocket.on("user:online", handleUserOnline);
    newSocket.on("user:offline", handleUserOffline);

    // Connect the socket
    newSocket.connect();
    setSocket(newSocket);
  }, [isAuthenticated, accessToken, activeConversation]);

  // Attempt reconnection with exponential backoff
  const attemptReconnection = (socketInstance) => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      setConnectionStatus("disconnected");
      setReconnectAttempt(0);
      toast.error("Unable to reconnect to chat. Please refresh the page to continue.", {
        duration: 10000,
      });
      return;
    }

    setConnectionStatus("reconnecting");
    reconnectAttempts.current++;
    setReconnectAttempt(reconnectAttempts.current);
    
    const delay = reconnectTimeouts[reconnectAttempts.current - 1] || 16000;
    
    setTimeout(() => {
      // Update auth token before reconnecting
      const currentToken = getAccessToken();
      if (currentToken && socketInstance) {
        socketInstance.auth = { token: currentToken };
        socketInstance.connect();
      }
    }, delay);
  };

  // Sync missed messages on reconnection
  const syncMissedMessages = async (conversationId) => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages?limit=50`);
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error syncing messages:", error);
    }
  };

  // Handle new message received
  const handleNewMessage = useCallback((message) => {
    console.log("📨 New message received:", message);
    console.log("Active conversation:", activeConversation?._id);
    console.log("Message conversation:", message.conversationId);
    
    // Add to messages state if it's for the active conversation
    // Convert both to strings to ensure comparison works
    const activeConvId = activeConversation?._id?.toString();
    const messageConvId = message.conversationId?.toString();
    
    console.log("Comparing (as strings):", { activeConvId, messageConvId });
    
    if (activeConversation && activeConvId === messageConvId) {
      console.log("✅ Adding message to current conversation");
      setMessages((prev) => [...prev, message]);
    } else {
      console.log("⚠️ Message not for active conversation");
    }

    // Update conversations list
    setConversations((prev) => {
      const conversationIndex = prev.findIndex(c => c._id === message.conversationId);
      if (conversationIndex !== -1) {
        const updated = [...prev];
        updated[conversationIndex] = {
          ...updated[conversationIndex],
          lastMessage: {
            text: message.text,
            senderId: message.senderId,
            createdAt: message.createdAt,
          },
          unreadCount: {
            ...updated[conversationIndex].unreadCount,
            [user?._id]: (updated[conversationIndex].unreadCount?.[user?._id] || 0) + 1,
          },
        };
        return updated;
      }
      return prev;
    });
  }, [activeConversation, user]);

  // Handle message delivered event
  const handleMessageDelivered = useCallback(({ messageId, deliveredAt }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, status: "delivered", deliveredAt } : msg
      )
    );
  }, []);

  // Handle message read event
  const handleMessageRead = useCallback(({ messageId, readAt }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, status: "read", readAt } : msg
      )
    );
  }, []);

  // Handle user online event
  const handleUserOnline = useCallback(({ userId }) => {
    setOnlineUsers((prev) => {
      if (!prev.includes(userId)) {
        return [...prev, userId];
      }
      return prev;
    });
  }, []);

  // Handle user offline event
  const handleUserOffline = useCallback(({ userId }) => {
    setOnlineUsers((prev) => prev.filter((id) => id !== userId));
  }, []);

  // Load conversation with a user
  const loadConversation = async (userId) => {
    try {
      const response = await api.get(`/conversations/${userId}`);
      if (response.data && response.data.conversation) {
        setActiveConversation(response.data.conversation);
        
        // Load messages for this conversation
        const messagesResponse = await api.get(
          `/conversations/${response.data.conversation._id}/messages?limit=50`
        );
        if (messagesResponse.data && messagesResponse.data.messages) {
          setMessages(messagesResponse.data.messages);
        }
        
        return response.data.conversation;
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      const errorMessage = error.response?.data?.message || "Unable to load conversation. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Load more messages for pagination
  const loadMoreMessages = async (conversationId, before) => {
    try {
      const response = await api.get(
        `/conversations/${conversationId}/messages?limit=50&before=${before.toISOString()}`
      );
      if (response.data && response.data.messages) {
        setMessages((prev) => [...response.data.messages, ...prev]);
        return response.data.messages;
      }
      return [];
    } catch (error) {
      console.error("Error loading more messages:", error);
      const errorMessage = error.response?.data?.message || "Unable to load older messages. Please try again.";
      toast.error(errorMessage);
      return [];
    }
  };

  // Mark messages as read
  const markAsRead = async (conversationId) => {
    try {
      await api.put(`/conversations/${conversationId}/read`);
      
      // Update unread count in conversations list
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId
            ? { ...conv, unreadCount: { ...conv.unreadCount, [user?._id]: 0 } }
            : conv
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Send message to recipient
  const sendMessage = async (recipientId, text) => {
    console.log("📤 Sending message:", { recipientId, text, conversationId: activeConversation?._id });
    
    if (!socket || !connected) {
      console.error("❌ Socket not connected");
      toast.error("You're not connected. Please check your internet connection and try again.");
      return false;
    }

    return new Promise((resolve, reject) => {
      socket.emit(
        "message:send",
        { recipientId, text, conversationId: activeConversation?._id },
        (ack) => {
          console.log("📬 Message acknowledgment:", ack);
          
          if (ack && ack.success) {
            console.log("✅ Message sent successfully");
            // Add message to local state
            if (ack.message) {
              console.log("Adding message to local state:", ack.message);
              setMessages((prev) => [...prev, ack.message]);
            }
            resolve(true);
          } else {
            console.error("❌ Message send failed:", ack);
            // Handle message send failure with retry option
            const errorMessage = ack?.error || "Message couldn't be sent. Please try again.";
            reject(new Error(errorMessage));
          }
        }
      );
    });
  };

  // Disconnect socket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
    }
    setConnected(false);
    setConnectionStatus("disconnected");
    setReconnectAttempt(0);
    setMessages([]);
    setConversations([]);
    setActiveConversation(null);
    setOnlineUsers([]);
    reconnectAttempts.current = 0;
  }, [socket]);

  // Connect socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
    };
  }, [isAuthenticated, accessToken]);

  // Listen for logout event from AuthContext
  useEffect(() => {
    const handleLogout = () => {
      disconnect();
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, [disconnect]);

  // Load conversations when socket connects
  useEffect(() => {
    if (connected && user) {
      const loadConversations = async () => {
        setLoadingConversations(true);
        try {
          const response = await api.get("/conversations");
          if (response.data && response.data.conversations) {
            setConversations(response.data.conversations);
          }
        } catch (error) {
          console.error("Error loading conversations:", error);
          const errorMessage = error.response?.data?.message || "Unable to load your conversations. Please refresh the page.";
          toast.error(errorMessage);
        } finally {
          setLoadingConversations(false);
        }
      };

      loadConversations();
    }
  }, [connected, user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        connectionStatus,
        reconnectAttempt,
        messages,
        conversations,
        activeConversation,
        onlineUsers,
        loadingConversations,
        sendMessage,
        loadConversation,
        loadMoreMessages,
        markAsRead,
        disconnect,
        setActiveConversation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
