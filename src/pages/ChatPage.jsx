// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useMemo,
//   useCallback,
//   memo,
// } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useSocket } from "../context/SocketContext";
// import { useLocation } from "react-router-dom";
// import {
//   Send,
//   Search,
//   MoreVertical,
//   Phone,
//   Video,
//   Smile,
//   Paperclip,
//   Mic,
//   ArrowLeft,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { ConversationSkeleton } from "../components/SkeletonLoader";

// // Memoized Connection Status Component
// const ConnectionStatus = memo(({ connectionStatus, reconnectAttempt }) => {
//   if (connectionStatus === "connected") return null;

//   const config =
//     connectionStatus === "reconnecting"
//       ? {
//           text: reconnectAttempt > 0
//             ? `Reconnecting... (Attempt ${reconnectAttempt}/5)`
//             : "Reconnecting...",
//           dot: "bg-yellow-500 animate-pulse",
//           textColor: "text-yellow-700",
//           bg: "bg-yellow-50 border-yellow-200",
//         }
//       : connectionStatus === "disconnected"
//       ? {
//           text: "Disconnected",
//           dot: "bg-red-500",
//           textColor: "text-red-700",
//           bg: "bg-red-50 border-red-200",
//         }
//       : {
//           text: "Connecting...",
//           dot: "bg-gray-500",
//           textColor: "text-gray-700",
//           bg: "bg-gray-50 border-gray-200",
//         };

//   return (
//     <div className={`px-3 py-2 border-b ${config.bg}`}>
//       <div className="flex items-center justify-center gap-2">
//         <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
//         <span className={`text-xs font-medium ${config.textColor}`}>
//           {config.text}
//         </span>
//       </div>
//     </div>
//   );
// });

// // Memoized Sidebar
// const ChatSidebar = memo(function ChatSidebar({
//   isMobile,
//   showSidebar,
//   searchQuery,
//   setSearchQuery,
//   sortedConversations,
//   loadingConversations,
//   handleSelectConversation,
//   getOtherParticipant,
//   isUserOnline,
//   getUnreadCount,
//   activeConversation,
//   user,
// }) {
//   return (
//     <div
//       className={`${
//         isMobile && !showSidebar ? "hidden" : "block"
//       } w-80 bg-white border-r border-gray-200 flex flex-col h-full`}
//     >
//       {/* Header */}
//       <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <h1 className="text-lg font-semibold text-gray-800">Chats</h1>
//           <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
//             <MoreVertical size={18} className="text-gray-600" />
//           </button>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="px-3 py-2 bg-white border-b border-gray-100">
//         <div className="relative">
//           <Search
//             size={16}
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//           />
//           <input
//             type="text"
//             placeholder="Search chats"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-3 py-1.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//           />
//         </div>
//       </div>

//       {/* Conversations List */}
//       <div className="flex-1 overflow-y-auto">
//         {loadingConversations ? (
//           <>
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//           </>
//         ) : sortedConversations.length === 0 ? (
//           <div className="py-8 px-4 text-center text-xs text-gray-500">
//             {searchQuery ? "No conversations found" : "No chats yet. Start messaging!"}
//           </div>
//         ) : (
//           sortedConversations.map((conv) => {
//             const other = getOtherParticipant(conv);
//             const unread = getUnreadCount(conv);
//             const active = activeConversation?._id === conv._id;
//             const online = isUserOnline(other?._id);

//             return (
//               <div
//                 key={conv._id}
//                 onClick={() => handleSelectConversation(other?._id)}
//                 className={`flex items-center px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 ${
//                   active
//                     ? "bg-orange-50 border-l-4 border-l-orange-500"
//                     : "hover:bg-gray-50"
//                 }`}
//               >
//                 <div className="relative mr-3">
//                   <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//                     {other?.username?.[0]?.toUpperCase() || "U"}
//                   </div>
//                   {online && (
//                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                   )}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-1">
//                     <h3 className="font-medium text-gray-900 truncate text-sm">
//                       {other?.username || "Unknown"}
//                     </h3>
//                     {conv.lastMessage?.createdAt && (
//                       <span className="text-xs text-gray-500 ml-2">
//                         {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <p className="text-xs text-gray-600 truncate">
//                       {conv.lastMessage?.text || "No messages yet"}
//                     </p>
//                     {unread > 0 && (
//                       <span className="ml-2 bg-orange-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 min-w-[20px] text-center">
//                         {unread > 99 ? "99+" : unread}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// });

