// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useCallback,
//   memo,
// } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useSocket } from "../context/SocketContext";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Send,
//   Search,
//   MoreVertical,
//   Phone,
//   Video,
//   ArrowLeft,
//   ShoppingBag,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { ConversationSkeleton } from "../components/SkeletonLoader";
// import AppLayout from "../layout/AppLayout";

// // Connection Status Component
// const ConnectionStatus = memo(({ connectionStatus, reconnectAttempt }) => {
//   if (connectionStatus === "connected") return null;

//   const config =
//     connectionStatus === "reconnecting"
//       ? {
//           text: `Reconnecting... ${reconnectAttempt > 0 ? `(Attempt ${reconnectAttempt}/5)` : ""}`,
//           dot: "bg-yellow-500 animate-pulse",
//           color: "text-yellow-700",
//           bg: "bg-yellow-50 border-yellow-200",
//         }
//       : connectionStatus === "disconnected"
//       ? {
//           text: "Disconnected",
//           dot: "bg-red-500",
//           color: "text-red-700",
//           bg: "bg-red-50 border-red-200",
//         }
//       : {
//           text: "Connecting...",
//           dot: "bg-gray-500",
//           color: "text-gray-700",
//           bg: "bg-gray-50 border-gray-200",
//         };

//   return (
//     <div className={`px-3 py-2 border-b ${config.bg}`}>
//       <div className="flex items-center justify-center gap-2">
//         <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
//         <span className={`text-xs font-medium ${config.color}`}>
//           {config.text}
//         </span>
//       </div>
//     </div>
//   );
// });

// // Chat Area Component
// const ChatArea = memo(
//   function ChatArea({
//     activeConversation,
//     messages,
//     isLoadingConversation,
//     isLoadingMore,
//     hasMoreMessages,
//     message,
//     setMessage,
//     handleSendMessage,
//     isSending,
//     isMobile,
//     setShowSidebar,
//     getOtherParticipant,
//     isUserOnline,
//     formatTime,
//     getMessageStatusIcon,
//     user,
//     connectionStatus,
//     reconnectAttempt,
//     messagesContainerRef,
//     messagesEndRef,
//     inputRef,
//     handleScroll,
//   }) {
//     if (!activeConversation) {
//       if (isMobile) return null;

//       return (
//         <div className="flex flex-1 items-center justify-center h-full bg-gray-50">
//           <div className="text-center px-4">
//             <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Send size={40} className="text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">
//               Select a conversation
//             </h3>
//             <p className="text-sm text-gray-500">
//               Choose someone from the sidebar to start chatting
//             </p>
//           </div>
//         </div>
//       );
//     }

//     const otherUser = getOtherParticipant(activeConversation);
//     const online = isUserOnline(otherUser?._id);

//     return (
//       <div className="flex flex-1 flex-col h-full bg-gray-50 overflow-hidden min-h-0">
//         <ConnectionStatus
//           connectionStatus={connectionStatus}
//           reconnectAttempt={reconnectAttempt}
//         />

//         {/* Header */}
//         <div className="flex-shrink-0 bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between min-h-[60px]">
//           <div className="flex items-center flex-1 min-w-0">
//             {isMobile && (
//               <button
//                 onClick={() => setShowSidebar(true)}
//                 className="mr-3 p-1 hover:bg-gray-100 rounded-full"
//               >
//                 <ArrowLeft size={20} className="text-gray-600" />
//               </button>
//             )}
//             <div className="relative mr-3 flex-shrink-0">
//               <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
//                 {otherUser?.username?.[0]?.toUpperCase() || "U"}
//               </div>
//               {online && (
//                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//               )}
//             </div>
//             <div className="min-w-0">
//               <h2 className="font-semibold text-gray-900 truncate">
//                 {otherUser?.username || "User"}
//               </h2>
//               <p className="text-xs text-gray-500">
//                 {online ? "Online" : "Offline"}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-1 flex-shrink-0">
//             <button className="p-2 hover:bg-gray-100 rounded-full">
//               <Video size={18} className="text-gray-600" />
//             </button>
//             <button className="p-2 hover:bg-gray-100 rounded-full">
//               <Phone size={18} className="text-gray-600" />
//             </button>
//             <button className="p-2 hover:bg-gray-100 rounded-full">
//               <MoreVertical size={18} className="text-gray-600" />
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         <div
//           ref={messagesContainerRef}
//           onScroll={handleScroll}
//           className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0"
//         >
//           {isLoadingConversation ? (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
//                 <p className="text-sm text-gray-500">Loading messages...</p>
//               </div>
//             </div>
//           ) : (
//             <>
//               {isLoadingMore && hasMoreMessages && (
//                 <div className="flex justify-center py-2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
//                 </div>
//               )}

