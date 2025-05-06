import React, { useState, useEffect } from "react";
import chatApi from "../api/chatApi";
import userApi from "../../auth/api/userApi";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

const ChatHomePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.filter((user)=>user.id!=localStorage.getItem("userId")));
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // When a user is selected, load conversation and messages
  useEffect(() => {
    if (!selectedUser) return;

    const loadConversation = async () => {
      try {
        setLoading(true);
        // Get current user ID from your auth context or local storage
        const currentUserId = localStorage.getItem("userId");

        // Check if conversation exists between users
        const convResponse = await chatApi.getConversationBetweenUsers(
          currentUserId,
          selectedUser.id
        );

        if (convResponse.data) {
          setConversation(convResponse.data);
          // Load messages for this conversation
          const messagesResponse = await chatApi.getConversationMessages(
            convResponse.data.id
          );
          setMessages(messagesResponse.data);
        } else {
          setConversation(null);
          setMessages([]);
        }
      } catch (err) {
        setError("Failed to load conversation");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [selectedUser]);

  const handleSendMessage = async (content) => {
    try {
      const currentUserId = localStorage.getItem("userId");

      // If no conversation exists, create one first
      if (!conversation) {
        const convResponse = await chatApi.createConversation(
          currentUserId,
          selectedUser.id
        );
        setConversation(convResponse.data);
        const messageResponse = await chatApi.sendMessage(
            currentUserId,
            selectedUser.id,
            content,
            convResponse.data.id
          );
          // Add the new message to our state
          setMessages([...messages, messageResponse.data]);
      }
      // Send the message
      else {
        const messageResponse = await chatApi.sendMessage(
          currentUserId,
          selectedUser.id,
          content,
          conversation.id
        );
        // Add the new message to our state
        setMessages([...messages, messageResponse.data]);
      }
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await chatApi.deleteMessage(messageId);
      setMessages(messages.filter((msg) => msg.id !== messageId));
    } catch (err) {
      setError("Failed to delete message");
      console.error(err);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      const response = await chatApi.updateMessage(messageId, newContent);
      setMessages(
        messages.map((msg) => (msg.id === messageId ? response.data : msg))
      );
    } catch (err) {
      setError("Failed to edit message");
      console.error(err);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[85vh] bg-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Left sidebar - User list */}
      <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/50"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-white/70" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <UserList
            users={filteredUsers}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        </div>
      </div>

      {/* Right side - Chat area */}
      <div className="flex flex-col w-2/3">
        {selectedUser ? (
          <>
            <div className="flex items-center px-4 py-3 bg-white border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{selectedUser.username}</h2>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
            <ChatWindow
              messages={messages}
              selectedUser={selectedUser}
              onDeleteMessage={handleDeleteMessage}
              onEditMessage={handleEditMessage}
              loading={loading}
            />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-indigo-50 p-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Chat</h3>
            <p className="text-gray-500 text-center max-w-md">
              Select a contact from the left to start a conversation. Your messages are private and secure.
            </p>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss error"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHomePage;
