import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getAccessToken } from "../lib/api";
import api from "../lib/api";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

// ──────────────────────────────────────────────────────────────
// NOTIFICATION SOUND – put listtr.wav in public/sounds/listtr.wav
// ──────────────────────────────────────────────────────────────
const notificationSound = new Audio("/sounds/listtr.wav");
notificationSound.preload = "auto";
notificationSound.volume = 0.5; // nice and gentle

// Play sound safely (resets + handles autoplay policy)
const playMessageSound = () => {
  notificationSound.currentTime = 0;
  notificationSound.play().catch(() => {
    // Autoplay blocked – ignore silently (user will hear it after first interaction)
  });
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated, accessToken } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeouts = [1000, 2000, 4000, 8000, 16000];

  const activeConversationRef = useRef(activeConversation);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // ──────────────────────────────────────────────────────────────
  // YOUR ORIGINAL CODE STARTS HERE (only handleNewMessage modified)
  // ──────────────────────────────────────────────────────────────

  const connect = useCallback(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    const newSocket = io(import.meta.env.VITE_WS_URL || "http://localhost:5000", {
      withCredentials: true,
      autoConnect: false,
      reconnection: false,
      auth: {
        token: getAccessToken() || accessToken,
      },
    });

    newSocket.on("connect", () => {
      setConnected(true);
      setConnectionStatus("connected");
      reconnectAttempts.current = 0;
      setReconnectAttempt(0);

      if (activeConversation) {
        syncMissedMessages(activeConversation._id);
      }
    });

    newSocket.on("disconnect", (reason) => {
      setConnected(false);
      setConnectionStatus("disconnected");

      if (reason === "io server disconnect") return;

      attemptReconnection(newSocket);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);

      if (error.message === "Authentication error" || error.message === "Invalid token") {
        toast.error("Chat authentication failed. Please refresh the page and login again.");
        setConnectionStatus("disconnected");
        return;
      }

      attemptReconnection(newSocket);
    });

    newSocket.on("message:new", handleNewMessage);
    newSocket.on("message:delivered", handleMessageDelivered);
    newSocket.on("message:read", handleMessageRead);

    newSocket.on("user:online", handleUserOnline);
    newSocket.on("user:offline", handleUserOffline);

    newSocket.connect();
    setSocket(newSocket);
  }, [isAuthenticated, accessToken, activeConversation]);

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
      const currentToken = getAccessToken();
      if (currentToken && socketInstance) {
        socketInstance.auth = { token: currentToken };
        socketInstance.connect();
      }
    }, delay);
  };

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

  // ──────────────────────── MODIFIED PART (SOUND ADDED) ────────────────────────
  const handleNewMessage = useCallback((message) => {
    const currentActiveConv = activeConversationRef.current;

    const activeConvId = currentActiveConv?._id?.toString();
    const messageConvId = message.conversationId?.toString();

    // ─── PLAY SOUND ONLY IF MESSAGE IS FROM SOMEONE ELSE ───
    const senderId = typeof message.senderId === "object" ? message.senderId?._id : message.senderId;
    const isFromMe = senderId?.toString() === user?.user?._id?.toString();
    const isActiveConversation = currentActiveConv && activeConvId === messageConvId;

    if (!isFromMe) {
      // Play sound when tab is hidden OR user is not viewing this chat
      if (document.hidden || !isActiveConversation) {
        playMessageSound();
      }
    }

    // ─── YOUR ORIGINAL LOGIC (unchanged) ───
    if (currentActiveConv && activeConvId === messageConvId) {
      setMessages((prev) => {
        const exists = prev.some(m => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
    }

    setConversations((prev) => {
      const conversationIndex = prev.findIndex(c => c._id?.toString() === message.conversationId?.toString());
      if (conversationIndex !== -1) {
        const updatedConv = {
          ...prev[conversationIndex],
          lastMessage: {
            text: message.text,
            senderId: message.senderId,
            createdAt: message.createdAt,
          },
          updatedAt: message.createdAt,
          unreadCount: !isFromMe
            ? {
                ...prev[conversationIndex].unreadCount,
                [user?.user?._id]: (prev[conversationIndex].unreadCount?.[user?.user?._id] || 0) + 1,
              }
            : prev[conversationIndex].unreadCount,
        };

        const updated = [...prev];
        updated.splice(conversationIndex, 1);
        return [updatedConv, ...updated];
      }
      return prev;
    });

    const conversationExists = conversations.some(
      c => c._id?.toString() === message.conversationId?.toString()
    );

    if (!conversationExists && message.conversationId) {
      fetchConversationDetails(message.conversationId).catch(err =>
        console.error("Failed to fetch conversation:", err)
      );
    }
  }, [user, conversations]);
  // ──────────────────────── END OF MODIFIED PART ────────────────────────

  const fetchConversationDetails = useCallback(async (conversationId) => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages?limit=1`);
      if (response.data && response.data.messages && response.data.messages.length > 0) {
        const lastMessage = response.data.messages[0];

        const senderId = typeof lastMessage.senderId === 'object'
          ? lastMessage.senderId?._id
          : lastMessage.senderId;

        const recipientId = typeof lastMessage.recipientId === 'object'
          ? lastMessage.recipientId?._id
          : lastMessage.recipientId;

        const currentUserId = user?.user?._id?.toString();
        const otherUserId = senderId?.toString() === currentUserId ? recipientId : senderId;

        if (!otherUserId) {
          console.error("Could not determine other user ID");
          return;
        }

        const convResponse = await api.get(`/conversations/${otherUserId}`);
        if (convResponse.data && convResponse.data.conversation) {
          const newConversation = convResponse.data.conversation;

          setConversations((prev) => {
            const exists = prev.some(c => c._id?.toString() === conversationId.toString());
            if (exists) return prev;
            return [newConversation, ...prev];
          });

          const otherUser = newConversation.participants?.find(
            p => p._id?.toString() !== currentUserId
          );
          if (otherUser) {
            toast.success(`New message from ${otherUser.username}`);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  }, [user]);

  const handleMessageDelivered = useCallback(({ messageId, deliveredAt }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, status: "delivered", deliveredAt } : msg
      )
    );
  }, []);

  const handleMessageRead = useCallback(({ messageId, readAt }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, status: "read", readAt } : msg
      )
    );
  }, []);

  const handleUserOnline = useCallback(({ userId }) => {
    setOnlineUsers((prev) => {
      if (!prev.includes(userId)) {
        return [...prev, userId];
      }
      return prev;
    });
  }, []);

  const handleUserOffline = useCallback(({ userId }) => {
    setOnlineUsers((prev) => prev.filter((id) => id !== userId));
  }, []);

  const loadConversation = async (userId) => {
    try {
      const response = await api.get(`/conversations/${userId}`);
      if (response.data && response.data.conversation) {
        setActiveConversation(response.data.conversation);

        const messagesResponse = await api.get(
          `/conversations/${response.data.conversation._id}/messages?limit=50`
        );
        if (messagesResponse.data && messagesResponse.data.messages) {
          setMessages(messagesResponse.data.messages);
        }

        setConversations((prev) => {
          const convId = response.data.conversation._id?.toString();
          const existingIndex = prev.findIndex(c => c._id?.toString() === convId);

          if (existingIndex !== -1) {
            const updated = [...prev];
            const updatedConv = response.data.conversation;
            updated.splice(existingIndex, 1);
            return [updatedConv, ...updated];
          }

          return [response.data.conversation, ...prev];
        });

        return response.data.conversation;
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      const errorMessage = error.response?.data?.message || "Unable to load conversation. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const loadMoreMessages = async (conversationId, before) => {
    try {
      const beforeDate = before instanceof Date ? before : new Date(before);
      const response = await api.get(
        `/conversations/${conversationId}/messages?limit=50&before=${beforeDate.toISOString()}`
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

  const markAsRead = async (conversationId) => {
    try {
      await api.put(`/conversations/${conversationId}/read`);

      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId
            ? { ...conv, unreadCount: { ...conv.unreadCount, [user?.user?._id]: 0 } }
            : conv
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async (recipientId, text) => {
    if (!socket || !connected) {
      toast.error("You're not connected. Please check your internet connection and try again.");
      return false;
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Message send timeout. Please try again."));
      }, 10000);

      socket.emit(
        "message:send",
        { recipientId, text, conversationId: activeConversation?._id },
        (ack) => {
          clearTimeout(timeout);

          if (ack && ack.success) {
            if (ack.message) {
              setMessages((prev) => {
                const exists = prev.some(m => m._id === ack.message._id);
                if (exists) return prev;
                return [...prev, ack.message];
              });

              if (activeConversation && !activeConversation._id && ack.message.conversationId) {
                setActiveConversation({
                  ...activeConversation,
                  _id: ack.message.conversationId,
                });
              }

              const conversationId = ack.message.conversationId;

              if (activeConversation) {
                const convId = conversationId || activeConversation._id;

                setConversations((prev) => {
                  const existingIndex = prev.findIndex(c => c._id?.toString() === convId?.toString());

                  const updatedConv = {
                    ...activeConversation,
                    _id: convId,
                    lastMessage: {
                      text: ack.message.text,
                      senderId: ack.message.senderId,
                      createdAt: ack.message.createdAt,
                    },
                    updatedAt: ack.message.createdAt,
                  };

                  if (existingIndex === -1) {
                    return [updatedConv, ...prev];
                  }

                  const updated = [...prev];
                  updated.splice(existingIndex, 1);
                  return [updatedConv, ...updated];
                });
              }
            }
            resolve(true);
          } else {
            const errorMessage = ack?.error || "Message couldn't be sent. Please try again.";
            toast.error(errorMessage);
            reject(new Error(errorMessage));
          }
        }
      );
    });
  };

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

  useEffect(() => {
    const handleLogout = () => {
      disconnect();
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, [disconnect]);

  useEffect(() => {
    if (connected && user) {
      const loadConversations = async () => {
        setLoadingConversations(true);
        try {
          const response = await api.get("/conversations");
          if (response.data && response.data.conversations) {
            const uniqueConversations = response.data.conversations.reduce((acc, conv) => {
              const convId = conv._id?.toString();
              if (!acc.some(c => c._id?.toString() === convId)) {
                acc.push(conv);
              }
              return acc;
            }, []);

            setConversations(uniqueConversations);
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