//               {messages.length === 0 ? (
//                 <div className="flex items-center justify-center h-full text-center text-gray-500">
//                   No messages yet. Say hi! 👋
//                 </div>
//               ) : (
//                 messages.map((msg) => {
//                   // senderId might be populated object or string
//                   const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
//                   const currentUserId = user?.user?._id;
//                   const isOwn = senderId?.toString() === currentUserId?.toString();
                  
//                   return (
//                     <div
//                       key={msg._id}
//                       className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
//                     >
//                       <div
//                         className={`max-w-[70%] rounded-lg px-4 py-2 ${
//                           isOwn
//                             ? "bg-orange-500 text-white"
//                             : "bg-white text-gray-900 border border-gray-200"
//                         }`}
//                       >
//                         <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
//                         <div
//                           className={`flex items-center justify-end gap-1 mt-1 text-xs ${
//                             isOwn ? "text-orange-100" : "text-gray-500"
//                           }`}
//                         >
//                           <span>{formatTime(msg.createdAt)}</span>
//                           {isOwn && getMessageStatusIcon(msg)}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//               <div ref={messagesEndRef} />
//             </>
//           )}
//         </div>

//         {/* Input Area */}
//         <div className="flex-shrink-0 bg-white px-4 py-3 border-t border-gray-200 min-h-[72px]">
//           <div className="flex items-center space-x-2">
//             <div className="flex-1">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 placeholder="Type a message..."
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSendMessage();
//                   }
//                 }}
//                 disabled={isSending}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
//               />
//             </div>
//             {message.trim() ? (
//               <button
//                 onClick={handleSendMessage}
//                 disabled={isSending}
//                 className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 p-2 rounded-full text-white transition-colors"
//               >
//                 {isSending ? (
//                   <div className="animate-spin rounded-full h-[18px] w-[18px] border-b-2 border-white"></div>
//                 ) : (
//                   <Send size={18} />
//                 )}
//               </button>
//             ) : (
//               <button disabled className="p-2 rounded-full text-gray-400">
//                 <Send size={18} />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   },
//   (prevProps, nextProps) => {
//     if (prevProps.activeConversation?._id !== nextProps.activeConversation?._id)
//       return false;
//     if (prevProps.messages.length !== nextProps.messages.length) return false;
//     if (prevProps.isLoadingConversation !== nextProps.isLoadingConversation)
//       return false;
//     if (prevProps.message !== nextProps.message) return false;
//     if (prevProps.isSending !== nextProps.isSending) return false;
//     if (prevProps.connectionStatus !== nextProps.connectionStatus) return false;
//     return true;
//   }
// );

// // Main ChatPage Component
// const ChatPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const {
//     conversations,
//     activeConversation,
//     messages,
//     loadConversation,
//     loadMoreMessages,
//     sendMessage: socketSendMessage,
//     markAsRead,
//     onlineUsers,
//     connectionStatus,
//     reconnectAttempt,
//     loadingConversations,
//   } = useSocket();

//   const author = location.state?.author;
//   const initialMessage = location.state?.initialMessage;

//   const [message, setMessage] = useState("");
//   const [isMobile, setIsMobile] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoadingConversation, setIsLoadingConversation] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [hasMoreMessages, setHasMoreMessages] = useState(true);
//   const [isSending, setIsSending] = useState(false);

//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const inputRef = useRef(null);
//   const previousScrollHeight = useRef(0);
//   const isUserNearBottom = useRef(true); // Track if user is near bottom

//   // Auto-scroll to bottom only if user is near bottom or it's a new message from current user
//   useEffect(() => {
//     if (!messagesContainerRef.current || messages.length === 0) return;