// // Memoized Chat Area
// const ChatArea = memo(function ChatArea({
//   activeConversation,
//   messages,
//   isLoadingConversation,
//   isLoadingMore,
//   hasMoreMessages,
//   message,
//   setMessage,
//   handleSendMessage,
//   isSending,
//   failedMessages,
//   isMobile,
//   showSidebar,
//   setShowSidebar,
//   getOtherParticipant,
//   isUserOnline,
//   formatTime,
//   getMessageStatusIcon,
//   user,
//   ConnectionStatus,
//   messagesContainerRef,
//   messagesEndRef,
//   inputRef,
//   handleScroll,
// }) {
//   if (!activeConversation) {
//     return (
//       <div
//         className={`${
//           isMobile && showSidebar ? "hidden" : "flex"
//         } flex-1 flex items-center justify-center h-full bg-gray-50`}
//       >
//         <div className="text-center">
//           <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Send size={40} className="text-gray-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">
//             Select a conversation
//           </h3>
//           <p className="text-sm text-gray-500">
//             Choose someone from the sidebar to start chatting
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const otherUser = getOtherParticipant(activeConversation);
//   const online = isUserOnline(otherUser?._id);

//   return (
//     <div
//       className={`${
//         isMobile && showSidebar ? "hidden" : "flex"
//       } flex-1 flex flex-col h-full bg-gray-50`}
//     >
//       <ConnectionStatus />

//       {/* Header */}
//       <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
//         <div className="flex items-center">
//           {isMobile && (
//             <button
//               onClick={() => setShowSidebar(true)}
//               className="p-2 hover:bg-gray-100 rounded-full mr-2"
//             >
//               <ArrowLeft size={20} className="text-gray-600" />
//             </button>
//           )}
//           <div className="relative mr-3">
//             <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
//               {otherUser?.username?.[0]?.toUpperCase() || "U"}
//             </div>
//             {online && (
//               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
//             )}
//           </div>
//           <div>
//             <h2 className="font-semibold text-gray-900">
//               {otherUser?.username || "User"}
//             </h2>
//             <p className="text-xs text-gray-500">{online ? "Online" : "Offline"}</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-1">
//           <button className="p-2 hover:bg-gray-100 rounded-full">
//             <Video size={18} className="text-gray-600" />
//           </button>
//           <button className="p-2 hover:bg-gray-100 rounded-full">
//             <Phone size={18} className="text-gray-600" />
//           </button>
//           <button className="p-2 hover:bg-gray-100 rounded-full">
//             <MoreVertical size={18} className="text-gray-600" />
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div
//         ref={messagesContainerRef}
//         onScroll={handleScroll}
//         className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
//       >
//         {isLoadingConversation ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
//               <p className="text-sm text-gray-500">Loading messages...</p>
//             </div>
//           </div>
//         ) : (
//           <>
//             {isLoadingMore && (
//               <div className="flex justify-center py-2">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
//               </div>
//             )}
//             {!hasMoreMessages && messages.length > 0 && (
//               <div className="text-center py-2 text-xs text-gray-400">
//                 No more messages
//               </div>
//             )}

//             {messages.length === 0 ? (
//               <div className="flex items-center justify-center h-full text-gray-500">
//                 No messages yet. Say hello! 👋
//               </div>
//             ) : (
//               messages.map((msg, i) => {
//                 const isOwn = (msg.senderId?._id || msg.senderId) === user?.user?._id;
//                 const prevMsg = messages[i - 1];
//                 const showDateDivider =
//                   !prevMsg ||
//                   new Date(prevMsg.createdAt).toDateString() !==
//                     new Date(msg.createdAt).toDateString();

