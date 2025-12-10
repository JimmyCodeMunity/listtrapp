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
  
  // Use ref to store latest activeConversation to avoid stale closures
  const activeConversationRef = useRef(activeConversation);
  
  // Update ref whenever activeConversation changes
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

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

  // Handle new message received - use ref to avoid stale closures
  const handleNewMessage = useCallback((message) => {
    const currentActiveConv = activeConversationRef.current;
    
    // Add to messages state if it's for the active conversation
    // Convert both to strings to ensure comparison works
    const activeConvId = currentActiveConv?._id?.toString();
    const messageConvId = message.conversationId?.toString();
    
    if (currentActiveConv && activeConvId === messageConvId) {
      setMessages((prev) => {
        // Check for duplicates
        const exists = prev.some(m => m._id === message._id);
        if (exists) {
          return prev;
        }
        return [...prev, message];
      });
    }

    // Update conversations list
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
          // Only increment unread count if message is from someone else
          // senderId might be populated object or string
          unreadCount: (typeof message.senderId === 'object' ? message.senderId?._id : message.senderId)?.toString() !== user?.user?._id?.toString() 
            ? {
                ...prev[conversationIndex].unreadCount,
                [user?.user?._id]: (prev[conversationIndex].unreadCount?.[user?.user?._id] || 0) + 1,
              }
            : prev[conversationIndex].unreadCount,
        };
        
        // Move updated conversation to top
        const updated = [...prev];
        updated.splice(conversationIndex, 1); // Remove from current position
        return [updatedConv, ...updated]; // Add to top
      }
      
      // If conversation not found, we'll fetch it after this callback
      return prev;
    });
    
    // After updating state, check if we need to fetch conversation details
    const conversationExists = conversations.some(
      c => c._id?.toString() === message.conversationId?.toString()
    );
    
    if (!conversationExists && message.conversationId) {
      // Fetch conversation details asynchronously
      fetchConversationDetails(message.conversationId).catch(err => 
        console.error("Failed to fetch conversation:", err)
      );
    }
  }, [user, conversations]);
  
  // Fetch conversation details when a new conversation is detected
  const fetchConversationDetails = useCallback(async (conversationId) => {
    try {
      // Get the conversation details with messages
      const response = await api.get(`/conversations/${conversationId}/messages?limit=1`);
      if (response.data && response.data.messages && response.data.messages.length > 0) {
        const lastMessage = response.data.messages[0];
        
        // Extract sender ID (might be object or string)
        const senderId = typeof lastMessage.senderId === 'object' 
          ? lastMessage.senderId?._id 
          : lastMessage.senderId;
        
        const recipientId = typeof lastMessage.recipientId === 'object'
          ? lastMessage.recipientId?._id
          : lastMessage.recipientId;
        
        // Get the other participant ID (not current user)
        const currentUserId = user?.user?._id?.toString();
        const otherUserId = senderId?.toString() === currentUserId 
          ? recipientId 
          : senderId;
        
        if (!otherUserId) {
          console.error("Could not determine other user ID");
          return;
        }
        
        // Fetch the full conversation with participants
        const convResponse = await api.get(`/conversations/${otherUserId}`);
        if (convResponse.data && convResponse.data.conversation) {
          const newConversation = convResponse.data.conversation;
          
          setConversations((prev) => {
            // Check if conversation already exists (avoid duplicates)
            const exists = prev.some(c => c._id?.toString() === conversationId.toString());
            if (exists) return prev;
            
            // Add new conversation to the top of the list
            return [newConversation, ...prev];
          });
          
          // Show notification for new conversation
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
        
        // Always add conversation to list (even if empty - it will get messages soon)
        setConversations((prev) => {
          const convId = response.data.conversation._id?.toString();
          const existingIndex = prev.findIndex(c => c._id?.toString() === convId);
          
          if (existingIndex !== -1) {
            // Update existing conversation and move to top
            const updated = [...prev];
            const updatedConv = response.data.conversation;
            updated.splice(existingIndex, 1);
            return [updatedConv, ...updated];
          }
          
          // Add new conversation to the top
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

  // Load more messages for pagination
  const loadMoreMessages = async (conversationId, before) => {
    try {
      // Convert to Date object if it's a string
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

  // Mark messages as read
  const markAsRead = async (conversationId) => {
    try {
      await api.put(`/conversations/${conversationId}/read`);
      
      // Update unread count in conversations list
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

  // Send message to recipient
  const sendMessage = async (recipientId, text) => {
    if (!socket || !connected) {
      toast.error("You're not connected. Please check your internet connection and try again.");
      return false;
    }

    return new Promise((resolve, reject) => {
      // Set timeout for message send
      const timeout = setTimeout(() => {
        reject(new Error("Message send timeout. Please try again."));
      }, 10000); // 10 second timeout

      socket.emit(
        "message:send",
        { recipientId, text, conversationId: activeConversation?._id },
        (ack) => {
          clearTimeout(timeout);
          
          if (ack && ack.success) {
            // Add message to local state
            if (ack.message) {
              setMessages((prev) => {
                // Check for duplicates before adding
                const exists = prev.some(m => m._id === ack.message._id);
                if (exists) {
                  return prev;
                }
                return [...prev, ack.message];
              });
              
              // Update activeConversation with the conversation ID if it was just created
              if (activeConversation && !activeConversation._id && ack.message.conversationId) {
                setActiveConversation({
                  ...activeConversation,
                  _id: ack.message.conversationId,
                });
              }
              
              // Add or update conversation in list after message is sent
              const conversationId = ack.message.conversationId;
              
              // Update activeConversation with the conversation ID if it was just created
              if (activeConversation && !activeConversation._id && conversationId) {
                setActiveConversation(prev => ({
                  ...prev,
                  _id: conversationId,
                }));
              }
              
              // Update conversations list
              if (activeConversation) {
                const convId = conversationId || activeConversation._id;
                
                setConversations((prev) => {
                  const existingIndex = prev.findIndex(c => c._id?.toString() === convId?.toString());
                  
                  // Create updated conversation object
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
                    // Add new conversation to the top
                    return [updatedConv, ...prev];
                  }
                  
                  // Update existing conversation and move to top
                  const updated = [...prev];
                  updated.splice(existingIndex, 1);
                  return [updatedConv, ...updated];
                });
              }
            }
            resolve(true);
          } else {
            // Handle message send failure
            const errorMessage = ack?.error || "Message couldn't be sent. Please try again.";
            toast.error(errorMessage);
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
            // Deduplicate conversations by ID
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