//     const container = messagesContainerRef.current;
//     const isNearBottom = 
//       container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    
//     // Check if the last message is from the current user
//     const lastMessage = messages[messages.length - 1];
//     const senderId = typeof lastMessage?.senderId === 'object' 
//       ? lastMessage?.senderId?._id 
//       : lastMessage?.senderId;
//     const isOwnMessage = senderId?.toString() === user?.user?._id?.toString();

//     // Auto-scroll if user is near bottom OR if it's their own message
//     if (isNearBottom || isOwnMessage) {
//       const timer = setTimeout(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [messages, user?.user?._id]);

//   // Track scroll position to know if user is near bottom
//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       const isNearBottom = 
//         container.scrollHeight - container.scrollTop - container.clientHeight < 150;
//       isUserNearBottom.current = isNearBottom;
//     };

//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Mobile detection
//   useEffect(() => {
//     const checkMobile = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       setShowSidebar(!mobile);
//     };
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Handle mobile keyboard - prevent viewport resize
//   useEffect(() => {
//     if (!isMobile) return;

//     const handleResize = () => {
//       // Use visualViewport to handle keyboard appearance
//       if (window.visualViewport) {
//         const viewport = window.visualViewport;
//         document.documentElement.style.setProperty('--viewport-height', `${viewport.height}px`);
//       }
//     };

//     if (window.visualViewport) {
//       window.visualViewport.addEventListener('resize', handleResize);
//       handleResize(); // Initial call
//     }

//     return () => {
//       if (window.visualViewport) {
//         window.visualViewport.removeEventListener('resize', handleResize);
//       }
//     };
//   }, [isMobile]);

//   // Define helper functions before useEffects that use them
//   const getOtherParticipant = useCallback(
//     (conv) => conv?.participants?.find((p) => p._id?.toString() !== user?.user?._id?.toString()),
//     [user?.user?._id]
//   );

//   // Load conversation if author is provided
//   useEffect(() => {
//     if (author?._id) {
//       // Always load the conversation for the author, even if there's an active one
//       // This ensures we switch to the correct seller when coming from a product page
//       handleSelectConversation(author._id);
//     }
//   }, [author?._id]); // Only depend on author._id to avoid infinite loops

//   // Send initial message if provided
//   useEffect(() => {
//     if (initialMessage && activeConversation && author?._id) {
//       // Only set the message if the active conversation is with the author from the product page
//       const otherUser = getOtherParticipant(activeConversation);
//       if (otherUser?._id?.toString() === author._id?.toString()) {
//         // Only set if message is currently empty to avoid overwriting user's typing
//         if (message === "") {
//           setMessage(initialMessage);
//         }
//         // Clear the location state immediately to prevent reuse
//         navigate(location.pathname, { replace: true, state: {} });
//       }
//     }
//   }, [initialMessage, activeConversation, author, getOtherParticipant, navigate, location.pathname]);

//   // Mark as read
//   useEffect(() => {
//     if (activeConversation?._id) {
//       markAsRead(activeConversation._id);
//     }
//   }, [activeConversation, markAsRead]);

//   const handleSelectConversation = useCallback(
//     async (userId) => {
//       // Don't reload if already loading
//       if (isLoadingConversation) {
//         return;
//       }

//       // Check if we're already in this conversation
//       const isAlreadyActive = activeConversation?.participants?.some(
//         (p) => p._id?.toString() === userId?.toString()
//       );
      
//       if (isAlreadyActive) {
//         // Already in this conversation, just close sidebar on mobile
//         if (isMobile) setShowSidebar(false);
//         return;
//       }

//       // Load the new conversation
//       setIsLoadingConversation(true);
//       try {
//         await loadConversation(userId);
//         if (isMobile) setShowSidebar(false);
//       } catch (err) {
//         toast.error("Failed to load conversation");
//       } finally {
//         setIsLoadingConversation(false);
//       }
//     },
//     [activeConversation, loadConversation, isMobile, isLoadingConversation]
//   );

//   const handleSendMessage = useCallback(
//     async () => {
//       const text = message.trim();
//       if (!text || !activeConversation) return;

//       const recipientId = getOtherParticipant(activeConversation)?._id;
//       if (!recipientId) return;

//       setIsSending(true);