//                 return (
//                   <div key={msg._id}>
//                     {showDateDivider && (
//                       <div className="flex justify-center my-6">
//                         <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
//                           {new Date(msg.createdAt).toLocaleDateString([], {
//                             weekday: "short",
//                             month: "short",
//                             day: "numeric",
//                           })}
//                         </span>
//                       </div>
//                     )}
//                     <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
//                       <div
//                         className={`max-w-xs md:max-w-md px-3 py-2 rounded-lg relative ${
//                           isOwn
//                             ? "bg-orange-500 text-white rounded-br-none"
//                             : "bg-white text-gray-900 rounded-bl-none shadow-sm border"
//                         }`}
//                       >
//                         <p className="text-sm leading-relaxed break-words">{msg.text}</p>
//                         <div
//                           className={`text-xs mt-1 flex items-center justify-end gap-1 ${
//                             isOwn ? "text-orange-100" : "text-gray-500"
//                           }`}
//                         >
//                           <span>{formatTime(msg.createdAt)}</span>
//                           {getMessageStatusIcon(msg)}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//             <div ref={messagesEndRef} />
//           </>
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="bg-white px-4 py-3 border-t border-gray-200">
//         {Object.keys(failedMessages).length > 0 && (
//           <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
//             <p className="text-xs text-red-600">
//               {Object.keys(failedMessages).length} message(s) failed
//             </p>
//             <button
//               onClick={() =>
//                 Object.entries(failedMessages).forEach(([id, data]) =>
//                   handleSendMessage(id, data.text)
//                 )
//               }
//               className="text-xs text-red-600 font-medium hover:text-red-700"
//             >
//               Retry All
//             </button>
//           </div>
//         )}

//         <div className="flex items-center space-x-2">
//           <button disabled={isSending} className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50">
//             <Smile size={18} className="text-gray-500" />
//           </button>
//           <button disabled={isSending} className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50">
//             <Paperclip size={18} className="text-gray-500" />
//           </button>

//           <div className="flex-1">
//             <input
//               ref={inputRef}
//               type="text"
//               placeholder={isSending ? "Sending..." : "Type a message"}
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
//               className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//           </div>

//           {message.trim() ? (
//             <button
//               onClick={() => handleSendMessage()}
//               disabled={isSending}
//               className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 p-2 rounded-full text-white transition-colors"
//             >
//               {isSending ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//               ) : (
//                 <Send size={18} />
//               )}
//             </button>
//           ) : (
//             <button disabled={isSending} className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50">
//               <Mic size={18} className="text-gray-500" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// });

// const ChatPage = () => {
//   const location = useLocation();
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

//   const author = location.state;

//   const [message, setMessage] = useState("");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoadingConversation, setIsLoadingConversation] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [hasMoreMessages, setHasMoreMessages] = useState(true);
//   const [isSending, setIsSending] = useState(false);
//   const [failedMessages, setFailedMessages] = useState({}); // ← Plain object!

//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const inputRef = useRef(null);
//   const previousScrollHeight = useRef(0);

//   // Mobile detection
//   useEffect(() => {
//     const check = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       setShowSidebar(!mobile);
//     };
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   // Open conversation from product page
//   useEffect(() => {
//     if (author?._id) {
//       handleSelectConversation(author._id);
//     }
//   }, [author]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Mark as read
//   useEffect(() => {
//     if (activeConversation?._id) {
//       markAsRead(activeConversation._id);
//     }
//   }, [activeConversation, markAsRead]);

//   const handleSelectConversation = useCallback(async (userId) => {
//     setIsLoadingConversation(true);
//     try {
//       await loadConversation(userId);
//       if (isMobile) setShowSidebar(false);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load chat");
//     } finally {
//       setIsLoadingConversation(false);
//     }
//   }, [loadConversation, isMobile]);

//   const handleSendMessage = useCallback(async (retryId = null, retryText = null) => {
//     const text = (retryText || message).trim();
//     if (!text || !activeConversation) return;

//     const recipientId = activeConversation.participants.find(p => p._id !== user?.user?._id)?._id;
//     if (!recipientId) return toast.error("Recipient missing");

//     setIsSending(true);
//     if (retryId) {
//       setFailedMessages(prev => {
//         const { [retryId]: _, ...rest } = prev;
//         return rest;
//       });
//     }