//       try {
//         const success = await socketSendMessage(recipientId, text, activeConversation._id);
//         if (success !== false) {
//           // Clear message immediately after successful send
//           setMessage("");
//           inputRef.current?.focus();
//         }
//       } catch (err) {
//         toast.error("Failed to send message");
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [message, activeConversation, socketSendMessage, getOtherParticipant]
//   );

//   const handleScroll = useCallback(
//     async () => {
//       const el = messagesContainerRef.current;
//       if (!el || isLoadingMore || !hasMoreMessages) return;

//       if (el.scrollTop === 0 && messages.length > 0) {
//         setIsLoadingMore(true);
//         previousScrollHeight.current = el.scrollHeight;

//         try {
//           const oldest = messages[0];
//           if (oldest && activeConversation) {
//             const older = await loadMoreMessages(
//               activeConversation._id,
//               oldest.createdAt
//             );
//             if (older.length === 0) {
//               setHasMoreMessages(false);
//             }

//             // Restore scroll position after new messages are added
//             setTimeout(() => {
//               if (el) {
//                 el.scrollTop = el.scrollHeight - previousScrollHeight.current;
//               }
//             }, 100);
//           }
//         } catch (err) {
//           console.error("Error loading more messages:", err);
//           toast.error("Failed to load older messages");
//         } finally {
//           setIsLoadingMore(false);
//         }
//       }
//     },
//     [messages, activeConversation, loadMoreMessages, isLoadingMore, hasMoreMessages]
//   );

//   useEffect(() => {
//     setHasMoreMessages(true);
//   }, [activeConversation]);

//   const formatTime = useCallback(
//     (ts) => new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
//     []
//   );

//   const getMessageStatusIcon = useCallback(
//     (msg) => {
//       // senderId might be populated object or string
//       const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
//       const currentUserId = user?.user?._id;
//       if (senderId?.toString() !== currentUserId?.toString()) return null;
      
//       switch (msg.status) {
//         case "read":
//           return <span className="ml-1 text-blue-300">✓✓</span>;
//         case "delivered":
//           return <span className="ml-1 opacity-70">✓✓</span>;
//         case "sent":
//           return <span className="ml-1 opacity-50">✓</span>;
//         default:
//           return <span className="ml-1 opacity-30">⏱</span>;
//       }
//     },
//     [user?.user?._id]
//   );

//   const isUserOnline = useCallback(
//     (id) => onlineUsers.includes(id),
//     [onlineUsers]
//   );

//   const getUnreadCount = useCallback(
//     (conv) => conv.unreadCount?.[user?.user?._id] || 0,
//     [user?.user?._id]
//   );

//   const filteredConversations = useCallback(() => {
//     if (!searchQuery.trim()) return conversations;

//     return conversations.filter((conv) => {
//       const other = getOtherParticipant(conv);
//       return other?.username?.toLowerCase().includes(searchQuery.toLowerCase());
//     });
//   }, [conversations, searchQuery, getOtherParticipant]);

//   const sortedConversations = useCallback(() => {
//     return [...filteredConversations()].sort((a, b) => {
//       const aTime = new Date(a.lastMessage?.createdAt || a.createdAt);
//       const bTime = new Date(b.lastMessage?.createdAt || b.createdAt);
//       return bTime - aTime;
//     });
//   }, [filteredConversations]);

//   return (
//     <AppLayout hideFooter={true}>
//       <div
//         className={`${
//           isMobile ? "fixed inset-0 top-16" : "fixed inset-0 top-32"
//         } flex flex-col bg-white`}
//         style={
//           isMobile 
//             ? { height: 'calc(100vh - 64px)', maxHeight: 'calc(100vh - 64px)' } 
//             : { height: 'calc(100vh - 128px)', maxHeight: 'calc(100vh - 128px)' }
//         }
//       >
//         {/* Desktop Header */}
//         {!isMobile && (
//           <div className="bg-white border-b border-gray-200 flex-shrink-0">
//             <div className="max-w-7xl mx-auto h-16 flex items-center px-4">
//               <h1 className="text-xl font-semibold">Messages</h1>
//             </div>
//           </div>
//         )}

//         <div className="flex-1 overflow-hidden min-h-0">
//           <div className="h-full max-w-7xl mx-auto flex">
//             {/* Sidebar */}
//             <div
//               className={`${
//                 isMobile
//                   ? showSidebar
//                     ? "absolute inset-0 z-10"
//                     : "hidden"
//                   : "w-80"
//               } bg-white border-r border-gray-200 flex flex-col h-full`}
//             >
//               {/* Sidebar Header */}
//               <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h1 className="text-lg font-semibold">Chats</h1>
//                   <button className="p-1.5 hover:bg-gray-200 rounded-full">
//                     <MoreVertical size={18} className="text-gray-600" />
//                   </button>
//                 </div>
//               </div>

//               {/* Search */}
//               <div className="px-4 py-3 border-b border-gray-200">
//                 <div className="relative">
//                   <Search
//                     size={16}
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search conversations..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Conversations List */}
//               <div className="flex-1 overflow-y-auto">
//                 {loadingConversations ? (
//                   <>
//                     <ConversationSkeleton />
//                     <ConversationSkeleton />
//                     <ConversationSkeleton />
//                   </>
//                 ) : sortedConversations().length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full text-center px-4">
//                     <ShoppingBag size={48} className="text-gray-400 mb-4" />
//                     <p className="text-sm text-gray-600 mb-4">
//                       {searchQuery
//                         ? "No conversations found"
//                         : "No messages yet"}
//                     </p>
//                     {!searchQuery && (
//                       <button
//                         onClick={() => navigate("/")}
//                         className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors"
//                       >
//                         Browse Products
//                       </button>
//                     )}
//                   </div>
//                 ) : (
//                   sortedConversations().map((conv) => {
//                     const other = getOtherParticipant(conv);
//                     const unread = getUnreadCount(conv);
//                     const active = activeConversation?._id === conv._id;
//                     const online = isUserOnline(other?._id);

//                     return (
//                       <div
//                         key={conv._id}
//                         onClick={() => handleSelectConversation(other._id)}
//                         className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
//                           active ? "bg-orange-50 border-l-4 border-orange-500" : ""
//                         }`}
//                       >
//                         <div className="relative mr-3">
//                           <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
//                             {other?.username?.[0]?.toUpperCase() || "U"}
//                           </div>
//                           {online && (
//                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                           )}
//                         </div>

//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center justify-between mb-1">
//                             <h3 className="font-medium text-gray-900 truncate">
//                               {other?.username || "Unknown"}
//                             </h3>
//                             {conv.lastMessage?.createdAt && (
//                               <span className="text-xs text-gray-500 ml-2">
//                                 {new Date(conv.lastMessage.createdAt).toLocaleTimeString("en-US", {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 })}
//                               </span>
//                             )}
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <p className="text-xs text-gray-600 truncate">
//                               {conv.lastMessage?.text || "No messages yet"}
//                             </p>
//                             {unread > 0 && (
//                               <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
//                                 {unread}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//             {/* Chat Area */}
//             <div
//               className={`${
//                 isMobile && showSidebar ? "hidden" : "flex-1"
//               } flex flex-col`}
//             >
//               <ChatArea
//                 activeConversation={activeConversation}
//                 messages={messages}
//                 isLoadingConversation={isLoadingConversation}
//                 isLoadingMore={isLoadingMore}
//                 hasMoreMessages={hasMoreMessages}
//                 message={message}
//                 setMessage={setMessage}
//                 handleSendMessage={handleSendMessage}
//                 isSending={isSending}
//                 isMobile={isMobile}
//                 setShowSidebar={setShowSidebar}
//                 getOtherParticipant={getOtherParticipant}
//                 isUserOnline={isUserOnline}
//                 formatTime={formatTime}
//                 getMessageStatusIcon={getMessageStatusIcon}
//                 user={user}
//                 connectionStatus={connectionStatus}
//                 reconnectAttempt={reconnectAttempt}
//                 messagesContainerRef={messagesContainerRef}
//                 messagesEndRef={messagesEndRef}
//                 inputRef={inputRef}
//                 handleScroll={handleScroll}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default ChatPage;



import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
} from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import { ConversationSkeleton } from "../components/SkeletonLoader";
import AppLayout from "../layout/AppLayout";