//     try {
//       await socketSendMessage(recipientId, text);
//       if (!retryId) setMessage("");
//       inputRef.current?.focus();
//     } catch (err) {
//       const tempId = retryId || `failed-${Date.now()}`;
//       setFailedMessages(prev => ({
//         ...prev,
//         [tempId]: { text, recipientId, timestamp: new Date() },
//       }));
//       toast.error(
//         <div className="flex items-center justify-between gap-4">
//           <span>Failed to send</span>
//           <button
//             onClick={() => handleSendMessage(tempId, text)}
//             className="text-xs bg-white text-orange-600 px-2 py-1 rounded"
//           >
//             Retry
//           </button>
//         </div>,
//         { duration: 6000 }
//       );
//     } finally {
//       setIsSending(false);
//     }
//   }, [message, activeConversation, user?.user?._id, socketSendMessage]);

//   const handleScroll = useCallback(async () => {
//     const el = messagesContainerRef.current;
//     if (!el || isLoadingMore || !hasMoreMessages || el.scrollTop > 100) return;

//     setIsLoadingMore(true);
//     previousScrollHeight.current = el.scrollHeight;

//     try {
//       const oldest = messages[0];
//       if (oldest) {
//         const older = await loadMoreMessages(activeConversation._id, new Date(oldest.createdAt));
//         if (older.length === 0) setHasMoreMessages(false);
//         else {
//           setTimeout(() => {
//             el.scrollTop = el.scrollHeight - previousScrollHeight.current;
//           }, 0);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoadingMore(false);
//     }
//   }, [messages, activeConversation, isLoadingMore, hasMoreMessages, loadMoreMessages]);

//   useEffect(() => {
//     setHasMoreMessages(true);
//   }, [activeConversation]);

//   const formatTime = useCallback((ts) => {
//     return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   }, []);

//   const getMessageStatusIcon = useCallback((msg) => {
//     if ((msg.senderId?._id || msg.senderId) !== user?.user?._id) return null;
//     switch (msg.status) {
//       case "read": return <span className="ml-1 opacity-90">✓✓</span>;
//       case "delivered": return <span className="ml-1 opacity-70">✓✓</span>;
//       case "sent": return <span className="ml-1 opacity-70">✓</span>;
//       default: return <span className="ml-1 opacity-50">○</span>;
//     }
//   }, [user?.user?._id]);

//   const getOtherParticipant = useCallback((conv) => {
//     return conv.participants.find(p => p._id !== user?.user?._id);
//   }, [user?.user?._id]);

//   const isUserOnline = useCallback((id) => onlineUsers.includes(id), [onlineUsers]);

//   const getUnreadCount = useCallback((conv) => {
//     return conv.unreadCount?.[user?.user?._id] || 0;
//   }, [user?.user?._id]);

//   const filteredConversations = useMemo(() => {
//     if (!searchQuery.trim()) return conversations;
//     const q = searchQuery.toLowerCase();
//     return conversations.filter(conv => {
//       const other = getOtherParticipant(conv);
//       return (
//         other?.username?.toLowerCase().includes(q) ||
//         other?.email?.toLowerCase().includes(q)
//       );
//     });
//   }, [conversations, searchQuery, getOtherParticipant]);

//   const sortedConversations = useMemo(() => {
//     return [...filteredConversations].sort((a, b) => {
//       const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(a.updatedAt);
//       const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(b.updatedAt);
//       return bTime - aTime;
//     });
//   }, [filteredConversations]);

//   return (
//     <div className="w-full h-screen overflow-hidden flex flex-col font-poppins bg-gray-100">
//       {/* Header */}
//       <div className="flex-shrink-0 bg-white border-b">
//         <div className="max-w-7xl mx-auto h-16 flex items-center px-4">
//           <h1 className="text-xl font-semibold">Messages</h1>
//         </div>
//       </div>