// Connection Status Component (unchanged)
const ConnectionStatus = memo(({ connectionStatus, reconnectAttempt }) => {
  if (connectionStatus === "connected") return null;

  const config =
    connectionStatus === "reconnecting"
      ? {
          text: `Reconnecting... ${reconnectAttempt > 0 ? `(Attempt ${reconnectAttempt}/5)` : ""}`,
          dot: "bg-yellow-500 animate-pulse",
          color: "text-yellow-700",
          bg: "bg-yellow-50 border-yellow-200",
        }
      : connectionStatus === "disconnected"
      ? {
          text: "Disconnected",
          dot: "bg-red-500",
          color: "text-red-700",
          bg: "bg-red-50 border-red-200",
        }
      : {
          text: "Connecting...",
          dot: "bg-gray-500",
          color: "text-gray-700",
          bg: "bg-gray-50 border-gray-200",
        };

  return (
    <div className={`px-3 py-2 border-b ${config.bg}`}>
      <div className="flex items-center justify-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
        <span className={`text-xs font-medium ${config.color}`}>
          {config.text}
        </span>
      </div>
    </div>
  );
});

// Chat Area Component (unchanged except for mobile back button handling)
const ChatArea = memo(
  function ChatArea({
    activeConversation,
    messages,
    isLoadingConversation,
    isLoadingMore,
    hasMoreMessages,
    message,
    setMessage,
    handleSendMessage,
    isSending,
    isMobile,
    onBack, // New prop for mobile back navigation
    getOtherParticipant,
    isUserOnline,
    formatTime,
    getMessageStatusIcon,
    user,
    connectionStatus,
    reconnectAttempt,
    messagesContainerRef,
    messagesEndRef,
    inputRef,
    handleScroll,
  }) {
    if (!activeConversation) {
      return (
        <div className="flex flex-1 items-center justify-center h-full bg-gray-50">
          <div className="text-center px-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Select a conversation
            </h3>
            <p className="text-sm text-gray-500">
              Choose someone from the list to start chatting
            </p>
          </div>
        </div>
      );
    }

    const otherUser = getOtherParticipant(activeConversation);
    const online = isUserOnline(otherUser?._id);

    return (
      <div className="flex flex-1 flex-col h-full bg-gray-50 overflow-hidden min-h-0">
        <ConnectionStatus
          connectionStatus={connectionStatus}
          reconnectAttempt={reconnectAttempt}
        />

        {/* Header */}
        <div className="flex-shrink-0 bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between min-h-[60px]">
          <div className="flex items-center flex-1 min-w-0">
            {isMobile && (
              <button
                onClick={onBack}
                className="mr-3 p-1 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}
            <div className="relative mr-3 flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                {otherUser?.username?.[0]?.toUpperCase() || "U"}
              </div>
              {online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-900 truncate">
                {otherUser?.username || "User"}
              </h2>
              <p className="text-xs text-gray-500">
                {online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Video size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Phone size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0"
        >
          {isLoadingConversation ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading messages...</p>
              </div>
            </div>
          ) : (
            <>
              {isLoadingMore && hasMoreMessages && (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                  No messages yet. Say hi! 👋
                </div>
              ) : (
                messages.map((msg) => {
                  const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
                  const currentUserId = user?.user?._id;
                  const isOwn = senderId?.toString() === currentUserId?.toString();
                  
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwn
                            ? "bg-orange-500 text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                            isOwn ? "text-orange-100" : "text-gray-500"
                          }`}
                        >
                          <span>{formatTime(msg.createdAt)}</span>
                          {isOwn && getMessageStatusIcon(msg)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 bg-white px-4 py-3 border-t border-gray-200 min-h-[72px]">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSending}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
            {message.trim() ? (
              <button
                onClick={handleSendMessage}
                disabled={isSending}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 p-2 rounded-full text-white transition-colors"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-[18px] w-[18px] border-b-2 border-white"></div>
                ) : (
                  <Send size={18} />
                )}
              </button>
            ) : (
              <button disabled className="p-2 rounded-full text-gray-400">
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// Main ChatPage Component - Updated for mobile stack navigation
const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    messages,
    loadConversation,
    loadMoreMessages,
    sendMessage: socketSendMessage,
    markAsRead,
    onlineUsers,
    connectionStatus,
    reconnectAttempt,
    loadingConversations,
  } = useSocket();

  const author = location.state?.author;
  const initialMessage = location.state?.initialMessage;

  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showChatView, setShowChatView] = useState(false); // Controls which view is visible on mobile
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const previousScrollHeight = useRef(0);

  // Auto-scroll logic (unchanged)
  useEffect(() => {
    if (!messagesContainerRef.current || messages.length === 0) return;

    const container = messagesContainerRef.current;
    const isNearBottom = 
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    
    const lastMessage = messages[messages.length - 1];
    const senderId = typeof lastMessage?.senderId === 'object' 
      ? lastMessage?.senderId?._id 
      : lastMessage?.senderId;
    const isOwnMessage = senderId?.toString() === user?.user?._id?.toString();

    if (isNearBottom || isOwnMessage) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, user?.user?._id]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, always start with chat list unless a conversation is already active
      if (mobile && !activeConversation) {
        setShowChatView(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [activeConversation]);

  // Helper functions
  const getOtherParticipant = useCallback(
    (conv) => conv?.participants?.find((p) => p._id?.toString() !== user?.user?._id?.toString()),
    [user?.user?._id]
  );

  // Load conversation from product page
  useEffect(() => {
    if (author?._id && !activeConversation) {
      handleSelectConversation(author._id);
    }
  }, [author?._id]);

  // Set initial message
  useEffect(() => {
    if (initialMessage && activeConversation && author?._id) {
      const otherUser = getOtherParticipant(activeConversation);
      if (otherUser?._id?.toString() === author._id?.toString() && message === "") {
        setMessage(initialMessage);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [initialMessage, activeConversation, author, getOtherParticipant, navigate, location.pathname, message]);

  // Mark as read
  useEffect(() => {
    if (activeConversation?._id) {
      markAsRead(activeConversation._id);
    }
  }, [activeConversation, markAsRead]);

  const handleSelectConversation = useCallback(
    async (userId) => {
      if (isLoadingConversation) return;

      const isAlreadyActive = activeConversation?.participants?.some(
        (p) => p._id?.toString() === userId?.toString()
      );

      if (isAlreadyActive) {
        if (isMobile) setShowChatView(true);
        return;
      }

      setIsLoadingConversation(true);
      try {
        await loadConversation(userId);
        if (isMobile) setShowChatView(true);
      } catch (err) {
        toast.error("Failed to load conversation");
      } finally {
        setIsLoadingConversation(false);
      }
    },
    [activeConversation, loadConversation, isMobile, isLoadingConversation]
  );

  const handleBackToList = () => {
    setShowChatView(false);
  };

  const handleSendMessage = useCallback(
    async () => {
      const text = message.trim();
      if (!text || !activeConversation) return;

      const recipientId = getOtherParticipant(activeConversation)?._id;
      if (!recipientId) return;

      setIsSending(true);
      try {
        const success = await socketSendMessage(recipientId, text, activeConversation._id);
        if (success !== false) {
          setMessage("");
          inputRef.current?.focus();
        }
      } catch (err) {
        toast.error("Failed to send message");
      } finally {
        setIsSending(false);
      }
    },
    [message, activeConversation, socketSendMessage, getOtherParticipant]
  );

  const handleScroll = useCallback(
    async () => {
      const el = messagesContainerRef.current;
      if (!el || isLoadingMore || !hasMoreMessages) return;

      if (el.scrollTop === 0 && messages.length > 0) {
        setIsLoadingMore(true);
        previousScrollHeight.current = el.scrollHeight;

        try {
          const oldest = messages[0];
          if (oldest && activeConversation) {
            const older = await loadMoreMessages(activeConversation._id, oldest.createdAt);
            if (older.length === 0) setHasMoreMessages(false);

            setTimeout(() => {
              if (el) {
                el.scrollTop = el.scrollHeight - previousScrollHeight.current;
              }
            }, 100);
          }
        } catch (err) {
          toast.error("Failed to load older messages");
        } finally {
          setIsLoadingMore(false);
        }
      }
    },
    [messages, activeConversation, loadMoreMessages, isLoadingMore, hasMoreMessages]
  );

  useEffect(() => {
    setHasMoreMessages(true);
  }, [activeConversation]);

  const formatTime = useCallback((ts) => new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), []);
  const getMessageStatusIcon = useCallback((msg) => {
    const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
    const currentUserId = user?.user?._id;
    if (senderId?.toString() !== currentUserId?.toString()) return null;
    
    switch (msg.status) {
      case "read": return <span className="ml-1 text-blue-300">✓✓</span>;
      case "delivered": return <span className="ml-1 opacity-70">✓✓</span>;
      case "sent": return <span className="ml-1 opacity-50">✓</span>;
      default: return <span className="ml-1 opacity-30">⏱</span>;
    }
  }, [user?.user?._id]);

  const isUserOnline = useCallback((id) => onlineUsers.includes(id), [onlineUsers]);
  const getUnreadCount = useCallback((conv) => conv.unreadCount?.[user?.user?._id] || 0, [user?.user?._id]);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const other = getOtherParticipant(conv);
    return other?.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    const aTime = new Date(a.lastMessage?.createdAt || a.createdAt);
    const bTime = new Date(b.lastMessage?.createdAt || b.createdAt);
    return bTime - aTime;
  });

  return (
    <AppLayout hideFooter={true}>
      <div className="h-screen flex flex-col bg-white pt-0 md:pt-32">
        {/* Desktop Header */}
        {!isMobile && (
          <div className="bg-white border-b border-gray-200 flex-shrink-0">
            <div className="max-w-7xl mx-auto h-16 flex items-center px-4">
              <h1 className="text-xl font-semibold">Messages</h1>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 flex">
            {/* Chat List - Always visible on desktop, conditional on mobile */}
            <div className={`${isMobile && showChatView ? "hidden" : "w-full md:w-80"} bg-white border-r md:border-r-gray-200 flex flex-col`}>
              {/* Mobile Header for Chat List */}
              {isMobile && (
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                  <h1 className="text-lg font-semibold">Chats</h1>
                </div>
              )}

              {/* Search */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loadingConversations ? (
                  <>
                    <ConversationSkeleton />
                    <ConversationSkeleton />
                    <ConversationSkeleton />
                  </>
                ) : sortedConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <ShoppingBag size={48} className="text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      {searchQuery ? "No conversations found" : "No messages yet"}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => navigate("/")}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors"
                      >
                        Browse Products
                      </button>
                    )}
                  </div>
                ) : (
                  sortedConversations.map((conv) => {
                    const other = getOtherParticipant(conv);
                    const unread = getUnreadCount(conv);
                    const active = activeConversation?._id === conv._id;
                    const online = isUserOnline(other?._id);

                    return (
                      <div
                        key={conv._id}
                        onClick={() => handleSelectConversation(other._id)}
                        className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          active ? "bg-orange-50 border-l-4 border-orange-500" : ""
                        }`}
                      >
                        <div className="relative mr-3">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {other?.username?.[0]?.toUpperCase() || "U"}
                          </div>
                          {online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {other?.username || "Unknown"}
                            </h3>
                            {conv.lastMessage?.createdAt && (
                              <span className="text-xs text-gray-500 ml-2">
                                {formatTime(conv.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-600 truncate">
                              {conv.lastMessage?.text || "No messages yet"}
                            </p>
                            {unread > 0 && (
                              <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                {unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat View - Full width on mobile when shown, side-by-side on desktop */}
            <div className={`${isMobile && !showChatView ? "hidden" : "flex-1"} flex flex-col`}>
              <ChatArea
                activeConversation={activeConversation}
                messages={messages}
                isLoadingConversation={isLoadingConversation}
                isLoadingMore={isLoadingMore}
                hasMoreMessages={hasMoreMessages}
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                isSending={isSending}
                isMobile={isMobile}
                onBack={handleBackToList}
                getOtherParticipant={getOtherParticipant}
                isUserOnline={isUserOnline}
                formatTime={formatTime}
                getMessageStatusIcon={getMessageStatusIcon}
                user={user}
                connectionStatus={connectionStatus}
                reconnectAttempt={reconnectAttempt}
                messagesContainerRef={messagesContainerRef}
                messagesEndRef={messagesEndRef}
                inputRef={inputRef}
                handleScroll={handleScroll}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;