//       {/* Main Chat */}
//       <div className="flex-1 overflow-hidden">
//         <div className="h-full max-w-7xl mx-auto flex">
//           <ChatSidebar
//             isMobile={isMobile}
//             showSidebar={showSidebar}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             sortedConversations={sortedConversations}
//             loadingConversations={loadingConversations}
//             handleSelectConversation={handleSelectConversation}
//             getOtherParticipant={getOtherParticipant}
//             isUserOnline={isUserOnline}
//             getUnreadCount={getUnreadCount}
//             activeConversation={activeConversation}
//             user={user}
//           />
//           <ChatArea
//             activeConversation={activeConversation}
//             messages={messages}
//             isLoadingConversation={isLoadingConversation}
//             isLoadingMore={isLoadingMore}
//             hasMoreMessages={hasMoreMessages}
//             message={message}
//             setMessage={setMessage}
//             handleSendMessage={handleSendMessage}
//             isSending={isSending}
//             failedMessages={failedMessages}
//             isMobile={isMobile}
//             showSidebar={showSidebar}
//             setShowSidebar={setShowSidebar}
//             getOtherParticipant={getOtherParticipant}
//             isUserOnline={isUserOnline}
//             formatTime={formatTime}
//             getMessageStatusIcon={getMessageStatusIcon}
//             user={user}
//             ConnectionStatus={(props) => (
//               <ConnectionStatus
//                 {...props}
//                 connectionStatus={connectionStatus}
//                 reconnectAttempt={reconnectAttempt}
//               />
//             )}
//             messagesContainerRef={messagesContainerRef}
//             messagesEndRef={messagesEndRef}
//             inputRef={inputRef}
//             handleScroll={handleScroll}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useLocation } from "react-router-dom";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { ConversationSkeleton } from "../components/SkeletonLoader";

// ──────────────────────────────────────────────────────────────
// Connection Status (unchanged)
const ConnectionStatus = memo(({ connectionStatus, reconnectAttempt }) => {
  if (connectionStatus === "connected") return null;

  const config =
    connectionStatus === "reconnecting"
      ? { text: `Reconnecting... ${reconnectAttempt > 0 ? `(Attempt ${reconnectAttempt}/5)` : ""}`, dot: "bg-yellow-500 animate-pulse", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" }
      : connectionStatus === "disconnected"
      ? { text: "Disconnected", dot: "bg-red-500", color: "text-red-700", bg: "bg-red-50 border-red-200" }
      : { text: "Connecting...", dot: "bg-gray-500", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" };

  return (
    <div className={`px-3 py-2 border-b ${config.bg}`}>
      <div className="flex items-center justify-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
        <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>
      </div>
    </div>
  );
});

// ──────────────────────────────────────────────────────────────
// ChatSidebar – only re-renders when conversations or search change
const ChatSidebar = memo(function ChatSidebar({
  isMobile,
  showSidebar,
  searchQuery,
  setSearchQuery,
  sortedConversations,
  loadingConversations,
  handleSelectConversation,
  getOtherParticipant,
  isUserOnline,
  getUnreadCount,
  activeConversation,
  user,
}) {
  // ... same as before (no changes needed here)
  // Keep your existing JSX
});

// ──────────────────────────────────────────────────────────────
// ChatArea – Critical Fix: Custom comparison to detect new messages
const ChatArea = memo(function ChatArea({
  activeConversation,
  messages,
  isLoadingConversation,
  isLoadingMore,
  hasMoreMessages,
  message,
  setMessage,
  handleSendMessage,
  isSending,
  failedMessages,
  isMobile,
  setShowSidebar,
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
  // ... your existing JSX (unchanged)
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if something meaningful changed
  if (prevProps.activeConversation?._id !== nextProps.activeConversation?._id) return false;
  if (prevProps.messages !== nextProps.messages) return false; // This is the key!
  if (prevProps.isLoadingConversation !== nextProps.isLoadingConversation) return false;
  if (prevProps.message !== nextProps.message) return false;
  if (prevProps.isSending !== nextProps.isSending) return false;
  if (prevProps.connectionStatus !== nextProps.connectionStatus) return false;
  if (prevProps.failedMessages !== nextProps.failedMessages) return false;

  return true; // All props same → skip render
});

// ──────────────────────────────────────────────────────────────
// Main ChatPage – Now with real-time auto-scroll fix
const ChatPage = () => {
  const location = useLocation();
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

  const author = location.state;

  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [failedMessages, setFailedMessages] = useState({});

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const previousScrollHeight = useRef(0);

  // ───── Auto-scroll when new message arrives (incoming or outgoing) ─────
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Small delay ensures DOM is updated

    return () => clearTimeout(timer);
  }, [messages]); // This triggers on every new message!

  // Mobile detection
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Open from product page
  useEffect(() => {
    if (author?._id && !activeConversation) {
      handleSelectConversation(author._id);
    }
  }, [author, activeConversation]);

  // Mark as read
  useEffect(() => {
    if (activeConversation?._id) {
      markAsRead(activeConversation._id);
    }
  }, [activeConversation]);

  const handleSelectConversation = useCallback(async (userId) => {
    if (activeConversation?.participants?.some(p => p._id === userId)) return; // Already open

    setIsLoadingConversation(true);
    try {
      await loadConversation(userId);
      if (isMobile) setShowSidebar(false);
    } catch (err) {
      toast.error("Failed to load conversation");
    } finally {
      setIsLoadingConversation(false);
    }
  }, [activeConversation, loadConversation, isMobile]);

  const handleSendMessage = useCallback(async (retryId = null, retryText = null) => {
    const text = (retryText || message).trim();
    if (!text || !activeConversation) return;

    const recipientId = activeConversation.participants.find(p => p._id !== user?.user?._id)?._id;
    if (!recipientId) return;

    setIsSending(true);
    if (retryId) {
      setFailedMessages(prev => {
        const { [retryId]: _, ...rest } = prev;
        return rest;
      });
    }

    try {
      await socketSendMessage(recipientId, text);
      if (!retryId) setMessage("");
      inputRef.current?.focus();
    } catch (err) {
      const tempId = retryId || `failed-${Date.now()}`;
      setFailedMessages(prev => ({
        ...prev,
        [tempId]: { text, recipientId },
      }));
      toast.error("Failed to send • Retry", { duration: 5000 });
    } finally {
      setIsSending(false);
    }
  }, [message, activeConversation, user, socketSendMessage]);

  // Load more messages on scroll up
  const handleScroll = useCallback(async () => {
    const el = messagesContainerRef.current;
    if (!el || isLoadingMore || !hasMoreMessages || el.scrollTop > 100) return;

    setIsLoadingMore(true);
    previousScrollHeight.current = el.scrollHeight;

    try {
      const oldest = messages[0];
      if (oldest && activeConversation) {
        const older = await loadMoreMessages(activeConversation._id, new Date(oldest.createdAt));
        if (older.length === 0) setHasMoreMessages(false);
        else {
          setTimeout(() => {
            el.scrollTop = el.scrollHeight - previousScrollHeight.current + 20;
          }, 0);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [messages, activeConversation, isLoadingMore, hasMoreMessages, loadMoreMessages]);

  useEffect(() => {
    setHasMoreMessages(true);
  }, [activeConversation]);

  // Helper functions (memoized)
  const formatTime = useCallback((ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), []);
  const getMessageStatusIcon = useCallback((msg) => {
    if ((msg.senderId?._id || msg.senderId) !== user?.user?._id) return null;
    switch (msg.status) {
      case "read": return <span className="ml-1">✓✓</span>;
      case "delivered": return <span className="ml-1 opacity-70">✓✓</span>;
      case "sent": return <span className="ml-1 opacity-70">✓</span>;
      default: return <span className="ml-1 opacity-50">○</span>;
    }
  }, [user?.user?._id]);

  const getOtherParticipant = useCallback((conv) => conv.participants.find(p => p._id !== user?.user?._id), [user]);
  const isUserOnline = useCallback((id) => onlineUsers.includes(id), [onlineUsers]);
  const getUnreadCount = useCallback((conv) => conv.unreadCount?.[user?.user?._id] || 0, [user]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(conv => {
      const other = getOtherParticipant(conv);
      return other?.username?.toLowerCase().includes(q) || other?.email?.toLowerCase().includes(q);
    });
  }, [conversations, searchQuery, getOtherParticipant]);

  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(a.updatedAt);
      const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(b.updatedAt);
      return bTime - aTime;
    });
  }, [filteredConversations]);

  // ───── Render ─────
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col font-poppins bg-gray-100">
      <div className="flex-shrink-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto h-16 flex items-center px-4">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto flex">
          <ChatSidebar
            isMobile={isMobile}
            showSidebar={showSidebar}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortedConversations={sortedConversations}
            loadingConversations={loadingConversations}
            handleSelectConversation={handleSelectConversation}
            getOtherParticipant={getOtherParticipant}
            isUserOnline={isUserOnline}
            getUnreadCount={getUnreadCount}
            activeConversation={activeConversation}
            user={user}
          />

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
            failedMessages={failedMessages}
            isMobile={isMobile}
            setShowSidebar={setShowSidebar}
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
  );
};

export default ChatPage;